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
    consent: true, lowRisk: true, lang: 'no', channel: 'phone', ...extra
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
        const r = await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no', details: customer() });
        equal(r.status, 200);
        assert(/^NAV-[A-F0-9]{6}$/.test(r.body.reference), 'reference: ' + r.body.reference);
      });

      await test('the price comes from the catalogue, not the browser', async () => {
        const r = await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no',
                                  amount: 1, price: 1, details: customer() });
        equal(r.status, 200);
        const q = await admin('/api/admin/queue');
        const row = q.body.bookings.find(b => b.reference === r.body.reference);
        equal(row.amount, 299, 'a tampered price must be ignored');
      });

      await test('every request arrives as a scope check, whatever the browser asks for', async () => {
        for (const payment of ['card', 'vipps', 'invoice']) {
          const r = await booking({ serviceId: 'career_kit', payment, lang: 'no', details: customer() });
          const q = await admin('/api/admin/queue');
          const row = q.body.bookings.find(b => b.reference === r.body.reference);
          equal(row.status, 'new', payment + ' must still be reviewed first');
          equal(row.paid_at, null, payment + ' must not arrive paid');
        }
      });

      await test('consent is required', async () => {
        const r = await booking({ serviceId: 'career_kit', payment: 'invoice', details: customer({ consent: false }) });
        equal(r.status, 400);
        equal(r.body.error, 'consent_required');
      });

      await test('a request that never confirmed its scope is refused', async () => {
        const r = await booking({
          serviceId: 'career_kit', lang: 'no', details: customer({ lowRisk: undefined })
        });
        equal(r.status, 400);
        equal(r.body.error, 'scope_confirmation_required');
      });

      await test('the confirmation is recorded against the case, not just checked', async () => {
        const r = await booking({ serviceId: 'career_kit', lang: 'no', details: customer() });
        const q = await admin('/api/admin/queue');
        equal(q.body.bookings.find(b => b.reference === r.body.reference).low_risk, 1);
      });

      await test('an unknown service is refused', async () => {
        equal((await booking({ serviceId: 'nope', details: customer() })).status, 400);
      });

      await test('an interpreter booking must name a language', async () => {
        const r = await booking({ serviceId: 'sprak', payment: 'invoice', date: '2026-09-01', time: '10:00',
                                  details: customer() });
        equal(r.body.error, 'tolk_language_required');
      });

      await test('a slot inside the lead time is refused', async () => {
        const today = new Date().toISOString().slice(0, 10);
        const r = await booking({ serviceId: 'career_review', payment: 'invoice', date: today, time: '09:00',
                                  details: customer() });
        equal(r.body.error, 'inside_lead_time');
      });

      await test('nothing in the browser can mark a case paid', async () => {
        const r = await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no', details: customer() });
        const q = await admin('/api/admin/queue');
        equal(q.body.bookings.find(b => b.reference === r.body.reference).paid_at, null);
      });
    });

    await suite('case workflow', async () => {
      const move = (reference, status) => admin('/api/admin/booking', {
        method: 'POST', body: JSON.stringify({ reference, status })
      });
      const fresh = async () => (await booking({
        serviceId: 'career_kit', payment: 'invoice', lang: 'no', details: customer()
      })).body.reference;

      await test('a case cannot jump straight to delivered', async () => {
        const r = await move(await fresh(), 'delivered');
        equal(r.status, 409);
        equal(r.body.error, 'bad_transition');
      });

      await test('quality control cannot be skipped', async () => {
        const ref = await fresh();
        for (const st of ['in_review', 'awaiting_payment', 'assigning', 'in_progress']) await move(ref, st);
        const r = await move(ref, 'delivered');
        equal(r.status, 409, 'in_progress → delivered must be refused');
      });

      await test('nobody is assigned before the case has been reviewed and paid for', async () => {
        const ref = await fresh();
        equal((await move(ref, 'assigning')).status, 409, 'new → assigning');
        equal((await move(ref, 'in_progress')).status, 409, 'new → in_progress');
        equal((await move(ref, 'in_review')).status, 200);
        equal((await move(ref, 'assigning')).status, 409, 'in_review → assigning skips payment');
        equal((await move(ref, 'awaiting_payment')).status, 200);
        equal((await move(ref, 'assigning')).status, 200);
      });

      await test('the whole workflow runs end to end', async () => {
        const ref = await fresh();
        for (const s of ['in_review', 'awaiting_payment', 'assigning', 'in_progress', 'quality_check', 'delivered']) {
          const r = await move(ref, s);
          equal(r.status, 200, 'move to ' + s);
          equal(r.body.booking.status, s);
        }
      });

      await test('quality control can send the work back', async () => {
        const ref = await fresh();
        for (const s of ['in_review', 'awaiting_payment', 'assigning', 'in_progress', 'quality_check', 'in_progress']) {
          equal((await move(ref, s)).status, 200, 'move to ' + s);
        }
      });

      await test('a delivered case is finished', async () => {
        const ref = await fresh();
        for (const s of ['in_review', 'awaiting_payment', 'assigning', 'in_progress', 'quality_check', 'delivered']) await move(ref, s);
        equal((await move(ref, 'in_progress')).status, 409);
        equal((await move(ref, 'cancelled')).status, 409);
      });

      await test('a case we will not take is declined, not cancelled', async () => {
        const ref = await fresh();
        equal((await move(ref, 'in_review')).status, 200);
        const r = await move(ref, 'declined');
        equal(r.status, 200);
        equal(r.body.booking.status, 'declined');
      });

      await test('an internal note saves without moving the case', async () => {
        const ref = await fresh();
        const r = await admin('/api/admin/booking', {
          method: 'POST',
          body: JSON.stringify({ reference: ref, status: 'new', note: 'called, waiting on the letter' })
        });
        equal(r.status, 200);
        equal(r.body.booking.status, 'new');
        equal(r.body.booking.internal_note, 'called, waiting on the letter');
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
        await admin('/api/admin/booking', { method: 'POST', body: JSON.stringify({ reference: ref, status: 'in_review' }) });
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
