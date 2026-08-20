/* =============================================================================
   NAVIAR — translation layer
   Loads assets/i18n/<code>.json and applies it to the DOM.

   Markup contract:
     data-i18n="hero.title"                 -> textContent
     data-i18n-attr="placeholder:booking.name;aria-label:nav.menu"
     data-i18n-list="hero.card"             -> rebuilds <li> children from array

   Anything repeated (services, prices, FAQ) is rendered by app.js from the
   same dictionary, and re-rendered on the naviar:lang event.
   ========================================================================== */
(function (global) {
  'use strict';

  var CFG = global.NAVIAR_CONFIG;
  var STORE_KEY = 'naviar.lang';

  var I18n = {
    lang: CFG.defaultLang,
    dict: {},
    ready: false
  };

  function supported(code) {
    if (!code) return null;
    code = String(code).toLowerCase();
    var exact = CFG.languages.filter(function (l) { return l.code === code; })[0];
    if (exact) return exact.code;
    var base = code.split('-')[0];
    var loose = CFG.languages.filter(function (l) { return l.code === base; })[0];
    return loose ? loose.code : null;
  }

  /* URL ?lang= wins, then a previous choice, then the browser, then default. */
  function detect() {
    var qs = new URLSearchParams(global.location.search);
    var fromUrl = supported(qs.get('lang'));
    if (fromUrl) return fromUrl;

    var stored;
    try { stored = supported(localStorage.getItem(STORE_KEY)); } catch (e) { stored = null; }
    if (stored) return stored;

    var navLangs = global.navigator.languages || [global.navigator.language];
    for (var i = 0; i < navLangs.length; i++) {
      var hit = supported(navLangs[i]);
      if (hit) return hit;
    }
    return CFG.defaultLang;
  }

  function meta(code) {
    return CFG.languages.filter(function (l) { return l.code === code; })[0] || CFG.languages[0];
  }

  /* Resolve "a.b.c" against the loaded dictionary. */
  I18n.get = function (path) {
    var node = I18n.dict;
    var parts = String(path).split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  };

  /* Translate with optional {placeholder} substitution. */
  I18n.t = function (path, vars) {
    var value = I18n.get(path);
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') return value;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : m;
    });
  };

  function applyDom(root) {
    root = root || document;

    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = I18n.get(el.getAttribute('data-i18n'));
      if (typeof value === 'string') el.textContent = value;
    });

    root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var value = I18n.get(bits[1].trim());
        if (typeof value === 'string') el.setAttribute(bits[0].trim(), value);
      });
    });

    root.querySelectorAll('[data-i18n-list]').forEach(function (el) {
      var items = I18n.get(el.getAttribute('data-i18n-list'));
      if (!Array.isArray(items)) return;
      var tpl = el.getAttribute('data-i18n-tpl') || 'li';
      el.innerHTML = '';
      items.forEach(function (text) {
        var node = document.createElement(tpl);
        node.textContent = text;
        el.appendChild(node);
      });
    });
  }

  function applyDocument() {
    var m = meta(I18n.lang);
    var html = document.documentElement;
    html.setAttribute('lang', I18n.lang);
    html.setAttribute('dir', m.dir);

    document.title = I18n.t('meta.title');
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', I18n.t('meta.description'));

    applyDom(document);
  }

  I18n.load = function (code) {
    code = supported(code) || CFG.defaultLang;
    return fetch('assets/i18n/' + code + '.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (dict) {
        I18n.dict = dict;
        I18n.lang = code;
        I18n.ready = true;
        try { localStorage.setItem(STORE_KEY, code); } catch (e) { /* private mode */ }
        applyDocument();
        document.dispatchEvent(new CustomEvent('naviar:lang', { detail: { lang: code } }));
        return dict;
      });
  };

  I18n.set = function (code) {
    if (code === I18n.lang) return Promise.resolve(I18n.dict);
    return I18n.load(code).then(function (d) {
      buildSwitcher();
      return d;
    });
  };

  /* ----------------------------------------------------------- switcher UI */
  function buildSwitcher() {
    document.querySelectorAll('[data-lang-switcher]').forEach(function (root) {
      var current = meta(I18n.lang);
      root.innerHTML = '';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn';
      btn.setAttribute('aria-haspopup', 'listbox');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', I18n.t('nav.language'));
      btn.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>' +
        '<path d="M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3z"/></svg>' +
        '<span>' + current.label + '</span>';

      var menu = document.createElement('ul');
      menu.className = 'lang-menu';
      menu.setAttribute('role', 'listbox');

      CFG.languages.forEach(function (l) {
        var li = document.createElement('li');
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.setAttribute('role', 'option');
        opt.setAttribute('lang', l.code);
        opt.setAttribute('aria-current', String(l.code === I18n.lang));
        opt.innerHTML = '<span>' + l.label + '</span>' +
                        '<span class="lang-native">' + l.native + '</span>';
        opt.addEventListener('click', function () {
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          I18n.set(l.code);
        });
        li.appendChild(opt);
        menu.appendChild(li);
      });

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      root.appendChild(btn);
      root.appendChild(menu);
    });
  }

  I18n.init = function () {
    return I18n.load(detect())
      .then(function (dict) { buildSwitcher(); return dict; })
      .catch(function (err) {
        /* Most common cause: the page was opened from the filesystem, so the
           browser blocks fetch(). Say so plainly instead of showing a blank
           page. */
        console.error('[naviar] could not load translations:', err);
        var warn = document.createElement('p');
        warn.style.cssText =
          'margin:0;padding:14px 24px;background:#FBF3E1;color:#8a5a00;' +
          'font:14px/1.5 Inter,system-ui,sans-serif;text-align:center';
        warn.textContent =
          'Kunne ikke laste språkfilene / Could not load the language files. ' +
          'Serve the site over HTTP (for example: python3 -m http.server) rather than opening the file directly.';
        document.body.insertBefore(warn, document.body.firstChild);
      });
  };

  I18n.applyDom = applyDom;
  global.NaviarI18n = I18n;
})(window);
