/* ==========================================================================
   Naviar Care — post-consultation feedback (feedback.html)
   Two forms, because the two sides know different things: the patient knows
   whether they were understood, the doctor knows whether the routing was
   right. The second is how the specialty weighting gets corrected over time.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var host = document.querySelector("[data-feedback-form]");
  if (!host) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;

  var params = {};
  (function () {
    var query = window.location.search.replace(/^\?/, "");
    var parts = query ? query.split("&") : [];
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split("=");
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
  })();

  var doctor = params.doctor ? Data.doctorById(params.doctor) : null;
  var role = params.role === "doctor" ? "doctor" : "patient";

  /* ------------------------------------------------------------ helpers */

  function field(labelKey, labelText, control, hintKey, hintText) {
    var wrap = UI.el("div", "field");
    var label = UI.el("span", "field__label", UI.t(labelKey, labelText));
    wrap.appendChild(label);
    if (hintKey) wrap.appendChild(UI.el("span", "field__hint", UI.t(hintKey, hintText)));
    wrap.appendChild(control);
    return wrap;
  }

  /* A 1–5 scale rendered as radio buttons: accessible, keyboard-operable,
     and it degrades without JavaScript far better than a star widget. */
  function scale(name, lowKey, lowText, highKey, highText) {
    var wrap = UI.el("div");
    var grid = UI.el("div", "choice-grid");
    grid.style.gridTemplateColumns = "repeat(5, minmax(0,1fr))";
    for (var i = 1; i <= 5; i++) {
      var label = UI.el("label", "choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(i);
      input.required = true;
      label.appendChild(input);
      label.appendChild(UI.el("span", null, String(i)));
      grid.appendChild(label);
    }
    wrap.appendChild(grid);

    var ends = UI.el("div");
    ends.style.cssText = "display:flex;justify-content:space-between;font-size:.82rem;color:var(--text-muted);margin-top:.4rem";
    ends.appendChild(UI.el("span", null, UI.t(lowKey, lowText)));
    ends.appendChild(UI.el("span", null, UI.t(highKey, highText)));
    wrap.appendChild(ends);
    return wrap;
  }

  function choices(name, options) {
    var grid = UI.el("div", "choice-grid");
    for (var i = 0; i < options.length; i++) {
      var label = UI.el("label", "choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = options[i][0];
      input.required = true;
      label.appendChild(input);
      label.appendChild(UI.el("span", null, UI.t(options[i][1], options[i][2])));
      grid.appendChild(label);
    }
    return grid;
  }

  function textarea(id, placeholderKey, placeholderText) {
    var ta = document.createElement("textarea");
    ta.className = "textarea";
    ta.id = id;
    ta.placeholder = UI.t(placeholderKey, placeholderText);
    return ta;
  }

  function context() {
    if (!doctor) return null;
    var line = UI.el("p", "card__meta");
    line.textContent = UI.format("feedback.context",
      { name: doctor.name, spec: UI.specialtyName(doctor.spec) },
      "About your consultation with Dr {name}, {spec}.");
    return line;
  }

  /* ------------------------------------------------------------- patient */

  function patientForm() {
    var form = document.createElement("form");
    form.noValidate = true;

    form.appendChild(UI.el("h2", null, UI.t("feedback.patient.title", "Your consultation")));
    var ctx = context();
    if (ctx) form.appendChild(ctx);

    form.appendChild(field("feedback.p.overall", "Overall, how was the consultation?",
      scale("overall", "feedback.scale.poor", "Poor", "feedback.scale.excellent", "Excellent")));

    form.appendChild(field("feedback.p.understood", "Did the doctor understand what you were describing?",
      scale("understood", "feedback.scale.not-at-all", "Not at all", "feedback.scale.completely", "Completely"),
      "feedback.p.understood.hint", "This is the question we care about most. If you were not understood, something in our matching failed."));

    form.appendChild(field("feedback.p.language", "Was the consultation held in your own language?",
      choices("language", [
        ["yes-doctor", "feedback.p.language.doctor", "Yes — the doctor spoke my language"],
        ["yes-interpreter", "feedback.p.language.interpreter", "Yes — through an interpreter"],
        ["partly", "feedback.p.language.partly", "Partly"],
        ["no", "feedback.p.language.no", "No"]
      ])));

    form.appendChild(field("feedback.p.routing", "Were you sent to the right kind of specialist?",
      choices("routing", [
        ["right", "feedback.p.routing.right", "Yes, the right one"],
        ["wrong", "feedback.p.routing.wrong", "No, I needed someone else"],
        ["unsure", "feedback.p.routing.unsure", "I am not sure yet"]
      ])));

    form.appendChild(field("feedback.p.next", "What happens next for you?",
      choices("next", [
        ["resolved", "feedback.p.next.resolved", "It is sorted — I do not need anything more"],
        ["referred", "feedback.p.next.referred", "I was referred on to someone else"],
        ["in-person", "feedback.p.next.person", "I need to be seen in person"],
        ["followup", "feedback.p.next.followup", "I have a follow-up booked"]
      ])));

    form.appendChild(field("feedback.p.comment", "Anything you want to add?",
      textarea("fb-comment", "feedback.p.comment.ph", "Write in any language you like."),
      "feedback.p.comment.hint", "If you are happy for this to appear on the doctor's profile, tick the box below."));

    var publish = UI.el("label", "checkbox");
    var publishBox = document.createElement("input");
    publishBox.type = "checkbox";
    publishBox.id = "fb-publish";
    publish.appendChild(publishBox);
    publish.appendChild(UI.el("span", null, UI.t("feedback.p.publish",
      "You may show my comment on this doctor's profile. My name will not be shown.")));
    form.appendChild(publish);

    var note = UI.el("p", "card__meta");
    note.style.marginTop = "1rem";
    note.textContent = UI.t("feedback.p.note",
      "Your score counts towards this doctor's rating whether or not you publish a comment, and whether it is good or bad. We do not remove low scores.");
    form.appendChild(note);

    return form;
  }

  /* -------------------------------------------------------------- doctor */

  function doctorForm() {
    var form = document.createElement("form");
    form.noValidate = true;

    form.appendChild(UI.el("h2", null, UI.t("feedback.doctor.title", "Clinical outcome")));
    form.appendChild(UI.el("p", "card__meta", UI.t("feedback.doctor.lead",
      "This is not published. It goes to the clinical team, who use it to correct how complaints are routed.")));

    form.appendChild(field("feedback.d.routing", "Was this patient routed to the right specialty?",
      choices("d-routing", [
        ["right", "feedback.d.routing.right", "Yes — this was mine"],
        ["adjacent", "feedback.d.routing.adjacent", "Close, but another specialty suited it better"],
        ["wrong", "feedback.d.routing.wrong", "No — clearly the wrong specialty"],
        ["primary", "feedback.d.routing.primary", "Did not need a specialist at all"]
      ]),
      "feedback.d.routing.hint", "Answering this honestly is what keeps the routing table accurate. A wrong answer here sends the next patient to the wrong place too."));

    form.appendChild(field("feedback.d.specialty", "If it belonged elsewhere, where?",
      specialtySelect()));

    form.appendChild(field("feedback.d.urgency", "Was the urgency we assigned about right?",
      choices("d-urgency", [
        ["right", "feedback.d.urgency.right", "About right"],
        ["over", "feedback.d.urgency.over", "We over-stated it"],
        ["under", "feedback.d.urgency.under", "We under-stated it — this needed attention sooner"]
      ])));

    form.appendChild(field("feedback.d.outcome", "How did the consultation end?",
      choices("d-outcome", [
        ["advice", "feedback.d.outcome.advice", "Advice and reassurance"],
        ["treated", "feedback.d.outcome.treated", "Treated, including a prescription"],
        ["referred", "feedback.d.outcome.referred", "Referred on"],
        ["in-person", "feedback.d.outcome.person", "Needed an in-person examination"],
        ["emergency", "feedback.d.outcome.emergency", "Directed to emergency care"]
      ])));

    form.appendChild(field("feedback.d.language", "Could you and the patient understand each other?",
      scale("d-language", "feedback.scale.not-at-all", "Not at all", "feedback.scale.completely", "Completely"),
      "feedback.d.language.hint", "Including where an interpreter was used. Tell us if the interpretation was poor."));

    form.appendChild(field("feedback.d.prepared", "Was the information the patient gave beforehand useful?",
      scale("d-prepared", "feedback.scale.not-at-all", "Not at all", "feedback.scale.completely", "Very useful")));

    form.appendChild(field("feedback.d.notes", "Anything the clinical team should know?",
      textarea("fb-d-notes", "feedback.d.notes.ph", "Safety concerns, a complaint category we are missing, a symptom that routes badly.")));

    var safety = UI.el("div", "callout callout--warn");
    safety.style.margin = "1.25rem 0";
    var sb = UI.el("div");
    sb.appendChild(UI.el("p", "callout__title", UI.t("feedback.d.safety.t", "Do not put patient-identifying details here")));
    sb.appendChild(UI.el("p", null, UI.t("feedback.d.safety.d",
      "This form is for improving the service, not a clinical record. The consultation notes belong in the patient's record. If you have an urgent safeguarding concern, contact the clinical team directly rather than using this form.")));
    safety.appendChild(sb);
    form.appendChild(safety);

    return form;
  }

  function specialtySelect() {
    var select = document.createElement("select");
    select.className = "select";
    select.id = "fb-d-specialty";

    var none = document.createElement("option");
    none.value = "";
    none.textContent = UI.t("feedback.d.specialty.none", "Not applicable — it was mine");
    select.appendChild(none);

    var sorted = Data.specialties.slice().sort(function (a, b) {
      return UI.specialtyName(a.id).localeCompare(UI.specialtyName(b.id), UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      var o = document.createElement("option");
      o.value = sorted[i].id;
      o.textContent = UI.specialtyName(sorted[i].id);
      select.appendChild(o);
    }
    return select;
  }

  /* -------------------------------------------------------------- render */

  function validate(form) {
    var ok = true;
    var groups = Object.create(null);
    var radios = form.querySelectorAll('input[type="radio"][required]');
    for (var i = 0; i < radios.length; i++) groups[radios[i].name] = true;

    for (var name in groups) {
      var checked = form.querySelector('input[name="' + name + '"]:checked');
      var wrap = form.querySelector('input[name="' + name + '"]').closest(".field");
      if (wrap) wrap.classList.toggle("has-error", !checked);
      if (!checked) ok = false;
    }
    return ok;
  }

  function render() {
    host.innerHTML = "";
    var form = role === "doctor" ? doctorForm() : patientForm();

    var actions = UI.el("div", "triage-actions");
    var submit = UI.el("button", "btn btn--primary btn--lg", UI.t("feedback.submit", "Send feedback"));
    submit.type = "submit";
    actions.appendChild(submit);
    form.appendChild(actions);

    var status = UI.el("p", "card__meta");
    status.setAttribute("role", "status");
    status.style.marginTop = "1rem";
    form.appendChild(status);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate(form)) {
        status.textContent = UI.t("feedback.err", "Please answer the highlighted questions.");
        return;
      }
      renderThanks();
    });

    form.addEventListener("change", function (event) {
      var wrap = event.target.closest && event.target.closest(".field");
      if (wrap) wrap.classList.remove("has-error");
    });

    host.appendChild(form);
  }

  function renderThanks() {
    host.innerHTML = "";
    var header = UI.el("div", "result-header result-header--routine");
    header.innerHTML = '<svg class="result-header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ht = UI.el("div");
    ht.style.flex = "1";
    ht.appendChild(UI.el("h3", null, UI.t("feedback.done.t", "Thank you")));
    ht.appendChild(UI.el("p", null, role === "doctor"
      ? UI.t("feedback.done.doctor", "This goes straight to the clinical team reviewing how complaints are routed.")
      : UI.t("feedback.done.patient", "Your rating will appear on this doctor's profile alongside everyone else's.")));
    header.appendChild(ht);
    host.appendChild(header);

    var demo = UI.el("p", "card__meta");
    demo.textContent = UI.t("feedback.done.demo",
      "This is a demonstration build, so nothing was submitted or stored.");
    host.appendChild(demo);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.25rem";
    var home = UI.el("a", "btn btn--ghost", UI.t("feedback.done.home", "Back to the home page"));
    home.href = "index.html";
    actions.appendChild(home);
    host.appendChild(actions);
  }

  var roleInputs = document.querySelectorAll('[data-feedback-role] input[name="role"]');
  for (var i = 0; i < roleInputs.length; i++) {
    roleInputs[i].checked = roleInputs[i].value === role;
    roleInputs[i].addEventListener("change", function (event) {
      role = event.target.value;
      render();
    });
  }

  render();
  UI.onLanguageChange(render);
})(window, document);
