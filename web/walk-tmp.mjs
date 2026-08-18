import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-BETA-ART/33ad95e6-4f0c-577a-8b6d-422686442b1a/scratchpad';
const B='http://localhost:3120';
const browser = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
async function run(name, viewport){
  const ctx = await browser.newContext({viewport, locale:'nb-NO'});
  const p = await ctx.newPage();
  const log=[];
  const dump = async (label)=>{
    const txt = await p.evaluate(()=>document.body.innerText.replace(/\n{3,}/g,'\n\n'));
    log.push(`\n===== ${label} :: ${p.url()} =====\n${txt}`);
    await p.screenshot({path:`${OUT}/${name}-${label}.png`, fullPage:true});
  };
  await p.goto(B+'/', {waitUntil:'networkidle'});
  await dump('01-home');
  // cookie banner
  const banner = await p.locator('body').innerHTML();
  log.push(`\n--- cookie banner present: ${/consent|cookie|informasjonskapsl|cookieBanner/i.test(banner)}`);
  await p.goto(B+'/no/urunler?kategori=hjem',{waitUntil:'networkidle'});
  await dump('02-category');
  await p.goto(B+'/no/urunler?q=ull',{waitUntil:'networkidle'});
  await dump('03-search');
  await p.goto(B+'/no/urunler?sirala=fiyat-artan',{waitUntil:'networkidle'});
  await dump('04-sorted');
  await p.goto(B+'/no/urunler/merinoull-skjerf',{waitUntil:'networkidle'});
  await dump('05-pdp');
  // add to cart
  const btn = p.locator('button', {hasText:/legg i|kurv|handlekurv|add/i}).first();
  const before = await p.locator('header').innerText().catch(()=>'');
  await btn.click();
  await p.waitForTimeout(600);
  const after = await p.locator('header').innerText().catch(()=>'');
  log.push(`\n--- header before add: ${JSON.stringify(before)}\n--- header after add: ${JSON.stringify(after)}`);
  await dump('06-pdp-after-add');
  await p.goto(B+'/no/urunler/stentoy-kaffekopp',{waitUntil:'networkidle'});
  await p.locator('button', {hasText:/legg i|kurv|handlekurv|add/i}).first().click();
  await p.waitForTimeout(400);
  await p.goto(B+'/no/sepet',{waitUntil:'networkidle'});
  await dump('07-cart-2items');
  await p.goto(B+'/en/sepet',{waitUntil:'networkidle'});
  await dump('08-cart-en');
  await ctx.close();
  return log.join('\n');
}
const d = await run('desktop',{width:1280,height:900});
const m = await run('mobile',{width:375,height:812});
console.log(d);
console.log('\n\n########## MOBILE ##########\n');
console.log(m);
await browser.close();
