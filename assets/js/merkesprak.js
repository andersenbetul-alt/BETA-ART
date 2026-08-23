/* Naviar Care – språket vi selger tjenesten med.

   Merkeplattformen er ikke et dokument som ligger ved siden av produktet. Den
   er en liste over påstander vi kan stå for, og en liste over påstander vi
   ikke kan. Ligger de bare i et dokument, blir de brutt av den som har det
   travelt en tirsdag. Derfor ligger de her, med en sjekk.

   Én sondring bærer hele modulen:

     «Trygg hjelp» sier noe om tjenesten. Den er avgrenset, utført av en
     verifisert person, og dokumentert. Det kan vi stå for.

     «Kari er trygg» sier noe om et menneskes tilstand. Det kan vi ikke stå
     for, fordi vi ikke er der resten av døgnet.

   Den første er en merkevare. Den andre er et løfte om beredskap. Sperren går
   mellom dem, ikke rundt ordet. */

window.PP_MERKESPRAK = (function () {
  'use strict';

  /* Spenningen tjenesten faktisk må løse: familien vil ha mer kontroll, den
     eldre vil ikke miste sin. De to trekker i hver sin retning, og de fleste
     i denne bransjen løser det ved å love familien kontroll og la være å
     nevne den andre halvdelen.

     Setningen under løser den i stedet for å skjule den. Den er også en test
     man kan holde en hvilken som helst skjerm opp mot: hvem ordner, og hvem
     bestemmer? Svarer skjermen «familien» på begge, er den feil. */
  var POSISJON = {
    stor: 'Familien kan ordne. Den eldre bestemmer.',
    full: 'Naviar gjør det enkelt for familier å organisere trygg, ' +
          'ikke-medisinsk hverdagshjelp – uten å ta kontrollen fra den som ' +
          'mottar hjelpen.',
    kategori: 'Trygg hverdagshjelp, organisert på ett sted.',
    /* Historien har tre helter, og ingen av dem er oss. */
    helter: ['den eldre som beholder selvstendigheten',
             'familien som tar ansvar på avstand',
             'medarbeideren som bruker tiden på noe som betyr noe']
  };

  var KJERNE = {
    nb: 'Trygg hjelp når du ikke kan være der – på den eldres premisser.',
    kort: 'Naviar gjør avstanden mindre.',
    folelse: 'Nær, selv på avstand.',
    /* Halen er ikke pynt. Uten den blir setningen et løfte om at noen passer
       på; med den sier den hvem som bestemmer.

       Den trenger ikke stå i samme setning – i meldingssystemet er den skilt
       ut som en egen tillitssetning rett under overskriften. Kravet er at den
       står på samme flate. Faller den bort helt, er det ikke lenger den samme
       påstanden. */
    haleMaaStaaPaaFlaten: true,
    hale: 'på den eldres premisser',
    tillitssetning: 'På den eldres premisser – med familien informert hele veien.',
    kampanje: 'Små oppgaver. Stor trygghet.'
  };

  var SELGER = {
    familie:   'Du kan følge opp, selv når du bor langt unna.',
    eldre:     'Du bestemmer. Hjelpen skjer på dine premisser.',
    medarbeider: 'Bruk tiden din til å gjøre hverdagen enklere for noen i nærheten.',
    partner:   'Trygg, avgrenset og dokumentert hverdagshjelp.'
  };

  /* Påstander vi ikke kan stå for. Hver av dem har en grunn, og grunnen er
     ikke smak – det er hva som skjer den dagen noen tar oss på ordet. */
  var ALDRI = [
    { id: 'tilstand',
      monster: /\b(er|blir|holder(?:es)?)\s+(trygg|i sikkerhet|trygge)\b/i,
      hva: 'Å si at en person er trygg',
      hvorfor: 'Vi er der én time. Påstanden gjelder døgnet, og den kan ikke innfris',
      istedenfor: 'Si hva som ble gjort, og når' },

    { id: 'overvaking',
      /* Ikke \b til slutt: den bygger på [A-Za-z0-9_], og «på» ender på en
         bokstav som ikke teller som ordtegn. Da slipper hele alternativet
         gjennom. Negativt oppslag i stedet, med de norske bokstavene med. */
      monster: /\b(følger med på|overvåk(?:er|ing|e)|passer på|holder øye med|spor(?:er|ing))(?![a-zæøå])/i,
      hva: 'Å si at vi følger med på noen',
      hvorfor: 'Det er overvåking av et hjem, og det finnes ikke i tjenesten',
      istedenfor: 'Posisjon brukes bare mens oppdraget pågår' },

    { id: 'erstatter',
      monster: /\b(erstatter|tar over for|i stedet for)\s+(familien|deg|pårørende)\b/i,
      hva: 'Å si at vi erstatter familien',
      hvorfor: 'Vi gjør avstanden mindre. Vi fyller den ikke',
      istedenfor: 'Naviar gjør avstanden mindre' },

    { id: 'hjelpelos',
      /* Norsk bøyer: hjelpeløs, hjelpeløse, hjelpeløst. Et \b etter «s»
         treffer bare grunnformen, og «hjelpeløse eldre» slapp gjennom. */
      monster: /\b(hjelpeløs(?:e|t)?|pleietrengende|svake eldre|de gamle)(?![a-zæøå])/i,
      hva: 'Å omtale eldre som hjelpeløse',
      hvorfor: 'Kundene våre klarer seg selv. Det er hele forutsetningen',
      istedenfor: 'Eldre som bor hjemme' },

    { id: 'all_omsorg',
      monster: /\b(all\s+(slags\s+)?(omsorg|pleie)|enhver\s+form\s+for\s+(omsorg|pleie)|alt\s+de\s+trenger)\b/i,
      hva: 'Å love all slags omsorg',
      hvorfor: 'Katalogen har fire oppgaver. Alt annet er utenfor, med vilje',
      istedenfor: 'Praktisk og sosial hverdagshjelp' },

    { id: 'billigst',
      monster: /\b(billigst|raskest|nærmeste ledige|på minutter)\b/i,
      hva: 'Å love billigst eller raskest',
      hvorfor: 'Løftet er kjennskap, ikke fart. De to konkurrerer om samme bemanning',
      istedenfor: 'Samme kjente person, så langt det lar seg gjøre' },

    { id: 'beredskap',
      monster: /\b(døgnet rundt|24\/7|alltid tilgjengelig|akutthjelp|nødhjelp)\b/i,
      hva: 'Å antyde beredskap',
      hvorfor: 'Vi er ikke en nødtjeneste. Ved fare for liv og helse: 113',
      istedenfor: 'Avtalte besøk innenfor åpningstiden' }
  ];

  var HELLER = ['selvstendighet', 'valgfrihet', 'hverdagshjelp',
                'på den eldres premisser', 'ID-verifisert', 'tydelig oppdrag',
                'familien informert', 'lokal hjelp', 'trygg oppfølging'];

  /* Hvert løfte i budskapet må ha noe som viser det. Et løfte uten bevis er
     en tekst; med bevis er det en funksjon noen kan etterprøve. */
  var BEVIS = [
    { lofte: 'Den eldre beholder kontrollen', bevis: 'Godkjenner eller avviser hvert oppdrag' },
    { lofte: 'Familien følger prosessen', bevis: 'Status og beskjed når oppdraget er fullført' },
    { lofte: 'Riktig medarbeider velges', bevis: 'ID-verifisering og faste oppgavekategorier' },
    { lofte: 'Bare det nødvendige deles', bevis: 'Kun opplysningene oppdraget krever' },
    { lofte: 'Noen svarer når det butter', bevis: 'Operasjon og støtte på telefon' },
    { lofte: 'Grensen er tydelig', bevis: 'Medisinske og akutte oppdrag finnes ikke i katalogen' }
  ];

  /* Steder der ordet «trygg» ikke kan brukes i det hele tatt, uansett hvordan
     setningen er bygget. En melding om ett besøk handler om en person; da er
     det ingen avstand igjen mellom tjenesten og mennesket. */
  var UTEN_TRYGG = ['familiemelding', 'besoksrapport', 'kvittering', 'statuslinje'];

  function normaliser(t) { return String(t || ''); }

  /* Sjekker en tekst før den går ut. kontekst sier hvor teksten skal stå;
     reglene er strengere i en melding om ett besøk enn på en forside. */
  function sjekk(tekst, kontekst) {
    var t = normaliser(tekst);
    if (!t.trim()) return { ok: true, funn: [] };

    var funn = ALDRI.filter(function (r) { return r.monster.test(t); })
      .map(function (r) {
        return { id: r.id, hva: r.hva, hvorfor: r.hvorfor, istedenfor: r.istedenfor };
      });

    if (UTEN_TRYGG.indexOf(kontekst) !== -1 && /\btrygg/i.test(t)) {
      funn.push({
        id: 'trygg_i_melding',
        hva: 'Ordet «trygg» i en melding om ett besøk',
        hvorfor: 'Her finnes ingen avstand mellom tjenesten og mennesket. Det leses som at personen er trygg',
        istedenfor: 'Skriv hva som ble gjort'
      });
    }

    return { ok: funn.length === 0, funn: funn };
  }

  /* Tar imot hele flaten, ikke bare overskriften: står «trygg hjelp» der, må
     «på den eldres premisser» stå et sted på den samme flaten. */
  function kjerneErHel(flate) {
    var t = normaliser(flate).toLowerCase();
    if (t.indexOf('trygg hjelp') === -1) return true;      // ikke kjernesetningen
    return t.indexOf(KJERNE.hale) !== -1;
  }

  function selger(malgruppe) {
    return SELGER[malgruppe] || null;
  }

  return {
    POSISJON: POSISJON,
    KJERNE: KJERNE,
    SELGER: SELGER,
    BEVIS: BEVIS,
    ALDRI: ALDRI,
    HELLER: HELLER,
    UTEN_TRYGG: UTEN_TRYGG,
    sjekk: sjekk,
    kjerneErHel: kjerneErHel,
    selger: selger
  };
})();
