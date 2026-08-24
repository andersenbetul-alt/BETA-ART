# Funksjonsinventar – Naviar Care (BETA-ART)

Fra Pathfinder fase 0, 24.08.2026. Grunnlaget er grep-verifiserte
script-tagger, IIFE-startlinjer og `window.PP_*`-eksporter (28 globaler) –
se oppdagelsesrapporten. Mønsteret i hele kodebasen: **regelmoduler**
(eksporterer PP_*, ingen DOM) og **skjermmoduler** (anonyme IIFE-er som
leser regler og ev. registrerer seg i `PP_RUTER`). Skjermer leser regler,
aldri omvendt.

## Områder

| Område | Hva | Status |
|---|---|---|
| **A · Besøksbekreftelse** (`besok/`) | Produktet som selges: planlegg → utfør → bekreft → historikk, med PP_BESOK (datalag med `rydd()` ved hver lesning) og PP_VERN (personvernport) som bærebjelker. Medarbeiderregistrering, klagekanal og SQL-generatoren hører til her | I drift som pilot |
| **B · Klarhet 45** | Tjeneste nr. 2: én samtale, tre neste steg. klarhet → bestill → eldres godkjenning, med PP_EKSPERT/PP_KLARHET som regler og PP_SPRAK_UI (10 språk) | Betaling sperret til jus er avklart |
| **C · Markedsplass v2-grunnlag** (rot) | v1-koden fra markedsplassmodellen: senior-bestilling (PP_AKUTT/PP_PRIS), hjelperregistrering (PP_API), oppdragstavle (PP_MATCHING/PP_DEMO), driftskonsoll | Parkert; juridisk grense gjelder (JURIDISK-GRENSE.md beslutning 1) |
| **D · Regler uten skjerm** | 10 moduler bare tester og andre moduler leser: PP_ABONNEMENT, PP_BETALING, PP_AGENTER, PP_KI_PORT, PP_BEHOV, PP_KVALITET, PP_MALING, PP_SPRAK, PP_KLARSPRAK, PP_MERKESPRAK | Kontrakter for backend |
| **E · Støtte** | Testharness (tests/), merkeverktøy (verktoy/), tokens (design/) | – |

## Flytdiagram-inndeling (fase 1)

| Diagram | Dekker | Inngangspunkt |
|---|---|---|
| a-besok-livslop | A1 lager, A2 vern, A5 nytt → A6 oversikt → A7 utfør → A8 historikk | `besok/nytt.html:116` → `besok-nytt.js:3` |
| a-medarbeider | A9 registrering + hjelper-base/opptak/språkkrav | `besok/bli-medarbeider.html:194` → `hjelper-registrering.js:9` |
| a-periferi | A3 landing, A4 innlogging, A10 klage, A11 SQL-generator | `besok/index.html:185`; `verktoy/lag-skjema.js:16` |
| b-klarhet | B1 → B2 → B3 + B4 guide, B5 språk | `klarhet.html:211` → `klarhet-skjerm.js:10` |
| c-senior-bestilling | C2 med PP_AKUTT og PP_PRIS | `trenger-hjelp.html:322` → `bestilling.js:6` |
| c-hjelper-og-tavle | C3 registrering v1 + C4 tavle/matching | `bli-hjelper.html:538`; `oppdrag.html:156` → `tavle.js:9` |
| c-info-og-drift | C1 infosider + C5 driftskonsoll | `index.html:332` → `app.js:4`; `drift.html:136` |
| d-regelmoduler | D1–D10 som avhengighetskart, ikke flyt | modulhodene |

Detaljene per feature (inngangspunkter med linjenumre, kjernefiler,
globaler) står i oppdagelsesrapporten og gjentas ikke her; diagrammene i
`01-flowcharts/` bærer dem videre node for node.
