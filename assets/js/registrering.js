/* Naviar – registreringsflyt for hjelpere.
   Prinsipper: hvert samtykke er et eget, aktivt valg; posisjon er frivillig
   og aldri en forutsetning for å fullføre registreringen. */

(function () {
  'use strict';

  var form = document.getElementById('helper-form');
  if (!form) return;

  var DRAFT_KEY = 'pp_helper_draft_v1';
  var SISTE_STEG = 6;
  var KVITTERING = 7;

  var steg = 1;
  var otpForventet = null;
  var telefonVerifisert = false;
  var posisjon = null;          // { lat, lon, noyaktighet, tidspunkt } – kun med samtykke
  var posisjonSamtykke = false;

  var stepper = document.getElementById('stepper-list');
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var submitBtn = document.getElementById('submit-btn');
  var progressText = document.getElementById('progress-text');
  var formNav = document.getElementById('form-nav');
  var draftNote = document.getElementById('draft-note');

  /* ---------------- hjelpefunksjoner ---------------- */

  function felt(navn) { return form.elements[navn]; }

  function verdi(navn) {
    var el = felt(navn);
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function avkrysset(navn) {
    return Array.prototype.filter
      .call(form.querySelectorAll('input[name="' + navn + '"]'), function (i) { return i.checked; })
      .map(function (i) { return i.value; });
  }

  function valgtRadio(navn) {
    var valgt = form.querySelector('input[name="' + navn + '"]:checked');
    return valgt ? valgt.value : '';
  }

  function visFeil(navn, vis) {
    var boks = form.querySelector('[data-error-for="' + navn + '"]');
    if (boks) boks.classList.toggle('show', !!vis);
    var input = form.querySelector('#' + navn);
    if (input && input.tagName === 'INPUT') {
      if (vis) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function nullstillFeil(stegNr) {
    var f = form.querySelector('fieldset[data-step="' + stegNr + '"]');
    if (!f) return;
    Array.prototype.forEach.call(f.querySelectorAll('.error-text'), function (e) { e.classList.remove('show'); });
    Array.prototype.forEach.call(f.querySelectorAll('[aria-invalid]'), function (e) { e.removeAttribute('aria-invalid'); });
  }

  function gyldigEpost(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function gyldigNorskMobil(v) {
    var rensk = v.replace(/[\s\-()]/g, '');
    return /^(\+47|0047)?[49]\d{7}$/.test(rensk);
  }

  function gyldigTelefonGenerelt(v) {
    var rensk = v.replace(/[\s\-()]/g, '');
    return /^\+?\d{8,15}$/.test(rensk);
  }

  function alder(datoStr) {
    if (!datoStr) return null;
    var d = new Date(datoStr);
    if (isNaN(d.getTime())) return null;
    var naa = new Date();
    var aar = naa.getFullYear() - d.getFullYear();
    var m = naa.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && naa.getDate() < d.getDate())) aar--;
    return aar;
  }

  /* ---------------- validering per steg ---------------- */

  function validerSteg(n) {
    nullstillFeil(n);
    var ok = true;
    var forsteFeil = null;

    function feil(navn, id) {
      visFeil(navn, true);
      ok = false;
      if (!forsteFeil) forsteFeil = document.getElementById(id || navn);
    }

    if (n === 1) {
      if (!verdi('fornavn')) feil('fornavn');
      if (!verdi('etternavn')) feil('etternavn');
      var a = alder(verdi('fodselsdato'));
      if (a === null || a < 18 || a > 100) feil('fodselsdato');
      if (!gyldigEpost(verdi('epost'))) feil('epost');
      if (!gyldigNorskMobil(verdi('telefon'))) feil('telefon');
      if (ok && !telefonVerifisert) { visFeil('telefonVerifisert', true); ok = false; forsteFeil = document.getElementById('send-otp'); }
    }

    if (n === 2) {
      if (!verdi('by')) feil('by');
      if (!/^\d{4}$/.test(verdi('postnummer'))) feil('postnummer');
      if (!valgtRadio('maksAvstand')) feil('maksAvstand');
      if (avkrysset('transport').length === 0) feil('transport');
    }

    if (n === 3) {
      if (avkrysset('dager').length === 0) feil('dager');
      if (avkrysset('tidsrom').length === 0) feil('tidsrom');
    }

    if (n === 4) {
      if (avkrysset('oppgaver').length === 0) feil('oppgaver');
    }

    if (n === 5) {
      var refOk = verdi('ref1Navn') && gyldigTelefonGenerelt(verdi('ref1Telefon')) &&
                  verdi('ref2Navn') && gyldigTelefonGenerelt(verdi('ref2Telefon'));
      if (!refOk) { visFeil('referanser', true); ok = false; forsteFeil = document.getElementById('ref1Navn'); }
      if (!valgtRadio('utbetaling')) feil('utbetaling');
      if (valgtRadio('utbetaling') === 'foretak' && !/^\d{9}$/.test(verdi('orgnummer'))) feil('orgnummer');
    }

    if (n === 6) {
      var samtykkerOk = felt('samtykkeVilkar').checked &&
                        felt('samtykkePersonvern').checked &&
                        felt('samtykkeReferanser').checked;
      if (!samtykkerOk) { visFeil('samtykker', true); ok = false; forsteFeil = document.getElementById('samtykkeVilkar'); }
    }

    if (!ok && forsteFeil && forsteFeil.focus) forsteFeil.focus();
    return ok;
  }

  /* ---------------- navigasjon ---------------- */

  function visSteg(n) {
    steg = n;
    Array.prototype.forEach.call(form.querySelectorAll('fieldset[data-step]'), function (f) {
      f.hidden = Number(f.getAttribute('data-step')) !== n;
    });

    if (stepper) {
      Array.prototype.forEach.call(stepper.querySelectorAll('li'), function (li) {
        var nr = Number(li.getAttribute('data-step'));
        li.setAttribute('data-state', nr === n ? 'active' : (nr < n ? 'done' : ''));
      });
    }

    var erKvittering = n === KVITTERING;
    formNav.hidden = erKvittering;
    if (draftNote) draftNote.hidden = erKvittering;
    prevBtn.hidden = n === 1 || erKvittering;
    nextBtn.hidden = n >= SISTE_STEG;
    submitBtn.hidden = n !== SISTE_STEG;
    progressText.textContent = erKvittering ? 'Fullført' : 'Steg ' + n + ' av ' + SISTE_STEG;

    if (n === SISTE_STEG) byggOppsummering();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextBtn.addEventListener('click', function () {
    if (!validerSteg(steg)) return;
    lagreKladd();
    visSteg(Math.min(steg + 1, SISTE_STEG));
  });

  prevBtn.addEventListener('click', function () {
    visSteg(Math.max(steg - 1, 1));
  });

  /* ---------------- SMS-verifisering ---------------- */

  var sendOtpBtn = document.getElementById('send-otp');
  var otpFelt = document.getElementById('otp-field');
  var otpStatus = document.getElementById('otp-status');
  var verifyOtpBtn = document.getElementById('verify-otp');

  sendOtpBtn.addEventListener('click', function () {
    var tlf = verdi('telefon');
    if (!gyldigNorskMobil(tlf)) {
      visFeil('telefon', true);
      document.getElementById('telefon').focus();
      return;
    }
    visFeil('telefon', false);
    sendOtpBtn.disabled = true;
    otpStatus.textContent = 'Sender …';

    window.PP_API.sendOtp(tlf).then(function (svar) {
      otpForventet = svar.demoKode || null;
      otpFelt.hidden = false;
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Send ny kode';
      otpStatus.textContent = window.PP_API.demo
        ? 'Demomodus – koden er ' + svar.demoKode
        : 'Kode sendt til ' + tlf;
      document.getElementById('otp').focus();
    }).catch(function () {
      sendOtpBtn.disabled = false;
      otpStatus.textContent = 'Klarte ikke å sende kode. Prøv igjen.';
    });
  });

  verifyOtpBtn.addEventListener('click', function () {
    var kode = verdi('otp');
    window.PP_API.verifyOtp(verdi('telefon'), kode, otpForventet).then(function (svar) {
      if (svar.verified) {
        telefonVerifisert = true;
        visFeil('otp', false);
        visFeil('telefonVerifisert', false);
        otpFelt.hidden = true;
        sendOtpBtn.hidden = true;
        otpStatus.innerHTML = '<strong style="color:var(--brand-dark)">✓ Mobilnummer bekreftet</strong>';
      } else {
        telefonVerifisert = false;
        visFeil('otp', true);
      }
    });
  });

  /* ---------------- posisjon (frivillig, eget samtykke) ---------------- */

  var geoStatus = document.getElementById('geo-status');
  var geoAllow = document.getElementById('geo-allow');
  var geoSkip = document.getElementById('geo-skip');

  function settGeoStatus(tekst, tilstand) {
    geoStatus.textContent = tekst;
    if (tilstand) geoStatus.setAttribute('data-state', tilstand);
    else geoStatus.removeAttribute('data-state');
  }

  geoAllow.addEventListener('click', function () {
    if (!('geolocation' in navigator)) {
      settGeoStatus('Nettleseren din støtter ikke posisjon. Du kan fortsette uten.', 'error');
      return;
    }
    settGeoStatus('Henter posisjon …');
    navigator.geolocation.getCurrentPosition(function (pos) {
      posisjonSamtykke = true;
      posisjon = {
        // Avrundet til ca. 100 m: nok for matching, mindre inngripende enn eksakt punkt.
        lat: Math.round(pos.coords.latitude * 1000) / 1000,
        lon: Math.round(pos.coords.longitude * 1000) / 1000,
        noyaktighet: Math.round(pos.coords.accuracy),
        tidspunkt: new Date().toISOString()
      };
      settGeoStatus('✓ Posisjon delt (omtrentlig punkt lagret). Du kan slå dette av når som helst.', 'ok');
      geoAllow.textContent = 'Oppdater posisjon';
      geoSkip.textContent = 'Slett posisjonen';
    }, function (err) {
      posisjonSamtykke = false;
      posisjon = null;
      var melding = err.code === 1
        ? 'Posisjon ble avslått. Det er helt greit – du kan fortsette uten.'
        : 'Klarte ikke å hente posisjon. Du kan fortsette uten.';
      settGeoStatus(melding, 'error');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
  });

  geoSkip.addEventListener('click', function () {
    posisjon = null;
    posisjonSamtykke = false;
    geoAllow.textContent = 'Del posisjonen min';
    geoSkip.textContent = 'Ikke nå';
    settGeoStatus('Ingen posisjon delt. Vi bruker sted og postnummer i stedet.');
  });

  /* ---------------- betingede felt ---------------- */

  var helsefag = document.getElementById('sert-helsefag');
  var hprField = document.getElementById('hpr-field');
  if (helsefag && hprField) {
    helsefag.addEventListener('change', function () { hprField.hidden = !helsefag.checked; });
  }

  var orgnrField = document.getElementById('orgnr-field');
  Array.prototype.forEach.call(form.querySelectorAll('input[name="utbetaling"]'), function (r) {
    r.addEventListener('change', function () { orgnrField.hidden = valgtRadio('utbetaling') !== 'foretak'; });
  });

  var erfaring = document.getElementById('erfaring');
  var erfaringCount = document.getElementById('erfaring-count');
  if (erfaring && erfaringCount) {
    erfaring.addEventListener('input', function () {
      erfaringCount.textContent = erfaring.value.length + ' / 600 tegn';
    });
  }

  /* ---------------- oppsummering ---------------- */

  var ETIKETTER = {
    'til-fots': 'Til fots', sykkel: 'Sykkel', kollektiv: 'Kollektivt', bil: 'Bil',
    mandag: 'Man', tirsdag: 'Tir', onsdag: 'Ons', torsdag: 'Tor', fredag: 'Fre', lordag: 'Lør', sondag: 'Søn',
    morgen: 'Morgen', formiddag: 'Formiddag', ettermiddag: 'Ettermiddag', kveld: 'Kveld',
    handling: 'Handling og ærend', folge: 'Følge til avtale', turer: 'Turer og aktivitet',
    digital: 'Digital hjelp', praktisk: 'Praktisk i hjemmet', sosialt: 'Sosialt samvær',
    ute: 'Ute og sesong', transport: 'Transport i egen bil',
    norsk: 'Norsk', engelsk: 'Engelsk', tyrkisk: 'Tyrkisk', polsk: 'Polsk',
    arabisk: 'Arabisk', somali: 'Somali', urdu: 'Urdu', annet: 'Annet',
    privat: 'Privatperson', foretak: 'Enkeltpersonforetak / AS'
  };

  function etikett(v) { return ETIKETTER[v] || v; }

  function rad(dt, dd) {
    return '<div class="row"><dt>' + dt + '</dt><dd>' + dd + '</dd></div>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function byggOppsummering() {
    var liste = document.getElementById('summary-list');
    var oppgaver = avkrysset('oppgaver').map(etikett).join(', ') || '–';
    var sprak = avkrysset('sprak').map(etikett).join(', ') || 'Ikke oppgitt';
    var html = '';
    html += rad('Navn', escapeHtml(verdi('fornavn') + ' ' + verdi('etternavn')));
    html += rad('E-post', escapeHtml(verdi('epost')));
    html += rad('Mobil', escapeHtml(verdi('telefon')) + (telefonVerifisert ? ' <span style="color:var(--brand-dark)">✓ bekreftet</span>' : ''));
    html += rad('Sted', escapeHtml(verdi('postnummer') + ' ' + verdi('by')));
    html += rad('Maks avstand', 'Inntil ' + escapeHtml(valgtRadio('maksAvstand')) + ' km');
    html += rad('Transport', avkrysset('transport').map(etikett).join(', ') || '–');
    html += rad('Posisjon', posisjonSamtykke && posisjon
      ? 'Delt (omtrentlig punkt, kan slås av senere)'
      : 'Ikke delt');
    html += rad('Dager', avkrysset('dager').map(etikett).join(', ') || '–');
    html += rad('Tidsrom', avkrysset('tidsrom').map(etikett).join(', ') || '–');
    html += rad('Oppdrag', escapeHtml(oppgaver));
    html += rad('Språk', escapeHtml(sprak));
    html += rad('Referanser', escapeHtml(verdi('ref1Navn')) + ' og ' + escapeHtml(verdi('ref2Navn')));
    html += rad('Utbetaling', etikett(valgtRadio('utbetaling')));
    liste.innerHTML = html;
  }

  /* ---------------- kladd (kun i denne nettleserøkten) ---------------- */

  var IKKE_LAGRE = ['otp', 'fodselsdato'];

  function lagreKladd() {
    try {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || IKKE_LAGRE.indexOf(el.name) !== -1) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) {
            data[el.name] = data[el.name] || [];
            data[el.name].push(el.value);
          }
        } else if (el.value) {
          data[el.name] = el.value;
        }
      });
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) { /* ignorer – kladd er en bekvemmelighet, ikke et krav */ }
  }

  function lastKladd() {
    var data;
    try {
      var raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      data = JSON.parse(raw);
    } catch (e) { return; }

    Object.keys(data).forEach(function (navn) {
      var verdier = data[navn];
      var felter = form.querySelectorAll('[name="' + navn + '"]');
      if (!felter.length) return;
      if (Array.isArray(verdier)) {
        Array.prototype.forEach.call(felter, function (el) {
          if (verdier.indexOf(el.value) !== -1) el.checked = true;
        });
      } else if (felter[0]) {
        felter[0].value = verdier;
      }
    });

    if (helsefag && hprField) hprField.hidden = !helsefag.checked;
    if (orgnrField) orgnrField.hidden = valgtRadio('utbetaling') !== 'foretak';
    if (erfaring && erfaringCount) erfaringCount.textContent = erfaring.value.length + ' / 600 tegn';
  }

  form.addEventListener('input', lagreKladd);
  form.addEventListener('change', lagreKladd);

  var clearDraft = document.getElementById('clear-draft');
  if (clearDraft) {
    clearDraft.addEventListener('click', function () {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
      form.reset();
      telefonVerifisert = false;
      posisjon = null;
      posisjonSamtykke = false;
      otpForventet = null;
      sendOtpBtn.hidden = false;
      otpFelt.hidden = true;
      otpStatus.textContent = '';
      settGeoStatus('Ingen posisjon delt.');
      if (hprField) hprField.hidden = true;
      if (orgnrField) orgnrField.hidden = true;
      visSteg(1);
    });
  }

  /* ---------------- innsending ---------------- */

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validerSteg(SISTE_STEG)) return;

    var soknad = {
      person: {
        fornavn: verdi('fornavn'),
        etternavn: verdi('etternavn'),
        fodselsdato: verdi('fodselsdato'),
        epost: verdi('epost'),
        telefon: verdi('telefon'),
        telefonVerifisert: telefonVerifisert
      },
      sted: {
        by: verdi('by'),
        postnummer: verdi('postnummer'),
        maksAvstandKm: Number(valgtRadio('maksAvstand')),
        transport: avkrysset('transport'),
        posisjon: posisjonSamtykke ? posisjon : null
      },
      tilgjengelighet: {
        dager: avkrysset('dager'),
        tidsrom: avkrysset('tidsrom'),
        timerPerUke: verdi('timerPerUke'),
        startdato: verdi('startdato')
      },
      kompetanse: {
        oppgaver: avkrysset('oppgaver'),
        sprak: avkrysset('sprak'),
        erfaring: verdi('erfaring'),
        sertifikater: avkrysset('sertifikater'),
        hprNummer: verdi('hprNummer')
      },
      verifisering: {
        referanser: [
          { navn: verdi('ref1Navn'), telefon: verdi('ref1Telefon'), relasjon: verdi('ref1Relasjon') },
          { navn: verdi('ref2Navn'), telefon: verdi('ref2Telefon'), relasjon: verdi('ref2Relasjon') }
        ],
        utbetaling: valgtRadio('utbetaling'),
        orgnummer: verdi('orgnummer')
      },
      // Samtykker logges med tidspunkt og versjon – GDPR krever at de kan dokumenteres.
      samtykker: {
        vilkar: { gitt: felt('samtykkeVilkar').checked, versjon: '2026-01', tidspunkt: new Date().toISOString() },
        personvern: { gitt: felt('samtykkePersonvern').checked, versjon: '2026-01', tidspunkt: new Date().toISOString() },
        referansesjekk: { gitt: felt('samtykkeReferanser').checked, tidspunkt: new Date().toISOString() },
        posisjon: { gitt: posisjonSamtykke, tidspunkt: posisjon ? posisjon.tidspunkt : null },
        markedsforing: { gitt: felt('samtykkeMarkedsforing').checked, tidspunkt: new Date().toISOString() }
      }
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sender …';

    window.PP_API.registrerHjelper(soknad).then(function (svar) {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
      document.getElementById('receipt-ref').textContent = svar.referanse;
      visSteg(KVITTERING);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Jeg er klar for å ta oppdrag';
      alert('Noe gikk galt under innsendingen. Prøv igjen om litt.');
    });
  });

  /* ---------------- oppstart ---------------- */
  lastKladd();
  visSteg(1);
})();
