import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { locales } from "@/lib/i18n";

/**
 * Metin ilkeleri — otomatik kontrol.
 *
 * Bir metin ilkesi ancak zorunlu kılınabiliyorsa yaşar; belge olarak
 * kalırsa üçüncü düzenlemede unutulur. Bu yüzden kurallar test olarak
 * yazılmıştır.
 *
 * Buradaki kurallar sitenin kendi iddialarını sınırlar. Yazıların ve
 * ilanların gövde metni kapsam dışıdır — orada "her zaman" gibi ifadeler
 * bir gözlemi anlatır, kurumsal bir taahhüt değildir.
 */

const dicts = locales.map((locale) => [locale, getDictionary(locale)] as const);

/** Kurumun kendi hakkında iddia ettiği yerler. */
function claimSurfaces(dict: ReturnType<typeof getDictionary>): [string, string][] {
  const out: [string, string][] = [];
  const push = (path: string, value: string) => out.push([path, value]);

  push("home.hero.title", dict.home.hero.title);
  push("home.hero.highlight", dict.home.hero.highlight);
  push("home.hero.description", dict.home.hero.description);
  push("home.hero.promise", dict.home.hero.promise);
  push("home.cta.description", dict.home.cta.description);
  for (const [i, item] of dict.home.why.items.entries()) {
    push(`home.why[${i}]`, item.description);
  }
  push("about.mission", dict.about.mission.description);
  push("about.vision", dict.about.vision.description);
  push("contact.form.description", dict.contact.form.description);
  push("contact.form.success", dict.contact.form.success);
  push("careers.process.description", dict.careers.process.description);
  push("careers.labels.applyDescription", dict.careers.labels.applyDescription);
  return out;
}

describe("2. olgu sıfattan önce gelir", () => {
  // Yeni bir firmanın gösterebileceği müşteri sayısı yok; bunun yerine
  // doğrulanabilir yapısal olgular gösterilir.
  it("hero kanıt bloğu sayı taşır", () => {
    for (const [locale, dict] of dicts) {
      expect(dict.home.hero.facts.length, locale).toBeGreaterThanOrEqual(3);
      for (const fact of dict.home.hero.facts) {
        expect(fact.value, `${locale}: ${fact.label}`).toMatch(/\d/);
        expect(fact.label.length, locale).toBeGreaterThan(3);
      }
    }
  });

  it("ölçülemeyen üstünlük iddiası yok", () => {
    const banned = /\b(en iyi|lider(?!lik)|öncü|benzersiz|eşsiz|kusursuz|mükemmel|world[- ]class|best[- ]in[- ]class|leading|unrivalled)\b/i;
    for (const [locale, dict] of dicts) {
      for (const [path, text] of claimSurfaces(dict)) {
        expect(banned.test(text), `${locale}/${path}: "${text}"`).toBe(false);
      }
    }
  });
});

describe("3. mümkün olan en kısa hâl", () => {
  // Her paragraf en fazla iki cümle. Okuyucunun kararını değiştirmeyen
  // ayrıntı metinden çıkarılır.
  it("iddia metinleri iki cümleyi geçmez", () => {
    for (const [locale, dict] of dicts) {
      for (const [path, text] of claimSurfaces(dict)) {
        const sentences = text.split(/[.!?](?:\s|$)/).filter((s) => s.trim().length > 0);
        expect(sentences.length, `${locale}/${path}: "${text}"`).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe("4. gelecek hakkında garanti verilmez", () => {
  // "İki iş günü içinde döneceğiz" tutulamayınca yalan olur.
  // "Genellikle" ile aynı bilgi verilir, taahhüt verilmez.
  // Yapısı gereği koşulsuz olan kalıplar. Süre bildiren cümlelerin
  // yumuşatıcı taşıması ayrı testte kontrol edilir; burada yalnızca
  // hiçbir koşulla kurtarılamayacak ifadeler aranır.
  it("koşulsuz taahhüt ifadesi yok", () => {
    const unconditional = [
      /\bgaranti (ederiz|ediyoruz|edilir)\b/i,
      /\bkesinlikle\b/i,
      /\bher koşulda\b/i,
      /\bguarantee[ds]?\b/i,
      /\bwill (be in touch|come back to you|respond|reply) within\b/i,
      /\bwithout fail\b/i,
    ];
    for (const [locale, dict] of dicts) {
      for (const [path, text] of claimSurfaces(dict)) {
        for (const pattern of unconditional) {
          expect(pattern.test(text), `${locale}/${path}: "${text}"`).toBe(false);
        }
      }
    }
  });

  it("süre bildiren yerlerde koşul belirteci var", () => {
    const hedges = /(genellikle|ortalama|yaklaşık|usually|typically|about|aim to)/i;
    for (const [locale, dict] of dicts) {
      for (const [path, text] of claimSurfaces(dict)) {
        // Somut bir gün/hafta sayısı geçiyorsa yumuşatıcı da geçmeli
        if (/\b(iş günü|business day)\b/i.test(text)) {
          expect(hedges.test(text), `${locale}/${path}: "${text}"`).toBe(true);
        }
      }
    }
  });
});

describe("değer önerisi ilk ekranda okunur", () => {
  it("hero ne yaptığımızı söyler, nezaket cümlesi değildir", () => {
    for (const [locale, dict] of dicts) {
      const { title, highlight, description } = dict.home.hero;
      expect(`${title} ${highlight}`.length, locale).toBeGreaterThan(20);
      // Açıklama somut bir yapı/eylem adı taşımalı
      const concrete = /(süreç|sistem|karar|yapı|process|system|decision|structure)/i;
      expect(concrete.test(description), `${locale}: "${description}"`).toBe(true);
    }
  });

  it("ücretsiz ilk görüşme vaadi hero'da geçer", () => {
    for (const [locale, dict] of dicts) {
      expect(dict.home.hero.promise, locale).toMatch(/(ücretsiz|free)/i);
    }
  });
});
