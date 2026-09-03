# WEB-2026-004 — Güncel Durum Raporu

**Rapor tarihi:** 2026-09-03  
**Hazırlayan:** AUTOPROMPT arşivleme sistemi

---

## 1. Proje kimliği
**WEB-2026-004 — NAVIAR Care**

## 2. Projenin amacı
Norveçli yaşlı bireyler ve yakınları (pårørende) için NAV ve belediye sistemlerinde dijital navigasyon yardımı. Üç pilot: NAV başvuruları, bakım hizmetleri, dijital yardım.

## 3. Mevcut durum
**Beklemede** — Kod başka hesapta (`betulandersen-droid/naviar-care-1`), erişim belirsiz.

## 4. Tespit edilen son sürüm
Bilgi bulunamadı — kaynak koda erişim yok.  
Vercel'de iki sürüm var: production (eski) ve preview (daha yeni, tanıtılmadı).

## 5. Teknik mimari
Next.js. v0 (Vercel AI UI builder) ile oluşturuldu. Türkçe UI.

## 6. Teknik borçlar

| Borç | Seviye |
|---|---|
| Kaynak kodu başka hesapta, erişim belirsiz | **Yüksek** |
| Preview → Production tanıtımı yapılmadı | **Orta** |
| Monorepo entegrasyonu yapılmadı | **Orta** |

## 7. Alınması gereken kararlar
1. `betulandersen-droid/naviar-care-1` → `andersenbetul-alt` erişimi ne zaman verilecek?
2. NAVIAR Care'in kapsamı: mevcut pilot projelere devam mı, yoksa NAVIAR marka sistemi altında genişleme mi?

## 8. Sonraki adım
Repo transferi/erişimi çözülmeden başka adım alınamaz. Erişim çözüldüğünde arşivleme güncellenecek.
