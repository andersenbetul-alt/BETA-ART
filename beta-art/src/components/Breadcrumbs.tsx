import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useT();
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="label flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="focus-ring rounded-sm hover:text-foreground">
            {t("ui.crumb.home")}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="focus-ring rounded-sm hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
