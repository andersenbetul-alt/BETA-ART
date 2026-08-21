/* =============================================================================
   Storage for the NAVIAR pilot.

   SQLite through node:sqlite — built into Node 22, so there is nothing to
   compile and nothing to install. One file on disk, WAL mode, real
   transactions. It replaces the JSON files the pilot started with; anything
   already written to those files is imported once on first boot.

   Note for deployment: this is a *file*. Serverless hosts with an ephemeral
   filesystem (Vercel, Netlify functions) will silently lose it between
   deploys. Run this on a host with a persistent disk, or point DATA_DIR at a
   mounted volume.
   ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const SCHEMA = [
  /* v1 — bookings, enquiries, need-finder answers and a small audit trail. */
  `
  CREATE TABLE bookings (
    reference     TEXT PRIMARY KEY,
    created_at    TEXT NOT NULL,
    status        TEXT NOT NULL,
    service_id    TEXT NOT NULL,
    service_code  TEXT NOT NULL,
    date          TEXT,
    time          TEXT,
    minutes       INTEGER,
    express       INTEGER NOT NULL DEFAULT 0,
    amount        INTEGER,
    net           INTEGER,
    currency      TEXT NOT NULL,
    commission    INTEGER,
    payment       TEXT NOT NULL,
    lang          TEXT,
    source        TEXT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    customer_lang TEXT,
    channel       TEXT,
    tolk_lang     TEXT,
    tolk_dialect  TEXT,
    case_text     TEXT NOT NULL,
    checkout_id   TEXT,
    paid_at       TEXT,
    internal_note TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX idx_bookings_slot   ON bookings(date, time);
  CREATE INDEX idx_bookings_status ON bookings(status, created_at);

  CREATE TABLE enquiries (
    id            TEXT PRIMARY KEY,
    at            TEXT NOT NULL,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    message       TEXT NOT NULL,
    lang          TEXT,
    source        TEXT,
    status        TEXT NOT NULL DEFAULT 'new',
    internal_note TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX idx_enquiries_status ON enquiries(status, at);

  CREATE TABLE needs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    at          TEXT NOT NULL,
    lang        TEXT,
    situation   INTEGER,
    office      INTEGER,
    urgency     INTEGER,
    recommended TEXT,
    source      TEXT
  );

  /* Who moved a case where, and when. Never contains case text. */
  CREATE TABLE events (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    at        TEXT NOT NULL,
    subject   TEXT NOT NULL,
    kind      TEXT NOT NULL,
    detail    TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX idx_events_subject ON events(subject, id);
  `,
  /* v2 — the case workflow gained the steps that were being done off the books:
     a review before money changes hands, a search for the right consultant, and
     a read-through before anything reaches the customer. 'fit_checked' said
     only that the review had happened, so it becomes 'in_review'. */
  `
  UPDATE bookings SET status = 'in_review' WHERE status = 'fit_checked';
  `
];

/* The statuses a case can hold, in the order of the workflow. */
const BOOKING_STATUS = [
  'new',                // arrived, nobody has looked at it yet
  'in_review',          // the free fit check: can we help, and may we
  'awaiting_payment',   // scope agreed, money not in
  'assigning',          // paid; a person is choosing the consultant
  'in_progress',        // the consultant is doing the work
  'quality_check',      // read through before it goes out
  'delivered',          // the customer has the answer
  'declined',           // we will not take it — referred on
  'cancelled'
];

/* Which moves are allowed. This is a guard, not paperwork: it is what stops a
   case reaching the customer without passing quality control, and stops one
   being marked delivered without having been paid for. A case can be abandoned
   from anywhere it is still open; nothing leaves 'delivered' or 'declined'. */
const BOOKING_TRANSITIONS = {
  new:              ['in_review', 'awaiting_payment', 'assigning', 'declined', 'cancelled'],
  in_review:        ['awaiting_payment', 'assigning', 'declined', 'cancelled'],
  awaiting_payment: ['assigning', 'cancelled'],
  assigning:        ['in_progress', 'cancelled'],
  in_progress:      ['quality_check', 'cancelled'],
  quality_check:    ['delivered', 'in_progress', 'cancelled'],   // back for rework
  delivered:        [],
  declined:         [],
  cancelled:        []
};

/* Where the case is waiting on us rather than on the customer, the consultant
   or the bank. These are the ones the queue puts at the top. */
const BOOKING_ON_US = ['new', 'in_review', 'assigning', 'quality_check'];

const ENQUIRY_STATUS = ['new', 'answered', 'closed'];

function open(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, 'naviar.db'));
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 4000');
  migrate(db);
  importLegacyJson(db, dataDir);
  return db;
}

function migrate(db) {
  const current = db.prepare('PRAGMA user_version').get().user_version;
  for (let v = current; v < SCHEMA.length; v += 1) {
    db.exec('BEGIN');
    try {
      db.exec(SCHEMA[v]);
      db.exec('PRAGMA user_version = ' + (v + 1));
      db.exec('COMMIT');
      console.log('[naviar] database migrated to v' + (v + 1));
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
}

/* The pilot's first bookings were written to JSON files. Move them across once,
   then rename the files so this never runs twice. */
function importLegacyJson(db, dataDir) {
  const jobs = [
    ['bookings.json', insertBooking],
    ['enquiries.json', insertEnquiry],
    ['needs.json', insertNeed]
  ];
  jobs.forEach(([file, insert]) => {
    const p = path.join(dataDir, file);
    if (!fs.existsSync(p)) return;
    let rows;
    try {
      rows = JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (err) {
      console.error('[naviar] could not read legacy', file, '-', err.message);
      return;
    }
    if (!Array.isArray(rows) || !rows.length) { fs.renameSync(p, p + '.imported'); return; }
    let moved = 0;
    rows.forEach((row) => {
      try { insert(db, row); moved += 1; } catch (err) { /* already there */ }
    });
    fs.renameSync(p, p + '.imported');
    console.log('[naviar] imported ' + moved + ' row(s) from ' + file);
  });
}

/* ----------------------------------------------------------------- writes */
function insertBooking(db, b) {
  const c = b.customer || {};
  const t = b.tolk || {};
  db.prepare(`
    INSERT INTO bookings (
      reference, created_at, status, service_id, service_code, date, time, minutes,
      express, amount, net, currency, commission, payment, lang, source,
      name, email, phone, customer_lang, channel, tolk_lang, tolk_dialect,
      case_text, checkout_id, paid_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    b.reference, b.createdAt, b.status, b.serviceId, b.serviceCode,
    b.date ?? null, b.time ?? null, b.minutes ?? null,
    b.express ? 1 : 0, b.amount ?? null, b.net ?? null, b.currency,
    b.commission ?? null, b.payment, b.lang ?? null, b.source ?? null,
    c.name ?? '', c.email ?? '', c.phone ?? null, c.lang ?? null, c.channel ?? null,
    t.language ?? null, t.dialect ?? null,
    b.caseText ?? '', b.checkoutId ?? null, b.paidAt ?? null
  );
  logEvent(db, b.reference, 'created', b.serviceCode);
  return b;
}

function insertEnquiry(db, e) {
  db.prepare(`
    INSERT INTO enquiries (id, at, name, email, phone, message, lang, source)
    VALUES (?,?,?,?,?,?,?,?)
  `).run(e.id, e.at, e.name, e.email, e.phone ?? null, e.message, e.lang ?? null, e.source ?? null);
  return e;
}

function insertNeed(db, n) {
  db.prepare(`
    INSERT INTO needs (at, lang, situation, office, urgency, recommended, source)
    VALUES (?,?,?,?,?,?,?)
  `).run(n.at, n.lang ?? null, n.situation ?? null, n.office ?? null,
         n.urgency ?? null, n.recommended ?? null, n.source ?? null);
  return n;
}

function logEvent(db, subject, kind, detail) {
  db.prepare('INSERT INTO events (at, subject, kind, detail) VALUES (?,?,?,?)')
    .run(new Date().toISOString(), subject, kind, String(detail || '').slice(0, 200));
}

/* Payment moves a case out of limbo and into the consultant search — and only
   from limbo. A case already being worked on keeps its place in the workflow;
   the payment is still stamped on it. */
function markPaid(db, reference) {
  const changed = db.prepare(`
    UPDATE bookings
    SET paid_at = ?,
        status  = CASE WHEN status = 'awaiting_payment' THEN 'assigning' ELSE status END
    WHERE reference = ? AND paid_at IS NULL
  `).run(new Date().toISOString(), reference).changes;
  if (changed) logEvent(db, reference, 'paid', '');
  return changed > 0;
}

function nextStatuses(from) {
  return BOOKING_TRANSITIONS[from] || [];
}

/* Returns null when there is no such case, and the string 'bad_transition' when
   the move is not one the workflow allows. */
function setBookingStatus(db, reference, status, note) {
  const row = db.prepare('SELECT status FROM bookings WHERE reference = ?').get(reference);
  if (!row) return null;
  if (status && status !== row.status) {
    if (!nextStatuses(row.status).includes(status)) return 'bad_transition';
    db.prepare('UPDATE bookings SET status = ? WHERE reference = ?').run(status, reference);
    logEvent(db, reference, 'status', row.status + ' → ' + status);
  }
  if (typeof note === 'string') {
    db.prepare('UPDATE bookings SET internal_note = ? WHERE reference = ?').run(note, reference);
  }
  return db.prepare('SELECT * FROM bookings WHERE reference = ?').get(reference);
}

function setEnquiryStatus(db, id, status, note) {
  const row = db.prepare('SELECT status FROM enquiries WHERE id = ?').get(id);
  if (!row) return null;
  if (status && status !== row.status) {
    db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id);
    logEvent(db, id, 'status', row.status + ' → ' + status);
  }
  if (typeof note === 'string') {
    db.prepare('UPDATE enquiries SET internal_note = ? WHERE id = ?').run(note, id);
  }
  return db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
}

/* ------------------------------------------------------------------ reads */
function referenceTaken(db, reference) {
  return db.prepare('SELECT 1 FROM bookings WHERE reference = ? LIMIT 1').get(reference) !== undefined;
}

function takenSlots(db, date) {
  return db.prepare(`
    SELECT time FROM bookings
    WHERE date = ? AND time IS NOT NULL AND status NOT IN ('cancelled', 'declined')
  `).all(date).map((r) => r.time);
}

function slotClash(db, date, time) {
  return db.prepare(`
    SELECT 1 FROM bookings WHERE date = ? AND time = ? AND status NOT IN ('cancelled', 'declined') LIMIT 1
  `).get(date, time) !== undefined;
}

function queue(db, limit) {
  const n = Math.min(Number(limit) || 100, 500);
  return {
    bookings: db.prepare(`
      SELECT * FROM bookings ORDER BY
        CASE status
          WHEN 'new'              THEN 0
          WHEN 'quality_check'    THEN 1
          WHEN 'assigning'        THEN 2
          WHEN 'in_review'        THEN 3
          WHEN 'in_progress'      THEN 4
          WHEN 'awaiting_payment' THEN 5
          WHEN 'delivered'        THEN 6
          ELSE 7
        END,
        created_at DESC
      LIMIT ?
    `).all(n),
    enquiries: db.prepare(`
      SELECT * FROM enquiries ORDER BY
        CASE status WHEN 'new' THEN 0 WHEN 'answered' THEN 1 ELSE 2 END, at DESC
      LIMIT ?
    `).all(n)
  };
}

function events(db, subject) {
  return db.prepare('SELECT at, kind, detail FROM events WHERE subject = ? ORDER BY id').all(subject);
}

function tally(db, table, column) {
  return db.prepare(
    'SELECT ' + column + ' AS k, COUNT(*) AS n FROM ' + table + ' GROUP BY ' + column
  ).all().reduce((acc, r) => { acc[String(r.k)] = r.n; return acc; }, {});
}

function counts(db) {
  const one = (sql, ...args) => db.prepare(sql).get(...args).n;
  return {
    bookings:  one('SELECT COUNT(*) AS n FROM bookings'),
    paid:      one("SELECT COUNT(*) AS n FROM bookings WHERE paid_at IS NOT NULL"),
    open:      one("SELECT COUNT(*) AS n FROM bookings WHERE status IN"
                   + " ('new','in_review','assigning','in_progress','quality_check')"),
    onUs:      one("SELECT COUNT(*) AS n FROM bookings WHERE status IN"
                   + " ('new','in_review','assigning','quality_check')"),
    delivered: one("SELECT COUNT(*) AS n FROM bookings WHERE status = 'delivered'"),
    enquiries: one('SELECT COUNT(*) AS n FROM enquiries'),
    needs:     one('SELECT COUNT(*) AS n FROM needs'),
    revenue:   db.prepare(
      "SELECT COALESCE(SUM(amount), 0) AS n FROM bookings WHERE paid_at IS NOT NULL"
    ).get().n
  };
}

module.exports = {
  open, BOOKING_STATUS, BOOKING_TRANSITIONS, BOOKING_ON_US, ENQUIRY_STATUS, nextStatuses,
  insertBooking, insertEnquiry, insertNeed,
  markPaid, setBookingStatus, setEnquiryStatus,
  referenceTaken, takenSlots, slotClash, queue, events, tally, counts, logEvent
};
