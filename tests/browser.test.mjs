/* Drives the real pages in a real browser. Accessibility is a legal
   requirement here, not a preference, so it is a test and not a checklist. */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { suite, test, assert, equal } from './harness.mjs';

const require = createRequire(import.meta.url);
const PORT = 8792;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['index.html?lang=no', 'index.html?lang=ar', 'personvern.html', 'vilkar.html', 'admin.html'];
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

function playwright() {
  try { return require('playwright'); } catch { /* not local */ }
  return require('/opt/node22/lib/node_modules/playwright');
}

export default async function () {
  const { chromium } = playwright();
  const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', '.'], { stdio: 'ignore' });

  let up = false;
  for (let i = 0; i < 40 && !up; i += 1) {
    try { up = (await fetch(BASE + '/index.html')).ok; } catch { /* not yet */ }
    if (!up) await new Promise(r => setTimeout(r, 250));
  }

  const browser = await chromium.launch();
  try {
    await suite('accessibility', async () => {
      await test('the site is served', () => assert(up, 'static server never came up'));

      for (const page of PAGES) {
        await test(`${page} has no WCAG 2.1 AA violations`, async () => {
          const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
          await p.goto(`${BASE}/${page}`, { waitUntil: 'load' });
          await p.waitForTimeout(900);
          await p.addScriptTag({ content: axe });
          const res = await p.evaluate(async (tags) =>
            await window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), WCAG);
          await p.close();
          const summary = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(', ');
          assert(res.violations.length === 0, summary);
        });
      }

      await test('every interactive target clears 24px on a phone', async () => {
        const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#bkBody .service-opt').nth(1).click();
        await p.waitForTimeout(400);
        const small = await p.evaluate(() => {
          const out = [];
          for (const e of document.querySelectorAll('a,button,input,select,[role=button]')) {
            const r = e.getBoundingClientRect();
            if (r.width && r.height && r.height < 24) {
              out.push(`${Math.round(r.height)}px ${e.tagName}${e.type ? '[' + e.type + ']' : ''}`);
            }
          }
          return out;
        });
        await ctx.close();
        assert(small.length === 0, small.join(', '));
      });

      await test('the consent checkbox is a real touch target', async () => {
        const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#bkBody .service-opt').nth(1).click();
        await p.waitForTimeout(400);
        const size = await p.evaluate(() => {
          const cb = document.querySelector('#bkBody input[type=checkbox]');
          const row = cb.closest('label');
          return { box: cb.getBoundingClientRect().height, row: row.getBoundingClientRect().height };
        });
        await ctx.close();
        assert(size.box >= 24, `box is ${Math.round(size.box)}px`);
        assert(size.row >= 44, `row is ${Math.round(size.row)}px`);
      });
    });

    await suite('booking flow', async () => {
      const open = async (url = '/index.html?lang=no') => {
        const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        const errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.goto(BASE + url, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        return { p, errors };
      };

      await test('four offers are shown, and only four', async () => {
        const { p, errors } = await open();
        equal(await p.locator('#bkBody .service-opt').count(), 4);
        equal(await p.locator('#priceCards .card').count(), 4);
        assert(!errors.length, errors.join('; '));
        await p.close();
      });

      await test('a delivery service skips the time step', async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt').nth(1).click();
        await p.waitForTimeout(300);
        const steps = await p.locator('#bkSteps li').count();
        equal(steps, 3, 'K01 should have three steps, not four');
        await p.close();
      });

      await test('the interpreter step says the agency should pay', async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt').nth(3).click();
        await p.waitForTimeout(400);
        await p.locator('#bkBody .slot:not([disabled])').first().click();
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(300);
        const notices = await p.locator('#bkBody .status.info').allTextContents();
        assert(notices.some(t => /tolk/i.test(t)), 'interpreter notice missing');
        await p.close();
      });

      await test('the consent box links to the privacy notice', async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt').nth(1).click();
        await p.waitForTimeout(300);
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(300);
        equal(await p.locator('#bkBody .consent a').getAttribute('href'), 'personvern.html');
        await p.close();
      });
    });

    await suite('return from Stripe', async () => {
      const confirm = async (query) => {
        const p = await browser.newPage();
        await p.goto(`${BASE}/index.html?lang=no&${query}#booking`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        const out = {
          confirmed: await p.locator('#bkBody .confirm').count() > 0,
          form: await p.locator('#bkBody .service-opt').count() > 0,
          ref: await p.locator('#bkBody .ref-box').count() ? (await p.locator('#bkBody .ref-box').textContent()).trim() : null,
          ok: await p.locator('#bkBody .status.ok').count() > 0
        };
        await p.close();
        return out;
      };

      await test('a paid return shows the reference', async () => {
        const r = await confirm('booking=NAV-ABC123');
        assert(r.confirmed, 'no confirmation shown');
        equal(r.ref, 'NAV-ABC123');
        assert(r.ok, 'payment confirmation missing');
      });

      await test('a cancelled return keeps the case but claims no payment', async () => {
        const r = await confirm('cancelled=NAV-ABC123');
        assert(r.confirmed, 'no confirmation shown');
        equal(r.ref, 'NAV-ABC123');
        assert(!r.ok, 'a cancelled payment must not read as paid');
      });

      await test('a malformed reference does not fake a confirmation', async () => {
        const r = await confirm('booking=<script>');
        assert(!r.confirmed, 'junk reference produced a confirmation');
        assert(r.form, 'the booking form should be shown instead');
      });
    });

    await suite('legal pages', async () => {
      await test('Norwegian is shown to a Norwegian reader', async () => {
        const ctx = await browser.newContext({ locale: 'nb-NO' });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/personvern.html`, { waitUntil: 'load' });
        await p.waitForTimeout(400);
        equal((await p.locator('main:not([hidden]) h1').textContent()).trim(), 'Personvernerklæring');
        equal(await p.locator('main:not([hidden])').count(), 1, 'only one version may be visible');
        await ctx.close();
      });

      await test('a reader who chose another language gets English', async () => {
        const ctx = await browser.newContext({ locale: 'nb-NO' });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html?lang=tr`, { waitUntil: 'load' });
        await p.waitForTimeout(700);
        await p.goto(`${BASE}/vilkar.html`, { waitUntil: 'load' });
        await p.waitForTimeout(400);
        equal((await p.locator('main:not([hidden]) h1').textContent()).trim(), 'Terms of service');
        await ctx.close();
      });

      await test('company details are filled from config, not hardcoded', async () => {
        const p = await browser.newPage();
        await p.goto(`${BASE}/personvern.html`, { waitUntil: 'load' });
        await p.waitForTimeout(400);
        const org = (await p.locator('[data-company="orgNumber"]').first().textContent()).trim();
        assert(org && org !== '—', 'org number not filled');
        const email = await p.evaluate(() => window.NAVIAR_CONFIG.company.email);
        equal(await p.locator('a[data-company-mail]').first().getAttribute('href'), 'mailto:' + email);
        await p.close();
      });
    });

    await suite('without JavaScript', async () => {
      await test('a visitor still gets a way to reach a human', async () => {
        const ctx = await browser.newContext({ javaScriptEnabled: false });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
        const text = await p.locator('body').innerText();
        await ctx.close();
        assert(/JavaScript/i.test(text), 'no noscript notice');
        assert(/post@naviarconsult\.com/.test(text), 'no email offered');
        assert(/\+47/.test(text), 'no phone number offered');
      });
    });
  } finally {
    await browser.close();
    server.kill();
  }
}
