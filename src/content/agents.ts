/**
 * AI Workforce ürününde kurulan yapay zekâ ajanları.
 *
 * Kimlikler dilden bağımsızdır ve URL parçası olarak kullanılır.
 * Bağlanılan sistemler ürün adı olduğu için sözlükte değil burada durur.
 */
export const agentIds = [
  "receptionist",
  "email",
  "customer-service",
  "sales",
  "research",
  "content",
  "meeting",
  "admin",
] as const;

export type AgentId = (typeof agentIds)[number];

export type AgentMeta = {
  /** Ajanın bağlandığı tipik sistemler */
  systems: string[];
  /**
   * Kurulum zorluğu. Sıralama ve beklenti yönetimi için kullanılır;
   * "kolay" olanlar pilot için önerilir.
   */
  effort: "dusuk" | "orta" | "yuksek";
};

export const agentMeta: Record<AgentId, AgentMeta> = {
  receptionist: {
    systems: ["Telefon santrali", "WhatsApp Business", "Takvim"],
    effort: "yuksek",
  },
  email: {
    systems: ["Gmail", "Outlook", "IMAP"],
    effort: "dusuk",
  },
  "customer-service": {
    systems: ["Zendesk", "Intercom", "WhatsApp Business", "E-posta"],
    effort: "orta",
  },
  sales: {
    systems: ["HubSpot", "Pipedrive", "Salesforce", "LinkedIn"],
    effort: "orta",
  },
  research: {
    systems: ["Web", "PDF arşivi", "Google Drive", "Notion"],
    effort: "dusuk",
  },
  content: {
    systems: ["WordPress", "Notion", "Google Docs", "LinkedIn"],
    effort: "dusuk",
  },
  meeting: {
    systems: ["Google Meet", "Zoom", "Teams", "Takvim"],
    effort: "dusuk",
  },
  admin: {
    systems: ["Google Workspace", "Logo/Mikro", "Excel", "Takvim"],
    effort: "yuksek",
  },
};

/** Pilot için önerilen sıra: önce düşük eforlu, hızlı kanıt verenler. */
export const pilotOrder: AgentId[] = [
  "email",
  "meeting",
  "research",
  "content",
  "customer-service",
  "sales",
  "receptionist",
  "admin",
];
