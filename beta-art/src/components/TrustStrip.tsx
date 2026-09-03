import { useT } from "@/i18n";

const items = [
  { term: "trust.raw.t", detail: "trust.raw.d" },
  { term: "trust.prov.t", detail: "trust.prov.d" },
  { term: "trust.direct.t", detail: "trust.direct.d" },
  { term: "trust.invoice.t", detail: "trust.invoice.d" },
];

export function TrustStrip() {
  const t = useT();
  return (
    <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.term} className="bg-background p-6">
          <p className="label text-foreground">{t(item.term)}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.detail)}</p>
        </li>
      ))}
    </ul>
  );
}
