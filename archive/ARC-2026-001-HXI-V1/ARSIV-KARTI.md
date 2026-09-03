# ARC-2026-001 — HXI v1 (hxi-website)

## Arşiv bilgisi

- **Arşiv numarası:** ARC-2026-001
- **Orijinal dizin:** `hxi-website/`
- **Arşivlenme tarihi:** 2026-09-03
- **Arşivleyen:** Betül Andersen (onay) + Claude Code
- **Arşivlenme nedeni:** `hxi/` dizini aktif geliştirme sürümü olarak belirlendi;
  `hxi-website/` içe aktarılmış (import) eski sürümdür.

## Kanıtlar

- Git commit `743de70`: `"hxi-website: import site from hxi-final, remove sapi-client.js"`
  — bu klasör "import" olarak getirildi, aktif geliştirme sürümü değil
- `hxi/` dizini sonraki commit'lerle geliştirildi (`e5bb6db`, `6d7415c`, `b8dc572` vb.)
- `README.md` içindeki TODO notları bu sürümün tamamlanmadığını gösteriyor
  (CDN logo referansları, self-hosted'a geçiş yapılmamış)
- `vercel.json` minimal — `hxi/` sürümü daha eksiksiz güvenlik başlıkları içeriyor

## Aktif sürüm

Bkz. `hxi/` dizini — proje numarası **WEB-2026-002 HXI**.

## Geri yükleme

Bu sürümün bir dosyasına ihtiyaç duyulursa:
```bash
git show HEAD~1:hxi-website/<dosyaadi>
# veya bu arşiv klasöründen doğrudan kopyala
```

## Fark notu

`hxi-website/` ile `hxi/` arasındaki yapısal farklar:

| Özellik | Bu arşiv (v1) | Aktif sürüm (hxi/) |
|---|---|---|
| CSS | `style.css` (kök) | `assets/css/main.css` |
| Logo | CDN referansları (TODO) | `assets/` klasörü |
| `use.html` | Yok | Var |
| `contact.html` | Yok | Var |
| `booking.html` | Var | Yok |
| `creator-use.html` | Var | `use.html` adıyla |
| CSP | Minimal | Tam (frame-ancestors vb.) |
