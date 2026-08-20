# Tekstgjennomgang – Naviar

Rolle: senior conversion copywriter og UX-writer.
Gjennomgått: `index.html`, `trenger-hjelp.html`, `familie.html`, `bli-hjelper.html`,
`oppdrag.html` – samt teksten som genereres fra `assets/js/registrering.js`,
`assets/js/bestilling.js`, `assets/js/tavle.js` og `assets/js/matching.js`, fordi
en stor del av det leseren faktisk ser står der.

**Dette er et forslagsdokument. Ingen HTML er endret.**

Rammene som er lagt til grunn: ingen fryktbasert tekst, ingen løfter systemet ikke
holder, aldri «100 % trygt», aldri «politiattest på alle». Det ærlige løftet –
*ingen sendes hjem til familien din uten å være verifisert* – er sterkere enn et
løfte vi ikke kan innfri.

**Merking brukt i tabellene**

- ✅ = teksten er god som den er, tatt med som mønster andre kan kopiere
- ⚠️ = teksten fungerer, men mangler noe
- ❌ = teksten bør skrives om

---

## Innhold

1. [Forsiden](#1-forsiden)
2. [Konverteringspunktene per side](#2-konverteringspunktene-per-side)
3. [UX-tekst i bli-hjelper.html](#3-ux-tekst-i-bli-hjelperhtml)
4. [Senior Mode – trenger-hjelp.html](#4-senior-mode--trenger-hjelphtml)
5. [Tomme tilstander, bekreftelser og varsler](#5-tomme-tilstander-bekreftelser-og-varsler)
6. [Tekstsjekkliste før publisering](#6-tekstsjekkliste-før-publisering)
7. [Vedlegg: ord og formuleringer som går igjen](#vedlegg-ord-og-formuleringer-som-går-igjen)

---

## 1. Forsiden

### 1.1 Hovedfunnet på forsiden

Forsiden har ett strukturelt problem som veier tyngre enn enkeltsetningene:
**siden er skrevet til den eldre, men leses av den pårørende.** Det er den
pårørende som googler, som klikker, som betaler og som er redd. Hun får:

- en H1 som snakker til moren hennes,
- en «Slik fungerer det»-seksjon som i sin helhet beskriver *hjelperens*
  registreringsløp – ikke hennes bestilling,
- svaret på hennes viktigste spørsmål («hvem er dette mennesket?») først i
  nest siste seksjon,
- ingen pris noe sted på siden,
- og en avsluttende CTA som bare henvender seg til hjelpere.

Alt annet på denne siden er finpuss. Dette er hovedsaken.

### 1.2 Hero

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Hero, eyebrow | Pilot · Oslo og Viken | Pilot i Oslo og Viken | «·» leses ikke høyt og gir ingen mening for skjermleser. Hele ordet koster ingenting. |
| Hero, H1 | Bo hjemme. Få hjelp når du trenger det. | Se punkt 1.3 – tre varianter | Nåværende H1 taler til den eldre, mens trafikken i praksis er pårørende. Den sier heller ikke noe det er vanskelig å si nei til: «få hjelp når du trenger det» er en påstand alle tjenester kan skrive. |
| Hero, ingress | …vi finner den nærmeste ledige, kvalifiserte og betrodde personen. | …vi spør de hjelperne som er verifiserte, nærme nok og ledige – og du ser hvem det er før besøket. | «Den nærmeste ledige, kvalifiserte og betrodde» lover ett bestemt utfall matchemotoren ikke kan garantere (den *rangerer* kandidater, den *finner* ikke alltid noen). «Betrodde» er dessuten et ord uten innhold; «verifisert» er ordet vi faktisk kan stå inne for. |
| Hero, under CTA | *(mangler)* | **Ingen sendes hjem til en familie uten å være verifisert.** Elektronisk ID-kontroll, to referanser vi ringer, og et sikkerhetskurs som må bestås. | Innvendingen først. I dag ligger dette svaret 5–6 skjermhøyder ned. Den pårørende som ikke får svar over brettkanten, scroller ikke – hun lukker fanen. |
| Hero, prisnote | Pris vises før du bestiller · Betaling kun gjennom plattformen · Posisjon deles kun når du selv slår den på | Du ser prisen før du bestiller – en vanlig time på dagtid koster ca. **[X] kr**. All betaling går gjennom Naviar, aldri kontant. Posisjon deles bare når du selv slår den på. | «Pris vises før du bestiller» er en prosessopplysning, ikke en pris. Skjult pris er den dyreste teksten vi kan skrive. `pris.js` gir i dag ca. 375 kr for én planlagt time på dagtid og ca. 450 kr for «Nå» – **verifiser tallet mot gjeldende satser før publisering**, og oppgi det som «fra ca.», ikke som et løfte. |
| Hero, sekundær CTA | Jeg vil ta oppdrag | Bli hjelper | Knappen sier «ta oppdrag», siden man lander på heter «Bli hjelper». Etter klikk skal siden bekrefte at det var det som skjedde. Enten rettes knappen, eller så får `bli-hjelper.html` H1 «Bli hjelper – ta oppdrag i nabolaget». |
| Hero, primær CTA | Jeg trenger hjelp | Behold, men legg til en tredje, tekstlig inngang under knappene: «Bestiller du på vegne av mor eller far? → Se pårørendepanelet» | To likeverdige knapper deler oppmerksomheten i to. Den tredje og mest sannsynlige leseren – den pårørende – har ingen inngang i hero i dag, bare et kort langt nede. |
| Hero, eksempelkort | Illustrasjon. Nøyaktig adresse vises først når du har fått oppdraget – før det ser du bare bydel og omtrentlig avstand. | Eksempel på oppdrag. Full adresse åpnes først når du har takket ja – før det ser du bydel og omtrentlig avstand. | ✅ Innholdet er riktig og viktig. «Illustrasjon» er designspråk; «Eksempel» er norsk. «Fått oppdraget» → «takket ja» gjør hjelperen til den som bestemmer. |

### 1.3 Tre hero-varianter

**Kontroll (dagens)**

> **Bo hjemme. Få hjelp når du trenger det.**
> Naviar kobler eldre som vil bo hjemme, og familier som bor et annet
> sted, med verifiserte hjelpere i nabolaget.

---

**Variant A – «Innvendingen først»** (anbefalt utgangspunkt)

> **Hjelp hjemme hos mor – av noen du vet hvem er.**
> Du ser navn, bilde og hva som er verifisert før besøket. Du får beskjed når
> hjelperen kommer, og når oppdraget er ferdig. Prisen står der før du bestiller.
>
> `[ Bestill hjelp ]` `[ Bli hjelper ]`
> Ingen sendes hjem til en familie uten å være verifisert.

*Hvorfor:* svarer på det første spørsmålet den pårørende stiller, i selve
overskriften. «Av noen du vet hvem er» er et løfte vi faktisk holder – profil og
verifiseringsmerker vises før besøket – og det er samtidig det konkurrenter
sjelden tør si.

---

**Variant B – «Det observerbare»**

> **«Sofia kom til Maria klokka 14:02.»**
> Slik ser beskjeden ut når noen har vært hos moren din. Naviar kobler
> eldre som vil bo hjemme med verifiserte hjelpere i nabolaget – og holder deg
> oppdatert underveis, uansett hvor du selv bor.
>
> `[ Bestill hjelp ]` `[ Bli hjelper ]`

*Hvorfor:* konkret slår følelsesladet. Et klokkeslett er umulig å ikke tro på.
Risikoen er at leseren ikke vet hvem Sofia og Maria er i det første sekundet –
derfor må ingressen forklare det umiddelbart, slik den gjør her.

---

**Variant C – «Jobben, rett fram»**

> **Praktisk hjelp hjemme for eldre – utført av verifiserte naboer.**
> Handling, følge til legetimen, en tur ut eller hjelp med nettbrettet. Du ser
> prisen før du bestiller, og familien får beskjed når oppdraget er utført.
>
> `[ Bestill hjelp ]` `[ Bli hjelper ]`

*Hvorfor:* laveste forståelsesterskel og best søkeordsdekning. Svakest
emosjonelt trykk. Nyttig som kontroll for å se hvor mye variant A og B faktisk
tjener på tolkningsarbeidet de krever.

#### Hva jeg ville målt for å velge

| Metrikk | Rolle | Hvorfor akkurat denne |
|---|---|---|
| **Andel besøkende som fullfører steg 4 i bestillingsflyten** (pris vist + «Bestill hjelp» trykket) | Primær | Dette er den eneste metrikken som betyr noe. En overskrift kan lett øke klikk på hero-knappen og samtidig senke fullføring, fordi den lokket inn feil forventning. |
| Klikk på hero-CTA per besøk | Diagnostisk | Skiller «overskriften solgte ikke» fra «flyten mistet dem». Aldri primærmetrikk alene. |
| Fordeling mellom «Bestill hjelp» og «Bli hjelper» | Vaktmetrikk | Variant A og B er skrevet til kjøperen. Hvis hjelperrekrutteringen faller mer enn ~15 %, er gevinsten på kjøpersiden delvis flyttet, ikke skapt. |
| Scrolldybde til «Trygghet for familien» | Diagnostisk | Hvis variant A gjør at færre trenger å scrolle dit *og* flere bestiller, har innvendingen faktisk blitt besvart i hero. Da bør trygghetsseksjonen kortes ned. |
| Fullført hjelperregistrering | Vaktmetrikk | Se over. |

**Praktisk oppsett:** A/B/C samtidig, ikke sekvensielt – forsiden har sesong- og
ukedagsvariasjon som ødelegger før/etter-målinger. Segmenter på mobil/desktop,
fordi hero-teksten på mobil er nesten hele førsteinntrykket. Kjør til det er nok
*bestillinger* til å skille variantene, ikke nok *besøk*. I en pilot med lave
volumer er dette trolig for tregt – da er alternativet fem
brukerintervjuer der leseren leser hver variant høyt og sier hva hun tror
tjenesten er. Det svarer på det samme spørsmålet på en ettermiddag.

### 1.4 De tre inngangskortene

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Kort 1, brødtekst | Store knapper, få valg, og mulighet til å si det med stemmen din. Du ser prisen før du bestiller. | Si hva du trenger – med knapper eller med din egen stemme. Du ser prisen før du bestiller, og du bestemmer selv om du vil ha den som kommer. | «Store knapper, få valg» beskriver grensesnittet vårt, ikke leserens gevinst. En på 78 vil ikke høre at knappene er store – hun vil høre at hun bestemmer. |
| Kort 1, CTA | Be om hjelp | Bestill hjelp | Tre navn på samme handling i dag: «Jeg trenger hjelp» (hero), «Be om hjelp» (kort), «Bestill hjelp» (Senior Mode). Ordlisten sier «Bestill hjelp». Én handling, ett navn. |
| Kort 2, brødtekst | Bestill på vegne av mor eller far, se hvem som kommer, og få beskjed når oppdraget er utført. | ✅ Behold. Dette er den beste setningen på forsiden: tre konkrete utfall, ingen adjektiver. | Mønster å kopiere til de andre kortene. |
| Kort 2, CTA | Se pårørendepanelet | Se hvordan du følger med | «Pårørendepanelet» er vårt interne produktnavn. Leseren har aldri hørt det og vet ikke hva som venter bak klikket. |
| Kort 3, brødtekst | Ta oppdrag i nabolaget når det passer deg. Du velger avstand, dager og oppdragstyper. | Ta oppdrag i nabolaget når det passer deg. Du velger avstand, dager og oppdragstyper – og du ser hva oppdraget betaler før du takker ja. | Hjelperen er redd for uklare oppdrag og ubetalt tid. Kortet svarer på det første og ikke på det andre. Betalingen er det eneste som får noen til å klikke. |

### 1.5 Seksjonsoverskrifter

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Seksjon «Slik fungerer det» | **Slik fungerer det** – Fra registrering til første oppdrag. | **Slik blir du hjelper** – Fra registrering til første oppdrag. | Innholdet under er utelukkende hjelperens løp: registrering, verifisering, kurs, tilgjengelighet. En pårørende som scroller for å forstå *bestillingen*, får forklart *jobbsøknaden*. Dette er trolig det enkeltstedet på forsiden hvor flest faller av uten å forstå hvorfor. |
| Ny seksjon *(mangler)* | – | **Slik bestiller du** – 1. Si hva som trengs. 2. Se prisen. 3. Se hvem som kommer, og godkjenn. 4. Få beskjed når oppdraget er ferdig. | Kjøpersiden har ingen «slik gjør du»-seksjon i det hele tatt. Fire linjer dekker hullet. Legges over hjelperløpet, ikke under. |
| Steg 4 i hjelperløpet | Slå på «Jeg er tilgjengelig» – Da – og bare da – kan vi bruke posisjonen din… | Slå på «Jeg er tilgjengelig» – Først da bruker vi posisjonen din, og bare til å vise oppdrag i nærheten. Du slår den av igjen når du vil. | ✅ Innholdet er riktig og viktig. «Da – og bare da –» har to tankestreker i én setning; det leses tregere enn det fortjener. |
| Seksjon om oppdragstyper | **Hva slags oppdrag finnes?** – Praktisk hverdagshjelp – ikke helsehjelp. | **Dette kan du få hjelp til** – Praktisk hverdagshjelp i hverdagen. Medisinering, sårstell og pleieoppgaver ligger utenfor plattformen. | Overskriften er skrevet fra vårt ståsted («finnes» i katalogen vår). Avgrensningen skal stå – men etter det leseren kan få, ikke før. Man selger ikke med en negasjon i første setning. |
| Seksjon om personvern | **Personvern er bygget inn – ikke lagt på til slutt** | **Hvem vet hvor du er – og når?** | Dagens overskrift er en påstand om vår egen prosess. Den nye stiller spørsmålet leseren faktisk har. Innholdet i de fire kortene under er allerede svært godt og trenger ingen endring. |
| Seksjon om trygghet | **Trygghet for familien** – Spørsmålet enhver pårørende stiller: «Hvem er det egentlig dere sender hjem til mamma?» | ✅ Behold ordrett. | Sitatet er det beste grepet på hele siden. Eneste innvending: det står for langt ned. Flytt hele seksjonen opp, rett under «Slik bestiller du». |
| Avsluttende CTA | **Klar for å ta oppdrag nær deg?** Registrer deg som hjelper. | Del seksjonen i to like store bokser: **«Trenger mor eller far hjelp?» → Bestill hjelp** og **«Vil du ta oppdrag?» → Bli hjelper** | Siden begynner med to publikum og slutter med ett. Den pårørende som har lest hele siden – altså den mest kjøpsklare leseren vi har – får ingen knapp å trykke på. |

---

## 2. Konverteringspunktene per side

For hver side: hvor leseren mest sannsynlig faller av, hvilken innvending
teksten ikke besvarer i dag, og teksten som besvarer den.

### 2.1 `index.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| **Frafall 1: hero → første scroll.** Ubesvart innvending: *«Hvem er det som kommer hjem til moren min?»* | Svaret ligger i nest siste seksjon. | Under hero-knappene: «**Ingen sendes hjem til en familie uten å være verifisert.** Elektronisk ID-kontroll, to referanser vi ringer, og et sikkerhetskurs som må bestås – før første oppdrag.» | Den pårørende tenker på personen før hun tenker på prisen. Svares det ikke over brettkanten, blir det aldri lest. |
| **Frafall 2: «Slik fungerer det».** Ubesvart innvending: *«Hva skjer når jeg trykker bestill?»* | Fem steg som alle handler om hjelperens registrering. | Ny firetrinns «Slik bestiller du» (se 1.5), plassert før hjelperløpet. | Leseren leter etter sin egen prosess og finner en annens. Hun antar at siden ikke er til henne. |
| **Frafall 3: hele siden.** Ubesvart innvending: *«Hva koster det?»* | Prisen nevnes ikke med ett tall. | Egen liten prisblokk under oppdragstypene: «En time praktisk hjelp på dagtid koster ca. [X] kr. Prisen inkluderer hjelperens tid, reisetid og vår serviceavgift, og du ser hele regnestykket før du bestiller. Trenger du hjelp *nå*, kommer et hastetillegg i tillegg.» | Egen regel: pris før bestilling, alltid. En leser som må gjennom fire steg for å se prisen, går ut igjen på steg to. Bruk «ca.» og oppgi hva som inngår – da er tallet et anslag, ikke et løfte. |
| **Frafall 4: eyebrow «Pilot · Oslo og Viken».** Ubesvart innvending: *«Jeg bor i Trondheim – er dette noe for meg?»* | Ingen utvei. Leseren lukker fanen. | «Vi er i gang i Oslo og Viken. Bor du et annet sted, kan du si fra hvor – da sier vi fra når vi åpner der.» | Fanger etterspørsel utenfor pilotområdet i stedet for å kaste den. **Skriv bare denne hvis en venteliste faktisk finnes** – ellers er det et løfte uten mottaker. |

### 2.2 `trenger-hjelp.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| **Frafall 1: steg 1, valget «Nå».** Ubesvart innvending: *«Hva koster det ekstra å be om hjelp nå?»* | «Nå – Vi finner noen som kan komme innen ca. 90 minutter». «I dag» sier «Litt rimeligere», «Nå» sier ingenting om pris. | «Nå – Vi spør hjelpere som kan komme innen ca. 90 minutter. Litt dyrere, fordi noen må avbryte det de holder på med.» | Prisforskjellen nevnes bare på det ene alternativet. Da fremstår det andre som «det normale» og «Nå» som en felle. Begrunnelsen («noen må avbryte») gjør tillegget rimelig i stedet for grådig. Merk også: «vi finner noen» skal være «vi spør» – vi kan ikke garantere at noen takker ja. |
| **Frafall 2: steg 4, prisen.** Ubesvart innvending: *«Hvorfor koster det så mye – hvor mye får hjelperen?»* | Linjen heter «Serviceavgift til Naviar» uten forklaring. | Legg til under prislinjene: «Av dette går [X] kr til hjelperen. Serviceavgiften dekker verifisering, forsikring, support og betaling.» | Prisen er øyeblikket der bestillingen enten holder eller ryker. En avgift uten begrunnelse leses som påslag; en avgift med begrunnelse leses som en tjeneste. Tallet finnes allerede i `pris.js` (`tilHjelper`) og vises bare ikke. |
| **Frafall 3: panel 5, «Vi leter etter en hjelper».** Ubesvart innvending: *«Hva om ingen kan?»* | Flyten har ingen tekst for null treff – den finner alltid Sofia. | «Vi fant ingen ledig hjelper til dette tidspunktet. / Du kan prøve et annet tidspunkt, utvide til «i dag», eller ringe oss på 400 00 000 så leter vi videre sammen. / Du er ikke belastet for noe.» | Uten denne teksten er dette den mest skadelige tomme tilstanden i hele tjenesten: en person på 82 som har fylt ut fire steg og møter en tom skjerm. Siste setning er den viktigste. |
| **Frafall 4: panel 6, «Jeg vil ha en annen».** Ubesvart innvending: *«Blir det pinlig hvis jeg sier nei?»* | En liten sekundærknapp ved siden av en stor primærknapp. | Se punkt 4.3 – lik visuell vekt og en støttelinje: «Det er helt greit. Da spør vi en annen med én gang.» | Å si nei skal være like lett som å si ja. I dag er det tydelig vanskeligere, og en eldre som ikke tør si nei, avbestiller i stedet. |

### 2.3 `familie.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| **Frafall 1: hero-CTA «Bestill hjelp nå».** Ubesvart innvending: *«Er dette skjemaet til meg eller til mor?»* | Knappen sender den pårørende rett inn i Senior Mode, der første spørsmål er «Hva trenger **du** hjelp til?» og steg 3 spør «Ønsker **du** en hjelper som snakker …». | Enten en egen inngang for pårørende, eller minst en linje øverst i flyten: «Du bestiller på vegne av Maria. Hun får beskjed om hvem som kommer, og kan si nei.» | Leseren møter et skjema som tydelig er skrevet til noen andre, og lurer på om hun har havnet feil. Dette er sidens største lekkasje. Bytt samtidig «nå» i knappeteksten – «nå» er navnet på den dyreste hastegraden, og knappen lover noe annet enn den gjør. |
| **Frafall 2: hele siden.** Ubesvart innvending: *«Hva sier mor til at jeg bestiller for henne?»* | Ingenting om den eldres samtykke eller kontroll. | Ny linje i kortet «Bestill på Marias vegne»: «Maria får beskjed om hvem som kommer og når, og kan avlyse selv. Du organiserer – hun bestemmer.» | Den pårørende er redd for å overkjøre. Uten denne setningen blir tjenesten noe man gjør *mot* moren sin. Med den blir det noe man gjør *for* henne. Setningen forplikter oss også til at det faktisk er slik. |
| **Frafall 3: hero-eksempelet.** Ubesvart innvending: *«Mor bor på Hamar, ikke i Spania.»* | «Du bor i Oslo. Mamma bor i Alicante.» | «Du bor i Oslo. Mor bor der hun alltid har bodd – to og en halv time unna.» Behold Alicante-varianten som egen landingsside for utflyttede pensjonister. | Sterk setning, men smalt eksempel. Utflyttede norske pensjonister i Spania er en nisje; de fleste leserne har foreldre i Norge og tenker «da er ikke dette til meg». |
| **Frafall 4: statusmerket «Hjemme».** Ubesvart innvending: *«Følger dere med på hvor mor er?»* | Grønt merke med teksten «Hjemme» ved siden av navnet hennes. | «Ingen oppdrag pågår» | Merket antyder at vi vet hvor Maria befinner seg. Det gjør vi ikke, og det ville brutt med hele personvernløftet vårt. Teksten skal si det systemet faktisk vet. |

### 2.4 `bli-hjelper.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| **Frafall 1: før steg 1.** Ubesvart innvending: *«Hva tjener jeg på dette?»* | Ordet «betaling» dukker først opp på steg 5, og da handler det om utbetalingsform – ikke om beløp. | Under H1: «Et vanlig oppdrag på én time gir deg ca. [X] kr, inkludert reisetid. Du ser hva hvert oppdrag betaler før du takker ja, og pengene frigis når familien har bekreftet at oppdraget er utført.» | Dette er hjelperens hovedspørsmål og eneste grunn til å bruke fem minutter på et skjema. Uten et tall er registreringen en søknad på en ukjent jobb. |
| **Frafall 2: steg 5, referansene.** Ubesvart innvending: *«Må jeg virkelig oppgi to personer som blir oppringt?»* | «Vi ringer faktisk begge to.» | Legg til: «Vi spør om du er til å stole på og hvordan du er å samarbeide med – ikke om helse, økonomi eller privatliv. Samtalen tar under fem minutter, og referansene får ikke se søknaden din.» | Kravet er høyt og skal være det. Men uten å vite *hva* som blir spurt om, føles det som en bakgrunnssjekk uten grenser – og folk hopper av heller enn å ringe rundt til gamle sjefer. |
| **Frafall 3: steg 5, sikkerhetskurset.** Ubesvart innvending: *«Koster kurset noe, og får jeg betalt for tiden?»* | «Før første oppdrag må du fullføre et nettkurs på 45–60 minutter … Kurset avsluttes med en test.» | Legg til én linje: «Kurset er gratis, og du tar det når det passer deg. Du kan gå tilbake og ta testen på nytt.» | En time ubetalt arbeid før første krone er en reell terskel. Ordet «test» skremmer flere enn vi tror – «på nytt» fjerner det meste av det. **Bekreft at begge deler stemmer før publisering.** |
| **Frafall 4: innsendingsknappen.** Ubesvart innvending: *«Er jeg ferdig nå?»* | «Jeg er klar for å ta oppdrag» | «Send søknaden» | Knappen lover et utfall den ikke leverer: etter klikk gjenstår ID-kontroll, referansesamtaler og kurs. Etter klikk skal siden bekrefte det knappen sa – og kvitteringen sier riktignok «søknaden er mottatt», men da har vi allerede skuffet én gang. |

### 2.5 `oppdrag.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| **Frafall 1: bryteren «Ikke tilgjengelig».** Ubesvart innvending: *«Hva forplikter jeg meg til hvis jeg slår den på?»* | «Ikke tilgjengelig – Slå på for å se oppdrag» | «Ikke tilgjengelig – Slå på når du har tid. Du kan si nei til alle oppdrag du får se.» | Bryteren leses som «meld deg på vakt». At man fortsatt kan avslå hvert enkelt oppdrag, er det som gjør den lett å slå på. |
| **Frafall 2: posisjonsspørsmålet.** Ubesvart innvending: *«Hva mister jeg hvis jeg sier nei?»* | Konsekvensen står først *etter* at man har trykket «Ikke nå»: «Greit. Vi bruker postnummeret ditt i stedet …» | Flytt den inn i selve spørsmålet: «For å sortere oppdrag etter avstand bruker vi posisjonen din mens du er tilgjengelig. Sier du nei, bruker vi postnummeret ditt i stedet – da blir avstandene mer omtrentlige. Vi sporer deg aldri når bryteren står av.» | Et samtykke der konsekvensen først kommer etter valget, er ikke et informert valg. Og det ærlige svaret her er behagelig: du mister nesten ingenting. Si det før, ikke etter. |
| **Frafall 3: «Ingen oppdrag akkurat nå».** Ubesvart innvending: *«Er det noe galt med profilen min?»* | «Vi varsler deg så snart det kommer noe som passer.» | Se punkt 5.1 – legg til hva som faktisk begrenser, og en vei videre. | Tom skjerm uten årsak leses som avvisning. Hjelperen slår av bryteren og kommer ikke tilbake. |

---

## 3. UX-tekst i `bli-hjelper.html`

Regelen som er brukt: **etiketten sier hva feltet er, hjelpeteksten sier hvorfor
vi spør.** Kolonnen «Sted» er merket ✅ når hjelpeteksten allerede forklarer
hvorfor, ⚠️ når den delvis gjør det, og ❌ når den mangler.

### 3.1 Etiketter og hjelpetekster

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| ❌ Fornavn / Etternavn | Ingen hjelpetekst | Legg til under feltparet: «Fullt navn vises til familien når du har takket ja til et oppdrag.» | Steg-ingressen forklarer hvorfor vi trenger navnet, men ikke hvem som får se det. Det er det spørsmålet folk faktisk har. |
| ✅ Fødselsdato | Du må være fylt 18 år for å ta oppdrag. Vi lagrer dato, ikke fødselsnummer. | Behold ordrett. | Mønstereksempel: krav + hva vi *ikke* lagrer, på to korte setninger. |
| ✅ E-post | Brukes til innlogging, kvitteringer og varsler om oppdrag. | Behold. | Tre konkrete formål, null markedsføringsspråk. |
| ⚠️ Mobilnummer | Norsk mobilnummer, f.eks. +47 400 00 000. Nummeret vises ikke offentlig. | Brukes til å nå deg under et oppdrag. Vises ikke offentlig. Norsk nummer, f.eks. +47 400 00 000. | Sier i dag hva formatet er og hva vi *ikke* gjør – men ikke hvorfor vi spør. Hvorfor-et først, formatet sist. |
| ⚠️ Engangskode fra SMS | Vi sender en engangskode på SMS. Dette hindrer falske kontoer og sikrer at vi når deg under et oppdrag. | Behold, men legg til: «Får du ingen kode innen ett minutt, be om en ny.» | Begrunnelsen er god. Det som mangler er hva man gjør når det stopper opp – og SMS stopper opp ofte. |
| ❌ Sted / kommune | Ingen hjelpetekst | Brukes til å finne oppdrag i nærheten. Familier ser bydel, aldri adressen din. | Feltet ber om hvor man bor, uten å si hvem som får vite det. Det er nøyaktig spørsmålet som gjør folk nølende. |
| ❌ Postnummer | Ingen hjelpetekst | Dekkes av hjelpeteksten over hvis feltene står sammen. | Ett hvorfor per felt*par* er nok – to like hint ved siden av hverandre leses ikke. |
| ⚠️ Hvor langt kan du reise | Ingen hjelpetekst (alternativene har smådekster) | Du får aldri se oppdrag lenger unna enn dette. Du kan endre grensen når som helst. | Smådekstene forklarer alternativene, ikke konsekvensen av valget. «Aldri» er et løfte vi faktisk holder – avstandsregelen ligger i matchemotoren. |
| ⚠️ Hvordan kommer du deg til oppdrag | Velg alt som passer. Dette påvirker hvilke oppdrag som er realistiske for deg. | Velg alt som passer. Vi bruker det til å regne ut om du rekker fram i tide – går du til fots, foreslår vi ikke oppdrag på tvers av byen. | «Realistiske for deg» er vagt nok til å bety hva som helst. Det andre eksempelet gjør regelen synlig og gjør valget lett. |
| ❌ Hvilke dager | Ingen hjelpetekst | Et utgangspunkt, ikke en avtale. Du slår tilgjengelighet av og på i appen. | Står i steg-ingressen, men folk skummer skjemaer felt for felt. Uten dette leses avkryssingen som en vaktliste man binder seg til. |
| ⚠️ Når på døgnet | Ingen hjelpetekst. Setningen «Nye hjelpere får oppdrag på dagtid i prøveperioden» står **etter** feilmeldingen. | Flytt den opp som hjelpetekst, og gjør den til et løfte i stedet for en begrensning: «Nye hjelpere starter med oppdrag på dagtid. Kveldsoppdrag åpnes etter fem fullførte oppdrag.» | Slik det står nå, oppdager man begrensningen først etter å ha krysset av for kveld – altså etter å ha blitt skuffet. Med «åpnes etter fem» blir det en vei videre i stedet for en dør som lukkes. |
| ❌ Timer i uken (valgfritt) | Ingen hjelpetekst | Hjelper oss å se hvor mange oppdrag vi kan tilby i ditt område. Du forplikter deg ikke til noe. | Et valgfritt felt uten begrunnelse blir hoppet over – eller verre: leses som en forpliktelse man ikke tør oppgi. |
| ❌ Når kan du starte (valgfritt) | Ingen hjelpetekst | Vi sender ingen oppdrag før denne datoen. Verifiseringen kan gå i mellomtiden. | Uten dette ser feltet ut som en søknadsfrist. Med det blir det en fordel. |
| ✅ Hvilke oppdrag kan du ta | Steg-ingress: «Du får aldri tildelt oppdrag utenfor det du har krysset av for.» | Behold ordrett. | Sterkeste løftet i hele skjemaet, og det er faktisk implementert i matchemotoren. Det er slik løfter skal skrives. |
| ❌ Språk du kan snakke **med brukeren** | Språk du kan snakke med brukeren | **Språk du kan snakke med den eldre** | «Bruker» er forbudt i tekst leseren ser. Det er dessuten uklart – hjelperen er også en bruker av appen. |
| ⚠️ Kort om erfaringen din | For eksempel jobb, frivillig arbeid eller erfaring med egne besteforeldre. Ikke skriv helseopplysninger om deg selv eller andre. | Legg til først: «Familien leser dette før de takker ja til at du kommer.» | Feltet er valgfritt og blir stående tomt, fordi ingen sier hvem som leser det. Ett hvorfor gjør at folk faktisk skriver noe – og et utfylt felt gir flere oppdrag. |
| ❌ Har du noe av dette? | Har du noe av dette? *(ingen hjelpetekst)* | **Kurs og førerkort** – Vises som merker på profilen din, slik at familien ser hva du har med deg. Førerkort kreves for oppdrag med transport i egen bil. | «Har du noe av dette?» sier ikke hva «dette» er før man har lest alle valgene. Overskriften skal gjøre jobben, ikke listen. Ikke lov at merkene gir flere oppdrag – det gjør de ikke automatisk i dag. |
| ✅ HPR-nummer | Oppgir du HPR-nummer, kontrollerer vi autorisasjonen … Merket gir ikke adgang til å utføre helsehjelp via plattformen. | Behold. Kan kortes: «…før merket «autorisert helsepersonell» vises. Merket gir ikke adgang til å utføre helsehjelp gjennom plattformen.» | Sjelden god UX-tekst: forklarer både hva merket gir og hva det ikke gir, i samme avsnitt. |
| ⚠️ To referanser | Vi ringer faktisk begge to. Oppgi personer som kjenner deg fra jobb, studier, frivillig arbeid eller lignende – ikke nær familie. Gi dem beskjed på forhånd. | Se 2.4, frafall 2 – legg til hva vi spør om og hva referansene ikke får se. | God, men ufullstendig. Uten rammen for samtalen virker kravet grenseløst. |
| ❌ Referansefeltene | Etiketten er `visually-hidden`; det eneste synlige er placeholder-teksten «Referanse 1 – navn» | Gjør etikettene synlige over feltene: «Navn», «Telefon», «Relasjon (f.eks. tidligere leder)». | Placeholder som eneste etikett forsvinner i det man begynner å skrive. Med seks felt på rad betyr det at man mister oversikten midt i utfyllingen – akkurat der frafallet allerede er høyest. |
| ✅ Utbetaling | Vi ber ikke om kontonummer her. Etter godkjenning oppretter du utbetaling hos vår betalingsleverandør … | Behold. | Forklarer hvorfor vi *ikke* spør om noe. Det bygger like mye tillit som å forklare hvorfor vi spør. |
| ❌ Organisasjonsnummer | Ingen hjelpetekst | Oppgis til betalingsleverandøren slik at utbetalingen går til foretaket og ikke til deg privat. | Feltet dukker plutselig opp uten forklaring. Ett hvorfor fjerner nølingen. |
| ✅ Kladdenotat | Kladden lagres midlertidig i nettleseren din slik at du ikke mister det du har fylt ut. | Legg til: «Kladden ligger bare i denne fanen og forsvinner når du lukker den. Fødselsdato og engangskode lagres ikke.» | Begge tilleggene stemmer med koden (`sessionStorage`, og `IKKE_LAGRE`-listen). Det er akkurat den typen presis, kontrollerbar detalj som gjør at folk tror på resten av personvernteksten. |
| ⚠️ Kvittering | Vanlig behandlingstid er 2–5 virkedager. | Vi bruker vanligvis 2–5 virkedager. Hører du ikke fra oss innen en uke, ring 400 00 000 og oppgi referansenummeret. | «Behandlingstid» er forvaltningsspråk. Og en kvittering uten utvei etterlater folk uten noe å gjøre når det stopper opp. |

### 3.2 Feilmeldinger

Regelen: **si hva som er galt og hva brukeren gjør nå.** Ingen skyld hos
brukeren, ingen unnskyldninger fra oss.

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| ✅ Postnummer | Postnummer består av 4 siffer. | Behold. | Mønstereksempelet. Sier hva som er galt og hva som skal til, uten et eneste unødvendig ord. |
| ✅ Fødselsdato | Oppgi en gyldig fødselsdato. Du må være minst 18 år. | Oppgi fødselsdato. Du må ha fylt 18 år for å ta oppdrag. | Nesten der. «Gyldig» er systemets ord, ikke leserens – og «for å ta oppdrag» sier hvorfor grensen finnes. |
| ⚠️ E-post | Skriv inn en gyldig e-postadresse. | Sjekk e-postadressen – den mangler @ eller et domene. Eksempel: navn@example.no. | «Gyldig» forteller ikke hva som er galt. Et eksempel gjør at folk ser feilen selv i løpet av et sekund. |
| ⚠️ Mobilnummer | Skriv inn et gyldig norsk mobilnummer. | Norsk mobilnummer har åtte siffer og starter med 4 eller 9. Med landkode: +47 400 00 000. | Samme problem. Her er regelen enkel nok til å skrives ut, og da er feilen selvrettende. |
| ⚠️ Engangskode | Koden stemmer ikke. Prøv igjen. | Koden stemmer ikke. Sjekk de seks sifrene i SMS-en, eller be om en ny kode. | «Prøv igjen» er ingen instruksjon når man allerede har prøvd. To konkrete utveier i stedet. |
| ⚠️ Ubekreftet mobil | Du må bekrefte mobilnummeret før du går videre. | Vi trenger et bekreftet mobilnummer før neste steg. Trykk «Send kode på SMS». | «Du må» legger kravet på leseren. «Vi trenger» legger det på oss – og setningen avsluttes med knappen man skal trykke på. |
| ⚠️ Transport | Velg minst ett alternativ. | Velg minst én måte du kan komme deg til oppdrag på. | Siden har flere avkryssingsgrupper. «Ett alternativ» av hva? Feilmeldinger leses ofte løsrevet fra feltet. |
| ✅ Dager / tidsrom / oppdragstyper | Velg minst én dag. / Velg minst ett tidsrom. / Velg minst én oppdragstype. | Behold. | Presise, korte, uten skyld. |
| ✅ Referanser | Fyll inn navn og telefonnummer for begge referansene. | Behold. | Sier nøyaktig hva som mangler. |
| ⚠️ Samtykker | Du må godta vilkårene, personvernerklæringen og referansesjekken. | Tre ting mangler før kontoen kan opprettes: vilkårene, personvernerklæringen og referansesjekken. Markedsføring er frivillig. | Peker på antallet så leseren vet hvor mye som gjenstår, og skiller tydelig det frivillige fra det nødvendige – slik at ingen krysser av for markedsføring i den tro at det kreves. |
| ❌ Innsending feilet | `alert('Noe gikk galt under innsendingen. Prøv igjen om litt.')` | I siden, ikke i en `alert`: «Søknaden ble ikke sendt. Alt du har fylt ut er lagret – prøv igjen om et par minutter. Fortsetter det, ring oss på 400 00 000.» | En systemdialog river leseren ut av siden og forsvinner uten spor. Og det viktigste her – at man ikke har mistet fem minutters arbeid – står ikke i det hele tatt. Det er den eneste setningen som avgjør om folk prøver på nytt. |
| ⚠️ SMS feilet | Klarte ikke å sende kode. Prøv igjen. | Vi fikk ikke sendt koden. Sjekk at nummeret stemmer, og prøv en gang til om et minutt. | Uten en mulig årsak antar folk at tjenesten er ødelagt. |
| ✅ Posisjon avslått | Posisjon ble avslått. Det er helt greit – du kan fortsette uten. | Behold ordrett. | Dette er den beste UX-setningen på hele nettstedet. Avslaget besvares med «det er helt greit», ikke med en advarsel. Bruk den som mal alle andre steder brukeren sier nei. |
| ✅ Posisjon ikke støttet | Nettleseren din støtter ikke posisjon. Du kan fortsette uten. | Behold. | Ingen skyld, klar vei videre. |

---

## 4. Senior Mode – `trenger-hjelp.html`

Egen stemme: kortere setninger, ett spørsmål om gangen, aldri to valg som ligner
på hverandre – og aldri barnespråk. Vurderingen under følger de tre punktene i
oppgaven.

### 4.1 Er setningene korte nok?

De fleste er det. Fire steder er de ikke.

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Nødvarsel | Ved brann, alvorlig sykdom, fall med skade eller fare for liv skal du ringe nødetatene – ikke bestille et oppdrag her. | **Dette høres ut som noe som haster.**<br>Ring 113 ved alvorlig sykdom eller skade.<br>Ring 110 ved brann.<br>Ring 112 ved fare.<br>Da får du hjelp raskere enn her. | 24 ord i én setning, med tankestrek, til en person som kanskje er redd akkurat nå. Ett nummer per linje, og linjene er tappbare telefonlenker. Siste setning er begrunnelsen – ikke en advarsel om hva som kan skje. |
| Prisnote, steg 4 | Beløpet reserveres på kortet ditt når hjelperen takker ja, og trekkes først når oppdraget er bekreftet fullført. Blir oppdraget kortere enn anslått, betaler du for den faktiske tiden. | Vi reserverer beløpet på kortet når hjelperen takker ja.<br>Vi trekker det først når oppdraget er ferdig.<br>Går det raskere enn antatt, betaler du for tiden som ble brukt. | 40 ord i to setninger om det leseren er mest usikker på. Tre korte linjer sier nøyaktig det samme og kan leses høyt uten å miste tråden. |
| Steg 1, «Nå» | Vi finner noen som kan komme innen ca. 90 minutter | Vi spør hjelpere som kan komme innen halvannen time. Litt dyrere. | «Ca. 90 minutter» er tallspråk; «halvannen time» er norsk. «Finner» lover et utfall vi ikke kontrollerer – «spør» er sant. |
| Åpningsteksten | Velg med store knapper, eller si det med stemmen din. Du ser prisen før du bestiller. | Du kan trykke på knappene, eller si det med stemmen din. Du ser prisen før du bestiller. | «Store knapper» er vår beskrivelse av vår egen løsning. Leseren ser jo at de er store. |
| H1 vs. steg 2 | H1: «Hva trenger du hjelp til?» – og steg 2 har samme overskrift ordrett | H1: **Be om hjelp** – steg 2 beholder «Hva trenger du hjelp til?» | Samme spørsmål to ganger på samme skjerm får leseren til å tro at hun ikke har kommet videre. |

### 4.2 Ligner noen valg for mye på hverandre?

Ja, fire steder. Dette er den viktigste enkeltjusteringen i Senior Mode.

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Steg 1: «Nå» vs. «I dag» | «Nå – innen ca. 90 minutter» / «I dag – En gang i løpet av dagen. Litt rimeligere.» | «Nå – Innen halvannen time. Litt dyrere.» / «I dag – Når som helst før kvelden. Vanlig pris.» | For en som trenger hjelp «i dag» betyr «nå» også «i dag». Skill dem på det som faktisk skiller: hvor lenge man venter, og hva det koster. Nevn pris på begge – ellers ser det ene ut som en felle. |
| Steg 2: «Noen som følger meg» vs. «Bli med på noe» | «Lege, tannlege, frisør, butikk» / «Konsert, museum, kino, gudstjeneste» | Slå dem sammen til **«Noen som blir med meg ut»** – «Lege, frisør, butikk, konsert eller gudstjeneste» | Begge betyr «noen går sammen med meg». Skillet mellom nyttig og hyggelig er vårt, ikke leserens – og det er en distinksjon man må tenke over for å ta. Ett spørsmål skal ikke kreve at man kategoriserer sitt eget ærend. |
| Steg 2: «Handle» vs. «Noen som følger meg» | «Handle – Dagligvarer, apotek, post» / «…følger meg – Lege, tannlege, frisør, **butikk**» | Fjern «butikk» fra følge-alternativet. | Samme ord i to alternativer betyr at leseren må gjette hva vi mente. Da stopper hun opp – eller trykker feil og angrer. |
| Steg 2: åtte valg totalt | Åtte store knapper på én skjerm | Seks: Handle · Noen som blir med meg ut · Selskap og prat · Hjelp hjemme · Hjelp med telefon eller TV · Noe annet. Kjæledyr flyttes inn under «Hjelp hjemme». | Åtte valg er for mange når regelen er ett spørsmål om gangen. Seks valg dekker det samme og gjør at hele listen får plass uten å scrolle. |
| Steg 3: varighet | Omtrent 1 time / Halvannen time / Omtrent 2 timer / 3 timer eller mer | Cirka én time / Cirka halvannen time / Cirka to timer / Tre timer eller mer | Kun det andre alternativet mangler «omtrent». Ulik formulering på like valg gjør at leseren leter etter en forskjell som ikke finnes. Parallell form leses raskere høyt. |

### 4.3 Er det like lett å si nei som å si ja?

Nei. Fem steder er avslaget vanskeligere enn samtykket.

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Panel 6, hjelper foreslått | «Ja, det passer fint» (stor primærknapp) / «Jeg vil ha en annen» (liten sekundærknapp) | Begge i samme størrelse. Tekst: «Ja, det passer fint» / «Jeg vil se en annen». Under dem: «Det er helt greit å si nei. Da spør vi en annen med én gang, og du betaler ingenting for det.» | I dag sier designet «det riktige svaret er ja». For en som er redd for å være til bry, er det nok til at hun takker ja til en hun ikke vil ha hjemme hos seg. Siste setning fjerner den siste hindringen: at det skal koste noe å ombestemme seg. |
| Panel 5, mens vi leter | Ingen vei ut. Skjermen søker til den er ferdig. | Legg til en synlig knapp: **«Avbryt søket»** – og etter avbrudd: «Søket er stanset. Ingenting er bestilt, og du er ikke belastet.» | En skjerm uten utgang er den vanligste grunnen til at eldre legger fra seg telefonen. Å kunne stoppe er en del av å bestemme selv. |
| Nødvarselet | Eneste knapp: «Det er ikke akutt – fortsett bestillingen» | Legg til handlingen først: **«Ring 113»** som stor knapp (`tel:`-lenke), og behold «Det er ikke akutt – fortsett bestillingen» som likeverdig knapp under. | Nødnumrene står i dag som ren tekst mens *bortvalget* er en knapp. Da er det lettere å ignorere varselet enn å følge det. Den enkleste handlingen skal være den riktige. |
| «Gi beskjed til familien min» | Forhåndskrysset. «Anne (datter) får melding når hjelperen er på vei, når hun kommer, og når oppdraget er ferdig.» | Behold avkryssingen, men legg til: «Vil du ikke det, tar du bort haken. Da får ikke Anne beskjed denne gangen. Du kan slå det på igjen når som helst.» | Et forhåndskrysset valg om å dele opplysninger med et familiemedlem må ha en like tydelig av-vei. Den eldre skal ha kontroll over hvem som vet hva om henne – også overfor sin egen datter. |
| «Spør favoritthjelperen min først» | Forhåndskrysset. «Vi spør Sofia før vi spør andre. Er hun opptatt, går forespørselen videre.» | ✅ Behold – teksten sier både hva som skjer og hva som skjer hvis ikke. Legg til en førstegangsvariant: «Du har ingen fast hjelper ennå. Vi spør de nærmeste ledige, og du får se hvem det er før du sier ja.» | Selve teksten er god. Problemet er at den forutsetter at man allerede har en fast hjelper – ved første bestilling gir den ingen mening. |

### 4.4 Øvrig i Senior Mode

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| Panel 6, ankomsttid | Er hos deg om ca. 14 minutter | Er hos deg om cirka 14 minutter. Vi sier fra hvis det tar lenger tid. | Konkret tall er riktig. Andre setning er forskjellen mellom et anslag og et løfte – og den gjør at et forsinket besøk ikke blir et løftebrudd. |
| Panel 6, oppmøtekode | Sofia har fått adressen din nå som hun har tatt oppdraget. Når hun kommer, oppgir du koden **4821** så hun kan starte oppdraget. | Sofia har fått adressen din nå.<br>Når hun ringer på, sier du koden **4821**.<br>Ingen andre skal ha den koden. | Tre korte linjer i stedet for to lange. Siste linje er svindelforebygging uten å skremme – den sier hva koden er til, ikke hva som kan gå galt. |
| Panel 7, tidslinje | «Etterpå – Du bekrefter at oppdraget er utført. Da får Sofia betalt.» | ✅ Behold. | Kort, konkret, og forklarer hvorfor bekreftelsen betyr noe. Mønster. |
| Stemmehjelp, feil | Jeg klarte ikke å høre. Prøv igjen, eller bruk knappene over. | Jeg hørte ikke hva du sa. Prøv en gang til, eller trykk på en av knappene over. | «Klarte ikke å høre» kan leses som at det er noe galt med stemmen din. «Jeg hørte ikke» legger det på oss. |
| Stemmehjelp, tolkning | Jeg har valgt kategorien for deg. Stemmer det? | Jeg tror du trenger hjelp til dette. Stemmer det? | «Kategori» er systemets ord. Og «jeg tror» er ærligere enn «jeg har valgt» – det inviterer til å rette. |
| Bunntekst | Trenger du hjelp til å bestille? Ring oss på 400 00 000, så gjør vi det sammen. | ✅ Behold ordrett. | «Så gjør vi det sammen» er den varmeste og minst nedlatende setningen på nettstedet. |

---

## 5. Tomme tilstander, bekreftelser og varsler

### 5.1 `oppdrag.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| ✅ Tom tilstand: ikke tilgjengelig | 🌙 Du er ikke tilgjengelig nå. Slå på bryteren når du har tid, så viser vi oppdrag i nærheten. | Du er ikke tilgjengelig nå. Slå på «Tilgjengelig» øverst, så viser vi oppdrag i nærheten. | Forklarer og foreslår – mønstereksempel. Eneste endring: «bryteren» peker ikke på noe leseren kan finne igjen med øynene. |
| ⚠️ Tom tilstand: ingen treff | 🔍 Ingen oppdrag akkurat nå. Vi varsler deg så snart det kommer noe som passer. | **Ingen oppdrag som passer akkurat nå.** Vi ser etter oppdrag innenfor 5 km, i tidsrommene du har valgt. Vil du se flere? Utvid avstand eller tidsrom → | «Ingen oppdrag akkurat nå» kan leses som at tjenesten er tom, ikke at filteret er trangt. Å gjenta hjelperens egne innstillinger flytter forklaringen fra «noe er galt» til «dette kan du justere». Sjekk også at varselet vi lover faktisk sendes – hvis push ikke er bygget ennå, skal setningen ut. |
| ⚠️ Skjulte oppdrag | Et oppdrag som holdes utenfor, skal kunne forklares. Er du uenig i en begrunnelse, kan du be om manuell gjennomgang. | Behold første setning. Gjør den andre til en faktisk lenke: «Er du uenig? Be om manuell gjennomgang →» | Teksten lover en handling som ikke har noen inngang på siden. Et løfte uten knapp er verre enn ikke å nevne det. |
| ✅ Begrunnelser for skjulte oppdrag | «Dette oppdraget krever tillitsnivå 3. Du er på nivå 2. Fullfør flere oppdrag for å komme videre.» | Behold. | Avslag + årsak + vei videre i tre korte setninger. Det er slik automatiske avgjørelser skal forklares. |
| ✅ Bekreftelse: oppdrag tatt | Oppdraget er ditt. Be om oppmøtekoden når du kommer, og tast den inn for å starte oppdraget. | Behold. | Sier hva som skjedde og hva som skjer nå. |
| ⚠️ Feil oppmøtekode | Feil kode. Be om koden på nytt. | Koden stemmer ikke. Be om de fire sifrene en gang til – de vises på skjermen hennes. Får du dem ikke, ring 400 00 000. | «Feil kode» plasserer feilen hos hjelperen, som står på en dørmatte hos en fremmed. Å si hvor koden finnes løser situasjonen på tre sekunder. |
| ⚠️ Notat til familien | Skriv om oppdraget, ikke om helsen hennes. | Skriv om oppdraget, ikke om helsen til den du har hjulpet. | «Hennes» antar kjønn i en generisk tekst. Regelen er ellers riktig og viktig. |
| ⚠️ Bekreftelse: meldt ferdig | ✓ Meldt ferdig. Familien har fått varsel og skal bekrefte. Da frigis 417 kr til deg. Adressen er nå skjult igjen. | ✓ **Meldt ferdig.** Familien har fått beskjed og bekrefter vanligvis samme dag. Da frigis **417 kr** til deg. Bekrefter de ikke innen [X] timer, frigis beløpet automatisk. Adressen er nå skjult igjen. | Kvitteringen svarer ikke på hjelperens viktigste spørsmål: hva skjer hvis familien ikke gjør noe? Uten den setningen ser betalingen ut til å avhenge av en fremmed. **Fyll inn den faktiske fristen – ikke publiser med [X].** |
| ❌ «Ikke aktuelt» | Kortet forsvinner uten et ord. | «Skjult. Vi viser ikke dette oppdraget igjen. **Angre**» | En handling uten bekreftelse føles som en feil. Og et bortvalg uten angremulighet gjør at folk vegrer seg for å bruke knappen i det hele tatt. |
| ✅ Posisjon avslått | Greit. Vi bruker postnummeret ditt i stedet – da blir avstandene mer omtrentlige. | Behold ordlyden, men flytt den inn i spørsmålet (se 2.5). | «Greit.» er akkurat riktig temperatur på et avslag. |

### 5.2 `familie.html`

| Sted | I dag | Forslag | Hvorfor |
|---|---|---|---|
| ✅ Varsel: ankomst | **Sofia kom til Maria kl. 14:02.** Oppdrag: handling. Beregnet slutt 15:30. | Behold ordrett. | Navn, klokkeslett, hva og når det er ferdig. Dette er hele produktløftet i to linjer. Kopier formen til alle andre varsler. |
| ❌ Varsel: fullført | ✅ **Maria har fått hjelpen hun trengte.** | ✅ **Oppdraget hos Maria er utført.** | Vi vet at oppdraget ble utført. Vi vet ikke om Maria fikk det hun trengte – det kan bare hun avgjøre. Å påstå det er både usant og lett gjennomskuelig. Den nøkterne setningen er faktisk mer beroligende, fordi den bare sier det som er sjekket. |
| ✅ Varsel: detaljer | Sofia · 14:02–15:41 · 1 t 39 min · Notat: «Handlingen er gjort og varene er satt på plass.» · Totalt: 417 kr | Behold. | Alt den pårørende trenger, ingenting hun ikke har krav på. |
| ✅ Ulik detaljgrad | Maria får en enklere melding: «Oppdraget er ferdig. Takk, Sofia.» Ulike mottakere trenger ulik mengde informasjon. | Behold. | Samme hendelse, ulik mengde informasjon – aldri ulik sannhet. Bra at prinsippet står synlig. |
| ✅ Live-kortet | Du ser at oppdraget pågår og hvor lenge det har vart – ikke hvor Sofia beveger seg. | Behold. | Sier hva vi *ikke* viser. Det er den mest tillitsbyggende setningen på siden. |
| ❌ Tom tilstand: ingen oppdrag pågår | Finnes ikke – kortet «Oppdrag pågår nå» vises alltid utfylt | «**Ingen oppdrag pågår nå.** Neste er fredag 15:00 – gåtur og kaffe med Sofia. Du får beskjed når hun er på vei.» Uten planlagte oppdrag: «Ingen oppdrag er planlagt. Vil du bestille noe til Maria?» → *Opprett oppdrag* | Det pågår ikke oppdrag mesteparten av døgnet. Panelet må ha en rolig, informativ hviletilstand – ellers ser det ut som noe har sluttet å virke. |
| ❌ Tom tilstand: ingen fast krets | Finnes ikke – tre personer vises alltid | «**Maria har ingen fast krets ennå.** Etter de første oppdragene ser du hvem hun har hatt hos seg, og du kan be om den samme personen neste gang.» | Dag 1 er panelet tomt. Uten tekst ser det ut som en feil. Med tekst blir det et mål å jobbe mot – og en grunn til å bestille oppdrag nummer to. |
| ❌ Tom tilstand: første besøk | Finnes ikke – tabellen viser alltid tall | Alle radene: «Ingen oppdrag ennå.» + én linje under: «Her kommer oversikten så snart Maria har hatt det første besøket.» | En tabell full av streker ser ødelagt ut. Én forklarende linje gjør det til en begynnelse. |
| ⚠️ «Hvis noe ikke stemmer» | Ett trykk melder fra om uteblitt oppmøte, oppførsel, betaling, savnede gjenstander eller personvern. | Ett trykk melder fra om uteblitt oppmøte, oppførsel, betaling, savnede gjenstander eller personvern. Du får et saksnummer, og en person hos oss følger det opp. | Listen er fem ting som kan gå galt, uten et ord om hva som skjer etterpå. Da leses den som en risikoliste i stedet for en trygghet. **Bekreft at oppfølgingen faktisk er bemannet før dette publiseres.** |
| ⚠️ Statusmerke | 🟢 Hjemme | Ingen oppdrag pågår | Se 2.3. Merket antyder stedssporing av Maria. |
| ✅ Hastegrad «Nå» | Høyest hastetillegg, fordi hjelperen legger fra seg det hen holder på med. | Behold. | Forklarer prisen med et menneske i stedet for en formel. Mønstereksempel for all prisforklaring. |
| ✅ Akuttboksen | **Akutte situasjoner formidles ikke her.** Ved brann, alvorlig sykdom eller fare for liv skal nødetatene kontaktes – 113, 110 eller 112. | Behold innholdet. Del i to setninger og gjør numrene til lenker, slik som i Senior Mode. | Riktig innhold, riktig plassering, ingen skremsel. |

---

## 6. Tekstsjekkliste før publisering

Elleve spørsmål. Klarer teksten ikke alle, går den ikke ut.

**Sannhet**

1. **Kan vi holde alt som står her?** Hver påstand skal kunne pekes tilbake på noe som faktisk finnes i koden eller i driften. Ingen «100 % trygt», ingen «politiattest på alle», ingen responstid vi ikke garanterer. Det ærlige løftet – *ingen sendes hjem til familien din uten å være verifisert* – er sterkere.
2. **Er tallene sjekket i dag?** Priser, tidsanslag, antall verifiseringstrinn og behandlingstider endrer seg. Et gammelt tall er et løftebrudd.
3. **Påstår teksten noe vi ikke kan vite?** «Maria fikk hjelpen hun trengte» kan vi ikke vite. «Oppdraget er utført» kan vi vite. Skriv det som er sjekket.
4. **Lover teksten en handling som finnes?** Hvis det står «be om manuell gjennomgang», skal det være en knapp der.

**Leseren**

5. **Hvem leser dette – kjøperen, den eldre eller hjelperen?** Skriv til én av dem. Samme hendelse kan få ulik mengde informasjon, aldri ulik sannhet.
6. **Er innvendingen besvart før den rekker å bli stilt?** Pårørende spør «hvem er dette mennesket?». Hjelperen spør «hva betaler det, og når får jeg pengene?». Den eldre spør «er jeg til bry?».
7. **Står prisen før valget?** Ingen skal måtte klikke seg videre for å finne ut hva noe koster.
8. **Ingen frykt som drivkraft.** Vi skriver aldri om hva som kan skje med moren deres hvis de ikke handler.

**Håndverk**

9. **Sier etiketten hva feltet er, og hjelpeteksten hvorfor vi spør?** Er svaret på «hvorfor spør dere om dette?» ikke i teksten, er feltet ikke ferdig.
10. **Sier feilmeldingen hva som er galt *og* hva man gjør nå?** Ingen skyld hos brukeren, ingen unnskyldninger fra oss. «Postnummer består av fire siffer.» er målestokken.
11. **Er det like lett å si nei som ja?** Avslagsknappen skal ha samme størrelse og samme klarhet som ja-knappen, og svaret på et nei er «det er helt greit» – aldri en advarsel.

**To siste kontroller**

- **Les det høyt.** Er du andpusten før punktumet, er setningen for lang – særlig i Senior Mode.
- **Er to valg forvekslbare?** Hvis to alternativer inneholder samme ord eller krever at leseren kategoriserer sitt eget behov, skal de slås sammen eller skilles tydeligere.

---

## Vedlegg: ord og formuleringer som går igjen

| Unngå | Bruk | Funnet i |
|---|---|---|
| bruker *(om den eldre)* | den eldre, moren din, Maria | `bli-hjelper.html` steg 4: «Språk du kan snakke med brukeren» |
| Be om hjelp / Jeg trenger hjelp *(som knappenavn)* | Bestill hjelp | `index.html` hero og kort 1 |
| Kom i gang, Les mer, Se pårørendepanelet | Knapper som sier hva som skjer | `index.html` kort 2 |
| gyldig *(i feilmeldinger)* | Regelen skrevet ut: «består av fire siffer», «starter med 4 eller 9» | `bli-hjelper.html`, tre steder |
| behandlingstid | Vi bruker vanligvis … | `bli-hjelper.html` kvittering |
| illustrasjon | eksempel | `index.html` oppdragsforhåndsvisning |
| kategori | det leseren faktisk skal velge | `bestilling.js`, stemmehjelp |
| store knapper, få valg | det leseren får ut av det | `index.html` kort 1, `trenger-hjelp.html` ingress |
| finner *(om matching)* | spør | `index.html` hero, `trenger-hjelp.html` steg 1 |
| Hjemme *(som status)* | Ingen oppdrag pågår | `familie.html` statusmerke |

**Konsistens som bør avgjøres én gang:**

- Én handling, ett navn: bestillingen heter **«Bestill hjelp»** overalt.
- Hjelperregistreringen heter **«Bli hjelper»** i knapp, i nav og i H1.
- Hastegradene heter **«Nå»**, **«I dag»**, **«På et bestemt tidspunkt»** og **«Fast avtale»** – de samme fire ordene i `index.html`, `familie.html` og `trenger-hjelp.html`.
- «ca.» skrives ut som «cirka» i Senior Mode, forkortes ellers.
