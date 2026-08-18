/**
 * İletişim formunun paylaşılan tipleri ve başlangıç durumu.
 *
 * Bu dosya bilerek `actions.ts`ten ayrıdır: `"use server"` işaretli bir dosya
 * yalnızca async fonksiyon dışa aktarabilir, sabit veya nesne aktaramaz.
 */
export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "message", string>
>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
};

export const initialContactState: ContactState = { status: "idle" };
