/* Naviar – prismodell.
   Prisen skal være synlig FØR oppdraget bestilles, og hver linje skal kunne forklares.
   Satsene her er piloteksempler for Norge (NOK) og hentes fra land-laget i produksjon. */

window.PP_PRIS = (function () {
  'use strict';

  var LAND = {
    NO: {
      valuta: 'NOK',
      symbol: 'kr',
      timesats: 260,          // hjelperens grunnsats per time
      reisetidSats: 130,      // halv sats for reisetid – reisen skal lønne seg, men ikke overpris kunden
      reisetillegg: 25,       // faktisk reiseutgift, sjablong
      plattformProsent: 0.18, // formidling, verifisering, forsikring, support, betaling
      minstepris: 260
    },
    SE: { valuta: 'SEK', symbol: 'kr', timesats: 280, reisetidSats: 140, reisetillegg: 25, plattformProsent: 0.18, minstepris: 280 },
    DE: { valuta: 'EUR', symbol: '€', timesats: 24, reisetidSats: 12, reisetillegg: 3, plattformProsent: 0.18, minstepris: 24 }
  };

  // Tillegg per hastegrad. «Nå» koster mer fordi hjelperen må avbryte det hen holder på med.
  var HASTETILLEGG = { na: 0.20, idag: 0.05, planlagt: 0, fast: -0.05 };

  // Enkelte oppdrag krever mer opplæring eller mer ansvar.
  var OPPGAVEFAKTOR = {
    handling: 1, samvaer: 1, dyr: 1, hjemme: 1, digital: 1.05,
    aktivitet: 1.05, folge: 1.15, annet: 1
  };

  function rund(n) { return Math.round(n); }

  function formater(belop, land) {
    var k = LAND[land] || LAND.NO;
    var tall = rund(belop).toLocaleString('nb-NO');
    return k.symbol === '€' ? '€' + tall : tall + ' ' + k.symbol;
  }

  /**
   * Beregner pris for et oppdrag.
   * @param {{land?:string, timer:number, nar:string, oppgave:string, reisetidMin?:number, kveld?:boolean, helg?:boolean}} o
   */
  function beregn(o) {
    var land = o.land || 'NO';
    var k = LAND[land] || LAND.NO;
    var timer = Math.max(0.5, Number(o.timer) || 1);
    var reisetidMin = o.reisetidMin == null ? 15 : o.reisetidMin;

    var oppgavefaktor = OPPGAVEFAKTOR[o.oppgave] || 1;
    var hastefaktor = 1 + (HASTETILLEGG[o.nar] || 0);
    if (o.kveld) hastefaktor += 0.10;
    if (o.helg) hastefaktor += 0.10;

    var arbeid = k.timesats * timer * oppgavefaktor;
    var reisetid = k.reisetidSats * (reisetidMin / 60);
    var reise = k.reisetillegg;

    var hjelperGrunnlag = arbeid + reisetid + reise;
    var hastetillegg = hjelperGrunnlag * (hastefaktor - 1);
    var tilHjelper = Math.max(k.minstepris, hjelperGrunnlag + hastetillegg);

    var plattform = tilHjelper * k.plattformProsent;
    var total = tilHjelper + plattform;

    return {
      valuta: k.valuta,
      linjer: [
        { navn: 'Hjelp i ' + timer.toString().replace('.', ',') + ' time' + (timer === 1 ? '' : 'r'), belop: rund(arbeid) },
        { navn: 'Reisetid (' + reisetidMin + ' min)', belop: rund(reisetid) },
        { navn: 'Reiseutgift', belop: rund(reise) },
        { navn: 'Tillegg for hastegrad', belop: rund(hastetillegg), skjulHvisNull: true },
        { navn: 'Serviceavgift til Naviar', belop: rund(plattform) }
      ].filter(function (l) { return !(l.skjulHvisNull && l.belop === 0); }),
      tilHjelper: rund(tilHjelper),
      plattform: rund(plattform),
      total: rund(total),
      formater: function (b) { return formater(b, land); }
    };
  }

  return { beregn: beregn, formater: formater, land: LAND };
})();
