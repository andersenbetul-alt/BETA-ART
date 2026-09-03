# BETA-ART — Ana Proje Kataloğu

**Son güncelleme:** 2026-09-03  
**Sorumlu:** Betul Andersen (andersen.betul@gmail.com)  
**Depo:** https://github.com/andersenbetul-alt/BETA-ART  
**Detay klasörü:** `proje-kartlari/`

---

## Proje Tablosu

| Proje No | Proje Adı | Amaç | Durum | Güncel Sürüm | Son Güncelleme | Canlı Adres | Kod Deposu | Öncelik | Sonraki Adım |
|---|---|---|---|---|---|---|---|---|---|
| WEB-2026-001 | QBLOGG | İçerik stüdyosu tanıtım + blog | **Yayında** | 1.7.0 (tahmini) | 2026-09-03 | qblogg.vercel.app | andersenbetul-alt/BETA-ART (kök) | 🔴 Yüksek | Stripe payLinks ekle |
| WEB-2026-002 | NAVIAR CARE | Norveç yaşlı bakım platformu | **Beklemede** | Bilinmiyor | 2026-08-31 | naviar-care-1-psi.vercel.app | betulandersen-droid/naviar-care-1 | 🔴 Yüksek | Repo transferi |
| WEB-2026-003 | Beta Art | Fotoğraf arşivi + lisans | **Geliştirme** | 0.1.0 (tahmini) | 2026-08-30 | Belirsiz (beta-art.com?) | andersenbetul-alt/beta-art-archive | 🟡 Orta | Gerçek fotoğraflar |
| WEB-2026-004 | Eve Slack Ajanı | naviar-consult / hxi-music botu | **Yayında** | Bilinmiyor | 2026-08-30 | — | betulandersen-droid/eve-slack-agent | 🟡 Orta | NAVIAR kimlik güncelleme |
| WEB-2026-005 | Eve Chat Şablonu | Sohbet arayüzü şablonu | **Beklemede** | Bilinmiyor | 2026-08-30 | — | andersenbetul-alt/eve-chat-template | 🟢 Düşük | Kullanım kararı |
| WEB-2026-006 | QBLOGG Üye / Q Brief Pro | Üye portalı + özet üretici | **Geliştirme** | 0.1.0 | 2026-08-24 | — (Supabase bağlı değil) | BETA-ART/uye/ | 🟡 Orta | Supabase yapılandır |
| WEB-2026-007 | Curiosity Engine | İçerik üretim hattı | **Geliştirme** | 0.5.0 (tahmini) | 2026-09-02 | — (yerel) | BETA-ART/engine/ | 🟡 Orta | Gerçek ağ ortamı |
| WEB-2026-008 | CV Action Page Demo | NAVIAR satış demosu | **Test** | 1.0.0 | 2026-08-25 | qblogg.vercel.app/demo/ | BETA-ART/demo/ | 🟢 Düşük | Gerçek data |

---

## Listeler

### ✅ Yayındaki Projeler
- **WEB-2026-001** QBLOGG → qblogg.vercel.app
- **WEB-2026-002** NAVIAR CARE → naviar-care-1-psi.vercel.app (preview; production eski sürümde)
- **WEB-2026-004** Eve Slack Ajanı → naviar-consult (Vercel)

### 🔄 Aktif Geliştirme
- **WEB-2026-001** QBLOGG (sürekli aktif)
- **WEB-2026-006** Q Brief Pro (Supabase entegrasyonu bekliyor)
- **WEB-2026-007** Curiosity Engine (ağ ortamı bekliyor)

### ⏳ Bekleyen Projeler
- **WEB-2026-002** NAVIAR CARE (repo transferi bekliyor)
- **WEB-2026-005** Eve Chat Şablonu (kullanım kararı bekliyor)

### 🗄️ Arşivlenen Projeler
- Yok (henüz)

### ⚠️ Eksik Dokümantasyonu Olan Projeler
- WEB-2026-002: kaynak koda erişim yok (farklı GitHub hesabı)
- WEB-2026-003: canlı adres doğrulanamadı
- WEB-2026-004: Vercel deploy URL'leri bilinmiyor
- WEB-2026-005: kullanım durumu belirsiz
- WEB-2026-008: "hxi-music" projesi tanımsız

### 🔴 Teknik Risk Taşıyan Projeler
- **WEB-2026-002**: Kaynak kodu erişilemez — rep transfer yapılmadan yedek alınamaz
- **WEB-2026-001**: Git tag yok — sürüm geri alımı güç
- **WEB-2026-006**: Supabase boş — yanlışlıkla push'lanırsa verisiz canlıya çıkar

### 🔗 Birbiriyle Bağlantılı Projeler
- WEB-2026-001 ↔ WEB-2026-006: QBLOGG ana site + üye portalı (aynı marka)
- WEB-2026-001 ↔ WEB-2026-007: site içerik + üretim hattı (aynı posts.js formatı)
- WEB-2026-002 ↔ WEB-2026-004: NAVIAR platform + naviar-consult botu
- WEB-2026-002 ↔ WEB-2026-008: NAVIAR + Action Pages demosu

### ♻️ Ortak Kod Kullanan Projeler
- WEB-2026-001 + WEB-2026-006: i18n yaklaşımı, CSS değişken sistemi
- WEB-2026-001 + WEB-2026-002: behavior.js sistemi (NAVIAR TS uyarlaması belgeli)
- WEB-2026-004 + WEB-2026-005: Vercel eve platformu, pnpm, shadcn/ui

### 🚨 Acil İşlem Gereken Projeler
1. **WEB-2026-001** → `config.js → payLinks` boş: Stripe gelir kapısı kapalı
2. **WEB-2026-002** → Repo transferi: yedek alınamıyor, CI entegrasyonu kurulamıyor
3. **WEB-2026-001** → Git tag: `v1.0.0` olarak `main`'in şu anki HEAD'ini etiketle

---

## Sürüm Etiket Standardı

```
qblogg-v1.7.0   → WEB-2026-001 mevcut canlı sürüm (tahmini; kullanıcı doğrulaması gerekli)
naviar-v0.x.x   → WEB-2026-002 (transfer sonrası belirlenecek)
```

> **Not:** Bu katalog 2026-09-03 tarihinde oluşturulmuştur. Her proje güncellendiğinde
> ilgili `proje-kartlari/WEB-YYYY-NNN/00-PROJE-KARTI/PROJE-KARTI.md` dosyası önce
> güncellenir; bu katalog ikinci sırada güncellenir.
