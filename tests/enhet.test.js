/* Enhetstester for prismodellen og matchingmotoren.
   Kjøres uten nettleser: node tests/enhet.test.js */

var t = require('./hjelpere');

globalThis.window = globalThis;

/* besok-lager lagrer i nettleseren. Testene trenger bare katalogen, så vi gir
   den et minne som holder så lenge prosessen lever. */
if (typeof globalThis.localStorage === 'undefined') {
  var minne = {};
  globalThis.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(minne, k) ? minne[k] : null; },
    setItem: function (k, v) { minne[k] = String(v); },
    removeItem: function (k) { delete minne[k]; }
  };
}
require('../assets/js/pris.js');
require('../assets/js/akutt.js');
require('../assets/js/besok-lager.js');
require('../assets/js/besok-behov.js');
require('../assets/js/besok-sprakkrav.js');
require('../assets/js/besok-agenter.js');
require('../assets/js/besok-vern.js');
require('../assets/js/hjelper-opptak.js');
require('../assets/js/hjelper-base.js');
require('../assets/js/maling.js');
require('../assets/js/merkesprak.js');
require('../assets/js/hverdagsguide.js');
require('../assets/js/ki-port.js');
require('../assets/js/sprak-ui.js');
require('../assets/js/ekspertbistand.js');
require('../assets/js/klarhet.js');
require('../assets/js/klarsprak.js');
require('../assets/js/betaling.js');
require('../assets/js/besok-klage.js');
require('../assets/js/besok-abonnement.js');
require('../assets/js/besok-kvalitet.js');
require('../assets/js/besok-sprak.js');
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

/* ---------------- akuttvurdering ----------------
   Disse testene finnes fordi feilene de dekker fantes i koden:
   delstrengsøk ga «fall» i «avfallet» og «nød» i «nødvendig», mens
   «kraftig blødning» og «vondt i brystet» slapp gjennom. */

var A = window.PP_AKUTT;

t.gruppe('Akutt – ord som ikke skal utløse alarm');

[
  ['Kan du bære ut avfallet?', 'fall i avfallet'],
  ['Det er ikke nødvendig med bil', 'nød i nødvendig'],
  ['Sjekke brannvarsleren', 'brann i brannvarsleren'],
  ['Følge til blodprøve', 'blod i blodprøve'],
  ['Jeg har et forslag', 'slag i forslag'],
  ['Hjelp med skattemeldingen', 'ingen treff'],
  ['Handle mat og bære posene inn', 'ingen treff']
].forEach(function (rad) {
  t.test(rad[0] + ' → ingen (' + rad[1] + ')', function () {
    t.erLik(A.vurder(rad[0]).niva, 'ingen');
  });
});

t.gruppe('Akutt – symptomer familier faktisk skriver');

[
  'kraftig blødning',
  'vondt i brystet',
  'hun besvimte',
  'munnviken henger',
  'pustar ikkje',
  'hun våkner ikke',
  'hun kommer ikke opp',
  'Det brenner i kjøkkenet',
  'hun puster ikke',
  'ring ambulanse',
  'hun ligger på gulvet'
].forEach(function (tekst) {
  t.test(tekst + ' → rødt', function () {
    t.erLik(A.vurder(tekst).niva, 'rod');
  });
});

t.gruppe('Akutt – gult spør, men stopper ikke');

[
  'Hun falt i går og er litt øm',
  'Hun er svimmel i dag',
  'Hun har feber'
].forEach(function (tekst) {
  t.test(tekst + ' → gult', function () {
    t.erLik(A.vurder(tekst).niva, 'gul');
  });
});

t.gruppe('Akutt – hasteport');

t.test('hastegrad «nå» krever port, øvrige ikke', function () {
  t.erSann(A.kreverHasteport('na'));
  t.erUsann(A.kreverHasteport('idag'));
  t.erUsann(A.kreverHasteport('planlagt'));
  t.erUsann(A.kreverHasteport('fast'));
});

t.test('bare et uttrykkelig ja slipper gjennom', function () {
  t.erUsann(A.hasteportStopper('ja'));
  t.erSann(A.hasteportStopper('nei'));
  t.erSann(A.hasteportStopper('vetikke'));
  t.erSann(A.hasteportStopper(null), 'ubesvart skal stoppe');
});

t.test('tom tekst gir ingen vurdering', function () {
  t.erLik(A.vurder('').niva, 'ingen');
  t.erLik(A.vurder(null).niva, 'ingen');
  t.erLik(A.vurder('   ').niva, 'ingen');
});

/* ---------------- helsegrensen i behovsanalysen ----------------
   Etterspørsel skal aldri kunne opprette en helsetjeneste. Disse testene
   finnes fordi «dusje» ikke fanget «dusjing» første gang. */

var B = window.PP_BEHOV;

t.gruppe('Helsegrensen – skal alltid stoppes');

[
  'Hjelp med dusjing', 'Kan dere stelle henne?', 'Trenger hjelp til å bade',
  'Sette på støttestrømper', 'Gi henne medisinene', 'Måle blodtrykket',
  'Løfte henne opp av senga', 'Hjelp på toalettet', 'Skifte bandasje',
  'Sette insulin', 'Gi hunden medisin'
].forEach(function (tekst) {
  t.test(tekst, function () {
    t.erLik(B.klassifiser(tekst).type, 'over_grensen');
  });
});

t.gruppe('Helsegrensen – skal ikke stoppes');

[
  ['Bade hunden', 'dyrepass, ikke stell'],
  ['Stelle katten', 'dyrepass'],
  ['Lufte hunden', 'dyrepass'],
  ['Klippe plenen', 'hage'],
  ['Måke snø', 'sesong'],
  ['Får ikke wifi til å virke', 'data']
].forEach(function (rad) {
  t.test(rad[0] + ' (' + rad[1] + ')', function () {
    t.erUsann(B.klassifiser(rad[0]).type === 'over_grensen');
  });
});

t.gruppe('Behovsanalyse');

t.test('etterspørsel over helsegrensen blir aldri et forslag', function () {
  var r = B.analyser([
    { tekst: 'Gi henne medisinene', kunde: 'a' }, { tekst: 'Gi henne medisinene', kunde: 'b' },
    { tekst: 'Gi henne medisinene', kunde: 'c' }, { tekst: 'Gi henne medisinene', kunde: 'd' },
    { tekst: 'Gi henne medisinene', kunde: 'e' }
  ], []);
  t.erLik(r.forslag.length, 0, 'fem forespørsler skal ikke gi et forslag');
  t.erLik(r.overGrensen.length, 5);
});

t.test('én kunde som spør ofte er ikke et modent behov', function () {
  var r = B.analyser([
    { tekst: 'Klippe plenen', kunde: 'Ingrid' }, { tekst: 'Klippe plenen', kunde: 'Ingrid' },
    { tekst: 'Klippe plenen', kunde: 'Ingrid' }, { tekst: 'Klippe plenen', kunde: 'Ingrid' }
  ], []);
  t.erLik(r.forslag.length, 1);
  t.erUsann(r.forslag[0].moden, 'krever minst to ulike kunder');
});

t.test('kategorier som allerede tilbys foreslås ikke', function () {
  var r = B.analyser([{ tekst: 'Klippe plenen', kunde: 'a' }], ['hage']);
  t.erLik(r.forslag.length, 0);
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


/* ---------------- språkkrav ---------------- */

t.gruppe('Språkkrav');

var SK = window.PP_SPRAKKRAV;
var bekreftetB1 = { sprak: [{ kode: 'nb', niva: 'B1', bekreftetAv: 'leverandor' }] };
var bekreftetB2 = { sprak: [{ kode: 'nb', niva: 'B2', bekreftetAv: 'leverandor' }] };

t.test('B1 holder for grønne oppgaver', function () {
  t.erSann(SK.kanUtfore(bekreftetB1, ['handling', 'samvaer', 'tur'], 'NO').ok);
});

t.test('følge til avtale krever B2', function () {
  var r = SK.kanUtfore(bekreftetB1, ['folge'], 'NO');
  t.erUsann(r.ok);
  t.erLik(r.krever, 'B2');
  t.erSann(r.grunn.indexOf('B2') !== -1);
});

t.test('et besøk følger sin vanskeligste oppgave', function () {
  t.erLik(SK.kravForBesok(['handling', 'folge']).niva, 'B2');
  t.erLik(SK.kravForBesok(['handling', 'samvaer']).niva, 'B1');
});

t.test('nivå leverandøren ikke har bekreftet, teller ikke', function () {
  var r = SK.kanUtfore({ sprak: [{ kode: 'nb', niva: 'C1' }] }, ['handling'], 'NO');
  t.erUsann(r.ok);
  t.erLik(r.kode, 'mangler_bekreftelse');
});

t.test('skandinaviske språk godtas på tvers, men ikke utenfor Skandinavia', function () {
  var svensk = { sprak: [{ kode: 'sv', niva: 'B2', bekreftetAv: 'leverandor' }] };
  t.erSann(SK.kanUtfore(svensk, ['handling'], 'NO').ok);
  t.erSann(SK.kanUtfore(svensk, ['handling'], 'DK').ok);
  t.erUsann(SK.kanUtfore(svensk, ['handling'], 'DE').ok);
  t.erUsann(SK.kanUtfore(svensk, ['handling'], 'IS').ok);
});

t.test('hver oppgave i katalogen har et språkkrav', function () {
  window.PP_BESOK.OPPGAVER.forEach(function (o) {
    t.erSann(!!SK.OPPGAVEKRAV[o.id], 'mangler krav for ' + o.id);
  });
});

t.test('alle land er dekket av en region i utrullingen', function () {
  var dekket = SK.landIRegion('skandinavia').length + SK.landIRegion('norden').length +
               SK.landIRegion('europa').length;
  t.erLik(dekket, Object.keys(SK.LAND).length);
});

t.test('avslag har alltid en begrunnelse som kan vises', function () {
  var r = SK.kanUtfore({ sprak: [] }, ['folge'], 'NO');
  t.erUsann(r.ok);
  t.erSann(r.grunn.length > 20);
});

/* ---------------- agenter ---------------- */

t.gruppe('KI-agenter');

var AG = window.PP_AGENTER;

t.test('åtte kjerneagenter, og en av dem er et menneske', function () {
  t.erLik(AG.kjerne().length, 8);
  t.erLik(AG.agent('operator').autonomi, 'menneske');
});

t.test('grønn oppgave kan behandles automatisk', function () {
  t.erLik(AG.avgjor('kategoriser', 'gronn').autonomi, 'auto');
});

t.test('gul oppgave krever godkjenning', function () {
  t.erLik(AG.avgjor('lukk_gronn', 'gul').autonomi, 'godkjenning');
});

t.test('rød oppgave går alltid til et menneske', function () {
  t.erLik(AG.avgjor('lukk_gronn', 'rod').autonomi, 'menneske');
});

t.test('nød stopper automatikken uansett hva handlingen er', function () {
  AG.AUTOMATISK.forEach(function (h) {
    var r = AG.avgjor(h.id, 'nod');
    t.erLik(r.autonomi, 'menneske', h.id + ' ble ikke stoppet');
    t.erSann(r.nod);
  });
});

t.test('ukjent handling er ikke automatisk', function () {
  t.erLik(AG.avgjor('noe_vi_ikke_har_tenkt_pa', 'gronn').autonomi, 'menneske');
});

t.test('det som krever menneske, blir aldri automatisk', function () {
  AG.KREVER_MENNESKE.forEach(function (h) {
    ['gronn', 'gul', 'rod'].forEach(function (r) {
      t.erLik(AG.avgjor(h.id, r).autonomi, 'menneske', h.id + ' ved ' + r);
    });
  });
});

t.test('beslutningslogg uten alle sju felt avvises', function () {
  var kastet = false;
  try { AG.loggpost({ agent: 'plan', grunnlag: ['dato'] }); } catch (e) { kastet = true; }
  t.erSann(kastet);
});

t.test('fullstendig beslutningslogg får tidsstempel', function () {
  var p = AG.loggpost({ agent: 'plan', grunnlag: ['dato'], sikkerhet: 0.9,
    regel: 'AUTOMATISK.ledig', godkjenning: false, endretAv: null, melding: 'Satt til torsdag' });
  t.erSann(typeof p.tid === 'string' && p.tid.length > 10);
  AG.LOGGFELT.forEach(function (f) { t.erSann(p[f] !== undefined, 'mangler ' + f); });
});

/* ---------------- personvern ---------------- */

t.gruppe('Personvern i fritekst');

var V = window.PP_VERN;

t.test('vanlig beskjed slipper gjennom', function () {
  t.erSann(V.sjekk('Varene er satt på plass. Vi gikk en runde rundt kvartalet.').ok);
  t.erSann(V.sjekk('').ok);
});

t.test('helseopplysninger stoppes', function () {
  ['ga henne en tablett', 'blodtrykket var høyt', 'ny resept fra fastlegen',
   'såret ser bedre ut'].forEach(function (tekst) {
    t.erUsann(V.sjekk(tekst).ok, 'slapp gjennom: ' + tekst);
  });
});

t.test('bankopplysninger og lange tallrekker stoppes', function () {
  t.erUsann(V.sjekk('bruk bankid-en hennes').ok);
  t.erUsann(V.sjekk('fnr 01019512345').ok);
  t.erUsann(V.sjekk('kontonr 1234 56 78903').ok);
});

t.test('telefonnummer er ikke en lang tallrekke', function () {
  t.erSann(V.sjekk('ring 90112233 hvis noe').ok);
});

t.test('det blokkerte innholdet lagres ikke i loggen', function () {
  var r = V.sjekk('ga henne insulin klokka ti');
  t.erUsann(r.ok);
  t.erSann(r.logglinje.indexOf('insulin') === -1);
  t.erSann(r.logglinje.indexOf('helse') !== -1);
});

t.test('sperren sier hva man skal skrive i stedet', function () {
  t.erSann(V.sjekk('hun har vondt i ryggen').beskjed.length > 20);
});

t.test('et fall blir vist videre til kontoret, ikke bare avvist', function () {
  var r = V.sjekk('hun falt på badet men klarte seg');
  t.erUsann(r.ok);
  t.erLik(r.funn[0].id, 'haster');
  t.erSann(r.beskjed.indexOf('følge opp') !== -1);
  t.erSann(r.beskjed.indexOf('113') !== -1);
});

t.test('utfallet sperren peker på, finnes faktisk', function () {
  t.erSann(!!window.PP_BESOK.UTFALL.oppfolging);
  t.erSann(!!window.PP_BESOK.UTFALL.kontakt_familie);
});

t.test('arbeiderlenken slettes etter tolv timer', function () {
  var f = V.slettesEtter('lenke', '2026-08-20T10:00:00.000Z');
  t.erLik(f, '2026-08-20T22:00:00.000Z');
});

t.test('familiemeldingens innhold har null dagers frist', function () {
  t.erLik(V.FRISTER.melding.dager, 0);
});

t.test('hvert lagret felt har et behandlingsgrunnlag og en frist', function () {
  V.LAGRES.forEach(function (l) {
    t.erSann(!!l.grunnlag, l.felt + ' mangler grunnlag');
    t.erSann(!!V.FRISTER[l.frist], l.felt + ' viser til en frist som ikke finnes');
  });
});

/* ---------------- behovsplattform ---------------- */

t.gruppe('Behovsplattformen husker ikke');

t.test('analysen returnerer tall, ikke tekst eller kunde', function () {
  var r = window.PP_BEHOV.analyser([
    { tekst: 'kan noen klippe plenen', dato: '2026-08-03', kunde: 'K1' },
    { tekst: 'hjelp med hagen', dato: '2026-08-11', kunde: 'K2' },
    { tekst: 'plenen igjen', dato: '2026-08-19', kunde: 'K1' },
    { tekst: 'mor trenger hjelp med medisiner', dato: '2026-08-05', kunde: 'K3' }
  ], ['handling']);
  var ut = JSON.stringify(r);
  t.erSann(ut.indexOf('plenen') === -1, 'fritekst fulgte med ut');
  t.erSann(ut.indexOf('K1') === -1, 'kundeidentifikator fulgte med ut');
  t.erLik(r.forslag[0].antall, 3);
  t.erLik(r.forslag[0].antallKunder, 2);
  t.erSann(r.forslag[0].moden);
});

t.test('bare måned, ikke dato, følger med ut', function () {
  var r = window.PP_BEHOV.analyser([
    { tekst: 'mor trenger medisiner', dato: '2026-08-05', kunde: 'K3' }
  ], []);
  t.erLik(r.overGrensen[0].maaned, '2026-08');
  t.erSann(r.overGrensen[0].dato === undefined);
});


/* ---------------- sletting ---------------- */

t.gruppe('Besøket krymper');

var demobesok = {
  id: 'B-1001', kunde: 'Ingrid', oppgaver: ['handling', 'tur'], dato: '2026-08-20',
  tid: '14:00', ansattId: 'A-1', ansattNavn: 'Sofia H.',
  parorendeEpost: 'datter@epost.no', notat: 'Ring på hos naboen',
  token: 'abc123', status: 'fullfort',
  opprettet: '2026-08-20T09:00:00.000Z', utloper: '2026-08-20T21:00:00.000Z',
  fullfortTid: '2026-08-20T15:12:00.000Z',
  rapport: { utfall: 'utfort', sjekkliste: ['handling', 'tur'],
             kommentar: 'Varene er satt på plass', sekunder: 2400 }
};

function etter(tid) { return V.krymp(demobesok, tid).besok; }

t.test('lenken forsvinner etter tolv timer', function () {
  t.erSann(etter('2026-08-20T20:00:00.000Z').token !== undefined);
  t.erLik(etter('2026-08-21T04:00:00.000Z').token, undefined);
});

t.test('all fritekst er borte etter en uke', function () {
  var b = etter('2026-08-28T15:12:00.000Z');
  t.erLik(b.notat, undefined);
  t.erLik(b.rapport.kommentar, undefined);
  t.erSann(b.kunde !== undefined, 'navnet skulle ikke være borte ennå');
});

t.test('navn og kontaktpunkt er borte etter en måned', function () {
  var b = etter('2026-09-29T15:12:00.000Z');
  t.erLik(b.kunde, undefined);
  t.erLik(b.parorendeEpost, undefined);
  t.erLik(b.ansattNavn, undefined);
});

t.test('etter et år står ingenting igjen som peker på et menneske', function () {
  var b = etter('2027-09-24T15:12:00.000Z');
  var ut = JSON.stringify(b);
  ['Ingrid', 'Sofia', 'datter@epost.no', 'A-1', 'B-1001', 'abc123', 'naboen'].forEach(function (spor) {
    t.erSann(ut.indexOf(spor) === -1, spor + ' overlevde');
  });
  t.erLik(b.dato, '2026-08');
  t.erLik(b.rapport.utfall, 'utfort');
});

t.test('eksakt dato kortes til måned, ikke bare navnet fjernes', function () {
  t.erSann(etter('2027-09-24T15:12:00.000Z').dato.length === 7);
});

t.test('krympingen rører ikke originalen', function () {
  V.krymp(demobesok, '2027-09-24T15:12:00.000Z');
  t.erLik(demobesok.kunde, 'Ingrid');
  t.erLik(demobesok.rapport.kommentar, 'Varene er satt på plass');
});

t.test('et besøk som aldri ble fullført, krymper fra det ble opprettet', function () {
  var glemt = { opprettet: '2026-08-20T09:00:00.000Z', kunde: 'Ingrid', token: 'x',
                rapport: {} };
  t.erLik(V.krymp(glemt, '2026-10-01T09:00:00.000Z').besok.kunde, undefined);
});

t.test('trinnene kommer i rekkefølge og har hver sin begrunnelse', function () {
  V.SLETTEPLAN.forEach(function (steg, i) {
    t.erLik(steg.steg, i + 1);
    t.erSann(steg.hvorfor.length > 20, 'trinn ' + steg.steg + ' mangler begrunnelse');
    t.erSann(steg.fjerner.length > 0);
  });
});

t.test('lovpålagte frister er skilt fra besøksdata', function () {
  t.erSann(V.LOVPALAGT.length >= 3);
  V.LOVPALAGT.forEach(function (l) {
    t.erSann(!!l.hjemmel, l.hva + ' mangler hjemmel');
    t.erSann(l.gjelder === 'Naviar' || l.gjelder === 'Leverandøren');
  });
  /* Femårsregelen treffer fakturaer, ikke besøk. Blandes de, lagrer man alt i
     fem år for sikkerhets skyld – og det er nettopp feilen. */
  var femaar = V.LOVPALAGT.filter(function (l) { return l.frist.indexOf('5 år') === 0; });
  femaar.forEach(function (l) { t.erSann(l.hva.toLowerCase().indexOf('faktura') !== -1); });
});


/* ---------------- klagekanal ---------------- */

t.gruppe('Klagefrister');

var KL = window.PP_KLAGE;
var torsdag = '2026-08-20T14:00:00.000Z';   /* torsdag */
var fredag  = '2026-08-21T14:00:00.000Z';

t.test('mistanke om overgrep har ingen behandlingstid', function () {
  var r = KL.motta({ kategori: 'overgrep', mottatt: torsdag });
  t.erLik(r.frist, torsdag);
  t.erSann(r.stopper);
  t.erSann(r.hjemmel.indexOf('196') !== -1);
});

t.test('72-timersfristen bryr seg ikke om helg', function () {
  var r = KL.motta({ kategori: 'personvernbrudd_tilsyn', mottatt: fredag });
  t.erLik(r.frist, '2026-08-24T14:00:00.000Z');   /* mandag, ikke onsdag */
});

t.test('vi melder til leverandøren, ikke til Datatilsynet', function () {
  t.erLik(KL.kategori('personvernbrudd_leverandor').til, 'Leverandøren (behandlingsansvarlig)');
  t.erSann(KL.kategori('personvernbrudd_tilsyn').til.indexOf('Datatilsynet') !== -1);
});

t.test('innsyn er én måned, og forlengelsen krever et varsel', function () {
  var r = KL.motta({ kategori: 'innsyn', mottatt: torsdag });
  t.erLik(r.frist, '2026-09-19T14:00:00.000Z');
  t.erSann(!!r.forlengetTil);
  t.erSann(r.forlengVilkar.indexOf('INNEN den første måneden') !== -1);
});

t.test('våre egne frister regnes i virkedager', function () {
  /* Fredag + 1 virkedag er mandag, ikke lørdag. */
  t.erLik(KL.leggTilVirkedager(fredag, 1).slice(0, 10), '2026-08-24');
  t.erLik(KL.leggTilVirkedager(torsdag, 1).slice(0, 10), '2026-08-21');
});

t.test('ukjent kategori går til et menneske og stopper automatikken', function () {
  var r = KL.motta({ kategori: 'noe_vi_ikke_har', mottatt: torsdag });
  t.erLik(r.kategori, 'ukjent');
  t.erSann(r.stopper);
});

t.test('lovfrister er merket som lovfrister', function () {
  ['overgrep', 'personvernbrudd_leverandor', 'personvernbrudd_tilsyn',
   'personvernbrudd_berort', 'innsyn'].forEach(function (id) {
    t.erLik(KL.kategori(id).mot, 'lov', id);
    t.erSann(!!KL.kategori(id).hjemmel, id + ' mangler hjemmel');
  });
  ['misbruk', 'skade', 'medarbeider', 'tjeneste'].forEach(function (id) {
    t.erLik(KL.kategori(id).mot, 'egen', id);
  });
});

t.test('statusen varsler før fristen ryker, ikke etterpå', function () {
  t.erLik(KL.status('2026-08-24T14:00:00Z', '2026-08-24T11:00:00Z').niva, 'kritisk');
  t.erLik(KL.status('2026-08-24T14:00:00Z', '2026-08-24T02:00:00Z').niva, 'nær');
  t.erLik(KL.status('2026-08-24T14:00:00Z', '2026-08-20T14:00:00Z').niva, 'god');
  t.erLik(KL.status('2026-08-24T14:00:00Z', '2026-08-25T14:00:00Z').niva, 'oversittet');
});

t.gruppe('Misbruk av stillingen');

t.test('misbruk stopper automatikken og går til politiet', function () {
  var r = KL.motta({ kategori: 'misbruk', mottatt: torsdag });
  t.erSann(r.stopper);
  t.erSann(r.til.indexOf('politiet') !== -1);
  t.erLik(r.frist, torsdag);
});

t.test('anmeldelse ved tyveri er vår regel, ikke en lovpålagt plikt', function () {
  var k = KL.kategori('misbruk');
  t.erLik(k.hjemmel, null);
  t.erLik(k.mot, 'egen');
  t.erSann(k.ikkeAvvergingsplikt.indexOf('196') !== -1);
});

t.test('ved vold eller mishandling i omsorg blir det en plikt', function () {
  var k = KL.kategori('misbruk');
  t.erSann(k.naarDetBlirPlikt.indexOf('196') !== -1);
  t.erSann(k.naarDetBlirPlikt.indexOf('taushetsplikt') !== -1);
});

t.test('medarbeidervarselet finnes på alle språkene vi tilbyr', function () {
  window.PP_SPRAK.SPRAK.forEach(function (s) {
    t.erSann(!!KL.MEDARBEIDERVARSEL[s.kode], 'mangler ' + s.kode);
  });
  t.erLik(Object.keys(KL.MEDARBEIDERVARSEL).length, window.PP_SPRAK.SPRAK.length);
});

t.test('varselet sier både hva som er forbudt og at det å si fra er trygt', function () {
  Object.keys(KL.MEDARBEIDERVARSEL).forEach(function (kode) {
    t.erSann(KL.MEDARBEIDERVARSEL[kode].length > 100, kode + ' er for kort til å si alt');
  });
  var nb = KL.medarbeidervarsel('nb');
  t.erSann(nb.indexOf('politiet') !== -1);
  t.erSann(nb.indexOf('aldri følger for deg') !== -1);
});

t.test('ukjent språkkode faller tilbake til norsk', function () {
  t.erLik(KL.medarbeidervarsel('xx'), KL.medarbeidervarsel('nb'));
});


/* ---------------- abonnement ----------------

   Modulen hadde ingen dekning: ingen side laster den, ingen test krevde den.
   Den holder likevel en juridisk grense – sperren mot å ta betalt fra
   familien – og en grense uten test er en grense som forsvinner stille. */

t.gruppe('Abonnement og betalingsstrømmer');

var AB = window.PP_ABONNEMENT;

t.test('bare leverandørstrømmen er aktiv', function () {
  t.erSann(AB.STROMMER.leverandor.aktiv);
  t.erUsann(AB.STROMMER.familie.aktiv, 'familiebetaling er slått på');
  t.erUsann(AB.STROMMER.mellom.aktiv, 'betaling mellom familie og hjelper er slått på');
});

t.test('hver sperret strøm sier hvorfor den er sperret', function () {
  ['familie', 'mellom'].forEach(function (k) {
    t.erSann((AB.STROMMER[k].sperre || '').length > 30, k + ' mangler begrunnelse');
  });
});

t.test('familiesperren nevner forbrukerfølgene, ikke bare løftet', function () {
  var g = AB.STROMMER.familie.sperre;
  t.erSann(/angrerett/i.test(g), 'nevner ikke angrerett: ' + g);
});

t.test('mellomsperren viser til det juridiske punktet', function () {
  t.erSann(/J11/.test(AB.STROMMER.mellom.sperre));
});

t.test('begge planene finnes og har pris', function () {
  ['pilot', 'standard'].forEach(function (id) {
    var p = AB.plan(id);
    t.erSann(!!p, 'mangler plan: ' + id);
    t.erSann(p.pris > 0);
  });
  t.erLik(AB.plan('finnes-ikke'), null);
});

t.test('piloten stopper av seg selv', function () {
  var p = AB.plan('pilot');
  t.erLik(p.periode, 'engangs');
  t.erSann(p.dager > 0, 'piloten har ingen sluttdato');
});

t.test('mva er ikke avklart, og fakturaen sier det i stedet for å gjette', function () {
  t.erUsann(AB.MVA.avklart);
  var f = AB.faktura({ plan: 'standard', start: '2026-09-01' });
  t.erLik(f.mva, null, 'fakturaen oppgir en mva-sats vi ikke har avklart');
  t.erSann((f.note || '').length > 20, 'ingen forklaring på manglende mva');
});

t.test('fakturaen summerer til planens pris', function () {
  var f = AB.faktura({ plan: 'standard', start: '2026-09-01' });
  var sum = f.linjer.reduce(function (a, l) { return a + l.belop; }, 0);
  t.erLik(sum, f.sum);
  t.erLik(f.sum, AB.plan('standard').pris);
});

t.test('status uten abonnement er ikke en feil', function () {
  t.erLik(AB.status(null).kode, 'ingen');
});

t.test('utløpt pilot vises som utløpt', function () {
  var i_gar = new Date(Date.now() - 86400000).toISOString();
  t.erLik(AB.status({ plan: 'pilot', slutt: i_gar }).kode, 'utlopt');
});

t.test('beløp formateres med mellomrom, ikke komma', function () {
  t.erLik(AB.formater(1490), '1 490 kr');
  t.erLik(AB.formater(990), '990 kr');
});

/* ---------------- kvalitet ---------------- */

t.gruppe('Kvalitet og kontinuitet');

var KV = window.PP_KVALITET;

function fullfort(kunde, navn, utfall, tilfredshet) {
  return { kunde: kunde, ansattNavn: navn, ansattId: navn, status: 'fullfort',
           rapport: { utfall: utfall || 'utfort' }, tilfredshet: tilfredshet };
}

t.test('spørsmålet finnes på flere språk og faller tilbake til norsk', function () {
  t.erSann(KV.sporsmal('nb', 'Omsorg AS').tittel.length > 0);
  t.erSann(KV.sporsmal('tr', 'Omsorg AS').tittel.length > 0);
  t.erLik(KV.sporsmal('xx', 'Omsorg AS').tittel, KV.sporsmal('nb', 'Omsorg AS').tittel);
});

t.test('firmanavnet settes inn i hjelpeteksten', function () {
  t.erSann(KV.sporsmal('nb', 'Omsorg AS').hjelp.indexOf('Omsorg AS') !== -1);
});

t.test('bare fullførte besøk telles', function () {
  var liste = [fullfort('Ingrid', 'Sofia'), { kunde: 'Ingrid', ansattNavn: 'Sofia', status: 'planlagt' }];
  var st = KV.perMedarbeider(liste);
  t.erLik(st.length, 1);
  t.erLik(st[0].besok, 1);
});

t.test('under tre besøk gir ingen konklusjon om en person', function () {
  var liste = [fullfort('Ingrid', 'Sofia', 'utfort', 'bra'), fullfort('Ingrid', 'Sofia', 'utfort', 'bra')];
  t.erLik(KV.forslag(KV.perMedarbeider(liste)).length, 0, 'konkluderte på to besøk');
});

t.test('den som kjenner kunden fra før, foreslås først', function () {
  var liste = [fullfort('Ingrid', 'Sofia'), fullfort('Ingrid', 'Sofia'), fullfort('Ingrid', 'Sofia')];
  var f = KV.foreslaaMedarbeider('Ingrid', liste, [
    { id: 'Anna', navn: 'Anna' }, { id: 'Sofia', navn: 'Sofia' }
  ]);
  t.erLik(f[0].navn, 'Sofia', 'kontinuitet tapte mot en fremmed');
  t.erSann(f[0].kjenner);
  t.erSann(f[0].grunner.length > 0, 'ingen begrunnelse vist');
});

t.test('en fremmed foreslås fortsatt når ingen kjenner kunden', function () {
  var f = KV.foreslaaMedarbeider('Ny Kunde', [], [{ id: 'Anna', navn: 'Anna' }]);
  t.erLik(f.length, 1);
  t.erUsann(f[0].kjenner);
});

t.test('svarverdiene er tre, ikke en terning', function () {
  t.erLik(Object.keys(KV.VERDI).length, 3);
  t.erLik(KV.VERDI.bra, 2);
  t.erLik(KV.VERDI.ikke, 0);
});


/* ---------------- før lansering ----------------

   Domenet er kjøpt, men produktet skal ikke ut før det er bestemt. Disse
   testene holder den beslutningen fast, slik at ingen går live ved et uhell.
   Ved lansering skal de tre første feile - da er det tid for å endre dem. */

t.gruppe('Ikke publisert ennå');

var fs = require('fs');
var sti = require('path');
var ROT = sti.join(__dirname, '..');
function les(f) { return fs.readFileSync(sti.join(ROT, f), 'utf8'); }

t.test('robots.txt stenger alt', function () {
  var r = les('robots.txt');
  var linjer = r.split('\n').filter(function (l) { return l.trim() && l.trim()[0] !== '#'; });
  t.erSann(linjer.some(function (l) { return /^Disallow:\s*\/\s*$/.test(l.trim()); }),
           'robots.txt slipper noe gjennom: ' + linjer.join(' | '));
});

t.test('landingssiden er merket noindex', function () {
  t.erSann(/name="robots"\s+content="noindex/.test(les('besok/index.html')),
           'landingssiden kan indekseres');
});

t.test('appskjermene er noindex, uansett lansering', function () {
  ['logg-inn', 'nytt', 'oversikt', 'historikk', 'utfor'].forEach(function (n) {
    t.erSann(/name="robots"\s+content="noindex/.test(les('besok/' + n + '.html')),
             n + '.html mangler noindex');
  });
});

t.test('sitemap peker bare på landingssiden', function () {
  var s = les('sitemap.xml');
  var loc = (s.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (m) {
    return m.replace(/<\/?loc>/g, '');
  });
  t.erLik(loc.length, 1);
  /* Bare adressene teller - kommentaren over dem forklarer nettopp hvorfor
     appskjermene holdes utenfor, og skal ikke felle testen. */
  t.erSann(loc.every(function (u) { return u.indexOf('/besok/') === -1; }),
           'sitemap eksponerer appskjermene: ' + loc.join(', '));
  t.erSann(s.indexOf('sitemaps.org/schemas/sitemap/0.9') !== -1, 'feil navnerom');
});

t.test('delingsbildet finnes og er 1200x630', function () {
  var b = fs.readFileSync(sti.join(ROT, 'assets/img/naviar-og.png'));
  /* PNG: bredde og høyde ligger som 32-bit big endian fra byte 16 */
  t.erLik(b.readUInt32BE(16), 1200);
  t.erLik(b.readUInt32BE(20), 630);
});

t.test('alle ikonfilene som meta-taggene lover, finnes', function () {
  ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png',
   'android-chrome-192x192.png', 'android-chrome-512x512.png', 'naviar-og.png'
  ].forEach(function (f) {
    t.erSann(fs.existsSync(sti.join(ROT, 'assets/img', f)), 'mangler ' + f);
  });
});

t.test('canonical og og:url peker på samme domene', function () {
  var h = les('besok/index.html');
  var c = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  var o = (h.match(/property="og:url" content="([^"]+)"/) || [])[1];
  t.erLik(c, o);
  t.erSann(/^https:\/\/naviarcare\.com\//.test(c || ''), 'uventet domene: ' + c);
});

t.gruppe('Logoen');

t.test('alle fem logofilene finnes og er gyldig XML', function () {
  ['naviar-care-logo.svg', 'naviar-care-logo-blekk.svg', 'naviar-care-logo-negativ.svg',
   'naviar-care-ordmerke.svg', 'naviar-care-logo-staaende.svg', 'naviar-mark.svg'
  ].forEach(function (f) {
    var s = fs.readFileSync(sti.join(ROT, 'assets/img', f), 'utf8');
    t.erSann(/^<svg[\s\S]*<\/svg>\s*$/.test(s), f + ' er ikke en hel SVG');
    /* To bindestreker etter hverandre er ulovlig inne i en XML-kommentar.
       Det var feilen som gjorde de første filene uleselige for nettleseren. */
    (s.match(/<!--[\s\S]*?-->/g) || []).forEach(function (k) {
      t.erUsann(k.slice(4, -3).indexOf('--') !== -1, f + ' har -- inne i en kommentar');
    });
  });
});

t.test('merket er ett hull, ikke en gjennomsiktig flate oppå', function () {
  /* Opasitet finnes ikke i ett trykkfarge, og ved 16 px blir 45 % en grå
     klump i stedet for en strek. Regelen holdes her så den ikke kan snike
     seg inn igjen neste gang noen tegner om merket. */
  ['naviar-care-logo.svg', 'naviar-care-logo-blekk.svg', 'naviar-care-logo-negativ.svg',
   'naviar-care-logo-staaende.svg', 'naviar-mark.svg'
  ].forEach(function (f) {
    var s = fs.readFileSync(sti.join(ROT, 'assets/img', f), 'utf8');
    t.erUsann(/opacity/.test(s), f + ' bruker opacity');
    t.erSann(/fill-rule="evenodd"/.test(s), f + ' mangler utsparingen');
  });
});

t.test('sidene bruker samme merke som logofilene', function () {
  fs.readdirSync(ROT).filter(function (f) { return /\.html$/.test(f); })
    .map(function (f) { return f; })
    .concat(fs.readdirSync(sti.join(ROT, 'besok')).filter(function (f) {
      return /\.html$/.test(f);
    }).map(function (f) { return 'besok/' + f; }))
    .forEach(function (f) {
      var h = les(f);
      /* Merket finnes to steder på hver side: innfelt SVG i topplinja, og som
         data-URI i favicon-lenka. De har ulike banedata, så et søk etter den
         ene formen fanger ikke den andre. Her sjekkes bandet i seg selv. */
      t.erUsann(/opacity=["'][.]45["']/.test(h), f + ' har det gamle bandet');
      if (h.indexOf('M16 3.2 3.4 28.8') !== -1) {
        t.erSann(/fill-rule="evenodd"/.test(h), f + ' mangler utsparingen i topplinja');
      }
      if (h.indexOf('M16 6.4 6.2 26.4') !== -1) {
        t.erSann(/fill-rule='evenodd'/.test(h), f + ' mangler utsparingen i favicon-lenka');
      }
    });
});

t.test('currentColor-utgaven arver farge, de faste gjør det ikke', function () {
  var arver = fs.readFileSync(sti.join(ROT, 'assets/img/naviar-care-logo.svg'), 'utf8');
  t.erSann(/fill="currentColor"/.test(arver), 'logoen arver ikke farge');
  var blekk = fs.readFileSync(sti.join(ROT, 'assets/img/naviar-care-logo-blekk.svg'), 'utf8');
  var sand = fs.readFileSync(sti.join(ROT, 'assets/img/naviar-care-logo-negativ.svg'), 'utf8');
  t.erSann(/fill="#101a2e"/.test(blekk), 'blekkutgaven har feil farge');
  t.erSann(/fill="#fbf6ee"/.test(sand), 'negativutgaven har feil farge');
});

t.gruppe('Prisen på siden');

t.test('landingssiden oppgir ingen pris før den er testet', function () {
  /* Prisen skal settes etter de ti betalende pilotene, ikke fra et regneark.
     Til den er satt, skal ingen tall stå på siden: et tall som er ute, er
     vanskeligere å heve enn et tall som aldri ble sagt. Testen holder det
     fast, så prisen ikke sniker seg inn igjen fra en gammel utgave. */
  var h = les('besok/index.html');
  var pris = h.slice(h.indexOf('<section id="pris"'));
  pris = pris.slice(0, pris.indexOf('</section>'));
  var tall = pris.match(/\b\d{3,4}\s*kr\b/g);
  t.erUsann(!!tall, 'pris på siden: ' + (tall || []).join(', '));
});

t.gruppe('Opptak av medarbeidere');

var HO = window.PP_HJELPER;

function ferdigHjelper(endringer) {
  var h = { arbeidsforhold: 'ansatt', soknad: true, identitet: true, status: true,
            referanse: true, intervju: true, opplaering: true, proveoppdrag: true,
            proveperiode: true, prove: 90, taushetsavtale: true };
  return Object.assign(h, endringer || {});
}

t.test('ingen kan aktiveres før arbeidsforholdet er avklart', function () {
  /* Porten som står før alt annet. Setter vi pris, definerer oppdrag, lærer
     opp og kan stenge profilen, avgjøres statusen av det reelle forholdet -
     ikke av hva avtalen kalles. Da kan ikke opptaket åpne først. */
  t.erUsann(HO.ARBEIDSFORHOLD.avklart);
  var r = HO.kanAktiveres(ferdigHjelper());
  t.erUsann(r.ok);
  t.erSann(r.mangler.join(' ').indexOf('arbeidsforholdet') !== -1, r.mangler.join(', '));
});

t.test('styrt frilans er ikke en gyldig modell', function () {
  t.erLik(HO.ARBEIDSFORHOLD.avvist.id, 'styrt_frilans');
  var r = HO.kanAktiveres(ferdigHjelper({ arbeidsforhold: 'styrt_frilans' }));
  t.erUsann(r.ok);
});

t.test('hvert manglende trinn navngis', function () {
  var r = HO.kanAktiveres(ferdigHjelper({ referanse: false, opplaering: false }));
  var tekst = r.mangler.join(' ');
  t.erSann(tekst.indexOf('referanser') !== -1, tekst);
  t.erSann(tekst.indexOf('opplæring') !== -1, tekst);
});

t.test('prøven må være bestått med terskelen', function () {
  t.erLik(HO.PROVE.terskel, 85);
  var r = HO.kanAktiveres(ferdigHjelper({ prove: 84 }));
  t.erSann(r.mangler.join(' ').indexOf('prøven') !== -1);
});

t.test('ett farlig svar stopper opptaket, uansett poengsum', function () {
  /* En sum kan skjule det ene svaret som betyr noe. */
  var svar = {};
  HO.SCENARIER.forEach(function (s) { svar[s.id] = true; });
  svar.bankid = false;
  var r = HO.vurderIntervju(svar);
  t.erUsann(r.ok);
  t.erSann(r.poeng >= 85, 'poeng: ' + r.poeng);
  t.erSann(r.kritiskeFeil.indexOf('bankid') !== -1);
});

t.test('en ikke-kritisk feil felles ikke alene', function () {
  var svar = {};
  HO.SCENARIER.forEach(function (s) { svar[s.id] = true; });
  svar.tungt = false;
  t.erSann(HO.vurderIntervju(svar).ok);
});

t.test('politiattest kan ikke kreves uten hjemmel', function () {
  /* Verre å love enn å la være: sier vi at alle er kontrollert av politiet,
     har vi gitt en garanti vi ikke kan holde. */
  t.erUsann(HO.POLITIATTEST.kanKreves);
  t.erSann(HO.POLITIATTEST.hvorfor.indexOf('hjemmel') !== -1);
});

t.test('legitimasjon bekreftes, den arkiveres ikke', function () {
  t.erSann(HO.IDENTITET.lagres.indexOf('bekreftet') !== -1);
  ['kopi av legitimasjon', 'fødselsnummer'].forEach(function (f) {
    t.erSann(HO.IDENTITET.lagresAldri.indexOf(f) !== -1, 'mangler: ' + f);
  });
  HO.IDENTITET.lagres.forEach(function (f) {
    t.erUsann(HO.IDENTITET.lagresAldri.indexOf(f) !== -1, f + ' står begge steder');
  });
});

t.test('personlige egenskaper er aldri et kriterium', function () {
  ['alder', 'opprinnelse', 'kjønn'].forEach(function (k) {
    t.erSann(HO.IKKE_KRITERIUM.indexOf(k) !== -1, 'mangler: ' + k);
  });
});

t.test('et vanlig oppdrag fra katalogen går automatisk', function () {
  var r = HO.risikoFor('samvaer', 'Kaffe og en prat', {});
  t.erLik(r.niva, 'gronn');
  t.erLik(r.handling, 'automatisk');
});

t.test('oppgave utenfor katalogen avvises', function () {
  t.erLik(HO.risikoFor('stell', '', {}).niva, 'rod');
});

t.test('fritekst om medisin gjør oppdraget rødt', function () {
  var r = HO.risikoFor('samvaer', 'Hun trenger hjelp med medisinen sin', {});
  t.erLik(r.niva, 'rod');
  t.erLik(r.handling, 'avvises');
});

t.test('fritekst om fall stopper oppdraget i stedet for å avvise det', function () {
  /* Det som haster skal meldes, ikke skrives - og ikke bare avvises. */
  var r = HO.risikoFor('samvaer', 'Hun har falt på badet', {});
  t.erLik(r.niva, 'nod');
  t.erLik(r.handling, 'stopp');
});

t.test('første besøk krever menneskelig godkjenning', function () {
  var r = HO.risikoFor('samvaer', '', { forste_besok: true });
  t.erLik(r.niva, 'gul');
  t.erLik(r.handling, 'operator');
});

t.test('permanent stenging kan ikke skje automatisk', function () {
  t.erSann(HO.STENGING.permanent.indexOf('menneskelig') !== -1);
  t.erSann(HO.STENGING.permanent.indexOf('aldri automatisk') !== -1);
});

t.test('de fire hendelsesnivåene har en handling hver', function () {
  ['P0', 'P1', 'P2', 'P3'].forEach(function (n) {
    var h = HO.hendelse(n);
    t.erSann(h && h.gjor.length > 10, 'mangler handling for ' + n);
  });
});

t.test('prøven har tjue spørsmål, fire per modul', function () {
  t.erLik(HO.PROVESPORSMAL.length, HO.PROVE.antall);
  [1, 2, 3, 4, 5].forEach(function (m) {
    var n = HO.PROVESPORSMAL.filter(function (s) { return s.modul === m; }).length;
    t.erLik(n, 4);
  });
});

t.test('hvert spørsmål har et gyldig fasitsvar og en begrunnelse', function () {
  /* Begrunnelsen er ikke pynt. Regelen som står uten grunn, blir borte
     hos den neste som synes den er i veien. */
  HO.PROVESPORSMAL.forEach(function (s) {
    t.erSann(s.valg.length >= 3, 'spørsmål ' + s.nr + ' har for få valg');
    t.erSann(s.riktig >= 0 && s.riktig < s.valg.length, 'spørsmål ' + s.nr + ' peker utenfor');
    t.erSann(s.hvorfor && s.hvorfor.length > 20, 'spørsmål ' + s.nr + ' mangler begrunnelse');
  });
});

t.test('spørsmålsnumrene er sammenhengende', function () {
  HO.PROVESPORSMAL.forEach(function (s, i) { t.erLik(s.nr, i + 1); });
});

t.test('de farlige situasjonene er merket kritiske', function () {
  var kritiske = HO.PROVESPORSMAL.filter(function (s) { return s.kritisk; })
    .map(function (s) { return s.nr; });
  [9, 10, 13, 18, 19].forEach(function (nr) {
    t.erSann(kritiske.indexOf(nr) !== -1, 'spørsmål ' + nr + ' burde vært kritisk');
  });
});

t.test('referansesamtalen lagrer konklusjon, ikke referat', function () {
  t.erSann(HO.REFERANSE.kandidatenVet);
  t.erSann(HO.REFERANSE.lagresAldri.indexOf('ordrett referat') !== -1);
  t.erSann(HO.REFERANSE.sporsmal.length >= 4);
  HO.REFERANSE.sporsmal.forEach(function (q) {
    t.erSann(q.indexOf('?') !== -1, 'ikke et spørsmål: ' + q);
  });
});

t.test('prøveoppdraget har både det som vurderes og det som stopper', function () {
  t.erLik(HO.PROVEOPPDRAG.antall, 1);
  t.erSann(HO.PROVEOPPDRAG.vurderes.length >= 4);
  t.erSann(HO.PROVEOPPDRAG.stopper.length >= 3);
});

t.gruppe('Basen over kandidater');

var HB = window.PP_HJELPERBASE;

t.test('hvert felt har både en grunn og en frist', function () {
  /* Samme regel som for besøkene: legger noen til et felt, må de si hvorfor
     det finnes og når det forsvinner. */
  HB.FELT.forEach(function (f) {
    t.erSann(f.hvorfor && f.hvorfor.length > 10, f.id + ' mangler begrunnelse');
    t.erSann(!!f.frist, f.id + ' mangler frist');
    t.erSann(!!HB.FRISTER[f.frist], f.id + ' peker på en frist som ikke finnes: ' + f.frist);
  });
});

t.test('feltene som ikke finnes, har en begrunnelse hver', function () {
  t.erSann(HB.FINNES_IKKE.length >= 10);
  HB.FINNES_IKKE.forEach(function (f) {
    t.erSann(f.hvorfor && f.hvorfor.length > 15, f.hva + ' mangler begrunnelse');
  });
});

t.test('fødselsdato, bilde og legitimasjon finnes ikke som felt', function () {
  ['fodselsdato', 'fodselsnummer', 'adresse', 'bilde', 'legitimasjon', 'sivilstand']
    .forEach(function (id) {
      t.erUsann(!!HB.felt(id), id + ' finnes som felt');
    });
});

t.test('alder spørres som ja eller nei, ikke som dato', function () {
  t.erLik(HB.ALDER.lagres, 'ja/nei');
  t.erLik(HB.ALDER.lagresIkke, 'fødselsdato');
});

t.test('vedlegg tas ikke imot', function () {
  t.erUsann(HB.VEDLEGG.tas_imot);
  t.erSann(HB.VEDLEGG.beskjed.length > 20);
});

t.test('ukjente felter faller bort før lagring, ikke etterpå', function () {
  var r = HB.taImot({ fornavn: 'Sofia', bydel: 'Sagene',
                      fodselsnummer: '01019012345', bilde: 'data:image/png;base64,AAA' });
  t.erSann(r.ok);
  t.erLik(r.kandidat.fornavn, 'Sofia');
  t.erUsann('fodselsnummer' in r.kandidat);
  t.erUsann('bilde' in r.kandidat);
  t.erSann(r.avvist.indexOf('fodselsnummer') !== -1);
  t.erSann(r.avvist.indexOf('bilde') !== -1);
});

t.test('helseopplysning i erfaringsfeltet stopper hele søknaden', function () {
  var r = HB.taImot({ fornavn: 'Lena', erfaring: 'Jobbet med demens og medisinutdeling' });
  t.erUsann(r.ok);
  t.erSann(r.kategorier.indexOf('helse') !== -1, r.kategorier.join(','));
});

t.test('kandidat uten opptak slettes etter fristen', function () {
  var laget = new Date('2026-01-01T09:00:00Z').toISOString();
  var k = { fornavn: 'Ida', status: 'avslag', opprettet: laget };
  t.erUsann(HB.skalSlettes(k, '2026-03-01T09:00:00Z'));
  t.erSann(HB.skalSlettes(k, '2026-05-01T09:00:00Z'));
});

t.test('aktiv medarbeider slettes ikke av basen', function () {
  var k = { fornavn: 'Sofia', status: 'aktiv', opprettet: '2020-01-01T09:00:00Z' };
  t.erUsann(HB.skalSlettes(k, '2026-01-01T09:00:00Z'));
  t.erSann(HB.FRISTER.ansatt.maaAvklares, 'fristen for ansatte skal være merket som uavklart');
});

t.test('ryddingen fjerner det som har gått ut på dato', function () {
  var base = { kandidater: [
    { fornavn: 'A', status: 'avslag', opprettet: '2026-01-01T09:00:00Z' },
    { fornavn: 'B', status: 'ny',     opprettet: '2026-05-01T09:00:00Z' },
    { fornavn: 'C', status: 'aktiv',  opprettet: '2020-01-01T09:00:00Z' }
  ] };
  var etter = HB.rydd(base, '2026-05-10T09:00:00Z');
  t.erLik(etter.kandidater.length, 2);
  t.erUsann(etter.kandidater.some(function (k) { return k.fornavn === 'A'; }));
});

t.test('det går ikke an å søke på noe som ikke gjelder arbeidet', function () {
  /* Feltene finnes ikke, men søket sperrer også - ellers blir en framtidig
     kolonne søkbar bare fordi noen la den til. */
  var base = { kandidater: [{ fornavn: 'A', bydel: 'Sagene' }] };
  t.erLik(HB.sok(base, { bydel: 'Sagene' }).length, 1);
  var feilet = false;
  try { HB.sok(base, { fornavn: 'A' }); } catch (e) { feilet = true; }
  t.erSann(feilet, 'søk på fornavn burde vært sperret');
});

t.gruppe('Målingene');

var ML = window.PP_MALING;

/* Tellere som treffer alle mål med god margin. */
function godePilot(endringer) {
  var t = { gjennomforte: 40, iTide: 38, utenAvvik: 39, klager: 1,
            alvorligeHendelser: 0, antallSvar: 40, sumSvartidTimer: 60,
            antallTilbakemeldinger: 36, sumTilfredshet: 68,
            besokAvFastMedarbeider: 35,
            familierMedMinstEtt: 10, familierMedToEllerFlere: 5 };
  return Object.assign(t, endringer || {});
}

t.test('hvert mål har kilde, tall og begrunnelse', function () {
  t.erLik(ML.MAL.length, 8);
  ML.MAL.forEach(function (m) {
    t.erSann(m.kilde && m.kilde.length > 10, m.id + ' mangler kilde');
    t.erSann(m.hvorfor && m.hvorfor.length > 20, m.id + ' mangler begrunnelse');
    t.erSann(m.retning === 'hoy' || m.retning === 'lav', m.id + ' mangler retning');
  });
});

t.test('status har alltid et ord, ikke bare en farge', function () {
  /* En som ikke skiller farger, skal få den samme beskjeden som alle andre. */
  var m = ML.mal('presis');
  [null, 95, 80, 40].forEach(function (v) {
    var s = ML.status(m, v);
    t.erSann(s.navn && s.navn.length > 5, 'status uten ord for ' + v);
  });
});

t.test('retningen snus for målene der lavt er bra', function () {
  t.erLik(ML.status(ML.mal('klager'), 2).id, 'naadd');
  t.erLik(ML.status(ML.mal('klager'), 20).id, 'under');
  t.erLik(ML.status(ML.mal('presis'), 95).id, 'naadd');
  t.erLik(ML.status(ML.mal('presis'), 40).id, 'under');
});

t.test('null målinger gir «ikke målt», ikke null prosent', function () {
  /* Ingen data og et dårlig resultat er ikke det samme, og skal ikke se likt ut. */
  var v = ML.beregn({ gjennomforte: 0 });
  t.erLik(v.presis, null);
  t.erLik(ML.status(ML.mal('presis'), v.presis).id, 'ukjent');
});

t.test('en god pilot består', function () {
  var d = ML.pilotdom(godePilot());
  t.erSann(d.ok, d.grunn);
  t.erLik(d.kode, 'bestatt');
});

t.test('for få oppdrag gir ingen dom, verken ja eller nei', function () {
  var d = ML.pilotdom(godePilot({ gjennomforte: 12, iTide: 12, utenAvvik: 12 }));
  t.erUsann(d.ok);
  t.erLik(d.kode, 'for_tidlig');
  t.erLik(d.brutt.length, 0);
});

t.test('én alvorlig hendelse stopper piloten', function () {
  /* Det eneste målet der ett er for mange. */
  var d = ML.pilotdom(godePilot({ alvorligeHendelser: 1 }));
  t.erUsann(d.ok);
  t.erSann(d.brutt.indexOf('hendelser') !== -1, d.grunn);
});

t.test('for lav andel samme medarbeider stopper piloten', function () {
  var d = ML.pilotdom(godePilot({ besokAvFastMedarbeider: 20 }));
  t.erUsann(d.ok);
  t.erSann(d.brutt.indexOf('samme') !== -1, d.grunn);
});

t.test('hvert stopp-punkt peker på et mål som finnes', function () {
  ML.STOPPUNKT.forEach(function (p) {
    t.erSann(!!ML.mal(p.id), 'stopp-punkt uten mål: ' + p.id);
    t.erSann(p.gjor && p.gjor.length > 20, p.id + ' mangler en handling');
  });
});

t.test('oversikten viser stopp-punktet bare når målet er langt under', function () {
  var bra = ML.oversikt(godePilot());
  t.erSann(bra.every(function (x) { return !x.stoppunkt; }));
  var daarlig = ML.oversikt(godePilot({ besokAvFastMedarbeider: 20 }));
  var samme = daarlig.filter(function (x) { return x.id === 'samme'; })[0];
  t.erSann(!!samme.stoppunkt, 'stopp-punktet mangler');
  t.erSann(samme.stoppunkt.gjor.length > 20);
});

t.gruppe('Merkespråket');

var MS = window.PP_MERKESPRAK;

t.test('«trygg hjelp» om tjenesten er tillatt på en forside', function () {
  /* Sondringen hele modulen hviler på: «trygg hjelp» sier noe om tjenesten,
     som er avgrenset, utført av en verifisert person og dokumentert. */
  t.erSann(MS.sjekk(MS.KJERNE.nb, 'forside').ok);
});

t.test('«er trygg» om en person er aldri tillatt', function () {
  var r = MS.sjekk('Kari er trygg nå.', 'forside');
  t.erUsann(r.ok);
  t.erLik(r.funn[0].id, 'tilstand');
});

t.test('ordet trygg finnes ikke i en melding om ett besøk', function () {
  /* Her er det ingen avstand igjen mellom tjenesten og mennesket. */
  var r = MS.sjekk('Besøket er utført. Trygg hverdag!', 'familiemelding');
  t.erUsann(r.ok);
  t.erSann(r.funn.some(function (f) { return f.id === 'trygg_i_melding'; }));
  t.erSann(MS.sjekk('Besøket er utført klokka 14.10.', 'familiemelding').ok);
});

t.test('halen må stå på flaten, men ikke i samme setning', function () {
  /* I meldingssystemet er halen skilt ut som en egen tillitssetning rett
     under overskriften. Kravet er flaten, ikke setningen. */
  t.erSann(MS.KJERNE.haleMaaStaaPaaFlaten);
  t.erSann(MS.kjerneErHel(MS.KJERNE.nb));
  t.erSann(MS.kjerneErHel('Trygg hjelp når du ikke kan være der. ' + MS.KJERNE.tillitssetning));
  t.erUsann(MS.kjerneErHel('Trygg hjelp når du ikke kan være der. Kom i gang i dag.'));
  t.erSann(MS.kjerneErHel('Praktisk hverdagshjelp i nærheten.'));
});

t.test('norske bokstaver bryter ikke sperren', function () {
  /* \b bygger på [A-Za-z0-9_]. Sto det etter «på», feilet hele alternativet
     og påstanden slapp gjennom. Testen holder det fast. */
  ['Vi følger med på moren din.', 'Vi passer på henne.',
   'Hjelp til hjelpeløse eldre.', 'Vi driver overvåking av hjemmet.']
    .forEach(function (linje) {
      t.erUsann(MS.sjekk(linje, 'forside').ok, 'slapp gjennom: ' + linje);
    });
  t.erSann(MS.sjekk('Vi handler på butikken for henne.', 'forside').ok);
});

t.test('de sju påstandene vi ikke kan stå for, fanges', function () {
  var prover = [
    ['Vi følger med på moren din hele dagen.', 'overvaking'],
    ['Naviar erstatter familien når du er borte.', 'erstatter'],
    ['Hjelp til hjelpeløse eldre.', 'hjelpelos'],
    ['Vi tilbyr all slags omsorg.', 'all_omsorg'],
    ['Vi finner den billigste hjelperen på minutter.', 'billigst'],
    ['Vi er tilgjengelige døgnet rundt.', 'beredskap']
  ];
  prover.forEach(function (par) {
    var r = MS.sjekk(par[0], 'forside');
    t.erUsann(r.ok, 'slapp gjennom: ' + par[0]);
    t.erSann(r.funn.some(function (f) { return f.id === par[1]; }),
      par[0] + ' ga ' + r.funn.map(function (f) { return f.id; }).join(','));
  });
});

t.test('hver forbudt påstand sier hva man skal skrive i stedet', function () {
  /* En sperre uten alternativ blir omgått, og da har vi verken merket
     eller beskjeden. */
  MS.ALDRI.forEach(function (r) {
    t.erSann(r.hvorfor && r.hvorfor.length > 20, r.id + ' mangler grunn');
    t.erSann(r.istedenfor && r.istedenfor.length > 10, r.id + ' mangler alternativ');
  });
});

t.test('hver målgruppe har sin egen setning', function () {
  ['familie', 'eldre', 'medarbeider', 'partner'].forEach(function (m) {
    t.erSann(MS.selger(m) && MS.selger(m).length > 20, 'mangler: ' + m);
  });
  t.erLik(MS.selger('ukjent'), null);
});

t.test('posisjonen svarer på hvem som ordner og hvem som bestemmer', function () {
  /* Spenningen tjenesten faktisk må løse. Svarer en skjerm «familien» på
     begge, er skjermen feil. */
  t.erSann(MS.POSISJON.stor.indexOf('ordne') !== -1);
  t.erSann(MS.POSISJON.stor.indexOf('bestemmer') !== -1);
  t.erSann(MS.sjekk(MS.POSISJON.stor, 'forside').ok);
  t.erSann(MS.sjekk(MS.POSISJON.full, 'forside').ok);
});

t.test('ingen av de tre heltene er oss', function () {
  t.erLik(MS.POSISJON.helter.length, 3);
  MS.POSISJON.helter.forEach(function (h) {
    t.erUsann(/naviar/i.test(h), 'Naviar er ikke helten: ' + h);
  });
});

t.test('hvert løfte har et bevis', function () {
  /* Et løfte uten bevis er en tekst. Med bevis er det en funksjon noen kan
     etterprøve. */
  t.erSann(MS.BEVIS.length >= 6);
  MS.BEVIS.forEach(function (b) {
    t.erSann(b.lofte && b.lofte.length > 10, 'løfte mangler');
    t.erSann(b.bevis && b.bevis.length > 15, b.lofte + ' mangler bevis');
  });
});

t.gruppe('Hverdagsguiden');

var GD = window.PP_GUIDE;

t.test('guiden ligger på samme nettsted, ikke et eget domene', function () {
  t.erLik(GD.STI, '/hverdagsguide');
});

t.test('hver artikkel peker på en kategori som finnes', function () {
  GD.ARTIKLER.forEach(function (a) {
    t.erSann(!!GD.kategori(a.kategori), 'ukjent kategori: ' + a.kategori);
    t.erSann(a.tittel.length > 20, 'for kort tittel: ' + a.tittel);
  });
});

t.test('artikkelnumrene er sammenhengende', function () {
  GD.ARTIKLER.forEach(function (a, i) { t.erLik(a.nr, i + 1); });
});

t.test('fordelingen mellom målgrupper holder planen', function () {
  /* Skriver vi mest til eldre, får vi lesere som ikke bestiller. Skriver vi
     bare til familien, blir den eldre et objekt i vår egen tekst. */
  var f = GD.fordeling();
  t.erLik(f.reduce(function (a, x) { return a + x.antall; }, 0), GD.ARTIKLER.length);
  f.forEach(function (x) {
    t.erSann(Math.abs(x.avvik) <= 15,
      x.id + ' er ' + x.faktisk + ' %, planlagt ' + x.planlagt + ' %');
  });
});

t.test('hver målgruppe har sin egen avslutning', function () {
  ['familie', 'eldre', 'medarbeider'].forEach(function (m) {
    t.erSann(GD.AVSLUTNING[m] && GD.AVSLUTNING[m].length > 25, 'mangler: ' + m);
  });
});

t.test('det som ikke publiseres, har grunn og alternativ', function () {
  t.erSann(GD.PUBLISERES_IKKE.length >= 6);
  GD.PUBLISERES_IKKE.forEach(function (r) {
    t.erSann(r.hvorfor && r.hvorfor.length > 20, r.hva + ' mangler grunn');
    t.erSann(r.istedenfor && r.istedenfor.length > 15, r.hva + ' mangler alternativ');
  });
});

t.test('åpent kommentarfelt står på lista over det vi ikke gjør', function () {
  /* Et kommentarfelt gjør oss til vert for andres innhold, med moderering,
     sletteplikt og ansvar. */
  t.erSann(GD.PUBLISERES_IKKE.some(function (r) {
    return /kommentarfelt|forum/i.test(r.hva);
  }));
});

t.test('utkastet arver sperrene fra resten av tjenesten', function () {
  t.erSann(GD.sjekkUtkast('Ti små oppgaver som gjør hverdagen enklere hjemme.').ok);

  var paastand = GD.sjekkUtkast('Vi følger med på foreldrene dine hele dagen.');
  t.erUsann(paastand.ok);
  t.erSann(paastand.funn.some(function (f) { return f.kilde === 'merkespråk'; }));

  var helse = GD.sjekkUtkast('Har hun høyt blodtrykk, bør hun bytte medisin.');
  t.erUsann(helse.ok);
  t.erSann(helse.funn.some(function (f) { return f.id === 'helseraad'; }));
});

t.gruppe('KI-porten');

var KP = window.PP_KI_PORT;

function forslag(endringer) {
  return Object.assign({ agent: 'familie', handling: 'familiemelding',
                         begrunnelse: 'Besøket er huket av som utført',
                         sikkerhet: 0.95, grunnlag: ['oppgave', 'dato og tid'] },
                       endringer || {});
}

t.test('modellen foreslår, systemet avgjør', function () {
  /* Risikoen kommer fra kallstedet, ikke fra forslaget. Sier modellen at alt
     er grønt mens vi vet at det er nød, er det nøden som gjelder. */
  var gronn = KP.vurder(forslag(), 'gronn', {});
  var nod = KP.vurder(forslag(), 'nod', {});
  t.erLik(gronn.autonomi, 'auto');
  t.erLik(nod.autonomi, 'menneske');
  t.erLik(nod.regel, 'nod');
});

t.test('ufullstendig forslag avvises, det gjettes ikke', function () {
  var r = KP.vurder(forslag({ begrunnelse: null }), 'gronn', {});
  t.erLik(r.utfall, 'avvist');
  t.erSann(r.grunn.indexOf('begrunnelse') !== -1, r.grunn);
});

t.test('ukjent agent slipper ikke inn', function () {
  /* En modell som kaller seg «akuttagent» har ikke dermed blitt en. */
  var r = KP.vurder(forslag({ agent: 'akuttagent' }), 'gronn', {});
  t.erLik(r.utfall, 'avvist');
  t.erLik(r.regel, 'ukjent_agent');
});

t.test('sikkerhet må være et tall mellom null og en', function () {
  ['høy', -1, 2, null].forEach(function (v) {
    var r = KP.vurder(forslag({ sikkerhet: v }), 'gronn', {});
    t.erLik(r.utfall, 'avvist', 'slapp gjennom: ' + v);
  });
});

t.test('en modell i tvil avgjør ikke alene, selv om den har lov', function () {
  var r = KP.vurder(forslag({ sikkerhet: 0.5 }), 'gronn', {});
  t.erLik(r.utfall, 'til_godkjenning');
  t.erLik(r.regel, 'lav_sikkerhet');
  t.erSann(KP.SIKKERHETSGRENSE > 0.5);
});

t.test('fritekst fra en modell går gjennom samme sperre som all annen', function () {
  var r = KP.vurder(forslag(), 'gronn', { tekst: 'Hun virket forvirret og hadde vondt' });
  t.erLik(r.utfall, 'til_godkjenning');
  t.erLik(r.regel, 'personvern');
  t.erSann(r.kategorier.indexOf('helse') !== -1);
});

t.test('loggposten får alle sju feltene', function () {
  var dom = KP.vurder(forslag(), 'gronn', {});
  var post = KP.loggfor(forslag(), dom, null);
  ['agent', 'grunnlag', 'sikkerhet', 'regel', 'godkjenning', 'endretAv', 'melding']
    .forEach(function (f) {
      t.erSann(post[f] !== undefined, 'mangler ' + f);
    });
});

t.test('oppdiktede felter i grunnlaget kommer ikke inn i loggen', function () {
  /* Modeller finner på felter. Bare de vi kjenner slipper videre. */
  var f = forslag({ grunnlag: ['oppgave', 'humoer', 'diagnose'] });
  var post = KP.loggfor(f, KP.vurder(f, 'gronn', {}), null);
  t.erSann(post.grunnlag.indexOf('oppgave') !== -1, post.grunnlag.join(','));
  t.erUsann(post.grunnlag.indexOf('humoer') !== -1, post.grunnlag.join(','));
  t.erUsann(post.grunnlag.indexOf('diagnose') !== -1, post.grunnlag.join(','));
});

t.test('kallet skjer fra server, aldri fra nettleseren', function () {
  /* En nøkkel i assets/js/ er en nøkkel hos hver eneste besøkende. */
  t.erLik(KP.OPPSETT.kallesFra, 'server');
  ['kunde', 'parorendeEpost', 'ansattNavn', 'token'].forEach(function (felt) {
    t.erSann(KP.OPPSETT.sendAldri.indexOf(felt) !== -1, 'mangler: ' + felt);
  });
});

t.test('hver grense har en adresse å sende folk til', function () {
  /* Et nei uten en adresse sender folk tilbake til Google, og det neste
     treffet der har ingen grense. */
  t.erSann(GD.HENVISNING.length >= 8);
  GD.HENVISNING.forEach(function (h) {
    t.erSann(h.vi_gjor_ikke && h.vi_gjor_ikke.length > 15, h.id + ' mangler grensen');
    t.erSann(h.til && h.til.length >= 1, h.id + ' har ingen å henvise til');
  });
});

t.test('fall henviser til nødnummeret, ikke til oss', function () {
  var f = GD.henvisning('fall');
  t.erLik(f.hast, '113');
  t.erSann(f.til.join(' ').indexOf('113') !== -1);
  t.erSann(f.til.join(' ').indexOf('116 117') !== -1);
});

t.test('bank og trygghetsalarm peker ut av tjenesten', function () {
  t.erSann(GD.henvisning('bank').til.join(' ').indexOf('ank') !== -1);
  t.erSann(GD.henvisning('trygghet').vi_gjor_ikke.indexOf('nødtjeneste') !== -1);
});

t.test('lesestandarden er tall, ikke smak', function () {
  t.erSann(GD.LESESTANDARD.ettSporsmaal);
  t.erLik(GD.LESESTANDARD.ordMaks, 300);
  t.erLik(GD.LESESTANDARD.stegMaks, 3);
  t.erSann(GD.LESESTANDARD.valg.length >= 3);
});

t.test('forbeholdet og godkjenningene står skrevet', function () {
  t.erSann(GD.FORBEHOLD.indexOf('erstatter ikke') !== -1);
  t.erLik(GD.GODKJENNES_AV.length, 2);
  t.erSann(GD.GODKJENNES_AV.some(function (g) { return /helsepersonell/.test(g.av); }));
});

/* ---------------- Ekspertbistand ---------------- */

var EK = window.PP_EKSPERT;

t.gruppe('Ekspertbistand – grensene');

t.test('legekonsultasjon finnes ikke som kategori', function () {
  t.erLik(EK.KATEGORI.filter(function (k) { return k.id === 'legekonsultasjon'; }).length, 0);
  t.erUsann(EK.LEGEKONSULTASJON.bygges);
  t.erSann(EK.LEGEKONSULTASJON.forutsetninger.length >= 5);
  t.erSann(/helsehjelp/.test(EK.LEGEKONSULTASJON.hvorfor));
});

t.test('å be om legekonsultasjon gir grunnen, ikke «ukjent»', function () {
  var d = EK.sjekkKategorier(['legekonsultasjon']);
  t.erUsann(d.ok);
  t.erLik(d.grunn, EK.LEGEKONSULTASJON.hvorfor);
});

t.test('høyst to fagområder per ekspert', function () {
  t.erLik(EK.MAKS_KATEGORIER, 2);
  t.erSann(EK.sjekkKategorier(['nav', 'kommune']).ok);
  t.erUsann(EK.sjekkKategorier(['nav', 'kommune', 'digital']).ok);
  t.erUsann(EK.sjekkKategorier([]).ok);
});

t.test('hver kategori sier hva den ikke gir rett til', function () {
  EK.KATEGORI.forEach(function (k) {
    t.erSann(k.girIkkeRett && k.girIkkeRett.length >= 3, k.id + ' mangler grenser');
    t.erSann(!!k.gjorLettere, k.id + ' mangler hva den gjør lettere');
  });
});

t.test('grensene er skrevet til den de gjelder, ikke om henne', function () {
  // Samme liste vises til familien og til den eldre. «Kundens vegne» på
  // hennes egen skjerm gjør henne til en tredjeperson i sin egen sak.
  EK.KATEGORI.forEach(function (k) {
    k.girIkkeRett.forEach(function (g) {
      t.erSann(!/\bkunden(s)?\b/i.test(g), k.id + ': «' + g + '»');
    });
  });
});

t.test('hver kategori har tre punkter skrevet til den eldre', function () {
  // Setningen til familien og lista til henne er to registre, ikke to
  // sannheter. En setning delt på komma blir to halve setninger.
  EK.KATEGORI.forEach(function (k) {
    t.erLik(k.kanHjelpeDegMed.length, 3, k.id);
    k.kanHjelpeDegMed.forEach(function (p) {
      t.erSann(/^[A-ZÆØÅ]/.test(p), k.id + ': «' + p + '» begynner ikke med stor bokstav');
      t.erSann(p.split(/\s+/).length <= 9, k.id + ': «' + p + '» er for langt');
    });
  });
});

t.test('helseveiledning kan ikke vurdere symptomer', function () {
  var h = EK.kategori('helseveiledning');
  t.erSann(h.girIkkeRett.join(' ').indexOf('symptom') !== -1);
  t.erSann(h.girIkkeRett.join(' ').indexOf('diagnose') !== -1);
  t.erSann(h.akuttvarsel);
  t.erSann(!!h.maaAvklares);
  t.erSann(h.sporsmaalViIkkeSvarerPaa.length >= 3);
});

t.test('digital hjelp rører ikke BankID, heller ikke her', function () {
  var d = EK.kategori('digital');
  t.erSann(d.girIkkeRett.join(' ').indexOf('BankID') !== -1);
});

t.test('harRettTil svarer med grunn, ikke med taushet', function () {
  var nei = EK.harRettTil('nav', 'søke på dine vegne');
  t.erUsann(nei.rett);
  t.erSann(nei.grunn.length > 0);
  t.erSann(EK.harRettTil('nav', 'forklare saksgangen').rett);
  t.erUsann(EK.harRettTil('finnesikke', 'noe').rett);
});

t.test('akuttvarselet har begge numrene', function () {
  t.erSann(EK.AKUTTVARSEL.tekst.indexOf('116 117') !== -1);
  t.erSann(EK.AKUTTVARSEL.tekst.indexOf('113') !== -1);
});

t.gruppe('Ekspertbistand – piloten');

t.test('tre kategorier er åpne, resten har en grunn til å vente', function () {
  t.erLik(EK.pilotKategorier().length, 3);
  t.erLik(EK.pilotKategorier().map(function (k) { return k.id; }), ['nav', 'kommune', 'digital']);
  EK.KATEGORI.filter(function (k) { return !k.pilot; }).forEach(function (k) {
    t.erSann(!!k.senere, k.id + ' er stengt uten grunn');
  });
});

t.test('bare 45 minutter i piloten', function () {
  t.erLik(EK.pilotLengder().length, 1);
  t.erLik(EK.pilotLengder()[0].minutter, 45);
});

t.test('bestilling i en stengt kategori sier hvorfor', function () {
  var d = EK.bestill({ kategori: 'juridisk', kanal: 'telefon', minutter: 45,
                       pris: 599, eldreGodkjent: true });
  t.erUsann(d.ok);
  t.erLik(d.regel, 'ikke_apen');
  t.erSann(d.grunn.indexOf('Juridisk') !== -1);
});

t.test('uten den eldres godkjenning skjer ingenting', function () {
  var d = EK.bestill({ kategori: 'nav', kanal: 'telefon', minutter: 45, pris: 599 });
  t.erUsann(d.ok);
  t.erLik(d.regel, 'venter_godkjenning');
  t.erSann(d.mangler.indexOf('hvilken ekspert') !== -1);
  t.erSann(d.mangler.indexOf('hvilken kanal') !== -1);
});

t.test('prisen må stå før bestillingen', function () {
  var d = EK.bestill({ kategori: 'nav', kanal: 'telefon', minutter: 45, eldreGodkjent: true });
  t.erLik(d.regel, 'pris');
});

t.test('en gyldig bestilling går gjennom, med grensene i svaret', function () {
  var d = EK.bestill({ kategori: 'nav', kanal: 'video', minutter: 45,
                       pris: 599, eldreGodkjent: true });
  t.erSann(d.ok);
  t.erSann(d.grenser.length >= 3);
  t.erLik(d.akuttvarsel, null);
});

t.test('helseveiledning bærer akuttvarselet med seg – men er ikke åpen ennå', function () {
  t.erUsann(EK.kategori('helseveiledning').pilot);
});

t.gruppe('Ekspertbistand – verifisering og profil');

t.test('«verifisert» betyr én ting, og den står skrevet', function () {
  var v = EK.verifisering('nav');
  t.erLik(v.metode, 'referanse');
  t.erSann(v.betyrIkke.length > 0);
  t.erSann(EK.verifisering('helseveiledning').metode === 'hpr');
  t.erSann(EK.verifisering('juridisk').metode === 'tilsynsradet');
});

t.test('ingen verifisering lagrer et dokument', function () {
  Object.keys(EK.VERIFISERING).forEach(function (id) {
    var v = EK.VERIFISERING[id];
    t.erSann(v.lagres.length > 0, id);
    t.erSann(v.lagresIkke.length > 0, id + ' mangler lista over det vi ikke lagrer');
  });
  t.erUsann(EK.DOKUMENTER.tas_imot);
});

t.test('profilen sier «tidligere» og «uavhengig»', function () {
  var tittel = EK.PROFILTITTEL.mal.replace('{rolle}', 'NAV-rådgiver');
  t.erSann(tittel.indexOf('Tidligere') === 0);
  t.erSann(tittel.indexOf('uavhengig') !== -1);
  t.erSann(EK.PROFILTITTEL.aldri.indexOf('Godkjent av NAV') !== -1);
});

t.test('kalenderen holder av buffer på begge sider', function () {
  var e = { apen: true, buffer: 10, ukesmaks: 5,
            tider: ['2026-09-01T10:00:00Z', '2026-09-01T12:00:00Z'] };
  var opptatt = [{ start: '2026-09-01T10:30:00Z', minutter: 45 }];
  var ledig = EK.ledigeTider(e, opptatt, 45);
  t.erLik(ledig.length, 1);
  t.erLik(ledig[0], '2026-09-01T12:00:00Z');
});

t.test('stengt kalender eller full uke gir ingen tider', function () {
  var e = { apen: false, tider: ['2026-09-01T10:00:00Z'] };
  t.erLik(EK.ledigeTider(e, [], 45).length, 0);
  var full = { apen: true, ukesmaks: 1, tider: ['2026-09-01T10:00:00Z'] };
  t.erLik(EK.ledigeTider(full, [{ start: '2026-09-02T10:00:00Z', minutter: 45 }], 45).length, 0);
});

t.test('oppsummeringen kan ikke bli en journal', function () {
  var lang = new Array(160).join('ord ');
  t.erUsann(EK.sjekkOppsummering(lang).ok);
  t.erSann(EK.sjekkOppsummering('Ring tildelingskontoret og be om en vurdering.').ok);
});

t.gruppe('Den eldres godkjenning');

t.test('uten svar står avtalen og venter', function () {
  var d = EK.godkjenn({ ekspert: 'Kari Hansen', kanal: 'telefon' });
  t.erUsann(d.ok);
  t.erLik(d.tilstand, 'venter');
  t.erSann(d.mangler.length === 2);
});

t.test('nei er nei, ikke «ikke besvart»', function () {
  var d = EK.godkjenn({ svar: 'nei' });
  t.erUsann(d.ok);
  t.erLik(d.tilstand, 'avslatt');
  t.erSann(d.grunn.indexOf('ingen purring') !== -1);
});

t.test('nei krever ingen begrunnelse, og lagrer ingen', function () {
  var d = EK.godkjenn({ svar: 'nei' });
  t.erLik(d.grunn && d.begrunnelse, undefined, 'det finnes ikke noe begrunnelsesfelt');
  // Familien får utfallet. Grunnen er hennes.
  t.erLik(d.tilFamilien, 'Avtalen ble ikke noe av.');
});

t.test('ja krever at hun vet hvem og hvordan', function () {
  var uten = EK.godkjenn({ svar: 'ja' });
  t.erUsann(uten.ok);
  t.erLik(uten.tilstand, 'venter');

  var med = EK.godkjenn({ svar: 'ja', ekspert: 'Kari Hansen', kanal: 'telefon' });
  t.erSann(med.ok);
  t.erLik(med.tilstand, 'godkjent');
});

t.test('angreretten står i hvert eneste ja', function () {
  var d = EK.godkjenn({ svar: 'ja', ekspert: 'Kari Hansen', kanal: 'video' });
  t.erSann(d.angre.indexOf('uten grunn') !== -1);
  t.erSann(d.angre.indexOf('uten kostnad') !== -1);
});

t.test('hun kan be om noe annet uten å si nei', function () {
  var d = EK.godkjenn({ svar: 'endre', onske: 'video i stedet' });
  t.erUsann(d.ok);
  t.erLik(d.tilstand, 'endring_onsket');
  t.erLik(d.onske, 'video i stedet');
});

t.test('et ukjent svar er ikke et ja', function () {
  t.erUsann(EK.godkjenn({ svar: 'kanskje', ekspert: 'K', kanal: 'telefon' }).ok);
});

t.gruppe('Funksjonsnedsettelser er helseopplysninger');

t.test('hørsel, syn og hjelpemidler stoppes som helseopplysning', function () {
  // Glippen var reell: en tjeneste om eldre får nettopp disse ordene skrevet
  // inn, og de føles som praktiske opplysninger. Det er de ikke.
  ['Hun har hørselstap', 'Han er tunghørt', 'Bruker høreapparat',
   'Hun er synshemmet', 'Han bruker rullator', 'Hun har parkinson'
  ].forEach(function (t2) {
    t.erUsann(window.PP_VERN.sjekk(t2).ok, 'slapp gjennom: ' + t2);
  });
});

t.test('den praktiske opplysningen finnes et annet sted', function () {
  var T = EK.TILGJENGELIGHET;
  t.erSann(T.lagres.indexOf('foretrukket kanal') !== -1);
  t.erSann(T.lagresAldri.indexOf('hørsel') !== -1);
  t.erSann(T.lagresAldri.indexOf('grunn til valget') !== -1);
  // Vi spør hva hun vil ha, ikke hvorfor.
  t.erSann(T.spor.indexOf('Hvordan vil du') === 0);
  t.erSann(T.sporIkke.indexOf('Hører du') === 0);
});

t.test('det skriftlige loves før hun svarer, ikke etterpå', function () {
  t.erSann(EK.TILGJENGELIGHET.skriftlig.alltid);
  t.erSann(EK.TILGJENGELIGHET.skriftlig.lovesFor.indexOf('skriftlig') !== -1);
});

t.test('video står før telefon, og oppmøte er ikke åpent', function () {
  var v = EK.TILGJENGELIGHET.valg;
  t.erLik(v[0].id, 'video', 'den som ser ansiktet, forstår mer');
  t.erLik(v[2].pilot, false);
});

t.test('en annen tid velges, den begrunnes ikke i fritekst', function () {
  t.erSann(EK.ANNEN_TID.grunner.length >= 3);
  t.erSann(EK.ANNEN_TID.lagres.indexOf('ikke en fritekst') !== -1);
  // Hun har en kalender. Den er ikke tom fordi hun er åtti.
  var navn = EK.ANNEN_TID.grunner.map(function (g) { return g.navn; }).join(' ');
  t.erSann(navn.indexOf('noe fast') !== -1, navn);
});

/* ---------------- Betaling ---------------- */

var BET = window.PP_BETALING;

t.gruppe('Betaling');

t.test('klarhet-strømmen er ikke åpen, og sier hva som mangler', function () {
  // Klarhet er begge strømmene PP_ABONNEMENT holder stengt: familien betaler,
  // og pengene går videre til en tredjepart.
  var d = BET.bestill({ strom: 'klarhet', belop: 599, forbruker: true });
  t.erUsann(d.ok);
  t.erLik(d.regel, 'ikke_avklart');
  t.erSann(d.krever.length >= 4);
  t.erSann(d.krever.join(' ').indexOf('J11') !== -1);
});

t.test('de to gamle strømmene er fortsatt sperret', function () {
  t.erLik(BET.bestill({ strom: 'familie', belop: 100 }).regel, 'sperret');
  t.erLik(BET.bestill({ strom: 'mellom', belop: 100 }).regel, 'sperret');
});

t.test('angreretten er en betingelse, ikke en formalitet', function () {
  // Fjernsalg til forbruker: uten uttrykkelig anmodning om å starte før
  // fristen, har vi levert noe vi ikke kan kreve betalt for.
  var uten = BET.bestill({ strom: 'leverandor', belop: 2690, forbruker: true,
                           vist: ['pris','innhold','selger','angrerett','klage','grenser'] });
  t.erLik(uten.regel, 'angrerett');
  t.erSann(uten.tekst.indexOf('angrefristen') !== -1);

  var med = BET.bestill({ strom: 'leverandor', belop: 2690, forbruker: true,
                          angrerettBekreftet: true,
                          vist: ['pris','innhold','selger','angrerett','klage','grenser'] });
  t.erSann(med.ok, med.grunn);
});

t.test('avkrysningen er aldri forhåndskrysset', function () {
  t.erUsann(BET.ANGRERETT.forhandskrysset);
  t.erLik(BET.ANGRERETT.dager, 14);
});

t.test('opplysningene skal stå før knappen', function () {
  var d = BET.bestill({ strom: 'leverandor', belop: 2690, forbruker: true,
                        angrerettBekreftet: true, vist: ['pris'] });
  t.erLik(d.regel, 'opplysningsplikt');
  t.erSann(d.mangler.indexOf('grenser') !== -1);
  t.erSann(BET.FOR_AVTALE.length >= 6);
});

t.test('en virksomhet har ikke angrerett', function () {
  // B2B-strømmen er ikke forbrukersalg. Da gjelder ikke angrerettloven.
  t.erSann(BET.bestill({ strom: 'leverandor', belop: 2690 }).ok);
});

t.test('penger trekkes etter, ikke før', function () {
  t.erSann(BET.kanGaaTil('reservert', 'trukket').ok);
  t.erUsann(BET.kanGaaTil('reservert', 'utbetalt').ok);
  t.erUsann(BET.kanGaaTil('ingen', 'trukket').ok);
  t.erSann(BET.kanGaaTil('trukket', 'refundert').ok);
  // En frigitt reservasjon er slutten. Den kan ikke vekkes til live igjen.
  t.erLik(BET.LOVLIGE_OVERGANGER.frigitt, []);
});

t.test('en reservasjon står ikke for evig', function () {
  t.erLik(BET.FRIGIS_ETTER_TIMER, 48);
});

t.test('kortopplysninger passerer aldri gjennom oss', function () {
  ['kortnummer', 'CVC', 'BankID', 'fødselsnummer'].forEach(function (x) {
    t.erSann(BET.LAGRES_ALDRI.indexOf(x) !== -1, x + ' mangler i lista');
    t.erSann(BET.LAGRES.indexOf(x) === -1, x + ' står i LAGRES');
  });
});

t.test('valget av betalingsprodukt er ikke tatt, og sier hvorfor', function () {
  // Connect finnes for å betale ut til selvstendige. Er eksperten ansatt,
  // skal hun ha lønn. Å velge produkt er å svare på arbeidsrettsspørsmålet.
  t.erUsann(BET.LEVERANDORVALG.avklart);
  t.erSann(BET.LEVERANDORVALG.avhengerAv.indexOf('ansatt') !== -1);
  t.erSann(BET.LEVERANDORVALG.uansett.indexOf('server') !== -1);
});

/* ---------------- Klart språk ---------------- */

var KS = window.PP_KLARSPRAK;

t.gruppe('Klart språk');

t.test('LIX regnes ikke av for kort tekst', function () {
  // Et LIX-tall regnet av én setning er støy, ikke måling.
  t.erLik(KS.lix('Kort tekst.'), null);
  t.erSann(KS.lix(new Array(30).join('ordet ') + '.') !== null);
});

t.test('kanselli-ord får et vanlig ord ved siden av seg', function () {
  var d = KS.sjekk('Vi behandler saken i henhold til gjeldende rutiner.');
  t.erUsann(d.ok);
  var f = d.funn.filter(function (x) { return x.id === 'kanselli'; })[0];
  t.erSann(!!f, 'kanselli ikke funnet');
  t.erLik(f.istedenfor, 'etter');
  // Et funn uten alternativ blir stående – forfatteren vet ikke hva hun skal gjøre.
  KS.ORD.forEach(function (o) { t.erSann(!!o.til, o.fra + ' mangler alternativ'); });
});

t.test('passiv fanges, fordi den skjuler hvem som gjør det', function () {
  t.erUsann(KS.sjekk('Oppdraget vil bli vurdert av en saksbehandler.').ok);
  t.erUsann(KS.sjekk('Kontoen suspenderes umiddelbart.').ok);
  t.erSann(KS.sjekk('Kari godkjenner oppdraget. Du får beskjed.').ok);
});

t.test('substantivsykdom fanges', function () {
  var d = KS.sjekk('Vi vil foreta en vurdering av søknaden din innen tre dager.');
  t.erSann(d.funn.some(function (f) { return f.id === 'substantivsykdom'; }));
});

t.test('grensa følger teksttypen, og hver type har en grunn', function () {
  // Én grense for alt var feil: personvern.html har sju ord per setning og
  // LIX 44, fordi norsk lager lange ord ved å sette dem sammen.
  ['beslutning', 'informasjon', 'juridisk'].forEach(function (id) {
    var r = KS.TYPE[id];
    t.erSann(!!r, id + ' mangler');
    t.erSann(!!r.hvorfor, id + ' mangler begrunnelse');
    t.erSann(r.lix > 0 && r.snitt > 0, id);
  });
  // En beslutningsskjerm skal være lettere enn en personvernerklæring.
  t.erSann(KS.TYPE.beslutning.lix < KS.TYPE.juridisk.lix);
});

t.test('setningslengden rapporteres for seg, fordi den er den som kan rettes', function () {
  var lang = 'Dette er en setning som er skrevet med mange ord etter hverandre ' +
             'slik at den blir lang nok til at den overstiger grensen for hvor ' +
             'mange ord en setning kan ha uten å bli delt i to.';
  var d = KS.sjekk(lang, 'beslutning');
  t.erSann(d.funn.some(function (f) { return f.id === 'snitt' || f.id === 'lang_setning'; }));
  t.erSann(d.snittSetning > 0);
});

t.test('en tekst med lange fagord får vite at det er ordene, ikke setningene', function () {
  var t2 = 'Vi lagrer personopplysninger. Behandlingsgrunnlaget er samtykke. ' +
           'Personvernforordningen gjelder. Posisjonsopplysninger slettes raskt. ' +
           'Opplysningene anonymiseres. Behandlingsansvarlig er leverandøren. ' +
           'Databehandleravtalen regulerer dette. Personvernerklæringen oppdateres.';
  var d = KS.sjekk(t2, 'beslutning');
  var lix = d.funn.filter(function (f) { return f.id === 'lix'; })[0];
  if (lix) {
    t.erSann(lix.andelLangeOrd > 30, 'andelen lange ord skal stå i funnet');
  }
  t.erSann(d.snittSetning <= 14, 'setningene her er korte: ' + d.snittSetning);
});

/* ---------------- Naviar Klarhet ---------------- */

var KL = window.PP_KLARHET;

t.gruppe('Klarhet – tilbudet');

t.test('én pakke, én pris, ingen abonnement', function () {
  t.erLik(KL.PAKKE.minutter, 45);
  t.erLik(KL.PAKKE.pris, 599);
  t.erLik(KL.PAKKE.tilEkspert, 449);
  t.erUsann(KL.PAKKE.abonnement);
  t.erSann(KL.PAKKE.ingenSkjulteTillegg);
});

t.test('regnestykket tar med kortgebyret', function () {
  var o = KL.okonomi();
  t.erLik(o.brutto, 150);
  t.erSann(o.netto < o.brutto, 'kortgebyret må trekkes fra');
  t.erLik(o.andel, 25);
});

t.test('målet om 150 kr per samtale er ikke nådd av dagens deling', function () {
  // Står som en test og ikke som et notat, fordi 150 er både delingen og
  // målet. Endres den ene uten den andre, skal noe si fra.
  var o = KL.okonomi();
  var mal = KL.MAL30.filter(function (m) { return m.id === 'inntekt'; })[0].mal;
  t.erSann(o.netto < mal, 'netto ' + o.netto + ' mot mål ' + mal);
});

t.test('garantien dekker bare det vi styrer over', function () {
  t.erLik(KL.GARANTI.id, 'riktig_ekspert');
  t.erSann(KL.GARANTI.garantererIkke.length >= 4);
  var hva = KL.GARANTI.garantererIkke.map(function (g) { return g.hva; }).join(' ');
  t.erSann(hva.indexOf('ytelse') !== -1);
  t.erSann(hva.indexOf('medisinsk') !== -1);
  KL.GARANTI.garantererIkke.forEach(function (g) {
    t.erSann(!!g.hvorfor, g.hva + ' mangler begrunnelse');
  });
});

t.test('påfunnet knapphet står på forbudslista', function () {
  t.erSann(KL.ALDRI_SELG.length >= 4);
  var hva = KL.ALDRI_SELG.map(function (a) { return a.hva; }).join(' ');
  t.erSann(hva.indexOf('Nedtelling') !== -1);
  KL.ALDRI_SELG.forEach(function (a) { t.erSann(!!a.hvorfor, a.hva); });
});

t.test('oppfølgingen er ett spørsmål etter sju dager', function () {
  t.erLik(KL.OPPFOLGING.dager, 7);
  t.erLik(KL.OPPFOLGING.svar.length, 3);
});

t.gruppe('Klarhet – Navigator');

t.test('haster det, får kunden et nummer og ingen bestillingsknapp', function () {
  var d = KL.navigator({ tema: 'penger', hast: 'akutt' });
  t.erLik(d.utfall, 'offentlig');
  t.erUsann(d.bestilling);
  t.erSann(d.svar.indexOf('113') !== -1);
});

t.test('helse går ut av tjenesten, ikke inn i en kategori', function () {
  var d = KL.navigator({ tema: 'helse', hast: 'uker' });
  t.erLik(d.utfall, 'helsehjelp');
  t.erUsann(d.bestilling);
  t.erLik(d.kategori, null);
});

t.test('haster går foran helse – rekkefølgen er selve regelen', function () {
  var d = KL.navigator({ tema: 'helse', hast: 'akutt' });
  t.erLik(d.utfall, 'offentlig');
});

t.test('skal noen komme hjem, er det praktisk hjelp', function () {
  var d = KL.navigator({ tema: 'hjelp', hast: 'uker', form: 'hjemme' });
  t.erLik(d.utfall, 'praktisk');
  t.erSann(d.bestilling);
});

t.test('penger på telefon blir Klarhet i NAV-kategorien', function () {
  var d = KL.navigator({ tema: 'penger', hast: 'uker', form: 'telefon' });
  t.erLik(d.utfall, 'klarhet');
  t.erLik(d.kategori, 'nav');
  t.erSann(d.bestilling);
  t.erSann(d.gjorIkke.length >= 3, 'grensene skal følge med i svaret');
});

t.test('fire utfall, og to av dem selger ingenting', function () {
  t.erLik(KL.UTFALL.length, 4);
  t.erLik(KL.UTFALL.filter(function (u) { return !u.selger; }).length, 2);
});

t.test('Navigator svarer uten at noen har betalt', function () {
  t.erSann(KL.NAVIGATOR.gratis);
  t.erSann(KL.NAVIGATOR.svarUtenBestilling);
  t.erLik(KL.NAVIGATOR.sporsmaal.length, 5);
});

t.gruppe('Klarhet – de tre stegene');

var STEG_OK = [
  { hvem: 'NAV Kontaktsenter', hva: 'Be om en oversikt over løpende ytelser', telefon: '55 55 33 33' },
  { hvem: 'Tildelingskontoret i bydelen', hva: 'Søk om vurdering av hjemmetjenester', lenke: 'https://www.oslo.kommune.no' },
  { hvem: 'Fastlegen', hva: 'Bestill en time for en samlet gjennomgang', telefon: '—' }
];

t.test('tre steg, hvert med hvem, hva og en vei dit', function () {
  t.erSann(KL.sjekkTreSteg(STEG_OK).ok);
});

t.test('to steg er ikke tre', function () {
  var d = KL.sjekkTreSteg(STEG_OK.slice(0, 2));
  t.erUsann(d.ok);
  t.erSann(d.funn.some(function (f) { return f.id === 'antall'; }));
});

t.test('et steg uten kontaktvei er et råd, ikke et steg', function () {
  var uten = [{ hvem: 'NAV', hva: 'Ring dem' }, STEG_OK[1], STEG_OK[2]];
  var d = KL.sjekkTreSteg(uten);
  t.erUsann(d.ok);
  t.erSann(d.funn.some(function (f) { return f.id === 'kontaktvei'; }));
});

t.test('helseopplysninger stoppes i stegene, som overalt ellers', function () {
  var med = [{ hvem: 'Fastlegen', hva: 'Fortell at hun har diabetes og høyt blodtrykk', telefon: '—' },
             STEG_OK[1], STEG_OK[2]];
  var d = KL.sjekkTreSteg(med);
  t.erUsann(d.ok);
  t.erSann(d.funn.some(function (f) { return f.id === 'personvern'; }));
});

t.test('piloten er ikke bedømt før 20 betalte samtaler', function () {
  t.erLik(KL.pilotdom({ samtaler: 9 }).kode, 'for_tidlig');
  t.erLik(KL.pilotdom({ samtaler: 20, fullfort: 40 }).kode, 'under_mal');
  t.erSann(KL.pilotdom({ samtaler: 20, eksperter: 5, fullfort: 75,
                         igjen: 35, inntekt: 155, klarhet: 85 }).ok);
});

/* ---------------- Språk ---------------- */

var SP = window.PP_SPRAK_UI;

t.gruppe('Språk på flaten');

t.test('ti språk, og norsk er kilden', function () {
  t.erLik(SP.SPRAK.length, 10);
  t.erLik(SP.SPRAK.filter(function (s) { return s.kilde; }).length, 1);
  t.erLik(SP.SPRAK[0].kode, 'nb');
});

t.test('ingen oversettelse mangler en streng', function () {
  var n = SP.nokler();
  SP.SPRAK.forEach(function (s) {
    var mangler = n.filter(function (k) { return SP.T[s.kode][k] === undefined; });
    t.erLik(mangler, [], s.kode + ' mangler strenger');
  });
});

t.test('nødnumrene står uendret i hvert eneste språk', function () {
  SP.SPRAK.forEach(function (s) {
    SP.NUMRE.forEach(function (nr) {
      t.erSann(SP.T[s.kode][SP.KRITISK].indexOf(nr) !== -1,
               s.kode + ' mangler ' + nr + ' i akuttsetningen');
    });
  });
});

t.test('et språk åpnes ikke før akuttsetningen er lest av et menneske', function () {
  t.erSann(SP.kanApnes('nb').ok);
  var d = SP.kanApnes('pl');
  t.erUsann(d.ok);
  t.erLik(d.regel, 'ikke_godkjent');
});

t.test('arabisk skrives fra høyre', function () {
  t.erLik(SP.sprak('ar').dir, 'rtl');
  t.erLik(SP.sprak('nb').dir, 'ltr');
});

t.test('språkvalget følger med til SMS, e-post og oppsummering', function () {
  t.erSann(SP.FLATER.indexOf('sms') !== -1);
  t.erSann(SP.FLATER.indexOf('epost') !== -1);
  t.erSann(SP.FLATER.indexOf('oppsummering') !== -1);
  var m = SP.melding('pl', 'sms', 'sms');
  t.erLik(m.sprak, 'pl');
  t.erLik(m.flate, 'sms');
  t.erSann(m.tekst.length > 0);
});

t.test('en ukjent flate er en feil, ikke en stille norsk melding', function () {
  var kastet = false;
  try { SP.melding('nb', 'brevpost', 'sms'); } catch (e) { kastet = true; }
  t.erSann(kastet);
});

t.test('manglende nøkkel faller tilbake til norsk, ikke til tomt', function () {
  t.erLik(SP.t('finnesikke', 'pl'), null);
  t.erLik(SP.t('knapp', 'zz'), SP.T.nb.knapp);
});

t.test('siden lover ikke en samtale på språket', function () {
  SP.SPRAK.forEach(function (s) {
    t.erSann(SP.T[s.kode].samtalesprak.length > 0, s.kode);
  });
});

/* En feilmelding som bare vises, finnes ikke for den som ikke ser skjermen.
   Sperra i PP_VERN er den viktigste av dem: den forteller hva man skal skrive
   i stedet, og en sperre uten alternativ blir omgått. */
t.gruppe('Feilmeldinger nås av skjermleser');

(function () {
  var fs = require('fs');
  var path = require('path');
  var ROT = path.join(__dirname, '..');
  var SIDER = ['bli-hjelper.html', 'besok/bli-medarbeider.html',
               'besok/logg-inn.html', 'besok/nytt.html', 'besok/utfor.html'];

  SIDER.forEach(function (side) {
    var html = fs.readFileSync(path.join(ROT, side), 'utf8');
    var alle = html.match(/<p class="error-text"[^>]*>/g) || [];

    t.test(side + ': alle ' + alle.length + ' feilmeldinger har role="alert"', function () {
      var uten = alle.filter(function (tag) { return tag.indexOf('role="alert"') === -1; });
      t.erLik(uten.length, 0, uten.join(' '));
    });

    t.test(side + ': feltet peker på meldinga si', function () {
      var navn = (html.match(/data-error-for="([^"]+)"/g) || [])
        .map(function (m) { return m.slice(16, -1); });
      var mangler = navn.filter(function (n) {
        /* Bare kontroller som finnes som ett felt. Grupper av avkrysningsbokser
           har ingen enkelt kontroll å peke fra, og bæres av role="alert". */
        var kontroll = new RegExp('<(?:input|textarea|select)[^>]*\\bid="' + n + '"[^>]*>');
        var m = html.match(kontroll);
        if (!m) return false;
        return m[0].indexOf('aria-describedby="feil-' + n + '"') === -1;
      });
      t.erLik(mangler.length, 0, mangler.join(', '));
    });
  });
})();

/* Skjemaet genereres fra reglene. Faller et ord ut av genereringen, er
   sperra i databasen svakere enn den i nettleseren – og ingen ville sett det.
   Testen mot en ekte Postgres ligger ikke her; den krever en server. Denne
   holder at genereringen er komplett. */
t.gruppe('Generert skjema dekker reglene');

(function () {
  var fs = require('fs');
  var path = require('path');
  var sql = fs.readFileSync(path.join(__dirname, '..', 'sql/001-besok.sql'), 'utf8');
  var V = window.PP_VERN;

  t.test('hvert stoppord finnes i den genererte sperra', function () {
    var mangler = [];
    V.STOPP.forEach(function (kat) {
      kat.ord.forEach(function (o) {
        if (sql.indexOf("])" + o.replace('-', '[- ]?')) === -1) mangler.push(kat.id + '/' + o);
      });
    });
    t.erLik(mangler.length, 0, mangler.slice(0, 5).join(', '));
  });

  t.test('hvert slettetrinn finnes som SQL', function () {
    var mangler = V.SLETTEPLAN.filter(function (steg) {
      return sql.indexOf('Trinn ' + steg.steg + ':') === -1;
    });
    t.erLik(mangler.length, 0);
  });

  t.test('siste trinn flytter raden, det nuller den ikke', function () {
    /* id er primærnøkkel og opprettet er kolonnen krympingen selv leser.
       En UPDATE som nuller dem, ødelegger sin egen neste kjøring. */
    t.erSann(sql.indexOf('insert into besok_statistikk') !== -1);
    t.erSann(sql.indexOf('delete from besok') !== -1);
  });

  t.test('innloggingsloggen arver fristen fra reglene', function () {
    var l = V.LAGRES.filter(function (x) { return x.felt === 'innlogging'; })[0];
    t.erSann(!!l, 'innlogging mangler i LAGRES');
    var frist = V.FRISTER[l.frist];
    t.erSann(!!frist && frist.dager > 0, 'fristen mangler dager');
    /* Tallet skal komme fra reglene, ikke være skrevet inn i SQL-en. */
    t.erSann(sql.indexOf("interval '" + frist.dager + " days'") !== -1);
    t.erSann(sql.indexOf('les_innlogging') !== -1);
  });

  t.test('innloggingsloggen har ingen kolonne for IP eller enhet', function () {
    var blokk = sql.slice(sql.indexOf('create table if not exists innlogging'));
    blokk = blokk.slice(0, blokk.indexOf(');'));
    ['ip', 'enhet', 'nettleser', 'user_agent'].forEach(function (k) {
      t.erLik(blokk.indexOf(k), -1, k + ' har fått en kolonne');
    });
  });

  t.test('ingenting som aldri skal lagres har fått en kolonne', function () {
    var kolonner = (sql.match(/^  ([a-z_]+)\s+(text|date|time|timestamptz|smallint)/gm) || [])
      .map(function (m) { return m.trim().split(/\s+/)[0]; });
    var forbudt = ['fodselsnummer', 'etternavn', 'diagnose', 'kontonummer',
                   'bankid', 'journal', 'adresse', 'posisjon'];
    var funnet = kolonner.filter(function (k) { return forbudt.indexOf(k) !== -1; });
    t.erLik(funnet.length, 0, funnet.join(', '));
  });
})();

/* Tokenfilene er for overlevering til design. Faller et token ut av
   genereringen, får designeren en palett som ikke er vår – og ingen ser det
   før noe er tegnet i feil grønn. */
t.gruppe('Designtokens dekker :root');

(function () {
  var fs = require('fs');
  var path = require('path');
  var ROT = path.join(__dirname, '..');
  var css = fs.readFileSync(path.join(ROT, 'assets/css/styles.css'), 'utf8');
  var rot = css.slice(css.indexOf(':root {'), css.indexOf('\n}', css.indexOf(':root {')));
  var w3c = JSON.parse(fs.readFileSync(path.join(ROT, 'design/naviar.tokens.json'), 'utf8'));

  var iRot = (rot.match(/^\s*--[a-z0-9-]+:\s*(#[0-9a-f]{3,8}|var\(--[a-z0-9-]+\));/gim) || [])
    .map(function (l) { return l.trim().split(':')[0].replace('--', ''); });

  t.test('hver farge i :root finnes i tokenfila', function () {
    var mangler = iRot.filter(function (n) { return !w3c.farge[n]; });
    t.erLik(mangler.length, 0, mangler.join(', '));
  });

  t.test('de to grønnene bærer hvert sitt kontrasttall', function () {
    /* Den ene er lesbar på hvitt, den andre på blekket. Blandes de, får
       brukeren 2,9:1. Tallet skal stå i beskrivelsen, ikke i hukommelsen. */
    t.erSann(/mot blekket 2\.\d+:1/.test(w3c.farge['brand'].$description));
    t.erSann(/mot blekket 7\.\d+:1/.test(w3c.farge['brand-pa-mork'].$description));
  });

  t.test('aliaset er en referanse, ikke en kopi', function () {
    t.erLik(w3c.farge['ok'].$value, '{farge.brand-dark}');
  });
})();

t.oppsummer('Enhetstester');
