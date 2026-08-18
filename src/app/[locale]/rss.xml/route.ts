import { getDictionary } from "@/content";
import { articleIds, articleMeta } from "@/content/articles";
import { absoluteUrl, isLocale, locales, path } from "@/lib/i18n";

/** Her dil için ayrı besleme: /tr/rss.xml ve /en/rss.xml */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });

  const dict = getDictionary(locale);
  const feedUrl = absoluteUrl(`/${locale}/rss.xml`);
  const listUrl = absoluteUrl(path("insights", locale));

  const items = articleIds
    .map((id) => {
      const article = dict.insights.articles[id];
      const url = absoluteUrl(`${path("insights", locale)}/${id}`);
      // RSS tarihleri RFC 822 biçiminde olmalı
      const pubDate = new Date(
        `${articleMeta[id].publishedAt}T09:00:00Z`,
      ).toUTCString();

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${dict.meta.siteName} — ${dict.insights.hero.title}`)}</title>
    <link>${listUrl}</link>
    <description>${escapeXml(dict.insights.hero.description)}</description>
    <language>${locale}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
