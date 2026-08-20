/* ==========================================================================
   Naviar Care — i18n engine
   --------------------------------------------------------------------------
   - Detects the visitor's language from localStorage -> ?lang= -> navigator
   - Loads assets/js/i18n/<lang>.js on demand (plain <script>, so the site
     still works from file:// where fetch() is blocked)
   - Applies translations to [data-i18n], [data-i18n-attr-*] and [data-i18n-html]
   - Falls back to English for any key a dictionary has not translated yet
   - Flips the document to RTL for right-to-left languages
   ========================================================================== */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "naviar.lang";
  var DEFAULT_LANG = "en";
  var RTL_LANGS = ["ar", "fa", "he", "ur"];

  /* Languages the interface itself is translated into. The *service* supports
     far more (see assets/js/languages.js) — these are the UI locales. */
  var UI_LANGUAGES = [
    { code: "en", name: "English",    native: "English"    },
    { code: "tr", name: "Turkish",    native: "Türkçe"     },
    { code: "es", name: "Spanish",    native: "Español"    },
    { code: "ar", name: "Arabic",     native: "العربية"    },
    { code: "fr", name: "French",     native: "Français"   },
    { code: "de", name: "German",     native: "Deutsch"    },
    { code: "ru", name: "Russian",    native: "Русский"    },
    { code: "zh", name: "Chinese",    native: "中文"        },
    { code: "hi", name: "Hindi",      native: "हिन्दी"      },
    { code: "pt", name: "Portuguese", native: "Português"  }
  ];

  var dictionaries = Object.create(null); // code -> flat key/value map
  var listeners = [];
  var current = DEFAULT_LANG;
  var pending = Object.create(null);      // code -> [callbacks] while loading

  /* ------------------------------------------------------------- helpers -- */

  function isSupported(code) {
    for (var i = 0; i < UI_LANGUAGES.length; i++) {
      if (UI_LANGUAGES[i].code === code) return true;
    }
    return false;
  }

  function normalise(tag) {
    if (!tag) return null;
    var base = String(tag).toLowerCase().split(/[-_]/)[0];
    return isSupported(base) ? base : null;
  }

  function readStored() {
    try { return normalise(window.localStorage.getItem(STORAGE_KEY)); }
    catch (e) { return null; }
  }

  function writeStored(code) {
    try { window.localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* private mode */ }
  }

  function fromQuery() {
    var match = /[?&]lang=([^&#]+)/.exec(window.location.search);
    return match ? normalise(decodeURIComponent(match[1])) : null;
  }

  function fromBrowser() {
    var tags = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage];
    for (var i = 0; i < tags.length; i++) {
      var hit = normalise(tags[i]);
      if (hit) return hit;
    }
    return null;
  }

  function detect() {
    return readStored() || fromQuery() || fromBrowser() || DEFAULT_LANG;
  }

  function isRTL(code) { return RTL_LANGS.indexOf(code) !== -1; }

  /* --------------------------------------------------------- dictionaries -- */

  /* Dictionary files call this when they finish loading. */
  function register(code, table) {
    dictionaries[code] = table;
    var waiting = pending[code];
    delete pending[code];
    if (waiting) {
      for (var i = 0; i < waiting.length; i++) waiting[i]();
    }
  }

  function scriptBase() {
    // Resolve dictionary URLs relative to this file so pages in any folder work.
    var self = document.querySelector('script[src*="i18n.js"]');
    if (!self) return "assets/js/i18n/";
    return self.getAttribute("src").replace(/i18n\.js.*$/, "i18n/");
  }

  function load(code, done) {
    if (dictionaries[code]) { done(); return; }
    if (pending[code]) { pending[code].push(done); return; }

    pending[code] = [done];
    var tag = document.createElement("script");
    tag.src = scriptBase() + code + ".js";
    tag.async = true;
    tag.onerror = function () {
      // Missing dictionary: register an empty table so we fall back to English.
      register(code, {});
    };
    document.head.appendChild(tag);
  }

  /* -------------------------------------------------------------- lookup -- */

  function t(key, fallback) {
    var table = dictionaries[current];
    if (table && typeof table[key] === "string") return table[key];
    var base = dictionaries[DEFAULT_LANG];
    if (base && typeof base[key] === "string") return base[key];
    return fallback != null ? fallback : key;
  }

  /* Replaces {name} placeholders: t("greet", null, { name: "Ada" }) */
  function format(key, vars, fallback) {
    var out = t(key, fallback);
    if (!vars) return out;
    return out.replace(/\{(\w+)\}/g, function (whole, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : whole;
    });
  }

  /* --------------------------------------------------------------- apply -- */

  function applyTo(root) {
    var scope = root || document;

    // Text content
    var nodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      if (!el.hasAttribute("data-i18n-default")) {
        el.setAttribute("data-i18n-default", el.textContent.trim());
      }
      el.textContent = t(key, el.getAttribute("data-i18n-default"));
    }

    // Rich text (trusted, authored by us — never visitor input)
    var htmlNodes = scope.querySelectorAll("[data-i18n-html]");
    for (var h = 0; h < htmlNodes.length; h++) {
      var hEl = htmlNodes[h];
      var hKey = hEl.getAttribute("data-i18n-html");
      if (!hEl.hasAttribute("data-i18n-default")) {
        hEl.setAttribute("data-i18n-default", hEl.innerHTML.trim());
      }
      hEl.innerHTML = t(hKey, hEl.getAttribute("data-i18n-default"));
    }

    // Attributes: data-i18n-placeholder, -title, -aria-label, -alt, -content, -value
    var ATTRS = ["placeholder", "title", "alt", "value", "content", "aria-label"];
    for (var a = 0; a < ATTRS.length; a++) {
      var attr = ATTRS[a];
      var sel = "[data-i18n-" + attr + "]";
      var withAttr = scope.querySelectorAll(sel);
      for (var j = 0; j < withAttr.length; j++) {
        var node = withAttr[j];
        var aKey = node.getAttribute("data-i18n-" + attr);
        var memo = "data-i18n-default-" + attr;
        if (!node.hasAttribute(memo)) {
          node.setAttribute(memo, node.getAttribute(attr) || "");
        }
        node.setAttribute(attr, t(aKey, node.getAttribute(memo)));
      }
    }
  }

  function paintDocument() {
    var html = document.documentElement;
    html.setAttribute("lang", current);
    html.setAttribute("dir", isRTL(current) ? "rtl" : "ltr");
    applyTo(document);

    var switches = document.querySelectorAll("[data-lang-select]");
    for (var i = 0; i < switches.length; i++) {
      switches[i].value = current;
    }
    for (var k = 0; k < listeners.length; k++) {
      try { listeners[k](current); } catch (e) { /* keep other listeners alive */ }
    }
  }

  /* ----------------------------------------------------------------- api -- */

  function setLanguage(code, opts) {
    var next = normalise(code) || DEFAULT_LANG;
    var options = opts || {};
    // English is bundled first so there is always a fallback table available.
    load(DEFAULT_LANG, function () {
      load(next, function () {
        current = next;
        if (options.persist !== false) writeStored(next);
        paintDocument();
      });
    });
  }

  function onChange(fn) {
    if (typeof fn === "function") {
      listeners.push(fn);
      if (dictionaries[current]) fn(current);
    }
  }

  function init() {
    setLanguage(detect(), { persist: false });
    wireSwitchers();
  }

  function wireSwitchers() {
    document.addEventListener("change", function (event) {
      var select = event.target.closest ? event.target.closest("[data-lang-select]") : null;
      if (select) setLanguage(select.value);
    });
    document.addEventListener("click", function (event) {
      var btn = event.target.closest ? event.target.closest("[data-lang-set]") : null;
      if (btn) {
        event.preventDefault();
        setLanguage(btn.getAttribute("data-lang-set"));
      }
    });
  }

  window.NaviarI18n = {
    register: register,
    setLanguage: setLanguage,
    onChange: onChange,
    apply: applyTo,
    t: t,
    format: format,
    languages: UI_LANGUAGES,
    isRTL: isRTL,
    get current() { return current; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
