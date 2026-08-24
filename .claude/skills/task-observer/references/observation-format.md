# Observation format

One file per observation, in `.claude/observations/`, named
`NNN-short-slug.md`. Keep them short — an observation that needs three pages
isn't an observation, it's a draft skill.

```markdown
# OBS-007 — Short statement of the pattern

**Status:** pending | approved | promoted | rejected
**Occurrences:** 2
**First seen:** 2026-08-24

## Evidence
- Concrete occurrence, with the command / file / message that makes it checkable
- Second occurrence, ditto

## Pattern
One or two sentences generalising the occurrences. What is the shared cause?

## Proposed change
What should be done differently next time. Specific enough to act on.

## Target
Existing skill to extend, or a new skill, or "project docs" if it isn't general.
```

The fields that carry weight are **Evidence** and **Occurrences**. A reviewer
reads those first to decide whether the rest is worth their attention.

---

## Worked example — a good one

```markdown
# OBS-003 — Shell commands silently run against the wrong directory

**Status:** pending
**Occurrences:** 2
**First seen:** 2026-08-24

## Evidence
- `cd naviar-app && cat > supabase/...sql` failed: cwd was already inside
  naviar-app. The chained writes after it ran anyway, in an unintended
  directory, and the terminal still printed the closing "ok" so it looked
  like success.
- `npx tsc --noEmit` printed the compiler's help text instead of typechecking.
  cwd had no tsconfig.json, so npx downloaded an unrelated tsc and ran it with
  no project.

## Pattern
Shell cwd does not persist between tool calls. Any relative path resolves
against whatever cwd happens to be, and a failed `cd` at the head of a chain
does not stop the commands after it.

## Proposed change
Use absolute paths in shell commands. When a command genuinely depends on cwd,
set it inside that same command and check the result rather than assuming it
carried over. Read the whole output, not the last line — a success message can
belong to a different command than the one that mattered.

## Target
New skill `shell-hygiene`, or a section in an existing bash-practices skill.
```

Why this one works: both occurrences are specific enough that someone else
could confirm them, the generalisation is narrower than "be careful with
paths", and the proposed change is something you could actually follow.

---

## Worked example — an observation about your own claims

```markdown
# OBS-004 — Numbers asserted from arithmetic instead of measured

**Status:** approved
**Occurrences:** 2
**First seen:** 2026-08-23

## Evidence
- Reported a logo's gold accent as 14.1% of the mark. That came from a formula
  whose denominator undercounted where two shapes overlap. Rendering the file
  and counting pixels gave a different number.
- The first correction was also wrong (17.05%): that render was clipped, and
  the clipped region contained only one of the two colours, skewing the ratio.
  Only the third measurement, on an unclipped canvas, was right.

## Pattern
Two distinct failures, one root: a quantity was reported without being
observed. The second occurrence adds that a measurement is itself an
instrument that can be wrong, and a surprising result is as likely to indict
the instrument as the thing measured.

## Proposed change
Before publishing a number that describes an artifact, measure it against the
artifact. When a measurement contradicts expectation, check the measurement's
preconditions — was the capture complete, did the flag take effect — before
acting on it.

## Target
Extend the existing verification skill; this is the same discipline applied to
quantities rather than behaviour.
```

---

## Counter-example — not an observation yet

```markdown
# Verify your work before reporting it
```

No evidence, no occurrences, nothing specific enough to act on. It's true, it's
free to write, and it changes nothing. If a real instance shows up twice, write
*that* instead — the specific shape is what makes it useful.

The same goes for anything phrased as general wisdom: "read the docs first",
"think about edge cases", "communicate clearly". If you find yourself writing
one of these, look for the concrete moment that prompted it and record that.
