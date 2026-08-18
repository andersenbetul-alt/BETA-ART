import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-BETA-ART/33ad95e6-4f0c-577a-8b6d-422686442b1a/scratchpad/shots';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const pg = await ctx.newPage();
async function go(p){
  for(let i=0;i<3;i++){
    await pg.goto('http://localhost:3120'+p,{waitUntil:'load'});
    await pg.waitForTimeout(800);
    const styled = await pg.evaluate(()=>getComputedStyle(document.body).fontFamily.includes('Inter'));
    if(styled) break;
  }
  const btn = await pg.$('.consent-actions button');
  if(btn) { await btn.click(); await pg.waitForTimeout(300); }
}
for (const [n,p] of [['c-home','/no'],['c-urunler','/no/urunler'],['c-pdp','/no/urunler/merinoull-skjerf'],['c-sepet','/no/sepet'],['c-satis','/no/kurumsal/satis']]){
  await go(p); await pg.screenshot({path:`${OUT}/${n}.png`,fullPage:true}); console.log('ok',n);
}
await go('/no/urunler');
const m = await pg.evaluate(()=>{
  const g=(sel)=>{const e=document.querySelector(sel); if(!e) return null; const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
    return {x:Math.round(r.x),w:Math.round(r.width),ff:cs.fontFamily.split(',')[0],fs:cs.fontSize,fw:cs.fontWeight,lh:cs.lineHeight,ls:cs.letterSpacing,color:cs.color};};
  const e=document.querySelector('.grid'); const cs=getComputedStyle(e);
  return {logo:g('.logo'),h1:g('h1'),card:g('.card'),title:g('.card-title'),price:g('.price'),wrap:g('main .wrap'),
    grid:{cols:cs.gridTemplateColumns,gap:cs.gap,x:Math.round(e.getBoundingClientRect().x),w:Math.round(e.getBoundingClientRect().width)},
    fonts:[...document.fonts].map(f=>`${f.family} ${f.weight} ${f.status}`)};});
console.log(JSON.stringify(m));
// mobile
const ctx2 = await b.newContext({viewport:{width:375,height:812}});
const pg2 = await ctx2.newPage();
for (const [n,p] of [['m-home','/no'],['m-pdp','/no/urunler/merinoull-skjerf'],['m-urunler','/no/urunler']]){
  await pg2.goto('http://localhost:3120'+p,{waitUntil:'load'}); await pg2.waitForTimeout(700);
  const bt = await pg2.$('.consent-actions button'); if(bt){await bt.click(); await pg2.waitForTimeout(300);}
  await pg2.screenshot({path:`${OUT}/${n}.png`,fullPage:true}); console.log('ok',n);
}
await b.close();
