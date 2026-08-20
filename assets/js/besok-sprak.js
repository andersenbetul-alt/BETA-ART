/* Naviar Care – familiemeldingen på flere språk.

   Hvorfor dette finnes: produktet selger trygghet, og trygghet leses på
   morsmålet. En datter i Oslo som leser urdu bedre enn norsk, får en bedre
   melding – og leverandøren får et argument ingen konkurrent har.

   Prinsipp: bare de faste delene oversettes. Medarbeiderens frie kommentar
   oversettes ALDRI maskinelt – den vises som skrevet, med en etikett på
   mottakerens språk. En feiloversatt setning om en eldre persons besøk er
   verre enn en uoversatt en. */

window.PP_SPRAK = (function () {
  'use strict';

  /* Rekkefølgen speiler landsplanen: Norge, så Norden, så Nordvest-Europa.
     De nederste er ikke markedsspråk, men språk familier i disse landene
     faktisk leser – og det er der verdien ligger. */
  var SPRAK = [
    { kode: 'nb',  navn: 'Norsk',        egen: 'Norsk',        rtl: false, marked: true },
    { kode: 'sv',  navn: 'Svensk',       egen: 'Svenska',      rtl: false, marked: true },
    { kode: 'da',  navn: 'Dansk',        egen: 'Dansk',        rtl: false, marked: true },
    { kode: 'en',  navn: 'Engelsk',      egen: 'English',      rtl: false, marked: true },
    { kode: 'de',  navn: 'Tysk',         egen: 'Deutsch',      rtl: false, marked: true },
    { kode: 'nl',  navn: 'Nederlandsk',  egen: 'Nederlands',   rtl: false, marked: true },
    { kode: 'fr',  navn: 'Fransk',       egen: 'Français',     rtl: false, marked: true },
    { kode: 'es',  navn: 'Spansk',       egen: 'Español',      rtl: false, marked: true },
    { kode: 'it',  navn: 'Italiensk',    egen: 'Italiano',     rtl: false, marked: true },
    { kode: 'pt',  navn: 'Portugisisk',  egen: 'Português',    rtl: false, marked: true },
    { kode: 'pl',  navn: 'Polsk',        egen: 'Polski',       rtl: false, marked: false },
    { kode: 'ru',  navn: 'Russisk',      egen: 'Русский',      rtl: false, marked: false },
    { kode: 'tr',  navn: 'Tyrkisk',      egen: 'Türkçe',       rtl: false, marked: false },
    { kode: 'ar',  navn: 'Arabisk',      egen: 'العربية',       rtl: true,  marked: false },
    { kode: 'ur',  navn: 'Urdu',         egen: 'اردو',          rtl: true,  marked: false },
    { kode: 'so',  navn: 'Somali',       egen: 'Soomaali',     rtl: false, marked: false },
    { kode: 'vi',  navn: 'Vietnamesisk', egen: 'Tiếng Việt',   rtl: false, marked: false },
    { kode: 'zh',  navn: 'Kinesisk',     egen: '中文',          rtl: false, marked: false }
  ];

  /* {kunde} {kl} {oppgaver} {firma} {kontakt} {medarbeider} */
  var T = {
    nb: {
      emne:      'Besøk hos {kunde} er gjennomført',
      utfort:    'Dagens besøk hos {kunde} ble utført kl. {kl}.',
      gjort:     'Dette ble gjort: {oppgaver}.',
      delvis:    'Dagens besøk hos {kunde} ble gjennomført kl. {kl}. Noe av det planlagte ble ikke gjort. {firma} tar kontakt.',
      oppfolging:'Dagens besøk hos {kunde} ble utført kl. {kl}. {firma} ønsker å snakke med deg om noe fra besøket og tar kontakt.',
      ikke:      'Dagens besøk hos {kunde} ble ikke gjennomført. {firma} tar kontakt for å avtale nytt tidspunkt.',
      melding:   'Melding fra {medarbeider}',
      signatur:  'Denne meldingen er sendt fra {firma} via Naviar Care.',
      sporsmal:  'Har du spørsmål, kontakt {kontakt}.'
    },
    sv: {
      emne:      'Besöket hos {kunde} är genomfört',
      utfort:    'Dagens besök hos {kunde} genomfördes kl. {kl}.',
      gjort:     'Detta gjordes: {oppgaver}.',
      delvis:    'Dagens besök hos {kunde} genomfördes kl. {kl}. En del av det planerade blev inte gjort. {firma} hör av sig.',
      oppfolging:'Dagens besök hos {kunde} genomfördes kl. {kl}. {firma} vill prata med dig om något från besöket och hör av sig.',
      ikke:      'Dagens besök hos {kunde} blev inte genomfört. {firma} hör av sig för att boka en ny tid.',
      melding:   'Meddelande från {medarbeider}',
      signatur:  'Detta meddelande har skickats av {firma} via Naviar Care.',
      sporsmal:  'Har du frågor, kontakta {kontakt}.'
    },
    da: {
      emne:      'Besøget hos {kunde} er gennemført',
      utfort:    'Dagens besøg hos {kunde} blev gennemført kl. {kl}.',
      gjort:     'Dette blev gjort: {oppgaver}.',
      delvis:    'Dagens besøg hos {kunde} blev gennemført kl. {kl}. En del af det planlagte blev ikke gjort. {firma} kontakter jer.',
      oppfolging:'Dagens besøg hos {kunde} blev gennemført kl. {kl}. {firma} vil gerne tale med jer om noget fra besøget og kontakter jer.',
      ikke:      'Dagens besøg hos {kunde} blev ikke gennemført. {firma} kontakter jer for at aftale et nyt tidspunkt.',
      melding:   'Besked fra {medarbeider}',
      signatur:  'Denne besked er sendt af {firma} via Naviar Care.',
      sporsmal:  'Har I spørgsmål, kontakt {kontakt}.'
    },
    de: {
      emne:      'Der Besuch bei {kunde} ist erfolgt',
      utfort:    'Der heutige Besuch bei {kunde} wurde um {kl} Uhr abgeschlossen.',
      gjort:     'Folgendes wurde erledigt: {oppgaver}.',
      delvis:    'Der heutige Besuch bei {kunde} fand um {kl} Uhr statt. Ein Teil des Geplanten konnte nicht erledigt werden. {firma} meldet sich bei Ihnen.',
      oppfolging:'Der heutige Besuch bei {kunde} wurde um {kl} Uhr abgeschlossen. {firma} möchte etwas vom Besuch mit Ihnen besprechen und meldet sich.',
      ikke:      'Der heutige Besuch bei {kunde} fand nicht statt. {firma} meldet sich, um einen neuen Termin zu vereinbaren.',
      melding:   'Nachricht von {medarbeider}',
      signatur:  'Diese Nachricht wurde von {firma} über Naviar Care gesendet.',
      sporsmal:  'Bei Fragen wenden Sie sich an {kontakt}.'
    },
    nl: {
      emne:      'Het bezoek bij {kunde} is uitgevoerd',
      utfort:    'Het bezoek van vandaag bij {kunde} is om {kl} uur afgerond.',
      gjort:     'Dit is gedaan: {oppgaver}.',
      delvis:    'Het bezoek van vandaag bij {kunde} heeft om {kl} uur plaatsgevonden. Een deel van het geplande is niet gedaan. {firma} neemt contact met u op.',
      oppfolging:'Het bezoek van vandaag bij {kunde} is om {kl} uur afgerond. {firma} wil iets van het bezoek met u bespreken en neemt contact op.',
      ikke:      'Het bezoek van vandaag bij {kunde} heeft niet plaatsgevonden. {firma} neemt contact op om een nieuwe tijd af te spreken.',
      melding:   'Bericht van {medarbeider}',
      signatur:  'Dit bericht is verzonden door {firma} via Naviar Care.',
      sporsmal:  'Heeft u vragen, neem contact op met {kontakt}.'
    },
    fr: {
      emne:      'La visite chez {kunde} a été effectuée',
      utfort:    "La visite d'aujourd'hui chez {kunde} a été effectuée à {kl}.",
      gjort:     'Voici ce qui a été fait : {oppgaver}.',
      delvis:    "La visite d'aujourd'hui chez {kunde} a eu lieu à {kl}. Une partie de ce qui était prévu n'a pas pu être faite. {firma} vous contactera.",
      oppfolging:"La visite d'aujourd'hui chez {kunde} a été effectuée à {kl}. {firma} souhaite échanger avec vous au sujet de la visite et vous contactera.",
      ikke:      "La visite d'aujourd'hui chez {kunde} n'a pas eu lieu. {firma} vous contactera pour convenir d'un nouveau créneau.",
      melding:   'Message de {medarbeider}',
      signatur:  'Ce message a été envoyé par {firma} via Naviar Care.',
      sporsmal:  'Pour toute question, contactez {kontakt}.'
    },
    it: {
      emne:      'La visita da {kunde} è stata effettuata',
      utfort:    'La visita di oggi da {kunde} è stata completata alle {kl}.',
      gjort:     'È stato fatto quanto segue: {oppgaver}.',
      delvis:    'La visita di oggi da {kunde} si è svolta alle {kl}. Una parte di quanto previsto non è stata svolta. {firma} vi contatterà.',
      oppfolging:'La visita di oggi da {kunde} è stata completata alle {kl}. {firma} desidera parlarvi di un aspetto della visita e vi contatterà.',
      ikke:      'La visita di oggi da {kunde} non si è svolta. {firma} vi contatterà per concordare un nuovo orario.',
      melding:   'Messaggio da {medarbeider}',
      signatur:  'Questo messaggio è stato inviato da {firma} tramite Naviar Care.',
      sporsmal:  'Per domande, contattate {kontakt}.'
    },
    pt: {
      emne:      'A visita a {kunde} foi realizada',
      utfort:    'A visita de hoje a {kunde} foi concluída às {kl}.',
      gjort:     'Foi feito o seguinte: {oppgaver}.',
      delvis:    'A visita de hoje a {kunde} decorreu às {kl}. Parte do que estava previsto não foi feito. A {firma} entrará em contacto.',
      oppfolging:'A visita de hoje a {kunde} foi concluída às {kl}. A {firma} gostaria de falar consigo sobre algo da visita e entrará em contacto.',
      ikke:      'A visita de hoje a {kunde} não se realizou. A {firma} entrará em contacto para combinar um novo horário.',
      melding:   'Mensagem de {medarbeider}',
      signatur:  'Esta mensagem foi enviada por {firma} através da Naviar Care.',
      sporsmal:  'Em caso de dúvidas, contacte {kontakt}.'
    },
    en: {
      emne:      'Visit with {kunde} is completed',
      utfort:    "Today's visit with {kunde} was completed at {kl}.",
      gjort:     'This was done: {oppgaver}.',
      delvis:    "Today's visit with {kunde} took place at {kl}. Some of what was planned was not done. {firma} will be in touch.",
      oppfolging:"Today's visit with {kunde} was completed at {kl}. {firma} would like to speak with you about something from the visit and will be in touch.",
      ikke:      "Today's visit with {kunde} did not take place. {firma} will be in touch to arrange a new time.",
      melding:   'Note from {medarbeider}',
      signatur:  'This message was sent by {firma} via Naviar Care.',
      sporsmal:  'If you have questions, contact {kontakt}.'
    },
    pl: {
      emne:      'Wizyta u {kunde} została zrealizowana',
      utfort:    'Dzisiejsza wizyta u {kunde} została zrealizowana o godz. {kl}.',
      gjort:     'Wykonano: {oppgaver}.',
      delvis:    'Dzisiejsza wizyta u {kunde} odbyła się o godz. {kl}. Część zaplanowanych zadań nie została wykonana. {firma} skontaktuje się z Państwem.',
      oppfolging:'Dzisiejsza wizyta u {kunde} została zrealizowana o godz. {kl}. {firma} chciałaby porozmawiać o czymś z wizyty i skontaktuje się z Państwem.',
      ikke:      'Dzisiejsza wizyta u {kunde} nie odbyła się. {firma} skontaktuje się, aby ustalić nowy termin.',
      melding:   'Wiadomość od {medarbeider}',
      signatur:  'Ta wiadomość została wysłana przez {firma} za pośrednictwem Naviar Care.',
      sporsmal:  'W razie pytań prosimy o kontakt: {kontakt}.'
    },
    ar: {
      emne:      'تمت الزيارة لدى {kunde}',
      utfort:    'تمت زيارة اليوم لدى {kunde} في الساعة {kl}.',
      gjort:     'تم تنفيذ ما يلي: {oppgaver}.',
      delvis:    'جرت زيارة اليوم لدى {kunde} في الساعة {kl}. لم يتم تنفيذ بعض ما كان مخططًا. ستتواصل معكم {firma}.',
      oppfolging:'تمت زيارة اليوم لدى {kunde} في الساعة {kl}. ترغب {firma} في التحدث إليكم بشأن أمر يتعلق بالزيارة وستتواصل معكم.',
      ikke:      'لم تجرِ زيارة اليوم لدى {kunde}. ستتواصل معكم {firma} لتحديد موعد جديد.',
      melding:   'رسالة من {medarbeider}',
      signatur:  'أُرسلت هذه الرسالة من {firma} عبر Naviar Care.',
      sporsmal:  'لأي استفسار، يرجى التواصل مع {kontakt}.'
    },
    es: {
      emne:      'La visita a {kunde} se ha realizado',
      utfort:    'La visita de hoy a {kunde} se realizó a las {kl}.',
      gjort:     'Se hizo lo siguiente: {oppgaver}.',
      delvis:    'La visita de hoy a {kunde} se realizó a las {kl}. Parte de lo previsto no se pudo hacer. {firma} se pondrá en contacto.',
      oppfolging:'La visita de hoy a {kunde} se realizó a las {kl}. {firma} desea hablar con usted sobre algo de la visita y se pondrá en contacto.',
      ikke:      'La visita de hoy a {kunde} no se realizó. {firma} se pondrá en contacto para acordar una nueva hora.',
      melding:   'Mensaje de {medarbeider}',
      signatur:  'Este mensaje ha sido enviado por {firma} a través de Naviar Care.',
      sporsmal:  'Si tiene preguntas, contacte con {kontakt}.'
    },
    tr: {
      emne:      '{kunde} ziyareti tamamlandı',
      utfort:    'Bugünkü {kunde} ziyareti saat {kl} itibarıyla tamamlandı.',
      gjort:     'Yapılanlar: {oppgaver}.',
      delvis:    'Bugünkü {kunde} ziyareti saat {kl} itibarıyla gerçekleşti. Planlananların bir kısmı yapılamadı. {firma} sizinle iletişime geçecek.',
      oppfolging:'Bugünkü {kunde} ziyareti saat {kl} itibarıyla tamamlandı. {firma} ziyaretle ilgili bir konuyu sizinle konuşmak istiyor ve iletişime geçecek.',
      ikke:      'Bugünkü {kunde} ziyareti gerçekleşmedi. {firma} yeni bir zaman belirlemek için sizinle iletişime geçecek.',
      melding:   '{medarbeider} tarafından not',
      signatur:  'Bu mesaj {firma} tarafından Naviar Care üzerinden gönderilmiştir.',
      sporsmal:  'Sorunuz varsa {kontakt} ile iletişime geçebilirsiniz.'
    },
    ur: {
      emne:      '{kunde} کے ہاں ملاقات مکمل ہو گئی',
      utfort:    'آج {kunde} کے ہاں ملاقات {kl} بجے مکمل ہوئی۔',
      gjort:     'یہ کام کیے گئے: {oppgaver}۔',
      delvis:    'آج {kunde} کے ہاں ملاقات {kl} بجے ہوئی۔ منصوبے کا کچھ حصہ مکمل نہیں ہو سکا۔ {firma} آپ سے رابطہ کرے گی۔',
      oppfolging:'آج {kunde} کے ہاں ملاقات {kl} بجے مکمل ہوئی۔ {firma} ملاقات سے متعلق ایک بات پر آپ سے گفتگو کرنا چاہتی ہے اور رابطہ کرے گی۔',
      ikke:      'آج {kunde} کے ہاں ملاقات نہیں ہو سکی۔ {firma} نیا وقت طے کرنے کے لیے رابطہ کرے گی۔',
      melding:   '{medarbeider} کی طرف سے پیغام',
      signatur:  'یہ پیغام {firma} کی جانب سے Naviar Care کے ذریعے بھیجا گیا ہے۔',
      sporsmal:  'سوال ہو تو {kontakt} سے رابطہ کریں۔'
    },
    so: {
      emne:      'Booqashada {kunde} waa la dhammeeyey',
      utfort:    'Booqashada maanta ee {kunde} waxaa la dhammeeyey {kl}.',
      gjort:     'Waxaa la sameeyey: {oppgaver}.',
      delvis:    'Booqashada maanta ee {kunde} waxay dhacday {kl}. Qaar ka mid ah waxa la qorsheeyey lama sameyn. {firma} way kula soo xiriiri doontaa.',
      oppfolging:'Booqashada maanta ee {kunde} waxaa la dhammeeyey {kl}. {firma} waxay doonaysaa inay kaala hadasho arrin booqashada ku saabsan, wayna kula soo xiriiri doontaa.',
      ikke:      'Booqashada maanta ee {kunde} ma dhicin. {firma} way kula soo xiriiri doontaa si loo qorsheeyo waqti cusub.',
      melding:   'Fariin ka timid {medarbeider}',
      signatur:  'Fariintan waxaa soo diray {firma} iyada oo loo marayo Naviar Care.',
      sporsmal:  'Haddii aad su\'aal qabtid, la xiriir {kontakt}.'
    },
    ru: {
      emne:      'Визит к {kunde} выполнен',
      utfort:    'Сегодняшний визит к {kunde} выполнен в {kl}.',
      gjort:     'Было сделано: {oppgaver}.',
      delvis:    'Сегодняшний визит к {kunde} состоялся в {kl}. Часть запланированного не была выполнена. {firma} свяжется с вами.',
      oppfolging:'Сегодняшний визит к {kunde} выполнен в {kl}. {firma} хотела бы обсудить с вами кое-что по итогам визита и свяжется с вами.',
      ikke:      'Сегодняшний визит к {kunde} не состоялся. {firma} свяжется с вами, чтобы согласовать новое время.',
      melding:   'Сообщение от {medarbeider}',
      signatur:  'Это сообщение отправлено {firma} через Naviar Care.',
      sporsmal:  'Если у вас есть вопросы, свяжитесь с {kontakt}.'
    },
    vi: {
      emne:      'Buổi thăm {kunde} đã hoàn tất',
      utfort:    'Buổi thăm {kunde} hôm nay đã hoàn tất lúc {kl}.',
      gjort:     'Đã thực hiện: {oppgaver}.',
      delvis:    'Buổi thăm {kunde} hôm nay đã diễn ra lúc {kl}. Một phần công việc dự kiến chưa được thực hiện. {firma} sẽ liên hệ với quý vị.',
      oppfolging:'Buổi thăm {kunde} hôm nay đã hoàn tất lúc {kl}. {firma} muốn trao đổi với quý vị về một việc trong buổi thăm và sẽ liên hệ.',
      ikke:      'Buổi thăm {kunde} hôm nay đã không diễn ra. {firma} sẽ liên hệ để hẹn thời gian mới.',
      melding:   'Lời nhắn từ {medarbeider}',
      signatur:  'Tin nhắn này được gửi bởi {firma} qua Naviar Care.',
      sporsmal:  'Nếu có thắc mắc, xin liên hệ {kontakt}.'
    },
    zh: {
      emne:      '{kunde} 的探访已完成',
      utfort:    '今天对 {kunde} 的探访已于 {kl} 完成。',
      gjort:     '已完成事项：{oppgaver}。',
      delvis:    '今天对 {kunde} 的探访已于 {kl} 进行。部分计划事项未能完成。{firma} 将与您联系。',
      oppfolging:'今天对 {kunde} 的探访已于 {kl} 完成。{firma} 希望就探访中的某件事与您沟通，稍后将与您联系。',
      ikke:      '今天对 {kunde} 的探访未能进行。{firma} 将与您联系以另约时间。',
      melding:   '来自 {medarbeider} 的留言',
      signatur:  '本消息由 {firma} 通过 Naviar Care 发送。',
      sporsmal:  '如有疑问，请联系 {kontakt}。'
    }
  };

  /* Faste kategorier – trygge å oversette. Medarbeiderens frie tekst er det ikke. */
  var OPPGAVENAVN = {
    handling: { nb:'Handling',sv:'Inköp',da:'Indkøb',en:'Shopping',de:'Einkauf',nl:'Boodschappen',fr:'Courses',es:'Compras',it:'Spesa',pt:'Compras',pl:'Zakupy',ru:'Покупки',tr:'Alışveriş',ar:'التسوق',ur:'خریداری',so:'Wax iibsi',vi:'Đi chợ',zh:'购物' },
    folge: { nb:'Følge til avtale',sv:'Följe till möte',da:'Ledsagelse',en:'Accompaniment',de:'Begleitung',nl:'Begeleiding',fr:'Accompagnement',es:'Acompañamiento',it:'Accompagnamento',pt:'Acompanhamento',pl:'Towarzyszenie',ru:'Сопровождение',tr:'Randevuya eşlik',ar:'المرافقة',ur:'ہمراہی',so:'Raacid',vi:'Đi cùng',zh:'陪同' },
    transport: { nb:'Transport',sv:'Transport',da:'Transport',en:'Transport',de:'Fahrt',nl:'Vervoer',fr:'Transport',es:'Transporte',it:'Trasporto',pt:'Transporte',pl:'Transport',ru:'Поездка',tr:'Ulaşım',ar:'المواصلات',ur:'آمد و رفت',so:'Gaadiid',vi:'Đưa đón',zh:'接送' },
    samvaer: { nb:'Samvær og tur',sv:'Sällskap och promenad',da:'Samvær og gåtur',en:'Company and a walk',de:'Gesellschaft und Spaziergang',nl:'Gezelschap en wandeling',fr:'Compagnie et promenade',es:'Compañía y paseo',it:'Compagnia e passeggiata',pt:'Companhia e passeio',pl:'Towarzystwo i spacer',ru:'Общение и прогулка',tr:'Sohbet ve yürüyüş',ar:'مرافقة ونزهة',ur:'ساتھ اور سیر',so:'Wehel iyo socod',vi:'Trò chuyện và đi dạo',zh:'陪伴与散步' },
    praktisk: { nb:'Praktisk hjelp i hjemmet',sv:'Praktisk hjälp hemma',da:'Praktisk hjælp',en:'Practical help at home',de:'Praktische Hilfe zu Hause',nl:'Praktische hulp thuis',fr:'Aide pratique à domicile',es:'Ayuda práctica en casa',it:'Aiuto pratico in casa',pt:'Ajuda prática em casa',pl:'Pomoc praktyczna w domu',ru:'Помощь по дому',tr:'Evde pratik yardım',ar:'مساعدة عملية في المنزل',ur:'گھر میں عملی مدد',so:'Caawimaad guriga',vi:'Giúp việc nhà',zh:'家中实际帮助' },
    rengjoring: { nb:'Rengjøring',sv:'Städning',da:'Rengøring',en:'Cleaning',de:'Reinigung',nl:'Schoonmaak',fr:'Ménage',es:'Limpieza',it:'Pulizie',pt:'Limpeza',pl:'Sprzątanie',ru:'Уборка',tr:'Temizlik',ar:'التنظيف',ur:'صفائی',so:'Nadaafad',vi:'Dọn dẹp',zh:'清洁' },
    apotek: { nb:'Hente på apotek',sv:'Hämta på apotek',da:'Hente på apotek',en:'Pharmacy pickup',de:'Abholung Apotheke',nl:'Apotheek ophalen',fr:'Retrait en pharmacie',es:'Recolha na farmácia',it:'Ritiro in farmacia',pt:'Recolha na farmácia',pl:'Odbiór z apteki',ru:'Забрать в аптеке',tr:'Eczaneden alma',ar:'الاستلام من الصيدلية',ur:'فارمیسی سے لینا',so:'Farmashiyaha',vi:'Lấy thuốc',zh:'药房取件' },
    dyr: { nb:'Kjæledyr',sv:'Husdjur',da:'Kæledyr',en:'Pet care',de:'Haustier',nl:'Huisdier',fr:'Animal de compagnie',es:'Mascota',it:'Animale domestico',pt:'Animal de estimação',pl:'Zwierzę domowe',ru:'Домашний питомец',tr:'Evcil hayvan',ar:'الحيوان الأليف',ur:'پالتو جانور',so:'Xayawaanka guriga',vi:'Thú cưng',zh:'宠物' }
  };

  function fyll(mal, d) {
    return mal.replace(/\{(\w+)\}/g, function (_, n) { return d[n] == null ? '' : d[n]; });
  }

  function oppgavenavn(id, kode) {
    var o = OPPGAVENAVN[id];
    return o ? (o[kode] || o.nb) : id;
  }

  function finn(kode) {
    return SPRAK.filter(function (s) { return s.kode === kode; })[0] || SPRAK[0];
  }

  /**
   * Bygger meldingen på ønsket språk.
   * @returns {{emne:string, tekst:string, rtl:boolean, sprak:object}}
   */
  function melding(besok, kode, firma, kontakt) {
    var t = T[kode] || T.nb;
    var s = finn(kode);
    var tid = new Date(besok.fullfortTid);
    var d = {
      kunde: besok.kunde,
      kl: String(tid.getHours()).padStart(2, '0') + ':' + String(tid.getMinutes()).padStart(2, '0'),
      oppgaver: (besok.rapport.sjekkliste || besok.oppgaver || []).map(function (id) {
        return oppgavenavn(id, kode);
      }).join(', '),
      firma: firma,
      kontakt: kontakt,
      medarbeider: besok.ansattNavn
    };

    var linjer = [];
    var u = besok.rapport.utfall;
    if (u === 'utfort') { linjer.push(fyll(t.utfort, d)); linjer.push(fyll(t.gjort, d)); }
    else if (u === 'delvis') linjer.push(fyll(t.delvis, d));
    else if (u === 'oppfolging') linjer.push(fyll(t.oppfolging, d));
    else linjer.push(fyll(t.ikke, d));

    /* Kommentaren er medarbeiderens egne ord. Den oversettes ikke – den vises
       som skrevet, under en etikett mottakeren forstår. */
    if (besok.rapport.kommentar) {
      linjer.push(fyll(t.melding, d) + ': «' + besok.rapport.kommentar + '»');
    }

    linjer.push('');
    linjer.push(fyll(t.signatur, d));
    linjer.push(fyll(t.sporsmal, d));

    return { emne: fyll(t.emne, d), tekst: linjer.join('\n'), rtl: s.rtl, sprak: s };
  }

  return { SPRAK: SPRAK, melding: melding, oppgavenavn: oppgavenavn };
})();
