# Navbar Design Audit — BETA ART / Cobban

Audited with the `apple-design` skill against HIG-derived principles.
Subject: `src/index.html` + `src/styles.css` (first-pass implementation).
Measurements taken from a real Chromium render at 1280×800 and 390×844.
Contrast ratios computed by WCAG relative-luminance formula.

**Verdict: Critical Issues.** The mobile navigation is non-functional, and
two accessibility minimums are missed. The desktop layout is sound in
structure but has no spacing system and weak hierarchy.

---

## 0. Critical — the mobile menu cannot be opened

Not a design nit; the feature is broken. `.nav-links.open` is the rule that
reveals the menu, and **nothing ever adds that class** — there is no
JavaScript in the project at all (`0` script tags, `0` `.js` files). Below the
700px breakpoint `.nav-links` is `display:none` and the toggle is inert.

**Effect:** on any phone, the site has no navigation whatsoever.
**Fix:** add the click handler, and wire `aria-expanded` to it.

Related: `<button class="nav-toggle">` has `aria-label` but no
`aria-expanded` / `aria-controls`; `<nav>` has no accessible name; the current
page link has no `aria-current="page"`. Screen-reader users get no state.

Also caught in the render: the page heading reads **"Work"** while the active
nav item is **"Home"**. The active state is lying about location.

---

## 1. Spacing

**No spacing scale.** Measured values in use: `2, 8, 10, 12, 14, 20, 22, 40`px.
These sit on no grid — 14 and 22 and 10 break any 4- or 8-point rhythm.

> **Guideline — Layout > Visual hierarchy**: "Align components with one another
> to make them easier to scan and to communicate organization and hierarchy."

*Why it matters:* arbitrary values compound. Every new component invents its
own numbers, and the page slowly loses the alignment that makes it scannable.

**Hit targets are under minimum.**

| Element | Measured | Required | Status |
| ------- | -------- | -------- | ------ |
| Nav link (desktop) | 41 × **20** px | 28×28 rec. / 20×20 min. | At absolute floor |
| Hamburger (mobile) | **22 × 18** px | 44×44 rec. / 28×28 min. | **Fails minimum** |
| Mobile menu row | ~36 px tall | 44 | Fails |

The nav links get `padding: 2px 0` — almost no vertical target. The 20px height
is the text box itself, sitting exactly on the documented floor.

> **Guideline — Accessibility**: minimum target 44×44pt mobile, 28×28pt desktop.
> "Consider spacing between controls as important as size."

*Why it matters:* a 22×18px tap target on a phone is a miss-rate problem, and
it is the *only* control on the screen.

**Fix:** adopt a 4px scale (4/8/12/16/24/32/40). Give links
`padding: 12px 8px` and a `min-height`. Size the toggle 44×44 with the bars
drawn inside it.

---

## 2. Hierarchy

**The brand and its subtitle are typographically identical.** `.brand` and
`.brand-sub` are both `19px / 700 / letter-spacing 1px`. The *only* thing
separating "BETA ART" from "COBBAN" is colour — `#111` vs `#999`.

> **Guideline — Accessibility**: don't rely on colour alone to convey
> information.

And `#999` on white is **2.85:1** — it fails contrast, so the one signal
carrying the distinction is also the weakest one.

**Chrome competes with content.** The `h1` renders at 30px against a 19px
brand — a ratio of only **1.58**. The page title barely outranks the site
furniture.

**The header/content boundary is nearly invisible.** `border-bottom: 1px solid
#eee` computes to **1.16:1** against white.

> **Guideline — Layout**: "Differentiate controls from content."

*Why it matters:* this is a sticky header over scrolling artwork. When a pale
image scrolls beneath a 1.16:1 divider and an 85%-opacity background, the
control layer visually dissolves into the work.

**Fix:** drop `.brand-sub` to a lighter weight and smaller size so hierarchy
survives in greyscale; raise `h1` to ~40px; strengthen the divider or rely on
a scroll-edge shadow that appears only once scrolled.

---

## 3. Typography

**Every size is hard-coded px.** `19px`, `13px`, `30px`, `16px`. None respond
to the reader's browser font-size setting.

> **Guideline — Typography > Supporting scalable text**: "Make sure your app's
> layout adapts to all font sizes."

*Why it matters:* a reader who has set a larger default text size gets no
change at all. This is the single most common accessibility failure in
hand-rolled CSS, and it is invisible to anyone not relying on it.

**Body text fails contrast.** Nav links are `#777` on white = **4.48:1**,
against a 4.5:1 requirement for text under 18pt. It misses by 0.02.

| Colour | Ratio | 4.5:1? |
| ------ | ----- | ------ |
| `#777` nav links | 4.48 | **Fail** |
| `#999` brand-sub | 2.85 | **Fail** |
| `#333` body | 12.63 | Pass |
| `#111` active | 18.88 | Pass |

Smallest fix: `#767676` → 4.54:1. Better: `#666` → 5.74:1.

**All-caps everywhere.** Both brand and nav links are `text-transform:
uppercase`. Uppercase destroys word-shape recognition, which is what makes
short labels scannable at a glance — and it is applied here at 13px, the
smallest text on the page.

**No system font stack.** `Helvetica, Arial, sans-serif` forgoes the platform
font, its optical sizing, and its automatic weight matching.

**No explicit leading.** `line-height` is `normal` everywhere.

**Fix:** move to `rem`; `font-family: system-ui, -apple-system, sans-serif`;
sentence case for nav labels; set `line-height` explicitly.

---

## 4. Motion

**Both durations are roughly 2× too slow.**

| Animation | Current | Should be |
| --------- | ------- | --------- |
| Link hover colour | `0.4s ease-in-out` | 150–200ms `ease-out` |
| Menu `slideDown` | `0.5s ease-in-out` | 200–250ms `ease-out` |

> **Guideline — Motion**: "In apps, generally avoid adding motion to UI
> interactions that occur frequently." … "Aim for brevity and precision."

*Why it matters:* hover is the highest-frequency interaction on the page. At
400ms the colour is still travelling after the pointer has moved on, which
reads as lag rather than polish. `ease-in-out` compounds it — the slow start
delays the moment feedback becomes visible.

**No `prefers-reduced-motion` support.** Zero occurrences in the stylesheet.

> **Guideline — Accessibility**: "When [Reduce Motion] is active, ensure your
> app responds by reducing automatic and repetitive animations."

*Why it matters:* this is a documented accessibility requirement, and for
users with vestibular sensitivity a sliding overlay is exactly the trigger
case. It is a three-line fix.

**The animation is asymmetric and uncancellable.** `slideDown` plays on open;
closing has no animation, so the menu vanishes. And because the keyframe is
bound to a `display` switch it cannot be interrupted mid-flight.

> **Guideline — Motion**: "Let people cancel motion."

**Fix:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Positive notes

- Semantic `<header>` / `<nav>` / `<ul>` structure — correct landmarks.
- The active link uses a border *in addition to* colour; that redundancy is
  right, and is what `.brand-sub` should have done.
- Sticky header with `backdrop-filter` is the appropriate treatment for a
  control layer over content.
- Content is capped at 1100px, which keeps line lengths sane.

## Fix order

1. Wire up the mobile menu — it is broken (§0)
2. `prefers-reduced-motion` + contrast fixes — accessibility floors (§3, §4)
3. Hit-target sizing (§1)
4. `rem` units and the type scale (§3)
5. Motion durations (§4)
6. Spacing scale and hierarchy polish (§1, §2)

## Note on scope

`apple-design` is written for app UI. Its typography, colour, accessibility,
and motion guidance transfers cleanly to the web and is what this audit rests
on. Its platform conventions — tab bars, navigation stacks, safe areas — do
not apply to a web navbar and were not used.

---

# Resolution — 2026-08-21

All findings above are fixed. Re-verified by the same method: Chromium
render at 1280×800 and 390×844, real interaction, WCAG maths.

| § | Finding | Before | After |
| - | ------- | ------ | ----- |
| 0 | Mobile menu unopenable | no JS, `display:none` forever | `src/nav.js` toggles it; verified `none`→`flex` on click |
| 0 | No ARIA state | `aria-label` only | `aria-expanded` flips false→true→false; `aria-controls`, `aria-current`, `<nav aria-label>` |
| 0 | Active item wrong | "Home" active on the Work page | `Work` active, `aria-current="page"` |
| 1 | No spacing scale | 2/8/10/12/14/20/22/40px | 4px scale as custom properties |
| 1 | Hamburger 22×18 | below 28×28 minimum | **44×44** |
| 1 | Nav link 41×20 | at the absolute floor | **65×44** |
| 2 | Brand = subtitle | both 19px/700, colour-only difference | 20px/700 vs 16px/400 — survives greyscale |
| 2 | `h1` only 1.58× brand | 30px vs 19px | 39px vs 20px (**1.95×**) |
| 2 | Divider 1.16:1 | `#eee` | `#8f8f8f` = **3.23:1** |
| 3 | Hard-coded px | ignored user font size | `rem` throughout, Major Third scale |
| 3 | `#777` = 4.48:1 | failed AA | `#666` = **5.74:1** |
| 3 | `#999` = 2.85:1 | failed AA | `#666` = **5.74:1** |
| 3 | All-caps at 13px | poor word-shape recognition | sentence case |
| 3 | No system font | `Helvetica, Arial` | `system-ui` stack |
| 4 | 400ms hover | too slow, frequent interaction | **150ms** |
| 4 | 500ms menu | too slow | **220ms** |
| 4 | No reduced-motion | absent | honoured — measured `1e-05s` under `reducedMotion:'reduce'` |

Added beyond the findings: `:focus-visible` rings (there were none), and
Escape closes the menu and returns focus to the toggle.

**Verified output**

```
DESKTOP  link 65.3×44, nav 14px, h1 39.056px, brand 20px, sub 16px/400
MOBILE   toggle 44×44, display none→flex, aria-expanded false→true,
         row 44px, Escape → none / false
REDUCED  display flex, animation-duration 1e-05s
```

Contrast, all on white: `#666` 5.74:1 · `#333` 12.63:1 · `#111` 18.88:1 ·
`#8f8f8f` 3.23:1 (non-text, needs 3:1). All pass.
