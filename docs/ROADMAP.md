# Teknisk veikart

Fase 1 er levert i dette repoet. Fasene videre gjør nettstedet om fra registreringsflate
til en fungerende markedsplass.

## Fase 1 – Nettsted, bestilling og registrering ✅ (dette repoet)

- Forside med tre innganger: eldre, pårørende, hjelper
- Senior Mode: bestilling med store knapper, taleinput og akuttfilter
- Pårørendepanel: status, Care Circle, varsler, bestilling på vegne av
- Prismodell med synlig pris før bestilling (`assets/js/pris.js`)
- Oppdragstavla for hjelpere med tilgjengelighetsbryter som styrer posisjonsbruk
- Matchingmotor med absolutte krav, vekter og begrunnelser (`assets/js/matching.js`)
- Innsjekk med oppmøtekode, oppdragsnotat og utsjekk
- Driftskonsoll med hendelseskø, svarfrister, søknadsbehandling og handlingslogg
- Registreringsflyt for hjelpere i seks steg med validering
- SMS-verifisering av mobilnummer (demomodus i frontend)
- Frivillig posisjonsdeling med eget samtykke og mulighet for å slette
- Personvernerklæring, trygghetsside og samtykke til informasjonskapsler med atskilte formål
- API-adapter (`assets/js/api.js`) som backend kobles inn i uten å røre skjemakoden

## Fase 2 – Backend og ekte kontoer

- API: `POST /api/v1/hjelpere/registrering`, `POST /api/v1/auth/otp/send|verify`
- Database med kryptering av sensitive felt; posisjon i egen tabell med kort levetid
- Reell SMS-leverandør for engangskoder
- Innlogging og økter
- Driftskonsollen kobles til ekte saker, roller og tilgangsstyring
- Personverninnstillinger: innsyn, retting, nedlasting, sletting

## Fase 3 – Verifisering

- Elektronisk ID-kontroll med selfie-match hos ekstern leverandør
- Oppslag mot Helsepersonellregisteret ved oppgitt HPR-nummer
- Strukturert referansesjekk med dokumenterte svar
- Sikkerhetskurs med test og krav om bestått før første oppdrag
- Verifiseringsmerker på profilen

## Fase 4 – Oppdrag og kart

- Bestillingsflyten kobles til ekte oppdrag i backend
- Familier oppretter oppdrag med strukturerte felt (ikke fritekst som standard)
- Oppdragskart som viser bydel og omtrentlig avstand, aldri adresse før tildeling
- «Jeg er tilgjengelig»-bryter som styrer all posisjonsbruk
- Matchingmotoren fra fase 1 kobles til ekte oppdrag, posisjon og varsling
- Tilbudsbølger: fast hjelper → Care Circle → øvrige verifiserte

## Fase 5 – Gjennomføring og betaling

- Innsjekk med engangskode fra familien og områdekontroll
- Tidtaking, statusvarsler til familien, utsjekk og bekreftelse
- Prisberegning: tid, reisetillegg, plattformkommisjon
- Utbetaling via betalingsleverandør; beløpsbegrenset oppdragslommebok for innkjøp
- SOS-knapp og hendelseshåndtering

## Fase 6 – Tillit og drift

- Tillitsscore med åpne kriterier og innsigelsesmulighet
- Fast hjelper og «care circle»
- Rapportering av problemer med automatisk frys ved sikkerhetssaker
- Forsikringsordning på plass
- Ferdigstilt DPIA og databehandleravtaler før posisjonsfunksjoner i produksjon

## Fase 7 – Europeisk utrulling

- Landlag for valuta, språk, eID og lokale regler (`docs/EUROPA.md`)
- By for by, ikke land for land: tetthet av hjelpere før geografisk bredde
- Åpenhet i matchingen og menneskelig gjennomgang av kontostenging

## Juridiske porter

Fire spørsmål må besvares før trinnet de påvirker. De sendes samlet til rådgiver
før fase 2 startes, slik at svartiden blir en del av byggetiden.

| Port | Blokkerer | Konsekvens hvis vi bygger først |
|---|---|---|
| Samtykke på vegne av person med svekket kognisjon | Kontomodellen | Feil antakelse om avtalepart må skrives om, ikke lappes |
| Merverdiavgift | Prising utad | Opptil 25 % på en modell regnet uten |
| Betalingsformidling | Betalingsflyten | Kan kreve konsesjon, eller en helt annen oppsett |
| Arbeidsrettslig status | Prismodell og forsikring | Rundt 30 % på hjelperlinjen mot 99 kr i avgift |

Hele registeret: `docs/team/JURIDISK-RISIKO.md`.

## Rekkefølgekrav

1. DPIA ferdigstilles før posisjonsfunksjoner settes i drift
2. Verifiseringskjeden er komplett før første reelle oppdrag formidles
3. Betalingsflyt gjennom leverandør før penger utveksles
4. Akuttfilteret skal aldri kunne omgås av en oppdragsmal
5. De fire juridiske portene besvares før fase 2 startes
