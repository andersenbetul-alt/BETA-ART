# HXI-5 ROADMAP — Acid Signal

> Updated: 2026-08-30 · Branch: claude/hxi-skrlag

## Concept

The fifth iteration of the HXI website. Previous versions (HXI-1 through HXI-4) were built in Lovable using TanStack Start + Tailwind CSS. HXI-5 breaks that pattern: hand-authored Next.js 15 with a completely new design language.

**Design intent:** Acid green on near-black. Impact display font. Grid lines. Phonk aesthetics made explicit — not softened for mainstream streaming, but leaning fully into the underground visual vocabulary. The topline bar (acid–red–acid gradient, 3px) and the giant `X` watermark in the frequency section are signature elements.

## Technical decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js 15 App Router | SSG + multi-locale routing without a build pipeline |
| CSS | Vanilla with `:root` tokens | No Tailwind — full control, smaller bundle |
| Output | Static export | Artist site has no dynamic server-side needs |
| Locales | en, no, de, fr, es, ar | NCS audience coverage; RTL for Arabic |
| Font | Impact (system) | Zero load cost; strong phonk/automotive aesthetic |
| Images | next/image unoptimized | Required for static export |

## Sections

1. **Topline bar** — fixed 3px gradient: acid → red → acid
2. **Nav** — sticky, frosted glass, language picker, Spotify CTA
3. **Hero** — full-viewport with background photo, giant H**X**I heading, stats signal box
4. **Marquee** — scrolling ticker (NCS SIGNED / 43M STREAMS etc.)
5. **Latest release** — cover art + Spotify embed + stats grid + timeline
6. **Catalog** — 6-card release grid, hover: acid fill
7. **Proof** — 4-card placement grid (NCS, YouTube, Instagram, NCS page)
8. **Nordic** — light section (`#efede6`), biography, coordinate display
9. **Platforms** — creator link list + NCS license note
10. **Work** — 3-card use-case grid (content, gaming, sync)
11. **Frequency** — stems section with giant `X` watermark
12. **Contact** — acid green background, booking CTA
13. **Footer** — privacy link, sitemap, copyright

## Changelog

### 2026-08-30 — v0.1.0 — Initial import
- Created `hxi-v5/` directory in BETA-ART monorepo
- Source files from design session: `app/[locale]/page.tsx`, `layout.tsx`, `privacy/page.tsx`, `sitemap.ts`, `globals.css`
- Created `content/locales.ts` with 6 locales (en, no, de, fr, es, ar) — full copy for all sections
- Created `components/SitePage.tsx` — all 13 sections, accessible markup
- Config: `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `.env.example`
- Docs: `README.md`, `ROADMAP.md`, `AGENTS.md`
- Root layout pass-through + redirect from `/` to `/en/`

## Next steps

**P0 — Unblocks launch**
- [ ] Add `public/assets/og-hxi.jpg` (1200×630 OG image)
- [ ] Add `public/assets/hero.jpg` (hero background)
- [ ] Add `public/assets/favicon.svg`
- [ ] Run `npm install && npm run build` locally — verify 12 static routes generate
- [ ] Create Vercel project `hxi-v5` under BET-ART team, root directory `hxi-v5/`

**P1 — Quality**
- [ ] Add `next/font` for Inter (zero-FOUT on the sans stack)
- [ ] Test Arabic RTL layout at all three breakpoints (1100, 900, 560)
- [ ] Add `aria-label` to hero background image
- [ ] Verify Spotify embed loads lazily (currently `loading="lazy"`)
- [ ] Check `prefers-reduced-motion` — marquee stops ✓ but transitions also disable ✓

**P2 — Features**
- [ ] Stem pack email gate — Formspree/Resend webhook (add to `.env.example`)
- [ ] Add real release cover images per card in the catalog grid
- [ ] Add structured data for `MusicAlbum` per release
- [ ] Booking inquiry form (replace mailto: link)

**P3 — Growth**
- [ ] Connect `hxi.no` domain in Vercel (DNS: CNAME → cname.vercel-dns.com)
- [ ] Add Japanese (`ja`) and Chinese (`zh`) locales for NCS Asia audience
- [ ] YouTube channel page deep-link per release card
- [ ] Press kit / EPK page (`/[locale]/press/`)
