/* Render scripts/og-image.html to assets/og-image.png at 1200×630.
 *
 * Unlike scripts/icons.mjs this one needs a browser, because the card is typeset in the
 * site's own Barlow Condensed and only a real text engine gets those metrics right.
 * Run it after editing the card:  node scripts/og.mjs [path-to-chromium]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Playwright is not a dependency of the site — point PW_PATH at an install, or have
// one on the module path, only when you need to regenerate the card.
const { chromium } = await import(process.env.PW_PATH || 'playwright');
const browser = await chromium.launch(process.argv[2] ? { executablePath: process.argv[2] } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(root, 'scripts/og-image.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(root, 'assets/og-image.png') });
await browser.close();
console.log('assets/og-image.png');
