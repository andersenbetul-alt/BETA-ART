# Heuristisk konkurrentaudit

24.08.2026. Fem konkurrenter mot Naviar Care, målt mot Nielsens ti
heuristikker pluss våre tre egne. **Bevisgrense:** konkurrentene er vurdert
på offentlig produktdokumentasjon (produktsider, app-butikkomtaler) – ikke
innloggede skjermer. Celler uten belegg står tomme i stedet for å gjettes.
Vår egen side er vurdert fra faktiske skjermgjennomganger i denne økta.

## Våre tre egne heuristikker

- **H11 Personvern i datamodellen:** felt som ikke finnes, kan ikke fylles
  ut; fritekst går gjennom sperre før lagring.
- **H12 Eldre først:** AAA-kontrast som mål, 96 px trykkflater, aldri
  tilstand med farge alene, ingen tvungen innlogging for den eldre.
- **H13 Forklarbarhet:** hver score, hvert avslag og hver skjuling har en
  navngitt grunn på skjermen.

## Konkurrentene

**Birdie** (UK, B2B hjemmetjeneste-plattform – tvillingen til
besøksbekreftelsen). Sterk: overlevering med forrige besøksnotater,
tale-til-tekst-notater, familieapp som oppdateres automatisk ved fullført
besøk (N1 synlighet: sterkere enn oss – vi har designet varselet, de har
det i drift). Svak mot oss: medisinmodul, kroppskart og PRN-signering gjør
appen til et journalsystem – H11 er der plattformens forretningsmodell, ikke
en grense; kognitiv last i arbeiderappen er høy (N8).

**Nursebuddy** (FI/UK, samme kategori). Sterk: **arbeiderappen virker uten
nett** – besøket kan dokumenteres i kjeller og strøksone (N7/robusthet,
klart sterkere enn vår nettbaserte arbeiderlenke); «dagen min»-visning med
kjørerute. Svak mot oss: dagbokstatus formidles med fargekoder (H12-brudd
hos oss), og appen lagrer tilgangskoder til hjem – H11-rødt flagg vi aldri
tar inn.

**Papa** (US, companionship-markedsplass – tvillingen til v2-grunnlaget).
Sterk: bestillingen er tre valg (dato, lengde, oppgavetype) og «Pal ringer
for å avtale» – førbesøks-samtalen senker terskel (N2/samsvar med
virkeligheten). Svak mot oss: «Uber for eldreomsorg» – ny fremmed per besøk,
ingen kontinuitet (mot vårt hjelpeteam), og finansieringen går via
forsikringsplaner, ikke familien – relasjonen eies av betaleren (H13 om
hvorfor akkurat denne personen kom: fraværende).

**Nyby** (NO, kommune/frivillig-plattform). Sterk: «du forplikter deg ikke,
du trenger ikke takke nei» – null-press-modellen for frivillige er samme
design som vår tavle uten straff for Ikke aktuell; distribusjon via
kommunegrupper er en kanal vi bør studere (B2B2C). Svak mot oss: oppgaven
er enheten, ikke relasjonen; godkjenningen av frivillige er grovere enn
tillitsnivåene våre (H13: ingen synlig grunn for hvem som får hva).

**Jointly** (UK Carers UK, familiekoordinering). Sterk: **kretsen opprettes
av familien selv, og familiemedlemmer tar oppgaver** – ulønnede omsorgs-
personer er førsteklasses aktører, ikke tilskuere; enkel oppgave-status i
delt sirkel (N1). Svak mot oss: medisinliste med bildeopplasting (H11-rødt
hos oss), og appen forutsetter at den eldre ikke er bruker i det hele tatt
(H12: vår godkjenningsskjerm gir den eldre selv siste ord).

## Scorekort (0 = svakere enn oss, 1 = jevnt, 2 = sterkere; – = ikke belagt)

| Heuristikk | Birdie | Nursebuddy | Papa | Nyby | Jointly |
|---|---|---|---|---|---|
| N1 Synlig status | 2 | 1 | 1 | – | 1 |
| N2 Samsvar med virkeligheten | 1 | 1 | 2 | 1 | 1 |
| N3 Kontroll og frihet | – | – | 1 | 2 | 1 |
| N5 Forebygge feil | 1 | 1 | – | – | 0 |
| N7 Fleksibilitet/robusthet | 1 | 2 | 1 | 1 | – |
| N8 Minimalistisk design | 0 | 1 | 1 | – | 1 |
| H11 Personvern i datamodellen | 0 | 0 | 0 | 1 | 0 |
| H12 Eldre først | 0 | 0 | 1 | 1 | 0 |
| H13 Forklarbarhet | – | – | 0 | 0 | – |

N4/N6/N9/N10 hadde ikke belegg nok til å skille noen – utelatt heller enn
gjettet.

## Tre mønstre verdt å stjele

1. **Frakoblet-først arbeiderflate** (Nursebuddy). Bekreftelsen må virke i
   kjellere og dødsone; en lenke som krever nett i øyeblikket, mister
   nettopp de besøkene som trenger dokumentasjon mest. Vår token-modell kan
   få en kø-og-synk-variant uten konto.
2. **Overlevering innen slettefristen** (Birdie). «Forrige besøk»-sammendrag
   til neste arbeider – hos oss mulig innen 7-dagersvinduet for fritekst og
   uten journal: oppgaveutfall + de faste utfallene, aldri fritekst eldre
   enn fristen.
3. **Familien som deltaker, ikke publikum** (Jointly + Nybys nullpress).
   Kretsen tar oppgaver selv: «Datteren tar handlingen tirsdag» er et
   gyldig utfall i hjelpeteamet, og ingen straffes for å si nei.

## Tre mønstre å unngå

1. **Journal ved snikinnføring** (Birdie/Jointly): medisinmoduler,
   kroppskart, PRN. Det er deres styrke og vår grense – rød kategori, og
   grunnen til at leverandører med journalplikt ikke er vår kunde.
2. **Fremmed per besøk** (Papa): fleksibilitet uten kontinuitet. Hele
   hjelpeteam-prinsippet er svaret; kopierer vi bestillingsflyten, kopierer
   vi ikke relasjonsmodellen bort.
3. **Farge som eneste signal + nøkler i appen** (Nursebuddy): fargekodet
   status bryter H12, og lagrede tilgangskoder er H11-gift – døren åpnes av
   relasjonen og leverandørens rutiner, ikke av en kode i en database.

## Det norske markedet leverandørens kunde faktisk velger mellom

Auditen over sammenligner digitale plattformer – samme lag som Naviar selv
konkurrerer i (programvare til tjenesteleverandører). Familien som til slutt
betaler for et besøk, velger derimot mellom disse alternativene i Oslo. Dette
er research med ekte kilder (25.08.2026, forhåndsregistrert hypotese +
bevislogg + uavhengig verifisering – metoden holder), og konklusjonen er
ubehagelig ærlig: **kontinuitet og familieoppdatering er ikke unike.**

| Alternativ | Hva det faktisk tilbyr | Kilde |
|---|---|---|
| Oslo kommune, praktisk bistand | Handling, vask, klesvask – krever vedtak, ingen valg av hvem som kommer | oslo.kommune.no |
| Oslo Røde Kors, besøksvenn | Sosial kontakt, ca. annenhver uke, opplærte og taushetsbelagte frivillige | rodekors.no |
| Nasjonalforeningen Aktivitetsvenn | Aktivitetsvenn matchet på interesse, for personer med demens | nasjonalforeningen.no |
| **2Care** | **Nærmeste kommersielle konkurrent.** Sosialt samvær, følge til avtaler, **fast person/fast tid**, fra 650 kr/time | 2care.no |
| Norlandia Care | Bredere privat hjemmehjelp: rengjøring, mat, personlig hygiene, følge | norlandiacare.no |
| Care.com Norge | Åpen plattform som kobler familie og hjelper – ren formidler, ikke driftet tjeneste | care.com |
| Helsenorge (Nordstrand hjemmetjeneste) | Pårørende kan allerede se avtaler og få varsel om utført besøk via Helsenorge | oslo.kommune.no |

**Konklusjonen, ordrett verdt å ta med:** *«Present NAVIAR as a narrow,
managed alternative with a deliberately simple, consent-led family workflow;
validate whether customers value it before treating it as a durable
advantage.»* 2Care har allerede fast person/fast tid. Helsenorge har allerede
familievarsling. Ingen av disse er egnet som hovedbudskap alene.

**Det som fortsatt ikke er dekket av noen kilde over** (altså der en reell
forskjell kan ligge, ubekreftet): et smalt, eksplisitt begrenset tilbud
(sosialt besøk, følge, digital hjelp – ingenting annet) kombinert med
menneskelig vurdering av hver forespørsel og et bevisst *ikke*-medisinsk
løfte. 2Care og Norlandia velger motsatt strategi – bredere omfang som
inkluderer personlig hygiene og pleie. Det er en posisjon, ikke et bevist
konkurransefortrinn, og bør testes med ekte kunder før det brukes som
markedsføringspåstand.

**Viktig for hvem dette gjelder:** hele tabellen over er leverandørens
konkurranseflate, ikke Naviars. Naviar selger ikke til familien (modell A,
`FORRETNINGSMODELL-V1.md`) – det er leverandøren som konkurrerer mot 2Care og
Norlandia. Det programvaren kan gjøre er å gjøre den smale posisjonen billig
å levere for en liten leverandør: fast-hjelper-prioritet og familieoppdatering
er allerede bygget (`HJELPETEAM.md`, `familie.html`) uten 2Cares skala.
