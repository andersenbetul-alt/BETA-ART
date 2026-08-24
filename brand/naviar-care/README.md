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

## Aligned with the live product

`naviar-care-1.vercel.app` is the product: a Norwegian-language Next.js site
that matches families with verified NAV and pension advisors for a fixed-price
call. It and this identity study are two halves of one project, so the product's
shipped tokens win wherever they disagree with the study's originals.

Tokens read from the live stylesheet:

| Role | Product token | This study originally | Resolution |
| --- | --- | --- | --- |
| Primary ink | `#014933` forest green | `#0E4F52` deep teal | Product wins |
| Secondary | `#2B795C` (`--ring`) | `#2E7D77` sea | Product wins |
| Light ground | `#faf7ee` | `#F7F3EE` | Product wins (near-identical) |
| Reverse ink | `#fdfaf3` | `#F7F3EE` | Product wins |
| Display face | Fraunces | Fraunces | **Already identical** |
| Body face | DM Sans | Manrope | Product wins |
| Mono face | DM Mono | IBM Plex Mono | Product wins |
| Warm accent | *none exists* | `#E9915E` apricot | See below |

Recolored artwork is in `product-aligned/`, three variants per mark:
`-strict` (product tokens only), `-extended` (product greens plus the apricot),
and `-reverse` (for the primary green as a ground).

### The palette has no usable accent

The product's only non-green accents are `--secondary` `#c8e8ee` and `--accent`
`#d0eacf`, both very pale. Rendered on the `#faf7ee` ground they nearly vanish:
at 26 px the cradle's figure and the monogram's diagonal stop reading as
separate elements. The apricot holds at both sizes.

So the recommendation is to add one warm accent token to the product rather
than force the mark into the existing set. It is also the colour the product is
missing generally — the site is entirely cool greens for a service whose whole
promise is a calmer, more human next step.

### Dropping the mark into the site

The header currently uses a placeholder Lucide `heart-handshake` icon inside a
`bg-primary text-primary-foreground` tile. `NaviarMark.tsx` is a drop-in
replacement that paints with `currentColor`, so it inherits that tile's colour
and keeps following the theme:

```tsx
<span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
  <NaviarMark className="size-6" />
</span>
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
