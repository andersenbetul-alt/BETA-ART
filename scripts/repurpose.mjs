/* QBLOGG — içerik türetme hattı.
 *
 * Bir blog yazısından yedi çıktı üretir: LinkedIn serisi, sosyal içerikler,
 * newsletter, kısa video senaryoları, YouTube taslağı, podcast fikirleri ve
 * devam yazısı önerileri.
 *
 * Kullanım:
 *   npm i                                  (bir kez — SDK ve zod devDependency)
 *   export ANTHROPIC_API_KEY=...           (ya da `ant auth login`)
 *   npm run repurpose -- <slug> [dil]      (dil varsayılanı: tr)
 *
 * Çıktı: content/<slug>/<dil>/ altına markdown dosyaları + paket.md
 *
 * Not: Site kendisi bağımlılıksız kalır. Bu betik yayın öncesi bir araçtır,
 * tarayıcıya hiçbir şey göndermez.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODEL = 'claude-opus-5';

/* --- yazıyı oku --- */
const sandbox = {};
new Function('sandbox', readFileSync(join(ROOT, 'assets/js/posts.js'), 'utf8').replace(/\bwindow\b/g, 'sandbox'))(sandbox);

const slug = process.argv[2];
const lang = process.argv[3] || 'tr';
if (!slug) {
  console.error('Kullanım: npm run repurpose -- <slug> [dil]\n\nYazılar:');
  for (const p of sandbox.QB_POSTS) console.error('  ' + p.slug);
  process.exit(1);
}
const post = sandbox.QB_POSTS.find((p) => p.slug === slug);
if (!post) { console.error(`"${slug}" bulunamadı.`); process.exit(1); }

const blockText = (b) => typeof b === 'string' ? b
  : b.h ? '## ' + b.h
  : b.ul ? b.ul.map((x) => '- ' + x).join('\n')
  : b.note ? '> ' + b.note : '';

const article = [
  '# ' + post.t[lang],
  post.e[lang],
  ...(post.b[lang] || []).map(blockText)
].join('\n\n');

const words = article.split(/\s+/).length;
console.log(`Kaynak: ${slug} (${lang}), ${words} kelime\nModel: ${MODEL}\n`);

/* --- çıktı şeması --- */
const Schema = z.object({
  linkedin: z.array(z.object({
    aci: z.string().describe('Bu postun aldığı açı — tek cümle, iç not'),
    kanca: z.string().describe('İlk iki satır; akışta görünen kısım'),
    govde: z.string().describe('Postun tamamı, 120-200 kelime, kısa paragraflar'),
    cta: z.string()
  })).length(5),
  sosyal: z.array(z.object({
    platform: z.enum(['x', 'instagram', 'tiktok', 'facebook']),
    metin: z.string().describe('Platforma uygun uzunlukta, tek başına anlamlı'),
    gorselNotu: z.string()
  })).length(10),
  newsletter: z.object({
    konu: z.string().describe('E-posta konu satırı, 50 karakterin altında'),
    onIzleme: z.string(),
    govde: z.string().describe('300-450 kelime, tek konuya odaklı, sonunda net bir eylem')
  }),
  kisaVideolar: z.array(z.object({
    baslik: z.string(),
    sure: z.string().describe('örn. 45 sn'),
    senaryo: z.string().describe('Konuşma metni; kanca ilk 3 saniyede'),
    cekimNotu: z.string()
  })).length(3),
  youtube: z.object({
    baslik: z.string(),
    kanca: z.string().describe('İlk 15 saniyenin metni'),
    taslak: z.array(z.string()).describe('Bölüm başlıkları, sırayla'),
    aciklama: z.string(),
    etiketler: z.array(z.string())
  }),
  podcast: z.array(z.object({
    baslik: z.string(),
    aci: z.string(),
    sorular: z.array(z.string()).describe('Bölümü taşıyacak 5-7 soru')
  })).length(3),
  devamYazilari: z.array(z.object({
    baslik: z.string(),
    aramaNiyeti: z.string(),
    nedenIse: z.string()
  })).length(3)
});

const SYSTEM = `Sen QBLOGG içerik stüdyosunun kıdemli editörüsün.
Elindeki uzun yazıdan kanal kanal türev içerik üretiyorsun.

Kurallar:
- Her çıktı tek başına anlamlı olmalı; "yazımızda anlattığımız gibi" deme.
- Kaynaktaki rakamları koru, uydurma. Yazıda olmayan istatistik ekleme.
- Abartı ve klişe yok: "oyunun kurallarını değiştiriyor", "dijital dönüşüm" gibi
  ifadeler kullanma. Somut örnek ve sayı kullan.
- Kısa paragraf, aktif çatı, gereksiz giriş cümlesi yok.
- Her kanalın kendi ritmi var: LinkedIn'de ilk iki satır kancadır, X'te tek fikir,
  TikTok'ta ilk üç saniye, newsletter'da tek konu ve tek eylem.
- Çıktı dili: kaynağın dili neyse o.`;

const client = new Anthropic();

const response = await client.messages.parse({
  model: MODEL,
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'high', format: zodOutputFormat(Schema) },
  system: SYSTEM,
  messages: [{ role: 'user', content: `Aşağıdaki yazıdan türev içerikleri üret.\n\n---\n\n${article}` }]
});

const out = response.parsed_output;
if (!out) { console.error('Yapılandırılmış çıktı ayrıştırılamadı.'); process.exit(1); }

/* --- dosyalara yaz --- */
const dir = join(ROOT, 'content', slug, lang);
mkdirSync(dir, { recursive: true });
const write = (name, body) => {
  writeFileSync(join(dir, name), body.trim() + '\n', 'utf8');
  console.log('  ✓ content/' + slug + '/' + lang + '/' + name);
};

write('linkedin.md', '# LinkedIn serisi\n\n' + out.linkedin.map((x, i) =>
  `## ${i + 1}. ${x.aci}\n\n**Kanca:** ${x.kanca}\n\n${x.govde}\n\n_${x.cta}_`).join('\n\n---\n\n'));

write('sosyal.md', '# Sosyal içerikler\n\n' + out.sosyal.map((x, i) =>
  `## ${i + 1}. ${x.platform}\n\n${x.metin}\n\n_Görsel: ${x.gorselNotu}_`).join('\n\n'));

write('newsletter.md', `# ${out.newsletter.konu}\n\n_${out.newsletter.onIzleme}_\n\n${out.newsletter.govde}`);

write('kisa-videolar.md', '# Kısa video senaryoları\n\n' + out.kisaVideolar.map((x, i) =>
  `## ${i + 1}. ${x.baslik} (${x.sure})\n\n${x.senaryo}\n\n_Çekim: ${x.cekimNotu}_`).join('\n\n---\n\n'));

write('youtube.md', `# ${out.youtube.baslik}\n\n**Kanca (0.00–0.15):** ${out.youtube.kanca}\n\n## Taslak\n\n` +
  out.youtube.taslak.map((s, i) => `${i + 1}. ${s}`).join('\n') +
  `\n\n## Açıklama\n\n${out.youtube.aciklama}\n\n**Etiketler:** ${out.youtube.etiketler.join(', ')}`);

write('podcast.md', '# Podcast bölüm fikirleri\n\n' + out.podcast.map((x, i) =>
  `## ${i + 1}. ${x.baslik}\n\n${x.aci}\n\n` + x.sorular.map((q) => '- ' + q).join('\n')).join('\n\n---\n\n'));

write('devam-yazilari.md', '# Devam yazısı önerileri\n\n' + out.devamYazilari.map((x, i) =>
  `## ${i + 1}. ${x.baslik}\n\n- **Arama niyeti:** ${x.aramaNiyeti}\n- **Neden işe yarar:** ${x.nedenIse}`).join('\n\n'));

writeFileSync(join(dir, 'paket.json'), JSON.stringify(out, null, 2), 'utf8');

const u = response.usage;
const cost = (u.input_tokens * 5 + u.output_tokens * 25) / 1e6;
console.log(`\nToken: ${u.input_tokens} girdi / ${u.output_tokens} çıktı — yaklaşık $${cost.toFixed(3)}`);
console.log(`Çıktı klasörü: content/${slug}/${lang}/`);
