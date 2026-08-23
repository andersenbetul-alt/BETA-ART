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

t.oppsummer('Enhetstester');
