/* Skjermbilde: historikk og hendelseslogg. */

(function () {
  'use strict';

  function start() {

  var L = window.PP_BESOK;
  var rader = document.getElementById('h-rader');
  if (!rader) return;

  document.getElementById('org-navn').textContent = L.leverandor().navn;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function klokke(iso) {
    var d = new Date(iso);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function tegn() {
    var ferdige = L.hentAlle().filter(function (b) { return b.status === 'fullfort'; }).reverse();

    document.getElementById('h-tomt').hidden = ferdige.length > 0;
    rader.closest('.table-scroll').hidden = ferdige.length === 0;

    rader.innerHTML = ferdige.map(function (b) {
      var u = L.UTFALL[b.rapport.utfall] || { navn: b.rapport.utfall, farge: 'planlagt' };
      var melding = b.parorendeEpost
        ? '<button class="btn btn-secondary" type="button" data-vis="' + b.id + '" style="font-size:.82rem;padding:6px 11px">Se melding</button>'
        : '<span class="muted">ikke sendt</span>';
      return '<tr>' +
        '<td><span class="b-id">' + esc(b.id) + '</span></td>' +
        '<td><strong>' + esc(b.kunde) + '</strong></td>' +
        '<td>' + esc(b.dato) + '</td>' +
        '<td>' + klokke(b.fullfortTid) + '</td>' +
        '<td>' + esc(b.ansattNavn) + '</td>' +
        '<td><span class="b-status ' + u.farge + '">' + esc(u.navn) + '</span></td>' +
        '<td>' + melding + '</td>' +
        '</tr>';
    }).join('');

    var logg = L.logg();
    document.getElementById('logg-rader').innerHTML = logg.length
      ? logg.map(function (l) {
          return '<tr><td class="b-id">' + new Date(l.tid).toLocaleString('nb-NO') + '</td>' +
                 '<td>' + esc(l.hendelse) + '</td>' +
                 '<td class="b-id">' + esc(l.gjelder) + '</td>' +
                 '<td>' + esc(l.hvem) + '</td></tr>';
        }).join('')
      : '<tr><td colspan="4" class="muted">Ingen hendelser registrert.</td></tr>';
  }

  rader.addEventListener('click', function (e) {
    var knapp = e.target.closest('[data-vis]');
    if (!knapp) return;
    var b = L.hent(knapp.getAttribute('data-vis'));
    if (!b) return;

    document.getElementById('h-mottaker').textContent = 'Sendt til ' + b.parorendeEpost + ' · ' + new Date(b.fullfortTid).toLocaleString('nb-NO');
    document.getElementById('h-emne').textContent = 'Emne: Besøk hos ' + b.kunde + ' er gjennomført';
    document.getElementById('h-tekst').textContent = L.familiemelding(b);

    var d = document.getElementById('h-detalj');
    d.hidden = false;
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('nullstill').addEventListener('click', function () {
    L.nullstill();
    location.reload();
  });

  tegn();
  }

  // Frittstående side: kjør ved lasting. Ett-fils-versjonen kaller start()
  // på nytt hver gang ruten vises, siden DOM-en da er synlig.
  window.PP_RUTER = window.PP_RUTER || {};
  window.PP_RUTER['historikk'] = start;
  if (!window.PP_ENFIL) start();
})();