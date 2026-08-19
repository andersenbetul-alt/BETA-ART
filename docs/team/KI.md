# KI-veikart for PårørendePilot

Eier: KI-ansvarlig (`.claude/agents/ai.md`). Status: arbeidsdokument, ikke besluttet plan.

Dette dokumentet svarer på ett spørsmål: **hvor gjør en modell tjenesten tryggere, og
hva må følge med for at den ikke gjør den farligere?** Rekkefølgen er bevisst: først en
ærlig gjennomgang av det regelbaserte som står i koden i dag, deretter hva KI kan overta,
og til slutt hva KI ikke skal røre.

Alle eksemplene under er kjørt mot koden i `assets/js/`, ikke antatt. Utdataene er
gjengitt som de kom.

> **Rammen som gjelder gjennom hele dokumentet.** En modell kan flagge, aldri stenge.
> Akuttgjenkjenning skal feile mot sikkerhet. Forklarbarhet før presisjon. Ingen
> helseopplysninger inn i modeller uten eget behandlingsgrunnlag. Ingen trening på
> oppdragsdata uten at det er vurdert og opplyst. Menneskelig overprøving for hver
> automatiske avgjørelse som påvirker noens inntekt.

---

## 1. Hvor dagens regelbaserte løsninger svikter

Alle tre løsningene er bevisste valg for pilotfasen, og alle tre er bedre enn en
uforklarlig modell. Men de svikter, og de svikter forutsigbart. Det er verdt å
skrive ned nøyaktig hvordan, fordi det er den listen som avgjør hva KI faktisk skal løse.

### 1.1 Matchingvektene (`assets/js/matching.js`)

Vektene summerer til 100, hvert utfall har en begrunnelse, og hvert sperret oppdrag
har en grunn. Det er riktig bygget. Problemene ligger i vektenes *form*, ikke i at de
er regelbaserte.

**A. Nærhetsscoren måler ikke nærhet, den måler nærhet i forhold til hjelperens egen grense.**

```js
naerhetsScore(avstandKm, maksKm) => 1 - (avstandKm / maksKm)
```

Fire hjelpere som står **nøyaktig like langt unna** samme oppdrag (2,0 km), som bare
skiller seg på hva de har satt som maksavstand:

| `maksAvstandKm` | Nærhetsdel | Poeng av 25 | Totalscore |
|---|---|---|---|
| 3 km | 0,33 | 8,3 | **55** |
| 5 km | 0,60 | 15,0 | 62 |
| 10 km | 0,80 | 20,0 | 67 |
| 20 km | 0,90 | 22,5 | **69** |

14 poeng forskjell på identisk avstand. Hjelperen som ikke har bil og derfor setter
3 km, blir straffet for å ha satt en ærlig grense. Den som setter 20 km «for sikkerhets
skyld», får en bonus på alle oppdrag i nærheten. Dette er en insentivfeil: den lærer
hjelpere å oppgi feil preferanser. Nærhet bør måles mot en tjenestefast skala
(f.eks. reisetid i minutter), og hjelperens maksavstand bør forbli det den er ment
å være — et absolutt krav, som den allerede er i `KRAV`.

**B. Kaldstart: 55 av 100 poeng er historikk.**

`relasjon` (25) + `tillit` (20) + `punktlighet` (10) = 55 poeng som en ny, verifisert
hjelper ikke kan ha. Målt:

| Hjelper | Avstand | Tidligere oppdrag | Score |
|---|---|---|---|
| Etablert | 4,5 km | 17 | **75** |
| Ny, verifisert | 0,3 km | 0 | 66 |

Hjelperen som bor i samme kvartal taper mot en som er femten ganger lenger unna.
For familien betyr det lengre ventetid; for den nye hjelperen betyr det at
prøveperioden blir vanskelig å komme ut av, fordi man trenger oppdrag for å få
oppdrag. Legg merke til at dagens test *«tidligere relasjon slår kortere avstand»*
låser denne oppførselen som et løfte. Den bør omformuleres til å beskrive hvor stor
avstandsforskjell relasjonen får lov til å veie opp, ikke at den alltid vinner.

**C. Priskanten er en klippe, ikke en skråning.**

| Timesats (maks 280) | Prisdel | Totalscore |
|---|---|---|
| 260 | 1,0 | 62 |
| 280 | 1,0 | 62 |
| 281 | 0,3 | **58** |

Én krone over taket koster 3,5 poeng. Ingen forklaring i `begrunnelser` nevner pris,
så hjelperen ser en score som faller uten å få vite hvorfor.

**D. Ingen fordelingshensyn.** Motoren maksimerer score per oppdrag. Den samme
topphjelperen vinner om og om igjen i et lite område, og ingen del av koden ser at
det skjer. Det er en inntektsfordelingsmekanisme uten et mål på inntektsfordeling.

**E. Begrunnelsene er ufullstendige.** `begrunnelser` nevner relasjon, avstand,
språk, tillit og transport — men aldri pris, punktlighet, eller hvor mye hvert
element faktisk bidro. `deler` finnes i returverdien og brukes ikke. En hjelper som
vil bestride en rangering, har ikke tallene.

### 1.2 Akuttgjenkjenningen (`AKUTTORD` i `assets/js/bestilling.js`)

Ordlisten sammenlignes med `indexOf` mot råtekst. Det gir treff midt inne i ord.

**Falske positive — målt:**

| Inndata | Treff på | Resultat |
|---|---|---|
| «Kan du bære ut avfallet?» | `fall` | Nødvarsel |
| «Det er ikke nødvendig med bil» | `nød` | Nødvarsel |
| «Bytte batteri i brannvarsleren» | `brann` | Nødvarsel |
| «Følge til blodprøve på legekontoret» | `blod` | Nødvarsel |
| «Jeg har et forslag om tidspunkt» | `slag` | Nødvarsel |
| «Handle på Kiwi, jeg er nødt til å få melk» | `nød` | Nødvarsel |
| «Hun skal til akuttmottaket på fredag for planlagt kontroll» | `akutt` | Nødvarsel |

«Nødvendig» og «avfall» er ikke sjeldne ord i en bestilling om praktisk hjelp. Dette
er ikke kosmetikk, det er den farligste feilen i filen — se punktet om `nodOverstyrt` under.

**Falske negative — målt, alle gir INGEN treff:**

| Inndata | Hvorfor den glipper |
|---|---|
| «Kraftig blødning fra armen» | Lista har `blør`, ikke stammen `blø` |
| «Hun har vondt i brystet og er kald og klam» | Lista har `brystsmerter` |
| «Munnviken henger og hun snakker utydelig» | Hjerneslag beskrevet i symptomer, ikke i diagnosenavn |
| «Han har ikke stått opp på to dager» | Ingen ord i lista |
| «Mor svarer ikke, døren er låst» | Ingen ord i lista |
| «Hun besvimte på badet» | Lista har `bevisstløs` |
| «Får ikke reist meg opp igjen» | Lista har `kan ikke reise meg` |
| «Ligger på badegulvet og kommer meg ikke opp» | Lista har frasen `ligger på gulvet` |
| «Ho pustar ikkje ordentleg» | Nynorsk |
| «Mamma har fott på gulvet» | Skrivefeil / talegjenkjenningsfeil for «falt» |

Mønsteret er entydig: **listen kjenner igjen diagnosenavn, mens familier skriver
symptomer.** Den kjenner igjen bokmål i skriftspråk, mens folk skriver som de snakker.
Og den kjenner igjen faste fraser, mens folk bøyer og omskriver.

**F. Overstyringen er klebrig og gjelder hele økten.**

```js
document.getElementById('nod-lukk').addEventListener('click', function () {
  nodOverstyrt = true;   // settes aldri tilbake
  nodVarsel.hidden = true;
});
```

`sjekkAkutt` returnerer `false` med én gang så lenge `nodOverstyrt` er satt. Kombinert
med de falske positive over gir det kjeden som bekymrer meg mest i hele kodebasen:

> Brukeren skriver «bære ut avfallet» → får et nødvarsel som åpenbart er feil →
> trykker det bort → **akuttfilteret er nå avslått for resten av økten** → skriver
> senere «hun puster ikke ordentlig» → ingenting skjer.

Falske positive er altså ikke bare irriterende her. De er mekanismen som slår av
vernet. Det er også et brudd på rekkefølgekrav 4 i `docs/ROADMAP.md`
(«Akuttfilteret skal aldri kunne omgås»), i praksis om ikke i intensjon.

**G. Filteret kjøres ikke overalt.** `sjekkAkutt` kalles ved `blur` på
beskrivelsesfeltet, ved taleresultat, og ved overgangen fra panel 2. Den kjøres
**ikke** ved `senior-bestill`. Kombinert med F betyr det at det finnes veier gjennom
flyten der teksten aldri vurderes på nytt.

**H. Ingenting måles.** Filteret viser et varsel og returnerer en boolsk verdi. Det
finnes ikke ett tellepunkt. Vi vet i dag ikke hvor ofte det slår ut, hvor ofte det
overstyres, eller om det noen gang har bommet.

### 1.3 Intensjonstolkningen (`INTENSJONER`)

Samme `indexOf`-teknikk, i tillegg til at **første treff i listerekkefølgen vinner**,
og at valget klikkes inn automatisk med `velgOppgave`.

**Målte feil:**

| Inndata | Tolket som | Skulle vært |
|---|---|---|
| «Jeg vil gå en tur» | **INGEN** | aktivitet |
| «Hjelp med skattemeldingen» | **dyr** (via `katt` i s**katt**emeldingen) | digital |
| «Kan noen hjelpe meg å tvinge opp vinduet» | **digital** (via `tv` i **tv**inge) | hjemme |
| «Jeg trenger ikke hjelp til å handle, men til å komme meg til legen» | **handling** | folge |
| «Jeg vil gjerne ha selskap til middagsmaten» | **handling** (via `mat`) | samvaer |
| «Følge til sykehuset og hente posten etterpå» | **handling** (via `post`) | folge |
| «Bli med meg på kjøpesenteret» | **handling** | aktivitet |
| «Komme meg ut i frisk luft» | **INGEN** | aktivitet |
| «Jeg har det tungt om dagen» | **INGEN** | samvaer |

Fire ting går galt samtidig:

1. **Delstrengtreff.** `tv` er to tegn og treffer i «tvinge», «tvert», «utvide».
   `katt` treffer i «skatt». `mat` treffer i «middagsmaten», «matte», «automat».
2. **Rekkefølgen er en skjult prioritering.** `handling` står først og vinner alle
   flertydige setninger. Det er ikke begrunnet noe sted.
3. **Negasjon er usynlig.** «Jeg trenger *ikke* hjelp til å handle» blir handling.
4. **Eksemplet i vår egen rollebeskrivelse virker ikke.** `ai.md` bruker
   «Jeg vil gå en tur» → oppdragstype som illustrasjon. Kjørt mot koden gir den ingen
   kategori.

I tillegg: valget **klikkes inn** før brukeren har bekreftet. Teksten sier «Jeg har
valgt kategorien for deg. Stemmer det?», men knappen er allerede trykket og
`Neste` er allerede aktivert. En eldre bruker som ikke oppfatter spørsmålet, bestiller
feil oppdragstype. Bekreftelsen er passiv der den burde vært aktiv.

---

## 2. Akuttgjenkjenning: forslaget

Dette er det farligste området i tjenesten, og det eneste hvor jeg mener en modell
bør inn allerede i pilotperioden — men bare i én bestemt rolle.

### 2.1 Prinsippet: modellen får bare eskalere

Arkitekturen er fire lag. **Ingen lag kan senke alvorlighetsgraden et tidligere lag
har satt.** Det er hele designet i én setning.

```
Tekst (skrevet eller diktert)
   │
   ├─ Lag 0  Normalisering: små bokstaver, ordgrenser, nynorsk- og
   │         dialektvarianter, vanlige skrive- og talegjenkjenningsfeil
   │
   ├─ Lag 1  Deterministisk mønsterliste, delt i to
   │            RØDT  → nødskjerm, bestillingen stopper
   │            GULT  → ett spørsmål: «Trenger dere hjelp nå?»
   │
   ├─ Lag 2  KI-klassifikator. Kan flytte  ingenting → GULT
   │                                        GULT      → RØDT
   │         Kan ALDRI flytte  RØDT → GULT  eller  GULT → ingenting.
   │         Faller den ut, tidsavbryter, eller svarer uforståelig:
   │         resultatet fra lag 1 står. Ingen degradering ved feil.
   │
   └─ Lag 3  Tekstuavhengig port: velger familien hastegrad «nå», stilles
             alltid to faste spørsmål om bevissthet og pust — uansett hva
             teksten inneholder og uansett hva lag 1 og 2 kom fram til.
```

Lag 3 er det som gjør at hele resten kan feile uten at vernet forsvinner. Det er en
regel, ikke en modell, og det er den eneste delen av akuttfilteret som ikke er
avhengig av at noen formulerer seg gjenkjennelig.

### 2.2 Konkrete endringer, i den rekkefølgen de bør gjøres

**Steg 1 — fjern den klebrige overstyringen (ingen KI, gjøres først).**
`nodOverstyrt` skal knyttes til den *teksten* som utløste varselet, ikke til økten.
Endrer brukeren teksten, vurderes den på nytt. Og `sjekkAkutt` må kalles også fra
`senior-bestill`, ikke bare ved panel 2. Dette lukker hullet i F og G og krever ingen
modell, ingen ny databehandling og ingen ny DPIA.

**Steg 2 — ordgrenser og unntak som bare kan nedgradere til GULT.**
Bytt `indexOf` mot mønstre med ordgrenser og stammer (`blø`, `blod`, `pust`,
`besvim`, `falt|falle|dotte|dott`). Legg inn en unntaksliste for trygge sammensetninger
(`blodprøve`, `blodtrykk`, `blodsukker`, `brannvarsler`, `nødvendig`, `nødt`,
`forslag`, `avfall`, `akuttmottak`).

Den avgjørende detaljen: **et unntak flytter aldri til «ingenting». Det flytter til
GULT.** «Følge til blodprøve» gir altså ikke lenger en full nødskjerm, men ett rolig
spørsmål brukeren svarer «nei» på med ett trykk. Slik synker antallet falske alarmer
uten at ett eneste rødt treff blir svakere.

**Steg 3 — utvid RØDT-listen fra diagnosenavn til symptomspråk.**
Skrives sammen med helsefaglig rådgiver, ikke av oss alene. Må dekke minst:
pustebesvær, brystsmerter i dagligtale («vondt i brystet», «trykk over brystet»),
hjerneslagtegn (skjev munn, utydelig tale, lammelse i én arm), fall som personen ikke
kommer seg opp fra, kraftig blødning, manglende respons, nynorskformer og de vanligste
talegjenkjenningsfeilene for disse ordene.

**Steg 4 — KI-klassifikatoren, kun eskalerende, og først etter DPIA.**
Se punkt 5. Fram til DPIA er ferdig kjører den i skyggemodus: den logger sin vurdering,
men påvirker ikke skjermbildet.

### 2.3 Hvordan falske negative måles

Falske negative kan per definisjon ikke observeres direkte — vi ser ikke det filteret
ikke fanget. De må derfor konstrueres, etterrekonstrueres, og estimeres. Fem kilder,
i synkende sikkerhet:

**1. Gullstandardkorpus (sikkerhet: høy, dekning: begrenset).**
Et fast korpus på minst 400 formuleringer, satt sammen med helsefaglig rådgiver:
150 RØDT, 150 GULT, 100 GRØNT. Krav til sammensetningen: minst 20 % nynorsk eller
dialektnær form, minst 20 % med skrivefeil eller typiske talegjenkjenningsfeil,
og minst 30 formuleringer hentet fra hvordan pårørende faktisk ordlegger seg
(anonymisert, med samtykke, ikke fra produksjonsdata før grunnlaget er på plass).

> **Hard port:** falske negative på RØDT-settet skal være **null**. Én FN stopper
> utrullingen. Dette er ikke et måltall som forbedres over tid — det er en betingelse
> for å gå i produksjon i det hele tatt.

**2. Etterrekonstruksjon fra hendelser (sikkerhet: høy, forsinket).**
Hver gang noe av dette skjer, hentes den opprinnelige bestillingsteksten fram og
kjøres gjennom filteret på nytt:

| Hendelse | Kilde |
|---|---|
| SOS-knappen trykkes under oppdrag | Hendelseskøen i driftskonsollen |
| Hjelperen avbryter oppdraget som «akutt situasjon» | Utsjekk |
| Familien melder i etterkant at nødetatene ble varslet | Hendelseskøen |
| Oppdrag avlyst med begrunnelse som nevner sykehus/ambulanse | Driftslogg |

Sa filteret «ingenting» på den teksten, er det en **bekreftet falsk negativ**. Den
går rett inn i gullstandardkorpuset.

**3. Ett spørsmål etter fullført oppdrag (sikkerhet: middels, dekning: bred).**
Til familien: «Ble dette en situasjon der nødetatene burde vært kontaktet?» Ja/Nei.
Ett spørsmål, ikke en undersøkelse. Ja-svar behandles som punkt 2.

**4. Skyggekjøring (sikkerhet: middels, dekning: full).**
Ny klassifikator kjører parallelt uten å påvirke skjermen. Alle uenigheter mellom
lag 1 og lag 2 logges. Et menneske gjennomgår et tilfeldig utvalg på minst 50
uenigheter per uke. Dette er den eneste kilden som ser hele trafikken, og den
forutsetter behandlingsgrunnlag for å lese fritekst — derfor står den bak DPIA.

**5. Overstyringsraten som indirekte varsel (sikkerhet: lav, men umiddelbar).**
Andelen nødvarsler brukeren trykker bort. Stiger den over 15 %, er filteret i ferd
med å bli støy, og støy er selv en falsk-negativ-risiko: folk slutter å lese.
Denne kurven repareres alltid ved å snevre inn GULT-båndet — **aldri** ved å fjerne
noe fra RØDT.

### 2.4 Oppfølging: hva som faktisk skjer med et funn

| Ledd | Krav |
|---|---|
| Registrering | Bekreftet FN opprettes som sak i driftskøen med høyeste prioritet |
| Ny testdekning | Formuleringen legges i gullstandardkorpuset innen **5 virkedager** |
| Rotårsak | Skyldes den lag 0, 1, 2 eller 3? Skrives ned, ikke antas |
| Rapportering | FN-antall, overstyringsrate og korpusstørrelse rapporteres månedlig til ledelsen; ingen tall fjernes fra rapporten fordi de ser dårlige ut |
| Terskel for stans | To bekreftede FN i samme kvartal → akuttfilteret rulles tilbake til forrige versjon og KI-laget settes i skyggemodus til årsaken er funnet |
| Eier | KI-ansvarlig. Ikke delegerbart til drift |

---

## 3. Foreslåtte KI-bruksområder

Hvert område er vurdert etter de fem spørsmålene i `ai.md`: hva modellen ser, hva den
ikke ser, hva som skjer når den tar feil, hvem som kan overprøve den, og hvordan
forklarbarheten beholdes.

### 3.1 Akuttklassifisering (eskalerende lag 2)

| | |
|---|---|
| **Ser** | Bestillingsteksten, valgt hastegrad, klokkeslett. Ingenting annet. |
| **Ser ikke** | Hvem personen er, alder, historikk, diagnoser, tidligere oppdrag. Bevisst: modellen skal vurdere *situasjonen*, ikke *personen*. Ingen profilering. |
| **Feiler** | Falsk positiv: brukeren får ett ekstra spørsmål å svare nei på. Falsk negativ: lag 1 og lag 3 står fortsatt. Modellen kan ikke senke noe, så dens verste feil er den samme som å ikke ha den. |
| **Overprøves av** | Brukeren selv, umiddelbart, ved å svare på GULT-spørsmålet. Ingen overstyring kan slå av RØDT — der er nødnumrene alltid synlige, og bestillingen går ikke videre. Drift kan hverken skru av eller ned filteret uten godkjenning fra KI-ansvarlig. |
| **Forklarbarhet** | Utfallet vises alltid som *hvilket* nivå og *hvorfor*: enten «ordet X i teksten» (lag 1) eller «beskrivelsen kan tyde på en akutt situasjon» (lag 2). Modellen returnerer i tillegg en kort begrunnelse som logges, slik at hvert utslag kan etterprøves uten å gjette. |

### 3.2 Intensjonstolkning av fritekst og tale

| | |
|---|---|
| **Ser** | Teksten brukeren skrev eller sa. |
| **Ser ikke** | Bestillingshistorikk, adresse, familie, helseopplysninger. |
| **Feiler** | Feil kategori gir feil pris (`OPPGAVEFAKTOR` i `pris.js` varierer 1,00–1,15) og potensielt feil hjelper via `kvalifisert`-kravet. Dempes ved at modellen **foreslår inntil tre kategorier og velger ingen**. Dagens autoklikk fjernes. |
| **Overprøves av** | Brukeren, ved å trykke på en annen knapp — like enkelt som å bekrefte. Familien i pårørendepanelet før oppdraget publiseres. Drift kan endre kategori på et oppdrag i kø. |
| **Forklarbarhet** | Forslaget vises med det brukeren selv sa: «Du sa *følge til legen* — jeg foreslår **Følge til avtale**. Stemmer det?» Ingen kategori settes uten at brukeren har trykket. |
| **Merk** | Modellen skal aldri tolke akutt her. Akuttvurderingen skjer i 3.1, før intensjonstolkningen, og et RØDT utfall stopper flyten før kategori i det hele tatt er aktuelt. |

### 3.3 Taleforståelse ved bestilling

I dag brukes nettleserens innebygde `SpeechRecognition` med `lang = 'nb-NO'`. Den
håndterer dialekt og eldre stemmer dårlig, og «Mamma har falt» ble i vår egen prøve
til «Mamma har fott» — som akuttfilteret ikke fanger.

| | |
|---|---|
| **Ser** | Lyd fra mikrofonen i det tidsrommet brukeren holder knappen. |
| **Ser ikke** | Skal ikke se noe annet. Lyd lagres ikke, brukes ikke til stemmegjenkjenning, og kobles ikke til identitet. |
| **Feiler** | Feiltransskripsjon gir feil kategori (dempet av 3.2) eller mistet akuttord (dempet av lag 0 og lag 3). Ingen tolkning gjøres uten at transkripsjonen vises: «Du sa: …». |
| **Overprøves av** | Brukeren, ved å rette teksten i beskrivelsesfeltet, som allerede er koblet. Telefonnummeret til supporten skal stå på samme skjerm som taleknappen, som i dag. |
| **Forklarbarhet** | Transkripsjonen vises alltid ordrett før noe skjer. Det er den forklaringen som betyr noe her. |
| **Sperre** | Å sende lyd til en ekstern leverandør er en ny databehandling med ny databehandler, og lyd fra en eldres hjem kan inneholde langt mer enn bestillingen. Krever DPIA og databehandleravtale. Til da: behold nettleserens innebygde, og styrk lag 0 i stedet. |

### 3.4 Varighetsestimering

| | |
|---|---|
| **Ser** | Oppdragstype, bydel, tidsrom, oppgitt timetall, faktisk varighet på tidligere *aggregerte* oppdrag. |
| **Ser ikke** | Hvem den eldre er, hvem hjelperen er. Estimering skal skje på oppdragstype og geografi, aldri på person — ellers blir det en produktivitetsvurdering av hjelperen, og det er en helt annen behandling med helt andre krav. |
| **Feiler** | Systematisk underestimering rammer hjelperen økonomisk. Derfor: estimatet er et **forslag til familien om å bestille nok tid**, ikke et tak på hva som betales. Faktisk tid gjelder alltid ved oppgjør. Avviket mellom estimat og faktisk tid rapporteres månedlig, og skjevhet i hjelpernes disfavør er en feil som skal rettes, ikke en toleranse. |
| **Overprøves av** | Familien velger timetall selv — estimatet flytter aldri knappen. Hjelperen registrerer faktisk tid ved utsjekk. Drift kan korrigere. |
| **Forklarbarhet** | «Lignende oppdrag i Frogner har tatt 1–2 timer.» Median og spenn, ikke ett tall. Statistikk slår modell her, og statistikk kan forklares. |
| **Anbefaling** | Start som ren beskrivende statistikk på egne aggregerte data. Det trengs ingen lært modell for å regne ut en median, og en median kan bestrides. |

### 3.5 Moderering av fritekst (helseopplysninger)

`docs/DPIA.md` R3 vurderer sannsynligheten for at helseopplysninger havner i fritekst
som **høy**. Det er den vurderingen jeg deler.

| | |
|---|---|
| **Ser** | Fritekst *mens den skrives*, i nettleseren, før innsending. |
| **Ser ikke** | Ingenting sendes videre. Poenget er å hindre at opplysningen i det hele tatt oppstår i basen vår. |
| **Feiler** | Overmoderering skjuler nødvendig informasjon — «bruker rullator» er en praktisk opplysning hjelperen trenger, ikke en helseopplysning som skal fjernes. Derfor: modellen **fjerner aldri tekst og blokkerer aldri innsending**. Den viser et forslag: «Diagnoser trenger ikke stå her. Hjelperen trenger å vite hva som skal gjøres.» Brukeren kan sende likevel. |
| **Overprøves av** | Brukeren, alltid. Drift kan slette i etterkant på forespørsel, som i dag. |
| **Forklarbarhet** | Forslaget peker på den konkrete setningen og sier hvorfor. Aldri en generell advarsel om «upassende innhold». |
| **Paradokset** | For å oppdage helseopplysninger må teksten leses. Kjøres modellen i nettleseren og ingenting sendes ut, er behandlingen minimal. Kjøres den hos en leverandør, behandler vi særlige kategorier for å unngå å behandle særlige kategorier. **Bare lokal kjøring er akseptabel her uten eget grunnlag etter art. 9.** |

### 3.6 Prioritering i driftskøen

| | |
|---|---|
| **Ser** | Sakstype, ventetid, svarfrist, om saken gjelder et pågående oppdrag. |
| **Ser ikke** | Hvem parten er, betalingshistorikk, kontoverdi. En sak skal ikke stige i køen fordi den gjelder en lønnsom kunde. |
| **Feiler** | Skjult nedprioritering av reelle saker. Dempes ved at modellen **kun sorterer visningen** — ingen sak forsvinner, ingen frist endres, og oversittet frist markeres like tydelig som i dag. Saksbehandleren kan alltid sortere på ventetid i stedet. |
| **Overprøves av** | Saksbehandleren, med ett klikk. Sorteringen er en kolonne, ikke en dom. |
| **Forklarbarhet** | Hver sak viser hvorfor den ligger der den ligger: «pågående oppdrag», «frist om 20 min». Uten den etiketten er sorteringen ubrukelig for en saksbehandler som skal stå for prioriteringen sin. |
| **Sikring** | Alle saker som gjelder sikkerhet eller et pågående oppdrag, ligger alltid øverst — ved regel, ikke ved modell. Modellen sorterer bare det som er igjen. |

---

## 4. Hvor KI ikke skal brukes i denne tjenesten

Dette er ikke en «senere»-liste. Det er en liste over ting som ikke skal bygges.

**1. Selve matchingrangeringen skal forbli regelbasert.**
En lært rangeringsmodell ville sannsynligvis gitt noen prosent bedre treff. Den kan
ikke forklares for en hjelper som spør hvorfor hun ikke fikk oppdraget, og den kan
ikke bestrides. Vektene i `matching.js` er offentlige tall som kan diskuteres i et
møte. Det er verdt mer enn presisjonen. Feilene i punkt 1.1 løses ved å rette
vektene, ikke ved å bytte metode.

**2. Tillitsscore, risikoskår eller egnethetsvurdering av hjelpere.**
Dette er profilering som påvirker en persons inntekt. Det er kjerneområdet for
GDPR art. 22, det er arbeidsrettslig uavklart (se `docs/DPIA.md` punkt 6.2), og det
er R6 i risikotabellen. Tillitsnivå skal utledes av tellbare, offentlige kriterier —
antall fullførte oppdrag, gjennomførte kurs, bestått verifisering — som hjelperen
kan lese og etterprøve selv.

**3. Utestenging, frys eller avvisning av kontoer.**
Ufravikelig. En modell kan flagge til et menneske. Beslutningen tas av et menneske
som skriver en begrunnelse. Ingen unntak, heller ikke ved mistanke om alvorlige
forhold — særlig ikke da, fordi det er der feil koster mest.

**4. Prissetting.**
Prisen skal være en funksjon av tid, reise, oppgavetype og hastegrad — regler som står
i `pris.js` og kan leses linje for linje. En modell som setter pris per bruker er
personlig prisdiskriminering mot en gruppe som er definert som sårbar i vår egen DPIA.
Den skal ikke bygges, uansett hvor godt den måtte fungere kommersielt.

**5. Automatisk screening av søkere.**
Referanser, fritekst om erfaring og motivasjon skal leses av mennesker. En modell kan
sjekke at obligatoriske felt er fylt ut. Den kan ikke vurdere om noen egner seg til å
være alene hjemme hos en eldre.

**6. Stemme- eller ansiktsanalyse for tilstand.**
«Modellen hører at hun er forvirret» er biometrisk behandling og helseopplysninger i
én operasjon, og emosjonsgjenkjenning i tillegg. Nei. Talegjenkjenning skal
transkribere ord og ingenting mer.

**7. En samtaleagent som snakker med den eldre uten et menneske bak.**
Den dagen en beboer forklarer en akutt situasjon til en chatbot i stedet for til
113, har vi bygget feil produkt. Tale brukes til å fylle ut et skjema, ikke til å føre
en samtale.

**8. Trening eller finjustering på oppdragsdata.**
Ikke uten at det er vurdert, dokumentert og opplyst til de registrerte. Standard i
alle leverandøravtaler skal være at våre data ikke inngår i leverandørens trening.

---

## 5. Rekkefølge

### 5.1 Kan bygges i pilotfasen

Alt her er deterministisk, kjører lokalt, innfører ingen ny databehandling og ingen ny
databehandler. Ingenting her endrer forutsetningene i `docs/DPIA.md`.

| # | Tiltak | Hvorfor det kan gjøres nå |
|---|---|---|
| P1 | Fjern klebrig `nodOverstyrt`; kall `sjekkAkutt` også ved bestilling | Ren feilretting av et sikkerhetshull. Høyeste prioritet i hele dokumentet |
| P2 | Ordgrenser, stammer og nynorskvarianter i `AKUTTORD` | Regler, ingen modell |
| P3 | Todelt akuttfilter: RØDT stopper, GULT spør. Unntak nedgraderer kun til GULT | Regler, ingen modell |
| P4 | Lag 3: faste spørsmål om bevissthet og pust ved hastegrad «nå» | Regel. Virker uavhengig av alt annet |
| P5 | Gullstandardkorpus + FN-port i testkjøringen | Testdata, syntetisk eller samtykket |
| P6 | Tellepunkter: utslag, nivå, overstyring — aggregert, uten tekst | Ingen personopplysninger lagres |
| P7 | Intensjonstolkning: ordgrenser, negasjonsregel, tre forslag, fjern autoklikk | Regler. Retter feilene i 1.3 uten modell |
| P8 | Matching: nærhet mot fast skala; ta med `deler` i begrunnelsene | Retter 1.1 A og E. Gjør motoren mer forklarbar, ikke mindre |
| P9 | Varighetsestimat som median per type og bydel | Beskrivende statistikk på aggregerte egne data |

**Merk hvor mye av listen som ikke er KI.** Det største sikkerhetsløftet i hele
veikartet — P1 til P4 — er regelarbeid. En modell hadde ikke reddet oss fra `nodOverstyrt`.

### 5.2 Krever ferdig DPIA og eget behandlingsgrunnlag først

| # | Tiltak | Hva som må avklares |
|---|---|---|
| K1 | KI-klassifikator på fritekst i produksjon (lag 2) | Fritekst kan inneholde helseopplysninger → art. 9-grunnlag. Ekstern modell → databehandler, EU/EØS-lagring, avtale. Nytt punkt i `docs/GDPR.md` §10 |
| K2 | Skyggekjøring på reell trafikk | Samme grunnlag som K1. Logging av fritekst er en ny behandling selv når resultatet ikke vises |
| K3 | Ekstern talegjenkjenning | Lyd fra hjemmet, ny databehandler, sletterutine for lyd, arbeidsrettslig side hvis hjelpere også bruker det |
| K4 | Moderering hos leverandør | Blir bare aktuelt hvis lokal kjøring ikke holder. Behandler særlige kategorier per definisjon |
| K5 | Prioritering i driftskøen på reelle saker | Påvirker responstid overfor sårbare. R9-nær. Krever dokumentert regel om at sikkerhetssaker aldri kan nedprioriteres |
| K6 | Enhver bruk av oppdragsdata til trening eller evaluering | Eget grunnlag, egen informasjon til de registrerte, opt-out |
| — | Punktene i kapittel 4 | Skal ikke bygges. Ikke et rekkefølgespørsmål |

**Dokumenter som må oppdateres før K1 settes i drift:**

- `docs/DPIA.md` punkt 2: «Automatiserte avgjørelser?» må nevne akuttklassifisering
- `docs/DPIA.md` punkt 3: nye rader — R10 modell overser akutt situasjon (konsekvens
  svært høy, sannsynlighet lav, tiltak: eskaleringsmonopol, lag 3, FN-port),
  R11 fritekst sendes til ekstern modell, R12 modellens vurdering brukes til noe
  annet enn formålet
- `docs/GDPR.md` §5: hvordan modellen forholder seg til særlige kategorier
- `docs/GDPR.md` §10: modellleverandør inn i databehandlertabellen
- `docs/ROADMAP.md`: rekkefølgekrav 4 presiseres — «akuttfilteret kan ikke omgås,
  heller ikke av en overstyring brukeren gjorde tidligere i økten»

---

## 6. Testbarhet

Prinsippet fra `docs/TESTING.md` holder: **hver regel som er et løfte til brukerne,
skal ha en test som beskytter den.** Det gjelder også når regelen er en modell.

To ufravikelige krav til hvordan KI testes her:

1. **`npm test` skal aldri kalle en modell.** Suiten er i dag uten eksterne
   avhengigheter, og det skal den forbli. Modellkall går gjennom en adapter i
   `assets/js/api.js`-mønsteret, og testene bruker et opptak (fixture). Er adapteren
   ikke koblet, oppfører systemet seg som om lag 2 falt ut — altså lag 1-resultatet
   står. Det gjør «modellen er nede» til en tilstand som testes, ikke en overraskelse.
2. **Gullstandardkorpuset kjøres mot den ekte modellen i en egen kommando**
   (`npm run test:ki`), i CI før utrulling, ikke ved hvert lokale lagringstrykk.
   Den kjøringen er en utrullingsport.

### 6.1 Nye tester, i samme form som dagens

| Test | Fil | Løftet den beskytter |
|---|---|---|
| «nødvarsel som lukkes, gjelder bare den teksten» | e2e | Én falsk alarm slår ikke av vernet for resten av økten |
| «endret beskrivelse vurderes på nytt» | e2e | Teksten sjekkes hver gang den endres |
| «akuttfilteret kjøres også ved bestilling» | e2e | Ingen vei gjennom flyten omgår filteret |
| «bære ut avfallet gir ikke nødskjerm» | enhet | Falske positive slites ned uten at rødt svekkes |
| «blodprøve gir spørsmål, ikke nødskjerm» | enhet | Unntak nedgraderer til GULT, aldri til ingenting |
| «vondt i brystet gir nødskjerm» | enhet | Symptomspråk fanges, ikke bare diagnosenavn |
| «pustar ikkje gir nødskjerm» | enhet | Nynorsk fanges |
| «gullstandard: null falske negative på rødt» | test:ki | **Utrullingsport.** Én FN stopper utrullingen |
| «modellen kan ikke nedgradere lag 1» | enhet | Eskaleringsmonopolet, testet som egenskap over hele korpuset |
| «modell utilgjengelig gir lag 1-resultat» | enhet | Feil i modellen degraderer aldri sikkerheten |
| «hastegrad nå gir bevissthets- og pustespørsmål uansett tekst» | e2e | Lag 3 virker uten at noen formulerer seg gjenkjennelig |
| «intensjonstolkning velger ingen kategori automatisk» | e2e | Brukeren bekrefter aktivt, ikke passivt |
| «skattemelding tolkes ikke som dyrepass» | enhet | Delstrengtreff er borte |
| «negasjon endrer tolkningen» | enhet | «Trenger ikke handle» blir ikke handling |
| «lik avstand gir lik nærhetsscore» | enhet | Hjelperen straffes ikke for en ærlig maksavstand |
| «hver score kan brytes ned i delene sine» | enhet | En rangering kan bestrides med tall |
| «varighetsestimat er forslag, ikke tak» | enhet | Estimatet flytter ikke oppgjøret |
| «ingen fritekst sendes til modell uten samtykkeflagg» | enhet | Behandlingsgrunnlaget håndheves i kode, ikke i rutine |
| «modereringsforslag kan alltid overstyres» | e2e | Overmoderering skjuler ikke nødvendig informasjon |
| «sikkerhetssak ligger øverst i køen uansett sortering» | e2e | Modellen kan ikke nedprioritere en sikkerhetssak |

### 6.2 Måltall som følges over tid, ikke bare grønt/rødt

| Måltall | Krav | Rapporteres |
|---|---|---|
| Falske negative, gullstandard RØDT | 0 | Hver utrulling (blokkerende) |
| Bekreftede FN i produksjon | 0. To i samme kvartal → tilbakerulling | Månedlig |
| Overstyringsrate på nødvarsel | < 15 % | Månedlig |
| Andel intensjonsforslag brukeren endrer | < 25 % | Månedlig |
| Avvik estimert vs. faktisk varighet | Symmetrisk. Systematisk skjevhet i hjelperens disfavør = feil | Månedlig |
| Korpusstørrelse | Vokser hvert kvartal | Kvartalsvis |

Måltall som ser dårlige ut, fjernes ikke fra rapporten. En rapport man kan stole på
i motgang, er hele poenget med å måle.

---

## 7. Åpne spørsmål

1. Hvor går grensen mellom «praktisk opplysning hjelperen trenger» og
   «helseopplysning»? «Bruker rullator» må gjennom; «Alzheimer» skal ikke. Trenger
   en avklaring med juridisk rådgiver før modereringen bygges.
2. Skal RØDT-listen skrives av helsefaglig rådgiver alene, og hvem eier den etterpå?
3. Kan gullstandardkorpuset deles åpent? Det ville gjort akuttfilteret etterprøvbart
   utenfra, og det er en tillitsegenskap i seg selv.
4. Hva er riktig svar når filteret sier RØDT og familien likevel vil bestille? I dag
   kan varselet lukkes. Skal det kunne det, eller skal RØDT bety at flyten stopper og
   nødnumrene blir stående?
