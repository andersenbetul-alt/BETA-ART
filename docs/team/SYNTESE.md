# Syntese – vedtatte beslutninger

Sju roller leverte hver sitt. Der de peker i ulik retning, avgjøres det her.
Hver beslutning sier hva som er valgt, hva som ble valgt bort, og hva den koster.

Grunnlaget: `TJENESTEDESIGN.md`, `TEKNOLOGI.md`, `KI.md`, `OKONOMI.md`, `SALG.md`,
`MARKEDSFORING.md`, `MERKEVARE.md`, `TEKST.md`.

---

## Det som ble klart da tallene ble lagt ved siden av hverandre

Økonomi regnet nullpunktet til **2 843 fullførte oppdrag i måneden**, som ved 2,5
oppdrag per familie tilsvarer rundt **1 140 aktive familier samtidig**.
Markedsføring planla **50 familier på tolv uker**. Rampen i økonomidokumentet når
1 500 opprettede oppdrag i måned 12 — omtrent 1 275 fullførte.

Det er 45 % av nullpunktet. Ingen kombinasjon av avgiftsnivå og vaktvariant lukker
det gapet i én by:

| Grep | Nullpunkt, fullførte/mnd | Pilot mnd 12 dekker |
|---|---|---|
| Dagens modell, vakt 135 000 | 2 843 | 45 % |
| Vakt begrenset til åpningstid (B1) | 2 285 | 56 % |
| Serviceavgift 22 % | 2 022 | 63 % |
| Begge deler | ca. 1 700 | 75 % |

Konklusjonen er ikke at prisen er feil. Den er at **vaktordningen er en
trappetrinnskostnad som først forsvarer seg over flere markeder**, og at en by
alene ikke bærer den.

Derfor er den første og viktigste beslutningen en om hva piloten er.

---

## B0 · Piloten skal ikke gå i balanse, og skal ikke måles som om den skulle det

**Vedtatt.** Piloten er et eksperiment som skal kjøpe retten til å bygge
virksomheten, ikke en virksomhet i miniatyr. Å jage nullpunktet i én by ville
tvunget fram nettopp de grepene tjenesten ikke tåler: høyere pris i den fasen der
betalingsviljen skal bevises, eller lavere verifiseringskrav.

Piloten lykkes hvis fem ting er sanne etter tolv uker per bydel:

| # | Krav | Kilde |
|---|---|---|
| 1 | Fyllingsgrad ≥ 90 % målt uke 9–12 | Markedsføring |
| 2 | ≥ 50 % av familiene bestiller igjen innen 30 dager | Markedsføring |
| 3 | ≥ 60 % av uke 1-hjelperne fortsatt aktive i uke 12 | Markedsføring |
| 4 | Dekningsbidrag ≥ 45 kr per fullført oppdrag | Økonomi |
| 5 | Alle P1-saker besvart innen 15 minutter, null saker med skade | Drift |

Krav 5 er absolutt. Brytes det, stanses piloten uansett hvordan de fire andre står.

**Forutsetning som kom til etter den juridiske gjennomgangen:** piloten starter
ikke før de fire hovedspørsmålene i `JURIDISK-RISIKO.md` er besvart. Ikke fordi
alt må være avklart — det blir det aldri — men fordi disse fire avgjør om modellen
i det hele tatt kan leveres slik den er tegnet.

**Konsekvens for kapital:** 9,6 mill. kr dekker tolv måneder, men balanse nås ikke
innen tolv måneder. Kapitalplanen skal derfor kuttes på nytt for **atten måneder,
med en beslutningsport i måned ni** der de fem kravene avgjør om det hentes mer
eller stanses. Å be om penger til tolv måneder for en plan som trenger atten, er å
programmere inn en krise i måned elleve.

---

## B1 · Åpningstid 07–21, vaktordning 07–23

**Vedtatt.** Oppdrag kan starte tidligst 07:00 og skal være avsluttet 21:00.
Vakten dekker 07:00–23:00, altså åpningstiden pluss to timer.

P1 er *pågående risiko under et oppdrag*. Når ingen oppdrag pågår, kan ingen P1
oppstå fra et oppdrag. Døgnbemanning i piloten ville betalt for en risiko vi ikke
utsetter noen for.

| | Vakt 24/7 (variant 2) | Vakt 07–23 (vedtatt) |
|---|---|---|
| Beredskapstimer per uke | 128 | 72 |
| Kostnad per måned | 135 000 | 106 000 |
| Faste kostnader per måned | 149 000 | 120 000 |
| Nullpunkt, fullførte/mnd | 2 843 | 2 285 |

Besparelse: **351 000 kr i året.**

Dette er en innsnevring av tilbudet, ikke av sikkerheten, og det skal sies slik
utad: *«Vi formidler oppdrag mellom 07 og 21. Utenfor disse timene er det
nødetatene som gjelder, ikke oss.»* Løftet blir sannere, ikke svakere.

Utvides åpningstiden senere, utvides vakten først. Aldri motsatt rekkefølge.

---

## B2 · Serviceavgiften blir stående på 18 % gjennom hele piloten

**Vedtatt.** Økonomi viste at 22 % senker nullpunktet fra 2 843 til 2 022. Det
avgjør likevel ingenting, siden ingen av tallene nås i piloten.

Regnestykket for å heve: 21 kr mer per oppdrag. Ved pilotens volum er det i
størrelsesorden 150 000 kr over året — knapt to prosent av brennraten. Prisen for
å hente dem er 3,7 % høyere kundepris i nøyaktig den fasen der det eneste
resultatet som teller, er om folk vil betale i det hele tatt.

**Avgiften er en skalaknapp, ikke en pilotknapp.** Den vurderes på nytt ved 5 000
fullførte oppdrag i måneden, ikke før.

**Forbehold etter juridisk gjennomgang:** hele prismodellen i `pris.js` er regnet
uten merverdiavgift. Viser det seg at avgiften skal beregnes, endres tallene i
denne beslutningen, ikke resonnementet. Spørsmålet må derfor besvares før prisen
låses utad — se J16.

Salgs gulv på 15 % **stadfestes**, med én tilføyelse: 15 % gis bare mot forpliktet
volum. Kommuneavtaler uten et avtalt minsteantall oppdrag prises på 16 %.

Regel 1 fra `SALG.md` står uendret og er ikke til forhandling: **hjelperens linje
beregnes alltid av `pris.js` og røres aldri.** All rabatt tas fra vår egen margin.

---

## B3 · Bolk A er hele byggelisten fram til første ekte oppdrag

**Vedtatt.** De elleve punktene i `TJENESTEDESIGN.md` Bolk A definerer «klar for
første ekte oppdrag». Ingenting utenfor Bolk A bygges før alle elleve er ferdige.

Tjenestedesign fant kjernen: tre steder er en ferdig beskrivelse forvekslet med en
ferdig tjeneste — verifisering før døra åpnes, oppsyn mens den står åpen, oppgjør
etterpå. Nettstedet lover alle tre. Ingen av dem finnes.

Rekkefølgen låses slik, fordi hvert trinn er en forutsetning for det neste:

| Trinn | Innhold | Hvorfor her |
|---|---|---|
| 1 | G1 konto og identitet | Alt annet henger på den |
| 2 | G2 + G3 oppdrag med mottaker, adresse og ekte matching | Uten oppdrag finnes ingen tjeneste |
| 3 | G8 verifiseringskjeden | Ingen sendes hjem før denne virker |
| 4 | G4 betaling gjennom plattformen | Hindrer kontantoppgjør, DPIA R5 |
| 5 | G15 ekte oppmøtekode og områdekontroll | Beviset på riktig person, riktig sted |
| 6 | G11 overvåking og vaktordning | «P1 innen 15 minutter» blir en tjeneste |
| 7 | G10 SOS og problemmelding | En vei inn når noe går galt |
| 8 | G14 brukervilkår og forsikring | Ingen tar oppdrag på vilkår som ikke finnes |
| 9 | G13 DPIA ferdigstilt og signert | Rekkefølgekrav 1 |

G16 akuttfilter uten omgåelse er **allerede lukket** — se B6.

### Juridiske porter i byggerekkefølgen

Den juridiske gjennomgangen endret rekkefølgen. Fire spørsmål må være besvart før
det trinnet de påvirker, ellers bygger vi noe som må rives:

| Port | Må besvares før | Hvorfor |
|---|---|---|
| J1/J2 samtykke på vegne av en person med svekket kognisjon | Trinn 1, konto | Avgjør hvem som er avtalepart, og dermed hele kontomodellen |
| J16 merverdiavgift | Trinn 2, oppdrag med pris | Kan legge opptil 25 % på en prismodell regnet uten |
| J11 betalingsformidling | Trinn 4, betaling | Avgjør om pengestrømmen kan settes opp slik den er tegnet |
| J6 arbeidsrettslig status | Trinn 4, betaling | Avgjør om 18 % er riktig nivå i det hele tatt |

Portene er ikke rekkefølgekrav vi kan «ta parallelt». Et konto-API bygget på feil
antakelse om hvem som er avtalepart, må skrives om, ikke lappes.

**Konsekvens for planen:** de fire spørsmålene sendes til rådgiver **nå**, før
trinn 1 startes. Svartiden blir dermed en del av byggetiden, ikke et tillegg til den.

---

## B4 · Teknisk arkitektur godkjennes som levert

**Vedtatt.** Node 22 · Fastify 5 · PostgreSQL 16 · håndskrevet SQL uten ORM ·
økter i tabell · drift i EU/EØS på samme opphav som nettstedet.

Det avgjørende argumentet er at `matching.js` skal kjøre uendret på begge sider.
Velges et annet språk, må motoren skrives på nytt, og da blir utakt mellom det
hjelperen får se og det serveren faktisk regnet, bare et spørsmål om tid. En
forklarbar matching som forklarer feil ting, er verre enn ingen forklaring.

Tre punkter stadfestes særskilt:

- **Personvernreglene håndheves av datatyper og skjema, ikke av disiplin.**
  `numeric(6,3)` gjør finere posisjon urepresenterbar. En `CHECK` gjør «et menneske
  stenger kontoen» til en databaseregel. Responsskjema stripper udeklarerte felt,
  så adressen kan ikke lekke ut i en oppdragsliste ved et uhell.
- **Trinn 3 og 4 leveres sammen.** Registrering uten innsyn og sletting er et
  register vi ikke kan tømme.
- **Ni avkryssede punkter og signert DPIA før posisjon settes i drift.** Ingen unntak.

Én tilføyelse: databasen kjøres som **administrert tjeneste**, ikke i egen drift.
Ved pilotens volum er det ingenting å spare på å drifte den selv, og hver time
brukt på databasedrift er en time som ikke går til Bolk A.

---

## B5 · KI-rekkefølgen godkjennes, og listen over hva som ikke skal bruke KI er bindende

**Vedtatt.** Regler først, modell sist. Ingen modell kobles til noe før
gullstandardkorpuset finnes og falske negative måles som blokkerende utrullingsport.

**Bindende: disse skal aldri avgjøres av en modell.**
tillitsscore · utestenging · prissetting · screening av søkere.

Alle fire påvirker noens inntekt eller adgang til arbeid. De skal kunne bestrides
av et menneske overfor et menneske.

Akuttfilteret får ett tillegg utover det KI foreslo: **det skal aldri finnes en
knapp som slår det av for mer enn den teksten brukeren faktisk avviste.** Se B6.

---

## B6 · Akuttfeilen er allerede rettet

**Utført.** KI-gjennomgangen fant en kjede som slo av vernet i praksis:

```
«Kan du bære ut avfallet?»  →  treffer delstrengen «fall»
  →  åpenbart falskt varsel
  →  brukeren trykker det bort
  →  vernet var avslått for hele økten
  →  «hun puster ikke ordentlig» ga deretter ingenting
```

Vurderingen ligger nå i `assets/js/akutt.js` med tre lag — RØDT stopper, GULT
spør, og en hasteport ved «nå» spør om bevissthet og pust uansett hva som er
skrevet. Avvisning gjelder bare den ene teksten. 31 nye tester dekker kjeden.

Lærdommen føres videre som regel: **falske positive i et sikkerhetsfilter er ikke
støy. De er mekanismen som lærer brukeren å slå av vernet.**

---

## B7 · Navnet byttes, men ikke nå — og merket skilles ut med én gang

**Vedtatt.** Merkevare har rett i premisset: «pårørende» kan ikke skrives på
svensk, tysk eller spansk tastatur, betyr ingenting der, og gir et
punycode-domene — en uleselig lenke i en tjeneste som ber familier være skeptiske
til lenker. «Pilot» betyr dessuten prøveprosjekt i alle fire språk.

Men navnebytte tar tre til fire måneder med uttaletest og varemerkegransking, og
det er måneder Bolk A trenger mer.

| Når | Hva |
|---|---|
| Nå | Navne- og varemerkeprosessen startes. Den blokkerer ikke Bolk A |
| Nå | Verifiseringsmerket får **eget navn og egen visuell identitet**, uavhengig av selskapsnavnet |
| Pilot | Lanseres som Naviar i Norge |
| Marked 2 | Nytt paraplynavn på plass før Sverige |

Merket skilles ut først fordi det er det eneste som ikke tåler å byttes to ganger.
Et tillitsmerke som skifter navn har mistet det som gjorde det til et tillitsmerke.

Emoji som merke og logo (🛡️ 🧭) avvikles: de tegnes ulikt på hver enhet og kan
ikke beskyttes rettslig.

---

## B8 · Suksess signaliseres ikke med en egen grønn

**Utført.** Merkevare fant at `--ok` (#1f7a4d) og `--brand` (#1f6f5c) ligger på
**1,13 i kontrast** — praktisk talt samme farge for to ting som betyr ulikt.

Forsøk på å finne en bedre grønn viste hvorfor problemet ikke lot seg løse med en
fargejustering: ingen grønn er samtidig lesbar som tekst på hvitt og tydelig
forskjellig fra en mørk grønn merkevare. Når merkevaren er grønn, er grønn opptatt.

Vedtatt system med tre tilstander:

| Tilstand | Farge | Tilleggssignal |
|---|---|---|
| Som det skal være | merkevarefargen | ✓ |
| Krever oppmerksomhet | `--warn`, oker | ikon eller ord |
| Noe er galt | `--danger`, rød | ikon eller ord |

`--ok` er konsolidert inn i merkevarefargen, og de hardkodede forekomstene av
#1f7a4d i tre filer er byttet til token. **Ingen tilstand signaliseres av farge
alene** — det gjaldt allerede i praksis, og er nå en regel.

---

## B9 · Tekstendringene som gjøres nå

**Vedtatt.** Tre av de 171 forslagene i `TEKST.md` går inn før pilotlansering,
fordi de retter opp ting som er direkte feil, ikke bare kan bli bedre:

1. **Forsidens «Slik fungerer det» forklarer hjelperens registrering** til en leser
   som ville forstå sin egen bestilling. Deles i to: «Slik bestiller du» øverst,
   «Slik blir du hjelper» under.
2. **Verifiseringsløftet og et faktisk pristall mangler over brettkanten.** «Pris
   vises før du bestiller» er en prosessbeskrivelse, ikke et svar på «hva koster det».
3. **I Senior Mode er nei tydeligere vanskeligere enn ja.** «Jeg vil ha en annen»
   er en liten sekundærknapp ved siden av en stor primærknapp, og søkeskjermen har
   ingen utgang. Lik vekt, og «Avbryt søket».

Punkt 3 er ikke en tekstsak. Det er den samme regelen som gjelder posisjon: **å si
nei skal være like lett som å si ja.** At den var brutt i Senior Mode, for den
brukeren som har vanskeligst for å hevde seg, er den alvorligste av de tre.

Resten av forslagene tas etter at Bolk A er ferdig. Alt merket «bekreft før
publisering» i `TEKST.md` skal verifiseres mot faktiske tall før det trykkes.

---

## B10 · Markedsføringsplanen godkjennes, med driftsreglene som bremse

**Vedtatt.** Pilotkorridoren i tre bydeler, oppstart i rekkefølgen mellomledd →
hjelpere → familier, og budsjett på 250 000 kr.

Rekkefølgen er riktig av en grunn som er verdt å skrive ned: sidene har ulik
ledetid. Mellomledd tar tre til seks uker, verifisering av en hjelper ti til
fjorten dager, mens familiesiden er den eneste krana som kan åpnes på timer.
Derfor åpnes den sist.

Driftsreglene er bindende, ikke veiledende:

- Fyllingsgrad under 85 % to uker på rad → **familiemarkedsføring stanses**
- Medianhjelperen under tre oppdrag i uka → **hjelperrekruttering stanses**

Bydelsvalget hviler på en antakelse om 75+-tetthet. Den **skal** verifiseres mot
Oslo kommunes bydelsstatistikk i uke −4, med byttefrist uke −3.

---

## Det som fortsatt er åpent

Disse er ikke avgjort her, fordi de ikke kan avgjøres internt:

| Spørsmål | Hvorfor det ikke kan avgjøres her | Frist |
|---|---|---|
| Hjelpernes arbeidsrettslige status | Avgjør om 18 % i det hele tatt er riktig nivå. Omklassifisering legger ca. 30 % på hjelperlinjen mot 99 kr i avgift | Før Bolk A trinn 4 |
| Hjemmel for politiattest per oppdragskategori | Kan ikke kreves uten hjemmel i lov eller forskrift | Før Bolk A trinn 3 |
| Forsikringsdekning og premie | Forutsetning for G14 | Før Bolk A trinn 8 |
| Skatteplikt ved arbeidsgiverbetalte oppdrag | Salg tar det opp uoppfordret, men svaret må komme utenfra | Før første bedriftsavtale |

Etter at dette ble skrevet, er listen utvidet i `JURIDISK-RISIKO.md` med 21
punkter, og de fire hovedspørsmålene til rådgiver er omprioritert. To av dem var
ikke fanget opp her: **betalingsformidling** — om pengestrømmen i det hele tatt er
lovlig satt opp når vi holder kundens penger i fire dager — og **merverdiavgift**,
som kan legge opptil 25 % på en prismodell regnet uten. I tillegg kom
**samtykke på vegne av en person med svekket kognisjon**, som treffer selve
kjerneproduktet.

Alle går til juridisk rådgiver samlet, ikke enkeltvis.

---

## B11 · Juridisk blir en fast rolle, ikke en gjennomgang

**Vedtatt.** Den juridiske gjennomgangen fant to risikoer ingen av de sju rollene
hadde sett — betalingsformidling og referansepersoner som registrerte — og tre
feil som var feil uansett tolkning. Det er ikke tilfeldig: hver fagrolle ser sitt
eget område, og risikoen samler seg i mellomrommene.

Juridisk legges derfor til som fast rolle i `.claude/agents/`, med samme krav som
de andre: konkrete leveranser, ikke prinsipper.

Tre ting er allerede ført inn i produktet i denne runden, ikke bare i et dokument:

| Funn | Hva som ble bygget |
|---|---|
| J2 utlevering til pårørende | Den eldre velger selv innsynsnivå, og **ingen deling er forvalgt** |
| J9 grensen mot helsehjelp | Hjelperen har en knapp for å melde fra om forespørsler utenfor oppdraget, uten følger for henne |
| J20 referansepersoner | Skjematekst forklarer hva vi gjør, og driftsrutinen krever vurdering framfor sitat |

Regelen som følger: **et juridisk funn er ikke lukket når det er skrevet ned. Det
er lukket når det er bygget, eller når det står i en kø med en dato.**

---

## Beslutningene i ett blikk

| # | Beslutning | Status |
|---|---|---|
| B0 | Piloten måles på fem krav, ikke på balanse. Kapitalplan for 18 mnd med port i mnd 9 | Vedtatt |
| B1 | Åpningstid 07–21, vakt 07–23. Sparer 351 000 kr/år | Vedtatt |
| B2 | Serviceavgift 18 % gjennom piloten. Gulv 15 % kun mot forpliktet volum | Vedtatt |
| B3 | Bolk A er hele byggelisten, i låst rekkefølge | Vedtatt |
| B4 | Node · Fastify · PostgreSQL, administrert database, DPIA-port | Vedtatt |
| B5 | Regler før modell. Fire områder skal aldri bruke KI | Vedtatt |
| B6 | Akuttfeilen rettet, 31 tester dekker kjeden | Utført |
| B7 | Navnebytte startes nå, merket skilles ut nå, bytte før marked 2 | Vedtatt |
| B8 | Én grønn. Ingen tilstand signaliseres av farge alene | Utført |
| B9 | Tre tekstendringer før lansering | Vedtatt |
| B10 | Markedsplan godkjent, driftsreglene bindende | Vedtatt |
| B11 | Juridisk blir fast rolle. Tre funn bygget inn i produktet | Vedtatt |

Neste beslutningspunkt: når svar på de fire juridiske hovedspørsmålene foreligger.
Deretter når Bolk A trinn 1–3 er ferdige.
