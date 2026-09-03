import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LicenseRequestForm } from "@/components/LicenseRequestForm";
import { CaptureTable, ProvenancePanel } from "@/components/ProvenancePanel";
import { ForYou } from "@/components/ForYou";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrustStrip } from "@/components/TrustStrip";
import { canonicalUrl, robotsContent, siteConfig } from "@/config/site";
import { deliveryInfo, getPlate, licenses, orderingSteps } from "@/data/collection";
import { recordView } from "@/lib/affinity";
import { useT } from "@/i18n";
import { AUD_KEY, VER_KEY } from "@/i18n/cat";

export const Route = createFileRoute("/plates/$slug")({
  loader: ({ params }) => {
    const plate = getPlate(params.slug);
    if (!plate) throw notFound();
    return { plate };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Plate not found — Beta Art" }, { name: "robots", content: "noindex" }],
      };
    }
    const { plate } = loaderData;
    const title = `${plate.title} (${plate.catalogue}) — Beta Art`;
    const description = `License ${plate.title}, catalogue ${plate.catalogue}, from the Beta Art human photography archive. Provenance panel, capture record and licence options.`;
    /* No URL is claimed while the production domain is unconfirmed. */
    const url = canonicalUrl ? `${canonicalUrl}plates/${params.slug}` : null;

    /* Structured data lists only known values: title, catalogue number and price. */
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: plate.title,
      sku: plate.catalogue,
      category: "Photography licence",
      ...(url ? { url } : {}),
      offers: {
        "@type": "Offer",
        price: plate.price,
        priceCurrency: plate.currency,
        ...(url ? { url } : {}),
      },
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(url
          ? [
              { property: "og:url", content: url },
              { property: "og:image", content: siteConfig.ogImage },
              { name: "twitter:image", content: siteConfig.ogImage },
            ]
          : []),
        { name: "robots", content: robotsContent },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      ...(url ? { links: [{ rel: "canonical", href: url }] } : {}),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  notFoundComponent: PlateNotFound,
  component: PlateDetail,
});

function PlateNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <h1 className="display text-4xl">Plate not found</h1>
        <p className="mt-4 text-muted-foreground">That catalogue entry does not exist.</p>
        <Link to="/" className="btn-outline-ink focus-ring mt-8">
          Back to the archive
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlateDetail() {
  const { plate } = Route.useLoaderData();
  const t = useT();
  const [selected, setSelected] = useState(licenses[0]!.id);
  const active = licenses.find((l) => l.id === selected)!;

  // USER-side behavior: record this plate view on the visitor's device only.
  useEffect(() => {
    recordView(plate.slug);
  }, [plate.slug]);

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
        <div className="mx-auto max-w-[92rem] px-5 py-10 sm:px-8 sm:py-14">
          <Breadcrumbs items={[{ label: t("ui.crumb.collection"), to: "/" }, { label: plate.title }]} />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <figure className="min-w-0">
              {/* REPLACEMENT POINT: plate photograph — see src/data/collection.ts */}
              <div className="plate-frame aspect-4/5">
                <img
                  src={plate.src}
                  alt={plate.alt}
                  width={1280}
                  height={1600}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="label mt-3">
                {t("ui.cap.placeholder")} — {t(VER_KEY[plate.verification.status] ?? plate.verification.status).toLowerCase()}
              </figcaption>
            </figure>

            <div className="min-w-0">
              <p className="label">{plate.catalogue}</p>
              <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4rem)]">{plate.title}</h1>
              <p className="label mt-4 text-foreground">
                {t("home.col.from")} kr {plate.price} · {plate.currency}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t("ui.detail.priceNote")}</p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {t("cat.plate.desc")}
              </p>

              <div className="mt-10">
                <ProvenancePanel plate={plate} />
              </div>

              <div className="mt-12">
                <CaptureTable plate={plate} />
              </div>
            </div>
          </div>
        </div>

        {/* Licence selector */}
        <section className="border-t border-border" aria-labelledby="licence-options">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-20">
            <h2 id="licence-options" className="display text-3xl sm:text-4xl">
              {t("ui.detail.licHeading")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("ui.detail.licIntro")}
            </p>

            <fieldset className="mt-10">
              <legend className="label">{t("ui.detail.selectLic")}</legend>
              <div className="mt-4 grid gap-px bg-border lg:grid-cols-4">
                {licenses.map((l) => (
                  <label
                    key={l.id}
                    className={`focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring cursor-pointer bg-background p-6 ${
                      selected === l.id ? "ring-1 ring-inset ring-accent" : ""
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <input
                        type="radio"
                        name="licence"
                        value={l.id}
                        checked={selected === l.id}
                        onChange={() => setSelected(l.id)}
                        className="accent-accent"
                      />
                      <span className="display text-xl">{t(`cat.lic.${l.id}.name`)}</span>
                    </span>
                    <span className="label mt-2 block">{t(AUD_KEY[l.audience] ?? l.audience)}</span>
                    <span className="label mt-3 block text-foreground">{t(`cat.lic.${l.id}.price`)}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t("ui.detail.draftPrice")}
                    </span>
                    <span className="mt-4 block text-sm leading-relaxed text-muted-foreground">
                      {t(`cat.lic.${l.id}.summary`)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="display text-2xl">{t(`cat.lic.${active.id}.name`)} — {t("ui.detail.mayDo")}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {active.permitted.map((p, i) => (
                    <li key={p} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span aria-hidden="true" className="text-accent">
                        +
                      </span>
                      <span>{t(`cat.lic.${active.id}.p${i + 1}`)}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="display mt-8 text-2xl">{t("ui.detail.notIncluded")}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {active.notPermitted.map((p, i) => (
                    <li key={p} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span aria-hidden="true">—</span>
                      <span>{t(`cat.lic.${active.id}.n${i + 1}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="display text-2xl">{t("ui.detail.delivery")}</h3>
                <dl className="rule-top mt-6 grid gap-4 pt-6">
                  {deliveryInfo.map((d, i) => (
                    <div
                      key={d.term}
                      className="grid gap-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-4"
                    >
                      <dt className="label">{t(`cat.del.${i + 1}.t`)}</dt>
                      <dd className="text-sm text-muted-foreground">{t(`cat.del.${i + 1}.d`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-12">
              <TrustStrip />
            </div>
          </div>
        </section>

        {/* Ordering + request */}
        <section className="border-t border-border" aria-labelledby="ordering-heading">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-20">
            <h2 id="ordering-heading" className="display text-3xl sm:text-4xl">
              {t("ui.detail.orderHeading")}
            </h2>
            <ol className="mt-8 grid gap-px bg-border sm:grid-cols-3">
              {orderingSteps.map((step, i) => (
                <li key={step.index} className="bg-background p-6">
                  <p className="label">{step.index}</p>
                  <h3 className="display mt-3 text-xl">{t(`cat.ord.${i + 1}.t`)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`cat.ord.${i + 1}.b`)}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 max-w-3xl">
              <LicenseRequestForm plate={plate} defaultLicense={selected} />
            </div>
          </div>
        </section>

        <ForYou exclude={plate.slug} heading={t("ui.foryou.next")} />
      </main>

      <SiteFooter />
    </div>
  );
}
