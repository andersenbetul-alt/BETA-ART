# AGENTS — HXI-6

## Project identity

**HXI-6 — Utgave 01** (`hxi-v6/`)
Next.js 15 static-export artist website for HXI (Christoffer Andersen), Nordic phonk producer from Oslo, Norway.

## Branch

All changes go to `claude/hxi-skrlag` (monorepo root branch).

## Stack

- Next.js 15 App Router · `output: 'export'`
- React 19 · TypeScript 5 · Vanilla CSS (no Tailwind)
- 10 locales: en, no, tr, fr, de, es, pt, ar, ja, zh
- RTL: Arabic (`ar`) uses `dir="rtl"` — always use logical CSS (`inline-start`, not `left`)

## File map

| File | Role |
|------|------|
| `content/locales.ts` | All locale data: 10 languages × full copy for every section |
| `components/SitePage.tsx` | Client component — renders all 8 sections |
| `app/globals.css` | Design tokens + layout; acid green `#c8ff00` |
| `app/[locale]/page.tsx` | OG metadata, JSON-LD MusicGroup, SitePage |
| `app/[locale]/privacy/page.tsx` | Privacy page with locale copy |
| `public/assets/` | hero.png (1.9MB), og-hxi.jpg, mark.webp, favicon.svg |

## Rules

1. Never add `.env` with real credentials — use `.env.example` only.
2. Never change `output: 'export'` or `trailingSlash: true` in `next.config.ts`.
3. The `@/*` alias resolves to the project root (not `./src/`).
4. Locale keys: all 10 locales must be updated together — no partial additions.
5. Images: `images: { unoptimized: true }` — plain `<img>` or `next/image` both work.

## Key URLs (hardcoded in SitePage.tsx)

- Spotify artist: `https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU`
- Breakthrough track (embed): `54ggxbEopZwQ20zurJiHSD`
- Instagram: `https://www.instagram.com/prod.hxi/`
- YouTube: `https://www.youtube.com/@hximusic`
- NCS artist: `https://ncs.io/artist/1169/hxi`
