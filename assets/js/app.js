/* HXI — site behaviour: language switching, mobile nav, scroll reveal, signup. */
(function () {
  'use strict';

  var LANGS = window.HXI_LANGS || [];
  var T = window.HXI_I18N || {};
  var RTL = { ar: 1, ur: 1 };
  var STORE_KEY = 'hxi-lang';

  /* ---------- language ---------- */

  function supported(code) {
    if (!code) return null;
    code = String(code).toLowerCase();
    if (T[code]) return code;
    var base = code.split('-')[0];
    return T[base] ? base : null;
  }

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
    var fromUrl = new URLSearchParams(location.search).get('lang');
    var list = [fromUrl, saved].concat(navigator.languages || [navigator.language]);
    for (var i = 0; i < list.length; i++) {
      var hit = supported(list[i]);
      if (hit) return hit;
    }
    return 'en';
  }

  function apply(code) {
    var dict = T[code] || T.en;
    var fallback = T.en;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = dict[key] != null ? dict[key] : fallback[key];
      if (value != null) el.textContent = value;
    });

    var html = document.documentElement;
    html.setAttribute('lang', code);
    html.setAttribute('dir', RTL[code] ? 'rtl' : 'ltr');

    var email = document.getElementById('signup-email');
    if (email && dict.form_email) email.setAttribute('placeholder', dict.form_email);

    var select = document.getElementById('lang-select');
    if (select) select.value = code;

    try { localStorage.setItem(STORE_KEY, code); } catch (e) { /* ignore */ }
  }

  function buildSwitcher() {
    var select = document.getElementById('lang-select');
    if (!select) return;
    LANGS.forEach(function (l) {
      var opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.flag + '  ' + l.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () { apply(select.value); });
  }

  /* ---------- nav ---------- */

  function nav() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('nav');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (!('IntersectionObserver' in window) || !sections.length) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- scroll reveal ---------- */

  function reveal() {
    var targets = document.querySelectorAll('.section .wrap > *, .hero-inner > *');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- newsletter ---------- */

  function signup() {
    var form = document.getElementById('signup');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('signup-email');
      var value = input && input.value ? input.value.trim() : '';
      if (!value) return;
      // No backend on a static host: hand the address to the visitor's mail client.
      var body = encodeURIComponent('Sign me up for HXI drops and the free stem pack.\nEmail: ' + value);
      location.href = 'mailto:hello@hximusic.com?subject=' +
        encodeURIComponent('Stem pack signup') + '&body=' + body;
      form.reset();
    });
  }

  /* ---------- init ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    buildSwitcher();
    apply(detect());
    nav();
    reveal();
    signup();
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
