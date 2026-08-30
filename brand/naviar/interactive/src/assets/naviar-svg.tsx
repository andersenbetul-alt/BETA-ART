// Gerçek NAVIAR marka varlıkları — geometri brand/naviar/{master,descriptors,studies}
// klasöründen birebir alınmıştır (andersenbetul-alt/BETA-ART). Hiçbir path uydurulmadı.

const NAVY = "#0A1628";
const GOLD = "#D4AF37";
const OFFWHITE = "#F5F6F8";
const GRAPHITE = "#1E1E1E";

// Tek harf path'leri — hem bağımsız wordmark hem descriptor/lockup bunları
// paylaşır, yalnızca x/y ofsetleri değişir (viewBox genişliği farklı).
const LETTER_PATHS = [
  "M0 0 H15.0 L63.0 83.36 V0 H78.0 V100.0 H63.0 L15.0 16.64 V100.0 H0 Z",
  "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
  "M41.0 100.0 L82.0 0.0 L65.79 0.0 L41.0 60.46 L16.21 0.0 L0 0.0 Z",
  "M0 0 H15.0 V100.0 H0 Z",
  "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
  "M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L16.0 50.0 H15.0 V100.0 H0 Z M15.0 15.0 H44.0 A10.0 10.0 0 0 1 44.0 35.0 H15.0 Z",
];

// Bağımsız wordmark (viewBox 0 0 557 100) — x=0'dan başlar, monogram payı yok.
// Kaynak: brand/naviar/master/naviar-wordmark.svg.
function StandaloneWordmarkGlyphs({ fill }: { fill: string }) {
  const x = [0, 108, 214, 328, 377, 485];
  return (
    <>
      {LETTER_PATHS.map((d, i) => (
        <path key={i} d={d} transform={`translate(${x[i]} 0)`} fill={fill} fillRule="evenodd" />
      ))}
    </>
  );
}

// Monogram payı bırakan konumlar (x 195.75'ten başlar) — descriptor'larda ve
// yatay lockup'ta kullanılır. Kaynak: brand/naviar/descriptors/*.svg,
// brand/naviar/master/naviar-lockup-horizontal(-reverse).svg.
function WordmarkGlyphs({ fill, dy = 0 }: { fill: string; dy?: number }) {
  return (
    <>
      <path
        d="M0 0 H15.0 L63.0 83.36 V0 H78.0 V100.0 H63.0 L15.0 16.64 V100.0 H0 Z"
        transform={`translate(195.75 ${-1 + dy})`}
        fill={fill}
        fillRule="evenodd"
      />
      <path
        d="M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z"
        transform={`translate(303.75 ${-1 + dy})`}
        fill={fill}
        fillRule="evenodd"
      />
      <path
        d="M41.0 100.0 L82.0 0.0 L65.79 0.0 L41.0 60.46 L16.21 0.0 L0 0.0 Z"
        transform={`translate(409.75 ${-1 + dy})`}
        fill={fill}
        fillRule="evenodd"
      />
      <path d="M0 0 H15.0 V100.0 H0 Z" transform={`translate(523.75 ${-1 + dy})`} fill={fill} fillRule="evenodd" />
      <path
        d="M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z"
        transform={`translate(572.75 ${-1 + dy})`}
        fill={fill}
        fillRule="evenodd"
      />
      <path
        d="M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L16.0 50.0 H15.0 V100.0 H0 Z M15.0 15.0 H44.0 A10.0 10.0 0 0 1 44.0 35.0 H15.0 Z"
        transform={`translate(680.75 ${-1 + dy})`}
        fill={fill}
        fillRule="evenodd"
      />
    </>
  );
}

function MonogramMark({ navy, gold }: { navy: string; gold: string | null }) {
  return (
    <>
      <path
        d="M0 0 H150.0 L610.0 626.97 V167.7 L760.0 428.7 V800.0 H610.0 L150.0 173.03 V800.0 H0 Z"
        fill={navy}
      />
      {gold && <path d="M610.0 0 H760.0 V428.7 L610.0 167.7 Z" fill={gold} />}
    </>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 760 800" role="img" aria-label="NAVIAR N monogramı" className={className}>
      <title>NAVIAR N monogramı</title>
      <MonogramMark navy={NAVY} gold={GOLD} />
    </svg>
  );
}

export function MonogramMono({ tone, className }: { tone: "dark" | "light"; className?: string }) {
  return (
    <svg viewBox="0 0 760 800" role="img" aria-label="NAVIAR N monogramı — tek renk" className={className}>
      <title>NAVIAR N monogramı — tek renk</title>
      <path
        d="M0 0 H150.0 L610.0 626.97 V0 H760.0 V800.0 H610.0 L150.0 173.03 V800.0 H0 Z"
        fill={tone === "dark" ? NAVY : OFFWHITE}
      />
    </svg>
  );
}

export function IconApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" role="img" aria-label="NAVIAR uygulama ikonu" className={className}>
      <title>NAVIAR uygulama ikonu</title>
      <rect width="1024" height="1024" rx="224" fill={NAVY} />
      <g transform="translate(239.62 225.28) scale(0.72)">
        <MonogramMark navy={OFFWHITE} gold={GOLD} />
      </g>
    </svg>
  );
}

export function IconFavicon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="NAVIAR favikon" className={className}>
      <title>NAVIAR favikon</title>
      <rect width="512" height="512" rx="96" fill={NAVY} />
      <g transform="translate(105.22 97.28) scale(0.4)">
        <MonogramMark navy={OFFWHITE} gold={GOLD} />
      </g>
    </svg>
  );
}

export function Wordmark({ fill = NAVY, className }: { fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 557 100" role="img" aria-label="NAVIAR wordmark" className={className}>
      <title>NAVIAR wordmark</title>
      <StandaloneWordmarkGlyphs fill={fill} />
    </svg>
  );
}

export function WordmarkResponsive({ className }: { className?: string }) {
  // Ayrı, sıkışık traklı (-%17) küçük ölçek varyantı — ayrı translate seti.
  const t = [0, 102.9, 204.82, 313.38, 356.6, 460.18];
  const paths = [
    "M0 0 H15.0 L63.0 83.36 V0 H78.0 V100.0 H63.0 L15.0 16.64 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
    "M41.0 100.0 L82.0 0.0 L65.79 0.0 L41.0 60.46 L16.21 0.0 L0 0.0 Z",
    "M0 0 H15.0 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
    "M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L16.0 50.0 H15.0 V100.0 H0 Z M15.0 15.0 H44.0 A10.0 10.0 0 0 1 44.0 35.0 H15.0 Z",
  ];
  return (
    <svg viewBox="0 0 532.18 100" role="img" aria-label="NAVIAR wordmark — duyarlı" className={className}>
      <title>NAVIAR wordmark — duyarlı</title>
      {paths.map((d, i) => (
        <path key={i} d={d} transform={`translate(${t[i]} 0)`} fill={NAVY} fillRule="evenodd" />
      ))}
    </svg>
  );
}

export function LockupHorizontal({ reverse, className }: { reverse?: boolean; className?: string }) {
  const ink = reverse ? OFFWHITE : NAVY;
  return (
    <svg viewBox="0 0 752.75 145" role="img" aria-label="NAVIAR lockup" className={className}>
      <title>NAVIAR lockup</title>
      {reverse && <rect x="0" y="0" width="752.75" height="145" fill={NAVY} />}
      <g transform="translate(0 0) scale(0.18)">
        <MonogramMark navy={ink} gold={GOLD} />
      </g>
      <WordmarkGlyphs fill={ink} dy={23.5} />
    </svg>
  );
}

export function LockupStacked({ className }: { className?: string }) {
  const t = [0, 108, 214, 328, 377, 485];
  const paths = [
    "M0 0 H15.0 L63.0 83.36 V0 H78.0 V100.0 H63.0 L15.0 16.64 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
    "M41.0 100.0 L82.0 0.0 L65.79 0.0 L41.0 60.46 L16.21 0.0 L0 0.0 Z",
    "M0 0 H15.0 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
    "M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L16.0 50.0 H15.0 V100.0 H0 Z M15.0 15.0 H44.0 A10.0 10.0 0 0 1 44.0 35.0 H15.0 Z",
  ];
  return (
    <svg viewBox="0 0 557 350" role="img" aria-label="NAVIAR — alt alta lockup" className={className}>
      <title>NAVIAR — alt alta lockup</title>
      <g transform="translate(183.5 0) scale(0.25)">
        <MonogramMark navy={NAVY} gold={GOLD} />
      </g>
      {paths.map((d, i) => (
        <path key={i} d={d} transform={`translate(${t[i]} 250)`} fill={NAVY} fillRule="evenodd" />
      ))}
    </svg>
  );
}

const DESCRIPTOR_LABEL_WIDTH: Record<string, number> = {
  CONSULTING: 401.14,
  AI: 80.23,
  PLATFORM: 320.91,
  "RESEARCH INSTITUTE": 557.0,
  ACADEMY: 280.8,
  LABS: 160.46,
  CARE: 160.46,
};

// Tüm descriptor'lar aynı N-glyph + scale(0.18) monogramı taşır, yalnız
// sondaki <text> etiketi değişir (brand/naviar/descriptors/*.svg birebir).
export function Descriptor({ label, className }: { label: string; className?: string }) {
  const textLength = DESCRIPTOR_LABEL_WIDTH[label] ?? label.length * 36;
  return (
    <svg viewBox="0 0 752.75 145" role="img" aria-label={`NAVIAR ${label}`} className={className}>
      <title>{`NAVIAR ${label}`}</title>
      <g transform="translate(0 0) scale(0.18)">
        <MonogramMark navy={NAVY} gold={GOLD} />
      </g>
      <WordmarkGlyphs fill={NAVY} />
      <text
        x="474.25"
        y="146"
        fontFamily="'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
        fontSize="38.57"
        fontWeight={500}
        letterSpacing="16.2"
        fill={NAVY}
        textAnchor="middle"
        textLength={textLength}
        lengthAdjust="spacing"
      >
        {label}
      </text>
    </svg>
  );
}

// Arşiv çalışmaları — master değil, karşılaştırma amaçlı.
export function StudyOpenVsClosedR({ className }: { className?: string }) {
  const openLeg =
    "M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L20.0 54.0 H31.0 V100.0 H0 Z";
  const closedLeg =
    "M0 0 H44.0 A25.0 25.0 0 0 1 44.0 50.0 L72.0 100.0 H54.0 L16.0 50.0 H15.0 V100.0 H0 Z M15.0 15.0 H44.0 A10.0 10.0 0 0 1 44.0 35.0 H15.0 Z";
  const commonFour = [
    "M0 0 H15.0 L63.0 83.36 V0 H78.0 V100.0 H63.0 L15.0 16.64 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
    "M41.0 100.0 L82.0 0.0 L65.79 0.0 L41.0 60.46 L16.21 0.0 L0 0.0 Z",
    "M0 0 H15.0 V100.0 H0 Z",
    "M41.0 0.0 L82.0 100.0 L65.79 100.0 L41.0 39.54 L16.21 100.0 L0 100.0 Z M27.69 72.0 H54.31 L60.46 87.0 H21.54 Z",
  ];
  const t = [0, 108, 214, 328, 377];
  const row = (leg: string, y: number) => (
    <g transform={`translate(0 ${y}) scale(0.24)`}>
      {commonFour.map((d, i) => (
        <path key={i} d={d} transform={`translate(${t[i]} 0)`} fill={NAVY} fillRule="evenodd" />
      ))}
      <path d={leg} transform="translate(485 0)" fill={NAVY} fillRule="evenodd" />
    </g>
  );
  return (
    <svg viewBox="0 0 133.68 88" role="img" aria-label="Açık R (üst, reddedildi) vs kapalı R (alt, master)" className={className}>
      <title>Açık R (üst, reddedildi) vs kapalı R (alt, master)</title>
      {row(openLeg, 0)}
      {row(closedLeg, 64)}
    </svg>
  );
}

export function StudyMonogramScale({ className }: { className?: string }) {
  const steps = [
    { x: 0, y: 32, s: 0.02 },
    { x: 40, y: 24, s: 0.03 },
    { x: 88, y: 16, s: 0.04 },
    { x: 144, y: 0, s: 0.06 },
  ];
  return (
    <svg viewBox="0 0 192 48" role="img" aria-label="Düz monogram 16 / 24 / 32 / 48 px" className={className}>
      <title>Düz monogram 16 / 24 / 32 / 48 px</title>
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
          <MonogramMark navy={NAVY} gold={GOLD} />
        </g>
      ))}
    </svg>
  );
}

export const NAVIAR_TOKENS = { NAVY, GOLD, OFFWHITE, GRAPHITE };
