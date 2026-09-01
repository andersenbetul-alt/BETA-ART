/**
 * Development preview notice.
 * REMOVE (or set siteConfig.showDevelopmentNotice to false) once every
 * placeholder photograph has been replaced with a verified original and
 * pricing/licence terms are confirmed.
 */
import { siteConfig } from "@/config/site";

export function DevelopmentNotice() {
  if (!siteConfig.showDevelopmentNotice) return null;

  return (
    <div className="border-b border-border bg-secondary">
      <p className="label mx-auto max-w-[92rem] px-5 py-2 leading-relaxed text-foreground sm:px-8">
        Development preview — imagery is placeholder material, catalogue records are unverified, and
        pricing and licence terms are draft until confirmed.
      </p>
    </div>
  );
}
