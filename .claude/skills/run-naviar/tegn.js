/* Rendrer en SVG- eller HTML-fil til PNG med Chromium. Brukes i
   tegn-render-sammenlign-løkka: når grafikk må gjenskapes uten kildefil,
   tegnes den parametrisk, rendres her, og sammenlignes visuelt mot
   originalen. To-tre runder holder som regel.

     node .claude/skills/run-naviar/tegn.js inn.svg ut.png [bredde] [hoyde]

   Bredde/høyde er visningsflaten (standard 1000x400). Gjennomsiktig
   bakgrunn får du ikke her – flata males hvit, som papiret. */
const fs = require('fs');
function pw() {                       // samme oppslag som driver.js
  try { return require('playwright'); } catch (e) {}
  return require('/opt/node22/lib/node_modules/playwright');
}
const { chromium } = pw();
const [inn, ut, b = 1000, h = 400] = process.argv.slice(2);
if (!inn || !ut) { console.error('bruk: tegn.js inn.svg ut.png [bredde] [hoyde]'); process.exit(2); }
(async () => {
  const nett = await chromium.launch();
  const side = await nett.newPage({ viewport: { width: +b, height: +h }, deviceScaleFactor: 2 });
  const innhold = fs.readFileSync(inn, 'utf8');
  await side.setContent(
    `<style>body{margin:0;background:#fff}svg,img{width:${b}px;height:${h}px;display:block;object-fit:contain}</style>` +
    (inn.endsWith('.svg') ? innhold : innhold));
  await side.screenshot({ path: ut });
  await nett.close();
  console.log('skrev', ut);
})();
