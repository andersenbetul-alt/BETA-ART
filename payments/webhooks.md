# Webhook İşleme Kuralları

Erişim **yalnızca** webhook ile açılır. Kullanıcının "başarılı" sayfasına
düşmesi ödemenin alındığını göstermez — o URL elle de yazılabilir.

## Zorunlu beş kural

### 1. İmza doğrula, sonra oku
Gövdeyi **ham hâliyle** doğrula (JSON parse etmeden önce). Stripe
`Stripe-Signature`, Vipps kendi imza başlığını kullanır. İmza geçersizse
`400` dön ve **hiçbir şey yapma** — loglama dışında.

### 2. Idempotent ol
`webhook_events(provider, provider_event_id)` UNIQUE. Aynı olay iki kez
gelirse ikinci INSERT çarpar ve işlem atlanır. Sağlayıcılar başarılı
yanıt alamazsa **aynı olayı tekrar gönderir** — bu normaldir, hata değil.

### 3. Sırasızlığa hazır ol
`subscription.updated`, `checkout.completed`'dan **önce** gelebilir.
Bu yüzden:
- Olayın kendi zaman damgasını sakla; daha eski bir olay daha yeni durumu ezmesin.
- Bilinmeyen müşteri/abonelik gelirse **hata verme** — sağlayıcıdan durumu
  çekip (fetch) eksik kaydı oluştur.

### 4. Hızlı 2xx dön, işi kuyruğa al
Webhook uç noktası olayı kaydeder ve `200` döner. Asıl işleme (hak açma,
credit yükleme, e-posta) ayrı bir işçide yapılır. Uzun süren uç nokta
sağlayıcı tarafında zaman aşımına düşer ve gereksiz tekrar gönderim yaratır.

### 5. Mutabakat işi kur — webhook kaybolur
Günde bir kez sağlayıcıdaki ödemeleri çek ve yereldekiyle karşılaştır.
Eksik olanı tamamla, fazla olanı işaretle. Bu iş olmadan **sessiz veri kaybı**
yaşarsın: müşteri ödemiştir, erişimi açılmamıştır ve kimse fark etmez.

## Olay → eylem eşlemesi

| Olay | Eylem |
|---|---|
| `checkout.session.completed` | `payments` kaydı + `entitlements` aç (+ credit_pack ise `credit_ledger` +delta) |
| `invoice.paid` (abonelik) | Dönemi ilerlet, aylık credit hakkını yükle, `invoices` kaydı |
| `invoice.payment_failed` | `past_due` yap — **erişimi hemen kapatma**, deneme süresi tanı |
| `customer.subscription.updated` | Plan/dönem güncelle, hak süresini uzat/kısalt |
| `customer.subscription.deleted` | Dönem sonunda hakkı `expired` yap |
| `charge.refunded` | `refunded_minor` güncelle, ilgili `entitlements` → `revoked`, kullanılmamış credits geri al |
| `charge.dispute.created` | Erişimi askıya al, uyarı gönder, kanıt topla |

## Erişim açma kararı — tek yer

Haklar tek bir fonksiyondan açılır: `grantEntitlement(customer, product, source)`.
Kod içinde başka hiçbir yerde "premium = true" yazılmaz. İade ve itiraz
akışları da tek bir `revokeEntitlementsBySource(source_type, source_id)`
çağrısı kullanır.

## Test edilecek senaryolar

- [ ] Aynı olay iki kez gönderilir → tek kayıt, tek hak, tek credit yüklemesi
- [ ] `subscription.updated` önce, `checkout.completed` sonra gelir
- [ ] Ödeme başarılı, webhook hiç gelmez → mutabakat işi yakalar
- [ ] Kısmi iade → hak korunur, credits orantılı geri alınır
- [ ] Chargeback → erişim askıya alınır
- [ ] Abonelik iptal, dönem sonuna kadar erişim devam eder
- [ ] Credits eşzamanlı iki istekle harcanır → bakiye eksiye düşmez
