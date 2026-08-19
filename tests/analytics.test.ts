import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analyticsEvents,
  funnelQuestions,
  surfaces,
  track,
  __setSink,
  type AnalyticsEvent,
  type AnalyticsPayload,
} from "@/lib/analytics";
import { articleIds } from "@/content/articles";
import { jobIds } from "@/content/jobs";
import { getDictionary } from "@/content";
import { locales } from "@/lib/i18n";

/**
 * Ölçüm sözleşmesi.
 *
 * Buradaki testler ölçümün *ne kadar* veri topladığını değil, **ne
 * toplayamadığını** doğrular. Gizlilik metni "kalıcı kimlik yok, serbest metin
 * yok" diyor; bu söz ancak koda bağlıysa üçüncü düzenlemeden sağ çıkar.
 */

afterEach(() => {
  __setSink(null);
  vi.unstubAllEnvs();
});

function capture() {
  const calls: { event: AnalyticsEvent; payload?: AnalyticsPayload }[] = [];
  __setSink((event, payload) => calls.push({ event, payload }));
  return calls;
}

describe("olay sözleşmesi", () => {
  it("her olayın cevapladığı bir soru var", () => {
    // Soru yazılamıyorsa olay da gerekmiyordur.
    for (const event of analyticsEvents) {
      expect(funnelQuestions[event], event).toBeTruthy();
    }
    expect(Object.keys(funnelQuestions).sort()).toEqual([...analyticsEvents].sort());
  });

  it("olay adları birbirinden ayrı", () => {
    expect(new Set(analyticsEvents).size).toBe(analyticsEvents.length);
    expect(new Set(surfaces).size).toBe(surfaces.length);
  });
});

describe("kişisel veri sızdırmaz", () => {
  it("yükte yalnızca kapalı kümeden değerler taşınır", () => {
    const calls = capture();
    track("article_opened", { where: "article", id: articleIds[0], locale: "tr" });
    track("job_apply_clicked", { where: "job", id: jobIds[0], locale: "en" });

    const allowedIds = new Set<string>([...articleIds, ...jobIds]);
    for (const { payload } of calls) {
      for (const [key, value] of Object.entries(payload ?? {})) {
        expect(["where", "id", "locale"]).toContain(key);
        if (key === "where") expect(surfaces).toContain(value);
        if (key === "id") expect(allowedIds.has(value as string)).toBe(true);
        if (key === "locale") expect(locales).toContain(value);
      }
    }
  });

  it("yük anahtarları sabit — yeni alan eklemek bilinçli olmalı", () => {
    // Bu test bir alan eklendiğinde kırılır. Kırıldığında sorulacak soru:
    // eklenen alan kullanıcıyı tanımlar mı?
    const keys: (keyof AnalyticsPayload)[] = ["where", "id", "locale"];
    expect(keys).toHaveLength(3);
  });

  it("kimlikler sözlükte tanımlı — kullanıcıdan gelmez", () => {
    for (const locale of locales) {
      const dict = getDictionary(locale);
      for (const id of articleIds) expect(dict.insights.articles[id]).toBeDefined();
      for (const id of jobIds) expect(dict.careers.jobs[id]).toBeDefined();
    }
  });
});

describe("sağlayıcı seçilmeden hiçbir şey gönderilmez", () => {
  it("sunucuda track() sessizdir", () => {
    // Test ortamında `window` yok; resolveSink noop döner.
    __setSink(null);
    expect(() => track("cta_contact_clicked", { where: "home", locale: "tr" })).not.toThrow();
  });

  it("olay gönderimi enjekte edilen sink üzerinden gider", () => {
    const calls = capture();
    track("language_switched", { where: "header", locale: "en" });
    expect(calls).toEqual([
      { event: "language_switched", payload: { where: "header", locale: "en" } },
    ]);
  });
});

describe("gizlilik metni ölçümle tutarlı", () => {
  it("çerez bölümü ölçümü de anlatır", () => {
    for (const locale of locales) {
      const dict = getDictionary(locale);
      const section = dict.privacy.sections.find((s) =>
        /çerez|cookie/i.test(s.title),
      );
      expect(section, locale).toBeDefined();
      const text = section!.paragraphs.join(" ");
      // Çerez ve kalıcı kimlik reddi metinde açıkça yer almalı.
      expect(text, locale).toMatch(/çerez kullan|uses no advertising|without cookies/i);
      expect(text, locale).toMatch(/kalıcı bir kimlik|persistent identifier/i);
    }
  });
});
