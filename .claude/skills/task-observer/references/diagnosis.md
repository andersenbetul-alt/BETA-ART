# Diagnosing stalled vs slow vs dead

"Alive" and "healthy" are different claims. A hung process passes every liveness
check while accomplishing nothing, which is why stalls survive so long unnoticed.

## The general method

1. **Find the cadence.** How often does this work normally produce output? A test
   suite emits per-test lines; a compiler emits per-file lines; a deploy emits per
   step. Silence is only meaningful relative to a known rhythm.
2. **Measure the silence.** Compare the last output timestamp to now. Silence
   several times longer than the normal gap is the signal.
3. **Check for advancement, not existence.** A growing log, a rising byte count, a
   changing step number. A process that exists but has not advanced in ten minutes
   is stalled regardless of how alive it looks.
4. **Look for the classic blockers.** Waiting on stdin that will never come, a
   held database lock, an interactive prompt, an exhausted connection pool, a
   filled disk. These produce perfect silence and infinite patience.

## What to gather per work type

**Builds and compiles** — last log line and its timestamp; whether the output
artifact is growing; whether a dependency fetch is hanging on the network. Build
tools often stall on a lock held by an earlier crashed run.

**Test suites** — which test was last started. A suite that printed a test name
and nothing since is hung *inside that test*, which names the culprit immediately.
Look for tests that wait on a real network call or a fixed sleep.

**Servers** — is it actually listening, not merely running. A process can be up
while the port never binds. Connect to the port rather than trusting the process
table.

**Deploys** — the platform's own status is more authoritative than local output.
A local command that "finished" may have only enqueued the work.

**Agents and subagents** — check for produced output, not elapsed time. An agent
that has written nothing is meaningfully different from one steadily writing.

## Confirming death

Dead means gone without a result: process absent, container reclaimed, session
ended. Confirm it rather than inferring it — then report when it was last alive
and what, if anything, it produced before disappearing. Partial output is often
the most valuable thing left behind, and it is easy to lose by cleaning up too
eagerly.

## Reporting the diagnosis

State the evidence, not just the verdict. "No output for 14 minutes; last line
was `Running migration 0007`; the process is alive and holding a lock on
`schema_migrations`" tells the user what to do next. "It seems stuck" does not.

When you genuinely cannot tell, say which state you have ruled out and what
would resolve it. Narrowing the possibilities is real progress; a confident
guess is not.
