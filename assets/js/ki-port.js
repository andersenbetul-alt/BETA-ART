/* Naviar Care – porten mellom en språkmodell og systemet.

   PP_AGENTER sier hva hver agent har lov til. Denne modulen sier hvordan et
   svar fra en modell slipper inn – og den er bygget rundt én antakelse:

     Modellen kan ta feil om hva situasjonen er, ikke bare om hva som bør
     gjøres.

   Det er forskjellen som betyr noe. Spør vi modellen «hvilken handling er
   dette», og deretter slår opp hvor mye autonomi den handlingen har, så er
   det modellen som velger sitt eget fullmaktsnivå. En modell som feiltolker
   «hun har falt» som en vanlig avbestilling, har da gitt seg selv rett til å
   avgjøre saken alene.

   Derfor: risikonivået regnes ut av oss, av data vi allerede har, før
   forslaget i det hele tatt leses. Modellen foreslår. Systemet avgjør.

   Modulen kaller ingen modell. Den kan ikke gjøre det: en nøkkel i
   assets/js/ er en nøkkel hos hver eneste besøkende. Kallet hører hjemme bak
   PP_API, på en server. Her ligger bare kontrakten svaret må oppfylle. */

window.PP_KI_PORT = (function () {
  'use strict';

  /* Feltene et modellsvar må ha. Mangler ett, avvises forslaget – vi gjetter
     ikke på vegne av en modell. */
  var FORSLAGSFELT = ['agent', 'handling', 'begrunnelse', 'sikkerhet', 'grunnlag'];

  /* Under dette går forslaget til et menneske selv om handlingen ellers
     kunne vært automatisk. Tallet er satt av oss, ikke av modellen. */
  var SIKKERHETSGRENSE = 0.8;

  /* Modeller finner på felter. Bare de vi kjenner slipper videre til loggen. */
  function rensGrunnlag(grunnlag) {
    /* LAGRES er en liste av objekter med .felt, ikke et oppslag. Object.keys
       på den gir indekser, og da slipper alt gjennom. */
    var kjente = window.PP_VERN
      ? window.PP_VERN.LAGRES.map(function (l) { return l.felt; })
      : [];
    return (grunnlag || []).filter(function (f) {
      return kjente.length === 0 || kjente.indexOf(f) !== -1;
    });
  }

  function mangler(forslag) {
    var f = forslag || {};
    return FORSLAGSFELT.filter(function (n) { return f[n] === undefined || f[n] === null; });
  }

  /* Kjernen.

     risiko kommer fra kallstedet, ikke fra forslaget. Sender noen inn
     forslagets eget risikonivå her, er hele porten uten virkning – og det er
     lett nok å gjøre ved et uhell til at det står skrevet. */
  function vurder(forslag, risiko, kontekst) {
    var f = forslag || {};
    var k = kontekst || {};

    var hull = mangler(f);
    if (hull.length) {
      return { utfall: 'avvist', autonomi: 'menneske',
               grunn: 'Forslaget mangler felt: ' + hull.join(', '),
               regel: 'ufullstendig_forslag' };
    }

    if (typeof f.sikkerhet !== 'number' || f.sikkerhet < 0 || f.sikkerhet > 1) {
      return { utfall: 'avvist', autonomi: 'menneske',
               grunn: 'Sikkerhet må være et tall mellom 0 og 1',
               regel: 'ugyldig_sikkerhet' };
    }

    /* Agenten må finnes, og den må være en av dem vi faktisk kjører. En modell
       som kaller seg «akuttagent» har ikke dermed blitt en. */
    var agenter = window.PP_AGENTER ? window.PP_AGENTER.kjerne() : [];
    var kjent = agenter.filter(function (a) { return a.id === f.agent; })[0];
    if (!kjent) {
      return { utfall: 'avvist', autonomi: 'menneske',
               grunn: 'Ukjent agent: ' + f.agent,
               regel: 'ukjent_agent' };
    }

    /* Her er porten. Vi spør PP_AGENTER med den risikoen vi selv har regnet
       ut, og med handlingen forslaget peker på. Kommer svaret tilbake som noe
       annet enn «auto», hjelper det ikke hva modellen mente. */
    var dom = window.PP_AGENTER.avgjor(f.handling, risiko);

    if (dom.autonomi === 'aldri') {
      return { utfall: 'avvist', autonomi: 'aldri', grunn: dom.grunn,
               regel: 'utenfor_systemet' };
    }
    if (dom.nod) {
      return { utfall: 'stoppet', autonomi: 'menneske', grunn: dom.grunn,
               regel: 'nod' };
    }
    if (dom.autonomi !== 'auto') {
      return { utfall: 'til_godkjenning', autonomi: 'menneske', grunn: dom.grunn,
               regel: 'krever_menneske' };
    }

    /* Handlingen kunne vært automatisk. Da gjenstår modellens egen
       usikkerhet. En modell som er i tvil, skal ikke avgjøre alene – selv om
       den har lov til det. */
    if (f.sikkerhet < SIKKERHETSGRENSE) {
      return { utfall: 'til_godkjenning', autonomi: 'menneske',
               grunn: 'Modellen er under sikkerhetsgrensen (' +
                      f.sikkerhet + ' < ' + SIKKERHETSGRENSE + ')',
               regel: 'lav_sikkerhet' };
    }

    /* Fritekst fra en modell er fritekst. Den går gjennom samme sperre som
       alt annet før den kan bli en melding til noen. */
    if (k.tekst && window.PP_VERN) {
      var vern = window.PP_VERN.sjekk(k.tekst);
      if (!vern.ok) {
        return { utfall: 'til_godkjenning', autonomi: 'menneske',
                 grunn: 'Teksten inneholder noe som ikke skal lagres',
                 regel: 'personvern',
                 kategorier: vern.funn.map(function (x) { return x.id; }) };
      }
    }

    return { utfall: 'utfort', autonomi: 'auto', grunn: dom.grunn,
             regel: 'innenfor_fullmakt', agent: dom.agent || f.agent };
  }

  /* Hver vurdering blir en loggpost med de sju obligatoriske feltene.
     PP_AGENTER.loggpost kaster hvis noe mangler – det er meningen. */
  function loggfor(forslag, dom, endretAv) {
    if (!window.PP_AGENTER) return null;
    return window.PP_AGENTER.loggpost({
      agent: (forslag && forslag.agent) || null,
      grunnlag: rensGrunnlag(forslag && forslag.grunnlag),
      sikkerhet: forslag && typeof forslag.sikkerhet === 'number' ? forslag.sikkerhet : null,
      regel: dom.regel,
      godkjenning: dom.autonomi === 'menneske',
      endretAv: endretAv || null,
      melding: dom.grunn
    });
  }

  /* Oppsettet et backend skal bruke. Ligger her fordi valgene hører til
     produktet, ikke til den som skriver serveren: modell, tenkemåte og
     grensen for hvor mye tekst en agent får se. */
  var OPPSETT = {
    modell: 'claude-opus-5',
    tenking: { type: 'adaptive' },
    innsats: 'high',
    /* Ingen nøkkel i frontend. Kallet går fra server, aldri fra nettleseren. */
    kallesFra: 'server',
    /* Agenten får feltnavn og faste verdier, ikke råtekst om en person, med
       mindre oppgaven krever det – og da bare det ene feltet. */
    sendAldri: ['kunde', 'parorendeEpost', 'ansattNavn', 'token']
  };

  return {
    FORSLAGSFELT: FORSLAGSFELT,
    SIKKERHETSGRENSE: SIKKERHETSGRENSE,
    OPPSETT: OPPSETT,
    mangler: mangler,
    vurder: vurder,
    loggfor: loggfor
  };
})();
