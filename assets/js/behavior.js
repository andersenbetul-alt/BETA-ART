/* QBLOGG — davranış tabanlı içerik önerileri (behavior.js)
 *
 * localStorage tabanlı, sunucu yok, kişisel veri yok.
 * Yalnızca içerik tercihleri: okunan kategori ve slug'lar.
 *
 * GDPR: yalnızca teknik işlevsellik verisi, kişisel veri işlenmiyor.
 *       Ziyaretçi gizlilik sayfasında "davranış verisi nerede?" sorusunu
 *       sorarsa cevap: tarayıcının kendi localStorage'ında, yalnızca bu cihazda.
 *
 * API:  window.QB_BEH.track(slug, category) — sayfa görüntülemesini kaydet
 *       window.QB_BEH.suggest(posts, currentSlug, limit) — öneri listesi
 *       window.QB_BEH.topCat()  — en çok okunan kategori
 *       window.QB_BEH.recoPlan() — önerilen hizmet paketi (p1/p2/p3)
 *       window.QB_BEH.eventCount() — toplam kayıtlı event sayısı
 *       window.QB_BEH.clear() — tüm davranış verisini sil
 */
(function () {
  'use strict';

  var LS_KEY  = 'qb_beh';   /* localStorage anahtarı */
  var MAX_EV  = 60;          /* en fazla event sayısı (rotasyon) */
  var DECAY   = 0.85;        /* her geçen günde ağırlık çarpanı */
  var MIN_SUGGEST = 2;       /* öneri göstermek için minimum event */
  var MIN_PLAN    = 4;       /* paket önerisi için minimum event */

  /* ---------- kalıcılık ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { events: [] };
    } catch (e) { return { events: [] }; }
  }
  function save(d) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) { /* yoksay */ }
  }

  /* ---------- izleme ---------- */
  function track(slug, category) {
    if (!slug && !category) return;
    var d = load();
    d.events.push({ s: slug || '', c: category || '', ts: Date.now() });
    if (d.events.length > MAX_EV) d.events = d.events.slice(-MAX_EV);
    save(d);
  }

  /* ---------- puanlama ---------- */
  /* Kategorileri gün bazlı azalma ile ağırlıklı puana göre döndürür. */
  function scores() {
    var d = load(), now = Date.now(), s = {};
    d.events.forEach(function (e) {
      if (!e.c) return;
      var days = (now - e.ts) / 86400000;
      s[e.c] = (s[e.c] || 0) + Math.pow(DECAY, days);
    });
    return s;
  }

  function topCat() {
    var s = scores(), best = null, bv = 0;
    Object.keys(s).forEach(function (c) {
      if (s[c] > bv) { bv = s[c]; best = c; }
    });
    return best;
  }

  function eventCount() { return load().events.length; }

  /* ---------- öneri ---------- */
  function suggest(posts, currentSlug, limit) {
    var d = load(), read = {}, s = scores(), top = topCat();
    d.events.forEach(function (e) { if (e.s) read[e.s] = true; });
    if (currentSlug) read[currentSlug] = true;

    return (posts || [])
      .filter(function (p) { return !read[p.slug]; })
      .map(function (p) {
        var sc = (s[p.category] || 0) + (p.category === top ? 5 : 0);
        return { post: p, score: sc };
      })
      .sort(function (a, b) {
        return b.score !== a.score ? b.score - a.score
          : new Date(b.post.date) - new Date(a.post.date);
      })
      .slice(0, limit || 3)
      .map(function (x) { return x.post; });
  }

  /* ---------- paket önerisi ---------- */
  /* Kategori → hizmet paketi eşlemesi. */
  function recoPlan() {
    var top = topCat();
    var map = { business: 'p3', safety: 'p1', money: 'p2', jobs: 'p2', ai: 'p2',
                seo: 'p2', marketing: 'p2', hr: 'p3', guide: 'p1', newsletter: 'p2' };
    return map[top] || 'p2';
  }

  /* ---------- yardımcılar ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* i18n sözlüğünden anahtar — mevcut sayfa diline göre. */
  function t(key) {
    var lang = document.documentElement.lang || 'en';
    var i18n = window.QB_I18N || {};
    var d = i18n[lang] || {};
    return d[key] != null ? d[key] : ((i18n['en'] || {})[key] || key);
  }

  /* Yazı kartı: mevcut `.posts` ızgarasıyla uyumlu sade kart HTML'i. */
  function miniCard(post) {
    var lang = document.documentElement.lang || 'en';
    var title   = (post.t && (post.t[lang] || post.t['en'])) || post.slug;
    var excerpt = (post.e && (post.e[lang] || post.e['en'])) || '';
    var url = 'post.html?slug=' + encodeURIComponent(post.slug) + '&lang=' + encodeURIComponent(lang);
    return '<article class="post-card">' +
      '<div class="post-card__body">' +
      '<p class="post-card__title"><a href="' + esc(url) + '">' + esc(title) + '</a></p>' +
      '<p class="post-card__excerpt muted" style="font-size:var(--fs-xs)">' +
        esc(excerpt.slice(0, 110)) + (excerpt.length > 110 ? '…' : '') +
      '</p>' +
      '</div></article>';
  }

  /* ---------- sayfa: yazı ---------- */
  /* Yazı okunduktan sonra davranış widget'ını #article sonuna ekler. */
  function injectPostWidget() {
    var article = document.getElementById('article');
    /* #article yoksa veya içinde h1 yoksa yazı sayfasında değiliz */
    if (!article || !article.querySelector('h1')) return;

    var slug  = new URLSearchParams(window.location.search).get('slug');
    var posts = window.QB_POSTS || [];
    var post  = posts.filter(function (p) { return p.slug === slug; })[0];
    if (!post) return;

    /* Görüntülemeyi kaydet — bir oturumda her slug için bir kez */
    var sessKey = 'qb_beh_seen_' + slug;
    try {
      if (!sessionStorage.getItem(sessKey)) {
        track(slug, post.category);
        sessionStorage.setItem(sessKey, '1');
      }
    } catch (e) { track(slug, post.category); }

    /* Yeterli veri yoksa widget gösterme */
    if (eventCount() < MIN_SUGGEST) return;

    var picks = suggest(posts, slug, 3);
    if (!picks.length) return;

    /* Önceki widget'ı kaldır (dil değişimi yeniden çizer) */
    var old = document.getElementById('beh-widget');
    if (old) old.remove();

    var html = '<section id="beh-widget" class="reveal" style="margin-top:52px">' +
      '<h2>' + esc(t('beh.nextRead')) + '</h2>' +
      '<div class="posts">' + picks.map(miniCard).join('') + '</div>';

    /* Paket önerisi: yeterli veri + geçerli payLink varsa */
    var cfg    = window.QB_CONFIG || {};
    var plan   = recoPlan();
    var payUrl = (cfg.payLinks || {})[plan];
    if (payUrl && eventCount() >= MIN_PLAN) {
      var planName = t(plan + '.n');
      html += '<aside class="post-cta reveal" style="margin-top:32px">' +
        '<h3>' + esc(t('beh.recoPlan')) + '</h3>' +
        '<p class="muted">' + esc(planName) + ' — ' + esc(t(plan + '.d')) + '</p>' +
        '<div class="post-cta-actions">' +
        '<a class="btn btn--primary" href="' + esc(payUrl) + '" rel="noopener">' +
          esc(t('pay.card')) + '</a>' +
        '<a class="btn btn--ghost" href="index.html#packages">' +
          esc(t('cta2.alt')) + '</a>' +
        '</div></aside>';
    }

    html += '</section>';
    article.insertAdjacentHTML('beforeend', html);
  }

  /* ---------- sayfa: blog ---------- */
  /* Ziyaretçinin en çok okuduğu kategoriye yönlendiren ipucu. */
  function injectBlogHint() {
    var list = document.getElementById('postList');
    if (!list || eventCount() < 3) return;

    var top = topCat();
    if (!top) return;

    var lang     = document.documentElement.lang || 'en';
    var catLabel = t('cat.' + top);
    var url      = 'blog.html?cat=' + encodeURIComponent(top) + '&lang=' + encodeURIComponent(lang);

    var old = document.getElementById('beh-hint');
    if (old) old.remove();

    var hint = document.createElement('p');
    hint.id = 'beh-hint';
    hint.style.cssText = 'margin-bottom:16px;font-size:var(--fs-xs);color:var(--text-muted)';
    hint.innerHTML = esc(t('beh.contReading')) +
      ' <a href="' + esc(url) + '">' + esc(catLabel) + '</a>';
    list.parentNode.insertBefore(hint, list);
  }

  /* ---------- başlatma ---------- */
  function init() {
    injectPostWidget();
    injectBlogHint();
  }

  /* app.js → applyLang() → renderAll() → dispatches qb:lang
     Bu event yeniden dil/sayfa oluşturulduktan sonra gelir. */
  document.addEventListener('qb:lang', init);

  /* ---------- genel API ---------- */
  function clear() { try { localStorage.removeItem(LS_KEY); } catch (e) { /* yoksay */ } }

  window.QB_BEH = {
    track: track,
    suggest: suggest,
    topCat: topCat,
    recoPlan: recoPlan,
    eventCount: eventCount,
    clear: clear
  };
})();
