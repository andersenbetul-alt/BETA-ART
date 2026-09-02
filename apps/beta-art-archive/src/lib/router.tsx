import { createContext, useContext, useState, type ReactNode } from "react";
import { record } from "./behavior";

export type Page = "home" | "categories" | "faq" | "request-a-shoot" | "cart" | "sell" | "plate" | "artists" | "prices" | "auth" | "feedback";

const PageContext = createContext<{
  page: Page;
  plateId: string | null;
  go: (p: Page, hash?: string) => void;
  goToPlate: (id: string) => void;
}>({
  page: "home",
  plateId: null,
  go: () => {},
  goToPlate: () => {},
});

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [plateId, setPlateId] = useState<string | null>(null);

  const go = (p: Page, hash?: string) => {
    // Behavior layer: every navigation is recorded on-device (never sent
    // anywhere) — see lib/behavior.ts.
    record({ t: "page", page: p });
    setPage(p);
    window.scrollTo({ top: 0 });
    if (p === "home" && hash) {
      // let the page mount, then scroll to the section
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  const goToPlate = (id: string) => {
    setPlateId(id);
    setPage("plate");
    window.scrollTo({ top: 0 });
  };

  return <PageContext.Provider value={{ page, plateId, go, goToPlate }}>{children}</PageContext.Provider>;
}

export function usePage() {
  return useContext(PageContext);
}
