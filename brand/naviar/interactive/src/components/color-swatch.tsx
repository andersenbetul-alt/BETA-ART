import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ColorSwatch({
  name,
  hex,
  note,
}: {
  name: string;
  hex: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // pano erişimi engellenmiş olabilir — sessizce yut, buton yine de basılabilir kalır.
    }
  }

  return (
    <button
      onClick={copy}
      className="group flex flex-col gap-2.5 rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-foreground/30"
      aria-label={`${name}, ${hex}. Kopyalamak için tıklayın.`}
    >
      <span
        className="block h-14 w-full rounded-sm ring-1 ring-inset ring-black/10"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="flex items-center justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="font-data block text-xs text-muted-foreground">{hex}</span>
        </span>
        <span className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </span>
      </span>
      {note && <span className="text-xs leading-snug text-muted-foreground">{note}</span>}
    </button>
  );
}
