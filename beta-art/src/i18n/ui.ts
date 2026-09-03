/**
 * Beta Art — UI chrome dictionaries, aggregated per language.
 * English (ui.en.ts) is canonical; each language mirrors its keys.
 * Merged into the i18n engine alongside HOME and CATALOG.
 */
import { uiEn } from "./ui.en";
import { uiNo } from "./ui.no";
import { uiTr } from "./ui.tr";
import { uiFr } from "./ui.fr";
import { uiDe } from "./ui.de";
import { uiEs } from "./ui.es";
import { uiPt } from "./ui.pt";
import { uiAr } from "./ui.ar";
import { uiJa } from "./ui.ja";
import { uiZh } from "./ui.zh";
import type { HomeDict } from "./home.en";

export const UI: Record<string, HomeDict> = {
  en: uiEn,
  no: uiNo,
  tr: uiTr,
  fr: uiFr,
  de: uiDe,
  es: uiEs,
  pt: uiPt,
  ar: uiAr,
  ja: uiJa,
  zh: uiZh,
};
