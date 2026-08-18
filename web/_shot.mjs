import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-BETA-ART/33ad95e6-4f0c-577a-8b6d-422686442b1a/scratchpad/shots';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const pages = [
 ['home','/no',1440,900,true],
 ['home-m','/no',375,812,true],
 ['urunler','/no/urunler',1440,900,true],
 ['urunler-m','/no/urunler',375,812,true],
 ['pdp','/no/urunler/merinoull-skjerf',1440,900,true],
 ['pdp-m','/no/urunler/merinoull-skjerf',375,812,true],
 ['sepet','/no/sepet',1440,900,true],
 ['satis','/no/kurumsal/satis',1440,900,true],
];
for (const [n,p,w,h,full] of pages){
  const ctx = await b.newContext({viewport:{width:w,height:h}, deviceScaleFactor:1, colorScheme:'light'});
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:3120'+p,{waitUntil:'networkidle'});
  await pg.waitForTimeout(600);
  await pg.screenshot({path:`${OUT}/${n}.png`, fullPage:full});
  // also viewport-only fold shot
  await pg.screenshot({path:`${OUT}/${n}-fold.png`});
  await ctx.close();
  console.log('ok',n);
}
await b.close();
