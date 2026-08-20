import type { Country } from '../country.ts';

/** Rejseplanen API anahtar istiyor — henüz bağlı değil. */
export const country: Country = {
  code: 'DK', name: 'Denmark', language: 'da', currency: 'DKK', timeZone: 'Europe/Copenhagen', transport: 'none',
  cities: [
    { id: 'kobenhavn', name: 'København', lat: 55.6761, lon: 12.5683, stopPlaceId: null },
    { id: 'aarhus',    name: 'Aarhus',    lat: 56.1629, lon: 10.2039, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '114', ambulance: '112', fire: '112' },
  places: [
    { cityId: 'kobenhavn', name: 'Torvehallerne', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Two glass halls of food stalls' },
    { cityId: 'kobenhavn', name: 'Reffen', kind: 'eat', walkMinutes: 25, price: '$', note: 'Street food by the water — mostly outdoors' },
    { cityId: 'kobenhavn', name: 'Ny Carlsberg Glyptotek', kind: 'indoor', walkMinutes: 6, note: 'Sculpture and a winter garden under glass' },
    { cityId: 'kobenhavn', name: 'Designmuseum Danmark', kind: 'indoor', walkMinutes: 18, note: 'The chairs you have seen everywhere, explained' },
    { cityId: 'aarhus', name: 'Aarhus Street Food', kind: 'eat', walkMinutes: 5, price: '$', note: 'Indoor hall near the station' },
    { cityId: 'aarhus', name: 'ARoS', kind: 'indoor', walkMinutes: 10, note: 'The rainbow walkway on the roof is the point' },
  ],
  events: [
    { cityId: 'kobenhavn', name: 'Torvehallerne', kind: 'market', days: 'daily', from: '10:00', to: '19:00', free: true, note: 'Two glass halls; stand-up counters make it easy to talk to people' },
    { cityId: 'kobenhavn', name: 'Reffen street food', kind: 'outdoor', days: 'daily', from: '12:00', to: '21:00', free: true, note: 'Open spring to autumn only — check before crossing the water' },
    { cityId: 'aarhus', name: 'Aarhus Street Food', kind: 'market', days: 'daily', from: '11:30', to: '21:00', free: true, note: 'Indoor hall by the station, shared benches' },
  ],
  essentials: [
    { when: 'Getting around a city', answer: 'Cycling beats transit in Copenhagen. Rentals are everywhere — but bike lanes have real rules and locals will tell you off.', costsIfUnknown: 'Taxi fares for trips that cost nothing by bike' },
    { when: 'Buying transport tickets', answer: 'Copenhagen uses zones. A City Pass covers unlimited travel and is usually cheaper after three rides.', costsIfUnknown: 'Paying per ride all day, plus fines for the wrong zone' },
    { when: 'Calling the police for something non-urgent', answer: 'Denmark splits the numbers: 112 for emergencies, 114 for police when nobody is in danger.', costsIfUnknown: 'Long waits, or blocking an emergency line' },
    { when: 'Being asked about a tip', answer: 'Service is included by law. Tipping is genuinely optional.', costsIfUnknown: 'Adding 10% out of habit at every meal' },
    { when: 'Buying alcohol', answer: 'Sold in normal supermarkets at normal hours — unlike Norway and Sweden.', costsIfUnknown: 'Assuming Nordic restrictions and overpaying at a bar' },
  ],
};
