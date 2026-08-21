# Fem grunnprompts

Disse fungerer i hvilken som helst chat-assistent. Bytt ut det som står i
`[hakeparenteser]`.

**Før du starter:** Ikke lim inn fødselsnummer, helseopplysninger,
passord eller referansers kontaktinformasjon. Alt du får ut skal du lese
gjennom og rette selv — modellen vet ingenting om deg som du ikke har fortalt
den, og den finner på detaljer hvis du lar den.

---

## 1. Finn kravene i annonsen

```
Her er en stillingsannonse. List opp de 8 viktigste kravene, rangert etter
hvor tydelig annonsen vektlegger dem. Skriv dem som korte punkter med
annonsens egne ord. Ikke legg til krav som ikke står der.

ANNONSE:
[lim inn annonseteksten]
```

## 2. Match erfaringen din mot kravene

```
Her er kravene fra en stillingsannonse, og her er min erfaring. For hvert
krav: si om jeg dekker det helt, delvis eller ikke, og pek på hvilken del av
erfaringen min som viser det. Ikke finn på erfaring jeg ikke har nevnt.

KRAV:
[lim inn listen fra prompt 1]

MIN ERFARING:
[skriv med egne ord: jobber, oppgaver, resultater, utdanning]
```

## 3. Skriv om et CV-punkt så det viser resultat

```
Skriv om dette CV-punktet så det begynner med et verb og viser et resultat
i stedet for en oppgave. Bruk bare tall jeg har oppgitt. Hvis et tall mangler,
skriv [TALL MANGLER] i stedet for å gjette. Gi meg tre varianter.

PUNKT: [lim inn punktet ditt]
KONTEKST: [hva du faktisk gjorde, og hva det førte til]
```

## 4. Utkast til søknad

```
Skriv et utkast til en søknad på maks 250 ord, på [norsk/engelsk].
Bruk bare opplysningene nedenfor — ikke legg til erfaring, utdanning,
resultater eller egenskaper som ikke står der.

Struktur: hvorfor akkurat denne stillingen, hva jeg konkret kan bidra med
(tre punkter fra erfaringen min), og en kort avslutning.
Nøktern tone. Ingen superlativer.

STILLING: [tittel og arbeidsgiver]
DE TRE VIKTIGSTE KRAVENE: [fra prompt 1]
MIN ERFARING: [med egne ord]
```

## 5. Test søknaden din

```
Les denne søknaden som en travel rekrutterer som bruker 30 sekunder.
Svar på: Hva sitter du igjen med? Hvilken setning er svakest, og hvorfor?
Hvilken påstand mangler dekning? Ikke skriv den om — bare pek.

SØKNAD: [lim inn utkastet ditt]
```

---

**Etterpå:** gå gjennom hver setning og spør «er dette sant om meg?».
Alt som ikke er det, stryker du. Det er din CV, og det er ditt navn på den.
