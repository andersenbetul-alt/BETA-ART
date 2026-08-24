# API-kontrakten

`assets/js/api.js` er det eneste stedet frontend snakker med en backend.
`DEMO = true` i dag; byttet skal koste én linje. Dette dokumentet sier hva
serveren må svare, slik at byttet faktisk gjør det.

Kontrakten er uavhengig av de tre avgjørelsene i `docs/AUTH.md`. Enten det blir
Supabase eller noe annet, må endepunktene se slik ut for at frontend skal
virke uendret.

## Tre endepunkter

| | Metode | Sti |
|---|---|---|
| Send engangskode | POST | `/api/v1/auth/otp/send` |
| Bekreft engangskode | POST | `/api/v1/auth/otp/verify` |
| Registrer hjelper | POST | `/api/v1/hjelpere/registrering` |

Alle tar og gir JSON. `credentials: 'same-origin'` er satt i `post()`.

## `auth/otp/send`

```json
→ { "telefon": "+4799887766" }
← { "sent": true }
```

`demoKode` finnes bare i demomodus, og skal **aldri** komme fra en ekte server.
Kommer den, lekker serveren koden til den som ba om den.

Svar `200` også når nummeret er ukjent. Et svar som skiller kjent fra ukjent
nummer, er et oppslagsverk over hvem som er registrert.

## `auth/otp/verify`

```json
→ { "telefon": "+4799887766", "kode": "123456" }
← { "verified": true }
```

Feil kode gir `{ "verified": false }`, ikke en HTTP-feil. Frontend skiller
allerede på det.

Koden skal ha kort levetid og et forsøkstak. Både forsøket og utfallet hører
hjemme i `innlogging` – formål «oppdage misbruk», nitti dagers frist, se
`sql/001-besok.sql`.

## `hjelpere/registrering`

```json
→ { "fornavn": "…", "telefon": "…", "bydel": "…", "erfaring": "…", … }
← { "ok": true, "referanse": "PP-260901-4821", "status": "til_verifisering" }
```

**`erfaring` er fritekst, og er det eneste feltet i søknaden som kan bære en
helseopplysning.** Skjemaet sperrer den i dag med `PP_VERN.sjekk()` i
nettleseren. Det holder bare så lenge det ikke finnes et endepunkt å sende
til.

Serveren må kjøre samme sperre. Reglene finnes som `vern_sjekk(text)` i
`sql/001-besok.sql`, generert fra samme ordliste som frontend leser.
Blokkert innhold skal avvises, ikke lagres – heller ikke som bevis på
blokkeringen:

```json
← 422 { "ok": false, "sperret": "helse",
        "beskjed": "Dette ser ut som en helseopplysning. …" }
```

`beskjed` skal komme fra serveren, ikke settes sammen i frontend. Da er det
ett sted teksten kan endres.

## Feil

| Kode | Betyr | Frontend gjør |
|---|---|---|
| `200` | Gikk bra | Går videre |
| `422` | Innholdet kan ikke lagres | Viser `beskjed` i feltets `role="alert"` |
| `429` | For mange forsøk | Ber brukeren vente |
| `5xx` | Vår feil | «Prøv igjen» – aldri en teknisk melding |

`post()` kaster på alt som ikke er `res.ok`. Skal `422` bære en beskjed til
brukeren, må `post()` lese kroppen før den kaster. Det er én endring, og den
hører til samme commit som `DEMO = false`.

## Det som ikke skal finnes i noen respons

Etternavn, adresse, fødselsdato, helseopplysninger, engangskoden, eller noe
som skiller et kjent nummer fra et ukjent. `PP_VERN.LAGRES_ALDRI` er lista.
