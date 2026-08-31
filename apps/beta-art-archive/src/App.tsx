import { useEffect } from "react";
import { ThemeProvider } from "@/lib/theme";
import { LangProvider, useLang } from "@/lib/langContext";
import { PageProvider, usePage } from "@/lib/router";
import { CartProvider } from "@/lib/cartContext";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Categories } from "@/pages/Categories";
import { Faq } from "@/pages/Faq";
import { RequestShoot } from "@/pages/RequestShoot";
import { Cart } from "@/pages/Cart";
import { Sell } from "@/pages/Sell";
import { PlateDetail } from "@/pages/PlateDetail";
import { Artists } from "@/pages/Artists";
import { Prices } from "@/pages/Prices";
import { Auth } from "@/pages/Auth";
import { Feedback } from "@/pages/Feedback";

// New, user-directed addition — SEO/QA pass: an SPA that never updates
// <title> hurts search snippets and browser-tab orientation alike. Each
// route gets a real, distinct title instead of one static "Beta Art
// Archive" for every page.
function DocumentTitle() {
  const { page } = usePage();
  const { t } = useLang();
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "Beta Art — Verified Human Photography",
      categories: `${t("categoriesTitle")} — Beta Art`,
      faq: `${t("faqTitle")} — Beta Art`,
      "request-a-shoot": `${t("requestShootTitle")} — Beta Art`,
      cart: `${t("cartTitle")} — Beta Art`,
      sell: `${t("sellTitle")} — Beta Art`,
      plate: "Beta Art",
      artists: `${t("artistsTitle")} — Beta Art`,
      prices: `${t("pricesTitle")} — Beta Art`,
      auth: `${t("authLogIn")} / ${t("authRegister")} — Beta Art`,
      feedback: `${t("navFeedback")} — Beta Art`,
    };
    document.title = titles[page] ?? "Beta Art";
  }, [page, t]);
  return null;
}

function Pages() {
  const { page } = usePage();
  return (
    <>
      {page === "home" && <Home />}
      {page === "categories" && <Categories />}
      {page === "faq" && <Faq />}
      {page === "request-a-shoot" && <RequestShoot />}
      {page === "cart" && <Cart />}
      {page === "sell" && <Sell />}
      {page === "plate" && <PlateDetail />}
      {page === "artists" && <Artists />}
      {page === "prices" && <Prices />}
      {page === "auth" && <Auth />}
      {page === "feedback" && <Feedback />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <PageProvider>
          <CartProvider>
            <div className="min-h-screen bg-background text-foreground">
              <DocumentTitle />
              <Masthead />
              <Pages />
              <Footer />
            </div>
          </CartProvider>
        </PageProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
