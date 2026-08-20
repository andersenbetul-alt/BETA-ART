/* Naviar Care — countries, for the patient's location and the clinician's.
   The patient's country does not restrict who they can reach: it decides
   whether a session is a full consultation or a second opinion. See
   COMPLIANCE.md section 2. */
(function (window) {
  "use strict";
  var N = window.NaviarData = window.NaviarData || {};

  N.countries = [
    { code: "AE", en: "United Arab Emirates" }, { code: "AF", en: "Afghanistan" },
    { code: "AR", en: "Argentina" },  { code: "AT", en: "Austria" },
    { code: "AU", en: "Australia" },  { code: "AZ", en: "Azerbaijan" },
    { code: "BD", en: "Bangladesh" }, { code: "BE", en: "Belgium" },
    { code: "BR", en: "Brazil" },     { code: "CA", en: "Canada" },
    { code: "CH", en: "Switzerland" },{ code: "CL", en: "Chile" },
    { code: "CN", en: "China" },      { code: "CO", en: "Colombia" },
    { code: "DE", en: "Germany" },    { code: "DK", en: "Denmark" },
    { code: "EG", en: "Egypt" },      { code: "ES", en: "Spain" },
    { code: "ET", en: "Ethiopia" },   { code: "FI", en: "Finland" },
    { code: "FR", en: "France" },     { code: "GB", en: "United Kingdom" },
    { code: "GH", en: "Ghana" },      { code: "GR", en: "Greece" },
    { code: "ID", en: "Indonesia" },  { code: "IE", en: "Ireland" },
    { code: "IL", en: "Israel" },     { code: "IN", en: "India" },
    { code: "IQ", en: "Iraq" },       { code: "IR", en: "Iran" },
    { code: "IT", en: "Italy" },      { code: "JP", en: "Japan" },
    { code: "KE", en: "Kenya" },      { code: "KR", en: "South Korea" },
    { code: "MA", en: "Morocco" },    { code: "MX", en: "Mexico" },
    { code: "MY", en: "Malaysia" },   { code: "NG", en: "Nigeria" },
    { code: "NL", en: "Netherlands" },{ code: "NO", en: "Norway" },
    { code: "NP", en: "Nepal" },      { code: "NZ", en: "New Zealand" },
    { code: "PH", en: "Philippines" },{ code: "PK", en: "Pakistan" },
    { code: "PL", en: "Poland" },     { code: "PT", en: "Portugal" },
    { code: "RO", en: "Romania" },    { code: "RS", en: "Serbia" },
    { code: "RU", en: "Russia" },     { code: "SA", en: "Saudi Arabia" },
    { code: "SE", en: "Sweden" },     { code: "SG", en: "Singapore" },
    { code: "TH", en: "Thailand" },   { code: "TR", en: "Türkiye" },
    { code: "UA", en: "Ukraine" },    { code: "US", en: "United States" },
    { code: "VN", en: "Vietnam" },    { code: "ZA", en: "South Africa" }
  ];

  N.countryByCode = function (code) {
    for (var i = 0; i < N.countries.length; i++) {
      if (N.countries[i].code === code) return N.countries[i];
    }
    return null;
  };
})(window);
