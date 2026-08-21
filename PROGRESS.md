# BETA-ART — Progress Log

Running record of work on the navbar (BETA ART / Cobban) and the repository
generally. Newest entries first. For current state and blockers see
[STATUS.md](STATUS.md); for the reasoning behind choices see
[DECISIONS.md](DECISIONS.md).

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
