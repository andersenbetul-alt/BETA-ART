import type { Dictionary } from "./types";

export const tr: Dictionary = {
  meta: {
    siteName: "NAVIAR",
    tagline: "Stratejiden uygulamaya, yanınızda",
    description:
      "NAVIAR; yönetim ve strateji danışmanlığı ile insan kaynakları ve kurumsal eğitim alanlarında, kurumların büyüme hedeflerini uygulanabilir sistemlere dönüştürür.",
    localeLabel: "Türkçe",
    switchLabel: "English",
    htmlLang: "tr",
  },
  nav: {
    services: "Hizmetler",
    aiWorkforce: "AI Workforce",
    approach: "Yaklaşımımız",
    insights: "İçgörüler",
    about: "Hakkımızda",
    careers: "Kariyer",
    contact: "İletişim",
  },
  actions: {
    contact: "Görüşme planlayın",
    services: "Hizmetlerimizi inceleyin",
    approach: "Çalışma biçimimiz",
    readMore: "Detaylı bilgi",
    backHome: "Ana sayfaya dön",
    skipToContent: "İçeriğe atla",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
  },
  home: {
    hero: {
      eyebrow: "Yönetim & Strateji · İK & Kurumsal Eğitim · AI Workforce",
      title: "Stratejiniz sunumda kalıyorsa",
      highlight: "sorun strateji değil",
      // İki cümle. Ne yaptığımızı ve kimin için yaptığımızı ilk ekranda söyler.
      description:
        "Kararlar çoğu zaman doğrudur; onları taşıyacak karar hakları, süreçler ve İK sistemleri kurulmamıştır. NAVIAR bu yapıyı kurar ve kurum kendi başına yürütene kadar sahada kalır.",
      promise:
        "30 dakikalık ilk görüşme ücretsizdir · Yanıtı genellikle iki iş günü içinde veririz",
      // Yeni bir firmanın uydurabileceği müşteri sayısı yok. Bunlar
      // doğrulanabilir yapısal olgular; her biri sitenin bir yerinde açılıyor.
      facts: [
        { value: "2", label: "uzmanlık alanı, tek ekip" },
        { value: "4", label: "aşamalı çalışma yöntemi" },
        { value: "2–4", label: "haftalık teşhis çalışması" },
      ],
    },
    practices: {
      eyebrow: "Uzmanlık alanları",
      title: "İki alan, tek bütünleşik yaklaşım",
      description:
        "Strateji ile insan kaynağını ayrı başlıklar olarak görmüyoruz. Kurumsal hedefleriniz ile ekibinizin yetkinlikleri arasındaki mesafeyi kapatan çözümler tasarlıyoruz.",
    },
    approach: {
      eyebrow: "Yaklaşımımız",
      title: "Rapor değil, işleyen bir sistem bırakırız",
      description:
        "Her projeyi keşiften etkiye kadar dört net aşamada yürütürüz. Sonunda elinizde yalnızca bir sunum değil; sahiplenilmiş, ölçülen ve devam ettirilebilir bir uygulama planı olur.",
    },
    why: {
      eyebrow: "Neden NAVIAR",
      title: "Diğer danışmanlardan dört noktada ayrılıyoruz",
      items: [
        {
          title: "Bütünleşik bakış",
          description:
            "Yönetim danışmanlığı ve İK uzmanlığı aynı ekipte. Stratejinin insan tarafı ilk günden masada olur.",
        },
        {
          title: "Uygulamaya bağlılık",
          description:
            "Projeyi öneri listesiyle bitirmeyiz. Uygulama döneminde de sorumluluk alır, sonuçları birlikte takip ederiz.",
        },
        {
          title: "Ölçülebilir çıktı",
          description:
            "Her çalışmanın başında başarı kriterlerini tanımlar, sonunda bu kriterlerle hesap veririz.",
        },
        {
          title: "Kuruma özgü tasarım",
          description:
            "Hazır şablon uygulamayız. Çözümü kurumunuzun ölçeğine, kültürüne ve hızına göre kurgularız.",
        },
      ],
    },
    aiWorkforce: {
      eyebrow: "Yeni ürün",
      title: "AI çalışanlar şirketiniz için 24/7 çalışsın",
      description:
        "Şirketinizde tekrar eden işleri analiz ediyor, devredilebilenleri görev tanımı yazılı AI ajanlarına kuruyoruz. Dört haftada ilk AI çalışan sahada.",
      points: [
        "Önce ölçeriz: ekibin zamanı nereye gidiyor",
        "Tek bir ajanla başlarız, işe yaradığında büyütürüz",
        "Kurulum sizin olur — biz olmadan da yürür",
      ],
      action: "AI Workforce'u inceleyin",
    },
    insights: {
      eyebrow: "İçgörüler",
      title: "Sahada gördüklerimiz",
      description:
        "Kurucularımızın saha deneyiminde tekrar tekrar karşılaştığı sorunları ve işe yaradığını gördüğü yaklaşımları yazıyoruz.",
      all: "Tüm yazılar",
    },
    cta: {
      title: "Önceliğinizi konuşalım",
      description:
        "30 dakikalık ilk görüşmede mevcut durumunuzu dinler, ihtiyacınıza uygun çalışma modelini ücretsiz olarak değerlendiririz.",
    },
  },
  services: {
    hero: {
      eyebrow: "Hizmetlerimiz",
      title: "Kararı alan da uygulayan da aynı kurum olmalı",
      description:
        "NAVIAR'ın hizmetleri iki uzmanlık alanı etrafında kurgulanır. Projeler çoğu zaman tek bir başlıkla başlar; kalıcı sonuç ise iki alanın birlikte çalışmasıyla gelir.",
    },
    practices: [
      {
        id: "yonetim-strateji",
        eyebrow: "Uzmanlık alanı 01",
        title: "Yönetim & Strateji Danışmanlığı",
        summary:
          "Büyüme hedeflerinizi net önceliklere, önceliklerinizi de sahada takip edilebilir bir yönetim sistemine dönüştürürüz. Amacımız, karar alma hızınızı artırırken kararların uygulamada karşılığını güvence altına almaktır.",
        offerings: [
          {
            title: "Kurumsal strateji ve büyüme planlaması",
            description:
              "Pazar ve rekabet analizi, büyüme senaryoları, önceliklendirme ve 12–36 aylık yol haritası.",
          },
          {
            title: "Organizasyon tasarımı ve yönetişim",
            description:
              "Organizasyon şeması, rol ve sorumluluk matrisi, karar hakları ve komite yapılarının kurgulanması.",
          },
          {
            title: "Süreç iyileştirme ve operasyonel verimlilik",
            description:
              "Uçtan uca süreç haritalama, darboğaz analizi, sadeleştirme ve standart iş yordamlarının yazımı.",
          },
          {
            title: "Performans yönetimi ve KPI mimarisi",
            description:
              "Şirket hedeflerinden birim ve birey hedeflerine inen tutarlı bir gösterge seti ve raporlama düzeni.",
          },
        ],
        outcomes: [
          "Yönetim ekibinin üzerinde uzlaştığı, önceliklendirilmiş bir stratejik gündem",
          "Kim neye karar verir sorusunu netleştiren bir yönetişim modeli",
          "Tekrar eden işleri azaltan, ölçülen ve sahiplenilen süreçler",
          "Yönetim toplantılarını yöneten tek sayfalık bir performans paneli",
        ],
      },
      {
        id: "ik-egitim",
        eyebrow: "Uzmanlık alanı 02",
        title: "İnsan Kaynakları & Kurumsal Eğitim",
        summary:
          "Doğru insanı bulmak, tutmak ve geliştirmek için gereken sistemleri kurarız. İK'yı destek biriminden çıkarıp büyümenin taşıyıcı sistemine dönüştürmeyi hedefleriz.",
        offerings: [
          {
            title: "Yetenek kazanımı ve işe alım sistemleri",
            description:
              "İhtiyaç analizi, yetkinlik bazlı görev tanımları, yapılandırılmış mülakat rehberleri ve işveren markası.",
          },
          {
            title: "Yetkinlik modeli ve kariyer mimarisi",
            description:
              "Kurumunuza özgü yetkinlik seti, kademe tanımları, terfi kriterleri ve ücret bandı çerçevesi.",
          },
          {
            title: "Liderlik gelişim programları",
            description:
              "İlk kademe yöneticiden üst yönetime uzanan, vaka temelli ve uygulamaya dönük gelişim yolculukları.",
          },
          {
            title: "Kurumsal eğitim tasarımı ve ölçümleme",
            description:
              "Eğitim ihtiyaç analizi, içerik tasarımı, iç eğitmen yetiştirme ve davranış değişiminin ölçülmesi.",
          },
        ],
        outcomes: [
          "İşe alım süresini ve hatalı işe alım maliyetini düşüren standart bir süreç",
          "Çalışanın kariyer yolunu görebildiği şeffaf bir kademe ve yetkinlik yapısı",
          "Yöneticilerin ortak bir dil ve araç setiyle çalıştığı bir liderlik anlayışı",
          "Katılım değil, davranış değişimi üzerinden raporlanan eğitim programları",
        ],
      },
    ],
    outcomesLabel: "Elde ettiğiniz çıktılar",
    practiceCta: "Bu alan için görüşme planlayın",
    relatedArticles: "Bu alandaki yazılarımız",
    engagement: {
      title: "Çalışma modellerimiz",
      description:
        "Her kurumun ihtiyacı ve hazır olma düzeyi farklıdır. Kapsamı birlikte belirler, size uygun modeli öneririz.",
      models: [
        {
          title: "Teşhis çalışması",
          description:
            "2–4 haftalık odaklı bir inceleme. Mevcut durumu ortaya koyar, önceliklendirilmiş bir eylem listesi ile biter.",
        },
        {
          title: "Proje bazlı danışmanlık",
          description:
            "Tanımlı bir kapsam ve takvimle yürütülen, çıktısı ve başarı kriterleri baştan belirlenmiş çalışma.",
        },
        {
          title: "Sürekli danışmanlık",
          description:
            "Aylık belirli bir gün sayısıyla yönetim ekibinin yanında olduğumuz, uzun soluklu ortaklık modeli.",
        },
        {
          title: "Eğitim ve atölye",
          description:
            "Tek başına ya da bir projenin parçası olarak yürütülen, kuruma özel tasarlanmış programlar.",
        },
      ],
    },
  },
  approach: {
    hero: {
      eyebrow: "Yaklaşımımız",
      title: "Dört aşamada, keşiften kalıcı etkiye",
      description:
        "Danışmanlığın kurumda iz bırakması için sürecin şeffaf ve katılımcı olması gerekir. Her projeyi aynı disiplinle, ancak kurumunuzun hızına uyarlayarak yürütürüz.",
    },
    phases: [
      {
        step: "01",
        title: "Keşif",
        description:
          "Kurumu dinleyerek başlarız. Amaç, sorunu değil sorunun kaynağını doğru tanımlamaktır.",
        activities: [
          "Yönetim ekibi ve kilit paydaşlarla birebir görüşmeler",
          "Mevcut veri, rapor ve süreç dokümanlarının incelenmesi",
          "Saha gözlemi ve çalışan nabız ölçümü",
          "Başarı kriterlerinin ve kapsamın birlikte netleştirilmesi",
        ],
      },
      {
        step: "02",
        title: "Teşhis",
        description:
          "Topladığımız veriyi bulguya dönüştürür, önceliklendirilmiş bir tablo sunarız.",
        activities: [
          "Bulguların etki ve uygulanabilirlik ekseninde önceliklendirilmesi",
          "Kök neden analizi ve karşılaştırmalı değerlendirme",
          "Yönetim ekibiyle bulgu paylaşım ve mutabakat oturumu",
          "Çözüm alternatiflerinin fayda-maliyet değerlendirmesi",
        ],
      },
      {
        step: "03",
        title: "Tasarım",
        description:
          "Çözümü sizinle birlikte tasarlarız. Kurum içinde sahiplenilmeyen tasarım uygulanmaz.",
        activities: [
          "Ortak çalışma atölyeleri ile model ve süreç tasarımı",
          "Rol, sorumluluk ve karar haklarının tanımlanması",
          "Politika, prosedür ve şablonların yazılması",
          "Pilot uygulama planı ve iletişim stratejisi",
        ],
      },
      {
        step: "04",
        title: "Uygulama ve etki",
        description:
          "Devreye alma sürecinde yanınızda kalır, sonucu birlikte ölçeriz.",
        activities: [
          "Pilot uygulamanın yürütülmesi ve düzeltici iyileştirmeler",
          "Ekiplerin eğitilmesi ve iç sahiplerin yetkinleştirilmesi",
          "Belirlenen göstergelerle etkinin ölçülmesi",
          "Kapanış değerlendirmesi ve sürdürülebilirlik planı",
        ],
      },
    ],
    principles: {
      title: "Çalışma ilkelerimiz",
      items: [
        {
          title: "Şeffaflık",
          description:
            "Bulguları olduğu gibi paylaşırız. Duymak istediğiniz değil, bilmeniz gereken.",
        },
        {
          title: "Bilgi aktarımı",
          description:
            "Kurumu bize bağımlı kılmayız. Kullandığımız yöntemi ekibinize öğretmeyi işin parçası sayarız.",
        },
        {
          title: "Gizlilik",
          description:
            "Paylaştığınız her bilgi sözleşmeye bağlı gizlilik kapsamındadır ve proje dışına çıkmaz.",
        },
        {
          title: "Ölçülebilirlik",
          description:
            "Başarıyı baştan tanımlar, sonunda aynı ölçütlerle değerlendiririz.",
        },
      ],
    },
  },
  about: {
    hero: {
      eyebrow: "Hakkımızda",
      title: "Danışmanlığın sahada karşılığı olmalı",
      description:
        "NAVIAR, yönetim danışmanlığı ile insan kaynakları uzmanlığını tek çatı altında birleştiren bir danışmanlık firmasıdır. Kurumların büyüme hedefleri ile günlük işleyişi arasındaki mesafeyi kapatmak için çalışırız.",
    },
    story: {
      title: "Neden kurulduk",
      paragraphs: [
        "Kurumlarda çoğu zaman sorun stratejinin yokluğu değildir. Strateji vardır; ancak organizasyon yapısı, süreçler ve insan kaynağı bu stratejiyi taşıyacak biçimde kurgulanmamıştır. Sonuç, rafta kalan planlar ve tekrar eden aynı tartışmalardır.",
        "NAVIAR'ı bu boşluğu kapatmak için kurduk. Bir tarafta yönetim ve strateji, diğer tarafta insan kaynakları ve kurumsal eğitim uzmanlığını aynı masada topluyoruz. Böylece alınan kararın hem operasyonel hem de insani karşılığını aynı anda tasarlayabiliyoruz.",
        "Çalışma biçimimizin merkezinde uygulama var. Bir projeyi rapor teslimiyle değil, kurumun o sistemi kendi başına yürütebildiği noktada tamamlanmış sayıyoruz.",
      ],
    },
    mission: {
      title: "Misyonumuz",
      description:
        "Kurumların stratejik hedefleri ile günlük işleyişi arasındaki bağı kurmak; danışmanlığı öneri üretmekten çıkarıp ölçülebilir sonuç üreten bir ortaklığa dönüştürmek.",
    },
    vision: {
      title: "Vizyonumuz",
      description:
        "Kurumsallaşma kararı alan şirketlerin ilk aradığı ekip olmak — ve her projeden geriye rapor değil, kurumun kendi yürüttüğü bir sistem bırakmak.",
    },
    values: {
      title: "Değerlerimiz",
      items: [
        {
          title: "Dürüstlük",
          description:
            "Kapsamı, süreyi ve beklenen sonucu olduğu gibi konuşuruz. Sunamayacağımız sonucu taahhüt etmeyiz.",
        },
        {
          title: "Titizlik",
          description:
            "Her öneriyi veriye ve saha gözlemine dayandırırız. Varsayımı bulgu gibi sunmayız.",
        },
        {
          title: "Ortaklık",
          description:
            "Dışarıdan bakan bir gözlemci değil, sonuçtan sorumlu bir ekip arkadaşı gibi çalışırız.",
        },
        {
          title: "Süreklilik",
          description:
            "Kurumda kalıcı olmayan çözüm başarılı sayılmaz. Devri ve sürdürülebilirliği baştan planlarız.",
        },
      ],
    },
    team: {
      title: "Ekibimiz",
      description:
        "Projeler, ihtiyaca göre kurulan karma ekiplerle yürütülür. Her çalışmada bir sorumlu ortak ve konuya özel uzmanlar birlikte görev alır.",
      roles: [
        {
          title: "Sorumlu ortak",
          description:
            "Projenin ilk görüşmesinden kapanışına kadar tek muhatabınızdır; kapsamdan ve sonuçtan sorumludur.",
        },
        {
          title: "Strateji danışmanı",
          description:
            "Analiz, modelleme ve yönetişim tasarımını yürütür; yönetim ekibiyle birlikte çalışır.",
        },
        {
          title: "İK danışmanı",
          description:
            "Yetkinlik, kariyer ve performans sistemlerinin tasarımı ile devreye alınmasından sorumludur.",
        },
        {
          title: "Eğitim tasarımcısı",
          description:
            "Gelişim programlarını kurgular, iç eğitmenleri yetiştirir ve etki ölçümünü tasarlar.",
        },
      ],
    },
  },
  contact: {
    hero: {
      eyebrow: "İletişim",
      title: "Bir sonraki adımı konuşalım",
      description:
        "Formu doldurun ya da doğrudan bize ulaşın. İlk görüşmede mevcut durumunuzu dinler, ihtiyacınıza uygun çalışma modelini birlikte değerlendiririz.",
    },
    details: {
      title: "Doğrudan iletişim",
      email: { label: "E-posta", value: "info@naviar.com" },
      phone: { label: "Telefon", value: "+90 (212) 000 00 00" },
      address: { label: "Adres", value: "İstanbul, Türkiye" },
      hours: { label: "Çalışma saatleri", value: "Hafta içi 09:00 – 18:00" },
    },
    form: {
      title: "Görüşme talebi",
      description:
        "Aşağıdaki bilgileri paylaşın; yanıtı genellikle iki iş günü içinde veririz.",
      name: "Ad soyad",
      company: "Kurum",
      email: "E-posta",
      phone: "Telefon",
      phoneOptional: "isteğe bağlı",
      topic: "İlgilendiğiniz konu",
      topicPlaceholder: "Bir konu seçin",
      topicOptions: [
        "Yönetim & strateji danışmanlığı",
        "Organizasyon ve süreç tasarımı",
        "İnsan kaynakları sistemleri",
        "Liderlik ve kurumsal eğitim",
        "Henüz emin değilim",
      ],
      message: "Mesajınız",
      submit: "Talebi gönder",
      submitting: "Gönderiliyor...",
      consent:
        "Formu göndererek, paylaştığınız bilgilerin talebinizi değerlendirmek amacıyla işlenmesini kabul etmiş olursunuz. Ayrıntılar için:",
      privacyLinkLabel: "Gizlilik ve KVKK aydınlatma metni",
      success:
        "Teşekkürler, talebiniz bize ulaştı. Genellikle iki iş günü içinde size döneriz.",
      errors: {
        name: "Lütfen adınızı ve soyadınızı yazın.",
        email: "Lütfen geçerli bir e-posta adresi girin.",
        message: "Lütfen en az 20 karakterlik bir mesaj yazın.",
        generic: "Talebiniz gönderilemedi. Lütfen tekrar deneyin.",
        tooMany:
          "Kısa sürede çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
      },
    },
  },
  insights: {
    hero: {
      eyebrow: "İçgörüler",
      title: "Sahada gördüklerimiz",
      description:
        "Kurucularımızın danışmanlık ve kurumsal İK deneyiminde tekrar tekrar karşılaştığı sorunları ve işe yaradığını gördüğü yaklaşımları yazıyoruz. Genel geçer tavsiye değil; uygulanabilir olması için yeterince somut olmasına çalışıyoruz.",
    },
    labels: {
      readingTime: "dakikalık okuma",
      published: "Yayın",
      backToList: "Tüm yazılar",
      readNext: "Sırada okunacaklar",
      related: "Bu yazı şu alanla ilgili",
      cta: {
        title: "Bu konuyu kurumunuzda konuşalım",
        description:
          "Yazıda anlatılan durum size tanıdık geldiyse, 30 dakikalık ilk görüşmede kendi tablonuzu birlikte değerlendirebiliriz.",
      },
    },
    articles: {
      "strateji-neden-rafta-kalir": {
        title: "Strateji neden rafta kalır?",
        excerpt:
          "Çoğu kurumda sorun stratejinin yokluğu değil, stratejiyi taşıyacak yapının kurulmamış olmasıdır. Rafta kalan planların dört ortak özelliği ve her birinin somut karşılığı.",
        sections: [
          {
            title: "Sorun stratejinin kendisi değil",
            paragraphs: [
              "Bir kurumun stratejisi olup olmadığını anlamak kolaydır: sorarsınız, çoğu zaman bir sunum çıkar. Zor olan, o sunumdaki kararların altı ay sonra günlük işleyişte karşılığı olup olmadığını anlamaktır.",
              "Rafta kalan planlara yakından baktığımızda neredeyse hiç 'kötü strateji' görmedik. Gördüğümüz şey, doğru kararların onları taşıyacak yapı kurulmadan alınmış olmasıydı.",
            ],
          },
          {
            title: "Birinci özellik: önceliklendirilmemiş olması",
            paragraphs: [
              "On dört stratejik öncelik, sıfır öncelik demektir. Bir listedeki her madde aynı derecede önemliyse, kaynak çatıştığında kimin geri adım atacağı belirsiz kalır ve karar en yüksek sesli yöneticiye devrolur.",
              "Uygulanabilir bir gündem nadiren üç-beş başlığı geçer. Geri kalanı yok saymak değil, sıraya koymaktır: neyin bu yıl, neyin gelecek yıl olduğunu yazmak.",
            ],
          },
          {
            title: "İkinci özellik: karar haklarının tanımsız olması",
            paragraphs: [
              "Strateji belgeleri neredeyse her zaman 'ne yapılacağını' yazar, 'kimin karar vereceğini' yazmaz. Sonuç, her kararın üst yönetime çıkması ve yönetim toplantılarının operasyon toplantısına dönüşmesidir.",
              "Bu, bir organizasyon şeması sorunu değildir; şema çoğu zaman vardır. Eksik olan, belirli karar tiplerinin hangi seviyede sonuçlandığını gösteren bir tablodur. Bunu yazmak bir öğleden sonra sürer ve etkisi aylarca hissedilir.",
            ],
          },
          {
            title: "Üçüncü özellik: ölçünün sonuçta değil faaliyette olması",
            paragraphs: [
              "'Dijital dönüşüm projesinin yüzde altmışı tamamlandı' cümlesi bir faaliyet ölçüsüdür ve hiçbir şey söylemez. 'Sipariş kapama süresi dokuz günden beş güne indi' bir sonuç ölçüsüdür.",
              "Faaliyet ölçüleri rahatlatıcıdır çünkü her zaman ilerleme gösterir. Sonuç ölçüleri rahatsız edicidir çünkü bazen yerinde sayar — ve tam bu yüzden yönetim toplantısına ait olan onlardır.",
            ],
          },
          {
            title: "Dördüncü özellik: insan tarafının sonraya bırakılması",
            paragraphs: [
              "Strateji çalışması biter, ardından 'bunu İK'ya iletelim' denir. Oysa yeni öncelikler çoğu zaman yeni yetkinlikler, farklı bir performans tanımı ve bazen farklı bir kadro gerektirir.",
              "İnsan tarafını sonraya bırakmak, kararın uygulanmasını altı ay geciktirir. Aynı masada konuşulduğunda ise strateji çoğu zaman değişir — çünkü neyin gerçekten yapılabilir olduğu ortaya çıkar.",
            ],
          },
        ],
        takeaway:
          "Elinizde rafta duran bir plan varsa, onu yeniden yazmadan önce şu dördünü kontrol edin: kaç önceliğiniz var, kim karar veriyor, neyi ölçüyorsunuz ve insan tarafı ne zaman masaya geldi.",
      },
      "yetkinlik-modeli-oncesi-uc-soru": {
        title: "Yetkinlik modeli kurmadan önce cevaplamanız gereken üç soru",
        excerpt:
          "Yetkinlik modelleri kurumların en çok yatırım yapıp en az kullandığı İK aracıdır. Kullanılan modellerle raflarda kalanları ayıran şey, kurulmadan önce sorulan sorular.",
        sections: [
          {
            title: "Neden çoğu model kullanılmıyor",
            paragraphs: [
              "Bir yetkinlik modeli hazırlamak birkaç ay sürer, güzel bir dokümanla biter ve çoğu zaman yalnızca yıl sonu değerlendirmesinde bir kez açılır. Sorun modelin kalitesi değildir; hangi kararı besleyeceğinin baştan tanımlanmamış olmasıdır.",
              "Kullanılan modellerde ortak olan şey karmaşıklık düzeyi değil, bir karara bağlı olmalarıdır.",
            ],
          },
          {
            title: "Birinci soru: bu model hangi kararı besleyecek?",
            paragraphs: [
              "Terfi kararı mı, işe alım mülakatı mı, eğitim bütçesinin dağıtımı mı, ücret bandı mı? Cevap 'hepsi' ise model muhtemelen hiçbirinde kullanılmayacaktır.",
              "Tek bir karara odaklanan bir model, altı ay içinde gerçekten kullanılır ve kullanıldıkça olgunlaşır. Her şeye hizmet etmeye çalışan model, hiçbir kararın sahibi tarafından benimsenmez.",
            ],
          },
          {
            title: "İkinci soru: davranış olarak yazılabiliyor mu?",
            paragraphs: [
              "'Analitik düşünme' bir yetkinlik adıdır, tanımı değildir. İki yönetici aynı çalışanı bu başlıkta değerlendirdiğinde farklı şeyler ölçer.",
              "Kullanılabilir bir tanım gözlemlenebilir olmalıdır: 'kararını dayandırdığı veriyi ve varsayımı ayrı ayrı söyleyebilir' gibi. Bu tür bir cümle mülakatta da performans görüşmesinde de aynı şeyi ölçer.",
              "Bu, modeli uzatır ve yazması sıkıcıdır. Kullanılır olmasının bedeli budur.",
            ],
          },
          {
            title: "Üçüncü soru: kaç kademe gerçekten farklı?",
            paragraphs: [
              "Çoğu kurum beş kademe tanımlar ama gerçekte üç farklı iş yapılır. Aradaki yapay kademeler terfiyi ödül aracına dönüştürür ve zamanla unvan enflasyonu yaratır.",
              "Kademe sayısını işin kendisinden çıkarın: sorumluluğun, karar alanının ve etkisinin gerçekten değiştiği yerler nerede? Genellikle sandığınızdan azdır.",
            ],
          },
        ],
        takeaway:
          "Bu üç soruya net cevabınız yoksa modeli kurmayı erteleyin. Cevaplar netleştiğinde model zaten yarı yarıya yazılmış olur.",
      },
      "egitimi-davranisla-olcmek": {
        title: "Eğitimi katılımla değil davranışla ölçmek",
        excerpt:
          "Katılım oranı ve memnuniyet puanı, eğitimin işe yarayıp yaramadığı hakkında hiçbir şey söylemez. Davranış değişimini ölçmek için pahalı bir sistem değil, üç basit alışkanlık gerekir.",
        sections: [
          {
            title: "Rahatlatıcı ama boş göstergeler",
            paragraphs: [
              "Kurumsal eğitim raporlarının çoğu iki sayı içerir: kaç kişi katıldı ve memnuniyet puanı kaç. İkisi de yüksek çıkar, çünkü ikisi de eğitimin kendisini ölçer — sonrasında ne olduğunu değil.",
              "Memnuniyet puanı en çok eğitmenin sunum becerisini ölçer. İyi bir eğitmenle kötü tasarlanmış bir program da yüksek puan alır.",
            ],
          },
          {
            title: "Ölçmeye eğitimden önce başlayın",
            paragraphs: [
              "Davranış değişimini ölçmenin ön şartı, değişmesi beklenen davranışı eğitimden önce yazmaktır. 'Geri bildirim verme' değil; 'yöneticiler ekip üyeleriyle ayda en az bir kez birebir görüşme yapar ve görüşmede somut bir örnek üzerinden konuşur' gibi.",
              "Bu cümleyi yazamıyorsanız, eğitimin neyi değiştireceği henüz belli değil demektir. Bu, ölçüm sorunundan önce bir tasarım sorunudur.",
            ],
          },
          {
            title: "Üç ay sonra sorun, hemen sonra değil",
            paragraphs: [
              "Eğitim çıkışında yapılan anket heyecanı ölçer. Asıl soru üç ay sonra sorulmalıdır ve katılımcıya değil, çevresine: ekip üyeleri birebir görüşmelerin sıklığında bir değişiklik fark etti mi?",
              "Bu ölçüm pahalı bir sistem gerektirmez. Beş kısa soruluk bir nabız ölçümü, doğru zamanda ve doğru kişiye sorulduğunda yeterlidir.",
            ],
          },
          {
            title: "Yöneticiyi sürece dahil edin",
            paragraphs: [
              "Davranış değişiminin en güçlü belirleyicisi eğitimin kalitesi değil, katılımcının yöneticisinin o davranışı bekleyip beklemediğidir.",
              "Program tasarımına yöneticinin ne yapacağını da yazın: eğitim öncesi beş dakikalık bir beklenti konuşması ve sonrasında bir takip görüşmesi, çoğu programda davranış değişiminin en güçlü tek belirleyicisidir.",
            ],
          },
        ],
        takeaway:
          "Bir sonraki eğitim programınızda tek bir şey değiştirecekseniz, ölçümü eğitimin sonundan üç ay sonrasına taşıyın ve soruyu katılımcının çevresine sorun.",
      },
    },
  },
  aiWorkforce: {
    hero: {
      eyebrow: "Ürün · AI Workforce",
      title: "AI çalışanlar şirketiniz için 24/7 çalışsın",
      description:
        "Şirketinizde tekrar eden işleri analiz ediyor, hangilerinin yapay zekâya devredilebileceğini ölçüyor ve devredilebilenleri çalışan gibi görev tanımı olan AI ajanlarına kuruyoruz. Ekibinizi işten çıkarmak için değil, ekibinizin zamanını geri vermek için.",
    },
    definition: {
      title: "Ne olduğu ve ne olmadığı",
      is: [
        "Tekrar eden, kuralı belli işleri devralan, görev tanımı yazılı yazılım ajanları",
        "Kurumun kendi sistemlerine (e-posta, CRM, takvim, dosyalar) bağlı çalışan bir kurulum",
        "Her ajanın çıktısının ölçüldüğü ve gerektiğinde kapatılabildiği bir yapı",
        "Kurulumdan sonra ekibinize devredilen, sizin sahip olduğunuz bir sistem",
      ],
      isNot: [
        "İnsan çalışanın birebir yerine geçen bir şey — kararı insan verir",
        "Kurulur kurulmaz kendi kendine öğrenen sihirli bir kutu",
        "Yanılmaz: her ajanın hata payı vardır, bu yüzden kontrol noktaları tasarlanır",
        "Tek seferlik bir kurulum — izlenmesi ve düzeltilmesi gereken bir sistem",
      ],
    },
    process: {
      eyebrow: "Nasıl kuruluyor",
      title: "Dört haftada ilk AI çalışan sahada",
      description:
        "Her şeyi aynı anda otomatikleştirmeyi önermiyoruz. Önce ölçüyoruz, sonra en çok zaman yiyen tek işi seçip onu sahada çalışır hâle getiriyoruz. İlk ajan işe yaradığında ikincisini konuşuyoruz.",
      steps: [
        {
          step: "01",
          title: "İş envanteri",
          description:
            "Bir hafta boyunca ekibin zamanının nereye gittiğini çıkarırız. Amaç, sezgiyle değil kayıtla konuşmak.",
          activities: [
            "Rol bazında tekrar eden işlerin listelenmesi",
            "Her iş için haftalık tekrar sayısı ve süre tahmini",
            "Girdi ve çıktısı belli olan işlerin ayrıştırılması",
            "Hangi sistemlere erişim gerektiğinin çıkarılması",
          ],
        },
        {
          step: "02",
          title: "Devredilebilirlik değerlendirmesi",
          description:
            "Her işi dört ölçütle tartarız: kuralı ne kadar belli, hatanın maliyeti ne, veriye erişim var mı, kazanç ne kadar.",
          activities: [
            "Otomasyona uygun işlerin puanlanması ve sıralanması",
            "Devredilmemesi gerekenlerin gerekçesiyle işaretlenmesi",
            "Beklenen kazancın saat ve maliyet olarak hesaplanması",
            "Pilot için tek bir ajanın seçilmesi",
          ],
        },
        {
          step: "03",
          title: "Kurulum ve pilot",
          description:
            "Seçilen ajanın görev tanımını yazar, sistemlerinize bağlar ve iki hafta gözetim altında çalıştırırız.",
          activities: [
            "Ajanın görev tanımı, sınırları ve devretme kurallarının yazılması",
            "Sistem bağlantıları ve yetki kapsamının kurulması",
            "Önce insan onaylı, sonra kademeli olarak otonom çalıştırma",
            "Hata örneklerinin toplanması ve düzeltilmesi",
          ],
        },
        {
          step: "04",
          title: "Ölçüm ve devir",
          description:
            "Kazancı ölçer, ajanı ekibinize devrederiz. Sistem sizin olur; biz kalmadan da yürür.",
          activities: [
            "Kazanılan saatin ve hata oranının raporlanması",
            "İç sahibin eğitilmesi ve yönetim panelinin devri",
            "Ajanın nasıl durdurulacağı ve güncelleneceğinin yazılı hâle getirilmesi",
            "Sonraki ajan için önceliklendirme",
          ],
        },
      ],
    },
    agents: {
      eyebrow: "AI çalışanlar",
      title: "Kurabileceğimiz roller",
      description:
        "Her rolün yazılı bir görev tanımı, erişebildiği sistemler ve insanın devreye girdiği bir kontrol noktası vardır. Hepsini birden kurmanızı önermiyoruz — ilk pilotu birlikte seçeriz.",
      systemsLabel: "Bağlandığı sistemler",
      humanLabel: "İnsan kontrolü",
      items: {
        receptionist: {
          title: "AI Resepsiyonist",
          summary:
            "Gelen aramayı ve mesajı ilk karşılayan, randevu açan ve doğru kişiye yönlendiren rol. Kimse telefonu yanıtsız bırakmaz.",
          does: [
            "Çalışma saatleri dışında gelen aramaları karşılar ve not alır",
            "Randevu takvimine uygun saat önerir ve kaydı açar",
            "Sık sorulan soruları (adres, saat, fiyat aralığı) yanıtlar",
            "Aciliyet taşıyan konuyu belirleyip ilgili kişiye iletir",
          ],
          humanReview:
            "Randevu iptali, fiyat pazarlığı ve şikâyet konuları her zaman bir kişiye aktarılır.",
        },
        email: {
          title: "AI E-posta Asistanı",
          summary:
            "Gelen kutusunu sınıflandıran, taslak yanıt hazırlayan ve hiçbir e-postanın gözden kaçmamasını sağlayan rol.",
          does: [
            "Gelen e-postaları konu ve aciliyete göre sınıflandırır",
            "Tekrar eden sorulara taslak yanıt hazırlar",
            "Yanıtlanmamış e-postaları gün sonunda hatırlatır",
            "Ekteki belgeleri özetleyip ilgili klasöre kaydeder",
          ],
          humanReview:
            "Taslaklar ilk dönemde gönderilmeden önce onaylanır; güven oluştukça hangi kategorilerin otomatik gideceğine siz karar verirsiniz.",
        },
        "customer-service": {
          title: "AI Müşteri Temsilcisi",
          summary:
            "Müşteri sorularını yanıtlayan, sipariş ve talep durumunu takip eden, çözemediğini ekibe devreden rol.",
          does: [
            "Ürün, teslimat ve iade sorularını yanıtlar",
            "Talep kaydı açar ve durumunu müşteriye bildirir",
            "Yanıtı bilinmeyen konuyu gerekçesiyle ekibe aktarır",
            "Tekrar eden şikâyet konularını raporlar",
          ],
          humanReview:
            "Para iadesi, istisna kararı ve memnuniyetsiz müşteri her zaman insana gider.",
        },
        sales: {
          title: "AI Satış Asistanı",
          summary:
            "Gelen talepleri niteleyen, CRM'i güncel tutan ve satışçının unuttuğu takipleri hatırlatan rol.",
          does: [
            "Gelen talebi önceden belirlenmiş ölçütlerle niteler",
            "CRM kaydını açar ve görüşme notlarını işler",
            "Takibi gecikmiş fırsatları listeler ve hatırlatır",
            "Görüşme öncesi müşteri hakkında kısa brifing hazırlar",
          ],
          humanReview:
            "Teklif, fiyat ve müzakere insana aittir; ajan yalnızca hazırlık yapar.",
        },
        research: {
          title: "AI Araştırmacı",
          summary:
            "Pazar, rakip ve aday araştırmalarını yapan, bulduğunu kaynaklarıyla özetleyen rol.",
          does: [
            "Rakip fiyat, ürün ve iletişim değişikliklerini takip eder",
            "Sektör haberlerini haftalık özet hâlinde derler",
            "Potansiyel müşteri veya tedarikçi listesi çıkarır",
            "Uzun belgeleri kaynak göstererek özetler",
          ],
          humanReview:
            "Özetler kaynak bağlantılarıyla gelir; karara esas olacak bilgi kaynağından doğrulanır.",
        },
        content: {
          title: "AI İçerik Editörü",
          summary:
            "Kurumun sesini öğrenip taslak üreten, yayın takvimini besleyen rol. Yayın kararı sizde kalır.",
          does: [
            "Blog, bülten ve sosyal medya taslakları yazar",
            "Mevcut içeriği farklı kanallar için uyarlar",
            "Yayın takvimini takip eder ve boşlukları bildirir",
            "Kurum diline uygunluk için mevcut metinleri düzenler",
          ],
          humanReview:
            "Hiçbir içerik onaysız yayınlanmaz; ajan yazar, yayın kararını insan verir.",
        },
        meeting: {
          title: "AI Toplantı Asistanı",
          summary:
            "Toplantıyı not alan, kararları ve görevleri çıkaran, kimsenin unutmadığından emin olan rol.",
          does: [
            "Toplantı kaydını yazıya döker ve özetler",
            "Alınan kararları ve kime ait olduğunu listeler",
            "Görevleri takip sistemine aktarır",
            "Bir sonraki toplantı öncesi açık maddeleri hatırlatır",
          ],
          humanReview:
            "Özet ve görev listesi toplantı sahibine onaya gider; kayıt için katılımcı bilgilendirmesi zorunludur.",
        },
        admin: {
          title: "AI Ofis Asistanı",
          summary:
            "Fatura, evrak ve takvim gibi idari işleri yürüten rol. En çok zaman kazandıran ama en dikkatli kurulması gereken ajan.",
          does: [
            "Gelen faturaları okur, kontrol eder ve muhasebeye iletir",
            "Belgeleri adlandırıp doğru klasöre arşivler",
            "Takvim çakışmalarını çözer ve toplantı ayarlar",
            "Tekrar eden raporları hazırlar",
          ],
          humanReview:
            "Ödeme, imza ve resmî bildirim gerektiren hiçbir adım ajan tarafından tamamlanmaz — yalnızca hazırlanır.",
        },
      },
    },
    requirements: {
      title: "Sizden gereken üç şey",
      description:
        "Kurulumun başarısı büyük ölçüde bunlara bağlı. Üçü de yoksa projeyi başlatmamanızı öneririz.",
      items: [
        {
          title: "Bir iç sahip",
          description:
            "Haftada birkaç saat ayırabilen, ajanın çıktısını gözden geçirecek ve kurulumdan sonra sistemi sahiplenecek bir kişi.",
        },
        {
          title: "Sistemlere erişim",
          description:
            "Ajanın bağlanacağı e-posta, CRM, takvim veya dosya sistemine yetki verilmesi. Erişim kapsamı en dar hâliyle tanımlanır.",
        },
        {
          title: "Hata payına tolerans",
          description:
            "İlk haftalarda ajan hata yapar ve düzeltilir. Sıfır hata bekleniyorsa o iş otomasyona uygun değildir.",
        },
      ],
    },
    limits: {
      title: "Nerede AI çalışan önermiyoruz",
      description:
        "Bu listeyi baştan paylaşıyoruz, çünkü yanlış işi otomatikleştirmek zaman kazandırmaz, yeni bir sorun üretir.",
      items: [
        "Hatanın geri alınamadığı işler — ödeme, resmî bildirim, sözleşme imzası",
        "Ayda birkaç kez yapılan işler — kurulum maliyeti kazancı geçer",
        "Kuralı yazıya dökülemeyen, tamamen sezgiye dayalı kararlar",
        "Çalışanın işinin tamamı — bir rolü değil, o rolün tekrar eden parçalarını devralırız",
        "Verisi dağınık ve güvenilmez olan süreçler — önce veriyi düzeltmek gerekir",
      ],
    },
    dataProtection: {
      title: "Veri güvenliği ve KVKK",
      paragraphs: [
        "AI çalışanları kurmak, kurumunuzun verisinin bir kısmının bir yapay zekâ sağlayıcısından geçmesi demektir. Bunu projenin başında, teknik detaylarıyla ve yazılı olarak konuşuruz.",
        "Her ajan yalnızca işini yapmak için gereken en dar erişimle kurulur. Hangi verinin nereye gittiği, ne kadar süre saklandığı ve kimlerin eriştiği kurulum dokümanında açıkça yazılır.",
        "Kişisel veri işleyen her ajan için KVKK uyumu ayrıca değerlendirilir; gerekli olduğunda aydınlatma metinleriniz ve veri işleme envanteriniz güncellenir. Bu değerlendirme olmadan kurulumu başlatmayız.",
      ],
    },
    engagement: {
      title: "Çalışma modeli",
      description:
        "Küçük ve orta ölçekli işletmeler için tasarlandı. Kapsam ve süre baştan bellidir.",
      models: [
        {
          title: "İş envanteri",
          description:
            "1 haftalık analiz. Ekibin zamanının nereye gittiğini ve hangi işlerin devredilebileceğini puanlanmış bir listeyle çıkarır.",
        },
        {
          title: "Tek ajan pilotu",
          description:
            "4 hafta. Bir AI çalışanın kurulumu, gözetimli çalıştırılması, ölçümü ve devri. En sık başlangıç noktası.",
        },
        {
          title: "AI Workforce kurulumu",
          description:
            "3–6 ay. Birbirine bağlı birden fazla ajanın kademeli kurulumu, ortak yönetim paneli ve iç ekibin yetkinleştirilmesi.",
        },
        {
          title: "Bakım ve gözetim",
          description:
            "Aylık. Kurulan ajanların izlenmesi, hata düzeltmeleri ve yeni ihtiyaçlara göre güncellenmesi.",
        },
      ],
    },
    cta: {
      title: "Hangi işinizi devredebileceğinizi konuşalım",
      description:
        "30 dakikalık ilk görüşmede şirketinizde tekrar eden işleri birlikte gözden geçirir, hangisinin pilot için uygun olduğunu ücretsiz değerlendiririz.",
    },
  },
  careers: {
    hero: {
      eyebrow: "Kariyer",
      title: "Bizimle çalışır mısınız?",
      description:
        "NAVIAR yeni kurulan bir danışmanlık firması. Bu, kurulmuş bir düzene katılmak yerine düzeni birlikte kuracağınız anlamına geliyor. Merak eden, sorumluluk almaktan çekinmeyen ve işin sahada karşılığını görmek isteyen insanlarla çalışmak istiyoruz.",
    },
    culture: {
      title: "Burada çalışmak nasıl?",
      description:
        "Danışmanlıkta çalışma koşullarının nasıl olabileceğini biliyoruz. Kurarken bilinçli olarak farklı tercihler yaptık.",
      items: [
        {
          title: "Gerçek sorumluluk, erken",
          description:
            "Kıdeminiz ne olursa olsun müşteriyle aynı masada oturursunuz. Yıllarca slayt hazırlayıp beklemezsiniz.",
        },
        {
          title: "Sürdürülebilir tempo",
          description:
            "Yoğun dönemler olur, ama gece yarısı mesaisi bizde başarı göstergesi değil, planlama hatasıdır.",
        },
        {
          title: "Öğrenme bütçesi ve zamanı",
          description:
            "Her danışman için yıllık eğitim ve sertifikasyon bütçesi ile bunu kullanacak takvim ayrılır.",
        },
        {
          title: "Hibrit çalışma",
          description:
            "Müşteri sahasında olmadığınız günlerde nereden çalışacağınıza siz karar verirsiniz.",
        },
        {
          title: "Şeffaf kariyer yolu",
          description:
            "Kademe tanımları ve terfi kriterleri ilk günden yazılıydı. Müşterilerimize kurmayı önerdiğimiz sistemi, ilk çalışanımızı işe almadan önce kendimize kurduk.",
        },
        {
          title: "Küçük ekip, yakın geri bildirim",
          description:
            "Her projede kıdemli bir danışmanla birlikte çalışır, geri bildirimi yıl sonunda değil hafta içinde alırsınız.",
        },
      ],
    },
    process: {
      title: "İşe alım süreci",
      description:
        "Süreç ortalama üç hafta sürer. Her aşamanın sonunda, olumlu ya da olumsuz, geri dönüş yaparız.",
      steps: [
        {
          step: "01",
          title: "Başvuru",
          description:
            "Özgeçmişinizi ve kısa bir ön yazıyı iletirsiniz. Ön yazıda neden bu işi istediğinizi okumak bizim için özgeçmişten daha değerli.",
          activities: [],
        },
        {
          step: "02",
          title: "Tanışma görüşmesi",
          description:
            "45 dakikalık bir görüşme. Deneyiminizi konuşur, sizin de bize soru sorabilmeniz için zaman ayırırız.",
          activities: [],
        },
        {
          step: "03",
          title: "Vaka çalışması",
          description:
            "Kurucularımızın geçmiş projelerinden anonimleştirilmiş bir vaka üzerinde birlikte çalışırız. Sınav değil, birlikte düşünme denemesidir.",
          activities: [],
        },
        {
          step: "04",
          title: "Teklif",
          description:
            "Karar ve teklif en geç bir hafta içinde iletilir. Ücret aralığını görüşmenin başında paylaşırız.",
          activities: [],
        },
      ],
    },
    openings: {
      eyebrow: "Açık pozisyonlar",
      title: "Şu anda aradığımız arkadaşlar",
      description:
        "Aşağıdaki başlıklardan biri size uyuyorsa doğrudan başvurabilirsiniz. Tam olarak uymuyorsa da açık başvuru kanalımız her zaman açık.",
      viewJob: "İlanı görüntüle",
    },
    labels: {
      team: "Ekip",
      type: "Çalışma şekli",
      location: "Konum",
      experience: "Deneyim",
      responsibilities: "Bu rolde ne yapacaksınız",
      requirements: "Sizden beklediklerimiz",
      bonus: "Artı olur",
      backToList: "Tüm pozisyonlar",
      apply: "Bu pozisyona başvurun",
      applyDescription:
        "Özgeçmişinizi ve kısa bir ön yazıyı e-posta ile gönderin. Başvuru teyidini genellikle iki iş günü içinde iletiriz.",
      applyEmail: "kariyer@naviar.com",
      applySubjectSuffix: "başvurusu",
    },
    jobs: {
      "kidemli-yonetim-danismani": {
        title: "Kıdemli Yönetim Danışmanı",
        team: "Yönetim & Strateji",
        type: "Tam zamanlı",
        location: "İstanbul · Hibrit",
        experience: "5+ yıl",
        summary:
          "Strateji ve organizasyon projelerini uçtan uca yürütecek, müşteri yönetim ekibiyle doğrudan çalışacak bir danışman arıyoruz. Projeyi analizden uygulamaya taşıyan ve bu sırada daha genç danışmanları geliştiren bir rol.",
        responsibilities: [
          "Strateji, organizasyon tasarımı ve süreç iyileştirme projelerini uçtan uca yürütmek",
          "Müşterinin yönetim ekibiyle doğrudan iletişim kurmak ve bulguları savunmak",
          "Analiz yaklaşımını kurgulamak, veriyi bulguya ve öneriye dönüştürmek",
          "Ortak çalışma atölyelerini tasarlamak ve yönetmek",
          "Proje ekibindeki danışmanlara mentorluk yapmak ve geri bildirim vermek",
          "Teklif hazırlığı ve kapsam belirleme çalışmalarına katkı vermek",
        ],
        requirements: [
          "Yönetim danışmanlığı veya kurumsal strateji alanında en az 5 yıl deneyim",
          "Analitik düşünme ve karmaşık bir sorunu sade bir anlatıya indirgeyebilme",
          "Üst yönetim seviyesinde ikna edici sunum ve müzakere becerisi",
          "Excel ve sunum araçlarında ileri düzey yetkinlik",
          "Türkçe ve İngilizce iş ortamında akıcı iletişim",
          "Proje gereği İstanbul içi ve zaman zaman şehir dışı seyahate açık olmak",
        ],
        bonus: [
          "Organizasyon tasarımı veya performans yönetimi projelerinde birincil sorumluluk almış olmak",
          "Belirli bir sektörde (üretim, perakende, finans, teknoloji) derinleşmiş olmak",
          "İşletme veya mühendislik alanında yüksek lisans",
        ],
      },
      "insan-kaynaklari-danismani": {
        title: "İnsan Kaynakları Danışmanı",
        team: "İK & Kurumsal Eğitim",
        type: "Tam zamanlı",
        location: "İstanbul · Hibrit",
        experience: "3+ yıl",
        summary:
          "Yetkinlik modeli, kariyer mimarisi ve performans sistemleri kuran; bunları tasarlamakla kalmayıp müşteri kurumda gerçekten işler hale getiren bir danışman arıyoruz.",
        responsibilities: [
          "Yetkinlik modeli, kademe yapısı ve kariyer mimarisi tasarlamak",
          "Performans yönetimi ve hedef belirleme sistemlerini kurmak",
          "İşe alım süreçlerini yapılandırmak, mülakat rehberleri hazırlamak",
          "Çalışan nabız ölçümü ve analiz çalışmalarını yürütmek",
          "Tasarlanan sistemin devreye alınmasında müşteri İK ekibine eşlik etmek",
        ],
        requirements: [
          "İnsan kaynakları alanında en az 3 yıl deneyim; tercihen danışmanlık veya kurumsal İK",
          "Yetkinlik bazlı sistemler konusunda uygulamalı bilgi",
          "İş kanunu ve KVKK'nın İK süreçlerine yansımaları hakkında temel hâkimiyet",
          "Veriyle çalışma ve bulgularını yöneticilere anlatabilme",
          "Türkçe ve İngilizce iş ortamında akıcı iletişim",
        ],
        bonus: [
          "Ücret ve yan haklar yapılandırması deneyimi",
          "İK bilgi sistemi (HRIS) kurulum veya geçiş projesinde yer almış olmak",
          "Ölçme değerlendirme araçlarında sertifikasyon",
        ],
      },
      "kurumsal-egitim-tasarimcisi": {
        title: "Kurumsal Eğitim Tasarımcısı",
        team: "İK & Kurumsal Eğitim",
        type: "Tam zamanlı",
        location: "İstanbul · Hibrit",
        experience: "3+ yıl",
        summary:
          "Liderlik ve yetkinlik gelişim programlarını tasarlayacak, iç eğitmenleri yetiştirecek ve programın katılım değil davranış değişimi üzerinden ölçülmesini sağlayacak bir tasarımcı arıyoruz.",
        responsibilities: [
          "Eğitim ihtiyaç analizi yapmak ve program mimarisini kurgulamak",
          "Vaka, simülasyon ve atölye içeriklerini yazmak",
          "Programları bizzat yürütmek ve iç eğitmenleri yetiştirmek",
          "Etki ölçüm tasarımını kurmak ve sonuçları raporlamak",
          "Dijital öğrenme içeriklerinin üretimini yönetmek",
        ],
        requirements: [
          "Kurumsal eğitim veya öğrenme tasarımı alanında en az 3 yıl deneyim",
          "Yetişkin öğrenmesi ilkelerine hâkimiyet ve bunu tasarıma yansıtabilme",
          "Grup önünde kolaylaştırıcılık deneyimi",
          "Program etkisini ölçme konusunda uygulamalı yaklaşım",
          "Türkçe ve İngilizce iş ortamında akıcı iletişim",
        ],
        bonus: [
          "Liderlik gelişim programı tasarlamış olmak",
          "Koçluk sertifikasyonu",
          "Dijital öğrenme araçlarında üretim deneyimi",
        ],
      },
      "danismanlik-stajyeri": {
        title: "Danışmanlık Stajyeri",
        team: "Yönetim & Strateji",
        type: "Yarı zamanlı staj · 6 ay",
        location: "İstanbul · Hibrit",
        experience: "Öğrenci veya yeni mezun",
        summary:
          "Danışmanlığın gerçekte ne olduğunu öğrenmek isteyen bir öğrenci ya da yeni mezun arıyoruz. Fotokopi işi değil; gerçek projelerde analiz ve araştırma sorumluluğu alacaksınız. Staj ücretlidir.",
        responsibilities: [
          "Pazar, rakip ve sektör araştırmaları yapmak",
          "Veri derlemek, temizlemek ve analiz için hazırlamak",
          "Görüşme notlarını yapılandırmak ve bulgu taslakları hazırlamak",
          "Sunum ve rapor hazırlığına katkı vermek",
        ],
        requirements: [
          "İşletme, ekonomi, mühendislik veya ilgili bir bölümde son sınıf öğrencisi ya da yeni mezun",
          "Excel ve sunum araçlarında rahat çalışabilme",
          "Yazılı anlatımda düzen ve açıklık",
          "Haftada en az üç gün ayırabilme",
          "İngilizce okuduğunu anlama düzeyinde yeterlilik",
        ],
        bonus: [
          "Öğrenci kulübü veya vaka yarışması deneyimi",
          "Veri görselleştirme araçlarına aşinalık",
        ],
      },
    },
    openApplication: {
      title: "Açık pozisyonlar arasında size uyan yok mu?",
      description:
        "İyi insanlar için ilan beklemeyiz. Ne yaptığınızı ve NAVIAR'da neyi yapmak istediğinizi anlatan kısa bir e-posta yeterli. Uygun bir açık doğduğunda ilk size döneriz.",
      action: "Açık başvuru gönderin",
    },
  },
  privacy: {
    hero: {
      eyebrow: "Gizlilik",
      title: "Kişisel verilerin korunması hakkında aydınlatma metni",
      description:
        "Bu metin, NAVIAR olarak sitemiz üzerinden ilettiğiniz kişisel verileri hangi amaçla işlediğimizi, kimlerle paylaştığımızı ve bu konudaki haklarınızı açıklar.",
    },
    updated: "Son güncelleme: 18 Ağustos 2026",
    sections: [
      {
        title: "1. Veri sorumlusu",
        paragraphs: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu NAVIAR'dır. Bu metinde açıklanan işleme faaliyetleriyle ilgili her türlü soru ve talebinizi aşağıdaki iletişim kanallarından bize iletebilirsiniz.",
        ],
        bullets: [
          "E-posta: info@naviar.com",
          "Adres: İstanbul, Türkiye",
        ],
      },
      {
        title: "2. İşlediğimiz kişisel veriler",
        paragraphs: [
          "Sitemizde yalnızca iletişim formu üzerinden kendi isteğinizle paylaştığınız verileri işleriz. Formu doldurmadığınız sürece sizden herhangi bir kişisel veri toplanmaz.",
        ],
        bullets: [
          "Kimlik ve iletişim bilgisi: ad soyad, e-posta adresi, telefon numarası (isteğe bağlı)",
          "Mesleki bilgi: çalıştığınız kurumun adı (isteğe bağlı)",
          "Talep içeriği: seçtiğiniz konu başlığı ve yazdığınız mesaj",
        ],
      },
      {
        title: "3. İşleme amacı ve hukuki sebep",
        paragraphs: [
          "Paylaştığınız veriler yalnızca talebinizi değerlendirmek, size geri dönüş yapmak ve olası bir danışmanlık ilişkisinin ön görüşmesini yürütmek amacıyla işlenir. Bu işleme, KVKK'nın 5. maddesinin ikinci fıkrasının (c) bendi kapsamında bir sözleşmenin kurulmasıyla doğrudan ilgili olması ve (f) bendi kapsamında meşru menfaatimiz hukuki sebeplerine dayanır.",
          "Verileriniz pazarlama amacıyla kullanılmaz, üçüncü kişilere satılmaz ve sizden ayrıca açık rıza almadan bülten benzeri gönderimlere dahil edilmez.",
        ],
      },
      {
        title: "4. Aktarım ve hizmet sağlayıcılar",
        paragraphs: [
          "Talebinizi teslim alabilmek için sınırlı sayıda hizmet sağlayıcıdan yararlanırız. Bu sağlayıcılar verilerinize yalnızca hizmeti sunmak için gereken ölçüde erişir ve sözleşme ile gizliliğe bağlıdır.",
        ],
        bullets: [
          "Sitenin barındırıldığı altyapı sağlayıcısı",
          "Form taleplerinin iletilmesinde kullanılan e-posta servis sağlayıcısı",
        ],
      },
      {
        title: "5. Çerezler ve ölçüm",
        paragraphs: [
          "Bu sitede reklam veya takip amaçlı çerez kullanılmaz.",
          "Sitenin ölçümü, çerez kullanmadan ve kalıcı bir kimlik oluşturmadan çalışacak şekilde tasarlanmıştır. Ölçülen tek şey hangi sayfanın açıldığı ve hangi bağlantının tıklandığıdır; olay yükünde serbest metin alanı yoktur, dolayısıyla forma yazdığınız içerik ölçüme girmez. Ziyaretler birbirine bağlanmaz, sizi tanımlayan bir değer saklanmaz. Bu nedenle onay bandı gösterilmez.",
          "Ölçüm sağlayıcısı yapılandırılmadığı sürece tarayıcınızdan hiçbir olay gönderilmez. Kullanılan sağlayıcı değiştiğinde bu metin güncellenir.",
        ],
      },
      {
        title: "6. Saklama süresi",
        paragraphs: [
          "Talebinizi ve yazışmamızı, görüşme süreci sonuçlanana kadar ve sonrasında hukuki zorunlulukların gerektirdiği süre boyunca saklarız. Bu sürenin sonunda verileriniz silinir veya anonim hâle getirilir. Daha erken silinmesini talep edebilirsiniz.",
        ],
      },
      {
        title: "7. Haklarınız",
        paragraphs: [
          "KVKK'nın 11. maddesi uyarınca kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:",
        ],
        bullets: [
          "Kişisel verinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme",
          "Verilerin aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
          "Kanundaki şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
          "Yapılan işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
          "İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
          "Verilerin hukuka aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        ],
      },
      {
        title: "8. Başvuru",
        paragraphs: [
          "Haklarınızı kullanmak için taleplerinizi yukarıda belirtilen e-posta adresine iletebilirsiniz. Başvurunuz en geç otuz gün içinde sonuçlandırılır. Talebinize verilen yanıtı yeterli bulmazsanız Kişisel Verileri Koruma Kurulu'na şikâyette bulunma hakkınız saklıdır.",
        ],
      },
    ],
    disclaimer:
      "Bu metin bilgilendirme amacıyla hazırlanmıştır ve hukuki danışmanlık yerine geçmez. Yayına almadan önce firmanızın ticari unvanı, adresi ve kullandığınız hizmet sağlayıcılarla güncelleyip bir hukuk danışmanına inceletmenizi öneririz.",
  },
  notFound: {
    title: "Aradığınız sayfayı bulamadık",
    description:
      "Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfadan devam edebilirsiniz.",
  },
  error: {
    title: "Bir şeyler ters gitti",
    description:
      "Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar denemek sorunu çözmezse bize ulaşabilirsiniz.",
    retry: "Tekrar dene",
  },
  footer: {
    about:
      "Yönetim ve strateji danışmanlığı ile insan kaynakları ve kurumsal eğitim alanlarında, kurumların büyüme hedeflerini uygulanabilir sistemlere dönüştürüyoruz.",
    navTitle: "Sayfalar",
    contactTitle: "İletişim",
    legal: "Bu sitede yer alan içerikler bilgilendirme amaçlıdır.",
    privacyLink: "Gizlilik ve KVKK",
    rights: "Tüm hakları saklıdır.",
  },
};
