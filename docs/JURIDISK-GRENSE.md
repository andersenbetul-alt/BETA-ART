# Den juridiske grensen

Dette er ikke juridisk rådgivning, og ingen her er jurist. Dokumentet er
beslutningen om **hva Naviar Care er og ikke er**, og hvordan grensen er bygget
inn i koden. `docs/team/JURIDISK-RISIKO.md` er risikoregisteret som skal
gjennomgås av en norsk advokat. Dette dokumentet er svaret vi selv har valgt.

Målet er ikke null risiko. Null risiko finnes ikke i noen virksomhet, og et
løfte om det ville være det første usanne i dokumentet. Målet er at ingen
enkeltbeslutning i produktet er avhengig av at noen husker en regel.

---

## Setningen alt annet henger på

> Naviar Care er en programvaretjeneste som hjelper verifiserte
> tjenesteleverandører med å planlegge, dokumentere og varsle om praktiske
> besøk utført av leverandørens egne ansatte.

Naviar Care er **ikke**:

- arbeidsgiver
- leverandør av helsehjelp
- nødtjeneste
- faglig ansvarlig for medarbeiderne
- en erstatning for leverandørens ansvar for at besøket gjennomføres forsvarlig

Naviar Care gir ikke medisinske råd og garanterer ikke at noen er trygg.

---

## De tolv beslutningene

### 1 · Ingen åpen markedsplass i v1

Privatpersoner kan ikke registrere seg som hjelper. Naviar velger ikke
medarbeidere, fordeler ikke oppdrag og setter ikke lønn. Medarbeidere legges
inn av leverandøren, som er deres arbeidsgiver.

Grunnen er ikke smak. Om noen er arbeidstaker eller selvstendig
oppdragstaker avgjøres av det reelle forholdet, ikke av hva avtalen kalles, og
ved tvil er det oppdragsgiver som må sannsynliggjøre at det er et selvstendig
oppdrag. En plattform som velger person, setter pris og styrer utførelsen,
argumenterer mot seg selv.

**I koden:** `assets/js/besok-lager.js` har `ansatte()` knyttet til én
leverandør. Det finnes ingen registrering av enkeltpersoner i `besok/`.
Markedsplassidene på rotnivå er v2-grunnlag og inngår ikke i produktet som
selges.

### 2 · Ingen helsehjelp

Ikke i katalogen, ikke som tilvalg, ikke etter avtale: medisinering,
doseringskontroll, injeksjon, sårstell, blodtrykk, blodsukker, diagnose,
helseråd, hastegradsvurdering, behandlingsplan, pasientoppfølging, tolkning av
sykehus- eller legeinstrukser, journal.

Når en privat virksomhet begynner å yte helsehjelp, utløser det et helt annet
regelverk: krav til faglig forsvarlighet, journalplikt, meldeplikt og
pasientskadeordning.

**I koden:** `OPPGAVER` i `besok-lager.js` er en fast liste. `UTENFOR` sier hva
vi ikke gjør og hvorfor. `besok-vern.js` sperrer helseord i fritekst før
lagring.

### 3 · Bare praktisk hjelp

Åtte oppgaver, fem grønne og tre gule. Handling og ærend, sosialt besøk, tur og
aktivitet, hjelp med telefon og TV, små praktiske oppgaver, lett husarbeid,
matlaging, følge til avtale.

Dette markedsføres aldri som helsetjeneste.

### 4 · Ingen personlig stell i v1

Dusjing, toalettbesøk, forflytning, mating, påkledning, fysisk løft og
håndtering av demensatferd er ute. Det er ikke fordi behovet ikke finnes – det
er fordi det krever opplæring, arbeidsmiljøvurdering og en avklart grense mot
helsehjelp som vi ikke har.

### 5 · Naviars rolle står i avtalen og på nettsiden

Rollesetningen over gjentas i vilkår, i personvernerklæringen og på
landingssiden. En rolleavgrensning som bare finnes i en PDF, er ikke en
avgrensning.

### 6 · KI-agentene har tak

Tre nivåer, styrt av oppgavens risikonivå og ikke av modellens egen vurdering:
automatisk, krever godkjenning, menneskelig avgjørelse. Nød stanser all
automatikk.

Ni ting finnes ikke som funksjon – diagnose, medisinsk hastegrad,
medisinforslag, helserisikoscore, skyldkonstatering mot en medarbeider,
vurdering av samtykkekompetanse, valg av helsepersonell, avgjørelse om rett til
helsehjelp, og enhver avgjørelse med store følger uten et menneske i sløyfen.

Brukeren skal alltid vite at det er en maskin som skriver.

**I koden:** `assets/js/besok-agenter.js`. `ALDRI`-lista er ikke en innstilling;
det er fravær av kode. Testene kontrollerer at ingenting på `KREVER_MENNESKE`
kan bli automatisk ved noe risikonivå.

### 7 · Ingen helsedata

Vi lagrer kundenummer, fornavn, dato og tid, oppgave, medarbeider, utfall,
start- og sluttid, og pårørendes kontaktpunkt. Ferdig.

Vi lagrer aldri diagnose, medisinliste, journal, legeerklæring, helsemålinger,
frie helseobservasjoner, fødselsnummer, BankID, kontonummer, kortopplysninger,
etternavn, gateadresse i besøkslista, bilder fra hjemmet, lydopptak eller
løpende posisjon.

Hver behandling har et behandlingsgrunnlag som er identifisert før
opplysningene samles inn – ikke etterpå.

**I koden:** `assets/js/besok-vern.js`, `LAGRES` og `LAGRES_ALDRI`. En test
kontrollerer at hvert lagret felt har både grunnlag og slettefrist.

### 8 · Mindre fritekst

Fem faste utfall i stedet for et notatfelt: utført, delvis utført, ikke utført,
leverandøren må følge opp, familien bør kontaktes.

Det er to korte fritekstfelt igjen – kontorets beskjed til medarbeideren, og
medarbeiderens melding. Begge sjekkes før lagring for helseopplysninger,
bankopplysninger, lange tallrekker og nedsettende omtale.

Det blokkerte innholdet lagres ikke. Å beholde en helseopplysning som bevis på
at vi nektet å ta imot en helseopplysning, er å ta imot den.

Ting som **må** fram – fall, skade, blødning, behov for ambulanse – blir ikke
bare avvist. Sperren peker på utfallet «Leverandøren må følge opp» og på 113.
En sperre uten alternativ blir omgått, og da har vi verken personvern eller
beskjeden.

### 9 · Ingen GPS, ingen bilder, ingen lyd

Dette er svaret på ønsket om å følge med på hvem som er hos den eldre og hvor
lenge: **det er allerede løst.** Medarbeideren registrerer at besøket er startet
og at det er avsluttet. Familien får hvem, når og hvor lenge. Det er hele
informasjonsbehovet.

Løpende sporing gir ikke noe mer av det, og koster mye: overvåking av ansatte er
et kontrolltiltak etter arbeidsmiljøloven kapittel 9 og krever saklig grunn,
drøfting, informasjon, og at man velger det minst inngripende tiltaket som
løser problemet. Når inn- og utsjekk løser problemet, er sporing per definisjon
ikke det minst inngripende.

Dette står også som R1 i `docs/DPIA.md`.

### 10 · Nødgrensen er synlig

I appen, hele tiden: **Naviar Care er ikke en nødtjeneste. Ved fare for liv
eller helse: ring 113.**

Agenten prøver ikke å løse en nødsituasjon. Den stanser automatikken, viser
nødmeldingen, varsler leverandørens koordinator, og skriver ingen medisinsk
vurdering – heller ikke en betryggende.

### 11 · Avtaleverket

Ti dokumenter, som skal gjennomgås av norsk advokat før første betalende kunde:

1. B2B SaaS-avtale
2. Databehandleravtale
3. Personvernerklæring
4. Vedlegg om informasjonssikkerhet
5. Retningslinjer for akseptabel bruk
6. Liste over forbudte oppgaver
7. Prosedyre for avvik og personvernbrudd
8. Lagrings- og sletteplan
9. Retningslinje for KI-bruk og menneskelig kontroll
10. Ansvarsmatrise mot leverandøren

### 12 · Ingen forbrukerabonnement i v1

Salgsmodellen er Naviar Care → verifisert leverandør → leverandørens kunder og
familier. Familien betaler ingenting og har ingen konto.

Åpner vi mot forbruker, får vi angrerett ved fjernsalg av tjenester,
opplysningsplikt før avtaleinngåelse og regler om fornyelse og oppsigelse. Hele
poenget med B2B-modellen i første versjon er å slippe den kontrakten.

**I koden:** `assets/js/besok-abonnement.js`, `STROMMER.familie.sperre`.

---

## Hvem er hvem etter personvernforordningen

| | Rolle | Betyr |
|---|---|---|
| Leverandøren | Behandlingsansvarlig | Bestemmer formål og midler. Svarer på innsyn, retting og sletting. Melder brudd til Datatilsynet. |
| Naviar | Databehandler | Behandler bare etter skriftlig instruks. Egne formål er utelukket. Melder brudd til leverandøren uten unødig opphold. |

Dette er den viktigste enkeltsetningen i hele dokumentet, fordi den bestemmer
alt annet. En databehandler som begynner å behandle opplysninger til sine egne
formål, regnes som behandlingsansvarlig for den behandlingen.

Det traff oss allerede én gang: behovsplattformen lagret rå kundetekst for at
**vi** skulle kunne utvikle produktet. Den er nå bygget om til å telle i stedet
for å huske – ingen fritekst, ingen kundeidentifikator, bare måned og antall.
Se `assets/js/besok-behov.js`.

---

## Taushetsplikt

Taushetsplikten er ikke det samme som personvernreglene, og den forsvinner ikke
selv om GDPR er i orden.

- Ansatte i offentlig helse- og omsorgstjeneste er bundet av forvaltningslovens
  taushetsplikt.
- Helsepersonell er bundet av helsepersonellovens taushetsplikt i kraft av
  yrket, uansett arbeidsgiver.
- Den som utfører tjeneste eller arbeid etter helse- og omsorgstjenesteloven, er
  bundet av taushetsplikt etter den loven – og praktisk bistand er en tjeneste
  etter den loven når den ytes på kommunens vegne.

Mange små leverandører gjør begge deler: noen besøk på kommunal avtale, noen
privat betalt. Vi vet ikke hvilken hatt leverandøren har på i det enkelte
besøket, og vi spør ikke.

**Beslutning:** vi behandler alle besøk som om taushetsplikten gjelder, og
pålegger den i avtalen uansett. Det koster oss ingenting og fjerner et helt
spørsmål.

---

## Språkkrav

B1 er minimum for å arbeide alene. B2 for følge til avtale, koordinering, og
alt som grenser mot helsehjelp.

Kravet henger på oppgaven og har en oppgitt begrunnelse, fordi et språkkrav som
ikke kan begrunnes i arbeidet, er indirekte diskriminering. Kravet gjelder likt
for alle, også for dem som har språket som morsmål.

Leverandøren vurderer og bekrefter. Naviar vurderer ingen – vi lagrer
bekreftelsen og sperrer tildeling når nivået ikke holder for oppgaven.

I Skandinavia regnes norsk, svensk og dansk som likeverdige. Island og Finland
har egne språk. Resten av Europa har ingen slik gjensidighet.

**I koden:** `assets/js/besok-sprakkrav.js`, `docs/team/JURIDISK-RISIKO.md` J22.

---

## Regelverk vi bygger etter

Kontrollert i denne gjennomgangen. Kildene er offentlige, men Datatilsynets og
Lovdatas sider var ikke direkte tilgjengelige fra utviklingsmiljøet, så
henvisningene er lest gjennom søkeresultater og andrehåndskilder. **Alt under
skal verifiseres mot primærkilden av advokat før første betalende kunde.**

| Område | Regelverk | Hva det betyr for oss |
|---|---|---|
| Behandlingsgrunnlag | Personvernforordningen art. 6 | Grunnlag identifisert per formål, før innsamling |
| Databehandler | Personvernforordningen art. 28 | Skriftlig databehandleravtale, ingen behandling utenfor instruks |
| Egne formål | Personvernforordningen art. 28 nr. 10 | Behovsplattformen anonymisert |
| Særlige kategorier | Personvernforordningen art. 9 | Helseopplysninger unngås, ikke bare beskyttes |
| Sletting | Personvernforordningen art. 5 nr. 1 bokstav e | Frist per felt, ikke «til vi rydder» |
| Brudd | Personvernforordningen art. 33 | 72 timer for leverandøren; vi varsler dem straks |
| Taushetsplikt | Forvaltningsloven § 13 flg. | Offentlig ansatte |
| Taushetsplikt | Helsepersonelloven § 21 | Helsepersonell i kraft av yrket |
| Taushetsplikt | Helse- og omsorgstjenesteloven § 12-1 | Alle som utfører tjeneste etter loven |
| Arbeidstakerbegrepet | Arbeidsmiljøloven § 1-8 | Reelt forhold avgjør; tvil går i arbeidstakers favør |
| Kontrolltiltak | Arbeidsmiljøloven §§ 9-1 og 9-2 | Ingen GPS-sporing |
| Diskriminering | Likestillings- og diskrimineringsloven § 8 | Språkkrav må være saklig og forholdsmessig |
| Forbruker | Angrerettloven | Grunn til at v1 er B2B |
| Helsehjelp | Helsepersonelloven, pasientskadeloven | Grunn til at helsehjelp er utenfor |
| KI | EUs KI-forordning | Åpenhet om at det er en maskin; menneskelig kontroll |

Menneskelig kontroll er fire konkrete ting, ikke en formulering: å forstå
systemets grenser, å kunne overstyre resultatet, å følge med på driften, og å
oppdage feil. `besok-agenter.js` har dem som `KONTROLL`, med hva som oppfyller
hver enkelt.

---

## Hvor lenge vi lagrer, og hvorfor akkurat det

Loven gir ikke noe tall. Personvernforordningen sier at opplysninger skal
slettes eller anonymiseres når de ikke lenger er nødvendige for formålet, og at
den behandlingsansvarlige selv må sette fristene og kunne dokumentere at de
følges. Det finnes altså ingen «lovlig lagringstid» å slå opp. Fristen er en
beslutning, og beslutningen må begrunnes.

Det vanskelige er at ett besøk juridisk sett er tre ting samtidig:

| Hva det er | Hvem plikten treffer | Frist |
|---|---|---|
| Regnskapsbilag | Den som fakturerer | 5 år etter regnskapsårets slutt (bokføringsloven § 13) |
| Bevis ved erstatningskrav | Leverandøren | 3 år, ytre grense 10 (foreldelsesloven §§ 2 og 9) |
| Opplysning om et menneske i sitt eget hjem | Alle som har den | Så kort som mulig |

**Femårsregelen treffer ikke oss.** Vi fakturerer leverandørens abonnement, ikke
det enkelte besøket. Bokføringsplikten for besøket ligger hos leverandøren, i
leverandørens regnskapssystem. Å lagre besøksdata i fem år «fordi
bokføringsloven sier fem år» ville vært å ta på seg en plikt vi ikke har – og
det er akkurat den feilen som gjør at systemer lagrer alt for lenge.

### Vi sletter ikke besøket. Vi krymper det.

En sletting på én dato betyr at fullt navn, kontaktopplysninger og fritekst
ligger urørt til dagen før. I stedet faller feltene bort etter hvert som
formålet deres tar slutt:

| Etter | Forsvinner | Fordi |
|---|---|---|
| 12 timer | Arbeiderlenken | Lenken har gjort jobben. En lenke i en SMS-tråd er en åpen dør |
| 7 dager | All fritekst – kontorets beskjed og medarbeiderens melding | Familien har lest meldingen. Setningene er den delen som kan bære noe personlig |
| 30 dager | Fornavn, pårørendes kontaktpunkt, medarbeiderens navn | Etter en måned er ingen i tvil om hva som skjedde |
| 365 dager | Id, oppgaver, ansatt-id, tidspunkter. Datoen kortes til måned | Det som står igjen handler ikke om noen |

Etter det siste trinnet er raden `{ dato: "2026-08", utfall: "utfort", sekunder:
2400 }`. Anonyme opplysninger er ikke personopplysninger og faller utenfor
regelverket – men bare hvis de faktisk er anonyme. Derfor kortes datoen til
måned: en eksakt dato sammen med varighet og utfall peker fortsatt på ett
bestemt besøk hos ett bestemt menneske. En slik rad er ikke anonym, den er
navnløs, og det er ikke det samme.

**Rutinen kjører ved hver lesning**, ikke som en nattjobb som kan stanse uten at
noen merker det. En sletterutine som ikke kjører, er ikke en sletterutine – den
er en setning i en personvernerklæring.

**I koden:** `SLETTEPLAN` og `krymp()` i `assets/js/besok-vern.js`, kalt fra
`rydd()` i `assets/js/besok-lager.js`. Ni tester holder planen fast, blant annet
at ingen av de opprinnelige verdiene finnes igjen i raden etter et år.

### Retten til sletting

Krav om sletting kan ikke settes til side for besøksdata hos oss – vi har ingen
lovpålagt plikt til å beholde dem. Unntaket i personvernforordningen gjelder der
lagringen er nødvendig for å oppfylle en rettslig forpliktelse, og det er
leverandørens regnskapsbilag, ikke våre besøksrader.

Trenger leverandøren dokumentasjonen lenger enn planen gir, eksporterer de den
til sine egne systemer, der de er behandlingsansvarlig for den. Vi er ikke
leverandørens arkiv.

### Hva som må avklares

7. Er 7 dager for kort for medarbeiderens melding, gitt at en klage kan komme
   etter to uker? Alternativet er 30 dager for fritekst, som er et reelt
   personvernstap. Vi har valgt det korteste og lar leverandøren eksportere.
8. Er `{ måned, utfall, varighet }` anonymt nok når leverandøren er liten og har
   få besøk? Hos en leverandør med tre besøk i august er raden i praksis
   identifiserbar for den som kjenner driften.


---

## Klagekanal og svarfrister

De fleste fristene her står i lov, og de løper fra noen sier fra – ikke fra vi
rakk å se på det. En 72-timersfrist bryr seg ikke om at det var helg.

| Hva | Frist | Hvem | Hjemmel |
|---|---|---|---|
| Mistanke om vold, overgrep, omsorgssvikt | Straks | Politiet | Straffeloven § 196 |
| Misbruk av stillingen | Straks | Politiet, via leverandøren | Vår regel |
| Personvernbrudd: vi → leverandøren | Uten ugrunnet opphold | Leverandøren | Art. 33 nr. 2 |
| Personvernbrudd: leverandøren → tilsynet | 72 timer | Datatilsynet | Art. 33 nr. 1 |
| Personvernbrudd → de berørte | Uten ugrunnet opphold, ved høy risiko | Den enkelte | Art. 34 |
| Innsyn, retting, sletting | 1 måned (+2 ved varsel) | Leverandøren | Art. 12 nr. 3 |
| Fall, skade, tap | Samme dag | Driftsansvarlig | Vår regel |
| Klage på medarbeider eller på oss | 1 virkedag bekreftet, 5 til svar | Leverandøren / Naviar | Vår regel |

**Vi melder ikke til Datatilsynet.** Som databehandler har vi ingen selvstendig
meldeplikt dit; vi melder til leverandøren, som melder videre. Databehandler-
avtalen må si uttrykkelig om vi har fullmakt til å sende en fristavbrytende
førstemelding på deres vegne. Uten den setningen risikerer man at begge tror
den andre meldte.

**Forlengelsen av månedsfristen krever et varsel**, ikke bare at det tok lengre
tid. Varselet må sendes innen den opprinnelige måneden, med begrunnelse.

### Misbruk av stillingen

Den som slipper inn i et hjem, har fått noe som ikke kan kontrolleres utenfra.
Derfor er terskelen lav og svaret alltid det samme: vi anmelder.

Skillet det er verdt å holde rett, fordi det avgjør om noen kan la være:

Avvergingsplikten i straffeloven § 196 har en **uttømmende** katalog. Den
gjelder vold og seksuallovbrudd – grov kroppsskade (§ 274), mishandling i nære
relasjoner (§§ 282 og 283), voldtekt (§ 291), misbruk av overmaktsforhold
(§ 295). **Tyveri og bedrageri står ikke der.** Å anmelde økonomisk utnyttelse
er derfor en rett, og hos oss en regel vi har satt selv – ikke en lovpålagt
plikt.

Men to broer går over til katalogen, og de er ikke teoretiske:

- **§ 282 verner den som er «i hans omsorg».** En medarbeider som yter omsorg i
  hjemmet, kan være nettopp den personen loven snakker om.
- **§ 295 gjelder misbruk av overmaktsforhold.** Å være alene med noen som er
  avhengig av deg for å komme seg gjennom dagen, *er* et overmaktsforhold.

Medarbeideren skal ikke stå i noens gang og finne ut hvilken paragraf hun er
borti. Hun skal si fra. Sorteringen er vår jobb, og den er derfor skrevet ned
på forhånd og ikke overlatt til øyeblikket.

**Varselet står på alle 18 språk**, over oppgavelista i arbeiderskjermen – ikke
under, og ikke i vilkårene. Det som kommer etter handlingen, er ikke et varsel.
Grunnen til at det er oversatt: den som er nyest i landet er også den som
lettest blir presset til å gjøre en tjeneste med et bankkort, og den som minst
av alt tør å si fra.

### Rødt på en konto

Rødt betyr at en person ikke får flere oppdrag. Det er en avgjørelse med følger
for noens inntekt.

1. **Automatikken foreslår. Den setter aldri.** En automatisert avgjørelse som i
   betydelig grad påvirker noen, krever menneskelig inngripen, begrunnelse og en
   mulighet til å si sin mening – personvernforordningen artikkel 22. Et rødt
   merke satt av en modell er nettopp det artikkelen handler om.
2. **Rødt krever et navn og en grunn.** Ikke en score. En begrunnelse som ikke
   kan leses opp for den det gjelder, er ingen begrunnelse. `settStatus()` nekter
   å sette rødt uten `satt_av`, `grunn` og `varslet`.
3. **Personen får vite det og får svare.** Vi er ikke arbeidsgiver –
   konsekvensen for ansettelsesforholdet er leverandørens sak. Men å bli stengt
   ute uten å få vite hvorfor, skal ikke kunne skje her.

Én dårlig tilbakemelding gir aldri rødt. Mønster krever minst tre hendelser fra
minst to ulike kunder – ellers er det én kundes opplevelse, og det er noe annet.
De alvorlige tilfellene (misbruk, overgrep, penger, betaling utenom) foreslår
stans umiddelbart, uten å vente på et mønster.

**I koden:** `assets/js/besok-klage.js`. 20 tester.


---

## Hva som fortsatt må avklares av advokat

Dette dokumentet fjerner ikke behovet for en gjennomgang. Det gjør den
billigere, fordi spørsmålene er konkrete:

1. Er rollefordelingen behandlingsansvarlig/databehandler riktig, gitt at vi
   utformer familiemeldingen og bestemmer hva som kan skrives i den?
2. Holder «vi behandler alle besøk som om taushetsplikten gjelder» som
   avtalemessig løsning, eller må leverandøren opplyse hvilket grunnlag hvert
   besøk ytes på?
3. Er 365 dager riktig standard for besøkshistorikk, eller finnes det en
   dokumentasjonsplikt som krever lengre – eller en dataminimeringsplikt som
   krever kortere?
4. Er det å sperre en tildeling på grunnlag av bekreftet språknivå en
   automatisert avgjørelse med rettsvirkning etter art. 22?
5. Hvem er avtalepart når den eldre selv ikke er kunde, men er den registrerte?
6. Utløser familiemeldingen utleveringsspørsmål når mottakeren er oppgitt av
   leverandøren og ikke av den eldre selv? (Se J2.)

De to siste er merket **A** i risikoregisteret og blokkerer drift.
