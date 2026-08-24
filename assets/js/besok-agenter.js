/* Naviar Care – KI-agenter, med grensene innebygd.

   Agentene utfører, de foreslår ikke bare. Men hva de får utføre alene er
   bestemt på forhånd, ikke av modellen selv.

     auto         agenten gjør det og logger det
     godkjenning  agenten forbereder, et menneske trykker
     menneske     agenten varsler og stopper. Mennesket avgjør
     aldri        finnes ikke som funksjon. Ikke bak en bryter, ikke bak et flagg

   «aldri» er ikke en streng innstilling – det er fravær av kode. Det er
   forskjellen på en policy og en grense.

   Tre ting følger av lov og ikke av design:

   1. Brukeren skal alltid vite at det er en maskin som skriver. KI-forordningen
      krever åpenhet i samtaler med KI-systemer, og agenten skal aldri framstå
      som et menneske.
   2. Menneskelig kontroll betyr fire konkrete ting: å forstå systemets grenser,
      å kunne overstyre resultatet, å følge med på driften, og å oppdage feil.
      Helsedirektoratet beskriver kontrollen slik, og det er den definisjonen
      vi bygger etter.
   3. Hver avgjørelse skal kunne gjenfinnes etterpå. Uten logg er «menneskelig
      kontroll» en påstand.

   Se docs/JURIDISK-GRENSE.md og docs/team/KI.md. */

window.PP_AGENTER = (function () {
  'use strict';

  var AUTONOMI = {
    auto:        { navn: 'Automatisk',            forklaring: 'Agenten utfører og logger' },
    godkjenning: { navn: 'Krever godkjenning',    forklaring: 'Agenten forbereder, koordinator godkjenner' },
    menneske:    { navn: 'Menneskelig avgjørelse', forklaring: 'Agenten varsler og stopper' },
    aldri:       { navn: 'Utenfor systemet',      forklaring: 'Finnes ikke som funksjon' }
  };

  /* Merkingen på alt KI skriver. Står i hver melding, ikke i vilkårene. */
  var AVSENDER = {
    merke: 'Skrevet automatisk av Naviar Care',
    regel: 'Agenten sier aldri «jeg» som om den var en person, og gir seg ' +
           'aldri ut for å være koordinatoren eller medarbeideren.'
  };

  /* De åtte som utgjør første versjon. Nummer 8 er et menneske – det er ikke
     en formalitet. Uten en navngitt ansvarlig er de sju andre uten kontroll. */
  var AGENTER = [
    { nr: 1,  id: 'koordinering', navn: 'Koordineringsagent',   kjerne: true,
      ansvar: 'Tar imot forespørselen, kategoriserer, setter risikonivå, fordeler til de andre, følger saken til den er lukket, sender til menneske ved forsinkelse eller feil.',
      autonomi: 'auto',
      merk: 'Ingen annen agent kjører utenom denne. Det er det som gjør flyten mulig å revidere.' },

    { nr: 2,  id: 'forstaelse',   navn: 'Forespørselsagent',    kjerne: true,
      ansvar: 'Gjør fritekst eller tale om til strukturerte felt: kategori, dato, varighet, nødvendig språknivå, risiko.',
      autonomi: 'auto',
      merk: 'Ved tvil oppretter den ikke besøket. Den stiller ett spørsmål.' },

    { nr: 3,  id: 'risiko',       navn: 'Risikoagent',          kjerne: true,
      ansvar: 'Klassifiserer hver forespørsel grønn, gul, rød eller nød, og kan stoppe eller fryse en oppgave.',
      autonomi: 'auto',
      merk: 'Grønn kan starte automatisk. Gul, rød og nød kan den bare sende videre – aldri klarere.' },

    { nr: 4,  id: 'matching',     navn: 'Bemanningsagent',      kjerne: true,
      ansvar: 'Rangerer leverandørens egne medarbeidere etter tilgjengelighet, avstand, bekreftet språknivå, oppgavekompetanse, kontinuitet og arbeidstidsgrenser.',
      autonomi: 'auto',
      merk: 'Rangerer bare innenfor én leverandørs ansatte. Rangeringen kontrolleres jevnlig for utslag på kjønn, alder og opprinnelse.' },

    { nr: 5,  id: 'plan',         navn: 'Planleggingsagent',    kjerne: true,
      ansvar: 'Legger besøket i kalenderen, unngår kollisjoner, sender tilbud, går videre til neste ved avslag, planlegger om ved forsinkelse.',
      autonomi: 'auto',
      merk: null },

    { nr: 6,  id: 'tilsyn',       navn: 'Besøkstilsynsagent',   kjerne: true,
      ansvar: 'Følger med på om besøket ble akseptert, startet i tide, varte urimelig lenge, og om rapporten kom.',
      autonomi: 'auto',
      merk: 'Følger tidspunkter medarbeideren selv registrerer. Ingen løpende posisjon.' },

    { nr: 7,  id: 'familie',      navn: 'Familiemeldingsagent', kjerne: true,
      ansvar: 'Skriver og sender meldingen om at besøket er utført, på mottakerens språk, til dem som har rett til den.',
      autonomi: 'godkjenning',
      merk: 'Skriver aldri noe om helse, og aldri at noen «er trygg». Den beskriver hva som ble gjort.' },

    { nr: 8,  id: 'operator',     navn: 'Driftsansvarlig (menneske)', kjerne: true,
      ansvar: 'Navngitt person hos leverandøren. Godkjenner det som krever godkjenning, avgjør det agentene ikke får avgjøre, og kan overstyre alt.',
      autonomi: 'menneske',
      merk: 'Er ikke en rolle i et diagram. Har navn, telefonnummer og vaktplan.' },

    /* Seks som kommer etterpå. De står her fordi rekkefølgen er en beslutning
       vi har tatt, ikke noe vi har glemt. */
    { nr: 9,  id: 'kvalitet',     navn: 'Kvalitetsagent',       kjerne: false,
      ansvar: 'Beregner punktlighet, avlysninger, klager, gjentatte problemer og rapportkvalitet.',
      autonomi: 'auto',
      merk: 'Én dårlig tilbakemelding får aldri følger for en medarbeider automatisk.' },

    { nr: 10, id: 'avvik',        navn: 'Avviksagent',          kjerne: false,
      ansvar: 'Oppdager besøk fullført på to steder samtidig, urealistiske varigheter, gjentatte avlysninger og forespørsler om betaling utenom plattformen.',
      autonomi: 'godkjenning',
      merk: 'Kan begrense en konto midlertidig. Permanent stenging er alltid et menneske.' },

    { nr: 11, id: 'personvern',   navn: 'Personvernagent',      kjerne: false,
      ansvar: 'Stopper helseopplysninger, fødselsnummer, kortnummer og BankID før de lagres, og ber om en ny formulering.',
      autonomi: 'auto',
      merk: 'Blokkerer i stedet for å lagre. Det blokkerte innholdet lagres ikke som bevis på blokkeringen.' },

    { nr: 12, id: 'faktura',      navn: 'Faktureringsagent',    kjerne: false,
      ansvar: 'Regner ut, lager fakturautkast og klassifiserer refusjonskrav.',
      autonomi: 'godkjenning',
      merk: 'Prisendring, tvist og store refusjoner går alltid til et menneske.' },

    { nr: 13, id: 'support',      navn: 'Supportagent',         kjerne: false,
      ansvar: 'Svarer på vanlige spørsmål, forklarer status, starter endring eller avbestilling, sender klager videre.',
      autonomi: 'auto',
      merk: 'Sier i første setning at den er en maskin.' },

    { nr: 14, id: 'kanal',        navn: 'Kanalagent',           kjerne: false,
      ansvar: 'Velger SMS, e-post eller varsel, og sender påminnelser til riktig tid.',
      autonomi: 'auto',
      merk: null }
  ];

  /* Hva agentene gjør alene. Listen er uttømmende: står det ikke her, er det
     ikke automatisk. */
  var AUTOMATISK = [
    { id: 'kategoriser',   hva: 'Kategorisere en forespørsel',                  agent: 'forstaelse' },
    { id: 'ranger',        hva: 'Rangere leverandørens tilgjengelige ansatte',  agent: 'matching' },
    { id: 'ledig',         hva: 'Kontrollere ledig tid og kollisjoner',         agent: 'plan' },
    { id: 'paaminn',       hva: 'Sende påminnelse',                             agent: 'kanal' },
    { id: 'neste',         hva: 'Tilby besøket til neste medarbeider ved avslag', agent: 'plan' },
    { id: 'lukk_gronn',    hva: 'Lukke et fullført grønt besøk',                agent: 'tilsyn' },
    { id: 'familiemelding',hva: 'Forberede familiemeldingen',                   agent: 'familie' },
    { id: 'fakturautkast', hva: 'Lage fakturautkast',                           agent: 'faktura' },
    { id: 'statistikk',    hva: 'Lage driftsstatistikk',                        agent: 'kvalitet' },
    { id: 'oppdag_avvik',  hva: 'Oppdage sensitiv opplysning eller avvik',      agent: 'personvern' }
  ];

  /* Hva et menneske må ta stilling til. Felles for alle: de har følger for en
     person, og de kan ikke gjøres om. */
  var KREVER_MENNESKE = [
    { id: 'uklar_oppgave', hva: 'Oppgaven er uklart avgrenset' },
    { id: 'personlig',     hva: 'Personlig stell er etterspurt' },
    { id: 'helse',         hva: 'Forespørselen gjelder helsehjelp' },
    { id: 'klage',         hva: 'Klage på en medarbeider' },
    { id: 'fall',          hva: 'Melding om fall eller skade' },
    { id: 'overgrep',      hva: 'Mistanke om overgrep eller omsorgssvikt' },
    { id: 'steng_konto',   hva: 'Permanent stenging av en konto' },
    { id: 'tap',           hva: 'Tap av penger eller eiendeler' },
    { id: 'stor_refusjon', hva: 'Refusjon over beløpsgrensen' },
    { id: 'endring',       hva: 'Uvanlig endring i atferd er meldt' },
    { id: 'nod',           hva: 'Vurdering av en nødsituasjon' },
    { id: 'samtykke',      hva: 'Spørsmål om personens samtykkekompetanse' }
  ];

  /* Hva som ikke finnes. Ikke avslått – fraværende. */
  var ALDRI = [
    'Stille en diagnose',
    'Vurdere hvor akutt noe er medisinsk',
    'Foreslå eller endre medisin',
    'Gi en person en helserisikoscore',
    'Avgjøre at en medarbeider har gjort noe galt',
    'Vurdere om noen er samtykkekompetent',
    'Velge helsepersonell',
    'Avgjøre hvem som har rett på helsehjelp',
    'Ta en avgjørelse med store følger uten at et menneske ser den'
  ];

  /* Nødtilfellet er ikke en fjerde risikoklasse. Det er en avbrytelse. */
  var NOD = {
    stopp: 'All automatikk stanser',
    vis: 'Ring 113. Naviar Care er ikke en nødtjeneste.',
    varsle: 'Leverandørens koordinator varsles umiddelbart',
    forbud: 'Agenten skriver ingen medisinsk vurdering, heller ikke en betryggende'
  };

  function agent(id) {
    return AGENTER.filter(function (a) { return a.id === id; })[0] || null;
  }

  function kjerne() {
    return AGENTER.filter(function (a) { return a.kjerne; });
  }

  /* Hvem avgjør dette? Svaret følger risikonivået fra oppgavekatalogen, ikke
     agentens egen vurdering av seg selv. */
  /* To vokabularer møtes her: oppgavekatalogen og matchingmotoren sier
     lav/middels/rod, agentbeskrivelsene sier grønn/gul/rød. Uten oversettelse
     ville «lav» falt til standardverdien menneske – trygt, men galt: en grønn
     oppgave mister automatikken sin i stillhet. Oversettelsen står her, én
     gang, i stedet for i hver kallende modul. */
  function normaliserRisiko(risiko) {
    if (risiko === 'lav') return 'gronn';
    if (risiko === 'middels') return 'gul';
    return risiko;
  }

  function avgjor(handlingId, risiko) {
    risiko = normaliserRisiko(risiko);
    if (risiko === 'nod') {
      return { autonomi: 'menneske', grunn: 'Nødsituasjon. Automatikken stanser.', nod: true };
    }

    var forbudt = ALDRI.filter(function (t) { return t === handlingId; })[0];
    if (forbudt) {
      return { autonomi: 'aldri', grunn: 'Utenfor systemet.' };
    }

    var menneske = KREVER_MENNESKE.filter(function (h) { return h.id === handlingId; })[0];
    if (menneske) {
      return { autonomi: 'menneske', grunn: menneske.hva + '. Avgjøres av driftsansvarlig.' };
    }

    var auto = AUTOMATISK.filter(function (h) { return h.id === handlingId; })[0];
    if (auto && risiko === 'gronn') {
      return { autonomi: 'auto', grunn: 'Grønn oppgave innenfor det agenten kan gjøre alene.', agent: auto.agent };
    }
    if (auto && risiko === 'gul') {
      return { autonomi: 'godkjenning', grunn: 'Gul oppgave. Agenten forbereder, koordinator godkjenner.', agent: auto.agent };
    }
    if (auto && risiko === 'rod') {
      return { autonomi: 'menneske', grunn: 'Rød oppgave. Krever autorisert personell hos leverandøren.' };
    }

    /* Alt som ikke står på noen liste, er ikke automatisk. Det er den eneste
       forsvarlige standardverdien. */
    return { autonomi: 'menneske', grunn: 'Ikke definert som automatisk. Går til driftsansvarlig.' };
  }

  /* Beslutningsloggen. Sju felter, alle obligatoriske. En logg med hull er en
     logg som ikke tåler et tilsyn. */
  var LOGGFELT = ['agent', 'grunnlag', 'sikkerhet', 'regel', 'godkjenning', 'endretAv', 'melding'];

  function loggpost(p) {
    var mangler = LOGGFELT.filter(function (f) { return p[f] === undefined; });
    if (mangler.length) {
      throw new Error('Beslutningslogg mangler felt: ' + mangler.join(', '));
    }
    return {
      tid: p.tid || new Date().toISOString(),
      agent: p.agent,             /* hvilken agent avgjorde */
      grunnlag: p.grunnlag,       /* hvilke felter den brukte – felter, ikke innhold */
      sikkerhet: p.sikkerhet,     /* hvor sikker den var, 0–1, eller null */
      regel: p.regel,             /* hvilken regel som slo inn */
      godkjenning: p.godkjenning, /* krevdes menneskelig godkjenning */
      endretAv: p.endretAv,       /* hvem som eventuelt overstyrte, ellers null */
      melding: p.melding          /* hva brukeren faktisk fikk se */
    };
  }

  /* De fire kravene til menneskelig kontroll, som noe som kan sjekkes av. */
  var KONTROLL = [
    { krav: 'Forstå grensene',   oppfylt: 'ALDRI-lista og risikonivåene står i grensesnittet, ikke bare i vilkårene' },
    { krav: 'Kunne overstyre',   oppfylt: 'Driftsansvarlig kan endre eller omgjøre enhver automatisk avgjørelse' },
    { krav: 'Følge med',         oppfylt: 'Beslutningsloggen er søkbar per besøk og per agent' },
    { krav: 'Oppdage feil',      oppfylt: 'Avvik i rangering og i avgjørelser gjennomgås fast' }
  ];

  return {
    AUTONOMI: AUTONOMI,
    AVSENDER: AVSENDER,
    AGENTER: AGENTER,
    AUTOMATISK: AUTOMATISK,
    KREVER_MENNESKE: KREVER_MENNESKE,
    ALDRI: ALDRI,
    NOD: NOD,
    LOGGFELT: LOGGFELT,
    KONTROLL: KONTROLL,
    agent: agent,
    kjerne: kjerne,
    avgjor: avgjor,
    loggpost: loggpost
  };
})();
