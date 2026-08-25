---
name: run-naviar
description: Build, run, screenshot and drive the NAVIAR pilot — the static site, the booking wizard, the case-queue admin page and the API. Use when asked to run NAVIAR, start the site or server locally, take a screenshot of a page, walk the booking flow end to end, check the admin queue, or reproduce a bug in the running app rather than in the test suite.
---

# Running NAVIAR

Two processes and no build step: a static file server for the pages, and the
Express + `node:sqlite` API in `server/`. Both are driven by
`.claude/skills/run-naviar/driver.mjs`, a Playwright/fetch harness that
screenshots pages, walks the booking wizard against the live API, signs into
the case queue, and smoke-tests the endpoints.

All paths below are relative to the repo root.

## Prerequisites

Nothing to `apt-get`. Node 22 and `python3` are enough; the driver finds
Chromium through Playwright.

```bash
node -v                 # v22.22.2 here
cd server && npm install && cd ..   # only if server/node_modules is missing
```

`playwright` is a declared devDependency but is often **not installed** in a
fresh checkout (`npm ls` reports `UNMET DEPENDENCY playwright`). The driver
falls back to the global copy at `/opt/node22/lib/node_modules/playwright`, the
same fallback the browser test suite uses. If neither exists:

```bash
npm install playwright
```

## Start both servers

```bash
python3 -m http.server 8080 --directory . >/tmp/naviar-static.log 2>&1 &
ADMIN_TOKEN=dev-token-long-enough-for-the-24-char-minimum \
  DATA_DIR=/tmp/naviar-data \
  node server/server.js >/tmp/naviar-api.log 2>&1 &
sleep 3
curl -s http://127.0.0.1:8787/api/health
```

Expected: `{"ok":true,"services":6,"payments":{"card":false,"vipps":false,"invoice":true}}`

### One-shot alternative

If the user-level `webapp-testing` skill is installed, its helper starts both
servers, waits for the ports, runs a command and tears everything down:

```bash
ADMIN_TOKEN=dev-token-long-enough-for-the-24-char-minimum DATA_DIR=/tmp/naviar-data \
python3 ~/.claude/skills/webapp-testing/scripts/with_server.py \
  --server "python3 -m http.server 8080 --directory ." --port 8080 \
  --server "node server/server.js" --port 8787 \
  -- node .claude/skills/run-naviar/driver.mjs api
```

That skill is not required — it is installed per user, not per repo, so the two
commands above stay the primary path.

`ADMIN_TOKEN` must be **24 characters or more** — below that the server refuses
to serve the admin routes at all and returns `503 admin_disabled` rather than
running with a guessable door. `DATA_DIR` keeps the throwaway SQLite file out of
`server/data/`.

## Run (agent path)

```bash
node .claude/skills/run-naviar/driver.mjs <command>
```

| Command | What it does |
|---|---|
| `smoke` | Loads all six pages, screenshots each full-page, reports title, `h1` and any real JS error. Exit 1 if a page logged one. |
| `shot [page] [lang]` | One full-page screenshot, e.g. `shot karriere.html en`. Defaults to `index.html no`. |
| `flow` | Walks the four-step booking wizard in the browser **against the live API**, submits, and confirms the case reached the queue. |
| `admin` | Signs into `admin.html` with `ADMIN_TOKEN` and screenshots the case queue. |
| `api` | The API alone, no browser: health, both server-side gates, a real booking, the admin door, and an illegal state transition. |

Screenshots land in `.run-out/` (gitignored). Override with `OUT=`;
`SITE=`, `API=` and `ADMIN_TOKEN=` override the origins and the token.

Verified output:

```
$ node .claude/skills/run-naviar/driver.mjs flow
step 1: 6 services offered
step 2: Velg dag og tidspunkt
step 3: Dine opplysninger
step 4: Din forespørsel
        refusal list: 8 items · payment controls: 0
result: Forespørselen er mottatt … Referanse NAV-B1774B …
reference: NAV-B1774B
queue: NAV-B1774B status=new low_risk=1
```

```
$ node .claude/skills/run-naviar/driver.mjs api
200  health                     {"ok":true,"services":6,…}
400  booking without lowRisk    {"error":"scope_confirmation_required"}
400  booking without a phone    {"error":"missing_fields"}
200  booking 2026-08-27 09:00   {"reference":"NAV-BBA99D"}
200  admin queue                {"counts":{"bookings":2,…}}
401  admin queue, no token      {"error":"unauthorized"}
200  advance to in_review       {"booking":{…"status":"in_review"…}}
409  illegal jump to delivered  {"error":"bad_transition"}
```

## Run (human path)

`python3 -m http.server 8080` and open the page in a browser. The site **must**
be served over HTTP — opening `index.html` from the filesystem shows a warning
bar instead of the page, because translations load with `fetch`. To make a
human browser talk to the API you have to edit `apiBase` in
`assets/js/config.js`; the driver does that in flight instead (below).

## Gotchas

- **The browser does not talk to the API by default.** `config.js` ships with
  `apiBase: ''`, which is demo mode: the booking wizard invents a local
  reference and posts nothing. A "successful" booking in the browser proves
  nothing about the server. The driver rewrites `config.js` in flight for the
  `flow` and `admin` commands.

- **Rewriting `apiBase` needs a line anchor.** The comment three lines above the
  setting also reads `apiBase: ''`, so an unanchored
  `replace(/apiBase:\s*''/)` patches the *comment*, leaves the real value empty,
  and the page silently stays in demo mode. Use `/^(\s*)apiBase:\s*''/m`. The
  driver throws if the substitution finds nothing, because the failure is
  otherwise invisible.

- **Google Fonts must be aborted.** Every page links them. Nothing under test
  depends on the webfont, but each `goto` waits on those two requests — 12.6 s
  per page load where the network is slow or blocked, against 50 ms with them
  refused. The driver routes them to `abort()`; so does the browser suite.

- **Aborting them then produces fake console errors.** Chromium logs a generic
  `Failed to load resource: net::ERR_FAILED` with no URL attached. The driver
  drops that specific line and counts failed *requests* by URL instead —
  otherwise every page reports "JS ERRORS" for the driver's own doing.

- **A meeting service needs a real slot.** Posting a booking without `date` and
  `time` returns `400 bad_slot`, and the server also refuses weekends and
  anything inside the lead time. The `api` command walks forward from three days
  out, skipping weekends, until one is accepted, rather than hardcoding a date
  that rots.

- **`server/` has its own dependency tree.** `express`, `cors`, `dotenv` and
  `stripe` live in `server/node_modules`, not the root one — the root has only
  `axe-core`. `npm install` at the root does not install them.

- **The admin stat card for the need-finder tally reads "Need-finder answers".**
  It rendered "FIT CHECKS" (leftover v1 `fit_checked` wording) until 25 Aug 2026.

- **A career booking without a phone number is accepted** (fixed 25 Aug 2026):
  the server now mirrors the form and requires a phone only for non-karriere
  services. `tests/server.test.mjs` covers both directions.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Error: Cannot find module 'playwright'` | Not installed locally *and* the `/opt/node22` fallback is missing. `npm install playwright`. |
| `503 {"error":"admin_disabled"}` | `ADMIN_TOKEN` is unset or shorter than 24 characters. |
| `429 {"error":"locked_out"}` on admin routes | Five wrong tokens from this address; the lockout is 15 minutes, and a correct token during it is still refused. Restart the API to clear it. |
| `429 {"error":"too_many_requests"}` on `/api/bookings` | 20 bookings per hour per address. Raise it with `BOOKING_RATE_LIMIT=200`. |
| Booking succeeds in the browser but the queue stays empty | Demo mode — see the first two gotchas. Check `await page.evaluate(() => window.NAVIAR_CONFIG.apiBase)` is not `''`. |
| `waitForSelector('.service-opt')` times out | The wizard renders into `#bkBody` after i18n resolves; the driver waits 500 ms after `load`. A cold static server can need more. |

## Test suite

Separate from running the app, and it does not need the servers above — each
suite starts its own on its own port.

```bash
npm test              # all four suites, ~1 min
npm run test:server   # ~10s, boots the API against a throwaway database
npm run test:browser  # ~45s, real Chromium: WCAG 2.1 AA, booking, Stripe return
```
