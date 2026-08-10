import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <Breadcrumbs items={[{ label: title }]} />
          <p className="label">Legal</p>
          <h1 className="display mt-4 text-[clamp(2rem,5vw,3.25rem)]">{title}</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{intro}</p>

          <div className="rule-top mt-10 border border-border bg-secondary p-5">
            <p className="label text-foreground">Template copy — not legal advice</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This page is a labelled template. Every bracketed field must be completed with real
              business details and the whole document reviewed by a qualified adviser before launch.
            </p>
          </div>

          <div className="mt-12 space-y-10">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="display text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
