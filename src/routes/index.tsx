import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import makerImage from "@/assets/maker.jpg";
import { plates, licenses, faqs } from "@/data/collection";

const TITLE = "Beta Art — Verified Human Photography & Licensing";
const DESCRIPTION =
  "Discover original human-made photography with archived RAW files, documented provenance and direct licensing from the photographer.";
const CANONICAL = "https://beta-art.com/";
/* REPLACEMENT POINT: point at the real 1200×630 social card once hosted. */
const OG_IMAGE = "https://beta-art.com/og-image.jpg";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${CANONICAL}#organization`,
      name: "Beta Art",
      url: CANONICAL,
      description: DESCRIPTION,
      founder: { "@id": `${CANONICAL}#photographer` },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "licensing",
        email: "studio@beta-art.com",
      },
    },
    {
      "@type": "Person",
      "@id": `${CANONICAL}#photographer`,
      name: "Mikkel Arnesen",
      jobTitle: "Photographer",
      url: `${CANONICAL}#photographer`,
      worksFor: { "@id": `${CANONICAL}#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${CANONICAL}#website`,
      url: CANONICAL,
      name: "Beta Art",
      description: DESCRIPTION,
      publisher: { "@id": `${CANONICAL}#organization` },
      inLanguage: "en",
    },
    ...plates.map((plate) => ({
      "@type": "Product",
      "@id": `${CANONICAL}#${plate.catalogue}`,
      name: plate.title,
      sku: plate.catalogue,
      category: "Photography licence",
      image: {
        "@type": "ImageObject",
        name: plate.title,
        caption: plate.alt,
        creator: { "@id": `${CANONICAL}#photographer` },
        contentLocation: plate.location,
        dateCreated: plate.date,
        creditText: "Beta Art",
        acquireLicensePage: `${CANONICAL}#licensing`,
      },
      offers: {
        "@type": "Offer",
        price: plate.price,
        priceCurrency: plate.currency,
        availability: "https://schema.org/InStock",
        url: `${CANONICAL}#collection`,
      },
    })),
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
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
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:site_name", content: "Beta Art" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Beta Art — verified human photography archive" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(structuredData) },
    ],
  }),
});

const nav = [
  { label: "Collection", href: "#collection" },
  { label: "Verification", href: "#verification" },
  { label: "Photographer", href: "#photographer" },
  { label: "Licensing", href: "#licensing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const methods = [
  {
    index: "01",
    title: "RAW original archived",
    body: "The unedited RAW file is stored on write-once media the moment the frame is made. Any licensed file can be matched back to it by checksum.",
  },
  {
    index: "02",
    title: "Capture record travels with the image",
    body: "Camera body, lens, exposure, date and place stay attached to the plate. The record is delivered with the licence, not stripped out of it.",
  },
  {
    index: "03",
    title: "License signed by the maker",
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

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[92rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
          <a href="#main" className="min-w-0">
            <span className="display block truncate text-xl tracking-tight sm:text-2xl">Beta Art</span>
            <span className="label hidden sm:block">Archive of verified human photography</span>
          </a>
          <nav aria-label="Primary" className="shrink-0">
            <ul className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="label hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex items-center gap-4 lg:hidden">
              <li>
                <a href="#collection" className="label hover:text-foreground">
                  Collection
                </a>
              </li>
              <li>
                <a href="#licensing" className="label hover:text-foreground">
                  Licensing
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-[92rem] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:pt-32">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div className="min-w-0">
                <p className="label">Est. 2019 — Oslo</p>
                <h1 className="display mt-6 text-[clamp(2.75rem,8vw,6.5rem)]">
                  Verified Human
                  <br />
                  Photography
                </h1>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Beta Art is an archive of original human-made photography. Every plate is
                  captured by a person with a physical camera, kept with its RAW original and
                  documented provenance, and licensed directly by the photographer — no
                  intermediaries, no synthetic imagery.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#collection" className="btn-ink">
                    View the collection
                  </a>
                  <a href="#verification" className="btn-outline-ink">
                    How verification works
                  </a>
                </div>
              </div>

              <figure className="min-w-0">
                {/* REPLACEMENT POINT: hero photograph */}
                <div className="plate-frame">
                  <img
                    src={heroImage}
                    alt="Placeholder photograph: an empty shoreline at low tide under a pale dawn sky"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="label mt-3 flex flex-wrap justify-between gap-2">
                  <span>Low Tide — BA-012</span>
                  <span>Sola, Norway · 2022</span>
                </figcaption>
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
                  Three records behind every plate
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
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <p className="label">Collection</p>
                <h2 id="collection-title" className="display mt-4 text-3xl sm:text-4xl">
                  Twelve plates from the archive
                </h2>
              </div>
              <p className="label shrink-0 hidden sm:block">12 / 340 catalogued</p>
            </div>

            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {plates.map((plate) => (
                <li key={plate.catalogue}>
                  <article>
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
                        {plate.location ? `${plate.location} · ${plate.date}` : "Location undisclosed"}
                      </p>
                      <p className="label shrink-0 text-foreground">from kr {plate.price}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
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
                  alt="Placeholder portrait: the photographer holding a medium format camera in the studio"
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="label mt-3">The maker — Oslo studio</figcaption>
            </figure>
            <div className="min-w-0 lg:pt-6">
              <p className="label">Photographer</p>
              <h2 id="photographer-title" className="display mt-4 text-3xl sm:text-4xl">
                Mikkel Arnesen
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  I have photographed coastlines, forests and quiet interiors for fifteen years,
                  mostly on medium format film and a single digital body. The work is slow: a plate
                  usually takes several returns to the same place before it is worth keeping.
                </p>
                <p>
                  Beta Art exists because provenance stopped being obvious. Rather than argue about
                  what an image is, I keep the evidence: the RAW original, the capture record and a
                  licence signed in my own name.
                </p>
                <p>
                  Commissions are accepted for landscape, architecture and portrait work, with the
                  same archival standard applied to every frame delivered.
                </p>
              </div>
              <dl className="rule-top mt-10 grid gap-6 pt-8 sm:grid-cols-3">
                <div>
                  <dt className="label">Working since</dt>
                  <dd className="display mt-2 text-2xl">2011</dd>
                </div>
                <div>
                  <dt className="label">Plates catalogued</dt>
                  <dd className="display mt-2 text-2xl">340</dd>
                </div>
                <div>
                  <dt className="label">RAW originals kept</dt>
                  <dd className="display mt-2 text-2xl">100%</dd>
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

            <ul className="mt-12 grid gap-px bg-border lg:grid-cols-4">
              {licenses.map((l) => (
                <li key={l.name} className="flex flex-col bg-background p-6 sm:p-8">
                  <h3 className="display text-2xl">{l.name}</h3>
                  <p className="label mt-3 text-foreground">{l.price}</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{l.summary}</p>
                  <ul className="rule-top mt-6 space-y-3 pt-6 text-sm text-muted-foreground">
                    {l.points.map((p) => (
                      <li key={p} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                        <span aria-hidden="true" className="text-accent">
                          —
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="link-underline mt-8 self-start text-sm">
                    Request {l.name.toLowerCase()} terms
                  </a>
                </li>
              ))}
            </ul>
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

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="label">Contact</p>
                <h2 id="contact-title" className="display mt-4 text-[clamp(2rem,5vw,3.5rem)]">
                  Tell me which plate you need
                </h2>
              </div>
              <div className="text-base leading-relaxed text-muted-foreground">
                <p>
                  Send the catalogue number, where the image will appear and for how long. You
                  receive a quote, the provenance sheet and a draft licence, usually within one
                  working day.
                </p>
                <ul className="rule-top mt-8 space-y-4 pt-8">
                  <li className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4">
                    <span className="label">Email</span>
                    <a href="mailto:studio@beta-art.com" className="link-underline text-foreground">
                      studio@beta-art.com
                    </a>
                  </li>
                  <li className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4">
                    <span className="label">Studio</span>
                    <span className="text-foreground">Grünerløkka, Oslo, Norway</span>
                  </li>
                  <li className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4">
                    <span className="label">Response</span>
                    <span className="text-foreground">Within one working day</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="display text-2xl">Beta Art</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                An archive of verified human photography. RAW originals kept, provenance
                documented, licences signed by the maker.
              </p>
            </div>
            <nav aria-label="Footer">
              <p className="label">Navigate</p>
              <ul className="mt-4 space-y-2 text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="link-underline text-muted-foreground">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="label">Licensing</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {licenses.map((l) => (
                  <li key={l.name}>{l.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label">Studio</p>
              <address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground">
                <span className="block">Grünerløkka, Oslo</span>
                <a href="mailto:studio@beta-art.com" className="link-underline block">
                  studio@beta-art.com
                </a>
              </address>
            </div>
          </div>
          <div className="rule-top mt-12 grid grid-cols-[minmax(0,1fr)_auto] gap-4 pt-6">
            <p className="label">© {new Date().getFullYear()} Beta Art</p>
            <p className="label shrink-0">No synthetic imagery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
