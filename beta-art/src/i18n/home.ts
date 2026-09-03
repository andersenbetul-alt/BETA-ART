/**
 * Beta Art — homepage dictionaries, aggregated per language.
 *
 * English is the canonical source (home.en.ts). Each translated language is
 * added here as its file lands; any language not yet present simply falls back
 * to English through the i18n engine, so the page is always coherent.
 */
import { homeEn, type HomeDict } from "./home.en";
import { homeNo } from "./home.no";
import { homeTr } from "./home.tr";
import { homeFr } from "./home.fr";
import { homeDe } from "./home.de";
import { homeEs } from "./home.es";
import { homePt } from "./home.pt";
import { homeAr } from "./home.ar";
import { homeJa } from "./home.ja";
import { homeZh } from "./home.zh";

export const HOME: Record<string, HomeDict> = {
  en: homeEn,
  no: homeNo,
  tr: homeTr,
  fr: homeFr,
  de: homeDe,
  es: homeEs,
  pt: homePt,
  ar: homeAr,
  ja: homeJa,
  zh: homeZh,
};
