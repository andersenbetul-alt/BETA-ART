/* QBLOGG — davranış izleme ve öneri motoru
 *
 * Ziyaretçinin okudukları, ilgilendiği kategoriler ve incelediği paketler
 * tarayıcı yerel deposunda (localStorage) tutulur. Sunucuya hiçbir şey gitmez.
 * Kişisel veri yok: yalnızca slug'lar ve kategori adları saklanır.
 *
 * Ne yapar:
 *   blog.html  → "Son okunanlar" bölümü, kategori tıklamalarını izler
 *   post.html  → görüntülemeyi kaydeder
 *   index.html → paket etkileşimlerini izler, davranışa göre öneri rozeti gösterir
 */
(function () {
  'use strict';

  var LS_KEY = 'qb_behavior';
  var MAX_VIEWS = 20;

  /* ---- Yardımcılar ---- */

  function getLang() {
    try {
      return localStorage.getItem('qb_lang') ||
             document.documentElement.lang ||
             'tr';
    } catch (e) { return 'tr'; }
  }

  function t(key) {
    var lang = getLang();
    var i18n = window.QB_I18N;
    if (!i18n) return key;
    var d = i18n[lang] || i18n.tr || {};
    return d[key] || (i18n.en && i18n.en[key]) || key;
  }

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var d = raw ? JSON.parse(raw) : null;
      if (!d || typeof d !== 'object') d = {};
      return {
        views: Array.isArray(d.views) ? d.views : [],
        cats:  (d.cats  && typeof d.cats  === 'object') ? d.cats  : {},
        pkg:   (d.pkg   && typeof d.pkg   === 'object') ? d.pkg   : {}
      };
    } catch (e) {
      return { views: [], cats: {}, pkg: {} };
    }
  }

  function save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function trackView(slug, cat) {
    if (!slug) return;
    var d = load();
    d.views = d.views.filter(function (v) { return v.s !== slug; });
    d.views.unshift({ s: slug, c: cat || '', t: Date.now() });
    if (d.views.length > MAX_VIEWS) d.views = d.views.slice(0, MAX_VIEWS);
    if (cat) d.cats[cat] = (d.cats[cat] || 0) + 1;
    save(d);
  }

  function trackPkg(pkg) {
    if (!pkg) return;
    var d = load();
    d.pkg[pkg] = (d.pkg[pkg] || 0) + 1;
    save(d);
  }

  function getSuggestedPkg(d) {
    var views   = d.views.length;
    var cats    = Object.keys(d.cats).length;
    var p3clicks = d.pkg.p3 || 0;
    var p2clicks = d.pkg.p2 || 0;

    if (p3clicks >= 2 || views >= 7 || cats >= 3) return 'p3';
    if (p2clicks >= 1 || views >= 3 || cats >= 2) return 'p2';
    if (views >= 1)                               return 'p1';
    return null; // henüz yeterli veri yok
  }

  function findPost(slug) {
    var posts = window.QB_POSTS || [];
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].slug === slug) return posts[i];
    }
    return null;
  }

  function pickTitle(post) {
    var lang = getLang();
    return (post.t && (post.t[lang] || post.t.en || post.t.tr)) || post.slug;
  }

  /* ---- Stil enjeksiyonu (main.css değişkenlerinden türetilir) ---- */

  function injectStyles() {
    if (document.getElementById('beh-styles')) return;
    var el = document.createElement('style');
    el.id = 'beh-styles';
    el.textContent =
      '.beh-section{margin-block-end:28px}' +
      '.beh-head{display:flex;align-items:center;justify-content:space-between;' +
        'margin-block-end:12px;gap:10px}' +
      '[dir=rtl] .beh-head{flex-direction:row-reverse}' +
      '.beh-title{margin:0;font-size:var(--fs-sm);font-weight:600;' +
        'color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em}' +
      '.beh-clear{background:none;border:none;padding:2px 0;font-size:var(--fs-xs);' +
        'color:var(--text-muted);cursor:pointer;text-decoration:underline;' +
        'text-underline-offset:3px;line-height:1}' +
      '.beh-clear:hover{color:var(--text)}' +
      '.beh-row{display:flex;flex-wrap:wrap;gap:10px}' +
      '.beh-card{display:inline-block;padding:8px 14px;' +
        'border:1px solid var(--border);border-radius:var(--radius-sm);' +
        'font-size:var(--fs-sm);color:var(--text);text-decoration:none;' +
        'background:var(--bg-card);line-height:1.4;' +
        'transition:border-color .18s,background .18s}' +
      '.beh-card:hover{border-color:var(--brand);background:var(--bg)}' +
      '.beh-badge{display:inline-block;margin-block-end:10px;' +
        'padding:3px 10px;border-radius:var(--radius-sm);' +
        'background:var(--brand);color:#fff;font-size:var(--fs-xs);' +
        'font-weight:700;text-transform:uppercase;letter-spacing:.05em}';
    document.head.appendChild(el);
  }

  /* ---- blog.html: Son okunanlar + kategori izleme ---- */

  function initBlog() {
    var d = load();
    var views = d.views.slice(0, 3);

    if (views.length) {
      var cards = views.reduce(function (acc, v) {
        var post = findPost(v.s);
        if (!post) return acc;
        var a = document.createElement('a');
        a.className = 'beh-card';
        a.href = 'post.html?slug=' + encodeURIComponent(v.s);
        a.textContent = pickTitle(post);
        acc.push(a);
        return acc;
      }, []);

      if (cards.length) {
        var section = document.createElement('div');
        section.className = 'beh-section';

        var head = document.createElement('div');
        head.className = 'beh-head';

        var h = document.createElement('h3');
        h.className = 'beh-title';
        h.textContent = t('beh.recent');
        head.appendChild(h);

        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'beh-clear';
        clearBtn.textContent = t('beh.clear');
        clearBtn.addEventListener('click', function () {
          save({ views: [], cats: {}, pkg: {} });
          section.remove();
        });
        head.appendChild(clearBtn);

        var row = document.createElement('div');
        row.className = 'beh-row';
        cards.forEach(function (c) { row.appendChild(c); });

        section.appendChild(head);
        section.appendChild(row);

        var postList = document.getElementById('postList');
        if (postList && postList.parentNode) {
          postList.parentNode.insertBefore(section, postList);
        }
      }
    }

    // Kategori chip tıklamalarını izle (event delegation)
    var catChips = document.getElementById('catChips');
    if (catChips) {
      catChips.addEventListener('click', function (e) {
        var chip = e.target.closest('[data-cat]');
        if (chip && chip.dataset.cat && chip.dataset.cat !== 'all') {
          var d2 = load();
          d2.cats[chip.dataset.cat] = (d2.cats[chip.dataset.cat] || 0) + 1;
          save(d2);
        }
      });
    }
  }

  /* ---- post.html: Görüntülemeyi kaydet ---- */

  function initPost() {
    try {
      var params = new URLSearchParams(location.search);
      var slug = params.get('slug');
      if (!slug) return;
      var post = findPost(slug);
      trackView(slug, post ? post.category : '');
    } catch (e) {}
  }

  /* ---- index.html: Paket etkileşim izleme + öneri rozeti ---- */

  function initIndex() {
    var plans = document.querySelectorAll('.plan[data-pkg]');

    // Etkileşimleri kaydet
    plans.forEach(function (plan) {
      var pkg = plan.dataset.pkg;
      if (!pkg) return;
      plan.addEventListener('mouseenter', function () { trackPkg(pkg); }, { passive: true });
      plan.addEventListener('click', function () { trackPkg(pkg); });
    });

    // Davranışa göre rozet ekle
    var d = load();
    var suggested = getSuggestedPkg(d);
    if (!suggested) return;

    var target = document.querySelector('.plan[data-pkg="' + suggested + '"]');
    if (!target) return;

    var badge = document.createElement('span');
    badge.className = 'beh-badge';
    badge.textContent = t('beh.suggested');
    target.insertBefore(badge, target.firstChild);
  }

  /* ---- Sayfa algılama ve başlatma ---- */

  function init() {
    injectStyles();

    var page = location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Önizleme modunda ?page= parametresi sayfa adını taşır
    try {
      var pp = new URLSearchParams(location.search).get('page');
      if (pp) page = pp;
    } catch (e) {}

    if (page === 'blog')                           initBlog();
    else if (page === 'post')                      initPost();
    else if (page === 'index' || page === '')      initIndex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
