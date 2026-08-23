'use client';

import { useState } from 'react';
import type { Message } from '@/lib/messages.ts';
import { telHref } from '@/lib/messages.ts';

/**
 * "Şimdi hallet" bloğu.
 *
 * Bilgi vermekten iş yapmaya geçtiğimiz yer. Mesaj hazır, dil doğru,
 * saat doğru — kullanıcı sadece kopyalayıp gönderiyor. Numara varsa
 * tek dokunuşla arıyor.
 */
export default function FixItNow({
  what, message, language, phone,
}: {
  what: string;
  message: Message;
  /** Mesajın yazıldığı dil — ekran okuyucu doğru telaffuz etsin diye. */
  language: string;
  phone?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.local);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Pano izni yoksa metin zaten ekranda — kullanıcı elle seçebilir.
      setShowEnglish(true);
    }
  }

  return (
    <div className="fix">
      <p className="fix-head"><strong>{what}</strong></p>

      <p className="fix-msg" lang={language}>{message.local}</p>

      <div className="fix-actions">
        <button className={`btn-primary${copied ? ' is-done' : ''}`}
                onClick={copy} aria-live="polite">
          {copied ? '✓ Copied' : message.action}
        </button>
        {phone && (
          <a className="btn-secondary" href={telHref(phone)}>Call</a>
        )}
        <button
          className="btn-plain"
          onClick={() => setShowEnglish((v) => !v)}
          aria-expanded={showEnglish}
        >
          {showEnglish ? 'Hide English' : 'What does it say?'}
        </button>
      </div>

      {showEnglish && <p className="fix-en muted small">{message.english}</p>}
    </div>
  );
}
