/**
 * Ülke soyutlaması.
 *
 * Amaç: yeni ülke eklemek KOD yazmak değil, VERİ yazmak olsun.
 * Bir ülke dosyası şehirleri, acil numaraları, ulaşım sağlayıcısını ve
 * turistin para/zaman kaybettiği ülkeye özgü bilgileri taşır.
 *
 * Ölçekleme gerçeği: canlı ulaşım verisi her ülkede yok ve pahalı.
 * Ama turistin EN ÇOK para kaybettiği sorunlar (eczane, acil numara,
 * taksi tarifesi, ATM kuru) tamamen STATİK bilgi — API gerektirmiyor.
 * Bu yüzden bir ülke, hiç ulaşım entegrasyonu olmadan da faydalı açılabilir.
 */

export type CountryCode = 'NO' | 'SE' | 'DK';

/** Ulaşım sağlayıcısı yoksa 'none' — uygulama yine çalışır, sadece o soru kapalıdır. */
export type TransportProviderId = 'entur' | 'none';

export type CityRef = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** Sağlayıcıya özgü durak kimliği; sağlayıcı 'none' ise null. */
  stopPlaceId: string | null;
};

export type Essential = {
  /** Turistin bu bilgiyi aramasına sebep olan an. */
  when: string;
  answer: string;
  /** Bilinmemesi durumunda kaybedilen para/zaman — önceliklendirme için. */
  costsIfUnknown: string;
};

export type Country = {
  code: CountryCode;
  name: string;
  currency: string;
  languages: string[];
  transport: TransportProviderId;
  cities: CityRef[];
  emergency: { general: string; police: string; ambulance: string; fire: string };
  essentials: Essential[];
};

/**
 * Ülke kaydı. Yeni ülke = yeni veri dosyası + buraya bir satır.
 * Sıra: İskandinavya → Avrupa.
 */
const registry: Record<CountryCode, () => Promise<{ country: Country }>> = {
  NO: () => import('./countries/no.ts'),
  SE: () => import('./countries/se.ts'),
  DK: () => import('./countries/dk.ts'),
};

export const countryCodes = Object.keys(registry) as CountryCode[];

export async function getCountry(code: string): Promise<Country | null> {
  const load = registry[code as CountryCode];
  return load ? (await load()).country : null;
}

export function isCountryCode(v: string): v is CountryCode {
  return v in registry;
}
