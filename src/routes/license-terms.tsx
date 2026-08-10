import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { licenses } from "@/data/collection";

const TITLE = "License Terms & Terms of Use — Beta Art";
const DESCRIPTION =
  "Template licence terms and website terms of use for Beta Art photography licensing. Pending completion of business and legal details.";

export const Route = createFileRoute("/license-terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${siteConfig.url}license-terms` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}license-terms` }],
  }),
  component: LicenseTerms,
});

function LicenseTerms() {
  return (
    <LegalPage
      title="License Terms & Terms of Use"
      intro="Template terms covering use of this website and the licences issued for images in the archive."
    >
      <LegalSection heading="Parties">
        <p>
          Licensor: {siteConfig.legalEntity} (trading as {siteConfig.name}), registration number{" "}
          {siteConfig.orgNumber}, {siteConfig.postalAddress}. VAT status: {siteConfig.vatStatus}.
        </p>
      </LegalSection>
      <LegalSection heading="Licence scopes">
        <ul className="space-y-3">
          {licenses.map((l) => (
            <li key={l.id}>
              <strong className="text-foreground">{l.name}</strong> — {l.summary}
            </li>
          ))}
        </ul>
        <p>
          Each issued licence names the catalogue number, the permitted scope, the territory and the
          term. The signed agreement takes precedence over the summaries on this site.
        </p>
      </LegalSection>
      <LegalSection heading="Copyright and attribution">
        <p>
          Copyright remains with the photographer. Licences grant use, not ownership, and are not
          transferable unless the agreement says so. [To be completed: attribution requirements.]
        </p>
      </LegalSection>
      <LegalSection heading="Restrictions">
        <p>
          Images may not be resold as stock, sub-licensed, or used in a way that is unlawful or
          defamatory. [To be completed: any further restrictions specific to your practice.]
        </p>
      </LegalSection>
      <LegalSection heading="Warranties and liability">
        <p>
          [To be completed: what is warranted about the images and provenance, and the limitation of
          liability. Do not state guarantees that cannot be honoured.]
        </p>
      </LegalSection>
      <LegalSection heading="Governing law">
        <p>[To be completed: governing law and venue for disputes.]</p>
      </LegalSection>
      <LegalSection heading="Website terms of use">
        <p>
          Content on this site, including placeholder imagery used during development, may not be
          copied or reproduced without permission. Placeholder imagery is not part of the archive
          and is not offered for licence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
