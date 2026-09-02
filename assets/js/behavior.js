/* QBLOGG — müşteri davranış izleme ve kişiselleştirme
   Bağımlılık yok; app.js'den sonra yüklenir (QB_I18N, QB_POSTS erişimi için).
   localStorage anahtarı: qb_bhv2   sessionStorage: qb_bs2 */
(function () {
  'use strict';

  var KEY  = 'qb_bhv2';   /* davranış durumu */
  var SESS = 'qb_bs2';    /* oturum bayrağı — sekme kapanınca sıfırlanır */
  var DISMISSED_KEY = 'qb_bhv2_dim'; /* widget kapatıldı bayrağı */

  /* ── Durum şeması ──────────────────────────────────────────────── */
  /* {
       sessions: number,            toplam ziyaret sayısı
       lastVisit: number,           son ziyaret (ms)
       pageViews: {page: count},    hangi sayfa kaç kez açıldı
       catScores: {cat: score},     blog kategori ilgisi (hover=0, tık=2, okuma=3)
       packScores: {p1|p2|p3: sc},  paket ilgisi (hover=1, tık=5)
       sectionViews: {id: count},   bölüm görüntüleme (scroll)
       postSlugs: [slug, …],        son 10 okunan yazı
       formStarted: bool,           brief forma dokunuldu mu
       downloaded: bool             lead magnet indirildi mi
     } */

  /* ── Yardımcılar ────────────────────────────────────────────────── */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || fresh(); }
    catch (e) { return fresh(); }
  }

  function fresh() {
    return { sessions: 0, lastVisit: 0, pageViews: {}, catScores: {},
             packScores: {}, sectionViews: {}, postSlugs: [],
             formStarted: false, downloaded: false };
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* gizli mod veya dolu depo — sessizce geç */ }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Dil ve çeviri ──────────────────────────────────────────────── */
  function currentLang() {
    try { return localStorage.getItem('qb_lang') || 'en'; }
    catch (e) { return 'en'; }
  }

  /* behavior.js kendi küçük i18n tablosunu taşır; büyük anahtarlar i18n.js'te */
  function t(key) {
    var lang = currentLang();
    var dict = (window.QB_I18N && window.QB_I18N[lang]) ||
               (window.QB_I18N && window.QB_I18N['en']) || {};
    return dict[key] || key;
  }

  /* ── Oturum başlatma ────────────────────────────────────────────── */
  var isNewSession = false;
  try {
    if (!sessionStorage.getItem(SESS)) {
      sessionStorage.setItem(SESS, '1');
      isNewSession = true;
      var _s = load();
      _s.sessions += 1;
      _s.lastVisit = Date.now();
      save(_s);
    }
  } catch (e) {}

  /* ── Sayfa izleme ───────────────────────────────────────────────── */
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  (function () {
    var s = load();
    s.pageViews[page] = (s.pageViews[page] || 0) + 1;
    save(s);
  }());

  /* ── Blog yazısı izleme (post.html) ────────────────────────────── */
  if (page === 'post') {
    try {
      var params = new URLSearchParams(location.search);
      var slug   = params.get('slug');
      if (slug) {
        var posts  = window.QB_POSTS || [];
        var post   = posts.filter(function (p) { return p.slug === slug; })[0];
        if (post) {
          var s2 = load();
          s2.catScores[post.category] = (s2.catScores[post.category] || 0) + 3;
          var idx = s2.postSlugs.indexOf(slug);
          if (idx > -1) s2.postSlugs.splice(idx, 1);
          s2.postSlugs.unshift(slug);
          s2.postSlugs = s2.postSlugs.slice(0, 10);
          save(s2);
        }
      }
    } catch (e) {}
  }

  /* ── Bölüm görüntüleme (IntersectionObserver) ──────────────────── */
  function initSectionTracking() {
    if (!window.IntersectionObserver) return;
    var ids = ['services', 'packages', 'flow', 'blog', 'newsletter'];
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        var s = load();
        s.sectionViews[id] = (s.sectionViews[id] || 0) + 1;
        save(s);
        obs.unobserve(entry.target); /* sayfa başına bir kez yeter */
      });
    }, { threshold: 0.25 });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* ── Paket ilgisi izleme ────────────────────────────────────────── */
  function initPackageTracking() {
    var plans = document.querySelectorAll('.card.plan');
    plans.forEach(function (plan, i) {
      var key = 'p' + (i + 1);

      plan.addEventListener('mouseenter', function () {
        var s = load();
        s.packScores[key] = (s.packScores[key] || 0) + 1;
        save(s);
      });

      var cta = plan.querySelector('a.btn');
      if (cta) {
        cta.addEventListener('click', function () {
          var s = load();
          s.packScores[key] = (s.packScores[key] || 0) + 5; /* güçlü sinyal */
          save(s);
        });
      }
    });
  }

  /* ── Blog kategori filtresi izleme ─────────────────────────────── */
  function initCategoryTracking() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest && e.target.closest('button[data-cat]');
      if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      if (!cat || cat === 'all') return;
      var s = load();
      s.catScores[cat] = (s.catScores[cat] || 0) + 2;
      save(s);
    });
  }

  /* ── Form etkileşimi izleme ─────────────────────────────────────── */
  function initFormTracking() {
    var briefForm = document.getElementById('briefForm');
    if (briefForm) {
      briefForm.addEventListener('focusin', function () {
        var s = load();
        if (!s.formStarted) { s.formStarted = true; save(s); }
      }, { once: true });
    }

    var magnet = document.getElementById('magnetLink');
    if (magnet) {
      magnet.addEventListener('click', function () {
        var s = load();
        if (!s.downloaded) { s.downloaded = true; save(s); }
      });
    }
  }

  /* ── Öneri motoru ───────────────────────────────────────────────── */
  function topKey(obj) {
    var top = null, max = 0;
    Object.keys(obj).forEach(function (k) {
      if (obj[k] > max) { max = obj[k]; top = k; }
    });
    return top;
  }

  function getLastPost() {
    var s = load();
    if (!s.postSlugs.length) return null;
    var posts = window.QB_POSTS || [];
    return posts.filter(function (p) { return p.slug === s.postSlugs[0]; })[0] || null;
  }

  /* Öncelik: form başlatma → paket → kategori → son yazı */
  function buildRecommendation() {
    var s = load();

    if (s.formStarted) {
      return { type: 'form', href: 'work.html', label: t('bhv.form_continue') };
    }

    var topPack = topKey(s.packScores);
    if (topPack) {
      var packNames = { p1: t('p1.n'), p2: t('p2.n'), p3: t('p3.n') };
      return { type: 'pack', href: 'index.html#packages',
               label: t('bhv.see_pkg') + ' — ' + (packNames[topPack] || topPack) };
    }

    var topCat = topKey(s.catScores);
    if (topCat) {
      return { type: 'cat', href: 'blog.html',
               label: t('bhv.interest') + ': ' + t('cat.' + topCat) };
    }

    var lastPost = getLastPost();
    if (lastPost) {
      var lang = currentLang();
      var title = lastPost.t && (lastPost.t[lang] || lastPost.t['en']) || '';
      return { type: 'post',
               href: 'post.html?slug=' + encodeURIComponent(lastPost.slug),
               label: t('bhv.see_post') + (title ? ': ' + title.slice(0, 40) + (title.length > 40 ? '…' : '') : '') };
    }

    return null;
  }

  /* ── Widget ─────────────────────────────────────────────────────── */
  function isDismissed() {
    try { return !!sessionStorage.getItem(DISMISSED_KEY); }
    catch (e) { return false; }
  }

  function dismiss() {
    try { sessionStorage.setItem(DISMISSED_KEY, '1'); }
    catch (e) {}
    var w = document.getElementById('bhvWidget');
    if (w) {
      w.style.opacity = '0';
      w.style.transform = 'translateY(12px)';
      setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 280);
    }
  }

  function renderWidget() {
    var s = load();

    /* Widget yalnızca 2. ziyaretten itibaren, yalnızca bir kez oturumda */
    if (s.sessions < 2) return;
    if (isDismissed()) return;

    var rec = buildRecommendation();
    if (!rec) return;

    /* Sayfa gizliyse (kapak animasyonu) kısa bekle */
    setTimeout(function () {
      if (document.getElementById('bhvWidget')) return; /* çift render yok */

      var dir = currentLang() === 'ar' ? 'rtl' : 'ltr';

      var el = document.createElement('div');
      el.id = 'bhvWidget';
      el.setAttribute('role', 'complementary');
      el.setAttribute('aria-label', t('bhv.welcome'));
      el.setAttribute('dir', dir);
      el.innerHTML =
        '<div class="bhv-inner">' +
          '<div class="bhv-head">' +
            '<span class="bhv-title">' + esc(t('bhv.welcome')) + '</span>' +
            '<button class="bhv-close" id="bhvClose" aria-label="' + esc(t('bhv.dismiss')) + '">' +
              '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>' +
            '</button>' +
          '</div>' +
          '<a class="bhv-cta" href="' + esc(rec.href) + '">' + esc(rec.label) + '</a>' +
        '</div>';

      document.body.appendChild(el);

      document.getElementById('bhvClose').addEventListener('click', dismiss);

      /* Ekranda belirsin */
      requestAnimationFrame(function () {
        el.classList.add('bhv-visible');
      });

      /* 20 saniye sonra otomatik kapat */
      setTimeout(dismiss, 20000);
    }, 1800);
  }

  /* ── Başlat ─────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initSectionTracking();
    initPackageTracking();
    initCategoryTracking();
    initFormTracking();

    /* Widget: önce bölüm izleme başlasın, sonra göster */
    setTimeout(renderWidget, 400);
  }

}());
