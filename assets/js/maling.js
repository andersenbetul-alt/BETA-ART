/* Naviar Care – målingene, og hva de skal utløse.

   PP_KVALITET stiller det ene spørsmålet etter besøket. Denne modulen er laget
   over: den regner ut de åtte tallene vi styrer etter, og sier hva hvert av dem
   betyr før vi ser dem.

   Grunnen til at målene står skrevet ned på forhånd: et stopp-punkt man setter
   etterpå, er ikke et stopp-punkt. Det er en forklaring.

   Én ting til, og den er ikke en teknisk detalj: enkeltsvar er ikke tall om et
   menneske. De aggregeres, og de slettes med besøket. Ingen medarbeider mister
   arbeid fordi en sum falt – det avgjør arbeidsgiveren, etter å ha sett saken.
   Se J8 i docs/team/JURIDISK-RISIKO.md. */

window.PP_MALING = (function () {
  'use strict';

  /* De åtte. Hvert mål har en kilde, et tall og en grunn til å finnes.
     Målet uten kilde blir et ønske; kilden uten mål blir en graf. */
  var MAL = [
    { id: 'svartid', omrade: 'Tilgang', navn: 'Tid til en forespørsel er akseptert',
      enhet: 'timer', mal: 4, retning: 'lav',
      kilde: 'opprettet → medarbeider bekreftet',
      hvorfor: 'En forespørsel uten svar er verre enn et nei. Familien planlegger rundt den' },

    { id: 'presis', omrade: 'Pålitelighet', navn: 'Besøk gjennomført til avtalt tid',
      enhet: '%', mal: 85, retning: 'hoy',
      kilde: 'planlagt tid mot faktisk start, ±15 minutter',
      hvorfor: 'Den eldre venter ved døra. Et kvarter er lenge når man venter' },

    { id: 'fullfort', omrade: 'Kvalitet', navn: 'Fullført uten avvik',
      enhet: '%', mal: 90, retning: 'hoy',
      kilde: 'utfall «utført» av alle registrerte besøk',
      hvorfor: 'Måler om tjenesten leverer, ikke om den selges' },

    { id: 'hendelser', omrade: 'Sikkerhet', navn: 'Alvorlige hendelser',
      enhet: 'antall', mal: 0, retning: 'lav',
      kilde: 'hendelser på nivå P0 og P1',
      hvorfor: 'Det eneste målet der tallet skal være null, og der ett er for mange' },

    { id: 'klager', omrade: 'Sikkerhet', navn: 'Andel besøk med klage',
      enhet: '%', mal: 5, retning: 'lav',
      kilde: 'registrerte klager av gjennomførte besøk',
      hvorfor: 'Skiller enkelthendelser fra et mønster' },

    { id: 'tilfreds', omrade: 'Opplevelse', navn: 'Tilfredshet, eldre og familie',
      enhet: 'av 2', mal: 1.6, retning: 'hoy',
      kilde: 'PP_KVALITET: bra = 2, greit = 1, ikke bra = 0',
      hvorfor: 'Ett spørsmål, ett klikk. Fem spørsmål gir null svar' },

    { id: 'samme', omrade: 'Opplevelse', navn: 'Besøk utført av samme medarbeider',
      enhet: '%', mal: 80, retning: 'hoy',
      kilde: 'andel av kundens besøk gjort av den hyppigste medarbeideren',
      hvorfor: 'Dette er produktet. En kjent person, ikke en tilgjengelig person' },

    { id: 'gjenkjop', omrade: 'Forretning', navn: 'Familier som bestiller igjen',
      enhet: '%', mal: 30, retning: 'hoy',
      kilde: 'familier med minst to besøk, av familier med minst ett',
      hvorfor: 'Den eneste ærlige målingen av om tjenesten var verdt pengene' }
  ];

  /* Skrevet ned før piloten starter. Slås ett av disse inn, er ikke svaret
     mer markedsføring. */
  var STOPPUNKT = [
    { id: 'hendelser', naar: 'Én alvorlig sikkerhetshendelse',
      gjor: 'Stopp nye oppdrag i bydelen. Gjennomgå før noe fortsetter' },
    { id: 'samme', naar: 'Under 80 % samme medarbeider etter 30 oppdrag',
      gjor: 'Bemanningen holder ikke løftet. Enten flere medarbeidere per bydel, eller færre kunder' },
    { id: 'gjenkjop', naar: 'Under 30 % bestiller igjen',
      gjor: 'Familiene kjøpte én gang av nysgjerrighet. Da er det produktet, ikke salget' },
    { id: 'fullfort', naar: 'Under 90 % fullført',
      gjor: 'Se på oppgavene som ryker. Er de i feil kategori, eller er de for store?' }
  ];

  /* Terskelen for gult settes på 90 % av målet, ikke på et magisk tall.
     Poenget med gult er å rekke å gjøre noe før rødt. */
  var GUL_MARGIN = 0.9;

  function naadd(m, verdi) {
    if (verdi === null || verdi === undefined) return null;
    return m.retning === 'hoy' ? verdi >= m.mal : verdi <= m.mal;
  }

  /* Status med ord, ikke bare farge. En som ikke skiller farger, skal få den
     samme beskjeden som alle andre. */
  function status(m, verdi) {
    if (verdi === null || verdi === undefined) {
      return { id: 'ukjent', navn: 'Ikke målt ennå', farge: 'noytral' };
    }
    if (naadd(m, verdi)) return { id: 'naadd', navn: 'Målet er nådd', farge: 'ok' };

    var naer = m.retning === 'hoy'
      ? verdi >= m.mal * GUL_MARGIN
      : (m.mal === 0 ? false : verdi <= m.mal / GUL_MARGIN);
    return naer
      ? { id: 'naer', navn: 'Under målet', farge: 'warn' }
      : { id: 'under', navn: 'Langt under målet', farge: 'avvik' };
  }

  function mal(id) {
    return MAL.filter(function (m) { return m.id === id; })[0] || null;
  }

  function prosent(teller, nevner) {
    if (!nevner) return null;
    return Math.round((teller / nevner) * 1000) / 10;
  }

  /* Regner de åtte av rådata. Tar imot ferdig opptalte tellere, ikke
     besøkslista selv – tallene skal kunne komme fra en backend senere uten at
     denne modulen må skrives om. */
  function beregn(t) {
    var d = t || {};
    var ut = {};

    ut.svartid = d.sumSvartidTimer != null && d.antallSvar
      ? Math.round((d.sumSvartidTimer / d.antallSvar) * 10) / 10 : null;
    ut.presis = prosent(d.iTide, d.gjennomforte);
    ut.fullfort = prosent(d.utenAvvik, d.gjennomforte);
    ut.hendelser = d.alvorligeHendelser != null ? d.alvorligeHendelser : null;
    ut.klager = prosent(d.klager, d.gjennomforte);
    ut.tilfreds = d.antallTilbakemeldinger
      ? Math.round((d.sumTilfredshet / d.antallTilbakemeldinger) * 100) / 100 : null;
    ut.samme = prosent(d.besokAvFastMedarbeider, d.gjennomforte);
    ut.gjenkjop = prosent(d.familierMedToEllerFlere, d.familierMedMinstEtt);

    return ut;
  }

  /* Hele bildet: verdi, mål, status og eventuelt stopp-punkt. */
  function oversikt(tellere) {
    var verdier = beregn(tellere);
    return MAL.map(function (m) {
      var v = verdier[m.id];
      var s = status(m, v);
      var stopp = STOPPUNKT.filter(function (p) { return p.id === m.id; })[0];
      return {
        id: m.id, omrade: m.omrade, navn: m.navn, enhet: m.enhet,
        verdi: v, mal: m.mal, retning: m.retning,
        status: s, hvorfor: m.hvorfor, kilde: m.kilde,
        stoppunkt: stopp && s.id === 'under' ? stopp : null
      };
    });
  }

  /* Er piloten bestått? Alle stopp-punktene må være klare, og det må finnes
     nok oppdrag til at tallene betyr noe. */
  var PILOT = { oppdrag: 30, dager: 30, bydeler: 1, familier: 10 };

  function pilotdom(tellere) {
    var o = oversikt(tellere);
    var nok = (tellere && tellere.gjennomforte) >= PILOT.oppdrag;
    var brutt = o.filter(function (x) { return x.stoppunkt; });

    if (!nok) {
      return { ok: false, kode: 'for_tidlig', brutt: [],
               grunn: 'Under ' + PILOT.oppdrag + ' gjennomførte oppdrag. Tallene betyr ikke noe ennå' };
    }
    if (brutt.length) {
      return { ok: false, kode: 'stoppunkt', brutt: brutt.map(function (x) { return x.id; }),
               grunn: 'Stopp-punkt utløst: ' + brutt.map(function (x) { return x.navn; }).join('; ') };
    }
    return { ok: true, kode: 'bestatt', brutt: [],
             grunn: 'Alle målene er nådd på ' + tellere.gjennomforte + ' oppdrag' };
  }

  return {
    MAL: MAL,
    STOPPUNKT: STOPPUNKT,
    PILOT: PILOT,
    mal: mal,
    status: status,
    beregn: beregn,
    oversikt: oversikt,
    pilotdom: pilotdom
  };
})();
