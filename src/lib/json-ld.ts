/**
 * Yapılandırılmış veriyi `<script>` etiketine gömmek için güvenli hale getirir.
 *
 * `JSON.stringify` çıktısı doğrudan gömülürse, veri içinde geçen bir `</script>`
 * dizisi etiketi kapatır ve kalanı HTML olarak yorumlanır. İçerik şu an
 * sözlüklerden geldiği için risk düşük; yine de bir metin eklerken kimsenin
 * bunu düşünmek zorunda kalmaması için kaçış burada yapılır.
 *
 * `<` ve `&` karakterlerinin Unicode kaçışları JSON'da geçerlidir ve
 * ayrıştırıldığında aynı değeri verir.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
