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

`naviar-mark.svg` i denne mappen – varden fra A-en i ordmerket, tegnet som fylte
flater og ikke streker. Grunnen: ordmerket bruker hårstreker som forsvinner
under ca. 40 px, og 16 px er favicon. Det er den størrelsen merket oftest sees i,
sammen med avsenderikonet i e-posten til pårørende.

| Flate | Hva som brukes |
|---|---|
| Favicon, appikon | Merket, hvitt på marineblå flate med runde hjørner |
| Topp på siden | Samme flate, 34 px |
| E-post til familien | Samme flate |
| Over ca. 40 px | Fullt ordmerke |

Favicon har **egen flate**, ikke gjennomsiktig bakgrunn: marineblått på en mørk
fanelinje er usynlig. En flate virker uansett hva nettleseren har bak seg.

Merket bruker `currentColor`, så det arver farge og virker på begge grunner.

## Det som mangler

Vektorfilen til **ordmerket** finnes ikke i repoet – merket er levert som
raster. Legges den inn som `assets/img/naviar-care-logo.svg`, er den eneste
endringen som trengs å bytte `.logo-mark`-flaten mot en `<img>` i toppen.

Ordmerket skal **ikke** tegnes på nytt for hånd. En logotype som er 95 % riktig
er verre enn en raster: den sprer seg overalt, og feilen følger med.

## Payoff

«Clarity in complex systems» er **Naviars** payoff, ikke Naviar Cares. Kjøperen
driver et selskap med tolv ansatte og setter opp vaktlista selv. Hun har ikke
komplekse systemer; hun har familier som ringer og spør om mor fikk besøk.

Produktets egen setning er:

> Ett besøk. Én bekreftelse. Alle vet det.

## Før du innfører en ny farge

Regn kontrasten mot flaten den skal stå på, og ta med tallet. En farge uten et
tall er en gjetning.

Fullstendig begrunnelse: `docs/team/MERKEVARE.md`.
