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

  /* Ikonene er tegnet her og ikke hentet som emoji: emoji ser ulikt ut på
     hver plattform, og noen av dem er ansikter. Et ansikt på «pris» er en
     tolkning vi ikke har bedt om. */
  var SVG = {
    kalender: '<rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2"/><path d="M3.6 9.8h16.8M8.2 3.4v3.4M15.8 3.4v3.4"/>',
    telefon: '<path d="M7.2 3.8H5.4A2 2 0 0 0 3.4 6c.4 8 6.6 14.2 14.6 14.6a2 2 0 0 0 2.2-2v-1.8a1.4 1.4 0 0 0-1.1-1.4l-3-.6a1.4 1.4 0 0 0-1.4.6l-.9 1.3a13 13 0 0 1-5-5l1.3-.9a1.4 1.4 0 0 0 .6-1.4l-.6-3a1.4 1.4 0 0 0-1.4-1.1Z"/>',
    video: '<rect x="2.8" y="6" width="13" height="12" rx="2"/><path d="M15.8 11.2 21.2 8v8l-5.4-3.2z"/>',
    oppmote: '<path d="M12 21c4-4.2 6.2-7.3 6.2-10.2A6.2 6.2 0 0 0 5.8 10.8C5.8 13.7 8 16.8 12 21Z"/><circle cx="12" cy="10.6" r="2.2"/>',
    klokke: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.1 1.9"/>',
    krone: '<circle cx="12" cy="12" r="8.4"/><path d="M9.4 8.4v7.2M9.4 12l3.4-3.6M9.4 12l3.6 3.6"/>',
    mappe: '<path d="M3.4 7.4a1.6 1.6 0 0 1 1.6-1.6h4l1.8 2.2h7.6a1.6 1.6 0 0 1 1.6 1.6v8.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6z"/>'
  };

  function ikon(navn, storrelse) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    n.setAttribute('viewBox', '0 0 24 24');
    n.setAttribute('width', storrelse || 26);
    n.setAttribute('height', storrelse || 26);
    n.setAttribute('fill', 'none');
    n.setAttribute('stroke', 'currentColor');
    n.setAttribute('stroke-width', '1.7');
    n.setAttribute('stroke-linecap', 'round');
    n.setAttribute('stroke-linejoin', 'round');
    n.setAttribute('aria-hidden', 'true');
    n.innerHTML = SVG[navn] || '';
    return n;
  }

  /* ---------- det hun godkjenner ---------- */

  function tegnPerson() {
    var portrett = ved('portrett');
    if (portrett) {
      portrett.textContent = AVTALE.ekspert.split(' ')
        .map(function (d) { return d.charAt(0); }).join('').toUpperCase();
    }
    var tittel = ved('tittel');
    if (tittel) tittel.textContent = 'Vil du snakke med ' + AVTALE.ekspert + '?';
    var rolle = ved('rolle');
    if (rolle) rolle.textContent = E.PROFILTITTEL.mal.replace('{rolle}', AVTALE.rolle);
  }

  /* Fire fakta, én linje hver, med et ikon foran. Hun skal finne klokkeslettet
     uten å lese en setning – og prisen skal stå der selv om hun ikke betaler.
     Å bli bedt om å godkjenne noe uten å få vite hva det koster, er å bli
     holdt utenfor. */
  function tegnFakta() {
    var ul = ved('fakta');
    if (!ul) return;
    ul.textContent = '';

    var k = E.kategori(AVTALE.kategori);
    var kanal = E.KANAL.filter(function (x) { return x.id === AVTALE.kanal; })[0];

    var rader = [
      { ikon: 'kalender', sterk: AVTALE.tid, svak: AVTALE.minutter + ' minutter' },
      { ikon: AVTALE.kanal, sterk: kanal ? kanal.navn : AVTALE.kanal,
        svak: kanal ? kanal.kort : null },
      { ikon: 'mappe', sterk: k ? k.navn : '–', svak: 'Det samtalen handler om' },
      { ikon: 'krone', sterk: K.PAKKE.pris + ' kr', svak: AVTALE.fra + ' betaler' }
    ];

    rader.forEach(function (r) {
      var li = lag('li');
      var boks = lag('span', 'g-fakta-ikon');
      boks.appendChild(ikon(r.ikon, 26));
      li.appendChild(boks);
      var tekst = lag('span', 'g-fakta-tekst');
      tekst.appendChild(lag('strong', null, r.sterk));
      if (r.svak) tekst.appendChild(lag('span', 'g-liten', r.svak));
      li.appendChild(tekst);
      ul.appendChild(li);
    });
  }

  /* Grensene, med hennes ord. Den som skal si ja, skal vite hva hun sier ja
     til – og like viktig, hva hun ikke får, så hun slipper å oppdage det
     midt i samtalen. */
  function tegnGrenser() {
    var k = E.kategori(AVTALE.kategori);
    if (!k) return;

    /* Lista, ikke setningen. `gjorLettere` er skrevet til familien som
       skanner en forside; `kanHjelpeDegMed` er skrevet til henne som skal
       svare ja eller nei. En setning delt på komma blir ikke en liste – den
       blir to halve setninger, og den andre begynner med liten forbokstav. */
    var kan = ved('kan');
    if (kan) {
      kan.textContent = '';
      (k.kanHjelpeDegMed || [k.gjorLettere]).forEach(function (d) {
        kan.appendChild(lag('li', null, d));
      });
    }

    var ul = ved('kan-ikke');
    if (!ul) return;
    ul.textContent = '';
    /* Modulen skriver «Å behandle en sak» fordi lista der er en oppregning.
       Som punkt under en overskrift blir infinitiven overflødig – men da må
       forbokstaven opp, ellers står de to listene med hver sin form ved
       siden av hverandre. */
    k.girIkkeRett.forEach(function (g) {
      var t = g.replace(/^Å /, '');
      ul.appendChild(lag('li', null, t.charAt(0).toUpperCase() + t.slice(1)));
    });
  }

  function tegnFra() {
    var n = ved('fra');
    if (n) n.textContent = AVTALE.fra + ' har funnet en tid til deg.';
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

  /* ---------- kanal ----------

     Én av de to tingene hun godkjenner, og for den som hører dårlig den
     viktigste. Spørsmålet er «hvordan vil du helst snakke» – aldri hvorfor.
     Grunnen er en helseopplysning, og det finnes ikke noe felt for den.

     Hjelpeteksten under hvert valg sier hva kanalen gir, ikke hvem den er
     for. «Du ser ansiktet, og det er lettere å følge med» er en opplysning
     alle kan bruke. «For deg med nedsatt hørsel» ville pekt henne ut. */
  function tegnKanal() {
    var boks = ved('kanalvalg');
    if (!boks) return;
    boks.textContent = '';

    var sporsmaal = ved('kanal-sporsmaal');
    if (sporsmaal) sporsmaal.textContent = E.TILGJENGELIGHET.spor;

    E.TILGJENGELIGHET.valg.forEach(function (v) {
      if (v.pilot === false) return;
      var b = lag('button', 'g-kanalknapp');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', AVTALE.kanal === v.id ? 'true' : 'false');

      var ik = lag('span', 'g-kanalikon');
      ik.appendChild(ikon(v.id, 28));
      b.appendChild(ik);
      var tekst = lag('span', 'g-kanaltekst');
      tekst.appendChild(lag('strong', null, v.navn));
      tekst.appendChild(lag('span', 'g-liten', v.hjelper));
      b.appendChild(tekst);
      b.appendChild(lag('span', 'g-hake', '✓'));

      b.addEventListener('click', function () {
        AVTALE.kanal = v.id;
        tegnFakta();
        tegnKanal();
        /* Har hun allerede sagt ja, gjelder ja-et den nye kanalen. Å la
           svaret bli stående uendret ville betydd at hun godkjente noe
           annet enn det som nå er avtalt. */
        if (svart === 'ja') svar('ja');
      });
      boks.appendChild(b);
    });

    var skriftlig = ved('skriftlig');
    if (skriftlig) skriftlig.textContent = E.TILGJENGELIGHET.skriftlig.lovesFor;
  }

  /* ---------- en annen tid ----------

     Faste valg, ingen fritekst. «Jeg har kor på mandager» er ikke en
     forklaring hun skylder oss – og et fritekstfelt her ville invitert til
     å skrive nettopp den helseopplysningen vi ikke kan ta imot. */
  function tegnEndre() {
    var boks = ved('endregrunner');
    if (!boks) return;
    boks.textContent = '';

    var sporsmaal = ved('endre-sporsmaal');
    if (sporsmaal) sporsmaal.textContent = E.ANNEN_TID.sporsmaal;

    E.ANNEN_TID.grunner.forEach(function (g) {
      var b = lag('button', 'g-endreknapp', g.navn);
      b.type = 'button';
      b.dataset.grunn = g.id;
      b.addEventListener('click', function () { svar('endre', g.id); });
      boks.appendChild(b);
    });
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
    tegnPerson();
    tegnFakta();
    tegnGrenser();
    tegnKanal();
    tegnEndre();
    byggSprak();
    tegnAkutt();
    settOppOpplesning();

    var ja = ved('ja');
    var nei = ved('nei');
    if (ja) ja.addEventListener('click', function () { svar('ja'); });
    if (nei) nei.addEventListener('click', function () { svar('nei'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  if (window.PP_RUTER) window.PP_RUTER['godkjenn'] = start;
})();
