# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill
updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue —
resolved statuses always carry their resolution date

---

## 2026-08-22

### Observation 1: A passing test suite claimed coverage it did not have

**Status:** ACTIONED (2026-08-22) — folded into `evidence-discipline` §1
**Date:** 2026-08-22
**Session context:** Building and auditing a site navbar; later ran `/verify`
against the running page.
**Skill:** `evidence-discipline` (created 2026-08-22)
**Type:** open-source
**Phase/Area:** Test authoring — what an assertion actually proves

**Issue:** A test asserted that a skip link's *target element existed*
(`assert.ok(await page.$('#main'))`). It passed. Driving the real page showed
the skip link did not work at all: activating it left focus on `<body>`, so
the next Tab returned to the skip link. The element existed; the behaviour
never happened. The green suite was reported as evidence the feature worked.

**Suggested improvement:** When writing a test for a behaviour, name the
observable effect first, then assert on *that*, not on a precondition of it.
"Target exists" is a precondition; "focus moved to the target" is the
behaviour. A checklist question that would have caught it: *if I broke the
feature but left the markup intact, would this test still pass?*

**Principle:** An assertion on a precondition is not an assertion on the
behaviour. Tests that check structure while claiming to check behaviour
convert absence of coverage into false confidence, which is worse than no
test — a missing test is visibly missing.

---

### Observation 2: "Flake" was reached for twice before the real cause

**Status:** ACTIONED (2026-08-22) — folded into `evidence-discipline` §2
**Date:** 2026-08-22
**Session context:** An intermittent failure (~1 run in 8) in a hit-target
test measuring 44px touch targets.
**Skill:** `evidence-discipline` (created 2026-08-22)
**Type:** open-source
**Phase/Area:** Debugging non-deterministic test failures

**Issue:** Two plausible causes were diagnosed and "fixed" before the actual
one was found — first slow layout after navigation, then a click race. Both
changes were reasonable and both were kept, but neither was the cause, and
each was followed by clean runs that looked like confirmation. The real cause
appeared only after capturing the raw assertion text:
`got 43.999996185302734, need >= 44`. A CSS transform during the open
animation made the box measure in fractional device pixels; the test compared
floats exactly, mid-animation.

**Suggested improvement:** On an intermittent failure, capture the raw
failure output *before* forming a hypothesis. Loop the suite until it fails
and dump the assertion verbatim. Clean runs after a speculative fix are weak
evidence when the base rate is ~1 in 8 — six passes is an unremarkable
outcome for an unchanged bug.

**Principle:** With intermittent failures, the order is capture → hypothesise
→ fix, never hypothesise → fix → hope. Absence of the failure over a few runs
is not evidence of its cause being removed, and floating-point geometry
should be assumed wherever transforms or sub-pixel layout are involved.

---

### Observation 3: Security rules that restrict rows do not restrict columns

**Status:** ACTIONED (2026-08-22) — folded into `evidence-discipline` §3
**Date:** 2026-08-22
**Session context:** Writing Supabase/PostgreSQL row-level security policies
for a profiles table carrying a role column.
**Skill:** `evidence-discipline` (created 2026-08-22)
**Type:** open-source
**Phase/Area:** Authorization schema design

**Issue:** An `UPDATE` policy scoped to `id = auth.uid()` reads as "users may
edit their own profile". It also permits a user to set `role = 'owner'` on
that row — verified exploitable. The subsequent fix (a trigger blocking role
changes by non-owners) then created a bootstrap deadlock: no owner existed,
so no owner could be created. Both defects were found only because the
policies were exercised as an unprivileged role; testing as superuser would
have shown nothing, since superusers bypass RLS entirely.

**Suggested improvement:** For any table with a privilege-bearing column,
pair the row policy with column-level grants, and test three cases
explicitly: (a) legitimate self-edit succeeds, (b) privilege-column edit is
denied, (c) the first privileged principal can still be created. Always drive
authorization tests as the unprivileged role the application actually uses.

**Principle:** Row-level rules answer *which rows*, never *which columns* —
a privilege-bearing column needs its own control. And every guard against
privilege escalation must be checked for the bootstrap case it may forbid.
