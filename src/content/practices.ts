/**
 * Uzmanlık alanlarının kimlikleri.
 *
 * Bu kimlikler hizmetler sayfasındaki bağlantı çıpası olarak kullanılır
 * (`/tr/hizmetler#yonetim-strateji`). İş ilanı kimlikleri gibi bunlar da
 * dilden bağımsızdır; böylece paylaşılan bir bağlantı dil değişse de aynı
 * bölüme gider ve iki sözlük birbirinden ayrışamaz.
 */
export const practiceIds = ["yonetim-strateji", "ik-egitim"] as const;

export type PracticeId = (typeof practiceIds)[number];
