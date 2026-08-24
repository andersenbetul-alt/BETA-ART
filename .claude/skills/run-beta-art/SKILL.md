---
name: run-beta-art
description: Build, run, screenshot and drive the BETA ART / Cobban static site, and stand up its Supabase/PostgreSQL schema locally. Use when asked to run, start, launch, serve, screenshot, smoke-test or drive this app, or to apply and test the auth schema and its RLS policies.
---

# Run BETA ART / Cobban

Static site — HTML/CSS/JS, no bundler (D-002). `nav.js` is a classic script;
`auth-ui.js` is an ES module that reaches Supabase via the `esm.sh` CDN.

**Agent path: `.claude/skills/run-beta-art/driver.mjs`.** It serves `src/`
over HTTP and drives it with Playwright. All paths below are relative to the
repo root. Every command here was run in this container.

## Prerequisites

Nothing to `apt-get`. Chromium ships at `/opt/pw-browsers/chromium`;
`playwright` is a devDependency.

```bash
npm install          # 2 packages, ~1s
```

## Build

```bash
npm run build        # validate + emit dist/ → "build clean — validated and emitted 6 files"
```

No bundler: the build validates (unbalanced tags, undeclared CSS custom
properties, missing assets, JS syntax) and copies. It is meant to fail loudly.

## Run — agent path

```bash
node .claude/skills/run-beta-art/driver.mjs smoke
```

Real output:

```
desktop  title="BETA ART — Cobban" links=4
auth     text="Sign in" disabled=true title="Authentication is not configured yet"
mobile   menu before=none
mobile   menu after =flex aria=true
mobile   after Esc =none
errors   none
shots    /tmp/beta-art-desktop.png /tmp/beta-art-mobile-open.png
```

Other commands:

```bash
node .claude/skills/run-beta-art/driver.mjs shot mobile /tmp/m.png   # MENU=open to open the menu first
node .claude/skills/run-beta-art/driver.mjs eval "document.title"
node .claude/skills/run-beta-art/driver.mjs skiplink                 # checks the open defect
printf 'shot mobile /tmp/a.png\nquit\n' | node .claude/skills/run-beta-art/driver.mjs repl
```

`PORT` (default 8123), `SRC_DIR` (default `src`), `CHROMIUM_PATH`, `VP`,
`MENU` are the env knobs.

## Test

```bash
npm test             # 11 behavioural tests → "# pass 11  # fail 0", ~7s
```

## Run — human path

`python3 -m http.server 8099 --directory src`, then open the URL. Useless
headless; the driver is the path that works here.

## Database (Supabase schema, offline)

Supabase itself is unreachable from this container. The schema is verified
against local PostgreSQL 16 with a stub supplying `auth.users` / `auth.uid()`.
**Order matters** — `authenticated` must exist before the migration, or its
column-grant block is skipped:

```bash
rm -rf /tmp/pgdata && mkdir -p /tmp/pgdata && chown postgres:postgres /tmp/pgdata
su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /tmp/pgdata -A trust"
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/pgdata -o '-p 5433 -k /tmp' -l /tmp/pg.log start"
su postgres -c "psql -h /tmp -p 5433 -d postgres -q -c 'create database betaart;'"
su postgres -c "psql -h /tmp -p 5433 -d betaart -q -f $PWD/supabase/tests/local_auth_stub.sql"
su postgres -c "psql -h /tmp -p 5433 -d betaart -q -c 'create role authenticated nologin;'"
su postgres -c "psql -h /tmp -p 5433 -d betaart -v ON_ERROR_STOP=1 -q -f $PWD/supabase/migrations/0001_auth_and_app_schema.sql"
su postgres -c "psql -h /tmp -p 5433 -d betaart -f $PWD/supabase/tests/rls_policies_test.sql"
```

Expect T1=1, T2=2, T3/T5/T7 denied, T5b `collector`, T6 `UPDATE 1`,
T8 `INSERT 0 1`.

## Gotchas

- **`file://` silently breaks the app.** CORS blocks the ES module:
  `Access to script at 'file:///…/auth-ui.js' from origin 'null' has been
  blocked by CORS policy`. The nav still works, so it *looks* fine — but the
  auth button's title stays empty instead of reading "not configured". Always
  serve over HTTP. The driver does.
- **Playwright cannot find a browser on its own.** Bare `chromium.launch()`
  fails with `Executable doesn't exist at /root/.cache/ms-playwright/…`.
  Pass `executablePath: '/opt/pw-browsers/chromium'` (the driver and the
  tests both do). Do not run `playwright install`.
- **`node --test tests/` fails** with `Cannot find module '.../tests'`. The
  glob form is required — `npm test` uses `node --test tests/*.test.mjs`.
- **The RLS suite is not idempotent.** Re-running it against the same
  database gives `duplicate key value violates unique constraint
  "users_pkey"`. Drop and recreate `betaart` first.
- **Never test RLS as `postgres`.** Superusers and table owners bypass RLS
  entirely, so policies that do not work will appear to pass. The suite does
  `set role authenticated` for this reason.
- **Clicking `.nav-toggle` does not guarantee the menu is open.** Wait for
  `display !== 'none'`, then for `getAnimations()` to settle — a transform
  mid-animation makes a 44px box measure `43.999996`. `openMenu()` in the
  driver does both.
- **Unconfigured auth is the expected state.** `src/config.js` ships with
  empty `SUPABASE_URL`/`ANON_KEY`, so the button renders disabled with
  "Authentication is not configured yet". That is correct, not a failure.
- **`/work`, `/about`, `/contact` all 404** — only `/` is built. The navbar
  links to pages that do not exist yet.
- **`GET /favicon.ico → 404`** on every load. Cosmetic; the
  `web-asset-generator` skill produces the full set.

## Known defect (open)

The skip link does not move focus: `<main id="main">` has no `tabindex="-1"`,
so activating it leaves focus on `<body>` and the next Tab returns to the
skip link. **`npm test` passes anyway** — the test asserts only that `#main`
exists. Do not read a green suite as proof the skip link works.

```bash
node .claude/skills/run-beta-art/driver.mjs skiplink
```

```
first Tab   = "Skip to content"
after Enter = BODY
next Tab    = "Skip to content"
skip link works: false  <- OPEN DEFECT: <main> needs tabindex="-1"
```

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `Executable doesn't exist at /root/.cache/ms-playwright/…` | Pass `executablePath: '/opt/pw-browsers/chromium'` |
| `Cannot find module '/…/tests'` | Use `node --test tests/*.test.mjs` |
| `blocked by CORS policy` / auth button inert | Serving over `file://` — use the driver |
| `duplicate key … "users_pkey"` | Drop and recreate the `betaart` database |
| `EADDRINUSE` on 8123 | `PORT=8124 node .claude/skills/run-beta-art/driver.mjs smoke` |
| `role "authenticated" already exists` | Harmless — it is created once per cluster |
