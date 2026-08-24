#!/usr/bin/env node
// Driver for BETA ART / Cobban — a static site with no build step.
//
// Serves src/ over HTTP (NOT file://, which breaks ES modules and absolute
// nav hrefs) and drives it with Playwright against the container's
// pre-installed Chromium.
//
//   node .claude/skills/run-beta-art/driver.mjs smoke
//   node .claude/skills/run-beta-art/driver.mjs shot mobile /tmp/m.png
//   node .claude/skills/run-beta-art/driver.mjs eval "document.title"
//   node .claude/skills/run-beta-art/driver.mjs repl      # stdin commands
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { chromium } from 'playwright';

// The container ships Chromium here. Playwright's own default cache is empty,
// so launch() fails without this — see SKILL.md Gotchas.
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const ROOT = resolve(process.env.SRC_DIR || 'src');
const PORT = Number(process.env.PORT || 8123);
const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 390, height: 844 } };
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

async function serve() {
  const server = createServer(async (req, res) => {
    const url = req.url.split('?')[0];
    const file = join(ROOT, url === '/' ? 'index.html' : url);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      // /work, /about, /contact have no files yet — real 404s, not a bug here.
      res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404');
    }
  });
  await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));
  return server;
}

async function open(browser, vp = 'desktop') {
  const page = await browser.newPage({ viewport: VIEWPORTS[vp] ?? VIEWPORTS.desktop });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
  // Layout assertions are only meaningful once fonts settle.
  await page.evaluate(() => document.fonts.ready);
  page.__errors = errors;
  return page;
}

// Open the mobile menu and WAIT for it — clicking alone does not guarantee
// the handler ran, and a transform mid-animation measures in sub-pixels.
async function openMenu(page) {
  await page.click('.nav-toggle');
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector('.nav-links')).display !== 'none');
  await page.evaluate(() => Promise.all(
    document.querySelector('.nav-links').getAnimations().map((a) => a.finished)));
}

const cmds = {
  async smoke(browser) {
    const out = [];
    let page = await open(browser, 'desktop');
    out.push(`desktop  title=${JSON.stringify(await page.title())} links=${(await page.$$('.nav-links a')).length}`);
    await page.screenshot({ path: '/tmp/beta-art-desktop.png' });
    out.push(`auth     ${await page.$eval('.auth-button', e =>
      `text="${e.textContent.trim()}" disabled=${e.disabled} title="${e.title}"`)}`);
    await page.close();

    page = await open(browser, 'mobile');
    out.push(`mobile   menu before=${await page.$eval('.nav-links', e => getComputedStyle(e).display)}`);
    await openMenu(page);
    out.push(`mobile   menu after =${await page.$eval('.nav-links', e => getComputedStyle(e).display)} aria=${await page.$eval('.nav-toggle', e => e.getAttribute('aria-expanded'))}`);
    await page.screenshot({ path: '/tmp/beta-art-mobile-open.png' });
    await page.keyboard.press('Escape');
    out.push(`mobile   after Esc =${await page.$eval('.nav-links', e => getComputedStyle(e).display)}`);
    out.push(`errors   ${page.__errors.length ? page.__errors.join(' | ') : 'none'}`);
    await page.close();
    out.push('shots    /tmp/beta-art-desktop.png /tmp/beta-art-mobile-open.png');
    return out.join('\n');
  },
  async shot(browser, vp = 'desktop', path = '/tmp/beta-art.png') {
    const page = await open(browser, vp);
    if (vp === 'mobile' && process.env.MENU === 'open') await openMenu(page);
    await page.screenshot({ path });
    await page.close();
    return `wrote ${path} (${vp})`;
  },
  // Checks the OPEN skip-link defect. `npm test` passes on the broken
  // behaviour, so this is the only way to observe it.
  async skiplink(browser) {
    const page = await open(browser, 'desktop');
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement.textContent.trim());
    await page.keyboard.press('Enter');
    const active = await page.evaluate(() => document.activeElement.id || document.activeElement.tagName);
    await page.keyboard.press('Tab');
    const next = await page.evaluate(() => document.activeElement.textContent.trim());
    await page.close();
    const ok = active === 'main';
    return `first Tab   = "${first}"\nafter Enter = ${active}\nnext Tab    = "${next}"\nskip link works: ${ok}${ok ? '' : '  <- OPEN DEFECT: <main> needs tabindex="-1"'}`;
  },
  async eval(browser, ...js) {
    const page = await open(browser, process.env.VP || 'desktop');
    const r = await page.evaluate(js.join(' '));
    await page.close();
    return JSON.stringify(r);
  },
};

const server = await serve();
const browser = await chromium.launch({ executablePath: EXE });
const [cmd = 'smoke', ...args] = process.argv.slice(2);

if (cmd === 'repl') {
  console.log(`ready on :${PORT} — commands: smoke | shot <vp> <path> | eval <js> | quit`);
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    const [c, ...a] = line.trim().split(/\s+/);
    if (!c) continue;
    if (c === 'quit') break;
    try { console.log(cmds[c] ? await cmds[c](browser, ...a) : `unknown: ${c}`); }
    catch (e) { console.log(`ERROR ${e.message.split('\n')[0]}`); }
  }
} else {
  try { console.log(await cmds[cmd](browser, ...args)); }
  catch (e) { console.error(`ERROR ${e.message.split('\n')[0]}`); process.exitCode = 1; }
}
await browser.close();
server.close();
