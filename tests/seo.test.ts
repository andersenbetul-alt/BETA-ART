import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { pageMetadata } from "@/lib/metadata";
import { articleIds } from "@/content/articles";
import { jobIds } from "@/content/jobs";
import { locales, path, routeKeys, siteUrl } from "@/lib/i18n";

const entries = sitemap();

describe("sitemap", () => {
  it("her sayfayı her dilde içerir", () => {
    for (const locale of locales) {
      for (const key of routeKeys) {
        const url = `${siteUrl}${path(key, locale)}`;
        expect(entries.some((e) => e.url === url), url).toBe(true);
      }
    }
  });

  it("her ilanı her dilde içerir", () => {
    for (const locale of locales) {
      for (const id of jobIds) {
        const url = `${siteUrl}${path("careers", locale)}/${id}`;
        expect(entries.some((e) => e.url === url), url).toBe(true);
      }
    }
  });

  it("her yazıyı her dilde içerir", () => {
    for (const locale of locales) {
      for (const id of articleIds) {
        const url = `${siteUrl}${path("insights", locale)}/${id}`;
        expect(entries.some((e) => e.url === url), url).toBe(true);
      }
    }
  });

  it("tekrarlanan adres yoktur", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("her girdi mutlak adrestir", () => {
    for (const entry of entries) {
      expect(entry.url.startsWith("https://"), entry.url).toBe(true);
    }
  });

  it("her girdi iki dilin alternatifini taşır", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).sort(), entry.url).toEqual([...locales].sort());
    }
  });

  it("yalnızca ana sayfalar en yüksek önceliktedir", () => {
    const top = entries.filter((e) => e.priority === 1).map((e) => e.url);
    expect(top.sort()).toEqual(
      locales.map((l) => `${siteUrl}${path("home", l)}`).sort(),
    );
  });
});

describe("robots", () => {
  it("taramaya izin verir ve sitemap'i bildirir", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(result.rules).toMatchObject({ userAgent: "*", allow: "/" });
  });
});

describe("sayfa metadatası", () => {
  it("canonical sayfanın kendi dilindeki adresidir", () => {
    const meta = pageMetadata({
      key: "services",
      locale: "tr",
      title: "Başlık",
      description: "Açıklama",
    });
    expect(meta.alternates?.canonical).toBe("/tr/hizmetler");
  });

  it("hreflang'ler diller arası doğru slug'ları eşler", () => {
    const meta = pageMetadata({
      key: "careers",
      locale: "en",
      title: "Title",
      description: "Description",
    });
    expect(meta.alternates?.languages).toEqual({
      tr: "/tr/kariyer",
      en: "/en/careers",
      "x-default": "/tr/kariyer",
    });
  });

  it("x-default her zaman Türkçe sürümü gösterir", () => {
    for (const key of routeKeys) {
      for (const locale of locales) {
        const meta = pageMetadata({ key, locale, title: "t", description: "d" });
        expect(meta.alternates?.languages?.["x-default"]).toBe(path(key, "tr"));
      }
    }
  });

  it("Open Graph görseli dile göre değişir", () => {
    const tr = pageMetadata({ key: "home", locale: "tr", title: "t", description: "d" });
    const en = pageMetadata({ key: "home", locale: "en", title: "t", description: "d" });
    expect(tr.openGraph?.images).toEqual([
      { url: "/og-tr.png", width: 1200, height: 630, alt: "NAVIAR" },
    ]);
    expect(en.openGraph?.images).toEqual([
      { url: "/og-en.png", width: 1200, height: 630, alt: "NAVIAR" },
    ]);
  });
});

describe("RSS beslemesi", () => {
  it("her dil için ayrı besleme adresi vardır", () => {
    // Route handler adresleri sitemap'e girmez; head bağlantısı üzerinden bulunur.
    for (const locale of locales) {
      expect(`/${locale}/rss.xml`).toMatch(/^\/(tr|en)\/rss\.xml$/);
    }
  });
});
