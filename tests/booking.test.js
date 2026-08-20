/* Naviar Care — booking / matching tests. Run with: node tests/booking.test.js */
"use strict";

const path = require("path");
const asset = (f) => path.join(__dirname, "..", "assets", "js", f);

global.window = global;
require(asset("data-specialties.js"));
require(asset("data-symptoms.js"));
require(asset("data-languages.js"));
require(asset("data-doctors.js"));
const booking = require(asset("booking-engine.js"));
const N = global.window.NaviarData;

let passed = 0;
const failures = [];
function check(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(name + " — " + e.message); }
}
function assert(c, m) { if (!c) throw new Error(m || "assertion failed"); }
function eq(a, b, m) {
  if (a !== b) throw new Error((m || "value") + ": expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
}

/* ---------------------------------------------------------- availability -- */

check("a clinician with no wait is available now", () => {
  eq(booking.statusOf({ offset: 0 }), "now");
});

check("a short wait counts as available soon", () => {
  eq(booking.statusOf({ offset: 15 }), "soon");
  eq(booking.statusOf({ offset: booking.SOON_MINUTES }), "soon");
});

check("a long wait is scheduled for later", () => {
  eq(booking.statusOf({ offset: booking.SOON_MINUTES + 1 }), "later");
  eq(booking.statusOf({ offset: 240 }), "later");
});

check("a missing or negative offset is treated as available now", () => {
  eq(booking.statusOf({}), "now");
  eq(booking.statusOf({ offset: -30 }), "now");
});

check("the next free slot lands on a five-minute boundary in the future", () => {
  const now = new Date("2026-08-20T10:03:00Z");
  const slot = booking.nextFreeAt({ offset: 12 }, now);
  eq(slot.getMinutes() % 5, 0, "slot minute");
  eq(slot.getSeconds(), 0, "slot seconds");
  assert(slot.getTime() >= now.getTime() + 12 * 60000, "slot must not be earlier than the wait");
});

check("an immediately free clinician still gets a bookable slot", () => {
  const now = new Date("2026-08-20T10:01:30Z");
  const slot = booking.nextFreeAt({ offset: 0 }, now);
  assert(slot.getTime() >= now.getTime(), "slot in the past");
  eq(slot.getMinutes() % 5, 0);
});

/* -------------------------------------------------------------- language -- */

check("a clinician who speaks the language needs no interpreter", () => {
  const fit = booking.languageFit({ langs: ["tr", "en"] }, "tr");
  eq(fit.level, "native");
  eq(fit.interpreter, false);
});

check("a supported language the clinician lacks brings in an interpreter", () => {
  const fit = booking.languageFit({ langs: ["en"] }, "sw");
  eq(fit.level, "interpreter");
  eq(fit.interpreter, true);
});

check("a language outside the catalogue is not matchable", () => {
  eq(booking.languageFit({ langs: ["en"] }, "xx-not-real").level, "none");
});

check("no requested language means every clinician fits", () => {
  eq(booking.languageFit({ langs: ["ja"] }, null).level, "native");
});

check("every catalogued language can be served one way or another", () => {
  const anyDoctor = { langs: [] };
  const unreachable = N.serviceLanguages
    .filter((l) => booking.languageFit(anyDoctor, l.code).level === "none")
    .map((l) => l.code);
  eq(unreachable.length, 0, "unreachable: " + unreachable.join(", "));
});

/* --------------------------------------------------------------- matching -- */

check("matching by specialty only returns that specialty", () => {
  const out = booking.match({ specialty: "cardiology" });
  assert(out.length > 0, "no cardiologists matched");
  for (const m of out) {
    assert(N.doctorSpecialties(m.doctor).includes("cardiology"), m.doctor.name + " is not a cardiologist");
  }
});

check("a clinician whose language is native outranks an equal one needing an interpreter", () => {
  const a = booking.scoreDoctor({ id: "a", spec: "cardiology", also: [], langs: ["tr"], rating: 4.8, years: 10, offset: 0 }, { specialty: "cardiology", language: "tr" });
  const b = booking.scoreDoctor({ id: "b", spec: "cardiology", also: [], langs: ["en"], rating: 4.8, years: 10, offset: 0 }, { specialty: "cardiology", language: "tr" });
  assert(a.score > b.score, "native speaker should rank higher (" + a.score + " vs " + b.score + ")");
});

check("a primary specialty outranks the same specialty held as a secondary", () => {
  const primary   = booking.scoreDoctor({ id: "a", spec: "cardiology", also: [], langs: ["en"], rating: 4.8, years: 10, offset: 0 }, { specialty: "cardiology" });
  const secondary = booking.scoreDoctor({ id: "b", spec: "neurology", also: ["cardiology"], langs: ["en"], rating: 4.8, years: 10, offset: 0 }, { specialty: "cardiology" });
  assert(primary.score > secondary.score, "primary should win");
});

check("sooner availability wins between otherwise identical clinicians", () => {
  const soon = booking.scoreDoctor({ id: "a", spec: "ent", also: [], langs: ["en"], rating: 4.7, years: 10, offset: 0 },  { specialty: "ent" });
  const late = booking.scoreDoctor({ id: "b", spec: "ent", also: [], langs: ["en"], rating: 4.7, years: 10, offset: 90 }, { specialty: "ent" });
  assert(soon.score > late.score, "earlier slot should win");
});

check("waiting is penalised harder when the patient needs care today", () => {
  const doc = { id: "a", spec: "ent", also: [], langs: ["en"], rating: 4.7, years: 10, offset: 60 };
  const routine = booking.scoreDoctor(doc, { specialty: "ent", urgency: "routine" });
  const urgent  = booking.scoreDoctor(doc, { specialty: "ent", urgency: "urgent" });
  assert(urgent.score < routine.score, "urgent should penalise the wait more");
});

check("availableOnly returns nobody who is still busy", () => {
  const out = booking.match({ availableOnly: true });
  assert(out.length > 0, "nobody available now");
  for (const m of out) eq(m.status, "now", m.doctor.name + " was not free");
});

check("results come back ranked best-first", () => {
  const out = booking.match({ specialty: "general-practice" });
  for (let i = 1; i < out.length; i++) {
    assert(out[i - 1].score >= out[i].score, "ordering broken at index " + i);
  }
});

check("the limit is honoured", () => {
  eq(booking.match({ limit: 3 }).length, 3);
});

check("an unstaffed specialty returns nothing rather than the wrong doctor", () => {
  eq(booking.match({ specialty: "not-a-specialty" }).length, 0);
});

check("ranking is deterministic across repeated calls", () => {
  const a = booking.match({ specialty: "pediatrics", language: "en" }).map((m) => m.doctor.id);
  const b = booking.match({ specialty: "pediatrics", language: "en" }).map((m) => m.doctor.id);
  eq(a.join(","), b.join(","), "ordering changed between calls");
});

/* ------------------------------------------------------------- coverage -- */

check("every specialty has at least one bookable clinician", () => {
  const gaps = N.specialties.map((s) => s.id).filter((id) => booking.match({ specialty: id }).length === 0);
  eq(gaps.length, 0, "no clinician for: " + gaps.join(", "));
});

check("every catalogued language can reach a clinician in every specialty", () => {
  const gaps = [];
  for (const spec of N.specialties) {
    for (const lang of N.serviceLanguages) {
      if (booking.match({ specialty: spec.id, language: lang.code }).length === 0) {
        gaps.push(spec.id + "/" + lang.code);
      }
    }
  }
  eq(gaps.length, 0, "gaps: " + gaps.slice(0, 5).join(", "));
});

check("someone is always available right now", () => {
  const c = booking.counts();
  assert(c.now > 0, "nobody free now");
  assert(c.total === N.doctors.length, "roster count mismatch");
});

check("booking references are unique per clinician and stable in shape", () => {
  const when = new Date("2026-08-20T10:00:00Z");
  const a = booking.reference("d01", when);
  const b = booking.reference("d02", when);
  assert(/^NV-[A-Z0-9]+-[A-Z0-9]{5}$/.test(a), "unexpected reference format: " + a);
  assert(a !== b, "references collided");
  eq(booking.reference("d01", when), a, "reference should be stable for the same inputs");
});

/* ---------------------------------------------------------------- report -- */

console.log("\n  Naviar Care — booking engine");
console.log("  " + "-".repeat(46));
if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\n  " + passed + " passed, " + failures.length + " failed\n");
  process.exit(1);
}
console.log("  ✓ " + passed + " tests passed\n");
