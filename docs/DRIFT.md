# Driftsrutiner

Hvordan PårørendePilot drives i praksis. Dokumentet er bindende for driftsorganisasjonen
og speiles i driftskonsollen (`drift.html`).

Grunnregelen: **en tjeneste som sender mennesker hjem til andre mennesker, må ha en
driftsorganisasjon som er like gjennomtenkt som teknologien.**

## 1. Roller og tilgang

| Rolle | Ser | Kan gjøre |
|---|---|---|
| Kundestøtte | Kontaktopplysninger, oppdragsstatus | Opprette oppdrag på telefon, svare brukere |
| Saksbehandler | Søknader, referansesvar, hendelser | Godkjenne, avslå, purre, ta og lukke saker |
| Vakthavende | Alle åpne hendelser | Fryse konto, omfordele oppdrag, eskalere |
| Driftsleder | Alt, inkludert logger | Gjenåpne saker, oppheve suspensjon, godkjenne unntak |
| Personvernansvarlig | Innsyns- og slettebegjæringer, avvik | Behandle rettighetskrav, lede avviksvarsling |

Ingen rolle ser fødselsnummer, kontoopplysninger eller helseopplysninger – de behandles
ikke i driftssystemet. Alle oppslag i saker logges, og loggen er en del av verktøyet.

## 2. Alvorsgrader og svarfrister

| Grad | Frist | Gjelder |
|---|---|---|
| **P1 – Sikkerhet** | 15 minutter, døgnet rundt | Pågående risiko for bruker eller hjelper: mistanke om økonomisk utnyttelse, upassende oppførsel, uvedkommende i hjemmet, SOS-varsel |
| **P2 – Oppdrag** | 1 time | Uteblitt oppmøte, avbrutt oppdrag, bruker som står uten hjelp, oppdrag i kraftig overtid |
| **P3 – Klage** | 1 virkedag | Klage på utførelse, betalingssak, tvist om varighet |
| **P4 – Søknad** | 3 virkedager | Søknadsbehandling, referansesjekk, purring |

Oversittet frist skjules aldri. Den vises i konsollen og eskaleres automatisk til driftsleder.

## 3. Eskaleringsstige

1. Saksbehandler tar saken og logger første tiltak.
2. P1 varsler vakthavende umiddelbart, uansett tidspunkt.
3. Brudd på svarfrist eskaleres automatisk til driftsleder.
4. Saker med mulig lovbrudd eller fare for liv går til nødetatene. Plattformen erstatter
   dem ikke, og skal aldri forsinke dem.
5. Personvernbrudd følger egen varslingsrutine, se punkt 8.

## 4. Sikkerhetssaker: fryse først, utrede etterpå

Ved melding om sikkerhet gjelder denne rekkefølgen, uten unntak:

1. **Frys kontoen.** Ingen nye oppdrag tilbys.
2. **Sikre brukeren.** Pågående oppdrag avsluttes og omfordeles. Familien varsles.
3. **Utred.** Innsjekk- og utsjekklogger, oppdragsnotater, tidligere meldinger, samtale
   med begge parter.
4. **Konkluder.** Gjenåpning, advarsel, nivåsenkning eller permanent utestengelse.
5. **Svar melderen.** Også når konklusjonen er at ingenting galt skjedde.

Den frosne får vite hva som er meldt og kan uttale seg. En konto stenges permanent av et
menneske, aldri av en terskel i en algoritme.

## 5. Søknadsbehandling

Et steg kan ikke hoppes over, og godkjenning er sperret i verktøyet til alle er fullført:

- [ ] E-post bekreftet
- [ ] Mobilnummer bekreftet med engangskode
- [ ] Elektronisk ID-kontroll gjennomført
- [ ] Referanse 1 kontaktet og besvart
- [ ] Referanse 2 kontaktet og besvart
- [ ] Sikkerhetskurs bestått (minst 85 %)

**Referansesamtalen** følger samme spørsmålsliste for alle søkere, og svarene skrives ned:

1. Hvor lenge har du kjent søkeren, og i hvilken sammenheng?
2. Vil du beskrive søkeren som pålitelig?
3. Fullfører søkeren oppgaver som avtalt, og møter presist?
4. Ville du syntes det var greit at søkeren jobbet hjemme hos en eldre?
5. Er det noe du mener vi bør vite før vi godkjenner søkeren?

Nær familie godtas ikke som referanse. Avslag begrunnes skriftlig og kan påklages.

**Referansepersonen er en registrert som aldri meldte seg på hos oss.** Det gir tre
plikter som gjelder fra første samtale:

1. **Vi presenterer oss ved oppringing:** hvem vi er, hvorfor vi ringer, hva svaret
   brukes til, og at hun kan la være å svare.
2. **Vi noterer en vurdering, ikke et sitat.** «Bekrefter pålitelighet og
   punktlighet» kan gjengis til en avvist søker. Ordrette sitater kan ikke gjengis
   uten å røpe hvem som sa hva, og setter oss mellom to personer som begge har
   innsynsrett.
3. **Vi lagrer svaret i 12 måneder**, deretter slettes det. Referansepersonens
   opplysninger slettes samtidig, uavhengig av om søkeren fortsatt er aktiv.

Ber referansepersonen om innsyn, behandles det som en ordinær rettighetsforespørsel
etter punkt 9.

Godkjent søker starter på **tillitsnivå 1** med prøveperiode: fem oppdrag med lav risiko
på dagtid.

## 6. Overvåking av aktive oppdrag

| Situasjon | Utløser | Tiltak |
|---|---|---|
| Ingen innsjekk 10 min etter avtalt tid | Automatisk P2 | Ring bruker først, deretter hjelper |
| Ingen utsjekk 30 min etter forventet slutt | Automatisk P2 | Kontakt hjelper; ved taushet, kontakt bruker |
| Oppdrag i kraftig overtid | Automatisk P2 | Avklar om det er avtalt utvidelse |
| SOS fra hjelper eller bruker | Automatisk P1 | Vakthavende overtar umiddelbart |

Konsollen viser oppdragsstatus, ikke hjelperens bevegelser.

## 7. Betaling og tvister

- Beløpet reserveres når hjelperen takker ja, og trekkes etter bekreftet utført oppdrag.
- Bekrefter ikke familien innen 48 timer, frigis utbetalingen automatisk. Hjelperen skal
  ikke bære kostnaden av at noen glemmer å trykke på en knapp.
- Ved tvist om varighet legges innsjekk- og utsjekktidspunkt til grunn. Differansen deles
  bare når loggene er uklare.
- Avbestilling mindre enn 2 timer før avtalt tid utløser kompensasjon til hjelperen.
- Kontant betaling mellom bruker og hjelper er brudd på vilkårene og behandles som
  sikkerhetssak.

## 8. Avvik og personvernbrudd

1. Oppdaget avvik meldes personvernansvarlig samme dag.
2. Omfang kartlegges: hvilke opplysninger, hvor mange personer, hvilken risiko.
3. Varsling til tilsynsmyndighet innen 72 timer der plikten gjelder.
4. De berørte varsles når risikoen er høy, på et språk de forstår.
5. Hendelsen føres i avviksregisteret med årsak og tiltak.

## 9. Rettighetsforespørsler

| Krav | Frist | Behandles av |
|---|---|---|
| Innsyn | 30 dager | Personvernansvarlig |
| Retting | Uten ugrunnet opphold | Kundestøtte |
| Sletting | 30 dager | Personvernansvarlig |
| Dataportabilitet | 30 dager | Personvernansvarlig |
| Tilbaketrekking av samtykke | Umiddelbart, selvbetjent | Automatisk i profilen |
| Innsyn fra referanseperson | 30 dager | Personvernansvarlig |
| Sletting av avvist søknad | 6 måneder automatisk | Automatisk |

Enkelte opplysninger må beholdes tross slettekrav, for eksempel regnskapsbilag. Det
forklares konkret for den som spør, ikke med en generell henvisning til «lovkrav».

## 10. Nøkkeltall som følges ukentlig

- Tid fra bestilling til akseptert oppdrag
- Andel oppdrag som får hjelper
- Andel oppdrag uten avvik
- Andel familier med etablert fast krets
- Antall P1-saker og median responstid
- Andel svarfrister overholdt
- Andel søknader som fullfører verifiseringen

Går andel oppdrag med hjelper ned, er svaret flere hjelpere i det aktuelle området –
ikke lavere krav til verifisering.
