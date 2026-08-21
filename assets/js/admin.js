/* =============================================================================
   NAVIAR case queue — the operator's side of the pilot.

   Reads the API's admin endpoints and lets one person move cases through the
   pilot workflow. The token lives in sessionStorage, so closing the tab logs
   you out; it is never written to the URL and never persisted to disk.
   ========================================================================== */
(function (global, document) {
  'use strict';

  var CFG = global.NAVIAR_CONFIG;
  var API = (CFG && CFG.apiBase) || '';
  var KEY = 'naviar.admin.token';

  var token = '';
  var data = null;
  var view = 'cases';
  var finderLabels = null;       // filled from the Norwegian locale

  function byId(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function show(node, msg, kind) {
    node.textContent = msg || '';
    node.className = 'status ' + (kind || 'err') + (msg ? ' show' : '');
  }

  /* ------------------------------------------------------------------ api */
  function call(path, options) {
    var opts = options || {};
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: Object.assign(
        { Authorization: 'Bearer ' + token },
        opts.body ? { 'Content-Type': 'application/json' } : {}
      ),
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      if (res.status === 401) throw new Error('Wrong token.');
      if (res.status === 429) throw new Error('Too many attempts. Locked out for 15 minutes.');
      if (res.status === 503) throw new Error('The admin queue is switched off: set a long ADMIN_TOKEN on the server.');
      if (!res.ok) throw new Error('Request failed (' + res.status + ').');
      return res.json();
    });
  }

  /* ----------------------------------------------------------------- gate */
  byId('gateForm').addEventListener('submit', function (e) {
    e.preventDefault();
    token = byId('token').value.trim();
    show(byId('gateErr'), '');
    load().then(function () {
      try { sessionStorage.setItem(KEY, token); } catch (err) { /* private mode */ }
      byId('gate').hidden = true;
      byId('app').hidden = false;
      render();
    }).catch(function (err) {
      token = '';
      show(byId('gateErr'), err.message);
    });
  });

  byId('signout').addEventListener('click', function () {
    token = '';
    data = null;
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    byId('app').hidden = true;
    byId('gate').hidden = false;
    byId('token').value = '';
  });

  byId('refresh').addEventListener('click', function () {
    load().then(render).catch(function (err) { show(byId('err'), err.message); });
  });

  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (tab) {
    tab.addEventListener('click', function () {
      view = tab.dataset.view;
      Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
        t.setAttribute('aria-selected', String(t === tab));
      });
      render();
    });
  });

  function load() {
    return call('/api/admin/queue?limit=200').then(function (res) {
      data = res;
      return res;
    });
  }

  /* --------------------------------------------------------------- render */
  function render() {
    show(byId('err'), '');
    renderCounts();
    var host = byId('view');
    host.innerHTML = '';
    if (view === 'cases') renderCases(host);
    else if (view === 'enquiries') renderEnquiries(host);
    else renderInsights(host);
  }

  function renderCounts() {
    var host = byId('counts');
    host.innerHTML = '';
    var c = data.counts;
    [
      ['Waiting on us', c.onUs],
      ['Open cases', c.open],
      ['Paid', c.paid],
      ['Revenue', c.revenue.toLocaleString('nb-NO') + ' kr'],
      ['Delivered', c.delivered],
      ['Enquiries', c.enquiries],
      ['Fit checks', c.needs]
    ].forEach(function (pair) {
      var box = el('div', 'count');
      box.appendChild(el('strong', null, String(pair[1])));
      box.appendChild(el('span', null, pair[0]));
      host.appendChild(box);
    });
  }

  function fact(list, label, value) {
    if (value == null || value === '') return;
    var p = el('div');
    p.appendChild(el('b', null, label + ': '));
    p.appendChild(document.createTextNode(String(value)));
    list.appendChild(p);
  }

  function renderCases(host) {
    if (!data.bookings.length) {
      host.appendChild(el('p', 'slots-empty', 'No cases yet.'));
      return;
    }
    data.bookings.forEach(function (b) {
      var card = el('article', 'case');

      var top = el('div', 'case-top');
      top.appendChild(el('span', 'ref', b.reference));
      top.appendChild(el('span', 'pill ' + b.status, b.status.replace(/_/g, ' ')));
      card.appendChild(top);

      var facts = el('div', 'facts');
      fact(facts, 'Service', b.service_code + (b.express ? ' + express' : ''));
      fact(facts, 'Customer', b.name);
      fact(facts, 'Email', b.email);
      fact(facts, 'Phone', b.phone);
      fact(facts, 'Language', b.customer_lang || b.lang);
      fact(facts, 'Slot', b.date ? b.date + ' ' + b.time : 'delivery');
      fact(facts, 'Amount', b.amount == null ? 'by quote' : b.amount + ' ' + b.currency);
      fact(facts, 'Payment', b.payment + (b.paid_at ? ' — paid' : ''));
      fact(facts, 'Channel', b.channel);
      fact(facts, 'Source', b.source);
      fact(facts, 'Interpreter', b.tolk_lang ? b.tolk_lang + (b.tolk_dialect ? ' / ' + b.tolk_dialect : '') : null);
      fact(facts, 'Created', new Date(b.created_at).toLocaleString('nb-NO'));
      card.appendChild(facts);

      card.appendChild(el('div', 'case-text', b.case_text));

      var actions = el('div', 'case-actions');
      /* Only the moves the workflow allows, so the operator cannot be told
         'no' after the fact. A finished case has nowhere to go, so the menu
         holds its own status alone. */
      var select = el('select');
      var allowed = [b.status].concat((data.transitions && data.transitions[b.status]) || []);
      allowed.forEach(function (s) {
        var o = el('option', null, s.replace(/_/g, ' '));
        o.value = s;
        if (s === b.status) o.selected = true;
        select.appendChild(o);
      });
      select.disabled = allowed.length < 2;
      var note = el('input');
      note.type = 'text';
      note.placeholder = 'Internal note (never shown to the customer)';
      note.value = b.internal_note || '';

      var save = el('button', 'btn btn-outline', 'Save');
      save.type = 'button';
      save.addEventListener('click', function () {
        save.disabled = true;
        call('/api/admin/booking', {
          method: 'POST',
          body: { reference: b.reference, status: select.value, note: note.value }
        }).then(function () {
          return load();
        }).then(render).catch(function (err) {
          save.disabled = false;
          show(byId('err'), err.message);
        });
      });

      actions.appendChild(select);
      actions.appendChild(note);
      actions.appendChild(save);
      card.appendChild(actions);

      var history = el('ul', 'history');
      var toggle = el('button', 'btn-quiet', 'History');
      toggle.type = 'button';
      toggle.addEventListener('click', function () {
        if (history.childNodes.length) { history.innerHTML = ''; return; }
        call('/api/admin/events?subject=' + encodeURIComponent(b.reference))
          .then(function (res) {
            res.events.forEach(function (ev) {
              history.appendChild(el('li', null,
                new Date(ev.at).toLocaleString('nb-NO') + ' · ' + ev.kind +
                (ev.detail ? ' · ' + ev.detail : '')));
            });
          })
          .catch(function (err) { show(byId('err'), err.message); });
      });
      card.appendChild(toggle);
      card.appendChild(history);

      host.appendChild(card);
    });
  }

  function renderEnquiries(host) {
    if (!data.enquiries.length) {
      host.appendChild(el('p', 'slots-empty', 'No enquiries yet.'));
      return;
    }
    data.enquiries.forEach(function (e) {
      var card = el('article', 'case');
      var top = el('div', 'case-top');
      top.appendChild(el('span', 'ref', e.name));
      top.appendChild(el('span', 'pill ' + e.status, e.status));
      card.appendChild(top);

      var facts = el('div', 'facts');
      fact(facts, 'Email', e.email);
      fact(facts, 'Phone', e.phone);
      fact(facts, 'Language', e.lang);
      fact(facts, 'Source', e.source);
      fact(facts, 'Received', new Date(e.at).toLocaleString('nb-NO'));
      card.appendChild(facts);

      card.appendChild(el('div', 'case-text', e.message));

      var actions = el('div', 'case-actions');
      var select = el('select');
      data.statuses.enquiry.forEach(function (s) {
        var o = el('option', null, s);
        o.value = s;
        if (s === e.status) o.selected = true;
        select.appendChild(o);
      });
      var note = el('input');
      note.type = 'text';
      note.placeholder = 'Internal note';
      note.value = e.internal_note || '';
      var save = el('button', 'btn btn-outline', 'Save');
      save.type = 'button';
      save.addEventListener('click', function () {
        save.disabled = true;
        call('/api/admin/enquiry', {
          method: 'POST',
          body: { id: e.id, status: select.value, note: note.value }
        }).then(load).then(render).catch(function (err) {
          save.disabled = false;
          show(byId('err'), err.message);
        });
      });
      actions.appendChild(select);
      actions.appendChild(note);
      actions.appendChild(save);
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  /* The need finder answers arrive as indexes, so borrow the Norwegian labels
     from the site's own translation file rather than duplicating them here. */
  function labels() {
    if (finderLabels) return Promise.resolve(finderLabels);
    return fetch('assets/i18n/no.json')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        finderLabels = json.finder.questions.map(function (q) { return q.options; });
        return finderLabels;
      })
      .catch(function () { return null; });
  }

  function bars(host, title, tallies, names) {
    var section = el('div');
    section.appendChild(el('h3', null, title));
    var rows = el('div', 'bars');
    var entries = Object.keys(tallies).map(function (k) { return [k, tallies[k]]; });
    var max = entries.reduce(function (m, e) { return Math.max(m, e[1]); }, 0) || 1;
    entries.sort(function (a, b) { return b[1] - a[1]; }).forEach(function (entry) {
      var row = el('div', 'bar-row');
      var label = entry[0];
      if (names && names[Number(label)] != null) label = names[Number(label)];
      if (label === 'null' || label === '') label = '—';
      row.appendChild(el('span', null, label));
      var bar = el('div', 'bar');
      var fill = el('i');
      fill.style.width = Math.round((entry[1] / max) * 100) + '%';
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el('strong', null, String(entry[1])));
      rows.appendChild(row);
    });
    section.appendChild(rows);
    section.style.marginBottom = '30px';
    host.appendChild(section);
  }

  function renderInsights(host) {
    host.appendChild(el('p', 'lead',
      'Every fit check answered by a visitor, with no personal data attached. ' +
      'This is the honest answer to “what do people actually need help with”.'));

    Promise.all([call('/api/insights'), labels()]).then(function (out) {
      var ins = out[0];
      var names = out[1];
      if (!ins.total) {
        host.appendChild(el('p', 'slots-empty', 'No answers yet.'));
        return;
      }
      bars(host, 'Situation', ins.bySituation, names && names[0]);
      bars(host, 'Which office', ins.byOffice, names && names[1]);
      bars(host, 'Urgency', ins.byUrgency, names && names[2]);
      bars(host, 'Language', ins.byLanguage, null);
      bars(host, 'Recommended offer', ins.byRecommendation, null);
      bars(host, 'Where they came from', ins.bySource, null);
      bars(host, 'Bookings by source', ins.bookingsBySource, null);
    }).catch(function (err) { show(byId('err'), err.message); });
  }

  /* Restore the session if the tab was only reloaded. */
  try {
    var saved = sessionStorage.getItem(KEY);
    if (saved) {
      token = saved;
      load().then(function () {
        byId('gate').hidden = true;
        byId('app').hidden = false;
        render();
      }).catch(function () {
        token = '';
        sessionStorage.removeItem(KEY);
      });
    }
  } catch (e) { /* private mode */ }
}(window, document));
