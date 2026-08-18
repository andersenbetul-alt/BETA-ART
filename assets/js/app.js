/* QBLOGG — uygulama mantığı: dil, tema, blog listesi ve yazı sayfası. */
(function () {
  'use strict';

  var LANGS = window.QB_LANGS || [];
  var DICT = window.QB_I18N || {};
  var POSTS = window.QB_POSTS || [];
  var FALLBACK = 'en';
  var LS_LANG = 'qb_lang';
  var LS_THEME = 'qb_theme';

  var ACCENTS = {
    1: ['#4b3cf7', '#00b3a4'], 2: ['#f7576c', '#ff9a44'], 3: ['#00a2ff', '#7b5cff'],
    4: ['#0fb36b', '#7ed321'], 5: ['#ff7a45', '#f7576c'], 6: ['#7b5cff', '#00b3a4']
  };

  /* ---------- yardımcılar ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /* ---------- dil ---------- */
  function langInfo(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return null;
  }
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(LS_LANG); } catch (e) { /* gizli mod */ }
    var fromUrl = param('lang');
    var candidate = fromUrl || saved;
    if (candidate && langInfo(candidate)) return candidate;
    var nav = (navigator.languages || [navigator.language || '']).map(function (l) {
      return String(l).toLowerCase().split('-')[0];
    });
    for (var i = 0; i < nav.length; i++) {
      var c = nav[i] === 'nb' || nav[i] === 'nn' ? 'no' : nav[i];
      if (langInfo(c)) return c;
    }
    return 'tr';
  }
  var currentLang = detectLang();

  function t(key) {
    var d = DICT[currentLang] || {};
    if (d[key] != null) return d[key];
    var f = DICT[FALLBACK] || {};
    return f[key] != null ? f[key] : key;
  }
  function pick(map) {
    if (!map) return '';
    return map[currentLang] != null ? map[currentLang] : (map[FALLBACK] || '');
  }

  function applyLang(code, persist) {
    if (!langInfo(code)) return;
    currentLang = code;
    var info = langInfo(code);
    document.documentElement.lang = code;
    document.documentElement.dir = info.dir;
    if (persist !== false) { try { localStorage.setItem(LS_LANG, code); } catch (e) { /* yoksay */ } }

    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });

    var titleEl = $('title[data-i18n-title]');
    if (titleEl) document.title = t(titleEl.getAttribute('data-i18n-title'));
    var desc = $('meta[name="description"]');
    if (desc && desc.hasAttribute('data-i18n-content')) desc.setAttribute('content', t(desc.getAttribute('data-i18n-content')));

    var btnLabel = $('#langLabel');
    if (btnLabel) btnLabel.textContent = info.native;
    $$('#langMenu button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.lang === code));
    });

    renderAll();
    document.dispatchEvent(new CustomEvent('qb:lang', { detail: { lang: code } }));
  }

  /* ---------- tema ---------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) { /* yoksay */ }
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('#themeBtn');
    if (btn) {
      var paint = function () { btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾'; };
      paint();
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(LS_THEME, next); } catch (e) { /* yoksay */ }
        paint();
      });
    }
  }

  /* ---------- dil menüsü ---------- */
  function initLangMenu() {
    var menu = $('#langMenu');
    var btn = $('#langBtn');
    if (!menu || !btn) return;
    menu.innerHTML = LANGS.map(function (l) {
      return '<button type="button" role="option" data-lang="' + l.code + '" aria-selected="false">' +
             '<span>' + esc(l.native) + '</span><small>' + esc(l.code) + '</small></button>';
    }).join('');
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lang]');
      if (!b) return;
      applyLang(b.dataset.lang);
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
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
      if (e.key === 'Escape') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- blog kartları ---------- */
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(currentLang, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { return iso; }
  }
  function cardHTML(p) {
    var c = ACCENTS[p.accent] || ACCENTS[1];
    return '<a class="card post-card reveal" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<div class="post-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + p.icon + '</div>' +
      '<div class="post-body">' +
        '<div class="post-meta"><span class="tag">' + esc(t('cat.' + p.category)) + '</span>' +
        '<span>' + esc(fmtDate(p.date)) + '</span><span>· ' + p.read + ' ' + esc(t('posts.min')) + '</span></div>' +
        '<h3>' + esc(pick(p.t)) + '</h3><p>' + esc(pick(p.e)) + '</p>' +
        '<span class="read-more">' + esc(t('posts.readMore')) + ' →</span>' +
      '</div></a>';
  }
  function sorted() {
    return POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  /* ---------- sayfa: ana sayfa ---------- */
  function renderHome() {
    var box = $('#latestPosts');
    if (!box) return;
    box.innerHTML = sorted().slice(0, 3).map(cardHTML).join('');
  }

  /* ---------- sayfa: blog ---------- */
  var blogState = { q: '', cat: 'all' };
  function renderBlog() {
    var box = $('#postList');
    if (!box) return;
    var chips = $('#catChips');
    if (chips) {
      var cats = ['all'].concat(POSTS.map(function (p) { return p.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      chips.innerHTML = cats.map(function (c) {
        return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (blogState.cat === c) + '">' +
               esc(c === 'all' ? t('posts.all') : t('cat.' + c)) + '</button>';
      }).join('');
    }
    var q = blogState.q.toLowerCase().trim();
    var list = sorted().filter(function (p) {
      if (blogState.cat !== 'all' && p.category !== blogState.cat) return false;
      if (!q) return true;
      return (pick(p.t) + ' ' + pick(p.e) + ' ' + (pick(p.b) || []).join(' ')).toLowerCase().indexOf(q) > -1;
    });
    box.innerHTML = list.length ? list.map(cardHTML).join('')
      : '<p class="empty">' + esc(t('posts.empty')) + '</p>';
    revealInit();
  }
  function initBlog() {
    var box = $('#postList');
    if (!box) return;
    var input = $('#searchInput');
    if (input) input.addEventListener('input', function () { blogState.q = this.value; renderBlog(); });
    var chips = $('#catChips');
    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (!b) return;
      blogState.cat = b.dataset.cat;
      renderBlog();
    });
    var preset = param('cat');
    if (preset) blogState.cat = preset;
  }

  /* ---------- sayfa: yazı ---------- */
  function renderPost() {
    var host = $('#article');
    if (!host) return;
    var slug = param('slug');
    var post = POSTS.filter(function (p) { return p.slug === slug; })[0];
    if (!post) {
      host.innerHTML = '<p class="empty">' + esc(t('posts.notFound')) + '</p>' +
        '<p class="center"><a class="btn btn--ghost" href="blog.html">' + esc(t('posts.back')) + '</a></p>';
      return;
    }
    var c = ACCENTS[post.accent] || ACCENTS[1];
    var body = (pick(post.b) || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var related = sorted().filter(function (p) { return p.slug !== post.slug && p.category === post.category; }).slice(0, 2);
    if (related.length < 2) {
      related = related.concat(sorted().filter(function (p) {
        return p.slug !== post.slug && related.indexOf(p) === -1;
      }).slice(0, 2 - related.length));
    }
    document.title = pick(post.t) + ' — QBLOGG';
    host.innerHTML =
      '<div class="article-head">' +
        '<div class="post-meta" style="justify-content:center"><span class="tag">' + esc(t('cat.' + post.category)) + '</span>' +
        '<span>' + esc(t('posts.published')) + ': ' + esc(fmtDate(post.date)) + '</span>' +
        '<span>· ' + post.read + ' ' + esc(t('posts.min')) + '</span></div>' +
        '<h1>' + esc(pick(post.t)) + '</h1>' +
        '<p class="muted">' + esc(pick(post.e)) + '</p>' +
      '</div>' +
      '<div class="article-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + post.icon + '</div>' +
      '<div class="article-body">' + body + '</div>' +
      '<div class="article-foot">' +
        '<a class="btn btn--ghost" href="blog.html">← ' + esc(t('posts.back')) + '</a>' +
        '<button type="button" class="btn btn--ghost" id="shareBtn">' + esc(t('posts.share')) + '</button>' +
      '</div>' +
      '<h2 style="margin-top:52px">' + esc(t('posts.related')) + '</h2>' +
      '<div class="posts">' + related.map(cardHTML).join('') + '</div>';

    var share = $('#shareBtn');
    if (share) share.addEventListener('click', function () {
      var url = window.location.href;
      var done = function () { toast(t('posts.copied')); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('URL', url); });
      } else { window.prompt('URL', url); }
    });
    revealInit();
  }

  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* ---------- bülten formu ---------- */
  function initForm() {
    var form = $('#subscribeForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#subscribeEmail');
      var msg = $('#formMsg');
      var val = (input.value || '').trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      msg.textContent = ok ? t('cta.success') : t('cta.invalid');
      if (ok) {
        // Statik site: kayıt tarayıcıda tutulur. Gerçek listeye bağlarken
        // buradaki bloğu e-posta servisinizin API çağrısıyla değiştirin.
        try {
          var list = JSON.parse(localStorage.getItem('qb_subs') || '[]');
          if (list.indexOf(val) === -1) list.push(val);
          localStorage.setItem('qb_subs', JSON.stringify(list));
        } catch (err) { /* yoksay */ }
        form.reset();
      }
    });
  }

  /* ---------- küçük şeyler ---------- */
  function initNav() {
    var toggle = $('#menuToggle');
    var links = $('#navLinks');
    if (toggle && links) toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    var top = $('#toTop');
    if (top) {
      top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      window.addEventListener('scroll', function () {
        top.classList.toggle('show', window.scrollY > 600);
      }, { passive: true });
    }
  }
  function revealInit() {
    var items = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function renderAll() { renderHome(); renderBlog(); renderPost(); }
  window.QB_RENDER = renderAll; // tek dosyalık önizleme için dışa açıldı

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initLangMenu();
    initNav();
    initBlog();
    initForm();
    applyLang(currentLang, false);
    revealInit();
  });
})();
