/**
 * Üç dilin sözlükleri aynı anahtar kümesine sahip olmalı — eksik anahtar
 * sessizce Norveççeye düşer ve hata vermez. Kullanılmayan ölü anahtarları da bulur.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const src = readFileSync('lib/i18n.ts', 'utf8');
const body = src.slice(src.indexOf('export const dictionaries'));
const keysOf = {};
for (const locale of ['no', 'en', 'tr']) {
  const start = body.indexOf(`\n  ${locale}: {`);
  const end = body.indexOf('\n  },', start);
  keysOf[locale] = [...body.slice(start, end).matchAll(/'([\w.]+)':/g)].map((m) => m[1]);
}

let failures = 0;
const all = new Set(Object.values(keysOf).flat());
for (const locale of ['no', 'en', 'tr']) {
  const missing = [...all].filter((k) => !keysOf[locale].includes(k));
  const dupes = keysOf[locale].filter((k, i) => keysOf[locale].indexOf(k) !== i);
  if (missing.length) { failures++; console.log(`❌ ${locale} eksik: ${missing.join(', ')}`); }
  if (dupes.length) { failures++; console.log(`❌ ${locale} tekrar eden: ${dupes.join(', ')}`); }
  if (!missing.length && !dupes.length) console.log(`✅ ${locale}: ${keysOf[locale].length} anahtar`);
}

const used = new Set(
  execSync(`grep -rhoE "t\\([a-zA-Z]+, '[a-zA-Z0-9.]+'\\)" app components`)
    .toString().split('\n').filter(Boolean).map((m) => m.match(/'([\w.]+)'/)[1]),
);
const undefinedKeys = [...used].filter((k) => !all.has(k));
const unused = [...all].filter((k) => !used.has(k));
if (undefinedKeys.length) { failures++; console.log(`❌ sözlükte olmayan: ${undefinedKeys.join(', ')}`); }
if (unused.length) { failures++; console.log(`❌ kullanılmayan ölü anahtar: ${unused.join(', ')}`); }
if (!undefinedKeys.length && !unused.length) console.log('✅ kullanım ve tanım örtüşüyor');

process.exit(failures ? 1 : 0);
