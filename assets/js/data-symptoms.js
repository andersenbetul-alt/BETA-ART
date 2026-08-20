/* Naviar Care — complaint catalogue and specialty weighting.
   Each entry maps a patient complaint to the specialties best placed to
   handle it. Weights are 0-10; the router sums them across everything the
   patient selected. Labels come from i18n (sym.<id>), so a patient always
   searches and reads in their own language; `syn` adds extra search terms.  */
(function (window) {
  "use strict";
  var N = window.NaviarData = window.NaviarData || {};

  /* urgency: baseline 1 (routine) .. 3 (see someone today). Red flags can
     escalate any complaint to emergency regardless of this baseline.        */
  N.symptoms = [
    /* ---------------------------------------------------- head & nervous */
    { id: "headache", region: "head", urgency: 1,
      spec: [["general-practice",5],["neurology",7],["ent",2],["ophthalmology",2]],
      syn: { en: ["head pain","migraine","tension headache"], tr: ["bas agrisi","başağrısı","migren"] } },
    { id: "migraine", region: "head", urgency: 1,
      spec: [["neurology",9],["general-practice",3]],
      syn: { en: ["aura","throbbing headache"], tr: ["migren","zonklayan bas agrisi"] } },
    { id: "dizziness", region: "head", urgency: 2,
      spec: [["ent",7],["neurology",6],["cardiology",4],["general-practice",3]],
      syn: { en: ["vertigo","spinning","lightheaded","balance"], tr: ["bas donmesi","baş dönmesi","denge"] } },
    { id: "fainting", region: "head", urgency: 3,
      spec: [["cardiology",8],["neurology",6],["emergency",5],["general-practice",2]],
      syn: { en: ["syncope","passed out","blackout"], tr: ["bayilma","bayılma","senkop"] } },
    { id: "seizure", region: "head", urgency: 3,
      spec: [["neurology",10],["emergency",7]],
      syn: { en: ["fit","convulsion","epilepsy"], tr: ["nobet","nöbet","havale","epilepsi"] } },
    { id: "numbness", region: "head", urgency: 2,
      spec: [["neurology",8],["orthopedics",4],["general-practice",2]],
      syn: { en: ["tingling","pins and needles","no feeling"], tr: ["uyusma","uyuşma","karincalanma"] } },
    { id: "memory-problems", region: "head", urgency: 1,
      spec: [["neurology",8],["psychiatry",5],["general-practice",3]],
      syn: { en: ["forgetful","confusion","dementia"], tr: ["unutkanlik","hafiza","demans"] } },
    { id: "tremor", region: "head", urgency: 1,
      spec: [["neurology",9],["endocrinology",4]],
      syn: { en: ["shaking","shaky hands","parkinson"], tr: ["titreme","el titremesi"] } },

    /* ------------------------------------------------------ heart & chest */
    { id: "chest-pain", region: "chest", urgency: 3,
      spec: [["cardiology",9],["emergency",7],["pulmonology",4],["gastroenterology",3]],
      syn: { en: ["heart pain","pressure in chest","angina"], tr: ["gogus agrisi","göğüs ağrısı","kalp agrisi"] } },
    { id: "palpitations", region: "chest", urgency: 2,
      spec: [["cardiology",9],["endocrinology",3],["psychiatry",2]],
      syn: { en: ["racing heart","irregular heartbeat","fluttering"], tr: ["carpinti","çarpıntı","kalp ritmi"] } },
    { id: "shortness-of-breath", region: "chest", urgency: 3,
      spec: [["pulmonology",8],["cardiology",7],["emergency",4],["allergy-immunology",3]],
      syn: { en: ["breathless","cannot breathe","dyspnea"], tr: ["nefes darligi","nefes darlığı","soluk"] } },
    { id: "high-blood-pressure", region: "chest", urgency: 2,
      spec: [["cardiology",8],["internal-medicine",6],["nephrology",4],["general-practice",4]],
      syn: { en: ["hypertension","bp high"], tr: ["yuksek tansiyon","yüksek tansiyon","hipertansiyon"] } },
    { id: "leg-swelling", region: "chest", urgency: 2,
      spec: [["cardiology",7],["nephrology",6],["general-surgery",4],["internal-medicine",3]],
      syn: { en: ["swollen ankles","edema","fluid retention"], tr: ["bacak sismesi","ödem","şişlik"] } },

    /* ---------------------------------------------------------- breathing */
    { id: "cough", region: "resp", urgency: 1,
      spec: [["pulmonology",7],["general-practice",6],["ent",3],["allergy-immunology",3]],
      syn: { en: ["coughing","phlegm","chest infection"], tr: ["oksuruk","öksürük","balgam"] } },
    { id: "wheezing", region: "resp", urgency: 2,
      spec: [["pulmonology",9],["allergy-immunology",6],["general-practice",2]],
      syn: { en: ["asthma","whistling breath"], tr: ["hirilti","hışıltı","astim","astım"] } },
    { id: "sore-throat", region: "resp", urgency: 1,
      spec: [["ent",7],["general-practice",6],["infectious-disease",3]],
      syn: { en: ["throat pain","tonsils","strep"], tr: ["bogaz agrisi","boğaz ağrısı","bademcik"] } },
    { id: "blocked-nose", region: "resp", urgency: 1,
      spec: [["ent",8],["allergy-immunology",6],["general-practice",2]],
      syn: { en: ["stuffy nose","sinus","runny nose","congestion"], tr: ["burun tikanikligi","sinuzit","nezle"] } },
    { id: "fever", region: "resp", urgency: 2,
      spec: [["general-practice",7],["infectious-disease",7],["internal-medicine",4],["pediatrics",3]],
      syn: { en: ["temperature","hot","chills","flu"], tr: ["ates","ateş","titreme","grip"] } },
    { id: "loss-of-smell", region: "resp", urgency: 1,
      spec: [["ent",9],["neurology",3],["infectious-disease",2]],
      syn: { en: ["cannot smell","anosmia","no taste"], tr: ["koku kaybi","tat alamama"] } },

    /* ---------------------------------------------------------- digestion */
    { id: "abdominal-pain", region: "abdomen", urgency: 2,
      spec: [["gastroenterology",8],["general-surgery",5],["general-practice",4],["gynecology",3],["urology",2]],
      syn: { en: ["stomach pain","belly ache","cramps"], tr: ["karin agrisi","karın ağrısı","mide agrisi"] } },
    { id: "nausea-vomiting", region: "abdomen", urgency: 2,
      spec: [["gastroenterology",7],["general-practice",5],["neurology",2],["infectious-disease",2]],
      syn: { en: ["sick","throwing up","vomit"], tr: ["bulanti","bulantı","kusma"] } },
    { id: "diarrhea", region: "abdomen", urgency: 2,
      spec: [["gastroenterology",8],["infectious-disease",5],["general-practice",4]],
      syn: { en: ["loose stools","runny stomach"], tr: ["ishal","surgun"] } },
    { id: "constipation", region: "abdomen", urgency: 1,
      spec: [["gastroenterology",8],["general-practice",4],["nutrition",3]],
      syn: { en: ["cannot pass stool","hard stools"], tr: ["kabizlik","kabızlık"] } },
    { id: "heartburn", region: "abdomen", urgency: 1,
      spec: [["gastroenterology",9],["general-practice",3],["cardiology",2]],
      syn: { en: ["reflux","acid","indigestion","gerd"], tr: ["mide yanmasi","reflu","reflü","eksime"] } },
    { id: "blood-in-stool", region: "abdomen", urgency: 3,
      spec: [["gastroenterology",9],["general-surgery",6],["oncology",3]],
      syn: { en: ["rectal bleeding","black stool","piles","hemorrhoids"], tr: ["disida kan","makat kanamasi","basur"] } },
    { id: "jaundice", region: "abdomen", urgency: 3,
      spec: [["gastroenterology",9],["infectious-disease",5],["internal-medicine",4]],
      syn: { en: ["yellow eyes","yellow skin","liver"], tr: ["sarilik","sarılık","karaciger"] } },
    { id: "weight-loss", region: "abdomen", urgency: 2,
      spec: [["internal-medicine",7],["oncology",5],["endocrinology",5],["gastroenterology",4],["nutrition",3]],
      syn: { en: ["losing weight","unintentional weight loss"], tr: ["kilo kaybi","zayiflama"] } },
    { id: "appetite-loss", region: "abdomen", urgency: 1,
      spec: [["gastroenterology",6],["internal-medicine",5],["psychiatry",3],["nutrition",3]],
      syn: { en: ["no appetite","not eating"], tr: ["istahsizlik","iştahsızlık"] } },

    /* ------------------------------------------------------------ urinary */
    { id: "painful-urination", region: "urinary", urgency: 2,
      spec: [["urology",9],["general-practice",4],["gynecology",3],["infectious-disease",2]],
      syn: { en: ["burning when peeing","uti","cystitis"], tr: ["idrar yanmasi","idrar yolu enfeksiyonu"] } },
    { id: "blood-in-urine", region: "urinary", urgency: 3,
      spec: [["urology",10],["nephrology",6],["oncology",3]],
      syn: { en: ["red urine","haematuria"], tr: ["idrarda kan","kanli idrar"] } },
    { id: "frequent-urination", region: "urinary", urgency: 1,
      spec: [["urology",8],["endocrinology",6],["nephrology",3]],
      syn: { en: ["peeing often","urgency","night urination"], tr: ["sik idrara cikma","sık idrar"] } },
    { id: "kidney-pain", region: "urinary", urgency: 3,
      spec: [["urology",8],["nephrology",7],["emergency",3]],
      syn: { en: ["flank pain","kidney stone","back side pain"], tr: ["bobrek agrisi","böbrek taşı","yan agri"] } },
    { id: "sexual-health", region: "urinary", urgency: 1,
      spec: [["urology",7],["gynecology",5],["psychology",4],["infectious-disease",4]],
      syn: { en: ["erectile dysfunction","libido","sti","std"], tr: ["cinsel saglik","sertlesme sorunu"] } },

    /* --------------------------------------------------- women's health */
    { id: "pelvic-pain", region: "gyn", urgency: 2,
      spec: [["gynecology",9],["urology",4],["gastroenterology",3]],
      syn: { en: ["lower belly pain","ovary pain"], tr: ["kasik agrisi","pelvik agri","yumurtalik"] } },
    { id: "irregular-periods", region: "gyn", urgency: 1,
      spec: [["gynecology",9],["endocrinology",5]],
      syn: { en: ["missed period","heavy bleeding","pcos"], tr: ["adet duzensizligi","regl","adet gormeme"] } },
    { id: "pregnancy-concern", region: "gyn", urgency: 2,
      spec: [["gynecology",10],["general-practice",3],["nutrition",2]],
      syn: { en: ["pregnant","antenatal","morning sickness"], tr: ["hamilelik","gebelik"] } },
    { id: "menopause", region: "gyn", urgency: 1,
      spec: [["gynecology",9],["endocrinology",4],["psychology",2]],
      syn: { en: ["hot flushes","hot flashes"], tr: ["menopoz","sicak basmasi"] } },
    { id: "breast-lump", region: "gyn", urgency: 3,
      spec: [["general-surgery",7],["oncology",7],["gynecology",5]],
      syn: { en: ["lump in breast","breast pain"], tr: ["memede kitle","gogus kitlesi"] } },

    /* --------------------------------------------------- bones & muscles */
    { id: "back-pain", region: "msk", urgency: 1,
      spec: [["orthopedics",7],["physiotherapy",7],["neurology",4],["rheumatology",3]],
      syn: { en: ["lower back","lumbago","slipped disc","sciatica"], tr: ["bel agrisi","sirt agrisi","fitik","siyatik"] } },
    { id: "neck-pain", region: "msk", urgency: 1,
      spec: [["orthopedics",7],["physiotherapy",7],["neurology",3]],
      syn: { en: ["stiff neck","cervical"], tr: ["boyun agrisi","boyun tutulmasi"] } },
    { id: "joint-pain", region: "msk", urgency: 1,
      spec: [["rheumatology",8],["orthopedics",6],["physiotherapy",4]],
      syn: { en: ["arthritis","stiff joints","swollen joint"], tr: ["eklem agrisi","romatizma","kireclenme"] } },
    { id: "injury", region: "msk", urgency: 3,
      spec: [["orthopedics",9],["emergency",6],["physiotherapy",4]],
      syn: { en: ["sprain","fracture","fell","twisted","broken bone"], tr: ["yaralanma","burkulma","kirik","düşme"] } },
    { id: "muscle-pain", region: "msk", urgency: 1,
      spec: [["physiotherapy",6],["rheumatology",6],["general-practice",3],["orthopedics",3]],
      syn: { en: ["sore muscles","cramp","fibromyalgia"], tr: ["kas agrisi","kramp"] } },

    /* ----------------------------------------------------------- skin */
    { id: "rash", region: "skin", urgency: 2,
      spec: [["dermatology",9],["allergy-immunology",5],["infectious-disease",3],["pediatrics",2]],
      syn: { en: ["spots","red skin","eczema","psoriasis"], tr: ["dokuntu","kizariklik","egzama","sedef"] } },
    { id: "itching", region: "skin", urgency: 1,
      spec: [["dermatology",8],["allergy-immunology",5],["gastroenterology",2]],
      syn: { en: ["itchy skin","scratching"], tr: ["kasinti","kaşıntı"] } },
    { id: "mole-change", region: "skin", urgency: 3,
      spec: [["dermatology",10],["oncology",5]],
      syn: { en: ["changing mole","new mole","melanoma","skin cancer"], tr: ["ben degisimi","ben","melanom"] } },
    { id: "acne", region: "skin", urgency: 1,
      spec: [["dermatology",9],["endocrinology",3]],
      syn: { en: ["pimples","spots on face"], tr: ["sivilce","akne"] } },
    { id: "hair-loss", region: "skin", urgency: 1,
      spec: [["dermatology",8],["endocrinology",5]],
      syn: { en: ["balding","thinning hair","alopecia"], tr: ["sac dokulmesi","saç dökülmesi"] } },
    { id: "wound-infection", region: "skin", urgency: 3,
      spec: [["general-surgery",7],["dermatology",5],["infectious-disease",6],["emergency",3]],
      syn: { en: ["infected cut","pus","abscess","boil"], tr: ["yara enfeksiyonu","apse","irin"] } },

    /* ------------------------------------------------------ eyes / ears */
    { id: "vision-problem", region: "eye", urgency: 3,
      spec: [["ophthalmology",10],["neurology",4]],
      syn: { en: ["blurred vision","cannot see","double vision","sight loss"], tr: ["gorme sorunu","bulanik gorme","görme kaybı"] } },
    { id: "eye-pain", region: "eye", urgency: 2,
      spec: [["ophthalmology",9],["ent",2]],
      syn: { en: ["red eye","sore eye","eye discharge","conjunctivitis"], tr: ["goz agrisi","göz ağrısı","kizarik goz"] } },
    { id: "ear-pain", region: "ear", urgency: 2,
      spec: [["ent",9],["pediatrics",3],["general-practice",3]],
      syn: { en: ["earache","ear infection","blocked ear"], tr: ["kulak agrisi","kulak ağrısı","kulak enfeksiyonu"] } },
    { id: "hearing-loss", region: "ear", urgency: 2,
      spec: [["ent",10],["neurology",2]],
      syn: { en: ["deaf","cannot hear","tinnitus","ringing in ears"], tr: ["isitme kaybi","işitme kaybı","kulak cinlamasi"] } },
    { id: "nosebleed", region: "ear", urgency: 2,
      spec: [["ent",8],["hematology",4],["general-practice",2]],
      syn: { en: ["bleeding nose","epistaxis"], tr: ["burun kanamasi","burun kanaması"] } },

    /* ---------------------------------------------------------- dental */
    { id: "toothache", region: "dental", urgency: 2,
      spec: [["dentistry",10],["general-practice",2]],
      syn: { en: ["tooth pain","cavity","dental abscess"], tr: ["dis agrisi","diş ağrısı","curuk"] } },
    { id: "bleeding-gums", region: "dental", urgency: 1,
      spec: [["dentistry",9],["hematology",3]],
      syn: { en: ["gum disease","swollen gums"], tr: ["dis eti kanamasi","diş eti"] } },

    /* ------------------------------------------------------- metabolic */
    { id: "fatigue", region: "general", urgency: 1,
      spec: [["internal-medicine",6],["endocrinology",6],["hematology",5],["psychiatry",4],["general-practice",4]],
      syn: { en: ["tired","exhausted","no energy","weakness"], tr: ["yorgunluk","halsizlik","bitkinlik"] } },
    { id: "excessive-thirst", region: "general", urgency: 2,
      spec: [["endocrinology",9],["nephrology",4],["internal-medicine",3]],
      syn: { en: ["always thirsty","diabetes","high sugar"], tr: ["asiri susama","seker hastaligi","diyabet"] } },
    { id: "thyroid-concern", region: "general", urgency: 1,
      spec: [["endocrinology",10],["internal-medicine",3]],
      syn: { en: ["thyroid","goitre","tsh"], tr: ["tiroid","guatr"] } },
    { id: "chronic-condition-followup", region: "general", urgency: 1,
      spec: [["internal-medicine",7],["general-practice",7],["endocrinology",4],["cardiology",3]],
      syn: { en: ["repeat prescription","medication review","follow up","chronic illness"], tr: ["kontrol","ilac yenileme","kronik hastalik"] } },

    /* ------------------------------------------------------ mental health */
    { id: "anxiety", region: "mind", urgency: 2,
      spec: [["psychiatry",8],["psychology",9],["general-practice",2]],
      syn: { en: ["worry","nervous","panic","stress"], tr: ["kaygi","anksiyete","endise","panik"] } },
    { id: "low-mood", region: "mind", urgency: 2,
      spec: [["psychiatry",9],["psychology",8],["general-practice",2]],
      syn: { en: ["depression","sad","hopeless","crying"], tr: ["depresyon","mutsuzluk","uzuntu"] } },
    { id: "insomnia", region: "mind", urgency: 1,
      spec: [["sleep-medicine",9],["psychiatry",5],["psychology",4],["pulmonology",3]],
      syn: { en: ["cannot sleep","sleepless","snoring","sleep apnea"], tr: ["uykusuzluk","uyuyamama","horlama"] } },
    { id: "burnout", region: "mind", urgency: 1,
      spec: [["psychology",9],["psychiatry",5],["nutrition",2]],
      syn: { en: ["work stress","overwhelmed","exhaustion"], tr: ["tukenmislik","tükenmişlik","is stresi"] } },
    { id: "addiction", region: "mind", urgency: 2,
      spec: [["psychiatry",9],["psychology",7],["internal-medicine",2]],
      syn: { en: ["alcohol","smoking","substance","quit"], tr: ["bagimlilik","bağımlılık","alkol","sigara"] } },

    /* ------------------------------------------------------------ allergy */
    { id: "allergic-reaction", region: "allergy", urgency: 3,
      spec: [["allergy-immunology",10],["emergency",5],["dermatology",4]],
      syn: { en: ["hives","swelling","anaphylaxis","allergy"], tr: ["alerji","kurdesen","sismesi","alerjik"] } },

    /* ----------------------------------------------------------- children */
    { id: "child-fever", region: "child", urgency: 3,
      spec: [["pediatrics",10],["emergency",4],["infectious-disease",3]],
      syn: { en: ["baby fever","child temperature","infant hot"], tr: ["cocuk atesi","bebek atesi"] } },
    { id: "child-rash", region: "child", urgency: 2,
      spec: [["pediatrics",9],["dermatology",6]],
      syn: { en: ["baby rash","child spots"], tr: ["cocuk dokuntusu","bebek dokuntusu"] } },
    { id: "child-feeding", region: "child", urgency: 1,
      spec: [["pediatrics",9],["nutrition",6]],
      syn: { en: ["not feeding","growth","weaning","baby weight"], tr: ["beslenme","emzirme","bebek kilosu"] } },

    /* -------------------------------------------------------- navigation */
    { id: "second-opinion", region: "service", urgency: 1,
      spec: [["internal-medicine",6],["oncology",4],["general-surgery",4],["general-practice",4]],
      syn: { en: ["another opinion","review my diagnosis","confirm diagnosis"], tr: ["ikinci gorus","ikinci görüş"] } },
    { id: "test-results", region: "service", urgency: 1,
      spec: [["internal-medicine",8],["general-practice",6],["hematology",3]],
      syn: { en: ["blood test","scan results","explain my results","lab"], tr: ["tahlil","test sonucu","kan tahlili"] } },
    { id: "travel-health", region: "service", urgency: 1,
      spec: [["infectious-disease",8],["general-practice",6]],
      syn: { en: ["vaccination","travel advice","malaria","immunisation"], tr: ["seyahat sagligi","asi","aşı"] } },
    { id: "nutrition-advice", region: "service", urgency: 1,
      spec: [["nutrition",10],["endocrinology",3],["gastroenterology",2]],
      syn: { en: ["diet","weight gain","healthy eating","obesity"], tr: ["beslenme","diyet","kilo"] } }
  ];

  /* Red flags escalate to emergency care no matter which complaint was
     chosen. Labels come from i18n (flag.<id>).                            */
  N.redFlags = [
    { id: "chest-pressure",   spec: "emergency" },
    { id: "breathing-severe", spec: "emergency" },
    { id: "face-droop",       spec: "emergency" },
    { id: "heavy-bleeding",   spec: "emergency" },
    { id: "consciousness",    spec: "emergency" },
    { id: "sudden-vision",    spec: "emergency" },
    { id: "self-harm",        spec: "emergency" },
    { id: "infant-unwell",    spec: "emergency" }
  ];

  N.symptomById = function (id) {
    for (var i = 0; i < N.symptoms.length; i++) {
      if (N.symptoms[i].id === id) return N.symptoms[i];
    }
    return null;
  };
})(window);
