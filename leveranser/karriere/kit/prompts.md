# Promptpakke

Skrevet for å fungere i hvilken som helst chat-assistent. Bytt ut det som står
i `[hakeparenteser]`.

## Les dette først

- **Ikke lim inn** fødselsnummer, BankID eller passord, helseopplysninger,
  eller privat kontaktinformasjon til referanser.
- **Modellen vet ingenting om deg** som du ikke har fortalt den. Alt den
  «husker» om din bakgrunn har den funnet på.
- **Alt du får ut skal du lese gjennom og rette.** Det er ditt navn på søknaden.
- Alle promptene under sier eksplisitt at modellen ikke skal finne på noe. Ikke
  fjern den setningen når du tilpasser dem.

---

## Del 1 — Forstå stillingen

### 1.1 Trekk ut kravene

```
Her er en stillingsannonse. List opp de 8 viktigste kravene, rangert etter hvor
tydelig annonsen vektlegger dem. Bruk annonsens egne ord. Skill mellom «må ha»
og «bra å ha». Ikke legg til krav som ikke står der.

ANNONSE:
[lim inn]
```

### 1.2 Les mellom linjene

```
Basert på den samme annonsen: hva slags person ser det ut til at de leter
etter, og hvilket problem prøver de å løse med denne ansettelsen? Svar i tre
setninger. Merk tydelig hva som er slutning fra din side og ikke står i teksten.
```

### 1.3 Spørsmål å stille dem

```
Gi meg 5 spørsmål jeg kan stille i et intervju om denne stillingen, som viser
at jeg har lest annonsen. Ingen spørsmål om lønn eller ferie. Ingen spørsmål
som besvares av annonsen selv.
```

---

## Del 2 — CV-en

### 2.1 Match

```
Her er kravene fra annonsen, og her er min erfaring. For hvert krav: si om jeg
dekker det helt, delvis eller ikke, og pek på hvilken del av erfaringen min som
viser det. Ikke finn på erfaring jeg ikke har nevnt. Avslutt med de tre
svakeste punktene mine.

KRAV: [fra 1.1]
MIN ERFARING: [skriv med egne ord: jobber, oppgaver, resultater, utdanning]
```

### 2.2 Fra oppgave til resultat

```
Skriv om dette CV-punktet så det begynner med et verb og viser et resultat i
stedet for en oppgave. Bruk bare tall jeg har oppgitt. Hvis et tall mangler,
skriv [TALL MANGLER] i stedet for å gjette. Gi meg tre varianter, fra nøktern
til mest konkret.

PUNKT: [ditt punkt]
KONTEKST: [hva du faktisk gjorde, og hva det førte til]
```

### 2.3 Rekkefølgen

```
Her er CV-punktene mine for én jobb, og kravene fra annonsen. Sorter punktene
slik at det mest relevante for denne stillingen står først. Ikke skriv dem om,
bare sorter, og forklar rekkefølgen i én setning.
```

### 2.4 Hull i CV-en

```
Jeg har et opphold i CV-en fra [måned år] til [måned år]. I perioden gjorde jeg
[skriv sant: omsorg, sykdom du selv velger å oppgi, studier, flytting,
arbeidsledighet]. Foreslå tre nøkterne måter å skrive det på, uten unnskyldning
og uten å pynte på det. Jeg vil ikke skjule noe.
```

---

## Del 3 — Søknaden

### 3.1 Utkast

```
Skriv et utkast til en søknad på maks 250 ord, på [norsk/engelsk]. Bruk bare
opplysningene nedenfor — ikke legg til erfaring, utdanning, resultater eller
egenskaper som ikke står der.

Struktur: hvorfor akkurat denne stillingen, hva jeg konkret kan bidra med (tre
punkter fra erfaringen min), og en kort avslutning. Nøktern tone. Ingen
superlativer. Ikke begynn med «Jeg søker herved».

STILLING: [tittel og arbeidsgiver]
DE TRE VIKTIGSTE KRAVENE: [fra 1.1]
MIN ERFARING: [med egne ord]
```

### 3.2 Åpningen

```
Gi meg fem forskjellige førstesetninger til denne søknaden. Hver skal si noe
konkret om stillingen eller om meg — ingen av dem skal kunne brukes på en
hvilken som helst annen søknad.
```

### 3.3 Kritikk

```
Les denne søknaden som en travel rekrutterer som bruker 30 sekunder.
Svar på: Hva sitter du igjen med? Hvilken setning er svakest, og hvorfor?
Hvilken påstand mangler dekning? Ikke skriv den om — bare pek.

SØKNAD: [ditt utkast]
```

### 3.4 Kort ned

```
Denne søknaden er [antall] ord. Kort den ned til 200 uten å miste noe konkret.
Fjern gjentakelser og fyllord først, ikke innhold.
```

---

## Del 4 — Etterpå

### 4.1 Oppfølging

```
Skriv en kort, høflig oppfølgings-e-post. Jeg søkte på [stilling] hos
[arbeidsgiver] den [dato], og har ikke hørt noe. Maks 80 ord. Ikke masete,
ikke unnskyldende.
```

### 4.2 Etter avslag

```
Skriv et kort svar på et avslag der jeg takker for tilbakemeldingen og spør om
de kan si hva som skilte den som fikk jobben. Maks 60 ord. Ingen bitterhet.
```

---

## Til slutt

Gå gjennom hver setning og spør: **er dette sant om meg?** Alt som ikke er det,
stryker du. Modellen bryr seg ikke om det er sant. Det gjør arbeidsgiveren.
