/* NaviarCare — Customer Behaviour System (NCB)
 * Tracks specialty interest, doctor views, page visits.
 * Stores in localStorage ONLY with explicit user consent (ePrivacy/GDPR).
 * No PII, no external services, no cookies.
 *
 * Global API: window.NCB
 *   NCB.init()                     — call on every page load
 *   NCB.trackDoctor({id,name,specialty}) — call when doctor card interacted
 *   NCB.trackSpecialty(slug)       — call on specialty filter click
 *   NCB.suggest()                  → {type,specialty,doctor,message,url}
 *   NCB.renderWelcomeBack(id)      — inject welcome strip into element #id
 *   NCB.renderContinueSearch(id)   — inject "continue" strip into element #id
 *   NCB.markSeenDoctors()          — add "Seen before" badge to [data-doctor-id]
 *   NCB.grantConsent('yes'|'no')   — called by banner buttons
 *   NCB.clear()                    — wipe all stored data
 */
(function () {
  'use strict';

  const KEY_CONSENT = 'NC_CONSENT';
  const KEY_DATA    = 'NC_BEHAVIOR';
  const V           = 1;

  // ── Storage helpers ────────────────────────────────────────────────────────
  function safe(fn, fallback) { try { return fn(); } catch { return fallback; } }

  function getConsent() { return safe(() => localStorage.getItem(KEY_CONSENT), null); }
  function setConsent(v) { safe(() => localStorage.setItem(KEY_CONSENT, v)); }

  function loadStored() {
    const raw = safe(() => localStorage.getItem(KEY_DATA), null);
    if (!raw) return null;
    try { const d = JSON.parse(raw); return d.v === V ? d : null; } catch { return null; }
  }

  function persist(data) {
    if (getConsent() !== 'yes') return;
    safe(() => localStorage.setItem(KEY_DATA, JSON.stringify(data)));
  }

  // In-memory store when user said "no" — works for the session only
  let memStore = null;

  function getData() {
    return (getConsent() === 'yes' ? loadStored() : memStore) || newProfile();
  }

  function setData(data) {
    data._saved = Date.now();
    if (getConsent() === 'yes') { persist(data); }
    else { memStore = data; }
  }

  function newProfile() {
    return { v: V, firstVisit: Date.now(), lastVisit: null, visits: 0,
             specialties: {}, doctors: [], pages: {}, lang: null };
  }

  // ── Core tracking ──────────────────────────────────────────────────────────
  const NCB = window.NCB = {};

  NCB.getConsent = getConsent;

  NCB.grantConsent = function (val) {
    setConsent(val);
    if (val === 'yes' && memStore) persist(memStore); // flush session data
    hideBanner();
  };

  NCB.clear = function () {
    safe(() => { localStorage.removeItem(KEY_DATA); localStorage.removeItem(KEY_CONSENT); });
    memStore = null;
  };

  NCB.trackPage = function (page) {
    const d = getData();
    d.lastVisit = Date.now();
    d.visits = (d.visits || 0) + 1;
    d.pages[page] = (d.pages[page] || 0) + 1;
    d.lang = safe(() => localStorage.getItem('nc_lang'), null) || d.lang;
    setData(d);
  };

  NCB.trackSpecialty = function (specialty) {
    if (!specialty) return;
    const d = getData();
    d.specialties[specialty] = (d.specialties[specialty] || 0) + 1;
    setData(d);
  };

  NCB.trackDoctor = function (doctor) {
    // doctor = { id, name, specialty, specialtyLabel }
    const d = getData();
    d.doctors = d.doctors.filter(x => x.id !== doctor.id); // dedupe
    d.doctors.unshift({ ...doctor, ts: Date.now() });
    d.doctors = d.doctors.slice(0, 6);
    if (doctor.specialty) {
      d.specialties[doctor.specialty] = (d.specialties[doctor.specialty] || 0) + 1;
    }
    setData(d);
  };

  // ── Suggestion engine ──────────────────────────────────────────────────────
  const SPECIALTY_LABELS = {
    'general-practice': 'General practice',
    'internal-medicine': 'Internal medicine',
    'cardiology': 'Cardiology',
    'neurology': 'Neurology',
    'pediatrics': 'Pediatrics',
    'dermatology': 'Dermatology',
    'psychiatry': 'Psychiatry',
    'gynecology': 'Gynecology',
    'orthopedics': 'Orthopedics',
  };

  function topSpecialty(d) {
    return Object.entries(d.specialties)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }

  NCB.suggest = function () {
    const d = getData();
    if (!d.lastVisit || d.visits < 1) return { type: 'none' };

    const spec     = topSpecialty(d);
    const specLabel = SPECIALTY_LABELS[spec] || (spec || '').replace(/-/g, ' ');
    const lastDoc  = d.doctors[0] || null;

    if (!spec && !lastDoc) return { type: 'none' };

    const specialty = spec || lastDoc?.specialty || null;
    const label     = SPECIALTY_LABELS[specialty] || (specialty || '').replace(/-/g, ' ');

    return {
      type:          lastDoc ? 'doctor' : 'specialty',
      specialty,
      specialtyLabel: label,
      doctor:        lastDoc,
      visits:        d.visits,
      lastVisit:     d.lastVisit,
      message: lastDoc
        ? `Continue with ${lastDoc.name}`
        : `Continue your ${label.toLowerCase()} search`,
      url: specialty
        ? `booking.html?specialty=${specialty}`
        : 'booking.html',
    };
  };

  // ── Consent banner ─────────────────────────────────────────────────────────
  function showBanner() {
    if (getConsent()) return;
    const el = document.getElementById('ncb-banner');
    if (!el) return;
    el.innerHTML = `
      <div class="ncb-banner" role="region" aria-label="Preference storage consent">
        <p class="ncb-banner-text">
          <strong>Remember your preferences?</strong>
          We can suggest the right advisor next time — saved on this device only, no account needed.
        </p>
        <div class="ncb-banner-actions">
          <button class="ncb-btn ncb-btn-yes" onclick="NCB.grantConsent('yes')">Yes, remember me</button>
          <button class="ncb-btn ncb-btn-no"  onclick="NCB.grantConsent('no')">No thanks</button>
        </div>
      </div>`;
    el.hidden = false;
  }

  function hideBanner() {
    const el = document.getElementById('ncb-banner');
    if (el) { el.hidden = true; el.innerHTML = ''; }
  }

  // ── Welcome-back widget (index.html) ───────────────────────────────────────
  NCB.renderWelcomeBack = function (containerId) {
    const d = getData();
    // Only show from 2nd visit onward, and if we have something to suggest
    if (!d.lastVisit || d.visits < 2) return;
    const s = NCB.suggest();
    if (s.type === 'none') return;
    const el = document.getElementById(containerId);
    if (!el) return;

    const ago = timeAgo(d.lastVisit);
    const docLine = s.doctor
      ? `Last time you looked at <strong>${s.doctor.name}</strong> (${s.specialtyLabel}).`
      : `Last time you searched for <strong>${s.specialtyLabel}</strong>.`;

    el.innerHTML = `
      <div class="ncb-welcome" role="region" aria-label="Welcome back">
        <div class="ncb-welcome-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="ncb-welcome-body">
          <span class="ncb-welcome-label">Welcome back</span>
          <span class="ncb-welcome-sub">You visited ${ago}. ${docLine}</span>
        </div>
        <a href="${s.url}" class="ncb-welcome-cta">${s.message} →</a>
        <button class="ncb-dismiss" onclick="this.closest('.ncb-welcome').remove()" aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
    el.hidden = false;
  };

  // ── Continue-search strip (booking.html) ────────────────────────────────────
  NCB.renderContinueSearch = function (containerId) {
    const d = getData();
    if (!d.lastVisit) return; // truly first visit
    const s = NCB.suggest();
    if (s.type === 'none') return;
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="ncb-continue" role="region" aria-label="Continue your search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.85"/></svg>
        <span class="ncb-continue-msg">${s.message}</span>
        ${s.specialty ? `<a href="${s.url}" class="ncb-continue-link">Open ${s.specialtyLabel}</a>` : ''}
        <button class="ncb-dismiss" onclick="this.closest('.ncb-continue').remove()" aria-label="Dismiss">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
    el.hidden = false;
  };

  // ── Mark previously-seen doctors in the card grid ───────────────────────────
  NCB.markSeenDoctors = function () {
    const d = getData();
    if (!d.doctors.length) return;
    const seenIds = new Set(d.doctors.map(x => x.id));
    document.querySelectorAll('[data-doctor-id]').forEach(card => {
      if (!seenIds.has(card.dataset.doctorId)) return;
      if (card.querySelector('.ncb-seen-badge')) return; // already marked
      card.classList.add('ncb-seen');
      const nameEl = card.querySelector('.doctor-name');
      if (nameEl) {
        const badge = document.createElement('span');
        badge.className = 'ncb-seen-badge';
        badge.textContent = 'Seen before';
        nameEl.insertAdjacentElement('afterend', badge);
      }
    });
  };

  // ── Init ────────────────────────────────────────────────────────────────────
  NCB.init = function () {
    const page = location.pathname.split('/').pop() || 'index.html';
    NCB.trackPage(page);
    // Show consent banner after 1.5 s if user hasn't decided yet
    if (!getConsent()) setTimeout(showBanner, 1500);
  };

  // ── Utility ─────────────────────────────────────────────────────────────────
  function timeAgo(ts) {
    const diff  = Date.now() - ts;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (days > 1)  return `${days} days ago`;
    if (days === 1) return 'yesterday';
    if (hours > 1) return `${hours} hours ago`;
    if (hours === 1) return '1 hour ago';
    if (mins > 1)  return `${mins} minutes ago`;
    return 'just now';
  }

})();
