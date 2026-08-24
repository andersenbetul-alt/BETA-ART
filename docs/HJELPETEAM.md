# Mitt hjelpeteam – tjenestens organiserende prinsipp

Datapunktet bak: en reell BPA-utlysning viser at ett menneske har mange
små, ulike behov – og at én stabil relasjon dekker flere av dem. Behovet er
ikke «vask huset mitt», det er *«hjelp meg å fortsette å leve livet mitt
der jeg mangler noe»*. Derfor bygges tjenesten rundt **teamet rundt
personen**, ikke rundt en katalog av enkeltoppgaver.

> NAVIAR CARE – hjelp til å leve livet hjemme.

## Teamet, ikke katalogen

Kari, 82: Anna har tirsdager (handling + mat), Erik har torsdager (tur +
praktiske oppgaver), Sara tar digital hjelp ved behov. Familien ser at det
ble gjort. Bestillingen «kjøp en oppgave» er unntaket; normalen er faste
relasjoner med faste dager.

**Motoren støtter dette allerede** – det er ikke en ny funksjon, det er
prioriteringen som ligger der: `fastHjelperId` får første tilbudsbølge,
familiens `krets` andre, øvrige tredje (`assets/js/matching.js`,
`tilbudsbolger()`), og relasjonsvekten (25 av 100) gjør at den som har
vært der 17 ganger slår en ukjent nabo. Det som mangler er **skjermen**:
familiesiden som viser teamet og lar dem sette faste dager.

## Kategoriene (mot dagens oppgavetyper)

| # | Kategori | Dagens type | Grensemerknad |
|---|---|---|---|
| 1 | Hjemmehjelp | `hjemme` | – |
| 2 | Handling & mat | `handling` | – |
| 3 | Følge & aktivitet | `folge`, `aktivitet` | – |
| 4 | Transport & ledsaging | (ny undertype av `folge`) | Kjøring krever avklart forsikring/løyve – 🟠 |
| 5 | Digital hjelp | `digital` | **Veiledning**, aldri håndtering: ingen passord, PIN, BankID eller penger i hendene. Formuleringen «BankID-veiledning» betyr å peke, aldri å taste |
| 6 | Hverdagsassistent | (ny: avtaler, brev, skjema) | Enkle skjema ja; alt med rettsvirkning eller fullmakt – 🟠 |
| 7 | Sosialt selskap | `samvaer` | – |
| 8 | Små praktiske oppgaver | `praktisk` | Lavrisiko; el/rør er 🔵 lisensiert |
| – | **Personlig hygiene / stell** | **finnes ikke** | 🔴 Dette er stell – rød kategori i JURIDISK-GRENSE. Bygges ikke, heller ikke «med egen avklaring». BPA-annonsens hygienepunkt er nettopp der BPA (helselovgivning) og Naviar skiller lag |

Kategoriene er faste utfall i katalogen; etterspørsel oppretter aldri
kategori (PP_BEHOV-regelen står).

## Pilotutvalget – fire tjenester først

Hele tabellen over er målbildet. Piloten starter smalere: fire tjenester med
lav risiko, definert i kode i `assets/js/katalog.js` (`PP_KATALOG`), hver med
faste utfall og sin egen aldri-liste:

| Pilotkategori | Type | Aldri |
|---|---|---|
| Besøk og samvær | `samvaer` | Terapi, helsevurdering, nattilsyn |
| Digital hjelp | `digital` | BankID/passord, betaling, fjernstyring |
| Lett hjemmehjelp | `praktisk` | Trapp/tunge løft, sterke kjemikalier, hovedrengjøring |
| Hent og lever | `handling` | Kontanter, medisiner, alkohol/tobakk, økonomiske dokumenter |

Hjelpernes fagområder er de samme kategoriene: `PP_KATALOG.kategorierFor()`
leser hvilke typer hjelperen har krysset av (`hjelper.oppgaver`), som er
samme felt matchingmotorens `kvalifisert`-krav filtrerer på. Ett felt, én
sannhet – katalogen innfører ikke et parallelt kompetanseregister.

Utsatt til kontrollert utvidelse (fall-, transport- og matrisiko): følge til
avtaler, korte turer, enkel matlaging, kultureskorte. Dørstokken for disse er
en pilot med egne grenser, ikke et menyvalg.

## Neste konkrete byggekloss

Familiesiden «Mitt hjelpeteam»: vis teamet, faste dager, siste utførte
besøk – lesing fra PP_BESOK + `fastHjelperId`/`krets`. Ingen ny motor.
