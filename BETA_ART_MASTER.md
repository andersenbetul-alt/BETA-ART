# Beta Art — Master Model

## Single source of truth

- Public destination: `https://beta-art.com/`
- Master codebase: `andersenbetul-alt/beta-art-archive`
- Production branch: `main`
- GitHub, Lovable, Adobe, Figma, GoDaddy Airo, Google Drive and Vercel are tools/sources, not separate Beta Art brands.
- The Aug 25, 2026 `BAB01_035 · BETA ART BUSINESS — MASTER BUSINESS MODEL v1.0` is the highest-current Business source-of-truth candidate for Phase 1.

## Current Phase-1 decision

**BETA ART Business — Dokumentasjon som overlever prosjektet.**

Phase 1 is a Norway-first B2B service for construction-project closeout and long-term retrieval. The customer is not buying generic storage, an AI authenticity badge, a stock-photo marketplace or another live project-management tool. The product is the future ability to retrieve the correct original documentation with enough project context to understand and use it after teams, access and project context have changed.

Core commercial principle:

> **Retrieval, not storage.**

Approved positioning:

> **Dokumentasjon som overlever prosjektet.**

Approved historic headline:

> **Prosjektet avsluttes. Dokumentasjonen skal ikke.**

## Phase-1 customer

Primary market: Norway · bygg & anlegg.

Primary customer groups:
- contractors / entreprenører,
- developers / byggherrer,
- initially one Norwegian region,
- project managers,
- quality/HSE roles,
- project owner representatives,
- aftermarket/claims roles,
- procurement/management stakeholders.

## Phase-1 offer

### Project Closeout Archive
A bounded service combining:
1. intake,
2. original/source preservation,
3. metadata normalization,
4. verification/exception recording,
5. project manifest,
6. retrieval testing,
7. retention,
8. export/continuity.

### Preferred Pilot 01 entry
**Completed Project Rescue**

The customer chooses one recently completed project, supplies project facts and 3–5 natural retrieval questions, and Beta Art structures the scoped material, records gaps/exceptions and tests whether the correct material can be found.

No project files should be accepted before qualification, scope and readiness/privacy gates are resolved.

## Validation rule

Before full platform development:

> **Deliver three paying archive customers semi-manually.**

Service first, software later. Build automation only after repeated pilot evidence proves which steps need it.

## Shared trust infrastructure

All previous Beta Art work is consolidated here as capability, not as competing public products:

**Source/original → Metadata → Verification/Exception → Rights → Retrieval → Retention → Export/Exit**

Useful retained principles from the photography/provenance work:
- preserve original files where in scope,
- record metadata source/context,
- cryptographic fingerprints/hashes where useful,
- C2PA only as a supporting signal when genuinely present,
- clear rights and release status,
- AI/manipulation disclosure where relevant,
- auditability,
- encrypted/private storage,
- role-based access,
- secure downloads,
- visible unknowns and exceptions,
- never turn missing evidence into a verified claim.

## Photography / archive strategy

The original verified-photography archive, direct licensing, art sales, exhibitions and broad marketplace ideas remain **historical / later-stage directions**, not the Phase-1 Business homepage proposition.

`Photography with Proof` remains a valid description of Beta Art's provenance competence and future photography/archive layer, but it must not override the current construction-first Business launch thesis.

Photographers remain strategically important as a controlled supply side for assignments and original/capture documentation. No open self-service photographer marketplace in Phase 1.

## Current revenue structure

Structure is current; prices remain pilot hypotheses until validated/reviewed:
- project archive establishment,
- retention extension,
- fee/margin on mediated photography assignments.

Current historical pilot hypotheses include 15,000 NOK/project establishment, 2,500 NOK/year extension after the initial retention period, and 11,000 NOK/day mediated photography. Do not present these as final production prices without validation and accounting/legal review.

No subscription in Phase 1.

## Public website — Phase 1

Primary language: Norwegian. English may be secondary.

The homepage must move a construction buyer from:

> “I understand the risk.”

to:

> “I understand exactly how to test this on one project.”

Recommended conversion order:
1. problem,
2. what Beta Art does,
3. “not another project tool”,
4. Completed Project Rescue,
5. customer gives / Beta Art does / customer receives,
6. later-retrieval example,
7. pilot pricing/hypothesis status,
8. pilot qualification CTA,
9. concise trust/transparency support.

Do not make a stock-photo archive, art marketplace or general provenance SaaS the Phase-1 homepage.

## Trust / procurement material

Before serious B2B pilots, prepare:
- verification methodology,
- privacy/DPA status,
- storage/access description,
- continuity/export policy,
- pilot scope,
- readiness gate,
- deliverables sample,
- company/contact/invoice information once finalized.

Use transparent documents instead of fake logos, fake testimonials, fake customer counts or fake verification percentages.

## Technology rule

**Service first, software later.**

Keep and reuse the existing Supabase/RLS/auth/admin work where it supports the Business archive model. Do not add a complex marketplace, public uploader, AI generator, recommendation engine or subscription system before pilot validation.

## Source map

### GitHub
`andersenbetul-alt/beta-art-archive/main` is the only production code source.

### Google Drive / Library
Current BAB-01 Business master, Expert Board decisions, Oppstartspakke, verification/rights framework, audit, brand and older photography materials are research/product sources. Newer explicit BAB-01 Business decisions control Phase 1 when they conflict with older marketplace/archive concepts.

### GoDaddy Airo
Historical/current builder source. Airo project code may be exported as a ZIP and reviewed for useful components. Airo must not remain a second production truth once the final domain is migrated.

### Lovable
Preserve useful Supabase, RLS, roles, auth/admin and unpublished catalogue infrastructure. Customer-facing experiments that conflict with this master model are not production truth.

### Adobe / Figma
Brand/design source material only. Approved assets and tokens may be migrated into the master repo after review.

### Vercel
Intended production hosting for the master repo. Do not deploy the currently photography-led homepage as final production until it has been realigned to the current Phase-1 Business model and passes QA.

### Legacy `andersenbetul-alt/BETA-ART`
Not a production Beta Art repo. Review individual files manually before intentional migration.

## Launch blockers

Do not call Phase 1 production-ready until:
1. Homepage is realigned to current BAB-01 Business proposition.
2. Pilot scope and qualification flow are implemented without file upload at the first stage.
3. Privacy/controller/processor model and DPA are reviewed.
4. EU/EEA storage/access model is confirmed.
5. Retention, deletion, export and exit policy are documented.
6. Legal/accounting/insurance blockers are reviewed where applicable.
7. One pilot pricing structure is confirmed for testing and labelled accurately.
8. Company identity, org number, contact and invoice information are real.
9. Build, accessibility, mobile, security, performance and link QA pass.
10. Master GitHub repo is connected to Vercel and `beta-art.com` only after the above gates.

## Source conflict rule

When sources conflict, prefer:
1. verified current facts/law,
2. explicit current BAB-01 Business decisions,
3. this master model,
4. production repository implementation,
5. supporting current product documents,
6. older photography/marketplace/prototype material.

Unsupported facts remain OPEN/HOLD. Never invent the missing answer.