# BETA-ART — Progress Log

Running record of work on the navbar (BETA ART / Cobban) and the repository
generally. Newest entries first. For current state and blockers see
[STATUS.md](STATUS.md); for the reasoning behind choices see
[DECISIONS.md](DECISIONS.md).

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
