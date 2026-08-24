// Supabase connection settings.
//
// The anon key is a PUBLIC, publishable key — it is meant to ship in the
// browser, and RLS is what protects the data. It is not a secret. The
// service_role key IS a secret and must never appear in this file or any
// other file served to a browser.
//
// Fill these in from your Supabase project settings (API section).
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

export const isConfigured = () =>
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);
