import type { Country } from '../country.ts';

/** Trafiklab/Resrobot ücretsiz ama API anahtarı istiyor — henüz bağlı değil. */
export const country: Country = {
  code: 'SE', name: 'Sweden', language: 'sv', currency: 'SEK', timeZone: 'Europe/Stockholm', transport: 'none',
  cities: [
    { id: 'stockholm', name: 'Stockholm', lat: 59.3293, lon: 18.0686, stopPlaceId: null },
    { id: 'goteborg',  name: 'Göteborg',  lat: 57.7089, lon: 11.9746, stopPlaceId: null },
    { id: 'malmo',     name: 'Malmö',     lat: 55.6050, lon: 13.0038, stopPlaceId: null },
  ],
  emergency: { general: '112' },
  places: [
    { cityId: 'stockholm', name: 'Östermalms Saluhall', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Indoor market hall, open in any weather' },
    { cityId: 'stockholm', name: 'Kajsas Fisk', kind: 'eat', walkMinutes: 6, price: '$', note: 'Fish soup in the Hötorget basement hall' },
    { cityId: 'stockholm', name: 'Vasamuseet', kind: 'indoor', walkMinutes: 20, note: 'A whole 17th-century warship indoors' },
    { cityId: 'stockholm', name: 'Fotografiska', kind: 'indoor', walkMinutes: 15, note: 'Photography, open late most nights' },
    { cityId: 'goteborg', name: 'Feskekörka', kind: 'eat', walkMinutes: 7, price: '$$', note: 'Fish market in a church-shaped hall' },
    { cityId: 'goteborg', name: 'Universeum', kind: 'indoor', walkMinutes: 12, note: 'Science centre — good with children' },
    { cityId: 'malmo', name: 'Malmö Saluhall', kind: 'eat', walkMinutes: 4, price: '$$', note: 'Indoor food hall by the station' },
    { cityId: 'malmo', name: 'Moderna Museet Malmö', kind: 'indoor', walkMinutes: 10, note: 'Small, free, and rarely crowded' },
  ],
  events: [
    { cityId: 'stockholm', name: 'Östermalms Saluhall', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '09:30', to: '19:00', free: true, note: 'Counter seating; go at 17:00 when locals stop for a drink' },
    { cityId: 'stockholm', name: 'Hötorget flea market', kind: 'market', days: [0], from: '08:00', to: '16:00', free: true, note: 'Sunday only, in the square above the food hall' },
    { cityId: 'goteborg', name: 'Kvibergs Marknad', kind: 'market', days: [6, 0], from: '09:00', to: '15:00', free: true, note: 'Big weekend flea market; take the tram out' },
    { cityId: 'malmo', name: 'Möllevångstorget market', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '14:00', free: true, note: 'Produce in the morning, bars around the square from late afternoon' },
  ],
  essentials: [
    { when: 'Trying to pay with cash', answer: 'Sweden is close to cashless. Many cafés, buses and museums refuse notes entirely. Bring a card.', costsIfUnknown: 'Being unable to pay at all, plus exchange fees on cash nobody accepts' },
    { when: 'Boarding a bus or metro', answer: 'You usually cannot buy a ticket from the driver. Buy in the operator app or at a kiosk before boarding.', costsIfUnknown: 'Fines are roughly 1 500 SEK and inspectors are frequent' },
    { when: 'Being asked about a tip', answer: 'Service is included. Rounding up is normal; a percentage tip is not expected.', costsIfUnknown: 'Adding 10–15% unnecessarily at every meal' },
    { when: 'Needing medicine', answer: 'Pharmacies are "Apotek". Basic painkillers are also in supermarkets, unlike Norway.', costsIfUnknown: 'A wasted trip when the shop next door had it' },
    { when: 'Buying alcohol', answer: 'Anything above 3.5% is sold only at Systembolaget, closed Sundays and early on Saturdays.', costsIfUnknown: 'Restaurant prices for what a shop sells at a third of the cost' },
  ],
};
