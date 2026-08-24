---
name: task-observer
description: >
  Beta Art's observation loop. Invoke at the start of any session that will use
  tools and produce deliverables, and whenever a mistake, a near-miss, a user
  correction, or a piece of friction shows up during real work. Captures what
  went wrong so it can become a gate rather than being learned again. Also
  triggers when the user mentions observations, the observation log, gates,
  "what should have been a gate", or asks why a check exists.
---

# Task Observer — Beta Art

The general method is Eoghan Henn's *Task Observer / "One Skill to Rule Them
All"* (CC BY 4.0, [rebelytics.com](https://rebelytics.com), canonical source
[github.com/rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all)).
This file is the Beta Art adaptation of it, and it differs on one point that
changes everything downstream.

**Upstream, an observation becomes a skill. Here, an observation becomes a
gate.** A skill can be forgotten, skipped, or not loaded. A gate breaks the
build. Every one of the fourteen gates in `tools/` exists because something
went wrong once and nobody wanted it to go wrong silently a second time.

## Where things live

| | |
|---|---|
| The log | `skill-observations/log.md` — in the repository, committed |
| The gates | `tools/*.py` and `tools/render-check.js` |
| The runner | `python3 tools/check.py` |

The log is in the repo on purpose. A session container here is ephemeral: an
observation that is not committed does not survive the session, which is the
same reason the generators live in this repository rather than in a temporary
directory.

## When to write an observation

Write one when any of these happens, at the moment it happens:

- A gate caught something you did not expect it to catch.
- Something broke that **no** gate covered.
- The user corrected you, or repeated a request — a repeat almost always means
  you stopped short of finishing.
- You reached for a workaround instead of a fix.
- A measurement surprised you, or turned out to be measuring the wrong thing.
- You nearly did something destructive and caught it.

Do **not** write one for: a typo you fixed in the same breath, a preference the
user stated once, or anything you cannot state as a rule that would have
prevented the problem.

## The format

Follow the entries already in `skill-observations/log.md`. Each has:

    ### Observation N: One sentence naming the shape, not the incident

    **Status:** OPEN | ACTIONED (date) — became `tools/x.py`, which fails on …
    **Date:**
    **Session context:** what was being done when it surfaced
    **Skill:** which workflow this belongs to
    **Type:** internal | user-facing
    **Phase/Area:**

    **Issue:** what happened, concretely, with the numbers.
    **Suggested improvement:** the rule that would have prevented it.
    **Principle:** the general form, stated so it transfers.

Two rules about the writing:

1. **Name the shape, not the incident.** "A class name travels between
   properties; the rule behind it does not" transfers. "The Norwegian page had
   no CSS" does not.
2. **Keep the numbers.** 500 stale URLs, 83 render findings, 18.2% coverage at
   32px. An observation without measurements becomes folklore within a month.

## Promotion — the part that matters

Not every observation becomes a gate, and pretending otherwise fills `tools/`
with noise. Load `references/promoting-to-a-gate.md` before writing one: it
covers which observations qualify, how to verify a gate on **both** halves
(what it fails and what it lets through), and how to wire it into `check.py`,
`CLAUDE.md` and `tools/generators/README.md`.

The short version:

| Observation is… | Then |
|---|---|
| Mechanically checkable | Write the gate. Verify by reintroducing the bug. |
| A real design tension with no right answer | Leave OPEN. Say why it cannot be a gate. |
| Blocked on a person — a lawyer, a photograph, a registration | Leave OPEN. It belongs in `launch.py`, not `check.py`. |

`references/the-gates.md` lists every current gate and the mistake it came
from. Read it before adding one — the check you want may already exist inside
another gate.

## At the start of a session

1. Read `skill-observations/log.md`.
2. Apply the OPEN observations to what you are about to do. Four of the eleven
   are open, and two of them — media-query specificity and instruments that
   measure the wrong representation — have each bitten more than once.
3. Do the work.
4. Write down what you learned, in the same session. Do not defer it: the log
   stopped at commit `0c68b36` once and seven commits went by unrecorded, which
   is the exact failure this loop exists to prevent.

## What this is not

It is not documentation of what was built — `docs/` does that. It is not a
changelog — git does that. It is the place a mistake waits between being made
and becoming a gate.
