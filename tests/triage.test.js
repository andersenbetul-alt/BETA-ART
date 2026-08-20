/* Naviar Care — triage engine tests. Run with: node tests/triage.test.js
   No dependencies: the browser data files attach themselves to a global,
   so we load them into this process and exercise the pure engine.        */
"use strict";

const path = require("path");
const asset = (f) => path.join(__dirname, "..", "assets", "js", f);

global.window = global;
require(asset("data-specialties.js"));
require(asset("data-symptoms.js"));
require(asset("data-languages.js"));
require(asset("data-doctors.js"));
const triage = require(asset("triage-engine.js"));

let passed = 0;
const failures = [];

function check(name, fn) {
  try { fn(); passed++; }
  catch (err) { failures.push(name + " — " + err.message); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
function eq(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error((msg || "value") + ": expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
  }
}
const top = (r) => r.matches[0].id;
const ids = (r) => r.matches.map((m) => m.id);

/* ------------------------------------------------------------- routing -- */

check("routes chest pain to cardiology", () => {
  const r = triage.route({ symptoms: ["chest-pain"], age: "adult", duration: "days", severity: "moderate" });
  eq(top(r), "cardiology", "top match");
});

check("routes a rash to dermatology", () => {
  const r = triage.route({ symptoms: ["rash"], age: "adult", duration: "weeks", severity: "mild" });
  eq(top(r), "dermatology", "top match");
});

check("routes toothache to dentistry", () => {
  eq(top(triage.route({ symptoms: ["toothache"] })), "dentistry");
});

check("combines complaints instead of only using the first", () => {
  const r = triage.route({ symptoms: ["cough", "wheezing"], age: "adult" });
  eq(top(r), "pulmonology", "cough + wheezing");
});

check("returns at most four ranked specialties", () => {
  const r = triage.route({ symptoms: ["abdominal-pain", "fever", "fatigue", "back-pain", "rash"] });
  assert(r.matches.length <= 4, "got " + r.matches.length + " matches");
});

check("percentages are present and sum to roughly 100", () => {
  const r = triage.route({ symptoms: ["headache", "dizziness"] });
  const sum = r.matches.reduce((a, m) => a + m.percent, 0);
  assert(Math.abs(sum - 100) <= 2, "percent sum was " + sum);
});

check("falls back to general practice when nothing is recognised", () => {
  const r = triage.route({ symptoms: ["not-a-real-symptom"] });
  eq(top(r), "general-practice");
  eq(r.matches[0].percent, 100);
});

check("handles being called with no input at all", () => {
  const r = triage.route();
  assert(r.matches.length >= 1, "should still return a destination");
  eq(r.urgency, "routine");
});

/* ------------------------------------------------------------ age rules -- */

check("sends a child to paediatrics", () => {
  const r = triage.route({ symptoms: ["fever"], age: "child" });
  eq(top(r), "pediatrics", "child with fever");
});

check("never sends an adult to paediatrics", () => {
  const r = triage.route({ symptoms: ["child-fever"], age: "adult" });
  assert(!ids(r).includes("pediatrics"), "adult was routed to paediatrics: " + ids(r));
});

check("never sends an infant to gynaecology or urology", () => {
  const r = triage.route({ symptoms: ["pelvic-pain", "painful-urination"], age: "infant" });
  assert(!ids(r).includes("gynecology"), "infant -> gynaecology");
  assert(!ids(r).includes("urology"), "infant -> urology");
});

check("keeps gynaecology available for an adult", () => {
  const r = triage.route({ symptoms: ["pelvic-pain"], age: "adult" });
  eq(top(r), "gynecology");
});

/* ------------------------------------------------------------- urgency -- */

check("any red flag forces an emergency result", () => {
  const r = triage.route({ symptoms: ["itching"], redFlags: ["face-droop"], severity: "mild", duration: "months" });
  eq(r.urgency, "emergency", "red flag must win over a mild, long-standing complaint");
  assert(r.reasons.includes("reason.redflag"), "reason should cite the red flag");
});

check("emergency result puts emergency care at the top", () => {
  const r = triage.route({ symptoms: ["headache"], redFlags: ["consciousness"] });
  eq(top(r), "emergency");
});

check("severe sudden chest pain is an emergency", () => {
  const r = triage.route({ symptoms: ["chest-pain"], duration: "today", severity: "severe" });
  eq(r.urgency, "emergency");
});

check("moderate chest pain over several days is urgent, not an emergency", () => {
  const r = triage.route({ symptoms: ["chest-pain"], duration: "days", severity: "moderate" });
  eq(r.urgency, "urgent", "should not over-triage to emergency without a red flag");
});

check("emergency is unreachable for a mild routine complaint without red flags", () => {
  for (const age of triage.ageGroups) {
    const r = triage.route({ symptoms: ["acne"], age, duration: "months", severity: "mild" });
    assert(r.urgency !== "emergency", age + " mild acne escalated to emergency");
  }
});

check("mild long-standing acne is routine", () => {
  const r = triage.route({ symptoms: ["acne"], duration: "months", severity: "mild" });
  eq(r.urgency, "routine");
});

check("moderate recent blood in urine is at least urgent", () => {
  const r = triage.route({ symptoms: ["blood-in-urine"], duration: "days", severity: "moderate" });
  assert(r.urgency !== "routine", "got " + r.urgency);
});

check("long-standing complaints de-prioritise emergency care", () => {
  const acute   = triage.route({ symptoms: ["injury"], duration: "today",  severity: "moderate" });
  const chronic = triage.route({ symptoms: ["injury"], duration: "months", severity: "moderate" });
  const scoreOf = (r) => (r.matches.find((m) => m.id === "emergency") || { score: 0 }).score;
  assert(scoreOf(chronic) < scoreOf(acute), "chronic emergency score should be lower");
});

check("urgency only ever takes one of three values", () => {
  const seen = new Set();
  for (const age of triage.ageGroups) {
    for (const duration of triage.durations) {
      for (const severity of triage.severities) {
        seen.add(triage.route({ symptoms: ["fever", "cough"], age, duration, severity }).urgency);
      }
    }
  }
  for (const value of seen) assert(["emergency", "urgent", "routine"].includes(value), "unexpected urgency " + value);
});

/* -------------------------------------------------------------- search -- */

check("finds a complaint by its English name", () => {
  const hits = triage.search("chest");
  assert(hits.some((h) => h.id === "chest-pain"), "chest-pain not found");
});

check("finds a complaint typed in Turkish with diacritics", () => {
  const hits = triage.search("göğüs");
  assert(hits.some((h) => h.id === "chest-pain"), "Turkish search failed: " + hits.map((h) => h.id));
});

check("finds a complaint typed in Turkish without diacritics", () => {
  const hits = triage.search("bas agrisi");
  assert(hits.some((h) => h.id === "headache"), "ASCII Turkish search failed: " + hits.map((h) => h.id));
});

check("matches lay synonyms, not just clinical terms", () => {
  assert(triage.search("throwing up").some((h) => h.id === "nausea-vomiting"), "'throwing up' failed");
  assert(triage.search("cannot sleep").some((h) => h.id === "insomnia"), "'cannot sleep' failed");
  assert(triage.search("pimples").some((h) => h.id === "acne"), "'pimples' failed");
});

check("ignores queries that are too short to be useful", () => {
  eq(triage.search("a").length, 0);
  eq(triage.search("").length, 0);
});

check("caps the number of suggestions", () => {
  assert(triage.search("pain", { limit: 5 }).length <= 5, "limit not honoured");
});

check("uses the supplied translator so results follow the UI language", () => {
  const hits = triage.search("XYZZY", { t: (key) => (key === "sym.fever" ? "XYZZY" : key) });
  assert(hits.some((h) => h.id === "fever"), "translated label was not searched");
});

/* ---------------------------------------------------------- data sanity -- */

check("every complaint routes to at least one known specialty", () => {
  const known = new Set(window.NaviarData.specialties.map((s) => s.id));
  for (const sym of window.NaviarData.symptoms) {
    assert(sym.spec.length > 0, sym.id + " has no specialty");
    for (const [id] of sym.spec) assert(known.has(id), sym.id + " -> unknown specialty " + id);
  }
});

check("every complaint produces a result when routed on its own", () => {
  for (const sym of window.NaviarData.symptoms) {
    const r = triage.route({ symptoms: [sym.id] });
    assert(r.matches.length > 0, sym.id + " produced no destination");
    assert(r.matches[0].percent > 0, sym.id + " produced a zero-confidence match");
  }
});

check("every specialty can be reached by some complaint", () => {
  const reachable = new Set();
  for (const sym of window.NaviarData.symptoms) {
    for (const [id] of sym.spec) reachable.add(id);
  }
  const orphans = window.NaviarData.specialties.map((s) => s.id).filter((id) => !reachable.has(id));
  eq(orphans.length, 0, "unreachable specialties " + orphans.join(", "));
});

/* --------------------------------------------------------------- report -- */

console.log("\n  Naviar Care — triage engine");
console.log("  " + "-".repeat(46));
if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\n  " + passed + " passed, " + failures.length + " failed\n");
  process.exit(1);
}
console.log("  ✓ " + passed + " tests passed\n");
