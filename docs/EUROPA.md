# Europeisk arkitektur – felles kjerne, lokale lag

Målet er én plattform for Europa, ikke ett regelverk for Europa. Omsorgssystemer,
arbeidsrett, identitetsløsninger og betalingsvaner er svært forskjellige – ikke bare
mellom land, men mellom regioner i samme land.

```
                    KJERNEPLATTFORM
   matching · oppdrag · meldinger · betaling · tillit
   familiepanel · driftsverktøy · personvernsenter
                          │
      ┌───────────────┬───┴────────────┬────────────────┐
   Norge-lag       Sverige-lag      Tyskland-lag     Spania-lag
   NOK             SEK              EUR              EUR
   bokmål/nynorsk  svensk           tysk             spansk
   norsk eID       svensk eID       lokal eID        lokal eID
   norske regler   svenske regler   tyske regler     spanske regler
```

## Hva som ligger i landlaget

| Område | Hvorfor lokalt |
|---|---|
| Valuta og prisnivå | Timesatser og serviceavgift må speile lokalt marked |
| Språk og tiltaleform | Også innad i land (bokmål/nynorsk, katalansk/spansk) |
| Identitetsverifisering | Ulike nasjonale eID-løsninger |
| Bakgrunnskontroll | Hjemmel for å kreve politiattest varierer, og finnes ikke overalt |
| Arbeidsrettslig status | Oppdragstaker vs. arbeidstaker avgjøres nasjonalt |
| Skatt og rapportering | Ulike plikter for plattform og hjelper |
| Nødnumre | 112 er felles i EU, men nasjonale numre varierer |
| Helsegrense | Hva som regnes som helsehjelp, defineres nasjonalt |

## Regulatoriske forhold som må planlegges inn

- **Plattformarbeid.** Et arbeid som dette har trekk av digitalt plattformarbeid.
  Det betyr krav til åpenhet i algoritmisk styring, menneskelig gjennomgang av
  inngripende automatiske avgjørelser, og vern av personopplysningene til dem som
  utfører arbeidet. Matchingen kan derfor ikke være en lukket svart boks, og en konto
  skal ikke stenges av en algoritme alene.
- **Universell utforming.** Digitale tjenester rettet mot forbrukere har krav til
  tilgjengelighet. For denne brukergruppen er det uansett et produktkrav, ikke bare et
  lovkrav: stor skrift, høy kontrast, store trykkflater, taleinput, telefonkanal og
  mulighet for at pårørende handler på vegne av.
- **Personvern.** Posisjonsdata, sårbar brukergruppe og automatisert matching gjør en
  DPIA nødvendig før posisjonsfunksjonene settes i drift. Se `docs/DPIA.md`.
- **Grensen mot helsetjenester.** Plattformen formidler praktisk hjelp. Oppdrag som
  krever autorisasjon holdes utenfor marketplace-laget og vises ikke engang for
  vanlige hjelpere.

Dette er ikke juridiske konklusjoner, men rammer for produktarbeidet. Hvert land må
avklares med lokal juridisk rådgiver før lansering.

## Utrullingsrekkefølge

1. **Norge** – pilot i Oslo-området. Tett befolkning, høy digital modenhet, sterk betalingsvilje.
2. **Norden** – Sverige og Danmark. Like omsorgsmodeller og identitetsløsninger.
3. **Nordvest-Europa** – Tyskland og Nederland. Stort marked, mer fragmentert omsorgssystem.
4. **Sør-Europa** – Spania og Portugal. Stor gruppe eldre med familie i utlandet;
   pårørendepanelet er her selve produktet.

Tetthet slår geografisk bredde: én by med nok hjelpere gir kortere ventetid enn ti
byer med for få. Vekstregelen er derfor by for by, ikke land for land.
