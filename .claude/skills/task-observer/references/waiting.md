# Waiting patterns by work type

The goal is always the same: spend as few turns as possible while still learning
the outcome the moment it exists.

## Work the harness tracks

Background commands, subagents, and workflows notify you when they finish. There
is nothing to poll. Start the work, go do something else useful, and handle the
completion when it arrives.

The mistake here is scheduling a short wakeup "just to check" — the notification
is already coming, so the extra wakeup is pure waste. The only wakeup worth
scheduling is a long fallback (20+ minutes) that catches the case where the work
hangs forever and the notification never fires.

## Work gated on a condition

When you need something to become true — a port accepting connections, a file
appearing, a log line showing up, a lock releasing — wait on that condition
directly with an until-loop rather than guessing a duration.

This matters because durations are always wrong in one of two expensive
directions: too short and you check repeatedly for nothing, too long and the
result sits unread. A condition is right by construction.

## External work with no notification path

CI runs, remote deploys, third-party queues, and anything behind an API you can
only query. Here a real poll is justified, but size the interval to how fast the
state actually changes:

| Work | Reasonable first check |
|---|---|
| CI run, typical suite | ~5–10 min |
| Container/image build | ~3–5 min |
| Deploy to staging | ~2–5 min |
| DNS / cert propagation | ~10–15 min |
| Long data migration | scale to rows; check progress markers, not the clock |

Prefer one well-timed check over many premature ones. If the work exposes a
progress signal — a percentage, a step counter, rows processed — read that
instead of waiting blind, because it converts a guess into a measurement.

## When the completion signal never arrives

Notifications get lost, containers get reclaimed, connections drop. Before
concluding a job is still running, look for independent evidence that it exists:
the process, its output file's modification time, a lock, a partial artifact.

Absence of a completion signal is not evidence of progress. It is equally
consistent with the work having died silently — and that ambiguity is exactly
what you should report if you cannot resolve it.
