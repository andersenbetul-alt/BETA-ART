# Designgrunnlag

Regelen er enkel: **ingen skjerm bygges før spørsmålet den skal svare på er
undersøkt.** Ikke fordi research er en dyd, men fordi målgruppa her ikke er
oss. Vi er ikke åtti år, vi bor ikke i en annen by enn foreldrene våre, og vi
har ikke stått i en NAV-sak vi ikke forstår. Alt vi «vet» om disse skjermene
uten å ha sett etter, er en gjetning med selvtillit.

Dette dokumentet er ikke en oppfordring. Det er et krav med en sjekkliste, og
sjekklisten har tall.

## Rekkefølgen

For hver nye skjerm eller vesentlige endring:

| Steg | Hva | Utfall |
|---|---|---|
| 1 | **Hvem leser dette, og hva spør de om?** | Én setning. Ikke en persona |
| 2 | **Hva er allerede undersøkt?** | Kilder med tall, ikke «best practice» |
| 3 | **Hva sier tallene som vi ikke ville gjettet?** | Minst ett funn som overrasket |
| 4 | **Hva blir grenseverdiene her?** | Skrevet inn i CSS eller modul, med begrunnelse |
| 5 | **Hvilken test holder dem fast?** | En test som feiler hvis verdien endres |
| 6 | **Hva er fortsatt uavklart?** | Skrevet ned, ikke glemt |

Steg 5 er det som skiller dette fra et notat. En grenseverdi uten test er en
verdi som forsvinner i neste travle commit.

## Hva som teller som kilde

I denne rekkefølgen:

1. Fagfellevurdert forskning
2. Standarder med tall: WCAG, EN 301 549
3. Publiserte brukerstudier: NN/g, NIA/NIH
4. Tilsynsmyndigheters veiledere: Digdir, Forbrukertilsynet, EDPB
5. Egen brukertesting

Det som **ikke** teller: en artikkel som siterer en artikkel som siterer noe.
Et designsystem fra et stort selskap er et valg de tok, ikke et bevis. «Alle
gjør det slik» er en beskrivelse av markedet, ikke av brukeren.

WCAG er et **minimum**, ikke et mål. En skjerm som akkurat passerer AA, er
laget for å bestå en test – ikke for å leses av noen på 82.

## Grenseverdiene vi har satt, og hvorfor

Tallene under står i koden. Endres de, skal en test si fra.

| Hva | Verdi | Hvor | Hvorfor |
|---|---|---|---|
| Brødtekst, den eldres skjerm | 20 px | `godkjenn.css` | 17 px er satt for pårørende på 40–70. Den eldre leser ofte på en telefon hun holder for langt unna |
| Svarknapper, ja/nei | 96 px høye | `godkjenn.css` | 44 px treffes ikke av en hånd som skjelver. Bomskudd her er feil svar på et samtykke |
| Valgflater, bestilling | 76 px | `bestill.css` | Samme grunn, lavere innsats: her er et bomskudd bare irriterende |
| Kontrast, all tekst | ≥ 4,5:1 | `styles.css` | Tallene per farge står i merkevareskillet |
| Grønn på mørk flate | egen farge | `styles.css` | `--brand` gir 2,9:1 mot blekket. Derfor `--brand-pa-mork` |
| Tilstand | aldri farge alene | overalt | En som ikke skiller farger, skal få den samme beskjeden |

## Samtykke: fire ting vi ikke gjør

Dette er ikke smak. Det er forskjellen på et samtykke og en bekreftelse av
noe andre har bestemt.

1. **Ingen forhåndsvalgt knapp.** Et ja som allerede står der, er ikke et ja.
2. **Ja og nei har samme størrelse, vekt og kontrast.** En blek nei-knapp er
   ikke et valg, det er en oppfordring.
3. **Nei krever ingen begrunnelse.** Ber vi om en grunn, har vi laget en
   terskel foran det ene svaret – og da er de to svarene ikke like.
4. **Ingen nedtelling, ingen «to plasser igjen».** Kunden er bekymret på
   vegne av en forelder. Det er den tilstanden hastemarkedsføring er bygget
   for å utnytte.

Testene i `tests/e2e.test.js` måler de to første i piksler. Den tredje sjekkes
ved at det ikke finnes noe felt. Den fjerde står i `PP_KLARHET.ALDRI_SELG`.

## Det vi ennå ikke vet

Skrevet ned fordi et åpent spørsmål som ikke står noe sted, blir til en
antakelse i løpet av noen uker.

- Om «Les opp»-knapper faktisk brukes av eldre, eller er dekorasjon vi føler
  oss bedre av
- Om oppdeling i steg hjelper eller forvirrer – begge påstander er utbredt
- Hvordan man unngår at den som godkjenner blir en formalitet
- Om 45 minutter er riktig når det er tre parter i samtalen
- Hvilke ti språk som er de riktige ti, målt mot SSB og ikke mot magefølelse

## Hvem som eier hva

`.claude/agents/ux-forskning.md` avgjør om et funn er et mønster eller en
enkelthistorie. `.claude/agents/tjenestedesign.md` avgjør om skjermen henger
sammen med resten av tjenesten. Ingen av dem kan overstyre
`docs/JURIDISK-GRENSE.md`.
