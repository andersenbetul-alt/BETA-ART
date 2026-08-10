import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { siteConfig } from "@/config/site";
import { DevelopmentNotice } from "./DevelopmentNotice";

export const primaryNav = [
  { label: "Collection", href: "/#collection" },
  { label: "Verification", href: "/#verification" },
  { label: "Ordering", href: "/#ordering" },
  { label: "Licensing", href: "/#licensing" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <DevelopmentNotice />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[92rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
          <Link to="/" className="min-w-0 focus-ring rounded-sm">
            <span className="display block truncate text-xl tracking-tight sm:text-2xl">
              {siteConfig.name}
            </span>
            <span className="label hidden sm:block">{siteConfig.tagline}</span>
          </Link>

          <nav aria-label="Primary" className="shrink-0">
            <ul className="hidden items-center gap-7 lg:flex">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="label focus-ring rounded-sm hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/contact" className="label focus-ring rounded-sm hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={menuId}
              className="label focus-ring inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-foreground lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true">{open ? "×" : "≡"}</span>
            </button>
          </nav>
        </div>

        <div
          id={menuId}
          hidden={!open}
          className="border-t border-border bg-background lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="mx-auto max-w-[92rem] px-5 py-4 sm:px-8">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-border last:border-0">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="label focus-ring block py-3 text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="label focus-ring block py-3 text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
