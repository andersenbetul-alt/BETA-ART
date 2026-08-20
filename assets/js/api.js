/* Naviar – API-adapter.
   Frontend snakker kun med dette laget. I demomodus finnes ingen backend,
   og personopplysninger sendes ingen steder. Når backend er på plass,
   byttes DEMO til false og endepunktene under tas i bruk. */

window.PP_API = (function () {
  'use strict';

  var DEMO = true;
  var BASE = '/api/v1';

  function post(path, body) {
    return fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function delay(ms, value) {
    return new Promise(function (resolve) { setTimeout(function () { resolve(value); }, ms); });
  }

  function referanseNummer() {
    var d = new Date();
    var stamp = String(d.getFullYear()).slice(2) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    var rnd = Math.floor(Math.random() * 9000 + 1000);
    return 'PP-' + stamp + '-' + rnd;
  }

  return {
    demo: DEMO,

    /* Sender engangskode på SMS. I demo returneres koden slik at flyten kan testes. */
    sendOtp: function (telefon) {
      if (DEMO) {
        var kode = String(Math.floor(Math.random() * 900000 + 100000));
        return delay(600, { sent: true, demoKode: kode });
      }
      return post('/auth/otp/send', { telefon: telefon });
    },

    /* Bekrefter engangskoden. */
    verifyOtp: function (telefon, kode, forventet) {
      if (DEMO) {
        return delay(400, { verified: kode === forventet });
      }
      return post('/auth/otp/verify', { telefon: telefon, kode: kode });
    },

    /* Oppretter hjelpersøknad. */
    registrerHjelper: function (soknad) {
      if (DEMO) {
        // Ingen personopplysninger forlater nettleseren i demomodus.
        return delay(900, { ok: true, referanse: referanseNummer(), status: 'til_verifisering' });
      }
      return post('/hjelpere/registrering', soknad);
    }
  };
})();
