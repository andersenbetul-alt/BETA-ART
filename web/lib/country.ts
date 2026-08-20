/**
 * Ülke soyutlaması — uygulamanın tek veri kaynağı.
 *
 * Yeni ülke eklemek KOD yazmak değil, VERİ yazmaktır: bir dosya + kayıt
 * satırı. Sayfalar ülkeye özgü hiçbir şey bilmez.
 *
 * Ölçekleme gerçeği: canlı ulaşım verisi her ülkede yok ve pahalı. Ama
 * turistin EN ÇOK para kaybettiği bilgiler (acil numara, kart/nakit, bahşiş,
 * eczane, bilet cezası) tamamen STATİK. Bu yüzden bir ülke, hiç ulaşım
 * entegrasyonu olmadan da faydalı açılır — `transport: 'none'` ile.
 */

export type CountryCode =
  | 'NO' | 'SE' | 'DK' | 'FI' | 'IS'
  | 'DE' | 'NL' | 'AT' | 'FR'
  | 'IT' | 'ES' | 'PT' | 'GR';

/** Ulaşım sağlayıcısı yoksa 'none' — ulaşım soruları o ülkede kapalı görünür. */
export type TransportProviderId = 'entur' | 'none';

export type CityRef = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** Sağlayıcıya özgü durak kimliği; sağlayıcı yoksa null. */
  stopPlaceId: string | null;
};

export type Place = {
  name: string;
  cityId: string;
  kind: 'eat' | 'indoor';
  /** Şehir merkezinden yaklaşık yürüme dakikası. */
  walkMinutes: number;
  note: string;
  price?: '$' | '$$' | '$$$';
};

export type Essential = {
  /** Turistin bu bilgiye ihtiyaç duyduğu an. */
  when: string;
  answer: string;
  /** Bilinmemesinin bedeli — önceliklendirme ve metnin tonu için. */
  costsIfUnknown: string;
};

export type Country = {
  code: CountryCode;
  name: string;
  /** Yerel dil kodu — hazır mesajlar bu dilde yazılır. */
  language: string;
  currency: string;
  transport: TransportProviderId;
  cities: CityRef[];
  places: Place[];
  /** 112 AB genelinde çalışır; ülkeye özgü numaralar burada. */
  emergency: { general: string; police: string; ambulance: string; fire: string };
  essentials: Essential[];
};

const registry: Record<CountryCode, () => Promise<{ country: Country }>> = {
  NO: () => import('./countries/no.ts'),
  SE: () => import('./countries/se.ts'),
  DK: () => import('./countries/dk.ts'),
  FI: () => import('./countries/fi.ts'),
  IS: () => import('./countries/is.ts'),
  DE: () => import('./countries/de.ts'),
  NL: () => import('./countries/nl.ts'),
  AT: () => import('./countries/at.ts'),
  FR: () => import('./countries/fr.ts'),
  IT: () => import('./countries/it.ts'),
  ES: () => import('./countries/es.ts'),
  PT: () => import('./countries/pt.ts'),
  GR: () => import('./countries/gr.ts'),
};

/** Menüde görünecek sıra: önce en olgun ülke, sonra bölge bölge. */
export const countryOrder: { code: CountryCode; name: string }[] = [
  { code: 'NO', name: 'Norway' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IS', name: 'Iceland' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'AT', name: 'Austria' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
];

export const defaultCountry: CountryCode = 'NO';

export function isCountryCode(v: string): v is CountryCode {
  return v in registry;
}

export async function getCountry(code: string): Promise<Country> {
  const key = isCountryCode(code) ? code : defaultCountry;
  return (await registry[key]()).country;
}

export function cityIn(country: Country, id?: string): CityRef {
  return country.cities.find((c) => c.id === id) ?? country.cities[0];
}

export function placesIn(country: Country, cityId: string, kind: Place['kind']): Place[] {
  return country.places
    .filter((p) => p.cityId === cityId && p.kind === kind)
    .sort((a, b) => a.walkMinutes - b.walkMinutes);
}
