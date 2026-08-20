import type { Country } from '../country.ts';

export const country: Country = {
  code: 'NO', name: 'Norway', language: 'no', currency: 'NOK', timeZone: 'Europe/Oslo', transport: 'entur',
  cities: [
    { id: 'bergen',    name: 'Bergen',    lat: 60.3913, lon: 5.3221,  stopPlaceId: 'NSR:StopPlace:548' },
    { id: 'oslo',      name: 'Oslo',      lat: 59.9111, lon: 10.7528, stopPlaceId: 'NSR:StopPlace:337' },
    { id: 'tromso',    name: 'Tromsø',    lat: 69.6492, lon: 18.9553, stopPlaceId: 'NSR:StopPlace:73230' },
    { id: 'stavanger', name: 'Stavanger', lat: 58.9700, lon: 5.7331,  stopPlaceId: 'NSR:StopPlace:60298' },
  ],
  emergency: { general: '112', ambulance: '113', fire: '110' },
  roadside: { garageWord: 'bilverksted' },
  places: [
    { cityId: 'bergen', name: 'Fisketorget', kind: 'eat', walkMinutes: 4, price: '$$', note: 'Covered fish market — open in the rain' },
    { cityId: 'bergen', name: 'Trekroneren', kind: 'eat', walkMinutes: 5, price: '$', note: 'Reindeer sausage, standing room, open late' },
    { cityId: 'bergen', name: 'Pygmalion Økocafé', kind: 'eat', walkMinutes: 6, price: '$$', note: 'Plenty of vegetarian options' },
    { cityId: 'bergen', name: 'Hanseatisk Museum', kind: 'indoor', walkMinutes: 6, note: 'Bryggen history, small and quick' },
    { cityId: 'bergen', name: 'KODE Kunstmuseer', kind: 'indoor', walkMinutes: 8, note: 'Four buildings, one ticket — fills a wet day' },
    { cityId: 'bergen', name: 'Bergen Akvariet', kind: 'indoor', walkMinutes: 20, note: 'First choice if you have kids' },
    { cityId: 'oslo', name: 'Illegal Burger', kind: 'eat', walkMinutes: 10, price: '$', note: 'Fast and affordable' },
    { cityId: 'oslo', name: 'Mathallen Oslo', kind: 'eat', walkMinutes: 15, price: '$$', note: 'Indoor food hall, lots of choice' },
    { cityId: 'oslo', name: 'Nasjonalmuseet', kind: 'indoor', walkMinutes: 10, note: 'Largest art museum in the Nordics' },
    { cityId: 'oslo', name: 'Munchmuseet', kind: 'indoor', walkMinutes: 12, note: 'The Scream is here — easily a full day' },
    { cityId: 'tromso', name: 'Bardus Bistro', kind: 'eat', walkMinutes: 3, price: '$$', note: 'Central and dependable' },
    { cityId: 'tromso', name: 'Raketten', kind: 'eat', walkMinutes: 4, price: '$', note: "Norway's smallest sausage kiosk" },
    { cityId: 'tromso', name: 'Polarmuseet', kind: 'indoor', walkMinutes: 6, note: 'Polar expeditions, 1–2 hours' },
    { cityId: 'tromso', name: 'Polaria', kind: 'indoor', walkMinutes: 12, note: 'Aquarium plus a polar film' },
    { cityId: 'stavanger', name: 'Renaa Xpress', kind: 'eat', walkMinutes: 5, price: '$$', note: 'Central, quick' },
    { cityId: 'stavanger', name: 'Sjøhuset Skagen', kind: 'eat', walkMinutes: 6, price: '$$$', note: 'Seafood by the harbour' },
    { cityId: 'stavanger', name: 'Norsk Oljemuseum', kind: 'indoor', walkMinutes: 8, note: 'More interesting than it sounds' },
  ],
  events: [
    { cityId: 'bergen', name: 'Fisketorget fish market', kind: 'market', days: 'daily', from: '09:00', to: '18:00', free: true, note: 'Shared counters, no booking — eating alone is normal here' },
    { cityId: 'oslo', name: 'Mathallen Oslo food hall', kind: 'market', days: [2, 3, 4, 5, 6, 0], from: '11:00', to: '20:00', free: true, note: 'Closed Mondays. Long tables, many kitchens, one bill each' },
  ],
  essentials: [
    { when: 'Paying for anything', answer: 'Cards work everywhere, including buses and small kiosks. You can cross Norway without touching cash.', costsIfUnknown: 'ATM fees and poor exchange rates on cash you never needed' },
    { when: 'A taxi quotes a price', answer: 'Taxi fares are not regulated and vary a lot between companies. The maximum fare must be on the window sticker before you get in.', costsIfUnknown: 'A 20-minute ride can differ by several hundred NOK' },
    { when: 'Being asked about a tip', answer: 'Not expected. Service is included. Rounding up is generous, not required.', costsIfUnknown: '10–15% added to every meal for no reason' },
    { when: 'Buying bottled water', answer: 'Tap water is excellent everywhere. Carry a bottle and refill.', costsIfUnknown: '30–40 NOK a bottle, several times a day' },
    { when: 'Needing medicine', answer: 'Pharmacies are "Apotek". Many painkillers are sold only there, not in supermarkets. Pharmacists speak English.', costsIfUnknown: 'A doctor visit for something a pharmacist can hand you' },
    { when: 'Buying alcohol', answer: 'Beer stops in supermarkets at 20:00 on weekdays, 18:00 Saturdays. Wine and spirits only at Vinmonopolet, closed Sundays.', costsIfUnknown: 'Bar prices because you missed the cut-off' },
  ],
};
