import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { articleIds, articleMeta } from "@/content/articles";
import { jobIds, jobMeta } from "@/content/jobs";
import { practiceIds } from "@/content/practices";
import { locales, navKeys, type Locale } from "@/lib/i18n";

const dicts = locales.map((locale) => [locale, getDictionary(locale)] as const);

/**
 * İki dilin içerik olarak da ayrışmadığını doğrular. Tip sistemi alanların
 * varlığını garanti eder; buradaki testler dizi uzunluğu ve boş metin gibi
 * tipin yakalayamadığı sapmaları yakalar.
 */
describe("içerik sözlüğü eşleşmesi", () => {
  it("her dilde menü başlıkları tanımlıdır", () => {
    for (const [locale, dict] of dicts) {
      for (const key of navKeys) {
        expect(dict.nav[key], `${locale}.nav.${key}`).toBeTruthy();
      }
    }
  });

  it("her dilde aynı sayıda uzmanlık alanı vardır", () => {
    const counts = dicts.map(([, dict]) => dict.services.practices.length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBeGreaterThan(0);
  });

  it("uzmanlık alanı kimlikleri diller arasında değişmez", () => {
    const [tr, en] = dicts.map(([, dict]) =>
      dict.services.practices.map((p) => p.id),
    );
    expect(tr).toEqual(en);
  });

  it("her dilde aynı sayıda yaklaşım aşaması ve adımları vardır", () => {
    const [tr, en] = dicts.map(([, dict]) =>
      dict.approach.phases.map((p) => p.step),
    );
    expect(tr).toEqual(en);
  });

  it("form konu seçenekleri iki dilde aynı sayıdadır", () => {
    const counts = dicts.map(
      ([, dict]) => dict.contact.form.topicOptions.length,
    );
    expect(new Set(counts).size).toBe(1);
  });

  it("gizlilik metni iki dilde de aynı sayıda bölüm içerir", () => {
    const counts = dicts.map(([, dict]) => dict.privacy.sections.length);
    expect(new Set(counts).size).toBe(1);
  });

  it("hiçbir dilde boş metin bırakılmamıştır", () => {
    const emptyStrings: string[] = [];
    const walk = (value: unknown, trail: string) => {
      if (typeof value === "string") {
        if (value.trim() === "") emptyStrings.push(trail);
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${trail}[${i}]`));
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) walk(v, `${trail}.${k}`);
      }
    };
    for (const [locale, dict] of dicts) walk(dict, locale);
    expect(emptyStrings).toEqual([]);
  });
});

describe("iş ilanları", () => {
  it("her ilan iki dilde de tanımlıdır", () => {
    for (const [locale, dict] of dicts) {
      for (const id of jobIds) {
        expect(dict.careers.jobs[id], `${locale}.careers.jobs.${id}`).toBeDefined();
      }
    }
  });

  it("ilan sözlüğünde fazladan kayıt yoktur", () => {
    for (const [, dict] of dicts) {
      expect(Object.keys(dict.careers.jobs).sort()).toEqual([...jobIds].sort());
    }
  });

  it("her ilanın sorumluluk ve beklenti listesi doludur", () => {
    for (const [locale, dict] of dicts) {
      for (const id of jobIds) {
        const job = dict.careers.jobs[id];
        expect(job.responsibilities.length, `${locale}/${id}`).toBeGreaterThan(0);
        expect(job.requirements.length, `${locale}/${id}`).toBeGreaterThan(0);
      }
    }
  });

  it("ilan kimlikleri URL'de kullanılabilir", () => {
    for (const id of jobIds) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  // Bu tarihler JobPosting yapılandırılmış verisine gider; biçimi bozulmamalı.
  it("ilan tarihleri geçerli ve tutarlıdır", () => {
    for (const id of jobIds) {
      const meta = jobMeta[id];
      expect(meta.postedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.validThrough).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(
        new Date(meta.validThrough).getTime(),
        `${id}: bitiş tarihi yayın tarihinden sonra olmalı`,
      ).toBeGreaterThan(new Date(meta.postedAt).getTime());
    }
  });
});

describe("içgörü yazıları", () => {
  it("her yazı iki dilde de tanımlıdır", () => {
    for (const [locale, dict] of dicts) {
      for (const id of articleIds) {
        expect(dict.insights.articles[id], `${locale}.insights.${id}`).toBeDefined();
      }
    }
  });

  it("yazı sözlüğünde fazladan kayıt yoktur", () => {
    for (const [, dict] of dicts) {
      expect(Object.keys(dict.insights.articles).sort()).toEqual(
        [...articleIds].sort(),
      );
    }
  });

  it("her yazının gövdesi ve kapanışı doludur", () => {
    for (const [locale, dict] of dicts) {
      for (const id of articleIds) {
        const article = dict.insights.articles[id];
        expect(article.sections.length, `${locale}/${id}`).toBeGreaterThan(2);
        expect(article.takeaway.length, `${locale}/${id}`).toBeGreaterThan(40);
        for (const section of article.sections) {
          expect(section.paragraphs.length, `${locale}/${id}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("bölüm başlıkları iki dilde aynı sayıdadır", () => {
    for (const id of articleIds) {
      const counts = dicts.map(
        ([, dict]) => dict.insights.articles[id].sections.length,
      );
      expect(new Set(counts).size, id).toBe(1);
    }
  });

  it("yazı kimlikleri URL'de kullanılabilir", () => {
    for (const id of articleIds) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  // Yazı, hizmetler sayfasındaki bir bölüme çıpayla bağlanır.
  it("her yazı geçerli bir uzmanlık alanına bağlıdır", () => {
    for (const id of articleIds) {
      expect(practiceIds).toContain(articleMeta[id].practice);
    }
  });

  it("yayın tarihleri geçerlidir", () => {
    for (const id of articleIds) {
      expect(articleMeta[id].publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(articleMeta[id].publishedAt).getTime())).toBe(false);
    }
  });

  it("yazılar en yeniden eskiye sıralıdır", () => {
    const dates = articleIds.map((id) =>
      new Date(articleMeta[id].publishedAt).getTime(),
    );
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });
});

describe("erişilebilirlik metinleri", () => {
  // Atlama bağlantısı #main'e gider; etiketi "ana sayfaya dön" olmamalı.
  it("atlama bağlantısı içeriğe atlamayı anlatır", () => {
    for (const [locale, dict] of dicts) {
      expect(dict.actions.skipToContent, locale).toBeTruthy();
      expect(dict.actions.skipToContent, locale).not.toBe(dict.actions.backHome);
    }
  });
});

describe("dil etiketleri", () => {
  it("html lang değeri dil koduyla eşleşir", () => {
    for (const [locale, dict] of dicts) {
      expect(dict.meta.htmlLang).toBe(locale satisfies Locale);
    }
  });
});
