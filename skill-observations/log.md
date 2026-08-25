# Observasjonslogg

Ført av `task-observer`. Én oppføring per mønster som er verdt å holde fast.

---

### Observation 1: Rammeverksferdigheter kan skade et prosjekt uten rammeverket

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** `/react-best-practices` kjørt mot Naviar Care, som er statisk HTML/CSS/JS uten avhengigheter
**Skill:** react-best-practices, vercel-react-best-practices
**Type:** open-source
**Phase/Area:** Regel `js-cache-storage`, kategori 7

**Issue:** Femti av sytti regler gjaldt ikke. Verre: `js-cache-storage` sier at
localStorage-lesninger skal mellomlagres. I denne kodebasen kjører `rydd()` ved
hver lesning, og sletting ved lesning er hele grunnen til at den ligger der.
Følger man regelen, slutter slettingen å skje, og ingen test fanger det.

**Suggested improvement:** Regelen bør ha et unntak: mellomlagre ikke en lesning
som har en bivirkning. Mer generelt bør ferdigheter som forutsetter et rammeverk
si det i beskrivelsen, slik at de ikke lastes automatisk der rammeverket mangler.

**Principle:** En regel som er trygg i sin egen kontekst kan bryte en garanti i
en annen. Skadepotensialet, ikke bare relevansen, avgjør om en ferdighet skal
kunne lastes automatisk.

---

### Observation 2: Tomt søkeresultat er ikke det samme som ingen treff

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** `/find-skills` – `npx skills find` returnerte tomt på alle søk
**Skill:** find-skills
**Type:** open-source
**Phase/Area:** Steg 3, søk

**Issue:** Søk på «accessibility», «static site», «gdpr privacy» og til slutt
«react» ga alle «No skills found». Men `react-best-practices` har 185 000
installasjoner og lå installert på maskinen. `curl https://skills.sh/` ga 000:
verten var uåpnelig gjennom proxyen. Verktøyet presenterte en nettverksfeil som
et resultat.

**Suggested improvement:** Ferdigheten bør be om en kontrollspørring med kjent
treff før den konkluderer med at noe ikke finnes, og skille «fant ingenting» fra
«kunne ikke søke».

**Principle:** Et verktøy som svarer det samme på «ingenting finnes» og «jeg nådde
ikke fram», må sannsynliggjøres før svaret brukes.

---

### Observation 3: Reglene bør generere skjemaet, ikke stå ved siden av det

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Oversettelse av sletteplanen fra JavaScript til PostgreSQL
**Skill:** New skill candidate: regler-til-skjema
**Type:** internal
**Phase/Area:** `verktoy/lag-skjema.js`

**Issue:** Sletteplanen lå som data i `besok-vern.js`. Å skrive SQL for hånd
ville gitt to sannheter som glir fra hverandre. Generatoren avdekket samtidig en
feil ingen hadde sett: trinn 4 nuller `id`, `opprettet` og `status`, som i JS
bare er felter, men i Postgres er primærnøkkel og den kolonnen krympingen selv
leser. Oversettelsen måtte bli en flytting til en statistikktabell, ikke en
UPDATE.

**Suggested improvement:** Der en regel finnes som data, generer skjemaet fra
den. Kjør generatoren på nytt når regelen endres.

**Principle:** Å oversette en regel til et annet medium er den billigste måten å
finne ut om man har forstått den.

---

### Observation 4: Skjermbildet må ses på, ikke bare tas

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** `/run-skill-generator`, og senere kontroll av tilgjengelighetstreet
**Skill:** run-skill-generator
**Type:** open-source
**Phase/Area:** Definition of done, punkt 1

**Issue:** To ganger ga et førsteinntrykk feil svar. `document.querySelector('h1')`
på `utfor.html` returnerte overskriften til en skjult seksjon, så siden så
ødelagt ut mens skjemaet var synlig. Og `page.accessibility.snapshot()` ga tomt
resultat for `role="alert"` – ikke fordi rollen manglet, men fordi standard
`interestingOnly: true` beskjærer treet. Begge ville blitt rapportert som feil
uten en kontroll til.

**Suggested improvement:** Legg til i Red flags: et negativt funn fra ett
måleverktøy skal bekreftes med en uavhengig måling før det skrives ned.

**Principle:** Et verktøy som svarer «ingenting» svarer ofte på et annet
spørsmål enn det du stilte.

---

### Observation 5: Utdata til /dev/null skjuler at ingenting ble opprettet

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Lasting av generert SQL inn i en lokal Postgres
**Skill:** New skill candidate: verifiser-generert-sql
**Type:** internal
**Phase/Area:** Lasting og verifisering

**Issue:** Skjemaet ble lastet med `psql ... >/dev/null 2>&1` for å holde
utdata kort. Lastingen feilet på siste funksjon – `too many parameters
specified for RAISE` – uten at det ble sett. Triggeren fantes aldri.
Etterpå gikk en insert med «diabetes» rett inn, og sperra så ut til å være
uten virkning. Den var ikke uten virkning; den var ikke der.

**Suggested improvement:** Last alltid generert SQL med `-v ON_ERROR_STOP=1`
og uten å kaste utdata. Bekreft etterpå at objektene finnes
(`select tgname from pg_trigger where not tgisinternal`) før noe testes.

**Principle:** Å skjule utdata fra et steg gjør at neste steg tester noe annet
enn du tror. Et negativt resultat må først forklares med at inngrepet aldri
skjedde.

---

### Observation 6: Kryssprøv to motorer på samme korpus, ikke på antall

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Samme ordliste håndhevet i JavaScript og i PostgreSQL
**Skill:** New skill candidate: regler-til-skjema
**Type:** internal
**Phase/Area:** Ekvivalenstesting

**Issue:** Begge motorene blokkerte 74 av 79 tekster. Like tall er ikke like
avgjørelser – de kunne vært uenige om hvilke fem. Først en sammenligning per
tekst viste at de var enige om alle 79, inkludert grensetilfellene: åtte
siffer slipper gjennom begge steder, elleve stoppes begge steder.

**Suggested improvement:** Der samme regel skal gjelde i to kjøremiljøer,
kjør begge over det samme korpuset og diff per element. Ta med grensetilfellene
som skiller de to reglene fra hverandre.

**Principle:** Et aggregat kan stemme mens hver enkelt avgjørelse er feil.
Sammenlign avgjørelsene, ikke summen av dem.

---

### Observation 7: Loggen hører hjemme i repoet når konteineren er flyktig

**Status:** ACTIONED (2026-08-24) — Applied to task-observer (prosjektkopien)
**Date:** 2026-08-24
**Session context:** Oppsett av task-observer i Claude Code på nett
**Skill:** task-observer
**Type:** open-source
**Phase/Area:** `[workspace folder]`-definisjonen, og `references/environments.md`

**Issue:** Ferdigheten definerer arbeidsmappa som en stabil sti som overlever
økter, og nevner `~/.claude/projects/<id>/` som eksempelet i Claude Code.
I et fjernmiljø er den stien ikke stabil: hele konteineren rives når økta er
over, og `~/.claude/` går med. Advarselen i ferdigheten gjelder flyktige
utsjekker (`.claude/worktrees/`), men her er det motsatt – *utsjekken* er det
holdbare, fordi den pushes til et fjernrepo.

**Suggested improvement:** La definisjonen skille på om hjemmemappa eller
utsjekken er den varige. I et fjernmiljø med et versjonskontrollert repo hører
loggen til i repoet, der den også blir lesbar for andre og får historikk. Legg
en setning om dette i `references/environments.md`.

**Principle:** «Stabil sti» er ikke en egenskap ved mappa, men ved hva som
overlever i det konkrete miljøet. Avgjør det per miljø, ikke per plattform.

### Observation 8: Et mål som ikke kan innfris, presser fram fyllstoff

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** `/goal` satt til et forretningsutfall («en tjeneste som er
kjent i verden»), med en Stop-hook som blokkerer avslutning til vilkåret holder
**Skill:** New skill candidate: mål-og-avslutningsvilkår
**Type:** open-source
**Phase/Area:** Vilkårsformulering

**Issue:** Vilkåret krevde lansering, ekte brukere og posisjon i markedet over
tid. Ingenting av det kan skje i én økt. Hooken blokkerte avslutning sju
ganger, og hver runde ga et press mot å produsere noe – hva som helst – for å
komme videre. Arbeidet var reelt de første rundene, men fristelsen til å lage
dokumenter for å tilfredsstille en teller var tydelig, og den er en dårlig
grunn til å skrive noe.

**Suggested improvement:** Skill mellom **retning** og **avslutningsvilkår**.
Et mål kan gjerne være et forretningsutfall, men vilkåret som gater avslutning
må være noe økta kan avgjøre: «alle tekniske forutsetninger er gjort og de
gjenstående er navngitt og eskalert». Når en hook har konkludert to ganger på
rad at vilkåret ligger utenfor økta, bør den si det som et resultat i stedet
for å blokkere videre.

**Principle:** Et avslutningsvilkår som ikke kan avgjøres av den som holdes
igjen av det, måler ikke framdrift – det måler utholdenhet, og betaler for
fyllstoff.

### Observation 9: `/security-review` faller på `origin/HEAD` i et fjernmiljø

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** `/security-review` forsøkt to ganger i samme økt
**Skill:** security-review
**Type:** open-source
**Phase/Area:** Diff-oppslaget

**Issue:** Ferdigheten kjører `git diff origin/HEAD...` og feiler med
«ambiguous argument 'origin/HEAD...'». I en fersk klone i et fjernmiljø er
`refs/remotes/origin/HEAD` ikke satt, og `git remote set-head origin -a` hjalp
ikke fordi standardgreina ikke heter `main`. Ferdigheten er ubrukelig her, og
feilen sier ikke hva som mangler.

**Suggested improvement:** Fall tilbake på sporingsgreina, eller på
standardgreina lest fra `git symbolic-ref refs/remotes/origin/HEAD` med en
eksplisitt `git ls-remote --symref origin HEAD` som andrevalg. Si hva som
mangler når ingen av dem finnes.

**Principle:** En ferdighet som forutsetter lokal git-tilstand må lese den, ikke
anta den. En fersk klone har færre referanser enn en arbeidskopi.

### Observation 10: Blueprint-dumper trenger triage-dokument, ikke motstand eller lydighet

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Eieren limte inn en komplett markedsplass-blueprint i fem meldinger og ba om at den utvikles, i strid med prosjektets dokumenterte modellvalg
**Skill:** New skill candidate: forretningsmodell-triage
**Type:** open-source
**Phase/Area:** Håndtering av store visjonsdokumenter som kolliderer med etablerte beslutninger

**Issue:** Fristelsen står mellom to feil: bygge det som bes om (og undergrave en dokumentert juridisk grense) eller avvise (og miste alt det gode i dokumentet). Det som virket: dele dokumentet i tre bunker — modellnøytralt (bygges nå), modellavhengig (én navngitt beslutning med alternativer og priser), aldri (de faste grensene) — og vise at ~80 % av visjonen overlever i alle utfall.

**Suggested improvement:** Regel for slike situasjoner: verifiser påstandene med primærkilder først, finn den ene bærende beslutningen, og lever et triage-dokument der eierens beslutning er et navngitt valg med kostnader — ikke et ja/nei til hele visjonen.

**Principle:** Et visjonsdokument som kolliderer med en etablert grense behandles som råvare, ikke som ordre eller trussel: sorter det etter hva som er uavhengig av konflikten, og gjør konflikten til én eksplisitt beslutning med prislapp.

### Observation 11: Logo gjenskapt fra rasterbilde med tegn-render-sammenlign-løkke

**Status:** ACTIONED (2026-08-24) — tegn.js og løkka skrevet inn i run-naviar
**Date:** 2026-08-24
**Session context:** Ny merkeidentitet (v0.4) levert som JPEG i chat, vektormaster utilgjengelig
**Skill:** run-naviar / naviar-merkevare
**Type:** open-source
**Phase/Area:** Merkevareintegrasjon

**Issue:** Masterfila lå i et annet verktøys sandkasse. Eneste vei til «legg
dette på nettsiden» var å gjenskape geometrien som SVG og verifisere visuelt:
tegn parametrisk, render i Chromium, sammenlign mot originalen i konteksten,
iterer. To iterasjoner holdt; bokstavformene var feilest første gang, ikke
merket. I tillegg: git add -A fra en undermappe la inn hele treet, mens
python/grep med relative stier feilet stille - commiten kom uten
merkevarenotatet den lovte.

**Suggested improvement:** run-naviar bør nevne mønsteret: parametrisk
SVG-generator + Chromium-render + visuell diff som standardløkke for grafikk
uten kildefil. Og: skriv aldri commit-tekst som lover innhold før filskrivingene
er verifisert.

**Principle:** Når kildefila ikke kan nås, er en verifiserbar gjengivelse med
dokumentert avvik bedre enn å vente - merket som midlertidig og byttet byte
for byte når masteren kommer.

### Observation 12: Script-tagger + globale eksporter er nok til å kartlegge en IIFE-kodebase

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Pathfinder-oppdagelse: kartlegge features i BETA-ART
**Skill:** claude-mem:pathfinder
**Type:** open-source
**Phase/Area:** Discovery-fasen (feature-avgrensning)

**Issue:** I en avhengighetsfri kodebase der moduler er IIFE-er på window,
ga to grep-kall hele avhengighetsgrafen: (1) `<script`-tagger per HTML-side
gir side→modul-kanter, (2) `window.PP_* =` / `global.PP_* =` gir eksportene,
og et tredje grep på bruk av eksportnavnene gir modul→modul-kanter. Ingen
full fillesning var nødvendig for å avgrense features; headerkommentarene
(de første 8-12 linjene) ga formålet.

**Suggested improvement:** Legg inn i pathfinder-oppdagelsessteget: for
rammeverksfrie prosjekter, bygg grafen fra script-tagger og globale
eksporter først, og les bare filhoder for formål – full lesning kun der
grensene er uklare.

**Principle:** Avhengighetsgrafen i en byggefri kodebase står eksplisitt i
HTML-en og i de globale eksportene; hent den derfra før du leser kode.

### Observation 13: Generator-utdata verifiseres billigst ved regenerering + diff

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Pathfinder fase 1 – flytskisser for periferien (landing, klagekanal, SQL-generator)
**Skill:** claude-mem:pathfinder
**Type:** open-source
**Phase/Area:** Kartlegging av kodegeneratorer

**Issue:** Ved kartlegging av verktoy/lag-skjema.js var spørsmålet om innsjekket sql/001-besok.sql faktisk stemmer med kilden. Én kjøring til scratchpad + diff ga byte-likt svar og løftet tillitsnotatet fra antakelse til verifisert funn.

**Suggested improvement:** Pathfinder-rapporter som dekker en generator bør inneholde steget «regenerer til scratchpad og diff mot innsjekket artefakt» som standard verifikasjon.

**Principle:** Når et artefakt hevdes generert fra en kilde, er regenerering + diff den billigste høytillitsverifikasjonen – kjør den i stedet for å lese begge for hånd.

### Observation 14: Policyporten kan ligge i en modul flyten aldri laster

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Pathfinder fase 1: flytdiagram for KLARHET 45 (b-klarhet.md)
**Skill:** claude-mem:pathfinder
**Type:** open-source
**Phase/Area:** Flowchart-fasen (sporing av regler og porter)

**Issue:** Oppgaven ba om å finne betalingssperren «i koden», med seks
navngitte filer. Sperren lå i en sjuende modul (PP_BETALING) som ingen av
sidene i flyten laster: strømmen står som 'avklares' og porten nekter, men
fra skjermkoden er regelen usynlig – den håndheves ved fravær av et
betalingssteg. Et grep på tvers av hele assets/js etter nøkkelordene
(sperr/jus/betaling) fant den på første forsøk; å lese bare de navngitte
filene ville ikke gjort det.

**Suggested improvement:** I pathfinder-flowchartsteget: når en flyt skal
vise hvor en policy/sperre slår inn, grep etter regelens nøkkelord i hele
kodebasen før filene i oppdraget leses – og noter eksplisitt i rapporten
når porten ligger i en modul flyten ikke laster, for det er et
arkitekturfunn i seg selv (regelen kan ikke omgås fra flaten, men heller
ikke ses derfra).

**Principle:** En regel som håndheves ved at koden mangler, finnes ikke i
filene flyten bruker – søk etter regelen i hele kodebasen, og behandle
«modulen lastes ikke» som et funn, ikke som et blindspor.

### Observation 15: Fase 1-diagrammene finner bare en del av dupliseringene

**Status:** OPEN
**Dato:** 2026-08-24
**Session context:** Pathfinder fase 2a – duplisering innen område A–D i BETA-ART
**Skill:** claude-mem:pathfinder
**Type:** open-source
**Phase/Area:** Fase 2 (duplication pass)

**Issue:** «Hull og funn»-seksjonene fra fase 1 pekte riktig på tre
dupliseringer (to DEMO-ekspertlister, PP_RUTER-no-op, bestill-avslag ×2),
og alle lot seg verifisere raskt. Men flertallet av de reelle
dupliseringene i område B (byggSprak ×3, tegnAkutt ×3, opplesning ×2,
SVG-ikonfabrikk ×2, lag/ved ×3) sto ikke i noe fase 1-funn og ble bare
synlige ved å lese søsterskjermfilene i sin helhet, side om side.

**Suggested improvement:** I pathfinder-skillens fase 2-instruks: si
eksplisitt at fase 1-funnene er startlista, ikke fasiten, og at
skjermmoduler som deler prefiks/rolle (søsterskjermer i samme område)
skal leses i sin helhet parvis før dupliseringslista lukkes.

**Principle:** Flytkartlegging optimerer for kallkjeder og finner derfor
duplisert *data og regelbruk*; duplisert *hjelpekode* (helpers, oppsett,
boilerplate) er usynlig i flytdiagrammer og krever parvis fullesing av
likestilte moduler.

### Observation 16: Kryssduplisering viser seg som parallelle konstant-tabeller, og fallback-verdier skjuler kontraktsdrift

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Pathfinder fase 2 – duplisering på tvers av områdene A/B/C/D
**Skill:** claude-mem:pathfinder
**Type:** open-source
**Phase/Area:** Fase 2 (duplisert bekymring)

**Issue:** De reelle krysdupliseringene i denne kodebasen var nesten aldri
duplisert flytlogikk – de var parallelle konstant-tabeller med hver sin lille
fallback-funksjon (fem oversettelsestabeller med hver sin `t[kode] || t.nb`,
tre prisstrukturer, tre felt-registre med begrunnelse+frist, fire
localStorage-/minne-konvensjoner). Grep etter tabellsignaturer (språkkoder,
`pp_*_v1`-nøkler, beløp) fant dem billigere enn flytsammenligning. I tillegg:
én konsument (ekspertbistand.js:731) leser felter (`f.hva`, `f.istedenfor`)
som produsentens returobjekt (PP_VERN.sjekk sitt funn: id/navn/beskjed/ord)
aldri har hatt – `||`-fallbackene gjør at driften er stille og usynlig i
kjøring.

**Suggested improvement:** I pathfinder fase 2: (1) start dupliseringsjakten
med grep etter konstant-tabellsignaturer på tvers av områdene, ikke med
flytlesing; (2) ved delte hjelpefunksjoner, diff konsumentens felt-tilganger
mot produsentens faktiske returobjekt – fallback-uttrykk (`x.felt || 'tekst'`)
er et rødt flagg for at kontrakten har driftet uten feil.

**Principle:** Duplisert bekymring bor oftere i data (parallelle tabeller med
hver sin fallback) enn i kontrollflyt, og en fallback-verdi ved felt-oppslag
kan bety at feltet aldri har eksistert – verifiser konsumentens felt mot
produsentens returform.

### Observation 17: PDF-lesing i containeren krever cffi-reparasjon

**Status:** OPEN
**Date:** 2026-08-24
**Session context:** Lesing av opplastede QA-pakke-PDF-er for logo v0.2
**Skill:** run-naviar
**Type:** open-source
**Phase/Area:** Verktøykjeden i containeren

**Issue:** Både `Read` (pdftoppm mangler), `pypdf` og `pdfminer.six` feilet på
PDF-lesing. Rotårsaken var ikke bibliotekene, men at systemets `cryptography`
mangler `_cffi_backend` og panikker ved import. `pip install cffi` reparerte
alt; deretter virket pdfminer.six rett fram.

**Suggested improvement:** Legg gotcha i run-naviar: «PDF i denne containeren:
pip install cffi pdfminer.six, så extract_text. pdftoppm og LibreOffice finnes
ikke.»

**Principle:** Når flere uavhengige biblioteker feiler med samme underlige
importfeil, er feilen i et delt lag under dem – reparer laget, ikke bytt
bibliotek en gang til.

### Observation 18: BLOCKED-diagnosen var ufullstendig – prosjektet var pauset

**Status:** OPEN
**Date:** 2026-08-25
**Session context:** /versel – ny deploy av Naviar Care
**Skill:** deploy-naviar
**Type:** open-source
**Phase/Area:** Tilstander du vil møte

**Issue:** Skillen forklarte BLOCKED som plattformblokk som «løses bare i
dashbordet». Den egentlige årsaken var at prosjektet var PAUSET:
produksjonsdomenet svarte 503 DEPLOYMENT_PAUSED, unpause_project løste alt,
og neste deploy gikk READY på fire sekunder. Diagnosen ble stående en hel
dag fordi ingen fetchet produksjonsdomenet – alle så bare på
deployment-objektet, som ikke nevner pause.

**Suggested improvement:** Gjort: skillen sier nå «sjekk pause først». 

**Principle:** Når et objekt rapporterer en blokktilstand uten årsak, hent
tilstanden til BEHOLDEREN det ligger i (prosjektet, kontoen) før du
konkluderer med det uløselige. Og: en diagnose som ender i «kan bare løses
utenfor systemet» fortjener ett motbevis-forsøk til før den skrives ned.

### Observation 19: Katalogmodulen gjentok et register som allerede fantes

**Status:** OPEN
**Date:** 2026-08-25
**Session context:** PP_KATALOG bygget for pilotkategoriene; juridisk-memoet avdekket duplikatet
**Skill:** New skill candidate: repo-inventar før ny modul
**Type:** open-source
**Phase/Area:** Før-skriving

**Issue:** PP_KATALOG ble skrevet med egne id-er, egne tekster og eget
risikonivå for fire tjenester som allerede lå fullt definert i
PP_BESOK.OPPGAVER – med ANDRE id-er og STRENGERE risiko. Modulens egen
header lovet «ett felt, én sannhet» mens den innførte sannhet nummer to.
Duplikatet ble ikke oppdaget av meg, men av juridisk-agenten som leste
koden mot regelverket: «hvilke lavrisikooppdrag kan tildeles automatisk»
hadde to svar. Jeg grep etter matching.js og demodata.js før jeg skrev,
men søkte aldri etter selve tjenestenavnene («Digital hjelp», «Hent») på
tvers av repoet.

**Suggested improvement:** Før en ny regelmodul skrives: grep etter
DOMENEBEGREPENE (tjenestenavn, kategorinavn) i hele assets/js, ikke bare
etter modul- og feltnavnene du selv planlegger å bruke. Pathfinder-kartet
(PATHFINDER-*/00-features.md) lister eierskapet og skal konsulteres.

**Principle:** Duplikater oppstår ikke fordi man ikke leter, men fordi man
leter med sitt eget planlagte vokabular i stedet for domenets. Søk etter
tingenes navn, ikke etter strukturen du har tenkt å bygge.

### Observation 20: Malen skal følges nøyaktig, men lederlisten mangler plasseringsregel

**Status:** OPEN
**Date:** 2026-08-25
**Session context:** Ikke-interaktiv eval av performance-review-ferdigheten (utkast til halvårsvurdering, iteration-1/eval-1-ordrett-sitat)
**Skill:** performance-review
**Type:** open-source
**Phase/Area:** Steg 3 · Skriv utkastet i malen

**Issue:** Steg 3 krever at malstrukturen følges «nøyaktig – samme overskrifter, samme rekkefølge, ingenting lagt til eller fjernet», og krever samtidig at utkastet avsluttes med en liste til lederen (mangler, temaer utenfor rammeverket, utkast-påminnelse). Ferdigheten sier ikke hvor listen skal stå i forhold til malen. Løst i økten ved å legge listen etter en skillelinje, tydelig merket som «ikke en del av vurderingsdokumentet».

**Suggested improvement:** Legg én setning i steg 3: lederlisten plasseres etter maldokumentet, adskilt og merket som notat til lederen, ikke som en ekstra seksjon i malen.

**Principle:** Når en ferdighet både krever eksakt maltro og ekstra utdata, må den si eksplisitt hvor det ekstra hører hjemme – ellers må hver kjøring improvisere grensen mellom dokument og metatekst.
