/* Naviar Klarhet – én samtale, tre tydelige neste steg.

   Ingen kjøper en konsultasjon. De kjøper å slippe å google i tre uker.

   Det er ikke en formulering, det er en produktbeslutning med følger: selger
   vi minutter, blir 45 minutter det kunden vurderer oss på, og en samtale som
   gikk fort blir en dårlig handel. Selger vi utfallet – hvem du skal ringe,
   hva du skal si, hva du gjør først – blir en kort samtale den beste.

   Derfor har denne modulen én ting den håndhever over alt annet: en samtale
   er ikke levert før de tre stegene er skrevet ned og sendt.

   Kunden er som regel ikke den eldre. Det er datteren på 52 i en annen by,
   som ikke vet hvilket kontor som avgjør hva, og som er redd for å gjøre noe
   feil på vegne av moren sin. Hun betaler. Moren bestemmer. */

window.PP_KLARHET = (function () {
  'use strict';

  var NAVN = {
    tilbud: 'Naviar Klarhet',
    slagord: 'Én samtale. Tre tydelige neste steg.',
    lofte: 'Få riktig hjelp på 45 minutter.',
    undertekst: 'Bestill en verifisert fagperson som viser deg hvem du skal ' +
                'kontakte og hva du bør gjøre videre.',
    knapp: 'Finn riktig ekspert',
    altmelding: 'Familien kan bestille. Den eldre bestemmer.'
  };

  /* Hvem som faktisk betaler. Står her fordi hver eneste tekst på flaten
     skrives til henne, og fordi det er lett å skrive til den eldre i stedet –
     hun er den tjenesten handler om, men hun er ikke den som leter. */
  var KUNDE = {
    hvem: 'Voksent barn, 40–65 år, bor et annet sted enn foreldrene',
    problem: [
      'Vet ikke hvilket kontor som avgjør hva',
      'Finner motstridende svar på nett',
      'Er redd for å gjøre noe feil på vegne av foreldrene',
      'Kan ikke stille opp fysisk',
      'Vil kunne følge med uten å ta over'
    ],
    annonse: 'Foreldrene dine trenger hjelp. Du trenger å vite hva som skjer videre.',
    /* Den eldre er ikke kunden, men hun er den saken gjelder. Alt som sendes
       ut om henne, går gjennom hennes godkjenning. Se PP_EKSPERT.SAMTYKKE. */
    eldre: 'Bestemmer hvem hun snakker med, hvordan, og hva som sendes videre'
  };

  /* ---------- det som faktisk leveres ---------- */

  var INNHOLD = [
    'En verifisert fagperson som har arbeidet med akkurat dette',
    '45 minutter på telefon eller video',
    'Navnet på riktig instans – ikke «kommunen», men hvilket kontor',
    'Tre neste steg, skriftlig',
    'Offentlige lenker og telefonnumre til stegene',
    'Oppsummering til familien, når den eldre har godkjent den',
    'Ett kort oppfølgingsspørsmål etter sju dager',
    'Ny samtale uten ekstra kostnad hvis eksperten var feil'
  ];

  /* ---------- de tre stegene ----------

     Formen er ikke pynt. Et steg uten hvem, uten hva og uten en vei å komme
     dit, er et råd – og et råd er akkurat det kunden hadde for mye av fra før.

     Rekkefølgen betyr noe også: det første steget skal kunne gjøres i dag.
     Den som får tre steg der det første tar tre uker, har ikke fått klarhet,
     hun har fått en plan. */
  var TRE_STEG = {
    antall: 3,
    /* Overskriften og de tre feltene. Formen er alltid den samme, og det er
       poenget: kunden som har hatt to samtaler, skal kjenne igjen arket. */
    overskrift: 'Dette gjør du nå',
    felt: [
      { id: 'kontakt', navn: 'Kontakt',    hva: 'Instansen eller personen som skal ringes' },
      { id: 'forbered', navn: 'Forbered',  hva: 'Opplysningen eller papiret som må være klart' },
      { id: 'neste',   navn: 'Neste steg', hva: 'Den første handlingen, og når' }
    ],
    hvertStegMaaHa: ['hvem du kontakter', 'hva du sier eller tar med', 'når'],
    forsteStegetSkal: 'kunne gjøres samme dag eller neste virkedag',
    kontaktvei: 'Minst ett av telefonnummer eller offentlig lenke per steg',
    skrivesAv: 'eksperten, mens samtalen pågår',
    sendes: ['kunden', 'den eldre', 'familien når den eldre har sagt ja'],
    maksOrdPerSteg: 40
  };

  /* ---------- garantien ----------

     Vi garanterer det vi styrer over, og ingenting mer. En garanti om utfall
     hos NAV er ikke bare umulig å innfri – den flytter forventningen om at vi
     kan påvirke en sak, og det er den påstanden hele tjenesten er bygget for
     ikke å gi. */
  var GARANTI = {
    id: 'riktig_ekspert',
    navn: 'Riktig-ekspert-garanti',
    tekst: 'Viser det seg underveis at saken ligger utenfor ekspertens område, ' +
           'setter vi opp en ny samtale med riktig fagperson uten at du betaler mer.',
    utloses: 'Av eksperten selv, eller av kunden innen sju dager',
    garantererIkke: [
      { hva: 'At du får en offentlig ytelse',   hvorfor: 'Det avgjør NAV eller kommunen, ikke vi' },
      { hva: 'Hva et vedtak kommer til å bli',  hvorfor: 'Ingen utenfor saken kan vite det' },
      { hva: 'En medisinsk vurdering',          hvorfor: 'Vi yter ikke helsehjelp. Se PP_EKSPERT.LEGEKONSULTASJON' },
      { hva: 'At saken går fort',               hvorfor: 'Saksbehandlingstiden er ikke vår' }
    ]
  };

  /* ---------- oppfølgingen ----------

     Sju dager. Ett spørsmål. Ikke fordi det er nok til å måle noe stort, men
     fordi to spørsmål gir null svar – det samme vi lærte i PP_KVALITET. */
  var OPPFOLGING = {
    dager: 7,
    sporsmaal: 'Fikk du gjort det du skulle?',
    svar: ['Ja', 'Delvis', 'Nei'],
    ved_nei: 'Tilbud om en kort oppfølgingssamtale',
    hvorfor: 'Sier om samtalen ga klarhet eller bare følelsen av klarhet. ' +
             'De to kjennes like ut i det man legger på'
  };

  /* ---------- prisen og hva som blir igjen ----------

     Tallene står her, ikke i et regneark, fordi de er en beslutning om
     forretningsmodell: 599 ut, 449 til eksperten, 150 til oss. Det gjør oss
     til en tjeneste som tar en fjerdedel, ikke til en markedsplass som tar en
     formidlingsavgift. */
  var PAKKE = {
    id: 'klarhet45',
    navn: 'Klarhet 45',
    minutter: 45,
    pris: 599,
    tilEkspert: 449,
    valuta: 'NOK',
    inkludert: INNHOLD,
    ingenSkjulteTillegg: true,
    abonnement: false,
    hvorforIkkeAbonnement: 'Vi vet ikke om noen betaler for dette én gang. ' +
                           'Et abonnement skjuler nettopp det svaret'
  };

  /* Kortgebyret er en antakelse til avtalen er signert, og den står som en
     antakelse. 1,4 % + 2,50 kr er vanlig for europeiske kort. */
  var KORTGEBYR = { andel: 0.014, fast: 2.5, antakelse: true };

  function okonomi(pris, tilEkspert) {
    var p = typeof pris === 'number' ? pris : PAKKE.pris;
    var e = typeof tilEkspert === 'number' ? tilEkspert : PAKKE.tilEkspert;
    var brutto = p - e;
    var kort = Math.round((p * KORTGEBYR.andel + KORTGEBYR.fast) * 100) / 100;
    var netto = Math.round((brutto - kort) * 100) / 100;
    return {
      pris: p, tilEkspert: e, brutto: brutto, kortgebyr: kort, netto: netto,
      andel: Math.round((brutto / p) * 1000) / 10,
      andelNetto: Math.round((netto / p) * 1000) / 10
    };
  }

  /* ---------- 30 dager, og hva som skal være sant da ----------

     Skrevet ned før piloten starter, av samme grunn som stopp-punktene i
     PP_MALING: et mål man setter etterpå, er ikke et mål. Det er en
     forklaring på tallet man fikk. */
  var MAL30 = [
    { id: 'eksperter',  navn: 'Verifiserte eksperter',            mal: 5,   retning: 'hoy', enhet: 'antall' },
    { id: 'samtaler',   navn: 'Betalte samtaler',                 mal: 20,  retning: 'hoy', enhet: 'antall' },
    { id: 'fullfort',   navn: 'Påbegynte bestillinger fullført',  mal: 70,  retning: 'hoy', enhet: '%' },
    { id: 'igjen',      navn: 'Ny samtale eller anbefaling',      mal: 30,  retning: 'hoy', enhet: '%' },
    { id: 'inntekt',    navn: 'Naviar per samtale',               mal: 150, retning: 'hoy', enhet: 'kr' },
    { id: 'klarhet',    navn: 'Sier «neste steg er tydelig»',     mal: 80,  retning: 'hoy', enhet: '%' }
  ];

  var PILOT = { kategori: 'nav', pakke: 'klarhet45', eksperter: 5, dager: 30 };

  function pilotdom(tellere) {
    var t = tellere || {};
    if ((t.samtaler || 0) < MAL30.filter(function (m) { return m.id === 'samtaler'; })[0].mal) {
      return { ok: false, kode: 'for_tidlig', brutt: [],
               grunn: 'Under 20 betalte samtaler. Tallene betyr ikke noe ennå' };
    }
    var brutt = MAL30.filter(function (m) {
      var v = t[m.id];
      if (v === null || v === undefined) return false;
      return m.retning === 'hoy' ? v < m.mal : v > m.mal;
    });
    return brutt.length
      ? { ok: false, kode: 'under_mal', brutt: brutt.map(function (m) { return m.id; }),
          grunn: 'Under målet: ' + brutt.map(function (m) { return m.navn; }).join('; ') }
      : { ok: true, kode: 'bestatt', brutt: [], grunn: 'Alle målene er nådd' };
  }

  /* ---------- Navigator ----------

     Det som skiller oss fra et søk, er ikke at vi vet mer. Det er at vi
     ender et annet sted: et søk gir informasjon, Navigator gir én bestilling
     eller ett telefonnummer.

     Derfor skal kunden aldri måtte vite hvilken kategori hun trenger. Det
     spørsmålet – «er dette praktisk hjelp eller er det en fagperson?» – er
     nettopp det hun ikke kan svare på, og det er derfor hun er her.

     Fem spørsmål, fire utfall. To av utfallene er at vi ikke selger henne
     noe, og de er ikke en lekkasje: den som blir sendt riktig sted gratis,
     er den som kommer tilbake og betaler når det faktisk er vår sak.

     Verktøyet svarer også om hun aldri bestiller. Et verktøy som holder
     svaret tilbake til man betaler, er ikke gratis – det er en betalingsmur
     med fem spørsmål foran. */
  var NAVIGATOR = {
    tittel: 'Hvem skal jeg kontakte?',
    gratis: true,
    svarUtenBestilling: true,
    sporsmaal: [
      { id: 'for', navn: 'Hvem gjelder det?',
        valg: [
          { id: 'forelder', navn: 'En forelder eller slektning' },
          { id: 'megselv',  navn: 'Meg selv' }
        ] },
      { id: 'tema', navn: 'Hva gjelder det?',
        valg: [
          { id: 'penger',   navn: 'Penger, pensjon eller ytelser',   utfall: 'klarhet', kategori: 'nav' },
          { id: 'hjelp',    navn: 'Hjelp hjemme eller sykehjem',     utfall: 'klarhet', kategori: 'kommune' },
          { id: 'digitalt', navn: 'Innlogging, skjema eller Altinn', utfall: 'klarhet', kategori: 'digital' },
          { id: 'praktisk', navn: 'Handling, husarbeid eller følge', utfall: 'praktisk' },
          { id: 'helse',    navn: 'Helse, medisin eller symptomer',  utfall: 'helsehjelp' }
        ] },
      { id: 'hast', navn: 'Hvor mye haster det?',
        valg: [
          { id: 'akutt',  navn: 'Det haster nå', hast: true },
          { id: 'uker',   navn: 'I løpet av noen uker' },
          { id: 'planer', navn: 'Jeg planlegger framover' }
        ] },
      { id: 'form', navn: 'Hjemme eller på telefon?',
        valg: [
          { id: 'hjemme',  navn: 'Noen må komme hjem' },
          { id: 'telefon', navn: 'Telefon eller video holder' },
          { id: 'vetikke', navn: 'Vet ikke' }
        ] },
      { id: 'sprak', navn: 'Hvilket språk vil du snakke?',
        fra: 'PP_SPRAK_UI.SPRAK' }
    ],
    tilSlutt: 'Vil du snakke med en erfaren fagperson?'
  };

  /* De fire utfallene. To av dem selger, to av dem sender kunden ut – og det
     er den fordelingen som gjør Navigator til noe annet enn et salgsskjema. */
  var UTFALL = [
    { id: 'praktisk',   navn: 'Praktisk hjelp',        selger: true,
      hva: 'En medarbeider kommer hjem og gjør en avgrenset oppgave' },
    { id: 'klarhet',    navn: 'Naviar Klarhet',        selger: true,
      hva: 'En samtale med en fagperson, og tre neste steg' },
    { id: 'helsehjelp', navn: 'Autorisert helsehjelp', selger: false,
      hva: 'Fastlege, hjemmesykepleie eller legevakt. Vi yter ikke helsehjelp' },
    { id: 'offentlig',  navn: 'Offentlig eller akutt', selger: false,
      hva: 'Et telefonnummer, ikke en time om tre dager' }
  ];

  /* Rekkefølgen i funksjonen er ikke tilfeldig, og den er det eneste stedet
     i modulen der rekkefølgen kan gjøre skade:

       hast før alt annet – den som har det travelt, skal ikke få en
       bestillingsknapp, uansett hva saken gjelder.
       helse før kategori – ellers kan en helsesak havne i en kategori bare
       fordi den også har en økonomisk side. */
  function navigator(svar) {
    var s = svar || {};
    var akutt = window.PP_EKSPERT ? window.PP_EKSPERT.AKUTTVARSEL : null;

    if (s.hast === 'akutt') {
      return { utfall: 'offentlig', kategori: null, bestilling: false,
               tittel: akutt ? akutt.tittel : 'Ikke for akutt hjelp',
               svar: akutt ? akutt.tekst : 'Ring 116 117. Ring 113 ved fare for liv.',
               numre: akutt ? akutt.numre : ['116 117', '113'] };
    }

    var tema = NAVIGATOR.sporsmaal[1].valg.filter(function (t) { return t.id === s.tema; })[0];
    if (!tema) {
      return { utfall: null, kategori: null, bestilling: false,
               svar: 'Velg hva det gjelder' };
    }

    if (tema.utfall === 'helsehjelp') {
      var h = window.PP_GUIDE ? window.PP_GUIDE.henvisning('medisin') : null;
      return { utfall: 'helsehjelp', kategori: null, bestilling: false,
               tittel: 'Dette hører hjemme i helsetjenesten',
               svar: 'Start hos fastlegen. Vi gir ikke helseråd, og vi har ingen ' +
                     'fagperson som kan vurdere symptomer.',
               til: h ? h.til : ['Fastlegen'] };
    }

    if (tema.utfall === 'praktisk') {
      return { utfall: 'praktisk', kategori: null, bestilling: true,
               tittel: 'Praktisk hjelp',
               svar: 'En medarbeider kommer hjem og gjør en avgrenset oppgave.',
               tjeneste: 'praktisk' };
    }

    /* Klarhet, men bare hvis kunden faktisk kan bestille den. En kategori som
       ikke er åpen, skal si det – ikke vise en tom kalender. */
    var k = window.PP_EKSPERT ? window.PP_EKSPERT.kategori(tema.kategori) : null;
    if (k && k.pilot === false) {
      return { utfall: 'klarhet', kategori: tema.kategori, bestilling: false,
               tittel: k.navn, svar: k.senere || 'Denne kategorien er ikke åpen ennå' };
    }

    /* Skal noen komme hjem, er det ikke en telefonsamtale. Sier kunden det
       selv, skal ikke vi overprøve henne for å få solgt den pakken vi har. */
    if (s.form === 'hjemme') {
      return { utfall: 'praktisk', kategori: tema.kategori, bestilling: true,
               tittel: 'Praktisk hjelp',
               svar: 'Du sa at noen må komme hjem. Da er det praktisk hjelp, ' +
                     'ikke en samtale.',
               tjeneste: 'praktisk' };
    }

    return { utfall: 'klarhet', kategori: tema.kategori, bestilling: true,
             tittel: k ? k.navn : tema.navn,
             svar: k ? k.gjorLettere : null,
             gjorIkke: k ? k.girIkkeRett : [],
             sprak: s.sprak || 'nb',
             sporsmaal: NAVIGATOR.tilSlutt };
  }

  /* ---------- det vi ikke gjør på flaten ----------

     Kunden er bekymret på vegne av en forelder. Det er den tilstanden all
     hastemarkedsføring er bygget for å utnytte, og derfor den ene tingen vi
     ikke kan gjøre og fortsatt være tjenesten vi sier vi er. */
  var ALDRI_SELG = [
    { hva: 'Nedtelling eller «to plasser igjen»',
      hvorfor: 'Kalenderen viser det den viser. En knapphet vi har laget selv, er en løgn' },
    { hva: 'Sammenlikning med hva det koster å ikke handle',
      hvorfor: 'Det er å selge på frykt for en forelders helse' },
    { hva: 'Anmeldelser vi har bedt om ordlyden til',
      hvorfor: 'Da måler vi ikke lenger noe' },
    { hva: 'Løfter om utfall hos NAV eller kommunen',
      hvorfor: 'Se GARANTI.garantererIkke' }
  ];

  /* ---------- sjekk av leveransen ----------

     Kjøres før de tre stegene sendes. Uten den blir «tre tydelige neste steg»
     en overskrift, og innholdet blir det eksperten rakk å skrive. */
  function sjekkTreSteg(steg) {
    var liste = steg || [];
    var funn = [];

    if (liste.length !== TRE_STEG.antall) {
      funn.push({ id: 'antall',
                  hva: 'Det er ' + liste.length + ' steg. Det skal være ' + TRE_STEG.antall,
                  istedenfor: 'Tre steg. Er det færre, er saken ikke klar. Er det flere, er det en plan' });
    }

    liste.forEach(function (st, i) {
      var n = i + 1;
      var s = st || {};
      if (!s.hvem) {
        funn.push({ id: 'hvem', steg: n, hva: 'Steg ' + n + ' mangler hvem som skal kontaktes',
                    istedenfor: 'Navnet på kontoret, ikke «kommunen»' });
      }
      if (!s.hva) {
        funn.push({ id: 'hva', steg: n, hva: 'Steg ' + n + ' mangler hva kunden skal gjøre',
                    istedenfor: 'Hva hun sier, eller hva hun tar med' });
      }
      if (!s.telefon && !s.lenke) {
        funn.push({ id: 'kontaktvei', steg: n, hva: 'Steg ' + n + ' mangler telefonnummer eller lenke',
                    istedenfor: TRE_STEG.kontaktvei });
      }
      var ord = String(s.hva || '').trim();
      ord = ord ? ord.split(/\s+/).length : 0;
      if (ord > TRE_STEG.maksOrdPerSteg) {
        funn.push({ id: 'for_langt', steg: n,
                    hva: 'Steg ' + n + ' er ' + ord + ' ord. Grensen er ' + TRE_STEG.maksOrdPerSteg,
                    istedenfor: 'Én handling per steg' });
      }
      if (window.PP_VERN && s.hva) {
        var v = window.PP_VERN.sjekk(s.hva);
        v.funn.forEach(function (f) {
          funn.push({ id: 'personvern', steg: n,
                      hva: 'Steg ' + n + ' inneholder noe som ikke skal lagres',
                      kategori: f.id,
                      istedenfor: 'Skriv hva hun skal gjøre, ikke hvorfor hun trenger det' });
        });
      }
    });

    return { ok: funn.length === 0, funn: funn };
  }

  return {
    NAVN: NAVN,
    KUNDE: KUNDE,
    INNHOLD: INNHOLD,
    TRE_STEG: TRE_STEG,
    GARANTI: GARANTI,
    OPPFOLGING: OPPFOLGING,
    PAKKE: PAKKE,
    KORTGEBYR: KORTGEBYR,
    MAL30: MAL30,
    PILOT: PILOT,
    NAVIGATOR: NAVIGATOR,
    UTFALL: UTFALL,
    ALDRI_SELG: ALDRI_SELG,
    okonomi: okonomi,
    pilotdom: pilotdom,
    navigator: navigator,
    sjekkTreSteg: sjekkTreSteg
  };
})();
