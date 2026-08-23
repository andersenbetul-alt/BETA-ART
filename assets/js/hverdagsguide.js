/* Naviar Care – Hverdagsguide.

   Redaksjonelt innhold, skrevet av oss. Det er en viktig forskjell fra det
   første forslaget, som var at eldre skulle skrive sine egne blogger: en
   åpen publiseringsflate for eldre mennesker inviterer til å skrive ned når
   man er alene hjemme, hvilken medisin man tar og hvem som har nøkkel. Vi
   ville da vært vert for det, ansvarlig for å moderere det, og pliktig til å
   slette det på forespørsel.

   Guiden løser det samme behovet – å bli sett som et menneske og ikke som en
   mottaker – uten å gjøre et hjem offentlig.

   Reglene under er ikke redaksjonell smak. De er de samme grensene som
   gjelder resten av tjenesten, skrevet om til tekst som skal publiseres. */

window.PP_GUIDE = (function () {
  'use strict';

  /* Fordelingen er en beslutning, ikke en observasjon. Skriver vi mest til
     eldre, får vi lesere som ikke bestiller; skriver vi bare til familien,
     blir den eldre et objekt i vår egen tekst. */
  var MALGRUPPE = [
    { id: 'familie',     navn: 'Familier som bor et annet sted', andel: 70 },
    { id: 'eldre',       navn: 'Eldre som vil bo hjemme',        andel: 20 },
    { id: 'medarbeider', navn: 'De som vil bli medarbeider',     andel: 10 }
  ];

  var KATEGORI = [
    { id: 'avstand',   navn: 'Når familien bor langt unna',  prioritet: 1, malgruppe: 'familie' },
    { id: 'hjemme',    navn: 'Å bo hjemme lenger',           prioritet: 2, malgruppe: 'eldre' },
    { id: 'praktisk',  navn: 'Praktisk hjelp i hverdagen',   prioritet: 3, malgruppe: 'familie' },
    { id: 'samtalen',  navn: 'Å snakke om hjelp',            prioritet: 4, malgruppe: 'familie' },
    { id: 'digital',   navn: 'Digital trygghet',             prioritet: 5, malgruppe: 'eldre' },
    { id: 'sosialt',   navn: 'Sosialt liv',                  prioritet: 6, malgruppe: 'eldre' },
    { id: 'offentlig', navn: 'Hva kommunen tilbyr',          prioritet: 7, malgruppe: 'familie' }
  ];

  /* De tolv første. Rekkefølgen er etter hva en familie faktisk søker på når
     bekymringen er ny, ikke etter hva som er lettest å skrive. */
  var ARTIKLER = [
    { nr: 1,  kategori: 'avstand',  malgruppe: 'familie',
      tittel: 'Slik hjelper du eldre foreldre når du bor langt unna' },
    { nr: 2,  kategori: 'praktisk', malgruppe: 'familie',
      tittel: 'Ti små oppgaver som gjør det enklere å bo hjemme' },
    { nr: 3,  kategori: 'samtalen', malgruppe: 'familie',
      tittel: 'Hvordan snakke med foreldrene dine om hjelp – uten å ta fra dem kontrollen' },
    { nr: 4,  kategori: 'offentlig', malgruppe: 'familie',
      tittel: 'Hjemmetjeneste, praktisk bistand og privat hverdagshjelp – hva er forskjellen?' },
    { nr: 5,  kategori: 'offentlig', malgruppe: 'familie',
      tittel: 'Når er hverdagshjelp nok, og når bør du kontakte helsepersonell?' },
    { nr: 6,  kategori: 'praktisk', malgruppe: 'familie',
      tittel: 'Slik lager du et tydelig handleoppdrag' },
    { nr: 7,  kategori: 'digital',  malgruppe: 'eldre',
      tittel: 'Hva skal en hjelper aldri be om? BankID, PIN-koder og betaling' },
    { nr: 8,  kategori: 'sosialt',  malgruppe: 'eldre',
      tittel: 'Sosialt besøk: liten innsats som kan bety mye' },
    { nr: 9,  kategori: 'praktisk', malgruppe: 'familie',
      tittel: 'Sjekkliste før noen skal hjelpe foreldrene dine hjemme' },
    { nr: 10, kategori: 'avstand',  malgruppe: 'familie',
      tittel: 'Hva ser familien, den eldre og hjelperen i Naviar?' },
    { nr: 11, kategori: 'hjemme',   malgruppe: 'eldre',
      tittel: 'Slik beholder den eldre kontrollen over hjelpen' },
    { nr: 12, kategori: 'offentlig', malgruppe: 'familie',
      tittel: 'Hvilken hjelp kan kommunen tilby hjemme?' }
  ];

  /* Det guiden ikke publiserer. Hver linje har en grunn, og grunnen er den
     samme grensen som gjelder tjenesten ellers. */
  var PUBLISERES_IKKE = [
    { hva: 'Diagnoser og behandlingsråd',
      hvorfor: 'Det er helsehjelp, også når det står i en artikkel',
      istedenfor: 'Forklar kort, og lenk til Helsenorge' },
    { hva: 'Anbefalinger om medisiner',
      hvorfor: 'Samme grense som i katalogen. Den flytter seg ikke fordi teksten er generell',
      istedenfor: 'Vis til fastlege eller apotek' },
    { hva: 'Individuelle juridiske vurderinger',
      hvorfor: 'Vi er ikke rådgivere, og en leser som følger rådet, tror vi er det',
      istedenfor: 'Beskriv hvordan regelen er, ikke hva leseren bør gjøre' },
    { hva: 'Historier om hjelpeløse eldre',
      hvorfor: 'Kundene våre klarer seg selv. Det er hele forutsetningen for tjenesten',
      istedenfor: 'Skriv om mennesker som løser noe, ikke om mennesker det skjer noe med' },
    { hva: 'Tekst skrevet for søkemotorer',
      hvorfor: 'Den leses av mennesker som er bekymret. De merker forskjellen',
      istedenfor: 'Svar på spørsmålet, og slutt når det er svart' },
    { hva: 'Åpent kommentarfelt eller forum',
      hvorfor: 'Gjør oss til vert for andres innhold, med moderering, sletteplikt og ansvar',
      istedenfor: 'Én kontaktvei til operasjon' }
  ];

  /* Hver artikkel slutter med en handling, og handlingen skal være den
     leseren allerede var på vei mot. En artikkel som ender i et salg leseren
     ikke ba om, er en annonse med overskrift. */
  var AVSLUTNING = {
    familie: 'Trenger foreldrene dine litt praktisk hjelp? Se hvilke oppdrag du kan opprette.',
    eldre: 'Vil du bestemme selv hva du får hjelp til? Slik fungerer det.',
    medarbeider: 'Vil du gjøre hverdagen enklere for noen i nærheten? Slik blir du medarbeider.'
  };


  /* Henvisningene.

     Dette er guidens sterkeste del, og den er ikke innholdsmarkedsføring. Et
     nei uten en adresse er et nei som sender folk tilbake til Google, og det
     neste treffet der har ingen grense.

     Vi kan ikke gi helsehjelp. Vi kan si nøyaktig hvem som kan – og det er
     den eneste versjonen av «nei» som faktisk hjelper noen. */
  var HENVISNING = [
    { id: 'medisin', behov: 'Hjelp med medisiner',
      vi_gjor_ikke: 'Sette doser, gi medisin eller endre på noe',
      til: ['Fastlegen', 'Apoteket', 'Hjemmesykepleien i kommunen'],
      hast: null },
    { id: 'saar', behov: 'Sår, bandasje eller sprøyte',
      vi_gjor_ikke: 'Sårstell, injeksjon, noe medisinsk',
      til: ['Fastlegen', 'Hjemmesykepleien'],
      hast: null },
    { id: 'fall', behov: 'Noen har falt',
      vi_gjor_ikke: 'Løfte personen opp eller vurdere skaden',
      til: ['113 ved fare for liv og helse', '116 117 når det ikke kan vente til fastlegen åpner'],
      hast: '113' },
    { id: 'stell', behov: 'Dusj, toalett, påkledning',
      vi_gjor_ikke: 'Personlig stell og tunge forflytninger',
      til: ['Hjemmetjenesten i kommunen'],
      hast: null },
    { id: 'hukommelse', behov: 'Hukommelsen svikter',
      vi_gjor_ikke: 'Stille en diagnose eller vurdere helsetilstand',
      til: ['Fastlegen', 'Demensteamet i kommunen'],
      hast: null },
    { id: 'bank', behov: 'BankID, PIN eller nettbank',
      vi_gjor_ikke: 'Røre koder, konto eller BankID. Aldri, uansett hvem som spør',
      til: ['Bankens egen kundeservice'],
      hast: null },
    { id: 'fagarbeid', behov: 'Elektrisk, rørlegger, tunge løft',
      vi_gjor_ikke: 'Fagarbeid, stiger, tunge løft',
      til: ['Autorisert håndverker'],
      hast: null },
    { id: 'trygghet', behov: 'Trenger tilsyn eller alarm',
      vi_gjor_ikke: 'Overvåking eller beredskap. Vi er ikke en nødtjeneste',
      til: ['Trygghetsalarm fra kommunen'],
      hast: null }
  ];

  /* Lesestandard. Tallene er ikke en stilpreferanse – de er hva som gjør at
     en tekst kan leses av noen som er bekymret, eller sliten, eller åtti. */
  var LESESTANDARD = {
    ettSporsmaal: true,
    ordMaks: 300,
    lesetidMinutter: 3,
    kortSvarSekunder: 20,
    stegMaks: 3,
    telefonStort: true,
    valg: ['Lytt', 'Skriv ut', 'Send til familien min'],
    gjentaTilSlutt: true
  };

  /* Under hver artikkel, og den er ikke en formalitet. */
  var FORBEHOLD = 'Dette er generell informasjon. Det erstatter ikke en ' +
    'medisinsk vurdering eller en helsetjeneste. Sist gjennomgått: ';

  /* Før publisering: medisinske temaer av helsepersonell, grensene av jurist.
     Vi skriver om hvor grensen går, ikke om hva som er på den andre siden. */
  var GODKJENNES_AV = [
    { tema: 'Medisinsk innhold', av: 'helsepersonell' },
    { tema: 'Grensene for tjenesten', av: 'jurist eller personvernrådgiver' }
  ];

  function henvisning(id) {
    return HENVISNING.filter(function (h) { return h.id === id; })[0] || null;
  }

  var STI = '/hverdagsguide';

  function kategori(id) {
    return KATEGORI.filter(function (k) { return k.id === id; })[0] || null;
  }

  function artiklerFor(malgruppe) {
    return ARTIKLER.filter(function (a) { return a.malgruppe === malgruppe; });
  }

  /* Faktisk fordeling mot den vi bestemte. Sier fra når planen har skled. */
  function fordeling() {
    return MALGRUPPE.map(function (m) {
      var n = artiklerFor(m.id).length;
      var faktisk = Math.round((n / ARTIKLER.length) * 100);
      return { id: m.id, navn: m.navn, planlagt: m.andel, faktisk: faktisk,
               antall: n, avvik: faktisk - m.andel };
    });
  }

  /* Sjekker et utkast før publisering. Bruker PP_MERKESPRAK for påstander vi
     ikke kan stå for, og PP_VERN for det som ikke skal lagres i det hele
     tatt – begge ligger ett sted, og guiden arver dem. */
  function sjekkUtkast(tekst) {
    var funn = [];

    if (window.PP_MERKESPRAK) {
      var m = window.PP_MERKESPRAK.sjekk(tekst, 'artikkel');
      m.funn.forEach(function (f) {
        funn.push({ kilde: 'merkespråk', id: f.id, hva: f.hva, istedenfor: f.istedenfor });
      });
    }
    if (window.PP_VERN) {
      var v = window.PP_VERN.sjekk(tekst);
      v.funn.filter(function (f) { return f.id === 'helse'; }).forEach(function (f) {
        funn.push({ kilde: 'personvern', id: 'helseraad',
                    hva: 'Teksten gir helseråd',
                    istedenfor: 'Forklar kort, og lenk til Helsenorge' });
      });
    }
    return { ok: funn.length === 0, funn: funn };
  }

  return {
    STI: STI,
    MALGRUPPE: MALGRUPPE,
    KATEGORI: KATEGORI,
    ARTIKLER: ARTIKLER,
    PUBLISERES_IKKE: PUBLISERES_IKKE,
    HENVISNING: HENVISNING,
    LESESTANDARD: LESESTANDARD,
    FORBEHOLD: FORBEHOLD,
    GODKJENNES_AV: GODKJENNES_AV,
    henvisning: henvisning,
    AVSLUTNING: AVSLUTNING,
    kategori: kategori,
    artiklerFor: artiklerFor,
    fordeling: fordeling,
    sjekkUtkast: sjekkUtkast
  };
})();
