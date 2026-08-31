import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LicenseRequestForm } from "@/components/LicenseRequestForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";

const TITLE = "Contact & Licence Requests — Beta Art";
const DESCRIPTION =
  "Contact Beta Art about licensing a plate from the archive, request provenance documentation, or ask about custom and exclusive terms.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteConfig.url}contact` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}contact` }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8 sm:py-20">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <p className="label">Contact</p>
              <h1 className="display mt-4 text-[clamp(2rem,5vw,3.5rem)]">Licence requests</h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Send the catalogue number, where the image will appear and for how long. Provenance
                documentation can be requested for any plate before licensing.
              </p>
              {/* LAUNCH CHECKLIST: fill these values in src/config/site.ts */}
              <dl className="rule-top mt-10 grid gap-4 pt-8">
                <div className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-4">
                  <dt className="label">Email</dt>
                  <dd className="text-sm text-foreground">{siteConfig.contactEmail}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-4">
                  <dt className="label">Studio</dt>
                  <dd className="text-sm text-foreground">{siteConfig.studioLocation}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-4">
                  <dt className="label">Postal address</dt>
                  <dd className="text-sm text-foreground">{siteConfig.postalAddress}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:gap-4">
                  <dt className="label">Response time</dt>
                  <dd className="text-sm text-foreground">{siteConfig.responseTime}</dd>
                </div>
              </dl>
            </div>
            <LicenseRequestForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
