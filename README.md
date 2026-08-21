# BETA-ART

An art project site, currently in early setup. The active work item is the
site navigation bar (BETA ART / Cobban).

## Status

The repository is a scaffold — no application code exists yet, and the navbar
has not been started. It is blocked on two decisions: which technology stack
to use, and what pages the site will have (which determines the nav links).

- [STATUS.md](STATUS.md) — current state, what is blocked, open questions
- [PROGRESS.md](PROGRESS.md) — dated log of work that has landed
- [DECISIONS.md](DECISIONS.md) — decisions made, and the open ones that block work

## Repository layout

```
README.md     — this file
STATUS.md     — project and navbar status
PROGRESS.md   — dated work log
DECISIONS.md  — decisions made and still open
SECURITY.md   — security policy (placeholder, needs filling in)
```

No source directories, package manifest, CI workflows, or tests exist yet.

## Getting started

There is nothing to build or run at this point. The first step is answering
D-002 (stack) and D-003 (page list) in [DECISIONS.md](DECISIONS.md); the
navbar can be implemented immediately after.

## Contributing

Work happens on feature branches. The navbar work is on
`claude/navbar-beta-art-cobban-6t07ru`.

When work lands, update `PROGRESS.md` and `STATUS.md` in the same commit as
the change, so the records never drift from what is actually in the repo.
