/* Naviar Care — official registers used to verify a clinician before they go live.

   A clinician application is never a sign-up. Nothing is published until the
   licence has been checked against the state register for the country that
   issued it, and until professional referees have been contacted. See
   COMPLIANCE.md section 2.

   CONFIRMED vs UNCONFIRMED
   -----------------------
   `confirmed: true` means the register, its public lookup and (where present)
   its API were checked against the authority's own documentation. Only Norway
   carries that flag today.

   Every other entry names the register we believe is competent, but the URL and
   the lookup route have NOT been verified. Treat them as leads for the person
   doing the mapping, never as grounds to auto-approve. A country with
   `confirmed: false` — and any country absent from this file — forces manual
   review, which is what `reviewRoute()` returns. */
(function (window) {
  "use strict";
  var N = window.NaviarData = window.NaviarData || {};

  /* Minimum professional referees an applicant must supply, whatever their
     country. Referees are contacted independently of the register check: a
     valid licence says someone may practise, not that they should be on this
     platform. */
  N.MIN_REFERENCES = 2;

  N.registers = {

    /* --------------------------------------------------------------- Norway
       Researched in full. Health personnel need authorisation (autorisasjon)
       or a limited, usually time-bound licence (lisens) from Helsedirektoratet.
       33 professional titles are protected; recognition from another country
       does not confer the right to use a Norwegian protected title. */
    NO: {
      confirmed: true,
      authority: "Helsedirektoratet",
      protectedTitles: 33,
      register: {
        name: "Helsepersonellregisteret (HPR)",
        operator: "Norsk helsenett (NHN)",
        lookup: "https://register.helsedirektoratet.no/hpr",
        searchBy: ["hprNumber", "idNumber", "dateOfBirth+surname"],
        returns: [
          "authorisation",
          "licence",
          "restrictions",
          "prescribingRights",
          "specialty"
        ],
        api: {
          base: "https://api.offentlig.hpr.nhn.no",
          test: "https://api.offentlig.test.hpr.nhn.no/swagger/index.html",
          auth: "Maskinporten",
          scope: "nhn:hpr/basic",
          /* The blocker to plan around: the basic scope is open, but only to
             holders of a Norwegian organisation number linked through Altinn.
             Naviar needs a Norwegian entity before it can call this at all. */
          requires: "Norwegian organisation number, linked via Altinn"
        }
      },
      sanctions: {
        name: "Statens helsetilsyn",
        lookup: "https://www.helsetilsynet.no/tilsyn/om-tilsynssaker/oversikt-over-helsepersonell/",
        covers: [
          "revocation",
          "suspension",
          "limitation",
          "voluntaryRelinquishment",
          "lossOfPrescribingRights"
        ],
        note: "HPR shows the current state. Helsetilsynet explains why it changed."
      },
      crossBorderAlerts: {
        name: "IMI alert mechanism",
        scope: "EU/EEA",
        note: "Authorities must raise an alert within three days of a " +
              "restriction taking effect, but are not required to consult " +
              "incoming alerts. Absence of an alert is not evidence of a " +
              "clean record — never treat it as a pass."
      },
      criminalRecord: {
        name: "Politiattest",
        lookup: "https://www.politiet.no/tjenester/politiattest/sok-om-politiattest-for-privatpersoner",
        basis: "helse- og omsorgstjenesteloven § 5-4",
        note: "May only be demanded where a statute provides the basis. " +
              "Applicant requests it themselves and hands it over."
      },
      foreignEducation: {
        name: "NOKUT",
        note: "General recognition of foreign higher education. Separate from " +
              "Helsedirektoratet's approval of foreign-trained health personnel."
      }
    },

    /* ------------------------------------------------- leads, not confirmed
       Names below are the bodies we expect to be competent. Nothing here has
       been checked against the authority's own documentation. */
    SE: { confirmed: false, authority: "Socialstyrelsen", register: { name: "HOSP" } },
    DK: { confirmed: false, authority: "Styrelsen for Patientsikkerhed", register: { name: "Autorisationsregisteret" } },
    FI: { confirmed: false, authority: "Valvira", register: { name: "JulkiTerhikki" } },
    GB: { confirmed: false, authority: "General Medical Council", register: { name: "GMC register" } },
    IE: { confirmed: false, authority: "Irish Medical Council", register: { name: "Register of Medical Practitioners" } },
    NL: { confirmed: false, authority: "CIBG", register: { name: "BIG-register" } },
    DE: { confirmed: false, authority: "Landesärztekammer", register: { name: "State medical chamber rolls" },
          note: "No single federal register — competence sits with each Land." },
    FR: { confirmed: false, authority: "Ordre des médecins", register: { name: "RPPS" } },
    CH: { confirmed: false, authority: "Bundesamt für Gesundheit", register: { name: "MedReg" } },
    AT: { confirmed: false, authority: "Österreichische Ärztekammer", register: { name: "Ärzteliste" } },
    IT: { confirmed: false, authority: "FNOMCeO", register: { name: "Albo dei medici" } },
    ES: { confirmed: false, authority: "Consejo General de Colegios Oficiales de Médicos", register: { name: "Colegio rolls" } },
    PL: { confirmed: false, authority: "Naczelna Izba Lekarska", register: { name: "Centralny Rejestr Lekarzy" } },
    AU: { confirmed: false, authority: "AHPRA", register: { name: "Register of practitioners" } },
    NZ: { confirmed: false, authority: "Medical Council of New Zealand", register: { name: "Register of doctors" } },
    US: { confirmed: false, authority: "State medical boards", register: { name: "FSMB DocInfo / state board rolls" },
          note: "Licensing is per state. One national lookup does not exist." },
    CA: { confirmed: false, authority: "Provincial colleges of physicians and surgeons", register: { name: "Provincial registers" },
          note: "Licensing is per province." },
    TR: { confirmed: false, authority: "Sağlık Bakanlığı", register: { name: "Doktor bilgi sorgulama (e-Devlet)" } }
  };

  /* ------------------------------------------------------------- accessors */

  N.registerFor = function (code) {
    if (!code) return null;
    return Object.prototype.hasOwnProperty.call(N.registers, code)
      ? N.registers[code]
      : null;
  };

  /* True only where we have actually verified the register and its lookup. */
  N.registerConfirmed = function (code) {
    var r = N.registerFor(code);
    return !!(r && r.confirmed);
  };

  /* What has to happen before an application from `code` can go live.
     Order matters: this is the sequence a reviewer works through. */
  N.requiredChecks = function (code) {
    var r = N.registerFor(code);
    var checks = [
      { id: "identity", label: "Identity document", automatable: false },
      {
        id: "register",
        label: r && r.register ? r.register.name : "State licence register",
        automatable: !!(r && r.register && r.register.api),
        known: !!r
      },
      { id: "references", label: "Professional referees", automatable: false,
        count: N.MIN_REFERENCES },
      { id: "indemnity", label: "Indemnity cover", automatable: false }
    ];

    if (r && r.sanctions) {
      checks.splice(2, 0, {
        id: "sanctions", label: r.sanctions.name, automatable: false
      });
    }
    if (r && r.criminalRecord) {
      checks.push({ id: "criminalRecord", label: r.criminalRecord.name, automatable: false });
    }
    return checks;
  };

  /* How an application is routed. Nothing auto-approves: the best case is a
     register check that a reviewer can run without chasing paperwork. */
  N.reviewRoute = function (code) {
    var r = N.registerFor(code);
    if (!r) {
      return {
        route: "manual",
        reason: "No register mapped for this country. Map it before accepting " +
                "clinicians licensed there."
      };
    }
    if (!r.confirmed) {
      return {
        route: "manual",
        reason: "Register named but not verified. Confirm the lookup route " +
                "against " + r.authority + " before relying on it."
      };
    }
    return {
      route: r.register && r.register.api ? "assisted" : "manual",
      reason: r.register && r.register.api
        ? "Register exposes an API — the licence check can be scripted. " +
          "Referees and indemnity still need a person."
        : "Register is public but manual. A reviewer looks the licence up."
    };
  };
})(window);
