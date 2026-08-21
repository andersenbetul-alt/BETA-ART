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

## Session start

At the start of any task-oriented session — any interaction where you will use
tools and produce deliverables — invoke the `task-observer` skill before
beginning work, so skill-improvement opportunities are captured throughout.

When loading any skill, check the observation log for OPEN observations tagged
to that skill and apply their insights to the current work, even if the skill
file has not been updated yet.

Note for this repository: observations are written to `skill-observations/`.
In an ephemeral container that directory does not survive the session, so the
log is only durable when this repo is checked out somewhere persistent.

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

---

# Working guidelines

Behavioural guidelines to reduce common LLM coding mistakes, from
[forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills).
They govern *how* to work; the sections above govern *what is true* about this
project. Where they conflict, the project facts above win.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
