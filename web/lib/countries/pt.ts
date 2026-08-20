import type { Country } from '../country.ts';

export const country: Country = {
  code: 'PT', name: 'Portugal', language: 'pt', currency: 'EUR', timeZone: 'Europe/Lisbon', transport: 'none',
  cities: [
    { id: 'lisboa', name: 'Lisboa', lat: 38.7223, lon: -9.1393, stopPlaceId: null },
    { id: 'porto',  name: 'Porto',  lat: 41.1579, lon: -8.6291, stopPlaceId: null },
    { id: 'faro',   name: 'Faro',   lat: 37.0194, lon: -7.9304, stopPlaceId: null },
  ],
  emergency: { general: '112' },
  places: [
    { cityId: 'lisboa', name: 'Time Out Market', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Covered hall, many kitchens, open late' },
    { cityId: 'lisboa', name: 'Cervejaria Ramiro', kind: 'eat', walkMinutes: 20, price: '$$$', note: 'Seafood; take a queue number and wait' },
    { cityId: 'lisboa', name: 'Museu Calouste Gulbenkian', kind: 'indoor', walkMinutes: 25, note: 'Quiet, excellent, and dry all afternoon' },
    { cityId: 'lisboa', name: 'Oceanário de Lisboa', kind: 'indoor', walkMinutes: 30, note: 'Best rainy-day option with children' },
    { cityId: 'porto', name: 'Mercado do Bolhão', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Restored market hall; counters serve through the day' },
    { cityId: 'porto', name: 'Café Santiago', kind: 'eat', walkMinutes: 10, price: '$', note: 'Francesinha; heavy, cheap, filling' },
    { cityId: 'porto', name: 'Serralves', kind: 'indoor', walkMinutes: 35, note: 'Modern art museum; the park needs dry weather, the museum does not' },
    { cityId: 'faro', name: 'Mercado Municipal de Faro', kind: 'eat', walkMinutes: 12, price: '$', note: 'Local prices; mornings only' },
    { cityId: 'faro', name: 'Museu Municipal de Faro', kind: 'indoor', walkMinutes: 6, note: 'Small; an hour, not a day' },
  ],
  events: [
    { cityId: 'lisboa', name: 'Feira da Ladra', kind: 'market', days: [2, 6], from: '09:00', to: '18:00', free: true, note: 'Tuesdays and Saturdays only, at Campo de Santa Clara' },
    { cityId: 'lisboa', name: 'Time Out Market', kind: 'market', days: 'daily', from: '10:00', to: '00:00', free: true, note: 'Communal tables until midnight — the easiest place to eat alone in Lisbon' },
    { cityId: 'porto', name: 'Mercado do Bolhão', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '20:00', free: true, note: 'Closed Sundays. Counters inside serve through the day' },
  ],
  essentials: [
    { when: 'Bread, olives or cheese arrive unordered', answer: 'That is the "couvert" and it is charged per item. You may refuse it and send it back — say "não, obrigado".', costsIfUnknown: '5–15 € added for food you did not order' },
    { when: 'Using trams, metro and buses in Lisbon', answer: 'Buy a rechargeable Viva Viagem card once and load it. Paying the driver on board costs roughly three times more.', costsIfUnknown: '3–4 € per tram ride instead of about 1.50 €' },
    { when: 'On tram 28 or in a crowded lift', answer: 'These are the main pickpocket spots in Lisbon. Bags in front, phone away.', costsIfUnknown: 'Your phone and your cards' },
    { when: 'Eating in a small tasca', answer: 'Many family places are cash-only or set a card minimum. Carry €20–30.', costsIfUnknown: 'Leaving a table to find an ATM mid-meal' },
    { when: 'Being asked about a tip', answer: 'Round up or leave 5–10% for a good meal. Not expected in cafés.', costsIfUnknown: 'Over-tipping at every stop' },
    { when: 'Needing medicine', answer: 'Pharmacies are "farmácia" with a green cross. Pharmacists can treat minor problems directly and speak English in tourist areas.', costsIfUnknown: 'A clinic fee for something free advice would have solved' },
  ],
};
