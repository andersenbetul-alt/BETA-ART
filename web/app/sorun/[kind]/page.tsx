import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  cityIn, eventsIn, getCountry, placesIn,
  type CityRef, type Country,
} from '@/lib/country.ts';
import { rankEvents, universalWays, weekdayIn } from '@/lib/events.ts';
import { kinds, problemFor, type Kind } from '@/lib/problems.ts';
import { findTrips, type TripOption } from '@/lib/entur.ts';
import { demoTrips } from '@/lib/fixtures.ts';
import { clock, duration, modeLabel, relativeMinutes } from '@/lib/format.ts';
import { forecast } from '@/lib/met.ts';
import { shouldGoIndoors } from '@/lib/weather.ts';
import UseMyLocation from '@/components/UseMyLocation.tsx';
import CountryPicker from '@/components/CountryPicker.tsx';
import { rankByPlan, type Impact } from '@/lib/plan.ts';
import { messageFor } from '@/lib/messages.ts';
import FixItNow from '@/components/FixItNow.tsx';
import { demoPlan } from '@/lib/demo-plan.ts';

const liveData = process.env.COBBAN_LIVE_DATA === 'true';

/**
 * "İptal oldu" ve "kaçırdım" aynı ekran değil.
 * İptalde bütün gün hâlâ geçerli olabilir — bir sonraki sefer yeter.
 * Kaçırdığında ise sabırsızsın: en erken kalkan, aktarmasız olan önemli.
 */
const tripHint: Record<'cancelled' | 'missed' | 'road', string> = {
  cancelled: 'Alternatives including other transport modes.',
  missed: 'Soonest departures from now, fewest changes first.',
  road: 'Public transport avoids most road closures.',
};

async function getTrips(from: string, to: string): Promise<{ trips: TripOption[]; live: boolean }> {
  if (!liveData) return { trips: demoTrips, live: false };
  try {
    return { trips: await findTrips(from, to), live: true };
  } catch (error) {
    // Aksaklık anında hata ekranı göstermek en kötü seçenek — demo veriye düş
    // ve bunu kullanıcıya açıkça söyle.
    console.error('[entur] canlı veri alınamadı:', error);
    return { trips: demoTrips, live: false };
  }
}

export function generateStaticParams() {
  return kinds.map((kind) => ({ kind }));
}

export default async function ProblemPage({
  params, searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ country?: string; from?: string; to?: string; city?: string }>;
}) {
  const { kind } = await params;
  const problem = problemFor(kind);
  if (!problem) notFound();
  const k = kind as Kind;

  const { country: code, from, to, city } = await searchParams;
  const country = await getCountry(code ?? '');
  const isTransport = k === 'cancelled' || k === 'missed' || k === 'road';

  return (
    <>
      <Link href="/" className="back">← Something else</Link>
      <h1>{problem.headline}</h1>

      <CountryPicker active={country.code} basePath={`/sorun/${k}`} />

      {isTransport
        ? <TransportAnswer country={country} kind={k} from={from} to={to} />
        : k === 'eat'
          ? <PlaceAnswer country={country} kind="eat" city={city} />
          : k === 'rain'
            ? <RainAnswer country={country} city={city} />
            : k === 'meet'
              ? <EventsAnswer country={country} city={city} />
              : <Essentials country={country} />}
    </>
  );
}

/* ------------------------------------------------------------- ulaşım */

async function TransportAnswer({
  country, kind, from, to,
}: {
  country: Country;
  kind: 'cancelled' | 'missed' | 'road';
  from?: string; to?: string;
}) {
  const origin = cityIn(country, from);
  const target =
    country.cities.find((c) => c.id === to && c.id !== origin.id)
    ?? country.cities.find((c) => c.id !== origin.id)
    ?? origin;

  /*
   * Canlı ulaşım verisi her ülkede yok. Turiste boş bir liste göstermek
   * yerine ne olduğunu ve şimdi ne yapacağını söylüyoruz — yalan söylemeden.
   */
  if (country.transport === 'none' || !origin.stopPlaceId || !target.stopPlaceId) {
    return <NoTransportYet country={country} />;
  }

  const { trips, live } = await getTrips(origin.stopPlaceId, target.stopPlaceId);

  /*
   * Sıralama plana göre yapılır, hıza göre değil.
   * 20 dakika erken varıp uçuşu kaçıran seçenek, 20 dakika geç varıp
   * her şeyi kurtarandan kötüdür. Turistin istediği hız değil, kurtarılmış plan.
   */
  const ranked = rankByPlan(demoPlan, trips, { replacedItemId: 'ferry' });
  const ordered = ranked.map((r) => r.option);
  const impactOf = new Map(ranked.map((r) => [r.option.departure, r.impact]));

  return (
    <>
      <p className="muted small" style={{ marginTop: '-.2rem' }}>{tripHint[kind]}</p>
      <CityChips label="From" cities={country.cities} selected={origin.id}
                 href={(id) => `?country=${country.code}&from=${id}&to=${target.id}`} />
      <UseMyLocation param="from" cities={country.cities} />
      <CityChips label="To" cities={country.cities} selected={target.id}
                 href={(id) => `?country=${country.code}&from=${origin.id}&to=${id}`} />

      {!live && (
        <p className="demo">
          Demo data — live departures are off. Set <code>COBBAN_LIVE_DATA=true</code> to use Entur.
        </p>
      )}

      <div className="answer">
        <strong>
          {ordered.length > 0
            ? `Next departure ${clock(ordered[0].departure, country.timeZone)}`
            : 'Nothing left today'}
        </strong>
        <span className="muted small">
          {ordered.length > 0
            ? `${origin.name} → ${target.name} · in ${relativeMinutes(ordered[0].departure)} min`
            : `Nothing scheduled ${origin.name} → ${target.name} for the rest of today. Check overnight buses, or try early tomorrow.`}
        </span>
      </div>

      {ordered.map((trip) => (
        <div className="option" key={trip.departure}>
          <PlanImpact impact={impactOf.get(trip.departure)} />
          <FixItPanel country={country} impact={impactOf.get(trip.departure)}
                      arrival={trip.arrival} problem={kind} />
          <div className="option-head">
            <span className="time">{clock(trip.departure, country.timeZone)}</span>
            <span className="muted">→ {clock(trip.arrival, country.timeZone)}</span>
            <span className="dur">{duration(trip.durationMinutes)}</span>
          </div>
          {trip.legs.map((leg) => (
            <div className="leg" key={`${leg.departure}-${leg.from}`}>
              <span className={`pill${leg.cancelled ? ' cancelled' : leg.realtime ? ' live' : ''}`}>
                {leg.cancelled ? 'Cancelled' : modeLabel(leg.mode)}
                {leg.lineCode ? ` ${leg.lineCode}` : ''}
              </span>
              <span>{leg.from} → {leg.to}</span>
              <span className="dur">{clock(leg.departure, country.timeZone)}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/**
 * Ulaşım entegrasyonu olmayan ülke.
 *
 * "Yakında" demek turiste hiçbir şey vermez. Onun yerine o ülkede
 * gerçekten işe yarayan şeyi veriyoruz: hakları ve elimizdeki bilgi.
 */
function NoTransportYet({ country }: { country: Country }) {
  return (
    <>
      <div className="answer">
        <strong>We don’t have live departures in {country.name} yet</strong>
        <span className="muted small">
          Norway is the only country where we can read the timetable in real time so far.
          Here is what still applies to you today.
        </span>
      </div>

      <div className="option">
        <div className="place">
          <span>
            <strong>Ask for re-routing, not a refund</strong>
            <span className="hint small muted" style={{ display: 'block' }}>
              Under EU passenger rules a cancelled train, coach, ferry or flight generally
              gives you a choice: re-routing to your destination at no extra cost, or your
              money back. A refund solves the money and leaves you standing in the same place.
            </span>
          </span>
        </div>
        <div className="place">
          <span>
            <strong>Photograph the cancellation</strong>
            <span className="hint small muted" style={{ display: 'block' }}>
              The departure board, the SMS, the desk notice. This is what an insurer or a
              compensation claim asks for weeks later, when nobody remembers your delay.
            </span>
          </span>
        </div>
        <div className="place">
          <span>
            <strong>Call the next thing in your plan before you rebook</strong>
            <span className="hint small muted" style={{ display: 'block' }}>
              Hotels hold rooms far past check-in if you tell them. Restaurants move a table
              an hour. Both stop being possible once you are late without warning.
            </span>
          </span>
        </div>
      </div>

      <p className="muted small">
        Emergency in {country.name}: <strong>{country.emergency.general}</strong> — works in English.
      </p>
    </>
  );
}

/**
 * Etkilenen ilk madde için hazır mesaj.
 *
 * Yalnızca gerçekten bir şeyin bozulduğu seçeneklerde çıkar. Planı
 * kurtaran seçeneğe "otele haber ver" demek gereksiz gürültüdür.
 */
function FixItPanel({
  country, impact, arrival, problem,
}: {
  country: Country;
  impact?: Impact;
  arrival: string;
  problem: 'cancelled' | 'missed' | 'road';
}) {
  if (!impact || impact.level === 'safe' || impact.affected.length === 0) return null;

  // Kırılan madde varsa onu öne al; yoksa sıkışan ilk madde.
  const target = impact.affected.find((a) => a.level === 'breaks') ?? impact.affected[0];
  const message = messageFor(target.item.kind, target.item.title, clock(arrival, country.timeZone), problem);

  return (
    <FixItNow
      what={`${target.item.title} — sort it now`}
      message={message}
      language={country.language}
      phone={target.item.phone}
    />
  );
}

/** Seçeneğin plana etkisi — asıl karar bilgisi bu, saatler değil. */
function PlanImpact({ impact }: { impact?: Impact }) {
  if (!impact) return null;
  const label = { safe: 'Plan intact', tight: 'Tight', breaks: 'Breaks your plan' }[impact.level];
  return (
    <div className={`impact impact-${impact.level}`}>
      <strong>{label}</strong> {impact.summary}
    </div>
  );
}

function CityChips({
  label, cities, selected, href,
}: {
  label: string;
  cities: CityRef[];
  selected: string;
  href: (id: string) => string;
}) {
  return (
    <>
      <h2>{label}</h2>
      <div className="chips">
        {cities.map((c) => (
          <Link
            key={c.id}
            href={href(c.id)}
            className="chip"
            aria-current={c.id === selected ? 'true' : undefined}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </>
  );
}

/* --------------------------------------------------------------- yerler */

/**
 * Yağmur ekranı önce havaya bakar. Yağış 2 saatten kısa sürecekse içeri
 * girmeyi önermek yanlış tavsiye olur — turistin dışarıdaki planı hâlâ
 * geçerlidir, sadece beklemesi gerekir.
 *
 * MET Norway tüm dünyayı kapsıyor: bu ekran her ülkede aynı şekilde çalışır.
 */
async function RainAnswer({ country, city }: { country: Country; city?: string }) {
  const active = cityIn(country, city);

  let advice = 'Here are indoor options.';
  let indoors = true;
  let live = false;
  if (liveData) {
    try {
      const verdict = shouldGoIndoors(await forecast(active.lat, active.lon));
      advice = verdict.advice;
      indoors = verdict.indoors;
      live = true;
    } catch (error) {
      console.error('[met] hava durumu alınamadı:', error);
    }
  }

  return (
    <>
      <CityChips label="Where are you?" cities={country.cities} selected={active.id}
                 href={(id) => `?country=${country.code}&city=${id}`} />
      <UseMyLocation cities={country.cities} />

      {!live && (
        <p className="demo">
          Demo mode — live weather is off. Set <code>COBBAN_LIVE_DATA=true</code> for MET Norway.
        </p>
      )}

      <div className="answer">
        <strong>{indoors ? 'Go indoors' : 'Hold your plan'}</strong>
        <span className="muted small">{advice}</span>
      </div>

      {indoors && <PlaceList country={country} city={active.id} kind="indoor" />}
    </>
  );
}

function PlaceAnswer({
  country, kind, city,
}: { country: Country; kind: 'eat' | 'indoor'; city?: string }) {
  const active = cityIn(country, city);

  return (
    <>
      <CityChips label="Where are you?" cities={country.cities} selected={active.id}
                 href={(id) => `?country=${country.code}&city=${id}`} />
      <UseMyLocation cities={country.cities} />

      <PlaceList country={country} city={active.id} kind={kind} />
    </>
  );
}

function PlaceList({
  country, city, kind,
}: { country: Country; city: string; kind: 'eat' | 'indoor' }) {
  const list = placesIn(country, city, kind);

  if (list.length === 0) {
    return (
      <p className="muted small">
        No hand-picked places in this city yet. We only list what someone has actually checked.
      </p>
    );
  }

  return (
    <>
      <div className="option">
        {list.map((p) => (
          <div className="place" key={p.name}>
            <span className="walk">{p.walkMinutes}<small>min walk</small></span>
            <span>
              <strong>{p.name}</strong>{p.price ? <span className="muted small"> · {p.price}</span> : null}
              <span className="hint small muted" style={{ display: 'block' }}>{p.note}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="muted small">
        Hand-picked, not scraped. Hours change — call ahead for the late ones.
      </p>
    </>
  );
}

/* --------------------------------------------------------------- etkinlik */

/**
 * "Bu akşam ne var" ekranı.
 *
 * Sıralama bugüne göre: turist "bu şehirde neler oluyor" diye sormuyor,
 * "BU AKŞAM nereye gideyim" diye soruyor. Gün, turistin bulunduğu ülkenin
 * saat diliminde hesaplanır — Atina'da gece yarısını geçmişse Oslo'nun
 * takvimi yanlış cevap verir.
 *
 * Veri yalnızca TEKRAR EDEN etkinliklerden oluşur. Tek seferlik konser
 * listelemiyoruz: bir hafta sonra yalan olur ve turist kapalı kapıya gider.
 */
function EventsAnswer({ country, city }: { country: Country; city?: string }) {
  const active = cityIn(country, city);
  const ranked = rankEvents(eventsIn(country, active.id), weekdayIn(country.timeZone));
  const today = ranked.filter((e) => e.inDays === 0);

  return (
    <>
      <CityChips label="Where are you?" cities={country.cities} selected={active.id}
                 href={(id) => `?country=${country.code}&city=${id}`} />
      <UseMyLocation cities={country.cities} />

      <div className="answer">
        <strong>
          {today.length > 0
            ? `${today.length} thing${today.length > 1 ? 's' : ''} on today in ${active.name}`
            : `Nothing of ours running today in ${active.name}`}
        </strong>
        <span className="muted small">
          {today.length > 0
            ? 'All free to walk into. No ticket, no booking, no plan needed.'
            : 'Here is what is on later this week, and three things that work in any city tonight.'}
        </span>
      </div>

      {ranked.length > 0 && (
        <div className="option">
          {ranked.map((e) => (
            <div className="place" key={e.name}>
              <span className="walk when">
                {e.dayLabel}
                <small>{e.to ? `${e.from}\u2013${e.to}` : e.from}</small>
              </span>
              <span>
                <strong>{e.name}</strong>
                {e.free ? <span className="muted small"> · free</span> : null}
                <span className="hint small muted" style={{ display: 'block' }}>{e.note}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      <h2>Anywhere in Europe, tonight</h2>
      <div className="option">
        {universalWays.map((w) => (
          <div className="place" key={w.what}>
            <span>
              <strong>{w.what}</strong>
              <span className="hint small muted" style={{ display: 'block' }}>{w.detail}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="muted small">
        We only list things that happen every week, so this page cannot go stale.
        For one-off concerts and festivals, the tourist office desk beats every website.
      </p>
    </>
  );
}

/* ------------------------------------------------------------- temel bilgi */

/**
 * Turistin en çok parasını yiyen şey gecikme değil, BİLMEMEK: doğrulanmamış
 * bilet, kapalı mutfak, nakit istemeyen taverna. Bu bilgiler statik — yani
 * hiçbir API'ye bağlı olmadan her ülkede aynı gün açılabilir.
 */
function Essentials({ country }: { country: Country }) {
  const e = country.emergency;
  /*
   * Yalnizca gercekten ACIL hatlar. Ihbar hatti (Danimarka 114, Hollanda
   * 0900-8844) bu satira karismaz: "Emergency" basligi altinda gorunurse
   * tehlikedeki turisti bekleme kuyruguna gonderir.
   */
  const direct = [
    ['Police', e.police], ['Ambulance', e.ambulance], ['Fire', e.fire],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <>
      <div className="answer">
        <strong>Emergency in {country.name}: {e.general}</strong>
        <span className="muted small">
          112 reaches an English-speaking operator anywhere in the EU and EEA.
          {direct.length > 0
            ? ` Direct lines: ${direct.map(([w, n]) => `${w} ${n}`).join(' · ')}.`
            : ''}
        </span>
      </div>

      {country.nonEmergency && (
        <p className="muted small" style={{ marginTop: '-.7rem', marginBottom: '1.4rem' }}>
          {country.nonEmergency.what}? That is <strong>{country.nonEmergency.number}</strong>,
          not {e.general}. Use {e.general} only when someone is in danger.
        </p>
      )}

      <div className="option">
        {country.essentials.map((item) => (
          <div className="place" key={item.when}>
            <span>
              <strong>{item.when}</strong>
              <span className="hint small muted" style={{ display: 'block' }}>{item.answer}</span>
              <span className="cost small" style={{ display: 'block' }}>
                Not knowing costs you: {item.costsIfUnknown}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="muted small">
        Currency: {country.currency}. Local language: {country.language}.
        Checked by hand — tell us if something has changed.
      </p>
    </>
  );
}
