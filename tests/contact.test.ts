import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitContactForm } from "@/lib/actions";
import { initialContactState } from "@/lib/contact";
import { getDictionary } from "@/content";

// Metnin kendisine değil, hangi metnin seçildiğine bakılır. Metin yazarı
// bir cümleyi iyileştirdiğinde davranış testi kırılmamalı.
const errors = (locale: "tr" | "en") => getDictionary(locale).contact.form.errors;

// Server action `headers()` çağırıyor; test ortamında istek bağlamı yok.
// Her testin kendi istemci adresini vermesi için değiştirilebilir tutuluyor.
let clientIp = "10.0.0.1";
vi.mock("next/headers", () => ({
  headers: async () => new Map([["x-forwarded-for", clientIp]]),
}));

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

const valid = {
  locale: "tr",
  name: "Betül Andersen",
  email: "betul@ornek.com",
  company: "Örnek A.Ş.",
  message: "Organizasyon yapımızı yeniden kurgulamak istiyoruz, görüşebilir miyiz?",
};

let ipCounter = 0;

beforeEach(() => {
  // Her test taze bir adresle başlasın ki hız sınırı testler arasında sızmasın.
  clientIp = `10.0.${++ipCounter}.1`;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("doğrulama", () => {
  it("boş formu reddeder ve üç alanı da işaretler", async () => {
    const state = await submitContactForm(initialContactState, form({}));
    expect(state.status).toBe("error");
    expect(Object.keys(state.fieldErrors ?? {}).sort()).toEqual([
      "email",
      "message",
      "name",
    ]);
  });

  it("geçersiz e-posta adresini reddeder", async () => {
    for (const email of ["gecersiz", "a@b", "a b@c.com", "@ornek.com"]) {
      const state = await submitContactForm(
        initialContactState,
        form({ ...valid, email }),
      );
      expect(state.fieldErrors?.email, email).toBeTruthy();
    }
  });

  it("kısa mesajı reddeder", async () => {
    const state = await submitContactForm(
      initialContactState,
      form({ ...valid, message: "kısa" }),
    );
    expect(state.fieldErrors?.message).toBeTruthy();
  });

  it("hata mesajlarını formun dilinde döner", async () => {
    const trState = await submitContactForm(initialContactState, form({ locale: "tr" }));
    const enState = await submitContactForm(initialContactState, form({ locale: "en" }));
    expect(trState.fieldErrors?.name).toBe(errors("tr").name);
    expect(enState.fieldErrors?.name).toBe(errors("en").name);
    expect(trState.fieldErrors?.name).not.toBe(enState.fieldErrors?.name);
  });

  it("bilinmeyen dilde varsayılana düşer", async () => {
    const state = await submitContactForm(initialContactState, form({ locale: "fr" }));
    expect(state.fieldErrors?.name).toBe(errors("tr").name);
  });

  it("geçerli formu kabul eder", async () => {
    const state = await submitContactForm(initialContactState, form(valid));
    expect(state.status).toBe("success");
    expect(state.fieldErrors).toBeUndefined();
  });
});

describe("bot koruması", () => {
  // Gizli alan doldurulmuşsa bota geri bildirim vermeden sessizce yutulur.
  it("gizli alan doluysa talebi iletmez", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubEnv("RESEND_API_KEY", "test");
    vi.stubEnv("CONTACT_INBOX", "a@b.com");
    vi.stubEnv("CONTACT_FROM", "c@d.com");

    const state = await submitContactForm(
      initialContactState,
      form({ ...valid, website: "spam" }),
    );

    expect(state.status).toBe("success");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("hız sınırı", () => {
  it("dakikada üç talepten sonrasını reddeder", async () => {
    for (let i = 0; i < 3; i++) {
      const state = await submitContactForm(initialContactState, form(valid));
      expect(state.status, `${i + 1}. talep`).toBe("success");
    }

    const blocked = await submitContactForm(initialContactState, form(valid));
    expect(blocked.status).toBe("error");
    expect(blocked.message).toBe(errors("tr").tooMany);
    expect(blocked.fieldErrors).toBeUndefined();
  });

  it("farklı adresleri birbirinden etkilemez", async () => {
    for (let i = 0; i < 3; i++) {
      await submitContactForm(initialContactState, form(valid));
    }
    clientIp = "203.0.113.7";
    const other = await submitContactForm(initialContactState, form(valid));
    expect(other.status).toBe("success");
  });

  // Bot tuzağına takılan istek e-posta göndermediği için sayaca girmemeli mi
  // sorusu tasarım kararı: tuzak sınırdan önce çalışır, yani sayaca girmez.
  it("bot tuzağı hız sınırından önce çalışır", async () => {
    for (let i = 0; i < 5; i++) {
      const state = await submitContactForm(
        initialContactState,
        form({ ...valid, website: "spam" }),
      );
      expect(state.status).toBe("success");
    }
    const real = await submitContactForm(initialContactState, form(valid));
    expect(real.status).toBe("success");
  });
});

describe("e-posta gönderimi", () => {
  it("yapılandırma eksikse istek atmaz ama başarı döner", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubEnv("RESEND_API_KEY", "");

    const state = await submitContactForm(initialContactState, form(valid));
    expect(state.status).toBe("success");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("yapılandırma tamsa doğru yükü gönderir", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubEnv("RESEND_API_KEY", "anahtar");
    vi.stubEnv("CONTACT_INBOX", "gelen@naviar.com");
    vi.stubEnv("CONTACT_FROM", "bildirim@naviar.com");

    const state = await submitContactForm(initialContactState, form(valid));

    expect(state.status).toBe("success");
    expect(fetchSpy).toHaveBeenCalledOnce();

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer anahtar");

    const body = JSON.parse(init.body);
    expect(body.to).toEqual(["gelen@naviar.com"]);
    expect(body.from).toBe("bildirim@naviar.com");
    // Gelen kutusundan doğrudan başvurana yanıt verilebilmeli
    expect(body.reply_to).toBe(valid.email);
    expect(body.subject).toContain(valid.name);
    expect(body.text).toContain(valid.message);
    expect(body.text).toContain(valid.company);
  });

  // Kullanıcıya asla sahte onay gösterilmemeli.
  it("gönderim başarısızsa hata döner", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "sunucu hatası",
    }));
    vi.stubEnv("RESEND_API_KEY", "anahtar");
    vi.stubEnv("CONTACT_INBOX", "a@b.com");
    vi.stubEnv("CONTACT_FROM", "c@d.com");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const state = await submitContactForm(initialContactState, form(valid));
    expect(state.status).toBe("error");
    expect(state.message).toBeTruthy();
    expect(state.fieldErrors).toBeUndefined();
  });

  it("ağ hatasında da hata döner", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ağ koptu")));
    vi.stubEnv("RESEND_API_KEY", "anahtar");
    vi.stubEnv("CONTACT_INBOX", "a@b.com");
    vi.stubEnv("CONTACT_FROM", "c@d.com");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const state = await submitContactForm(initialContactState, form(valid));
    expect(state.status).toBe("error");
  });
});
