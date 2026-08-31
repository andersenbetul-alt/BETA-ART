import { createContext, useContext, useState, type ReactNode } from "react";
import { type Lang, translate } from "./i18n";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("beta-art-lang") as Lang | null;
    if (stored) return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("beta-art-lang", l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  };

  const t = (key: string) => translate(lang, key as never);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
