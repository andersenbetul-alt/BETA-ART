/**
 * Beta Art — homepage copy, canonical English source.
 *
 * This is the single source of truth for the homepage body strings. Each other
 * language lives in home.<lang>.ts with the SAME keys and translated values.
 * The i18n engine (./index.tsx) merges all of these into its dictionary, so
 * components read them through the ordinary `useT()` / `t("home.…")` hook.
 *
 * Brand names (Beta Art, Beta Archive, Beta Passport, Beta Vault, Beta Verify,
 * Beta Rights), catalogue ids (BA-001 · First Light) and the "kr" currency mark
 * are intentionally NOT translated.
 */
export type HomeDict = Record<string, string>;

export const homeEn: HomeDict = {
  "ui.skip": "Skip to content",

  // Hero
  "home.hero.kicker": "Verified human photography · provenance · licensing",
  "home.hero.title": "Photography with proof.",
  "home.hero.lead":
    "Beta Art is a single-photographer archive built around evidence. The aim is to preserve the connection between maker, physical capture, original file, disclosed edits, rights and licence — so the photograph arrives with context, not just pixels.",
  "home.hero.cta1": "Explore the archive",
  "home.hero.cta2": "See how proof works",
  "home.hero.f1.t": "Human captured",
  "home.hero.f1.d": "No synthetic imagery is offered as an archive plate.",
  "home.hero.f2.t": "Evidence stated",
  "home.hero.f2.d": "Verified, pending and unknown are kept visibly distinct.",
  "home.hero.f3.t": "Direct licensing",
  "home.hero.f3.d": "Rights are tied to the exact catalogue record.",
  "home.hero.caption": "Development image — replace with verified archive original before launch",

  // Manifesto
  "home.man.kicker": "A note from the archive",
  "home.man.title":
    "In a world where an image can be generated in seconds, provenance becomes part of the work.",
  "home.man.body":
    "Beta Art is designed to keep the record beside the photograph: who made it, what physical capture evidence exists, what changed afterwards, which rights are cleared and how it may be used. No unsupported claim is upgraded into a fact for the sake of marketing.",

  // Proof chain
  "home.proof.kicker": "The Beta proof chain",
  "home.proof.title": "From shutter to licence",
  "home.proof.body":
    "Beta Art does not claim to prove that a scene is “true”. It documents provenance: what evidence exists, what has been checked and what is still unknown.",
  "home.proof.1.t": "Human",
  "home.proof.1.d": "A named, accountable photographer makes the capture.",
  "home.proof.2.t": "Camera",
  "home.proof.2.d": "Physical camera and capture metadata are recorded when available.",
  "home.proof.3.t": "RAW",
  "home.proof.3.d": "The original RAW can be archived and fingerprinted before delivery.",
  "home.proof.4.t": "Edit",
  "home.proof.4.d": "Permitted edits are disclosed instead of hidden behind a vague AI-free label.",
  "home.proof.5.t": "Rights",
  "home.proof.5.d": "Copyright, consent and data-mining restrictions travel with the asset.",
  "home.proof.6.t": "Licence",
  "home.proof.6.d": "The buyer receives a licence tied to the exact image and agreed use.",

  // Passport
  "home.pass.kicker": "Beta Passport · prototype",
  "home.pass.title": "The record behind the photograph",
  "home.pass.body":
    "The long-term verification product is not another AI detector. It is a readable provenance record showing the evidence attached to each image — without inventing certainty where evidence is missing.",
  "home.pass.example": "Example passport",
  "home.pass.proto": "Prototype",
  "home.pass.r1.t": "Human capture",
  "home.pass.r1.d": "Verification status",
  "home.pass.r2.t": "RAW original",
  "home.pass.r2.d": "Archive + fingerprint",
  "home.pass.r3.t": "Capture record",
  "home.pass.r3.d": "Camera · lens · date · place",
  "home.pass.r4.t": "Edit disclosure",
  "home.pass.r4.d": "What changed after capture",
  "home.pass.r5.t": "Rights",
  "home.pass.r5.d": "Copyright · consent · AI training",
  "home.pass.r6.t": "Licence",
  "home.pass.r6.d": "Buyer · scope · territory · term",

  // Series
  "home.series.kicker": "Editorial framework",
  "home.series.title": "Series, not keywords.",
  "home.series.body":
    "The archive is being structured as bodies of work rather than a pile of stock tags. These seven series are the curatorial framework; only series backed by real verified plates will be presented as live collections.",
  "home.series.label": "Series",
  "home.series.framework": "Framework",
  "home.series.1.t": "Work",
  "home.series.1.n": "People at work — skill, repetition, concentration and the physical reality of making a living.",
  "home.series.1.u": "Editorial · corporate · campaigns",
  "home.series.2.t": "Craft",
  "home.series.2.n": "Hands, tools and materials. Process rather than product; evidence of how something is actually made.",
  "home.series.2.u": "Design · publishing · brand stories",
  "home.series.3.t": "Land and Light",
  "home.series.3.n": "Specific Norwegian places at specific moments, treated as records rather than generic scenery.",
  "home.series.3.u": "Travel · editorial · place branding",
  "home.series.4.t": "The Table",
  "home.series.4.n": "Food, preparation and shared meals — steam, flour, markets and people before the finished plate.",
  "home.series.4.u": "Food · hospitality · editorial",
  "home.series.5.t": "Rooms",
  "home.series.5.n": "Nordic architecture and interiors seen as lived spaces, with attention to time, light and use.",
  "home.series.5.u": "Architecture · design · property",
  "home.series.6.t": "The Unseen",
  "home.series.6.n": "Places outside the familiar route: nearby, real and under-photographed rather than over-produced.",
  "home.series.6.u": "Destination · discovery · editorial",
  "home.series.7.t": "Weather",
  "home.series.7.n": "Weather meeting daily life and built environments — atmosphere recorded as an event, not an effect.",
  "home.series.7.u": "News · climate · editorial",

  // For You strip heading
  "home.foryou": "Pick up where you left off",

  // Collection
  "home.col.kicker": "Current catalogue preview",
  "home.col.title": "Human photography, catalogue by catalogue",
  "home.col.body":
    "Every plate carries an explicit verification status. Development placeholders remain labelled until a real original and capture record are supplied.",
  "home.col.from": "from",

  // Platform / archive layers
  "home.plat.kicker": "What the archive is becoming",
  "home.plat.title": "Keep the photograph first. Build trust around it.",
  "home.plat.l1.s": "Foundation",
  "home.plat.l1.b": "Curated human photography organised by series, catalogue record, provenance status and licence.",
  "home.plat.l2.s": "Next layer",
  "home.plat.l2.b": "A readable record for creator, capture, RAW evidence, edit disclosure, rights and licence status.",
  "home.plat.l3.s": "Next layer",
  "home.plat.l3.b": "Protected storage of original RAW evidence and cryptographic fingerprints without exposing valuable originals publicly.",
  "home.plat.l4.s": "Planned",
  "home.plat.l4.b": "A verification interface for checking whether a delivered file matches a registered Beta Art record.",
  "home.plat.l5.s": "Next layer",
  "home.plat.l5.b": "Human-readable licences supported by machine-readable rights and AI-training reservations where technically available.",
  "home.plat.l6.t": "Commissioned work",
  "home.plat.l6.s": "Planned",
  "home.plat.l6.b": "A client brief becomes a real-world shoot, delivered to the same provenance and licensing standard as the archive.",

  // Rights
  "home.rights.kicker": "Rights & AI use",
  "home.rights.title": "Protect the image after it leaves the archive",
  "home.rights.p1":
    "Beta Art’s direction is layered rights signalling: the written licence remains the legal agreement, while IPTC/PLUS-compatible metadata, site-level reservations and Content Credentials can add machine-readable context where implemented.",
  "home.rights.p2":
    "The goal is to make permitted use obvious, make AI-training restrictions explicit, and preserve rights information as far as today’s open standards allow.",

  // Licensing
  "home.lic.kicker": "Licensing",
  "home.lic.title": "Clear rights for real use",
  "home.lic.body":
    "Start simple, then move up to commercial, extended or exclusive rights. Final prices and terms remain subject to the issued licence agreement.",
  "home.lic.request": "Request terms",

  // Audiences
  "home.aud.kicker": "Built for",
  "home.aud.title": "One archive, different rights needs",
  "home.aud.1.t": "Brands & agencies",
  "home.aud.1.b": "Photography with documented origin, clearer rights and optional exclusivity for campaigns and commercial work.",
  "home.aud.1.cta": "View licensing",
  "home.aud.2.t": "Editorial & institutions",
  "home.aud.2.b": "Source transparency, provenance records and licensing documentation for publishing and institutional use.",
  "home.aud.2.cta": "See the proof chain",
  "home.aud.3.t": "Collectors & private use",
  "home.aud.3.b": "License or collect human-made photography with a clearer record of origin than a conventional download.",
  "home.aud.3.cta": "Explore the archive",

  // Commissions
  "home.com.kicker": "Planned · commissioned capture",
  "home.com.title": "Need an image that does not exist yet?",
  "home.com.body":
    "A future commission service can take a client brief into the real world and deliver new photographs to the same archival standard: capture evidence, releases where needed, edit disclosure and a written licence. It remains a planned service until that workflow is operational.",
  "home.com.cta": "Discuss a future commission",

  // Photographer
  "home.ph.caption": "Photographer portrait to be replaced with a confirmed brand asset",
  "home.ph.kicker": "The maker",
  "home.ph.title": "A human archive starts with an accountable human.",
  "home.ph.body":
    "The final release will place the photographer’s own voice, portrait and manifesto here. That material is a trust requirement, not decoration: provenance begins with knowing who stands behind the record. Unconfirmed biography and credentials will never be invented.",

  // FAQ heading
  "home.faq.kicker": "FAQ",
  "home.faq.title": "Questions about Beta Art",

  // Final CTA
  "home.final.title": "We do not guess what is real. We document where the photograph came from.",
  "home.final.cta1": "Explore the archive",
  "home.final.cta2": "Contact Beta Art",
};
