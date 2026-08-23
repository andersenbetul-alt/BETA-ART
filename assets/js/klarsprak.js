/* Naviar – klart språk, som en sperre og ikke som en oppfordring.

   Målgruppa er delt i to, og begge halvdelene har det travelt på hver sin
   måte: pårørende på 45 som leser mellom to møter, og en eldre på 82 som
   leser med brillene på skrå. Ingen av dem skal måtte lese en setning to
   ganger for å finne ut hva de skal gjøre.

   Klarspråk er ikke å skrive enkelt. Det er å skrive slik at leseren finner
   svaret sitt første gang. Forskjellen merkes tydeligst i det som går galt:
   en setning som er «korrekt» kan være ubrukelig, og da er den ikke korrekt.

   Modulen måler tre ting og stopper på det fjerde:

     LIX      – hvor tung teksten er å lese, som et tall
     lengde   – setninger som har vokst seg for lange
     ord      – kanselli-ord som har et vanlig ord ved siden av seg
     form     – passiv og substantivsykdom, som skjuler hvem som gjør hva

   Den siste er den viktigste her. «Oppdraget vil bli vurdert» sier ikke hvem
   som vurderer. I en tjeneste der spørsmålet hele tiden er hvem som
   bestemmer, er passiv ikke en stilfeil – den er en unnvikelse. */

window.PP_KLARSPRAK = (function () {
  'use strict';

  /* LIX etter Björnssons formel, som er den norske forvaltningen måler med:
     gjennomsnittlig setningslengde pluss andelen ord på over seks bokstaver.

     Første utgave hadde én grense for alt: 40. Den var feil, og målingene
     viste det med en gang.

     personvern.html ligger på 44 med en gjennomsnittlig setning på sju ord.
     Sju. Det er ikke en tung tekst – det er en tekst der 37 % av ordene er
     lengre enn seks bokstaver, og der ordene er «samtykke», «oppdrag»,
     «posisjon», «opplysninger», «familien», «hjelper». Ingen av dem er
     kanselli. Det finnes ikke noe kortere og korrekt ord for
     «personopplysninger».

     Norsk lager lange ord ved å sette dem sammen. LIX straffer da
     sammensetningen, ikke uklarheten – og en forfatter som jager tallet
     ender med å skrive dårligere norsk for å score bedre.

     Derfor to endringer:

     1. Grensa følger teksttypen. En skjerm der noen skal bestemme noe, tåler
        ikke det en personvernerklæring må tåle.
     2. De to halvdelene av LIX rapporteres hver for seg. Setningslengden kan
        forfatteren gjøre noe med. Ordlengden er som regel gitt av fagfeltet,
        og da er det ikke hennes feil.

     Kanselli, passiv og substantivsykdom er strenge uansett type. De er
     alltid mulige å rette. */
  var TYPE = {
    beslutning: { lix: 35, snitt: 14,
      navn: 'Skjerm der noen bestemmer noe',
      hvorfor: 'Her leses det én gang, og valget tas rett etterpå' },
    informasjon: { lix: 42, snitt: 18,
      navn: 'Forside og informasjonsside',
      hvorfor: 'Leseren skanner, og skal finne svaret sitt uten å lese alt' },
    juridisk: { lix: 50, snitt: 15,
      navn: 'Personvern, vilkår',
      hvorfor: 'Fagordene er lange og kan ikke byttes. Setningene kan fortsatt være korte' }
  };

  var STANDARDTYPE = 'informasjon';

  /* Setninger over 25 ord. Ikke fordi lange setninger er feil, men fordi en
     setning på 30 ord som regel er to setninger som ikke har fått lov. */
  var ORD_MAKS = 25;

  /* Kanselli-ordene, med det vanlige ordet ved siden av. Lista er kort med
     vilje: den skal kunne leses, ikke slås opp i. */
  var ORD = [
    { fra: 'i forhold til',        til: 'for, om, eller sammenlignet med' },
    { fra: 'i henhold til',        til: 'etter' },
    { fra: 'med hensyn til',       til: 'om' },
    { fra: 'vedrørende',           til: 'om' },
    { fra: 'således',              til: 'slik' },
    { fra: 'herunder',             til: 'blant annet' },
    { fra: 'samtlige',             til: 'alle' },
    { fra: 'foreta',               til: 'gjøre' },
    { fra: 'benytte',              til: 'bruke' },
    { fra: 'anmode',               til: 'be om' },
    { fra: 'erholde',              til: 'få' },
    { fra: 'inneværende',          til: 'denne' },
    { fra: 'påfølgende',           til: 'neste' },
    { fra: 'vederlagsfritt',       til: 'gratis' },
    { fra: 'iverksette',           til: 'starte' },
    { fra: 'avholde',              til: 'holde' },
    { fra: 'på nåværende tidspunkt', til: 'nå' },
    { fra: 'i den forbindelse',    til: 'stryk den' },
    { fra: 'problemstilling',      til: 'spørsmål' },
    { fra: 'tilstrekkelig',        til: 'nok' },
    { fra: 'øvrige',               til: 'andre' },
    { fra: 'angjeldende',          til: 'denne' }
  ];

  /* Substantivsykdom: en handling gjort om til et substantiv, med et blekt
     verb ved siden av. «Foreta en vurdering» i stedet for «vurdere».
     Setningen blir lengre og hvem som handler blir borte. */
  var SUBSTANTIVSYKDOM =
    /\b(foreta|gjennomføre|utføre|iverksette|igangsette|utøve|besørge)\s+(en\s+|et\s+|)\w+(ing|else|sjon)\b/i;

  /* Passiv i to former: s-passiv og bli-passiv. Begge skjuler hvem som gjør
     det, og det er nettopp det denne tjenesten ikke kan tillate seg. */
  var PASSIV = [
    /\b(?:vil\s+)?bli(?:r|tt)?\s+\w+(?:et|t|de)\b/i,
    /\b\w{4,}(?:eres|res)\b(?!\s*(?:seg))/i
  ];

  function setninger(tekst) {
    return String(tekst || '')
      .split(/(?<=[.!?:])\s+|\n+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  function ord(tekst) {
    var treff = String(tekst || '').match(/[A-Za-zÆØÅæøå'\-]+/g);
    return treff || [];
  }

  /* LIX. Returnerer null for tekst som er for kort til at tallet betyr noe –
     et LIX-tall regnet av én setning er støy, ikke måling. */
  function lix(tekst) {
    var s = setninger(tekst);
    var o = ord(tekst);
    if (o.length < 20) return null;

    var lange = o.filter(function (w) { return w.length > 6; }).length;
    var verdi = (o.length / Math.max(s.length, 1)) + (lange / o.length) * 100;
    return Math.round(verdi * 10) / 10;
  }

  function nivaa(verdi) {
    if (verdi === null) return { id: 'ukjent', navn: 'For kort til å måles' };
    if (verdi < 30) return { id: 'svaert_lett', navn: 'Svært lett' };
    if (verdi < 40) return { id: 'lett', navn: 'Lett' };
    if (verdi < 50) return { id: 'middels', navn: 'Middels' };
    return { id: 'tungt', navn: 'Tungt' };
  }

  /* Sjekker en tekst. Returnerer funn med både hva og hva i stedet – et funn
     uten alternativ blir stående, fordi den som skriver ikke vet hva hun
     skal gjøre med det. */
  function sjekk(tekst, type) {
    var t = String(tekst || '');
    var funn = [];
    var regel = TYPE[type] || TYPE[STANDARDTYPE];

    if (!t.trim()) return { ok: true, lix: null, funn: [] };

    var verdi = lix(t);
    var s2 = setninger(t);
    var o2 = ord(t);
    var snitt = s2.length ? Math.round((o2.length / s2.length) * 10) / 10 : 0;

    /* Setningslengden først. Den er den halvdelen forfatteren rår over, og
       derfor den eneste det er rimelig å be henne gjøre noe med. */
    if (snitt > regel.snitt) {
      funn.push({ id: 'snitt',
                  hva: 'Setningene er i snitt ' + snitt + ' ord. Grensen er ' + regel.snitt,
                  istedenfor: 'Del de lengste i to',
                  verdi: snitt });
    }

    if (verdi !== null && verdi > regel.lix) {
      var lange = o2.filter(function (w) { return w.length > 6; }).length;
      var andel = Math.round((lange / o2.length) * 100);
      funn.push({ id: 'lix',
                  hva: 'LIX ' + verdi + ' mot grensen ' + regel.lix + ' for «' + regel.navn + '»',
                  istedenfor: snitt <= regel.snitt
                    ? 'Setningene er korte nok. Det er ordene: ' + andel +
                      ' % er over seks bokstaver. Sjekk om noen av dem har et vanlig ord ved siden av seg'
                    : 'Kortere setninger først',
                  verdi: verdi, andelLangeOrd: andel });
    }

    s2.forEach(function (s, i) {
      var n = ord(s).length;
      if (n > ORD_MAKS) {
        funn.push({ id: 'lang_setning', setning: i + 1,
                    hva: 'Setning ' + (i + 1) + ' har ' + n + ' ord. Grensen er ' + ORD_MAKS,
                    istedenfor: 'Del den i to. Den er som regel to setninger allerede' });
      }
    });

    var lav = t.toLowerCase();
    ORD.forEach(function (o) {
      if (lav.indexOf(o.fra) !== -1) {
        funn.push({ id: 'kanselli', hva: '«' + o.fra + '»', istedenfor: o.til });
      }
    });

    if (SUBSTANTIVSYKDOM.test(t)) {
      funn.push({ id: 'substantivsykdom',
                  hva: 'En handling er gjort om til et substantiv',
                  istedenfor: 'Bruk verbet: «vurdere», ikke «foreta en vurdering»' });
    }

    PASSIV.forEach(function (m) {
      if (m.test(t)) {
        funn.push({ id: 'passiv',
                    hva: 'Passiv form skjuler hvem som gjør det',
                    istedenfor: 'Skriv hvem som handler: «Kari godkjenner», ikke «oppdraget godkjennes»' });
      }
    });

    /* Ett funn per type. Fem påminnelser om det samme er ikke fem funn –
       det er én ting å rette. */
    var sett = {};
    funn = funn.filter(function (f) {
      var n = f.id + (f.hva || '');
      if (sett[n]) return false;
      sett[n] = true;
      return true;
    });

    return { ok: funn.length === 0, lix: verdi, nivaa: nivaa(verdi),
             type: type || STANDARDTYPE, snittSetning: snitt, funn: funn };
  }

  /* Måler en hel flate og sier hvor det er tyngst. Brukes på sidene, ikke på
     enkeltsetninger. */
  function maal(tekst) {
    var verdi = lix(tekst);
    var s = setninger(tekst);
    var o = ord(tekst);
    return {
      lix: verdi,
      nivaa: nivaa(verdi),
      setninger: s.length,
      ord: o.length,
      snittSetning: s.length ? Math.round((o.length / s.length) * 10) / 10 : 0,
      lengste: s.reduce(function (a, b) {
        return ord(b).length > ord(a).length ? b : a;
      }, s[0] || '')
    };
  }

  return {
    TYPE: TYPE,
    STANDARDTYPE: STANDARDTYPE,
    ORD_MAKS: ORD_MAKS,
    ORD: ORD,
    lix: lix,
    nivaa: nivaa,
    setninger: setninger,
    ord: ord,
    sjekk: sjekk,
    maal: maal
  };
})();
