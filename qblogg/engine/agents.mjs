/* Curiosity Engine — AI ajanları.
 *
 * Kural: yazı doğrudan modelin hafızasından çıkmaz. Önce Research Agent
 * kaynak toplar (Claude'un web arama aracıyla), sonra Writer Agent yalnızca
 * o kaynak paketini kullanarak yazar. Bu, Google'ın "kullanıcıya ek değer
 * sağlamayan seri içerik" tanımına düşmemenin de tek gerçek yolu.
 *
 * Gereken: ANTHROPIC_API_KEY (veya `ant auth login`).
 */
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const MODEL = 'claude-opus-5';
const client = new Anthropic();

/* Web arama sunucu aracı — Opus 5'te dinamik filtrelemeli sürüm. */
const WEB_SEARCH = { type: 'web_search_20260209', name: 'web_search', max_uses: 10 };

/* ---------------------------------------------------------------- 1. Question Agent */

const QuestionSchema = z.object({
  canonicalTitle: z.string().describe('Konunun tek, kanonik adı — eş anlamlıların birleştiği ad'),
  aliases: z.array(z.string()).describe('Aynı konuyu anlatan diğer ifadeler'),
  pillar: z.enum(['ai', 'money', 'jobs', 'business', 'life', 'senior', 'safety']),
  clusters: z.array(z.object({
    intent: z.enum(['bilgi', 'karsilastirma', 'islem']),
    questions: z.array(z.string()).describe('Aynı niyetteki sorular')
  })).describe('Sorular niyete göre kümelenir; her küme bir makaleye karşılık gelir')
});

/** İnsanların bu konuda tam olarak neyi sorduğunu çıkarır ve kümeler. */
export async function questionAgent(topicTitle, signalTitles) {
  const res = await client.beta.messages.parse({
    model: MODEL, max_tokens: 8000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium', format: betaZodOutputFormat(QuestionSchema) },
    system: 'Arama niyeti analisti gibi çalış. Eş anlamlı ifadeleri tek konuda topla; '
          + 'aynı soruyu farklı kelimelerle soranları aynı kümeye koy. Uydurma soru ekleme.',
    messages: [{ role: 'user', content:
      `Konu: ${topicTitle}\n\nBu konuda toplanan sinyaller:\n` + signalTitles.map((t) => '- ' + t).join('\n') +
      '\n\nİnsanların bu konuda sorduğu soruları çıkar ve niyete göre kümele.' }]
  });
  return res.parsed_output;
}

/* ---------------------------------------------------------------- 2. Research Agent */

const ResearchSchema = z.object({
  ozet: z.string().describe('Konunun bugünkü durumu, 5-8 cümle'),
  gercekler: z.array(z.object({
    iddia: z.string(),
    kaynak: z.string().describe('URL'),
    tarih: z.string().describe('Kaynağın tarihi veya bilinmiyorsa "bilinmiyor"'),
    guven: z.enum(['yuksek', 'orta', 'dusuk'])
  })).describe('Her iddia kaynağıyla birlikte; kaynaksız iddia eklenmez'),
  fiyatlar: z.array(z.object({ urun: z.string(), fiyat: z.string(), kaynak: z.string() })),
  karsilastirma: z.array(z.object({
    secenek: z.string(), kimIcin: z.string(), artilari: z.string(), eksileri: z.string()
  })),
  celiskiler: z.array(z.string()).describe('Kaynaklar arasında çelişen bilgiler'),
  bosluklar: z.array(z.string()).describe('İyi cevaplanmamış sorular — içerik fırsatı')
});

/** Konuyu web'de araştırır, kaynaklı bir paket çıkarır. */
export async function researchAgent(topic, questions = []) {
  const res = await client.beta.messages.parse({
    model: MODEL, max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: betaZodOutputFormat(ResearchSchema) },
    tools: [WEB_SEARCH],
    system: 'Araştırmacısın. Web araması yaparak güncel ve doğrulanabilir bilgi topla. '
          + 'Her iddianın kaynağını ver. Kaynak bulamadığın şeyi yazma. Fiyat ve tarih '
          + 'gibi bilgilerde kaynağın yayın tarihini kontrol et; eski veriyi güncel gibi sunma.',
    messages: [{ role: 'user', content:
      `Konu: ${topic}\n\nCevaplanacak sorular:\n` + questions.map((q) => '- ' + q).join('\n') +
      '\n\nBu konuda kaynaklı bir araştırma paketi hazırla.' }]
  });
  return res.parsed_output;
}

/* ---------------------------------------------------------------- 3. Writer Agent */

const ARTICLE_TEMPLATE = `H1
Kısa cevap (2-3 cümle, sorunun doğrudan yanıtı)
Önemli çıkarımlar (3-5 madde)
Sorun: neden şimdi önemli
Nasıl çalışıyor
En iyi seçenekler
Karşılaştırma
Fiyatlar
Artılar ve eksiler
Kimin için, kimin için değil
Nasıl başlanır (adım adım)
SSS
Sonuç ve tek eylem
Kaynaklar`;

/** Araştırma paketinden makaleyi yazar. Uzun çıktı olduğu için akış kullanılır. */
export async function writerAgent(topic, research, { wordTarget = 2000, lang = 'tr', brandVoice = '' } = {}) {
  const stream = client.messages.stream({
    model: MODEL, max_tokens: 32000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    system: `Kıdemli içerik editörüsün. Yalnızca verilen araştırma paketindeki bilgiyi kullan;
paket dışında bir iddia yazma. Şablon:\n${ARTICLE_TEMPLATE}\n
Kurallar: kısa paragraf, aktif çatı, somut sayı. Abartı ve klişe yok. Her sayısal iddianın
yanında kaynağı parantez içinde ver. Yaklaşık ${wordTarget} kelime. Dil: ${lang}.
${brandVoice}`,
    messages: [{ role: 'user', content:
      `Konu: ${topic}\n\nARAŞTIRMA PAKETİ:\n${JSON.stringify(research, null, 2)}\n\nMakaleyi yaz.` }]
  });
  const msg = await stream.finalMessage();
  return msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

/* ---------------------------------------------------------------- 4. SEO + Money + Quality */

const SeoSchema = z.object({
  title: z.string().describe('60 karakteri aşmayan başlık'),
  slug: z.string(),
  metaDescription: z.string().describe('155 karakteri aşmayan açıklama'),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  headings: z.array(z.string()).describe('Önerilen H2 listesi'),
  internalLinks: z.array(z.object({ anchor: z.string(), hedef: z.string() })),
  faq: z.array(z.object({ soru: z.string(), cevap: z.string() })),
  gorselOnerileri: z.array(z.string())
});

export async function seoAgent(article, existingSlugs = []) {
  const res = await client.beta.messages.parse({
    model: MODEL, max_tokens: 8000,
    output_config: { effort: 'medium', format: betaZodOutputFormat(SeoSchema) },
    system: 'SEO editörüsün. Amaç arama motorunu kandırmak değil, soruya en iyi cevabı '
          + 'bulunabilir kılmak. Anahtar kelime tıkıştırma yapma.',
    messages: [{ role: 'user', content:
      `Mevcut yazılarımızın slug listesi (iç bağlantı için): ${existingSlugs.join(', ')}\n\nMAKALE:\n${article}` }]
  });
  return res.parsed_output;
}

const MoneySchema = z.object({
  affiliate: z.enum(['yok', 'dusuk', 'orta', 'yuksek']),
  urun: z.enum(['yok', 'dusuk', 'orta', 'yuksek']),
  hizmet: z.enum(['yok', 'dusuk', 'orta', 'yuksek']),
  reklam: z.enum(['yok', 'dusuk', 'orta', 'yuksek']),
  moneyScore: z.number().min(0).max(100),
  onerilenYol: z.enum(['affiliate', 'product', 'course', 'service', 'ads']),
  yerlesim: z.array(z.string()).describe('Gelir unsuru makalenin neresine konmalı'),
  cta: z.string()
});

export async function moneyAgent(article, offerings) {
  const res = await client.beta.messages.parse({
    model: MODEL, max_tokens: 4000,
    output_config: { effort: 'medium', format: betaZodOutputFormat(MoneySchema) },
    system: 'Gelir stratejistisin. Bu makaleyi okuyan kişi bizden ne satın alabilir? '
          + 'Zorlama satış önerme; okuyucuya gerçekten yardımcı olacak yerleşim öner.',
    messages: [{ role: 'user', content: `Sattıklarımız:\n${offerings}\n\nMAKALE:\n${article}` }]
  });
  return res.parsed_output;
}

const QualitySchema = z.object({
  kaynakVar: z.boolean(),
  guncel: z.boolean(),
  iddialarDesteklenmis: z.boolean(),
  benzerIcerikRiski: z.enum(['yok', 'dusuk', 'orta', 'yuksek']),
  gercekFayda: z.boolean(),
  gelirYolu: z.boolean(),
  sorunlar: z.array(z.string()),
  karar: z.enum(['yayinlanabilir', 'duzeltme_gerek', 'reddet'])
});

/** Yayın kapısı. İnsan onayının yerine geçmez; insana ne bakacağını söyler. */
export async function qualityGate(article, research) {
  const res = await client.beta.messages.parse({
    model: MODEL, max_tokens: 6000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: betaZodOutputFormat(QualitySchema) },
    system: 'Sert bir editörsün. Makaledeki her sayısal iddiayı araştırma paketiyle karşılaştır. '
          + 'Pakette olmayan bir iddia varsa bunu sorun olarak işaretle.',
    messages: [{ role: 'user', content:
      `ARAŞTIRMA PAKETİ:\n${JSON.stringify(research)}\n\nMAKALE:\n${article}` }]
  });
  return res.parsed_output;
}
