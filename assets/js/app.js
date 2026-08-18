/* PårørendePilot – felles skript: meny, informasjonskapsler, årstall.
   Ingen sporing kjører før brukeren har gitt samtykke. */

(function () {
  'use strict';

  var CONSENT_KEY = 'pp_cookie_consent_v1';

  /* ---------- Årstall i bunntekst ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Mobilmeny ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hovedmeny');

  function applyNavState() {
    if (!navToggle || !nav) return;
    var isMobile = window.matchMedia('(max-width: 860px)').matches;
    if (!isMobile) {
      nav.hidden = false;
      navToggle.setAttribute('aria-expanded', 'false');
    } else if (navToggle.getAttribute('aria-expanded') !== 'true') {
      nav.hidden = true;
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.hidden = open;
    });
    window.addEventListener('resize', applyNavState);
    applyNavState();
  }

  /* ---------- Samtykke til informasjonskapsler ----------
     Formålene holdes atskilt (GDPR art. 5(1)(b)): analyse og markedsføring
     lagres hver for seg, og ingen av dem påvirker posisjonssamtykket. */

  var banner = document.getElementById('cookie-banner');

  function readConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    consent.necessary = true;
    consent.timestamp = new Date().toISOString();
    consent.version = 1;
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (e) { /* privat modus – da gjelder kun nødvendige */ }
    applyConsent(consent);
  }

  function applyConsent(consent) {
    // Krok for senere: last analyse-/markedsføringsskript først når samtykke finnes.
    document.documentElement.dataset.analytics = consent.analytics ? 'on' : 'off';
    document.documentElement.dataset.marketing = consent.marketing ? 'on' : 'off';
  }

  function openBanner() {
    if (!banner) return;
    var existing = readConsent();
    var analytics = document.getElementById('cookie-analytics');
    var marketing = document.getElementById('cookie-marketing');
    if (existing) {
      if (analytics) analytics.checked = !!existing.analytics;
      if (marketing) marketing.checked = !!existing.marketing;
    }
    banner.hidden = false;
  }

  if (banner) {
    var stored = readConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      openBanner();
    }

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-cookie]');
      if (!button) return;
      var choice = button.getAttribute('data-cookie');
      var analytics = document.getElementById('cookie-analytics');
      var marketing = document.getElementById('cookie-marketing');

      if (choice === 'all') {
        saveConsent({ analytics: true, marketing: true });
      } else if (choice === 'necessary') {
        saveConsent({ analytics: false, marketing: false });
      } else {
        saveConsent({
          analytics: !!(analytics && analytics.checked),
          marketing: !!(marketing && marketing.checked)
        });
      }
      banner.hidden = true;
    });
  }

  // «Informasjonskapsler» i bunnteksten: like enkelt å trekke tilbake som å gi.
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-open-cookie-settings]');
    if (!link) return;
    event.preventDefault();
    openBanner();
  });
})();
