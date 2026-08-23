/* Tegner delingsbildene. Kjøres for hånd:  node verktoy/lag-og.js
   Playwright hentes fra global sti, som i tests/e2e.test.js – prosjektet har
   fortsatt ingen avhengigheter i det som sendes til nettleseren.

   Ordene hentes fra PP_KLARHET og PP_MERKESPRAK, ikke skrevet inn her. Et
   delingsbilde som sier noe annet enn produktet, er det siste noen oppdager:
   det vises jo bare utenfor sida. Da er det bedre at det ikke kan skje. */

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

global.window = global;
require('../assets/js/besok-vern.js');
require('../assets/js/sprak-ui.js');
require('../assets/js/ekspertbistand.js');
require('../assets/js/klarhet.js');

const K = global.PP_KLARHET;

/* Adressen står ett sted. Endres domenet, endres det her. */
const ADRESSE = 'naviarcare.com';

const TEKST = {
  tittel: K.NAVN.lofte,          // «Få riktig hjelp på 45 minutter.»
  under: K.NAVN.slagord,         // «Én samtale. Tre tydelige neste steg.»
  bunn: K.NAVN.altmelding,       // «Familien kan bestille. Den eldre bestemmer.»
  adresse: ADRESSE
};

const FORMATER = [
  { id: 'og',      fil: 'naviar-og.png',         bredde: 1200, hoyde: 630 },
  { id: 'twitter', fil: 'naviar-twitter.png',    bredde: 1200, hoyde: 675 },
  { id: 'kvadrat', fil: 'naviar-og-kvadrat.png', bredde: 1200, hoyde: 1200 }
];

(async () => {
  const nettleser = await chromium.launch();
  const side = await nettleser.newPage({ deviceScaleFactor: 1 });

  const feil = [];
  side.on('pageerror', e => feil.push(e.message));

  await side.goto('file://' + path.resolve(__dirname, 'og.html'),
                  { waitUntil: 'domcontentloaded' });

  /* Google Fonts må rekke å laste, ellers settes teksten i en reservefont og
     bildet ser ut som en annen merkevare. Vi venter på skrifta, ikke på tid. */
  await side.waitForFunction(() => document.fonts.check('700 86px Inter'),
                             null, { timeout: 20000 });

  for (const f of FORMATER) {
    await side.setViewportSize({ width: f.bredde, height: f.hoyde });
    await side.evaluate(([id, tekst]) => window.tegn(id, tekst), [f.id, TEKST]);
    const mal = path.resolve(__dirname, '../assets/img/', f.fil);
    await side.locator('.flate').screenshot({ path: mal });
    console.log(f.fil.padEnd(26), f.bredde + '×' + f.hoyde);
  }

  if (feil.length) {
    console.error('Feil under tegning:', feil);
    process.exitCode = 1;
  }
  await nettleser.close();
})();
