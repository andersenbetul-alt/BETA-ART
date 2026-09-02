// Markalı 404 — statik dışa aktarımda out/404.html olarak üretilir.
// Tek dilli tutulur (sayfa dili henüz bilinmez); dil bağlantıları kapıya götürür.
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{
        margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        background: '#080808', color: '#f1f0eb',
        fontFamily: "'Courier New', ui-monospace, monospace",
      }}>
        <h1 style={{
          margin: 0, fontFamily: "Impact, 'Arial Narrow Bold', sans-serif",
          fontSize: 120, letterSpacing: '-.02em', lineHeight: 1,
        }}>
          4<span style={{ color: '#c8ff00' }}>0</span>4
        </h1>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#b1b3ad' }}>
          Signal lost / Sayfa bulunamadı
        </p>
        <a href="/" style={{
          color: '#c8ff00', textDecoration: 'none', fontSize: 13,
          letterSpacing: '.1em', textTransform: 'uppercase',
          borderBottom: '1px solid #c8ff00', paddingBottom: 2,
        }}>
          HXI → home
        </a>
      </body>
    </html>
  );
}
