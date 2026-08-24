---
status: open
occurrences: 4
first_seen: 2026-08-24
---

# Run the code before claiming it works

**What recurred:** Every batch of code I wrote this session contained at least
one real error that only compiling or executing surfaced. None were visible on
re-reading.

**Evidence:**
- 2026-08-24 — src/auth/middleware.ts used `req.log`, which is Fastify's API,
  not Express's. Caught by `tsc --noEmit`.
- 2026-08-24 — test/jwt.test.ts referenced `CryptoKey`, absent from the ES2023
  lib, and put `await` inside four non-async arrows. Caught by compiling.
- 2026-08-24 — env guards and the 401 path were asserted, then smoke-tested;
  passing was not obvious in advance.
- 2026-08-24 — `node --test dist-test/test/` reported a failure I nearly
  attributed to the tests; the directory argument was wrong and the suite
  passed when pointed at the file.

**Cost:** each would have shipped as a confident claim of working code. The last
one nearly produced a wrong diagnosis of my own test suite.

**Proposed change:** for any non-trivial code, run the repo's own checks before
reporting. Report the command and its result, not a characterization of it.
