import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { locales } from "@/lib/i18n";

/**
 * YAYIN KAPISI
 *
 * Bu dosyadaki testler, site canlıya çıkmadan önce düzeltilmesi ZORUNLU olan
 * yer tutucuları yakalar. Kırmızı olmaları beklenen davranıştır: gerçek bir
 * müşteri yer tutucu bir numarayı arar, gerçek bir aday yer tutucu bir adrese
 * başvurusunu gönderir ve cevap gelmez.
 *
 * Hatırlatma yerine test olmasının sebebi: bu oturumda aynı sorun iki kez
 * işaretlendi ve iki kez unutuldu. Hatırlatma unutulur, kırmızı test unutulmaz.
 *
 * Bunları düzeltince testler kendiliğinden yeşile döner — dosyayı silmeyin,
 * bir sonraki yer tutucu için burada kalsın.
 */

/** Gerçek olamayacak değerler. Yeni yer tutucu eklenirse buraya da eklenmeli. */
const PLACEHOLDER_PATTERNS = [
  /0{3}\s*0{2}\s*0{2}/,          // "000 00 00" — dolgu telefon
  /\bexample\.(com|org|net)\b/i, // örnek alan adları
  /\bTODO\b|\bTBD\b|\bXXX\b/,
  /\[\[.*?\]\]/,                 // doldurulmamış şablon alanı
];

function findPlaceholders(value: string): string[] {
  return PLACEHOLDER_PATTERNS.filter((p) => p.test(value)).map((p) => p.source);
}

describe("yayın kapısı — iletişim bilgileri", () => {
  for (const locale of locales) {
    const { contact } = getDictionary(locale);

    it(`${locale}: telefon numarası gerçek olmalı`, () => {
      const phone = contact.details.phone.value;
      expect(
        findPlaceholders(phone),
        `Yer tutucu telefon yayına çıkamaz: "${phone}". ` +
          `src/content/${locale}.ts içinde contact.details.phone.value alanını düzeltin.`,
      ).toEqual([]);
    });

    it(`${locale}: e-posta adresi gerçek olmalı`, () => {
      const email = contact.details.email.value;
      expect(
        findPlaceholders(email),
        `Yer tutucu e-posta yayına çıkamaz: "${email}".`,
      ).toEqual([]);
      expect(email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
    });

    it(`${locale}: adres yalnızca şehir adından ibaret olmamalı`, () => {
      const address = contact.details.address.value;
      // "İstanbul, Türkiye" bir adres değil; ziyaretçi kapıya gelemez ve
      // schema.org PostalAddress'e de yetmez.
      expect(
        address.split(",").length,
        `Adres fazla genel: "${address}". Sokak ve semt gerekiyor.`,
      ).toBeGreaterThan(2);
    });
  }
});

describe("yayın kapısı — iş ilanları", () => {
  for (const locale of locales) {
    const { careers } = getDictionary(locale);

    it(`${locale}: başvuru adresi gerçek olmalı`, () => {
      const applyEmail = careers.labels.applyEmail;
      expect(
        findPlaceholders(applyEmail),
        `Yer tutucu başvuru adresi yayına çıkamaz: "${applyEmail}". ` +
          `Gerçek bir aday başvurusunu buraya gönderecek.`,
      ).toEqual([]);
    });
  }
});
