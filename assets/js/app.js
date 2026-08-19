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
    // A pre-rendered page states its own language and that wins over anything remembered:
    // arriving on /tr/ and being switched to English by an old preference is a bug.
    var pinned = document.documentElement.dataset.pageLang;
    var list = [pinned, fromUrl, saved].concat(navigator.languages || [navigator.language]);
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
    var placeholder = dict.form_email || fallback.form_email;
    if (email && placeholder) email.setAttribute('placeholder', placeholder);

    var select = document.getElementById('lang-select');
    if (select) select.value = code;

    try { localStorage.setItem(STORE_KEY, code); } catch (e) { /* ignore */ }

    // Mağaza kartları ve çıkış listesi JS ile çizildiği için dil değişince yenilenmeli.
    if (typeof shop === 'function') run(shop);
    if (typeof renderReleases === 'function') run(renderReleases);
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
    select.addEventListener('change', function () {
      // On a pre-rendered page each language is its own URL — go there, so the address bar
      // and what the visitor shares stay truthful.
      if (document.documentElement.dataset.pageLang) {
        location.href = '../' + select.value + '/';
        return;
      }
      apply(select.value);
    });
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
    function close() {
      if (!menu.classList.contains('open')) return;
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });
    // Escape is the expected way out of an open menu, and it returns focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        close();
        burger.focus();
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
    if (!('IntersectionObserver' in window)) return;
    var targets = [].slice.call(document.querySelectorAll('.section .wrap > *, .hero-inner > *'));
    var pending = targets.length;

    function show(el) {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      pending--;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });

    // Safety net: a fast scroll can move an element out of view before the observer
    // callback runs, which would leave it stuck at opacity 0. Sweep on scroll instead.
    var ticking = false;
    function sweep() {
      ticking = false;
      var limit = window.innerHeight;
      targets.forEach(function (el) {
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < limit) show(el);
      });
      if (pending <= 0) {
        window.removeEventListener('scroll', queue);
        window.removeEventListener('resize', queue);
      }
    }
    function queue() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
  }

  /* ---------- video ---------- */

  function videos() {
    document.querySelectorAll('.yt-facade').forEach(function (button) {
      button.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        // nocookie host, and only ever requested once the visitor asks for the video
        frame.src = 'https://www.youtube-nocookie.com/embed/' + button.dataset.yt +
          '?autoplay=1&rel=0';
        frame.title = button.dataset.title || 'YouTube video';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        frame.allowFullscreen = true;
        frame.setAttribute('frameborder', '0');
        button.parentNode.replaceChild(frame, button);
        frame.focus();
      });
    });
  }

  /* ---------- spotify ---------- */

  function spotify() {
    document.querySelectorAll('.sp-facade').forEach(function (button) {
      button.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        // Only requested once the visitor presses play — same rule as the video facades.
        frame.src = 'https://open.spotify.com/embed/' + button.dataset.sp +
          '?utm_source=generator&theme=0';
        frame.title = button.dataset.title || 'Spotify';
        frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        frame.loading = 'lazy';
        frame.className = 'embed';
        frame.height = '152';
        button.parentNode.replaceChild(frame, button);
        frame.focus();
      });
    });
  }

  /* ---------- release list, synced from spotify ---------- */

  var spotifyData = null;

  function renderReleases() {
    var box = document.getElementById('releases');
    var list = document.getElementById('releases-list');
    if (!box || !list || !spotifyData || !spotifyData.releases || !spotifyData.releases.length) return;

    var lang = document.documentElement.lang || 'en';
    // A release date can be a year, a month or a full date — format only what Spotify gave us.
    var fmt = function (value) {
      var parts = value.split('-');
      var date = new Date(value.length === 4 ? value + '-01-01' : value);
      if (isNaN(date)) return value;
      var options = parts.length === 1 ? { year: 'numeric' }
        : parts.length === 2 ? { year: 'numeric', month: 'long' }
        : { year: 'numeric', month: 'long', day: 'numeric' };
      try { return new Intl.DateTimeFormat(lang, options).format(date); }
      catch (e) { return value; }
    };

    list.textContent = '';
    spotifyData.releases.forEach(function (release) {
      var li = document.createElement('li');
      var left = document.createElement('div');
      var name = document.createElement('b');
      name.textContent = release.name;
      var meta = document.createElement('span');
      meta.textContent = fmt(release.releaseDate) + ' · ' + release.type +
        (release.tracks > 1 ? ' · ' + release.tracks : '');
      left.appendChild(name);
      left.appendChild(meta);

      var link = document.createElement('a');
      link.href = release.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Spotify →';

      li.appendChild(left);
      li.appendChild(link);
      list.appendChild(li);
    });

    var synced = document.getElementById('releases-synced');
    if (synced) synced.textContent = 'Spotify · ' + spotifyData.syncedAt;
    box.hidden = false;
  }

  function releases() {
    // Same-origin file written by the weekly sync. Absent until the sync has credentials —
    // the section simply stays hidden, and the hand-written cards above carry the page.
    fetch('assets/data/spotify.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        spotifyData = data;
        renderReleases();
      })
      .catch(function () { /* offline, or opened straight from the filesystem */ });
  }

  /* ---------- shop ---------- */

  function shop() {
    var grid = document.getElementById('shop-grid');
    var items = window.HXI_SHOP;
    if (!grid || !items || !items.length) return;

    var dict = T[document.documentElement.lang] || T.en;
    var t = function (key) { return (dict && dict[key]) || T.en[key] || ''; };

    grid.textContent = '';
    items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'card product';

      var tag = document.createElement('p');
      tag.className = 'tag';
      tag.textContent = t(item.kind === 'digital' ? 'shop_digital' : 'shop_physical');
      card.appendChild(tag);

      var name = document.createElement('h3');
      name.className = 'h3 product-name';
      name.textContent = item.name;   // ürün adları çevrilmez
      card.appendChild(name);

      var desc = document.createElement('p');
      desc.className = 'news-text';
      desc.textContent = t(item.desc);
      card.appendChild(desc);

      var price = document.createElement('p');
      price.className = 'meta';
      price.textContent = item.free ? t('shop_free')
        : item.price ? item.price.amount + ' ' + item.price.currency
        : t('shop_soon');
      card.appendChild(price);

      var links = document.createElement('p');
      links.className = 'card-links';
      if (item.checkout) {
        // Barındırılmış ödeme sayfası: kart bilgisi bu siteye hiç uğramaz.
        links.appendChild(link(item.checkout, t('shop_buy'), true));
      } else {
        links.appendChild(link('#drop', t(item.signup ? 'shop_get' : 'shop_notify'), false));
      }
      card.appendChild(links);
      grid.appendChild(card);
    });

    function link(href, text, external) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      if (external) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      return a;
    }
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

  function run(step) {
    // one failing enhancement must not take the rest of the page down with it
    try { step(); } catch (e) { if (window.console) console.error(e); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    run(buildSwitcher);
    run(function () { apply(detect()); });
    run(nav);
    run(videos);
    run(spotify);
    run(releases);
    run(shop);
    run(signup);
    run(reveal);
    run(function () {
      var year = document.getElementById('year');
      if (year) year.textContent = String(new Date().getFullYear());
    });
  });
})();
