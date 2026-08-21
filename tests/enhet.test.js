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

t.oppsummer('Enhetstester');
