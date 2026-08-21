/* =============================================================================
   NAVIAR — booking flow
   Four steps: service -> time -> details -> confirm.

   Nothing is paid for here. Every request is a free scope check: a person
   reads it, decides whether NAVIAR may take it, and sends the scope, the price
   and a payment link afterwards. That is why the last step confirms what is
   being asked for rather than collecting money.
   Services of type 'delivery' (e.g. K01 "Brev forklart") have no meeting, so
   the time step is skipped for them.

   With CFG.apiBase set, availability, bookings and payment sessions come from
   server/. Without it the flow runs in demo mode and stores the booking in the
   browser so the pilot can still be walked through end to end.
   ========================================================================== */
(function (global) {
  'use strict';

  var CFG = global.NAVIAR_CONFIG;
  var I18n = global.NaviarI18n;

  var state = {
    step: 0,
    serviceId: null,
    date: null,      // 'YYYY-MM-DD'
    time: null,      // 'HH:MM'
    express: false,
    details: {},
    reference: null
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function byId(id) { return document.getElementById(id); }
  function service() { return global.naviarServiceById(state.serviceId); }
  function price(v) { return global.naviarFormatPrice(v); }
  function cat(id) { return (I18n.get('catalog') || {})[id] || {}; }

  function total() {
    var s = service();
    if (!s || s.price == null) return null;
    var amount = s.price;
    if (state.express) amount = Math.round(amount * (1 + CFG.surcharges.express24h));
    return amount;
  }

  /* Steps present for the chosen service. 'time' drops out for deliveries. */
  function steps() {
    var s = service();
    var list = ['service', 'time', 'details', 'confirm'];
    if (s && s.type === 'delivery') list.splice(1, 1);
    return list;
  }

  /* --------------------------------------------------------------- dates */
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* The strip starts at the first day that can still hold a slot: today plus
     the lead time, rounded down to midnight. Days inside the lead time would
     otherwise render as an empty grid. */
  function upcomingDays() {
    var out = [];
    var cursor = new Date(Date.now() + CFG.booking.leadTimeHours * 3600000);
    cursor.setHours(0, 0, 0, 0);
    for (var i = 0; out.length < 12 && i < CFG.booking.daysAhead + 7; i++) {
      var d = new Date(cursor.getTime() + i * 86400000);
      if (CFG.booking.workdays.indexOf(d.getDay()) !== -1) out.push(d);
    }
    return out;
  }

  /* First day in the strip that still has at least one free slot. */
  function firstOpenDay(minutes) {
    var days = upcomingDays();
    for (var i = 0; i < days.length; i++) {
      if (localSlots(iso(days[i]), minutes).length) return iso(days[i]);
    }
    return iso(days[0]);
  }

  function localSlots(dateStr, minutes) {
    var b = CFG.booking;
    var duration = minutes || 30;
    var out = [];
    var earliest = Date.now() + b.leadTimeHours * 3600000;
    for (var m = b.openHour * 60; m + duration <= b.closeHour * 60; m += b.slotMinutes) {
      var h = Math.floor(m / 60);
      var mm = m % 60;
      var when = new Date(dateStr + 'T' + pad(h) + ':' + pad(mm) + ':00');
      if (when.getTime() < earliest) continue;
      out.push(pad(h) + ':' + pad(mm));
    }
    return out;
  }

  function fetchTaken(dateStr) {
    if (!CFG.apiBase) return Promise.resolve([]);
    return fetch(CFG.apiBase + '/api/availability?date=' + encodeURIComponent(dateStr))
      .then(function (r) { return r.ok ? r.json() : { taken: [] }; })
      .then(function (j) { return j.taken || []; })
      .catch(function () { return []; });
  }

  /* ------------------------------------------------------------ step chrome */
  function renderSteps() {
    var host = byId('bkSteps');
    if (!host) return;
    var labels = I18n.get('booking.steps') || [];
    var present = steps();
    host.innerHTML = '';
    present.forEach(function (name, i) {
      var idx = ['service', 'time', 'details', 'confirm'].indexOf(name);
      var li = el('li');
      if (i === state.step) li.setAttribute('aria-current', 'step');
      if (i < state.step) li.className = 'done';
      li.appendChild(el('span', 'n', String(i + 1)));
      li.appendChild(el('span', null, labels[idx] || name));
      host.appendChild(li);
    });
  }

  function navRow(onBack, nextLabel, onNext, nextEnabled) {
    var row = el('div', 'finder-nav');
    if (onBack) {
      var back = el('button', 'btn-quiet', I18n.t('booking.back'));
      back.type = 'button';
      back.addEventListener('click', onBack);
      row.appendChild(back);
    } else {
      row.appendChild(el('span'));
    }
    if (nextLabel) {
      var next = el('button', 'btn btn-primary', nextLabel);
      next.type = 'button';
      next.disabled = !nextEnabled;
      next.addEventListener('click', onNext);
      row.appendChild(next);
    }
    return row;
  }

  function go(delta) {
    state.step = Math.max(0, Math.min(steps().length - 1, state.step + delta));
    render();
  }

  /* ----------------------------------------------------------- step: service */
  function stepService(host) {
    host.appendChild(el('h3', null, I18n.t('booking.chooseService')));

    ['advice', 'karriere', 'tolk'].forEach(function (group) {
      var items = CFG.services.filter(function (s) { return s.group === group; });
      if (!items.length) return;
      var label = el('p', 'eyebrow', I18n.t({
        advice:   'booking.groupAdvice',
        karriere: 'booking.groupCareer',
        tolk:     'booking.groupTolk'
      }[group]));
      label.style.marginTop = '22px';
      host.appendChild(label);

      var grid = el('div', 'service-grid');
      items.forEach(function (s) {
        var entry = cat(s.id);
        var btn = el('button', 'service-opt');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', String(state.serviceId === s.id));
        if (s.free) btn.appendChild(el('span', 'badge-free', s.minutes + ' min'));
        btn.appendChild(el('h4', null, entry.n || s.id));
        btn.appendChild(el('p', null, entry.d || ''));

        var meta = el('div', 'service-meta');
        meta.appendChild(el('span', 'service-price', price(s.price)));
        var right = s.perHour ? I18n.t('pricing.perHour')
                  : (s.type === 'delivery' ? (s.sla || '') : s.minutes + ' min');
        meta.appendChild(el('span', 'service-dur', right));
        btn.appendChild(meta);

        btn.addEventListener('click', function () {
          state.serviceId = s.id;
          state.time = null;
          state.date = null;
          state.step = 1;
          render();
        });
        grid.appendChild(btn);
      });
      host.appendChild(grid);
    });
  }

  /* -------------------------------------------------------------- step: time */
  function stepTime(host) {
    var s = service();
    host.appendChild(el('h3', null, I18n.t('booking.chooseTime')));
    var tz = el('p', 'finder-hint', I18n.t('booking.tzNote'));
    host.appendChild(tz);

    var days = upcomingDays();
    if (!state.date) state.date = firstOpenDay(s ? s.minutes : 30);

    var strip = el('div', 'day-strip');
    days.forEach(function (d) {
      var key = iso(d);
      var b = el('button', 'day');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(state.date === key));
      b.appendChild(el('span', 'dow', d.toLocaleDateString(I18n.lang, { weekday: 'short' })));
      b.appendChild(el('span', 'dnum', String(d.getDate())));
      b.appendChild(el('span', 'dmon', d.toLocaleDateString(I18n.lang, { month: 'short' })));
      b.addEventListener('click', function () {
        state.date = key;
        state.time = null;
        render();
      });
      strip.appendChild(b);
    });
    host.appendChild(strip);

    var slotHost = el('div', 'slots');
    var loading = el('p', 'slots-empty', I18n.t('booking.loadingSlots'));
    host.appendChild(loading);
    host.appendChild(slotHost);

    var nav = navRow(function () { go(-1); }, I18n.t('booking.next'),
      function () { go(1); }, Boolean(state.time));
    host.appendChild(nav);

    fetchTaken(state.date).then(function (taken) {
      loading.remove();
      var all = localSlots(state.date, s ? s.minutes : 30);
      if (!all.length) {
        slotHost.appendChild(el('p', 'slots-empty', I18n.t('booking.noSlots')));
        return;
      }
      all.forEach(function (t) {
        var b = el('button', 'slot', t);
        b.type = 'button';
        b.disabled = taken.indexOf(t) !== -1;
        b.setAttribute('aria-pressed', String(state.time === t));
        b.addEventListener('click', function () {
          state.time = t;
          render();
        });
        slotHost.appendChild(b);
      });
    });
  }

  /* ----------------------------------------------------------- step: details */
  function field(labelText, node, hint) {
    var wrap = el('div', 'field');
    var id = node.id || ('f_' + Math.random().toString(36).slice(2, 8));
    node.id = id;
    var label = el('label', null, labelText);
    label.setAttribute('for', id);
    wrap.appendChild(label);
    wrap.appendChild(node);
    if (hint) {
      var h = el('p', 'finder-hint', hint);
      h.style.margin = '6px 0 0';
      wrap.appendChild(h);
    }
    return wrap;
  }

  function input(name, type, required, value) {
    var i = el('input');
    i.type = type;
    i.name = name;
    if (required) i.required = true;
    if (value) i.value = value;
    return i;
  }

  function stepDetails(host) {
    var s = service();
    var d = state.details;
    host.appendChild(el('h3', null, I18n.t('booking.yourDetails')));

    var form = el('form');
    form.noValidate = true;

    var row1 = el('div', 'field-row');
    row1.appendChild(field(I18n.t('booking.name'), input('name', 'text', true, d.name)));
    row1.appendChild(field(I18n.t('booking.email'), input('email', 'email', true, d.email)));
    form.appendChild(row1);

    var row2 = el('div', 'field-row');
    row2.appendChild(field(I18n.t('booking.phone'), input('phone', 'tel', true, d.phone)));

    var langSel = el('select');
    langSel.name = 'lang';
    CFG.languages.forEach(function (l) {
      var o = el('option', null, l.label);
      o.value = l.code;
      if ((d.lang || I18n.lang) === l.code) o.selected = true;
      langSel.appendChild(o);
    });
    row2.appendChild(field(I18n.t('booking.lang'), langSel));
    form.appendChild(row2);

    /* Interpreter assignments need the target language, not just the UI one. */
    if (s && s.tolk) {
      var row3 = el('div', 'field-row');
      var tolkSel = el('select');
      tolkSel.name = 'tolkLang';
      tolkSel.required = true;
      var placeholder = el('option', null, '—');
      placeholder.value = '';
      tolkSel.appendChild(placeholder);
      CFG.tolkLanguages.forEach(function (name) {
        var o = el('option', null, name);
        o.value = name;
        if (d.tolkLang === name) o.selected = true;
        tolkSel.appendChild(o);
      });
      row3.appendChild(field(I18n.t('booking.tolkLangLabel'), tolkSel));
      row3.appendChild(field(I18n.t('booking.tolkDialect'), input('tolkDialect', 'text', false, d.tolkDialect)));
      form.appendChild(row3);
      /* Say this before taking money: for meetings with a public agency the
         agency normally has to provide and pay for the interpreter. */
      form.appendChild(el('p', 'status info show', I18n.t('booking.tolkNotice')));
    }

    if (s && s.type === 'delivery') {
      var note = el('p', 'status info show', I18n.t('booking.deliveryNote', { sla: s.sla || '' }));
      form.appendChild(note);
    } else {
      var chan = el('select');
      chan.name = 'channel';
      [['phone', 'channelPhone'], ['video', 'channelVideo'], ['office', 'channelOffice']]
        .forEach(function (pair) {
          var o = el('option', null, I18n.t('booking.' + pair[1]));
          o.value = pair[0];
          if (d.channel === pair[0]) o.selected = true;
          chan.appendChild(o);
        });
      form.appendChild(field(I18n.t('booking.channel'), chan));
    }

    /* A career request asks what the customer wants to achieve, not what their
       case is about — and it says outright that no CV belongs here. The CV, if
       one is needed at all, comes later over a separate secure link, and only
       for the personal review. */
    var career = Boolean(s && s.group === 'karriere');

    var ta = el('textarea');
    ta.name = 'caseText';
    ta.required = true;
    ta.placeholder = I18n.t(career ? 'booking.goalPlaceholder' : 'booking.casePlaceholder');
    if (d.caseText) ta.value = d.caseText;
    form.appendChild(field(I18n.t(career ? 'booking.goal' : 'booking.case'), ta,
                           I18n.t('booking.noSensitive')));

    var upload = el('p', 'status info show',
                    I18n.t(career ? 'booking.noDocs' : 'booking.uploadNote'));
    form.appendChild(upload);

    /* Express is a real +25% surcharge, shown before purchase (Blueprint 12.2) */
    if (s && !s.free && s.price != null) {
      var expWrap = el('label', 'consent');
      var exp = input('express', 'checkbox', false);
      exp.checked = state.express;
      exp.addEventListener('change', function () { state.express = exp.checked; render(); });
      expWrap.appendChild(exp);
      var expText = el('span');
      expText.appendChild(el('strong', null, I18n.t('booking.express')));
      expText.appendChild(el('span', null, ' ' + I18n.t('booking.expressD')));
      expWrap.appendChild(expText);
      form.appendChild(expWrap);
    }

    var consentWrap = el('label', 'consent');
    var consent = input('consent', 'checkbox', true);
    consent.checked = Boolean(d.consent);
    consentWrap.appendChild(consent);
    var consentText = el('span', null, I18n.t('booking.consent') + ' ');
    /* Consent has to be informed, so the notice is reachable from the box
       itself rather than only from the footer. */
    var notice = el('a', null, I18n.t('booking.consentLink'));
    notice.href = 'personvern.html';
    notice.target = '_blank';
    notice.rel = 'noopener';
    consentText.appendChild(notice);
    consentWrap.appendChild(consentText);
    form.appendChild(consentWrap);

    var status = el('p', 'status err');
    form.appendChild(status);
    host.appendChild(form);

    host.appendChild(navRow(function () { go(-1); }, I18n.t('booking.next'), function () {
      var data = new FormData(form);
      var required = ['name', 'email', 'phone', 'caseText'];
      if (s && s.tolk) required.push('tolkLang');
      var missing = required.filter(function (k) { return !String(data.get(k) || '').trim(); });
      if (missing.length || !consent.checked) {
        status.className = 'status err show';
        status.textContent = I18n.t('booking.errGeneric');
        form.querySelector('[name="' + (missing[0] || 'consent') + '"]').focus();
        return;
      }
      state.details = {
        name: data.get('name'), email: data.get('email'), phone: data.get('phone'),
        lang: data.get('lang'), channel: data.get('channel') || 'written',
        tolkLang: data.get('tolkLang') || '', tolkDialect: data.get('tolkDialect') || '',
        caseText: data.get('caseText'), consent: true
      };
      go(1);
    }, true));
  }

  /* ----------------------------------------------------------- step: payment */
  function summaryBlock() {
    var s = service();
    var box = el('div', 'summary');
    var dl = el('dl');
    function row(k, v) {
      dl.appendChild(el('dt', null, k));
      dl.appendChild(el('dd', null, v));
    }
    row(I18n.t('booking.service'), (cat(state.serviceId).n || '') + ' (' + s.code + ')');
    if (s.type !== 'delivery' && state.date && state.time) {
      var when = new Date(state.date + 'T' + state.time);
      row(I18n.t('booking.when'),
        when.toLocaleDateString(I18n.lang, { weekday: 'long', day: 'numeric', month: 'long' }) +
        ', ' + state.time);
    }
    if (s.minutes) row(I18n.t('booking.duration'), s.minutes + ' min');
    if (s.sla) row(I18n.t('pricing.delivery'), s.sla);
    if (state.express) row(I18n.t('booking.express'), '+25 %');
    box.appendChild(dl);

    var totalRow = el('dl', 'total');
    totalRow.appendChild(el('dt', null, I18n.t('booking.total')));
    var amount = total();
    var dd = el('dd', null, amount == null ? I18n.t('pricing.quote')
      : price(amount) + ' · ' + I18n.t('pricing.inclVat'));
    totalRow.appendChild(dd);
    box.appendChild(totalRow);
    return box;
  }

  function stepConfirm(host) {
    var s = service();
    host.appendChild(el('h3', null, I18n.t('booking.summary')));
    host.appendChild(summaryBlock());

    /* The list of work NAVIAR refuses, shown before the customer commits and
       not buried in the terms. The box below it is the customer saying their
       request is none of it — which is what the operator reads first. */
    host.appendChild(el('h3', null, I18n.t('booking.riskTitle')));
    host.appendChild(el('p', 'finder-hint', I18n.t('booking.riskLead')));

    var risks = el('ul', 'risk-list');
    (I18n.get('booking.riskItems') || []).forEach(function (item) {
      risks.appendChild(el('li', null, item));
    });
    host.appendChild(risks);

    var lowRiskWrap = el('label', 'consent');
    var lowRisk = el('input');
    lowRisk.type = 'checkbox';
    lowRisk.name = 'lowRisk';
    lowRisk.checked = Boolean(state.details.lowRisk);
    lowRiskWrap.appendChild(lowRisk);
    var lowRiskText = el('span', null, I18n.t('booking.riskConfirm') + ' ');
    var more = el('a', null, I18n.t('nav.limits'));
    more.href = 'hva-vi-gjor.html';
    more.target = '_blank';
    more.rel = 'noopener';
    lowRiskText.appendChild(more);
    lowRiskWrap.appendChild(lowRiskText);
    host.appendChild(lowRiskWrap);

    host.appendChild(el('p', 'status info show', I18n.t('booking.noPayNow')));

    if (s && s.tolk) host.appendChild(el('p', 'finder-hint', I18n.t('booking.tolkNotice')));

    var angre = el('p', 'finder-hint', I18n.t('booking.angrerett'));
    angre.style.marginTop = '16px';
    host.appendChild(angre);

    var status = el('p', 'status');
    host.appendChild(status);

    var nav = navRow(function () { go(-1); }, I18n.t('booking.confirm'), function () {
      if (!lowRisk.checked) {
        status.className = 'status err show';
        status.textContent = I18n.t('booking.riskConfirm');
        lowRisk.focus();
        return;
      }
      state.details.lowRisk = true;
      submit(status, nav);
    }, true);
    host.appendChild(nav);
  }

  /* ----------------------------------------------------------------- submit */
  function reference() {
    return 'NAV-' + Date.now().toString(36).toUpperCase().slice(-6);
  }

  function submit(status, nav) {
    var s = service();
    var button = nav.querySelector('.btn');
    button.disabled = true;
    button.textContent = I18n.t('booking.processing');
    status.className = 'status';

    var payload = {
      serviceId: s.id,
      serviceCode: s.code,
      date: state.date,
      time: state.time,
      express: state.express,
      /* Always 'none'. The site does not take money; the scope check comes
         first and the payment link is sent by a person afterwards. */
      payment: 'none',
      amount: total(),
      currency: CFG.currency,
      lang: I18n.lang,
      source: global.naviarSource,
      details: state.details
    };

    if (!CFG.apiBase) {
      state.reference = reference();
      try {
        var store = JSON.parse(localStorage.getItem('naviar.bookings') || '[]');
        store.push(Object.assign({ reference: state.reference, at: new Date().toISOString() }, payload));
        localStorage.setItem('naviar.bookings', JSON.stringify(store.slice(-100)));
      } catch (e) { /* private mode */ }

      renderDone(true);
      return;
    }

    fetch(CFG.apiBase + '/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.status === 409) throw new Error('slot');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (json) {
      state.reference = json.reference;
      renderDone(false);
    }).catch(function (err) {
      button.disabled = false;
      button.textContent = I18n.t('booking.confirm');
      status.className = 'status err show';
      status.textContent = err.message === 'slot'
        ? I18n.t('booking.errSlotTaken')
        : I18n.t('booking.errGeneric');
    });
  }

  function renderDone(demo, returned) {
    var host = byId('bkBody');
    var stepsHost = byId('bkSteps');
    if (stepsHost) stepsHost.innerHTML = '';
    host.innerHTML = '';

    var box = el('div', 'confirm');
    var mark = el('div', 'confirm-mark');
    mark.innerHTML =
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    box.appendChild(mark);
    box.appendChild(el('h3', null, I18n.t('booking.doneTitle')));
    box.appendChild(el('p', null, I18n.t('booking.doneLead')));
    box.appendChild(el('p', 'finder-hint', I18n.t('booking.reference')));
    box.appendChild(el('div', 'ref-box', state.reference));
    box.appendChild(el('p', null, I18n.t('booking.doneNext')));

    if (returned) {
      var back = el('p', 'status ' + (returned === 'paid' ? 'ok' : 'info') + ' show',
                    I18n.t(returned === 'paid' ? 'booking.returnPaid' : 'booking.returnCancelled'));
      back.style.textAlign = 'start';
      box.appendChild(back);
    }

    if (demo) {
      var warn = el('p', 'status info show', I18n.t('booking.demoNotice'));
      warn.style.textAlign = 'start';
      box.appendChild(warn);
    }

    var again = el('button', 'btn btn-outline', I18n.t('booking.another'));
    again.type = 'button';
    again.style.marginTop = '18px';
    again.addEventListener('click', function () {
      state = { step: 0, serviceId: null, date: null, time: null, express: false,
                details: {}, reference: null };
      render();
    });
    box.appendChild(again);
    host.appendChild(box);
  }

  /* ----------------------------------------------------------------- render */
  function render() {
    var host = byId('bkBody');
    if (!host || !I18n.ready) return;
    host.innerHTML = '';
    renderSteps();
    var name = steps()[state.step];
    if (name === 'service') stepService(host);
    else if (name === 'time') stepTime(host);
    else if (name === 'details') stepDetails(host);
    else stepConfirm(host);
  }

  /* Price cards and the need finder can preselect a service. */
  document.addEventListener('naviar:pickservice', function (e) {
    state.serviceId = e.detail.id;
    state.step = 1;
    state.date = null;
    state.time = null;
    render();
  });

  /* Stripe sends the customer back here after checkout. Without this the
     person who just paid 800 kr lands on an empty booking form. */
  function returnFromCheckout() {
    var qs = new URLSearchParams(global.location.search);
    var paid = qs.get('booking');
    var cancelled = qs.get('cancelled');
    var ref = paid || cancelled;
    if (!ref || !/^[A-Z0-9-]{4,32}$/.test(ref)) return false;
    state.reference = ref;
    renderDone(false, paid ? 'paid' : 'cancelled');
    return true;
  }

  document.addEventListener('naviar:lang', function () {
    if (!returnFromCheckout()) render();
  });
  global.NaviarBooking = {
    render: function () { if (!returnFromCheckout()) render(); },
    state: state
  };
})(window);
