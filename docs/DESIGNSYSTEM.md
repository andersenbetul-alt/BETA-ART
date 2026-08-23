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
fra `PP_KLARHET`. Logofilene bygges av `verktoy/lag-logo.py`. Ingen av
skriptene er en del av nettstedet, og de kjøres for hånd.

Ingen CDN. Ingen bildeoptimalisering i drift – filene sjekkes inn ferdige.

## 5. Ikoner, og en inkonsekvens som står

Regelen: **tegn ikoner som inline SVG, aldri emoji.** Emoji ser ulikt ut på
hver plattform, og flere av dem er ansikter eller hender med hudtone. Et
ansikt på en kategori er en tolkning ingen har bedt om.

`bestill-skjerm.js` og `godkjenn-skjerm.js` følger den. De har hvert sitt
`SVG`-oppslag, 24×24, `stroke-width: 1.6`, avrundede ender.

`besok-lager.js` gjør det ikke. Katalogen bærer emoji:

```js
{ id: 'samvaer', navn: 'Besøk og samvær', ikon: '☕', … }
{ id: 'digital', navn: 'Digital hjelp',   ikon: '📱', … }
```

De vises i fire skjermer: `besok-nytt.js`, `besok-oversikt.js`,
`besok-utfor.js`, `besok-behov.js`. Regelen står altså skrevet to steder i
kommentarer, og brytes fire steder i produksjon. Det er ikke en smakssak: en
tjeneste for eldre bør ikke ha ikoner som ser forskjellige ut avhengig av
hvilken telefon brukeren har.

Skal dette rettes, er det ett sted: gi `OPPGAVER` en `svg`-nøkkel ved siden av
`ikon`, og bytt de fire tegnestedene.

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

### Målte verdier, og hvor de kommer fra

| Hva | Verdi | Hvor | Hvorfor |
|---|---|---|---|
| Brødtekst, eldres skjerm | 20 px | `godkjenn.css` | 17 er satt for pårørende på 40–70 |
| Ja/nei-knapper | 96 px høye | `godkjenn.css` | 44 treffes ikke av en hånd som skjelver |
| Valgflater, bestilling | 76–78 px | `bestill.css` | Samme grunn, lavere innsats |
| Kontrast, all tekst | ≥ 4,5:1 | `styles.css` | Tallene per farge står i merkeskillet |

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
4. **Ikoner som SVG**, 24×24, ikke emoji og ikke PNG.
5. **Tekst i markup, tall i modul.** Priser, kategorier og grenser leses fra
   `PP_*` – de skrives ikke inn i skjermen.
6. **Kjør `npm test`.** Klarspråktesten måler ni sider, og en ny flate som
   ligger over grensa for sin teksttype, feiler.

Det som ikke kan føres hit: komponenthierarkier, Tailwind-klasser, generert
React, og skrifter som ikke ligger på Google Fonts eller som en `@font-face`
med innebygd fil.
