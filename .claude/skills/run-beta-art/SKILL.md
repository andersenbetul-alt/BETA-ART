---
name: run-beta-art
description: Build, run, and drive the NAVIAR site (beta-art). Use when asked to start the site, serve it, build it, take a screenshot of a page, check every route, submit the contact form, or otherwise interact with the running app.
---

NAVIAR's bilingual (TR/EN) Next.js 16 marketing site. Every route is
prerendered; the only interactive surface is the contact form, which is a
React Server Action.

Drive it by starting the production server and running
`.claude/skills/run-beta-art/driver.mjs`. There is **no `chromium-cli` in
this container**, so the driver uses the project's own Playwright with an
explicit Chromium path (see Gotchas — the default launch fails).

All paths below are relative to the repo root.

## Prerequisites

Nothing to `apt-get`. Node 22 and a Chromium build at
`/opt/pw-browsers/chromium-1194/` are already present. Verify:

```bash
node --version                                        # v22.22.2
ls /opt/pw-browsers/                                  # chromium-1194 must exist
```

## Build

```bash
npm install          # skip if node_modules/ exists
npm run build        # ~30s, prerenders 32 routes
```

## Run (agent path)

Start the server on a fixed port and wait for it properly — `--retry-connrefused`
is the reliable wait; a bare bash loop without `sleep` spins instantly and
reports failure while the server is still starting:

```bash
(PORT=7311 npm start > /tmp/naviar-server.log 2>&1 &)
curl -s --retry 20 --retry-delay 1 --retry-connrefused \
  -o /dev/null -w "%{http_code}\n" http://127.0.0.1:7311/tr     # 200
```

Then drive it. Screenshots land in `.artifacts/` (override with `OUT=`;
server URL with `BASE=`).

```bash
# Every route from sitemap.xml: HTTP status, <h1> presence, console/page errors.
# Exit 0 = all clean. Takes ~25s for 32 routes.
node .claude/skills/run-beta-art/driver.mjs sweep

# Screenshot a page.
node .claude/skills/run-beta-art/driver.mjs shot /tr
node .claude/skills/run-beta-art/driver.mjs shot /en/services --dark --full
node .claude/skills/run-beta-art/driver.mjs shot /tr --width 390 --out mobile.png

# Fill and submit the contact form end-to-end. Exit 0 = the form was accepted.
node .claude/skills/run-beta-art/driver.mjs flow
```

`sweep` output looks like this (32 routes, all passing):

```
  ✓ 200 /tr                                    NAVIAR — Stratejiden uygulamaya, yanınızda
  ✓ 200 /tr/hizmetler                          Kararı alan da uygulayan da aynı kurum olmalı
  ✓ 200 /en/careers/kidemli-yonetim-danismani  Senior Management Consultant | NAVIAR
  …
32/32 temiz
```

Stop the server. **Use the bracket, it is not decoration** — see Gotchas:

```bash
pkill -f "next-serve[r]"
```

## Run (human path)

`npm run dev` → http://localhost:3000. Useless headless; use the agent path.

## Test

```bash
npm run check          # typecheck + eslint + vitest → 89 tests, 7 files
```

The two Playwright-based scripts **fail out of the box** with the
"Please run `npx playwright install`" banner. Both read
`PLAYWRIGHT_CHROMIUM_EXECUTABLE`; export it instead of installing anything:

```bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

BASE_URL=http://127.0.0.1:7311 npm run audit:a11y   # needs the server up
                                # → "34 sayfa görünümünde ihlal bulunamadı"
npm run assets:social           # rewrites public/og-*.png + LinkedIn assets
```

`assets:social` is deterministic — re-running it leaves `git status public/`
clean. That is *not* evidence it is correct; see the fonts gotcha.

## Gotchas

- **Playwright's default launch fails.** It looks for
  `chromium_headless_shell-1234`, which does not exist here; the installed
  build is `chromium-1194`. Error:
  `Executable doesn't exist at /opt/pw-browsers/chromium_headless_shell-1234/…`.
  The driver hardcodes `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
  Override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. **Never run
  `npx playwright install`** — it re-downloads browsers that are already here.

- **The contact form vanishes from the DOM on submit.** It is replaced by a
  confirmation panel, so `page.locator("form")` times out after submission
  (30s, with a misleading "waiting for locator('form')" message). The success
  signal is the form's *absence*, not a change in its text. The driver waits
  for `!document.querySelector("form")`.

- **A successful-looking submit does NOT prove the message was processed.**
  `src/lib/actions.ts:69` is a honeypot: if the hidden `website` field is
  filled, the action returns `{ status: "success" }` *without doing anything*.
  Verified — filling `website` produces a DOM state indistinguishable from a
  real success. This is deliberate anti-bot design. The driver leaves
  `website` empty; if you write your own submitter, do the same or you will
  be testing the bot path.

- **`pkill -f "next start"` kills your own shell.** `-f` matches the whole
  command line, and your shell's command line *contains the pattern you just
  typed* — so pkill kills the shell that ran it (exit 144, session gone).
  Verified: `pgrep -f "next-server"` matches both the server and the wrapper
  bash. Use a character class so the pattern text differs from what it
  matches: `pkill -f "next-serve[r]"` matched only pid 7101, the server.
  The same trap applies to any `pkill -f` / `pgrep -f` you type here.

- **Form field `id`s are React-generated** (`_R_klubrivb_-email`) and change
  between builds. Select by `name`, never by `id`.

- **Chromium has no outbound network here.** Any external request fails with
  `ERR_CONNECTION_RESET`. The site is unaffected because `next/font`
  self-hosts Inter and Source Serif 4 into the bundle — but
  `npm run assets:social` renders with Google Fonts and will silently fall
  back to DejaVu without erroring. Do not trust its output in this container.

- **Route slugs differ per locale.** `/tr/hizmetler` ↔ `/en/services`,
  `/tr/icgoruler` ↔ `/en/insights`, `/tr/iletisim` ↔ `/en/contact`. Don't
  assume a path exists in both languages; `sweep` reads `sitemap.xml`, which
  is the authoritative list.

- **`generateStaticParams` + `dynamicParams = false`.** An unlisted slug is a
  404 at build time, not a runtime miss.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Executable doesn't exist at …chromium_headless_shell-1234…` | Chromium path — see first gotcha. Do not run `npx playwright install`. |
| `locator.innerText: Timeout 30000ms exceeded … waiting for locator('form')` | You queried the form after submitting it. It's gone; that's success. |
| Server "won't start" but `/tmp/naviar-server.log` says `✓ Ready` | Your readiness loop had no delay. Use `curl --retry-connrefused`. |
| `sweep` reports HTTP 404 on a route you expected | Locale slug differs — check `sitemap.xml`. |
| `npm run audit:a11y` hangs | It needs the server running first. |
| Your shell dies with exit 144 when stopping the server | `pkill -f` matched your own command line — see the bracket gotcha. |
