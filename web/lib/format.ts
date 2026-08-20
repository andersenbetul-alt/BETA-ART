/**
 * Saat, SEFERİN ÜLKESİNİN saat diliminde gösterilir.
 *
 * Turist ekrandaki saati istasyon tabelasıyla karşılaştırıyor; kendi
 * telefonunun saatiyle değil. Sabit bir saat dilimi yazmak, Norveç dışında
 * her kalkışı yanlış gösterir — ve yanlış saat, hiç saat vermemekten kötüdür.
 *
 * 24 saatlik biçim ('en-GB') Avrupa tabelalarının tamamıyla uyumlu.
 */
export function clock(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  }).format(new Date(iso));
}

export function relativeMinutes(iso: string): number {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
}

export function duration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

const modeLabels: Record<string, string> = {
  bus: 'Bus', rail: 'Train', water: 'Ferry', metro: 'Metro',
  tram: 'Tram', coach: 'Coach', foot: 'Walk', air: 'Flight',
};
export function modeLabel(mode: string): string {
  return modeLabels[mode] ?? mode;
}
