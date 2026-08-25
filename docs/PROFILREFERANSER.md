# Profilreferanser – hva ekte stillingsannonser lærer oss

Eieren deler stillingsannonser fra omsorgsfeltet som referanse. Dette
dokumentet samler det generaliserte innholdet: hva hver annonsetype lærer
oss, hva vi tar inn, og hva vi bevisst lar ligge.

**Regel for dokumentet:** ingen navn, ingen gjenkjennbare detaljer om
personene eller familiene i annonsene. En annonse kan navngi et barn og en
familie – innsikten skal inn, personopplysningene skal ikke.

## 1. BPA-annonse for ungdom (personlig assistent)

Ett menneske, mange små behov, én stabil relasjon. Datapunktet bak
teamprinsippet i `docs/HJELPETEAM.md`.

Krav i annonsen som IKKE kan gjenbrukes hos oss, og hvorfor:

| Annonsen krever | Vår regel |
|---|---|
| Bestemt kjønn | Kjønn står i IKKE_KRITERIUM (`hjelper-opptak.js`) og kan aldri vektes |
| God fysisk og psykisk helse | Helseopplysninger samles ikke inn; arbeidet beskrives, søkeren vurderer selv |
| Flytende norsk | Språk er nivåbasert (B1) og bekreftes av oss, ikke av søknaden |
| Politiattest | Krever hjemmel; BPA har den, vi har den ikke før jurist har vurdert |
| Førerkort som absolutt krav | Fordel, aldri krav – kunder kjøres aldri i medarbeiderens bil |

BPA opererer under helselovgivningen; «stell» i en BPA-annonse er nettopp
punktet der BPA og Naviar skiller lag (rød kategori).

Det som VAR verdt å ta med, ligger nå på karrieresiden
(`besok/bli-medarbeider.html`, «Hvem passer dette for?»): personlige
egenskaper i klarspråk, dyrekomfort, og oppfordringen om å søke selv om
ikke alt stemmer.

## 2. Aktivitør/frivillighetskoordinator på sykehjem

Institusjonsrolle – ikke en Naviar-medarbeiderprofil. Tre innsikter likevel:

- **Månedsplanen.** Annonsen krever at aktivitetsplanen «gjøres kjent for
  pasienter, pårørende og ansatte i god tid». Det er nøyaktig
  «Mitt hjelpeteam»-skjermen vi har planlagt (HJELPETEAM.md): faste dager,
  synlige for den eldre og familien på forhånd. Institusjonene har allerede
  lært at forutsigbarhet ER tjenesten – vi bygger samme prinsipp for hjemmet.
- **Frivillighet er en egen kategori arbeidskraft.** Sykehjemmet
  koordinerer frivillige ved siden av ansatte. Naviar-modellen er betalte
  ansatte hos leverandøren; frivillige har andre regler for ansvar,
  forsikring og attest (jf. Nyby i konkurrentauditen). Ikke v1, og aldri
  blandet inn i samme tildelingsflyt uten egen juridisk vurdering.
- **Skoleelever («innsats for andre»)** er mindreårige i tjeneste – utenfor
  vår modell for verifisering og tillitsnivå. Noteres som mulighet for
  leverandørene selv, ikke som Naviar-funksjon.

Fra samme annonses kvalifikasjonsliste:

- **ADL-vurderinger og helseplattformen** (journalsystemet) er
  helsepersonellarbeid. En Naviar-medarbeider vurderer aldri funksjonsnivå
  og dokumenterer aldri i journal – rapporten vår er faste utfall uten
  helseinnhold. At institusjonsrollen krever dette, bekrefter hvor grensen
  går, ikke at vi skal flytte den.
- **«Personlig egnethet er avgjørende»** – standardformulering i norske
  omsorgsannonser. Vår oversettelse er referansesamtalene og prøveperioden
  (fem enkle dagtidsoppdrag), ikke en magefølelse i intervjuet.
- **Trivselsoppgavene** («dekorere huset etter årstid, beplanting, enkle
  oppgaver som får hverdagen til å flyte») er lavrisiko og hjemlige –
  kandidat til faste utfall i katalogen (pynte til høytid, stelle planter)
  når kategoriene utvides. Notert, ikke lagt inn.

## 3. Mønstre fra åpne utlysninger (nettsøk 25.08.2026)

Søk i norske utlysninger for hjemmehjelp/praktisk bistand og aktivitør
bekrefter mønstrene over:

- Vanligste kvalifikasjonskrav: norsk på B1-nivå, førerkort, grunnleggende
  digitale ferdigheter. Vårt skjema dekker alle tre – med førerkort som
  fordel, ikke krav.
- Vanligste personlige egenskaper: skape trygghet, tillit og gode
  relasjoner; selvstendig; stabil, lojal og samvittighetsfull;
  løsningsorientert. Karrieresidens liste treffer samme register i
  klarspråk.
- Kommunale annonser for praktisk bistand krever ofte autorisasjon og
  legemiddelkunnskap fordi rollene er blandet (helse + praktisk). Naviar
  er nettopp den ublandede halvparten – det er differensieringen, ikke en
  mangel.
- Aktivitørrollen beskrives gjennomgående med koordinering av frivillige
  og veiledning av kolleger – en leder-/institusjonsrolle, ikke en
  medarbeiderprofil for oss.

Kilder: arbeidsplassen.nav.no (utlysninger for praktisk bistand og
helgestillinger), karrierestart.no (hjemmehjelp Vestre Aker; aktivitør Horg
og Kleppestø), utdanning.no/yrker/beskrivelse/aktivitor, finn.no
(aktivitørvikariat), oslo.kommune.no (praktisk bistand-tjenesten).

## Mønsteret så langt

Annonsene bekrefter to ting uavhengig av hverandre: relasjonen er
produktet (samme person over tid), og forutsigbarhet er trygghet (planen
kjent på forhånd). Begge er allerede kodet – relasjonsvekt 25/100 og
tilbudsbølger i `matching.js`. Det annonsene tilfører, er ordlyden folk
faktisk bruker, og bekreftelsen på at «Mitt hjelpeteam»-skjermen er neste
riktige byggekloss.
