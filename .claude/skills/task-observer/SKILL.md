---
name: task-observer
description: >-
  Watch long-running background work — builds, test suites, deploys, background
  agents, migrations, CI runs — and report what actually happened to it. Use this
  whenever the user asks you to monitor, watch, babysit, keep an eye on, tail, or
  check back on something slow, and also whenever you kick off background work
  yourself and will need to know how it ended. Reach for it too when you are
  simply deciding *how to wait* for something, since the wrong waiting pattern
  burns turns and can miss the result entirely.
---

# Task Observer

Background work fails quietly. A build dies at minute nine, a test suite hangs on
a held lock, an agent finishes and nobody reads its output. The cost is rarely the
failure itself — it is the twenty minutes spent believing something is still
running when it stopped long ago, or reporting "still going" without having looked.

This skill is about watching well enough that the answer you give is always backed
by something you actually observed.

## The rule that matters most: do not sleep-poll

The instinct is to `sleep 30` in a loop until the thing finishes. Resist it. It
burns a turn per tick, produces no information between ticks, and blocks the user
from redirecting you while you sit there.

Prefer, in order:

1. **Let the harness wake you.** Work started with `run_in_background`, subagents,
   and workflows re-invoke you on completion. Nothing to poll — start it, do other
   useful work, and handle the notification when it lands.
2. **Wait on a condition, not a duration.** `Monitor` with an until-loop blocks on
   the thing you actually care about (a port opening, a file appearing, a log line)
   rather than on a guess about how long it takes.
3. **Schedule a long fallback.** For work the harness cannot see — a CI run, a
   remote deploy, an external queue — pick a delay matched to how fast that state
   really changes. A CI run that takes ~8 minutes deserves one ~8-minute check, not
   sixteen 30-second ones.

The exception that justifies a real poll is external state with no notification
path. Even then, size the interval to the work.

See `references/waiting.md` for the patterns per work type, including what to do
when a notification never arrives.

## Establish what you are watching

Before reporting anything, know the inventory. Vague monitoring produces vague
reports.

For each piece of background work, get concrete about: what was started, how it
was started (so you know whether a notification is coming), where its output goes,
and what "done" looks like. A build is done when it exits; a server is done when
it is listening; a migration is done when the schema matches.

If you cannot state the success condition, you cannot tell success from a hang —
work that out first, because everything downstream depends on it.

## Triage: four states, not two

The useful distinction is not "running vs finished". It is:

- **Finished** — exited. Read the exit code and the tail of the output. An exit
  code of 0 is not proof of success if the tool reports failures in its output.
- **Running healthily** — still producing output, or still legitimately blocked on
  something with a known finish (a large download, a long compile).
- **Stalled** — the process is alive but nothing is advancing. Output has been
  static well past its normal cadence, or it is blocked on input that will never
  come. This is the state people miss, because "alive" looks like "fine".
- **Dead** — gone without a result: the process vanished, the container was
  reclaimed, the connection dropped.

Distinguishing stalled from slow is the hard part, and it is where being wrong is
expensive. `references/diagnosis.md` covers the evidence to gather for each.

## Report state changes, not ticks

Every check does not deserve a message. Narrating "still running" on a loop trains
the user to ignore you, which is exactly the wrong reflex for the moment something
does break.

Say something when: the work finishes (with the outcome, not just "done"), it
fails (with the actual error, not "it errored"), it stalls, or your estimate of
how long it will take changes materially. Otherwise stay quiet and keep watching.

When work does finish, the useful report is short and specific: what ran, whether
it succeeded, and the one detail that matters — the failing test name, the error
line, the deploy URL. Paste the evidence rather than characterizing it.

## Never report a status you did not verify

This is the failure mode that makes an observer worse than useless. Under pressure
to answer, it is tempting to say "the build is still running" when you have not
checked since the last time you looked, or to infer completion from elapsed time.

Check before you speak. If you cannot check — the log is gone, the process is
unreachable, the notification never came — say exactly that. "I can't tell; the
worker isn't running and its log is empty" is a genuinely useful answer. A
confident guess that turns out wrong costs the user the debugging session they
would otherwise have started twenty minutes earlier.

The same applies when work you were watching disappears. Do not quietly drop it.
Report that it vanished and what you know about when it was last alive.

## Know when to stop watching

Stop when the work reaches a terminal state and you have reported it, when the
user says to stop, or when continuing cannot produce new information — a stalled
job with no output and no way to inspect it will not become clearer by looking
again. Say what you are stopping and why, so nobody is left assuming you are
still watching.

## Reference files

- `references/waiting.md` — how to wait for each kind of background work, and
  what to do when a completion signal never arrives.
- `references/diagnosis.md` — telling stalled from slow from dead, and the
  evidence worth gathering for builds, tests, servers, deploys, and agents.
