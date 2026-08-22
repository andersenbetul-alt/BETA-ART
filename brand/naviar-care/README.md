# Naviar Care — identity study

Four logo directions for a home & elder care service. Every direction ships as a
symbol-only mark and a full lockup, in full colour, single-ink mono, and reversed.

| Letter | Direction | Idea |
| --- | --- | --- |
| A | Wayfinder | Compass ring, open at the lower right — guidance through care decisions |
| B | Cradle | Two open arcs supporting a figure — hands, shoulders, a bed |
| C | Monogram | An N whose diagonal leans on both uprights — support as structure |
| D | Hearth | House with a heart — instantly legible at a glance |

**Recommendation:** B as the primary mark, C as the icon companion wherever
artwork drops below 20 px.

## Files

```
svg/mark-{a,b,c,d}-*.svg      symbol only, 64x64 viewBox (base / -mono / -reverse)
lockup/lockup-{a,b,c,d}-*.svg mark + wordmark, 200x80 viewBox
png/*-1024.png                transparent raster marks
png/lockup-*-1200.png         transparent raster lockups
presentation.html             the full study — rationale, palette, scale test
```

## Palette

| Name | Hex | Role |
| --- | --- | --- |
| Deep Teal | `#0E4F52` | Primary ink. 9.3:1 on white. |
| Sea | `#2E7D77` | Secondary — subheads, the CARE line, UI states. |
| Apricot | `#E9915E` | Accent only. 2.5:1 on white — never body text. |
| Warm Paper | `#F7F3EE` | Light ground; the ink of reversed artwork. |
| Night | `#0E1F21` | Dark ground for reversed artwork. |

Reversed artwork uses `#F7F3EE` ink, `#9FC9C4` secondary, `#F2A87A` accent.

## Type

- **Fraunces** 600 — wordmark and headlines, tracked −0.4 in the lockup.
- **Manrope** 400/700 — the CARE line, body copy, documents and forms.

The lockup SVGs still reference Fraunces and Manrope as live fonts, with serif /
sans fallbacks. Once a direction is chosen the wordmark should be outlined to
paths so it renders identically everywhere.

## Usage

- **Clear space:** the mark's stroke width × 3 on all four sides.
- **Minimum size:** mark 20 px / 7 mm; full lockup 120 px / 32 mm.
- **On photography:** reversed artwork only, over a dark area or a Night overlay at 55%+.
- **Never:** recolour outside the palette, add shadows or outlines, stretch, or
  reset the wordmark in another face.
