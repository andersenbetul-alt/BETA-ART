/* Naviar Care – lager SQL-skjemaet ut fra reglene, ikke ved siden av dem.

   Sletteplanen, fristene og lista over det som aldri lagres, ligger allerede
   som data i assets/js/besok-vern.js. Skriver vi skjemaet for hånd, får vi to
   sannheter som glir fra hverandre: en regel i JavaScript og en kolonne i
   Postgres som ikke lenger stemmer med den.

   Derfor genereres skjemaet herfra. Endres SLETTEPLAN, kjøres dette på nytt.

   Kjøres for hånd, som resten av verktoy/:
     node verktoy/lag-skjema.js > sql/001-besok.sql   */

var path = require('path');
global.window = global.window || {};
require(path.join(__dirname, '..', 'assets/js/besok-vern.js'));
var V = window.PP_VERN;

/* JS-navn -> kolonnenavn. Snake_case i databasen, som resten av Postgres. */
var KOLONNE = {
  id: 'id', token: 'token', kunde: 'kunde', oppgaver: 'oppgaver',
  dato: 'dato', tid: 'tid', ansattId: 'ansatt_id', ansattNavn: 'ansatt_navn',
  parorendeEpost: 'parorende_epost', notat: 'notat', opprettet: 'opprettet',
  utloper: 'utloper', status: 'status', fullfortTid: 'fullfort_tid',
  'rapport.kommentar': 'rapport_kommentar', 'rapport.sjekkliste': 'rapport_sjekkliste',
  'rapport.utfall': 'rapport_utfall'
};

function kol(n) { return KOLONNE[n] || n.replace(/[A-Z]/g, function (c) { return '_' + c.toLowerCase(); }); }

var ut = [];
function s(l) { ut.push(l === undefined ? '' : l); }

s('-- GENERERT av verktoy/lag-skjema.js. Ikke rediger for hånd.');
s('-- Kilden er SLETTEPLAN og FRISTER i assets/js/besok-vern.js.');
s('-- Endrer du en frist der, kjør skriptet på nytt.');
s();

/* --- Det som aldri skal finnes --- */
s('-- Disse har bevisst ingen kolonne. Et felt som ikke finnes, kan ikke');
s('-- fylles ut i en travel situasjon:');
V.LAGRES_ALDRI.forEach(function (x) { s('--   ' + x); });
s();

s('create table if not exists besok (');
s('  id              text primary key,');
s('  token           text unique,        -- faller bort etter 12 timer');
s('  kunde           text,               -- fornavn eller kundenummer. Aldri etternavn');
s('  oppgaver        text[] not null,');
s('  dato            date not null,');
s('  tid             time,');
s('  ansatt_id       text,');
s('  ansatt_navn     text,');
s('  parorende_epost text,');
s('  notat           text,               -- fritekst. Går gjennom sperra før insert');
s('  rapport_kommentar  text,            -- fritekst. Samme sperre');
s('  rapport_sjekkliste text[],');
s('  rapport_utfall  text,               -- det ene som overlever trinn 4');
s('  opprettet       timestamptz not null default now(),');
s('  utloper         timestamptz,');
s('  fullfort_tid    timestamptz,');
s('  status          text not null,');
s('  krympet         smallint not null default 0   -- hvilket trinn raden har passert');
s(');');
s();

/* --- Krympefunksjonen, trinn for trinn --- */
s('-- Det som står igjen etter siste trinn. Ingen id, ingen dato utover');
s('-- måneden, ingen kobling til et menneske.');
s('create table if not exists besok_statistikk (');
s('  maaned  date not null,');
s('  utfall  text');
s(');');
s();
s('-- Krymping i fire trinn. Dette er ikke sletting av rader: felter faller');
s('-- bort etter tur, og det som står igjen til slutt handler ikke om noen.');
s('create or replace function krymp_besok() returns void as $$');
s('begin');
var SISTE = V.SLETTEPLAN[V.SLETTEPLAN.length - 1].steg;
V.SLETTEPLAN.forEach(function (t) {
  var alder = t.timer ? "interval '" + t.timer + " hours'" : "interval '" + t.dager + " days'";

  /* Siste trinn kan ikke være en UPDATE. Kjører man krymp() i JS til enden,
     står det igjen en rad uten id, uten opprettet og uten status – det er
     ikke et besøk lenger, det er en statistikklinje. Å nulle de kolonnene i
     Postgres ville brutt primærnøkkelen og fjernet den datoen krympingen
     selv leser. Derfor flyttes raden i stedet. */
  if (t.steg === SISTE) {
    s('  -- Trinn ' + t.steg + ': ' + t.hva + ' etter ' + t.dager + ' dager');
    s('  -- ' + t.hvorfor);
    s('  insert into besok_statistikk (maaned, utfall)');
    s("  select date_trunc('month', dato)::date, rapport_utfall from besok");
    s('  where krympet < ' + t.steg + ' and opprettet < now() - ' + alder + ';');
    s('  delete from besok');
    s('  where krympet < ' + t.steg + ' and opprettet < now() - ' + alder + ';');
    s();
    return;
  }
  s('  -- Trinn ' + t.steg + ': ' + t.hva + ' etter ' + (t.timer ? t.timer + ' timer' : t.dager + ' dager'));
  s('  -- ' + t.hvorfor);
  s('  update besok set');
  var sett = t.fjerner.map(function (f) { return '    ' + kol(f) + ' = null'; });
  if (t.grovner) {
    Object.keys(t.grovner).forEach(function (f) {
      sett.push("    " + kol(f) + " = date_trunc('month', " + kol(f) + ")::date");
    });
  }
  sett.push('    krympet = ' + t.steg);
  s(sett.join(',\n'));
  s('  where krympet < ' + t.steg + ' and opprettet < now() - ' + alder + ';');
  s();
});
s('end;');
s('$$ language plpgsql;');
s();

/* --- Lesningen som krymper først --- */
s('-- All lesning går gjennom denne. Samme garanti som i nettleseren i dag:');
s('-- leser noen, er sletting kjørt. Et view kunne ikke gjort dette – et view');
s('-- kan ikke skrive – og pg_cron er nattjobben som kan stanse uten at noen');
s('-- merker det.');
s('create or replace function les_besok() returns setof besok as $$');
s('begin');
s('  perform krymp_besok();');
s('  return query select * from besok;');
s('end;');
s('$$ language plpgsql;');
s();

/* --- Backstop --- */
s('-- Overvåking. Returnerer denne noe, er lesningen omgått et sted.');
s('create or replace view besok_ikke_krympet as');
var vilkar = V.SLETTEPLAN.map(function (t) {
  var alder = t.timer ? "interval '" + t.timer + " hours'" : "interval '" + t.dager + " days'";
  return '  (krympet < ' + t.steg + ' and opprettet < now() - ' + alder + ')';
});
s('select id, krympet, opprettet from besok where');
s(vilkar.join('\n  or '));
s(';');
s();

/* --- Fristene som ikke gjelder besøk --- */
s('-- Øvrige frister fra FRISTER. Innloggingsloggen er den som gjelder');
s('-- autentiseringen:');
Object.keys(V.FRISTER).forEach(function (k) {
  var f = V.FRISTER[k];
  var t = f.timer ? f.timer + ' timer' : (f.dager === null ? 'ingen fast frist' : f.dager + ' dager');
  s('--   ' + k.padEnd(10) + t.padEnd(18) + f.hva + ' – ' + f.hvorfor);
});

process.stdout.write(ut.join('\n') + '\n');

/* --- Personvernsperra, som trigger ---------------------------------------

   Sperra kjører i nettleseren i dag. Det holder så lenge det ikke finnes et
   endepunkt å sende til. I det databasen står der, kan hvem som helst sende
   en rad forbi skjermbildet, og en sperre som bare finnes i frontend er en
   anbefaling.

   Ordlista hentes fra STOPP, samme sted som nettleseren leser den. Skrives
   den av for hånd, får vi to lister som glir fra hverandre. */

var g = [];
function q(l) { g.push(l === undefined ? '' : l); }

q();
q('-- GENERERT. Ordlista er STOPP i assets/js/besok-vern.js.');
q('create or replace function vern_sjekk(t text)');
q('  returns table (kategori text, beskjed text) as $$');
q('begin');
V.STOPP.forEach(function (kat) {
  /* Samme mønster som traff() i JS: ordet må stå først eller etter et tegn
     som ikke er en bokstav, slik at «sår» ikke treffer inni «forsårsaket». */
  var uttrykk = kat.ord.map(function (o) {
    return "'(^|[^a-zæøåéèü])" + o.replace(/'/g, "''").replace('-', '[- ]?') + "'";
  });
  q('  -- ' + kat.id + ': ' + kat.ord.length + ' ord');
  q('  if ' + uttrykk.map(function (u) { return 'lower(t) ~ ' + u; }).join('\n     or ') + ' then');
  q("    return query select '" + kat.id + "'::text, '" + kat.beskjed.replace(/'/g, "''") + "'::text;");
  q('  end if;');
});
q('  -- Lange tallrekker fanges av mønster, ikke av ordliste. Elleve siffer er');
q('  -- fødselsnummer eller kontonummer. Åtte får stå – det er et telefonnummer.');
q("  if t ~ '(\\d[ .-]?){11,}' then");
q("    return query select 'tallrekke'::text, 'Dette ser ut som et fødselsnummer eller et kontonummer.'::text;");
q('  end if;');
q('  return;');
q('end;');
q('$$ language plpgsql immutable;');
q();
q('-- Én vei inn. Fritekstfeltene slipper ikke forbi uten å ha vært innom.');
q('create or replace function vern_trigger() returns trigger as $$');
q('declare funn record;');
q('begin');
q('  for funn in');
q('    select * from vern_sjekk(coalesce(new.notat, %L))');
q('    union all');
q('    select * from vern_sjekk(coalesce(new.rapport_kommentar, %L))');
q('  loop');
/* plpgsql bruker % som plassholder i RAISE. %% er en literal prosent, og
     gir «too many parameters specified for RAISE». */
  q("    raise exception 'PP_VERN %: %', funn.kategori, funn.beskjed;");
q('  end loop;');
q('  return new;');
q('end;');
q('$$ language plpgsql;');
q();
q('drop trigger if exists besok_vern on besok;');
q('create trigger besok_vern before insert or update on besok');
q('  for each row execute function vern_trigger();');

process.stdout.write(g.join('\n').replace(/%L/g, "''") + '\n');
