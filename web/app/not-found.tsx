import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="no">
      <body>
        <main className="wrap" style={{ padding: '6rem 1.25rem' }}>
          <h1>404</h1>
          <p className="muted">Siden finnes ikke · Page not found · Sayfa bulunamadı</p>
          <p><Link href="/no" className="btn">COBBAN</Link></p>
        </main>
      </body>
    </html>
  );
}
