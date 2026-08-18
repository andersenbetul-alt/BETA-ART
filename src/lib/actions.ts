"use server";

import { headers } from "next/headers";
import { getDictionary } from "@/content";
import { defaultLocale, isLocale, type Locale } from "./i18n";
import type { ContactFieldErrors, ContactState } from "./contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Basit hız sınırı: aynı adresten bir dakika içinde en fazla üç talep.
 *
 * Bellekte tutulur; sunucu yeniden başladığında ya da birden fazla örnek
 * çalıştığında sıfırlanır. Amaç kararlı bir saldırıyı durdurmak değil, formun
 * kazara veya kabaca kötüye kullanılmasını ucuza engellemek. Gerçek bir kötüye
 * kullanım sorunu çıkarsa kalıcı bir depoya (Vercel KV, Upstash vb.) taşıyın.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;

const recentSubmissions = new Map<string, number[]>();

function pruneExpired(now: number): void {
  for (const [key, times] of recentSubmissions) {
    const fresh = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) recentSubmissions.delete(key);
    else recentSubmissions.set(key, fresh);
  }
}

async function isRateLimited(): Promise<boolean> {
  const headerStore = await headers();
  // Vercel ve benzeri vekiller gerçek adresi bu başlıkta taşır.
  const client =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "bilinmeyen";

  const now = Date.now();
  pruneExpired(now);

  const times = recentSubmissions.get(client) ?? [];
  if (times.length >= RATE_LIMIT_MAX_REQUESTS) return true;

  recentSubmissions.set(client, [...times, now]);
  return false;
}

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * İletişim formunu doğrular ve talebi ilgili adrese iletir.
 *
 * Gönderim `deliverRequest` içinde yapılır; ortam değişkenleri tanımlıysa
 * e-posta gönderilir, tanımlı değilse talep sunucu günlüğüne yazılır.
 */
export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const rawLocale = readField(formData, "locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const { errors } = getDictionary(locale).contact.form;

  // Bot tuzağı: gerçek kullanıcılar bu gizli alanı doldurmaz.
  if (readField(formData, "website")) {
    return { status: "success" };
  }

  const payload = {
    name: readField(formData, "name"),
    company: readField(formData, "company"),
    email: readField(formData, "email"),
    phone: readField(formData, "phone"),
    topic: readField(formData, "topic"),
    message: readField(formData, "message"),
    locale,
  };

  const fieldErrors: ContactFieldErrors = {};
  if (payload.name.length < 2) fieldErrors.name = errors.name;
  if (!EMAIL_PATTERN.test(payload.email)) fieldErrors.email = errors.email;
  if (payload.message.length < 20) fieldErrors.message = errors.message;

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // Sınır bilinçli olarak doğrulamadan sonra: korunan şey e-posta gönderimi.
  // Aksi hâlde formu düzelte düzelte dolduran bir kullanıcı kilitlenirdi.
  if (await isRateLimited()) {
    return { status: "error", message: errors.tooMany };
  }

  try {
    await deliverRequest(payload);
    return { status: "success" };
  } catch (error) {
    console.error("[contact] talep iletilemedi", error);
    return { status: "error", message: errors.generic };
  }
}

type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  locale: Locale;
};

/**
 * Talebi iletir.
 *
 * `RESEND_API_KEY`, `CONTACT_INBOX` ve `CONTACT_FROM` tanımlıysa Resend API'si
 * üzerinden e-posta gönderilir. Başka bir sağlayıcı kullanmak isterseniz yalnızca
 * bu fonksiyonun gövdesini değiştirmeniz yeterlidir; doğrulama ve hata yönetimi
 * çağıran tarafta durur.
 *
 * Ortam değişkenleri tanımlı değilse talep kaybolmasın diye sunucu günlüğüne
 * yazılır ve kullanıcıya yine de onay gösterilir.
 */
async function deliverRequest(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX;
  const from = process.env.CONTACT_FROM;

  const receivedAt = new Date().toISOString();

  if (!apiKey || !to || !from) {
    console.warn(
      "[contact] E-posta gönderimi yapılandırılmamış " +
        "(RESEND_API_KEY / CONTACT_INBOX / CONTACT_FROM). Talep yalnızca günlüğe yazıldı.",
      { ...payload, receivedAt },
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `NAVIAR — yeni görüşme talebi: ${payload.name}`,
      text: [
        `Ad soyad : ${payload.name}`,
        `E-posta  : ${payload.email}`,
        `Kurum    : ${payload.company || "-"}`,
        `Telefon  : ${payload.phone || "-"}`,
        `Konu     : ${payload.topic || "-"}`,
        `Dil      : ${payload.locale}`,
        `Tarih    : ${receivedAt}`,
        "",
        "Mesaj:",
        payload.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend ${response.status} yanıtı döndü: ${detail.slice(0, 300)}`,
    );
  }
}
