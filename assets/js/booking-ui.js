/* ==========================================================================
   Naviar Care — availability board and booking flow (booking.html)
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
    clear: document.querySelector("[data-clear-filters]"),
    handoff: document.querySelector("[data-triage-handoff]"),
    section: document.querySelector("[data-booking-section]"),
    booking: document.querySelector("[data-booking-root]")
  };

  var state = {
    specialty: "",
    language: "",
    languageLocked: null,
    when: "any",
    urgency: null,
    handoff: null,
    selected: null
  };

  /* --------------------------------------------------------------- query */

  function queryParam(name) {
    var match = new RegExp("[?&]" + name + "=([^&#]+)").exec(window.location.search);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function readHandoff() {
    var spec = queryParam("specialty");
    if (spec && Data.specialtyById(spec)) state.specialty = spec;

    /* languages.html deep-links straight into a language. */
    var lang = queryParam("language");
    if (lang && Data.languageByCode(lang)) state.languageLocked = lang;

    state.urgency = queryParam("urgency");

    try {
      var raw = window.sessionStorage.getItem("naviar.triage");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.matches) {
          state.handoff = parsed;
          if (!state.urgency) state.urgency = parsed.urgency;
        }
      }
    } catch (e) { /* no session storage, carry on with the query string */ }
  }

  /* -------------------------------------------------------------- filters */

  function fillSpecialties() {
    var select = els.specialty;
    select.innerHTML = "";

    var any = document.createElement("option");
    any.value = "";
    any.textContent = UI.t("booking.filter.any-specialty", "Any specialty");
    select.appendChild(any);

    var sorted = Data.specialties.slice().sort(function (a, b) {
      return UI.specialtyName(a.id).localeCompare(UI.specialtyName(b.id), UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      var opt = document.createElement("option");
      opt.value = sorted[i].id;
      opt.textContent = UI.specialtyName(sorted[i].id);
      select.appendChild(opt);
    }
    select.value = state.specialty;
  }

  function fillLanguages() {
    var select = els.language;
    select.innerHTML = "";

    var any = document.createElement("option");
    any.value = "";
    any.textContent = UI.t("booking.filter.any-language", "Any language");
    select.appendChild(any);

    var spoken = Booking.availableLanguages();

    var native = document.createElement("optgroup");
    native.label = UI.t("booking.group.native", "Doctors speak it directly");
    var interp = document.createElement("optgroup");
    interp.label = UI.t("booking.group.interpreter", "With a medical interpreter");

    var sorted = Data.serviceLanguages.slice().sort(function (a, b) {
      return a.native.localeCompare(b.native, UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      var lang = sorted[i];
      var opt = document.createElement("option");
      opt.value = lang.code;
      opt.textContent = lang.native;
      (spoken[lang.code] ? native : interp).appendChild(opt);
    }

    if (native.children.length) select.appendChild(native);
    if (interp.children.length) select.appendChild(interp);
    select.value = state.language;
  }

  /* ------------------------------------------------------------ handoff */

  function renderHandoff() {
    if (!els.handoff) return;

    if (!state.specialty && !state.urgency) {
      els.handoff.hidden = true;
      return;
    }

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
      var text = state.specialty
        ? UI.format("booking.handoff.d", { spec: UI.specialtyName(state.specialty) },
            "We have filtered this list to {spec}, based on what you described.")
        : UI.t("booking.handoff.generic", "We have carried over how urgently you said you needed to be seen.");
      body.appendChild(UI.el("p", null, text));
    }

    box.appendChild(body);
    els.handoff.appendChild(box);
  }

  /* -------------------------------------------------------- doctor cards */

  function statusTag(status) {
    if (status === "now")  return { cls: "tag--routine",  key: "booking.status.now",  fallback: "Available now" };
    if (status === "soon") return { cls: "tag--urgent",   key: "booking.status.soon", fallback: "Free shortly" };
    return { cls: "", key: "booking.status.later", fallback: "Later today" };
  }

  function doctorCard(match) {
    var doc = match.doctor;
    var card = UI.el("article", "card card--hover spec-card");

    /* header */
    var head = UI.el("div", "spec-card__head");
    var initials = doc.name.split(" ").map(function (p) { return p.charAt(0); }).slice(0, 2).join("");
    head.appendChild(UI.el("div", "spec-card__avatar", initials));

    var title = UI.el("div");
    title.appendChild(UI.el("h3", null, UI.format("booking.doctor.name", { name: doc.name }, "Dr {name}")));
    title.appendChild(UI.el("p", "card__meta", UI.specialtyName(doc.spec)));
    head.appendChild(title);
    card.appendChild(head);

    /* status + language */
    var tags = UI.el("div");
    tags.style.cssText = "display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.9rem";

    var st = statusTag(match.status);
    var statusEl = UI.el("span", "tag " + st.cls, UI.t(st.key, st.fallback));
    tags.appendChild(statusEl);

    if (match.language.interpreter) {
      tags.appendChild(UI.el("span", "tag", UI.t("booking.tag.interpreter", "Interpreter joins")));
    } else if (state.language) {
      tags.appendChild(UI.el("span", "tag tag--brand", UI.t("booking.tag.native", "Speaks your language")));
    }
    card.appendChild(tags);

    /* body */
    var body = UI.el("div", "spec-card__body");

    var slot = Booking.nextFreeAt(doc, new Date());
    var when = UI.el("p", "card__meta");
    when.innerHTML = "";
    when.appendChild(document.createTextNode(
      UI.format("booking.next-slot", { time: UI.clockTime(slot), wait: UI.waitLabel(match.waitMinutes) },
        "Next slot {time} ({wait})")
    ));
    body.appendChild(when);

    var langNames = [];
    for (var i = 0; i < doc.langs.length; i++) langNames.push(UI.languageName(doc.langs[i]));
    var langs = UI.el("p", "card__meta",
      UI.format("booking.speaks", { langs: langNames.join(", ") }, "Speaks: {langs}"));
    body.appendChild(langs);

    var creds = UI.el("p", "card__meta", UI.format("booking.credentials",
      { years: doc.years, rating: doc.rating.toFixed(1), reviews: doc.reviews },
      "{years} years in practice · {rating}★ from {reviews} patients"));
    body.appendChild(creds);

    card.appendChild(body);

    /* action */
    var action = UI.el("div");
    action.style.marginTop = "1.1rem";
    var book = UI.el("button", "btn btn--primary btn--block", UI.t("cta.book", "Book this doctor"));
    book.type = "button";
    book.addEventListener("click", function () { openBooking(match); });
    action.appendChild(book);
    card.appendChild(action);

    return card;
  }

  /* ----------------------------------------------------------- rendering */

  function currentMatches() {
    var criteria = {
      specialty: state.specialty || null,
      language: state.language || null,
      urgency: state.urgency,
      availableOnly: state.when === "now"
    };
    var results = Booking.match(criteria);

    if (state.when === "soon") {
      results = results.filter(function (m) { return m.status === "now" || m.status === "soon"; });
    }
    return results;
  }

  function render() {
    var matches = currentMatches();

    els.list.innerHTML = "";
    for (var i = 0; i < matches.length; i++) els.list.appendChild(doctorCard(matches[i]));

    if (els.empty) els.empty.hidden = matches.length > 0;

    if (els.count) {
      var free = matches.filter(function (m) { return m.status === "now"; }).length;
      els.count.textContent = UI.format("booking.count", { total: matches.length, now: free },
        "{total} doctors match — {now} available right now");
    }
  }

  /* ------------------------------------------------------- booking form */

  function openBooking(match) {
    state.selected = match;
    els.section.hidden = false;
    renderBookingForm();
    els.section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderBookingForm() {
    var match = state.selected;
    if (!match) return;
    var doc = match.doctor;
    var slot = Booking.nextFreeAt(doc, new Date());
    var root = els.booking;
    root.innerHTML = "";

    root.appendChild(UI.el("h2", null, UI.t("booking.form.title", "Confirm your consultation")));

    var intro = UI.el("p", "card__meta", UI.format("booking.form.intro",
      { name: doc.name, spec: UI.specialtyName(doc.spec), time: UI.clockTime(slot) },
      "With Dr {name}, {spec}, at {time}."));
    root.appendChild(intro);

    if (match.language.interpreter) {
      var note = UI.el("div", "callout callout--info");
      note.style.margin = "1.25rem 0";
      var noteBody = UI.el("div");
      noteBody.appendChild(UI.el("p", "callout__title", UI.t("booking.form.interpreter.t", "An interpreter will join your call")));
      noteBody.appendChild(UI.el("p", null, UI.format("booking.form.interpreter.d",
        { name: doc.name, lang: UI.languageName(state.language) },
        "Dr {name} does not speak {lang}, so a medical interpreter joins the consultation. There is no extra charge and no extra wait.")));
      note.appendChild(noteBody);
      root.appendChild(note);
    }

    var form = document.createElement("form");
    form.noValidate = true;

    form.innerHTML =
      '<div class="grid grid--2" style="gap:1rem">' +
        '<div class="field"><label for="bk-name">' + UI.escapeHTML(UI.t("booking.form.name", "Patient name")) + '</label>' +
          '<input class="input" id="bk-name" name="name" type="text" required>' +
          '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.name", "Please enter the patient's name.")) + '</p></div>' +
        '<div class="field"><label for="bk-contact">' + UI.escapeHTML(UI.t("booking.form.contact", "Email or phone")) + '</label>' +
          '<input class="input" id="bk-contact" name="contact" type="text" required>' +
          '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.contact", "We need a way to send you the consultation link.")) + '</p></div>' +
      '</div>' +
      '<div class="field"><label for="bk-reason">' + UI.escapeHTML(UI.t("booking.form.reason", "What would you like to discuss?")) + '</label>' +
        '<span class="field__hint">' + UI.escapeHTML(UI.t("booking.form.reason.hint", "Write in your own language — the doctor will see it in yours.")) + '</span>' +
        '<textarea class="textarea" id="bk-reason" name="reason" required></textarea>' +
        '<p class="field__error">' + UI.escapeHTML(UI.t("booking.form.err.reason", "Please describe briefly what you need help with.")) + '</p></div>';

    /* Pre-fill from the symptom check so nobody types their story twice. */
    var reasonField = form.querySelector("#bk-reason");
    if (state.handoff && state.handoff.symptoms && state.handoff.symptoms.length) {
      var names = state.handoff.symptoms.map(function (id) { return UI.symptomName(id); });
      reasonField.value = UI.format("booking.form.prefill", { list: names.join(", ") }, "From my symptom check: {list}");
    }

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";

    var submit = UI.el("button", "btn btn--primary btn--lg", UI.t("booking.form.confirm", "Confirm booking"));
    submit.type = "submit";
    actions.appendChild(submit);

    var cancel = UI.el("button", "btn btn--ghost", UI.t("cta.cancel", "Cancel"));
    cancel.type = "button";
    cancel.addEventListener("click", function () {
      els.section.hidden = true;
      state.selected = null;
    });
    actions.appendChild(cancel);
    form.appendChild(actions);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate(form)) return;
      confirmBooking(form, match, slot);
    });

    root.appendChild(form);
  }

  function validate(form) {
    var ok = true;
    var required = form.querySelectorAll("[required]");
    for (var i = 0; i < required.length; i++) {
      var field = required[i].closest(".field");
      var valid = required[i].value.trim().length > 0;
      if (field) field.classList.toggle("has-error", !valid);
      if (!valid && ok) { required[i].focus(); ok = false; }
    }
    return ok;
  }

  function confirmBooking(form, match, slot) {
    var doc = match.doctor;
    var name = form.querySelector("#bk-name").value.trim();
    var reference = Booking.reference(doc.id, new Date());

    var root = els.booking;
    root.innerHTML = "";

    var header = UI.el("div", "result-header result-header--routine");
    header.innerHTML = '<svg class="result-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var headText = UI.el("div");
    headText.style.flex = "1";
    headText.appendChild(UI.el("h3", null, UI.t("booking.done.title", "Your consultation is booked")));
    headText.appendChild(UI.el("p", null, UI.format("booking.done.lead", { name: name }, "We have sent the joining link to you, {name}.")));
    header.appendChild(headText);
    root.appendChild(header);

    var dl = UI.el("ul", "summary-list");
    function row(labelKey, fallback, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(labelKey, fallback)));
      li.appendChild(UI.el("span", null, value));
      dl.appendChild(li);
    }
    row("booking.done.ref", "Reference", reference);
    row("booking.done.with", "Doctor", UI.format("booking.doctor.name", { name: doc.name }, "Dr {name}") + " — " + UI.specialtyName(doc.spec));
    row("booking.done.time", "Time", UI.clockTime(slot));
    row("booking.done.language", "Consultation language",
      state.language ? UI.languageName(state.language) : UI.t("booking.done.any-language", "Your chosen language"));
    if (match.language.interpreter) {
      row("booking.done.interpreter", "Interpreter", UI.t("booking.done.interpreter-yes", "A medical interpreter will join"));
    }
    root.appendChild(dl);

    var demo = UI.el("div", "callout callout--info");
    demo.style.marginTop = "1.5rem";
    var demoBody = UI.el("div");
    demoBody.appendChild(UI.el("p", "callout__title", UI.t("booking.done.demo.t", "This is a demonstration")));
    demoBody.appendChild(UI.el("p", null, UI.t("booking.done.demo.d", "No real appointment has been made and nothing was sent anywhere. Connect this form to your scheduling system to make it live.")));
    demo.appendChild(demoBody);
    root.appendChild(demo);

    var again = UI.el("button", "btn btn--ghost", UI.t("cta.book-another", "Book another consultation"));
    again.type = "button";
    again.style.marginTop = "1.5rem";
    again.addEventListener("click", function () {
      els.section.hidden = true;
      state.selected = null;
      els.list.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    root.appendChild(again);
  }

  /* ----------------------------------------------------------------- init */

  function wire() {
    els.specialty.addEventListener("change", function () {
      state.specialty = els.specialty.value;
      renderHandoff();
      render();
    });
    els.language.addEventListener("change", function () {
      state.language = els.language.value;
      state.languageLocked = els.language.value || null;
      render();
    });
    els.when.addEventListener("change", function () {
      state.when = els.when.value;
      render();
    });
    els.clear.addEventListener("click", function () {
      state.specialty = "";
      state.language = "";
      state.languageLocked = null;
      state.when = "any";
      state.urgency = null;
      els.specialty.value = "";
      els.language.value = "";
      els.when.value = "any";
      renderHandoff();
      render();
    });
  }

  function defaultLanguageFromUI() {
    /* Start with the language the visitor is already reading the site in. */
    var code = UI.locale();
    return Data.languageByCode(code) ? code : "";
  }

  readHandoff();
  state.language = state.languageLocked || defaultLanguageFromUI();
  fillSpecialties();
  fillLanguages();
  wire();
  renderHandoff();
  render();

  UI.onLanguageChange(function () {
    var previous = state.language;
    fillSpecialties();
    fillLanguages();
    /* Follow the site language, unless the visitor arrived on a deep link to a
       specific language or has since chosen one by hand. */
    if (!state.languageLocked && previous === defaultLanguageFromUI()) {
      state.language = defaultLanguageFromUI();
    }
    els.language.value = state.language;
    renderHandoff();
    render();
    if (state.selected) renderBookingForm();
  });
})(window, document);
