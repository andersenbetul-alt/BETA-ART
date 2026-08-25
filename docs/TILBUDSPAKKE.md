# Tilbudspakke – mal for jobbtilbud til en medarbeider

Tre deler: tilbudsfeltene lederen fyller ut, e-posten som avtaler samtalen,
og presentasjonen til selve tilbudssamtalen
(`docs/tilbud-presentasjon.html`). Ingenting her gjelder en bestemt person –
`[HAKEPARENTES]` betyr «fylles ut per kandidat».

Rekkefølgen er bevisst: **tallene gis i samtalen og i det skriftlige
tilbudet, aldri i e-posten.** En lønn i en e-post er et forhandlingskort
sendt uten samtale rundt seg.

## 1 · Tilbudsfeltene

Feltene under dekker minstekravene til skriftlig arbeidsavtale i
arbeidsmiljøloven § 14-6. Paragrafhenvisningen er fra modellkunnskap og
skal verifiseres mot Lovdata før første reelle tilbud (fulltekst er sperret
fra dette miljøet – jf. metoden i docs/NAVNET.md).

| Felt | Verdi | Merknad |
|---|---|---|
| Kandidat | `[NAVN]` | Bare navn – ingen fødselsdato eller personnummer i tilbudet |
| Stilling | `[TITTEL]` | F.eks. «Medarbeider, hverdagshjelp» |
| Arbeidsgiver | `[LEVERANDØRENS SELSKAP]` | Aldri Naviar – Naviar er programvaren, ikke arbeidsgiveren |
| Stillingsprosent | `[%]` | Deltid er normalen i bransjen (jf. docs/PROFILREFERANSER.md) |
| Arbeidssted / område | `[BYDEL/OMRÅDE]` | Område, ikke adresser |
| Startdato | `[DATO]` | |
| Prøvetid | `[MÅNEDER]` | Speiler produktets prøveperiode: enkle dagtidsoppdrag først |
| Timelønn | `[KR]` | Referansepunkt fra markedet: tariffestet minstelønn i BPA-utlysning 08/2026 var 225,40 kr (docs/PROFILREFERANSER.md §4) |
| Tillegg kveld/helg | `[KR/%]` | |
| Arbeidstid og vaktordning | `[BESKRIVELSE]` | Faste dager der det er mulig – kontinuitet er produktet |
| Ferie og feriepenger | `[ETTER FERIELOVEN]` | |
| Oppsigelsesfrister | `[UKER]` | |
| Tariffavtale | `[JA/NEI – HVILKEN]` | |
| Pensjon og forsikring | `[ORDNING]` | |
| Politiattest | Tomt til jurist har vurdert hjemmel | Regelen i hjelper-opptak.js gjelder også tilbudsbrevet |

## 2 · E-posten som avtaler samtalen

Emne: **Vi vil gjerne ha deg med – har du tid til en prat?**

> Hei `[FORNAVN]`,
>
> takk for samtalene vi har hatt. Vi har bestemt oss, og vi håper svaret
> blir ja: vi ønsker å tilby deg stillingen som `[TITTEL]` hos
> `[LEVERANDØR]`.
>
> Det viktigste vil vi si i en samtale, ikke i en e-post – både tallene og
> hvorfor vi mener akkurat du passer hos oss. Passer det med en videoprat
> `[DAG]` kl. `[TID]`, eller foreslå gjerne et annet tidspunkt.
>
> Referansene dine sa det samme som vi selv la merke til: folk blir trygge
> på deg. Det er den egenskapen jobben vår er bygget av.
>
> Vennlig hilsen
> `[LEDER]`, `[LEVERANDØR]`
> `[TELEFON]`

Tre regler for e-posten: ingen lønnstall, ingen frist som presser («svar
innen fredag» hører ikke hjemme før det skriftlige tilbudet), og én
konkret, sann setning om hvorfor kandidaten – ikke en mal-kompliment.

## 3 · Presentasjonen

`docs/tilbud-presentasjon.html` – tre flater til skjermdeling: rollen,
tallene, hvorfor deg. Åpnes fra repoet (logoen lastes relativt). Alle
`[FELT]` fylles før samtalen; flaten med tall speiler tabellen over, slik
at det aldri finnes to versjoner av tilbudet.
