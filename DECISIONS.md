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

D-002 and D-003 were accepted on 2026-08-21 on the recommended defaults, after
the audit request was reaffirmed three times; they are kept here with their
reasoning. D-004 and D-005 remain open but do not block implementation.

### D-002 — Technology stack
**Date:** 2026-08-21 · **Status:** Accepted — static HTML + CSS

Options:

| Option | Fits when | Cost |
| ------ | --------- | ---- |
| Static HTML + CSS | Site is a handful of pages, content changes rarely | Lowest; no build step, no dependencies |
| React (Vite) | Site has interactive views, shared state | Build tooling, dependency upkeep |
| Next.js | Needs routing, SEO, server rendering, or a CMS later | Highest; most capability |

*Decided:* static HTML + CSS. An art site is pages and images; the simplest
stack that works is the one most likely to still build in a year. Rules out a
build step and a component framework until something actually needs one.

*Note:* the mobile menu needs a few lines of JavaScript — a toggle handler is
not a reason to adopt a framework.

### D-003 — Site page list (the navbar links)
**Date:** 2026-08-21 · **Status:** Accepted — Home, Work, About, Contact

*Decided:* Home, Work, About, Contact — the conventional set for an artist's
site. Adding a page later is a one-line change; nothing is ruled out.

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
