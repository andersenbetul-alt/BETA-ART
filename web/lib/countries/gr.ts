import type { Country } from '../country.ts';

export const country: Country = {
  code: 'GR', name: 'Greece', language: 'el', currency: 'EUR', timeZone: 'Europe/Athens', transport: 'none',
  cities: [
    { id: 'athina',       name: 'Athína',       lat: 37.9838, lon: 23.7275, stopPlaceId: null },
    { id: 'thessaloniki', name: 'Thessaloníki', lat: 40.6401, lon: 22.9444, stopPlaceId: null },
    { id: 'irakleio',     name: 'Irákleio',     lat: 35.3387, lon: 25.1442, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '100', ambulance: '166', fire: '199' },
  places: [
    { cityId: 'athina', name: 'Varvakios Agora', kind: 'eat', walkMinutes: 12, price: '$', note: 'Central market hall; the tavernas inside serve all day' },
    { cityId: 'athina', name: 'Karamanlidika tou Fani', kind: 'eat', walkMinutes: 14, price: '$$', note: 'Deli and meze near the market' },
    { cityId: 'athina', name: 'Acropolis Museum', kind: 'indoor', walkMinutes: 10, note: 'Works when the Acropolis itself closes for heat or wind' },
    { cityId: 'athina', name: 'National Archaeological Museum', kind: 'indoor', walkMinutes: 25, note: 'Enormous; easily half a day' },
    { cityId: 'thessaloniki', name: 'Modiano Market', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Covered market, restored, open into the evening' },
    { cityId: 'thessaloniki', name: 'Museum of Byzantine Culture', kind: 'indoor', walkMinutes: 20, note: 'Cool and quiet in a heatwave' },
    { cityId: 'irakleio', name: 'Peskesi', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Cretan cooking; book ahead in season' },
    { cityId: 'irakleio', name: 'Heraklion Archaeological Museum', kind: 'indoor', walkMinutes: 6, note: 'The Knossos finds are here, not at the site' },
  ],
  events: [
    { cityId: 'athina', name: 'Monastiraki flea market', kind: 'market', days: [0], from: '08:00', to: '15:00', free: true, note: 'Sunday morning is the real one; the rest of the week is tourist shops' },
    { cityId: 'athina', name: 'Varvakios Agora', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '07:00', to: '18:00', free: true, note: 'Central market; the tavernas inside stay open through the night on weekdays' },
    { cityId: 'thessaloniki', name: 'Modiano Market', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '09:00', to: '23:00', free: true, note: 'Restored hall — a market by day and a bar street by night' },
    { cityId: 'irakleio', name: '1866 Street market', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '15:00', free: true, note: 'Closed Sundays. Runs the length of the old street' },
  ],
  essentials: [
    { when: 'Your ferry is cancelled', answer: 'Ferries stop for wind, not rain. When the port authority declares a sailing ban, no operator sails and no operator is at fault — you get a refund or a later sailing, not compensation. Ask the port police, not the ticket desk.', costsIfUnknown: 'A missed flight home because you assumed the next boat would run' },
    { when: 'Planning the last day of an island trip', answer: 'Leave a day of slack before a flight home. Summer wind cancellations are routine, and every stranded traveller books the same next boat.', costsIfUnknown: 'A rebooked international flight' },
    { when: 'Riding the metro or a bus', answer: 'Validate your ticket at the machine every time you enter, even with a day pass. Inspectors work in plain clothes.', costsIfUnknown: 'A fine of roughly 60 times the fare' },
    { when: 'Paying on a small island or in a village taverna', answer: 'Cards are widely accepted but not universally, and ATMs run empty in August. Carry cash before you leave a bigger town.', costsIfUnknown: 'A meal you cannot pay for, or an out-of-network ATM fee' },
    { when: 'Being asked about a tip', answer: 'Round up, or 5–10% in a taverna, left in cash on the table. Not a percentage on the card.', costsIfUnknown: 'Tipping twice, or not at all where it matters' },
    { when: 'Needing medicine', answer: 'Pharmacies are "φαρμακείο" with a green cross. They handle minor problems directly. Rotas for nights and Sundays are posted on the door.', costsIfUnknown: 'A private clinic visit at tourist prices' },
  ],
};
