import type { Plate } from "@/data/collection";

/**
 * Provenance panel.
 * Never displays a fabricated value: unknown fields render exactly what the
 * data file holds ("To be supplied" / "Not provided").
 */
export function ProvenancePanel({ plate }: { plate: Plate }) {
  const rows: { term: string; detail: string }[] = [
    { term: "Verification status", detail: plate.verification.status },
    { term: "RAW original archived", detail: plate.verification.rawArchived },
    { term: "Capture record preserved", detail: plate.verification.captureRecord },
    { term: "Photographer-signed licence", detail: plate.verification.signedLicense },
    { term: "Catalogue number", detail: plate.catalogue },
    { term: "C2PA content credentials", detail: plate.capture.c2pa },
  ];

  return (
    <section aria-labelledby={`provenance-${plate.slug}`} className="border border-border p-6 sm:p-8">
      <p className="label">Provenance</p>
      <h2 id={`provenance-${plate.slug}`} className="display mt-3 text-2xl">
        Verification record
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        This record is not yet verified. A plate is only described as Human Verified once the RAW
        original and the capture record are on file.
      </p>

      <dl className="rule-top mt-6 grid gap-4 pt-6">
        {rows.map((row) => (
          <div key={row.term} className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">{row.term}</dt>
            <dd className="text-sm text-foreground">{row.detail}</dd>
          </div>
        ))}
      </dl>

      <p className="rule-top mt-6 pt-6 text-sm leading-relaxed text-muted-foreground">
        Provenance documentation can be requested before licensing. Ask for the catalogue number and
        you receive whatever record exists for that file.
      </p>
    </section>
  );
}

export function CaptureTable({ plate }: { plate: Plate }) {
  const rows = [
    { term: "Capture date", detail: plate.capture.date },
    { term: "Location", detail: plate.capture.location },
    { term: "Camera", detail: plate.capture.camera },
    { term: "Lens", detail: plate.capture.lens },
    { term: "Exposure", detail: plate.capture.exposure },
  ];

  return (
    <section aria-labelledby={`capture-${plate.slug}`}>
      <h2 id={`capture-${plate.slug}`} className="display text-2xl">
        Capture metadata
      </h2>
      <dl className="rule-top mt-6 grid gap-4 pt-6">
        {rows.map((row) => (
          <div key={row.term} className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">{row.term}</dt>
            <dd className="text-sm text-foreground">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
