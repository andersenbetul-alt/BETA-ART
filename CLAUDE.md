# HXI website — working notes

Official artist site for HXI (Christoffer Andersen), Norwegian phonk producer.
Static HTML/CSS/JS, no build step, no dependencies. Open `index.html` to run it.

This is an ongoing project, not a one-off: expect new releases, sections and
languages to land over time. Keep it dependency-free — that is the point of the
setup, and it is what lets the site be deployed by dragging a folder anywhere.

## Layout

| Path | What lives there |
| --- | --- |
| `index.html` | The whole page. Sections in order: hero, credits strip, latest, music, videos, NCS, about, collab, store, newsletter + community, press, booking. |
| `assets/css/style.css` | All styling. Design tokens at the top of `:root`. |
| `assets/js/shop.js` | The store catalogue. One object per product; empty `checkout` renders as "coming soon". |
| `assets/js/i18n.js` | `HXI_LANGS` (switcher order) and `HXI_I18N` (one dictionary per language). |
| `assets/js/app.js` | Language switching, mobile nav, YouTube facades, scroll reveal, signup. |
| `scripts/check.mjs` | Project checks. Run before every commit. |
| `scripts/serve.mjs` | Local server: `npm run dev` → http://localhost:8000 |

## Before you commit

```bash
npm run check
```

It fails on: a `data-i18n` key missing from any dictionary, a dictionary key nothing
uses, an anchor pointing at a section that does not exist, a referenced file that is
not in the repo, a missing `hreflang`, an RTL language absent from the RTL map, or JS
that does not parse. It also prints notes (values identical to English, unstyled
classes) — those are hints, not failures.

## Conventions

**Scope.** This is an artist page: music, story, collaboration, contact, and a store for the
artist's own products. It is not a **licensing** storefront — B2B sync price tiers were
deliberately removed and must not come back. Merch and digital packs are a different thing
and are in scope; see `docs/SHOP.md`.

**Translations.** Every visible string goes through `data-i18n` and must exist in all
twelve dictionaries. Missing keys fall back to English at runtime, but `npm run check`
treats them as failures — fill them in. What stays untranslated on purpose: track and
release titles, artist names, emails, figures, and legal instrument names (TONO, GRAMO,
NCB, Berne, DMCA).

**Adding a language.** Copy the `en` block in `i18n.js`, translate every value, add
`{ code, flag, label }` to `HXI_LANGS`, add a `<link rel="alternate" hreflang="…">` in
`<head>`, and if it reads right-to-left add it to `RTL` in `app.js`. Then run the checks.

**Adding a section.** Give the `<section>` an id, alternate `class="section"` and
`class="section alt"` with its neighbours so the light/dark banding stays regular, and
add the nav link only if the section is a destination people look for.

**Styling.** Take colours and spacing from the tokens in `:root`; do not hardcode hex
values in component rules. Nothing below 10px. Data cells that hold Latin names or
figures need `unicode-bidi: plaintext` so they survive Arabic and Urdu.

**The mailing list.** `SIGNUP_ENDPOINT` in `app.js` is empty, so the form falls back to the
visitor's mail client and says so. `docs/MAILING-LIST.md` covers why the list matters more
than the stream button, what to pick when it goes live, and why the note under the form no
longer claims GDPR compliance.

**Third-party embeds.** YouTube loads only after a click, through
`youtube-nocookie.com`. Keep it that way — the page tells visitors it is GDPR
compliant, and a click-to-load facade is what makes that true. Same rule for anything
new: no third-party request before the visitor asks for it.

## Brand

`docs/BRAND.md` is the standard: what HXI is, who the page speaks to, the voice rules, the
claims allowed, the names and their casing, and the palette. Check copy against it before
writing, and when it does not cover something, add the rule rather than inventing one.

## Facts and sources

`docs/BRAND.md` carries HXI's own six PR principles — no unfalsifiable absolutes, fact before
adjective, no promise about the future, no rights claim without a confirmed basis, credits in
the right category. Copy changes go through those five questions before they ship.

`docs/RESEARCH.md` is the trail behind every claim on the page: what was verified, against
what, and when — plus the claims that are still unconfirmed and the releases not yet added.
Check it before changing a number or a credit, and add to it in the same commit. Anything
the page states as fact should have a line in there; anything that does not is either
unverified or waiting to be checked.

## Content that goes stale

`scripts/sync-spotify.mjs` keeps the release archive current on its own once the two Spotify
secrets are set — every release, its date and its credits, daily.

The stream count and the monthly-listener count are not in Spotify's API at all. They come
off Spotify for Artists once a month:

```bash
npm run figures -- --streams 43500000 --listeners 252400
```

That is the entire update. It writes `assets/data/figures.json`, stamps the date it was
checked, and rewrites the fallback text in `index.html`; everything else follows from that one
file, in each language's own number formatting. `npm run check` fails if anything drifts and
prints a reminder once a figure is sixty days old. Never type either figure into the markup or
a dictionary — the dictionaries carry `{n}`.


Current figures: 43,394,947 streams on "help urself" and 251,000 monthly listeners, both in
`assets/data/figures.json`. The latest release is MONTAGEM HYSTERIA (June 2026), which is
still hand-written in the Latest section — that section is the one thing here with no source
behind it, so it is the one that dates fastest.

## Deployment

`docs/DEPLOY.md` has the domain steps for both hosts, the DNS records, and what to
check once it is live.

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`,
but only after `npm run check` passes. Any other static host works too — Netlify
drop, Vercel, plain FTP — since there is nothing to build. The `og:` tags,
`sitemap.xml` and `hreflang` links all point at `https://hximusic.com`.

The "Latest" section is the one that dates fastest: when a release lands, add a card
there and update `music_mh_*` if it becomes the newest release.
