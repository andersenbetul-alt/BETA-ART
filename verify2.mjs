import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const lum=([r,g,bb])=>{const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(bb)};
const cr=(a,c)=>{const[x,y]=[lum(a),lum(c)].sort((m,n)=>n-m);return Math.round(((x+.05)/(y+.05))*100)/100};
const parse=s=>(s.match(/\d+/g)||[]).slice(0,3).map(Number);
let totalFails=0, totalSmall=0;
for (const page of ['index.html','triage.html','booking.html','join.html','consultation.html','feedback.html']) {
 for (const theme of ['light','dark']) {
  const p = await b.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  await p.goto('file://'+process.cwd()+'/'+page,{waitUntil:'domcontentloaded'});
  await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
  await p.waitForTimeout(100);
  const d = await p.evaluate(()=>{
    const bgOf=el=>{let n=el;while(n&&n!==document.documentElement){const g=getComputedStyle(n).backgroundColor;if(g&&!/rgba\(0, 0, 0, 0\)|transparent/.test(g))return g;n=n.parentElement}return getComputedStyle(document.body).backgroundColor};
    const out={text:[],small:[]};const seen=new Set();
    document.querySelectorAll('main p,main span,main label,main li,main h1,main h2,main h3,main small').forEach(el=>{
      if(el.children.length||!el.textContent.trim())return;const cs=getComputedStyle(el);
      const k=cs.color+'|'+bgOf(el)+'|'+cs.fontSize;if(seen.has(k))return;seen.add(k);
      out.text.push({c:cs.color,b:bgOf(el),s:Math.round(parseFloat(cs.fontSize)*10)/10,w:cs.fontWeight,t:el.textContent.trim().slice(0,24)});});
    document.querySelectorAll('main button,main .chip,main .btn').forEach(el=>{const r=el.getBoundingClientRect();
      if(r.height>0&&r.height<43.5)out.small.push({t:el.textContent.trim().slice(0,18),h:Math.round(r.height*10)/10});});
    return out;});
  const fails=d.text.filter(s=>{const large=s.s>=18||(s.w>=700&&s.s>=14);return cr(parse(s.c),parse(s.b))<(large?3:4.5)});
  totalFails+=fails.length; totalSmall+=d.small.length;
  const mark = (fails.length||d.small.length)?'✗':'✓';
  console.log(`  ${mark} ${page.padEnd(18)} ${theme.padEnd(5)}  contrast:${String(fails.length).padStart(2)}  small:${String(d.small.length).padStart(3)}`);
  fails.forEach(f=>console.log(`       ${cr(parse(f.c),parse(f.b))}:1 ${f.s}px "${f.t}"`));
  d.small.slice(0,2).forEach(s=>console.log(`       ${s.h}px "${s.t}"`));
  await p.close();
 }
}
console.log(`\n  TOTAL  contrast failures: ${totalFails}   targets under 44px: ${totalSmall}`);
await b.close();
