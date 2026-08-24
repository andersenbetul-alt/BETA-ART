# Project Delivery Record — hximusic.com

The official HXI artist site, delivered as a complete, self-contained project.
This file is the register: every document, design and deliverable in the project,
named, with where it lives and what it is for. A reader who starts here can find
everything else.

Delivered 23 August 2026, at commit history head of branch `claude/hxi-site`.

## What is being delivered

A dependency-free static website in twelve languages (en, zh, es, hi, ar, fr, pt,
bn, ru, ur, no, tr), pre-rendered one directory per language, with its own build,
its own verification suite, a documented design system, an icon and mark system
generated from code, and a written record of every factual and brand decision.

Live at **hximusic.vercel.app**; wired for **hximusic.com** (DNS apex record
already resolving to the host — see "Handover steps" below).

## Document register

| ID | Name | File | What it holds |
| --- | --- | --- | --- |
| HXI-01 | Research Log | `docs/RESEARCH.md` | Every figure the site states, its source and check date; the poisoned sources that were rejected (the 850K-listener draft, the "180+ countries" claim, the false label credit) and why. |
| HXI-02 | Brand Guide | `docs/BRAND.md` | Voice and naming rules: "Norwegian, not Nordic"; origin is not reach; title casing; what Phonk Productions is; the H1 rationale; Norwegian klarspråk standard. |
| HXI-03 | Shop Strategy | `docs/SHOP.md` | The twelve-product catalogue, pricing research, Merchant-of-Record reasoning, EU VAT, the rule that fabric never sells without a size chart, and why every checkout ships empty until its link exists. |
| HXI-04 | AI Use Statement | `docs/AI-USE.md` | EU AI Act position (deployer, Articles 4 and 50), the labelling register for AI-generated assets, and the native-speaker review table for the twelve translations. |
| HXI-05 | Trademark Note | `docs/TRADEMARK.md` | Registration strategy for the HXI mark, Madrid Protocol notes. |
| HXI-06 | Business Note | `docs/BUSINESS.md` | Commercial context for the project. |
| HXI-07 | Deploy Handbook | `docs/DEPLOY.md` | The GitHub Pages pipeline the repo carries (`deploy.yml`, CNAME) and how it publishes `dist/`. |
| HXI-08 | Mailing List Note | `docs/MAILING-LIST.md` | The signup flow's design and its privacy posture. |
| HXI-09 | Mark Explorations | `docs/marks/` | The logo design work: three exploration concepts (`1-pivot`, `2-slip`, `3-apex` — the X mid-rotation, the letters as a motion diagram, the racing line through the apex) and the chosen v2 system (`v2-lockup`, `v2-icon`, `v2-icon-light`) with contact sheets. Vector, self-documenting, unused by any other artist. |
| HXI-10 | Delivery Record | `docs/DELIVERY.md` | This file. |

## Code deliverables

| ID | Name | Where | What it is |
| --- | --- | --- | --- |
| HXI-11 | The Site | `index.html`, `privacy.html`, `404.html`, `assets/` | The pages, the stylesheet (tokened: 4px spacing scale, colour tokens, rem type, RTL, script-aware display leading), and the client JS (i18n, figures, facades, store). |
| HXI-12 | Language Corpus | `assets/js/i18n.js` | Twelve dictionaries × 262 keys — the entire site in every language, one file. |
| HXI-13 | Figures | `assets/data/figures.json` | The numbers the site states, each with source and check date. Edit here and nowhere else. |
| HXI-14 | Build | `scripts/build.mjs` | Pre-renders 26 pages + sitemap, deterministically: two runs are byte-identical. |
| HXI-15 | Verification Suite | `scripts/check.mjs` | Fails the build on: a missing translation key, a dead link, a missing asset, a colour or spacing off the token scale, a broken FAQ pairing, a figure drifting from its source, or the word "Nordic" used non-regionally — the guard was proven by deliberately breaking each rule. |
| HXI-16 | Icon Generator | `scripts/icons.mjs` | Draws the ◈ mark into favicon.svg/.ico, the iOS icon, PWA icons and the manifest — dependency-free (the rasteriser is a distance test, the PNG writer is node:zlib), reproducible byte-for-byte. |
| HXI-17 | Share Card | `scripts/og-image.html` + `scripts/og.mjs` | The Open Graph card as text, typeset in the site's own Barlow Condensed, so `check.mjs` can read it — the retired "Nordic Phonk" tagline survived on the old PNG precisely because nothing could. |
| HXI-18 | CI | `.github/workflows/ci.yml` | Runs check + build on every push; green in ~12 seconds. |

## Verified state at delivery

- `npm run check` — 12 languages × 262 keys, links and assets resolve
- `npm run build` — 26 pages; deterministic (byte-identical across runs)
- Horizontal overflow — 12 languages × 18 viewport widths, menu open and closed: 216 combinations, none overflow
- axe-core — 12 languages × 3 viewports, 0 WCAG 2.0/2.1 A+AA violations
- Lighthouse — performance 95, accessibility 100, best practices 100, SEO 100
- Third-party requests on page load — zero, in all twelve languages
- Structured data — 39 JSON-LD blocks across 27 pages, all parse; FAQPage in every language

## Handover steps (the two clicks that remain)

1. **Attach the domain**: Vercel → project `hximusic` → Settings → Domains →
   add `hximusic.com`. The DNS apex record already resolves to the host; this is
   the click that puts the site on its own address.
2. Optional tidy-up: add the `www` CNAME at the registrar
   (`cname.vercel-dns.com`, trailing dot if the panel insists), and delete the
   leftover clock-app branch on GitHub.

To update the site afterwards: commit to `claude/hxi-site`, then redeploy the
Vercel project (a 3-second build that clones this branch and runs its own
`npm run build`). Updates are deliberately not automatic.

## Supplied by the artist, not by code

Store checkout links, the size chart for fabric, product images, the Phonk
Productions mark file, Spotify API credentials for the daily sync, a fresh
monthly-listener figure, and native-speaker sign-off per language (tracked in
HXI-04).

---

This project is a gift. It was built for its owner and is to be handed over by
24 February 2027.

**Gratulerer med dagen, Christoffer.**
