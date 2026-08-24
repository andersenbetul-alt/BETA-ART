/* Naviar Care – «Reticent Systems», plate IV: AVSTAND.
   Filosofien ligger i docs/design/RETICENT-SYSTEMS.md.

   Platen tegnes deterministisk: 54 intervaller under én lov, ett utelatt.
   Kjøres slik, fra verktoy/:
     node lag-korn.js      (papirkornet, en flis på 240 px – trengs én gang)
     node lag-plate.js     (skriver plate.html med skriftene innbakt)
     node rendre-plate.js  (PNG i 2800x4200 og PDF)

   Skriftene hentes fra canvas-design-ferdighetens mappe, ikke fra prosjektet.
   Uten den mappen faller lag-plate.js, og det er meningen: platen skal ikke
   rendres med tilfeldige erstatningsskrifter. */

var fs = require('fs');
var F = (process.env.CANVAS_FONTS || '/root/.claude/skills/synced/canvas-design/canvas-fonts') + '/';
var kornTile = fs.readFileSync(__dirname + '/korn.png').toString('base64');
function font(f){ return fs.readFileSync(F + f).toString('base64'); }

var W = 1400, H = 2100;
var M = 132, CX0 = M, CW = W - 2*M;          // 1136
var LADDER = 104;
var COLS = 9, ROWS = 6, N = COLS*ROWS;       // 54
var GY0 = 330, CELLW = CW/COLS, CELLH = 160, GH = ROWS*CELLH;

var INK = '#0E1926', GREEN = '#1F6F5C', OCHRE = '#A9662C';
var GRUNN = '#D7DCDD';

var GRONNE = [6, 25, 43];
var UTELATT = 31;                             // fig. 32

function rise(n){ var t = 1 - n/(N-1); return Math.max(3, 80 * Math.pow(t, 1.15)); }

var s = [];

/* Hjørnekryss – platens egne passermerker. */
[[72,72],[W-72,72],[72,H-72],[W-72,H-72]].forEach(function(p){
  s.push('<path d="M'+(p[0]-11)+' '+p[1]+' H'+(p[0]+11)+' M'+p[0]+' '+(p[1]-11)+' V'+(p[1]+11)+
         '" stroke="'+INK+'" stroke-opacity=".34" stroke-width=".9"/>');
});

/* Topp */
s.push('<text x="'+M+'" y="206" class="mono ev">OBSERVASJONSPLATE</text>');
s.push('<text x="'+(W-M)+'" y="206" class="mono ev" text-anchor="end">PL. IV</text>');
s.push('<path d="M'+M+' 232 H'+(W-M)+'" stroke="'+INK+'" stroke-opacity=".3" stroke-width=".8"/>');

/* Kalibreringsstige i margen */
for (var y = GY0; y <= GY0+GH + .01; y += 32){
  var lang = Math.abs((y-GY0) % CELLH) < .01;
  s.push('<path d="M'+LADDER+' '+y+' H'+(LADDER-(lang?14:6))+
         '" stroke="'+INK+'" stroke-opacity="'+(lang?'.45':'.24')+'" stroke-width=".8"/>');
  if (lang){
    var tall = Math.round((y-GY0)/CELLH)*COLS;
    s.push('<text x="82" y="'+(y+3.2)+'" class="mono stige" text-anchor="end">'+
           String(tall).padStart(3,'0')+'</text>');
  }
}
s.push('<path d="M'+LADDER+' '+GY0+' V'+(GY0+GH)+'" stroke="'+INK+'" stroke-opacity=".22" stroke-width=".8"/>');

/* Feltet: 54 intervaller under én lov */
for (var n = 0; n < N; n++){
  var col = n % COLS, row = (n - col)/COLS;
  var x0 = CX0 + col*CELLW, y0 = GY0 + row*CELLH;
  var p1 = x0 + 24, p2 = x0 + 102, by = y0 + 112, d = p2 - p1;
  var gronn = GRONNE.indexOf(n) !== -1, ute = n === UTELATT;
  var far = ute ? OCHRE : (gronn ? GREEN : INK);

  /* Cellemerke – rutenettet som notesystem, ikke bur. */
  s.push('<path d="M'+x0+' '+(y0+11)+' V'+y0+' H'+(x0+11)+
         '" fill="none" stroke="'+INK+'" stroke-opacity=".26" stroke-width=".8"/>');

  if (!ute){
    var r = rise(n);
    s.push('<path d="M'+p1.toFixed(2)+' '+by+' A '+(d/2)+' '+r.toFixed(2)+
           ' 0 0 1 '+p2.toFixed(2)+' '+by+'" fill="none" stroke="'+far+
           '" stroke-opacity="'+(gronn?'.95':'.82')+'" stroke-width="'+(gronn?'1.3':'1.05')+'"/>');
    s.push('<circle cx="'+p1.toFixed(2)+'" cy="'+by+'" r="3.1" fill="'+far+'"/>');
    s.push('<circle cx="'+p2.toFixed(2)+'" cy="'+by+'" r="3.1" fill="'+far+'"/>');
  } else {
    /* De to punktene finnes. Intervallet mellom dem er ikke ført. */
    s.push('<circle cx="'+p1.toFixed(2)+'" cy="'+by+'" r="3.1" fill="none" stroke="'+OCHRE+'" stroke-width="1.3"/>');
    s.push('<circle cx="'+p2.toFixed(2)+'" cy="'+by+'" r="3.1" fill="none" stroke="'+OCHRE+'" stroke-width="1.3"/>');
  }

  s.push('<text x="'+(x0+63).toFixed(2)+'" y="'+(y0+141)+'" text-anchor="middle" class="mono ix"'+
         (ute ? ' fill="'+OCHRE+'" fill-opacity="1"' : (gronn ? ' fill="'+GREEN+'" fill-opacity=".9"' : '')) +
         '>'+String(n+1).padStart(2,'0')+'</text>');
}

s.push('<path d="M'+M+' 1348 H'+(W-M)+'" stroke="'+INK+'" stroke-opacity=".3" stroke-width=".8"/>');

/* Gesten */
s.push('<text id="ord" x="'+M+'" y="1564" class="ord">AVSTAND</text>');
s.push('<g id="terminal"></g>');

/* Fot */
s.push('<text x="'+M+'" y="1930" class="mono fot">53 INTERVALLER FØRT</text>');
s.push('<text x="'+M+'" y="1954" class="mono fot">ETT UTELATT · FIG. 32</text>');
s.push('<text x="'+(W-M)+'" y="1954" text-anchor="end" class="hvisk">det som ikke føres, kan ikke leses</text>');

var html = '<!doctype html><html><head><meta charset="utf-8"><style>\n'+
'@font-face{font-family:Jura;src:url(data:font/ttf;base64,'+font('Jura-Light.ttf')+') format("truetype");font-weight:300}\n'+
'@font-face{font-family:Geist;src:url(data:font/ttf;base64,'+font('GeistMono-Regular.ttf')+') format("truetype")}\n'+
'@font-face{font-family:Instr;src:url(data:font/ttf;base64,'+font('InstrumentSerif-Italic.ttf')+') format("truetype");font-style:italic}\n'+
'@page{size:'+W+'px '+H+'px;margin:0}\n'+
'*{margin:0;padding:0}html,body{width:'+W+'px;height:'+H+'px;background:'+GRUNN+'}\n'+
'svg{display:block}\n'+
'.mono{font-family:Geist;fill:'+INK+'}\n'+
'.ev{font-size:12px;letter-spacing:.34em;fill-opacity:.55}\n'+
'.stige{font-size:9px;letter-spacing:.14em;fill-opacity:.42}\n'+
'.ix{font-size:9.5px;letter-spacing:.14em;fill-opacity:.4}\n'+
'.fot{font-size:10px;letter-spacing:.2em;fill-opacity:.5}\n'+
'.ord{font-family:Jura;font-weight:300;font-size:180px;letter-spacing:.24em;fill:'+INK+'}\n'+
'.hvisk{font-family:Instr;font-style:italic;font-size:23px;fill:'+INK+';fill-opacity:.6}\n'+
'#korn{position:absolute;inset:0;mix-blend-mode:multiply;opacity:.062;pointer-events:none;'+
'background-image:url(data:image/png;base64,'+kornTile+');background-size:240px 240px}\n'+
'</style></head><body>\n'+
'<svg id="plate" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">\n'+
s.join('\n')+'\n</svg>\n'+
'<div id="korn"></div>\n'+
'<script>\n'+
'var o=document.getElementById("ord"),b=o.getBBox();\n'+
'var st=parseFloat(getComputedStyle(o).letterSpacing)||0;\n'+
'var w=b.width-st, x0='+M+', x1=x0+w, y=1620;\n'+
'document.getElementById("terminal").innerHTML=\n'+
' \'<path d="M\'+(x0+9)+\' \'+y+\' H\'+(x1-9)+\'" stroke="'+INK+'" stroke-opacity=".55" stroke-width="1"/>\'+\n'+
' \'<circle cx="\'+x0+\'" cy="\'+y+\'" r="5.4" fill="'+INK+'"/>\'+\n'+
' \'<circle cx="\'+x1+\'" cy="\'+y+\'" r="5.4" fill="none" stroke="'+INK+'" stroke-width="1.6"/>\';\n'+
'window.__mal={ordbredde:Math.round(w),hoyre:Math.round(x1),grense:'+(W-M)+'};\n'+
'document.documentElement.dataset.klar="1";\n'+
'<\/script></body></html>';

fs.writeFileSync('plate.html', html);
console.log('plate.html ' + (html.length/1024).toFixed(0) + ' KB');
