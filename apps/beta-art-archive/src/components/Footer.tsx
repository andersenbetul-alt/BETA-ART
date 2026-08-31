import { usePage } from "@/lib/router";
import { useLang } from "@/lib/langContext";

export function Footer() {
  const { go } = usePage();
  const { t } = useLang();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-[min(100%-3rem,1280px)] py-[clamp(2.5rem,6vw,4rem)]">
        <p className="max-w-[46ch] text-sm text-muted-foreground">{t("footerTagline")}</p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-record text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{t("footerArchive")}</p>
            {/* Order and membership here match the real beta-art.com footer
                exactly (verified against a fresh paste, 31.08.2026): Collection,
                Verification, Photographer, Categories, Industries — note Events
                is in the real header nav but NOT the real footer, so it's
                deliberately absent here even though it's above in Masthead.
                Sell/Feedback are this build's own additions, appended after the
                sourced list rather than interleaved into it. */}
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => go("home", "collection")} className="hover:text-accent">{t("navCollection")}</button></li>
              <li><button onClick={() => go("home", "verification")} className="hover:text-accent">{t("navVerification")}</button></li>
              <li><button onClick={() => go("home", "photographer")} className="hover:text-accent">{t("navPhotographer")}</button></li>
              <li><button onClick={() => go("categories")} className="hover:text-accent">{t("navCategories")}</button></li>
              <li><a href="https://beta-art.com/industries" target="_blank" rel="noopener noreferrer" className="hover:text-accent">{t("navIndustries")}</a></li>
              <li><button onClick={() => go("sell")} className="hover:text-accent">{t("navSell")}</button></li>
              <li><button onClick={() => go("feedback")} className="hover:text-accent">{t("navFeedback")}</button></li>
            </ul>
          </div>
          <div>
            <p className="font-record text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{t("footerLicensing")}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => go("home", "licensing")} className="hover:text-accent">Personal</button></li>
              <li><button onClick={() => go("home", "licensing")} className="hover:text-accent">Commercial</button></li>
              <li><button onClick={() => go("home", "licensing")} className="hover:text-accent">Extended</button></li>
              <li><button onClick={() => go("home", "request")} className="hover:text-accent">Custom &amp; Exclusive</button></li>
            </ul>
          </div>
          <div>
            {/* Legal link labels stay Norwegian regardless of UI language — matching the
                real beta-art.com, which shows these same Norwegian labels on its English
                page too. Not a translation gap; see docs/beta-art/tasarim-sistemi.md. */}
            <p className="font-record text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{t("footerLegal")}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="https://beta-art.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Personvernerklæring</a></li>
              <li><a href="https://beta-art.com/cookie-settings" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Cookie-innstillinger</a></li>
              <li><a href="https://beta-art.com/license-terms" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Lisensbetingelser</a></li>
              <li><a href="https://beta-art.com/kontakt" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Angrerett og refusjon</a></li>
              <li><a href="mailto:hallo@beta-art.com" className="hover:text-accent">{t("navContact")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-6 font-record text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{t("footerRights")}</span>
          <span>{t("footerNoAi")}</span>
        </div>
      </div>
    </footer>
  );
}
