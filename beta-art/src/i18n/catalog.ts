/**
 * Beta Art — catalogue dictionaries, aggregated per language.
 * English (catalog.en.ts) is canonical; each language mirrors its keys.
 * Merged into the i18n engine alongside HOME.
 */
import { catalogEn } from "./catalog.en";
import { catalogNo } from "./catalog.no";
import { catalogTr } from "./catalog.tr";
import { catalogFr } from "./catalog.fr";
import { catalogDe } from "./catalog.de";
import { catalogEs } from "./catalog.es";
import { catalogPt } from "./catalog.pt";
import { catalogAr } from "./catalog.ar";
import { catalogJa } from "./catalog.ja";
import { catalogZh } from "./catalog.zh";
import type { HomeDict } from "./home.en";

export const CATALOG: Record<string, HomeDict> = {
  en: catalogEn,
  no: catalogNo,
  tr: catalogTr,
  fr: catalogFr,
  de: catalogDe,
  es: catalogEs,
  pt: catalogPt,
  ar: catalogAr,
  ja: catalogJa,
  zh: catalogZh,
};
