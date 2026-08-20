/* ==========================================================================
   Naviar Care — availability & doctor matching (pure logic, no DOM)
   --------------------------------------------------------------------------
   Answers the question the patient actually asks: "who can see me right now,
   and can they understand me?"  Language is treated as a first-class matching
   criterion, not a filter applied afterwards.
   ========================================================================== */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  root.NaviarBooking = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  var SOON_MINUTES = 30;   // "available shortly" window
  var SLOT_MINUTES = 5;    // slots are offered on a 5-minute grid

  function data() { return root.NaviarData || {}; }

  /* ---------------------------------------------------------- availability */

  function minutesUntilFree(doctor) {
    return Math.max(0, Number(doctor.offset) || 0);
  }

  /* Next bookable slot, rounded up to the slot grid. */
  function nextFreeAt(doctor, now) {
    var base = now instanceof Date ? now.getTime() : Date.now();
    var when = new Date(base + minutesUntilFree(doctor) * 60000);
    var remainder = when.getMinutes() % SLOT_MINUTES;
    if (remainder !== 0) when.setMinutes(when.getMinutes() + (SLOT_MINUTES - remainder));
    when.setSeconds(0, 0);
    return when;
  }

  function statusOf(doctor) {
    var mins = minutesUntilFree(doctor);
    if (mins === 0) return "now";
    if (mins <= SOON_MINUTES) return "soon";
    return "later";
  }

  /* ------------------------------------------------------------- language */

  /* How well a clinician covers the patient's language:
       "native"      — the clinician speaks it
       "interpreter" — a medical interpreter joins the call
       "none"        — we cannot serve this language at all               */
  function languageFit(doctor, langCode) {
    if (!langCode) return { level: "native", interpreter: false };
    if ((doctor.langs || []).indexOf(langCode) !== -1) {
      return { level: "native", interpreter: false };
    }
    var entry = (data().languageByCode || function () { return null; })(langCode);
    if (entry) return { level: "interpreter", interpreter: true };
    return { level: "none", interpreter: false };
  }

  /* --------------------------------------------------------------- scoring */

  function scoreDoctor(doctor, criteria) {
    var score = 0;
    var specialties = (data().doctorSpecialties || function (d) { return [d.spec]; })(doctor);

    // Specialty fit — a primary specialty beats a secondary one.
    if (criteria.specialty) {
      if (doctor.spec === criteria.specialty) score += 60;
      else if (specialties.indexOf(criteria.specialty) !== -1) score += 38;
      else return null;                       // wrong specialty: not a match
    }

    // Speaking the patient's language outright is worth a lot.
    var fit = languageFit(doctor, criteria.language);
    if (fit.level === "native") score += 30;
    else if (fit.level === "interpreter") score += 12;
    else return null;

    // Sooner is better, sharply so when the patient needs care today.
    var mins = minutesUntilFree(doctor);
    var waitPenalty = Math.min(mins / 6, 20);
    if (criteria.urgency === "emergency" || criteria.urgency === "urgent") waitPenalty *= 1.8;
    score -= waitPenalty;

    // Gentle nudges from experience and patient feedback.
    score += (doctor.rating - 4.5) * 8;
    score += Math.min(doctor.years, 25) * 0.18;

    return {
      doctor: doctor,
      score: Math.round(score * 100) / 100,
      language: fit,
      status: statusOf(doctor),
      waitMinutes: mins
    };
  }

  /* ----------------------------------------------------------------- match */

  function match(criteria) {
    var cfg = criteria || {};
    var roster = data().doctors || [];
    var results = [];

    for (var i = 0; i < roster.length; i++) {
      if (cfg.availableOnly && statusOf(roster[i]) !== "now") continue;
      var scored = scoreDoctor(roster[i], cfg);
      if (scored) results.push(scored);
    }

    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.doctor.id < b.doctor.id ? -1 : 1;
    });

    return cfg.limit ? results.slice(0, cfg.limit) : results;
  }

  /* Everything the patient could pick from, for populating filter menus. */
  function availableLanguages() {
    var seen = Object.create(null);
    var roster = data().doctors || [];
    for (var i = 0; i < roster.length; i++) {
      var langs = roster[i].langs || [];
      for (var j = 0; j < langs.length; j++) seen[langs[j]] = (seen[langs[j]] || 0) + 1;
    }
    return seen;
  }

  function counts() {
    var roster = data().doctors || [];
    var now = 0, soon = 0;
    for (var i = 0; i < roster.length; i++) {
      var s = statusOf(roster[i]);
      if (s === "now") now++;
      else if (s === "soon") soon++;
    }
    return { total: roster.length, now: now, soon: soon };
  }

  /* Deterministic, human-readable reference for a confirmed booking. */
  function reference(doctorId, when) {
    var stamp = (when instanceof Date ? when : new Date()).getTime().toString(36).toUpperCase();
    return "NV-" + String(doctorId || "XX").toUpperCase().replace(/[^A-Z0-9]/g, "") + "-" + stamp.slice(-5);
  }

  return {
    match: match,
    scoreDoctor: scoreDoctor,
    nextFreeAt: nextFreeAt,
    statusOf: statusOf,
    languageFit: languageFit,
    minutesUntilFree: minutesUntilFree,
    availableLanguages: availableLanguages,
    counts: counts,
    reference: reference,
    SOON_MINUTES: SOON_MINUTES
  };
});
