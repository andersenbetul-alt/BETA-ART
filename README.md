# PårørendePilot / Nærhjelp

Europeisk plattform for praktisk hverdagshjelp til eldre som vil bo hjemme.
En familie ber om hjelp – systemet finner den nærmeste, ledige, kvalifiserte og
verifiserte hjelperen, oppdraget gjennomføres, familien varsles, hjelperen får betalt
og plattformen tar en andel.

> **Regelen for matching:** ikke den nærmeste personen, men den nærmeste
> *kvalifiserte og betrodde* personen.

## Status

Fase 1 er implementert: nettsted og registreringsflyt for hjelpere.
Løsningen er statisk (HTML/CSS/JS uten byggesteg) og har ingen backend ennå.
All kommunikasjon mot server går gjennom `assets/js/api.js`, som står i demomodus –
personopplysninger sendes ingen steder.

## Kjør lokalt

```bash
python3 -m http.server 8000
# åpne http://localhost:8000
```

## Innhold

| Fil | Beskrivelse |
|---|---|
| `index.html` | Forside – «Finn oppdrag nær deg» |
| `bli-hjelper.html` | Registrering av hjelper i seks steg |
| `trygghet.html` | Verifisering, tillitsnivåer, pengeregler, tillitsscore |
| `personvern.html` | Personvernerklæring |
| `assets/js/registrering.js` | Skjemalogikk: validering, SMS-kode, posisjonssamtykke, kladd |
| `assets/js/api.js` | API-adapter – byttes til ekte endepunkter i fase 2 |
| `assets/js/app.js` | Meny, samtykke til informasjonskapsler |
| `docs/GDPR.md` | Behandlingsprotokoll og personvernarkitektur |
| `docs/DPIA.md` | Utkast til vurdering av personvernkonsekvenser |
| `docs/ROADMAP.md` | Teknisk veikart fase 1–6 |

## Registreringsflyten

1. **Om deg** – navn, fødselsdato, e-post, mobil med engangskode på SMS
2. **Sted og reise** – sted, postnummer, maks avstand (2/5/10/20 km), transport, frivillig posisjon
3. **Tilgjengelighet** – dager, tidsrom, ønsket omfang
4. **Oppdrag og kompetanse** – oppdragstyper, språk, erfaring, sertifikater, HPR-nummer
5. **Verifisering og utbetaling** – ID-kontroll, to referanser, utbetalingsform
6. **Samtykke og oppsummering** – atskilte samtykker, oppsummering, innsending

## Personvern i koden

- Posisjon er alltid et eget, frivillig valg – telefonnummer er ikke posisjonssamtykke
- Registrering kan fullføres helt uten posisjon
- Posisjon avrundes til ca. 100 meter allerede i nettleseren
- «Slett posisjonen» er like tilgjengelig som «Del posisjonen min»
- Hvert samtykke lagres med tidspunkt og versjon, uten forhåndsavkryssing
- Kladd lagres i `sessionStorage`, aldri fødselsdato eller engangskode
- Informasjonskapsler er delt i nødvendige / analyse / markedsføring, med atskilte formål

Detaljene ligger i [`docs/GDPR.md`](docs/GDPR.md).

## Forbehold

Prosjektet er under utvikling. Innholdet er ikke juridisk rådgivning. Posisjonsdata,
arbeidsrettslig status for hjelpere, eventuelle helseopplysninger, krav om politiattest
og betalingsstrømmer må kvalitetssikres med juridisk rådgiver før drift.
