// Build for a static site: validate the sources, then emit them to dist/.
// There is no bundler by design (D-002) — the build's job is to fail loudly
// on anything that would ship broken, not to transform code.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'src';
const OUT = 'dist';
const FILES = ['index.html', 'styles.css', 'nav.js'];
const errors = [];

const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const sources = Object.fromEntries(
  await Promise.all(FILES.map(async (f) => [f, await readFile(join(SRC, f), 'utf8')])),
);

// --- HTML -------------------------------------------------------------
const html = sources['index.html'];
if (!/^<!doctype html>/i.test(html.trim())) fail('index.html', 'missing doctype');
if (!/<html[^>]+lang=/i.test(html)) fail('index.html', 'html element has no lang attribute');
if (!/<meta[^>]+viewport/i.test(html)) fail('index.html', 'missing viewport meta');
if (!/<title>[^<]+<\/title>/i.test(html)) fail('index.html', 'missing or empty title');

// Every referenced local asset must exist in the build.
for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (ref.startsWith('/') || ref.startsWith('http') || ref.startsWith('#')) continue;
  if (!FILES.includes(ref)) fail('index.html', `references missing asset "${ref}"`);
}

// Tags must balance — a stray close tag silently reshapes the layout.
const VOID = new Set(['meta', 'link', 'br', 'hr', 'img', 'input', 'source']);
const stack = [];
for (const [, close, tag] of html.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b[^>]*?(\/?)>/gi)) {
  const name = tag.toLowerCase();
  if (VOID.has(name)) continue;
  if (close) {
    if (stack.pop() !== name) fail('index.html', `unbalanced </${name}>`);
  } else if (!/\/>$/.test(RegExp.lastMatch)) {
    stack.push(name);
  }
}
if (stack.length) fail('index.html', `unclosed <${stack.join('>, <')}>`);

// --- CSS --------------------------------------------------------------
const css = sources['styles.css'];
const braces = (css.match(/{/g) ?? []).length - (css.match(/}/g) ?? []).length;
if (braces !== 0) fail('styles.css', `unbalanced braces (${braces > 0 ? braces + ' unclosed' : -braces + ' extra'})`);

// Every var(--x) must have a matching --x: declaration.
const declared = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
for (const [, used] of css.matchAll(/var\((--[a-z0-9-]+)/gi)) {
  if (!declared.has(used)) fail('styles.css', `var(${used}) is never declared`);
}

// --- JS ---------------------------------------------------------------
try {
  new (async () => {}).constructor(sources['nav.js']);
} catch (e) {
  fail('nav.js', `syntax error — ${e.message}`);
}

// --- emit -------------------------------------------------------------
if (errors.length) {
  console.error('build failed:\n' + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
for (const f of FILES) await writeFile(join(OUT, f), sources[f]);

console.log(`build clean — validated and emitted ${FILES.length} files to ${OUT}/`);
