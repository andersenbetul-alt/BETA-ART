# Designsystemet

Skrevet for den som skal føre et Figma-design over i denne kodebasen, eller
motsatt. Den korte versjonen: her finnes ingen komponentbibliotek, ingen
rammeverk og intet byggesteg, og det er et valg. Du må derfor oversette et
Figma-design til tokens og markup, ikke importere det som komponenter.

## 1. Tokens

Ett sted: `assets/css/styles.css`, som 23 egenskaper på `:root`.

```css
--ink: #101a2e;          /* logoens marineblå. Merket ER denne fargen */
--brand: #1f6f5c;        /* handling på lys flate. 6,0:1 mot hvitt */
--brand-pa-mork: #4cb99b;/* handling på mørk flate. 7,2:1 mot blekket */
--radius: 12px;  --radius-lg: 18px;
--font: "Inter", "Segoe UI", system-ui, …;
```

Ingen tokenkompilator, ingen JSON, ingen transformasjon. Fargen skrives én
gang og brukes via `var(--navn)`.

**To grønner, ikke én.** `--brand` gir 2,9:1 mot blekket og er uleselig på en
mørk flate. Velg etter flaten under, ikke etter hvilken grønn du husker.
Kommer et Figma-design med én accent, må den deles i to før den kan brukes.

**Ingen tilstand signaliseres med farge alene.** Utført er ikke «det grønne
feltet» – det er et felt med ✓ og ordet «Utført».

## 2. Komponenter

Det finnes ingen. Ingen React, ingen web components, ingen Storybook.

Gjenbruk skjer gjennom CSS-klasser med filprefiks:

| Prefiks | Fil | Flate |
|---|---|---|
| `.b-` | `besok.css` | Leverandørens skjermer |
| `.k-` | `klarhet.css` | Forsiden for Klarhet |
| `.x-` | `bestill.css` | Bestillingen |
| `.g-` | `godkjenn.css` | Den eldres godkjenning |

Prefikset er det som gjør at fire stilark kan ligge i samme dokument uten å
kollidere. Legger du til en flate, gi den sitt eget prefiks.

Logikken ligger i IIFE-moduler som eksponerer `window.PP_*`. Skjermene tegner
fra modulene og finner ikke på verdier selv: prisen, kategoriene, grensene og
akuttsetningen leses fra `PP_KLARHET` og `PP_EKSPERT`. En påstand som finnes
to steder, blir før eller siden to forskjellige påstander.

## 3. Rammeverk

Ingen. `node_modules` finnes ikke og skal ikke oppstå.

Nettleseren får ren HTML, CSS og JavaScript. `npm` brukes bare til å kjøre
tester og syntakskontroll. Playwright hentes fra global sti.

Et Figma-plugin som genererer React eller Tailwind produserer kode som ikke
kan brukes her. Det som kan brukes, er tokenverdier og målsatt markup.

## 4. Bilder

`assets/img/`. SVG for merket, PNG for delingsbilder og appikoner.

Delingsbildene tegnes av `verktoy/lag-og.js` i en nettleser, med ordene hentet
fra `PP_KLARHET`. Logofilene bygges av `verktoy/lag-logo.py`. Plate IV
(`verktoy/lag-plate.js`) hører til `docs/design/RETICENT-SYSTEMS.md` og er
kunst, ikke merkevare – den låner ikke tokenene og skal ikke gjøre det. Ingen
av skriptene er en del av nettstedet, og de kjøres for hånd.

Ingen CDN. Ingen bildeoptimalisering i drift – filene sjekkes inn ferdige.

## 5. Ikoner

Regelen: **tegn ikoner som inline SVG, aldri emoji.** Emoji ser ulikt ut på
hver plattform, og flere av dem er ansikter eller hender med hudtone. Et
ansikt på en kategori er en tolkning ingen har bedt om. En tjeneste for eldre
bør ikke ha ikoner som ser forskjellige ut avhengig av hvilken telefon
brukeren har.

Tre steder tegner ikoner, og alle tre følger regelen. `bestill-skjerm.js` og
`godkjenn-skjerm.js` har hvert sitt `SVG`-oppslag. `besok-lager.js` bærer
banen på oppgaven selv og tegner den ett sted:

```js
{ id: 'samvaer', svg: 'M5 9h10.4v5.6a4.4 4.4 0 0 1-4.4 4.4H9.4A4.4…',
  navn: 'Besøk og samvær', ikon: '☕', risiko: 'gronn' }
```

```js
function ikonMarkup(oppgave, storrelse) {
  var o = oppgave || {};
  if (!o.svg) return '';           // ingen bane, ingen ikon – ikke et fallback til emoji
  return '<svg class="oppgaveikon" viewBox="0 0 24 24" … stroke-width="1.6"
          stroke-linecap="round" aria-hidden="true"><path d="' + o.svg + '" /></svg>';
}
```

Formatet er fast: 24×24, `viewBox="0 0 24 24"`, `stroke-width: 1.6`,
avrundede ender, `fill="none"`, `stroke="currentColor"`, `aria-hidden="true"`.
Ikonet er aldri den eneste bæreren av mening – navnet står ved siden av.

**Én ting står igjen.** `ikon`-nøkkelen med emojien lever fortsatt i
`OPPGAVER`, og `besok-behov.js` kopierer den videre inn i forslagsobjektet
sitt. Ingen skjerm tegner den, så den er død data og ikke en regelbrudd – men
den er en felle for neste person som leter etter «ikonet». Fjernes den, må
`besok-behov.js:140` fjernes i samme endring.

**Tegn ikonet på 20 px før du godtar det.** Kosten som først ble tegnet her,
var uleselig i den størrelsen den faktisk vises i, og måtte tegnes om til en
sprayflaske. Et ikon som bare virker på 48 px, virker ikke.

## 6. Stiler

Vanlig CSS med custom properties. Ingen preprosessor, ingen CSS-in-JS, ingen
klassegenerator.

`styles.css` er felles: tokens, `body`, knapper, skjemaer, `.skip-link`.
Flatestilarkene ligger over.

Inline `style=""` brukes bevisst på flater der en verdi hører til akkurat det
elementet – for eksempel en beregnet bredde. Alt som kan gjentas, er en klasse.

### Kravene som gjelder overalt

- Tastaturfokus er synlig: `:focus-visible` med egen ring, ikke nettleserens
- `@media (prefers-reduced-motion: reduce)` slår av overganger
- `@media (forced-colors: active)` beholder tilstand som form, ikke farge
- `[dir="rtl"]` snur retningen der språket krever det
- Bred kontekst (tabeller, kode) ruller i sin egen `overflow-x: auto`
- Ingen side flyter vannrett når brukeren setter skriften til 200 %

### Målte verdier, og hvor de kommer fra

| Hva | Verdi | Hvor | Hvorfor |
|---|---|---|---|
| Brødtekst, felles | `1.0625rem` | `styles.css` | 17 px ved standard 16, satt for pårørende på 40–70 |
| Brødtekst, eldres skjerm | `1.25rem` | `godkjenn.css` | 20 px ved standard 16 |
| Brødtekst, seniorflaten | `1.3125rem` | `senior.css` | 21 px ved standard 16 |
| Ja/nei-knapper | 96 px høye | `godkjenn.css` | 44 treffes ikke av en hånd som skjelver |
| Valgflater, bestilling | 76–78 px | `bestill.css` | Samme grunn, lavere innsats |
| Kontrast, all tekst | ≥ 4,5:1 | `styles.css` | Tallene per farge står i merkeskillet |

### Figma gir deg px. Ikke skriv dem inn som px

Dette er den enkeltregelen som er lettest å bryte når et design føres hit, og
den rammer nøyaktig de brukerne tjenesten er for.

En `font-size` i px ignorerer nettleserens egen skriftinnstilling fullstendig.
`rem` følger den. Målt med standardskriften satt til 32 px:

```
rot-elementet     : 32 px
font-size: 20px   : 20 px   ← rører seg ikke
font-size: 1.25rem: 40 px   ← følger brukeren
```

På våre egne sider var **bare `body` spikret** – rot, `h1`, knapper og småtekst
skalerte allerede. Det er det verste tilfellet: alt vokser rundt teksten som
faktisk skal leses. Derfor er de tre body-størrelsene rem, og derfor skal en
px-verdi fra Figma deles på 16 før den skrives inn.

Knappehøyder og flatemål kan stå i px – de er treffområder, ikke lesetekst.

### Norsk brekker der engelsk ikke gjør det

Da body ble rem, fløt tre sider vannrett ved 200 %. Årsakene var de samme fire
hver gang, og alle fire er nå regler:

- `overflow-wrap: break-word` globalt – «funksjonsnedsettelse» og
  «hjemmehjelpsoppdrag» får ikke plass på en telefon i 200 %
- `max-width: 100%` på `.btn` og `.big-choice`
- `min-width: 0` på rutenett- og flexbarn: de nekter som standard å krympe
  under innholdets egen minstebredde, og skyver forelderen ut i stedet
- `flex-wrap: wrap` på rader som ellers holder seg på én linje

Et Figma-design er satt på én bredde med engelsk fyllttekst. Ingen av disse
fire problemene er synlige der.

Se `docs/DESIGNGRUNNLAG.md` for hvordan disse settes og hvilken test som
holder dem fast.

## 7. Responsivt, og den andre inkonsekvensen

Mobil først i praksis, men bruddpunktene er ikke et system. Talt over de seks
stilarkene:

```
560 (7×)  620 (3×)  660  700  720  760  820  860  880  900 (5×)  1000  1080
```

Tolv forskjellige `max-width`, fordi hvert stilark har funnet sitt eget der
innholdet tilfeldigvis brøt. To av dem bærer nesten alt: **560** for telefon
og **900** for nettbrett. De ti andre er engangsverdier.

Det er ikke galt – et bruddpunkt satt der innholdet faktisk brekker, er bedre
enn et satt etter en enhetsliste. Men det skal være et valg, ikke en tilfeldighet.
Kommer det et nytt stilark, bruk 560 og 900 med mindre innholdet krever noe annet,
og skriv i så fall hvorfor.

## Struktur

```
/                  publikumssider (index, klarhet, bestill, godkjenn, …)
/besok             leverandørens skjermer
/assets/css        seks stilark: ett felles, fem per flate
/assets/js         39 moduler. window.PP_*, én fil per ansvar
/docs              beslutninger. /docs/team er rollenes underlag
/verktoy           skript som kjøres for hånd, ikke en del av nettstedet
/tests             egen harness, ingen rammeverk
```

Modulene deler seg i to: **regler** (`ekspertbistand`, `klarhet`, `betaling`,
`vern`, `merkesprak`, `klarsprak`) og **skjermer** (`*-skjerm`, `besok-*`).
Skjermer leser fra regler. Aldri motsatt.

## Å føre et Figma-design hit

1. **Hent tokenverdiene, ikke komponentene.** Farge, radius, typeskala.
   Sjekk kontrasten før du innfører en farge, og ta med tallet.
2. **Del accenten i to** hvis designet har én grønn: en for lys flate, en for
   mørk.
3. **Gi flaten et klasseprefiks** og et eget stilark.
4. **Del px på 16 for all lesetekst.** Treffområder kan bli px. Se
   «Figma gir deg px» over – dette er punktet som faktisk rammer brukerne.
5. **Ikoner som SVG**, 24×24, ikke emoji og ikke PNG. Tegn dem på 20 px før
   du godtar dem.
6. **Tekst i markup, tall i modul.** Priser, kategorier og grenser leses fra
   `PP_*` – de skrives ikke inn i skjermen.
7. **Prøv siden på 200 %** før du sier den er ferdig. `min-width: 0` på
   rutenettbarn og `max-width: 100%` på knapper er nesten alltid det som mangler.
8. **Kjør `npm test`.** Klarspråktesten måler ni sider, og en ny flate som
   ligger over grensa for sin teksttype, feiler.

Det som ikke kan føres hit: komponenthierarkier, Tailwind-klasser, generert
React, og skrifter som ikke ligger på Google Fonts eller som en `@font-face`
med innebygd fil.
