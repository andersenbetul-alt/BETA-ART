/* Naviar Care — clinician verification registers.

   These tests guard one rule: nothing auto-approves. A country we have not
   actually verified must route to a human, and every application must carry
   contactable referees. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["data-countries.js", "data-registers.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "assets/js", f), "utf8"), ctx);
}
const Data = ctx.window.NaviarData;

let pass = 0;
const failures = [];

function check(name, fn) {
  try {
    const r = fn();
    if (r === false) throw new Error("returned false");
    pass++;
  } catch (e) {
    failures.push(name + " — " + e.message);
  }
}

function eq(a, b, what) {
  if (a !== b) throw new Error((what || "") + " expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
}

/* ------------------------------------------------------------- Norway */

check("Norway is the one confirmed register", () => {
  eq(Data.registerConfirmed("NO"), true);
});

check("Norway names HPR and its public lookup", () => {
  const r = Data.registerFor("NO");
  eq(r.register.name, "Helsepersonellregisteret (HPR)");
  if (!/register\.helsedirektoratet\.no/.test(r.register.lookup)) {
    throw new Error("lookup URL is not the Helsedirektoratet register");
  }
});

check("Norway's API records the Altinn organisation-number gate", () => {
  const api = Data.registerFor("NO").register.api;
  eq(api.auth, "Maskinporten");
  eq(api.scope, "nhn:hpr/basic");
  if (!/Altinn/.test(api.requires)) throw new Error("Altinn requirement not recorded");
});

check("Norway carries a sanctions source separate from the register", () => {
  const r = Data.registerFor("NO");
  if (!r.sanctions) throw new Error("no sanctions source");
  if (r.sanctions.name === r.register.name) throw new Error("sanctions must be a separate source");
});

check("IMI is recorded as insufficient on its own", () => {
  const note = Data.registerFor("NO").crossBorderAlerts.note;
  if (!/not evidence|never treat it as a pass/i.test(note)) {
    throw new Error("IMI's known gap is not written down");
  }
});

/* --------------------------------------------------------- no auto-pass */

check("a confirmed register with an API is assisted, never automatic", () => {
  const route = Data.reviewRoute("NO");
  eq(route.route, "assisted");
  if (route.route === "automatic") throw new Error("nothing may auto-approve");
});

check("an unconfirmed register routes to manual review", () => {
  for (const code of ["SE", "GB", "US", "TR"]) {
    eq(Data.reviewRoute(code).route, "manual", code);
  }
});

check("an unmapped country routes to manual review", () => {
  const route = Data.reviewRoute("ZZ");
  eq(route.route, "manual");
  if (!/No register mapped/.test(route.reason)) throw new Error("reason should say it is unmapped");
});

check("every country the platform offers resolves to a route", () => {
  for (const c of Data.countries) {
    const route = Data.reviewRoute(c.code);
    if (route.route !== "manual" && route.route !== "assisted") {
      throw new Error(c.code + " produced route " + route.route);
    }
  }
});

/* ------------------------------------------------------------ referees */

check("at least two referees are required", () => {
  if (Data.MIN_REFERENCES < 2) throw new Error("minimum is below two");
});

check("referees are required for every country, mapped or not", () => {
  for (const code of ["NO", "SE", "ZZ"]) {
    const ids = Data.requiredChecks(code).map(c => c.id);
    if (ids.indexOf("references") === -1) throw new Error(code + " does not require referees");
  }
});

check("referee and indemnity checks are never marked automatable", () => {
  for (const c of Data.requiredChecks("NO")) {
    if ((c.id === "references" || c.id === "indemnity") && c.automatable) {
      throw new Error(c.id + " must not be automatable");
    }
  }
});

check("Norway's checks include sanctions and criminal record", () => {
  const ids = Data.requiredChecks("NO").map(c => c.id);
  for (const want of ["identity", "register", "sanctions", "references", "indemnity", "criminalRecord"]) {
    if (ids.indexOf(want) === -1) throw new Error("missing check: " + want);
  }
});

check("an unmapped country still demands identity, licence and referees", () => {
  const ids = Data.requiredChecks("ZZ").map(c => c.id);
  for (const want of ["identity", "register", "references", "indemnity"]) {
    if (ids.indexOf(want) === -1) throw new Error("missing check: " + want);
  }
});

check("the register check for an unmapped country is not automatable", () => {
  const reg = Data.requiredChecks("ZZ").filter(c => c.id === "register")[0];
  eq(reg.automatable, false);
  eq(reg.known, false);
});

/* --------------------------------------------------------------- output */

console.log("\n  Naviar Care — clinician verification registers");
console.log("  ----------------------------------------------");
if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\n  " + failures.length + " failed, " + pass + " passed\n");
  process.exit(1);
}
console.log("  ✓ " + pass + " tests passed\n");
