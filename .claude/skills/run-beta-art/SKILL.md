---
name: run-beta-art
description: >
  Run, serve, screenshot, measure and drive the Beta Art site — the hub, the
  archive, the business desk and Field Notes. Use when asked to start or serve
  the site, take a screenshot, check how a page renders or measures, click
  through a page, switch language, check dark mode, regenerate a page from its
  data, or run the gates (check.py, render-check.js). Also covers why a browser
  here renders the wrong typefaces, and why re-running a builder deletes
  structured data.
---

# Running Beta Art

Four static properties in one repository. **No build step, no package manager,
no dependencies to install** — `python3 -m http.server` at the repo root serves
every page as-is, and every path below is relative to that root.

What you actually need is not a launch command, it is a way to *look at* and
*drive* a page truthfully. That is `tools/shoot.js`, and it is the first thing
to reach for. Everything else on this page exists to support it.

## Prerequisites

Nothing to install. Verified present in this container:

```bash
python3 -V     # 3.11.15
node -v        # v22.22.2
node -e "console.log(require('/opt/node22/lib/node_modules/playwright/package.json').version)"   # 1.56.1
```

Playwright is **global**, at `/opt/node22/lib/node_modules/playwright`, and
`tools/shoot.js` and `tools/render-check.js` both try that path first. Chromium
is already downloaded (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) — never run
`playwright install`.

## Run — the agent path

`tools/shoot.js` starts its own server, loads the real typefaces, and shuts the
server down again. You do not need to serve anything yourself.

**Screenshot.** Widths come first (comma-separated for several), then paths:

```bash
node tools/shoot.js --out shots --dsf 1 390,1440 / /beta-art-business/
```

```
  390px  200  shots/index-390.png                 3265px tall
  390px  200  shots/beta-art-business-390.png    29740px tall
 1440px  200  shots/index-1440.png                1702px tall
 1440px  200  shots/beta-art-business-1440.png   15271px tall
```

It flags `⚠ SIDEWAYS SCROLL` when a page overflows its viewport. Add `--full`
for a full-page capture, `--dsf 2` for retina. **Then open the PNG and look at
it** — a run that prints four lines and a blank page is still a failed run.

**Measure.** Prints a value instead of writing a file — the right tool for "did
that CSS change actually land":

```bash
node tools/shoot.js --measure "getComputedStyle(document.querySelector('h1')).fontFamily" 1440 / /beta-art/
```

```
 1440px  /            Fraunces, Georgia, serif
 1440px  /beta-art/   Fraunces, Georgia, "Times New Roman", serif
```

**Drive.** `--do` runs JavaScript in the page before the capture, so a state a
visitor reaches by clicking can be measured or photographed. Three flows worth
knowing, all verified:

```bash
# the language switcher — 12 languages, index-mapped arrays in i18n.js
node tools/shoot.js --measure \
  "(function(){var s=document.querySelector('select');s.value='tr';s.dispatchEvent(new Event('change'));return document.querySelector('h1').textContent})()" \
  1440 /
#  → Bir insan yaptı. Kaynağında doğrulandı.

# the business desk's service finder — click an option, read the result panel
node tools/shoot.js --measure \
  "(function(){[...document.querySelectorAll('button.option')].find(x=>/website/i.test(x.textContent)).click();return document.getElementById('finder-budget').textContent})()" \
  1440 /beta-art-business/
#  → kr 9 900 – 34 000

# the journal's dark mode — photograph the state, not just assert it
node tools/shoot.js --do "document.getElementById('theme-btn').click()" \
  --out shots-dark --dsf 1 1440 /beta-art-blog/
```

Every interactive surface here is a language switch, a filter or a picker, and
they all leave their result in the DOM — so `--do` plus `--measure` is enough to
check one end to end. There is no second harness to write.

Useful hooks, read off the live pages: `#theme-btn`, `#menu-btn`, `#lang-picker`
on all four properties; `.tag-btn` and `#subscribe-form` on the journal;
`button.option`, `#finder-result`, `#finder-package`, `#finder-budget` on the
desk; `#enquiry-form` on the desk and `#licence-form` on the archive.

## Run — the human path

```bash
python3 -m http.server 8000     # then open http://127.0.0.1:8000/
```

Serves `/`, `/beta-art/`, `/beta-art-business/`, `/beta-art-blog/`, `/no/`,
`/legal.html`, `/404.html` — all 200. Useless headless; and if you point plain
Playwright at it you will measure the wrong typefaces (see Gotchas).

Pass `--base http://127.0.0.1:8000` to `shoot.js` to reuse a server you are
already running rather than letting it start its own.

## Regenerate a page

Most pages are generated. **Never hand-edit one** — edit the data table in
`tools/generators/`, re-run its builder, then re-run the gates.
`tools/generators/README.md` says which builder writes what.

```bash
python3 tools/generators/build.py      # → 25 hizmet sayfası yazıldı
python3 tools/check.py                 # re-derives what the builder dropped
```

That second command is not optional politeness — see Gotchas.

## The gates

```bash
python3 tools/check.py            # 14 correctness gates + browser gate  (~82s)
python3 tools/check.py --fast     # skip the browser gate                 (~3s)
python3 tools/check.py --quiet    # exit status only
node  tools/render-check.js       # just the browser gate, four widths
```

`check.py`'s exit status is the correctness set only. It also prints two
**readiness** reports (`gaps.py`, `launch.py`) which exit 0 by design — they
list work only a person can finish, and neither may be quieted to look clean.

Verified in both directions: adding one unstyled class to `index.html` makes
`classes.py` report it and `check.py --quiet` exit 1; removing it returns both
to green.

`.github/workflows/gates.yml` runs the same set on every push, in two jobs
(~2 min). Its second step is the one you cannot reproduce locally: after the
gates run it asserts `git diff --exit-code`, which fails when the gates had to
*repair* the checkout — the signature of a commit taken between a builder and
the gates. Running a gate locally is what fixes that state, so only a pristine
checkout can report it.

## Gotchas

- **A browser here renders the wrong typefaces, silently.** Chromium cannot
  CONNECT to `fonts.googleapis.com` in this container — plain Playwright gets
  `net::ERR_CONNECTION_RESET` and `document.fonts` comes back **empty**, so the
  page measures Georgia and Arial while still *reporting* `Fraunces` in
  `font-family`. Nothing errors. `curl` reaches the same host fine (HTTP 200) —
  only the browser's tunnel is blocked, which is exactly how `shoot.js` gets the
  fonts. Confirm you have the real thing:

  ```bash
  node tools/shoot.js --measure \
    "JSON.stringify([...document.fonts].map(f=>f.family+' '+f.status).filter((v,i,a)=>a.indexOf(v)===i))" \
    1440 /
  ```
  ```
   1440px  /   ["Fraunces unloaded","Fraunces loaded","Inter unloaded",
                "Inter loaded","JetBrains Mono unloaded","JetBrains Mono loaded"]
  ```
  Every family must show at least one `loaded` face. An empty array is the
  failure, and it is silent.

- **`render-check.js` blocks fonts on purpose** and says so. That is right for a
  gate — fast and deterministic — and wrong for anything you intend to look at
  or quote a number from. Treat a near-miss there as a near-miss, not a pass.

- **Re-running a builder deletes structured data.** `build.py` rewrites all 25
  service pages *without* the JSON-LD that `enrich.py` had appended — 32 lines
  gone from each file, no warning. `enrich.py` is a writer, not a checker, and
  `check.py` runs it, which is why "builder, then gates" restores the tree to
  byte-identical. Run the builder alone and commit, and you ship 25 pages with
  their breadcrumbs stripped — which is what the CI step above exists to catch.

- **The font cache is cold once per container.** First `shoot.js` run prints
  `fetching fonts (once)…` and takes ~3s; after that `tools/.fontcache/` holds
  17 files (472K, gitignored) and nothing is downloaded again.

- **`--do` with `--out` overwrites.** The filename is derived from path and
  width only, so a light and a dark capture of the same page collide. Give the
  driven run its own `--out` directory.

- **`git checkout -- .` from the repo root reverts your edits too.** Pathspec
  exclusions that work for `git status` do not protect files from `checkout`.
  Restore a single experiment with a copy, not a bulk checkout.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'playwright'` | Both tools try `/opt/node22/lib/node_modules/playwright` first, then a plain `require`. The fallback resolves only from a **local** `node_modules` — a `--global` install is not on the resolution path for a script inside the repo. `npm install playwright` in the repo root. |
| `net::ERR_CONNECTION_RESET` on `fonts.googleapis.com` | You are using plain Playwright. Use `shoot.js`, which serves the fonts from cache. |
| `shoot.js` writes nothing and prints usage | Width comes **first**: `1440 /page`, not `/page 1440`. |
| Port already in use | `shoot.js` picks `8000 + (pid % 900)`; a leftover server from a killed run is the usual cause. |
| `check.py` red after editing a page by hand | The page is probably generated. Find its builder in `tools/generators/README.md`, move the change into the data table, re-run it. |
