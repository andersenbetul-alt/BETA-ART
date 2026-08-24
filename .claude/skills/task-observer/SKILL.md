---
name: task-observer
description: Watches ordinary work for patterns that repeat — the same command sequence, the same correction from the user, the same workaround for the same trap — and records them as reviewable observations that can later become a skill, a CLAUDE.md line, or a script. Use this skill whenever the user asks to observe, watch, or track their work; whenever they mention noticing repetition, "we keep doing this", "third time now", or wanting to capture a workflow; whenever they ask what patterns have been noticed or to review observations; and whenever finishing a multi-step task that involved a repeated ritual worth remembering. Also use it before creating or updating a skill, so the change is grounded in recorded evidence rather than a hunch.
---

# Task Observer

Most reusable knowledge is discovered by accident. You work through a task, hit
the same wall you hit last Tuesday, apply the same fix, and move on — and the
lesson evaporates. Task Observer is the habit of noticing that moment and
writing it down in a form someone can act on later.

The pipeline is deliberately slow at one point:

```
normal work → observe → record → HUMAN REVIEW → promote to a skill / rule / script
```

Nothing is promoted without the user seeing it first. An unreviewed observation
is a hypothesis, not a finding, and a repository full of confidently wrong
"lessons" is worse than one with none.

## What counts as an observation

An observation is a pattern you saw happen **more than once, with evidence you
can point at**. Two occurrences is the floor; three is where it starts being
worth someone's attention. The bar exists because the failure mode here is
pareidolia — inventing a trend out of a single event, then encoding it as law.

Patterns worth recording:

- **A command ritual.** The same three or four commands, in the same order,
  every time: build, then a specific flag, then a cleanup step.
- **A repeated correction.** The user has now told you twice to use their
  formatter, put temp files somewhere specific, or stop adding a footer.
- **A trap in the environment.** Something behaves in a way that surprises you
  reliably — a tool that silently truncates, a path that resets, a limit that
  is not documented where you looked.
- **A recurring bug shape.** The same class of defect appears across files:
  unawaited promises, missing RLS on new tables, off-by-one in the same helper.
- **A lookup you keep repeating.** You have now read the same three files to
  answer the same kind of question.

Not worth recording: something that happened once; a preference the user stated
plainly (that belongs in CLAUDE.md immediately, not in a review queue); or
anything you would be guessing at.

## Recording one

Use the bundled script rather than hand-editing the log — it assigns ids,
timestamps entries, and merges an observation you have already recorded instead
of creating a near-duplicate:

```bash
python3 .claude/skills/task-observer/scripts/observe.py add \
  --pattern "Bash working directory resets between calls" \
  --evidence "cd auth-app then npm run build failed; same in 3 later calls" \
  --cost "3 retries, ~2 min" \
  --proposal "CLAUDE.md line: always use absolute paths in Bash"
```

Recording the same pattern again bumps its occurrence count. That count is the
main signal at review time: a pattern seen six times has earned a change; one
seen twice usually has not yet.

Field guidance and worked examples are in
[references/observation-format.md](references/observation-format.md) — read it
before writing your first observation of a session, because a vague `pattern`
line is the difference between a useful ledger and a pile of noise.

## Reviewing with the user

When the user asks what has been noticed, or at the end of a long stretch of
work, show them the open observations:

```bash
python3 .claude/skills/task-observer/scripts/observe.py list --status open
```

Present them compactly — pattern, how many times, what it cost, what you would
do about it — and let the user decide each one. Do not decide for them, and do
not quietly drop the ones you find uninteresting: the user is the one who knows
which repetitions actually annoy them.

Then close the loop on each:

```bash
python3 .claude/skills/task-observer/scripts/observe.py resolve 3 \
  --as promoted --note "became .claude/skills/deploy-checks"
```

## Promoting an observation

Where a pattern should live depends on its shape, and picking wrong is the
usual reason these systems rot — a one-line preference buried in a skill nobody
loads, or a fifteen-step workflow crammed into a CLAUDE.md bullet.

| The pattern is… | It belongs in… |
| --- | --- |
| A standing preference or fact about the project | A line in `CLAUDE.md` |
| A deterministic sequence with no judgement in it | A script in `scripts/` |
| A workflow with decisions, applied in a recognisable situation | A skill |
| An extension of something a skill already covers | An edit to that skill |

The full decision guide, including how to tell a genuinely new skill from an
edit to an existing one, is in [references/promotion.md](references/promotion.md).
Read it before creating anything — the default should be editing an existing
skill, because a proliferation of narrow skills makes each one less likely to
trigger when it matters.

When the answer is a new skill or a skill edit, hand the observation's evidence
to the `skill-creator` skill rather than writing the skill freehand. The
evidence — the actual commands, the actual corrections — is what keeps the
resulting skill concrete.

## Staying honest

- **Never invent an occurrence to reach the threshold.** If a pattern has been
  seen twice, the record says twice.
- **Quote real evidence.** File paths, commands, the user's actual words. An
  observation that cannot name what happened is not an observation.
- **Record the cost.** "Three retries" or "twenty minutes" is what tells the
  user whether fixing it is worth their time. Without it, every observation
  looks equally urgent, which means none of them do.
- **Leave dismissed observations in the log.** A pattern the user rejected is
  useful information; deleting it means proposing the same thing again in a
  month.
