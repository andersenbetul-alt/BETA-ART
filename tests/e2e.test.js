/* Nettlesertester i Chromium.
   Kjøres av `npm test`, som starter en lokal server først.
   Playwright hentes lokalt om det finnes, ellers globalt. */

var t = require('./hjelpere');

function hentPlaywright() {
  try { return require('playwright'); } catch (e) {}
  var globale = [
    '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
    '/usr/local/lib/node_modules/playwright'
  ];
  for (var i = 0; i < globale.length; i++) {
    try { return require(globale[i]); } catch (e) {}
  }
  return null;
}

var pw = hentPlaywright();
var BASE = process.env.PP_BASE || 'http://localhost:8765/';

if (!pw) {
  console.log('\nNettlesertester hoppet over: Playwright er ikke installert.');
  console.log('Installer med `npm install --save-dev playwright` eller kjør bare `npm run test:enhet`.');
  process.exit(0);
}

(async function () {
  var browser = await pw.chromium.launch();
  var jsFeil = [];

  async function nySide(bredde, hoyde) {
    var side = await browser.newPage({ viewport: { width: bredde || 1280, height: hoyde || 900 } });
    // Eksterne skrifter er irrelevante for testene og treige i lukkede miljøer.
    await side.route('**://fonts.googleapis.com/**', function (r) { r.abort(); });
    await side.route('**://fonts.gstatic.com/**', function (r) { r.abort(); });
    side.on('pageerror', function (e) { jsFeil.push(e.message); });
    side.on('console', function (m) {
      if (m.type() !== 'error') return;
      // Skriftfilene blokkeres bevisst i testene; det er ikke en applikasjonsfeil.
      var url = (m.location() && m.location().url) || '';
      if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return;
      jsFeil.push(m.text() + (url ? ' (' + url + ')' : ''));
    });
    return side;
  }

  async function godtaInformasjonskapsler(side) {
    var banner = await side.$('#cookie-banner:not([hidden])');
    if (banner) await side.click('[data-cookie="necessary"]');
  }

  /* ---------------- sider laster ---------------- */

  t.gruppe('Alle sider laster');

  var SIDER = [
    ['index.html', 'PårørendePilot'],
    ['trenger-hjelp.html', 'Jeg trenger hjelp'],
    ['familie.html', 'For pårørende'],
    ['bli-hjelper.html', 'Bli hjelper'],
    ['oppdrag.html', 'Oppdragstavla'],
    ['drift.html', 'Driftskonsoll'],
    ['trygghet.html', 'Trygghet'],
    ['personvern.html', 'Personvernerklæring']
  ];

  var side = await nySide();
  for (var i = 0; i < SIDER.length; i++) {
    var fil = SIDER[i][0], forventet = SIDER[i][1];
    var svar = await side.goto(BASE + fil, { waitUntil: 'domcontentloaded' });
    var tittel = await side.title();
    (function (fil, forventet, status, tittel) {
      t.test(fil, function () {
        t.erLik(status, 200, 'HTTP-status');
        t.erSann(tittel.indexOf(forventet) !== -1, 'tittel «' + tittel + '» mangler «' + forventet + '»');
      });
    })(fil, forventet, svar.status(), tittel);
  }

  /* ---------------- bestilling ---------------- */

  t.gruppe('Bestilling (Senior Mode)');

  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await godtaInformasjonskapsler(side);

  var fortsettAvSlått = await side.isDisabled('#senior-neste');
  t.test('kan ikke gå videre uten å velge tidspunkt', function () { t.erSann(fortsettAvSlått); });

  await side.click('[data-nar="idag"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="handling"]');
  await side.click('#senior-neste');
  await side.click('[data-timer="1.5"]');
  await side.click('#senior-neste');

  var total = await side.textContent('#pris-total');
  var antallLinjer = await side.locator('.pris-linje').count();
  t.test('pris vises før bestilling', function () {
    t.erSann(/\d/.test(total), 'totalsum: ' + total);
    t.erSann(antallLinjer >= 4, 'antall prislinjer: ' + antallLinjer);
  });

  var bestillSynlig = await side.isVisible('#senior-bestill');
  var fortsettSynlig = await side.isVisible('#senior-neste');
  t.test('riktig knapp vises på siste steg', function () {
    t.erSann(bestillSynlig, 'bestillingsknapp skal vises');
    t.erUsann(fortsettSynlig, 'fortsett-knapp skal være skjult');
  });

  await side.click('#senior-bestill');
  await side.waitForSelector('[data-panel="6"]:not([hidden])', { timeout: 20000 });
  var hjelperNavn = await side.textContent('.hjelper-navn');
  t.test('matching foreslår en hjelper', function () { t.erSann(hjelperNavn.trim().length > 0); });

  await side.click('#bekreft-hjelper');
  await side.waitForSelector('[data-panel="7"]:not([hidden])');
  var oppmoteKode = await side.textContent('[data-panel="7"]');
  t.test('bekreftelsen viser oppmøtekoden', function () {
    t.erSann(oppmoteKode.indexOf('4821') !== -1, 'oppmøtekode mangler i bekreftelsen');
  });

  t.gruppe('Akuttfilter');

  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="na"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="annet"]');
  await side.fill('#beskrivelse', 'Mamma har falt på gulvet og blør');
  await side.click('#senior-neste');
  var nodVist = await side.isVisible('#nod-varsel');
  var fortsattPaSteg2 = await side.isVisible('[data-panel="2"]');
  t.test('akutt beskrivelse viser nødnumre i stedet for å opprette oppdrag', function () {
    t.erSann(nodVist, 'nødvarsel skal vises');
    t.erSann(fortsattPaSteg2, 'bestillingen skal ikke gå videre');
  });

  /* Kjeden som tidligere slo av vernet: et falskt varsel avvises, og
     alt som skrives etterpå slipper gjennom uten kontroll. */
  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="idag"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="annet"]');

  await side.fill('#beskrivelse', 'Kan du bære ut avfallet?');
  await side.locator('#beskrivelse').blur();
  await side.waitForTimeout(150);
  var falskAlarm = await side.isVisible('#nod-varsel');
  t.test('ufarlig tekst med ordet «avfallet» gir ingen alarm', function () {
    t.erUsann(falskAlarm, 'ordgrenser skal hindre treff inne i ord');
  });

  await side.fill('#beskrivelse', 'Hun falt i går og er litt øm');
  await side.locator('#beskrivelse').blur();
  await side.waitForTimeout(150);
  var gultVist = await side.isVisible('#gul-varsel');
  await side.click('#senior-neste');
  var slapUtVidere = await side.isVisible('[data-panel="3"]');
  t.test('gult varsel spør, men stopper ikke bestillingen', function () {
    t.erSann(gultVist, 'gult varsel skal vises');
    t.erSann(slapUtVidere, 'brukeren skal komme videre');
  });

  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="idag"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="annet"]');
  await side.fill('#beskrivelse', 'akutt behov');
  await side.locator('#beskrivelse').blur();
  await side.waitForSelector('#nod-varsel:not([hidden])');
  await side.click('#nod-lukk');
  await side.fill('#beskrivelse', 'Hun puster ikke ordentlig');
  await side.locator('#beskrivelse').blur();
  await side.waitForTimeout(150);
  var vernetHolder = await side.isVisible('#nod-varsel');
  t.test('avvist varsel slår ikke av vernet for ny tekst', function () {
    t.erSann(vernetHolder, 'nytt akuttord etter avvisning skal varsle på nytt');
  });

  /* Hasteporten: ved «nå» spør vi om bevissthet og pust uansett tekst. */
  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="na"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="handling"]');
  await side.click('#senior-neste');
  await side.click('[data-timer="1"]');
  await side.click('#senior-neste');
  var portVist = await side.isVisible('#hasteport');
  t.test('hastegrad «nå» viser sikkerhetsspørsmålet', function () {
    t.erSann(portVist);
  });

  await side.click('#senior-bestill');
  var stoppetUbesvart = await side.isVisible('[data-panel="4"]');
  t.test('ubesvart sikkerhetsspørsmål stopper bestillingen', function () {
    t.erSann(stoppetUbesvart, 'skal ikke gå videre uten svar');
  });

  await side.click('[data-hasteport="vetikke"]');
  await side.waitForTimeout(150);
  var nodVedTvil = await side.isVisible('#nod-varsel');
  t.test('«vet ikke» viser nødnumrene', function () { t.erSann(nodVedTvil); });

  await side.click('[data-hasteport="ja"]');
  await side.click('#senior-bestill');
  await side.waitForSelector('[data-panel="5"]:not([hidden])', { timeout: 10000 });
  t.test('«ja» slipper bestillingen gjennom', function () { t.erSann(true); });

  /* ---------------- registrering ---------------- */

  t.gruppe('Hjelperregistrering');

  await side.goto(BASE + 'bli-hjelper.html', { waitUntil: 'domcontentloaded' });
  await godtaInformasjonskapsler(side);

  await side.click('#next-btn');
  var feilVist = await side.isVisible('[data-error-for="fornavn"].show');
  t.test('tomt skjema gir feilmelding', function () { t.erSann(feilVist); });

  await side.fill('#fornavn', 'Sofia');
  await side.fill('#etternavn', 'Hansen');
  await side.fill('#fodselsdato', '2012-01-01');
  await side.fill('#epost', 'sofia@example.no');
  await side.fill('#telefon', '+47 400 12 345');
  await side.click('#next-btn');
  var alderFeil = await side.isVisible('[data-error-for="fodselsdato"].show');
  t.test('under 18 år avvises', function () { t.erSann(alderFeil); });

  await side.fill('#fodselsdato', '1991-04-12');
  await side.fill('#epost', 'ikke-en-epost');
  await side.click('#next-btn');
  var epostFeil = await side.isVisible('[data-error-for="epost"].show');
  t.test('ugyldig e-post avvises', function () { t.erSann(epostFeil); });

  await side.fill('#epost', 'sofia@example.no');
  await side.click('#next-btn');
  var maVerifisere = await side.isVisible('[data-error-for="telefonVerifisert"].show');
  t.test('mobil må bekreftes før neste steg', function () { t.erSann(maVerifisere); });

  await side.click('#send-otp');
  await side.waitForSelector('#otp-field:not([hidden])');
  var status = await side.textContent('#otp-status');
  var kode = (status.match(/\d{6}/) || [])[0];

  await side.fill('#otp', '000000');
  await side.click('#verify-otp');
  await side.waitForSelector('[data-error-for="otp"].show');
  t.test('feil engangskode avvises', function () { t.erSann(true); });

  await side.fill('#otp', kode);
  await side.click('#verify-otp');
  await side.waitForSelector('#otp-status strong');   // «✓ Mobilnummer bekreftet»
  await side.click('#next-btn');
  await side.waitForSelector('fieldset[data-step="2"]:not([hidden])');

  await side.fill('#by', 'Oslo');
  await side.fill('#postnummer', '015');
  await side.check('input[name="maksAvstand"][value="5"]');
  await side.check('input[name="transport"][value="kollektiv"]');
  await side.click('#next-btn');
  var postFeil = await side.isVisible('[data-error-for="postnummer"].show');
  t.test('postnummer må ha fire siffer', function () { t.erSann(postFeil); });

  await side.fill('#postnummer', '0150');
  await side.click('#next-btn');
  await side.check('input[name="dager"][value="tirsdag"]');
  await side.check('input[name="tidsrom"][value="formiddag"]');
  await side.click('#next-btn');
  await side.check('input[name="oppgaver"][value="handling"]');
  await side.click('#next-btn');

  await side.fill('#ref1Navn', 'Kari Nordmann');
  await side.fill('#ref1Telefon', '40011223');
  await side.fill('#ref2Navn', 'Ola Hansen');
  await side.fill('#ref2Telefon', '40099887');
  await side.check('input[name="utbetaling"][value="foretak"]');
  await side.click('#next-btn');
  var orgFeil = await side.isVisible('[data-error-for="orgnummer"].show');
  t.test('organisasjonsnummer kreves for foretak', function () { t.erSann(orgFeil); });

  await side.check('input[name="utbetaling"][value="privat"]');
  await side.click('#next-btn');
  await side.waitForSelector('fieldset[data-step="6"]:not([hidden])');

  var oppsummering = await side.textContent('#summary-list');
  t.test('oppsummeringen viser navn og at posisjon ikke er delt', function () {
    t.erSann(oppsummering.indexOf('Sofia Hansen') !== -1);
    t.erSann(oppsummering.indexOf('Ikke delt') !== -1);
  });

  await side.click('#submit-btn');
  var samtykkeFeil = await side.isVisible('[data-error-for="samtykker"].show');
  t.test('innsending krever samtykker', function () { t.erSann(samtykkeFeil); });

  await side.check('#samtykkeVilkar');
  await side.check('#samtykkePersonvern');
  await side.check('#samtykkeReferanser');
  await side.click('#submit-btn');
  await side.waitForSelector('fieldset[data-step="7"]:not([hidden])', { timeout: 15000 });
  var referanse = await side.textContent('#receipt-ref');
  t.test('kvittering med referansenummer', function () {
    t.erSann(/^PP-\d{6}-\d{4}$/.test(referanse.trim()), 'referanse: ' + referanse);
  });

  /* ---------------- oppdragstavla ---------------- */

  t.gruppe('Oppdragstavla og adressevern');

  await side.goto(BASE + 'oppdrag.html', { waitUntil: 'domcontentloaded' });
  await godtaInformasjonskapsler(side);

  var oppdragSynligAv = await side.isVisible('.oppdrag-kort').catch(function () { return false; });
  var posisjonSynligAv = await side.isVisible('#posisjon-boks');
  t.test('utilgjengelig: ingen oppdrag og ingen posisjonsforespørsel', function () {
    t.erUsann(oppdragSynligAv);
    t.erUsann(posisjonSynligAv);
  });

  await side.click('#tilgjengelig-bryter');
  await side.waitForSelector('.oppdrag-kort');
  var antallOppdrag = await side.locator('.oppdrag-kort').count();
  var antallSkjulte = await side.locator('#skjulte-liste li').count();
  var posisjonSynligPa = await side.isVisible('#posisjon-boks');
  t.test('tilgjengelig: oppdrag vises og posisjon etterspørres', function () {
    t.erSann(antallOppdrag > 0, 'antall oppdrag: ' + antallOppdrag);
    t.erSann(posisjonSynligPa);
  });
  t.test('oppdrag som holdes utenfor, har en begrunnelse', function () {
    t.erSann(antallSkjulte > 0, 'antall skjulte: ' + antallSkjulte);
  });

  var innholdFor = await side.content();
  t.test('adressen finnes ikke før oppdraget er tatt', function () {
    t.erUsann(innholdFor.indexOf('Frognerveien') !== -1);
  });

  await side.click('[data-ta="o-1"]');
  await side.waitForSelector('#kode-felt');
  var innholdEtterTildeling = await side.content();
  t.test('adressen vises når oppdraget er tildelt', function () {
    t.erSann(innholdEtterTildeling.indexOf('Frognerveien') !== -1);
  });

  await side.fill('#kode-felt', '1111');
  await side.click('#sjekk-inn');
  var kodeFeil = await side.isVisible('#kode-feil.show');
  t.test('feil oppmøtekode avvises', function () { t.erSann(kodeFeil); });

  await side.fill('#kode-felt', '4821');
  await side.click('#sjekk-inn');
  await side.waitForSelector('#sjekk-ut');
  await side.click('#sjekk-ut');
  await side.waitForSelector('#tilbake-tavle');
  await side.click('#tilbake-tavle');
  await side.waitForSelector('.oppdrag-kort');
  var innholdEtterFullfort = await side.content();
  t.test('adressen skjules igjen etter fullført oppdrag', function () {
    t.erUsann(innholdEtterFullfort.indexOf('Frognerveien') !== -1);
  });

  await side.click('#tilgjengelig-bryter');
  var oppdragEtterAv = await side.isVisible('.oppdrag-kort').catch(function () { return false; });
  t.test('bryteren av stopper visning av oppdrag', function () { t.erUsann(oppdragEtterAv); });

  /* ---------------- driftskonsoll ---------------- */

  t.gruppe('Driftskonsoll');

  await side.goto(BASE + 'drift.html', { waitUntil: 'domcontentloaded' });
  await godtaInformasjonskapsler(side);

  var antallKpi = await side.locator('.kpi').count();
  var forsteSak = await side.textContent('.sak h3');
  t.test('hendelseskøen åpnes først, med P1 øverst', function () {
    t.erSann(antallKpi === 5, 'antall nøkkeltall: ' + antallKpi);
    t.erSann(forsteSak.indexOf('BankID') !== -1, 'første sak: ' + forsteSak);
  });

  var bruttFrist = await side.locator('.frist.brutt').count();
  t.test('oversittet svarfrist markeres', function () { t.erSann(bruttFrist > 0); });

  await side.click('[data-handling="frys"]');
  var loggTekst = await side.textContent('#logg-liste');
  t.test('frysing av konto logges', function () {
    t.erSann(loggTekst.indexOf('fryst') !== -1, 'logg: ' + loggTekst.slice(0, 120));
  });

  await side.click('[data-ko="soknader"]');
  await side.waitForSelector('[data-soknad]');
  var godkjennAvslatt = await side.isDisabled('[data-soknad="S-2043"] [data-handling="godkjenn"]');
  t.test('søknad med manglende steg kan ikke godkjennes', function () { t.erSann(godkjennAvslatt); });

  var godkjennKlar = await side.isDisabled('[data-soknad="S-2042"] [data-handling="godkjenn"]');
  t.test('søknad med alle steg fullført kan godkjennes', function () { t.erUsann(godkjennKlar); });

  await side.click('[data-soknad="S-2042"] [data-handling="godkjenn"]');
  var loggEtter = await side.textContent('#logg-liste');
  t.test('godkjenning logges med navn og nivå', function () {
    t.erSann(loggEtter.indexOf('S-2042') !== -1 && loggEtter.indexOf('nivå 1') !== -1);
  });

  await side.click('[data-ko="rutiner"]');
  var rutiner = await side.textContent('#ko-innhold');
  t.test('rutinefanen viser alvorsgrader og eskaleringsstige', function () {
    t.erSann(rutiner.indexOf('Eskaleringsstige') !== -1);
    t.erSann(rutiner.indexOf('72-timersfrist') !== -1);
  });

  /* ---------------- mobil ---------------- */

  t.gruppe('Mobilvisning');

  var mobil = await nySide(390, 844);
  for (var j = 0; j < SIDER.length; j++) {
    await mobil.goto(BASE + SIDER[j][0], { waitUntil: 'domcontentloaded' });
    var flyter = await mobil.evaluate(function () {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    (function (fil, flyter) {
      t.test(fil + ' uten horisontal rulling', function () { t.erUsann(flyter, 'siden flyter utover skjermen'); });
    })(SIDER[j][0], flyter);
  }

  t.gruppe('Ingen JavaScript-feil');
  t.test('konsollen er ren på alle sider', function () {
    t.erLik(jsFeil, [], 'feil funnet');
  });

  await browser.close();
  t.oppsummer('Nettlesertester');
})().catch(function (e) {
  console.error('\nTestkjøringen stoppet:', e.message);
  process.exit(1);
});
