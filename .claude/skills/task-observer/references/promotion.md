# Promoting an observation

An observation earns a change when it is **recognisable** (you can tell when you
are in it), **recurring** (three or more occurrences, or two expensive ones), and
**actionable** (there is a specific thing to do differently). Missing any of the
three, leave it open and let it accumulate evidence.

## Choosing the destination

### A line in CLAUDE.md

For standing facts and preferences — things that are true regardless of what you
are doing. They cost nothing to carry because they are always in context.

> Use absolute paths in Bash; the working directory is not preserved between calls.

Keep it to one or two lines. If it needs a procedure, it is not a CLAUDE.md line.

### A script

For sequences with no judgement in them. If you can write down the exact steps
and they never branch on anything a human would have to weigh, a script is
better than instructions: it cannot be misremembered, and it runs in one call
instead of five.

Signal: across several sessions, the same helper keeps getting rewritten from
scratch.

### An edit to an existing skill

**This is the default, and the option most often skipped.** Before creating
anything new, list what already exists and ask whether the observation is really
a new subject or just a case the current skill did not cover.

Signal: the pattern happens inside a situation an existing skill already claims.
A deploy quirk belongs in the deploy skill, not in `deploy-quirks`.

Splitting a subject across two skills makes both weaker — each one's description
now covers less ground, so each is less likely to trigger when it is needed.

### A new skill

For a workflow with real decisions in it, applied in a situation you can
describe in a sentence. A new skill needs to answer three questions cleanly:

1. **When does it trigger?** If you cannot state the situation crisply, the
   description will be vague and the skill will sit unused.
2. **What does it decide?** If there are no decisions, write a script.
3. **Does it overlap an existing skill?** If yes, edit that one instead.

Use the `skill-creator` skill to write it, and pass along the observation's
evidence — the real commands and corrections. Skills written from remembered
generalities come out abstract; skills written from transcripts come out
usable.

## When not to promote

- **Once is not a pattern.** Leave it open. It will either recur or it will not.
- **The cost is smaller than the fix.** A quirk that costs ten seconds does not
  need tooling built around it.
- **It is about a specific file that is about to change.** Encoding today's
  layout as a rule guarantees a stale rule.
- **The user dismissed it.** Record the dismissal with a reason and stop
  proposing it.

## After promoting

Resolve the observation with a note naming where it went:

```bash
python3 .claude/skills/task-observer/scripts/observe.py resolve 4 \
  --as promoted --note "scripts/svg-to-png.sh"
```

The note is what stops the same pattern from being rediscovered and re-proposed
later, and it gives the next reviewer a trail from the annoyance to the fix.
