# Tjenestedesign

`docs/SERVICE-BLUEPRINT.md` er skrevet for markedsplassmodellen og har sin
egen advarsel øverst. Dette dokumentet beskriver tjenesten vi selger nå. Det
er hentet fra koden, som er fasit – ikke fra en presentasjon.

## Setningen alt henger på

> Naviar Care er en programvaretjeneste som hjelper verifiserte
> tjenesteleverandører med å planlegge, dokumentere og varsle om praktiske
> besøk utført av leverandørens egne ansatte.

Naviar er ikke arbeidsgiver, ikke leverandør av helsehjelp, ikke en
nødtjeneste, ikke faglig ansvarlig for medarbeiderne, og ingen erstatning for
leverandørens ansvar. `docs/JURIDISK-GRENSE.md` er fasit når noe er i tvil.

## To tjenester, ett merke

| | Besøksbekreftelse | Klarhet 45 |
|---|---|---|
| Hvem betaler | Leverandøren | Familien eller den eldre |
| Hva selges | Programvare til å planlegge og dokumentere besøk | Én samtale på 45 minutter, 599 kr |
| Løftet | «Ett besøk. Én bekreftelse. Alle vet det.» | «Én samtale. Tre tydelige neste steg.» |
| Status | I drift som pilot | Betaling sperret i `betaling.js` til fire punkter er avklart |

Klarhet har tre pilotkategorier og ikke flere: **NAV og pensjon**, **Kommune
og omsorg**, **Digital offentlig hjelp**. Legekonsultasjon er tegnet, beskrevet
og bevisst **ikke bygget** – `LEGEKONSULTASJON.bygges = false`. Vurdering av
symptomer er helsehjelp, og da er vi noe annet enn programvare.

## De tre menneskene, og hvorfor de har hver sin dør

Dette er den viktigste designbeslutningen i tjenesten, og den er lett å rive
ned uten å merke det.

| Hvem | Tilgang | Hvorfor akkurat sånn |
|---|---|---|
| Kontoret | E-postinnlogging | En konto, en arbeidsdag, mange besøk |
| Hjelperen som søker | Telefon + engangskode | Verifiserer at nummeret er hennes, én gang |
| **Arbeideren på oppdrag** | **Lenke per besøk. Ingen konto** | Tilgang til ett besøk, ikke til et forhold |

Arbeiderlenken dør etter tolv timer. Gir vi henne en konto, blir tilgangen
varig, og et oppdrag blir en relasjon systemet må vedlikeholde.

## Hovedløpet

```
Kontoret oppretter et besøk
  → kunde er fornavn eller kundenummer. Etternavn og adresse finnes ikke som felt
  → oppgaver velges fra faste kategorier. Helseoppgaver står ikke i lista
  → beskjed til arbeideren går gjennom PP_VERN før den lagres
  → arbeiderlenke genereres, gyldig i tolv timer

Arbeideren åpner lenken
  → fem faste utfall, ikke fritekst: alt gjort / noe gjort / fikk ikke gjort
     / familien bør kontaktes / kontoret bør ringe
  → kort melding er valgfri, og går gjennom samme sperre
  → sendes inn

Familien får vite hva som ble gjort
  → ikke hvor noen er. Ingen posisjon, ingen bilder, ingen lyd
```

Og for Klarhet:

```
behov → ekspert → tid → tre steg
  → den eldre godkjenner selv, uten forhåndsvalgt knapp
  → nei krever ingen begrunnelse, og lagres som nei
  → ingen purring
```

## Fire designregler som holder tjenesten sammen

**Feltet som ikke finnes, kan ikke fylles ut.** Personvern håndheves av
datamodellen, ikke av disiplin. Det er ingen kolonne for etternavn, adresse,
fødselsdato eller helseopplysninger – heller ikke i den genererte
SQL-en. Femten ting står i `LAGRES_ALDRI`.

**Faste utfall der det går.** Fritekst er den delen som bærer noe personlig.
Der den blir igjen, går den gjennom `PP_VERN.sjekk()` – 73 ord i fire
kategorier, pluss et mønster for lange tallrekker. Åtte siffer slipper
gjennom; det er et telefonnummer. Elleve stoppes. Det blokkerte innholdet
lagres ikke, heller ikke som bevis på blokkeringen.

**Sletting skjer ved lesning.** Fire trinn: lenken etter tolv timer, friteksten
etter sju dager, navnene etter tretti, resten etter et år. En sletterutine som
ikke kjører, er ikke en sletterutine.

**Ingen tilstand signaliseres med farge alene.** Utført er ikke «det grønne
feltet» – det er et felt med ✓ og ordet «Utført».

## Designet for dem som skal bruke det

Målgruppa er eldre og pårørende mellom 40 og 70. Det avgjør målene, ikke
smaken:

- WCAG AA sitt kontrastkrav på 4,5:1 er utledet som 3:1 × 1,5 for synsstyrken
  til en åtti år gammel. AA har altså null margin for våre brukere. AAA på
  7:1 er den ansvarlige interne grensa
- Trykkflater: 96 px på den eldres skjerm. WCAG krever 24. Førtifire treffes
  ikke av en hånd som skjelver
- Skriftstørrelser i `rem`, aldri `px`. En `px`-satt brødtekst ignorerer
  brukerens egen skriftinnstilling fullstendig
- Ingen side flyter vannrett ved 200 % skrift. Norsk brekker der engelsk ikke
  gjør det: «funksjonsnedsettelse» får ikke plass på en telefon
- Alle førti feilmeldinger har `role="alert"`. En sperre uten alternativ blir
  omgått, og for den som ikke ser skjermen fantes alternativet aldri
- LIX-grense per teksttype, målt i testene: 35 for en side der et valg tas,
  42 for informasjon, 50 for det juridiske

## Det som aldri skal bygges

Uansett hvordan det blir bedt om:

- Helsehjelp: medisinering, stell, sårbehandling, vurdering av helsetilstand
- Penger, PIN, BankID eller verdisaker
- Løpende posisjonssporing, bilder fra hjemmet, lydopptak
- Automatiske avgjørelser med store følger uten at et menneske ser dem

Blir noe av dette bedt om: si hva grensen er og hva som kan gjøres i stedet.
Ikke bygg det bak et flagg. Et flagg er en policy; fravær av kode er en grense.
