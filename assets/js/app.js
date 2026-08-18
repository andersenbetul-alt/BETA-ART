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


  /* ---------- yapılandırılmış veri (JSON-LD) ve hreflang ---------- */
  // Tüm yayın ayarları assets/js/config.js içinde; burada yalnızca okunur.
  var CFG = window.QB_CONFIG || {};
  var SITE_URL = CFG.siteUrl || 'https://qblogg.com';
  var SOCIAL = CFG.social || {};

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
    if (canon) canon.href = base;
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
  function cardHTML(p) {
    var c = ACCENTS[p.accent] || ACCENTS[1];
    return '<a class="card post-card reveal" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<div class="post-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + p.icon + '</div>' +
      '<div class="post-body">' +
        '<div class="post-meta"><span class="tag">' + esc(t('cat.' + p.category)) + '</span>' +
        '<span class="meta-when">' + esc(fmtDate(p.date)) +
          '<span class="dot">' + readTime(p) + ' ' + esc(t('posts.min')) + '</span></span></div>' +
        '<h3>' + esc(pick(p.t)) + '</h3><p>' + esc(pick(p.e)) + '</p>' +
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

  function blockHTML(block) {
    if (typeof block === 'string') return '<p>' + esc(block) + '</p>';
    if (block.h) return '<h2>' + esc(block.h) + '</h2>';
    if (block.note) return '<p class="article-note">' + esc(block.note) + '</p>';
    if (block.ul) return '<ul>' + block.ul.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
    if (block.see) return seeHTML(block.see);
    return '';
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
      var hay = pick(p.t) + ' ' + pick(p.e) + ' ' + (pick(p.b) || []).map(blockText).join(' ');
      return hay.toLowerCase().indexOf(q) > -1;
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
    var body = (pick(post.b) || []).map(blockHTML).join('');
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
      '<div class="article-cover" style="--c1:' + c[0] + ';--c2:' + c[1] + '">' + post.icon + '</div>' +
      '<div class="article-body">' + body + sourcesHTML(post) + '</div>' +
      '<div class="article-foot">' +
        '<a class="btn btn--ghost" href="blog.html">← ' + esc(t('posts.back')) + '</a>' +
        '<div class="share-row">' +
          '<span class="share-label">' + esc(t('share.on')) + '</span>' +
          shareLinks(post) +
          '<button type="button" class="share-btn" id="shareBtn" title="' + esc(t('posts.share')) + '" aria-label="' + esc(t('posts.share')) + '">🔗</button>' +
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

  // Yazı yayına girdiğinde paylaşım kanalları hazır olsun: her bağlantı
  // yazının kendi başlığı ve adresiyle önceden doldurulur.
  function shareLinks(post) {
    var url = SITE_URL + '/post.html?slug=' + encodeURIComponent(post.slug) + '&lang=' + currentLang;
    var title = pick(post.t);
    var u = encodeURIComponent(url);
    var tt = encodeURIComponent(title);
    var targets = [
      { id: 'linkedin', label: 'in', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u },
      { id: 'x', label: '𝕏', href: 'https://twitter.com/intent/tweet?text=' + tt + '&url=' + u },
      { id: 'facebook', label: 'f', href: 'https://www.facebook.com/sharer/sharer.php?u=' + u },
      { id: 'whatsapp', label: '✆', href: 'https://wa.me/?text=' + tt + '%20' + u },
      { id: 'mail', label: '✉', href: 'mailto:?subject=' + tt + '&body=' + u }
    ];
    return targets.map(function (s) {
      return '<a class="share-btn" href="' + s.href + '" target="_blank" rel="noopener noreferrer" ' +
             'title="' + esc(s.id) + '" aria-label="' + esc(s.id) + '">' + s.label + '</a>';
    }).join('');
  }

  // Altbilgideki sosyal bağlantılar: adresi girilmemiş hesap gösterilmez.
  function applySocial() {
    $$('[data-social]').forEach(function (el) {
      var url = SOCIAL[el.getAttribute('data-social')];
      var li = el.closest('li') || el;
      if (url) { el.href = url; li.hidden = false; }
      else { li.hidden = true; }
    });
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
      say(msg, ok ? 'cta.success' : 'cta.invalid');
      if (ok) {
        // Statik site: kayıt tarayıcıda tutulur. Gerçek listeye bağlarken
        // buradaki bloğu e-posta servisinizin API çağrısıyla değiştirin.
        try {
          var list = JSON.parse(localStorage.getItem('qb_subs') || '[]');
          if (list.indexOf(val) === -1) list.push(val);
          localStorage.setItem('qb_subs', JSON.stringify(list));
        } catch (err) { /* yoksay */ }
        form.reset();
        // Kayıt karşılığı: kontrol listesi indirme bağlantısı görünür olur.
        var gift = $('#magnetLink');
        if (gift) gift.hidden = false;
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
    // Statik site: gönderim, ziyaretçinin kendi e-posta uygulamasında hazır bir taslak olarak açılır.
    // Sunucu tarafı bir forma (Formspree, Netlify Forms) bağlarken burayı fetch çağrısıyla değiştirin.
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(body).catch(function () {});
    window.location.href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    say(msgEl, successKey);
  }

  function initWorkForms() {
    var client = $('#clientForm');
    if (client) client.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#clientMsg');
      var name = $('#cName').value.trim();
      var mail = $('#cEmail').value.trim();
      var text = $('#cMsg').value.trim();
      if (!name || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
        say(msg, 'wc.invalid');
        return;
      }
      composeMail(client, 'QBLOGG — ' + t('wc.title') + ' · ' + name, msg, 'wc.success');
    });

    var writer = $('#writerForm');
    if (writer) writer.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#writerMsg');
      var name = $('#wName').value.trim();
      var mail = $('#wEmail').value.trim();
      var text = $('#wMsg').value.trim();
      if (!name || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
        say(msg, 'wc.invalid');
        return;
      }
      composeMail(writer, 'QBLOGG — ' + t('ww.title') + ' · ' + name, msg, 'ww.success');
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

  function renderAll() { renderHome(); renderBlog(); renderPost(); renderSchema(); applySocial(); }
  window.QB_RENDER = renderAll; // tek dosyalık önizleme için dışa açıldı

  // Altbilgideki telif yılı. Daha önce her sayfada satır içi <script> ile
  // yazılıyordu; katı CSP (script-src 'self') altında satır içi script
  // çalışmıyor, yıl sabit kalıyordu.
  function initYear() {
    var el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initTheme();
    initLangMenu();
    initNav();
    initBlog();
    initForm();
    initTabs();
    initWorkForms();
    applyLang(currentLang, false);
    revealInit();
  });
})();
