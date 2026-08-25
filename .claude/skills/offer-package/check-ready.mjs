#!/usr/bin/env node
/*
 * Hazirlik kapisi. Doldurulmamis alan varsa cikis kodu 1.
 *
 * Neden betik: "sunmadan once doldur" bir hatirlatma olarak yazilirsa, cagri
 * bes dakika sonra basliyorken pazarlik edilir. Sayilan bir esik edilmez.
 * Sunum kendi hazirligini bildirir; bilmeyen tek kisi ekrani paylasan olmaz.
 */
import { readFileSync, existsSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('\n  kullanim: node check-ready.mjs <dosya> [dosya...]');
  console.log('  ornek   : node .claude/skills/offer-package/check-ready.mjs teklif/*.html teklif/*.md\n');
  process.exit(2);
}

let total = 0;
console.log('\n  teklif paketi — hazirlik kontrolu\n');

for (const f of files) {
  if (!existsSync(f)) { console.log(`  YOK      ${f}`); total++; continue; }
  const body = readFileSync(f, 'utf8');

  // HTML: <span class="fill">...</span>   Markdown/metin: [koseli] veya ____
  const html = [...body.matchAll(/class="fill"[^>]*>([^<]*)</g)].map((m) => m[1].trim());
  const md   = [...body.matchAll(/\[([a-zçğıöşü][^\]\n]{1,40})\]|_{4,}/gi)].map((m) => (m[1] ?? '____').trim());
  const hits = [...html, ...md];

  if (hits.length === 0) { console.log(`  TAMAM    ${f}`); continue; }
  total += hits.length;
  console.log(`  ${String(hits.length).padStart(3)} EKSIK ${f}`);
  for (const h of [...new Set(hits)].slice(0, 6)) console.log(`           · ${h}`);
  if (new Set(hits).size > 6) console.log(`           · … ${new Set(hits).size - 6} tane daha`);
}

if (total === 0) {
  console.log('\n  Bos alan yok. Paket sunulabilir.\n');
  process.exit(0);
}
console.log(`\n  ${total} alan doldurulmamis — SUNMA.`);
console.log('  Rakam yoksa "yok" yaz; bos hucre adayda soru isareti birakir.\n');
process.exit(1);
