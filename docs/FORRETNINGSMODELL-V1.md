# NAVIAR Care – Forretningsmodell v1.0

Dette dokumentet er den operative planen som følger av eierbeslutningen
`docs/FORRETNINGSMODELL.md` ba om. Det dupliserer ikke det som allerede står
grundig andre steder – hvert kapittel viser til kildedokumentet og skriver
bare det som mangler: en samlet oversikt, og de to-tre stedene der modellvalget
faktisk endrer innholdet.

## 0 · Modellbeslutningen (tatt 25.08.2026)

Eieren valgte **A + B hybrid** som langsiktig retning, men med denne
presiseringen etter gjennomgang: **v1.0 bygges på modell A alene.** Modell B
(Naviar som egen arbeidsgiver i en pilotby) er dokumentert som en fremtidig
utvidelsesmulighet, ikke noe som arkitekteres eller bygges nå.

Grunnen er ikke motvilje mot B – det er at B utløser to spørsmål som i dag er
bevisst stengt, ikke bare uavklart:

1. **Forbrukerkontrakt.** `JURIDISK-GRENSE.md` beslutning 12 sier «ingen
   forbrukerabonnement i v1» nettopp for å unngå angrerett, opplysningsplikt
   før avtale og fornyelsesregler. Modell B, der Naviar selv drifter en
   pilotby, betyr at noen må selge tjenesten direkte til familien – og det er
   akkurat den kontrakten som er stengt av med vilje (`besok-abonnement.js`,
   `familie`-strømmen sperret, se `BETALING.md`).
2. **GDPR-rollen snur.** Rolletabellen i `GDPR.md` og `JURIDISK-GRENSE.md`
   («Hvem er hvem etter personvernforordningen») gjør leverandøren til
   behandlingsansvarlig og Naviar til databehandler i modell A. I modell B er
   Naviar selv behandlingsansvarlig og arbeidsgiver i pilotbyen – en annen
   DPIA, en annen varslingsplikt, en annen rolle i hver av de tolv
   beslutningene.

Skal B bygges senere, er dette stedet den beslutningen skrives inn, med hvem
som vurderte de to punktene over og aksepterte konsekvensen – samme prinsipp
som `FORRETNINGSMODELL.md` bruker for modell C.

**Det som følger under er derfor forretningsmodellen for modell A**, med
henvisning til kildedokumentene som allerede har detaljene.

---

## 1 · Markedsposisjon

> NAVIAR Care er ikke en bakeliste over nabolagshjelp og ikke en helsetjeneste.
> Det er en programvaretjeneste som gir verifiserte tjenesteleverandører et
> verktøy for å planlegge, matche, dokumentere og varsle om praktiske besøk –
> utført av leverandørens egne ansatte.

| | |
|---|---|
| **Merke** | NAVIAR Care |
| **Hvem betaler** | Privat tjenesteleverandør, 5–50 ansatte (`SALG.md` §1) |
| **Hvem opplever verdien** | Eldre som vil bo hjemme, og pårørende som ikke kan være der hele tiden |
| **Kjerneverdi** | Til leverandøren: dokumentasjon og drift som holder ved tilsyn. Til familien: forutsigbarhet og innsyn. Til den eldre: selvbestemmelse og et kjent ansikt |
| **Konkurranseposisjon** | Ikke en bakeliste, ikke en markedsplass uten kontinuitet (jf. `KONKURRENTAUDIT.md` – Papa-mønsteret «fremmed per besøk» er nettopp det hjelpeteam-prinsippet svarer på) |

Denne setningen erstatter ikke `JURIDISK-GRENSE.md`s rollesetning («Naviar
Care er en programvaretjeneste som hjelper verifiserte tjenesteleverandører
med…») – den er samme setning, skrevet for en markedsføringskontekst i stedet
for en juridisk.

---

## 2 · Kundesegmenter og verdiforslag

Modell A har **to** kundebegreper, og de må ikke blandes:

| | Kunde (betaler) | Sluttbruker (opplever verdien, betaler ikke) |
|---|---|---|
| Hvem | Privat tjenesteleverandør, eier/daglig leder | Eldre + pårørende |
| Hva de kjøper | Programvareabonnement per ansatt | Ingenting – ingen konto, ingen betaling (`JURIDISK-GRENSE.md` #12) |
| Verdiforslag | Dokumentasjon som holder ved tilsyn; færre telefoner fra bekymrede pårørende (`SALG.md` §3) | Se hvem som kommer, når, og hva som ble gjort. Fast hjelper der det er mulig (`HJELPETEAM.md`) |

**Ikke nå** (`SALG.md` §1): store konsern med egne systemer, kommuner
(anskaffelsessyklus 6–18 måneder), familier direkte (gjør oss til
forbrukerleverandør).

---

## 3 · Tjenestegrenser og sikkerhetsmodell (Norge)

Fullt innhold: `JURIDISK-GRENSE.md` (tolv beslutninger). Sammendrag:

- **Praktisk hjelp, ikke helsehjelp.** Åtte oppgavetyper, faste utfall i
  stedet for fritekst der det går. Ingen medisinering, stell eller
  helsevurdering – verken i katalogen eller som tilvalg.
- **Ingen GPS-sporing, ingen bilder, ingen lyd.** Inn- og utsjekk løser
  informasjonsbehovet; løpende sporing er ikke det minst inngripende tiltaket
  (aml. kap. 9).
- **Nødgrensen er synlig i appen** – Naviar Care er ikke en nødtjeneste, ring
  113 ved fare for liv og helse.
- **Språkkrav** B1 for arbeid alene, B2 der oppgaven grenser mot helsehjelp –
  leverandøren bekrefter, Naviar lagrer bekreftelsen (`besok-sprakkrav.js`).
- **KI-agentene har tak**: automatisk, krever godkjenning, menneskelig
  avgjørelse – styrt av oppgavens risikonivå, aldri av modellens egen
  vurdering (`besok-agenter.js`).

---

## 4 · Prising, pakker, marginer og kostnadsstruktur

Fullt regnestykke: `docs/team/OKONOMI.md`. Salgstabell: `SALG.md` §2.

| Plan | Pris | Innhold |
|---|---|---|
| Pilot | 990 kr engangs | 30 dager, inntil 50 kunder, stopper av seg selv |
| Standard | 149 kr per aktiv medarbeider/mnd, minimum 745 kr (fem ansatte) | Ubegrenset besøk og familiemeldinger |

**Åpent punkt, videreført fra `OKONOMI.md`:** prisen i `assets/js/besok-abonnement.js`
er fortsatt 990/499 og skal ikke endres før de ti første betalende pilotene har
testet betalingsviljen. 1 490 kr/mnd (ti ansatte) er et regnet, ikke målt tall.

| Kunder | Dekningsbidrag/mnd | Resultat/mnd |
|---|---|---|
| 75 (break-even) | 105 300 | ≈ 0 |
| 100 | 140 439 | +36 106 |
| 300 | 421 317 | +316 984 |

Dekningsbidrag 94,3 % fordi B2B-modellen ikke bærer ID-kontroll, referanser,
kurs, forsikring eller vaktordning – det gjør leverandøren, som arbeidsgiver.
To variabler flytter tallet: **pris og churn.** Kostnadskutt gjør nesten
ingenting (§5, `OKONOMI.md`).

**Blokkert inntektsstrøm, bevisst:** «Naviar Klarhet» (ekspertkonsultasjon,
599/449 kr) venter på tre juridiske avklaringer (J11 betalingsformidling, J5
angrerett, J16 mva) før den kan selges – se `BETALING.md`. Den regnes ikke inn
i tallene over.

---

## 5 · Rekruttering og matching – hvem gjør hva

**Naviar rekrutterer ikke hjelpere.** Dette er ikke en avgrensning i denne
planen alene – det er selve grunnen til at modell A har lav arbeidsrettslig
risiko (`JURIDISK-GRENSE.md` #1). Fordelingen:

| | Leverandøren | Naviar |
|---|---|---|
| Rekrutterer og ansetter | Ja – egne ansatte | Nei |
| Verifiserer (ID, referanser, politiattest der hjemmel finnes) | Ja | Nei – lagrer bekreftelsen leverandøren gir |
| Setter lønn og arbeidsvilkår | Ja | Nei |
| Bygger tilbudsbrev | Egen prosess | Leverer mal (`TILBUDSPAKKE.md`) |
| Matcher hjelper til oppdrag | Godkjenner tildeling der risikonivået krever det | Motoren foreslår (`matching.js`): fast hjelper først, så krets, så øvrige |
| Sikrer kontinuitet | Setter faste dager | Beregner og viser teamet (`HJELPETEAM.md`, `hjelpeteam.js`) |

Markedsinnsikten som informerer produktkravene (ikke krav Naviar stiller til
enkeltpersoner) står i `PROFILREFERANSER.md`: kjønn og helsetilstand er aldri
matchingkriterier, språknivå er oppgavebasert og bekreftet av leverandøren,
førerkort er fordel aldri krav.

---

## 6 · Nettsted og MVP-funksjoner

Levert (Fase 1, `ROADMAP.md`): forside med tre innganger, senior-modus med
store knapper/tale/akuttfilter, pårørendepanel med Care Circle, synlig pris
før bestilling, oppdragstavle med tilgjengelighetsbryter, matchingmotor,
innsjekk med oppmøtekode, driftskonsoll, seksstegs hjelperregistrering,
personvernerklæring og trygghetsside, API-adapterlag (`api.js`, `DEMO=true`).

Nyeste byggekloss: «Mitt hjelpeteam» (`besok/hjelpeteam.html`) – familiens
side av kontinuiteten, ferdig 25.08.2026.

Gjenstår før lansering (`LANSERING.md`): Vercel-tilgang til repoet, forsiden
rettet til `index.html`, tre AUTH-avgjørelser, betalingsflyt fortsatt sperret
av fire avklaringspunkter.

---

## 7 · GDPR, klager og hendelseshåndtering

Full modell: `GDPR.md` (databehandlingsprotokoll) og `JURIDISK-GRENSE.md`
(klagekanal og svarfrister). Kjernen:

| | |
|---|---|
| Rollefordeling | Leverandøren = behandlingsansvarlig. Naviar = databehandler, behandler kun etter instruks |
| Sletting | Ikke én dato – besøket krympes i fire trinn (12t/7d/30d/365d), kjørt ved hver lesning (`rydd()`) |
| Personvernbrudd | Naviar → leverandøren uten ugrunnet opphold; leverandøren → Datatilsynet innen 72 timer |
| Mistanke om vold/overgrep | Anmeldes straks – ikke en 72-timersfrist |
| Rødt merke på en konto | Aldri satt av automatikk alene – krever navn, grunn og at personen er varslet (`besok-klage.js`) |
| Før posisjonsfunksjoner i produksjon | DPIA må være ferdigstilt (`DPIA.md`) |

---

## 8 · Første kundeanskaffelse

Prosessen er `SALG.md` §3–§5 i sin helhet – gjentas ikke her, bare rammen:

1. Kvalifisering (10 min telefon): 5–50 ansatte, praktiske besøk, ingen
   helsehjelp i det vi dekker.
2. Ett spørsmål avgjør salgstypen: «Hva var siste tilsyn/klage, og hva
   manglet dere da?» – etterlevelsessalg eller tidsbesparelsessalg.
3. Demo (12 min video): ett besøk fra opprettelse til familiemelding.
4. Pilot: 990 kr, signert databehandleravtale, ett reelt besøk samme uke.
5. Overgang etter 30 dager: standard eller stopp.

**Viktig presisering mot `docs/team/MARKEDSFORING.md`:** den planen (hjelper-
og familierekruttering i tre bydeler) er skrevet for markedsplassmodellen og
merket som sådan i egen fil – den gjelder ikke lenger og skal ikke brukes som
grunnlag for kundeanskaffelse under modell A. Kanalene som faktisk gjelder nå,
er B2B-salgskanaler: direkte oppsøk av leverandører, ikke forbrukerannonser
mot familier eller hjelperrekruttering.

---

## 9 · 90 dager og 3 år

### Første 90 dager (uke 1–13) – mål: ti betalende piloter

| Uke | Fokus | Suksesskriterium |
|---|---|---|
| 1–4 | Oppsøk kvalifiserte leverandører (Oslo-området, 5–50 ansatte) | 20+ kvalifiseringssamtaler gjennomført |
| 5–8 | Pilotsalg: 990 kr, databehandleravtale, første besøk samme uke | 10 piloter i drift, hver med ≥1 reelt besøk registrert uke 1 |
| 9–13 | Overgang pilot → standard, første prisvalideringsdata | ≥40 % av pilotene går til standard (`SALG.md` §6 stopp-punkt) |

Parallelt, modellnøytralt produktarbeid (`FORRETNINGSMODELL.md` §6): fullføre
senior-modus og «be om hjelp»-flyten, deretter familiepanelet – ingen av
disse avhenger av A/B-spørsmålet.

### 3 år – vekst mot og forbi break-even

| Milepæl | Grunnlag |
|---|---|
| 75 betalende leverandører (break-even) | `OKONOMI.md` – ≈18 måneder ved rendyrket gründersalg |
| 300 leverandører | +316 984 kr/mnd resultat (`OKONOMI.md` §4) |
| Geografisk utvidelse, by for by | Norge (pilot) → Norden → Nordvest-Europa → Sør-Europa (`EUROPA.md`) – tetthet før bredde |
| **Hard grense** | Ingen lansering i et EU-land etter 2. desember 2026 uten gjennomgang mot Plattformarbeidsdirektivet (2024/2831) – `FORRETNINGSMODELL.md` anbefaling 3 |

Churn og betalingsvilje er de to ukjente tallene hele planen hviler på
(`OKONOMI.md` §6) – de ti første pilotene avgjør dem, ikke regnearket.
