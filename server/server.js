/* =============================================================================
   NAVIAR pilot API
   Bookings, payments, enquiries and the need-finder tally.

   Deliberately small: JSON files on disk, one process, no ORM. It is enough
   for Phase 0/1 of the blueprint (5 paid pilot customers) and easy to replace
   with a real database once the case engine exists.

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
const DATA_DIR = path.join(__dirname, 'data');

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

/* ------------------------------------------------------------ tiny storage */
fs.mkdirSync(DATA_DIR, { recursive: true });

function read(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('[naviar] corrupt data file', file, err.message);
    return [];
  }
}

/* Write to a temp file then rename, so a crash mid-write cannot truncate the
   only copy of the bookings. */
function write(file, rows) {
  const p = path.join(DATA_DIR, file);
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
  fs.renameSync(tmp, p);
}

function append(file, row) {
  const rows = read(file);
  rows.push(row);
  write(file, rows);
  return row;
}

/* --------------------------------------------------------------- helpers */
function reference() {
  /* Short, readable, not guessable in bulk. */
  return 'NAV-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
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
function throttle(limit, windowMs) {
  return (req, res, next) => {
    const key = req.ip + ':' + req.path;
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, reset: now + windowMs };
    if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
    entry.count += 1;
    hits.set(key, entry);
    if (entry.count > limit) return res.status(429).json({ error: 'too_many_requests' });
    next();
  };
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

  const taken = read('bookings.json')
    .filter((b) => b.date === date && b.status !== 'cancelled')
    .map((b) => b.time)
    .filter(Boolean);
  res.json({ date, taken });
});

app.post('/api/bookings', throttle(20, 60 * 60 * 1000), async (req, res) => {
  const body = req.body || {};
  const service = serviceById(str(body.serviceId, 20));
  if (!service) return res.status(400).json({ error: 'unknown_service' });

  const details = body.details || {};
  const name = str(details.name, 120);
  const email = str(details.email, 160);
  const phone = str(details.phone, 40);
  const caseText = str(details.caseText, 4000);

  if (!name || !EMAIL_RE.test(email) || !phone || !caseText) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (details.consent !== true) return res.status(400).json({ error: 'consent_required' });
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
    if (new Date(date + 'T' + time + ':00').getTime() < earliest) {
      return res.status(400).json({ error: 'inside_lead_time' });
    }
    const clash = read('bookings.json')
      .some((b) => b.date === date && b.time === time && b.status !== 'cancelled');
    if (clash) return res.status(409).json({ error: 'slot_taken' });
  }

  const express24 = body.express === true;
  const amount = priceFor(service, express24);
  const modes = paymentModes();
  let payment = str(body.payment, 12) || 'invoice';
  if (amount === 0 || amount === null) payment = 'none';
  if (payment === 'card' && !modes.card) payment = 'invoice';
  if (payment === 'vipps') payment = 'invoice';   // until Vipps is live

  const booking = {
    reference: reference(),
    createdAt: new Date().toISOString(),
    status: amount ? 'awaiting_payment' : 'confirmed',
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
        cancel_url: site + '/index.html?cancelled=1#booking'
      });
      booking.checkoutId = session.id;
      append('bookings.json', booking);
      return res.json({ reference: booking.reference, checkoutUrl: session.url });
    } catch (err) {
      console.error('[naviar] stripe checkout failed:', err.message);
      return res.status(502).json({ error: 'payment_unavailable' });
    }
  }

  append('bookings.json', booking);
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
    const rows = read('bookings.json');
    const row = rows.find((b) => b.reference === ref);
    if (row) {
      row.status = 'confirmed';
      row.paidAt = new Date().toISOString();
      write('bookings.json', rows);
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
  append('enquiries.json', {
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
  append('needs.json', {
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

app.get('/api/insights', (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.headers.authorization !== 'Bearer ' + token) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const rows = read('needs.json');
  const tally = (key) => rows.reduce((acc, r) => {
    const k = String(r[key]);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  res.json({
    total: rows.length,
    bySituation: tally('situation'),
    byOffice: tally('office'),
    byUrgency: tally('urgency'),
    byLanguage: tally('lang'),
    byRecommendation: tally('recommended'),
    bySource: tally('source'),
    bookings: read('bookings.json').length,
    enquiries: read('enquiries.json').length
  });
});

app.use((err, req, res, next) => {   // eslint-disable-line no-unused-vars
  console.error('[naviar]', err.message);
  res.status(500).json({ error: 'server_error' });
});

app.listen(PORT, () => {
  console.log('[naviar] API on http://127.0.0.1:' + PORT);
  console.log('[naviar] payments:', JSON.stringify(paymentModes()));
});
