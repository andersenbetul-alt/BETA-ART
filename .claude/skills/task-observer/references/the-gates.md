# The gates, and what each one came from

Read this before writing a new gate. The check you want may already live inside
one of these, and adding a second place that checks the same thing is how a
gate set stops being trusted.

Two lists, and the difference matters. Mixing them makes "the gates pass" sound
impossible when it is not.

## Correctness — these must all exit zero

A non-zero here is a defect, and nothing ships past it.

| Gate | Lines | Since | Checks |
|---|---:|---|---|
| `sitemap.py` | 132 | 2026-08-18 | URLs follow the pages, and no two share one |
| `feed.py` | 118 | 2026-08-19 | The two feeds follow the articles |
| `enrich.py` | 132 | 2026-08-18 | Breadcrumb and FAQ structured data |
| `audit.py` | 111 | 2026-08-18 | HTML |
| `qc.py` | 722 | 2026-08-18 | JS, CSS, i18n, prices, hosts, oversized files |
| `tokens.py` | 138 | 2026-08-21 | A custom property is defined once, and resolves |
| `classes.py` | 132 | 2026-08-23 | A class on a page has a rule behind it |
| `copy.py` | 195 | 2026-08-19 | Conversion copy |
| `claims.py` | 249 | 2026-08-20 | A promise on a page is a promise in the notice |
| `klarsprak.py` | 446 | 2026-08-20 | Norwegian against Språkrådet's rules |
| `languages.py` | 172 | 2026-08-20 | The notice says what `languages.json` records |
| `plates.py` | 177 | 2026-08-19 | Catalogue integrity |
| `render-check.js` | — | — | A real browser, four widths |

Run them all with `python3 tools/check.py`.

## Readiness — these report, they do not fail

They answer "is this finished?", not "is this correct?". They exit **0**,
because having something to report is not a failure — the same reason
`git status` exits 0 on a dirty tree.

| Report | Lines | Answers |
|---|---:|---|
| `gaps.py` | 256 | What is still missing |
| `launch.py` | 227 | Ready? Machine answers vs. person answers |

`--strict` gates on either one, which is what a deploy pipeline should use.
**What may never happen is quieting the report.** `launch.py` says it of
itself: the person list is *"never marked done here."*

## Not gates

| File | What it is |
|---|---|
| `domain.py` | The domain, in one place |
| `i18n_pakke.py` | Builds a review packet for one language's strings |
| `check.py` | The runner |

## The ones born from a logged observation

These are the proof the loop works. Each traces to a numbered entry in
`skill-observations/log.md`.

| Gate | Observation | The mistake |
|---|---|---|
| `tokens.py` | 2 | A token block appended to three `:root`s silently redefined `--ease`, changing every transition on the site. Nothing failed; it was caught by reading the diff, which is not a method. |
| `classes.py` | 6 | Markup moved between properties without its CSS. The hub's Norwegian page shipped `EnglishNorsk` — browser-default blue, underlined, on a site with neither. Four more of the same shape turned up immediately, one of them months old. |
| `qc.py check_generator_hosts` | 7 | Eleven generators still held Vercel preview hosts after the site moved to real subdomains. Two builder runs put 500 stale URLs back. HEAD had zero. |
| `qc.py check_translated_meta` | 11 | The Norwegian hub and journal shipped with English `<title>` and description — the only two strings a search result shows, on the two pages built to be found in Norwegian. |

## The 12px floor, and why a gate can reopen an old bug

`tokens.py` enforces a 12px minimum on `font-size`. Introducing it took
`render-check.js` from **0 findings to 83** in one run, because narrow
breakpoints had been fitting the header at 360px by setting navigation at
`.58rem` — 9.28px.

The fix was not to shrink the text again. It was to reclaim the width from
tracking (about 1.4px per character at 12px), padding and gaps. 83 → 57 → 5 →
0.

That is the shape to expect: **a correct new gate often exposes an old
compromise.** The gate is usually right. Do not weaken it to get green.

## A caveat on the browser gate

`render-check.js` blocks font requests, because Chromium in this environment
cannot reach `fonts.googleapis.com`. Its text measurements are therefore taken
in the fallback stacks, and it says so in its own output. **Treat a near-miss
there as a near-miss, not a pass.**

To measure with the real typefaces, serve the site locally and drive it with
Playwright using route interception against the cached fonts — that is how the
screenshots in this project are taken.
