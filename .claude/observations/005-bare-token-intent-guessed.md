# OBS-005 — Filled in intent for a bare token instead of asking

**Status:** pending
**Occurrences:** 2
**First seen:** 2026-08-24

## Evidence
- The user sent the single word `omniroute`. Coming straight after a domain
  availability exchange, it was read as a rename candidate for NAVIAR, and two
  registrar lookups plus a trademark-distinctiveness analysis were produced on
  that basis. It was actually a layer in an agent tooling stack — routing and
  fallback in front of Claude Code. The whole analysis was aimed at the wrong
  question.
- The user sent `.claude/skills/task-observer/`, then `SKILL.md`, then
  `references/`. Asked twice what the skill should do, got the structure
  repeated, and proceeded on the assumption that it was about task-list
  hygiene. It was a meta-learning loop: observe work, find repeated patterns,
  promote them into skills. The first draft had to be discarded and rewritten.

## Pattern
A bare token arriving mid-conversation gets its meaning from whatever was most
recently discussed, and recency is a weak prior. Both times the immediate
context supplied a plausible reading that turned out to be the wrong one, and
in both cases real work was produced before the error surfaced.

The two cases differ in damage, and the difference is instructive. The second
guess was labelled as an assumption in the reply, so the user corrected it in
one line. The first was not, so a full analysis stood unchallenged for several
turns.

## Proposed change
When input is a bare name, path, or fragment with no verb, treat the reading
supplied by recent context as one candidate rather than the answer. Cheap to
resolve: ask, or state the interpretation in one sentence before acting on it.
Where work proceeds on a guess, label the guess in the reply — that is what
lets a wrong reading be corrected in one line instead of several turns.

## Target
Whatever covers clarifying ambiguous requests; the specific case of bare tokens
is narrower than the general "ask when unclear" advice and worth naming.
