/* ==========================================================================
   Naviar Care — clinician registration (join.html)
   Registration is an APPLICATION, not a sign-up: nothing goes live until the
   licence is verified. See COMPLIANCE.md §2.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var form = document.getElementById("join-form");
  if (!form) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;
  var Engine = window.NaviarTriage;

  var state = { focus: [], languages: [], jurisdictions: [] };

  var els = {
    country: form.querySelector("[data-join-country]"),
    specialty: form.querySelector("[data-join-specialty]"),
    also: form.querySelector("[data-join-also]"),
    jurisdictions: form.querySelector("[data-join-jurisdictions]"),
    focusSearch: document.getElementById("j-focus-search"),
    focusResults: document.getElementById("j-focus-results"),
    focusList: form.querySelector("[data-join-focus]"),
    langSearch: document.getElementById("j-lang-search"),
    langResults: document.getElementById("j-lang-results"),
    langList: form.querySelector("[data-join-languages]"),
    declarationsError: form.querySelector("[data-error-declarations]"),
    status: form.querySelector("[data-join-status]")
  };

  function countryName(code) { return UI.countryName(code); }

  function option(value, label) {
    var o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  }

  /* ------------------------------------------------------------ selects */

  function fillCountries() {
    if (!els.country) return;
    var chosen = els.country.value;
    els.country.innerHTML = "";
    els.country.appendChild(option("", UI.t("join.country.none", "Select a country…")));
    var sorted = Data.countries.slice().sort(function (a, b) {
      return countryName(a.code).localeCompare(countryName(b.code), UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      els.country.appendChild(option(sorted[i].code, countryName(sorted[i].code)));
    }
    els.country.value = chosen;
  }

  function fillSpecialties() {
    var groups = [];
    for (var i = 0; i < Data.specialties.length; i++) {
      if (groups.indexOf(Data.specialties[i].group) === -1) groups.push(Data.specialties[i].group);
    }

    function build(select, placeholderKey, placeholderText) {
      if (!select) return;
      var chosen = select.value;
      select.innerHTML = "";
      select.appendChild(option("", UI.t(placeholderKey, placeholderText)));
      for (var g = 0; g < groups.length; g++) {
        var optgroup = document.createElement("optgroup");
        optgroup.label = UI.t("category." + groups[g], groups[g]);
        var members = Data.specialties.filter(function (s) { return s.group === groups[g]; });
        members.sort(function (a, b) {
          return UI.specialtyName(a.id).localeCompare(UI.specialtyName(b.id), UI.locale());
        });
        for (var m = 0; m < members.length; m++) {
          optgroup.appendChild(option(members[m].id, UI.specialtyName(members[m].id)));
        }
        select.appendChild(optgroup);
      }
      select.value = chosen;
    }

    build(els.specialty, "join.specialty.none", "Select your specialty…");
    build(els.also, "join.also.none", "None");
  }

  /* ------------------------------------------------------ jurisdictions */

  function renderJurisdictions() {
    if (!els.jurisdictions) return;
    els.jurisdictions.innerHTML = "";

    /* The country of practice is always included, and the whole list stays
       short by offering the countries we already serve plus whatever the
       clinician adds. */
    var offer = [];
    if (els.country && els.country.value) offer.push(els.country.value);
    for (var i = 0; i < state.jurisdictions.length; i++) {
      if (offer.indexOf(state.jurisdictions[i]) === -1) offer.push(state.jurisdictions[i]);
    }
    var common = ["TR", "DE", "GB", "US", "FR", "ES", "NL", "SE", "IN", "PK", "NG", "KE", "BR", "MX", "SA", "AE"];
    for (var c = 0; c < common.length; c++) {
      if (offer.indexOf(common[c]) === -1) offer.push(common[c]);
    }

    for (var o = 0; o < offer.length; o++) {
      (function (code) {
        var chip = UI.el("button", "chip", countryName(code));
        chip.type = "button";
        var on = state.jurisdictions.indexOf(code) !== -1;
        chip.setAttribute("aria-pressed", on ? "true" : "false");
        chip.addEventListener("click", function () {
          var at = state.jurisdictions.indexOf(code);
          if (at === -1) state.jurisdictions.push(code);
          else state.jurisdictions.splice(at, 1);
          renderJurisdictions();
        });
        els.jurisdictions.appendChild(chip);
      })(offer[o]);
    }
  }

  /* ------------------------------------------------- token list helpers */

  function renderTokens(host, items, labelFor, onRemove) {
    if (!host) return;
    host.innerHTML = "";
    if (!items.length) {
      host.appendChild(UI.el("span", "selected-empty", UI.t("triage.selected.empty", "Nothing chosen yet.")));
      return;
    }
    for (var i = 0; i < items.length; i++) {
      (function (value) {
        var item = UI.el("span", "selected-item");
        item.appendChild(document.createTextNode(labelFor(value)));
        var remove = UI.el("button", null, "×");
        remove.type = "button";
        remove.setAttribute("aria-label", UI.format("triage.selected.remove", { name: labelFor(value) }, "Remove {name}"));
        remove.addEventListener("click", function () { onRemove(value); });
        item.appendChild(remove);
        host.appendChild(item);
      })(items[i]);
    }
  }

  function renderFocus() {
    renderTokens(els.focusList, state.focus, UI.symptomName, function (id) {
      state.focus.splice(state.focus.indexOf(id), 1);
      renderFocus();
    });
  }

  function renderLanguages() {
    renderTokens(els.langList, state.languages, UI.languageName, function (code) {
      state.languages.splice(state.languages.indexOf(code), 1);
      renderLanguages();
    });
  }

  /* ------------------------------------------------------------ search */

  function resultRow(label, meta, onPick) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.appendChild(document.createTextNode(label));
    if (meta) btn.appendChild(UI.el("span", "sr-specialty", meta));
    btn.addEventListener("click", onPick);
    li.appendChild(btn);
    return li;
  }

  function searchFocus(query) {
    if (!els.focusResults) return;
    els.focusResults.innerHTML = "";
    var hits = Engine.search(query, { t: UI.t, limit: 8 });
    els.focusSearch.setAttribute("aria-expanded", hits.length ? "true" : "false");
    for (var i = 0; i < hits.length; i++) {
      (function (hit) {
        els.focusResults.appendChild(resultRow(hit.label, UI.specialtyName(hit.symptom.spec[0][0]), function () {
          if (state.focus.indexOf(hit.id) === -1) state.focus.push(hit.id);
          els.focusSearch.value = "";
          searchFocus("");
          renderFocus();
          els.focusSearch.focus();
        }));
      })(hits[i]);
    }
  }

  function normalise(value) {
    var text = String(value || "").toLowerCase();
    if (typeof text.normalize === "function") {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text;
  }

  function searchLanguages(query) {
    if (!els.langResults) return;
    els.langResults.innerHTML = "";
    var needle = normalise(query).trim();
    if (needle.length < 1) { els.langSearch.setAttribute("aria-expanded", "false"); return; }

    var hits = [];
    for (var i = 0; i < Data.serviceLanguages.length && hits.length < 8; i++) {
      var lang = Data.serviceLanguages[i];
      if (state.languages.indexOf(lang.code) !== -1) continue;
      if (normalise(lang.en).indexOf(needle) !== -1 || normalise(lang.native).indexOf(needle) !== -1) {
        hits.push(lang);
      }
    }
    els.langSearch.setAttribute("aria-expanded", hits.length ? "true" : "false");

    for (var h = 0; h < hits.length; h++) {
      (function (lang) {
        els.langResults.appendChild(resultRow(lang.native, lang.en, function () {
          state.languages.push(lang.code);
          els.langSearch.value = "";
          searchLanguages("");
          renderLanguages();
          els.langSearch.focus();
        }));
      })(hits[h]);
    }
  }

  /* ---------------------------------------------------------- validation */

  function isEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()); }

  function markField(input, valid) {
    var field = input.closest(".field");
    if (field) field.classList.toggle("has-error", !valid);
    return valid;
  }

  function validate() {
    var ok = true;
    var first = null;

    var required = form.querySelectorAll("input[required], select[required], textarea[required]");
    for (var i = 0; i < required.length; i++) {
      var input = required[i];
      if (input.type === "checkbox") continue;          // declarations handled below
      var valid = input.value.trim().length > 0;
      if (valid && input.type === "email") valid = isEmail(input.value);
      if (valid && input.type === "number") valid = !isNaN(Number(input.value));
      markField(input, valid);
      if (!valid && !first) { first = input; ok = false; }
    }

    /* Licensure and language are the two things the whole match depends on. */
    if (!state.jurisdictions.length && els.country && els.country.value) {
      state.jurisdictions.push(els.country.value);       // sensible default
      renderJurisdictions();
    }
    var jurisdictionField = els.jurisdictions ? els.jurisdictions.closest(".field") : null;
    var jurisdictionsOk = state.jurisdictions.length > 0;
    if (jurisdictionField) jurisdictionField.classList.toggle("has-error", !jurisdictionsOk);
    if (!jurisdictionsOk) ok = false;

    var langField = els.langList ? els.langList.closest(".field") : null;
    var langsOk = state.languages.length > 0;
    if (langField) langField.classList.toggle("has-error", !langsOk);
    if (!langsOk) { ok = false; if (!first) first = els.langSearch; }

    var declarations = ["j-truth", "j-scope", "j-privacy", "j-emergency"];
    var allDeclared = true;
    for (var d = 0; d < declarations.length; d++) {
      var box = document.getElementById(declarations[d]);
      if (box && !box.checked) allDeclared = false;
    }
    var indemnity = document.getElementById("j-indemnity");
    if (indemnity && !indemnity.checked) allDeclared = false;
    if (els.declarationsError) els.declarationsError.style.display = allDeclared ? "none" : "block";
    if (!allDeclared) { ok = false; if (!first) first = indemnity; }

    if (first && first.focus) first.focus();
    return ok;
  }

  /* -------------------------------------------------------------- submit */

  function renderReceived() {
    var name = document.getElementById("j-name").value.trim();
    var country = els.country.value;
    var card = form.closest(".triage-card");
    card.innerHTML = "";

    var header = UI.el("div", "result-header result-header--routine");
    header.innerHTML = '<svg class="result-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ht = UI.el("div");
    ht.style.flex = "1";
    ht.appendChild(UI.el("h2", null, UI.t("join.done.title", "Application received")));
    ht.appendChild(UI.el("p", null, UI.format("join.done.lead", { name: name },
      "Thank you, Dr {name}. Nothing goes live until we have verified your licence.")));
    header.appendChild(ht);
    card.appendChild(header);

    var dl = UI.el("ul", "summary-list");
    function row(key, fb, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(key, fb)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }
    row("join.specialty", "Main specialty", UI.specialtyName(els.specialty.value));
    row("profile.languages", "Consults in", state.languages.map(UI.languageName).join(", "));
    row("profile.licensed", "Licensed in", state.jurisdictions.map(countryName).join(", "));
    if (state.focus.length) row("profile.focus", "Areas of expertise", state.focus.map(UI.symptomName).join(", "));
    row("join.country", "Practises in", countryName(country));
    card.appendChild(dl);

    var next = UI.el("div", "callout callout--info");
    next.style.marginTop = "1.5rem";
    var nb = UI.el("div");
    nb.appendChild(UI.el("p", "callout__title", UI.t("join.done.next.t", "What happens now")));
    nb.appendChild(UI.el("p", null, UI.t("join.done.next.d",
      "We verify your licence with the issuing authority and check your indemnity cover, then a clinician reviews your profile. That usually takes three to five working days.")));
    next.appendChild(nb);
    card.appendChild(next);

    var demo = UI.el("p", "card__meta");
    demo.style.marginTop = "1.25rem";
    demo.textContent = UI.t("join.done.demo",
      "This is a demonstration build: your application has not been sent anywhere and no account was created.");
    card.appendChild(demo);

    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------------------------------------------- wire */

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) {
      if (els.status) els.status.textContent = UI.t("join.status.invalid", "Please check the highlighted fields.");
      return;
    }
    renderReceived();
  });

  form.addEventListener("input", function (event) {
    var field = event.target.closest && event.target.closest(".field");
    if (field && event.target.type !== "checkbox") field.classList.remove("has-error");
  });

  if (els.focusSearch) {
    els.focusSearch.addEventListener("input", function () { searchFocus(els.focusSearch.value); });
    els.focusSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var first = els.focusResults.querySelector("button");
        if (first) first.click();
      }
    });
  }
  if (els.langSearch) {
    els.langSearch.addEventListener("input", function () { searchLanguages(els.langSearch.value); });
    els.langSearch.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var first = els.langResults.querySelector("button");
        if (first) first.click();
      }
    });
  }
  if (els.country) {
    els.country.addEventListener("change", function () {
      /* Practising country is licensed by definition — preselect it. */
      if (els.country.value && state.jurisdictions.indexOf(els.country.value) === -1) {
        state.jurisdictions.push(els.country.value);
      }
      renderJurisdictions();
    });
  }
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".symptom-search")) {
      if (els.focusResults) els.focusResults.innerHTML = "";
      if (els.langResults) els.langResults.innerHTML = "";
    }
  });

  function renderAll() {
    fillCountries();
    fillSpecialties();
    renderJurisdictions();
    renderFocus();
    renderLanguages();
  }

  renderAll();
  UI.onLanguageChange(renderAll);
})(window, document);
