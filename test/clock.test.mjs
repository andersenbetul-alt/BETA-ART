/* Checks the things that actually went wrong, run by `npm test` on node 18, 20 and 22.
 *
 * script.js is browser code — it touches document and localStorage — so it cannot simply be
 * imported here. The timezone table is a plain array literal, though, and that table is where
 * the shipped bug lived: Bangkok appeared twice, both cards derived their element ids from the
 * same IANA name, the ids collided, and the second card never updated. A duplicate is not a
 * typo you catch by reading; it is a test.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

/* ---------- 1. every file the page loads parses ---------- */

try {
  execFileSync(process.execPath, ['--check', join(root, 'script.js')]);
} catch (err) {
  failures.push(`script.js does not parse:\n${err.stderr}`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
for (const file of ['styles.css', 'script.js']) {
  check(html.includes(file), `index.html does not load ${file}`);
}

/* ---------- 2. the timezone table ---------- */

const source = readFileSync(join(root, 'script.js'), 'utf8');
const literal = source.match(/const timezones = (\[[\s\S]*?\n\]);/);
check(Boolean(literal), 'Could not find the timezones array in script.js');

if (literal) {
  const timezones = new Function(`return ${literal[1]}`)();
  check(timezones.length > 0, 'The timezone list is empty');

  const seen = new Map();
  for (const zone of timezones) {
    check(typeof zone.name === 'string' && zone.name.length > 0, `A zone has no name: ${JSON.stringify(zone)}`);
    check(typeof zone.emoji === 'string' && zone.emoji.length > 0, `${zone.name} has no emoji`);

    // Duplicates are the bug: two cards, one set of element ids, one of them dead.
    if (seen.has(zone.tz)) {
      failures.push(`${zone.tz} is listed twice — as "${seen.get(zone.tz)}" and "${zone.name}". ` +
        'Both cards would share element ids and only the first would ever update.');
    }
    seen.set(zone.tz, zone.name);

    // A name Intl does not know throws at render time and takes the whole tick with it.
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: zone.tz }).format(new Date());
    } catch (err) {
      failures.push(`${zone.name}: "${zone.tz}" is not a timezone this runtime knows`);
    }
  }
}

/* ---------- 3. the patterns that produced wrong times ---------- */

// Comments describe the old bugs on purpose, so strip them before pattern-matching or the
// explanation of a fix reads as the fault itself. (It did, the first time this test ran.)
const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');

// new Date(x.toLocaleString(...)) builds a Date in the runtime's own zone holding another
// zone's digits. Every reading taken from it is wrong the moment it is used for arithmetic.
check(!/new Date\([^)]*toLocaleString/.test(code),
  'script.js reconstructs a Date from toLocaleString — use Intl.DateTimeFormat.formatToParts');

// Building a card's markup once is fine; rewriting it on every tick is what killed the blink,
// because the colon spans were replaced and their CSS animation restarted each second.
const updateBody = code.match(/function updateClock\([\s\S]*?\n}/);
check(Boolean(updateBody), 'Could not find updateClock in script.js');
check(updateBody && !/\.innerHTML\s*=/.test(updateBody[0]),
  'updateClock assigns innerHTML — the colon spans are replaced every second and never blink');

/* ---------- report ---------- */

if (failures.length) {
  console.error(`FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('OK — files parse, timezone table is unique and valid, no stale time patterns.');
