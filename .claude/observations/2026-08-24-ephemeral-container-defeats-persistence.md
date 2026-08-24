---
status: open
occurrences: 3
first_seen: 2026-08-24
---

# Tools whose whole value is persistence do not work in this container

**What recurred:** Several requests involved installing or relying on something
that stores state across sessions. This environment is reclaimed after the
session, so the install succeeds and the value does not survive.

**Evidence:**
- 2026-08-24 — `npx claude-mem install` succeeded; its store is ~/.claude-mem
  and "memory injection starts on your second session", which never comes here.
- 2026-08-24 — asked whether task-observer should go in ~/.claude/skills, which
  would vanish; the repo path persists because it is committed and pushed.
- 2026-08-24 — claude-mem placed in the proposed four-layer stack, same issue.

**Cost:** an install that looks successful but delivers nothing, and worse, a
belief that persistence is in place when it is not.

**Proposed change:** when a tool's value depends on outliving the session, say
so before installing, and route the durable version into the repo (committed) or
onto the user's local machine.
