/* Naviar Care – språkkrav for medarbeidere.

   Regelen er enkel: B1 er minimum for å arbeide alene hos en eldre person,
   B2 kreves der en misforståelse har konsekvenser – følge til avtale,
   koordinering, og alt som grenser mot helsehjelp.

   Hvem som gjør hva:

     Naviar publiserer standarden og sperrer tildeling når nivået ikke er
     bekreftet for oppgaven. Naviar ansetter ikke, velger ikke, og vurderer
     ikke medarbeidere.

     Leverandøren er arbeidsgiver. Leverandøren vurderer sin egen medarbeider,
     bekrefter nivået, og står ansvarlig for at bekreftelsen er riktig. Malen
     under er et verktøy leverandøren kan bruke – ikke en prøve Naviar avholder.

   Kravet henger på OPPGAVEN, ikke på personen. Det er ikke et høflighetshensyn:
   et språkkrav som ikke kan begrunnes i oppgaven er indirekte diskriminering
   etter likestillings- og diskrimineringsloven § 8 og tilsvarende EU-regler.
   Derfor står nivået oppført sammen med hvorfor det er nødvendig, og derfor er
   vurderingen den samme for alle – også for dem som har språket som morsmål.

   Se docs/team/JURIDISK-RISIKO.md J22 og docs/JURIDISK-GRENSE.md. */

window.PP_SPRAKKRAV = (function () {
  'use strict';

  /* Europarådets nivåer. Vi bruker fire av seks; A1 og C2 trenger vi ikke å
     skille på for noe vi gjør. */
  var NIVA = {
    A1: { rang: 1, navn: 'A1', kort: 'Enkeltord og faste uttrykk' },
    A2: { rang: 2, navn: 'A2', kort: 'Enkel samtale når den andre snakker sakte og tydelig' },
    B1: { rang: 3, navn: 'B1', kort: 'Forstår klare instrukser, kan forklare et problem og skrive en enkel rapport' },
    B2: { rang: 4, navn: 'B2', kort: 'Forstår sammensatt informasjon og kan gjengi den riktig' },
    C1: { rang: 5, navn: 'C1', kort: 'Flytende, også om ukjente emner' },
    C2: { rang: 6, navn: 'C2', kort: 'Tilnærmet som morsmål' }
  };

  var MINIMUM = 'B1';

  /* Hvorfor ikke A2: en A2-bruker klarer en forberedt samtale. Hun klarer ikke
     nødvendigvis dialekt, tunghørthet, en uventet hendelse, en sammensatt
     beskjed, en riktig rapport til familien, eller å forklare hva som skjer i
     en nødsituasjon. Alle fem forekommer i vanlige besøk. */
  var HVORFOR_IKKE_A2 = [
    'Den eldre snakker dialekt',
    'Den eldre hører dårlig',
    'Noe uventet skjer',
    'Beskjeden er sammensatt',
    'Rapporten til familien må være riktig',
    'En nødsituasjon må forklares på telefon'
  ];

  /* Krav per oppgave i katalogen. Nøklene er de samme id-ene som PP_BESOK.OPPGAVER. */
  var OPPGAVEKRAV = {
    samvaer:  { niva: 'B1', hvorfor: 'Må kunne føre en samtale uten hjelp' },
    digital:  { niva: 'B1', hvorfor: 'Må forklare framgangsmåten forståelig' },
    hjemme:   { niva: 'B1', hvorfor: 'Må forstå instrukser om hva som ikke skal røres' },
    hent:     { niva: 'B1', hvorfor: 'Må forstå hva som skal hentes, og kunne si nei i butikken' }
  };

  /* Kravene til oppgavene som er utsatt til neste fase. De står her fordi de
     var vurdert, ikke glemt: kommer oppgaven tilbake, kommer nivået med den.
     Følge til avtale er den eneste som krever B2 – en beskjed fra legen som
     gjengis feil, får følger. */
  var SENERE_KRAV = {
    tur:      { niva: 'B1', hvorfor: 'Må oppfatte behov og problemer underveis' },
    mat:      { niva: 'B1', hvorfor: 'Må forstå allergier og hva personen ikke tåler' },
    handling: { niva: 'B1', hvorfor: 'Må forstå handlelisten og beskjeder riktig' },
    folge:    { niva: 'B2', hvorfor: 'Må forstå og gjengi det som blir sagt hos legen riktig' }
  };

  /* Roller og oppgaver utenfor katalogen. Står her fordi grensen skal være
     synlig: nivået alene gir aldri adgang til det som krever autorisasjon. */
  var UTENFOR_KRAV = [
    { hva: 'Utskrivning fra sykehus',  niva: 'B2', tillegg: null,
      hvorfor: 'Instrukser som misforstås, får følger' },
    { hva: 'Personlig stell',          niva: 'B2', tillegg: 'opplæring',
      hvorfor: 'Krever kommunikasjon om verdighet og sikkerhet' },
    { hva: 'Helsehjelp',               niva: 'B2', tillegg: 'autorisasjon',
      hvorfor: 'Språknivå er ikke nok. Arbeidsgiver har ansvar for at helsepersonell forstår og gjør seg forstått.' },
    { hva: 'Koordinator / teamleder',  niva: 'B2', tillegg: null,
      hvorfor: 'Snakker med familie, medarbeidere og offentlige instanser' }
  ];

  /* Arbeidsspråk per land.

     Skandinavia henger sammen: norsk, svensk og dansk regnes som likeverdige,
     slik norske myndigheter allerede gjør for helsepersonell. Island og Finland
     gjør det ikke – der er det eget språk.

     Resten av Europa har ingen slik gjensidighet. Tysk gjelder i Tyskland og
     Østerrike fordi det er samme språk, ikke fordi språkene ligner. */
  var LAND = {
    NO: { navn: 'Norge',        sprak: ['nb'], godtar: ['nb', 'sv', 'da'], region: 'skandinavia' },
    SE: { navn: 'Sverige',      sprak: ['sv'], godtar: ['sv', 'nb', 'da'], region: 'skandinavia' },
    DK: { navn: 'Danmark',      sprak: ['da'], godtar: ['da', 'nb', 'sv'], region: 'skandinavia' },
    IS: { navn: 'Island',       sprak: ['is'], godtar: ['is'],             region: 'norden' },
    FI: { navn: 'Finland',      sprak: ['fi'], godtar: ['fi', 'sv'],       region: 'norden' },
    DE: { navn: 'Tyskland',     sprak: ['de'], godtar: ['de'],             region: 'europa' },
    AT: { navn: 'Østerrike',    sprak: ['de'], godtar: ['de'],             region: 'europa' },
    NL: { navn: 'Nederland',    sprak: ['nl'], godtar: ['nl'],             region: 'europa' },
    BE: { navn: 'Belgia',       sprak: ['nl', 'fr'], godtar: ['nl', 'fr'], region: 'europa' },
    FR: { navn: 'Frankrike',    sprak: ['fr'], godtar: ['fr'],             region: 'europa' },
    ES: { navn: 'Spania',       sprak: ['es'], godtar: ['es'],             region: 'europa' },
    IT: { navn: 'Italia',       sprak: ['it'], godtar: ['it'],             region: 'europa' },
    PT: { navn: 'Portugal',     sprak: ['pt'], godtar: ['pt'],             region: 'europa' },
    PL: { navn: 'Polen',        sprak: ['pl'], godtar: ['pl'],             region: 'europa' },
    IE: { navn: 'Irland',       sprak: ['en'], godtar: ['en'],             region: 'europa' }
  };

  /* Slik dokumenterer leverandøren nivået. Alle tre er likeverdige – et
     prøvebevis og en gjennomført samtale teller likt. Naviar lagrer hvilken
     av dem som er brukt, ikke innholdet i den. */
  var DOKUMENTASJON = [
    { id: 'prove',     navn: 'Bestått språkprøve',      forklaring: 'Offisielt prøvebevis på B1 eller B2' },
    { id: 'utdanning', navn: 'Utdanning på språket',    forklaring: 'Fullført videregående eller høyere utdanning i landet' },
    { id: 'samtale',   navn: 'Strukturert samtale',     forklaring: 'Leverandøren gjennomfører den, med malen under' }
  ];

  /* Malen til samtalen. Fem oppgaver som speiler det arbeidet faktisk krever,
     ikke grammatikk. Samme oppgaver for alle. Leverandøren gjennomfører og
     bekrefter; Naviar er ikke til stede og vurderer ingen. */
  var VURDERING = [
    { nr: 1, oppgave: 'Kort presentasjon som til en ny kunde',        maaler: 'Kan innlede en samtale' },
    { nr: 2, oppgave: 'Gjenfortell en muntlig arbeidsinstruks',       maaler: 'Forstår og gjengir riktig' },
    { nr: 3, oppgave: 'Forklar en uventet situasjon på telefon',      maaler: 'Klarer seg uten forberedelse' },
    { nr: 4, oppgave: 'Skriv en kort besøksrapport',                  maaler: 'Skriftlig forståelighet' },
    { nr: 5, oppgave: 'Fortell hvem du ringer i en nødsituasjon',     maaler: 'Kjenner rutinen og kan si den' }
  ];

  function rang(niva) { return NIVA[niva] ? NIVA[niva].rang : 0; }

  function nokMinst(harNiva, kreverNiva) {
    return rang(harNiva) >= rang(kreverNiva);
  }

  /* Hvilket nivå trengs for en oppgave i et gitt land. */
  /* Slår opp i begge listene. En oppgave som er utsatt til neste fase, har
     ikke mistet kravet sitt – den venter bare på at risikoen skal måles.
     Kommer den tilbake i katalogen, kommer nivået med den. */
  function kravFor(oppgaveId) {
    return OPPGAVEKRAV[oppgaveId] || SENERE_KRAV[oppgaveId]
      || { niva: MINIMUM, hvorfor: 'Standardkrav for arbeid alene' };
  }

  /* Høyeste krav i et besøk med flere oppgaver. Et besøk er ikke tryggere enn
     sin vanskeligste oppgave. */
  function kravForBesok(oppgaveIder) {
    var hoyest = { niva: MINIMUM, hvorfor: 'Standardkrav for arbeid alene', oppgave: null };
    (oppgaveIder || []).forEach(function (id) {
      var k = kravFor(id);
      if (rang(k.niva) > rang(hoyest.niva)) {
        hoyest = { niva: k.niva, hvorfor: k.hvorfor, oppgave: id };
      }
    });
    return hoyest;
  }

  /* Finner medarbeiderens nivå i et språk landet godtar, og velger det beste.
     Bare nivåer leverandøren har bekreftet teller.
     medarbeider.sprak = [{ kode: 'nb', niva: 'B2', bekreftetAv: 'leverandor',
                            dokumentasjon: 'prove', morsmal: false }] */
  function arbeidssprak(medarbeider, landkode) {
    var land = LAND[landkode];
    if (!land) return null;
    var beste = null;
    (medarbeider.sprak || []).forEach(function (s) {
      if (land.godtar.indexOf(s.kode) === -1) return;
      if (s.bekreftetAv !== 'leverandor') return;
      var niva = s.morsmal ? 'C2' : s.niva;
      if (!beste || rang(niva) > rang(beste.niva)) {
        beste = { kode: s.kode, niva: niva, morsmal: !!s.morsmal, nabosprak: land.sprak.indexOf(s.kode) === -1 };
      }
    });
    return beste;
  }

  /* Hovedporten. Svarer alltid med en begrunnelse som kan vises til den det
     gjelder – en avvisning uten grunn er ikke en avgjørelse, den er en vegg. */
  function kanUtfore(medarbeider, oppgaveIder, landkode) {
    var land = LAND[landkode];
    if (!land) {
      return { ok: false, grunn: 'Landet er ikke satt opp ennå', kode: 'ukjent_land' };
    }

    var krav = kravForBesok(oppgaveIder);
    var har = arbeidssprak(medarbeider, landkode);

    if (!har) {
      return {
        ok: false, kode: 'mangler_bekreftelse', krever: krav.niva,
        grunn: 'Leverandøren har ikke bekreftet ' + spraknavn(land.sprak[0]) + ' på ' +
               krav.niva + ' for denne medarbeideren. Bekreftes med prøvebevis, ' +
               'utdanning eller en strukturert samtale.'
      };
    }

    if (!nokMinst(har.niva, krav.niva)) {
      return {
        ok: false, kode: 'for_lavt', krever: krav.niva, har: har.niva,
        grunn: 'Denne oppgaven krever ' + krav.niva + ': ' + krav.hvorfor +
               '. Leverandøren har bekreftet ' + har.niva + '.'
      };
    }

    return {
      ok: true, krever: krav.niva, har: har.niva, kode: har.kode,
      nabosprak: har.nabosprak,
      grunn: har.morsmal ? 'Morsmål' : 'Bekreftet ' + har.niva
    };
  }

  var SPRAKNAVN = {
    nb: 'norsk', sv: 'svensk', da: 'dansk', is: 'islandsk', fi: 'finsk',
    de: 'tysk', nl: 'nederlandsk', fr: 'fransk', es: 'spansk', it: 'italiensk',
    pt: 'portugisisk', pl: 'polsk', en: 'engelsk'
  };

  function spraknavn(kode) { return SPRAKNAVN[kode] || kode; }

  /* Slik vises språk til den eldre og familien. De bestiller ikke medarbeidere
     her – leverandøren setter opp besøket – men de skal kunne be leverandøren
     om noen som snakker språket deres, og se hva som faktisk er bekreftet. */
  function profillinjer(medarbeider) {
    return (medarbeider.sprak || []).map(function (s) {
      if (s.morsmal) return spraknavn(s.kode) + ': morsmål';
      var bekreftet = s.bekreftetAv === 'leverandor';
      return spraknavn(s.kode) + ': ' + s.niva +
             (bekreftet ? ' – bekreftet av arbeidsgiver' : ' – oppgitt selv');
    });
  }

  /* Land der tjenesten er satt opp, gruppert slik utrullingen skjer. */
  function landIRegion(region) {
    return Object.keys(LAND).filter(function (k) { return LAND[k].region === region; })
      .map(function (k) { return { kode: k, navn: LAND[k].navn }; });
  }

  return {
    NIVA: NIVA,
    MINIMUM: MINIMUM,
    HVORFOR_IKKE_A2: HVORFOR_IKKE_A2,
    OPPGAVEKRAV: OPPGAVEKRAV,
    SENERE_KRAV: SENERE_KRAV,
    UTENFOR_KRAV: UTENFOR_KRAV,
    LAND: LAND,
    DOKUMENTASJON: DOKUMENTASJON,
    VURDERING: VURDERING,
    kravFor: kravFor,
    kravForBesok: kravForBesok,
    arbeidssprak: arbeidssprak,
    kanUtfore: kanUtfore,
    nokMinst: nokMinst,
    spraknavn: spraknavn,
    profillinjer: profillinjer,
    landIRegion: landIRegion
  };
})();
