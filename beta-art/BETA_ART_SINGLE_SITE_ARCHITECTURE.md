# BETA ART — Single Website Architecture

## Purpose

This document translates the available Beta Art sources into one website system. It prevents the project from fragmenting into separate websites whenever a new business model, feature or design idea appears.

## Source evaluation

### GoDaddy Airo — BASE EXPERIENCE
Role: visual and concept baseline for the website.

Keep:
- current recognizable visual language,
- editorial/museum presentation,
- strong photography-first layout,
- simple customer-facing structure,
- directness and restraint.

Improve with:
- clearer product hierarchy,
- Business/archive section,
- evidence/retrieval explanation,
- stronger trust/compliance layer,
- real content and real company information.

Important: the authenticated Airo builder itself is not a production source-of-truth. Export/review its code, then reconcile into GitHub.

### `beta-art-v3.html` — STRONG VISUAL REFERENCE
Role: best preserved self-contained expression of the archival photography identity.

Strengths:
- museum-standard brand system,
- accession/catalogue logic,
- restrained typography,
- seal motif,
- strong metadata presentation,
- accessible/SEO-aware foundations.

Weaknesses:
- old photography-only positioning,
- placeholder/stock visual dependencies,
- legacy pricing/payment claims,
- not aligned with current Business validation direction.

Decision: reuse the visual grammar, not the old commercial assumptions.

### `beta-art-master-complete.html` — BEST CONNECTED PRODUCT MODEL
Role: idea library for connecting Archive, Assignments, Verified, Business and Compliance.

Strengths:
- one interface already combines multiple Beta Art concepts,
- search → zero result → assignment is an elegant flywheel,
- verification and compliance are visible product layers,
- rights and procurement thinking is stronger than a normal stock site.

Weaknesses:
- too broad for immediate commercial validation,
- older business-account/subscription/marketplace assumptions,
- risks becoming a platform before demand is proven.

Decision: retain the connected journey; stage functionality progressively.

### BAB01 Business Master — CURRENT COMMERCIAL LOGIC
Role: highest-current Phase-1 commercial decision set.

Keep:
- construction beachhead,
- `Retrieval, not storage`,
- `Dokumentasjon som overlever prosjektet`,
- Completed Project Rescue,
- project-based scope,
- no subscription in Phase 1,
- qualification before file intake,
- three paying semi-manual pilots before major software development,
- retrieval tests,
- visible exceptions,
- export/exit and continuity,
- procurement transparency.

Do not let it destroy:
- the existing Beta Art visual identity,
- the photography/archive heritage,
- future licensing/commission capability.

Decision: Business is a major section and commercial priority inside the same Beta Art website.

### Verification & Rights Framework — TRUST STANDARD
Role: shared trust policy for photography and Business documentation.

Keep:
- evidence before badge,
- source/original required where claimed,
- identity/source review,
- capture/context metadata,
- rights/release status,
- AI/manipulation disclosure,
- C2PA as additional signal only,
- unresolved rights conflict blocks commercial licensing when applicable.

Decision: Beta Art Verified is a cross-site trust layer, not an independent website.

### Drive brand + series documents — BRAND DEPTH
Role: curatorial and visual system.

Keep:
- aperture/seal identity,
- archival red accent,
- museum/editorial tone,
- seven-series framework,
- maker/about narrative.

Decision: series are content architecture for the photography side; they do not compete with Business.

### Lovable — BACKEND / PROTOTYPE SOURCE
Role: reusable implementation ideas and infrastructure.

Keep after review:
- Supabase,
- RLS,
- roles,
- auth/admin,
- catalogue/provenance administration.

Reject as master direction:
- conflicting AI creative-studio positioning,
- separate customer-facing Beta Art site.

### GitHub — PRODUCTION SOURCE
Role: authoritative code history and production implementation.

Keep:
- React/TanStack implementation,
- legal routes,
- accessibility patterns,
- sitemap/SEO foundations,
- AI-rights technical files,
- auth/admin foundations where useful.

Decision: every approved idea eventually lands here before deployment.

### Adobe Creative Cloud — BRAND ASSET SOURCE
Current Beta Art-relevant assets include:
- two `BETA ART` Creative Cloud libraries,
- a Beta Art logo-maker/Adobe Express project.

Decision: reviewed logo/brand assets can be migrated into the single site; Adobe does not create a separate website.

### Figma — DESIGN SYSTEM / PROTOTYPING SOURCE
Role: editable UI/design source when a specific Beta Art Figma file/node is available.

Decision: use it to refine components and layouts; production implementation remains GitHub.

### Current web standards

C2PA:
- use conforming/trusted implementations where relevant,
- do not imply that presence of Content Credentials proves scene truth,
- record C2PA as one provenance signal.

IPTC / AI rights:
- use layered rights reservation rather than a single bot rule,
- site-wide `trust.txt`, TDMRep, asset-level Data Mining metadata and C2PA/CAWG assertions can complement contracts where implemented.

## One-site information architecture

### Navigation
- Archive
- Business
- How it works
- Verified
- Assignments
- Rights
- About
- Contact

### Homepage flow

1. **Hero — Beta Art identity**
   - preserve Airo look and tone
   - two clear paths: Archive and For Business

2. **Shared promise**
   - original/source
   - context
   - rights
   - retrievability

3. **Archive / Photography**
   - selected verified works
   - series
   - catalogue/accession
   - licensing status

4. **Business — Dokumentasjon som overlever prosjektet**
   - project-closeout problem
   - why not another project tool
   - Completed Project Rescue
   - CTA: evaluate one completed project / 20-minute call

5. **How Beta Art works**
   - Source/original
   - Metadata
   - Verification/Exception
   - Rights
   - Retrieval
   - Retention
   - Export/Exit

6. **Beta Art Verified**
   - evidence before badge
   - human/source identity
   - capture/context
   - rights/releases
   - AI disclosure
   - C2PA when supported

7. **Assignments / Commissions**
   - archive missing what is needed → commission real-world capture
   - approved photographer workflow

8. **Rights & AI**
   - written licence/contract
   - releases
   - AI training reservation
   - machine-readable rights signals

9. **Transparency / Procurement**
   - methodology
   - DPA/privacy status
   - storage/access
   - retention/export/exit
   - pilot scope

10. **Series / editorial depth**
   - Work
   - Craft
   - Land and Light
   - The Table
   - Rooms
   - The Unseen
   - Weather

11. **About / Maker**
   - real identity/story only

12. **Contact / qualification**
   - licensing
   - Business pilot
   - assignment
   - photographer collaboration

## UX rule

The site may have routes and deeper detail pages, but it must feel like one coherent Beta Art website. No sub-brand should require a separate visual identity or separate production deployment.

## Product staging

### Live/near-term
- brand/homepage
- Business qualification
- archive preview
- verification methodology
- transparency/procurement documents
- manual licensing/request workflow
- manual/semi-manual Business pilot workflow

### After validation
- richer catalogue/search
- Passport records
- Vault/original evidence management
- automated retrieval tools
- commission workflow
- buyer/account history where needed

### Later only with demand evidence
- enterprise/API
- broad photographer network
- marketplace scale
- public verification service
- art/exhibition commerce

## Core metric

For Business:
> Can the next responsible person find the correct original later?

For Photography:
> Can the buyer understand where the photograph came from, what was verified and what rights they receive?

The same system should answer both questions with evidence, not marketing claims.