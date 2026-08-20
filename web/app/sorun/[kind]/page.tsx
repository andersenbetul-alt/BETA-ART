import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, cityById, placesFor, type City } from '@/lib/places.ts';
import { findTrips, type TripOption } from '@/lib/entur.ts';
import { demoTrips } from '@/lib/fixtures.ts';
import { clock, duration, modeLabel, relativeMinutes } from '@/lib/format.ts';
import { forecast } from '@/lib/met.ts';
import { shouldGoIndoors } from '@/lib/weather.ts';
import UseMyLocation from '@/components/UseMyLocation.tsx';
import { rankByPlan, type Impact } from '@/lib/plan.ts';
import { messageFor } from '@/lib/messages.ts';
import FixItNow from '@/components/FixItNow.tsx';
import { demoPlan } from '@/lib/demo-plan.ts';

const KINDS = ['cancelled', 'missed', 'road', 'eat', 'rain'] as const;
type Kind = (typeof KINDS)[number];

const liveData = process.env.COBBAN_LIVE_DATA === 'true';

/** Sorun başına cevabın ilk cümlesi. Marka sesi: sakin, kesin, çözülmüş. */
const headline: Record<Kind, string> = {
  cancelled: 'Other ways to still get there.',
  missed: 'The rest of today, rebuilt.',
  road: 'Routes that avoid the road.',
  eat: 'Places worth walking to.',
  rain: 'Wait it out, or move indoors?',
};

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
  return KINDS.map((kind) => ({ kind }));
}

export default async function ProblemPage({
  params, searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ from?: string; to?: string; city?: string }>;
}) {
  const { kind } = await params;
  if (!KINDS.includes(kind as Kind)) notFound();
  const k = kind as Kind;

  const { from, to, city } = await searchParams;
  const isTransport = k === 'cancelled' || k === 'missed' || k === 'road';

  return (
    <>
      <Link href="/" className="back">← Something else</Link>
      <h1>{headline[k]}</h1>

      {isTransport
        ? <TransportAnswer kind={k} from={from} to={to} />
        : k === 'eat'
          ? <PlaceAnswer kind="eat" city={city} />
          : <RainAnswer city={city} />}
    </>
  );
}

/* ------------------------------------------------------------- ulaşım */

async function TransportAnswer({
  kind, from, to,
}: { kind: 'cancelled' | 'missed' | 'road'; from?: string; to?: string }) {
  const origin = cityById(from ?? '') ?? cities[0];
  const target = cityById(to ?? '') ?? cities[3];

  if (origin.id === target.id) {
    return <p className="muted">Pick a different destination below.</p>;
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
      <Picker label="From" param="from" selected={origin.id} otherParam="to" otherValue={target.id} />
      <UseMyLocation param="from" />
      <Picker label="To" param="to" selected={target.id} otherParam="from" otherValue={origin.id} />

      {!live && (
        <p className="demo">
          Demo data — live departures are off. Set <code>COBBAN_LIVE_DATA=true</code> to use Entur.
        </p>
      )}

      <div className="answer">
        <strong>
          {ordered.length > 0
            ? `Next departure ${clock(ordered[0].departure)}`
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
          <FixItPanel impact={impactOf.get(trip.departure)} arrival={trip.arrival} problem={kind} />
          <div className="option-head">
            <span className="time">{clock(trip.departure)}</span>
            <span className="muted">→ {clock(trip.arrival)}</span>
            <span className="dur">{duration(trip.durationMinutes)}</span>
          </div>
          {trip.legs.map((leg) => (
            <div className="leg" key={`${leg.departure}-${leg.from}`}>
              <span className={`pill${leg.cancelled ? ' cancelled' : leg.realtime ? ' live' : ''}`}>
                {leg.cancelled ? 'Cancelled' : modeLabel(leg.mode)}
                {leg.lineCode ? ` ${leg.lineCode}` : ''}
              </span>
              <span>{leg.from} → {leg.to}</span>
              <span className="dur">{clock(leg.departure)}</span>
            </div>
          ))}
        </div>
      ))}
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
  impact, arrival, problem,
}: {
  impact?: Impact;
  arrival: string;
  problem: 'cancelled' | 'missed' | 'road';
}) {
  if (!impact || impact.level === 'safe' || impact.affected.length === 0) return null;

  // Kırılan madde varsa onu öne al; yoksa sıkışan ilk madde.
  const target = impact.affected.find((a) => a.level === 'breaks') ?? impact.affected[0];
  const message = messageFor(target.item.kind, target.item.title, clock(arrival), problem);

  return (
    <FixItNow
      what={`${target.item.title} — sort it now`}
      message={message}
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

function Picker({
  label, param, selected, otherParam, otherValue,
}: {
  label: string; param: 'from' | 'to'; selected: City; otherParam: string; otherValue: string;
}) {
  return (
    <>
      <h2>{label}</h2>
      <div className="chips">
        {cities.map((c) => (
          <Link
            key={c.id}
            href={`?${param}=${c.id}&${otherParam}=${otherValue}`}
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
 */
async function RainAnswer({ city }: { city?: string }) {
  const active = cityById(city ?? '') ?? cities[0];

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
      <h2>Where are you?</h2>
      <div className="chips">
        {cities.map((c) => (
          <Link key={c.id} href={`?city=${c.id}`} className="chip"
                aria-current={c.id === active.id ? 'true' : undefined}>
            {c.name}
          </Link>
        ))}
      </div>
      <UseMyLocation />

      {!live && (
        <p className="demo">
          Demo mode — live weather is off. Set <code>COBBAN_LIVE_DATA=true</code> for MET Norway.
        </p>
      )}

      <div className="answer">
        <strong>{indoors ? 'Go indoors' : 'Hold your plan'}</strong>
        <span className="muted small">{advice}</span>
      </div>

      {indoors && <PlaceList city={active.id} kind="indoor" />}
    </>
  );
}

function PlaceAnswer({ kind, city }: { kind: 'eat' | 'indoor'; city?: string }) {
  const active = cityById(city ?? '') ?? cities[0];

  return (
    <>
      <h2>Where are you?</h2>
      <div className="chips">
        {cities.map((c) => (
          <Link key={c.id} href={`?city=${c.id}`} className="chip"
                aria-current={c.id === active.id ? 'true' : undefined}>
            {c.name}
          </Link>
        ))}
      </div>
      <UseMyLocation />

      <PlaceList city={active.id} kind={kind} />
    </>
  );
}

function PlaceList({ city, kind }: { city: City; kind: 'eat' | 'indoor' }) {
  const list = placesFor(city, kind);
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
