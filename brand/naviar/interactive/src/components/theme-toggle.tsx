import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "system" | "light" | "dark";
const STORAGE_KEY = "naviar-identity-theme";

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    let stored: Mode = "system";
    try {
      stored = (localStorage.getItem(STORAGE_KEY) as Mode) || "system";
    } catch {
      // localStorage kapalı olabilir (özel pencere) — sistem varsayılanında kal.
    }
    setMode(stored);
    apply(stored);
  }, []);

  function cycle() {
    const order: Mode[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sessizce yut — tema tercihi kalıcı olmasa da sayfa doğru render olur
    }
  }

  const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;
  const label = mode === "system" ? "Sistem" : mode === "light" ? "Açık" : "Koyu";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycle}
      className="gap-2 font-data text-xs uppercase tracking-wide"
      aria-label={`Tema: ${label}. Değiştirmek için tıklayın.`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
