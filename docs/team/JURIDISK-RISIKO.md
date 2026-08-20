# Juridisk risikoregister

Dette er ikke juridisk rådgivning, og ingen her er jurist. Dokumentet er et
**arbeidsgrunnlag for juridisk rådgiver**: hva vi bygger, hvor i produktet det
berører regelverk, og hva vi trenger svar på før vi går i drift.

Metode: hvert punkt er kontrollert mot faktisk kode, tekst og dokumentasjon i
repoet, ikke mot antakelser. Filreferanser er oppgitt der funnet er konkret.

Alvorsgrad: **A** stopper drift · **B** må avklares før Bolk A ferdigstilles ·
**C** må være på plass før vekst · **D** følges opp løpende.

---

## Sammendrag

| # | Risiko | Grad | Blokkerer |
|---|---|---|---|
| J1 | Den eldres samtykkekompetanse og hvem som er avtalepart | **A** | Bolk A trinn 1 |
| J2 | Utlevering av den eldres opplysninger til pårørende | **A** | Bolk A trinn 1 |
| J3 | Forhåndsavkrysset samtykke i bestillingsflyten | **A** | Rettet, se under |
| J4 | Obligatorisk avkryssing for brukervilkår som ikke finnes | **A** | Bolk A trinn 8 |
| J5 | Angrerett og abonnementsvilkår mot forbruker | **B** | Første abonnement |
| J6 | Arbeidsrettslig klassifisering av hjelperne | **A** | Bolk A trinn 4 |
| J7 | Plattformarbeid og algoritmisk styring | **B** | Bolk A trinn 6 |
| J8 | Automatiserte avgjørelser som påvirker inntekt | **B** | Bolk A trinn 6 |
| J9 | Grensen mot helsehjelp | **A** | Bolk A trinn 3 |
| J10 | Politiattest uten hjemmel | **B** | Bolk A trinn 3 |
| J11 | Betalingsformidling og konsesjonsplikt | **A** | Bolk A trinn 4 |
| J12 | Forsikring og ansvarsfordeling | **A** | Bolk A trinn 8 |
| J13 | Særlige kategorier: helseopplysninger som siver inn | **B** | Bolk A trinn 2 |
| J14 | Markedsføring mot sårbar gruppe, og elektronisk markedsføring | **B** | Kampanjestart |
| J15 | Universell utforming | **C** | Før vekst |
| J16 | Skatt, rapportering og merverdiavgift | **B** | Første utbetaling |
| J17 | Varemerke og domene | **C** | Marked 2 |
| J18 | Databehandleravtaler og overføring ut av EØS | **B** | Bolk A trinn 1 |
| J19 | Aldersgrense og legitimasjonskontroll | **C** | Bolk A trinn 3 |
| J20 | Referansepersoner er registrerte som aldri meldte seg på | **B** | Bolk A trinn 3 |
| J21 | Avslagsgrunner og utestengelse som svarteliste | **C** | Før vekst |
| J22 | Språkkrav som indirekte diskriminering | **B** | Første leverandør |
| J23 | Sperring på språknivå som automatisert avgjørelse | **B** | Første leverandør |
| J24 | Behovsplattformen behandlet til Naviars eget formål | **A** | Rettet, se under |

---

## J1 · Den eldres samtykkekompetanse og hvem som er avtalepart · **A**

Hele produktet hviler på at datteren i Oslo organiserer hjelp til moren i
Alicante. Juridisk er det tre roller som i dag ikke er skilt fra hverandre:

| Rolle | Hvem | Uavklart |
|---|---|---|
| Avtalepart | Den som bestiller og betaler | Er det datteren, moren, eller begge? |
| Tjenestemottaker | Den eldre | Hva om hun ikke ønsker besøket? |
| Registrert | Den eldre | Hvem samtykker på hennes vegne? |

Målgruppen inkluderer personer med kognitiv svikt. `docs/GDPR.md` nevner
Alzheimer og demens som noe vi *ikke* skal registrere, men produktet tar ikke
stilling til hva som skjer når mottakeren ikke kan samtykke selv.

**Det som må avklares:** når kan en pårørende binde den eldre? Hva kreves av
fullmakt? Hvor går grensen mot vergemål? Hva gjør vi hvis mottakeren motsetter
seg et oppdrag bestilt av familien?

**Produktkravet som følger, uansett svar:** den eldre må ha en vei til å si nei
som ikke går gjennom den som bestilte. I dag finnes den ikke.

---

## J2 · Utlevering av den eldres opplysninger til pårørende · **A**

`familie.html` viser datteren: mors status «Hjemme», siste og neste oppdrag,
oppdragstype, hvem som kom, klokkeslett for ankomst, varighet, faste hjelpere,
månedsforbruk og beløp.

Det er en løpende utlevering av personopplysninger om moren til en tredjeperson.

To funn:

1. **Ingen steder samtykker Maria til dette.** Bestillingsflyten har et valg om å
   varsle familien ved det enkelte oppdrag. Panelet gir noe annet: vedvarende
   innsyn i mønster over tid.
2. **Personvernerklæringen dekker det ikke.** `personvern.html` §6 «Hvem vi deler
   med» beskriver hva *hjelperen* deles med familien. Den sier ingenting om hva
   som deles om *den eldre*.

Oppdragstypen alene er avslørende: «følge til legetime» sier noe om helse.
Fraværet av oppdrag sier også noe.

**Det som må avklares:** hvilket grunnlag utleveringen hviler på, og om et
samtykke fra en person med svekket kognisjon holder når den som ber om innsyn er
den samme som organiserer hverdagen hennes.

**Produktkravet:** innsynsnivå skal være noe den eldre selv setter og kan endre —
fra «bare varsel om at oppdraget er utført» til «full oversikt» — og det skal stå
i personvernerklæringen.

---

## J3 · Forhåndsavkrysset samtykke · **A** · rettet

`trenger-hjelp.html` hadde `<input type="checkbox" id="varsle-familie" checked>`.

Et forhåndsavkrysset felt er ikke et aktivt valg. At det gjelder utlevering av
opplysninger til en tredjeperson, gjør det verre enn en formfeil.

**Rettet i denne gjennomgangen.** Avkryssingen er fjernet, og teksten sier nå hva
som faktisk deles, ikke bare at familien «får beskjed».

Regel som følger: **ingen samtykkeboks i dette produktet leveres avkrysset.**
Registreringsskjemaet var allerede riktig; bestillingsflyten var ikke.

---

## J4 · Brukervilkår som ikke finnes · **A**

`bli-hjelper.html` krever avkryssing av «Jeg godtar brukervilkårene» for å
opprette konto. Det finnes ingen vilkår i repoet, ingen lenke, ingen versjon.

Vi ber altså noen om å binde seg til noe de ikke kan lese. Samtidig viser
`trygghet.html` til vilkårene som grunnlag for pengereglene — at hjelperen aldri
skal ta imot kontanter, kort, PIN eller BankID. Reglene finnes som løfte, ikke som
avtale.

**Må skrives før første hjelper godkjennes:** brukervilkår for hjelper,
brukervilkår for familie, versjonering, og en lenke fra avkryssingsboksen.

Samme gjelder samtykket til referansesjekk og ID-kontroll: teksten finnes,
prosessen den viser til er ikke beskrevet noe sted en søker kan lese.

---

## J5 · Angrerett og abonnementsvilkår · **B**

`SALG.md` foreslår tre abonnementer, 199 til 5 100 kr i måneden. Ordet angrerett
finnes ikke i repoet.

Avtaler inngått på nett med forbruker utløser normalt både opplysningsplikt og
angrerett, og løpende avtaler har egne krav til oppsigelse og prisendring.

**Må avklares:** gjelder angrerett når tjenesten er levert innen fristen? Hvordan
skal en bestilling «nå» håndteres — kan kunden angre etter at hjelperen har takket
ja og reist? Hva er oppsigelsestiden på et abonnement, og hvordan varsles
prisendring?

Merk spenningen mot hjelperens interesse: `SALG.md` har allerede kompensasjon ved
avbestilling under to timer før avtalt tid. Angrerett og den kompensasjonen må
henge sammen, ellers betaler vi selv mellomlegget hver gang.

---

## J6 · Arbeidsrettslig klassifisering · **A**

Det tyngste punktet, og `OKONOMI.md` har allerede regnet på det: omklassifisering
legger rundt 30 % på hjelperlinjen, mot 99 kr i serviceavgift. Da er ikke 18 %
lenger et spørsmål om margin, men om modellen bærer i det hele tatt.

Momenter som trekker i retning av arbeidstaker i vår modell:

- Vi setter prisen. Hjelperen forhandler ikke.
- Vi bestemmer hvem som får tilbud, gjennom matchingen.
- Vi krever obligatorisk opplæring før arbeid kan utføres.
- Vi fører kontroll med oppmøte gjennom innsjekk og områdekontroll.
- Vi kan suspendere kontoen, altså i praksis stenge inntekten.

Momenter som trekker mot oppdragstaker:

- Hjelperen velger selv tilgjengelighet, avstand og oppdragstyper.
- Ingen plikt til å ta et tilbudt oppdrag.
- Arbeidet kan utføres for flere plattformer samtidig.

**Kan ikke avgjøres av oss.** Svaret bestemmer prismodellen, forsikringen,
skattebehandlingen og hvorvidt vaktordningen er arbeidsgiveransvar.

---

## J7 · Plattformarbeid og algoritmisk styring · **B**

`docs/EUROPA.md` peker allerede på dette. Matchingen i `assets/js/matching.js`
avgjør hvem som får tilbud om inntektsgivende arbeid, og `SERVICE-BLUEPRINT.md`
beskriver en tillitsscore som påvirker rangeringen.

Vi ligger godt an på ett punkt: motoren er regelbasert og forklarer både hvorfor
et oppdrag vises og hvorfor et annet holdes utenfor. Det er bevisst, og det bør
beholdes uansett hva regelverket lander på.

**Må avklares:** hvilken informasjonsplikt vi har om hvordan matchingen virker,
hvilke data som brukes, og hva som kreves av menneskelig gjennomgang før en konto
stenges. `SYNTESE.md` B5 slår allerede fast at fire områder aldri skal avgjøres av
en modell; det bør skrives inn i vilkårene, ikke bare i et internt dokument.

---

## J8 · Automatiserte avgjørelser som påvirker inntekt · **B**

Tillitsscoren vektes med oppdragshistorikk 30 %, vurderinger 20 %, punktlighet
15 %, gjenvalg 15 %, avbestillinger 10 % og sikkerhetshistorikk 10 %. Den
påvirker hvilke oppdrag som tilbys, altså inntekten.

To ting følger:

1. Hjelperen må kunne få vite hva som ligger til grunn for sin egen score, og
   bestride den. `SERVICE-BLUEPRINT.md` sier kriteriene skal være åpne og mulige å
   bestride — det må bli en funksjon, ikke en intensjon.
2. Kundevurderinger kan bære diskriminering videre. En hjelper som konsekvent får
   lavere vurdering på grunn av aksent eller opprinnelse, får lavere score, får
   færre oppdrag. Systemet ville ikke merket det.

**Produktkrav:** følg med på om vurderinger fordeler seg systematisk skjevt
mellom grupper. Vi kan ikke måle det uten data vi ikke bør samle — det er en reell
spenning som må løses bevisst, ikke overses.

---

## J9 · Grensen mot helsehjelp · **A**

`trygghet.html` og `bli-hjelper.html` sier tydelig at medisinering, sårstell og
personlig stell ligger utenfor. Det er riktig plassert.

Risikoen er ikke det vi har skrevet, men det som skjer i praksis:

- Den eldre ber hjelperen om å hente medisindosetten.
- Hjelperen støtter noen som holder på å falle, og skader skjer.
- Familien beskriver oppdraget som «følge til legetime» og forventer at hjelperen
  refererer det legen sa.
- Et «sosialt samvær»-oppdrag hos en person med demens blir i realiteten tilsyn.

**Må avklares:** hvor grensen går rettslig, hva som skjer med ansvaret når den
krysses, og om formidling av enkelte oppdragstyper i seg selv utløser krav vi ikke
har vurdert. Særlig relevant hvis kommunesporet i `SALG.md` realiseres.

**Produktkrav:** hjelperen må ha en enkel måte å avvise en forespørsel utenfor
oppdraget på, og det må logges — både for hennes skyld og for vår.

---

## J10 · Politiattest uten hjemmel · **B**

Allerede korrekt håndtert i `trygghet.html`: vi lover ikke politiattest på alle,
og skriver at hjemmel må finnes før den kan kreves.

**Må avklares:** hvilke oppdragskategorier som eventuelt har slik hjemmel. Til det
er avklart, står formuleringen som den er. Den skal ikke «mykes opp» i
markedsføring.

---

## J11 · Betalingsformidling og konsesjonsplikt · **A**

Modellen slik den er beskrevet i `docs/DRIFT.md` og vist i `trenger-hjelp.html`:
beløpet reserveres når hjelperen takker ja, trekkes etter bekreftelse, frigis
automatisk etter 48 timer, og betales ut til hjelperen etter tre til fem dager.
`OKONOMI.md` regner med at plattformen holder kundens penger i omtrent fire dager
— rundt 130 000 kr i positiv flyt ved 1 500 oppdrag i måneden.

Å motta penger fra en kunde og videreformidle dem til en tredjepart kan være en
regulert betalingstjeneste. Det avhenger av hvordan strømmen faktisk settes opp:
om pengene går innom vår konto, eller om betalingsleverandøren er avtalepart hele
veien.

**Må avklares før noen betaling skjer:** krever modellen konsesjon eller
agentregistrering? Kan vi bruke en lisensiert leverandørs løsning slik at midlene
aldri er våre? Hvem eier kravet hvis vi går konkurs mens pengene står reservert?

Dette er ikke et punkt å prøve seg fram på. Feil oppsett her rammer alt annet.

---

## J12 · Forsikring og ansvar · **A**

`trygghet.html` sier at forsikringsdekning fastsettes med forsikringsselskap og
jurist før drift. Det er fortsatt utestående, og `TJENESTEDESIGN.md` G14 markerer
det som blokkerende.

Ansvarsspørsmål som må ha et skriftlig svar før første oppdrag:

| Situasjon | Hvem svarer |
|---|---|
| Hjelperen ødelegger noe i hjemmet | ? |
| Den eldre skades under et oppdrag | ? |
| Hjelperen skades hos kunden | ? |
| Hjelperen kjører den eldre i egen bil, og det skjer et uhell | ? |
| Noe forsvinner, uten at det kan bevises hva som skjedde | ? |
| Hjelperen bryter taushetsplikten | ? |

Transport i egen bil er avkryssbart i `bli-hjelper.html` og trenger eget svar:
vanlig privatbilforsikring dekker sjelden persontransport mot vederlag.

---

## J13 · Særlige kategorier: helseopplysninger som siver inn · **B**

`docs/GDPR.md` er tydelig på at vi ikke ber om diagnoser, journal eller
medisinlister, og fritekstfeltene har veiledning mot det. Men:

- Familien skriver hva de vil i oppdragsbeskrivelsen.
- Oppdragstypen «følge til legetime» er i seg selv en helseopplysning.
- Hjelperens oppdragsnotat kan inneholde observasjoner om helse.
- Statusen «Hjemme» i `familie.html` sier noe om funksjonsnivå.
- HPR-nummer i `bli-hjelper.html` er en opplysning om hjelperen selv.

**Må avklares:** om oppdragstyper som impliserer helse skal behandles på et
strengere grunnlag enn resten, og hva vi gjør med fritekst som viser seg å
inneholde slike opplysninger — sletting, maskering, eller begge.

---

## J14 · Markedsføring mot sårbar gruppe · **B**

`MARKEDSFORING.md` har allerede avvist fryktbasert markedsføring og har et eget
kapittel om det vi ikke gjør. Det står seg.

**Må avklares:** hva som gjelder for elektronisk markedsføring til en gruppe der
mottakeren kan ha svekket dømmekraft, og hvordan samtykke til nyhetsbrev skal
innhentes fra en 82-åring. Samtykkeboksen i `bli-hjelper.html` gjelder hjelpere;
tilsvarende for familier og eldre er ikke laget ennå — den bør utformes med dette
i tankene fra start.

Mellomleddstrategien i markedsplanen — pensjonistforbund, fastleger, menigheter —
må også vurderes: markedsføring gjennom en de eldre stoler på, stiller strengere
krav enn en annonse de kan ignorere.

---

## J15 · Universell utforming · **C**

`docs/EUROPA.md` peker på at digitale tjenester mot forbrukere har krav til
tilgjengelighet. For denne målgruppen er det uansett et produktkrav.

Status i dag er bedre enn utgangspunktet: Senior Mode har 21px grunnskrift, store
trykkflater, `prefers-reduced-motion`, synlig fokusmarkering og
`aria-pressed`/`aria-live` der det trengs. 102 tester dekker blant annet at ingen
side flyter utover skjermen på 390 px.

**Gjenstår:** formell vurdering mot WCAG-nivået som kreves, tilgjengelighets­-
erklæring, og test med skjermleser og med faktiske brukere over 75.

---

## J16 · Skatt, rapportering og merverdiavgift · **B**

Tre spørsmål, ingen av dem avklart:

1. **Hjelperens inntekt.** Har plattformen rapporteringsplikt? Skal det trekkes
   skatt, eller er hjelperen selv ansvarlig? Svaret henger sammen med J6.
2. **Arbeidsgiverbetalte oppdrag.** `SALG.md` tar opp at dette trolig er
   skattepliktig naturalytelse, og gjør det uoppfordret. Det må bekreftes før
   første bedriftsavtale, ikke etter.
3. **Merverdiavgift.** Skal det beregnes mva på serviceavgiften? På hele
   kundeprisen? Enkelte helse- og omsorgstjenester er unntatt — men vi leverer
   ikke helsetjenester, og det taler for at unntaket ikke gjelder oss. Er det
   feil, er hele prismodellen i `pris.js` regnet uten en post på opptil 25 %.

Punkt 3 er det med størst tallmessig konsekvens og bør avklares først.

---

## J17 · Varemerke og domene · **C**

Behandlet i `MERKEVARE.md` og besluttet i `SYNTESE.md` B7. Juridisk gjenstår
varemerkegransking i alle fire markeder, klasseregistrering, og domenesituasjonen
— inkludert at «pårørende» gir punycode-domene utenfor Norge.

Verifiseringsmerket bør vurderes registrert separat fra selskapsnavnet. Det er
merket som bærer tillitsløftet, og det skal overleve et navnebytte.

---

## J18 · Databehandleravtaler og overføring · **B**

`docs/GDPR.md` lister leverandørkategoriene og krever databehandleravtale for
hver. `TEKNOLOGI.md` velger drift i EU/EØS.

**Gjenstår:** faktiske avtaler med ID-kontrolleverandør, betalingsleverandør,
SMS-leverandør, sky- og kartleverandør, samt vurdering av om noen av dem har
underleverandører utenfor EØS. En SMS-leverandør med amerikansk morselskap er ikke
automatisk et problem, men det er heller ikke automatisk greit.

---

## J19 · Aldersgrense og legitimasjonskontroll · **C**

`bli-hjelper.html` krever fødselsdato og avviser under 18 år, og en test dekker
det. Kontrollen er selvrapportert til ID-kontrollen er gjennomført.

**Gjenstår:** om 18 år er riktig grense for alle oppdragstyper, og om enkelte
oppdrag bør ha høyere aldersgrense.

---

## J20 · Referansepersoner er registrerte som aldri meldte seg på · **B**

Dette er ikke nevnt i noe annet dokument.

`bli-hjelper.html` krever to referanser med navn og telefonnummer. `DRIFT.md`
beskriver en strukturert samtale der svarene skrives ned, og `drift.html` viser
lagrede sitater fra referansene.

Referansepersonen har aldri registrert seg hos oss. Hun er likevel en registrert
person, opplysningene om henne kommer fra en tredjepart, og vi lagrer hennes
vurdering av en annen person.

**Følger av det:**

- Hun skal informeres om hvem vi er og hva vi gjør med svaret, senest ved første
  kontakt.
- Hun har innsynsrett i det vi har notert — også i det negative.
- Søkeren som blir avvist på grunn av en referanse, har innsynsrett i begrunnelsen,
  som kan avsløre hvem som sa hva.

De to siste kan komme i konflikt. Det må løses før første referansesamtale, ikke
etter den første klagen. Praktisk mulig løsning: skriv ned vurderingen, ikke
sitatet.

---

## J21 · Avslagsgrunner og utestengelse som svarteliste · **C**

`drift.html` lagrer avslagsgrunn på søknad, og `DRIFT.md` beskriver permanent
utestengelse ved alvorlige brudd. Et register over personer vi har avvist, med
begrunnelse, er en samling som må ha eget grunnlag og egen lagringstid.

**Må avklares:** hvor lenge en avvist søknad kan beholdes, om en utestengt person
kan kreve sletting, og hvordan vi da hindrer at samme person registrerer seg på
nytt uten å beholde nettopp de opplysningene sletting skulle fjerne.

---

## Det som rettes nå, uavhengig av juridisk svar

Tre av funnene er feil uansett hvordan regelverket tolkes:

| Funn | Handling |
|---|---|
| J3 forhåndsavkrysset samtykke | **Rettet.** Avkryssingen fjernet, teksten sier hva som deles |
| J2 personvernerklæringen dekker ikke utlevering om den eldre | **Rettet.** Nytt avsnitt i `personvern.html` §6 |
| J4 vilkår som ikke finnes | Boksen viser nå at vilkårene er under arbeid, i stedet for å late som de finnes |

De to første er gjort i denne gjennomgangen. Den tredje er en midlertidig ærlighet
til vilkårene faktisk er skrevet.

---

## Hvis modellen endres

Registeret over gjelder markedsplassmodellen. Blir første versjon i stedet et
koordineringsverktøy for familien, endres bildet vesentlig: ni risikoer bortfaller,
fire krymper, tre skjerpes, og seks nye kommer til. Se `PIVOT-KOORDINERING.md`.

Ett spørsmål er felles for begge modeller og bør stilles uansett hva som velges:
hva som kreves for at familien kan handle på vegne av en person som ikke fullt ut
kan samtykke selv.

## Til juridisk rådgiver, samlet

Fire spørsmål avgjør om modellen bærer, og bør stilles først:

1. **Arbeidsrettslig status** (J6) — avgjør pris, forsikring, skatt og vaktansvar.
2. **Betalingsformidling** (J11) — avgjør om pengestrømmen i det hele tatt er lovlig satt opp.
3. **Merverdiavgift** (J16) — kan legge opptil 25 % på en prismodell som er regnet uten.
4. **Samtykke på vegne av en person med svekket kognisjon** (J1, J2) — avgjør om
   kjerneproduktet, at datteren organiserer for moren, kan leveres slik det er tegnet.

Deretter resten, i rekkefølgen alvorsgraden angir.

Vi ber ikke om en generell vurdering. Vi ber om svar på disse, med utgangspunkt i
at tjenesten formidler praktisk hjelp, ikke helsehjelp, og at posisjonsdata ikke
settes i drift før DPIA er signert.

---

## J22 · Språkkrav som indirekte diskriminering · **B**

Vi krever B1 for å arbeide alene og B2 for følge til avtale, koordinering og alt
som grenser mot helsehjelp.

Et språkkrav rammer i praksis personer med en bestemt etnisitet eller nasjonal
opprinnelse hardere enn andre. Det er lovlig bare når det har et saklig formål,
er nødvendig for å oppnå formålet, og ikke er uforholdsmessig inngripende.

Tre grep er tatt for å gjøre kravet forsvarlig:

1. Nivået henger på **oppgaven**, ikke på personen, og hver oppgave har en
   oppgitt begrunnelse for hvorfor nivået er nødvendig
   (`OPPGAVEKRAV` i `assets/js/besok-sprakkrav.js`).
2. Kravet gjelder likt for alle, også for dem som har språket som morsmål.
3. Nivået kan dokumenteres på tre likeverdige måter – prøvebevis, utdanning på
   språket, eller en strukturert samtale hos leverandøren. Det er ikke bundet
   til én bestemt prøve som koster penger og har ventetid.

Vurderingen gjøres av **leverandøren**, som er arbeidsgiver. Naviar vurderer
ingen. Det er både riktig rollefordeling og en risiko mindre: en
vurderingsavgjørelse fra oss ville vært en avgjørelse om en annens
arbeidsforhold.

**Må avklares:** om B2 for «følge til avtale» er forholdsmessig, eller om
begrunnelsen «må gjengi det legen sa riktig» heller taler for at oppgaven bør
ha andre sikkerhetstiltak enn et språkkrav.

---

## J23 · Sperring på språknivå som automatisert avgjørelse · **B**

Dette er ikke nevnt i noe annet dokument.

`kanUtfore()` sperrer automatisk en tildeling når bekreftet språknivå ikke holder
for oppgaven. For medarbeideren betyr det færre oppdrag – altså mindre inntekt –
uten at et menneske har sett saken.

Vi mener det ikke er en avgjørelse etter art. 22, fordi den ikke er utelukkende
automatisert: leverandøren har selv lagt inn nivået, og leverandøren kan endre
det. Sperren utfører leverandørens egen beslutning, den treffer den ikke.

Det er vår vurdering, ikke en avklaring.

**Må avklares:** om resonnementet holder, og om det uansett bør logges som en
beslutning med begrunnelse som medarbeideren kan be om å få se. Begrunnelsen
finnes allerede i returverdien – spørsmålet er om den skal vises til den det
gjelder, og ikke bare til den som planlegger.

---

## J24 · Behovsplattformen behandlet til Naviars eget formål · **A** · rettet

`besok-behov.js` samlet etterspørsel som ikke ble tatt imot, og gjorde den om til
forslag om nye tjenester. Den lagret kundens egen formulering, kundeidentifikator
og inntil tre eksempelsitater per kategori.

Formålet var **vårt**: å utvikle produktet. Naviar er databehandler for
leverandøren og skal bare behandle etter instruks. En databehandler som behandler
opplysninger til egne formål, regnes som behandlingsansvarlig for den
behandlingen. Det ville gitt oss selvstendig ansvar for en samling fritekst fra
eldre menneskers hjem – den verst tenkelige kategorien å oppdage at man eier.

**Rettet:** analysen teller i stedet for å huske. Ut kommer kategori, antall,
antall ulike kunder og måned. Ingen fritekst, ingen kundeidentifikator, ingen
dato. En test kontrollerer at verken tekst eller kundenøkkel finnes i
returverdien.

**Gjenstår:** om den aggregerte statistikken kan brukes av Naviar på tvers av
leverandører, eller om også det krever et punkt i databehandleravtalen. Tallet
«ni kunder spurte om hagearbeid» er ikke en personopplysning, men det er
leverandørens forretningsinformasjon.
