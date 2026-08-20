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

  /* --------------------------------------------------------- session mode */

  /* A clinician may only diagnose, treat and prescribe where they are
     licensed — and licensure follows the PATIENT's location, not the
     clinician's (COMPLIANCE.md §2). This never hides a clinician from a
     patient: anyone can reach any doctor anywhere. It decides what the
     session IS, and that must be shown before booking.                     */
  function sessionMode(doctor, patientCountry) {
    if (!patientCountry) return "unknown";
    var licensed = doctor.licensed || [];
    return licensed.indexOf(patientCountry) !== -1 ? "consultation" : "second-opinion";
  }

  /* What a session in this mode may include. Used to drive the UI copy and,
     server-side, to gate prescribing. */
  function sessionScope(mode) {
    if (mode === "consultation") {
      return { diagnose: true, prescribe: true, sickNote: true, key: "mode.consultation" };
    }
    if (mode === "second-opinion") {
      return { diagnose: false, prescribe: false, sickNote: false, key: "mode.second-opinion" };
    }
    return { diagnose: false, prescribe: false, sickNote: false, key: "mode.unknown" };
  }

  /* ---------------------------------------------------------------- money */

  function pricingRules(patientCountry) {
    var cfg = (root.NaviarConfig && root.NaviarConfig.pricing) || null;
    if (!cfg) return { model: "flat", platformFee: 0, interpreterFee: 0, currency: "USD", currencySymbol: "$", note: null };
    var rules = (patientCountry && cfg.byCountry && cfg.byCountry[patientCountry]) || cfg.default;
    return {
      model: rules.model,
      platformFee: rules.platformFee,
      interpreterFee: rules.interpreterFee,
      note: rules.note,
      currency: cfg.currency,
      currencySymbol: cfg.currencySymbol
    };
  }

  /* Full price breakdown. Every line is shown to the patient before they
     confirm: price transparency is required in several of our markets, and
     a stated platform fee is a far weaker fee-splitting argument than a
     silent percentage cut (COMPLIANCE.md §4).                               */
  function quote(doctor, options) {
    var opts = options || {};
    var rules = pricingRules(opts.patientCountry);
    var doctorFee = Number(doctor.fee) || 0;

    var platformFee = rules.model === "percent"
      ? Math.round(doctorFee * (rules.platformFee / 100) * 100) / 100
      : rules.platformFee;

    var interpreterFee = opts.interpreter ? rules.interpreterFee : 0;

    return {
      doctorFee: doctorFee,
      platformFee: platformFee,
      interpreterFee: interpreterFee,
      total: Math.round((doctorFee + platformFee + interpreterFee) * 100) / 100,
      model: rules.model,
      note: rules.note,
      currency: rules.currency,
      currencySymbol: rules.currencySymbol
    };
  }

  function formatMoney(amount, q) {
    var symbol = (q && q.currencySymbol) || "$";
    var rounded = Math.round(amount * 100) / 100;
    return symbol + (rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2));
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

    // A declared sub-specialty interest in what the patient actually
    // described is a better signal than the broad specialty alone.
    var focusHits = [];
    if (criteria.symptoms && criteria.symptoms.length) {
      var focus = doctor.focus || [];
      for (var f = 0; f < criteria.symptoms.length; f++) {
        if (focus.indexOf(criteria.symptoms[f]) !== -1) focusHits.push(criteria.symptoms[f]);
      }
      score += Math.min(focusHits.length, 3) * 7;
    }

    // Country filter, when the patient has asked for a specific one.
    if (criteria.country && doctor.country !== criteria.country) return null;

    // Being licensed where the patient is means they can actually be treated.
    var mode = sessionMode(doctor, criteria.patientCountry);
    if (mode === "consultation") score += 10;
    if (criteria.mode && criteria.mode !== mode) return null;

    // Gentle nudges from experience and patient feedback.
    score += (doctor.rating - 4.5) * 8;
    score += Math.min(doctor.years, 25) * 0.18;

    return {
      doctor: doctor,
      score: Math.round(score * 100) / 100,
      language: fit,
      status: statusOf(doctor),
      waitMinutes: mins,
      mode: mode,
      scope: sessionScope(mode),
      focusHits: focusHits
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

  /* Clinicians grouped by the category their specialty belongs to, so the
     directory can be browsed by area of medicine rather than as a flat list. */
  function groupByCategory(matches) {
    var specialties = data().specialties || [];
    var categoryOf = Object.create(null);
    for (var i = 0; i < specialties.length; i++) categoryOf[specialties[i].id] = specialties[i].group;

    var buckets = Object.create(null);
    var order = [];
    for (var m = 0; m < matches.length; m++) {
      var group = categoryOf[matches[m].doctor.spec] || "other";
      if (!buckets[group]) { buckets[group] = []; order.push(group); }
      buckets[group].push(matches[m]);
    }

    /* Present categories in the catalogue's own order, not discovery order,
       so the directory does not reshuffle as filters change. */
    var canonical = [];
    for (var c = 0; c < specialties.length; c++) {
      var g = specialties[c].group;
      if (canonical.indexOf(g) === -1) canonical.push(g);
    }
    var out = [];
    for (var k = 0; k < canonical.length; k++) {
      if (buckets[canonical[k]]) out.push({ category: canonical[k], matches: buckets[canonical[k]] });
    }
    for (var o = 0; o < order.length; o++) {
      if (canonical.indexOf(order[o]) === -1) out.push({ category: order[o], matches: buckets[order[o]] });
    }
    return out;
  }

  /* Countries with at least one clinician, for the country filter. */
  function doctorCountries() {
    var seen = Object.create(null);
    var roster = data().doctors || [];
    for (var i = 0; i < roster.length; i++) {
      seen[roster[i].country] = (seen[roster[i].country] || 0) + 1;
    }
    return seen;
  }

  /* Deterministic, human-readable reference for a confirmed booking. */
  function reference(doctorId, when) {
    var stamp = (when instanceof Date ? when : new Date()).getTime().toString(36).toUpperCase();
    return "NV-" + String(doctorId || "XX").toUpperCase().replace(/[^A-Z0-9]/g, "") + "-" + stamp.slice(-5);
  }

  return {
    match: match,
    scoreDoctor: scoreDoctor,
    sessionMode: sessionMode,
    sessionScope: sessionScope,
    quote: quote,
    pricingRules: pricingRules,
    formatMoney: formatMoney,
    groupByCategory: groupByCategory,
    doctorCountries: doctorCountries,
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
