/* Naviar Care – personvern i praksis: hva vi lagrer, hvor lenge, og hva som
   stoppes før det blir lagret.

   Personvern er ikke en erklæring. Det er en sletterutine som kjører og et
   felt som ikke finnes. Denne modulen er begge deler.

   Rollen vår avgjør resten: Naviar er DATABEHANDLER for leverandøren.
   Leverandøren er behandlingsansvarlig og bestemmer formålet. Vi behandler
   bare etter skriftlig instruks, og aldri til egne formål – en databehandler
   som gjør det, regnes som behandlingsansvarlig for den behandlingen etter
   personvernforordningen artikkel 28 nr. 10.

   Taushetsplikten kommer i tillegg til personvernreglene og gjelder uansett
   hva vi avtaler. Leverandører som yter tjenester etter helse- og
   omsorgstjenesteloven, er bundet av taushetsplikt der. Vi vet ikke alltid
   hvilken hatt leverandøren har på seg i det enkelte besøket, og vi spør ikke.
   Derfor behandler vi alle besøk som om taushetsplikten gjelder. Det koster
   oss ingenting og fjerner et helt spørsmål.

   Se docs/JURIDISK-GRENSE.md og docs/GDPR.md. */

window.PP_VERN = (function () {
  'use strict';

  /* Alt vi lagrer, med grunnlaget for hvert felt. Står et felt ikke her, skal
     det ikke finnes i databasen. Lista er ment å leses av en jurist. */
  var LAGRES = [
    { felt: 'kundenummer',      formal: 'Identifisere besøket',            grunnlag: 'avtale', frist: 'besok' },
    { felt: 'fornavn',          formal: 'Så medarbeideren vet hvem',       grunnlag: 'avtale', frist: 'besok' },
    { felt: 'dato og tid',      formal: 'Planlegge og dokumentere',        grunnlag: 'avtale', frist: 'besok' },
    { felt: 'oppgave',          formal: 'Vite hva som skal gjøres',        grunnlag: 'avtale', frist: 'besok' },
    { felt: 'medarbeider',      formal: 'Vite hvem som utførte',           grunnlag: 'avtale', frist: 'besok' },
    { felt: 'utfall',           formal: 'Dokumentere resultatet',          grunnlag: 'avtale', frist: 'besok' },
    { felt: 'starttid/sluttid', formal: 'Vise når og hvor lenge',          grunnlag: 'avtale', frist: 'besok' },
    { felt: 'pårørendes kontaktpunkt', formal: 'Sende oppdateringen',      grunnlag: 'avtale', frist: 'besok' },
    { felt: 'språkbekreftelse', formal: 'Sperre oppgaver uten rett nivå',  grunnlag: 'avtale', frist: 'ansatt' },
    { felt: 'beslutningslogg',  formal: 'Etterprøve automatiske valg',     grunnlag: 'rettslig', frist: 'logg' },
    { felt: 'innlogging',       formal: 'Oppdage misbruk',                 grunnlag: 'interesse', frist: 'sikkerhet' }
  ];

  /* Felt som ikke finnes. Ikke skjult, ikke valgfritt – de er ikke laget.
     Et felt som ikke eksisterer, kan ikke fylles ut i en travel situasjon. */
  var LAGRES_ALDRI = [
    'Diagnose', 'Medisinliste', 'Journal', 'Legeerklæring', 'Helsemålinger',
    'Frie helseobservasjoner', 'Fødselsnummer', 'BankID', 'Kontonummer',
    'Kortopplysninger', 'Etternavn', 'Gateadresse i besøkslista',
    'Bilder fra hjemmet', 'Lydopptak', 'Løpende posisjon'
  ];

  /* Hvor lenge.

     Loven gir ingen tallverdi. Personvernforordningen sier at opplysninger
     skal slettes eller anonymiseres når de ikke lenger er nødvendige for
     formålet de ble samlet inn for, og at den behandlingsansvarlige selv må
     sette fristene og kunne dokumentere at de følges. Det finnes altså ingen
     «lovlig lagringstid» å slå opp – det er en beslutning vi må ta og
     begrunne.

     Det som gjør beslutningen vanskelig, er at ett besøk juridisk sett er tre
     forskjellige ting samtidig:

       1. Regnskapsbilag. Bokføringsloven krever fem år etter regnskapsårets
          slutt for primærdokumentasjon. Den plikten treffer den som fakturerer
          – altså LEVERANDØREN, ikke oss. Vi fakturerer leverandørens
          abonnement, ikke det enkelte besøket. Femårsregelen gjelder derfor
          vår egen fakturering, og ikke besøksdataene.

       2. Bevis hvis noen krever erstatning. Den alminnelige
          foreldelsesfristen er tre år, med en ytre grense på ti år for
          erstatningskrav. Leverandøren kan ha behov for å vise hva som ble
          gjort. Vi kan ikke ha det – vi utførte ikke besøket.

       3. En opplysning om et menneske i sitt eget hjem. Denne delen er ikke
          nødvendig for noe av det over etter at familien har lest meldingen.

     Derfor sletter vi ikke besøket på én dato. Vi krymper det. Feltene faller
     bort etter hvert som formålet deres tar slutt, og til slutt står det igjen
     en rad som ikke handler om noen. Anonymiserte opplysninger er ikke
     personopplysninger, og faller utenfor regelverket.

     Leverandøren kan sette kortere frister, ikke lengre. Trenger de
     dokumentasjonen lenger, eksporterer de den til sine egne systemer, der de
     er behandlingsansvarlig for den. Vi er ikke leverandørens arkiv. */

  var SLETTEPLAN = [
    { steg: 1, timer: 12,   hva: 'Arbeiderlenken',
      fjerner: ['token'],
      hvorfor: 'Lenken har gjort jobben sin. En lenke i en SMS-tråd er en åpen dør.' },

    { steg: 2, dager: 7,    hva: 'Fritekst',
      fjerner: ['notat', 'rapport.kommentar'],
      hvorfor: 'Familien har lest meldingen. Setningene trengs ikke mer, og de er den delen som kan bære noe personlig.' },

    { steg: 3, dager: 30,   hva: 'Navn og kontaktpunkt',
      fjerner: ['kunde', 'parorendeEpost', 'ansattNavn'],
      hvorfor: 'Etter en måned er ingen i tvil om hva som skjedde. Da trengs ikke navnene.' },

    { steg: 4, dager: 365,  hva: 'Resten',
      fjerner: ['id', 'oppgaver', 'ansattId', 'rapport.sjekkliste', 'tid',
                'fullfortTid', 'opprettet', 'utloper', 'status'],
      /* Datoen kortes til måned. En eksakt dato sammen med varighet og utfall
         peker fortsatt på ett bestemt besøk hos ett bestemt menneske – og da
         er raden ikke anonym, den er bare navnløs. Det er ikke det samme. */
      grovner: { dato: 'maaned' },
      hvorfor: 'Det som står igjen er måned, utfall og varighet. Det handler ikke om noen lenger.' }
  ];

  /* Fristene loven setter for de to tingene som IKKE er besøksdata. De står
     her fordi de ellers blandes sammen med besøket, og det er nettopp
     sammenblandingen som gjør at folk lagrer alt i fem år «for sikkerhets
     skyld». */
  var LOVPALAGT = [
    { hva: 'Naviars fakturaer til leverandøren', frist: '5 år etter regnskapsårets slutt',
      hjemmel: 'Bokføringsloven § 13', gjelder: 'Naviar',
      merk: 'Inneholder leverandørens firmaopplysninger, ikke sluttkundens.' },
    { hva: 'Leverandørens fakturaer til sine kunder', frist: '5 år etter regnskapsårets slutt',
      hjemmel: 'Bokføringsloven § 13', gjelder: 'Leverandøren',
      merk: 'Ligger i leverandørens regnskapssystem. Ikke hos oss.' },
    { hva: 'Dokumentasjon ved erstatningskrav', frist: '3 år, ytre grense 10 år',
      hjemmel: 'Foreldelsesloven §§ 2 og 9', gjelder: 'Leverandøren',
      merk: 'Eksporteres av leverandøren hvis de mener de trenger den.' }
  ];

  /* Retten til sletting har unntak, og unntaket er verdt å kunne: den gjelder
     ikke der lagringen er nødvendig for å oppfylle en rettslig forpliktelse.
     En faktura kan derfor ikke slettes på oppfordring. Et besøksnotat kan. */
  var SLETTING_UNNTAK =
    'Krav om sletting kan ikke settes til side for besøksdata hos oss. ' +
    'Regnskapsbilag er unntatt så lenge bokføringsplikten løper, og det er ' +
    'leverandørens bilag, ikke våre.';

  var FRISTER = {
    besok:     { dager: 365, hva: 'Besøket, ferdig krympet',   hvorfor: 'Etter fire trinn står bare anonym statistikk igjen' },
    ansatt:    { dager: null, hva: 'Medarbeiderens språknivå', hvorfor: 'Så lenge medarbeideren er aktiv, deretter 30 dager' },
    logg:      { dager: 365, hva: 'Beslutningslogg',           hvorfor: 'Menneskelig kontroll må kunne etterprøves' },
    sikkerhet: { dager: 90,  hva: 'Innlogging og tilgang',     hvorfor: 'Oppdage misbruk, ikke følge med på folk' },
    lenke:     { timer: 12,  hva: 'Arbeiderlenken',            hvorfor: 'En lenke i en SMS-tråd er en åpen dør' },
    melding:   { dager: 0,   hva: 'Innholdet i familiemeldingen',
                 hvorfor: 'Sendes og forsvinner. Vi lagrer at den gikk, til hvem og når – ikke teksten' }
  };

  /* Det som stoppes før lagring.

     Vi lagrer ikke det blokkerte innholdet. Å beholde en helseopplysning som
     bevis på at vi nektet å ta imot en helseopplysning, er å ta imot den. */
  var STOPP = [
    { id: 'helse',   navn: 'Helseopplysning',
      ord: ['diagnose', 'demens', 'kreft', 'diabetes', 'blodtrykk', 'blodsukker',
            'medisin', 'tablett', 'insulin', 'dose', 'sår', 'infeksjon', 'smerte',
            'fastlege', 'sykehus', 'utskrevet', 'journal', 'resept',
            'vondt', 'feber', 'svimmel', 'kvalm', 'forvirret', 'pustet', 'hoven'],
      beskjed: 'Dette ser ut som en helseopplysning. Skriv hva som ble gjort, ikke hvordan personen har det.' },

    /* Ikke det samme som resten. Dette er ting som MÅ fram – de skal bare ikke
       fram som en setning i en melding til familien. Sperren peker på veien
       videre. En sperre uten alternativ blir omgått, og da har vi verken
       personvern eller beskjeden. */
    { id: 'haster',  navn: 'Må meldes til kontoret',
      ord: ['falt', 'fall', 'skadet', 'blør', 'brannsår', 'bevisstløs',
            'kom seg ikke opp', 'ambulanse', 'legevakt', 'politi'],
      beskjed: 'Dette skal ikke skrives her – det skal meldes. Velg «Leverandøren må følge opp», ' +
               'så ringer kontoret deg. Ved fare for liv og helse: ring 113 først.' },

    { id: 'penger',  navn: 'Bank eller betaling',
      ord: ['bankid', 'pinkode', 'pin-kode', 'passord', 'kontonummer', 'kortnummer',
            'vipps-kode', 'engangskode'],
      beskjed: 'Bankopplysninger skal aldri inn her – heller ikke for å hjelpe.' },

    { id: 'nedsett', navn: 'Nedsettende omtale',
      ord: ['sur', 'vanskelig', 'gretten', 'sløv', 'senil', 'masete', 'udugelig', 'lat'],
      beskjed: 'Beskriv situasjonen, ikke personen. Familien leser dette.' }
  ];

  /* Lange tallrekker fanges av mønster, ikke av ordliste. Elleve siffer er
     fødselsnummer eller kontonummer; tretten og oppover er som regel et kort.
     Åtte siffer får stå – det er et telefonnummer. */
  var TALLREKKE = /(?:\d[ .-]?){11,}/;

  function normaliser(t) {
    return String(t || '').toLowerCase();
  }

  function traff(tekst, ord) {
    return ord.filter(function (o) {
      return new RegExp('(^|[^a-zæøåéèü])' + o.replace('-', '[- ]?'), 'i').test(tekst);
    });
  }

  /* Svarer på om teksten kan lagres. Ved nei følger en beskjed som sier hva
     man skal gjøre i stedet – en sperre uten alternativ blir omgått. */
  function sjekk(tekst) {
    var t = normaliser(tekst);
    if (!t.trim()) return { ok: true, funn: [] };

    var funn = [];

    STOPP.forEach(function (s) {
      var ord = traff(t, s.ord);
      if (ord.length) funn.push({ id: s.id, navn: s.navn, beskjed: s.beskjed, ord: ord });
    });

    if (TALLREKKE.test(t)) {
      funn.push({
        id: 'tallrekke', navn: 'Lang tallrekke', ord: [],
        beskjed: 'Dette ser ut som et fødselsnummer, kontonummer eller kortnummer. Det skal ikke lagres her.'
      });
    }

    if (!funn.length) return { ok: true, funn: [] };

    return {
      ok: false,
      funn: funn,
      /* Bare hva slags funn det var – ikke teksten. Loggen skal kunne vise at
         sperren virker, uten å bli et arkiv over det den sperret. */
      logglinje: 'Blokkert: ' + funn.map(function (f) { return f.id; }).join(', '),
      beskjed: funn[0].beskjed
    };
  }

  /* Regner ut når noe skal slettes. */
  function slettesEtter(fristId, fra) {
    var f = FRISTER[fristId];
    if (!f) return null;
    var start = fra ? new Date(fra) : new Date();
    if (f.timer !== undefined) {
      return new Date(start.getTime() + f.timer * 3600 * 1000).toISOString();
    }
    if (f.dager === null) return null;      /* følger medarbeiderens status */
    return new Date(start.getTime() + f.dager * 86400 * 1000).toISOString();
  }

  function skalSlettes(post, naa) {
    if (!post || !post.slettesEtter) return false;
    return new Date(post.slettesEtter) <= new Date(naa || Date.now());
  }

  function alder(fra, naa) {
    return (new Date(naa || Date.now()) - new Date(fra)) / 1000;
  }

  function terskel(steg) {
    return steg.timer !== undefined ? steg.timer * 3600 : steg.dager * 86400;
  }

  /* Fjerner et felt, også når det ligger ett nivå ned. Sletting som ikke når
     inn i rapporten, er ikke sletting. */
  function fjern(post, sti) {
    var deler = sti.split('.');
    if (deler.length === 1) { delete post[deler[0]]; return; }
    if (post[deler[0]]) delete post[deler[0]][deler[1]];
  }

  /* Krymper besøket til det tidspunktet sier. Returnerer en kopi – originalen
     røres ikke, slik at den som kaller, bestemmer om resultatet skal skrives.

     Regnes fra fullførelse. Et besøk som aldri ble fullført, krymper fra det
     ble opprettet; ellers ville en glemt rad ligge for alltid. */
  function krymp(besok, naa) {
    var post = JSON.parse(JSON.stringify(besok));
    var fra = besok.fullfortTid || besok.opprettet;
    if (!fra) return { besok: post, steg: 0, utfort: [] };

    var gatt = alder(fra, naa);
    var utfort = [];

    SLETTEPLAN.forEach(function (steg) {
      if (gatt < terskel(steg)) return;
      steg.fjerner.forEach(function (felt) { fjern(post, felt); });
      Object.keys(steg.grovner || {}).forEach(function (felt) {
        if (post[felt]) post[felt] = String(post[felt]).slice(0, 7);
      });
      utfort.push(steg.steg);
    });

    post.krympet = utfort.length ? utfort[utfort.length - 1] : 0;
    return { besok: post, steg: post.krympet, utfort: utfort };
  }

  /* Hva som blir borte og når, i klartekst. Leverandøren skal kunne lese
     sletteplanen uten å be om den. */
  function sletteplanTekst() {
    return SLETTEPLAN.map(function (s) {
      var nar = s.timer !== undefined ? s.timer + ' timer' : s.dager + ' dager';
      return 'Etter ' + nar + ': ' + s.hva.toLowerCase() + ' forsvinner. ' + s.hvorfor;
    });
  }

  /* De registrertes rettigheter, med hvem som svarer. Spørsmålet kommer alltid
     til feil sted først, og da må svaret være klart. */
  var RETTIGHETER = [
    { rett: 'Innsyn',           svarer: 'Leverandøren', naviar: 'Henter ut det som gjelder personen, på leverandørens instruks' },
    { rett: 'Retting',          svarer: 'Leverandøren', naviar: 'Retter etter instruks' },
    { rett: 'Sletting',         svarer: 'Leverandøren', naviar: 'Sletter, også fra sikkerhetskopi ved neste rullering' },
    { rett: 'Begrensning',      svarer: 'Leverandøren', naviar: 'Fryser posten' },
    { rett: 'Dataportabilitet', svarer: 'Leverandøren', naviar: 'Eksporterer maskinlesbart' },
    { rett: 'Innsigelse',       svarer: 'Leverandøren', naviar: 'Videresender umiddelbart' },
    { rett: 'Klage',            svarer: 'Datatilsynet', naviar: 'Skal opplyses om i personvernerklæringen' }
  ];

  /* Ved brudd. Fristen er kort, og den løper fra man ble kjent med bruddet –
     ikke fra man forsto omfanget. Derfor står tallene her og ikke i en perm. */
  var BRUDD = {
    naviarVarslerLeverandor: 'uten unødig opphold',
    leverandorVarslerTilsyn: '72 timer',
    varslerDeRegistrerte: 'når det er høy risiko for den enkelte',
    merk: 'Naviar er databehandler og melder til leverandøren, ikke til Datatilsynet. Leverandøren melder.'
  };

  return {
    LAGRES: LAGRES,
    LAGRES_ALDRI: LAGRES_ALDRI,
    FRISTER: FRISTER,
    SLETTEPLAN: SLETTEPLAN,
    LOVPALAGT: LOVPALAGT,
    SLETTING_UNNTAK: SLETTING_UNNTAK,
    STOPP: STOPP,
    RETTIGHETER: RETTIGHETER,
    BRUDD: BRUDD,
    sjekk: sjekk,
    krymp: krymp,
    sletteplanTekst: sletteplanTekst,
    slettesEtter: slettesEtter,
    skalSlettes: skalSlettes
  };
})();
