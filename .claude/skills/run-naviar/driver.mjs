#!/usr/bin/env node
/* NAVIAR run driver — drives the real site in a real browser and the real API
   over HTTP. Agent tooling, not product surface: it is allowed to be blunt.

   Usage (from the repo root, servers already up — see SKILL.md):
     node .claude/skills/run-naviar/driver.mjs smoke
     node .claude/skills/run-naviar/driver.mjs shot karriere.html no
     node .claude/skills/run-naviar/driver.mjs flow
     node .claude/skills/run-naviar/driver.mjs admin
     node .claude/skills/run-naviar/driver.mjs api

   Env:
     SITE          static site origin        (default http://127.0.0.1:8080)
     API           API origin                (default http://127.0.0.1:8787)
     ADMIN_TOKEN   admin queue token         (default dev-token-…, 24+ chars)
     OUT           screenshot directory      (default ./.run-out)
*/
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const SITE = process.env.SITE || 'http://127.0.0.1:8080';
const API = process.env.API || 'http://127.0.0.1:8787';
const TOKEN = process.env.ADMIN_TOKEN || 'dev-token-long-enough-for-the-24-char-minimum';
const OUT = process.env.OUT || '.run-out';

/* playwright is a devDependency but this repo is routinely checked out without
   it installed (`npm ls` reports UNMET). The browser suite carries the same
   two-step lookup; keep them in step. */
function playwright() {
  try { return require('playwright'); } catch { /* not installed locally */ }
  try { return require('/opt/node22/lib/node_modules/playwright'); } catch { /* nor globally */ }
  throw new Error('playwright is missing. Run: npm install playwright');
}

const PAGES = ['index.html', 'karriere.html', 'hva-vi-gjor.html',
               'personvern.html', 'vilkar.html', 'admin.html'];

function shotPath(name) {
  fs.mkdirSync(OUT, { recursive: true });
  return path.join(OUT, name.replace(/[^\w.-]+/g, '_') + '.png');
}

/* ------------------------------------------------------------------ browser */

async function open(browser, { api = false } = {}) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.route('**/*', (route) => {
    const url = route.request().url();

    /* The pages link Google Fonts. Nothing here depends on the webfont, but
       every goto waits on those two requests — 12.6 s per page load where the
       network is slow or blocked, against 50 ms with them refused. */
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return route.abort();

    /* config.js ships with apiBase: '' — demo mode, where the browser never
       calls the API at all. Rewriting the file in flight points the running
       page at the live server without touching the committed source, which is
       what the README tells a human to edit by hand. */
    if (api && url.endsWith('/assets/js/config.js')) {
      return route.fetch().then(async (res) => {
        const src = await res.text();
        /* Anchor on the assignment. The comment three lines above it also reads
           `apiBase: ''`, so an unanchored replace rewrites the comment, leaves
           the real setting at '' and the page silently stays in demo mode —
           bookings then get a locally invented reference and never reach the
           API at all. */
        const patched = src.replace(/^(\s*)apiBase:\s*''/m, `$1apiBase: '${API}'`);
        if (patched === src) throw new Error('could not point config.js at the API');
        return route.fulfill({ response: res, body: patched });
      });
    }
    return route.continue();
  });

  /* Aborting the font requests makes Chromium log a generic "Failed to load
     resource: net::ERR_FAILED" console error per page. That is this driver's
     own doing, so count failed requests by URL instead and drop the console
     line that has no URL attached to it. */
  const errors = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/Failed to load resource/.test(m.text())) return;
    errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) return;
    errors.push(`request failed: ${r.url()} (${r.failure()?.errorText})`);
  });
  page.errors = errors;
  return page;
}

async function go(page, rel) {
  await page.goto(`${SITE}/${rel}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);          // i18n paints on the next tick
}

/* -------------------------------------------------------------- commands */

async function smoke() {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  let bad = 0;

  for (const file of PAGES) {
    const page = await open(browser);
    await go(page, file + '?lang=no');
    const shot = shotPath(file);
    await page.screenshot({ path: shot, fullPage: true });
    const title = await page.title();
    const h1 = await page.locator('h1').first().innerText().catch(() => '(no h1)');
    if (page.errors.length) bad += 1;
    console.log(`${file.padEnd(18)} ${page.errors.length ? 'JS ERRORS' : 'ok       '} ` +
                `${JSON.stringify(title.slice(0, 46))} — ${h1.replace(/\s+/g, ' ').slice(0, 52)}`);
    page.errors.forEach((e) => console.log('    ! ' + e.slice(0, 160)));
    console.log('    → ' + shot);
    await page.close();
  }

  await browser.close();
  console.log(bad ? `\n${bad} page(s) logged JS errors` : '\nno JS errors on any page');
  return bad ? 1 : 0;
}

async function shot(file = 'index.html', lang = 'no') {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await open(browser);
  await go(page, `${file}?lang=${lang}`);
  const out = shotPath(`${file}-${lang}`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(out);
  await browser.close();
  return 0;
}

/* Walks the booking wizard the way a customer does, with the page wired to the
   live API, and submits. The interesting property is what step 4 does NOT
   contain: no payment options, no checkout redirect. */
async function flow() {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await open(browser, { api: true });
  await go(page, 'index.html?lang=no');

  const say = async (label) =>
    console.log(`${label}: ${(await page.locator('#bkBody h3').first().innerText()).trim()}`);

  /* 1 — service. Clicking a card advances on its own; there is no Next here. */
  await page.waitForSelector('#bkBody .service-opt');
  const services = page.locator('#bkBody .service-opt');
  console.log(`step 1: ${await services.count()} services offered`);
  await services.last().click();                       // CV- og søknadsgjennomgang, 790
  await page.waitForTimeout(700);

  /* 2 — day and time. A day is preselected; Fortsett stays disabled until a
     slot is picked, which is the only thing gating this step. */
  await say('step 2');
  await page.locator('#bkBody .slot').first().click();
  await page.locator('#bkBody .finder-nav .btn-primary').click();
  await page.waitForTimeout(500);

  /* 3 — details. Phone is optional for a career service; consent is not. */
  await say('step 3');
  await page.fill('#bkBody [name=name]', 'Driver Testesen');
  await page.fill('#bkBody [name=email]', 'driver@example.com');
  await page.fill('#bkBody [name=caseText]', 'Vil ha gjennomgang av CV og soknad.');
  /* The field is optional in the form and rejected by the server — see Gotchas.
     Filled here so this command exercises the path that works; `api` has the
     one-line reproduction of the path that does not. */
  await page.fill('#bkBody [name=phone]', '+4740000000');
  await page.check('#bkBody [name=consent]');
  await page.locator('#bkBody .finder-nav .btn-primary').click();
  await page.waitForTimeout(500);

  /* 4 — confirm. */
  await say('step 4');
  const risks = await page.locator('#bkBody .risk-list li').count();
  const pay = await page.locator('#bkBody [name=payment], #bkBody .pay-opt').count();
  console.log(`        refusal list: ${risks} items · payment controls: ${pay}`);
  await page.screenshot({ path: shotPath('booking-confirm'), fullPage: false });

  await page.check('#bkBody [name=lowRisk]');
  await page.locator('#bkBody .finder-nav .btn-primary').click();
  await page.waitForTimeout(1500);

  const done = (await page.locator('#bkBody').innerText()).replace(/\s+/g, ' ');
  console.log('result: ' + done.slice(0, 200));
  const ref = (done.match(/NAV-[A-F0-9]{6}/) || [])[0];
  console.log(ref ? `reference: ${ref}` : 'no reference in the page');

  if (ref) {
    const res = await fetch(`${API}/api/admin/queue`, { headers: { Authorization: 'Bearer ' + TOKEN } });
    const body = await res.json();
    const row = (body.bookings || []).find((b) => b.reference === ref);
    console.log(row
      ? `queue: ${row.reference} status=${row.status} low_risk=${row.low_risk}`
      : 'queue: the case did not reach the API');
  }

  console.log('→ ' + shotPath('booking-confirm'));
  page.errors.forEach((e) => console.log('  ! ' + e.slice(0, 160)));
  await browser.close();
  return 0;
}

async function admin() {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await open(browser, { api: true });
  await go(page, 'admin.html');
  await page.fill('#token', TOKEN);
  await page.locator('button[type="submit"], #login button, form button').first().click();
  await page.waitForTimeout(1200);
  const out = shotPath('admin-queue');
  await page.screenshot({ path: out, fullPage: true });
  console.log((await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300));
  console.log('→ ' + out);
  page.errors.forEach((e) => console.log('  ! ' + e.slice(0, 160)));
  await browser.close();
  return 0;
}

/* The API without a browser. This is the layer most changes touch. */
async function api() {
  const say = (label, res, body) =>
    console.log(`${String(res.status).padEnd(4)} ${label.padEnd(26)} ${JSON.stringify(body).slice(0, 150)}`);

  const call = async (label, url, init) => {
    const res = await fetch(url, init);
    let body = null;
    try { body = await res.json(); } catch { /* no body */ }
    say(label, res, body);
    return { res, body };
  };

  await call('health', `${API}/api/health`);

  const post = (payload) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const customer = (extra = {}) => ({
    name: 'Driver Testesen', email: 'driver@example.com', phone: '+4740000000',
    caseText: 'Vil ha gjennomgang av CV og søknad.',
    goal: 'Ny jobb innen helse', consent: true, lowRisk: true,
    lang: 'no', channel: 'phone', ...extra
  });

  /* The scope confirmation is a server-side gate, not a checkbox in the
     browser: without lowRisk the request is refused whatever the page says. */
  await call('booking without lowRisk', `${API}/api/bookings`,
    post({ serviceId: 'career_review', payment: 'invoice', lang: 'no',
           details: customer({ lowRisk: undefined }) }));

  /* The career form marks phone optional and the data floor says the first
     form takes name, email, language and goal only — but the server requires
     it. A customer who follows the form's own hint loses their booking. */
  await call('booking without a phone', `${API}/api/bookings`,
    post({ serviceId: 'career_review', payment: 'invoice', lang: 'no',
           details: customer({ phone: '' }) }));

  /* A meeting service needs a real slot: the server refuses weekends, anything
     inside the lead time, and a slot already taken (`bad_slot`). Walk forward
     until one is accepted rather than hardcoding a date that rots. */
  let made = null;
  for (let day = 3; day < 20 && !made; day += 1) {
    const d = new Date(Date.now() + day * 864e5);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const date = d.toISOString().slice(0, 10);
    const taken = await fetch(`${API}/api/availability?date=${date}`)
      .then((r) => r.json()).then((b) => b.taken || []);
    const time = ['09:00', '09:30', '10:00'].find((t) => !taken.includes(t));
    const r = await call(`booking ${date} ${time}`, `${API}/api/bookings`,
      post({ serviceId: 'career_review', payment: 'invoice', lang: 'no',
             date, time, amount: 790, details: customer() }));
    if (r.res.ok) made = r.body;
  }

  const auth = { headers: { Authorization: 'Bearer ' + TOKEN } };
  const { body: queue } = await call('admin queue', `${API}/api/admin/queue`, auth);
  await call('admin queue, no token', `${API}/api/admin/queue`);

  if (made && made.reference) {
    await call('advance to in_review', `${API}/api/admin/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.headers },
      body: JSON.stringify({ reference: made.reference, status: 'in_review' })
    });
    /* The state machine refuses any edge it does not draw. */
    await call('illegal jump to delivered', `${API}/api/admin/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.headers },
      body: JSON.stringify({ reference: made.reference, status: 'delivered' })
    });
  }

  console.log(`\ncases in the queue: ${queue && queue.bookings ? queue.bookings.length : '?'}`);
  return 0;
}

/* ------------------------------------------------------------------- main */

const [cmd, ...args] = process.argv.slice(2);
const commands = { smoke, shot, flow, admin, api };

if (!commands[cmd]) {
  console.error(`usage: driver.mjs <${Object.keys(commands).join('|')}> [args]`);
  process.exit(2);
}
process.exit(await commands[cmd](...args));
