import type { Country } from '../country.ts';

export const country: Country = {
  code: 'IS', name: 'Iceland', language: 'is', currency: 'ISK', timeZone: 'Atlantic/Reykjavik', transport: 'none',
  cities: [
    { id: 'reykjavik', name: 'Reykjavík', lat: 64.1466, lon: -21.9426, stopPlaceId: null },
    { id: 'akureyri', name: 'Akureyri', lat: 65.6885, lon: -18.1262, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '112', ambulance: '112', fire: '112' },
  places: [
    { cityId: 'reykjavik', name: 'Bæjarins Beztu Pylsur', kind: 'eat', walkMinutes: 5, price: '$', note: 'The hot dog stand, open late' },
    { cityId: 'reykjavik', name: 'Hlemmur Mathöll', kind: 'eat', walkMinutes: 12, price: '$$', note: 'Indoor food hall in an old bus station' },
    { cityId: 'reykjavik', name: 'Perlan', kind: 'indoor', walkMinutes: 30, note: 'Ice cave and planetarium — a full wet afternoon' },
    { cityId: 'reykjavik', name: 'Sundhöllin', kind: 'indoor', walkMinutes: 10, note: 'City thermal pool: cheaper than the Blue Lagoon, used by locals' },
    { cityId: 'akureyri', name: 'Akureyri Fish & Chips', kind: 'eat', walkMinutes: 6, price: '$$', note: 'By the harbour' },
    { cityId: 'akureyri', name: 'Akureyrarkirkja', kind: 'indoor', walkMinutes: 8, note: 'Steep steps, quiet inside' },
  ],
  events: [
    { cityId: 'reykjavik', name: 'Kolaportið flea market', kind: 'market', days: [6, 0], from: '11:00', to: '17:00', free: true, note: 'Weekends only, by the harbour — the one indoor thing everyone does' },
  ],
  essentials: [
    { when: 'Planning to drive', answer: 'Check road.is and vedur.is before every leg. Roads close for wind and storms with little warning, and F-roads need a 4x4 by law.', costsIfUnknown: 'Rental insurance does not cover damage from driving a closed or F-road' },
    { when: 'Opening the car door in wind', answer: 'Wind rips doors off their hinges here. Most rental damage claims in Iceland are exactly this.', costsIfUnknown: 'Door damage is often excluded from standard insurance' },
    { when: 'Buying bottled water', answer: 'Tap water is glacial and free. The sulphur smell is only in the hot tap.', costsIfUnknown: '400–600 ISK a bottle for what the tap gives free' },
    { when: 'Being asked about a tip', answer: 'Not expected. Service and tax are in the price.', costsIfUnknown: 'Adding 15% to already high bills' },
    { when: 'Buying alcohol', answer: 'Only at Vínbúðin state shops, with short hours and closed Sundays. Supermarket "beer" is alcohol-free.', costsIfUnknown: 'Bar prices, which are among the highest in Europe' },
  ],
};
