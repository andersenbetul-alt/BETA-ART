#!/usr/bin/env node
/* Write the figures from assets/data/figures.json into index.html's no-JS fallback text.
 *
 *   npm run figures
 *
 * The workflow for a number that changed is: edit figures.json, run this, commit. Nothing
 * else needs touching — app.js fills the live page from the same file, build.mjs bakes it
 * into the twelve pre-rendered pages in each language's own formatting, and npm run check
 * fails if the markup and the file ever disagree.
 *
 * Only index.html is written, because it is the only place a number is typed out: the
 * dictionaries carry {n}. */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIG = JSON.parse(readFileSync(join(root, 'assets/data/figures.json'), 'utf8'));
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

// The one dictionary string that prints a number: its fallback in the markup is the English
// dictionary's text with {n} filled in.
const template = String(
  new Function('window', readFileSync(join(root, 'assets/js/i18n.js'), 'utf8') + '; return window.HXI_I18N.en.music_help_streams;')({}),
);
const streams = fmt(FIG.streams_help_urself.value, false);
after = after.replace(
  /(data-i18n="music_help_streams">)([^<]*)(<)/,
  (match, open, text, close) => {
    const value = template.replace('{n}', streams);
    if (value !== text) changes.push(`music_help_streams: ${text} → ${value}`);
    return open + value + close;
  },
);

if (after === before) {
  console.log('Figures already match.');
} else {
  writeFileSync(file, after);
  console.log(`Updated index.html:\n  ${changes.join('\n  ')}`);
}
