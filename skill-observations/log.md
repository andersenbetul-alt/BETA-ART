# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill
updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue —
resolved statuses always carry their resolution date

---

## 2026-08-21

### Observation 1: A legibility floor and a fixed-width header are in direct tension

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Raising 114 small font sizes onto a three-step scale with a
12px floor, across four static properties.
**Skill:** New gate candidate: type-floor regression check
**Type:** internal
**Phase/Area:** Type scale changes / responsive header layout

**Issue:** The narrow breakpoints had been making the header fit 360px by
setting navigation and buttons at `.58rem` (9.28px). Applying a 12px floor
therefore reopened a header-overflow bug that had already been found and fixed
once before. `render-check.js` went from 0 findings to 83, then 57, then 5
across three attempted fixes, before returning to 0. Nothing in the CSS recorded
that those small sizes were load-bearing for layout rather than stylistic.

**Suggested improvement:** When a declaration exists only to make something fit,
say so in a comment at the declaration — this stylesheet already does that well
in places ("At 360px it is the 19px that pushes the bar past the edge"), and
those comments were the fastest route to the fix. Extend the practice to every
size below the floor.

**Principle:** A value tuned to solve a layout problem is not a style choice, and
changing it globally will silently reopen the problem it solved. Before a
sweeping change to any dimension, check whether the old values were load-bearing
— and prefer reclaiming space from tracking, padding and gaps over shrinking
text below a legibility threshold.

---

### Observation 2: Adding tokens to an existing `:root` can silently redefine one

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Appending a spacing/type/motion token block to the `:root`
of three stylesheets that already had their own tokens.
**Skill:** brandkit / design-tokens / any token-authoring workflow
**Type:** open-source
**Phase/Area:** Token emission into an existing codebase

**Issue:** The added block included `--ease`, which all three stylesheets already
defined with a different curve. The duplicate sat later in `:root` and therefore
won, changing the easing of every existing transition in each property. Nothing
failed — no gate covers it, and the visual difference is subtle enough to pass a
screenshot review. It was caught only by reading the diff.

**Suggested improvement:** Any workflow that emits a token block into an existing
file should first collect the custom properties already defined there and either
skip or rename collisions, and report them. A one-line check is enough:
compare the emitted names against `re.findall(r"(--[a-z0-9-]+)\s*:", src)`.

**Principle:** Adding to a namespace is a silent overwrite when the namespace is
last-wins. Generated additions must diff against what already exists, because
the failure mode is not an error — it is a change nobody asked for and no test
covers.

---

### Observation 3: Media queries add no specificity, so "later" beats "narrower"

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Fixing header overflow at 360px in a stylesheet with
several overlapping breakpoint blocks.
**Skill:** New skill candidate: css-cascade-debugging
**Type:** open-source
**Phase/Area:** Responsive fixes in long hand-written stylesheets

**Issue:** Two consecutive fix attempts failed with no visible effect, because
the rules were added to a `max-width: 400px` block that sat earlier in the file
than a `max-width: 460px` block touching the same properties. A more specific
breakpoint does not win; a later rule does. Both attempts looked correct in the
diff and were only disproved by measuring computed styles in a browser.

**Suggested improvement:** When a CSS fix has no effect, measure the computed
value before editing again — a second edit in the same place costs a full gate
run (~90s here) to disprove. For a stylesheet with overlapping breakpoints,
place override blocks at the end of the file and say why in a comment.

**Principle:** When an edit appears to do nothing, the hypothesis to test first
is that it is being overridden, not that it was wrong. Measure the computed
result rather than re-reading the source.

---

### Observation 4: A wrong option name in a test harness produces confident wrong numbers

**Status:** OPEN
**Date:** 2026-08-21
**Session context:** Measuring rendered font sizes at 360px and 1280px with
Playwright to audit a type scale.
**Skill:** Any browser-measurement or screenshot workflow
**Type:** open-source
**Phase/Area:** Harness setup before measurement

**Issue:** `browser.newPage({ viewportSize: {...} })` was used instead of
`viewport`. Playwright silently ignored the unknown key and used its default
1280px viewport for both runs. The script reported identical results at "360px"
and "1280px" — which was itself the clue — but had the two widths differed only
slightly, the wrong numbers would have been indistinguishable from right ones and
would have gone into a written audit.

**Suggested improvement:** Include at least one value in measurement output that
must change between configurations (here, the `h1` size under a `clamp()`, or the
viewport width itself echoed back). A run whose invariant did not vary is a
broken harness, not a finding.

**Principle:** A measurement harness fails silently when given an unknown option.
Always print something that proves the configuration actually took effect,
before trusting anything else the harness reports.
