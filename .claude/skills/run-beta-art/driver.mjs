#!/usr/bin/env node
// BETA-ART surucusu: uretilen statik sayfalari gercekten tarayicida acar,
// olcer ve ekran goruntusu alir.
//
// Neden var: repodaki testler HTML'i METIN olarak kontrol eder. Tarayicida
// olusan sorunlar (yatay tasma, kopuk capa, tiklanamayan CTA) metin
// kontrolunden kacar. Bu surucu o katmani kapatir.
//
// Kullanim:  node .claude/skills/run-beta-art/driver.mjs <komut>
//   build    data/*.json -> *.html yeniden uret
//   serve    statik sunucuyu on planda calistir (Ctrl-C ile dur)
//   check    sayfalari tarayicida ac ve dogrula (cikis kodu 0/1)
//   shot     ekran goruntusu al -> /tmp/beta-shots/
//   all      build + check + shot

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const PAGES = ['index.html', 'work.html', 'team.html', 'review.html'];
const OUT = process.env.SHOT_DIR || '/tmp/beta-shots';
const PORT = Number(process.env.PORT || 8321);

// playwright global kurulu; yerel node_modules yok.
const require = createRequire(import.meta.url);
const PW_PATH = '/opt/node22/lib/node_modules/playwright';
const { chromium } = require(existsSync(PW_PATH) ? PW_PATH : 'playwright');

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css',
               '.js': 'text/javascript', '.svg': 'image/svg+xml',
               '.png': 'image/png', '.ico': 'image/x-icon',
               '.json': 'application/json' };

function serve() {
  const srv = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const file = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('404');
    }
  });
  return new Promise(r => srv.listen(PORT, '127.0.0.1', () => r(srv)));
}

function build() {
  for (const s of ['build.py', 'build_review.py']) {
    execFileSync('python3', [s], { cwd: ROOT, stdio: 'inherit' });
  }
  console.log('build: OK');
}

// Tarayicida calisan olcumler. Metin kontrolunun goremedigi seyler.
async function measure(page) {
  return page.evaluate(() => {
    const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
    const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
    return {
      title: document.title,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      dangling: links.filter(h => h.startsWith('#') && h.length > 1 && !ids.has(h.slice(1))),
      // disari acilan gercek eylem: mail, telefon veya harici baglanti
      actionable: links.filter(h => /^(mailto:|tel:|https?:)/.test(h)).length,
      // Kendine giden capa: hedefi, baglantiyi ICEREN oge.
      // Tiklaninca kendi bulundugu yere kayar — yani hicbir sey yapmaz.
      // Metin kontrolu bunu goremez: href gecerli, hedef mevcut.
      selfLinks: [...document.querySelectorAll('a[href^="#"]')]
        .filter(a => {
          const t = document.getElementById(a.getAttribute('href').slice(1));
          return t && t.contains(a);
        })
        .map(a => `${a.getAttribute('href')} ("${(a.textContent || '').trim().slice(0, 40)}")`),
    };
  });
}

async function withBrowser(fn) {
  const srv = await serve();
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
  try { return await fn(browser); }
  finally { await browser.close(); srv.close(); }
}

async function check() {
  let fail = 0, warn = 0;
  await withBrowser(async browser => {
    for (const width of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      for (const f of PAGES) {
        const resp = await page.goto(`http://127.0.0.1:${PORT}/${f}`, { waitUntil: 'load' });
        const tag = `${f} @${width}`;
        if (!resp || resp.status() !== 200) { console.log(`FAIL ${tag}: HTTP ${resp && resp.status()}`); fail++; continue; }
        const m = await measure(page);
        if (!m.title) { console.log(`FAIL ${tag}: baslik bos`); fail++; }
        if (m.scrollWidth > m.innerWidth + 1) {
          console.log(`FAIL ${tag}: yatay tasma ${m.scrollWidth} > ${m.innerWidth}`); fail++;
        }
        if (m.dangling.length) { console.log(`FAIL ${tag}: kopuk capa ${m.dangling.join(', ')}`); fail++; }
        if (m.selfLinks.length) {
          console.log(`FAIL ${tag}: kendine giden capa -> ${m.selfLinks.join(' | ')}`); fail++;
        }
        if (width === 1280 && m.actionable === 0) {
          console.log(`WARN ${tag}: disari acilan eylem yok (mailto/tel/http)`); warn++;
        }
        if (!fail) console.log(`ok   ${tag}  "${m.title.slice(0, 40)}"`);
      }
      await ctx.close();
    }
  });
  console.log(`\ncheck: ${fail} hata, ${warn} uyari`);
  return fail;
}

async function shot() {
  await mkdir(OUT, { recursive: true });
  const shots = [];
  await withBrowser(async browser => {
    for (const [label, viewport, scheme] of [
      ['desktop-light', { width: 1280, height: 900 }, 'light'],
      ['desktop-dark',  { width: 1280, height: 900 }, 'dark'],
      ['mobile-light',  { width: 390,  height: 844 }, 'light'],
    ]) {
      const ctx = await browser.newContext({ viewport, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const f of PAGES) {
        await page.goto(`http://127.0.0.1:${PORT}/${f}`, { waitUntil: 'load' });
        const out = join(OUT, `${f.replace('.html', '')}-${label}.png`);
        await page.screenshot({ path: out, fullPage: false });
        shots.push(out);
      }
      await ctx.close();
    }
  });
  await writeFile(join(OUT, 'index.txt'), shots.join('\n') + '\n');
  console.log(shots.join('\n'));
  console.log(`\nshot: ${shots.length} goruntu -> ${OUT}`);
  return 0;
}

const cmd = process.argv[2] || 'all';
let code = 0;
if (cmd === 'build') build();
else if (cmd === 'serve') {
  await serve();
  console.log(`http://127.0.0.1:${PORT}/  (Ctrl-C ile dur)`);
  await new Promise(() => {});   // surekli calis; process.exit'e dusme
}
else if (cmd === 'check') code = await check();
else if (cmd === 'shot') code = await shot();
else if (cmd === 'all') { build(); code = await check(); await shot(); }
else { console.error(`bilinmeyen komut: ${cmd}`); code = 2; }
process.exit(code);
