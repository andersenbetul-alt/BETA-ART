/* Naviar Care — home page: live availability counters, language sampler and
   the specialty chip cloud. */
(function (window, document) {
  "use strict";
  if (document.documentElement.getAttribute("data-page") !== "home") return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;
  var Booking = window.NaviarBooking;

  /* "Where does it hurt?" in a spread of languages, to make the promise
     concrete rather than a number. */
  var SAMPLES = [
    { code: "ar", text: "أين يؤلمك؟" },
    { code: "zh", text: "哪里疼？" },
    { code: "sw", text: "Unaumwa wapi?" },
    { code: "hi", text: "कहाँ दर्द हो रहा है?" },
    { code: "es", text: "¿Dónde le duele?" },
    { code: "tr", text: "Neresi ağrıyor?" },
    { code: "bn", text: "কোথায় ব্যথা করছে?" },
    { code: "fr", text: "Où avez-vous mal ?" },
    { code: "ru", text: "Где болит?" },
    { code: "pt", text: "Onde dói?" }
  ];

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function renderCounters() {
    var counts = Booking.counts();
    setText("[data-live-now]", String(counts.now));
    setText("[data-live-soon]", String(counts.soon));
    setText("[data-live-languages]", String(Data.serviceLanguages.length));
    setText("[data-live-specialties]", String(Data.specialties.length));
  }

  function renderSampler() {
    var host = document.querySelector("[data-sampler-list]");
    if (!host) return;
    host.innerHTML = "";

    for (var i = 0; i < SAMPLES.length; i++) {
      var sample = SAMPLES[i];
      var entry = Data.languageByCode(sample.code);

      var row = UI.el("div");
      row.style.cssText = "display:flex;gap:1rem;align-items:baseline;padding:.4rem 0;border-bottom:1px dashed var(--border)";
      if (i === SAMPLES.length - 1) row.style.borderBottom = "0";

      var phrase = UI.el("span", null, sample.text);
      phrase.style.cssText = "font-weight:600;font-size:1.02rem";
      if (sample.code === "ar") phrase.setAttribute("dir", "rtl");
      phrase.setAttribute("lang", sample.code);
      row.appendChild(phrase);

      var label = UI.el("span", "card__meta", entry ? entry.native : sample.code);
      label.style.marginInlineStart = "auto";
      row.appendChild(label);

      host.appendChild(row);
    }
  }

  function renderSpecialtyChips() {
    var host = document.querySelector("[data-specialty-chips]");
    if (!host) return;
    host.innerHTML = "";

    var sorted = Data.specialties.slice().sort(function (a, b) {
      return UI.specialtyName(a.id).localeCompare(UI.specialtyName(b.id), UI.locale());
    });

    for (var i = 0; i < sorted.length; i++) {
      var chip = UI.el("a", "chip", UI.specialtyName(sorted[i].id));
      chip.href = "booking.html?specialty=" + encodeURIComponent(sorted[i].id);
      host.appendChild(chip);
    }
  }

  function renderAll() {
    renderCounters();
    renderSampler();
    renderSpecialtyChips();
  }

  renderAll();
  UI.onLanguageChange(renderAll);
})(window, document);
