#!/usr/bin/env node
/* qblogg-sayfa-iskeleti — menü ve altbilgi iskeletinin sekiz sayfada
 * tutarlılığını denetler. `npm run check` çiftlenen id/script yakalar ama
 * eksik menü bağlantısını yakalamaz (CLAUDE.md madde 6) — bu betik o boşluğu
 * kapatır. Bağımlılık yok.
 *
 * Kullanım (repo kökünden): node .claude/skills/qblogg-sayfa-iskeleti/scripts/kontrol-iskelet.mjs
 */
import { readFileSync, existsSync } from 'node:fs';

const ROOT = process.cwd();
// 404.html kasıtlı hariç: kendi başına bir sayfa, header/footer taşımıyor.
const PAGES = ['index.html', 'work.html', 'blog.html', 'post.html', 'gizlilik.html', 'kosullar.html', 'kalite.html', 'ornek.html'];

const read = (f) => readFileSync(`${ROOT}/${f}`, 'utf8');

const extract = (html, tag) => {
  const re = tag === 'nav'
    ? /<nav class="nav-links"[^>]*>[\s\S]*?<\/nav>/
    : /<h3 data-i18n="footer\.nav">[\s\S]*?<\/ul>/;
  return html.match(re)?.[0] ?? null;
};

/* İki bilinen kasıtlı fark var, hata sayılmaz — karşılaştırma öncesi normalize edilir:
   1) aria-current="page": hangi sayfada olduğuna göre farklı öğede durur.
   2) index.html kendi bölümlerine çıplak çapa kullanır (#services); diğer yedi
      sayfada aynı bağlantı index.html#services olmak zorunda. */
const normalize = (block, file) => {
  let n = block.replace(/\s+aria-current="page"/g, '');
  if (file === 'index.html') {
    n = n.replace(/href="#(services|flow|packages)"/g, 'href="index.html#$1"');
  }
  return n;
};

let bad = 0;
const referans = {
  nav: normalize(extract(read('index.html'), 'nav'), 'index.html'),
  footer: normalize(extract(read('index.html'), 'footer'), 'index.html'),
};

for (const file of PAGES) {
  if (!existsSync(`${ROOT}/${file}`)) { console.log(`  ✗ ${file}: dosya yok`); bad++; continue; }
  const html = read(file);
  for (const [ad, tag] of [['menü', 'nav'], ['altbilgi', 'footer']]) {
    const blok = extract(html, tag);
    if (!blok) { console.log(`  ✗ ${file}: ${ad} bloğu bulunamadı (yapı değişmiş olabilir)`); bad++; continue; }
    if (normalize(blok, file) !== referans[tag]) {
      console.log(`  ✗ ${file}: ${ad} index.html'den farklı`);
      bad++;
    }
  }
}

if (bad) {
  console.log(`\n${bad} fark bulundu — index.html referans alınıp diğer sayfalar düzeltilmeli.`);
  process.exit(1);
}
console.log(`✓ ${PAGES.length} sayfada menü ve altbilgi tutarlı (bilinen iki kasıtlı fark hariç: index.html çapaları, aria-current konumu).`);
