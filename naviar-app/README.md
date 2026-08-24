# NAVIAR — Authentication

Next.js App Router + TypeScript. Supabase Auth and application data share one
Postgres, so `public` tables reference `auth.users` directly and RLS policies
compare against `auth.uid()` with no ID synchronisation.

## Setup

```bash
npm install
cp .env.example .env.local     # fill in URL + anon key from Supabase → API
npm run dev
```

Apply the schema — either paste `supabase/migrations/0001_auth_and_profiles.sql`
into the Supabase SQL editor, or `supabase db push` with the CLI.

In Supabase → Authentication → URL Configuration, add
`http://localhost:3000/auth/confirm` (and the production equivalent) to the
redirect allow-list, or confirmation links will bounce.

## Layout

| Path | Role |
|---|---|
| `middleware.ts` | Refreshes the session on every navigation, redirects anonymous users |
| `src/lib/supabase/server.ts` | Server client — Server Components, Actions, Route Handlers |
| `src/lib/supabase/client.ts` | Browser client |
| `src/lib/supabase/middleware.ts` | Session refresh + route guard |
| `src/app/actions.ts` | `login`, `signup`, `signOut` server actions |
| `src/app/auth/confirm/route.ts` | Email confirmation via `verifyOtp` |
| `supabase/migrations/` | Schema, RLS policies, signup trigger |

## Decisions worth knowing before editing

**`getUser()`, never `getSession()`, on the server.** `getSession()` reads the
cookie without revalidating the JWT against Supabase, so a forged cookie would
pass. Every server-side check in this app uses `getUser()`.

**The middleware is not the security boundary.** It is a routing convenience.
Pages that read user data verify the user themselves — see
`src/app/dashboard/page.tsx`. A middleware matcher change should never be able
to expose data.

**Do not edit the middleware's cookie block casually.** Two rules there are
load-bearing: no code may run between `createServerClient` and `getUser()`, and
the function must return the `supabaseResponse` object unmodified. Breaking
either produces intermittent random logouts that are very hard to reproduce.

**Login failures are deliberately vague.** "Incorrect email or password" is
returned for both a wrong password and an unknown address. Distinguishing them
would let anyone test whether an address has an account here.

**Profiles are created by a trigger, not by clients.** `handle_new_user()` fires
on insert into `auth.users`. There is no insert policy on `public.profiles`, so
direct client inserts are denied — that is intentional, not an oversight.

**The service_role key does not belong in this app.** It bypasses RLS, and any
`NEXT_PUBLIC_` variable ships to the browser.

## Not built yet

OAuth providers, password reset, email change, rate limiting on the login
action, and a `Database` type generated from the schema
(`supabase gen types typescript`) to replace the untyped `.from("profiles")`
call.
