# Overleveringsprompter – Pathfinder fase 4

Kopier én blokk om gangen inn i `/make-plan` (eller gi den til en agent).
Rekkefølgen er den anbefalte. Hver blokk er selvbærende.

## 1. PP_VERN-kappen

```
Mål: Alle skjermer som bruker PP_VERN.sjekk() viser resultat.beskjed uendret
og leser bare felter kontrakten har ({ok, funn:[{id,navn,beskjed,ord}],
logglinje, beskjed} – besok-vern.js:205–233).

Kallsteder som skal endres:
- hjelper-registrering.js:160–167: slett den hardkodede teksten, vis beskjed
  fra vernet (via hjelper-base sitt kast).
- hjelper-base.js:105–113: kast { beskjed, kategorier } fra kontrakten i
  stedet for egen generisk grunn.
- ekspertbistand.js:728–733: slett f.hva/f.istedenfor (finnes ikke i
  kontrakten – fallbackene fyrer alltid); bruk funn[].navn/beskjed.
- klarhet.js:374–381: vurder om egen istedenfor-tekst er villet produkttekst;
  ellers beskjed.
- Dokumentér fail-open-policyen (vaktene i besok-nytt.js:73,
  besok-utfor.js:113, hjelper-opptak.js:481) i besok-vern.js-hodet og lås
  den med én enhetstest.
Flytdiagram: PATHFINDER-2026-08-24/01-flowcharts/a-besok-livslop.md og
b-klarhet.md. Vokter: ikke innfør noen felles «vis feil»-komponent – regelen
er å bruke beskjed-strengen som finnes; C-området (registrering.js,
bestilling.js) skal IKKE ettermonteres (parkert kode), bare merkes.
Sikkerhetsregel fra CLAUDE.md: tester skrives i samme endring.
```

## 2. Meldinger til familien

```
Mål: Én meldingskilde. PP_SPRAK.melding() (besok-sprak.js:271–304) tar over
for familiemelding() i besok-lager.js:330–358; kanApnes/GODKJENT-mønsteret
fra sprak-ui.js:336,363–381 kopieres inn i PP_SPRAK som kanSendes().

Kallsteder:
- besok-utfor.js:150 og besok-historikk.js:66 kaller PP_SPRAK.melding().
- besok/utfor.html og besok/historikk.html laster besok-sprak.js (i dag gjør
  ingen HTML-side det).
- familiemelding() slettes fra besok-lager.js.
- Bindetesten enhet.test.js:785–788 utvides: PP_KLAGE.MEDARBEIDERVARSEL og
  PP_KVALITET.SPORSMAL holdes i takt med PP_SPRAK.SPRAK.
To villede atferdsendringer (skriv dem inn i testene): signaturen blir «via
Naviar Care», og oppgavelista kommer fra rapport.sjekkliste (utførte), ikke
b.oppgaver (planlagte).
I samme endring, klarhet-skjermene: språkvelger byggSprak() ×3, tegnAkutt()
×3 og settOppOpplesning ×2 (se 02a B1–B3 for fil:linje) flyttes til én
hjelper i PP_SPRAK_UI. PP_SPRAK_UI består som egen modul – IKKE slå sammen
språklistene; utvalget er en produktbeslutning.
Vokter: ingen ny abstraksjon over tabellene; fem tabeller blir tre
(PP_SPRAK, PP_SPRAK_UI, kontraktene) bundet av tester.
```

## 3. Småfiks-bunta

```
Mål: Ni små, uavhengige rettelser fra PATHFINDER-2026-08-24/02a (kortlista)
og fase 1-funnene. Én commit per punkt eller én samlet – men hver med test
der det finnes en regel å holde fast:
1. arbeiderlenke()/arbeiderhref() (besok-nytt.js + besok-oversikt.js,
   ordrett duplikat) → PP_BESOK; utfor-kontrakten peker samme sted.
2. Én e-postregex (fire steder, to varianter i dag – velg én, skriv testen).
3. esc(): likhets-test over alle fem kopiene; i A flyttes den til PP_BESOK.
4. PP_RUTER: idiom 1 overalt (02a A2; to no-op-registreringer i dag).
5. Én DEMO-ekspertliste (to lister + én hardkodet person i B i dag).
6. Samtykkebanneret lastes ikke på familie.html m.fl. – attributtene settes
   aldri der (c-info-og-drift.md); last app.js-banneret der det mangler.
7. drift.js finnSoknadIndeks: −1-vakt før splice.
8. klarhet.html laster ikke merkesprak.js → hverdagsguide.js:198-kanten er
   sovende: last modulen, eller slett kanten (velg og begrunn).
9. hjelper-registreringens PP_VERN-beskjed er dekket av prompt 1 – hopp over
   her hvis 1 er gjort.
Vokter: surgical – ingen opprydding utover punktene; norsk; kjør npm test
(329+153) etter hvert punkt.
```

## 4. Ett feltregister

```
Mål: PP_VERN.LAGRES er eneste feltregister. Hjelperfeltene (hjelper-base.js,
lagret under pp_hjelperbase_v1) føres inn i LAGRES med behandlingsgrunnlag
og slettefrist (CLAUDE.md-regelen: testen krever begge per felt);
verktoy/lag-skjema.js utvides til å generere hjelpertabellen fra samme
register, og hjelper-base leser fristene derfra.
Verifikasjon: regenerer SQL og diff mot innsjekket fil (observasjon 13:
regenerering + diff er standardverifikasjonen); kjør de fire
krympetrinnene mot ekte Postgres slik docs beskriver for besok-tabellen.
Vokter: ikke rør les/rydd/skriv-mønsteret (bevisst duplisert policy);
sletting skjer fortsatt ved lesning, ikke nattjobb.
```
