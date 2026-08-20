#!/usr/bin/env node
/* =============================================================================
   Checks that every locale in assets/i18n has exactly the same key set as the
   English master, and that every language listed in config.js has a file.

   Run before committing a translation change:  node tools/check-i18n.js
   ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'assets', 'i18n');

function keys(value, prefix = '') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => keys(v, prefix + '.' + k));
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keys(v, prefix + '[' + i + ']'));
  }
  return [prefix];
}

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'js', 'config.js'), 'utf8'), sandbox);
const declared = sandbox.window.NAVIAR_CONFIG.languages.map((l) => l.code);

const master = new Set(keys(load('en.json')));
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
let failed = false;

for (const file of files) {
  const code = path.basename(file, '.json');
  const found = new Set(keys(load(file)));
  const missing = [...master].filter((k) => !found.has(k));
  const extra = [...found].filter((k) => !master.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`✗ ${file}`);
    if (missing.length) console.error(`    missing (${missing.length}): ${missing.slice(0, 6).join(', ')}`);
    if (extra.length) console.error(`    extra   (${extra.length}): ${extra.slice(0, 6).join(', ')}`);
  } else {
    console.log(`✓ ${file}  ${found.size} keys${declared.includes(code) ? '' : '  (not listed in config.js)'}`);
  }
}

const orphans = declared.filter((c) => !files.includes(c + '.json'));
if (orphans.length) {
  failed = true;
  console.error(`✗ config.js lists languages with no file: ${orphans.join(', ')}`);
}

process.exit(failed ? 1 : 0);
