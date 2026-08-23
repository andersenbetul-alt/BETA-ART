/* Naviar Klarhet – forsiden.

   Skjermen henter alt fra modulene og finner ikke på noe selv. Det er ikke
   ryddighet for ryddighetens skyld: prisen, grensene og akuttsetningen er
   påstander vi må stå for, og en påstand som finnes to steder, blir før eller
   siden to forskjellige påstander.

   Derfor er det ingen tall og ingen kategorinavn i denne filen. */

(function () {
  'use strict';

  var K = window.PP_KLARHET;
  var E = window.PP_EKSPERT;
  var S = window.PP_SPRAK_UI;
  if (!K || !E || !S) return;

  var valgtKategori = null;
  var valgtSprak = 'nb';

  function lag(tag, klasse, tekst) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (tekst !== undefined && tekst !== null) n.textContent = tekst;
    return n;
  }
  function ved(id) { return document.getElementById(id); }

  /* ---------- språk ----------

     Bare språk som faktisk kan åpnes, havner i lista. Et språk i nedtrekket
     som gir en halvt oversatt side, er verre enn ett færre valg – da har vi
     lovet noe i selve menyen. */
  function byggSprak() {
    var velger = ved('sprakvalg');
    if (!velger) return;

    S.SPRAK.forEach(function (s) {
      var d = S.kanApnes(s.kode);
      if (!d.ok) return;
      var o = lag('option', null, s.eget);
      o.value = s.kode;
      velger.appendChild(o);
    });

    /* Er bare norsk klar, er nedtrekket en illusjon av valg. Da vises det
       ikke, men grunnen står for den som ser etter. */
    if (velger.options.length < 2) {
      var boks = velger.closest('.k-sprakvelger');
      if (boks) {
        boks.hidden = true;
        boks.title = 'Flere språk åpnes når akuttsetningen er lest av noen som snakker dem';
      }
      return;
    }

    velger.value = valgtSprak;
    velger.addEventListener('change', function () {
      valgtSprak = velger.value;
      settSprak(valgtSprak);
    });
  }

  function settSprak(kode) {
    var s = S.sprak(kode) || S.sprak('nb');
    document.documentElement.lang = s.kode;
    document.documentElement.dir = s.dir;

    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (n) {
      var v = S.t(n.getAttribute('data-t'), s.kode);
      if (v !== null) n.textContent = v;
    });

    byggKategorier();
    tegnAkutt();
    if (valgtKategori) svarPaaValg(valgtKategori);
  }

  /* ---------- Navigator ---------- */

  function byggKategorier() {
    var rutenett = ved('kategorivalg');
    if (!rutenett) return;
    rutenett.textContent = '';

    E.pilotKategorier().forEach(function (k) {
      var b = lag('button', 'k-valg');
      b.type = 'button';
      b.setAttribute('aria-pressed', valgtKategori === k.id ? 'true' : 'false');
      b.dataset.kategori = k.id;

      var navn = S.t('k_' + k.id, valgtSprak) || k.navn;
      b.appendChild(lag('span', 'k-valg-bokstav', navn.charAt(0)));
      b.appendChild(lag('h3', null, navn));
      b.appendChild(lag('p', null, k.gjorLettere));
      if (valgtKategori === k.id) {
        b.appendChild(lag('span', 'k-kryss', '✓ Valgt'));
      }

      b.addEventListener('click', function () {
        valgtKategori = k.id;
        byggKategorier();
        svarPaaValg(k.id);
      });
      rutenett.appendChild(b);
    });
  }

  /* Svaret kjøres gjennom Navigator og ikke skrevet her, slik at forsiden og
     resten av tjenesten svarer likt på det samme spørsmålet. */
  function svarPaaValg(katId) {
    var tema = { nav: 'penger', kommune: 'hjelp', digital: 'digitalt' }[katId];
    var dom = K.navigator({ tema: tema, hast: 'uker', form: 'telefon', sprak: valgtSprak });

    var boks = ved('navigator-svar');
    var bestill = ved('bestillkort');
    if (!boks) return;

    boks.textContent = '';
    boks.hidden = false;
    boks.className = 'k-svar' + (dom.bestilling ? '' : ' k-svar-stopp');

    if (dom.tittel) boks.appendChild(lag('h3', null, dom.tittel));
    if (dom.svar) boks.appendChild(lag('p', null, dom.svar));

    /* Grensene står i svaret, ikke i en fotnote. Det kunden ikke får, er en
       del av det hun kjøper – hun skal vite det før hun betaler, ikke etter. */
    if (dom.gjorIkke && dom.gjorIkke.length) {
      boks.appendChild(lag('p', 'k-hjelpetekst', 'Dette gjør fagpersonen ikke:'));
      var ul = lag('ul');
      dom.gjorIkke.forEach(function (g) { ul.appendChild(lag('li', null, g)); });
      boks.appendChild(ul);
    }

    if (bestill) bestill.hidden = !dom.bestilling;
    tegnEksperter(dom.bestilling ? katId : null);
  }

  /* ---------- eksperter ----------

     Demodata, og de er merket som det. En ledig tid som ikke finnes, er
     nøyaktig den påfunne knappheten PP_KLARHET.ALDRI_SELG forbyr – forskjellen
     er at her vet vi at kalenderen er tom. */
  var DEMO = [
    { fornavn: 'Anne Lise', etternavn: 'Berg', rolle: 'NAV-rådgiver',
      kategorier: ['nav'], aar: 18, sprak: ['Norsk', 'Engelsk'],
      kanaler: ['telefon', 'video'], ledig: 'I dag kl. 18.30' },
    { fornavn: 'Kari', etternavn: 'Nilsen', rolle: 'pensjonsveileder',
      kategorier: ['nav'], aar: 22, sprak: ['Norsk', 'Polsk'],
      kanaler: ['telefon', 'video'], ledig: 'I morgen kl. 09.00' },
    { fornavn: 'Per Anders', etternavn: 'Holm', rolle: 'rådgiver for trygdeytelser',
      kategorier: ['nav'], aar: 15, sprak: ['Norsk'],
      kanaler: ['telefon'], ledig: 'I dag kl. 20.00' },
    { fornavn: 'Maja', etternavn: 'Solberg', rolle: 'saksbehandler for pensjon og etterlatteytelser',
      kategorier: ['nav'], aar: 12, sprak: ['Norsk', 'Engelsk'],
      kanaler: ['telefon', 'video'], ledig: 'I morgen kl. 14.30' },
    { fornavn: 'Solveig', etternavn: 'Aas', rolle: 'saksbehandler i tildelingskontoret',
      kategorier: ['kommune'], aar: 14, sprak: ['Norsk'],
      kanaler: ['telefon'], ledig: 'Torsdag kl. 11.00' },
    { fornavn: 'Bjørn', etternavn: 'Hauge', rolle: 'veileder for digitale tjenester',
      kategorier: ['digital'], aar: 9, sprak: ['Norsk', 'Engelsk'],
      kanaler: ['telefon', 'video'], ledig: 'I dag kl. 16.00' }
  ];

  function initialer(e) {
    return (e.fornavn.charAt(0) + e.etternavn.charAt(0)).toUpperCase();
  }

  /* Tittelen bygges av malen i PP_EKSPERT.PROFILTITTEL. «Tidligere» og
     «uavhengig» er ikke pynt – de er forskjellen på å beskrive erfaring og å
     påberope seg en etat. */
  function tittel(e) {
    return E.PROFILTITTEL.mal.replace('{rolle}', e.rolle);
  }

  function ekspertkort(e) {
    var kort = lag('article', 'k-ekspert');

    var hode = lag('div', 'k-ekspert-hode');
    hode.appendChild(lag('span', 'k-initialer', initialer(e)));
    var navn = lag('div');
    navn.appendChild(lag('h3', null, e.fornavn + ' ' + e.etternavn));
    navn.appendChild(lag('p', 'k-ekspert-tittel', tittel(e)));
    hode.appendChild(navn);
    kort.appendChild(hode);

    var dl = lag('dl');
    [['Erfaring', e.aar + ' års erfaring'],
     ['Språk', e.sprak.join(' · ')],
     ['Kanal', e.kanaler.map(function (k) {
        return S.t(k, valgtSprak) || k;
      }).join(' · ')]].forEach(function (par) {
      var rad = lag('div');
      rad.appendChild(lag('dt', null, par[0]));
      rad.appendChild(lag('dd', null, par[1]));
      dl.appendChild(rad);
    });
    var ledig = lag('div');
    ledig.appendChild(lag('dt', null, S.t('ledig', valgtSprak) || 'Neste ledige tid'));
    ledig.appendChild(lag('dd', 'k-ledig', e.ledig));
    dl.appendChild(ledig);
    kort.appendChild(dl);

    /* Merkelappen kommer med sin egen forklaring. «Verifisert» alene betyr
       det leseren håper, og håpet er alltid større enn kontrollen. */
    var merke = lag('span', 'k-verifisert');
    merke.appendChild(lag('span', null, '✓'));
    merke.appendChild(lag('span', null, S.t('verifisert', valgtSprak) || E.MERKELAPP.tekst));
    merke.title = E.MERKELAPP.forklaring;
    kort.appendChild(merke);

    var bestill = lag('button', 'btn btn-primary k-btn-liten', 'Bestill samtale');
    bestill.type = 'button';
    bestill.addEventListener('click', function () { visSamtykke(e); });
    kort.appendChild(bestill);

    return kort;
  }

  /* Bestillingen stopper her, og det er ikke en uferdig knapp – det er
     regelen. PP_EKSPERT.bestill nekter uten den eldres godkjenning, og
     skjermen skal vise nøyaktig det den regelen sier, ikke et hyggeligere
     mellomsteg. */
  function visSamtykke(e) {
    var dom = E.bestill({
      kategori: e.kategorier[0], kanal: e.kanaler[0],
      minutter: K.PAKKE.minutter, pris: K.PAKKE.pris
    });

    var boks = ved('navigator-svar');
    if (!boks) return;
    boks.hidden = false;
    boks.className = 'k-svar k-svar-stopp';
    boks.textContent = '';
    boks.appendChild(lag('h3', null, e.fornavn + ' ' + e.etternavn + ' – ' +
      (S.t('venter', valgtSprak) || 'Venter på godkjenning')));
    boks.appendChild(lag('p', null, dom.grunn));
    if (dom.mangler) {
      var ul = lag('ul');
      dom.mangler.forEach(function (m) {
        ul.appendChild(lag('li', null, 'Den eldre godkjenner ' + m));
      });
      boks.appendChild(ul);
    }
    boks.scrollIntoView({ block: 'nearest' });
  }

  function tegnEksperter(katId) {
    var liste = ved('ekspertliste');
    if (!liste) return;
    liste.textContent = '';
    if (!katId) { liste.hidden = true; return; }

    var treff = DEMO.filter(function (e) { return e.kategorier.indexOf(katId) !== -1; });
    liste.hidden = false;
    if (!treff.length) {
      liste.appendChild(lag('p', 'k-hjelpetekst',
        'Ingen ledige tider i denne kategorien akkurat nå.'));
      return;
    }
    treff.forEach(function (e) { liste.appendChild(ekspertkort(e)); });
  }

  function tegnUtvalg() {
    var rad = ved('utvalg');
    if (!rad) return;
    var pilot = K.PILOT.kategori;
    DEMO.filter(function (e) { return e.kategorier.indexOf(pilot) !== -1; })
        .forEach(function (e) { rad.appendChild(ekspertkort(e)); });
  }

  /* ---------- slik fungerer det ---------- */

  function tegnSteg() {
    var liste = ved('stegliste');
    if (!liste) return;
    liste.textContent = '';

    var tekst = {
      behov: 'Fem enkle spørsmål er nok. Du trenger ikke vite hvilken tjeneste som passer.',
      ekspert: 'Se verifiserte eksperter med erfaring fra akkurat ditt område.',
      tid: 'Pris og klokkeslett står før du bestiller. Kalenderen viser bare tider som finnes.',
      steg: 'Etter samtalen får du ' +
            K.TRE_STEG.felt.map(function (f) { return f.navn; }).join(', ') + ' skriftlig.'
    };

    E.STEG.forEach(function (st, i) {
      var li = lag('li');
      li.appendChild(lag('span', 'k-stegnr', '0' + (i + 1)));
      li.appendChild(lag('h3', null, S.t('s' + (i + 1), valgtSprak) || st.navn));
      li.appendChild(lag('p', null, tekst[st.id] || st.kort));
      liste.appendChild(li);
    });
  }

  /* ---------- pris og akuttsetning ---------- */

  function tegnPris() {
    var tekst = K.PAKKE.pris + ' ' + K.PAKKE.valuta;
    ['pris-tall', 'bestill-pris'].forEach(function (id) {
      var n = ved(id);
      if (n) n.textContent = tekst;
    });
    var lofte = ved('lofte-pris');
    if (lofte) lofte.textContent = tekst + ', alt inkludert';
  }

  function tegnAkutt() {
    var n = ved('akuttvarsel');
    if (!n) return;
    n.textContent = S.t('akutt', valgtSprak) ||
      (E.AKUTTVARSEL.tittel + '. ' + E.AKUTTVARSEL.tekst);
  }

  /* ---------- målgruppefanene ----------

     Tre lesere, tre spørsmål. Familien spør hvem de skal ringe, den eldre
     spør om hun må, og fagpersonen spør hva hun får igjen for det. Én tekst
     til alle tre svarer godt på ingen av dem. */
  var HERO = {
    familie: {
      oyenbryn: 'For deg som hjelper en forelder',
      tittel: 'Fra usikkerhet til et konkret neste steg.',
      ingress: 'Fortell hva dere trenger. Naviar finner riktig fagperson, ' +
               'bestiller samtalen og sender familien planen etterpå.',
      knapp: 'Finn riktig ekspert', maal: '#navigator'
    },
    eldre: {
      oyenbryn: 'For deg som får hjelp',
      tittel: 'Du bestemmer hvem du snakker med.',
      ingress: 'Familien kan finne en tid. Du sier ja eller nei, og velger ' +
               'om det skal være telefon eller video.',
      knapp: 'Se hvordan det fungerer', maal: '#slik'
    },
    ekspert: {
      oyenbryn: 'For erfarne fagpersoner',
      tittel: 'Din erfaring kan hjelpe noen videre.',
      ingress: 'Velg selv når du er tilgjengelig. Naviar tar seg av matching, ' +
               'booking og betaling.',
      knapp: 'Se hva det innebærer', maal: 'bli-hjelper.html'
    }
  };

  function byggFaner() {
    var faner = document.querySelectorAll('.k-fane');
    if (!faner.length) return;

    Array.prototype.forEach.call(faner, function (f) {
      f.addEventListener('click', function () {
        Array.prototype.forEach.call(faner, function (a) {
          a.setAttribute('aria-selected', a === f ? 'true' : 'false');
        });
        settHero(f.dataset.rolle);
        var panel = ved('hero-tekst');
        if (panel) panel.setAttribute('aria-labelledby', f.id);
      });
    });
  }

  function settHero(rolle) {
    var h = HERO[rolle] || HERO.familie;
    var felt = { 'hero-oyenbryn': h.oyenbryn, 'hero-tittel': h.tittel, 'hero-ingress': h.ingress };
    Object.keys(felt).forEach(function (id) {
      var n = ved(id);
      if (n) n.textContent = felt[id];
    });
    var knapp = ved('hero-knapp');
    if (knapp) {
      knapp.textContent = h.knapp;
      knapp.setAttribute('href', h.maal);
      /* Bare familieteksten er oversatt ennå. Lar vi data-t stå på de andre,
         skriver språkbyttet over dem med feil setning. */
      if (rolle === 'familie') knapp.setAttribute('data-t', 'knapp');
      else knapp.removeAttribute('data-t');
    }
  }

  /* ---------- Svar fra Naviar ----------

     Hvert spørsmål er ett ekte spørsmål med ett gratis svar. Lenken går til
     Hverdagsguiden, ikke til bestillingen: den som blir sendt til kassa når
     hun ba om et svar, kommer ikke tilbake. */
  var SPORSMAAL = [
    { tekst: 'Hva gjør jeg hvis NAV avslår søknaden?', kategori: 'nav' },
    { tekst: 'Når bør jeg søke om alderspensjon?',     kategori: 'nav' },
    { tekst: 'Hvordan får jeg hjelp fra kommunen?',    kategori: 'kommune' }
  ];

  function tegnSporsmaal() {
    var liste = ved('sporsmaal');
    if (!liste) return;
    var sti = window.PP_GUIDE ? window.PP_GUIDE.STI : '/hverdagsguide';

    SPORSMAAL.forEach(function (sp) {
      var li = lag('li', 'k-sporsmaal');
      li.appendChild(lag('h3', null, sp.tekst));
      var a = lag('a', 'k-lenke', 'Finn ut av det');
      a.setAttribute('href', sti);
      li.appendChild(a);
      liste.appendChild(li);
    });
  }

  function start() {
    byggSprak();
    byggFaner();
    byggKategorier();
    tegnUtvalg();
    tegnSteg();
    tegnPris();
    tegnAkutt();
    tegnSporsmaal();

    var knapp = ved('finn-tider');
    if (knapp) {
      knapp.addEventListener('click', function () {
        var liste = ved('ekspertliste');
        if (liste && !liste.hidden) liste.scrollIntoView({ block: 'start' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  if (window.PP_RUTER) window.PP_RUTER['klarhet'] = start;
})();
