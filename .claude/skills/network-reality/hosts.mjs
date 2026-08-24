#!/usr/bin/env node
// Bir host'a gitmeden once burayi sor. Olcum, hatirlama degil.
import { execFileSync } from 'node:child_process';

const KNOWN = {
  // acik
  'registry.npmjs.org': 'acik', 'pypi.org': 'acik', 'github.com': 'acik',
  'api.github.com': 'acik', 'objects.githubusercontent.com': 'acik',
  'fonts.googleapis.com': 'acik', 'crates.io': 'acik',
  // engelli
  'huggingface.co': 'ENGELLI', 'hf.co': 'ENGELLI',
  'api.vercel.com': 'ENGELLI', 'vercel.com': 'ENGELLI',
  'genspark.ai': 'ENGELLI', 'pomelli.com': 'ENGELLI',
  'stitch.withgoogle.com': 'ENGELLI', 'skills.sh': 'ENGELLI',
  'api.entur.io': 'ENGELLI', 'api.met.no': 'ENGELLI',
};

const probe = (h) => {
  try {
    const c = execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}',
      '--max-time', '12', `https://${h}/`], { encoding: 'utf8' }).trim();
    return c === '000' ? 'ENGELLI' : `acik (${c})`;
  } catch { return 'ENGELLI'; }
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('\n  bilinen durumlar (son olcum: 2026-08-24)\n');
  for (const [h, v] of Object.entries(KNOWN)) {
    console.log(`    ${v === 'acik' ? '·' : '×'} ${h.padEnd(32)} ${v}`);
  }
  console.log('\n  bilinmeyen bir host icin:  node hosts.mjs <host> [...]');
  process.exit(0);
}
for (const h of args) {
  const known = KNOWN[h];
  const live = probe(h);
  const drift = known && !live.startsWith(known === 'acik' ? 'acik' : 'ENGELLI');
  console.log(`  ${h.padEnd(32)} ${live}${known ? `   (kayitli: ${known})` : ''}${drift ? '  ← DEGISMIS, listeyi guncelle' : ''}`);
}
