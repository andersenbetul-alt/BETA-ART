/* Enhetstester for prismodellen og matchingmotoren.
   Kjøres uten nettleser: node tests/enhet.test.js */

var t = require('./hjelpere');

globalThis.window = globalThis;
require('../assets/js/pris.js');
require('../assets/js/matching.js');
require('../assets/js/demodata.js');

var PRIS = window.PP_PRIS;
var M = window.PP_MATCHING;

/* ---------------- prismodell ---------------- */

t.gruppe('Prismodell');

t.test('summen av linjene er lik totalen', function () {
  var p = PRIS.beregn({ timer: 1.5, nar: 'idag', oppgave: 'handling', reisetidMin: 15 });
  var sum = p.linjer.reduce(function (a, l) { return a + l.belop; }, 0);
  // Avrundingsavvik på inntil 2 kr er akseptabelt når hver linje rundes for seg.
  t.erSann(Math.abs(sum - p.total) <= 2, 'linjesum ' + sum + ' vs total ' + p.total);
});

t.test('hjelperandel og serviceavgift utgjør totalen', function () {
  var p = PRIS.beregn({ timer: 2, nar: 'planlagt', oppgave: 'samvaer' });
  t.erSann(Math.abs((p.tilHjelper + p.plattform) - p.total) <= 1);
});

t.test('«nå» koster mer enn «i dag», som koster mer enn fast avtale', function () {
  var felles = { timer: 2, oppgave: 'handling', reisetidMin: 15 };
  var na = PRIS.beregn(Object.assign({ nar: 'na' }, felles)).total;
  var idag = PRIS.beregn(Object.assign({ nar: 'idag' }, felles)).total;
  var fast = PRIS.beregn(Object.assign({ nar: 'fast' }, felles)).total;
  t.erSann(na > idag, 'na ' + na + ' skal være > idag ' + idag);
  t.erSann(idag > fast, 'idag ' + idag + ' skal være > fast ' + fast);
});

t.test('kveld og helg gir tillegg', function () {
  var basis = PRIS.beregn({ timer: 1, nar: 'planlagt', oppgave: 'handling' }).total;
  var kveld = PRIS.beregn({ timer: 1, nar: 'planlagt', oppgave: 'handling', kveld: true }).total;
  t.erSann(kveld > basis);
});

t.test('minstepris gjelder for svært korte oppdrag', function () {
  var p = PRIS.beregn({ timer: 0.5, nar: 'planlagt', oppgave: 'handling', reisetidMin: 0 });
  t.erSann(p.tilHjelper >= PRIS.land.NO.minstepris, 'fikk ' + p.tilHjelper);
});

t.test('serviceavgiften er 18 prosent av hjelperandelen', function () {
  var p = PRIS.beregn({ timer: 2, nar: 'planlagt', oppgave: 'handling' });
  t.erSann(Math.abs(p.plattform - p.tilHjelper * 0.18) <= 1);
});

t.test('valuta følger landet', function () {
  t.erLik(PRIS.beregn({ timer: 1, nar: 'idag', oppgave: 'handling', land: 'DE' }).valuta, 'EUR');
});

/* ---------------- matchingmotor ---------------- */

t.gruppe('Matching – absolutte krav');

function nyHjelper(endringer) {
  return Object.assign({}, window.PP_DEMO.hjelper, { tilgjengelig: true }, endringer || {});
}
function nyttOppdrag(endringer) {
  return Object.assign({}, window.PP_DEMO.oppdrag[0], endringer || {});
}

t.test('utilgjengelig hjelper får ingen oppdrag', function () {
  var r = M.vurder(nyHjelper({ tilgjengelig: false }), nyttOppdrag());
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'tilgjengelig');
});

t.test('oppdragstype hjelperen ikke har valgt, sperres', function () {
  var r = M.vurder(nyHjelper({ oppgaver: ['samvaer'] }), nyttOppdrag({ type: 'handling' }));
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'kvalifisert');
});

t.test('for lavt tillitsnivå sperrer, og begrunnelsen nevner nivået', function () {
  var r = M.vurder(nyHjelper({ tillitsniva: 1 }), nyttOppdrag({ krevdNiva: 3 }));
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'tillitsniva');
  t.erSann(r.sperre.grunn.indexOf('nivå 3') !== -1, 'grunn: ' + r.sperre.grunn);
});

t.test('oppdrag utenfor egen maksavstand sperres', function () {
  var r = M.vurder(nyHjelper({ maksAvstandKm: 2 }), nyttOppdrag({ avstandKm: 9 }));
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'avstand');
});

t.test('tidsrom hjelperen ikke er ledig i, sperres', function () {
  var r = M.vurder(nyHjelper({ tidsrom: ['formiddag'] }), nyttOppdrag({ tidsrom: 'kveld', tidsromNavn: 'Kveld' }));
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'tidsrom');
});

t.test('prøveperiode stenger oppdrag med høyere risiko', function () {
  var r = M.vurder(nyHjelper({ iProveperiode: true }), nyttOppdrag({ risiko: 'middels' }));
  t.erUsann(r.aktuell);
  t.erLik(r.sperre.id, 'proveperiode');
});

t.test('hvert sperret oppdrag har en lesbar begrunnelse', function () {
  var h = nyHjelper({ tilgjengelig: false });
  var r = M.vurder(h, nyttOppdrag());
  t.erSann(typeof r.sperre.grunn === 'string' && r.sperre.grunn.length > 10);
});

t.gruppe('Matching – rangering');

t.test('tidligere relasjon slår kortere avstand', function () {
  var oppdrag = nyttOppdrag({ tidligereOppdragMedHjelper: { 'kjent': 17 } });
  var kjent = nyHjelper({ id: 'kjent' });
  var ukjent = nyHjelper({ id: 'ukjent' });
  var nærOppdrag = Object.assign({}, oppdrag, { avstandKm: 3.0 });
  var scoreKjent = M.vurder(kjent, nærOppdrag).score;
  // Ukjent hjelper som er nærmere, men uten relasjon
  var scoreUkjent = M.vurder(ukjent, Object.assign({}, nærOppdrag, { avstandKm: 0.4 })).score;
  t.erSann(scoreKjent > scoreUkjent, 'kjent ' + scoreKjent + ' skal slå ukjent ' + scoreUkjent);
});

t.test('kortere avstand gir høyere score alt annet likt', function () {
  var h = nyHjelper();
  var naer = M.vurder(h, nyttOppdrag({ avstandKm: 0.5 })).score;
  var fjern = M.vurder(h, nyttOppdrag({ avstandKm: 4.5 })).score;
  t.erSann(naer > fjern);
});

t.test('språkønske som ikke matcher, senker scoren', function () {
  var h = nyHjelper({ sprak: ['norsk'] });
  var med = M.vurder(h, nyttOppdrag({ sprakonske: 'norsk' })).score;
  var uten = M.vurder(h, nyttOppdrag({ sprakonske: 'polsk' })).score;
  t.erSann(med > uten);
});

t.test('vektene summerer til 100', function () {
  var sum = Object.keys(M.VEKT).reduce(function (a, k) { return a + M.VEKT[k]; }, 0);
  t.erLik(sum, 100);
});

t.test('score ligger mellom 0 og 100', function () {
  var r = M.vurder(nyHjelper(), nyttOppdrag());
  t.erSann(r.score >= 0 && r.score <= 100, 'score ' + r.score);
});

t.test('aktuelle oppdrag sorteres synkende etter score', function () {
  var r = M.rangerOppdrag(nyHjelper(), window.PP_DEMO.oppdrag);
  for (var i = 1; i < r.aktuelle.length; i++) {
    t.erSann(r.aktuelle[i - 1].resultat.score >= r.aktuelle[i].resultat.score);
  }
});

t.test('tilbudsbølger setter fast hjelper først', function () {
  var oppdrag = nyttOppdrag({ fastHjelperId: 'fast', krets: ['krets'] });
  var hjelpere = [
    nyHjelper({ id: 'annen' }),
    nyHjelper({ id: 'krets' }),
    nyHjelper({ id: 'fast' })
  ];
  var bolger = M.tilbudsbolger(oppdrag, hjelpere);
  t.erLik(bolger[0].navn, 'Fast hjelper');
  t.erLik(bolger[0].hjelpere[0].hjelper.id, 'fast');
  t.erLik(bolger[1].navn, 'Familiens krets');
});

t.gruppe('Adressevern i datamodellen');

t.test('oppdragslisten inneholder ingen gateadresse', function () {
  var tekst = JSON.stringify(window.PP_DEMO.oppdrag);
  ['veien', 'gate', 'gata', 'chausseen'].forEach(function (ord) {
    t.erSann(tekst.toLowerCase().indexOf(ord) === -1, 'fant «' + ord + '» i oppdragslisten');
  });
});

t.test('adressen hentes bare gjennom eget oppslag', function () {
  t.erSann(typeof window.PP_DEMO.hentAdresse('o-1') === 'string');
  t.erLik(window.PP_DEMO.hentAdresse('finnes-ikke'), null);
});

t.oppsummer('Enhetstester');
