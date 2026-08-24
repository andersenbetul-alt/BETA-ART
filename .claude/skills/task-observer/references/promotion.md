# Promoting an observation

## Update an existing skill, or create a new one?

The default is to update. New skills are not free: each one competes for
attention, and two skills whose descriptions cover the same situation make both
fire unreliably.

Work through it in this order:

1. **List what already exists.** Project skills in `.claude/skills/`, plus any
   personal and plugin skills available. Read the descriptions, not just names —
   the description is what determines triggering.
2. **Ask what situation the pattern fires in.** Not what it is about — when it
   should activate. "Running tests in this repo" is a situation; "code quality"
   is not.
3. **Compare against existing triggers.** If an existing skill already fires in
   that situation, the pattern belongs inside it. Adding it there means it
   arrives exactly when it is needed, with no new competition.
4. **Create new only for a genuinely distinct trigger** — a situation no current
   skill's description covers.

A useful check: write the one-line description the new skill would have. If it
overlaps meaningfully with a description that already exists, you have found an
edit, not a new skill.

## Scoping the change

Keep the change proportional to the evidence. Three occurrences of a specific
command ordering justify a specific instruction about that ordering — not a
general philosophy about build systems. Overreaching is how a narrow, verified
pattern turns into a broad, unverified rule that misfires.

Carry the *why* across. The observation recorded a cost; the skill should explain
that cost, so a future reader understands when the guidance applies and when it
does not. Instructions without reasons get followed rigidly in the cases where
they should have been set aside.

## Handing off

`skill-creator` owns authoring and testing. Invoke it with the approved
observation and the recommendation — update-vs-create, the proposed trigger, and
the evidence. Do not hand-roll a SKILL.md here: skill-creator carries the
frontmatter conventions, the description-triggering guidance, and the eval loop
that checks the skill actually fires when intended.

What to pass along:

- The observation file itself
- Whether this updates a specific existing skill, and which
- The situation it should trigger in, phrased as a user would phrase it
- The cost it avoids, so the reasoning survives into the skill text

## After promotion

Mark the observation `status: promoted` and point at what it became. This keeps
the log a queue of open patterns rather than an archive, and it lets a future
reviewer see which patterns already had their say.

If a promoted skill later turns out to misfire, come back and mark the
observation refuted too. The pattern that generated it was the actual mistake,
and leaving it looking successful invites the same mistake again.
