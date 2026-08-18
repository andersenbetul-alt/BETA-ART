import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-BETA-ART/33ad95e6-4f0c-577a-8b6d-422686442b1a/scratchpad';
const B='http://localhost:3120';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const ctx = await b.newContext({viewport:{width:375,height:812}, deviceScaleFactor:2, isMobile:true, hasTouch:true, locale:'nb-NO'});
const p = await ctx.newPage();
async function shot(u,n){ await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(2500); await p.screenshot({path:`${OUT}/m2-${n}.png`, fullPage:true}); }
await shot('/no','home');
await shot('/no/urunler','list');
await shot('/no/urunler/merinoull-skjerf','pdp');
// add 1 scarf, go to cart (below threshold check with single 349 item)
await p.locator('button', {hasText:/Legg i handlekurv/i}).first().click();
await p.waitForTimeout(500);
await p.screenshot({path:`${OUT}/m2-pdp-added.png`});
await shot('/no/sepet','cart');
await b.close();
