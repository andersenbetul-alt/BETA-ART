import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { siteConfig } from "@/config/site";
import { DevelopmentNotice } from "./DevelopmentNotice";

export const primaryNav = [
  { label: "Series", href: "/#series" },
  { label: "Archive", href: "/#collection" },
  { label: "Proof", href: "/#proof" },
  { label: "Passport", href: "/#passport" },
  { label: "Rights", href: "/#rights" },
  { label: "Licensing", href: "/#licensing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <DevelopmentNotice />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[92rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
          <Link to="/" className="min-w-0 rounded-sm focus-ring">
            <span className="display block truncate text-xl tracking-tight sm:text-2xl">{siteConfig.name}</span>
            <span className="label hidden sm:block">{siteConfig.tagline}</span>
          </Link>

          <nav aria-label="Primary" className="shrink-0">
            <ul className="hidden items-center gap-6 xl:flex">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="label rounded-sm focus-ring hover:text-foreground">{item.label}</a>
                </li>
              ))}
              <li><Link to="/contact" className="label rounded-sm focus-ring hover:text-foreground">Contact</Link></li>
            </ul>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={menuId}
              className="label inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-foreground focus-ring xl:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true">{open ? "×" : "≡"}</span>
            </button>
          </nav>
        </div>

        <div id={menuId} hidden={!open} className="border-t border-border bg-background xl:hidden">
          <nav aria-label="Mobile">
            <ul className="mx-auto max-w-[92rem] px-5 py-4 sm:px-8">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-border last:border-0">
                  <a href={item.href} onClick={() => setOpen(false)} className="label block py-3 text-foreground focus-ring">{item.label}</a>
                </li>
              ))}
              <li>
                <Link to="/contact" onClick={() => setOpen(false)} className="label block py-3 text-foreground focus-ring">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
