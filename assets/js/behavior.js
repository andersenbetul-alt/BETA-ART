/* QBLOGG — müşteri davranış motoru.
 * Ziyaretçinin okuma geçmişini ve niyet sinyallerini izler; aynı ziyaretçiye
 * ilgili içerik önerir, CTA tıklamalarını kaydeder.
 * Tüm veri localStorage'da tutulur — sunucuya hiçbir şey gönderilmez.
 * Kaldırma: localStorage.removeItem('qb_beh') veya window.QB_BEH.reset()
 */
(function () {
  'use strict';

  var KEY      = 'qb_beh';
  var MAX_READS = 50;
  var MAX_SIG  = 100;
  var DECAY_DAYS = 30;

  /* ---------- veri ---------- */
  function fresh() { return { v: 1, reads: [], signals: [], scores: {} }; }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      var d = JSON.parse(raw);
      return (d && d.v === 1) ? d : fresh();
    } catch (e) { return fresh(); }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* dolu/gizli */ }
  }

  /* ---------- puanlama ---------- */
  function rebuildScores(reads) {
    var now = Date.now();
    var s = {};
    reads.forEach(function (r) {
      var age = (now - r.ts) / 86400000; /* gün */
      var w = Math.max(0, 1 - age / DECAY_DAYS);
      s[r.cat] = (s[r.cat] || 0) + w;
    });
    return s;
  }

  function topCat(scores) {
    var best = null, bestV = -1;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > bestV) { best = k; bestV = scores[k]; }
    });
    return best;
  }

  function readSet(reads) {
    var s = {};
    reads.forEach(function (r) { s[r.slug] = true; });
    return s;
  }

  /* ---------- okuma kaydı ---------- */
  function recordRead(state, slug, cat) {
    var ex = null;
    state.reads.forEach(function (r) { if (r.slug === slug) ex = r; });
    if (ex) {
      ex.ts = Date.now();
      ex.views = (ex.views || 1) + 1;
    } else {
      state.reads.push({ slug: slug, cat: cat, ts: Date.now(), views: 1 });
      if (state.reads.length > MAX_READS) state.reads.splice(0, state.reads.length - MAX_READS);
    }
    state.scores = rebuildScores(state.reads);
  }

  /* ---------- sinyal kaydı ---------- */
  function recordSig(state, type, data) {
    state.signals.push({ type: type, ts: Date.now(), data: data || {} });
    if (state.signals.length > MAX_SIG) state.signals.splice(0, state.signals.length - MAX_SIG);
  }

  /* ---------- öneri hesaplama ---------- */
  function recommend(state, excludeSlug, catHint, posts, n) {
    var done = readSet(state.reads);
    var top  = topCat(state.scores);
    return posts
      .filter(function (p) { return p.slug !== excludeSlug && !done[p.slug]; })
      .map(function (p) {
        var sc = 0;
        if (catHint && p.category === catHint) sc += 3;
        if (top && p.category === top && p.category !== catHint) sc += 1.5;
        var age = (Date.now() - new Date(p.date).getTime()) / 86400000;
        if (age < 90) sc += 1;
        return { p: p, sc: sc };
      })
      .sort(function (a, b) { return b.sc - a.sc; })
      .slice(0, n)
      .map(function (x) { return x.p; });
  }

  /* ---------- yardımcılar ---------- */
  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pick(map, lang) {
    if (!map) return '';
    return map[lang] != null ? map[lang] : (map['en'] || '');
  }

  function getLang() {
    try { return localStorage.getItem('qb_lang') || 'tr'; } catch (e) { return 'tr'; }
  }

  function getI18n(lang) {
    try {
      var d = window.QB_I18N || {};
      return d[lang] || d['en'] || {};
    } catch (e) { return {}; }
  }

  /* ---------- widget: yazı önerisi (post.html) ---------- */
  function renderPostRec(state, posts, lang, i18n) {
    var slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) return;

    var cur = null;
    posts.forEach(function (p) { if (p.slug === slug) cur = p; });
    if (!cur) return;

    recordRead(state, slug, cur.category);
    save(state);

    var recs = recommend(state, slug, cur.category, posts, 3);
    if (!recs.length) return;

    var slot = document.getElementById('postRec');
    if (!slot) return;

    var title = i18n['beh.recTitle'] || 'You might also like';

    var html = '<section class="post-rec reveal">' +
      '<div class="wrap"><h2 class="post-rec__title">' + esc(title) + '</h2>' +
      '<div class="post-rec__grid">';

    recs.forEach(function (p) {
      var href = 'post.html?slug=' + encodeURIComponent(p.slug) +
        (lang !== 'tr' ? '&lang=' + encodeURIComponent(lang) : '');
      var catLabel = i18n['cat.' + p.category] || p.category;
      html += '<a class="post-rec__card" href="' + href + '">' +
        '<span class="post-rec__cat">' + esc(catLabel) + '</span>' +
        '<span class="post-rec__t">' + esc(pick(p.t, lang)) + '</span>' +
        '<span class="post-rec__e">' + esc(pick(p.e, lang)) + '</span>' +
        '</a>';
    });

    html += '</div></div></section>';
    slot.innerHTML = html;
  }

  /* ---------- widget: kaldığın yerden devam et (blog.html) ---------- */
  function renderContinue(state, posts, lang, i18n) {
    if (!state.reads.length) return;
    var slot = document.getElementById('behContinue');
    if (!slot) return;

    /* En son okunan yazının kategorisinde okunmamış bir öneri bul */
    var lastRead = state.reads[state.reads.length - 1];
    var recs = recommend(state, null, lastRead.cat, posts, 1);
    if (!recs.length) return;

    var p = recs[0];
    var href = 'post.html?slug=' + encodeURIComponent(p.slug) +
      (lang !== 'tr' ? '&lang=' + encodeURIComponent(lang) : '');
    var label = i18n['beh.cont'] || 'Continue reading';

    slot.innerHTML = '<a class="beh-chip" href="' + href + '">' +
      '<span class="beh-chip__label">' + esc(label) + '</span>' +
      '<span class="beh-chip__title">' + esc(pick(p.t, lang)) + '</span>' +
      '<span class="beh-chip__arrow" aria-hidden="true">→</span>' +
      '</a>';
    slot.hidden = false;
  }

  /* ---------- sonraki adım: bölüm görünürlük gözlemcisi ---------- */
  function observeSections(state) {
    if (!window.IntersectionObserver) return;
    var targets = ['#packages', '#services', '#newsletter', '#postList', '.plan--featured'];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id || e.target.className.split(' ')[0];
        recordSig(state, 'section_view', { id: id });
        save(state);
      });
    }, { threshold: 0.4 });
    targets.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) io.observe(el);
    });
  }

  /* ---------- sonraki adım: niyet puanı ---------- */
  function computeNextStep(state) {
    var sigs  = state.signals || [];
    var reads = state.reads   || [];

    var briefScore = 0, newsScore = 0;
    sigs.forEach(function (s) {
      if (s.type === 'cta_click')   briefScore += 3;
      if (s.type === 'pkg_hover')   briefScore += 1;
      if (s.type === 'nudge_click' && s.data && s.data.step === 'brief') briefScore += 2;
      if (s.type === 'section_view') {
        if (s.data && s.data.id === 'packages')   briefScore += 0.5;
        if (s.data && s.data.id === 'newsletter')  newsScore  += 1;
      }
    });

    var blogScore = reads.length * 1.5;
    if (reads.length >= 2) newsScore += 1;

    if (briefScore >= 3)                       return 'brief';
    if (blogScore  >= 4.5 && briefScore < 2)   return 'blog';
    if (newsScore  >= 2)                       return 'news';
    return 'pkg';
  }

  /* ---------- sonraki adım: nudge bar ---------- */
  function renderNudgeBar(state, lang, i18n) {
    var SESS_KEY = 'qb_nudge';
    try { if (sessionStorage.getItem(SESS_KEY)) return; } catch (e) {}

    /* İzin verilen sayfalar: dönüştürme sayfasında ve yasal sayfalarda gereksiz */
    var page = window.location.pathname.split('/').pop();
    if (page === 'work.html' || page === 'gizlilik.html' || page === 'kosullar.html') return;

    var step = computeNextStep(state);
    var KEY_MAP  = { brief: 'beh.nextBrief', blog: 'beh.nextBlog', news: 'beh.nextNews', pkg: 'beh.nextPkg' };
    var HREF_MAP = { brief: 'work.html', blog: 'blog.html', news: '#newsletter', pkg: '#packages' };

    var label   = i18n[KEY_MAP[step]]  || step;
    var heading = i18n['beh.next']     || 'Next step';
    var href    = HREF_MAP[step];

    var bar = document.createElement('div');
    bar.id = 'behNudge';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', heading);
    bar.innerHTML =
      '<a class="beh-nudge__link" href="' + esc(href) + '">' +
        '<span class="beh-nudge__head">' + esc(heading) + '</span>' +
        '<span class="beh-nudge__cta">' + esc(label) + ' →</span>' +
      '</a>' +
      '<button class="beh-nudge__close" aria-label="Kapat" type="button">×</button>';
    document.body.appendChild(bar);

    bar.querySelector('.beh-nudge__close').addEventListener('click', function () {
      bar.classList.add('beh-nudge--out');
      try { sessionStorage.setItem(SESS_KEY, '1'); } catch (e) {}
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 320);
    });

    bar.querySelector('.beh-nudge__link').addEventListener('click', function () {
      recordSig(state, 'nudge_click', { step: step });
      save(state);
    });

    /* Kaydırma eşiğinde göster (sayfa yüksekliğinin %35'i) */
    var shown = false;
    function maybeShow() {
      if (shown) return;
      var total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0 || window.scrollY / total < 0.35) return;
      shown = true;
      bar.classList.add('beh-nudge--visible');
      window.removeEventListener('scroll', maybeShow);
    }
    window.addEventListener('scroll', maybeShow, { passive: true });
  }

  /* ---------- sinyal: CTA tıklamaları ve paket üzerine gelme ---------- */
  function hookSignals(state) {
    document.querySelectorAll('[href="work.html"]').forEach(function (el) {
      el.addEventListener('click', function () {
        recordSig(state, 'cta_click', { text: el.textContent.trim().slice(0, 40) });
        save(state);
      }, { once: true });
    });
    document.querySelectorAll('.plan').forEach(function (card, i) {
      card.addEventListener('mouseenter', function () {
        recordSig(state, 'pkg_hover', { idx: i });
        save(state);
      }, { once: true });
    });
  }

  /* ---------- ana giriş ---------- */
  function init() {
    var state = load();
    var posts = window.QB_POSTS || [];
    var lang  = getLang();
    var i18n  = getI18n(lang);
    var page  = window.location.pathname.split('/').pop();

    recordSig(state, 'page_view', { path: window.location.pathname });
    save(state);

    hookSignals(state);
    observeSections(state);
    renderNudgeBar(state, lang, i18n);

    if (page === 'post.html' || page === 'post') {
      renderPostRec(state, posts, lang, i18n);
    } else if (page === 'blog.html' || page === 'blog') {
      renderContinue(state, posts, lang, i18n);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Dışa açık API */
  window.QB_BEH = {
    track: function (type, data) {
      var s = load(); recordSig(s, type, data); save(s);
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };

})();
