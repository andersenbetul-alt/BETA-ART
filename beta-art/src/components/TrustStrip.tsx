const items = [
  { term: "RAW archived", detail: "The unedited original is kept on file for every verified plate." },
  { term: "Provenance record", detail: "Capture details travel with the plate and are shown, or marked missing." },
  { term: "Direct licence", detail: "Terms are issued and signed by the photographer, not a reseller." },
  { term: "Invoice & certificate", detail: "Placeholder — document templates must be finalised before launch." },
];

export function TrustStrip() {
  return (
    <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.term} className="bg-background p-6">
          <p className="label text-foreground">{item.term}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
