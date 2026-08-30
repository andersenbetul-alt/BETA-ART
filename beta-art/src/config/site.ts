/**
 * Beta Art — centralized site configuration.
 *
 * Production principle:
 * - beta-art.com is the single public destination.
 * - GitHub, Lovable, Adobe, Figma, GoDaddy and Vercel are production tools,
 *   not separate Beta Art brands or websites.
 * - Unknown biographical, legal or catalogue facts must remain explicit
 *   placeholders until verified. Never invent them.
 */

export const PLACEHOLDER = "To be supplied";

export const siteConfig = {
  name: "Beta Art",
  url: "https://beta-art.com/",
  productionUrlConfirmed: true,
  tagline: "Photography with proof",
  description:
    "Beta Art is a human photography archive and licensing platform built around preserved RAW originals, documented provenance, transparent rights and direct licensing.",

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

  ogImage: "https://beta-art.com/og-image-placeholder.jpg",

  /** Keep the development warning until all visible photographs and factual fields are verified. */
  showDevelopmentNotice: true,

  /**
   * Keep previews out of search while placeholder imagery/facts remain.
   * Set false only for the production-ready release deployed to beta-art.com.
   */
  developmentMode: true,
} as const;

export const canonicalUrl: string | null = siteConfig.productionUrlConfirmed ? siteConfig.url : null;
export const robotsContent = siteConfig.developmentMode ? "noindex,nofollow" : "index,follow";
export const PRICE_STATUS_NOTE = "Draft pricing — indicative only, not confirmed licence terms.";

export const legalPages = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/license-terms", label: "License Terms" },
  { to: "/refunds", label: "Refund & Withdrawal" },
  { to: "/contact", label: "Contact" },
] as const;
