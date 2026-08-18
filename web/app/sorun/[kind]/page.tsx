import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cities, cityById, placesFor, type City } from '@/lib/places.ts';
import { findTrips, type TripOption } from '@/lib/entur.ts';
import { demoTrips } from '@/lib/fixtures.ts';
import { clock, duration, modeLabel, relativeMinutes } from '@/lib/format.ts';

const KINDS = ['cancelled', 'missed', 'road', 'eat', 'rain'] as const;
type Kind = (typeof KINDS)[number];

const liveData = process.env.COBBAN_LIVE_DATA === 'true';

/** Sorun başına cevabın ilk cümlesi. Marka sesi: sakin, kesin, çözülmüş. */
const headline: Record<Kind, string> = {
  cancelled: "Don't worry. Here's another way.",
  missed: "Fine. Here's the rest of today, rebuilt.",
  road: "There's another route.",
  eat: 'Here are places open near you.',
  rain: "Plan swapped. These are indoors.",
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
        ? <TransportAnswer from={from} to={to} />
        : <PlaceAnswer kind={k === 'eat' ? 'eat' : 'indoor'} city={city} />}
    </>
  );
}

/* ------------------------------------------------------------- ulaşım */

async function TransportAnswer({ from, to }: { from?: string; to?: string }) {
  const origin = cityById(from ?? '') ?? cities[0];
  const target = cityById(to ?? '') ?? cities[3];

  if (origin.id === target.id) {
    return <p className="muted">Pick two different places.</p>;
  }

  const { trips, live } = await getTrips(origin.stopPlaceId, target.stopPlaceId);

  return (
    <>
      <Picker label="From" param="from" selected={origin.id} otherParam="to" otherValue={target.id} />
      <Picker label="To" param="to" selected={target.id} otherParam="from" otherValue={origin.id} />

      {!live && (
        <p className="demo">
          Demo data — live departures are off. Set <code>COBBAN_LIVE_DATA=true</code> to use Entur.
        </p>
      )}

      <div className="answer">
        <strong>
          {trips.length > 0
            ? `Next departure ${clock(trips[0].departure)}`
            : 'No connection found today'}
        </strong>
        <span className="muted small">
          {origin.name} → {target.name}
          {trips.length > 0 && ` · in ${relativeMinutes(trips[0].departure)} min`}
        </span>
      </div>

      {trips.map((trip) => (
        <div className="option" key={trip.departure}>
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

function PlaceAnswer({ kind, city }: { kind: 'eat' | 'indoor'; city?: string }) {
  const active = cityById(city ?? '') ?? cities[0];
  const list = placesFor(active.id, kind);

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
        Hand-picked, not scraped. Opening hours change — call ahead for the late ones.
      </p>
    </>
  );
}
