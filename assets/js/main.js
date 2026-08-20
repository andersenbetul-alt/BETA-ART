/* ==========================================================================
   Naviar Care — shared page behaviour: theme, navigation, language menu and
   the small formatting helpers every page needs.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var THEME_KEY = "naviar.theme";
  var I18n = window.NaviarI18n;

  /* ---------------------------------------------------------------- theme */

  function storedTheme() {
    try { return window.localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", name === "dark" ? "#0d1826" : "#0d8172");
  }

  function initTheme() {
    var saved = storedTheme();
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));

    document.addEventListener("click", function (event) {
      var btn = event.target.closest && event.target.closest("[data-theme-toggle]");
      if (!btn) return;
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { window.localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ----------------------------------------------------------- navigation */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------- language menu */

  function initLanguageMenu() {
    if (!I18n) return;
    var selects = document.querySelectorAll("[data-lang-select]");
    for (var i = 0; i < selects.length; i++) {
      var select = selects[i];
      if (select.options.length) continue;
      for (var j = 0; j < I18n.languages.length; j++) {
        var lang = I18n.languages[j];
        var opt = document.createElement("option");
        opt.value = lang.code;
        opt.textContent = lang.native;
        select.appendChild(opt);
      }
      select.value = I18n.current;
    }
  }

  /* ---------------------------------------------------------- formatting */

  function t(key, fallback) {
    return I18n ? I18n.t(key, fallback) : (fallback || key);
  }

  function format(key, vars, fallback) {
    return I18n ? I18n.format(key, vars, fallback) : (fallback || key);
  }

  function locale() {
    return I18n ? I18n.current : "en";
  }

  /* Clock time in the visitor's own locale, e.g. "14:35" or "2:35 PM". */
  function clockTime(date) {
    try {
      return new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit" }).format(date);
    } catch (e) {
      var h = String(date.getHours());
      var m = String(date.getMinutes());
      return (h.length < 2 ? "0" + h : h) + ":" + (m.length < 2 ? "0" + m : m);
    }
  }

  /* "in 25 minutes" / "now", translated. */
  function waitLabel(minutes) {
    if (minutes <= 0) return t("wait.now", "available now");
    if (minutes < 60) return format("wait.minutes", { n: minutes }, "in {n} min");
    var hours = Math.round(minutes / 60);
    return format("wait.hours", { n: hours }, "in {n} h");
  }

  function specialtyName(id) {
    return t("spec." + id + ".name", id.replace(/-/g, " "));
  }

  function symptomName(id) {
    return t("sym." + id, id.replace(/-/g, " "));
  }

  /* Country names come from the browser's own locale data, so they are
     correct in every language the visitor might pick without us shipping 58
     more strings per language. Falls back to the English name. */
  var countryFormatter = null;
  var countryFormatterLocale = null;

  function countryName(code) {
    if (!code) return "";
    var current = locale();
    if (countryFormatterLocale !== current) {
      countryFormatterLocale = current;
      countryFormatter = null;
      try {
        if (typeof Intl !== "undefined" && Intl.DisplayNames) {
          countryFormatter = new Intl.DisplayNames([current], { type: "region" });
        }
      } catch (e) { countryFormatter = null; }
    }
    if (countryFormatter) {
      try {
        var name = countryFormatter.of(code);
        if (name && name !== code) return name;
      } catch (e) { /* unknown region code */ }
    }
    var entry = window.NaviarData && window.NaviarData.countryByCode(code);
    return entry ? entry.en : code;
  }

  function languageName(code) {
    var entry = window.NaviarData && window.NaviarData.languageByCode(code);
    if (!entry) return code;
    return entry.native;
  }

  /* Escapes anything that came from a person before it reaches innerHTML. */
  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* Re-run a render function whenever the visitor changes language. */
  function onLanguageChange(fn) {
    if (I18n) I18n.onChange(fn);
    else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn("en");
  }

  window.NaviarUI = {
    t: t,
    format: format,
    locale: locale,
    clockTime: clockTime,
    waitLabel: waitLabel,
    specialtyName: specialtyName,
    symptomName: symptomName,
    languageName: languageName,
    countryName: countryName,
    escapeHTML: escapeHTML,
    el: el,
    onLanguageChange: onLanguageChange,
    applyTheme: applyTheme
  };

  function boot() {
    initTheme();
    initNav();
    initLanguageMenu();
    if (I18n) I18n.onChange(initLanguageMenu);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
