// Next.js dışa aktarımını saf statik HTML'e inceltir.
// Neden: sitenin tek istemci ihtiyacı üç küçük davranış (Spotify oynatıcı
// kapısı, dil menüsü kaydı) — Next hidrasyon JS'i (~130 KB gz) bunlar için
// gereksiz yük. Bu betik out/ içindeki her sayfadan Next script'lerini söker,
// yerine ~1,5 KB'lık vanilya betiği koyar. JSON-LD dokunulmaz.
// Kullanım: node statik-incelt.mjs <out-dizini>
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const kok = process.argv[2];
if (!kok) { console.error('kullanım: node statik-incelt.mjs <out-dizini>'); process.exit(1); }

const VANILYA = `<script>document.addEventListener('click',function(e){\
var b=e.target.closest('.player-gate button');\
if(b){var g=b.closest('.player-gate');var d=document.createElement('div');d.className='player-slot';d.setAttribute('aria-live','polite');\
d.innerHTML='<iframe title="Spotify — help urself by HXI" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/track/54ggxbEopZwQ20zurJiHSD?utm_source=generator"></iframe>';\
g.replaceWith(d);return;}\
var l=e.target.closest('.langmenu a');\
if(l){try{localStorage.setItem('hxi-lang',(l.getAttribute('href')||'').split('/')[1])}catch(x){}}\
});</script>`;

let dosya = 0, oncekiToplam = 0, sonrakiToplam = 0;
const htmlDosyalari = readdirSync(kok, { recursive: true })
  .filter(y => String(y).endsWith('.html'));
for (const yol of htmlDosyalari) {
  const tam = join(kok, String(yol));
  let h = readFileSync(tam, 'utf8');
  const once = h.length;
  // JSON-LD hariç tüm script'ler: Next chunk'ları, RSC yükü, webpack
  h = h.replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, '');
  // JS önyükleme ipuçları
  h = h.replace(/<link[^>]*rel="preload"[^>]*as="script"[^>]*\/>/g, '');
  h = h.replace(/<link[^>]*as="script"[^>]*rel="preload"[^>]*\/>/g, '');
  // hidrasyon tutucusu
  h = h.replace('<div hidden=""><!--\$--><!--/\$--></div>', '');
  // vanilya davranışlar (yalnız oynatıcı kapısı olan sayfalara)
  if (h.includes('player-gate')) h = h.replace('</body>', VANILYA + '</body>');
  writeFileSync(tam, h);
  dosya++; oncekiToplam += once; sonrakiToplam += h.length;
}
console.log(`${dosya} dosya inceltildi: ${Math.round(oncekiToplam/1024)} KB → ${Math.round(sonrakiToplam/1024)} KB (HTML)`);
console.log('Not: _next/static JS parçaları artık hiçbir sayfadan çağrılmıyor.');
