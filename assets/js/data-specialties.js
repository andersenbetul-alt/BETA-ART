/* Naviar Care — specialty catalogue.
   Display names/descriptions live in the i18n dictionaries under
   spec.<id>.name and spec.<id>.desc so every specialty is shown in the
   visitor's own language. */
(function (window) {
  "use strict";
  var N = window.NaviarData = window.NaviarData || {};

  N.specialties = [
    { id: "general-practice",   group: "primary",  initials: "GP" },
    { id: "internal-medicine",  group: "primary",  initials: "IM" },
    { id: "pediatrics",         group: "primary",  initials: "PD" },
    { id: "emergency",          group: "urgent",   initials: "ER" },
    { id: "cardiology",         group: "organ",    initials: "CA" },
    { id: "pulmonology",        group: "organ",    initials: "PU" },
    { id: "gastroenterology",   group: "organ",    initials: "GA" },
    { id: "neurology",          group: "organ",    initials: "NE" },
    { id: "nephrology",         group: "organ",    initials: "NP" },
    { id: "endocrinology",      group: "organ",    initials: "EN" },
    { id: "hematology",         group: "organ",    initials: "HE" },
    { id: "oncology",           group: "organ",    initials: "ON" },
    { id: "dermatology",        group: "surface",  initials: "DE" },
    { id: "ophthalmology",      group: "surface",  initials: "OP" },
    { id: "ent",                group: "surface",  initials: "EN" },
    { id: "dentistry",          group: "surface",  initials: "DN" },
    { id: "orthopedics",        group: "movement", initials: "OR" },
    { id: "rheumatology",       group: "movement", initials: "RH" },
    { id: "physiotherapy",      group: "movement", initials: "PT" },
    { id: "urology",            group: "systems",  initials: "UR" },
    { id: "gynecology",         group: "systems",  initials: "GY" },
    { id: "allergy-immunology", group: "systems",  initials: "AI" },
    { id: "infectious-disease", group: "systems",  initials: "ID" },
    { id: "psychiatry",         group: "mind",     initials: "PS" },
    { id: "psychology",         group: "mind",     initials: "PC" },
    { id: "sleep-medicine",     group: "mind",     initials: "SL" },
    { id: "nutrition",          group: "lifestyle",initials: "NU" },
    { id: "general-surgery",    group: "surgical", initials: "SU" }
  ];

  N.specialtyById = function (id) {
    for (var i = 0; i < N.specialties.length; i++) {
      if (N.specialties[i].id === id) return N.specialties[i];
    }
    return null;
  };
})(window);
