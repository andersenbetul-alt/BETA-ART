import type { Plan } from './plan.ts';

/**
 * Örnek tatil planı — gerçek uygulamada kullanıcının kendi planı olacak ve
 * tarayıcıda (localStorage) duracak: hesap yok, veritabanı yok, GDPR yükü yok.
 *
 * Saatler "şimdi"ye göre üretilir. Plan mutlak saatlerde, seferler göreli
 * olsaydı senaryo günün saatine göre anlamsızlaşırdı — sabah bakan biri
 * her seçeneği "güvenli" görürdü.
 */
function inHours(hours: number): string {
  return new Date(Date.now() + hours * 3_600_000).toISOString();
}

export const demoPlan: Plan = {
  countryCode: 'NO',
  items: [
    {
      id: 'ferry', kind: 'transport', title: 'Ferry to Stavanger',
      startsAt: inHours(0.5), fixed: true, cityId: 'bergen',
    },
    {
      id: 'hotel', kind: 'stay', title: 'Hotel check-in',
      startsAt: inHours(5), latestAcceptableAt: inHours(9), fixed: true, cityId: 'stavanger',
    },
    {
      id: 'dinner', kind: 'meal', title: 'Dinner reservation',
      startsAt: inHours(6), fixed: false, cityId: 'stavanger',
    },
    {
      id: 'flight', kind: 'transport', title: 'Flight home',
      startsAt: inHours(10), fixed: true, cityId: 'stavanger',
    },
  ],
};
