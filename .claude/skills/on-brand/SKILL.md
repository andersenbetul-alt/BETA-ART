---
name: on-brand
description: Enforcement gate for QBLOGG's brand system — color tokens, typography scale, spacing, icons, and voice/content rules. Run this before delivering ANY generated content or UI (HTML/CSS snippet, new section, blog post, marketing copy, social/newsletter derivative) — even a "quick" one-off. Trigger on requests to write copy, build a page section, style a component, add a card/banner/CTA, or anything that touches color, font size, spacing, icons, or tone. Refuses off-brand patterns with a short stated reason instead of silently fixing or shipping them.
owner: QBLOGG
---

# on-brand

A pre-flight gate, not a style guide. The style guide is `docs/tasarim-sistemi.md`
(visual tokens) plus `docs/konsept.md` and `.claude/skills/qblogg-blog-yazisi/SKILL.md`
(voice) — read those for the reasoning and full prose. This file is the short
checklist you actually run against output before it ships. **`CLAUDE.md`
"Değişmez kurallar" is the source of truth; if anything here conflicts with it,
CLAUDE.md wins and this file is out of date.**

## When to run this

Any time you're about to hand over generated content or UI: a new HTML/CSS
section, a card or banner, marketing copy, a blog post or its derivatives, a
CTA, an email/newsletter block. Run it **before** presenting the output, not
after a complaint. If the request is Figma-to-code, run this in addition to
(not instead of) `docs/tasarim-sistemi.md`'s own translation checklist.

## The checklist

Go through every line below. For each hit, either fix it before delivering,
or — if fixing would mean guessing at something you can't verify (a brand
fact, a missing source, an ambiguous claim) — **refuse that specific piece**
with a one-line reason and ship the rest. Never ship a known violation
silently.

### 1. Color — no raw hex, no invented values
- [ ] Every color is a `var(--token)` from `assets/css/main.css`'s `:root` —
  never a literal hex/rgb in new CSS.
- [ ] No aqua (`--brand-2` / `#00D8C2`) used as text color on a light
  background. It's 1.9:1 — fails WCAG AA. Text use is `var(--brand-2-ink)`.
- [ ] No new color invented outside the existing token set. If the design
  genuinely needs one, that's a token-system change to flag to the user,
  not something to freehand.
- **Refuse with:** *"X kullanıyor ama bu bir belirteç değil / metinde aqua
  kontrastı 1,9:1 — `var(--brand-2-ink)` kullanmam gerekiyor, onaylıyor
  musunuz?"*

### 2. Typography — the eight-step scale only
- [ ] Font sizes come from `--fs-2xs` … `--fs-xl` (or `--fs-logo`), not raw
  `rem`/`px`. Exceptions that are allowed: heading `clamp()` values, and
  `em`-relative sizing (drop caps, `code`).
- [ ] No new font family introduced. Stack is `var(--font)` (Inter +
  system/CJK/Arabic/Devanagari fallbacks) — everything renders through it.

### 3. Spacing — the token set, not eyeballed numbers
- [ ] Radius is `var(--radius)` (16px) or `var(--radius-sm)` (10px) — not a
  freehand `border-radius`.
- [ ] Section width caps at `var(--maxw)` (1140px) via `.wrap`.
- [ ] Vertical section rhythm uses `.section`'s `clamp(56px, 8vw, 104px)`
  pattern, not a fixed padding pulled from nowhere.
- [ ] Touch targets are ≥44px (existing rule, e.g. `.share-btn`).

### 4. Icons — no emoji, ever
- [ ] Zero emoji in generated UI or content that renders as an icon. Every
  icon is inline SVG: 24×24 viewBox, `fill="none"`, `stroke="currentColor"`,
  `stroke-width="1.7"`, round cap/join. `currentColor` is what makes it
  survive theme switching — a hardcoded stroke color is a bug, not a style
  choice.
- [ ] Reusing an existing glyph: pull it from `app.js`'s `ICONS` registry by
  name, don't redraw it.
- **Refuse with:** *"İkon için emoji kullanamam — marka kuralı SVG. `ICONS`
  kaydında böyle bir ikon yoksa yeni SVG çizip ekleyeceğim, onaylıyor
  musunuz?"*

### 5. Direction — logical CSS properties only
- [ ] No physical direction property (`margin-left`, `left`, `padding-right`,
  `text-align: left`) in anything that isn't already scoped to always be
  LTR. Use the logical equivalents (`margin-inline-start`,
  `inset-inline-start`, `padding-inline-end`) so Arabic RTL doesn't break.
- [ ] If you added a visible section, you mentally (or actually) flipped it
  to `dir="rtl"` and it still reads correctly.

### 6. Text source — nothing hardcoded, nothing fabricated
- [ ] Visible copy goes through `data-i18n` / the i18n dictionary, not
  hardcoded Turkish/English in the HTML (HTML text is JS-off fallback only).
  A new key needs all ten languages, not just the ones you're focused on.
- [ ] No fabricated statistic, customer story, or institutional claim. If a
  number isn't sourced, it gets marked as an example/estimate, not stated as
  fact — this is a hard rule for money/career topics, not a style
  preference.
- [ ] Any price or metric mentioned is flagged as illustrative if it isn't
  independently verified in this session.
- **Refuse with:** *"Bu rakam/iddia kaynağı doğrulanmadan yazılamaz — örnek
  olarak işaretleyip yazdım / bu cümleyi çıkardım."*

### 7. Voice — one job, concrete over generic
- [ ] Copy does one job per piece (one keyword, one reader, one takeaway) —
  not three things stitched together. If a request wants three jobs, say so
  and propose splitting it rather than writing a muddled single piece.
- [ ] Leads with the payoff — no throat-clearing before the point.
- [ ] A specific, concrete example beats a pile of adjectives. Cut any
  sentence that can be cut without losing meaning.
- [ ] No confident/absolute promise language where the underlying fact is
  an estimate ("garanti," "kesin," "%100" — avoid unless it's literally
  contractual).

## How to refuse

Refusing means: state the specific rule, in one line, in the same reply as
the rest of the (otherwise-compliant) output — not a wall of caveats, not a
silent edit the user has to notice on their own. Pattern:

> *"[Ne istendi] için [şu kısmı] uygulamadım — [kural, tek cümle]. [Ne
> yaptım / ne öneriyorum] yerine geçti."*

Fix what you can fix without guessing (swap the hex for the token, swap the
emoji for an SVG). Only refuse the part that would require inventing a fact
or breaking a hard rule — don't block the whole deliverable over one line.

## Reference

- `docs/tasarim-sistemi.md` — full token tables, contrast ratios, the
  Figma-translation checklist, measured file/class counts.
- `docs/konsept.md` — "Uydurma yasağı," kaynak kuralı, rakamlar-örnek rule,
  in context of why the studio's whole pitch depends on them.
- `.claude/skills/qblogg-blog-yazisi/SKILL.md` — full voice/structure method
  for long-form content; this file only carries the parts that generalize
  to any piece of copy.
- `CLAUDE.md` "Değişmez kurallar" — wins on any conflict.
