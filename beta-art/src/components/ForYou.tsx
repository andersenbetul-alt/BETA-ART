import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { plates } from "@/data/collection";
import { topSlugs } from "@/lib/affinity";
import { useT } from "@/i18n";

/**
 * USER-side recommendation strip. Reads the on-device affinity list and
 * shows the plates this visitor engaged with most — "what they may want to
 * see or license next". Renders nothing until there is history, and nothing
 * leaves the device (see src/lib/affinity.ts). Pass `exclude` on a plate
 * detail page so the current plate is not recommended back to itself.
 */
export function ForYou({ exclude, heading }: { exclude?: string; heading?: string }) {
  const t = useT();
  // Affinity lives in localStorage, so it is only known after mount — keep
  // SSR/first paint empty to avoid a hydration mismatch.
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(topSlugs(exclude, 4));
  }, [exclude]);

  const items = slugs
    .map((s) => plates.find((p) => p.slug === s))
    .filter((p): p is (typeof plates)[number] => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border" aria-labelledby="foryou-title">
      <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
        <p className="label" id="foryou-title">
          {heading ?? t("ui.foryou.default")}
        </p>
        <ul className="mt-6 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-4">
          {items.map((plate) => (
            <li key={plate.catalogue}>
              <Link to="/plates/$slug" params={{ slug: plate.slug }} className="focus-ring block rounded-sm">
                <div className="plate-frame aspect-4/5">
                  <img
                    src={plate.src}
                    alt={plate.alt}
                    width={1280}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rule-top mt-3 grid grid-cols-[1fr_auto] gap-2 pt-2">
                  <h3 className="display text-base">{plate.title}</h3>
                  <span className="label">{plate.catalogue}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">
          {t("ui.foryou.note")}
        </p>
      </div>
    </section>
  );
}
