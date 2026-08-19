/**
 * Hava durumu kararı — saf mantık, ağ erişimi yok.
 *
 * Ağ çağrısı `lib/met.ts` içinde ve `server-only`. Karar burada durur ki
 * testten çağrılabilsin: ürünün asıl faydası bu birkaç satırda.
 */

export type WeatherVerdict = {
  /** Şu anda ıslanır mısın? */
  wetNow: boolean;
  /** Kaç saat sonra kuruyor? Bulunamazsa null. */
  dryInHours: number | null;
  temperature: number | null;
  summary: string;
};


/**
 * Karar: içeri mi geçmeli, yoksa beklemeye değer mi?
 *
 * Ürünün asıl faydası bu. "Yağmurluysa müze listesi göster" herkesin
 * yapabileceği şey; "40 dakika sonra duruyor, kahve iç ve bekle" demek
 * turistin gününü kurtarır.
 */
export function shouldGoIndoors(w: WeatherVerdict): { indoors: boolean; advice: string } {
  if (!w.wetNow) {
    return { indoors: false, advice: "Dry right now. Keep your outdoor plan." };
  }
  if (w.dryInHours !== null && w.dryInHours <= 2) {
    return {
      indoors: false,
      advice: `Clears in about ${w.dryInHours} ${w.dryInHours === 1 ? 'hour' : 'hours'}. Wait it out over a coffee — don't rebook anything.`,
    };
  }
  return { indoors: true, advice: 'Wet for the next few hours. Move the day indoors.' };
}
