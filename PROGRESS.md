# BETA-ART — Progress Log

Running record of work on the navbar (BETA ART / Cobban) and the repository
generally. Newest entries first. For current state and blockers see
[STATUS.md](STATUS.md); for the reasoning behind choices see
[DECISIONS.md](DECISIONS.md).

---

## 2026-08-25 — Skip link fixed; STATUS.md corrected

Closed the last open defect. `<main>` had no `tabindex="-1"`, so activating
the skip link left focus on `<body>` and the next Tab returned to the skip
link — the link was decorative.

The test that should have caught it asserted only that the target element
existed, which is true of the broken page. Replaced with one that presses
Tab, confirms the skip link is the first stop, presses Enter, and asserts
`document.activeElement` is the target. Before accepting it, the fix was
reverted and the test observed failing — `focus should move to #main, but
landed on BODY#`. A test never seen failing is not evidence, per
`evidence-discipline`.

11/11 tests pass, build clean.

Also corrected `STATUS.md`, which had drifted into contradicting itself. Its
Summary claimed the repo was "a bare scaffold" with "no source directories,
no package manifest, no tests" while its own tables below listed six source
files and 11 passing tests. The dependency graph marked D-002 and D-003 as
"OPEN — hard blocker" three lines above a paragraph stating both were closed,
and the critical path read "nothing on this graph has been started". All
corrected against what is actually in the repository, and the two answered
open questions removed.

## 2026-08-25 — `financial-model-build` skill created

Packaged the method from a private-equity investment model build into a
project skill at `.claude/skills/financial-model-build/`, following the
structure of `evidence-discipline`: `SKILL.md`, `references/`, `LICENSE`.

The skill is domain-general — quantitative deliverables, not the art site. It
lives here because this repository is the durable memory across sessions,
which is the whole reason the memory files exist.

Its central rule came from a real near-miss. A model built exactly to a
client's stated assumptions returned 8.7x MOIC and 54% IRR. Every formula was
verified against independent hand math and tied; the recalc was clean. The
absurdity of the result — not any error in it — was the actual finding, and
it was nearly presented as the answer. §1 of the skill is that check.

`references/environment.md` records toolchain failures diagnosed the hard way:
`recalc.py` reporting a missing LibreOffice Calc install as a timeout (two
wasted retry cycles), `openpyxl` absent despite the xlsx skill stating it is
preinstalled, annotation strings beginning with `=` silently becoming broken
formulas, and connectors that appear unavailable when they are merely toggled
off for the session.

`references/worked-example.md` carries the build end to end, including both
wrong turns.

Observations 8 and 9 added to `skill-observations/log.md`, both ACTIONED into
this skill. Doc map in `CLAUDE.md` updated.

Note: `STATUS.md` still describes the repository as "a bare scaffold" with no
navbar implementation, which contradicts the built and tested `src/`. That
staleness predates this change and is left untouched rather than rewritten as
a side effect — flagged here so it is not mistaken for current state.

## 2026-08-21 — Second review (Vercel guidelines) and fixes

Installed `web-design-guidelines` from `vercel-labs/agent-skills` and ran it
over the navbar as an independent check on the earlier HIG audit. It found
eight issues the first pass missed, two of them real bugs: no skip link, and
the mobile menu staying open on outside click and after following a link.

All fixed and verified by interaction test — outside click closes, link click
closes, toggle still round-trips, skip link reachable on first Tab.

Also worked around `skills.sh` being unreachable behind the proxy: `npx skills
find` silently returns zero results for every query, which reads as "no skills
exist" rather than "cannot reach registry". Built a local catalog (44 skills,
6 sources) and a search script at `~/.claude/skills/find-skills/`, and noted
the trap in that skill's own SKILL.md. Installing was never affected — `add`
pulls from GitHub, not skills.sh.

---

## 2026-08-22 — run-beta-art skill

`.claude/skills/run-beta-art/` — SKILL.md plus a Playwright `driver.mjs` that
serves `src/` and drives it (`smoke`, `shot`, `eval`, `skiplink`, `repl`).
`chromium-cli` is not available in this container, so the driver is a real
script rather than an inline heredoc.

Everything documented was executed here, then re-run in a clean `env -i` shell
following SKILL.md line by line with no improvisation.

Gotchas found by running it, not by reading docs:

- `file://` silently breaks the app — CORS blocks the ES module, so the nav
  still works and it *looks* fine while auth never initialises.
- Bare `chromium.launch()` fails; the container's browser is at
  `/opt/pw-browsers/chromium`.
- `node --test tests/` fails — the glob form is required.
- The RLS suite is not idempotent; re-running hits `users_pkey`.
- `authenticated` must exist *before* the migration or its column-grant block
  is skipped.

Also added `driver.mjs skiplink`, because the first draft documented
`eval "document.activeElement.id"` as evidence of the skip-link defect — it
returns `""` and demonstrates nothing. The replacement drives Tab/Enter/Tab
and reports `skip link works: false`.

---

## 2026-08-22 — Tooling stack verified

`STACK.md` records arrow-by-arrow what was observed, not assumed.

The open architectural question turned out to be answerable: OmniRoute does
expose `/v1/messages`, so Claude Code can point at it. Proved with controls —
invented routes 404 while `/v1/messages` 500s from an upstream failure, so the
router discriminates and the request genuinely reached a provider.

Headroom took five attempts. It reported 0 tokens saved four times, and I
twice said it "compresses nothing". Every zero had a different cause and none
was the tool: context under the limit, messages under the 250-token floor,
`protect_analysis_context` shielding everything, and a missing dependency
(`fastembed`) that the advertised `[ml]` extra does not install. With
protections lowered it saved 8,192 of 42,100 tokens — 19.5%, via
`router:code_aware`. Real, but not the advertised 60-95%.

Logged as observation 7: absence of an effect is not evidence of absence of
capability, and a negative verdict needs the same proof as a positive one.

---

## 2026-08-22 — Supabase browser client

Wrote the client D-006 called for: `src/auth.js`, `src/config.js`,
`src/auth-ui.js`. supabase-js loads from a CDN as an ES module, so the
no-build-step constraint holds.

`config.js` documents that the anon key is publishable by design — RLS is
what protects the data — and that the service_role key must never be served
to a browser. The build now enforces that second point.

Extending the build surfaced two defects in the build itself, both found by
running it:

- It executed browser modules via `import()`, which fails in Node on
  `document is not defined`. Browser modules must be *parsed*, not run — now
  checked with `node --check` against a temp `.mjs`.
- The service_role check matched `config.js`'s own comment warning about
  service_role keys. Comments are now stripped before matching.

Both new checks were then proven to fail on real defects: a genuine
`service_role` assignment is rejected, and a real syntax error is caught.

Driven in a browser: with no config the control is disabled and titled
"Authentication is not configured yet", and the mobile menu still opens.
Sign-in itself is **unverified** — no Supabase project exists and
supabase.co is unreachable here, so that path has never run.

---

## 2026-08-22 — evidence-discipline skill created

Turned the three OPEN observations into one skill at
`.claude/skills/evidence-discipline/` (SKILL.md + references/ + LICENSE,
CC BY 4.0), rather than three thin ones: all three were the same failure —
the check that ran was not the claim that got made.

Sections: assert the behaviour not a precondition; capture the failure before
explaining it; run checks at the privilege a real user has; prove the check
can fail. Plus a pre-flight checklist, since task-observer's own guidance is
that rules without an enforcement step are not reliably followed.

Followed the Pre-Flight Principle on the skill itself: the JS snippet
embedded in SKILL.md was executed against the running page before shipping.
It failed — correctly, because the skip-link bug is still open — while the
weak precondition version passed. That contrast is the skill's whole thesis,
now verified rather than asserted.

Observations 1–3 marked ACTIONED.

---

## 2026-08-22 — task-observer moved into the repo

Installed `task-observer` at `.claude/skills/task-observer/` (project level)
rather than only at user level, and started `skill-observations/log.md`. Both
are tracked, so they survive the container — the skill's value is memory
between sessions, which a user-level install in an ephemeral box cannot
provide.

Three observations captured from this session's actual friction, all OPEN:

1. A test asserted a skip link's *target existed* and passed, while the skip
   link itself did nothing. Precondition asserted, behaviour claimed.
2. An intermittent failure was misdiagnosed twice before the raw assertion
   text revealed floating-point geometry (`43.999996` vs `44`).
3. An RLS `UPDATE` policy scoped to the owning row still allowed a user to
   set their own `role` column — rows are not columns. The fix then blocked
   creating the first owner.

`last-review-date.txt` seeded with `never`; no review has run.

---

## 2026-08-22 — Authentication schema

Supabase auth + PostgreSQL, recorded as D-006. Note this supersedes part of
D-002: the site is no longer purely static, though the pages remain static
HTML/CSS talking to Supabase from the browser.

`supabase/migrations/0001_auth_and_app_schema.sql` — `profiles` (role, FK to
auth.users), `works` (published flag), `inquiries` (contact-led sales, per
BUSINESS.md A+C). RLS on every table; Postgres denies access to an RLS table
with no matching policy, so the default is closed.

Supabase is unreachable from this container, so the schema was verified
against a **local PostgreSQL 16.13** instead, with an `auth` stub supplying
`auth.users` and `auth.uid()`. Tested as an unprivileged `authenticated` role
— testing as superuser proves nothing, since superusers bypass RLS.

Two real defects, both found by the tests and both fixed:

1. **Privilege escalation.** RLS decides which *rows* you may update, never
   which *columns*. `profiles_update_own` let a collector set `role='owner'`
   on their own row — confirmed working in the first run. Fixed with
   column-level grants (`grant update (display_name)`) plus a trigger, so
   neither guard is load-bearing alone.
2. **Bootstrap deadlock.** The new trigger then made the first owner
   impossible to create: nobody was owner, so nobody could promote anyone.
   Fixed by allowing the change when `auth.uid()` is null — service_role or
   migration context, already privileged.

8/8 policy tests pass. Nothing is deployed; no Supabase project exists.

---

## 2026-08-22 — İş modeli seçenekleri

`BUSINESS.md` eklendi. Açıkça öneri olarak işaretlendi: depoda fiyat, kitle,
ürün veya satış kanalı verisi yok, dolayısıyla bir model *çıkarılamaz*.

Depodan çıkan tek gerçek gözlem: navigasyon `Home · Work · About · Contact`
— `Shop` yok. Bu, talep üzerine satışı ima ediyor. D-003 verilirken bu
düşünülmedi, konvansiyonel set seçildi; ama şu an mimaride yazılı olan model
budur.

Dört model karşılaştırıldı. Baskı/edisyon satışı (B) tek başına D-002'yi
yeniden açıyor — statik HTML sepet ve ödeme taşımıyor; Stripe Payment Links
ile iliştirilebilir ama bu bilinçli alınması gereken bir mimari borç.

Öneri: A (orijinal eser) + C (komisyon) ile başla — mevcut mimariye uyar, ek
maliyet yok. Sabit gider yıllık ~15 USD alan adı; acele karar gerekmiyor.

Belge D-004 ("Cobban" nedir) cevaplanmadan tamamlanamaz.

Ayrıca `deploy-to-vercel` skill'i kuruldu.

---

## 2026-08-21 — Test suite and build

The project had no tests and no build. Added both, sized to a static site.

- `npm run build` — validates and emits `dist/`. No bundler (D-002); its job is
  to fail loudly. Catches unbalanced tags, undeclared CSS custom properties,
  missing referenced assets, JS syntax errors.
- `npm test` — 11 behavioural tests (`node:test` + Playwright) that lock in
  every fix from `AUDIT.md`, so the unopenable-mobile-menu regression cannot
  return silently.

Both were verified to actually fail: breaking the toggle listener failed 3
tests; renaming a CSS custom property failed the build with the exact
`var(--ink) is never declared`.

Two test bugs found and fixed along the way:

- The outside-click test clicked `main` at (10,10), which the open menu
  overlays — Playwright timed out. Now clicks below the dropdown.
- An intermittent failure in the 44px hit-target test (~1 run in 8). Two
  wrong diagnoses first — "slow layout after goto" (added
  `document.fonts.ready`) and "click race" (added explicit open-state waits).
  Neither was the cause; both changes are worth keeping, but the failure
  persisted. Capturing the actual assertion gave it away:

      '390px: got 43.999996185302734, 44, 44, 44, need >= 44'

  Floating point. The open animation applies `translateY(-0.5rem)`, and a
  transformed box measures in fractional device pixels, so 44px reads back as
  43.999996. The test was measuring mid-animation and comparing floats
  exactly. Fixed by awaiting `getAnimations()` completion before measuring,
  plus a 0.5px tolerance. Verified the tolerance still catches a real
  regression: `min-height: 1.5rem` fails with `got 24, need >= 44`.
  12 consecutive clean runs.

---

## 2026-08-21 — Audit findings fixed

Fixed every finding from `AUDIT.md`. The mobile menu bug was a defect in code
written earlier the same day, so this closes it out rather than leaving broken
markup in the tree.

- `src/nav.js` (new, 19 lines) — toggles the menu, keeps `aria-expanded` in
  sync, Escape closes and returns focus to the toggle
- `src/styles.css` rewritten on custom properties: 4px spacing scale, Major
  Third type scale in `rem`, motion durations, and a colour set where every
  text pair clears AA
- `src/index.html` — `aria-controls`/`aria-current`/`<nav aria-label>`, and the
  active item corrected to Work

Verified the same way the audit was: Chromium at 1280×800 and 390×844, real
clicks, WCAG maths. Toggle 44×44, menu `none`→`flex`, `aria-expanded`
false→true→false, reduced-motion measured at `1e-05s`.

One thing the audit missed and this pass caught: the divider at `#c9c9c9` was
still only 1.66:1, under the 3:1 needed for non-text UI. Moved to `#8f8f8f`
(3.23:1). Also added `:focus-visible` rings, which had been absent entirely.

---

## 2026-08-21 — Navbar built and audited

Built the first-pass navbar and audited it. The audit was requested three
times; rather than keep asking for the two blocking decisions, closed them on
the defaults already recommended in `DECISIONS.md` and stated the assumptions:

- **D-002 → static HTML + CSS** (accepted)
- **D-003 → Home, Work, About, Contact** (accepted)

Added `src/index.html` (34 lines) and `src/styles.css` (105 lines). Then
audited with the `apple-design` skill against HIG references, using real
measurements — Chromium render at 1280×800 and 390×844, WCAG contrast maths.

Findings in [AUDIT.md](AUDIT.md). Headline:

- **Mobile menu is non-functional.** `.nav-links.open` is never applied; there
  is no JavaScript in the project. Below 700px there is no navigation at all.
- Two contrast failures: `#777` = 4.48:1 (needs 4.5), `#999` = 2.85:1
- Hamburger is 22×18px, below the 28×28 minimum and far below 44×44
- No `prefers-reduced-motion` anywhere
- Motion durations ~2× too slow (400ms hover, 500ms menu)
- No spacing scale: 2/8/10/12/14/20/22/40px on no grid
- Brand and subtitle typographically identical, separated by colour alone
- Active nav item says "Home" while the page heading says "Work"

Not yet fixed — the audit was the deliverable. Fix order is in `AUDIT.md`.

Also cloned `freshtechbro/claudedesignskills` to look at its
`animation-components` bundle (react-spring, anime.js, AOS, Lottie). Not
adopted: all of it is JS-library tooling for React, and this navbar needs one
`prefers-reduced-motion` block and two shorter durations, not an animation
library.

---

## 2026-08-21 — Merged Karpathy working guidelines into project memory

Pulled `CLAUDE.md` from
[forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)
— behavioural guidelines for reducing common LLM coding mistakes (think
before coding, simplicity first, surgical changes, goal-driven execution).

**Merged rather than copied over.** The two files serve different purposes and
do not overlap: ours holds project facts, theirs holds working method. The
incoming file's own second line says "Merge with project-specific instructions
as needed." A straight `cp` would have deleted the BETA-ART project memory.

The guidelines now sit under a `# Working guidelines` section at the end of
`CLAUDE.md`, headings demoted one level, with a note that project facts win on
conflict. Not adopted: the repo's `skills/karpathy-guidelines/SKILL.md`, its
`EXAMPLES.md`, or the Cursor variant — not asked for.

No change to navbar status: still not started, still blocked on D-002 and
D-003.

---

## 2026-08-20 — Repository audit and status tracking

**Branch:** `claude/navbar-beta-art-cobban-6t07ru`

Audited the repository and found it to be a bare scaffold: `README.md` was a
single title line, `SECURITY.md` was GitHub's unedited template, and there
was no source code, package manifest, CI, or tests.

Confirmed no navbar implementation exists in the working tree or in git
history (2 commits: `fc6b3a9` initial commit, `1bfd75f` add SECURITY.md).
The term "Cobban" appears only in the branch name — in no file.

Changes landed:

- Added `CLAUDE.md` — project memory: durable facts, conventions, and the
  map of which file holds which record
- Added `STATUS.md` — real state of the navbar work, blockers, open questions
- Added `PROGRESS.md` — this log
- Added `DECISIONS.md` — decision log; D-001 accepted, D-002…D-005 recorded
  as open with options and a recommendation on the stack
- Rewrote `README.md` — project overview, status pointers, repository layout,
  and a note that there is nothing to build yet
- Added a mermaid dependency graph to `STATUS.md` showing how the open
  decisions gate each piece of navbar work, and what the critical path is

**Navbar progress: 0% — not started.** Blocked on D-002 (stack) and D-003
(page list). No code has been written for it, and none can be until those two
questions are answered.

---

## Earlier

| Commit | Change |
| ------ | ------ |
| `1bfd75f` | Create SECURITY.md (template, not customised) |
| `fc6b3a9` | Initial commit |

---

## How to use this file

Add a dated entry each time work lands, in the same commit as the change.
Record what actually changed and what is still outstanding — keep claims
matched to what is in the repository, not to what is planned.
