# Admin login and RLS verification — current state and path forward

## What I checked

- Database: the `public` schema currently contains **no tables** (verified by query). The earlier Phase 1 migration timed out and did not apply.
- Routes: `src/routes/` has only `index`, `plates.$slug`, `contact`, `privacy`, `license-terms`, `refunds`. There is **no `/auth` route, no `/admin` route, no `_authenticated` layout**, and no role helpers in the code.
- Plate detail pages read from the static file `src/data/collection.ts`, not from the database.

So there is nothing to test yet: no admin login exists, no `user_roles` table, no `has_role` function, and no RLS policies. Any "test passed" claim right now would be false.

## Proposed work (then a real test)

### 1. Data foundation (migration)
- `app_role` enum (`admin`, `photographer`, `customer`), `user_roles` table with grants (`select` to `authenticated`, `all` to `service_role`), RLS enabled.
- `has_role(uuid, app_role)` and `is_admin()` security-definer functions.
- `profiles` table (own-row read/update).
- `plates` table with `published boolean default false` plus the catalogue fields already used by the UI.
- Policies: anonymous `SELECT` only on `published = true` plates; admins full access via `has_role`.
- Seed the 12 existing plates with `published = false`, keeping all statuses unverified and pricing draft.

### 2. Auth and admin skeleton
- Public `/auth` route (email + password sign-in; no anonymous sign-up).
- `_authenticated` layout gate and `/admin` page listing plates with their publish status, reading through an authenticated server function.
- `requireRole('admin')` server-side check on every admin data function — the route gate alone is not a security boundary.
- Session-aware header affordance and sign-out.

### 3. Verification (the actual test you asked for)
Run against the live preview with a real browser session, and report results honestly:
- Anonymous visit to a plate detail page: page renders, and a direct anonymous query for an unpublished plate returns **no rows**.
- Anonymous visit to `/admin`: redirected to `/auth`.
- Anonymous call to the admin server function: rejected (401 / role denied), proving the gate is server-side.
- Signed-in non-admin user: `/admin` data call denied by `has_role`.
- Signed-in admin: `/admin` loads and can see unpublished plates.
- Direct SQL checks that RLS is enabled and policies exist on each new table.

## Notes and constraints kept

- Nothing is published; visibility is unchanged.
- No invented names, dates, locations, provenance results, or business facts. Plates stay unverified, pricing stays draft, RAW/storage paths stay private.
- Admin test account: I need one to sign in with. Tell me an email to use and I will create it as an admin in the migration, or you can sign up after step 2 and I will grant the role.

## Blocker

To run the signed-in admin part of the test I need an admin account. Everything else (anonymous + non-admin paths) can be verified without one.
