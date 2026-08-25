#!/usr/bin/env node
/*
 * Kapi. Cerceve yoksa degerlendirme baslamaz.
 *
 * Neden betik, neden kural cumlesi degil: "cercevede olmayan kriteri uydurma"
 * bir talimat olarak yazilirsa, girdi eksikken makul gorunen bir sey uretme
 * durtusuyle pazarlik edilebilir. Dosyadan okunursa pazarlik konusu kalmaz —
 * dosya yoksa alintilanacak metin de yoktur.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, 'framework');

const REQUIRED = [
  ['competencies.md', 'Degerlendirilecek yetkinlikler. Bu listede olmayan hicbir sey puanlanmaz.'],
  ['ratings.md',      'Derecelendirme tanimlari. Her puanin tanimi KELIMESI KELIMESINE buradan alinir.'],
  ['template.md',     'Sirketin degerlendirme sablonu. Ciktinin sekli budur.'],
];

const PLACEHOLDER = /BURAYI (IK|HR) DOLDURACAK|<placeholder>|TODO:/i;

let missing = 0;
console.log('\n  performance-review — cerceve kontrolu\n');

for (const [file, why] of REQUIRED) {
  const p = join(DIR, file);
  if (!existsSync(p)) {
    console.log(`  EKSIK   framework/${file}`);
    console.log(`          ${why}\n`);
    missing++; continue;
  }
  const body = readFileSync(p, 'utf8').trim();
  if (body.length < 40 || PLACEHOLDER.test(body)) {
    console.log(`  BOS     framework/${file}  (hala sablon/yer tutucu)`);
    console.log(`          ${why}\n`);
    missing++; continue;
  }
  console.log(`  VAR     framework/${file}  (${body.split('\n').length} satir)`);
}

if (missing === 0) {
  // Puan etiketlerini goster: degerlendirmede kelimesi kelimesine bunlar gecer.
  const ratings = readFileSync(join(DIR, 'ratings.md'), 'utf8');
  const labels = [...ratings.matchAll(/^\s*(?:#{2,4}|\|)\s*([^|\n#][^|\n]{2,60}?)\s*(?:\||$)/gm)]
    .map((m) => m[1].trim())
    .filter((s) => s && !/^-+$/.test(s));
  console.log(`\n  ratings.md icinden okunan basliklar (${labels.length}):`);
  for (const l of labels.slice(0, 12)) console.log(`    · ${l}`);
  console.log('\n  Cerceve tam. Degerlendirme baslayabilir.\n');
  process.exit(0);
}

console.log(`  ${missing} zorunlu dosya eksik — DEGERLENDIRME BASLAYAMAZ.`);
console.log('  Bunlari IK saglar. Uydurma yetkinlik veya puan tanimi yazilmaz.');
console.log(`  Nereye: ${DIR}\n`);
process.exit(1);
