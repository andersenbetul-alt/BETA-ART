/* Naviar – språk på flaten.

   Ti språk, korte strenger. Ikke fordi vi tror alle kundene er nye i Norge,
   men fordi den som bestiller ofte er datteren i Oslo mens moren snakker
   polsk, eller sønnen i London mens faren snakker norsk. Språkvalget følger
   personen, ikke landet.

   To ting gjør dette til mer enn en tekstfil:

   1. Valget følger med ut. En side på polsk og en SMS på norsk er ikke
      oversatt – det er en side som ser oversatt ut. Derfor har hver flate
      som sender noe, et språkfelt: bestilling, SMS, e-post, oppsummering.

   2. Et språk kan ikke åpnes før akuttsetningen er lest av et menneske som
      snakker det. Alt annet tåler en dårlig oversettelse en uke. «Ring 113
      ved fare for liv» gjør det ikke, og et telefonnummer som forsvinner i
      en setning ingen forstår, er verre enn ingen setning.

   Nummerne står som siffer i alle språk. Sifre trenger ingen oversettelse, og
   det er den delen som ikke kan være feil.

   Og én ting til, som ikke er en teknisk detalj: en side på arabisk lover
   ikke en samtale på arabisk. Samtalen går på de språkene eksperten faktisk
   har oppgitt. De to blandes lett, og skuffelsen er stor. */

window.PP_SPRAK_UI = (function () {
  'use strict';

  /* Utvalget er vektet mot Norge, ikke mot verden alene: de største
     innvandrergruppene her, pluss de av verdensspråkene som familier på
     avstand faktisk bruker. Engelsk er med av begge grunner. */
  var SPRAK = [
    { kode: 'nb', navn: 'Norsk',     eget: 'Norsk bokmål', dir: 'ltr', kilde: true },
    { kode: 'en', navn: 'Engelsk',   eget: 'English',      dir: 'ltr' },
    { kode: 'pl', navn: 'Polsk',     eget: 'Polski',       dir: 'ltr' },
    { kode: 'lt', navn: 'Litauisk',  eget: 'Lietuvių',     dir: 'ltr' },
    { kode: 'uk', navn: 'Ukrainsk',  eget: 'Українська',   dir: 'ltr' },
    { kode: 'ru', navn: 'Russisk',   eget: 'Русский',      dir: 'ltr' },
    { kode: 'ar', navn: 'Arabisk',   eget: 'العربية',       dir: 'rtl' },
    { kode: 'so', navn: 'Somali',    eget: 'Soomaali',     dir: 'ltr' },
    { kode: 'ti', navn: 'Tigrinja',  eget: 'ትግርኛ',        dir: 'ltr' },
    { kode: 'es', navn: 'Spansk',    eget: 'Español',      dir: 'ltr' }
  ];

  /* Flatene språkvalget må følge med til. Mangler én av dem, er oversettelsen
     halv – og den halve er den som sendes når kunden ikke sitter foran
     skjermen og kan gjette seg fram. */
  var FLATER = ['nettside', 'bestilling', 'sms', 'epost', 'oppsummering'];

  var T = {
    nb: {
      lofte: 'Få riktig hjelp på 45 minutter.',
      slagord: 'Én samtale. Tre tydelige neste steg.',
      knapp: 'Finn riktig ekspert',
      alt: 'Familien kan bestille. Den eldre bestemmer.',
      s1: 'Fortell hva du trenger.',
      s2: 'Vi finner riktig ekspert.',
      s3: 'Velg en ledig tid.',
      s4: 'Få tre tydelige neste steg.',
      veiviser: 'Hvem skal jeg kontakte?',
      q1: 'Hva gjelder det?',
      q2: 'Hvem gjelder det?',
      q3: 'Hvor mye haster det?',
      k_nav: 'NAV og pensjon',
      k_kommune: 'Kommune og omsorg',
      k_digital: 'Digital offentlig hjelp',
      telefon: 'Telefon', video: 'Video', minutter: '45 minutter',
      pris: 'Pris', ledig: 'Neste ledige tid', bestill: 'Bestill', avbryt: 'Avbryt',
      verifisert: 'Verifisert erfaring',
      venter: 'Venter på godkjenning',
      garanti: 'Feil ekspert? Ny samtale uten ekstra kostnad.',
      akutt: 'Ikke for akutt hjelp. Ring 116 117. Ring 113 ved fare for liv.',
      steg: 'Dette gjør du nå',
      sms: 'Påminnelse: samtalen din er i morgen.',
      epost: 'Avtalen er bekreftet.',
      oppfolging: 'Fikk du gjort det du skulle?',
      samtalesprak: 'Samtalen går på språkene eksperten har oppgitt.'
    },
    en: {
      lofte: 'Get the right help in 45 minutes.',
      slagord: 'One call. Three clear next steps.',
      knapp: 'Find the right expert',
      alt: 'The family can book. The older person decides.',
      s1: 'Tell us what you need.',
      s2: 'We find the right expert.',
      s3: 'Choose an available time.',
      s4: 'Get three clear next steps.',
      veiviser: 'Who should I contact?',
      q1: 'What is it about?',
      q2: 'Who is it for?',
      q3: 'How urgent is it?',
      k_nav: 'NAV and pensions',
      k_kommune: 'Municipal and care services',
      k_digital: 'Digital public services',
      telefon: 'Phone', video: 'Video', minutter: '45 minutes',
      pris: 'Price', ledig: 'Next available time', bestill: 'Book', avbryt: 'Cancel',
      verifisert: 'Verified experience',
      venter: 'Waiting for approval',
      garanti: 'Wrong expert? A new call at no extra cost.',
      akutt: 'Not for emergencies. Call 116 117. Call 113 if life is at risk.',
      steg: 'What to do now',
      sms: 'Reminder: your call is tomorrow.',
      epost: 'Your booking is confirmed.',
      oppfolging: 'Were you able to do it?',
      samtalesprak: 'The call is held in the languages the expert has listed.'
    },
    pl: {
      lofte: 'Uzyskaj właściwą pomoc w 45 minut.',
      slagord: 'Jedna rozmowa. Trzy jasne kroki.',
      knapp: 'Znajdź właściwego eksperta',
      alt: 'Rodzina może zarezerwować. Osoba starsza decyduje.',
      s1: 'Powiedz, czego potrzebujesz.',
      s2: 'Znajdziemy właściwego eksperta.',
      s3: 'Wybierz wolny termin.',
      s4: 'Otrzymaj trzy jasne kroki.',
      veiviser: 'Z kim mam się skontaktować?',
      q1: 'Czego to dotyczy?',
      q2: 'Kogo to dotyczy?',
      q3: 'Jak bardzo to pilne?',
      k_nav: 'NAV i emerytury',
      k_kommune: 'Gmina i usługi opiekuńcze',
      k_digital: 'Cyfrowe usługi publiczne',
      telefon: 'Telefon', video: 'Wideo', minutter: '45 minut',
      pris: 'Cena', ledig: 'Najbliższy wolny termin', bestill: 'Zarezerwuj', avbryt: 'Anuluj',
      verifisert: 'Zweryfikowane doświadczenie',
      venter: 'Czeka na zgodę',
      garanti: 'Niewłaściwy ekspert? Nowa rozmowa bez dodatkowych kosztów.',
      akutt: 'To nie jest pomoc w nagłych wypadkach. Zadzwoń 116 117. Zadzwoń 113, gdy zagrożone jest życie.',
      steg: 'Co teraz zrobić',
      sms: 'Przypomnienie: Twoja rozmowa jest jutro.',
      epost: 'Rezerwacja potwierdzona.',
      oppfolging: 'Czy udało Ci się to załatwić?',
      samtalesprak: 'Rozmowa odbywa się w językach podanych przez eksperta.'
    },
    lt: {
      lofte: 'Gaukite tinkamą pagalbą per 45 minutes.',
      slagord: 'Vienas pokalbis. Trys aiškūs žingsniai.',
      knapp: 'Rasti tinkamą ekspertą',
      alt: 'Šeima gali užsakyti. Vyresnis žmogus sprendžia.',
      s1: 'Pasakykite, ko jums reikia.',
      s2: 'Mes surasime tinkamą ekspertą.',
      s3: 'Pasirinkite laisvą laiką.',
      s4: 'Gaukite tris aiškius žingsnius.',
      veiviser: 'Į ką turėčiau kreiptis?',
      q1: 'Su kuo tai susiję?',
      q2: 'Kam to reikia?',
      q3: 'Kiek tai skubu?',
      k_nav: 'NAV ir pensijos',
      k_kommune: 'Savivaldybės ir globos paslaugos',
      k_digital: 'Skaitmeninės viešosios paslaugos',
      telefon: 'Telefonas', video: 'Vaizdo skambutis', minutter: '45 minutės',
      pris: 'Kaina', ledig: 'Artimiausias laisvas laikas', bestill: 'Užsakyti', avbryt: 'Atšaukti',
      verifisert: 'Patvirtinta patirtis',
      venter: 'Laukiama patvirtinimo',
      garanti: 'Netinkamas ekspertas? Naujas pokalbis be papildomo mokesčio.',
      akutt: 'Tai ne skubi pagalba. Skambinkite 116 117. Skambinkite 113, kai gresia pavojus gyvybei.',
      steg: 'Ką daryti dabar',
      sms: 'Priminimas: jūsų pokalbis rytoj.',
      epost: 'Užsakymas patvirtintas.',
      oppfolging: 'Ar pavyko tai padaryti?',
      samtalesprak: 'Pokalbis vyksta eksperto nurodytomis kalbomis.'
    },
    uk: {
      lofte: 'Отримайте потрібну допомогу за 45 хвилин.',
      slagord: 'Одна розмова. Три чіткі наступні кроки.',
      knapp: 'Знайти потрібного фахівця',
      alt: 'Родина може забронювати. Літня людина вирішує.',
      s1: 'Розкажіть, що вам потрібно.',
      s2: 'Ми знайдемо потрібного фахівця.',
      s3: 'Оберіть вільний час.',
      s4: 'Отримайте три чіткі кроки.',
      veiviser: 'До кого мені звернутися?',
      q1: 'Чого це стосується?',
      q2: 'Кого це стосується?',
      q3: 'Наскільки це терміново?',
      k_nav: 'NAV і пенсії',
      k_kommune: 'Комуна та служби догляду',
      k_digital: 'Цифрові державні послуги',
      telefon: 'Телефон', video: 'Відео', minutter: '45 хвилин',
      pris: 'Ціна', ledig: 'Найближчий вільний час', bestill: 'Забронювати', avbryt: 'Скасувати',
      verifisert: 'Підтверджений досвід',
      venter: 'Очікує підтвердження',
      garanti: 'Не той фахівець? Нова розмова без додаткової оплати.',
      akutt: 'Це не екстрена допомога. Телефонуйте 116 117. Телефонуйте 113, якщо є загроза життю.',
      steg: 'Що робити зараз',
      sms: 'Нагадування: ваша розмова завтра.',
      epost: 'Бронювання підтверджено.',
      oppfolging: 'Чи вдалося вам це зробити?',
      samtalesprak: 'Розмова відбувається мовами, які вказав фахівець.'
    },
    ru: {
      lofte: 'Получите нужную помощь за 45 минут.',
      slagord: 'Один разговор. Три ясных шага.',
      knapp: 'Найти нужного специалиста',
      alt: 'Семья может записать. Пожилой человек решает.',
      s1: 'Расскажите, что вам нужно.',
      s2: 'Мы найдём нужного специалиста.',
      s3: 'Выберите свободное время.',
      s4: 'Получите три ясных шага.',
      veiviser: 'К кому мне обратиться?',
      q1: 'О чём идёт речь?',
      q2: 'Для кого это?',
      q3: 'Насколько это срочно?',
      k_nav: 'NAV и пенсии',
      k_kommune: 'Коммуна и службы ухода',
      k_digital: 'Цифровые государственные услуги',
      telefon: 'Телефон', video: 'Видео', minutter: '45 минут',
      pris: 'Цена', ledig: 'Ближайшее свободное время', bestill: 'Записаться', avbryt: 'Отменить',
      verifisert: 'Подтверждённый опыт',
      venter: 'Ожидает подтверждения',
      garanti: 'Не тот специалист? Новый разговор без доплаты.',
      akutt: 'Это не экстренная помощь. Звоните 116 117. Звоните 113, если есть угроза жизни.',
      steg: 'Что делать сейчас',
      sms: 'Напоминание: ваш разговор завтра.',
      epost: 'Запись подтверждена.',
      oppfolging: 'Удалось ли вам это сделать?',
      samtalesprak: 'Разговор проходит на языках, указанных специалистом.'
    },
    ar: {
      lofte: 'احصل على المساعدة الصحيحة في 45 دقيقة.',
      slagord: 'مكالمة واحدة. ثلاث خطوات واضحة.',
      knapp: 'ابحث عن الخبير المناسب',
      alt: 'يمكن للعائلة الحجز. الشخص المسنّ هو من يقرر.',
      s1: 'أخبرنا بما تحتاجه.',
      s2: 'نجد لك الخبير المناسب.',
      s3: 'اختر وقتًا متاحًا.',
      s4: 'احصل على ثلاث خطوات واضحة.',
      veiviser: 'بمن ينبغي أن أتصل؟',
      q1: 'بماذا يتعلق الأمر؟',
      q2: 'لمن هذه المساعدة؟',
      q3: 'ما مدى الاستعجال؟',
      k_nav: 'NAV والمعاشات',
      k_kommune: 'البلدية وخدمات الرعاية',
      k_digital: 'الخدمات العامة الرقمية',
      telefon: 'هاتف', video: 'فيديو', minutter: '45 دقيقة',
      pris: 'السعر', ledig: 'أقرب وقت متاح', bestill: 'احجز', avbryt: 'إلغاء',
      verifisert: 'خبرة موثّقة',
      venter: 'في انتظار الموافقة',
      garanti: 'الخبير غير مناسب؟ مكالمة جديدة بدون تكلفة إضافية.',
      akutt: 'هذه ليست خدمة طوارئ. اتصل بالرقم 116 117. اتصل بالرقم 113 عند وجود خطر على الحياة.',
      steg: 'ما عليك فعله الآن',
      sms: 'تذكير: مكالمتك غدًا.',
      epost: 'تم تأكيد الحجز.',
      oppfolging: 'هل تمكّنت من إنجاز ذلك؟',
      samtalesprak: 'تجري المكالمة باللغات التي ذكرها الخبير.'
    },
    so: {
      lofte: 'Hel caawimaadda saxda ah 45 daqiiqo gudahood.',
      slagord: 'Hal wicitaan. Saddex tallaabo oo cad.',
      knapp: 'Raadi khabiirka saxda ah',
      alt: 'Qoysku wuu ballansan karaa. Qofka waayeelka ah ayaa go’aaminaya.',
      s1: 'Noo sheeg waxaad u baahan tahay.',
      s2: 'Waxaan helnaa khabiirka saxda ah.',
      s3: 'Dooro waqti banaan.',
      s4: 'Hel saddex tallaabo oo cad.',
      veiviser: 'Yaan la xiriiraa?',
      q1: 'Maxay khusaysaa?',
      q2: 'Yay u tahay?',
      q3: 'Intee in le’eg ayay degdeg u tahay?',
      k_nav: 'NAV iyo hawlgab',
      k_kommune: 'Degmada iyo adeegyada daryeelka',
      k_digital: 'Adeegyada dowladda ee dhijitaalka ah',
      telefon: 'Telefoon', video: 'Fiidiyow', minutter: '45 daqiiqo',
      pris: 'Qiimaha', ledig: 'Waqtiga banaan ee xiga', bestill: 'Ballanso', avbryt: 'Jooji',
      verifisert: 'Khibrad la xaqiijiyay',
      venter: 'Sugaya ansixin',
      garanti: 'Khabiir khaldan? Wicitaan cusub oo lacag dheeraad ah aan lahayn.',
      akutt: 'Kuma habboona gurmad degdeg ah. Wac 116 117. Wac 113 haddii nolosha khatar ku jirto.',
      steg: 'Waxa aad hadda samayso',
      sms: 'Xusuusin: wicitaankaagu waa berri.',
      epost: 'Ballantaada waa la xaqiijiyay.',
      oppfolging: 'Ma awooday inaad sameyso?',
      samtalesprak: 'Wicitaanku wuxuu ku dhacaa luqadaha uu khabiirku sheegay.'
    },
    ti: {
      lofte: 'ኣብ 45 ደቒቕ ቅኑዕ ሓገዝ ርኸብ።',
      slagord: 'ሓደ ዘተ። ሰለስተ ንጹራት ስጉምትታት።',
      knapp: 'ቅኑዕ ክኢላ ርኸብ',
      alt: 'ስድራቤት ክትሓዝእ ትኽእል። ዓባይ/ዓቢ ሰብ ይውስን።',
      s1: 'እንታይ ከም እትደሊ ንገረና።',
      s2: 'ቅኑዕ ክኢላ ንረኽበልካ።',
      s3: 'ናጻ ግዜ ምረጽ።',
      s4: 'ሰለስተ ንጹራት ስጉምትታት ርኸብ።',
      veiviser: 'ንመን ክውከስ ኣለኒ፧',
      q1: 'ብዛዕባ እንታይ እዩ፧',
      q2: 'ንመን እዩ፧',
      q3: 'ክንደይ ይጠብቕ፧',
      k_nav: 'NAV ከምኡ’ውን ጡረታ',
      k_kommune: 'ኮሙነን ናይ ክንክን ኣገልግሎታትን',
      k_digital: 'ዲጂታላዊ ናይ መንግስቲ ኣገልግሎታት',
      telefon: 'ተለፎን', video: 'ቪድዮ', minutter: '45 ደቒቕ',
      pris: 'ዋጋ', ledig: 'ዝቕጽል ናጻ ግዜ', bestill: 'ሓዝእ', avbryt: 'ሰርዝ',
      verifisert: 'ዝተረጋገጸ ተመክሮ',
      venter: 'ፍቓድ ይጽበ ኣሎ',
      garanti: 'ዘይቅኑዕ ክኢላ፧ ብዘይ ተወሳኺ ክፍሊት ሓድሽ ዘተ።',
      akutt: 'ንህጹጽ ሓገዝ ኣይኰነን። 116 117 ደውል። ሕይወት ኣብ ሓደጋ እንተ ኣልዩ 113 ደውል።',
      steg: 'ሕጂ እትገብሮ',
      sms: 'መዘኻኸሪ፦ ዘተኻ ጽባሕ እዩ።',
      epost: 'ዕዳጋኻ ተረጋጊጹ።',
      oppfolging: 'ክትገብሮ ክኢልካ ዶ፧',
      samtalesprak: 'እቲ ዘተ በቲ ክኢላ ዝጠቐሶ ቋንቋታት እዩ ዝካየድ።'
    },
    es: {
      lofte: 'Consigue la ayuda adecuada en 45 minutos.',
      slagord: 'Una llamada. Tres pasos claros.',
      knapp: 'Encuentra al experto adecuado',
      alt: 'La familia puede reservar. La persona mayor decide.',
      s1: 'Cuéntanos qué necesitas.',
      s2: 'Encontramos al experto adecuado.',
      s3: 'Elige una hora disponible.',
      s4: 'Recibe tres pasos claros.',
      veiviser: '¿Con quién debo contactar?',
      q1: '¿De qué se trata?',
      q2: '¿Para quién es?',
      q3: '¿Qué tan urgente es?',
      k_nav: 'NAV y pensiones',
      k_kommune: 'Municipio y servicios de cuidado',
      k_digital: 'Servicios públicos digitales',
      telefon: 'Teléfono', video: 'Vídeo', minutter: '45 minutos',
      pris: 'Precio', ledig: 'Próxima hora disponible', bestill: 'Reservar', avbryt: 'Cancelar',
      verifisert: 'Experiencia verificada',
      venter: 'Esperando aprobación',
      garanti: '¿Experto equivocado? Una nueva llamada sin coste adicional.',
      akutt: 'No es un servicio de urgencias. Llame al 116 117. Llame al 113 si hay peligro de muerte.',
      steg: 'Qué hacer ahora',
      sms: 'Recordatorio: su llamada es mañana.',
      epost: 'Su reserva está confirmada.',
      oppfolging: '¿Pudo hacerlo?',
      samtalesprak: 'La llamada se realiza en los idiomas indicados por el experto.'
    }
  };

  /* Kvalitetsflagget. Alle oversettelsene er maskinlagde til noen som
     snakker språket har lest dem. Det er ikke en selvfølge man kan la stå
     usagt: en flate som ser ferdig ut, blir behandlet som ferdig. */
  var GODKJENT = { nb: true };

  /* Setningen som ikke tåler å være maskinoversatt. Et språk der denne ikke
     er lest av et menneske, kan ikke åpnes for kunder. */
  var KRITISK = 'akutt';

  /* Numrene som skal stå uendret i hver oversettelse. Testen sjekker det. */
  var NUMRE = ['116 117', '113'];

  function sprak(kode) {
    return SPRAK.filter(function (s) { return s.kode === kode; })[0] || null;
  }

  function nokler() {
    return Object.keys(T.nb);
  }

  /* Henter en streng. Faller tilbake til norsk hvis nøkkelen mangler, fordi
     et tomt felt er verre enn et felt på feil språk – da vet i det minste
     leseren at noe ikke er oversatt. */
  function t(nokkel, kode) {
    var k = T[kode] || T.nb;
    if (k[nokkel] !== undefined) return k[nokkel];
    return T.nb[nokkel] !== undefined ? T.nb[nokkel] : null;
  }

  /* Kan dette språket vises for kunder? */
  function kanApnes(kode) {
    var s = sprak(kode);
    if (!s) return { ok: false, grunn: 'Ukjent språk: ' + kode };
    if (!T[kode]) return { ok: false, grunn: 'Ingen oversettelse for ' + kode };

    var mangler = nokler().filter(function (n) { return T[kode][n] === undefined; });
    if (mangler.length) {
      return { ok: false, grunn: 'Mangler ' + mangler.length + ' strenger: ' + mangler.join(', ') };
    }
    var utenNummer = NUMRE.filter(function (n) { return T[kode][KRITISK].indexOf(n) === -1; });
    if (utenNummer.length) {
      return { ok: false, grunn: 'Akuttsetningen mangler nummer: ' + utenNummer.join(', ') };
    }
    if (!GODKJENT[kode]) {
      return { ok: false, grunn: 'Akuttsetningen er ikke lest av noen som snakker ' + s.navn,
               regel: 'ikke_godkjent' };
    }
    return { ok: true, grunn: null };
  }

  /* Språkvalget som følger med ut av nettleseren. En melding uten språk er
     en melding på norsk, og det er et valg noen har tatt uten å vite det. */
  function melding(kode, flate, nokkel) {
    if (FLATER.indexOf(flate) === -1) throw new Error('Ukjent flate: ' + flate);
    var s = sprak(kode) || sprak('nb');
    return { sprak: s.kode, dir: s.dir, flate: flate, tekst: t(nokkel, s.kode) };
  }

  return {
    SPRAK: SPRAK,
    FLATER: FLATER,
    GODKJENT: GODKJENT,
    KRITISK: KRITISK,
    NUMRE: NUMRE,
    T: T,
    sprak: sprak,
    nokler: nokler,
    t: t,
    kanApnes: kanApnes,
    melding: melding
  };
})();
