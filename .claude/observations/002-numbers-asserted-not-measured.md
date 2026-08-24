# OBS-002 — Quantities reported from arithmetic instead of measurement

**Status:** pending
**Occurrences:** 2
**First seen:** 2026-08-23

## Evidence
- Reported a logo's gold accent as 14.1% of the mark and published that figure
  in a README and a contact sheet. It came from a formula whose overlap term
  undercounted where the diagonal meets the stems. Rendering the SVG and
  counting pixels disagreed.
- The first correction was also wrong. A measured 17.05% looked like a spec
  violation, but that render was clipped (ink bbox 760x713 against a declared
  760x800) and the clipped region contained only navy, inflating the gold
  share. Only the third attempt, on an oversized canvas, gave the real 12.74%.

## Pattern
Two failures with one root: a quantity describing an artifact was reported
without being observed against that artifact. The second adds that the
measurement is itself an instrument — a surprising result indicts the
instrument as readily as the thing measured.

## Proposed change
Measure a published quantity against the artifact it describes. When a
measurement contradicts expectation, check its preconditions before acting on
it — was the capture complete, did the flag take effect, does the bounding box
match the declared size. A result that is surprising in a structural way is
suspect until the instrument checks out.

## Target
Extend the existing verification skill — the same discipline it applies to
behaviour, applied to numbers.
