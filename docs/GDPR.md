# GDPR-arkitektur for Naviar

Personvern er en del av produktarkitekturen, ikke en juridisk side som legges på til slutt.
Dette dokumentet er utviklingsteamets arbeidsgrunnlag. Den brukervendte teksten ligger i `personvern.html`.

> Dette er ikke en juridisk konformitetsvurdering. Posisjonsdata, arbeidsrettslig status,
> eventuelle helseopplysninger og betalingsstrømmer må kvalitetssikres med norsk juridisk
> rådgiver før tjenesten settes i ordinær drift.

## 1. Behandlingsprotokoll

| Opplysning | Formål | Grunnlag | Lagringstid | Kilde |
|---|---|---|---|---|
| Navn, fødselsdato | Konto, aldersgrense 18 år | Avtale | Kontoens levetid + 90 dager | Bruker |
| E-post | Innlogging, varsler | Avtale | Kontoens levetid + 90 dager | Bruker |
| Mobilnummer | Verifisering, kontakt under oppdrag | Avtale | Kontoens levetid + 90 dager | Bruker |
| Sted, postnummer | Regional matching | Avtale | Kontoens levetid | Bruker |
| Posisjon (GPS) | Nærhetsmatching, oppmøtekontroll | **Samtykke** | Slettes/anonymiseres kort tid etter oppdrag | Enhet |
| Tilgjengelighet | Matching | Avtale | Kontoens levetid | Bruker |
| Oppdragstyper, ferdigheter | Riktig hjelper til riktig oppdrag | Avtale | Kontoens levetid | Bruker |
| Språk | Språkmatching | Samtykke (frivillig) | Kontoens levetid | Bruker |
| Profilbilde | Gjenkjennelse ved oppmøte | Samtykke (frivillig) | Kontoens levetid | Bruker |
| ID-verifisert (ja/nei) | Trygghet | Berettiget interesse | Kontoens levetid | Leverandør |
| Referanser | Egnethetsvurdering | Samtykke | 12 mnd etter kontroll | Bruker + referanse |
| HPR-status | Verifisere autorisasjon | Samtykke | Kontoens levetid | Helsepersonellregisteret |
| Utbetaling | Betaling | Avtale + rettslig plikt | Etter bokføringsregler | Betalingsleverandør |
| Oppdragshistorikk | Oppgjør, kvalitet, tvist | Avtale + berettiget interesse | Så lenge nødvendig | System |

**Behandles ikke:** fødselsnummer, diagnoser, journal, medisinlister, kontonummer i egen database.

### Registrerte som ikke er brukere

To grupper er registrerte uten å ha opprettet konto hos oss. De ble oversett i
første utkast, og er lagt til etter den juridiske gjennomgangen:

| Gruppe | Hva vi behandler | Grunnlag | Lagringstid | Plikt |
|---|---|---|---|---|
| Referansepersoner | Navn, telefon, relasjon, vurdering av søkeren | Berettiget interesse – egnethetsvurdering | 12 måneder | Informeres ved første kontakt |
| Avviste søkere | Søknadsopplysninger og avslagsgrunn | Berettiget interesse – hindre omgåelse | 6 måneder | Får begrunnelsen, kan klage |

For referansepersoner noterer vi en **vurdering, ikke et ordrett sitat**. Søkeren som
avvises har innsynsrett i begrunnelsen; et sitat ville røpet hvem som sa hva, og
satt oss mellom to personer som begge har innsynsrett.

### Den eldres opplysninger til pårørende

Familiepanelet er en løpende utlevering av opplysninger om én person til en annen.
Nivået settes av den eldre selv, og standardvalget er det mest lukkede:

| Nivå | Hva familien ser |
|---|---|
| Ingen (standard) | Ingenting |
| Bare beskjed | At oppdraget er utført, for det enkelte oppdraget hun velger |
| Underveis | Hvem som kommer, når hjelperen er på vei, og når hun kom |
| Full oversikt | I tillegg historikk, faste hjelpere og forbruk |

Familien ser aldri fritekstbeskrivelsen den eldre har skrevet. Betaler familien for
tjenesten, gir det ingen utvidet rett til innsyn.

## 2. Dataminimering i praksis

- Registreringsskjemaet skiller tydelig mellom nødvendige og frivillige felt.
- Fritekstfeltet for erfaring har eksplisitt instruks om ikke å skrive helseopplysninger,
  og maks 600 tegn for å begrense utilsiktet innhold.
- Posisjon avrundes til ca. 100 meter (tre desimaler) allerede i nettleseren – nok for matching,
  mindre inngripende enn eksakt punkt (`assets/js/registrering.js`).
- Fødselsnummer samles aldri inn; alder utledes av fødselsdato.
- Kontoopplysninger for utbetaling håndteres av betalingsleverandør.

## 3. Posisjonsmodellen

Regelen: **posisjon er en tilstand brukeren slår på, ikke en bakgrunnsprosess.**

```
Hjelper åpner appen
   └─ «Jeg er tilgjengelig» PÅ
        └─ Egen forespørsel: «Kan vi bruke posisjonen din for å vise oppdrag i nærheten?»
             ├─ [Tillat posisjon]  → posisjon brukes mens tilgjengelig
             └─ [Ikke nå]          → matching skjer på sted + postnummer
   └─ «Jeg er tilgjengelig» AV → all posisjonsbruk stopper umiddelbart
```

Under et aktivt oppdrag kan det innhentes eget, tidsbegrenset samtykke til posisjonsdeling
for selve oppdragsperioden.

Krav som er implementert i frontend allerede nå:

- Telefonnummer ≠ posisjonssamtykke. Egen tekst, eget valg, eget avslagsalternativ.
- Registrering kan fullføres uten posisjon.
- Avslag gir en nøytral melding («det er helt greit»), ikke en advarsel.
- Samtykket logges med tidspunkt slik at det kan dokumenteres.
- «Slett posisjonen» er like tilgjengelig som «Del posisjonen min».

## 4. Adressehåndtering

| Situasjon | Hva hjelperen ser |
|---|---|
| Oppdrag ikke tatt | Bydel + omtrentlig avstand, f.eks. «Frogner · 2,1 km» |
| Oppdrag tildelt | Gateadresse og eventuell etasje/portkode |
| Oppdrag fullført | Adressen skjules igjen i appen |

Oppslag i adressefelt logges. Adresser skal ikke bufres permanent på hjelperens enhet.

## 5. Særlige kategorier

Hjelperen får oppdragsbeskrivelse, ikke helseopplysninger:

- ✅ «Følge til sykehustime, 79 år, bruker rullator.»
- ❌ «Alzheimer, medisinliste, journalnotat.»

Familier kan likevel komme til å skrive helseopplysninger i fritekst. Tiltak:
minimert fritekst, tydelig veiledning i grensesnittet, og rutine for sletting på forespørsel.
Utvides tjenesten senere til å behandle helseopplysninger, kreves eget behandlingsgrunnlag og ny vurdering.

## 6. Samtykkehåndtering

Hvert samtykke lagres som et eget objekt med tidspunkt og versjon
(se `samtykker` i innsendingsobjektet i `assets/js/registrering.js`):

```json
{
  "vilkar":         { "gitt": true,  "versjon": "2026-01", "tidspunkt": "..." },
  "personvern":     { "gitt": true,  "versjon": "2026-01", "tidspunkt": "..." },
  "referansesjekk": { "gitt": true,  "tidspunkt": "..." },
  "posisjon":       { "gitt": false, "tidspunkt": null },
  "markedsforing":  { "gitt": false, "tidspunkt": "..." }
}
```

- Ingen forhåndsavkryssede samtykkebokser.
- Markedsføring er alltid frivillig og påvirker ikke oppdragstildeling.
- Tilbaketrekking skal være like enkelt som samtykke – ett klikk i personverninnstillingene.

## 7. Personverninnstillinger i profilen

Skal implementeres i backend-fasen:

- Se lagrede opplysninger
- Rette feil
- Laste ned egne data (art. 20)
- Slå av posisjonsdeling
- Trekke tilbake markedsføringssamtykke
- Be om sletting av konto

## 8. Informasjonskapsler

Tre atskilte formål: nødvendige (ingen samtykke), analyse (samtykke), markedsføring (samtykke).
Valget lagres i `pp_cookie_consent_v1` med tidspunkt og versjon. Ingen analyse- eller
markedsføringsskript lastes før samtykke foreligger (`assets/js/app.js`).
Markedsføringssamtykke kobles aldri til posisjonssamtykke.

## 9. Kladdelagring i nettleseren

Registreringsskjemaet lagrer kladd i `sessionStorage` (ikke `localStorage`), slik at
opplysningene forsvinner når fanen lukkes. Fødselsdato og engangskode lagres aldri i kladden,
og «Slett kladd» tømmer alt umiddelbart.

## 10. Databehandlere

Databehandleravtale kreves for hver av disse før produksjon:

| Leverandør | Formål | Krav |
|---|---|---|
| Leverandør av elektronisk ID-kontroll | Identitetsverifisering | Databehandleravtale, EU/EØS-lagring |
| Betalingsleverandør | Utbetaling, oppdragslommebok | PCI-DSS, egen behandlingsansvarlig for kontodata |
| SMS-leverandør | Engangskoder | Databehandleravtale |
| Sky-/driftsleverandør | Drift og lagring | EU/EØS, kryptering, tilgangskontroll |
| Kartleverandør | Avstandsberegning | Ingen videresending av identifiserbar posisjon |

## 11. Sikkerhet

- Kryptering under overføring og lagring
- Rollebasert tilgang; adressefelt og posisjon er egne tilgangsnivåer
- Logging av oppslag i sensitive felt
- Rutine for avviksvarsling innen 72 timer
- Tilgangsgjennomgang ved endring i roller

## 12. Rekkefølgen som gjelder

**DPIA først, deretter GPS-funksjonene i produksjon.** Se `docs/DPIA.md`.
