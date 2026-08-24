---
status: open
occurrences: 1
first_seen: 2026-08-24
---

# Possible: a git push 403 here is not reliably a permissions verdict

**What recurred:** A push returned 403 while fetch succeeded. I concluded
read-only access and advised changing GitHub settings. The identical push later
succeeded with no action taken by the user.

**Evidence:**
- 2026-08-24 — push 403 twice, fetch authenticated fine, `--dry-run` also 403;
  same command succeeded later unchanged.

**Cost:** one incorrect diagnosis, and advice to change account settings that
did not need changing.

**Proposed change:** none yet — one occurrence, and the cause is unresolved
(grant landing vs transient proxy). Watching for a second before drawing a rule.
