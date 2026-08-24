# Matchingmotoren, tilbudsbølgene og prisen

Motoren finnes i `assets/js/matching.js` (`PP_MATCHING`), prisen i
`assets/js/pris.js` (`PP_PRIS`). Dette dokumentet sier hvilke regler de
håndhever og hvorfor – ikke hvordan koden ser ut. Endres en regel her,
endres den i koden og i testene i samme commit.

## Regelen

**Nærmeste kvalifiserte og betrodde hjelper** – ikke nærmeste person.
En som bor 300 meter unna og er ny, taper for en som bor 1,5 km unna og har
vært hos familien sytten ganger. Nærhet er én vekt av sju, ikke dommeren.

## Motoren vet ikke hvem som er arbeidsgiver

Motoren rangerer lista den får. Hvem som står i lista – leverandørens
ansatte (modell A), egne ansatte (modell B) eller begge – er konfigurasjon
hos den som kaller, ikke motorlogikk. Derfor er motoren den samme uansett
hvordan eierbeslutningen i `docs/FORRETNINGSMODELL.md` faller, og ingenting
av den må skrives om etterpå.

## To lag: krav først, poeng etterpå

**Krav er filtre, ikke poeng.** Bryter et oppdrag ett krav, tilbys det
aldri – og hjelperen får en lesbar grunn, ikke taushet.

| Krav | Regel |
|---|---|
| `rodkategori` | Rød kategori (helsehjelp, penger, autorisasjonskrav) formidles aldri – uansett tillitsnivå. Sperren står **først**: er oppdraget rødt, er svaret rødt |
| `tilgjengelig` | Bare den som selv har sagt seg tilgjengelig |
| `kvalifisert` | Bare oppgavetyper hjelperen har krysset av for |
| `tillitsniva` | Oppdragets krav ≤ hjelperens nivå |
| `egenskaper` | Familiens faste krav (ikke-røyker, god fysisk form) må ligge i profilen – mangler ett, hjelper ingen score. Begrunnelsen navngir kravet |
| `avstand` | Hjelperens egen maksavstand respekteres |
| `tidsrom` | Bare tidsrom hjelperen har oppgitt |
| `proveperiode` | Nye hjelpere: lav risiko, dagtid, til fem fullførte |

**Vektene summerer til 100** og står samlet i koden, fordi å endre dem er å
endre tjenestens oppførsel: relasjon 25, nærhet 25, tillit 20, språk 10,
punktlighet 10, transport 5, pris 5. Relasjonen metter logaritmisk – den
ellevte gangen betyr mindre enn den andre.

## Tilbudsbølgene

Alle får ikke varsel samtidig. Kontinuitet har forkjørsrett, men kunden
skal ikke vente lenge på et nei:

| Bølge | Ventetid før neste slippes til |
|---|---|
| 1 · Fast hjelper | 60 s |
| 2 · Familiens krets | 90 s |
| 3 · Verifiserte i nærheten | 120 s |

Er alle bølgene tomme, er det skjermens jobb å spørre kunden om å utvide
søket – motoren finner ikke på et dårligere svar selv.

## Forklarbarhet er et krav, ikke pynt

Hver score kommer med begrunnelser («Du har vært hos denne familien 4
ganger», «1,2 km unna – ca. 12 min reise»), og hvert skjulte oppdrag med en
grunn. Det er samme krav plattformdirektivet (EU) 2024/2831 art. 9–10
stiller til algoritmisk styring: innsyn og menneskelig overprøving. Motoren
foreslår og begrunner; suspensjon og avvisning av personer avgjøres av
mennesker, og finnes derfor ikke i denne modulen.

## Prisen

`PP_PRIS.beregn()` gir hele regnestykket **før** oppdraget bestilles, linje
for linje: arbeid, reisetid (halv sats – reisen skal lønne seg uten å
overprise kunden), reiseutgift, hastetillegg (nå +20 %, i dag +5 %, fast
avtale −5 %, kveld/helg +10 %), og serviceavgift (18 %). Ingen linje er
skjult; `tilHjelper`, `plattform` og `total` ligger åpent i svaret.
Satsene bor i et land-lag (NO/SE/DE) – samme struktur som resten av
Europa-tenkingen i `docs/EUROPA.md`.

Forlenges et oppdrag, er det samme regnestykke med ny tid – og skjermen
skal vise tillegget **før** ekstra tid starter, ikke på kvitteringen.

## Testene

`tests/enhet.test.js`, gruppene «Matching – absolutte krav», «Matching –
rangering» og «Prismodell». Reglene med jus- eller sikkerhetsinnhold har
egne tester: rød kategori tilbys aldri (heller ikke til den mest betrodde),
rød-sperren står foran alle andre, hver bølge bærer sin ventetid, relasjon
slår avstand.
