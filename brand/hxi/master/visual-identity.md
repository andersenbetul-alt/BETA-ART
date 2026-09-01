# HXI — Visual Identity System

**Status:** LOCKED  
**Version:** 1.0 · 30.08.2026

---

## Color System

| Token | Hex | Role | Notes |
|---|---|---|---|
| `--black` | `#080808` | Primary background | Near-black, not pure |
| `--white` | `#F0EDE8` | Primary text / surface | Warm off-white |
| `--acid` | `#C8FF00` | Brand accent / memory color | Primary brand signal |
| `--red` | `#EF2B2D` | Signal Secondary only | Drops, warnings, campaign interruption, special state |
| `--grey-1` | `#1A1A1A` | Elevated surface | Cards, panels on black |
| `--grey-2` | `#333333` | Dividers, muted borders | — |
| `--grey-3` | `#666666` | Muted text | Metadata, labels |
| `--grey-4` | `#999999` | Disabled / placeholder | — |

**Key rule:** Red `#EF2B2D` is NOT a permanent brand accent. Acid lime `#C8FF00` is the primary HXI memory color. Red appears only for: drops, warnings, campaign interruption, special state.

**Acid green risk management:** HXI must not depend entirely on acid color. Test: a HXI visual with acid removed must still read as HXI through typography + layout + UTGAVE + Oslo.

---

## Typography

### Type Stack

| Role | Face | Weight | Use |
|---|---|---|---|
| DISPLAY | Barlow Condensed | 700 (Bold), 900 (Black) | Headlines, campaign titles, artist statements, hero |
| BODY | IBM Plex Sans | 400, 500 | Long-form copy, descriptions, metadata, UI copy |
| SIGNAL / SYSTEM | Space Mono | 400 | UTGAVE labels, coordinates, year, role, track metadata, nav numbers, technical labels |

**Source:** Google Fonts (all three available as web fonts)  
**Fallbacks:** `'Barlow Condensed', Impact, Arial Narrow, sans-serif` · `'IBM Plex Sans', system-ui, sans-serif` · `'Space Mono', 'Courier New', monospace`

### Type Scale

| Token | Size | Face | Usage |
|---|---|---|---|
| `--hero-xl` | clamp(5rem, 14vw, 14rem) | Barlow Condensed Black | HXI hero mark |
| `--hero-lg` | clamp(3rem, 8vw, 8rem) | Barlow Condensed Black | Section heroes |
| `--title-xl` | clamp(2rem, 5vw, 5rem) | Barlow Condensed Bold | Page titles |
| `--title-lg` | clamp(1.5rem, 3vw, 3rem) | Barlow Condensed Bold | Section titles |
| `--title-md` | clamp(1.25rem, 2.5vw, 2rem) | Barlow Condensed Bold | Sub-section |
| `--body-lg` | 1.125rem | IBM Plex Sans | Lead copy |
| `--body-md` | 1rem | IBM Plex Sans | Body |
| `--body-sm` | 0.875rem | IBM Plex Sans | Secondary body, captions |
| `--signal-md` | 0.875rem | Space Mono | UTGAVE, coordinates |
| `--signal-sm` | 0.75rem | Space Mono | Track metadata, labels |

### Type Rules

- All Barlow Condensed: uppercase, letter-spacing: 0.02–0.05em
- Space Mono: always uppercase, letter-spacing: 0.08–0.12em
- IBM Plex Sans: sentence case, normal letter-spacing
- Never mix uppercase rules across faces in the same line

---

## Logo System

**Status:** Candidate A direction locked. Production master: OPEN GATE.

### Mark Types

| Type | Use |
|---|---|
| `HXI` wordmark (Barlow Condensed Black, uppercase) | Primary identity, hero, footer |
| `X` mark (geometric, acid or white on black) | Signal system, watermark, secondary icon |
| `HXI` + UTGAVE label lockup | Header / editorial use |
| Coordinate lockup (`59.91°N · 10.75°E`) | Place branding |

### Clearance / Safe Zone

- Wordmark: minimum 1× character height clear on all sides
- Never place acid text on any background other than black or very dark

### Trademark Note

**DO NOT USE** ® or "fully protected" language. Clearance status: PROMISING BRAND CANDIDATE / NOT CLEARED for HXI word mark, logo, and slogan.

---

## SIGNAL SYSTEM — Recurring Visual Elements

These elements form the HXI visual grammar. Use consistently, never arbitrarily:

| Element | Spec | Rule |
|---|---|---|
| UTGAVE label | `UTGAVE 01` / `UTGAVE 02` etc. · Space Mono · uppercase · acid or grey-3 | Marks editorial releases/campaigns |
| Coordinates | `59.91°N · 10.75°E` · Space Mono · small · grey-3 or acid | Place identifier, use sparingly |
| Section numbers | `01` `02` `03` · Space Mono · acid · small | Mobile nav + optional section markers |
| Hard borders | 1px solid `var(--grey-2)` · never rounded | Editorial structure |
| Acid accent | Sparingly on type: labels, active states, key CTA | Never background fill except micro-details |
| `→` arrow | IBM Plex Sans or Space Mono · white or acid | CTAs, links |

---

## Motion

### Principles

- Cut, reveal, scan, shift, mask, signal = ✓
- Shake, constant glitch, RGB epilepsy, particle systems, 3D for no reason = ✗

### Timing

| Context | Duration | Easing |
|---|---|---|
| Standard transition | 180ms | ease-out |
| Section reveal | 280ms | ease-out |
| Hero reveal | 480ms | ease-in-out |
| Page enter | 320ms | ease-out |

### Rules

- `prefers-reduced-motion`: all animation/transition must be zero or minimal
- No autoplay audio/video
- No looping background video on hero
- Scroll parallax: max-depth subtle (< 10% displacement), mask-only preferred

---

## Imagery Rules

### Three Layers

**ARTIST WORLD** — Real HXI imagery / approved artist assets  
→ Low light, high contrast, partial silhouette, strong texture

**PLACE WORLD** — Oslo, not postcard Norway  
→ Snow · concrete · tunnels · street light · industrial surfaces · wet asphalt · night · real city feel (not northern lights tourism)

**MUSIC WORLD** — Artwork / release covers / credits

### Never

- Stock model + car imagery
- Generic "dark producer" with neon glow
- Any image not approved or source-verified
- Images that imply claims (awards, achievements) not documented

---

## Layout Grammar

HXI layout = editorial magazine × music platform × signal system

| Principle | Application |
|---|---|
| Music dominates | Music content always primary, brand language frames |
| Hard grid | 12-column desktop, 4-column mobile |
| Unexpected whitespace | Let sections breathe asymmetrically |
| Full-bleed frames | Oslo images go edge-to-edge |
| Editorial borders | Sections divided by hard 1px lines, not shadows |
| Progressive disclosure | Homepage artist world → sub-pages technical complexity |
