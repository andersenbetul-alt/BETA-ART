# Q — Ucuz Doğrulama Materyalleri (Faz 1: VALIDATE, kod yok)

**Amaç:** `docs/q-growth-network-vizyon.md`'deki tek varsayımı test etmek —
"hedefe göre kişiselleştirilmiş bir gelişim yolu, rastgele blog gezinmesinden
daha değerli mi?" Bu belge bir ürün değil, bir **öğrenme aracı**: landing
page taslağı gerçek trafiğe konmadan önce mesajı netleştirmek için; görüşme
soruları gerçek insanlarla konuşurken kullanılmak için.

**Dil notu:** Metinler İngilizce yazıldı — ilk test kitlesi (Norveç'te
çalışan/iş arayan profesyoneller) İngilizce'yi rahat okur ve İngilizce
metin hızlı test edilir. Gerçek Norveççe kullanıcı görüşmelerinden önce
Norveççeye çevrilmesi gerekir; bu belge o çeviriyi yapmıyor.

**Bu materyaller yayına konursa ne olur, ne olmaz:** Landing page yalnızca
e-posta topluyor, hiçbir ürün vaat etmiyor ("we're building X, want early
access?"). Hiçbir ödeme alınmıyor. `npm run guvenlik`'in denetlediği
kurallar (mailto enjeksiyonu, form güvenliği, CSP) bu sayfa gerçekten
yayına konursa geçerli olmaya devam eder — bu belge yalnızca metni üretiyor,
yayına koyma ayrı bir karar.

---

## 1. Landing page taslağı

### Hero

**Headline (3 seçenek, A/B için):**
1. "Stop reading. Start progressing."
2. "Tell us your goal. We'll get you there."
3. "Turn what you read into what you achieve."

**Subheadline:**
> Q isn't another blog. Tell us what you want to improve — get a
> step-by-step path built from real experts' knowledge, and see whether
> you're actually moving forward, not just reading.

**CTA button:** "Get early access" (e-posta yakalama, tek alan)

**CTA altı mikro-metin:** "No spam. No product yet — just the first 100
people shaping what we build."

### Nasıl çalışır (3 adım)

1. **Tell us your goal.** "I want a new job in 90 days." "I want to use AI
   at work." "I want to earn more."
2. **Get your path.** A short, ordered sequence of real experts' knowledge
   — not a feed, not a list of 50 articles.
3. **Track progress, not pageviews.** We ask what you learned, what you
   applied, and what happened — not how long you stayed.

### "Neden ChatGPT değil?" (itiraz karşılama bloğu)

> ChatGPT gives you an answer. Q gives you a path, real people's tested
> experience, and a way to know if it's actually working for you.

### Güven satırı

> No ads. No infinite scroll. Just your next best step.

### Alt bilgi

Basit: gizlilik notu (e-posta yalnızca erken erişim için kullanılır,
üçüncü tarafa verilmez), iletişim adresi.

---

## 2. Kullanıcı görüşmesi — 20 kişi

**Hedef kitle:** 25–55 yaş, kariyer değiştirmek/AI'a uyum sağlamak/gelir
artırmak isteyen çalışan veya iş arayan (haritadaki wedge ile aynı).

**Isınma (2 soru)**
1. Son 3 ayda kariyerin/işin/gelirin hakkında bir şeyi değiştirmeye
   çalıştın mı? Ne oldu?
2. Bunu araştırırken nereye bakıyorsun — Google, YouTube, ChatGPT,
   arkadaş, LinkedIn?

**Problem keşfi (5 soru)**
3. En son "bunu öğrenmeliyim/yapmalıyım" dediğin ama başlayamadığın bir
   şey var mıydı? Neden başlayamadın?
4. Bir konuda ilerlerken en çok nerede takılıyorsun — bilgi bulmakta mı,
   doğru bilgiyi seçmekte mi, uygulamaya geçmekte mi, devam etmekte mi?
5. Bir makale/video izledikten sonra genelde uyguluyor musun, yoksa
   okuyup geçiyor musun? (dürüst cevap istendiğini vurgula)
6. Şu ana kadar bir hedefin için bir "yol/plan" izlediğin oldu mu (kurs,
   koçluk, mentorluk)? İşe yaradı mı, neden/neden değil?
7. Bunu takip etmek/ölçmek için bir şey kullanıyor musun (not defteri,
   uygulama, hiçbir şey)?

**Konsepte tepki (6 soru) — landing page'i göster**
8. Bu sayfayı okuduğunda ilk aklına gelen ne oldu?
9. Bu sana yardımcı olur muydu? Neden/neden değil?
10. Hangi cümle/kelime kafanı karıştırdı ya da inandırıcı gelmedi?
11. Bunun yerine şu an ne yapıyorsun (aynı ihtiyaç için)?
12. Bu ücretsiz olsa kaydolur muydun? Ücretliyse (€10-15/ay) kaydolur
    muydun?
13. Bunu bir arkadaşına önerir miydin? Kime, hangi cümlelerle?

**Kapanış (2 soru)**
14. Bunu gerçekten kullanmak isteseydin, ilk hafta ne görmen gerekirdi ki
    "işe yarıyor" desin?
15. Sormadığım ama sormam gereken bir şey var mı?

**Not:** Gerçek görüşmede 20 dakika hedeflenir; hepsi sorulmaz, akışa göre
seçilir. Cevaplar kayda geçirilir (izinle), uydurma/yorumlama olmadan.

---

## 3. Uzman görüşmesi — 10 kişi

**Hedef kitle:** Kariyer koçları, AI/prodüktivite eğitmenleri, iş arama
danışmanları, LinkedIn'de aktif pratisyenler — "gerçekten bu işi yapmış"
insanlar (Q Practitioner/Q Expert profiline uygun).

**Isınma (2 soru)**
1. Şu anda bilgini/deneyimini nerede paylaşıyorsun (LinkedIn, kendi
   blogun, YouTube, kurs, hiçbir yerde)?
2. Bundan gelir elde ediyor musun? Nasıl (danışmanlık, kurs, sponsorluk,
   hiçbiri)?

**Mevcut davranış (4 soru)**
3. İçerik üretirken en çok zaman alan/yorucu olan kısım ne?
4. Takipçi/okuyucu sayısı ile "bu insanlara gerçekten yardımcı oldum"
   hissi arasında bir fark hissediyor musun? Örnek verebilir misin?
5. Şu anki platformlardan (LinkedIn, YouTube, kendi sitesi) en çok
   şikayet ettiğin şey ne?
6. Başka insanların senin içeriğini "uyguladığını ve sonuç aldığını"
   nasıl öğreniyorsun — hiç öğreniyor musun?

**Konsepte tepki (5 soru) — Q Expert/Q Path fikrini anlat**
7. "Kaç kişi okudu" yerine "kaç kişi uyguladı, kaç kişi sonuç aldı"
   gösteren bir sistem olsa, senin için değerli olur muydu? Neden?
8. Bilgini 2-4 haftalık bir "yol" (path) haline getirmek ilgini çeker
   miydi? En çok hangi konuda bunu yapardın?
9. Bunu satabileceğin bir sistem olsa (örn. €49, sen %80 alsan) ilgilenir
   miydin? Hangi komisyon oranı sana adil gelirdi?
10. Bunun için ne kadar zaman ayırmaya razı olurdun (haftalık)?
11. Seni tereddüte düşürecek en büyük şey ne olurdu (itibar riski, zaman,
    güven, teknik zorluk, başka)?

**Kapanış (1 soru)**
12. Bunu ilk deneyen 10 uzmandan biri olmak ister miydin — karşılığında
    ne beklerdin (erken erişim, komisyon, kitle, başka)?

---

## Bu materyallerle ne yapılır

1. Landing page metni bir sayfaya (statik HTML, mevcut mimariyle uyumlu,
   `noindex`, formu gerçek bir e-posta toplama servisine — ör. Buttondown
   — bağlı) dönüştürülüp gerçekten yayına konabilir; bu ayrı bir onay
   gerektirir.
2. Görüşme soruları gerçek insanlarla (kullanıcı tarafından, bu ortamda
   yapılamaz — gerçek insan teması gerekir) uygulanır.
3. Sonuçlar `docs/q-growth-network-vizyon.md`'deki "İlk yatırım kararının
   kanıt eşiği" ile karşılaştırılır — 20 görüşmeden çıkan örüntü, 1.000
   kullanıcılık eşiğin küçük bir öncü sinyali olarak okunur, kesin kanıt
   değil.
