/**
 * Küratörlü yer verisi.
 *
 * Açıklamalar İNGİLİZCE: arayüzün dili turist için İngilizce, dolayısıyla
 * içerik de öyle olmalı. (Kod yorumları Türkçe — onlar bize.)
 *
 * Neden API değil: "şimdi nerede yemek yeriz" sorusunu bir POI API'siyle
 * çözmek para ve karmaşıklık getirir, üstelik sonuç kalitesi düşüktür
 * (kapalı, alakasız veya turist tuzağı yerler döner). Şehir başına 8-10
 * elle seçilmiş yer hem bedava hem daha iyi. Şehir sayısı arttığında
 * API'ye geçmeye değer — önce değil.
 */

export type City = 'bergen' | 'oslo' | 'tromso' | 'stavanger';

export const cities: { id: City; name: string; stopPlaceId: string; lat: number; lon: number }[] = [
  { id: 'bergen',    name: 'Bergen',    stopPlaceId: 'NSR:StopPlace:548',   lat: 60.3913, lon: 5.3221 },
  { id: 'oslo',      name: 'Oslo',      stopPlaceId: 'NSR:StopPlace:337',   lat: 59.9111, lon: 10.7528 },
  { id: 'tromso',    name: 'Tromsø',    stopPlaceId: 'NSR:StopPlace:73230', lat: 69.6492, lon: 18.9553 },
  { id: 'stavanger', name: 'Stavanger', stopPlaceId: 'NSR:StopPlace:60298', lat: 58.9700, lon: 5.7331 },
];

export type Place = {
  name: string;
  kind: 'eat' | 'indoor';
  /** Şehir merkezinden yaklaşık yürüme dakikası. */
  walkMinutes: number;
  note: string;
  /** Kabaca fiyat aralığı — Norveç pahalı, turist bunu bilmek ister. */
  price?: '$' | '$$' | '$$$';
};

export const places: Record<City, Place[]> = {
  bergen: [
    { name: 'Fisketorget', kind: 'eat', walkMinutes: 4, price: '$$', note: 'Covered fish market — open in the rain' },
    { name: 'Pygmalion Økocafé', kind: 'eat', walkMinutes: 6, price: '$$', note: 'Plenty of vegetarian options' },
    { name: 'Trekroneren', kind: 'eat', walkMinutes: 5, price: '$', note: 'Reindeer sausage, standing room, open late' },
    { name: 'Bryggeloftet', kind: 'eat', walkMinutes: 7, price: '$$$', note: 'Classic Norwegian, booking advised' },
    { name: 'KODE Kunstmuseer', kind: 'indoor', walkMinutes: 8, note: 'Four buildings, one ticket — fills a wet day' },
    { name: 'Bergen Akvariet', kind: 'indoor', walkMinutes: 20, note: 'First choice if you have kids' },
    { name: 'Hanseatisk Museum', kind: 'indoor', walkMinutes: 6, note: 'Bryggen history, small and quick' },
    { name: 'Fløibanen funicular', kind: 'indoor', walkMinutes: 8, note: 'No view if it is clouded in — check the webcam first' },
  ],
  oslo: [
    { name: 'Mathallen Oslo', kind: 'eat', walkMinutes: 15, price: '$$', note: 'Indoor food hall, lots of choice' },
    { name: 'Illegal Burger', kind: 'eat', walkMinutes: 10, price: '$', note: 'Fast and affordable' },
    { name: 'Vippa', kind: 'eat', walkMinutes: 18, price: '$', note: 'Harbourside street food' },
    { name: 'Munchmuseet', kind: 'indoor', walkMinutes: 12, note: 'The Scream is here — easily a full day' },
    { name: 'Nasjonalmuseet', kind: 'indoor', walkMinutes: 10, note: 'Largest art museum in the Nordics' },
    { name: 'Operahuset rooftop', kind: 'indoor', walkMinutes: 8, note: 'Free to walk inside; the roof is slippery when wet' },
  ],
  tromso: [
    { name: 'Bardus Bistro', kind: 'eat', walkMinutes: 3, price: '$$', note: 'Central and dependable' },
    { name: 'Raketten', kind: 'eat', walkMinutes: 4, price: '$', note: "Norway's smallest sausage kiosk" },
    { name: 'Polaria', kind: 'indoor', walkMinutes: 12, note: 'Aquarium plus a polar film' },
    { name: 'Polarmuseet', kind: 'indoor', walkMinutes: 6, note: 'Polar expeditions, 1–2 hours' },
    { name: 'Ishavskatedralen', kind: 'indoor', walkMinutes: 25, note: 'Across the bridge — there is a bus' },
  ],
  stavanger: [
    { name: 'Renaa Xpress', kind: 'eat', walkMinutes: 5, price: '$$', note: 'Central, quick' },
    { name: 'Sjøhuset Skagen', kind: 'eat', walkMinutes: 6, price: '$$$', note: 'Seafood by the harbour' },
    { name: 'Norsk Oljemuseum', kind: 'indoor', walkMinutes: 8, note: 'More interesting than it sounds' },
    { name: 'Gamle Stavanger', kind: 'indoor', walkMinutes: 10, note: 'White wooden houses — lovely in rain, but outdoors' },
  ],
};

export function placesFor(city: City, kind: Place['kind']): Place[] {
  return places[city].filter((p) => p.kind === kind).sort((a, b) => a.walkMinutes - b.walkMinutes);
}

export function cityById(id: string) {
  return cities.find((c) => c.id === id);
}
