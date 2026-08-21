# Project Memory — BETA-ART

Read this first. It is the durable memory for this project: the facts that
stay true between sessions, so work does not restart from zero each time.
Plain markdown, in the repo, readable by anyone.

## What this project is

BETA-ART is an art project site in early setup. The active work item is the
site navigation bar, referred to as the "BETA ART / Cobban" navbar.

## Where the memory lives

| File | Holds | Update when |
| ---- | ----- | ----------- |
| `CLAUDE.md` | This file — durable facts, conventions, how the docs fit together | Conventions or project shape change |
| `STATUS.md` | Current state: what is done, what is blocked, open questions | Any work lands, or a blocker changes |
| `PROGRESS.md` | Dated log, newest first — what actually changed and when | Every commit that changes behaviour or docs |
| `DECISIONS.md` | Numbered decisions (D-001…): the choice, the reasoning, what it rules out | A decision is made, opened, or superseded |
| `README.md` | Outward-facing overview and repository layout | Layout or entry points change |
| `SECURITY.md` | Security policy — currently GitHub's unedited template | A real contact and version table are set |

Update these in the **same commit** as the work they describe. Records kept
in a separate commit, or in chat, drift and stop being trustworthy.

## Established facts

- The repository is a scaffold. As of 2026-08-20 it contains only markdown —
  no source directories, no package manifest, no CI, no tests.
- The navbar is **not started**. Nothing in the working tree or in git history
  implements it.
- "Cobban" appears only in the branch name `claude/navbar-beta-art-cobban-6t07ru`.
  It is in no file, and its meaning is not established (see D-004).
- Two decisions block all navbar work: **D-002** (technology stack) and
  **D-003** (site page list, which determines the nav links).

## Conventions

- Work happens on feature branches; navbar work is on
  `claude/navbar-beta-art-cobban-6t07ru`.
- Decisions get a number (`D-006`, …), a date, a status, the reasoning, and
  what they rule out. Superseded decisions are marked, never deleted — the
  history of the reasoning is the point.
- Status claims must match what is in the repository. Write "not started"
  when nothing exists; do not describe planned work as progress.
- Prefer the simplest thing that works. The stack recommendation in D-002 is
  static HTML + CSS unless interactivity beyond a menu is actually needed.

## Open questions (carry these into the next session)

1. Which stack — static HTML/CSS, React, or Next.js? (D-002)
2. What pages will the site have, i.e. what does the navbar link to? (D-003)
3. What is "Cobban" — brand, theme, collection, or person? (D-004)
4. Is there a design to match, or is the visual design originated here? (D-005)

## When picking work up again

1. Read this file, then `STATUS.md` for state and `DECISIONS.md` for open
   choices.
2. If D-002 and D-003 are still open, they are the work — the navbar cannot
   be built before them.
3. Once they are answered: scaffold the stack, build the navbar, then update
   `STATUS.md` and `PROGRESS.md` in the same commit.
