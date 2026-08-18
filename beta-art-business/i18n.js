/* ============================================================
   BETA ART — language switcher
   Twelve languages: English, Norsk bokmål, Türkçe, Español,
   Français, Deutsch, Português, Русский, العربية, 中文, 日本語, हिन्दी.
   Elements opt in with data-i18n="key"; attributes with
   data-i18n-attr="placeholder:key". Arabic switches to RTL.
   ============================================================ */
(function () {
  "use strict";

  var LANGS = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "no", label: "Norsk", dir: "ltr" },
    { code: "tr", label: "Türkçe", dir: "ltr" },
    { code: "es", label: "Español", dir: "ltr" },
    { code: "fr", label: "Français", dir: "ltr" },
    { code: "de", label: "Deutsch", dir: "ltr" },
    { code: "pt", label: "Português", dir: "ltr" },
    { code: "ru", label: "Русский", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "zh", label: "中文", dir: "ltr" },
    { code: "ja", label: "日本語", dir: "ltr" },
    { code: "hi", label: "हिन्दी", dir: "ltr" }
  ];

  var T = {
    en: {
      "nav.archive": "Archive", "nav.verification": "Verification", "nav.categories": "Categories",
      "nav.licensing": "Licensing", "nav.photographer": "Photographer", "nav.contact": "Contact",
      "brand.sub": "Verified Human Photography",
      "notice": "Development preview — imagery is placeholder material, catalogue records are unverified, and pricing and licence terms are draft until confirmed.",
      "hero.eyebrow": "Norway's verified visual archive",
      "hero.title": "Made by a human.",
      "hero.title.em": "Verified at the source.",
      "hero.lead": "Every work in this archive was captured by a person with a physical camera. The RAW original is kept, the capture record travels with the file, and the licence is signed by the photographer. No agency in between, no generated imagery.",
      "hero.cta1": "Enter the archive", "hero.cta2": "How verification works",
      "verification.eyebrow": "Verification",
      "verification.title": "Three tests. A work enters the archive only if it passes all of them.",
      "archive.eyebrow": "The archive", "archive.title": "Launch plates",
      "categories.eyebrow": "Category directory", "categories.title": "35 categories, five sections",
      "licensing.eyebrow": "Licensing", "licensing.title": "Four ways to license a plate",
      "contact.eyebrow": "Contact", "contact.title": "Request a licence or commission a plate",
      "cta.request": "Request licence", "cta.download": "Download preview", "cta.quote": "Add to quote",
      "legal.copyright": "© 2026 Beta Art. All rights reserved. Every plate, catalogue record, accession label and page design is the property of Beta Art.",
      "legal.link": "Copyright, IP & licence terms",
      "lang.label": "Language"
    },
    no: {
      "nav.archive": "Arkiv", "nav.verification": "Verifisering", "nav.categories": "Kategorier",
      "nav.licensing": "Lisensiering", "nav.photographer": "Fotografen", "nav.contact": "Kontakt",
      "brand.sub": "Verifisert menneskelig fotografi",
      "notice": "Utviklingsversjon — bildene er plassholdere, katalogpostene er ikke verifisert, og priser og lisensvilkår er utkast inntil de bekreftes.",
      "hero.eyebrow": "Norges verifiserte visuelle arkiv",
      "hero.title": "Laget av et menneske.",
      "hero.title.em": "Verifisert ved kilden.",
      "hero.lead": "Hvert verk i arkivet er tatt av en person med et fysisk kamera. RAW-originalen beholdes, opptaksjournalen følger filen, og lisensen signeres av fotografen. Ingen mellomledd, ingen generert bildebruk.",
      "hero.cta1": "Gå inn i arkivet", "hero.cta2": "Slik verifiserer vi",
      "verification.eyebrow": "Verifisering",
      "verification.title": "Tre tester. Et verk kommer inn i arkivet bare hvis det består alle.",
      "archive.eyebrow": "Arkivet", "archive.title": "Plater ved lansering",
      "categories.eyebrow": "Kategorikatalog", "categories.title": "35 kategorier, fem seksjoner",
      "licensing.eyebrow": "Lisensiering", "licensing.title": "Fire måter å lisensiere en plate på",
      "contact.eyebrow": "Kontakt", "contact.title": "Be om lisens eller bestill et oppdrag",
      "cta.request": "Be om lisens", "cta.download": "Last ned forhåndsvisning", "cta.quote": "Legg til i tilbud",
      "legal.copyright": "© 2026 Beta Art. Alle rettigheter reservert. Hver plate, katalogpost, aksesjonsetikett og sidedesign tilhører Beta Art.",
      "legal.link": "Opphavsrett, IP og lisensvilkår",
      "lang.label": "Språk"
    },
    tr: {
      "nav.archive": "Arşiv", "nav.verification": "Doğrulama", "nav.categories": "Kategoriler",
      "nav.licensing": "Lisanslama", "nav.photographer": "Fotoğrafçı", "nav.contact": "İletişim",
      "brand.sub": "Doğrulanmış İnsan Fotoğrafı",
      "notice": "Geliştirme önizlemesi — görseller yer tutucudur, katalog kayıtları doğrulanmamıştır, fiyat ve lisans koşulları onaylanana kadar taslaktır.",
      "hero.eyebrow": "Norveç'in doğrulanmış görsel arşivi",
      "hero.title": "Bir insan tarafından çekildi.",
      "hero.title.em": "Kaynağında doğrulandı.",
      "hero.lead": "Bu arşivdeki her eser, fiziksel bir kamerayla bir kişi tarafından çekildi. RAW orijinal saklanır, çekim kaydı dosyayla birlikte gider ve lisans fotoğrafçı tarafından imzalanır. Aracı yok, üretilmiş görsel yok.",
      "hero.cta1": "Arşive gir", "hero.cta2": "Doğrulama nasıl işler",
      "verification.eyebrow": "Doğrulama",
      "verification.title": "Üç test. Bir eser ancak üçünü de geçerse arşive girer.",
      "archive.eyebrow": "Arşiv", "archive.title": "Lansman plakaları",
      "categories.eyebrow": "Kategori dizini", "categories.title": "35 kategori, beş bölüm",
      "licensing.eyebrow": "Lisanslama", "licensing.title": "Bir plakayı lisanslamanın dört yolu",
      "contact.eyebrow": "İletişim", "contact.title": "Lisans isteyin veya çekim sipariş edin",
      "cta.request": "Lisans talep et", "cta.download": "Önizlemeyi indir", "cta.quote": "Teklife ekle",
      "legal.copyright": "© 2026 Beta Art. Tüm hakları saklıdır. Her plaka, katalog kaydı, akesyon etiketi ve sayfa tasarımı Beta Art'a aittir.",
      "legal.link": "Telif hakkı, fikrî mülkiyet ve lisans koşulları",
      "lang.label": "Dil"
    },
    es: {
      "nav.archive": "Archivo", "nav.verification": "Verificación", "nav.categories": "Categorías",
      "nav.licensing": "Licencias", "nav.photographer": "Fotógrafo", "nav.contact": "Contacto",
      "brand.sub": "Fotografía humana verificada",
      "notice": "Vista previa de desarrollo — las imágenes son marcadores de posición y los precios son provisionales.",
      "hero.eyebrow": "El archivo visual verificado de Noruega",
      "hero.title": "Hecho por una persona.", "hero.title.em": "Verificado en el origen.",
      "hero.lead": "Cada obra del archivo fue capturada por una persona con una cámara física. El original RAW se conserva, el registro de captura acompaña al archivo y la licencia la firma el fotógrafo.",
      "hero.cta1": "Entrar al archivo", "hero.cta2": "Cómo funciona la verificación",
      "verification.eyebrow": "Verificación", "verification.title": "Tres pruebas. Una obra entra solo si las supera todas.",
      "archive.eyebrow": "El archivo", "archive.title": "Placas de lanzamiento",
      "categories.eyebrow": "Directorio de categorías", "categories.title": "35 categorías, cinco secciones",
      "licensing.eyebrow": "Licencias", "licensing.title": "Cuatro formas de licenciar una placa",
      "contact.eyebrow": "Contacto", "contact.title": "Solicite una licencia o un encargo",
      "cta.request": "Solicitar licencia", "cta.download": "Descargar vista previa", "cta.quote": "Añadir al presupuesto",
      "legal.copyright": "© 2026 Beta Art. Todos los derechos reservados. Cada placa, registro y diseño pertenece a Beta Art.",
      "legal.link": "Derechos de autor, PI y licencias", "lang.label": "Idioma"
    },
    fr: {
      "nav.archive": "Archives", "nav.verification": "Vérification", "nav.categories": "Catégories",
      "nav.licensing": "Licences", "nav.photographer": "Photographe", "nav.contact": "Contact",
      "brand.sub": "Photographie humaine vérifiée",
      "notice": "Aperçu de développement — images provisoires, tarifs et conditions à confirmer.",
      "hero.eyebrow": "Les archives visuelles vérifiées de Norvège",
      "hero.title": "Fait par un humain.", "hero.title.em": "Vérifié à la source.",
      "hero.lead": "Chaque œuvre a été prise par une personne avec un appareil photo. Le fichier RAW est conservé, la fiche de prise de vue accompagne l'image et la licence est signée par le photographe.",
      "hero.cta1": "Entrer dans les archives", "hero.cta2": "Comment fonctionne la vérification",
      "verification.eyebrow": "Vérification", "verification.title": "Trois tests. Une œuvre n'entre que si elle les réussit tous.",
      "archive.eyebrow": "Les archives", "archive.title": "Planches de lancement",
      "categories.eyebrow": "Répertoire des catégories", "categories.title": "35 catégories, cinq sections",
      "licensing.eyebrow": "Licences", "licensing.title": "Quatre façons de licencier une planche",
      "contact.eyebrow": "Contact", "contact.title": "Demander une licence ou une commande",
      "cta.request": "Demander une licence", "cta.download": "Télécharger l'aperçu", "cta.quote": "Ajouter au devis",
      "legal.copyright": "© 2026 Beta Art. Tous droits réservés. Chaque planche, fiche et design appartient à Beta Art.",
      "legal.link": "Droits d'auteur, PI et licences", "lang.label": "Langue"
    },
    de: {
      "nav.archive": "Archiv", "nav.verification": "Verifizierung", "nav.categories": "Kategorien",
      "nav.licensing": "Lizenzierung", "nav.photographer": "Fotograf", "nav.contact": "Kontakt",
      "brand.sub": "Verifizierte menschliche Fotografie",
      "notice": "Entwicklungsvorschau — Bilder sind Platzhalter, Preise und Lizenzbedingungen sind vorläufig.",
      "hero.eyebrow": "Norwegens verifiziertes Bildarchiv",
      "hero.title": "Von einem Menschen gemacht.", "hero.title.em": "An der Quelle verifiziert.",
      "hero.lead": "Jede Arbeit wurde von einer Person mit einer echten Kamera aufgenommen. Die RAW-Datei bleibt im Archiv, der Aufnahmenachweis begleitet die Datei, die Lizenz unterschreibt der Fotograf.",
      "hero.cta1": "Ins Archiv", "hero.cta2": "So funktioniert die Verifizierung",
      "verification.eyebrow": "Verifizierung", "verification.title": "Drei Tests. Ein Werk kommt nur ins Archiv, wenn es alle besteht.",
      "archive.eyebrow": "Das Archiv", "archive.title": "Platten zum Start",
      "categories.eyebrow": "Kategorienverzeichnis", "categories.title": "35 Kategorien, fünf Bereiche",
      "licensing.eyebrow": "Lizenzierung", "licensing.title": "Vier Wege, eine Platte zu lizenzieren",
      "contact.eyebrow": "Kontakt", "contact.title": "Lizenz anfragen oder Auftrag vergeben",
      "cta.request": "Lizenz anfragen", "cta.download": "Vorschau herunterladen", "cta.quote": "Zum Angebot",
      "legal.copyright": "© 2026 Beta Art. Alle Rechte vorbehalten. Jede Platte, jeder Katalogeintrag und das Seitendesign gehören Beta Art.",
      "legal.link": "Urheberrecht, IP und Lizenzen", "lang.label": "Sprache"
    },
    pt: {
      "nav.archive": "Arquivo", "nav.verification": "Verificação", "nav.categories": "Categorias",
      "nav.licensing": "Licenciamento", "nav.photographer": "Fotógrafo", "nav.contact": "Contacto",
      "brand.sub": "Fotografia humana verificada",
      "notice": "Pré-visualização de desenvolvimento — imagens provisórias, preços por confirmar.",
      "hero.eyebrow": "O arquivo visual verificado da Noruega",
      "hero.title": "Feito por uma pessoa.", "hero.title.em": "Verificado na origem.",
      "hero.lead": "Cada obra foi captada por uma pessoa com uma câmara física. O RAW original é mantido, o registo de captura acompanha o ficheiro e a licença é assinada pelo fotógrafo.",
      "hero.cta1": "Entrar no arquivo", "hero.cta2": "Como funciona a verificação",
      "verification.eyebrow": "Verificação", "verification.title": "Três testes. Uma obra entra apenas se passar em todos.",
      "archive.eyebrow": "O arquivo", "archive.title": "Placas de lançamento",
      "categories.eyebrow": "Diretório de categorias", "categories.title": "35 categorias, cinco secções",
      "licensing.eyebrow": "Licenciamento", "licensing.title": "Quatro formas de licenciar uma placa",
      "contact.eyebrow": "Contacto", "contact.title": "Pedir licença ou encomendar",
      "cta.request": "Pedir licença", "cta.download": "Descarregar pré-visualização", "cta.quote": "Adicionar ao orçamento",
      "legal.copyright": "© 2026 Beta Art. Todos os direitos reservados. Cada placa, registo e design pertence à Beta Art.",
      "legal.link": "Direitos de autor, PI e licenças", "lang.label": "Idioma"
    },
    ru: {
      "nav.archive": "Архив", "nav.verification": "Проверка", "nav.categories": "Категории",
      "nav.licensing": "Лицензирование", "nav.photographer": "Фотограф", "nav.contact": "Контакты",
      "brand.sub": "Проверенная человеческая фотография",
      "notice": "Предварительная версия — изображения временные, цены и условия предварительные.",
      "hero.eyebrow": "Проверенный визуальный архив Норвегии",
      "hero.title": "Снято человеком.", "hero.title.em": "Проверено у источника.",
      "hero.lead": "Каждая работа снята человеком настоящей камерой. RAW-оригинал хранится в архиве, запись съёмки идёт вместе с файлом, лицензию подписывает сам фотограф.",
      "hero.cta1": "Войти в архив", "hero.cta2": "Как работает проверка",
      "verification.eyebrow": "Проверка", "verification.title": "Три теста. Работа попадает в архив, только пройдя все три.",
      "archive.eyebrow": "Архив", "archive.title": "Стартовые работы",
      "categories.eyebrow": "Каталог категорий", "categories.title": "35 категорий, пять разделов",
      "licensing.eyebrow": "Лицензирование", "licensing.title": "Четыре способа лицензировать работу",
      "contact.eyebrow": "Контакты", "contact.title": "Запросить лицензию или съёмку",
      "cta.request": "Запросить лицензию", "cta.download": "Скачать превью", "cta.quote": "Добавить в смету",
      "legal.copyright": "© 2026 Beta Art. Все права защищены. Каждая работа, каталожная запись и дизайн принадлежат Beta Art.",
      "legal.link": "Авторское право, ИС и лицензии", "lang.label": "Язык"
    },
    ar: {
      "nav.archive": "الأرشيف", "nav.verification": "التوثيق", "nav.categories": "الفئات",
      "nav.licensing": "الترخيص", "nav.photographer": "المصوّر", "nav.contact": "اتصل",
      "brand.sub": "تصوير بشري موثّق",
      "notice": "نسخة تطويرية — الصور مؤقتة والأسعار والشروط غير نهائية.",
      "hero.eyebrow": "الأرشيف البصري الموثّق في النرويج",
      "hero.title": "صنعه إنسان.", "hero.title.em": "موثّق من المصدر.",
      "hero.lead": "كل عمل في هذا الأرشيف التقطه شخص بكاميرا حقيقية. يُحفظ الملف الأصلي RAW، ويرافق سجل التصوير الملف، ويوقّع المصوّر الترخيص بنفسه.",
      "hero.cta1": "ادخل الأرشيف", "hero.cta2": "كيف يتم التوثيق",
      "verification.eyebrow": "التوثيق", "verification.title": "ثلاثة اختبارات. لا يدخل العمل الأرشيف إلا باجتيازها جميعًا.",
      "archive.eyebrow": "الأرشيف", "archive.title": "أعمال الإطلاق",
      "categories.eyebrow": "دليل الفئات", "categories.title": "٣٥ فئة، خمسة أقسام",
      "licensing.eyebrow": "الترخيص", "licensing.title": "أربع طرق لترخيص العمل",
      "contact.eyebrow": "اتصل", "contact.title": "اطلب ترخيصًا أو تكليفًا",
      "cta.request": "اطلب ترخيصًا", "cta.download": "تنزيل المعاينة", "cta.quote": "أضف إلى العرض",
      "legal.copyright": "© 2026 Beta Art. جميع الحقوق محفوظة. كل عمل وسجل وتصميم يخص Beta Art.",
      "legal.link": "حقوق النشر والملكية الفكرية", "lang.label": "اللغة"
    },
    zh: {
      "nav.archive": "档案库", "nav.verification": "验证", "nav.categories": "类别",
      "nav.licensing": "授权", "nav.photographer": "摄影师", "nav.contact": "联系",
      "brand.sub": "经过验证的人类摄影",
      "notice": "开发预览 — 图片为占位素材，价格与授权条款尚未最终确定。",
      "hero.eyebrow": "挪威的可验证影像档案",
      "hero.title": "由人拍摄。", "hero.title.em": "在源头验证。",
      "hero.lead": "档案中的每一件作品都由真人用实体相机拍摄。RAW 原始文件留存，拍摄记录随文件交付，授权由摄影师本人签署。",
      "hero.cta1": "进入档案库", "hero.cta2": "验证如何进行",
      "verification.eyebrow": "验证", "verification.title": "三项测试。全部通过，作品才会进入档案。",
      "archive.eyebrow": "档案库", "archive.title": "首批作品",
      "categories.eyebrow": "类别目录", "categories.title": "35 个类别，五个部分",
      "licensing.eyebrow": "授权", "licensing.title": "四种授权方式",
      "contact.eyebrow": "联系", "contact.title": "申请授权或委托拍摄",
      "cta.request": "申请授权", "cta.download": "下载预览", "cta.quote": "加入报价",
      "legal.copyright": "© 2026 Beta Art。保留所有权利。每件作品、目录记录与页面设计均属 Beta Art 所有。",
      "legal.link": "版权、知识产权与授权条款", "lang.label": "语言"
    },
    ja: {
      "nav.archive": "アーカイブ", "nav.verification": "検証", "nav.categories": "カテゴリー",
      "nav.licensing": "ライセンス", "nav.photographer": "写真家", "nav.contact": "問い合わせ",
      "brand.sub": "検証済みの人間による写真",
      "notice": "開発プレビュー — 画像は仮素材、価格とライセンス条件は確定前です。",
      "hero.eyebrow": "ノルウェーの検証済みビジュアルアーカイブ",
      "hero.title": "人が撮った写真。", "hero.title.em": "撮影地点で検証済み。",
      "hero.lead": "本アーカイブの全作品は、人が実機のカメラで撮影したものです。RAW原本を保管し、撮影記録がファイルに随伴し、ライセンスは撮影者本人が署名します。",
      "hero.cta1": "アーカイブへ", "hero.cta2": "検証の仕組み",
      "verification.eyebrow": "検証", "verification.title": "三つの試験。すべて満たした作品だけが収蔵されます。",
      "archive.eyebrow": "アーカイブ", "archive.title": "初回収蔵作品",
      "categories.eyebrow": "カテゴリー目録", "categories.title": "35カテゴリー、5部門",
      "licensing.eyebrow": "ライセンス", "licensing.title": "四つのライセンス方法",
      "contact.eyebrow": "問い合わせ", "contact.title": "ライセンス申請・撮影依頼",
      "cta.request": "ライセンスを申請", "cta.download": "プレビューを保存", "cta.quote": "見積に追加",
      "legal.copyright": "© 2026 Beta Art. 無断複製を禁じます。全作品・目録記録・ページデザインは Beta Art に帰属します。",
      "legal.link": "著作権・知的財産・ライセンス", "lang.label": "言語"
    },
    hi: {
      "nav.archive": "संग्रह", "nav.verification": "सत्यापन", "nav.categories": "श्रेणियाँ",
      "nav.licensing": "लाइसेंस", "nav.photographer": "फ़ोटोग्राफ़र", "nav.contact": "संपर्क",
      "brand.sub": "सत्यापित मानव फ़ोटोग्राफ़ी",
      "notice": "विकास पूर्वावलोकन — छवियाँ अस्थायी हैं, मूल्य और शर्तें अंतिम नहीं हैं।",
      "hero.eyebrow": "नॉर्वे का सत्यापित दृश्य संग्रह",
      "hero.title": "मनुष्य द्वारा बनाया गया।", "hero.title.em": "स्रोत पर सत्यापित।",
      "hero.lead": "इस संग्रह की हर कृति किसी व्यक्ति ने वास्तविक कैमरे से ली है। RAW मूल सुरक्षित रहता है, कैप्चर रिकॉर्ड फ़ाइल के साथ जाता है, और लाइसेंस पर फ़ोटोग्राफ़र स्वयं हस्ताक्षर करता है।",
      "hero.cta1": "संग्रह देखें", "hero.cta2": "सत्यापन कैसे होता है",
      "verification.eyebrow": "सत्यापन", "verification.title": "तीन परीक्षण। सभी पास करने पर ही कृति संग्रह में आती है।",
      "archive.eyebrow": "संग्रह", "archive.title": "प्रारंभिक कृतियाँ",
      "categories.eyebrow": "श्रेणी निर्देशिका", "categories.title": "35 श्रेणियाँ, पाँच खंड",
      "licensing.eyebrow": "लाइसेंस", "licensing.title": "लाइसेंस के चार तरीके",
      "contact.eyebrow": "संपर्क", "contact.title": "लाइसेंस या असाइनमेंट का अनुरोध",
      "cta.request": "लाइसेंस माँगें", "cta.download": "पूर्वावलोकन डाउनलोड", "cta.quote": "कोटेशन में जोड़ें",
      "legal.copyright": "© 2026 Beta Art. सर्वाधिकार सुरक्षित। हर कृति, अभिलेख और डिज़ाइन Beta Art की संपत्ति है।",
      "legal.link": "कॉपीराइट, आईपी और लाइसेंस", "lang.label": "भाषा"
    }
  };

  function dict(code) { return T[code] || T.en; }

  function apply(code) {
    var lang = LANGS.filter(function (l) { return l.code === code; })[0] || LANGS[0];
    var d = dict(lang.code);
    var root = document.documentElement;

    root.setAttribute("lang", lang.code);
    root.setAttribute("dir", lang.dir);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (d[key]) el.textContent = d[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2 && d[parts[1].trim()]) el.setAttribute(parts[0].trim(), d[parts[1].trim()]);
      });
    });

    var picker = document.getElementById("lang-picker");
    if (picker) picker.value = lang.code;

    try { localStorage.setItem("beta-art-lang", lang.code); } catch (e) { /* private mode */ }
  }

  function mount() {
    var slot = document.getElementById("lang-slot");
    if (!slot) return;

    var wrap = document.createElement("div");
    wrap.className = "lang";

    var label = document.createElement("label");
    label.className = "visually-hidden";
    label.setAttribute("for", "lang-picker");
    label.textContent = "Language";

    var select = document.createElement("select");
    select.id = "lang-picker";
    select.className = "lang-select";
    select.setAttribute("aria-label", "Language");

    LANGS.forEach(function (l) {
      var opt = document.createElement("option");
      opt.value = l.code;
      opt.textContent = l.label;
      select.appendChild(opt);
    });

    select.addEventListener("change", function () { apply(select.value); });

    wrap.appendChild(label);
    wrap.appendChild(select);
    slot.appendChild(wrap);
  }

  var saved = null;
  try { saved = localStorage.getItem("beta-art-lang"); } catch (e) { /* ignore */ }
  if (!saved) {
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    saved = LANGS.some(function (l) { return l.code === nav; }) ? nav : "en";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { mount(); apply(saved); });
  } else {
    mount();
    apply(saved);
  }

  window.BetaArtI18n = { apply: apply, languages: LANGS };
})();
