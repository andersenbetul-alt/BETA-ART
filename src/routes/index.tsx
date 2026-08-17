import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import makerImage from "@/assets/maker.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustStrip } from "@/components/TrustStrip";
import { LicenseRequestForm } from "@/components/LicenseRequestForm";
import { canonicalUrl, PRICE_STATUS_NOTE, robotsContent, siteConfig } from "@/config/site";
import { plates, licenses, faqs, orderingSteps } from "@/data/collection";

const TITLE = "Beta Art — Human Photography Archive & Licensing";
const DESCRIPTION = siteConfig.description;
/**
 * No canonical URL is emitted while the production domain is unconfirmed.
 * Flip siteConfig.productionUrlConfirmed to restore it from config.
 */
const CANONICAL = canonicalUrl;
/* REPLACEMENT POINT: real 1200×630 social card — see src/config/site.ts */
const OG_IMAGE = CANONICAL ? siteConfig.ogImage : null;

/**
 * Structured data intentionally omits creator name, capture date, location and
 * any site URL while the production domain is unconfirmed: those values are not
 * known yet and must never be invented.
 */
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
      "@type": "FAQPage",
      ...(CANONICAL ? { "@id": `${CANONICAL}#faq` } : {}),
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
      { property: "og:site_name", content: siteConfig.name },
      ...(OG_IMAGE
        ? [
            { property: "og:image", content: OG_IMAGE },
            {
              property: "og:image:alt",
              content: "Beta Art — human photography archive (placeholder card)",
            },
            { name: "twitter:image", content: OG_IMAGE },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    ...(CANONICAL ? { links: [{ rel: "canonical", href: CANONICAL }] } : {}),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
});


const methods = [
  {
    index: "01",
    title: "RAW original archived",
    body: "For a verified plate the unedited RAW file is kept on file, so any licensed copy can be matched back to it by checksum.",
  },
  {
    index: "02",
    title: "Capture record travels with the image",
    body: "Camera body, lens, exposure, date and place stay attached to the plate and are delivered with the licence. Where a field is unknown, the page says so.",
  },
  {
    index: "03",
    title: "Licence signed by the maker",
    body: "No reseller sits between you and the photographer. Terms are drafted, signed and honoured by the person who took the picture.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-[92rem] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:pt-32">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div className="min-w-0">
                <p className="label">Photography licensing</p>
                <h1 className="display mt-6 text-[clamp(2.75rem,8vw,6.5rem)]">
                  Human
                  <br />
                  Photography
                </h1>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Beta Art licenses original human-made photography. Every verified plate is captured
                  by a person with a physical camera, kept with its RAW original and capture record,
                  and licensed directly by the photographer — no intermediaries, no synthetic imagery.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  The images shown on this preview are placeholders and are not part of the archive.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#collection" className="btn-ink focus-ring">
                    View the collection
                  </a>
                  <a href="#verification" className="btn-outline-ink focus-ring">
                    How verification works
                  </a>
                </div>
              </div>

              <figure className="min-w-0">
                {/* REPLACEMENT POINT: hero photograph */}
                <div className="plate-frame">
                  <img
                    src={heroImage}
                    alt="Placeholder image standing in for the Beta Art hero photograph"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="label mt-3">Placeholder imagery — awaiting verified original</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section id="verification" className="border-b border-border" aria-labelledby="verification-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="label">Verification</p>
                <h2 id="verification-title" className="display mt-4 text-3xl sm:text-4xl">
                  Three records behind every verified plate
                </h2>
              </div>
              <ul className="grid gap-px bg-border sm:grid-cols-3">
                {methods.map((m) => (
                  <li key={m.index} className="bg-background p-6 sm:p-8">
                    <p className="label">{m.index}</p>
                    <h3 className="display mt-4 text-xl sm:text-2xl">{m.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Collection */}
        <section id="collection" className="border-b border-border" aria-labelledby="collection-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <p className="label">Collection</p>
              <h2 id="collection-title" className="display mt-4 text-3xl sm:text-4xl">
                Twelve plates from the archive
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Each record below is a placeholder awaiting its verified original. Open a plate to see
                its provenance panel, capture metadata and licensing options.
              </p>
            </div>

            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {plates.map((plate) => (
                <li key={plate.catalogue}>
                  <article>
                    <Link
                      to="/plates/$slug"
                      params={{ slug: plate.slug }}
                      className="focus-ring block rounded-sm"
                    >
                      {/* REPLACEMENT POINT: plate photograph — see src/data/collection.ts */}
                      <div className="plate-frame aspect-4/5">
                        <img
                          src={plate.src}
                          alt={plate.alt}
                          width={1280}
                          height={1600}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="rule-top mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 pt-3">
                        <h3 className="display min-w-0 truncate text-lg">{plate.title}</h3>
                        <span className="label shrink-0">{plate.catalogue}</span>
                      </div>
                      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                        <p className="min-w-0 truncate text-sm text-muted-foreground">
                          {plate.verification.status}
                        </p>
                        <p className="label shrink-0 text-foreground">
                          from kr {plate.price} (draft)
                        </p>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ordering */}
        <section id="ordering" className="border-b border-border" aria-labelledby="ordering-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <p className="label">How ordering works</p>
              <h2 id="ordering-title" className="display mt-4 text-3xl sm:text-4xl">
                Three steps from plate to licence
              </h2>
            </div>
            <ol className="mt-12 grid gap-px bg-border sm:grid-cols-3">
              {orderingSteps.map((step) => (
                <li key={step.index} className="bg-background p-6 sm:p-8">
                  <p className="label">{step.index}</p>
                  <h3 className="display mt-4 text-xl sm:text-2xl">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-muted-foreground">
              Delivery timing and payment handling are confirmed per request; no fixed turnaround is
              promised until it can be met.
            </p>
          </div>
        </section>

        {/* Photographer */}
        <section id="photographer" className="border-b border-border" aria-labelledby="photographer-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
            <figure className="min-w-0">
              {/* REPLACEMENT POINT: photographer portrait */}
              <div className="plate-frame aspect-4/5">
                <img
                  src={makerImage}
                  alt="Placeholder portrait standing in for the photographer's portrait"
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="label mt-3">Placeholder portrait — awaiting real image</figcaption>
            </figure>
            <div className="min-w-0 lg:pt-6">
              <p className="label">Photographer</p>
              {/* LAUNCH CHECKLIST: set photographerName and bio in src/config/site.ts */}
              <h2 id="photographer-title" className="display mt-4 text-3xl sm:text-4xl">
                {siteConfig.photographerName}
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Biography to be supplied. This paragraph will describe the photographer behind the
                  archive — the kind of work made, the equipment used and the approach taken to each
                  plate. No biographical detail has been confirmed yet.
                </p>
                <p>
                  Beta Art exists because provenance stopped being obvious. Rather than argue about
                  what an image is, the evidence is kept: the RAW original, the capture record and a
                  licence signed by the maker.
                </p>
              </div>
              <dl className="rule-top mt-10 grid gap-6 pt-8 sm:grid-cols-3">
                <div>
                  <dt className="label">Working since</dt>
                  <dd className="mt-2 text-sm text-foreground">{siteConfig.workingSince}</dd>
                </div>
                <div>
                  <dt className="label">Plates catalogued</dt>
                  <dd className="mt-2 text-sm text-foreground">{siteConfig.catalogueCount}</dd>
                </div>
                <div>
                  <dt className="label">Studio</dt>
                  <dd className="mt-2 text-sm text-foreground">{siteConfig.studioLocation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Licensing */}
        <section id="licensing" className="border-b border-border" aria-labelledby="licensing-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-2xl">
              <p className="label">Licensing</p>
              <h2 id="licensing-title" className="display mt-4 text-3xl sm:text-4xl">
                Four ways to license a plate
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Every agreement is issued directly by the photographer and names the catalogue
                number, the licensed scope and the checksum of the delivered file.
              </p>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {PRICE_STATUS_NOTE} Personal is for private, non-commercial use only; Commercial and
              Extended cover business use.
            </p>

            <div className="mt-10">
              <TrustStrip />
            </div>

            <ul className="mt-10 grid gap-px bg-border lg:grid-cols-4">
              {licenses.map((l) => (
                <li key={l.id} className="flex flex-col bg-background p-6 sm:p-8">
                  <h3 className="display text-2xl">{l.name}</h3>
                  <p className="label mt-2">{l.audience}</p>
                  <p className="label mt-3 text-foreground">{l.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Draft price — indicative only</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{l.summary}</p>
                  <p className="label rule-top mt-6 pt-6">Permitted</p>
                  <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                    {l.permitted.map((p) => (
                      <li key={p} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                        <span aria-hidden="true" className="text-accent">
                          +
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="label mt-6">Not permitted</p>
                  <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                    {l.notPermitted.map((p) => (
                      <li key={p} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                        <span aria-hidden="true">—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#request" className="link-underline focus-ring mt-8 self-start rounded-sm text-sm">
                    Request {l.name.toLowerCase()} terms
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 max-w-3xl">
              <LicenseRequestForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-border" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="label">FAQ</p>
              <h2 id="faq-title" className="display mt-4 text-3xl sm:text-4xl">
                Questions about the archive
              </h2>
            </div>
            <dl className="grid gap-px bg-border">
              {faqs.map((f) => (
                <div key={f.q} className="bg-background py-6 sm:py-8">
                  <dt className="display text-xl sm:text-2xl">{f.q}</dt>
                  <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Contact teaser */}
        <section aria-labelledby="contact-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="label">Contact</p>
                <h2 id="contact-title" className="display mt-4 text-[clamp(2rem,5vw,3.5rem)]">
                  Tell us which plate you need
                </h2>
              </div>
              <div className="text-base leading-relaxed text-muted-foreground">
                <p>
                  Send the catalogue number, where the image will appear and for how long. Contact
                  details and response times are still to be supplied.
                </p>
                <Link to="/contact" className="btn-outline-ink focus-ring mt-8">
                  Go to contact page
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
