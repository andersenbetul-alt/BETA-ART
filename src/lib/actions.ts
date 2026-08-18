"use server";

import { getDictionary } from "@/content";
import { defaultLocale, isLocale, type Locale } from "./i18n";
import type { ContactFieldErrors, ContactState } from "./contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
