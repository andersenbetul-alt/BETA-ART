/* Naviar Care – Mitt hjelpeteam.

   Tjenesten er bygget rundt teamet rundt personen, ikke rundt enkeltkjøp
   (docs/HJELPETEAM.md). Denne modulen utleder teamet – den lagrer ingenting
   nytt. Alt den vet, står allerede i besøkslisten: hvem som var hos hvem,
   når, og med hvilke oppgaver. Et felt som ikke finnes, kan ikke lekke;
   derfor er «teamet» en beregning ved lesning, ikke en ny tabell. */

window.PP_HJELPETEAM = (function () {
  'use strict';

  var UKEDAGER = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

  function ukedag(dato) {
    var d = new Date(dato + 'T12:00:00');
    return isNaN(d) ? null : UKEDAGER[d.getDay()];
  }

  /** Kundene det finnes besøk for – til velgeren på familiesiden. */
  function kunder(besokListe) {
    var sett = {};
    (besokListe || []).forEach(function (b) { if (b.kunde) sett[b.kunde] = true; });
    return Object.keys(sett).sort();
  }

  /**
   * Teamet rundt én kunde, utledet av besøkene.
   *
   * Fast hjelper er den med flest fullførte besøk – samme logikk som gir
   * relasjonsvekt i matchingmotoren, sett fra familiens side. Faste dager er
   * ukedager med minst to besøk hos denne kunden: én gang er en hendelse,
   * to ganger er begynnelsen på en vane.
   */
  function lagTeam(besokListe, kunde) {
    var mine = (besokListe || []).filter(function (b) { return b.kunde === kunde; });
    var perAnsatt = {};

    mine.forEach(function (b) {
      if (!b.ansattId) return;
      var a = perAnsatt[b.ansattId] = perAnsatt[b.ansattId] ||
        { ansattId: b.ansattId, navn: b.ansattNavn || '–', antall: 0,
          fullfort: 0, sisteFullfort: null, dager: {}, oppgaver: {} };
      a.antall++;
      var dag = ukedag(b.dato);
      if (dag) a.dager[dag] = (a.dager[dag] || 0) + 1;
      (b.oppgaver || []).forEach(function (o) { a.oppgaver[o] = true; });
      if (b.status === 'fullfort') {
        a.fullfort++;
        if (!a.sisteFullfort || (b.fullfortTid || '') > a.sisteFullfort) {
          a.sisteFullfort = b.fullfortTid || null;
        }
      }
    });

    var team = Object.keys(perAnsatt).map(function (id) {
      var a = perAnsatt[id];
      return {
        ansattId: a.ansattId,
        navn: a.navn,
        antall: a.antall,
        fullfort: a.fullfort,
        sisteFullfort: a.sisteFullfort,
        fasteDager: Object.keys(a.dager).filter(function (d) { return a.dager[d] >= 2; }),
        oppgaver: Object.keys(a.oppgaver)
      };
    }).sort(function (x, y) { return y.fullfort - x.fullfort || y.antall - x.antall; });

    return {
      kunde: kunde,
      team: team,
      /* Fast hjelper krever en faktisk relasjon: minst to fullførte besøk.
         Én gjennomføring gjør ingen til «fast» – det ville lovet familien
         en kontinuitet som ikke finnes ennå. */
      fastHjelperId: (team[0] && team[0].fullfort >= 2) ? team[0].ansattId : null
    };
  }

  return { kunder: kunder, lagTeam: lagTeam, ukedag: ukedag };
})();
