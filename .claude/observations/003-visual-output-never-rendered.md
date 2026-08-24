# OBS-003 — Visual output committed without ever being displayed

**Status:** pending
**Occurrences:** 3
**First seen:** 2026-08-23

## Evidence
- Wrote theme-aware CSS for a contact sheet and shipped it without rendering
  dark mode. Navy artwork on dark specimen cards was effectively invisible;
  seven cards were unreadable.
- Sized images with an HTML `height` attribute while a CSS rule set
  `height:auto`. The CSS won, and the monogram rendered at full page width
  instead of 140px. Only a screenshot revealed it.
- Presented archive studies at roughly 2x with captions claiming "1:1 @ 24 cap
  height". The labels asserted a scale the render did not have.

## Pattern
Each is the same act: visual output was authored, reasoned about, and treated
as finished without anyone looking at it. Markup and CSS interact in ways that
reading the source does not reveal, and captions describing a rendering are
claims about pixels that only a render can settle.

## Proposed change
Render visual output and look at it before treating it as done, including the
states that are not the default — the other theme, the small size, the long
string. When a caption asserts a scale or a measurement, verify it against the
render rather than against the intent.

## Target
Extend the existing verification skill, or fold together with OBS-002 into one
section about claims that only observation can settle.
