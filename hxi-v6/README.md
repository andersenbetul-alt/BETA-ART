# HXI-6 — Utgave 01

Official artist website for **HXI** — Nordic phonk producer from Oslo, Norway.

## Stack

- **Next.js 15** App Router · `output: 'export'` (static)
- **React 19** · TypeScript 5
- **Vanilla CSS** — single `globals.css`, no Tailwind
- **10 locales** — en, no, tr, fr, de, es, pt, ar, ja, zh (with RTL for Arabic)

## Structure

```
app/
  [locale]/page.tsx       # Locale home — metadata + JSON-LD + SitePage
  [locale]/layout.tsx     # <html lang dir> per locale
  [locale]/privacy/       # Privacy page
  globals.css             # Full design system (acid #c8ff00, bg #080808)
  sitemap.ts              # 20 URLs (10 locales × 2 pages)
components/SitePage.tsx   # All page sections
content/locales.ts        # 10 locales, real HXI content
public/assets/            # hero.png, og-hxi.jpg, mark.webp, favicon.svg
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static export → out/
```

## Key content

- Breakthrough: **help urself** — 43M+ Spotify streams (archived milestone)
- NCS releases: Lock n' Load, Round Around (with Nateki)
- Credits: Fast & Furious remix, Bodycam soundtrack
- Founding: Oslo, Norway · 2021

## Design

- **Acid Signal** palette: `--acid: #c8ff00`, `--bg: #080808`
- Typography: Impact/Haettenschweiler display + system mono
- `.topline` — 3px acid-red-acid gradient bar
- Hero: full-bleed `hero.png` with cinematic "UTGAVE 01" typography
- RTL: Arabic (`ar`) uses `dir="rtl"` and logical CSS properties throughout
