(function(){
  const q  = (s,r=document) => r.querySelector(s);
  const qa = (s,r=document) => [...r.querySelectorAll(s)];

  // ── CONFIG ────────────────────────────────────────────────
  const CFG   = window.HXI_CONFIG || {};
  const EMAIL = CFG.email || 'hxi@hximusic.com';

  // ── MOBILE MENU ───────────────────────────────────────────
  const m=q('#mobile'), o=q('#open'), c=q('#close');
  let last;
  function menu(on){
    if(!m)return;
    m.classList.toggle('open',on);
    m.setAttribute('aria-hidden',String(!on));
    o&&o.setAttribute('aria-expanded',String(on));
    document.body.style.overflow=on?'hidden':'';
    if(on){last=document.activeElement;(q('a,button',m)||m).focus?.()}
    else last?.focus?.();
  }
  o?.addEventListener('click',()=>menu(1));
  c?.addEventListener('click',()=>menu(0));
  m?.addEventListener('keydown',e=>{if(e.key==='Escape')menu(0)});

  // ── SPOTIFY LAZY LOAD ────────────────────────────────────
  qa('[data-player]').forEach(b=>b.addEventListener('click',function(){
    const t=q('#'+this.dataset.player);
    if(!t||t.dataset.loaded==='1')return;
    const i=document.createElement('iframe');
    i.src=this.dataset.src;
    i.width='100%';
    i.height='152';
    i.loading='lazy';
    i.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    i.title='Spotify player';
    t.appendChild(i);
    t.dataset.loaded='1';
    this.remove();
  }));

  // ── FORM → MAILTO ────────────────────────────────────────
  // No third-party form service. Data never leaves the visitor's mail client.
  function composeMail(formId, subject, fields){
    const f=q('#'+formId);
    if(!f)return;
    f.addEventListener('submit',e=>{
      e.preventDefault();
      if(!f.reportValidity())return;
      const hp=q('[name=website]',f);
      if(hp&&hp.value)return; // honeypot
      const lines=fields.map(k=>{
        const el=q('[name="'+k+'"]',f);
        const val=el?(el.value||'').trim():'';
        return val?(k.replace(/_/g,' '))+': '+val:null;
      }).filter(Boolean);
      window.location.href='mailto:'+EMAIL
        +'?subject='+encodeURIComponent(subject)
        +'&body='+encodeURIComponent(lines.join('\n'));
    });
  }

  composeMail('inquiry-form', 'HXI — General inquiry',
    ['name','email','type','message']);
  composeMail('sync-form',    'HXI — Sync inquiry',
    ['name','email','company','media','track','territory','period','deadline','budget','brief']);
  composeMail('booking-form', 'HXI — Booking inquiry',
    ['name','email','promoter','event','place','date','set_type','attendance','budget','message']);
})();
