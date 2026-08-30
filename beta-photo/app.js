/* BETA PHOTO — app.js
 * Interaktivitet: filter, modal, handlekurv, verifisering, skjema, reveal-animasjon.
 */

'use strict';

(function () {

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Header shadow on scroll ─────────────────────────────────────────── */
  const header = document.querySelector('[data-header]');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Gallery filter ──────────────────────────────────────────────────── */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const gallery       = document.querySelector('[data-gallery]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const active = btn.dataset.filter;
      if (!gallery) return;

      gallery.querySelectorAll('[data-category]').forEach(card => {
        card.hidden = active !== 'alle' && card.dataset.category !== active;
      });
    });
  });

  /* ── Product modal ───────────────────────────────────────────────────── */
  const modal       = document.querySelector('[data-product-modal]');
  const modalTitle  = modal && modal.querySelector('[data-modal-title]');
  const modalDesc   = modal && modal.querySelector('[data-modal-description]');
  const modalArt    = modal && modal.querySelector('[data-modal-art]');

  const products = {
    'mellom-fjell':   { name: 'Mellom fjell',     desc: 'Landskap fra norsk høyfjell, tatt i gylden time.',     bg: '#1A1F2B' },
    'stillhet-0614':  { name: 'Stillhet 06:14',   desc: 'Kystlandskap i rolig morgenlys, stille og dypt.',      bg: '#1C2420' },
    'byens-puls':     { name: 'Byens puls',        desc: 'Urban rytme fanget i en enkelt eksponering.',          bg: '#1F1A1A' },
    'nord-64':        { name: 'Nord 64',           desc: 'Abstraksjon inspirert av nordlys og arktisk lys.',     bg: '#161B20' },
    'etter-regnet':   { name: 'Etter regnet',      desc: 'Arkitektur speilet i regnvåt asfalt etter storm.',    bg: '#1A1C1F' },
    'siste-lys':      { name: 'Det siste lyset',   desc: 'Kveldslys som legger seg over et stille fjordlandskap.', bg: '#221E16' },
  };

  if (gallery && modal) {
    gallery.querySelectorAll('[data-product]').forEach(card => {
      card.querySelector('[aria-label]').addEventListener('click', () => {
        const key  = card.dataset.product;
        const prod = products[key] || {};
        if (modalTitle)   modalTitle.textContent   = prod.name || key;
        if (modalDesc)    modalDesc.textContent     = prod.desc || '';
        if (modalArt)     modalArt.style.background = prod.bg  || '';
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('[data-modal-close]')?.focus();
      });
    });

    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal () {
    if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  }

  /* ── Cart ────────────────────────────────────────────────────────────── */
  const cartDrawer   = document.querySelector('[data-cart-drawer]');
  const cartBackdrop = document.querySelector('[data-drawer-backdrop]');
  const cartCount    = document.querySelector('[data-cart-count]');
  const cartItems    = document.querySelector('[data-cart-items]');
  const cartEmpty    = document.querySelector('[data-cart-empty]');
  const cartTotal    = document.querySelector('[data-cart-total]');
  const cartTotalVal = document.querySelector('[data-cart-total-value]');
  const toast        = document.querySelector('[data-toast]');

  let cart = [];

  document.querySelectorAll('[data-cart-open]').forEach(el =>
    el.addEventListener('click', openCart));
  document.querySelectorAll('[data-cart-close]').forEach(el =>
    el.addEventListener('click', closeCart));
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  function openCart () {
    if (cartDrawer)   { cartDrawer.hidden = false; cartDrawer.removeAttribute('aria-hidden'); }
    if (cartBackdrop) cartBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCart () {
    if (cartDrawer)   { cartDrawer.setAttribute('aria-hidden', 'true'); }
    if (cartBackdrop) cartBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  const addBtn = modal && modal.querySelector('[data-add-cart]');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const sizeInput = modal.querySelector('[name="size"]:checked');
      const title     = modalTitle ? modalTitle.textContent : 'Fotografi';
      const size      = sizeInput ? sizeInput.value : '40 × 60 cm';
      const price     = sizeInput ? parseInt(sizeInput.dataset.price, 10) : 3490;
      cart.push({ title, size, price });
      renderCart();
      closeModal();
      showToast(`«${title}» lagt i kurven`);
    });
  }

  function renderCart () {
    if (!cartItems || !cartEmpty || !cartTotal || !cartCount) return;
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
      cartItems.innerHTML = '';
      cartEmpty.hidden    = false;
      cartTotal.hidden    = true;
      return;
    }

    cartEmpty.hidden = true;
    cartTotal.hidden = false;
    cartItems.innerHTML = cart.map((item, i) => `
      <div style="border-bottom:1px solid #2E2E2A;padding:1rem 0;display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
        <div>
          <div style="font-size:.9rem">${item.title}</div>
          <div style="font-size:.75rem;color:#9A9792">${item.size}</div>
        </div>
        <div style="display:flex;align-items:center;gap:.75rem">
          <span style="font-family:'JetBrains Mono',monospace;font-size:.875rem">${item.price.toLocaleString('nb-NO')} kr</span>
          <button onclick="removeCartItem(${i})" style="background:none;border:none;color:#9A9792;cursor:pointer;font-size:1rem">×</button>
        </div>
      </div>
    `).join('');

    const total = cart.reduce((s, it) => s + it.price, 0);
    if (cartTotalVal) cartTotalVal.textContent = total.toLocaleString('nb-NO') + ' kr';
  }

  window.removeCartItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  /* ── Toast ───────────────────────────────────────────────────────────── */
  let toastTimer;
  function showToast (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  /* ── BETA-ID verification ────────────────────────────────────────────── */
  const verifyBtn    = document.querySelector('[data-verify-button]');
  const verifyInput  = document.getElementById('verify-id');
  const verifyResult = document.querySelector('[data-verification-result]');

  const DEMO_RECORDS = {
    'BETA-PHOTO-0001': { title: 'Mellom fjell', edition: '01 / 20', format: '60 × 90 cm', date: '2026-04-12', status: 'Verifisert' },
    'BETA-PHOTO-0002': { title: 'Stillhet 06:14', edition: '03 / 20', format: '40 × 60 cm', date: '2026-04-14', status: 'Verifisert' },
  };

  if (verifyBtn && verifyInput && verifyResult) {
    verifyBtn.addEventListener('click', runVerify);
    verifyInput.addEventListener('keydown', e => { if (e.key === 'Enter') runVerify(); });
  }

  function runVerify () {
    const id  = verifyInput.value.trim().toUpperCase();
    const rec = DEMO_RECORDS[id];
    verifyResult.hidden = false;

    if (rec) {
      verifyResult.innerHTML = `
        <div style="border:1px solid #7FB69B;padding:1.5rem;margin-top:1rem">
          <div style="color:#7FB69B;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1rem">${rec.status}</div>
          <dl style="display:grid;grid-template-columns:auto 1fr;gap:.4rem 1.5rem;font-size:.875rem">
            <dt style="color:#9A9792">ID</dt>         <dd style="font-family:monospace">${id}</dd>
            <dt style="color:#9A9792">Tittel</dt>     <dd>${rec.title}</dd>
            <dt style="color:#9A9792">Opplag</dt>     <dd>${rec.edition}</dd>
            <dt style="color:#9A9792">Format</dt>     <dd>${rec.format}</dd>
            <dt style="color:#9A9792">Registrert</dt> <dd>${rec.date}</dd>
          </dl>
        </div>`;
    } else {
      verifyResult.innerHTML = `
        <div style="border:1px solid #8B1A1A;padding:1.5rem;margin-top:1rem;color:#9A9792;font-size:.875rem">
          ID <strong style="font-family:monospace;color:#F3F0E9">${id || '—'}</strong> ble ikke funnet i registeret.
          Bruk demo-ID: <strong style="font-family:monospace;color:#F3F0E9">BETA-PHOTO-0001</strong>
        </div>`;
    }
  }

  /* ── Launch form ─────────────────────────────────────────────────────── */
  const launchForm = document.querySelector('[data-launch-form]');
  const formNote   = document.querySelector('[data-form-note]');

  if (launchForm && formNote) {
    launchForm.addEventListener('submit', e => {
      e.preventDefault();
      formNote.textContent = 'Takk — du varsles før lanseringen.';
      launchForm.reset();
    });
  }

})();
