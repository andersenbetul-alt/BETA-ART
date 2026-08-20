/**
 * Sekiz sorunun tek kaynağı.
 *
 * Bu liste daha önce iki yerde duruyordu: anasayfadaki kartlar ve sorun
 * sayfasındaki geçerli tür listesi. İkisi birbirinden habersizdi — birine
 * eklenip diğerine eklenmeyen bir tür ya tıklanınca 404 veren bir kart ya da
 * hiç görünmeyen bir ekran demekti. Tek dizi, iki tüketici.
 */

export type Kind =
  | 'cancelled' | 'missed' | 'road' | 'car' | 'eat' | 'rain' | 'meet' | 'basics';

export type Problem = {
  kind: Kind;
  icon: string;
  /** Anasayfadaki kartın metni — turistin kendi cümlesi. */
  label: string;
  hint: string;
  /** Cevap ekranının ilk cümlesi. Marka sesi: sakin, kesin, çözülmüş. */
  headline: string;
};

export const problems: Problem[] = [
  { kind: 'cancelled', icon: '⛴', label: 'My ferry or train was cancelled',
    hint: 'Other ways to still get there', headline: 'Other ways to still get there.' },
  { kind: 'missed', icon: '🕐', label: 'I missed my connection',
    hint: 'The rest of today, rebuilt', headline: 'The rest of today, rebuilt.' },
  { kind: 'road', icon: '🚧', label: 'The road is closed',
    hint: 'Alternative route', headline: 'Routes that avoid the road.' },
  { kind: 'car', icon: '🔧', label: 'My car broke down',
    hint: 'Who to call first, and who pays', headline: 'Who to call, before anyone tows it.' },
  { kind: 'eat', icon: '🍽', label: 'Where can we eat now?',
    hint: 'Worth walking to from here', headline: 'Places worth walking to.' },
  { kind: 'rain', icon: '🌧', label: 'It started raining',
    hint: 'Wait it out, or move indoors', headline: 'Wait it out, or move indoors?' },
  { kind: 'meet', icon: '🎪', label: 'I want to be around people',
    hint: 'What is on tonight, free to walk into', headline: 'What is on tonight, and tomorrow.' },
  { kind: 'basics', icon: '💶', label: 'What am I supposed to know here?',
    hint: 'The rules locals never explain', headline: 'What everyone here already knows.' },
];

export const kinds: Kind[] = problems.map((p) => p.kind);

export function problemFor(kind: string): Problem | undefined {
  return problems.find((p) => p.kind === kind);
}
