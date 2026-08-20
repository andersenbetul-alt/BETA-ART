import type { Country } from '../country.ts';

export const country: Country = {
  code: 'ES', name: 'Spain', language: 'es', currency: 'EUR', timeZone: 'Europe/Madrid', transport: 'none',
  cities: [
    { id: 'barcelona', name: 'Barcelona', lat: 41.3874, lon: 2.1686,  stopPlaceId: null },
    { id: 'madrid',    name: 'Madrid',    lat: 40.4168, lon: -3.7038, stopPlaceId: null },
    { id: 'sevilla',   name: 'Sevilla',   lat: 37.3891, lon: -5.9845, stopPlaceId: null },
    { id: 'valencia',  name: 'Valencia',  lat: 39.4699, lon: -0.3763, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '091' },
  roadside: { garageWord: 'taller mecánico', bodyShopWord: 'chapa y pintura' },
  places: [
    { cityId: 'barcelona', name: 'Mercat de Santa Caterina', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Covered market with counters; quieter than La Boqueria' },
    { cityId: 'barcelona', name: 'Bar del Pla', kind: 'eat', walkMinutes: 12, price: '$$', note: 'Tapas, no reservations, go early' },
    { cityId: 'barcelona', name: 'Fundació Joan Miró', kind: 'indoor', walkMinutes: 30, note: 'On Montjuïc — take the funicular in bad weather' },
    { cityId: 'barcelona', name: 'CosmoCaixa', kind: 'indoor', walkMinutes: 35, note: 'Science museum; the best option with children' },
    { cityId: 'madrid', name: 'Mercado de San Fernando', kind: 'eat', walkMinutes: 15, price: '$', note: 'Neighbourhood market, local prices, indoors' },
    { cityId: 'madrid', name: 'Museo Reina Sofía', kind: 'indoor', walkMinutes: 12, note: 'Guernica is here; free late afternoons' },
    { cityId: 'madrid', name: 'Museo del Prado', kind: 'indoor', walkMinutes: 10, note: 'Free in the last two hours — expect a queue for it' },
    { cityId: 'sevilla', name: 'Mercado Lonja del Barranco', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Riverside food hall, air-conditioned in summer' },
    { cityId: 'sevilla', name: 'Museo de Bellas Artes', kind: 'indoor', walkMinutes: 12, note: 'Cool, calm and cheap when the street is 40 °C' },
    { cityId: 'valencia', name: 'Mercat Central', kind: 'eat', walkMinutes: 8, price: '$$', note: 'One of Europe’s largest market halls; mornings only' },
    { cityId: 'valencia', name: 'Ciutat de les Arts i les Ciències', kind: 'indoor', walkMinutes: 30, note: 'Aquarium and science museum; a full day indoors' },
  ],
  events: [
    { cityId: 'barcelona', name: 'Els Encants Fira de Bellcaire', kind: 'market', days: [1, 3, 5, 6], from: '09:00', to: '20:00', free: true, note: 'Monday, Wednesday, Friday and Saturday under the mirrored roof' },
    { cityId: 'madrid', name: 'El Rastro', kind: 'market', days: [0], from: '09:00', to: '15:00', free: true, note: 'Sunday morning in La Latina, then everyone moves to the bars around it' },
    { cityId: 'sevilla', name: 'Mercado Lonja del Barranco', kind: 'market', days: 'daily', from: '10:00', to: '00:00', free: true, note: 'Riverside food hall, air-conditioned, open late' },
    { cityId: 'valencia', name: 'Mercat Central', kind: 'market', days: [1, 2, 3, 4, 5, 6], from: '07:30', to: '15:00', free: true, note: 'Mornings only; one of the largest market halls in Europe' },
  ],
  essentials: [
    { when: 'You are hungry at 18:00', answer: 'Kitchens serve lunch around 14:00–16:00 and dinner from 20:30 or 21:00. In between, tapas bars and markets are your option.', costsIfUnknown: 'An evening spent looking for a restaurant that is open but not cooking' },
    { when: 'Choosing lunch', answer: 'Weekday "menú del día" is a fixed three-course lunch with a drink, usually 12–18 €. It is the cheapest proper meal of the day.', costsIfUnknown: 'Paying à la carte dinner prices for the same food' },
    { when: 'On the metro or Las Ramblas in Barcelona', answer: 'Pickpocketing is organised and fast, mostly on the L3 metro line and in crowded streets. Keep phone and wallet in a front or inside pocket.', costsIfUnknown: 'Your phone, your cards and a day at the police station' },
    { when: 'Sitting on a terrace', answer: 'Terrace prices are legally allowed to be higher than at the bar, and the menu must say so.', costsIfUnknown: 'A surprise on the bill after four rounds' },
    { when: 'Being asked about a tip', answer: 'Small and optional. Rounding up, or a euro or two per person, is normal. Nobody expects a percentage.', costsIfUnknown: 'Tipping American rates all week' },
    { when: 'Needing medicine', answer: 'Pharmacies show a green cross. Most medicines, including painkillers, are pharmacy-only. Each district posts a 24-hour "farmacia de guardia".', costsIfUnknown: 'A wasted evening searching supermarkets' },
  ],
};
