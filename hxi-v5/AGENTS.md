# HXI-5 Agent Notes

**Stack:** Next.js 15 App Router · React 19 · TypeScript · CSS (no Tailwind)  
**Output:** Static export (`next build` → `out/`)  
**Routing:** `/[locale]/` — six locales: en, no, de, fr, es, ar  
**RTL:** Arabic (`ar`) — use logical CSS properties throughout

## Important constraints

- `output: 'export'` in `next.config.ts` — no server-side code at runtime
- `next/image` must use `unoptimized: true` (already set)
- No Supabase, no backend — this is a fully static site
- No `.env` with real credentials in git — use `.env.example` as reference

## Key files

| File | Purpose |
|------|---------|
| `content/locales.ts` | All locale data, site URL, `isLocale` guard |
| `components/SitePage.tsx` | Main page component (all sections) |
| `app/globals.css` | Single CSS file; all colour tokens in `:root` |
| `app/[locale]/layout.tsx` | Sets `html lang` + `dir` per locale |
| `app/[locale]/page.tsx` | OG metadata + JSON-LD + renders SitePage |
| `app/[locale]/privacy/page.tsx` | Privacy page |
| `public/assets/` | Static assets: og-hxi.jpg, favicon.svg, hero.jpg |

## Adding a locale

1. Add to the `Locale` union in `content/locales.ts`
2. Add to `localeCodes` array
3. Add full entry to `localeData` (copy `en`, translate all strings)
4. Add hero/OG assets if the locale needs different imagery

## Adding a section

1. Add CSS classes to `app/globals.css`
2. Add copy keys to `LocaleData` interface in `content/locales.ts`
3. Add translations for all six locales
4. Render in `components/SitePage.tsx`

## Assets (public/assets/)

- `og-hxi.jpg` — 1200×630, OG image
- `favicon.svg` — browser tab icon
- `hero.jpg` — hero background image (full-bleed, dark)
- These are NOT in the repo (large binary files) — add them manually

## Vercel deployment

Project: `hxi-v5` under BET-ART team  
Root directory: `hxi-v5/`  
Build command: `npm run build`  
Output directory: `out`  
Node version: 22
