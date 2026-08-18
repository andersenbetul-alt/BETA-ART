#!/usr/bin/env node
/* Curiosity Engine — seçilen konu için araştırma → makale zinciri.
 *
 *   node engine/write.mjs <slug>            kuyruktaki konuyu işler
 *   node engine/write.mjs --next            en yüksek puanlı kuyruk konusunu işler
 *   node engine/write.mjs --next --dry      yalnızca ne yapacağını yazdırır (API çağrısı yok)
 *
 * Gereken: ANTHROPIC_API_KEY. Çıktı: engine/output/<slug>/ altına
 *   research.json · article.md · seo.json · money.json · quality.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as db from './db.mjs';
import { checkVisibility, printReport } from './visibility.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const slugArg = args.find((a) => !a.startsWith('--'));

const OFFERINGS = `- İçerik stüdyosu paketleri: Tek Makale €150, Büyüme €900/ay, Stüdyo €2.500/ay
- AI Workforce: AI Receptionist (€3.500 + €900/ay), AI Sales Assistant, AI Office Assistant
- Ücretli otomasyon keşfi: €900
- Bülten (ücretsiz) — e-posta listesi bizim varlığımız`;

const BRAND_VOICE = `Marka sesi: doğrudan, rakamla konuşan, abartısız. Belirsizliği saklamaz;
"bu veri doğrulanmadı" demeyi tercih eder. Okuyucuya "sen" diye hitap eder.`;

async function main() {
  const conn = db.open();
  const row = slugArg
    ? conn.prepare(`SELECT a.*, t.title AS topic_title, t.pillar FROM articles a
                    JOIN topics t ON t.id = a.topic_id WHERE a.slug = ?`).get(slugArg)
    : conn.prepare(`SELECT a.*, t.title AS topic_title, t.pillar FROM articles a
                    JOIN topics t ON t.id = a.topic_id
                    WHERE a.status = 'queued' ORDER BY a.created_at DESC LIMIT 1`).get();

  if (!row) {
    console.error('Kuyrukta konu yok. Önce: node engine/run.mjs --demo');
    process.exit(1);
  }

  const signals = conn.prepare(`SELECT s.title FROM signals s
    JOIN topic_signals ts ON ts.signal_id = s.id WHERE ts.topic_id = ?`).all(row.topic_id).map((r) => r.title);

  console.log(`Konu:   ${row.topic_title}`);
  console.log(`Sütun:  ${row.pillar} · tip: ${row.speed} · hedef: ${row.word_target} kelime`);
  console.log(`Sinyal: ${signals.length}\n`);

  if (has('--dry')) {
    console.log('KURU ÇALIŞTIRMA — API çağrısı yapılmadı. Sıra şu olurdu:');
    console.log('  1. questionAgent  → soruları çıkar ve kümele');
    console.log('  2. researchAgent  → web araması, kaynaklı paket');
    console.log('  3. writerAgent    → şablona göre makale');
    console.log('  4. seoAgent       → başlık, meta, iç bağlantı, SSS');
    console.log('  5. moneyAgent     → gelir yolu ve yerleşim');
    console.log('  6. qualityGate + checkVisibility → yayın kapısı (insan onayı hâlâ zorunlu)');
    return;
  }

  const agents = await import('./agents.mjs');
  const outDir = join(HERE, 'output', row.slug);
  mkdirSync(outDir, { recursive: true });
  const save = (name, data) => {
    const body = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    writeFileSync(join(outDir, name), body, 'utf8');
    console.log('  ✓', join('engine/output', row.slug, name));
  };

  console.log('1/6 sorular çıkarılıyor…');
  const questions = await agents.questionAgent(row.topic_title, signals);
  save('questions.json', questions);

  console.log('2/6 araştırma yapılıyor (web araması)…');
  const flatQuestions = questions.clusters.flatMap((c) => c.questions).slice(0, 12);
  const research = await agents.researchAgent(questions.canonicalTitle, flatQuestions);
  save('research.json', research);
  conn.prepare("UPDATE articles SET status = 'researching', research_path = ? WHERE id = ?")
      .run(join('engine/output', row.slug, 'research.json'), row.id);

  console.log('3/6 makale yazılıyor…');
  const article = await agents.writerAgent(questions.canonicalTitle, research,
    { wordTarget: row.word_target || 2000, lang: 'tr', brandVoice: BRAND_VOICE });
  save('article.md', article);

  console.log('4/6 SEO…');
  const existing = conn.prepare('SELECT slug FROM articles WHERE status = ?').all('published').map((r) => r.slug);
  const seo = await agents.seoAgent(article, existing);
  save('seo.json', seo);

  console.log('5/6 gelir yolu…');
  save('money.json', await agents.moneyAgent(article, OFFERINGS));

  console.log('6/6 kalite kapısı…');
  const quality = await agents.qualityGate(article, research);
  save('quality.json', quality);

  /* Görünürlük kuralları: model yorumu değil, ölçülebilir denetim. */
  const publishedTitles = conn.prepare('SELECT title FROM articles WHERE status IN (?, ?)')
    .all('published', 'review').map((r) => r.title).filter(Boolean);
  const visibility = checkVisibility({
    title: seo.baslik || questions.canonicalTitle,
    metaDescription: seo.meta,
    slug: row.slug,
    markdown: article,
    clusterLinks: seo.icBaglantilar || [],
    images: seo.gorseller || [],
    sources: research.kaynaklar || research.sources || [],
    originalValue: research.ozgunKatki,
    schema: seo.schema,
    author: process.env.QB_AUTHOR || 'QBLOGG',
    updatedAt: new Date().toISOString().slice(0, 10)
  }, { publishedTitles });
  save('visibility.json', visibility);

  conn.prepare("UPDATE articles SET status = 'review', draft_path = ? WHERE id = ?")
      .run(join('engine/output', row.slug, 'article.md'), row.id);

  console.log(`\nKalite kararı: ${quality.karar}`);
  if (quality.sorunlar?.length) quality.sorunlar.forEach((s) => console.log('  ! ' + s));
  console.log('\nGörünürlük raporu:');
  printReport(visibility);

  if (visibility.decision === 'yayinlanamaz') {
    console.log('\nDurum: review — görünürlük kuralları kaldı, düzeltilmeden yayınlanamaz.');
  } else {
    console.log('\nDurum: review — yayın için insan onayı gerekiyor.');
  }
}

main().catch((e) => { console.error('\nHata:', e.message); process.exit(1); });
