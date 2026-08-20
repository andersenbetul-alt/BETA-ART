# Salgsmodell – Naviar Care (B2B)

Eier: salg. Gjelder produktet som selges nå: et abonnement til en privat
tjenesteleverandør. Markedsplassens salgsmodell – abonnementsnivåer mot familier,
arbeidsgiverspor, provisjon – ligger i `docs/arkiv/SALG-markedsplass.md` og
gjelder ikke.

---

## 0. De fem reglene salget aldri bryter

1. **Vi lover aldri at noen er trygg.** Vi dokumenterer at et besøk ble utført.
   Forskjellen er hele produktet, og den er også forskjellen på et
   koordineringsverktøy og et omsorgsansvar vi ikke har.
2. **Vi selger aldri inn i helsehjelp.** Ikke medisinering, ikke stell, ikke
   vurdering av helsetilstand – heller ikke «vi kan jo notere det i fritekstfeltet».
   Feltet blokkerer det, og selgeren skal vite hvorfor.
3. **Vi er ikke arbeidsgiver, og sier det i første møte.** Leverandøren eier
   medarbeideren, arbeidsgiveransvaret og den faglige vurderingen. Selger vi oss
   som noe mer, selger vi oss inn i et ansvar vi ikke har forsikret.
4. **Ingen gratis pilot.** En gratis pilot måler entusiasme, ikke verdi. Prisen
   kan være lav; null er ikke en pris.
5. **Ingen kunde uten databehandleravtale.** Ikke «vi ordner det etterpå». Vi er
   databehandler fra første besøk som registreres, og avtalen er det som gjør den
   behandlingen lovlig.

---

## 1. Hvem vi selger til

**Primær:** privat tjenesteleverandør med 5–50 ansatte som utfører praktiske
besøk hjemme hos eldre. For liten for Gerica eller CosDoc, for stor til å ha
oversikt i hodet. Det er hele kilen.

**Ikke nå:** de store konsernene (egne systemer), kommunene (anskaffelsesprosess,
6–18 måneders syklus, krever referanser vi ikke har), familier direkte (gjør oss
til forbrukerleverandør – se `JURIDISK-GRENSE.md`).

**Kjøperen i selskapet** er eieren eller daglig leder. Hun kjører også vaktlister.
Det betyr korte møter, konkrete tall, og at et salg som krever tre møter ikke blir
noe salg.

---

## 2. Pris

| Plan | Pris | Innhold |
|---|---|---|
| Pilot | 990 kr engangs | 30 dager, inntil 50 kunder, stopper av seg selv |
| Standard | **149 kr per aktiv medarbeider per måned**, minimum 745 (fem) | Ubegrenset antall besøk og familiemeldinger |

Per medarbeider, ikke per selskap. Tre grunner: prisen vokser med kunden uten ny
forhandling, den er lett å regne på for en eier som kjenner staben sin, og den
gjør et gjennomsnittskjøp til rundt 1 490 kr i stedet for 499 – som er
forskjellen på en modell der man har råd til å selge og en der man ikke har det
(`OKONOMI.md` punkt 5).

**Åpent punkt, bevisst:** `assets/js/besok-abonnement.js` har fortsatt 499/mnd.
Prisen settes etter de ti betalende pilotene, ikke før.

---

## 3. Samtalen

Ikke demo først. Ett spørsmål først:

> «Hva var det siste tilsynet eller den siste klagen hos dere – og hva manglet
> dere da?»

Svaret avgjør hvilken av to samtaler dette er.

**Hvis svaret handler om dokumentasjon** – vi kunne ikke vise hva som ble gjort,
vi fant ikke igjen hvem som var der, vi hadde notert noe vi ikke skulle notert –
da er dette et etterlevelsessalg, og det er det sterkeste vi har:

- Besøket dokumenteres med fast utfall, ikke fritekst som kan bli en journal.
- Helseopplysninger, fødselsnummer og bankdata blokkeres før lagring.
- Sletteplanen krymper besøket i fire trinn og kjører ved hver lesning.
- Automatiske avgjørelser logges med sju felter, og et menneske kan overstyre alt.

**Hvis svaret handler om telefonene** – familier som ringer og spør om mor fikk
besøk – er det et tidsbesparelsessalg. Svakere, men ekte. Regn på det i møtet:
antall besøk i uka × andel med pårørende som ringer × fem minutter.

---

## 4. Innvendinger

**«Vi har allerede et system.»**
Hva skjer i systemet når besøket er utført? Hos de fleste: ingenting utad. Vi
konkurrerer ikke om planleggingen, vi legger til det som skjer etterpå.

**«Vi ringer familiene selv.»**
Hvor mange rakk dere i går? Poenget er ikke at dere ikke ringer. Det er at dere
ringer dem som maser, og ikke dem som lurer i stillhet.

**«Er dette lov?»**
Ja, og her er hvorfor: vi er databehandler, dere er behandlingsansvarlig,
databehandleravtalen følger med, vi lagrer ingen helseopplysninger, og
sletteplanen står skriftlig. Hvis de ikke stiller dette spørsmålet, still det
selv – det er det beste argumentet vi har, og det bygger tilliten som lukker.

**«For dyrt.»**
Per medarbeider per måned er det under en time av hennes tid. Hvis produktet
sparer under en time i måneden totalt, skal de la være å kjøpe.

**«Kan vi prøve gratis?»**
Nei, men piloten er 990 for tredve dager og stopper av seg selv. Ingen binding,
ingen oppsigelse.

---

## 5. Salgsprosessen

| Steg | Mål | Tid |
|---|---|---|
| 1. Kvalifisering | 5–50 ansatte, praktiske besøk, ingen helsehjelp i det vi skal dekke | 10 min telefon |
| 2. Spørsmålet | Tilsyn eller telefoner – hvilket salg er dette | Samme samtale |
| 3. Demo | Ett besøk fra opprettelse til familiemelding. 12 minutter | Video |
| 4. Pilot | 990 kr, signert databehandleravtale, ett virkelig besøk samme uke | Samme uke |
| 5. Overgang | Etter 30 dager: standard eller stopp | Uke 5 |

**Målet er ikke signatur i steg 4. Målet er ett virkelig besøk registrert samme
uke.** En pilot uten et besøk i uke én blir aldri en kunde, og det er bedre å
vite det med én gang.

---

## 6. Det vi måler

| Tall | Hvorfor | Stopp-punkt |
|---|---|---|
| Besøk per leverandør per uke, etter uke 4 | Om produktet er i drift eller bare kjøpt | Faller det mot null, er de tapt |
| Andel piloter som går til standard | Betalingsvilje, målt ærlig | Under 40 % → prisen eller produktet |
| Andel aktive i uke 12 | Det eneste tallet som betyr noe | **Under 6 av 10 er problemet produktet, ikke salget** |

Det siste er skrevet ned på forhånd med vilje. Et stopp-punkt man setter etterpå,
er ikke et stopp-punkt.
