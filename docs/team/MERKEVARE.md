# Merkevareplattform

Eier: merkevare (`.claude/agents/brand.md`). Sist revidert: august 2026.

Dette dokumentet er skrevet for noen som ikke var i rommet. Det inneholder
beslutninger, ikke stemninger. Der det står «alltid» eller «aldri», er det ment
bokstavelig, og en avvikelse skal begrunnes skriftlig av den som gjør den.

Beslektede dokumenter: `docs/SERVICE-BLUEPRINT.md` (flyten), `docs/EUROPA.md`
(landlagene), `docs/DRIFT.md` (fristene og eskaleringen), `docs/GDPR.md`
(personvernreglene). Denne teksten overstyrer ingen av dem.

---

## 0. De seks beslutningene i kortform

1. Vi er en formidler av **praktisk hverdagshjelp**, ikke en omsorgstjeneste.
   Grensen mot helsehjelp er en merkevaregrense, ikke bare en juridisk.
2. Navnet **Naviar bæres ikke til Sverige, Tyskland og Spania.** Vi bygger
   ett paraplynavn for alle fire markeder. Se kapittel 2.
3. **Verifiseringsmerket er selskapets mest verdifulle eiendel.** Det bæres av en
   person, aldri av selskapet. Se kapittel 3.
4. **Merket skal slutte å være en emoji.** 🛡️ og 🧭 gjengis ulikt på hver enhet og
   kan ikke beskyttes. Se kapittel 3 og 5.
5. **Senior Mode er ikke en forenklet utgave.** Det er designsystemets strengeste
   tilfelle. Se kapittel 5.6.
6. **Vi markedsfører aldri med frykt, skyld eller knapphet.** Se kapittel 6.

---

## 1. Merkeplattform

### 1.1 Hva vi er

Naviar formidler praktisk hverdagshjelp til eldre som vil bo hjemme,
utført av verifiserte hjelpere i nabolaget, med familien koblet på.

Vi er tre ting samtidig, og alle tre må stemme:

| Rolle | For hvem | Hva vi faktisk leverer |
|---|---|---|
| Bestillingskanal | Den eldre | Å be om hjelp uten å be noen om en tjeneste |
| Innsynskanal | Den pårørende | Å vite hva som skjedde, uten å overvåke |
| Arbeidskanal | Hjelperen | Oppdrag i gangavstand, med forutsigbar betaling |

Kjernen i tjenesten er én setning fra `README.md`, og den er også merkevarens kjerne:
**ikke den nærmeste personen, men den nærmeste kvalifiserte og betrodde personen.**

### 1.2 Hva vi ikke er

Dette er ikke ydmykhet. Det er avgrensninger som holder løftet vårt mulig å holde.

- **Ikke en helsetjeneste.** Ingen medisinering, sårstell, personlig stell eller
  pleieoppgaver. Vi sier ikke «omsorg», «pleie» eller «vård» om det vi gjør.
- **Ikke et vikarbyrå.** Vi bemanner ikke kommuner, og vi lover ikke dekning.
- **Ikke en trygghetsalarm.** Vi svarer ikke på nødsituasjoner. 113 og 112 gjør det.
- **Ikke et overvåkingsprodukt.** Familien ser at et oppdrag pågår. Familien ser
  aldri hvor hjelperen eller den eldre beveger seg.
- **Ikke en gig-plattform der laveste pris vinner.** Prisen er satt av modellen,
  ikke av budgivning mellom hjelpere.
- **Ikke et sosialt nettverk.** Ingen profilfeeder, ingen likes, ingen poeng.
- **Ikke en familie.** Vi sier aldri «vi er som en familie for mor». Vi er en
  tjeneste hun betaler for, og det er en styrke, ikke en mangel.

### 1.3 Løftet

> **Bo hjemme. Få hjelp når du trenger det. Ha familien nær – uansett hvor de bor.**

Løftet gjelder tre mennesker samtidig, og skal kunne leses av alle tre uten at noen
av dem blir gjort til et problem som skal løses.

**Det som holder løftet oppe (og som må kunne dokumenteres når som helst):**

| Løftets del | Beviset | Hvor det ligger |
|---|---|---|
| «Bo hjemme» | Praktisk hjelp, ikke institusjonalisering. Åtte oppdragstyper, ingen helsehjelp | `index.html`, matchingens absolutte krav |
| «Få hjelp når du trenger det» | Pris før bestilling, matching på nærhet og ledighet, akuttfilter til nødetatene | `assets/js/pris.js`, `assets/js/bestilling.js` |
| «Ha familien nær» | Varsel ved oppmøte og ferdigmelding, Care Circle, fast hjelper | `familie.html` |
| «Verifisert» | ID-kontroll, to referanser som ringes, kurs, tillitsnivåer | `trygghet.html` |

**Det løftet ikke sier, og som ingen har lov til å legge til:**

- Ikke «trygt». Ikke «100 %». Ikke «garantert». Ikke «alltid».
- Ikke at hjelperen erstatter kommunen, hjemmetjenesten eller familien.
- Ikke at vi vet hvordan den eldre har det. Vi vet hva som ble gjort, og når.

Formuleringen som er godkjent til bruk, og som skal brukes ordrett når spørsmålet
kommer: *«Ingen sendes hjem til familien din uten å være verifisert – med
ID-kontroll, referansesjekk, opplæring og dokumentert oppdragshistorikk.»*

### 1.4 De tre tingene som skiller oss fra en vanlig oppdragsmarkedsplass

En oppdragsmarkedsplass tjener på **flest mulig treff mellom flest mulig parter**.
Vi tjener på det motsatte, og det er derfor produktet ser annerledes ut.

**1. Vi begrenser tilbudssiden med vilje.**
En markedsplass vokser ved å slippe inn flere leverandører. Vi vokser ved å slippe
inn færre, og vise dem for færre oppdrag. Matchingen bruker *absolutte krav* som
filtre, ikke som poeng: brytes ett av dem, tilbys oppdraget aldri – uansett hvor
høyt alt annet scorer (`assets/js/matching.js`). Tillitsnivåene gjør at den som
registrerte seg i går, ikke ser det mest sensitive oppdraget i dag. En markedsplass
opplever knapphet som et problem. For oss er knappheten produktet: den er grunnen
til at merket betyr noe.
*Konsekvens for kommunikasjon:* vi skryter aldri av antall hjelpere. Vi snakker om
hvem som ikke slipper gjennom.

**2. Den som betaler, er ikke den som mottar – og begge får sannheten.**
En markedsplass har én kunde. Vi har tre mottakere av samme hendelse: den eldre,
den pårørende og hjelperen. De får ulik **mengde** informasjon, aldri ulik
**sannhet**. Samme oppdrag, samme klokkeslett, ulik detaljgrad: pårørende får
«Sofia · 14:02–15:41 · 1 t 39 min · 417 kr», den eldre får «Oppdraget er ferdig.
Takk, Sofia.» Ingen av dem får en versjon den andre ville protestert på.
*Konsekvens for kommunikasjon:* enhver melding skal kunne vises til de to andre
mottakerne uten at noen blir flau. Det er testen.

**3. Vi lykkes når det blir den samme personen neste gang.**
En markedsplass tjener på hver nye match. Vi taper på dem. Målet er «de samme
to–tre menneskene, ikke en ny fremmed hver uke» (`trygghet.html`). Derfor vekter
matchingen tidligere oppdrag hos samme familie høyest av alle faktorer (25), og
derfor finnes «fast hjelper» og Care Circle. Gjentakelse er ikke en lojalitetsmekanisme
– det er kvalitetsmålet.
*Konsekvens for kommunikasjon:* vi måler og omtaler aldri vekst i antall oppdrag
alene. Andel oppdrag utført av en hjelper familien har hatt før, er tallet vi
snakker om utad.

En fjerde egenskap er ikke en differensiator, men en inngangsbillett vi ikke gir
slipp på: **forklarbarhet**. Hvert oppdrag som vises, har en begrunnelse, og hvert
oppdrag som holdes utenfor, har en grunn. Ingen konto stenges permanent av en
terskel. Det er et krav i `docs/EUROPA.md`, og det er også merkevaren: en tjeneste
som skjuler hvorfor, kan ikke be om tillit.

### 1.5 Merkevarehierarki

```
PARAPLYNAVN  (selskapet og plattformen, ett navn i alle markeder)
    │
    ├── Verifiseringsmerket   ← eiendelen. Bæres av personer, aldri av oss.
    │
    ├── Senior Mode           ← funksjonsnavn, ikke et undermerke. Aldri egen logo.
    ├── Pårørendepanelet      ← funksjonsnavn
    ├── Oppdragstavla         ← funksjonsnavn
    └── Care Circle           ← se kapittel 2.6: skal fornorskes/oversettes
```

Vi lager ikke undermerker. Alt som ikke er navnet eller merket, er en beskrivelse
av en funksjon og skrives med liten forbokstav der språket tillater det.

---

## 2. Navnevurdering: Naviar i fire markeder

### 2.1 Hva navnet gjør i dag

I Norge fungerer det. Det er sammensatt av to kjente ord, sier hvem tjenesten
snakker til, og har allerede innhold: nettsted, tekst, tone og et verifiseringsmerke
som bærer navnet.

Det har likevel to svakheter allerede på norsk, og de bør noteres uavhengig av
utenlandssaken:

- **Navnet peker på feil person.** Det gjør den pårørende til «pilot» over den
  eldre. Det står i direkte spenning med regelen vår om at vi snakker til den eldre
  som en voksen. Den eldre er hovedpersonen i tjenesten, men ikke i navnet.
- **«Pilot» betyr også prøveprosjekt.** Forsiden sier i dag «Pilot · Oslo og Viken»
  rett under navnet Naviar. En tjeneste man overlater moren sin til, bør
  ikke hete «prøveversjon». Dette bør rettes i norsk tekst uansett hva vi gjør med
  navnet: bruk «Oslo og Viken – vi starter her» i stedet for eyebrow-teksten «Pilot».

`README.md` bærer allerede et skyggenavn – «Naviar / Nærhjelp». At det
finnes to navn i toppen av repoet, er i seg selv et signal om at spørsmålet ikke er
avgjort. Det avgjøres her.

### 2.2 Vurdering per marked

| | Uttale | Betydning | Forståelighet | Skriving og søk |
|---|---|---|---|---|
| **Norge** | Uproblematisk | «Pårørende» er dagligtale. «Pilot» = los/fører, men også prøveprosjekt | Høy | Å og ø er hverdag |
| **Sverige** | «ø» finnes ikke i svensk. Svensker leser det som ö og skriver «Pårörende» – som ikke er et ord | Ingen. Svensk bruker *anhörig* / *närstående* | Lav. Leses som dansk-norsk, altså «utenlandsk» | Feilstaves systematisk. To varianter i søk fra dag én |
| **Tyskland** | Ingen lesbar tysk uttale. Typisk forsøk: «Pa-ro-ren-de». Å og ø finnes ikke på tysk tastatur | Ingen. Tysk bruker *Angehörige*. «Pilot» er kjent, men *Pilotprojekt* betyr prøveprosjekt | Svært lav. Fire stavelser uten holdepunkt | Må staves bokstav for bokstav på telefon. Diskvalifiserende for muntlig markedsføring |
| **Spania** | «rø» er ikke uttalbart uten omskriving. Å og ø finnes ikke i alfabetet | Ingen. Spansk bruker *familiares* / *cuidador*. *Proyecto piloto* = prøveprosjekt | Svært lav | Ordet kan ikke skrives på et spansk tastatur uten spesialtegn |

Tre forhold i tillegg, som gjelder alle tre nye markeder:

- **Domenet blir uleselig.** Et domene med å og ø kodes som `xn--...` i lenker,
  e-postoverskrifter og sikkerhetsvarsler. En tjeneste som ber familier om ikke å
  klikke på mistenkelige lenker, kan ikke selv ha en lenke som ser ut som svindel.
- **Merket kan ikke uttales.** «Naviar Verifisert» er et merke en tysk eller
  spansk familie skal kjenne igjen, si høyt og etterspørre. Et merke ingen kan si,
  kan ikke bli et krav i markedet.
- **Ironisk nok passer navnet best der det er minst uttalbart.** I Spania er
  pårørendepanelet selve produktet (`docs/EUROPA.md`): mange eldre har familien i
  utlandet. Betydningen treffer, ordet gjør det ikke.

### 2.3 De tre alternativene, vurdert

**Behold navnet i alle markeder.** Forkastes. Det er ikke navnet som er problemet
alene, men at verifiseringsmerket arver det. Vi ville brukt de neste fem årene på å
lære fire befolkninger å uttale et ord som ikke betyr noe for tre av dem, i stedet
for å lære dem hva merket betyr.

**Tilpass navnet per marked** (f.eks. AnhörigPilot / AngehörigenPilot / PilotoFamiliar).
Forkastes, og dette er den viktigste vurderingen i dokumentet. Fire navn gir fire
merker, og fire merker gir intet merke. Verifiseringen er hele eiendelen vår; den
tåler ikke å bli splittet i fire ord som ikke gjenkjennes over en grense. Løsningen
er dessuten skjørere enn den ser ut: en spansk familie med mor i Alicante og datter
i Stuttgart – nøyaktig vår kjernebruker – ville møtt to ulike merker for samme
kontroll. I tillegg dobler det kostnaden ved varemerke, domener og apper i fire
land, og gjør enhver felles kampanje umulig.

**Bygg ett paraplynavn.** **Dette anbefales.** Ett navn, ett merke, ett domene, én
app – og fire lokale *beskrivelser* som gjør jobben navnet ellers måtte gjort.
Navnet trenger ikke forklare tjenesten. Det må kunne sies, skrives og huskes i fire
språk, og bære ordet «verifisert» ved siden av seg.

### 2.4 Krav til paraplynavnet

Et navn som ikke oppfyller alle disse, skal ikke inn på kortlista:

1. Kun ASCII-bokstaver. Ingen å, ø, æ, ö, ü, ñ, ß, aksenter.
2. To eller tre stavelser. Trykk på første stavelse i alle fire språk.
3. Uttales likt nok av en nordmann, svenske, tysker og spanjol til at det er samme
   ord over telefon. Testes ved å lese navnet høyt for fem morsmålsbrukere per
   marked og be dem skrive det ned.
4. Ingen utilsiktet betydning i norsk, svensk, tysk, spansk eller katalansk – og
   heller ikke i engelsk, som alle fire markeder leser.
5. Ingen påstand vi ikke kan holde. Ord som *trygg, safe, care, cura, sicher* er
   utelukket: de lover det vi uttrykkelig sier at vi ikke lover.
6. Ikke *pilot*, ikke *prøve*, ikke *test*, ikke noe som betyr prøveprosjekt.
7. Fungerer i sammensetningen «[Navn] Verifisert / Verifierad / Verifiziert /
   Verificado» uten å bli en tungebrekker.
8. Ledig som `.com` og som nasjonalt domene i alle fire land, og klarerbart som
   EU-varemerke i klasse 35, 42 og 45.
9. Fungerer som verb-løs logo i 20 piksler, og som ord i en radioreklame.

### 2.5 Prosess og retninger

Selve navnevalget kan ikke låses her, fordi punkt 8 krever en varemerkegransking
vi ikke har gjort. Det som låses her, er **strukturen** (ett paraplynavn) og
**kravene** (2.4). Retningene under er utgangspunkt for granskingen, ikke forslag
til vedtak:

- **Personretningen.** Et kort navn som ligner et fornavn. Fordelen er at tjenesten
  handler om at et menneske kommer på døra, og at merket da leses som en person som
  har blitt kontrollert. Risiko: personnavn er tungt beslaglagt som varemerker.
- **Nærhetsretningen.** Et kort, latinsk-nøytralt ord som antyder nabolag,
  gangavstand eller runde/rute. Fordelen er at nærhet er det faktiske
  produktprinsippet. Risiko: fort generisk, vanskelig å beskytte.
- **Kontrollretningen.** Et ord i slekt med *verus* / verifisere. Fordelen er at
  navnet og merket blir samme idé, og at merket dermed forsterker navnet hver gang
  det vises. Risiko: kan bli teknisk og kaldt, og må balanseres av varmen i palett
  og tone.

Anbefalt fremdrift: 12–15 kandidater mot kravlisten → uttaletest i fire markeder →
juridisk gransking av de fem som overlever → valg. Regn tre til fire måneder.

### 2.6 Overgang, og hva som skjer med det gamle navnet

- **Ett bytte, ikke en glidning.** Paraplynavnet innføres i Norge samtidig som
  Sverige åpner. En periode med to navn i markedet svekker merket mer enn selve
  byttet gjør.
- **Norge får en avsenderlinje i seks måneder:** «[Navn] – tidligere Naviar».
  Deretter fjernes den. Ingen dobbeltlogo, ingen «by Naviar» i det uendelige.
- **Merket bytter navn samme dag som selskapet.** Det finnes aldri to gyldige
  verifiseringsmerker samtidig.
- **Naviar beholdes som registrert varemerke i Norge** selv etter byttet, for
  ikke å slippe navnet til andre i en sårbar overgang.
- **Care Circle skal ut.** Et engelsk funksjonsnavn i en norsk, svensk, tysk og
  spansk tjeneste for eldre er en fremmedgjøring vi ikke har råd til. Erstattes av
  et beskrivende ord per språk (nb: «Nære hjelpere» eller «Din krets», sv: «Din
  krets», de: «Ihr Kreis», es: «Tu círculo»). Avgjøres sammen med copy.

### 2.7 Lokale beskrivelser og ord som er forbudt per marked

Paraplynavnet bærer ikke betydning alene. Beskrivelseslinjen gjør jobben, og den er
skrevet i markedet, ikke oversatt fra norsk.

| Marked | Beskrivelseslinje | Ord vi aldri bruker der, og hvorfor |
|---|---|---|
| Norge | Praktisk hjelp hjemme. Verifiserte hjelpere i nabolaget. | *pleie, omsorg, hjemmetjeneste* – beskriver kommunens ansvar og lovregulert helsehjelp |
| Sverige | Praktisk hjälp hemma. Verifierade hjälpare i grannskapet. | *vård, omsorg, hemtjänst* – kommunalt ansvar; å bruke dem er både misvisende og juridisk risikabelt |
| Tyskland | Praktische Alltagshilfe zu Hause. Verifizierte Helfer aus der Nachbarschaft. | *Pflege, Pflegedienst, Betreuung* – regulert pleiebegrep. Bruk *Alltagshilfe* |
| Spania | Ayuda práctica en casa. Ayudantes verificados del barrio. | *cuidador/a, cuidados, asistencia sanitaria* – peker mot helse- og pleiearbeid, og mot en yrkesgruppe med egne arbeidsvilkår |

Verifiseringsordet er fast: **Verifisert / Verifierad / Verifiziert / Verificado.**
Aldri *sertifisert, certifierad, zertifiziert, certificado* – vi sertifiserer ingen,
vi kontrollerer. Aldri *godkjent, godkänd, genehmigt, aprobado* – vi godkjenner
ikke mennesker.

---

## 3. Tillitsmerket

Merket er det eneste vi eier som ikke kan kopieres av en konkurrent på en uke. En
logo kan kopieres. En prismodell kan kopieres. Et merke som er vanskelig å få, kan
bare kopieres av noen som gjør det like vanskelig – og da har markedet fått det det
trengte uansett.

Derfor behandles merket her som et **register**, ikke som et grafisk element: hvem
som står i det, hva som kreves for å komme inn, hvor fort man faller ut, og hvem
som bestemmer.

### 3.1 Hva merket betyr, ordrett

> **Verifisert betyr kontrollert. Det betyr ikke trygt.**

Merket dokumenterer at fem kontroller er gjennomført på en navngitt person, på en
oppgitt dato, i et bestemt marked. Det er en påstand om fortiden, ikke en garanti
om fremtiden. Denne setningen skal stå der merket forklares, i alle markeder.

### 3.2 Utforming

Dagens merke er emojien 🛡️. Det skal erstattes, av tre grunner: emoji tegnes av
Apple, Google og Microsoft og ser ulikt ut på hver enhet; det kan ikke
varemerkebeskyttes; og et skjold lover *beskyttelse*, som er nøyaktig det vi sier at
vi ikke lover. Vi dokumenterer en kontroll. Formen skal si «kontrollert», ikke «vernet».

**Anbefalt form – kontrollseglet:**

- En sirkel i merkegrønn, med en hvit hake sentrert i.
- Rundt sirkelen en tynn ring med **én åpning** ved klokka ti. Åpningen er både det
  som gjør merket vårt og ikke en generisk hake, og en betydning: kontrollen er
  gjennomført, ikke forseglet for alltid.
- Haken opptar ca. 46 % av sirkelens bredde. Strektykkelse 10 % av diameteren,
  runde endeavslutninger. Ringen: 6 % av diameteren, åpning på 40 grader.
- Ingen gradient, ingen skygge, ingen dybde. Flatt.

**Låsen – merket opptrer aldri alene.** Merket uten opplysningene under er ikke
merket, det er en dekorasjon:

```
(seglet)  Verifisert · nivå 2 · kontrollert 14.03.2026
```

- Navnet på personen står alltid over eller foran låsen.
- Nivå og kontrolldato kan aldri utelates. Et merke uten dato er en påstand uten
  holdbarhet.
- Datoen forkortes aldri til «nylig», «i år» eller «oppdatert».

**Størrelser og luft**

| Bruk | Diameter | Regel |
|---|---|---|
| Liste, tabell | 20 px | Minstemål. Under dette: kun tekst, aldri et krympet segl |
| Hjelperkort, varsel | 28 px | Standard |
| Senior Mode | 44 px | Følger 21 px grunnskrift og 96 px trykkflater |
| Trykk, presentasjon | 64 px+ | |

Fri luft rundt merket: minst halvparten av diameteren på alle sider.

**Farger**

- Standard: fyll `#1f6f5c`, hake og ringåpning i hvitt, på hvit eller sandfarget grunn.
- Invertert: hvitt fyll, hake i `#175446`, kun på den dype grønne flaten.
- Én farge: heldekkende svart for trykk, avtaler og dokumenter som fakses eller kopieres.
- Aldri i aksentoransje. Aldri gull, sølv eller bronse – vi rangerer ikke mennesker
  i metaller.

**Aldri:** animert · roterende · som lasteindikator · som mønster eller tapet ·
over et fotografi · med slagskygge · skjevstilt · i en emnelinje · i en annonse ·
som del av logoen · i samme lås som en stjernevurdering. Fortjeneste og kontroll er
to forskjellige ting, og skal aldri leses som ett tall.

**Tilgjengelighet.** Merket bærer aldri betydning alene gjennom farge eller form.
Ordet «Verifisert» står alltid der. Alternativ tekst skrives fullt ut:
*«Verifisert – nivå 2, kontrollert 14. mars 2026.»* I Senior Mode erstattes
merkelåsen av en hel setning: *«Vi har kontrollert legitimasjonen til Sofia, snakket
med to referanser, og hun har fullført sikkerhetskurset.»*

### 3.3 Hvem som får bære merket

Merket bæres av **én person i ett marked**. Ikke av selskapet, ikke av en kommune,
ikke av en partner, ikke av en kampanje, ikke av en investor, ikke av oss.

Alle fem kravene må være oppfylt samtidig. Dette er en OG-liste, ikke en poengsum,
og den følger de absolutte kravene i matchingmotoren:

1. Verifiserte kontaktpunkter: engangskode på SMS og bekreftet e-postadresse.
2. Elektronisk ID-kontroll med selfie-match mot legitimasjon, gjennomført hos ekstern
   leverandør, i det markedet hjelperen skal ta oppdrag i.
3. To referanser som faktisk er oppringt, med dokumenterte svar på de fire faste
   spørsmålene, og ingen av dem nær familie.
4. Sikkerhetskurset bestått med minst 85 %.
5. Aktiv konto uten åpen sikkerhetssak.

**Nivået står alltid ved siden av merket** (1 Ny, 2 Betrodd, 3 Erfaren, 4 Fagperson).
Merket alene sier «kontrollert», nivået sier «hvor langt». Vi viser aldri det ene
uten det andre.

**Merket krysser ikke landegrenser.** ID-kontrollen skjer mot en nasjonal
eID-løsning. En hjelper som er verifisert i Norge, er ikke verifisert i Spania før
kontrollen er gjort på nytt der. Dette skal stå i hjelperens profil, ikke skjules.

**Hjelperens bruksrett er begrenset til tjenesten.** Merket kan vises i egen profil
inne i appen. Det kan ikke settes på visittkort, plakater, Facebook-profiler,
CV-er eller en konkurrerende plattform. Grunnen er praktisk, ikke gjerrig: et merke
vi ikke kan trekke tilbake samme dag, er ikke et merke. Brudd på denne regelen
behandles som brudd på vilkårene, ikke som en markedsføringssak.

### 3.4 Hvordan merket mistes

Tre mekanismer, med ulik hastighet og ulik beslutningstaker. Skillet mellom dem er
selve poenget: maskinen kan skjule merket raskt, men bare et menneske kan ta det.

| Mekanisme | Utløses av | Hvem bestemmer | Hvor fort | Hva familien ser |
|---|---|---|---|---|
| **Skjult** (reversibelt, automatisk) | Sikkerhetsmelding mottatt (P1) · ID-kontroll utløpt (24 mnd) · kurs ikke fornyet (12 mnd) · referanse trukket tilbake | Systemet | Umiddelbart, ikke ved neste nattkjøring | Hjelperen er ikke tilgjengelig. Ingen begrunnelse gis |
| **Inndratt midlertidig** | Sak under utredning: uteblitt oppmøte gjentatte ganger, klage på oppførsel, betalingsavvik | Driftsleder | Innen fristen for alvorsgraden (`docs/DRIFT.md`) | Hjelperen er ikke tilgjengelig. Familier som har hatt hjelperen, får beskjed om at hun ikke er tilgjengelig og om å ta kontakt hvis noe har skjedd |
| **Inndratt permanent** | Pengeregler brutt (kontanter, kort, PIN, BankID, lån, gaver, verdisaker) · grensebrudd · brudd på taushetsplikt · identitetsmisbruk, inkludert å la en annen utføre oppdraget · brudd på personvernreglene | Et navngitt menneske, aldri en terskel | Etter utredning, med skriftlig begrunnelse | Som over. Sakens innhold deles ikke før konklusjon foreligger |

Fire regler rundt tapet, som gjelder uansett mekanisme:

- **Pause er ikke tap.** En hjelper som slår av tilgjengelighet, mister ikke merket.
  Hun er verifisert, bare ikke ledig. Å blande de to ville straffet folk for å ha fri.
- **Enhver inndragning følges av en skriftlig begrunnelse og en klagevei** med
  frist. Dette er både et krav om åpenhet i algoritmisk styring og en merkevareregel:
  et merke som forsvinner uten forklaring, lærer alle andre at det er vilkårlig.
- **Fornyelse er ikke stilltiende.** Kommer et merke tilbake etter en inndragning,
  får familiene som hadde hjelperen, beskjed. Vi lar det ikke skje i stillhet.
- **Vi teller aldri ned.** Ingen «du er 2 oppdrag unna nivå 3»-mekanikk, ingen
  varsler som presser en hjelper til å ta oppdrag for å beholde noe. Merket skal
  ikke kunne tapes av utmattelse.

### 3.5 Merket i markedsføring

- Merket sier «denne personen er kontrollert». Det sier aldri «dette selskapet er
  til å stole på». Vi setter det derfor aldri i en overskrift om oss selv.
- Merket kan vises i markedsføring **kun** sammen med en ekte, samtykkende hjelper,
  med navn og kontrolldato. Aldri som et løsrevet symbol i en annonse.
- Antall verifiserte hjelpere er ikke et markedsføringstall. Andel oppdrag utført av
  verifiserte hjelpere er 100 % per definisjon, og å skryte av det ville vært å
  skryte av å følge egne regler.

---

## 4. Tone of voice

Grunnholdningen står i `.claude/agents/brand.md`: rolig, ikke rørt. Konkret, ikke
svulstig. Vi lover det vi kan holde. Vi snakker til den eldre som en voksen.

### 4.1 Tre prøver før en tekst sendes

1. **Kan mottakeren gjøre noe med dette?** Hvis ikke, hvorfor sender vi det?
2. **Står det et klokkeslett, et tall eller et navn der det burde?** «Snart»,
   «litt forsinket» og «så snart som mulig» er ikke opplysninger.
3. **Ville du sagt dette høyt til en 84-åring i hennes egen stue?** Hvis setningen
   blir flau når den sies i rommet, er den feil på skjermen også.

### 4.2 Åtte par fra faktiske situasjoner i tjenesten

**1. Varsel om oppmøte (til pårørende)**

- ✅ «Sofia kom til Maria kl. 14:02. Oppdrag: handling. Beregnet slutt 15:30.»
- ❌ «Gode nyheter! 🎉 Sofia er hos Maria nå – nå kan du slappe av.»

Varselet er en observasjon, ikke en følelse. Vi forteller ikke mottakeren hvordan
hun skal ha det, og vi feirer ikke at noen kom på jobb i tide.

**2. Avvist søknad (til hjelper)**

- ✅ «Vi kan ikke godkjenne søknaden din nå. Referansen du oppga, er nær familie, og
  vi bruker bare referanser utenfor familien. Legger du inn en ny referanse, ser vi
  på søknaden igjen. Du får svar innen 3 virkedager.»
- ❌ «Dessverre passer ikke profilen din inn hos oss akkurat nå. Vi ønsker deg lykke
  til videre!»

Et avslag uten grunn er et avslag personen ikke kan gjøre noe med. Vi sier hva som
mangler, om døra er åpen, og når hun hører fra oss. «Passer ikke inn» er dessuten
usant: det er ett konkret krav som ikke er oppfylt.

**3. Prisendring (til pårørende og eldre)**

- ✅ «Serviceavgiften vår øker fra 18 % til 20 % fra 1. oktober. For et oppdrag på to
  timer betyr det 12 kroner mer – 116 kroner i stedet for 104. Hjelperens andel endres
  ikke. Du ser hele prisen før du bestiller, som før.»
- ❌ «Vi har oppdatert prismodellen vår for å kunne fortsette å levere en enda bedre
  tjeneste til deg.»

En prisendring skal kunne regnes etter: gammelt tall, nytt tall, dato, et eksempel,
og hva som *ikke* endres. Å skjule en økning bak «bedre tjeneste» er den eneste
setningen i hele dokumentet som alene kan koste oss et kundeforhold.

**4. Sikkerhetssak (til den som meldte fra)**

- ✅ «Vi mottok meldingen din kl. 09:14. Kontoen er fryst, og hjelperen får ingen nye
  oppdrag. En person i driftsteamet ringer deg innen 15 minutter. Er dette en
  nødsituasjon, ring 113.»
- ❌ «Takk for tilbakemeldingen! Vi tar alle henvendelser om sikkerhet svært alvorlig
  og vil se på saken så snart som mulig.»

«Så snart som mulig» er ikke en frist, og «takk for tilbakemeldingen» gjør en
sikkerhetssak til et skjema. Vi sier hva som allerede *er* gjort, når et menneske
ringer, og hva som gjelder hvis det haster mer enn oss. Vi lover heller ingen
konklusjon i første melding.

**5. Tomt oppdragsfeed (til hjelper)**

- ✅ «Ingen oppdrag akkurat nå innenfor 5 km. Vi varsler deg så snart det kommer noe
  som passer profilen din.»
- ❌ «Oi, her var det tomt! 😴 Prøv å utvide søkeområdet ditt, så finner du sikkert
  flere oppdrag!»

Tomt er ikke hjelperens feil, og skal ikke løses med utropstegn eller en oppfordring
om å strekke seg lenger for vår skyld. Vi sier hva som er tomt og innenfor hvilke
grenser, og at vi gjør jobben med å si fra.

**6. Kvittering (til pårørende)**

- ✅ «Maria har fått hjelpen hun trengte. Sofia · 14:02–15:41 · 1 t 39 min. Notat:
  «Handlingen er gjort og varene er satt på plass.» Totalt 417 kr.»
- ❌ «Takk for at du bruker oss! Vi håper Maria fikk en fin dag ☀️ Del gjerne
  opplevelsen din med andre pårørende!»

Kvitteringen er dokumentasjon, ikke en salgskanal. Vi ber aldri om en anbefaling i
samme melding som vi tar betalt. Samme hendelse til den eldre er kortere, men like
sann: *«Oppdraget er ferdig. Takk, Sofia.»*

**7. Uteblitt innsjekk (til pårørende)**

- ✅ «Lena har ikke sjekket inn hos Maria. Avtalt tid var 14:30, klokka er nå 14:42.
  Vi ringer Lena nå og gir deg beskjed innen 15 minutter. Vil du ringe Maria selv,
  finner du nummeret her.»
- ❌ Ingenting – vi venter til det løser seg. Eller: «Oppdraget er litt forsinket.»

Stillhet er det dyreste vi kan sende en pårørende som bor fire timer unna. «Litt
forsinket» er ikke et klokkeslett. Vi sier hva vi vet, hva vi gjør, når vi kommer
tilbake, og hva mottakeren selv kan gjøre i mellomtiden.

**8. Oppdrag som ikke vises for hjelperen (avvisning i matchingen)**

- ✅ «Dette oppdraget krever tillitsnivå 2. Du er på nivå 1. Nivå 2 åpnes etter 10
  fullførte oppdrag uten avvik.»
- ❌ «Dette oppdraget er ikke tilgjengelig for deg.»

En hjelper som stenges ute, skal få et svar, ikke oppleve at det er stille. Vi sier
regelen, hvor hun står, og hva som skal til. Det er også forklarbarhetskravet vårt
i praksis.

### 4.3 Ord vi bruker og unngår

| Bruk | Unngå | Fordi |
|---|---|---|
| hjelper | pleier, omsorgsarbeider | Beskriver en yrkesgruppe vi ikke er |
| oppdrag | jobb, gig | «Gig» gjør arbeidet tilfeldig |
| den eldre, brukeren, fornavn | pasient, klient, pleietrengende, «de gamle» | Ingen av dem er en diagnose |
| pårørende | kunde (når vi snakker til dem) | De er ikke i en butikk |
| verifisert | godkjent, sertifisert | Vi kontrollerer, vi utsteder ikke |
| kontrollert 14.03.2026 | nylig kontrollert | En dato er en dato |
| «Det har jeg ikke lov til å ta imot» | «Nei takk, det går bra» | Hjelperens standardsvar på tilbud om kort, PIN eller BankID skal være en regel, ikke en høflighet |

Vi bruker «du» til alle fire brukergrupper. Vi bruker aldri «vi» om «du» («nå skal
vi ta medisinen vår»). Vi bruker aldri diminutiver om mennesker.

---

## 5. Visuell identitet

### 5.1 Dommen over dagens palett

Paletten er god, og hovedgrepet skal beholdes. Vurderingen per farge:

| Token | Verdi | Dom |
|---|---|---|
| `--brand` | `#1f6f5c` | **Behold.** Rolig, voksen, hverken sykehusblå eller vellykkethetsgrønn. 6,0:1 mot hvitt – godkjent for tekst (AA), og god nok som knappeflate med hvit tekst |
| `--brand-dark` | `#175446` | **Behold, og bruk mer.** 8,8:1 mot hvitt, altså AAA. Dette er tekst- og lenkefargen. `--brand` er flatefarge |
| `--bg-sand` | `#fbf6ee` | **Behold.** Sanden er det som hindrer at tjenesten ser klinisk ut, og den er Senior Modes grunn |
| `--accent` | `#c8752a` | **Behold, men begrens.** Oransje brukes til pris og sum – penger, ikke advarsel. Aldri på merket, aldri på knapper |
| `--danger` | `#a32f24` | **Behold.** |
| `--ok` | `#1f7a4d` | **Endres.** Ligger for nær `--brand` (#1f6f5c). Familien kan ikke se forskjell på «dette er merkevaren» og «dette gikk bra». Statusgrønn skal enten flyttes tydelig bort i tone, eller kun brukes som tekst og ikon – aldri som fylt flate ved siden av en merkegrønn flate |

**Det som mangler i paletten:**

- **En egen grunn for høy kontrast.** Alt er lyst i dag. En pårørende som får et
  varsel klokka 23, og en eldre med begynnende grå stær, trenger et alternativ som
  er mer enn en mørk modus av mote: rent svart på hvitt, eller hvitt på nesten
  svart, med samme struktur. Dette er en tilgjengelighetsfunksjon, ikke et tema.
- **Et definert forhold mellom merkegrønn og merket.** I dag er verifiseringsmerket
  og «Bli hjelper»-knappen samme grønnfarge. Merket skal skilles ut med **form**
  (kontrollseglet), ikke med en femte grønn. Formen er billigere å beskytte enn
  fargen, og fungerer i svart-hvitt.

### 5.2 Dommen over typografien

Inter beholdes. Den har høy x-høyde, tydelige bokstavformer i små størrelser,
variabel vekt, og full dekning for svensk, tysk og spansk (ä ö ü ß ñ á é í ó ú ¿ ¡).
Én skriftfamilie i hele tjenesten er riktig; vi legger ikke til en nummer to.

**Det som mangler:**

- **Tabulærsiffer der tall betyr noe.** Priser, klokkeslett, varighet og den
  firesifrede oppmøtekoden skal settes med `font-variant-numeric: tabular-nums`.
  I dag hopper tallene når prislinjene oppdateres, og en kolonne med beløp står ikke
  rett. Det ser lite ut, men prislister som rykker, ser uryddige ut – og pris er der
  vi har minst råd til å se uryddige ut.
- **Entydige tegn i koder.** Oppmøtekoden leses høyt av en 84-åring over telefon.
  Inter har en stilistisk variant som skiller 1, l og I tydeligere; den skal brukes
  på koder og referansenumre.
- **Kortere linjelengde.** `.narrow` er 760 px ved 17 px grunnskrift – rundt 90 tegn
  per linje. For målgruppen bør brødtekst ligge på 62–72 tegn. Ikke en ny palett,
  bare en smalere tekstkolonne.
- **Riktig `lang` per marked.** `hyphens: auto` virker bare når språket er satt
  riktig. Tysk har lengre sammensetninger enn norsk (`Alltagsbegleitung`,
  `Nachbarschaftshilfe`); uten korrekt `lang` sprenger de smale skjermer på nøyaktig
  samme måte som «Helsepersonellregisteret» ville gjort uten dagens regel.
- **En vekt-regel.** I dag brukes 400/500/600/700 om hverandre. Fest det: 400 brødtekst,
  600 knapper og etiketter, 700 overskrifter. Ingen 500 i produksjon.

### 5.3 Logo og ikoner: den største visuelle mangelen

Logomerket er i dag emojien 🧭, både i toppen og i favikonet. Det betyr at merket
vårt tegnes av Apple, Google og Microsoft, ulikt på hver enhet, og at det ikke kan
beskyttes. Kompasset peker dessuten mot «pilot» – betydningen vi går bort fra.

Samme problem gjelder oppdragsikonene (🛒 🏥 💻 ❄️ ☕). De bærer mening i
bestillingsflyten, på skjermen til den brukeren som har minst toleranse for
tvetydighet. Enkelte Android-versjoner gjengir dem i en strek som forsvinner ved
høy lysstyrke.

**Anbefaling:** ett tegnet ikonsett, samme strektykkelse, samme optiske størrelse,
laget for 24 px og for 48 px i Senior Mode. Regel som gjelder fra i dag, uavhengig
av når settet foreligger: **et ikon må aldri bære mening som ikke også står i tekst.**

### 5.4 Bilderegler (før noen kjøper det første bildet)

Vi har ingen fotografier i dag. Regelen skrives nå, mens den er gratis:

- Aldri en ung hånd som holder en rynket hånd. Aldri et ensomt ansikt i et vindu.
  Aldri kunstig lys som skal se «varmt» ut.
- Mennesker vises i handling, ikke i følelse: noen bærer en pose, noen viser fram et
  nettbrett, noen går ut av en port.
- Den eldre er aldri passiv i bildet, og aldri det minste elementet i det.
- Ingen bilder av den eldre alene med et medisinsk objekt.
- Ekte lys, ekte leiligheter, ekte vær. Norsk, svensk, tysk og spansk grå novemberdag
  er tillatt. Det er sannere enn sommersolen.
- Bilder av hjelpere brukes bare med hjelperens eget, skriftlige samtykke, og aldri
  med den eldres navn.

### 5.5 Bevegelse

Rolig er også et tempo. Overganger under 200 ms, ingen sprett, ingen konfetti, ingen
feiring av at et oppdrag er utført. `prefers-reduced-motion` respekteres overalt –
det gjøres allerede i Senior Mode, og skal gjelde alle sider. Merket animeres aldri.

### 5.6 Senior Mode og de kundevendte sidene

Dette er det mest misforståtte punktet i hele identiteten, så det formuleres som en
regel før det formuleres som en beskrivelse:

> **Senior Mode er ikke en nedskalert utgave av produktet. Det er designsystemets
> strengeste tilfelle. Alt som ikke kan gjøres i Senior Mode, bør vi spørre om vi
> trenger noe sted.**

De henger sammen fordi de er laget av **samme materialer**, ikke fordi den ene er
den andre i større skrift.

**Det som er felles, og aldri skal avvike:**

- Samme skriftfamilie, samme farger, samme merke, samme ord, samme sannhet.
- Samme radiusfamilie (12/16/18 px), skalert med flaten, ikke omtegnet.
- Sanden er felles grunn. Den kundevendte forsiden går fra sand til hvitt i toppen;
  Senior Mode blir stående i sanden. Det er den samme fargen som gjør to jobber.

**Det som er forskjellig, og som er selve grunnen til at det ikke ser nedskalert ut:**

| | Kundevendte sider | Senior Mode |
|---|---|---|
| Struktur tegnes med | Luft og skygge. 1 px linjer, myke skygger | Strek. 2–3 px kanter, tydelige rammer |
| Grunn | Hvitt, med sand i toppen | Sand, med hvite paneler oppå |
| Oppgave per skjerm | Oversikt: flere spor samtidig | Én beslutning om gangen |
| Hierarki uttrykkes med | Kontrast og plassering | Størrelse og rekkefølge |
| Grunnskrift | 17 px | 21 px |
| Minste trykkflate | Vanlig knappehøyde | 96 px |

Merk hva forskjellen faktisk er: den kundevendte flaten er **bygget av luft**, Senior
Mode er **bygget av strek**. Det er to måter å tegne den samme strukturen på, og de
er likeverdige. En nedskalert versjon ville brukt de samme virkemidlene, bare færre
av dem. Vi bruker andre virkemidler, med samme presisjon.

**Fire regler som holder dem likeverdige over tid:**

1. **Ingen informasjon finnes i én modus og mangler i den andre.** Ulik mengde,
   aldri ulik sannhet. Prisen står i begge. Hjelperens navn står i begge. Merket og
   kontrolldatoen står i begge.
2. **Ingen dekorasjon på de kundevendte sidene som ikke kan bæres i Senior Mode.**
   Legger vi til et element som bare fungerer i tett layout, har vi laget to
   produkter.
3. **Aldri «eldrelook».** Ingen ekstra beige, ingen tegneseriefigurer, ingen ekstra
   store, runde former som skal signalisere vennlighet. Store trykkflater fordi
   fingre er upresise, ikke fordi brukeren er det.
4. **Senior Mode har ingen egen logo, ingen egen farge og intet eget navn i
   grensesnittet.** Det er ett produkt. Bryteren mellom modusene er en innstilling,
   ikke en inngang til et annet sted.

---

## 6. Merkevareregler: det vi aldri gjør

Listen er absolutt. Den som mener at et unntak er nødvendig, tar det til
merkevareansvarlig før noe publiseres – ikke etterpå.

**Om det vi lover**

1. Vi lover aldri trygghet. Ingen «100 %», «helt trygt», «garantert», «alltid».
2. Vi kaller aldri tjenesten helsehjelp, pleie, omsorg, vård, Pflege eller cuidados.
3. Vi sier aldri «politiattest på alle hjelpere». Vi krever attest kun der loven gir
   hjemmel, og vi sier hvor det gjelder.
4. Vi sier aldri «sertifisert» eller «godkjent» om et menneske.
5. Vi presenterer aldri oss selv som et alternativ til 113 eller 112.

**Om markedsføring**

6. Vi bruker aldri frykt. Ingen «før det er for sent», ingen fallstatistikk som
   virkemiddel, ingen ensomhetstall i en annonse.
7. Vi bruker aldri skyld mot pårørende. «Når så du mor sist?» skrives ikke, verken
   som overskrift, e-postemne eller push.
8. Vi bruker aldri knapphet som salgsteknikk. Ingen «kun 2 hjelpere igjen i ditt
   område», ingen nedtelling.
9. Vi bruker aldri den eldres navn, stemme eller bilde i markedsføring – heller ikke
   når en pårørende sier ja. Samtykket må komme fra henne selv, og vi ber ikke om det.
10. Vi publiserer aldri kundehistorier der en helsetilstand kan gjenkjennes.
11. Vi bruker aldri posisjonsdata til markedsføring, og kobler aldri annonsemåling til
    posisjon. Dette står allerede i samtykketeksten, og skal fortsette å være sant.
12. Vi bruker aldri antall hjelpere eller antall oppdrag som hovedtall utad. Vi bruker
    andelen oppdrag utført av en hjelper familien har hatt før.
13. Vi ber aldri om en anmeldelse i samme melding som vi tar betalt.

**Om merket**

14. Merket settes aldri på selskapet, en partner, en kommune, en kampanje eller en
    annonse uten en navngitt hjelper og en kontrolldato.
15. Merket vises aldri uten nivå og dato.
16. Merket vises aldri i samme lås som en stjernevurdering.
17. Merket blir aldri gjenopprettet i stillhet etter en inndragning.

**Om produktet**

18. Vi gamifiserer aldri hjelperne. Ingen streaks, ingen ledertavler, ingen merker som
    kan tapes ved å ta fri.
19. Vi sender aldri et varsel som skaper uro uten å gi en handling og et tidspunkt.
20. Vi snakker aldri om den eldre i tredjeperson i hennes eget grensesnitt.
21. Vi A/B-tester aldri sikkerhetstekster, nødflyt eller samtykketekster.
22. Vi skjuler aldri et avvik fordi det ser dårlig ut. En oversittet frist vises i
    driftskonsollen, også når den er vår feil.
23. Vi lanserer aldri i et nytt marked på oversatt norsk tekst. Hvert marked får tekst
    skrevet i markedet, med lokale ord og lokale nødnumre.
24. Vi lar aldri en merkevarehensyn overstyre en driftsbeslutning eller en
    personvernregel. Går de i mot hverandre, taper merkevaren.

---

## 7. Åpne spørsmål

Disse er ikke avgjort her, og skal ikke behandles som avgjort:

1. **Selve paraplynavnet.** Struktur og krav er låst (kapittel 2), navnet krever
   uttaletest og varemerkegransking i fire markeder. Eier: merkevare, sammen med
   juridisk rådgiver. Estimat: 3–4 måneder.
2. **Seglets endelige tegning.** Formprinsippet er låst (sirkel, hake, åpen ring),
   den ferdige filen er ikke laget. Eier: merkevare.
3. **Hvilken statusgrønn `--ok` skal bli.** Krever en kontrastsjekk mot alle
   grunnflater. Eier: merkevare sammen med teknologi. Ingen CSS er endret i dette
   dokumentet.
4. **Erstatning for «Care Circle»** i fire språk. Eier: merkevare sammen med copy.
5. **Høykontrastvarianten.** Skal den være en tredje modus, eller en innstilling som
   virker i begge eksisterende? Eier: tjenestedesign.

---

## Merket i produktet – vedtatt

Ordmerket er **NAVIAR** i geometrisk sans, med **CARE** sperret under høyre
halvdel. Marineblå. Ingen payoff i låsingen.

### Hvorfor blekket ble byttet

Fargen `--ink` er nå logoens marineblå `#101a2e`, ikke den grønnsvarte
`#14231f`. Det er ikke en tilpasning til logoen – det **er** logoen, og det er
forskjellen på en identitet og en dekorasjon. Et merke som ligger oppå siden i
en annen farge enn siden, leses som et klistremerke.

Byttet kostet ingenting: kontrasten mot hvitt gikk fra 16,3:1 til **17,4:1**.

### Fargene, og hva hver av dem er til

| Token | Verdi | Brukes til | Kontrast |
|---|---|---|---|
| `--ink` | `#101a2e` | All tekst, mørke flater, merkeflaten | 17,4:1 på hvitt |
| `--ink-soft` | `#4a5568` | Ingress, sekundærtekst | 7,5:1 |
| `--ink-faint` | `#657084` | Hjelpetekst, metadata | 5,0:1 på hvitt, 4,6:1 på sand |
| `--brand` | `#1f6f5c` | Handling på lys flate | 6,0:1 på hvitt |
| `--brand-pa-mork` | `#4cb99b` | Handling på mørk flate | 7,2:1 på blekket |
| `--bg-sand` | `#fbf6ee` | Varm flate | – |

**`--brand-pa-mork` finnes fordi grønnfargen gir 2,9:1 mot marineblått.** En
grønn knapp i en marineblå topp er uleselig. Det er ikke et smaksspørsmål, og
derfor er det to grønner og ikke én.

Sanden er beholdt med vilje. Marineblå alene blir kald, og siden leses også av
eldre mennesker og familiene deres. Den varme flaten er motvekten.

### Merket ved små størrelser

Ordmerket bruker hårstreker som forsvinner under ca. 40 px. Derfor finnes et
eget merke – varden fra A-en, tegnet som fylte flater – i
`assets/img/naviar-mark.svg`.

| Flate | Hva som brukes |
|---|---|
| Favicon, appikon | Merket, hvitt på marineblå flate med runde hjørner |
| Topp på siden | Samme flate, 34 px |
| E-post til familien | Samme flate. Dette er den flaten merket oftest sees på |
| Presentasjon, nettsted over 40 px | Fullt ordmerke |

Favicon har egen flate og ikke gjennomsiktig bakgrunn. Marineblå på en mørk
fanelinje er usynlig; en flate virker uansett hva nettleseren har bak seg.

### Det som mangler

**Vektorfilen til ordmerket.** Den finnes ikke i repoet – merket er levert som
raster. Legges den inn som `assets/img/naviar-care-logo.svg`, er den eneste
endringen som trengs å bytte `.logo-mark`-flaten mot en `<img>` i toppen på de
fjorten sidene.

Ordmerket er ikke tegnet på nytt for hånd, og skal ikke bli det. En logotype som
er 95 % riktig er verre enn en raster, fordi den sprer seg overalt og feilen
følger med.

### Payoff

«Clarity in complex systems» er **Naviars** payoff, ikke Naviar Cares.
Kjøperen driver et selskap med tolv ansatte og setter opp vaktlista selv. Hun
har ikke komplekse systemer; hun har familier som ringer og spør om mor fikk
besøk. Produktets egen setning står allerede på landingssiden:

> Ett besøk. Én bekreftelse. Alle vet det.

Den sier hva produktet gjør. Ingen payoff i låsingen betyr at hver flate kan
velge den setningen som hører hjemme der – og det er riktig, ikke uferdig.
