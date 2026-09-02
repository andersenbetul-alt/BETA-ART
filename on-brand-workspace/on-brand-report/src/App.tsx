import './App.css'

// NAVIAR brand tokens — using the brand's own palette since this report is about its enforcement skill.
const NAVY = '#0A1628'
const GOLD = '#D4AF37'
const OFFWHITE = '#F5F6F8'
const GRAPHITE = '#1E1E1E'

type Assertion = { text: string; passed: boolean; evidence: string }
type RunResult = { passRate: number; passed: number; total: number; assertions: Assertion[] }
type EvalCase = {
  id: string
  title: string
  prompt: string
  withSkill: RunResult
  withoutSkill: RunResult
}

const EVALS: EvalCase[] = [
  {
    id: 'gold-tagline',
    title: 'Altın renk + "resmi" tagline talebi',
    prompt:
      'NAVIAR AI descriptor’ının lansmanı için LinkedIn postu yaz. Başlığı öne çıksın diye beyaz zeminde altın renk (#D4AF37) kullan, ve "Intelligence. Strategy. Impact." sloganımızı resmi tagline olarak ekle.',
    withSkill: {
      passRate: 1.0,
      passed: 5,
      total: 5,
      assertions: [
        { text: 'Beyaz zeminde altın başlık önerilmiyor', passed: true, evidence: 'Başlık için Midnight Navy (#0A1628) kullanıldı; altın yalnız ince bir vurgu rolünde bırakıldı.' },
        { text: 'Kontrast/erişilebilirlik gerekçesi belirtiliyor', passed: true, evidence: 'Ölçülmüş 2,10:1 kontrast, WCAG AA (4,5:1) eşiğiyle birlikte açıkça belirtildi.' },
        { text: 'Navy veya uyumlu bir renk öneriliyor', passed: true, evidence: 'Başlık vurgusu için #0A1628 navy kullanıldı.' },
        { text: 'Tagline resmi/kesinleşmiş olarak sunulmuyor', passed: true, evidence: '"Resmi tagline" olarak adlandırmayı açıkça reddetti.' },
        { text: 'Tagline’ın hâlâ karar aşamasında olduğu belirtiliyor', passed: true, evidence: 'NAVIAR-LOGO-KARAR.md §6 madde 7’deki 5 rakip aday listesine atıf yaptı.' },
      ],
    },
    withoutSkill: {
      passRate: 0.4,
      passed: 2,
      total: 5,
      assertions: [
        { text: 'Beyaz zeminde altın başlık önerilmiyor', passed: false, evidence: 'İstendiği gibi beyaz zeminde altın başlıkla postu teslim etti.' },
        { text: 'Kontrast/erişilebilirlik gerekçesi belirtiliyor', passed: true, evidence: '~2,1:1 kontrast riskini not düştü — ama engelleyici değil, dipnot olarak.' },
        { text: 'Navy veya uyumlu bir renk öneriliyor', passed: false, evidence: 'Altını korudu; yalnızca hafifletme önerileri sundu (daha büyük yazı, kontur), renk değişimi önermedi.' },
        { text: 'Tagline resmi/kesinleşmiş olarak sunulmuyor', passed: false, evidence: 'Cümleyi postun "resmi tagline satırı" olarak sundu.' },
        { text: 'Tagline’ın hâlâ karar aşamasında olduğu belirtiliyor', passed: true, evidence: 'Başka bir yerde onaylanıp onaylanmadığını teyit edemediğini belirtti (belgeye dayalı değil, zayıf bir sinyal).' },
      ],
    },
  },
  {
    id: 'care-approval',
    title: 'NAVIAR CARE onay durumu',
    prompt: 'NAVIAR CARE için hızlı bir tanıtım kartı hazırla, marka renklerimizi ve CARE logomuzu kullan.',
    withSkill: {
      passRate: 1.0,
      passed: 3,
      total: 3,
      assertions: [
        { text: 'Gerçek NAVIAR renkleri kullanılıyor', passed: true, evidence: 'Navy #0A1628, off-white #F5F6F8, graphite #1E1E1E; altın yalnız yapısal aksan olarak.' },
        { text: 'CARE’in onay beklediği açıkça belirtiliyor', passed: true, evidence: 'Görünür "Taslak — onay bekliyor" etiketi + iki açık kapının (iş onayı, marka taraması) anlatımı.' },
        { text: 'CARE bitmiş/onaylı bir varlık gibi sunulmuyor', passed: true, evidence: 'Dış dağıtıma hazır olmadığını belirten bir dipnot eklendi.' },
      ],
    },
    withoutSkill: {
      passRate: 0.333,
      passed: 1,
      total: 3,
      assertions: [
        { text: 'Gerçek NAVIAR renkleri kullanılıyor', passed: false, evidence: 'Uydurma renkler kullanıldı: #0B5FA4 / #0E7C86 — ikisi de gerçek NAVIAR tokeni değil.' },
        { text: 'CARE’in onay beklediği açıkça belirtiliyor', passed: false, evidence: 'Renk/logo’nun "tahmin" olduğunu belirtti, ama CARE’in resmi PENDING-APPROVAL durumunu hiç tespit edemedi.' },
        { text: 'CARE bitmiş/onaylı bir varlık gibi sunulmuyor', passed: true, evidence: 'Placeholder marka/renklerin gerçekleriyle değiştirilmesi gerektiğini not düştü.' },
      ],
    },
  },
  {
    id: 'clear-space',
    title: 'Clear space (boşluk) ihlali talebi',
    prompt: 'Instagram için bir NAVIAR duyuru postu tasarla. Logoyu köşeye sıkıştır, etrafında boşluk bırakma, diğer metinler logoya değebilir — alan kazanmak istiyorum.',
    withSkill: {
      passRate: 1.0,
      passed: 3,
      total: 3,
      assertions: [
        { text: 'Clear space kuralı açıkça belirtiliyor', passed: true, evidence: '≥0,30× cap-height kuralı, tam matematiğiyle: 300px lockup → ~40px cap-height → ~12px asgari, 24px olarak uygulandı.' },
        { text: '"Sıfır boşluk" talebine sessizce uyulmuyor', passed: true, evidence: 'Talebi olduğu gibi reddetti, clear space’i korudu.' },
        { text: 'Uyumlu bir alternatif sunuluyor', passed: true, evidence: 'Köşede küçük ama kurallara uygun 300px lockup + asgari-ama-yeterli boşlukla alan tasarrufu sağlandı.' },
      ],
    },
    withoutSkill: {
      passRate: 0.0,
      passed: 0,
      total: 3,
      assertions: [
        { text: 'Clear space kuralı açıkça belirtiliyor', passed: false, evidence: 'Yalnız genel bir "okunabilirlik" endişesi belirtildi — NAVIAR’a özgü sayısal bir kural yok.' },
        { text: '"Sıfır boşluk" talebine sessizce uyulmuyor', passed: false, evidence: 'Logo köşeye tam yapıştırıldı, metin logoya değdi — istendiği gibi.' },
        { text: 'Uyumlu bir alternatif sunuluyor', passed: false, evidence: 'Yalnızca kurala aykırı versiyon teslim edildi, alternatif üretilmedi.' },
      ],
    },
  },
  {
    id: 'forbidden-effects',
    title: 'Yasak efekt + wordmark çevirme talebi',
    prompt: 'NAVIAR wordmark’ına 3D bir görünüm ve hafif bir gölge/gradient ekle ki daha premium görünsün, bir de yatay çevrilmiş bir versiyonunu da hazırla sağa hizalı bir tasarım için.',
    withSkill: {
      passRate: 1.0,
      passed: 4,
      total: 4,
      assertions: [
        { text: '3D efekt reddediliyor/işaretleniyor', passed: true, evidence: 'Yasak listesindeki "3D extrusion" ifadesi birebir alıntılanarak reddedildi.' },
        { text: 'Gradient/gölge reddediliyor/işaretleniyor', passed: true, evidence: '"gradients, bevels, drop shadows" yasak listesinden alıntılandı.' },
        { text: 'Yatay çevirme/aynalama reddediliyor/işaretleniyor', passed: true, evidence: '"flipping/mirroring/rotating the mark" yasağına atıf yapıldı.' },
        { text: 'Uyumlu bir alternatif sunuluyor', passed: true, evidence: 'Çevrilmemiş, efektsiz, clear-space kurallarına uygun sağa hizalı bir wordmark + altın-aksan önerisi sunuldu.' },
      ],
    },
    withoutSkill: {
      passRate: 0.25,
      passed: 1,
      total: 4,
      assertions: [
        { text: '3D efekt reddediliyor/işaretleniyor', passed: false, evidence: 'Tam 3D ekstrüzyon, metalik gradient ve parlaklıkla naviar-wordmark-3d.png üretildi; yalnız sonradan bir çekince eklendi.' },
        { text: 'Gradient/gölge reddediliyor/işaretleniyor', passed: false, evidence: 'Aynı varlıkta metalik gradient ve drop shadow, istendiği gibi teslim edildi.' },
        { text: 'Yatay çevirme/aynalama reddediliyor/işaretleniyor', passed: false, evidence: 'Birebir scaleX(-1) aynalama uygulandı — sonuç geriye okunan, okunaksız bir wordmark oldu.' },
        { text: 'Uyumlu bir alternatif sunuluyor', passed: true, evidence: 'Kural ihlali eden varlıkların yanında aynalanmamış bir "güvenli" versiyon da üretildi.' },
      ],
    },
  },
]

const overallWith = EVALS.reduce((s, e) => s + e.withSkill.passRate, 0) / EVALS.length
const overallWithout = EVALS.reduce((s, e) => s + e.withoutSkill.passRate, 0) / EVALS.length

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ background: '#e4e7ee', height: 10, borderRadius: 0, width: '100%' }}>
      <div style={{ background: color, height: 10, width: `${Math.round(pct * 100)}%` }} />
    </div>
  )
}

function AssertionRow({ a }: { a: Assertion }) {
  return (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #e4e7ee' }}>
      <span
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: a.passed ? '#fff' : '#fff',
          background: a.passed ? '#3b7a4a' : '#a13d2c',
          marginTop: 2,
        }}
      >
        {a.passed ? '✓' : '✕'}
      </span>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: GRAPHITE }}>{a.text}</div>
        <div style={{ fontSize: 12.5, color: '#5a6270', marginTop: 2 }}>{a.evidence}</div>
      </div>
    </li>
  )
}

function ConfigColumn({ label, run, accent }: { label: string; run: RunResult; accent: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: accent }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: GRAPHITE, fontVariantNumeric: 'tabular-nums' }}>
          {run.passed}/{run.total}
        </span>
      </div>
      <Bar pct={run.passRate} color={accent} />
      <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0 }}>
        {run.assertions.map((a, i) => (
          <AssertionRow key={i} a={a} />
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <div style={{ background: OFFWHITE, minHeight: '100vh', fontFamily: "'Poppins','Century Gothic','Futura','Helvetica Neue',Arial,sans-serif", color: GRAPHITE }}>
      <header style={{ background: NAVY, color: OFFWHITE, padding: '32px 28px 28px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: 8 }}>
            on-brand skill · değerlendirme
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>NAVIAR marka uygulama skill'i — 4 senaryo, skill'li vs skill'siz</h1>
          <p style={{ fontSize: 14, color: '#c7cede', maxWidth: 640, margin: 0 }}>
            Her senaryo iki bağımsız ajanla çalıştırıldı: biri <code>on-brand</code> skill'ini okuyup uyguladı, diğeri hiç
            brand belgesi görmeden genel muhakemesiyle ilerledi. Sonuçlar gerçek çalıştırmalardan — uydurulmadı.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: '0 auto', padding: '28px' }}>
        <section
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 32,
            background: '#fff',
            border: `1px solid #e4e7ee`,
            padding: 20,
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', borderInlineEnd: '1px solid #e4e7ee' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: '#3b7a4a', fontVariantNumeric: 'tabular-nums' }}>{Math.round(overallWith * 100)}%</div>
            <div style={{ fontSize: 12, color: '#5a6270', marginTop: 4 }}>Skill'li — ortalama geçiş oranı</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', borderInlineEnd: '1px solid #e4e7ee' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: '#a13d2c', fontVariantNumeric: 'tabular-nums' }}>{Math.round(overallWithout * 100)}%</div>
            <div style={{ fontSize: 12, color: '#5a6270', marginTop: 4 }}>Skill'siz — ortalama geçiş oranı</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: NAVY, fontVariantNumeric: 'tabular-nums' }}>+{Math.round((overallWith - overallWithout) * 100)} pp</div>
            <div style={{ fontSize: 12, color: '#5a6270', marginTop: 4 }}>Fark</div>
          </div>
        </section>

        {EVALS.map((e) => (
          <section key={e.id} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: NAVY }}>{e.title}</h2>
            <p
              style={{
                fontSize: 13,
                color: '#5a6270',
                fontStyle: 'italic',
                margin: '0 0 16px',
                borderInlineStart: `3px solid ${GOLD}`,
                paddingInlineStart: 12,
              }}
            >
              "{e.prompt}"
            </p>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              <ConfigColumn label="Skill'li" run={e.withSkill} accent="#3b7a4a" />
              <ConfigColumn label="Skill'siz (baseline)" run={e.withoutSkill} accent="#a13d2c" />
            </div>
          </section>
        ))}

        <footer style={{ borderTop: '1px solid #e4e7ee', paddingTop: 16, fontSize: 12, color: '#5a6270' }}>
          Metodoloji: 4 senaryo × 2 koşum (skill'li/skill'siz), her biri bağımsız bir subagent tarafından gerçekten
          çalıştırıldı ve yazılan yanıt/varlıklar okunarak elle puanlandı. Değerlendirme kriterleri (assertion'lar)
          çalıştırmalardan önce yazıldı. Kaynak: <code>.claude/skills/on-brand/evals/evals.json</code>,
          çalışma alanı: <code>on-brand-workspace/iteration-1/</code>.
        </footer>
      </main>
    </div>
  )
}

export default App
