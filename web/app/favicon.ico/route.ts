/* /favicon.ico — gorseller koda cevrilirken app/favicon.ico silindi ve bu yol
 * karsiliksiz kaldi (404). Tarayicilar <link rel="icon"> kullandigi icin sekme
 * ikonu bozulmadi, ama kok yolu isteyen her istemci — RSS okuyucular, link
 * onizlemeleri, eski tarayicilar — bos donuyordu.
 *
 * Ikili dosya geri koymuyoruz: ikon artik app/icon.tsx'te derleme aninda
 * uretiliyor ve tek kaynak orasi kalmali. Kalici yonlendirme yeterli. */
export function GET(request: Request) {
  return Response.redirect(new URL('/icon', request.url), 308);
}
