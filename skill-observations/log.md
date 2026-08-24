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
