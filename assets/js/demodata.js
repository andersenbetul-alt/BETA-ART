/* Naviar – demodata for oppdragstavla.
   Ingen ekte personer. Adresser er utelatt med vilje: før et oppdrag er tatt,
   finnes ikke gateadressen i dataene frontend får se. */

window.PP_DEMO = (function () {
  'use strict';

  var hjelper = {
    id: 'h-sofia',
    navn: 'Sofia H.',
    tilgjengelig: false,           // styres av bryteren – og styrer posisjonsbruk
    tillitsniva: 2,
    iProveperiode: false,
    tillitsscore: 91,
    punktlighet: 98,
    maksAvstandKm: 5,
    transport: ['til-fots', 'kollektiv'],
    sprak: ['norsk', 'engelsk'],
    tidsrom: ['formiddag', 'ettermiddag'],
    oppgaver: ['handling', 'folge', 'samvaer', 'digital', 'praktisk'],
    timesats: 260,
    fullforteOppdrag: 87
  };

  var oppdrag = [
    {
      id: 'o-1', type: 'handling', typeNavn: 'Handling og ærend',
      tittel: 'Handlehjelp', bydel: 'Frogner',
      avstandKm: 1.2, reisetidMin: 14, varighetTimer: 1,
      tidsrom: 'ettermiddag', tidsromNavn: 'Ettermiddag', nar: 'I dag 15:00',
      krevdNiva: 1, risiko: 'lav', sprakonske: 'norsk',
      betaling: 372, hastegrad: 'idag',
      tidligereOppdragMedHjelper: { 'h-sofia': 17 },
      notat: 'Bruker rullator. Hjelp med å bære posene inn.'
    },
    {
      id: 'o-2', type: 'samvaer', typeNavn: 'Sosialt samvær',
      tittel: 'Kaffe og en prat', bydel: 'Majorstuen',
      avstandKm: 2.4, reisetidMin: 21, varighetTimer: 2,
      tidsrom: 'formiddag', tidsromNavn: 'Formiddag', nar: 'I morgen 11:00',
      krevdNiva: 1, risiko: 'lav', sprakonske: '',
      betaling: 604, hastegrad: 'planlagt',
      tidligereOppdragMedHjelper: {},
      notat: 'Ønsker noen å snakke med et par timer i uka.'
    },
    {
      id: 'o-3', type: 'folge', typeNavn: 'Følge til avtale',
      tittel: 'Følge til legetime', bydel: 'Sagene',
      avstandKm: 3.8, reisetidMin: 27, varighetTimer: 2,
      tidsrom: 'formiddag', tidsromNavn: 'Formiddag', nar: 'Fredag 09:30',
      krevdNiva: 2, risiko: 'middels', sprakonske: 'engelsk',
      betaling: 690, hastegrad: 'planlagt',
      tidligereOppdragMedHjelper: {},
      notat: 'Trenger følge til og fra legekontoret.'
    },
    {
      id: 'o-4', type: 'digital', typeNavn: 'Digital hjelp',
      tittel: 'Hjelp med nettbrett', bydel: 'St. Hanshaugen',
      avstandKm: 1.9, reisetidMin: 17, varighetTimer: 1,
      tidsrom: 'ettermiddag', tidsromNavn: 'Ettermiddag', nar: 'I dag 17:30',
      krevdNiva: 1, risiko: 'lav', sprakonske: '',
      betaling: 358, hastegrad: 'na',
      tidligereOppdragMedHjelper: { 'h-sofia': 2 },
      notat: 'Får ikke til videosamtale med barnebarnet.'
    },
    {
      id: 'o-5', type: 'ute', typeNavn: 'Ute og sesong',
      tittel: 'Klippe plen', bydel: 'Ullern',
      avstandKm: 4.2, reisetidMin: 30, varighetTimer: 2,
      tidsrom: 'ettermiddag', tidsromNavn: 'Ettermiddag', nar: 'Lørdag 13:00',
      krevdNiva: 1, risiko: 'lav', sprakonske: '',
      betaling: 560, hastegrad: 'planlagt',
      tidligereOppdragMedHjelper: {},
      notat: 'Liten hage bak huset.'
    },
    {
      id: 'o-6', type: 'praktisk', typeNavn: 'Praktisk i hjemmet',
      tittel: 'Bytte lyspærer og bære ut søppel', bydel: 'Nordstrand',
      avstandKm: 8.6, reisetidMin: 44, varighetTimer: 1,
      tidsrom: 'formiddag', tidsromNavn: 'Formiddag', nar: 'Torsdag 10:00',
      krevdNiva: 1, risiko: 'lav', sprakonske: '',
      betaling: 340, hastegrad: 'planlagt',
      tidligereOppdragMedHjelper: {},
      notat: 'Kommer ikke opp i taket selv.'
    },
    {
      id: 'o-7', type: 'samvaer', typeNavn: 'Sosialt samvær',
      tittel: 'Selskap på kveldstid', bydel: 'Grünerløkka',
      avstandKm: 2.1, reisetidMin: 19, varighetTimer: 2,
      tidsrom: 'kveld', tidsromNavn: 'Kveld', nar: 'I dag 19:00',
      krevdNiva: 1, risiko: 'lav', sprakonske: '',
      betaling: 640, hastegrad: 'idag',
      tidligereOppdragMedHjelper: {},
      notat: 'Kvier seg for å være alene om kvelden.'
    }
  ];

  // Adresser finnes bare her, og hentes først når et oppdrag er tildelt.
  var adresser = {
    'o-1': 'Frognerveien 42 B, 3. etasje · Ring på «Bjerke»',
    'o-2': 'Bogstadveien 18, 2. etasje',
    'o-3': 'Sandakerveien 7 A',
    'o-4': 'Ullevålsveien 55, 4. etasje · Portkode 1974',
    'o-5': 'Ullernchausseen 88',
    'o-6': 'Nordstrandveien 12',
    'o-7': 'Thorvald Meyers gate 33, 1. etasje'
  };

  return {
    hjelper: hjelper,
    oppdrag: oppdrag,
    hentAdresse: function (id) { return adresser[id] || null; },
    oppmoteKode: function () { return '4821'; }
  };
})();
