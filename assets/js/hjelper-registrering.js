/* Skjermen der en medarbeider registrerer seg.

   Skjemaet bygges av PP_HJELPERBASE.FELT. Da kan det ikke komme til å spørre
   om noe som ikke finnes i basen, og basen kan ikke få et felt ingen har
   begrunnet – de to holder hverandre i sjakk.

   Fritekst går gjennom PP_VERN før lagring, som alle andre steder. */

(function () {
  'use strict';

  var HB = window.PP_HJELPERBASE;
  var HO = window.PP_HJELPER;

  var DAGER = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  var TIDER = [
    { id: 'formiddag', navn: 'Formiddag' },
    { id: 'ettermiddag', navn: 'Ettermiddag' },
    { id: 'kveld', navn: 'Kveld, til klokka 20' }
  ];

  /* Bekreftelsene er ikke en formalitet. Hver av dem er en grense noen kommer
     til å bli spurt om å bryte, og da er det bedre at hun har lest den her. */
  var BEKREFTELSER = [
    'Jeg er fylt 18 år',
    'Jeg har rett til å arbeide i Norge',
    'Jeg forstår at oppdragene ikke er helsehjelp, og at jeg ikke skal utføre helsehjelp',
    'Jeg forstår at jeg aldri skal håndtere BankID, PIN, passord eller kontanter',
    'Jeg samtykker til at referansene mine kontaktes'
  ];

  function el(id) { return document.getElementById(id); }

  function tegnValg(vert, navn, valg) {
    vert.innerHTML = '';
    valg.forEach(function (v, i) {
      var id = navn + '-' + i;
      var l = document.createElement('label');
      l.className = 'option';
      l.setAttribute('for', id);
      l.innerHTML = '<input type="checkbox" id="' + id + '" name="' + navn + '" value="' +
        (v.id || v) + '"><span>' + (v.navn || v) + '</span>';
      vert.appendChild(l);
    });
  }

  function valgte(navn) {
    return Array.prototype.slice
      .call(document.querySelectorAll('input[name="' + navn + '"]:checked'))
      .map(function (i) { return i.value; });
  }

  function feil(felt, vis) {
    var p = document.querySelector('[data-error-for="' + felt + '"]');
    if (p) p.classList.toggle('show', !!vis);
    return !vis;
  }

  function tegnFelttabell() {
    var kropp = el('felttabell').querySelector('tbody');
    HB.FELT.forEach(function (f) {
      if (f.id === 'status' || f.id === 'opprettet' || f.id === 'identBekreftet' ||
          f.id === 'arbeidsforhold' || f.id === 'proveresultat') return;
      var frist = HB.FRISTER[f.frist];
      var rad = document.createElement('tr');
      var naar = frist.dager === null
        ? 'Så lenge du arbeider hos oss'
        : 'Slettes etter ' + frist.dager + ' dager hvis du ikke går videre';
      rad.innerHTML = '<td>' + f.navn + '</td><td>' + f.hvorfor + '. ' + naar + '.</td>';
      kropp.appendChild(rad);
    });
  }

  function tegnIkkeLagres() {
    var viktigst = HB.FINNES_IKKE.slice(0, 6).map(function (f) {
      return f.hva.toLowerCase();
    });
    el('ikke-lagres').textContent =
      'Vi spør ikke om, og lagrer ikke: ' + viktigst.join(', ') + '.';
  }

  function tegnSlettefrist() {
    el('slettefrist').textContent =
      'Går du ikke videre i prosessen, slettes søknaden etter ' +
      HB.FRISTER.avslag_kort.dager + ' dager. Du trenger ikke be om det.';
  }

  function tegnKvittering(kandidat) {
    el('soknad-skjema').hidden = true;
    el('hvorfor-kort').hidden = true;
    var k = el('kvittering');
    k.hidden = false;

    el('kvittering-tekst').textContent =
      'Takk, ' + kandidat.fornavn + '. Vi tar kontakt på ' + kandidat.telefon +
      ' eller ' + kandidat.epost + '.';

    var liste = el('kvittering-trinn');
    liste.innerHTML = '';
    HO.TRINN.forEach(function (t) {
      if (t.nr === 1) return;                 // søknaden er nettopp sendt
      var li = document.createElement('li');
      li.textContent = t.navn + ' – ' + t.gjor.toLowerCase();
      liste.appendChild(li);
    });
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function start() {
    if (!HB || !HO) return;

    tegnValg(el('dagerliste'), 'dager', DAGER);
    tegnValg(el('tiderliste'), 'tider', TIDER);
    tegnValg(el('bekreftelser'), 'bekreftelser', BEKREFTELSER.map(function (b, i) {
      return { id: 'b' + i, navn: b };
    }));
    tegnFelttabell();
    tegnIkkeLagres();
    tegnSlettefrist();

    el('soknad-skjema').addEventListener('submit', function (e) {
      e.preventDefault();

      var v = {
        fornavn: el('fornavn').value.trim(),
        etternavn: el('etternavn').value.trim(),
        telefon: el('telefon').value.trim(),
        epost: el('epost').value.trim(),
        bydel: el('bydel').value.trim(),
        transport: el('transport').value,
        norsknivaa: el('norsknivaa').value,
        andreSprak: el('andreSprak').value.trim(),
        erfaring: el('erfaring').value.trim(),
        dager: valgte('dager'),
        tider: valgte('tider')
      };
      var ref1 = el('ref1').value.trim(), ref2 = el('ref2').value.trim();

      var ok = true;
      ok = feil('fornavn', !v.fornavn) && ok;
      ok = feil('etternavn', !v.etternavn) && ok;
      ok = feil('telefon', !/^[\d\s+]{8,}$/.test(v.telefon)) && ok;
      ok = feil('epost', !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v.epost)) && ok;
      ok = feil('bydel', !v.bydel) && ok;
      ok = feil('transport', !v.transport) && ok;
      ok = feil('dager', !v.dager.length) && ok;
      ok = feil('tider', !v.tider.length) && ok;
      ok = feil('norsknivaa', !v.norsknivaa) && ok;
      ok = feil('ref1', !ref1) && ok;
      ok = feil('ref2', !ref2) && ok;
      ok = feil('bekreftelser', valgte('bekreftelser').length !== BEKREFTELSER.length) && ok;

      /* Under B1 er ikke et avslag her. Nivået bekreftes av oss senere, og en
         søknad skal ikke stoppes av et tall kandidaten har satt selv. */
      if (!ok) return;

      v.referanser = [ref1, ref2];
      var r = HB.taImot(v);

      if (!r.ok) {
        feil('erfaring', true);
        var p = document.querySelector('[data-error-for="erfaring"]');
        if (p) {
          p.textContent = 'Denne teksten kan ikke lagres. Skriv om arbeidet, ' +
            'ikke om helse, penger eller koder.';
        }
        el('erfaring').focus();
        return;
      }

      var base = HB.les();
      base.kandidater.push(r.kandidat);
      HB.skriv(base);
      tegnKvittering(r.kandidat);
    });
  }

  if (window.PP_RUTER) window.PP_RUTER['bli-medarbeider'] = start;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
