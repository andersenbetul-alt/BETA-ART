import type { TripOption } from './entur.ts';

/**
 * Demo sefer verisi — canlı API kapalıyken (COBBAN_LIVE_DATA=false) kullanılır.
 *
 * Üç seçenek bilerek farklı sonuç veriyor: biri planı kurtarıyor, biri akşam
 * yemeğini kaydırıyor, biri uçuşu kaçırtıyor. Hepsi "güvenli" çıksaydı
 * ekran doğru görünür ama özelliğin ne işe yaradığı görünmezdi.
 */
function at(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

export const demoTrips: TripOption[] = [
  {
    // Varış ~4 sa sonra: otel, yemek ve uçuş yerinde kalır.
    departure: at(23), arrival: at(23 + 195), durationMinutes: 195,
    legs: [
      { mode: 'bus', lineCode: '400', lineName: 'Kystbussen', from: 'Bergen busstasjon', to: 'Stavanger busstasjon',
        departure: at(23), arrival: at(23 + 195), realtime: true, cancelled: false },
    ],
  },
  {
    // Varış ~6,5 sa sonra: yemek rezervasyonu kayar ama telafisi var.
    departure: at(150), arrival: at(150 + 240), durationMinutes: 240,
    legs: [
      { mode: 'rail', lineCode: 'R60', lineName: 'Bergen–Voss', from: 'Bergen stasjon', to: 'Voss stasjon',
        departure: at(150), arrival: at(150 + 75), realtime: true, cancelled: false },
      { mode: 'bus', lineCode: '930', lineName: null, from: 'Voss stasjon', to: 'Stavanger busstasjon',
        departure: at(150 + 90), arrival: at(150 + 240), realtime: false, cancelled: false },
    ],
  },
  {
    // Varış ~10,5 sa sonra: uçuşu kaçırtır. Hızlı ama işe yaramaz.
    departure: at(445), arrival: at(445 + 185), durationMinutes: 185,
    legs: [
      { mode: 'water', lineCode: 'F1', lineName: 'Hurtigbåt', from: 'Bergen kai', to: 'Stavanger kai',
        departure: at(445), arrival: at(445 + 185), realtime: true, cancelled: false },
    ],
  },
];
