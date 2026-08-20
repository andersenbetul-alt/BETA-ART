/* ==========================================================================
   Naviar Care — deployment configuration
   Everything here is expected to differ per market. Keeping it in one place
   means a new country is a config change, not a code change — which matters,
   because the commercial and video arrangements are not lawful everywhere in
   the same form. See COMPLIANCE.md.
   ========================================================================== */
(function (window) {
  "use strict";

  window.NaviarConfig = {

    /* ------------------------------------------------------------- money --
       Percentage commission on a clinician's fee is treated as unlawful
       fee-splitting in a number of jurisdictions (COMPLIANCE.md §4), so the
       default is a FLAT platform fee. Markets where counsel has confirmed a
       percentage is permitted can override per country.                    */
    pricing: {
      currency: "USD",
      currencySymbol: "$",

      default: {
        model: "flat",          // "flat" | "percent"
        platformFee: 6,         // flat fee per completed consultation
        interpreterFee: 8,      // charged patient-side only when used
        note: "pricing.note.flat"
      },

      /* Per-market overrides. Add a country only once local counsel has
         signed off on the model named here. */
      byCountry: {
        TR: { model: "flat", platformFee: 4, interpreterFee: 5, note: "pricing.note.flat" },
        IN: { model: "flat", platformFee: 3, interpreterFee: 4, note: "pricing.note.flat" },
        US: { model: "flat", platformFee: 9, interpreterFee: 12, note: "pricing.note.flat-us" }
      }
    },

    /* ------------------------------------------------------------- video --
       Default is a SELF-HOSTED Jitsi Meet deployment with end-to-end
       encryption. Rationale (COMPLIANCE.md §3): with self-hosting no third
       party ever holds patient data, which removes an entire class of
       processor agreements and international-transfer problems. The trade is
       that you carry the operational burden.

       Managed alternatives that publish healthcare terms — Whereby Embedded
       and Daily — are supported by the same adapter. Both require a signed
       BAA/DPA before any real patient uses them.                            */
    video: {
      provider: "jitsi",              // "jitsi" | "whereby" | "daily"

      jitsi: {
        /* Point this at YOUR OWN deployment. meet.jit.si is a public service
           and must never be used for patient consultations. */
        domain: "meet.jit.si",
        selfHosted: false,            // set true once pointed at your server
        options: {
          e2ee: true,                 // end-to-end encryption on by default
          lobby: true,                // clinician admits the patient
          recording: false,           // off by default; both parties must consent
          prejoin: true,              // device check before entering
          disableThirdPartyRequests: true,
          analytics: false
        }
      },

      whereby: { subdomain: "", roomPrefix: "naviar-" },
      daily:   { domain: "" }
    },

    /* --------------------------------------------------------- behaviour -- */
    consultation: {
      defaultMinutes: 20,
      joinWindowMinutes: 10          // how early the join link opens
    },

    /* This build ships with sample clinicians and no payment processor.
       Flip to false only when connected to real systems. */
    demoMode: true
  };
})(window);
