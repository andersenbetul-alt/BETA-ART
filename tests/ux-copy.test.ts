import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { locales } from "@/lib/i18n";

/**
 * UX yazımı ve dönüşüm kuralları.
 *
 * `copy-principles.test.ts` kurumun *iddialarını* sınırlar; bu dosya
 * kullanıcının *eylem anında* okuduğu metni sınırlar: düğmeler, hata
 * mesajları, form etiketleri. İkisi ayrı tutuldu çünkü ayrı sorulara
 * cevap veriyorlar — biri "doğru mu?", diğeri "ne yapacağını biliyor mu?".
 */

const dicts = locales.map((locale) => [locale, getDictionary(locale)] as const);

describe("bağlantı ve düğme etiketleri bağlamsız okunabilir", () => {
  // Ekran okuyucu kullanıcısı bağlantıları listeleyerek gezinir; o listede
  // "Detaylı bilgi" yan yana üç kez görünürse hiçbiri bilgi taşımaz.
  it("belirsiz etiket yok", () => {
    const vague =
      /^(detaylı bilgi|daha fazla|devamı|tıklayın|buraya tıklayın|learn more|read more|click here|more|submit|gönder)$/i;
    for (const [locale, dict] of dicts) {
      for (const [key, label] of Object.entries(dict.actions)) {
        expect(vague.test(label.trim()), `${locale}/actions.${key}: "${label}"`).toBe(
          false,
        );
      }
    }
  });

  it("iletişim düğmesi bedelsizliği söyler", () => {
    // Karar düğmenin üzerinde veriliyor; "ücretsiz" bilgisi kahramanda kalırsa
    // sayfanın altındaki düğmeye ulaşan kişi bunu bilmiyor.
    for (const [locale, dict] of dicts) {
      expect(dict.actions.contact, locale).toMatch(/(ücretsiz|free)/i);
    }
  });
});

describe("hata mesajları çıkmaz sokak bırakmaz", () => {
  it("sistem hataları alternatif yol verir", () => {
    // Alan hatasını kullanıcı düzeltebilir; gönderim hatasını düzeltemez.
    // O yüzden ikincisinde başka bir kanal adı geçmek zorunda.
    for (const [locale, dict] of dicts) {
      const { errors } = dict.contact.form;
      const email = dict.contact.details.email.value;
      for (const key of ["generic", "tooMany"] as const) {
        expect(errors[key], `${locale}/${key}`).toContain(email);
      }
    }
  });

  it("hata mesajı ne yapılacağını söyler", () => {
    // Yalnızca "geçersiz" diyen mesaj kullanıcıyı bıraktığı yerde bırakır.
    const deadEnd = /^(geçersiz|hatalı|invalid|error|required|zorunlu)[.!]?$/i;
    for (const [locale, dict] of dicts) {
      for (const [key, text] of Object.entries(dict.contact.form.errors)) {
        expect(deadEnd.test(text.trim()), `${locale}/${key}: "${text}"`).toBe(false);
        expect(text.trim().length, `${locale}/${key}`).toBeGreaterThan(20);
      }
    }
  });
});

describe("ilk görüşme itirazı formdan önce cevaplanır", () => {
  it("görüşmenin ne olmadığı yazılı", () => {
    for (const [locale, dict] of dicts) {
      const { boundary, steps, description } = dict.contact.firstCall;
      expect(steps.length, locale).toBe(3);
      // Süre belirsiz kalırsa taahhüt algısı büyür.
      expect(description, locale).toMatch(/(30|thirty|otuz)/i);
      // Sınır cümlesi olumsuz kurulmalı: ne yapmadığımızı söylüyor.
      // Türkçede olumsuzluk ayrı bir kelime değil, fiil eki (-mıyoruz).
      expect(boundary, locale).toMatch(/(değil|m[ıiuü]yoruz|do not|does not|don['’]t)/i);
    }
  });

  it("ücretlendirme modeli sessiz bırakılmaz", () => {
    // Fiyat listesi yok; ama sessizlik "gizli sayaç" olarak okunuyor.
    for (const [locale, dict] of dicts) {
      expect(dict.contact.firstCall.pricing.length, locale).toBeGreaterThan(60);
    }
  });

  it("gönder düğmesinin altında güven cümlesi var", () => {
    for (const [locale, dict] of dicts) {
      expect(dict.contact.form.reassurance, locale).toMatch(
        /(satış araması|sales call)/i,
      );
    }
  });
});

describe("form yazma eşiğini düşürür", () => {
  it("mesaj alanı soru biçiminde", () => {
    // "Mesajınız" boş bir kutudur; soru cevaplanacak bir şeydir.
    for (const [locale, dict] of dicts) {
      expect(dict.contact.form.message, locale).toMatch(/\?$/);
      expect(dict.contact.form.messageHint.length, locale).toBeGreaterThan(20);
    }
  });
});
