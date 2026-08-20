# NAVIAR

**Clarity in complex systems.**

Pilot website for **NAVIAR CONSULT AS** — an independent advisory service that helps
people understand, organise and follow up their cases with public authorities in
Norway (NAV, the municipality, Skatteetaten/Altinn, Helfo, pensions).

> NAVIAR er en uavhengig virksomhet og er ikke en del av NAV eller offentlig forvaltning.

This repository covers **Phase 0/1** of the system blueprint: the one-page sales
site, the need finder, the booking flow, the price catalogue and a small API for
bookings, payments and enquiries. It is not the case-management platform — see
[Not built yet](#not-built-yet).

---

## What is here

| Path | What it is |
| --- | --- |
| `index.html` | The whole public site. No build step. |
| `assets/css/styles.css` | One stylesheet. Design tokens at the top. |
| `assets/js/config.js` | **Start here.** Company details, languages, price catalogue, booking hours, API URL. |
| `assets/js/i18n.js` | Loads `assets/i18n/<code>.json` and applies it to the DOM. |
| `assets/js/app.js` | Renders every repeated block; runs the need finder and the contact form. |
| `assets/js/booking.js` | The four-step booking flow. |
| `assets/i18n/*.json` | 10 languages, identical key sets. |
| `server/` | Optional Node API: bookings, Stripe Checkout, enquiries, need-finder tally. |

## Run it locally

The site loads its translations with `fetch`, so it must be served over HTTP —
opening `index.html` straight from the filesystem shows a warning bar instead of the page.

```bash
python3 -m http.server 8099        # then open http://localhost:8099
```

Optional API:

```bash
cd server
cp .env.example .env               # fill in the values you need
npm install
npm start                          # http://127.0.0.1:8787
```

Then set `apiBase: 'http://127.0.0.1:8787'` in `assets/js/config.js`.

## Deploy

The site is static — GitHub Pages, Netlify, Vercel or any web host serves it as is.
The API needs a Node 20+ host (Render, Railway, Fly, a VPS). Point `ALLOWED_ORIGINS`
at the site's real origin and `PUBLIC_SITE_URL` back at the site.

---

## Configuring the business

Everything a non-developer needs to change lives in `assets/js/config.js`.

**Before launch, replace the placeholders:** `orgNumber`, `email`, `phone`,
`phoneHref`, `address`. They currently hold obvious dummy values.

### Prices

Prices come from the pilot catalogue in the system blueprint (§12.1). `price` is the
**customer total including 25% MVA** — a consumer interface must always show the final
total — and `net` is the ex-MVA fee the 20% platform commission is calculated from.

| Code | Service | Customer total | Delivery |
| --- | --- | --- | --- |
| — | Gratis forhåndssamtale | 0 | 15 min |
| K01 | Brev forklart | 800 NOK | 24–48 t |
| K02 | Klar konsultasjon | 1 500 NOK | 45 min |
| H01 | Søknad sammen | 3 000 NOK | 2–4 d |
| O01 | Saksoppfølging | 4 500 NOK | 30 d |
| S01 | Senior/ekspert | 1 500 NOK | per time |
| T30 | Tolk 30 min | 800 NOK | 30 min |
| T60 | Tolk 60 min | 1 250 NOK | 60 min |
| TF | Fremmøtetolk | Etter tilbud | — |

Express (+25%) is offered in the booking flow and shown before purchase, never added
afterwards. The MVA assumption, the MVA status of each advisor and the invoicing model
still need an accountant's confirmation.

### Payments

`server/` creates a **Stripe Checkout** session for card payments, so NAVIAR never
touches card data and never holds the money itself. Vipps appears in the config and the
UI copy but is **deliberately not implemented** — the server downgrades a Vipps request
to invoice. Turn it on only after the merchant agreement and the payment-provider
review are done.

Amounts are always recomputed on the server from the catalogue; a tampered price in the
browser is ignored.

## Languages

Ten languages ship: Norwegian (default), English, Turkish, Arabic (RTL), Polish,
Ukrainian, Russian, Somali, Lithuanian, Tigrinya. The selection follows Norway's largest
immigrant groups (SSB, start of 2025: Poland ~111 000, Ukraine ~80 000, Lithuania
~43 000, Syria ~40 700, Somalia ~27 600).

Language is chosen by `?lang=xx` → previous choice → browser language → Norwegian.

**Adding a language:** copy `assets/i18n/en.json`, translate the values, save it as
`<code>.json`, and add an entry to `languages` in `config.js`. Nothing else changes.

Check key parity across locales with `tools/check-i18n.js`:

```bash
node tools/check-i18n.js
```

> **The translations have not been reviewed by native speakers.** They were drafted for
> this pilot. Before launch, have each language checked by a native speaker — especially
> the safety rules and the BankID wording, where a mistranslation could cause real harm.

## Brand

Header and footer carry the master lockup from the identity spec: the **NAVIAR**
wordmark with the `CONSULTING` descriptor at 27% of cap height, and the two-tone N
monogram as inline SVG — one closed main path plus one closed gold path, 1000×1000
grid, 760×800 live footprint, 150-unit ribbons, 39.4° diagonal, gold accent 12.8% of
visible area. Flat: no bevel, glow, shadow or metal anywhere in the mark. The tagline
sits outside the lockup, and only one tagline appears per page.

Palette: Midnight Navy `#0A1628`, Premium Gold `#D4AF37`, Off White `#F5F6F8`,
Graphite `#1E1E1E`. Accent Cyan `#00B2E3` is reserved for data UI and never enters the
mark.

The wordmark here is set in Poppins with the specified tracking, which the spec allows
only as a *construction reference*. When the Figma production system delivers the
outlined vector master, drop it in as an SVG and replace `.brand-word`.

## Not built yet

The blueprint describes considerably more than a website. Still missing:

- Customer portal: case status, tasks, deadlines, secure messaging
- **Secure document upload** — the site promises a secure link after booking; that link
  does not exist yet. Do not launch the promise before the storage does.
- Consent/fullmakt registry with scope, duration and withdrawal
- Marketplace: advisor onboarding, KYC/KYB, category approval, offers, payouts, disputes
- Interpreter scheduling against Nasjonalt tolkeregister categories and habilitet checks
- Triage/risk engine (green/yellow/red) and the five submission gates
- Notification emails — the API stores bookings but sends nothing yet
- Vipps ePayment
- Privacy and terms pages (linked in the footer, not written)

## Before launch

- [ ] Real org.nr., address, email and phone in `config.js`
- [ ] Native-speaker review of all ten translations
- [ ] Legal review: behandlingsgrunnlag, DPIA, advokatloven boundary, consumer terms
- [ ] Accountant review: MVA treatment and invoicing model
- [ ] Trademark clearance (Patentstyret, EUIPO/TMview, WIPO) — the name sits close to
      NAVAIR and NAVIER
- [ ] Secure document storage before advertising secure upload
- [ ] Stripe account, webhook secret, and a payment-provider review of the payout flow

---

Internal planning material for this project is not kept in this repository.
