/* PårørendePilot – matchingmotor.
   Regelen er «nærmeste kvalifiserte og betrodde hjelper», ikke «nærmeste person».

   Motoren er bevisst forklarbar: hver score kommer med begrunnelse, og hvert
   oppdrag en hjelper IKKE får se, kommer med en grunn. Et oppdrag som stenges
   ute skal kunne besvares med et svar, ikke med taushet. */

(function (global) {
  'use strict';

  /* ---------- absolutte krav ----------
     Dette er filtre, ikke poeng. Et oppdrag som bryter et av dem, tilbys aldri. */

  var KRAV = [
    {
      id: 'tilgjengelig',
      test: function (h) { return h.tilgjengelig === true; },
      grunn: function () { return 'Du er satt som utilgjengelig akkurat nå.'; }
    },
    {
      id: 'kvalifisert',
      test: function (h, o) { return h.oppgaver.indexOf(o.type) !== -1; },
      grunn: function (h, o) { return 'Du har ikke krysset av for oppdragstypen «' + o.typeNavn + '».'; }
    },
    {
      id: 'tillitsniva',
      test: function (h, o) { return h.tillitsniva >= o.krevdNiva; },
      grunn: function (h, o) {
        return 'Dette oppdraget krever tillitsnivå ' + o.krevdNiva +
               '. Du er på nivå ' + h.tillitsniva + '. Fullfør flere oppdrag for å komme videre.';
      }
    },
    {
      id: 'avstand',
      test: function (h, o) { return o.avstandKm <= h.maksAvstandKm; },
      grunn: function (h, o) {
        return 'Oppdraget er ' + tall(o.avstandKm) + ' km unna. Du har satt maks ' + h.maksAvstandKm + ' km.';
      }
    },
    {
      id: 'tidsrom',
      test: function (h, o) { return h.tidsrom.indexOf(o.tidsrom) !== -1; },
      grunn: function (h, o) { return 'Du har ikke oppgitt at du er ledig på ' + o.tidsromNavn.toLowerCase() + '.'; }
    },
    {
      id: 'proveperiode',
      // I prøveperioden vises bare dagtidsoppdrag med lav risiko.
      test: function (h, o) { return !h.iProveperiode || (o.risiko === 'lav' && o.tidsrom !== 'kveld'); },
      grunn: function () { return 'I prøveperioden får du enkle oppdrag på dagtid. Dette åpnes etter fem fullførte oppdrag.'; }
    }
  ];

  /* ---------- vekter ----------
     Summen er 100. Endres vektene, endres tjenestens oppførsel – derfor står de samlet. */

  var VEKT = {
    relasjon: 25,     // har hjelperen vært hos denne familien før?
    naerhet: 25,      // reisetid er både kostnad og ventetid for kunden
    tillit: 20,       // tillitsscore fra oppdragshistorikk
    sprak: 10,        // familiens språkønske
    punktlighet: 10,
    transport: 5,
    pris: 5
  };

  function tall(n) { return String(Math.round(n * 10) / 10).replace('.', ','); }

  function naerhetsScore(avstandKm, maksKm) {
    // Lineær nedtrapping: på egen maksavstand er nærhetsbidraget null.
    var andel = 1 - (avstandKm / Math.max(maksKm, 0.1));
    return Math.max(0, Math.min(1, andel));
  }

  function relasjonsScore(antallTidligere) {
    if (!antallTidligere) return 0;
    // Metter etter ca. 10 oppdrag – den ellevte gangen betyr mindre enn den andre.
    return Math.min(1, Math.log(1 + antallTidligere) / Math.log(11));
  }

  function transportScore(h, o) {
    if (o.avstandKm <= 1.5) return 1;                                  // alt fungerer til fots
    if (h.transport.indexOf('bil') !== -1) return 1;
    if (h.transport.indexOf('sykkel') !== -1) return o.avstandKm <= 6 ? 0.9 : 0.5;
    if (h.transport.indexOf('kollektiv') !== -1) return 0.8;
    return o.avstandKm <= 3 ? 0.6 : 0.2;                               // til fots over lengre avstand
  }

  function prisScore(h, o) {
    if (!o.maksTimesats || !h.timesats) return 0.7;
    return h.timesats <= o.maksTimesats ? 1 : 0.3;
  }

  /**
   * Vurderer én hjelper mot ett oppdrag.
   * @returns {{aktuell:boolean, score:number, begrunnelser:string[], sperre:?{id:string,grunn:string}}}
   */
  function vurder(hjelper, oppdrag) {
    for (var i = 0; i < KRAV.length; i++) {
      if (!KRAV[i].test(hjelper, oppdrag)) {
        return {
          aktuell: false,
          score: 0,
          begrunnelser: [],
          sperre: { id: KRAV[i].id, grunn: KRAV[i].grunn(hjelper, oppdrag) }
        };
      }
    }

    var deler = {
      relasjon: relasjonsScore(oppdrag.tidligereOppdragMedHjelper && oppdrag.tidligereOppdragMedHjelper[hjelper.id] || 0),
      naerhet: naerhetsScore(oppdrag.avstandKm, hjelper.maksAvstandKm),
      tillit: Math.max(0, Math.min(1, hjelper.tillitsscore / 100)),
      sprak: !oppdrag.sprakonske ? 0.7 : (hjelper.sprak.indexOf(oppdrag.sprakonske) !== -1 ? 1 : 0),
      punktlighet: Math.max(0, Math.min(1, hjelper.punktlighet / 100)),
      transport: transportScore(hjelper, oppdrag),
      pris: prisScore(hjelper, oppdrag)
    };

    var score = 0;
    Object.keys(VEKT).forEach(function (n) { score += deler[n] * VEKT[n]; });

    var begrunnelser = [];
    var tidligere = oppdrag.tidligereOppdragMedHjelper && oppdrag.tidligereOppdragMedHjelper[hjelper.id];
    if (tidligere) begrunnelser.push('Du har vært hos denne familien ' + tidligere + ' ganger.');
    begrunnelser.push(tall(oppdrag.avstandKm) + ' km unna – ca. ' + oppdrag.reisetidMin + ' min reise.');
    if (deler.sprak === 1 && oppdrag.sprakonske) begrunnelser.push('Familien ønsket ' + oppdrag.sprakonske + ', som du snakker.');
    if (deler.tillit >= 0.9) begrunnelser.push('Høy tillitsscore (' + hjelper.tillitsscore + ').');
    if (deler.transport < 0.6) begrunnelser.push('Reisemåten din gjør dette oppdraget krevende å rekke.');

    return {
      aktuell: true,
      score: Math.round(score),
      deler: deler,
      begrunnelser: begrunnelser,
      sperre: null
    };
  }

  /** Rangerer hjelpere for ett oppdrag – brukes når et oppdrag skal tildeles. */
  function rangerHjelpere(oppdrag, hjelpere) {
    return hjelpere
      .map(function (h) { return { hjelper: h, resultat: vurder(h, oppdrag) }; })
      .filter(function (r) { return r.resultat.aktuell; })
      .sort(function (a, b) { return b.resultat.score - a.resultat.score; });
  }

  /**
   * Tilbudsrekkefølge i bølger: fast hjelper først, så familiens krets,
   * deretter øvrige. Alle får ikke varsel samtidig – det gir familien
   * kontinuitet og hindrer at ti personer kappløper om samme oppdrag.
   */
  function tilbudsbolger(oppdrag, hjelpere) {
    var rangert = rangerHjelpere(oppdrag, hjelpere);
    var bolger = [
      { navn: 'Fast hjelper', hjelpere: [] },
      { navn: 'Familiens krets', hjelpere: [] },
      { navn: 'Verifiserte hjelpere i nærheten', hjelpere: [] }
    ];
    rangert.forEach(function (r) {
      if (oppdrag.fastHjelperId === r.hjelper.id) bolger[0].hjelpere.push(r);
      else if ((oppdrag.krets || []).indexOf(r.hjelper.id) !== -1) bolger[1].hjelpere.push(r);
      else bolger[2].hjelpere.push(r);
    });
    return bolger.filter(function (b) { return b.hjelpere.length > 0; });
  }

  /** Rangerer oppdrag for én hjelper – brukes i oppdragstavla. */
  function rangerOppdrag(hjelper, oppdragsliste) {
    var aktuelle = [];
    var skjulte = [];
    oppdragsliste.forEach(function (o) {
      var r = vurder(hjelper, o);
      if (r.aktuell) aktuelle.push({ oppdrag: o, resultat: r });
      else skjulte.push({ oppdrag: o, resultat: r });
    });
    aktuelle.sort(function (a, b) { return b.resultat.score - a.resultat.score; });
    return { aktuelle: aktuelle, skjulte: skjulte };
  }

  global.PP_MATCHING = {
    vurder: vurder,
    rangerHjelpere: rangerHjelpere,
    rangerOppdrag: rangerOppdrag,
    tilbudsbolger: tilbudsbolger,
    VEKT: VEKT,
    KRAV: KRAV
  };
})(typeof window !== 'undefined' ? window : globalThis);
