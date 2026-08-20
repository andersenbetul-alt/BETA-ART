import type { Country } from '../country.ts';

export const country: Country = {
  code: 'IT', name: 'Italy', language: 'it', currency: 'EUR', timeZone: 'Europe/Rome', transport: 'none',
  cities: [
    { id: 'roma',    name: 'Roma',    lat: 41.9028, lon: 12.4964, stopPlaceId: null },
    { id: 'firenze', name: 'Firenze', lat: 43.7696, lon: 11.2558, stopPlaceId: null },
    { id: 'venezia', name: 'Venezia', lat: 45.4408, lon: 12.3155, stopPlaceId: null },
    { id: 'milano',  name: 'Milano',  lat: 45.4642, lon: 9.1900,  stopPlaceId: null },
  ],
  emergency: { general: '112', police: '113', ambulance: '118', fire: '115' },
  places: [
    { cityId: 'roma', name: 'Mercato Centrale Roma', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Inside Termini station, open late, dry' },
    { cityId: 'roma', name: 'Pizzarium Bonci', kind: 'eat', walkMinutes: 25, price: '$', note: 'Pizza by weight, standing only' },
    { cityId: 'roma', name: 'Musei Capitolini', kind: 'indoor', walkMinutes: 12, note: 'Far quieter than the Vatican, same wet afternoon' },
    { cityId: 'roma', name: 'Palazzo Massimo', kind: 'indoor', walkMinutes: 8, note: 'Roman frescoes; rarely crowded' },
    { cityId: 'firenze', name: 'Mercato Centrale Firenze', kind: 'eat', walkMinutes: 8, price: '$$', note: 'Upper floor is a covered food hall until midnight' },
    { cityId: 'firenze', name: 'All’Antico Vinaio', kind: 'eat', walkMinutes: 6, price: '$', note: 'Sandwiches; the queue moves faster than it looks' },
    { cityId: 'firenze', name: 'Palazzo Pitti', kind: 'indoor', walkMinutes: 15, note: 'Several museums under one ticket — good for a full rainy day' },
    { cityId: 'venezia', name: 'Cantina Do Mori', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Cicchetti bar near Rialto; standing room' },
    { cityId: 'venezia', name: 'Gallerie dell’Accademia', kind: 'indoor', walkMinutes: 20, note: 'Reliable refuge during acqua alta' },
    { cityId: 'milano', name: 'Mercato Centrale Milano', kind: 'eat', walkMinutes: 12, price: '$$', note: 'At Centrale station; useful when a train is delayed' },
    { cityId: 'milano', name: 'Museo Nazionale Scienza e Tecnologia', kind: 'indoor', walkMinutes: 20, note: 'Leonardo galleries; large enough for half a day' },
  ],
  events: [
    { cityId: 'roma', name: 'Porta Portese market', kind: 'market', days: [0], from: '07:00', to: '14:00', free: true, note: 'Sunday morning only. Enormous, and the pickpockets know it too' },
    { cityId: 'firenze', name: 'Mercato Centrale Firenze', kind: 'market', days: 'daily', from: '09:00', to: '00:00', free: true, note: 'Upper floor runs to midnight every day; communal tables' },
    { cityId: 'venezia', name: 'Rialto fish market', kind: 'market', days: [2, 3, 4, 5, 6], from: '07:30', to: '12:00', free: true, note: 'Closed Sundays and Mondays. Go before 10:00 or it is over' },
    { cityId: 'milano', name: 'Mercato Centrale Milano', kind: 'market', days: 'daily', from: '08:00', to: '00:00', free: true, note: 'Inside Centrale station — useful when a train is delayed and you have hours' },
  ],
  essentials: [
    { when: 'The bill has extra lines', answer: '"Coperto" (a per-person cover charge) and sometimes "servizio" are normal and must be on the menu. Bread you did not order is usually part of the coperto.', costsIfUnknown: 'Arguing over a charge that is legal, or tipping on top of a service charge' },
    { when: 'Ordering coffee', answer: 'Standing at the counter is the cheap price. Sitting at a table can cost two or three times more, especially on a piazza.', costsIfUnknown: '6 € for an espresso that costs 1.50 € at the bar' },
    { when: 'Boarding a regional train', answer: 'Paper regional tickets must be validated in the green or yellow machine before you board. High-speed tickets with a seat are already valid.', costsIfUnknown: 'A fine of 50 € or more with a valid ticket in your hand' },
    { when: 'Driving into a historic centre', answer: 'Most city centres are ZTL — restricted zones watched by cameras. Hotels can register your plate, but only in advance.', costsIfUnknown: 'A fine per camera crossing, arriving by post months later' },
    { when: 'Wanting water', answer: 'Public drinking fountains run all day in Rome and many other cities. Tap water is safe.', costsIfUnknown: 'Buying bottled water several times a day' },
    { when: 'Planning the Uffizi, the Vatican or the Accademia', answer: 'Book a timed slot online. Walk-up queues in season are hours long and often sell out.', costsIfUnknown: 'Half a holiday day standing in a line, or missing it entirely' },
  ],
};
