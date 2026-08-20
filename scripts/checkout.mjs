#!/usr/bin/env node
/* Put a product on sale, or take it off.
 *
 *   npm run checkout -- --id drumkit-01 --url https://hxi.lemonsqueezy.com/buy/xxxx
 *   npm run checkout -- --id drumkit-01 --clear
 *   npm run checkout                                  (list the catalogue and its state)
 *
 * A product is for sale exactly when its `checkout` is a URL, so this is the whole act of
 * opening one. Use the provider's **hosted** checkout link, not an embedded overlay: the
 * overlay needs a third-party script and frame, which the page's Content-Security-Policy
 * refuses on purpose — no third-party request before the visitor asks for one.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'assets/js/shop.js');
const source = readFileSync(file, 'utf8');

const sandbox = { window: {} };
new Function('window', source)(sandbox.window);
const catalogue = sandbox.window.HXI_SHOP || [];

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1] ?? '';
};
const id = arg('--id');
const url = arg('--url');
const clear = argv.includes('--clear');

if (!id) {
  const width = Math.max(...catalogue.map((p) => p.id.length));
  for (const p of catalogue) {
    const price = p.free ? 'free' : p.price ? `${p.price.amount} ${p.price.currency}` : '—';
    const state = p.checkout ? 'ON SALE' : 'coming soon';
    console.log(`${p.id.padEnd(width)}  ${price.padStart(11)}  ${state}${p.checkout ? '  ' + p.checkout : ''}`);
  }
  console.log('\nnpm run checkout -- --id <id> --url <hosted checkout URL>');
  process.exit(0);
}

const product = catalogue.find((p) => p.id === id);
if (!product) {
  console.error(`No product with id "${id}". Run npm run checkout with no arguments to list them.`);
  process.exit(1);
}
if (!clear) {
  if (!url) {
    console.error('Give --url <hosted checkout URL>, or --clear to take the product off sale.');
    process.exit(1);
  }
  if (!/^https:\/\/\S+$/.test(url)) {
    console.error(`"${url}" is not an https URL. A checkout link has to be https — it is where money is typed.`);
    process.exit(1);
  }
  if (!product.price && !product.free) {
    console.error(`"${id}" has no price. Set one in shop.js before putting it on sale, or the card`);
    console.error('will show a Buy button with nothing beside it.');
    process.exit(1);
  }
}

// Rewrite this product's checkout line only, leaving the file's comments and shape alone.
const block = new RegExp(`(id: '${id}',[\\s\\S]*?checkout: ')([^']*)(')`);
if (!block.test(source)) {
  console.error(`Could not find the checkout line for "${id}" in shop.js.`);
  process.exit(1);
}
const next = source.replace(block, `$1${clear ? '' : url}$3`);
writeFileSync(file, next);

console.log(clear
  ? `${id} is off sale — the card goes back to "coming soon".`
  : `${id} is on sale: ${url}`);
console.log('Run npm run check, then commit.');
