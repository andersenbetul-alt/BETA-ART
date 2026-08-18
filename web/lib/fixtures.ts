import type { TripOption } from './entur.ts';

/**
 * Demo verisi. Canlı API kapalıyken (COBBAN_LIVE_DATA=false) kullanılır,
 * böylece arayüz ağ erişimi olmadan da çalışır ve gösterilebilir.
 * Saatler "şimdi"ye göre kaydırılır ki ekran her zaman gerçekçi görünsün.
 */
function at(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

export const demoTrips: TripOption[] = [
  {
    departure: at(23), arrival: at(23 + 195), durationMinutes: 195,
    legs: [
      { mode: 'bus', lineCode: '400', lineName: 'Kystbussen', from: 'Bergen busstasjon', to: 'Stavanger busstasjon',
        departure: at(23), arrival: at(23 + 195), realtime: true, cancelled: false },
    ],
  },
  {
    departure: at(52), arrival: at(52 + 240), durationMinutes: 240,
    legs: [
      { mode: 'rail', lineCode: 'R60', lineName: 'Bergen–Voss', from: 'Bergen stasjon', to: 'Voss stasjon',
        departure: at(52), arrival: at(52 + 75), realtime: true, cancelled: false },
      { mode: 'bus', lineCode: '930', lineName: null, from: 'Voss stasjon', to: 'Stavanger busstasjon',
        departure: at(52 + 90), arrival: at(52 + 240), realtime: false, cancelled: false },
    ],
  },
  {
    departure: at(140), arrival: at(140 + 185), durationMinutes: 185,
    legs: [
      { mode: 'water', lineCode: 'F1', lineName: 'Hurtigbåt', from: 'Bergen kai', to: 'Stavanger kai',
        departure: at(140), arrival: at(140 + 185), realtime: true, cancelled: false },
    ],
  },
];
