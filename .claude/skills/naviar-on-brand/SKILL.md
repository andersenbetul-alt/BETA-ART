---
name: naviar-on-brand
description: Enforces NAVIAR's brand system — color tokens, logo/lockup usage, clear space, minimum sizes, and forbidden effects — on any content, marketing copy, deck, social graphic, or UI generated for NAVIAR. Refuses or flags off-brand patterns with a short, cited reason before delivering output. Trigger this whenever NAVIAR is named, NAVIAR colors/logo/descriptor assets are referenced, or the user asks to design/write/mock up anything under the NAVIAR name — even if they don't say "brand," "on-brand," or "style guide" explicitly. Also trigger when asked to check, review, or audit existing NAVIAR content for brand compliance.
---

# NAVIAR brand enforcement

Source of truth: `brand/naviar/README.md` (measured, generated identity system)
and `docs/naviar/NAVIAR-LOGO-KARAR.md` (acceptance decisions and open items).
Every number below was measured from the generator (`brand/naviar/build.py`),
not written from memory — if either source file changes, re-read it before
trusting this skill's tables.

## What's actually ratified — and what isn't

The request that created this skill asked for color, typography, spacing,
and voice enforcement. Three of those are solid. One isn't. Don't paper
over the gap — a skill that invents a "NAVIAR voice" that was never decided
is worse than one that says "not decided yet."

| Dimension | Status | Enforce how |
|---|---|---|
| Color tokens | **Ratified, measured** | Strictly — see below |
| Logo/lockup usage, clear space, min sizes | **Ratified, measured** | Strictly — see below |
| Typography | **Partial** — only the wordmark/descriptor font stack is set; no general body/UI type scale exists | Enforce the font stack where it applies; say so, don't invent a scale, when asked about body copy sizing |
| Spacing | **Partial** — clear space around the mark is defined; no general layout grid exists | Enforce clear space; don't invent a grid system |
| Voice/tone | **Not ratified** — five competing taglines are still open (`NAVIAR-LOGO-KARAR.md` §6 item 7) | Never assert one as "the" NAVIAR voice — see Voice section |

## Color tokens (enforce strictly)

| Role | Name | Hex | Rule |
|---|---|---|---|
| Primary | Midnight Navy | `#0A1628` | Default ink on light backgrounds |
| Accent | Premium Gold | `#D4AF37` | **Structural accent only** — see contrast rule below |
| Neutral | Off White | `#F5F6F8` | Default ink on dark backgrounds |
| Neutral | Graphite | `#1E1E1E` | Secondary dark neutral |
| Data/UI only | Accent Cyan | `#00B2E3` | **Never in the master mark.** Fine for dashboards/data-viz *outside* identity assets. |

**The gold-contrast rule — the single most common violation to catch:**
`#D4AF37` on white measures 2.10:1, which fails WCAG AA (4.5:1) by a wide
margin. That means gold **cannot be body text, a CTA label, or any
information-carrying graphic on a light background** — headline text,
button labels, chart data, anything someone needs to read. It stays a
structural accent (the monogram's diagonal, a rule line, a small mark) at
roughly 12–16% of a design's visible area, mirroring the measured ratio in
the monogram itself.

Descriptors and any sub-brand label: navy on light backgrounds, off-white
on dark. Never gold, on either.

## Logo, lockup, and mark usage (enforce strictly)

- **Clear space:** ≥ 0.30× the wordmark's cap height around a full lockup;
  ≥ 1 ribbon-width around the monogram alone.
- **Minimum size:** wordmark 96px / 24mm; full lockup 160px / 35mm. Below
  that, the wordmark stops being legible by the system's own testing —
  don't shrink past it "just this once."
- **Forbidden outright, no exceptions:** gradients, bevels, drop shadows,
  glow, metal texture, 3D extrusion, redrawing the wordmark's letterforms,
  a country-specific variant, flipping/mirroring/rotating the mark.
- **Tagline:** never permanently embedded in the master lockup — it sits
  outside it, if used at all (see Voice section for why "if" is doing work
  there).

## Descriptor system (sub-brand labels)

Approved descriptors today: `CONSULTING`, `AI`, `PLATFORM`,
`RESEARCH INSTITUTE`, `ACADEMY`, `LABS`. Each renders at 24–30% of the
NAVIAR wordmark's cap height (measured: 27%), same color rule as above.

**`CARE` is not an approved descriptor.** Its file is literally named
`naviar-care-PENDING-APPROVAL.svg` — it's pending business approval and a
separate trademark clearance (`docs/naviar/NAVIAR-LOGO-KARAR.md` P9). If a
request wants NAVIAR CARE branding treated as finished and ready to ship,
say so plainly: the mark exists as a design draft, not an approved asset.
Don't quietly treat it as equivalent to the six approved descriptors.

## Typography — what's defined, what isn't

Defined: the wordmark and descriptor text use `Poppins → Century Gothic →
Futura → Helvetica Neue → Arial → sans-serif`, descriptor weight 500.
That's it — there's no ratified heading/body type scale, no defined line
height or tracking system for general content. If a task needs body copy
sizing for a NAVIAR deck or page, use the font stack above for consistency,
but tell the user there's no established scale to check against rather
than inventing round numbers and presenting them as "the" NAVIAR type
system.

## Voice — not ratified, don't invent one

Five taglines are in circulation with no decision made: *"Intelligence.
Strategy. Impact."* / *"Clarity in complex systems."* / *"Insight.
Strategy. Impact."* / *"Organizational Intelligence Systems."* / (from the
CARE line) *"İnsanların ihtiyaç duyduğu anda, doğru kişiye, doğru bilgiye
ve güvenilir hizmete ulaşmasını sağlayan bir yaşam ve hizmet ekosistemi."*
`NAVIAR-LOGO-KARAR.md` records this explicitly as open — "Karar hâlâ
verilmedi" (still not decided).

So: if a task asks for NAVIAR marketing copy, you can write in a register
consistent with the taglines already in circulation (measured, confident,
enterprise-facing for the core brand; warmer and trust-focused for CARE) —
but never present a specific tagline, or a specific "tone of voice," as
NAVIAR's official, decided voice. If the user needs one settled, point them
at `NAVIAR-LOGO-KARAR.md` §6 item 7 and ask them to pick, rather than
picking for them and calling it brand-compliant.

## How to flag a violation

Keep it short and cite the rule — the goal is a fast correction, not a
lecture:

> 🚫 Off-brand: gold text on white background (`#D4AF37` on `#F5F6F8`,
> 2.10:1 contrast — fails WCAG AA). Use `#0A1628` navy instead; gold stays
> a structural accent.

For a request that can't be satisfied as brand-compliant at all (e.g. "put
a drop shadow on the wordmark"), say so directly and offer the compliant
alternative instead of silently complying or silently substituting without
explanation.

## Known open items — flag proactively when relevant

Don't silently "fix" these — they're pending real decisions, not bugs:

1. **Diagonal angle deviation.** The monogram's N-diagonal measures 29.9°
   from vertical against a 38–42° spec target; this was a deliberate,
   documented trade-off (footprint and ribbon width held constant per the
   spec's own numbers), and the source doc's Stop Condition marks it
   "awaiting user approval." If a task touches the monogram geometry
   itself, don't silently correct the angle — flag that it's an open
   decision.
2. **Descriptor text isn't outlined.** Descriptors currently render as live
   `<text>` elements, not converted to outline paths. Fine for on-screen
   use; flag it if the task is production/print-ready export, where text
   should be outlined first.
3. **CARE's business approval and trademark clearance are both open** —
   see the descriptor section above.

## Self-check before delivering any NAVIAR output

Run this quickly before showing the result, the same way `docs/tasarim-
sistemi.md` does for QBLOGG:

1. Every color a token from the table above — no ad-hoc hex values?
2. Gold never used as text or an information-carrying element on light
   backgrounds?
3. None of the forbidden effects (gradient/bevel/shadow/glow/metal/3D)
   present?
4. Clear space and minimum size both respected?
5. If a descriptor is shown, is it one of the six approved ones — and if
   CARE appears, is it labeled as pending, not finished?
6. Wordmark geometry untouched — not redrawn, flipped, mirrored, or
   rotated?
7. No specific tagline or "brand voice" presented as official/decided?

If any answer is no, fix it or flag it before delivering — don't ship an
off-brand result and mention the problem afterward.
