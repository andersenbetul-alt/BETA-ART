#!/usr/bin/env node
/* Project checks — no dependencies, runs anywhere Node runs.
   Catches the mistakes this codebase is actually prone to: a translation key added
   to the markup but not to all twelve dictionaries, a nav link pointing at a section
   that no longer exists, an asset referenced but not committed. */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

const html = read('index.html');
const css = read('assets/css/style.css');
const appJs = read('assets/js/app.js');
const i18nJs = read('assets/js/i18n.js');

/* ---------- 1. JavaScript parses ---------- */

for (const file of ['assets/js/app.js', 'assets/js/i18n.js', 'scripts/check.mjs']) {
  try {
    execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' });
  } catch (e) {
    fail(`${file} does not parse:\n${String(e.stderr || e.message).trim()}`);
  }
}

/* ---------- 2. Every language carries every key ---------- */

const sandbox = { window: {} };
new Function('window', i18nJs)(sandbox.window);
const LANGS = sandbox.window.HXI_LANGS || [];
const DICTS = sandbox.window.HXI_I18N || {};

const usedKeys = [...new Set([...html.matchAll(/data-i18n="([a-z0-9_]+)"/g)].map((m) => m[1]))];
// form_email is applied from JS as the signup placeholder, not via a data-i18n attribute.
const runtimeKeys = [...new Set([...appJs.matchAll(/dict\.([a-z0-9_]+)/g)].map((m) => m[1]))];
const required = [...new Set([...usedKeys, ...runtimeKeys])];

const codes = LANGS.map((l) => l.code);
if (!codes.length) fail('HXI_LANGS is empty — the language switcher would render nothing.');

for (const code of codes) {
  const dict = DICTS[code];
  if (!dict) {
    fail(`Language "${code}" is in the switcher but has no dictionary.`);
    continue;
  }
  const missing = required.filter((k) => !(k in dict));
  const unused = Object.keys(dict).filter((k) => !required.includes(k));
  if (missing.length) fail(`[${code}] missing ${missing.length} key(s): ${missing.join(', ')}`);
  if (unused.length) fail(`[${code}] ${unused.length} unused key(s) — remove or wire up: ${unused.join(', ')}`);
  const empty = Object.entries(dict).filter(([, v]) => typeof v !== 'string' || !v.trim());
  if (empty.length) fail(`[${code}] empty value(s): ${empty.map(([k]) => k).join(', ')}`);
}

for (const code of Object.keys(DICTS)) {
  if (!codes.includes(code)) fail(`Dictionary "${code}" exists but is not listed in HXI_LANGS.`);
}

/* Untranslated leftovers: a value identical to English in a non-English dictionary is
   usually a forgotten paste. Proper nouns legitimately repeat, so this only warns. */
const PROPER = /^(HXI|NCS|Sync|Booking|Collab|Remix|EP|B2B|Discord)$/i;
for (const code of codes.filter((c) => c !== 'en')) {
  const same = required.filter(
    (k) => DICTS[code][k] === DICTS.en[k] && !PROPER.test(String(DICTS.en[k]).trim())
  );
  if (same.length) notes.push(`[${code}] same as English (check): ${same.join(', ')}`);
}

/* ---------- 3. Internal links resolve ---------- */

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, href] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(href)) fail(`Link points at #${href}, but no element has that id.`);
}

/* ---------- 4. Referenced local files exist ---------- */

const refs = [...html.matchAll(/(?:href|src)="((?!https?:|mailto:|#|data:)[^"]+)"/g)].map((m) => m[1]);
for (const ref of [...new Set(refs)]) {
  if (!existsSync(join(root, ref))) fail(`index.html references ${ref}, which is not in the repo.`);
}

/* ---------- 5. RTL languages are declared in both places ---------- */

const rtlInApp = [...appJs.matchAll(/RTL = \{([^}]*)\}/g)][0];
const rtlCodes = rtlInApp ? [...rtlInApp[1].matchAll(/([a-z]{2}):/g)].map((m) => m[1]) : [];
for (const code of ['ar', 'ur']) {
  if (codes.includes(code) && !rtlCodes.includes(code)) {
    fail(`"${code}" is right-to-left but missing from the RTL map in app.js.`);
  }
}

/* ---------- 6. Head essentials ---------- */

for (const [label, re] of [
  ['<title>', /<title>[^<]+<\/title>/],
  ['meta description', /<meta name="description"/],
  ['og:image', /<meta property="og:image"/],
  ['canonical', /<link rel="canonical"/],
  ['viewport', /<meta name="viewport"/],
]) {
  if (!re.test(html)) fail(`index.html is missing its ${label}.`);
}

for (const code of codes) {
  if (!html.includes(`hreflang="${code}"`)) {
    fail(`No hreflang link for "${code}" — add one next to the others in <head>.`);
  }
}

/* ---------- 7. CSS classes used in the markup exist ---------- */

const cssClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const htmlClasses = new Set(
  [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean)
);
const unstyled = [...htmlClasses].filter((c) => !cssClasses.has(c));
if (unstyled.length) notes.push(`class(es) with no CSS rule: ${unstyled.join(', ')}`);

/* ---------- report ---------- */

const langCount = codes.length;
if (notes.length) {
  console.log('Notes:');
  for (const n of notes) console.log('  · ' + n);
  console.log('');
}
if (problems.length) {
  console.error('FAILED:');
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}
console.log(`OK — ${langCount} languages × ${required.length} keys, links and assets resolve.`);
