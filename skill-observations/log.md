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

---

### Observation 4: A validator executed what it should have parsed

**Status:** OPEN
**Date:** 2026-08-22
**Session context:** Extending the static-site build to validate browser ES
modules (`auth.js`, `auth-ui.js`).
**Skill:** `evidence-discipline` — candidate new section
**Type:** open-source
**Phase/Area:** Writing build-time validators

**Issue:** The build validated browser modules with `await import(file)`.
That *runs* them. In Node there is no `document`, so a perfectly valid
browser module failed with `document is not defined` — a false failure
reporting a real file as broken. Validation needs the syntax tree, not the
side effects; the fix was `node --check` against a temp `.mjs`.

**Suggested improvement:** When writing a validator, state which of these you
need — *parses*, *type-checks*, *runs without error*, *produces correct
output* — and pick the weakest one that answers the question. Executing to
prove parseability imports the whole runtime environment as a dependency of
your check.

**Principle:** Validation and execution are different operations. Reaching
for execution because it is the easier API couples the check to an
environment the code was never meant to run in, and produces failures that
describe the checker rather than the code.

---

### Observation 5: A rule-check matched its own documentation

**Status:** OPEN
**Date:** 2026-08-22
**Session context:** Adding a build rule that a `service_role` key must never
be served to a browser.
**Skill:** `evidence-discipline` — candidate new section
**Type:** open-source
**Phase/Area:** Static checks over source text

**Issue:** The check was `/service_role/.test(configCode)`. It fired on
`config.js` — not because the file contained a key, but because it contained
a comment *explaining that such a key must never be added*. The file
documenting the rule was flagged as violating it. Fixed by stripping comments
before matching.

**Suggested improvement:** Any textual rule-check needs a negative fixture:
text that legitimately *mentions* the forbidden thing without being it —
documentation, tests, changelogs. Run the check against that fixture and
confirm it stays silent, alongside confirming it fires on a real violation.

**Principle:** A check over source text must distinguish use from mention.
Without that, the files most likely to discuss a rule — docs, tests, the
rule's own definition — become its most likely false positives, and the usual
response is to weaken the rule rather than fix the matcher.

---

### Observation 6: A commit message ran as shell code

**Status:** OPEN
**Date:** 2026-08-22
**Session context:** Committing the Supabase client; the message quoted an
error containing backticks.
**Skill:** New skill candidate: shell-quoting-hazards
**Type:** open-source
**Phase/Area:** Composing shell commands with prose payloads

**Issue:** `git commit -m "...`document is not defined`..."` inside a
double-quoted string: bash performed command substitution on the backticks
and tried to run `document`. The command did not fail cleanly — it hung until
a two-minute timeout, and the commit silently did not happen. Discovered only
by checking `git log` afterwards.

**Suggested improvement:** Never interpolate prose into a shell command when
that prose may contain backticks, `$`, or `!`. Write the message to a file
and use `git commit -F`, or a quoted heredoc (`<<'EOF'`). Applies equally to
any long text passed through a shell: PR bodies, issue comments, release
notes.

**Principle:** Prose containing code is data, not command text. Passing it
through a shell makes the shell an interpreter of your content, and the
failure mode is a hang plus a silently skipped operation rather than a clear
error — so verify the operation actually happened, do not infer it from the
absence of a visible failure.

---

### Observation 7: "It does nothing" was my configuration, four times over

**Status:** OPEN
**Date:** 2026-08-22
**Session context:** Evaluating whether Headroom actually compresses context.
**Skill:** `evidence-discipline` — candidate new section
**Type:** open-source
**Phase/Area:** Evaluating an unfamiliar tool

**Issue:** Headroom reported 0 tokens saved across four successive attempts,
and I twice stated it "compresses nothing". Each zero had a different cause,
none of them the tool being broken: (1) context below the default
`model_limit`, so nothing needed compressing; (2) messages under the
`min_tokens_to_compress=250` floor; (3) `protect_analysis_context` shielding
every message; (4) a missing undocumented dependency (`fastembed`, which the
advertised `[ml]` extra does not install). With protections lowered it saved
19.5%. A confident negative verdict was one step away from being published
four separate times.

**Suggested improvement:** Before reporting that a tool does not work,
enumerate its defaults and confirm the input actually reaches the code path
under test — thresholds, floors, protections, optional dependencies. Prefer
the tool's own diagnostics (here `transforms_applied` said `router:protected`
and `router:noop`, naming the reason) over the headline number. A null result
is a claim about the tool *and* about the setup; only the second is usually
under test.

**Principle:** Absence of an effect is not evidence of absence of capability.
A negative finding needs the same standard of proof as a positive one — and
a tool's own trace output usually says which of the two you are looking at,
if the output is read rather than the summary figure.
