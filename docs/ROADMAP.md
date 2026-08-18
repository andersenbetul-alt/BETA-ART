# Teknisk veikart

Fase 1 er levert i dette repoet. Fasene videre gjør nettstedet om fra registreringsflate
til en fungerende markedsplass.

## Fase 1 – Nettsted og registrering ✅ (dette repoet)

- Forside «Finn oppdrag nær deg»
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
- Administrasjonsflate for søknadsbehandling og referansesjekk
- Personverninnstillinger: innsyn, retting, nedlasting, sletting

## Fase 3 – Verifisering

- Elektronisk ID-kontroll med selfie-match hos ekstern leverandør
- Oppslag mot Helsepersonellregisteret ved oppgitt HPR-nummer
- Strukturert referansesjekk med dokumenterte svar
- Sikkerhetskurs med test og krav om bestått før første oppdrag
- Verifiseringsmerker på profilen

## Fase 4 – Oppdrag og kart

- Familier oppretter oppdrag med strukturerte felt (ikke fritekst som standard)
- Oppdragskart som viser bydel og omtrentlig avstand, aldri adresse før tildeling
- «Jeg er tilgjengelig»-bryter som styrer all posisjonsbruk
- Matching på avstand, tilgjengelighet, ferdigheter, tillitsnivå, tidligere relasjon og pris

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

## Rekkefølgekrav

1. DPIA ferdigstilles før posisjonsfunksjoner settes i drift
2. Verifiseringskjeden er komplett før første reelle oppdrag formidles
3. Betalingsflyt gjennom leverandør før penger utveksles
