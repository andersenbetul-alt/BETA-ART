/* QBLOGG Yönetici Paneli — admin.js
 * Bağımlılıklar: ../assets/js/config.js, ../assets/js/i18n.js, ../assets/js/posts.js
 * Tüm veri yalnızca bu tarayıcıda kalır; sunucuya hiçbir şey gönderilmez.
 */
(function () {
  'use strict';

  /* PIN depolama */
  var ADMIN_KEY = 'qb_admin';
  var POSTS  = window.QB_POSTS  || [];
  var CFG    = window.QB_CONFIG || {};

  /* Basit gizleme: güvenlik değil, kazara açılmaya karşı. */
  function encodePin(pin) { return btoa('qb:' + pin); }
  function decodePin(stored) { try { return atob(stored).slice(3); } catch(e) { return ''; } }

  function getStoredPin() { try { return localStorage.getItem(ADMIN_KEY) || ''; } catch(e) { return ''; } }
  function savePin(pin)   { try { localStorage.setItem(ADMIN_KEY, encodePin(pin)); } catch(e) { alert('localStorage kullanılamıyor.'); } }
  function clearPin()     { try { localStorage.removeItem(ADMIN_KEY); } catch(e) { /* yoksay */ } }

  function isPinSet()       { return !!getStoredPin(); }
  function checkPin(input)  { return decodePin(getStoredPin()) === input; }

  /* Yardımcılar */
  function $(sel, root)  { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s)        { return String(s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  }); }

  /* Yazı okuma süresi (dk) */
  function readTime(post) {
    var lang = 'tr';
    var b = post.b && (post.b[lang] || post.b.en) || [];
    var text = b.map(function(x) {
      if (typeof x === 'string') return x;
      if (x.h) return x.h;
      if (x.ul) return x.ul.join(' ');
      if (x.note) return x.note;
      return '';
    }).join(' ');
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.round(words / 200));
  }

  /* Kelime sayısı (TR gövdesi) */
  function wordCount(post) {
    var b = post.b && (post.b.tr || post.b.en) || [];
    var text = b.map(function(x) {
      if (typeof x === 'string') return x;
      if (x.h) return x.h;
      if (x.ul) return x.ul.join(' ');
      if (x.note) return x.note;
      return '';
    }).join(' ');
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  /* Tarih formatı */
  function fmtDate(s) {
    if (!s) return '';
    var d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ── PIN EKRANı ─────────────────────────────────────────────── */
  var overlay  = $('#pinOverlay');
  var setForm  = $('#pinSetForm');
  var loginForm = $('#pinLoginForm');
  var pinMsg   = $('#pinMsg');

  function showPin() {
    if (overlay) overlay.hidden = false;
    if (isPinSet()) {
      if (setForm)   setForm.hidden   = true;
      if (loginForm) loginForm.hidden = false;
    } else {
      if (setForm)   setForm.hidden   = false;
      if (loginForm) loginForm.hidden = true;
    }
  }

  function hidePin() {
    if (overlay) overlay.hidden = true;
  }

  function showMsg(msg, isError) {
    if (!pinMsg) return;
    pinMsg.textContent = msg;
    pinMsg.className = 'pin-msg' + (isError ? ' pin-msg--error' : ' pin-msg--ok');
  }

  if (setForm) {
    setForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var p1 = ($('#pinNew', setForm) || {}).value || '';
      var p2 = ($('#pinConfirm', setForm) || {}).value || '';
      if (p1.length < 4) { showMsg('PIN en az 4 karakter olmalı.', true); return; }
      if (p1 !== p2)     { showMsg('PIN\'ler eşleşmiyor.', true); return; }
      savePin(p1);
      showMsg('PIN kaydedildi.', false);
      setTimeout(function() { hidePin(); renderDashboard(); }, 600);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var pin = ($('#pinInput', loginForm) || {}).value || '';
      if (checkPin(pin)) {
        hidePin();
        renderDashboard();
      } else {
        showMsg('Yanlış PIN.', true);
        var inp = $('#pinInput', loginForm);
        if (inp) { inp.value = ''; inp.focus(); }
      }
    });
  }

  var lockBtn = $('#lockBtn');
  if (lockBtn) {
    lockBtn.addEventListener('click', function() {
      window.location.reload();
    });
  }

  var resetPin = $('#resetPin');
  if (resetPin) {
    resetPin.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('PIN\'i sıfırlamak için mevcut PIN\'i girmeniz gerekiyor. Devam?')) {
        var pin = prompt('Mevcut PIN:') || '';
        if (checkPin(pin)) {
          clearPin();
          showPin();
          showMsg('PIN sıfırlandı. Yeni PIN belirleyin.', false);
        } else {
          alert('Yanlış PIN — sıfırlanamadı.');
        }
      }
    });
  }

  /* ── SEKME NAVİGASYONu ───────────────────────────────────────── */
  function initTabs() {
    var tabs = $$('.tab-btn');
    tabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        tabs.forEach(function(b) {
          b.setAttribute('aria-selected', String(b === btn));
        });
        $$('.tab-panel').forEach(function(p) {
          p.hidden = p.id !== 'panel-' + btn.dataset.panel;
        });
      });
    });
  }

  /* ── POST LİSTESi ────────────────────────────────────────────── */
  function renderPostList() {
    var tbody = $('#postTableBody');
    if (!tbody) return;

    var sorted = POSTS.slice().sort(function(a, b) { return a.date < b.date ? 1 : -1; });
    tbody.innerHTML = sorted.map(function(p) {
      var title = (p.t && (p.t.tr || p.t.en)) || p.slug;
      var wc    = wordCount(p);
      var wcClass = wc < 600 ? 'wc wc--low' : (wc >= 1200 ? 'wc wc--ok' : 'wc wc--mid');
      var postUrl = '../post.html?slug=' + encodeURIComponent(p.slug);
      return '<tr>' +
        '<td><a href="' + esc(postUrl) + '" target="_blank" rel="noopener">' + esc(title.slice(0, 60)) + '</a></td>' +
        '<td><span class="cat cat--' + esc(p.category) + '">' + esc(p.category) + '</span></td>' +
        '<td class="mono">' + esc(p.date) + '</td>' +
        '<td class="center">' + readTime(p) + ' dk</td>' +
        '<td class="center"><span class="' + wcClass + '">' + wc + '</span></td>' +
        '<td class="mono small">' + esc(p.slug) + '</td>' +
        '<td class="center"><button class="icon-btn" data-copy="' + esc(postUrl) + '" title="Bağlantıyı kopyala">⧉</button></td>' +
      '</tr>';
    }).join('');

    tbody.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-copy]');
      if (!btn) return;
      var url = window.location.origin + '/' + btn.dataset.copy.replace('../', '');
      navigator.clipboard && navigator.clipboard.writeText(url).then(function() {
        btn.textContent = '✓';
        setTimeout(function() { btn.textContent = '⧉'; }, 1200);
      });
    });
  }

  /* ── KATEGORİ FİLTRESi ───────────────────────────────────────── */
  function initCatFilter() {
    var cats = ['all'].concat(POSTS.map(function(p) { return p.category; })
      .filter(function(v, i, a) { return a.indexOf(v) === i; }));
    var bar = $('#catFilter');
    if (!bar) return;
    bar.innerHTML = cats.map(function(c) {
      return '<button class="chip' + (c === 'all' ? ' chip--active' : '') + '" data-cat="' + esc(c) + '">' +
             (c === 'all' ? 'Tümü' : c) + '</button>';
    }).join('');
    bar.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-cat]');
      if (!btn) return;
      $$('.chip', bar).forEach(function(b) { b.classList.toggle('chip--active', b === btn); });
      var cat = btn.dataset.cat;
      $$('#postTableBody tr').forEach(function(row) {
        var rowCat = (row.querySelector('.cat') || {}).textContent || '';
        row.hidden = cat !== 'all' && rowCat !== cat;
      });
    });
  }

  /* ── YAZMA ŞABLONU ───────────────────────────────────────────── */
  var ICONS = ['question','coin','blocks','phone','banknote','compass','bulb','chart','envelope','link','gear'];
  var CATS  = ['safety','money','business','jobs','ai'];

  function initTemplateForm() {
    var form = $('#templateForm');
    var output = $('#templateOutput');
    if (!form || !output) return;

    /* İkon seçimini doldur */
    var iconSel = $('#tIcon', form);
    if (iconSel) ICONS.forEach(function(ic) {
      var opt = document.createElement('option');
      opt.value = ic; opt.textContent = ic;
      iconSel.appendChild(opt);
    });
    /* Kategori seçimini doldur */
    var catSel = $('#tCategory', form);
    if (catSel) CATS.forEach(function(c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      catSel.appendChild(opt);
    });

    /* Bugünün tarihini varsayılan yap */
    var dateInput = $('#tDate', form);
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var slug     = ($('#tSlug', form) || {}).value.trim().toLowerCase().replace(/\s+/g, '-');
      var category = ($('#tCategory', form) || {}).value;
      var date     = ($('#tDate', form) || {}).value;
      var icon     = ($('#tIcon', form) || {}).value;
      var accent   = parseInt(($('#tAccent', form) || {}).value || '1', 10);
      var titleTR  = ($('#tTitleTR', form) || {}).value.trim();
      var titleEN  = ($('#tTitleEN', form) || {}).value.trim();
      var excTR    = ($('#tExcTR', form) || {}).value.trim();
      var excEN    = ($('#tExcEN', form) || {}).value.trim();

      if (!slug || !date || !titleTR || !titleEN) {
        alert('Slug, tarih, TR başlık ve EN başlık zorunludur.'); return;
      }

      var LANGS8 = ['zh','hi','es','ar','fr','pt','ru','no'];
      var t8 = LANGS8.map(function(l) { return '"' + l + '": ""'; }).join(', ');
      var e8 = LANGS8.map(function(l) { return '"' + l + '": ""'; }).join(', ');
      var b8 = LANGS8.map(function(l) { return '"' + l + '": [""]'; }).join(', ');

      var json = [
        '{',
        '  slug: \'' + slug + '\',',
        '  category: \'' + category + '\',',
        '  date: \'' + date + '\',',
        '  accent: ' + accent + ',',
        '  icon: \'' + icon + '\',',
        '  orig: \'[DOLDURULACAK: bu yazının özgün katkısı]\',',
        '  src: [',
        '    { t: \'Kaynak 1\', u: \'https://...\' },',
        '    { t: \'Kaynak 2\', u: \'https://...\' },',
        '    { t: \'Kaynak 3\', u: \'https://...\' }',
        '  ],',
        '  t: { tr: \'' + titleTR.replace(/'/g, "\\'") + '\', en: \'' + titleEN.replace(/'/g, "\\'") + '\', ' + t8 + ' },',
        '  e: { tr: \'' + excTR.replace(/'/g, "\\'") + '\', en: \'' + excEN.replace(/'/g, "\\'") + '\', ' + e8 + ' },',
        '  b: {',
        '    tr: [',
        '      \'[Giriş paragrafı]\',',
        '      { h: \'Ara Başlık\' },',
        '      \'[Devam eden içerik]\'',
        '    ],',
        '    en: [',
        '      \'[Introduction paragraph]\',',
        '      { h: \'Subheading\' },',
        '      \'[Body continues]\'',
        '    ],',
        '    ' + b8,
        '  }',
        '}'
      ].join('\n');

      output.value = json;
      output.hidden = false;
      output.select();
    });

    var copyBtn = $('#copyTemplate');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var out = $('#templateOutput');
        if (!out || out.hidden) return;
        out.select();
        navigator.clipboard && navigator.clipboard.writeText(out.value).then(function() {
          copyBtn.textContent = '✓ Kopyalandı';
          setTimeout(function() { copyBtn.textContent = 'Kopyala'; }, 1600);
        });
      });
    }
  }

  /* ── DURUM / HIZLI LİNKLER ──────────────────────────────────── */
  function renderStatus() {
    var el = $('#statusPanel');
    if (!el) return;
    var domain = CFG.siteUrl || 'https://qblogg.com';
    var mail   = CFG.mailTo  || 'hello@qblogg.com';

    el.innerHTML =
      '<div class="status-grid">' +
        '<div class="stat-card"><span class="stat-n">' + POSTS.length + '</span><span class="stat-l">Blog yazısı</span></div>' +
        '<div class="stat-card"><span class="stat-n">' + (window.QB_LANGS||[]).length + '</span><span class="stat-l">Aktif dil</span></div>' +
        '<div class="stat-card"><span class="stat-n">' + POSTS.filter(function(p){return p.featured;}).length + '</span><span class="stat-l">Öne çıkan</span></div>' +
      '</div>' +
      '<h3>Hızlı bağlantılar</h3>' +
      '<ul class="link-list">' +
        '<li><a href="' + esc(domain) + '" target="_blank" rel="noopener">↗ ' + esc(domain) + '</a></li>' +
        '<li><a href="' + esc(domain + '/blog.html') + '" target="_blank" rel="noopener">↗ Blog</a></li>' +
        '<li><a href="mailto:' + esc(mail) + '">✉ ' + esc(mail) + '</a></li>' +
      '</ul>' +
      '<h3>Terminal komutları</h3>' +
      '<div class="code-block">' +
        '<code>npm run check</code> — sağlık kontrolü<br>' +
        '<code>npm run dev</code> — yerel sunucu (localhost:8000)<br>' +
        '<code>npm run gorunurluk</code> — yayın ölçütü denetimi<br>' +
        '<code>npm run guvenlik</code> — güvenlik denetimi' +
      '</div>';
  }

  /* ── ANA BAŞLATICI ───────────────────────────────────────────── */
  function renderDashboard() {
    var dash = $('#dashboard');
    if (dash) dash.hidden = false;
    initTabs();
    renderPostList();
    initCatFilter();
    initTemplateForm();
    renderStatus();
    var yr = $('#year');
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  /* Sayfa yüklendiğinde: PIN kontrolü */
  document.addEventListener('DOMContentLoaded', function() {
    showPin();
  });

})();
