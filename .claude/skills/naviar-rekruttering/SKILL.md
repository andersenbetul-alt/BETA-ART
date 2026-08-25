---
name: naviar-rekruttering
description: Rekrutteringsarbeid for Naviar-leverandører – analysere stillingsannonser og kandidatprofiler, oppdatere karrieresiden, og lage tilbudspakken (felter, e-post, tilbudssamtale-presentasjon). Bruk denne når noen deler en stillingsannonse eller kandidatprofil, vil oppdatere «Bli medarbeider»-siden, ber om et jobbtilbud, offer package, tilbudsbrev eller e-post til en kandidat, eller spør hva som kan kreves av søkere (helse, politiattest, språk, førerkort).
---

# Naviar-rekruttering

Én regel binder alt: **innholdet bor i dokumentene og koden, ikke i denne
fila.** Ferdigheten ruter og håndhever – den gjentar ikke. (Regelen finnes
fordi en katalog som gjentok et eksisterende register ga to svar på samme
spørsmål – se observasjon 19 i skill-observations/log.md.)

## Kildene, i prioritert rekkefølge

| Spørsmål | Fasit |
|---|---|
| Hva kan kreves av en søker? | `assets/js/hjelper-opptak.js` – IKKE_KRITERIUM, POLITIATTEST, IDENTITET |
| Hva sier ekte annonser, og hva tok vi inn? | `docs/PROFILREFERANSER.md` |
| Karrieresidens tekst og felter | `besok/bli-medarbeider.html` |
| Tilbudets felter, e-post og presentasjon | `docs/TILBUDSPAKKE.md` + `docs/tilbud-presentasjon.html` |
| Grensen mot helsearbeid | `docs/JURIDISK-GRENSE.md` – vinner alltid |

## Arbeidsflyt 1 · En annonse eller profil deles

1. Les annonsen som referanse, aldri som mal. Generaliser innsikten inn i
   `docs/PROFILREFERANSER.md` – **ingen navn, ingen gjenkjennbare detaljer**
   om personer eller familier i annonsen, heller ikke «bare fornavnet».
2. Kjør kravene gjennom filteret fra hjelper-opptak.js. De som aldri
   overlever: kjønn og andre IKKE_KRITERIUM-felt, helsekrav («god fysisk og
   psykisk helse» → beskriv arbeidet, søkeren vurderer selv), politiattest
   uten hjemmelsvurdering, «flytende norsk» (nivåkrav B1 står), førerkort
   som absolutt krav (fordel, aldri krav – kunder kjøres aldri).
3. Det som overlever, foreslås som endring i karrieresiden eller
   tilbudspakken – med kilde.

## Arbeidsflyt 2 · Tilbud til en kandidat

1. Fyll feltene i `docs/TILBUDSPAKKE.md` – aldri finn på en kandidat eller
   et tall; mangler noe, spør lederen.
2. E-posten følger malens tre regler: ingen lønnstall i e-post, ingen
   pressende frist, én konkret og sann setning om kandidaten.
3. Presentasjonen (`docs/tilbud-presentasjon.html`) fylles med samme tall
   som tilbudsbrevet – det finnes aldri to versjoner av tilbudet. Merkets
   tokens og logo endres ikke (naviar-merkevare eier dem).
4. Arbeidsgiveren i alt materiell er leverandøren. Naviar er programvaren.

## Arbeidsflyt 3 · Karrieresiden

Endringer i «Hvem passer dette for?» og skjemaet følger to eksisterende
eiere: personvernreglene håndheves av datamodellen (nye felt må inn i
PP_VERN.LAGRES med grunnlag og frist, og testes), og teksten er
klarspråk (writing-guidelines/PP_KLARSPRAK). Kjør `npm test` før du sier
at noe virker, og ta med tallet.

## Aldri

- Personopplysninger fra delte annonser inn i repoet
- Helseopplysninger, kjønn eller alder som kriterium – i tekst eller kode
- Politiattest lovet eller krevd før skriftlig hjemmelsvurdering
- En «midlertidig» kandidat eller et «omtrentlig» lønnstall for å komme videre
