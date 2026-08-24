---
name: task-observer
description: Normal çalışma sırasında tekrar eden kalıpları fark eder, gözlem olarak kaydeder ve bunları beceriye dönüştürmeyi önerir. Aynı düzeltmenin ikinci kez yapılması, aynı sorunun tekrar sorulması, aynı komut dizisinin yeniden yazılması gibi durumlarda devreye girer. Kullanıcı "gözlemleri göster", "ne fark ettin", "bunu beceriye çevir" dediğinde de kullanılır. Gözlemi kullanıcı onaylamadan beceri yazmaz.
---

# Task Observer

Çalışırken tekrarı fark eder, kaydeder, sonra beceriye dönüştürür.

```
Normal çalışma
      ↓
Gözlemci izler
      ↓
Tekrar eden kalıbı bulur
      ↓
Gözlem kaydeder
      ↓
Kullanıcı inceler
      ↓
Mevcut beceriyi güncelle  VEYA  yeni beceri yaz
```

Son adımdaki "kullanıcı inceler" atlanmaz. Gözlem otomatik beceriye dönmez —
tekrar eden her şey kural olmayı hak etmez.

## Ne sayılır

Kalıp, **en az iki kez** görülen ve **bir sonraki sefere aktarılabilir** olandır.

| Sayılır | Sayılmaz |
| --- | --- |
| Aynı hata biçimi ikinci kez düzeltildi | Tek seferlik hata |
| Aynı komut dizisi elle yeniden kuruldu | Aynı komutun tekrar çalıştırılması |
| Aynı soru ikinci kez soruldu | Konuşmanın doğal akışı |
| Aynı kısıt tekrar keşfedildi | Bilinen ve kayıtlı kısıt |
| Aynı doğrulama adımı unutuldu | Rutin doğrulama |

Ölçüt tekrar sayısı değil, **bir dahakine zaman kazandırıp kazandırmayacağıdır.**

## Gözlem nasıl yazılır

`references/observations.md` altına, her biri şu üç alanla:

```markdown
## <kısa başlık>
- **Kaç kez:** 2  (nerede olduğu: dosya, komut veya konu)
- **Kalıp:** Ne tekrarlandı — tek cümle, somut
- **Öneri:** Yeni beceri mi, mevcut becerinin güncellenmesi mi, yoksa
  sadece CLAUDE.md'ye bir satır mı
```

Gözlem yorum değil kayıttır: "kullanıcı X istiyor gibi" değil, "X iki kez
yapıldı" yazılır.

## Beceriye ne zaman dönüşür

Kullanıcı onayladıktan sonra, şu sırayla en ucuz seçenek denenir:

1. **CLAUDE.md'ye bir satır** — kural tek cümleyse burada kalır.
2. **Mevcut beceriyi güncelle** — konu zaten bir becerinin alanındaysa.
3. **Yeni beceri** — ancak kendi tetikleyicisi, kendi referansları olan
   ayrı bir iş alanıysa.

Üçüncüsü en pahalı seçenek: her yeni beceri bakım yükü ve tetikleme
karmaşası ekler. İlk ikisi denenmeden ona geçilmez.

## Bu projede halihazırda görülenler

`references/observations.md` — bu oturumda tespit edilmiş kalıplar ve
hangisinin beceriye dönüp dönmediği.

Doğrulama ve raporlama alışkanlıkları ayrı tutuluyor:
`references/checkpoints.md` · `references/reporting.md`
