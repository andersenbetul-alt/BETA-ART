/* Minimal testharness – ingen avhengigheter, så `npm test` virker overalt. */

var bestatt = 0;
var feilet = [];
var naavaerendeGruppe = '';

function gruppe(navn) {
  naavaerendeGruppe = navn;
  console.log('\n' + navn);
}

function test(navn, fn) {
  try {
    fn();
    bestatt++;
    console.log('  ✓ ' + navn);
  } catch (e) {
    feilet.push({ gruppe: naavaerendeGruppe, navn: navn, feil: e.message });
    console.log('  ✗ ' + navn + '\n      ' + e.message);
  }
}

function erLik(faktisk, forventet, melding) {
  var a = JSON.stringify(faktisk);
  var b = JSON.stringify(forventet);
  if (a !== b) throw new Error((melding ? melding + ': ' : '') + 'forventet ' + b + ', fikk ' + a);
}

function erSann(verdi, melding) {
  if (!verdi) throw new Error(melding || 'forventet sann verdi, fikk ' + JSON.stringify(verdi));
}

function erUsann(verdi, melding) {
  if (verdi) throw new Error(melding || 'forventet usann verdi, fikk ' + JSON.stringify(verdi));
}

function oppsummer(tittel) {
  console.log('\n' + '─'.repeat(58));
  console.log(tittel + ': ' + bestatt + ' bestått, ' + feilet.length + ' feilet');
  if (feilet.length) {
    feilet.forEach(function (f) { console.log('  ✗ ' + f.gruppe + ' → ' + f.navn); });
    process.exitCode = 1;
  }
  return feilet.length === 0;
}

module.exports = { gruppe: gruppe, test: test, erLik: erLik, erSann: erSann, erUsann: erUsann, oppsummer: oppsummer };
