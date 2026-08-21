# BETA-ART — Decision Log

Record of decisions made about the project, and the decisions still open.
Each entry states the decision, why it was made, and what it rules out.
See [STATUS.md](STATUS.md) for current state and [PROGRESS.md](PROGRESS.md)
for the work log.

---

## Decisions made

### D-001 — Track status in the repository, not elsewhere
**Date:** 2026-08-20 · **Status:** Accepted

Project state is recorded in `STATUS.md`, `PROGRESS.md`, and this file, kept
in the repo alongside the code.

*Why:* the repo is the one place every contributor already has. Status kept
in chat or a separate tool drifts out of date and is invisible to anyone who
clones the project.

*Consequence:* these files must be updated in the same commit as the work
they describe, or they become worse than nothing.

---

## Decisions still open

These block the navbar. Nothing can be implemented until the first two are
answered.

### D-002 — Technology stack
**Status:** Open · **Blocks:** all navbar work

Options:

| Option | Fits when | Cost |
| ------ | --------- | ---- |
| Static HTML + CSS | Site is a handful of pages, content changes rarely | Lowest; no build step, no dependencies |
| React (Vite) | Site has interactive views, shared state | Build tooling, dependency upkeep |
| Next.js | Needs routing, SEO, server rendering, or a CMS later | Highest; most capability |

*Recommendation:* static HTML + CSS unless the site needs interactivity
beyond a menu. An art site is usually pages and images, and the simplest
stack that works is the one most likely to still build in a year.

### D-003 — Site page list (the navbar links)
**Status:** Open · **Blocks:** navbar markup

The navbar cannot be written without knowing what it links to. A typical set
for an art site: Home, Work/Gallery, About, Contact. Needs confirming.

### D-004 — Meaning of "Cobban"
**Status:** Open · **Blocks:** naming, branding

"Cobban" appears only in the branch name, in no file. Unclear whether it is
a brand name, a theme variant, a collection, or a person. Affects what the
navbar displays as the site title.

### D-005 — Design reference
**Status:** Open · **Blocks:** navbar styling

Whether there is an existing mockup, Figma file, or reference site the navbar
should match, or whether the visual design is to be originated here.

---

## How to add an entry

Number sequentially (`D-006`, …). Give it a date, a status
(Open / Accepted / Superseded), the decision, the reasoning, and what it
rules out. Do not delete superseded entries — mark them superseded and link
to the one that replaced them, so the history of the reasoning survives.
