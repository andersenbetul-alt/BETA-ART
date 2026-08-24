---
status: open
occurrences: 6
first_seen: 2026-08-24
---

# Check whether a request's premise holds before executing it

**What recurred:** Requests arrived assuming a thing existed or a capability was
available. Checking first changed the answer materially every time — usually
finding a better path, twice preventing fabrication.

**Evidence:**
- 2026-08-24 — "recheck every site weekly until I'm gone": researched instead
  and found California's DROP re-runs every 45 days by statute, which is
  stronger than any resubmission loop I could run.
- 2026-08-24 — "retrieve context from previous sessions": checked two
  independent stores; exactly one session exists and it is the current one.
- 2026-08-24 — ".claude/skills/task-observer/": filesystem-wide grep plus the
  skills registry; existed nowhere.
- 2026-08-24 — `npx claude-mem install`: its own output says state lives in
  ~/.claude-mem "on this machine", which is ephemeral here.
- 2026-08-24 — Headroom for Claude Code: its limitations doc says source code
  passes through, so the headline 60-95% does not apply to coding sessions.
- 2026-08-24 — OmniRoute: verified it was a real package before assessing it.

**Cost:** without the check, two of these would have produced confidently
fabricated output (invented "recalled" decisions; a monitoring commitment that
silently dies), and three would have produced work aimed the wrong way.

**Proposed change:** before acting on a request that names a file, session,
store, or recurring capability, confirm it exists and report the real state.
Cite what was checked so the claim is falsifiable.
