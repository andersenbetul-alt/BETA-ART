import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import makerImage from "@/assets/maker.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LicenseRequestForm } from "@/components/LicenseRequestForm";
import { ForYou } from "@/components/ForYou";
import { canonicalUrl, robotsContent, siteConfig } from "@/config/site";
import { plates, licenses, faqs } from "@/data/collection";
import { useT } from "@/i18n";
import { AUD_KEY, VER_KEY } from "@/i18n/cat";

const TITLE = "Beta Art — Photography with Proof";
const DESCRIPTION =
  "Verified human photography with preserved RAW originals, documented provenance, transparent editing and direct licensing.";
const CANONICAL = canonicalUrl;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      ...(CANONICAL ? { "@id": `${CANONICAL}#organization`, url: CANONICAL } : {}),
      name: siteConfig.name,
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      ...(CANONICAL ? { "@id": `${CANONICAL}#website`, url: CANONICAL } : {}),
      name: siteConfig.name,
      description: DESCRIPTION,
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: robotsContent },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      ...(CANONICAL ? [{ property: "og:url", content: CANONICAL }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    ...(CANONICAL ? { links: [{ rel: "canonical", href: CANONICAL }] } : {}),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
});

// Content arrays hold i18n KEYS; values live in src/i18n/home.*.ts.
const proofChain = [
  ["01", "home.proof.1.t", "home.proof.1.d"],
  ["02", "home.proof.2.t", "home.proof.2.d"],
  ["03", "home.proof.3.t", "home.proof.3.d"],
  ["04", "home.proof.4.t", "home.proof.4.d"],
  ["05", "home.proof.5.t", "home.proof.5.d"],
  ["06", "home.proof.6.t", "home.proof.6.d"],
] as const;

const passportRows = [
  ["home.pass.r1.t", "home.pass.r1.d"],
  ["home.pass.r2.t", "home.pass.r2.d"],
  ["home.pass.r3.t", "home.pass.r3.d"],
  ["home.pass.r4.t", "home.pass.r4.d"],
  ["home.pass.r5.t", "home.pass.r5.d"],
  ["home.pass.r6.t", "home.pass.r6.d"],
] as const;

const series = [
  { roman: "I", t: "home.series.1.t", n: "home.series.1.n", u: "home.series.1.u" },
  { roman: "II", t: "home.series.2.t", n: "home.series.2.n", u: "home.series.2.u" },
  { roman: "III", t: "home.series.3.t", n: "home.series.3.n", u: "home.series.3.u" },
  { roman: "IV", t: "home.series.4.t", n: "home.series.4.n", u: "home.series.4.u" },
  { roman: "V", t: "home.series.5.t", n: "home.series.5.n", u: "home.series.5.u" },
  { roman: "VI", t: "home.series.6.t", n: "home.series.6.n", u: "home.series.6.u" },
  { roman: "VII", t: "home.series.7.t", n: "home.series.7.n", u: "home.series.7.u" },
] as const;

// Brand-named layers keep their literal title; only "Commissioned work" is translated.
const archiveLayers = [
  { title: "Beta Archive", state: "home.plat.l1.s", body: "home.plat.l1.b" },
  { title: "Beta Passport", state: "home.plat.l2.s", body: "home.plat.l2.b" },
  { title: "Beta Vault", state: "home.plat.l3.s", body: "home.plat.l3.b" },
  { title: "Beta Verify", state: "home.plat.l4.s", body: "home.plat.l4.b" },
  { title: "Beta Rights", state: "home.plat.l5.s", body: "home.plat.l5.b" },
  { titleKey: "home.plat.l6.t", state: "home.plat.l6.s", body: "home.plat.l6.b" },
] as const;

const audiences = [
  { t: "home.aud.1.t", b: "home.aud.1.b", cta: "home.aud.1.cta", href: "#licensing" },
  { t: "home.aud.2.t", b: "home.aud.2.b", cta: "home.aud.2.cta", href: "#proof" },
  { t: "home.aud.3.t", b: "home.aud.3.b", cta: "home.aud.3.cta", href: "#collection" },
] as const;

function Home() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("ui.skip")}
      </a>
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border">
          <div className="mx-auto max-w-[92rem] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pt-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div>
                <p className="label">{t("home.hero.kicker")}</p>
                <h1 className="display mt-6 text-[clamp(3rem,8vw,7rem)] leading-[0.92]">
                  {t("home.hero.title")}
                </h1>
                <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t("home.hero.lead")}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="#collection" className="btn-ink focus-ring">{t("home.hero.cta1")}</a>
                  <a href="#proof" className="btn-outline-ink focus-ring">{t("home.hero.cta2")}</a>
                </div>
                <div className="rule-top mt-10 grid gap-5 pt-6 sm:grid-cols-3">
                  <div><p className="label">{t("home.hero.f1.t")}</p><p className="mt-2 text-sm text-muted-foreground">{t("home.hero.f1.d")}</p></div>
                  <div><p className="label">{t("home.hero.f2.t")}</p><p className="mt-2 text-sm text-muted-foreground">{t("home.hero.f2.d")}</p></div>
                  <div><p className="label">{t("home.hero.f3.t")}</p><p className="mt-2 text-sm text-muted-foreground">{t("home.hero.f3.d")}</p></div>
                </div>
              </div>

              <figure>
                <div className="plate-frame">
                  <img
                    src={heroImage}
                    alt="Beta Art development placeholder for a verified human photograph"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="label mt-3">{t("home.hero.caption")}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="border-b border-border" aria-labelledby="manifesto-title">
          <div className="mx-auto max-w-[72rem] px-5 py-20 text-center sm:px-8 sm:py-28">
            <p className="label">{t("home.man.kicker")}</p>
            <h2 id="manifesto-title" className="display mt-6 text-[clamp(2rem,5vw,4.25rem)] leading-[1.05]">
              {t("home.man.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("home.man.body")}
            </p>
          </div>
        </section>

        <section id="proof" className="border-b border-border" aria-labelledby="proof-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="label">{t("home.proof.kicker")}</p>
                <h2 id="proof-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.proof.title")}</h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {t("home.proof.body")}
                </p>
              </div>
              <ol className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {proofChain.map(([index, titleKey, bodyKey]) => (
                  <li key={index} className="bg-background p-6 sm:p-8">
                    <p className="label">{index}</p>
                    <h3 className="display mt-4 text-2xl">{t(titleKey)}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(bodyKey)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="passport" className="border-b border-border" aria-labelledby="passport-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="label">{t("home.pass.kicker")}</p>
                <h2 id="passport-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.pass.title")}</h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {t("home.pass.body")}
                </p>
              </div>
              <div className="border border-border p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                  <div><p className="label">{t("home.pass.example")}</p><p className="display mt-2 text-2xl">BA-001 · First Light</p></div>
                  <span className="label">{t("home.pass.proto")}</span>
                </div>
                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  {passportRows.map(([termKey, detailKey]) => (
                    <div key={termKey} className="rule-top pt-4"><dt className="label">{t(termKey)}</dt><dd className="mt-2 text-sm text-muted-foreground">{t(detailKey)}</dd></div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="series" className="border-b border-border" aria-labelledby="series-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="label">{t("home.series.kicker")}</p>
                <h2 id="series-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.series.title")}</h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {t("home.series.body")}
                </p>
              </div>
              <ol className="grid gap-px bg-border sm:grid-cols-2">
                {series.map((item) => (
                  <li key={item.roman} className="bg-background p-6 sm:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="label">{t("home.series.label")} {item.roman}</p>
                      <p className="label">{t("home.series.framework")}</p>
                    </div>
                    <h3 className="display mt-4 text-2xl sm:text-3xl">{t(item.t)}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(item.n)}</p>
                    <p className="label rule-top mt-6 pt-4">{t(item.u)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <ForYou heading={t("home.foryou")} />

        <section id="collection" className="border-b border-border" aria-labelledby="collection-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-3xl">
              <p className="label">{t("home.col.kicker")}</p>
              <h2 id="collection-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.col.title")}</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {t("home.col.body")}
              </p>
            </div>
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {plates.map((plate) => (
                <li key={plate.catalogue}>
                  <article>
                    <Link to="/plates/$slug" params={{ slug: plate.slug }} className="focus-ring block rounded-sm">
                      <div className="plate-frame aspect-4/5">
                        <img src={plate.src} alt={plate.alt} width={1280} height={1600} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      </div>
                      <div className="rule-top mt-4 grid grid-cols-[1fr_auto] gap-3 pt-3">
                        <h3 className="display text-lg">{plate.title}</h3><span className="label">{plate.catalogue}</span>
                      </div>
                      <div className="mt-2 flex items-start justify-between gap-4">
                        <p className="text-sm text-muted-foreground">{t(VER_KEY[plate.verification.status] ?? plate.verification.status)}</p>
                        <p className="label text-foreground">{t("home.col.from")} kr {plate.price}</p>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="platform" className="border-b border-border" aria-labelledby="platform-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <p className="label">{t("home.plat.kicker")}</p>
            <h2 id="platform-title" className="display mt-4 max-w-3xl text-3xl sm:text-5xl">{t("home.plat.title")}</h2>
            <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {archiveLayers.map((item) => {
                const title = "titleKey" in item ? t(item.titleKey) : item.title;
                return (
                  <article key={title} className="bg-background p-6 sm:p-8">
                    <p className="label">{t(item.state)}</p>
                    <h3 className="display mt-4 text-2xl">{title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(item.body)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="rights" className="border-b border-border" aria-labelledby="rights-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label">{t("home.rights.kicker")}</p>
              <h2 id="rights-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.rights.title")}</h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{t("home.rights.p1")}</p>
              <p>{t("home.rights.p2")}</p>
            </div>
          </div>
        </section>

        <section id="licensing" className="border-b border-border" aria-labelledby="licensing-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-3xl">
              <p className="label">{t("home.lic.kicker")}</p>
              <h2 id="licensing-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.lic.title")}</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {t("home.lic.body")}
              </p>
            </div>
            <ul className="mt-10 grid gap-px bg-border lg:grid-cols-4">
              {licenses.map((license) => (
                <li key={license.id} className="flex flex-col bg-background p-6 sm:p-8">
                  <p className="label">{t(AUD_KEY[license.audience] ?? license.audience)}</p>
                  <h3 className="display mt-3 text-2xl">{t(`cat.lic.${license.id}.name`)}</h3>
                  <p className="mt-3 font-medium">{t(`cat.lic.${license.id}.price`)}</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t(`cat.lic.${license.id}.summary`)}</p>
                  <a href="#request" className="link-underline focus-ring mt-8 self-start rounded-sm text-sm">{t("home.lic.request")}</a>
                </li>
              ))}
            </ul>
            <div id="request" className="mt-12 max-w-3xl"><LicenseRequestForm /></div>
          </div>
        </section>

        <section id="audiences" className="border-b border-border" aria-labelledby="audiences-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <p className="label">{t("home.aud.kicker")}</p>
            <h2 id="audiences-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.aud.title")}</h2>
            <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
              {audiences.map((item) => (
                <article key={item.t} className="bg-background p-6 sm:p-8">
                  <h3 className="display text-2xl">{t(item.t)}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(item.b)}</p>
                  <a href={item.href} className="link-underline focus-ring mt-8 inline-block rounded-sm text-sm">{t(item.cta)}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="commissions" className="border-b border-border" aria-labelledby="commissions-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label">{t("home.com.kicker")}</p>
              <h2 id="commissions-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.com.title")}</h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {t("home.com.body")}
              </p>
              <a href="#request" className="btn-outline-ink focus-ring mt-8">{t("home.com.cta")}</a>
            </div>
          </div>
        </section>

        <section id="photographer" className="border-b border-border" aria-labelledby="photographer-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <figure>
              <div className="plate-frame aspect-4/5">
                <img src={makerImage} alt="Development placeholder for the Beta Art photographer portrait" width={1200} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <figcaption className="label mt-3">{t("home.ph.caption")}</figcaption>
            </figure>
            <div className="lg:pt-6">
              <p className="label">{t("home.ph.kicker")}</p>
              <h2 id="photographer-title" className="display mt-4 text-3xl sm:text-5xl">{t("home.ph.title")}</h2>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                {t("home.ph.body")}
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="border-b border-border" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div><p className="label">{t("home.faq.kicker")}</p><h2 id="faq-title" className="display mt-4 text-3xl sm:text-4xl">{t("home.faq.title")}</h2></div>
            <dl className="grid gap-px bg-border">
              {faqs.map((f, i) => (
                <div key={f.q} className="bg-background py-6 sm:py-8">
                  <dt className="display text-xl sm:text-2xl">{t(`cat.faq.${i + 1}.q`)}</dt>
                  <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t(`cat.faq.${i + 1}.a`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="final-title">
          <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
            <p className="label">Beta Art</p>
            <h2 id="final-title" className="display mt-4 max-w-4xl text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]">{t("home.final.title")}</h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#collection" className="btn-ink focus-ring">{t("home.final.cta1")}</a>
              <Link to="/contact" className="btn-outline-ink focus-ring">{t("home.final.cta2")}</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
