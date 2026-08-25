---
name: surec-belgesi
description: Use when asked for a process narrative, risk and control matrix, flowchart, SoD/segregation-of-duties review, or "süreç anlatısı / risk-kontrol matrisi / akış şeması" for any QBLOGG or related-project process — including prompts that begin "Here's how this process runs".
---

# Süreç belgesi — ev formatı

Bu beceri format bağlar, analiz öğretmez (temel çizgi testi: model SoD
analizini beceri olmadan da aynı kalitede yapıyor; başarısız olan tek
şey ev formatına uyumdu). Çalışılmış örnek:
**`docs/surec-action-pages.md`** — birebir şablon olarak açıp bak.

## Tarif yoksa

"Here's how this process runs" gelip devamında süreç tarifi YOKSA iki
geçerli yol vardır, üçüncüsü yasaktır:
1. Tarifi iste (kim, neyi, hangi sırayla, hangi sistemde, kim onaylar), YA DA
2. Depoda belgeli GERÇEK bir sürece uygula ve hangi sürece uyguladığını
   açıkça söyle.
Genel/uydurma bir süreç anlatısı üretme.

## Çıktı yapısı (bu sırayla, bu adlarla)

1. **Süreç anlatısı** — başlık alanları: Amaç · Kapsam · Tetik ·
   Sahip · Sistemler; ardından numaralı adımlar (her adımda uygulayan
   kişi); en sonda Çıktılar.
2. **Risk-kontrol matrisi** — kolonlar tam olarak:
   `# | Risk | Kontrol | Sahip | Sıklık | Durum`
   Durum değerleri: `VAR` / `KISMEN (Bx)` / `**YOK (Bx)**`.
   Eksik kontrol matriste satır olarak durur, "öneri" diye gizlenmez.
3. **Akış şeması** — mermaid (`flowchart TD`), ASCII çizim değil;
   düğüm etiketlerine ilgili bulgu kodu yazılır (`B1: yol tanimsiz`).
   Mermaid etiketlerinde Türkçe özel karakter ve parantezden kaçın.
4. **Bulgular** — `B1, B2...` numaralı; her bulgu: ne eksik + somut
   öneri + kimin adımı olduğu. SoD bölümünde tek kişilik şirket nüansı:
   tamamı ayrıştırılamaz, ilk gerçekçi ayrıştırma önerilir.
5. Kapanışta öncelik sırası (hangi bulgu önce).

## Proje kuralları geçerli

Rakam uydurulmaz; belirsiz tutar/sıklık `[DOLDURULACAK]` ile işaretlenir.
Belge `docs/` altına yazılır, proje günlüğüne kayıt düşülür.
