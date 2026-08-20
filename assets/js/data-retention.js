/* ==========================================================================
   Naviar Care — statutory retention of consultation records
   --------------------------------------------------------------------------
   How long a consultation record must be KEPT is set by health law in the
   patient's country, and it overrides a patient's wish to have data deleted:
   the GDPR right to erasure yields to a legal retention obligation. Getting
   this wrong is unlawful in both directions — deleting too early breaches
   medical records law, keeping too long breaches data protection law.

   `years` is measured from the last contact unless `from` says otherwise.
   Figures are compiled from public sources (see COMPLIANCE.md) and must be
   confirmed with local counsel before launch in any market.
   ========================================================================== */
(function (window) {
  "use strict";
  var N = window.NaviarData = window.NaviarData || {};

  N.retentionDefault = { years: 10, from: "last-contact", basis: "retention.basis.default" };

  N.retention = {
    TR: { years: 20, from: "last-contact", basis: "retention.basis.tr" },
    GB: { years: 20, from: "last-contact", basis: "retention.basis.gb" },
    NL: { years: 20, from: "last-contact", basis: "retention.basis.nl" },
    DE: { years: 10, from: "last-contact", basis: "retention.basis.eu" },
    FR: { years: 20, from: "last-contact", basis: "retention.basis.eu" },
    ES: { years: 10, from: "last-contact", basis: "retention.basis.eu" },
    IT: { years: 10, from: "last-contact", basis: "retention.basis.eu" },
    PL: { years: 20, from: "last-contact", basis: "retention.basis.eu" },
    IE: { years: 8,  from: "last-contact", basis: "retention.basis.eu" },
    US: { years: 10, from: "last-contact", basis: "retention.basis.us" },
    CA: { years: 10, from: "last-contact", basis: "retention.basis.default" },
    AU: { years: 7,  from: "last-contact", basis: "retention.basis.default" },
    IN: { years: 3,  from: "last-contact", basis: "retention.basis.default" },
    AE: { years: 25, from: "last-contact", basis: "retention.basis.default" },
    SG: { years: 6,  from: "last-contact", basis: "retention.basis.default" }
  };

  /* Children's records are held longer almost everywhere: the clock usually
     runs to adulthood plus the ordinary limitation period, because a child
     cannot bring a claim until they can act for themselves. */
  N.retentionMinorRule = { untilAge: 25, basis: "retention.basis.minor" };

  N.retentionFor = function (countryCode, ageGroup) {
    var base = (countryCode && N.retention[countryCode]) || N.retentionDefault;
    var isMinor = ageGroup === "infant" || ageGroup === "child" || ageGroup === "teen";
    return {
      years: base.years,
      from: base.from,
      basis: base.basis,
      minorRule: isMinor ? N.retentionMinorRule : null,
      country: countryCode || null
    };
  };

  /* The calendar date a record becomes eligible for deletion. */
  N.retentionUntil = function (countryCode, ageGroup, fromDate) {
    var rule = N.retentionFor(countryCode, ageGroup);
    var start = fromDate instanceof Date ? new Date(fromDate.getTime()) : new Date();
    var end = new Date(start.getTime());
    end.setFullYear(end.getFullYear() + rule.years);
    return { date: end, rule: rule };
  };
})(window);
