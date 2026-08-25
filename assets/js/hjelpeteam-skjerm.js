/* Skjermbilde: Mitt hjelpeteam – familiens side av kontinuiteten.

   Viser teamet rundt én kunde: hvem som kommer, hvilke dager som er blitt
   faste, og når det sist ble utført et besøk. Leser bare det som allerede
   finnes i besøkslisten; ingenting nytt lagres herfra. */

(function () {
  'use strict';

  var L = window.PP_BESOK;
  var T = window.PP_HJELPETEAM;

  var velger = document.getElementById('kundevelger');
  var flate = document.getElementById('teamflate');
  var tomt = document.getElementById('tomt');

  document.getElementById('org-navn').textContent = L.leverandor().navn;

  function datoTekst(iso) {
    if (!iso) return 'ingen fullførte ennå';
    var d = new Date(iso);
    return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' });
  }

  function oppgaveNavn(id) {
    var o = L.OPPGAVER.filter(function (x) { return x.id === id; })[0];
    return o ? o.navn : id;
  }

  function esc(s) {
    var div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  function tegn(kunde) {
    var r = T.lagTeam(L.hentAlle(), kunde);
    if (!r.team.length) {
      flate.innerHTML = '';
      tomt.hidden = false;
      return;
    }
    tomt.hidden = true;
    flate.innerHTML = r.team.map(function (m) {
      var fast = m.ansattId === r.fastHjelperId;
      return '<div class="b-kort">' +
        '<h2 style="margin-top:0">' + esc(m.navn) +
        (fast ? ' <span class="b-merke" style="font-size:.75rem;vertical-align:middle">Fast hjelper</span>' : '') +
        '</h2>' +
        '<p class="muted">' + m.fullfort + ' fullførte besøk' +
        (m.antall > m.fullfort ? ' · ' + (m.antall - m.fullfort) + ' planlagt' : '') +
        ' · siste: ' + esc(datoTekst(m.sisteFullfort)) + '</p>' +
        (m.fasteDager.length
          ? '<p><strong>Faste dager:</strong> ' + m.fasteDager.map(esc).join(', ') + '</p>'
          : '<p class="muted">Ingen fast dag ennå – det blir en vane fra andre besøk på samme ukedag.</p>') +
        (m.oppgaver.length
          ? '<p><strong>Hjelper med:</strong> ' + m.oppgaver.map(oppgaveNavn).map(esc).join(', ') + '</p>'
          : '') +
        '</div>';
    }).join('');
  }

  var alle = T.kunder(L.hentAlle());
  if (!alle.length) {
    velger.parentElement.hidden = true;
    tomt.hidden = false;
  } else {
    velger.innerHTML = alle.map(function (k) {
      return '<option value="' + esc(k) + '">' + esc(k) + '</option>';
    }).join('');
    velger.addEventListener('change', function () { tegn(velger.value); });
    tegn(alle[0]);
  }
})();
