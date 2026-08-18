/**
 * Açık pozisyonların kimlikleri ve dile bağlı olmayan bilgileri.
 *
 * Kimlik aynı zamanda URL parçasıdır: /tr/kariyer/<id> ve /en/careers/<id>.
 * Dil değiştiricinin ilan sayfalarında da doğru çalışması için bilinçli olarak
 * tek bir dilden bağımsız slug kullanılır.
 *
 * Yeni ilan eklemek için: buraya kimliği ekleyin, ardından `tr.ts` ve `en.ts`
 * içindeki `careers.jobs` kayıtlarını doldurun — iki dilde de tanımlamazsanız
 * derleme hata verir.
 */
export const jobIds = [
  "kidemli-yonetim-danismani",
  "insan-kaynaklari-danismani",
  "kurumsal-egitim-tasarimcisi",
  "danismanlik-stajyeri",
] as const;

export type JobId = (typeof jobIds)[number];

export type JobMeta = {
  /** schema.org JobPosting için istihdam türü */
  employmentType: "FULL_TIME" | "PART_TIME" | "INTERN" | "CONTRACTOR";
  /** İlanın yayına alındığı tarih (YYYY-MM-DD) */
  postedAt: string;
  /** İlanın geçerlilik bitişi (YYYY-MM-DD) */
  validThrough: string;
};

export const jobMeta: Record<JobId, JobMeta> = {
  "kidemli-yonetim-danismani": {
    employmentType: "FULL_TIME",
    postedAt: "2026-08-18",
    validThrough: "2026-11-30",
  },
  "insan-kaynaklari-danismani": {
    employmentType: "FULL_TIME",
    postedAt: "2026-08-18",
    validThrough: "2026-11-30",
  },
  "kurumsal-egitim-tasarimcisi": {
    employmentType: "FULL_TIME",
    postedAt: "2026-08-18",
    validThrough: "2026-11-30",
  },
  "danismanlik-stajyeri": {
    employmentType: "INTERN",
    postedAt: "2026-08-18",
    validThrough: "2026-10-31",
  },
};
