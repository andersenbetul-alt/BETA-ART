// HXI yayın öncesi tarayıcı doğrulaması.
// Kullanım: hxi-sayfalar'ı 4400 portunda servis et, sonra bu betiği
// playwright kurulu bir dizinden çalıştır (bkz. SKILL.md).
import { createRequire } from 'module';
// playwright, betiğin durduğu yerden değil, çalıştırıldığı dizinden çözülür —
// beceri klasörüne node_modules koymamak için.
const require = createRequire(process.cwd() + '/');
const { chromium } = require('playwright');

const base = process.env.HXI_BASE || 'http://localhost:4400';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let hataSayisi = 0;
const hata = (g, mesaj) => { hataSayisi++; console.log(`[${g}] HATA: ${mesaj}`); };

for (const [ad, yol, vp] of [
  ['tr-masaustu', '/tr/', { width: 1440, height: 900 }],
  ['en-masaustu', '/en/', { width: 1440, height: 900 }],
  ['ar-masaustu', '/ar/', { width: 1440, height: 900 }],
  ['tr-mobil', '/tr/', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const oncekiHata = hataSayisi;
  const konsol = [];
  page.on('console', m => { if (m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', e => konsol.push('PAGEERROR: ' + e.message));
  await page.goto(base + yol, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);

  const v = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    kirikCapa: [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute('href'))
      .filter(h => h.length > 1 && !document.querySelector(h)),
    yatayTasma: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    eksikGorsel: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src),
    h1Top: document.querySelector('#hero-title')?.getBoundingClientRect().top ?? -1,
  }));

  if (konsol.length) hata(ad, 'konsol: ' + konsol.slice(0, 3).join(' | '));
  if (v.kirikCapa.length) hata(ad, 'kırık çapa: ' + v.kirikCapa.join(','));
  if (v.yatayTasma) hata(ad, 'yatay taşma var');
  if (v.eksikGorsel.length) hata(ad, 'yüklenmeyen görsel: ' + v.eksikGorsel.join(','));
  if (ad === 'ar-masaustu' && v.dir !== 'rtl') hata(ad, `dir=${v.dir}, rtl bekleniyordu`);
  if (ad === 'tr-mobil' && (v.h1Top < 0 || v.h1Top > 700)) {
    hata(ad, `başlık ilk ekranda değil (top=${Math.round(v.h1Top)})`);
  }
  if (hataSayisi === oncekiHata) console.log(`[${ad}] temiz`);
  await ctx.close();
}
await browser.close();
console.log(hataSayisi ? `SONUÇ: ${hataSayisi} HATA — push'lama!` : 'SONUÇ: tüm kontroller temiz');
process.exit(hataSayisi ? 1 : 0);
