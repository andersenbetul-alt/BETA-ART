/* =============================================================================
   Fills the legal pages from config.js, so the company details exist in one
   place only. If the org number changes, it changes here too — nobody has to
   remember that it was also written into two HTML files.
   ========================================================================== */
(function (global, document) {
  'use strict';
  var C = (global.NAVIAR_CONFIG || {}).company || {};

  function fill(attr, value) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-company="' + attr + '"]'),
      function (n) { n.textContent = value || '—'; });
  }
  fill('legalName', C.legalName);
  fill('orgNumber', C.orgNumber);
  fill('email', C.email);
  fill('phone', C.phone);
  fill('address', (C.address || []).join(', '));

  Array.prototype.forEach.call(document.querySelectorAll('[data-company-mail]'), function (a) {
    a.href = 'mailto:' + (C.email || '');
    if (!a.textContent.trim()) a.textContent = C.email || '';
  });

  /* Two languages, one document. Norwegian governs; English is a courtesy. */
  var buttons = document.querySelectorAll('[data-legal-lang]');
  function choose(lang, remember) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-legal-body]'), function (s) {
      s.hidden = s.dataset.legalBody !== lang;
    });
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-selected', String(b.dataset.legalLang === lang));
    });
    document.documentElement.lang = lang;
    /* Only a click is a choice. Persisting the automatic default would make it
       stick, and someone reading the site in Turkish would keep landing on the
       Norwegian text. */
    if (remember) {
      try { localStorage.setItem('naviar.legalLang', lang); } catch (e) { /* private mode */ }
    }
  }
  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () { choose(b.dataset.legalLang, true); });
  });

  /* Norwegian if the visitor reads the site in Norwegian, English otherwise —
     an explicit choice on this page wins over both. */
  var start = 'no';
  try {
    var saved = localStorage.getItem('naviar.legalLang');
    var site = localStorage.getItem('naviar.lang');
    if (saved === 'en' || saved === 'no') start = saved;
    else if (site) start = site === 'no' ? 'no' : 'en';
    else if (!/^nb|^nn|^no/.test(navigator.language || '')) start = 'en';
  } catch (e) { /* private mode */ }
  choose(start);
}(window, document));
