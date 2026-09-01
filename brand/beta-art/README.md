# Beta Art — Brand Assets

## Primary Mark

The **BA monogram** is the official primary mark for Beta Art.
It appears in every Beta Art project without exception.

```
brand/beta-art/master/
  logo-mark.svg            Gold on void — use on dark backgrounds
  logo-mark-cream.svg      Dark on paper — use on light backgrounds
  logo-horizontal.svg      Mark + wordmark, dark
  logo-horizontal-white.svg Mark + wordmark, light
```

Web-ready copies live at `beta-art/public/assets/brand/` — same files, same names.

## Mark geometry

| Element       | Value                                        |
|---------------|----------------------------------------------|
| Viewbox       | 200 × 200                                    |
| B stem        | x=32, y1=42–158, stroke-width=4              |
| B upper bowl  | M 32,42 Q 78,42 78,71 Q 78,100 32,100        |
| B lower bowl  | M 32,100 Q 84,100 84,129 Q 84,158 32,158     |
| A left leg    | (134,42) → (97,158)                          |
| A right leg   | (134,42) → (172,158)                         |
| A crossbar    | (113,112) → (155,112), stroke-width=2.6      |
| Gold stroke   | #C4A35A                                      |
| Dark stroke   | #1A1714                                      |

## Colours

| Token         | Hex       | Use                                     |
|---------------|-----------|-----------------------------------------|
| `--ba-void`   | `#111010` | Mark on light backgrounds               |
| `--ba-white`  | `#FFFFFF` | Mark on dark backgrounds                |
| `--ba-crimson`| `#8B1515` | Centre dot — fixed across both variants |

## Slogans (official)

- **REAL PEOPLE. REAL PLACES. REAL MOMENTS.**
- **Trust the evidence behind every image.**
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
