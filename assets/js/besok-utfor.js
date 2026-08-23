/* Arbeiderens rapportskjema.

   Kravet er 30 sekunder. Derfor: ett hovedvalg med store flater, sjekkliste
   bare når den trengs, valgfri kort melding, og ingen innlogging.
   Lenken bærer tilgangen, den utløper, og den virker én gang. */

(function () {
  'use strict';

  var L = window.PP_BESOK;
  var start;

  function kjor() {
    start = Date.now();

  function param(navn) {
    // Egen side: ?t=… i search. Ett-fils-versjon: #utfor?t=… i hash.
    if (navn === 't' && window.__ppToken) return window.__ppToken;
    var m = new RegExp('[?&]' + navn + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function vis(id) {
    ['sperret', 'skjema', 'ferdig'].forEach(function (x) {
      document.getElementById(x).hidden = x !== id;
    });
  }

  function sperr(tittel, tekst) {
    document.getElementById('sperre-tittel').textContent = tittel;
    document.getElementById('sperre-tekst').textContent = tekst;
    vis('sperret');
  }

  var token = param('t');
  if (!token) {
    sperr('Mangler lenke', 'Denne siden må åpnes gjennom lenken du fikk fra kontoret.');
    return;
  }

  var svar = L.hentMedToken(token);

  if (svar.status === 'ukjent') {
    sperr('Lenken virker ikke', 'Vi finner ikke dette besøket. Lenken kan være feil eller besøket kan være slettet.');
    return;
  }
  if (svar.status === 'utlopt') {
    sperr('Lenken er utløpt', 'Lenker virker i 12 timer. Denne er eldre enn det.');
    return;
  }
  if (svar.status === 'brukt') {
    sperr('Allerede rapportert', 'Dette besøket ble meldt inn ' +
      new Date(svar.besok.fullfortTid).toLocaleString('nb-NO') + '. Du trenger ikke gjøre noe mer.');
    return;
  }

  var b = svar.besok;
  var oppgaver = b.oppgaver.map(function (id) {
    return L.OPPGAVER.filter(function (o) { return o.id === id; })[0];
  }).filter(Boolean);

  document.getElementById('o-kunde').textContent = b.kunde;
  document.getElementById('o-nar').textContent = b.dato + ' kl. ' + b.tid;
  document.getElementById('o-oppgaver').textContent = oppgaver.map(function (o) { return o.navn; }).join(' · ');

  /* Varselet står over oppgavelista, ikke under. Det som kommer etter
     handlingen, er ikke et varsel – det er en unnskyldning. Språket følger
     besøket, slik at den som leser det, faktisk forstår det. */
  var varselFelt = document.getElementById('tillitsvarsel-tekst');
  if (varselFelt && window.PP_KLAGE) {
    varselFelt.textContent = window.PP_KLAGE.medarbeidervarsel(b.sprak || 'nb');
  }

  if (b.notat) {
    document.getElementById('o-notat-tekst').textContent = b.notat;
    document.getElementById('o-notat').hidden = false;
  }

  document.getElementById('sjekkliste').innerHTML = oppgaver.map(function (o) {
    return '<label><input type="checkbox" name="sjekk" value="' + o.id + '">' +
           '<span>' + L.ikonMarkup(o) + ' ' + o.navn + '</span></label>';
  }).join('');

  vis('skjema');

  var valgtUtfall = null;
  var sendKnapp = document.getElementById('send');
  var sjekkBlokk = document.getElementById('sjekk-blokk');
  var knapper = document.querySelectorAll('[data-utfall]');

  Array.prototype.forEach.call(knapper, function (k) {
    k.addEventListener('click', function () {
      Array.prototype.forEach.call(knapper, function (x) { x.setAttribute('aria-pressed', 'false'); });
      k.setAttribute('aria-pressed', 'true');
      valgtUtfall = k.getAttribute('data-utfall');

      // Sjekklisten er bare relevant når noe faktisk ble gjort delvis.
      sjekkBlokk.hidden = valgtUtfall !== 'delvis';
      sendKnapp.disabled = false;
      sendKnapp.textContent = valgtUtfall === 'ikke_utfort' ? 'Send inn' : 'Send inn og varsle pårørende';
      if (!b.parorendeEpost) sendKnapp.textContent = 'Send inn';
    });
  });

  sendKnapp.addEventListener('click', function () {
    if (!valgtUtfall) return;

    /* Dette feltet er der en helseopplysning oftest havner. Ikke fordi noen
       bryter en regel, men fordi det er det naturlige å skrive når man nettopp
       har vært hos et menneske. Sperren kommer før innsending, med en beskjed
       om hva man skal skrive i stedet. */
    var kommentar = document.getElementById('kommentar').value.trim();
    var vern = window.PP_VERN ? window.PP_VERN.sjekk(kommentar) : { ok: true };
    var feltfeil = document.querySelector('[data-error-for="kommentar"]');
    if (!vern.ok) {
      if (feltfeil) {
        feltfeil.textContent = vern.beskjed;
        feltfeil.classList.add('show');
      }
      document.getElementById('kommentar').focus();
      return;
    }
    if (feltfeil) feltfeil.classList.remove('show');

    sendKnapp.disabled = true;

    var sjekket = Array.prototype.filter
      .call(document.querySelectorAll('input[name="sjekk"]:checked'), Boolean)
      .map(function (i) { return i.value; });

    var rapport = {
      utfall: valgtUtfall,
      sjekkliste: valgtUtfall === 'delvis' ? sjekket : b.oppgaver,
      kommentar: kommentar || null,
      sekunder: Math.round((Date.now() - start) / 1000)
    };

    var res = L.fullfor(token, rapport);
    if (res.status === 'brukt') {
      sperr('Allerede rapportert', 'Rapporten var allerede sendt inn. Vi har ikke overskrevet den.');
      return;
    }

    var ferdig = res.besok;
    document.getElementById('f-tid').textContent =
      'Registrert kl. ' + new Date(ferdig.fullfortTid).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }) +
      ' · brukte ' + rapport.sekunder + ' sekunder';

    if (ferdig.parorendeEpost) {
      document.getElementById('f-melding').textContent = L.familiemelding(ferdig);
      document.getElementById('f-sendt').hidden = false;
    } else {
      document.getElementById('f-ikke-sendt').hidden = false;
    }
    vis('ferdig');
  });

    // Teller som viser at det faktisk går fort – for leverandøren som demonstrerer.
    if (window.__ppTeller) clearInterval(window.__ppTeller);
    window.__ppTeller = setInterval(function () {
      var s = Math.round((Date.now() - start) / 1000);
      var el = document.getElementById('teller');
      if (el) el.textContent = s + ' sekunder brukt så langt';
    }, 1000);
  }

  window.PP_RUTER = window.PP_RUTER || {};
  window.PP_RUTER['utfor'] = kjor;
  if (!window.PP_ENFIL) kjor();
})();