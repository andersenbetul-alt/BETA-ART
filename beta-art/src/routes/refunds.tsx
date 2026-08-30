import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

const TITLE = "Refund & Withdrawal Information — Beta Art";
const DESCRIPTION =
  "Template refund and right-of-withdrawal information for Beta Art photography licences. Pending completion before launch.";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${siteConfig.url}refunds` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}refunds` }],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <LegalPage
      title="Refund & Withdrawal Information"
      intro="Template information about cancellation, withdrawal and refunds for digital licences."
    >
      <LegalSection heading="Right of withdrawal">
        <p>
          [To be completed: whether a statutory right of withdrawal applies to consumers in your
          jurisdiction, its length, and whether it is waived when a digital file is delivered
          immediately.]
        </p>
      </LegalSection>
      <LegalSection heading="Refunds">
        <p>
          [To be completed: the circumstances in which a licence fee is refunded, the process for
          requesting a refund, and the timeframe for processing.]
        </p>
      </LegalSection>
      <LegalSection heading="Cancellation before delivery">
        <p>
          [To be completed: what happens if a request is cancelled after terms are agreed but before
          the file is delivered.]
        </p>
      </LegalSection>
      <LegalSection heading="How to contact us">
        <p>
          Send refund or withdrawal requests to {siteConfig.contactEmail}, quoting the catalogue
          number and the licence reference.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
