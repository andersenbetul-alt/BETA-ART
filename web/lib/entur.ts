import 'server-only';

/**
 * Entur JourneyPlanner v3 istemcisi.
 *
 * Entur, Norveç'teki tüm toplu taşımayı kapsar: tren, otobüs, tramvay,
 * metro ve FERİBOT — gerçek zamanlı bilgiyle. API ücretsiz ve anahtar
 * istemiyor; yalnızca `ET-Client-Name` başlığıyla kendini tanıtman gerekiyor
 * (tanıtmayanlara sıkı hız sınırı uygulanıyor).
 *
 * ⚠️ Bu sorgular geliştirme ortamından CANLI API'ye karşı doğrulanamadı —
 * ağ politikası api.entur.io'yu engelliyor. Kendi makinende
 * COBBAN_LIVE_DATA=true ile ilk çalıştırmada yanıtı kontrol et.
 * GraphQL gezgini: https://api.entur.io/graphql-explorer/journey-planner-v3
 */

const ENDPOINT = 'https://api.entur.io/journey-planner/v3/graphql';

export type Leg = {
  mode: string;
  lineCode: string | null;
  lineName: string | null;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  realtime: boolean;
  cancelled: boolean;
};

export type TripOption = {
  departure: string;
  arrival: string;
  durationMinutes: number;
  legs: Leg[];
};

const TRIP_QUERY = `
query Trip($from: String!, $to: String!, $when: DateTime!, $n: Int!) {
  trip(
    from: { place: $from }
    to: { place: $to }
    dateTime: $when
    numTripPatterns: $n
    # Yürüme mesafesini sınırla: mahsur kalmış turist 3 km yürümek istemez
    maxPreTransitWalkDistance: 1500
  ) {
    tripPatterns {
      expectedStartTime
      expectedEndTime
      duration
      legs {
        mode
        expectedStartTime
        expectedEndTime
        realtime
        line { publicCode name }
        fromPlace { name }
        toPlace { name }
        serviceJourney { estimatedCalls { cancellation } }
      }
    }
  }
}`;

type RawLeg = {
  mode: string;
  expectedStartTime: string;
  expectedEndTime: string;
  realtime: boolean;
  line: { publicCode: string | null; name: string | null } | null;
  fromPlace: { name: string };
  toPlace: { name: string };
  serviceJourney: { estimatedCalls: { cancellation: boolean }[] } | null;
};

export async function findTrips(
  fromStopPlace: string,
  toStopPlace: string,
  when: Date = new Date(),
  count = 4,
): Promise<TripOption[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ET-Client-Name': process.env.ENTUR_CLIENT_NAME ?? 'cobban-dev',
    },
    body: JSON.stringify({
      query: TRIP_QUERY,
      variables: { from: fromStopPlace, to: toStopPlace, when: when.toISOString(), n: count },
    }),
    // Aksaklık anında eski veri işe yaramaz; kısa önbellek.
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Entur ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e: { message: string }) => e.message).join('; '));

  return (json.data?.trip?.tripPatterns ?? []).map((p: {
    expectedStartTime: string; expectedEndTime: string; duration: number; legs: RawLeg[];
  }) => ({
    departure: p.expectedStartTime,
    arrival: p.expectedEndTime,
    durationMinutes: Math.round(p.duration / 60),
    legs: p.legs.map((l) => ({
      mode: l.mode,
      lineCode: l.line?.publicCode ?? null,
      lineName: l.line?.name ?? null,
      from: l.fromPlace.name,
      to: l.toPlace.name,
      departure: l.expectedStartTime,
      arrival: l.expectedEndTime,
      realtime: l.realtime,
      cancelled: Boolean(l.serviceJourney?.estimatedCalls?.some((c) => c.cancellation)),
    })),
  }));
}
