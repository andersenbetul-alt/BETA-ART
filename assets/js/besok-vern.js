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

  /* Hvor lenge. Standardene er våre; leverandøren kan sette kortere, ikke
     lengre. Ingen frist er «til vi rydder». */
  var FRISTER = {
    besok:     { dager: 365, hva: 'Besøk med utfall',        hvorfor: 'Leverandøren må kunne dokumentere hva som ble gjort' },
    ansatt:    { dager: null, hva: 'Medarbeiderens språknivå', hvorfor: 'Så lenge medarbeideren er aktiv, deretter 30 dager' },
    logg:      { dager: 365, hva: 'Beslutningslogg',         hvorfor: 'Menneskelig kontroll må kunne etterprøves' },
    sikkerhet: { dager: 90,  hva: 'Innlogging og tilgang',   hvorfor: 'Oppdage misbruk, ikke følge med på folk' },
    lenke:     { timer: 12,  hva: 'Arbeiderlenken',          hvorfor: 'En lenke i en SMS-tråd er en åpen dør' },
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
    STOPP: STOPP,
    RETTIGHETER: RETTIGHETER,
    BRUDD: BRUDD,
    sjekk: sjekk,
    slettesEtter: slettesEtter,
    skalSlettes: skalSlettes
  };
})();
