# BETA-ART — Progress Log

Running record of work on the navbar (BETA ART / Cobban) and the repository
generally. Newest entries first. For current state and blockers see
[STATUS.md](STATUS.md); for the reasoning behind choices see
[DECISIONS.md](DECISIONS.md).

---

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
