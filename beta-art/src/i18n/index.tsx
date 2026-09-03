/**
 * Beta Art — on-device i18n.
 *
 * Same standard as the HXI official site: ten languages, RTL-aware, the
 * visitor's choice kept only in their browser (localStorage `ba-lang`) — it
 * never reaches a server, in line with the privacy stance. SSR renders in
 * English; the client reads the stored/first-preferred language on mount and
 * re-renders, updating <html lang/dir>. Missing keys fall back to English.
 *
 * This is a foundation covering the site chrome (header, footer, trust strip,
 * development notice) and the language switcher. Page bodies are wired key by
 * key on top of it; legal copy is translated only after human review.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { HOME } from "./home";
import { CATALOG } from "./catalog";
import { UI } from "./ui";

export type Dir = "ltr" | "rtl";
export interface Locale {
  code: string;
  name: string;
  native: string;
  dir: Dir;
}

/** Ten languages — the HXI set, so the portfolio speaks one language list. */
export const LOCALES: Locale[] = [
  { code: "en", name: "English", native: "English", dir: "ltr" },
  { code: "no", name: "Norwegian", native: "Norsk", dir: "ltr" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr" },
  { code: "fr", name: "French", native: "Français", dir: "ltr" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr" },
  { code: "zh", name: "Chinese", native: "中文", dir: "ltr" },
];

const FALLBACK = "en";
const STORE_KEY = "ba-lang";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.series": "Series",
  "nav.archive": "Archive",
  "nav.proof": "Proof",
  "nav.passport": "Passport",
  "nav.rights": "Rights",
  "nav.licensing": "Licensing",
  "nav.contact": "Contact",
  "ui.menu": "Menu",
  "ui.close": "Close",
  "ui.language": "Language",
  "site.tagline": "Photography with proof",
  "dev.notice":
    "Development preview — imagery is placeholder material, catalogue records are unverified, and pricing and licence terms are draft until confirmed.",
  "trust.raw.t": "RAW archived",
  "trust.raw.d": "The unedited original is kept on file for every verified plate.",
  "trust.prov.t": "Provenance record",
  "trust.prov.d": "Capture details travel with the plate and are shown, or marked missing.",
  "trust.direct.t": "Direct licence",
  "trust.direct.d": "Terms are issued and signed by the photographer, not a reseller.",
  "trust.invoice.t": "Invoice & certificate",
  "trust.invoice.d": "Placeholder — document templates must be finalised before launch.",
  "footer.blurb":
    "An archive of human photography. RAW originals kept on file, capture records preserved, licences signed by the maker.",
  "footer.navigate": "Navigate",
  "footer.licensing": "Licensing",
  "footer.legal": "Legal & contact",
  "footer.placeholder": "Imagery on this preview is placeholder material",
  "footer.email": "Email",
  "footer.studio": "Studio",
  "legal.privacy": "Privacy Policy",
  "legal.terms": "License Terms",
  "legal.refunds": "Refund & Withdrawal",
  "legal.contact": "Contact",
};

const no: Dict = {
  "nav.series": "Serier",
  "nav.archive": "Arkiv",
  "nav.proof": "Bevis",
  "nav.passport": "Pass",
  "nav.rights": "Rettigheter",
  "nav.licensing": "Lisensiering",
  "nav.contact": "Kontakt",
  "ui.menu": "Meny",
  "ui.close": "Lukk",
  "ui.language": "Språk",
  "site.tagline": "Fotografi med bevis",
  "dev.notice":
    "Forhåndsvisning under utvikling — bildene er plassholdere, katalogpostene er ikke verifisert, og priser og lisensvilkår er utkast inntil de bekreftes.",
  "trust.raw.t": "RAW arkivert",
  "trust.raw.d": "Den ubehandlede originalen oppbevares for hver verifiserte plate.",
  "trust.prov.t": "Opprinnelsesregister",
  "trust.prov.d": "Opptaksdetaljer følger platen og vises, eller merkes som manglende.",
  "trust.direct.t": "Direkte lisens",
  "trust.direct.d": "Vilkårene utstedes og signeres av fotografen, ikke en videreselger.",
  "trust.invoice.t": "Faktura og sertifikat",
  "trust.invoice.d": "Plassholder — dokumentmaler må ferdigstilles før lansering.",
  "footer.blurb":
    "Et arkiv av menneskelig fotografi. RAW-originaler oppbevart, opptaksregistre bevart, lisenser signert av opphavspersonen.",
  "footer.navigate": "Naviger",
  "footer.licensing": "Lisensiering",
  "footer.legal": "Juridisk og kontakt",
  "footer.placeholder": "Bildene i denne forhåndsvisningen er plassholdere",
  "footer.email": "E-post",
  "footer.studio": "Studio",
  "legal.privacy": "Personvernerklæring",
  "legal.terms": "Lisensvilkår",
  "legal.refunds": "Refusjon og angrerett",
  "legal.contact": "Kontakt",
};

const tr: Dict = {
  "nav.series": "Seriler",
  "nav.archive": "Arşiv",
  "nav.proof": "Kanıt",
  "nav.passport": "Pasaport",
  "nav.rights": "Haklar",
  "nav.licensing": "Lisanslama",
  "nav.contact": "İletişim",
  "ui.menu": "Menü",
  "ui.close": "Kapat",
  "ui.language": "Dil",
  "site.tagline": "Kanıtlı fotoğrafçılık",
  "dev.notice":
    "Geliştirme önizlemesi — görseller yer tutucudur, katalog kayıtları doğrulanmadı, fiyat ve lisans koşulları onaylanana dek taslaktır.",
  "trust.raw.t": "RAW arşivlendi",
  "trust.raw.d": "Doğrulanmış her plaka için işlenmemiş orijinal saklanır.",
  "trust.prov.t": "Köken kaydı",
  "trust.prov.d": "Çekim bilgileri plakayla birlikte gelir ve gösterilir ya da eksik işaretlenir.",
  "trust.direct.t": "Doğrudan lisans",
  "trust.direct.d": "Koşullar bir aracı değil, fotoğrafçı tarafından verilir ve imzalanır.",
  "trust.invoice.t": "Fatura ve sertifika",
  "trust.invoice.d": "Yer tutucu — belge şablonları lansmandan önce tamamlanmalı.",
  "footer.blurb":
    "İnsan fotoğrafçılığı arşivi. RAW orijinaller saklanır, çekim kayıtları korunur, lisanslar üretici tarafından imzalanır.",
  "footer.navigate": "Gezin",
  "footer.licensing": "Lisanslama",
  "footer.legal": "Hukuk ve iletişim",
  "footer.placeholder": "Bu önizlemedeki görseller yer tutucudur",
  "footer.email": "E-posta",
  "footer.studio": "Stüdyo",
  "legal.privacy": "Gizlilik Politikası",
  "legal.terms": "Lisans Koşulları",
  "legal.refunds": "İade ve Cayma",
  "legal.contact": "İletişim",
};

const fr: Dict = {
  "nav.series": "Séries",
  "nav.archive": "Archive",
  "nav.proof": "Preuve",
  "nav.passport": "Passeport",
  "nav.rights": "Droits",
  "nav.licensing": "Licences",
  "nav.contact": "Contact",
  "ui.menu": "Menu",
  "ui.close": "Fermer",
  "ui.language": "Langue",
  "site.tagline": "La photographie avec preuve",
  "dev.notice":
    "Aperçu en développement — les images sont provisoires, les fiches du catalogue ne sont pas vérifiées, et les prix et conditions de licence restent provisoires jusqu'à confirmation.",
  "trust.raw.t": "RAW archivé",
  "trust.raw.d": "L'original non retouché est conservé pour chaque plaque vérifiée.",
  "trust.prov.t": "Registre de provenance",
  "trust.prov.d": "Les détails de prise de vue accompagnent la plaque et sont affichés, ou signalés comme manquants.",
  "trust.direct.t": "Licence directe",
  "trust.direct.d": "Les conditions sont émises et signées par le photographe, pas par un revendeur.",
  "trust.invoice.t": "Facture et certificat",
  "trust.invoice.d": "Provisoire — les modèles de documents doivent être finalisés avant le lancement.",
  "footer.blurb":
    "Une archive de photographie humaine. Originaux RAW conservés, registres de prise de vue préservés, licences signées par l'auteur.",
  "footer.navigate": "Naviguer",
  "footer.licensing": "Licences",
  "footer.legal": "Mentions légales et contact",
  "footer.placeholder": "Les images de cet aperçu sont provisoires",
  "footer.email": "E-mail",
  "footer.studio": "Studio",
  "legal.privacy": "Politique de confidentialité",
  "legal.terms": "Conditions de licence",
  "legal.refunds": "Remboursement et rétractation",
  "legal.contact": "Contact",
};

const de: Dict = {
  "nav.series": "Serien",
  "nav.archive": "Archiv",
  "nav.proof": "Nachweis",
  "nav.passport": "Pass",
  "nav.rights": "Rechte",
  "nav.licensing": "Lizenzierung",
  "nav.contact": "Kontakt",
  "ui.menu": "Menü",
  "ui.close": "Schließen",
  "ui.language": "Sprache",
  "site.tagline": "Fotografie mit Nachweis",
  "dev.notice":
    "Entwicklungsvorschau — Bilder sind Platzhalter, Katalogeinträge sind ungeprüft, und Preise sowie Lizenzbedingungen sind bis zur Bestätigung Entwürfe.",
  "trust.raw.t": "RAW archiviert",
  "trust.raw.d": "Das unbearbeitete Original wird für jede verifizierte Platte aufbewahrt.",
  "trust.prov.t": "Herkunftsnachweis",
  "trust.prov.d": "Aufnahmedaten begleiten die Platte und werden angezeigt oder als fehlend markiert.",
  "trust.direct.t": "Direkte Lizenz",
  "trust.direct.d": "Die Bedingungen werden vom Fotografen ausgestellt und signiert, nicht von einem Wiederverkäufer.",
  "trust.invoice.t": "Rechnung und Zertifikat",
  "trust.invoice.d": "Platzhalter — Dokumentvorlagen müssen vor dem Start fertiggestellt werden.",
  "footer.blurb":
    "Ein Archiv menschlicher Fotografie. RAW-Originale aufbewahrt, Aufnahmeregister bewahrt, Lizenzen vom Urheber signiert.",
  "footer.navigate": "Navigieren",
  "footer.licensing": "Lizenzierung",
  "footer.legal": "Rechtliches und Kontakt",
  "footer.placeholder": "Die Bilder in dieser Vorschau sind Platzhalter",
  "footer.email": "E-Mail",
  "footer.studio": "Studio",
  "legal.privacy": "Datenschutzerklärung",
  "legal.terms": "Lizenzbedingungen",
  "legal.refunds": "Rückerstattung und Widerruf",
  "legal.contact": "Kontakt",
};

const es: Dict = {
  "nav.series": "Series",
  "nav.archive": "Archivo",
  "nav.proof": "Prueba",
  "nav.passport": "Pasaporte",
  "nav.rights": "Derechos",
  "nav.licensing": "Licencias",
  "nav.contact": "Contacto",
  "ui.menu": "Menú",
  "ui.close": "Cerrar",
  "ui.language": "Idioma",
  "site.tagline": "Fotografía con prueba",
  "dev.notice":
    "Vista previa en desarrollo — las imágenes son provisionales, las fichas del catálogo no están verificadas, y los precios y condiciones de licencia son un borrador hasta su confirmación.",
  "trust.raw.t": "RAW archivado",
  "trust.raw.d": "El original sin editar se conserva para cada placa verificada.",
  "trust.prov.t": "Registro de procedencia",
  "trust.prov.d": "Los detalles de captura acompañan a la placa y se muestran, o se marcan como ausentes.",
  "trust.direct.t": "Licencia directa",
  "trust.direct.d": "Las condiciones las emite y firma el fotógrafo, no un revendedor.",
  "trust.invoice.t": "Factura y certificado",
  "trust.invoice.d": "Provisional — las plantillas de documentos deben finalizarse antes del lanzamiento.",
  "footer.blurb":
    "Un archivo de fotografía humana. Originales RAW conservados, registros de captura preservados, licencias firmadas por el autor.",
  "footer.navigate": "Navegar",
  "footer.licensing": "Licencias",
  "footer.legal": "Legal y contacto",
  "footer.placeholder": "Las imágenes de esta vista previa son provisionales",
  "footer.email": "Correo",
  "footer.studio": "Estudio",
  "legal.privacy": "Política de privacidad",
  "legal.terms": "Condiciones de licencia",
  "legal.refunds": "Reembolso y desistimiento",
  "legal.contact": "Contacto",
};

const pt: Dict = {
  "nav.series": "Séries",
  "nav.archive": "Arquivo",
  "nav.proof": "Prova",
  "nav.passport": "Passaporte",
  "nav.rights": "Direitos",
  "nav.licensing": "Licenciamento",
  "nav.contact": "Contato",
  "ui.menu": "Menu",
  "ui.close": "Fechar",
  "ui.language": "Idioma",
  "site.tagline": "Fotografia com prova",
  "dev.notice":
    "Prévia em desenvolvimento — as imagens são provisórias, os registros do catálogo não estão verificados, e preços e termos de licença são um rascunho até serem confirmados.",
  "trust.raw.t": "RAW arquivado",
  "trust.raw.d": "O original sem edição é mantido em arquivo para cada placa verificada.",
  "trust.prov.t": "Registro de proveniência",
  "trust.prov.d": "Os detalhes da captura acompanham a placa e são exibidos, ou marcados como ausentes.",
  "trust.direct.t": "Licença direta",
  "trust.direct.d": "Os termos são emitidos e assinados pelo fotógrafo, não por um revendedor.",
  "trust.invoice.t": "Fatura e certificado",
  "trust.invoice.d": "Provisório — os modelos de documento precisam ser finalizados antes do lançamento.",
  "footer.blurb":
    "Um arquivo de fotografia humana. Originais RAW mantidos em arquivo, registros de captura preservados, licenças assinadas pelo autor.",
  "footer.navigate": "Navegar",
  "footer.licensing": "Licenciamento",
  "footer.legal": "Jurídico e contato",
  "footer.placeholder": "As imagens desta prévia são provisórias",
  "footer.email": "E-mail",
  "footer.studio": "Estúdio",
  "legal.privacy": "Política de Privacidade",
  "legal.terms": "Termos de Licença",
  "legal.refunds": "Reembolso e Devolução",
  "legal.contact": "Contato",
};

const ar: Dict = {
  "nav.series": "السلاسل",
  "nav.archive": "الأرشيف",
  "nav.proof": "الإثبات",
  "nav.passport": "الجواز",
  "nav.rights": "الحقوق",
  "nav.licensing": "الترخيص",
  "nav.contact": "اتصل",
  "ui.menu": "القائمة",
  "ui.close": "إغلاق",
  "ui.language": "اللغة",
  "site.tagline": "تصوير موثّق بالإثبات",
  "dev.notice":
    "معاينة قيد التطوير — الصور مؤقتة، وسجلات الكتالوج غير موثّقة، والأسعار وشروط الترخيص مسودّة حتى تأكيدها.",
  "trust.raw.t": "أرشفة RAW",
  "trust.raw.d": "يُحفظ الأصل غير المعدّل لكل لوحة موثّقة.",
  "trust.prov.t": "سجل المصدر",
  "trust.prov.d": "تُرافق تفاصيل الالتقاط اللوحة وتُعرض، أو تُوسم بأنها مفقودة.",
  "trust.direct.t": "ترخيص مباشر",
  "trust.direct.d": "تصدر الشروط ويوقّعها المصوّر نفسه، لا وسيط بيع.",
  "trust.invoice.t": "فاتورة وشهادة",
  "trust.invoice.d": "عنصر مؤقت — يجب إنهاء قوالب المستندات قبل الإطلاق.",
  "footer.blurb":
    "أرشيف للتصوير البشري. أصول RAW محفوظة، وسجلات الالتقاط مصونة، وتراخيص موقّعة من صاحب العمل.",
  "footer.navigate": "تصفّح",
  "footer.licensing": "الترخيص",
  "footer.legal": "الشؤون القانونية والتواصل",
  "footer.placeholder": "الصور في هذه المعاينة مؤقتة",
  "footer.email": "البريد الإلكتروني",
  "footer.studio": "الاستوديو",
  "legal.privacy": "سياسة الخصوصية",
  "legal.terms": "شروط الترخيص",
  "legal.refunds": "الاسترداد وحق الانسحاب",
  "legal.contact": "اتصل",
};

const ja: Dict = {
  "nav.series": "シリーズ",
  "nav.archive": "アーカイブ",
  "nav.proof": "証明",
  "nav.passport": "パスポート",
  "nav.rights": "権利",
  "nav.licensing": "ライセンス",
  "nav.contact": "お問い合わせ",
  "ui.menu": "メニュー",
  "ui.close": "閉じる",
  "ui.language": "言語",
  "site.tagline": "証明のある写真",
  "dev.notice":
    "開発プレビュー — 画像は仮のもので、カタログ記録は未検証、価格とライセンス条件は確定まで暫定です。",
  "trust.raw.t": "RAW を保管",
  "trust.raw.d": "検証済みの各プレートについて、未編集のオリジナルを保管します。",
  "trust.prov.t": "来歴記録",
  "trust.prov.d": "撮影情報はプレートとともに保持され、表示されるか、欠落として記されます。",
  "trust.direct.t": "直接ライセンス",
  "trust.direct.d": "条件は再販業者ではなく写真家自身が発行し署名します。",
  "trust.invoice.t": "請求書と証明書",
  "trust.invoice.d": "仮の要素 — 文書テンプレートは公開前に確定する必要があります。",
  "footer.blurb":
    "人の手による写真のアーカイブ。RAW オリジナルを保管し、撮影記録を保存し、ライセンスは制作者が署名します。",
  "footer.navigate": "ナビゲーション",
  "footer.licensing": "ライセンス",
  "footer.legal": "法務とお問い合わせ",
  "footer.placeholder": "このプレビューの画像は仮のものです",
  "footer.email": "メール",
  "footer.studio": "スタジオ",
  "legal.privacy": "プライバシーポリシー",
  "legal.terms": "ライセンス条件",
  "legal.refunds": "返金と撤回",
  "legal.contact": "お問い合わせ",
};

const zh: Dict = {
  "nav.series": "系列",
  "nav.archive": "档案",
  "nav.proof": "凭证",
  "nav.passport": "护照",
  "nav.rights": "权利",
  "nav.licensing": "授权",
  "nav.contact": "联系",
  "ui.menu": "菜单",
  "ui.close": "关闭",
  "ui.language": "语言",
  "site.tagline": "有凭证的摄影",
  "dev.notice":
    "开发预览 — 图片为占位素材，目录记录尚未核验，价格与授权条款在确认前均为草稿。",
  "trust.raw.t": "已存档 RAW",
  "trust.raw.d": "每张经核验的作品都会保存未经修饰的原始文件。",
  "trust.prov.t": "来源记录",
  "trust.prov.d": "拍摄信息随作品一同保留并展示，或标注为缺失。",
  "trust.direct.t": "直接授权",
  "trust.direct.d": "条款由摄影师本人签发并签署，而非经销商。",
  "trust.invoice.t": "发票与证书",
  "trust.invoice.d": "占位内容 — 文档模板需在上线前定稿。",
  "footer.blurb":
    "人类摄影的档案库。保存 RAW 原始文件，保留拍摄记录，授权由创作者签署。",
  "footer.navigate": "导航",
  "footer.licensing": "授权",
  "footer.legal": "法律与联系",
  "footer.placeholder": "此预览中的图片为占位素材",
  "footer.email": "邮箱",
  "footer.studio": "工作室",
  "legal.privacy": "隐私政策",
  "legal.terms": "授权条款",
  "legal.refunds": "退款与撤回",
  "legal.contact": "联系",
};

const DICT: Record<string, Dict> = { en, no, tr, fr, de, es, pt, ar, ja, zh };

// Merge the homepage dictionaries (src/i18n/home.*.ts) into the chrome dicts so
// every string is reachable through the same t() lookup.
for (const code of Object.keys(DICT)) {
  if (HOME[code]) Object.assign(DICT[code], HOME[code]);
  if (CATALOG[code]) Object.assign(DICT[code], CATALOG[code]);
  if (UI[code]) Object.assign(DICT[code], UI[code]);
}

function normalize(code: string | undefined | null): string {
  if (!code) return FALLBACK;
  const base = code.toLowerCase().split("-")[0];
  return DICT[base] ? base : FALLBACK;
}

function detect(): string {
  if (typeof window === "undefined") return FALLBACK;
  try {
    const saved = window.localStorage.getItem(STORE_KEY);
    if (saved && DICT[saved]) return saved;
  } catch {
    /* private mode — fall through to navigator */
  }
  const langs = (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
  for (const l of langs) {
    const n = normalize(l);
    if (n !== FALLBACK || (l && l.toLowerCase().startsWith("en"))) return n;
  }
  return FALLBACK;
}

interface Ctx {
  lang: string;
  dir: Dir;
  setLang: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR and first client render both start at the fallback so hydration matches.
  const [lang, setLangState] = useState<string>(FALLBACK);

  useEffect(() => {
    const initial = detect();
    if (initial !== lang) setLangState(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const info = LOCALES.find((l) => l.code === lang) || LOCALES[0];

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = info.code;
    document.documentElement.dir = info.dir;
  }, [info.code, info.dir]);

  const value = useMemo<Ctx>(() => {
    const setLang = (code: string) => {
      const n = normalize(code);
      setLangState(n);
      try {
        window.localStorage.setItem(STORE_KEY, n);
      } catch {
        /* private mode — choice simply won't persist */
      }
    };
    const table = DICT[lang] || DICT[FALLBACK];
    const t = (key: string) => table[key] ?? DICT[FALLBACK][key] ?? key;
    return { lang, dir: info.dir, setLang, t };
  }, [lang, info.dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe default if a component renders outside the provider (e.g. isolated tests).
    const t = (key: string) => DICT[FALLBACK][key] ?? key;
    return { lang: FALLBACK, dir: "ltr", setLang: () => {}, t };
  }
  return ctx;
}

/** Convenience: just the translate function. */
export function useT(): (key: string) => string {
  return useI18n().t;
}

/** Native <select> language switcher — accessible, no extra dependency. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label className={className}>
      <span className="sr-only">{t("ui.language")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label={t("ui.language")}
        className="label rounded-sm border border-border bg-background px-2 py-1 text-foreground focus-ring"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
