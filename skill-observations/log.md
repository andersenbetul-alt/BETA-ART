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
