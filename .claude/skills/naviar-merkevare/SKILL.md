---
name: naviar-merkevare
description: Naviar Care sitt merke - farger, typografi, merket og reglene for hvor de gjelder. Bruk denne når du lager eller endrer noe Naviar Care viser fram: sider, skjermer, e-post til pårørende, presentasjoner, artefakter, PDF-er eller bilder. Bruk den også når noen spør hvilken farge, hvilket blekk eller hvilket merke som er riktig. Ikke bruk brand-guidelines til Naviar-arbeid - den inneholder Anthropics farger, ikke våre.
---

# Naviar Care – merket

Fargene er ikke smaksvalg. Hver av dem har en rolle og et målt kontrasttall, og
tallet er grunnen til at den finnes. Bruk rollen, ikke heksverdien: da holder
systemet også på flater vi ikke har tenkt på ennå.

Kilden er `assets/css/styles.css`. Endres den, endres denne filen i samme commit.

## Blekket er logoen

`--ink` `#101a2e` er marineblåen fra ordmerket. Den er ikke *valgt for å matche*
logoen – den **er** logoen, og det er forskjellen på en identitet og en
dekorasjon. Et merke som ligger oppå siden i en annen farge enn siden, leses som
et klistremerke.

## Farger, med rolle og kontrast

| Token | Verdi | Rolle | Mot hvitt | Mot sand |
|---|---|---|---|---|
| `--ink` | `#101a2e` | All tekst, mørke flater, merkeflaten | 17,4:1 | 16,1:1 |
| `--ink-soft` | `#4a5568` | Ingress, sekundærtekst | 7,5:1 | 7,0:1 |
| `--ink-faint` | `#657084` | Hjelpetekst, metadata | 5,0:1 | 4,6:1 |
| `--brand` | `#1f6f5c` | Handling på **lys** flate | 6,0:1 | 5,6:1 |
| `--brand-pa-mork` | `#4cb99b` | Handling på **mørk** flate | – | 7,2:1 mot blekket |
| `--brand-light` | `#e6f1ed` | Rolig grønn flate, merkelapper | – | – |
| `--accent` | `#c8752a` | Kun stor tekst og ikke-tekst | 3,5:1 | – |
| `--warn` | `#9a6a08` | Advarsel | 4,7:1 | – |
| `--danger` | `#a32f24` | Feil, avvik | 7,0:1 | – |
| `--bg-sand` | `#fbf6ee` | Varm flate | – | – |

## Tre regler som ikke er til forhandling

**1. To grønner, ikke én.** `--brand` gir 2,9:1 mot blekket. En grønn knapp i en
marineblå topp er uleselig. Derfor finnes `--brand-pa-mork`: 7,2:1 mot blekket,
og blekket gir 7,2:1 tilbake som knappetekst. Velg etter flaten under, ikke
etter hvilken grønn du husker.

**2. `--accent` er ikke for brødtekst.** 3,5:1 mot hvitt holder til stor tekst
(18 pt+) og til flater, ikke til en setning. Trenger du oransje i en setning,
bruk `--warn`.

**3. Ingen tilstand signaliseres med farge alene.** Utført er ikke «det grønne
feltet» – det er et felt med ✓ og ordet «Utført». En som ikke skiller farger,
skal få den samme beskjeden som alle andre.

## Sanden blir stående

Marineblå alene blir kald. Siden leses også av eldre mennesker og familiene
deres, og den varme flaten er motvekten. Ikke bytt den mot en nøytral grå fordi
det ser mer «profesjonelt» ut.

## Typografi

Én familie: **Inter**, med `"Segoe UI", system-ui, -apple-system, "Helvetica
Neue", Arial, sans-serif` som fallback. Ikke innfør en andre familie uten å si
hva den løser.

## Merket

`naviar-mark.svg` i denne mappen – varden fra A-en i ordmerket, tegnet som
fylte flater og ikke streker. Grunnen: ordmerket bruker hårstreker som
forsvinner under ca. 40 px, og 16 px er favicon. Det er den størrelsen merket
oftest sees i, sammen med avsenderikonet i e-posten til pårørende.

Bandet nederst er et **hull i flata** (`fill-rule="evenodd"`), ikke en flate
som ligger gjennomsiktig oppå. Gjennomsiktighet finnes ikke i ett trykkfarge,
og ved 16 px ble 45 % opasitet en grå klump i stedet for en strek. Et hull
virker begge steder, og det virker også når merket snus til sand på blekket.

| Flate | Hva som brukes |
|---|---|
| Favicon, appikon | Merket, sand på blekk med runde hjørner |
| Topp på siden | Liggende lås, 34 px høy |
| E-post til familien | Merket alene |
| Over ca. 40 px | Liggende eller stående lås |

Merket bruker `currentColor`, så det arver farge og virker på begge grunner.

## Logofilene

Ordmerket er satt i Inter og gjort om til flater. En logo som er avhengig av at
en skrift er installert der den vises, er ikke en logo – den er en forhåpning.
Inter er lisensiert under SIL Open Font License, som tillater dette.

NAVIAR står i 700 med 55/1000 em sporing. CARE står i 400 med 140, fordi mager
tekst i versaler trenger mer luft for å ikke klumpe seg. Ordmellomrommet er
430 – tydelig større enn sporingen inne i CARE, ellers leses de to ordene som
ett. Merket står **på grunnlinja** og rager bare oppover, slik en varde ville
gjort. En varde som svever over skriftlinja ser ut som en feil, uansett hvor
pent den er tegnet.

| Fil | Når |
|---|---|
| `naviar-care-logo.svg` | Liggende lås. Førstevalget. `currentColor` |
| `naviar-care-logo-blekk.svg` | Samme, låst til blekket. Der ingen farge kan arves |
| `naviar-care-logo-negativ.svg` | Samme, låst til sanden. Mørke flater |
| `naviar-care-ordmerke.svg` | Uten merket. Der merket allerede står i nærheten |
| `naviar-care-logo-staaende.svg` | Merket over to linjer. Smale flater, avatarer |

I den stående låsen er CARE sporet ut til nøyaktig samme bredde som NAVIAR.
To ord som ender på samme loddrette linje leses som én form, ikke som to.

**Bruk `currentColor`-utgaven i alt som er HTML.** De to med fast farge finnes
for trykk, e-postmaler og andres presentasjonsverktøy, som ikke arver noe.

Skal sporingen eller mellomrommene endres, gjøres det i `verktoy/lag-logo.py`
og filene bygges på nytt. Ikke rediger banedata for hånd.

## Frisonen

Rundt logoen skal det ligge minst én versalhøyde tom flate på alle fire kanter.
Det er avstanden i logoen selv mellom merket og N-en, ganget med halvannet, og
den er lett å måle uten linjal: like mye luft som høyden på en N.

## Minste størrelse

| Lås | Minste bredde |
|---|---|
| Liggende | 96 px på skjerm, 26 mm i trykk |
| Stående | 78 px på skjerm, 22 mm i trykk |
| Merket alene | 16 px |

Under dette forsvinner hullet i varden, og merket blir en trekant.

## v0.4-identiteten (24.08.2026)

Eieren har valgt NAVIAR-001 v0.4 som merke: avbrutt geometrisk N med
diamanthull i diagonalen, NAVIAR i arkitektoniske versaler med diamantsnitt
i A-ene, CARE som underordnet beskrivelse. Kildene er EUIPO-kandidaten
(JPEG 2400x800) og forelderdokumentasjonen; fargene der er grafitt
#26313B, stålblå #334556 og lys grå #E8E8E6.

`naviar-care-logo-v04.svg` og `-v04-negativ.svg` i assets/img er
**webgjengivelser tegnet etter kandidat-JPEG-en** – vektormasteren
(NAVIAR-CARE-001_master_candidate_v0.1.svg) er ikke levert hit ennå.
Når den kommer, byttes filene byte for byte og denne merknaden fjernes.

Uavklart: forholdet mellom v0.4-grafitten #26313B og sidens blekk
#101a2e. Regelen «blekket ER logoen» krever at én av dem flytter seg.
Varden står inntil videre i favicon, appikon og e-post.

Status for varemerket: EUIPO-FORMAT CANDIDATE PASS / FILING HOLD –
likhetssøk (TMview, Patentstyret, WIPO), klasser og søkereierskap gjenstår.
