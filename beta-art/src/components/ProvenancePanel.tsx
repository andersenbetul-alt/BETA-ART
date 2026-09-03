import type { Plate } from "@/data/collection";
import { useT } from "@/i18n";
import { VAL_KEY } from "@/i18n/cat";

/**
 * Provenance panel.
 * Never displays a fabricated value: unknown fields render exactly what the
 * data file holds ("To be supplied" / "Not provided"), translated via VAL_KEY.
 * Catalogue ids are never translated.
 */
export function ProvenancePanel({ plate }: { plate: Plate }) {
  const t = useT();
  const val = (v: string) => t(VAL_KEY[v] ?? v);
  const rows: { term: string; detail: string }[] = [
    { term: "ui.prov.r.status", detail: val(plate.verification.status) },
    { term: "ui.prov.r.raw", detail: val(plate.verification.rawArchived) },
    { term: "ui.prov.r.capture", detail: val(plate.verification.captureRecord) },
    { term: "ui.prov.r.signed", detail: val(plate.verification.signedLicense) },
    { term: "ui.prov.r.cat", detail: plate.catalogue },
    { term: "ui.prov.r.c2pa", detail: val(plate.capture.c2pa) },
  ];

  return (
    <section aria-labelledby={`provenance-${plate.slug}`} className="border border-border p-6 sm:p-8">
      <p className="label">{t("ui.prov.label")}</p>
      <h2 id={`provenance-${plate.slug}`} className="display mt-3 text-2xl">
        {t("ui.prov.heading")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {t("ui.prov.intro")}
      </p>

      <dl className="rule-top mt-6 grid gap-4 pt-6">
        {rows.map((row) => (
          <div key={row.term} className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">{t(row.term)}</dt>
            <dd className="text-sm text-foreground">{row.detail}</dd>
          </div>
        ))}
      </dl>

      <p className="rule-top mt-6 pt-6 text-sm leading-relaxed text-muted-foreground">
        {t("ui.prov.footer")}
      </p>
    </section>
  );
}

export function CaptureTable({ plate }: { plate: Plate }) {
  const t = useT();
  const val = (v: string) => t(VAL_KEY[v] ?? v);
  const rows = [
    { term: "ui.cap.date", detail: val(plate.capture.date) },
    { term: "ui.cap.location", detail: val(plate.capture.location) },
    { term: "ui.cap.camera", detail: val(plate.capture.camera) },
    { term: "ui.cap.lens", detail: val(plate.capture.lens) },
    { term: "ui.cap.exposure", detail: val(plate.capture.exposure) },
  ];

  return (
    <section aria-labelledby={`capture-${plate.slug}`}>
      <h2 id={`capture-${plate.slug}`} className="display text-2xl">
        {t("ui.cap.heading")}
      </h2>
      <dl className="rule-top mt-6 grid gap-4 pt-6">
        {rows.map((row) => (
          <div key={row.term} className="grid gap-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">{t(row.term)}</dt>
            <dd className="text-sm text-foreground">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
