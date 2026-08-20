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

  var OPPGAVER = [
    { id: 'handling',  navn: 'Handling og ærend',        ikon: '🛒', risiko: 'gronn',
      forklaring: 'Dagligvarer, post, hente pakker' },
    { id: 'samvaer',   navn: 'Sosialt besøk',            ikon: '☕', risiko: 'gronn',
      forklaring: 'Prat, kaffe, høytlesing, kortspill' },
    { id: 'tur',       navn: 'Tur og aktivitet',         ikon: '🚶', risiko: 'gronn',
      forklaring: 'Gåtur, kafé, aktivitetssenter' },
    { id: 'digital',   navn: 'Hjelp med telefon og TV',  ikon: '📱', risiko: 'gronn',
      forklaring: 'Videosamtale, wifi, fjernkontroll, gjenkjenne svindel' },
    { id: 'praktisk',  navn: 'Små praktiske oppgaver',   ikon: '🔧', risiko: 'gronn',
      forklaring: 'Lyspære, søppel, flytte noe lett, vanne blomster' },
    { id: 'hjemme',    navn: 'Lett husarbeid',           ikon: '🧹', risiko: 'gul',
      forklaring: 'Oppvask, klesvask, skifte sengetøy. Ikke høyt eller tungt' },
    { id: 'mat',       navn: 'Matlaging',                ikon: '🍲', risiko: 'gul',
      forklaring: 'Lage eller varme et enkelt måltid, spise sammen' },
    { id: 'folge',     navn: 'Følge til avtale',         ikon: '🤝', risiko: 'gul',
      forklaring: 'Lege, tannlege, frisør, bank. Medarbeideren venter og følger hjem' }
  ];

  /* Ikke i katalogen, men søkt om ofte nok til at svaret må stå skrevet. */
  var UTENFOR = [
    { hva: 'Medisinering, sårstell, personlig stell', hvorfor: 'Helsehjelp. Krever autorisert personell.', niva: 'rod' },
    { hva: 'Dusjing, bading, toalett, påkledning',    hvorfor: 'Personlig stell. Krever opplært pleiepersonell.', niva: 'rod' },
    { hva: 'Løfte eller flytte en person',            hvorfor: 'Skaderisiko for begge. Krever opplæring.', niva: 'rod' },
    { hva: 'Kontanter, bankkort, PIN, BankID',        hvorfor: 'Aldri. Uansett hvem som spør.', niva: 'forbudt' },
    { hva: 'Verdisaker, testament, fullmakter',       hvorfor: 'Aldri via plattformen.', niva: 'forbudt' },
    { hva: 'Elektrisk arbeid, rørlegging, stiger',    hvorfor: 'Krever fagbrev eller er for farlig.', niva: 'rod' }
  ];

  var RISIKO = {
    gronn:   { navn: 'Grønn',   forklaring: 'Hverdagsoppgave uten helserisiko' },
    gul:     { navn: 'Gul',     forklaring: 'Krever opplæring eller mer ansvar' },
    rod:     { navn: 'Rød',     forklaring: 'Helsehjelp – ikke på plattformen' },
    forbudt: { navn: 'Forbudt', forklaring: 'Aldri, uansett kompetanse' }
  };

  var UTFALL = {
    utfort:      { navn: 'Utført',              farge: 'ok' },
    delvis:      { navn: 'Delvis utført',       farge: 'warn' },
    ikke_utfort: { navn: 'Ikke utført',         farge: 'avvik' },
    oppfolging:  { navn: 'Trenger oppfølging',  farge: 'warn' }
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
      return rå ? JSON.parse(rå) : tom();
    } catch (e) {
      return tom();
    }
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

  return {
    OPPGAVER: OPPGAVER,
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
