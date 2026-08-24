/* Merket skal ikke settes som levende tekst i en presentasjon. Ordmerket er
   satt i Inter og gjort om til flater nettopp fordi PowerPoint ikke arver noe
   – sporingen i CARE er 140/1000 em mot 55 i NAVIAR, og det gjengir ikke en
   charSpacing-verdi. Derfor rasteriseres logofilene som de er. */
const fs = require('fs'), { chromium } = require('playwright');
var KILDE = '/home/user/BETA-ART/assets/img/';
(async function () {
  var b = await chromium.launch();
  for (var f of ['naviar-care-logo-blekk', 'naviar-care-logo-negativ']) {
    var svg = fs.readFileSync(KILDE + f + '.svg', 'utf8');
    var pg = await b.newPage({ viewport: { width: 1259, height: 122 }, deviceScaleFactor: 2 });
    await pg.setContent('<style>html,body{margin:0;background:transparent}' +
      'svg{width:1259px;height:122px;display:block}</style>' + svg);
    await pg.screenshot({ path: __dirname + '/' + f + '.png', omitBackground: true });
    await pg.close();
  }
  await b.close(); console.log('ok');
})();
