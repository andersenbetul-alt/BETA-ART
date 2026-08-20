/* Naviar – testdata for driftskonsollen.
   Ingen ekte personer. Fødselsnummer, kontonummer og helseopplysninger
   forekommer ikke – heller ikke i driftsverktøyet.

   Referansesvarene er vurderinger, ikke ordrette sitater. En avvist søker har
   innsynsrett i begrunnelsen, og et sitat ville røpet hvem som sa hva.
   Se docs/DRIFT.md punkt 5 og docs/team/JURIDISK-RISIKO.md J20. */

window.PP_DRIFT_DATA = (function () {
  'use strict';

  /* Alvorsgrader styrer svarfrist og hvem som varsles. */
  var ALVOR = {
    P1: { navn: 'P1 – Sikkerhet', frist: 15,   enhet: 'min', farge: 'p1', beskrivelse: 'Pågående risiko for bruker eller hjelper. Døgnbemannet.' },
    P2: { navn: 'P2 – Oppdrag',   frist: 60,   enhet: 'min', farge: 'p2', beskrivelse: 'Uteblitt oppmøte, avbrutt oppdrag, bruker uten hjelp.' },
    P3: { navn: 'P3 – Klage',     frist: 1440, enhet: 'min', farge: 'p3', beskrivelse: 'Klage, betalingssak, tvist. Én virkedag.' },
    P4: { navn: 'P4 – Søknad',    frist: 4320, enhet: 'min', farge: 'p4', beskrivelse: 'Søknadsbehandling og referansesjekk. Tre virkedager.' }
  };

  var soknader = [
    {
      id: 'S-2041', navn: 'Mikkel Aas', sted: '0182 Oslo', alder: 27, mottatt: 41,
      alvor: 'P4',
      steg: { epost: true, sms: true, id: true, referanse1: true, referanse2: false, kurs: false },
      oppgaver: ['handling', 'praktisk', 'ute'], sprak: ['norsk'], transport: ['bil', 'til-fots'],
      referanser: [
        { navn: 'Hilde Berg', relasjon: 'tidligere leder', telefon: '4001 22 33', status: 'godkjent',
          svar: 'Bekrefter 4 års kjennskap, pålitelighet og punktlighet. Ingen innvending mot arbeid hos eldre.' },
        { navn: 'Jonas Ek', relasjon: 'frivilligkoordinator', telefon: '4009 88 77', status: 'venter', svar: '' }
      ],
      merknad: 'Har oppgitt førerkort klasse B. Ikke helsefaglig bakgrunn.'
    },
    {
      id: 'S-2042', navn: 'Amina Yusuf', sted: '0560 Oslo', alder: 34, mottatt: 20,
      alvor: 'P4',
      steg: { epost: true, sms: true, id: true, referanse1: true, referanse2: true, kurs: true },
      oppgaver: ['handling', 'folge', 'samvaer', 'digital'], sprak: ['norsk', 'engelsk', 'somali'], transport: ['kollektiv', 'til-fots'],
      referanser: [
        { navn: 'Turid Sand', relasjon: 'tidligere kollega', telefon: '4111 22 33', status: 'godkjent',
          svar: 'Bekrefter 6 års kjennskap. Vurderer pålitelighet og folkelag som god. Anbefaler.' },
        { navn: 'Peter Holm', relasjon: 'studieveileder', telefon: '4122 33 44', status: 'godkjent',
          svar: 'Bekrefter 3 års kjennskap, ryddighet og punktlighet. Ingen innvending.' }
      ],
      merknad: 'Alle steg fullført. Klar for godkjenning til nivå 1.'
    },
    {
      id: 'S-2043', navn: 'Lars Vik', sted: '1470 Lørenskog', alder: 19, mottatt: 9,
      alvor: 'P4',
      steg: { epost: true, sms: true, id: false, referanse1: false, referanse2: false, kurs: false },
      oppgaver: ['handling', 'ute'], sprak: ['norsk'], transport: ['sykkel'],
      referanser: [
        { navn: 'Ingrid Vik', relasjon: 'mor', telefon: '4133 44 55', status: 'avvist',
          svar: 'Avvist: nær familie godtas ikke som referanse. Ny referanse etterspurt.' },
        { navn: '—', relasjon: '', telefon: '', status: 'mangler', svar: '' }
      ],
      merknad: 'ID-kontroll ikke gjennomført. Referanse 1 avvist: nær familie.'
    }
  ];

  var hendelser = [
    {
      id: 'H-881', alvor: 'P1', tittel: 'Hjelper ba om BankID-kode',
      melder: 'Pårørende (datter)', gjelder: 'Hjelper h-4412 · Tom N.',
      mottatt: 6, oppdrag: 'O-9921 · handling · Grünerløkka',
      beskrivelse: 'Mor forteller at hjelperen spurte om BankID-koden hennes for å «betale i butikken». Hun ga den ikke.',
      tiltak: 'Kontoen fryses umiddelbart. Aktive oppdrag omfordeles. Manuell gjennomgang starter.',
      status: 'ny'
    },
    {
      id: 'H-882', alvor: 'P2', tittel: 'Hjelper møtte ikke opp',
      melder: 'Automatisk – ingen innsjekk 10 min etter avtalt tid',
      gjelder: 'Hjelper h-3120 · Nora S.', mottatt: 74,
      oppdrag: 'O-9930 · følge til legetime · Sagene',
      beskrivelse: 'Ingen innsjekk registrert. Bruker er 84 år og skulle til legetime kl. 09:30.',
      tiltak: 'Ring bruker først, deretter hjelper. Finn erstatter. Vurder gebyrfritak.',
      status: 'ny'
    },
    {
      id: 'H-883', alvor: 'P3', tittel: 'Uenighet om varighet',
      melder: 'Hjelper', gjelder: 'Oppdrag O-9899', mottatt: 190,
      oppdrag: 'O-9899 · samvær · Frogner',
      beskrivelse: 'Hjelper melder 2 t 15 min, familien mener 1 t 45 min. Utbetaling er satt på vent.',
      tiltak: 'Sammenhold innsjekk- og utsjekktidspunkt. Del differansen kun ved uklare logger.',
      status: 'under_arbeid'
    }
  ];

  var aktiveOppdrag = [
    { id: 'O-9940', hjelper: 'Sofia H.', bydel: 'Frogner', start: '14:02', varighetMin: 47, forventetSlutt: '15:30', status: 'pagar', varsel: null },
    { id: 'O-9941', hjelper: 'Daniel R.', bydel: 'Sagene', start: '13:15', varighetMin: 195, forventetSlutt: '14:15', status: 'pagar', varsel: 'Overtid: 3 t 15 min mot forventet 1 t. Kontakt hjelper.' },
    { id: 'O-9942', hjelper: 'Lena K.', bydel: 'Majorstuen', start: null, varighetMin: 0, forventetSlutt: '14:30', status: 'venter_innsjekk', varsel: 'Ingen innsjekk 12 min etter avtalt tid.' }
  ];

  var betalingssaker = [
    { id: 'B-551', oppdrag: 'O-9899', belop: 604, sak: 'Varighet bestridt', status: 'på vent', alder: 190 },
    { id: 'B-552', oppdrag: 'O-9912', belop: 372, sak: 'Familien bekreftet ikke innen 48 t', status: 'auto-frigis om 4 t', alder: 2650 }
  ];

  return {
    ALVOR: ALVOR,
    soknader: soknader,
    hendelser: hendelser,
    aktiveOppdrag: aktiveOppdrag,
    betalingssaker: betalingssaker,
    // Fast spørsmålsliste – referansesjekk skal være lik for alle søkere.
    referansesporsmal: [
      'Hvor lenge har du kjent søkeren, og i hvilken sammenheng?',
      'Vil du beskrive søkeren som pålitelig?',
      'Fullfører søkeren oppgaver som avtalt, og møter presist?',
      'Ville du syntes det var greit at søkeren jobbet hjemme hos en eldre?',
      'Er det noe du mener vi bør vite før vi godkjenner søkeren?'
    ]
  };
})();
