import { useId, useState } from "react";
import { licenses, plates, type Plate } from "@/data/collection";

/**
 * LAUNCH CHECKLIST — this form is FRONT-END ONLY.
 * Nothing is sent anywhere. Connect a submission backend (and confirm the
 * delivery/notification path) before production. Do not claim an email was
 * sent until this is wired.
 */

type Fields = {
  plate: string;
  license: string;
  name: string;
  email: string;
  company: string;
  intendedUse: string;
  territory: string;
  duration: string;
  notes: string;
};

const empty: Fields = {
  plate: "",
  license: "",
  name: "",
  email: "",
  company: "",
  intendedUse: "",
  territory: "",
  duration: "",
  notes: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (!values.plate) errors.plate = "Select a plate.";
  if (!values.license) errors.license = "Select a licence type.";
  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.trim().length > 100) errors.name = "Name must be under 100 characters.";
  const email = values.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 255)
    errors.email = "Enter a valid email address.";
  if (values.company.length > 120) errors.company = "Company must be under 120 characters.";
  if (!values.intendedUse.trim()) errors.intendedUse = "Describe how the image will be used.";
  else if (values.intendedUse.trim().length > 1000)
    errors.intendedUse = "Intended use must be under 1000 characters.";
  if (values.notes.length > 1000) errors.notes = "Notes must be under 1000 characters.";
  return errors;
}

const fieldClass =
  "focus-ring mt-2 w-full border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";

export function LicenseRequestForm({
  plate,
  defaultLicense,
  id = "request",
}: {
  plate?: Plate;
  defaultLicense?: string;
  id?: string;
}) {
  const uid = useId();
  const [values, setValues] = useState<Fields>({
    ...empty,
    plate: plate?.catalogue ?? "",
    license: defaultLicense ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO (LAUNCH): send `values` to a real backend. Nothing is transmitted today.
      setSubmitted(true);
    }
  };

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="mt-2 text-xs text-destructive">
        {errors[key]}
      </p>
    ) : null;

  const aria = (key: keyof Fields) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  if (submitted) {
    return (
      <div id={id} className="border border-border p-6 sm:p-8" role="status" aria-live="polite">
        <p className="label">Request recorded in this browser</p>
        <h3 className="display mt-3 text-2xl">Your request has been prepared</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Nothing has been sent yet. This site has no submission backend connected, so the details
          you entered stay in this browser session only. Sending and delivery must be connected
          before launch.
        </p>
        <dl className="rule-top mt-6 grid gap-3 pt-6 text-sm">
          <div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">Plate</dt>
            <dd>{values.plate}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-4">
            <dt className="label">Licence</dt>
            <dd className="capitalize">{values.license}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setValues({ ...empty, plate: plate?.catalogue ?? "", license: defaultLicense ?? "" });
            setSubmitted(false);
          }}
          className="btn-outline-ink focus-ring mt-8"
        >
          Start another request
        </button>
      </div>
    );
  }

  return (
    <form id={id} noValidate onSubmit={onSubmit} className="border border-border p-6 sm:p-8">
      <p className="label">Licence request</p>
      <h3 className="display mt-3 text-2xl">Request terms for a plate</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Front-end only for now — submission and delivery integration must be connected before
        launch. Nothing you enter here is transmitted or stored.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-plate`} className="label text-foreground">
            Plate <span aria-hidden="true">*</span>
          </label>
          <select id={`${uid}-plate`} value={values.plate} onChange={set("plate")} required {...aria("plate")} className={fieldClass}>
            <option value="">Select a plate</option>
            {plates.map((p) => (
              <option key={p.catalogue} value={p.catalogue}>
                {p.catalogue} — {p.title}
              </option>
            ))}
          </select>
          {err("plate")}
        </div>

        <div>
          <label htmlFor={`${uid}-license`} className="label text-foreground">
            Licence type <span aria-hidden="true">*</span>
          </label>
          <select id={`${uid}-license`} value={values.license} onChange={set("license")} required {...aria("license")} className={fieldClass}>
            <option value="">Select a licence</option>
            {licenses.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          {err("license")}
        </div>

        <div>
          <label htmlFor={`${uid}-name`} className="label text-foreground">
            Name <span aria-hidden="true">*</span>
          </label>
          <input id={`${uid}-name`} value={values.name} onChange={set("name")} maxLength={100} required {...aria("name")} className={fieldClass} />
          {err("name")}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="label text-foreground">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id={`${uid}-email`} type="email" value={values.email} onChange={set("email")} maxLength={255} required {...aria("email")} className={fieldClass} />
          {err("email")}
        </div>

        <div>
          <label htmlFor={`${uid}-company`} className="label text-foreground">
            Company <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id={`${uid}-company`} value={values.company} onChange={set("company")} maxLength={120} {...aria("company")} className={fieldClass} />
          {err("company")}
        </div>

        <div>
          <label htmlFor={`${uid}-territory`} className="label text-foreground">
            Territory <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id={`${uid}-territory`} value={values.territory} onChange={set("territory")} maxLength={120} className={fieldClass} />
        </div>

        <div>
          <label htmlFor={`${uid}-duration`} className="label text-foreground">
            Duration <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id={`${uid}-duration`} value={values.duration} onChange={set("duration")} maxLength={120} className={fieldClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-use`} className="label text-foreground">
            Intended use <span aria-hidden="true">*</span>
          </label>
          <textarea id={`${uid}-use`} value={values.intendedUse} onChange={set("intendedUse")} rows={4} maxLength={1000} required {...aria("intendedUse")} className={fieldClass} />
          {err("intendedUse")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-notes`} className="label text-foreground">
            Notes <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea id={`${uid}-notes`} value={values.notes} onChange={set("notes")} rows={3} maxLength={1000} {...aria("notes")} className={fieldClass} />
          {err("notes")}
        </div>
      </div>

      <button type="submit" className="btn-ink focus-ring mt-8">
        Prepare request
      </button>
    </form>
  );
}
