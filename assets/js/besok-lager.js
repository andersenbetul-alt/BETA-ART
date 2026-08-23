/* Naviar Besøksbekreftelse – datalag.

   Prototypen lagrer i nettleseren slik at hele flyten kan kjøres uten backend.
   I produksjon byttes bare dette laget ut; skjermene rører ikke lagringen direkte.

   To regler er bygget inn i datamodellen, ikke i disiplinen:

   1. Kunden identifiseres med fornavn eller kundenummer. Det finnes ikke felt
      for etternavn, adresse eller fødselsdato.
   2. Det finnes ingen felt for helseopplysninger. Oppgavene er faste og
      ikke-kliniske, og fritekst er kort og merket. */

window.PP_BESOK = (function () {
  'use strict';

  var NOKKEL = 'pp_besok_v1';

  /* Faste oppgaver, med risikonivå.

     Nivåene er selve sikkerhetsmodellen, ikke en merkelapp:

       gronn    hverdagsoppgaver uten helserisiko. Enhver verifisert medarbeider.
       gul      krever opplæring eller ansvar. Leverandøren bestemmer hvem.
       rod      helsehjelp. Finnes ikke i denne lista og skal ikke finnes.
       forbudt  penger, PIN, BankID, verdisaker. Aldri, uansett nivå.

     Katalogen er bevisst kort. «Alt et menneske kan trenge» er ikke et
     produkt – det er en ansvarsflukt. Riktig behov til riktig kompetanse. */

  /* Hver oppgave bærer to ikoner, og det er ikke rot.

   svg tegnes der flaten kan ta markup. Emojien blir stående fordi to av
   stedene setter ren tekst – en oppsummeringslinje og en tabellcelle som
   escaper alt – og der er markup ikke et alternativ. Der brukes navnet
   alene, uten ikon: en emoji i en kommaliste tilfører ingenting og ser
   forskjellig ut på hver telefon.

   Grunnen til at svg finnes i det hele tatt: emoji rendres av
   operativsystemet. En kaffekopp ser ulik ut på iPhone, Android og
   Windows, og flere emoji er ansikter eller hender med hudtone. Et ansikt
   på en oppgavekategori er en tolkning ingen har bedt om. */
var OPPGAVER = [
    { id: 'samvaer',
    svg: 'M5 9h10.4v5.6a4.4 4.4 0 0 1-4.4 4.4H9.4A4.4 4.4 0 0 1 5 14.6Z" /><path d="M15.4 10.6h2.4a2.2 2.2 0 0 1 0 4.4h-2.4M8.4 3.4v2.4M12 3.4v2.4',  navn: 'Besøk og samvær',  ikon: '☕', risiko: 'gronn',
      forklaring: 'Prat, kaffe, høytlesing, kortspill, hobby',
      ikke: 'Ikke terapi, ikke vurdering av helsetilstand, ikke tilsyn om natten' },
    { id: 'digital',
    svg: 'M7.4 2.8h9.2a1.8 1.8 0 0 1 1.8 1.8v14.8a1.8 1.8 0 0 1-1.8 1.8H7.4a1.8 1.8 0 0 1-1.8-1.8V4.6a1.8 1.8 0 0 1 1.8-1.8Z" /><path d="M10.4 5.4h3.2M10.8 18.4h2.4',  navn: 'Digital hjelp',    ikon: '📱', risiko: 'gronn',
      forklaring: 'Telefon, nettbrett, TV, videosamtale, vise hvordan en app brukes',
      ikke: 'Ikke BankID, passord, betaling, gjenoppretting av konto eller fjernstyring' },
    { id: 'hjemme',
    svg: 'M7.2 8.2h5.6a1.9 1.9 0 0 1 1.9 1.9v9.2a1.9 1.9 0 0 1-1.9 1.9H7.2a1.9 1.9 0 0 1-1.9-1.9v-9.2a1.9 1.9 0 0 1 1.9-1.9Z" /><path d="M8.8 8.2V5.4h3.2v2.8M12 4.6h3.6l-1.7 2.6M5.3 12.6h9.4',   navn: 'Lett hjemmehjelp', ikon: '🧹', risiko: 'gul',
      forklaring: 'Oppvask, klesvask, skifte sengetøy, rydde lett',
      ikke: 'Ikke stige, ikke tunge løft, ikke sterke kjemikalier, ikke hovedrengjøring' },
    { id: 'hent',
    svg: 'M3.6 7.8 12 3.6l8.4 4.2v8.4L12 20.4l-8.4-4.2Z" /><path d="M3.6 7.8 12 12l8.4-4.2M12 12v8.4',     navn: 'Hent og lever',    ikon: '📦', risiko: 'gul',
      forklaring: 'Hente en pakke, eller en handel familien har valgt og betalt på forhånd',
      ikke: 'Ikke kontanter, ikke bytte av varer, ikke medisin, alkohol, tobakk eller papirer fra banken' }
  ];

  /* Fire oppgaver, ikke åtte.

     Det som er tatt ut, er ikke tatt ut fordi det er urimelig å ønske seg. Det
     er tatt ut fordi hver av dem bærer en risiko vi ikke kan måle før noen har
     brukt tjenesten: fall, transport eller mat. De hører til en kontrollert
     utvidelse, ikke til den første versjonen.

     Tjenesten er ikke en pleietjeneste. Den er praktisk og sosial støtte til
     eldre som i hovedsak klarer seg selv. Den forskjellen er grunnen til at
     lista er så kort. */
  var SENERE = [
    { hva: 'Kort tur ute',
      hvorfor: 'Fallrisiko utendørs. Krever egen vurdering per kunde.' },
    { hva: 'Følge til avtale med taxi eller buss',
      hvorfor: 'Transportansvar underveis, og en avtale som ikke kan avbrytes halvveis.' },
    { hva: 'Enkel matlaging',
      hvorfor: 'Mattrygghet, allergier og risiko på kjøkkenet.' },
    { hva: 'Følge på kultur- og sosiale arrangementer',
      hvorfor: 'Samme transport- og fallrisiko som turen.' }
  ];

  /* Planlagt telefon- eller videosamtale kan legges til et medlemskap.
     Den selges som sosial kontakt. Den selges aldri som trygghetsovervåking
     eller som en kontroll av at alt står bra til: det er et løfte om beredskap
     vi ikke har, og ingen skal tro at de har kjøpt det. */
  var SAMTALE = {
    id: 'samtale',
    navn: 'Planlagt samtale',
    forklaring: 'Avtalt telefon- eller videosamtale til fast tid',
    selgesSom: 'sosial kontakt',
    selgesAldriSom: ['trygghetsovervåking', 'sjekk av at alt står bra til', 'beredskap']
  };

  /* Ikke i katalogen, men søkt om ofte nok til at svaret må stå skrevet. */
  var UTENFOR = [
    { hva: 'Medisinering, dosett, sårstell',
      hvorfor: 'Helsehjelp. Krever autorisert personell.', niva: 'rod' },
    { hva: 'Dusjing, bading, toalett, påkledning',
      hvorfor: 'Personlig stell. Krever opplært pleiepersonell.', niva: 'rod' },
    { hva: 'Løfte en person, eller hjelpe noen opp av senga',
      hvorfor: 'Skaderisiko for begge. Krever opplæring.', niva: 'rod' },
    { hva: 'Vurdere helsetilstand eller ta en medisinsk avgjørelse',
      hvorfor: 'Helsehjelp, uansett hvor uformelt spørsmålet stilles.', niva: 'rod' },
    { hva: 'Være alene med en person med demens som tilsyn',
      hvorfor: 'Tilsynsansvar. Krever kompetanse og en annen bemanning.', niva: 'rod' },
    { hva: 'Nattevakt eller beredskap',
      hvorfor: 'Vi er ikke en nødtjeneste, og lover ikke at noen er trygg.', niva: 'rod' },
    { hva: 'Elektrisk arbeid, rørlegging, stiger',
      hvorfor: 'Krever fagbrev, eller er for farlig.', niva: 'rod' },
    { hva: 'Transport i medarbeiderens egen bil',
      hvorfor: 'Forsikring og ansvar underveis. Aldri.', niva: 'forbudt' },
    { hva: 'Kontanter, bankkort, PIN, BankID, passord',
      hvorfor: 'Aldri. Uansett hvem som spør.', niva: 'forbudt' },
    { hva: 'Fjernstyring av telefon eller PC',
      hvorfor: 'Gir tilgang til alt. Aldri, heller ikke for å hjelpe.', niva: 'forbudt' },
    { hva: 'Verdisaker, testament, fullmakter',
      hvorfor: 'Aldri via plattformen.', niva: 'forbudt' },
    { hva: 'Posisjonssporing, bilder fra hjemmet, lydopptak',
      hvorfor: 'Overvåking av et hjem. Ikke i noen versjon.', niva: 'forbudt' }
  ];

  var RISIKO = {
    gronn:   { navn: 'Grønn',   forklaring: 'Hverdagsoppgave uten helserisiko' },
    gul:     { navn: 'Gul',     forklaring: 'Krever opplæring eller mer ansvar' },
    rod:     { navn: 'Rød',     forklaring: 'Helsehjelp – ikke på plattformen' },
    forbudt: { navn: 'Forbudt', forklaring: 'Aldri, uansett kompetanse' }
  };

  /* Faste utfall i stedet for fritekst.

     Et åpent notatfelt hos en eldre person fylles før eller siden med en
     helseopplysning. Ikke fordi noen bryter reglene, men fordi det er det
     naturlige å skrive. Fem valg dekker det som faktisk må formidles, og
     ingen av dem kan bli en diagnose. */
  var UTFALL = {
    utfort:         { navn: 'Utført',                     farge: 'ok' },
    delvis:         { navn: 'Delvis utført',              farge: 'warn' },
    ikke_utfort:    { navn: 'Ikke utført',                farge: 'avvik' },
    oppfolging:     { navn: 'Leverandøren må følge opp',  farge: 'warn' },
    kontakt_familie:{ navn: 'Familien bør kontaktes',     farge: 'warn' }
  };

  function nå() { return new Date().toISOString(); }

  /* Arbeiderlenken utløper, og den kan brukes én gang. Begge deler er
     sikkerhetsegenskaper, ikke bekvemmeligheter: en lenke som ligger i en
     SMS-tråd i ukevis, er en åpen dør til et besøk hos en eldre person. */
  var LENKE_TIMER = 12;

  function tom() {
    return {
      leverandor: { navn: 'Nærhjelp Oslo AS', kontakt: 'post@naerhjelp.example' },
      logg: [],
      foresporsler: [],
      ansatte: [
        { id: 'a1', navn: 'Sofia H.' },
        { id: 'a2', navn: 'Daniel R.' },
        { id: 'a3', navn: 'Lena K.' }
      ],
      besok: []
    };
  }

  function les() {
    try {
      var rå = localStorage.getItem(NOKKEL);
      return rydd(rå ? JSON.parse(rå) : tom());
    } catch (e) {
      return tom();
    }
  }

  /* Sletting kjører ved hver lesning, ikke ved et nattlig jobbkall som kan
     stanse uten at noen merker det. Feltene faller bort etter tur – se
     SLETTEPLAN i besok-vern.js. En sletterutine som ikke kjører, er ikke en
     sletterutine; den er en setning i en personvernerklæring. */
  function rydd(data) {
    if (!window.PP_VERN || !data.besok) return data;
    var endret = false;
    data.besok = data.besok.map(function (b) {
      var r = window.PP_VERN.krymp(b);
      if (r.steg !== (b.krympet || 0)) endret = true;
      return r.besok;
    });
    if (endret) {
      try { localStorage.setItem(NOKKEL, JSON.stringify(data)); } catch (e) {}
    }
    return data;
  }

  function skriv(data) {
    try { localStorage.setItem(NOKKEL, JSON.stringify(data)); } catch (e) {}
    return data;
  }

  /* Arbeiderlenken er per besøk. Den gir tilgang til ett besøk, ikke til en konto. */
  function lagToken() {
    var t = '';
    var tegn = 'abcdefghijkmnpqrstuvwxyz23456789';
    for (var i = 0; i < 12; i++) t += tegn[Math.floor(Math.random() * tegn.length)];
    return t;
  }

  function loggfor(data, hendelse, gjelder, hvem) {
    data.logg = data.logg || [];
    data.logg.unshift({ tid: nå(), hendelse: hendelse, gjelder: gjelder, hvem: hvem || 'leverandør' });
    if (data.logg.length > 200) data.logg.length = 200;
  }

  function opprett(besok) {
    var data = les();
    besok.id = 'B-' + (1000 + data.besok.length + 1);
    besok.token = lagToken();
    besok.opprettet = nå();
    besok.utloper = new Date(Date.now() + LENKE_TIMER * 3600000).toISOString();
    besok.status = 'planlagt';
    data.besok.push(besok);
    loggfor(data, 'Besøk opprettet', besok.id);
    skriv(data);
    return besok;
  }

  function hentAlle() { return les().besok; }

  /* ---------- forespørsler fra den eldre eller pårørende ----------

     Forespørselen går til leverandøren, ikke til en åpen pool av fremmede.
     Leverandøren tildeler en av sine egne ansatte. Det er forskjellen mellom
     en markedsplass, som krever verifiseringskjede og vaktordning, og en
     mottaksfunksjon, som ikke gjør det. */

  function nyForesporsel(f) {
    var data = les();
    data.foresporsler = data.foresporsler || [];
    f.id = 'F-' + (100 + data.foresporsler.length + 1);
    f.mottatt = nå();
    f.status = 'ny';
    data.foresporsler.push(f);
    loggfor(data, 'Forespørsel mottatt', f.id, f.fra || 'kunde');
    skriv(data);
    return f;
  }

  function foresporsler() { return (les().foresporsler || []); }

  /* Tildeling gjør forespørselen om til et besøk. Da gjelder resten av
     flyten uendret: sikker lenke, bekreftelse, familiemelding. */
  function tildel(foresporselId, ansattId, dato, tid) {
    var data = les();
    var f = (data.foresporsler || []).filter(function (x) { return x.id === foresporselId; })[0];
    if (!f) return null;
    var ansatt = data.ansatte.filter(function (a) { return a.id === ansattId; })[0];
    if (!ansatt) return null;

    f.status = 'tildelt';
    skriv(data);

    var besok = opprett({
      kunde: f.kunde,
      oppgaver: f.oppgaver,
      dato: dato || f.onsketDato,
      tid: tid || f.onsketTid,
      ansattId: ansattId,
      ansattNavn: ansatt.navn,
      parorendeEpost: f.parorendeEpost || null,
      notat: f.notat || null,
      sprak: f.sprak || 'nb',
      fraForesporsel: f.id
    });
    return besok;
  }

  function avvisForesporsel(id, grunn) {
    var data = les();
    var f = (data.foresporsler || []).filter(function (x) { return x.id === id; })[0];
    if (!f) return null;
    f.status = 'avvist';
    f.avvistGrunn = grunn || null;
    loggfor(data, 'Forespørsel avvist', id);
    skriv(data);
    return f;
  }

  function hent(id) {
    return les().besok.filter(function (b) { return b.id === id; })[0] || null;
  }

  /**
   * @returns {{status:'ok'|'ukjent'|'utlopt'|'brukt', besok:?object}}
   */
  function hentMedToken(token) {
    var data = les();
    var b = data.besok.filter(function (x) { return x.token === token; })[0];
    if (!b) return { status: 'ukjent', besok: null };
    if (b.status === 'fullfort') return { status: 'brukt', besok: b };
    if (b.utloper && new Date(b.utloper) < new Date()) return { status: 'utlopt', besok: b };

    loggfor(data, 'Lenke åpnet av arbeider', b.id, b.ansattNavn);
    skriv(data);
    return { status: 'ok', besok: b };
  }

  function fullfor(token, rapport) {
    var data = les();
    var b = data.besok.filter(function (x) { return x.token === token; })[0];
    if (!b) return { status: 'ukjent', besok: null };
    // Dobbeltinnsending skal ikke overskrive den første rapporten.
    if (b.status === 'fullfort') return { status: 'brukt', besok: b };

    b.status = 'fullfort';
    b.rapport = rapport;
    b.fullfortTid = nå();
    loggfor(data, 'Rapport levert (' + rapport.utfall + ')', b.id, b.ansattNavn);
    if (b.parorendeEpost) loggfor(data, 'Melding sendt til pårørende', b.id, 'system');
    skriv(data);
    return { status: 'ok', besok: b };
  }

  function logg() { return les().logg || []; }

  function ansatte() { return les().ansatte; }
  function leverandor() { return les().leverandor; }

  function nullstill() {
    try { localStorage.removeItem(NOKKEL); } catch (e) {}
  }

  /* Meldingen til pårørende bygges av faste deler. Den kan aldri inneholde
     fritekst som ikke er godkjent av arbeideren, og aldri helseopplysninger. */
  function familiemelding(b) {
    if (!b || !b.rapport) return '';
    var tid = new Date(b.fullfortTid);
    var kl = String(tid.getHours()).padStart(2, '0') + ':' + String(tid.getMinutes()).padStart(2, '0');
    var oppgavenavn = b.oppgaver.map(function (id) {
      var o = OPPGAVER.filter(function (x) { return x.id === id; })[0];
      return o ? o.navn.toLowerCase() : id;
    });

    var linjer = [];
    if (b.rapport.utfall === 'utfort') {
      linjer.push('Dagens besøk hos ' + b.kunde + ' ble utført kl. ' + kl + '.');
      linjer.push('Dette ble gjort: ' + oppgavenavn.join(', ') + '.');
    } else if (b.rapport.utfall === 'delvis') {
      linjer.push('Dagens besøk hos ' + b.kunde + ' ble gjennomført kl. ' + kl + '.');
      linjer.push('Noe av det planlagte ble ikke gjort. ' + leverandor().navn + ' tar kontakt.');
    } else if (b.rapport.utfall === 'oppfolging') {
      linjer.push('Dagens besøk hos ' + b.kunde + ' ble utført kl. ' + kl + '.');
      linjer.push(leverandor().navn + ' ønsker å snakke med deg om noe fra besøket og tar kontakt.');
    } else {
      linjer.push('Dagens besøk hos ' + b.kunde + ' ble ikke gjennomført.');
      linjer.push(leverandor().navn + ' tar kontakt for å avtale nytt tidspunkt.');
    }

    if (b.rapport.kommentar) linjer.push('Melding fra ' + b.ansattNavn + ': «' + b.rapport.kommentar + '»');
    linjer.push('');
    linjer.push('Denne meldingen er sendt fra ' + leverandor().navn + ' via Naviar.');
    linjer.push('Har du spørsmål, kontakt ' + leverandor().kontakt + '.');
    return linjer.join('\n');
  }

  /* Tegner et oppgaveikon som SVG. Returnerer tom streng hvis oppgaven
     mangler bane – da faller flaten tilbake til bare navnet, som er riktig:
     et ikon som ikke finnes, skal ikke bli et tomt hull. */
  function ikonMarkup(oppgave, storrelse) {
    var o = oppgave || {};
    if (!o.svg) return '';
    var s = storrelse || 20;
    return '<svg class="oppgaveikon" viewBox="0 0 24 24" width="' + s + '" height="' + s +
           '" fill="none" stroke="currentColor" stroke-width="1.6" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           '<path d="' + o.svg + '" /></svg>';
  }

  return {
    OPPGAVER: OPPGAVER,
    ikonMarkup: ikonMarkup,
    SENERE: SENERE,
    SAMTALE: SAMTALE,
    UTENFOR: UTENFOR,
    RISIKO: RISIKO,
    UTFALL: UTFALL,
    opprett: opprett,
    hentAlle: hentAlle,
    hent: hent,
    hentMedToken: hentMedToken,
    fullfor: fullfor,
    ansatte: ansatte,
    leverandor: leverandor,
    familiemelding: familiemelding,
    nyForesporsel: nyForesporsel,
    foresporsler: foresporsler,
    tildel: tildel,
    avvisForesporsel: avvisForesporsel,
    logg: logg,
    LENKE_TIMER: LENKE_TIMER,
    nullstill: nullstill
  };
})();
