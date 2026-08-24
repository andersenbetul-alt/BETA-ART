# Flytskisser C – Infosidene og driftskonsollen

Pathfinder fase 1, 2026-08-24. To skisser: felles skript for informasjonssidene
(`app.js`) og driftskonsollen (`drift.js` + `driftdata.js`).

## Kilder

| Fil | Linjeområde | Rolle |
|---|---|---|
| `assets/js/app.js` | 1–118 (hele) | Felles: årstall, mobilmeny, samtykke |
| `index.html` | 305–330 (banner), 332 (script) | Forside med samtykkebanner |
| `trygghet.html` | 313, 331 | Banner + app.js |
| `personvern.html` | 234, 252 | Banner + app.js |
| `familie.html` | 255 | Kun app.js – **ingen banner** |
| `drift.html` | 110–128 (kpi/kø/logg-DOM), 134–136 (script) | Konsollens skall |
| `assets/js/drift.js` | 1–321 (hele) | Køer, handlinger, logg |
| `assets/js/driftdata.js` | 1–114 (hele) | `window.PP_DRIFT_DATA`, testdata |

## Del 1: Infosidene – app.js

`app.js` er én IIFE uten eksponert API. Tre uavhengige deler: årstall i
bunntekst, mobilmeny og samtykke til informasjonskapsler.

```mermaid
flowchart TD
    SIDER["index.html:332 / familie.html:255<br/>trygghet.html:331 / personvern.html:252<br/>script defer"] --> IIFE["IIFE start<br/>app.js:4"]

    IIFE --> AAR["Årstall i [data-year]<br/>app.js:10-12"]

    IIFE --> NAV{".nav-toggle + #hovedmeny<br/>finnes?<br/>app.js:15-16, 29"}
    NAV -->|ja| NAVSTATE["applyNavState<br/>app.js:18-27<br/>≤860px: skjul meny<br/>ellers: vis, aria-expanded=false"]
    NAVSTATE --> KLIKK["klikk på toggle<br/>app.js:30-34<br/>veksler hidden + aria-expanded"]
    NAVSTATE --> RESIZE["resize → applyNavState<br/>app.js:35"]

    IIFE --> BANNER{"#cookie-banner finnes?<br/>app.js:43, 82"}
    BANNER -->|"nei (familie.html m.fl.)"| INGEN["ingen samtykkelogikk kjører<br/>data-analytics/-marketing settes aldri"]
    BANNER -->|ja| LES["readConsent<br/>app.js:45-52<br/>localStorage: pp_cookie_consent_v1"]
    LES -->|"lagret (JSON ok)"| APPLY["applyConsent<br/>app.js:64-68<br/>html.dataset.analytics/marketing = on/off"]
    LES -->|"null / JSON-feil / privat modus<br/>app.js:49-51"| VIS["openBanner<br/>app.js:70-80<br/>fyll avkrysning fra ev. lagret valg"]

    VIS --> VALG{"klikk [data-cookie]<br/>app.js:90-108"}
    VALG -->|"all<br/>app.js:97-98"| SAVE["saveConsent<br/>app.js:54-62"]
    VALG -->|"necessary<br/>app.js:99-100"| SAVE
    VALG -->|"selected<br/>app.js:101-106<br/>leser #cookie-analytics/-marketing"| SAVE
    SAVE --> LAGRE["localStorage.setItem<br/>pp_cookie_consent_v1<br/>{necessary:true, analytics, marketing,<br/>timestamp, version:1}<br/>app.js:59"]
    LAGRE -.->|"kastes (privat modus)<br/>app.js:60<br/>kun nødvendige gjelder"| APPLY
    LAGRE --> APPLY
    SAVE --> SKJUL["banner.hidden = true<br/>app.js:107"]

    IIFE --> TREKK["klikk [data-open-cookie-settings]<br/>i bunntekst<br/>app.js:112-117"] --> VIS
```

**Sideeffekter (del 1):**
- `localStorage`-nøkkel: `pp_cookie_consent_v1` – JSON med `necessary` (alltid
  `true`), `analytics`, `marketing`, `timestamp` (ISO), `version: 1`
  (app.js:54–59). Tre kategorier; nødvendige kan ikke velges bort
  (index.html:313, app.js:55).
- DOM: `document.documentElement.dataset.analytics/marketing` settes til
  `on`/`off` (app.js:66–67) – kroken for framtidige sporingsskript; ingen
  sporing lastes i dag.

**Feilgrener:** `localStorage`-lesing og -skriving er pakket i try/catch –
korrupt JSON gir `null` (banner vises på nytt), skrivefeil i privat modus
svelges og kun nødvendige gjelder (app.js:49–51, 60).

## Del 2: Driftskonsollen – drift.js + driftdata.js

`driftdata.js` må lastes før `drift.js` (drift.html:135–136); den eksponerer
`window.PP_DRIFT_DATA` med `ALVOR` (P1–P4 med frister 15/60/1440/4320 min,
driftdata.js:13–18), `hendelser`, `soknader`, `aktiveOppdrag`,
`betalingssaker` og `referansesporsmal`. Alt er testdata i minnet – ingenting
lagres, og refresh nullstiller.

```mermaid
flowchart TD
    HTML["drift.html:134-136<br/>app.js → driftdata.js → drift.js"] --> DATA["window.PP_DRIFT_DATA<br/>driftdata.js:9-114<br/>ALVOR P1-P4 + testdata"]
    DATA --> START["oppstart<br/>drift.js:319-320<br/>tegnKpi() + visKo('hendelser')"]

    START --> KPI["tegnKpi<br/>drift.js:69-93<br/>åpne, P1, fristbrudd, varsler, søknader<br/>→ #kpi-rad + kø-tellere"]
    START --> VISKO["visKo(navn)<br/>drift.js:249-254<br/>innhold.innerHTML = KOER[navn]()"]

    MENY["klikk #ko-meny [data-ko]<br/>drift.js:256-259"] --> VISKO
    VISKO --> H["tegnHendelser<br/>drift.js:97-128<br/>sort: alvor, så eldst<br/>frist vises også når brutt"]
    VISKO --> S["tegnSoknader<br/>drift.js:130-180<br/>6 steg + referansesjekk<br/>godkjenn disabled ved mangler"]
    VISKO --> O["tegnOppdrag<br/>drift.js:182-202<br/>tabell, varsel-rader"]
    VISKO --> B["tegnBetaling<br/>drift.js:204-218<br/>auto-frigi etter 48 t (tekst)"]
    VISKO --> R["tegnRutiner<br/>drift.js:220-239<br/>ALVOR-tabell + eskaleringsstige"]

    H --> FRIST{"fristBoks<br/>drift.js:44-51"}
    FRIST -->|"igjen < 0"| BRUTT["klasse 'brutt':<br/>Frist oversittet med …"]
    FRIST -->|"≤ 25 % igjen"| SNART["klasse 'snart'"]

    KNAPP["klikk [data-handling] i #ko-innhold<br/>drift.js:310-316<br/>disabled ignoreres"] --> HAND{"HANDLING<br/>drift.js:263-300"}
    HAND -->|"frys (kun P1-knapp)<br/>drift.js:118-120, 264-269"| FRYS["status='under_arbeid'<br/>logg: konto fryst"]
    HAND -->|ta| TA["status='under_arbeid'<br/>drift.js:270-273"]
    HAND -->|kontakt| KONTAKT["kun loggføring<br/>drift.js:275-277"]
    HAND -->|lukk| LUKK["status='lukket'<br/>drift.js:279-282"]
    HAND -->|"godkjenn (krever alle steg)<br/>drift.js:284-288"| GODKJENN["soknader.splice(i,1)<br/>logg: nivå 1 + prøveperiode"]
    HAND -->|etterspor| PURR["kun loggføring<br/>drift.js:290-292"]
    HAND -->|avslag| AVSLAG["soknader.splice(i,1)<br/>logg: begrunnelse + klageadgang<br/>drift.js:294-298"]

    FRYS & TA & KONTAKT & LUKK & GODKJENN & PURR & AVSLAG --> LOGG["loggfor<br/>drift.js:60-65<br/>unshift → #logg-liste<br/>kun i minnet"]
    LOGG --> OPPD["tegnKpi() + visKo(ko)<br/>drift.js:314-315"]
```

**Sideeffekter (del 2):** Ingen. All tilstand (`logg`, statusendringer,
`splice` av søknader) lever i minnet i `D`-objektet; ingen `localStorage`,
ingen nettverkskall. All tekst escapes med `esc()` (drift.js:24–28) før
`innerHTML`.

**Feilgrener:** Tomme køer gir «Ingen åpne hendelser» / «Ingen søknader i kø»
(drift.js:99, 131). Godkjenn-knappen er `disabled` til alle seks steg er
fullført (drift.js:168–169), og klikk på disabled ignoreres (drift.js:312).
Oversittet frist er en synlig tilstand, ikke en feil (drift.js:47–48).

## Konkrete funn

1. **Banner mangler på familie.html** (og trenger-hjelp.html, oppdrag.html,
   besok/index.html): sidene laster `app.js`, men uten `#cookie-banner`
   hopper hele samtykkeblokken over (app.js:82). Konsekvens:
   `data-analytics`/`data-marketing` settes aldri på disse sidene, selv når
   samtykke er lagret fra forsiden. Ufarlig i dag (ingen sporing lastes), men
   en felle den dagen kroken i app.js:65 tas i bruk.
2. **`finnSoknadIndeks` kan gi -1** (drift.js:305–308); `godkjenn`/`avslag`
   ville da gjort `splice(-1,1)` og fjernet feil søknad. Kan ikke inntreffe
   via UI-et (id kommer fra `data-id` i samme render), men er en latent felle
   ved gjenbruk. Tilsvarende gir `finnHendelse` `undefined` ved ukjent id.
3. **Drift-konsollen er ren demo**: handlingene endrer bare testdata i minnet;
   loggen tømmes ved refresh. Konsistent med `DEMO = true`-linjen i
   prosjektet, men verdt å merke i fase 2.
4. Samtykkeversjonering finnes (`version: 1` i nøkkelen `pp_cookie_consent_v1`),
   men ingen kode leser versjonen ennå – re-samtykke ved regelendring må
   bygges når det trengs.

## Tillitsnotat

Høy tillit: `app.js` (118 linjer), `drift.js` (321 linjer) og `driftdata.js`
(114 linjer) er lest i sin helhet; HTML-koblingene er verifisert med søk over
alle `.html`-filer.

**Hull:**
- Skissene er statisk lest, ikke kjørt i nettleser – rekkefølgeavhengigheten
  driftdata.js → drift.js er verifisert i markup, ikke i kjøring.
- CSS-klassene (`brutt`, `snart`, `p1`–`p4`) er ikke sjekket mot
  `assets/css/styles.css`.
- `bli-hjelper.html` har også banner + app.js (linje 518/536), men sidens
  eget innhold er ikke kartlagt her – den hører til en annen skisse.
- `docs/DRIFT.md` (rutinene konsollen henviser til, drift.js:237) er ikke
  lest; skissen dekker koden, ikke rutinedokumentet.
