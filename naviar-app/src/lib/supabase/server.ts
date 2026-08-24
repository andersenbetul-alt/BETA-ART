import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side client for Server Components, Route Handlers and Server Actions.
 *
 * Always read the user with `supabase.auth.getUser()`. Never trust
 * `getSession()` on the server: it reads the cookie without revalidating the
 * JWT with Supabase, so a forged cookie would pass.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, which cannot set cookies.
            // The middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
