# KI-brief – gjenbrukbar kontekst for arbeid med Naviar Care

Lim dette inn i enhver KI-samtale (Claude, ChatGPT, Gemini, andre) før
arbeid som gjelder Naviar. Formålet er at hvert verktøy arbeider innenfor
samme grenser, slik at det ikke oppstår parallelle sannheter. Kilden er
repoet andersenbetul-alt/BETA-ART; ved motstrid vinner repoet.

## Hva Naviar Care er

B2B-programvare for små leverandører av praktisk hjelp til eldre som bor
hjemme: besøksbekreftelse, fast tjenestekatalog, tildeling med
forklarbar matching, og melding til familien om at besøket ble utført.
Naviar er databehandler; leverandøren er behandlingsansvarlig og
arbeidsgiver.

**Naviar er ikke:** en helsetjeneste, en nødtjeneste, en arbeidsgiver for
hjelperne, eller en åpen markedsplass. Kjerneløftet til familien:
«Når du ikke kan være der.»

## Grensene – aldri bygg, aldri foreslå bygget

1. Helsehjelp: medisinering, stell, sårbehandling, vurdering av helsetilstand
2. Håndtering av penger, PIN, BankID eller verdisaker
3. Løpende posisjonssporing, bilder fra hjemmet, lydopptak
4. Automatiske avgjørelser med store følger uten at et menneske ser dem

En grense er fravær av kode, ikke et flagg. Digital hjelp er veiledning,
aldri håndtering. Den eldre møter aldri BankID som krav. Fødselsnummer
lagres aldri.

## Tjenestene i pilot v1

Fire faste oppgaver, hver med egen aldri-liste: besøk og samvær, digital
hjelp, lett hjemmehjelp, hent og lever. Fritekst-bestilling finnes ikke;
etterspørsel oppretter aldri en kategori. Grønn oppgave kan tildeles
automatisk, gul krever menneskelig godkjenning.

## Marked og situasjon

Norge, pilotfase. Kundene er leverandører; sluttbrukerne er eldre,
familier (ofte voksne barn i annen by) og hjelpere. Konkurransebildet:
Birdie/Nursebuddy (journaltunge fagsystemer), Papa (companionship),
Nyby (frivillighet), Jointly (familiekoordinering). Differensiering:
personvern håndhevet av datamodellen, eldre-først-design, forklarbar
matching, og at vi er den bevisst ikke-kliniske halvparten av markedet.
Teknisk: statisk HTML/CSS/JS uten avhengigheter, 491 tester, alt på norsk.

## Regler for KI-samarbeid

- **Én kilde:** repoet er sannheten. Lag aldri en parallell versjon av
  logo, tekster, priser eller regler – foreslå endringer mot repoet.
- **Ingen funnede kilder:** en paragraf, dom eller statistikk som ikke er
  verifisert, merkes som uverifisert. «Kom ikke fram» og «ingen treff» er
  forskjellige svar.
- **Si «virker» bare etter kjørte tester,** og ta med tallet.
- **Menneskelige avgjørelser forblir menneskelige:** navn/merke, priser,
  juridiske konklusjoner, ansettelser, alt på ALDRI-lista i
  besok-agenter.js.
- **Personvern i alt:** ingen personopplysninger fra annonser, kandidater
  eller kunder inn i dokumenter; helse og privatliv aldri i grunnlag.

## Åpne beslutninger (per 25.08.2026)

Varemerket er under legal clearance hold. Vercel-produksjon venter på
eierens godkjenning. Plattformarbeidsdirektivet og KI-forordningens
høyrisikospørsmål ligger hos advokat. Prismodellen er utkast, ikke vedtak.
