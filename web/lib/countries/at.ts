import type { Country } from '../country.ts';

export const country: Country = {
  code: 'AT', name: 'Austria', language: 'de', currency: 'EUR', transport: 'none',
  cities: [
    { id: 'wien',     name: 'Wien',     lat: 48.2082, lon: 16.3738, stopPlaceId: null },
    { id: 'salzburg', name: 'Salzburg', lat: 47.8095, lon: 13.0550, stopPlaceId: null },
    { id: 'innsbruck', name: 'Innsbruck', lat: 47.2692, lon: 11.4041, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '133', ambulance: '144', fire: '122' },
  places: [
    { cityId: 'wien', name: 'Naschmarkt', kind: 'eat', walkMinutes: 12, price: '$$', note: 'Long market street; the far end is cheaper' },
    { cityId: 'wien', name: 'Bitzinger Würstelstand', kind: 'eat', walkMinutes: 6, price: '$', note: 'Sausage stand behind the opera, open late' },
    { cityId: 'wien', name: 'Kunsthistorisches Museum', kind: 'indoor', walkMinutes: 10, note: 'Bruegel room alone is worth the ticket' },
    { cityId: 'wien', name: 'Café Central', kind: 'indoor', walkMinutes: 8, note: 'Coffee house, not a café — sitting for hours is the tradition' },
    { cityId: 'salzburg', name: 'Augustiner Bräustübl', kind: 'eat', walkMinutes: 20, price: '$', note: 'Monastery beer hall, mostly indoors' },
    { cityId: 'salzburg', name: 'Salzburg Museum', kind: 'indoor', walkMinutes: 6, note: 'Quiet when the Mozart sites are packed' },
    { cityId: 'innsbruck', name: 'Markthalle Innsbruck', kind: 'eat', walkMinutes: 8, price: '$', note: 'Indoor market by the river' },
    { cityId: 'innsbruck', name: 'Swarovski Kristallwelten shuttle', kind: 'indoor', walkMinutes: 10, note: 'Bus from the centre; the museum is entirely indoors' },
  ],
  essentials: [
    { when: 'Sitting down in a coffee house', answer: 'You are buying the table, not just the coffee. Nobody will rush you — and nobody will bring the bill until you ask.', costsIfUnknown: 'Waiting an hour for a bill that was never coming' },
    { when: 'Being asked about a tip', answer: 'Round up 5–10% and state the total as you pay. Leaving coins on the table is not the custom.', costsIfUnknown: 'Confusion, or tipping twice' },
    { when: 'Using public transport in Vienna', answer: 'No barriers, but tickets must be validated. Inspectors are frequent and unsympathetic to tourists.', costsIfUnknown: '105 € fine' },
    { when: 'Needing a doctor at night', answer: 'Austria splits emergency numbers: 144 ambulance, 133 police, 122 fire. 112 works too and routes you.', costsIfUnknown: 'Delay while a call is transferred' },
    { when: 'Shopping on a Sunday', answer: 'Closed almost everywhere, like Germany. Stations and petrol stations are the exception.', costsIfUnknown: 'No dinner and no supplies' },
  ],
};
