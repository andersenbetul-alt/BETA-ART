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
    env: { ...process.env, PORT: String(PORT), DATA_DIR: dataDir, ADMIN_TOKEN: TOKEN, BOOKING_RATE_LIMIT: '200',
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

      await test('the career form\'s "phone optional" promise holds server-side', async () => {
        const r = await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no',
                                  details: customer({ phone: '' }) });
        equal(r.status, 200, JSON.stringify(r.body));
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

      /* A date the server will accept whatever today is: outside the lead
         time, and never a weekend. */
      const workday = (() => {
        for (let d = 4; ; d += 1) {
          const t = new Date(Date.now() + d * 864e5);
          if (t.getDay() !== 0 && t.getDay() !== 6) return t.toISOString().slice(0, 10);
        }
      })();

      /* sjekk stays retired, and made-up ids stay refused — but the two
         services the owner took back off the shelf must book. */
      await test('a retired or unknown service cannot be booked by id', async () => {
        for (const id of ['sjekk', 'k01', 'k02', 'nonsense']) {
          const r = await booking({ serviceId: id, payment: 'invoice', lang: 'no', details: customer() });
          equal(r.status, 400, id);
        }
      });

      await test('the un-shelved guidance service books like any meeting', async () => {
        const r = await booking({ serviceId: 'v01', payment: 'invoice', lang: 'no',
          date: workday, time: '11:30', details: customer() });
        equal(r.status, 200, JSON.stringify(r.body));
        assert(/^NAV-/.test(r.body.reference), 'no reference');
      });

      await test('a meeting service still needs a phone number', async () => {
        const r = await booking({ serviceId: 'v01', payment: 'invoice', lang: 'no',
          date: workday, time: '13:30', details: customer({ phone: '' }) });
        equal(r.status, 400);
        equal(r.body.error, 'missing_fields');
      });

      await test('quote-only tolk books with no amount and no payment', async () => {
        const r = await booking({ serviceId: 'sprak', payment: 'card', lang: 'no',
          date: workday, time: '12:30',
          details: customer({ tolkLang: 'Ukrainsk', tolkDialect: '' }) });
        equal(r.status, 200, JSON.stringify(r.body));
      });

      await test('broken JSON is the client\'s fault, not a server error', async () => {
        const r = await fetch(BASE + '/api/bookings', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{nope'
        });
        equal(r.status, 400);
        equal((await r.json()).error, 'bad_json');
      });

      await test('an oversized body is refused as 413, not 500', async () => {
        const r = await fetch(BASE + '/api/bookings', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceId: 'career_kit', details: customer({ caseText: 'x'.repeat(70 * 1024) }) })
        });
        equal(r.status, 413);
        equal((await r.json()).error, 'body_too_large');
      });

      /* Abuse protection nobody had checked. The suite raises the limit so it
         can run at all, which is exactly why the limit needs a test of its own. */
      await test('the booking endpoint rate-limits one address', async () => {
        const port = PORT + 1;
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'naviar-rate-'));
        const child = spawn(process.execPath, ['server/server.js'], {
          env: { ...process.env, PORT: String(port), DATA_DIR: dir, ADMIN_TOKEN: TOKEN, BOOKING_RATE_LIMIT: '3' },
          stdio: 'ignore'
        });
        try {
          const base = `http://127.0.0.1:${port}`;
          for (let i = 0; i < 40; i += 1) {
            try { if ((await fetch(base + '/api/health')).ok) break; } catch { /* not yet */ }
            await new Promise(r => setTimeout(r, 250));
          }
          const send = () => fetch(base + '/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId: 'career_kit', payment: 'invoice', lang: 'no', details: customer() })
          });
          const codes = [];
          for (let i = 0; i < 4; i += 1) codes.push((await send()).status);
          equal(codes.join(','), '200,200,200,429', 'the fourth request should be refused');
          const refused = await send();
          assert(Number(refused.headers.get('retry-after')) > 0,
            'a 429 must say when to come back, or clients retry blindly');
        } finally {
          child.kill();
          fs.rmSync(dir, { recursive: true, force: true });
        }
      });

      await test('a weekend slot is refused', async () => {
        const d = new Date();
        while (d.getDay() !== 0) d.setDate(d.getDate() + 1);   // the next Sunday
        const r = await booking({
          serviceId: 'career_review', payment: 'invoice',
          date: d.toISOString().slice(0, 10), time: '10:00', details: customer()
        });
        equal(r.status, 400);
        equal(r.body.error, 'not_a_workday');
      });

      /* This one used to book "today" and expect inside_lead_time, which is
         wrong every Saturday and Sunday: the server rejects a weekend date as
         not_a_workday before it ever looks at the clock. Find a workday that is
         genuinely inside the lead time instead — and when the calendar offers
         none, say so rather than assert the wrong error. */
      await test('a slot inside the lead time is refused', async () => {
        const leadMs = 24 * 3600 * 1000;
        let date = null;
        for (let i = 0; i <= 7 && !date; i += 1) {
          const d = new Date(Date.now() + i * 86400000);
          const day = d.getDay();
          if (day === 0 || day === 6) continue;
          const iso = d.toISOString().slice(0, 10);
          if (new Date(iso + 'T09:00:00Z').getTime() - Date.now() < leadMs) date = iso;
        }
        if (!date) {
          assert(true, 'no workday falls inside the lead time today — nothing to assert');
          return;
        }
        const r = await booking({ serviceId: 'career_review', payment: 'invoice', date, time: '09:00',
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

    await suite('advisers and commissions', async () => {
      const move = (reference, status) => admin('/api/admin/booking', {
        method: 'POST', body: JSON.stringify({ reference, status })
      });
      const apply = (extra = {}) => api('/api/advisers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Vera Rådgiversen', email: 'vera@example.com',
          specialty: 'Søknader til offentlige kontorer', consent: true, lang: 'no', ...extra })
      });

      await test('an expert can apply, once', async () => {
        equal((await apply()).status, 200);
        const dup = await apply();
        equal(dup.status, 409);
        equal(dup.body.error, 'email_taken');
      });

      await test('an application without consent is refused', async () => {
        const r = await apply({ email: 'ingen@example.com', consent: false });
        equal(r.status, 400);
        equal(r.body.error, 'consent_required');
      });

      const adviserId = async () => {
        const list = await admin('/api/admin/advisers');
        return list.body.advisers.find(a => a.email === 'vera@example.com').id;
      };

      await test('an application arrives as applied, and applied cannot pause', async () => {
        const id = await adviserId();
        const list = await admin('/api/admin/advisers');
        equal(list.body.advisers.find(a => a.id === id).status, 'applied');
        const r = await admin('/api/admin/adviser', {
          method: 'POST', body: JSON.stringify({ id, status: 'paused' })
        });
        equal(r.status, 409, 'applied → paused must be refused');
      });

      await test('no case is assigned to an unapproved adviser', async () => {
        const id = await adviserId();
        const ref = (await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no',
                                     details: customer() })).body.reference;
        for (const s of ['in_review', 'awaiting_payment', 'assigning']) await move(ref, s);
        const r = await admin('/api/admin/assign', {
          method: 'POST', body: JSON.stringify({ reference: ref, adviserId: id })
        });
        equal(r.status, 409);
        equal(r.body.error, 'adviser_not_approved');
      });

      await test('assignment only happens while a person is choosing', async () => {
        const id = await adviserId();
        await admin('/api/admin/adviser', {
          method: 'POST', body: JSON.stringify({ id, status: 'approved' })
        });
        const ref = (await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no',
                                     details: customer() })).body.reference;
        const early = await admin('/api/admin/assign', {
          method: 'POST', body: JSON.stringify({ reference: ref, adviserId: id })
        });
        equal(early.status, 409, 'a new case must not be assignable');
        equal(early.body.error, 'bad_state');
      });

      await test('delivery writes the split to the ledger, exactly once', async () => {
        const id = await adviserId();
        const ref = (await booking({ serviceId: 'career_kit', payment: 'invoice', lang: 'no',
                                     details: customer() })).body.reference;
        for (const s of ['in_review', 'awaiting_payment', 'assigning']) await move(ref, s);
        const assigned = await admin('/api/admin/assign', {
          method: 'POST', body: JSON.stringify({ reference: ref, adviserId: id })
        });
        equal(assigned.status, 200);
        equal(assigned.body.booking.adviser_id, id);
        for (const s of ['in_progress', 'quality_check', 'delivered']) await move(ref, s);

        const led = await admin('/api/admin/commissions');
        const row = led.body.rows.find(r => r.reference === ref);
        assert(row, 'no ledger row for the delivered case');
        /* career_kit: 299 gross, 239 ex MVA, 20 % pilot commission of the net. */
        equal(row.amount, 299);
        equal(row.commission, 48);
        equal(row.net, 191, 'the adviser is owed the ex-MVA fee minus the commission');
        equal(led.body.rows.filter(r => r.reference === ref).length, 1);
        assert(led.body.owed.find(o => o.id === id && o.net >= 191), 'the owed tally misses the adviser');
      });

      await test('a free case pays nobody', async () => {
        const id = await adviserId();
        const ref = (await booking({ serviceId: 'career_free', payment: 'invoice', lang: 'no',
                                     details: customer() })).body.reference;
        for (const s of ['in_review', 'awaiting_payment', 'assigning']) await move(ref, s);
        await admin('/api/admin/assign', {
          method: 'POST', body: JSON.stringify({ reference: ref, adviserId: id })
        });
        for (const s of ['in_progress', 'quality_check', 'delivered']) await move(ref, s);
        const led = await admin('/api/admin/commissions');
        assert(!led.body.rows.find(r => r.reference === ref), 'a 0 kr case must write no ledger row');
      });

      await test('payout is a one-time stamp', async () => {
        const led = await admin('/api/admin/commissions');
        const pending = led.body.rows.find(r => r.paid_out_at === null);
        assert(pending, 'expected a pending ledger row');
        equal((await admin('/api/admin/payout', {
          method: 'POST', body: JSON.stringify({ id: pending.id })
        })).status, 200);
        const again = await admin('/api/admin/payout', {
          method: 'POST', body: JSON.stringify({ id: pending.id })
        });
        equal(again.status, 409, 'a second payout of the same row must be refused');
      });

      await test('the public endpoint never lists advisers', async () => {
        equal((await api('/api/advisers')).status, 404);
        equal((await api('/api/admin/advisers')).status, 401);
      });
    });

    await suite('admin door', async () => {
      await test('no token is rejected', async () => equal((await api('/api/admin/queue')).status, 401));

      await test('a wrong token is rejected, and the refusal is not cached', async () => {
        const r = await api('/api/admin/queue', { headers: { Authorization: 'Bearer wrong' } });
        equal(r.status, 401);
        equal(r.headers.get('cache-control'), 'no-store');
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

      await test('the queue is never cached', async () => {
        const q = await admin('/api/admin/queue');
        equal(q.headers.get('cache-control'), 'no-store', 'customer data must not sit in a cache');
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
