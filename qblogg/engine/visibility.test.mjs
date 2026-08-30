import assert from 'node:assert';
import { checkVisibility, sameIntent, printReport } from './visibility.mjs';

// Zayıf taslak: kısa, kaynaksız, özgün katkısız
const weak = checkVisibility({
  title: 'AI', markdown: '# AI\n\nAI iyidir. Herkes kullanmalı.', slug: 'ai'
});
assert.strictEqual(weak.decision, 'yayinlanamaz', 'zayıf taslak geçmemeli');
assert.ok(weak.failed >= 4, 'birden çok kural düşmeli');

// Güçlü taslak
const strongBody = `# 2026'da AI ajanları küçük işletmede ne yapabiliyor?

Kısa cevap: bir AI ajanı bugün gelen e-postayı sınıflandırabiliyor, taslak yanıt hazırlayabiliyor ve toplantı kurabiliyor. Müşteriyle bağlayıcı konuşma yapmak, ödeme onaylamak veya sözleşme yorumlamak hâlâ insanda kalmalı. Kurulum iki hafta sürüyor ve geri ödeme süresi genellikle beş ay civarında.

## Önemli çıkarımlar

- Ajanın yapabildiği iş, yapamadığından daha dar.
- Geri ödeme altı ayı geçiyorsa kurmayın.
- Kendi testimizde e-posta sınıflandırma isabeti yüzde 89 çıktı.

## Karşılaştırma

| Araç | Kimin için | Aylık |
|---|---|---|
| A | tek kişilik ofis | 490 kr |
| B | 10 kişilik ekip | 1.900 kr |

Detaylar için [AI ajanı nedir](/post.html?slug=ai-ajani-nedir), [fiyatlandırma](/post.html?slug=ai-ajan-fiyat) ve [kurulum rehberi](/post.html?slug=ai-ajan-kurulum) yazılarına bakın.

Kaynaklar: https://a.example https://b.example https://c.example

![Ajan mimarisi şeması](/assets/img/ajan.png)
` + '\nDolgu paragrafı. '.repeat(400);

const strong = checkVisibility({
  title: 'AI ajanları küçük işletmede ne yapabiliyor?',
  metaDescription: 'AI ajanlarının küçük işletmede yapabildikleri ve yapamadıkları, kurulum süresi ve geri ödeme hesabıyla.',
  slug: 'ai-ajanlari-kucuk-isletme', markdown: strongBody,
  author: 'QBLOGG', updatedAt: '2026-08-18', originalValue: 'kendi isabet testimiz'
}, { publishedTitles: ['Substack abonelik matematiği'] });

assert.strictEqual(strong.failed, 0, 'güçlü taslak hiçbir kuralda düşmemeli: '
  + strong.rules.filter(r => r.status === 'kaldi').map(r => r.id + ' ' + r.msg).join(' | '));
assert.strictEqual(strong.decision, 'yayinlanabilir');

// Ölçekli içerik koruması: aynı niyetli ikinci yazı reddedilmeli
const dupe = checkVisibility({ ...{
  title: 'AI ajanları küçük işletmede ne yapabiliyor?',
  metaDescription: 'x'.repeat(120), slug: 'kopya', markdown: strongBody,
  author: 'QBLOGG', updatedAt: '2026-08-18', originalValue: 'test'
}}, { publishedTitles: ['AI ajanları küçük işletmede neler yapabiliyor?'] });
assert.ok(dupe.rules.find(r => r.id === '4-tekrar').status === 'kaldi', 'aynı niyetli tekrar yakalanmalı');

assert.ok(sameIntent('Best AI agents for small business', 'Best AI agents for small businesses'));
assert.ok(!sameIntent('Best AI agents for small business', 'Jobs AI will replace by 2030'));

console.log('görünürlük testleri geçti\n');
console.log('Güçlü taslak raporu:');
printReport(strong);
