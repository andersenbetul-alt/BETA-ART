/* Runs the suites. `node tests/run.mjs` runs everything; pass a name to run
   one — data and server are fast, browser takes a couple of minutes. */
import { report } from './harness.mjs';

const SUITES = {
  build: () => import('./build.test.mjs'),
  data: () => import('./data.test.mjs'),
  server: () => import('./server.test.mjs'),
  browser: () => import('./browser.test.mjs')
};

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(SUITES);

for (const name of names) {
  if (!SUITES[name]) {
    console.error(`unknown suite: ${name} (have: ${Object.keys(SUITES).join(', ')})`);
    process.exit(2);
  }
  const mod = await SUITES[name]();
  await mod.default();
}

process.exit(report() === 0 ? 0 : 1);
