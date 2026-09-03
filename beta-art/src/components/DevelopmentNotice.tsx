/**
 * Development preview notice.
 * REMOVE (or set siteConfig.showDevelopmentNotice to false) once every
 * placeholder photograph has been replaced with a verified original and
 * pricing/licence terms are confirmed.
 */
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n";

export function DevelopmentNotice() {
  const t = useT();
  if (!siteConfig.showDevelopmentNotice) return null;

  return (
    <div className="border-b border-border bg-secondary">
      <p className="label mx-auto max-w-[92rem] px-5 py-2 leading-relaxed text-foreground sm:px-8">
        {t("dev.notice")}
      </p>
    </div>
  );
}
