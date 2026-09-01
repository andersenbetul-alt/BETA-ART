import { useEffect, useState } from "react";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SealMark } from "./SealMark";
import { useTheme } from "@/lib/theme";
import { usePage } from "@/lib/router";
import { useLang } from "@/lib/langContext";
import { LANGS } from "@/lib/i18n";
import { useCart } from "@/lib/cartContext";

export function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { page, go } = usePage();
  const { lang, setLang, t } = useLang();
  const { items } = useCart();

  const ARCHIVE_LINKS: { label: string; page: "home"; hash: string }[] = [
    { label: t("navCollection"), page: "home", hash: "collection" },
    { label: t("navEvents"), page: "home", hash: "events" },
    { label: t("navVerification"), page: "home", hash: "verification" },
    { label: t("navPhotographer"), page: "home", hash: "photographer" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/93 backdrop-blur-sm transition-colors ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-[76px] w-[min(100%-3rem,1280px)] items-center gap-6">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 text-foreground"
          aria-label="Beta Art"
        >
          <SealMark className="h-7 w-7 flex-none text-foreground" />
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="font-record text-xs font-semibold tracking-[0.22em]">BETA ART</span>
            <span className="font-record text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              {t("tagline")}
            </span>
          </span>
        </button>

        <nav className="ml-auto hidden items-center gap-5 xl:flex" aria-label="Primary">
          {ARCHIVE_LINKS.map((item) => (
            <button
              key={item.hash}
              onClick={() => go(item.page, item.hash)}
              className="border-b border-transparent pb-[3px] font-record text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => go("categories")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "categories" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navCategories")}
          </button>
          {/* Industries: real beta-art.com nav item. Was an external link to
              beta-art.com/industries; since the root domain now targets this
              site (user decision 01.09.2026), it points at the in-site
              directory whose "Norwegian Industries" section covers it. */}
          <button
            onClick={() => go("categories")}
            className="border-b border-transparent pb-[3px] font-record text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            {t("navIndustries")}
          </button>
          <button
            onClick={() => go("artists")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "artists" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navArtists")}
          </button>
          <button
            onClick={() => go("home", "licensing")}
            className="border-b border-transparent pb-[3px] font-record text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            {t("navLicensing")}
          </button>
          <button
            onClick={() => go("prices")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "prices" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navPrices")}
          </button>
          <button
            onClick={() => go("faq")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "faq" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navFaq")}
          </button>
          <button
            onClick={() => go("sell")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "sell" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navSell")}
          </button>
          <button
            onClick={() => go("feedback")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "feedback" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navFeedback")}
          </button>
          {/* Contact: real beta-art.com nav item — links to the /request-a-shoot
              page, matching the real site's own routing (its "Contact" nav label
              points there, not to a separate contact form). */}
          <button
            onClick={() => go("request-a-shoot")}
            className={`border-b pb-[3px] font-record text-xs uppercase tracking-[0.14em] transition-colors ${
              page === "request-a-shoot" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {t("navContact")}
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <div className="hidden items-center gap-2 whitespace-nowrap border-e border-border pe-3 font-record text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground md:flex">
            <button onClick={() => go("auth")} className="hover:text-accent">
              {t("authLogIn")}
            </button>
            <span className="text-border">/</span>
            <button onClick={() => go("auth")} className="hover:text-accent">
              {t("authRegister")}
            </button>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as never)}
            aria-label="Language"
            className="h-9 appearance-none rounded-none border border-border bg-background px-2 font-record text-[0.68rem] uppercase tracking-[0.08em]"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code.toUpperCase()} · {l.native}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full border-border"
            onClick={() => go("cart")}
            aria-label={t("cartLabel")}
          >
            <ShoppingBag className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-record text-[0.6rem] text-accent-foreground">
                {items.length}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border"
            onClick={toggle}
            aria-label={theme === "dark" ? t("themeToLight") : t("themeToDark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="border-border xl:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background px-6 pb-6 xl:hidden" aria-label="Mobile">
          {ARCHIVE_LINKS.map((item) => (
            <button
              key={item.hash}
              onClick={() => {
                go(item.page, item.hash);
                setMobileOpen(false);
              }}
              className="block w-full border-b border-border py-4 text-left font-record text-xs uppercase tracking-[0.14em] text-muted-foreground"
            >
              {item.label}
            </button>
          ))}
          {[
            ["categories", t("navCategories")],
            ["artists", t("navArtists")],
            ["prices", t("navPrices")],
            ["faq", t("navFaq")],
            ["sell", t("navSell")],
            ["feedback", t("navFeedback")],
            ["request-a-shoot", t("navContact")],
          ].map(([p, label]) => (
            <button
              key={p}
              onClick={() => {
                go(p as never);
                setMobileOpen(false);
              }}
              className="block w-full border-b border-border py-4 text-left font-record text-xs uppercase tracking-[0.14em] text-muted-foreground"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              go("categories");
              setMobileOpen(false);
            }}
            className="block w-full border-b border-border py-4 text-left font-record text-xs uppercase tracking-[0.14em] text-muted-foreground"
          >
            {t("navIndustries")}
          </button>
          <button
            onClick={() => {
              go("home", "licensing");
              setMobileOpen(false);
            }}
            className="block w-full border-b border-border py-4 text-left font-record text-xs uppercase tracking-[0.14em] text-muted-foreground"
          >
            {t("navLicensing")}
          </button>
          <div className="flex gap-4 py-4 font-record text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <button onClick={() => { go("auth"); setMobileOpen(false); }} className="hover:text-accent">
              {t("authLogIn")}
            </button>
            <button onClick={() => { go("auth"); setMobileOpen(false); }} className="hover:text-accent">
              {t("authRegister")}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
