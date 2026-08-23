/* Naviar – bestillingsskjermen for Ekspertbistand.

   Skjermen finner ikke på noe. Kategoriene, prisen, lengden, grensene og
   akuttsetningen kommer fra PP_EKSPERT og PP_KLARHET, og bestillingen går
   gjennom PP_EKSPERT.bestill – også når svaret er nei.

   Det siste er poenget med hele filen: knappen «Bestill konsultasjon» kaller
   den samme regelen som en backend ville kalt, og viser svaret som kommer.
   Skrev vi i stedet en hyggelig kvittering her, ville skjermen love noe
   systemet ikke har sagt ja til. */

(function () {
  'use strict';

  var E = window.PP_EKSPERT;
  var K = window.PP_KLARHET;
  var S = window.PP_SPRAK_UI;
  if (!E || !K || !S) return;

  var valgt = { omraade: null, ekspert: null, tid: null };
  var sprak = 'nb';

  function lag(tag, klasse, tekst) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (tekst !== undefined && tekst !== null) n.textContent = tekst;
    return n;
  }
  function ved(id) { return document.getElementById(id); }

  /* Ikonene er tegnet her og ikke hentet som emoji: emoji ser ulikt ut på
     hver plattform, og noen av dem er ansikter. Et ansikt på en kategori for
     pensjon er en tolkning vi ikke har bedt om. */
  var SVG = {
    nav: '<path d="M4 15.5c1.9-1.4 4-2.1 6.2-2.1h4.4a2 2 0 0 1 0 4h-3.3"/><path d="M9.4 17.4h5.9l4.7-3.1a1.9 1.9 0 0 1 2.4 2.9l-5.6 4.4H4"/><circle cx="12.6" cy="6.6" r="3"/>',
    kommune: '<path d="M4 20.4V10l8-5.4 8 5.4v10.4"/><path d="M9.6 20.4v-5.6h4.8v5.6"/><path d="M2.6 20.4h18.8"/>',
    digital: '<rect x="3.2" y="5.4" width="17.6" height="11.4" rx="1.6"/><path d="M2 20.2h20"/>',
    klokke: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.1 1.9"/>',
    kalender: '<rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2"/><path d="M3.6 9.8h16.8M8.2 3.4v3.4M15.8 3.4v3.4"/><circle cx="8.6" cy="13.6" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="13.6" r=".9" fill="currentColor" stroke="none"/><circle cx="15.4" cy="13.6" r=".9" fill="currentColor" stroke="none"/>',
    globus: '<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.1 2.3 3.2 5.3 3.2 8.4S14.1 18.1 12 20.4c-2.1-2.3-3.2-5.3-3.2-8.4S9.9 5.9 12 3.6Z"/>',
    skjold: '<path d="M12 3.4 5.2 6v5.6c0 4.1 2.8 7.7 6.8 8.9 4-1.2 6.8-4.8 6.8-8.9V6Z"/><path d="M9.2 12.2l2 2 3.6-3.9"/>'
  };

  function ikon(navn, storrelse) {
    var s = storrelse || 22;
    var n = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    n.setAttribute('viewBox', '0 0 24 24');
    n.setAttribute('width', s);
    n.setAttribute('height', s);
    n.setAttribute('fill', 'none');
    n.setAttribute('stroke', 'currentColor');
    n.setAttribute('stroke-width', '1.6');
    n.setAttribute('stroke-linecap', 'round');
    n.setAttribute('stroke-linejoin', 'round');
    n.setAttribute('aria-hidden', 'true');
    n.innerHTML = SVG[navn] || '';
    return n;
  }

  function ring() {
    return lag('span', 'x-ring', '✓');
  }

  /* ---------- eksperter ----------

     Demodata, og de er merket som det. En ledig tid som ikke finnes, er
     nøyaktig den påfunne knappheten PP_KLARHET.ALDRI_SELG forbyr – forskjellen
     er at her vet vi at kalenderen er tom. */
  var DEMO = [
    { fornavn: 'Kari', etternavn: 'Hansen', rolle: 'NAV-rådgiver', aar: 18,
      omraader: ['nav'], sprak: ['Norsk', 'English'],
      tider: ['Mandag 10.00', 'Mandag 14.30', 'Tirsdag 09.00'] },
    { fornavn: 'Arne', etternavn: 'Solberg', rolle: 'pensjonsveileder', aar: 14,
      omraader: ['nav'], sprak: ['Norsk', 'Polski'],
      tider: ['Onsdag 11.00', 'Torsdag 16.00'] },
    { fornavn: 'Solveig', etternavn: 'Aas', rolle: 'saksbehandler i tildelingskontoret', aar: 14,
      omraader: ['kommune'], sprak: ['Norsk'],
      tider: ['Torsdag 11.00', 'Fredag 09.30'] },
    { fornavn: 'Bjørn', etternavn: 'Hauge', rolle: 'veileder for digitale tjenester', aar: 9,
      omraader: ['digital'], sprak: ['Norsk', 'English'],
      tider: ['I dag 16.00', 'I morgen 12.00'] }
  ];

  function initialer(e) {
    return (e.fornavn.charAt(0) + e.etternavn.charAt(0)).toUpperCase();
  }
  function navn(e) { return e.fornavn + ' ' + e.etternavn; }

  /* «Tidligere» og «uavhengig» er ikke pynt – de er forskjellen på å beskrive
     erfaring og å påberope seg en etat. Malen ligger i modulen. */
  function tittel(e) {
    return E.PROFILTITTEL.mal.replace('{rolle}', e.rolle);
  }

  /* ---------- fremdrift ----------

     Tre trinn, og det tredje er den eldres godkjenning. Sluttes flyten ved
     «bekreft» uten det trinnet, ser skjermen ut som om familien fullførte
     alene – og det er ikke tjenesten. */
  var TRINN = [
    { id: 'omraade', navn: 'Område' },
    { id: 'tid',     navn: 'Ekspert og tid' },
    { id: 'bekreft', navn: 'Bekreft' }
  ];

  function naavaerendeTrinn() {
    if (!valgt.omraade) return 0;
    if (!valgt.tid) return 1;
    return 2;
  }

  function tegnFremdrift() {
    var liste = ved('fremdrift');
    if (!liste) return;
    liste.textContent = '';
    var naa = naavaerendeTrinn();

    TRINN.forEach(function (tr, i) {
      var li = lag('li');
      var boks = lag('div', 'x-trinn');
      boks.dataset.tilstand = i < naa ? 'ferdig' : (i === naa ? 'naa' : 'igjen');
      boks.appendChild(lag('span', 'x-trinn-nr', i < naa ? '✓' : String(i + 1)));
      boks.appendChild(lag('span', 'x-trinn-navn', tr.navn));
      li.appendChild(boks);
      liste.appendChild(li);

      if (i < TRINN.length - 1) {
        var strek = lag('li');
        var s = lag('span', 'x-strek');
        s.dataset.ferdig = i < naa ? 'ja' : 'nei';
        strek.appendChild(s);
        liste.appendChild(strek);
      }
    });
  }

  /* ---------- fagområde ---------- */

  function tegnOmraader() {
    var rad = ved('omraadeliste');
    if (!rad) return;
    rad.textContent = '';

    E.pilotKategorier().forEach(function (k) {
      var b = lag('button', 'x-omraade');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', valgt.omraade === k.id ? 'true' : 'false');
      b.dataset.omraade = k.id;

      var ik = lag('span', 'x-ikon');
      ik.appendChild(ikon(k.id, 24));
      b.appendChild(ik);
      b.appendChild(lag('span', 'x-omraade-navn', S.t('k_' + k.id, sprak) || k.navn));
      b.appendChild(ring());

      b.addEventListener('click', function () {
        /* Bytter kunden område, faller ekspert og tid bort. De hørte til det
           forrige valget, og en tid som blir stående, er en tid hun tror hun
           har. */
        if (valgt.omraade !== k.id) { valgt.ekspert = null; valgt.tid = null; }
        valgt.omraade = k.id;
        tegnAlt();
      });
      rad.appendChild(b);
    });
  }

  /* Grensene står under valget, ikke i en fotnote. Det kunden ikke får, er en
     del av det hun kjøper – hun skal vite det før hun betaler, ikke etter. */
  function tegnGrenser() {
    var n = ved('omraade-grenser');
    if (!n) return;
    var k = valgt.omraade ? E.kategori(valgt.omraade) : null;
    if (!k) { n.hidden = true; return; }
    n.hidden = false;
    n.textContent = 'Fagpersonen gjør ikke dette: ' +
      k.girIkkeRett.map(function (g) { return g.replace(/^Å /, '').toLowerCase(); }).join('; ') + '.';
  }

  /* ---------- eksperter og tider ---------- */

  function faktalinje(ikonnavn, tekst, klasse) {
    var rad = lag('span', 'x-fakta' + (klasse ? ' ' + klasse : ''));
    rad.appendChild(ikon(ikonnavn, 19));
    rad.appendChild(lag('span', null, tekst));
    return rad;
  }

  function tegnEksperter() {
    var liste = ved('ekspertliste');
    if (!liste) return;
    liste.textContent = '';

    if (!valgt.omraade) {
      liste.appendChild(lag('p', 'x-ingen-tider', 'Velg et fagområde først.'));
      return;
    }

    var treff = DEMO.filter(function (e) { return e.omraader.indexOf(valgt.omraade) !== -1; });
    if (!treff.length) {
      liste.appendChild(lag('p', 'x-ingen-tider',
        'Ingen ledige tider i denne kategorien akkurat nå.'));
      return;
    }

    treff.forEach(function (e) {
      var erValgt = valgt.ekspert === navn(e);
      var kort = lag('article', 'x-ekspert');
      kort.dataset.valgt = erValgt ? 'ja' : 'nei';

      var knapp = lag('button', 'x-ekspert-knapp');
      knapp.type = 'button';
      knapp.setAttribute('role', 'radio');
      knapp.setAttribute('aria-checked', erValgt ? 'true' : 'false');

      knapp.appendChild(lag('span', 'x-initialer', initialer(e)));

      var nav = lag('span', 'x-ekspert-navn');
      nav.appendChild(lag('strong', null, navn(e)));
      nav.appendChild(lag('small', null, tittel(e)));
      nav.appendChild(lag('small', null, e.aar + ' års erfaring'));
      knapp.appendChild(nav);

      var fakta = lag('span', 'x-ekspert-fakta');
      fakta.appendChild(faktalinje('globus', e.sprak.join(' · ')));
      /* Merkelappen bærer sin egen forklaring. «Verifisert» alene betyr det
         leseren håper, og håpet er alltid større enn kontrollen. */
      var v = faktalinje('skjold', S.t('verifisert', sprak) || E.MERKELAPP.tekst, 'x-verifisert');
      v.title = E.MERKELAPP.forklaring;
      fakta.appendChild(v);
      knapp.appendChild(fakta);

      knapp.appendChild(ring());

      knapp.addEventListener('click', function () {
        if (valgt.ekspert !== navn(e)) valgt.tid = null;
        valgt.ekspert = navn(e);
        tegnAlt();
      });
      kort.appendChild(knapp);

      if (erValgt) kort.appendChild(tidsvalg(e));
      liste.appendChild(kort);
    });
  }

  function tidsvalg(e) {
    var boks = lag('div', 'x-tider');
    boks.appendChild(lag('h3', null, 'Velg tid'));

    if (!e.tider.length) {
      boks.appendChild(lag('p', 'x-ingen-tider', 'Ingen ledige tider denne uka.'));
      return boks;
    }

    var rad = lag('div', 'x-tidrad');
    rad.setAttribute('role', 'radiogroup');
    rad.setAttribute('aria-label', 'Tid');

    e.tider.forEach(function (t) {
      var b = lag('button', 'x-tid');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', valgt.tid === t ? 'true' : 'false');
      b.appendChild(ikon('kalender', 21));
      b.appendChild(lag('span', null, t));
      b.addEventListener('click', function () { valgt.tid = t; tegnAlt(); });
      rad.appendChild(b);
    });
    boks.appendChild(rad);
    return boks;
  }

  /* ---------- sammendraget ---------- */

  function tegnSammendrag() {
    var dl = ved('sammendrag');
    if (!dl) return;
    dl.textContent = '';

    var k = valgt.omraade ? E.kategori(valgt.omraade) : null;
    var lengde = E.pilotLengder()[0];

    var rader = [
      { merke: k ? ikon(k.id, 22) : null, fallback: '?',
        verdi: k ? (S.t('k_' + k.id, sprak) || k.navn) : 'Velg fagområde',
        tom: !k },
      { merke: null, fallback: valgt.ekspert ? initialer({
          fornavn: valgt.ekspert.split(' ')[0],
          etternavn: valgt.ekspert.split(' ').slice(-1)[0] }) : '–',
        verdi: valgt.ekspert || 'Velg ekspert', tom: !valgt.ekspert },
      { merke: ikon('kalender', 22), fallback: '',
        verdi: valgt.tid || 'Velg tid', tom: !valgt.tid },
      { merke: ikon('klokke', 22), fallback: '',
        verdi: S.t('minutter', sprak) || (lengde.minutter + ' minutter'), tom: false },
      { merke: null, fallback: 'kr',
        verdi: K.PAKKE.pris + ' kr', tom: false }
    ];

    rader.forEach(function (r) {
      var d = lag('div', r.tom ? 'x-tom' : null);
      var dt = lag('dt');
      if (r.merke) dt.appendChild(r.merke); else dt.textContent = r.fallback;
      d.appendChild(dt);
      d.appendChild(lag('dd', null, r.verdi));
      dl.appendChild(d);
    });
  }

  /* ---------- bestillingen ----------

     Kaller den samme regelen en backend ville kalt, og viser svaret. Uten den
     eldres godkjenning er svaret nei, og skjermen sier nei. */
  function bestill() {
    var dom = E.bestill({
      kategori: valgt.omraade,
      kanal: 'telefon',
      minutter: E.pilotLengder()[0].minutter,
      pris: K.PAKKE.pris
    });

    var boks = ved('bekreft');
    var melding = ved('venter');
    if (!boks || !melding) return;

    boks.hidden = false;
    melding.textContent = dom.ok
      ? 'Bestillingen er sendt.'
      : dom.grunn + (dom.mangler ? ' Hun godkjenner ' + dom.mangler.join(' og ') + '.' : '');
    boks.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- opplesning ----------

     Nettleserens egen stemme. Ingen avhengighet, ingen lyd som sendes noe
     sted – og knappen finnes bare når nettleseren faktisk kan lese. */
  function settOppOpplesning() {
    var knapp = ved('les');
    if (!knapp || !('speechSynthesis' in window)) return;
    knapp.hidden = false;

    knapp.addEventListener('click', function () {
      var tekst = ved('les-tekst');
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (tekst) tekst.textContent = 'Les opp siden';
        return;
      }
      var hoved = ved('main');
      var ytring = new SpeechSynthesisUtterance((hoved && hoved.textContent) || '');
      ytring.lang = sprak === 'nb' ? 'nb-NO' : sprak;
      ytring.rate = 0.95;
      ytring.onend = function () { if (tekst) tekst.textContent = 'Les opp siden'; };
      if (tekst) tekst.textContent = 'Stopp opplesningen';
      window.speechSynthesis.speak(ytring);
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

    /* Er bare norsk klar, er nedtrekket en illusjon av valg. */
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
      Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (n) {
        var v = S.t(n.getAttribute('data-t'), s.kode);
        if (v !== null) n.textContent = v;
      });
      tegnAlt();
    });
  }

  function tegnAkutt() {
    var n = ved('akutt');
    if (!n) return;
    n.textContent = S.t('akutt', sprak) ||
      (E.AKUTTVARSEL.tittel + '. ' + E.AKUTTVARSEL.tekst);
  }

  function tegnAlt() {
    tegnFremdrift();
    tegnOmraader();
    tegnGrenser();
    tegnEksperter();
    tegnSammendrag();
    tegnAkutt();

    var knapp = ved('bestill');
    if (knapp) knapp.disabled = !(valgt.omraade && valgt.ekspert && valgt.tid);
  }

  function start() {
    byggSprak();
    settOppOpplesning();
    tegnAlt();
    var knapp = ved('bestill');
    if (knapp) knapp.addEventListener('click', bestill);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  if (window.PP_RUTER) window.PP_RUTER['bestill'] = start;
})();
