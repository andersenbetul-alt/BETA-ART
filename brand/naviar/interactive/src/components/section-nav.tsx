import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SECTIONS = [
  { id: "wordmark", label: "Wordmark" },
  { id: "monogram", label: "Monogram" },
  { id: "lockup", label: "Lockup" },
  { id: "descriptors", label: "Descriptor'lar" },
  { id: "colors", label: "Renkler" },
  { id: "measurements", label: "Ölçüm kanıtı" },
] as const;

export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Bölümler" className="hidden lg:block">
      <ul className="flex flex-col gap-0.5 border-l border-border pl-4 text-sm">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                "-ml-[17px] block border-l-2 border-transparent py-1.5 pl-[15px] transition-colors",
                active === s.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={active === s.id ? { borderColor: "hsl(var(--gold))" } : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
