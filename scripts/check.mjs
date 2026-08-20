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
  // the card's category label is built as 'shop_' + kind, so the key never appears whole
  ...[...shopJs.matchAll(/kind:\s*'([a-z]+)'/g)].map((m) => `shop_${m[1]}`),
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
const enFigures = existsSync(join(root, 'assets/data/figures.json'))
  ? JSON.parse(read('assets/data/figures.json'))
  : null;
const fillTokens = (text) => text.replace(/\{([a-z_]+)\}/g, (token, name) =>
  enFigures && enFigures[name] ? new Intl.NumberFormat('en').format(enFigures[name].value) : token);

for (const [, , , key, , text] of html.matchAll(fallbackRe)) {
  let expected = DICTS.en?.[key];
  if (expected === undefined) continue;
  if (enFigures) expected = fillTokens(expected);
  if (unescape(text) !== expected) {
    fail(`fallback text for "${key}" does not match the en dictionary:\n` +
         `      markup: ${unescape(text)}\n` +
         `      en:     ${expected}`);
  }
}

/* ---------- 3b. Colours live in :root ----------
   CLAUDE.md: "Take colours and spacing from the tokens in :root; do not hardcode hex values
   in component rules." That rule was quietly broken in twenty-one places — four greys and
   six tints of the accent, spread across the component rules, which is how a palette drifts
   into having three near-blacks nobody chose. Colour only, and only outside :root. */

{
  // Every :root block, not just the first — @media print redefines the palette for paper,
  // and those values belong in a token block exactly like the screen ones do.
  const outside = css.replace(/:root\s*\{[^}]*\}/g, '');
  const literals = [...outside.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)/g)].map((m) => m[0]);
  if (literals.length) {
    fail(`style.css has ${literals.length} colour value(s) outside :root — move them to tokens: ` +
         [...new Set(literals)].join(', '));
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
    const expected = shape === 'checked'
      ? new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' })
          .format(new Date(figure.checkedAt + 'T00:00:00Z'))
      : shape === 'compact'
      ? fmt(figure.value, true) + (name === 'streams_compact' ? '+' : '')
      : fmt(figure.value, false);
    if (text !== expected) {
      fail(`index.html prints "${text}" for ${name}; figures.json says "${expected}".`);
    }
  }

  // The FAQ structured data is generated from the dictionary at build time. If someone edits
  // the JSON-LD by hand, or adds a question to the markup without adding the pair to the
  // dictionaries, the schema starts telling search engines something the page does not say.
  {
    const asked = [...html.matchAll(/data-i18n="faq_(q|a)(\d+)"/g)];
    const pairs = new Map();
    for (const [, kind, n] of asked) pairs.set(n, (pairs.get(n) || '') + kind);
    for (const [n, kinds] of pairs) {
      if (!kinds.includes('q') || !kinds.includes('a')) {
        fail(`FAQ item ${n} has only ${kinds === 'q' ? 'a question' : 'an answer'} in the markup — both are needed or the schema goes lopsided.`);
      }
    }
    // The generator walks faq_q1, faq_q2, … until one is missing, so a gap silently truncates
    // the schema. Catch the gap here instead.
    const numbers = [...pairs.keys()].map(Number).sort((a, b) => a - b);
    numbers.forEach((n, i) => {
      if (n !== i + 1) fail(`FAQ numbering jumps to faq_q${n} — the build stops at the first gap, so ${numbers.length - i} question(s) would vanish from the structured data.`);
    });
    if (numbers.length && !html.includes('data-faq-schema')) {
      fail('The page has an FAQ but no data-faq-schema block for the build to fill in.');
    }
  }

  // Any dictionary string that quotes one of these has to use the token, not a typed number.
  const TOKENED = { music_help_streams: 'streams_help_urself', music_xp_sub: 'streams_x_pirata' };
  for (const [code, dict] of Object.entries(DICTS)) {
    for (const [key, figure] of Object.entries(TOKENED)) {
      if (dict[key] && !dict[key].includes(`{${figure}}`)) {
        fail(`[${code}] ${key} has a number typed into it — use {${figure}} so figures.json stays the only source.`);
      }
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

// A translation in the wrong dictionary passes every other check here: the key exists, the
// value is a non-empty string, and nothing points at it being Spanish sitting in the Hindi
// block. Six of these languages have their own script, which makes the mistake mechanical to
// catch — and it is worth catching, because forty-four keys once sat in the wrong language
// after a dictionary order was assumed rather than read.
const SCRIPTS = {
  hi: [/[\u0900-\u097F]/, 'Devanagari'],
  bn: [/[\u0980-\u09FF]/, 'Bengali'],
  ru: [/[\u0400-\u04FF]/, 'Cyrillic'],
  zh: [/[\u4E00-\u9FFF]/, 'Han'],
  ar: [/[\u0600-\u06FF]/, 'Arabic'],
  ur: [/[\u0600-\u06FF]/, 'Arabic'],
};
// Values that are legitimately Latin in every language: an address, a placeholder, a name.
const LATIN_EVERYWHERE = new Set(['priv_contact', 'form_email']);

for (const [code, [script, name]] of Object.entries(SCRIPTS)) {
  const dict = DICTS[code];
  if (!dict) continue;
  const strays = [];
  for (const [key, value] of Object.entries(dict)) {
    if (LATIN_EVERYWHERE.has(key)) continue;
    // Only judge strings that are prose in English; skip codes, numbers and symbols.
    if (!/[A-Za-z]{3}/.test(DICTS.en?.[key] ?? '')) continue;
    if (!script.test(value)) strays.push(key);
  }
  if (strays.length) {
    fail(`[${code}] ${strays.length} value(s) contain no ${name} — wrong language in this ` +
      `dictionary? ${strays.slice(0, 8).join(', ')}${strays.length > 8 ? ' …' : ''}`);
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
