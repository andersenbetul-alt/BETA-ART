import type { Country } from '../country.ts';

export const country: Country = {
  code: 'FR', name: 'France', language: 'fr', currency: 'EUR', timeZone: 'Europe/Paris', transport: 'none',
  cities: [
    { id: 'paris',     name: 'Paris',     lat: 48.8566, lon: 2.3522, stopPlaceId: null },
    { id: 'lyon',      name: 'Lyon',      lat: 45.7640, lon: 4.8357, stopPlaceId: null },
    { id: 'nice',      name: 'Nice',      lat: 43.7102, lon: 7.2620, stopPlaceId: null },
    { id: 'marseille', name: 'Marseille', lat: 43.2965, lon: 5.3698, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '17', ambulance: '15', fire: '18' },
  places: [
    { cityId: 'paris', name: 'Marché des Enfants Rouges', kind: 'eat', walkMinutes: 12, price: '$$', note: 'Covered market, open when it rains, many kitchens' },
    { cityId: 'paris', name: 'L’As du Fallafel', kind: 'eat', walkMinutes: 14, price: '$', note: 'Cheap and fast; closed Saturdays' },
    { cityId: 'paris', name: 'Musée d’Orsay', kind: 'indoor', walkMinutes: 10, note: 'Shorter queues than the Louvre, same rainy afternoon' },
    { cityId: 'paris', name: 'Muséum national d’Histoire naturelle', kind: 'indoor', walkMinutes: 20, note: 'The Grande Galerie works well with children' },
    { cityId: 'lyon', name: 'Les Halles Paul Bocuse', kind: 'eat', walkMinutes: 15, price: '$$', note: 'Indoor food hall; counters serve all afternoon' },
    { cityId: 'lyon', name: 'Musée des Confluences', kind: 'indoor', walkMinutes: 25, note: 'Big, modern, easy to fill three hours' },
    { cityId: 'nice', name: 'Marché Cours Saleya', kind: 'eat', walkMinutes: 6, price: '$$', note: 'Socca stalls; market closes early afternoon' },
    { cityId: 'nice', name: 'Musée Matisse', kind: 'indoor', walkMinutes: 30, note: 'Uphill in Cimiez — take the bus, not the walk' },
    { cityId: 'marseille', name: 'Les Halles de la Major', kind: 'eat', walkMinutes: 10, price: '$$', note: 'Under the cathedral, sheltered seating' },
    { cityId: 'marseille', name: 'MuCEM', kind: 'indoor', walkMinutes: 12, note: 'Walkways are outdoors — the galleries are not' },
  ],
  events: [
    { cityId: 'paris', name: 'Marché aux Puces de Saint-Ouen', kind: 'market', days: [6, 0, 1], from: '10:00', to: '18:00', free: true, note: 'Saturday to Monday only. Largest antiques market in the world' },
    { cityId: 'paris', name: 'Marché des Enfants Rouges', kind: 'market', days: [2, 3, 4, 5, 6, 0], from: '08:30', to: '20:30', free: true, note: 'Closed Mondays. Shared tables between the kitchens' },
    { cityId: 'lyon', name: 'Marché de la Croix-Rousse', kind: 'market', days: [2, 3, 4, 5, 6, 0], from: '06:00', to: '13:30', free: true, note: 'Mornings only; the boulevard fills the whole way up' },
    { cityId: 'nice', name: 'Cours Saleya market', kind: 'market', days: [2, 3, 4, 5, 6, 0], from: '06:00', to: '13:30', free: true, note: 'Flowers and produce Tuesday to Sunday; Monday it turns into an antiques market' },
    { cityId: 'marseille', name: 'Vieux-Port fish market', kind: 'market', days: 'daily', from: '08:00', to: '13:00', free: true, note: 'Fishermen sell straight off the boats every morning' },
  ],
  essentials: [
    { when: 'You want lunch at 15:30', answer: 'Most kitchens serve roughly 12:00–14:00 and 19:00–22:00. Outside those hours look for a brasserie, a bakery, or a covered market.', costsIfUnknown: 'Walking past twenty restaurants that are all open but serving nothing' },
    { when: 'Being asked about a tip', answer: 'Service is included by law — "service compris" is already in the price. Leaving a couple of euros is generous, not expected.', costsIfUnknown: '15% added to every meal for no reason' },
    { when: 'Boarding a regional (TER) train or a bus', answer: 'Validate your ticket in the yellow or grey machine on the platform before boarding. TGV e-tickets do not need it.', costsIfUnknown: 'A fine of around 50 € even though you paid for the ticket' },
    { when: 'A café bill looks higher than the menu', answer: 'Prices differ by where you sit: at the counter, in the room, on the terrace. All three must be posted.', costsIfUnknown: 'Paying terrace prices for a coffee you drank standing up' },
    { when: 'Needing medicine', answer: 'Pharmacies show a green cross. Painkillers are sold only there. Every area posts the "pharmacie de garde" for nights and Sundays.', costsIfUnknown: 'Hunting supermarkets that are not allowed to sell it' },
    { when: 'Travelling in August', answer: 'Many independent restaurants and small shops close for two or three weeks. Chains and tourist-area places stay open.', costsIfUnknown: 'A booked-ahead evening that turns out to be a shuttered door' },
  ],
};
