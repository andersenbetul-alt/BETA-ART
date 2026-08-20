# Juridisk vurdering av koordineringsmodellen

Forslaget: første versjon er et **koordineringsverktøy for familien**, ikke en åpen
markedsplass. Familien registrerer behov, fordeler oppgaver mellom seg og andre de
selv har lagt til, får påminnelser og bekreftelser, og samler informasjon ett sted.
Inntekten er abonnement fra familien, ikke provisjon av oppdrag.

Dette er ikke en mindre versjon av det vi har bygget. Det er en annen tjeneste, med
et annet risikobilde. Vurderingen under sammenligner de to.

Ikke juridisk rådgivning. Samme forbehold som i `JURIDISK-RISIKO.md`.

---

## Hovedfunnet

Av de åtte **A-graderte** risikoene i dagens register forsvinner tre helt, to
krymper vesentlig, og tre står igjen — hvorav én blir skarpere enn før.

Tre av de fire spørsmålene som i dag blokkerer oppstart, faller bort:

| Blokkerende spørsmål i dag | Under koordineringsmodellen |
|---|---|
| Arbeidsrettslig status for hjelperne | **Bortfaller.** Ingen får betalt gjennom oss |
| Betalingsformidling og konsesjon | **Bortfaller.** Vi tar abonnement, ikke oppdragsbetaling |
| Merverdiavgift på serviceavgift | **Forenkles.** Abonnement er ordinær avgiftspliktig tjeneste |
| Samtykke på vegne av person med svekket kognisjon | **Står igjen, og blir viktigere** |

Det siste er poenget verdt å stanse ved: modellen fjerner nesten alt som gjorde
markedsplassen tung å få lovlig — bortsett fra det spørsmålet som treffer selve
kjernen i begge modeller.

---

## Risiko for risiko

| # | Risiko i dag | Under koordinering | Hvorfor |
|---|---|---|---|
| J1 | Samtykkekompetanse | **Står** | Hun er fortsatt registrert, og familien handler fortsatt for henne |
| J2 | Utlevering til pårørende | **Skjerpes** | Nå er familieinnsyn selve produktet, og det er flere enn én pårørende |
| J3 | Forhåndsavkrysset samtykke | Rettet | Gjelder uansett modell |
| J4 | Vilkår som ikke finnes | **Står** | Abonnementsvilkår må uansett skrives |
| J5 | Angrerett og abonnement | **Skjerpes kraftig** | Abonnementet går fra bigeskjeft til hele forretningsmodellen |
| J6 | Arbeidsrettslig klassifisering | **Bortfaller** | Familiemedlemmer som hjelper sin egen mor er ikke arbeidstakere |
| J7 | Plattformarbeid og algoritmisk styring | **Bortfaller** | Ingen algoritme fordeler inntektsgivende arbeid |
| J8 | Automatiserte avgjørelser om inntekt | **Bortfaller** | Ingen tillitsscore, ingen inntekt å påvirke |
| J9 | Grensen mot helsehjelp | **Krymper** | Vi plasserer ingen hos noen. Men se N2 |
| J10 | Politiattest uten hjemmel | **Bortfaller i v1** | Vi går ikke god for fremmede. Kommer tilbake med «godkjente hjelpere» |
| J11 | Betalingsformidling | **Bortfaller** | Ordinært abonnement, ingen penger til tredjepart |
| J12 | Forsikring og ansvar | **Krymper** | Vi formidler ikke en person inn i et hjem. Ansvarsfraskrivelse må likevel skrives |
| J13 | Helseopplysninger | **Skjerpes kraftig** | «Samle viktig informasjon og avtaler» er nettopp der de havner |
| J14 | Markedsføring mot sårbare | Uendret | |
| J15 | Universell utforming | Uendret | |
| J16 | Merverdiavgift | **Forenkles** | Men se merknad om pris under |
| J17 | Varemerke | Uendret | |
| J18 | Databehandleravtaler | **Krymper** | Færre leverandører: ingen ID-kontroll, ingen oppdragsbetaling |
| J19 | Aldersgrense | **Bortfaller i v1** | |
| J20 | Referansepersoner | **Bortfaller i v1** | Ingen referansesjekk uten verifisering av fremmede |
| J21 | Avslagsregister | **Bortfaller i v1** | |

**Sum:** ni risikoer bortfaller, fire krymper, tre skjerpes, resten står.

---

## De tre som blir verre

### J13 → Vi blir et arkiv for helseopplysninger

«Samle viktig informasjon og avtaler på ett trygt sted» er den setningen i
forslaget som bærer mest juridisk vekt. I praksis fylles et slikt sted med:

legetimer · medisinliste · diagnoser nevnt i notater · kontaktinfo til fastlege og
hjemmetjeneste · hva som skjedde sist · hva hun ikke tåler

I markedsplassmodellen var helseopplysninger noe som **lekket inn** i fritekst, og
`GDPR.md` er bygget rundt å holde dem ute. Her er de **selve produktverdien**.

Det snur behandlingen på hodet: fra å minimere særlige kategorier til å oppbevare
dem som kjernefunksjon. Det krever eget behandlingsgrunnlag, og gjør DPIA
nødvendig uavhengig av posisjonsdata.

**Spørsmålet til rådgiver:** hvilket grunnlag kan bære en familiedelt journal om en
person som kanskje ikke kan samtykke selv? Og hvis svaret er tynt — kan produktet
leve med at slik informasjon *ikke* kan lagres, bare påminnelser om avtaler uten
innhold?

### J2 → Familieinnsyn er ikke lenger én person

Markedsplassen hadde én bestiller. Koordineringsverktøyet har en familie, og
familier er ikke enige.

Konkrete tilfeller som må ha et svar i produktet, ikke bare i vilkårene:

- Én søster legger til en bror moren ikke ønsker skal ha innsyn.
- To søsken er uenige om hva som skal registreres om moren.
- Et familiemedlem er under utflytting fra familien, men har fortsatt tilgang.
- Moren vil fjerne noen. Vedkommende har allerede sett alt.
- Hvem eier kontoen hvis moren dør? Hvem kan slette den?

**Produktkravet uansett juridisk svar:** det er den eldre som eier tilgangslisten,
ikke den som opprettet abonnementet og betaler. Kan hun ikke administrere den
selv, må det finnes en definert fullmaktsmodell — ikke «den som kom først».

### J5 → Abonnementet blir hele forretningsmodellen

149–399 kr i måneden, løpende, solgt til familier i en presset situasjon.
Angrerett, oppsigelsesvilkår, varsling ved prisendring og regler for automatisk
fornyelse går fra å være en detalj til å være det som kan velte selskapet ved et
tilsynsvedtak.

**Merknad om pris:** tallene 149–399 må avklares som med eller uten mva. Er de
inkludert, er reell inntekt 119–319. `OKONOMI.md` regnet marketplace-modellen uten
mva; samme feil må ikke gjentas her.

---

## Seks risikoer modellen innfører som markedsplassen ikke hadde

### N1 · «Godkjente hjelpere» er ordet som avgjør alt

Forslaget nevner «andre godkjente hjelpere». Det ordet må velges bevisst, for det
finnes bare to lovlige varianter:

| Formulering | Hva vi lover | Hva det krever |
|---|---|---|
| «Personer familien selv har lagt til» | Ingenting | Ingenting. Familien står ansvarlig |
| «Godkjente hjelpere» | At vi har kontrollert dem | Hele verifiseringskjeden: ID, referanser, kurs, forsikring |

Det finnes ingen mellomting. Sier vi «godkjent» uten kjeden bak, har vi tatt på oss
markedsplassens tyngste forpliktelse uten å ha bygget noe av den — og det er verre
enn markedsplassen, fordi der visste vi at vi måtte bygge den.

**Anbefaling:** i v1 heter det *«personer du har lagt til»*, og grensesnittet sier
uttrykkelig at vi ikke har kontrollert dem.

### N2 · Forventningen om at noen følger med

En app som sender påminnelser og viser status, skaper et inntrykk av oppsyn. Skjer
det noe med moren mens statusen står grønn, er spørsmålet hva familien med rimelighet
kunne forvente.

Markedsplassen løste dette med en faktisk vaktordning. Koordineringsverktøyet har
ingen, og skal ikke ha det — men da må fraværet være tydelig, ikke underforstått.

**Produktkrav:** ingen «alt er bra»-status. Appen viser hva som er registrert og hva
som ikke er bekreftet, aldri en tilstandsvurdering av personen.

### N3 · Fullmakt blir kjernefunksjonalitet, ikke et unntak

I markedsplassen var «datteren bestiller for moren» én transaksjon. Her er det den
løpende driftsformen: familien administrerer hennes kalender, hennes kontakter,
hennes opplysninger.

Det er nærmere en fullmaktssituasjon enn en tjenestebestilling, og bør beskrives som
det — hvem som har fullmakt, hvor langt den rekker, hvordan den gis og trekkes.

### N4 · Vi har ingen relasjon til den som utfører oppgaven

Familiemedlemmet som gjør handlingen har ikke akseptert våre vilkår, kanskje ikke
engang lastet ned appen. Likevel registrerer vi at han fikk en oppgave, om han
bekreftet, og når. Vi behandler opplysninger om en person vi ikke har et forhold til.

Samme mønster som J20 med referansepersonene — og løsningen er den samme: han skal
informeres, og han skal kunne be om innsyn og sletting.

### N5 · Abonnement solgt inn i en presset situasjon

Familier tegner slike abonnementer i en krise og glemmer dem etterpå. Automatisk
fornyelse mot en gruppe der abonnenten kan være over 80, eller der personen
tjenesten gjelder er død, krever en oppsigelsesflyt som virker uten telefonkø.

**Produktkrav:** oppsigelse skal kunne gjøres i appen, på ett sted, uten å måtte
snakke med noen. Samme regel som ellers: å si nei skal være like lett som å si ja.

### N6 · Data etter dødsfall

Markedsplassen slapp unna dette. Et familiearkiv gjør ikke det. Hva skjer med
opplysningene når hun dør? Hvem kan hente dem ut, hvem kan slette, og hvor lenge
beholder vi dem? Dette kommer til å skje for en andel av brukerne hvert år, og bør
være løst før den første gangen, ikke etter.

---

## Konsekvens for det som allerede er bygget

Cirka 1 400 linjer er skrevet for markedsplassen og trengs ikke i v1:

| Fil | Linjer | Status i v1 |
|---|---|---|
| `matching.js` | 188 | Parkeres. Ingen matching uten fremmede |
| `pris.js` | 82 | Parkeres. Ingen oppdragspris |
| `tavle.js` + `oppdrag.html` | 468 | Parkeres. Ingen oppdragstavle |
| `drift.js` + `driftdata.js` + `drift.html` | 573 | Parkeres. Ingen søknadsbehandling eller vaktkø |

Cirka 1 260 linjer bærer rett over:

| Fil | Linjer | Hvorfor det holder |
|---|---|---|
| `akutt.js` | 119 | Familien skriver fortsatt fritekst. Akutt er akutt uansett modell |
| `senior.css` + `trenger-hjelp.html` | 446 | Senior Mode er like nødvendig — kanskje mer |
| `familie.html` | 257 | Blir hovedflaten i stedet for en salgsside |
| `personvern.html` | 255 | Må skrives om, men strukturen står |
| `app.js` + `api.js` | 184 | Uendret |

Ingenting kastes. Markedsplasskoden er nøyaktig det v2 trenger den dagen
verifiserte hjelpere kobles på — og da med et kundegrunnlag som allerede finnes.

Dokumentene beholder verdien: `DRIFT.md`, `GDPR.md`, `JURIDISK-RISIKO.md` og
`SYNTESE.md` beskriver kravene til v2. `OKONOMI.md` må regnes på nytt, siden
inntektsmodellen er en annen.

---

## Vurdering

Modellen fjerner tre av fire blokkerende spørsmål, mer enn halverer risikobildet,
og kutter det som gjorde piloten uøkonomisk — vaktordningen på 135 000 kr i måneden
finnes ikke når ingen fremmed går inn i noens hjem.

Den flytter samtidig tyngdepunktet til et sted som er mindre utforsket: vi går fra
å *unngå* helseopplysninger til å *oppbevare* dem, og fra én bestiller til en
familie som kan være uenig.

Det er en god byttehandel, forutsatt tre ting:

1. **Ordet «godkjent» brukes ikke om noen vi ikke har kontrollert.** Dette er den
   ene grensen som ikke tåler å tøyes.
2. **Det avklares hva som kan lagres om helse** før «samle viktig informasjon»
   bygges. Svaret kan bli at appen husker *at* det er en legetime, ikke *hva* den
   gjelder — og produktet må tåle det.
3. **Den eldre eier tilgangslisten**, ikke den som betaler.

Ett spørsmål blir ikke enklere av pivoten, og det er det samme som i dag: hva som
kreves for at familien kan handle på vegne av en person som ikke fullt ut kan
samtykke selv. Det bør stilles til rådgiver nå — det er det eneste spørsmålet som
må besvares uansett hvilken modell som velges.
