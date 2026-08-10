/**
 * Development preview badge.
 * REMOVE (or set siteConfig.showDevelopmentNotice to false) once every
 * placeholder photograph has been replaced with a verified original.
 */
import { siteConfig } from "@/config/site";

export function DevelopmentNotice() {
  if (!siteConfig.showDevelopmentNotice) return null;

  return (
    <div className="border-b border-border bg-secondary">
      <p className="label mx-auto max-w-[92rem] px-5 py-2 text-foreground sm:px-8">
        Development preview — placeholder imagery. Replace with verified originals before launch.
      </p>
    </div>
  );
}
