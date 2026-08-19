/* PårørendePilot – driftskonsoll.

   Konsollen er bygget rundt tre driftsprinsipper:
   1. Hver sak har en alvorsgrad, og alvorsgraden bestemmer svarfristen.
      Fristen vises alltid, også når den er brutt – en oversittet frist skal
      være synlig, ikke skjult.
   2. Sikkerhetssaker fryser kontoen først og utredes etterpå. Rekkefølgen er
      aldri motsatt.
   3. Hver handling logges. Loggen er en del av verktøyet, ikke et vedlegg. */

(function () {
  'use strict';

  var D = window.PP_DRIFT_DATA;
  var innhold = document.getElementById('ko-innhold');
  var loggListe = document.getElementById('logg-liste');
  var logg = [];

  var STEG_NAVN = {
    epost: 'E-post bekreftet', sms: 'Mobil bekreftet', id: 'ID-kontroll',
    referanse1: 'Referanse 1', referanse2: 'Referanse 2', kurs: 'Sikkerhetskurs'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function klokke() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function varighet(min) {
    if (min < 60) return min + ' min';
    var t = Math.floor(min / 60), m = min % 60;
    if (t < 24) return t + ' t' + (m ? ' ' + m + ' min' : '');
    return Math.floor(t / 24) + ' d ' + (t % 24) + ' t';
  }

  /* ---------- frist ---------- */

  function fristBoks(alvorKode, mottattMin) {
    var a = D.ALVOR[alvorKode];
    var igjen = a.frist - mottattMin;
    var klasse = igjen < 0 ? 'brutt' : (igjen <= a.frist * 0.25 ? 'snart' : '');
    var tekst = igjen < 0 ? 'Frist oversittet med ' + varighet(-igjen) : varighet(igjen) + ' igjen';
    return '<span class="frist ' + klasse + '"><strong>' + tekst + '</strong>' +
           'mottatt for ' + varighet(mottattMin) + ' siden</span>';
  }

  function merke(alvorKode) {
    var a = D.ALVOR[alvorKode];
    return '<span class="merke ' + a.farge + '">' + esc(a.navn) + '</span>';
  }

  /* ---------- logg ---------- */

  function loggfor(tekst) {
    logg.unshift({ tid: klokke(), tekst: tekst });
    loggListe.innerHTML = logg.map(function (l) {
      return '<li><span class="klokke">' + l.tid + '</span><span>' + esc(l.tekst) + '</span></li>';
    }).join('');
  }

  /* ---------- nøkkeltall ---------- */

  function tegnKpi() {
    var p1 = D.hendelser.filter(function (h) { return h.alvor === 'P1' && h.status !== 'lukket'; }).length;
    var brutt = D.hendelser.filter(function (h) {
      return h.status !== 'lukket' && (h.mottatt > D.ALVOR[h.alvor].frist);
    }).length;
    var varsler = D.aktiveOppdrag.filter(function (o) { return o.varsel; }).length;

    var kort = [
      { navn: 'Åpne hendelser', tall: D.hendelser.filter(function (h) { return h.status !== 'lukket'; }).length },
      { navn: 'Sikkerhet (P1)', tall: p1, varsel: p1 > 0 },
      { navn: 'Frist oversittet', tall: brutt, varsel: brutt > 0 },
      { navn: 'Oppdrag med varsel', tall: varsler, varsel: varsler > 0 },
      { navn: 'Søknader i kø', tall: D.soknader.length }
    ];

    document.getElementById('kpi-rad').innerHTML = kort.map(function (k) {
      return '<div class="kpi' + (k.varsel ? ' varsel' : '') + '"><div class="tall">' + k.tall +
             '</div><div class="navn">' + esc(k.navn) + '</div></div>';
    }).join('');

    document.getElementById('ant-hendelser').textContent = D.hendelser.filter(function (h) { return h.status !== 'lukket'; }).length;
    document.getElementById('ant-soknader').textContent = D.soknader.length;
    document.getElementById('ant-oppdrag').textContent = D.aktiveOppdrag.length;
    document.getElementById('ant-betaling').textContent = D.betalingssaker.length;
  }

  /* ---------- køer ---------- */

  function tegnHendelser() {
    var apne = D.hendelser.filter(function (h) { return h.status !== 'lukket'; });
    if (!apne.length) return '<div class="sak"><p style="margin:0">Ingen åpne hendelser.</p></div>';

    // Strengeste alvorsgrad først, deretter eldst.
    apne.sort(function (a, b) {
      return a.alvor === b.alvor ? b.mottatt - a.mottatt : a.alvor.localeCompare(b.alvor);
    });

    return apne.map(function (h) {
      var s = '<article class="sak" data-hendelse="' + h.id + '">';
      s += '<div class="sak-topp">' + merke(h.alvor) +
           '<div style="min-width:0"><h3>' + esc(h.tittel) + '</h3>' +
           '<span class="sak-id">' + esc(h.id) + ' · ' + esc(h.oppdrag) + '</span></div>' +
           fristBoks(h.alvor, h.mottatt) + '</div>';
      s += '<p style="margin:14px 0 6px"><strong>Melder:</strong> ' + esc(h.melder) + '<br>' +
           '<strong>Gjelder:</strong> ' + esc(h.gjelder) + '</p>';
      s += '<p style="margin:0 0 10px">' + esc(h.beskrivelse) + '</p>';
      s += '<div class="notice notice-info" style="margin:0;font-size:.9rem"><p style="margin:0">' +
           '<strong>Rutine:</strong> ' + esc(h.tiltak) + '</p></div>';
      s += '<div class="handlinger">';
      if (h.alvor === 'P1') {
        s += '<button class="btn btn-fare" type="button" data-handling="frys" data-id="' + h.id + '">Frys konto nå</button>';
      }
      s += '<button class="btn btn-primary" type="button" data-handling="ta" data-id="' + h.id + '">Ta saken</button>';
      s += '<button class="btn btn-secondary" type="button" data-handling="kontakt" data-id="' + h.id + '">Logg kontakt med bruker</button>';
      s += '<button class="btn btn-ghost" type="button" data-handling="lukk" data-id="' + h.id + '">Lukk sak</button>';
      s += '</div>';
      s += '</article>';
      return s;
    }).join('');
  }

  function tegnSoknader() {
    if (!D.soknader.length) return '<div class="sak"><p style="margin:0">Ingen søknader i kø.</p></div>';

    return D.soknader.map(function (sk) {
      var mangler = Object.keys(sk.steg).filter(function (k) { return !sk.steg[k]; });
      var klar = mangler.length === 0;

      var s = '<article class="sak" data-soknad="' + sk.id + '">';
      s += '<div class="sak-topp">' + merke(sk.alvor) +
           '<div><h3>' + esc(sk.navn) + '</h3><span class="sak-id">' + esc(sk.id) + ' · ' +
           esc(sk.sted) + ' · ' + sk.alder + ' år</span></div>' +
           fristBoks(sk.alvor, sk.mottatt * 60) + '</div>';

      s += '<div class="sjekkliste">' + Object.keys(sk.steg).map(function (k) {
        return '<span class="sjekk ' + (sk.steg[k] ? 'ok' : 'mangler') + '">' +
               (sk.steg[k] ? '✓' : '○') + ' ' + esc(STEG_NAVN[k]) + '</span>';
      }).join('') + '</div>';

      s += '<p style="margin:0 0 4px;font-size:.92rem"><strong>Oppdrag:</strong> ' + esc(sk.oppgaver.join(', ')) +
           ' · <strong>Språk:</strong> ' + esc(sk.sprak.join(', ')) +
           ' · <strong>Transport:</strong> ' + esc(sk.transport.join(', ')) + '</p>';

      s += '<h4 style="font-size:.95rem;margin:16px 0 4px">Referansesjekk</h4>';
      s += sk.referanser.map(function (r) {
        return '<div class="ref ' + esc(r.status) + '"><strong>' + esc(r.navn) + '</strong> ' +
               '<span class="rolle">' + esc(r.relasjon) + (r.telefon ? ' · ' + esc(r.telefon) : '') +
               ' · ' + esc(r.status) + '</span>' +
               (r.svar ? '<blockquote>' + esc(r.svar) + '</blockquote>' : '') + '</div>';
      }).join('');

      s += '<details style="margin-top:10px"><summary style="cursor:pointer;font-size:.9rem;font-weight:600">Fast spørsmålsliste for referansesamtalen</summary>' +
           '<ol style="font-size:.9rem;color:var(--ink-soft);margin:10px 0 0;padding-left:1.3em">' +
           D.referansesporsmal.map(function (q) { return '<li style="margin-bottom:4px">' + esc(q) + '</li>'; }).join('') +
           '</ol></details>';

      s += '<p style="margin:14px 0 0;font-size:.9rem;color:var(--ink-soft)"><strong>Merknad:</strong> ' + esc(sk.merknad) + '</p>';

      s += '<div class="handlinger">';
      s += '<button class="btn btn-primary" type="button" data-handling="godkjenn" data-id="' + sk.id + '"' +
           (klar ? '' : ' disabled title="Alle steg må være fullført"') + '>Godkjenn til nivå 1</button>';
      s += '<button class="btn btn-secondary" type="button" data-handling="etterspor" data-id="' + sk.id + '">Etterspør manglende steg</button>';
      s += '<button class="btn btn-ghost" type="button" data-handling="avslag" data-id="' + sk.id + '">Avslå</button>';
      s += '</div>';
      if (!klar) {
        s += '<p class="muted" style="margin:10px 0 0;font-size:.86rem">Mangler: ' +
             esc(mangler.map(function (m) { return STEG_NAVN[m]; }).join(', ')) + '</p>';
      }
      s += '</article>';
      return s;
    }).join('');
  }

  function tegnOppdrag() {
    var rader = D.aktiveOppdrag.map(function (o) {
      return '<tr' + (o.varsel ? ' class="rad-varsel"' : '') + '>' +
        '<td><span class="sak-id">' + esc(o.id) + '</span></td>' +
        '<td>' + esc(o.hjelper) + '</td>' +
        '<td>' + esc(o.bydel) + '</td>' +
        '<td>' + (o.start ? esc(o.start) : '<em>ikke innsjekket</em>') + '</td>' +
        '<td>' + (o.varighetMin ? varighet(o.varighetMin) : '–') + '</td>' +
        '<td>' + esc(o.forventetSlutt) + '</td>' +
        '<td>' + (o.varsel ? '<strong style="color:var(--danger)">' + esc(o.varsel) + '</strong>' : 'Normal') + '</td>' +
        '</tr>';
    }).join('');

    return '<div class="sak"><h3 style="margin-bottom:12px">Aktive oppdrag</h3>' +
      '<div class="table-scroll" style="border:none"><table class="tabell-enkel">' +
      '<thead><tr><th>Oppdrag</th><th>Hjelper</th><th>Bydel</th><th>Innsjekk</th><th>Varighet</th><th>Forventet slutt</th><th>Status</th></tr></thead>' +
      '<tbody>' + rader + '</tbody></table></div>' +
      '<p class="muted" style="margin:14px 0 0;font-size:.88rem">' +
      'Konsollen viser oppdragsstatus, ikke hjelperens bevegelser. Posisjon brukes kun til å bekrefte oppmøte i riktig område.' +
      '</p></div>';
  }

  function tegnBetaling() {
    var rader = D.betalingssaker.map(function (b) {
      return '<tr><td><span class="sak-id">' + esc(b.id) + '</span></td><td>' + esc(b.oppdrag) + '</td>' +
        '<td>' + b.belop + ' kr</td><td>' + esc(b.sak) + '</td><td>' + esc(b.status) + '</td>' +
        '<td>' + varighet(b.alder) + '</td></tr>';
    }).join('');

    return '<div class="sak"><h3 style="margin-bottom:12px">Betalingssaker</h3>' +
      '<div class="table-scroll" style="border:none"><table class="tabell-enkel">' +
      '<thead><tr><th>Sak</th><th>Oppdrag</th><th>Beløp</th><th>Årsak</th><th>Status</th><th>Alder</th></tr></thead>' +
      '<tbody>' + rader + '</tbody></table></div>' +
      '<div class="notice notice-info" style="margin:16px 0 0;font-size:.9rem"><p style="margin:0">' +
      'Bekrefter ikke familien innen 48 timer, frigis utbetalingen automatisk. Hjelperen skal ikke bære ' +
      'kostnaden av at noen glemmer å trykke på en knapp.</p></div></div>';
  }

  function tegnRutiner() {
    var rader = Object.keys(D.ALVOR).map(function (k) {
      var a = D.ALVOR[k];
      return '<tr><td>' + merke(k) + '</td><td>' + varighet(a.frist) + '</td><td>' + esc(a.beskrivelse) + '</td></tr>';
    }).join('');

    return '<div class="sak"><h3 style="margin-bottom:12px">Alvorsgrader og svarfrister</h3>' +
      '<div class="table-scroll" style="border:none"><table class="tabell-enkel">' +
      '<thead><tr><th>Grad</th><th>Svarfrist</th><th>Gjelder</th></tr></thead><tbody>' + rader + '</tbody></table></div>' +
      '<h3 style="margin:24px 0 10px">Eskaleringsstige</h3>' +
      '<ol style="font-size:.94rem;color:var(--ink-soft);padding-left:1.3em">' +
      '<li style="margin-bottom:6px">Saksbehandler tar saken og logger første tiltak.</li>' +
      '<li style="margin-bottom:6px">P1 varsler vakthavende umiddelbart, uansett tidspunkt.</li>' +
      '<li style="margin-bottom:6px">Brudd på svarfrist eskaleres automatisk til driftsleder.</li>' +
      '<li style="margin-bottom:6px">Saker med mulig lovbrudd eller fare for liv går til nødetatene – plattformen erstatter dem ikke.</li>' +
      '<li>Personvernbrudd følger egen varslingsrutine med 72-timersfrist.</li>' +
      '</ol>' +
      '<p class="muted" style="margin:18px 0 0;font-size:.88rem">Fullstendige rutiner: <code>docs/DRIFT.md</code></p>' +
      '</div>';
  }

  var KOER = {
    hendelser: tegnHendelser,
    soknader: tegnSoknader,
    oppdrag: tegnOppdrag,
    betaling: tegnBetaling,
    rutiner: tegnRutiner
  };

  function visKo(navn) {
    innhold.innerHTML = KOER[navn]();
    Array.prototype.forEach.call(document.querySelectorAll('.ko-knapp'), function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-ko') === navn));
    });
  }

  document.getElementById('ko-meny').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ko]');
    if (b) visKo(b.getAttribute('data-ko'));
  });

  /* ---------- handlinger ---------- */

  var HANDLING = {
    frys: function (id) {
      var h = finnHendelse(id);
      h.status = 'under_arbeid';
      loggfor('Konto fryst i sak ' + id + ' (' + h.gjelder + '). Aktive oppdrag omfordeles. Manuell gjennomgang startet.');
      return 'hendelser';
    },
    ta: function (id) {
      finnHendelse(id).status = 'under_arbeid';
      loggfor('Sak ' + id + ' tatt til behandling av Kari D.');
      return 'hendelser';
    },
    kontakt: function (id) {
      loggfor('Kontakt med bruker forsøkt i sak ' + id + '.');
      return 'hendelser';
    },
    lukk: function (id) {
      finnHendelse(id).status = 'lukket';
      loggfor('Sak ' + id + ' lukket med begrunnelse registrert.');
      return 'hendelser';
    },
    godkjenn: function (id) {
      var i = finnSoknadIndeks(id);
      loggfor('Søknad ' + id + ' (' + D.soknader[i].navn + ') godkjent til tillitsnivå 1. Prøveperiode: fem oppdrag på dagtid.');
      D.soknader.splice(i, 1);
      return 'soknader';
    },
    etterspor: function (id) {
      loggfor('Purring sendt for manglende steg i søknad ' + id + '.');
      return 'soknader';
    },
    avslag: function (id) {
      var i = finnSoknadIndeks(id);
      loggfor('Søknad ' + id + ' avslått. Søkeren er varslet med begrunnelse og klageadgang.');
      D.soknader.splice(i, 1);
      return 'soknader';
    }
  };

  function finnHendelse(id) {
    return D.hendelser.filter(function (h) { return h.id === id; })[0];
  }
  function finnSoknadIndeks(id) {
    for (var i = 0; i < D.soknader.length; i++) if (D.soknader[i].id === id) return i;
    return -1;
  }

  innhold.addEventListener('click', function (e) {
    var knapp = e.target.closest('[data-handling]');
    if (!knapp || knapp.disabled) return;
    var ko = HANDLING[knapp.getAttribute('data-handling')](knapp.getAttribute('data-id'));
    tegnKpi();
    visKo(ko);
  });

  /* ---------- oppstart ---------- */
  tegnKpi();
  visKo('hendelser');
})();
