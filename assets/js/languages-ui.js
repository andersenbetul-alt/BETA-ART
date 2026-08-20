/* Naviar Care — searchable table of every language the service covers. */
(function (window, document) {
  "use strict";

  var table = document.querySelector("[data-language-table]");
  if (!table) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;

  var els = {
    table: table,
    search: document.querySelector("[data-language-search]"),
    region: document.querySelector("[data-language-region]"),
    count: document.querySelector("[data-language-count]"),
    empty: document.querySelector("[data-language-empty]"),
    total: document.querySelector("[data-count-total]"),
    native: document.querySelector("[data-count-native]")
  };

  var state = { query: "", region: "" };

  function normalise(value) {
    var text = String(value || "").toLowerCase();
    if (typeof text.normalize === "function") {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text;
  }

  function regions() {
    var seen = [];
    for (var i = 0; i < Data.serviceLanguages.length; i++) {
      var r = Data.serviceLanguages[i].region;
      if (seen.indexOf(r) === -1) seen.push(r);
    }
    return seen.sort();
  }

  function fillRegions() {
    if (!els.region) return;
    els.region.innerHTML = "";

    var any = document.createElement("option");
    any.value = "";
    any.textContent = UI.t("lang.region.all", "Everywhere");
    els.region.appendChild(any);

    var list = regions();
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement("option");
      opt.value = list[i];
      opt.textContent = UI.t("region.geo." + list[i], list[i]);
      els.region.appendChild(opt);
    }
    els.region.value = state.region;
  }

  function matches(lang) {
    if (state.region && lang.region !== state.region) return false;
    if (!state.query) return true;
    var needle = normalise(state.query);
    return normalise(lang.en).indexOf(needle) !== -1
        || normalise(lang.native).indexOf(needle) !== -1
        || normalise(lang.code).indexOf(needle) !== -1;
  }

  function render() {
    els.table.innerHTML = "";
    var shown = 0;

    var sorted = Data.serviceLanguages.slice().sort(function (a, b) {
      return a.native.localeCompare(b.native, UI.locale());
    });

    for (var i = 0; i < sorted.length; i++) {
      var lang = sorted[i];
      if (!matches(lang)) continue;
      shown++;

      var tr = document.createElement("tr");

      /* The native name leads: it is what a speaker of that language
         recognises at a glance, whatever language the site is set to. */
      var native = document.createElement("td");
      native.textContent = lang.native;
      native.style.fontWeight = "600";
      native.setAttribute("lang", lang.code);
      if (["ar", "fa", "he", "ur", "ps", "sd"].indexOf(lang.code) !== -1) native.setAttribute("dir", "rtl");
      tr.appendChild(native);

      var name = document.createElement("td");
      name.className = "card__meta";
      name.textContent = lang.en;
      tr.appendChild(name);

      var how = document.createElement("td");
      var tag = UI.el("span", "tag " + (lang.tier === "doctor" ? "tag--brand" : ""),
        UI.t(lang.tier === "doctor" ? "lang.tier.doctor" : "lang.tier.interpreter",
             lang.tier === "doctor" ? "Doctor speaks it" : "Interpreter joins"));
      how.appendChild(tag);
      tr.appendChild(how);

      var action = document.createElement("td");
      var link = UI.el("a", "btn btn--ghost btn--sm", UI.t("cta.book", "Book"));
      link.href = "booking.html?language=" + encodeURIComponent(lang.code);
      action.appendChild(link);
      tr.appendChild(action);

      els.table.appendChild(tr);
    }

    if (els.empty) els.empty.hidden = shown > 0;
    if (els.count) {
      els.count.textContent = UI.format("lang.count", { shown: shown, total: Data.serviceLanguages.length },
        "Showing {shown} of {total} languages");
    }
  }

  function renderStats() {
    if (els.total) els.total.textContent = String(Data.serviceLanguages.length);
    if (els.native) {
      var n = Data.serviceLanguages.filter(function (l) { return l.tier === "doctor"; }).length;
      els.native.textContent = String(n);
    }
  }

  if (els.search) {
    els.search.addEventListener("input", function () {
      state.query = els.search.value;
      render();
    });
  }
  if (els.region) {
    els.region.addEventListener("change", function () {
      state.region = els.region.value;
      render();
    });
  }

  renderStats();
  fillRegions();
  render();

  UI.onLanguageChange(function () {
    fillRegions();
    renderStats();
    render();
  });
})(window, document);
