import type { Country } from '../country.ts';

/**
 * İsveç. Ulaşım sağlayıcısı henüz bağlı değil: Trafiklab/Resrobot ücretsiz
 * ama kayıt ve API anahtarı istiyor. Bu ülke `transport: 'none'` ile açılıyor
 * ve YİNE DE faydalı — turistin para kaybettiği sorunların çoğu statik bilgi.
 */
export const country: Country = {
  code: 'SE',
  name: 'Sweden',
  currency: 'SEK',
  languages: ['sv', 'en'],
  transport: 'none',
  cities: [
    { id: 'stockholm', name: 'Stockholm', lat: 59.3293, lon: 18.0686, stopPlaceId: null },
    { id: 'goteborg',  name: 'Göteborg',  lat: 57.7089, lon: 11.9746, stopPlaceId: null },
    { id: 'malmo',     name: 'Malmö',     lat: 55.6050, lon: 13.0038, stopPlaceId: null },
    { id: 'kiruna',    name: 'Kiruna',    lat: 67.8558, lon: 20.2253, stopPlaceId: null },
  ],
  emergency: { general: '112', police: '112', ambulance: '112', fire: '112' },
  essentials: [
    {
      when: 'Trying to pay with cash',
      answer: 'Sweden is close to cashless. Many cafés, buses and museums refuse cash entirely. Bring a card, not krona notes.',
      costsIfUnknown: 'Being unable to pay at all, plus exchange fees on cash nobody accepts',
    },
    {
      when: 'Boarding a bus or metro',
      answer: 'You usually cannot buy a ticket from the driver. Buy in the operator app or at a kiosk before boarding.',
      costsIfUnknown: 'Fines are roughly 1 500 SEK and inspectors are frequent',
    },
    {
      when: 'Being asked about a tip',
      answer: 'Service is included. Rounding up is normal; a percentage tip is not expected.',
      costsIfUnknown: 'Adding 10–15% unnecessarily at every meal',
    },
    {
      when: 'Needing medicine',
      answer: 'Pharmacies are "Apotek". Basic painkillers are also in supermarkets, unlike Norway.',
      costsIfUnknown: 'A wasted trip when the shop next door had it',
    },
    {
      when: 'Buying alcohol',
      answer: 'Anything above 3.5% is sold only at Systembolaget, closed Sundays and early on Saturdays.',
      costsIfUnknown: 'Restaurant prices for what a shop sells at a third of the cost',
    },
  ],
};
