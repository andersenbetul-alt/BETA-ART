/* Naviar Care – behovsplattformen.

   Spørsmålet «hva trenger eldre mest?» besvares ikke av en undersøkelse. Det
   besvares av forespørslene du ikke kunne ta imot. Denne modulen samler dem,
   grupperer dem, og foreslår hvilke tjenester som mangler i tilbudet.

   Én regel holder produktet på plass: etterspørsel oppretter ALDRI en
   kategori av seg selv. Hadde den gjort det, ville «gi henne medisinene»
   skrevet fjorten ganger blitt en medisintjeneste – og den faste,
   ikke-kliniske oppgavelista er hele sperren mot at tjenesten glir.

   Systemet foreslår. Leverandøren godkjenner. Det som ligger over
   helsegrensen, kan ikke godkjennes i det hele tatt. */

window.PP_BEHOV = (function () {
  'use strict';

  /* Kandidater vi kjenner igjen. Nøkkelordene er det familier faktisk skriver,
     ikke fagtermer. Ordgrenser brukes for å unngå treff inne i andre ord. */
  var KANDIDATER = [
    { id: 'hage',      navn: 'Hage og plen',          ikon: '🌿', ord: ['hage', 'plen', 'gress', 'klippe', 'luke', 'blomster', 'bed'] },
    { id: 'snomaking', navn: 'Snømåking og strøing',  ikon: '❄️', ord: ['snø', 'måke', 'brøyte', 'strø', 'is', 'glatt'] },
    { id: 'frisor',    navn: 'Følge til frisør',      ikon: '💇', ord: ['frisør', 'klippe håret', 'hårklipp'] },
    { id: 'it',        navn: 'Data og telefon',       ikon: '💻', ord: ['pc', 'data', 'nettbrett', 'mobil', 'wifi', 'internett', 'passord', 'skriver'] },
    { id: 'mat',       navn: 'Matlaging',             ikon: '🍲', ord: ['lage mat', 'middag', 'matlaging', 'koke', 'varme mat'] },
    { id: 'vask',      navn: 'Klesvask',              ikon: '🧺', ord: ['klesvask', 'vaske klær', 'stryke', 'vaskemaskin'] },
    { id: 'mobler',    navn: 'Flytte og bære',        ikon: '📦', ord: ['flytte', 'bære', 'møbler', 'tungt', 'bytte lyspære', 'henge opp'] },
    { id: 'bank',      navn: 'Bank og post',          ikon: '🏦', ord: ['bank', 'post', 'brev', 'regning', 'skjema', 'papirer'] },
    { id: 'lesing',    navn: 'Høytlesing og prat',    ikon: '📖', ord: ['lese', 'høytlesing', 'avis', 'bok', 'prate', 'selskap'] },
    { id: 'kirke',     navn: 'Følge til kirke',       ikon: '⛪', ord: ['kirke', 'gudstjeneste', 'menighet', 'moské'] },
    { id: 'kultur',    navn: 'Kultur og aktivitet',   ikon: '🎭', ord: ['kino', 'konsert', 'museum', 'teater', 'bingo', 'kafé'] },
    { id: 'dyrepass',  navn: 'Kjæledyr',              ikon: '🐕', ord: ['hund', 'katt', 'lufte', 'dyrlege', 'fôr'] }
  ];

  /* Over helsegrensen. Disse foreslås aldri – de rapporteres, med begrunnelse.

     Stammer, ikke hele ord: «dusje» fanget ikke «dusjing», og en glipp her er
     farligere enn en falsk positiv. Samme lærdom som i akuttfilteret, motsatt
     retning: der var falske positive problemet, her er det de falske negative. */
  var HELSEORD = [
    'medisin', 'tablett', 'dosett', 'pille', 'sår', 'bandasj', 'stell', 'stelle',
    'bleie', 'dusj', 'bade', 'vaske henne', 'vaske ham', 'injeksjon', 'sprøyt',
    'blodtrykk', 'blodsukker', 'insulin', 'kateter', 'sonde', 'løfte',
    'toalett', 'do ', 'inkontinens', 'kompresjon', 'støttestrømpe', 'salve',
    'øyedråp', 'måle puls', 'temperatur'
  ];

  function normaliser(t) {
    return String(t || '').toLowerCase().replace(/[.,;:!?()«»"]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* Stammematching: ordet må starte et ord, men kan fortsette. «dusj» treffer
     «dusjing» og «dusjer», men ikke «adusj». */
  function traff(tekst, ord) {
    return ord.some(function (o) {
      var m = o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('(^|\\s)' + m, 'i').test(tekst);
    });
  }

  /* Noen ord betyr helsehjelp om et menneske, og hverdagsoppgave om et dyr.
     «Bade hunden» er ikke stell. Konteksten avgjør, og bare for disse ordene. */
  var TVETYDIG = ['bade', 'vaske', 'stell', 'stelle', 'løfte', 'dusj'];
  var DYREORD = ['hund', 'katt', 'kanin', 'kjæledyr', 'dyret', 'valp'];

  function erHelse(tekst) {
    var funn = HELSEORD.filter(function (o) { return traff(tekst, [o]); });
    if (!funn.length) return funn;

    var omDyr = traff(tekst, DYREORD);
    if (!omDyr) return funn;

    // Om teksten handler om et dyr, teller bare de entydige helseordene.
    return funn.filter(function (o) { return TVETYDIG.indexOf(o) === -1; });
  }

  function klassifiser(tekst) {
    var t = normaliser(tekst);
    var helse = erHelse(t);
    if (helse.length) return { type: 'over_grensen', ord: helse };

    var funn = KANDIDATER.filter(function (k) { return traff(t, k.ord); });
    if (funn.length) return { type: 'kandidat', kandidat: funn[0] };

    return { type: 'ukjent' };
  }

  /**
   * Samler alt som ikke passet inn i dagens tilbud.
   * @param {Array} kilder - {tekst, dato, kunde, opphav}
   * @param {Array} aktiveOppgaver - id-er leverandøren allerede tilbyr
   */
  function analyser(kilder, aktiveOppgaver) {
    var aktive = aktiveOppgaver || [];
    var kandidater = {};
    var overGrensen = [];
    var ukjent = [];

    (kilder || []).forEach(function (k) {
      var r = klassifiser(k.tekst);

      if (r.type === 'over_grensen') {
        overGrensen.push({ tekst: k.tekst, dato: k.dato, kunde: k.kunde, ord: r.ord });
        return;
      }
      if (r.type === 'ukjent') {
        ukjent.push({ tekst: k.tekst, dato: k.dato, kunde: k.kunde });
        return;
      }

      var id = r.kandidat.id;
      if (aktive.indexOf(id) !== -1) return;   // tilbys allerede
      kandidater[id] = kandidater[id] || { kandidat: r.kandidat, antall: 0, kunder: {}, eksempler: [] };
      kandidater[id].antall++;
      kandidater[id].kunder[k.kunde || '?'] = true;
      if (kandidater[id].eksempler.length < 3) kandidater[id].eksempler.push(k.tekst);
    });

    var forslag = Object.keys(kandidater).map(function (id) {
      var d = kandidater[id];
      return {
        id: id,
        navn: d.kandidat.navn,
        ikon: d.kandidat.ikon,
        antall: d.antall,
        antallKunder: Object.keys(d.kunder).length,
        eksempler: d.eksempler,
        /* Terskelen er bevisst lav, men krever mer enn én kunde. Én kunde som
           spør fem ganger er én kunde, ikke et behov. */
        moden: d.antall >= 3 && Object.keys(d.kunder).length >= 2
      };
    }).sort(function (a, b) { return b.antall - a.antall || b.antallKunder - a.antallKunder; });

    return {
      forslag: forslag,
      overGrensen: overGrensen,
      ukjent: ukjent,
      sum: (kilder || []).length
    };
  }

  /* Setningen leverandøren faktisk leser. Tall alene overbeviser ingen. */
  function formuler(f) {
    return 'Denne måneden ble ' + f.navn.toLowerCase() + ' etterspurt ' + f.antall +
           ' ganger av ' + f.antallKunder + ' ulike kunder. Det står ikke i tilbudet deres.';
  }

  return {
    KANDIDATER: KANDIDATER,
    HELSEORD: HELSEORD,
    klassifiser: klassifiser,
    analyser: analyser,
    formuler: formuler
  };
})();
