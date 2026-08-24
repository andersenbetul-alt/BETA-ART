var pw = require('/opt/node22/lib/node_modules/playwright'), fs = require('fs');
(async function(){
  var b = await pw.chromium.launch();
  var p = await b.newPage({ viewport:{width:240,height:240}, deviceScaleFactor:1 });
  await p.setContent('<style>*{margin:0}body{width:240px;height:240px}</style>'+
    '<svg width="240" height="240"><filter id="k" x="0" y="0" width="100%" height="100%">'+
    '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="7" stitchTiles="stitch"/>'+
    '<feColorMatrix type="saturate" values="0"/></filter>'+
    '<rect width="240" height="240" filter="url(#k)"/></svg>');
  await p.screenshot({ path:'korn.png' });
  await b.close();
  console.log('korn.png ' + fs.statSync('korn.png').size + ' B');
})();
