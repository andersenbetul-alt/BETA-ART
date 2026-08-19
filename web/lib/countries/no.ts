import type { Country } from '../country.ts';

export const country: Country = {
  code: 'NO',
  name: 'Norway',
  currency: 'NOK',
  languages: ['no', 'en'],
  transport: 'entur',
  cities: [
    { id: 'bergen',    name: 'Bergen',    lat: 60.3913, lon: 5.3221,  stopPlaceId: 'NSR:StopPlace:548' },
    { id: 'oslo',      name: 'Oslo',      lat: 59.9111, lon: 10.7528, stopPlaceId: 'NSR:StopPlace:337' },
    { id: 'tromso',    name: 'Tromsø',    lat: 69.6492, lon: 18.9553, stopPlaceId: 'NSR:StopPlace:73230' },
    { id: 'stavanger', name: 'Stavanger', lat: 58.9700, lon: 5.7331,  stopPlaceId: 'NSR:StopPlace:60298' },
  ],
  emergency: { general: '112', police: '112', ambulance: '113', fire: '110' },
  essentials: [
    {
      when: 'Paying for anything',
      answer: 'Cards work everywhere, including buses and small kiosks. You can travel Norway without touching cash.',
      costsIfUnknown: 'ATM withdrawal fees and bad exchange rates on cash you never needed',
    },
    {
      when: 'A taxi driver quotes a price',
      answer: 'Taxi prices are not regulated and vary a lot by company. The maximum fare must be shown on the window sticker before you get in.',
      costsIfUnknown: 'A 20-minute ride can differ by several hundred NOK between companies',
    },
    {
      when: 'Being asked about a tip',
      answer: 'Tipping is not expected. Service is included. Rounding up is generous, not required.',
      costsIfUnknown: '10–15% added on every meal for no reason',
    },
    {
      when: 'Buying bottled water',
      answer: 'Tap water is excellent everywhere. Bring a bottle and refill.',
      costsIfUnknown: '30–40 NOK per bottle, several times a day',
    },
    {
      when: 'Needing medicine',
      answer: 'Pharmacies are "Apotek". Many painkillers are sold only there, not in supermarkets. Ask for the pharmacist — they speak English.',
      costsIfUnknown: 'An unnecessary doctor visit for something a pharmacist can hand you',
    },
    {
      when: 'Alcohol after shop hours',
      answer: 'Beer is sold in supermarkets but stops at 20:00 on weekdays and 18:00 on Saturdays. Wine and spirits only at Vinmonopolet, closed Sundays.',
      costsIfUnknown: 'Paying restaurant prices because you missed the cut-off',
    },
  ],
};
