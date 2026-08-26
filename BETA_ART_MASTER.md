# Beta Art — Master Model

## Single source of truth

- Public destination: `https://beta-art.com/`
- Master codebase: `andersenbetul-alt/beta-art-archive`
- Production branch: `main`
- Development integration branch: `beta-art-unified-v1`
- GitHub, Lovable, Adobe, Figma, GoDaddy and Vercel are production tools and source material, not separate Beta Art brands.

## Positioning

**Beta Art — Photography with Proof.**

Beta Art is a premium single-photographer archive and licensing practice. The differentiator is not an AI detector or a generic “AI-free” badge. The archive documents provenance around a photograph: maker, physical capture, original evidence, edits, rights and licence.

The brand must never claim to prove that a depicted event is universally “true”. It states what evidence exists, what has been verified and what remains unknown.

## Brand principles

- Museum / archive / editorial rather than SaaS.
- Photography has priority over interface decoration.
- Curatorial and declarative voice; no startup filler.
- One photographer at launch. A marketplace/network is not part of the current product thesis.
- No invented biography, client names, awards, camera details, capture details or verification claims.
- Unverified records remain visibly unverified.

### Visual system

- Paper: `#FBFAF7`
- Panel: `#F3F0E9`
- Ink: `#0F0F0F`
- Secondary ink: `#1F1D1B`
- Muted: `#85817A`
- Rule: `#E4E0D8`
- Seal red: `#8B1A1A`
- Display: Fraunces
- Body: Inter
- Technical/accession: JetBrains Mono

The aperture/seal identity is a brand asset. Do not place the seal over photography.

## Archive model

The archive should be organised as bodies of work rather than keyword stock.

Editorial framework:
1. Work
2. Craft
3. Land and Light
4. The Table
5. Rooms
6. The Unseen
7. Weather

A series becomes live only when it contains real, verified photographs and a finished curatorial introduction.

## Provenance model

Human → Camera → RAW → Edit → Rights → Licence

### Current / near-term layers

- **Beta Archive** — catalogue, status and licensing foundation.
- **Beta Passport** — readable provenance record for each plate.
- **Beta Vault** — protected original evidence and cryptographic fingerprints.
- **Beta Rights** — written licence plus machine-readable reservations where supported.

### Planned, not to be represented as live

- **Beta Verify** — file/record verification interface.
- **Commissioned capture** — client briefs delivered to the same provenance standard.
- Enterprise/API functionality only after real B2B demand validates it.

## Rights strategy

- The written licence is the controlling agreement.
- AI/model-training permission is not granted by default.
- Site-level and file-level machine-readable rights signals support, but do not replace, the contract.
- `/.well-known/trust.txt` reserves data-training rights.
- Search discovery should remain possible while known model-training crawlers can be separately disallowed.
- C2PA/Content Credentials should be used when genuinely present/supported, not simulated.

## Commercial model

Near-term:
- Personal licence
- Commercial licence
- Extended licence
- Custom / exclusive licence
- Manual licence request flow is acceptable for early validation.

Pricing remains draft until confirmed. Do not mix legacy price versions across the site.

Later, only after demand:
- automated payments/invoices
- buyer history/accounts
- commissioned capture
- limited-edition prints
- enterprise workflows / API

Avoid early subscription pricing, generic marketplace scale, AI image search and mobile apps.

## Launch blockers

Do not mark the unified build production-ready until all are resolved:

1. Replace placeholder images with real archive photographs.
2. Verify RAW/capture records and assign accurate statuses.
3. Confirm photographer/public identity and final About/manifesto copy.
4. Confirm legal entity, organisation number, postal address, contact email and VAT status.
5. Confirm one final pricing matrix.
6. Review licence, privacy, refund/withdrawal and checkout wording professionally.
7. Confirm actual processors: hosting, forms/email, payments, file delivery and analytics.
8. Run build, accessibility, mobile, performance and link QA.
9. Connect the master GitHub repository to production hosting and map `beta-art.com`.
10. Only then disable development/noindex mode.

## Source policy

Source documents and prototypes are evidence and inspiration, not automatically production truth. When sources conflict, prefer:

1. verified real-world facts and current law/standards;
2. current master product decision;
3. current master repository implementation;
4. latest unique source documents;
5. older/duplicate prototypes.

Any unsupported fact remains a placeholder rather than being invented.
