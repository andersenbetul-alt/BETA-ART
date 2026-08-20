import type { Country } from '../country.ts';

export const country: Country = {
  code: 'FI', name: 'Finland', language: 'fi', currency: 'EUR', timeZone: 'Europe/Helsinki', transport: 'none',
  cities: [
    { id: 'helsinki', name: 'Helsinki', lat: 60.1699, lon: 24.9384, stopPlaceId: null },
    { id: 'rovaniemi', name: 'Rovaniemi', lat: 66.5039, lon: 25.7294, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '112', ambulance: '112', fire: '112' },
  places: [
    { cityId: 'helsinki', name: 'Vanha Kauppahalli', kind: 'eat', walkMinutes: 7, price: '$$', note: 'Old market hall on the harbour' },
    { cityId: 'helsinki', name: 'Hietalahden Kauppahalli', kind: 'eat', walkMinutes: 15, price: '$$', note: 'Smaller hall, less touristy' },
    { cityId: 'helsinki', name: 'Oodi library', kind: 'indoor', walkMinutes: 8, note: 'Free, warm, and genuinely worth seeing' },
    { cityId: 'helsinki', name: 'Amos Rex', kind: 'indoor', walkMinutes: 5, note: 'Underground galleries beneath the square' },
    { cityId: 'rovaniemi', name: 'Nili', kind: 'eat', walkMinutes: 5, price: '$$$', note: 'Lappish menu, book ahead in winter' },
    { cityId: 'rovaniemi', name: 'Arktikum', kind: 'indoor', walkMinutes: 15, note: 'Arctic science and Sámi history under a glass tube' },
  ],
  events: [
    { cityId: 'helsinki', name: 'Hakaniemi market square', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '16:00', free: true, note: 'Outdoor stalls plus the hall behind them' },
    { cityId: 'helsinki', name: 'Vanha Kauppahalli', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '18:00', free: true, note: 'Old harbour hall; soup counters at lunch' },
  ],
  essentials: [
    { when: 'Paying for anything', answer: 'Cards are accepted almost everywhere, including buses and taxis. Cash is rarely needed.', costsIfUnknown: 'ATM fees on cash you will not spend' },
    { when: 'Being asked about a tip', answer: 'Not expected anywhere. Service is included; even rounding up is optional.', costsIfUnknown: 'Tipping out of habit on every bill' },
    { when: 'Needing medicine', answer: 'Pharmacies are "Apteekki", marked with a green cross. Painkillers are pharmacy-only.', costsIfUnknown: 'Searching supermarkets that cannot sell it' },
    { when: 'Booking anything in Lapland in winter', answer: 'Rovaniemi sells out weeks ahead in December. Northern-lights tours cancel for cloud — check the refund terms before paying.', costsIfUnknown: 'A non-refundable tour that never runs' },
    { when: 'Drinking tap water', answer: 'Among the cleanest in the world. Buying bottled water here is money thrown away.', costsIfUnknown: '2–3 € per bottle for something free at the tap' },
  ],
};
