/* Naviar – den eldres godkjenningsskjerm.

   Familien har funnet en tid. Denne skjermen er stedet der avtalen enten blir
   noe av eller ikke, og svaret er hennes alene.

   Skjermen skriver ikke sitt eget utfall. Den kaller PP_EKSPERT.godkjenn og
   viser det som kommer tilbake – også når det kommer tilbake som «venter».
   Grunnen er den samme som i bestillingsskjermen: en hyggelig kvittering her
   ville love noe systemet ikke har sagt ja til. */

(function () {
  'use strict';

  var E = window.PP_EKSPERT;
  var K = window.PP_KLARHET;
  var S = window.PP_SPRAK_UI;
  if (!E || !K || !S) return;

  /* Avtalen som ligger til godkjenning. I piloten er den demodata; senere
     kommer den fra PP_API. Formen er den samme. */
  var AVTALE = {
    fra: 'Lars',
    ekspert: 'Kari Hansen',
    rolle: 'NAV-rådgiver',
    kategori: 'nav',
    tid: 'Mandag 10.00',
    kanal: 'telefon',
    minutter: 45
  };

  var sprak = 'nb';
  var svart = null;

  function lag(tag, klasse, tekst) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (tekst !== undefined && tekst !== null) n.textContent = tekst;
    return n;
  }
  function ved(id) { return document.getElementById(id); }

  /* ---------- det hun godkjenner ---------- */

  function tegnDetaljer() {
    var dl = ved('detaljer');
    if (!dl) return;
    dl.textContent = '';

    var k = E.kategori(AVTALE.kategori);
    var kanal = E.KANAL.filter(function (x) { return x.id === AVTALE.kanal; })[0];

    var rader = [
      { navn: 'Hvem', verdi: AVTALE.ekspert,
        under: E.PROFILTITTEL.mal.replace('{rolle}', AVTALE.rolle) },
      { navn: 'Om hva', verdi: k ? k.navn : '–' },
      { navn: 'Når', verdi: AVTALE.tid,
        under: AVTALE.minutter + ' minutter' },
      { navn: 'Hvordan', verdi: kanal ? kanal.navn : AVTALE.kanal,
        under: kanal ? kanal.kort : null },
      /* Prisen står her selv om hun ikke betaler. Å bli bedt om å godkjenne
         noe uten å få vite hva det koster, er å bli holdt utenfor. */
      { navn: 'Pris', verdi: K.PAKKE.pris + ' kr',
        under: AVTALE.fra + ' betaler' }
    ];

    rader.forEach(function (r) {
      var d = lag('div');
      d.appendChild(lag('dt', null, r.navn));
      var dd = lag('dd', null, r.verdi);
      if (r.under) dd.appendChild(lag('span', 'g-liten', r.under));
      d.appendChild(dd);
      dl.appendChild(d);
    });
  }

  /* Grensene, med hennes ord. Den som skal si ja, skal vite hva hun sier ja
     til – og like viktig, hva hun ikke får, så hun slipper å oppdage det
     midt i samtalen. */
  function tegnGrenser() {
    var k = E.kategori(AVTALE.kategori);
    if (!k) return;

    var kan = ved('kan');
    if (kan) kan.textContent = k.gjorLettere + '.';

    var ul = ved('kan-ikke');
    if (!ul) return;
    ul.textContent = '';
    k.girIkkeRett.forEach(function (g) {
      ul.appendChild(lag('li', null, g.replace(/^Å /, '')));
    });
  }

  function tegnFra() {
    var n = ved('fra');
    if (n) n.textContent = AVTALE.fra + ' har funnet en tid til deg.';
    var h1 = document.querySelector('.g-kort h1');
    if (h1) h1.textContent = 'Vil du snakke med ' + AVTALE.ekspert + '?';
  }

  /* ---------- svaret ---------- */

  function svar(hva, onske) {
    var dom = E.godkjenn({
      svar: hva,
      ekspert: AVTALE.ekspert,
      kanal: AVTALE.kanal,
      sprak: sprak,
      onske: onske || null
    });

    svart = hva;
    ['ja', 'nei'].forEach(function (id) {
      var b = ved(id);
      if (b) b.setAttribute('aria-pressed', hva === id ? 'true' : 'false');
    });

    var boks = ved('utfall');
    if (!boks) return;
    boks.textContent = '';
    boks.hidden = false;
    boks.dataset.tilstand = dom.tilstand;

    if (dom.tilstand === 'godkjent') {
      boks.appendChild(lag('h2', null, 'Takk. Da er det avtalt.'));
      boks.appendChild(lag('p', null,
        AVTALE.ekspert + ' ringer deg ' + AVTALE.tid.toLowerCase() + '. ' +
        AVTALE.fra + ' får beskjed om at du har sagt ja.'));
      boks.appendChild(lag('p', null, dom.angre + '.'));
    } else if (dom.tilstand === 'avslatt') {
      boks.appendChild(lag('h2', null, 'Greit. Da blir det ikke noe av.'));
      boks.appendChild(lag('p', null, dom.grunn + '.'));
      /* Familien får utfallet, ikke grunnen. Grunnen er hennes. */
      boks.appendChild(lag('p', null,
        AVTALE.fra + ' får bare beskjeden: «' + dom.tilFamilien + '»'));
    } else if (dom.tilstand === 'endring_onsket') {
      boks.appendChild(lag('h2', null, 'Beskjeden er sendt.'));
      boks.appendChild(lag('p', null, dom.grunn + '.'));
    } else {
      boks.appendChild(lag('h2', null, 'Avtalen står fortsatt og venter.'));
      boks.appendChild(lag('p', null, dom.grunn + '.'));
    }
    boks.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- språk ---------- */

  function byggSprak() {
    var velger = ved('sprakvalg');
    if (!velger) return;

    S.SPRAK.forEach(function (s) {
      if (!S.kanApnes(s.kode).ok) return;
      var o = lag('option', null, s.eget);
      o.value = s.kode;
      velger.appendChild(o);
    });

    if (velger.options.length < 2) {
      velger.disabled = true;
      velger.title = 'Flere språk åpnes når akuttsetningen er lest av noen som snakker dem';
    }
    velger.value = sprak;
    velger.addEventListener('change', function () {
      sprak = velger.value;
      var s = S.sprak(sprak);
      document.documentElement.lang = s.kode;
      document.documentElement.dir = s.dir;
      tegnAkutt();
      /* Har hun allerede svart, gjelder svaret det nye språket også – men
         utfallsteksten må tegnes på nytt. */
      if (svart) svar(svart);
    });
  }

  function tegnAkutt() {
    var n = ved('akutt');
    if (!n) return;
    n.textContent = S.t('akutt', sprak) ||
      (E.AKUTTVARSEL.tittel + '. ' + E.AKUTTVARSEL.tekst);
  }

  /* ---------- opplesning ----------

     Nettleserens egen stemme. Ingen avhengighet, ingen lyd som forlater
     maskinen – og knappen finnes bare når nettleseren faktisk kan lese. */
  function settOppOpplesning() {
    var knapp = ved('les');
    if (!knapp || !('speechSynthesis' in window)) return;
    knapp.hidden = false;

    knapp.addEventListener('click', function () {
      var merke = ved('les-tekst');
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (merke) merke.textContent = 'Les opp';
        return;
      }
      var kort = document.querySelector('.g-kort');
      var ytring = new SpeechSynthesisUtterance((kort && kort.textContent) || '');
      ytring.lang = sprak === 'nb' ? 'nb-NO' : sprak;
      ytring.rate = 0.92;
      ytring.onend = function () { if (merke) merke.textContent = 'Les opp'; };
      if (merke) merke.textContent = 'Stopp';
      window.speechSynthesis.speak(ytring);
    });
  }

  function start() {
    tegnFra();
    tegnDetaljer();
    tegnGrenser();
    byggSprak();
    tegnAkutt();
    settOppOpplesning();

    var ja = ved('ja');
    var nei = ved('nei');
    var endre = ved('endre');
    if (ja) ja.addEventListener('click', function () { svar('ja'); });
    if (nei) nei.addEventListener('click', function () { svar('nei'); });
    if (endre) endre.addEventListener('click', function () {
      svar('endre', 'annen tid eller kanal');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  if (window.PP_RUTER) window.PP_RUTER['godkjenn'] = start;
})();
