#!/usr/bin/env node
/* QBLOGG — EUIPO şekil markası başvuru dosyası üretir.
 *
 *   node scripts/marka-tescil.mjs
 *
 * EUIPO şekil markası görselini biçim şartlarına bağlıyor: JPEG, en fazla
 * 2835×2010 piksel, 96–300 DPI, RGB, progressive olmayan, 2 MB altı. Görsel
 * sicilde 250×250'ye ölçekleniyor, yani markanın o boyutta ayakta kalması
 * gerekiyor — üretici bunu da ayrıca kaydediyor.
 *
 * Kaynak SVG'dir; JPEG ondan türetilir. Elle Photoshop'tan geçirilmiş bir
 * dosya başvuruya konmaz: tescil edilen görsel ile yayınlanan görsel aynı
 * geometriden çıkmalı.
 *
 * Çıktı: tescil/  (git'te izlenmiyor — üretilen dosya)
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

/* Playwright package.json'a eklenmiyor: siteyi bağımlılıksız tutma kuralı.
   Ortamda kurulu olan sürüm çalışma anında bulunur. ESM `NODE_PATH`'i
   dikkate almadığı için çözüm createRequire ile yapılıyor. */
function playwrightBul() {
  const denenen = [];
  for (const kok of [import.meta.url, 'file:///opt/node22/lib/node_modules/x.js', 'file:///usr/lib/node_modules/x.js']) {
    try { return createRequire(kok)('playwright'); } catch (e) { denenen.push(kok); }
  }
  console.error('Playwright bulunamadı. Bakılan yerler:\n  ' + denenen.join('\n  ') +
    '\nKurulum: npm install -g playwright  (Chromium zaten /opt/pw-browsers/chromium)');
  process.exit(1);
}
const { chromium } = playwrightBul();

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CIKTI = join(ROOT, 'tescil');

/* EUIPO biçim zarfı. Kaynak: euipo.europa.eu — "Get the image right" ve
   FAQ: Attachments. Rakamlar başvuru öncesi kurumun kendi sayfasından
   doğrulanmalı; burada denetlenen şey bizim dosyamızın zarfa uyduğudur. */
const ZARF = { enBoyEn: 2835, enBoyBoy: 2010, enBuyukBayt: 2 * 1024 * 1024, dpi: [96, 300] };

/* Başvuruya giden varyantlar. EUIPO şekil markasında renk beyanı yapılırsa
   renkler koruma kapsamına girer; siyah-beyaz başvuru daha geniş korur ama
   renk iddiasını bırakır. İkisini de üretip kararı hukukçuya bırakıyoruz. */
const VARYANT = [
  { ad: 'sekil-markasi-renkli',   dosya: 'qblogg-symbol.svg',            not: 'Sembol, marka renkleriyle' },
  { ad: 'sekil-markasi-siyah',    dosya: 'qblogg-symbol-black.svg',      not: 'Sembol, tek renk siyah' },
  { ad: 'kilit-renkli',           dosya: 'qblogg-lockup-horizontal.svg', not: 'Yatay kilit, marka renkleriyle' },
  { ad: 'kilit-siyah',            dosya: 'qblogg-lockup-horizontal.svg', not: 'Yatay kilit, tek renk', siyah: true }
];

const BOY = 1600;   // zarfın içinde, 250×250'ye ölçeklenince bozulmayacak kadar büyük

async function main() {
  mkdirSync(CIKTI, { recursive: true });
  const tarayici = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const rapor = [];

  for (const v of VARYANT) {
    const svgHam = readFileSync(join(ROOT, 'assets/brand', v.dosya), 'utf8');
    const svg = v.siyah ? svgHam.replace(/#082C54|#00D8C2/gi, '#000000') : svgHam;
    const sayfa = await tarayici.newPage({ viewport: { width: BOY, height: BOY } });
    /* Beyaz zemin zorunlu: JPEG saydamlık taşımaz, saydam alan siyaha düşer. */
    await sayfa.setContent(
      `<style>html,body{margin:0;background:#fff}#k{display:flex;align-items:center;` +
      `justify-content:center;width:${BOY}px;height:${BOY}px;background:#fff}` +
      `#k svg{width:86%;height:86%}</style><div id="k">${svg}</div>`,
      { waitUntil: 'networkidle' });
    await sayfa.waitForTimeout(200);
    const hedef = join(CIKTI, v.ad + '.jpg');
    await sayfa.screenshot({ path: hedef, type: 'jpeg', quality: 96,
      clip: { x: 0, y: 0, width: BOY, height: BOY } });
    await sayfa.close();

    const bayt = statSync(hedef).size;
    const bas = readFileSync(hedef);
    const progressive = bas.includes(Buffer.from([0xff, 0xc2]));   // SOF2 = progressive
    const sorun = [];
    if (BOY > ZARF.enBoyEn || BOY > ZARF.enBoyBoy) sorun.push('boyut zarfın dışında');
    if (bayt > ZARF.enBuyukBayt) sorun.push(`${(bayt / 1024 / 1024).toFixed(2)} MB — 2 MB üstü`);
    if (progressive) sorun.push('progressive JPEG — EUIPO kabul etmiyor');
    if (bas[0] !== 0xff || bas[1] !== 0xd8) sorun.push('geçerli JPEG değil');
    rapor.push({ ...v, bayt, sorun });
    console.log(`  ${sorun.length ? '✗' : '✓'} ${v.ad}.jpg  ${BOY}×${BOY}  ${(bayt / 1024).toFixed(0)} KB` +
      (sorun.length ? '  → ' + sorun.join(', ') : ''));
  }

  /* Sicil görüntüsü 250×250. Marka o boyutta ne oluyor, ayrıca kaydedilir. */
  const s = await tarayici.newPage({ viewport: { width: 600, height: 600 } });
  const svg = readFileSync(join(ROOT, 'assets/brand/qblogg-symbol.svg'), 'utf8');
  await s.setContent(`<style>html,body{margin:0;background:#fff}#k{width:250px;height:250px;` +
    `display:flex;align-items:center;justify-content:center}#k svg{width:86%;height:86%}</style>` +
    `<div id="k">${svg}</div>`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(200);
  await s.screenshot({ path: join(CIKTI, 'sicil-onizleme-250.png'),
    clip: { x: 0, y: 0, width: 250, height: 250 } });
  console.log('  ✓ sicil-onizleme-250.png  (EUIPO sicilde bu boyutta görünür)');
  await tarayici.close();

  writeFileSync(join(CIKTI, 'RAPOR.md'),
    '# EUIPO başvuru dosyaları — biçim raporu\n\n' +
    'Üretici: `node scripts/marka-tescil.mjs`. Bu rapor yalnızca **biçim**\n' +
    'uygunluğunu söyler. Ayırt edicilik, tanımlayıcılık, önceki haklar ve\n' +
    'Nice sınıfı burada denetlenmez — bunlar hukuki değerlendirmedir.\n\n' +
    '| Dosya | Açıklama | Boyut | Durum |\n|---|---|---|---|\n' +
    rapor.map((r) => `| \`${r.ad}.jpg\` | ${r.not} | ${(r.bayt / 1024).toFixed(0)} KB | ` +
      `${r.sorun.length ? '✗ ' + r.sorun.join(', ') : '✓ zarfa uygun'} |`).join('\n') +
    `\n\nZarf: JPEG · en fazla ${ZARF.enBoyEn}×${ZARF.enBoyBoy} px · ${ZARF.dpi[0]}–${ZARF.dpi[1]} DPI · ` +
    'RGB · progressive değil · 2 MB altı.\n\n' +
    '**Başvuru öncesi bu rakamları EUIPO\'nun kendi sayfasından doğrulayın.**\n' +
    'Kurum şartlarını değiştirebilir; buradaki değerler yazıldığı gündeki\n' +
    'kaynaklara dayanıyor.\n', 'utf8');
  console.log(`\n${VARYANT.length} dosya + sicil önizlemesi: tescil/`);
  console.log('Biçim raporu: tescil/RAPOR.md');
  const kotu = rapor.filter((r) => r.sorun.length).length;
  if (kotu) { console.error(`\n${kotu} dosya zarfın dışında.`); process.exit(1); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('Hata:', e.message); process.exit(1); });
}
