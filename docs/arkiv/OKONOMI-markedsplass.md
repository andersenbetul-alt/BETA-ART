# Enhetsøkonomi og kapitalbehov – pilot Norge

> **Arkiv – markedsplassmodellen.** Dette dokumentet priser tjenesten slik den var
> tenkt før pivoten: åpen markedsplass, provisjon på hvert oppdrag, egen
> verifiseringskjede og vaktordning døgnet rundt. **Ingenting her gjelder produktet
> vi selger nå.** Det er beholdt fordi regnestykkene er riktige for den modellen, og
> fordi de er grunnlaget for beslutningen om å forlate den.
>
> Gjeldende tall: `docs/team/OKONOMI.md`. Gjeldende salgsmodell: `docs/team/SALG.md`.

Eier: økonomi. Kilder: `assets/js/pris.js` (satser og formel), `docs/DRIFT.md`
(alvorsgrader og svarfrister), `docs/SERVICE-BLUEPRINT.md` (flyt og verifiseringskjede).

Alle beløp i NOK. Tall merket **(anslag)** er ikke observert, men satt av økonomi og skal
erstattes med målte tall så snart piloten produserer dem. Satsene fra `pris.js` er ikke
anslag – de er koden.

---

## 0. Forutsetninger

### 0.1 Satser hentet fra `pris.js` (NO)

| Parameter | Verdi | Kilde |
|---|---|---|
| Timesats hjelper | 260 kr/t | `LAND.NO.timesats` |
| Reisetidssats | 130 kr/t | `LAND.NO.reisetidSats` |
| Reiseutgift (sjablong) | 25 kr | `LAND.NO.reisetillegg` |
| Serviceavgift | 18 % av hjelperandelen | `LAND.NO.plattformProsent` |
| Minstepris til hjelper | 260 kr | `LAND.NO.minstepris` |
| Standard reisetid | 15 min | `beregn()`, `reisetidMin` |
| Hastetillegg | nå +20 %, i dag +5 %, planlagt 0, fast −5 % | `HASTETILLEGG` |
| Kveld / helg | +10 % hver, legges til hastefaktoren | `beregn()` |
| Oppgavefaktor | følge 1,15, digital/aktivitet 1,05, øvrige 1,00 | `OPPGAVEFAKTOR` |

Formelen, slik den faktisk står i koden:

```
arbeid          = timesats × timer × oppgavefaktor
reisetid        = reisetidSats × (reisetidMin / 60)
grunnlag        = arbeid + reisetid + reiseutgift
hastefaktor     = 1 + hastetillegg + 0,10 (kveld) + 0,10 (helg)
tilHjelper      = maks(minstepris, grunnlag × hastefaktor)
serviceavgift   = tilHjelper × 0,18
kundens total   = tilHjelper + serviceavgift
```

Merk: serviceavgiften beregnes av hjelperandelen, ikke av totalen. 18 % av hjelperandelen
er 15,25 % av kundens total. Det er den effektive marginen vi faktisk har å drive for.

### 0.2 Driftskrav som koster penger (fra `DRIFT.md`)

| Grad | Frist | Bemanningskonsekvens |
|---|---|---|
| P1 – Sikkerhet | 15 minutter, døgnet rundt | Krever vaktordning 24/7/365. Dette er den tunge posten. |
| P2 – Oppdrag | 1 time | Krever bemanning i alle timer det utføres oppdrag, altså også kveld og helg. |
| P3 – Klage | 1 virkedag | Kontortid. |
| P4 – Søknad | 3 virkedager | Kontortid. Driver kostnad per verifisert hjelper. |

Verifiseringskjeden er obligatorisk og kan ikke hoppes over (`DRIFT.md` pkt. 5):
e-post, mobil, elektronisk ID-kontroll, to referansesamtaler, sikkerhetskurs med 85 %
bestått. Det er den kjeden som setter kostnad per verifisert hjelper.

### 0.3 Anslåtte enhetspriser brukt gjennom dokumentet

| Post | Verdi | Grunnlag |
|---|---|---|
| Betalingsgebyr, korttransaksjon | 1,9 % + 2,50 kr **(anslag)** | Nordisk kort/Vipps-nivå, reservasjon + trekk |
| Utbetaling til hjelper | 2,00 kr per utbetaling **(anslag)** | Samlet utbetaling, ikke per oppdrag i produksjon |
| SMS | 0,29 kr per melding **(anslag)** | ca. 7 meldinger per oppdrag: bekreftelse, tilbudsbølger, oppmøtekode, kvittering |
| Ansvars- og ulykkesforsikring | 14 000 kr/mnd **(anslag)** | Kollektiv premie, fast beløp, ikke volumdrevet |
| Fullt belastet time, saksbehandler | 435 kr/t **(anslag)** | 560 000 kr lønn × 1,21 (aga, pensjon, yrkesskade) / 1 561 effektive timer |
| Fullt belastet time, vakthavende dagtid | 480 kr/t **(anslag)** | 620 000 kr lønn × 1,21 / 1 561 effektive timer |
| Fullt belastet time, kveld/helg | 600 kr/t **(anslag)** | +25 % ubekvemstillegg |
| Beredskapsvakt hjemme | 120 kr/t **(anslag)** | 1/5-faktor på kveld/helg-sats, jf. vanlig tariffpraksis |
| Utrykning utenom arbeidstid | 770 kr/t **(anslag)** | Grunnsats 318 kr/t + 100 % overtid + 21 % sosiale kostnader |
| Effektive timer per årsverk | 1 561 t **(anslag)** | 1 950 t − ferie 187,5 − helligdager 56 − sykefravær 85 − kurs/møter 60 |

---

## 1. Dekningsbidrag per oppdrag – fem typiske oppdrag

Alle beregnet med `beregn()` i `pris.js`. Mellomregningen står i klartekst.

### 1.1 Mellomregning, pris

| # | Oppdrag | Arbeid | Reisetid | Reise | Grunnlag | Hastefaktor | Hastetillegg | Til hjelper | Serviceavgift | Kundens pris |
|---|---|---|---|---|---|---|---|---|---|---|
| A | Handling 1,5 t, «i dag», dagtid, 15 min reise | 260 × 1,5 × 1,00 = 390,00 | 130 × 15/60 = 32,50 | 25 | 447,50 | 1,05 | 22,38 | **470** | **85** | **554** |
| B | Følge til lege 3 t, planlagt, dagtid, 30 min reise | 260 × 3 × 1,15 = 897,00 | 130 × 30/60 = 65,00 | 25 | 987,00 | 1,00 | 0,00 | **987** | **178** | **1 165** |
| C | Tilsyn hjemme 1 t, «nå», kveld, 15 min reise | 260 × 1 × 1,00 = 260,00 | 32,50 | 25 | 317,50 | 1,30 | 95,25 | **413** | **74** | **487** |
| D | Samvær 2 t, fast avtale, helg, 20 min reise | 260 × 2 × 1,00 = 520,00 | 130 × 20/60 = 43,33 | 25 | 588,33 | 1,05 | 29,42 | **618** | **111** | **729** |
| E | Digital hjelp 0,5 t, planlagt, dagtid, 10 min reise | 260 × 0,5 × 1,05 = 136,50 | 130 × 10/60 = 21,67 | 25 | 183,17 | 1,00 | 0,00 | **260** | **47** | **307** |

Oppdrag A gjenskaper eksempelet i `SERVICE-BLUEPRINT.md` og i rollebeskrivelsen:
470 / 85 / 554. Formelen er verifisert.

Oppdrag E treffer minsteprisen: grunnlaget er 183 kr, men `Math.max(minstepris, …)` løfter
hjelperandelen til 260 kr. Serviceavgiften beregnes av det løftede beløpet, altså 47 kr,
mot 33 kr om minsteprisen ikke fantes. Det er positivt for oss – men som punkt 2 viser,
ikke positivt nok.

### 1.2 Direkte kostnader per fullført oppdrag

Alle poster er **anslag**. Forsikring er en fast månedspremie som her er fordelt på
800 fullførte oppdrag per måned (14 000 / 800 = 17,50 kr). Den fordelingen er kun gyldig
ved akkurat det volumet, og behandles derfor som fast kostnad igjen fra punkt 3 og utover.

| Post | Beregning | A | B | C | D | E |
|---|---|---|---|---|---|---|
| Betalingsgebyr **(anslag)** | 1,9 % × total + 2,50 + 2,00 | 15,0 | 26,6 | 13,8 | 18,4 | 10,3 |
| SMS **(anslag)** | 7 × 0,29 ≈ 2,00 | 2,0 | 2,0 | 2,0 | 2,0 | 2,0 |
| Forsikring **(anslag)** | 14 000 / 800 oppdrag | 17,5 | 17,5 | 17,5 | 17,5 | 17,5 |
| Andel kundestøtte **(anslag)** | 35 % av oppdrag × 7 min × 435 kr/t | 18,0 | 18,0 | 18,0 | 18,0 | 18,0 |
| Tap, tvist og avbestilling **(anslag)** | 1,5 % × total | 8,3 | 17,5 | 7,3 | 10,9 | 4,6 |
| **Sum direkte kostnader** | | **60,8** | **81,6** | **58,6** | **66,8** | **52,4** |

### 1.3 Dekningsbidrag

| # | Oppdrag | Serviceavgift | Direkte kostnad | **Dekningsbidrag** | DB i % av avgift | DB i % av kundepris |
|---|---|---|---|---|---|---|
| A | Handling 1,5 t, i dag | 85 | 60,8 | **24,2** | 28 % | 4,4 % |
| B | Følge til lege 3 t | 178 | 81,6 | **96,4** | 54 % | 8,3 % |
| C | Tilsyn 1 t, nå, kveld | 74 | 58,6 | **15,4** | 21 % | 3,2 % |
| D | Samvær 2 t, fast, helg | 111 | 66,8 | **44,2** | 40 % | 6,1 % |
| E | Digital hjelp 0,5 t | 47 | 52,4 | **−5,4** | −12 % | −1,8 % |

Tre funn:

1. **Varighet er den eneste variabelen som virkelig flytter dekningsbidraget.** De direkte
   kostnadene er i hovedsak faste per oppdrag (SMS, forsikring, kundestøtte, transaksjons-
   gebyrets kronedel utgjør 55,5 kr uansett størrelse). Et 3-timers oppdrag gir 4 ganger
   dekningsbidraget av et 1,5-timers oppdrag, ikke 2 ganger.
2. **Hastegrad er nesten irrelevant for oss.** Hastetillegget går i sin helhet til hjelperen;
   vi får bare 18 % av det. Oppdrag C har +30 % hastefaktor og likevel nest lavest bidrag,
   fordi det er kort.
3. **Korte oppdrag taper penger.** Oppdrag E er negativt. Minsteprisen på 260 kr beskytter
   hjelperen, men ingenting beskytter plattformen. **Tiltak: legg inn et gulv på
   serviceavgiften på 75 kr.** Da blir oppdrag E: avgift 75, total 335, direkte kostnad
   53,4, dekningsbidrag +21,6. Dette er en ren parameterendring i `pris.js` og bør avklares
   med salg og tjenestedesign før den gjøres.

### 1.4 Gjennomsnittsoppdraget

Brukt som grunnlag i resten av dokumentet.

| Oppdragstype | Andel **(anslag)** | Serviceavgift |
|---|---|---|
| Handling og ærend (~1,5 t) | 40 % | 85 |
| Samvær og tilsyn (~2 t) | 20 % | 111 |
| Følge til lege og aktivitet (~3 t) | 15 % | 178 |
| Praktisk hjemme, kort (~1 t) | 15 % | 74 |
| Digital hjelp og annet (~0,5 t) | 10 % | 47 |

Vektet serviceavgift = 0,40×85 + 0,20×111 + 0,15×178 + 0,15×74 + 0,10×47 = **98,7 ≈ 99 kr**.
Tilsvarende hjelperandel ca. 550 kr og kundepris ca. 649 kr, altså et snittoppdrag på ca. 1,7 t.

Variable direkte kostnader per fullført snittoppdrag, **uten** forsikring
(som fra nå behandles som fast):

| Post | Beløp |
|---|---|
| Betalingsgebyr | 16,8 |
| SMS | 2,0 |
| Kundestøtte | 18,0 |
| Tap og tvist | 9,7 |
| **Sum** | **46,5** |

**Dekningsbidrag per fullført snittoppdrag: 99 − 46,5 = 52,4 kr.**

---

## 2. Vaktordningen for P1 – den tunge posten

`DRIFT.md` krever 15 minutters svar på P1 **døgnet rundt**. Det er ikke en SLA man kjøper
seg ut av med en telefonsvarer: punkt 4 krever at kontoen fryses, pågående oppdrag
avsluttes og omfordeles, og familien varsles. Det krever en våken, tilgangsberettiget
vakthavende med fullmakt, 168 timer i uken.

### 2.1 Hvor mye bemanning kreves

Et døgn har 168 timer i uken. Ved helkontinuerlig turnus er lovlig arbeidstid 33,6 t/uke,
og med ferie- og fraværsdekning på +18 % **(anslag)** kreves **5,9 årsverk** for å bemanne
klokken aktivt hele uken. Det er ca. 4,3 mill. kr/år og er ikke aktuelt i en pilot.

Vi regner derfor tre varianter.

### 2.2 Variant 1 – full aktiv døgnbemanning

| Segment | Timer/uke | Timer/mnd (×4,33) | Sats | Kostnad/mnd |
|---|---|---|---|---|
| Kontortid man–fre 08–16, 40 % allokert til vakt | 40 → 16 | 69 | 480 | 33 100 |
| Aktiv kveld man–fre 16–23 + helg 08–23 | 65 | 281 | 600 | 168 800 |
| Aktiv natt 23–08 alle dager | 63 | 273 | 600 | 163 700 |
| Beredskapsleder / 2. linje, 0,15 årsverk | | | | 11 900 |
| Vakttelefon, redundant varslingsverktøy, øvelser **(anslag)** | | | | 6 500 |
| **Sum** | **168** | | | **384 000** |

### 2.3 Variant 2 – beredskapsvakt utenom kontortid (anbefalt for pilot)

Vakthavende er hjemme med vakttelefon og bærbar maskin. 15 minutter er oppnåelig fra
hjemmekontor. Beredskapstimen betales med 1/5-faktor, aktivering betales som utrykning.

| Segment | Timer/uke | Timer/mnd | Sats | Kostnad/mnd |
|---|---|---|---|---|
| Kontortid man–fre 08–16, 40 % allokert til vakt | 40 → 16 | 69 | 480 | 33 100 |
| Beredskapsvakt man–fre 16–08 (80 t) + helg døgn (48 t) | 128 | 554 | 120 | 66 500 |
| Utrykning P1 utenom kontortid: 800 oppdrag × 0,8 % P1-rate × 65 % utenfor kontortid = 4,2 saker × 2 t **(anslag)** | | 8,4 | 770 | 6 400 |
| Utrykning P2 utenom kontortid: 800 × 5 % = 40 saker × 45 % = 18 saker × 0,75 t **(anslag)** | | 13,5 | 770 | 10 400 |
| Beredskapsleder / 2. linje, 0,15 årsverk | | | | 11 900 |
| Vakttelefon, redundant varslingsverktøy, øvelser **(anslag)** | | | | 6 500 |
| **Sum** | **168** | | | **134 800 ≈ 135 000** |

Praktisk merknad: 128 beredskapstimer i uken kan ikke bæres av én person. Det krever en
rotasjon på minst fire, og AML-hvilekravet på 11 timer betyr at den som har hatt natt-
beredskap med utrykning ikke kan møte på kontoret dagen etter. Rotasjonen må derfor
bemannes med minst 4 personer selv om summen bare tilsvarer ca. 1,3 årsverk.

### 2.4 Variant 3 – gulv, uten allokert kontortid

Hvis man argumenterer for at driftsteamet uansett er på jobb i kontortiden og at
marginalkostnaden der er null: 135 000 − 33 100 = **101 700 kr/mnd**.

### 2.5 Hva vaktordningen koster per oppdrag

Ved variant 2, 135 000 kr/mnd:

| Fullførte oppdrag/mnd | Vaktkostnad per oppdrag | Til sammenligning: serviceavgift 99 kr |
|---|---|---|
| 400 | 338 kr | Vakten alene er 3,4 × hele serviceavgiften |
| 800 | 169 kr | 1,7 × serviceavgiften |
| 1 500 | 90 kr | 91 % av serviceavgiften |
| 2 843 | 47 kr | Dekningsbidraget går akkurat opp |
| 5 000 | 27 kr | Første gang det finnes penger til noe annet |

### 2.6 Nullpunktet – dokumentets viktigste tall

Faste kostnader som serviceavgiften må dekke før noe annet:

| Post | Kr/mnd |
|---|---|
| Vaktordning P1, variant 2 | 135 000 |
| Forsikring | 14 000 |
| **Sum fast** | **149 000** |

Dekningsbidrag per fullført snittoppdrag: **52,4 kr**.

> **Nullpunkt: 149 000 / 52,4 = 2 843 fullførte oppdrag per måned.**
> Ved 90 % matchrate tilsvarer det **3 351 opprettede oppdrag per måned**.

Til sammenligning, hvis man kun spør «når dekker serviceavgiften vakten, før andre
kostnader»: 135 000 / 99 = **1 364 fullførte oppdrag/mnd**. Det tallet er misvisende og
bør ikke brukes – de øvrige direkte kostnadene forsvinner ikke.

Nullpunktet i de tre variantene:

| Variant | Fast kostnad/mnd | Nullpunkt, fullførte oppdrag/mnd |
|---|---|---|
| 3 – gulv, ingen allokert kontortid | 115 700 | 2 208 |
| 2 – beredskapsvakt (anbefalt) | 149 000 | **2 843** |
| 1 – full aktiv døgnbemanning | 398 000 | 7 595 |

Ved 2,5 oppdrag per aktiv familie per måned **(anslag)** krever nullpunktet ca.
**1 140 aktive familier** i piloten samtidig. Det er tallet hele piloten egentlig handler om.

---

## 3. Kostnad per verifisert hjelper

Verifiseringskjeden i `DRIFT.md` pkt. 5 har seks obligatoriske steg. Kostnaden må bæres av
de som faktisk fullfører, ikke av de som starter. Trakten er **anslag** og skal måles.

### 3.1 Trakten, per 100 påbegynte søknader

| Steg | Antall som når steget | Enhetskostnad | Sum | Kommentar |
|---|---|---|---|---|
| E-postbekreftelse + SMS-engangskode | 100 | 3 kr | 300 | 2 SMS + e-post |
| Elektronisk ID-kontroll | 70 | 25 kr **(anslag)** | 1 750 | Ekstern leverandør, per kontroll |
| Saksbehandling av søknad (gjennomgang, purring, vedtak, avslagsbrev), 35 min | 68 | 254 kr | 17 272 | 35/60 × 435 kr/t |
| To referansesamtaler, 22 min hver, faktor 1,6 for bomforsøk og gjenoppringing = 70 min | 65 | 509 kr | 33 085 | 70/60 × 435 kr/t |
| Sikkerhetskurs, LMS-lisens per bruker | 60 | 25 kr **(anslag)** | 1 500 | Marginal lisens, ikke innholdsutvikling |
| **Sum direkte** | | | **53 907** | |
| **Godkjent og verifisert** | **55** | | | 45 % frafall gjennom kjeden **(anslag)** |

**Direkte kostnad per verifisert hjelper: 53 907 / 55 = 980 kr.**

| Tillegg | Beregning | Kr |
|---|---|---|
| Amortisert kursinnhold **(anslag)** | 180 000 kr utvikling / 600 hjelpere i piloten | 300 |
| Rekruttering av søkere **(anslag)** | 180 kr per søker × 100 søkere / 55 godkjente | 327 |
| **Total kostnad per verifisert hjelper** | | **1 607 ≈ 1 600 kr** |

**Referansesamtalene er 61 % av den direkte verifiseringskostnaden.** Det er den ene
posten som er verdt å effektivisere – men den skal effektiviseres i gjennomføring
(bookingtider, strukturert skjema, færre bomforsøk), ikke ved å fjerne det andre
referansesvaret. `DRIFT.md` krever to, og det kravet står.

### 3.2 Tilbakebetaling

| Scenario | Kostnad å tjene inn | DB per fullført oppdrag | **Oppdrag til break-even** | Ved 6 oppdrag/mnd |
|---|---|---|---|---|
| Hjelper som blir produktiv | 1 607 | 52,4 | **31 oppdrag** | 5,1 måneder |
| Justert for frafall: 35 % av verifiserte gjør ≤ 2 oppdrag **(anslag)** | 1 607 / 0,65 = 2 472 | 52,4 | **47 oppdrag** | 7,9 måneder |

Med en antatt median levetid som aktiv hjelper på 9 måneder **(anslag)** betaler en hjelper
seg tilbake, men marginen er tynn: 7,9 av 9 måneder går til å dekke egen verifisering.
Prøveperioden på fem oppdrag (`DRIFT.md` pkt. 5) dekker 5 × 52,4 = 262 kr, altså 16 % av
kostnaden. **Hjelperfrafall i de første 60 dagene er derfor en direkte finansiell post,
ikke bare et driftsproblem.**

---

## 4. Følsomhetsanalyse

### 4.1 Serviceavgift 12 / 15 / 18 / 22 %

Endret serviceavgift endrer kundens pris, ikke hjelperens andel. Hjelperandel holdt fast
på 550 kr (snittoppdraget). Fast kostnad 149 000 kr/mnd.

| Serviceavgift | Avgift, kr | Kundens pris | Endring i kundepris | Variable kostnader | **DB per oppdrag** | **Nullpunkt, fullførte/mnd** |
|---|---|---|---|---|---|---|
| 12 % | 66,0 | 616 | −5,1 % | 45,4 | **20,6** | **7 233** |
| 15 % | 82,5 | 632 | −2,6 % | 46,0 | **36,5** | **4 082** |
| **18 % (i dag)** | **99,0** | **649** | **0** | **46,6** | **52,4** | **2 843** |
| 22 % | 121,0 | 671 | +3,4 % | 47,3 | **73,7** | **2 022** |

Tolkning:

- **12 % er ikke en prismodell, det er en subsidie.** Dekningsbidraget faller 61 % mens
  kundens pris bare faller 5,1 %. Kunden merker knapt forskjellen, vi merker alt.
- **15 % øker volumkravet med 44 %** mot 18 %. Det bør bare vurderes hvis vi har målt
  priselastisitet som viser mer enn 44 % volumvekst av 2,6 % lavere pris. Det er
  usannsynlig.
- **22 % er det eneste alternativet som gjør piloten mulig innenfor 12–15 måneder.**
  Kunden betaler 22 kr mer på et oppdrag på 671 kr. Risikoen er ikke kundens
  betalingsvilje, men at hjelperandelen på 550 kr blir sammenlignet med totalen på 671 kr
  og at hjelperen opplever avgiften som høy. Den samtalen tas åpent, ikke skjules.
- Merk asymmetrien: hver prosentandel avgift er verdt ca. 5,5 kr i dekningsbidrag, mens
  hvert prosentpoeng koster kunden ca. 5,5 kr. Vi flytter 100 % av endringen, kunden
  bærer 0,8 % av prisen per prosentpoeng.

### 4.2 Andel oppdrag som får hjelper: 90 % → 70 %

Et oppdrag uten hjelper gir null inntekt, men koster fortsatt SMS (2 kr) og mer
kundestøtte enn et vellykket oppdrag – en familie som ikke fikk hjelp ringer.
Anslått kostnad per ikke-matchet oppdrag: **27 kr (anslag)**.

DB per **opprettet** oppdrag = matchrate × 52,4 − (1 − matchrate) × 27

| Matchrate | DB per opprettet oppdrag | **Nullpunkt, opprettede/mnd** | Tilsvarende fullførte | Endring mot 90 % |
|---|---|---|---|---|
| 90 % | 44,5 | **3 351** | 3 016 | – |
| 85 % | 40,5 | 3 680 | 3 128 | +10 % |
| 80 % | 36,5 | 4 080 | 3 264 | +22 % |
| 75 % | 32,5 | 4 578 | 3 433 | +37 % |
| **70 %** | **28,6** | **5 213** | 3 649 | **+56 %** |

Et fall fra 90 % til 70 % krever **56 % mer etterspørsel** for samme resultat – samtidig
som en synkende matchrate i seg selv reduserer etterspørselen, fordi familier som ikke får
hjelp ikke bestiller igjen. Effekten er selvforsterkende og er den farligste enkeltkurven
i dokumentet.

`DRIFT.md` pkt. 10 sier det riktige svaret: **flere hjelpere i det aktuelle området, ikke
lavere krav til verifisering.** Punkt 3 over sier hva det koster: 1 600 kr per verifisert
hjelper. Det er en investering, ikke en besparelse.

### 4.3 Kombinert

Nullpunkt i opprettede oppdrag per måned:

| | Matchrate 90 % | Matchrate 80 % | Matchrate 70 % |
|---|---|---|---|
| Avgift 15 % | 4 942 | 6 261 | 8 539 |
| **Avgift 18 %** | **3 351** | 4 080 | 5 213 |
| Avgift 22 % | 2 342 | 2 782 | 3 426 |

Spennet er 2 342 til 8 539 – en faktor 3,6 mellom beste og verste hjørne. Begge
variablene må styres. Ingen av dem kan kompensere fullt for den andre.

---

## 5. Kapitalbehov, 12 måneders pilot

### 5.1 Volumforutsetning (anslag)

Én by, oppstart måned 3. Rampen forutsetter at hjelperrekrutteringen ligger foran
etterspørselen; gjør den ikke det, faller matchraten og hele punkt 4.2 slår inn.

| Mnd | Opprettede | Matchrate | Fullførte | Serviceavgift | Dekningsbidrag | Vakt + forsikring | Resultat |
|---|---|---|---|---|---|---|---|
| 1 | 0 | – | 0 | 0 | 0 | 0 | 0 |
| 2 | 0 | – | 0 | 0 | 0 | 0 | 0 |
| 3 | 60 | 80 % | 48 | 4 752 | 2 191 | 94 000 | −91 809 |
| 4 | 140 | 82 % | 115 | 11 385 | 5 351 | 94 000 | −88 649 |
| 5 | 260 | 84 % | 218 | 21 582 | 10 289 | 94 000 | −83 711 |
| 6 | 400 | 86 % | 344 | 34 056 | 16 514 | 103 800 | −87 286 |
| 7 | 560 | 88 % | 493 | 48 807 | 24 024 | 103 800 | −79 776 |
| 8 | 720 | 88 % | 634 | 62 766 | 30 900 | 103 800 | −72 900 |
| 9 | 900 | 89 % | 801 | 79 299 | 39 299 | 103 800 | −64 501 |
| 10 | 1 100 | 90 % | 990 | 98 010 | 48 906 | 103 800 | −54 894 |
| 11 | 1 300 | 90 % | 1 170 | 115 830 | 57 798 | 103 800 | −46 002 |
| 12 | 1 500 | 90 % | 1 350 | 133 650 | 66 690 | 103 800 | −37 110 |
| **Sum** | **6 940** | | **6 163** | **610 137** | **301 962** | **1 008 600** | **−706 638** |

Kolonnen «Vakt + forsikring» er **marginalkostnaden utenfor kontortid** (variant 2 minus
den allokerte kontortiden, som ligger i lønnsposten under) pluss forsikring. Den er
redusert i måned 3–5 fordi utrykningsvolumet er lavere.

### 5.2 Hva pengene går til

| Post | 12 mnd | Merknad |
|---|---|---|
| Lønn produkt og teknologi, 2,5 årsverk | 2 500 000 | Fullt belastet |
| Lønn drift: driftsleder + 2,5 saksbehandler/kundestøtte | 2 650 000 | Inneholder kontortidsdelen av vaktordningen, all søknadsbehandling og all kundestøtte |
| Vaktordning utenom kontortid: beredskap, utrykning, varslingsverktøy | 870 000 | Marginalt utover lønnsposten over |
| Forsikring, ansvar og ulykke **(anslag)** | 140 000 | 10 måneder |
| Betalingsgebyr, tap og tvist | 200 000 | Følger volum |
| SMS, elektronisk ID-kontroll, LMS-lisens | 110 000 | |
| Utvikling av sikkerhetskurs, innhold og test | 180 000 | Engangs, amortiseres i punkt 3 |
| Rekruttering av hjelpere, 600 verifiserte | 200 000 | 180 kr × ca. 1 100 søkere |
| Kundeanskaffelse og markedsføring | 900 000 | Eies av markedsføring, tallet er en ramme |
| Juridisk, DPIA og personvern, revisjon, forsikringsmegling | 350 000 | `DPIA.md`, `GDPR.md` |
| Hosting, drift, verktøy, faste avgifter betalingsplattform | 260 000 | |
| Kontor, utstyr, øvrig | 280 000 | |
| **Sum kostnader** | **8 640 000** | |
| Serviceavgift, 12 måneder | −610 000 | Fra rampen over |
| **Netto brenn** | **8 030 000** | Ca. 670 000 kr/mnd i snitt |
| Buffer 20 % | 1 610 000 | Forsinket ramp, høyere utrykningsvolum, lavere matchrate |
| **Kapitalbehov** | **9 640 000** | **ca. 9,6 mill. kr** |

**Viktig om dobbelttelling:** kundestøtten på 18 kr per oppdrag og verifiseringskostnaden
på 1 600 kr per hjelper er *allokeringer av* lønnsposten på 2 650 000 kr, ikke kostnader
i tillegg til den. De brukes til å styre enhetsøkonomien; de legges ikke oppå
kapitalbehovet. Samme gjelder de 33 100 kr/mnd av vaktordningen som ligger i kontortiden.

### 5.3 Arbeidskapital

`DRIFT.md` pkt. 7: beløpet reserveres når hjelperen takker ja, trekkes etter bekreftelse,
og frigis automatisk etter 48 timer. Med utbetaling til hjelper innen 3–5 virkedager
**(anslag)** holder plattformen kundens penger i ca. 4 dager. Ved 1 500 oppdrag/mnd og
649 kr snitt er det ca. 973 000 kr/mnd i omsetning og ca. 130 000 kr i positiv flyt.
Beløpet er ikke vår kapital og skal ikke brukes som driftsfinansiering, men det betyr at
modellen **ikke** binder arbeidskapital. Det er et av modellens få finansielle fortrinn.

### 5.4 Når går det i null

Ved månedsslutt 12: 1 500 opprettede oppdrag/mnd. Nullpunkt for vaktordning og forsikring:
3 351 opprettede/mnd. Med en fortsatt ramp på +200 oppdrag/mnd nås det i **måned 22**; med
+300 i **måned 19**. Ved 22 % serviceavgift (nullpunkt 2 342 opprettede) nås det i
**måned 17** ved +200/mnd.

Full kontantstrømsbalanse for hele organisasjonen er en helt annen størrelse: ca.
780 000 kr/mnd i kostnader ved månedsslutt 12, delt på 44,5 kr dekningsbidrag per
opprettet oppdrag, gir i størrelsesorden **17 500 opprettede oppdrag per måned**. Det er
ikke én by. Det er 5–8 byer som deler den samme vaktordningen.

**Det er den strategiske konklusjonen: vaktordningen er en fast kostnad som ikke kan
fordeles på flere oppdrag i én by raskt nok, men som kan fordeles på flere byer med én
gang.** SE og DE ligger allerede inne i `pris.js` med samme 18 %. En felles nordisk
vaktordning halverer nullpunktet per marked.

---

## 6. De tre største finansielle risikoene

### Risiko 1 – Vaktordningen er et trappetrinn, ikke en variabel kostnad

135 000 kr/mnd påløper enten vi har 100 eller 3 000 oppdrag. Ved 400 oppdrag/mnd koster
vakten 338 kr per oppdrag mot 99 kr i serviceavgift. Risikoen er ikke at kostnaden vokser,
men at volumet ikke gjør det. Den forsterkes hvis P1-raten er høyere enn antatt: hver
0,1 prosentpoeng over 0,8 % koster ca. 1 200 kr/mnd i utrykning ved 800 oppdrag, og over
1,5 % må vi over på variant 1 med aktiv nattbemanning – som tredobler nullpunktet.

**Tidlige varsler:**

| Varsel | Terskel |
|---|---|
| Opprettede oppdrag mot ramp | Under 70 % av plan to måneder på rad |
| P1-rate | Over 1,2 % av fullførte oppdrag |
| Utrykninger utenom kontortid | Over 30 per måned |
| Median responstid P1 | Over 8 minutter, altså halvveis til fristen |
| Andel P1-frister overholdt | Under 98 % |

De tre siste finnes allerede som nøkkeltall i `DRIFT.md` pkt. 10 og i `drift.html`. De må
kobles til økonomirapporteringen, ikke bare til driftskonsollen.

### Risiko 2 – Matchraten kollapser

Fra 90 % til 70 % øker nødvendig etterspørsel med 56 %. Effekten er selvforsterkende:
familier som ikke får hjelp bestiller ikke igjen, og hjelpere som får få tilbud slutter å
være tilgjengelige. Kostnaden ved å rette opp er 1 600 kr per ny verifisert hjelper med
5–8 måneders tilbakebetaling – altså treg medisin på en rask sykdom. Matchraten må derfor
styres forebyggende, per bydel, ikke i etterkant.

**Tidlige varsler:**

| Varsel | Terskel |
|---|---|
| Ukentlig matchrate | Under 85 % |
| Andel oppdrag som når tredje tilbudsbølge | Over 25 % |
| Aktive hjelpere per bydel | Under 12 |
| Median tid fra bestilling til akseptert oppdrag | Over 20 minutter |
| Andel «nå»-oppdrag uten hjelper | Over 15 % |
| Andel verifiserte hjelpere som er tilgjengelige en gitt kveld | Under 30 % |

### Risiko 3 – Hjelperne omklassifiseres fra oppdragstakere til arbeidstakere

Dette er den eneste risikoen som kan gjøre modellen ulønnsom over natten uavhengig av
volum. Ved arbeidsgiveransvar påløper arbeidsgiveravgift 14,1 %, feriepenger 12 %,
obligatorisk tjenestepensjon 2 % og sykelønnsansvar – i sum ca. **+30 % på hjelperandelen**.
På snittoppdraget er det +165 kr. Serviceavgiften på 99 kr dekker det ikke i nærheten.
Utfallet er enten +25 % på kundeprisen eller hjelpersats ned fra 260 til ca. 200 kr/t.
Ingen av delene er forenlig med løftet i `SERVICE-BLUEPRINT.md` om at det skal være
rimelig for hjelperen.

Risikoen er reell fordi flere av våre egne kvalitetsmekanismer peker mot arbeidstaker-
forhold: prøveperiode, tillitsnivåer, suspensjon, fast krets og styring av hvilke oppdrag
en hjelper får se.

**Tidlige varsler:**

| Varsel | Terskel |
|---|---|
| Andel hjelpere med over 60 % av samlet inntekt fra plattformen | Over 20 % av aktive hjelpere |
| Hjelpere med over 25 oppdrag/mnd hos samme familie | Enhver forekomst gjennomgås |
| Hjelpere med over 30 timer/uke på plattformen | Enhver forekomst gjennomgås |
| Plattformen begynner å tildele vakter framfor å tilby oppdrag | Utløser juridisk gjennomgang |
| Krav, klage eller tilsynssak om klassifisering | Umiddelbar eskalering til styret |

### Følges også

- **Hjelperfrafall:** 47 oppdrag til tilbakebetaling mot 9 måneders median levetid er tynt.
  Varsel: over 30 % av verifiserte hjelpere gjør færre enn 3 oppdrag i løpet av 60 dager.
- **Korte oppdrag med negativt dekningsbidrag:** varsel er at andelen oppdrag under 1 time
  passerer 15 % uten at gulvet på serviceavgiften er innført.

---

## 7. Anbefalinger

| # | Tiltak | Effekt | Eier |
|---|---|---|---|
| 1 | Innfør gulv på serviceavgiften, 75 kr | Fjerner negativt dekningsbidrag på oppdrag under 1 time | salg + tjenestedesign, endring i `pris.js` |
| 2 | Sett serviceavgiften til 22 % i piloten, med åpen begrunnelse mot hjelperne | Senker nullpunktet fra 3 351 til 2 342 opprettede/mnd, framskynder balanse med ca. 5 måneder (måned 22 → 17) | salg |
| 3 | Kjør variant 2 (beredskapsvakt utenom kontortid), ikke aktiv døgnbemanning | 249 000 kr/mnd lavere kostnad, samme 15-minutters frist | drift |
| 4 | Del vaktordningen mellom markeder så snart marked to åpner | Halverer nullpunktet per marked | drift + økonomi |
| 5 | Effektiviser referansesamtalene (booket tid, strukturert skjema), ikke fjern den andre referansen | 61 % av verifiseringskostnaden; 20 % raskere gjennomføring = ca. 100 kr per hjelper | drift |
| 6 | Rapporter matchrate per bydel ukentlig til økonomi, ikke bare til drift | Den mest følsomme variabelen i modellen | drift + økonomi |
| 7 | Sett opp klassifiseringsvarslene i punkt 6, risiko 3, som faste månedsrapporter fra dag én | Eneste risiko som kan velte modellen uavhengig av volum | økonomi + juridisk |
