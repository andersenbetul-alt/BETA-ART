import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { helpTopic, helpTopics } from '@/lib/help-topics.ts';

export function generateStaticParams() {
  return helpTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const t = helpTopic(topic);
  if (!t) return {};
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/help/${t.slug}` },
  };
}

export default async function HelpPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = helpTopic(topic);
  if (!t) notFound();

  return (
    <article className="help">
      <h1>{t.title}</h1>

      {/*
        Önce cevap, sonra ürün. Ziyaretçi buraya sorusuyla geldi; ilk gördüğü
        şey ürün tanıtımı olursa geri tuşuna basar. Devam etme hakkı, işe
        yarar bir şey söyleyerek kazanılır.
      */}
      {t.answer.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}

      <Link href={t.cta.href} className="cta">{t.cta.label} →</Link>

      <h2>What to do, in order</h2>
      <ol className="steps">
        {t.steps.map((s) => (
          <li key={s.step}>
            <strong>{s.step}</strong>
            <span className="muted"> — {s.detail}</span>
          </li>
        ))}
      </ol>

      {/* İtirazlar erken kesilir: ücret, hesap, veri. */}
      <div className="faq">
        <p><strong>Is COBBAN free?</strong> Yes. No account, no payment, no ads.</p>
        <p><strong>Do you track me?</strong> No. Your location, if you share it, stays in your browser.</p>
        <p><strong>How much does it cover?</strong> Thirteen European countries for local rules,
          emergency numbers and places worth walking to. Live departures — every mode, ferries
          included — are Norway only so far.</p>
      </div>

      <Link href="/" className="cta secondary">Something else went wrong →</Link>
    </article>
  );
}
