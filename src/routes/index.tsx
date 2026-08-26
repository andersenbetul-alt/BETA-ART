import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import makerImage from "@/assets/maker.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LicenseRequestForm } from "@/components/LicenseRequestForm";
import { canonicalUrl, robotsContent, siteConfig } from "@/config/site";
import { plates, licenses, faqs } from "@/data/collection";

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

const proofChain = [
  ["01", "Human", "A named, accountable photographer makes the capture."],
  ["02", "Camera", "Physical camera and capture metadata are recorded when available."],
  ["03", "RAW", "The original RAW can be archived and fingerprinted before delivery."],
  ["04", "Edit", "Permitted edits are disclosed instead of hidden behind a vague AI-free label."],
  ["05", "Rights", "Copyright, consent and data-mining restrictions travel with the asset."],
  ["06", "Licence", "The buyer receives a licence tied to the exact image and agreed use."],
] as const;

const series = [
  {
    roman: "I",
    title: "Work",
    note: "People at work — skill, repetition, concentration and the physical reality of making a living.",
    use: "Editorial · corporate · campaigns",
  },
  {
    roman: "II",
    title: "Craft",
    note: "Hands, tools and materials. Process rather than product; evidence of how something is actually made.",
    use: "Design · publishing · brand stories",
  },
  {
    roman: "III",
    title: "Land and Light",
    note: "Specific Norwegian places at specific moments, treated as records rather than generic scenery.",
    use: "Travel · editorial · place branding",
  },
  {
    roman: "IV",
    title: "The Table",
    note: "Food, preparation and shared meals — steam, flour, markets and people before the finished plate.",
    use: "Food · hospitality · editorial",
  },
  {
    roman: "V",
    title: "Rooms",
    note: "Nordic architecture and interiors seen as lived spaces, with attention to time, light and use.",
    use: "Architecture · design · property",
  },
  {
    roman: "VI",
    title: "The Unseen",
    note: "Places outside the familiar route: nearby, real and under-photographed rather than over-produced.",
    use: "Destination · discovery · editorial",
  },
  {
    roman: "VII",
    title: "Weather",
    note: "Weather meeting daily life and built environments — atmosphere recorded as an event, not an effect.",
    use: "News · climate · editorial",
  },
] as const;

const archiveLayers = [
  {
    title: "Beta Archive",
    state: "Foundation",
    body: "Curated human photography organised by series, catalogue record, provenance status and licence.",
  },
  {
    title: "Beta Passport",
    state: "Next layer",
    body: "A readable record for creator, capture, RAW evidence, edit disclosure, rights and licence status.",
  },
  {
    title: "Beta Vault",
    state: "Next layer",
    body: "Protected storage of original RAW evidence and cryptographic fingerprints without exposing valuable originals publicly.",
  },
  {
    title: "Beta Verify",
    state: "Planned",
    body: "A verification interface for checking whether a delivered file matches a registered Beta Art record.",
  },
  {
    title: "Beta Rights",
    state: "Next layer",
    body: "Human-readable licences supported by machine-readable rights and AI-training reservations where technically available.",
  },
  {
    title: "Commissioned work",
    state: "Planned",
    body: "A client brief becomes a real-world shoot, delivered to the same provenance and licensing standard as the archive.",
  },
] as const;

const audiences = [
  {
    title: "Brands & agencies",
    body: "Photography with documented origin, clearer rights and optional exclusivity for campaigns and commercial work.",
    cta: "View licensing",
    href: "#licensing",
  },
  {
    title: "Editorial & institutions",
    body: "Source transparency, provenance records and licensing documentation for publishing and institutional use.",
    cta: "See the proof chain",
    href: "#proof",
  },
  {
    title: "Collectors & private use",
    body: "License or collect human-made photography with a clearer record of origin than a conventional download.",
    cta: "Explore the archive",
    href: "#collection",
  },
] as const;

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
        <section className="border-b border-border">
          <div className="mx-auto max-w-[92rem] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pt-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div>
                <p className="label">Verified human photography · provenance · licensing</p>
                <h1 className="display mt-6 text-[clamp(3rem,8vw,7rem)] leading-[0.92]">
                  Photography
                  <br />
                  with proof.
                </h1>
                <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Beta Art is a single-photographer archive built around evidence. The aim is to
                  preserve the connection between maker, physical capture, original file, disclosed
                  edits, rights and licence — so the photograph arrives with context, not just pixels.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="#collection" className="btn-ink focus-ring">Explore the archive</a>
                  <a href="#proof" className="btn-outline-ink focus-ring">See how proof works</a>
                </div>
                <div className="rule-top mt-10 grid gap-5 pt-6 sm:grid-cols-3">
                  <div><p className="label">Human captured</p><p className="mt-2 text-sm text-muted-foreground">No synthetic imagery is offered as an archive plate.</p></div>
                  <div><p className="label">Evidence stated</p><p className="mt-2 text-sm text-muted-foreground">Verified, pending and unknown are kept visibly distinct.</p></div>
                  <div><p className="label">Direct licensing</p><p className="mt-2 text-sm text-muted-foreground">Rights are tied to the exact catalogue record.</p></div>
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
                <figcaption className="label mt-3">Development image — replace with verified archive original before launch</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="border-b border-border" aria-labelledby="manifesto-title">
          <div className="mx-auto max-w-[72rem] px-5 py-20 text-center sm:px-8 sm:py-28">
            <p className="label">A note from the archive</p>
            <h2 id="manifesto-title" className="display mt-6 text-[clamp(2rem,5vw,4.25rem)] leading-[1.05]">
              In a world where an image can be generated in seconds, provenance becomes part of the work.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Beta Art is designed to keep the record beside the photograph: who made it, what physical
              capture evidence exists, what changed afterwards, which rights are cleared and how it may
              be used. No unsupported claim is upgraded into a fact for the sake of marketing.
            </p>
          </div>
        </section>

        <section id="proof" className="border-b border-border" aria-labelledby="proof-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="label">The Beta proof chain</p>
                <h2 id="proof-title" className="display mt-4 text-3xl sm:text-5xl">From shutter to licence</h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Beta Art does not claim to prove that a scene is “true”. It documents provenance:
                  what evidence exists, what has been checked and what is still unknown.
                </p>
              </div>
              <ol className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {proofChain.map(([index, title, body]) => (
                  <li key={index} className="bg-background p-6 sm:p-8">
                    <p className="label">{index}</p>
                    <h3 className="display mt-4 text-2xl">{title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>
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
                <p className="label">Beta Passport · prototype</p>
                <h2 id="passport-title" className="display mt-4 text-3xl sm:text-5xl">The record behind the photograph</h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  The long-term verification product is not another AI detector. It is a readable
                  provenance record showing the evidence attached to each image — without inventing
                  certainty where evidence is missing.
                </p>
              </div>
              <div className="border border-border p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                  <div><p className="label">Example passport</p><p className="display mt-2 text-2xl">BA-001 · First Light</p></div>
                  <span className="label">Prototype</span>
                </div>
                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  {[
                    ["Human capture", "Verification status"],
                    ["RAW original", "Archive + fingerprint"],
                    ["Capture record", "Camera · lens · date · place"],
                    ["Edit disclosure", "What changed after capture"],
                    ["Rights", "Copyright · consent · AI training"],
                    ["Licence", "Buyer · scope · territory · term"],
                  ].map(([term, detail]) => (
                    <div key={term} className="rule-top pt-4"><dt className="label">{term}</dt><dd className="mt-2 text-sm text-muted-foreground">{detail}</dd></div>
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
                <p className="label">Editorial framework</p>
                <h2 id="series-title" className="display mt-4 text-3xl sm:text-5xl">Series, not keywords.</h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  The archive is being structured as bodies of work rather than a pile of stock tags.
                  These seven series are the curatorial framework; only series backed by real verified
                  plates will be presented as live collections.
                </p>
              </div>
              <ol className="grid gap-px bg-border sm:grid-cols-2">
                {series.map((item) => (
                  <li key={item.roman} className="bg-background p-6 sm:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="label">Series {item.roman}</p>
                      <p className="label">Framework</p>
                    </div>
                    <h3 className="display mt-4 text-2xl sm:text-3xl">{item.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                    <p className="label rule-top mt-6 pt-4">{item.use}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="collection" className="border-b border-border" aria-labelledby="collection-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-3xl">
              <p className="label">Current catalogue preview</p>
              <h2 id="collection-title" className="display mt-4 text-3xl sm:text-5xl">Human photography, catalogue by catalogue</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Every plate carries an explicit verification status. Development placeholders remain
                labelled until a real original and capture record are supplied.
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
                        <p className="text-sm text-muted-foreground">{plate.verification.status}</p>
                        <p className="label text-foreground">from kr {plate.price}</p>
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
            <p className="label">What the archive is becoming</p>
            <h2 id="platform-title" className="display mt-4 max-w-3xl text-3xl sm:text-5xl">Keep the photograph first. Build trust around it.</h2>
            <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {archiveLayers.map((item) => (
                <article key={item.title} className="bg-background p-6 sm:p-8">
                  <p className="label">{item.state}</p>
                  <h3 className="display mt-4 text-2xl">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="rights" className="border-b border-border" aria-labelledby="rights-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label">Rights & AI use</p>
              <h2 id="rights-title" className="display mt-4 text-3xl sm:text-5xl">Protect the image after it leaves the archive</h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Beta Art’s direction is layered rights signalling: the written licence remains the
                legal agreement, while IPTC/PLUS-compatible metadata, site-level reservations and
                Content Credentials can add machine-readable context where implemented.
              </p>
              <p>
                The goal is to make permitted use obvious, make AI-training restrictions explicit,
                and preserve rights information as far as today’s open standards allow.
              </p>
            </div>
          </div>
        </section>

        <section id="licensing" className="border-b border-border" aria-labelledby="licensing-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-3xl">
              <p className="label">Licensing</p>
              <h2 id="licensing-title" className="display mt-4 text-3xl sm:text-5xl">Clear rights for real use</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Start simple, then move up to commercial, extended or exclusive rights. Final prices
                and terms remain subject to the issued licence agreement.
              </p>
            </div>
            <ul className="mt-10 grid gap-px bg-border lg:grid-cols-4">
              {licenses.map((license) => (
                <li key={license.id} className="flex flex-col bg-background p-6 sm:p-8">
                  <p className="label">{license.audience}</p>
                  <h3 className="display mt-3 text-2xl">{license.name}</h3>
                  <p className="mt-3 font-medium">{license.price}</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{license.summary}</p>
                  <a href="#request" className="link-underline focus-ring mt-8 self-start rounded-sm text-sm">Request terms</a>
                </li>
              ))}
            </ul>
            <div id="request" className="mt-12 max-w-3xl"><LicenseRequestForm /></div>
          </div>
        </section>

        <section id="audiences" className="border-b border-border" aria-labelledby="audiences-title">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24">
            <p className="label">Built for</p>
            <h2 id="audiences-title" className="display mt-4 text-3xl sm:text-5xl">One archive, different rights needs</h2>
            <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
              {audiences.map((item) => (
                <article key={item.title} className="bg-background p-6 sm:p-8">
                  <h3 className="display text-2xl">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  <a href={item.href} className="link-underline focus-ring mt-8 inline-block rounded-sm text-sm">{item.cta}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="commissions" className="border-b border-border" aria-labelledby="commissions-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label">Planned · commissioned capture</p>
              <h2 id="commissions-title" className="display mt-4 text-3xl sm:text-5xl">Need an image that does not exist yet?</h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                A future commission service can take a client brief into the real world and deliver
                new photographs to the same archival standard: capture evidence, releases where needed,
                edit disclosure and a written licence. It remains a planned service until that workflow
                is operational.
              </p>
              <a href="#request" className="btn-outline-ink focus-ring mt-8">Discuss a future commission</a>
            </div>
          </div>
        </section>

        <section id="photographer" className="border-b border-border" aria-labelledby="photographer-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <figure>
              <div className="plate-frame aspect-4/5">
                <img src={makerImage} alt="Development placeholder for the Beta Art photographer portrait" width={1200} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <figcaption className="label mt-3">Photographer portrait to be replaced with a confirmed brand asset</figcaption>
            </figure>
            <div className="lg:pt-6">
              <p className="label">The maker</p>
              <h2 id="photographer-title" className="display mt-4 text-3xl sm:text-5xl">A human archive starts with an accountable human.</h2>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                The final release will place the photographer’s own voice, portrait and manifesto here.
                That material is a trust requirement, not decoration: provenance begins with knowing who
                stands behind the record. Unconfirmed biography and credentials will never be invented.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="border-b border-border" aria-labelledby="faq-title">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div><p className="label">FAQ</p><h2 id="faq-title" className="display mt-4 text-3xl sm:text-4xl">Questions about Beta Art</h2></div>
            <dl className="grid gap-px bg-border">
              {faqs.map((f) => (
                <div key={f.q} className="bg-background py-6 sm:py-8">
                  <dt className="display text-xl sm:text-2xl">{f.q}</dt>
                  <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="final-title">
          <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
            <p className="label">Beta Art</p>
            <h2 id="final-title" className="display mt-4 max-w-4xl text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]">We do not guess what is real. We document where the photograph came from.</h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#collection" className="btn-ink focus-ring">Explore the archive</a>
              <Link to="/contact" className="btn-outline-ink focus-ring">Contact Beta Art</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
