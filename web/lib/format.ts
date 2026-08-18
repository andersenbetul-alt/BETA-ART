/** Saat gösterimi Norveç formatında — kullanıcı istasyon tabelasıyla eşleştirebilmeli. */
export function clock(iso: string): string {
  return new Intl.DateTimeFormat('nb-NO', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo',
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
