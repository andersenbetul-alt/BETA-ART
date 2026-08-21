const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

const setOpen = (open) => {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
};

toggle.addEventListener('click', () => {
  setOpen(toggle.getAttribute('aria-expanded') !== 'true');
});

// Close on outside click, so tapping the page dismisses the menu.
document.addEventListener('click', (e) => {
  if (toggle.getAttribute('aria-expanded') !== 'true') return;
  if (!e.target.closest('.navbar')) setOpen(false);
});

// Close after following a link, so the menu isn't left open on the next page.
links.addEventListener('click', (e) => {
  if (e.target.closest('a')) setOpen(false);
});

// Escape closes the menu and returns focus to the control that opened it.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    toggle.focus();
  }
});
