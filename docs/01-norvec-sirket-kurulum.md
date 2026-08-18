# 01 — Norveç'te Şirket Kurulumu (COBBAN)

> Bilgilendirme amaçlıdır. Tutar ve eşikleri `skatteetaten.no` ve `brreg.no` üzerinden teyit et.

## 1. Şirket tipi seçimi: ENK mi AS mi?

| | **Enkeltpersonforetak (ENK)** | **Aksjeselskap (AS)** |
|---|---|---|
| Türkçesi | Şahıs firması | Limited şirket |
| Kuruluş sermayesi | Yok | **30.000 NOK** (aksjekapital) |
| Kuruluş ücreti (Brønnøysund) | Ücretsiz (dijital) | ~5.000–6.000 NOK |
| Sorumluluk | **Sınırsız** — kişisel malvarlığın risk altında | **Sınırlı** — sadece şirket sermayesi |
| Vergilendirme | Kâr, kişisel gelire eklenir (kademeli, yüksek dilimlerde ağır) | Şirket vergisi %22 + temettü vergisi |
| Kendine maaş | Hayır (kâr = gelirin) | Evet (lønn, gider yazılır) |
| İşsizlik/hastalık hakları | Zayıf (dagpenger yok, sykepenger %80'den az) | Çalışan olarak tam hak |
| Muhasebe | Basit (bokføringsplikt var, regnskapsplikt genelde yok) | Tam muhasebe + yıllık hesap |
| Şirketi satmak/ortak almak | Zor | Kolay (hisse devri) |
| Yatırım almak | Neredeyse imkânsız | Mümkün |

### COBBAN için tavsiye

**Başlangıçta ENK, ciro 500.000–700.000 NOK'u geçince AS'ye geç.**

Gerekçe:
- Kuruluş sıfır maliyetli ve 1 günde tamamlanıyor → hızlı test.
- Online satışta ilk yıl ciro belirsiz; 30.000 NOK sermayeyi bağlamaya değmez.
- **Ancak:** stok riski yüksek bir ürün grubuna (ör. elektronik, gıda) veya
  büyük tedarikçi borcuna gireceksen **doğrudan AS kur** — sınırsız sorumluluk
  online ticarette gerçek bir risktir (iade, ürün sorumluluğu, tedarikçi davası).

> **Ara yol:** İlk 6 ay ENK ile test et, kâra geçtiğin ay AS kur ve ENK'yı kapat.
> ENK → AS dönüşümü vergisel olarak "skattefri omdanning" ile yapılabilir (mali müşavir gerekli).

## 2. ENK kurulum adımları (1 gün)

1. **BankID hazırla.** Norveç kimlik numaran (fødselsnummer veya D-nummer) ve BankID'n olmalı.
2. **Altinn'e gir** → `altinn.no` → *Samordnet registermelding* formu.
3. **Brønnøysundregistrene**'ye kayıt:
   - Foretaksnavn: `COBBAN <Soyadın>` — ⚠️ ENK adı **yasal olarak soyadını içermek zorundadır**
     (ör. `COBBAN ANDERSEN`). Markayı `COBBAN` olarak ayrıca kullanabilirsin.
   - Næringskode (NACE): online satış için genellikle **47.911 – Butikkhandel via internett**
     (çok kategorili perakende internet satışı). Kesin kodu Brønnøysund arama ekranından seç.
   - Adres, banka hesabı, tahmini ciro.
4. **Organisasjonsnummer** (9 haneli) gelir — genelde 1–5 iş günü.
5. **Foretaksregisteret'e kayıt** (ENK için zorunlu değil, ama mal alıp satıyorsan
   *varelager* olduğu için zorunlu olur — ~2.500 NOK). Online ürün satışında **evet, gerekir.**

## 3. AS kurulum adımları (1–2 hafta)

1. **Stiftelsesdokument + vedtekter** hazırla (Altinn şablon sunar).
2. **30.000 NOK sermayeyi** bir bankada bloke hesaba yatır → banka *bekreftelse* verir.
   (Alternatif: revisor onayı.)
3. Altinn üzerinden **Foretaksregisteret**'e kayıt → ~5.570 NOK ücret.
4. Organisasjonsnummer gelir → bloke hesap açılır, sermaye şirket hesabına geçer.
5. **Revisjonsplikt:** Ciro < 7 milyon NOK ve bilanço < 27 milyon NOK ve < 10 çalışan ise
   denetçiden feragat edebilirsin (*fravalg av revisjon*) — kuruluşta işaretle, yılda ~15.000 NOK tasarruf.

## 4. MVA (KDV) kaydı — en kritik adım

- **Eşik: son 12 ayda 50.000 NOK MVA'ya tabi ciro.** ✅ *Skatteetaten, Ağu 2026'da teyit edildi*
- **Takvim yılı değil, kayan 12 aylık dönem.** Mart–Şubat arası 50.000'i geçtiysen eşik aşılmıştır.
- **Net ciro** esas alınır — yani MVA hariç tutar.
- Her MVA mükellefi için **tek bir eşik** vardır (şirket başına, faaliyet başına değil).
- Eşiği aştığın **anda** (aşan faturayı kestiğin gün) `Merverdiavgiftsregisteret`'e kayıt olmalısın.
- Kayıt: Altinn → *Samordnet registermelding* → MVA bölümü.
- Kayıttan **önceki** satışlarda MVA tahsil edemezsin ve alışlarındaki MVA'yı da geri alamazsın
  (istisna: kayıt öncesi 3 yıl içindeki stok alımı için geriye dönük düzeltme mümkün — *tilbakegående avgiftsoppgjør*).

### MVA oranları

| Oran | Kapsam |
|---|---|
| **%25** | Genel oran — çoğu ürün (tekstil, kozmetik, ev, hediyelik, aksesuar) |
| %15 | Gıda maddeleri |
| %12 | Yolcu taşıma, konaklama, sinema |
| **%0** | **İhracat** (Norveç dışına satış) — "avgiftsfritt ved utførsel" |

> **Önemli:** Norveç AB üyesi değil. Norveç'ten AB'ye satış = ihracat (%0 MVA),
> ama alıcı kendi ülkesinde ithalat KDV'si öder. Bunu ürün sayfasında açıkça yaz.

### MVA beyanı
- Normalde **2 ayda bir** (6 dönem/yıl), son gün dönem bitiminden 1 ay 10 gün sonra.
- Ciro < 1 milyon NOK ise **yıllık beyan** başvurusu yapılabilir (nakit akışı için avantajlı).
- Beyan Altinn üzerinden, muhasebe yazılımından doğrudan gönderilir (Fiken, Tripletex, Conta).

## 5. Banka + ödeme altyapısı

| İhtiyaç | Öneri |
|---|---|
| İşletme hesabı | DNB, Sparebank 1, Nordea — org.nr geldikten sonra açılır |
| Dijital/uygun alternatif | Aritma, Cultura, Sbanken (org.nr ile) |
| Kart ödemesi | **Shopify Payments** (Norveç destekli) veya Stripe |
| Norveç'te olmazsa olmaz | **Vipps** — Norveç'te online ödemenin ~%70'i. Shopify uygulaması mevcut |
| Taksit/sonra öde | Klarna (Norveç'te çok yaygın), Walley |
| Muhasebe yazılımı | **Fiken** (~200 NOK/ay, ENK için ideal), Tripletex, Conta (ücretsiz başlangıç) |

## 6. Kargo (Norveç)

| Taşıyıcı | Not |
|---|---|
| **Posten / Bring** | Standart, tüm Norveç. Shopify entegrasyonu var |
| **PostNord** | Nordik ülkeler arası uygun |
| **Helthjem** | Ucuz, gece teslimat, büyük şehirler |
| **Porterbuddy** | Aynı gün, Oslo bölgesi |

Ücretsiz kargo eşiği koy (ör. 799 NOK üzeri) — Norveç'te sepet ortalamasını belirgin artırır.

## 7. Zorunlu kayıtlar ve yükümlülükler

- [ ] **Foretaksregisteret** kaydı (mal ticareti → zorunlu)
- [ ] **Merverdiavgiftsregisteret** (50.000 NOK eşiği aşınca)
- [ ] **Bokføringsplikt** — tüm fiş/fatura 5 yıl saklanır
- [ ] **Angrerettskjema** — tüketiciye standart cayma formu sunmak **yasal zorunluluk**
      (Angrerettloven; 14 gün cayma hakkı) → `sozlesmeler/NO-salgsbetingelser.md`
- [ ] **Personvernerklæring (GDPR)** — Norveç GDPR uygular (Datatilsynet)
- [ ] **Prisopplysningsforskriften** — fiyatlar MVA dahil gösterilmeli
- [ ] **Åpenhetsloven** — ciro > 70 milyon NOK ise tedarik zinciri şeffaflık raporu (başlangıçta gerekmez)

## 8. Tahmini kurulum maliyeti (NOK)

| Kalem | ENK | AS |
|---|---|---|
| Brønnøysund kayıt | 0 | 5.570 |
| Foretaksregisteret (mal ticareti) | 2.500 | dahil |
| Sermaye | 0 | 30.000 (şirkette kalır) |
| Muhasebe yazılımı (yıllık) | 2.400 | 6.000 |
| Mali müşavir (yıllık, kısmi) | 8.000 | 20.000 |
| Marka tescili (Patentstyret, 1 sınıf) | ~3.400 | ~3.400 |
| Domain (.com + .no) | ~500 | ~500 |
| **Toplam (sermaye hariç, 1. yıl)** | **~17.000** | **~36.000** |
