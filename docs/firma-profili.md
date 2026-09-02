# Company profile — small-business plugin customization

Purpose: the single input for the small-business plugin's onboarding
(`/small-business:smb-onboard`) and for any skill that needs company
context (briefs, cash-flow, campaigns). Written 02.09.2026 from this
repo's own records; **nothing here is invented — unknowns are marked
UNKNOWN and must be filled by the owner.** Update this file when facts
change; it is the single source.

## Owner and structure

- Owner: Betül Andersen (andersen.betul@gmail.com), Norway.
- Umbrella: BET-ART (Vercel team name "BET - ART"; GitHub
  `andersenbetul-alt`, repo BETA-ART-PRIVAT).
- Legal form, org number (Brønnøysund), VAT/MVA registration: UNKNOWN —
  confirm before any payroll, invoicing or tax workflow.
- Employees: none recorded; solo founder. Payroll workflows do not
  apply yet — skip `plan-payroll` until hiring.
- Working languages: Turkish (owner), Norwegian (market), English.
- Time zone: Europe/Oslo. Weekly review slot: Monday 07:00 (existing
  SEO/AI visibility monitor).

## Business line 1 — QBLOGG (live)

- What: content studio selling content pipelines to SMB/SaaS companies
  without in-house content teams — SEO blog posts, LinkedIn series,
  social content, newsletters, multilingual publishing (10 languages).
- Status: site live at qblogg.vercel.app (Vercel project `qblogg`);
  domain qblogg.com held at GoDaddy, not yet connected.
- Primary conversion goal: brief form submissions (not traffic).
- Secondary audience: writers applying to join the studio.
- Pricing: package prices on the site are EXAMPLE data (repo rule:
  numbers are marked as examples). Real price list: UNKNOWN.
- Payments: none processed yet. Stripe is connected as a connector;
  Stripe Norway fee basis recorded in repo (domestic card 1.5% +
  1.80 kr; foreign +3.25%, currency +2%) — verify before pricing.
- Newsletter: Buttondown (POST endpoint in assets/js/config.js).
- Customers/revenue to date: none recorded in repo — treat as
  pre-revenue unless the owner states otherwise.

## Business line 2 — NAVIAR CARE (pre-launch pilot)

- What: Norwegian elderly-care coordination platform + hourly
  low-risk everyday-help marketplace (helpers matched to users;
  commission per completed service). Products: Start, Match, Assist,
  Plan, Pårørende, Partner — see naviar-care/docs/forretningsmodell.md.
- Status: landing + prototype + pilot console built; NO real
  customers, helpers or payments yet. Pilot design is manual-first.
- All prices are EXAMPLES (e.g. 250 NOK/h + 15–25% commission).
- Hard gate: no real payments before the employment-status/tax/
  insurance questions in naviar-care/docs/hukuk-kontrol-listesi.md are
  answered by counsel. Any plugin workflow that would take money for
  NAVIAR CARE stops at this gate.
- Compliance stance (binding): no unnecessary health data, no
  automated decisions about people, human approval on every match,
  GDPR + WCAG (naviar-care/docs/uyum-ilkeleri.md).
- First institutional contact target: Drammen kommune (Tilrettelagt
  fritid).

## Connected tools (verified 02.09.2026, this account)

Connected and usable by plugin workflows: Gmail, Google Calendar,
Google Drive, Canva, Stripe, Slack, Vercel, Notion, Linear, Shopify,
GoDaddy, Webflow, Wix. Installed but NOT connected: HubSpot. Not
present: QuickBooks, PayPal, Docusign, Square — accounting workflows
(month-end close, tax prep) have no bookkeeping source yet; UNKNOWN
which accounting system the owner uses (in Norway commonly Fiken/
Tripletex — unverified, ask the owner).

## Standing rules for any plugin workflow

1. Every step touching money or customers requires the owner's
   explicit approval (plugin's own rule — keep it).
2. Never present example prices as real offers; the repo marks all
   figures as examples until the owner sets real ones.
3. Nothing unverified is stated about trademark availability,
   registrability or user-test results (repo rule).
4. Customer-facing output follows the venture's own brand rules:
   QBLOGG → docs/tasarim-sistemi.md + on-brand skill; NAVIAR CARE →
   naviar-care palette and Norwegian institutional tone
   (kartlegging/koordinering/oppfølging).
5. Weekly rhythm: Monday brief fits the existing Monday 07:00 slot.

## Owner to fill in (blocks some workflows until answered)

- Legal form + org number + MVA status for each line (one company or
  two?).
- Accounting system and access.
- Real price lists (QBLOGG packages; NAVIAR CARE pilot fees).
- Bank/payment accounts to reconcile against.
