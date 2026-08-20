/* PårørendePilot – oppdragstavla for hjelpere.

   To prinsipper styrer denne siden:
   1. Bryteren «Jeg er tilgjengelig» er det eneste som slår på posisjonsbruk.
      Står den av, hentes ingen posisjon, og ingen oppdrag vises.
   2. Rekkefølgen forklares, og oppdrag som holdes utenfor får en begrunnelse.
      En hjelper skal kunne få vite hvorfor, ikke bare oppleve at det er stille. */

(function () {
  'use strict';

  var hjelper = window.PP_DEMO.hjelper;
  var oppdragsliste = window.PP_DEMO.oppdrag;

  var bryter = document.getElementById('tilgjengelig-bryter');
  var bryterTekst = document.getElementById('bryter-tekst');
  var posisjonBoks = document.getElementById('posisjon-boks');
  var posisjonTekst = document.getElementById('posisjon-tekst');
  var innhold = document.getElementById('tavle-innhold');
  var skjulteKort = document.getElementById('skjulte-kort');
  var skjulteListe = document.getElementById('skjulte-liste');

  var posisjon = null;
  var aktivtOppdrag = null;   // { id, fase: 'tildelt' | 'pagar' | 'ferdig' }

  var IKONER = {
    handling: '🛒', folge: '🤝', samvaer: '☕', aktivitet: '🎭',
    digital: '📱', praktisk: '🏠', ute: '❄️', dyr: '🐕', transport: '🚗'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- tilgjengelighet og posisjon ---------- */

  function settTilgjengelig(pa) {
    hjelper.tilgjengelig = pa;
    bryter.setAttribute('aria-pressed', String(pa));
    bryterTekst.innerHTML = pa
      ? 'Tilgjengelig<small>Du får oppdrag i nærheten</small>'
      : 'Ikke tilgjengelig<small>Slå på for å se oppdrag</small>';
    posisjonBoks.hidden = !pa;

    if (!pa) {
      // Bryteren av = all posisjonsbruk stopper. Punktet forkastes med én gang.
      posisjon = null;
      posisjonTekst.textContent =
        'For å vise oppdrag i nærheten trenger vi posisjonen din mens du er tilgjengelig. ' +
        'Vi sporer deg ikke når bryteren står av.';
    }
    tegn();
  }

  bryter.addEventListener('click', function () {
    settTilgjengelig(bryter.getAttribute('aria-pressed') !== 'true');
  });

  document.getElementById('del-posisjon').addEventListener('click', function () {
    if (!('geolocation' in navigator)) {
      posisjonTekst.textContent = 'Nettleseren din støtter ikke posisjon. Vi bruker postnummeret ditt i stedet.';
      return;
    }
    posisjonTekst.textContent = 'Henter posisjon …';
    navigator.geolocation.getCurrentPosition(function (pos) {
      posisjon = {
        lat: Math.round(pos.coords.latitude * 1000) / 1000,
        lon: Math.round(pos.coords.longitude * 1000) / 1000
      };
      posisjonTekst.innerHTML =
        '<strong style="color:var(--brand-dark)">✓ Posisjon i bruk</strong> mens du er tilgjengelig. ' +
        'Familier ser bare omtrentlig avstand, aldri hvor du befinner deg.';
      tegn();
    }, function () {
      posisjon = null;
      posisjonTekst.textContent = 'Posisjon ble ikke delt. Vi bruker postnummeret ditt i stedet – da blir avstandene mer omtrentlige.';
    }, { enableHighAccuracy: false, timeout: 10000 });
  });

  document.getElementById('uten-posisjon').addEventListener('click', function () {
    posisjon = null;
    posisjonTekst.textContent = 'Greit. Vi bruker postnummeret ditt i stedet – da blir avstandene mer omtrentlige.';
  });

  /* ---------- tegning ---------- */

  function oppdragKort(post) {
    var o = post.oppdrag;
    var r = post.resultat;
    var erAktivt = aktivtOppdrag && aktivtOppdrag.id === o.id;

    var html = '<article class="oppdrag-kort" data-oppdrag="' + o.id + '">';
    html += '<div class="oppdrag-topp">';
    html += '<span class="oppdrag-ikon" aria-hidden="true">' + (IKONER[o.type] || '📋') + '</span>';
    html += '<div style="min-width:0">';
    html += '<h3 style="margin:0 0 2px;font-size:1.08rem">' + esc(o.tittel) + '</h3>';
    html += '<p class="oppdrag-meta">' + esc(o.bydel) + ' · ' + String(o.avstandKm).replace('.', ',') +
            ' km · ' + esc(o.nar) + ' · ca. ' + o.varighetTimer + ' t</p>';
    html += '</div>';
    html += '<div class="oppdrag-betaling"><strong>' + o.betaling + ' kr</strong><small>til deg</small></div>';
    html += '</div>';

    html += '<p style="margin:14px 0 0;font-size:.95rem">' + esc(o.notat) + '</p>';

    if (!erAktivt) {
      html += '<div class="hvorfor">';
      html += '<span class="treff">Treff ' + r.score + ' / 100</span>';
      html += '<ul>' + r.begrunnelser.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
      html += '</div>';
      html += '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">';
      html += '<button class="btn btn-primary" type="button" data-ta="' + o.id + '">Ta oppdraget</button>';
      html += '<button class="btn btn-ghost" type="button" data-avvis="' + o.id + '">Ikke aktuelt</button>';
      html += '</div>';
      html += '<p class="muted" style="margin:12px 0 0;font-size:.86rem">Full adresse vises først når du har tatt oppdraget.</p>';
    } else {
      html += aktivDel(o);
    }

    html += '</article>';
    return html;
  }

  function aktivDel(o) {
    var adresse = window.PP_DEMO.hentAdresse(o.id);
    var html = '';

    if (aktivtOppdrag.fase === 'tildelt') {
      html += '<div class="notice notice-info" style="margin:16px 0 0">';
      html += '<h4>Oppdraget er ditt</h4>';
      html += '<p><strong>' + esc(adresse) + '</strong></p>';
      html += '<p style="margin:0">Be om oppmøtekoden når du kommer, og tast den inn for å starte oppdraget.</p>';
      html += '</div>';
      html += '<div class="kode-inn">';
      html += '<input type="text" inputmode="numeric" maxlength="4" placeholder="0000" id="kode-felt" aria-label="Oppmøtekode">';
      html += '<button class="btn btn-primary" type="button" id="sjekk-inn">Sjekk inn</button>';
      html += '</div>';
      html += '<p class="error-text" id="kode-feil" style="margin-top:8px">Feil kode. Be om koden på nytt.</p>';
      html += '<p class="muted" style="margin:12px 0 0;font-size:.86rem">Demo: koden er 4821.</p>';
    }

    if (aktivtOppdrag.fase === 'pagar') {
      html += '<div class="notice notice-info" style="margin:16px 0 0">';
      html += '<h4>Oppdraget pågår</h4>';
      html += '<p><strong>' + esc(adresse) + '</strong></p>';
      html += '<p style="margin:0">Startet ' + aktivtOppdrag.startet + '. Familien har fått beskjed om at du er kommet.</p>';
      html += '</div>';
      html += '<div style="margin-top:16px">';
      html += '<label for="oppdrag-notat" style="font-weight:600;font-size:.93rem;display:block;margin-bottom:6px">Kort notat til familien <span class="optional">(valgfritt)</span></label>';
      html += '<textarea id="oppdrag-notat" placeholder="F.eks. «Handlingen er gjort og varene er satt på plass.»"></textarea>';
      html += '<p class="muted" style="margin:6px 0 0;font-size:.85rem">Skriv om oppdraget, ikke om helsen hennes.</p>';
      html += '</div>';
      html += '<p style="margin-top:16px"><button class="btn btn-primary" type="button" id="sjekk-ut">Meld ferdig</button></p>';

      /* Grensen mot helsehjelp holder bare hvis hjelperen har et sted å si nei.
         Uten dette blir «det står i vilkårene» hennes problem alene. */
      html += '<div class="notice notice-warn" style="margin-top:18px;font-size:.92rem">';
      html += '<h4>Blir du bedt om noe som ikke er en del av oppdraget?</h4>';
      html += '<p>Du skal si nei, og du skal slippe å stå alene om det. Meld fra, så tar vi det videre — ';
      html += 'det får ingen følger for deg.</p>';
      html += '<p style="margin:0"><button class="btn btn-secondary" type="button" id="utenfor-oppdrag" ';
      html += 'style="font-size:.88rem;padding:9px 14px">Meld fra om forespørsel utenfor oppdraget</button></p>';
      html += '<div id="utenfor-skjema" hidden style="margin-top:14px">';
      html += '<div class="option-grid">';
      [
        ['medisin', 'Medisiner eller stell', 'Ligger utenfor plattformen'],
        ['penger', 'Penger, kort, PIN eller BankID', 'Aldri tillatt'],
        ['verdi', 'Verdisaker eller dokumenter', 'Aldri tillatt'],
        ['annet', 'Noe annet', 'Beskriv kort']
      ].forEach(function (v) {
        html += '<label class="option"><input type="checkbox" name="utenfor" value="' + v[0] + '">' +
                '<span class="option-text">' + v[1] + '<small>' + v[2] + '</small></span></label>';
      });
      html += '</div>';
      html += '<p style="margin:12px 0 0"><button class="btn btn-primary" type="button" id="send-utenfor" ';
      html += 'style="font-size:.88rem;padding:9px 14px">Send melding</button></p>';
      html += '</div></div>';
    }

    if (aktivtOppdrag.fase === 'ferdig') {
      html += '<div class="notice notice-info" style="margin:16px 0 0">';
      html += '<h4>✓ Meldt ferdig</h4>';
      html += '<p>Familien har fått varsel og skal bekrefte. Da frigis <strong>' + o.betaling + ' kr</strong> til deg.</p>';
      html += '<p style="margin:0">Adressen er nå skjult igjen.</p>';
      html += '</div>';
      html += '<p style="margin-top:16px"><button class="btn btn-secondary" type="button" id="tilbake-tavle">Tilbake til oppdragstavla</button></p>';
    }

    return html;
  }

  function tegn() {
    if (!hjelper.tilgjengelig) {
      innhold.innerHTML =
        '<div class="card tomt"><span class="stort" aria-hidden="true">🌙</span>' +
        '<p style="margin:0"><strong>Du er ikke tilgjengelig nå.</strong></p>' +
        '<p style="margin:6px 0 0">Slå på bryteren når du har tid, så viser vi oppdrag i nærheten.</p></div>';
      skjulteKort.hidden = true;
      return;
    }

    var resultat = window.PP_MATCHING.rangerOppdrag(hjelper, oppdragsliste);

    // Er et oppdrag tatt, er det det eneste som vises – ett oppdrag om gangen.
    if (aktivtOppdrag) {
      var post = resultat.aktuelle.filter(function (a) { return a.oppdrag.id === aktivtOppdrag.id; })[0];
      if (post) {
        innhold.innerHTML = oppdragKort(post);
        skjulteKort.hidden = true;
        return;
      }
    }

    if (resultat.aktuelle.length === 0) {
      innhold.innerHTML =
        '<div class="card tomt"><span class="stort" aria-hidden="true">🔍</span>' +
        '<p style="margin:0"><strong>Ingen oppdrag akkurat nå.</strong></p>' +
        '<p style="margin:6px 0 0">Vi varsler deg så snart det kommer noe som passer.</p></div>';
    } else {
      var topp = '<p class="muted" style="margin:0 0 14px;font-size:.93rem">' +
        resultat.aktuelle.length + ' oppdrag passer profilen din' +
        (posisjon ? ', sortert etter posisjonen din' : ', sortert etter postnummeret ditt') + '.</p>';
      innhold.innerHTML = topp + resultat.aktuelle.map(oppdragKort).join('');
    }

    if (resultat.skjulte.length) {
      skjulteListe.innerHTML = resultat.skjulte.map(function (s) {
        return '<li><strong>' + esc(s.oppdrag.tittel) + ' · ' + esc(s.oppdrag.bydel) + '</strong>' +
               '<span>' + esc(s.resultat.sperre.grunn) + '</span></li>';
      }).join('');
      skjulteKort.hidden = false;
    } else {
      skjulteKort.hidden = true;
    }
  }

  /* ---------- handlinger ---------- */

  function klokke() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  innhold.addEventListener('click', function (e) {
    var ta = e.target.closest('[data-ta]');
    if (ta) {
      aktivtOppdrag = { id: ta.getAttribute('data-ta'), fase: 'tildelt' };
      tegn();
      return;
    }

    var avvis = e.target.closest('[data-avvis]');
    if (avvis) {
      var id = avvis.getAttribute('data-avvis');
      oppdragsliste = oppdragsliste.filter(function (o) { return o.id !== id; });
      tegn();
      return;
    }

    if (e.target.id === 'sjekk-inn') {
      var felt = document.getElementById('kode-felt');
      var feil = document.getElementById('kode-feil');
      if (felt.value.trim() === window.PP_DEMO.oppmoteKode()) {
        aktivtOppdrag.fase = 'pagar';
        aktivtOppdrag.startet = klokke();
        tegn();
      } else {
        feil.classList.add('show');
        felt.setAttribute('aria-invalid', 'true');
      }
      return;
    }

    if (e.target.id === 'utenfor-oppdrag') {
      document.getElementById('utenfor-skjema').hidden = false;
      return;
    }

    if (e.target.id === 'send-utenfor') {
      var valgt = Array.prototype.filter
        .call(document.querySelectorAll('input[name="utenfor"]'), function (i) { return i.checked; })
        .map(function (i) { return i.value; });
      if (!valgt.length) return;
      // I produksjon: eget varsel til drift, uavhengig av oppdragets utfall.
      aktivtOppdrag.utenfor = valgt;
      var boks = document.getElementById('utenfor-skjema').parentNode;
      boks.innerHTML = '<h4>✓ Meldingen er sendt</h4>' +
        '<p style="margin:0">Vi tar kontakt etter oppdraget. Du har gjort det riktige. ' +
        'Fortsett med oppdraget som avtalt, eller avslutt hvis du ikke er komfortabel.</p>';
      return;
    }

    if (e.target.id === 'sjekk-ut') {
      aktivtOppdrag.fase = 'ferdig';
      tegn();
      return;
    }

    if (e.target.id === 'tilbake-tavle') {
      // Adressen skal ikke ligge igjen i visningen etter fullført oppdrag.
      oppdragsliste = oppdragsliste.filter(function (o) { return o.id !== aktivtOppdrag.id; });
      aktivtOppdrag = null;
      tegn();
    }
  });

  /* ---------- oppstart ---------- */
  settTilgjengelig(false);
})();
