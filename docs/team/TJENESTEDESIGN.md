# Gap-analyse før pilot

> **Skrevet for markedsplassmodellen.** Deler av dette gjelder fortsatt, men
> dokumentet forutsetter at Naviar rekrutterer og verifiserer hjelpere og formidler
> betaling. Det gjør vi ikke lenger. Grensen for hva som gjelder nå står i
> `docs/JURIDISK-GRENSE.md`.

Tjenestedesign · vurdering av tjenesten slik den står i repoet i dag.

Tjenestemodellen selv ligger i [`docs/SERVICE-BLUEPRINT.md`](../SERVICE-BLUEPRINT.md).
Den gjentas ikke her. Dette dokumentet gjør én ting: går gjennom de fire
brukergruppenes reise, markerer punktene der reisen **stopper** fordi noe ikke er
bygget, og sorterer hullene etter når de må lukkes.

## Nåsituasjonen i én setning

Fase 1 har levert en fullstendig og gjennomarbeidet *beskrivelse* av tjenesten,
med ekte logikk i tre av delene – prismodellen, matchingmotoren og
registreringsskjemaet. Alt annet er statisk demo: `assets/js/api.js` står i
`DEMO = true`, har tre endepunkter (OTP send, OTP verify, hjelperregistrering),
og ingen av dem lagrer noe. Det finnes ingen backend, ingen innlogging, ingen
konto for eldre eller pårørende, og ingen endepunkt for et oppdrag.

Konsekvensen for en gap-analyse: hullene er ikke småfeil i en fungerende tjeneste.
De er **hele systemer** som mangler mellom flater som allerede er tegnet ferdig.
Det gjør risikoen større enn den ser ut, fordi flatene lover ting som ikke finnes
bak dem.

---

## 1. De fire reisene og der de brytes

Legenden er den samme i alle fire tabellene:

| Symbol | Betydning |
|---|---|
| ✅ | Fungerer i dag, mot demodata |
| ⚠️ | Delvis – flaten finnes, innholdet er hardkodet |
| 🛑 | **Brudd** – brukeren kommer ikke videre uten noe som ikke er bygget |

### 1.1 Den eldre – `trenger-hjelp.html`

| # | Steg | Status | Hva som faktisk skjer |
|---|---|---|---|
| 1 | Finner tjenesten på forsiden | ✅ | Tre tydelige innganger |
| 2 | Velger når: nå / i dag / tidspunkt / fast | ✅ | Fungerer, styrer hastetillegg |
| 3 | Velger hva, eller sier det med stemmen | ✅ | Taleinput tolkes til kategori |
| 3b | Akuttfilter | ⚠️ | Sjekker kun fritekst og tale, ikke ikonvalgene. Brukeren kan trykke «Det er ikke akutt» og slå filteret av for resten av økten |
| 4 | Varighet, språk, fast hjelper | ✅ | |
| 5 | Ser prisen linje for linje | ✅ | Ekte beregning i `pris.js` |
| 6 | **Trykker «Bestill hjelp»** | 🛑 | Ingen har spurt hvem hun er, hvor hun bor eller hvordan hun skal betale. Ingen konto, ingen adresse, ingen kort. Ingenting sendes noe sted |
| 7 | «Vi leter etter en hjelper» | 🛑 | Fire `setTimeout`-steg i `bestilling.js`. Ingen matching kjøres. Sofia H. er hardkodet i HTML |
| 8 | «Jeg vil ha en annen» | 🛑 | Kjører samme animasjon og viser Sofia igjen |
| 9 | Oppmøtekode 4821 | 🛑 | Skrevet i HTML. Ingen kode genereres per oppdrag |
| 10 | Bekrefter at oppdraget er utført | 🛑 | Flaten finnes ikke. Blueprintens ledd «eldre eller pårørende bekrefter → betaling frigis» har ingen implementasjon |
| 11 | Ringer 400 00 000 i stedet | 🛑 | Plassholdernummer. Driftskonsollen har ingen skjerm for å opprette oppdrag på telefon |
| 12 | Trykker SOS | 🛑 | Knappen finnes ikke på noen flate, men er lovet i `trygghet.html` |

**Kortversjon:** den eldre kommer helt frem til prisen. Deretter er reisen en film.

### 1.2 Den pårørende – `familie.html`

| # | Steg | Status | Hva som faktisk skjer |
|---|---|---|---|
| 1 | Åpner pårørendesiden | 🛑 | Siden er en salgsside med overskriften «Slik ser oversikten ut · Eksempel på pårørendepanelet». Det er ingen innlogging og intet panel |
| 2 | Knytter seg til mor | 🛑 | Det finnes ingen relasjonsmodell mellom pårørende og eldre, og ingen mekanisme for at den eldre samtykker til innsynet |
| 3 | Ser status, Care Circle, historikk | ⚠️ | Maria, Sofia, Daniel, Lena, «6 oppdrag · 9 t 20 min · 2 480 kr» er hardkodet HTML |
| 4 | «Opprett oppdrag» / «Bestill på Marias vegne» | 🛑 | Lenker til `trenger-hjelp.html`, som er seniorflyten. Det finnes ingen «på vegne av»-flyt: ingen valg av hvem oppdraget gjelder, ingen adresse, ingen kontaktinfo til den eldre |
| 5 | Får varsel når hjelperen kommer | 🛑 | I seniorflyten er dette en avkrysningsboks uten mottakerfelt. Ingen SMS-, e-post- eller push-kanal finnes i repoet |
| 6 | Får kvittering med notat og beløp | 🛑 | «417 kr» og notatteksten er statisk markup |
| 7 | «Hvis noe ikke stemmer – ett trykk» | 🛑 | `href="#"`. Det finnes ingen vei fra en familie inn i driftens hendelseskø |

**Kortversjon:** den pårørende kommer ikke inn i tjenesten i det hele tatt. Dette er
den gruppen som i praksis betaler, og reisen hennes brytes på steg 1.

### 1.3 Hjelperen – `bli-hjelper.html` og `oppdrag.html`

| # | Steg | Status | Hva som faktisk skjer |
|---|---|---|---|
| 1 | Registrering i seks steg | ✅ | Reell validering, kladd i `sessionStorage`, atskilte samtykker |
| 2 | Bekrefter mobil med SMS-kode | ⚠️ | Demomodus: koden returneres til nettleseren. Ingen SMS-leverandør |
| 3 | Godtar brukervilkårene | 🛑 | Avkrysningen er obligatorisk, men vilkårsdokumentet finnes ikke i repoet og lenkes ikke fra noe sted |
| 4 | Sender inn | 🛑 | `registrerHjelper` i demomodus returnerer et referansenummer og kaster søknaden. Ingen søknad når driften |
| 5 | «Du får e-post med lenke til ID-kontroll» | 🛑 | Ingen e-post sendes. Ingen ID-leverandør er koblet på |
| 6 | Referansene ringes | 🛑 | Ingen sak opprettes, ingen kø, ingen samtaleskjema |
| 7 | Tar sikkerhetskurset og testen | 🛑 | Kurset finnes ikke. Det er et absolutt krav før første oppdrag |
| 8 | Logger inn på oppdragstavla | 🛑 | Ingen innlogging. `oppdrag.html` sier «Du er logget inn som Sofia H.» Det er ingen vei fra fullført registrering hit |
| 9 | Slår på «Jeg er tilgjengelig» | ✅ | Bryteren styrer posisjonsbruk som lovet. Godt bygget |
| 10 | Ser rangerte oppdrag med begrunnelse | ✅ | `matching.js` er ekte logikk mot demodata, inkludert avviste oppdrag med forklaring |
| 11 | «Endre tilgjengelighet og oppdragstyper» | 🛑 | `href="#"`. Ingen profilside |
| 12 | Sjekker inn med kode | ⚠️ | Koden er 4821 for alle. Områdekontrollen som `trygghet.html` lover, er ikke implementert |
| 13 | Ber om manuell gjennomgang av en avvisning | 🛑 | Teksten inviterer til det. Ingen kanal finnes |
| 14 | **Får betalt** | 🛑 | Ingen betalingsleverandør, ingen utbetalingskonto, ingen oppgjør |
| 15 | Er forsikret under oppdraget | 🛑 | 18 % serviceavgift er beskrevet som dekning for blant annet forsikring. Ordningen finnes ikke (ROADMAP fase 6) |

**Kortversjon:** hjelperen kommer gjennom registreringen, og deretter er det stille.
Verifiseringskjeden mellom søknad og oppdrag er beskrevet i tre dokumenter og bygget
i null av dem.

### 1.4 Driftsorganisasjonen – `drift.html`

| # | Steg | Status | Hva som faktisk skjer |
|---|---|---|---|
| 1 | Logger inn med sin rolle | 🛑 | «Innlogget: Kari D. · rolle: saksbehandler · demodata». Ingen autentisering, ingen tilgangsstyring |
| 2 | Ser hendelseskøen | ⚠️ | Fire faner, alvorsgrader, svarfrister og handlingslogg er godt bygget – mot `driftdata.js` |
| 3 | Får P1 innen 15 minutter, døgnet rundt | 🛑 | Konsollen er en nettside noen må se på. Ingen alarmering, ingen vaktordning, ingen bemanningsplan |
| 4 | Fanger opp uteblitt innsjekk etter 10 min | 🛑 | DRIFT.md punkt 6 forutsetter en overvåkingsjobb i backend. Den finnes ikke |
| 5 | Behandler en søknad | ⚠️ | Sjekklisten sperrer godkjenning korrekt, men det kommer aldri en ekte søknad inn |
| 6 | Gjennomfører referansesamtale | 🛑 | Spørsmålslisten står i DRIFT.md, ikke i verktøyet. Ingen skjema for å dokumentere svar |
| 7 | Oppretter oppdrag for en som ringer | 🛑 | Ingen skjerm. Telefonkanalen er beskrevet som likeverdig, men er ikke bygget |
| 8 | Behandler innsyns- eller slettekrav | 🛑 | Ingen kø for rettighetskrav i konsollen, og ingen selvbetjent personvernside i profilen |
| 9 | Fryser en konto | ⚠️ | Knappen finnes og logges – på en demosak |

**Kortversjon:** driften har et pent verktøy uten data, uten roller, uten
inngangskanaler og uten mennesker på vakt.

---

## 2. Hullene

Kolonnen «Test» viser hvilke(n) av de sju spørsmålene i
[`docs/SERVICE-BLUEPRINT.md`](../SERVICE-BLUEPRINT.md) hullet bryter:
1 enkelt · 2 rimelig for hjelperen · 3 trygt for den eldre · 4 drift ·
5 GDPR og regelverk · 6 inntjening · 7 skalering.

### G1 · Ingen konto og ingen identitet på kundesiden

| | |
|---|---|
| **Rammer** | Den eldre, den pårørende, driften |
| **I dag** | Ingen innlogging finnes for eldre eller pårørende. Ingen bruker kan gjenkjennes fra ett besøk til det neste |
| **Må finnes** | Konto med lavterskel innlogging (kode på SMS er sannsynligvis riktigst for målgruppen), økt, og en profil som holder adresse, kontaktinfo og betalingsmiddel |
| **Test** | 1, 4, 5, 7 |

### G2 · Bestillingen har ingen mottaker

| | |
|---|---|
| **Rammer** | Den eldre, hjelperen, driften |
| **I dag** | Flyten spør når, hva, hvor lenge og språk – aldri hvem oppdraget gjelder, hvor det skal utføres, eller hvem som kan nås underveis |
| **Må finnes** | Strukturerte felt for mottaker, adresse med bydel, etasje/portkode, kontakttelefon og eventuell pårørende som skal varsles. Adressen lagres bak adressetjenesten beskrevet i `docs/GDPR.md` punkt 4, ikke i oppdragslisten |
| **Test** | 1, 3, 4 |

### G3 · Oppdraget opprettes ikke – matchingen er en animasjon

| | |
|---|---|
| **Rammer** | Alle fire |
| **I dag** | `bestilling.js` viser fire tekstlinjer med `setTimeout` og hopper til et hardkodet hjelperkort. `api.js` har ikke engang et endepunkt for oppdrag |
| **Må finnes** | `POST /api/v1/oppdrag`, oppdragsobjekt i database, og at `matching.js` – som allerede er skrevet og testet – kjøres mot ekte hjelpere med tilbudsbølger: fast hjelper → Care Circle → verifiserte i nærheten |
| **Test** | 1, 4, 6, 7 |

### G4 · Ingen penger beveger seg

| | |
|---|---|
| **Rammer** | Hjelperen, den eldre, selskapet |
| **I dag** | Prisen beregnes riktig og vises. Så er det slutt. Ingen kortregistrering, ingen reservasjon når hjelperen takker ja, ingen trekk etter bekreftelse, ingen utbetaling, ingen 18 % inn til plattformen |
| **Må finnes** | Betalingsleverandør med reservasjon og utbetaling til hjelper, utbetalingsonboarding, kvittering, tvistehåndtering og 48-timers automatisk frigivelse som DRIFT.md punkt 7 lover |
| **Test** | 2, 3, 6, 7 |

### G5 · Pårørendepanelet er en illustrasjon

| | |
|---|---|
| **Rammer** | Den pårørende – gruppen som i praksis betaler |
| **I dag** | `familie.html` er en statisk side med Maria og Sofia skrevet inn i markupen. Ingen relasjon mellom pårørende og eldre eksisterer i datamodellen |
| **Må finnes** | Ekte panel med status, historikk og Care Circle **og** en relasjonsmodell der den eldre gir og kan trekke tilbake innsyn. Uten samtykket er innsynet i mors oppdragshistorikk og oppdragsnotater uten behandlingsgrunnlag |
| **Test** | 1, 3, 5, 6 |

### G6 · Ingen varslingskanal

| | |
|---|---|
| **Rammer** | Den pårørende, den eldre, hjelperen, driften |
| **I dag** | «Anne (datter) får melding når hjelperen er på vei» er en avkrysningsboks. Ingen SMS-, e-post- eller push-integrasjon finnes noe sted i repoet |
| **Må finnes** | Én varslingstjeneste med maler per hendelse og per mottakertype, som holder blueprintens prinsipp «samme hendelse, ulik mengde informasjon»: den eldre får «Sofia er på vei», den pårørende får tid, varighet og beløp |
| **Test** | 1, 3, 4 |

### G7 · Ingen bekreftelse av utført oppdrag

| | |
|---|---|
| **Rammer** | Hjelperen først, deretter den eldre |
| **I dag** | Hjelperen kan sjekke ut i `tavle.js`. Ingen flate lar den eldre eller pårørende bekrefte. Kjeden utsjekk → bekreftelse → utbetaling har et manglende ledd i midten |
| **Må finnes** | Bekreftelsesflate for begge, og den automatiske frigivelsen etter 48 timer så hjelperen ikke bærer kostnaden av at noen glemmer å trykke |
| **Test** | 2, 4, 6 |

### G8 · Verifiseringskjeden er beskrevet, ikke bygget

| | |
|---|---|
| **Rammer** | Den eldre og den pårørende – de bærer risikoen |
| **I dag** | Elektronisk ID-kontroll, selfie-match, to referansesamtaler, sikkerhetskurs med 85 %-krav og HPR-oppslag finnes som tekst i `trygghet.html`, `DRIFT.md` og ROADMAP fase 3. Ingen av delene er implementert eller har en leverandør |
| **Må finnes** | Avtale og integrasjon med eID-leverandør, referansesamtaleskjema i driftskonsollen med de fem faste spørsmålene, kursplattform med test og bestått-sperre, HPR-oppslag. Godkjenning må være teknisk sperret til alle seks steg er grønne |
| **Test** | 3, 4, 5 |

### G9 · Ingen vei fra godkjent søknad til oppdragstavla

| | |
|---|---|
| **Rammer** | Hjelperen, veksten i tjenesten |
| **I dag** | Registreringen ender i en kvittering. `oppdrag.html` er en demo av Sofia. Det finnes ingen innlogging, ingen profil, og lenken «Endre tilgjengelighet og oppdragstyper» går til `#` |
| **Må finnes** | Hjelperinnlogging, profil der tilgjengelighet, maks avstand, oppdragstyper og transportform kan endres, og statusvisning gjennom verifiseringen: hvor i køen er jeg, hva mangler, når hører jeg noe |
| **Test** | 1, 2, 7 |

### G10 · «Rapporter problem» og SOS finnes ikke

| | |
|---|---|
| **Rammer** | Den eldre, den pårørende, hjelperen, driften |
| **I dag** | `trygghet.html` lover SOS-knapp for både hjelper og familie, og «ett klikk» for uteblitt oppmøte, oppførsel, betaling, savnede gjenstander og personvernbrudd. Begge er `href="#"` eller mangler helt. Driftskonsollens hendelseskø har ingen inngang fra brukere |
| **Må finnes** | SOS på oppdragsflaten hos begge parter, rapporteringsskjema med kategorier som mapper direkte til P1–P3, og en kanal som faktisk oppretter en sak med riktig alvorsgrad |
| **Test** | 3, 4, 5 |

### G11 · Ingen oppdragsovervåking og ingen vaktordning

| | |
|---|---|
| **Rammer** | Den eldre under et pågående oppdrag, driften |
| **I dag** | DRIFT.md punkt 6 lover automatisk P2 ved uteblitt innsjekk etter 10 minutter, manglende utsjekk etter 30 og kraftig overtid – og P1 innen 15 minutter, døgnet rundt. Alt dette forutsetter en jobb i backend og et menneske på vakt. Ingen av delene finnes |
| **Må finnes** | Overvåkingsjobb som lager saker av seg selv, alarmering ut av konsollen (SMS/telefonoppringning til vakthavende), og en dokumentert vaktplan med navn på personer for hele pilotperioden |
| **Test** | 3, 4, 7 |

### G12 · Telefonkanalen er ikke bygget

| | |
|---|---|
| **Rammer** | Den eldre som ikke vil bruke skjerm – en betydelig del av målgruppen |
| **I dag** | `trenger-hjelp.html` viser «Ring oss: 400 00 000». Nummeret er en plassholder, og driftskonsollen har ingen skjerm der kundestøtte kan opprette et oppdrag |
| **Må finnes** | Ekte nummer med bemannet åpningstid, og en operatørflate som oppretter oppdraget i samme system med samme akuttfilter og samme prisvisning som selvbetjeningen |
| **Test** | 1, 4, 6 |

### G13 · Personvernrettighetene er lovet uten flate

| | |
|---|---|
| **Rammer** | Alle registrerte, personvernansvarlig |
| **I dag** | `personvern.html` punkt 7 og DRIFT.md punkt 9 lover innsyn, retting, nedlasting, sletting og selvbetjent tilbaketrekking av samtykke «under Personvern i profilen din». Det finnes ingen profil. Driftskonsollen har ingen kø for rettighetskrav. DPIA er merket «utkast» |
| **Må finnes** | Personvernside i profilen med de seks handlingene, en femte kø i driftskonsollen for rettighetskrav med 30-dagersfrist, og ferdigstilt DPIA. ROADMAPs rekkefølgekrav 1 sier DPIA før posisjonsfunksjoner i drift – og posisjon er kjernen i matchingen |
| **Test** | 5, 4 |

### G14 · Brukervilkår og forsikring: to løfter uten innhold

| | |
|---|---|
| **Rammer** | Hjelperen, selskapet |
| **I dag** | Hjelperen må krysse av «Jeg godtar brukervilkårene» for å sende inn søknaden. Vilkårsdokumentet finnes ikke i repoet og lenkes ikke fra noe sted. Samtidig beskrives 18 % serviceavgift som dekning for blant annet forsikring, uten at noen forsikringsordning er tegnet |
| **Må finnes** | Brukervilkår som eget dokument, lenket fra avkrysningen, med avklart arbeidsrettslig status for hjelperen. Forsikringsavtale på plass før avgiften kreves inn – eller at forsikring tas ut av beskrivelsen til den finnes |
| **Test** | 2, 5, 6 |

### G15 · Oppmøtekode og områdekontroll er ikke ekte

| | |
|---|---|
| **Rammer** | Den eldre |
| **I dag** | Koden 4821 står i HTML på både bestillings- og tavlesiden. `trygghet.html` lover at «systemet kontrollerer at hjelperen faktisk er i riktig område» – `tavle.js` sammenligner bare tegn i et tekstfelt |
| **Må finnes** | Kode generert per oppdrag, levert til den eldre gjennom en annen kanal enn hjelperen, med utløpstid, og faktisk avstandskontroll mellom hjelperens posisjon og oppdragsstedet ved innsjekk |
| **Test** | 3, 5 |

### G16 · Akuttfilteret dekker for lite og kan slås av

| | |
|---|---|
| **Rammer** | Den eldre |
| **I dag** | Filteret leser kun fritekstfeltet og taleinput, mot en fast ordliste. Trykker brukeren «Det er ikke akutt – fortsett bestillingen», settes `nodOverstyrt = true` for resten av økten, og filteret er avslått også for senere tekst |
| **Må finnes** | Kontroll ved hvert innsendingspunkt, ikke bare ved fritekst; ny vurdering ved ny tekst selv etter overstyring; og – når telefonkanalen kommer – samme kontroll i operatørflaten. ROADMAPs rekkefølgekrav 4 sier at filteret aldri skal kunne omgås av en oppdragsmal |
| **Test** | 3, 5 |

---

## 3. Prioritering

### Bolk A – må finnes før første ekte oppdrag

Kriteriet: uten dette sendes et menneske hjem til et annet menneske uten at noen
vet hvem, uten at noen følger med, og uten at noen kan gjøre opp.

| Hull | Hvorfor det ikke kan vente |
|---|---|
| G8 Verifiseringskjeden | ROADMAP rekkefølgekrav 2. Hele tillitsløftet står på denne |
| G11 Overvåking og vaktordning | Uten dette er «P1 innen 15 minutter» en tekst, ikke en tjeneste |
| G4 Betaling | Uten plattformbetaling oppstår kontantoppgjør – nøyaktig risikoen R5 er bygget for å hindre |
| G10 SOS og rapporter problem | En bruker som opplever noe galt, må ha en vei inn |
| G2 Mottaker og adresse på oppdraget | Hjelperen kan ikke møte opp et sted som ikke er oppgitt |
| G3 Oppdraget opprettes og matches | Uten dette finnes ikke oppdraget |
| G1 Konto og identitet | Forutsetning for G2, G4, G5 og G13 |
| G15 Ekte oppmøtekode og områdekontroll | Innsjekken er selve beviset på at riktig person er på riktig sted |
| G16 Akuttfilter uten omgåelse | Ett tilfelle er ett for mye |
| G14 Brukervilkår og forsikring | Ingen skal ta et oppdrag på vilkår som ikke finnes |
| G13 DPIA ferdigstilt | Rekkefølgekrav 1: DPIA før posisjon i drift |

### Bolk B – må finnes før 100 familier

Kriteriet: dette fungerer manuelt for de første ti, og bryter sammen på nummer
førti.

| Hull | Hvorfor akkurat her |
|---|---|
| G5 Ekte pårørendepanel med relasjonssamtykke | Ti familier kan følges opp på telefon. Hundre kan ikke |
| G6 Varslingskanal | Manuell melding per oppdrag skalerer ikke, og er den viktigste kilden til trygghetsfølelse |
| G7 Bekreftelse av utført oppdrag | Kan gjøres manuelt i starten, men blokkerer oppgjøret ved volum |
| G9 Hjelperinnlogging og profil | Uten selvbetjent profil håndterer driften hver eneste endring av tilgjengelighet |
| G12 Telefonkanal med operatørflate | Bemannet nummer må på plass tidlig; operatørflaten tåler å komme rett etter |
| G13 Selvbetjent personvernside og rettighetskø | Ett innsynskrav kan behandles i e-post. Ti kan ikke, og fristen er 30 dager |
| Roller og tilgangsstyring i driftskonsollen | Med én saksbehandler holder tillit. Med fem holder den ikke |
| Referansesamtaleskjema i verktøyet | Struktur og dokumentasjon må inn før volumet i søknadskøen øker |

### Bolk C – kan vente

| Hull | Begrunnelse |
|---|---|
| Care Circle som funksjon, ikke visning | Krever oppdragshistorikk som først oppstår etter drift |
| Tillitsscore beregnet fra ekte data | Alle hjelpere er på nivå 1 i piloten. Vektene kan vente, men innsigelsesretten må være beskrevet fra dag én |
| Oppdragskart med bydel og omtrentlig avstand | Listevisningen i `oppdrag.html` er tilstrekkelig i én by |
| Fast avtale som gjentakende oppdrag | Kan kjøres som gjentatte enkeltoppdrag i piloten |
| Landlag for SE og DE | `pris.js` har allerede satsene. Resten hører til fase 7 |
| Utvidet språkstøtte i grensesnittet | Språkmatching mellom hjelper og familie er viktigere enn oversatt UI i pilotbyen |
| Beløpsbegrenset oppdragslommebok | Kan erstattes av regelen «handlingsoppdrag med kvittering og etterskuddsvis oppgjør» så lenge volumet er lite – men da må regelen stå i vilkårene |

---

## 4. De tre farligste hullene

### 1. G8 – verifiseringskjeden er beskrevet, ikke bygget

Dette er det farligste fordi det er det eneste hullet brukeren ikke kan se.
`trygghet.html` sier «Ingen sendes hjem til familien din uten å være verifisert –
med ID-kontroll, referansesjekk, opplæring og dokumentert oppdragshistorikk».
Registreringsflyten er ferdig og virker overbevisende. En pilot som starter nå,
ville formidlet oppdrag på grunnlag av et skjema noen har fylt ut om seg selv.

Avstanden mellom løftet og virkeligheten er hele tjenestens verdi. Går det galt
én gang, er det ikke en feil i en funksjon – det er et løftebrudd overfor
nøyaktig den gruppen tjenesten er bygget for å beskytte. Bryter test 3 og 5.

### 2. G11 – ingen ser at noe går galt mens det går galt

Driftsdokumentet er det mest gjennomarbeidede i repoet: fire alvorsgrader,
faste frister, eskaleringsstige, «frys først, utred etterpå». Konsollen speiler
det pent. Men den er en nettside noen må velge å se på, uten data, uten
alarmering og uten navngitte personer på vakt.

Det farlige er kombinasjonen: hjelpere kan være ute på oppdrag før noen har
laget en vaktplan, fordi flatene får det til å se ut som driften finnes. Sammen
med G10 – SOS-knappen som ikke er koblet til noe – betyr det at det verste
tidsvinduet i hele tjenesten, de 90 minuttene en fremmed er alene hjemme hos en
eldre, er helt uten oppsyn. Bryter test 3, 4 og 7.

### 3. G4 – ingen penger beveger seg, og det presser frem kontanter

Prismodellen er ferdig og korrekt. Alt etter prisvisningen mangler: reservasjon,
trekk, utbetaling, provisjon. I en pilot uten betalingsflyt gjør folk det
naturlige – de gjør opp seg imellom. Da er hele pengeregelverket i `trygghet.html`
punkt 6 satt ut av spill, det som er tjenestens sterkeste enkeltbeskyttelse mot
økonomisk utnyttelse av eldre (DPIA R5).

Samtidig fjerner det hjelperens grunn til å bli: en hjelper som ikke vet når
pengene kommer, tar ikke oppdrag nummer to. Og selskapet får ikke inn en eneste
krone av de 18 prosentene. Bryter test 2, 3, 6 og 7.

**Fellesnevneren for de tre:** ingen av dem er et designproblem. De er tre steder
der en ferdig beskrivelse har blitt forvekslet med en ferdig tjeneste. Rekkefølgen
er gitt av risiko: verifisering før døra åpnes, oppsyn mens den står åpen, og
oppgjør etterpå.
