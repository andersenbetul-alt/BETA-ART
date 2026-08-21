const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

const setOpen = (open) => {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
};

toggle.addEventListener('click', () => {
  setOpen(toggle.getAttribute('aria-expanded') !== 'true');
});

// Escape closes the menu and returns focus to the control that opened it.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    toggle.focus();
  }
});
