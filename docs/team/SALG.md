# Salgsmodell

Salgsansvarlig · PårørendePilot · versjon 1, klar til bruk.

Alle priser i NOK, eksklusive mva. der ikke annet er oppgitt. Alle regnestykker under
er regnet med satsene i `assets/js/pris.js` (NO: timesats 260, reisetidsats 130,
reiseutgift 25, serviceavgift 18 %, minstepris 260) og kontrollert mot koden.

---

## 0. De seks reglene salget aldri bryter

Disse står først fordi de er grensene for alt som følger. En selger som må bryte en
av dem for å lande en avtale, skal la avtalen gå.

1. **Hjelperens linje røres aldri.** Beløpet til hjelperen beregnes alltid av
   `pris.js`. Enhver rabatt tas fra serviceavgiften – altså fra vår egen margin.
2. **Serviceavgiften går aldri under 15 %** av hjelperlinjen i noe abonnement eller
   noen avtale. Under det spiser vi av det som finansierer ID-kontroll,
   referansesjekk, kurs, forsikring og vakt.
3. **Verifiseringskravene er ikke en prisknapp.** Vi selger aldri «rimeligere fordi
   vi hopper over referansesjekken». Nivåkravene i `trygghet.html` gjelder likt for
   privatkunde, bedrift og kommune.
4. **Ingen responstidsgaranti utover det drift holder.** Vi sier «vanligvis innen
   omtrent 90 minutter i områder med etablert hjelperdekning», aldri «innen 90
   minutter». Det vi *kan* garantere, er våre egne svarfrister: P1 sikkerhet 15 min
   døgnet rundt, P2 oppdrag 1 time, P3 klage 1 virkedag, P4 søknad 3 virkedager.
5. **Ingen oppdrag som krever helsefaglig autorisasjon.** Ikke medisiner, ikke stell,
   ikke sårbehandling, ikke vurdering av helsetilstand. Heller ikke «bare denne ene
   gangen» og heller ikke som del av en kommuneavtale.
6. **Ingen avtale i et område uten dekning.** Vi signerer ikke abonnement, bedrifts-
   eller kommuneavtale i en geografi der vi ikke har minst **åtte verifiserte
   hjelpere på nivå 2 innenfor 10 km** av leveranseområdet. Å selge inn i et tomt
   kart er den raskeste måten å miste tilliten på.

---

## 1. Abonnementsstruktur ved siden av enkeltoppdrag

### 1.1 Hvorfor abonnement i det hele tatt

Enkeltoppdrag fungerer for den som trenger hjelp av og til. Problemet er at det
familiene faktisk vil ha, ikke er *en time hjelp* – det er **forutsigbarhet og de
samme ansiktene**. Care Circle er allerede beskrevet i `familie.html` som produktets
kjerne: «målet er ikke en ny fremmed hver uke, men de samme to–tre menneskene».
Abonnementet er den kommersielle formen på nettopp det.

For oss gjør et abonnement tre ting: det gjør inntekten forutsigbar, det senker
matchingkostnaden per oppdrag mot null (en fast avtale krever ingen budrunde og har
ingen risiko for oppdrag uten hjelper), og det gir hjelperen et forutsigbart
ukeoppdrag hen kan planlegge rundt.

### 1.2 Grunnprisene abonnementene bygger på

Alle abonnementstimer prises som **fast avtale** i modellen (`nar: 'fast'`,
hastetillegg −5 %), fordi det er nøyaktig det de er: et gjentakende oppdrag på et
avtalt tidspunkt. Regnet for et besøk på 2 timer, dagtid, 15 minutters reisetid,
oppgavefaktor 1:

| Linje | Regnestykke | Beløp |
|---|---|---|
| Arbeidstid | 260 × 2 × 1,0 | 520 kr |
| Reisetid | 130 × (15/60) | 33 kr |
| Reiseutgift | sjablong | 25 kr |
| Sum grunnlag | | 578 kr |
| Hastetillegg, fast avtale | 578 × (−0,05) | −29 kr |
| **Til hjelperen** | | **549 kr** |

Til sammenligning, samme besøk bestilt som enkeltoppdrag:

| Hastegrad | Til hjelper | Serviceavgift 18 % | Kunden betaler |
|---|---|---|---|
| Fast avtale | 549 kr | 99 kr | **647 kr** |
| Planlagt tidspunkt | 578 kr | 104 kr | **681 kr** |
| I dag | 606 kr | 109 kr | **716 kr** |
| Nå | 693 kr | 125 kr | **818 kr** |

Merk for selgeren: *fast avtale på kveld eller helg* koster nøyaktig det samme som
*i dag på dagtid* (549 → 606 kr til hjelperen), fordi −5 % og +10 % nesten opphever
hverandre. Det er et godt argument mot familier som tror kveldsbesøk er dyrt.

### 1.3 De tre nivåene

#### Nivå 1 – **Nærkontakt** · 199 kr/mnd

**Hvem det er for:** den pårørende som bor et annet sted enn foreldrene og som ikke
trenger hjelp hver uke, men som trenger å vite at det finnes noen når det smeller.
Typisk: mor klarer seg stort sett, men det er tre–fire ganger i året det ikke går.

**Hva som inngår:**
- Pårørendepanelet: status, varsler, kvittering med tid, notat og beløp
- Care Circle etablert og holdt ved like: 2–3 navngitte, verifiserte hjelpere i
  nærområdet som kjenner den eldre og tilbys oppdragene først
- Navngitt kontaktperson hos oss, telefon hverdager 09–16
- Telefonbestilling på vegne av den eldre – likeverdig kanal, ikke nødløsning
- Månedlig oppsummering til den pårørende

**Regnestykket:**
| Post | Beløp |
|---|---|
| Inkluderte timer | 0 |
| Serviceavgift på oppdrag | 18 % – **uendret** |
| Til hjelperen av abonnementet | 0 kr |
| Til PårørendePilot | 199 kr/mnd |

Dette nivået kan per konstruksjon aldri gjøre et oppdrag ulønnsomt for hjelperen,
fordi det ikke rører oppdragsprisen i det hele tatt. Det er et beredskaps- og
koordineringsabonnement, ikke en rabatt – og det skal selges som det. Selgeren skal
si det rett ut: *«Nærkontakt gir deg ikke billigere timer. Det gir deg at noen
allerede kjenner mor når du ringer, i stedet for at du starter på nytt hver gang.»*

Ved 199 kr/mnd tjener vi inn abonnementet mot ett spart telefonoppfølgings-løp per
kvartal. Nedre grense: går prisen under 149 kr, dekker den ikke kostnaden ved å
holde en Care Circle varm i et område – da er svaret nei.

---

#### Nivå 2 – **Fast uke** · 2 550 kr/mnd

**Hvem det er for:** familien der det har blitt et mønster. Handling og et par timers
selskap én gang i uka, samme dag, samme person. Dette er hovedproduktet – de fleste
kunder som blir værende, ender her.

**Hva som inngår:**
- Alt i Nærkontakt
- **8 timer i måneden**, som 4 besøk à 2 timer, fast ukedag og fast klokkeslett
- Fast navngitt hjelper, med en navngitt reserve i Care Circle
- Ubrukte timer overføres én måned, maksimalt 4 timer. De forsvinner ikke, men de
  spares heller ikke opp i det uendelige
- Ekstratimer utover abonnementet: ordinær `pris.js`-beregning med **16 %**
  serviceavgift i stedet for 18 % (2 timer fast avtale = 637 kr i stedet for 647 kr)
- Pause inntil 2 måneder ved sykehusinnleggelse, uten betaling, med Care Circle holdt

**Regnestykket:**
| Post | Regnestykke | Beløp |
|---|---|---|
| Til hjelperne | 4 × 549 | 2 196 kr |
| Til PårørendePilot | 2 550 − 2 196 | 354 kr |
| Effektiv serviceavgift | 354 / 2 196 | **16,1 %** |
| **Kundens pris** | | **2 550 kr/mnd** |

**Hva kunden sparer:**
| Alternativ | Månedspris | Differanse |
|---|---|---|
| Fire besøk bestilt «i dag», ad hoc | 4 × 716 = 2 864 kr | **−314 kr (−11 %)** |
| Fire besøk bestilt som fast avtale uten abonnement | 4 × 647 = 2 588 kr | −38 kr |
| … pluss Nærkontakt kjøpt separat | 2 588 + 199 = 2 787 kr | **−237 kr** |

Hjelperen får 549 kr per besøk – nøyaktig samme beløp som ved en fast avtale uten
abonnement. Hele rabatten er tatt fra vår egen avgift, fra 18 % til 16,1 %. Det er
forsvarlig fordi et fast ukesoppdrag koster oss omtrent ingenting å matche.

---

#### Nivå 3 – **Fast hverdag** · 5 100 kr/mnd

**Hvem det er for:** den eldre som trenger hjelp flere ganger i uka for å kunne bo
hjemme i det hele tatt, og familien som ellers ville begynt å snakke om sykehjem
eller om at noen må slutte i jobben. Ofte kombinert med hjemmetjeneste som gjør det
helsefaglige.

**Hva som inngår:**
- Alt i Fast uke
- **16 timer i måneden**, som 8 besøk à 2 timer, to faste dager i uka
- **To hjelpere i fast rotasjon** i stedet for én, slik at ferie og sykdom ikke
  stopper hjelpen. Begge kjenner den eldre
- **Erstatningsgaranti:** blir den faste hjelperen syk, skaffer vi erstatter samme
  dag der dekningen tillater det, og *vi* betaler hastetillegget, ikke kunden.
  Hjelperen får full sats. Gjelder inntil 2 ganger per måned og opp til nivået
  «i dag» – ikke «nå»
- Ubrukte timer overføres én måned, maksimalt 8 timer
- Skriftlig månedsrapport til den pårørende: gjennomførte besøk, avvik, endringer i
  behov som er verdt å vite om

**Regnestykket:**
| Post | Regnestykke | Beløp |
|---|---|---|
| Til hjelperne | 8 × 549 | 4 392 kr |
| Til PårørendePilot | 5 100 − 4 392 | 708 kr |
| Effektiv serviceavgift | 708 / 4 392 | **16,1 %** |
| **Kundens pris** | | **5 100 kr/mnd** |
| Kostnad ved erstatningsgaranti, verste fall | inntil 2 × (606 − 549) | −114 kr |
| Margin etter garanti, verste fall | | 594 kr |

Merk skillet: den *prisede* serviceavgiften er 16,1 % og ligger over gulvet i regel 2.
Erstatningsgarantien er en kostnad vi bærer i etterkant når den utløses, ikke en rabatt
i prisen – og hjelperen får hele hastetillegget uansett.

**Hva kunden sparer:**
| Alternativ | Månedspris | Differanse |
|---|---|---|
| Åtte besøk bestilt «i dag», ad hoc | 8 × 716 = 5 728 kr | **−628 kr (−11 %)** |
| Åtte besøk som fast avtale + Nærkontakt | 5 176 + 199 = 5 375 kr | **−275 kr** |

Erstatningsgarantien er den eneste posten i hele modellen der vi betaler et
hastetillegg av egen lomme. Det er bevisst: den løser familiens verste scenario
(«hva om hun ikke kommer?») uten at hjelperen får mindre betalt for å rykke ut.

### 1.4 Oppsummert abonnementstabell

| | Nærkontakt | Fast uke | Fast hverdag |
|---|---|---|---|
| Pris per måned | 199 kr | 2 550 kr | 5 100 kr |
| Inkluderte timer | 0 | 8 (4 × 2 t) | 16 (8 × 2 t) |
| Til hjelperne | 0 kr | 2 196 kr | 4 392 kr |
| Vår margin | 199 kr | 354 kr | 708 kr |
| Effektiv serviceavgift | 18 % (uendret) | 16,1 % | 16,1 % |
| Pris per time inkl. alt | – | 319 kr | 319 kr |
| Serviceavgift på ekstratimer | 18 % | 16 % | 16 % |
| Care Circle | 2–3 hjelpere | fast + reserve | to i rotasjon |
| Erstatningsgaranti | nei | nei | ja, inntil 2/mnd |
| Månedsrapport | oppsummering | oppsummering | skriftlig rapport |
| Binding | ingen | ingen | ingen |

**Felles vilkår:** løpende måned, 30 dagers oppsigelse, ingen bindingstid, ingen
etableringsgebyr. Vi selger ikke bindingstid i et produkt som handler om tillit.

### 1.5 Grenser for hva abonnement kan gjøre

- **Ingen abonnement med besøk kortere enn 1,5 time.** Ved 1 time utgjør reisetid og
  reiseutgift 58 kr av 302 kr til hjelperen – nesten en femdel av oppdraget går til å
  komme seg dit. Det er ikke et produkt vi vil skalere.
- **Ingen «nå»-oppdrag i abonnementet.** Hastegraden «nå» er per definisjon ikke
  planlagt og prises alltid som enkeltoppdrag, med det hastetillegget som går til
  hjelperen. Abonnementet gir prioritet i køen, ikke fritak fra tillegget.
- **Følgeoppdrag prises med sin faktor.** Følge til lege eller avtale har faktor 1,15
  (2 timer planlagt = 656 kr til hjelper, 773 kr til kunde). Det kan trekkes fra
  abonnementets timebank, men da med faktor: **1 time følge bruker 1,15 timer** av
  banken. Vi skjuler ikke at det oppdraget er tyngre.
- **Minsteprisen på 260 kr gjelder alltid**, også for det korteste oppdraget i et
  abonnement.

---

## 2. Arbeidsgiversporet

### 2.1 Hva vi faktisk selger

Ikke «velvære». Vi selger **gjenvunnet arbeidstid**. Den ansatte som er pårørende til
en aldrende forelder, taper ikke først og fremst tid på å *gi* omsorg – hen taper tid
på å *organisere* den: ringe kommunen, ringe søsken, ringe legekontoret, finne noen
som kan følge til time på torsdag, ringe på nytt fordi ingen svarte. Det skjer i
arbeidstiden, fra kontorstolen, med dårlig samvittighet begge veier.

Pitchen i én setning:

> **De ansatte som organiserer hjelp til foreldrene sine, gjør det i arbeidstiden.
> Vi flytter den koordineringen ut av kontoret og over til noen som gjør det på
> heltid.**

### 2.2 Hvem som er kjøper

| Rolle | Rolle i salget | Hva de bryr seg om |
|---|---|---|
| **HR-direktør / HR-sjef** | **Beslutningstaker.** Eier ansattgoder og sykefraværsbudsjettet | Turnover blant erfarne 45–60-åringer, korttidsfravær, seniorpolitikk |
| Leder for HMS / bedriftshelsetjeneste | Medbeslutter, ofte budsjetteier | At tilbudet er reelt og ikke enda en app ingen bruker |
| Linjeleder (avdelingsleder) | **Smertebærer og beste inngang.** Merker fraværet direkte | At nøkkelpersoner ikke forsvinner i ukevis |
| Tillitsvalgt / verneombud | **Portvokter.** Kan stoppe eller løfte saken | At det ikke er en snikprivatisering eller en måte å presse folk tilbake på jobb |
| Økonomidirektør | Signerer over terskelbeløp | Kost per ansatt, og at det er en avtale som kan sies opp |
| Kommunikasjon / intern | Avgjør om noen får vite om det | At lanseringen har et budskap som ikke er pinlig |

**Rekkefølgen som virker:** linjeleder eller tillitsvalgt gir historien → HR-sjef
eier saken → HMS/BHT bekrefter at det er seriøst → økonomi signerer. Å starte hos
økonomidirektøren gir nesten alltid nei, fordi hen ikke har smerten.

### 2.3 Pris per ansatt

Prisen er per ansatt i bedriften, ikke per bruker – som en bedriftshelseavtale.
Årsak: vi må holde hjelperdekning og bemannet telefon i beredskap for alle, uansett
hvor mange som ringer.

| Antall ansatte | Pris per ansatt per år | Pris per ansatt per måned |
|---|---|---|
| 20–99 | 590 kr | 49 kr |
| 100–499 | 390 kr | 33 kr |
| 500+ | 290 kr | 24 kr |

Minstebeløp 30 000 kr per år. Alle priser eks. mva. Avtaleperiode 12 måneder,
oppsigelse 3 måneder før utløp.

**Hva bedriften får for beløpet:**
- **Nærkontakt (nivå 1) uten egenandel** for enhver ansatt som melder et behov –
  pårørendepanel, Care Circle, telefonbestilling, navngitt kontaktperson
- **Én pårørendesamtale på 45 minutter per ansatt per år** med en av våre
  pårørendekoordinatorer: hva kommunen faktisk plikter å levere, hva som må søkes om
  og hvordan, hva vi kan ta, og hva som ikke er vår oppgave. Dette er den enkeltposten
  som gir størst opplevd verdi, og den koster oss minst
- Ansatte kjøper abonnement nivå 2 og 3 til ordinær pris. Bedriften kan velge å
  subsidiere med et fast kronebeløp per måned (se skatteforbeholdet i 2.5)
- **Anonymisert kvartalsrapport**: antall samtaler, behovskategorier, geografisk
  spredning. Aldri navn, aldri helseopplysninger, aldri hvem som har ringt
- Informasjonsmateriell og to digitale informasjonsmøter i året

**Hva bedriften aldri får:** hvem som har brukt tjenesten. Det er ikke en tjeneste vi
kan tilby, og det er ikke en vi vil tilby. Si det uoppfordret i møtet – det bygger
mer tillit enn noe annet punkt på lista.

### 2.4 Hva bedriften faktisk sparer – regnearket selgeren fyller ut

Ikke bruk nasjonale tall du ikke kan dokumentere. Bruk bedriftens egne. Be om fire
inputs i behovskartleggingen:

| Input | Hvor det hentes | Eksempel |
|---|---|---|
| A. Antall ansatte | HR | 300 |
| B. Andel over 45 år | HR, aldersfordeling | 40 % → 120 |
| C. Andel av disse som er pårørende til aldrende foreldre | spørres i en anonym mikroundersøkelse før tilbudet | 30 % → 36 personer |
| D. Full timekostnad (lønn + arbeidsgiveravgift + pensjon / faktisk arbeidstid) | økonomi | 500 kr/t |

**Regnestykket, konservativt:**

```
Koordineringstid tapt per pårørende ansatt:      4 timer per måned
Tapt arbeidstid totalt:      36 × 4 × 12  =      1 728 timer per år
Verdi av tapt arbeidstid:    1 728 × 500  =    864 000 kr per år

Realistisk reduksjon med tjenesten (25 %):        216 000 kr per år
Kostnad:                     300 × 390    =      117 000 kr per år
──────────────────────────────────────────────────────────────────
Netto per år                                      +99 000 kr
Tilbakebetalt når reduksjonen passerer            13,5 %
```

**Slik presenteres det:** ikke som en påstand, men som et regneark der HR fyller inn
sine egne tall foran deg. Spørsmålet du stiller, er: *«Hvor mange timer i måneden tror
du en av deres ansatte bruker på å ordne hjelp til foreldrene sine? Sett inn ditt eget
tall.»* Så lenge svaret er over én time, går regnestykket opp.

**Postene som kommer i tillegg, men som ikke skal tallfestes i et første møte:**
- Korttidsfravær som i realiteten er pårørendedager
- Ansatte i 50-årene som går ned i stilling eller slutter – rekrutteringskostnaden for
  én erfaren fagperson overstiger ofte hele årsavtalen
- Verdi i rekruttering og omdømme; dette er et gode konkurrentene stort sett ikke har

Vi lover **ikke** redusert sykefravær i prosent. Vi har ikke data til å love det ennå,
og HR-direktører har hørt det løftet før fra andre.

### 2.5 To forbehold selgeren må ta selv, før kunden spør

1. **Skatt.** At bedriften betaler for tilgang, rådgivning og koordinering er en
   generell arbeidsplasstjeneste. At bedriften betaler for konkrete oppdrag hjemme hos
   den ansattes forelder, er etter all sannsynlighet en skattepliktig naturalytelse.
   Vi selger tilgang og rådgivning – ikke skattefri hushjelp. Enhver
   subsidieringsmodell skal avklares med bedriftens revisor før signering, og det sier
   vi *før* kunden spør. Å bli tatt i å ha oversett dette, koster hele avtalen.
2. **Dekning.** Avtalen gjelder de geografiene der vi faktisk har hjelpere. Har
   bedriften ansatte over hele landet, står det i avtalen hvilke kommuner som er
   dekket ved signering, og hva som skjer med de øvrige: full Nærkontakt-funksjonalitet
   og rådgivning, men oppdragsformidling først når dekningskravet i regel 6 er nådd.

---

## 3. Kommunesporet

### 3.1 Posisjonen – hele salget hviler på denne setningen

> **Vi tar ikke over noe kommunen skal gjøre. Vi tar det kommunen ikke skal gjøre,
> og som i dag ikke blir gjort av noen.**

Kommunen har en lovpålagt plikt til nødvendige helse- og omsorgstjenester. Den plikten
kan ikke og skal ikke settes bort til oss, og vi skal ikke tilby noe som kan forveksles
med den. Vår rolle ligger i mellomrommet mellom vedtaket og livet: mellom det
hjemmetjenesten gjør på 22 minutter, og alt det andre i et døgn.

Prøv aldri å selge på at vi er billigere enn hjemmetjenesten. Det er både usant og et
angrep på personen du sitter foran. Selg på at vi tar oppgaver hjemmetjenesten ikke har
hjemmel eller tid til – og at det frigjør deres fagfolk til det bare de kan gjøre.

### 3.2 Hva vi kan ta – og hva vi aldri tar

**Oppgaver vi kan ta (praktisk hjelp og sosial kontakt, ingen autorisasjon påkrevd):**
- Handling, ærend, apotekhenting i lukket pose uten håndtering av innholdet
- Sosialt samvær, besøk, samtale, høytlesning, gåtur
- Følge til frisør, butikk, kafé, aktivitetssenter, gudstjeneste, familiebesøk
- Følge til og fra avtaler som ledsager – vi sitter i venterommet, vi går ikke inn i
  konsultasjonen som noens representant med mindre familien uttrykkelig har avtalt det
- Digital hjelp: nettbank sammen med brukeren uten å overta, videosamtale med familien,
  helsenorge-innlogging brukeren selv utfører
- Enkle praktiske gjøremål i hjemmet: rydde, skifte lyspære, sette på en vask, vanne
  planter, ta ut søppel
- Dyrestell: lufte hunden, mate katten
- Trygghetsbesøk etter sykehusutskrivning: er det mat i huset, er det ryddet vei fra
  døra til senga, kommer hen seg til toalettet, er det noe som må meldes videre

**Oppgaver vi aldri tar – og aldri diskuterer prisen på:**
- Legemidler: utdeling, dosett, påminnelse med ansvar, injeksjoner
- Personlig stell og hygiene, dusj, stell av intimområder, stomi, kateter
- Sårstell og all form for behandling
- Forflytning som krever helsefaglig vurdering, eller bruk av personløfter
- Ernæringssonde, medisinsk utstyr, måling som skal journalføres
- Enhver vurdering av helsetilstand, og enhver dokumentasjon i pasientjournal
- Tvang eller tilbakeholdelse, uansett hvor godt begrunnet
- Nattevakt, tilsyn gjennom natten, ansvar for at noen ikke er alene
- Oppgaver som inngår i et vedtak etter helse- og omsorgstjenesteloven
- Erstatning for BPA, avlastningsvedtak eller praktisk bistand som er innvilget

Denne lista skal ligge som et **avgrensningsvedlegg** i enhver kommuneavtale, signert
av begge parter. Den er ikke en juridisk ryggdekning – den er hovedargumentet. En
virksomhetsleder som ser at vi selv har skrevet ned hva vi ikke gjør, slutter å
mistenke oss for å ville ta over.

### 3.3 Hvem som beslutter i kommunen

| Rolle | Funksjon i salget | Hva som overbeviser |
|---|---|---|
| **Kommunalsjef helse og omsorg** | **Beslutningstaker** for retning og budsjett | At dette avlaster en tjeneste som ikke får tak i folk |
| **Virksomhetsleder hjemmetjenesten** | **Viktigste portvokter.** Uten hen skjer ingenting | At vi ikke går inn i hennes fag, og at vi ikke skaper merarbeid |
| **Tildelingskontoret / koordinerende enhet** | **Vår operative kanal.** De møter behovet som ikke gir vedtak | At de får et sted å henvise til når svaret ellers er «det dekker vi ikke» |
| Innkjøpsansvarlig | Avgjør *hvordan* det kan kjøpes | At pilotens ramme er tilpasset anskaffelsesregelverket |
| Frivillighets- eller folkehelsekoordinator | Eier ofte budsjett for aktivitet og sosial kontakt | At vi supplerer frivilligheten i stedet for å utkonkurrere den |
| Hovedutvalg helse og omsorg (politisk) | Vedtar bevilgning over en viss størrelse | En pilot med tall, ikke en idé |
| Kommuneoverlege / fagansvarlig | Kan legge ned veto på faglig grunnlag | Avgrensningsvedlegget, punkt for punkt |

**Rekkefølgen som virker:** tildelingskontoret beskriver behovet → virksomhetsleder
sier at det ikke er en trussel → kommunalsjef eier saken → innkjøp former avtalen →
politikk hvis beløpet krever det. Snarveien rett til politisk nivå gir en høflig
mottakelse og ingen leveranse, fordi fagsiden ikke er med.

### 3.4 Kommersielle modeller mot kommune

Serviceavgiften settes til **15 %** – gulvet i regel 2. Det er forsvarlig fordi
kommunen leverer volum uten anskaffelseskostnad for oss, men det er også absolutt siste
punktum. Hjelperlinjen er identisk med privatmarkedet.

**A. Rammeavtale, timekjøp**

| Oppdrag | Til hjelper | 15 % avgift | Kommunens pris |
|---|---|---|---|
| Besøk 2 timer, planlagt | 578 kr | 87 kr | **665 kr** |
| Besøk 2 timer, fast ukentlig | 549 kr | 82 kr | **631 kr** |
| Besøk 3 timer, planlagt | 838 kr | 126 kr | **964 kr** |
| Følge 2 timer (faktor 1,15), planlagt | 656 kr | 98 kr | **754 kr** |

**B. Utskrivningspakke – den beste inngangsdøren**

Fast pris for de første 14 dagene etter sykehusutskrivning: 4 besøk à 2 timer,
trygghetsbesøk og praktisk opprydding, første besøk innen 24 timer etter hjemkomst
der dekningen tillater det.

```
4 × 631 kr = 2 524 kr  →  fast pakkepris 2 520 kr
```

Argumentet: kommunen betaler i dag en betydelig døgnsats for utskrivningsklare
pasienter som blir liggende. Be virksomhetslederen om *kommunens egen sats* – ikke
oppgi et tall selv – og still ett spørsmål: *«Hvor mange døgn er denne pakken verdt
hos dere?»* I de fleste kommuner er svaret «under ett».

**C. Nærkontakt-lisens**

Kommunen kjøper Nærkontakt for utvalgte innbyggere, typisk fra tildelingskontoret,
som et tilbud til dem som får avslag fordi behovet ikke er helsefaglig:

| Volum | Pris per innbygger per måned |
|---|---|
| 10–49 | 179 kr |
| 50+ | 149 kr |

**D. Tilskuddsmodell (egenandelsdeling)**

Kommunen dekker et fast kronebeløp per besøk, for eksempel 200 kr, innbyggeren betaler
resten. Rimeligst for kommunen, gir flest innbyggere hjelp per krone, og lar kommunen
styre volumet med et enkelt tak.

**Anskaffelsesform:** en pilot skal utformes slik at den kan kjøpes uten full
konkurranse – legg rammen under kommunens terskel for direkte anskaffelse, avgrens til
én sone og én tidsperiode, og be innkjøpsavdelingen om å bekrefte gjeldende
terskelverdier skriftlig før tilbudet sendes. Vi gjetter aldri på dette i et møte.

### 3.5 Setninger som aldri skal falle i et kommunemøte

- «Vi er billigere enn hjemmetjenesten.»
- «Vi kan ta noen av de enkle helseoppgavene også.»
- «Vi garanterer at noen er der innen en time.»
- «Dere kan spare stillinger på dette.»
- «Politiattest på alle hjelpere.» (Vi kan bare kreve attest der lov eller forskrift
  gir hjemmel. Det står allerede i `trygghet.html`, og det skal stå likedan i salget.)

---

## 4. Innvendingsark

Regel for alle svar: **vis systemet, ikke overbevisningen din.** Den som selger med
adjektiver, taper mot den som selger med en prosess.

---

**1. «Er det ikke dyrt?»**

Ikke forsvar prisen. Gjør alternativet synlig.

> «La oss regne på det. To timer handling og selskap koster 647 kr med fast avtale.
> 549 av dem går til personen som faktisk kommer hjem til mor. Vi tar 99.
> Hva koster det deg å ta fri en formiddag fra jobben for å gjøre det samme? For de
> fleste er svaret mer enn 647 kr før du har kjørt en meter. Og du må gjøre det igjen
> neste uke.»

Følg opp med at prisen alltid vises linje for linje **før** bestilling, og at det ikke
finnes gebyrer som dukker opp etterpå. For den som synes 2 550 kr i måneden er mye:
det er 319 kr timen for en verifisert person som kommer hjem, med forsikring, vakt og
oppfølging – og alternativet er sjelden gratis, det er bare usynlig fordi det betales
i noens fritid.

---

**2. «Kan jeg stole på personen?»**

Aldri svar «ja, alle våre hjelpere er trygge». Det er et løfte ingen kan holde, og
kunden vet det. Vis kjeden:

> «Jeg kan ikke love at det aldri går galt. Det jeg kan vise deg, er hva som må skje
> før noen i det hele tatt får se et oppdrag: engangskode på SMS og bekreftet e-post,
> elektronisk ID-kontroll med selfie-match hos ekstern leverandør, to referanser som
> faktisk ringes med et fast spørsmålssett, sikkerhetskurs på 45–60 minutter med test
> som krever 85 % riktig, og deretter en prøveperiode med enkle oppdrag på dagtid.
> Én verifisert identitet gir én konto. Kommer det en sikkerhetsmelding, fryses kontoen
> før vi utreder – ikke etterpå.»

Legg til det som skiller oss fra en anmeldelsesside: nivåsystemet. Den som registrerte
seg i går, får ikke det mest sensitive oppdraget i dag – nivå 2 krever ti fullførte
oppdrag uten avvik. Og: pengereglene er absolutte. Aldri kontanter, aldri kort, aldri
PIN, aldri BankID. Innkjøp skjer med en engangs betalingsløsning med beløpsgrense og
kvitteringsplikt, knyttet til det ene oppdraget.

Avslutt med å sende `trygghet.html`. Siden selger bedre enn du gjør.

---

**3. «Mor vil ikke ha fremmede i huset.»**

Dette er den innvendingen som avgjør flest salg. Ikke argumenter mot den – gi den rett.

> «Det skjønner jeg godt, og hun har rett. Det jeg ville reagert på også, er en ny
> person hver uke. Det er ikke det vi selger. Vi bygger en Care Circle: to–tre
> navngitte mennesker som kjenner henne, og som tilbys oppdragene først. Målet er at
> hun etter en måned sier «Sofia kommer på fredag», ikke «det kommer noen på fredag».»

Så tilby det som faktisk løser det:
- **Første besøk med deg til stede**, eller på video hvis du bor et annet sted.
- Du får navn, bilde, verifiseringsmerker, antall fullførte oppdrag og språk **før**
  besøket, og kan be om en annen.
- Start med det minst inngripende oppdraget som finnes: en gåtur, en handletur, en kopp
  kaffe. Ikke noe inne i huset. Når det har gått bra tre ganger, spør henne igjen.
- Merk hjelperen som fast så snart det fungerer.

Og si det som er sant: mange eldre sier nei til «en hjemmehjelp» og ja til «Sofia».
Det er ikke tjenesten hun avviser, det er kategorien.

---

**4. «Vi har allerede hjemmetjeneste.»**

> «Bra – og den skal dere beholde. Vi gjør ikke det de gjør. De har vedtak, journal og
> helsefaglig ansvar. Vi tar aldri medisiner, stell eller noe som krever autorisasjon.
> Det vi tar, er alt det de ikke har hjemmel eller tid til: følge til frisøren, handle,
> gå en tur, sitte og drikke kaffe i to timer, hjelpe med nettbrettet, lufte hunden.
> Spør deg selv hvem som gjør de tingene i dag. For de fleste familier er svaret
> «jeg», eller «ingen».»

Følg opp: hjemmetjenesten er ofte inne i 20–25 minutter. Døgnet har 1 440. Vi gjør ikke
det som skjer i de 22 minuttene – vi gjør litt av det som skjer i resten.

---

**5. «Kan ikke hjelperen bare gi mor medisinene mens hun er der?»**

Det eneste rette svaret er nei, sagt vennlig og uten forhandling.

> «Nei, og det kommer vi aldri til å gjøre. Legemiddelhåndtering krever helsefaglig
> autorisasjon. Hadde vi sagt ja til det, hadde du hatt god grunn til å tvile på alt
> annet vi lover deg. Det vi kan gjøre, er å være der og si fra til deg eller
> hjemmetjenesten hvis noe ikke stemmer.»

Et nei her er det sterkeste tillitsargumentet i hele samtalen. Bruk det bevisst.

---

**6. «Hva om noe skjer? Hvem har ansvaret?»**

> «Da gjelder tre ting. For det første: ved fare for liv og helse ringes 113, 110 eller
> 112 – vi erstatter ikke nødetatene, og systemet vårt gjenkjenner akutte formuleringer
> og viser nødnumrene i stedet for å opprette et oppdrag. For det andre har både
> hjelperen og familien en SOS-knapp til vaktordningen vår, med aktivt oppdrag og siste
> kjente oppdragssted. For det tredje har vi svarfrister vi faktisk holder:
> sikkerhetssaker innen 15 minutter, døgnet rundt.»

Om forsikring: si nøyaktig det som står i `trygghet.html` – forsikringsdekning,
arbeidsrettslig status og eventuelle krav om politiattest fastsettes sammen med
forsikringsselskap og juridisk rådgiver før ordinær drift. **Ikke improviser en
dekningssum i et møte.** Skriv ned spørsmålet og kom tilbake skriftlig.

---

**7. «Vi har familie. Søsteren min stiller opp.»**

> «Det er den beste ordningen som finnes, helt til den ikke er det. Spørsmålet er ikke
> om søsteren din vil – det er hva som skjer den uka hun er syk, eller på ferie, eller
> når hun har gjort det i to år og begynner å bli sliten uten å si det. De fleste
> familier vi snakker med, kommer ikke til oss fordi ingen stiller opp. De kommer fordi
> én person har stilt opp for mye, for lenge.»

Selg Nærkontakt til 199 kr som forsikring, ikke som erstatning: kretsen er på plass,
klar til å tre inn den uka det trengs. Det er en lav terskel som ofte blir til nivå 2
i løpet av et halvår.

---

**8. «Kan vi ikke bare finne en nabo eller noen på nettet som gjør det billigere?»**

> «Jo, og det er faktisk billigere – helt til det ikke er det. Da har du ingen
> ID-kontroll, ingen referansesjekk, ingen forsikring, ingen som svarer hvis noe skjer,
> og du står som arbeidsgiver med det ansvaret det innebærer. Og du må organisere det
> selv, hver gang. De 99 kronene vi tar av et oppdrag på 647, er ikke betaling for å
> koble to personer. Det er betaling for at vi vet hvem den ene er.»

Legg til det pengeargumentet ingen tenker på: de fleste økonomiske overgrep mot eldre
begås av noen som allerede har tilgang. Våre pengeregler er absolutte og skriftlige –
en privat avtale over kjøkkenbordet har ingen.

---

**9. «Mor har demens. Hun kan ikke bestille selv, og hun husker ikke hvem som kom.»**

> «Da er det du som bestiller, gjennom pårørendepanelet, og du som får kvitteringen
> med tid, notat og beløp. Hun trenger ikke huske noe. To ting er viktige her: oppdrag
> som innebærer demens krever tillitsnivå 3 hos hjelperen, altså tilleggsopplæring og
> dokumentert erfaring – det er ikke et oppdrag en ny hjelper får. Og hvis hun ikke selv
> kan samtykke, må du eller en verge være involvert i bestillingen. Det er ikke en
> formalitet vi kan hoppe over.»

---

**10. «Vi bor i en liten kommune. Dere har sikkert ingen hjelpere her.»**

Ærlighet er billigere enn skuffelse.

> «Det kan godt hende. La meg sjekke dekningen deres før vi går videre – vi selger
> ikke abonnement i et område der vi ikke har minst åtte verifiserte hjelpere innen
> 10 km, nettopp fordi et abonnement uten hjelpere er verdiløst. Har vi ikke dekning
> ennå, kan du få Nærkontakt til rådgivning og koordinering, og jeg sier fra den dagen
> vi har folk.»

Aldri selg et oppdragsabonnement inn i et tomt kart. Regel 6.

---

**11. «Hvor fort kan dere komme?»**

> «Hastegraden «nå» betyr at vi leter etter noen som kan komme innen omtrent 90
> minutter, og i områder med etablert dekning skjer det som regel. Men jeg gir deg
> ingen garanti, fordi jeg ikke kan holde den – hjelperne våre er mennesker med egne
> avtaler, ikke biler i en flåte. Det jeg garanterer, er at du får vite innen kort tid
> om vi har noen eller ikke, i stedet for at det er stille. Og trenger dere hjelp med
> sikkerhet, svarer vaktordningen innen 15 minutter, døgnet rundt.»

---

**12. «Hva med personvernet? Dere samler data om mor.»**

> «Vi samler mindre enn du tror, og det er bygget inn i koden, ikke i en erklæring.
> Adressen hennes finnes ikke i oppdragslisten hjelperne ser – den åpnes først når
> oppdraget er tildelt, og skjules igjen når det er ferdig. Du ser at oppdraget pågår
> og hvor lenge, men ikke hvor hjelperen beveger seg – posisjon brukes bare til å
> bekrefte oppmøte i riktig område. Hjelperens posisjon brukes bare mens hen selv har
> slått på tilgjengelighet. Vi lagrer ikke fødselsnummer.»

Sluttpoenget: *«Og bedriften eller kommunen får aldri vite hvem som har brukt
tjenesten.»*

---

**13. (Arbeidsgiver) «Dette er ikke arbeidsgivers ansvar.»**

> «Enig, det er ikke deres ansvar. Men det er allerede deres kostnad. Den ansatte som
> bruker fire timer i måneden på å ordne hjelp til moren sin, gjør det ikke om
> kvelden – hen gjør det fra kontorstolen, mellom to møter. Dere betaler for de timene
> uansett. Spørsmålet er bare om dere får noe igjen for dem.»

Hvis innvendingen kommer fra tillitsvalgt og handler om press: *«Dette er et tilbud
den ansatte selv velger å bruke eller la være. Dere får aldri vite hvem som har brukt
det – ikke fordi vi ikke vil si det, men fordi vi ikke kan.»*

---

**14. (Kommune) «Vi kan ikke sette bort lovpålagte oppgaver.»**

> «Helt riktig, og det er derfor vi ikke tilbyr dem. Her er avgrensningsvedlegget vårt –
> lista over hva vi aldri gjør. Den har vi skrevet selv, før dere spurte. Vi tar
> handling, følge, selskap, ærend og digital hjelp. Vi tar ikke medisiner, stell,
> sårbehandling, forflytning eller noe som inngår i et vedtak. Poenget er ikke å avlaste
> dere for plikten, men å ta det som faller utenfor den – og som i dag ikke blir gjort
> av noen.»

---

**15. «Vi vil prøve, men vi vil ikke binde oss.»**

> «Da skal dere ikke det. Ingen bindingstid, 30 dagers oppsigelse, og hvis mor blir
> innlagt setter vi abonnementet på pause i inntil to måneder uten betaling, med
> kretsen hennes holdt. Vi tror ikke bindingstid hører hjemme i et produkt som handler
> om tillit.»

For bedrift og kommune: tilby pilot med definert varighet, definert omfang og et
avtalt evalueringsmøte, i stedet for rabatt.

---

## 5. Prisark og pitch – én side

> Denne delen er ment å skrives ut eller deles på skjerm i et møte. Alt over er
> forberedelse; dette er det kunden ser.

---

### PårørendePilot

**Bo hjemme. Få hjelp når du trenger det. Ha familien nær – uansett hvor de bor.**

Praktisk hverdagshjelp til eldre, utført av verifiserte hjelpere i nabolaget.
Ikke helsehjelp. Ikke en erstatning for hjemmetjenesten. Det andre.

---

#### Pitchen – 45 sekunder

> «Du bor i Oslo. Mor bor et annet sted. Hun klarer det meste, men ikke alt – og hver
> gang det er noe, er det du som ringer rundt. Hjemmetjenesten er inne i 22 minutter og
> gjør det de har vedtak på. Resten av døgnet er det ingen.
>
> Vi sender én av to–tre faste, verifiserte personer hjem til henne. De handler, følger
> henne til frisøren, går en tur, hjelper med nettbrettet, sitter og drikker kaffe. Du
> ser prisen før du bestiller, du får en melding når hun har fått hjelpen, og du får
> vite hvem som kommer før de kommer.
>
> Vi lover ikke at ingenting kan gå galt. Vi lover at ingen kommer hjem til moren din
> uten ID-kontroll, to sjekkede referanser, bestått sikkerhetskurs og en prøveperiode.»

---

#### Enkeltoppdrag – hva et besøk koster

Eksempel: 2 timer handling og selskap, dagtid, 15 minutters reisetid.

| Linje | Beløp |
|---|---|
| Arbeidstid (260 kr/t × 2 t) | 520 kr |
| Reisetid (halv sats, 15 min) | 33 kr |
| Reiseutgift | 25 kr |
| Serviceavgift PårørendePilot (18 %) | 104 kr |
| **Totalt, planlagt tidspunkt** | **681 kr** |

| Hastegrad | Kunden betaler | Av dette til hjelperen |
|---|---|---|
| Fast avtale (samme dag og tid hver uke) | 647 kr | 549 kr |
| Planlagt tidspunkt | 681 kr | 578 kr |
| I dag | 716 kr | 606 kr |
| Nå (vanligvis innen ca. 90 min ved dekning) | 818 kr | 693 kr |

Andre eksempler: 1 time digital hjelp 390 kr · 1,5 time handling i dag 554 kr ·
2 timer følge til avtale 773 kr · 3 timer 988 kr.

**Prisen vises alltid linje for linje før du bestiller. Ingen etterfakturering, ingen
gebyrer, ingen bindingstid.**

---

#### Abonnement – for den som trenger hjelp jevnlig

| | **Nærkontakt** | **Fast uke** | **Fast hverdag** |
|---|---|---|---|
| **Pris per måned** | **199 kr** | **2 550 kr** | **5 100 kr** |
| Inkluderte timer | ingen | 8 t (4 × 2 t) | 16 t (8 × 2 t) |
| Pris per time | – | 319 kr | 319 kr |
| Fast hjelper | 2–3 i krets | fast + reserve | to i rotasjon |
| Pårørendepanel og varsler | ✓ | ✓ | ✓ |
| Egen kontaktperson, telefon | ✓ | ✓ | ✓ |
| Telefonbestilling | ✓ | ✓ | ✓ |
| Overføring av ubrukte timer | – | inntil 4 t | inntil 8 t |
| Erstatningsgaranti ved sykdom | – | – | ✓ inntil 2/mnd |
| Skriftlig månedsrapport | oppsummering | oppsummering | ✓ |
| Ekstratimer | 18 % avgift | 16 % avgift | 16 % avgift |
| Bindingstid | ingen | ingen | ingen |
| Pause ved sykehusinnleggelse | – | inntil 2 mnd | inntil 2 mnd |

**Fast uke sammenlignet med å bestille det samme ad hoc:** 2 550 kr mot 2 864 kr –
**314 kr spart i måneden**, og du slipper å bestille.

---

#### For arbeidsgivere

Tilgang for alle ansatte, én pårørendesamtale på 45 minutter per ansatt per år, egen
kontaktperson, anonymisert kvartalsrapport. Bedriften får aldri vite hvem som bruker
tjenesten.

| Antall ansatte | Per ansatt per år |
|---|---|
| 20–99 | 590 kr |
| 100–499 | 390 kr |
| 500+ | 290 kr |

Minstebeløp 30 000 kr per år. Eks. mva.

---

#### For kommuner

Supplement til, aldri erstatning for, lovpålagte tjenester. Signert avgrensningsvedlegg
følger enhver avtale.

| Tjeneste | Pris |
|---|---|
| Besøk 2 timer | 665 kr |
| Besøk 2 timer, fast ukentlig | 631 kr |
| Følge til aktivitet, 2 timer | 754 kr |
| Utskrivningspakke, 14 dager (4 × 2 t) | 2 520 kr |
| Nærkontakt-lisens per innbygger per måned (50+) | 149 kr |

---

#### Trygghet – i én kolonne

ID-kontroll med selfie-match · to referanser som ringes · sikkerhetskurs med test
(85 % krav) · prøveperiode med enkle dagoppdrag · fire tillitsnivåer · innsjekk med
firesifret oppmøtekode · aldri kontanter, kort, PIN eller BankID · umiddelbar frys ved
sikkerhetsmelding · sikkerhetssaker besvart innen 15 minutter, døgnet rundt.

**Vi sier ikke at alle våre hjelpere er 100 % trygge. Det kan ingen garantere.
Vi sier at ingen sendes hjem til familien din uten å være verifisert.**

Ved brann, alvorlig sykdom eller fare for liv: ring 113, 110 eller 112. Vi erstatter
ikke nødetatene.

---

## 6. Pipeline

Ett prinsipp: **et steg regnes ikke som passert før utløseren har skjedd.** Ikke fordi
det er ryddig, men fordi optimistiske pipelines gir feil bemanning av hjelpersiden, og
en familie som får «vi har ingen ledige» to ganger, kommer ikke tilbake.

### 6.1 Familier (B2C)

| # | Steg | Utløser for å gå videre | Eier | Normal tid |
|---|---|---|---|---|
| 0 | **Lead** – noen har vist interesse | Kontaktinfo og kommune registrert | markedsføring | – |
| 1 | **Dekning bekreftet** | ≥ 8 verifiserte hjelpere på nivå 2 innen 10 km. Ellers: venteliste, ingen salgsløfte | drift | samme dag |
| 2 | **Behovssamtale, 15 min** | Samtalen gjennomført; vi vet hvem den eldre er, hva som trengs, hvem som bestemmer, og om noe av det krever autorisasjon | salg | 2 dager |
| 3 | **Konto opprettet og pris vist** | Kontoen er opprettet og familien har sett en konkret prisberegning for sitt eget behov | selvbetjent | samme dag |
| 4 | **Første oppdrag bestilt** | Oppdraget ligger i systemet med hjelper tildelt | selvbetjent | 7 dager |
| 5 | **Første oppdrag gjennomført** | Utsjekk gjort, familien har bekreftet, betaling frigitt | drift | – |
| 6 | **Oppfølgingssamtale** | Ringt innen 48 timer etter første oppdrag. Dette steget hoppes aldri over – det er her det avgjøres om det blir to oppdrag eller ett | salg | 2 dager |
| 7 | **Care Circle etablert** | Minst 2 oppdrag med samme hjelper, og hjelperen merket som fast | selvbetjent | 3–6 uker |
| 8 | **Abonnement tegnet** | Nivå 1, 2 eller 3 aktivert | salg | – |
| 9 | **Fast kunde** | 3 måneder sammenhengende uten avvik | drift | – |

**Abonnementssamtalen tas ved steg 7, ikke før.** Å selge Fast uke til noen som ennå
ikke har møtt hjelperen sin, er å be om en oppsigelse i måned to. Unntaket er
Nærkontakt til 199 kr, som gjerne kan tilbys allerede ved steg 2 – den løser en annen
ting: at familien ikke skal starte på null neste gang.

**Fallgruver som skal registreres, ikke skjules:** oppdrag som ikke fikk hjelper
(steg 4 → 1: dekningsproblem, ikke salgsproblem), og familier som stopper etter
første oppdrag (steg 5 → 6: nesten alltid feil hjelper eller feil forventning, ikke
pris).

### 6.2 Arbeidsgivere

| # | Steg | Utløser for å gå videre | Eier |
|---|---|---|---|
| 1 | **Identifisert** | Bedrift med ≥ 50 ansatte, aldersprofil med tyngde over 45, hovedkontor i dekket område | salg |
| 2 | **Inngang funnet** | En navngitt person – linjeleder, tillitsvalgt eller HR – har bekreftet at problemstillingen er kjent hos dem | salg |
| 3 | **Første møte holdt** | 30 minutter gjennomført med HR-ansvarlig til stede | salg |
| 4 | **Behovskartlegging** | Bedriften har delt antall ansatte, aldersfordeling og full timekostnad – og helst kjørt en anonym mikroundersøkelse om hvor mange som er pårørende | HR + salg |
| 5 | **Regnestykket gjennomgått** | HR har sett sitt eget regneark med sine egne tall, og er enig i forutsetningene | salg |
| 6 | **Tilbud sendt** | Kjøper, budsjett og beslutningsdato er identifisert. Uten alle tre sendes ikke tilbud | salg |
| 7 | **Skatt og dekning avklart** | Bedriftens revisor har uttalt seg om subsidieringsmodellen, og dekkede kommuner er listet i avtalen | salg + økonomi |
| 8 | **Pilot signert** | Signert avtale, 6 måneder, én avdeling eller ett kontorsted | HR |
| 9 | **Lansert internt** | Intern kommunikasjon sendt og minst ett informasjonsmøte holdt. En avtale uten lansering gir null bruk og null fornyelse | HR + salg |
| 10 | **Første bruk** | Minst 3 ansatte har hatt en pårørendesamtale | drift |
| 11 | **Evaluert** | Bruksrapport gjennomgått i møte, 60 dager før pilotens utløp | salg |
| 12 | **Utvidet eller fornyet** | Signert 12-månedersavtale for hele bedriften | HR |

Steg 9 er der bedriftsavtaler dør. Ingen pilot regnes som startet før lanseringen er
gjennomført – tell den som steg 8, ikke steg 12.

### 6.3 Kommuner

| # | Steg | Utløser for å gå videre | Eier |
|---|---|---|---|
| 1 | **Kartlagt** | Kommunen har dokumentert behov (ventelister, utskrivningsklare, rekrutteringsproblemer) og vi har dekning eller en realistisk plan for den | salg |
| 2 | **Første samtale** | Gjennomført med tildelingskontor eller virksomhetsleder hjemmetjeneste – ikke med kommunikasjonsavdelingen | salg |
| 3 | **Behovsavklaring** | Vi har en konkret liste over oppgaver kommunen i dag sier nei til fordi de ikke er helsefaglige | tildelingskontor |
| 4 | **Avgrensningsnotat gjennomgått** | Fagsiden har lest lista over hva vi aldri gjør, og ikke har innvendinger | virksomhetsleder + kommuneoverlege |
| 5 | **Kommunalsjef informert** | Kommunalsjef helse og omsorg har eierskap til saken | kommunalsjef |
| 6 | **Anskaffelsesform avklart** | Innkjøp har skriftlig bekreftet hvordan en pilot kan kjøpes og innenfor hvilken ramme | innkjøp |
| 7 | **Pilot avtalt** | Signert avtale: én sone, definert antall oppdrag, definert periode, avtalte måltall | kommunalsjef |
| 8 | **Hjelperkapasitet på plass** | Regel 6 oppfylt i pilotsonen **før** første henvisning mottas | drift |
| 9 | **Pilot i drift** | Første 10 oppdrag gjennomført og evaluert | drift |
| 10 | **Evaluert** | Sluttrapport med gjennomførte oppdrag, avvik, og innbyggernes tilbakemeldinger levert skriftlig | salg + drift |
| 11 | **Rammeavtale eller konkurranse** | Kommunen har besluttet videreføring; ved beløp over terskel deltar vi i ordinær konkurranse | innkjøp |

Steg 4 er porten. En virksomhetsleder som ikke har lest avgrensningsnotatet, blir en
motstander i steg 9 – som regel med rette.

### 6.4 Nøkkeltall salget måles på

| Tall | Hvorfor |
|---|---|
| Andel oppdrag som får hjelper | Selger vi mer enn vi kan levere? Faller den, stopper salget i det området |
| Andel familier som bestiller oppdrag nummer to | Måler produktet, ikke pitchen |
| Tid fra lead til første gjennomførte oppdrag | Det eneste som virkelig forutsier om kunden blir værende |
| Andel kunder med etablert Care Circle | Den beste enkeltindikatoren på at kunden ikke sier opp |
| Andel abonnenter som bruker mer enn 75 % av timene | Under 50 % over to måneder: ring dem, ikke vent på oppsigelsen |
| Månedlig frafall (churn) på abonnement | – |
| Effektiv serviceavgift på tvers av porteføljen | Skal aldri havne under 16 % samlet |

---

## 7. Åpne punkter som må avklares før dette selges i skala

Dette er ikke forbehold for å ha ryggen fri – det er de fire tingene som faktisk kan
velte modellen, og de eies av andre roller enn salg:

1. **Forsikringsdekning og ansvarsfordeling** ved skade i hjemmet – forsikringsselskap
   og juridisk rådgiver. Til det er avklart, oppgir salget ingen dekningssummer.
2. **Hjelpernes arbeidsrettslige status** – oppdragstakere eller ansatte. Dette
   påvirker om 18 % i det hele tatt er riktig avgiftsnivå, og dermed hele
   abonnementsmatematikken. Eies av juridisk og økonomi.
3. **Skattemessig behandling av arbeidsgiverbetalte oppdrag** – revisor. Avklares før
   første bedriftsavtale med subsidiering signeres.
4. **Terskelverdier og anskaffelsesform for kommunepiloter** – bekreftes skriftlig av
   den enkelte kommunes innkjøpsavdeling, aldri anslått av oss i et møte.

Punkt 2 er det viktigste for salget: endres avgiftsnivået, må abonnementsprisene i
kapittel 1 regnes om før de brukes. Prisene her er gyldige så lenge satsene i
`assets/js/pris.js` står som de gjør.
