---
status: open
occurrences: 4
first_seen: 2026-08-24
---

# A verbatim re-sent message means "act", not "explain again"

**What recurred:** When the user re-sent an identical message, it followed a
turn where I had analyzed, caveated, or asked rather than produced the thing.
Each repetition was a correction signal I initially answered with more analysis.

**Evidence:**
- 2026-08-24 — "Continue working on the authentication system. First retrieve
  the relevant context from previous sessions." sent 3x. I re-explained the
  empty memory store twice before leading with the work.
- 2026-08-24 — ".claude/skills/task-observer/" sent 2x. I answered the first
  with a question about what it should mean.
- 2026-08-24 — The OmniRoute/Headroom/Claude-Mem stack diagram sent 2x
  unchanged, after I replied with a critique of its topology.
- 2026-08-24 — This observation loop diagram sent 3x, after I had built the
  skill but never actually run it.

**Cost:** a full turn each time, spent restating a position the user had
already read and declined to act on. Worst case it reads as stonewalling.

**Proposed change:** on a verbatim repeat, lead with the deliverable. State any
constraint in one line inside that response, not as a substitute for it. If part
is genuinely impossible, build the possible part and say which part was not.
