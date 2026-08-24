# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue — resolved statuses always carry their resolution date

---

## 2026-08-21

### Observation 1: Search tools that fail silently report "not found" for a blocked backend

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Installing agent skills in a network-restricted container; used `npx skills find` (find-skills skill) to locate skills.
**Skill:** find-skills
**Type:** open-source
**Phase/Area:** Step 3 (Search for Skills)

**Issue:** `npx skills find "<query>"` returned "No skills found" and exit 0 for every query, including `react` — a term whose top result has 100K+ installs. Direct probes showed the backend host returned connection-reset, so the empty result reflected an unreachable API, not an empty registry. Nothing in the output distinguished the two.

**Suggested improvement:** find-skills Step 3 should require a control query with a known-present result before treating any empty result as absence, and should report backend unreachability distinctly from zero matches.

**Principle:** A search tool's empty result is only evidence of absence if the backend is known reachable. Validate with a control query whose result you can predict before concluding "it doesn't exist."

### Observation 2: Package-name collisions across registries silently substitute the wrong software

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** GitHub repo `Manavarya09/design-extract` was unreachable; attempted the npm package of the same name as a fallback.
**Skill:** New skill candidate: vetted-package-install
**Type:** open-source
**Phase/Area:** Fallback resolution

**Issue:** `npm view design-extract` resolved to a different project entirely (`martinyis/design-extract`, "extract design context frames from screen recordings") than the intended GitHub source. Installing it would have delivered unrelated software under the expected name, with no error.

**Suggested improvement:** Before installing a package as a fallback for a named repository, compare the package's `repository.url` against the intended source and abort on mismatch.

**Principle:** Name identity across registries is coincidence, not evidence. Verify a package's declared provenance matches the intended source before installing it.

### Observation 3: Aggregator metadata outlives the resource it describes

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Determining whether a GitHub repository was public; search results reported 3.4k stars and an MIT license.
**Skill:** find-skills
**Type:** open-source
**Phase/Area:** Step 4 (Verify Quality Before Recommending)

**Issue:** I asserted a repo was public based on search-result metadata (star count, license, description). Five independent unauthenticated clients — git ls-remote, raw.githubusercontent on two branches, the GitHub API, and WebFetch — all returned 404/refused, while the same probes returned 200 for a control repo. The metadata was cached from a prior state; the assertion had to be retracted.

**Suggested improvement:** find-skills Step 4 already says to check install counts and stars. Add: confirm the source is currently reachable with a direct probe before citing its metadata as fact.

**Principle:** Search-engine and aggregator metadata describes a resource's past state. Existence claims require a direct probe against the resource itself, with a control to prove the probe works.

### Observation 4: Repeated clone-scan-install workflow is an unnamed reusable skill

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Installed ~10 third-party skill bundles from GitHub across one session, each following an identical unwritten procedure.
**Skill:** New skill candidate: vetted-skill-install
**Type:** open-source
**Phase/Area:** Whole workflow

**Issue:** Each install repeated the same steps ad hoc: check anonymous readability, shallow clone, enumerate payload, scan scripts for network/exec/credential access, scan docs for injection or withholding instructions, resolve out-of-directory dependencies, copy into the skills directory, verify references resolve, report what was deliberately NOT installed. The procedure was reconstructed from memory each time rather than followed from a definition, and the depth of the security scan varied with attention rather than with risk.

**Suggested improvement:** Author a skill defining this as an explicit checklist, with the scan tiers keyed to payload type (markdown-only vs. ships executables vs. ships an installer vs. requests credentials) and a mandatory "what I did not install, and why" report.

**Principle:** A procedure repeated more than a handful of times in one session, reconstructed from memory each time, is a skill that hasn't been written down yet — and its weakest execution is the one that matters.

### Observation 5: Skills with out-of-directory dependencies install broken and fail silently

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Installing the `brandkit` skill, distributed as a bare SKILL.md inside a larger repository.
**Skill:** New skill candidate: vetted-skill-install
**Type:** open-source
**Phase/Area:** Install step

**Issue:** `brandkit/SKILL.md` referenced five files living outside its own directory (`taste/*.md`, `tokens/motion.json`, `scripts/validate_contrast.py`, and the repo-root CLAUDE.md). Copying the skill directory alone — the obvious install action — would have produced a skill that loads, appears healthy, and silently fails whenever it reaches for a reference. The breakage surfaces only at use time, in degraded output rather than an error.

**Suggested improvement:** After installing any skill, extract its internal file references and assert each resolves relative to the install root; bundle dependencies preserving relative paths, or fail the install loudly.

**Principle:** A skill is only self-contained if its references resolve from its install root. Verify reference resolution as part of install, because the failure mode is silent degradation, not an error.

## 2026-08-24

### Observation 6: Environment properties asserted from assumption rather than probed

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Installing claude-mem in a remote container; later discovered it had been running and persisting for three days.
**Skill:** New skill candidate: vetted-skill-install
**Type:** open-source
**Phase/Area:** Pre-install assessment

**Issue:** I told the user claude-mem was "structurally inert" here and that "nothing would persist," reasoning from a belief that the container was single-session ephemeral. Three days later the worker was still running, the SQLite database held real observations from the earlier date, and the vector store had been updated that morning. The claim had to be retracted. The same assumption produced repeated advice to "run it on your local machine instead," which was unnecessary. Separately, a GitHub push reported 403 for roughly fifteen consecutive turns and was correctly reported as blocked each time — but when access was eventually granted the change was only discovered on the next routine attempt, not by design.

**Suggested improvement:** Treat environment properties — persistence, network reach, credential scope — as empirical facts to be probed, never as inferred background. Before asserting that a tool cannot work in an environment, run the cheapest probe that would falsify the claim. When reporting a blocker owned by an external system, timestamp it ("as of this check") and re-probe on each subsequent turn rather than restating the cached conclusion.

**Principle:** Statements about the environment are claims, and claims need evidence. Assuming a constraint is as much an error as assuming a capability — and the assumed constraint is worse, because it silently suppresses work that would have succeeded.

### Observation 7: Ranked retrieval always returns something, so a full result table is not evidence of a hit

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Asked to "retrieve relevant context from previous sessions" before continuing an authentication task; queried claude-mem's semantic memory search.
**Skill:** New skill candidate: memory-retrieval-discipline
**Type:** open-source
**Phase/Area:** Context retrieval

**Issue:** The query returned "Found 24 result(s)" in a formatted table. Every row was about an unrelated topic — an HTTP proxy, a browser automation failure, a package manager — because the index returns nearest neighbours by similarity regardless of whether anything relevant exists. There was no authentication context at all. Read quickly, a populated result table is indistinguishable from a successful retrieval, and acting on it would mean building on context that was never there. On a later query the same tool returned genuinely relevant entries, so the tool was not broken — the failure mode is that both outcomes look identical.

**Suggested improvement:** After any semantic or vector retrieval, verify that returned items actually mention the queried subject before treating them as context. State explicitly whether real context was found or whether the result set is nearest-neighbour noise. Never let result count stand in for relevance.

**Principle:** Similarity search has no empty state. Distance ranking always produces a top-k, so relevance must be checked after retrieval — the presence of results carries no information about whether the thing you asked for exists.

### Observation 8: Distinguish harness failure from subject failure before concluding

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Verifying Supabase row-level security policies by applying the migration to a real PostgreSQL instance and running a behavioural test suite.
**Skill:** test-driven-development
**Type:** open-source
**Phase/Area:** Interpreting test results

**Issue:** The suite aborted at test 8 with `SAVEPOINT can only be used in transaction blocks`. The error surfaced while testing security policies, so the tempting reading was that the policy under test was wrong. It was not: psql was autocommitting and the test scaffold had never opened a transaction. The subject was correct and the instrument was broken. Read the other way, this would have produced a "fix" to correct authorization rules.

**Suggested improvement:** When a test fails, classify the failure before acting on it: does the error name something in the subject under test, or something in the scaffold running it? Errors naming the runner, the connection, the fixture, or the transaction context are harness failures — repair the harness and re-run before touching the subject.

**Principle:** A failing test is evidence that subject and harness disagree, not evidence about which one is wrong. Establishing which is at fault is the first step of diagnosis, not an assumption to carry into it.

### Observation 9: A vendored skill without activation config does not self-invoke

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** task-observer was installed and vendored into the repository, but no observation was written during a full session of substantive deliverable work until the user asked directly.
**Skill:** task-observer
**Type:** open-source
**Phase/Area:** Recommended Activation Setup / How to Log

**Issue:** The skill states that description-level matching alone is not enforceable and must be paired with a configuration-level instruction. That instruction was never installed — the write to the user-level config file was denied by a permission guard, and the denial was surfaced but never resolved. The skill was then vendored at project level, which solved persistence but not activation. Across a session producing a database migration, a fifteen-case test suite, a configuration file, and four commits — every one of them a deliverable event that the skill designates as a mandatory flush point — no observation was logged until the user asked whether any had been. The skill's own diagnosis of this failure mode proved exactly right, on itself.

**Suggested improvement:** Treat activation configuration as part of installation, not a follow-up: an install that cannot write the activation instruction should report itself as incomplete rather than successful. Where the config write is denied, surface the unresolved gap at the end of every subsequent session rather than once at install time — a single early notice is forgotten precisely across the long sessions where the skill matters most. Consider a repository-level CLAUDE.md as the fallback target when the user-level file is guarded.

**Principle:** A capability that depends on remembering to invoke it will not be invoked during demanding work. Installation is not complete until the structural trigger exists; without it, what has been installed is the documentation of a behaviour rather than the behaviour.
