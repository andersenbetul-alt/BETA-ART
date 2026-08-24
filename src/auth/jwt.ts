/**
 * Supabase JWT verification.
 *
 * Verification happens LOCALLY against Supabase's JWKS endpoint. The obvious
 * alternative — calling supabase.auth.getUser(token) per request — costs a
 * network round-trip on every single request and turns Supabase into a
 * latency and availability dependency of your own API. Asymmetric keys let
 * us avoid that: fetch the public keys once, cache them, verify offline.
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { env } from '../env.js';

/**
 * jose caches the key set and refetches only on key rotation (unknown `kid`),
 * with its own cooldown to prevent a malformed-token flood from hammering
 * the JWKS endpoint. Construct ONCE at module scope — building this per
 * request would defeat the cache entirely.
 */
const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  role: string;
}

/**
 * Verifies signature, expiry, issuer and audience, then returns the subject.
 * Throws on any failure — callers must treat a throw as 401 and must never
 * fall back to decoding the token unverified.
 */
export async function verifyAccessToken(token: string): Promise<AuthenticatedUser> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `${env.SUPABASE_URL}/auth/v1`,
    audience: 'authenticated',
    // Reject tokens whose lifetime is implausible even if unexpired.
    maxTokenAge: '24h',
  });

  return toUser(payload);
}

function toUser(payload: JWTPayload): AuthenticatedUser {
  const { sub, email, role } = payload as JWTPayload & {
    email?: unknown;
    role?: unknown;
  };

  // `sub` is the auth.users.id our profiles table foreign-keys to. A token
  // without one is structurally unusable, regardless of a valid signature.
  if (typeof sub !== 'string' || sub.length === 0) {
    throw new Error('token has no subject');
  }

  // Supabase issues aud='authenticated' for signed-in users; anon tokens
  // carry role='anon' and must not be treated as a logged-in user.
  if (role !== 'authenticated') {
    throw new Error(`unexpected role: ${String(role)}`);
  }

  return {
    id: sub,
    email: typeof email === 'string' ? email : null,
    role,
  };
}
