// Publication settings — the one file to touch when going live, mirroring
// the QBLOGG convention (assets/js/config.js there).
//
// STRIPE_PAYMENT_LINK: URL of the live Stripe Payment Link for the
// Personal tier (kr 190, quantity-adjustable, plate list collected as a
// required custom field). Empty string = Stripe not connected yet; the
// cart's checkout button then falls back to the licence request form, the
// site's original behaviour. Never point this at a test-mode link on the
// public site.
export const STRIPE_PAYMENT_LINK = "";
