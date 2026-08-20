/**
 * Araç arızası — saf mantık ve statik bilgi, ağ yok.
 *
 * Buraya BİLEREK tamirci listesi yazmıyoruz. Doğrulanmamış bir garaj adı ve
 * telefonu, yol kenarında kalmış turistin boşuna aradığı numaradır; üstelik
 * kiralık araçta doğru cevap zaten "kendi tamircini arama" oluyor.
 *
 * Turistin bu durumda kaybettiği para tamir ücretinden gelmiyor. YANLIŞ
 * KİŞİYİ ARAMAKTAN geliyor: kiralık araçta kendi çekicisini çağıran kişi
 * hem çekiciyi hem tamiri hem de sözleşme ihlalini kendi ödüyor.
 */

export type CarSituation = 'rental' | 'own' | 'unknown';

export type Advice = {
  /** Ekranın en üstündeki tek cümlelik karar. */
  verdict: string;
  detail: string;
};

/**
 * Kim ödeyecek? Tek soru, üç cevap.
 *
 * Sıra önemli: önce kiralık mı diye soruyoruz çünkü turistlerin çoğu kiralık
 * araçta ve yanlış hamlenin bedeli en yüksek orada.
 */
export function whoToCall(situation: CarSituation): Advice {
  switch (situation) {
    case 'rental':
      return {
        verdict: 'Call the rental company, not a garage.',
        detail:
          'Every rental contract includes roadside assistance, and almost every one of them '
          + 'voids your cover if someone else touches the car first. Arrange your own tow or '
          + 'repair and you can end up paying for the tow, the repair, and the days the car '
          + 'was off the road. The number is on the contract, the keyring, or a sticker on '
          + 'the windscreen or in the glovebox — you do not need to look one up.',
      };
    case 'own':
      return {
        verdict: 'Check what you already have before you pay anyone.',
        detail:
          'Breakdown cover usually comes from somewhere you have forgotten: your motor '
          + 'insurance, the card you booked the trip with, or your own national motoring club. '
          + 'European clubs recognise each other’s membership, so a card from home is often '
          + 'enough abroad. Ring them before you accept a tow — afterwards it is a claim '
          + 'you have to argue for.',
      };
    default:
      return {
        verdict: 'First work out whose car it is.',
        detail:
          'Rental and own car have completely different answers, and picking wrong is what '
          + 'costs money. If it is rented, the assistance number on your contract is the only '
          + 'number you should call.',
      };
  }
}

/**
 * Aracın kenarda durduğu ilk dakikalar.
 *
 * Bu sıra keyfi değil: önce hayatta kalmak, sonra doğru numara. Otoyolda
 * araçta beklemek Avrupa'da en sık ölümcül hata; yelek ve bariyerin arkası
 * bir tavsiye değil, çoğu ülkede kanun.
 */
export const firstMinutes: { what: string; detail: string }[] = [
  {
    what: 'Hazard lights on, then the vest before you open the door',
    detail:
      'A high-visibility vest is compulsory in most of Europe and it has to be inside the '
      + 'cabin, not in the boot — the point is that you put it on before you step out. In '
      + 'France, Spain and Italy you can be fined for getting out without one.',
  },
  {
    what: 'Get everyone out on the side away from traffic, behind the barrier',
    detail:
      'Not in the car, and not on the hard shoulder. Sitting in a stopped car on a motorway '
      + 'is how most breakdown deaths happen. Take the passports and the phone with you.',
  },
  {
    what: 'Warning triangle, if it is safe to walk back',
    detail:
      'Compulsory in most countries — roughly 30 m back on a normal road, 100 m on a '
      + 'motorway. If traffic is fast and there is no barrier to walk behind, skip it: '
      + 'the triangle is worth less than you are.',
  },
  {
    what: 'On a motorway, use the orange emergency phone rather than your mobile',
    detail:
      'It connects straight to the operator responsible for that stretch and tells them '
      + 'exactly where you are — which you probably cannot. The arrows on the posts point '
      + 'to the nearest one.',
  },
];

/**
 * Otoyolda çekiciyi turist seçemiyor.
 *
 * Bunu bilmemek iki türlü zarar veriyor: ya turist boşuna ucuz çekici arıyor,
 * ya da yetkisiz bir çekiciye kendini kaptırıp fahiş fatura ödüyor.
 */
export const motorwayRule = {
  what: 'On a motorway you do not get to choose the tow truck',
  detail:
    'The company contracted to that stretch of road has the job, and in most of Europe the '
    + 'price for a motorway recovery is fixed by law rather than negotiated. That cuts both '
    + 'ways: nobody can overcharge you, and shopping around is a waste of the hour you are '
    + 'standing there. Anyone who turns up uninvited offering a cheap tow is not the '
    + 'official service.',
};

/**
 * "Mekanik arıza" ile "kaporta" farklı işler ve çoğu dilde farklı kelime.
 * Yanlış kelimeyi aratan turist, motoru bozukken boyacı buluyor.
 */
export function searchHint(garageWord: string, bodyShopWord?: string): string {
  return bodyShopWord
    ? `Search for "${garageWord}" for a mechanical fault. "${bodyShopWord}" is a body shop — `
      + 'they do dents and paint, not engines.'
    : `Search for "${garageWord}" — that is the word for a mechanical repair shop here.`;
}
