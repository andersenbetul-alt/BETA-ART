/* Naviar Care – abonnement og fakturering.

   Modellen er B2B: leverandøren betaler, ingen andre. Strukturen tar høyde for
   flere betalingsstrømmer, men bare én er aktiv:

     leverandor  → aktiv. Abonnement fra tjenesteleverandøren til oss.
     familie     → forberedt, avslått. Å ta betalt fra pårørende bryter løftet
                   «ingen app, ingen konto, ingen kostnad for familien», som er
                   et av de tre argumentene landingssiden hviler på.
     mellom      → sperret. Penger mellom familie og hjelper er
                   betalingsformidling og kan utløse konsesjonsplikt. Se J11 i
                   docs/team/JURIDISK-RISIKO.md. Skal ikke åpnes uten juridisk
                   avklaring.

   Selve betalingen håndteres av leverandør (Stripe eller Vipps). Vi lagrer
   aldri kortopplysninger. */

window.PP_ABONNEMENT = (function () {
  'use strict';

  var STROMMER = {
    leverandor: { aktiv: true,  navn: 'Abonnement fra leverandør' },
    familie:    { aktiv: false, navn: 'Betaling fra pårørende',
                  sperre: 'Bryter løftet om at familien ikke betaler. Krever ny landingsside og ny prismodell.' },
    mellom:     { aktiv: false, navn: 'Betaling mellom familie og hjelper',
                  sperre: 'Betalingsformidling. Kan utløse konsesjonsplikt – se J11. Krever juridisk avklaring.' }
  };

  var PLANER = [
    {
      id: 'pilot',
      navn: 'Pilot',
      pris: 990,
      periode: 'engangs',
      dager: 30,
      maksKunder: 50,
      beskrivelse: '30 dager. Stopper av seg selv.',
      punkter: ['Inntil 50 aktive kunder', 'Ubegrenset antall medarbeidere',
                'Familieoppdateringer på 18 språk', 'Personlig oppstart', 'Ingen binding etterpå']
    },
    {
      id: 'standard',
      navn: 'Standard',
      pris: 499,
      periode: 'mnd',
      maksKunder: 25,
      beskrivelse: 'Etter piloten. Ingen binding.',
      punkter: ['Inntil 25 aktive kunder', 'Ubegrenset antall medarbeidere',
                'Familieoppdateringer på 18 språk', 'Oppsigelse i løsningen, ikke på telefon']
    }
  ];

  /* Merverdiavgift er ikke avklart – se J16. Til den er det, vises prisene
     som «eks. mva.» og beregnes ikke. Å gjette her er dyrere enn å vente. */
  var MVA = { avklart: false, sats: null, note: 'Merverdiavgift ikke avklart. Alle priser oppgis eks. mva.' };

  function plan(id) {
    return PLANER.filter(function (p) { return p.id === id; })[0] || null;
  }

  function formater(kr) {
    return String(kr).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr';
  }

  function dagerIgjen(abo) {
    if (!abo || !abo.slutt) return null;
    return Math.max(0, Math.ceil((new Date(abo.slutt) - new Date()) / 86400000));
  }

  function status(abo) {
    if (!abo) return { kode: 'ingen', tekst: 'Ingen aktiv plan', farge: 'planlagt' };
    var igjen = dagerIgjen(abo);
    if (abo.plan === 'pilot') {
      if (igjen === 0) return { kode: 'utlopt', tekst: 'Piloten er avsluttet', farge: 'warn' };
      return { kode: 'pilot', tekst: igjen + ' dager igjen av piloten', farge: 'ok' };
    }
    return { kode: 'aktiv', tekst: 'Aktivt abonnement', farge: 'ok' };
  }

  /* Fakturalinjer. I produksjon kommer disse fra betalingsleverandøren;
     her bygges de av planen slik at visningen kan testes. */
  function faktura(abo) {
    var p = plan(abo.plan);
    if (!p) return null;
    return {
      nummer: abo.fakturanummer || 'F-' + new Date(abo.start).getFullYear() + '-0001',
      dato: abo.start,
      linjer: [{ tekst: 'Naviar Care – ' + p.navn, belop: p.pris }],
      sum: p.pris,
      mva: MVA.avklart ? Math.round(p.pris * MVA.sats) : null,
      note: MVA.avklart ? null : MVA.note
    };
  }

  return {
    PLANER: PLANER, STROMMER: STROMMER, MVA: MVA,
    plan: plan, status: status, faktura: faktura,
    formater: formater, dagerIgjen: dagerIgjen
  };
})();
