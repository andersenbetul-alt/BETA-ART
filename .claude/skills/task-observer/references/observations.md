# Observation records

## Format

One file per pattern, at `.claude/observations/YYYY-MM-DD-short-slug.md`:

```markdown
---
status: open          # open | promoted | refuted
occurrences: 3
first_seen: 2026-08-24
---

# Short statement of the pattern

**What recurred:** one or two sentences, concrete.

**Evidence:**
- 2026-08-24 — what happened, where (file, command, or quoted user message)
- 2026-08-24 — second occurrence
- 2026-08-25 — third occurrence

**Cost:** what it wastes each time it recurs — a wrong first attempt, ten
minutes of rediscovery, a correction from the user.

**Proposed change:** what a skill would do differently, in one sentence.
```

Keep `occurrences` honest — it is the field a reviewer scans first, and inflating
it is the fastest way to make the whole log untrustworthy.

## What counts as evidence

Evidence is something a reviewer could go and check: a command that was run, a
file that was read, a message the user actually sent. Quote or cite it.

These are not evidence:

- "The user seems to prefer…" with nothing attached
- "It's generally better to…" — that is a belief about the world, not an
  observation about this project
- A single occurrence described in the plural

## Worked examples

### Good

```markdown
---
status: open
occurrences: 3
first_seen: 2026-08-24
---

# Test runs need the local Postgres container started first

**What recurred:** `npm test` fails on connection refused unless
`docker compose up -d db` has been run and the container is healthy.

**Evidence:**
- 2026-08-24 — first `npm test` failed with ECONNREFUSED 5432; fixed by starting db
- 2026-08-24 — same failure after a `docker compose down`
- 2026-08-25 — same failure in a fresh clone before any setup

**Cost:** one failed test run and ~2 minutes of misdiagnosis each time; the
error points at the test, not the missing container.

**Proposed change:** check container health before running tests, and start it
if absent.
```

Specific, checkable, and the proposed change is a concrete behavior.

### Bad

```markdown
# User likes clean code

**What recurred:** The user cares about code quality.

**Evidence:** They asked me to refactor something.
```

Every problem at once: one occurrence stated as a pattern, no citation, and a
"proposed change" so vague it could justify almost any future behavior. A skill
built on this fires everywhere and helps nowhere.

### Honest single-occurrence

```markdown
---
status: open
occurrences: 1
first_seen: 2026-08-24
---

# Possible: user wants migrations before model changes

**What recurred:** User asked for the schema migration before the API layer,
explicitly ("do the SQL first").

**Evidence:**
- 2026-08-24 — "same Supabase Postgres" decision, migration written first

**Cost:** unknown — one occurrence. Watching for a second.

**Proposed change:** none yet; do not promote until seen again.
```

Recording a hunch is fine as long as it is labeled as one. This is how a real
pattern gets caught early without inventing it.
