import { Link } from "@tanstack/react-router";
import { legalPages, siteConfig } from "@/config/site";
import { licenses } from "@/data/collection";
import { useT } from "@/i18n";
import { primaryNav } from "./SiteHeader";

const LEGAL_KEY: Record<string, string> = {
  "/privacy": "legal.privacy",
  "/license-terms": "legal.terms",
  "/refunds": "legal.refunds",
  "/contact": "legal.contact",
};

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="display text-2xl">{siteConfig.name}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.blurb")}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="label">{t("footer.navigate")}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline focus-ring rounded-sm text-muted-foreground">
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label">{t("footer.licensing")}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {licenses.map((l) => (
                <li key={l.id}>
                  <a href="/#licensing" className="link-underline focus-ring rounded-sm">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Legal and contact">
            <p className="label">{t("footer.legal")}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {legalPages.map((page) => (
                <li key={page.to}>
                  <Link to={page.to} className="link-underline focus-ring rounded-sm">
                    {t(LEGAL_KEY[page.to] ?? page.label)}
                  </Link>
                </li>
              ))}
            </ul>
            {/* LAUNCH CHECKLIST: supply contact email and address in src/config/site.ts */}
            <address className="mt-4 space-y-1 text-sm not-italic text-muted-foreground">
              <span className="block">{t("footer.email")}: {siteConfig.contactEmail}</span>
              <span className="block">{t("footer.studio")}: {siteConfig.studioLocation}</span>
            </address>
          </nav>
        </div>

        <div className="rule-top mt-12 grid gap-4 pt-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <p className="label">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="label sm:shrink-0">{t("footer.placeholder")}</p>
        </div>
      </div>
    </footer>
  );
}
