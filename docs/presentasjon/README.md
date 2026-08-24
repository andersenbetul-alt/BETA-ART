# Konseptpresentasjonen

`naviar-konsept.pptx` – ti lysbilder om hvordan konseptet ble til og hva det
er til for. Fortellingen er hentet fra `docs/JURIDISK-GRENSE.md`: modellbyttet
fra markedsplass til programvare kom av arbeidsrettslig klassifisering, ikke
av smak. Det er ryggraden i presentasjonen.

## Merkevaren gjelder også her

Presentasjonen følger `.claude/skills/naviar-merkevare/SKILL.md`, ikke
`brand-guidelines` – den siste inneholder Anthropics farger.

**Bare tokens fra `assets/css/styles.css`.** Ingen heksverdi i generatoren står
utenfor tokenlista. Rollen bestemmer flata, ikke omvendt:

| Rolle i presentasjonen | Token | Kontrast |
|---|---|---|
| Brødtekst på lyst | `--ink-soft` `#4a5568` | 7,5:1 mot hvitt |
| Dempet på lyst | `--ink-faint` `#657084` | 5,0:1 mot hvitt |
| Dempet på blekket | `--bg-sand` `#fbf6ee` | 16,1:1 mot blekket |
| Handling på lyst | `--brand` `#1f6f5c` | 6,0:1 mot hvitt |
| Handling på blekket | `--brand-pa-mork` `#4cb99b` | 7,2:1 mot blekket |
| Oransje under 18 pt | `--warn` `#9a6a08` | 4,7:1 mot hvitt |

`--accent` `#c8752a` ble prøvd på korttitlene på lysbilde 6, der merkevaren
tillater den (18 pt og oppover). Den ble byttet ut igjen: 3,5:1 mot hvitt er
**svakere enn brødteksten under** på 7,5:1, og en overskrift som er lysere enn
avsnittet sitt snur hierarkiet. `--warn` er samme fargefamilie og gir 4,7:1.

**Én skriftfamilie**, som på nettstedet. Inter finnes ikke i PowerPoint og kan
ikke arves der, så presentasjonen bruker siste ledd i merkevarens egen
fallback-kjede: Arial. Hierarkiet bæres av størrelse og vekt.

**Merket er logofila, ikke satt tekst.** Ordmerket er gjort om til flater
nettopp fordi andres presentasjonsverktøy ikke arver noe: CARE er sporet
140/1000 em mot 55 i NAVIAR, og ordmellomrommet er 430. Ingen
`charSpacing`-verdi gjengir det. Låsen står i 1,25 tommer – 120 px, over
minstemålet på 96 – med blekkutgaven på lyse lysbilder og negativutgaven på de
mørke.

### Det som mangler i tokensettet

Det finnes ingen dempet farge for tekst **på blekket**. `--ink-faint` gir 3,5:1
der og duger ikke. Presentasjonen bruker sanden og skiller i stedet på
størrelse. Skal det bli en egen rolle, hører den hjemme i
`assets/css/styles.css` og i merkevarefila – ikke i en generator for ett
lysbilde.

## Å bygge den på nytt

`lag-presentasjon.js` er kilden. Den trenger `pptxgenjs`, som **ikke er en
avhengighet i prosjektet** – nettstedet har fortsatt ingen `node_modules`.
Biblioteket hentes utenfor prosjektmappa:

    mkdir -p /tmp/deck && cp docs/presentasjon/* /tmp/deck/
    cd /tmp/deck && npm install pptxgenjs && node lag-presentasjon.js

De to PNG-ene ligger ved siden av fordi PowerPoint ikke leser SVG.
`lag-logo-png.js` bygger dem på nytt fra `assets/img/*.svg` med Playwright.
Endres logofilene, kjør den – ikke rediger PNG-ene.

## To ting å vite om pptxgenjs

Biblioteket setter `anchor="ctr"` på hver tekstboks som ikke sier noe annet.
To bokser med ulik høyde i samme rad får da tekst på hver sin høyde. Derfor
går alle lysbildene gjennom `ark()`, som toppstiller det som ikke uttrykkelig
ber om midtstilling.

Åttesifret heks (`FFFFFF00`) er ikke gjennomsiktig hvitt – det er ugyldig, og
blir tegnet svart. Gjennomsiktig fyll er `fill:{ type:'none' }`.

## Tallene

Tallene på siste lysbilde er kjørt, ikke anslått: 324 enhetstester og 153
nettlesertester, null feilende. Endrer du testene, kjør `npm test` og oppdater
lysbildet.
