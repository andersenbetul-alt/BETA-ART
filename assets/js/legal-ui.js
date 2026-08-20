/* Naviar Care — retention lookup on the legal page. Lets a patient see the
   exact period and date that applies to them, rather than a vague promise. */
(function (window, document) {
  "use strict";

  var result = document.querySelector("[data-retention-result]");
  if (!result) return;

  var UI = window.NaviarUI;
  var Data = window.NaviarData;

  var countrySelect = document.querySelector("[data-retention-country]");
  var ageSelect = document.querySelector("[data-retention-age]");

  function countryName(code) { return UI.countryName(code); }

  function fillCountries() {
    if (!countrySelect) return;
    var chosen = countrySelect.value;
    countrySelect.innerHTML = "";

    var sorted = Data.countries.slice().sort(function (a, b) {
      return countryName(a.code).localeCompare(countryName(b.code), UI.locale());
    });
    for (var i = 0; i < sorted.length; i++) {
      var o = document.createElement("option");
      o.value = sorted[i].code;
      o.textContent = countryName(sorted[i].code);
      countrySelect.appendChild(o);
    }

    var preferred = chosen;
    if (!preferred) {
      try { preferred = window.localStorage.getItem("naviar.country") || ""; } catch (e) { preferred = ""; }
    }
    countrySelect.value = Data.countryByCode(preferred) ? preferred : "TR";
  }

  function render() {
    var country = countrySelect ? countrySelect.value : "TR";
    var age = ageSelect ? ageSelect.value : "adult";
    var rule = Data.retentionFor(country, age);
    var until = Data.retentionUntil(country, age, new Date());

    result.innerHTML = "";

    var years = UI.el("strong", null, UI.format("legal.retention.years", { n: rule.years }, "{n} years"));
    years.style.cssText = "display:block;font-size:2rem;color:var(--brand-strong);line-height:1.15";
    result.appendChild(years);

    result.appendChild(UI.el("p", "card__meta", UI.format("legal.retention.summary",
      { country: countryName(country) },
      "is how long a consultation record must be kept in {country}, counted from your last contact.")));

    var date = new Date(until.date);
    result.appendChild(UI.el("p", null, UI.format("legal.retention.until",
      { date: date.getFullYear() },
      "A consultation held today could not be deleted before {date}.")));

    if (rule.minorRule) {
      var minor = UI.el("div", "callout callout--info");
      minor.style.marginTop = "1rem";
      var body = UI.el("div");
      body.appendChild(UI.el("p", "callout__title", UI.t("legal.retention.minor.t", "Longer, because the patient is a child")));
      body.appendChild(UI.el("p", null, UI.format("legal.retention.minor.d",
        { age: rule.minorRule.untilAge },
        "A child's record is kept until at least their {age}th birthday, even where that is longer than the ordinary period.")));
      minor.appendChild(body);
      result.appendChild(minor);
    }
  }

  if (countrySelect) countrySelect.addEventListener("change", render);
  if (ageSelect) ageSelect.addEventListener("change", render);

  fillCountries();
  render();
  UI.onLanguageChange(function () { fillCountries(); render(); });
})(window, document);
