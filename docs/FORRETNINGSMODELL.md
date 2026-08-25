# Forretningsmodellen — vurdering av markedsplass-blueprinten

Skrevet august 2026, etter at eieren la fram en fullstendig
markedsplass-blueprint («PårørendePilot / Nærhjelp — Master Service Blueprint
v1.0» med hjelperregistrering, matching-motor, GPS-dispatch, forhåndsbetaling
og provisjonsmodell) og ba om at den utvikles som forretningsmodell.

Dette dokumentet gjør tre ting: fastslår hva i blueprinten som er verifisert
riktig, navngir det ene punktet som bærer hele modellvalget, og deler
blueprinten i det som kan bygges nå, det som venter på én beslutning, og det
som ikke bygges uansett.

---

## 1 · Markedet er reelt — tallene stemmer

Blueprintens markedstall er kontrollert mot kilden og stemmer:

- 99 millioner mennesker i EU var 65 år eller eldre 1. januar 2025 — 22 % av
  befolkningen, opp fra 17 % i 2005 (Eurostat, *Population structure and
  ageing*).
- Andelen 80+ er om lag 6 % og vokser raskest.

Behovet blueprinten beskriver — eldre som vil bo hjemme, familie i en annen
by, praktisk og sosial hjelp som ikke er helsehjelp — er det samme behovet
produktet allerede er bygget rundt. Ingen uenighet der.

## 2 · Punktet som bærer alt: hvem er arbeidsgiver?

Blueprinten beskriver en plattform som **velger person** (dispatch-bølger,
«Best Match»), **setter pris** (prismotor, provisjon), **styrer utførelsen**
(sjekkliste, check-in/out, tidtaker) og **disiplinerer** (Trust Score,
account freeze). Det er de fire kjennetegnene som til sammen utgjør ledelse
og kontroll i arbeidsrettslig forstand.

Tre rettskilder gjør dette til et nå-problem, ikke et symptom på forsiktighet:

1. **Arbeidsmiljøloven § 1-8** fikk fra 1. januar 2024 en presumpsjonsregel:
   arbeidstakerforhold legges til grunn med mindre oppdragsgiveren gjør det
   **overveiende sannsynlig** at det foreligger et selvstendig oppdrag.
   Bevisbyrden ligger altså på plattformen, i Norge, i dag.
2. **Wolt-saken** om budenes status er anket til Høyesterett.
   Lagmannsretten la vekt på budenes reelle autonomi — men et bud kan avslå
   hvert oppdrag uten konsekvens. En hjelper hvis Trust Score faller ved
   avslag og kanselleringer, har ikke den autonomien.
3. **Plattformarbeidsdirektivet (EU) 2024/2831** innfører samme presumpsjon
   på EU-nivå, med gjennomføringsfrist 2. desember 2026 — tre måneder etter
   at dette skrives. Enhver europeisk ekspansjon møter det fra dag én, med
   krav om innsyn i algoritmisk styring og menneskelig overprøving.

`docs/JURIDISK-GRENSE.md` beslutning 1 sier det samme med én setning: *«En
plattform som velger person, setter pris og styrer utførelsen, argumenterer
mot seg selv.»* Blueprinten er den setningen, utbygd til 25 kapitler.

Dette er ikke et argument mot behovet eller mot tjenestedesignet. Det er et
argument om **hvem som må stå som arbeidsgiver for hjelperen**.

## 3 · Tre lovlige måter å skaffe menneskene på

| | A · Leverandør-B2B *(dagens modell)* | B · Egenregi | C · Åpen markedsplass *(blueprinten)* |
|---|---|---|---|
| Hvem ansetter hjelperen | Lokal tjenesteleverandør | Naviar selv | Ingen — selvstendige oppdragstakere |
| Naviars rolle | Programvare (databehandler) | Arbeidsgiver og tjenesteyter | Formidler og prissetter |
| Arbeidsrettslig risiko | Lav — klassifiseringen er leverandørens | Lav — ansettelse er valgt, ikke omgått | Høy — § 1-8-presumpsjonen står imot modellen |
| Kostnadsnivå per time | Leverandørens lønnskost | Lønn + arbeidsgiveravgift (14,1 %) + feriepenger (10,2–12 %) + pensjon ≈ 30–40 % over «gig»-utbetaling | Lavest på papiret — til reklassifisering skjer, da med etterbetaling (jf. Høyesteretts prinsipper for etteroppgjør) |
| Skalering | Selge til flere leverandører | Bemanne by for by | Rask — og risikoen skalerer like raskt |
| Hva av blueprinten som overlever | Alt unntatt åpen registrering og plattformsatt pris | **Alt.** Matching, dispatch, Trust, pris — en arbeidsgiver kan styre sine ansatte akkurat slik | Alt — til presumpsjonen prøves |

Det avgjørende å forstå om **modell B**: alt blueprinten vil ha — appen,
GPS-dispatchen, «Jeg er tilgjengelig nå», Trust-nivåene, plattformsatt pris —
er **lovlig og uproblematisk når personene er ansatte**. Styringen som feller
modell C er selve definisjonen av et arbeidsforhold i modell B. Prisen er
30–40 % høyere timekost og at Naviar bærer arbeidsgiveransvaret. Det er den
ærlige regningen for blueprinten slik den står.

Modellene kan også kombineres: B i pilotbyen (kontroll over kvalitet og
erfaring), A for skalering (leverandører får verktøyet). Det er samme
kombinasjon som dagens produkt pluss en første leverandør som eies selv.

## 4 · Den modellnøytrale kjernen — bygges uansett

Det viktigste funnet i gjennomgangen: **det meste av blueprinten er uavhengig
av modellvalget.** Flyten «behov → oppgave → pris → person → varsling →
check-in → utført → bekreftet → betalt» er identisk enten hjelperen er ansatt
hos en leverandør, hos Naviar eller er selvstendig. Og deler av den er
allerede bygget:

| Blueprint-modul | Status i produktet |
|---|---|
| Check-in/check-out med tidsavgrenset lenke | **Finnes** — besøksbekreftelsen er dette |
| Signaturvarselet («Mamma har fått hjelpen hun trengte») | **Finnes** — ordrett samme idé i varslingen |
| Risikonivåer grønn/oransje/rød, rød aldri i katalogen | **Finnes** — PP_VERN + tolv beslutninger |
| Minimum data, adresse skjult til aksept | **Finnes** — datamodellen har ikke feltene |
| Nød utenom markedsplassen → 113 | **Finnes** — akuttregelen |
| Oppgavelivssyklus (13 tilstander) | Delvis — utfall og status finnes, tilstandsmaskinen kan formaliseres |
| Care Circle / fast hjelper først | Ny — men er «fast medarbeider»-kontinuitet, passer alle modeller |
| Tre hastighetsnivåer (nå / i dag / planlagt) | Ny — ren produktlogikk |
| Senior-modus (én stor knapp, tale, store flater) | Ny — og tilgjengelighetskravene ligger alt i testene |
| Familie-dashboard med rolige statuser | Ny — forlengelse av dagens varsling |
| Service recovery (erstatter uten prispåslag) | Ny — operasjonsregel, modellnøytral |
| Gjentakende sosiale besøk med samme person | Ny — kalender + kontinuitet |
| KPI-settet, inkl. «Hours of Family Burden Removed» | Ny — måling, modellnøytral |

Alt i høyre kolonne merket «Ny» kan tegnes, testes og bygges nå uten at
modellspørsmålet er avgjort. Skjermene fra de tre flow-dokumentene
(hjelperregistrering 1–14, kundeflyt 1–17, dashboardene) gjenbrukes i både
A, B og C — det eneste som endres er *hvem som legger inn hjelperen* og *hvem
som setter prisen*.

## 5 · Det som ikke bygges uansett modell

Blueprinten respekterer selv de fleste av grensene — det skal den ha ros for.
Fire ting står fast fra `docs/JURIDISK-GRENSE.md`, uansett modellvalg:

- **Ingen helsehjelp.** Blueprintens røde kategori sier det samme. Merk at
  «hareketsstøtte» og «hastane-eşlik» i oransje kategori ligger tett på
  grensen — de må defineres som *følge*, aldri som *stell*.
- **Ingen penger, PIN, BankID.** Blueprinten legger selv BankID i rødt. Riktig.
- **Ingen løpende posisjonssporing.** Blueprintens GPS-design (oppgave-scopet,
  av når økten er slutt, by/postnummer som alternativ) er i tråd med grensen.
  Formuleringen «helper'ı izlemek değil, görevi gerçekleştirmek» kan stå som
  regel.
- **Ingen automatiske avgjørelser med store følger.** Account freeze,
  suspensjon og avslag skal gjennom menneske — blueprinten sier dette selv,
  og PWD art. 10 kommer til å kreve det.

To ting i blueprinten må justeres:

- «AI intake» som klassifiserer nødssituasjoner: akuttfilteret skal være
  **regler, ikke modell** — en modell som bommer én gang på «far ligger på
  gulvet», er én gang for mye. Dagens akuttregel beholdes.
- Forhåndsbetaling/escrow: å holde kundens penger og splitte utbetaling er
  betalingsformidling. Det bygges aldri selv; det kjøpes fra en lisensiert
  leverandør (jf. `docs/BETALING.md`), og først etter at modellvalget er tatt.

## 6 · Anbefaling

1. **Bygg den modellnøytrale kjernen nå** — rekkefølgen fra blueprinten er
   god: senior-modus og «be om hjelp»-flyten først (de gjenbruker mest av det
   som finnes), deretter familie-dashboardet, deretter kontinuitet/Care
   Circle.
2. **Ta modellbeslutningen som en eierbeslutning, skriftlig.** Alternativene
   er A, B eller A+B. C slik blueprinten står — selvstendige hjelpere styrt
   av plattformen — anbefales ikke, og begrunnelsen står i kapittel 2. Vil
   eieren likevel ha C, er dette dokumentet stedet å skrive inn hvem som har
   vurdert §1-8-risikoen og akseptert den.
3. **Ikke lanser noen modell i EU-land etter 2. desember 2026 uten
   PWD-gjennomgang.** Direktivkravene om algoritmeinnsyn og menneskelig
   overprøving er produktkrav, ikke jusfotnoter.

Matching-motoren, dispatch-bølgene og prisalgoritmen — modulen eieren ba om
som neste — designes slik at *hvem som er i bassenget* er et
konfigurasjonsspørsmål: leverandørens ansatte (A), egne ansatte (B) eller
begge. Da er ikke motoren bundet til modellvalget, og ingenting av arbeidet
kastes uansett utfall.

**Eierbeslutning tatt 25.08.2026:** A+B som langsiktig retning, men v1.0
bygges på modell A alene – B krever at forbrukerkontrakt- og GDPR-rolle-
spørsmålene løses først. Den operative planen står i
`docs/FORRETNINGSMODELL-V1.md`.

## Kilder

- Eurostat, *Population structure and ageing* (uttrekk februar 2026)
- Arbeidsmiljøloven § 1-8 med presumpsjonsregel fra 1.1.2024 (KS, Wiersholm,
  Juristforbundet omtaler)
- Direktiv (EU) 2024/2831 om plattformarbeid, art. 5 og 10, frist 2.12.2026
- Wolt-saken, anket til Høyesterett (Advokatbladet)
- Deloitte om Høyesteretts prinsipper for etteroppgjør ved feilklassifisering
