/* Naviar Care – tjenestekatalogen for pilot v1.

   Fire tjenester, ikke førti. Katalogen er fast av samme grunn som feltene i
   datamodellen er få: en kunde kan ikke bestille noe som ikke står her, og en
   hjelper kan ikke si ja til noe som ikke står her. «Skriv hva du trenger» som
   bestillingsfelt finnes ikke – fritekst gjør omfang og risiko umulig å styre,
   og PP_BEHOV-regelen (etterspørsel oppretter aldri kategori) står.

   Hver kategori bærer sin egen grense. `aldri`-lista er ikke veiledning til
   hjelperen – den er del av katalogdefinisjonen, slik at oppgaveskjermen kan
   vise den og kapsamkontrollen kan peke på den. Grensene under følger
   docs/JURIDISK-GRENSE.md; er de to uenige, vinner dokumentet.

   Hjelpere kategoriseres etter kompetanse gjennom samme felt som motoren
   allerede filtrerer på: `hjelper.oppgaver` (typene de har krysset av for).
   Katalogen legger ikke et nytt kompetansefelt ved siden av – ett felt, én
   sannhet, og matchingmotorens `kvalifisert`-krav gjelder uendret. */

window.PP_KATALOG = (function () {
  'use strict';

  var KATEGORIER = [
    {
      id: 'besok',
      navn: 'Besøk og samvær',
      type: 'samvaer',
      risiko: 'lav',
      beskrivelse: 'Selskap i hverdagen – prat, lesing og felles aktivitet.',
      oppgaver: [
        'Prat og selskap',
        'Høytlesing av bok eller avis',
        'Spill og hobby sammen',
        'En kopp kaffe i lag'
      ],
      aldri: [
        'Terapi eller vurdering av helsetilstand',
        'Tilsyn gjennom natten'
      ]
    },
    {
      id: 'digital',
      navn: 'Digital hjelp',
      type: 'digital',
      risiko: 'lav',
      beskrivelse: 'Veiledning i telefon, nettbrett, TV og videosamtale.',
      /* Veiledning, aldri håndtering: hjelperen peker, kunden taster.
         Regelen står også i docs/HJELPETEAM.md kategori 5. */
      oppgaver: [
        'Vise telefon, nettbrett eller TV',
        'Øve på videosamtale med familien',
        'Lære en app å kjenne'
      ],
      aldri: [
        'BankID, passord og koder',
        'Betaling og gjenoppretting av kontoer',
        'Fjernstyring av kundens utstyr'
      ]
    },
    {
      id: 'lett-hjemmehjelp',
      navn: 'Lett hjemmehjelp',
      type: 'praktisk',
      risiko: 'lav',
      beskrivelse: 'Små, lette oppgaver i hjemmet.',
      oppgaver: [
        'Oppvask',
        'Klesvask og bretting',
        'Skifte sengetøy',
        'Lett rydding',
        /* Observere og melde, aldri utbedre selv: løse tepper og mørke
           lamper meldes til familien. Fallforebygging er grunnen til at
           punktet finnes; grensen mot håndverk er grunnen til ordlyden. */
        'Si fra til familien om snublefarer og mørk belysning'
      ],
      aldri: [
        'Arbeid i trapp og tunge løft',
        'Sterke kjemikalier',
        'Hovedrengjøring'
      ]
    },
    {
      id: 'hent-lever',
      navn: 'Hent og lever',
      type: 'handling',
      risiko: 'lav',
      beskrivelse: 'Hente forhåndsbetalt bestilling eller pakke og levere hjem.',
      /* Familien velger og betaler på forhånd – hjelperen bærer aldri
         betalingsmiddel eller ansvar for varevalg. */
      oppgaver: [
        'Hente forhåndsbetalt matbestilling',
        'Hente pakke på utleveringssted'
      ],
      aldri: [
        'Kontanter og bytte av varer',
        'Medisiner',
        'Alkohol og tobakk',
        'Økonomiske dokumenter'
      ]
    }
  ];

  function alle() { return KATEGORIER.slice(); }

  function hent(id) {
    for (var i = 0; i < KATEGORIER.length; i++) {
      if (KATEGORIER[i].id === id) return KATEGORIER[i];
    }
    return null;
  }

  /** Kan denne hjelperen ta oppdrag i kategorien? Samme sannhet som
      matchingmotorens `kvalifisert`-krav: typen må være krysset av. */
  function kanTjene(hjelper, kategoriId) {
    var k = hent(kategoriId);
    if (!k) return false;
    return ((hjelper && hjelper.oppgaver) || []).indexOf(k.type) !== -1;
  }

  /** Kategoriene en hjelper er kvalifisert for – hjelperens «fagområder». */
  function kategorierFor(hjelper) {
    return KATEGORIER.filter(function (k) { return kanTjene(hjelper, k.id); });
  }

  return {
    alle: alle,
    hent: hent,
    kanTjene: kanTjene,
    kategorierFor: kategorierFor
  };
})();
