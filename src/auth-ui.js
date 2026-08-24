// Wires the navbar's auth control to the auth module. Kept separate from
// nav.js so the menu keeps working with no backend configured.
import { init, onChange, signOut } from './auth.js';

const button = document.querySelector('.auth-button');
if (button) {
  onChange(({ ready, signedIn, email, error }) => {
    if (error === 'not-configured') {
      button.textContent = 'Sign in';
      button.disabled = true;
      button.title = 'Authentication is not configured yet';
      return;
    }
    if (error === 'unreachable') {
      button.textContent = 'Sign in';
      button.disabled = true;
      button.title = 'Cannot reach the authentication service';
      return;
    }
    button.disabled = !ready;
    button.textContent = signedIn ? 'Sign out' : 'Sign in';
    button.title = signedIn ? `Signed in as ${email}` : '';
  });

  button.addEventListener('click', async () => {
    const { signedIn } = await import('./auth.js').then((m) => m.snapshot());
    if (signedIn) await signOut();
    else window.location.href = '/sign-in';
  });

  init();
}
