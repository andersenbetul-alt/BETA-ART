# Beta Art — Brand Assets

## Primary Mark

The **aperture circle** is the official primary mark for Beta Art.
It appears in every Beta Art project without exception.

```
brand/beta-art/master/
  logo-mark.svg            Dark (black) — use on light backgrounds
  logo-mark-white.svg      White — use on dark backgrounds
  logo-horizontal.svg      Mark + wordmark, dark
  logo-horizontal-white.svg Mark + wordmark, white
```

Web-ready copies live at `beta-art/public/assets/brand/` — same files, same names.

## Mark geometry

| Element        | Value                                      |
|----------------|--------------------------------------------|
| Viewbox        | 100 × 100                                  |
| Circle         | cx=50 cy=50 r=44, stroke-width=3           |
| Aperture lines | 4 chord lines, 10 px offset from centre    |
| Line weight    | stroke-width=2.2                           |
| Centre dot     | r=5, fill=#8B1515 (crimson)                |

The four chord lines form two pairs of parallels at 45°:
- Pair A (slope −1): endpoints derived from y = −x + 114.14 and y = −x + 85.86
- Pair B (slope +1): endpoints derived from y = x + 14.14 and y = x − 14.14

Each line is a chord that does not pass through the centre — this offset (10 px)
is what creates the iris/shutter aperture appearance.

## Colours

| Token         | Hex       | Use                                     |
|---------------|-----------|-----------------------------------------|
| `--ba-void`   | `#111010` | Mark on light backgrounds               |
| `--ba-white`  | `#FFFFFF` | Mark on dark backgrounds                |
| `--ba-crimson`| `#8B1515` | Centre dot — fixed across both variants |

## Slogans (official)

- **REAL PEOPLE. REAL PLACES. REAL MOMENTS.**
- **TRUST EACH IMAGE**
- Tagline: VERIFIED HUMAN PHOTOGRAPHY

## Trademark note

Patentstyret (NO): https://www.patentstyret.no/  
EUIPO (EU): https://www.euipo.europa.eu/en  

Both sites are blocked in the current development environment; access via
Firecrawl search excerpts for criteria and fee information. Verify directly
in-browser before filing. See `docs/marka-tescili.md` for in-scope guidance.

## Usage rules

1. Never distort or rotate the mark.
2. The crimson dot stays crimson — do not change its colour in either variant.
3. Minimum size: 24 px diameter on screen.
4. Clear space: equal to the dot radius (5 px at 100 px viewbox, scale proportionally).
5. On a neutral grey background, use the dark variant.
