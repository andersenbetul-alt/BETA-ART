/* Skjermbilde: opprett besøk. */

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
  var skjema = document.getElementById('nytt-skjema');
  if (!skjema) return;

  document.getElementById('org-navn').textContent = L.leverandor().navn;

  // Oppgavene er faste og kommer fra datalaget, ikke fra markupen.
  document.getElementById('oppgaveliste').innerHTML = L.OPPGAVER.map(function (o) {
    return '<label class="option"><input type="checkbox" name="oppgaver" value="' + o.id + '">' +
           '<span class="option-text">' + o.ikon + ' ' + o.navn + '</span></label>';
  }).join('');

  document.getElementById('ansatt').innerHTML =
    '<option value="">Velg …</option>' +
    L.ansatte().map(function (a) { return '<option value="' + a.id + '">' + a.navn + '</option>'; }).join('');

  var iDag = new Date();
  document.getElementById('dato').value =
    iDag.getFullYear() + '-' + String(iDag.getMonth() + 1).padStart(2, '0') + '-' + String(iDag.getDate()).padStart(2, '0');

  function feil(navn, vis) {
    var e = document.querySelector('[data-error-for="' + navn + '"]');
    if (e) e.classList.toggle('show', !!vis);
  }

  function avkrysset() {
    return Array.prototype.filter
      .call(document.querySelectorAll('input[name="oppgaver"]:checked'), Boolean)
      .map(function (i) { return i.value; });
  }

  skjema.addEventListener('submit', function (e) {
    e.preventDefault();

    var kunde = document.getElementById('kunde').value.trim();
    var oppgaver = avkrysset();
    var dato = document.getElementById('dato').value;
    var tid = document.getElementById('tid').value;
    var ansattId = document.getElementById('ansatt').value;
    var parorende = document.getElementById('parorende').value.trim();

    var ok = true;
    feil('kunde', !kunde); if (!kunde) ok = false;
    feil('oppgaver', !oppgaver.length); if (!oppgaver.length) ok = false;
    feil('dato', !dato); if (!dato) ok = false;
    feil('tid', !tid); if (!tid) ok = false;
    feil('ansatt', !ansattId); if (!ansattId) ok = false;

    var epostOk = !parorende || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(parorende);
    feil('parorende', !epostOk); if (!epostOk) ok = false;

    /* Beskjeden til arbeideren er det ene fritekstfeltet kontoret har. Den
       stoppes her, ikke i databasen – da rekker den aldri å bli lagret. */
    var notat = document.getElementById('notat').value.trim();
    var vern = window.PP_VERN ? window.PP_VERN.sjekk(notat) : { ok: true };
    if (!vern.ok) {
      var f = document.querySelector('[data-error-for="notat"]');
      if (f) f.textContent = vern.beskjed;
      ok = false;
    }
    feil('notat', !vern.ok);

    if (!ok) return;

    var ansatt = L.ansatte().filter(function (a) { return a.id === ansattId; })[0];

    var besok = L.opprett({
      kunde: kunde,
      oppgaver: oppgaver,
      dato: dato,
      tid: tid,
      ansattId: ansattId,
      ansattNavn: ansatt.navn,
      parorendeEpost: parorende || null,
      notat: notat || null
    });

    document.getElementById('k-ansatt').textContent = ansatt.navn;
    document.getElementById('k-lenke').textContent = arbeiderlenke(besok.token);
    document.getElementById('k-apne').href = arbeiderhref(besok.token);
    skjema.hidden = true;
    document.getElementById('kvittering').hidden = false;
  });

  document.getElementById('kopier').addEventListener('click', function () {
    var tekst = document.getElementById('k-lenke').textContent;
    var knapp = this;
    function bekreft() { knapp.textContent = '✓ Kopiert'; setTimeout(function () { knapp.textContent = 'Kopier'; }, 2000); }
    if (navigator.clipboard) navigator.clipboard.writeText(tekst).then(bekreft, function () {});
    else bekreft();
  });

  document.getElementById('nytt-igjen').addEventListener('click', function () {
    if (!window.PP_ENFIL) { location.reload(); return; }
    document.getElementById('nytt-skjema').reset();
    document.getElementById('nytt-skjema').hidden = false;
    document.getElementById('kvittering').hidden = true;
  });
  }

  // Frittstående side: kjør ved lasting. Ett-fils-versjonen kaller start()
  // på nytt hver gang ruten vises, siden DOM-en da er synlig.
  window.PP_RUTER = window.PP_RUTER || {};
  window.PP_RUTER['nytt'] = start;
  if (!window.PP_ENFIL) start();
})();