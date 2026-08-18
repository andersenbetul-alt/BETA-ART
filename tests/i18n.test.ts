import { describe, expect, it } from "vitest";
import {
  alternatePath,
  isLocale,
  locales,
  navKeys,
  path,
  routeKeys,
  routes,
  routeKeyFromPathname,
} from "@/lib/i18n";

describe("dil tespiti", () => {
  it("desteklenen dilleri tanır", () => {
    expect(isLocale("tr")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it("desteklenmeyen dili reddeder", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("TR")).toBe(false);
  });
});

describe("adres üretimi", () => {
  it("ana sayfa için yalnızca dil öneki döner", () => {
    expect(path("home", "tr")).toBe("/tr");
    expect(path("home", "en")).toBe("/en");
  });

  it("her sayfayı kendi dilindeki slug ile üretir", () => {
    expect(path("services", "tr")).toBe("/tr/hizmetler");
    expect(path("services", "en")).toBe("/en/services");
    expect(path("careers", "tr")).toBe("/tr/kariyer");
    expect(path("privacy", "en")).toBe("/en/privacy");
  });

  it("iki dilde de her rota için slug tanımlıdır", () => {
    for (const key of routeKeys) {
      for (const locale of locales) {
        expect(routes[key][locale]).toBeTypeOf("string");
      }
    }
  });

  it("aynı dil içinde slug'lar benzersizdir", () => {
    for (const locale of locales) {
      const slugs = routeKeys.map((key) => routes[key][locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("adresten sayfa çözümleme", () => {
  it("dile özel slug'ı doğru sayfaya eşler", () => {
    expect(routeKeyFromPathname("/tr/hizmetler")).toBe("services");
    expect(routeKeyFromPathname("/en/services")).toBe("services");
    expect(routeKeyFromPathname("/tr/gizlilik")).toBe("privacy");
  });

  it("ana sayfayı tanır", () => {
    expect(routeKeyFromPathname("/tr")).toBe("home");
    expect(routeKeyFromPathname("/en")).toBe("home");
  });

  it("tanınmayan adres için ana sayfaya düşer", () => {
    expect(routeKeyFromPathname("/tr/olmayan")).toBe("home");
    expect(routeKeyFromPathname("/fr/hizmetler")).toBe("home");
  });

  it("alt segmentli adreste bölümü çözer", () => {
    expect(routeKeyFromPathname("/tr/kariyer/danismanlik-stajyeri")).toBe(
      "careers",
    );
  });
});

describe("dil değiştirici", () => {
  it("aynı sayfanın diğer dildeki karşılığına gider", () => {
    expect(alternatePath("/tr/hizmetler", "en")).toBe("/en/services");
    expect(alternatePath("/en/about", "tr")).toBe("/tr/hakkimizda");
    expect(alternatePath("/tr", "en")).toBe("/en");
  });

  // İlan detayında listeye düşmemeli — bölüm çevrilir, ilan slug'ı korunur.
  it("ilan detayında aynı ilanda kalır", () => {
    expect(alternatePath("/tr/kariyer/insan-kaynaklari-danismani", "en")).toBe(
      "/en/careers/insan-kaynaklari-danismani",
    );
    expect(alternatePath("/en/careers/danismanlik-stajyeri", "tr")).toBe(
      "/tr/kariyer/danismanlik-stajyeri",
    );
  });

  it("gidiş dönüş başlangıç adresine döner", () => {
    for (const key of routeKeys) {
      const trPath = path(key, "tr");
      expect(alternatePath(alternatePath(trPath, "en"), "tr")).toBe(trPath);
    }
  });
});

describe("menü", () => {
  it("ana sayfayı ve gizlilik sayfasını içermez", () => {
    expect(navKeys).not.toContain("home");
    expect(navKeys).not.toContain("privacy");
  });

  it("her menü girdisi geçerli bir rotadır", () => {
    for (const key of navKeys) {
      expect(routeKeys).toContain(key);
    }
  });
});
