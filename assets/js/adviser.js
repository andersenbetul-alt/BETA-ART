/* =============================================================================
   The adviser application form on radgiver.html.

   Posts to /api/advisers and reports the result in the page's own language.
   The page has two copies of the form (Norwegian and English); both use the
   same handler, and the message strings follow the form's language.
   ========================================================================== */
(function (global, document) {
  'use strict';

  var CFG = global.NAVIAR_CONFIG || {};
  var API = CFG.apiBase || '';

  var MSG = {
    no: {
      sent: 'Takk! Søknaden er mottatt. Vi tar kontakt etter at vi har lest den.',
      taken: 'Denne e-postadressen har allerede søkt. Vi tar kontakt.',
      missing: 'Fyll ut navn, e-post og hva du vil rådgi om.',
      consent: 'Du må samtykke til behandlingen for å søke.',
      failed: 'Noe gikk galt. Prøv igjen, eller send en e-post.'
    },
    en: {
      sent: 'Thank you! Your application has been received. We will be in touch once we have read it.',
      taken: 'This email address has already applied. We will be in touch.',
      missing: 'Fill in your name, email and what you want to advise on.',
      consent: 'You must consent to the processing to apply.',
      failed: 'Something went wrong. Try again, or send an email.'
    }
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-adviser-form]'), function (form) {
    var lang = form.closest('[data-legal-body]');
    var t = MSG[(lang && lang.dataset.legalBody) === 'en' ? 'en' : 'no'];
    var status = form.querySelector('[data-adviser-status]');

    function say(msg, ok) {
      status.textContent = msg;
      status.className = 'apply-status show ' + (ok ? 'ok' : 'err');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (!f.consent.checked) return say(t.consent, false);
      if (!f.name.value.trim() || !f.email.value.trim() || !f.specialty.value.trim()) {
        return say(t.missing, false);
      }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      fetch(API + '/api/advisers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.value.trim(),
          email: f.email.value.trim(),
          phone: f.phone.value.trim(),
          specialty: f.specialty.value.trim(),
          bio: f.bio.value.trim(),
          lang: document.documentElement.lang || 'no',
          consent: true
        })
      }).then(function (res) {
        if (res.ok) { form.reset(); return say(t.sent, true); }
        if (res.status === 409) return say(t.taken, true);
        if (res.status === 400) return say(t.missing, false);
        return say(t.failed, false);
      }).catch(function () {
        say(t.failed, false);
      }).finally(function () {
        btn.disabled = false;
      });
    });
  });
}(window, document));
