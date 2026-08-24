# Naviar

Besøksbekreftelse for små selskaper som hjelper eldre hjemme. Medarbeideren bekrefter
besøket på 30 sekunder, pårørende får beskjed om at det er gjort, og leverandøren
sitter igjen med en historikk som kan vises fram.

Leverandøren betaler. Verken den eldre eller de pårørende trenger konto eller app.

> **Grensen som holder produktet på plass:** oppgavelisten er fast og ikke-klinisk.
> Vi tar ikke imot helseopplysninger, og skal ikke bli et journalsystem.

## To produkter i dette repoet

| | Status | Hvor |
|---|---|---|
| **Besøksbekreftelse** (B2B) | Bygget og testet. Dette er det som selges nå | `besok/` |
| **Markedsplassen** (v1-konseptet) | Parkert som grunnlag for v2 | rot-nivå |

Markedsplassen ble pressetestet og lagt til side: den krevde verifiseringskjede,
vaktordning og betalingsformidling før første oppdrag kunne formidles. Koden står
urørt, og er nøyaktig det v2 trenger den dagen verifiserte hjelpere kobles på.
Vurderingen ligger i [`docs/team/PIVOT-KOORDINERING.md`](docs/team/PIVOT-KOORDINERING.md)
og [`docs/team/SYNTESE.md`](docs/team/SYNTESE.md).

## Status

Fase 1 er implementert: nettsted, bestillingsflyt for eldre og pårørende,
og registreringsflyt for hjelpere. Løsningen er statisk (HTML/CSS/JS uten byggesteg)
og har ingen backend ennå. All kommunikasjon mot server går gjennom `assets/js/api.js`,
som står i demomodus – personopplysninger sendes ingen steder.

Tjenesten har fire brukergrupper: den eldre, den pårørende, hjelperen og driftsorganisasjonen.
Tjenestedesignet for hele systemet ligger i [`docs/SERVICE-BLUEPRINT.md`](docs/SERVICE-BLUEPRINT.md).

## Kjør lokalt

```bash
npm start            # statisk server på http://localhost:8000
```

## Tester

```bash
npm test             # enhetstester + nettlesertester (107 tester)
npm run test:enhet   # bare enhetstester, ingen nettleser
npm run sjekk        # syntakssjekk av alle skriptfiler
```

Enhetstestene dekker prismodellen, matchingmotorens absolutte krav og rangering,
og at datamodellen holder gateadresser utenfor oppdragslisten. Nettlesertestene
kjører hele bestillingsflyten, akuttfilteret, hjelperregistreringen, oppdragstavla
med adressevern, driftskonsollen og mobilvisning av alle sider.

Testene har ingen eksterne avhengigheter utover Playwright, som hentes lokalt om
det er installert og ellers globalt. Mangler Playwright, hopper nettlesertestene
over seg selv i stedet for å feile. Detaljer i [`docs/TESTING.md`](docs/TESTING.md).

## Innhold

| Fil | Beskrivelse |
|---|---|
| `index.html` | Forside med tre innganger: eldre, pårørende, hjelper |
| `trenger-hjelp.html` | Senior Mode – be om hjelp med store knapper og taleinput |
| `familie.html` | Pårørendepanel – status, Care Circle, varsler, bestilling på vegne av |
| `bli-hjelper.html` | Registrering av hjelper i seks steg |
| `oppdrag.html` | Oppdragstavla – tilgjengelighetsbryter, rangerte oppdrag, innsjekk |
| `drift.html` | Driftskonsoll (internt) – hendelser, søknader, aktive oppdrag, betaling |
| `trygghet.html` | Verifisering, tillitsnivåer, pengeregler, tillitsscore |
| `personvern.html` | Personvernerklæring |
| `assets/js/bestilling.js` | Bestillingsflyt, akuttfilter, taleinput, simulert matching |
| `assets/js/pris.js` | Prismodell – timer, reisetid, hastetillegg, serviceavgift |
| `assets/js/matching.js` | Matchingmotor – absolutte krav, vekter og begrunnelser |
| `assets/js/tavle.js` | Oppdragstavla: tilgjengelighet, posisjonsstyring, innsjekk/utsjekk |
| `assets/js/demodata.js` | Testdata; adresser holdes atskilt fra oppdragslisten |
| `assets/js/drift.js` | Driftskonsoll: køer, svarfrister, handlinger og handlingslogg |
| `assets/js/driftdata.js` | Testdata for drift: alvorsgrader, saker, søknader |
| `assets/js/registrering.js` | Skjemalogikk: validering, SMS-kode, posisjonssamtykke, kladd |
| `assets/js/api.js` | API-adapter – byttes til ekte endepunkter i fase 2 |
| `assets/js/app.js` | Meny, samtykke til informasjonskapsler |
| `docs/SERVICE-BLUEPRINT.md` | Tjenestedesign: syv systemer, matching, pris, kvalitet |
| `docs/DRIFT.md` | Driftsrutiner: roller, alvorsgrader, eskalering, avvik |
| `docs/TESTING.md` | Testoppsett og hvilke løfter testene beskytter |
| `docs/team/JURIDISK-RISIKO.md` | 21 juridiske risikopunkter, kontrollert mot koden |
| `docs/team/SYNTESE.md` | Vedtatte beslutninger – fasit når dokumentene spriker |
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

## Matchingmotoren

`assets/js/matching.js` skiller mellom **absolutte krav** og **vekter**.

Absolutte krav er filtre, ikke poeng – brytes ett av dem, tilbys oppdraget aldri:
tilgjengelig nå, kryssert av for oppdragstypen, tillitsnivå høyt nok, innenfor egen
maksavstand, ledig i tidsrommet, og – i prøveperioden – kun lavrisiko på dagtid.

Deretter rangeres de gjenværende oppdragene:

| Faktor | Vekt |
|---|---|
| Tidligere oppdrag hos samme familie | 25 |
| Nærhet | 25 |
| Tillitsscore | 20 |
| Språkmatch | 10 |
| Punktlighet | 10 |
| Transportform | 5 |
| Pris | 5 |

Motoren er bevisst forklarbar. Hvert oppdrag som vises, kommer med begrunnelsen for
plasseringen sin, og hvert oppdrag som holdes utenfor, kommer med en grunn – for
eksempel «Dette oppdraget krever tillitsnivå 2. Du er på nivå 1.» En hjelper som
stenges ute av et oppdrag, skal kunne få et svar, ikke bare oppleve at det er stille.

## Adressevern i praksis

Testdataene speiler regelen fra personvernarkitekturen: gateadressen finnes ikke i
oppdragslisten frontend rangerer på. Den hentes fra et eget oppslag først når oppdraget
er tildelt, og forsvinner fra visningen igjen når oppdraget er meldt ferdig.
Dette er verifisert i nettlesertest.

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
- Den eldre velger selv hva familien får se, og ingen deling er forvalgt
- Hjelperen har en vei ut når hun blir bedt om noe utenfor oppdraget

Detaljene ligger i [`docs/GDPR.md`](docs/GDPR.md).

## Drift

Operasjonssiden er beskrevet i [`docs/DRIFT.md`](docs/DRIFT.md) og speiles i
driftskonsollen. Kjernen er fire alvorsgrader med hver sin svarfrist – P1 sikkerhet
innen 15 minutter døgnet rundt, P2 oppdrag innen 1 time, P3 klage innen 1 virkedag,
P4 søknad innen 3 virkedager. Oversittet frist skjules aldri; den vises i konsollen
og eskaleres til driftsleder.

Ved sikkerhetsmelding er rekkefølgen alltid den samme: fryse konto, sikre brukeren,
utrede, konkludere, svare melderen. En konto stenges permanent av et menneske, aldri
av en terskel i en algoritme.

## Forbehold

Prosjektet er under utvikling. Innholdet er ikke juridisk rådgivning. Posisjonsdata,
arbeidsrettslig status for hjelpere, eventuelle helseopplysninger, krav om politiattest
og betalingsstrømmer må kvalitetssikres med juridisk rådgiver før drift.

## `naviar-care/`

Everything for the NAVIAR CARE identity, in one folder that can be copied
wholesale into the product repo: the four logo directions as SVG and PNG
(colour, one-ink mono, reversed, and recoloured to the product's live tokens),
the React component that replaces the placeholder icon in the site header, the
`/brand` route, the warm-accent token patch, and `INSTALL.md` with the steps.

`identity.html` and `accent-proposal.html` are standalone pages — open either
directly, no build step.
