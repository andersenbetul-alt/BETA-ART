# Teknologi – arkitekturbeslutning for fase 2

Fra statisk pilot til backend. Dokumentet er skrevet for å kunne implementeres:
tabeller med kolonner, endepunkter med felt, og en rekkefølge som kan følges.

Grunnlag: `README.md`, `docs/ROADMAP.md`, `docs/TESTING.md`, `docs/GDPR.md`,
`docs/DPIA.md`, og koden i `assets/js/`.

Prinsippet gjennom hele dokumentet: **velg det kjedeligste som løser problemet.**
Hver avhengighet må forsvare seg selv, og hver forsvarsmekanisme skal helst være
en egenskap ved datatypen eller skjemaet – ikke en regel noen må huske.

---

## 0. Beslutningen i kortform

| Lag | Valg | Viktigste grunn |
|---|---|---|
| Kjøretid | Node.js 22 LTS | Samme språk som `matching.js`, som skal kjøre uendret på begge sider |
| Språk | JavaScript + JSDoc, ingen byggesteg | Piloten har ikke byggesteg; det er en styrke, ikke en mangel |
| Rammeverk | Fastify 5 | Skjemabasert *responsserialisering* er selve adressevernet |
| Database | PostgreSQL 16 | Begrensninger, transaksjoner og datatyper som håndhever personvernreglene |
| Datatilgang | `pg` + håndskrevet SQL, ingen ORM | Hver `SELECT` lister kolonnene sine synlig |
| Migrasjoner | `node-pg-migrate`, rene SQL-filer | Migrasjonene er gjennomlesbare av en revisor |
| Økter | Serverside økttabell + HttpOnly-cookie | «Frys konto» må virke i samme sekund |
| Jobber | Egen Node-prosess med Postgres advisory lock | Slettejobben trenger ikke en kø-server |
| Hosting | Scaleway (FR/NL): Instances + Managed PostgreSQL + Object Storage | Én EU-eid leverandør, én databehandleravtale, ingen tredjelandsoverføring |
| SMS | LINK Mobility (NO) | Nordisk leverandør, EØS-lagring, enkel DPA |

Nye produksjonsavhengigheter totalt: **seks**. De er listet og begrunnet i 1.9.

---

## 1. Stack

### 1.1 Kjøretid: Node.js 22 LTS

Det avgjørende argumentet er ikke smak, men et arkitekturkrav fra rollen:
*matchingens score og begrunnelse skal beregnes samme sted, slik at de aldri kan
komme i utakt.* `assets/js/matching.js` er allerede skrevet som en modul som
kjører både i nettleser og i Node – enhetstestene laster den med `require`. Velger
vi Node på serveren, kan **den samme filen** være fasit begge steder. Velger vi noe
annet, må motoren skrives på nytt, og da er utakt et spørsmål om tid.

- **Go** – raskere, lavere minnebruk, ett binært artefakt. Valgt bort fordi det
  tvinger fram en andre implementasjon av matchingmotoren. Ytelsesgevinsten er
  irrelevant på pilotens volum; forklarbarhetsrisikoen er ikke.
- **Python/Django** – modent og med sterk admin. Samme innvending: andre språk,
  andre matchingmotor. Django admin frister som driftskonsoll, men vi har allerede
  en driftskonsoll med egne alvorsgrader og frister.
- **Deno / Bun** – ikke kjedelig nok. Færre år i produksjon, færre driftsfolk som
  kan feilsøke dem klokken tre om natten under en P1-sak.

### 1.2 Rammeverk: Fastify 5

Fastify velges for én konkret egenskap: **responsskjema strippet ved
serialisering**. Et felt som ikke står i responsskjemaet, blir ikke sendt – uansett
hva SQL-en tilfeldigvis returnerte. Regelen «gateadressen ligger ikke i
oppdragslisten» blir dermed håndhevet av rammeverket, ikke av en utvikler som
husker å plukke felter.

```js
// Adressen kan ikke lekke ut her, uansett hva spørringen returnerer.
const oppdragsliste = {
  response: { 200: { type: 'object', properties: {
    aktuelle: { type: 'array', items: { type: 'object',
      properties: { id:{type:'string'}, tittel:{type:'string'}, bydel:{type:'string'},
                    avstandKm:{type:'number'}, betaling:{type:'integer'} },
      additionalProperties: false } } } } }
};
```

- **Express** – mer utbredt og mer kjedelig, men løser ikke problemet. Validering
  og responsfiltrering må hentes inn som separate biblioteker og påføres manuelt
  per rute. Da er vi tilbake til «utvikleren må huske det».
- **NestJS** – dekorasjoner, DI-container og TypeScript-byggesteg for en tjeneste
  med rundt tretti endepunkter. Rammeverket er større enn problemet.
- **Ingen rammeverk (`node:http`)** – fristende, men da skriver vi selv ruting,
  validering, serialisering og feilhåndtering. Det er ikke kjedelig, det er bare
  udokumentert.

### 1.3 Språk: JavaScript med JSDoc, fortsatt uten byggesteg

Frontend forblir statiske filer uten bundling. Backend skrives i samme dialekt.
Typesjekk kjøres som `tsc --noEmit --checkJs` i CI – typene finnes, men de er
kommentarer, og ingen kildefil må kompileres for å kjøre.

- **TypeScript** – bedre typer, men innfører et byggesteg, en `dist/`-katalog og
  et sett kildekart. Det bryter med det eneste som gjør dette repoet lett å
  overta. Vurderes på nytt når backend passerer omtrent 5 000 linjer.

### 1.4 Database: PostgreSQL 16

Valgt fordi personvernkravene lar seg uttrykke som databasebegrensninger:

- `numeric(6,3)` på posisjonskolonnene gjør det **fysisk umulig** å lagre
  finere oppløsning enn ca. 100 meter. Avrundingen i `registrering.js` er da et
  hyggelig førstelinjeforsvar, ikke den eneste garantien.
- `REVOKE UPDATE, DELETE` på loggtabellene gir append-only uten applikasjonskode.
- Transaksjoner gjør «frys konto» til én operasjon som ikke kan feile halvveis.
- Partielle indekser og `CHECK`-begrensninger håndhever tilstandsmaskinen for
  oppdrag.
- Kolonnenivå-`GRANT` gir et andre lag under adresse- og posisjonstilgangen.

- **MySQL/MariaDB** – fungerer, men svakere `CHECK`-håndheving historisk,
  svakere JSON, ingen `citext`, og mindre presis rettighetsmodell på kolonnenivå.
- **MongoDB** – ingen skjemabegrensninger å lene seg på. For en tjeneste der
  poenget er at visse felt *ikke* finnes visse steder, er skjemafrihet en ulempe.
- **SQLite** – utmerket til testene, uegnet som eneste kilde når to
  applikasjonsinstanser skal skrive og slettejobben skal kunne dokumenteres.
- **PostGIS** – ikke ennå. På pilotens volum holder et rektangelfilter på
  bredde-/lengdegrad etterfulgt av haversine i SQL. PostGIS legges til den dagen
  vi trenger ruting eller polygoner, ikke før.

### 1.5 Datatilgang: `pg` og håndskrevet SQL

Ingen ORM. Grunnen er den samme som ellers i dokumentet: en ORM skjuler hvilke
kolonner som faktisk hentes, og `SELECT *` bak en lazy relasjon er nøyaktig
mekanismen som får en adresse til å dukke opp i en liste den ikke skal ligge i.
Håndskrevet SQL gjør hvert kolonnevalg synlig i en kodegjennomgang.

- **Prisma** – egen skjemadialekt, generert klient, egen migrasjonsmotor og et
  binært hjelpeprogram. Tre nye ting å forstå for å slippe å skrive SQL.
- **Knex** – spørringsbygger uten ORM-ulempene, men løser et problem vi ikke har.
- **Drizzle** – for ung.

### 1.6 Migrasjoner: `node-pg-migrate` med rene SQL-filer

Nummererte filer, opp og ned, kjørt av én kommando. Migrasjonene er en del av
dokumentasjonen mot tilsyn: en revisor skal kunne lese `migrations/` og se når
posisjonstabellen fikk slettejobben sin.

### 1.7 Økter: tabell i Postgres, ikke JWT

`okt`-tabellen slås opp ved hver forespørsel. Det koster ett indeksoppslag og gir
til gjengjeld øyeblikkelig tilbakekalling.

- **JWT** – valgt bort av ett grunn: et signert token kan ikke inndras. Kravet
  «sikkerhetssaker fryser konto først» betyr at en frossen konto skal være ute av
  systemet i samme transaksjon, ikke om inntil femten minutter.
- **Redis-økter** – en datastore til å drifte, sikkerhetskopiere og få DPA for,
  til gjengjeld for latens vi ikke merker.

Innlogging skjer med engangskode på SMS. Dermed finnes det **ingen passordbase**
å lekke. Det er den billigste sikkerhetsgevinsten i hele dokumentet.

### 1.8 Bakgrunnsjobber: egen prosess, Postgres advisory lock

Slettejobbene (posisjon, engangskoder, kladdedata, referanser, utløpte
personvernforespørsler) kjøres av `jobber/kjor.js`, startet av en systemd-timer
hvert femte minutt. Prosessen tar `pg_try_advisory_lock` slik at to instanser
aldri kjører samtidig, og skriver en rad i `jobblogg` for hver kjøring.

- **BullMQ/Redis, Temporal, Cloud-scheduler** – kø-infrastruktur for fire cron-
  jobber. Nei.
- **`pg_cron`** – nær ved å vinne, men holder logikken i databasen der den er
  vanskeligere å teste og versjonere sammen med koden.

### 1.9 Avhengighetsbudsjett

| Pakke | Hvorfor den er nødvendig |
|---|---|
| `fastify` | HTTP, validering, responsserialisering |
| `@fastify/cookie` | Signert øktcookie |
| `@fastify/static` | Server de statiske filene fra samme opphav (se 1.10) |
| `@fastify/rate-limit` | Rategrense på OTP og innlogging |
| `pg` | Databasedriver |
| `node-pg-migrate` | Migrasjoner |

Hashing (`scrypt`), tilfeldighet (`randomBytes`), UUID og HMAC tas fra
`node:crypto`. Ingen `bcrypt`, ingen `uuid`, ingen `dotenv` – konfigurasjon leses
fra miljøvariabler direkte.

### 1.10 Hosting: Scaleway, EU/EØS, ett opphav

**En hard føring fra eksisterende kode:** `assets/js/api.js` bruker relativ sti
`/api/v1` og `credentials: 'same-origin'`. Skal skjemakoden være urørt, **må API
og statisk nettsted ligge på samme opphav**. Det utelukker en arkitektur der
frontend står på en CDN og API-et på et annet vertsnavn.

Anbefalt oppsett:

```
naerhjelp.no  ──►  Caddy (TLS, HSTS, CSP-header)
                     ├── /            → statiske filer (@fastify/static)
                     └── /api/v1/*     → Fastify
                            │
                            ├── Managed PostgreSQL 16 (privat nett, TLS, PITR)
                            └── Object Storage (dataeksport, kryptert, kort levetid)
```

To små instanser bak en lastbalanserer i Paris (`fr-par`) eller Amsterdam
(`nl-ams`). Region-låst lagring. Én databehandleravtale for hele stacken.

- **AWS eu-north-1 (Stockholm) / Azure North Europe** – teknisk overlegne og
  kjedelige på den gode måten. Valgt bort fordi leverandøren er
  amerikanskkontrollert. `docs/DPIA.md` er et *blokkerende* punkt før
  posisjonsfunksjonene settes i drift, og en tredjelandsvurdering med CLOUD
  Act-analyse forlenger nettopp den vurderingen. Valget er tatt for å gjøre DPIA-en
  kortere, ikke for å slippe unna skyen.
- **Vercel/Netlify med serverløse funksjoner** – bryter samme-opphav-forutsetningen
  i praksis, gir kaldstart på OTP-endepunktet der brukeren venter, amerikansk
  behandler, og gjør en langtkjørende slettejobb til noe annet enn en cron.
- **Egen maskinvare / on-prem** – vi har ingen som vil våkne til diskbytte.
- **Hetzner (DE) + Aiven (FI)** – fullgod reserveløsning, begge EU-eide. Nevnt
  fordi valget skal kunne gjøres om uten at noe annet i dokumentet endres.

### 1.11 Testregimet består

Kravet «testene skal kunne kjøres uten nettverk og uten installasjon utover Node»
gjelder fortsatt. Løsningen er den samme som for Playwright i dag: integrasjonstester
mot Postgres **hopper over seg selv** når `DATABASE_URL` ikke er satt, i stedet for
å feile.

```
npm run test:enhet   # matching, pris, datamodellkontrakt – null avhengigheter
npm test             # + nettleser hvis Playwright finnes, + database hvis DATABASE_URL finnes
```

CI kjører alle tre lagene med en Postgres-tjenestecontainer.

---

## 2. Datamodell

Konvensjoner: `uuid` primærnøkler generert av applikasjonen (`randomUUID`),
`timestamptz` overalt, beløp i **øre** som `integer` (aldri flyttall om penger),
snake_case i databasen.

**Ikke i modellen noe sted:** fødselsnummer, D-nummer, kontonummer, IBAN,
kopi av legitimasjon, diagnoser, medisinlister. ID-kontroll og utbetaling ligger
hos leverandør; vi lagrer kun leverandørens referanse og et ja/nei.

### 2.1 Person og konto

```sql
CREATE TABLE person (
  id                   uuid PRIMARY KEY,
  fornavn              text NOT NULL,
  etternavn            text NOT NULL,
  fodselsdato          date NOT NULL,
  epost                citext UNIQUE NOT NULL,
  telefon              text UNIQUE NOT NULL,          -- E.164
  telefon_verifisert   timestamptz,
  status               text NOT NULL DEFAULT 'aktiv',
      -- aktiv | frosset | stengt | sletting_bestilt | anonymisert
  opprettet            timestamptz NOT NULL DEFAULT now(),
  sist_endret          timestamptz NOT NULL DEFAULT now(),
  slettes_etter        date,                          -- kontoens levetid + 90 dager
  CONSTRAINT myndig CHECK (fodselsdato <= current_date - interval '18 years'),
  CONSTRAINT gyldig_status CHECK (status IN
    ('aktiv','frosset','stengt','sletting_bestilt','anonymisert'))
);

CREATE TABLE rolle (
  person_id  uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  rolle      text NOT NULL,
      -- hjelper | familie | mottaker | drift_saksbehandler | drift_leder | verifiserer
  tildelt    timestamptz NOT NULL DEFAULT now(),
  tildelt_av uuid REFERENCES person(id),
  PRIMARY KEY (person_id, rolle)
);
```

Aldersgrensen er en `CHECK`, ikke bare en validering i `registrering.js`. Testen
«under 18 år avvises» får dermed en andre håndhevelse den ikke kan omgå.

### 2.2 Hjelper

```sql
CREATE TABLE hjelper (
  person_id        uuid PRIMARY KEY REFERENCES person(id) ON DELETE CASCADE,
  status           text NOT NULL DEFAULT 'soknad',
      -- soknad | til_verifisering | godkjent | frosset | avvist | pensjonert
  referanse        text UNIQUE NOT NULL,              -- «PP-260819-4821», vises brukeren
  by               text NOT NULL,
  postnummer       text NOT NULL CHECK (postnummer ~ '^[0-9]{4}$'),
  maks_avstand_km  smallint NOT NULL CHECK (maks_avstand_km IN (2,5,10,20)),
  tillitsniva      smallint NOT NULL DEFAULT 1 CHECK (tillitsniva BETWEEN 1 AND 3),
  tillitsscore     smallint NOT NULL DEFAULT 50 CHECK (tillitsscore BETWEEN 0 AND 100),
  punktlighet      smallint NOT NULL DEFAULT 100,
  i_proveperiode   boolean  NOT NULL DEFAULT true,
  fullforte_oppdrag integer NOT NULL DEFAULT 0,
  timesats_ore     integer,
  utbetaling_form  text CHECK (utbetaling_form IN ('privat','foretak')),
  orgnummer        text CHECK (orgnummer ~ '^[0-9]{9}$'),
  erfaring         text CHECK (length(erfaring) <= 600),
  opprettet        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE hjelper_oppgave      (hjelper_id uuid, oppgave text,  PRIMARY KEY (hjelper_id, oppgave));
CREATE TABLE hjelper_sprak        (hjelper_id uuid, sprak   text,  PRIMARY KEY (hjelper_id, sprak));
CREATE TABLE hjelper_transport    (hjelper_id uuid, form    text,  PRIMARY KEY (hjelper_id, form));
CREATE TABLE hjelper_tilgjengelighet (
  hjelper_id uuid, dag text, tidsrom text, PRIMARY KEY (hjelper_id, dag, tidsrom));
```

`by` og `postnummer` blir liggende på `hjelper`. Det er bevisst: postnummer er
grovmasket og brukes i **hver** matcheforespørsel, også når hjelperen har sagt nei
til posisjon. Gateadresse til hjelperen samler vi ikke inn i det hele tatt.

```sql
CREATE TABLE hjelper_tilstand (          -- «Jeg er tilgjengelig» må eies av serveren
  hjelper_id     uuid PRIMARY KEY REFERENCES hjelper(person_id) ON DELETE CASCADE,
  tilgjengelig   boolean NOT NULL DEFAULT false,
  endret         timestamptz NOT NULL DEFAULT now(),
  gjelder_til    timestamptz     -- automatisk «av» etter 8 timer, aldri på for evig
);
```

I dag lever bryteren bare i `tavle.js`. Siden bryteren er det eneste som åpner for
posisjonsbruk, må serveren kjenne den – ellers er posisjonsregelen en påstand om
frontend, ikke en egenskap ved systemet.

### 2.3 Posisjon – egen tabell, eget tilgangsnivå, egen slettejobb

```sql
CREATE TABLE posisjon (
  id            uuid PRIMARY KEY,
  person_id     uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  lat           numeric(6,3) NOT NULL,   -- ca. 100 m. Finere oppløsning kan ikke lagres.
  lon           numeric(6,3) NOT NULL,
  noyaktighet_m smallint,
  kilde         text NOT NULL CHECK (kilde IN ('registrering','tilgjengelig','oppdrag')),
  oppdrag_id    uuid REFERENCES oppdrag(id) ON DELETE CASCADE,
  samtykke_id   uuid NOT NULL REFERENCES samtykke(id),  -- hvilket samtykke som hjemler raden
  opprettet     timestamptz NOT NULL DEFAULT now(),
  gyldig_til    timestamptz NOT NULL,
  CONSTRAINT kort_levetid CHECK (gyldig_til <= opprettet + interval '24 hours'),
  CONSTRAINT oppdragsposisjon_har_oppdrag
    CHECK (kilde <> 'oppdrag' OR oppdrag_id IS NOT NULL)
);
CREATE INDEX posisjon_utlop ON posisjon (gyldig_til);
CREATE UNIQUE INDEX posisjon_en_aktiv_per_person
  ON posisjon (person_id) WHERE kilde = 'tilgjengelig';
```

Fire strukturelle garantier, ikke fire regler noen må huske:

1. `numeric(6,3)` – finere presisjon er ikke representerbar.
2. `kort_levetid` – ingen rad kan opprettes med mer enn 24 timers levetid.
3. Den unike partielle indeksen – ingen historikk av tilgjengelighetsposisjoner
   hoper seg opp; nye erstatter gamle.
4. `samtykke_id NOT NULL` – en posisjonsrad uten et dokumentert samtykke kan ikke
   settes inn.

Slettejobben:

```sql
-- kjøres hvert 5. minutt av jobber/slett-posisjon.js
DELETE FROM posisjon WHERE gyldig_til < now();
DELETE FROM posisjon WHERE opprettet < now() - interval '24 hours';  -- tak, uansett
```

I tillegg: `PUT /hjelpere/meg/tilgjengelighet {tilgjengelig:false}` sletter
personens posisjonsrader i **samme transaksjon** som tilstanden endres. Bryteren
av betyr borte nå, ikke borte om fem minutter.

```sql
CREATE TABLE jobblogg (               -- beviset på at slettingen faktisk skjer
  id            bigserial PRIMARY KEY,
  jobb          text NOT NULL,
  startet       timestamptz NOT NULL,
  varighet_ms   integer NOT NULL,
  antall_slettet integer NOT NULL,
  eldste_slettet timestamptz,
  feil          text
);
```

Innsjekk lagrer **avstand i meter**, ikke koordinatet. Kontrollen «var hjelperen
på stedet» besvares uten at et punkt blir liggende igjen.

### 2.4 Adresse – egen tabell, eget tilgangsnivå, egen slettejobb

```sql
CREATE TABLE adresse (
  id            uuid PRIMARY KEY,
  oppdrag_id    uuid NOT NULL REFERENCES oppdrag(id) ON DELETE CASCADE,
  gateadresse   text NOT NULL,
  etasje        text,
  portkode      text,
  merknad       text,          -- «Ring på Bjerke»
  postnummer    text NOT NULL,
  poststed      text NOT NULL,
  bydel         text NOT NULL, -- den eneste geografien oppdragslisten får se
  opprettet     timestamptz NOT NULL DEFAULT now(),
  slettes_etter date NOT NULL  -- 90 dager etter at oppdraget er gjort opp
);

CREATE TABLE adresseoppslag (         -- append-only
  id          bigserial PRIMARY KEY,
  adresse_id  uuid NOT NULL REFERENCES adresse(id),
  oppdrag_id  uuid NOT NULL,
  aktor_id    uuid NOT NULL REFERENCES person(id),
  aktor_rolle text NOT NULL,
  grunn       text NOT NULL,   -- 'tildelt_oppdrag' | 'drift_sak' | 'innsyn_egen'
  hendelse_id uuid,            -- pålagt når grunn = 'drift_sak'
  ip_hash     bytea,
  tidspunkt   timestamptz NOT NULL DEFAULT now()
);
REVOKE UPDATE, DELETE ON adresseoppslag FROM pp_app;
```

`bydel` ligger på adressetabellen, men **kopieres** til oppdraget ved opprettelse.
Oppdragslisten leser aldri fra `adresse`. Det er den samme regelen som testen
«oppdragslisten inneholder ingen gateadresse» allerede beskytter i `demodata.js`,
løftet opp i databasen.

### 2.5 Samtykke – append-only

```sql
CREATE TABLE samtykke (
  id         uuid PRIMARY KEY,
  person_id  uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  art        text NOT NULL CHECK (art IN
               ('vilkar','personvern','referansesjekk','posisjon',
                'posisjon_oppdrag','markedsforing','profilbilde','sprak')),
  gitt       boolean NOT NULL,
  versjon    text,                    -- «2026-01»
  tidspunkt  timestamptz NOT NULL DEFAULT now(),
  kilde      text NOT NULL,           -- 'registrering' | 'innstillinger' | 'oppdrag'
  ip_hash    bytea
);
REVOKE UPDATE, DELETE ON samtykke FROM pp_app;
CREATE INDEX samtykke_gjeldende ON samtykke (person_id, art, tidspunkt DESC);
```

Et samtykke oppdateres aldri. Tilbaketrekking er en ny rad med `gitt = false`.
Gjeldende tilstand er siste rad per `(person_id, art)`. Dette er det som gjør at
vi i ettertid kan svare på *hva* personen samtykket til og *når*, som
`docs/GDPR.md` punkt 6 krever.

### 2.6 Oppdrag

```sql
CREATE TABLE oppdrag (
  id                 uuid PRIMARY KEY,
  referanse          text UNIQUE NOT NULL,
  bestiller_id       uuid NOT NULL REFERENCES person(id),   -- pårørende eller den eldre selv
  mottaker_id        uuid NOT NULL REFERENCES person(id),   -- den eldre
  type               text NOT NULL,        -- handling|folge|samvaer|aktivitet|digital|praktisk|ute|dyr|transport
  tittel             text NOT NULL,
  notat              text CHECK (length(notat) <= 400),
  bydel              text NOT NULL,        -- kopi fra adresse; aldri gateadresse her
  starttid           timestamptz NOT NULL,
  varighet_min       smallint NOT NULL,
  tidsrom            text NOT NULL,        -- morgen|formiddag|ettermiddag|kveld
  hastegrad          text NOT NULL,        -- na|idag|planlagt|fast
  krevd_niva         smallint NOT NULL DEFAULT 1,
  risiko             text NOT NULL DEFAULT 'lav',
  sprakonske         text,
  betaling_ore       integer NOT NULL,
  total_ore          integer NOT NULL,
  plattform_ore      integer NOT NULL,
  status             text NOT NULL DEFAULT 'opprettet',
      -- opprettet|tilbudt|tildelt|pagar|ferdig|bekreftet|avlyst|tvist
  tildelt_hjelper_id uuid REFERENCES hjelper(person_id),
  oppmotekode_hash   bytea NOT NULL,       -- scrypt, aldri koden i klartekst
  kode_forsok        smallint NOT NULL DEFAULT 0,
  fast_hjelper_id    uuid REFERENCES hjelper(person_id),
  opprettet          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tildelt_har_hjelper CHECK
    (status NOT IN ('tildelt','pagar','ferdig','bekreftet') OR tildelt_hjelper_id IS NOT NULL)
);

CREATE TABLE oppdrag_krets (       -- familiens «care circle» for dette oppdraget
  oppdrag_id uuid, hjelper_id uuid, PRIMARY KEY (oppdrag_id, hjelper_id));
```

Merk at det ikke finnes en `adresse`-kolonne på `oppdrag`. Den fysiske umuligheten
er poenget.

### 2.7 Matching og tilbud

```sql
CREATE TABLE tilbud (
  id            uuid PRIMARY KEY,
  oppdrag_id    uuid NOT NULL REFERENCES oppdrag(id) ON DELETE CASCADE,
  hjelper_id    uuid NOT NULL REFERENCES hjelper(person_id),
  bolge         smallint NOT NULL CHECK (bolge IN (1,2,3)),
  score         smallint NOT NULL,
  deler         jsonb NOT NULL,       -- {relasjon,naerhet,tillit,sprak,punktlighet,transport,pris}
  begrunnelser  jsonb NOT NULL,       -- ["1,2 km unna – ca. 14 min reise.", …]
  motor_versjon text NOT NULL,        -- hvilken versjon av matching.js som regnet
  sendt         timestamptz NOT NULL DEFAULT now(),
  utloper       timestamptz NOT NULL,
  svar          text,                 -- tatt | avslatt | utlopt
  svar_tidspunkt timestamptz,
  UNIQUE (oppdrag_id, hjelper_id)
);
```

**Score, deler og begrunnelser lagres i samme rad, skrevet av samme kall.** Det er
den tekniske formen på kravet om at score og begrunnelse ikke kan komme i utakt:
de er ikke to spørringer, de er én kolonnegruppe fra én `vurder()`-retur.
`motor_versjon` gjør at et gammelt tilbud kan forklares med reglene som gjaldt da.

Sperrer (oppdrag en hjelper *ikke* får se) lagres **ikke**. De regnes ved
forespørsel, av samme `vurder()`, og returneres i `skjulte`. Å lagre alle
kombinasjoner av hjelper × oppdrag ville vært et personregister vi ikke trenger.
Unntaket er innsigelser:

```sql
CREATE TABLE innsigelse (
  id          uuid PRIMARY KEY,
  person_id   uuid NOT NULL REFERENCES person(id),
  gjelder     text NOT NULL,        -- 'matchesperre' | 'tillitsscore' | 'kontostenging'
  oppdrag_id  uuid,
  sperre_id   text,                 -- 'tillitsniva', 'avstand', 'proveperiode', …
  begrunnelse_vist text NOT NULL,   -- nøyaktig teksten hjelperen fikk se
  paastand    text NOT NULL,
  status      text NOT NULL DEFAULT 'mottatt',
  behandlet_av uuid REFERENCES person(id),   -- alltid et menneske
  svar        text,
  opprettet   timestamptz NOT NULL DEFAULT now()
);
```

### 2.8 Gjennomføring

```sql
CREATE TABLE innsjekk (
  oppdrag_id  uuid PRIMARY KEY REFERENCES oppdrag(id) ON DELETE CASCADE,
  hjelper_id  uuid NOT NULL,
  tidspunkt   timestamptz NOT NULL DEFAULT now(),
  avstand_m   integer,          -- utregnet ved innsjekk; koordinatet lagres ikke
  metode      text NOT NULL     -- 'kode' | 'kode_og_omrade' | 'drift_manuell'
);

CREATE TABLE utsjekk (
  oppdrag_id  uuid PRIMARY KEY REFERENCES oppdrag(id) ON DELETE CASCADE,
  tidspunkt   timestamptz NOT NULL DEFAULT now(),
  minutter    smallint NOT NULL,
  notat       text CHECK (length(notat) <= 400)
);

CREATE TABLE oppgjor (
  oppdrag_id       uuid PRIMARY KEY REFERENCES oppdrag(id),
  leverandor       text NOT NULL,
  ekstern_id       text NOT NULL,     -- leverandørens referanse
  belop_ore        integer NOT NULL,
  plattform_ore    integer NOT NULL,
  status           text NOT NULL,     -- reservert|frigitt|utbetalt|refundert
  oppdatert        timestamptz NOT NULL DEFAULT now()
);
```

`oppgjor` har verken kontonummer eller kortdata. Utbetalingsmottakeren er en
referanse hos betalingsleverandøren.

### 2.9 Verifisering

```sql
CREATE TABLE verifisering (
  id            uuid PRIMARY KEY,
  person_id     uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  art           text NOT NULL,   -- eid | hpr | referanse | sikkerhetskurs | politiattest_vist
  status        text NOT NULL,   -- ikke_startet | pagar | bestatt | ikke_bestatt | utlopt
  leverandor    text,
  ekstern_ref   text,            -- leverandørens saksnummer, ikke persondata
  gyldig_til    date,
  tidspunkt     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (person_id, art)
);

CREATE TABLE referanse_person (
  id             uuid PRIMARY KEY,
  hjelper_id     uuid NOT NULL REFERENCES hjelper(person_id) ON DELETE CASCADE,
  navn           text NOT NULL,
  telefon        text NOT NULL,
  relasjon       text,
  status         text NOT NULL DEFAULT 'ikke_kontaktet',
  svar_tidspunkt timestamptz,
  svar_notat     text,
  slettes_etter  date NOT NULL     -- kontroll + 12 mnd, jf. behandlingsprotokollen
);

CREATE TABLE sertifikat (
  id           uuid PRIMARY KEY,
  hjelper_id   uuid NOT NULL REFERENCES hjelper(person_id) ON DELETE CASCADE,
  type         text NOT NULL,
  hpr_nummer   text,
  verifisert   timestamptz,
  kilde        text
);
```

Ingen kopi av legitimasjon lagres. `eid`-raden er leverandørens ja/nei og
saksnummer – ingenting mer.

### 2.10 Drift, sikkerhetssaker og revisjon

```sql
CREATE TABLE hendelse (
  id             uuid PRIMARY KEY,
  alvorsgrad     text NOT NULL CHECK (alvorsgrad IN ('P1','P2','P3','P4')),
  type           text NOT NULL,
  melder_id      uuid REFERENCES person(id),
  gjelder_id     uuid REFERENCES person(id),
  oppdrag_id     uuid REFERENCES oppdrag(id),
  beskrivelse    text NOT NULL,
  status         text NOT NULL DEFAULT 'mottatt',   -- mottatt|under_arbeid|eskalert|lukket
  frist          timestamptz NOT NULL,              -- P1 +15 min, P2 +1 t, P3 +1 vd, P4 +3 vd
  eier_id        uuid REFERENCES person(id),
  opprettet      timestamptz NOT NULL DEFAULT now(),
  lukket         timestamptz,
  konklusjon     text
);

CREATE TABLE kontostatus_endring (        -- append-only
  id           bigserial PRIMARY KEY,
  person_id    uuid NOT NULL REFERENCES person(id),
  fra_status   text NOT NULL,
  til_status   text NOT NULL,
  arsak        text NOT NULL,
  hendelse_id  uuid REFERENCES hendelse(id),
  utfort_av    uuid REFERENCES person(id),   -- NULL kun når automatisk frys
  automatisk   boolean NOT NULL DEFAULT false,
  tidspunkt    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT permanent_stenging_krever_menneske
    CHECK (til_status <> 'stengt' OR utfort_av IS NOT NULL)
);
REVOKE UPDATE, DELETE ON kontostatus_endring FROM pp_app;
```

`permanent_stenging_krever_menneske` er regelen «en konto stenges permanent av et
menneske, aldri av en terskel i en algoritme» skrevet som en databasebegrensning.
Automatisk frys (`til_status = 'frosset'`) er tillatt uten menneske; permanent
stenging er ikke.

```sql
CREATE TABLE revisjonslogg (              -- append-only, alt annet enn adresseoppslag
  id           bigserial PRIMARY KEY,
  tidspunkt    timestamptz NOT NULL DEFAULT now(),
  aktor_id     uuid REFERENCES person(id),
  aktor_rolle  text NOT NULL,
  handling     text NOT NULL,     -- 'les' | 'endre' | 'eksporter' | 'slett'
  objekt_type  text NOT NULL,
  objekt_id    uuid,
  felt         text[],            -- hvilke sensitive felt som ble berørt
  grunn        text,
  ip_hash      bytea
);
REVOKE UPDATE, DELETE ON revisjonslogg FROM pp_app;

CREATE TABLE okt (
  id           uuid PRIMARY KEY,
  person_id    uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  opprettet    timestamptz NOT NULL DEFAULT now(),
  sist_brukt   timestamptz NOT NULL DEFAULT now(),
  utloper      timestamptz NOT NULL,
  ip_hash      bytea,
  ua_hash      bytea,
  revokert     timestamptz
);

CREATE TABLE otp (
  id           uuid PRIMARY KEY,
  telefon_hash bytea NOT NULL,     -- HMAC, ikke nummeret i klartekst
  kode_hash    bytea NOT NULL,     -- scrypt
  formal       text NOT NULL,      -- 'registrering' | 'innlogging'
  forsok       smallint NOT NULL DEFAULT 0,
  opprettet    timestamptz NOT NULL DEFAULT now(),
  utloper      timestamptz NOT NULL,     -- +5 minutter
  brukt        timestamptz
);
CREATE INDEX otp_opprydding ON otp (utloper);

CREATE TABLE personvernforesporsel (
  id            uuid PRIMARY KEY,
  person_id     uuid NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  art           text NOT NULL,     -- innsyn | retting | nedlasting | sletting
  status        text NOT NULL DEFAULT 'mottatt',
  frist         date NOT NULL,     -- +30 dager
  opprettet     timestamptz NOT NULL DEFAULT now(),
  utfort        timestamptz,
  fil_referanse text,              -- Object Storage-nøkkel, utløper etter 7 dager
  resultat      text
);
```

### 2.11 Frys konto – én transaksjon som ikke kan feile halvveis

```sql
BEGIN;
  INSERT INTO hendelse (…, alvorsgrad, frist) VALUES (…, 'P1', now() + interval '15 minutes')
    RETURNING id;
  UPDATE person SET status = 'frosset', sist_endret = now() WHERE id = $gjelder;
  INSERT INTO kontostatus_endring
    (person_id, fra_status, til_status, arsak, hendelse_id, automatisk)
    VALUES ($gjelder, $fra, 'frosset', 'sikkerhetsmelding', $hendelse, true);
  UPDATE okt SET revokert = now() WHERE person_id = $gjelder AND revokert IS NULL;
  UPDATE tilbud SET svar = 'utlopt', svar_tidspunkt = now()
    WHERE hjelper_id = $gjelder AND svar IS NULL;
  DELETE FROM posisjon WHERE person_id = $gjelder;
  UPDATE hjelper_tilstand SET tilgjengelig = false, endret = now() WHERE hjelper_id = $gjelder;
COMMIT;
```

Én `COMMIT`. Enten er kontoen frosset, øktene revokert, tilbudene trukket og
posisjonen slettet – eller så er ingenting skjedd og saken feiler synlig. Ingen
mellomtilstand der kontoen er frosset men hjelperen fortsatt får oppdrag.

---

## 3. API

Alt under `/api/v1`, samme opphav som nettstedet. JSON inn og ut.
Autentisering: `pp_okt`-cookie (`HttpOnly`, `Secure`, `SameSite=Lax`).
CSRF: `X-PP-Csrf`-header som `api.js` leser fra en følgecookie – ingen sideendring.
Alle skrivende kall aksepterer `Idempotency-Key`.

Feilformat er likt overalt, og lekker aldri interne detaljer:

```json
{ "feil": { "kode": "otp_utlopt", "melding": "Koden er utløpt. Be om en ny." } }
```

### 3.1 Engangskode og økt

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| POST | `/auth/otp/send` | `telefon` | `sent`, `utloperOm` (sek), `forsokIgjen` |
| POST | `/auth/otp/verify` | `telefon`, `kode`, `formal` | `verified`, `verifiseringstoken`, `tokenUtloper` |
| POST | `/auth/okt` | `telefon`, `kode` | `personId`, `roller[]` (setter cookie) |
| DELETE | `/auth/okt` | – | `204` |

`sendOtp` returnerer **aldri** koden i produksjon. `demoKode` finnes bare i
demomodus, og `registrering.js` håndterer allerede at feltet mangler:
`otpForventet = svar.demoKode || null` blir `null`, og `verifyOtp` går til serveren.

`verifiseringstoken` er kortlevd (15 min), engangsbruk, og bundet til telefonnummeret.
Registreringen må vise det fram. Serveren stoler **ikke** på
`person.telefonVerifisert` i innsendingsobjektet.

Rategrense: 3 koder per nummer per 15 min, 10 per IP per time, 5 verifiseringsforsøk
per kode. Overskridelse gir `429` og en P4-hendelse ved gjentakelse.

### 3.2 Registrering

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| POST | `/hjelpere/registrering` | hele `soknad`-objektet fra `registrering.js` + `verifiseringstoken` | `ok`, `referanse`, `status` |
| GET | `/hjelpere/meg` | – | profil uten sensitive felt |
| PATCH | `/hjelpere/meg` | delmengde av profilen | oppdatert profil |

Innfelt er nøyaktig det `registrering.js` allerede bygger:

```
person{fornavn, etternavn, fodselsdato, epost, telefon, telefonVerifisert}
sted{by, postnummer, maksAvstandKm, transport[], posisjon{lat,lon,noyaktighet,tidspunkt}|null}
tilgjengelighet{dager[], tidsrom[], timerPerUke, startdato}
kompetanse{oppgaver[], sprak[], erfaring, sertifikater[], hprNummer}
verifisering{referanser[{navn,telefon,relasjon}], utbetaling, orgnummer}
samtykker{vilkar,personvern,referansesjekk,posisjon,markedsforing}
```

Serverens behandling av `sted.posisjon`: raden skrives til `posisjon` med
`kilde='registrering'`, `gyldig_til = now() + 24 timer`, og `samtykke_id` fra
`samtykker.posisjon`. Er `samtykker.posisjon.gitt = false`, avvises posisjonen med
`400` selv om koordinatet er sendt – samtykket, ikke feltet, er hjemmelen.

Ut er `{ok, referanse, status}`. `registrering.js` leser `svar.referanse`.
Kontrakten er allerede oppfylt.

### 3.3 Tilgjengelighet og posisjon

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| PUT | `/hjelpere/meg/tilgjengelighet` | `tilgjengelig` | `tilgjengelig`, `gjelderTil`, `posisjonSlettet` |
| PUT | `/hjelpere/meg/posisjon` | `lat`, `lon`, `noyaktighet` | `lagret`, `gyldigTil` |
| DELETE | `/hjelpere/meg/posisjon` | – | `204` |
| GET | `/meg/oppslagslogg` | `fra`, `til` | `[{tidspunkt, hva, aktorRolle, grunn}]` |

`PUT /posisjon` svarer `409 tilgjengelighet_av` når `hjelper_tilstand.tilgjengelig`
er usann. Posisjon kan ikke lagres av en hjelper som ikke er tilgjengelig – ikke
fordi klienten lar være å sende den, men fordi serveren nekter.

Serveren avrunder på nytt før innsetting. `numeric(6,3)` er siste ledd.

`GET /meg/oppslagslogg` er ikke pålagt, men er den billigste tilliten vi kan kjøpe:
hjelperen og familien kan selv se hvem som har slått opp adressen eller posisjonen
deres.

### 3.4 Oppdrag og oppdragstavla

| Metode | Sti | Rolle | Inn | Ut |
|---|---|---|---|---|
| POST | `/oppdrag` | familie/mottaker | `type`, `nar`, `starttid`, `varighetMin`, `sprakonske`, `notat`, `mottakerId`, `adresse{gateadresse,etasje,portkode,postnummer,merknad}`, `fastHjelperOnsket` | `oppdragId`, `referanse`, `status`, `pris{linjer[],total}`, `oppmotekode` |
| GET | `/oppdrag/tilgjengelige` | hjelper | – | `{aktuelle[], skjulte[]}` |
| POST | `/oppdrag/{id}/ta` | hjelper | – | `{tildelt, adresse{…}, kontakt{fornavn,telefon}}` |
| POST | `/oppdrag/{id}/avvis` | hjelper | `grunn?` | `204` |
| GET | `/oppdrag/{id}` | rolleavhengig | – | rollefiltrert oppdrag |
| GET | `/oppdrag/mine` | familie | `status?` | oppdragsliste med status |
| POST | `/oppdrag/{id}/avlys` | familie/drift | `grunn` | `status` |

Responsen fra `/oppdrag/tilgjengelige` er **nøyaktig formen `tavle.js` allerede
tegner** fra `PP_MATCHING.rangerOppdrag`:

```json
{
  "aktuelle": [{
    "oppdrag": { "id":"o-1", "type":"handling", "typeNavn":"Handling og ærend",
                 "tittel":"Handlehjelp", "bydel":"Frogner", "avstandKm":1.2,
                 "reisetidMin":14, "varighetTimer":1, "nar":"I dag 15:00",
                 "betaling":372, "notat":"Bruker rullator." },
    "resultat": { "aktuell": true, "score": 88,
                  "deler": { "relasjon":0.94, "naerhet":0.76, "…":0 },
                  "begrunnelser": ["Du har vært hos denne familien 17 ganger.",
                                   "1,2 km unna – ca. 14 min reise."],
                  "sperre": null }
  }],
  "skjulte": [{
    "oppdrag": { "id":"o-3", "tittel":"Følge til legetime", "bydel":"Sagene" },
    "resultat": { "aktuell": false,
                  "sperre": { "id":"tillitsniva",
                              "grunn":"Dette oppdraget krever tillitsnivå 2. Du er på nivå 1. …" } }
  }]
}
```

Responsskjemaet har `additionalProperties: false` og inneholder ingen
adressefelt. Serveren beregner dette ved å kalle **den samme `matching.js`** som
nettleseren bruker i dag; frontend kan fortsatt kjøre motoren lokalt for øyeblikkelig
omsortering, men serverens tall er fasit og sendes med.

`POST /oppdrag/{id}/ta` er det **eneste** stedet en gateadresse forlater serveren
mot en hjelper. Kallet gjør i én transaksjon: sjekk at oppdraget er ledig, sjekk
`vurder()` på nytt serverside, sett `status='tildelt'`, skriv `adresseoppslag`, og
returner adressen. Etter `utsjekk` slutter `GET /oppdrag/{id}` å inkludere
adressefeltet – nøyaktig som testen «adressen skjules igjen etter fullført oppdrag»
krever.

### 3.5 Matching og forklaring

| Metode | Sti | Rolle | Inn | Ut |
|---|---|---|---|---|
| GET | `/oppdrag/{id}/kandidater` | drift | – | `bolger[{navn, hjelpere[{hjelperId, score, deler, begrunnelser}]}]` |
| POST | `/oppdrag/{id}/tilbud` | drift/system | `bolge?` | `{sendt: n, utloper}` |
| GET | `/meg/matchforklaring/{oppdragId}` | hjelper | – | `{aktuell, score, deler, begrunnelser, sperre, motorVersjon}` |
| POST | `/innsigelser` | hjelper | `gjelder`, `oppdragId?`, `sperreId?`, `paastand` | `{innsigelseId, status, svarfrist}` |

`GET /meg/matchforklaring/{oppdragId}` finnes fordi *«en hjelper som stenges ute av
et oppdrag, skal kunne få et svar, ikke bare oppleve at det er stille»*. Endepunktet
er den maskinlesbare formen av det løftet.

### 3.6 Innsjekk og utsjekk

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| POST | `/oppdrag/{id}/innsjekk` | `kode`, `posisjon{lat,lon}?` | `{status:"pagar", startet, avstandOk, avstandM}` |
| POST | `/oppdrag/{id}/utsjekk` | `notat?` | `{status:"ferdig", minutter, belopOre, adresseSkjult:true}` |
| POST | `/oppdrag/{id}/bekreft` | – (familie) | `{status:"bekreftet", utbetalingStatus}` |
| POST | `/oppdrag/{id}/sos` | `beskrivelse?` | `{hendelseId, alvorsgrad:"P1", frist}` |

Koden sammenlignes mot `oppmotekode_hash`. Fem feilforsøk låser innsjekken og
oppretter en P2-hendelse. Posisjonen ved innsjekk brukes til å regne `avstand_m`
og **forkastes deretter** – ingen rad i `posisjon`.

### 3.7 Personverninnstillinger

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| GET | `/meg/personvern` | – | `{samtykker{art:{gitt,versjon,tidspunkt}}, posisjon{aktiv,gyldigTil}, kategorier[]}` |
| PUT | `/meg/samtykker/{art}` | `gitt` | `{art, gitt, tidspunkt}` |
| GET | `/meg/opplysninger` | – | alle lagrede felt om personen (innsyn, art. 15) |
| PATCH | `/meg/opplysninger` | felter som skal rettes | oppdatert (art. 16) |
| POST | `/meg/dataeksport` | – | `{foresporselId, status}` (art. 20) |
| GET | `/meg/dataeksport/{id}` | – | `{status, nedlastingUrl, utloper}` |
| POST | `/meg/sletting` | `bekreftelse: true` | `{foresporselId, frist, hvaSlettesNa[], hvaBeholdes[]}` |
| DELETE | `/meg/sletting/{id}` | – | angrer slettebestillingen |

`PUT /meg/samtykker/markedsforing {gitt:false}` er ett kall. Det er kravet
«tilbaketrekking skal være like enkelt som samtykke» i teknisk form.

`POST /meg/sletting` svarer med hva som faktisk skjer: konto og kontaktopplysninger
anonymiseres, posisjon og adresse slettes umiddelbart, mens oppdragshistorikk og
oppgjør beholdes pseudonymisert så lenge bokføringsreglene krever. Det svaret må
gis før knappen trykkes, ikke etterpå.

### 3.8 Drift

| Metode | Sti | Inn | Ut |
|---|---|---|---|
| GET | `/drift/hendelser` | `alvorsgrad?`, `status?` | kø med frister og oversittelsesmerke |
| POST | `/drift/hendelser` | `alvorsgrad`, `type`, `gjelderId`, `oppdragId?`, `beskrivelse` | `{hendelseId, frist, kontoFrosset}` |
| POST | `/drift/hendelser/{id}/frys` | `arsak` | `{personId, status:"frosset"}` |
| POST | `/drift/hendelser/{id}/konkluder` | `konklusjon`, `tiltak` | `{status:"lukket"}` |
| POST | `/drift/personer/{id}/steng` | `arsak`, `bekreftelse` | `{status:"stengt", utfortAv}` |
| GET | `/drift/soknader` | `status?` | søknadskø |
| POST | `/drift/soknader/{id}/godkjenn` | – | `409` hvis verifiseringskjeden er ufullstendig |

`POST /drift/hendelser` med `alvorsgrad='P1'` kjører fryse-transaksjonen fra 2.11
som del av samme forespørsel. Det er ikke to kall som kan gå fra hverandre.

`POST /drift/personer/{id}/steng` krever en innlogget saksbehandler;
databasebegrensningen i 2.10 avviser forsøket hvis `utfort_av` mangler.

### 3.9 Slik kobles `assets/js/api.js` på uten at skjemakoden endres

Tre grunner til at `registrering.js`, `tavle.js` og `bestilling.js` kan stå urørt:

**1. Bryteren finnes allerede.** `DEMO = false` er hele omkoblingen for de tre
eksisterende metodene. `BASE = '/api/v1'` stemmer med endepunktene over, og
`credentials: 'same-origin'` stemmer med hostingvalget i 1.10.

**2. Signaturene beholdes, argumenter kan bli overflødige.**
`verifyOtp(telefon, kode, forventet)` beholder tre parametere. I produksjon
*ignoreres* `forventet`, og serveren avgjør. Kallstedet i `registrering.js` endres
ikke, og feltet `otpForventet` blir bare stående som `null`.

**3. Nye funksjoner legges til inne i `api.js`, ikke i sidene.**

```js
/* Nytt i api.js – ingen sidefil endres. */
var verifiseringstoken = null;
var csrf = null;

function lesCookie(navn) { /* … */ }

function post(path, body, opsjoner) {
  return fetch(BASE + path, {
    method: (opsjoner && opsjoner.metode) || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-PP-Csrf': csrf || (csrf = lesCookie('pp_csrf')),
      'Idempotency-Key': (opsjoner && opsjoner.idempotens) || tilfeldigNokkel()
    },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  }).then(function (res) {
    if (res.status === 204) return null;
    return res.json().then(function (data) {
      if (!res.ok) throw Object.assign(new Error(data.feil.melding), data.feil);
      return data;
    });
  });
}

return {
  demo: DEMO,

  sendOtp: function (telefon) { /* uendret signatur */ },

  verifyOtp: function (telefon, kode, forventet) {
    if (DEMO) return delay(400, { verified: kode === forventet });
    return post('/auth/otp/verify', { telefon: telefon, kode: kode, formal: 'registrering' })
      .then(function (svar) {
        verifiseringstoken = svar.verifiseringstoken;   // holdes i lukningen
        return { verified: svar.verified };             // samme form som før
      });
  },

  registrerHjelper: function (soknad) {
    if (DEMO) { /* uendret */ }
    // Tokenet legges på her. registrering.js vet ingenting om det.
    return post('/hjelpere/registrering',
      Object.assign({}, soknad, { verifiseringstoken: verifiseringstoken }));
  },

  /* Fase 2–5, brukes av tavle.js når den kobles om – én linje per kallsted. */
  settTilgjengelig: function (pa) { return post('/hjelpere/meg/tilgjengelighet', { tilgjengelig: pa }, { metode: 'PUT' }); },
  lagrePosisjon:   function (p)  { return post('/hjelpere/meg/posisjon', p, { metode: 'PUT' }); },
  slettPosisjon:   function ()   { return post('/hjelpere/meg/posisjon', null, { metode: 'DELETE' }); },
  hentOppdrag:     function ()   { return get('/oppdrag/tilgjengelige'); },
  taOppdrag:       function (id) { return post('/oppdrag/' + id + '/ta', {}); },
  sjekkInn:        function (id, kode, pos) { return post('/oppdrag/' + id + '/innsjekk', { kode: kode, posisjon: pos || null }); },
  sjekkUt:         function (id, notat)     { return post('/oppdrag/' + id + '/utsjekk', { notat: notat || null }); },
  settSamtykke:    function (art, gitt)     { return post('/meg/samtykker/' + art, { gitt: gitt }, { metode: 'PUT' }); }
};
```

**Feltnavn:** API-et returnerer `camelCase` med nøyaktig de navnene frontend
allerede leser – `typeNavn`, `tidsromNavn`, `avstandKm`, `reisetidMin`,
`varighetTimer`, `betaling`, `begrunnelser`, `sperre.grunn`. Oversettelsen fra
`snake_case` i databasen skjer i én serverfil. Alternativet – å endre alle
kallsteder i frontend – er nettopp det oppgaven ber oss unngå.

**Kontrakttest:** en enhetstest validerer `assets/js/demodata.js` mot API-ets
responsskjema. Da kan ikke demofiksturet og API-et gli fra hverandre, og en
utvikler oppdager bruddet uten å starte en database.

---

## 4. Tilgangsstyring

### 4.1 Roller

| Rolle | Er | Får aldri |
|---|---|---|
| `gjest` | uinnlogget | alt personrelatert |
| `mottaker` | den eldre | andres oppdrag |
| `familie` | pårørende med bekreftet relasjon | hjelperens posisjon, andre familiers oppdrag |
| `hjelper` | godkjent eller under søknad | adresse før tildeling, andre hjelperes profil |
| `drift_saksbehandler` | driftsorganisasjonen | permanent stenging, endring av tillitsscore |
| `drift_leder` | eskaleringsnivå | – (men alt logges) |
| `verifiserer` | verifiseringsteam | oppdrag, posisjon, adresse |
| `system` | jobber og matching | ingenting utenfor sin egen jobb |

### 4.2 Feltmatrise

`✓` synlig, `–` ikke i responsen i det hele tatt, `◐` maskert, `L` synlig og logget.

| Felt | Eier selv | Familie | Hjelper (ikke tildelt) | Hjelper (tildelt) | Saksbehandler | Leder | Verifiserer |
|---|---|---|---|---|---|---|---|
| Navn på hjelper | ✓ | fornavn | – | – | ✓ | ✓ | ✓ |
| Navn på mottaker | ✓ | ✓ | – | fornavn | ✓ | ✓ | – |
| Fødselsdato | ✓ | – | – | – | ◐ (alder) | ✓ L | ✓ L |
| E-post | ✓ | – | – | – | ◐ | ✓ L | ◐ |
| Telefon | ✓ | ✓ (egen familie) | – | ✓ L (under oppdrag) | ◐ | ✓ L | ◐ |
| Postnummer/by | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| **Gateadresse** | ✓ | ✓ (eget oppdrag) | **–** | **✓ L** | ✓ L | ✓ L | – |
| Portkode/etasje | ✓ | ✓ | – | ✓ L | ✓ L | ✓ L | – |
| **Posisjon** | ✓ | – | – | – | – | ✓ L (kun P1) | – |
| Avstand i km | – | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| Tillitsscore | ✓ | ◐ (nivå) | – | – | ✓ | ✓ | ✓ |
| Matchescore/begrunnelse | ✓ (egen) | – | ✓ (egen) | ✓ | ✓ L | ✓ L | – |
| Referanser | ✓ | – | – | – | – | ✓ L | ✓ L |
| HPR-nummer | ✓ | – | – | – | – | ✓ L | ✓ L |
| Verifiseringsstatus | ✓ | ja/nei | – | ja/nei | ✓ | ✓ | ✓ |
| Utbetalingsreferanse | ◐ | – | – | – | – | ◐ L | – |
| Hendelser om egen konto | ✓ | – | – | – | ✓ | ✓ | – |

Merk raden **Posisjon**: verken familie, saksbehandler eller hjelperen som har
oppdraget får se hvor motparten befinner seg. Familien ser at hjelperen er sjekket
inn, ikke hvor hjelperen er. Driftsleder kan slå opp posisjon **kun** knyttet til
en åpen P1-sak, og oppslaget er logget med hendelsesnummer.

### 4.3 Hva som logges

Logges alltid, i `adresseoppslag` eller `revisjonslogg`, i samme transaksjon som
lesningen:

- Hvert oppslag i `adresse` (hvem, hvilket oppdrag, hvilken grunn)
- Hvert oppslag i `posisjon` som ikke er personens eget
- Hvert drift-oppslag i `person`, `referanse_person`, `sertifikat`, `verifisering`
- Hver endring av `kontostatus`, `tillitsscore`, `tillitsniva`, `hjelper.status`
- Hver dataeksport og hver sletting
- Hver visning av matchescore for en annen person enn en selv

Logges ikke: personens lesning av egne data (men eksport logges), anonyme
sideoppslag, helsesjekker.

### 4.4 Hvordan det håndheves, ikke bare beskrives

Fire lag, fra ytterst til innerst:

1. **Responsskjema** (Fastify): felt utenfor skjemaet serialiseres ikke.
2. **Én inngang per sensitivt felt.** All lesning av `adresse` går gjennom
   `db/adresse.js`, all lesning av `posisjon` gjennom `db/posisjon.js`. Begge
   funksjonene *krever* `{aktorId, aktorRolle, grunn}` som argument og skriver
   loggraden i samme transaksjon som `SELECT`-en. Det er umulig å lese uten å logge,
   fordi det er samme funksjonskall.
3. **En test som håndhever lag 2.** En enhetstest leser kildefilene og feiler hvis
   strengen `FROM adresse` eller `FROM posisjon` finnes utenfor de to filene. Billig,
   raskt, og den fanger den eneste feilen som virkelig betyr noe her.
4. **Kolonnenivå-`GRANT`.** Rapport- og analysebrukere får en egen databaserolle
   uten `SELECT` på `adresse.gateadresse`, `adresse.portkode` og `posisjon.lat/lon`.

---

## 5. Migreringsrekkefølge

Rekkefølgen er styrt av én regel: **ikke lagre personopplysninger før mekanismen
som sletter dem finnes.**

### Trinn 0 – rydding, før noe backend eksisterer
Punktene i kapittel 6. Ingen nye tabeller, ingen nye endepunkter. CI settes opp med
`npm test` og `tsc --noEmit --checkJs`. Lockfil innføres.
*Utgang: `npm test` grønn i CI, matching.js kjørbar som modul på server.*

### Trinn 1 – fundament uten brukerdata
Postgres, migrasjonsverktøy, Fastify-skjelett, `person`, `rolle`, `okt`, `otp`,
`samtykke`, `revisjonslogg`, jobbkjører med `jobblogg`. Helsesjekk-endepunkt.
Ingenting av dette er synlig for en bruker.
*Utgang: migrasjoner kjører opp og ned, jobbkjøreren logger tomme kjøringer.*

### Trinn 2 – engangskode og økt
`POST /auth/otp/send|verify`, `POST|DELETE /auth/okt`, rategrense, SMS-leverandør
med DPA på plass. `api.js` flippes for `sendOtp`/`verifyOtp`. Registreringen står
fortsatt i demo. Nå finnes det telefonnumre i databasen – derfor må
opprydningsjobben for `otp` kjøre fra dag én.
*Utgang: en ekte SMS kommer fram, koden virker, koden utløper etter 5 minutter.*

### Trinn 3 og 4 – registrering og personverninnstillinger, **i samme leveranse**
`POST /hjelpere/registrering` med hjelpertabellene, **og** hele `/meg/personvern`,
`/meg/opplysninger`, `/meg/dataeksport`, `/meg/sletting`, `/meg/samtykker/{art}`.

Disse skilles ikke. I det øyeblikket den første ekte søknaden lagres, har personen
rett til innsyn, retting, portabilitet og sletting. Å levere trinn 3 uten trinn 4 er
å opprette et register vi ikke kan tømme.
*Utgang: en testperson kan registrere seg, lese alt om seg selv, laste ned det, og
slette seg – uten at noen i drift må gjøre noe manuelt.*

### Trinn 5 – roller, drift og fryseoperasjonen
Rollemodellen, driftskonsollen mot ekte saker, alvorsgrader og frister,
`kontostatus_endring` med menneskekravet, og fryse-transaksjonen fra 2.11.
Dette må stå **før** noen match formidles, fordi en sikkerhetssak uten frysemekanisme
er en sak vi ikke kan svare på.
*Utgang: en P1 fryser konto, revokerer økter og trekker tilbud i én transaksjon –
verifisert med en integrasjonstest som avbryter transaksjonen midtveis.*

### Trinn 6 – oppdrag og adresse, uten posisjon
`oppdrag`, `adresse`, `adresseoppslag`, `db/adresse.js`, `GET /oppdrag/tilgjengelige`
og `POST /oppdrag/{id}/ta`. Matching serverside på **postnummer og bydel**, ikke GPS.
`tavle.js` kobles om.

Dette gir en fungerende oppdragstavle uten å berøre posisjon i det hele tatt. Det er
poenget: posisjon skal være en forbedring av noe som allerede virker, ikke en
forutsetning.
*Utgang: nettlesertesten «oppdragslisten inneholder ingen gateadresse» kjører mot
ekte API.*

### Trinn 7 – **porten**: posisjonsfunksjonene
Alt under må være på plass **før** posisjon settes i drift. Dette er
`docs/ROADMAP.md` rekkefølgekrav 1 og `docs/GDPR.md` punkt 12, gjort etterprøvbart:

- [ ] **DPIA ferdigstilt og signert** (`docs/DPIA.md` er utkast i dag)
- [ ] Databehandleravtale med driftsleverandør, SMS-leverandør og kartleverandør
- [ ] `posisjon`-tabellen i produksjon med `numeric(6,3)` og `kort_levetid`
- [ ] Slettejobben har kjørt i minst 14 dager i staging med dokumentert `jobblogg`
- [ ] `hjelper_tilstand` eies av serveren; `PUT /tilgjengelighet {false}` sletter
      posisjon i samme transaksjon, verifisert med test
- [ ] `db/posisjon.js` er eneste inngang, og kildekodetesten i 4.4 er grønn
- [ ] `GET /meg/oppslagslogg` er tilgjengelig for brukeren
- [ ] Rutine for avviksvarsling innen 72 timer er skrevet og øvd
- [ ] Sletting av posisjon ved kontofrys er dekket av test

Først da: `PUT /hjelpere/meg/posisjon`, nærhetsmatching på koordinat, avstand i
tavla basert på faktisk posisjon.

### Trinn 8 – verifiseringskjeden (fase 3)
eID, HPR-oppslag, strukturert referansesjekk, sikkerhetskurs. Rekkefølgekrav 2 i
veikartet: **kjeden er komplett før første reelle oppdrag formidles.**
`POST /drift/soknader/{id}/godkjenn` svarer `409` når et ledd mangler – testen
«søknad med manglende steg kan ikke godkjennes» flyttes fra demodata til API.

### Trinn 9 – gjennomføring og betaling (fase 5)
Innsjekk, utsjekk, oppgjør via betalingsleverandør. Rekkefølgekrav 3: penger går
gjennom leverandør før noen krone utveksles. Prisberegningen flyttes til serveren
som fasit; `pris.js` blir visning.

### Hva som kan vente

| Kan vente | Hvorfor det går |
|---|---|
| Automatiske tilbudsbølger | Drift kan sende bølge 1 og 2 manuelt i pilotbyen; volumet er lavt |
| Kart og bydelspolygoner | Bydel som tekstfelt holder til første by |
| Push-varsling | SMS og e-post rekker til første hundre hjelpere |
| Tillitsscore som beregnes automatisk | Startverdi og manuell justering med logget begrunnelse |
| Landlag for Europa (fase 7) | Valuta finnes allerede i `pris.js`; resten er etter første by |
| Profilbilde | Frivillig, og krever egen lagringsvurdering |
| Sanntidsoppdatering (WebSocket) | Polling hvert 30. sekund er kjedeligere og godt nok |

### Hva som aldri kan vente

Akuttfilteret. Rekkefølgekrav 4 sier at det aldri skal kunne omgås av en
oppdragsmal. Når `POST /oppdrag` innføres i trinn 6, må akuttgjenkjenningen kjøre
**serverside** på `notat`-feltet, ikke bare i `bestilling.js`. Et oppdrag opprettet
via API uten å gå gjennom skjemaet skal møte den samme sperren.

---

## 6. Teknisk gjeld som bør ryddes før backend kobles på

Sortert etter hva som gjør vondest når ekte data begynner å strømme.

### 6.1 `matching.js` må være en ekte modul i begge verdener — **blokkerende**
Filen eksporterer i dag bare til `global.PP_MATCHING`. `require` fungerer fordi
enhetstesten setter `globalThis.window = globalThis` først. Serveren skal ikke måtte
gjøre det trikset. Legg til fem linjer på slutten:

```js
if (typeof module !== 'undefined' && module.exports) module.exports = global.PP_MATCHING;
```

Uten dette blir motoren skrevet på nytt serverside, og kravet om at score og
begrunnelse aldri kommer i utakt er brutt i første leveranse. Samme grep for
`pris.js`.

### 6.2 HTML bygges med strengsammenslåing og `innerHTML` — **blokkerende**
Sju steder i `tavle.js`, fire i `bestilling.js`, tre i `drift.js`, to i
`registrering.js`. Med demodata er dette ufarlig; med serverdata er det en
injeksjonsflate. Verre: `esc()` brukes ujevnt. I `tavle.js` interpoleres
`o.betaling`, `o.avstandKm`, `o.varighetTimer` og `r.score` **uten** escaping –
det er tall i dag og felt fra et API i morgen. I `registrering.js` går
`etikett(valgtRadio('utbetaling'))` og transport-/dag-/tidsromlistene uescaped inn i
`rad()`, og verdiene kan komme fra en manipulert `sessionStorage`-kladd.

Tiltak: escape alt uten unntak nå, og planlegg overgang til `textContent` og
`document.createElement` for kortene. Samle `esc`/`escapeHtml` i én delt fil –
den finnes i tre kopier i dag (`tavle.js`, `drift.js`, `registrering.js`).

### 6.3 `lastKladd()` bruker ukontrollerte nøkler som CSS-selektor — **blokkerende**
```js
var felter = form.querySelectorAll('[name="' + navn + '"]');
```
`navn` kommer fra `JSON.parse` av `sessionStorage`. En kladd med en preparert nøkkel
kan kaste `SyntaxError` og stoppe hele oppstarten, eller treffe felt den ikke skulle.
Tiltak: bygg en hviteliste over feltnavn fra `form.elements` og ignorer alt annet.

### 6.4 `telefonVerifisert` er klienttilstand som sendes som sannhet — **blokkerende**
`registrering.js` setter `telefonVerifisert: true` i søknaden. Serveren må ignorere
feltet fullstendig og kreve `verifiseringstoken` i stedet (3.2). Dette krever ingen
endring i skjemakoden, men det må være avklart før endepunktet skrives – ellers blir
feltet ved et uhell autoritativt.

### 6.5 Datakontrakten er udokumentert
Frontend leser `typeNavn`, `tidsromNavn`, `avstandKm`, `krevdNiva`, `sprakonske`,
`tidligereOppdragMedHjelper`, `sperre.grunn`. Disse navnene finnes bare som
sammenfall mellom `demodata.js` og `matching.js`. Skriv dem ned som JSON Schema i
`kontrakt/` og legg til en enhetstest som validerer `demodata.js` mot skjemaet.
Da er kontrakten testet før den har en server å bryte mot.

### 6.6 `demodata.js` inneholder gateadresser og lastes av produksjonssider
`oppdrag.html` laster `demodata.js` med sju gateadresser og portkode «1974». Det er
fiktivt, men mønsteret er feil: den dagen filen erstattes av ekte data, er den
allerede koblet til en produksjonsside. Flytt filen til `tests/fikstur/` og la
`tavle.js` ta imot data via API-adapteren.

### 6.7 Tilstand som ikke overlever en oppdatering
`tavle.js` gjør `oppdragsliste = oppdragsliste.filter(...)` ved «Ikke aktuelt» og
ved fullført oppdrag. Ved neste sideinnlasting er avvisningen borte. Med backend må
avvisning bli `POST /oppdrag/{id}/avvis`. Samtidig muteres `window.PP_DEMO.hjelper`
direkte i `settTilgjengelig` – en global som skrives til fra en sidefil. Innfør en
liten tilstandsmodul som fylles fra API-svar.

### 6.8 `alert()` som feilhåndtering
`registrering.js` linje 485. Utilgjengelig for skjermlesere, blokkerer tråden, og
kan ikke testes i Playwright uten dialoghåndtering. Nå feiler innsendingen aldri; med
en server vil den feile. Bruk samme innebygde feilmønster som resten av skjemaet.

### 6.9 Ingen Content-Security-Policy
Ingen av de åtte sidene har CSP, og det finnes ingen SRI. I dag er det lav risiko –
det er ingen øktcookie å stjele. Etter trinn 2 er det det. Legg CSP-header i Caddy
samtidig med at cookien innføres, ikke etterpå.

Merk at 115 `style="…"`-attributter på tvers av sidene tvinger fram
`style-src 'unsafe-inline'`. Det er akseptabelt i første omgang; `script-src 'self'`
er den som betyr noe. Opprydding av inline-stiler er en oppfølging, ikke en sperre.

### 6.10 `npm start` krever Python
```json
"start": "python3 -m http.server 8000"
```
README lover «ingen installasjon utover Node». Erstatt med en Node-basert statisk
server – og i trinn 1 blir den uansett Fastify med `@fastify/static`.

### 6.11 Ingen lockfil, ingen `npm ci`
Prosjektet har null produksjonsavhengigheter i dag, så mangelen er usynlig. Den
første avhengigheten må komme sammen med `package-lock.json`, `npm ci` i CI og en
rutine for sikkerhetsoppdateringer. Å innføre dette *etter* seks pakker er dyrere.

### 6.12 Prisen regnes bare i nettleseren
`pris.js` er autoritativ i dag. Serveren må bli fasit i trinn 9, men kontrakten må
settes nå: `POST /oppdrag` returnerer `pris{linjer[], total}`, og frontend viser
serverens tall. Ellers oppstår et vindu der kunden ser én pris og faktureres en annen.

### 6.13 Ingen idempotens ved innsending
Dobbeltklikk på «Jeg er klar for å ta oppdrag» gir to søknader den dagen det finnes
en server. Løses helt inne i `api.js` med `Idempotency-Key` (3.9) – skjemakoden
merker det ikke.

### 6.14 Akuttgjenkjenningen finnes bare i frontend
`bestilling.js` filtrerer akutte beskrivelser. Rekkefølgekrav 4 sier at filteret
aldri skal kunne omgås. Løftes til en delt modul som kjører begge steder, på samme
måte som `matching.js`, før `POST /oppdrag` finnes.

---

## 7. Åpne spørsmål som må avklares utenfor teknologirollen

1. **Behandlingsansvar for adressen.** Er det plattformen eller familien som er
   ansvarlig for gateadressen til den eldre? Svaret avgjør slettefristen i
   `adresse.slettes_etter`.
2. **Arbeidsrettslig status.** Om hjelpere anses som arbeidstakere, endres
   lagringstider, innsynsrett og hvilke opplysninger drift kan se. Modellen tåler
   begge, men fristene må settes av jurist.
3. **Politiattest.** Krav eller ikke? Hvis ja, skal attesten aldri lagres – kun
   `verifisering`-raden med dato og kontrollør.
4. **Oppbevaring av oppdragsnotat.** Familier kan skrive helseopplysninger i
   `notat` tross veiledningen. Foreslått: maks 400 tegn, automatisk sletting 90
   dager etter oppgjør, og en driftsrutine for sletting på forespørsel.
5. **Kartleverandør.** Avstandsberegning uten å sende identifiserbar posisjon ut
   av huset. Haversine på egne data løser fase 2–6; ruting i fase 7 gjør det ikke.
