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
| `admin.html` + `assets/js/admin.js` | The case queue. Token-gated, `noindex`. |
| `server/db.js` | SQLite schema, migrations and queries. |
| `server/server.js` | The API: bookings, Stripe Checkout, enquiries, need finder, admin. |

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

## The case queue

`admin.html` is the operator's side of the pilot: every booking and enquiry, the
status of each case, an internal note, a history of what changed, and the
need-finder answers as bar charts.

```bash
openssl rand -hex 32        # put the result in server/.env as ADMIN_TOKEN
```

Then open `/admin.html` and paste the token. It is held in `sessionStorage`, so
closing the tab signs you out; it never appears in a URL.

The door is deliberately unfriendly, because behind it sit real people's names,
phone numbers and case text:

- a token shorter than 24 characters switches the admin endpoints **off**
  entirely (`503`), rather than running with a guessable code
- the token is compared in constant time
- five wrong answers lock that IP out for 15 minutes, correct token included
- the page is `noindex, nofollow` and sends no referrer

Cases move through `awaiting_payment → new → fit_checked → in_progress →
delivered`, with `cancelled` available at any point. Only a Stripe webhook can
move a case out of `awaiting_payment` by marking it paid — nothing in the
browser can. An invoice case skips that state and lands in the queue as `new`,
because the work starts before the invoice is settled.

## Data

`server/data/naviar.db` — SQLite via `node:sqlite`, which is built into Node 22,
so there is nothing to compile and no ORM. Bookings written by the pilot's
original JSON files are imported automatically on first boot and the files are
renamed `.imported`.

**This is a file on disk.** Serverless hosts with an ephemeral filesystem
(Vercel functions, Netlify functions) will lose it between deploys. Run the API
on a host with a persistent disk, or mount a volume at `server/data`.

## Deploy

The site is static — GitHub Pages, Netlify, Vercel or any web host serves it as is.
The API needs a Node 20+ host (Render, Railway, Fly, a VPS). Point `ALLOWED_ORIGINS`
at the site's real origin and `PUBLIC_SITE_URL` back at the site.

---

## Configuring the business

Everything a non-developer needs to change lives in `assets/js/config.js`.

**Before launch, replace the placeholders:** `orgNumber`, `email`, `phone`,
`phoneHref`, `address`. They currently hold obvious dummy values.

### The offer

The site sells the **First-100 launch offer** — one result, sold well, before
anything else. `price` is the customer total including 25% MVA; `net` is the
ex-MVA fee the 20% commission is calculated from.

| Code | Offer | Price | Delivery |
| --- | --- | --- | --- |
| — | Gratis passkontroll | Free | 1 working day, no analysis |
| K01 | Brev forklart | 800 NOK | 24–48 t, one letter up to 5 pages |
| K02 | Klar konsultasjon | 1 500 NOK | 45 min, phone or video |
| T | Privat tolk | By quote | Agreed before booking |

Phase-2 offers (H01 søknad, O01 oppfølging, S01 senior, fixed-price tolk) are
**not sold yet** — the launch kit says prove demand first. Their translations
are still in `assets/i18n/*.json` under `catalog`; add them back to `services`
in `config.js` when you are ready.

Two things the site deliberately does **not** do, per the launch kit:

- **No document upload.** The booking form asks the customer to describe the
  case in their own words, and says so explicitly. Nothing promises a secure
  upload link.
- **Interpreter pricing is by quote**, and the booking flow tells the customer
  that a public agency normally has to arrange and pay for an interpreter for
  meetings with that agency. Do not remove this notice.

### Outreach attribution

Every link you send can carry `?src=` — `?src=whatsapp`, `?src=partner-caritas`,
`?src=linkedin`. It is stored on first visit and attached to fit checks,
bookings and enquiries, so `/api/insights` can tell you which channel actually
produced paid cases. That is the Source column of the daily scoreboard.

### Payments

Two routes, depending on how far you have deployed.

**Without the server** (day 1 of the launch plan): paste a Stripe Payment Link or
PayPal link into `payments.paymentLinks` in `config.js`. The booking flow stores
the case, generates a reference, and sends the customer to that link with
`client_reference_id` and `prefilled_email` attached, so you can match the
payment to the case by hand. Leave the links empty to collect by invoice.

**With the server**: `server/` creates a **Stripe Checkout** session, so NAVIAR
never touches card data and never holds the money itself. Vipps appears in the config and the
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
- Document upload — deliberately absent, and the copy no longer promises it
- Consent/fullmakt registry with scope, duration and withdrawal
- Marketplace: advisor onboarding, KYC/KYB, category approval, offers, payouts, disputes
- Interpreter scheduling against Nasjonalt tolkeregister categories and habilitet checks
- Triage/risk engine (green/yellow/red) and the five submission gates
- Notification emails — the API stores bookings but sends nothing yet; the queue
  has to be checked by hand
- Vipps ePayment
- Privacy and terms pages (linked in the footer, not written)

## Before launch

- [ ] Real org.nr., address, email and phone in `config.js`
- [ ] `ADMIN_TOKEN` of at least 24 characters, stored in the host's secret store
- [ ] The API on a host with a persistent disk for `server/data`
- [ ] Native-speaker review of all ten translations
- [ ] Legal review: behandlingsgrunnlag, DPIA, advokatloven boundary, consumer terms
- [ ] Accountant review: MVA treatment and invoicing model
- [ ] Trademark clearance (Patentstyret, EUIPO/TMview, WIPO) — the name sits close to
      NAVAIR and NAVIER
- [ ] Stripe account, webhook secret, and a payment-provider review of the payout flow

---

Internal planning material for this project is not kept in this repository.
