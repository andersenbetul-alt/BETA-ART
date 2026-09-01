/* ============================================================
   HXI — App
   Navigation · Scroll effects · Reveal animations
   ============================================================ */

(function () {
  'use strict';

  /* ── NAVIGATION ── */
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('nav-mobile');
  const mobileClose = document.getElementById('nav-mobile-close');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translateY(7px)';
    menuBtn.querySelectorAll('span')[1].style.opacity = '0';
    menuBtn.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelectorAll('span')[0].style.transform = '';
    menuBtn.querySelectorAll('span')[1].style.opacity = '';
    menuBtn.querySelectorAll('span')[2].style.transform = '';
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Keyboard: Escape closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ── SCROLL EFFECTS ── */
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Nav scrolled state
        if (nav) {
          nav.classList.toggle('scrolled', lastScrollY > 20);
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── STAGGER REVEAL GROUPS ── */
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  staggerGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  /* ── UTGAVE LABEL: live signal time ── */
  // Adds a subtle time signal to UTGAVE labels with data-live attribute
  const liveLabels = document.querySelectorAll('[data-live-signal]');
  if (liveLabels.length) {
    function updateSignal() {
      const now = new Date();
      const y = now.getUTCFullYear();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      liveLabels.forEach(el => {
        el.textContent = `${y} · ${h}:${m} UTC`;
      });
    }
    updateSignal();
    setInterval(updateSignal, 60000);
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
