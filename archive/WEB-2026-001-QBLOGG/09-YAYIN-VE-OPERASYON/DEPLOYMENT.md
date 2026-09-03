# WEB-2026-001 — Deployment

## Mevcut deployment yapısı

**Platform:** Vercel
**Takım:** BET-ART (`team_xNtowH7U0jXQrI53DFJFzH2o`)
**Proje:** `qblogg`
**Üretim adresi:** https://qblogg.vercel.app

## Nasıl çalışır

Vercel'e yalnızca `vercel.json` gönderilir. `buildCommand` şunları yapar:

1. `andersenbetul-alt/BETA-ART` deposunun `main` dalını klonlar
2. 9 HTML sayfası + `404.html` + `sitemap.xml` + `robots.txt` + `assets/`i `dist/`e kopyalar

**Tek kaynak:** `vercel.json` — başka hiçbir derleme yapılandırması yoktur.

## Siteyi güncellemek

```
1. Değişiklikleri main dalına push et
2. Vercel panosunda aynı deployment'ı yeniden tetikle
```

**NOT:** GitHub entegrasyonu `andersenbetul-alt` hesabına yetkili değil (entegrasyon `betulandersen-droid`a bağlı) → otomatik deploy yok, manuel tetikleme gerekiyor.

## Otomatik deploya geçiş

Vercel panosunda GitHub entegrasyonunu `andersenbetul-alt` hesabına yetkilendirin → her `main` push'u otomatik deploy başlatır.

## Alan adı bağlantısı (bekliyor)

**Hedef:** https://qblogg.com
**Adımlar:**
1. Vercel paneli → qblogg projesi → Domains → "qblogg.com" ekle
2. Vercel'in verdiği `_vercel` TXT kaydını GoDaddy DNS'e ekle
3. Vercel → "Verify & Claim" — DNS yayılması 24–48 saat sürebilir
4. **Dikkat:** E-posta MX kayıtları GoDaddy'de kalmalı — ad sunucularını taşıma

## Rollback

Vercel panosu → Deployments → İstediğiniz önceki deployment → "Promote to Production"

## Yedekleme

Git deposu (`andersenbetul-alt/BETA-ART`) hem kod hem içerik için tek yedek. Ayrıca fiziksel yedek alınmamış.
