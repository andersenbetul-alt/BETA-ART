# HXI-4 — Phonk Studio Pro

**Lovable ID:** `daddeade-7b69-4b6a-bda8-e3e3acab8645`  
**Monorepo path:** `hxi-v4/`  
**Code:** HXI-4  
**Status:** Draft (imported, not deployed)

## What this is

The most feature-complete HXI website iteration. Built for **Christoffer Andersen (HXI)**,
Norwegian phonk producer with 43M+ Spotify streams.

Compared to earlier versions:

| Feature | HXI-1 | HXI-2 | HXI-4 |
|---|---|---|---|
| Color base | `#080810` near-black | `#00142e` navy | `#080810` near-black |
| Glitch technique | span layers | CSS pseudo | span layers |
| Supabase | ✗ | ✓ | ✗ |
| Stem Packs section | ✗ | ✗ | ✓ |
| NCS Ecosystem section | ✗ | ✗ | ✓ |
| Sync Licensing section | ✗ | ✗ | ✓ |
| Booking section | ✗ | ✗ | ✓ |
| Preloader | ✗ | ✗ | ✓ |
| Cookie consent | ✗ | ✗ | ✓ |
| Scroll progress bar | ✗ | ✗ | ✓ |
| Back-to-top button | ✗ | ✗ | ✓ |
| Store section | ✗ | ✗ | ✓ |

## Sections

1. **Hero** — 22vw glitch logo, stem pack teaser, quick stats grid (43M streams, 500+ tracks, 12 labels)
2. **Ticker** — red marquee band with genre tags
3. **Music** — static track cards: HELP URSELF, X-PIRATA, MONTAGEM HYSTERIA + Spotify embed
4. **Stats** — animated counters (IntersectionObserver): 43M streams, 500+ tracks, 12 labels, 50M NCS subs
5. **Stems** — 3 products: FREE stem pack, $14.99 preset pack, $29 X-Pirata stems
6. **NCS** — NCS ecosystem info (50M subscribers) + reach stats panel
7. **Sync** — market data panel, 4 credential cards, tier table, inquiry form toggle
8. **About** — "THE FREQUENCY" decorative text + bio
9. **Store** — 4 products
10. **Email list** — newsletter signup
11. **Booking** — set types + inquiry form
12. **Footer** — 4-column layout

## Color system

```css
--bg: #080810        /* near-black */
--surface: #0e0e18   /* card surface */
--red: #EF2B2D       /* brand red */
--ink: #F0EDE8       /* warm off-white text */
--muted: #666660     /* secondary text */
```

Glitch layers: `glitch-layer-red` (screen blend, `#EF2B2D`) + `glitch-layer-blue` (`#4B7BEC`).

## Setup

```bash
cd hxi-v4
bun install
bun run dev
```

No environment variables required.

## Stack

- TanStack Start (SSR) + React 19 + TypeScript
- Tailwind CSS v4 (`@theme inline`, `@utility` glitch/scanline/marquee utilities)
- shadcn/ui new-york style (Radix UI)
- Bun runtime, Vinxi/Nitro builder
- Fonts: Barlow Condensed 700/900, Space Mono 400/700, Inter 300/400
