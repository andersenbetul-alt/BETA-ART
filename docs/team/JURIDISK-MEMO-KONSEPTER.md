# Juridisk forskningsnotat – konseptene i pilot v1

**Dette er ikke juridisk rådgivning.** Ingen her er jurist. Notatet er en
kartlegging til advokatkontroll: hvor konseptene våre berører regelverk, hva
som er kontrollert mot kode og kilde, hva som er uavklart, og hva en norsk
advokat må svare skriftlig på før pilot. Ingenting under er en konklusjon om
gjeldende rett.

Skrevet 25.08.2026. Gjelder produktet vi selger nå (B2B), ikke markedsplassen.

---

## Metode, og hva «verifisert» betyr i dette notatet

Alle sju primærdomenene er **blokkert for direkte henting** fra dette miljøet.
Proxyen svarte 403 på CONNECT til `lovdata.no` og `eur-lex.europa.eu`, og
`EGRESS_BLOCKED` på `arbeidstilsynet.no`, `datatilsynet.no`, `regjeringen.no`
og `helsedirektoratet.no`. Det er **«kom ikke fram»**, ikke «ingen treff» – og
de to må aldri forveksles (`docs/NAVNET.md`).

Det som gikk, var søk mot de samme domenene. Kildene er derfor merket i tre
nivåer, og merket står i kildelista:

| Merke | Betyr |
|---|---|
| **[S]** | Tekstutdrag returnert fra primærdomenet gjennom søkeindeksen i denne økten. URL bekreftet. Ordlyden er ikke lest direkte fra kilden |
| **[B]** | Blokkert. URL og tittel er bekreftet i søkeindeksen, men ingen tekst er hentet. Siteres ikke som verifisert |
| **[M]** | Fra modellkunnskap. Ingen kildebekreftelse i denne økten. Må verifiseres |

Thomson Reuters, Westlaw, Lovdata Pro og andre betalte rettskildebaser er
**ikke tilgjengelige i dette miljøet**. Ingen dom, forarbeid eller
tilsynsuttalelse i notatet er kontrollert i fulltekst. Alle **[M]**-merker er
oppgaver til advokaten, ikke påstander fra oss.

Kodefunnene er derimot kontrollert direkte: hver påstand om produktet har
filreferanse og linjenummer, og er lest i filen.

---

## 1 · Spørsmålet

Holder de tre konseptene vi har designet seg innenfor gjeldende norsk rett og
EU-/EØS-rett?

1. **Fast tjenestekatalog med automatisk tildeling av lavrisikooppdrag via
   KI-agenter** – fire kategorier i `assets/js/katalog.js`, tildeling via
   `assets/js/besok-agenter.js` og `assets/js/matching.js`.
2. **Kategorisering av medarbeidere etter kompetanse** – `hjelper.oppgaver`
   som eneste kompetansefelt, brukt både av katalogen og av matchingmotorens
   `kvalifisert`-krav.
3. **Karriereside uten helse-, kjønns- eller attestkrav** –
   `besok/bli-medarbeider.html` og `assets/js/hjelper-opptak.js`.

Underspørsmål: hvor er vi trygge, hvor er vi usikre, og hva må avklares før
pilot?

---

## 2 · Kort svar

**Konsept 3 (karrieresiden) er det tryggeste vi har.** Å ikke spørre om helse,
å ikke kreve politiattest uten hjemmel, og å beskrive arbeidet i stedet for å
kreve egenskaper ved personen, er ikke bare forsvarlig – det er den formen
regelverket peker mot. Arbeidsmiljøloven § 9-3 forbyr arbeidsgiver å innhente
helseopplysninger utover det som er nødvendig for å utføre arbeidsoppgavene
[S: lovdata.no, aml. kap. 9]. Politiattest kan bare kreves der lov eller
forskrift åpner for det [S: datatilsynet.no; regjeringen.no]. Begge deler står
allerede i koden som regler, ikke som holdninger.

**Konsept 2 (kompetansekategorisering) er trygt i sin kjerne og usikkert i én
kant.** Kompetanse er ikke et diskrimineringsgrunnlag. Men matchingmotoren
filtrerer også på `kravEgenskaper` fra familien – der kommentaren i koden
nevner «god fysisk form» – og scorer på `sprakonske`. Det første grenser mot
helseopplysninger som kunden bestiller, det andre mot indirekte
forskjellsbehandling.

**Konsept 1 (automatisk tildeling) er der usikkerheten faktisk ligger**, og
den er større enn risikoregisteret i dag sier. To ting:

- `docs/team/PIVOT-KOORDINERING.md` linje 45 slår fast at J7
  (plattformarbeid og algoritmisk styring) **bortfaller** fordi «ingen
  algoritme fordeler inntektsgivende arbeid». Det stemmer ikke med koden.
  Agent 4 rangerer leverandørens ansatte, agent 5 sender tilbud og går videre
  til neste ved avslag, og begge står som `auto` i `besok-agenter.js`. En
  algoritme fordeler inntektsgivende arbeid. Om direktivet treffer *oss* eller
  *leverandøren* er et åpent spørsmål – at premisset i tabellen er feil, er
  det ikke.
- KI-forordningen gjelder etter hovedregelen fra 2. august 2026 [S:
  regjeringen.no], altså allerede. Agentkjeden fordeler oppgaver og følger med
  på hvordan de utføres. Om det er et høyrisikosystem etter vedlegg III, er
  ikke noe vi kan avgjøre selv – men spørsmålet er forfalt, ikke framtidig.

**Ett funn krever ingen tolkning og bør rettes uansett:** produktet har to
risikotabeller for de samme fire tjenestene, med ulike id-er og ulikt
risikonivå. Se § 3.7. Det er en kodefeil med juridisk virkning, ikke et
juridisk spørsmål.

---

## 3 · Drøfting, gruppert etter rettskilde

### 3.1 Arbeidsmiljøloven § 1-8 med 2024-endringen – klassifisering av hjelperne

**Regelen.** Arbeidstakerbegrepet ble presisert med virkning fra 1. januar
2024, og det ble innført en presumpsjonsregel: arbeidstakerforhold legges til
grunn med mindre oppdragsgiveren gjør det overveiende sannsynlig at det
foreligger et selvstendig oppdragsforhold. Bevisbyrden ligger på
oppdragsgiveren [S: regjeringen.no, Prop. 14 L (2022–2023); S: regjeringen.no,
endringer fra 1.1.2024]. Forarbeidene beskriver regelen som et strengere
beviskrav som ikke i seg selv endrer den rettslige vurderingen eller
vektingen av momentene [S: samme]. **Ordlyden i § 1-8 annet ledd er ikke lest
i denne økten [M].**

**Hvor produktet treffer den.** `assets/js/hjelper-opptak.js` linje 32–48
holder en port: `ARBEIDSFORHOLD.avklart = false`, og `kanAktiveres()`
(linje 431) legger «arbeidsforholdet er ikke avklart for tjenesten» i
mangellista for enhver kandidat. Modellen `styrt_frilans` er uttrykkelig
avvist med begrunnelsen at kontroll over pris, oppdrag og utførelse peker mot
ansettelse uansett hva avtalen kalles. Det er riktig plassert: en port, ikke
et felt.

I B2B-modellen er leverandøren arbeidsgiver, og klassifiseringsspørsmålet er
allerede avgjort hos dem. Naviar er ikke oppdragsgiver for medarbeideren.
Presumpsjonsregelen i § 1-8 retter seg mot forholdet mellom oppdragsgiver og
den som utfører arbeidet, og treffer da leverandøren, ikke oss.

**Der det likevel skurrer.** `assets/js/matching.js` bærer fire felter som
hører til markedsplassmodellen og ikke til B2B:

- `tillitsniva` og `tillitsscore` (linje 40–47, 144) – en score som avgjør
  hvilke oppdrag en person i det hele tatt får se
- `iProveperiode` (linje 78–82) – systemet begrenser hvilke oppdrag en person
  får, basert på hvor langt hun har kommet
- `timesats` mot `maksTimesats` (linje 120–123) – pris som rangeringskriterium
- `egenskaper` som absolutt filter (linje 55–71)

`assets/js/katalog.js` linje 14–17 binder pilotkatalogen uttrykkelig til denne
motoren: «matchingmotorens `kvalifisert`-krav gjelder uendret». Pilotproduktet
knytter seg altså til en motor som setter tillitsnivå, begrenser i prøvetid og
vekter pris. Det er nøyaktig de fire kjennetegnene `docs/FORRETNINGSMODELL.md`
selv beskriver som ledelse og kontroll.

Motoren gjør riktignok dette på leverandørens ansatte, som allerede *er*
ansatte. Men om Naviar som programvareleverandør styrer pris og
oppdragstilgang for en annen virksomhets ansatte, er det et spørsmål om
ansvarsfordeling som ingen av dokumentene våre stiller i dag.

**Alvorsgrad: B.** Blokkerer ikke pilot alene, men må avklares før Bolk A
ferdigstilles. Se også J6 i `docs/team/JURIDISK-RISIKO.md`.

---

### 3.2 Helsepersonelloven § 3 og helse- og omsorgstjenesteloven – grensen mot helsehjelp

**Regelen.** Med helsehjelp menes enhver handling som har forebyggende,
diagnostisk, behandlende, helsebevarende, rehabiliterende eller pleie- og
omsorgsformål, **og som utføres av helsepersonell** [S: helsedirektoratet.no,
helsepersonelloven med kommentarer § 3]. Forebygging er uttrykkelig nevnt:
tiltak som tar sikte på å forebygge at sykdom, skade, lidelse eller
funksjonshemning oppstår [S: samme].

Praktisk bistand etter helse- og omsorgstjenesteloven omfatter nødvendig hjelp
til dagliglivets praktiske gjøremål i hjemmet og i tilknytning til
husholdningen – handling, følge til avtaler, hjelp til å komme opp om
morgenen. Personlig stell er en egen del: hjelp til egenomsorg og personlig
hygiene, dusjing, toalettbesøk, påkledning [S: helsedirektoratet.no,
helse- og omsorgstjenesteloven med kommentarer § 3-2].

**Hvorfor samme oppgave bytter kategori.** `docs/PROFILREFERANSER.md` § 4
beskriver funnet presist, fra en reell utlysning: hos en privat
hjemmetjenesteleverandør regnes praktisk bistand **under kommunalt vedtak**
som helsehjelp, med journalføring etter lovverket og politiattest før
ansettelse. Samme støvsuging, samme klesvask, samme handling – men juridisk
kategori bestemt av hvem som leverer den under hvilket vedtak.

Definisjonen i § 3 forklarer mekanikken: handlingen blir helsehjelp når den
utføres av helsepersonell, og hvem som regnes som helsepersonell henger blant
annet på om personen yter helsehjelp i helse- og omsorgstjenesten. **Den
delen av § 3 er ikke lest i denne økten [M].** At det er bevegelsen som
skjer, er likevel dokumentert i praksis gjennom PROFILREFERANSER § 4.

**Hvor produktet treffer den.** Katalogens `aldri`-lister
(`assets/js/katalog.js` linje 35–38, 53–57, 75–79, 93–98) holder grensen godt
på de fire kategoriene. Ett punkt ligger nærmere kanten enn de andre: «Si fra
til familien om snublefarer og mørk belysning» (linje 73), som kommentaren
selv begrunner med fallforebygging. Det er en observasjon som meldes, ikke en
vurdering som gjøres, og ordlyden er valgt bevisst. Men fallforebygging er et
forebyggende formål, og det er nøyaktig det ordet definisjonen bruker.

**Den alvorlige spenningen ligger et annet sted.**
`docs/JURIDISK-GRENSE.md` (avsnittet om taushetsplikt) tar den bevisste
beslutningen at vi *ikke spør* hvilken hatt leverandøren har på i det enkelte
besøket, og behandler alle besøk som om taushetsplikten gjelder. Det er en god
beslutning for taushetsplikten. Men den samme uvitenheten treffer
dokumentasjonsplikten motsatt vei:

Ytes besøket under et kommunalt vedtak, kan leverandøren ha journal- og
dokumentasjonsplikt for det som ble gjort. Naviar er da bygget slik at
leverandøren ikke kan oppfylle den i vårt system:

- `PP_VERN.sjekk()` blokkerer helseord i fritekst før lagring, og det blokkerte
  innholdet lagres ikke – heller ikke som bevis på blokkeringen
  (`assets/js/besok-vern.js`)
- All fritekst forsvinner etter 7 dager, navn etter 30, resten krympes etter
  365 (`SLETTEPLAN`, samme fil)
- Rapporten er fem faste utfall uten helseinnhold

Vi har altså designet et system som aktivt hindrer den dokumentasjonen
leverandøren kanskje er pålagt å produsere. Svaret i `JURIDISK-GRENSE.md` er
at leverandøren eksporterer til egne systemer. Det svaret må holde juridisk,
ikke bare praktisk – og det er ikke kontrollert.

**Alvorsgrad: A.** Dette bør avklares før første leverandør som også har
kommunale avtaler settes i drift.

---

### 3.3 Politiregisterloven og hjemmelskravet for politiattest

**Regelen.** En arbeidsgiver kan bare kreve politiattest av arbeidssøkere når
det er fastsatt i lov eller forskrift at det er adgang til å kreve det
[S: datatilsynet.no, «Vandelskontroll og politiattest»]. Politiet kan bare
utlevere opplysninger i forbindelse med vandelskontroll når det foreligger
hjemmel i lov eller forskrift [S: samme]. Politiregisterloven § 37 angir
hvilke formål som kan begrunne slike bestemmelser, men gir ikke selv hjemmel
for å utstede attest – den peker på hvilke formål det bør utstedes hjemler
for [S: regjeringen.no, høringsnotat om hjemmel for å kunne kreve
politiattest]. Hjemmel skal som utgangspunkt forankres i
spesiallovgivningen; på områder uten slik regulering må den forankres i
politiregisterforskriften [S: samme; S: lovdata.no, politiregisterforskriften
kap. 34 «Politiattest på områder uten lovregulering»].

**Hvor produktet treffer den.** `assets/js/hjelper-opptak.js` linje 107–112:

```js
var POLITIATTEST = {
  kanKreves: false,
  hvorfor: 'Krever hjemmel i lov eller forskrift for denne typen arbeid',
  forBruk: 'Skriftlig vurdering fra jurist',
  ikkeSi: 'Alle medarbeiderne våre er kontrollert av politiet'
};
```

Dette er riktig, og `ikkeSi`-feltet er den beste delen av det: det hindrer
ikke bare kravet, det hindrer løftet. `assets/js/hjelper-base.js` linje 57
gjentar det i `FINNES_IKKE`, og karrieresiden ber ikke om attest.

**Det uavklarte.** PROFILREFERANSER § 4 dokumenterer at den private
leverandøren vi selger til, *krever* politiattest før ansettelse fordi de
mener de har hjemmel gjennom det kommunale vedtaket. Det gir oss to spørsmål
vi ikke har stilt:

1. Rekker hjemmelen for personell i den kommunale helse- og omsorgstjenesten
   ut til en privat leverandør som utfører praktisk bistand på kommunens vegne?
   **Hjemmelsbestemmelsen er ikke identifisert i denne økten [M].**
2. Kan Naviar lagre *at* leverandøren har kontrollert attesten – et felt
   `politiattest: fremlagt` – uten selv å ha hjemmel? Opplysning om at en
   attest er fremlagt og godtatt, er en opplysning avledet av
   straffedomsregisteret. Personvernforordningen har en egen bestemmelse om
   opplysninger om straffedommer og lovovertredelser som skranke her
   **[M – artikkelen er ikke kontrollert i denne økten]**.

Spørsmål 2 er nytt. Det står ikke i J10 i risikoregisteret, som handler om
vårt eget krav, ikke om lagring av leverandørens kontroll.

**Alvorsgrad: B.** Ingen kode gjør dette i dag – feltet finnes ikke. Men det
er det første leverandøren vil be om.

---

### 3.4 Likestillings- og diskrimineringsloven – kjønn, alder og helse

**Regelen.** Diskriminering på grunn av kjønn, graviditet, permisjon ved
fødsel eller adopsjon, omsorgsoppgaver, etnisitet, religion, livssyn,
funksjonsnedsettelse, seksuell orientering, kjønnsidentitet, kjønnsuttrykk,
alder eller kombinasjoner av disse er forbudt (§ 6) [S: lovdata.no, kap. 2].
Indirekte forskjellsbehandling er enhver tilsynelatende nøytral bestemmelse,
betingelse, praksis, handling eller unnlatelse som vil stille personer
dårligere enn andre, på grunnlag nevnt i § 6 (§ 8) [S: samme]. I
arbeidsforhold er direkte forskjellsbehandling på grunn av kjønn, etnisitet,
religion, livssyn, funksjonsnedsettelse, seksuell orientering,
kjønnsidentitet og kjønnsuttrykk bare tillatt hvis egenskapen har avgjørende
betydning for utøvelsen av arbeidet eller yrket (§ 9) [S: samme].

Arbeidsmiljøloven § 9-3 forbyr arbeidsgiver å be om helseopplysninger utover
det som er nødvendig for å utføre arbeidsoppgavene, og forbyr også å iverksette
tiltak for å innhente dem på annen måte [S: lovdata.no, aml. kap. 9].

**Hvor vi står godt.** `assets/js/hjelper-opptak.js` linje 99–100:

```js
var IKKE_KRITERIUM = ['alder', 'opprinnelse', 'kjønn', 'religion',
                      'legning', 'familiesituasjon', 'navn'];
```

Karrieresiden (`besok/bli-medarbeider.html` linje 58–64) beskriver arbeidet i
stedet for å kreve egenskaper ved personen: «du går, står og bærer lette
handleposer. Vi spør ikke om helsen din – du vurderer selv om arbeidet passer
for deg.» Det er den formen § 9-3 peker mot, og den er dessuten en bedre
tekst. `PROFILREFERANSER.md` § 1 viser hva vi lot ligge: bestemt kjønn, «god
fysisk og psykisk helse», flytende norsk – alle tre krav som står i ekte
utlysninger, og alle tre utenfor oss.

Alderskravet er stilt som «Er du fylt 18 år?» med `lagres: 'ja/nei'` og
`lagresIkke: 'fødselsdato'` (`assets/js/hjelper-base.js` linje 63). Et ja/nei
kan ikke brukes til å sortere kandidater etter alder. Det er datamodellen som
håndhever regelen, ikke disiplinen – slik det skal være.

**Hvor vi er usikre.** Tre steder, alle i matchingmotoren:

1. **`kravEgenskaper` som absolutt filter** (`assets/js/matching.js` linje
   55–71). Kommentaren i koden nevner «ikke-røyker, god fysisk form, kan
   løfte» som eksempler. «God fysisk form» som et krav familien setter og
   systemet håndhever, er i praksis en helseopplysning som kunden bestiller og
   vi lagrer. At kravet kommer fra kunden gjør det ikke saklig etter § 9. Selve
   verdilista finnes ikke i koden i dag – bare kommentaren – så dette er en
   grense som må settes før feltet fylles, ikke etter.
2. **`sprakonske` som scorekriterium** (linje 145, vekt 10 av 100). Språk
   korrelerer med etnisitet. At det er en score og ikke et filter demper
   virkningen, men fjerner ikke spørsmålet etter § 8. B1/B2-kravet i seg selv
   er allerede J22.
3. **Skjevhetskontrollen vi har lovet, men ikke kan utføre.**
   `assets/js/besok-agenter.js` linje 66 sier at «rangeringen kontrolleres
   jevnlig for utslag på kjønn, alder og opprinnelse». Vi lagrer ingen av de
   tre. Løftet kan ikke innfris med de dataene vi har, og J8 i risikoregisteret
   navngir spenningen uten å løse den. Enten må løftet endres, eller så må det
   finnes et grunnlag for å behandle særlige kategorier til nettopp dette
   formålet – se § 3.5 og § 3.7.

**Alvorsgrad: B**, med ett unntak: punkt 3 er et løfte i koden vi ikke kan
holde, og det er samme feilform som «alle har politiattest». Det bør enten
bygges eller omformuleres, ikke stå.

---

### 3.5 Personvernforordningen art. 9, 22 og 28

**Art. 9 – særlige kategorier.** Behandling av blant annet helseopplysninger
er i utgangspunktet forbudt; systemet er at det må foreligge et særskilt
grunnlag i art. 9 i tillegg til et behandlingsgrunnlag [S: datatilsynet.no,
«Særlige kategorier av personopplysninger»]. Unntakene er mange og har
forbehold [S: samme].

Naviars svar er å unngå opplysningene, ikke å beskytte dem:
`assets/js/besok-vern.js` `LAGRES_ALDRI` (linje 43–48) og
`assets/js/hjelper-base.js` `FINNES_IKKE` (linje 46–58). Det er den sterkeste
formen for etterlevelse som finnes – et felt som ikke er laget kan ikke fylles
ut. To løse tråder: `kravEgenskaper` (§ 3.4 punkt 1), og skjevhetskontrollen
(§ 3.4 punkt 3), som *forutsetter* særlige kategorier for å kunne utføres.

**Art. 22 – automatiserte avgjørelser.** Den registrerte har rett til ikke å
være gjenstand for en avgjørelse som utelukkende er basert på automatisert
behandling, herunder profilering, som har rettsvirkning for eller på
tilsvarende måte i betydelig grad påvirker vedkommende [S: datatilsynet.no,
«Rettar ved automatiserte avgjerder»]. Er behandlingen en automatisert
avgjørelse etter art. 22, stilles ekstra krav til åpenhet: informasjon om at
avgjørelsen er automatisert, om retten etter art. 22, og meningsfull
informasjon om den underliggende logikken [S: samme].

Produktet er bygget med dette for øye, og bygget godt der det gjelder de store
avgjørelsene: `KREVER_MENNESKE` (`besok-agenter.js` linje 138–151) holder
permanent stenging, klage, tap og samtykkespørsmål hos et menneske; `ALDRI`
(linje 154–164) fjerner ni ting som funksjon; `settStatus()` i
`besok-klage.js` nekter å sette rødt uten `satt_av`, `grunn` og `varslet`.
Beslutningsloggen har sju obligatoriske felter, og `loggpost()` kaster feil
hvis ett mangler (linje 231–235).

Det uavklarte er de små avgjørelsene, ikke de store:

- Er én automatisk tildeling en avgjørelse som «i betydelig grad påvirker»
  medarbeideren? Neppe alene.
- Er *mønsteret* av tildelinger det? `AUTOMATISK` (linje 123–134) inneholder
  `ranger` og `neste`. Over tid avgjør rangeringen hvem som får arbeid og hvor
  mye. Ingen enkeltavgjørelse er stor. Summen kan være det.
- J23 stiller allerede spørsmålet for språknivåsperren. Det samme spørsmålet
  gjelder `tillitsniva` og `iProveperiode` i `matching.js`, som er sperrer med
  samme form og større virkning.

**Art. 28 – databehandlerrollen.** Behandlingsansvarlig bestemmer formål og
midler; databehandleren behandler bare etter instruks og kan ikke behandle
personopplysninger på annen måte enn det som står i avtalen [S:
datatilsynet.no, «Behandlingsansvarlig og databehandler»; S: samme,
«Hvordan lage en databehandleravtale»]. Etter art. 28 nr. 10 anses en
databehandler som selv fastsetter formål og midler, som behandlingsansvarlig
for den behandlingen [S: samme].

`JURIDISK-GRENSE.md` kaller dette den viktigste enkeltsetningen i hele
dokumentet, og det er riktig. Det traff oss allerede én gang (behovsplattformen,
J24, rettet). Men rollefordelingen er ikke like klar overalt:

- Vi utformer familiemeldingen og bestemmer hva som kan skrives i den
  (`besok-vern.js` sperrer, `besok-agenter.js` agent 7 formulerer). Det er å
  bestemme midler, og til dels formål. Spørsmålet står som nr. 1 i
  `JURIDISK-GRENSE.md` sin egen liste.
- Slettefristene er våre, ikke leverandørens. `SLETTEPLAN` er en beslutning vi
  har tatt på deres vegne. Leverandøren kan sette kortere frister, ikke lengre
  (`besok-vern.js` linje 81). En databehandler som bestemmer hvor lenge den
  behandlingsansvarlige får lagre, bestemmer midler.
- Referansepersonene (`hjelper-base.js` linje 34, `frist: 'referanse'`, 90
  dager) er registrerte som aldri meldte seg på. J20 dekker dette. Vi fant
  ingen håndtering av informasjonsplikten overfor dem i koden.

**Alvorsgrad: B**, unntatt rollespørsmålet om familiemeldingen, som allerede
står som A.

---

### 3.6 Plattformarbeidsdirektivet (EU) 2024/2831 art. 9–10

**Regelen, slik den er bekreftet.** Direktivet ble vedtatt 23. oktober 2024,
publisert 11. november 2024 og trådte i kraft i EU 1. desember 2024.
Gjennomføringsfristen for medlemsstatene er 2. desember 2026. Arbeids- og
inkluderingsdepartementet anser direktivet **EØS-relevant og akseptabelt**
[S: regjeringen.no, EØS-notat «Plattformdirektivet»].

Kapittel 3 regulerer algoritmisk styring. Artiklene 7–11 og 15 gjelder overfor
alle som utfører plattformarbeid – både arbeidstakere og selvstendige
oppdragstakere – mens artiklene 12–14 bare gjelder plattformarbeidere
(arbeidstakere) [S: samme]. Reglene om **jevnlig menneskelig gjennomgang** av
virkningen av enkeltavgjørelser som treffes eller støttes av automatiserte
overvåkings- eller beslutningssystemer, og som er av betydning for
arbeidsvilkår og likebehandling, med involvering av arbeidstakernes
representanter, beskrives i EØS-notatet som **artikkel 10 og 11** [S: samme].

> **Merk – nummereringen spriker.** `docs/MATCHING.md` linje 61 siterer
> «art. 9–10», oppgaveteksten sier «art. 9–10», og EØS-notatet sier «artikkel
> 10 og 11» om menneskelig tilsyn. Direktivteksten er **[B]** – eur-lex er
> blokkert herfra, og vi har ikke lest artiklene. **Ingen av
> artikkelhenvisningene i repoet er verifisert [M].** Advokaten må fastsette
> riktig nummerering før den siteres i vilkår eller markedsmateriell.

**Definisjonen som avgjør alt.** En digital arbeidsplattform er etter
EØS-notatet en fysisk eller juridisk person der tjenesten leveres helt eller
delvis elektronisk, skjer på anmodning fra en tjenestemottaker, har som
nødvendig og vesentlig del at arbeid organiseres og utføres av enkeltpersoner
mot betaling, og som bruker automatiserte overvåkings- eller
beslutningssystemer. Plattformarbeid er arbeid organisert gjennom en digital
arbeidsplattform, utført på grunnlag av **et kontraktsforhold mellom den
digitale arbeidsplattformen eller en mellommann og den fysiske personen**
[S: regjeringen.no, EØS-notat].

**Hvor produktet treffer den.** Naviar leverer elektronisk, på anmodning fra
leverandørens kunde, og organiserer arbeid utført av enkeltpersoner mot
betaling – med automatiserte beslutningssystemer, som er hele
agentarkitekturen. Fire av fem elementer treffer uten videre.

Det femte er der argumentet vårt ligger: Naviar har **ikke** kontraktsforhold
med medarbeideren. Hun er ansatt hos leverandøren. Etter definisjonen av
plattformarbeid kan det peke mot at *leverandøren* – ikke Naviar – er den
digitale arbeidsplattformen når de bruker vårt verktøy til å fordele arbeid
til sine egne ansatte. Det ville i så fall gjøre pliktene til leverandørens,
og forpliktelsene våre til noe vi må levere *dem* som funksjon.

Det er ikke en konklusjon. Det er den to-veis-gaffelen advokaten må lukke, og
begge utfall koster: er det oss, får vi pliktene direkte; er det leverandøren,
må vi bygge det de trenger for å oppfylle dem.

**Der vi ligger godt an uansett utfall.** `matching.js` er bevisst
forklarbar: hver score kommer med begrunnelser, og hvert skjulte oppdrag med
en grunn (`sperre.grunn`, linje 129–169). `KONTROLL` i `besok-agenter.js`
(linje 249–254) gjør menneskelig kontroll til fire avkryssbare krav.
Beslutningsloggen er søkbar per besøk og per agent. Dette bør beholdes uansett
hva regelverket lander på – det er J7 sin egen konklusjon, og den står seg.

**Der `PIVOT-KOORDINERING.md` tar feil.** Linje 45 sier at J7 bortfaller fordi
«ingen algoritme fordeler inntektsgivende arbeid». Kontrollert mot koden:
`besok-agenter.js` linje 63–67 (agent 4 rangerer medarbeidere), linje 68–71
(agent 5 sender tilbud og går videre ved avslag), linje 125 og 128 (`ranger`
og `neste` står i `AUTOMATISK`). Premisset holder ikke.

**Alvorsgrad: B**, med den merknaden at fristen 2. desember 2026 er om litt
over tre måneder, og at EØS-innlemmelse kommer i tillegg til den fristen
[M – tidspunkt for EØS-innlemmelse er ikke kontrollert].

---

### 3.7 KI-forordningen (EU) 2024/1689 – transparens og risikoklassifisering

**Regelen, slik den er bekreftet.** KI-forordningen gjelder etter hovedregelen
fra 2. august 2026 [S: regjeringen.no, «Gjør Norge klar for trygg og innovativ
KI-bruk»]. Norge gjennomfører den ved en henvisningsbestemmelse i en ny lov om
kunstig intelligens; loven var planlagt i kraft på sensommeren 2026, omtrent
samtidig med at hoveddelen av forordningen får anvendelse i EU [S: samme; S:
regjeringen.no, høring om utkast til KI-lov]. **Datoen er altså passert da
dette skrives (25.08.2026). Om den norske loven faktisk er trådt i kraft, er
ikke kontrollert [M].**

Det er **den tiltenkte bruken** som avgjør risikoklassen, ikke KI-systemet i
seg selv. Det samme systemet kan ha lav risiko i én brukssituasjon og høy
risiko i en annen [S: regjeringen.no, EØS-notat om KI-forordningen].
Høyrisikosystemer er definert i art. 6 nr. 1, og i tillegg regnes alle
systemer i vedlegg III som høyrisiko – blant annet systemer brukt til
rekruttering [S: samme]. Systemer i vedlegg III regnes likevel ikke som
høyrisiko dersom de ikke medfører slik risiko eller ikke i vesentlig grad
påvirker beslutningstaking – men **enhver profilering** gjør et
vedlegg III-system til høyrisiko [S: samme].

**Hvor produktet treffer den.** Agentkjeden gjør tre ting som ligger i det
området vedlegg III dekker: den kategoriserer forespørsler, rangerer personer
og fordeler oppgaver, og den følger med på hvordan oppdraget utføres (agent 6,
`tilsyn`). `matching.js` beregner en sammensatt score per person av syv
komponenter. Det er profilering i ordets vanlige betydning.

**Vedlegg III nr. 4 om sysselsetting og arbeidstakerstyring er ikke lest i
denne økten [M].** Søket mot regjeringen.no bekreftet rammen (rekruttering er
nevnt) men ikke punktets ordlyd, og den uoffisielle norske oversettelsen av
forordningen ligger på et blokkert domene **[B]**. Dette er det viktigste
enkeltdokumentet advokaten bør begynne med.

**Åpenhet – der vi står godt.** `besok-agenter.js` linje 39–43:

```js
var AVSENDER = {
  merke: 'Skrevet automatisk av Naviar Care',
  regel: 'Agenten sier aldri «jeg» som om den var en person, og gir seg ' +
         'aldri ut for å være koordinatoren eller medarbeideren.'
};
```

Agent 13 sier i første setning at den er en maskin (linje 113). Merkingen står
i hver melding, ikke i vilkårene. **Ordlyden i KI-forordningen art. 50 om
åpenhet ved samhandling med KI-systemer er ikke funnet i denne økten [M]** –
søket mot både regjeringen.no og datatilsynet.no ga rammeinformasjon, ikke
bestemmelsen. Det vi gjør, virker mer enn tilstrekkelig; men vi kan ikke si at
det er *kravet*, bare at det er praksisen vår.

**Skjevhetskontroll og særlige kategorier.** § 3.4 punkt 3 beskriver et løfte
vi ikke kan innfri uten data vi ikke samler. Det finnes etter modellkunnskap en
bestemmelse i KI-forordningen som åpner for behandling av særlige kategorier
nettopp for å oppdage og korrigere skjevhet i høyrisikosystemer, med
sikkerhetstiltak **[M – bestemmelsen er ikke identifisert eller lest]**.
Finnes den, og treffer den oss, løser den spenningen J8 beskriver. Finnes den
ikke, må løftet i linje 66 endres.

---

### 3.8 Funnet som ikke krever tolkning: to risikotabeller for samme fire tjenester

Dette hører ikke under noen rettskilde, men under alle. Kontrollert direkte i
koden:

| Tjeneste | `PP_KATALOG` (`katalog.js`) | `PP_BESOK.OPPGAVER` (`besok-lager.js`) |
|---|---|---|
| Besøk og samvær | id `besok`, type `samvaer`, risiko **`lav`** | id `samvaer`, risiko **`gronn`** |
| Digital hjelp | id `digital`, risiko **`lav`** | id `digital`, risiko **`gronn`** |
| Lett hjemmehjelp | id `lett-hjemmehjelp`, type `praktisk`, risiko **`lav`** | id `hjemme`, risiko **`gul`** |
| Hent og lever | id `hent-lever`, type `handling`, risiko **`lav`** | id `hent`, risiko **`gul`** |

To virkninger, begge etterprøvbare:

1. **Id-ene stemmer ikke.** `PP_HJELPER.risikoFor()`
   (`hjelper-opptak.js` linje 493–498) kontrollerer oppgave-id mot
   `PP_BESOK.OPPGAVER`. Kalles den med en katalog-id – `lett-hjemmehjelp`,
   `hent-lever` eller `besok` – returnerer den `{ niva: 'rod', handling:
   'avvises', grunn: 'Oppgaven finnes ikke i katalogen' }`. Bare `digital`
   finnes i begge.
2. **Risikonivået stemmer ikke.** Katalogen kaller alle fire `lav`.
   `PP_AGENTER.normaliserRisiko('lav')` gir `'gronn'`, og
   `avgjor('ranger', 'lav')` gir da **`auto`**. Besøkslageret kaller lett
   hjemmehjelp og hent-og-lever `gul`, som gir **`godkjenning`**. Samme
   tjeneste er automatisk i det ene registeret og krever menneskelig
   godkjenning i det andre.

Spørsmålet «hvilke lavrisikooppdrag kan tildeles automatisk» – som er
kjernen i hele konsept 1, og som både plattformdirektivet og KI-forordningen
handler om – har altså to forskjellige svar i koden i dag. Grensen for
menneskelig kontroll må være én grense, ellers er den ikke en grense.

**Alvorsgrad: B**, men den rettes uansett hva advokaten svarer. Dette er ikke
et juridisk spørsmål; det er et sammenslåingsarbeid som må gjøres før pilot og
før noen skriver ned hvor grensen går.

---

## 4 · Åpne spørsmål – det en norsk advokat må avgjøre skriftlig

Nummerert, med hva hvert svar blokkerer.

1. **Er Naviar eller leverandøren «digital arbeidsplattform» etter direktiv
   (EU) 2024/2831?** Definisjonens fem elementer treffer oss på fire; det
   femte – kontraktsforholdet med den som utfører arbeidet – gjør det ikke.
   Begge utfall gir plikter, men til ulike parter. Svaret avgjør om
   `PIVOT-KOORDINERING.md` linje 45 («J7 bortfaller») skal stå eller strykes.
   *Blokkerer: Bolk A trinn 6 og alt vilkårsarbeid om algoritmisk styring.*
   **Grad B.**

2. **Er agentkjeden et høyrisiko-KI-system etter KI-forordningen vedlegg III,
   og hvem er leverandør og hvem er ibruktaker?** Forordningen gjelder etter
   hovedregelen fra 2. august 2026 – altså allerede. Systemet rangerer
   personer, fordeler oppgaver og følger utførelsen. Er svaret ja, følger krav
   til risikostyring, dokumentasjon, logging, menneskelig tilsyn og
   registrering som ingen del av produktet er bygget for i dag.
   *Blokkerer: pilot, hvis svaret er ja.* **Grad A inntil avklart.**

3. **Hva gjør Naviars sperre mot helseopplysninger med leverandørens
   dokumentasjonsplikt når besøket ytes under kommunalt vedtak?** Vi har
   bevisst valgt ikke å vite hvilken hatt leverandøren har på. Er journal- og
   dokumentasjonsplikten da leverandørens alene, og holder eksport til deres
   egne systemer som løsning? *Blokkerer: første leverandør med kommunal
   avtale.* **Grad A.**

4. **Rekker hjemmelen for politiattest i den kommunale helse- og
   omsorgstjenesten ut til privat leverandør som utfører praktisk bistand på
   kommunens vegne – og kan Naviar lagre at leverandøren har kontrollert
   attesten, uten selv å ha hjemmel?** Feltet finnes ikke i dag. Det er det
   første leverandøren vil be om. **Grad B.**

5. **Er `kravEgenskaper` i `matching.js` lovlig som familiestyrt filter?**
   Særlig om verdilista kommer til å inneholde «god fysisk form». Kundens
   ønske er ikke i seg selv et saklig grunnlag etter
   likestillings- og diskrimineringsloven § 9, og opplysningen kan være en
   helseopplysning etter art. 9. **Grad B – må settes før feltet fylles.**

6. **Kan vi behandle særlige kategorier for å oppdage skjevhet i rangeringen –
   det `besok-agenter.js` linje 66 allerede lover at vi gjør?** Uten et
   grunnlag kan løftet ikke innfris, og da må det omformuleres. **Grad B.**

7. **Er `tillitsniva` og `iProveperiode` i `matching.js` automatiserte
   avgjørelser etter art. 22?** Samme spørsmål som J23 stiller for
   språknivåsperren, men med større virkning: de avgjør hvilke oppdrag en
   person i det hele tatt får se. **Grad B.**

8. **Er det forsvarlig at Naviar som databehandler fastsetter slettefristene
   leverandøren må holde seg innenfor?** `besok-vern.js` linje 81:
   leverandøren kan sette kortere frister, ikke lengre. Å bestemme hvor lenge
   den behandlingsansvarlige får lagre, er å bestemme midler. **Grad B.**
   Se også spørsmål 1 og 3 i `JURIDISK-GRENSE.md`.

9. **Hvordan oppfylles informasjonsplikten overfor referansepersonene?** To
   navn og to telefonnumre per søker, lagret i 90 dager, om personer som
   aldri meldte seg på. J20 dekker registreringen; vi fant ingen håndtering av
   informasjonsplikten i koden. **Grad B.**

10. **Er B1 muntlig et forholdsmessig krav for de fire kategoriene i
    pilotkatalogen, som alle er lavrisiko?** J22 stiller spørsmålet generelt;
    her gjelder det konkret for hent-og-lever og lett hjemmehjelp. **Grad B.**

11. **Riktig artikkelnummerering i plattformdirektivet for kravene om
    forklarbarhet og menneskelig tilsyn.** `docs/MATCHING.md` linje 61 sier
    art. 9–10; EØS-notatet sier art. 10 og 11 om menneskelig tilsyn.
    Direktivteksten er ikke lest herfra. Nummereringen må være riktig før den
    siteres utad. **Grad D – men rett den før noen leser den.**

12. **Er «Si fra til familien om snublefarer og mørk belysning»
    (`katalog.js` linje 73) innenfor grensen mot helsehjelp?** Fallforebygging
    er et forebyggende formål, og forebygging står i definisjonen. Vår
    vurdering er at det er en observasjon som meldes, ikke en vurdering som
    gjøres – men vurderingen er vår, ikke en juristens. **Grad C.**

**Ikke et spørsmål til advokaten, men en oppgave til oss:** de to
risikotabellene i § 3.8 må slås sammen. Det er en kodefeil med juridisk
virkning, og den rettes uavhengig av alle svarene over.

---

## 5 · Kilder

Merkene er forklart i metodedelen. **Ingen kilde under er lest i fulltekst fra
primærkilden** – proxyen blokkerte direkte henting til samtlige sju domener.

### Arbeidsrett

1. **[S]** regjeringen.no – *Prop. 14 L (2022–2023) Endringer i
   arbeidsmiljøloven mv. (arbeidstakerbegrepet og arbeidsgiveransvar i
   konsern)* — `https://www.regjeringen.no/no/dokumenter/prop.-14-l-20222023/id2947393/?ch=5`
2. **[S]** regjeringen.no – *Endringer i lover og forskrifter fra 1. januar
   2024 fra Arbeids- og inkluderingsdepartementet* — `.../id3019630/`
3. **[S]** lovdata.no – *Arbeidsmiljøloven kapittel 9, Kontrolltiltak i
   virksomheten* (§ 9-1 flg., § 9-3) —
   `https://lovdata.no/lov/2005-06-17-62/%C2%A79-1`
4. **[S]** arbeidstilsynet.no – *Arbeidsmiljøloven – aml* —
   `https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/`
5. **[S]** regjeringen.no – *Plattformmediert arbeid i Norge* (Fafo-rapport,
   PDF) — `.../contentassets/02c0267d646747e1bfe55a03cacda59e/20925.pdf`

### Helserett

6. **[S]** helsedirektoratet.no – *Helsepersonelloven med kommentarer, § 3
   Definisjoner* —
   `.../rundskriv/helsepersonelloven-med-kommentarer/lovens-formal-virkeomrade-og-definisjoner/-3.definisjoner`
7. **[S]** helsedirektoratet.no – *Hva er helsehjelp* (rundskriv om
   dokumentasjonsplikt) —
   `.../rundskriv/dokumentasjonsplikt-i-apotek/.../hva-er-helsehjelp`
8. **[S]** helsedirektoratet.no – *Helse- og omsorgstjenesteloven med
   kommentarer, § 3-2 Kommunens ansvar for helse- og omsorgstjenester*
9. **[S]** helsedirektoratet.no – *§ 3-8 Brukerstyrt personlig assistanse*
10. **[B]** lovdata.no – *Lov om helsepersonell m.v. (helsepersonelloven)*,
    lov 1999-07-02-64 — `https://lovdata.no/lov/1999-07-02-64`
11. **[B]** lovdata.no – *Helse- og omsorgstjenesteloven § 3-2*, lov
    2011-06-24-30 — `https://lovdata.no/lov/2011-06-24-30/%C2%A73-2`

### Politiattest

12. **[S]** datatilsynet.no – *Vandelskontroll og politiattest*
13. **[S]** regjeringen.no – *Opprettelse av hjemmel for å kunne kreve
    politiattest* (høringsnotat, PDF) —
    `.../contentassets/49381fea99494023802f72d7bd79a5b1/hjemmel_for_aa_kunne_kreve_politiattest.pdf`
14. **[S]** lovdata.no – *Politiregisterforskriften kapittel 34, Politiattest
    på områder uten lovregulering* —
    `https://lovdata.no/forskrift/2013-09-20-1097/%C2%A734-1`
15. **[B]** lovdata.no – *Politiregisterloven*, lov 2010-05-28-16

### Diskrimineringsrett

16. **[S]** lovdata.no – *Likestillings- og diskrimineringsloven kapittel 2,
    Forbud mot å diskriminere* (§§ 6, 8, 9) —
    `https://lovdata.no/dokument/NL/lov/2017-06-16-51/KAPITTEL_2`
17. **[S]** lovdata.no – *Likestillings- og diskrimineringsloven kapittel 5,
    Særlige regler i arbeidsforhold* (§ 30) —
    `https://lovdata.no/dokument/NL/lov/2017-06-16-51/KAPITTEL_5#%C2%A730`

### Personvern

18. **[S]** datatilsynet.no – *Særlige kategorier av personopplysninger*
19. **[S]** datatilsynet.no – *Rettar ved automatiserte avgjerder* (art. 22) —
    `.../rettigheter-og-plikter/den-registrertes-rettigheter/rettar-ved-automatiserte-avgjerder/`
20. **[S]** datatilsynet.no – *Behandlingsansvarlig og databehandler*
21. **[S]** datatilsynet.no – *Hvordan lage en databehandleravtale?*

### Plattformarbeid

22. **[S]** regjeringen.no – *EØS-notat: Plattformdirektivet* —
    `https://www.regjeringen.no/no/sub/eos-notatbasen/notatene/2022/feb/plattformdirektivet/id2907853/`
23. **[B]** eur-lex.europa.eu – *Directive (EU) 2024/2831* —
    `https://eur-lex.europa.eu/eli/dir/2024/2831/oj`

### Kunstig intelligens

24. **[S]** regjeringen.no – *EØS-notat: Forordning om kunstig intelligens
    (KI-forordningen)* — `.../notatene/2021/juni/.../id2884935/`
25. **[S]** regjeringen.no – *Gjør Norge klar for trygg og innovativ KI-bruk* —
    `.../id3093081/`
26. **[S]** regjeringen.no – *Høring – utkast til ny lov om kunstig
    intelligens* — `.../3112327/id3112327/`
27. **[B]** regjeringen.no – *Forordning (EU) 2024/1689 (KI-forordningen),
    uoffisiell norsk oversettelse* (PDF) —
    `.../contentassets/e823dc21809c43f2b4ba9ff1e389e245/ki-forordningen-eu-2024.1689-uoffisiell-norsk-131037.pdf`

**Sum: 22 kilder med tekstutdrag [S], 5 kilder der bare URL er bekreftet [B].**

### Interne kilder, kontrollert direkte i repoet

`docs/JURIDISK-GRENSE.md` · `docs/PROFILREFERANSER.md` ·
`docs/team/JURIDISK-RISIKO.md` (J6–J10, J13, J20, J22, J23) ·
`docs/team/PIVOT-KOORDINERING.md` · `docs/MATCHING.md` ·
`docs/FORRETNINGSMODELL.md` · `docs/EUROPA.md` · `assets/js/katalog.js` ·
`assets/js/besok-agenter.js` · `assets/js/matching.js` ·
`assets/js/hjelper-opptak.js` · `assets/js/hjelper-base.js` ·
`assets/js/besok-vern.js` · `assets/js/besok-lager.js` ·
`besok/bli-medarbeider.html`

### «Må verifiseres» – samlet

Tretten punkter er merket **[M]** i teksten over. Samlet:

1. Ordlyden i arbeidsmiljøloven § 1-8 annet ledd (presumpsjonsregelen)
2. Helsepersonelloven § 3 om når den som yter helsehjelp selv blir helsepersonell
3. Hjemmelsbestemmelsen for politiattest i den kommunale helse- og omsorgstjenesten
4. Personvernforordningens bestemmelse om straffedommer og lovovertredelser
5. Artikkelnummereringen i direktiv (EU) 2024/2831 for algoritmisk styring
6. Presumpsjonsregelen i direktiv (EU) 2024/2831
7. KI-forordningen vedlegg III nr. 4 om sysselsetting og arbeidstakerstyring
8. KI-forordningen art. 50 om åpenhet ved samhandling med KI-systemer
9. KI-forordningen om behandling av særlige kategorier for skjevhetsdeteksjon
10. Anvendelsestidspunkt for vedlegg III-systemer etter KI-forordningen
11. Om den norske KI-loven faktisk er trådt i kraft per 25.08.2026
12. Tidspunkt for EØS-innlemmelse av plattformdirektivet
13. Journalførings- og dokumentasjonsplikten etter helsepersonelloven og
    helse- og omsorgstjenesteloven for privat leverandør under kommunalt vedtak

Ingen av dem er sitert som gjeldende rett i notatet. De står som oppgaver.
