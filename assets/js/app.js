/* =============================================================================
   NAVIAR — page behaviour
   Renders every repeated block from the active dictionary, runs the need
   finder, the mobile navigation and the contact form.
   ========================================================================== */
(function (global) {
  'use strict';

  var CFG = global.NAVIAR_CONFIG;
  var I18n = global.NaviarI18n;

  /* ------------------------------------------------------------- utilities */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function byId(id) { return document.getElementById(id); }
  function svg(markup) {
    var span = document.createElement('span');
    span.innerHTML = markup;
    return span.firstElementChild;
  }
  var CHECK =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 6L9 17l-5-5"/></svg>';

  var ICONS = [
    '<path d="M4 4h16v16H4z"/><path d="M4 8l8 5 8-5"/>',
    '<path d="M9 3h7l4 4v14H9z"/><path d="M16 3v5h5"/><path d="M4 8v13h9"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    '<path d="M8 3h8v4H8z"/><path d="M4 7h16v14H4z"/><path d="M9 13h6M9 17h4"/>',
    '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 5.2a3.4 3.4 0 010 5.6"/>'
  ];

  global.naviarFormatPrice = function (amount) {
    if (amount == null) return I18n.t('pricing.quote');
    var n = new Intl.NumberFormat(I18n.lang === 'ti' ? 'en' : I18n.lang).format(amount);
    return n + ' ' + CFG.currency;
  };
  var price = global.naviarFormatPrice;

  /* Outreach attribution for the first-100 scoreboard: ?src=whatsapp,
     ?src=partner-x, ?utm_source=linkedin ... captured once, then remembered. */
  global.naviarSource = (function () {
    var qs = new URLSearchParams(global.location.search);
    var src = qs.get('src') || qs.get('utm_source') || '';
    try {
      if (src) localStorage.setItem('naviar.src', src.slice(0, 40));
      return src || localStorage.getItem('naviar.src') || 'direct';
    } catch (e) { return src || 'direct'; }
  })();

  function serviceById(id) {
    return CFG.services.filter(function (s) { return s.id === id; })[0];
  }
  global.naviarServiceById = serviceById;

  /* ---------------------------------------------------------------- render */
  function renderProcess() {
    var host = byId('processSteps');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('process.steps') || []).forEach(function (s) {
      var step = el('div', 'step');
      step.appendChild(el('h3', null, s.t));
      step.appendChild(el('p', null, s.d));
      host.appendChild(step);
    });
  }

  /* The hero card is the product itself: what lands in the customer's inbox,
     numbered, so the promise is concrete before anyone is asked to pay. */
  function renderHeroCard() {
    var host = byId('heroCardList');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('hero.card') || []).forEach(function (item, i) {
      var li = el('li');
      li.appendChild(el('span', 'step-n', '0' + (i + 1)));
      var body = el('div');
      body.appendChild(el('strong', null, item.t));
      body.appendChild(el('span', 'step-d', item.d));
      li.appendChild(body);
      host.appendChild(li);
    });
  }

  function renderStatus() {
    var host = byId('statusList');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('status.items') || []).forEach(function (text) {
      var li = el('li');
      li.appendChild(svg(CHECK));
      li.appendChild(el('span', null, text));
      host.appendChild(li);
    });
  }

  function renderAreas() {
    var host = byId('areaList');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('areas.items') || []).forEach(function (text) {
      var li = el('li', 'card');
      li.style.padding = '20px 22px';
      var row = el('div');
      row.style.cssText = 'display:flex;gap:12px;align-items:flex-start';
      row.appendChild(svg(CHECK));
      row.appendChild(el('span', null, text));
      li.appendChild(row);
      host.appendChild(li);
    });
  }

  function renderPricing() {
    var host = byId('priceCards');
    if (host) {
      host.innerHTML = '';
      CFG.services.forEach(function (svc) {
        var entry = (I18n.get('catalog') || {})[svc.id] || {};
        var card = el('article', 'card');
        if (svc.free) card.appendChild(el('span', 'badge-free', I18n.t('pricing.from') === '' ? '' : '0 ' + CFG.currency));
        card.appendChild(el('h3', null, entry.n || svc.id));
        card.appendChild(el('p', null, entry.d || ''));

        var p = el('p');
        p.style.cssText = 'font-family:Fraunces,serif;font-size:1.5rem;color:var(--navy);margin:14px 0 2px';
        p.textContent = price(svc.price);
        card.appendChild(p);

        var sub = el('p');
        sub.style.cssText = 'font-size:.8rem;color:var(--muted);margin:0 0 12px';
        sub.textContent = svc.price ? I18n.t('pricing.inclVat')
                        : (svc.sla ? I18n.t('pricing.delivery') + ': ' + svc.sla : '');
        card.appendChild(sub);

        var a = el('a', 'btn btn-outline', svc.price == null ? I18n.t('pricing.ask') : I18n.t('pricing.select'));
        a.href = '#booking';
        a.style.cssText = 'margin-top:8px;width:100%';
        a.addEventListener('click', function () {
          document.dispatchEvent(new CustomEvent('naviar:pickservice', { detail: { id: svc.id } }));
        });
        card.appendChild(a);
        host.appendChild(card);
      });
    }

    /* Full catalogue table — every code, every price, nothing hidden. */
    var body = byId('catalogBody');
    if (!body) return;
    body.innerHTML = '';
    CFG.services.forEach(function (s) {
      var entry = (I18n.get('catalog') || {})[s.id] || {};
      var tr = el('tr');
      var code = el('td', null, s.code);
      code.style.cssText = 'font-family:ui-monospace,Menlo,monospace;color:var(--muted);white-space:nowrap';
      tr.appendChild(code);

      var name = el('td');
      name.appendChild(el('strong', null, entry.n || s.id));
      var d = el('div', null, entry.d || '');
      d.style.cssText = 'font-size:.86rem;color:var(--body);margin-top:2px';
      name.appendChild(d);
      tr.appendChild(name);

      var dur = s.minutes ? s.minutes + ' min' : (s.sla || '—');
      var td = el('td', null, dur);
      td.style.cssText = 'white-space:nowrap;color:var(--body)';
      tr.appendChild(td);

      var pr = el('td', null, price(s.price));
      pr.style.cssText = 'white-space:nowrap;font-weight:600;color:var(--navy);text-align:end';
      tr.appendChild(pr);
      body.appendChild(tr);
    });
  }

  function renderSafety() {
    var host = byId('safetyRules');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('safety.rules') || []).forEach(function (rule) {
      var li = el('li');
      li.appendChild(svg(
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'));
      li.appendChild(el('span', null, rule));
      host.appendChild(li);
    });
  }

  function renderFaq() {
    var host = byId('faqList');
    if (!host) return;
    host.innerHTML = '';
    (I18n.get('faq.items') || []).forEach(function (item, i) {
      var d = el('details');
      if (i === 0) d.open = true;
      var s = el('summary');
      s.appendChild(el('span', null, item.q));
      d.appendChild(s);
      d.appendChild(el('p', null, item.a));
      host.appendChild(d);
    });
  }

  function renderStats() {
    var host = byId('trustStats');
    if (!host) return;
    host.innerHTML = '';
    [['languages', CFG.stats.languages], ['areas', CFG.stats.areas], ['reply', CFG.stats.reply]]
      .forEach(function (pair) {
        var div = el('div');
        div.appendChild(el('strong', null, pair[1]));
        div.appendChild(document.createTextNode(I18n.t('stats.' + pair[0])));
        host.appendChild(div);
      });

    var panel = byId('panelStats');
    if (!panel) return;
    panel.innerHTML = '';
    [['languages', CFG.stats.languages], ['areas', CFG.stats.areas],
     ['reply', CFG.stats.reply], ['written', CFG.stats.written]].forEach(function (pair) {
      var d = el('div', 'stat');
      d.appendChild(el('strong', null, pair[1]));
      d.appendChild(el('span', null, I18n.t('stats.' + pair[0])));
      panel.appendChild(d);
    });
  }

  function renderCompany() {
    var c = CFG.company;
    document.querySelectorAll('[data-company]').forEach(function (node) {
      var key = node.getAttribute('data-company');
      if (key === 'address') { node.innerHTML = c.address.join('<br>'); return; }
      if (key === 'emailLink') { node.href = 'mailto:' + c.email; node.textContent = c.email; return; }
      if (key === 'phoneLink') { node.href = 'tel:' + c.phoneHref; node.textContent = c.phone; return; }
      if (key === 'mailto') { node.href = 'mailto:' + c.email; return; }
      node.textContent = c[key] || '';
    });
  }

  /* ----------------------------------------------------------- need finder */
  /* Maps the first answer to the service that actually fits it. */
  /* Only the offers we sell today. Anything we cannot deliver yet routes to
     the free fit check, where a human says yes or no honestly. */
  var FINDER_MAP = ['k01', 'fit', 'fit', 'fit', 'k02'];
  var finderState = { step: 0, answers: [] };

  function recordNeed(answers) {
    var payload = {
      lang: I18n.lang,
      situation: answers[0],
      office: answers[1],
      urgency: answers[2],
      recommended: FINDER_MAP[answers[0]] || 'fit',
      source: global.naviarSource
    };
    if (CFG.apiBase) {
      fetch(CFG.apiBase + '/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () { /* never block the customer on analytics */ });
      return;
    }
    /* No backend yet: keep a local tally so the pilot still learns something. */
    try {
      var store = JSON.parse(localStorage.getItem('naviar.needs') || '[]');
      store.push(Object.assign({ at: new Date().toISOString() }, payload));
      localStorage.setItem('naviar.needs', JSON.stringify(store.slice(-200)));
    } catch (e) { /* private mode */ }
  }

  function renderFinder() {
    var host = byId('finderBody');
    if (!host) return;
    var questions = I18n.get('finder.questions') || [];
    var total = questions.length;
    host.innerHTML = '';

    var bar = el('div', 'finder-progress');
    for (var i = 0; i < total; i++) {
      var seg = el('span');
      if (i < finderState.step) seg.className = 'done';
      bar.appendChild(seg);
    }
    host.appendChild(bar);

    if (finderState.step < total) {
      var q = questions[finderState.step];
      var h = el('p', 'finder-q', q.q);
      h.setAttribute('role', 'heading');
      h.setAttribute('aria-level', '3');
      host.appendChild(h);
      host.appendChild(el('p', 'finder-hint', q.hint));

      var opts = el('div', 'opts');
      (q.options || []).forEach(function (label, idx) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.appendChild(el('span', 'opt-mark', String.fromCharCode(65 + idx)));
        b.appendChild(el('span', null, label));
        b.addEventListener('click', function () {
          finderState.answers[finderState.step] = idx;
          finderState.step += 1;
          if (finderState.step >= total) recordNeed(finderState.answers);
          renderFinder();
        });
        opts.appendChild(b);
      });
      host.appendChild(opts);

      var nav = el('div', 'finder-nav');
      if (finderState.step > 0) {
        var back = el('button', 'btn-quiet', I18n.t('finder.back'));
        back.type = 'button';
        back.addEventListener('click', function () {
          finderState.step -= 1;
          renderFinder();
        });
        nav.appendChild(back);
      } else {
        nav.appendChild(el('span'));
      }
      nav.appendChild(el('span', 'finder-hint',
        I18n.t('finder.progress', { n: finderState.step + 1, total: total })));
      host.appendChild(nav);
      return;
    }

    /* ---- result ---- */
    var serviceId = FINDER_MAP[finderState.answers[0]] || 'intro';
    var svc = serviceById(serviceId);
    var entry = (I18n.get('catalog') || {})[serviceId] || {};
    var urgent = finderState.answers[2] === 0;

    var box = el('div', 'finder-result');
    if (urgent) {
      var badge = el('span', 'result-badge');
      badge.appendChild(svg(
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2.2" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5v.5"/></svg>'));
      badge.appendChild(el('span', null, I18n.t('finder.urgent')));
      box.appendChild(badge);
    }
    box.appendChild(el('p', 'eyebrow', I18n.t('finder.resultTitle')));
    box.appendChild(el('h3', null, entry.n || ''));
    box.appendChild(el('p', null, entry.d || ''));

    var pr = el('p');
    pr.style.cssText = 'font-family:Fraunces,serif;font-size:1.35rem;color:var(--navy);margin:0';
    pr.textContent = svc ? price(svc.price) : '';
    box.appendChild(pr);
    if (svc && svc.price) {
      var vat = el('p', null, I18n.t('pricing.inclVat'));
      vat.style.cssText = 'font-size:.8rem;color:var(--muted);margin:2px 0 0';
      box.appendChild(vat);
    }

    var actions = el('div', 'result-actions');
    var go = el('a', 'btn btn-primary', I18n.t('finder.cta'));
    go.href = '#booking';
    go.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('naviar:pickservice', { detail: { id: serviceId } }));
    });
    actions.appendChild(go);

    var ask = el('a', 'btn btn-outline', I18n.t('finder.ctaAlt'));
    ask.href = '#contact';
    actions.appendChild(ask);

    var again = el('button', 'btn-quiet', I18n.t('finder.restart'));
    again.type = 'button';
    again.addEventListener('click', function () {
      finderState = { step: 0, answers: [] };
      renderFinder();
    });
    actions.appendChild(again);
    box.appendChild(actions);

    var thanks = el('p', 'finder-hint', I18n.t('finder.saved'));
    thanks.style.marginTop = '18px';
    box.appendChild(thanks);

    host.appendChild(box);
  }

  /* --------------------------------------------------------- contact form */
  function initContactForm() {
    var form = byId('contactForm');
    if (!form) return;
    var status = byId('contactStatus');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var payload = {
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone') || '',
        message: data.get('message'),
        lang: I18n.lang,
        source: global.naviarSource
      };

      function done() {
        status.className = 'status ok show';
        status.textContent = I18n.t('contact.sent');
        form.reset();
      }

      if (CFG.apiBase) {
        fetch(CFG.apiBase + '/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          done();
        }).catch(function () {
          status.className = 'status err show';
          status.textContent = I18n.t('booking.errGeneric');
        });
        return;
      }

      /* No backend: hand the enquiry to the visitor's own mail client. */
      var body = [
        payload.name, payload.email, payload.phone, '', payload.message
      ].join('\n');
      global.location.href = 'mailto:' + CFG.fallbackMailto +
        '?subject=' + encodeURIComponent('NAVIAR — ' + payload.name) +
        '&body=' + encodeURIComponent(body);
      done();
    });
  }

  /* ------------------------------------------------------------ chrome */
  function initNav() {
    var toggle = byId('navToggle');
    var links = byId('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function renderAll() {
    renderStats();
    renderHeroCard();
    renderProcess();
    renderStatus();
    renderAreas();
    renderPricing();
    renderSafety();
    renderFaq();
    renderFinder();
    renderCompany();
  }

  document.addEventListener('naviar:lang', renderAll);

  document.addEventListener('DOMContentLoaded', function () {
    var year = byId('year');
    if (year) year.textContent = new Date().getFullYear();
    initNav();
    initContactForm();
    I18n.init();
  });
})(window);
