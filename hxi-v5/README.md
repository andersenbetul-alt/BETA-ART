# HXI-5 — Acid Signal

**Stack:** Next.js 15 App Router · React 19 · TypeScript · Vanilla CSS  
**Locales:** en, no, de, fr, es, ar (Arabic RTL)  
**Output:** Static export → Vercel

The fifth iteration of the HXI artist website. First version not built in Lovable — hand-authored in Next.js for full control over the design system.

## Design system

| Token | Value | Notes |
|-------|-------|-------|
| `--acid` | `#c8ff00` | Primary accent — lime/acid green |
| `--red` | `#ff2d2d` | Danger accent |
| `--bg` | `#080808` | Page background |
| `--ink` | `#f1f0eb` | Body text |
| `--display` | Impact, Haettenschweiler | Headlines |
| `--sans` | Inter, system-ui | Body text |
| `--mono` | Courier New, ui-monospace | Labels, kickers |

The `--acid` color on dark background gives 9:1+ contrast (AA/AAA). The `.nordic` section uses a light background (`#efede6`) where `--acid` is replaced by `#485700` for eyebrows.

## Quick start

```bash
npm install
npm run dev   # http://localhost:3000/en/
npm run build # produces out/ (static export)
```

## File structure

```
app/
  layout.tsx                  Root layout (pass-through)
  page.tsx                    Redirect / → /en/
  globals.css                 Single CSS file
  [locale]/
    layout.tsx                Sets html lang + dir
    page.tsx                  OG meta + JSON-LD + SitePage
    privacy/
      page.tsx                Privacy policy page
  sitemap.ts                  Generates /sitemap.xml
components/
  SitePage.tsx                All page sections
content/
  locales.ts                  Locale data, siteUrl, isLocale
public/
  assets/
    og-hxi.jpg                1200×630 OG image (add manually)
    hero.jpg                  Full-bleed hero background (add manually)
    favicon.svg               Browser tab icon (add manually)
```

## Assets

Three images need to be added manually to `public/assets/` (not in git — too large):

- `og-hxi.jpg` — 1200×630, black bg, HXI branding with acid green stripe
- `hero.jpg` — Full-bleed hero background (Oslo fjord or studio, dark)
- `favicon.svg` — SVG favicon

## Locales

To add a locale:

1. Add to the `Locale` union in `content/locales.ts`
2. Add to `localeCodes` array
3. Add full entry to `localeData` (copy English, translate all strings)
4. Run `npm run build` to verify static params generate correctly

## Deployment

Vercel: root directory `hxi-v5/`, build command `npm run build`, output `out`.

```bash
git push origin claude/hxi-skrlag
# Vercel auto-deploys on push (once GitHub App access is granted)
```

## vs HXI-1 through HXI-4

| Aspect | HXI-1 to HXI-4 | HXI-5 |
|--------|----------------|-------|
| Framework | TanStack Start (Lovable) | Next.js 15 App Router |
| Styling | Tailwind CSS v4 | Vanilla CSS with tokens |
| Accent | Navy/Teal | Acid green `#c8ff00` |
| Display font | Barlow Condensed | Impact / Haettenschweiler |
| Routing | Single-locale | Multi-locale `/[locale]/` |
| Build | Bun/vinxi | Node/Next |
| RTL | No | Yes (Arabic) |
