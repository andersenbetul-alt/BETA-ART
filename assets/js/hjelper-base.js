/* Naviar Care – basen over kandidater og medarbeidere.

   En CV er det verste vedlegget vi kan ta imot. Den inneholder fødselsdato,
   sivilstand, bilde, ofte helseopplysninger og alltid mer enn vi trenger – og
   når den først ligger der, er den vår å slette, vår å sikre og vår å svare
   for. Derfor tar vi ikke imot filer. Vi tar imot felter.

   Prinsippet er det samme som i besøkene: et felt som ikke finnes, kan ikke
   fylles ut i en travel situasjon. Forskjellen her er at kandidaten selv vil
   fylle det ut – folk sender gjerne mer enn de blir bedt om – og da må
   sperren stå i mottaket, ikke i instruksen. */

window.PP_HJELPERBASE = (function () {
  'use strict';

  var NOKKEL = 'pp_hjelperbase_v1';

  /* Feltene som finnes. Hvert av dem har en grunn til å være her, og en
     frist. Teksten snakker til kandidaten, fordi lista vises for henne:
     hun skal kunne se hvorfor vi spør, uten å måtte spørre.
      Legger noen til et felt uten begge deler, feiler en test. */
  var FELT = [
    { id: 'fornavn',      navn: 'Fornavn',            hvorfor: 'Vi må kunne tiltale deg', frist: 'ansatt' },
    { id: 'etternavn',    navn: 'Etternavn',          hvorfor: 'Kreves for arbeidsavtale og identitet', frist: 'ansatt' },
    { id: 'telefon',      navn: 'Telefon',            hvorfor: 'Eneste kanal som virker mens et oppdrag pågår', frist: 'ansatt' },
    { id: 'epost',        navn: 'E-post',             hvorfor: 'Søknadsdialog og opplæring', frist: 'ansatt' },
    { id: 'bydel',        navn: 'Bydel',              hvorfor: 'Oppdrag tildeles etter område', frist: 'ansatt' },
    { id: 'transport',    navn: 'Hvordan du kommer deg fram', hvorfor: 'Avgjør hvilke oppdrag som er realistiske', frist: 'ansatt' },
    { id: 'dager',        navn: 'Dager du kan arbeide', hvorfor: 'Oppdrag tildeles bare innenfor tiden du har sagt ja til', frist: 'ansatt' },
    { id: 'tider',        navn: 'Tider på dagen',      hvorfor: 'Samme: kveldsoppdrag går ikke til den som bare kan formiddag', frist: 'ansatt' },
    { id: 'norsknivaa',   navn: 'Norsknivå',           hvorfor: 'B1 er minstekravet for å arbeide alene hos en eldre person', frist: 'ansatt' },
    { id: 'andreSprak',   navn: 'Andre språk',         hvorfor: 'Kunder kan ønske et språk', frist: 'ansatt' },
    { id: 'erfaring',     navn: 'Kort om erfaring',    hvorfor: 'Vurdering av søknaden', frist: 'avslag_kort' },
    { id: 'referanser',   navn: 'To referanser, navn og telefon', hvorfor: 'Kontrolleres før opptak', frist: 'referanse' },
    { id: 'status',       navn: 'Hvor i opptaket hun er', hvorfor: 'Prosessen må kunne fortsette', frist: 'ansatt' },
    { id: 'identBekreftet', navn: 'Identitet bekreftet: ja, dato, metode', hvorfor: 'Dokumentasjon på at kontrollen skjedde', frist: 'ansatt' },
    { id: 'arbeidsforhold', navn: 'Ansatt eller foretak', hvorfor: 'Avgjør lønn, forsikring og ansvar', frist: 'ansatt' },
    { id: 'proveresultat', navn: 'Prøveresultat i prosent', hvorfor: 'Dokumentasjon på gjennomført opplæring', frist: 'ansatt' },
    { id: 'opprettet',    navn: 'Dato søknaden kom',   hvorfor: 'Styrer slettefristen', frist: 'ansatt' }
  ];

  /* Feltene som ikke finnes, og hvorfor. Lista er like viktig som den over:
     den er svaret neste gang noen spør «kan vi ikke bare lagre …». */
  var FINNES_IKKE = [
    { hva: 'CV som fil',            hvorfor: 'Inneholder alltid mer enn vi trenger, og vi kan ikke sortere i en PDF' },
    { hva: 'Fødselsdato',           hvorfor: 'Vi trenger å vite at hun er over 18, ikke hvor gammel hun er' },
    { hva: 'Fødselsnummer',         hvorfor: 'Trengs først ved ansettelse, og da av lønn – ikke av opptaket' },
    { hva: 'Adresse',               hvorfor: 'Bydel er nok til å tildele oppdrag' },
    { hva: 'Bilde av kandidaten',   hvorfor: 'Kan ikke brukes i en vurdering, og inviterer til å bli brukt' },
    { hva: 'Kopi av legitimasjon',  hvorfor: 'Identitet bekreftes, den arkiveres ikke' },
    { hva: 'Kopi av oppholdstillatelse', hvorfor: 'Samme: kontrollen dokumenteres, dokumentet lagres ikke' },
    { hva: 'Sivilstand og barn',    hvorfor: 'Ikke relevant for arbeidet, og egnet til å farge en vurdering' },
    { hva: 'Helseopplysninger',     hvorfor: 'Særlig kategori. Vi har ikke grunnlag, og trenger det ikke' },
    { hva: 'Referat fra referansesamtalen', hvorfor: 'Konklusjonen lagres, samtalen gjør det ikke' },
    { hva: 'Politiattest',          hvorfor: 'Kan ikke kreves uten hjemmel – se PP_HJELPER.POLITIATTEST' },
    { hva: 'Karakterer og vitnemål', hvorfor: 'Ingen av oppgavene i katalogen krever utdanning' }
  ];

  /* Alderskravet er «over 18», ikke «hvor gammel». Et ja/nei kan ikke brukes
     til å sortere kandidater etter alder; en fødselsdato kan. */
  var ALDER = { spor: 'Er du fylt 18 år?', lagres: 'ja/nei', lagresIkke: 'fødselsdato' };

  /* Ingen vedlegg. Sperren står i mottaket fordi folk sender mer enn de blir
     bedt om – og en fil vi har mottatt, er vår enten vi ba om den eller ei. */
  var VEDLEGG = { tas_imot: false,
    hvorfor: 'En mottatt fil er vår å slette, sikre og svare for, også når vi ikke ba om den',
    beskjed: 'Vi tar ikke imot CV eller vedlegg. Feltene i skjemaet er det vi trenger.' };

  /* Slettefristene. Tallene er satt av oss og skal bekreftes av jurist – de
     står her som en beslutning, ikke som en påstand om hva loven krever. */
  var FRISTER = {
    avslag_kort:  { dager: 90,  gjelder: 'Kandidat som ikke går videre',
                    hvorfor: 'Lang nok til å svare på et spørsmål om prosessen, kort nok til at basen ikke blir et arkiv' },
    referanse:    { dager: 90,  gjelder: 'Referansenes kontaktopplysninger',
                    hvorfor: 'De er ikke søkere. De sa ja til én samtale, ikke til å ligge i en base' },
    trukket:      { dager: 30,  gjelder: 'Kandidat som trekker søknaden selv',
                    hvorfor: 'Hun har sagt fra. Da er det ingenting igjen å vurdere' },
    ansatt:       { dager: null, gjelder: 'Aktiv medarbeider',
                    hvorfor: 'Slettes etter arbeidsforholdets slutt, etter reglene for personalmapper',
                    maaAvklares: true }
  };

  var STATUSER = ['ny', 'identitet', 'referanse', 'intervju', 'opplaering',
                  'proveoppdrag', 'aktiv', 'avslag', 'trukket'];

  function nå() { return new Date().toISOString(); }

  function felt(id) {
    return FELT.filter(function (f) { return f.id === id; })[0] || null;
  }

  /* Tar imot en søknad. Alt som ikke er et kjent felt, faller bort før
     lagring – ikke etterpå. Fritekstfeltet går gjennom PP_VERN, som er det
     samme filteret rapportene bruker. */
  function taImot(inn) {
    var raa = inn || {};
    var ren = {};
    var avvist = [];

    Object.keys(raa).forEach(function (k) {
      if (!felt(k)) { avvist.push(k); return; }
      ren[k] = raa[k];
    });

    if (ren.erfaring && window.PP_VERN) {
      var v = window.PP_VERN.sjekk(ren.erfaring);
      if (!v.ok) {
        delete ren.erfaring;
        return { ok: false, avvist: avvist,
                 grunn: 'Fritekstfeltet inneholdt noe som ikke skal lagres',
                 kategorier: v.funn.map(function (f) { return f.id; }) };
      }
    }

    ren.opprettet = nå();
    ren.status = STATUSER.indexOf(ren.status) !== -1 ? ren.status : 'ny';
    return { ok: true, kandidat: ren, avvist: avvist };
  }

  /* Fristen som gjelder for en kandidat, gitt hvor hun står. */
  function fristFor(kandidat) {
    var k = kandidat || {};
    if (k.status === 'aktiv') return FRISTER.ansatt;
    if (k.status === 'trukket') return FRISTER.trukket;
    if (k.status === 'avslag') return FRISTER.avslag_kort;
    return FRISTER.avslag_kort;
  }

  function skalSlettes(kandidat, naa) {
    var f = fristFor(kandidat);
    if (!f || f.dager === null) return false;
    var fra = new Date(kandidat.opprettet).getTime();
    if (isNaN(fra)) return false;
    var tid = (naa ? new Date(naa) : new Date()).getTime();
    return tid - fra >= f.dager * 86400000;
  }

  /* Kjører ved hver lesning, som i besøkene. En sletterutine som ikke kjører,
     er ikke en sletterutine – den er en setning i en personvernerklæring. */
  function rydd(base, naa) {
    var b = base || { kandidater: [] };
    b.kandidater = (b.kandidater || []).filter(function (k) {
      return !skalSlettes(k, naa);
    });
    return b;
  }

  function les() {
    try {
      var raa = localStorage.getItem(NOKKEL);
      var b = rydd(raa ? JSON.parse(raa) : { kandidater: [] });
      localStorage.setItem(NOKKEL, JSON.stringify(b));
      return b;
    } catch (e) {
      return { kandidater: [] };
    }
  }

  function skriv(base) {
    try { localStorage.setItem(NOKKEL, JSON.stringify(base)); } catch (e) {}
    return base;
  }

  /* Søk i basen. Bare på det som har med arbeidet å gjøre: bydel, språknivå,
     når hun kan jobbe og hvor i opptaket hun står. Ingen av de personlige
     egenskapene finnes som felt, så de kan heller ikke søkes på. */
  var SOKBART = ['bydel', 'norsknivaa', 'andreSprak', 'dager', 'tider', 'status'];

  function sok(base, kriterier) {
    var k = kriterier || {};
    Object.keys(k).forEach(function (n) {
      if (SOKBART.indexOf(n) === -1) throw new Error('Ikke søkbart felt: ' + n);
    });
    return (base.kandidater || []).filter(function (kand) {
      return Object.keys(k).every(function (n) {
        var v = kand[n];
        if (Array.isArray(v)) return v.indexOf(k[n]) !== -1;
        return v === k[n];
      });
    });
  }

  return {
    FELT: FELT,
    FINNES_IKKE: FINNES_IKKE,
    ALDER: ALDER,
    VEDLEGG: VEDLEGG,
    FRISTER: FRISTER,
    STATUSER: STATUSER,
    SOKBART: SOKBART,
    felt: felt,
    taImot: taImot,
    fristFor: fristFor,
    skalSlettes: skalSlettes,
    rydd: rydd,
    les: les,
    skriv: skriv,
    sok: sok
  };
})();
