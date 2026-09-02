#!/usr/bin/env node
/**
 * run-naviar/driver.mjs
 * NAVIAR brand contact sheet sürücüsü.
 * Kullanım:
 *   node driver.mjs shot <outdir>        → viewport ekran görüntüsü
 *   node driver.mjs full <outdir>        → tam sayfa görüntüsü
 *   node driver.mjs studies <outdir>     → her çalışmanın ayrı görüntüsü (S1–S10)
 *   node driver.mjs smoke <outdir>       → hızlı doğrulama (çıkış kodu 0/1)
 *
 * Yollar brand/naviar/ kökünden.
 */
import { createServer } from 'http';
import { createReadStream, existsSync, mkdirSync, readdirSync } from 'fs';
import { extname, join, resolve } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dir = fileURLToPath(new URL('.', import.meta.url));
// Serve the brand/naviar directory (2 levels up from skill dir)
const SERVE_ROOT = resolve(__dir, '../../../');
const PORT = 8091;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.json': 'application/json', '.ico': 'image/x-icon',
};

function startServer() {
  return new Promise((ok, fail) => {
    const s = createServer((req, res) => {
      const file = join(SERVE_ROOT, req.url === '/' ? 'index.html' : req.url);
      if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
      const mime = MIME[extname(file)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      createReadStream(file).pipe(res);
    });
    s.listen(PORT, () => ok(s));
    s.on('error', fail);
    setTimeout(() => fail(new Error('server timeout')), 5000);
  });
}

async function withBrowser(fn) {
  const req = createRequire('/opt/node22/lib/node_modules/');
  const { chromium } = req('playwright');
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  try { return await fn(browser); } finally { await browser.close(); }
}

const [cmd, outArg] = process.argv.slice(2);
const outDir = outArg || '/tmp/naviar-run';
mkdirSync(outDir, { recursive: true });

const server = await startServer();

try {
  if (cmd === 'shot' || !cmd) {
    await withBrowser(async browser => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(800);
      const out = join(outDir, 'naviar-viewport.png');
      await page.screenshot({ path: out });
      console.log('SHOT:', out);
    });

  } else if (cmd === 'full') {
    await withBrowser(async browser => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(800);
      const out = join(outDir, 'naviar-full.png');
      await page.screenshot({ path: out, fullPage: true });
      console.log('FULL:', out);
    });

  } else if (cmd === 'studies') {
    // Screenshot each study card individually by navigating to the SVG files
    const studiesDir = join(SERVE_ROOT, 'studies');
    const svgs = readdirSync(studiesDir).filter(f => f.endsWith('.svg')).sort();
    await withBrowser(async browser => {
      for (const svg of svgs) {
        const page = await browser.newPage({ viewport: { width: 800, height: 850 } });
        await page.goto(`http://localhost:${PORT}/studies/${svg}`, { waitUntil: 'networkidle', timeout: 15000 });
        const name = svg.replace('.svg', '');
        const out = join(outDir, `${name}.png`);
        await page.screenshot({ path: out });
        await page.close();
        console.log('STUDY:', out);
      }
    });

  } else if (cmd === 'smoke') {
    let pass = true;
    await withBrowser(async browser => {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      page.on('pageerror', e => { console.error('PAGE ERROR:', e.message); pass = false; });

      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle', timeout: 20000 });

      // 1. Title check
      const title = await page.title();
      if (!title.includes('NAVIAR')) { console.error('❌ title missing NAVIAR'); pass = false; }
      else console.log('✅ title:', title);

      // 2. SVG studies present
      const svgCount = await page.evaluate(() =>
        document.querySelectorAll('img[src*="studies/"], object[data*="studies/"], .study-card').length
      );
      // Also check inline SVGs or iframes
      const studyCards = await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="study"],[id*="study"],[class*="card"]');
        return cards.length;
      });
      if (svgCount === 0 && studyCards === 0) {
        // Just check that some SVG content is in the page
        const hasSvg = await page.evaluate(() => !!document.querySelector('svg,img'));
        if (!hasSvg) { console.error('❌ no studies/images found'); pass = false; }
        else console.log('✅ content present (SVG/img detected)');
      } else {
        console.log(`✅ study elements: ${Math.max(svgCount, studyCards)}`);
      }

      // 3. Screenshot
      await page.screenshot({ path: join(outDir, 'smoke.png') });
      console.log('✅ screenshot saved');
    });

    console.log(pass ? 'SMOKE: PASS' : 'SMOKE: FAIL');
    process.exitCode = pass ? 0 : 1;
  } else {
    console.error('Bilinmeyen komut:', cmd);
    console.error('Kullanım: driver.mjs [shot|full|studies|smoke] <outdir>');
    process.exitCode = 1;
  }
} finally {
  server.close();
}
