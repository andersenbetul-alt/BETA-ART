/**
 * Environment validation. Fails fast at boot rather than at first request —
 * a server that starts with a missing secret and 500s under load is strictly
 * worse than one that refuses to start.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`missing required environment variable: ${name}`);
  }
  return value.trim();
}

const SUPABASE_URL = required('SUPABASE_URL').replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY = required('SUPABASE_SERVICE_ROLE_KEY');

/**
 * The service_role key bypasses Row Level Security completely. If it ever
 * reaches a browser, every row in the database is readable by anyone. This
 * check catches the most common way that happens: copying the anon key's
 * variable name, or pasting a client-side key into the server config.
 */
if (SUPABASE_SERVICE_ROLE_KEY.includes('anon')) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY appears to hold an anon key — refusing to start',
  );
}

export const env = {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: required('DATABASE_URL'),
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;
