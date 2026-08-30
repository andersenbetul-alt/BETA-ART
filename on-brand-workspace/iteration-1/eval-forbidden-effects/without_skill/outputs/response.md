# NAVIAR wordmark — 3D/premium treatment + flipped version

I don't have NAVIAR's actual brand guidelines, approved typeface, or color
tokens available to me, so I made the following assumptions and built the
piece as a plain design exercise. Please sanity-check these against your real
brand system before shipping anything — a couple of the choices below are
worth a second look.

## What I made

| File | What it is |
|---|---|
| `naviar-wordmark-3d.png` | The wordmark with a 3D/extruded look, a metallic gradient face, a glossy highlight, and a soft drop shadow underneath. Transparent background, ~1600px wide source render. |
| `naviar-wordmark-3d-flipped.png` | A literal **horizontal mirror flip** of the same artwork (`scaleX(-1)`), as asked. |
| `naviar-wordmark-3d-right-aligned-safe.png` | The **same, un-mirrored** wordmark — meant to be dropped into a right-aligned layout by positioning it flush right, without flipping the letterforms. See note below on why this exists. |
| `naviar-wordmark-3d-source.html` / `naviar-wordmark-3d-flipped-source.html` | Editable HTML/CSS source for the two renders (font, gradient stops, shadow layering, flip transform all live here if you want to tune them). |

## Design choices (and the assumptions behind them)

- **Typeface:** a bold geometric sans (`Arial Black` / `Helvetica Neue` fallback
  stack) at wide letter-spacing, since I don't know NAVIAR's licensed
  wordmark typeface. If NAVIAR has one, swap it in — the extrusion/shadow
  technique is font-agnostic.
- **Color:** a neutral graphite-to-silver metallic gradient rather than an
  invented "NAVIAR blue" or similar — I didn't want to guess a brand color
  and have it look canonical. If NAVIAR has defined brand colors, tell me
  and I'll rebuild the gradient/shadow tones from those instead of neutral
  metal tones.
- **The "3D" effect:** built from ~18 stacked, incrementally offset and
  darkened copies of the text (a fake extrusion/bevel), a lighter-to-darker
  vertical gradient on the front face, a soft diagonal gloss highlight, and
  a blurred ambient drop shadow beneath the whole mark. This is a fairly
  strong, glossy "chrome/premium" treatment — if the actual brand feels more
  restrained, this can be dialed back a lot (fewer extrusion steps, lower
  shadow opacity, drop the gloss layer entirely) and still read as "lifted
  off the page" rather than flat.

## Two things worth flagging before this goes anywhere near a real brand kit

1. **A true horizontal flip mirrors the letters, not just the layout.**
   `naviar-wordmark-3d-flipped.png` is what you asked for literally, but as
   you can see, "NAVIAR" mirrors into something that reads roughly like
   "ЯAIVAИ" — backwards and hard to parse at a glance. Most brand systems
   explicitly forbid mirroring a wordmark for exactly this reason: it
   breaks legibility and brand recognition, and readers can tell something
   is "off" even before they consciously notice the letters are reversed.
   If the actual goal is just *"the logo needs to sit on the right side of
   a layout,"* the normal solution is to right-align the unflipped
   wordmark (`naviar-wordmark-3d-right-aligned-safe.png` is that same,
   readable version, ready to be placed flush-right) rather than mirror
   the letterforms. If there's a separate icon/symbol mark (not the
   wordmark text) that's meant to visually "point" in a direction, mirroring
   *that* symbol alone is much more common practice than mirroring text.
   I'd lean on the right-aligned (unflipped) version for real use and treat
   the mirrored one as a novelty/decorative asset at most — happy to build
   more variants either way once it's clear which you need.

2. **Heavy 3D/gradient/drop-shadow treatments are themselves something a lot
   of brand guides explicitly restrict**, usually keeping the primary
   logo/wordmark flat and single-color and reserving effects like this for
   one-off hero/marketing moments, not the logo lockup itself. I have no
   NAVIAR-specific document telling me this is or isn't allowed here, so I
   built what was asked — just flagging that if there *is* a brand
   guideline for NAVIAR I haven't seen, "3D + gradient + shadow on the
   wordmark" is a common thing such guidelines rule out, and it would be
   worth a quick check before this goes into a real deck or site.

## If you want changes

Tell me and I can quickly: tone down the extrusion/gloss for something more
subtle, swap in real brand colors/typeface, export at other sizes or as SVG
for crisp scaling, or produce the right-aligned lockup as its own polished
asset (logo + tagline/lockup) rather than just the bare wordmark.
