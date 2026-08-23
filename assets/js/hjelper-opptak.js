/* Naviar Care – opptak, opplæring og sikkerhet for medarbeidere.

   Fire lag, i denne rekkefølgen:

     1. Slipp inn riktig person
     2. Send bare oppdrag personen er godkjent for
     3. Følg oppdraget mens det pågår
     4. Stopp hendelser, undersøk, og rett systemet

   Modulen er regler, ikke skjermer. Grunnen står i rekkefølgen selv: en
   prosess som ikke er skrevet ned, kan ikke automatiseres – den kan bare
   gjentas ulikt hver gang.

   Fritekst kontrolleres av PP_VERN.sjekk. Ordlista ligger ett sted. */

window.PP_HJELPER = (function () {
  'use strict';

  /* ---------------------------------------------------------------
     0. Porten som står før alt annet
     --------------------------------------------------------------- */

  /* Er medarbeideren ansatt hos oss, eller er hun et selvstendig foretak?
     Spørsmålet er ikke administrativt. Setter vi prisen, definerer oppdraget,
     lærer opp, måler kvaliteten og kan stenge profilen, holder det ikke at
     avtalen kaller henne oppdragstaker: det reelle forholdet avgjør, og ved
     tvil er det oppdragsgiver som må sannsynliggjøre det motsatte.

     Derfor er dette en port og ikke et felt. Ingen kan aktiveres før modellen
     er valgt og bekreftet av jurist. Å åpne for søknader først og avklare
     etterpå er å bygge et arbeidsgiveransvar man ikke vet at man har. */
  var ARBEIDSFORHOLD = {
    avklart: false,
    valgt: null,
    modeller: [
      { id: 'ansatt', navn: 'Deltidsansatt hos Naviar Care',
        naar: 'Vi setter pris, definerer oppdrag, lærer opp og styrer kvalitet',
        folger: 'Arbeidsgiveravgift, forsikring, sykepenger, ferie, oppsigelsesvern' },
      { id: 'partner', navn: 'Godkjent lokalt foretak med egne ansatte',
        naar: 'Foretaket er arbeidsgiver, vi kjøper en tjeneste',
        folger: 'Krav til foretaket: ansatte, forsikring, HMS, egen faglig ledelse' }
    ],
    /* Skrevet inn fordi den er lett å velge og dyr å ha valgt. */
    avvist: { id: 'styrt_frilans',
      navn: 'Frilanser vi styrer',
      hvorfor: 'Kontroll over pris, oppdrag og utførelse peker mot ansettelse ' +
               'uansett hva avtalen kalles. Modellen argumenterer mot seg selv.' }
  };

  /* ---------------------------------------------------------------
     1. Opptak
     --------------------------------------------------------------- */

  var TRINN = [
    { nr: 1, id: 'soknad',      navn: 'Søknad',
      gjor: 'Kontakt, bydel, språk, erfaring og når hun kan jobbe',
      krav: 'Oppfyller grunnkravene' },
    { nr: 2, id: 'identitet',   navn: 'Identitet',
      gjor: 'Elektronisk ID og bekreftet telefonnummer',
      krav: 'Opplysningene stemmer overens' },
    { nr: 3, id: 'status',      navn: 'Arbeidsforhold',
      gjor: 'Ansatt, eget foretak eller partner – og rett til å arbeide i Norge',
      krav: 'Statusen er juridisk bekreftet' },
    { nr: 4, id: 'referanse',   navn: 'Referanser',
      gjor: 'Samtale med to referanser',
      krav: 'Ingen alvorlige innvendinger' },
    { nr: 5, id: 'intervju',    navn: 'Situasjonsintervju',
      gjor: '20–30 minutter med virkelige situasjoner, ikke pugg',
      krav: 'Ingen farlig håndtering av en kritisk situasjon' },
    { nr: 6, id: 'opplaering',  navn: 'Opplæring',
      gjor: 'Fem obligatoriske moduler',
      krav: 'Bestått prøve' },
    { nr: 7, id: 'proveoppdrag', navn: 'Prøveoppdrag',
      gjor: 'Ett kontrollert oppdrag, i kontortiden',
      krav: 'Gjennomført uten avvik' },
    { nr: 8, id: 'proveperiode', navn: 'Prøveperiode',
      gjor: 'De tre første oppdragene følges tett',
      krav: 'Kvalitet og oppmøte holder' },
    { nr: 9, id: 'aktivering',  navn: 'Aktivering',
      gjor: 'Profilen åpnes',
      krav: 'Operasjon godkjenner' }
  ];

  var KRAV = [
    'Fylt 18 år',
    'Bekreftet identitet',
    'Rett til å arbeide i Norge',
    'Kan bruke en smarttelefon',
    'Kommer seg til bydelen oppdragene ligger i',
    'Kan snakke tydelig og respektfullt med en eldre person',
    'Norsk på minst B1 muntlig',
    'To referanser som lar seg kontrollere',
    'Signert taushets- og adferdsavtale',
    'Fullført obligatorisk opplæring'
  ];

  /* Skrevet ned fordi det er lett å la seg friste av en «magefølelse» som i
     praksis er noe annet. Disse skal aldri telle i en vurdering. */
  var IKKE_KRITERIUM = ['alder', 'opprinnelse', 'kjønn', 'religion',
                        'legning', 'familiesituasjon', 'navn'];

  /* Politiattest kan ikke kreves fordi vi ønsker det. Det må finnes hjemmel i
     lov eller forskrift for akkurat denne typen arbeid. Til en jurist har
     vurdert det skriftlig, skal ingen si at medarbeiderne er kontrollert av
     politiet – det er et løfte vi ikke kan holde, og det er verre å love enn
     å la være. */
  var POLITIATTEST = {
    kanKreves: false,
    hvorfor: 'Krever hjemmel i lov eller forskrift for denne typen arbeid',
    forBruk: 'Skriftlig vurdering fra jurist',
    ikkeSi: 'Alle medarbeiderne våre er kontrollert av politiet'
  };

  /* Identitet bekreftes, den arkiveres ikke. En kopi av et pass i vår database
     er et innbrudd verdt; «bekreftet 12.03, av leverandør X» er det ikke. */
  var IDENTITET = {
    lagres: ['bekreftet', 'dato', 'metode', 'hvem som bekreftet'],
    lagresAldri: ['kopi av legitimasjon', 'bilde av pass', 'fødselsnummer',
                  'kopi av oppholdstillatelse']
  };

  /* ---------------------------------------------------------------
     2. Situasjonsintervjuet
     --------------------------------------------------------------- */

  /* Kritisk betyr at ett farlig svar stopper opptaket, uansett hvor god hun
     er ellers. En sum kan skjule det ene svaret som betyr noe. */
  var SCENARIER = [
    { id: 'bankid', kritisk: true,
      situasjon: 'Den eldre ber om hjelp med BankID',
      riktig: 'Si nei, forklar hvorfor, og meld fra til kontoret' },
    { id: 'medisin', kritisk: true,
      situasjon: 'Hun ber deg gi henne medisinen sin',
      riktig: 'Forklar grensen, ikke gjør det, meld fra' },
    { id: 'fall', kritisk: true,
      situasjon: 'Hun sier hun har falt',
      riktig: 'Følg nødprosedyren. Ikke vurder skaden selv' },
    { id: 'kontanter', kritisk: true,
      situasjon: 'Hun vil gi deg et større kontantbeløp',
      riktig: 'Ta ikke imot. Meld fra samme dag' },
    { id: 'tungt', kritisk: false,
      situasjon: 'Hun ber deg bære noe tungt som ikke står i oppdraget',
      riktig: 'Si nei på en måte som ikke gjør henne flau' },
    { id: 'uonsket', kritisk: true,
      situasjon: 'Den eldre vil ikke ha besøk',
      riktig: 'Ikke gå inn. Gå igjen, og gi beskjed til kontoret' },
    { id: 'utrygg', kritisk: false,
      situasjon: 'Du føler deg utrygg i situasjonen',
      riktig: 'Avbryt oppdraget og be om hjelp' },
    { id: 'uten_samtykke', kritisk: true,
      situasjon: 'Familien bestiller et besøk den eldre ikke vet om',
      riktig: 'Si at den eldre må samtykke først' }
  ];

  /* ---------------------------------------------------------------
     3. Opplæring
     --------------------------------------------------------------- */

  var MODULER = [
    { nr: 1, navn: 'Hva Naviar Care er, og ikke er', punkter: [
      'Ikke helsehjelp, ikke nødtjeneste',
      'Medarbeideren opptrer ikke som helsepersonell',
      'Bare det som står i oppdraget blir gjort',
      'Ekstraoppdrag avtales ikke utenom plattformen' ] },
    { nr: 2, navn: 'Å snakke med en eldre person', punkter: [
      'Rolig, tydelig og med respekt',
      'Hennes avgjørelser er hennes',
      'Ikke barnespråk',
      'Ta hensyn til hørsel og bevegelse',
      'Hun har rett til å si nei til besøket' ] },
    { nr: 3, navn: 'Grensene for oppdraget', punkter: [
      'Aldri medisin eller dosering',
      'Aldri personlig stell',
      'Aldri BankID, PIN eller passord',
      'Aldri låne ut eller ta imot penger',
      'Aldri vitne på testament eller avtale',
      'Aldri tunge løft eller fagarbeid',
      'Aldri betaling utenom plattformen',
      'Aldri bilde eller video uten samtykke' ] },
    { nr: 4, navn: 'Taushet og svindel', punkter: [
      'Del aldri opplysninger om den eldre',
      'Lagre aldri dokumenter eller bilder på egen telefon',
      'Be aldri om BankID, PIN eller passord',
      'Bruk meldingene i løsningen, ikke privat nummer',
      'Meld mistenkelige pengeforespørsler til kontoret' ] },
    { nr: 5, navn: 'Å arbeide alene', punkter: [
      'Gå ikke inn i en bolig som virker utrygg',
      'Se etter andre personer eller dyr i boligen',
      'Grenser for kveld og natt',
      'Del posisjon bare mens oppdraget pågår',
      'Ved trussel eller vold: gå',
      'Prosedyre for nødhjelp og hendelsesmelding' ] }
  ];

  var PROVE = { terskel: 85, gjentak: 'Kan tas om igjen etter fornyet gjennomgang' };

  /* ---------------------------------------------------------------
     4. Risiko på oppdraget
     --------------------------------------------------------------- */

  var RISIKONIVA = {
    gronn: { navn: 'Grønn', handling: 'automatisk',
      forklaring: 'Samvær, digital hjelp, lett hjemmehjelp, hent og lever' },
    gul:   { navn: 'Gul', handling: 'operator',
      forklaring: 'Første besøk, langt oppdrag, sen kveld, bevegelsesvansker' },
    rod:   { navn: 'Rød', handling: 'avvises',
      forklaring: 'Medisin, stell, BankID, kontanter, tunge løft' },
    nod:   { navn: 'Nød', handling: 'stopp',
      forklaring: 'Fall, pustebesvær, trussel, savnet person' }
  };

  var GUL_UTLOSER = ['forste_besok', 'over_120_min', 'etter_2000',
                     'bevegelsesvansker', 'ny_medarbeider'];

  /* ---------------------------------------------------------------
     5. Hendelser
     --------------------------------------------------------------- */

  var HENDELSE = [
    { niva: 'P0', hva: 'Fare for liv, vold, savnet person',
      gjor: 'Nødetat, stopp oppdraget, varsle familien' },
    { niva: 'P1', hva: 'Mistanke om tyveri, økonomisk utnytting, grovt brudd på grensene',
      gjor: 'Suspender midlertidig, hold tilbake betaling, undersøk' },
    { niva: 'P2', hva: 'Respektløs oppførsel, oppdraget delvis utført',
      gjor: 'Undersøk samme dag, forklar, refunder om nødvendig' },
    { niva: 'P3', hva: 'Forsinkelse, avlysning, kommunikasjonssvikt',
      gjor: 'Operasjon løser, føres på oppmøtestatistikken' }
  ];

  /* Én alvorlig sak kan gi midlertidig suspensjon. Permanent stenging krever
     at et menneske har sett saken: en poengsum kan ikke ta fra noen jobben. */
  var STENGING = {
    midlertidig: 'Kan utløses av én alvorlig melding',
    permanent: 'Krever menneskelig gjennomgang, aldri automatisk poengsum'
  };

  var MALES = ['oppmøte til avtalt tid', 'fullførte oppdrag', 'avlysninger',
               'tilbakemelding fra familien', 'hendelser', 'kvalitet på rapporten',
               'etterlevelse av grensene'];

  /* Lav stjerne alene er ikke et grunnlag. Folk gir én stjerne for vær, for
     kø og for at moren deres hadde en dårlig dag. Gjentakelse og bekreftede
     hendelser er grunnlaget. */
  var IKKE_GRUNNLAG = ['enkeltstående lav vurdering uten hendelse'];

  /* ---------------------------------------------------------------
     Funksjoner
     --------------------------------------------------------------- */

  /* Alle ni trinnene, i rekkefølge, pluss porten. Mangler ett, er svaret nei
     og lista sier hvilket. */
  function kanAktiveres(hjelper) {
    var h = hjelper || {};
    var mangler = [];

    if (!ARBEIDSFORHOLD.avklart) {
      mangler.push('arbeidsforholdet er ikke avklart for tjenesten');
    }
    if (!h.arbeidsforhold || h.arbeidsforhold === 'styrt_frilans') {
      mangler.push('arbeidsforhold ikke bekreftet');
    }
    TRINN.forEach(function (t) {
      if (t.id === 'aktivering') return;
      if (!h[t.id]) mangler.push(t.navn.toLowerCase() + ' mangler');
    });
    if (typeof h.prove !== 'number' || h.prove < PROVE.terskel) {
      mangler.push('prøven er ikke bestått (' + PROVE.terskel + ' %)');
    }
    if (!h.taushetsavtale) mangler.push('taushets- og adferdsavtale mangler');

    return { ok: mangler.length === 0, mangler: mangler };
  }

  /* Ett farlig svar på en kritisk situasjon stopper opptaket. Poengsummen
     regnes likevel, fordi den er nyttig i samtalen etterpå – men den kan
     ikke overstyre. */
  function vurderIntervju(svar) {
    var s = svar || {};
    var riktige = 0, kritiskeFeil = [];

    SCENARIER.forEach(function (sc) {
      if (s[sc.id] === true) { riktige++; return; }
      if (sc.kritisk) kritiskeFeil.push(sc.id);
    });

    var poeng = Math.round(riktige / SCENARIER.length * 100);
    return {
      ok: kritiskeFeil.length === 0 && poeng >= 75,
      poeng: poeng,
      kritiskeFeil: kritiskeFeil,
      grunn: kritiskeFeil.length
        ? 'Farlig håndtering av en kritisk situasjon: ' + kritiskeFeil.join(', ')
        : (poeng >= 75 ? 'Bestått' : 'For lav score')
    };
  }

  /* Risikonivået på et oppdrag. Fritekst går gjennom PP_VERN, så ordlista
     ligger ett sted og ikke to. */
  function risikoFor(oppgaveId, fritekst, forhold) {
    var f = forhold || {};

    var vern = window.PP_VERN ? window.PP_VERN.sjekk(fritekst) : { ok: true, funn: [] };
    if (!vern.ok) {
      var haster = vern.funn.some(function (x) { return x.id === 'haster'; });
      if (haster) {
        return { niva: 'nod', handling: 'stopp',
                 grunn: 'Teksten beskriver noe som skal meldes, ikke skrives' };
      }
      return { niva: 'rod', handling: 'avvises',
               grunn: 'Oppdraget beskriver noe utenfor grensen',
               kategorier: vern.funn.map(function (x) { return x.id; }) };
    }

    var katalog = window.PP_BESOK ? window.PP_BESOK.OPPGAVER : [];
    var kjent = katalog.some(function (o) { return o.id === oppgaveId; });
    if (!kjent) {
      return { niva: 'rod', handling: 'avvises',
               grunn: 'Oppgaven finnes ikke i katalogen' };
    }

    var gul = GUL_UTLOSER.filter(function (u) { return f[u]; });
    if (gul.length) {
      return { niva: 'gul', handling: 'operator',
               grunn: 'Krever godkjenning: ' + gul.join(', ') };
    }

    return { niva: 'gronn', handling: 'automatisk', grunn: 'Standard oppdrag' };
  }

  function hendelse(niva) {
    return HENDELSE.filter(function (h) { return h.niva === niva; })[0] || null;
  }

  return {
    ARBEIDSFORHOLD: ARBEIDSFORHOLD,
    TRINN: TRINN,
    KRAV: KRAV,
    IKKE_KRITERIUM: IKKE_KRITERIUM,
    POLITIATTEST: POLITIATTEST,
    IDENTITET: IDENTITET,
    SCENARIER: SCENARIER,
    MODULER: MODULER,
    PROVE: PROVE,
    RISIKONIVA: RISIKONIVA,
    GUL_UTLOSER: GUL_UTLOSER,
    HENDELSE: HENDELSE,
    STENGING: STENGING,
    MALES: MALES,
    IKKE_GRUNNLAG: IKKE_GRUNNLAG,
    kanAktiveres: kanAktiveres,
    vurderIntervju: vurderIntervju,
    risikoFor: risikoFor,
    hendelse: hendelse
  };
})();
