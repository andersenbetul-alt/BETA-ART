---
name: task-observer
description: >-
  Notice when your own work repeats — the same command sequence run again, the
  same correction from the user twice, the same thing re-derived from scratch —
  record it as an observation, and once reviewed, promote it into a new skill or
  a change to an existing one. Use this after finishing any multi-step task,
  whenever the user corrects you the same way more than once, whenever you catch
  yourself redoing a workflow you have already done in this project, and whenever
  asked to review observations or turn recurring work into a skill.
---

# Task Observer

Work teaches you things and then you forget them. You figure out that this repo's
tests need a service running first, that this user always wants the migration
before the model change, that the deploy silently needs a flag — and then the
session ends and the next one relearns it from scratch.

This skill closes that loop:

```
normal work → observe repetition → record observation → user reviews → skill
```

The value is entirely in the last two steps. Observations nobody reviews are
noise, and observations that never become skills are a diary. The point is to
turn what you learned into something that changes future behavior.

## What is worth observing

The signal is **repetition**, not novelty. A thing done once is just work. The
same thing done a third time is a pattern with a cost attached.

Worth recording:

- **A command sequence you have now run more than twice** — especially one with
  non-obvious ordering or flags that had to be discovered.
- **The same correction from the user twice.** This is the highest-value signal
  available, because it is direct evidence of a gap between what you do by
  default and what this person actually wants.
- **Knowledge you re-derived.** If you had to re-read the same three files, or
  re-discover the same constraint, that rediscovery cost is going to repeat.
- **A workaround that keeps being necessary** — a flag that must always be
  passed, a step that always fails first and must be retried a particular way.
- **A premise that turned out false more than once**, and how you checked it.

Not worth recording: one-offs, anything specific to a single file that will not
recur, and general knowledge that is not particular to this project or person.
The test is simple — would knowing this in advance have changed what you did?

Resist the urge to record everything. An observation log padded with trivia is
one nobody reads, which defeats the whole mechanism.

## Recording an observation

Write observations to `.claude/observations/` as dated Markdown files, one per
pattern. Keep them short — an observation is a pointer to evidence, not an essay.

See `references/observations.md` for the record format and worked examples.

The one rule that matters: **cite the actual occurrences**. An observation that
says "the user prefers X" without pointing at the two times they said so is an
assumption wearing evidence's clothing. Anyone reviewing it later — including you
— needs to be able to check whether the pattern is real. Vague observations
produce bad skills, and a bad skill is worse than no skill because it fires
confidently on the wrong occasions.

If you noticed something only once but suspect it will recur, record it and say
so plainly. A observation marked "seen once, watching for more" is honest and
still useful. One that inflates a single event into a settled pattern is not.

## The review gate

Surface observations to the user before promoting any of them. Never create or
modify a skill from an observation on your own initiative.

This gate exists because you are a poor judge of which of your own patterns are
worth entrenching. You see the repetition; the user knows whether it was
incidental or fundamental, whether the workaround is permanent or a bug about to
be fixed, and whether the "preference" you detected was really just two
coincidences. Entrenching a wrong pattern into a skill means every future session
inherits your mistake, and it will be applied confidently.

Present observations compactly: what recurred, how many times, the evidence, and
what a skill would change. Let the user pick which to promote.

## Update existing, or create new

Once the user approves an observation, the default is to **update an existing
skill rather than create a new one**. Check what already exists first.

A separate skill is justified when the pattern has its own trigger — a distinct
situation where it should fire, that no current skill's description covers. If it
fires in the same situations as an existing skill, it belongs inside that skill,
because two skills competing for the same trigger means neither fires reliably.

`references/promotion.md` covers how to decide, and how to hand off to the
`skill-creator` skill, which owns the actual authoring and testing loop. Do not
reimplement that here — this skill's job ends at a reviewed, approved observation
with a clear recommendation.

## Keeping the log honest

Prune observations once promoted — mark them resolved with a pointer to the skill
they became, so the log stays a queue of open patterns rather than an archive.

When an observation turns out to be wrong, delete it and say so. Leaving refuted
patterns in place means they eventually get promoted by someone who did not see
them refuted.

## Reference files

- `references/observations.md` — the observation record format, what qualifies
  as evidence, and worked examples of good and bad observations.
- `references/promotion.md` — deciding between updating an existing skill and
  creating a new one, and handing off to `skill-creator`.
