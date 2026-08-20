#!/usr/bin/env node
/* Bundles one built page into a single self-contained HTML file — CSS, JS, fonts and
   images embedded — so the site can be previewed or shared without a server.

   node scripts/inline.mjs [dist/index.html] [out.html]                                    */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(repo, process.argv[2] || 'dist/index.html');
// Deliberately not inside dist/: everything in dist/ is published, and a second copy of
// the homepage at /hxi-standalone.html would be duplicate content on the live site.
const out = resolve(repo, process.argv[3] || 'preview/hxi-standalone.html');
const base = dirname(src);

const MIME = { '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const dataUri = async (path) => {
  const ext = path.slice(path.lastIndexOf('.'));
  const buf = await readFile(path);
  return `data:${MIME[ext] || 'application/octet-stream'};base64,${buf.toString('base64')}`;
};

let html = await readFile(src, 'utf8');

// stylesheets, in order, with their url(...) references embedded first
for (const [tag, href] of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g)].map((m) => [m[0], m[1]])) {
  const cssPath = join(base, href);
  let css = await readFile(cssPath, 'utf8');
  for (const [full, , ref] of [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)]) {
    if (ref.startsWith('data:')) continue;
    css = css.replace(full, `url(${await dataUri(join(dirname(cssPath), ref))})`);
  }
  html = html.replace(tag, `<style>\n${css}\n</style>`);
}

// scripts, in the order they appear
for (const [tag, srcAttr] of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => [m[0], m[1]])) {
  const js = await readFile(join(base, srcAttr), 'utf8');
  html = html.replace(tag, `<script>\n${js}\n</script>`);
}

// images and icons referenced from the markup
for (const [, ref] of html.matchAll(/(?:href|content|src)="((?:\.\.\/)?assets\/[^"]+\.(?:png|svg))"/g)) {
  html = html.split(`"${ref}"`).join(`"${await dataUri(join(base, ref))}"`);
}

// The CSP names the origin's own files; an inlined page has none, and the meta tag would
// block its own <style>/<script>. Everything it protected is now part of this file.
html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, '');

await mkdir(dirname(out), { recursive: true });
await writeFile(out, html);
console.log(`Inlined ${src.replace(repo + '/', '')} → ${out.replace(repo + '/', '')} (${(html.length / 1024).toFixed(0)} KB)`);
