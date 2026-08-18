/* Curiosity Engine — puanlama.
 *
 * Üç ayrı skor üretilir:
 *   Trend Score  — konu ne kadar hızlı büyüyor ve bize ne kadar uyuyor
 *   Opportunity  — soruluyor ama iyi cevaplanmamış mı (içerik boşluğu)
 *   Money Score  — bu okuyucudan nasıl gelir elde edilir, yol ne kadar net
 *
 * Final skor bu üçünün ağırlıklı ortalamasıdır. Karar eşikleri aşağıda.
 *
 * Kalibrasyon notu: eşikler ham trend skoruna değil, harmanlanmış final skora
 * uygulanır. Harman daha muhafazakârdır — bir konunun 85+ alması için hem
 * büyümesi hem gelir yolu hem de içerik boşluğu aynı anda güçlü olmalı.
 * Pratikte: 90+ nadirdir (gerçek fırsat), 80–85 bandı taslak üretir,
 * 60'ın altı elenir. Bu bilinçli: yayın kapasitesi haftada 1–2 yazı olan
 * bir ekipte "yayınla" kararının pahalı olması gerekir.
 */

/* Trend Score ağırlıkları — toplam 1.0 */
export const WEIGHTS = {
  growth: 0.25,          // son 24–72 saatteki büyüme hızı
  searchInterest: 0.20,  // arama ilgisi (Trends / GSC gösterimleri)
  social: 0.15,          // sosyal medyada konuşulma
  commercial: 0.15,      // ticari niyet (satın almaya yakınlık)
  competition: 0.10,     // DÜŞÜK rekabet iyi → 100 = rakipsiz
  brandFit: 0.10,        // yedi sütunumuza uyum
  freshness: 0.05        // güncellik
};

/* Karar eşikleri — kullanıcı tanımı */
export const THRESHOLDS = [
  { min: 93, decision: 'hot',     label: '🔥 HOT — hemen üret, ana sayfaya çık, bültene gönder' },
  { min: 85, decision: 'publish', label: '🟢 Yayınla' },
  { min: 75, decision: 'draft',   label: '🟠 Taslak oluştur' },
  { min: 60, decision: 'idea',    label: '🟡 Fikir bankasına koy' },
  { min: 0,  decision: 'skip',    label: '❌ Yazma' }
];

const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));

export function trendScore(f) {
  return Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + clamp(f[k]) * w, 0);
}

/* Fırsat: talep var, cevap zayıf. Rekabetin düşüklüğü ve soru sayısı belirleyici. */
export function opportunityScore(f) {
  const demand = (clamp(f.searchInterest) + clamp(f.social)) / 2;
  const answerGap = clamp(f.competition);            // 100 = kimse iyi cevaplamamış
  const questionDepth = Math.min(100, (f.questionCount || 0) * 12);
  return demand * 0.4 + answerGap * 0.4 + questionDepth * 0.2;
}

/* Para: ticari niyet + gelir yolunun netliği. Yol yoksa skor düşer. */
const MONEY_PATH_VALUE = {
  service: 100,    // kendi hizmetimize doğrudan gidiyor
  product: 85,     // kendi dijital ürünümüz
  course: 80,
  affiliate: 70,
  ads: 40,
  none: 0
};

export function moneyScore(f) {
  const path = MONEY_PATH_VALUE[f.moneyPath ?? 'none'] ?? 0;
  return clamp(f.commercial) * 0.5 + path * 0.5;
}

export function finalScore({ trend, opportunity, money }) {
  return trend * 0.45 + opportunity * 0.30 + money * 0.25;
}

export function decide(score) {
  return THRESHOLDS.find((t) => score >= t.min);
}

/* İçerik tipi: ne kadar hızlı üretilmeli, kaç kelime olmalı. */
export function contentSpeed(f, final) {
  if (clamp(f.freshness) >= 85 && clamp(f.growth) >= 80) {
    return { speed: 'breaking', wordTarget: 700, sla: '30–60 dakika' };
  }
  if (clamp(f.growth) >= 55) {
    return { speed: 'rising', wordTarget: 2000, sla: '48 saat' };
  }
  return { speed: 'evergreen', wordTarget: 2500, sla: '1 hafta' };
}

/** Tek konu için tüm skorları hesaplar. */
export function scoreTopic(features) {
  const trend = trendScore(features);
  const opportunity = opportunityScore(features);
  const money = moneyScore(features);
  const final = finalScore({ trend, opportunity, money });
  const { decision, label } = decide(final);
  const speed = contentSpeed(features, final);
  return {
    growth: clamp(features.growth), searchInterest: clamp(features.searchInterest),
    social: clamp(features.social), commercial: clamp(features.commercial),
    competition: clamp(features.competition), brandFit: clamp(features.brandFit),
    freshness: clamp(features.freshness),
    trendScore: round(trend), opportunity: round(opportunity), money: round(money),
    finalScore: round(final), decision, label, ...speed
  };
}

const round = (n) => Math.round(n * 10) / 10;
