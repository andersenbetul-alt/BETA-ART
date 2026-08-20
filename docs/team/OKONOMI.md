# Enhetsøkonomi – Naviar Care (B2B)

Eier: økonomi. Gjelder produktet som faktisk selges: et abonnement til en privat
tjenesteleverandør. Markedsplassens regnestykker ligger i
`docs/arkiv/OKONOMI-markedsplass.md` og gjelder ikke lenger.

Alle beløp i NOK, eksklusive mva. Tall merket **(anslag)** er satt av økonomi og
skal erstattes med målte tall så snart piloten produserer dem.

---

## 0. Det som endret seg, og som ingen hadde skrevet ned

Pivoten fra markedsplass til B2B er ikke en produktendring. Det er en annen
bedrift, økonomisk sett.

| | Markedsplass | B2B |
|---|---|---|
| Inntekt | 18 % av hjelperandelen | Abonnement fra leverandøren |
| Effektiv margin | **15,25 %** av kundens total | **94,3 %** dekningsbidrag |
| Vaktordning 24/7 | Vår kostnad, den tyngste posten | Leverandørens |
| ID-kontroll, referanser, kurs | Vår kostnad per hjelper | Leverandørens – hun er arbeidsgiver |
| Ansvarsforsikring for hjelpere | Vår | Leverandørens |
| Betalingsformidling | Vår, med konsesjonsspørsmål | Finnes ikke |
| Break-even | **2 843 besøk/mnd** ≈ 1 140 aktive familier | **75 betalende leverandører** |

Den siste linjen er hele poenget. Vi flyttet break-even fra noe som krever et
marked, til noe som krever en kundeliste.

Grunnen er at vi sluttet å bære kostnaden ved å garantere for mennesker. Under
markedsplassmodellen finansierte serviceavgiften ID-kontroll, referansesamtaler,
sikkerhetskurs, forsikring og en vakt som svarte innen 15 minutter døgnet rundt.
Under B2B er medarbeideren ansatt hos leverandøren, og leverandøren bærer alt
det. Vi selger programvare.

---

## 1. Forutsetninger

### 1.1 Pris

Anbefalt modell (se `FORRETNINGSUTVIKLING.md` punkt 6): **per medarbeider**, ikke
per selskap. Regnestykkene under bruker **1 490 kr/mnd** = ti medarbeidere à 149.

Dagens prisliste i `assets/js/besok-abonnement.js` er fortsatt 990 engangs for
pilot og 499/mnd for standard. **Den er ikke oppdatert, og det er et bevisst
åpent punkt** – prisen skal testes på ti betalende piloter først, ikke settes
fra et regneark.

### 1.2 Enhetspriser

| Post | Verdi | Grunnlag |
|---|---|---|
| SMS | 0,29 kr **(anslag)** | Nordisk nivå |
| Betalingsgebyr | 1,9 % + 2,50 kr **(anslag)** | Kort/Vipps, månedlig trekk |
| Fullt belastet utvikler | 780 000 kr/år **(anslag)** | 645 000 lønn × 1,21 |
| Fullt belastet support | 560 000 kr/år **(anslag)** | 463 000 lønn × 1,21 |

---

## 2. Variabel kostnad per kunde per måned

Regnet for en leverandør med rundt 200 besøk i måneden, der omtrent 60 % har
familievarsling slått på.

| Post | Beløp |
|---|---|
| SMS til familien (ca. 120 meldinger) | 35 kr |
| E-post og øvrig varsling | 5 kr |
| Infrastruktur, variabel andel | 15 kr |
| Betalingsgebyr på abonnementet | 31 kr |
| **Sum variabel** | **86 kr** |
| **Dekningsbidrag ved 1 490 kr** | **1 404 kr (94,3 %)** |

Merk hvor liten SMS-posten er. Det er verdt å vite, fordi familievarsling er
produktets kjerne og det er fristende å tro at den koster noe. Den gjør ikke det.

---

## 3. Faste kostnader

| Post | Per måned |
|---|---|
| Utvikling, ett årsverk | 65 000 kr |
| Support og drift, et halvt årsverk | 23 333 kr |
| Ansvars- og cyberforsikring | 3 000 kr |
| Regnskap, revisjon, administrasjon | 6 000 kr |
| Infrastruktur, fast del | 3 000 kr |
| Løpende juridisk (databehandleravtale, vilkår) | 4 000 kr |
| **Sum** | **104 333 kr/mnd** = 1 252 000 kr/år |

Den siste posten er ikke pynt. Vi er databehandler for hver eneste kunde, og
databehandleravtalen må vedlikeholdes når regelverket eller produktet endrer
seg. Kutter man den, kutter man det som gjør produktet salgbart.

---

## 4. Break-even og resultat

Dekningsbidrag 1 404 kr per kunde per måned mot faste kostnader på 104 333 kr:

**Break-even: 75 betalende leverandører** = 1 341 000 kr ARR.

| Antall kunder | Inntekt/mnd | Dekningsbidrag | Resultat/mnd |
|---|---|---|---|
| 10 | 14 900 | 14 044 | −90 289 |
| 50 | 74 500 | 70 220 | −34 114 |
| 75 | 111 750 | 105 300 | ≈ 0 |
| 100 | 149 000 | 140 439 | +36 106 |
| 300 | 447 000 | 421 317 | +316 984 |

Kapitalbehovet er dermed: hva det koster å komme til 75 kunder. Med ren
gründersalg og ingen selger er det rundt **18 måneder à 104 000 kr ≈ 1,9 mill.
kr** før det snur, forutsatt at man treffer 75 innen da.

---

## 5. Følsomhet: hva som faktisk flytter tallet

| Endring | Ny break-even | Kommentar |
|---|---|---|
| Pris 499 i stedet for 1 490 | **253 kunder** | Mer enn tre ganger så langt fram |
| Pris 2 500 | **43 kunder** | |
| Uten utvikler (kjøpt utvikling) | 46 kunder | Men da stopper produktet |
| Support i fullt årsverk | 92 kunder | Sannsynlig ved 100+ kunder |
| Churn 5 %/mnd | – | Break-even nås aldri; tilsiget spises opp |

To ting flytter dette, og bare to: **prisen og churn.** Kostnadskutt gjør nesten
ingenting, fordi 94 % av abonnementet allerede er dekningsbidrag. Det er den
gode nyheten i en høymargin-modell og også fellen: det finnes ingen kostnader å
kutte seg ut av et for lavt prispunkt.

---

## 6. Det vi ikke vet

1. **Churn.** Alt over hviler på den. Vi har null observasjoner.
2. **Antall besøk per leverandør per måned.** Driver SMS-kostnaden og, viktigere,
   om produktet faktisk er i bruk.
3. **Betalingsviljen.** 1 490 er regnet, ikke testet.
4. **Supportbelastningen.** Et halvt årsverk er et anslag. Denne kundegruppen
   ringer heller enn å skrive, og det er en annen kostnad enn en supportinnboks.

Punkt 1 og 3 avgjøres av de ti betalende pilotene. Punkt 2 og 4 måles fra dag én.
