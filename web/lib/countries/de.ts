import type { Country } from '../country.ts';

export const country: Country = {
  code: 'DE', name: 'Germany', language: 'de', currency: 'EUR', transport: 'none',
  cities: [
    { id: 'berlin',  name: 'Berlin',  lat: 52.5200, lon: 13.4050, stopPlaceId: null },
    { id: 'munchen', name: 'München', lat: 48.1351, lon: 11.5820, stopPlaceId: null },
    { id: 'hamburg', name: 'Hamburg', lat: 53.5511, lon: 9.9937,  stopPlaceId: null },
  ],
  emergency: { general: '112', police: '110', ambulance: '112', fire: '112' },
  places: [
    { cityId: 'berlin', name: 'Markthalle Neun', kind: 'eat', walkMinutes: 12, price: '$$', note: 'Indoor market hall, Thursday street food night' },
    { cityId: 'berlin', name: 'Mustafas Gemüse Kebap', kind: 'eat', walkMinutes: 15, price: '$', note: 'Queue is real; go off-peak' },
    { cityId: 'berlin', name: 'Pergamonmuseum', kind: 'indoor', walkMinutes: 10, note: 'Parts closed for long renovation — check before you go' },
    { cityId: 'berlin', name: 'Museum für Naturkunde', kind: 'indoor', walkMinutes: 14, note: 'Largest mounted dinosaur in the world' },
    { cityId: 'munchen', name: 'Viktualienmarkt', kind: 'eat', walkMinutes: 5, price: '$$', note: 'Outdoor stalls, covered seating at the beer garden' },
    { cityId: 'munchen', name: 'Deutsches Museum', kind: 'indoor', walkMinutes: 15, note: 'Enormous — pick two floors, not all of them' },
    { cityId: 'hamburg', name: 'Fischmarkt hall', kind: 'eat', walkMinutes: 20, price: '$', note: 'Sunday mornings only, ends by 09:30' },
    { cityId: 'hamburg', name: 'Miniatur Wunderland', kind: 'indoor', walkMinutes: 12, note: 'Book a slot online or you will queue for hours' },
  ],
  essentials: [
    { when: 'Paying in a small restaurant or bakery', answer: 'Germany still runs on cash more than its neighbours. Many small places are cash-only or have a card minimum. Carry €30–50.', costsIfUnknown: 'Standing at a till unable to pay, then hunting for an ATM' },
    { when: 'Boarding a tram, U-Bahn or S-Bahn', answer: 'There are no barriers, but you must validate your ticket before boarding. Plain-clothes inspectors are common.', costsIfUnknown: '60 € on-the-spot fine for "Schwarzfahren"' },
    { when: 'Being asked about a tip', answer: 'Round up 5–10% and say the total you want to pay as you hand over the money — do not leave coins on the table.', costsIfUnknown: 'Awkwardness, or tipping twice' },
    { when: 'Shopping on a Sunday', answer: 'Almost everything is closed by law. Station shops and petrol stations are the exception.', costsIfUnknown: 'A wasted day and dinner from a petrol station' },
    { when: 'Needing medicine', answer: 'Pharmacies are "Apotheke" with a red A. Even aspirin is pharmacy-only. Each area posts a rotating night pharmacy.', costsIfUnknown: 'Searching supermarkets that legally cannot sell it' },
  ],
};
