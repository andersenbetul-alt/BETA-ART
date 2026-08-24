---
name: task-observer
description: Turns ordinary working sessions into durable skills by noticing patterns that repeat, recording them as reviewable observations, and — once a human approves — folding them into an existing skill or a new one. Use this whenever you catch yourself repeating a correction, a workaround, a lookup, or the same mistake twice; whenever a session ends and something was learned that would help the next one; whenever the user says "remember this", "you keep doing that", or "write this down"; and whenever reviewing pending observations to decide what should become a skill. Also use it when deciding whether a lesson belongs in a skill at all rather than in project docs.
---

# Task Observer

Most of what a session teaches is thrown away. The same workaround gets
rediscovered, the same correction gets issued, the same dead end gets walked
into. This skill is the loop that stops that:

```
normal work  →  notice repetition  →  write an observation
                                            ↓
                          human reviews and decides
                                            ↓
                   update an existing skill  or  create a new one
```

The two things that make it work are **repetition as the trigger** and **a human
gate before promotion**. Skip the first and you drown in notes; skip the second
and you accumulate cargo cult.

## Watching without getting in the way

Observation is a side effect of doing the work, not a parallel activity. Don't
narrate it, don't pause mid-task to write notes, and don't let it slow the thing
you were actually asked to do.

Record at natural boundaries — when a task closes, when a session wraps, when
the user corrects you. Those are the moments when you can see the shape of what
just happened.

## What counts as a pattern

**Repetition is the signal.** One occurrence is an incident. Two or three of the
same shape is a pattern worth writing down. This threshold matters more than it
sounds: recording every one-off floods the review queue, and a queue that's
mostly noise trains the reviewer to skim — which is how the genuinely important
observation gets waved through.

Worth recording:

- **A correction you received more than once.** The user telling you the same
  thing twice is the strongest possible signal, because they paid a cost to say
  it both times.
- **A workaround you rediscovered.** If you solved the same environment quirk
  twice without remembering the first time, the next session will too.
- **A mistake with a shared root cause.** Two different-looking failures that
  trace to one wrong assumption are one pattern, not two.
- **A verification that kept paying off.** If checking something cheap caught
  real problems repeatedly, that's a habit worth encoding.

Not worth recording:

- Facts about *this* project — build commands, directory layout, service names.
  Those belong in the repo's own docs (`CLAUDE.md`, a README), where they're
  scoped to the project. A skill applies everywhere, so project trivia in a
  skill is actively harmful.
- Preferences the user already stated plainly. If they said it once and you
  followed it, the system worked; no observation needed.
- Anything you can't cite evidence for. See below — this is the failure mode
  that matters most.

## Observations must cite evidence

An observation records **what actually happened**, not what you have a general
feeling about. Every one names the concrete occurrences behind it: the command
that failed, the file, the correction the user gave, the number that turned out
wrong.

This constraint is the whole defense against the obvious failure mode — writing
plausible-sounding advice that no experience actually produced. Generic wisdom
("verify your work", "read the docs") is free to generate, impossible to
falsify, and useless as a skill. If you can't point at two specific moments,
you don't have an observation yet; you have a hunch. Keep working and see if it
recurs.

Format and worked examples: `references/observation-format.md`.

## Where observations live

Write them to `.claude/observations/` in the repo, one file per observation, so
they survive the session and can be reviewed in a batch. Keep the status field
current — a queue where everything says "pending" forever is a queue nobody
trusts.

## The review gate

Observations are proposals. They do not change behaviour until a human approves
them. Present them for review rather than acting on them, and present them
honestly: what was seen, how many times, what change is proposed, and what the
change would cost.

When surfacing a batch, lead with the ones backed by the most occurrences and
say plainly which are speculative. A reviewer who finds one weak item in a batch
discounts the whole batch.

## Promotion: update or create

Once approved, the observation becomes part of a skill. The decision is usually
easy:

- **An existing skill already covers this area** → add it there. A skill that
  grows a well-placed paragraph is better than a new near-duplicate skill,
  because overlapping skills compete for triggering and neither wins cleanly.
- **Nothing covers it, and it's coherent on its own** → new skill.
- **It's a single sentence with nowhere to go** → probably not a skill. Consider
  whether it belongs in project docs instead, or whether to hold it until
  related observations accumulate.

The judgement calls — how much overlap is too much, when several small
observations should be merged into one skill — are in
`references/promotion.md`.

After promotion, mark the observation promoted and note where it landed. That
record is what stops the same lesson being relearned and rewritten later.

## Closing the loop

The point of all this is that the next session starts further along than this
one did. Two habits keep that true: when a skill exists for the area you're
working in, actually consult it; and when it turns out to be wrong, that's an
observation too — skills that are never corrected drift into folklore.
