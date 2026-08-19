/**
 * Tatil planı ve bozulma etkisi — saf mantık, ağ ve depolama yok.
 *
 * Ürünün asıl farkı burada. "Sonraki feribot 17:42" demek kolay.
 * Değerli olan şunu diyebilmek:
 *
 *   "17:42 feribotu 20:15'te varıyor. Otel girişin 21:00'e kadar açık,
 *    yetişiyorsun. Ama 19:30 rezervasyonunu kaçırıyorsun — şimdi arayıp
 *    ertele."
 *
 * Bunun için planın hangi maddesinin ESNEK, hangisinin SABİT olduğunu
 * bilmek gerekiyor. Müze kaçarsa sorun değil; uçuş kaçarsa tatil biter.
 */

export type ItemKind = 'transport' | 'stay' | 'activity' | 'meal';

export type PlanItem = {
  id: string;
  kind: ItemKind;
  title: string;
  /** ISO zaman. Aktivite için başlangıç, konaklama için giriş saati. */
  startsAt: string;
  endsAt?: string;
  cityId?: string;
  /**
   * Kaçırılırsa telafisi olmayan madde. Uçuş, tren bileti, otel girişi.
   * Esnek maddeler (müze, yemek) kaydırılabilir.
   */
  fixed: boolean;
  /** Konaklama girişi genelde belli bir saate kadar esnek olabilir. */
  latestAcceptableAt?: string;
};

export type Plan = {
  countryCode: string;
  items: PlanItem[];
};

export type ImpactLevel = 'safe' | 'tight' | 'breaks';

export type ItemImpact = {
  item: PlanItem;
  level: ImpactLevel;
  /** Ne kadar geç kalınıyor (dakika). Negatifse erken. */
  lateByMinutes: number;
};

export type Impact = {
  level: ImpactLevel;
  affected: ItemImpact[];
  summary: string;
};

/** Bu kadar yakınsa "yetişiyorsun ama koş" demek dürüst olur. */
const TIGHT_MINUTES = 20;

function minutesBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60_000);
}

export type AssessOptions = {
  /** Aksaklıkla değiştirilen madde — kendisini "kaçırdın" diye saymayız. */
  replacedItemId?: string;
  /** Aksaklığın yaşandığı an. Bundan önce süresi dolmuş maddeler zaten geçmiştir. */
  from?: string;
};

/**
 * Bir alternatifin (varış saati) plandaki maddeleri nasıl etkilediğini hesaplar.
 *
 * "Geçmiş" varış saatinden değil, AKSAKLIK ANINDAN türetilir. Aksi hâlde geç
 * varan bir seçenek, sabahki bir maddeyi de "kaçırıldı" diye gösterirdi —
 * oysa o madde hangi seçeneği seçersen seç zaten geçmişte.
 */
export function assessImpact(
  plan: Plan,
  arrivalIso: string,
  options: AssessOptions = {},
): Impact {
  const { replacedItemId, from } = options;
  const since = new Date(from ?? Date.now()).getTime();

  const upcoming = plan.items
    .filter((i) => i.id !== replacedItemId)
    .filter((i) => new Date(i.latestAcceptableAt ?? i.startsAt).getTime() >= since)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const affected: ItemImpact[] = [];

  for (const item of upcoming) {
    // Konaklamada asıl sınır giriş saatinin sonu; yoksa ilan edilen saat.
    const deadline = item.latestAcceptableAt ?? item.startsAt;
    const lateBy = minutesBetween(deadline, arrivalIso);

    if (lateBy <= -TIGHT_MINUTES) continue;            // rahat yetişiyor
    if (lateBy <= 0) {
      affected.push({ item, level: 'tight', lateByMinutes: lateBy });
      continue;
    }
    // Geç kalıyor: esnekse kaydırılır, sabitse kırılır.
    affected.push({ item, level: item.fixed ? 'breaks' : 'tight', lateByMinutes: lateBy });
  }

  const level: ImpactLevel = affected.some((a) => a.level === 'breaks')
    ? 'breaks'
    : affected.length > 0
      ? 'tight'
      : 'safe';

  return { level, affected, summary: summarise(level, affected) };
}

function summarise(level: ImpactLevel, affected: ItemImpact[]): string {
  if (level === 'safe') return 'Your plan still works.';

  const broken = affected.filter((a) => a.level === 'breaks');
  if (broken.length > 0) {
    const first = broken[0];
    return `You would miss ${first.item.title} by ${first.lateByMinutes} min. Call them now.`;
  }

  const tight = affected[0];
  return tight.lateByMinutes > 0
    ? `${tight.item.title} slips by ${tight.lateByMinutes} min — movable, but tell them.`
    : `You make ${tight.item.title} with ${Math.abs(tight.lateByMinutes)} min to spare.`;
}

/**
 * Seçenekleri plana göre sıralar: planı kurtaran önce, sonra en erken varan.
 * Saf hız sıralaması yanlış olurdu — 20 dakika erken varıp otel girişini
 * kaçıran seçenek, 20 dakika geç varıp her şeyi kurtarandan kötüdür.
 */
export function rankByPlan<T extends { arrival: string }>(
  plan: Plan,
  candidates: T[],
  options: AssessOptions = {},
): { option: T; impact: Impact }[] {
  const order: Record<ImpactLevel, number> = { safe: 0, tight: 1, breaks: 2 };
  return candidates
    .map((option) => ({ option, impact: assessImpact(plan, option.arrival, options) }))
    .sort((a, b) =>
      order[a.impact.level] - order[b.impact.level] ||
      a.option.arrival.localeCompare(b.option.arrival));
}
