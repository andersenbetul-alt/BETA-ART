/* Naviar Care – bro mellom oppgavekatalogen og matchingmotoren.

   Katalogen over de fire pilottjenestene bor i besok-lager.js
   (PP_BESOK.OPPGAVER): navn, forklaring, ikke-liste og risikonivå. Den
   første utgaven av denne fila gjentok alt dette med egne id-er og eget
   risikonivå – og ga dermed to svar på spørsmålet «hvilke lavrisikooppdrag
   kan tildeles automatisk» (docs/team/JURIDISK-MEMO-KONSEPTER.md). Nå
   definerer fila bare det besok-lager ikke vet: hvilken oppgavetype i
   matchingmotoren hver katalogoppgave svarer til, og dermed hvilke
   kategorier en hjelper er kvalifisert for.

   Risikonivået leses alltid fra katalogen i besok-lager. Gul betyr at
   leverandøren bestemmer hvem – tildelingen er aldri automatisk, uansett
   hva motoren rangerer (besok-agenter.js, avgjor()). */

window.PP_KATALOG = (function () {
  'use strict';

  /* Katalog-id → oppgavetype i matchingmotoren (samme felt som
     kvalifisert-kravet filtrerer på: hjelper.oppgaver). */
  var TYPE = {
    samvaer: 'samvaer',
    digital: 'digital',
    hjemme: 'praktisk',
    hent: 'handling'
  };

  function oppgaver() {
    return (window.PP_BESOK && window.PP_BESOK.OPPGAVER) || [];
  }

  /** Kategoriene, med matchingtypen lagt på. Alt annet er besok-lagerets. */
  function alle() {
    return oppgaver().map(function (o) {
      return {
        id: o.id,
        navn: o.navn,
        risiko: o.risiko,
        forklaring: o.forklaring,
        ikke: o.ikke,
        type: TYPE[o.id] || null
      };
    });
  }

  function hent(id) {
    return alle().filter(function (k) { return k.id === id; })[0] || null;
  }

  /** Kan denne hjelperen ta oppdrag i kategorien? Samme sannhet som
      matchingmotorens `kvalifisert`-krav: typen må være krysset av. */
  function kanTjene(hjelper, kategoriId) {
    var type = TYPE[kategoriId];
    if (!type) return false;
    return ((hjelper && hjelper.oppgaver) || []).indexOf(type) !== -1;
  }

  /** Kategoriene en hjelper er kvalifisert for – hjelperens «fagområder». */
  function kategorierFor(hjelper) {
    return alle().filter(function (k) { return kanTjene(hjelper, k.id); });
  }

  return {
    TYPE: TYPE,
    alle: alle,
    hent: hent,
    kanTjene: kanTjene,
    kategorierFor: kategorierFor
  };
})();
