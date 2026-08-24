#!/usr/bin/env node
/* Naviar Care – styringsskript for agenter.

   Leser kommandoer på stdin, én per linje, og svarer på stdout. Bygget fordi
   nettstedet ikke kan pokes med curl: alt av tilstand ligger i localStorage,
   arbeiderens side krever et token som bare finnes etter at et besøk er
   opprettet, og innsendingsknappen er disabled til et utfall er valgt.

   Bruk:
     printf 'flow\nquit\n' | node .claude/skills/run-naviar/driver.js

   Krever at en statisk server kjører. Se SKILL.md. */

var path = require('path');
var readline = require('readline');

function hentPlaywright() {
  /* Samme oppslag som tests/e2e.test.js: lokal først, så global. */
  try { return require('playwright'); } catch (e) {}
  var globale = [
    '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
    '/usr/local/lib/node_modules/playwright'
  ];
  for (var i = 0; i < globale.length; i++) {
    try { return require(globale[i]); } catch (e) {}
  }
  return null;
}

var BASE = (process.env.NAVIAR_BASE || 'http://localhost:8000').replace(/\/$/, '');
var BILDER = path.join(__dirname, 'skjermbilder');
var pw = hentPlaywright();

if (!pw) {
  console.log('FEIL: fant ikke Playwright. Se SKILL.md, avsnitt Prerequisites.');
  process.exit(1);
}

(async function () {
  var browser = await pw.chromium.launch();
  var side = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  var feil = [];

  /* Google Fonts nås ikke gjennom proxyen i dette miljøet. Uten disse to
     linjene fylles konsollen med ERR_CONNECTION_RESET som ser ut som
     applikasjonsfeil, men ikke er det. Testene gjør det samme. */
  await side.route('**://fonts.googleapis.com/**', function (r) { r.abort(); });
  await side.route('**://fonts.gstatic.com/**', function (r) { r.abort(); });
  side.on('pageerror', function (e) { feil.push('pageerror: ' + e.message); });
  side.on('console', function (m) {
    if (m.type() !== 'error') return;
    var url = (m.location() && m.location().url) || '';
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return;
    feil.push('console: ' + m.text());
  });

  function ut(s) { process.stdout.write(s + '\n'); }

  async function skjermbilde(navn) {
    require('fs').mkdirSync(BILDER, { recursive: true });
    var f = path.join(BILDER, (navn || 'skjerm') + '.png');
    await side.screenshot({ path: f, fullPage: true });
    ut('skrev ' + f);
  }

  /* Hvilken av de tre seksjonene på utfor.html som vises. Å lese <h1> gir
     feil svar: overskriften til den skjulte sperre-seksjonen står først i
     dokumentet og hentes av document.querySelector('h1') uansett. */
  async function seksjon() {
    return side.evaluate(function () {
      return ['sperret', 'skjema', 'ferdig'].filter(function (id) {
        var e = document.getElementById(id);
        return e && !e.hidden;
      });
    });
  }

  /* Oppretter et besøk og returnerer arbeiderlenka. Uten denne finnes det
     ingen gyldig ?t=-token, og utfor.html viser bare «Mangler lenke». */
  async function nyttBesok() {
    await side.goto(BASE + '/besok/nytt.html');
    await side.waitForTimeout(400);
    await side.fill('#kunde', 'Kari');
    var bokser = await side.$$('input[type=checkbox]');
    if (bokser.length) await bokser[0].check();
    await side.fill('#dato', '2026-09-01');
    await side.fill('#tid', '14:00');
    await side.selectOption('#ansatt', 'a1');
    await side.click('button[type=submit]');
    await side.waitForTimeout(600);
    return side.evaluate(function () {
      var e = document.getElementById('k-lenke');
      return e ? e.textContent : null;
    });
  }

  var KOMMANDOER = {
    async open(arg) {
      var url = /^https?:/.test(arg) ? arg : BASE + (arg.charAt(0) === '/' ? arg : '/' + arg);
      await side.goto(url);
      await side.waitForTimeout(400);
      ut('url: ' + side.url());
      ut('tittel: ' + await side.title());
    },

    async ss(arg) { await skjermbilde(arg); },

    async seksjon() { ut(JSON.stringify(await seksjon())); },

    async nytt() {
      var l = await nyttBesok();
      ut(l ? 'arbeiderlenke: ' + l : 'FEIL: fikk ingen lenke');
    },

    /* Personvernsperra kalt direkte i sida. Raskeste vei til å se om et ord
       stoppes, uten å gå gjennom skjemaet. */
    async vern(arg) {
      if (!await side.evaluate(function () { return !!window.PP_VERN; })) {
        await side.goto(BASE + '/besok/nytt.html');
        await side.waitForTimeout(300);
      }
      var d = await side.evaluate(function (t) {
        var r = window.PP_VERN.sjekk(t);
        return { ok: r.ok, funn: r.funn.map(function (f) { return f.id + ': ' + f.beskjed; }) };
      }, arg);
      ut(d.ok ? 'ok – kan lagres' : 'BLOKKERT\n  ' + d.funn.join('\n  '));
    },

    /* Hele veien: kontoret oppretter, arbeideren melder fra, sperra prøves. */
    async flow() {
      var lenke = await nyttBesok();
      if (!lenke) { ut('FEIL: ingen arbeiderlenke'); return; }
      ut('1. besøk opprettet -> ' + lenke);

      await side.goto(lenke);
      await side.waitForTimeout(500);
      ut('2. arbeiderside, seksjon: ' + JSON.stringify(await seksjon()));
      await skjermbilde('1-utfor');

      /* #send er disabled til et utfall er valgt. Fem faste utfall, ingen
         fritekst – det er regelen, ikke en begrensning i skjemaet. */
      await side.click('#skjema .a-knapp');
      ut('3. utfall valgt, send aktiv: ' +
         await side.evaluate(function () { return !document.getElementById('send').disabled; }));

      await side.fill('#kommentar', 'Hun virket forvirret og hadde vondt i beinet');
      await side.click('#send');
      await side.waitForTimeout(400);
      var f = await side.evaluate(function () {
        var e = document.querySelector('[data-error-for="kommentar"]');
        return e && e.classList.contains('show') ? e.textContent : null;
      });
      ut('4. helseord: ' + (f ? 'BLOKKERT – "' + f + '"' : 'IKKE BLOKKERT (feil!)'));
      await skjermbilde('2-sperret');

      await side.fill('#kommentar', 'Varene er satt på plass.');
      await side.click('#send');
      await side.waitForTimeout(800);
      var s = await seksjon();
      ut('5. ren tekst: ' + (s.indexOf('ferdig') !== -1 ? 'sendt inn' : 'FEIL, seksjon ' + JSON.stringify(s)));
      await skjermbilde('3-ferdig');
    },

    async eval(arg) {
      ut(JSON.stringify(await side.evaluate('(' + arg + ')'), null, 2));
    },

    async feil() { ut(feil.length ? feil.join('\n') : '(ingen)'); },

    async hjelp() {
      ut('open <sti> | ss <navn> | seksjon | nytt | vern <tekst> | flow | eval <js> | feil | quit');
    }
  };

  var rl = readline.createInterface({ input: process.stdin, terminal: false });
  ut('naviar-driver klar. BASE=' + BASE + '. «hjelp» for kommandoer.');

  for await (var linje of rl) {
    var s = linje.trim();
    if (!s) continue;
    if (s === 'quit' || s === 'exit') break;
    var mel = s.indexOf(' ');
    var navn = mel === -1 ? s : s.slice(0, mel);
    var arg = mel === -1 ? '' : s.slice(mel + 1);
    if (!KOMMANDOER[navn]) { ut('ukjent: ' + navn + ' (prøv «hjelp»)'); continue; }
    try { await KOMMANDOER[navn](arg); }
    catch (e) { ut('FEIL: ' + e.message.split('\n')[0]); }
  }

  await browser.close();
  ut('ferdig.');
})();
