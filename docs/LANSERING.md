# Før dere går live

Alt teknisk som kan gjøres uten en avgjørelse, er gjort. Dette er det som står
igjen, i rekkefølge. Punkt 1 og 2 er avgjørelser; resten er mekanikk.

## 0. Tilgangen som stopper alt

Vercel kommer ikke til repoet:

```
repo_no_access: You need admin or write access to the repository "BETA-ART"
```

https://github.com/apps/vercel/installations/select_target → `andersenbetul-alt`
→ `BETA-ART`. Uten dette finnes ingen automatisk utrulling, og hver endring må
lastes opp for hånd.

## 1. Inngangsdøra — rettet

`vercel.json` sendte `/` videre til `/besok/index.html`, som har `noindex`.
Den ene adressen som meldes inn til søk, var altså den ene som ba om ikke å
bli indeksert.

Dette var ikke en avgjørelse som manglet. Tre filer sa allerede hva `/` skal
være, og `vercel.json` var den som stakk seg ut:

- `robots.txt` sin lanseringsblokk: `Allow: /$` og `Disallow: /besok/`
- `sitemap.xml` melder inn `naviarcare.com/`, og sier at skjermene under
  `/besok/` aldri skal indekseres
- `index.html` er den eneste publikumssida uten `noindex`

De to omskrivingene som kapret roten er fjernet. `/` serverer nå
`index.html` – «Naviar – hjelp i nabolaget for eldre som vil bo hjemme».
Snarveiene inn i besøksverktøyet står igjen; de rører ikke forsida.

Står det igjen ett spørsmål her, er det om forsida skal være `index.html`
eller `klarhet.html`. Det er et produktvalg, og det haster ikke: begge er
indekserbare, og sitemap peker på roten uansett.

## 2. Åpne for søk

`robots.txt` stenger alt i dag, med vilje. Blokken som skal erstatte den står
allerede i fila som kommentar. Bytt den når – og bare når – punkt 1 er avgjort.

Elleve sider har `noindex` i markupen. De under `/besok/` skal beholde den:
det er innlogget arbeidsflate. Men `bestill.html`, `godkjenn.html`,
`klarhet.html` og `drift.html` har den også, og minst `klarhet.html` skal
antakelig ut av den lista hvis den blir forsiden.

## 3. Domenet i GoDaddy

Etter at Vercel-prosjektet finnes og `naviarcare.com` er lagt til der, skriver
Vercel ut to poster. Legg dem inn under *My Products → naviarcare.com → DNS*.
Ikke gjett verdiene på forhånd – Vercel gir prosjektspesifikke mål.

## 4. Det som er klart

- 319 enhetstester, 153 nettlesertester
- Ingen side flyter vannrett ved 200 % skrift
- Alle 40 feilmeldinger har `role="alert"`; 27 felt peker på meldinga si
- `sql/001-besok.sql` er kjørt mot Postgres 16: krymping i fire trinn,
  personvernsperra som trigger, og null uenighet mot JavaScript på 79 tekster
- `.claude/skills/run-naviar/` driver appen og tar skjermbilder

## 5. Det som ikke er klart

- Tre avgjørelser om innlogging står i `docs/AUTH.md`
- Betaling er sperret i `betaling.js` med fire punkter som må avklares først
- Varemerket «NAVIAR» er aldri søkt opp i noe register. Fraværet av søk er
  ikke det samme som at navnet er ledig
