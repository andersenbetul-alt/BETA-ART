/**
 * Etkinlik sıralaması — saf mantık, ağ yok.
 *
 * Kural: buraya YALNIZCA tekrar eden etkinlik yazılır (her pazar kurulan
 * pazar, her perşembe açılan hal). Tek seferlik konser YAZILMAZ — bir hafta
 * sonra yalan olur ve turist kapalı bir kapıya gider. Doğrulanamayan bilgi
 * ürünün tamamını çürütür.
 *
 * Sıralama "bugün ne var" üzerine kurulu: turistin sorusu "bu şehirde neler
 * oluyor" değil, "BU AKŞAM nereye gideyim".
 */

export type EventKind = 'market' | 'meet' | 'music' | 'tour' | 'outdoor';

export type SocialEvent = {
  cityId: string;
  name: string;
  kind: EventKind;
  /** Haftanın günleri (0 = Pazar) veya her gün. */
  days: number[] | 'daily';
  /** 'HH:MM' — yerel saat. */
  from: string;
  to?: string;
  note: string;
  free: boolean;
};

export type RankedEvent = SocialEvent & {
  /** Kaç gün sonra: 0 bugün, 1 yarın. */
  inDays: number;
  /** Ekranda görünecek zaman etiketi. */
  dayLabel: string;
};

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Ülkenin kendi saat diliminde haftanın günü. Turist Oslo'da değil, Atina'da olabilir. */
export function weekdayIn(timeZone: string, now: Date = new Date()): number {
  const name = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone }).format(now);
  return WEEKDAYS.indexOf(name);
}

function label(inDays: number, from: string, weekday: number): string {
  if (inDays === 0) return from >= '17:00' ? 'Tonight' : 'Today';
  if (inDays === 1) return 'Tomorrow';
  return WEEKDAYS[(weekday + inDays) % 7];
}

/**
 * Bugünden başlayarak sıralar. Bugün olanlar önce, sonra en yakın gün.
 * Aynı gün içinde erken başlayan önce.
 */
export function rankEvents(
  events: SocialEvent[],
  weekday: number,
): RankedEvent[] {
  return events
    .map((e) => {
      const inDays = e.days === 'daily'
        ? 0
        : Math.min(...e.days.map((d) => (d - weekday + 7) % 7));
      return { ...e, inDays, dayLabel: label(inDays, e.from, weekday) };
    })
    .sort((a, b) => a.inDays - b.inDays || a.from.localeCompare(b.from));
}

/**
 * Her şehirde küratörlü etkinlik olmayabilir. O zaman boş ekran göstermek
 * yerine her Avrupa şehrinde GERÇEKTEN geçerli olan üç yolu veriyoruz.
 * Uydurulmuş bir liste, kısa ve dürüst bir listeden kötüdür.
 */
export const universalWays: { what: string; detail: string }[] = [
  {
    what: 'Free walking tour, most mornings',
    detail:
      'Tip-based tours run daily in almost every European city and are the fastest way to end up with other travellers. Ask your hotel or hostel desk which one leaves tomorrow — they all know.',
  },
  {
    what: 'The covered market at the end of the day',
    detail:
      'Market halls turn into bars in the evening. Counters mean shared tables and no reservation, so eating alone is normal there and awkward almost everywhere else.',
  },
  {
    what: 'A language exchange night',
    detail:
      'Most cities have a weekly one in a bar, free to join. Search the city name plus "language exchange" — and ask the bartender, because these move venue more often than they get updated online.',
  },
];
