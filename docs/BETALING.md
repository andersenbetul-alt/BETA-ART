# Betaling

Naviar tar ikke imot kortopplysninger, og kommer ikke til å gjøre det. Det er
ikke en ambisjon, det er hele grunnen til å bruke en betalingsleverandør.

Denne siden sier tre ting: hva som må avklares før Klarhet kan selges, hva
serveren må gjøre, og hva som aldri skal ligge i nettleseren.

## Klarhet åpner to porter som står stengt

`assets/js/besok-abonnement.js` har holdt to betalingsstrømmer stengt siden
B2B-modellen ble valgt:

| Strøm | Tilstand | Grunn |
|---|---|---|
| `familie` | Sperret i v1 | Gjør oss til forbrukerleverandør: angrerett, opplysningsplikt før avtale, regler om fornyelse |
| `mellom` | Sperret | Penger fra kunde videre til tredjepart kan være betalingsformidling. Se J11 |

Naviar Klarhet er begge deler samtidig. Familien betaler 599 kroner,
eksperten får 449. Det er ikke en integrasjon som mangler. Det er de to
portene, og de åpnes av en jurist.

`PP_BETALING.STROM.klarhet` står derfor som `avklares`, og `bestill()` nekter
mens den gjør det. Fire ting må være på plass:

- **J11** om det er betalingsformidling å ta imot 599 og betale ut 449
- **J5** om angrerett og opplysningsplikt ved fjernsalg til forbruker
- **J16** om merverdiavgift på konsultasjonen, som flytter 25 % av prisen
- **Arbeidsrettslig klassifisering.** En ansatt lønnes, en oppdragstaker
  faktureres. Det avgjør hvilket produkt vi kan bruke

## Angreretten manglet

Klarhet selges på avstand til en forbruker, så hun har angrerett. Men samtalen
skal skje på mandag, altså midt inne i angrefristen.

Loven løser det med en betingelse, ikke et unntak: hun må uttrykkelig be om at
tjenesten starter før fristen er ute, og hun må få vite hva hun mister ved det.
Uten den bekreftelsen har vi levert en samtale vi ikke kan kreve betalt for.

Én avkrysning, aldri forhåndskrysset. Et samtykke som allerede står der, er
ikke et samtykke – det gjelder her som på den eldres skjerm.

Angrer hun før samtalen, frigis reservasjonen og hun får alt tilbake. Etter en
gjennomført samtale er det ingen angrerett igjen på den, men
riktig-ekspert-garantien gjelder fortsatt.

Hjemmelen skal bekreftes av jurist. Se J5.

## Tilstandene

Reservert før, trukket etter. Aldri omvendt.

| Tilstand | Hvor pengene er | Når |
|---|---|---|
| Reservert | Holdt på kundens kort | Når timen er bekreftet |
| Trukket | Hos betalingsleverandøren | Når samtalen er holdt og de tre stegene er sendt |
| Utbetalt | Hos eksperten | Etter avtalt utbetalingsdag |
| Frigitt | Hos kunden | Avlyst, eller ikke gjennomført innen 48 timer |
| Refundert | Hos kunden | Garantien, eller en klage som førte fram |

Løftet går til to parter samtidig: hjelperen skal aldri lure på om pengene
kommer, og kunden skal aldri betale for noe som ikke ble gjort.

## Hvilket produkt, og hvorfor det ikke er valgt

Stripe Connect finnes for å betale ut til selvstendige og virksomheter. Er
eksperten ansatt, skal hun ha lønn gjennom et lønnssystem, ikke en utbetaling
gjennom Connect.

Å velge produkt nå er å svare på arbeidsrettsspørsmålet med et bibliotek.
`PP_BETALING.LEVERANDORVALG.avklart` står som `false` til noen svarer.

## Hva serveren må gjøre

Nettleseren kan ikke opprette en betaling. En hemmelig nøkkel i `assets/js/`
er en nøkkel hos hver eneste besøkende.

Serveren trenger fire endepunkter. `assets/js/api.js` har allerede formen:
`DEMO = true` byttes til `false` når de finnes.

| Endepunkt | Gjør |
|---|---|
| `POST /api/v1/betaling/reserver` | Oppretter betalingen hos leverandøren og returnerer bare klient-hemmeligheten for den ene betalingen |
| `POST /api/v1/betaling/trekk` | Trekker et reservert beløp etter gjennomført samtale |
| `POST /api/v1/betaling/frigi` | Frigir en reservasjon |
| `POST /api/v1/betaling/varsel` | Tar imot varsler fra leverandøren, med signaturkontroll |

Varselendepunktet er det som faktisk holder tilstanden riktig. En betaling kan
endre seg uten at nettleseren er åpen.

## Hva vi lagrer

Betalings-id hos leverandøren, beløp, valuta, tilstand og tidspunkt for hver
overgang.

Aldri: kortnummer, utløpsdato, CVC, kontonummer, BankID, fødselsnummer.

## Nøkler

Nøkler settes av den som eier kontoen, i miljøet på serveren. De skrives ikke
inn i dette repoet, ikke i en kommandolinje, og ikke i en fil som følger med
en commit.
