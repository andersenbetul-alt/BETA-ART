# OBS-004 — Proposed local tooling the execution context cannot host

**Status:** pending
**Occurrences:** 2
**First seen:** 2026-08-24

## Evidence
- Asked to set up Headroom as a compression proxy between Claude Code and the
  model. The mechanism is `ANTHROPIC_BASE_URL` pointing at a local process —
  but this session runs in a remote sandbox whose model calls are made outside
  the container, so the variable would have had no effect. The project's own
  README says to skip it where local processes can't run.
- Asked to run `npx claude-mem install`. It registers Claude Code plugin hooks
  and a background worker in `~/.claude-mem`. In an ephemeral container both
  are discarded when the container is reclaimed, and neither reaches the user's
  own machine.

## Pattern
Both requests assumed the tool would take effect where it was installed. The
question that decides it is not whether the install succeeds but whether the
process doing the work lives in the same place as the install — and in a remote
or ephemeral context it usually does not.

## Proposed change
Before installing or configuring local tooling, establish where the affected
process actually runs. If it is outside the current environment, say so and
give the steps for the machine that can host it, rather than running an install
whose effect will be discarded.

## Target
New skill, or a section in whatever covers working in remote and sandboxed
environments.
