/* ==========================================================================
   Naviar Care — doctor directory and booking flow (booking.html)
   Directory is grouped by area of medicine; each clinician shows their
   country, sub-specialty interests, languages and what kind of session they
   can hold for this particular patient.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var list = document.querySelector("[data-doctor-list]");
  if (!list) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;
  var Booking = window.NaviarBooking;

  var els = {
    list: list,
    empty: document.querySelector("[data-empty-state]"),
    count: document.querySelector("[data-result-count]"),
    specialty: document.querySelector("[data-filter-specialty]"),
    language: document.querySelector("[data-filter-language]"),
    when: document.querySelector("[data-filter-when]"),
    country: document.querySelector("[data-filter-country]"),
    patientCountry: document.querySelector("[data-patient-country]"),
    clear: document.querySelector("[data-clear-filters]"),
    handoff: document.querySelector("[data-triage-handoff]"),
    section: document.querySelector("[data-booking-section]"),
    booking: document.querySelector("[data-booking-root]")
  };

  var state = {
    specialty: "", language: "", languageLocked: null,
    when: "any", country: "", patientCountry: "",
    urgency: null, handoff: null, symptoms: [],
    selected: null, step: "profile"
  };

  /* --------------------------------------------------------------- query */

  function queryParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]+)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function readHandoff() {
    var spec = queryParam("specialty");
    if (spec && Data.specialtyById(spec)) state.specialty = spec;

    var lang = queryParam("language");
    if (lang && Data.languageByCode(lang)) state.languageLocked = lang;

    var country = queryParam("country");
    if (country && Data.countryByCode(country)) state.country = country;

    state.urgency = queryParam("urgency");

    try {
      var raw = window.sessionStorage.getItem("naviar.triage");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.matches) {
          state.handoff = parsed;
          state.symptoms = parsed.symptoms || [];
          if (!state.urgency) state.urgency = parsed.urgency;
          if (parsed.country) state.patientCountry = parsed.country;
        }
      }
      var saved = window.localStorage.getItem("naviar.country");
      if (!state.patientCountry && saved && Data.countryByCode(saved)) state.patientCountry = saved;
    } catch (e) { /* storage unavailable */ }
  }

  function rememberCountry() {
    try { window.localStorage.setItem("naviar.country", state.patientCountry); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------- filters */

  function option(value, label) {
    var o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  }

  function countryName(code) {
    var entry = Data.countryByCode(code);
    return entry ? UI.t("country." + code, entry.en) : code;
  }

  function fillSpecialties() {
    var sel = els.specialty;
    sel.innerHTML = "";
    sel.appendChild(option("", UI.t("booking.filter.any-specialty", "Any specialty")));

    /* Grouped by area of medicine, matching how the directory reads below. */
    var groups = [];
    for (var i = 0; i < Data.specialties.length; i++) {
      if (groups.indexOf(Data.specialties[i].group) === -1) groups.push(Data.specialties[i].group);
    }
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
      sel.appendChild(optgroup);
    }
    sel.value = state.specialty;
  }

  function fillLanguages() {
    var sel = els.language;
    sel.innerHTML = "";
    sel.appendChild(option("", UI.t("booking.filter.any-language", "Any language")));

    var spoken = Booking.availableLanguages();
    var native = document.createElement("optgroup");
    native.label = UI.t("booking.group.native", "Doctors speak it directly");
    var interp = document.createElement("optgroup");
    interp.label = UI.t("booking.group.interpreter", "With a medical interpreter");

    var sorted = Data.serviceLanguages.slice().sort(function (a, b) {
      return a.native.localeCompare(b.native, UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      (spoken[sorted[i].code] ? native : interp).appendChild(option(sorted[i].code, sorted[i].native));
    }
    if (native.children.length) sel.appendChild(native);
    if (interp.children.length) sel.appendChild(interp);
    sel.value = state.language;
  }

  function fillCountries() {
    if (els.country) {
      var counts = Booking.doctorCountries();
      els.country.innerHTML = "";
      els.country.appendChild(option("", UI.t("booking.filter.any-country", "Anywhere in the world")));
      var codes = Object.keys(counts).sort(function (a, b) {
        return countryName(a).localeCompare(countryName(b), UI.locale());
      });
      for (var i = 0; i < codes.length; i++) {
        els.country.appendChild(option(codes[i], countryName(codes[i]) + " (" + counts[codes[i]] + ")"));
      }
      els.country.value = state.country;
    }

    if (els.patientCountry) {
      els.patientCountry.innerHTML = "";
      els.patientCountry.appendChild(option("", UI.t("booking.patient-country.none", "Select your country…")));
      var all = Data.countries.slice().sort(function (a, b) {
        return countryName(a.code).localeCompare(countryName(b.code), UI.locale());
      });
      for (var c = 0; c < all.length; c++) {
        els.patientCountry.appendChild(option(all[c].code, countryName(all[c].code)));
      }
      els.patientCountry.value = state.patientCountry;
    }
  }

  /* ------------------------------------------------------------ handoff */

  function renderHandoff() {
    if (!els.handoff) return;
    if (!state.specialty && !state.urgency) { els.handoff.hidden = true; return; }

    els.handoff.hidden = false;
    els.handoff.innerHTML = "";

    var level = state.urgency === "emergency" ? "danger" : (state.urgency === "urgent" ? "warn" : "info");
    var box = UI.el("div", "callout callout--" + level);
    var body = UI.el("div");

    if (state.urgency === "emergency") {
      body.appendChild(UI.el("p", "callout__title", UI.t("triage.result.emergency.t", "Contact emergency services now")));
      body.appendChild(UI.el("p", null, UI.t("booking.handoff.emergency", "Your answers suggested this cannot wait for an online consultation. Please contact emergency services before booking.")));
    } else {
      body.appendChild(UI.el("p", "callout__title", UI.t("booking.handoff.t", "Carried over from your symptom check")));
      body.appendChild(UI.el("p", null, state.specialty
        ? UI.format("booking.handoff.d", { spec: UI.specialtyName(state.specialty) },
            "We have filtered this list to {spec}, based on what you described.")
        : UI.t("booking.handoff.generic", "We have carried over how urgently you said you needed to be seen.")));
    }
    box.appendChild(body);
    els.handoff.appendChild(box);
  }

  /* -------------------------------------------------------- doctor cards */

  function statusTag(status) {
    if (status === "now")  return { cls: "tag--routine", key: "booking.status.now",  fb: "Available now" };
    if (status === "soon") return { cls: "tag--urgent",  key: "booking.status.soon", fb: "Free shortly" };
    return { cls: "", key: "booking.status.later", fb: "Later today" };
  }

  function initialsOf(name) {
    return name.split(" ").map(function (p) { return p.charAt(0); }).slice(0, 2).join("");
  }

  function modeTag(match) {
    if (match.mode === "consultation") {
      return UI.el("span", "tag tag--routine", UI.t("mode.consultation.tag", "Full consultation"));
    }
    if (match.mode === "second-opinion") {
      return UI.el("span", "tag tag--urgent", UI.t("mode.second-opinion.tag", "Second opinion"));
    }
    return UI.el("span", "tag", UI.t("mode.unknown.tag", "Set your country"));
  }

  function doctorCard(match) {
    var doc = match.doctor;
    var card = UI.el("article", "card card--hover spec-card");

    var head = UI.el("div", "spec-card__head");
    head.appendChild(UI.el("div", "spec-card__avatar", initialsOf(doc.name)));
    var title = UI.el("div");
    title.appendChild(UI.el("h3", null, UI.format("booking.doctor.name", { name: doc.name }, "Dr {name}")));
    var sub = UI.el("p", "card__meta");
    sub.textContent = UI.specialtyName(doc.spec) + " · " + countryName(doc.country);
    title.appendChild(sub);
    head.appendChild(title);
    card.appendChild(head);

    var tags = UI.el("div");
    tags.style.cssText = "display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.9rem";
    var st = statusTag(match.status);
    tags.appendChild(UI.el("span", "tag " + st.cls, UI.t(st.key, st.fb)));
    tags.appendChild(modeTag(match));
    if (match.language.interpreter) {
      tags.appendChild(UI.el("span", "tag", UI.t("booking.tag.interpreter", "Interpreter joins")));
    } else if (state.language) {
      tags.appendChild(UI.el("span", "tag tag--brand", UI.t("booking.tag.native", "Speaks your language")));
    }
    card.appendChild(tags);

    var body = UI.el("div", "spec-card__body");

    /* Sub-specialty interests — what they actually spend their time on. */
    if (doc.focus && doc.focus.length) {
      var focusLine = UI.el("p", "card__meta");
      var names = doc.focus.map(function (id) { return UI.symptomName(id); });
      focusLine.textContent = UI.format("booking.focus", { list: names.join(", ") }, "Focus: {list}");
      body.appendChild(focusLine);
    }
    if (match.focusHits && match.focusHits.length) {
      var hit = UI.el("p", "tag tag--brand");
      hit.style.marginBottom = ".5rem";
      hit.textContent = UI.format("booking.focus-match", { n: match.focusHits.length },
        "Treats {n} of the symptoms you described");
      body.appendChild(hit);
    }

    var slot = Booking.nextFreeAt(doc, new Date());
    body.appendChild(UI.el("p", "card__meta", UI.format("booking.next-slot",
      { time: UI.clockTime(slot), wait: UI.waitLabel(match.waitMinutes) }, "Next slot {time} ({wait})")));

    var langNames = doc.langs.map(function (c) { return UI.languageName(c); });
    body.appendChild(UI.el("p", "card__meta", UI.format("booking.speaks", { langs: langNames.join(", ") }, "Speaks: {langs}")));

    var q = Booking.quote(doc, { patientCountry: state.patientCountry, interpreter: match.language.interpreter });
    var price = UI.el("p", "card__meta");
    price.style.fontWeight = "600";
    price.textContent = UI.format("booking.from-price", { total: Booking.formatMoney(q.total, q) }, "{total} total");
    body.appendChild(price);

    card.appendChild(body);

    var action = UI.el("div");
    action.style.cssText = "margin-top:1.1rem;display:flex;gap:.5rem;flex-wrap:wrap";

    var view = UI.el("button", "btn btn--ghost btn--sm", UI.t("cta.view-profile", "View profile"));
    view.type = "button";
    view.addEventListener("click", function () { openBooking(match, "profile"); });
    action.appendChild(view);

    var book = UI.el("button", "btn btn--primary btn--sm", UI.t("cta.book", "Book"));
    book.type = "button";
    book.style.flex = "1";
    book.addEventListener("click", function () { openBooking(match, "form"); });
    action.appendChild(book);

    card.appendChild(action);
    return card;
  }

  /* ----------------------------------------------------------- rendering */

  function currentMatches() {
    var results = Booking.match({
      specialty: state.specialty || null,
      language: state.language || null,
      country: state.country || null,
      patientCountry: state.patientCountry || null,
      symptoms: state.symptoms,
      urgency: state.urgency,
      availableOnly: state.when === "now"
    });
    if (state.when === "soon") {
      results = results.filter(function (m) { return m.status === "now" || m.status === "soon"; });
    }
    return results;
  }

  function render() {
    var matches = currentMatches();
    els.list.innerHTML = "";

    var groups = Booking.groupByCategory(matches);
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];

      var heading = UI.el("div");
      heading.style.cssText = "grid-column:1/-1;margin:.5rem 0 -.25rem";
      var h = UI.el("h2", null, UI.t("category." + group.category, group.category));
      h.style.cssText = "font-size:1.15rem;margin-bottom:.15rem";
      heading.appendChild(h);
      var meta = UI.el("p", "card__meta");
      meta.style.margin = "0";
      meta.textContent = UI.format("booking.category.count", { n: group.matches.length }, "{n} doctors");
      heading.appendChild(meta);
      els.list.appendChild(heading);

      for (var i = 0; i < group.matches.length; i++) {
        els.list.appendChild(doctorCard(group.matches[i]));
      }
    }

    if (els.empty) els.empty.hidden = matches.length > 0;
    if (els.count) {
      var free = matches.filter(function (m) { return m.status === "now"; }).length;
      els.count.textContent = UI.format("booking.count", { total: matches.length, now: free },
        "{total} doctors match — {now} available right now");
    }
  }

  /* --------------------------------------------------- profile & booking */

  function openBooking(match, step) {
    state.selected = match;
    state.step = step || "profile";
    els.section.hidden = false;
    renderPanel();
    els.section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closePanel() {
    els.section.hidden = true;
    state.selected = null;
  }

  function renderPanel() {
    if (!state.selected) return;
    if (state.step === "profile") renderProfile();
    else if (state.step === "form") renderBookingForm();
    else if (state.step === "payment") renderPayment();
  }

  function modeNotice(match) {
    var box = UI.el("div", "callout callout--" + (match.mode === "consultation" ? "info" : "warn"));
    box.style.margin = "1.25rem 0";
    var body = UI.el("div");

    if (match.mode === "consultation") {
      body.appendChild(UI.el("p", "callout__title", UI.t("mode.consultation.t", "This is a full consultation")));
      body.appendChild(UI.el("p", null, UI.format("mode.consultation.d",
        { country: countryName(state.patientCountry) },
        "This doctor is licensed in {country}, so they can assess you, diagnose, and prescribe where local law allows.")));
    } else if (match.mode === "second-opinion") {
      body.appendChild(UI.el("p", "callout__title", UI.t("mode.second-opinion.t", "This is a second-opinion session")));
      body.appendChild(UI.el("p", null, UI.format("mode.second-opinion.d",
        { name: match.doctor.name, country: countryName(state.patientCountry) },
        "Dr {name} is not licensed in {country}, so they cannot diagnose you or issue a prescription there. They can review your case, give you a specialist opinion, explain your results, and help you prepare for your own doctor.")));
    } else {
      body.appendChild(UI.el("p", "callout__title", UI.t("mode.unknown.t", "Tell us where you are")));
      body.appendChild(UI.el("p", null, UI.t("mode.unknown.d", "Set your country above and we will tell you exactly what this doctor can do for you before you pay.")));
    }
    box.appendChild(body);
    return box;
  }

  function renderProfile() {
    var match = state.selected;
    var doc = match.doctor;
    var root = els.booking;
    root.innerHTML = "";

    var head = UI.el("div", "spec-card__head");
    head.style.marginBottom = "1rem";
    var avatar = UI.el("div", "spec-card__avatar", initialsOf(doc.name));
    avatar.style.cssText += "width:64px;height:64px;font-size:1.3rem";
    head.appendChild(avatar);
    var title = UI.el("div");
    title.appendChild(UI.el("h2", null, UI.format("booking.doctor.name", { name: doc.name }, "Dr {name}")));
    title.appendChild(UI.el("p", "card__meta", UI.specialtyName(doc.spec) + " · " + countryName(doc.country)));
    head.appendChild(title);
    root.appendChild(head);

    /* Self-written introduction. Clinicians write this themselves, in their
       own words — so it is shown as authored rather than machine-translated. */
    if (doc.intro) {
      var intro = UI.el("p", null, doc.intro);
      intro.setAttribute("lang", "en");
      root.appendChild(intro);
    }

    root.appendChild(modeNotice(match));

    var dl = UI.el("ul", "summary-list");
    function row(key, fb, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(key, fb)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }
    row("profile.specialty", "Specialty", UI.specialtyName(doc.spec));
    if (doc.also && doc.also.length) {
      row("profile.also", "Also consults on", doc.also.map(function (s) { return UI.specialtyName(s); }).join(", "));
    }
    if (doc.focus && doc.focus.length) {
      row("profile.focus", "Areas of expertise", doc.focus.map(function (s) { return UI.symptomName(s); }).join(", "));
    }
    row("profile.languages", "Consults in", doc.langs.map(function (c) { return UI.languageName(c); }).join(", "));
    row("profile.country", "Based in", countryName(doc.country));
    row("profile.licensed", "Licensed in", (doc.licensed || []).map(countryName).join(", "));
    row("profile.experience", "Experience", UI.format("profile.years", { n: doc.years }, "{n} years in practice"));
    row("profile.rating", "Patient rating", UI.format("profile.rating.value",
      { rating: doc.rating.toFixed(1), reviews: doc.reviews }, "{rating} out of 5, from {reviews} completed consultations"));
    root.appendChild(dl);

    var note = UI.el("p", "card__meta");
    note.style.marginTop = ".75rem";
    note.textContent = UI.t("profile.rating.note",
      "Ratings come only from patients who completed a consultation with this doctor, and are shown as a simple mean.");
    root.appendChild(note);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";
    var book = UI.el("button", "btn btn--primary btn--lg", UI.t("cta.book-with", "Book with this doctor"));
    book.type = "button";
    book.addEventListener("click", function () { state.step = "form"; renderPanel(); });
    actions.appendChild(book);
    var back = UI.el("button", "btn btn--ghost", UI.t("cta.back-to-list", "Back to the list"));
    back.type = "button";
    back.addEventListener("click", closePanel);
    actions.appendChild(back);
    root.appendChild(actions);
  }

  function renderBookingForm() {
    var match = state.selected;
    var doc = match.doctor;
    var slot = Booking.nextFreeAt(doc, new Date());
    var root = els.booking;
    root.innerHTML = "";

    root.appendChild(UI.el("h2", null, UI.t("booking.form.title", "Confirm your consultation")));
    root.appendChild(UI.el("p", "card__meta", UI.format("booking.form.intro",
      { name: doc.name, spec: UI.specialtyName(doc.spec), time: UI.clockTime(slot) },
      "With Dr {name}, {spec}, at {time}.")));

    root.appendChild(modeNotice(match));

    if (match.language.interpreter) {
      var note = UI.el("div", "callout callout--info");
      note.style.margin = "1.25rem 0";
      var nb = UI.el("div");
      nb.appendChild(UI.el("p", "callout__title", UI.t("booking.form.interpreter.t", "An interpreter will join your call")));
      nb.appendChild(UI.el("p", null, UI.format("booking.form.interpreter.d",
        { name: doc.name, lang: UI.languageName(state.language) },
        "Dr {name} does not speak {lang}, so a medical interpreter joins the consultation.")));
      nb.appendChild(UI.el("p", null, UI.t("booking.form.interpreter.disclosure",
        "You are being told this in advance because a third person will be present for your consultation. You can ask for a different doctor at any point.")));
      note.appendChild(nb);
      root.appendChild(note);
    }

    var form = document.createElement("form");
    form.noValidate = true;
    form.innerHTML =
      '<div class="grid grid--2" style="gap:1rem">' +
        '<div class="field"><label for="bk-name">' + UI.escapeHTML(UI.t("booking.form.name", "Patient name")) + '</label>' +
          '<input class="input" id="bk-name" name="name" type="text" required autocomplete="name">' +
          '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.name", "Please enter the patient's name.")) + '</p></div>' +
        '<div class="field"><label for="bk-contact">' + UI.escapeHTML(UI.t("booking.form.contact", "Email or phone")) + '</label>' +
          '<input class="input" id="bk-contact" name="contact" type="text" required>' +
          '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.contact", "We need a way to send you the consultation link.")) + '</p></div>' +
      '</div>' +
      '<div class="field"><label for="bk-reason">' + UI.escapeHTML(UI.t("booking.form.reason", "What would you like to discuss?")) + '</label>' +
        '<span class="field__hint">' + UI.escapeHTML(UI.t("booking.form.reason.hint", "Write in your own language — the doctor will see it in yours.")) + '</span>' +
        '<textarea class="textarea" id="bk-reason" name="reason" required></textarea>' +
        '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.reason", "Please describe briefly what you need help with.")) + '</p></div>';

    var reason = form.querySelector("#bk-reason");
    if (state.handoff && state.symptoms.length) {
      reason.value = UI.format("booking.form.prefill",
        { list: state.symptoms.map(function (id) { return UI.symptomName(id); }).join(", ") },
        "From my symptom check: {list}");
    }

    /* ---- consent. Health data is special-category: consent must be an
       explicit, unbundled, affirmative act (COMPLIANCE.md §3). ---------- */
    var consentWrap = UI.el("div", "field");
    consentWrap.appendChild(UI.el("span", "field__label", UI.t("consent.title", "Your consent")));

    var consent = UI.el("label", "checkbox");
    var consentBox = document.createElement("input");
    consentBox.type = "checkbox";
    consentBox.id = "bk-consent";
    consentBox.required = true;
    consent.appendChild(consentBox);
    consent.appendChild(UI.el("span", null, UI.t("consent.health",
      "I agree that Naviar Care and this doctor may process the health information I provide in order to hold this consultation.")));
    consentWrap.appendChild(consent);

    var retention = Data.retentionFor(state.patientCountry, state.handoff ? state.handoff.age : "adult");
    var retentionNote = UI.el("p", "field__hint");
    retentionNote.style.marginTop = ".6rem";
    retentionNote.textContent = UI.format("consent.retention",
      { years: retention.years, country: state.patientCountry ? countryName(state.patientCountry) : UI.t("consent.your-country", "your country") },
      "Your consultation record must be kept for {years} years under the medical records law of {country}. During that period we cannot delete it, even at your request — after it, we will.");
    consentWrap.appendChild(retentionNote);

    var consentError = UI.el("p", "field__error");
    consentError.textContent = UI.t("consent.err", "We cannot hold the consultation without this consent.");
    consentWrap.appendChild(consentError);
    form.appendChild(consentWrap);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";
    var submit = UI.el("button", "btn btn--primary btn--lg", UI.t("booking.form.continue-payment", "Continue to payment"));
    submit.type = "submit";
    actions.appendChild(submit);
    var cancel = UI.el("button", "btn btn--ghost", UI.t("cta.cancel", "Cancel"));
    cancel.type = "button";
    cancel.addEventListener("click", closePanel);
    actions.appendChild(cancel);
    form.appendChild(actions);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = true;
      var required = form.querySelectorAll("input[required], textarea[required]");
      for (var i = 0; i < required.length; i++) {
        var field = required[i].closest(".field");
        var valid = required[i].type === "checkbox" ? required[i].checked : required[i].value.trim().length > 0;
        if (field) field.classList.toggle("has-error", !valid);
        if (!valid && ok) { required[i].focus(); ok = false; }
      }
      if (!ok) return;

      state.booking = {
        name: form.querySelector("#bk-name").value.trim(),
        contact: form.querySelector("#bk-contact").value.trim(),
        reason: reason.value.trim(),
        consentAt: new Date()
      };
      state.step = "payment";
      renderPanel();
    });

    root.appendChild(form);
  }

  /* ---------------------------------------------------------- payment */

  function renderPayment() {
    var match = state.selected;
    var doc = match.doctor;
    var slot = Booking.nextFreeAt(doc, new Date());
    var q = Booking.quote(doc, {
      patientCountry: state.patientCountry,
      interpreter: match.language.interpreter
    });
    var root = els.booking;
    root.innerHTML = "";

    root.appendChild(UI.el("h2", null, UI.t("pay.title", "Payment")));
    root.appendChild(UI.el("p", "card__meta", UI.t("pay.lead",
      "Every line is shown before you pay. There is nothing added afterwards.")));

    var dl = UI.el("ul", "summary-list");
    function line(key, fb, value, strong) {
      var li = document.createElement("li");
      var k = UI.el("span", "k", UI.t(key, fb));
      var v = UI.el("span", null, value);
      if (strong) { k.style.color = "var(--text)"; k.style.fontWeight = "700"; v.style.fontWeight = "700"; }
      li.appendChild(k); li.appendChild(v);
      dl.appendChild(li);
    }
    line("pay.doctor-fee", "Doctor's fee", Booking.formatMoney(q.doctorFee, q));
    line("pay.platform-fee", "Naviar Care platform fee", Booking.formatMoney(q.platformFee, q));
    if (q.interpreterFee > 0) {
      line("pay.interpreter-fee", "Medical interpreter", Booking.formatMoney(q.interpreterFee, q));
    }
    line("pay.total", "Total", Booking.formatMoney(q.total, q), true);
    root.appendChild(dl);

    var model = UI.el("p", "card__meta");
    model.style.marginTop = ".75rem";
    model.textContent = q.model === "flat"
      ? UI.t("pay.note.flat", "The platform fee is a fixed amount for booking, interpretation and support. It is not a share of the doctor's fee.")
      : UI.t("pay.note.percent", "The platform fee is a percentage of the consultation fee, as permitted in your country.");
    root.appendChild(model);

    var form = document.createElement("form");
    form.noValidate = true;
    form.style.marginTop = "1.5rem";

    var methodWrap = UI.el("div", "field");
    methodWrap.appendChild(UI.el("span", "field__label", UI.t("pay.method", "How would you like to pay?")));
    var grid = UI.el("div", "choice-grid");
    var METHODS = [
      ["card", "pay.method.card", "Card"],
      ["wallet", "pay.method.wallet", "Apple Pay / Google Pay"],
      ["transfer", "pay.method.transfer", "Bank transfer"]
    ];
    for (var i = 0; i < METHODS.length; i++) {
      var label = UI.el("label", "choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "method";
      input.value = METHODS[i][0];
      if (i === 0) input.checked = true;
      label.appendChild(input);
      label.appendChild(UI.el("span", null, UI.t(METHODS[i][1], METHODS[i][2])));
      grid.appendChild(label);
    }
    methodWrap.appendChild(grid);
    form.appendChild(methodWrap);

    var demo = UI.el("div", "callout callout--warn");
    demo.style.margin = "1.25rem 0";
    var db = UI.el("div");
    db.appendChild(UI.el("p", "callout__title", UI.t("pay.demo.t", "No payment will be taken")));
    db.appendChild(UI.el("p", null, UI.t("pay.demo.d",
      "This build has no payment processor connected, so no card details are collected and no money moves. Connect a licensed payment provider with marketplace split payments before going live.")));
    demo.appendChild(db);
    form.appendChild(demo);

    var refund = UI.el("p", "card__meta");
    refund.textContent = UI.t("pay.refund",
      "If the doctor does not join, you are refunded in full automatically. You can cancel free of charge up to the start of the consultation.");
    form.appendChild(refund);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";
    var pay = UI.el("button", "btn btn--primary btn--lg",
      UI.format("pay.confirm", { total: Booking.formatMoney(q.total, q) }, "Pay {total} and book"));
    pay.type = "submit";
    actions.appendChild(pay);
    var back = UI.el("button", "btn btn--ghost", UI.t("cta.back", "Back"));
    back.type = "button";
    back.addEventListener("click", function () { state.step = "form"; renderPanel(); });
    actions.appendChild(back);
    form.appendChild(actions);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      confirmBooking(match, slot, q);
    });
    root.appendChild(form);
  }

  /* ------------------------------------------------------- confirmation */

  function confirmBooking(match, slot, q) {
    var doc = match.doctor;
    var reference = Booking.reference(doc.id, new Date());
    var root = els.booking;
    root.innerHTML = "";

    var header = UI.el("div", "result-header result-header--routine");
    header.innerHTML = '<svg class="result-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ht = UI.el("div");
    ht.style.flex = "1";
    ht.appendChild(UI.el("h3", null, UI.t("booking.done.title", "Your consultation is booked")));
    ht.appendChild(UI.el("p", null, UI.format("booking.done.lead",
      { name: state.booking ? state.booking.name : "" }, "We have sent the joining link to you, {name}.")));
    header.appendChild(ht);
    root.appendChild(header);

    var dl = UI.el("ul", "summary-list");
    function row(key, fb, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(key, fb)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }
    row("booking.done.ref", "Reference", reference);
    row("booking.done.with", "Doctor", UI.format("booking.doctor.name", { name: doc.name }, "Dr {name}") + " — " + UI.specialtyName(doc.spec));
    row("booking.done.time", "Time", UI.clockTime(slot));
    row("booking.done.mode", "Session type", UI.t(match.mode === "consultation" ? "mode.consultation.tag" : "mode.second-opinion.tag",
      match.mode === "consultation" ? "Full consultation" : "Second opinion"));
    row("booking.done.language", "Consultation language",
      state.language ? UI.languageName(state.language) : UI.t("booking.done.any-language", "Your chosen language"));
    if (match.language.interpreter) {
      row("booking.done.interpreter", "Interpreter", UI.t("booking.done.interpreter-yes", "A medical interpreter will join"));
    }
    row("pay.total", "Total paid", Booking.formatMoney(q.total, q));
    root.appendChild(dl);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";

    var join = UI.el("a", "btn btn--primary btn--lg", UI.t("cta.join-call", "Open the consultation room"));
    join.href = "consultation.html?ref=" + encodeURIComponent(reference) + "&doctor=" + encodeURIComponent(doc.id);
    actions.appendChild(join);

    var again = UI.el("button", "btn btn--ghost", UI.t("cta.book-another", "Book another consultation"));
    again.type = "button";
    again.addEventListener("click", function () {
      closePanel();
      els.list.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    actions.appendChild(again);
    root.appendChild(actions);

    var demo = UI.el("p", "card__meta");
    demo.style.marginTop = "1.25rem";
    demo.textContent = UI.t("booking.done.demo.d",
      "No real appointment has been made and nothing was sent anywhere. Connect this form to your scheduling system to make it live.");
    root.appendChild(demo);
  }

  /* ----------------------------------------------------------------- init */

  function wire() {
    function on(el, fn) { if (el) el.addEventListener("change", fn); }

    on(els.specialty, function () { state.specialty = els.specialty.value; renderHandoff(); render(); });
    on(els.language, function () {
      state.language = els.language.value;
      state.languageLocked = els.language.value || null;
      render();
    });
    on(els.when, function () { state.when = els.when.value; render(); });
    on(els.country, function () { state.country = els.country.value; render(); });
    on(els.patientCountry, function () {
      state.patientCountry = els.patientCountry.value;
      rememberCountry();
      render();
      if (state.selected) renderPanel();
    });

    if (els.clear) {
      els.clear.addEventListener("click", function () {
        state.specialty = ""; state.language = ""; state.languageLocked = null;
        state.when = "any"; state.country = ""; state.urgency = null;
        if (els.specialty) els.specialty.value = "";
        if (els.language) els.language.value = "";
        if (els.when) els.when.value = "any";
        if (els.country) els.country.value = "";
        renderHandoff();
        render();
      });
    }
  }

  function defaultLanguageFromUI() {
    var code = UI.locale();
    return Data.languageByCode(code) ? code : "";
  }

  readHandoff();
  state.language = state.languageLocked || defaultLanguageFromUI();
  fillSpecialties();
  fillLanguages();
  fillCountries();
  wire();
  renderHandoff();
  render();

  UI.onLanguageChange(function () {
    var previous = state.language;
    fillSpecialties();
    fillLanguages();
    fillCountries();
    if (!state.languageLocked && previous === defaultLanguageFromUI()) {
      state.language = defaultLanguageFromUI();
    }
    if (els.language) els.language.value = state.language;
    renderHandoff();
    render();
    if (state.selected) renderPanel();
  });
})(window, document);
