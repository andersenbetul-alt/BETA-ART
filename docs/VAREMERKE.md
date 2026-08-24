# Varemerket: alt som kan forberedes herfra, og det som må gjøres utenfra

Status 24.08.2026, etter red-team v0.1: **IMAGE PASS / UPLOAD PACKAGE
REVISE / FILING HOLD.** Dette dokumentet er innleveringsforberedelsen –
det samler det som er avgjort, det som må avgjøres, og den nøyaktige
oppskriften for søkene som ikke kan kjøres fra dette miljøet.

## 1. Representasjonen

| Krav | Status |
|---|---|
| JPEG, sRGB, 300 DPI, under 2 MB | ✅ (2400x800, 82 926 B) |
| Én representasjon, ingen tilleggsinfo | ✅ |
| Vedleggsnavn ≤ 25 tegn (EX-25-12) | ❌ – lag opplastingskopi `NAVIARCARE_FIG_v01.jpg` (22 tegn). Arkivnavnet beholdes internt. *Grensen er ikke etterprøvd herfra – euipo.europa.eu er proxyblokkert; verifiser mot beslutningsteksten før innsending* |
| Visuell godkjenning | 🔶 RT-01/RT-03 krever A/B (symbol+ordmerke mot ordmerke alene; CARE-sporing A mot høyrestilt B) avgjort ved gjenkjenningstest, ikke smak. Webflaten bruker i dag ordmerke-lås med løsning A |

## 2. Klasser: Nice-forslag som følger den juridiske grensen

Produktets rettslige posisjon (docs/JURIDISK-GRENSE.md) er programvare for
tjenesteleverandører – ikke helsehjelp. Klassevalget må si det samme:

| Klasse | Dekker | Hvorfor |
|---|---|---|
| **42** | SaaS: programvare for planlegging, dokumentasjon og varsling av praktiske besøk | Kjerneproduktet |
| **9** | Nedlastbar programvare | Framtidig app; billig å ta med nå |
| **36** | Rådgivning om pensjon og økonomiske ytelser | Klarhet 45 (NAV/pensjon) |
| **45** | Personlige og sosiale tjenester ytt av andre for å dekke individuelle behov | Vurderes for følge/samvær-formidling – bare hvis modell B (egne ansatte) velges |
| **44 – bevisst UTELATT** | Helse- og omsorgstjenester | Å søke i 44 ville motsi hele den juridiske grensen. Fravær av klasse er samme grep som fravær av kode |

TMclass-termene formuleres på engelsk før innsending; utkast ligger i
tabellen over og spisses når klassevalget er avgjort.

## 3. Søkeprotokollen (må kjøres utenfra – registrene er proxyblokkert her)

Kjør samme dag, lagre PDF/skjermbilde med dato – RT-06 krever *daterte* søk:

1. **TMview** (tmview.org): ordsøk `NAVIAR`, `NAVIA*`, `NAV?AR`; deretter
   figurativt søk på stilisert N med utskåret element (bruk Vienna-veilederen
   i grensesnittet – ikke gjett kodene). Filtrer på klassene 9, 36, 42, 44, 45.
2. **Patentstyret** (search.patentstyret.no): samme ordsøk; sjekk også
   foretaksnavn i Enhetsregisteret (naviar* – ledigheten er ukjent herfra).
3. **WIPO Global Brand Database**: ordsøk + bildesøk med selve JPEG-en.
4. Kjente naboer fra tidligere (usystematisk) websøk, til kontroll-lista:
   **NAVIFY (Roche Diagnostics – helsenær, viktigst å avklare)**, NAVIA,
   NAVVIA, NAVI, NAVIADDRESS. Ingen NAVIAR funnet – men det var ikke et
   registersøk og teller ikke som klarering.

## 4. Beslutninger som må protokollføres før innlevering (RT-06)

- **Ord + figur eller bare figur?** Anbefaling: begge – ordmerket `NAVIAR
  CARE` (svakt for CARE, men NAVIAR bærer) og det figurative separat.
  CARE alene klareres aldri i omsorgsklasser; styrken ligger i NAVIAR + form.
- **Søker:** person eller selskap, med organisasjonsnummer. Avklares mot
  Enhetsregisteret (blokkert herfra).
- **Rekkefølge:** Patentstyret først og EUIPO innen 6 mnd med prioritet, eller
  EUIPO direkte. Kostnad/risiko-avveining – piloten er norsk; nasjonal først
  er billigst å tape.
- **A/B-utfallet** for låsen (punkt 1).

## 5. Det som IKKE gjøres

Ingen innsending herfra. Ingen «tescile hazır»-påstand før daterte søk,
klasser og søkeridentitet foreligger – det er red-teamens gate, og den står.
