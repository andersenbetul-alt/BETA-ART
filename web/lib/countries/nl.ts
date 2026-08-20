import type { Country } from '../country.ts';

export const country: Country = {
  code: 'NL', name: 'Netherlands', language: 'nl', currency: 'EUR', timeZone: 'Europe/Amsterdam', transport: 'none',
  cities: [
    { id: 'amsterdam', name: 'Amsterdam', lat: 52.3676, lon: 4.9041, stopPlaceId: null },
    { id: 'rotterdam', name: 'Rotterdam', lat: 51.9244, lon: 4.4777, stopPlaceId: null },
    { id: 'utrecht',   name: 'Utrecht',   lat: 52.0907, lon: 5.1214, stopPlaceId: null },
  ],
  emergency: { general: '112' },
  nonEmergency: { what: 'Reporting a theft or a crime with nobody in danger', number: '0900-8844' },
  roadside: { garageWord: 'autogarage', bodyShopWord: 'schadeherstel' },
  places: [
    { cityId: 'amsterdam', name: 'Foodhallen', kind: 'eat', walkMinutes: 18, price: '$$', note: 'Indoor food hall in a tram depot' },
    { cityId: 'amsterdam', name: 'Vleminckx', kind: 'eat', walkMinutes: 6, price: '$', note: 'Fries with sauce, standing only' },
    { cityId: 'amsterdam', name: 'Rijksmuseum', kind: 'indoor', walkMinutes: 20, note: 'Book online; the queue outside is unsheltered' },
    { cityId: 'amsterdam', name: 'NEMO Science Museum', kind: 'indoor', walkMinutes: 15, note: 'Hands-on, built for a rainy day with children' },
    { cityId: 'rotterdam', name: 'Markthal', kind: 'eat', walkMinutes: 5, price: '$$', note: 'Food stalls under a painted arch' },
    { cityId: 'rotterdam', name: 'Kunsthal', kind: 'indoor', walkMinutes: 12, note: 'Changing exhibitions, rarely crowded' },
    { cityId: 'utrecht', name: 'Village Coffee', kind: 'eat', walkMinutes: 7, price: '$', note: 'Good coffee near the canals' },
    { cityId: 'utrecht', name: 'Museum Speelklok', kind: 'indoor', walkMinutes: 6, note: 'Self-playing instruments — odd and delightful' },
  ],
  events: [
    { cityId: 'amsterdam', name: 'Albert Cuypmarkt', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '09:00', to: '17:00', free: true, note: 'Longest street market in the country' },
    { cityId: 'amsterdam', name: 'Waterlooplein flea market', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '09:30', to: '18:00', free: true, note: 'Second-hand everything; closed Sundays' },
    { cityId: 'rotterdam', name: 'Markthal', kind: 'market', days: 'daily', from: '10:00', to: '20:00', free: true, note: 'Stalls under the painted arch, open every day' },
    { cityId: 'utrecht', name: 'Janskerkhof flower market', kind: 'market', days: [6], from: '08:00', to: '17:00', free: true, note: 'Saturday flower market in the old centre' },
  ],
  essentials: [
    { when: 'Paying by card', answer: 'Many Dutch shops take only Maestro/debit, not credit cards. Visa and Mastercard credit are refused more often than tourists expect.', costsIfUnknown: 'A refused card in a supermarket queue' },
    { when: 'Walking anywhere in a city', answer: 'The red asphalt is a bike lane, not a pavement. Cyclists have right of way and will not slow down.', costsIfUnknown: 'Collisions — and the cyclist is usually in the right' },
    { when: 'Renting a bike', answer: 'Bike theft is endemic. Use both locks, always to a fixed object, and never leave it overnight on the street.', costsIfUnknown: 'The rental company charges the full replacement value' },
    { when: 'Being asked about a tip', answer: 'Service is included. Rounding up or 5% is plenty.', costsIfUnknown: 'Tipping at American rates for no reason' },
    { when: 'Calling the police for something non-urgent', answer: '112 is emergencies only. For theft reports and everything else, call 0900-8844.', costsIfUnknown: 'Blocking an emergency line, or a long wait' },
  ],
};
