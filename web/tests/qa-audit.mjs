/**
 * Tarayıcı tabanlı kalite denetimi: erişilebilirlik (axe-core, WCAG 2.1 AA),
 * konsol hataları, kırık iç bağlantı ve mobil yatay taşma.
 *
 * Kullanım:
 *   npm run build && npx next start -p 3300 &
 *   npm run qa
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3300';
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const PAGES = [
  '/no', '/en', '/tr',
  '/no/urunler', '/tr/urunler?kategori=skjonnhet&sirala=fiyat-artan',
  '/no/urunler/merinoull-skjerf', '/no/urunler/stearinlys-3pk',
  '/no/sepet', '/no/kurumsal', '/tr/kurumsal/iade', '/no/kurumsal/satis',
];
const WIDTHS = [320, 375, 414, 768, 1280];

let failures = 0;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? undefined });

// 1 — erişilebilirlik ve konsol
console.log('=== ERİŞİLEBİLİRLİK (WCAG 2.1 AA) + KONSOL ===');
const links = new Set();
for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const { violations } = await page.evaluate(() =>
    window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }));

  for (const v of violations) {
    failures++;
    console.log(`❌ [${v.impact}] ${v.id} — ${path}`);
    console.log(`   ${v.nodes[0]?.html?.slice(0, 100)}`);
  }
  for (const e of errors) { failures++; console.log(`❌ konsol — ${path}: ${e}`); }

  for (const href of await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))) {
    if (href && /^\/(?!\/)/.test(href)) links.add(href);
  }
  await page.close();
}
console.log(failures ? '' : '✅ ihlal ve konsol hatası yok');

// 2 — kırık iç bağlantı
console.log('\n=== İÇ BAĞLANTILAR ===');
let broken = 0;
for (const href of [...links].sort()) {
  const res = await fetch(BASE + href, { redirect: 'follow' });
  if (res.status >= 400) { broken++; failures++; console.log(`❌ ${res.status} ${href}`); }
}
if (!broken) console.log(`✅ ${links.size} benzersiz bağlantı, kırık yok`);

// 3 — mobil yatay taşma
console.log('\n=== YATAY TAŞMA ===');
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, isMobile: width < 768 });
  await page.goto(BASE + '/no', { waitUntil: 'networkidle' });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (scrollWidth > width) { failures++; console.log(`❌ ${width}px → ${scrollWidth}px taşma`); }
  else console.log(`✅ ${width}px`);
  await page.close();
}

await browser.close();
console.log(`\n${failures ? `❌ ${failures} sorun bulundu` : '✅ tüm denetimler geçti'}`);
process.exit(failures ? 1 : 0);
