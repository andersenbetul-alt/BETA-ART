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

-- GENERERT. Ordlista er STOPP i assets/js/besok-vern.js.
create or replace function vern_sjekk(t text)
  returns table (kategori text, beskjed text) as $$
begin
  -- helse: 47 ord
  if lower(t) ~ '(^|[^a-zæøåéèü])diagnose'
     or lower(t) ~ '(^|[^a-zæøåéèü])demens'
     or lower(t) ~ '(^|[^a-zæøåéèü])kreft'
     or lower(t) ~ '(^|[^a-zæøåéèü])diabetes'
     or lower(t) ~ '(^|[^a-zæøåéèü])blodtrykk'
     or lower(t) ~ '(^|[^a-zæøåéèü])blodsukker'
     or lower(t) ~ '(^|[^a-zæøåéèü])medisin'
     or lower(t) ~ '(^|[^a-zæøåéèü])tablett'
     or lower(t) ~ '(^|[^a-zæøåéèü])insulin'
     or lower(t) ~ '(^|[^a-zæøåéèü])dose'
     or lower(t) ~ '(^|[^a-zæøåéèü])sår'
     or lower(t) ~ '(^|[^a-zæøåéèü])infeksjon'
     or lower(t) ~ '(^|[^a-zæøåéèü])smerte'
     or lower(t) ~ '(^|[^a-zæøåéèü])fastlege'
     or lower(t) ~ '(^|[^a-zæøåéèü])sykehus'
     or lower(t) ~ '(^|[^a-zæøåéèü])utskrevet'
     or lower(t) ~ '(^|[^a-zæøåéèü])journal'
     or lower(t) ~ '(^|[^a-zæøåéèü])resept'
     or lower(t) ~ '(^|[^a-zæøåéèü])vondt'
     or lower(t) ~ '(^|[^a-zæøåéèü])feber'
     or lower(t) ~ '(^|[^a-zæøåéèü])svimmel'
     or lower(t) ~ '(^|[^a-zæøåéèü])kvalm'
     or lower(t) ~ '(^|[^a-zæøåéèü])forvirret'
     or lower(t) ~ '(^|[^a-zæøåéèü])pustet'
     or lower(t) ~ '(^|[^a-zæøåéèü])hoven'
     or lower(t) ~ '(^|[^a-zæøåéèü])hørsel'
     or lower(t) ~ '(^|[^a-zæøåéèü])hørselstap'
     or lower(t) ~ '(^|[^a-zæøåéèü])tunghørt'
     or lower(t) ~ '(^|[^a-zæøåéèü])døv'
     or lower(t) ~ '(^|[^a-zæøåéèü])høreapparat'
     or lower(t) ~ '(^|[^a-zæøåéèü])syn'
     or lower(t) ~ '(^|[^a-zæøåéèü])synshemmet'
     or lower(t) ~ '(^|[^a-zæøåéèü])blind'
     or lower(t) ~ '(^|[^a-zæøåéèü])briller'
     or lower(t) ~ '(^|[^a-zæøåéèü])rullestol'
     or lower(t) ~ '(^|[^a-zæøåéèü])rullator'
     or lower(t) ~ '(^|[^a-zæøåéèü])krykker'
     or lower(t) ~ '(^|[^a-zæøåéèü])gåstol'
     or lower(t) ~ '(^|[^a-zæøåéèü])protese'
     or lower(t) ~ '(^|[^a-zæøåéèü])lammelse'
     or lower(t) ~ '(^|[^a-zæøåéèü])slag'
     or lower(t) ~ '(^|[^a-zæøåéèü])parkinson'
     or lower(t) ~ '(^|[^a-zæøåéèü])skjelv'
     or lower(t) ~ '(^|[^a-zæøåéèü])afasi'
     or lower(t) ~ '(^|[^a-zæøåéèü])funksjonsnedsettelse'
     or lower(t) ~ '(^|[^a-zæøåéèü])uføre'
     or lower(t) ~ '(^|[^a-zæøåéèü])psykisk' then
    return query select 'helse'::text, 'Dette ser ut som en helseopplysning. Skriv hva som ble gjort, ikke hvordan personen har det.'::text;
  end if;
  -- haster: 10 ord
  if lower(t) ~ '(^|[^a-zæøåéèü])falt'
     or lower(t) ~ '(^|[^a-zæøåéèü])fall'
     or lower(t) ~ '(^|[^a-zæøåéèü])skadet'
     or lower(t) ~ '(^|[^a-zæøåéèü])blør'
     or lower(t) ~ '(^|[^a-zæøåéèü])brannsår'
     or lower(t) ~ '(^|[^a-zæøåéèü])bevisstløs'
     or lower(t) ~ '(^|[^a-zæøåéèü])kom seg ikke opp'
     or lower(t) ~ '(^|[^a-zæøåéèü])ambulanse'
     or lower(t) ~ '(^|[^a-zæøåéèü])legevakt'
     or lower(t) ~ '(^|[^a-zæøåéèü])politi' then
    return query select 'haster'::text, 'Dette skal ikke skrives her – det skal meldes. Velg «Leverandøren må følge opp», så ringer kontoret deg. Ved fare for liv og helse: ring 113 først.'::text;
  end if;
  -- penger: 8 ord
  if lower(t) ~ '(^|[^a-zæøåéèü])bankid'
     or lower(t) ~ '(^|[^a-zæøåéèü])pinkode'
     or lower(t) ~ '(^|[^a-zæøåéèü])pin[- ]?kode'
     or lower(t) ~ '(^|[^a-zæøåéèü])passord'
     or lower(t) ~ '(^|[^a-zæøåéèü])kontonummer'
     or lower(t) ~ '(^|[^a-zæøåéèü])kortnummer'
     or lower(t) ~ '(^|[^a-zæøåéèü])vipps[- ]?kode'
     or lower(t) ~ '(^|[^a-zæøåéèü])engangskode' then
    return query select 'penger'::text, 'Bankopplysninger skal aldri inn her – heller ikke for å hjelpe.'::text;
  end if;
  -- nedsett: 8 ord
  if lower(t) ~ '(^|[^a-zæøåéèü])sur'
     or lower(t) ~ '(^|[^a-zæøåéèü])vanskelig'
     or lower(t) ~ '(^|[^a-zæøåéèü])gretten'
     or lower(t) ~ '(^|[^a-zæøåéèü])sløv'
     or lower(t) ~ '(^|[^a-zæøåéèü])senil'
     or lower(t) ~ '(^|[^a-zæøåéèü])masete'
     or lower(t) ~ '(^|[^a-zæøåéèü])udugelig'
     or lower(t) ~ '(^|[^a-zæøåéèü])lat' then
    return query select 'nedsett'::text, 'Beskriv situasjonen, ikke personen. Familien leser dette.'::text;
  end if;
  -- Lange tallrekker fanges av mønster, ikke av ordliste. Elleve siffer er
  -- fødselsnummer eller kontonummer. Åtte får stå – det er et telefonnummer.
  if t ~ '(\d[ .-]?){11,}' then
    return query select 'tallrekke'::text, 'Dette ser ut som et fødselsnummer eller et kontonummer.'::text;
  end if;
  return;
end;
$$ language plpgsql immutable;

-- Én vei inn. Fritekstfeltene slipper ikke forbi uten å ha vært innom.
create or replace function vern_trigger() returns trigger as $$
declare funn record;
begin
  for funn in
    select * from vern_sjekk(coalesce(new.notat, ''))
    union all
    select * from vern_sjekk(coalesce(new.rapport_kommentar, ''))
  loop
    raise exception 'PP_VERN %: %', funn.kategori, funn.beskjed;
  end loop;
  return new;
end;
$$ language plpgsql;

drop trigger if exists besok_vern on besok;
create trigger besok_vern before insert or update on besok
  for each row execute function vern_trigger();

-- GENERERT. Kilden er LAGRES og FRISTER i assets/js/besok-vern.js.
-- felt:     innlogging
-- formål:   Oppdage misbruk
-- grunnlag: interesse
-- frist:    sikkerhet – 90 dager. Oppdage misbruk, ikke følge med på folk
create table if not exists innlogging (
  id         bigserial primary key,
  konto      text not null,        -- hvem. Ikke hvem personen er
  utfall     text not null,        -- ok | feil | sperret
  tidspunkt  timestamptz not null default now()
);

-- Ingen kolonne for IP, enhet eller nettleser. Skal en av dem inn, må den
-- først få formål, grunnlag og frist i PP_VERN.LAGRES – en test krever begge.

-- Samme regel som for besøkene: slettingen kjører når noen leser.
create or replace function les_innlogging() returns setof innlogging as $$
begin
  delete from innlogging
  where tidspunkt < now() - interval '90 days';
  return query select * from innlogging;
end;
$$ language plpgsql;

-- Backstop. Returnerer denne noe, er lesningen omgått.
create or replace view innlogging_for_gammel as
select id, tidspunkt from innlogging where tidspunkt < now() - interval '90 days';
