# Innlogging og backend

Skrevet da retningen ble satt: Supabase for autentisering, PostgreSQL for
applikasjonsdata. Dokumentet sier hva som allerede finnes, hva som må avgjøres,
og hva som ikke kan endres uten at produktet blir noe annet.

## 1. Det finnes allerede tre tilgangsmodeller, og de er forskjellige med vilje

Dette er ikke rot. Det er tre ulike mennesker med tre ulike behov.

| Hvem | Hvordan | Hvor |
|---|---|---|
| Kontoret (leverandøren) | E-post | `besok/logg-inn.html` |
| Hjelperen som søker | Telefon + engangskode | `registrering.js`, `PP_API.sendOtp/verifyOtp` |
| Arbeideren på oppdrag | Lenke med token per besøk, ingen konto | `besok-lager.js`, `hentMedToken()` |

Den tredje er den viktigste, og den er lett å ødelegge. **Arbeideren har ikke
en konto.** Hun får en lenke som gir tilgang til ett besøk, og lenken dør etter
tolv timer (`SLETTEPLAN` steg 1). Å gi henne en Supabase-bruker ville gjort
tilgangen varig i stedet for engangs, og gjort et oppdrag om til et forhold.

`api.js` har allerede endepunktene tegnet:

```js
sendOtp:   post('/auth/otp/send',   { telefon: telefon })
verifyOtp: post('/auth/otp/verify', { telefon: telefon, kode: kode })
```

Supabase støtter telefon-OTP. Formen passer.

## 2. Innloggingen har allerede et behandlingsgrunnlag

```
felt:     innlogging
formål:   Oppdage misbruk
grunnlag: interesse
frist:    sikkerhet
```

Det betyr at innloggingslogg er berettiget interesse, ikke samtykke, og at den
har en egen frist. Legger backend til flere felter om innlogging – IP, enhet,
nettleser – må hvert av dem inn i `PP_VERN.LAGRES` med grunnlag og frist. En
test holder den regelen.

## 3. Tre avgjørelser

### 3.1 Én database eller to

Formuleringen «Supabase for auth, PostgreSQL for data» kan leses som to
databaser. **Anbefaling: én.** Supabases egen Postgres.

Grunnen er at hele verdien av Supabase her er Row Level Security. RLS-policyer
skriver `auth.uid()` rett inn i `WHERE`-setningen. Ligger dataene i en annen
database, kan ikke policyen se brukeren, og Supabase blir redusert til en
utsteder av tokens. Da har vi tatt på oss en leverandør uten å få håndhevingen
som var poenget.

Skal det likevel være to, må tilgangskontrollen skrives for hånd i et
API-lag, og da er det laget som er sikkerheten – ikke databasen.

### 3.2 Hvor personvernsperra kjører

**Dette er ikke et valg. `PP_VERN.sjekk()` må kjøre på server.**

I dag er den hele garantien, og den kjører i nettleseren. Det holder så lenge
det ikke finnes noe endepunkt å sende til. I det Supabase står der, kan hvem
som helst sende en rad forbi skjermbildet. En sperre som bare finnes i
frontend er en anbefaling, ikke en sperre.

Konkret: reglene i `besok-vern.js` må finnes som en `BEFORE INSERT`-trigger
eller i en RPC som er den eneste veien inn. Frontend beholder sin sjekk, fordi
den gir brukeren beskjeden med én gang – men den er ikke lenger det som holder.

### 3.3 Hvordan sletting skjer

Dagens modell er ikke sletting av rader. Det er **fire trinn der felter faller
bort**, og den kjører ved hver lesning:

```
12 timer  token
 7 dager  notat, rapport.kommentar
30 dager  kunde, parorendeEpost, ansattNavn
 1 år     resten; dato grovnes til måned
```

CLAUDE.md avviser nattjobben eksplisitt: «En sletterutine som ikke kjører, er
ikke en sletterutine; den er en setning i en personvernerklæring.»

Tre veier i Postgres:

| | Hva | Vurdering |
|---|---|---|
| a | View som krymper ved lesning | Et view kan ikke skrive. Krympingen blir bare visuell, og rådataene blir liggende |
| b | `pg_cron` | Presis det CLAUDE.md avviser. Kan stanse uten at noen merker det |
| c | RPC som krymper og deretter leser | Direkte oversettelse av dagens modell |

**Anbefaling: (c).** All lesning går gjennom én funksjon som først kjører
`UPDATE`-en for de radene som har passert et trinn, og så returnerer. Samme
garanti som i dag: leser noen, er sletting kjørt.

Legg en overvåkingsspørring ved siden av – «finnes det rader forbi et trinn
som ikke er krympet» – som backstop. Hvis den noen gang returnerer noe, er
lesningen omgått.

### 3.4 BankID og Vipps: hvor identitet hører hjemme, og hvor den ikke gjør det

Spørsmålet «skal de logge inn med BankID?» har fire ulike svar, fordi det er
fire ulike mennesker:

| Hvem | Daglig innlogging | Identitetskontroll (én gang) |
|---|---|---|
| Den eldre | **Ingen.** Godkjenningsskjermen nås via lenke; ingen konto | Ingen – familien eller leverandøren står for relasjonen |
| Familien | Vipps Login, med e-post som reserve | Ligger i Vipps: verifisert navn og telefon følger med |
| Hjelperen som søker | Telefon + engangskode (som i dag) | BankID via Vipps Login ved registrering |
| Arbeideren på oppdrag | **Ingen konto.** Lenke per besøk, 12 timer | Arbeidsgiveren har gjort den – det er ansettelsens jobb |

To regler er ikke til forhandling:

**Den eldre skal aldri møte BankID som krav.** Mange over 80 har ikke BankID
på egen enhet, og de som har, strever. En innlogging den eldre ikke klarer,
flytter i praksis kontoen til familien uten at noen har bestemt det. Dagens
design – godkjenning via lenke, uten konto – står.

**Verifiseringsresultatet lagres, ikke identiteten.** BankID-kontroll gir
fødselsnummer. Datamodellen har ikke feltet, og skal ikke få det
(`PP_VERN.LAGRES`). Det som lagres er `identitet_bekreftet: ja/nei` pluss
navnet – samme mønster som resten av produktet: minst mulig, med grunnlag.

Vipps foran rå BankID OIDC fordi familie og hjelpere alt har appen, fordi
Vipps Login bygger på BankID under panseret, og fordi integrasjonen er
lettere å bytte ut. I piloten (`DEMO = true`) er dette en konfigurasjon,
ikke kode.

Grensen mot den røde kategorien er skarp og må holdes skarp: **vår** bruk av
BankID til å verifisere en hjelpers identitet er innlogging. **Den eldres**
BankID, PIN og koder er penger – de rører aldri produktet, uansett modell
(`docs/JURIDISK-GRENSE.md`).

## 4. Det som ikke kan endres

- Ingen felter for etternavn, adresse, fødselsdato eller helseopplysninger.
  Kolonnen som ikke finnes, kan ikke fylles ut i en travel situasjon
- Arbeideren får ikke konto. Token per besøk, tolv timer
- Nytt felt går inn i `PP_VERN.LAGRES` med grunnlag og frist, i samme endring
- Supabase blir underleverandør. Naviar er databehandler, leverandøren er
  behandlingsansvarlig. Det krever databehandleravtale nedover og region i EU.
  `docs/DPIA.md` og `docs/GDPR.md` må oppdateres før første ekte bruker

## 5. Åpent

`DEMO = true` står til alle tre avgjørelsene er tatt. Adapterlaget er der
nettopp for at bytte skal koste én linje, ikke en omskriving.
