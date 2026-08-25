#!/usr/bin/env node
/* The gate for /performance-review. The skill may not score or draft unless
   the organisation's own framework files exist and have content — fidelity
   to the framework is the whole point, and a missing file is how invented
   criteria sneak in. Exit 0 = proceed; exit 1 = stop and tell the manager
   what to add. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'framework');

const REQUIRED = {
  'competencies.md': 'the competencies, one "## " heading each',
  'ratings.md': 'the rating scale with every level\'s verbatim definition',
  'template.md': 'the review template\'s exact section headings'
};

let ok = true;
for (const [file, holds] of Object.entries(REQUIRED)) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) {
    console.error(`MISSING  framework/${file} — ${holds}`);
    ok = false;
    continue;
  }
  const raw = fs.readFileSync(p, 'utf8');
  const headings = (raw.match(/^## /gm) || []).length;
  if (headings < 2) {
    console.error(`NO ITEMS framework/${file} — expected "## " headings, one per item`);
    ok = false;
    continue;
  }
  /* A template is legitimately mostly headings; the other two must carry the
     organisation's own words under each heading — that is what gets quoted. */
  if (file !== 'template.md' && raw.replace(/^#.*$/gm, '').trim().length < 40) {
    console.error(`EMPTY    framework/${file} — headings alone are not definitions`);
    ok = false;
    continue;
  }
  console.log(`ok       framework/${file}`);
}

if (!ok) {
  console.error('\nThe framework is incomplete. The skill must stop here: it quotes');
  console.error('definitions verbatim and cannot quote what does not exist.');
  process.exit(1);
}
console.log('\nFramework present — proceed to Step 1 (intake).');
