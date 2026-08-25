/* =============================================================================
   NAVIAR pilot API
   Bookings, payments, enquiries and the need-finder tally.

   Deliberately small: SQLite through node:sqlite, one process, no ORM. It is
   enough for Phase 0/1 of the blueprint and it keeps the pilot's cases after a
   restart, which the JSON files it replaces did not do reliably.

   What this service must never do:
     - hold client funds itself (collection and payout run through Stripe)
     - store BankID credentials of any kind
     - put case text into logs or notification emails
   ========================================================================== */
'use strict';

require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const express = require('express');
const cors = require('cors');

const PORT = Number(process.env.PORT || 8787);
/* Overridable so the test suite can run against a throwaway directory
   instead of the pilot's real cases. */
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

/* ---------------------------------------------------------------------------
   The price catalogue lives in assets/js/config.js so the site and the server
   can never disagree about what something costs. We evaluate that file in a
   sandbox rather than duplicating the numbers here.
   ------------------------------------------------------------------------- */
function loadSiteConfig() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'config.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 1000 });
  return sandbox.window.NAVIAR_CONFIG;
}
const CFG = loadSiteConfig();

/* ---------------------------------------------------------------- storage */
const DB = require('./db');
const db = DB.open(DATA_DIR);

/* --------------------------------------------------------------- helpers */
function reference() {
  /* Short, readable, not guessable in bulk. */
  return 'NAV-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
}

/* Six hex characters is 16.7 million references, so a collision is unlikely but
   not impossible — and the failure mode is a primary-key error, a 500, and a
   customer who thinks the booking failed. Try again a few times instead. */
function freeReference() {
  for (let i = 0; i < 5; i += 1) {
    const ref = reference();
    if (!DB.referenceTaken(db, ref)) return ref;
  }
  /* Astronomically improbable; a longer reference is better than an error. */
  return 'NAV-' + crypto.randomBytes(8).toString('hex').toUpperCase().slice(0, 12);
}

/* Slots are wall-clock times in Norway. The server may well run in UTC, and
   `new Date('2026-09-01T10:00:00')` would then be read as 10:00 UTC — one or
   two hours off, which is enough to accept a booking inside the lead time or
   refuse one outside it. This converts an Oslo wall clock to a real instant. */
function osloInstant(dateStr, timeStr) {
  const asUtc = Date.parse(dateStr + 'T' + timeStr + ':00Z');
  if (Number.isNaN(asUtc)) return NaN;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CFG.booking.timezone || 'Europe/Oslo', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(new Date(asUtc)).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const hour = parts.hour === '24' ? '00' : parts.hour;
  const wall = Date.parse(
    `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}Z`
  );
  return asUtc - (wall - asUtc);
}

function serviceById(id) {
  return CFG.services.find((s) => s.id === id);
}

/* The customer total is always recomputed here. The browser is not trusted
   with prices. */
function priceFor(service, express) {
  if (service.price == null) return null;
  const base = service.price;
  return express ? Math.round(base * (1 + CFG.surcharges.express24h)) : base;
}

function isWorkday(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return CFG.booking.workdays.includes(d.getDay());
}

function slotGrid(dateStr, minutes) {
  const b = CFG.booking;
  const out = [];
  for (let m = b.openHour * 60; m + minutes <= b.closeHour * 60; m += b.slotMinutes) {
    out.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'));
  }
  return out;
}

function str(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------------ app */
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    if (!origin || !allowed.length || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed'));
  }
}));

/* Stripe needs the raw body to verify the webhook signature, so that route is
   mounted before the JSON parser. */
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.use(express.json({ limit: '64kb' }));

/* A crude in-memory throttle. Enough to stop a bored script; replace with a
   real limiter behind a proxy in production. */
const hits = new Map();
/* Every distinct address that ever calls gets a row, and nothing removes it.
   A script walking a /16 would grow this map until the process dies, so sweep
   the expired rows once the map is larger than any honest traffic explains. */
const THROTTLE_MAX_KEYS = 5000;

function sweep(map, now, isDead) {
  for (const [key, value] of map) if (isDead(value, now)) map.delete(key);
}

function throttle(limit, windowMs) {
  return (req, res, next) => {
    const key = req.ip + ':' + req.path;
    const now = Date.now();
    if (hits.size > THROTTLE_MAX_KEYS) sweep(hits, now, (v, t) => t > v.reset);
    const entry = hits.get(key) || { count: 0, reset: now + windowMs };
    if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
    entry.count += 1;
    hits.set(key, entry);
    if (entry.count > limit) {
      /* Tell an honest caller when to come back instead of leaving it to
         guess; a client that retries blindly is what fills this map. */
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.reset - now) / 1000))));
      return res.status(429).json({ error: 'too_many_requests' });
    }
    next();
  };
}

/* ---------------------------------------------------------------- admin
   The queue holds every customer's name, email, phone and the text of their
   case. It is the most sensitive thing this service owns, so the door is
   deliberately unfriendly: a long token only, compared in constant time, with
   a lockout after a handful of wrong answers. A short code would be guessed.
   ------------------------------------------------------------------------ */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const ADMIN_MIN_LENGTH = 24;
const LOCK_AFTER = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map();

function sameToken(given, expected) {
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req, res, next) {
  /* Everything behind this door is customer data. Say so before any early
     return, so a browser's disk cache and any intermediary keep no copy —
     not of the queue, and not of the refusals either. */
  res.set('Cache-Control', 'no-store');

  if (ADMIN_TOKEN.length < ADMIN_MIN_LENGTH) {
    /* Refusing to run beats running with a guessable door. */
    return res.status(503).json({ error: 'admin_disabled' });
  }
  const now = Date.now();
  if (failures.size > THROTTLE_MAX_KEYS) sweep(failures, now, (v, t) => t - v.seen > LOCK_MS);
  let state = failures.get(req.ip);

  /* One rule retires both a served lockout and a stale run of typos: a record
     nobody has added to for a whole lockout window is forgotten. Without the
     second half, four mistypes spread over a month still lock the fifth. */
  if (state && now - state.seen > LOCK_MS) {
    failures.delete(req.ip);
    state = undefined;
  }
  if (state && state.lockedUntil > now) {
    res.set('Retry-After', String(Math.ceil((state.lockedUntil - now) / 1000)));
    return res.status(429).json({ error: 'locked_out' });
  }

  const given = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!given || !sameToken(given, ADMIN_TOKEN)) {
    const count = (state ? state.count : 0) + 1;
    failures.set(req.ip, {
      count,
      seen: now,
      lockedUntil: count >= LOCK_AFTER ? now + LOCK_MS : 0
    });
    if (count >= LOCK_AFTER) console.warn('[naviar] admin locked out for', req.ip);
    return res.status(401).json({ error: 'unauthorized' });
  }

  failures.delete(req.ip);
  next();
}

/* ------------------------------------------------------------- endpoints */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, services: CFG.services.length, payments: paymentModes() });
});

function paymentModes() {
  return {
    card: Boolean(process.env.STRIPE_SECRET_KEY && CFG.payments.card),
    vipps: false,          // not implemented until the merchant agreement exists
    invoice: Boolean(CFG.payments.invoice)
  };
}

app.get('/api/availability', (req, res) => {
  const date = str(req.query.date, 10);
  if (!DATE_RE.test(date)) return res.status(400).json({ error: 'bad_date' });
  if (!isWorkday(date)) return res.json({ date, taken: slotGrid(date, CFG.booking.slotMinutes) });

  res.json({ date, taken: DB.takenSlots(db, date) });
});

/* How many requests one address may send in an hour. Twenty is plenty for a
   real customer and low enough to be a nuisance to a script. It is a knob
   because the test suite needs headroom, and because a busier deployment may
   want a different number — not because the limit is optional. */
const BOOKING_LIMIT = Math.max(1, Number(process.env.BOOKING_RATE_LIMIT) || 20);

app.post('/api/bookings', throttle(BOOKING_LIMIT, 60 * 60 * 1000), async (req, res) => {
  const body = req.body || {};
  const service = serviceById(str(body.serviceId, 20));
  if (!service) return res.status(400).json({ error: 'unknown_service' });

  const details = body.details || {};
  const name = str(details.name, 120);
  const email = str(details.email, 160);
  const phone = str(details.phone, 40);
  const caseText = str(details.caseText, 4000);

  /* The career form promises "name, e-post, språk og hva du vil oppnå" and
     marks phone optional; the server has to keep that promise. Meeting and
     interpreter services still need a number we can reach the customer on. */
  if (!name || !EMAIL_RE.test(email) || !caseText) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (service.group !== 'karriere' && !phone) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (details.consent !== true) return res.status(400).json({ error: 'consent_required' });
  /* The customer has to say their request is practical help only. Checking it
     in the browser is not checking it — anything can post to this endpoint —
     and the answer is also the record that they were shown the refusal list
     before they asked. Both reasons put it here. */
  if (details.lowRisk !== true) return res.status(400).json({ error: 'scope_confirmation_required' });
  if (service.tolk && !str(details.tolkLang, 60)) {
    return res.status(400).json({ error: 'tolk_language_required' });
  }

  let date = null;
  let time = null;
  if (service.type !== 'delivery') {
    date = str(body.date, 10);
    time = str(body.time, 5);
    if (!DATE_RE.test(date) || !TIME_RE.test(time)) {
      return res.status(400).json({ error: 'bad_slot' });
    }
    if (!isWorkday(date)) return res.status(400).json({ error: 'not_a_workday' });

    const earliest = Date.now() + CFG.booking.leadTimeHours * 3600000;
    if (osloInstant(date, time) < earliest) {
      return res.status(400).json({ error: 'inside_lead_time' });
    }
    if (DB.slotClash(db, date, time)) return res.status(409).json({ error: 'slot_taken' });
  }

  const express24 = body.express === true;
  const amount = priceFor(service, express24);
  const modes = paymentModes();
  let payment = str(body.payment, 12) || 'invoice';
  if (amount === 0 || amount === null) payment = 'none';
  if (payment === 'card' && !modes.card) payment = 'invoice';
  if (payment === 'vipps') payment = 'invoice';   // until Vipps is live

  const booking = {
    reference: freeReference(),
    createdAt: new Date().toISOString(),
    /* Every request that arrives from the site is a free scope check, whatever
       the browser says about payment. A person reads it, decides whether we may
       take it, and only then does a price and a payment link go out. Trusting a
       browser-supplied payment mode here would put a buy button back on the
       site through the back door. */
    status: 'new',
    serviceId: service.id,
    serviceCode: service.code,
    date,
    time,
    minutes: service.minutes,
    express: express24,
    amount,
    net: service.net,
    currency: CFG.currency,
    commission: service.net == null ? null : Math.round(service.net * CFG.commissionRate),
    payment,
    lang: str(body.lang, 5),
    source: str(body.source, 40),
    customer: { name, email, phone, lang: str(details.lang, 5), channel: str(details.channel, 12) },
    tolk: service.tolk
      ? { language: str(details.tolkLang, 60), dialect: str(details.tolkDialect, 60) }
      : null,
    caseText,
    lowRisk: true,
    paidAt: null
  };

  /* Card payments go through Stripe Checkout: NAVIAR never touches card data
     and never holds the money itself. */
  if (payment === 'card') {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const site = process.env.PUBLIC_SITE_URL || '';
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        client_reference_id: booking.reference,
        customer_email: email,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: CFG.currency.toLowerCase(),
            unit_amount: amount * 100,           // øre
            product_data: {
              name: 'NAVIAR ' + service.code,
              description: express24 ? 'Ekspress 24t' : undefined
            }
          }
        }],
        metadata: { reference: booking.reference, serviceCode: service.code },
        success_url: site + '/index.html?booking=' + booking.reference + '#booking',
        cancel_url: site + '/index.html?cancelled=' + booking.reference + '#booking'
      });
      booking.checkoutId = session.id;
      DB.insertBooking(db, booking);
      return res.json({ reference: booking.reference, checkoutUrl: session.url });
    } catch (err) {
      console.error('[naviar] stripe checkout failed:', err.message);
      return res.status(502).json({ error: 'payment_unavailable' });
    }
  }

  DB.insertBooking(db, booking);
  res.json({ reference: booking.reference });
});

/* Stripe tells us when the money actually arrived. Nothing else may mark a
   booking as paid. */
function handleWebhook(req, res) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).end();

  let event;
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret);
  } catch (err) {
    console.error('[naviar] webhook signature rejected:', err.message);
    return res.status(400).send('bad signature');
  }

  if (event.type === 'checkout.session.completed') {
    const ref = event.data.object.client_reference_id;
    if (DB.markPaid(db, ref)) {
      console.log('[naviar] booking paid:', ref);   // reference only, never case text
    }
  }
  res.json({ received: true });
}

app.post('/api/enquiries', throttle(20, 60 * 60 * 1000), (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 120);
  const email = str(b.email, 160);
  const message = str(b.message, 4000);
  if (!name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  DB.insertEnquiry(db, {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    name, email, phone: str(b.phone, 40), message,
    lang: str(b.lang, 5), source: str(b.source, 40)
  });
  res.json({ ok: true });
});

/* The need finder is how we learn what people actually struggle with, so the
   answers are stored without any personal data attached. */
app.post('/api/needs', throttle(120, 60 * 60 * 1000), (req, res) => {
  const b = req.body || {};
  const int = (v) => (Number.isInteger(v) && v >= 0 && v < 20 ? v : null);
  DB.insertNeed(db, {
    at: new Date().toISOString(),
    lang: str(b.lang, 5),
    situation: int(b.situation),
    office: int(b.office),
    urgency: int(b.urgency),
    recommended: str(b.recommended, 20),
    source: str(b.source, 40)
  });
  res.json({ ok: true });
});

/* An expert asks to join. This creates an application, nothing more: no case
   reaches an adviser before a person has approved them, and the public answer
   never says who is already registered. Same data floor as everything else —
   name, contact, what they consult on. Nothing sensitive is asked or kept. */
app.post('/api/advisers', throttle(10, 60 * 60 * 1000), (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 120);
  const email = str(b.email, 160);
  const specialty = str(b.specialty, 200);
  if (!name || !EMAIL_RE.test(email) || !specialty) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (b.consent !== true) return res.status(400).json({ error: 'consent_required' });
  try {
    DB.insertAdviser(db, {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name, email,
      phone: str(b.phone, 40) || null,
      lang: str(b.lang, 5) || null,
      specialty,
      bio: str(b.bio, 2000)
    });
  } catch (err) {
    if (/UNIQUE/.test(err.message)) return res.status(409).json({ error: 'email_taken' });
    throw err;
  }
  res.json({ ok: true });
});

app.get('/api/admin/advisers', throttle(60, 60 * 1000), requireAdmin, (req, res) => {
  res.json({ statuses: DB.ADVISER_STATUS, transitions: DB.ADVISER_TRANSITIONS,
             advisers: DB.advisers(db) });
});

app.post('/api/admin/adviser', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const b = req.body || {};
  const id = str(b.id, 64);
  const status = str(b.status, 24);
  if (status && !DB.ADVISER_STATUS.includes(status)) {
    return res.status(400).json({ error: 'bad_status' });
  }
  const note = typeof b.note === 'string' ? str(b.note, 2000) : undefined;
  const row = DB.setAdviserStatus(db, id, status || null, note);
  if (row === 'bad_transition') return res.status(409).json({ error: 'bad_transition' });
  if (!row) return res.status(404).json({ error: 'not_found' });
  res.json({ adviser: row });
});

app.post('/api/admin/assign', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const b = req.body || {};
  const out = DB.assignAdviser(db, str(b.reference, 32), str(b.adviserId, 64));
  if (out === 'no_booking' || out === 'no_adviser') return res.status(404).json({ error: out });
  if (out === 'bad_state' || out === 'adviser_not_approved') return res.status(409).json({ error: out });
  res.json({ booking: out });
});

app.get('/api/admin/commissions', throttle(60, 60 * 1000), requireAdmin, (req, res) => {
  res.json(DB.commissions(db));
});

/* The stamp that says the adviser has been paid — by a person, from the bank,
   outside this system. The pilot moves no money on its own. */
app.post('/api/admin/payout', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const id = Number(req.body && req.body.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'bad_id' });
  if (!DB.markPaidOut(db, id)) return res.status(409).json({ error: 'not_pending' });
  res.json({ ok: true });
});

app.get('/api/admin/queue', throttle(60, 60 * 1000), requireAdmin, (req, res) => {
  const q = DB.queue(db, req.query.limit);
  res.json({
    counts: DB.counts(db),
    statuses: { booking: DB.BOOKING_STATUS, enquiry: DB.ENQUIRY_STATUS },
    transitions: DB.BOOKING_TRANSITIONS,
    services: CFG.services.map((s) => ({ id: s.id, code: s.code, price: s.price })),
    bookings: q.bookings,
    enquiries: q.enquiries
  });
});

app.get('/api/admin/events', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const subject = str(req.query.subject, 64);
  if (!subject) return res.status(400).json({ error: 'missing_subject' });
  res.json({ subject, events: DB.events(db, subject) });
});

app.post('/api/admin/booking', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const b = req.body || {};
  const reference = str(b.reference, 32);
  const status = str(b.status, 24);
  if (status && !DB.BOOKING_STATUS.includes(status)) {
    return res.status(400).json({ error: 'bad_status' });
  }
  const note = typeof b.note === 'string' ? str(b.note, 2000) : undefined;
  const row = DB.setBookingStatus(db, reference, status || null, note);
  if (row === 'bad_transition') {
    return res.status(409).json({ error: 'bad_transition' });
  }
  if (!row) return res.status(404).json({ error: 'not_found' });
  res.json({ booking: row });
});

app.post('/api/admin/enquiry', throttle(120, 60 * 1000), requireAdmin, (req, res) => {
  const b = req.body || {};
  const id = str(b.id, 64);
  const status = str(b.status, 24);
  if (status && !DB.ENQUIRY_STATUS.includes(status)) {
    return res.status(400).json({ error: 'bad_status' });
  }
  const note = typeof b.note === 'string' ? str(b.note, 2000) : undefined;
  const row = DB.setEnquiryStatus(db, id, status || null, note);
  if (!row) return res.status(404).json({ error: 'not_found' });
  res.json({ enquiry: row });
});

/* What people actually struggle with. No personal data is stored against these
   answers, so this is the one view that is safe to screenshot. */
app.get('/api/insights', throttle(60, 60 * 1000), requireAdmin, (req, res) => {
  res.json({
    total: DB.counts(db).needs,
    bySituation: DB.tally(db, 'needs', 'situation'),
    byOffice: DB.tally(db, 'needs', 'office'),
    byUrgency: DB.tally(db, 'needs', 'urgency'),
    byLanguage: DB.tally(db, 'needs', 'lang'),
    byRecommendation: DB.tally(db, 'needs', 'recommended'),
    bySource: DB.tally(db, 'needs', 'source'),
    bookingsBySource: DB.tally(db, 'bookings', 'source'),
    counts: DB.counts(db)
  });
});

app.use((err, req, res, next) => {   // eslint-disable-line no-unused-vars
  /* A client that sends broken JSON or an oversized body made a bad request;
     answering 500 tells our monitoring the server is at fault and tells the
     client to retry the same bytes. body-parser marks both cases by type. */
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'bad_json' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'body_too_large' });
  }
  console.error('[naviar]', err.message);
  res.status(500).json({ error: 'server_error' });
});

app.listen(PORT, () => {
  console.log('[naviar] API on http://127.0.0.1:' + PORT);
  console.log('[naviar] payments:', JSON.stringify(paymentModes()));
  if (ADMIN_TOKEN.length < ADMIN_MIN_LENGTH) {
    console.warn('[naviar] ADMIN_TOKEN missing or shorter than ' + ADMIN_MIN_LENGTH +
                 ' characters — the admin queue is switched off.');
  }
});
