/* PårørendePilot – akuttvurdering.

   Plattformen skal aldri formidle et oppdrag der nødetatene er riktig svar.

   Tre erfaringer styrer utformingen:

   1. Delstrengsøk er farlig. «avfallet» inneholder «fall», «nødvendig»
      inneholder «nød», «blodprøve» inneholder «blod», «forslag» inneholder
      «slag». Derfor matcher vi på ordgrenser, ikke delstrenger.

   2. Falske positive er ikke bare støy – de er mekanismen som slår av vernet.
      En bruker som får åpenbart feil varsel, lærer å trykke det bort. Derfor
      har vi to nivåer: RØDT stopper bestillingen, GULT stiller et spørsmål.

   3. Familier skriver symptomer, ikke diagnoser. «kraftig blødning» og «vondt
      i brystet» må treffe like sikkert som «hjerteinfarkt».

   Modulen er ren: den tar tekst inn og gir en vurdering ut. Ingen DOM. */

(function (global) {
  'use strict';

  /* RØDT – nødetatene er riktig svar. Bestillingen stoppes. */
  var RODT = [
    { m: /\bbrann(en|er)?\b/,                       hva: 'brann' },
    { m: /\bbrenner\b/,                             hva: 'brann' },
    { m: /\brøyk(en)?\s+(i|fra)\b/,                 hva: 'brann' },
    { m: /\bhjerteinfarkt|hjerteattakk|hjertestans\b/, hva: 'hjerte' },
    { m: /\b(hjerne)?slag(et)?\b/,                  hva: 'hjerneslag' },
    { m: /\bmunnvik(en)?\b.*\bheng/,                hva: 'hjerneslag' },
    { m: /\bheng(er|ende)\b.*\bmunnvik/,            hva: 'hjerneslag' },
    { m: /\blammet\b|\blammelse/,                   hva: 'hjerneslag' },
    { m: /\bsnøvl(er|ete)\b/,                       hva: 'hjerneslag' },
    { m: /\bpust(er|ar)\s+(ikke|ikkje)\b/,          hva: 'pust' },
    { m: /\b(får|fär)\s+(ikke|ikkje)\s+puste/,      hva: 'pust' },
    { m: /\bpustevansker|puste?problem/,            hva: 'pust' },
    { m: /\bblø(r|dde|dning|dninger)\b/,            hva: 'blødning' },
    { m: /\bblod\b/,                                hva: 'blødning' },
    { m: /\bbevisstløs|besvim(te|t|er)\b/,          hva: 'bevissthet' },
    { m: /\bvåkner\s+ikke\b|\bfår\s+ikke\s+kontakt\b/, hva: 'bevissthet' },
    { m: /\bambulanse\b/,                           hva: 'nødetat' },
    { m: /\b(11[023])\b/,                           hva: 'nødetat' },
    { m: /\bbrystsmerter\b/,                        hva: 'bryst' },
    { m: /\b(vondt|smerter|trykk)\s+i\s+brystet\b/, hva: 'bryst' },
    { m: /\bligger\s+på\s+gulvet\b/,                hva: 'fall' },
    { m: /\bkommer\s+(seg\s+)?ikke\s+opp\b/,        hva: 'fall' },
    { m: /\bkan\s+ikke\s+reise\s+seg\b/,            hva: 'fall' },
    { m: /\bfår\s+ikke\s+reist\s+seg\b/,            hva: 'fall' },
    { m: /\bhjelp\s+meg\s+(fort|nå|straks)\b/,      hva: 'nødrop' },
    { m: /\bakutt\b/,                               hva: 'akutt' },
    { m: /\bnødsituasjon|livstruende\b/,            hva: 'akutt' }
  ];

  /* GULT – kan være alvorlig, kan være hverdag. Vi spør, vi stopper ikke. */
  var GULT = [
    { m: /\bfalt\b|\bfall(t)?\s+(i|på|ned)\b/,      hva: 'fall som har skjedd' },
    { m: /\bskadet\b|\bvondt\b/,                    hva: 'skade eller smerte' },
    { m: /\bsterke\s+smerter\b/,                    hva: 'smerte' },
    { m: /\bsvimmel|ør\s+i\s+hodet\b/,              hva: 'svimmelhet' },
    { m: /\bforvirret|desorientert\b/,              hva: 'forvirring' },
    { m: /\bfeber\b/,                               hva: 'feber' },
    { m: /\bkaster\s+opp\b|\boppkast\b/,            hva: 'oppkast' },
    { m: /\bikke\s+spist\b|\bikke\s+drukket\b/,     hva: 'næring' }
  ];

  function traff(regler, tekst) {
    var funn = [];
    regler.forEach(function (r) { if (r.m.test(tekst)) funn.push(r.hva); });
    return funn.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /**
   * Vurderer en fritekst.
   * @returns {{niva:'rod'|'gul'|'ingen', treff:string[]}}
   */
  function vurder(tekst) {
    if (!tekst || !String(tekst).trim()) return { niva: 'ingen', treff: [] };
    var t = String(tekst).toLowerCase();

    var rodt = traff(RODT, t);
    if (rodt.length) return { niva: 'rod', treff: rodt };

    var gult = traff(GULT, t);
    if (gult.length) return { niva: 'gul', treff: gult };

    return { niva: 'ingen', treff: [] };
  }

  /* Lag 3: en tekstuavhengig port. Ved hastegrad «nå» spør vi alltid om
     bevissthet og pust, uansett hva brukeren har skrevet – nettopp fordi
     den som har det travelt, skriver minst. */
  var HASTEPORT = {
    sporsmal: 'Er personen ved bevissthet og puster normalt?',
    svar: [
      { verdi: 'ja',      tekst: 'Ja',        stopper: false },
      { verdi: 'nei',     tekst: 'Nei',       stopper: true },
      { verdi: 'vetikke', tekst: 'Vet ikke',  stopper: true }
    ]
  };

  function kreverHasteport(hastegrad) {
    return hastegrad === 'na';
  }

  function hasteportStopper(svar) {
    // Alt annet enn et uttrykkelig «ja» stopper. Tvil skal koste et klikk,
    // ikke et liv.
    return svar !== 'ja';
  }

  global.PP_AKUTT = {
    vurder: vurder,
    kreverHasteport: kreverHasteport,
    hasteportStopper: hasteportStopper,
    HASTEPORT: HASTEPORT,
    RODT: RODT,
    GULT: GULT
  };
})(typeof window !== 'undefined' ? window : globalThis);
