/* QBLOGG — uygulama mantığı: dil, tema, blog listesi ve yazı sayfası. */
(function () {
  'use strict';

  var LANGS = window.QB_LANGS || [];
  var DICT = window.QB_I18N || {};
  var POSTS = window.QB_POSTS || [];
  var FALLBACK = 'en';
  var LS_LANG = 'qb_lang';
  var LS_THEME = 'qb_theme';

  /* Kapak rampası navy–teal aralığında kalır: markanın dışına çıkan renk yok.
     Beyaz ikon her uçta en az 4,76:1 kontrast görür (ölçüldü). */
  var ACCENTS = {
    1: ['#082C54', '#0a7d72'], 2: ['#0b3a63', '#0d8175'], 3: ['#06263f', '#12657f'],
    4: ['#0a5f6b', '#082C54'], 5: ['#123c66', '#177a86'], 6: ['#041d38', '#0a6b64']
  };

  /* Kapak ikonları — emoji yerine satır içi SVG: işletim sistemi ne çizeceğine
     karar veremez, ikon temaya ve kapak rengine uyar. */
  var ICONS = {
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.4-2.8 4"/><path d="M12 17.4h.01"/>',
    coin:     '<circle cx="9.3" cy="9.3" r="5.6"/><circle cx="14.7" cy="14.7" r="5.6"/>',
    blocks:   '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8"/><path d="M13 16.75h7.5M16.75 13v7.5"/>',
    phone:    '<path d="M8.4 4.5H5.6A1.6 1.6 0 0 0 4 6.2C4 13.9 10.1 20 17.8 20a1.6 1.6 0 0 0 1.7-1.6v-2.8l-3.6-1.4-1.9 2.1a12.6 12.6 0 0 1-4.3-4.3l2.1-1.9Z"/>',
    banknote: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.9"/>',
    compass:  '<circle cx="12" cy="12" r="9"/><path d="m15.4 8.6-1.9 4.9-4.9 1.9 1.9-4.9Z"/>',
    bulb:     '<path d="M9.3 17.5a6 6 0 1 1 5.4 0"/><path d="M9.5 20.4h5M10 17.5h4"/>',
    chart:    '<path d="M3.5 20.5V4"/><path d="M3.5 20.5H21"/><path d="m7 15.5 3.6-4.2 3 2.6L20 7"/><path d="M16.4 7H20v3.6"/>',
    envelope: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7.5 7.1 5a2 2 0 0 0 2.2 0l7.1-5"/>',
    link:     '<path d="M10.2 13.8a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 1 0-5.7-5.7l-1.3 1.3"/><path d="M13.8 10.2a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 1 0 5.7 5.7l1.3-1.3"/>',
    gear:     '<circle cx="12" cy="12" r="3.1"/><path d="M19.6 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1v-.3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z"/>',
    /* Paylaşım kanalları — marka glifleri emoji/metin işareti değil, ikon çizim
       kuralına uyan sadeleştirilmiş çizgi diliyle. */
    linkedin: '<circle cx="7" cy="6.7" r="1"/><path d="M7 10v7.3"/><path d="M11.5 17.3v-4.1a2.6 2.6 0 0 1 5.2 0v4.1"/><path d="M11.5 17.3v-7.3"/>',
    x:        '<path d="M5 5l14 14"/><path d="M19 5 5 19"/>',
    facebook: '<path d="M15 4h-1.8A3.7 3.7 0 0 0 9.5 7.7V11"/><path d="M6.2 11h6.8"/><path d="M9.5 11v9"/>',
    whatsapp: '<path d="M12 3.6a8.4 8.4 0 0 0-7.2 12.7L4 20.4l4.2-1.1A8.4 8.4 0 1 0 12 3.6Z"/><path d="M9.1 9.4c.1-.5.5-.8 1-.8h.4c.3 0 .5.2.6.4l.5 1.3c.1.3 0 .6-.2.8l-.4.4c.4.9 1.1 1.6 2 2l.4-.4c.2-.2.5-.3.8-.2l1.3.5c.3.1.4.4.4.6-.1.5-.5.9-1 1-2.9.3-5.5-2.3-5.8-5.6Z"/>'
  };
  function iconSVG(name) {
    var body = ICONS[name];
    if (!body) return '';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

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

    applyConfig();
    renderAll();
    document.dispatchEvent(new CustomEvent('qb:lang', { detail: { lang: code } }));
  }

  /* Yapılandırmadaki değerleri sayfaya uygular: fiyatlar, e-posta, indirme bağlantısı.
     Dil değiştiğinde sözlük metinleri yeniden yazıldığı için tekrar çağrılır. */
  function applyConfig() {
    var cfg = window.QB_CONFIG || {};
    var prices = cfg.prices || {};
    ['p1', 'p2', 'p3'].forEach(function (k) {
      if (!prices[k]) return;
      var el = $('[data-i18n="' + k + '.price"]');
      if (el) el.textContent = prices[k];
    });
    if (cfg.mailTo) $$('[data-mailto]').forEach(function (el) {
      el.textContent = cfg.mailTo;
      if (el.tagName === 'A') el.href = 'mailto:' + cfg.mailTo;
    });
    if (cfg.leadMagnet) $$('[data-magnet]').forEach(function (el) { el.href = cfg.leadMagnet; });
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
      return '<button type="button" role="option" data-lang="' + esc(l.code) + '" aria-selected="false">' +
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


  /* ---------- yapılandırılmış veri (JSON-LD) ve hreflang ---------- */
  // Tüm yayın ayarları assets/js/config.js içinde; burada yalnızca okunur.
  var CFG = window.QB_CONFIG || {};
  var SITE_URL = CFG.siteUrl || 'https://qblogg.com';
  var SOCIAL = CFG.social || {};
  var PAY = CFG.payLinks || {};

  function setJsonLd(id, data) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  // Yazı sayfası tek URL'de on dil sunduğu için dil alternatiflerini
  // ?lang= parametresiyle bildiriyoruz (bkz. ROADMAP #11: ön-render).
  // hreflang kümesindeki her adres kendine canonical vermeli. Sayfalarda
  // canonical parametresiz yazılıydı, alternatifler ise ?lang=xx idi: arama
  // motoru bu tutarsızlıkta hreflang'ı bütünüyle yok sayıyor — yani on dilin
  // SEO karşılığı sıfırlanıyordu. Şimdi canonical, açık olan dil adresini
  // gösteriyor. (Asıl çözüm her dili ayrı adreste üreten ön-render adımıdır;
  // bu, o gelene kadar geçerli olan doğru işaretleme.)
  function syncCanonical() {
    var canon = $('link[rel="canonical"]');
    if (!canon) return;
    var fromUrl = param('lang');
    if (!fromUrl || !langInfo(fromUrl)) return;      // parametresiz adres x-default'tur
    var here = window.location.pathname.split('/').pop() || 'index.html';
    var slug = param('slug');
    canon.setAttribute('href', './' + here +
      (slug ? '?slug=' + encodeURIComponent(slug) + '&lang=' : '?lang=') + fromUrl);
  }

  function setPostAlternates(slug) {
    $$('link[data-qb-alt]').forEach(function (l) { l.remove(); });
    var base = SITE_URL + '/post.html?slug=' + encodeURIComponent(slug);
    LANGS.concat([{ code: 'x-default' }]).forEach(function (l) {
      var link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l.code;
      link.href = l.code === 'x-default' ? base : base + '&lang=' + l.code;
      link.setAttribute('data-qb-alt', '');
      document.head.appendChild(link);
    });
    var canon = $('link[rel="canonical"]');
    if (canon) canon.href = param('lang') && langInfo(param('lang')) ? base + '&lang=' + param('lang') : base;
  }

  function articleSchema(post) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: pick(post.t),
      description: pick(post.e),
      articleBody: (pick(post.b) || []).map(blockText).join('\n\n'),
      datePublished: post.date,
      inLanguage: currentLang,
      articleSection: t('cat.' + post.category),
      timeRequired: 'PT' + readTime(post) + 'M',
      mainEntityOfPage: SITE_URL + '/post.html?slug=' + encodeURIComponent(post.slug),
      author: { '@type': 'Organization', name: 'QBLOGG', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'QBLOGG', url: SITE_URL }
    };
  }

  /* FAQPage: Google 7 Mayıs 2026'da FAQ zengin sonuçlarını kaldırdı — bu blok
     artık arama sonucunda açılır soru göstermez. Yine de tutuyoruz: yapılandırılmış
     veri, yapay zekâ arama motorlarının sayfayı ayrıştırmasına yarıyor ve maliyeti
     birkaç yüz bayt. Zengin sonuç beklemeyin. */
  function faqSchema() {
    var qa = [['wq1', 'wa1'], ['wq2', 'wa2'], ['wq3', 'wa3'], ['wq4', 'wa4']];
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: currentLang,
      mainEntity: qa.map(function (pair) {
        return {
          '@type': 'Question',
          name: t(pair[0]),
          acceptedAnswer: { '@type': 'Answer', text: t(pair[1]) }
        };
      })
    };
  }

  function renderSchema() {
    if ($('#panel-client')) setJsonLd('qb-faq-schema', faqSchema());
  }

  /* ---------- blog kartları ---------- */
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(currentLang, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { return iso; }
  }
  /* seviye: kartın başlık düzeyi. Blog sayfasında kartlar doğrudan h1'in
     altında duruyor, yani h2 olmalı; ana sayfada ve yazı sayfasında bir
     bölüm h2'sinin altındalar, orada h3 doğru. Sabit h3 blog.html'de
     h1→h3 atlaması üretiyordu. */
  function cardHTML(p, seviye, featured) {
    var h = seviye === 2 ? 'h2' : 'h3';
    var c = ACCENTS[p.accent] || ACCENTS[1];
    return '<a class="card post-card' + (featured ? ' post-card--featured' : '') + ' reveal" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<div class="post-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + iconSVG(p.icon) + '</div>' +
      '<div class="post-body">' +
        '<div class="post-meta"><span class="tag">' + esc(t('cat.' + p.category)) + '</span>' +
        '<span class="meta-when">' + esc(fmtDate(p.date)) +
          '<span class="dot">' + readTime(p) + ' ' + esc(t('posts.min')) + '</span></span></div>' +
        '<' + h + '>' + esc(pick(p.t)) + '</' + h + '><p>' + esc(pick(p.e)) + '</p>' +
        '<span class="read-more">' + esc(t('posts.readMore')) + ' →</span>' +
      '</div></a>';
  }
  // Okuma süresi metnin kendisinden hesaplanır (dakikada ~200 kelime).
  // Elle girilen bir sayı, metin değişince yanlış kalıyordu.
  function blockText(block) {
    if (typeof block === 'string') return block;
    if (block.h) return block.h;
    if (block.note) return block.note;
    if (block.ul) return block.ul.join(' ');
    if (block.see) return '';
    if (block.aff) return [block.aff.t, block.aff.why].filter(Boolean).join(' ');
    return '';
  }

  // {see:'slug'} — metnin içinden başka bir yazıya bağlantı. Alttaki "benzer
  // yazılar" şeridinden farkı: bağlam içinde duruyor, o yüzden hem okunuyor
  // hem de kümeyi arama motoruna gösteriyor.
  function seeHTML(slug) {
    var target = POSTS.filter(function (p) { return p.slug === slug; })[0];
    if (!target) return '';
    return '<p class="article-see"><span>' + esc(t('posts.see')) + ':</span> ' +
      '<a href="post.html?slug=' + encodeURIComponent(slug) + '">' + esc(pick(target.t)) + '</a></p>';
  }

  // {aff:{t,u,why}} — ortaklık bağlantısı. Google ortaklık bağlantılarında
  // rel="sponsored" bekliyor; kullanıcıya da neden önerdiğimizi söylüyoruz.
  // Öneri gerekçesi (why) zorunlu tutuluyor: gerekçesiz öneri reklamdır.
  function affHTML(a) {
    if (!a || !a.t || !a.u) return '';
    return '<p class="article-aff">' +
      '<a href="' + esc(a.u) + '" rel="sponsored nofollow noopener" target="_blank">' + esc(a.t) + '</a>' +
      (a.why ? '<span class="article-aff-why">' + esc(a.why) + '</span>' : '') +
      '</p>';
  }

  // Ortaklık bildirimi: bağlantı içeren yazının başında görünür.
  function affDisclosureHTML(post) {
    var cfg = (CFG.affiliate || {});
    if (cfg.disclosure === false) return '';
    var blocks = pick(post.b) || [];
    var has = blocks.some(function (b) { return b && typeof b === 'object' && b.aff; });
    if (!has) return '';
    return '<p class="article-disclosure">' + esc(t('posts.affDisclosure')) + '</p>';
  }

  // Gövde metninde **vurgu** yazılabiliyor. Önce kaçırıyoruz, sonra çeviriyoruz:
  // sıra bu olmazsa vurgu işareti HTML enjeksiyonuna kapı açar.
  // Ara başlıkta kullanılmıyor — başlığın tamamı zaten vurgulu.
  function rich(str) {
    return esc(str).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function blockHTML(block, i) {
    if (typeof block === 'string') return '<p>' + rich(block) + '</p>';
    if (block.h) return '<h2 id="b-' + i + '">' + esc(block.h) + '</h2>';
    if (block.note) return '<p class="article-note">' + rich(block.note) + '</p>';
    if (block.ul) return '<ul>' + block.ul.map(function (li) { return '<li>' + rich(li) + '</li>'; }).join('') + '</ul>';
    if (block.see) return seeHTML(block.see);
    if (block.aff) return affHTML(block.aff);
    return '';
  }

  // Gövdede 3 veya daha çok ara başlık varsa İçindekiler kartı basılır; özet
  // katmanı dillerinde (3 blok) TOC hiç görünmez.
  function tocHTML(blocks) {
    var items = blocks.map(function (b, i) { return b && b.h ? { i: i, h: b.h } : null; }).filter(Boolean);
    if (items.length < 3) return '';
    return '<nav class="article-toc" aria-label="' + esc(t('posts.toc')) + '">' +
      '<h2>' + esc(t('posts.toc')) + '</h2>' +
      '<ol>' + items.map(function (it) { return '<li><a href="#b-' + it.i + '">' + esc(it.h) + '</a></li>'; }).join('') + '</ol>' +
      '</nav>';
  }

  // Kaynak listesi. u (adres) isteğe bağlı: adresi doğrulanmamış bir kaynağı
  // uydurma bağlantıyla yayınlamaktansa adıyla yazmayı tercih ediyoruz.
  function sourcesHTML(post) {
    var list = post.src || [];
    if (!list.length) return '';
    return '<section class="article-sources"><h2>' + esc(t('posts.sources')) + '</h2><ol>' +
      list.map(function (s) {
        var label = esc(s.t);
        return '<li>' + (s.u ? '<a href="' + esc(s.u) + '" rel="nofollow noopener" target="_blank">' + label + '</a>' : label) + '</li>';
      }).join('') + '</ol></section>';
  }

  function readTime(post) {
    var text = (pick(post.b) || []).map(blockText).join(' ');
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.round(words / 200));
  }

  function sorted() {
    return POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  /* ---------- sayfa: ana sayfa ---------- */
  function renderHome() {
    var box = $('#latestPosts');
    if (!box) return;
    box.innerHTML = sorted().slice(0, 3).map(function (p) { return cardHTML(p, 3); }).join('');
  }

  /* ---------- sayfa: blog ---------- */
  var blogState = { q: '', cat: 'all' };
  function renderBlog() {
    var box = $('#postList');
    if (!box) return;
    var chips = $('#catChips');
    // Rozet sayısı her çip için kaç yazı bulunacağını önceden gösterir —
    // tıklamadan önce hangi kategorinin boş/dolu olduğu belli olsun diye.
    if (chips) {
      var cats = ['all'].concat(POSTS.map(function (p) { return p.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      chips.innerHTML = cats.map(function (c) {
        var n = c === 'all' ? POSTS.length : POSTS.filter(function (p) { return p.category === c; }).length;
        return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (blogState.cat === c) + '">' +
               esc(c === 'all' ? t('posts.all') : t('cat.' + c)) + ' <span class="chip-n">' + n + '</span></button>';
      }).join('');
    }
    var q = blogState.q.toLowerCase().trim();
    var list = sorted().filter(function (p) {
      if (blogState.cat !== 'all' && p.category !== blogState.cat) return false;
      if (!q) return true;
      var hay = pick(p.t) + ' ' + pick(p.e) + ' ' + (pick(p.b) || []).map(blockText).join(' ');
      return hay.toLowerCase().indexOf(q) > -1;
    });
    // İlk kart yalnızca varsayılan görünümde (filtresiz, aramasız) büyütülür —
    // bir kategoriye ya da arama sonucuna girildiğinde büyütmenin bir anlamı
    // kalmıyor, en alakalı sonuç neyse o üstte durmalı.
    var showFeatured = blogState.cat === 'all' && !q;
    box.innerHTML = list.length ? list.map(function (p, i) { return cardHTML(p, 2, showFeatured && i === 0); }).join('')
      : '<p class="empty">' + esc(t('posts.empty')) + '</p>';
    revealInit();
  }
  // Filtre durumu adreste yaşar: sayfa yenilense de, bağlantı paylaşılsa da korunur.
  function syncBlogUrl() {
    var u = new URL(window.location.href);
    if (blogState.q.trim()) u.searchParams.set('q', blogState.q.trim());
    else u.searchParams.delete('q');
    if (blogState.cat !== 'all') u.searchParams.set('cat', blogState.cat);
    else u.searchParams.delete('cat');
    history.replaceState(null, '', u);
  }
  function initBlog() {
    var box = $('#postList');
    if (!box) return;
    var input = $('#searchInput');
    if (input) input.addEventListener('input', function () { blogState.q = this.value; syncBlogUrl(); renderBlog(); });
    var chips = $('#catChips');
    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (!b) return;
      blogState.cat = b.dataset.cat;
      syncBlogUrl();
      renderBlog();
    });
    var preset = param('cat');
    if (preset) blogState.cat = preset;
    var presetQ = param('q');
    if (presetQ) {
      blogState.q = presetQ;
      if (input) input.value = presetQ;
    }
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
    var blocks = pick(post.b) || [];
    var body = blocks.map(blockHTML).join('');
    var toc = tocHTML(blocks);
    var related = sorted().filter(function (p) { return p.slug !== post.slug && p.category === post.category; }).slice(0, 2);
    if (related.length < 2) {
      related = related.concat(sorted().filter(function (p) {
        return p.slug !== post.slug && related.indexOf(p) === -1;
      }).slice(0, 2 - related.length));
    }
    document.title = pick(post.t) + ' — QBLOGG';
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pick(post.e));
    setJsonLd('qb-article-schema', articleSchema(post));
    setPostAlternates(post.slug);
    host.innerHTML =
      '<div class="article-head">' +
        '<div class="post-meta" style="justify-content:center"><span class="tag">' + esc(t('cat.' + post.category)) + '</span>' +
        '<span>' + esc(t('posts.published')) + ': ' + esc(fmtDate(post.date)) + '</span>' +
        '<span class="meta-when">' + readTime(post) + ' ' + esc(t('posts.min')) + '</span></div>' +
        '<h1>' + esc(pick(post.t)) + '</h1>' +
        '<p class="muted">' + esc(pick(post.e)) + '</p>' +
      '</div>' +
      '<div class="article-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + iconSVG(post.icon) + '</div>' +
      toc +
      '<div class="article-body">' + affDisclosureHTML(post) + body + sourcesHTML(post) + '</div>' +
      '<div class="article-foot">' +
        '<a class="btn btn--ghost" href="blog.html">← ' + esc(t('posts.back')) + '</a>' +
        '<div class="share-row">' +
          '<span class="share-label">' + esc(t('share.on')) + '</span>' +
          shareLinks(post) +
          '<button type="button" class="share-btn" id="shareBtn" title="' + esc(t('posts.share')) + '" aria-label="' + esc(t('posts.share')) + '">' + iconSVG('link') + '</button>' +
        '</div>' +
      '</div>' +
      '<aside class="post-cta reveal">' +
        '<h3>' + esc(t('cta2.title')) + '</h3>' +
        '<p>' + esc(t('cta2.sub')) + '</p>' +
        '<div class="post-cta-actions">' +
          '<a class="btn btn--primary" href="work.html">' + esc(t('cta2.btn')) + '</a>' +
          '<a class="btn btn--ghost" href="index.html#packages">' + esc(t('cta2.alt')) + '</a>' +
        '</div>' +
      '</aside>' +
      '<h2 style="margin-top:52px">' + esc(t('posts.related')) + '</h2>' +
      '<div class="posts">' + related.map(function (p) { return cardHTML(p, 3); }).join('') + '</div>';

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

  // Yazı yayına girdiğinde paylaşım kanalları hazır olsun: her bağlantı
  // yazının kendi başlığı ve adresiyle önceden doldurulur.
  function shareLinks(post) {
    var url = SITE_URL + '/post.html?slug=' + encodeURIComponent(post.slug) + '&lang=' + currentLang;
    var title = pick(post.t);
    var u = encodeURIComponent(url);
    var tt = encodeURIComponent(title);
    var targets = [
      { id: 'linkedin', icon: 'linkedin', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u },
      { id: 'x', icon: 'x', href: 'https://twitter.com/intent/tweet?text=' + tt + '&url=' + u },
      { id: 'facebook', icon: 'facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + u },
      { id: 'whatsapp', icon: 'whatsapp', href: 'https://wa.me/?text=' + tt + '%20' + u },
      { id: 'mail', icon: 'envelope', href: 'mailto:?subject=' + tt + '&body=' + u }
    ];
    return targets.map(function (s) {
      return '<a class="share-btn" href="' + s.href + '" target="_blank" rel="noopener noreferrer" ' +
             'title="' + esc(s.id) + '" aria-label="' + esc(s.id) + '">' + iconSVG(s.icon) + '</a>';
    }).join('');
  }

  // Altbilgideki sosyal bağlantılar: adresi girilmemiş hesap gösterilmez.
  // Hiçbir hesap girilmemişse "Sosyal" başlığı da boş kalmasın diye gizlenir.
  function applySocial() {
    var any = false;
    $$('[data-social]').forEach(function (el) {
      var url = SOCIAL[el.getAttribute('data-social')];
      var li = el.closest('li') || el;
      if (url) { el.href = url; li.hidden = false; any = true; }
      else { li.hidden = true; }
    });
    var wrap = document.getElementById('footerSocial');
    if (wrap) wrap.hidden = !any;
  }

  // Paket kartlarındaki "Kartla öde" düğmesi: adresi config.js → payLinks'te
  // dolu olan pakette CTA'nın altına eklenir, boş pakette hiç eklenmez
  // (sosyal bağlantılarla aynı gerekçe — ölü bağlantı istemiyoruz).
  function applyPayLinks() {
    var plans = $$('#packages .plan');
    ['p1', 'p2', 'p3'].forEach(function (k, i) {
      var plan = plans[i];
      if (!plan) return;
      var url = PAY[k];
      var btn = plan.querySelector('[data-pay]');
      if (url) {
        if (!btn) {
          btn = document.createElement('a');
          btn.className = 'btn btn--ghost btn--block';
          btn.setAttribute('data-pay', '');
          btn.setAttribute('rel', 'noopener');
          btn.setAttribute('data-i18n', 'pay.card');
          plan.appendChild(btn);
        }
        btn.href = url;
        btn.textContent = t('pay.card');
      } else if (btn) {
        btn.remove();
      }
    });
    var note = $('#payNote');
    if (note) note.hidden = !(PAY.p1 || PAY.p2 || PAY.p3);
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
      var ok = EMAIL_RE.test(val);
      say(msg, ok ? 'cta.success' : 'cta.invalid');
      if (!ok) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        input.addEventListener('input', function tidy() {
          input.removeAttribute('aria-invalid');
          input.removeEventListener('input', tidy);
        });
      }
      if (ok) {
        var done = function () {
          form.reset();
          // Kayıt karşılığı: kontrol listesi indirme bağlantısı görünür olur.
          var gift = $('#magnetLink');
          if (gift) gift.hidden = false;
        };
        var endpoint = CFG.newsletterEndpoint;
        if (endpoint) {
          // Gerçek liste. Servisler genelde form-encoded bekler ve CORS'a
          // izin vermez; no-cors ile gönderiyoruz — yanıtı okuyamayız ama
          // kayıt düşer. Servis JSON API sunuyorsa burayı ona göre değiştirin.
          var body = encodeURIComponent(CFG.newsletterField || 'email') + '=' + encodeURIComponent(val);
          var submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }
          var unlock = function () {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
          };
          fetch(endpoint, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
          }).then(function () { unlock(); done(); }, function () { unlock(); say(msg, 'cta.error'); });
        } else {
          // Servis bağlanmamış: kayıt yalnızca bu tarayıcıda kalır, yani
          // liste gerçekte oluşmuyor. config.js → newsletterEndpoint.
          try {
            var list = JSON.parse(localStorage.getItem('qb_subs') || '[]');
            if (list.indexOf(val) === -1) list.push(val);
            localStorage.setItem('qb_subs', JSON.stringify(list));
          } catch (err) { /* yoksay */ }
          if (window.console && console.warn) {
            console.warn('QBLOGG: newsletterEndpoint boş — kayıt yalnızca bu tarayıcıda tutuldu, listeye düşmedi.');
          }
          done();
        }
      }
    });
  }


  /* ---------- sayfa: bizimle çalışın ---------- */
  var MAIL_TO = (window.QB_CONFIG && window.QB_CONFIG.mailTo) || 'hello@qblogg.com';

  function initTabs() {
    var tabs = $$('.tab[data-tab]');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t2) {
          var on = t2 === tab;
          t2.setAttribute('aria-selected', String(on));
          var panel = document.getElementById('panel-' + t2.dataset.tab);
          if (panel) panel.hidden = !on;
        });
      });
    });
  }

  // Durum mesajını data-i18n ile işaretler ki dil değişince kendini güncellesin.
  function say(el, key) {
    if (!el) return;
    el.setAttribute('data-i18n', key);
    el.textContent = t(key);
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Alan yanı doğrulama: hatalı girdiyi işaretler, altına kısa mesaj koyar,
  // ziyaretçi yazmaya başlayınca ikisini de temizler.
  var invalidMsgSeq = 0;
  function markInvalid(el, key) {
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    var host = el.closest('.field') || el.parentElement;
    var note = host.querySelector('.field-msg');
    if (!note) {
      note = document.createElement('p');
      note.className = 'field-msg';
      note.id = 'msg-' + (el.id || ++invalidMsgSeq);
      note.setAttribute('aria-live', 'polite');
      host.appendChild(note);
    }
    say(note, key);
    el.setAttribute('aria-describedby', note.id);
    el.addEventListener('input', function tidy() {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      note.remove();
      el.removeEventListener('input', tidy);
    });
  }
  function clearInvalid(form) {
    $$('[aria-invalid]', form).forEach(function (el) {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
    $$('.field-msg', form).forEach(function (el) { el.remove(); });
  }

  function composeMail(form, subject, msgEl, successKey) {
    var lines = [];
    $$('[data-field]', form).forEach(function (el) {
      if (el.type === 'checkbox') return;
      var val = (el.value || '').trim();
      if (!val) return;
      if (el.tagName === 'SELECT' && el.selectedOptions.length) val = el.selectedOptions[0].textContent.trim();
      lines.push(t(el.getAttribute('data-field')) + ': ' + val);
    });
    var checked = $$('input[type="checkbox"]', form).filter(function (c) { return c.checked; })
      .map(function (c) { return t(c.getAttribute('data-field')); });
    if (checked.length) lines.push(t('wc.services') + ': ' + checked.join(', '));

    var body = lines.join('\n');

    var endpoint = CFG.formEndpoint;
    if (endpoint) {
      // Sunucu tarafı form. Formspree CORS'a izin verir ve JSON döner, yani
      // no-cors gerekmez: gerçekten başarılı mı, okuyabiliyoruz.
      var mailEl = $('[type="email"]', form);
      say(msgEl, 'wc.sending');
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }
      var unlock = function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
      };
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          email: mailEl ? (mailEl.value || '').trim() : '',
          message: body
        })
      }).then(function (res) {
        unlock();
        if (res.ok) { form.reset(); say(msgEl, 'wc.sent'); }
        else say(msgEl, 'wc.error');
      }, function () { unlock(); say(msgEl, 'wc.error'); });
      return;
    }

    // Adres girilmemiş: gönderim ziyaretçinin kendi e-posta uygulamasında hazır
    // bir taslak olarak açılır. Sunucu gerektirmez ama göndermesine bağlıdır.
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(body).catch(function () {});
    window.location.href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    say(msgEl, successKey);
  }

  function initWorkForms() {
    var client = $('#clientForm');
    var writer = $('#writerForm');

    // Uzun formda yazılanlar, sekme yanlışlıkla kapanırsa sorulmadan gitmesin.
    var dirty = false;
    [client, writer].forEach(function (f) {
      if (f) f.addEventListener('input', function () { dirty = true; });
    });
    window.addEventListener('beforeunload', function (e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    });

    // Doğrulama: her hatalı alan yerinde işaretlenir, odak ilk hataya gider.
    function validate(form, msg, fields) {
      clearInvalid(form);
      var bad = [];
      fields.forEach(function (f) {
        var el = $(f.sel);
        var val = (el.value || '').trim();
        if (f.email ? !EMAIL_RE.test(val) : !val) {
          markInvalid(el, f.email ? 'form.email' : 'form.required');
          bad.push(el);
        }
      });
      if (bad.length) {
        say(msg, 'wc.invalid');
        bad[0].focus();
        return false;
      }
      return true;
    }

    if (client) client.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#clientMsg');
      if (!validate(client, msg, [
        { sel: '#cName' }, { sel: '#cEmail', email: true }, { sel: '#cMsg' }
      ])) return;
      dirty = false;
      composeMail(client, 'QBLOGG — ' + t('wc.title') + ' · ' + $('#cName').value.trim(), msg, 'wc.success');
    });

    if (writer) writer.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#writerMsg');
      if (!validate(writer, msg, [
        { sel: '#wName' }, { sel: '#wEmail', email: true }, { sel: '#wMsg' }
      ])) return;
      dirty = false;
      composeMail(writer, 'QBLOGG — ' + t('ww.title') + ' · ' + $('#wName').value.trim(), msg, 'ww.success');
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

  function renderAll() { renderHome(); renderBlog(); renderPost(); renderSchema(); applySocial(); applyPayLinks(); }
  window.QB_RENDER = renderAll; // tek dosyalık önizleme için dışa açıldı

  // Altbilgideki telif yılı. Daha önce her sayfada satır içi <script> ile
  // yazılıyordu; katı CSP (script-src 'self') altında satır içi script
  // çalışmıyor, yıl sabit kalıyordu.
  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // Sayfa açılışı. Tek dosyalık önizleme, gövdeyi değiştirdikten sonra
  // bunu yeniden çağırır — o yüzden ayrı bir isim altında duruyor.
  function boot() {
    initYear();
    syncCanonical();
    initTheme();
    initLangMenu();
    initNav();
    initBlog();
    initForm();
    initTabs();
    initWorkForms();
    applyLang(currentLang, false);
    revealInit();
  }
  window.QB_BOOT = boot;

  document.addEventListener('DOMContentLoaded', boot);
})();
