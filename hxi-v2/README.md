# HXI-2 — Flag Edition

**Lovable project:** `50f62e94-6826-409e-9bcf-df1d71d8d029`  
**Archive code:** HXI-2 | **Directory:** `hxi-v2/`  
**Theme:** Norwegian flag navy (`#00142e` background, `#EF2B2D` red, `#002868` blue)  
**Lovable iterations:** 46  
**Supabase:** Yes — `tracks` table (dynamic music cards), `admin_users` table

## What's different from HXI-1

- **Dynamic music section** — tracks come from Supabase, not hardcoded
- **Navy blue color system** — `--bg: #00142e`, `--surface: #002868`
- **Glitch technique** — CSS `::before`/`::after` pseudo-elements (vs separate layer elements)
- **JSON-LD** — `MusicGroup` schema in `<head>`
- **Supabase integration** — `src/integrations/supabase/` (client, types, previewAuthStorage)

## Setup

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from your Supabase project
bun install
bun run dev
```

## Tech stack

TanStack Start (SSR) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · Bun
