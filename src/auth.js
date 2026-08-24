// Browser-side auth against Supabase (D-006). No build step: supabase-js is
// loaded as an ES module from a CDN, so this file runs directly in the page.
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from './config.js';

const CDN = 'https://esm.sh/@supabase/supabase-js@2';

const state = { client: null, session: null, error: null };
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn(snapshot()));

export const snapshot = () => ({
  ready: state.client !== null,
  signedIn: Boolean(state.session),
  email: state.session?.user?.email ?? null,
  error: state.error,
});

export const onChange = (fn) => {
  listeners.add(fn);
  fn(snapshot());
  return () => listeners.delete(fn);
};

// Returns false rather than throwing when unconfigured or the CDN is
// unreachable, so a missing backend degrades to a disabled control instead
// of a page that dies on load.
export async function init() {
  if (!isConfigured()) {
    state.error = 'not-configured';
    notify();
    return false;
  }
  try {
    const { createClient } = await import(CDN);
    state.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await state.client.auth.getSession();
    state.session = data.session;
    state.client.auth.onAuthStateChange((_event, session) => {
      state.session = session;
      notify();
    });
    notify();
    return true;
  } catch {
    state.error = 'unreachable';
    notify();
    return false;
  }
}

const requireClient = () => {
  if (!state.client) throw new Error('auth not initialised');
  return state.client;
};

export const signIn = (email, password) =>
  requireClient().auth.signInWithPassword({ email, password });

export const signUp = (email, password) =>
  requireClient().auth.signUp({ email, password });

export const signOut = () => requireClient().auth.signOut();
