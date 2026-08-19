import 'server-only';
import type { WeatherVerdict } from './weather.ts';

/**
 * MET Norway Locationforecast 2.0 — ücretsiz, anahtarsız.
 *
 * Tek şartı: gerçek bir `User-Agent` göndermek ve içine iletişim bilgisi
 * koymak. Bunu yapmayanlar engelleniyor.
 *
 * ⚠️ Entur gibi bu da geliştirme ortamından doğrulanamadı (api.met.no engelli).
 */

const ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';

/** Yağış içeren MET sembol adları bu ekleri taşır. */
const WET = ['rain', 'sleet', 'snow', 'showers'];

type Timeseries = {
  time: string;
  data: {
    instant: { details: { air_temperature: number } };
    next_1_hours?: { summary: { symbol_code: string } };
  };
};

export async function forecast(lat: number, lon: number): Promise<WeatherVerdict> {
  const res = await fetch(`${ENDPOINT}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`, {
    headers: { 'User-Agent': process.env.MET_USER_AGENT ?? 'cobban-dev/0.1' },
    // MET, verinin 30 dakikadan sık çekilmemesini istiyor.
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`MET ${res.status}`);

  const json = await res.json();
  const series: Timeseries[] = json.properties?.timeseries ?? [];
  if (series.length === 0) throw new Error('MET boş seri döndü');

  const isWet = (t: Timeseries) =>
    WET.some((w) => t.data.next_1_hours?.summary.symbol_code?.includes(w) ?? false);

  const wetNow = isWet(series[0]);
  // Islaksa: ilk kuru saati bul. Kuruysa dryInHours anlamsız.
  const dryIndex = wetNow ? series.slice(0, 12).findIndex((t) => !isWet(t)) : -1;

  return {
    wetNow,
    dryInHours: dryIndex > 0 ? dryIndex : null,
    temperature: Math.round(series[0].data.instant.details.air_temperature),
    summary: series[0].data.next_1_hours?.summary.symbol_code ?? 'unknown',
  };
}

