/**
 * Küratörlü yer verisi.
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
    { name: 'Fisketorget', kind: 'eat', walkMinutes: 4, price: '$$', note: 'Kapalı balık pazarı, yağmurda da açık' },
    { name: 'Pygmalion Økocafé', kind: 'eat', walkMinutes: 6, price: '$$', note: 'Vejetaryen seçenek bol' },
    { name: 'Trekroneren', kind: 'eat', walkMinutes: 5, price: '$', note: 'Ren sosisi, ayaküstü, geç saate kadar' },
    { name: 'Bryggeloftet', kind: 'eat', walkMinutes: 7, price: '$$$', note: 'Klasik Norveç mutfağı, rezervasyon iyi olur' },
    { name: 'KODE Kunstmuseer', kind: 'indoor', walkMinutes: 8, note: 'Dört bina, tek bilet — yağmurlu güne yeter' },
    { name: 'Bergen Akvariet', kind: 'indoor', walkMinutes: 20, note: 'Çocukluysanız ilk seçenek' },
    { name: 'Hanseatisk Museum', kind: 'indoor', walkMinutes: 6, note: 'Bryggen tarihi, küçük ve hızlı' },
    { name: 'Fløibanen füniküler', kind: 'indoor', walkMinutes: 8, note: 'Bulutluysa manzara yok — önce hava kamerasına bak' },
  ],
  oslo: [
    { name: 'Mathallen Oslo', kind: 'eat', walkMinutes: 15, price: '$$', note: 'Kapalı yemek hali, çok seçenek' },
    { name: 'Illegal Burger', kind: 'eat', walkMinutes: 10, price: '$', note: 'Hızlı ve uygun' },
    { name: 'Vippa', kind: 'eat', walkMinutes: 18, price: '$', note: 'Liman kenarı sokak yemeği' },
    { name: 'Munchmuseet', kind: 'indoor', walkMinutes: 12, note: 'Çığlık burada, tüm gün sürer' },
    { name: 'Nasjonalmuseet', kind: 'indoor', walkMinutes: 10, note: 'Nordik en büyük sanat müzesi' },
    { name: 'Operahuset çatısı', kind: 'indoor', walkMinutes: 8, note: 'İçi ücretsiz gezilir, çatı yağmurda kaygan' },
  ],
  tromso: [
    { name: 'Bardus Bistro', kind: 'eat', walkMinutes: 3, price: '$$', note: 'Merkezde, güvenilir' },
    { name: 'Raketten', kind: 'eat', walkMinutes: 4, price: '$', note: 'Norveç’in en küçük sosis büfesi' },
    { name: 'Polaria', kind: 'indoor', walkMinutes: 12, note: 'Akvaryum + kutup filmi' },
    { name: 'Polarmuseet', kind: 'indoor', walkMinutes: 6, note: 'Kutup keşifleri, 1-2 saat' },
    { name: 'Ishavskatedralen', kind: 'indoor', walkMinutes: 25, note: 'Köprünün diğer tarafı, otobüs var' },
  ],
  stavanger: [
    { name: 'Renaa Xpress', kind: 'eat', walkMinutes: 5, price: '$$', note: 'Merkezde, hızlı' },
    { name: 'Sjøhuset Skagen', kind: 'eat', walkMinutes: 6, price: '$$$', note: 'Deniz ürünleri, liman kenarı' },
    { name: 'Norsk Oljemuseum', kind: 'indoor', walkMinutes: 8, note: 'Beklediğinden ilginç' },
    { name: 'Gamle Stavanger', kind: 'indoor', walkMinutes: 10, note: 'Beyaz ahşap evler — yağmurda da güzel, ama açık hava' },
  ],
};

export function placesFor(city: City, kind: Place['kind']): Place[] {
  return places[city].filter((p) => p.kind === kind).sort((a, b) => a.walkMinutes - b.walkMinutes);
}

export function cityById(id: string) {
  return cities.find((c) => c.id === id);
}
