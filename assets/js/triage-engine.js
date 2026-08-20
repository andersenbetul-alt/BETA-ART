/* ==========================================================================
   Naviar Care — triage / specialty routing engine (pure logic, no DOM)
   --------------------------------------------------------------------------
   route(input) -> {
     urgency:  "emergency" | "urgent" | "routine",
     flags:    [redFlagId],
     matches:  [{ id, score, percent }],   // ranked specialties
     reasons:  [reasonKey]                 // why this urgency was chosen
   }
   Exposed on window.NaviarTriage and module.exports so the same code runs in
   the browser and under node for the test suite.
   ========================================================================== */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  root.NaviarTriage = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  var AGE_GROUPS = ["infant", "child", "teen", "adult", "senior"];
  var DURATIONS  = ["today", "days", "weeks", "months"];
  var SEVERITIES = ["mild", "moderate", "severe"];

  var SEVERITY_URGENCY = { mild: 0, moderate: 0.5, severe: 1.5 };
  var DURATION_URGENCY = { today: 0.3, days: 0, weeks: -0.3, months: -0.6 };

  function data() {
    return (root.NaviarData) || {};
  }

  function clone(map) {
    var out = Object.create(null);
    for (var k in map) if (Object.prototype.hasOwnProperty.call(map, k)) out[k] = map[k];
    return out;
  }

  function add(scores, id, amount) {
    if (!id || !amount) return;
    scores[id] = (scores[id] || 0) + amount;
  }

  /* ------------------------------------------------------------- scoring -- */

  function scoreSpecialties(symptoms, input) {
    var scores = Object.create(null);
    var i, j;

    for (i = 0; i < symptoms.length; i++) {
      var pairs = symptoms[i].spec || [];
      for (j = 0; j < pairs.length; j++) {
        add(scores, pairs[j][0], pairs[j][1]);
      }
    }

    /* Age steers who should see the patient, not what is wrong with them. */
    if (input.age === "infant") {
      add(scores, "pediatrics", 14);
      delete scores["gynecology"];
      delete scores["urology"];
    } else if (input.age === "child") {
      add(scores, "pediatrics", 11);
      delete scores["gynecology"];
    } else if (input.age === "teen") {
      add(scores, "pediatrics", 5);
    } else if (input.age === "senior") {
      add(scores, "internal-medicine", 4);
      add(scores, "cardiology", 1.5);
      // Paediatrics is never right for an adult, whatever the complaint says.
      delete scores["pediatrics"];
    }
    if (input.age === "adult") delete scores["pediatrics"];

    /* A long-standing problem belongs with a specialist rather than urgent care. */
    if (input.duration === "months" || input.duration === "weeks") {
      if (scores["emergency"]) scores["emergency"] *= 0.35;
      add(scores, "internal-medicine", 1.5);
    }
    if (input.duration === "today" && input.severity === "severe") {
      add(scores, "emergency", 5);
    }
    if (input.severity === "severe") {
      add(scores, "emergency", 3);
    } else if (input.severity === "mild" && scores["emergency"]) {
      scores["emergency"] *= 0.5;
    }

    return scores;
  }

  function rank(scores, opts) {
    var list = [];
    for (var id in scores) {
      if (Object.prototype.hasOwnProperty.call(scores, id) && scores[id] > 0) {
        list.push({ id: id, score: Math.round(scores[id] * 100) / 100 });
      }
    }
    list.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.id < b.id ? -1 : 1;      // stable, predictable tie-break
    });

    var limit = (opts && opts.limit) || 4;
    var top = list.slice(0, limit);
    var total = 0;
    for (var i = 0; i < top.length; i++) total += top[i].score;
    for (var j = 0; j < top.length; j++) {
      top[j].percent = total > 0 ? Math.round((top[j].score / total) * 100) : 0;
    }
    return top;
  }

  /* ------------------------------------------------------------- urgency -- */

  function assessUrgency(symptoms, input, flags) {
    var reasons = [];

    if (flags.length) {
      reasons.push("reason.redflag");
      return { urgency: "emergency", reasons: reasons };
    }

    var base = 1;
    for (var i = 0; i < symptoms.length; i++) {
      if (symptoms[i].urgency > base) base = symptoms[i].urgency;
    }
    if (base >= 3) reasons.push("reason.symptom-serious");

    var score = base
      + (SEVERITY_URGENCY[input.severity] || 0)
      + (DURATION_URGENCY[input.duration] || 0);

    if (input.severity === "severe") reasons.push("reason.severe");
    if (input.duration === "today")  reasons.push("reason.sudden");
    if (input.duration === "months") reasons.push("reason.longstanding");

    /* The very young and the very old decompensate faster — nudge them up. */
    if ((input.age === "infant" || input.age === "senior") && base >= 2) {
      score += 0.5;
      reasons.push("reason.age-risk");
    }

    /* Emergency is deliberately hard to reach without a red flag: crying wolf
       on every serious-sounding complaint teaches patients to ignore it.
       A serious symptom on its own lands on "urgent" (be seen today).      */
    if (score >= 4.0) return { urgency: "emergency", reasons: reasons };
    if (score >= 2.4) return { urgency: "urgent",    reasons: reasons };
    return { urgency: "routine", reasons: reasons };
  }

  /* ---------------------------------------------------------------- main -- */

  function route(input) {
    var cfg = input || {};
    var byId = data().symptomById || function () { return null; };

    var picked = [];
    var ids = cfg.symptoms || [];
    for (var i = 0; i < ids.length; i++) {
      var found = byId(ids[i]);
      if (found) picked.push(found);
    }

    var flags = (cfg.redFlags || []).slice();

    var normalised = {
      age:      AGE_GROUPS.indexOf(cfg.age) !== -1 ? cfg.age : "adult",
      duration: DURATIONS.indexOf(cfg.duration) !== -1 ? cfg.duration : "days",
      severity: SEVERITIES.indexOf(cfg.severity) !== -1 ? cfg.severity : "moderate"
    };

    var verdict = assessUrgency(picked, normalised, flags);
    var scores = scoreSpecialties(picked, normalised);

    if (verdict.urgency === "emergency") {
      add(scores, "emergency", 25);
    }

    /* Nothing recognised: send them to a generalist rather than nowhere. */
    var matches = rank(scores, { limit: 4 });
    if (!matches.length) {
      matches = [{ id: "general-practice", score: 1, percent: 100 }];
    }

    return {
      urgency: verdict.urgency,
      reasons: verdict.reasons,
      flags: flags,
      matches: matches,
      input: normalised,
      symptoms: picked.map(function (s) { return s.id; })
    };
  }

  /* --------------------------------------------------------------- search -- */

  /* Matches a query against the translated label plus the synonym lists, so a
     patient can type in their own language or in transliterated form.        */
  function normaliseText(value) {
    var text = String(value == null ? "" : value).toLowerCase();
    // Strip diacritics so "başağrısı", "basagrisi" and "bas agrisi" all match.
    if (typeof text.normalize === "function") {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text.replace(/[\u0131]/g, "i").replace(/\s+/g, " ");
  }

  function search(query, opts) {
    var options = opts || {};
    var translate = options.t || function (key, fallback) { return fallback || key; };
    var limit = options.limit || 8;
    var needle = normaliseText(query).trim();
    if (needle.length < 2) return [];

    var all = data().symptoms || [];
    var hits = [];

    for (var i = 0; i < all.length; i++) {
      var sym = all[i];
      var label = translate("sym." + sym.id, sym.id.replace(/-/g, " "));
      var haystack = [normaliseText(label), normaliseText(sym.id.replace(/-/g, " "))];

      var syn = sym.syn || {};
      for (var lang in syn) {
        if (!Object.prototype.hasOwnProperty.call(syn, lang)) continue;
        for (var s = 0; s < syn[lang].length; s++) haystack.push(normaliseText(syn[lang][s]));
      }

      var best = 0;
      for (var h = 0; h < haystack.length; h++) {
        var text = haystack[h];
        if (!text) continue;
        if (text === needle) { best = Math.max(best, 3); }
        else if (text.indexOf(needle) === 0) { best = Math.max(best, 2); }
        else if (text.indexOf(needle) !== -1) { best = Math.max(best, 1); }
      }

      if (best > 0) hits.push({ id: sym.id, label: label, weight: best, symptom: sym });
    }

    hits.sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.label.localeCompare(b.label);
    });
    return hits.slice(0, limit);
  }

  return {
    route: route,
    search: search,
    ageGroups: AGE_GROUPS,
    durations: DURATIONS,
    severities: SEVERITIES
  };
});
