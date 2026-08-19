/**
 * Dönüşüm ölçümü.
 *
 * TASARIM KARARI — neden bu şekilde:
 *
 * Gizlilik metni sitede takip çerezi ve üçüncü taraf analiz aracı olmadığını
 * söylüyor. Bu sözü bozmadan ölçüm yapmanın yolu, ölçümü baştan onay
 * gerektirmeyecek şekilde tasarlamak:
 *
 * - Çerez yok, kalıcı kimlik yok, parmak izi yok
 * - Olay yükünde serbest metin yok — yalnızca sabit birleşim tipleri.
 *   Böylece kazara e-posta, isim veya mesaj içeriği gönderilemez;
 *   bunu tip sistemi ve bir test birlikte garanti eder
 * - Oturumlar arası kullanıcı eşleştirilmez
 *
 * Sonuç: onay bandına gerek kalmıyor. Bant dönüşümü düşürür ve
 * kullanıcıdan gereksiz bir karar ister.
 *
 * Sağlayıcı bilinçli olarak takılmadı. `NEXT_PUBLIC_ANALYTICS` tanımlı
 * değilse hiçbir şey gönderilmez; site bugünkü gibi tamamen ölçümsüz çalışır.
 */

import type { ArticleId } from "@/content/articles";
import type { JobId } from "@/content/jobs";
import type { Locale } from "./i18n";

/** Ölçülen olaylar. Yeni olay eklemek bilinçli bir karar olmalı. */
export const analyticsEvents = [
  // Huni: sayfa → ilgi → temas
  "cta_contact_clicked",
  "contact_form_started",
  "contact_form_submitted",
  "contact_form_failed",
  "language_switched",
  // İçerik: hangi yazı ilgi çekiyor
  "article_opened",
  "article_completed",
  // Kariyer: ilan → başvuru
  "job_opened",
  "job_apply_clicked",
  // Ürün
  "ai_workforce_opened",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

/**
 * Olay yükü. Yalnızca kapalı kümeler — serbest metin kabul edilmez.
 *
 * `where` olayın hangi sayfadan geldiğini söyler; kullanıcıyı değil.
 */
export const surfaces = [
  "home",
  "services",
  "approach",
  "insights",
  "about",
  "careers",
  "contact",
  "ai-workforce",
  "article",
  "job",
  "header",
  "footer",
] as const;

/** Olayın hangi ekrandan geldiği. Kapalı küme — serbest metin değil. */
export type Surface = (typeof surfaces)[number];

export type AnalyticsPayload = {
  where?: Surface;
  /**
   * İçerik kimliği. Tip bilinçli olarak dar: yalnızca sözlükte tanımlı ilan ve
   * yazı kimlikleri geçer. `string` olsaydı bir gün buraya kullanıcıdan gelen
   * bir değer sızabilirdi; birleşim tipi bunu derleme zamanında engelliyor.
   */
  id?: ArticleId | JobId;
  locale?: Locale;
};

type Sink = (event: AnalyticsEvent, payload?: AnalyticsPayload) => void;

/** Varsayılan: hiçbir şey gönderme. Sağlayıcı seçilene kadar site ölçümsüzdür. */
const noop: Sink = () => {};

function resolveSink(): Sink {
  if (typeof window === "undefined") return noop;
  const provider = process.env.NEXT_PUBLIC_ANALYTICS;
  if (!provider) return noop;

  // Sağlayıcı takıldığında yalnızca burası değişir. Olay sözleşmesi aynı kalır.
  return (event, payload) => {
    const w = window as unknown as {
      plausible?: (name: string, opts?: { props: Record<string, string> }) => void;
    };
    if (provider === "plausible" && typeof w.plausible === "function") {
      const props = Object.fromEntries(
        Object.entries(payload ?? {}).filter(([, v]) => typeof v === "string"),
      ) as Record<string, string>;
      w.plausible(event, Object.keys(props).length > 0 ? { props } : undefined);
    }
  };
}

let sink: Sink | null = null;

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
  sink ??= resolveSink();
  sink(event, payload);
}

/** Testler için. */
export function __setSink(next: Sink | null): void {
  sink = next;
}

/**
 * Huninin okunuşu — her olayın hangi soruya cevap verdiği.
 * Ölçüm ancak bir soruya bağlıysa işe yarar; bu tablo olmadan olay birikir,
 * karar üretmez.
 */
export const funnelQuestions: Record<AnalyticsEvent, string> = {
  cta_contact_clicked: "Hangi sayfa görüşme talebine yönlendiriyor?",
  contact_form_started: "Formu açanların kaçı doldurmaya başlıyor?",
  contact_form_submitted: "Kaç talep tamamlanıyor?",
  contact_form_failed: "Doğrulama hataları nerede yoğunlaşıyor?",
  language_switched: "İngilizce içerik gerçekten kullanılıyor mu?",
  article_opened: "Hangi yazı ilgi çekiyor?",
  article_completed: "Yazılar sonuna kadar okunuyor mu?",
  job_opened: "Hangi ilan ilgi görüyor?",
  job_apply_clicked: "İlanı görenlerin kaçı başvuruyor?",
  ai_workforce_opened: "Yeni ürün sayfası trafik alıyor mu?",
};
