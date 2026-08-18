# PårørendePilot / Nærhjelp

Europeisk plattform for praktisk hverdagshjelp til eldre som vil bo hjemme.
En familie ber om hjelp – systemet finner den nærmeste, ledige, kvalifiserte og
verifiserte hjelperen, oppdraget gjennomføres, familien varsles, hjelperen får betalt
og plattformen tar en andel.

> **Regelen for matching:** ikke den nærmeste personen, men den nærmeste
> *kvalifiserte og betrodde* personen.

## Status

Fase 1 er implementert: nettsted, bestillingsflyt for eldre og pårørende,
og registreringsflyt for hjelpere. Løsningen er statisk (HTML/CSS/JS uten byggesteg)
og har ingen backend ennå. All kommunikasjon mot server går gjennom `assets/js/api.js`,
som står i demomodus – personopplysninger sendes ingen steder.

Tjenesten har fire brukergrupper: den eldre, den pårørende, hjelperen og driftsorganisasjonen.
Tjenestedesignet for hele systemet ligger i [`docs/SERVICE-BLUEPRINT.md`](docs/SERVICE-BLUEPRINT.md).

## Kjør lokalt

```bash
python3 -m http.server 8000
# åpne http://localhost:8000
```

## Innhold

| Fil | Beskrivelse |
|---|---|
| `index.html` | Forside med tre innganger: eldre, pårørende, hjelper |
| `trenger-hjelp.html` | Senior Mode – be om hjelp med store knapper og taleinput |
| `familie.html` | Pårørendepanel – status, Care Circle, varsler, bestilling på vegne av |
| `bli-hjelper.html` | Registrering av hjelper i seks steg |
| `trygghet.html` | Verifisering, tillitsnivåer, pengeregler, tillitsscore |
| `personvern.html` | Personvernerklæring |
| `assets/js/bestilling.js` | Bestillingsflyt, akuttfilter, taleinput, simulert matching |
| `assets/js/pris.js` | Prismodell – timer, reisetid, hastetillegg, serviceavgift |
| `assets/js/registrering.js` | Skjemalogikk: validering, SMS-kode, posisjonssamtykke, kladd |
| `assets/js/api.js` | API-adapter – byttes til ekte endepunkter i fase 2 |
| `assets/js/app.js` | Meny, samtykke til informasjonskapsler |
| `docs/SERVICE-BLUEPRINT.md` | Tjenestedesign: syv systemer, matching, pris, kvalitet |
| `docs/EUROPA.md` | Felles kjerne med lokale landlag |
| `docs/GDPR.md` | Behandlingsprotokoll og personvernarkitektur |
| `docs/DPIA.md` | Utkast til vurdering av personvernkonsekvenser |
| `docs/ROADMAP.md` | Teknisk veikart fase 1–6 |

## Bestillingsflyten (eldre og pårørende)

1. **Når** – nå / i dag / bestemt tidspunkt / fast avtale
2. **Hva** – åtte store ikonknapper, eller taleinput som tolkes til kategori
3. **Hvor lenge** – varighet, språkønske, om favoritthjelperen skal spørres først
4. **Pris og bekreftelse** – hver prislinje vises før bestilling
5. **Matching** – fast hjelper → Care Circle → verifiserte hjelpere i nærheten
6. **Bekreftelse** – hvem som kommer, ankomsttid og oppmøtekode

Beskrivelser som tyder på en akutt situasjon utløser nødnumrene i stedet for et oppdrag.

## Registreringsflyten (hjelper)

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
