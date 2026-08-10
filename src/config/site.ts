/**
 * Beta Art — centralized site configuration.
 *
 * ============================================================
 * LAUNCH CHECKLIST — every value marked TO BE SUPPLIED must be
 * replaced with real, verified information before production.
 * ============================================================
 *  [ ] photographerName        — real name or trading name of the maker
 *  [ ] contactEmail            — monitored licensing inbox
 *  [ ] studioLocation          — city / country (only if you want it public)
 *  [ ] postalAddress           — required on invoices in most jurisdictions
 *  [ ] legalEntity             — registered company or sole-trader name
 *  [ ] orgNumber               — company registration number
 *  [ ] vatStatus               — VAT registered / not registered + rate
 *  [ ] responseTime            — only state a time you can actually meet
 *  [ ] workingSince / catalogueCount — real figures, or leave hidden
 *  [ ] ogImage                 — real 1200×630 social card
 *  [ ] Replace all placeholder photography in src/assets
 *  [ ] Connect a real submission backend for the licence request form
 *  [ ] Have the legal pages reviewed by a qualified adviser
 *  [ ] Set showDevelopmentNotice to false once real assets are in place
 * ============================================================
 */

export const PLACEHOLDER = "To be supplied";

export const siteConfig = {
  /** Business name — confirmed. */
  name: "Beta Art",
  /** Canonical domain — confirmed. */
  url: "https://beta-art.com/",
  tagline: "Archive of human photography",
  description:
    "Beta Art licenses original human-made photography with archived RAW originals, documented capture records and licences issued directly by the photographer.",

  /* --- placeholders: replace before launch ------------------ */
  photographerName: "Photographer name",
  contactEmail: "Contact email to be supplied",
  studioLocation: PLACEHOLDER,
  postalAddress: PLACEHOLDER,
  legalEntity: PLACEHOLDER,
  orgNumber: PLACEHOLDER,
  vatStatus: PLACEHOLDER,
  responseTime: PLACEHOLDER,
  workingSince: PLACEHOLDER,
  catalogueCount: PLACEHOLDER,

  /* REPLACEMENT POINT: real 1200×630 social card, hosted absolutely. */
  ogImage: "https://beta-art.com/og-image-placeholder.jpg",

  /**
   * Development preview banner. Set to false once every placeholder
   * photograph has been replaced by a verified original.
   */
  showDevelopmentNotice: true,
} as const;

export const legalPages = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/license-terms", label: "License Terms" },
  { to: "/refunds", label: "Refund & Withdrawal" },
  { to: "/contact", label: "Contact" },
] as const;
