/* ==========================================================================
   Naviar Care — symptom intake wizard (triage.html)
   ========================================================================== */
(function (window, document) {
  "use strict";

  var form = document.getElementById("triage-form");
  if (!form) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;
  var Engine = window.NaviarTriage;

  var TOTAL_STEPS = 5;
  var STEP_LABELS = ["triage.step1.label", "triage.step2.label", "triage.step3.label", "triage.step4.label", "triage.step5.label"];
  var STEP_FALLBACK = ["Your symptoms", "About the patient", "Safety check", "Getting ready", "Your summary"];

  /* Free-text preparation answers. These never leave the device unless the
     patient goes on to book, and they are what turns a symptom check into
     something you can hand to a doctor. */
  var PREP_FIELDS = ["medications", "allergies", "conditions", "pattern", "tried", "questions"];

  var state = {
    step: 1,
    symptoms: [],
    redFlags: [],
    region: null,
    result: null,
    country: "",
    prep: {}
  };

  var els = {
    steps:      form.querySelectorAll(".triage-step"),
    fill:       form.querySelector("[data-progress-fill]"),
    label:      form.querySelector("[data-progress-label]"),
    stepNum:    form.querySelector("[data-progress-step]"),
    input:      document.getElementById("symptom-input"),
    results:    document.getElementById("symptom-results"),
    regionBar:  form.querySelector("[data-region-chips]"),
    regionSyms: form.querySelector("[data-region-symptoms]"),
    selected:   form.querySelector("[data-selected-list]"),
    error:      form.querySelector("[data-error-symptoms]"),
    flags:      form.querySelector("[data-redflags]"),
    result:     form.querySelector("[data-result-root]"),
    country:    form.querySelector("[data-triage-country]"),
    next:       form.querySelector("[data-triage-next]"),
    back:       form.querySelector("[data-triage-back]"),
    restart:    form.querySelector("[data-triage-restart]")
  };

  /* ------------------------------------------------------------- helpers */

  function radioValue(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : null;
  }

  function regionsInOrder() {
    var seen = [];
    for (var i = 0; i < Data.symptoms.length; i++) {
      if (seen.indexOf(Data.symptoms[i].region) === -1) seen.push(Data.symptoms[i].region);
    }
    return seen;
  }

  function countryName(code) { return UI.countryName(code); }

  function fillCountries() {
    if (!els.country) return;
    els.country.innerHTML = "";

    var none = document.createElement("option");
    none.value = "";
    none.textContent = UI.t("triage.country.none", "Select your country…");
    els.country.appendChild(none);

    var sorted = Data.countries.slice().sort(function (a, b) {
      return countryName(a.code).localeCompare(countryName(b.code), UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      var o = document.createElement("option");
      o.value = sorted[i].code;
      o.textContent = countryName(sorted[i].code);
      els.country.appendChild(o);
    }
    els.country.value = state.country;
  }

  function readPrep() {
    for (var i = 0; i < PREP_FIELDS.length; i++) {
      var node = document.getElementById("prep-" + PREP_FIELDS[i]);
      if (node) state.prep[PREP_FIELDS[i]] = node.value.trim();
    }
  }

  /* ------------------------------------------------------------- step 1 */

  function renderRegionChips() {
    if (!els.regionBar) return;
    els.regionBar.innerHTML = "";
    var regions = regionsInOrder();
    for (var i = 0; i < regions.length; i++) {
      (function (region) {
        var chip = UI.el("button", "chip", UI.t("region." + region, region));
        chip.type = "button";
        chip.setAttribute("aria-pressed", state.region === region ? "true" : "false");
        chip.addEventListener("click", function () {
          state.region = state.region === region ? null : region;
          renderRegionChips();
          renderRegionSymptoms();
        });
        els.regionBar.appendChild(chip);
      })(regions[i]);
    }
  }

  function renderRegionSymptoms() {
    if (!els.regionSyms) return;
    els.regionSyms.innerHTML = "";
    if (!state.region) return;

    for (var i = 0; i < Data.symptoms.length; i++) {
      var sym = Data.symptoms[i];
      if (sym.region !== state.region) continue;
      (function (id) {
        var chip = UI.el("button", "chip", UI.symptomName(id));
        chip.type = "button";
        chip.setAttribute("aria-pressed", state.symptoms.indexOf(id) !== -1 ? "true" : "false");
        chip.addEventListener("click", function () {
          toggleSymptom(id);
          renderRegionSymptoms();
        });
        els.regionSyms.appendChild(chip);
      })(sym.id);
    }
  }

  function toggleSymptom(id) {
    var at = state.symptoms.indexOf(id);
    if (at === -1) state.symptoms.push(id);
    else state.symptoms.splice(at, 1);
    renderSelected();
  }

  function renderSelected() {
    if (!els.selected) return;
    els.selected.innerHTML = "";

    if (!state.symptoms.length) {
      els.selected.appendChild(UI.el("span", "selected-empty", UI.t("triage.selected.empty", "Nothing chosen yet.")));
      return;
    }

    for (var i = 0; i < state.symptoms.length; i++) {
      (function (id) {
        var item = UI.el("span", "selected-item");
        item.appendChild(document.createTextNode(UI.symptomName(id)));

        var remove = UI.el("button", null, "×");
        remove.type = "button";
        remove.setAttribute("aria-label", UI.format("triage.selected.remove", { name: UI.symptomName(id) }, "Remove {name}"));
        remove.addEventListener("click", function () {
          toggleSymptom(id);
          renderRegionSymptoms();
        });

        item.appendChild(remove);
        els.selected.appendChild(item);
      })(state.symptoms[i]);
    }
    if (els.error) els.error.style.display = "none";
  }

  function renderSearch(query) {
    if (!els.results) return;
    els.results.innerHTML = "";

    var hits = Engine.search(query, { t: UI.t, limit: 8 });
    els.input.setAttribute("aria-expanded", hits.length ? "true" : "false");

    for (var i = 0; i < hits.length; i++) {
      (function (hit) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "option");
        btn.appendChild(document.createTextNode(hit.label));

        var spec = UI.el("span", "sr-specialty", UI.specialtyName(hit.symptom.spec[0][0]));
        btn.appendChild(spec);

        btn.addEventListener("click", function () {
          if (state.symptoms.indexOf(hit.id) === -1) toggleSymptom(hit.id);
          els.input.value = "";
          renderSearch("");
          renderRegionSymptoms();
          els.input.focus();
        });

        li.appendChild(btn);
        els.results.appendChild(li);
      })(hits[i]);
    }
  }

  /* ------------------------------------------------------------- step 3 */

  function renderRedFlags() {
    if (!els.flags) return;
    els.flags.innerHTML = "";

    for (var i = 0; i < Data.redFlags.length; i++) {
      (function (flag) {
        var label = UI.el("label", "checkbox");
        var box = document.createElement("input");
        box.type = "checkbox";
        box.value = flag.id;
        box.checked = state.redFlags.indexOf(flag.id) !== -1;
        if (box.checked) label.classList.add("is-checked");

        box.addEventListener("change", function () {
          var at = state.redFlags.indexOf(flag.id);
          if (box.checked && at === -1) state.redFlags.push(flag.id);
          else if (!box.checked && at !== -1) state.redFlags.splice(at, 1);
          label.classList.toggle("is-checked", box.checked);
        });

        label.appendChild(box);
        label.appendChild(UI.el("span", null, UI.t("flag." + flag.id, flag.id)));
        els.flags.appendChild(label);
      })(Data.redFlags[i]);
    }
  }

  /* ------------------------------------------------------------- step 4 */

  var URGENCY_ICON = {
    emergency: '<path d="M12 9v4.5" stroke-linecap="round"/><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/><path d="M10.3 4.3 2.8 17.4A2 2 0 0 0 4.5 20.4h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" stroke-linejoin="round"/>',
    urgent:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/>',
    routine:   '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function urgencyIcon(level) {
    return '<svg class="result-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'
      + URGENCY_ICON[level] + "</svg>";
  }

  function renderResult() {
    var result = Engine.route({
      symptoms: state.symptoms,
      redFlags: state.redFlags,
      age: radioValue("age"),
      duration: radioValue("duration"),
      severity: radioValue("severity")
    });
    state.result = result;

    var root = els.result;
    root.innerHTML = "";

    /* --- urgency banner ------------------------------------------------ */
    var header = UI.el("div", "result-header result-header--" + result.urgency);
    header.innerHTML = urgencyIcon(result.urgency);

    var headText = UI.el("div");
    headText.style.flex = "1";
    headText.appendChild(UI.el("h3", null, UI.t("urgency." + result.urgency + ".title", result.urgency)));
    headText.appendChild(UI.el("p", null, UI.t("urgency." + result.urgency + ".advice", "")));
    header.appendChild(headText);
    root.appendChild(header);

    /* --- emergency short-circuit --------------------------------------- */
    if (result.urgency === "emergency") {
      var alert = UI.el("div", "callout callout--danger");
      alert.style.marginBottom = "1.5rem";
      var alertBody = UI.el("div");
      alertBody.appendChild(UI.el("p", "callout__title", UI.t("triage.result.emergency.t", "Contact emergency services now")));
      alertBody.appendChild(UI.el("p", null, UI.t("triage.result.emergency.d", "Do not wait for an online consultation.")));
      alert.appendChild(alertBody);
      root.appendChild(alert);

      if (result.flags.length) {
        var why = UI.el("p", "card__meta", UI.t("triage.result.flagged", "You told us the following is happening right now:"));
        root.appendChild(why);
        var flagList = UI.el("ul", "feature-list");
        for (var f = 0; f < result.flags.length; f++) {
          flagList.appendChild(UI.el("li", null, UI.t("flag." + result.flags[f], result.flags[f])));
        }
        root.appendChild(flagList);
      }
    }

    /* --- why we said that ----------------------------------------------- */
    if (result.reasons.length) {
      var why = UI.el("div", "card");
      why.style.marginBottom = "1.5rem";
      why.appendChild(UI.el("h4", null, UI.t("triage.result.why", "Why we are saying this")));
      var reasonList = UI.el("ul", "feature-list");
      for (var r = 0; r < result.reasons.length; r++) {
        reasonList.appendChild(UI.el("li", null, UI.t(result.reasons[r], result.reasons[r])));
      }
      why.appendChild(reasonList);
      root.appendChild(why);
    }

    /* --- ranked specialties -------------------------------------------- */
    root.appendChild(UI.el("h3", null, UI.t("triage.result.matches", "Where you should be seen")));
    root.appendChild(UI.el("p", "card__meta", UI.t("triage.result.matches.help",
      "Ranked by how well each specialty fits what you described.")));

    var list = UI.el("div");
    for (var i = 0; i < result.matches.length; i++) {
      var m = result.matches[i];
      var row = UI.el("div", "match" + (i === 0 ? " match--primary" : ""));
      row.appendChild(UI.el("div", "match__rank", String(i + 1)));

      var body = UI.el("div", "match__body");
      body.appendChild(UI.el("h4", null, UI.specialtyName(m.id)));
      body.appendChild(UI.el("p", null, UI.t("spec." + m.id + ".desc", "")));
      row.appendChild(body);

      row.appendChild(UI.el("span", "match__score", UI.format("triage.result.fit", { n: m.percent }, "{n}% fit")));
      list.appendChild(row);
    }
    root.appendChild(list);

    /* --- what you told us ---------------------------------------------- */
    var summary = UI.el("div", "card");
    summary.style.marginTop = "1.5rem";
    summary.appendChild(UI.el("h4", null, UI.t("triage.result.summary", "What you told us")));

    var dl = UI.el("ul", "summary-list");
    function addRow(labelKey, labelFallback, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(labelKey, labelFallback)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }

    var names = [];
    for (var s = 0; s < result.symptoms.length; s++) names.push(UI.symptomName(result.symptoms[s]));
    addRow("triage.selected.label", "Your symptoms", names.length ? names.join(", ") : UI.t("triage.result.none", "None given"));
    addRow("triage.age.label", "Who the consultation is for", UI.t("age." + result.input.age, result.input.age));
    addRow("triage.duration.label", "How long", UI.t("duration." + result.input.duration, result.input.duration));
    addRow("triage.severity.label", "How bad", UI.t("severity." + result.input.severity, result.input.severity));
    summary.appendChild(dl);
    root.appendChild(summary);

    /* --- the document the patient takes to their appointment ------------ */
    root.appendChild(buildPreVisitSummary(result));

    /* --- next step ------------------------------------------------------ */
    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.75rem";

    var book = UI.el("a", "btn btn--primary btn--lg",
      UI.format("triage.result.book", { spec: UI.specialtyName(result.matches[0].id) }, "Book a {spec} doctor"));
    book.href = "booking.html?specialty=" + encodeURIComponent(result.matches[0].id)
              + "&urgency=" + encodeURIComponent(result.urgency);
    book.addEventListener("click", storeHandoff);
    actions.appendChild(book);

    var print = UI.el("button", "btn btn--ghost no-print", UI.t("cta.print", "Print my summary"));
    print.type = "button";
    print.addEventListener("click", function () { window.print(); });
    actions.appendChild(print);

    root.appendChild(actions);

    var disclaimer = UI.el("p", "card__meta");
    disclaimer.style.marginTop = "1.5rem";
    disclaimer.textContent = UI.t("triage.result.disclaimer",
      "This is guidance on where to be seen, not a diagnosis. Only a doctor who assesses you can diagnose you.");
    root.appendChild(disclaimer);
  }

  /* The deliverable of a preparation tool: everything a doctor asks in the
     first minutes, written down, in the patient's own language. Works whether
     they go on to book here or walk into their own hospital with it. */
  function buildPreVisitSummary(result) {
    var wrap = UI.el("div", "card");
    wrap.style.marginTop = "1.5rem";

    wrap.appendChild(UI.el("h3", null, UI.t("prep.summary.title", "Take this to your appointment")));
    wrap.appendChild(UI.el("p", "card__meta", UI.t("prep.summary.lead",
      "Print this, or keep it on your phone. Hand it over at the start — it answers most of what you would otherwise be asked from memory.")));

    var dl = UI.el("ul", "summary-list");
    function row(labelKey, labelFallback, value) {
      if (!value) return;
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(labelKey, labelFallback)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }

    var names = result.symptoms.map(function (id) { return UI.symptomName(id); });
    row("prep.summary.complaint", "Why I am here", names.join(", "));
    row("triage.duration.label", "How long", UI.t("duration." + result.input.duration, result.input.duration));
    row("triage.severity.label", "How bad", UI.t("severity." + result.input.severity, result.input.severity));
    row("triage.age.label", "Patient", UI.t("age." + result.input.age, result.input.age));

    if (result.flags.length) {
      row("prep.summary.flags", "Warning signs reported",
        result.flags.map(function (id) { return UI.t("flag." + id, id); }).join("; "));
    }

    row("prep.medications", "Medicines", state.prep.medications);
    row("prep.allergies", "Allergies", state.prep.allergies);
    row("prep.conditions", "Existing conditions", state.prep.conditions);
    row("prep.pattern", "Better or worse with", state.prep.pattern);
    row("prep.tried", "Already tried", state.prep.tried);

    row("prep.summary.suggested", "Suggested department",
      result.matches.map(function (m) { return UI.specialtyName(m.id); }).slice(0, 2).join(" / "));

    wrap.appendChild(dl);

    if (state.prep.questions) {
      wrap.appendChild(UI.el("h4", null, UI.t("prep.summary.questions", "Questions I want answered")));
      var list = UI.el("ul", "feature-list");
      var lines = state.prep.questions.split(/\r?\n/);
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line) list.appendChild(UI.el("li", null, line));
      }
      wrap.appendChild(list);
    }

    var caveat = UI.el("p", "card__meta");
    caveat.style.marginTop = "1rem";
    caveat.textContent = UI.t("prep.summary.caveat",
      "This was written by the patient, not by a clinician. It is a record of what they reported, not a diagnosis or a referral.");
    wrap.appendChild(caveat);

    return wrap;
  }

  function storeHandoff() {
    if (!state.result) return;
    try {
      window.sessionStorage.setItem("naviar.triage", JSON.stringify({
        urgency: state.result.urgency,
        matches: state.result.matches,
        symptoms: state.result.symptoms,
        age: state.result.input.age,
        country: state.country,
        prep: state.prep
      }));
      if (state.country) window.localStorage.setItem("naviar.country", state.country);
    } catch (e) { /* storage unavailable — the query string still carries the specialty */ }
  }

  /* -------------------------------------------------------- step machine */

  function showStep(n) {
    state.step = n;
    for (var i = 0; i < els.steps.length; i++) {
      els.steps[i].classList.toggle("is-active", Number(els.steps[i].getAttribute("data-step")) === n);
    }

    if (els.fill) els.fill.style.width = Math.round((n / TOTAL_STEPS) * 100) + "%";
    if (els.stepNum) els.stepNum.textContent = String(n);
    if (els.label) els.label.textContent = UI.t(STEP_LABELS[n - 1], STEP_FALLBACK[n - 1]);

    els.back.hidden = n === 1;
    els.restart.hidden = n !== TOTAL_STEPS;
    els.next.hidden = n === TOTAL_STEPS;
    els.next.textContent = n === TOTAL_STEPS - 1
      ? UI.t("cta.see-result", "See my result")
      : UI.t("cta.continue", "Continue");

    if (n === TOTAL_STEPS) renderResult();

    var card = form.closest(".triage-card");
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function goNext() {
    if (state.step === 1 && !state.symptoms.length) {
      if (els.error) els.error.style.display = "block";
      els.input.focus();
      return;
    }
    if (state.step === 2 && els.country) state.country = els.country.value;
    if (state.step === 4) readPrep();
    if (state.step < TOTAL_STEPS) showStep(state.step + 1);
  }

  /* ----------------------------------------------------------------- init */

  function seedFromQuery() {
    var match = /[?&]symptom=([^&#]+)/.exec(window.location.search);
    if (!match) return;
    var id = decodeURIComponent(match[1]);
    if (Data.symptomById(id) && state.symptoms.indexOf(id) === -1) state.symptoms.push(id);
  }

  function seedCountry() {
    try {
      var saved = window.localStorage.getItem("naviar.country");
      if (saved && Data.countryByCode(saved)) state.country = saved;
    } catch (e) { /* storage unavailable */ }
  }

  function wire() {
    els.next.addEventListener("click", goNext);
    els.back.addEventListener("click", function () {
      if (state.step > 1) showStep(state.step - 1);
    });
    els.restart.addEventListener("click", function () {
      state.symptoms = [];
      state.redFlags = [];
      state.region = null;
      state.result = null;
      state.country = "";
      state.prep = {};
      form.reset();
      renderSelected();
      renderRegionChips();
      renderRegionSymptoms();
      renderRedFlags();
      showStep(1);
    });

    form.addEventListener("submit", function (event) { event.preventDefault(); });

    els.input.addEventListener("input", function () { renderSearch(els.input.value); });
    els.input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        var first = els.results.querySelector("button");
        if (first) first.click();
      }
      if (event.key === "Escape") {
        els.input.value = "";
        renderSearch("");
      }
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".symptom-search")) renderSearch("");
    });
  }

  function renderAll() {
    fillCountries();
    renderRegionChips();
    renderRegionSymptoms();
    renderSelected();
    renderRedFlags();
    if (state.step === TOTAL_STEPS) renderResult();
    if (els.label) els.label.textContent = UI.t(STEP_LABELS[state.step - 1], STEP_FALLBACK[state.step - 1]);
    if (els.next && state.step < TOTAL_STEPS) {
      els.next.textContent = state.step === TOTAL_STEPS - 1
        ? UI.t("cta.see-result", "See my result")
        : UI.t("cta.continue", "Continue");
    }
  }

  seedFromQuery();
  seedCountry();
  fillCountries();
  wire();
  showStep(1);
  UI.onLanguageChange(renderAll);
})(window, document);
