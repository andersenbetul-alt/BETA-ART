import type { Country } from '../country.ts';

/** Danimarka. Rejseplanen API'si anahtar istiyor — şimdilik `none`. */
export const country: Country = {
  code: 'DK',
  name: 'Denmark',
  currency: 'DKK',
  languages: ['da', 'en'],
  transport: 'none',
  cities: [
    { id: 'kobenhavn', name: 'København', lat: 55.6761, lon: 12.5683, stopPlaceId: null },
    { id: 'aarhus',    name: 'Aarhus',    lat: 56.1629, lon: 10.2039, stopPlaceId: null },
    { id: 'odense',    name: 'Odense',    lat: 55.4038, lon: 10.4024, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '114', ambulance: '112', fire: '112' },
  essentials: [
    {
      when: 'Getting around a city',
      answer: 'Cycling is genuinely faster than transit in Copenhagen. City bikes and rentals are everywhere — but bike lanes have real traffic rules and locals will tell you off.',
      costsIfUnknown: 'Taxi fares for trips that cost nothing by bike',
    },
    {
      when: 'Buying transport tickets',
      answer: 'Copenhagen uses zones. A City Pass covers unlimited travel and is usually cheaper than single tickets after three rides.',
      costsIfUnknown: 'Paying per ride all day, plus fines for the wrong zone',
    },
    {
      when: 'Being asked about a tip',
      answer: 'Service is included by law. Tipping is genuinely optional.',
      costsIfUnknown: 'Adding 10% out of habit at every meal',
    },
    {
      when: 'Calling the police for something non-urgent',
      answer: 'Denmark splits the numbers: 112 for emergencies, 114 for police when nobody is in danger.',
      costsIfUnknown: 'Long waits, or blocking an emergency line',
    },
    {
      when: 'Buying alcohol',
      answer: 'Sold in normal supermarkets at normal hours — unlike Norway and Sweden.',
      costsIfUnknown: 'Assuming Nordic restrictions and overpaying at a bar',
    },
  ],
};
