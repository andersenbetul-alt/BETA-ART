# Teamet

Åtte roller, definert som agenter i `.claude/agents/`. Hver rolle har et eget
ansvarsområde, faste rammer den ikke bryter, og en arbeidsform som gir konkrete
leveranser i stedet for prinsipper.

| Rolle | Eier | Fil |
|---|---|---|
| Tjenestedesign | Helheten mellom de fire brukergruppene | `tjenestedesign.md` |
| Teknologi | Arkitektur, datamodell, sikkerhet, testdekning | `teknologi.md` |
| KI | Matching, tale, akuttgjenkjenning, forklarbarhet | `ai.md` |
| Copywriting og UX-tekst | All tekst kunden ser | `copywriter.md` |
| Merkevare | Navn, tone, visuell identitet, tillitsmerker | `brand.md` |
| Markedsføring | Posisjonering, kanaler, vekst per by | `marketing.md` |
| Salg | Prismodell, abonnement, B2B, partnerskap | `salg.md` |
| Økonomi | Enhetsøkonomi, kapitalbehov, kontantstrøm | `finans.md` |
| Juridisk | Personvern, klassifisering, betaling, ansvar, vilkår | `juridisk.md` |

## Bruk

```
Agent(subagent_type: "tjenestedesign", prompt: "…")
```

## Felles rammer

Alle roller arbeider innenfor de samme fire reglene. De er ikke policy-tekst –
de er implementert i koden og dekket av tester:

1. Posisjon brukes kun mens hjelperen selv har slått på tilgjengelighet.
2. Adressen til den eldre åpnes først når oppdraget er tildelt, og skjules etterpå.
3. Akutte situasjoner går til nødetatene, aldri gjennom oppdragsflyten.
4. Automatiske avgjørelser er forklarbare, og ingen konto stenges permanent uten et menneske.
5. Minst mulig deling er standardvalget, og å si nei skal være like lett som å si ja.

En rolle som foreslår noe som bryter en av disse, skal si det høyt i stedet for å
skrive rundt det.

## Hvordan rollene henger sammen

```
tjenestedesign  definerer flyten
      ↓
copywriter      skriver teksten i flyten
      ↓
teknologi + ai  bygger den
      ↓
brand           holder stemmen og merket samlet
      ↓
marketing       fyller toppen av trakten
      ↓
salg            lukker og prissetter
      ↓
finans          sier om regnestykket går opp
```

Pilene går også motsatt vei: finner `finans` at enhetsøkonomien ikke bærer, går
saken tilbake til `tjenestedesign`, ikke til en prisøkning alene.

## Koordinering

Arbeid som krever flere roller samtidig, tar vi i hovedøkten: hver rolle leverer
sitt bidrag i `docs/team/`, og syntesen — der rollene er uenige, og hva vi
velger — skriver vi i `docs/team/SYNTESE.md`.
