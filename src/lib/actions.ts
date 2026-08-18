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
 * İletişim formunu doğrular ve talebi kaydeder.
 *
 * NOT: Şu an talep yalnızca sunucu günlüğüne yazılıyor. Canlıya çıkmadan önce
 * `deliverRequest` içindeki bölümü bir e-posta servisine (Resend, SendGrid,
 * Postmark vb.) veya CRM entegrasyonuna bağlayın.
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

async function deliverRequest(payload: ContactPayload): Promise<void> {
  // TODO: Buraya e-posta gönderimi veya CRM kaydı eklenecek.
  console.info("[contact] yeni talep", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}
