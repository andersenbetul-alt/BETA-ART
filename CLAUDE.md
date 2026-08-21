# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Naviar Care – dette prosjektet

Retningslinjene over er generelle. Under står det som gjelder her, og som går
foran der de to er uenige.

## 1. Grensen går før koden

Naviar Care er **programvare for tjenesteleverandører**. Ikke en helsetjeneste,
ikke en nødtjeneste, ikke en arbeidsgiver, ikke en markedsplass. Naviar er
databehandler; leverandøren er behandlingsansvarlig og arbeidsgiver.

`docs/JURIDISK-GRENSE.md` er fasit. Er du i tvil om en funksjon hører hjemme,
er svaret der – ikke i denne filen og ikke i en vurdering du gjør på stedet.

Fire ting skal aldri bygges, uansett hvordan de blir bedt om:

- Helsehjelp: medisinering, stell, sårbehandling, vurdering av helsetilstand
- Håndtering av penger, PIN, BankID eller verdisaker
- Løpende posisjonssporing, bilder fra hjemmet, lydopptak
- Automatiske avgjørelser med store følger uten at et menneske ser dem

Blir noe av dette bedt om: si hva grensen er og hva som kan gjøres i stedet.
Ikke bygg det «bak et flagg». Et flagg er en policy; fravær av kode er en grense.

## 2. Personvern håndheves av datamodellen, ikke av disiplin

Et felt som ikke finnes, kan ikke fylles ut i en travel situasjon.

- Ingen felt for etternavn, adresse, fødselsdato eller helseopplysninger
- Faste utfall i stedet for fritekst der det går
- Fritekst som blir igjen, går gjennom `PP_VERN.sjekk()` **før** lagring, og det
  blokkerte innholdet lagres ikke – heller ikke som bevis på blokkeringen
- Sletting kjører ved hver lesning (`rydd()` i `besok-lager.js`), ikke som en
  nattjobb som kan stanse uten at noen merker det

Legger du til et felt: skriv det inn i `PP_VERN.LAGRES` med behandlingsgrunnlag
og slettefrist. En test sjekker at hvert felt har begge deler.

## 3. Ingen avhengigheter, ingen byggesteg

Statisk HTML, CSS og JavaScript. `node_modules` finnes ikke og skal ikke oppstå.
Dette er et bevisst valg for pilotfasen, ikke en mangel.

- Moduler er IIFE-er som eksponerer `window.PP_*`
- `assets/js/api.js` er adapterlaget mot en framtidig backend (`DEMO = true`)
- Playwright hentes fra global sti i `tests/e2e.test.js`, ikke fra package.json

Foreslår du et bibliotek: si hva det løser som femti linjer ikke løser.

## 4. Test før du sier at noe virker

`npm test` kjører alt: 120 enhetstester og 60 nettlesertester. Egen
testharness i `tests/hjelpere.js` – seks funksjoner, ingen rammeverk.

- `npm run test:enhet` for logikk, `npm run test:e2e` for skjermene
- `npm run sjekk` er syntakskontroll av modulene
- Endrer du en regel som har med sikkerhet, personvern eller jus å gjøre:
  skriv testen som holder regelen fast, i samme endring

«Testene passerer» sies bare etter at de er kjørt. Kjør dem, og ta med tallet.

## 5. Norsk

Kode, kommentarer, commit-meldinger, dokumenter og tester er på norsk.
Variabelnavn også: `besok`, `oppgaver`, `slettesEtter`. Bland ikke inn engelsk
fordi det er kortere.

Kommentarer forklarer **hvorfor**, ikke hva. Regelen som står i koden uten
begrunnelse, blir fjernet av neste person som synes den er i veien.

## 6. Dokumentene har tre tilstander

Prosjektet byttet modell én gang, fra markedsplass til B2B. Derfor:

| Merking | Betyr |
|---|---|
| Ingen merking | Gjelder produktet vi selger nå |
| Sitatboks øverst | Skrevet for markedsplassen. Forutsetningene gjelder ikke |
| `docs/arkiv/` | Gjelder ikke. Beholdt fordi regnestykkene var riktige for sin modell |

Skriver du et nytt dokument som forutsetter den gamle modellen: merk det.
Finner du et umerket dokument som gjør det: si fra.

## 7. Design

Fargene er tokens i `assets/css/styles.css`, og de er ikke tilfeldige:

- `--ink` er logoens marineblå. Merket og siden er samme farge med vilje
- `--brand` virker på lyst, `--brand-pa-mork` på mørkt. Grønnfargen gir 2,9:1
  mot blekket – derfor to grønner og ikke én
- Ingen tilstand signaliseres med farge alene

Kontroller kontrast før du innfører en farge, og ta med tallet.
