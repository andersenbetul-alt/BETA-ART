import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { licenses } from "@/data/collection";

const TITLE = "License Terms & Terms of Use — Beta Art";
const DESCRIPTION =
  "Draft Beta Art photography licence terms covering permitted use, provenance documentation and restrictions on AI training and data mining.";

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
      intro="Draft terms for Beta Art photography licensing. The signed licence issued for a specific order always controls that transaction. Business identity and final legal details must be completed and professionally reviewed before commercial launch."
    >
      <LegalSection heading="Parties">
        <p>
          Licensor: {siteConfig.legalEntity} (trading as {siteConfig.name}), registration number{" "}
          {siteConfig.orgNumber}, {siteConfig.postalAddress}. VAT status: {siteConfig.vatStatus}.
        </p>
      </LegalSection>

      <LegalSection heading="What is being licensed">
        <p>
          Copyright remains with the photographer. A licence grants the customer a defined right to
          use a specified photograph; it does not transfer copyright or ownership of the original RAW
          file. Each issued agreement should identify the catalogue record, delivered file, permitted
          media, territory, term and any exclusivity.
        </p>
      </LegalSection>

      <LegalSection heading="Licence scopes">
        <ul className="space-y-3">
          {licenses.map((license) => (
            <li key={license.id}>
              <strong className="text-foreground">{license.name}</strong> — {license.summary}
            </li>
          ))}
        </ul>
        <p>
          Website summaries and displayed prices are informational while the site is in development.
          The written licence accepted for the order takes precedence over any summary copy.
        </p>
      </LegalSection>

      <LegalSection heading="Provenance documentation">
        <p>
          Where a plate is marked as verified, Beta Art may supply a provenance record describing the
          evidence held for that photograph, such as an archived RAW original, capture metadata,
          checksum or supported Content Credentials. A provenance record documents the evidence and
          chain of origin available to Beta Art; it is not a guarantee that every statement about the
          depicted scene is independently true.
        </p>
        <p>
          Plates whose evidence is incomplete must remain visibly marked as pending or unverified and
          must not be represented as fully verified.
        </p>
      </LegalSection>

      <LegalSection heading="AI training, model development and data mining">
        <p>
          Unless a separately signed agreement expressly says otherwise, the licence does not grant
          permission to use the image, its metadata, provenance record or associated files to train,
          fine-tune, evaluate or develop generative-AI or machine-learning models; to create datasets
          for those purposes; or to perform text-and-data-mining for model development.
        </p>
        <p>
          Beta Art may also publish machine-readable rights-reservation signals. Such signals support
          the written terms but do not replace the contract and do not imply that every crawler or
          downstream system will technically honour them.
        </p>
      </LegalSection>

      <LegalSection heading="Editing and derivative use">
        <p>
          Normal resizing, cropping and colour adjustments needed for an authorised use may be allowed
          within the issued licence. Generative alteration, synthetic replacement of people or material
          scene elements, or use that materially misrepresents the depicted person or event requires
          separate written permission unless the licence expressly allows it.
        </p>
      </LegalSection>

      <LegalSection heading="Copyright, attribution and transfer">
        <p>
          Licences are non-transferable and may not be sub-licensed unless the signed agreement permits
          it. Attribution requirements, if any, are stated in the issued licence. The customer may not
          resell or redistribute the image as standalone stock or make the original file available to
          third parties outside the licensed project.
        </p>
      </LegalSection>

      <LegalSection heading="Model and property releases">
        <p>
          Where a release is relevant, the plate record should state whether a release is held. The
          customer remains responsible for ensuring the intended use fits the granted rights and any
          restrictions stated in the release or licence.
        </p>
      </LegalSection>

      <LegalSection heading="Unauthorised use">
        <p>
          Unlicensed use may give rise to claims for reasonable remuneration and/or compensation under
          applicable copyright law and the circumstances of the infringement. Beta Art does not state a
          fixed automatic multiplier for every infringement.
        </p>
      </LegalSection>

      <LegalSection heading="Consumer withdrawal and digital delivery">
        <p>
          Any consumer checkout for immediate digital delivery must present the legally required
          pre-contract information and obtain the necessary express request/acknowledgement where an
          exception to the statutory withdrawal right is relied upon. The final checkout wording must be
          reviewed against the law applicable at launch.
        </p>
      </LegalSection>

      <LegalSection heading="Warranties and liability">
        <p>
          Final commercial terms must specify what Beta Art warrants about authorship, provenance,
          releases, technical delivery and rights, together with an appropriate limitation of liability.
          No guarantee should be published unless it can be evidenced and honoured.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>[To be completed with the registered seller's governing law, venue and mandatory consumer-law exceptions.]</p>
      </LegalSection>

      <LegalSection heading="Website terms of use">
        <p>
          Website content may not be copied or redistributed without permission. Development placeholder
          imagery is not part of the verified archive and is not offered for licence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
