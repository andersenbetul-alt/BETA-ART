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

// İstemci davranışları (vanilya). Üç iş + cihaz-üstü öneri:
//  - oynatıcı kapısı, dil menüsü kaydı (eskiden beri),
//  - ilgi sayacı: parça/release tıklaması localStorage'da 'hxi-affinity'de
//    sayılır; hiçbir veri tarayıcıdan ÇIKMAZ (gizlilik sözü: davranış
//    analitiği yok — bu sunucusuz, kimliksiz, cihaz-içi kişiselleştirme,
//    tema/dil tercihiyle aynı kategori). En çok tıklanan release'ler
//    #foryou şeridine "senin için" olarak dizilir.
const VANILYA = `<script>(function(){\
var AF='hxi-affinity';\
function load(){try{return JSON.parse(localStorage.getItem(AF)||'{}')||{}}catch(x){return{}}}\
function bump(n){if(!n)return;try{var m=load();m[n]=(m[n]||0)+1;localStorage.setItem(AF,JSON.stringify(m))}catch(x){}}\
function render(){\
var box=document.querySelector('[data-foryou]');if(!box)return;\
var m=load();var keys=Object.keys(m).filter(function(k){return m[k]>0});\
if(!keys.length)return;\
keys.sort(function(a,b){return m[b]-m[a]});\
var cards={};document.querySelectorAll('.release-card[data-rel]').forEach(function(c){cards[c.getAttribute('data-rel')]=c.getAttribute('href')});\
var list=box.querySelector('[data-foryou-list]');if(!list)return;list.innerHTML='';\
var shown=0;\
keys.forEach(function(k){if(shown>=4)return;var href=cards[k];if(!href)return;\
var a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';\
a.innerHTML='<span class=\\'num\\'>'+String(shown+1).padStart(2,'0')+'</span>'+k;\
list.appendChild(a);shown++});\
if(shown){box.hidden=false}}\
document.addEventListener('click',function(e){\
var b=e.target.closest('.player-gate button');\
if(b){var g=b.closest('.player-gate');bump(g&&g.getAttribute('data-rel'));var d=document.createElement('div');d.className='player-slot';d.setAttribute('aria-live','polite');\
d.innerHTML='<iframe title="Spotify — help urself by HXI" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/track/54ggxbEopZwQ20zurJiHSD?utm_source=generator"></iframe>';\
g.replaceWith(d);return;}\
var r=e.target.closest('[data-rel]');\
if(r){bump(r.getAttribute('data-rel'));render();}\
var l=e.target.closest('.langmenu a');\
if(l){try{localStorage.setItem('hxi-lang',(l.getAttribute('href')||'').split('/')[1])}catch(x){}}\
});\
if(document.readyState!=='loading')render();else document.addEventListener('DOMContentLoaded',render);\
})();</script>`;

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
