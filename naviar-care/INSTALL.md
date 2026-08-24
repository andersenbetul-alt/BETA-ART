# Moving the identity into `naviar-care-1`

Three files and one edit. Everything here typechecks and builds against
Next.js 16 + React 19 + Tailwind v4 — the same stack the product runs.

## 1. The mark component

```bash
cp components/naviar-mark.tsx <naviar-care-1>/components/naviar-mark.tsx
```

Paints with `currentColor`, so it inherits whatever the surrounding element
sets and keeps following the theme tokens.

## 2. The warm accent tokens

Add the three values from `app/globals.css.patch` inside the existing `:root`
block in `app/globals.css`, next to `--accent`. Nothing else in the file
changes.

The product's own accents (`#c8e8ee`, `#d0eacf`) are too pale to carry a mark —
on the `#faf7ee` ground they disappear at 26 px, taking the cradle's figure with
them. That is the reason these exist.

## 3. Replace the placeholder icon in the header

The header currently renders Lucide's stock `heart-handshake`. In
`app/page.tsx`, find:

```tsx
<span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
  <HeartHandshake className="size-[21px]" />
</span>
```

Replace the icon with:

```tsx
<span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
  <NaviarMark className="size-[21px]" />
</span>
```

and swap the import:

```diff
- import { HeartHandshake } from "lucide-react";
+ import { NaviarMark } from "@/components/naviar-mark";
```

Inside that tile the mark is monochrome, which is correct at 21 px — two
colours do not resolve that small. Pass `accent="var(--accent-warm)"` only
where it is drawn larger.

## 4. The brand page

```bash
mkdir -p <naviar-care-1>/app/brand
cp app/brand/page.tsx <naviar-care-1>/app/brand/page.tsx
```

Serves at `/brand`: the four directions, size proofs at 32/20/16 px, the
palette, and the usage rules — written in Norwegian to match the rest of the
site, and styled entirely from the product's tokens, so it inherits any future
palette change instead of drifting from it.

## Afterwards

- Every file referenced here lives in this same folder. Copying the whole
  folder into the product repo brings the artwork across with the code.
- Two Vercel projects pointed at this repo. `naviar-care` — the standalone
  static identity page — has been paused; delete it from the Vercel dashboard
  under Settings → Delete Project so only `naviar-care-1` remains.
