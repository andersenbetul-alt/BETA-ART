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
