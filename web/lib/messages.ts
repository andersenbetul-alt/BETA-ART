/**
 * Hazır mesaj şablonları.
 *
 * COBBAN'ın "DONE" olduğu yer burası. "Call them now" demek işi
 * kullanıcıda bırakır: numarayı bulacak, yabancı bir dilde konuşacak,
 * saatleri doğru söyleyecek. Asıl yardım, mesajı ONUN YERİNE yazmaktır.
 *
 * Mesaj YEREL dilde yazılır (Norveç'te Norveççe) çünkü karşı taraf onu
 * okuyacak. Altında İngilizce çevirisi durur çünkü kullanıcı ne
 * gönderdiğini bilmek ister — okuyamadığın bir metni göndermek rahatsız edicidir.
 */

import type { ItemKind } from './plan.ts';

export type Message = {
  /** Karşı tarafa gönderilecek metin — yerel dilde. */
  local: string;
  /** Kullanıcının anlaması için — İngilizce. */
  english: string;
  /** Butonda yazan eylem. */
  action: string;
};

type Vars = {
  /** Yeni tahmini varış/geliş saati, HH:MM. */
  time: string;
  /** Plandaki maddenin adı. */
  title: string;
  /** Aksaklığın sebebi, yerel dilde. */
  reasonLocal: string;
  reasonEnglish: string;
};

const reasons: Record<'cancelled' | 'missed' | 'road', { no: string; en: string }> = {
  cancelled: { no: 'avgangen min ble innstilt', en: 'my departure was cancelled' },
  missed: { no: 'jeg mistet overgangen min', en: 'I missed my connection' },
  road: { no: 'veien er stengt', en: 'the road is closed' },
};

/**
 * Konaklama, yemek ve aktivite için farklı mesaj gerekir:
 * otelden oda tutmasını, restorandan saat değişikliği, aktiviteden
 * yeniden planlama istenir. Aynı metni üçüne göndermek işe yaramaz.
 */
function template(kind: ItemKind, v: Vars): Message {
  switch (kind) {
    case 'stay':
      return {
        action: 'Message the hotel',
        local:
          `Hei! Jeg har en reservasjon hos dere i natt, men ${v.reasonLocal}. ` +
          `Jeg rekker ikke innsjekking før ca. kl. ${v.time}. ` +
          `Kan dere holde rommet? Takk!`,
        english:
          `Hi! I have a reservation with you tonight, but ${v.reasonEnglish}. ` +
          `I will not reach check-in before about ${v.time}. ` +
          `Can you hold the room? Thank you!`,
      };
    case 'meal':
      return {
        action: 'Message the restaurant',
        local:
          `Hei! Vi har bord hos dere i kveld, men ${v.reasonLocal} og vi blir forsinket. ` +
          `Kan vi flytte reservasjonen til kl. ${v.time}? Hvis ikke, si gjerne fra så avbestiller vi.`,
        english:
          `Hi! We have a table with you tonight, but ${v.reasonEnglish} and we are delayed. ` +
          `Can we move the booking to ${v.time}? If not, let us know and we will cancel.`,
      };
    case 'transport':
      return {
        action: 'Message the operator',
        local:
          `Hei! Jeg har billett til ${v.title} i dag, men ${v.reasonLocal}. ` +
          `Kan jeg bli booket om til en senere avgang uten ekstra kostnad?`,
        english:
          `Hi! I have a ticket for ${v.title} today, but ${v.reasonEnglish}. ` +
          `Can I be re-booked onto a later departure at no extra cost?`,
      };
    default:
      return {
        action: 'Message them',
        local:
          `Hei! Vi har booket ${v.title} i dag, men ${v.reasonLocal} og vi blir forsinket. ` +
          `Er det mulig å flytte til et senere tidspunkt?`,
        english:
          `Hi! We have booked ${v.title} today, but ${v.reasonEnglish} and we are delayed. ` +
          `Is it possible to move to a later time?`,
      };
  }
}

export function messageFor(
  kind: ItemKind,
  title: string,
  newTime: string,
  problem: 'cancelled' | 'missed' | 'road',
): Message {
  const reason = reasons[problem];
  return template(kind, {
    time: newTime,
    title,
    reasonLocal: reason.no,
    reasonEnglish: reason.en,
  });
}

/**
 * `tel:` bağlantısı için numarayı temizler. Uluslararası arama yapan
 * turist için boşluk ve parantez sorun çıkarır.
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
