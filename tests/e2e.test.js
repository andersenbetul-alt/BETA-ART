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
    ['index.html', 'Naviar'],
    ['trenger-hjelp.html', 'Jeg trenger hjelp'],
    ['familie.html', 'For pårørende'],
    ['bli-hjelper.html', 'Bli hjelper'],
    ['oppdrag.html', 'Oppdragstavla'],
    ['drift.html', 'Driftskonsoll'],
    ['trygghet.html', 'Trygghet'],
    ['personvern.html', 'Personvernerklæring'],
    ['klarhet.html', 'Naviar Klarhet'],
    ['bestill.html', 'Velg ekspert og tid'],
    ['godkjenn.html', 'Kari Hansen']
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

  /* ---------------- innsyn for pårørende ---------------- */

  t.gruppe('Hva familien får vite');

  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="idag"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="handling"]');
  await side.click('#senior-neste');
  await side.click('[data-timer="1"]');
  await side.click('#senior-neste');

  var forvalgt = await side.inputValue('input[name="innsyn"]:checked').catch(function () { return null; });
  var ingenErValgt = await side.isChecked('input[name="innsyn"][value="ingen"]');
  t.test('ingen deling er forvalgt', function () {
    t.erSann(ingenErValgt, 'det mest lukkede nivået skal være standard, fikk: ' + forvalgt);
  });

  await side.click('#senior-bestill');
  await side.waitForSelector('[data-panel="6"]:not([hidden])', { timeout: 20000 });
  await side.click('#bekreft-hjelper');
  await side.waitForSelector('[data-panel="7"]:not([hidden])');
  var utenDeling = await side.textContent('#varsel-status');
  t.test('kvitteringen sier at familien ikke får beskjed', function () {
    t.erSann(utenDeling.indexOf('ikke beskjed') !== -1, 'fikk: ' + utenDeling);
  });

  await side.goto(BASE + 'trenger-hjelp.html', { waitUntil: 'domcontentloaded' });
  await side.click('[data-nar="idag"]');
  await side.click('#senior-neste');
  await side.click('[data-oppgave="handling"]');
  await side.click('#senior-neste');
  await side.click('[data-timer="1"]');
  await side.click('#senior-neste');
  await side.check('input[name="innsyn"][value="underveis"]');
  await side.click('#senior-bestill');
  await side.waitForSelector('[data-panel="6"]:not([hidden])', { timeout: 20000 });
  await side.click('#bekreft-hjelper');
  await side.waitForSelector('[data-panel="7"]:not([hidden])');
  var medDeling = await side.textContent('#varsel-status');
  t.test('valgt nivå styrer kvitteringen', function () {
    t.erSann(medDeling.indexOf('underveis') !== -1, 'fikk: ' + medDeling);
  });

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

  /* Grensen mot helsehjelp holder bare hvis hjelperen har et sted å si nei. */
  await side.goto(BASE + 'oppdrag.html', { waitUntil: 'domcontentloaded' });
  await side.click('#tilgjengelig-bryter');
  await side.waitForSelector('.oppdrag-kort');
  await side.click('[data-ta="o-1"]');
  await side.waitForSelector('#kode-felt');
  await side.fill('#kode-felt', '4821');
  await side.click('#sjekk-inn');
  await side.waitForSelector('#utenfor-oppdrag');
  t.test('hjelperen kan melde fra om forespørsel utenfor oppdraget', function () { t.erSann(true); });

  await side.click('#utenfor-oppdrag');
  await side.check('input[name="utenfor"][value="medisin"]');
  await side.click('#send-utenfor');
  await side.waitForTimeout(150);
  var kvittert = await side.textContent('.oppdrag-kort');
  t.test('meldingen bekreftes uten følger for hjelperen', function () {
    t.erSann(kvittert.indexOf('Meldingen er sendt') !== -1);
    t.erSann(kvittert.indexOf('gjort det riktige') !== -1);
  });

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


  /* ---------------- Naviar Care (besok/) ----------------

     Produktet vi faktisk selger. Fram til nå hadde det null nettlesertester:
     alle 60 dekket den parkerte markedsplassen. Sidene under er endret mye –
     nytt merke, ny palett, fritekstsperre, femte utfall – uten at noe fanget
     det opp. */

  t.gruppe('Naviar Care – sidene laster');

  var BESOK = [
    ['besok/index.html',     'Naviar Care'],
    ['besok/logg-inn.html',  'Logg inn'],
    ['besok/nytt.html',      'Nytt besøk'],
    ['besok/oversikt.html',  'Oversikt'],
    ['besok/historikk.html', 'Historikk'],
    ['besok/utfor.html',     'besøk'],
    ['besok/bli-medarbeider.html', 'Bli medarbeider']
  ];

  for (var b = 0; b < BESOK.length; b++) {
    var bside = await nySide();
    await bside.goto(BASE + BESOK[b][0], { waitUntil: 'domcontentloaded' });
    var btittel = await bside.title();
    await bside.close();
    (function (fil, tittel) {
      t.test(fil, function () { t.erSann(tittel.length > 0, 'siden har ingen tittel'); });
    })(BESOK[b][0], btittel);
  }

  /* ---------------- hele flyten ---------------- */

  t.gruppe('Naviar Care – ett besøk fra start til familiemelding');

  var flyt = await nySide();
  await flyt.goto(BASE + 'besok/nytt.html', { waitUntil: 'domcontentloaded' });
  await flyt.waitForSelector('#oppgaveliste input');

  await flyt.fill('#kunde', 'Ingrid');
  await flyt.check('#oppgaveliste input[value="hent"]');
  await flyt.fill('#dato', '2026-09-01');
  await flyt.fill('#tid', '14:00');
  var ansatte = await flyt.$$eval('#ansatt option', function (o) {
    return o.map(function (x) { return x.value; }).filter(Boolean);
  });
  await flyt.selectOption('#ansatt', ansatte[0]);
  await flyt.fill('#parorende', 'datter@epost.no');

  /* Fritekstsperren: helseopplysning skal stoppe innsending. */
  await flyt.fill('#notat', 'Husk å gi henne tabletten klokka to');
  await flyt.click('#nytt-skjema button[type="submit"]');
  var sperret = await flyt.isVisible('#kvittering').catch(function () { return false; });
  t.test('helseopplysning i beskjeden stopper innsending', function () {
    t.erUsann(sperret, 'besøket ble opprettet med helseopplysning i notatet');
  });

  var feilTekst = await flyt.textContent('[data-error-for="notat"]').catch(function () { return ''; });
  t.test('sperren forklarer hva man skal skrive i stedet', function () {
    t.erSann((feilTekst || '').length > 20, 'ingen forklaring vist');
  });

  /* Praktisk beskjed skal gå gjennom. */
  await flyt.fill('#notat', 'Ring på hos naboen hvis hun ikke åpner');
  await flyt.click('#nytt-skjema button[type="submit"]');
  await flyt.waitForSelector('#kvittering:not([hidden])', { timeout: 5000 });

  var lenke = await flyt.textContent('#k-lenke');
  t.test('praktisk beskjed slipper gjennom og gir arbeiderlenke', function () {
    t.erSann((lenke || '').indexOf('utfor.html') !== -1, 'ingen arbeiderlenke: ' + lenke);
  });

  var token = ((lenke || '').match(/[?&]t=([a-z0-9]+)/) || [])[1];
  t.test('lenken inneholder en engangskode', function () {
    t.erSann(!!token && token.length > 8, 'token mangler');
  });

  /* Arbeideren utfører besøket. */
  await flyt.goto(BASE + 'besok/utfor.html?t=' + token, { waitUntil: 'domcontentloaded' });
  await flyt.waitForSelector('#skjema:not([hidden])', { timeout: 5000 });

  var utfallKnapper = await flyt.$$eval('[data-utfall]', function (k) {
    return k.map(function (x) { return x.getAttribute('data-utfall'); });
  });
  t.test('alle fem utfall er tilgjengelige', function () {
    ['utfort', 'delvis', 'ikke_utfort', 'oppfolging', 'kontakt_familie'].forEach(function (u) {
      t.erSann(utfallKnapper.indexOf(u) !== -1, 'mangler utfall: ' + u);
    });
  });

  await flyt.click('[data-utfall="utfort"]');
  await flyt.fill('#kommentar', 'Hun falt ikke, men hun var litt ustø');
  await flyt.click('#send');
  var slappGjennom = await flyt.isVisible('#ferdig:not([hidden])').catch(function () { return false; });
  t.test('melding om fall stoppes også i arbeiderskjemaet', function () {
    t.erUsann(slappGjennom, 'rapport med «falt» ble sendt inn');
  });

  await flyt.fill('#kommentar', 'Varene er satt på plass');
  await flyt.click('#send');
  await flyt.waitForSelector('#ferdig:not([hidden])', { timeout: 5000 });

  var melding = await flyt.textContent('#f-melding').catch(function () { return ''; });
  t.test('familiemeldingen er klar etter fullført besøk', function () {
    t.erSann((melding || '').length > 20, 'ingen familiemelding');
  });
  t.test('familiemeldingen sier ikke at noen er trygg', function () {
    t.erSann(!/trygg|i sikkerhet/i.test(melding || ''), 'meldingen lover trygghet: ' + melding);
  });

  /* Lenken er brukt opp. */
  await flyt.goto(BASE + 'besok/utfor.html?t=' + token, { waitUntil: 'domcontentloaded' });
  await flyt.waitForTimeout(300);
  var sperre = await flyt.isVisible('#sperret:not([hidden])').catch(function () { return false; });
  t.test('lenken kan ikke brukes to ganger', function () {
    t.erSann(sperre, 'lenken virket fortsatt etter innsending');
  });
  await flyt.close();

  /* ---------------- mobil ---------------- */


  t.gruppe('Registrering av medarbeider');

  var reg = await nySide();
  await reg.goto(BASE + 'besok/bli-medarbeider.html', { waitUntil: 'domcontentloaded' });
  await reg.waitForSelector('#bekreftelser input');

  var harFil = await reg.$$eval('input[type="file"]', function (a) { return a.length; });
  t.test('skjemaet tar ikke imot filer', function () {
    /* En CV vi har mottatt, er vår å sikre og slette - også når vi ikke ba
       om den. Sperren skal stå i skjemaet, ikke i en instruks. */
    t.erLik(harFil, 0);
  });

  var tekst = await reg.textContent('#ikke-lagres');
  t.test('siden sier hva den ikke spør om', function () {
    t.erSann(/fødselsdato/i.test(tekst || ''), tekst);
    t.erSann(/cv/i.test(tekst || ''), tekst);
  });

  var frist = await reg.textContent('#slettefrist');
  t.test('slettefristen står før knappen, ikke i en erklæring', function () {
    t.erSann(/90 dager/.test(frist || ''), frist);
  });

  await reg.fill('#fornavn', 'Sofia');
  await reg.fill('#etternavn', 'Hansen');
  await reg.fill('#telefon', '90000000');
  await reg.fill('#epost', 'sofia@example.no');
  await reg.fill('#bydel', 'Sagene');
  await reg.selectOption('#transport', 'kollektiv');
  await reg.selectOption('#norsknivaa', 'B1');
  await reg.check('#dagerliste input[value="Tirsdag"]');
  await reg.check('#tiderliste input[value="formiddag"]');
  await reg.fill('#ref1', 'Kari Nordmann, tidligere leder, 90000001');
  await reg.fill('#ref2', 'Per Olsen, frivilligsentralen, 90000002');
  var bokser = await reg.$$('#bekreftelser input');
  for (var bi = 0; bi < bokser.length; bi++) await bokser[bi].check();

  await reg.fill('#erfaring', 'Har hjulpet naboen med medisiner og blodtrykk');
  await reg.click('#soknad-skjema button[type="submit"]');
  await reg.waitForTimeout(200);
  var stoppet = await reg.isVisible('[data-error-for="erfaring"].show');
  t.test('helseopplysning i fritekst stopper søknaden', function () {
    t.erSann(stoppet, 'søknaden gikk gjennom med en helseopplysning');
  });

  await reg.fill('#erfaring', 'Har handlet og gått turer med naboen min i to år');
  await reg.click('#soknad-skjema button[type="submit"]');
  await reg.waitForSelector('#kvittering:not([hidden])', { timeout: 4000 });
  var kvitt = await reg.textContent('#kvittering-tekst');
  t.test('gyldig søknad gir kvittering med kontaktinformasjonen', function () {
    t.erSann(/Sofia/.test(kvitt || ''), kvitt);
    t.erSann(/sofia@example\.no/.test(kvitt || ''), kvitt);
  });

  var lagret = await reg.evaluate(function () {
    var b = JSON.parse(localStorage.getItem('pp_hjelperbase_v1') || '{}');
    return (b.kandidater || [])[0] || {};
  });
  t.test('bare de kjente feltene ligger i basen', function () {
    t.erSann(!('fodselsdato' in lagret) && !('bilde' in lagret) && !('adresse' in lagret),
      Object.keys(lagret).join(', '));
    t.erLik(lagret.status, 'ny');
  });
  await reg.close();

  t.gruppe('Naviar Care på mobil');

  var bmobil = await nySide(390, 844);
  for (var c = 0; c < BESOK.length; c++) {
    await bmobil.goto(BASE + BESOK[c][0], { waitUntil: 'domcontentloaded' });
    var bflyter = await bmobil.evaluate(function () {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    (function (fil, flyter) {
      t.test(fil + ' uten horisontal rulling', function () { t.erUsann(flyter, 'siden flyter utover skjermen'); });
    })(BESOK[c][0], bflyter);
  }
  await bmobil.close();

  t.gruppe('Naviar Klarhet');

  var kl = await nySide();
  await kl.goto(BASE + 'klarhet.html', { waitUntil: 'domcontentloaded' });

  var klForside = await kl.evaluate(function () {
    return {
      kategorier: document.querySelectorAll('#kategorivalg .k-valg').length,
      faner: document.querySelectorAll('.k-fane').length,
      eksperter: document.querySelectorAll('#utvalg .k-ekspert').length,
      steg: document.querySelectorAll('#stegliste li').length,
      sporsmaal: document.querySelectorAll('#sporsmaal .k-sporsmaal').length,
      pris: (document.getElementById('pris-tall') || {}).textContent || '',
      akutt: (document.getElementById('akuttvarsel') || {}).textContent || '',
      /* Bare språk som faktisk kan åpnes, skal stå i nedtrekket. */
      spraakvalg: document.querySelectorAll('#sprakvalg option').length,
      tittelTekst: document.body.textContent
    };
  });

  t.test('de tre pilotkategoriene vises, ikke alle ni', function () {
    t.erLik(klForside.kategorier, 3);
  });

  t.test('tre målgruppefaner', function () {
    t.erLik(klForside.faner, 3);
  });

  t.test('fire steg og tre spørsmål er tegnet fra modulene', function () {
    t.erLik(klForside.steg, 4);
    t.erLik(klForside.sporsmaal, 3);
  });

  t.test('pilotkategorien har eksperter', function () {
    t.erSann(klForside.eksperter >= 3, 'fant ' + klForside.eksperter);
  });

  t.test('prisen kommer fra modulen, ikke fra siden', function () {
    t.erSann(klForside.pris.indexOf('599') !== -1, klForside.pris);
  });

  t.test('akuttsetningen står på forsiden med begge numrene', function () {
    t.erSann(klForside.akutt.indexOf('116 117') !== -1);
    t.erSann(klForside.akutt.indexOf('113') !== -1);
  });

  t.test('bare godkjente språk står i nedtrekket', function () {
    t.erLik(klForside.spraakvalg, 1, 'bare norsk er godkjent ennå');
  });

  t.test('ingen pris eller nedtelling som ikke finnes i modulen', function () {
    t.erSann(klForside.tittelTekst.indexOf('plasser igjen') === -1);
    t.erSann(klForside.tittelTekst.indexOf('Kun i dag') === -1);
  });

  /* Fanene bytter faktisk innhold – ellers er de tre knapper som ser ut som
     et valg. */
  await kl.click('#fane-ekspert');
  var klEkspert = await kl.evaluate(function () {
    return {
      tittel: document.getElementById('hero-tittel').textContent,
      valgt: document.getElementById('fane-ekspert').getAttribute('aria-selected')
    };
  });
  t.test('fanen «Jeg er ekspert» bytter budskapet', function () {
    t.erLik(klEkspert.valgt, 'true');
    t.erSann(klEkspert.tittel.indexOf('erfaring') !== -1, klEkspert.tittel);
  });

  await kl.click('#fane-familie');

  /* Navigator: et valg skal gi et svar med grensene i, og en bestillingsknapp. */
  await kl.click('#kategorivalg .k-valg');
  var klValg = await kl.evaluate(function () {
    return {
      svarSynlig: !document.getElementById('navigator-svar').hidden,
      grenser: document.querySelectorAll('#navigator-svar li').length,
      bestillSynlig: !document.getElementById('bestillkort').hidden,
      eksperter: document.querySelectorAll('#ekspertliste .k-ekspert').length
    };
  });

  t.test('et kategorivalg gir svar, grenser og ledige eksperter', function () {
    t.erSann(klValg.svarSynlig);
    t.erSann(klValg.grenser >= 3, 'grensene skal stå i svaret');
    t.erSann(klValg.bestillSynlig);
    t.erSann(klValg.eksperter >= 3);
  });

  /* Bestillingen stopper på den eldres godkjenning. Gjør den ikke det, er
     «den eldre bestemmer» en setning i bunnteksten. */
  await kl.click('#ekspertliste .k-ekspert .btn');
  var klSamtykke = await kl.evaluate(function () {
    return document.getElementById('navigator-svar').textContent;
  });
  t.test('bestilling stopper uten den eldres godkjenning', function () {
    t.erSann(klSamtykke.indexOf('godkjenn') !== -1, klSamtykke.slice(0, 120));
  });

  await kl.close();

  var klMobil = await nySide(390, 844);
  await klMobil.goto(BASE + 'klarhet.html', { waitUntil: 'domcontentloaded' });
  var klFlyter = await klMobil.evaluate(function () {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  t.test('klarhet.html uten horisontal rulling på mobil', function () {
    t.erUsann(klFlyter, 'siden flyter utover skjermen');
  });
  await klMobil.close();

  t.gruppe('Bestilling av ekspertbistand');

  var be = await nySide(1440, 900);
  await be.goto(BASE + 'bestill.html', { waitUntil: 'domcontentloaded' });

  var beStart = await be.evaluate(function () {
    return {
      omraader: document.querySelectorAll('#omraadeliste .x-omraade').length,
      trinn: document.querySelectorAll('#fremdrift .x-trinn').length,
      knappSperret: document.getElementById('bestill').disabled,
      grenserSkjult: document.getElementById('omraade-grenser').hidden,
      /* Prisen står i panelet fra første skjerm. Dukker den opp til slutt,
         er den en overraskelse – og en overraskelse i pris er et skjult gebyr. */
      panel: document.getElementById('sammendrag').textContent,
      akutt: document.getElementById('akutt').textContent
    };
  });

  t.test('tre fagområder, tre trinn', function () {
    t.erLik(beStart.omraader, 3);
    t.erLik(beStart.trinn, 3);
  });

  t.test('bestillingsknappen er sperret før alt er valgt', function () {
    t.erSann(beStart.knappSperret);
  });

  t.test('prisen står i panelet fra første skjerm', function () {
    t.erSann(beStart.panel.indexOf('599') !== -1, beStart.panel);
    t.erSann(beStart.panel.indexOf('45') !== -1);
  });

  t.test('akuttsetningen står med begge numrene', function () {
    t.erSann(beStart.akutt.indexOf('116 117') !== -1);
    t.erSann(beStart.akutt.indexOf('113') !== -1);
  });

  t.test('grensene vises først når et område er valgt', function () {
    t.erSann(beStart.grenserSkjult);
  });

  await be.click('#omraadeliste .x-omraade');
  var beOmraade = await be.evaluate(function () {
    return {
      grenser: document.getElementById('omraade-grenser').textContent,
      eksperter: document.querySelectorAll('#ekspertliste .x-ekspert').length,
      tiderFor: document.querySelectorAll('.x-tid').length,
      knappSperret: document.getElementById('bestill').disabled
    };
  });

  t.test('et valgt område viser grensene og ekspertene', function () {
    t.erSann(beOmraade.grenser.length > 20, beOmraade.grenser);
    t.erSann(beOmraade.eksperter >= 2, 'fant ' + beOmraade.eksperter);
  });

  t.test('tidene vises ikke før en ekspert er valgt', function () {
    t.erLik(beOmraade.tiderFor, 0);
    t.erSann(beOmraade.knappSperret);
  });

  await be.click('#ekspertliste .x-ekspert-knapp');
  var beEkspert = await be.evaluate(function () {
    return {
      tider: document.querySelectorAll('.x-tid').length,
      tittel: document.querySelector('#ekspertliste .x-ekspert-navn small').textContent,
      knappSperret: document.getElementById('bestill').disabled
    };
  });

  t.test('tidene ligger inne i den valgte eksperten', function () {
    t.erSann(beEkspert.tider >= 2, 'fant ' + beEkspert.tider);
  });

  t.test('profilen sier «tidligere» og «uavhengig»', function () {
    t.erSann(beEkspert.tittel.indexOf('Tidligere') === 0, beEkspert.tittel);
    t.erSann(beEkspert.tittel.indexOf('uavhengig') !== -1, beEkspert.tittel);
  });

  t.test('knappen er fortsatt sperret uten en tid', function () {
    t.erSann(beEkspert.knappSperret);
  });

  await be.click('.x-tid');
  var beTid = await be.evaluate(function () {
    return {
      knappSperret: document.getElementById('bestill').disabled,
      panel: document.getElementById('sammendrag').textContent,
      ferdige: document.querySelectorAll('#fremdrift .x-trinn[data-tilstand="ferdig"]').length
    };
  });

  t.test('valgt tid åpner knappen og fyller panelet', function () {
    t.erUsann(beTid.knappSperret);
    t.erSann(beTid.panel.indexOf('Kari Hansen') !== -1, beTid.panel);
    t.erLik(beTid.ferdige, 2, 'to trinn skal være ferdige');
  });

  /* Selve regelen: bestillingen stopper på den eldres godkjenning. */
  await be.click('#bestill');
  var beSvar = await be.evaluate(function () {
    return {
      synlig: !document.getElementById('bekreft').hidden,
      tekst: document.getElementById('venter').textContent
    };
  });

  t.test('bestillingen stopper på den eldres godkjenning', function () {
    t.erSann(beSvar.synlig);
    t.erSann(beSvar.tekst.indexOf('godkjenn') !== -1, beSvar.tekst);
    t.erSann(beSvar.tekst.indexOf('Bestillingen er sendt') === -1,
             'skjermen skal ikke love noe systemet har sagt nei til');
  });

  /* Bytter kunden område, skal ekspert og tid falle bort – ellers står det
     en tid i panelet som hun tror hun har. */
  await be.click('#omraadeliste .x-omraade:nth-child(2)');
  var beBytte = await be.evaluate(function () {
    return {
      knappSperret: document.getElementById('bestill').disabled,
      panel: document.getElementById('sammendrag').textContent
    };
  });

  t.test('bytte av område nullstiller ekspert og tid', function () {
    t.erSann(beBytte.knappSperret);
    t.erSann(beBytte.panel.indexOf('Kari Hansen') === -1, beBytte.panel);
  });

  await be.close();

  var beMobil = await nySide(390, 844);
  await beMobil.goto(BASE + 'bestill.html', { waitUntil: 'domcontentloaded' });
  var beFlyter = await beMobil.evaluate(function () {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  t.test('bestill.html uten horisontal rulling på mobil', function () {
    t.erUsann(beFlyter, 'siden flyter utover skjermen');
  });
  await beMobil.close();

  t.gruppe('Den eldres godkjenningsskjerm');

  var go = await nySide(430, 932);
  await go.goto(BASE + 'godkjenn.html', { waitUntil: 'domcontentloaded' });

  var goStart = await go.evaluate(function () {
    var ja = document.getElementById('ja');
    var nei = document.getElementById('nei');
    var jr = ja.getBoundingClientRect();
    var nr = nei.getBoundingClientRect();
    return {
      detaljer: document.querySelectorAll('#detaljer div').length,
      grenser: document.querySelectorAll('#kan-ikke li').length,
      pris: document.getElementById('detaljer').textContent,
      /* Ingen forhåndsvalgt knapp: et ja som allerede står der, er ikke et
         samtykke. */
      jaValgt: ja.getAttribute('aria-pressed'),
      neiValgt: nei.getAttribute('aria-pressed'),
      /* De to svarene skal ha samme størrelse. En blek eller mindre
         nei-knapp er ikke et valg. */
      jaHoyde: Math.round(jr.height), neiHoyde: Math.round(nr.height),
      jaBredde: Math.round(jr.width), neiBredde: Math.round(nr.width),
      utfallSkjult: document.getElementById('utfall').hidden,
      fritt: document.querySelector('.g-fritt').textContent
    };
  });

  t.test('hun ser hva hun godkjenner før knappene', function () {
    t.erLik(goStart.detaljer, 5);
    t.erSann(goStart.grenser >= 3, 'grensene skal stå på hennes skjerm også');
    t.erSann(goStart.pris.indexOf('599') !== -1, 'prisen skal stå selv om hun ikke betaler');
  });

  t.test('ingen knapp er valgt på forhånd', function () {
    t.erLik(goStart.jaValgt, null);
    t.erLik(goStart.neiValgt, null);
    t.erSann(goStart.utfallSkjult);
  });

  t.test('ja og nei er like store', function () {
    t.erLik(goStart.jaHoyde, goStart.neiHoyde);
    t.erLik(goStart.jaBredde, goStart.neiBredde);
    t.erSann(goStart.jaHoyde >= 90, 'knappene er ' + goStart.jaHoyde + ' px høye');
  });

  t.test('det står at hun ikke trenger å begrunne', function () {
    t.erSann(goStart.fritt.indexOf('hvorfor') !== -1, goStart.fritt);
  });

  await go.click('#nei');
  var goNei = await go.evaluate(function () {
    var u = document.getElementById('utfall');
    return { tilstand: u.dataset.tilstand, tekst: u.textContent,
             felt: document.querySelectorAll('#utfall textarea, #utfall input').length };
  });

  t.test('nei gir et utfall, ikke et oppfølgingsspørsmål', function () {
    t.erLik(goNei.tilstand, 'avslatt');
    t.erSann(goNei.tekst.indexOf('blir det ikke noe av') !== -1, goNei.tekst);
    t.erLik(goNei.felt, 0, 'ingen skal spørre henne hvorfor');
  });

  t.test('familien får utfallet, ikke grunnen', function () {
    t.erSann(goNei.tekst.indexOf('Avtalen ble ikke noe av') !== -1);
  });

  await go.click('#ja');
  var goJa = await go.evaluate(function () {
    var u = document.getElementById('utfall');
    return { tilstand: u.dataset.tilstand, tekst: u.textContent };
  });

  t.test('ja bekrefter, og nevner angreretten', function () {
    t.erLik(goJa.tilstand, 'godkjent');
    t.erSann(goJa.tekst.indexOf('avlyse') !== -1, goJa.tekst);
  });

  var goFlyter = await go.evaluate(function () {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  t.test('godkjenn.html uten horisontal rulling på mobil', function () {
    t.erUsann(goFlyter, 'siden flyter utover skjermen');
  });

  /* Skriften skal være stor nok for målgruppa. 20 px er ikke pynt her. */
  var goSkrift = await go.evaluate(function () {
    return parseFloat(getComputedStyle(document.body).fontSize);
  });
  t.test('grunnskriften er minst 20 px', function () {
    t.erSann(goSkrift >= 20, 'fant ' + goSkrift + ' px');
  });

  await go.close();

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
