# Flyt C: Senior-bestillingsflyten (markedsplass-v2-grunnlaget)

> Skrevet for markedsplassen. Siden `trenger-hjelp.html` og modulene under hører til
> markedsplass-grunnlaget, ikke B2B-produktet vi selger nå. Kartlagt fordi
> akuttvurderingen og pris-før-bestilling-prinsippet gjenbrukes.

**Inngang:** `trenger-hjelp.html` laster `akutt.js` (linje 320), `pris.js` (linje 321)
og `bestilling.js` (linje 322). Hele flyten er én IIFE i `bestilling.js` som starter
med `visPanel(1)` (`bestilling.js:380`). Demo: ingen ekte bestilling opprettes, ingenting
lagres.

## Flytdiagram

```mermaid
flowchart TD
    Start([Sidelast<br/>trenger-hjelp.html:322]) --> Init[visPanel 1<br/>bestilling.js:39-51,380]

    Init --> P1[Steg 1: Når?<br/>trenger-hjelp.html:53-82]
    P1 --> ValgNar[knyttValg nar<br/>bestilling.js:76-80]
    ValgNar -->|planlagt / fast| Tidsfelt[Vis dato/klokkeslett-felt<br/>trenger-hjelp.html:75-81]
    ValgNar --> N1[Fortsett → visPanel 2<br/>bestilling.js:297-303]
    Tidsfelt --> N1

    N1 --> P2[Steg 2: Hva?<br/>trenger-hjelp.html:85-126]
    P2 --> ValgOppg[knyttValg oppgave<br/>bestilling.js:81]
    P2 -.->|valgfri fritekst, blur| Blur[sjekkAkutt<br/>bestilling.js:174-177]
    P2 -.->|stemme| Stemme[SpeechRecognition onresult<br/>bestilling.js:218-254]
    Stemme --> SjekkStemme{sjekkAkutt tekst?<br/>bestilling.js:237}
    SjekkStemme -->|stopp| Rod
    SjekkStemme -->|ok| Tolk[tolkTekst → velgOppgave<br/>bestilling.js:199-212]
    Tolk --> ValgOppg

    ValgOppg --> N2{Fortsett:<br/>sjekkAkutt beskrivelse<br/>bestilling.js:298-301}
    Blur --> N2
    N2 -->|rødt: stopp| Rod[Nødvarsel: ring 113/110/112<br/>trenger-hjelp.html:32-37<br/>bestilling.js:128-137]
    N2 -->|gult: varsel, fortsett| Gul[Gul-varsel legevakt 116 117<br/>trenger-hjelp.html:40-50<br/>bestilling.js:122-126]
    N2 -->|ingen| P3
    Gul --> P3[Steg 3: Hvor lenge + språk + fast hjelper<br/>trenger-hjelp.html:129-162]
    Rod -.->|«ikke akutt» – gjelder kun avvist tekst| NodLukk[nod-lukk → avvistTekst<br/>bestilling.js:140-143]
    NodLukk -.-> P2

    P3 --> ValgTimer[knyttValg timer<br/>bestilling.js:82] --> N3[Fortsett → visPanel 4<br/>bestilling.js:297-303]

    N3 --> P4[Steg 4: Pris og bekreft<br/>trenger-hjelp.html:165-234]
    P4 --> Pris[visPris → PP_PRIS.beregn<br/>bestilling.js:273-293 → pris.js:43-79]
    P4 --> HastVis{oppdaterHasteport:<br/>PP_AKUTT.kreverHasteport nar<br/>bestilling.js:150-155 → akutt.js:101-103}
    HastVis -->|nar = «nå»| Hasteport[Hasteport: bevissthet og pust?<br/>trenger-hjelp.html:170-189<br/>bestilling.js:157-172]
    P4 --> Innsyn[Innsynsvalg for familien<br/>standard: ingen<br/>trenger-hjelp.html:210-233]

    Pris --> Bestill{Bestill hjelp<br/>bestilling.js:342-364}
    Innsyn --> Bestill
    Bestill -->|sjekkAkutt rødt| Rod
    Bestill -->|hasteport ubesvart| Hasteport
    Hasteport -->|hasteportStopper: svar ≠ ja<br/>akutt.js:105-109| Rod
    Hasteport -->|svar = ja| Bestill
    Bestill -->|ok| P5[Søker: visPanel 5 + kjorSok 0<br/>bestilling.js:362-363]

    P5 --> Sok[kjorSok: 4 simulerte steg via setTimeout<br/>fast hjelper → nærhet → verifisering<br/>bestilling.js:313-334]
    Sok -->|uten fast hjelper: hopper over steg 0<br/>bestilling.js:328-331| Sok
    Sok --> P6[Hjelper funnet: Sofia<br/>trenger-hjelp.html:246-276]

    P6 -->|«Ja, det passer fint»| Bekreft[bekreft-hjelper: varsel-status ← INNSYNSTEKST<br/>bestilling.js:336-340,366-371]
    P6 -->|«Jeg vil ha en annen»| Annen[annen-hjelper: fastHjelper=false<br/>kjorSok 1<br/>bestilling.js:373-377] --> Sok
    Bekreft --> P7([Bekreftet: «Alt er avtalt»<br/>trenger-hjelp.html:279-292])

    subgraph Eksterne avhengigheter
        E1[PP_AKUTT: vurder, kreverHasteport,<br/>hasteportStopper – ren modul, ingen DOM<br/>akutt.js:20-119]
        E2[PP_PRIS.beregn: satser per land,<br/>hastetillegg, oppgavefaktor, minstepris<br/>pris.js:5-82]
        E3[Nettleser-API: SpeechRecognition /<br/>webkitSpeechRecognition<br/>bestilling.js:185]
        E4[app.js: felles sideoppsett,<br/>ikke del av flytlogikken<br/>trenger-hjelp.html:319]
    end
```

## Hvor PP_AKUTT avbryter

`sjekkAkutt()` (`bestilling.js:114-138`) kalles fire steder og kan stoppe flyten:

1. **Blur på fritekst** (`bestilling.js:174-177`) – varsler, men blokkerer ikke navigasjon direkte.
2. **Fortsett fra steg 2** (`bestilling.js:298-301`) – rødt nivå returnerer `true` og stopper `visPanel`.
3. **Stemmeresultat** (`bestilling.js:237`) – rødt nivå hopper over intensjonstolkningen.
4. **Bestill-knappen** (`bestilling.js:345-346`) – siste kontroll, fordi teksten kan ha endret seg.

I tillegg to tekstuavhengige porter ved bestilling (`bestilling.js:348-359`):
hasteporten kreves ved hastegrad «nå» (`akutt.js:101-103`), og alt annet enn et
uttrykkelig «ja» stopper (`akutt.js:105-109`). Nivåene: RØDT stopper
(`akutt.js:24-52`), GULT spør men slipper videre (`akutt.js:55-64`). Avvisning av
et rødt varsel gjelder bare nøyaktig den avviste teksten (`avvistTekst`,
`bestilling.js:100,129-132,140-143`) – ikke resten av økten.

## Sideeffekter

- **Ingen lagring**: verken localStorage, `api.js` eller nettverk. Hele tilstanden er
  `valg`-objektet i minnet (`bestilling.js:15-25`); siden lastes på nytt → alt borte.
- **DOM**: panelbytte via `hidden` (`visPanel`), prislinjer skrives med `innerHTML`
  (`bestilling.js:291`), stemmetekst med `innerHTML` (`bestilling.js:233` – transkriptet
  interpoleres uescapet, lav risiko men verdt å merke).
- **Scroll**: `window.scrollTo` ved panelbytte (`bestilling.js:50`), `scrollIntoView`
  ved nød- og hasteportvarsler (`bestilling.js:136,167,351,356`).
- **Timere**: `kjorSok` simulerer matching med `setTimeout`-kjede (`bestilling.js:313-334`).
- **Mikrofon**: slås på kun ved trykk, av ved `onend` (`bestilling.js:218-254`).

## Feilgrener (kort)

- **Ingen `main .wrap`**: hele modulen returnerer stille (`bestilling.js:9-10`).
- **Tale ikke støttet**: knappen deaktiveres med henvisning til telefon (`bestilling.js:214-216`).
- **Talefeil** (`onerror`): melding «prøv igjen eller bruk knappene» (`bestilling.js:247-249`).
- **Neste uten valg**: `oppdaterNeste` holder knappen `disabled` (`bestilling.js:53-59`).
- **Ukjent land/oppgave i pris**: faller tilbake til `LAND.NO` / faktor 1; timer
  klemmes til minst 0,5 (`pris.js:44-50`).

## Kilder

| Fil | Linjeområde | Rolle |
|---|---|---|
| `/home/user/BETA-ART/trenger-hjelp.html` | 32-50 (varsler), 53-234 (steg 1-4), 170-189 (hasteport), 236-292 (søk/funnet/bekreftet), 319-322 (script-lasting) | Skjermene, 7 paneler |
| `/home/user/BETA-ART/assets/js/bestilling.js` | 1-381 (hele, lest i sin helhet) | Flytstyring, kobling til PP_AKUTT/PP_PRIS |
| `/home/user/BETA-ART/assets/js/akutt.js` | 24-52 (RØDT), 55-64 (GULT), 76-87 (`vurder`), 101-109 (hasteport) | Ren akuttvurdering, `window.PP_AKUTT` |
| `/home/user/BETA-ART/assets/js/pris.js` | 8-29 (satser/faktorer), 43-79 (`beregn`) | Pris før bestilling, `window.PP_PRIS` |

**Funksjonsnavn:** `visPanel`, `oppdaterNeste`, `knyttValg`, `sjekkAkutt`,
`oppdaterHasteport`, `tolkTekst`, `velgOppgave`, `erKveld`, `erHelg`, `visPris`,
`kjorSok`; `PP_AKUTT.vurder`, `PP_AKUTT.kreverHasteport`, `PP_AKUTT.hasteportStopper`;
`PP_PRIS.beregn`, `PP_PRIS.formater`.

## Tillitsnotat og hull

**Tillit: høy.** Alle fire kildefiler er lest i sin helhet; linjereferansene er tatt
direkte fra filene, ikke fra søketreff. Flyten er ikke kjørt i nettleser – diagrammet
bygger på statisk lesing, men koden er liten og uten indireksjon.

**Hull:**
- `app.js` er ikke lest (antatt felles sideoppsett; flyten refererer den ikke).
- Fritekstfeltet (`beskrivelse`) går ikke gjennom `PP_VERN.sjekk()` – konsistent med at
  ingenting lagres i denne demoflyten, men et gap hvis flyten kobles til `api.js` senere.
- Panelet «Hjelper funnet» er hardkodet (Sofia, kode 4821, ankomsttid) – matching,
  betalingsreservasjon og familievarsling finnes ikke bak `kjorSok`.
- `erHelg`/`erKveld` leses ved `visPris`-tidspunktet; endres dato etterpå uten å gå
  tilbake til steg 4, vises ikke ny pris (ikke mulig i dagens UI, men verd å vite).
