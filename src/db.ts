import pg from 'pg';
import { env } from './env.js';

/**
 * Connects to the same Postgres that backs Supabase Auth, so application
 * tables can foreign-key straight to auth.users(id).
 *
 * Queries here run as the database owner and are NOT filtered by RLS.
 * Every ownership check must be explicit in application code.
 */
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('unexpected idle client error', err);
});

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { rows } = await pool.query<Profile>(
    `select id, email, display_name, avatar_url, created_at, updated_at
       from public.profiles
      where id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function updateProfile(
  userId: string,
  patch: { display_name?: string | null; avatar_url?: string | null },
): Promise<Profile | null> {
  // COALESCE keeps unspecified fields untouched, so a partial PATCH cannot
  // silently null out columns the caller never mentioned.
  const { rows } = await pool.query<Profile>(
    `update public.profiles
        set display_name = coalesce($2, display_name),
            avatar_url   = coalesce($3, avatar_url)
      where id = $1
      returning id, email, display_name, avatar_url, created_at, updated_at`,
    [userId, patch.display_name ?? null, patch.avatar_url ?? null],
  );
  return rows[0] ?? null;
}
