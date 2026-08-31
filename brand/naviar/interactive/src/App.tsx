import { ThemeToggle } from "@/components/theme-toggle";
import { ColorSwatch } from "@/components/color-swatch";
import { ContrastDemo } from "@/components/contrast-demo";
import { SectionNav, SECTIONS } from "@/components/section-nav";
import { BookingRequest } from "@/components/booking-request";
import {
  Wordmark,
  WordmarkResponsive,
  Monogram,
  MonogramMono,
  IconApp,
  IconFavicon,
  LockupHorizontal,
  LockupStacked,
  Descriptor,
  StudyOpenVsClosedR,
  StudyMonogramScale,
} from "@/assets/naviar-svg";

const DESCRIPTORS: { label: string; status: "approved" | "pending" }[] = [
  { label: "CONSULTING", status: "approved" },
  { label: "AI", status: "approved" },
  { label: "PLATFORM", status: "approved" },
  { label: "RESEARCH INSTITUTE", status: "approved" },
  { label: "ACADEMY", status: "approved" },
  { label: "LABS", status: "approved" },
  { label: "CARE", status: "pending" },
];

const MEASUREMENTS: { criterion: string; spec: string; produced: string; ok: boolean }[] = [
  { criterion: "Wordmark stroke", spec: "H'nin %14–16'sı", produced: "%15", ok: true },
  {
    criterion: "Çift aralıkları",
    spec: "0,30 / 0,24 / 0,32 / 0,34 / 0,26 H",
    produced: "30 / 24 / 32 / 34 / 26",
    ok: true,
  },
  { criterion: "A crossbar", spec: "≥ 0,14H", produced: "0,15H", ok: true },
  { criterion: "A counter", spec: "≥ 0,20H", produced: "0,27H", ok: true },
  { criterion: "R", spec: "kapalı bowl + diyagonal bacak", produced: "kapalı bowl + bacak", ok: true },
  { criterion: "Responsive tracking", spec: "−%15–20", produced: "−%17", ok: true },
  { criterion: "Monogram footprint", spec: "~760 × 800", produced: "760 × 800", ok: true },
  { criterion: "Ribbon", spec: "145–160", produced: "150", ok: true },
  { criterion: "Altın aksan", spec: "%12–16", produced: "%14,1", ok: true },
  { criterion: "Descriptor cap", spec: "%24–30", produced: "%27", ok: true },
  { criterion: "Efektler", spec: "gradient/gölge/3D yok", produced: "yok", ok: true },
  { criterion: "Diyagonal açı", spec: "38–42°", produced: "29,9° (dikeyden)", ok: false },
];

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-12 first:pt-0">
      <h2 className="font-data text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AssetCard({
  label,
  ground = "card",
  children,
}: {
  label: string;
  ground?: "card" | "navy";
  children: React.ReactNode;
}) {
  // Specimen kartları, uygulamanın açık/koyu temasından BAĞIMSIZ, sabit bir
  // zemin taşır — navy mürekkep her zaman açık zeminde, off-white mürekkep
  // her zaman navy zeminde. Aksi hâlde koyu temada navy-üstüne-navy
  // görünmez olurdu. Aynı ilke orijinal brand/naviar/index.html'de de var.
  const bg = ground === "navy" ? "#0A1628" : "#FFFFFF";
  const border = ground === "navy" ? "#1b2b44" : "#dfe3e8";
  const labelColor = ground === "navy" ? "#8a9bb0" : "#5b6876";
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-md border p-6"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div className="flex min-h-[64px] w-full items-center justify-center">{children}</div>
      <span className="font-data text-center text-[11px] tracking-wide" style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Monogram className="h-7 w-auto" />
            <div>
              <p className="text-sm font-semibold leading-tight">NAVIAR Kimlik Rehberi</p>
              <p className="font-data text-[11px] leading-tight text-muted-foreground">
                brand/naviar/ — üretilmiş varlıklar, interaktif
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-10 lg:grid-cols-[1fr_160px]">
        <main className="min-w-0 order-2 lg:order-1">
          <div className="rounded-md border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            Bu sayfa asıl olarak satış sitesi değil, marka kimliğinin durumudur — tüm geometri ve
            renkler depodaki gerçek dosyalardan (<code className="font-data">brand/naviar/</code>)
            birebir alınmıştır. Kontrast oranı sayfada canlı hesaplanır, uydurulmuş bir rakam
            değildir (bkz. Renkler bölümü). Altta, kalıcı V2 sitesi kuruluncaya kadarki geçici bir
            görüşme-talebi bölümü de var.
          </div>

          <Section id="wordmark" title="Wordmark">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AssetCard label="master · 557 × 100 · stroke %15">
                <Wordmark className="h-10 w-auto" />
              </AssetCard>
              <AssetCard label="reverse" ground="navy">
                <Wordmark fill="#F5F6F8" className="h-10 w-auto" />
              </AssetCard>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <AssetCard label="responsive · −%17 tracking">
                <WordmarkResponsive className="h-7 w-auto" />
              </AssetCard>
              <AssetCard label="200 px">
                <Wordmark className="h-9 w-auto" />
              </AssetCard>
              <AssetCard label="130 px">
                <WordmarkResponsive className="h-6 w-auto" />
              </AssetCard>
              <AssetCard label="96 px · minimum">
                <WordmarkResponsive className="h-4 w-auto" />
              </AssetCard>
            </div>
          </Section>

          <Section id="monogram" title="Monogram ve ikonlar">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <AssetCard label="two-tone · altın %14,0">
                <Monogram className="h-14 w-auto" />
              </AssetCard>
              <AssetCard label="tek renk">
                <MonogramMono tone="dark" className="h-14 w-auto" />
              </AssetCard>
              <AssetCard label="app icon">
                <IconApp className="h-14 w-14 rounded-[22%]" />
              </AssetCard>
              <AssetCard label="favicon 64">
                <IconFavicon className="h-10 w-10 rounded-[19%]" />
              </AssetCard>
              <AssetCard label="favicon 32">
                <IconFavicon className="h-6 w-6 rounded-[19%]" />
              </AssetCard>
              <AssetCard label="favicon 16">
                <IconFavicon className="h-4 w-4 rounded-[19%]" />
              </AssetCard>
            </div>
          </Section>

          <Section id="lockup" title="Lockup">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AssetCard label="horizontal">
                <LockupHorizontal className="h-12 w-auto" />
              </AssetCard>
              <AssetCard label="stacked">
                <LockupStacked className="h-24 w-auto" />
              </AssetCard>
            </div>
            <div className="mt-4">
              <AssetCard label="reverse" ground="navy">
                <LockupHorizontal reverse className="h-12 w-auto" />
              </AssetCard>
            </div>
          </Section>

          <Section
            id="descriptors"
            title="Descriptor sistemi"
            intro="Servis seviyesi adları. CARE onaylı mimaride yok — iş onayı ve sınıf 44 marka taraması bekliyor; bu sayfada soluk gösterilir."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DESCRIPTORS.map((d) => (
                <div
                  key={d.label}
                  className="flex flex-col items-center gap-3 rounded-md border p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#dfe3e8",
                    opacity: d.status === "pending" ? 0.55 : 1,
                  }}
                >
                  <Descriptor label={d.label} className="h-9 w-auto" />
                  {/* Sabit renkler — bu kart daima beyaz zemin, uygulama temasını izlemez. */}
                  <span
                    className="font-data rounded-md border px-2.5 py-0.5 text-[10px] font-medium tracking-wide"
                    style={
                      d.status === "approved"
                        ? { backgroundColor: "#0A1628", borderColor: "#0A1628", color: "#F5F6F8" }
                        : { backgroundColor: "transparent", borderColor: "#5b6876", color: "#5b6876" }
                    }
                  >
                    {d.status === "approved" ? "Onaylı" : "Onay bekliyor"}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="colors"
            title="Renkler"
            intro="Beş belirteç, tek kaynak. Kartlara tıklayın — hex kodu panoya kopyalanır."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <ColorSwatch name="Midnight Navy" hex="#0A1628" note="Ana marka rengi" />
              <ColorSwatch name="Premium Gold" hex="#D4AF37" note="Yalnız kontrollü aksan" />
              <ColorSwatch name="Off White" hex="#F5F6F8" />
              <ColorSwatch name="Graphite" hex="#1E1E1E" />
              <ColorSwatch name="Accent Cyan" hex="#00B2E3" note="Yalnız veri/UI — master markada asla" />
            </div>

            <h3 className="mt-8 text-sm font-medium">Canlı kontrast kanıtı</h3>
            <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              Gold metin, üç zeminde. Sayı README'den kopyalanmadı — bu sayfa her seferinde WCAG
              formülüyle yeniden hesaplıyor.
            </p>
            <div className="mt-4">
              <ContrastDemo />
            </div>
          </Section>

          <Section id="measurements" title="Ölçüm kanıtı">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-4 py-2.5 font-medium">Kriter</th>
                    <th className="px-4 py-2.5 font-medium">Spec</th>
                    <th className="px-4 py-2.5 font-medium">Üretilen</th>
                    <th className="px-4 py-2.5 font-medium">Durum</th>
                  </tr>
                </thead>
                <tbody className="font-data">
                  {MEASUREMENTS.map((m) => (
                    <tr key={m.criterion} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-sans">{m.criterion}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{m.spec}</td>
                      <td className="px-4 py-2.5">{m.produced}</td>
                      <td className="px-4 py-2.5">
                        <span style={{ color: m.ok ? "hsl(var(--pass))" : "hsl(var(--fail))" }}>
                          {m.ok ? "✔" : "✘"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-md border border-border bg-card p-4">
              <p className="text-sm font-medium">Tek sapma: diyagonal açı — onay bekliyor.</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Spec'in üç monogram sayısı birbiriyle çelişiyor: 760×800 footprint ve 150 birim
                ribbon sabitken diyagonale kalan yatay açıklık 460 birimdir, bu da dikeyden 29,9°
                verir. 38–42° için footprint'in ~971 birime çıkması gerekir — bu da "~760×800"
                şartını bozar. Detay:{" "}
                <code className="font-data">docs/naviar/NAVIAR-LOGO-KARAR.md</code>.
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-medium">Arşiv çalışmaları — master değil</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AssetCard label="P6 · açık R (üst, reddedildi) / kapalı R (alt, master)">
                  <StudyOpenVsClosedR className="h-16 w-auto" />
                </AssetCard>
                <AssetCard label="P7 · 16 / 24 / 32 / 48 px, 1:1">
                  <StudyMonogramScale className="h-10 w-auto" />
                </AssetCard>
              </div>
            </div>
          </Section>

          <Section
            id="kontakt"
            title="Görüşme talebi"
            intro="Kalıcı V2 pazarlama sitesi kuruluncaya kadarki geçici bölüm — istek + insan onayı deseni, otomatik/anında booking değil (bkz. docs/naviar/is-modeli.md §9, Risk Gate)."
          >
            <BookingRequest />
          </Section>

          <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
            Kaynak: <code className="font-data">brand/naviar/</code> (andersenbetul-alt/BETA-ART).
            Tipografi — IBM Plex Sans / Mono — dokümantasyon amaçlı bir seçim, NAVIAR'ın henüz
            tanımlı bir resmî body-fontu yok (bkz.{" "}
            <code className="font-data">.claude/skills/on-brand/SKILL.md</code> §4).
          </footer>
        </main>

        <aside className="order-1 hidden pt-1 lg:order-2 lg:block">
          <div className="sticky top-24">
            <SectionNav />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
