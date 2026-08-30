'use strict';
// NaviarCare — shared app JS

// Language switcher
const LANGS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

function getLang() {
  try { return localStorage.getItem('nc-lang') || 'en'; } catch { return 'en'; }
}
function setLang(code) {
  try { localStorage.setItem('nc-lang', code); } catch {}
  const lang = LANGS.find(l => l.code === code) || LANGS[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
  const sel = document.getElementById('lang-sel');
  if (sel) sel.value = code;
}

function initLangSelect() {
  const sel = document.getElementById('lang-sel');
  if (!sel) return;
  sel.value = getLang();
  sel.addEventListener('change', e => {
    setLang(e.target.value);
    // In a full implementation, this would reload translations
  });
}

// Mobile nav toggle
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? '' : 'flex';
    links.style.flexDirection = open ? '' : 'column';
    links.style.position = open ? '' : 'absolute';
    links.style.top = open ? '' : 'var(--nav-h)';
    links.style.left = open ? '' : '0';
    links.style.right = open ? '' : '0';
    links.style.background = open ? '' : 'var(--bg)';
    links.style.borderBottom = open ? '' : '1px solid var(--border)';
    links.style.padding = open ? '' : '8px 16px 16px';
    links.style.zIndex = open ? '' : '99';
  });
}

// FAQ accordion
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Language table filter (languages.html)
function initLangFilter() {
  const search = document.getElementById('lang-search');
  const regionSel = document.getElementById('region-sel');
  const tbody = document.getElementById('lang-tbody');
  const countEl = document.getElementById('lang-count');
  if (!search || !tbody) return;

  function filter() {
    const q = search.value.toLowerCase();
    const region = regionSel ? regionSel.value : '';
    let shown = 0;
    tbody.querySelectorAll('tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowRegion = row.dataset.region || '';
      const matchQ = !q || text.includes(q);
      const matchR = !region || region === 'all' || rowRegion === region;
      const show = matchQ && matchR;
      row.hidden = !show;
      if (show) shown++;
    });
    if (countEl) countEl.textContent = shown;
  }

  search.addEventListener('input', filter);
  if (regionSel) regionSel.addEventListener('change', filter);
}

// Symptom tag pills
function initSymptomTags() {
  document.querySelectorAll('.symptom-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const symptom = tag.dataset.symptom;
      if (symptom) window.location.href = `triage.html?symptom=${symptom}`;
    });
  });
}

// Complaint tag chips (triage)
function initTriageChips() {
  document.querySelectorAll('.complaint-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.complaint-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const input = document.getElementById('triage-input');
      if (input) input.value = chip.textContent;
    });
  });
}

// Scroll active nav link
function initActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// Multi-select language chips (join.html)
function initLangChips() {
  const search = document.getElementById('lang-chip-search');
  const container = document.getElementById('lang-chip-container');
  const chosen = document.getElementById('lang-chip-chosen');
  if (!search || !container) return;

  const ALL_LANGS = ['English','Türkçe','Español','العربية','Français','Deutsch',
    'Italiano','Português','Русский','中文','日本語','한국어','हिन्दी','বাংলা',
    'Kiswahili','Soomaali','Hausa','Yorùbá','Igbo'];
  let selected = new Set();

  function render() {
    container.innerHTML = '';
    const q = search.value.toLowerCase();
    ALL_LANGS.filter(l => l.toLowerCase().includes(q)).forEach(l => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'lang-chip' + (selected.has(l) ? ' selected' : '');
      chip.textContent = l;
      chip.addEventListener('click', () => {
        if (selected.has(l)) selected.delete(l); else selected.add(l);
        renderChosen();
        render();
      });
      container.appendChild(chip);
    });
  }

  function renderChosen() {
    if (!chosen) return;
    if (selected.size === 0) { chosen.textContent = 'Nothing chosen yet.'; return; }
    chosen.textContent = [...selected].join(', ');
  }

  search.addEventListener('input', render);
  render();
  renderChosen();
}

// Complaint tag input (triage)
function initComplaintInput() {
  const urlParams = new URLSearchParams(location.search);
  const symptom = urlParams.get('symptom');
  if (symptom) {
    const input = document.getElementById('triage-input');
    if (input) {
      const map = {
        fever: 'I have a fever',
        'chest-pain': 'I have chest pain',
        rash: 'I have a skin rash',
        anxiety: 'I am feeling anxious or having panic attacks',
        'child-fever': 'My child has a fever',
      };
      input.value = map[symptom] || symptom.replace(/-/g, ' ');
    }
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setLang(getLang());
  initLangSelect();
  initMobileNav();
  initFaq();
  initLangFilter();
  initSymptomTags();
  initTriageChips();
  initActiveNav();
  initLangChips();
  initComplaintInput();
});
