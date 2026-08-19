/* PårørendePilot – bestillingsflyt i Senior Mode.
   Utformet for at én person over 75 skal klare den alene: ett spørsmål om gangen,
   store trykkflater, ingen skjulte valg, og pris før bestilling.
   Demo: ingen ekte oppdrag opprettes. */

(function () {
  'use strict';

  var panelWrap = document.querySelector('main .wrap');
  if (!panelWrap) return;

  var SISTE_SPORSMAL = 4;
  var panel = 1;

  var valg = {
    nar: null,
    oppgave: null,
    timer: null,
    beskrivelse: '',
    sprak: '',
    fastHjelper: true,
    varsleFamilie: true
  };

  var tilbakeBtn = document.getElementById('senior-tilbake');
  var nesteBtn = document.getElementById('senior-neste');
  var bestillBtn = document.getElementById('senior-bestill');
  var nav = document.getElementById('senior-nav');

  function paneler() { return document.querySelectorAll('.senior-panel[data-panel]'); }

  function visPanel(n) {
    panel = n;
    Array.prototype.forEach.call(paneler(), function (p) {
      p.hidden = Number(p.getAttribute('data-panel')) !== n;
    });
    tilbakeBtn.hidden = n === 1 || n > SISTE_SPORSMAL;
    nesteBtn.hidden = n >= SISTE_SPORSMAL;
    bestillBtn.hidden = n !== SISTE_SPORSMAL;
    nav.hidden = n > SISTE_SPORSMAL;
    if (n === SISTE_SPORSMAL) { visPris(); oppdaterHasteport(); }
    oppdaterNeste();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function oppdaterNeste() {
    var klar = true;
    if (panel === 1) klar = !!valg.nar;
    if (panel === 2) klar = !!valg.oppgave;
    if (panel === 3) klar = !!valg.timer;
    nesteBtn.disabled = !klar;
  }

  /* ---------- valgknapper ---------- */

  function knyttValg(attributt, nokkel, etterValg) {
    var knapper = document.querySelectorAll('[data-' + attributt + ']');
    Array.prototype.forEach.call(knapper, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(knapper, function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        valg[nokkel] = btn.getAttribute('data-' + attributt);
        if (etterValg) etterValg(valg[nokkel]);
        oppdaterNeste();
      });
    });
  }

  knyttValg('nar', 'nar', function (v) {
    var felt = document.getElementById('tidspunkt-felt');
    felt.hidden = !(v === 'planlagt' || v === 'fast');
    oppdaterHasteport();
  });
  knyttValg('oppgave', 'oppgave');
  knyttValg('timer', 'timer');

  var beskrivelse = document.getElementById('beskrivelse');

  /* ---------- akutt-gjenkjenning ----------
     Selve vurderingen ligger i assets/js/akutt.js, som er ren og testbar.
     Her kobles den til flyten, i tre lag:

       RØDT      stopper bestillingen og viser nødnumrene
       GULT      stiller et spørsmål, men slipper brukeren videre
       hasteport ved «nå» spør vi om bevissthet og pust uansett hva som er skrevet

     Avvisningen av et varsel gjelder bare den teksten brukeren faktisk avviste.
     Tidligere gjaldt den hele økten, slik at ett falskt varsel slo av vernet
     for alt som ble skrevet etterpå. */

  var nodVarsel = document.getElementById('nod-varsel');
  var gulVarsel = document.getElementById('gul-varsel');
  var avvistTekst = null;

  function normaliser(t) {
    return String(t == null ? '' : t).toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function skjulVarsler() {
    nodVarsel.hidden = true;
    if (gulVarsel) gulVarsel.hidden = true;
  }

  /**
   * @returns {boolean} true når bestillingen skal stoppes.
   */
  function sjekkAkutt(tekst) {
    var vurdering = window.PP_AKUTT.vurder(tekst);

    if (vurdering.niva === 'ingen') {
      skjulVarsler();
      return false;
    }

    if (vurdering.niva === 'gul') {
      nodVarsel.hidden = true;
      if (gulVarsel) gulVarsel.hidden = false;
      return false;
    }

    // RØDT. Avvisning gjelder kun nøyaktig den teksten som ble avvist.
    if (avvistTekst !== null && normaliser(tekst) === avvistTekst) {
      nodVarsel.hidden = true;
      return false;
    }

    if (gulVarsel) gulVarsel.hidden = true;
    nodVarsel.hidden = false;
    nodVarsel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  document.getElementById('nod-lukk').addEventListener('click', function () {
    avvistTekst = normaliser(beskrivelse.value);
    nodVarsel.hidden = true;
  });

  /* ---------- lag 3: hasteport ved «nå» ---------- */

  var hasteport = document.getElementById('hasteport');
  var hasteportSvar = null;

  function oppdaterHasteport() {
    if (!hasteport) return;
    var kreves = window.PP_AKUTT.kreverHasteport(valg.nar);
    hasteport.hidden = !kreves;
    if (!kreves) hasteportSvar = null;
  }

  if (hasteport) {
    hasteport.addEventListener('click', function (e) {
      var knapp = e.target.closest('[data-hasteport]');
      if (!knapp) return;
      hasteportSvar = knapp.getAttribute('data-hasteport');
      Array.prototype.forEach.call(hasteport.querySelectorAll('[data-hasteport]'), function (b) {
        b.setAttribute('aria-pressed', String(b === knapp));
      });
      if (window.PP_AKUTT.hasteportStopper(hasteportSvar)) {
        nodVarsel.hidden = false;
        nodVarsel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        nodVarsel.hidden = true;
      }
    });
  }

  beskrivelse.addEventListener('blur', function () {
    valg.beskrivelse = beskrivelse.value.trim();
    sjekkAkutt(valg.beskrivelse);
  });

  /* ---------- stemmeinput ----------
     Bruker nettleserens egen taledikteringen der den finnes. Mikrofonen slås på
     bare når brukeren trykker, og slås av igjen umiddelbart etterpå. */

  var stemmeKnapp = document.getElementById('stemme-knapp');
  var stemmeTekst = document.getElementById('stemme-tekst');
  var Gjenkjenner = window.SpeechRecognition || window.webkitSpeechRecognition;
  var gjenkjenner = null;

  // Enkel intensjonstolkning: nøkkelord → oppdragstype.
  var INTENSJONER = [
    { oppgave: 'handling', ord: ['handle', 'butikk', 'mat', 'dagligvare', 'apotek', 'post', 'kjøpe'] },
    { oppgave: 'folge',    ord: ['lege', 'legetime', 'sykehus', 'tannlege', 'frisør', 'følge', 'time hos'] },
    { oppgave: 'samvaer',  ord: ['prate', 'snakke', 'kaffe', 'selskap', 'ensom', 'besøk', 'sammen'] },
    { oppgave: 'aktivitet',ord: ['kino', 'konsert', 'museum', 'teater', 'kirke', 'park', 'tur ut'] },
    { oppgave: 'hjemme',   ord: ['lyspære', 'rydde', 'søppel', 'bære', 'hjemme', 'vaske', 'flytte'] },
    { oppgave: 'digital',  ord: ['telefon', 'mobil', 'nettbrett', 'tv', 'internett', 'data', 'videosamtale'] },
    { oppgave: 'dyr',      ord: ['hund', 'katt', 'lufte', 'kjæledyr', 'fôr'] }
  ];

  function tolkTekst(tekst) {
    var t = tekst.toLowerCase();
    var funnet = null;
    INTENSJONER.some(function (i) {
      if (i.ord.some(function (o) { return t.indexOf(o) !== -1; })) { funnet = i.oppgave; return true; }
      return false;
    });
    return funnet;
  }

  function velgOppgave(oppgave) {
    var btn = document.querySelector('[data-oppgave="' + oppgave + '"]');
    if (btn) btn.click();
  }

  if (!Gjenkjenner) {
    stemmeKnapp.disabled = true;
    stemmeTekst.textContent = 'Nettleseren din støtter ikke tale. Velg med knappene over, eller ring oss på 400 00 000.';
  } else {
    stemmeKnapp.addEventListener('click', function () {
      if (stemmeKnapp.getAttribute('aria-pressed') === 'true' && gjenkjenner) {
        gjenkjenner.stop();
        return;
      }
      gjenkjenner = new Gjenkjenner();
      gjenkjenner.lang = 'nb-NO';
      gjenkjenner.interimResults = false;
      gjenkjenner.maxAlternatives = 1;

      stemmeKnapp.setAttribute('aria-pressed', 'true');
      stemmeTekst.textContent = 'Jeg lytter … fortell hva du trenger.';

      gjenkjenner.onresult = function (e) {
        var tekst = e.results[0][0].transcript;
        stemmeTekst.innerHTML = 'Du sa: <strong>«' + tekst + '»</strong>';
        beskrivelse.value = tekst;
        valg.beskrivelse = tekst;

        if (sjekkAkutt(tekst)) return;

        var oppgave = tolkTekst(tekst);
        if (oppgave) {
          velgOppgave(oppgave);
          stemmeTekst.innerHTML += '<br>Jeg har valgt kategorien for deg. Stemmer det?';
        } else {
          stemmeTekst.innerHTML += '<br>Velg gjerne en av knappene over som passer best.';
        }
      };
      gjenkjenner.onerror = function () {
        stemmeTekst.textContent = 'Jeg klarte ikke å høre. Prøv igjen, eller bruk knappene over.';
      };
      gjenkjenner.onend = function () {
        stemmeKnapp.setAttribute('aria-pressed', 'false');
      };
      gjenkjenner.start();
    });
  }

  /* ---------- pris ---------- */

  function erKveld() {
    var t = document.getElementById('klokkeslett');
    if (valg.nar === 'na' || valg.nar === 'idag') return new Date().getHours() >= 17;
    if (t && t.value) return Number(t.value.split(':')[0]) >= 17;
    return false;
  }

  function erHelg() {
    var d = document.getElementById('dato');
    var dato = (valg.nar === 'planlagt' || valg.nar === 'fast') && d && d.value ? new Date(d.value) : new Date();
    var dag = dato.getDay();
    return dag === 0 || dag === 6;
  }

  function visPris() {
    valg.sprak = document.getElementById('sprakonske').value;
    valg.fastHjelper = document.getElementById('fast-hjelper').checked;

    var pris = window.PP_PRIS.beregn({
      land: 'NO',
      timer: Number(valg.timer),
      nar: valg.nar,
      oppgave: valg.oppgave,
      reisetidMin: 15,
      kveld: erKveld(),
      helg: erHelg()
    });

    var html = pris.linjer.map(function (l) {
      return '<div class="pris-linje"><span>' + l.navn + '</span><span>' + pris.formater(l.belop) + '</span></div>';
    }).join('');

    document.getElementById('pris-linjer').innerHTML = html;
    document.getElementById('pris-total').textContent = pris.formater(pris.total);
  }

  /* ---------- navigasjon ---------- */

  nesteBtn.addEventListener('click', function () {
    if (panel === 2) {
      valg.beskrivelse = beskrivelse.value.trim();
      if (sjekkAkutt(valg.beskrivelse)) return;
    }
    visPanel(Math.min(panel + 1, SISTE_SPORSMAL));
  });

  tilbakeBtn.addEventListener('click', function () {
    visPanel(Math.max(panel - 1, 1));
  });

  /* ---------- bestilling og matching ----------
     Matchingrekkefølgen speiler regelen «nærmeste kvalifiserte og betrodde hjelper»:
     fast hjelper → Care Circle → verifiserte hjelpere i nærheten. */

  var SOKESTEG = [
    { tekst: 'Spør favoritthjelperen din …', ms: 1400 },
    { tekst: 'Sjekker hvem som er ledige i nærheten …', ms: 1400 },
    { tekst: 'Kontrollerer verifisering og oppdragstype …', ms: 1200 },
    { tekst: 'Fant en hjelper!', ms: 700 }
  ];

  function kjorSok(indeks) {
    var status = document.getElementById('soker-status');
    if (indeks >= SOKESTEG.length) {
      visPanel(6);
      return;
    }
    var steg = SOKESTEG[indeks];
    // Uten fast hjelper hopper vi over første steg.
    if (indeks === 0 && !valg.fastHjelper) {
      kjorSok(1);
      return;
    }
    status.textContent = steg.tekst;
    setTimeout(function () { kjorSok(indeks + 1); }, steg.ms);
  }

  bestillBtn.addEventListener('click', function () {
    // Teksten kan ha endret seg etter forrige kontroll, og den som har det
    // travelt skriver ofte først på siste steg. Derfor kontrolleres den her igjen.
    valg.beskrivelse = beskrivelse.value.trim();
    if (sjekkAkutt(valg.beskrivelse)) return;

    if (window.PP_AKUTT.kreverHasteport(valg.nar)) {
      if (hasteportSvar === null) {
        hasteport.hidden = false;
        hasteport.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (window.PP_AKUTT.hasteportStopper(hasteportSvar)) {
        nodVarsel.hidden = false;
        nodVarsel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    valg.varsleFamilie = document.getElementById('varsle-familie').checked;
    visPanel(5);
    kjorSok(0);
  });

  document.getElementById('bekreft-hjelper').addEventListener('click', function () {
    visPanel(7);
  });

  document.getElementById('annen-hjelper').addEventListener('click', function () {
    visPanel(5);
    valg.fastHjelper = false;
    kjorSok(1);
  });

  /* ---------- oppstart ---------- */
  visPanel(1);
})();
