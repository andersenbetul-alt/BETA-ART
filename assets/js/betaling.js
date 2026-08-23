/* Naviar – hva en betaling er i denne tjenesten.

   Modulen kaller ingen betalingsleverandør, og den kommer ikke til å gjøre
   det. En hemmelig nøkkel i assets/js/ er en nøkkel hos hver eneste
   besøkende, og et kall som oppretter en betaling må skje fra en server.
   Her ligger kontrakten kallet skal oppfylle – tilstandene, hva som lagres,
   og hva som må være sant før noen kan trekkes for noe.

   To ting sto allerede skrevet i PP_ABONNEMENT, og de gjelder fortsatt:

     familie → sperret i v1, fordi det gjør oss til forbrukerleverandør
     mellom  → sperret, fordi penger fra kunde videre til en tredjepart kan
               være betalingsformidling. Se J11.

   Naviar Klarhet er begge deler samtidig: familien betaler 599, eksperten
   får 449. Det er ikke en teknisk detalj som kan løses med et bibliotek –
   det er de to portene som står stengt, og de åpnes av en jurist, ikke av
   en integrasjon. Derfor står klarhet-strømmen her som `avklares`, ikke som
   `aktiv`, og bestill() nekter mens den gjør det. */

window.PP_BETALING = (function () {
  'use strict';

  /* ---------- strømmene ---------- */

  var STROM = {
    leverandor: { tilstand: 'aktiv',
      navn: 'Abonnement fra tjenesteleverandør',
      hvorfor: 'B2B. Ingen forbrukerkontrakt, ingen videreformidling' },

    klarhet: { tilstand: 'avklares',
      navn: 'Familien betaler for en klarhetssamtale',
      apnerTo: ['familie', 'mellom'],
      krever: [
        'J11 – om det er betalingsformidling å ta imot 599 og betale ut 449',
        'J5 – angrerett og opplysningsplikt ved fjernsalg til forbruker',
        'J16 – merverdiavgift på konsultasjonen, som flytter 25 % av prisen',
        'Arbeidsrettslig klassifisering – en ansatt lønnes, en oppdragstaker faktureres'
      ],
      hvorfor: 'Åpner begge strømmene PP_ABONNEMENT holder stengt. Det er en ' +
               'juridisk beslutning, ikke en integrasjon' },

    familie: { tilstand: 'sperret',
      navn: 'Betaling fra pårørende for praktisk hjelp',
      hvorfor: 'Se PP_ABONNEMENT.STROMMER.familie' },

    mellom: { tilstand: 'sperret',
      navn: 'Penger mellom familie og hjelper',
      hvorfor: 'Betalingsformidling. Se J11' }
  };

  /* ---------- tilstandene en betaling går gjennom ----------

     Rekkefølgen er hentet fra docs/SERVICE-BLUEPRINT.md og er et løfte til
     to parter samtidig: hjelperen skal aldri lure på om pengene kommer, og
     kunden skal aldri betale for noe som ikke ble gjort.

     Derfor reservert før, trukket etter. Ikke omvendt. */
  var TILSTAND = [
    { id: 'ingen',      navn: 'Ikke betalt',       penger: 'hos kunden' },
    { id: 'reservert',  navn: 'Reservert',         penger: 'holdt på kundens kort',
      naar: 'Når eksperten har en time som er bekreftet',
      merk: 'Reservasjon er ikke et trekk. Kunden ser beløpet som holdt, ikke som betalt' },
    { id: 'trukket',    navn: 'Trukket',           penger: 'hos betalingsleverandøren',
      naar: 'Når samtalen er gjennomført og de tre stegene er sendt' },
    { id: 'utbetalt',   navn: 'Utbetalt til eksperten', penger: 'hos eksperten',
      naar: 'Etter avtalt utbetalingsdag' },
    { id: 'frigitt',    navn: 'Reservasjon frigitt', penger: 'hos kunden',
      naar: 'Avlyst, eller ikke gjennomført innen fristen' },
    { id: 'refundert',  navn: 'Refundert',         penger: 'hos kunden',
      naar: 'Riktig-ekspert-garantien, eller en klage som førte fram' }
  ];

  var LOVLIGE_OVERGANGER = {
    ingen:     ['reservert'],
    reservert: ['trukket', 'frigitt'],
    trukket:   ['utbetalt', 'refundert'],
    utbetalt:  ['refundert'],
    frigitt:   [],
    refundert: []
  };

  /* Reservasjonen kan ikke stå for evig. Et beløp som er holdt på et kort i
     ukevis, er et beløp kunden ikke kan bruke – og hun har ikke fått noe for
     det ennå. */
  var FRIGIS_ETTER_TIMER = 48;

  /* ---------- angrerett ----------

     Dette manglet, og det er ikke en formalitet.

     Klarhet selges på avstand til en forbruker. Da har hun angrerett etter
     angrerettloven. Men samtalen skal skje på mandag, altså midt inne i
     angrefristen – og en tjeneste som er levert, kan hun ikke angre på uten
     videre.

     Loven løser det med en betingelse, ikke med et unntak: hun må uttrykkelig
     be om at tjenesten starter før fristen er ute, og hun må få vite hva hun
     mister ved det. Uten den bekreftelsen har vi levert en tjeneste vi ikke
     kan kreve betalt for hvis hun angrer.

     Én avkrysning. Ikke forhåndskrysset – et samtykke som allerede står der,
     er ikke et samtykke, og det gjelder her som på den eldres skjerm. */
  var ANGRERETT = {
    gjelder: 'Forbruker som kjøper på avstand',
    dager: 14,
    bekreftelse: 'Jeg ber om at samtalen holdes før angrefristen på 14 dager ' +
                 'er ute, og forstår at jeg ikke kan angre på en samtale som ' +
                 'er gjennomført.',
    forhandskrysset: false,
    /* Angrer hun før samtalen, får hun alt tilbake. Reservasjonen er ikke
       trukket ennå, så det er ingenting å kreve inn. */
    forSamtalen: 'Full refusjon. Reservasjonen frigis',
    etterSamtalen: 'Ingen angrerett på den gjennomførte samtalen. ' +
                   'Riktig-ekspert-garantien gjelder fortsatt',
    hjemmel: 'Angrerettloven. Skal bekreftes av jurist – se J5',
    maaAvklares: true
  };

  /* ---------- opplysninger før avtale ----------

     Også et forbrukerkrav, og et som er lett å tro at man oppfyller. Alt
     under skal stå før knappen, ikke på siden etter. */
  var FOR_AVTALE = [
    { id: 'pris',      hva: 'Totalpris inkludert alle gebyrer' },
    { id: 'innhold',   hva: 'Hva samtalen er, og hvor lenge den varer' },
    { id: 'selger',    hva: 'Hvem som selger, med organisasjonsnummer og adresse' },
    { id: 'angrerett', hva: 'Angreretten, og hva som skjer med den' },
    { id: 'klage',     hva: 'Hvor hun klager hvis noe går galt' },
    { id: 'grenser',   hva: 'Hva fagpersonen ikke kan gjøre' }
  ];

  /* ---------- det vi aldri lagrer ----------

     Kortopplysninger passerer aldri gjennom oss. Det er ikke en ambisjon,
     det er hele grunnen til å bruke en betalingsleverandør. */
  var LAGRES = ['betalings-id hos leverandøren', 'beløp', 'valuta',
                'tilstand', 'tidspunkt for hver overgang'];
  var LAGRES_ALDRI = ['kortnummer', 'utløpsdato', 'CVC', 'kontonummer',
                      'BankID', 'fødselsnummer'];

  /* ---------- valget vi ikke tar her ----------

     Hvilket Stripe-produkt som skal brukes, er ikke en teknisk smakssak.
     Connect finnes for å betale ut til selvstendige og virksomheter. Er
     eksperten ansatt, skal hun ha lønn – ikke en utbetaling gjennom Connect.
     Å velge produkt nå er å svare på arbeidsrettsspørsmålet med et bibliotek. */
  var LEVERANDORVALG = {
    avklart: false,
    avhengerAv: 'Om eksperten er ansatt eller oppdragstaker',
    hvis_oppdragstaker: 'Stripe Connect: eksperten er mottaker, vi tar en andel',
    hvis_ansatt: 'Vanlig betaling til oss, og lønn ut gjennom lønnssystem. Ikke Connect',
    uansett: 'Nøkkelen ligger på server. Frontend ser aldri annet enn en klient-hemmelighet ' +
             'som er bundet til én betaling'
  };

  /* ---------- funksjonene ---------- */

  function strom(id) { return STROM[id] || null; }

  function tilstand(id) {
    return TILSTAND.filter(function (t) { return t.id === id; })[0] || null;
  }

  /* Kan betalingen gå fra a til b? Kaster ikke – svarer med grunn, fordi
     grunnen skal kunne vises. */
  function kanGaaTil(fra, til) {
    var lov = LOVLIGE_OVERGANGER[fra];
    if (!lov) return { ok: false, grunn: 'Ukjent tilstand: ' + fra };
    if (lov.indexOf(til) === -1) {
      return { ok: false,
               grunn: 'Kan ikke gå fra «' + (tilstand(fra) || {}).navn + '» til «' +
                      ((tilstand(til) || {}).navn || til) + '»',
               lovlige: lov };
    }
    return { ok: true, grunn: null };
  }

  /* Porten. Spørres før noe forsøkes betalt. */
  function bestill(onske) {
    var o = onske || {};
    var s = strom(o.strom);

    if (!s) {
      return { ok: false, regel: 'ukjent_strom', grunn: 'Ukjent betalingsstrøm: ' + o.strom };
    }
    if (s.tilstand === 'sperret') {
      return { ok: false, regel: 'sperret', grunn: s.navn + ' er sperret. ' + s.hvorfor };
    }
    if (s.tilstand === 'avklares') {
      return { ok: false, regel: 'ikke_avklart',
               grunn: s.navn + ' krever juridisk avklaring før den kan åpnes',
               krever: s.krever };
    }
    if (typeof o.belop !== 'number' || o.belop <= 0) {
      return { ok: false, regel: 'belop', grunn: 'Beløpet må stå før bestillingen' };
    }
    /* Angreretten er en betingelse, ikke en formalitet. Uten bekreftelsen
       har vi levert noe vi ikke kan kreve betalt for. */
    if (o.forbruker && o.angrerettBekreftet !== true) {
      return { ok: false, regel: 'angrerett',
               grunn: 'Kunden må uttrykkelig be om at samtalen holdes før angrefristen er ute',
               tekst: ANGRERETT.bekreftelse };
    }
    var mangler = FOR_AVTALE.filter(function (f) {
      return (o.vist || []).indexOf(f.id) === -1;
    });
    if (o.forbruker && mangler.length) {
      return { ok: false, regel: 'opplysningsplikt',
               grunn: 'Dette må stå før knappen: ' +
                      mangler.map(function (m) { return m.hva; }).join('; '),
               mangler: mangler.map(function (m) { return m.id; }) };
    }
    return { ok: true, regel: 'kan_reserveres', neste: 'reservert' };
  }

  return {
    STROM: STROM,
    TILSTAND: TILSTAND,
    LOVLIGE_OVERGANGER: LOVLIGE_OVERGANGER,
    FRIGIS_ETTER_TIMER: FRIGIS_ETTER_TIMER,
    ANGRERETT: ANGRERETT,
    FOR_AVTALE: FOR_AVTALE,
    LAGRES: LAGRES,
    LAGRES_ALDRI: LAGRES_ALDRI,
    LEVERANDORVALG: LEVERANDORVALG,
    strom: strom,
    tilstand: tilstand,
    kanGaaTil: kanGaaTil,
    bestill: bestill
  };
})();
