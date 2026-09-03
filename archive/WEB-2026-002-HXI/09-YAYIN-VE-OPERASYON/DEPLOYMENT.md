# WEB-2026-002 HXI — Deployment

## Hedef deployment yapısı

**Platform:** Vercel  
**Takım:** BET-ART (`team_xNtowH7U0jXQrI53DFJFzH2o`)  
**Hedef proje:** `hxi-official`  
**Hedef adres:** https://hxi.no  

---

## Mevcut durum: Engellenmiş

**Engel:** Vercel GitHub entegrasyonu `andersenbetul-alt` hesabına yetkili değil.  
Entegrasyon `betulandersen-droid` hesabına bağlı.

**Sonuç:** `create_git_project` → `400 repo_no_access`

---

## Deploy için gerekli adımlar (kullanıcı tarafı)

### 1. Vercel GitHub entegrasyonunu yetkilendir

1. [vercel.com](https://vercel.com) → hesabınıza giriş yapın
2. Sağ üst → Hesap ayarları
3. **Integrations** → GitHub → **Manage Access**
4. `andersenbetul-alt` organizasyonu için `BETA-ART` reposuna erişim verin
5. "Save" veya "Update Access"

### 2. HXI projesini oluştur

Yetki verildikten sonra Vercel MCP veya panel üzerinden:

```
Proje adı: hxi-official
Kaynak: andersenbetul-alt/BETA-ART (Root Directory: hxi/)
Build: yok (statik)
```

### 3. Alan adı bağla (hxi.no)

1. Vercel panel → `hxi-official` → **Domains** → "hxi.no" ekle
2. Vercel'in verdiği DNS kayıtlarını (A + CNAME) GoDaddy'e ekle
3. Vercel → "Verify" — DNS yayılması 24–48 saat

---

## Siteyi güncellemek (deploy sonrası)

```
1. Değişiklikleri claude/hxi-dosyalari-nuf9y8 dalına push et
2. PR #17'yi main'e merge et
3. Vercel otomatik deploy başlatır (entegrasyon yetkiliyse)
```

---

## PR #17 durumu

| Alan | Değer |
|---|---|
| Dal | `claude/hxi-dosyalari-nuf9y8` → `main` |
| İçerik | HXI site dosyalarının tamamı |
| Engel | Vercel GitHub auth (deploy öncesi merge gerekli değil) |

---

## Rollback

Vercel panosu → Deployments → İstediğiniz önceki deployment → "Promote to Production"

---

## Yedekleme

Git deposu (`andersenbetul-alt/BETA-ART`) kod için tek yedek. Ayrıca fiziksel yedek alınmamış.
