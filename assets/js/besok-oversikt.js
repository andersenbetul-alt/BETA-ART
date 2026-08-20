/* Skjermbilde: kommende besøk. */

(function () {
  'use strict';

  function start() {
  /* Lenken må bygges likt uansett om appen kjører som egne sider eller som
     én fil med hash-ruting. */
  function arbeiderlenke(token) {
    if (window.PP_ENFIL) return location.href.split('#')[0] + '#utfor?t=' + token;
    return location.href.split('?')[0].replace(/[^/]*$/, 'utfor.html?t=' + token);
  }

  function arbeiderhref(token) {
    return window.PP_ENFIL ? '#utfor?t=' + token : 'utfor.html?t=' + token;
  }


  var L = window.PP_BESOK;
  var rader = document.getElementById('rader');
  if (!rader) return;

  document.getElementById('org-navn').textContent = L.leverandor().navn;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function oppgavenavn(ider) {
    return ider.map(function (id) {
      var o = L.OPPGAVER.filter(function (x) { return x.id === id; })[0];
      return o ? o.ikon + ' ' + o.navn : id;
    }).join(', ');
  }

  function utlopt(b) { return b.utloper && new Date(b.utloper) < new Date(); }

  function tegn() {
    var apne = L.hentAlle().filter(function (b) { return b.status !== 'fullfort'; });

    document.getElementById('tomt').hidden = apne.length > 0;
    rader.closest('.table-scroll').hidden = apne.length === 0;

    rader.innerHTML = apne.map(function (b) {
      var status = utlopt(b)
        ? '<span class="b-status avvik">Lenke utløpt</span>'
        : '<span class="b-status planlagt">Venter på rapport</span>';
      return '<tr data-id="' + b.id + '" style="cursor:pointer">' +
        '<td><span class="b-id">' + esc(b.id) + '</span></td>' +
        '<td><strong>' + esc(b.kunde) + '</strong></td>' +
        '<td>' + esc(oppgavenavn(b.oppgaver)) + '</td>' +
        '<td>' + esc(b.dato) + ' kl. ' + esc(b.tid) + '</td>' +
        '<td>' + esc(b.ansattNavn) + '</td>' +
        '<td>' + (b.parorendeEpost ? esc(b.parorendeEpost) : '<span class="muted">ingen</span>') + '</td>' +
        '<td>' + status + '</td>' +
        '</tr>';
    }).join('');
  }

  rader.addEventListener('click', function (e) {
    var rad = e.target.closest('[data-id]');
    if (!rad) return;
    var b = L.hent(rad.getAttribute('data-id'));
    if (!b) return;

    document.getElementById('d-tittel').textContent = b.kunde + ' · ' + b.dato + ' kl. ' + b.tid;
    document.getElementById('d-meta').textContent =
      oppgavenavn(b.oppgaver) + ' · utføres av ' + b.ansattNavn +
      (b.notat ? ' · beskjed: «' + b.notat + '»' : '');
    document.getElementById('d-lenke').textContent = arbeiderlenke(b.token);
    document.getElementById('d-apne').href = arbeiderhref(b.token);

    var utlop = new Date(b.utloper);
    document.getElementById('d-utlop').textContent = utlopt(b)
      ? 'Lenken utløp ' + utlop.toLocaleString('nb-NO') + '. Opprett besøket på nytt for å få en ny lenke.'
      : 'Lenken virker til ' + utlop.toLocaleString('nb-NO') + ', og kan brukes én gang.';

    var detalj = document.getElementById('detalj');
    detalj.hidden = false;
    detalj.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  tegn();
  }

  // Frittstående side: kjør ved lasting. Ett-fils-versjonen kaller start()
  // på nytt hver gang ruten vises, siden DOM-en da er synlig.
  window.PP_RUTER = window.PP_RUTER || {};
  window.PP_RUTER['oversikt'] = start;
  if (!window.PP_ENFIL) start();
})();