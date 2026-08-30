/* EUIPO renk modu kuralının testi.
 *
 * Neden var: denetleyici bir süre yalnızca RGB'yi kabul ediyordu ve hata
 * mesajı "RGB bekleniyor" diyordu. EUIPO gerçekte RGB, Gri, S/B ve CMYK'yı
 * kabul ediyor (kaynak: docs/marka-tescili.md). Kural yanlış aktarılmıştı.
 *
 * Bu test, gerçek bir JPEG'in SOF başlığındaki bileşen sayısı baytını
 * değiştirerek dört renk modunu da inceleyiciye gösterir.
 *
 * SINIR: bu bir BAŞLIK testidir, görüntü testi değil. Üretilen dosyaların
 * gövdesi hâlâ üç bileşenli veriyi taşır; yalnızca başlık beyanı değişir.
 * Test edilen şey inceleyicinin başlığı doğru okuyup doğru sınıflandırması.
 *
 * Testin ilk sürümü kuralın KOPYASINI taşıyordu ve gerilemeyi yakalamıyordu:
 * denetleyici RGB-only'ye döndürülünce test yine geçiyordu. Kural artık
 * marka-tescil.mjs'den içeri aktarılıyor; tek kaynak orası.
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { jpegIncele, RENK_MODLARI } from './marka-tescil.mjs';

const KAYNAK = 'tescil/sekil-markasi-renkli.jpg';
const GECERLI = RENK_MODLARI;   // denetleyicinin kendi kuralı — kopya değil
const ADLAR = { 1: 'Gri / S-B', 2: '(geçersiz)', 3: 'RGB', 4: 'CMYK' };

function bilesenDegistir(buf, n) {
  const b = Buffer.from(buf);
  for (let i = 2; i < b.length - 1;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      b[i + 9] = n;                        // SOF: uzunluk(2) hassasiyet(1) boy(2) en(2) → bileşen sayısı
      return b;
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error('SOF bulunamadı');
}

const dizin = mkdtempSync(join(tmpdir(), 'tescil-testi-'));
const kaynak = readFileSync(KAYNAK);
let gecti = 0, kaldi = 0;

console.log('EUIPO renk modu kuralı — başlık testi');
console.log('─'.repeat(60));
for (const n of [1, 2, 3, 4]) {
  const yol = join(dizin, `mod${n}.jpg`);
  writeFileSync(yol, bilesenDegistir(kaynak, n));
  const d = jpegIncele(yol);
  const kabul = GECERLI.includes(d.bilesen);
  const beklenen = [1, 3, 4].includes(n);   // EUIPO'nun kuralı — belgeden
  const ok = d.bilesen === n && kabul === beklenen;
  (ok ? gecti++ : kaldi++);
  console.log(`  ${ok ? '✓' : '✗'} ${n} bileşen (${ADLAR[n]}) → okundu ${d.bilesen}, ` +
    `${kabul ? 'kabul' : 'ret'} · beklenen ${beklenen ? 'kabul' : 'ret'}`);
}
console.log('─'.repeat(60));
console.log(`${gecti} geçti, ${kaldi} kaldı`);
process.exit(kaldi ? 1 : 0);
