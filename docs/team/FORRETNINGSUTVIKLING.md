# Forretningsvurdering – Naviar Care

Eier: forretningsutvikling. Skrevet som en vurdering av konseptet, ikke som en plan
for å selge det. Tallene er regnet, ikke anslått, og kildene står under hver.

Konklusjonen først: **produktet er bygget riktig, men priset og posisjonert som
noe mindre enn det er.** Det er ikke et lite problem. Det er det som avgjør om
dette blir en bedrift eller et verktøy.

---

## 1. Hva som faktisk selges, og til hvem

Naviar Care selger til en liten privat tjenesteleverandør – et selskap med
kanskje 5–25 ansatte som utfører praktiske besøk hjemme hos eldre. Produktet
lar dem planlegge besøket, sende medarbeideren en lenke, registrere at det ble
utført, og varsle familien automatisk på familiens eget språk.

Tre roller, tre helt forskjellige former for smerte:

| Rolle | Smerten | Hvem betaler |
|---|---|---|
| Familien | Vet ikke om mor fikk besøk i dag | Betaler ikke (bevisst valg) |
| Koordinatoren | Ringer rundt, svarer på «kom hun?» | Bestemmer ikke budsjett |
| Eieren | Familier ringer og hun vet ikke svaret | **Betaler** |

Dette er den viktigste linjen i hele dokumentet: **den som kjenner smerten mest,
betaler ikke, og den som betaler kjenner den svakest.** Eierens smerte er ekte,
men den er en irritasjon – ikke en budsjettpost. Og en irritasjon betaler man
499 kroner for.

Prisen på 499 er derfor ikke en tabbe i seg selv. Den er et symptom på hvilken
smerte vi har valgt å løse.

---

## 2. Regnestykket som ikke går opp

Med 499 kr/mnd er årsverdien per kunde 5 988 kr.

| Mål | Antall betalende leverandører |
|---|---|
| 1 mill. kr ARR | 168 |
| 5 mill. kr ARR | 836 |
| 10 mill. kr ARR | 1 671 |
| 50 mill. kr ARR | 8 351 |

En fullt belastet selger koster rundt 850 000 kr i året. For bare å dekke seg
selv må hun lande **142 kunder i året – en signering hver halvannen arbeidsdag,
hele året.**

Det er ikke et ambisiøst mål. Det er et umulig mål for et kjøp som krever demo,
betenkningstid og en beslutning hos en eier som også kjører vaktlister. Det
finnes bare to måter å selge for 499 kroner: selvbetjening, eller gründeren
selv. Små norske omsorgsleverandører kjøper ikke programvare selvbetjent. Og
gründersalg stopper rundt 80–120 kunder, altså rundt 700 000 kr ARR.

**Prisen og salgsmåten er uforenlige.** Det er ikke to problemer, det er ett.

Enhetsøkonomien i seg selv er ikke katastrofal:

| Månedlig churn | Levetid | LTV (70 % bruttomargin) | LTV/CAC ved CAC 3 000 |
|---|---|---|---|
| 2 % | 50 mnd | 17 465 kr | 5,8× |
| 3,5 % | 29 mnd | 9 980 kr | 3,3× |
| 5 % | 20 mnd | 6 986 kr | 2,3× |

Ved lav churn er dette et fint forholdstall. Problemet er ikke lønnsomheten per
kunde. Problemet er at **du ikke får råd til noen som kan skaffe kunden.**

---

## 3. Markedet finnes, men den delen vi sikter på er tynn

Kommunene kjøpte sykehjems- og hjemmetjenester fra private for **14,8 milliarder
kroner i 2022**. Kommersielle aktører utgjør omtrent 5 % av markedet og ideelle
5,7 % – til sammen i overkant av en tiendedel.

Det er et reelt marked. Men det er konsentrert. Hovedvekten ligger hos noen få
store konsern som har sine egne systemer, egne IT-avdelinger og allerede har
løst besøksdokumentasjon. De kjøper ikke av oss.

Restene – den lange halen av små leverandører – er nettopp den gruppen som er
underbetjent, fordi de er for små for de store fagsystemene. Det er en ekte
kile. Den er bare smalere enn den ser ut.

**Tallet som må skaffes i uke 1:** hvor mange norske selskaper med 5–50 ansatte
leverer praktisk bistand til eldre. Ikke et anslag – et uttrekk fra
Brønnøysund på NACE-kodene for hjemmetjenester, filtrert på ansattall. Det tallet
avgjør om Norge er et marked eller bare en testbenk. Er svaret under 600, er
Norge alene ikke en forretning uansett hvor godt produktet er.

---

## 4. Er dette en funksjon eller en bedrift?

Ærlig svar på det som er bygget i dag: **besøksbekreftelse alene er en funksjon.**
En konkurrent kan bygge planlegging, engangslenke og familievarsel på seks uker.
Det er ikke et forsvarsverk.

Men det er ikke det eneste som er bygget. Dette er også i koden, og det tar ikke
seks uker:

- **Sletteplanen som krymper besøket i fire trinn** og som kjører ved hver
  lesning, ikke som en nattjobb.
- **Sperren som stopper helseopplysninger, fødselsnummer og bankdata før lagring**
  – og som ved fallmelding peker på riktig kanal i stedet for bare å avvise.
- **Grensen mellom hva en KI-agent kan gjøre alene, hva som krever godkjenning,
  og hva som ikke finnes som funksjon** – med en beslutningslogg på sju
  obligatoriske felter.
- **Familiemeldingen på 18 språk**, der bare de faste delene oversettes og
  medarbeiderens frie tekst aldri maskinoversettes.
- **Den juridiske grensen som beslutning**, med hjemmel per frist.

Dette er ikke overhead. **Dette er produktet, og vi behandler det som
dokumentasjon.** I en sektor der Statsforvalteren fører tilsyn og
dokumentasjonssvikt er det klassiske funnet, er «bevis hva som skjedde, med
sletting som tåler Datatilsynet» en budsjettpost. «Familien slipper å lure» er
det ikke.

---

## 5. Den strategiske feilen, i én setning

Vi selger trygghet til familien, men fakturerer leverandøren.

Alt annet følger av det. Prisen er lav fordi kjøperen ikke føler smerten.
Salgsmotoren finnes ikke fordi prisen er lav. Og det sterkeste vi har bygget –
etterlevelsesarkitekturen – står i fotnotene, fordi den ikke passer inn i
«familien slipper å lure».

---

## 6. Tre veier, med tall

### A. Priser per medarbeider i stedet for per selskap

Ti medarbeidere × 149 kr = 1 490 kr/mnd. ACV 17 880. Da trengs **560 kunder for
10 mill. ARR i stedet for 1 671**, og en selger må lande 48 kunder i året i
stedet for 142 – én i uken. Det er et mulig tall.

Prisen vokser også med kunden, uten ny forhandling.

### B. Selg etterlevelse, ikke trygghet

Samme produkt, annen forside: dokumentasjon som holder i tilsyn, sletting som
tåler Datatilsynet, KI med dokumentert menneskelig kontroll. Pris 2 500 kr/mnd,
ACV 30 000, **334 kunder for 10 mill.**

Dette krever ingen ny kode. Alt som skal til, er allerede bygget. Det krever ny
tekst og en annen samtale.

### C. Kommune

357 kommuner. ACV 96 000 ved 8 000 kr/mnd gir **105 kunder for 10 mill.** Men
salgssyklusen er 6–18 måneder, det krever anskaffelsesprosess, og en oppstart
uten referanser vinner ikke. Ikke nå. Om to år, med tjue leverandører som
referanse, er det den naturlige oppgangen.

**Anbefaling: A og B sammen.** Per medarbeider, posisjonert som etterlevelse.
Ikke C ennå.

---

## 7. Det jeg ville gjort med 90 dager

1. **Uke 1:** Brønnøysund-uttrekket. Hvor mange finnes egentlig.
2. **Uke 1–2:** Ring tjue leverandører. Ikke demo – ett spørsmål: *hva var siste
   tilsyn eller klage, og hva manglet dere da?* Svarene avgjør om B holder.
3. **Uke 3–6:** Ti betalende piloter til 1 490 kr, ikke gratis. En gratis pilot
   måler ingenting. Betaling er den eneste ærlige målingen av verdi.
4. **Uke 7–12:** Mål én ting: hvor mange besøk registreres per leverandør per
   uke etter uke fire. Faller det, er produktet ikke i drift hos dem, og alt
   annet er støy.

Stopp-punkt, skrevet ned på forhånd: **er færre enn seks av ti fortsatt aktive i
uke tolv, er ikke problemet salget. Da er det produktet.**

---

## 8. Det som er reelt sterkt

For balansens skyld, fordi resten av dokumentet er kritisk:

- Grensedragningen er uvanlig disiplinert. De fleste i denne sektoren lover alt
  og oppdager grensen når et tilsyn finner den.
- Flerspråkligheten er ekte bygget, ikke påklistret, og den samme
  etterlevelsesutfordringen finnes i Sverige, Danmark, Nederland og Tyskland.
  Det er der oppsiden ligger, ikke i Norge alene.
- 120 tester, ingen avhengigheter, ingen byggesteg. Det er en billig bedrift å
  drive mens man leter etter modellen. Det er verdt mer enn det ser ut.

---

## 9. Det som må ryddes

**Gjort.** `OKONOMI.md` og `SALG.md` priset fortsatt markedsplassen: 18 % provisjon,
verifiseringskjede, vaktordning 24/7. Under B2B bæres de kostnadene av leverandøren,
ikke av oss, og det fantes derfor ikke noe gjeldende regnskap for produktet vi selger.

Begge er skrevet om for B2B. De gamle ligger i `docs/arkiv/` med en boks som sier
hva de er. Det som kom ut av å faktisk regne:

- Dekningsbidraget er **94,3 %**, ikke 15,25 %. Vi sluttet å bære kostnaden ved å
  garantere for mennesker – ID-kontroll, referanser, kurs, forsikring og vakt
  døgnet rundt ligger nå hos leverandøren, som er arbeidsgiver.
- Break-even falt fra **2 843 besøk i måneden** – rundt 1 140 aktive familier – til
  **75 betalende leverandører**. Fra noe som krever et marked, til noe som krever
  en kundeliste.
- Ved 499 kr/mnd er break-even 253 kunder. Ved 1 490 er den 75. Det er den samme
  observasjonen som i punkt 2, sett fra kostnadssiden.
- Bare to ting flytter tallet: **prisen og churn.** 94 % margin betyr at det ikke
  finnes kostnader å kutte seg ut av et for lavt prispunkt.

---

## Kilder

- Kommunale kjøp fra private, 14,8 mrd. kr (2022), og andelene 5 % / 5,7 %:
  Agenda Kaupang for Helsedirektoratet, kartlegging av kjøp av pleie- og
  omsorgstjenester.
- Antall aktive hjemmetjenestevirksomheter (3 600, i hovedsak kommunale): SSB.
- Egne satser: `docs/arkiv/OKONOMI-markedsplass.md` (fullt belastet time 435 kr).
- Gjeldende kostnadsbase og break-even: `docs/team/OKONOMI.md`.
- Priser: `assets/js/besok-abonnement.js` (pilot 990 engangs, standard 499/mnd).
