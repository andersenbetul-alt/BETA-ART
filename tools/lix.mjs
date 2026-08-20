/* LIX (lesbarhetsindeks) — the standard readability measure for Norwegian,
   Swedish and Danish.  LIX = words/sentences + (long words * 100 / words),
   where a long word is more than six letters.
     < 30  very easy      30–40  easy (klarspråk target)
     40–50 medium         50–60  difficult      > 60  very difficult
   Norwegian public bodies aim below 40 for text written for the public. */
import fs from 'node:fs';

function lix(text) {
  const clean = text.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
  const words = clean.split(/[^A-Za-zÆØÅæøå0-9'’-]+/).filter(Boolean);
  if (words.length < 6) return null;                 // too short to score
  const sentences = Math.max(1, (clean.match(/[.!?:]+(\s|$)/g) || []).length);
  const long = words.filter(w => w.replace(/[^A-Za-zÆØÅæøå]/g, '').length > 6).length;
  return {
    lix: Math.round(words.length / sentences + (long * 100) / words.length),
    words: words.length,
    sentences,
    longest: words.reduce((a, b) => (b.length > a.length ? b : a), '')
  };
}

const target = process.argv[2] || new URL('../assets/i18n/no.json', import.meta.url);
const json = JSON.parse(fs.readFileSync(target, 'utf8'));
const rows = [];
(function walk(node, path) {
  if (typeof node === 'string') {
    const r = lix(node);
    if (r) rows.push({ path, ...r, text: node });
    return;
  }
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    return Object.keys(node).forEach(k => walk(node[k], path ? `${path}.${k}` : k));
  }
}(json, ''));

const scored = rows.filter(r => r.words >= 8);
const avg = Math.round(scored.reduce((s, r) => s + r.lix, 0) / scored.length);
console.log(`${scored.length} passages scored — average LIX ${avg} (klarspråk target: under 40)\n`);

const hard = scored.filter(r => r.lix >= 45).sort((a, b) => b.lix - a.lix);
console.log(`${hard.length} passage(s) at or above LIX 45:\n`);
hard.slice(0, 14).forEach(r => {
  console.log(`  LIX ${r.lix}  ${r.path}  (${r.words} words, ${r.sentences} sentence${r.sentences > 1 ? 's' : ''}, longest "${r.longest}")`);
  console.log(`     ${r.text.slice(0, 130)}${r.text.length > 130 ? '…' : ''}`);
});
const buckets = { '<30': 0, '30-39': 0, '40-44': 0, '45-54': 0, '55+': 0 };
scored.forEach(r => {
  if (r.lix < 30) buckets['<30']++; else if (r.lix < 40) buckets['30-39']++;
  else if (r.lix < 45) buckets['40-44']++; else if (r.lix < 55) buckets['45-54']++;
  else buckets['55+']++;
});
console.log('\ndistribution:', JSON.stringify(buckets));
