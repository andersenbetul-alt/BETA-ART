# Promoting an observation into a skill

The review has approved the observation. Now it has to land somewhere it will
actually be read.

## Update an existing skill, or create a new one?

Start by looking for a skill whose scope already contains this. The bar for
"already contains" is whether a person looking for this advice would think to
open that skill — not whether the topics are adjacent.

**Extend an existing skill when** the observation is a refinement, an extra
case, or a sharper explanation of something the skill already addresses. A
well-placed paragraph in a skill people already trigger beats a new file
nobody finds.

**Create a new skill when** the observation is coherent on its own, has enough
substance to justify a description and a body, and doesn't fit any existing
scope without stretching that scope past what its description claims.

**Do neither when** the lesson is specific to one project. Build commands,
service names, directory conventions and local quirks belong in that repo's
`CLAUDE.md` or README. A skill applies everywhere it triggers, so putting
project facts in one means carrying them into projects where they're wrong.

## The overlap trap

Two skills covering the same ground is worse than either alone. They compete
for triggering, each one fires on some queries and not others, and neither
accumulates the improvements — so both stay mediocre. When a new observation
sits near an existing skill's edge, extending is almost always the better
trade, even if the fit isn't perfect.

If you genuinely have two skills that overlap, the fix is to merge them and
rewrite the descriptions so the boundary is clear, not to add a third.

## Waiting is allowed

An approved observation with nowhere good to go can sit. Several small related
observations often add up to one coherent skill later, and a skill built from
three real patterns is much better than three skills built from one each.

Hold them in `.claude/observations/` with status `approved`, and revisit when
the cluster is big enough to have a shape.

## Writing the change

Whether extending or creating, the same things make it land:

- **Explain why, not just what.** A rule with its reasoning attached survives
  contact with situations its author didn't foresee. A bare imperative doesn't,
  and gets followed in cases where it shouldn't be.
- **Keep the evidence's specificity, drop its particulars.** The proposed change
  should be general enough to apply again, concrete enough to act on. "Use
  absolute paths in shell commands" travels; "watch out for the naviar-app
  directory" does not.
- **Match the surrounding voice.** An extension that reads as a foreign
  paragraph gets skimmed past.

## After promotion

Mark the observation `promoted` and record where it went. This is what stops
the loop eating its own tail — without it, the same pattern gets observed again
next month, written up again, and promoted into a second skill that duplicates
the first.

## When a skill turns out to be wrong

Skills that are never corrected drift into folklore: advice that was right for
one environment, repeated long after it stopped applying. If following a skill
produces a bad outcome, that is itself an observation — record it with the same
evidence standard, and let the review decide whether the skill needs narrowing,
correcting, or retiring.
