#!/usr/bin/env node
/* QBLOGG — marka üretim testleri.
 *
 *   npm run uretim-testi
 *
 * Kaynak kod denetimi v0.3, R08: faks/tek renk, büyük format ve gerçek ekran
 * testleri yapılmamıştı. Fiziksel olanlar (nakış, gravür, baskı) hâlâ
 * yapılamıyor; ekranda yapılabilenler burada, tekrarlanabilir biçimde.
 *
 * Önceden bu testler geçici bir dosyada elle koşulmuştu — yani kanıt panosu
 * üretilebilir değildi. Proje kuralı 7(a) bunu yasaklıyor: varlık betikten
 * çıkar. Bu dosya o boşluğu kapatıyor.
 *
 * Çıktı: docs/gorseller/uretim-testleri.png + ölçüm tablosu (stdout)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

function playwrightBul() {
  for (const kok of [import.meta.url, 'file:///opt/node22/lib/node_modules/x.js', 'file:///usr/lib/node_modules/x.js']) {
    try { return createRequire(kok)('playwright'); } catch (e) { /* sonrakini dene */ }
  }
  console.error('Playwright bulunamadı. Kurulum: npm install -g playwright');
  process.exit(1);
}

/* filtre: ekran görüntüsüne uygulanan CSS. olcumFiltre: aynı etkinin ölçüm
   tarafındaki karşılığı — canvas'a çizilen SVG'ye CSS filtresi geçmediği için
   ölçüm ayrıca uygulanmalı. İlk sürümde bu atlanmıştı ve faks/ters/gri
   satırları renkli aslın sayılarını raporluyordu. */
const TEST = [
  { ad: 'faks',     dosya: 'qblogg-symbol-black.svg', boy: 300, filtre: 'grayscale(1) contrast(1000%)', not: 'Faks / tek renk baskı' },
  { ad: 'siluet',   dosya: 'qblogg-symbol.svg',       boy: 300, filtre: 'blur(6px)',                    not: 'Siluet' },
  { ad: 'ters',     dosya: 'qblogg-symbol.svg',       boy: 300, filtre: 'invert(1)',                    not: 'Ters çevrilmiş' },
  { ad: 'gri',      dosya: 'qblogg-symbol.svg',       boy: 300, filtre: 'grayscale(1)',                 not: 'Gri tonlama' },
  { ad: 'px16',     dosya: 'qblogg-icon-small.svg',   boy: 16,  filtre: 'none',                         not: '16 px' },
  { ad: 'px24',     dosya: 'qblogg-icon-small.svg',   boy: 24,  filtre: 'none',                         not: '24 px' },
  { ad: 'px32',     dosya: 'qblogg-icon-small.svg',   boy: 32,  filtre: 'none',                         not: '32 px' },
  { ad: 'px48',     dosya: 'qblogg-icon-small.svg',   boy: 48,  filtre: 'none',                         not: '48 px' }
];

async function main() {
  const { chromium } = playwrightBul();
  const tarayici = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await tarayici.newPage({ viewport: { width: 800, height: 800 } });
  const png = {}, olcum = [];

  for (const t of TEST) {
    const svg = readFileSync(join(ROOT, 'assets/brand', t.dosya), 'utf8');
    await p.setContent(
      `<style>html,body{margin:0;background:#fff}#k{width:${t.boy}px;height:${t.boy}px;filter:${t.filtre}}` +
      `#k svg{width:100%;height:100%;display:block}</style><div id="k">${svg}</div>`,
      { waitUntil: 'networkidle' });
    await p.waitForTimeout(150);
    png[t.ad] = (await p.screenshot({ clip: { x: 0, y: 0, width: t.boy, height: t.boy } })).toString('base64');

    /* Ölçüm: filtre canvas'a da uygulanır. Ara ton = ne koyu ne açık pikseller;
       küçüldükçe artması markanın belirsizleştiği anlamına gelir. */
    olcum.push({ ...t, ...await p.evaluate(({ boy, filtre }) => {
      const c = document.createElement('canvas'); c.width = c.height = boy;
      const x = c.getContext('2d');
      const s = new XMLSerializer().serializeToString(document.querySelector('svg'));
      return new Promise((res) => {
        const i = new Image();
        i.onload = () => {
          x.fillStyle = '#fff'; x.fillRect(0, 0, boy, boy);
          if (filtre !== 'none') x.filter = filtre;
          x.drawImage(i, 0, 0, boy, boy);
          const d = x.getImageData(0, 0, boy, boy).data;
          let koyu = 0, ara = 0;
          for (let k = 0; k < d.length; k += 4) {
            const l = 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2];
            if (l < 100) koyu++; else if (l < 200) ara++;
          }
          res({ murekkep: koyu / (boy * boy), araTon: ara / (boy * boy) });
        };
        i.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
      });
    }, { boy: t.boy, filtre: t.filtre }) });
  }

  const kart = (t) => `<div class="c"><img src="data:image/png;base64,${png[t.ad]}" ` +
    `width="${Math.max(t.boy, 110)}"><div class="l">${t.not}</div>` +
    `<div class="m">ara ton %${(olcum.find((o) => o.ad === t.ad).araTon * 100).toFixed(1)}</div></div>`;
  await p.setViewportSize({ width: 1180, height: 560 });
  await p.setContent(`<style>body{margin:0;background:#f5f6f8;font:13px system-ui;padding:22px}
    h1{font-size:13px;letter-spacing:.08em;color:#5b6172;margin:0 0 16px}
    .r{display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap}
    .c{background:#fff;padding:14px;border-radius:10px;text-align:center;min-width:130px}
    .c img{display:block;margin:0 auto 9px;image-rendering:pixelated}
    .l{color:#14161c;font-weight:600;font-size:11px}
    .m{color:#5b6172;font-size:10px;margin-top:3px}</style>
    <h1>QBLOGG — ÜRETİM TESTLERİ · ${new Date().toISOString().slice(0, 10)}</h1>
    <div class="r">${TEST.map(kart).join('')}</div>`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: join(ROOT, 'docs/gorseller/uretim-testleri.png'), fullPage: true });
  await tarayici.close();

  console.log('  Test              Boyut   Mürekkep   Ara ton');
  for (const o of olcum) {
    console.log(`  ${o.not.padEnd(18)} ${String(o.boy).padStart(3)}px   ` +
      `%${(o.murekkep * 100).toFixed(1).padStart(5)}    %${(o.araTon * 100).toFixed(1).padStart(5)}`);
  }
  console.log('\n  Pano: docs/gorseller/uretim-testleri.png');
  console.log('  Yapılamayan: nakış, gravür, 100 mm üzeri baskı, gerçek ekran — fiziksel üretim gerekiyor.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('Hata:', e.message); process.exit(1); });
}
