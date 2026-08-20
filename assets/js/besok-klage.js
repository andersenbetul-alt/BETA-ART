/* Naviar Care – klagekanal og svarfrister.

   Fristene her er ikke servicemål. De fleste av dem står i lov, og de løper
   fra det øyeblikket noen sier fra – ikke fra vi rakk å se på det.

   Tre ting er verdt å ha klart før man leser tabellen:

   1. En frist på «72 timer» løper uavhengig av helg, ferie og at den som
      hadde vakt var syk. Det er derfor mottaket må virke uten oss.

   2. Vi er databehandler. Ved brudd på personopplysningssikkerheten har vi
      IKKE en selvstendig plikt til å melde til Datatilsynet – vi skal melde
      til leverandøren, og leverandøren melder videre. Databehandleravtalen må
      si uttrykkelig om vi har fullmakt til å sende en fristavbrytende
      førstemelding på deres vegne. Uten den setningen risikerer man at begge
      tror den andre meldte.

   3. Avvergingsplikten går foran taushetsplikten. Den gjelder alle, ikke bare
      helsepersonell, og den oppfylles først og fremst ved å varsle politiet.
      Den er ikke en plikt til å lykkes i å avverge, men til å søke å avverge.
      Derfor er det ingen intern behandlingstid på den kategorien: den har
      ingen kø.

   Se docs/JURIDISK-GRENSE.md. */

window.PP_KLAGE = (function () {
  'use strict';

  /* Hvem fristen løper mot. Skillet er hele poenget: en frist mot et tilsyn
     kan ikke forlenges av at vi har mye å gjøre. */
  var MOT = {
    lov:    'Frist i lov. Kan ikke forlenges av oss.',
    egen:   'Vår egen frist. Vi har satt den, og vi kan bli målt på den.'
  };

  var KATEGORIER = [
    {
      id: 'overgrep',
      navn: 'Mistanke om vold, overgrep eller omsorgssvikt',
      frist: 'straks', timer: 0, mot: 'lov',
      hjemmel: 'Straffeloven § 196 (avvergingsplikt)',
      til: 'Politiet. Ved akutt fare: 112',
      stopper: true,
      merk: 'Går foran taushetsplikten. Gjelder alle, ikke bare helsepersonell. ' +
            'Plikten er å søke å avverge, ikke å vurdere om mistanken holder. ' +
            'Ingen intern kø, ingen intern vurdering først.'
    },
    {
      id: 'misbruk',
      navn: 'Misbruk av stillingen',
      frist: 'straks', timer: 0, mot: 'egen',
      hjemmel: null,
      til: 'Leverandøren, som anmelder til politiet',
      stopper: true,
      omfatter: ['Penger, bankkort, PIN eller BankID', 'Å ta med seg noe fra hjemmet',
                 'Å bruke nøkkelen eller koden til noe annet enn oppdraget',
                 'Å komme uten et oppdrag', 'Å ta bilder', 'Å be om betaling utenom avtalen',
                 'Å presse fram gaver, lån, testament eller fullmakt'],
      merk: 'Vi anmelder alltid. Det er vår regel, ikke en vurdering av hvor alvorlig det er. ' +
            'Den som slipper inn i et hjem, har fått noe som ikke kan kontrolleres utenfra. ' +
            'Derfor er terskelen lav og svaret alltid det samme.',
      /* Skillet er verdt å holde rett, for det avgjør om noen kan la være.

         Avvergingsplikten i straffeloven § 196 har en UTTØMMENDE katalog. Den
         gjelder vold og seksuallovbrudd – blant annet grov kroppsskade
         (§ 274), mishandling i nære relasjoner (§§ 282 og 283), voldtekt
         (§ 291) og misbruk av overmaktsforhold (§ 295). Tyveri og bedrageri
         står IKKE i den katalogen. Å anmelde økonomisk utnyttelse er derfor en
         rett, og hos oss en regel vi har satt selv – ikke en lovpålagt plikt.

         Men to broer går over til katalogen, og de er ikke teoretiske:

           § 282 verner den som er «i hans omsorg». En medarbeider som yter
           omsorg i hjemmet, kan være nettopp den personen loven snakker om.
           Gjentatt eller alvorlig mishandling i det forholdet er omfattet, og
           da er avverging en plikt som går foran taushetsplikten.

           § 295 gjelder misbruk av overmaktsforhold. Å være alene med noen som
           er avhengig av deg for å komme seg gjennom dagen, ER et
           overmaktsforhold.

         Straffebudene som ellers er aktuelle: tyveri og grovt tyveri
         (§§ 321 og 322), underslag (§§ 324 og 325), bedrageri og grovt
         bedrageri (§§ 371 og 372). At fornærmede var i en forsvarsløs stilling,
         teller skjerpende ved vurderingen av om forholdet er grovt.

         I praksis: medarbeideren skal ikke stå i noens gang og finne ut hvilken
         paragraf hun er borti. Hun skal si fra. Sorteringen er vår jobb, og
         den er derfor skrevet ned her og ikke overlatt til øyeblikket. */
      straffebud: ['§§ 321 og 322 tyveri', '§§ 324 og 325 underslag',
                   '§§ 371 og 372 bedrageri'],
      naarDetBlirPlikt: 'Ved vold, trusler, seksuelle overgrep, eller mishandling av ' +
                        'noen som er i medarbeiderens omsorg, gjelder avvergingsplikten ' +
                        'etter straffeloven § 196. Den går foran taushetsplikten, og den ' +
                        'oppfylles først og fremst ved å varsle politiet. Plikten er å ' +
                        'søke å avverge – ikke å vurdere om mistanken holder.',
      ikkeAvvergingsplikt: 'Rent tyveri og bedrageri står ikke i katalogen i § 196. ' +
                           'Vi anmelder likevel, alltid. Det er vår regel.'
    },
    {
      id: 'personvernbrudd_leverandor',
      navn: 'Personvernbrudd – vår melding til leverandøren',
      frist: 'uten ugrunnet opphold', timer: 24, mot: 'lov',
      hjemmel: 'Personvernforordningen artikkel 33 nr. 2',
      til: 'Leverandøren (behandlingsansvarlig)',
      stopper: false,
      merk: 'Vi melder til leverandøren. Vi melder ikke til Datatilsynet – det er ikke vår plikt.'
    },
    {
      id: 'personvernbrudd_tilsyn',
      navn: 'Personvernbrudd – leverandørens melding til Datatilsynet',
      frist: '72 timer', timer: 72, mot: 'lov',
      hjemmel: 'Personvernforordningen artikkel 33 nr. 1',
      til: 'Datatilsynet, via Altinn',
      stopper: false,
      merk: 'Løper uavhengig av helg og ferie. Kan meldes i trinn hvis ikke alt er kjent ennå.'
    },
    {
      id: 'personvernbrudd_berort',
      navn: 'Personvernbrudd – melding til dem det gjelder',
      frist: 'uten ugrunnet opphold', timer: 72, mot: 'lov',
      hjemmel: 'Personvernforordningen artikkel 34',
      til: 'Den enkelte',
      stopper: false,
      merk: 'Bare når bruddet gir høy risiko for den enkelte.'
    },
    {
      id: 'innsyn',
      navn: 'Krav om innsyn, retting eller sletting',
      frist: '1 måned', timer: 720, mot: 'lov',
      hjemmel: 'Personvernforordningen artikkel 12 nr. 3',
      til: 'Leverandøren svarer. Vi henter ut på instruks',
      stopper: false,
      forleng: { timer: 1440, vilkar: 'Bare ved komplekse eller mange krav, og bare hvis ' +
                 'den som spør får beskjed om forlengelsen og begrunnelsen INNEN den første måneden.' },
      merk: 'Forlengelsen krever et varsel, ikke bare at det tok lengre tid.'
    },
    {
      id: 'skade',
      navn: 'Fall, skade eller tap av eiendeler',
      frist: 'samme dag', timer: 8, mot: 'egen',
      hjemmel: null,
      til: 'Leverandørens driftsansvarlige',
      stopper: true,
      merk: 'Ingen lovfrist mot oss, men leverandøren kan ha meldeplikt som arbeidsgiver ' +
            'hvis medarbeideren ble skadet. Automatikken stanser uansett.'
    },
    {
      id: 'medarbeider',
      navn: 'Klage på en medarbeider',
      frist: '1 virkedag til bekreftelse, 5 til svar', timer: null, mot: 'egen',
      hjemmel: null,
      til: 'Leverandøren. Vi er ikke arbeidsgiver og vurderer ikke medarbeidere',
      stopper: false,
      virkedager: { bekreftelse: 1, svar: 5 },
      merk: 'Vi videreformidler. Konsekvenser for et ansettelsesforhold er leverandørens sak.'
    },
    {
      id: 'tjeneste',
      navn: 'Klage på tjenesten eller på oss',
      frist: '1 virkedag til bekreftelse, 5 til svar', timer: null, mot: 'egen',
      hjemmel: null,
      til: 'Naviar',
      stopper: false,
      virkedager: { bekreftelse: 1, svar: 5 },
      merk: 'Ingen lovfrist i et B2B-forhold. Fristen er vår, og den står i avtalen.'
    }
  ];

  /* Hvis vi åpner for forbrukere senere, kommer dette i tillegg. Står her nå
     fordi det er en grunn til å la være. */
  var HVIS_FORBRUKER = [
    { hva: 'Reklamasjon', frist: 'Innen rimelig tid etter oppdaget feil. Ytterste frist to år, ' +
           'fem år hvis tjenesten er ment å vare vesentlig lenger' },
    { hva: 'Angrerett ved fjernsalg', frist: '14 dager' },
    { hva: 'Mekling', frist: 'Forbrukertilsynet, deretter Forbrukerklageutvalget' }
  ];


  /* Det medarbeideren skal ha lest før hun står i døra.

     Grunnen til at den finnes på alle språkene: en regel man ikke har forstått,
     er ikke en regel man følger. Den som er nyest i landet er også den som
     lettest blir presset til å gjøre en tjeneste med et bankkort, og hun er
     den som minst av alt tør å si fra. Da holder det ikke at setningen står i
     vilkårene på norsk.

     Teksten sier tre ting, i den rekkefølgen: hva som er forbudt, hva som
     skjer med den som utnytter, og at det å si fra aldri går ut over henne. */
  var MEDARBEIDERVARSEL = {
    nb: 'Du er i noens hjem fordi de stoler på oss. Misbruker du den tilgangen – penger, bankkort, PIN, BankID, tar med deg noe, bruker nøkkelen til noe annet enn oppdraget, eller ber om betaling utenom avtalen – anmelder vi det til politiet. Ser du at noen andre gjør det, skal du si fra. Det får aldri følger for deg.',
    sv: 'Du är i någons hem för att de litar på oss. Missbrukar du den tillgången – pengar, bankkort, PIN, BankID, tar med dig något, använder nyckeln till annat än uppdraget, eller ber om betalning utanför avtalet – anmäler vi det till polisen. Ser du att någon annan gör det ska du säga ifrån. Det får aldrig konsekvenser för dig.',
    da: 'Du er i nogens hjem, fordi de stoler på os. Misbruger du den adgang – penge, bankkort, PIN, BankID, tager noget med dig, bruger nøglen til andet end opgaven, eller beder om betaling uden om aftalen – anmelder vi det til politiet. Ser du andre gøre det, skal du sige fra. Det får aldrig konsekvenser for dig.',
    en: "You are in someone's home because they trust us. If you misuse that access – money, bank cards, PINs, BankID, taking something with you, using the key for anything other than the visit, or asking for payment outside the agreement – we report it to the police. If you see someone else do it, say so. It will never be held against you.",
    de: 'Sie sind in der Wohnung eines Menschen, weil man uns vertraut. Missbrauchen Sie diesen Zugang – Geld, Bankkarten, PIN, BankID, etwas mitnehmen, den Schlüssel für etwas anderes als den Besuch nutzen oder Zahlung außerhalb der Vereinbarung verlangen – erstatten wir Anzeige bei der Polizei. Sehen Sie, dass jemand anderes das tut, sagen Sie es. Es hat für Sie niemals Nachteile.',
    nl: 'U bent bij iemand thuis omdat men ons vertrouwt. Misbruikt u die toegang – geld, bankpassen, pincodes, BankID, iets meenemen, de sleutel voor iets anders dan het bezoek gebruiken, of betaling buiten de afspraak vragen – dan doen wij aangifte bij de politie. Ziet u een ander dit doen, meld het. Het heeft nooit gevolgen voor u.',
    fr: "Vous êtes chez quelqu'un parce qu'on nous fait confiance. Si vous abusez de cet accès – argent, cartes bancaires, codes PIN, BankID, emporter quelque chose, utiliser la clé pour autre chose que la visite, ou demander un paiement hors contrat – nous portons plainte auprès de la police. Si vous voyez quelqu'un d'autre le faire, signalez-le. Cela ne vous portera jamais préjudice.",
    es: 'Está en la casa de alguien porque confían en nosotros. Si abusa de ese acceso – dinero, tarjetas bancarias, PIN, BankID, llevarse algo, usar la llave para algo distinto de la visita o pedir pagos fuera del acuerdo – lo denunciamos a la policía. Si ve que otra persona lo hace, avise. Nunca tendrá consecuencias para usted.',
    it: "Sei in casa di qualcuno perché si fidano di noi. Se abusi di quell'accesso – denaro, carte bancarie, PIN, BankID, portare via qualcosa, usare la chiave per altro che la visita, o chiedere pagamenti fuori dall'accordo – lo denunciamo alla polizia. Se vedi qualcun altro farlo, dillo. Non avrà mai conseguenze per te.",
    pt: 'Está na casa de alguém porque confiam em nós. Se abusar desse acesso – dinheiro, cartões bancários, PIN, BankID, levar algo consigo, usar a chave para algo além da visita, ou pedir pagamento fora do acordo – denunciamos à polícia. Se vir outra pessoa a fazê-lo, avise. Nunca terá consequências para si.',
    pl: 'Jesteś w czyimś domu, bo nam ufają. Jeśli nadużyjesz tego dostępu – pieniądze, karty bankowe, PIN, BankID, zabranie czegoś, użycie klucza do czegoś innego niż wizyta, albo prośba o zapłatę poza umową – zgłaszamy to policji. Jeśli widzisz, że robi to ktoś inny, powiedz o tym. Nigdy nie obróci się to przeciwko tobie.',
    ru: 'Вы находитесь в чужом доме, потому что нам доверяют. Злоупотребление этим доступом — деньги, банковские карты, ПИН-код, BankID, вынос вещей, использование ключа не по назначению или просьба об оплате в обход договора — мы сообщаем в полицию. Если вы видите, что так поступает кто-то другой, скажите об этом. Это никогда не обернётся против вас.',
    tr: 'Birinin evindesiniz, çünkü bize güveniyorlar. Bu erişimi kötüye kullanırsanız — para, banka kartı, PIN, BankID, evden bir şey almak, anahtarı ziyaret dışında bir şey için kullanmak ya da sözleşme dışı ödeme istemek — bunu polise bildiririz. Başkasının yaptığını görürseniz söyleyin. Bu size asla zarar getirmez.',
    ar: 'أنت في بيت شخص لأنه يثق بنا. إذا أسأت استخدام هذا الوصول – المال أو البطاقات المصرفية أو الرمز السري أو BankID أو أخذ شيء معك أو استخدام المفتاح لغير الزيارة أو طلب دفع خارج الاتفاق – فإننا نبلّغ الشرطة. وإذا رأيت غيرك يفعل ذلك، فأبلغ. لن يُستخدم ذلك ضدك أبدًا.',
    ur: 'آپ کسی کے گھر میں ہیں کیونکہ وہ ہم پر بھروسا کرتے ہیں۔ اگر آپ اس رسائی کا غلط استعمال کریں – پیسے، بینک کارڈ، پن، BankID، کوئی چیز ساتھ لے جانا، چابی کو ملاقات کے علاوہ کسی اور کام میں لانا، یا معاہدے سے باہر ادائیگی مانگنا – تو ہم پولیس کو اطلاع دیتے ہیں۔ اگر کسی اور کو ایسا کرتے دیکھیں تو بتائیں۔ اس کا نقصان آپ کو کبھی نہیں ہوگا۔',
    so: "Waxaad ku jirtaa guriga qof sababtoo ah way nagu kalsoon yihiin. Haddii aad si xun u isticmaasho gelitaankaas – lacag, kaadhadhka bangiga, PIN, BankID, inaad wax qaadato, inaad furaha u isticmaasho wax aan booqashada ahayn, ama inaad weydiisato lacag heshiiska ka baxsan – waxaan u gudbinaynaa booliska. Haddii aad aragto qof kale oo sidaas sameeya, sheeg. Waligeed dhib kuguma keeni doonto.",
    vi: 'Bạn ở trong nhà một người vì họ tin chúng tôi. Nếu bạn lạm dụng quyền vào nhà đó – tiền, thẻ ngân hàng, mã PIN, BankID, lấy đi thứ gì đó, dùng chìa khóa cho việc khác ngoài buổi thăm, hoặc đòi tiền ngoài hợp đồng – chúng tôi sẽ trình báo công an. Nếu bạn thấy người khác làm vậy, hãy nói ra. Điều đó sẽ không bao giờ gây bất lợi cho bạn.',
    zh: '你能进入别人的家，是因为他们信任我们。若滥用这份准入——现金、银行卡、密码、BankID、带走物品、把钥匙用于探访以外的事，或索取合同以外的报酬——我们会向警方报案。看到别人这样做，请说出来。这绝不会对你不利。'
  };

  function medarbeidervarsel(kode) {
    return MEDARBEIDERVARSEL[kode] || MEDARBEIDERVARSEL.nb;
  }


  /* ---------------- kontostatus ----------------

     Rødt betyr at en person ikke får flere oppdrag. Det er en avgjørelse med
     følger for noens inntekt, og den behandles deretter.

     Tre regler, og de er der for å tåle å bli prøvd:

       1. Automatikken kan FORESLÅ rødt. Den kan aldri sette det. En
          automatisert avgjørelse som i betydelig grad påvirker noen, krever
          menneskelig inngripen, en begrunnelse, og en mulighet til å si sin
          mening – se personvernforordningen artikkel 22. Et rødt merke satt av
          en modell er nettopp det artikkelen handler om.

       2. Rødt krever et navn og en grunn. Ikke en score, ikke «flere
          tilbakemeldinger». En begrunnelse som ikke kan leses opp for den det
          gjelder, er ikke en begrunnelse.

       3. Personen får vite det, og får svare. Vi er ikke arbeidsgiver –
          konsekvensen for ansettelsesforholdet er leverandørens sak. Men å bli
          stengt ute uten å få vite hvorfor, skal ikke kunne skje her.

     Én dårlig tilbakemelding gir aldri rødt. Det ville gjort systemet til noe
     folk beskytter seg mot i stedet for å bruke. */

  var KONTOSTATUS = {
    gronn:   { navn: 'Aktiv',       farge: 'ok',
               betyr: 'Får oppdrag som vanlig',
               settesAv: 'automatisk' },
    gul:     { navn: 'Under oppfølging', farge: 'warn',
               betyr: 'Får grønne oppgaver, ikke gule. En sak er åpen',
               settesAv: 'menneske',
               krever: ['grunn', 'satt_av'] },
    rod:     { navn: 'Stanset',     farge: 'avvik',
               betyr: 'Får ingen nye oppdrag. Pågående besøk fullføres',
               settesAv: 'menneske',
               krever: ['grunn', 'satt_av', 'varslet'] },
    sperret: { navn: 'Stengt',      farge: 'avvik',
               betyr: 'Kontoen er stengt permanent',
               settesAv: 'menneske',
               krever: ['grunn', 'satt_av', 'varslet', 'klagefrist'] }
  };

  /* Hva som gir rødt. Listen er kort med vilje – en lang liste blir en
     skjønnsvurdering, og skjønn er nettopp det denne skal fjerne. */
  var GIR_ROD = [
    { id: 'misbruk',    hva: 'Misbruk av stillingen', umiddelbart: true },
    { id: 'overgrep',   hva: 'Mistanke om vold eller overgrep', umiddelbart: true },
    { id: 'forbudt',    hva: 'Håndtert penger, kort, PIN eller BankID', umiddelbart: true },
    { id: 'utenom',     hva: 'Bedt om betaling utenom avtalen', umiddelbart: true },
    { id: 'uteblitt',   hva: 'Uteblitt fra avtalt besøk gjentatte ganger', umiddelbart: false },
    { id: 'gjentatt',   hva: 'Samme alvorlige klage fra flere kunder', umiddelbart: false }
  ];

  /* Foreslår, setter ikke. Returnerer alltid hvem som må bestemme. */
  function foreslaaStatus(hendelser) {
    var alvorlig = (hendelser || []).filter(function (h) {
      return GIR_ROD.filter(function (g) { return g.id === h.type && g.umiddelbart; }).length;
    });

    if (alvorlig.length) {
      return {
        foreslatt: 'rod',
        umiddelbart: true,
        grunn: GIR_ROD.filter(function (g) { return g.id === alvorlig[0].type; })[0].hva,
        settesAv: 'Leverandørens driftsansvarlige',
        beskjed: 'Systemet foreslår stans. Et menneske må bekrefte, og personen skal få vite hvorfor.'
      };
    }

    /* Mønster, ikke enkelthendelse. To ulike kunder er minstekravet – ellers
       er det én kundes opplevelse, og det er noe annet enn et mønster. */
    var kunder = {};
    var gjentatte = (hendelser || []).filter(function (h) {
      return GIR_ROD.filter(function (g) { return g.id === h.type; }).length;
    });
    gjentatte.forEach(function (h) { kunder[h.kunde || '?'] = true; });

    if (gjentatte.length >= 3 && Object.keys(kunder).length >= 2) {
      return {
        foreslatt: 'gul',
        umiddelbart: false,
        grunn: gjentatte.length + ' hendelser fra ' + Object.keys(kunder).length + ' ulike kunder',
        settesAv: 'Leverandørens driftsansvarlige',
        beskjed: 'Systemet foreslår en samtale, ikke en stans.'
      };
    }

    return { foreslatt: 'gronn', umiddelbart: false, grunn: null, settesAv: null,
             beskjed: 'Ingenting som gir grunn til å endre status.' };
  }

  /* Setter statusen. Nekter hvis noe av det som kreves, mangler. Det er
     forskjellen på en regel og en intensjon. */
  function settStatus(niva, felt) {
    var s = KONTOSTATUS[niva];
    if (!s) return { ok: false, grunn: 'Ukjent status' };

    if (s.settesAv === 'menneske' && !(felt && felt.satt_av)) {
      return { ok: false, grunn: 'Denne statusen må settes av et navngitt menneske. ' +
                                 'Systemet kan foreslå den, ikke sette den.' };
    }

    var mangler = (s.krever || []).filter(function (k) { return !felt[k]; });
    if (mangler.length) {
      return { ok: false, grunn: 'Mangler: ' + mangler.join(', ') +
                                 '. Uten dette kan avgjørelsen ikke forklares for den det gjelder.' };
    }

    return {
      ok: true,
      status: niva,
      navn: s.navn,
      betyr: s.betyr,
      satt: felt.tid || new Date().toISOString(),
      satt_av: felt.satt_av,
      grunn: felt.grunn,
      /* Det personen faktisk får lese. Ikke en kode, ikke en score. */
      tilPersonen: 'Kontoen din er satt til «' + s.navn.toLowerCase() + '». ' +
                   'Grunnen er: ' + felt.grunn + '. ' +
                   'Er dette feil, kan du svare på denne meldingen. Et menneske leser svaret.'
    };
  }

  function kategori(id) {
    return KATEGORIER.filter(function (k) { return k.id === id; })[0] || null;
  }

  /* Virkedager, ikke kalenderdager – men bare for våre egne frister. Lovfrister
     regnes i klokketimer og bryr seg ikke om at det er lørdag.

     Helligdager håndteres ikke her. En frist som lander 17. mai er fortsatt
     riktig regnet, men den er ikke praktisk. Det er en kjent begrensning. */
  function leggTilVirkedager(fra, antall) {
    var d = new Date(fra);
    var igjen = antall;
    while (igjen > 0) {
      d.setDate(d.getDate() + 1);
      var ukedag = d.getDay();
      if (ukedag !== 0 && ukedag !== 6) igjen--;
    }
    return d.toISOString();
  }

  function leggTilTimer(fra, timer) {
    return new Date(new Date(fra).getTime() + timer * 3600000).toISOString();
  }

  /* Tar imot en klage og svarer med hva som skjer nå. Alt her er avgjort på
     forhånd – ingen modell vurderer alvorlighet. */
  function motta(klage) {
    var k = kategori(klage.kategori);
    if (!k) {
      /* Ukjent kategori går til et menneske. Det er den eneste forsvarlige
         standardverdien når man ikke vet hva man har fått inn. */
      return {
        ok: true, kategori: 'ukjent',
        til: 'Leverandørens driftsansvarlige',
        stopper: true,
        frist: leggTilVirkedager(klage.mottatt, 1),
        beskjed: 'Vi vet ikke hva dette er ennå. Et menneske ser på det i dag.'
      };
    }

    var svar = {
      ok: true,
      kategori: k.id,
      navn: k.navn,
      til: k.til,
      mot: k.mot,
      forklaring: MOT[k.mot],
      hjemmel: k.hjemmel,
      stopper: k.stopper,
      merk: k.merk
    };

    if (k.timer === 0) {
      svar.frist = klage.mottatt;
      svar.beskjed = 'Dette skal varsles nå, ikke behandles. ' + k.merk;
      return svar;
    }

    if (k.virkedager) {
      svar.bekreftelse = leggTilVirkedager(klage.mottatt, k.virkedager.bekreftelse);
      svar.frist = leggTilVirkedager(klage.mottatt, k.virkedager.svar);
      svar.beskjed = 'Bekreftet innen én virkedag, svar innen fem.';
      return svar;
    }

    svar.frist = leggTilTimer(klage.mottatt, k.timer);
    if (k.forleng) {
      svar.forlengetTil = leggTilTimer(klage.mottatt, k.timer + k.forleng.timer);
      svar.forlengVilkar = k.forleng.vilkar;
    }
    svar.beskjed = 'Frist: ' + k.frist + '.';
    return svar;
  }

  /* Er fristen i ferd med å ryke? Brukes til å varsle før den gjør det, ikke
     til å konstatere etterpå. */
  function status(frist, naa) {
    var igjen = (new Date(frist) - new Date(naa || Date.now())) / 3600000;
    if (igjen < 0)  return { niva: 'oversittet', timerIgjen: igjen };
    if (igjen < 4)  return { niva: 'kritisk',    timerIgjen: igjen };
    if (igjen < 24) return { niva: 'nær',        timerIgjen: igjen };
    return { niva: 'god', timerIgjen: igjen };
  }

  /* Kanalen må virke uten at noen er logget inn, og uten app. Den som vil
     klage, er sjelden den som har kontoen. */
  var KANALER = [
    { id: 'lenke',    hva: 'Lenke nederst i hver familiemelding', krever: 'ingenting' },
    { id: 'telefon',  hva: 'Telefonnummer til leverandøren',      krever: 'ingenting' },
    { id: 'epost',    hva: 'E-post til leverandøren',             krever: 'ingenting' },
    { id: 'konsoll',  hva: 'Direkte i oversikten',                krever: 'innlogging' }
  ];

  return {
    MOT: MOT,
    KATEGORIER: KATEGORIER,
    HVIS_FORBRUKER: HVIS_FORBRUKER,
    KANALER: KANALER,
    KONTOSTATUS: KONTOSTATUS,
    GIR_ROD: GIR_ROD,
    foreslaaStatus: foreslaaStatus,
    settStatus: settStatus,
    MEDARBEIDERVARSEL: MEDARBEIDERVARSEL,
    medarbeidervarsel: medarbeidervarsel,
    kategori: kategori,
    motta: motta,
    status: status,
    leggTilVirkedager: leggTilVirkedager
  };
})();
