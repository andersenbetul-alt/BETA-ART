#!/usr/bin/env node
/* QBLOGG — bağımsız marka kaynak paketini üretir.
 *
 *   node scripts/marka-paket.mjs
 *
 * Neden betik: paket önce elle kopyalanıyordu ve içindeki logo-sistemi.md
 * depo yollarını (scripts/, assets/brand/, docs/gorseller/) anlatıyordu,
 * oysa paket uretici/, varliklar/, kanit/ kullanıyor. Denetim bunu yakaladı
 * (kaynak kod denetimi v0.3, R03). Artık belge paket düzenine göre otomatik
 * yeniden yazılıyor; bir daha ayrışamaz.
 *
 * Çıktı: paket/  (git'te izlenmiyor)
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const P = join(ROOT, 'paket');

const KOPYA = [
  ['scripts/marka-uret.py',      'uretici/marka-uret.py'],
  ['scripts/marka-dogrula.py',   'uretici/marka-dogrula.py'],
  ['scripts/requirements.txt',   'uretici/requirements.txt'],
  ['docs/marka-testleri.md',     'belge/marka-testleri.md'],
  ['docs/marka-tescili.md',      'belge/marka-tescili.md'],
  ['assets/fonts/KAYNAK.md',     'font/KAYNAK.md'],
  ['assets/fonts/inter-latin.woff2', 'font/inter-latin.woff2'],
  ['assets/fonts/inter.css',     'font/inter.css']
];

function main() {
  rmSync(P, { recursive: true, force: true });
  for (const k of ['uretici', 'varliklar', 'belge', 'kanit', 'font']) mkdirSync(join(P, k), { recursive: true });
  for (const [kaynak, hedef] of KOPYA) copyFileSync(join(ROOT, kaynak), join(P, hedef));
  for (const f of readdirSync(join(ROOT, 'assets/brand'))) copyFileSync(join(ROOT, 'assets/brand', f), join(P, 'varliklar', f));
  for (const f of readdirSync(join(ROOT, 'docs/gorseller')).filter((x) => x.startsWith('logo-')))
    copyFileSync(join(ROOT, 'docs/gorseller', f), join(P, 'kanit', f));

  /* logo-sistemi.md paket düzenine çevrilir — R03'ün kaynağı buydu. */
  const belge = readFileSync(join(ROOT, 'docs/logo-sistemi.md'), 'utf8')
    .replace(/scripts\/marka-uret\.py/g, 'uretici/marka-uret.py')
    .replace(/assets\/brand\//g, 'varliklar/')
    .replace(/docs\/gorseller\//g, 'kanit/')
    .replace(/assets\/fonts\//g, 'font/')
    .replace(/docs\/marka-testleri\.md/g, 'belge/marka-testleri.md');
  writeFileSync(join(P, 'belge/logo-sistemi.md'),
    '<!-- Bu dosya scripts/marka-paket.mjs tarafından depo sürümünden üretildi;\n' +
    '     yollar paket düzenine çevrildi. Elle düzenlemeyin. -->\n\n' + belge, 'utf8');

  /* Özet listesi: hangi dosya hangi içerikle paketlendi. */
  const ozet = [];
  const gez = (k, on = '') => {
    for (const f of readdirSync(join(P, k), { withFileTypes: true })) {
      if (f.isDirectory()) gez(join(k, f.name), on);
      else {
        const yol = join(k, f.name);
        ozet.push([yol, createHash('sha256').update(readFileSync(join(P, yol))).digest('hex').slice(0, 16)]);
      }
    }
  };
  for (const k of ['uretici', 'varliklar', 'belge', 'kanit', 'font']) gez(k);

  writeFileSync(join(P, 'OKUBENI.md'), `# QBLOGG — logo üretim kaynağı

Logo bir tasarım programında çizilmedi; \`uretici/marka-uret.py\` üretiyor.
13 varlığın hepsi (11 SVG + 2 PNG) tek komutla yeniden üretilir.

## Çalıştırma

    cd uretici
    pip install -r requirements.txt
    python3 marka-uret.py

Beklenen çıktı: 13 satır tik ve son satırda
\`wordmark: 2919.5 x 534.0 u · cap 520u · yatay kilit 4027.5u geniş\`.

Betik yolları kendi konumundan çözer; klasör adlarını değiştirmeyin ama
yeniden adlandırmanız da gerekmez.

**\`brotli\` zorunlu.** Eksikse fontTools WOFF2'yi açamaz ve üretim başlamaz.

## Klasörler

| Klasör | İçerik |
|---|---|
| \`uretici/\` | Üretici betik + sabitlenmiş bağımlılıklar |
| \`varliklar/\` | Üretilen 13 dosya |
| \`belge/\` | Geometri, test protokolleri, tescil kapısı |
| \`kanit/\` | Ölçek testi, kilitler, aday elemesi panoları |
| \`font/\` | Inter — betiğin wordmark'ı çıkardığı dosya + kaynak kaydı |

## Açık maddeler

- **Font lisans metni pakette yok** (\`font/KAYNAK.md\` → R05). OFL, yeniden
  dağıtımda lisans metninin de bulunmasını şart koşuyor.
- Beş saniyelik tanınırlık testi **uygulanmadı**.
- Marka araştırması **yapılmadı**; tescil edilebilirlik hakkında iddia yok.

Ayrıntılı denetim yanıtı: depoda \`docs/denetim/YANIT.md\`.

## Dosya özetleri (SHA-256, ilk 16 hane)

| Dosya | Özet |
|---|---|
${ozet.map(([f, h]) => `| \`${f}\` | \`${h}\` |`).join('\n')}
`, 'utf8');

  console.log(`paket/ üretildi — ${ozet.length} dosya`);
  console.log('  belge/logo-sistemi.md paket düzenine çevrildi (R03)');
  console.log('  OKUBENI.md özet listesiyle birlikte yazıldı');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
