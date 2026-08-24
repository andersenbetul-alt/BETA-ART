-- GENERERT av verktoy/lag-skjema.js. Ikke rediger for hånd.
-- Kilden er SLETTEPLAN og FRISTER i assets/js/besok-vern.js.
-- Endrer du en frist der, kjør skriptet på nytt.

-- Disse har bevisst ingen kolonne. Et felt som ikke finnes, kan ikke
-- fylles ut i en travel situasjon:
--   Diagnose
--   Medisinliste
--   Journal
--   Legeerklæring
--   Helsemålinger
--   Frie helseobservasjoner
--   Fødselsnummer
--   BankID
--   Kontonummer
--   Kortopplysninger
--   Etternavn
--   Gateadresse i besøkslista
--   Bilder fra hjemmet
--   Lydopptak
--   Løpende posisjon

create table if not exists besok (
  id              text primary key,
  token           text unique,        -- faller bort etter 12 timer
  kunde           text,               -- fornavn eller kundenummer. Aldri etternavn
  oppgaver        text[] not null,
  dato            date not null,
  tid             time,
  ansatt_id       text,
  ansatt_navn     text,
  parorende_epost text,
  notat           text,               -- fritekst. Går gjennom sperra før insert
  rapport_kommentar  text,            -- fritekst. Samme sperre
  rapport_sjekkliste text[],
  rapport_utfall  text,               -- det ene som overlever trinn 4
  opprettet       timestamptz not null default now(),
  utloper         timestamptz,
  fullfort_tid    timestamptz,
  status          text not null,
  krympet         smallint not null default 0   -- hvilket trinn raden har passert
);

-- Det som står igjen etter siste trinn. Ingen id, ingen dato utover
-- måneden, ingen kobling til et menneske.
create table if not exists besok_statistikk (
  maaned  date not null,
  utfall  text
);

-- Krymping i fire trinn. Dette er ikke sletting av rader: felter faller
-- bort etter tur, og det som står igjen til slutt handler ikke om noen.
create or replace function krymp_besok() returns void as $$
begin
  -- Trinn 1: Arbeiderlenken etter 12 timer
  -- Lenken har gjort jobben sin. En lenke i en SMS-tråd er en åpen dør.
  update besok set
    token = null,
    krympet = 1
  where krympet < 1 and opprettet < now() - interval '12 hours';

  -- Trinn 2: Fritekst etter 7 dager
  -- Familien har lest meldingen. Setningene trengs ikke mer, og de er den delen som kan bære noe personlig.
  update besok set
    notat = null,
    rapport_kommentar = null,
    krympet = 2
  where krympet < 2 and opprettet < now() - interval '7 days';

  -- Trinn 3: Navn og kontaktpunkt etter 30 dager
  -- Etter en måned er ingen i tvil om hva som skjedde. Da trengs ikke navnene.
  update besok set
    kunde = null,
    parorende_epost = null,
    ansatt_navn = null,
    krympet = 3
  where krympet < 3 and opprettet < now() - interval '30 days';

  -- Trinn 4: Resten etter 365 dager
  -- Det som står igjen er måned, utfall og varighet. Det handler ikke om noen lenger.
  insert into besok_statistikk (maaned, utfall)
  select date_trunc('month', dato)::date, rapport_utfall from besok
  where krympet < 4 and opprettet < now() - interval '365 days';
  delete from besok
  where krympet < 4 and opprettet < now() - interval '365 days';

end;
$$ language plpgsql;

-- All lesning går gjennom denne. Samme garanti som i nettleseren i dag:
-- leser noen, er sletting kjørt. Et view kunne ikke gjort dette – et view
-- kan ikke skrive – og pg_cron er nattjobben som kan stanse uten at noen
-- merker det.
create or replace function les_besok() returns setof besok as $$
begin
  perform krymp_besok();
  return query select * from besok;
end;
$$ language plpgsql;

-- Overvåking. Returnerer denne noe, er lesningen omgått et sted.
create or replace view besok_ikke_krympet as
select id, krympet, opprettet from besok where
  (krympet < 1 and opprettet < now() - interval '12 hours')
  or   (krympet < 2 and opprettet < now() - interval '7 days')
  or   (krympet < 3 and opprettet < now() - interval '30 days')
  or   (krympet < 4 and opprettet < now() - interval '365 days')
;

-- Øvrige frister fra FRISTER. Innloggingsloggen er den som gjelder
-- autentiseringen:
--   besok     365 dager         Besøket, ferdig krympet – Etter fire trinn står bare anonym statistikk igjen
--   ansatt    ingen fast frist  Medarbeiderens språknivå – Så lenge medarbeideren er aktiv, deretter 30 dager
--   logg      365 dager         Beslutningslogg – Menneskelig kontroll må kunne etterprøves
--   sikkerhet 90 dager          Innlogging og tilgang – Oppdage misbruk, ikke følge med på folk
--   lenke     12 timer          Arbeiderlenken – En lenke i en SMS-tråd er en åpen dør
--   melding   0 dager           Innholdet i familiemeldingen – Sendes og forsvinner. Vi lagrer at den gikk, til hvem og når – ikke teksten
