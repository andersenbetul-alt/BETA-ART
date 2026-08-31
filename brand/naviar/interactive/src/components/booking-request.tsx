import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/config";

// İstek + insan onayı deseni — naerhjelp-pilot-v2'deki "Dette er ikke en
// direkte booking" ilkesiyle aynı, NAVIAR Risk Gate'in "otomatik karar yok"
// kuralıyla tutarlı: form bir randevuyu KESİNLEŞTİRMEZ, yalnız istek
// oluşturur; onay bir insan tarafından e-posta/telefonla verilir. Backend
// yok — QBLOGG/naerhjelp-pilot-v2'deki composeMail/sendRequest deseniyle
// aynı: mailto: taslağı üretir.
export function BookingRequest() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = "NAVIAR Consult — forespørsel om samtale";
    const body = [
      `Navn: ${data.get("navn")}`,
      `E-post: ${data.get("epost")}`,
      `Virksomhet: ${data.get("virksomhet")}`,
      `Ønsket tidsvindu: ${data.get("tidsvindu")}`,
      `Melding: ${data.get("melding")}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="max-w-[520px]">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Dette er ikke en direkte booking. Vi bekrefter tid per e-post eller
        telefon etter en kort behovsavklaring.{" "}
        <em>
          English: this is a request, not a confirmed booking — we follow up
          by email or phone before any meeting is set.
        </em>
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="navn" className="text-sm font-medium">
            Navn
          </label>
          <input
            id="navn"
            name="navn"
            type="text"
            required
            autoComplete="name"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="epost" className="text-sm font-medium">
            E-post
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            required
            autoComplete="email"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="virksomhet" className="text-sm font-medium">
            Virksomhet
          </label>
          <input
            id="virksomhet"
            name="virksomhet"
            type="text"
            required
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="tidsvindu" className="text-sm font-medium">
            Ønsket tidsvindu
          </label>
          <input
            id="tidsvindu"
            name="tidsvindu"
            type="text"
            placeholder="f.eks. tirsdag/onsdag ettermiddag"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="melding" className="text-sm font-medium">
            Melding (valgfritt)
          </label>
          <textarea
            id="melding"
            name="melding"
            rows={3}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div>
          <Button type="submit">Send forespørsel</Button>
          {sent && (
            <p className="mt-2 text-sm text-muted-foreground">
              E-postklienten din åpnes med utkastet — send den for å fullføre
              forespørselen.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
