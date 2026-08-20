#!/usr/bin/env node
/* Set the figures the page states as fact, and write them into index.html's no-JS fallback.
 *
 *   npm run figures -- --listeners 252400
 *   npm run figures -- --streams 43500000 --listeners 252400
 *   npm run figures                      (rewrite the markup from the file, change nothing)
 *
 * Read the two numbers off Spotify for Artists — the stream count on the "help urself" track
 * page, monthly listeners on the dashboard — and pass them here. The script stamps today's
 * date on whatever it changed, so `checkedAt` never lies about how old a figure is.
 *
 * Then commit. Nothing else needs touching: app.js fills the live page from the same file,
 * build.mjs bakes it into the twelve pre-rendered pages in each language's own formatting,
 * and npm run check fails if the markup and the file ever disagree.
 *
 * Only index.html is written, because it is the only place a number is typed out: the
 * dictionaries carry {n}. */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const figuresFile = join(root, 'assets/data/figures.json');
const FIG = JSON.parse(readFileSync(figuresFile, 'utf8'));

// --streams / --listeners set a value and stamp it with today's date.
const ARGS = { '--streams': 'streams_help_urself', '--listeners': 'monthly_listeners' };
const today = new Date().toISOString().slice(0, 10);
const argv = process.argv.slice(2);
let figuresChanged = false;

for (let i = 0; i < argv.length; i += 1) {
  const key = ARGS[argv[i]];
  if (!key) {
    if (argv[i].startsWith('--')) {
      console.error(`Unknown option ${argv[i]}. Use --streams and/or --listeners.`);
      process.exit(1);
    }
    continue;
  }
  const raw = (argv[i + 1] || '').replace(/[\s.,_]/g, '');
  if (!/^\d+$/.test(raw)) {
    console.error(`${argv[i]} needs a number, got "${argv[i + 1] ?? ''}".`);
    process.exit(1);
  }
  i += 1;
  const value = Number(raw);
  const previous = FIG[key].value;
  FIG[key].value = value;
  FIG[key].checkedAt = today;
  figuresChanged = true;
  console.log(previous === value
    ? `${key}: unchanged at ${value}, checked ${today}`
    : `${key}: ${previous} → ${value}, checked ${today}`);
}

if (figuresChanged) writeFileSync(figuresFile, JSON.stringify(FIG, null, 2) + '\n');
const SLOT = { streams: 'streams_help_urself', listeners: 'monthly_listeners' };
const fmt = (v, compact) =>
  new Intl.NumberFormat('en', compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(v);

const file = join(root, 'index.html');
const before = readFileSync(file, 'utf8');
const changes = [];

let after = before.replace(
  /(<(\w+)([^>]*?)data-figure="([a-z_]+)"([^>]*?)>)([^<]*)(<\/\2>)/g,
  (match, open, tag, pre, name, post, text, close) => {
    const parts = name.split('_');
    const shape = parts.pop();
    const figure = FIG[SLOT[parts.join('_')]];
    if (!figure) {
      console.error(`index.html has data-figure="${name}", which figures.json does not define.`);
      process.exitCode = 1;
      return match;
    }
    const value = shape === 'compact'
      ? fmt(figure.value, true) + (name === 'streams_compact' ? '+' : '')
      : fmt(figure.value, false);
    if (value !== text) changes.push(`${name}: ${text} → ${value}`);
    return open + value + close;
  },
);

// Dictionary strings that print a figure carry a {token}. Their fallback text in the markup
// is the English string with the tokens filled in, so it is written from the same source.
const sandbox = { window: {} };
new Function('window', readFileSync(join(root, 'assets/js/i18n.js'), 'utf8'))(sandbox.window);
const en = sandbox.window.HXI_I18N.en;

for (const [key, template] of Object.entries(en)) {
  if (typeof template !== 'string' || !/\{[a-z_]+\}/.test(template)) continue;
  const value = template.replace(/\{([a-z_]+)\}/g, (token, name) =>
    FIG[name] ? fmt(FIG[name].value, false) : token);
  after = after.replace(
    new RegExp(`(data-i18n="${key}">)([^<]*)(<)`),
    (match, open, text, close) => {
      if (value !== text) changes.push(`${key}: ${text} → ${value}`);
      return open + value + close;
    },
  );
}

if (after === before) {
  console.log('Figures already match.');
} else {
  writeFileSync(file, after);
  console.log(`Updated index.html:\n  ${changes.join('\n  ')}`);
}
