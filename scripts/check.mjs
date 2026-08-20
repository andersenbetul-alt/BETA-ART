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

// Every page the site ships. index.html is the one most checks are about; the others join
// the i18n, anchor, asset and class checks so a second page cannot drift out of step.
const PAGES = ['index.html', 'privacy.html', '404.html'].filter((f) => existsSync(join(root, f)));
const html = read('index.html');
const allHtml = PAGES.map(read).join('\n');
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

const usedKeys = [...new Set([...allHtml.matchAll(/data-i18n="([a-z0-9_]+)"/g)].map((m) => m[1]))];
// form_email is applied from JS as the signup placeholder, not via a data-i18n attribute.
const runtimeKeys = [...new Set([...appJs.matchAll(/dict\.([a-z0-9_]+)/g)].map((m) => m[1]))];
// The store renders from assets/js/shop.js, so its description keys and the labels the
// renderer asks for by name never appear as data-i18n attributes.
const shopJs = existsSync(join(root, 'assets/js/shop.js')) ? read('assets/js/shop.js') : '';
const shopKeys = [
  ...[...shopJs.matchAll(/desc:\s*'([a-z0-9_]+)'/g)].map((m) => m[1]),
  // every 'shop_*' literal the renderer asks for, including the ones inside ternaries
  ...[...(appJs + shopJs).matchAll(/'(shop_[a-z0-9_]+)'/g)].map((m) => m[1]),
];
// Keys the scripts ask for by name through t(), e.g. the copy-button's confirmation. Matched
// against the English dictionary rather than by shape, so createElement('p') is not a key.
const enKeys = [...new Set([...i18nJs.matchAll(/^  ([a-z0-9_]+):/gm)].map((m) => m[1]))];
const literalKeys = enKeys.filter((k) => (appJs + shopJs).includes(`'${k}'`));
const required = [...new Set([...usedKeys, ...runtimeKeys, ...shopKeys, ...literalKeys])];

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

/* ---------- 3. The markup's fallback text matches the English dictionary ----------
   Whatever sits between the tags is what a crawler reads and what a visitor with JS off
   sees. It drifted once already: the dictionary was corrected after research and the
   markup was not, leaving the retracted credit in the HTML. */

const fallbackRe = /<([a-z0-9]+)([^>]*?)data-i18n="([a-z0-9_]+)"([^>]*?)>([^<]*)<\/\1>/g;
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
// figures.json is read a few checks further down; the fallback text has the number already
// substituted, so substitute it here too before comparing.
const enStreams = existsSync(join(root, 'assets/data/figures.json'))
  ? new Intl.NumberFormat('en').format(
      JSON.parse(read('assets/data/figures.json')).streams_help_urself.value)
  : null;

for (const [, , , key, , text] of html.matchAll(fallbackRe)) {
  let expected = DICTS.en?.[key];
  if (expected === undefined) continue;
  if (enStreams && expected.includes('{n}')) expected = expected.replace('{n}', enStreams);
  if (unescape(text) !== expected) {
    fail(`fallback text for "${key}" does not match the en dictionary:\n` +
         `      markup: ${unescape(text)}\n` +
         `      en:     ${expected}`);
  }
}

/* ---------- 4. Internal links resolve ---------- */

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, href] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(href)) fail(`Link points at #${href}, but no element has that id.`);
}

/* ---------- 5. Referenced local files exist ---------- */

const refs = [...allHtml.matchAll(/(?:href|src)="((?!https?:|mailto:|#|data:)[^"]+)"/g)]
  .map((m) => m[1])
  // Site-absolute paths ("/tr/") point at build output, not at repo files. 404.html has to
  // use them because Pages serves it for a 404 at any depth. They are checked just below.
  .filter((r) => !r.startsWith('/'));
for (const ref of [...new Set(refs)]) {
  if (!existsSync(join(root, ref))) fail(`${ref} is referenced but not in the repo.`);
}

// A stylesheet's url(...) targets are just as much "referenced files", and a malformed one
// is invisible: the browser drops the rule and silently falls back. That is how eighteen
// url(url(...)) declarations shipped with the self-hosted fonts never loading.
for (const sheet of refs.filter((r) => r.endsWith('.css'))) {
  const dir = sheet.slice(0, sheet.lastIndexOf('/'));
  for (const [, quote, target] of read(sheet).matchAll(/url\((['"]?)([^'")]*)\1\)/g)) {
    if (target.startsWith('data:') || /^https?:/.test(target)) continue;
    if (!target || /url\(|['"]/.test(target)) {
      fail(`${sheet} has a malformed url(): ${target || '(empty)'}`);
      continue;
    }
    const path = join(root, dir, target);
    if (!existsSync(path)) fail(`${sheet} references ${target}, which is not in the repo.`);
  }
}

// The 404 page links every language directory absolutely; those codes must be real.
if (existsSync(join(root, '404.html'))) {
  const codes = new Set(LANGS.map((l) => l.code));
  for (const [, code] of read('404.html').matchAll(/href="\/([a-z]{2})\/"/g)) {
    if (!codes.has(code)) fail(`404.html links /${code}/, which is not a language in HXI_LANGS.`);
  }
}

// The two figures the API cannot fetch live in one file. Every place that prints them must
// agree with it — index.html carries the English formatting as its no-JS fallback, and the
// twelve dictionaries carry {n} rather than a number typed thirteen times.
const figuresPath = join(root, 'assets/data/figures.json');
if (existsSync(figuresPath)) {
  const FIG = JSON.parse(read('assets/data/figures.json'));
  const SLOT = { streams: 'streams_help_urself', listeners: 'monthly_listeners' };
  const fmt = (v, compact) =>
    new Intl.NumberFormat('en', compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(v);

  for (const [, name, text] of html.matchAll(/data-figure="([a-z_]+)"[^>]*>([^<]*)</g)) {
    const parts = name.split('_');
    const shape = parts.pop();
    const figure = FIG[SLOT[parts.join('_')]];
    if (!figure) { fail(`index.html has data-figure="${name}", which figures.json does not define.`); continue; }
    const expected = shape === 'compact'
      ? fmt(figure.value, true) + (name === 'streams_compact' ? '+' : '')
      : fmt(figure.value, false);
    if (text !== expected) {
      fail(`index.html prints "${text}" for ${name}; figures.json says "${expected}".`);
    }
  }

  for (const [code, dict] of Object.entries(DICTS)) {
    if (dict.music_help_streams && !dict.music_help_streams.includes('{n}')) {
      fail(`[${code}] music_help_streams has a number typed into it — use {n} so figures.json stays the only source.`);
    }
  }

  // A note, not a failure: nothing is wrong with the code when a figure gets old, but a
  // stream count nobody has looked at since spring is the quiet way this page stops being
  // true. Sixty days is about two missed monthly checks.
  const STALE_DAYS = 60;
  for (const [key, figure] of Object.entries(FIG)) {
    if (!figure || typeof figure !== 'object' || !figure.checkedAt) continue;
    const age = Math.floor((Date.now() - Date.parse(figure.checkedAt)) / 86400000);
    if (age > STALE_DAYS) {
      notes.push(`${key} was last checked ${age} days ago (${figure.checkedAt}) — ` +
        'read it off Spotify for Artists and run: npm run figures -- --' +
        (key === 'monthly_listeners' ? 'listeners' : 'streams') + ' <number>');
    }
  }
}

/* ---------- 6. RTL languages are declared in both places ---------- */

const rtlInApp = [...appJs.matchAll(/RTL = \{([^}]*)\}/g)][0];
const rtlCodes = rtlInApp ? [...rtlInApp[1].matchAll(/([a-z]{2}):/g)].map((m) => m[1]) : [];
for (const code of ['ar', 'ur']) {
  if (codes.includes(code) && !rtlCodes.includes(code)) {
    fail(`"${code}" is right-to-left but missing from the RTL map in app.js.`);
  }
}

/* ---------- 7. Head essentials ---------- */

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

/* ---------- 8. CSS classes used in the markup exist ---------- */

const cssClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const htmlClasses = new Set(
  [...allHtml.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean)
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
