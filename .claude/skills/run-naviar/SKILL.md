---
name: run-naviar
description: Build, serve, screenshot and drive the Naviar Care site. Use when asked to run, start, serve, launch, screenshot, smoke-test or click through Naviar — the visit tool (besok/), the Klarhet pages, or the elder's approval screen. Also for testing the PP_VERN privacy gate against sample text.
---

# Kjøre Naviar Care

Statisk nettsted: HTML, CSS og JavaScript uten avhengigheter og uten byggesteg.
Det finnes ingen bundler og ingen backend. `npm` brukes bare til tester.

Nettstedet kan ikke pokes med `curl` alene: all tilstand ligger i
`localStorage`, arbeiderens side krever et token som først finnes etter at et
besøk er opprettet, og innsendingsknappen er `disabled` til et utfall er
valgt. Derfor finnes `driver.js`.

Alle stier under er relative til repoets rot.

## Prerequisites

Ingen `apt-get` nødvendig i dette bildet. Sjekk at de tre tingene finnes:

```bash
node --version
node -e "require('/opt/node22/lib/node_modules/playwright'); console.log('playwright ok')"
ls /opt/pw-browsers
```

Verifisert: Node v22.22.2, Playwright på global sti, Chromium i
`/opt/pw-browsers`. Driveren leter lokalt først og faller tilbake på globale
stier, på samme måte som `tests/e2e.test.js`.

Ingen `npm install`. `node_modules` finnes ikke og skal ikke oppstå.

## Build

Ingen. Filene serveres som de er.

## Run (agent path)

Start en statisk server, og la den stå:

```bash
python3 -m http.server 8000 >/tmp/naviar-server.log 2>&1 &
sleep 2 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
```

Kjør så driveren. Den leser kommandoer på stdin, én per linje:

```bash
printf 'flow\nquit\n' | node .claude/skills/run-naviar/driver.js
```

`flow` går hele veien gjennom produktets kjerne og skriver tre skjermbilder:

```
1. besøk opprettet -> http://localhost:8000/besok/utfor.html?t=dwajgsmcygqd
2. arbeiderside, seksjon: ["skjema"]
3. utfall valgt, send aktiv: true
4. helseord: BLOKKERT – "Dette ser ut som en helseopplysning. Skriv hva som
   ble gjort, ikke hvordan personen har det."
5. ren tekst: sendt inn
```

### Kommandoer

| Kommando | Gjør |
|---|---|
| `open <sti>` | Går til siden, skriver url og tittel |
| `ss <navn>` | Fullsides skjermbilde til `.claude/skills/run-naviar/skjermbilder/<navn>.png` |
| `nytt` | Oppretter et besøk, skriver arbeiderlenka med gyldig token |
| `seksjon` | Hvilken av `sperret`/`skjema`/`ferdig` som vises på utfor.html |
| `vern <tekst>` | Kjører `PP_VERN.sjekk()` direkte og sier om teksten kan lagres |
| `flow` | Hele flyten fra opprettet besøk til innsendt melding |
| `eval <js>` | Kjører uttrykket i sida |
| `feil` | Alle JS-feil samlet så langt |

Skjermbilde av en enkeltside:

```bash
printf 'open /godkjenn.html\nss godkjenn\nquit\n' | node .claude/skills/run-naviar/driver.js
```

### Direct invocation

`vern` er den raske veien til personvernsperra uten å gå gjennom skjemaet:

```bash
printf 'vern Hun har diabetes\nvern Varene er levert\nquit\n' | node .claude/skills/run-naviar/driver.js
```

```
BLOKKERT
  helse: Dette ser ut som en helseopplysning. Skriv hva som ble gjort, ikke
  hvordan personen har det.
ok – kan lagres
```

Reglene ligger i `assets/js/besok-vern.js` som `window.PP_VERN`. Modulene er
IIFE-er uten eksport, så de må kjøres i en side; det er derfor `vern` går via
nettleseren og ikke via `require`.

Annen base-url: `NAVIAR_BASE=http://localhost:9000 node …/driver.js`.

## Run (human path)

```bash
npm start
```

Starter `python3 -m http.server 8000`. Åpne `http://localhost:8000/`. Uten
skjerm gir dette ingenting; bruk driveren.

## Test

```bash
npm test
```

305 enhetstester og 153 nettlesertester. Testkjøreren starter sin egen server
på port 8765, så den kolliderer ikke med 8000.

```bash
npm run test:enhet     # bare logikken, ingen nettleser
npm run sjekk          # node --check på alle 39 modulene
```

## Gotchas

**`utfor.html` uten token viser «Mangler lenke».** Siden er ikke ødelagt. Den
krever `?t=<token>`, og tokenet finnes bare etter at et besøk er opprettet i
`besok/nytt.html`. Bruk `nytt` eller `flow`; ikke naviger dit direkte.

**`document.querySelector('h1')` gir feil svar på `utfor.html`.** Overskriften
til den skjulte sperre-seksjonen står først i dokumentet og hentes uansett
hvilken seksjon som vises. Ved en fungerende lenke får du `h1` = «Lenken
virker ikke» samtidig som skjemaet er synlig. Bruk `seksjon`, som leser
`hidden` på `sperret`/`skjema`/`ferdig`.

**`#send` er `disabled` til et utfall er valgt.** Fem faste utfall ligger som
`.a-knapp` i `#skjema`. Playwright venter i 30 sekunder og feiler med «element
is not enabled» hvis du hopper over det. Klikk `#skjema .a-knapp` først.

**Google Fonts fyller konsollen med `ERR_CONNECTION_RESET`.** Proxyen i dette
miljøet slipper dem ikke gjennom. Det er ikke en applikasjonsfeil. Driveren
avviser de to vertene med `page.route`, slik `tests/e2e.test.js` også gjør.
Uten det ser hver eneste side ut til å ha feil.

**Innlogging er ikke en sperre.** `besok/nytt.html` laster og fungerer uten at
du har vært innom `logg-inn.html`. `DEMO = true` i `assets/js/api.js`.

**Tilstand overlever mellom kommandoer, ikke mellom kjøringer.** Besøk ligger
i `localStorage` i én nettleserkontekst. Hver ny driverkjøring starter tom, og
gamle tokens virker ikke.

## Troubleshooting

| Symptom | Fiks |
|---|---|
| `FEIL: fant ikke Playwright` | Sjekk `ls /opt/node22/lib/node_modules/playwright`. Ikke kjør `npm install playwright` i repoet. |
| `page.click: Timeout … #send … element is not enabled` | Utfall ikke valgt. Klikk `#skjema .a-knapp` først. |
| `flow` skriver `FEIL: ingen arbeiderlenke` | Serveren svarer ikke. `curl -I http://localhost:8000/besok/nytt.html`. |
| `seksjon` gir `["sperret"]` | Tokenet er ugyldig eller fra en tidligere kjøring. Kjør `nytt` på nytt. |
| Alle sider ser tomme ut i skjermbildet | Serveren kjører fra feil mappe. Start den fra repoets rot. |
