# Konseptpresentasjonen

`naviar-konsept.pptx` – ti lysbilder om hvordan konseptet ble til og hva det
er til for. Fortellingen er hentet fra `docs/JURIDISK-GRENSE.md`: modellbyttet
fra markedsplass til programvare kom av arbeidsrettslig klassifisering, ikke
av smak. Det er ryggraden i presentasjonen.

## Å bygge den på nytt

`lag-presentasjon.js` er kilden. Den trenger `pptxgenjs`, som **ikke er en
avhengighet i prosjektet** – nettstedet har fortsatt ingen `node_modules`.
Biblioteket hentes utenfor prosjektmappa når presentasjonen skal bygges:

    mkdir -p /tmp/deck && cp docs/presentasjon/lag-presentasjon.js /tmp/deck/
    cd /tmp/deck && npm install pptxgenjs && node lag-presentasjon.js

Fargene er prosjektets egne tokens fra `assets/css/styles.css`. Begge grønnene
er med, hver på sin bakgrunn – den ene virker på lyst, den andre på blekket.

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
