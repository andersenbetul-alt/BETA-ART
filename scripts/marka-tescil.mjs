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
const DPI = 300;    // zarfın üst sınırı; baskıya da yeter

/* Chromium'un ürettiği JPEG, JFIF APP0 bloğunda birim=0 ("yalnızca en-boy
   oranı") ve yoğunluk 1:1 yazıyor — yani fiziksel çözünürlük beyan edilmiyor.
   EUIPO 96–300 DPI istiyor. Üç baytı yerinde düzeltiyoruz; görüntü verisine
   dokunulmuyor, yalnızca üstbilgi. */
function dpiYaz(yol, dpi) {
  const b = readFileSync(yol);
  for (let i = 2; i < b.length - 1; ) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m === 0xd8 || m === 0xd9 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
    const uz = b.readUInt16BE(i + 2);
    if (m === 0xe0 && b.subarray(i + 4, i + 9).toString('latin1') === 'JFIF\0') {
      b[i + 11] = 1;                       // birim: 1 = inç
      b.writeUInt16BE(dpi, i + 12);        // X yoğunluğu
      b.writeUInt16BE(dpi, i + 14);        // Y yoğunluğu
      writeFileSync(yol, b);
      return true;
    }
    i += 2 + uz;
  }
  return false;
}

/* Dosyayı iddiaya göre değil, baytlarına bakarak inceler. Önceki sürüm
   yalnızca dosya boyutuna ve kaba bir progressive taramasına bakıyordu ve
   çözünürlüğü hiç denetlemiyordu — dört dosyaya da "zarfa uygun" demişti,
   oysa dördü de çözünürlük beyan etmiyordu. */
function jpegIncele(yol) {
  const b = readFileSync(yol);
  const r = { bayt: b.length, gecerli: b[0] === 0xff && b[1] === 0xd8,
              progressive: false, en: 0, boy: 0, bilesen: 0, renk: '?', dpi: null, birim: null };
  for (let i = 2; i < b.length - 1; ) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m === 0xd8 || m === 0xd9 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
    const uz = b.readUInt16BE(i + 2);
    if (m === 0xe0 && b.subarray(i + 4, i + 9).toString('latin1') === 'JFIF\0') {
      r.birim = b[i + 11];
      r.dpi = [b.readUInt16BE(i + 12), b.readUInt16BE(i + 14)];
    }
    if (m === 0xc0 || m === 0xc1 || m === 0xc2 || m === 0xc3) {
      r.progressive = m === 0xc2;
      r.boy = b.readUInt16BE(i + 5);
      r.en = b.readUInt16BE(i + 7);
      r.bilesen = b[i + 9];
      r.renk = { 1: 'Gri', 3: 'YCbCr (RGB)', 4: 'CMYK' }[r.bilesen] || '?';
      break;
    }
    i += 2 + uz;
  }
  return r;
}

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

    dpiYaz(hedef, DPI);            // Chromium çözünürlük yazmıyor; EUIPO 96–300 DPI istiyor
    const d = jpegIncele(hedef);
    const sorun = [];
    if (!d.gecerli) sorun.push('geçerli JPEG değil');
    if (d.en > ZARF.enBoyEn || d.boy > ZARF.enBoyBoy) sorun.push(`${d.en}×${d.boy} — zarfın dışında`);
    if (d.bayt > ZARF.enBuyukBayt) sorun.push(`${(d.bayt / 1024 / 1024).toFixed(2)} MB — 2 MB üstü`);
    if (d.progressive) sorun.push('progressive JPEG — kabul edilmiyor');
    if (d.bilesen !== 3) sorun.push(`renk modu ${d.renk} — RGB bekleniyor`);
    if (!d.dpi || d.birim !== 1) sorun.push('çözünürlük beyan edilmemiş');
    else if (d.dpi[0] < ZARF.dpi[0] || d.dpi[0] > ZARF.dpi[1]) sorun.push(`${d.dpi[0]} DPI — 96–300 dışında`);
    const bayt = d.bayt;
    rapor.push({ ...v, bayt, dpi: d.dpi ? d.dpi[0] : null, sorun });
    console.log(`  ${sorun.length ? '✗' : '✓'} ${v.ad}.jpg  ${d.en}×${d.boy}  ${d.dpi ? d.dpi[0] : '?'} DPI  ` +
      `${d.renk}  ${(bayt / 1024).toFixed(0)} KB` + (sorun.length ? '  → ' + sorun.join(', ') : ''));
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
    '| Dosya | Açıklama | Boyut | DPI | Durum |\n|---|---|---|---:|---|\n' +
    rapor.map((r) => `| \`${r.ad}.jpg\` | ${r.not} | ${(r.bayt / 1024).toFixed(0)} KB | ${r.dpi || '?'} | ` +
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
