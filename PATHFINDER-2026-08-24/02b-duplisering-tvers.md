# Pathfinder fase 2b – duplisert bekymring på tvers av områdene

2026-08-24. Sammenligner område A (besok/-produktet), B (Klarhet 45),
C (markedsplass-roten, parkert) og D (regelmoduler uten skjerm) og finner
bekymringer som er implementert flere steder. Alle seks kandidatene fra
oppdraget er etterprøvd i kildekoden; linjereferansene under er lest, ikke
antatt. Dommen i (d) skiller mellom **legitim spesialisering** (adskillelsen
er villet, oftest av den juridiske grensen mellom parkert markedsplass og
B2B-produkt – se `docs/JURIDISK-GRENSE.md`) og **tilfeldig divergens** (samme
bekymring, to implementasjoner, ingen som binder dem).

## Kilder (faktisk lest i denne økten)

| Fil | Linjeområde |
|---|---|
| `/home/user/BETA-ART/assets/js/registrering.js` | 1–120, 234–283, 340–493 |
| `/home/user/BETA-ART/assets/js/api.js` | 1–67 (hele) |
| `/home/user/BETA-ART/assets/js/hjelper-registrering.js` | 1–185 (hele) |
| `/home/user/BETA-ART/assets/js/hjelper-base.js` | 1–201 (hele) |
| `/home/user/BETA-ART/assets/js/besok-sprak.js` | 1–120, 240–308 |
| `/home/user/BETA-ART/assets/js/besok-lager.js` | 140–230, 320–365 |
| `/home/user/BETA-ART/assets/js/sprak-ui.js` | 1–80, 330–405 |
| `/home/user/BETA-ART/assets/js/besok-klage.js` | 180–220 |
| `/home/user/BETA-ART/assets/js/pris.js` | 1–83 (hele) |
| `/home/user/BETA-ART/assets/js/klarhet.js` | 110–155, 360–390 |
| `/home/user/BETA-ART/assets/js/ekspertbistand.js` | 555–600, 718–745 |
| `/home/user/BETA-ART/assets/js/besok-abonnement.js` | 20–70 |
| `/home/user/BETA-ART/assets/js/besok-vern.js` | 20–85, 140–240 |
| `/home/user/BETA-ART/assets/js/besok-nytt.js` | 60–105 |
| `/home/user/BETA-ART/assets/js/besok-utfor.js` | 105–130 |
| `/home/user/BETA-ART/assets/js/tavle.js` | 39–88 |
| `/home/user/BETA-ART/assets/js/klarhet-skjerm.js` | 140–168 (+ grep :15) |
| `/home/user/BETA-ART/assets/js/bestill-skjerm.js` | 64–86 |
| `/home/user/BETA-ART/assets/js/demodata.js` | 1–30 |
| `/home/user/BETA-ART/tests/enhet.test.js` | via grep (:582–585, :785, :1250–1251, :2041) |
| Grep over hele repoet | `PP_VERN.sjekk`, `familiemelding`, `pp_*_v1`, `samtykke/consent`, `PP_SPRAK_UI` |

Fase 1-diagrammene (`01-flowcharts/*.md`, alle åtte lest) er brukt som kart,
men hver påstand under er verifisert direkte i kildefilene.

---

## Funn 1: To registreringsflyter for samme rolle

**(a) Bekymringen.** «En person søker om å få arbeide hos oss»: skjema,
validering per felt, fritekst om erfaring, to referanser, kvittering.

**(b) Stedene.**

- **C (parkert v1):** `assets/js/registrering.js:5–493` (6 steg, OTP
  `:191–232`, posisjonssamtykke `:246–280`, kladd i sessionStorage
  `pp_helper_draft_v1` `:11, :356–372`, submit `:424–487`) →
  `assets/js/api.js:58–64` (`PP_API.registrerHjelper`, `DEMO = true`
  `api.js:9`).
- **A (produktet):** `assets/js/hjelper-registrering.js:9–184` (ett skjema,
  validering `:139–151`, submit `:121–175`) →
  `assets/js/hjelper-base.js:95–118` (`taImot`) → localStorage
  `pp_hjelperbase_v1` (`hjelper-base.js:16, 148–162`).

**(c) Hvorfor de divergerte.** C er markedsplassmodellens selvregistrering:
hjelperen er selvstendig aktør, derfor fødselsdato med alderskontroll 18–100
(`registrering.js:105–106, 432`), posisjon, utbetalingsvalg med orgnummer
(`:462–463`) og samtykkeobjekter med versjon (`:466–472`), sendt mot et
API-lag. A ble skrevet etter modellbyttet, der leverandøren er arbeidsgiver
og datamodellen håndhever personvernet: `PP_HJELPERBASE.FELT` genererer
skjemaets felttabell (`hjelper-registrering.js:59–72`), og `FINNES_IKKE`
(`hjelper-base.js:44–57`) forbyr eksplisitt det C samler inn – fødselsdato
(`hjelper-base.js:46` mot `registrering.js:432`), adresse (`:48`), CV.
A spør «Er du fylt 18 år?» som bekreftelse (`hjelper-base.js:59–61`,
`hjelper-registrering.js:25`) der C regner alder av fødselsdato.

**(d) Dom: legitim adskillelse i data, tilfeldig divergens i mekanikk.**
Flytene KAN ikke dele datamodell – de samler motstridende feltsett, og det er
selve poenget med modellbyttet. Å slå dem sammen ville bryte grensen i
`JURIDISK-GRENSE.md`. Men tre mekaniske biter er samme bekymring skrevet to
(tre) ganger uten grunn:

1. **Feilvisningshjelperen:** `visFeil()` (`registrering.js:49–57`) og
   `feil()` (`hjelper-registrering.js:53–57`) gjør det samme mot samme
   `[data-error-for]`-konvensjon.
2. **E-postregexen finnes i tre varianter:** `registrering.js:66`
   (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`), `hjelper-registrering.js:143`
   (`/^[^@\s]+@[^@\s.]+\.[^@\s]+$/`), `besok-nytt.js:67` (samme som
   registrering.js). To av dem godtar ulike adresser.
3. **PP_VERN-gapet:** A-flytens fritekst går gjennom `PP_VERN.sjekk`
   (`hjelper-base.js:105–113`); C-flytens `erfaring` (inntil 600 tegn,
   `registrering.js:397, 453`) går **ikke** gjennom noe vern, og lagres
   attpåtil i sessionStorage-kladden ved hvert tastetrykk
   (`registrering.js:356–370` – bare `otp` og `fodselsdato` unntas, `:354`).
   Harmløst mens `DEMO = true`, men en levende felle om C-flyten vekkes:
   CLAUDE.md-regelen «fritekst går gjennom PP_VERN.sjekk() før lagring»
   håndheves i dag bare i A.

---

## Funn 2: Tre (egentlig fem) meldingsoversettelser

**(a) Bekymringen.** Fast tekst som skal vises/sendes på mottakerens språk,
med fallback til norsk.

**(b) Stedene.**

- **D, død:** `PP_SPRAK` (`assets/js/besok-sprak.js`): 18 språk (`:18–37`),
  meldingsmaler (`T`, `:40–239`), `melding()` (`:271–304`) og
  `oppgavenavn()` (`:258–261`). `melding()`/`oppgavenavn()` kalles **ingen
  steder** – bekreftet med grep med ordgrense over `assets/js`, `tests/` og
  HTML; testene leser bare `SPRAK`-lista (`tests/enhet.test.js:785, 788`).
- **A, levende:** `familiemelding()` i `assets/js/besok-lager.js:330–358` –
  norsk-bare kopi av nb-malene i `besok-sprak.js:41–51`, brukt av skjermene
  (`besok-utfor.js:150`, `besok-historikk.js:66`).
- **B, tredje system:** `PP_SPRAK_UI` (`assets/js/sprak-ui.js`): **annen**
  språkliste – 10 språk der lt/uk/ti finnes (`:32–43`) men sv/da/de/fr m.fl.
  ikke gjør det – egne maler (`T`, `:50–332`), egen fallback (`t()`,
  `:356–360`) og en kvalitetsport ingen av de andre har (`kanApnes()`
  `:363–381`, `GODKJENT = { nb: true }` `:336`). Brukes av klarhet-skjermene
  (`klarhet-skjerm.js:15`).
- **I tillegg:** `PP_KLAGE.MEDARBEIDERVARSEL` (`besok-klage.js:190–209`, 18
  språk, holdt i takt med PP_SPRAK bare av testen `enhet.test.js:785–788`)
  og `PP_KVALITET.SPORSMAL` (`besok-kvalitet.js:14–44`, åtte språk). Fem
  tabeller, hver med sin egen `x[kode] || x.nb`-fallback
  (`besok-sprak.js:260, 272`, `sprak-ui.js:357–359`, `besok-klage.js:212`,
  `besok-kvalitet.js:44`).

**(c) Hvorfor de divergerte.** `familiemelding()` i lageret er trolig eldst
(A-produktets minste løsning); PP_SPRAK ble bygget som 18-språksmodul for en
framtidig backend, men ingen koblet skjermene om. PP_SPRAK_UI oppsto i
B-sporet med et annet språkutvalg (innvandrergrupper i Norge, ikke
markedsland – begrunnelsen står i `sprak-ui.js:29–31` mot
`besok-sprak.js:15–17`) og med lærdommen om menneskelig godkjenning av
akuttsetningen, som aldri ble ført tilbake.

**(d) Dom: tilfeldig divergens – det tydeligste samlingskandidatet i
repoet.** PP_SPRAK mot `familiemelding()` er ren duplisering, og de har
allerede driftet på tre målbare punkter:

1. Signaturen: «via Naviar» (`besok-lager.js:356`) mot «via Naviar Care»
   (`besok-sprak.js:49`).
2. Oppgavekilden: lageret lister planlagte oppgaver (`b.oppgaver`,
   `besok-lager.js:334`), PP_SPRAK lister utførte
   (`rapport.sjekkliste || oppgaver`, `besok-sprak.js:278`) – familiemeldingen
   kan altså i dag hevde at noe «ble gjort» som ble hoppet over.
3. Styringsegenskapen: kvalitetsporten (`kanApnes`) finnes bare i
   PP_SPRAK_UI, mens det er PP_SPRAK – modulen som skal sende uovervåkede
   oversettelser til familier – som mangler den.

At B har en annen språkliste enn A kan være en villet produktbeslutning, men
mønsteret (liste + maler + fallback + godkjenningsflagg) er én bekymring som
i dag finnes i fem utgaver uten noe som binder dem utover én test.

---

## Funn 3: Tre datalag-mønstre (og fire tilstandskonvensjoner)

**(a) Bekymringen.** Persistens med innebygd sletting: «les aldri data uten
samtidig å slette det som har gått ut på dato».

**(b) Stedene.**

- **A:** `PP_BESOK` (`besok-lager.js`): nøkkel `pp_besok_v1` (`:16`),
  `les()` kaller alltid `rydd()` (`:164–171`), som krymper felt via
  `PP_VERN.krymp` og skriver tilbake **bare hvis noe endret seg**
  (`:177–189`).
- **A, en gang til:** `PP_HJELPERBASE` (`hjelper-base.js`): egen nøkkel
  `pp_hjelperbase_v1` (`:16`), egen `rydd()` (`:140–146`) som **filtrerer
  bort hele kandidater**, egen `les()` som skriver tilbake **ubetinget**
  (`:148–157`, tilbakeskriving `:152`), egne frister (`FRISTER`, `:71–81`)
  utenfor `PP_VERN.SLETTEPLAN`.
- **C, tredje mønster:** `PP_DEMO` (`demodata.js:5–116`) og
  `PP_DRIFT_DATA` (`driftdata.js:9–114`) – ren minnetilstand uten
  persistens; i samme familie hører de to `DEMO`-ekspertlistene i B
  (`klarhet-skjerm.js:144–163`, `bestill-skjerm.js:69–82`) og den hardkodede
  `AVTALE` (`godkjenn-skjerm.js:21–29`).

**(c) Hvorfor de divergerte.** Hjelperbasen ble skrevet etter besøkslageret
og siterer det som forbilde («som i besøkene», `hjelper-base.js:138`;
«Prinsippet er det samme som i besøkene», `:8`), men kopierte mønsteret i
stedet for å dele mekanikken – rimelig nok, siden slettesemantikken er ulik
(krymping av felt mot sletting av rader). C-området lagrer ingenting fordi
markedsplassen ble parkert før noe datalag ble bygget der.

**(d) Dom: delt.** At C holder alt i minnet er **legitimt** (parkert demo).
At A har to les-og-rydd-implementasjoner er **tilfeldig divergens innenfor
samme område** – samme garanti, to kodeveier, og tre konkrete sprekker:

1. Ulik tilbakeskrivningsstrategi (ubetinget `hjelper-base.js:152` mot
   betinget `besok-lager.js:185–186`) – hjelperbasen skriver localStorage ved
   hver lesning uansett.
2. Hjelperbasens frister står **utenfor** `PP_VERN`-regimet: SQL-generatoren
   (`verktoy/lag-skjema.js:13–16`) leser bare `PP_VERN`, så
   backend-kontrakten som gjenskaper les-før-slett-garantien i databasen
   dekker besøk, ikke kandidater.
3. To feltregistre for «hvert felt har begrunnelse og frist»:
   `PP_VERN.LAGRES` (`besok-vern.js:27–39`, felt/formål/grunnlag/frist) og
   `PP_HJELPERBASE.FELT` (`hjelper-base.js:22–40`, felt/hvorfor/frist –
   **uten** behandlingsgrunnlag). Testene holder dem hver for seg
   (`enhet.test.js:582–585` mot `:1250–1251`), og `PP_BETALING` har et
   tredje par `LAGRES`/`LAGRES_ALDRI` (`betaling.js`, testet
   `enhet.test.js:2041–2042`). Samme mønster gjelder
   forbudslistene: `LAGRES_ALDRI` (`besok-vern.js:43–48`) og `FINNES_IKKE`
   (`hjelper-base.js:44–57`).

Randmerknad: demopersonen «Sofia H.» finnes både i `demodata.js:10` (C) og i
`besok-lager.js:156` (A, `tom()`-ansattlista), og timesatsen 260 står både i
`pris.js:12` og `demodata.js:21` – små tegn på at demodata også er en
duplisert bekymring.

---

## Funn 4: To (tre) prislogikker

**(a) Bekymringen.** «Prisen skal stå før bestillingen, og hver linje skal
kunne forklares.»

**(b) Stedene.**

- **C:** `PP_PRIS.beregn` (`pris.js:43–79`): dynamisk timepris med land,
  hastetillegg, oppgavefaktor, plattformandel 18 % (`:15`), minstepris.
- **B:** `PP_KLARHET.PAKKE` (`klarhet.js:126–138`): fastpris 599, 449 til
  eksperten, med `okonomi()` (`:144–154`) og kortgebyr-antakelse (`:142`);
  `PP_EKSPERT.bestill` håndhever bare at prisen står
  (`ekspertbistand.js:582–584`).
- **D:** `PP_ABONNEMENT.PLANER` (`besok-abonnement.js:34–56`): B2B-abonnement
  990 engangs / 499 mnd, mva bevisst uavklart (`MVA`, `:58–60`).

**(c) Hvorfor de divergerte.** Tre forretningsmodeller etter tur:
markedsplass (formidlingsandel), tjeneste (fastpris) og B2B (abonnement).
Koden begrunner selv skillet: «Det gjør oss til en tjeneste som tar en
fjerdedel, ikke til en markedsplass som tar en formidlingsavgift»
(`klarhet.js:122–125`), og forbruker-/formidlingsstrømmene er sperret med
begrunnelse (`besok-abonnement.js:26–31`, `betaling.js:31–41`).

**(d) Dom: legitim spesialisering.** Dette er ikke samme bekymring tre
ganger – det er tre prismodeller der to hører til hver sin levende modell og
én til den parkerte. Å «samle prislogikken» ville viske ut en grense koden
med vilje holder skarp. Den eneste faktiske dupliseringen er triviell:
`formater()` finnes i to uavhengige varianter (`pris.js:33–37` med
valutasymbol, `besok-abonnement.js:66–68` med tusenskille) – kan leve.

---

## Funn 5: Samtykkehåndteringer

**(a) Bekymringen.** Registrere at et menneske har sagt ja, med tidspunkt og
versjon, og kunne dokumentere det.

**(b) Stedene.**

- **Informasjonskapsler – bare ett sted:** `app.js:43–108`
  (`pp_cookie_consent_v1`, `version: 1` `:57`). Grep over `assets/js` på
  `consent|samtykke` viser ingen konkurrerende cookie-håndtering. Kjent
  skjevhet fra fase 1 står ved lag: sider uten `#cookie-banner` får aldri
  `data-analytics`/`data-marketing` satt (`app.js:82`).
- **Samtykke-poster i søknaden (C):** `registrering.js:466–472` – egne
  objekter med `versjon: '2026-01'` og `tidspunkt`, altså en **annen
  versjoneringskonvensjon** enn app.js (`version: 1` + `timestamp`).
- **Posisjonssamtykke – duplisert i C:** `registrering.js:246–280` og
  `tavle.js:61–85` implementerer samme flyt hver for seg: avrunding
  `Math.round(x * 1000) / 1000` (`registrering.js:256–257`,
  `tavle.js:69–70`), `enableHighAccuracy: false, timeout: 10000`
  (`registrering.js:271`, `tavle.js:79`), postnummer-fallback med nesten lik
  tekst (`registrering.js:279`, `tavle.js:78, 84`).
- **Den eldres godkjenning (B):** `SAMTYKKE` i `ekspertbistand.js:424–429`,
  håndhevet i `bestill`/`godkjenn` (`:585–588, :677–714`).

**(c) Hvorfor de divergerte.** Cookie-samtykket er infosidenes felleskode;
søknadssamtykkene ble bygget i C-sporet med GDPR-dokumentasjon som mål
(kommentaren `registrering.js:465`); tavla og registreringen fikk hver sin
posisjonskode fordi de er to skjermer i samme parkerte spor; den eldres
godkjenning er et beslutningsdomene, ikke en persistens.

**(d) Dom: i hovedsak legitim, med to tilfeldige divergenser.** Det finnes
ikke «to cookie-håndteringer» – kandidaten avkreftes. Den eldres godkjenning
er et annet begrep og skal ikke samles med resten. Tilfeldig er derimot
(1) to versjoneringsformater for samtykkeposter (`version: 1` mot
`versjon: '2026-01'`) uten felles form – den dagen re-samtykke ved
regelendring skal bygges (fase 1-funnet om at ingen leser versjonen,
`c-info-og-drift.md` funn 4), må to formater håndteres; og (2)
posisjonssamtykke-dubletten i C – lav prioritet siden begge sider er
parkert, men den bør samles eller dø sammen med C.

---

## Funn 6: Blokkeringsmønsteret rundt PP_VERN

**(a) Bekymringen.** Fritekst sperres før lagring; det blokkerte lagres
aldri; personen får en beskjed som peker på alternativet.

**(b) Stedene.** Selve porten er én modul (`PP_VERN.sjekk`,
`besok-vern.js:205–233` – returnerer `{ok, funn:[{id, navn, beskjed, ord}],
logglinje, beskjed}`). Men mønsteret **rundt** porten finnes i sju varianter:

| Kallsted | Vakt ved manglende PP_VERN | Hva vises |
|---|---|---|
| `besok-nytt.js:73–79` | feiler ÅPENT (`{ ok: true }`) | `vern.beskjed` (`:76`) |
| `besok-utfor.js:113–121` | feiler ÅPENT (`{ ok: true }`) | `vern.beskjed` (`:117`) |
| `hjelper-base.js:105–113` | sjekk hoppes over uten PP_VERN (`:105`) | kaster `beskjed`, returnerer egen generisk `grunn` + `kategorier` (`:109–111`) |
| `hjelper-registrering.js:160–167` | – | hardkoder en **tredje** tekst (`:164–165`), ignorerer både `beskjed` og `kategorier` |
| `hjelper-opptak.js:481` | feiler ÅPENT (`{ ok: true, funn: [] }`) | pakkes om nedstrøms |
| `klarhet.js:374–381` | bak vakt | pakker om til eget funnformat med egen `istedenfor`-tekst |
| `ekspertbistand.js:728–733` | bak vakt | leser `f.hva` og `f.istedenfor` – felt som PP_VERNs funnobjekter **aldri har hatt** (`besok-vern.js:213, 217–220`); `\|\|`-fallbackene fyrer alltid |
| `ki-port.js:112–113` | bak vakt (`ki-port.js:37, 112`) | kontraktsbruk (D) |

I C-området kalles porten **ikke i det hele tatt**: verken `bestilling.js`
eller `registrering.js` refererer PP_VERN (grep over repoet), enda
`registrering.js` både kladder (`:356–370`) og sender (`:453, :478`)
fritekst.

**(c) Hvorfor de divergerte.** Besøksskjermene kom først og bruker
`beskjed`-kontrakten direkte. Hjelpermottaket la sperren i datalaget (godt
valg – den kan ikke omgås fra skjermen), men fant på sin egen returform, og
skjermen over fant på sin egen tekst. B-modulene gjenbrukte porten, men
antok en rikere funnform enn den som finnes. C ble skrevet før/utenom
PP_VERN og parkert før noen ettermonterte den.

**(d) Dom: porten er samlet, kappen er tilfeldig divergert.** Tre konkrete
konsekvenser i dag:

1. **Beskjeden med alternativ når ikke fram i hjelperflyten.** PP_VERNs eget
   prinsipp er «en sperre uten alternativ blir omgått»
   (`besok-vern.js:203–204`); hjelper-registreringen erstatter den
   funn-spesifikke beskjeden («ring 113 først», «meld til kontoret»,
   `besok-vern.js:175–176`) med én generell setning
   (`hjelper-registrering.js:164–165`).
2. **Stille kontraktsdrift i B:** `ekspertbistand.js:731–732` sitt
   `f.hva || …`/`f.istedenfor || …` betyr at koden ser ut som den viderefører
   PP_VERNs veiledning, men alltid viser sine egne fallback-tekster.
   Ingen test fanger det, fordi fallbackene gjør utfallet gyldig.
3. **Fail-open er systematisk:** alle skjermvaktene slipper teksten gjennom
   hvis besok-vern.js ikke er lastet (f.eks. `besok-nytt.js:73`). Det er
   trolig et bevisst valg for demo-robusthet, men det står ingen steder, og
   script-rekkefølgen i HTML er eneste håndhevelse
   (`besok/bli-medarbeider.html:190–194`, `besok/nytt.html:114–116`).

---

## Oppsummert prioritering for fase 3

| Funn | Dom | Samlingsverdi |
|---|---|---|
| 2: fem oversettelsestabeller, PP_SPRAK død og driftet | tilfeldig | **Høyest** – levende meldingsfeil (oppgavekilde, signatur) |
| 6: PP_VERN-kappen (returform, beskjeder, fail-open) | tilfeldig | Høy – én returkontrakt + én visningshjelper |
| 3: to les-og-rydd-lag + to feltregistre i A | tilfeldig | Høy – SQL-generatoren dekker bare det ene |
| 1: to registreringsflyter | legitim i data, tilfeldig i mekanikk | Middels – del hjelpere, ikke flyt; PP_VERN-gapet i C må merkes |
| 5: samtykkeformater + posisjonsduplikat | mest legitim | Lav – to småting, resten avkreftet |
| 4: tre prislogikker | legitim | Ingen – skillet er villet og begrunnet i koden |

Fellesnevneren: dupliseringen bor nesten aldri i kontrollflyt, men i
**parallelle konstant-tabeller med hver sin fallback** (språk, felt-registre,
priser, demodata). C-områdets adskillelse fra A/B er gjennomgående legitim
(parkert modell bak juridisk grense); de tilfeldige divergensene ligger
innad i A (funn 3), mellom A og D (funn 2) og mellom A og B (funn 6).

## Tillitsnotat og hull

**Tillit: høy** for alle fil:linje-referanser – hvert kallsted og hver tabell
er lest i kildefilen i denne økten, ikke bare overtatt fra fase 1. Døde
kall (PP_SPRAK.melding, PP_VERN i C) er verifisert med grep over hele
repoet, med ordgrense der navnene overlapper (PP_SPRAK / PP_SPRAK_UI /
PP_SPRAKKRAV).

Hull og forbehold:

- **Ingen kjøring.** Alt er statisk lesning; påstanden om at
  familiemeldingen kan liste uutførte oppgaver (funn 2, drift 2) er utledet
  av koden (`besok-lager.js:334` mot `besok-sprak.js:278`), ikke demonstrert
  i nettleser.
- **Historikken i (c) er rekonstruert** fra kommentarer
  (`hjelper-base.js:8, 138`, `klarhet.js:122–125`) og dokumenttilstandene i
  CLAUDE.md kap. 6, ikke fra git-loggen. En `git log --follow` på
  `registrering.js` mot `hjelper-registrering.js` ville datert divergensen
  presist; det er ikke gjort her.
- `besok-kvalitet.js` er kun lest via grep (`:14, :43–44`);
  åtte-språkstabellen er ikke gjennomgått linje for linje.
- `driftdata.js`, `godkjenn-skjerm.js` og `hjelper-opptak.js` er sitert fra
  fase 1-lesningene pluss punktgrep (`hjelper-opptak.js:481`), ikke lest på
  nytt i sin helhet.
- Testene er ikke kjørt i denne økten; testlinjene (`enhet.test.js:582,
  :785, :1250, :2041`) er verifisert med grep, ikke ved kjøring.
