#!/usr/bin/env node
// Gozlemci: git ve dosya durumundan "ne kaldi" cikarir. Tahmin yok.
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const sh = (c) => { try { return execSync(c, { encoding: 'utf8' }).trim(); } catch { return ''; } };

const last = sh('git log --oneline -1');
const lastProduct = sh('git log --oneline -1 -- web/ docs/ brand.json');
const between = sh(`git rev-list --count ${lastProduct.split(' ')[0]}..HEAD`) || '0';

console.log('COBBAN — gozlemci\n');
console.log(`  son commit        ${last}`);
console.log(`  son urun commit'i ${lastProduct || '(yok)'}`);
console.log(`  arada             ${between} commit urun disi\n`);

const f = 'docs/findings.md';
if (existsSync(f)) {
  const lines = readFileSync(f, 'utf8').split('\n');
  const open = lines.filter((l) => l.trim().startsWith('- [ ]'));
  const done = lines.filter((l) => l.trim().startsWith('- [x]'));
  console.log(`  bulgular          ${open.length} acik / ${done.length} kapali`);
  for (const l of open) console.log(`    ${l.trim().replace('- [ ]', '·')}`);
} else {
  console.log(`  ${f} yok — bulgu takibi kurulmamis`);
}
