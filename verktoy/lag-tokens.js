/* Naviar Care – tokens for Figma og for W3C-formatet, hentet fra styles.css.

   Et uttrekksverktøy leser den ferdige sida og finner bare de tokene som
   tilfeldigvis er i bruk der. Verre: det døper dem om til «primary»,
   «secondary», «accent». Da forsvinner det som betyr noe hos oss – at det
   finnes to grønner med hver sin flate, og at velger du feil, får du 2,9:1.

   Derfor leses :root i stedet, med kommentarene som står der. De blir
   description-felt i Figma, slik at designeren ser begrunnelsen ved siden av
   fargen.

   Kjøres for hånd:
     node verktoy/lag-tokens.js figma > design/naviar.figma.json
     node verktoy/lag-tokens.js w3c   > design/naviar.tokens.json  */

var fs = require('fs');
var path = require('path');

var css = fs.readFileSync(path.join(__dirname, '..', 'assets/css/styles.css'), 'utf8');
var rot = css.slice(css.indexOf(':root {'), css.indexOf('\n}', css.indexOf(':root {')));

/* Kommentaren over en gruppe variabler hører til dem. Blokkene går over
   flere linjer, så de må leses som blokker – ikke linje for linje. Første
   forsøk skjøtet sammen linjer med en regel som droppet de midterste, og ga
   halve setninger som beskrivelse i Figma. */
var tokens = [];
var naermesteKommentar = '';
var iKommentar = false;
var buffer = [];

rot.split('\n').forEach(function (linje) {
  if (!iKommentar && linje.indexOf('/*') !== -1) {
    var start = linje.slice(linje.indexOf('/*') + 2);
    if (start.indexOf('*/') !== -1) {                 // hel blokk på én linje
      naermesteKommentar = start.slice(0, start.indexOf('*/')).trim();
      return;
    }
    iKommentar = true; buffer = [start.trim()];
    return;
  }
  if (iKommentar) {
    if (linje.indexOf('*/') !== -1) {
      buffer.push(linje.slice(0, linje.indexOf('*/')).trim());
      naermesteKommentar = buffer.join(' ').replace(/\s+/g, ' ').trim();
      iKommentar = false;
    } else {
      buffer.push(linje.trim());
    }
    return;
  }
  var m = linje.match(/^\s*(--[a-z0-9-]+):\s*([^;]+);/);
  if (!m) return;
  tokens.push({
    navn: m[1].replace(/^--/, ''),
    verdi: m[2].trim(),
    hvorfor: naermesteKommentar
  });
  naermesteKommentar = '';
});

function erFarge(v) { return /^#[0-9a-f]{3,8}$/i.test(v); }

/* --ok: var(--brand-dark) er ikke en farge mindre, men en regel: «dette gikk
   bra» er merkevarefargen og ikke en egen grønn. Slippes aliaset ut, mister
   Figma nettopp den regelen. */
function slaaOpp(v) {
  var m = /^var\(--([a-z0-9-]+)\)$/.exec(v);
  if (!m) return v;
  var mal = tokens.filter(function (t) { return t.navn === m[1]; })[0];
  return mal ? slaaOpp(mal.verdi) : v;
}
function alias(v) { return /^var\(--[a-z0-9-]+\)$/.test(v); }
function erMaal(v) { return /^[\d.]+(px|rem|em|%)$/.test(v); }

function tilRgb(hex) {
  var h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
  return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255,
           b: parseInt(h.slice(4,6),16)/255, a: 1 };
}

/* Kontrast, så tallene i beskrivelsen ikke er noe noen husket feil. */
function lum(hex) {
  var c = tilRgb(hex);
  return [c.r, c.g, c.b].map(function (v) {
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  }).reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
}
function kontrast(a, b) {
  var l1 = lum(a), l2 = lum(b);
  return ((Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05)).toFixed(2);
}

var BLEKK = (tokens.filter(function (t) { return t.navn === 'ink'; })[0] || {}).verdi;

function beskrivelse(t) {
  var d = t.hvorfor || '';
  if (erFarge(slaaOpp(t.verdi)) && BLEKK && t.navn !== 'ink') {
    d += (d ? ' · ' : '') + 'Kontrast mot hvitt ' + kontrast(slaaOpp(t.verdi), '#ffffff') +
         ':1, mot blekket ' + kontrast(slaaOpp(t.verdi), BLEKK) + ':1';
  }
  return d;
}

var format = process.argv[2] || 'figma';

if (format === 'figma') {
  var farger = tokens.filter(function (t) { return erFarge(slaaOpp(t.verdi)); });
  var maal = tokens.filter(function (t) { return erMaal(t.verdi); });
  process.stdout.write(JSON.stringify({
    /* Navnene er våre. Et verktøy som døper --brand om til «primary», har
       kastet bort forskjellen på de to grønnene. */
    collections: [
      { name: 'Naviar farge', modes: ['standard'],
        variables: farger.map(function (t) {
          return { name: 'farge/' + t.navn, type: 'COLOR',
                   description: beskrivelse(t),
                   values: { standard: tilRgb(slaaOpp(t.verdi)) } };
        }) },
      { name: 'Naviar mål', modes: ['standard'],
        variables: maal.map(function (t) {
          return { name: 'maal/' + t.navn, type: 'FLOAT',
                   description: t.hvorfor,
                   values: { standard: parseFloat(t.verdi) } };
        }) }
    ]
  }, null, 2) + '\n');
} else {
  var ut = { $description: 'Naviar Care. Generert fra assets/css/styles.css av verktoy/lag-tokens.js.', farge: {}, maal: {} };
  tokens.forEach(function (t) {
    if (erFarge(slaaOpp(t.verdi))) {
      ut.farge[t.navn] = { $type: 'color', $value: slaaOpp(t.verdi), $description: beskrivelse(t) };
      /* W3C-formatet har egen syntaks for referanser. Da ser den som leser
         fila at dette er samme farge med vilje, ikke to like ved et uhell. */
      if (alias(t.verdi)) ut.farge[t.navn].$value = '{farge.' + /var\(--([a-z0-9-]+)\)/.exec(t.verdi)[1] + '}';
    }
    else if (erMaal(t.verdi)) ut.maal[t.navn] = { $type: 'dimension', $value: t.verdi, $description: t.hvorfor };
  });
  process.stdout.write(JSON.stringify(ut, null, 2) + '\n');
}
