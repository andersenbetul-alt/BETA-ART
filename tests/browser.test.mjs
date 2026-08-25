/* Drives the real pages in a real browser. Accessibility is a legal
   requirement here, not a preference, so it is a test and not a checklist. */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { suite, test, assert, equal } from './harness.mjs';

const require = createRequire(import.meta.url);
const PORT = 8792;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['index.html?lang=no', 'index.html?lang=ar', 'personvern.html', 'vilkar.html',
               'hva-vi-gjor.html', 'karriere.html', 'admin.html'];
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/* playwright is a devDependency, so `npm ci` provides it. The absolute path is
   a fallback for a sandbox that has it installed globally and nowhere else;
   without the explicit error, a missing browser fails as a confusing
   MODULE_NOT_FOUND several frames deep. */
function playwright() {
  try { return require('playwright'); } catch { /* not installed locally */ }
  try { return require('/opt/node22/lib/node_modules/playwright'); } catch { /* nor globally */ }
  throw new Error(
    'playwright is missing. Run: npm ci && npx playwright install --with-deps chromium'
  );
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

  /* The pages link Google Fonts. Nothing under test depends on the webfont —
     the stylesheet uses display=swap, so text paints immediately in the
     fallback either way — but every goto waited on those two requests. Where
     the network is slow or the host is unreachable that wait was 12.6 seconds
     per page load, against 50 ms with the requests refused. A suite that is
     eight minutes on one machine and one minute on another, because of a CDN
     it does not test, is a suite nobody runs. */
  async function openPage(opts) {
    const p = await browser.newPage(opts);
    await p.route('**/*', (route) => (
      /fonts\.(googleapis|gstatic)\.com/.test(route.request().url())
        ? route.abort()
        : route.continue()
    ));
    return p;
  }

  async function openContext(opts) {
    const ctx = await browser.newContext(opts);
    await ctx.route('**/*', (route) => (
      /fonts\.(googleapis|gstatic)\.com/.test(route.request().url())
        ? route.abort()
        : route.continue()
    ));
    return ctx;
  }

  try {
    await suite('accessibility', async () => {
      await test('the site is served', () => assert(up, 'static server never came up'));

      for (const page of PAGES) {
        await test(`${page} has no WCAG 2.1 AA violations`, async () => {
          const p = await openPage({ viewport: { width: 1280, height: 900 } });
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
        const ctx = await openContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
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
        const ctx = await openContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#bkBody .service-opt').nth(1).click();   // a delivery service goes straight to the details form
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
        const p = await openPage({ viewport: { width: 1280, height: 900 } });
        const errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.goto(BASE + url, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        return { p, errors };
      };

      await test('all eight offers are shown, and only eight', async () => {
        const { p, errors } = await open();
        equal(await p.locator('#bkBody .service-opt').count(), 8);
        equal(await p.locator('#priceCards .card').count(), 8);
        assert(!errors.length, errors.join('; '));
        await p.close();
      });

      await test('a delivery service skips the time step', async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt', { hasText: 'AI Career Kit' }).click();
        await p.waitForTimeout(300);
        const steps = await p.locator('#bkSteps li').count();
        equal(steps, 3, 'a delivery service should have three steps, not four');
        await p.close();
      });

      await test('a meeting service still asks for a time', async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt').nth(5).click();   // CV and application review
        await p.waitForTimeout(400);
        equal(await p.locator('#bkSteps li').count(), 4, 'a meeting should have four steps');
        assert(await p.locator('#bkBody .slot').count() > 0, 'no times offered');
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

      /* Reaching the last step means filling in the details form first, so the
         helper walks it: service -> details -> confirm. */
      const reachConfirm = async () => {
        const { p } = await open();
        await p.locator('#bkBody .service-opt').nth(1).click();
        await p.waitForTimeout(300);
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(300);
        await p.fill('#bkBody [name="name"]', 'Test Testesen');
        await p.fill('#bkBody [name="email"]', 'test@example.com');
        await p.fill('#bkBody [name="phone"]', '+4740000000');
        await p.fill('#bkBody [name="caseText"]', 'Vet ikke hvilket skjema jeg skal bruke.');
        await p.check('#bkBody [name="consent"]');
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(300);
        return p;
      };

      await test('the last step asks for no money and offers no way to pay', async () => {
        const p = await reachConfirm();
        equal(await p.locator('#bkBody input[name="payment"]').count(), 0, 'a payment method is offered');
        equal(await p.locator('#bkBody .pay-opts').count(), 0, 'the payment block is still rendered');
        const info = (await p.locator('#bkBody .status.info').allTextContents()).join(' ');
        assert(/betaler ingenting|betalingslenke/i.test(info), 'nothing tells the customer they are not paying now');
        await p.close();
      });

      await test('the work we refuse is listed before the customer commits', async () => {
        const p = await reachConfirm();
        const items = await p.locator('#bkBody .risk-list li').count();
        assert(items >= 8, `only ${items} refusals listed`);
        const text = (await p.locator('#bkBody .risk-list').innerText()).toLowerCase();
        for (const must of ['bankid', 'vedtak', 'fullmakt']) {
          assert(text.includes(must), `the list never mentions ${must}`);
        }
        await p.close();
      });

      await test('the request cannot be sent without confirming it is practical help', async () => {
        const p = await reachConfirm();
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(300);
        equal(await p.locator('#bkBody .confirm').count(), 0, 'the request went through unconfirmed');
        assert(await p.locator('#bkBody .status.err.show').count() > 0, 'no error shown');
        await p.check('#bkBody [name="lowRisk"]');
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(500);
        assert(await p.locator('#bkBody .confirm').count() > 0, 'the request did not go through once confirmed');
        await p.close();
      });
    });

    await suite('career', async () => {
      await test('the career form asks for a goal and refuses documents', async () => {
        const p = await openPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#bkBody .service-opt', { hasText: 'AI Career Kit' }).click();
        await p.waitForTimeout(400);
        const placeholder = await p.locator('#bkBody [name="caseText"]').getAttribute('placeholder');
        assert(!/vedtak|brev/i.test(placeholder), 'the career form still asks about a case: ' + placeholder);
        const notice = (await p.locator('#bkBody .status.info').allTextContents()).join(' ');
        assert(/CV/.test(notice) && /sikker lenke/i.test(notice),
          'nothing tells the customer not to send a CV here: ' + notice);
        await p.close();
      });

      await test('a career request goes through without a phone number', async () => {
        const p = await openPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#bkBody .service-opt', { hasText: 'Career Starter' }).click();
        await p.waitForTimeout(400);
        equal(await p.locator('#bkBody [name="phone"]').getAttribute('required'), null,
          'the phone field is still required for a career request');
        await p.fill('#bkBody [name="name"]', 'Test Testesen');
        await p.fill('#bkBody [name="email"]', 'test@example.com');
        await p.fill('#bkBody [name="caseText"]', 'Vil bytte bransje.');
        await p.check('#bkBody [name="consent"]');
        await p.locator('#bkBody .btn-primary').click();
        await p.waitForTimeout(400);
        assert(await p.locator('#bkBody .risk-list').count() > 0,
          'the form refused to move on without a phone number');
        await p.close();
      });

      await test('the career page states the limits it has to state', async () => {
        const p = await openPage();
        await p.goto(`${BASE}/karriere.html`, { waitUntil: 'load' });
        await p.waitForTimeout(500);
        /* A fresh browser reports en-US, so the page opens in English. The
           Norwegian text is the one that governs, so test that one. */
        await p.locator('[data-legal-lang="no"]').click();
        await p.waitForTimeout(200);
        const text = (await p.locator('main:not([hidden])').innerText()).toLowerCase();
        for (const must of ['utkast', 'rangering', 'biometrisk', 'fødselsnummer',
                            'abonnement', 'angreretten', 'trene ai-modeller']) {
          assert(text.includes(must), `karriere.html never mentions ${must}`);
        }
        await p.locator('[data-legal-lang="en"]').click();
        await p.waitForTimeout(200);
        const english = (await p.locator('main:not([hidden])').innerText()).toLowerCase();
        for (const must of ['draft', 'ranking', 'biometric', 'national id',
                            'subscription', 'right of withdrawal', 'train ai models']) {
          assert(english.includes(must), `the English half never mentions ${must}`);
        }
        await p.close();
      });
    });

    await suite('out of scope', async () => {
      await test('an employment-law question is referred on, not sold to', async () => {
        const p = await openPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        await p.locator('#finderBody .opt').nth(5).click();   // employment law, dismissal, pay
        await p.waitForTimeout(200);
        await p.locator('#finderBody .opt').first().click();
        await p.waitForTimeout(200);
        await p.locator('#finderBody .opt').first().click();
        await p.waitForTimeout(400);

        const box = await p.locator('#finderBody .finder-result').innerText();
        assert(/advokat/i.test(box), 'the referral never mentions a lawyer');
        equal(await p.locator('#finderBody a[href="#booking"]').count(), 0, 'it still offers a booking');
        assert(!/\d{3}\s?kr/i.test(box), 'a price is shown for work we refuse: ' + box);
        equal(await p.locator('#finderBody a[href="hva-vi-gjor.html"]').count(), 1,
          'no link to the page that explains why');
        await p.close();
      });

      await test('an in-scope answer leads to a service we actually sell', async () => {
        const p = await openPage();
        await p.goto(`${BASE}/index.html?lang=no`, { waitUntil: 'load' });
        await p.waitForTimeout(900);
        for (const n of [0, 0, 0]) {
          await p.locator('#finderBody .opt').nth(n).click();
          await p.waitForTimeout(250);
        }
        const box = await p.locator('#finderBody .finder-result').innerText();
        assert(/790/.test(box), 'the review price is missing: ' + box);
        equal(await p.locator('#finderBody a[href="#booking"]').count(), 1, 'no way to book it');
        await p.close();
      });
    });

    await suite('return from Stripe', async () => {
      const confirm = async (query) => {
        const p = await openPage();
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
        const ctx = await openContext({ locale: 'nb-NO' });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/personvern.html`, { waitUntil: 'load' });
        await p.waitForTimeout(400);
        equal((await p.locator('main:not([hidden]) h1').textContent()).trim(), 'Personvernerklæring');
        equal(await p.locator('main:not([hidden])').count(), 1, 'only one version may be visible');
        await ctx.close();
      });

      await test('a reader who chose another language gets English', async () => {
        const ctx = await openContext({ locale: 'nb-NO' });
        const p = await ctx.newPage();
        await p.goto(`${BASE}/index.html?lang=tr`, { waitUntil: 'load' });
        await p.waitForTimeout(700);
        await p.goto(`${BASE}/vilkar.html`, { waitUntil: 'load' });
        await p.waitForTimeout(400);
        equal((await p.locator('main:not([hidden]) h1').textContent()).trim(), 'Terms of service');
        await ctx.close();
      });

      await test('company details are filled from config, not hardcoded', async () => {
        const p = await openPage();
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
        const ctx = await openContext({ javaScriptEnabled: false });
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
