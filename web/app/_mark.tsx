/**
 * COBBAN işareti: yay + nokta.
 *
 * Harf yerine çizim kullanıyoruz çünkü next/og'un varsayılan yazı tipinde
 * kalın kesim yok; fontWeight sessizce yok sayılıyor ve "C" 16px'te
 * gri bir lekeye dönüşüyordu. Yay olarak çizince kalınlığı biz belirliyoruz.
 */
const VIEW_BOX = '73 132 379 248';
const RATIO = 248 / 379;

export function Mark({ width }: { width: number }) {
  return (
    <svg width={width} height={Math.round(width * RATIO)} viewBox={VIEW_BOX}>
      <path
        d="M266 189.3 A 96 96 0 1 0 266 322.7"
        fill="none"
        stroke="#F4F1EC"
        strokeWidth={56}
        strokeLinecap="round"
      />
      <circle cx={408} cy={256} r={44} fill="#A85835" />
    </svg>
  );
}
