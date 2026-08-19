# Testing

```bash
npm test             # enhetstester + nettlesertester (71 tester)
npm run test:enhet   # bare enhetstester, ingen nettleser
npm run sjekk        # syntakssjekk av alle skriptfiler
```

## Oppbygning

| Fil | Dekker |
|---|---|
| `tests/enhet.test.js` | Prismodell, matchingmotor, adressevern i datamodellen |
| `tests/e2e.test.js` | Alle sider i Chromium: flyter, validering, personvernregler, mobil |
| `tests/kjor.js` | Starter lokal server, kjører begge, returnerer exit-kode |
| `tests/hjelpere.js` | Testharness uten avhengigheter |

Testene har ingen eksterne avhengigheter utover Playwright, som hentes lokalt om
det er installert og ellers globalt. Mangler Playwright, hopper nettlesertestene
over seg selv i stedet for å feile. Er porten opptatt, prøver kjøreren de ti neste.

## Hva testene faktisk beskytter

Enkelte tester finnes fordi regelen de dekker er et løfte til brukerne, ikke bare
en teknisk detalj:

| Test | Løftet den beskytter |
|---|---|
| «adressen finnes ikke før oppdraget er tatt» | Den eldres hjemmeadresse vises ikke til hjelpere som ikke har oppdraget |
| «adressen skjules igjen etter fullført oppdrag» | Adressen blir ikke liggende igjen etterpå |
| «oppdragslisten inneholder ingen gateadresse» | Adressen er utenfor datasettet, ikke bare skjult i visningen |
| «utilgjengelig: ingen posisjonsforespørsel» | Posisjon brukes kun når hjelperen selv har slått på tilgjengelighet |
| «bryteren av stopper visning av oppdrag» | Å slå seg utilgjengelig virker umiddelbart |
| «akutt beskrivelse viser nødnumre» | Plattformen formidler ikke oppdrag der nødetatene er riktig svar |
| «oppdrag som holdes utenfor, har en begrunnelse» | Matchingen er ikke en lukket svart boks |
| «innsending krever samtykker» | Ingen konto opprettes uten aktivt samtykke |
| «under 18 år avvises» | Aldersgrensen håndheves |
| «feil oppmøtekode avvises» | Innsjekk krever kode fra familien |
| «søknad med manglende steg kan ikke godkjennes» | Verifiseringskjeden kan ikke hoppes over |
| «oversittet svarfrist markeres» | En brutt frist skjules ikke for driftsorganisasjonen |

## Funn fra testkjøringene

Testene har allerede avdekket fire reelle feil i koden:

1. `hidden`-attributtet slo ikke gjennom mot `.btn` og `.site-nav`, så knapper ble
   vist i feil steg av skjemaene.
2. Knapper i menyen mistet hvit tekstfarge på grunn av CSS-spesifisitet, med for
   dårlig kontrast som resultat.
3. Grid- og flexbarn har `min-width: auto` som standard. En bred tabell sprengte
   derfor hele sidebredden på mobil.
4. Lange norske sammensatte ord (Personvernerklæring) flyter utenfor skjermen uten
   `overflow-wrap`. Relevant for hele nettstedet, ikke bare den ene overskriften.

## Før hver utsjekking

- [ ] `npm test` er grønn
- [ ] Nye personvernregler har fått en test som beskytter dem
- [ ] Nye sider er lagt til i `SIDER`-listen i `tests/e2e.test.js`
