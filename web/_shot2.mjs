import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-BETA-ART/33ad95e6-4f0c-577a-8b6d-422686442b1a/scratchpad/shots';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
await ctx.addCookies([{name:'cobban_consent',value:'necessary',url:'http://localhost:3120'}]);
const pg = await ctx.newPage();
async function go(p){ await pg.goto('http://localhost:3120'+p,{waitUntil:'networkidle'});
  await pg.evaluate(()=>{const c=document.querySelector('.consent'); if(c) c.remove();});
  await pg.waitForTimeout(300); }
for (const [n,p] of [['c-home','/no'],['c-urunler','/no/urunler'],['c-pdp','/no/urunler/merinoull-skjerf'],['c-sepet','/no/sepet'],['c-satis','/no/kurumsal/satis']]){
  await go(p); await pg.screenshot({path:`${OUT}/${n}.png`,fullPage:true});
}
// measurements on urunler
await go('/no/urunler');
const m = await pg.evaluate(()=>{
  const out={};
  const g=(sel)=>{const e=document.querySelector(sel); if(!e) return null; const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
    return {x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),ff:cs.fontFamily.split(',')[0],fs:cs.fontSize,fw:cs.fontWeight,lh:cs.lineHeight,ls:cs.letterSpacing,color:cs.color,bg:cs.backgroundColor};};
  out.logo=g('.logo'); out.h1=g('h1'); out.card=g('.card'); out.title=g('.card-title'); out.price=g('.price'); out.thumb=g('.thumb'); out.grid=g('.grid'); out.wrap=g('main .wrap')||g('.wrap');
  out.gridCS=(()=>{const e=document.querySelector('.grid');const cs=getComputedStyle(e);return {cols:cs.gridTemplateColumns,gap:cs.gap};})();
  out.fonts=[...document.fonts].map(f=>f.family+' '+f.weight+' '+f.status).slice(0,10);
  return out;});
console.log(JSON.stringify(m,null,1));
await b.close();
