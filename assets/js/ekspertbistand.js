/* Naviar Ekspertbistand – erfaring når du trenger den.

   Dette er den andre tjenesten, ikke en utvidelse av den første. Forskjellen
   er ikke prisen eller lengden, den er hva som faktisk skjer:

     Praktisk hjelp  – noen gjør noe hjemme hos deg. Vi svarer for utførelsen.
     Ekspertbistand  – noen forteller deg hvordan systemet henger sammen, og
                       hvor du skal gå. Vi svarer for at personen er den hun
                       sier hun er, og at samtalen holder seg innenfor det
                       hun har lov til å si.

   De to må ikke blandes på flaten. En kunde som tror hun har bestilt hjelp og
   får en samtale, har fått noe annet enn hun betalte for – og motsatt.

   Grensen som bærer hele modulen:

     En tidligere NAV-rådgiver kan fortelle hvordan en søknad behandles, hvilke
     frister som gjelder og hvem som avgjør. Hun kan ikke behandle saken din,
     søke på dine vegne eller si hva utfallet blir. Yrkesbakgrunn er et
     kjennetegn ved personen, ikke en fullmakt hun tar med seg hit.

   Derfor har hver kategori to lister, og den andre er den viktigste:
   hva den gjør lettere, og hva den ikke gir rett til. */

window.PP_EKSPERT = (function () {
  'use strict';

  /* ---------- de to tjenestene ---------- */

  var TJENESTE = [
    { id: 'praktisk', navn: 'Praktisk hjelp',
      kort: 'Handling, lett hjemmehjelp, følge og samvær.',
      hvem: 'En medarbeider kommer hjem til deg.',
      katalog: 'PP_LAGER.OPPGAVER' },
    { id: 'klarhet', navn: 'Naviar Klarhet',
      kort: 'Snakk med en erfaren fagperson og få tre tydelige neste steg.',
      hvem: 'Du snakker med noen som har arbeidet i systemet du står fast i.',
      katalog: 'PP_EKSPERT.KATEGORI' }
  ];

  /* Navnene, og hvorfor de er to.

     «Ekspertbistand» er en kategori. Ingen våkner og bestemmer seg for å
     kjøpe bistand – de våkner og lurer på hvem de skal ringe. Derfor heter
     det kunden kjøper noe annet enn det vi bygger:

       NAVIAR Klarhet   – tilbudet. Én samtale, tre tydelige neste steg.
       Ekspertbistand   – tilbudssiden. Fagfolkene, kategoriene og kalenderen.

     Kunden ser det første. Vi drifter det andre. Den som bytter dem om på en
     forside, selger minutter i stedet for et utfall. */
  var NAVN = {
    tilbud: 'NAVIAR Klarhet',
    slagord: 'Én samtale. Tre tydelige neste steg.',
    lofte: 'Få riktig hjelp på 45 minutter.',
    tilbudsside: 'Ekspertbistand',
    avtale: 'Klarhetssamtale',
    rolle: 'Naviar Fagveileder',
    knapp: 'Finn riktig ekspert'
  };

  /* ---------- kategoriene ----------

     Hver kategori sier tre ting: hva den handler om, hva bakgrunnen gjør
     lettere, og hva den ikke gir rett til. Den siste er ikke en advarsel til
     kunden – den er grensen for hva Fagveilederen kan si, og den står i
     samtaleskjermen hennes mens samtalen pågår. */

  var KATEGORI = [
    { id: 'nav',
      pilot: true,
      navn: 'NAV og pensjon',
      bakgrunn: ['Tidligere NAV-rådgiver', 'Saksbehandler pensjon', 'Ansatt i pensjonskasse'],
      gjorLettere: 'Forstå hvilken ytelse som gjelder, hvordan en sak behandles og hvilke frister som løper',
      girIkkeRett: [
        'Å behandle eller påvirke en sak',
        'Å søke på kundens vegne eller logge inn for henne',
        'Å si hva utfallet av en søknad blir'
      ],
      verifiseres: 'referanse' },

    { id: 'kommune',
      pilot: true,
      navn: 'Kommune og omsorg',
      bakgrunn: ['Tidligere kommunal rådgiver', 'Tildelingskontor', 'Servicekontor'],
      gjorLettere: 'Vite hvilket kontor som avgjør hva, og hvordan man ber om en vurdering',
      girIkkeRett: [
        'Å love at en tjeneste blir innvilget',
        'Å vurdere kundens hjelpebehov på kommunens vegne',
        'Å klage på vegne av kunden uten skriftlig fullmakt'
      ],
      verifiseres: 'referanse' },

    { id: 'helseveiledning',
      pilot: false,
      senere: 'Verifisering mot HPR og grensen mot helsehjelp må avklares først',
      navn: 'Helseveiledning',
      bakgrunn: ['Sykepleier', 'Helsekoordinator', 'Ergoterapeut'],
      gjorLettere: 'Finne fram i helsetjenesten: hvem gjør hva, i hvilken rekkefølge, og hva man skal be om',
      /* Den skarpeste av alle listene. En sykepleier i telefonen får spørsmål
         om symptomer innen fem minutter, hver gang. Da er skriptet det eneste
         som står mellom veiledning og helsehjelp. */
      girIkkeRett: [
        'Å vurdere symptomer eller helsetilstanden til kunden',
        'Å stille eller antyde en diagnose',
        'Å anbefale, endre eller seponere medisin',
        'Å si om noe «ser alvorlig ut» eller «kan vente»'
      ],
      sporsmaalViIkkeSvarerPaa: [
        'Hva tror du dette er?',
        'Bør jeg være bekymret?',
        'Kan jeg slutte med denne tabletten?',
        'Trenger jeg å dra til legevakten?'
      ],
      svarIStedet: 'Det er fastlegen som kan vurdere det. Jeg kan hjelpe deg med å ' +
                   'få time, og med hva du bør si når du ringer.',
      akuttvarsel: true,
      verifiseres: 'hpr',
      /* Kan en sykepleier veilede om helsetjenesten uten at det blir
         helsehjelp med journalplikt? Grensen er reell og den er ikke vår å
         avgjøre. Kategorien bygges med skriptet på plass og med dette flagget
         stående til jurist har sett på den. */
      maaAvklares: 'Om veiledningen utløser dokumentasjonsplikt etter helsepersonelloven' },

    { id: 'bolig',
      pilot: false,
      senere: 'Liten etterspørsel alene. Kommer oftest opp inne i en kommunesamtale',
      navn: 'Bolig og hjelpemidler',
      bakgrunn: ['Tidligere ansatt i Hjelpemiddelsentralen', 'Ergoterapeut', 'Boligrådgiver'],
      gjorLettere: 'Vite hva som finnes av hjelpemidler og tilpasninger, og hvem som søker om hva',
      girIkkeRett: [
        'Å vurdere om kunden har rett på et hjelpemiddel',
        'Å bestille eller montere noe',
        'Å gjøre en befaring som erstatter kommunens egen'
      ],
      verifiseres: 'referanse' },

    { id: 'digital',
      pilot: true,
      navn: 'Digital offentlig hjelp',
      bakgrunn: ['IT-veileder', 'Rådgiver digitale offentlige tjenester', 'Seniornett-erfaring'],
      gjorLettere: 'Komme gjennom Altinn, Helsenorge eller et digitalt skjema uten å måtte spørre familien',
      /* Samme grense som i den praktiske katalogen, og den er absolutt: koder
         og BankID røres ikke, heller ikke når kunden ber om det selv. */
      girIkkeRett: [
        'Å be om, motta eller bruke BankID, passord eller koder',
        'Å fjernstyre kundens maskin eller telefon',
        'Å gjennomføre en betaling eller opprette en konto'
      ],
      verifiseres: 'referanse' },

    { id: 'parorende',
      pilot: false,
      senere: 'Overlapper med kommune i pilotfasen',
      navn: 'Pårørende og fullmakt',
      bakgrunn: ['Pårørendekoordinator', 'Sosionom', 'Pasient- og brukerombud'],
      gjorLettere: 'Forstå hvilke rettigheter pårørende har, og hva en fullmakt faktisk dekker',
      girIkkeRett: [
        'Å skrive en fullmakt eller et vergemål for kunden',
        'Å avgjøre hvem som skal bestemme',
        'Å mekle i en familiekonflikt'
      ],
      verifiseres: 'referanse' },

    { id: 'skatt',
      pilot: false,
      senere: 'Sesongtopp i mars og april. Krever egen bemanningsplan',
      navn: 'Skatt og økonomisk oversikt',
      bakgrunn: ['Tidligere ansatt i Skatteetaten', 'Regnskapsfører', 'Økonomirådgiver'],
      gjorLettere: 'Lese skattemeldingen, forstå fradrag og vite hvilken frist som gjelder',
      girIkkeRett: [
        'Å levere skattemeldingen for kunden',
        'Å få innsyn i kundens konto eller skatteopplysninger',
        'Å gi råd om plassering av penger'
      ],
      verifiseres: 'referanse' },

    { id: 'juridisk',
      pilot: false,
      senere: 'Ansvarsforsikring og bevillingskontroll koster mer enn kategorien gir i pilot',
      navn: 'Juridisk veiledning',
      bakgrunn: ['Advokat med bevilling', 'Jurist'],
      gjorLettere: 'Vite hva slags sak dette er, hvilke frister som gjelder og om man trenger advokat',
      girIkkeRett: [
        'Å opptre som kundens advokat i en sak',
        'Å skrive et prosesskriv eller en avtale som binder kunden',
        'Å kalle seg advokat uten bevilling'
      ],
      verifiseres: 'tilsynsradet' },

    { id: 'aktivitet',
      pilot: false,
      senere: 'Løses billigere av Hverdagsguiden enn av en betalt samtale',
      navn: 'Aktivitet og mestring',
      bakgrunn: ['Kulturrådgiver', 'Frivillighetskoordinator', 'Ansatt ved seniorsenter'],
      gjorLettere: 'Finne noe å gjøre i nærheten – lag, kor, senter, turgruppe – og komme i gang',
      girIkkeRett: [
        'Å drive terapi eller behandling',
        'Å vurdere funksjonsnivå',
        'Å melde kunden på noe uten at hun har sagt ja'
      ],
      verifiseres: 'referanse' }
  ];

  /* ---------- kategorien som ikke bygges ----------

     Legekonsultasjon sto i bestillingen, med HPR-verifisering og NPE nevnt.
     Den er utelatt likevel, og grunnen er ikke at den er vanskelig:

     I det en lege vurderer denne kundens symptomer, er Naviar ikke lenger
     programvare for en tjenesteleverandør. Vi yter helsehjelp. Da skifter alt
     samtidig – vi går fra databehandler til behandlingsansvarlig for
     helseopplysninger, journalplikten inntrer, virksomheten må ha
     medisinskfaglig ansvarlig, og pasientskadeansvaret følger med.

     Det er ikke en funksjon. Det er et annet selskap, med et annet tilsyn.

     Lista under er ikke et forbehold. Den er hva som må være på plass før noen
     kan si ja – og den ligger i koden fordi et notat kan bli borte, mens en
     tom kategori med en begrunnelse blir stående. */
  var LEGEKONSULTASJON = {
    id: 'legekonsultasjon',
    navn: 'Legekonsultasjon',
    bygges: false,
    hvorfor: 'Vurdering av en persons symptomer er helsehjelp. Naviar er programvare ' +
             'for en tjenesteleverandør, ikke en helsevirksomhet',
    forutsetninger: [
      'Virksomheten er registrert som helsevirksomhet med medisinskfaglig ansvarlig',
      'Journalsystem med dokumentasjonsplikt etter pasientjournalloven',
      'Behandlingsgrunnlag for helseopplysninger – ny DPIA, ikke et tillegg til dagens',
      'Melding og tilskudd til Norsk pasientskadeerstatning der plikten gjelder',
      'Aktiv autorisasjon bekreftet i Helsepersonellregisteret, ikke «tidligere lege»',
      'Avklart forhold til fastlegeordningen og til legevakt'
    ],
    istedenfor: 'Helseveiledning: hvem gjør hva i helsetjenesten, og hvordan du får time. ' +
                'Ingen vurdering av symptomer.'
  };

  /* Varselet som står på skjermen gjennom hele en helsenær samtale. Det er
     ikke en bunntekst – det er den ene setningen som må leses av noen som har
     ringt feil sted. */
  var AKUTTVARSEL = {
    tittel: 'Ikke for akutt hjelp',
    tekst: 'Ring 116 117 når hjelpen ikke kan vente. Ring 113 ved fare for liv.',
    numre: ['116 117', '113']
  };

  /* ---------- hvor mange hatter én person får ha ----------

     To. Ikke fordi tre ville vært uhåndterlig, men fordi den som velger fem
     kategorier ikke er ekspert på noen av dem – hun er tilgjengelig. Kunden
     kan ikke se forskjell, og da må grensen stå i systemet. */
  var MAKS_KATEGORIER = 2;

  /* ---------- verifisering ----------

     «Verifisert erfaring» må bety én bestemt ting, ellers betyr det det
     leseren håper. Her er de tre tingene det kan bety, og ingen av dem er
     «hun har krysset av». */
  var VERIFISERING = {
    referanse: {
      navn: 'Bekreftet av tidligere arbeidssted',
      slik: 'Vi ringer arbeidsstedet hun har oppgitt og får bekreftet at hun arbeidet der, i den perioden hun oppgir',
      lagres: ['bekreftet ja/nei', 'dato', 'hvem hos oss som ringte'],
      lagresIkke: ['attest', 'CV', 'referatet fra samtalen', 'navn på referansen etter 90 dager'],
      betyr: 'Vi har bekreftet at hun har arbeidet der hun sier',
      betyrIkke: 'At hun er godkjent av det offentlige, eller at Naviar går god for rådene' },
    hpr: {
      navn: 'Autorisasjon i Helsepersonellregisteret',
      slik: 'Oppslag i Helsepersonellregisteret hos Helsedirektoratet. Autorisasjonen må være aktiv, ikke tidligere',
      lagres: ['HPR-nummer', 'yrkesgruppe', 'aktiv ja/nei', 'dato for oppslaget'],
      lagresIkke: ['utskrift fra registeret', 'eventuelle tilsynssaker'],
      betyr: 'Autorisasjonen var aktiv den dagen vi slo opp',
      betyrIkke: 'At hun kan yte helsehjelp gjennom Naviar. Det kan hun ikke',
      kontroll: 'ved opptak og hver sjette måned' },
    tilsynsradet: {
      navn: 'Bevilling i advokatregisteret',
      slik: 'Oppslag hos Tilsynsrådet for advokatvirksomhet',
      lagres: ['bevilling aktiv ja/nei', 'dato for oppslaget'],
      lagresIkke: ['utskrift', 'disiplinærsaker'],
      betyr: 'Bevillingen var aktiv den dagen vi slo opp',
      betyrIkke: 'At Naviar er ansvarlig for rådgivningen',
      kontroll: 'ved opptak og hver sjette måned' }
  };

  /* Tittelen på profilen, og den er en juridisk sak forkledd som tekst.

     «NAV-rådgiver» i presens sier at hun taler på NAVs vegne. Det gjør hun
     ikke, hun har sluttet der, og NAV har ikke gitt oss lov til å bruke
     navnet sitt som kvalitetsstempel. Formen under sier begge deler i én
     linje: hvor erfaringen kommer fra, og hvem hun opptrer for nå. */
  var PROFILTITTEL = {
    mal: 'Tidligere {rolle} – uavhengig Naviar-veileder',
    eksempel: 'Tidligere NAV-rådgiver – uavhengig Naviar-veileder',
    aldri: ['NAV-ansatt', 'Vår NAV-ekspert', 'Godkjent av NAV', 'Kommunens rådgiver'],
    hvorfor: 'Hun taler for seg selv, ikke for etaten hun sluttet i'
  };

  /* Ingen opplastede dokumenter, heller ikke her.

     Det er fristende å be om vitnemål og attester når man skal verifisere en
     ekspert. Men en attest beviser mindre enn en telefon til arbeidsstedet,
     og den koster mer: den skal lagres, sikres, slettes og svares for.
     Registrene er offentlige der de finnes, og der de ikke finnes, ringer vi. */
  var DOKUMENTER = {
    tas_imot: false,
    istedenfor: 'Oppslag i offentlig register, eller en telefon til arbeidsstedet',
    hvorfor: 'En attest sier at noen har skrevet en attest. Et registeroppslag ' +
             'og en telefon sier hva som er sant i dag'
  };

  /* Setningen på ekspertkortet. Den står her og ikke i en tekstfil, fordi det
     er den påstanden som er lettest å tøye når noen skal fylle en side. */
  var MERKELAPP = {
    tekst: 'Verifisert erfaring',
    forklaring: 'Vi har bekreftet bakgrunnen. Rådene er hennes, ikke Naviars.'
  };

  /* ---------- konsultasjonen ---------- */

  var KANAL = [
    { id: 'telefon', navn: 'Telefon', kort: 'Ring opp til avtalt tid' },
    { id: 'video',   navn: 'Video',   kort: 'Lenke i SMS og e-post' },
    { id: 'oppmote', navn: 'Oppmøte', kort: 'Hjemme hos deg eller et avtalt sted' }
  ];

  /* Én lengde i piloten, og det er et valg, ikke en mangel.

     45 minutter fordi tre parter kan være med i samtalen – den eldre,
     familien og noen ganger en tolk – og fordi de siste ti minuttene er der
     de tre stegene faktisk formuleres. En samtale på 30 rekker akkurat å
     kartlegge, og slutter der kunden trodde den skulle begynne.

     De andre lengdene finnes som beslutninger, ikke som produkter: tre
     pakker deler den samme lille etterspørselen i tre, og da lærer piloten
     ingenting om noen av dem. */
  var LENGDE = [
    { minutter: 45, pilot: true,  kort: 'Én sak, hele veien til tre neste steg' },
    { minutter: 60, pilot: false, kort: 'Flere ting, eller en detaljert plan',
      senere: 'Åpnes når vi vet at noen kjøper den første' },
    { minutter: 60, pilot: false, kanal: 'oppmote', kort: 'Hjemmebesøk',
      senere: 'Krever reisetid, forsikring og en annen pris. Etter piloten' }
  ];

  function pilotLengder() {
    return LENGDE.filter(function (l) { return l.pilot; });
  }

  /* Eksperten åpner sin egen kalender, og kunden bestiller rett inn i den.
     Uten dette må hver time godkjennes to ganger, og da er ikke tiden ledig –
     den er en forespørsel. Det er forskjellen på en kalender og et skjema. */
  var PANEL = [
    { id: 'kategorier',   navn: 'Fagområde',                krav: 'Minst ett, høyst ' + MAKS_KATEGORIER },
    { id: 'kanaler',      navn: 'Telefon, video eller oppmøte', krav: 'Minst én' },
    { id: 'lengder',      navn: 'Lengde på samtalen',       krav: '45 minutter i piloten' },
    { id: 'tider',        navn: 'Dager og klokkeslett',     krav: 'Det du åpner, kan bestilles direkte' },
    { id: 'buffer',       navn: 'Pause mellom samtaler',    krav: 'Minutter, holdes av automatisk' },
    { id: 'ukesmaks',     navn: 'Maks avtaler per uke',     krav: 'Kalenderen stenger når tallet er nådd' },
    { id: 'apen',         navn: 'Tar imot nye avtaler nå',  krav: 'Av og på. Av skjuler deg fra søket, ikke fra avtaler du har' }
  ];

  var BUFFER_MIN = 10;

  /* ---------- bestillingen ---------- */

  /* Fire skjermer, og den siste er den vi selger. De tre første er
     bestillingen; den fjerde er grunnen til at noen bestilte. */
  var STEG = [
    { id: 'behov',   navn: 'Fortell hva du trenger', kort: 'Et kort valg, ikke et skjema' },
    { id: 'ekspert', navn: 'Vi finner riktig ekspert', kort: 'Erfaring og språk som passer' },
    { id: 'tid',     navn: 'Velg en ledig tid',      kort: 'Pris og klokkeslett står på forhånd' },
    { id: 'steg',    navn: 'Få tre tydelige neste steg', kort: 'Skriftlig, etter samtalen' }
  ];

  /* Familien kan ordne. Den eldre bestemmer – også her, og det er strengere
     her enn i den praktiske katalogen: den eldre skal ikke bare godkjenne at
     noen kommer, men hvem hun skal snakke med og hvordan. En videosamtale er
     ikke det samme som en telefon for en som ikke bruker video. */
  var SAMTYKKE = {
    familienKanBestille: true,
    eldreMaaGodkjenne: ['hvilken ekspert', 'hvilken kanal'],
    hvorfor: 'Samtalen er hennes. Hun skal vite hvem som ringer, og på hvilken måte',
    utenGodkjenning: 'Avtalen står som «venter på Kari» og gjennomføres ikke'
  };

  /* ---------- etter samtalen ----------

     Oppsummeringen er tjenestens eneste varige spor, og derfor det stedet det
     er lettest å komme til å skrive en journal uten å mene det. Reglene under
     er hva som gjør den til en huskelapp i stedet. */
  var OPPSUMMERING = {
    maksOrd: 120,
    skrivesAv: 'eksperten',
    inneholder: ['hva samtalen handlet om, på temanivå', 'hva som er avtalt videre', 'hvem kunden skal kontakte'],
    inneholderIkke: [
      'helseopplysninger',
      'symptomer eller vurderinger',
      'saksnummer, fødselsnummer eller kontonummer',
      'sitater fra samtalen'
    ],
    gaarGjennom: 'PP_VERN.sjekk',
    slettesEtter: 90,
    hvorfor: 'En huskelapp til kunden er nyttig i noen uker. Et arkiv over hva folk ' +
             'har spurt om, er noe annet'
  };

  /* ---------- det som ikke er avklart ----------

     Står her, ikke i et notat, fordi begge deler flytter penger og ansvar. */
  var UAVKLART = {
    tilknytning: {
      sporsmaal: 'Er eksperten oppdragstaker eller ansatt?',
      var_vurdering: 'Til forskjell fra den praktiske hjelpen setter eksperten selv pris, ' +
                     'tider og framgangsmåte, og bruker egen faglig metode. Det peker mot ' +
                     'selvstendig oppdragstaker – men vurderingen er ikke vår å konkludere',
      avklart: false },
    andel: {
      sporsmaal: 'Hvor stor andel tar Naviar av konsultasjonsprisen?',
      betyr: 'Avgjør om dette er en markedsplass eller en tjeneste vi står inne for',
      avklart: false },
    mva: {
      sporsmaal: 'Er en konsultasjon avgiftspliktig, og med hvilken sats?',
      betyr: 'Flytter 25 % av prisen. Juridisk rådgivning og helserelaterte tjenester ' +
             'behandles ulikt',
      avklart: false }
  };

  /* ---------- oppslag og regler ---------- */

  function kategori(id) {
    return KATEGORI.filter(function (k) { return k.id === id; })[0] || null;
  }

  /* Tre kategorier i piloten, ikke ni.

     Ni kategorier deler den samme etterspørselen i ni, og da får hver av dem
     for få kunder til å holde på en ekspert – og for få eksperter til å gi
     kunden en ledig tid denne uka. Markedsplassen dør i den delingen, ikke i
     mangel på gode kategorier.

     De tre er valgt fordi problemet er skarpest der: kunden vet at hun
     trenger noe fra det offentlige, og vet ikke hvilken dør. */
  function pilotKategorier() {
    return KATEGORI.filter(function (k) { return k.pilot; });
  }

  function tjeneste(id) {
    return TJENESTE.filter(function (t) { return t.id === id; })[0] || null;
  }

  /* Kan denne eksperten stå oppført i disse kategoriene? */
  function sjekkKategorier(valgte) {
    var v = valgte || [];
    if (!v.length) {
      return { ok: false, grunn: 'Velg minst ett fagområde' };
    }
    if (v.length > MAKS_KATEGORIER) {
      return { ok: false, grunn: 'Høyst ' + MAKS_KATEGORIER + ' fagområder. ' +
               'Den som er oppført i alt, er ikke ekspert på noe' };
    }
    var ukjent = v.filter(function (id) { return !kategori(id); });
    if (ukjent.length) {
      var lege = ukjent.indexOf(LEGEKONSULTASJON.id) !== -1;
      return { ok: false,
               grunn: lege ? LEGEKONSULTASJON.hvorfor : 'Ukjent fagområde: ' + ukjent.join(', '),
               ukjent: ukjent };
    }
    return { ok: true, grunn: null };
  }

  /* Porten. Spørres før en ekspert settes i en kategori, og igjen når hun ber
     om å gjøre noe i en samtale. Svaret er alltid begrunnet – en ekspert som
     får nei uten grunn, finner en vei rundt. */
  function harRettTil(katId, handling) {
    var k = kategori(katId);
    if (!k) {
      return { rett: false, grunn: 'Ukjent fagområde: ' + katId };
    }
    var brudd = k.girIkkeRett.filter(function (g) {
      return g.toLowerCase().indexOf(String(handling || '').toLowerCase()) !== -1;
    });
    if (brudd.length) {
      return { rett: false, grunn: brudd[0], kategori: k.navn };
    }
    return { rett: true, grunn: null, kategori: k.navn };
  }

  /* Verifiseringen en kategori krever, og hva merkelappen da betyr. */
  function verifisering(katId) {
    var k = kategori(katId);
    if (!k) return null;
    var v = VERIFISERING[k.verifiseres];
    return v ? { metode: k.verifiseres, navn: v.navn, slik: v.slik,
                 betyr: v.betyr, betyrIkke: v.betyrIkke } : null;
  }

  /* Ledige tider ut av en eksperts kalender. Bufferen holdes av på begge
     sider av en avtale: en samtale som går over tiden, skal ikke gjøre den
     neste kunden til en som venter. */
  function ledigeTider(ekspert, opptatt, lengdeMin) {
    var e = ekspert || {};
    if (e.apen === false) return [];
    var buffer = typeof e.buffer === 'number' ? e.buffer : BUFFER_MIN;
    var uke = (opptatt || []).length;
    if (e.ukesmaks && uke >= e.ukesmaks) return [];

    return (e.tider || []).filter(function (t) {
      var start = new Date(t).getTime();
      if (isNaN(start)) return false;
      var slutt = start + lengdeMin * 60000;
      return (opptatt || []).every(function (o) {
        var oStart = new Date(o.start).getTime();
        var oSlutt = oStart + (o.minutter || 30) * 60000;
        return slutt + buffer * 60000 <= oStart || start >= oSlutt + buffer * 60000;
      });
    });
  }

  /* Bestillingen. Kaster ikke – returnerer et svar med grunn, fordi grunnen
     skal vises til den som bestiller. */
  function bestill(onske) {
    var o = onske || {};
    var k = kategori(o.kategori);
    if (!k) {
      return { ok: false, grunn: 'Ukjent fagområde', regel: 'ukjent_fagomrade' };
    }
    if (!KANAL.filter(function (x) { return x.id === o.kanal; }).length) {
      return { ok: false, grunn: 'Velg telefon, video eller oppmøte', regel: 'kanal' };
    }
    if (!k.pilot) {
      return { ok: false, regel: 'ikke_apen',
               grunn: k.navn + ' er ikke åpen ennå. ' + (k.senere || '') };
    }
    if (!pilotLengder().filter(function (x) { return x.minutter === o.minutter; }).length) {
      return { ok: false, grunn: 'Samtalen er på 45 minutter', regel: 'lengde' };
    }
    if (typeof o.pris !== 'number' || o.pris <= 0) {
      return { ok: false, grunn: 'Prisen må stå før bestillingen, ikke etter', regel: 'pris' };
    }
    if (o.eldreGodkjent !== true) {
      return { ok: false, grunn: SAMTYKKE.utenGodkjenning, regel: 'venter_godkjenning',
               mangler: SAMTYKKE.eldreMaaGodkjenne };
    }
    return { ok: true, regel: 'bestilt',
             akuttvarsel: k.akuttvarsel ? AKUTTVARSEL : null,
             grenser: k.girIkkeRett };
  }

  /* Oppsummeringen etter samtalen. Samme sperre som besøksrapportene, og en
     lengdegrense i tillegg: den som skriver langt, skriver journal. */
  function sjekkOppsummering(tekst) {
    var t = String(tekst || '').trim();
    var ord = t ? t.split(/\s+/).length : 0;
    var funn = [];

    if (ord > OPPSUMMERING.maksOrd) {
      funn.push({ id: 'for_lang',
                  hva: 'Oppsummeringen er ' + ord + ' ord. Grensen er ' + OPPSUMMERING.maksOrd,
                  istedenfor: 'Skriv hva som er avtalt videre, ikke hva som ble sagt' });
    }
    if (window.PP_VERN) {
      var v = window.PP_VERN.sjekk(t);
      v.funn.forEach(function (f) {
        funn.push({ id: f.id, hva: f.hva || 'Innhold som ikke skal lagres',
                    istedenfor: f.istedenfor || 'Skriv hva kunden skal gjøre videre' });
      });
    }
    return { ok: funn.length === 0, ord: ord, funn: funn };
  }

  return {
    NAVN: NAVN,
    TJENESTE: TJENESTE,
    KATEGORI: KATEGORI,
    LEGEKONSULTASJON: LEGEKONSULTASJON,
    AKUTTVARSEL: AKUTTVARSEL,
    MAKS_KATEGORIER: MAKS_KATEGORIER,
    VERIFISERING: VERIFISERING,
    MERKELAPP: MERKELAPP,
    PROFILTITTEL: PROFILTITTEL,
    DOKUMENTER: DOKUMENTER,
    KANAL: KANAL,
    LENGDE: LENGDE,
    PANEL: PANEL,
    BUFFER_MIN: BUFFER_MIN,
    STEG: STEG,
    SAMTYKKE: SAMTYKKE,
    OPPSUMMERING: OPPSUMMERING,
    UAVKLART: UAVKLART,
    kategori: kategori,
    pilotKategorier: pilotKategorier,
    pilotLengder: pilotLengder,
    tjeneste: tjeneste,
    sjekkKategorier: sjekkKategorier,
    harRettTil: harRettTil,
    verifisering: verifisering,
    ledigeTider: ledigeTider,
    bestill: bestill,
    sjekkOppsummering: sjekkOppsummering
  };
})();
