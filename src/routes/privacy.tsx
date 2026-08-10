import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

const TITLE = "Privacy Policy — Beta Art";
const DESCRIPTION =
  "How Beta Art handles personal data submitted through licence requests. Template document pending completion of business details.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${siteConfig.url}privacy` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}privacy` }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This template describes how personal data submitted to Beta Art would be handled. It must be completed and reviewed before launch."
    >
      <LegalSection heading="Who is responsible">
        <p>
          Data controller: {siteConfig.legalEntity}. Registration number: {siteConfig.orgNumber}.
          Address: {siteConfig.postalAddress}. Contact: {siteConfig.contactEmail}.
        </p>
      </LegalSection>
      <LegalSection heading="What is collected">
        <p>
          The licence request form collects the plate selected, licence type, name, email, optional
          company, intended use, optional territory and duration, and any notes you add.
        </p>
        <p>
          The form is currently front-end only: nothing is transmitted or stored. Once a submission
          backend is connected, this section must state exactly where the data goes and for how long
          it is kept.
        </p>
      </LegalSection>
      <LegalSection heading="Legal basis and retention">
        <p>[To be completed: legal basis for processing and the retention period applied.]</p>
      </LegalSection>
      <LegalSection heading="Your rights">
        <p>
          [To be completed: rights of access, rectification, erasure, restriction, portability and
          objection, plus the supervisory authority to complain to and how to reach us.]
        </p>
      </LegalSection>
      <LegalSection heading="Cookies and analytics">
        <p>[To be completed: list any cookies or analytics used, or state that none are used.]</p>
      </LegalSection>
    </LegalPage>
  );
}
