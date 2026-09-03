# WEB-2026-001 QBLOGG — Dağıtım Kılavuzu

**Son güncelleme:** 2026-09-03

---

## Mimari

Site statik dosyalardan oluşur (HTML + CSS + JS + varlıklar). Derleme adımı yok.

**Hosting:** Vercel  
**Proje:** `qblogg`  
**Takım:** BET-ART (`team_xNtowH7U0jXQrI53DFJFzH2o`)  
**Üretim URL:** https://qblogg.vercel.app  

---

## BuildCommand Deseni

Vercel'e yalnızca `vercel.json` deploy edilir. `buildCommand` public `main` dalını klonlar ve dosyaları `dist/`e kopyalar.

**Neden bu desen?**  
`andersenbetul-alt` GitHub hesabı Vercel'in GitHub entegrasyonunda yetkili değil (entegrasyon `betulandersen-droid`a bağlı). Bu desen yetkisizlik sorununu aşar; push başına otomatik deploy kurulamıyor.

```json
{
  "buildCommand": "git clone --depth 1 https://github.com/andersenbetul-alt/BETA-ART.git repo && mkdir -p dist && cp repo/index.html repo/work.html repo/blog.html repo/post.html repo/gizlilik.html repo/kosullar.html repo/404.html repo/sitemap.xml repo/robots.txt dist/ && cp -r repo/assets dist/"
}
```

---

## Güncelleme Yolu

**Siteyi güncellemek = main'e push + aynı dağıtımı yeniden tetiklemek.**

### Adım adım:

1. Değişiklikleri `main` dalına push et:
   ```bash
   git push -u origin main
   ```

2. Vercel panelinden dağıtımı yeniden tetikle:  
   → https://vercel.com/bet-art/qblogg → **Deployments** → En son dağıtım → **Redeploy**

   Veya Vercel MCP ile:
   ```
   mcp__Vercel__list_deployments → en son deployment_id
   mcp__Vercel__get_deployment → durum kontrol
   ```

**Beklenen süre:** 1–2 dakika  
**Başarı göstergesi:** Vercel panelinde "Ready" durumu

---

## `npm run check` — Commit Öncesi Zorunlu

```bash
npm run check
```

Kırmızı çıkarsa commit etme. Kontroller:
- 10 dil × anahtar bütünlüğü
- Yazı varlıkları (slug, başlık, özet, gövde × 10 dil)
- Çiftlenen id/script
- Yerel bağlantı/varlık
- Sitemap uyumu

---

## CSP (Content Security Policy)

`vercel.json`'da tanımlı. **Yeni harici servis bağlarken `connect-src`'ye eklemek zorunlu** — yoksa istek sessizce engellenir.

Mevcut `connect-src`'de: `https://buttondown.com`

---

## Ortam Değişkenleri

Yok. Tüm ayarlar `assets/js/config.js`'te (istemci taraflı, public).

---

## Önemli Uyarı: qblogg.com Alan Adı

Alan adı henüz Vercel'e tam bağlı değil:
- GoDaddy DNS doğru yönlendirilmiş
- Vercel panelinde TXT sahiplik doğrulaması (`_vercel` kaydı) + **Verify & Claim** bekleniyor
- MX kayıtları GoDaddy'de kalmalı (e-posta etkilenmemeli)

---

## GitHub Entegrasyonu

Şu an manuel. Otomatik deploy için:
1. `andersenbetul-alt` hesabına Vercel GitHub App yetkisi ver  
   → Vercel panel → Settings → Git → GitHub bağlantısı
2. `vercel link` komutu ile projeyi Git deposuna bağla
3. Bundan sonra her `main` push otomatik deploy tetikler
