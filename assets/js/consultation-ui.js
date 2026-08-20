/* ==========================================================================
   Naviar Care — consultation room (consultation.html)
   Nothing connects until the patient presses join.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var room = document.querySelector("[data-consult-room]");
  if (!room) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;
  var Video = window.NaviarVideo;

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
  var reference = params.ref || "";
  var session = null;

  /* -------------------------------------------------------- participants */

  function renderParticipants() {
    var host = document.querySelector("[data-consult-participants]");
    if (!host) return;
    host.innerHTML = "";

    var list = UI.el("ul", "feature-list");
    list.style.margin = "0";

    if (doctor) {
      list.appendChild(UI.el("li", null, UI.format("booking.doctor.name", { name: doctor.name }, "Dr {name}")
        + " — " + UI.specialtyName(doctor.spec)));
    } else {
      list.appendChild(UI.el("li", null, UI.t("consult.who.doctor", "Your doctor")));
    }
    list.appendChild(UI.el("li", null, UI.t("consult.who.you", "You")));

    /* An interpreter is a third person in a confidential consultation, so
       their presence is disclosed here rather than buried in the terms. */
    var needsInterpreter = false;
    try {
      var stored = window.localStorage.getItem("naviar.lang");
      if (doctor && stored) needsInterpreter = doctor.langs.indexOf(stored) === -1;
    } catch (e) { /* ignore */ }

    if (needsInterpreter) {
      list.appendChild(UI.el("li", null, UI.t("consult.who.interpreter", "A medical interpreter, bound by the same confidentiality as your doctor")));
    }
    host.appendChild(list);

    if (needsInterpreter) {
      var note = UI.el("p", "card__meta");
      note.style.marginTop = ".75rem";
      note.textContent = UI.t("consult.who.interpreter-note",
        "You are told this in advance because a third person will hear your consultation. You can ask for a doctor who speaks your language instead.");
      host.appendChild(note);
    }
  }

  /* ------------------------------------------------------------- lobby */

  function renderLobby() {
    room.innerHTML = "";

    var posture = Video.securityPosture();

    var head = UI.el("div");
    head.appendChild(UI.el("h2", null, UI.t("consult.lobby.title", "Ready when you are")));
    if (reference) {
      head.appendChild(UI.el("p", "card__meta",
        UI.format("consult.lobby.ref", { ref: reference }, "Booking reference {ref}")));
    }
    room.appendChild(head);

    if (doctor) {
      var who = UI.el("div", "spec-card__head");
      who.style.margin = "1.25rem 0";
      var initials = doctor.name.split(" ").map(function (p) { return p.charAt(0); }).slice(0, 2).join("");
      who.appendChild(UI.el("div", "spec-card__avatar", initials));
      var title = UI.el("div");
      title.appendChild(UI.el("h3", null, UI.format("booking.doctor.name", { name: doctor.name }, "Dr {name}")));
      title.appendChild(UI.el("p", "card__meta", UI.specialtyName(doctor.spec)));
      who.appendChild(title);
      room.appendChild(who);
    }

    /* Security is stated as it actually is, including when it is not good
       enough for real patients. A reassuring lie here would be the worst
       possible place for one. */
    var box = UI.el("div", "callout callout--" + (posture.productionReady ? "info" : "warn"));
    box.style.margin = "1.25rem 0";
    var body = UI.el("div");

    if (posture.productionReady) {
      body.appendChild(UI.el("p", "callout__title", UI.t("consult.secure.t", "This room is end-to-end encrypted")));
      body.appendChild(UI.el("p", null, UI.format("consult.secure.d", { provider: posture.provider },
        "The call runs on our own {provider} deployment. Audio and video are encrypted between you and your doctor, and no third party — including Naviar Care — can listen in.")));
    } else {
      body.appendChild(UI.el("p", "callout__title", UI.t("consult.demo.t", "Demonstration room — not for real patients")));
      body.appendChild(UI.el("p", null, UI.format("consult.demo.d", { domain: posture.domain || "a public server" },
        "This build points at {domain}, which is a public service. It is fine for trying the flow out, and must never be used for an actual consultation. Point the configuration at your own end-to-end encrypted deployment before going live.")));
    }
    box.appendChild(body);
    room.appendChild(box);

    var facts = UI.el("ul", "summary-list");
    function fact(key, fb, value) {
      var li = document.createElement("li");
      li.appendChild(UI.el("span", "k", UI.t(key, fb)));
      li.appendChild(UI.el("span", null, value));
      facts.appendChild(li);
    }
    var yes = UI.t("consult.yes", "Yes");
    var no = UI.t("consult.no", "No");
    fact("consult.fact.e2ee", "End-to-end encrypted", posture.e2ee ? yes : no);
    fact("consult.fact.lobby", "Doctor admits you from a lobby", posture.lobby ? yes : no);
    fact("consult.fact.recording", "Recording", posture.recording
      ? UI.t("consult.fact.recording-on", "Enabled — both parties must consent")
      : UI.t("consult.fact.recording-off", "Off. Nothing is recorded."));
    fact("consult.fact.hosting", "Hosted by", posture.selfHosted
      ? UI.t("consult.fact.self", "Naviar Care, on its own servers")
      : posture.provider);
    room.appendChild(facts);

    var nameField = UI.el("div", "field");
    nameField.style.marginTop = "1.5rem";
    var label = UI.el("label", null, UI.t("consult.your-name", "The name your doctor will see"));
    label.setAttribute("for", "consult-name");
    nameField.appendChild(label);
    var input = document.createElement("input");
    input.className = "input";
    input.id = "consult-name";
    input.type = "text";
    input.autocomplete = "name";
    nameField.appendChild(input);
    room.appendChild(nameField);

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.5rem";
    var join = UI.el("button", "btn btn--primary btn--lg", UI.t("consult.join", "Join the consultation"));
    join.type = "button";
    join.addEventListener("click", function () { startCall(input.value.trim()); });
    actions.appendChild(join);
    var back = UI.el("a", "btn btn--ghost", UI.t("cta.back-to-list", "Back to the list"));
    back.href = "booking.html";
    actions.appendChild(back);
    room.appendChild(actions);

    var privacy = UI.el("p", "card__meta");
    privacy.style.marginTop = "1rem";
    privacy.textContent = UI.t("consult.no-connect",
      "Your camera and microphone are not touched, and no connection is made to the video service, until you press join.");
    room.appendChild(privacy);
  }

  /* -------------------------------------------------------------- call */

  function startCall(displayName) {
    room.innerHTML = "";
    room.appendChild(UI.el("p", "card__meta", UI.t("consult.connecting", "Connecting to your consultation…")));

    var stage = UI.el("div");
    stage.style.cssText = "border-radius:14px;overflow:hidden;background:var(--surface-2)";
    room.appendChild(stage);

    Video.join(stage, {
      reference: reference || (doctor ? doctor.id : "room"),
      displayName: displayName,
      title: UI.t("consult.title", "Your consultation room")
    }).then(function (active) {
      session = active;
      room.querySelector(".card__meta").textContent = UI.t("consult.connected", "You are in the room. Your doctor will admit you shortly.");
      renderCallActions();
    }).catch(function (err) {
      renderFailure(err);
    });
  }

  function renderCallActions() {
    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.25rem";

    var leave = UI.el("button", "btn btn--danger", UI.t("consult.leave", "Leave the consultation"));
    leave.type = "button";
    leave.addEventListener("click", endCall);
    actions.appendChild(leave);

    room.appendChild(actions);
  }

  function endCall() {
    if (session && session.leave) session.leave();
    session = null;
    room.innerHTML = "";

    room.appendChild(UI.el("h2", null, UI.t("consult.ended.title", "Consultation ended")));
    room.appendChild(UI.el("p", null, UI.t("consult.ended.lead",
      "Your notes and any referral will be sent to you in your own language. If anything gets worse, do not wait for the next appointment.")));

    var actions = UI.el("div", "btn-row");
    actions.style.marginTop = "1.25rem";
    var feedback = UI.el("a", "btn btn--primary", UI.t("consult.ended.feedback", "Tell us how it went"));
    feedback.href = "feedback.html?role=patient" + (doctor ? "&doctor=" + encodeURIComponent(doctor.id) : "")
      + (reference ? "&ref=" + encodeURIComponent(reference) : "");
    actions.appendChild(feedback);
    var again = UI.el("a", "btn btn--ghost", UI.t("cta.book-another", "Book another consultation"));
    again.href = "booking.html";
    actions.appendChild(again);
    room.appendChild(actions);
  }

  function renderFailure(err) {
    room.innerHTML = "";
    var box = UI.el("div", "callout callout--danger");
    var body = UI.el("div");
    body.appendChild(UI.el("p", "callout__title", UI.t("consult.failed.t", "We could not open the consultation room")));
    body.appendChild(UI.el("p", null, err && err.message === "not-configured"
      ? UI.t("consult.failed.config", "No video provider is configured for this deployment. Set one in the configuration file before taking consultations.")
      : UI.t("consult.failed.d", "The video service could not be reached. Check your connection and try again — your booking is not affected.")));
    box.appendChild(body);
    room.appendChild(box);

    var retry = UI.el("button", "btn btn--ghost", UI.t("consult.failed.retry", "Try again"));
    retry.type = "button";
    retry.style.marginTop = "1.25rem";
    retry.addEventListener("click", renderLobby);
    room.appendChild(retry);
  }

  /* Leaving the page must tear the call down, not leave it running. */
  window.addEventListener("beforeunload", function () {
    if (session && session.leave) session.leave();
  });

  function renderAll() {
    if (!session) renderLobby();
    renderParticipants();
  }

  renderAll();
  UI.onLanguageChange(renderAll);
})(window, document);
