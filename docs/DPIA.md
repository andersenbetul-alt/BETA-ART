# DPIA – utkast og arbeidsplan

Vurdering av personvernkonsekvenser for PårørendePilot. **Skal ferdigstilles før
posisjonsfunksjonene settes i produksjon.** Dette dokumentet er et strukturert utkast
som skal fylles ut sammen med juridisk rådgiver – ikke en ferdig vurdering.

## 1. Hvorfor DPIA er nødvendig her

Tjenesten kombinerer flere forhold som hver for seg trekker mot høy risiko, og som
sammen gjør en vurdering nødvendig:

- Systematisk behandling av posisjonsdata
- Automatisert matching mellom personer
- Sårbar registrert gruppe: eldre, i egne hjem
- Hjemmeadresser til personer som ofte bor alene
- Risiko for at helseopplysninger oppgis av familien i fritekst
- Behandling knyttet til hjelpernes arbeidsutførelse, som grenser mot arbeidstakerkontroll
- Betalingsstrømmer mellom private parter

## 2. Beskrivelse av behandlingen

| Spørsmål | Svar |
|---|---|
| Hva gjør systemet? | Kobler familier som trenger praktisk hjelp til eldre, med verifiserte hjelpere i nærområdet |
| Hvem er registrerte? | Hjelpere, familiemedlemmer (bestillere), eldre mottakere, referansepersoner |
| Hvilke data? | Se behandlingsprotokollen i `docs/GDPR.md` |
| Automatiserte avgjørelser? | Matching og tillitsscore påvirker hvilke oppdrag som tilbys |
| Overføring utenfor EU/EØS? | Skal unngås; eventuelle unntak må vurderes særskilt |

## 3. Risikovurdering

| # | Risiko | Konsekvens | Sannsynlighet | Tiltak |
|---|---|---|---|---|
| R1 | Bevegelsesprofil av hjelper bygges over tid | Høy | Middels | Posisjon kun ved «tilgjengelig» eller aktivt oppdrag; kort lagring; avrunding |
| R2 | Eldres hjemmeadresse eksponeres for uvedkommende | Svært høy | Middels | Adresse skjult til oppdrag er tildelt; loggede oppslag; skjules etter fullført oppdrag |
| R3 | Helseopplysninger havner i fritekst | Høy | Høy | Minimert fritekst, veiledning i grensesnittet, slettemulighet, moderering |
| R4 | Uegnet person får oppdrag | Svært høy | Lav–middels | ID-kontroll, referansesjekk, kurs, tillitsnivåer, prøveperiode, oppmøtekode |
| R5 | Økonomisk utnyttelse av eldre | Svært høy | Middels | Forbud mot kontanter/kort/PIN/BankID; all betaling i plattformen; beløpsbegrenset oppdragslommebok |
| R6 | Tillitsscore ekskluderer hjelpere urettmessig | Middels | Middels | Åpne kriterier, mulighet for innsigelse, menneskelig gjennomgang |
| R7 | Posisjonssporing oppfattes som arbeidstakerkontroll | Middels | Middels | Formålsbegrensning, informasjon, ingen sporing utenfor oppdrag; arbeidsrettslig avklaring |
| R8 | Datainnbrudd hos databehandler | Høy | Lav | Databehandleravtaler, EU/EØS, kryptering, revisjon, varslingsrutine |
| R9 | Familien deler mer enn nødvendig i oppdragsbeskrivelse | Middels | Høy | Strukturerte felt fremfor fritekst; hjelperen ser kun det oppdraget krever |
| R10 | Pårørende får løpende innsyn i den eldres hverdag | Høy | Høy | Innsynsnivå settes av den eldre, standard er ingen deling; fritekst deles aldri |
| R11 | Den eldre kan ikke samtykke selv, og pårørende samtykker på hennes vegne | Svært høy | Middels | Uavklart – se J1 i juridisk register. Blokkerer kontomodellen |
| R12 | Referansepersoner behandles uten å ha meldt seg på | Middels | Høy | Informeres ved første kontakt, vurdering ikke sitat, 12 måneders lagring |

## 4. Nødvendighet og proporsjonalitet

- **Er posisjon nødvendig?** Ja for nærhetsmatching, men ikke som forutsetning for å ha konto.
  Derfor kan hjelpere registrere seg og matches på sted og postnummer uten å dele posisjon.
- **Finnes mindre inngripende alternativ?** Ja for deler av formålet: postnummer og bydel.
  Posisjon gir bedre presisjon og oppmøtekontroll, og brukes derfor tidsbegrenset og med samtykke.
- **Er lagringstiden minimert?** Posisjonspunkter slettes eller anonymiseres kort tid etter oppdrag.

## 5. Restrisiko og beslutning

Fylles ut ved ferdigstillelse:

- [ ] Restrisiko vurdert som akseptabel
- [ ] Forhåndsdrøfting med Datatilsynet vurdert (kreves ved høy restrisiko)
- [ ] Godkjent av ledelsen, dato:
- [ ] Neste gjennomgang, dato:

## 6. Utestående avklaringer med juridisk rådgiver

Den fullstendige listen står nå i `team/JURIDISK-RISIKO.md` med 21 punkter.
De fire som må besvares først:

0. Arbeidsrettslig status · betalingsformidling · merverdiavgift · samtykke på
   vegne av en person med svekket kognisjon

Øvrige punkter som berører denne vurderingen:

1. Hjemmelsgrunnlag for politiattest per oppdragskategori
2. Arbeidsrettslig status for hjelpere (oppdragstaker vs. arbeidstaker) og konsekvenser for posisjonsbruk
3. Behandlingsgrunnlag dersom helseopplysninger blir nødvendige
4. Forsikringsdekning: ansvar, ulykke, skade i kundens hjem
5. Rolle- og ansvarsfordeling med betalingsleverandør
6. Krav ved formidling av oppdrag som grenser mot helse- og omsorgstjenester
