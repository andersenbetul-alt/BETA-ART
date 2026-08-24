var pw = require('/opt/node22/lib/node_modules/playwright');
(async function(){
  var b = await pw.chromium.launch();
  var p = await b.newPage({ viewport:{width:1400,height:2100}, deviceScaleFactor:2 });
  await p.goto('file://' + process.cwd() + '/plate.html');
  await p.waitForFunction('document.documentElement.dataset.klar==="1"');
  await p.evaluate('document.fonts.ready');
  console.log(JSON.stringify(await p.evaluate('window.__mal')));
  await p.screenshot({ path:'AVSTAND-plate-IV.png' });
  await p.pdf({ path:'AVSTAND-plate-IV.pdf', width:'1400px', height:'2100px',
                printBackground:true, pageRanges:'1' });
  await b.close();
})();
