/* Naviar Care – tilfredshet og tilbakemelding til medarbeideren.

   Én grense holder dette lovlig og ryddig: vi måler og viser. Leverandøren
   bedømmer. Vi lager aldri en score som selv avgjør hvem som får arbeid – det
   ville vært en automatisert avgjørelse om noens inntekt (se J8 i
   docs/team/JURIDISK-RISIKO.md), og i denne modellen er det uansett
   arbeidsgiveren som skal ta den beslutningen.

   Spørsmålet til familien er ett, ikke fem. Fem spørsmål gir null svar. */

window.PP_KVALITET = (function () {
  'use strict';

  var SPORSMAL = {
    nb: { tittel: 'Hvordan gikk besøket?', hjelp: 'Ett klikk. Svaret går til {firma}.',
          svar: ['Bra', 'Greit', 'Ikke bra'], takk: 'Takk. {firma} ser svaret ditt.',
          kommentar: 'Vil du legge til noe? (valgfritt)' },
    en: { tittel: 'How did the visit go?', hjelp: 'One click. Your answer goes to {firma}.',
          svar: ['Good', 'Okay', 'Not good'], takk: 'Thank you. {firma} will see your answer.',
          kommentar: 'Anything to add? (optional)' },
    sv: { tittel: 'Hur gick besöket?', hjelp: 'Ett klick. Svaret går till {firma}.',
          svar: ['Bra', 'Okej', 'Inte bra'], takk: 'Tack. {firma} ser ditt svar.',
          kommentar: 'Vill du lägga till något? (valfritt)' },
    da: { tittel: 'Hvordan gik besøget?', hjelp: 'Ét klik. Svaret går til {firma}.',
          svar: ['Godt', 'OK', 'Ikke godt'], takk: 'Tak. {firma} ser dit svar.',
          kommentar: 'Vil du tilføje noget? (valgfrit)' },
    de: { tittel: 'Wie war der Besuch?', hjelp: 'Ein Klick. Ihre Antwort geht an {firma}.',
          svar: ['Gut', 'In Ordnung', 'Nicht gut'], takk: 'Danke. {firma} sieht Ihre Antwort.',
          kommentar: 'Möchten Sie etwas ergänzen? (optional)' },
    tr: { tittel: 'Ziyaret nasıl geçti?', hjelp: 'Tek tık. Cevabınız {firma} firmasına gider.',
          svar: ['İyi', 'Fena değil', 'İyi değil'], takk: 'Teşekkürler. {firma} cevabınızı görecek.',
          kommentar: 'Eklemek istediğiniz bir şey var mı? (isteğe bağlı)' },
    pl: { tittel: 'Jak przebiegła wizyta?', hjelp: 'Jedno kliknięcie. Odpowiedź trafia do {firma}.',
          svar: ['Dobrze', 'W porządku', 'Niedobrze'], takk: 'Dziękujemy. {firma} zobaczy odpowiedź.',
          kommentar: 'Chcesz coś dodać? (opcjonalnie)' },
    ar: { tittel: 'كيف كانت الزيارة؟', hjelp: 'نقرة واحدة. تصل إجابتك إلى {firma}.',
          svar: ['جيدة', 'مقبولة', 'غير جيدة'], takk: 'شكرًا. ستطّلع {firma} على إجابتك.',
          kommentar: 'هل تودّ إضافة شيء؟ (اختياري)' }
  };

  var VERDI = { bra: 2, greit: 1, ikke: 0 };

  function sporsmal(kode, firma) {
    var s = SPORSMAL[kode] || SPORSMAL.nb;
    return {
      tittel: s.tittel,
      hjelp: s.hjelp.replace('{firma}', firma),
      svar: s.svar,
      takk: s.takk.replace('{firma}', firma),
      kommentar: s.kommentar
    };
  }

  /* Sammenstilling per medarbeider. Dette er tall leverandøren ser om sine
     egne ansatte – ikke en offentlig rangering, og ikke noe som styrer
     tildeling automatisk. */
  function perMedarbeider(besokListe) {
    var m = {};
    besokListe.forEach(function (b) {
      if (b.status !== 'fullfort') return;
      var n = b.ansattNavn;
      m[n] = m[n] || { navn: n, besok: 0, utfort: 0, avvik: 0, svar: [], sekunder: [] };
      m[n].besok++;
      if (b.rapport.utfall === 'utfort') m[n].utfort++;
      if (b.rapport.utfall === 'ikke_utfort' || b.rapport.utfall === 'oppfolging') m[n].avvik++;
      if (b.rapport.sekunder) m[n].sekunder.push(b.rapport.sekunder);
      if (b.tilfredshet) m[n].svar.push(VERDI[b.tilfredshet] != null ? VERDI[b.tilfredshet] : 1);
    });

    return Object.keys(m).map(function (n) {
      var d = m[n];
      d.andelUtfort = d.besok ? Math.round(d.utfort / d.besok * 100) : null;
      d.snittSvar = d.svar.length
        ? Math.round(d.svar.reduce(function (a, x) { return a + x; }, 0) / d.svar.length * 10) / 10
        : null;
      d.snittTid = d.sekunder.length
        ? Math.round(d.sekunder.reduce(function (a, x) { return a + x; }, 0) / d.sekunder.length)
        : null;
      return d;
    }).sort(function (a, b) { return b.besok - a.besok; });
  }

  /* Forslag til hvem leverandøren bør si noe til. Et forslag, ikke en dom –
     og det sier hva som ligger bak, slik at lederen kan være uenig. */
  function forslag(statistikk) {
    return statistikk.filter(function (d) { return d.besok >= 3; }).map(function (d) {
      if (d.snittSvar != null && d.snittSvar >= 1.8 && d.andelUtfort >= 90) {
        return { navn: d.navn, type: 'ros',
                 grunn: d.besok + ' besøk, ' + d.andelUtfort + ' % utført, snitt ' + d.snittSvar + ' av 2 fra familiene' };
      }
      if (d.andelUtfort < 70) {
        return { navn: d.navn, type: 'samtale',
                 grunn: 'Bare ' + d.andelUtfort + ' % av besøkene ble meldt som utført. Kan være ruter, kan være noe annet' };
      }
      return null;
    }).filter(Boolean);
  }

  /* ---------- kontinuitet ----------

     Målet er ikke å finne den beste medarbeideren. Det er å sende tilbake den
     samme. Sofia som har vært hos Ingrid tolv ganger, er bedre for Ingrid enn
     en høyt vurdert fremmed – tillit kommer av gjentakelse, ikke av terning.

     Systemet FORESLÅR. Leverandøren tildeler. Det er arbeidsgiverens
     beslutning, og den skal kunne overprøves med ett klikk. */

  function foreslaaMedarbeider(kunde, besokListe, tilgjengelige) {
    var historikk = {};
    besokListe.forEach(function (b) {
      if (b.kunde !== kunde || b.status !== 'fullfort') return;
      var n = b.ansattNavn;
      historikk[n] = historikk[n] || { navn: n, antall: 0, sist: null, avvik: 0 };
      historikk[n].antall++;
      if (!historikk[n].sist || b.fullfortTid > historikk[n].sist) historikk[n].sist = b.fullfortTid;
      if (b.rapport && b.rapport.utfall !== 'utfort') historikk[n].avvik++;
    });

    var stat = perMedarbeider(besokListe);
    function kvalitet(navn) {
      var d = stat.filter(function (x) { return x.navn === navn; })[0];
      return d ? d : null;
    }

    var forslagListe = (tilgjengelige || []).map(function (a) {
      var h = historikk[a.navn];
      var k = kvalitet(a.navn);
      var poeng = 0;
      var grunner = [];

      if (h && h.antall > 0) {
        // Metter etter ca. ti besøk: den ellevte gangen betyr mindre enn den andre.
        poeng += Math.min(60, Math.round(Math.log(1 + h.antall) / Math.log(11) * 60));
        grunner.push('Har vært hos ' + kunde + ' ' + h.antall + (h.antall === 1 ? ' gang' : ' ganger'));
      } else {
        grunner.push('Har ikke vært hos ' + kunde + ' før');
      }

      if (k && k.andelUtfort != null) {
        poeng += Math.round(k.andelUtfort * 0.25);
        if (k.andelUtfort >= 90) grunner.push(k.andelUtfort + ' % av besøkene meldt utført');
      }
      if (k && k.snittSvar != null && k.snittSvar >= 1.5) {
        poeng += 15;
        grunner.push('Familiene svarer i snitt ' + k.snittSvar + ' av 2');
      }
      if (h && h.avvik > 0) {
        poeng -= h.avvik * 10;
        grunner.push(h.avvik + ' besøk hos denne kunden ble ikke fullført');
      }

      return { navn: a.navn, id: a.id, poeng: Math.max(0, poeng), grunner: grunner,
               kjenner: !!(h && h.antall) };
    }).sort(function (a, b) { return b.poeng - a.poeng; });

    return forslagListe;
  }

  return { sporsmal: sporsmal, perMedarbeider: perMedarbeider, forslag: forslag,
           foreslaaMedarbeider: foreslaaMedarbeider, VERDI: VERDI };
})();
