import type { PracticeId } from "./practices";

/**
 * İçgörü yazılarının kimlikleri ve dilden bağımsız bilgileri.
 *
 * İş ilanlarında olduğu gibi kimlik aynı zamanda URL parçasıdır ve iki dilde
 * de aynıdır: /tr/icgoruler/<id> ve /en/insights/<id>. Böylece paylaşılan bir
 * bağlantı dil değiştirildiğinde de aynı yazıda kalır.
 *
 * Dizi sırası listeleme sırasıdır — en yeni yazı başa gelir.
 */
export const articleIds = [
  "strateji-neden-rafta-kalir",
  "yetkinlik-modeli-oncesi-uc-soru",
  "egitimi-davranisla-olcmek",
] as const;

export type ArticleId = (typeof articleIds)[number];

export type ArticleMeta = {
  /** Yayın tarihi (YYYY-MM-DD) — Article yapılandırılmış verisine gider */
  publishedAt: string;
  /** Tahmini okuma süresi, dakika */
  readingMinutes: number;
  /** Yazının bağlı olduğu uzmanlık alanı */
  practice: PracticeId;
};

export const articleMeta: Record<ArticleId, ArticleMeta> = {
  "strateji-neden-rafta-kalir": {
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    practice: "yonetim-strateji",
  },
  "yetkinlik-modeli-oncesi-uc-soru": {
    publishedAt: "2026-07-21",
    readingMinutes: 5,
    practice: "ik-egitim",
  },
  "egitimi-davranisla-olcmek": {
    publishedAt: "2026-07-07",
    readingMinutes: 5,
    practice: "ik-egitim",
  },
};
