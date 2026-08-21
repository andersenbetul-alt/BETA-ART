/* Exercises the API against a throwaway database. The things worth testing
   here are the ones where being wrong costs money or a customer: price
   integrity, who is allowed to mark a case paid, the admin door, and the
   timezone the booking clock runs in. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { suite, test, assert, equal } from './harness.mjs';

const PORT = 8791;
const BASE = `http://127.0.0.1:${PORT}`;
const TOKEN = 'test-token-long-enough-to-satisfy-the-24-char-minimum';

async function api(p, init) {
  const res = await fetch(BASE + p, init);
  let body = null;
  try { body = await res.json(); } catch { /* empty body */ }
  return { status: res.status, body, headers: res.headers };
}

const admin = (p, init = {}) => api(p, {
  ...init,
  headers: { Authorization: 'Bearer ' + TOKEN, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers }
});

const booking = (payload) => api('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

function customer(extra = {}) {
  return {
    name: 'Test Testesen', email: 'test@example.com', phone: '+4740000000',
    caseText: 'Fikk et vedtak fra NAV og forstår ikke fristen.',
    consent: true, lang: 'no', channel: 'phone', ...extra
  };
}

export default async function () {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'naviar-test-'));
  const server = spawn('node', ['server.js'], {
    cwd: 'server',
    env: { ...process.env, PORT: String(PORT), DATA_DIR: dataDir, ADMIN_TOKEN: TOKEN,
           ALLOWED_ORIGINS: '', STRIPE_SECRET_KEY: '' },
    stdio: 'ignore'
  });

  // wait for it to answer rather than sleeping a fixed amount
  let up = false;
  for (let i = 0; i < 40 && !up; i += 1) {
    try { up = (await api('/api/health')).status === 200; } catch { /* not yet */ }
    if (!up) await new Promise(r => setTimeout(r, 250));
  }

  try {
    await suite('api', async () => {
      await test('the server answers', () => assert(up, 'never became healthy'));

      await test('a delivery booking needs no time slot', async () => {
        const r = await booking({ serviceId: 'k01', payment: 'invoice', lang: 'no', details: customer() });
        equal(r.status, 200);
        assert(/^NAV-[A-F0-9]{6}$/.test(r.body.reference), 'reference: ' + r.body.reference);
      });

      await test('the price comes from the catalogue, not the browser', async () => {
        const r = await booking({ serviceId: 'k01', payment: 'invoice', lang: 'no',
                                  amount: 1, price: 1, details: customer() });
        equal(r.status, 200);
        const q = await admin('/api/admin/queue');
        const row = q.body.bookings.find(b => b.reference === r.body.reference);
        equal(row.amount, 800, 'a tampered price must be ignored');
      });

      await test('an invoice case enters the work queue, not payment limbo', async () => {
        const r = await booking({ serviceId: 'k01', payment: 'invoice', lang: 'no', details: customer() });
        const q = await admin('/api/admin/queue');
        equal(q.body.bookings.find(b => b.reference === r.body.reference).status, 'new');
      });

      await test('consent is required', async () => {
        const r = await booking({ serviceId: 'k01', payment: 'invoice', details: customer({ consent: false }) });
        equal(r.status, 400);
        equal(r.body.error, 'consent_required');
      });

      await test('an unknown service is refused', async () => {
        equal((await booking({ serviceId: 'nope', details: customer() })).status, 400);
      });

      await test('an interpreter booking must name a language', async () => {
        const r = await booking({ serviceId: 'tolk', payment: 'invoice', date: '2026-09-01', time: '10:00',
                                  details: customer() });
        equal(r.body.error, 'tolk_language_required');
      });

      await test('a slot inside the lead time is refused', async () => {
        const today = new Date().toISOString().slice(0, 10);
        const r = await booking({ serviceId: 'k02', payment: 'invoice', date: today, time: '09:00',
                                  details: customer() });
        equal(r.body.error, 'inside_lead_time');
      });

      await test('nothing in the browser can mark a case paid', async () => {
        const r = await booking({ serviceId: 'k01', payment: 'invoice', lang: 'no', details: customer() });
        const q = await admin('/api/admin/queue');
        equal(q.body.bookings.find(b => b.reference === r.body.reference).paid_at, null);
      });
    });

    await suite('admin door', async () => {
      await test('no token is rejected', async () => equal((await api('/api/admin/queue')).status, 401));

      await test('a wrong token is rejected', async () => {
        equal((await api('/api/admin/queue', { headers: { Authorization: 'Bearer wrong' } })).status, 401);
      });

      await test('the right token opens the queue', async () => {
        equal((await admin('/api/admin/queue')).status, 200);
      });

      await test('an invalid status is refused', async () => {
        const q = await admin('/api/admin/queue');
        const ref = q.body.bookings[0].reference;
        const r = await admin('/api/admin/booking', { method: 'POST', body: JSON.stringify({ reference: ref, status: 'hacked' }) });
        equal(r.status, 400);
        equal(r.body.error, 'bad_status');
      });

      await test('a status change is recorded as an event', async () => {
        const q = await admin('/api/admin/queue');
        const ref = q.body.bookings[0].reference;
        await admin('/api/admin/booking', { method: 'POST', body: JSON.stringify({ reference: ref, status: 'in_progress' }) });
        const ev = await admin('/api/admin/events?subject=' + ref);
        assert(ev.body.events.some(e => e.kind === 'status'), 'no status event logged');
      });

      /* Last, because it locks this address out for fifteen minutes. */
      await test('five wrong answers lock the address out, correct token included', async () => {
        for (let i = 0; i < 5; i += 1) {
          await api('/api/admin/queue', { headers: { Authorization: 'Bearer nope' + i } });
        }
        const locked = await api('/api/admin/queue', { headers: { Authorization: 'Bearer nope5' } });
        equal(locked.status, 429, 'sixth attempt');
        equal((await admin('/api/admin/queue')).status, 429, 'correct token during lockout');
      });
    });
  } finally {
    server.kill();
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
}
