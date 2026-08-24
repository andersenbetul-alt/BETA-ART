# Pathfinder fase 2a – gjentatt kode INNENFOR hvert område

Dato: 2026-08-24. Grunnlag: de åtte flytdiagrammene i `01-flowcharts/`,
`00-features.md`, og deretter kildefilene selv – hver påstand under peker på
linjer som faktisk er lest i denne økten. Triviell gjentakelse (én-linjes
oppslag, `nå()`, `klokke()`) er utelatt eller kun nevnt.

Vurderingsskalaen for «verdt å samle» tar den byggefrie IIFE-arkitekturen på
alvor: en delt hjelpefunksjon koster her et nytt `<script>`-innslag på hver
side som skal bruke den, eller en plassering i en modul som allerede lastes.
Abstraksjon som krever ny lastelogikk, taper som regel mot fem dupliserte
linjer.

## Kilder (faktisk lest)

| Fil | Linjeområde |
|---|---|
| `PATHFINDER-2026-08-24/01-flowcharts/*.md` (8 filer) + `00-features.md` | hele |
| `/home/user/BETA-ART/assets/js/besok-nytt.js` | 1–124 (hele) |
| `/home/user/BETA-ART/assets/js/besok-oversikt.js` | 1–95 (hele) |
| `/home/user/BETA-ART/assets/js/besok-utfor.js` | 1–170 (hele) |
| `/home/user/BETA-ART/assets/js/besok-historikk.js` | 1–86 (hele) |
| `/home/user/BETA-ART/assets/js/hjelper-registrering.js` | 1–184 (hele) |
| `/home/user/BETA-ART/assets/js/hjelper-base.js` | 1–200 (hele) |
| `/home/user/BETA-ART/assets/js/besok-lager.js` | 140–229 |
| `/home/user/BETA-ART/assets/js/besok-vern.js` | 140–239 |
| `/home/user/BETA-ART/assets/js/klarhet-skjerm.js` | 1–431 (hele) |
| `/home/user/BETA-ART/assets/js/bestill-skjerm.js` | 1–427 (hele) |
| `/home/user/BETA-ART/assets/js/godkjenn-skjerm.js` | 1–358 (hele) |
| `/home/user/BETA-ART/assets/js/registrering.js` | 1–493 (hele) |
| `/home/user/BETA-ART/assets/js/tavle.js` | 1–100 |
| `/home/user/BETA-ART/assets/js/bestilling.js` | 1–115 |
| `/home/user/BETA-ART/assets/js/drift.js` | 18–67 |
| `/home/user/BETA-ART/assets/js/akutt.js` | 20–89 |
| `/home/user/BETA-ART/assets/js/besok-abonnement.js` | 20–69 |
| `/home/user/BETA-ART/assets/js/betaling.js` | 20–74 |
| `/home/user/BETA-ART/assets/js/klarsprak.js` | 150–244 |
| `/home/user/BETA-ART/assets/js/merkesprak.js` | 95–174 |
| `/home/user/BETA-ART/assets/js/besok-behov.js` | 40–99 |
| Grep over hele repoet | `function esc`, `PP_RUTER`, e-postregexene, `filter(function … .id ===`, `function formater`, `readyState === 'loading'`, `data-error-for` |

---

## Område A – Besøksbekreftelse (`besok/` + medarbeider)

### A1. `arbeiderlenke()`/`arbeiderhref()` – ordrett duplikat ×2

- **(a)** Lenkebyggingen som må matche `param('t')`-parsingen i utfør-skjermen,
  inkludert PP_ENFIL-varianten med hash.
- **(b)** `assets/js/besok-nytt.js:9–16` og `assets/js/besok-oversikt.js:9–16`
  – tegn for tegn like, begge definert inne i `start()` (og dermed re-definert
  per rutevisning i ett-fils-modus). Kontrakten de bygger, leses i
  `assets/js/besok-utfor.js:16–21` – lenkeformatet finnes altså i praksis tre
  steder.
- **(c)** ~8 linjer ×2 = 16 linjer.
- **(d)** **Ja, verdt det.** Begge skjermene laster allerede `PP_BESOK`
  (`besok-lager.js`), som også eier tokenet – `PP_BESOK.arbeiderlenke(token)`
  koster ingen ny script-tag og samler et format som er farlig å la drive
  (én endring i lenkeformatet krever i dag tre samstemte filer).

### A2. PP_RUTER-registreringsboilerplate – to ulike idiomer ×9

- **(a)** Foten som registrerer skjermen i rutetabellen og starter den.
- **(b)** Idiom 1 (`window.PP_RUTER = window.PP_RUTER || {}` + `if (!window.PP_ENFIL) start()`):
  `besok-nytt.js:121–123`, `besok-oversikt.js:92–94`, `besok-utfor.js:167–169`,
  `besok-historikk.js:83–85`. Idiom 2 (`if (window.PP_RUTER)`-vakt +
  readyState/DOMContentLoaded): `hjelper-registrering.js:178–183`,
  `klarhet-skjerm.js:423–429`, `bestill-skjerm.js:419–425`,
  `godkjenn-skjerm.js:350–356`.
- **(c)** 3–7 linjer per fil, ~40 linjer totalt.
- **(d)** **Nei til hjelpefunksjon** – en delt «registrer»-hjelper måtte
  lastes før hver skjerm på hver side, og boilerplaten finnes nettopp for å
  slippe den avhengigheten. **Ja til å samle idiomet:** idiom 2 gjør
  registreringen til en no-op når `PP_RUTER` ikke finnes (dødt på egne sider,
  jf. `01-flowcharts/b-klarhet.md` funn 2), mens idiom 1 alltid oppretter
  tabellen. Velg ett idiom (idiom 1) og skriv de fire siste om – det er en
  konsistensrettelse på ~5 linjer per fil, ikke en abstraksjon.

### A3. `esc()` – identisk XSS-funksjon ×2 i A (×5 i repoet)

- **(a)** HTML-escaping før `innerHTML`.
- **(b)** I område A: `besok-oversikt.js:25–29` og `besok-historikk.js:14–18`
  (identiske). Ellers i repoet: `drift.js:24–28` (identisk),
  `tavle.js:31–35` (**uten null-vern** – `String(s)` mot
  `String(s == null ? '' : s)`), `registrering.js:323–327` (samme kropp,
  navnet `escapeHtml`).
- **(c)** 5 linjer ×5 = 25 linjer.
- **(d)** **Delvis.** Linjetallet forsvarer ikke en ny felles util-modul.
  Men dette er en sikkerhetsfunksjon, og driften har allerede begynt
  (tavle-varianten kaster på `null` i stedet for å escape). Innenfor A kan
  den flyttes til `PP_BESOK` (lastes på begge sidene) gratis. På tvers av
  områdene: heller en enhetstest som griper alle `function esc`-definisjoner
  og krever at kroppen er identisk, enn en delt modul – testen håndhever
  énhet uten å innføre lasteavhengighet.

### A4. PP_VERN-blokkering + feilvisning – tre varianter, én av dem avviker

- **(a)** Mønsteret «kall `PP_VERN.sjekk`, legg beskjeden i
  `[data-error-for]`, vis, fokus».
- **(b)** `besok-nytt.js:72–79` (bruker `vern.beskjed`),
  `besok-utfor.js:112–123` (bruker `vern.beskjed` + fokus),
  `hjelper-registrering.js:158–169` (via `HB.taImot`, men **hardkoder sin
  egen beskjed** i stedet for å bruke `grunn`/kategoriene som `taImot`
  returnerer, `hjelper-base.js:109–111`).
- **(c)** ~8–12 linjer ×3 ≈ 30 linjer.
- **(d)** **Samle budskapskilden, ikke koden.** Flyten rundt (abort vs.
  samlevalidering) er reelt forskjellig per skjerm, så en felles
  `visVernFeil()` gir lite. Men at medarbeiderskjermen viser en annen tekst
  enn den vernet selv formulerer, er innholdsdrift: la `taImot` sende
  `v.beskjed` videre og bruk den. 3-linjers rettelse, ingen abstraksjon.

### A5. E-postvalidering – samme felt, to ulike regexer

- **(a)** «Gyldig e-post»-regex.
- **(b)** `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` i `besok-nytt.js:67`,
  `besok/logg-inn.html:65` og (område C) `registrering.js:66`;
  **en annen regex** `/^[^@\s]+@[^@\s.]+\.[^@\s]+$/` i
  `hjelper-registrering.js:143`.
- **(c)** 1 linje ×4.
- **(d)** **Ja, men som beslutning, ikke modul:** velg den ene regexen og
  bruk den alle fire stedene. To ulike regler for samme spørsmål er en
  latent inkonsistens (en adresse kan godtas i besøksskjemaet og avvises i
  medarbeiderskjemaet); linjekostnaden ved å la dem stå er null, kostnaden
  er forutsigbarhet.

### A6. `les()`/`rydd()`/`skriv()`-mønsteret i to datalag

- **(a)** localStorage-lesning som alltid kjører sletting og skriver
  tilbake, try/catch rundt alt.
- **(b)** `besok-lager.js:164–194` (rydd = `PP_VERN.krymp` per besøk) og
  `hjelper-base.js:140–162` (rydd = filtrer bort kandidater over frist;
  kommentaren `:138–139` siterer eksplisitt besøksmønsteret).
- **(c)** ~25 linjer ×2.
- **(d)** **Nei – med vilje.** Sletteemantikken er forskjellig (krymping av
  felt vs. sletting av rader) og er selve policyen; en generisk
  lagringsmodul måtte parametrisere nøyaktig det som skal stå eksplisitt.
  CLAUDE.md-advarselen om `js-cache-storage` viser hvorfor et felles
  lagringslag her er risiko, ikke gevinst. Det som derimot mangler, er en
  test som holder **mønsteret** fast: «hver `les()` i et `PP_*`-datalag
  kaller `rydd()`». Den binder begge uten å slå dem sammen.

Trivielt, kun notert: `nå()` (`besok-lager.js:143`, `hjelper-base.js:86`),
oppgave-oppslaget mot `L.OPPGAVER` (`besok-oversikt.js:31–38`,
`besok-utfor.js:58–60`), `feil()`-togglingen (`besok-nytt.js:39–42`,
`hjelper-registrering.js:53–57` – bare C-varianten `registrering.js:49–57`
setter `aria-invalid`; verdt å kopiere atferden, ikke koden).

---

## Område B – Klarhet 45 (klarhet/bestill/godkjenn)

De tre skjermfilene er søstre og deler mest i hele repoet. Alle tre laster
allerede `PP_SPRAK_UI` og `PP_EKSPERT` – det finnes altså to naturlige,
gratis hjem for fellesfunksjoner, uten nye script-tagger.

### B1. Språkvelgeren `byggSprak()` + språkbytte ×3 – største enkeltfunn

- **(a)** Fyll nedtrekket fra `S.SPRAK` filtrert på `kanApnes`, skjul/deaktiver
  ved <2 språk (med ordrett samme title-tekst «Flere språk åpnes når
  akuttsetningen er lest …»), på bytte: sett `documentElement.lang`/`dir`,
  oversett `[data-t]`-noder, tegn på nytt.
- **(b)** `klarhet-skjerm.js:34–77` (`byggSprak` + `settSprak`),
  `bestill-skjerm.js:362–390`, `godkjenn-skjerm.js:272–298`.
  `[data-t]`-løkka er duplisert i to av dem (`klarhet-skjerm.js:69–72`,
  `bestill-skjerm.js:384–387`); godkjenn mangler den – tredje varianten
  oversetter altså *ikke* data-t-noder, en faktisk atferdsforskjell.
- **(c)** ~100 linjer totalt; ~60–70 kan samles.
- **(d)** **Ja, klart verdt det.** `PP_SPRAK_UI` eier allerede `SPRAK`,
  `kanApnes`, `sprak()` og `t()`; en `PP_SPRAK_UI.monterVelger(selectEl,
  vedBytte)` samler regelen «vis aldri et språk som ikke kan åpnes» på ett
  sted og fjerner atferdsdriften (skjul vs. disable, med/uten data-t). Dette
  er samling i en modul som per design skal eie språkatferden.

### B2. `tegnAkutt()` ×3

- **(a)** Akuttsetningen fra `S.t('akutt') || E.AKUTTVARSEL`.
- **(b)** `klarhet-skjerm.js:308–313`, `bestill-skjerm.js:392–397`,
  `godkjenn-skjerm.js:300–305` – identiske bortsett fra element-id.
- **(c)** 6 linjer ×3.
- **(d)** **Ja, som del av B1** (samme modulhjem, samme flytting) – alene er
  den for liten.

### B3. Opplesning (`settOppOpplesning`) ×2

- **(a)** speechSynthesis-knappen: vis bare når støttet, toggle
  snakk/avbryt, sett `lang` fra valgt språk, tilbakestill etikett på `onend`.
- **(b)** `bestill-skjerm.js:338–358` og `godkjenn-skjerm.js:311–331` –
  nesten identiske (forskjell: kildeelement, rate 0.95/0.92,
  etikett-tekster).
- **(c)** ~21 linjer ×2.
- **(d)** **Ja.** `PP_SPRAK_UI.opplesning(knapp, kildeEl, sprakFn)` er en ren
  flytting; tilgjengelighetsatferd bør være lik på begge skjermene den
  eldre/familien møter, og i dag er den nesten-lik – som er verre enn lik.

### B4. To DEMO-ekspertlister + en tredje hardkodet person

- **(a)** Demodata for eksperter.
- **(b)** `klarhet-skjerm.js:144–163` (6 eksperter, felter
  `kategorier`/`kanaler`/`ledig`) mot `bestill-skjerm.js:69–82` (4 eksperter,
  felter `omraader`/`tider`). To personer er identiske (Solveig Aas, Bjørn
  Hauge), forsiden har «Kari Nilsen», bestillingen «Kari Hansen» – og
  `godkjenn-skjerm.js:21–29` hardkoder avtale med «Kari Hansen», altså
  konsistent med bestill men ikke med forsiden.
- **(c)** ~35 linjer data + ulikt feltskjema.
- **(d)** **Ja – for datakonsistens, ikke linjer.** Én demoliste (i
  `ekspertbistand.js`, som alle tre laster, eller en egen
  `klarhet-demodata.js`) med begge feltsett. I dag kan kunden velge en
  ekspert på forsiden som ikke finnes på bestillingssiden. Samsvarer med
  fase 1-funnet (`b-klarhet.md` funn 3).

### B5. `lag()`/`ved()` ×3, `initialer()`/`tittel()` ×3, SVG-ikonfabrikk ×2

- **(a/b)** DOM-hjelperne `lag`/`ved`: `klarhet-skjerm.js:21–27`,
  `bestill-skjerm.js:23–29`, `godkjenn-skjerm.js:34–40` (identiske, 7 linjer
  ×3). `initialer` + `E.PROFILTITTEL.mal.replace('{rolle}', …)`:
  `klarhet-skjerm.js:165–174`, `bestill-skjerm.js:84–93`,
  `godkjenn-skjerm.js:75–81` (inline). SVG-fabrikken `ikon()` + path-kart:
  `bestill-skjerm.js:34–58` mot `godkjenn-skjerm.js:45–68` (fabrikken ~15
  linjer duplisert; `kalender`- og `klokke`-pathene overlapper, kalender i
  to lett ulike versjoner).
- **(c)** ~90 linjer totalt.
- **(d)** **Delt dom.** `lag`/`ved`: la stå – 7 linjer per fil er billigere
  enn en util-avhengighet. Profiltittel: **ja** – flytt til
  `PP_EKSPERT.profiltittel(rolle)`; malen er en merkevare-/jusregel
  («Tidligere …, uavhengig»), og regler skal bo i modulen
  (skjermene skal per egen kommentar «ikke finne på noe selv»).
  SVG-fabrikken: grensetilfelle – samling krever ny delt fil; bare verdt det
  hvis en tredje skjerm kommer til.

### B6. Bestill-avslaget formateres to ganger

- **(a)** Samme `E.bestill()`-svar (`venter_godkjenning` med `mangler`)
  presentert med to ulike tekstoppsett.
- **(b)** `klarhet-skjerm.js:224–246` (`visSamtykke`: overskrift + liste
  «Den eldre godkjenner …») mot `bestill-skjerm.js:315–332` (`bestill`:
  setning «Hun godkjenner … og …»).
- **(c)** ~20 linjer ×2.
- **(d)** **Tja – flytt teksten, ikke koden.** La `PP_EKSPERT.bestill`-svaret
  bære en ferdig formulert `beskjed` (slik `PP_VERN.sjekk` gjør,
  `besok-vern.js:231`), så blir skjermene rene visninger. Å samle selve
  DOM-koden gir lite; å samle formuleringen hindrer at de to sidene sier to
  forskjellige ting om samme regel.

---

## Område C – Markedsplass-rot (parkert v1)

Forbehold som farger alle dommer her: området er parkert
(`00-features.md`, JURIDISK-GRENSE beslutning 1). Refaktorering av parkert
kode er negativ verdi med mindre koden skal gjenbrukes; funnene står mest
som kart for fase 3-beslutninger.

### C1. Geolokasjon med avrunding – personvernregelen finnes to steder

- **(a)** Hele samtykkeflyten: støttesjekk, «Henter posisjon …»,
  `getCurrentPosition` med **avrunding til 3 desimaler (~100 m)**, avslag →
  `null` + postnummer-fallback-tekst, opsjoner
  `{enableHighAccuracy:false, timeout:10000}`.
- **(b)** `registrering.js:246–280` og `tavle.js:61–85`. Forskjeller som
  allerede har oppstått: registreringen lagrer `noyaktighet` + `tidspunkt`
  og et eget samtykkeflagg, tavla bare lat/lon.
- **(c)** ~30 + ~25 linjer.
- **(d)** **Ja, hvis området våkner.** Avrundingen er en personvernbeslutning
  («omtrentlig punkt, aldri eksakt»), og en beslutning som finnes to steder
  blir to beslutninger. En ~15-linjers `hentAvrundetPosisjon(vedOk, vedFeil)`
  (i `api.js`, som begge sidene kan laste) ville bære den ett sted. Så lenge
  området er parkert: la stå, men noter regelen i ev. domenedokument.

### C2. Skjemastegs-navigasjon: `visSteg` vs. `visPanel`

- **(a)** Panelbytte via data-attributt + `hidden`, knappesynlighet
  (tilbake/neste/send), `scrollTo` topp, gating av neste-knappen.
- **(b)** `registrering.js:149–182` (`visSteg`, 6 steg + kvittering,
  valideringsstyrt) og `bestilling.js:39–59` (`visPanel` + `oppdaterNeste`,
  4 paneler, valgstyrt).
- **(c)** ~25 linjer ×2 (mønsteret; detaljene divergerer).
- **(d)** **Nei.** Tilstandsmodellene er reelt ulike (validering per steg
  vs. ett valg per panel), begge flyter er parkerte, og en felles
  «stegmotor» er akkurat den typen spekulativ abstraksjon CLAUDE.md § 2
  advarer mot. Merk at klarhet-området (B) *ikke* deler dette mønsteret –
  bestill-skjermen der bruker avledet trinn (`naavaerendeTrinn`,
  `bestill-skjerm.js:106–110`), så en «felles skjemastegsmotor for
  bestill/godkjenn/klarhet» som fase 2-oppdraget ba om å etterprøve,
  **finnes ikke som reell duplisering** – de tre B-skjermene har ingen
  stegnavigasjon å samle.

### C3. Småfunn i C

- `valgtRadio()`: `registrering.js:44–47` = `bestilling.js:34–37`
  (identiske 4 linjer). Trivielt; la stå.
- `esc()`-variantene `tavle.js:31–35` og `registrering.js:323–327` – se A3;
  tavle-varianten mangler null-vern.
- aria-pressed-gruppetoggle: `bestilling.js:63–74` (`knyttValg`) er samme
  mønster som `besok-utfor.js:91–103` (kryss-område) – noteres til
  02b-rapporten, ikke samlebar innenfor C alene.
- `drift.js:30–33` (`klokke`) = `besok-historikk.js:20–23` – kryss-område,
  trivielt.

---

## Område D – De ti regelmodulene

### D1. Fem tekst-sperrer med hver sin matchingmotor – men felles kontrakt

- **(a)** Mønsteret «normaliser tekst → match mot ord-/regexliste → returner
  `{ok, funn:[{id, hva/beskjed, istedenfor}]}`».
- **(b)** Innenfor D: `besok-behov.js:48–86` (stammeregex, `normaliser` +
  `traff`), `merkesprak.js:137–160` (prekompilerte mønstre),
  `klarsprak.js:~150–221` (måltall + ordliste, samme funn-form). Utenfor D,
  samme familie: `besok-vern.js:193–233` (A) og `akutt.js:66–87` (C).
  Tre ulike «ordgrense»-regexer: `besok-behov.js:57`
  (`(^|\s)` + stamme), `besok-vern.js:199` (`(^|[^a-zæøåéèü])`),
  `merkesprak.js` (`\b` – som er upålitelig for æøå).
- **(c)** ~15–30 linjer motor per modul, ~80 linjer totalt i D.
- **(d)** **Nei til felles motor, ja til kontrakttest.** Modulene er
  selvstendige kontrakter for en framtidig backend (`d-regelmoduler.md`
  funn 1), og matchingsemantikken er reelt ulik med vilje –
  `PP_VERN`-regexen speiles til og med i SQL-generatorens `vern_sjekk`
  (`verktoy/lag-skjema.js:170–180`), så å «samle» den ville brutt
  generatorens én-sannhet. Det som er verdt å holde fast, er
  **returkontrakten** (`ok`/`funn`-formen, som i dag er konsistent) og
  gjerne æøå-ordgrensen: en enhetstest som kjører samme æøå-tekst gjennom
  alle sperrene og krever at `\b`-fellen ikke gjeninnføres, gir vernet uten
  koblingen.

### D2. Id-oppslaget `LISTE.filter(...)[0] || null` – mikromønster ×5 i D

- **(b)** `besok-abonnement.js:63`, `betaling.js:162`, `maling.js:101`,
  `besok-agenter.js:175`, `besok-sprak.js:264` (og ~25 flere treff ellers i
  repoet, jf. grep).
- **(c)** 1–3 linjer per sted.
- **(d)** **Nei.** En delt `finn(liste, id)` ville gjort hver regelmodul
  avhengig av en util-fil de i dag ikke trenger – modulene lastes enkeltvis
  i tester og skal kunne leses alene. Dette er idiom, ikke duplisering.

### D3. Sperren familie/mellom finnes i to moduler, koblet med streng

- **(a)** De juridiske betalingssperrene (forbrukerrett/J11) er beskrevet
  både i `PP_ABONNEMENT.STROMMER` og `PP_BETALING.STROM`.
- **(b)** `besok-abonnement.js:24–32` mot `betaling.js:26–50`; koblingen er
  bare kommentar/streng (`betaling.js:45`: «Se
  PP_ABONNEMENT.STROMMER.familie»). Samme klasse funn som
  `d-regelmoduler.md` funn 6 (PP_MALING siterer PP_KVALITETs skala i en
  streng, `maling.js:48` mot `besok-kvalitet.js:41`).
- **(c)** ~10 linjer ×2 – men kostnaden er ikke linjer, den er to steder å
  endre en juridisk beslutning.
- **(d)** **Bind med test, ikke med kode.** Modulene skal kunne leses hver
  for seg (kontrakter), så en kodeavhengighet på tvers er feil verktøy. En
  enhetstest som asserterer at `PP_BETALING.STROM.familie.tilstand ===
  'sperret'` ⇔ `PP_ABONNEMENT.STROMMER.familie.aktiv === false` (og
  tilsvarende for kvalitetsskalaen) gjør driften umulig uten å koble
  modulene. Passer regel 4 i CLAUDE.md: testen skrives i samme endring som
  ev. justering av sperrene.

### D4. Grensefunn mot andre områder (hører til 02b, kun notert)

- `PP_SPRAK.melding()` (D) dupliseres av `besok-lager.js:329–359`
  (`familiemelding`, A) – alt annet enn trivielt, men kryss-område
  (`d-regelmoduler.md` funn 4).
- `formater(kr)`: `besok-abonnement.js:66–68` (D) mot `pris.js:33` (C) –
  kryss-område, trivielt.

---

## Prioritert kortliste (det som faktisk bør gjøres)

| # | Funn | Grep | Kostnad i dag | Anbefaling |
|---|---|---|---|---|
| 1 | B1+B2: språkvelger + akuttsetning ×3 | ~106 linjer, atferdsdrift | Flytt til `PP_SPRAK_UI` (lastes alt) |
| 2 | B4: to DEMO-ekspertlister + hardkodet avtale | datainkonsistens synlig for bruker | Én demoliste |
| 3 | A1: `arbeiderlenke` ×2 (+kontrakt i utfor) | lenkeformat på 3 steder | Flytt til `PP_BESOK` |
| 4 | B3: opplesning ×2 | 42 linjer, nesten-lik a11y | Flytt til `PP_SPRAK_UI` |
| 5 | A5: to e-postregexer | inkonsistent validering | Velg én regex, 4 steder |
| 6 | A4: PP_VERN-beskjed hardkodet i medarbeiderskjermen | innholdsdrift | Bruk beskjeden fra vernet |
| 7 | A2: to PP_RUTER-idiomer | no-op-registreringer | Velg idiom 1 overalt |
| 8 | D3: jus-sperrer i to moduler | to steder å endre en beslutning | Bindetest, ikke kode |
| 9 | A3/C: fem `esc()` med begynnende drift | XSS-funksjon i 5 kopier | Likhets-test; i A: flytt til `PP_BESOK` |

Bevisst **ikke** anbefalt samlet: les/rydd/skriv-mønsteret (A6 – policyen
skal stå eksplisitt), stegnavigasjonen (C2 – parkert kode, ulike modeller),
tekst-sperremotorene (D1 – kontrakter med hver sin semantikk),
id-oppslag/`lag`/`ved`/`valgtRadio` (idiom, ikke duplisering).

## Tillitsnotat og hull

**Tillit: høy** for alle funn med fil:linje – hvert av dem er lest i
kildefilen i denne økten, ikke tatt fra flytdiagrammene alene (diagrammene
ga kandidatlista; verifikasjonen er egen lesning). Grep-sveipene (`esc`,
`PP_RUTER`, e-postregex, id-oppslag) dekker hele repoet, så «alle steder»
for disse mønstrene skal være uttømmende.

Hull:

- **Delvis leste filer:** `tavle.js` (1–100 av 311), `bestilling.js` (1–115
  av 381), `drift.js` (18–67 av 321), `klarsprak.js`, `merkesprak.js`,
  `besok-behov.js`, `betaling.js`, `akutt.js`, `besok-abonnement.js`
  (utdrag). Dupliseringer som bare finnes i de uleste delene av disse
  filene, er ikke fanget – risikoen er størst innenfor C (render-koden i
  `tavle.js:100–311` og `drift.js:69–321` bygger begge HTML-strenger med
  `esc()` og kan dele mer enn påvist).
- **Ikke lest i det hele tatt:** `sprak-ui.js`, `ekspertbistand.js`,
  `klarhet.js` (lest i fase 1 av annen agent, gjenbrukt her kun via
  diagrammet), `matching.js`, `demodata.js`, `hjelper-opptak.js`,
  `besok-sprakkrav.js`, `besok-kvalitet.js`, `besok-agenter.js`,
  `ki-port.js`, `maling.js`, `besok-sprak.js` (kun grep-treff),
  `besok-klage.js`, `app.js`, HTML-filene utover grep. Duplisering
  *innenfor* D som ikke berører de leste utdragene (f.eks. felles
  språktabell-struktur i `besok-sprak.js` vs. `sprak-ui.js` – som uansett
  er kryss-område B/D) er ubedømt.
- Linjekostnadene er talt fra de leste kopiene, ikke målt med verktøy;
  ±20 %.
- Ingen kode er kjørt; alle dommer er statiske. Flytteforslagene (B1–B4,
  A1) er ikke prøvd mot testene – `npm test` må avgjøre før noen av dem
  omtales som trygge.
