# Service Blueprint v1

PårørendePilot er ikke en app med funksjoner, men en tjeneste med syv systemer som må
henge sammen. Hver designbeslutning testes mot syv spørsmål:

1. Er det enkelt for brukeren?
2. Er det rimelig for hjelperen?
3. Er det trygt for den eldre?
4. Kan driftsorganisasjonen faktisk håndtere det?
5. Kan det utformes i tråd med GDPR og øvrig regelverk?
6. Kan selskapet tjene penger på det?
7. Skalerer det fra 10 til 100 000 kunder?

## Hovedløpet

```
Behov oppstår
  → oppdrag opprettes (eldre selv, pårørende, eller telefon til oss)
  → akuttfilter: nødetat i stedet for oppdrag?
  → pris beregnes og vises FØR bestilling
  → betalingsmiddel verifiseres, beløp reserveres
  → matching: fast hjelper → Care Circle → verifiserte i nærheten
  → hjelper takker ja, adresse åpnes
  → familien varsles: hvem kommer, når, med hvilke verifiseringer
  → hjelper på vei → innsjekk med engangskode + områdekontroll
  → oppdrag utføres, tid registreres
  → utsjekk + kort oppdragsnotat
  → eldre eller pårørende bekrefter
  → betaling frigis, provisjon trekkes
  → vurdering → tillitsscore oppdateres
```

## System 1 – Kundereisen

| Fase | Eldre bruker | Pårørende |
|---|---|---|
| Behov | Stor knapp, seks ikoner, taleinput | Full oversikt, bestiller på vegne av |
| Valg | Ett spørsmål om gangen, store trykkflater | Hastegrad, varighet, språk, fast hjelper |
| Pris | Vises før bestilling, i hele kroner | Samme pris, med linjevis oppdeling |
| Venting | «Vi leter etter en hjelper» | Sanntidsstatus |
| Møte | Navn, bilde, oppmøtekode | Varsel: hvem kommer, med hvilke merker |
| Underveis | Ingenting å gjøre | Status, varighet, forventet slutt |
| Etter | «Oppdraget er ferdig. Takk, Sofia.» | Full kvittering med tid, notat og beløp |

Prinsipp: **samme hendelse, ulik mengde informasjon.** Den eldre skal ikke lese en
faktura; den pårørende skal ikke lure på hva som skjedde.

## System 2 – Hjelperreisen

```
Søknad → SMS-kode → e-post → elektronisk ID-kontroll → referansesjekk (2 stk.)
→ sikkerhetskurs med test → verifisert hjelper
→ prøveperiode: 5 enkle oppdrag på dagtid
→ betrodd hjelper → Care Circle hos faste familier
```

Hjelperen styrer selv: tilgjengelighet, maks avstand, oppdragstyper og transportform.
«Jeg er tilgjengelig» er den eneste bryteren som slår på posisjonsbruk.

## System 3 – Matchingmotor

Regelen er **nærmeste kvalifiserte og betrodde hjelper** – ikke nærmeste person.
En ny hjelper 300 meter unna taper mot en betrodd hjelper 1,5 km unna som har vært
hos denne familien 17 ganger.

| Variabel | Vekt |
|---|---|
| Tilgjengelighet nå | Absolutt krav |
| Kvalifisert for oppdragstypen | Absolutt krav |
| Tillitsnivå ≥ oppdragets krav | Absolutt krav |
| Tidligere relasjon til familien | Svært høy |
| Avstand og reisetid | Høy |
| Språkønske | Middels–høy |
| Familiens egne preferanser | Høy |
| Transportform | Middels |
| Pris | Middels |

Tilbudsrekkefølge: fast hjelper → Care Circle → verifiserte hjelpere innen radius,
i bølger slik at ikke alle får varsel samtidig.

**Åpenhet:** en hjelper skal kunne få vite hvorfor hen ikke ble valgt, og avgjørelser
som stenger noen ute av plattformen skal ha menneskelig gjennomgang, ikke bare en
algoritmisk terskel.

## System 4 – Trygghet og sikkerhet

Beskrevet i `trygghet.html` og oppsummert her:

- Verifiseringskjede: ID → referanser → kurs → prøveperiode
- Fire tillitsnivåer; oppdrag som krever mer, vises ikke for lavere nivåer
- Tre risikoklasser for oppdrag: åpne marketplace-oppdrag, oppdrag som krever
  opplæring, og oppdrag som kun lisensiert fagpersonell kan utføre
- Innsjekk med engangskode + kontroll av at hjelperen er i riktig område
- Absolutte pengeregler: aldri kontanter, kort, PIN eller BankID
- Beløpsbegrenset engangslommebok for innkjøpsoppdrag
- Umiddelbar frys ved sikkerhetsmelding, deretter manuell gjennomgang

## System 5 – Drift

| Funksjon | Ansvar |
|---|---|
| Søknadsbehandling | Verifisere, ringe referanser, godkjenne |
| Oppdragsovervåking | Fange opp uteblitt innsjekk, forsinkelser, avbrutte oppdrag |
| Hendelseshåndtering | SOS-varsler, sikkerhetsmeldinger, suspensjoner |
| Kundestøtte | Telefon for eldre som ikke vil bruke skjerm |
| Betalingssaker | Tvister, refusjon, avbestilling |

Telefonbestilling er ikke en nødløsning, men en likeverdig kanal: en operatør
oppretter oppdraget i samme system.

## System 6 – Pris og provisjon

Implementert i `assets/js/pris.js`. Kundens pris består av:

| Linje | Forklaring |
|---|---|
| Arbeidstid | Timesats × timer × oppdragsfaktor |
| Reisetid | Halv sats – reisen skal lønne seg uten å bli dyr for kunden |
| Reiseutgift | Sjablongbeløp |
| Hastetillegg | «Nå» +20 %, «i dag» +5 %, fast avtale −5 %, kveld/helg +10 % |
| Serviceavgift | 18 % – dekker formidling, verifisering, forsikring, support og betaling |

Eksempel (Norge, 1,5 t handling, «i dag», dagtid): 390 + 33 + 25 + 22 = 470 kr til
hjelperen, 85 kr i serviceavgift, 554 kr for kunden.

Betalingen reserveres når hjelperen takker ja, og trekkes først etter bekreftet
utført oppdrag. Hjelperen skal aldri lure på om pengene kommer, og kunden skal aldri
betale for et oppdrag som ikke ble utført.

## System 7 – Kvalitet

Stjerner alene er for grovt. Tillitsscore vektes:
oppdragshistorikk 30 %, vurderinger 20 %, punktlighet 15 %, gjenvalg av familier 15 %,
avbestillinger 10 %, sikkerhetshistorikk 10 %. Identitet, referanser og kurs er
absolutte krav, ikke poeng.

Nøkkeltall for tjenesten som helhet: tid fra bestilling til akseptert oppdrag,
andel oppdrag som får hjelper, andel gjenvalgte hjelpere, andel oppdrag uten avvik,
og andel familier med etablert Care Circle.

## Det tjenesten faktisk er

Ikke en app for eldreomsorg. Ikke en jobbplattform. Ikke «Uber for eldre».
Det er et **distribuert menneskelig støttenettverk** rundt en person som vil bo hjemme:
familien, nabolaget, betrodde faste hjelpere, fagfolk ved behov, og en driftsorganisasjon
som holder det sammen.

> Bo hjemme. Få hjelp når du trenger det. Ha familien nær – uansett hvor de bor.
