import type { JobId } from "./jobs";
import type { PracticeId } from "./practices";
import type { ArticleId } from "./articles";

export type Link = { label: string; href: string };

export type Article = {
  title: string;
  /** Listede ve meta açıklamasında kullanılır */
  excerpt: string;
  /** Yazının gövdesi */
  sections: TextSection[];
  /** Kapanış cümlesi — okuyucuya ne yapması gerektiğini söyler */
  takeaway: string;
};

export type Job = {
  title: string;
  team: string;
  type: string;
  location: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  bonus: string[];
};

export type Feature = {
  title: string;
  description: string;
};

export type Practice = {
  id: PracticeId;
  eyebrow: string;
  title: string;
  summary: string;
  /** Hizmet kalemleri */
  offerings: Feature[];
  /** Müşterinin elde ettiği somut çıktılar */
  outcomes: string[];
};

export type TextSection = {
  title: string;
  paragraphs: string[];
  /** İsteğe bağlı madde listesi */
  bullets?: string[];
};

export type Phase = {
  step: string;
  title: string;
  description: string;
  activities: string[];
};

export type Dictionary = {
  meta: {
    siteName: string;
    tagline: string;
    description: string;
    localeLabel: string;
    switchLabel: string;
    htmlLang: string;
  };
  nav: Record<
    "services" | "approach" | "insights" | "about" | "careers" | "contact",
    string
  >;
  actions: {
    contact: string;
    services: string;
    approach: string;
    readMore: string;
    backHome: string;
    skipToContent: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      highlight: string;
      description: string;
    };
    pillars: { title: string; items: Feature[] };
    practices: { eyebrow: string; title: string; description: string };
    approach: { eyebrow: string; title: string; description: string };
    why: { eyebrow: string; title: string; items: Feature[] };
    insights: { eyebrow: string; title: string; description: string; all: string };
    cta: { title: string; description: string };
  };
  services: {
    hero: { eyebrow: string; title: string; description: string };
    practices: Practice[];
    outcomesLabel: string;
    engagement: {
      title: string;
      description: string;
      models: Feature[];
    };
  };
  approach: {
    hero: { eyebrow: string; title: string; description: string };
    phases: Phase[];
    principles: { title: string; items: Feature[] };
  };
  about: {
    hero: { eyebrow: string; title: string; description: string };
    story: { title: string; paragraphs: string[] };
    mission: { title: string; description: string };
    vision: { title: string; description: string };
    values: { title: string; items: Feature[] };
    team: { title: string; description: string; roles: Feature[] };
  };
  contact: {
    hero: { eyebrow: string; title: string; description: string };
    details: {
      title: string;
      email: { label: string; value: string };
      phone: { label: string; value: string };
      address: { label: string; value: string };
      hours: { label: string; value: string };
    };
    form: {
      title: string;
      description: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      phoneOptional: string;
      topic: string;
      topicPlaceholder: string;
      topicOptions: string[];
      message: string;
      submit: string;
      submitting: string;
      consent: string;
      privacyLinkLabel: string;
      success: string;
      errors: {
        name: string;
        email: string;
        message: string;
        generic: string;
      };
    };
  };
  insights: {
    hero: { eyebrow: string; title: string; description: string };
    labels: {
      readingTime: string;
      published: string;
      backToList: string;
      related: string;
      cta: { title: string; description: string };
    };
    /** Her yazı iki dilde de tanımlanmak zorundadır */
    articles: Record<ArticleId, Article>;
  };
  careers: {
    hero: { eyebrow: string; title: string; description: string };
    culture: { title: string; description: string; items: Feature[] };
    process: { title: string; description: string; steps: Phase[] };
    openings: {
      eyebrow: string;
      title: string;
      description: string;
      viewJob: string;
    };
    /** İlan detay sayfasındaki etiketler */
    labels: {
      team: string;
      type: string;
      location: string;
      experience: string;
      responsibilities: string;
      requirements: string;
      bonus: string;
      backToList: string;
      apply: string;
      applyDescription: string;
      applyEmail: string;
      /** E-posta konu satırında ilan başlığından sonra gelen ek */
      applySubjectSuffix: string;
    };
    /** Her ilan iki dilde de tanımlanmak zorundadır */
    jobs: Record<JobId, Job>;
    openApplication: { title: string; description: string; action: string };
  };
  privacy: {
    hero: { eyebrow: string; title: string; description: string };
    updated: string;
    sections: TextSection[];
    disclaimer: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  footer: {
    about: string;
    navTitle: string;
    contactTitle: string;
    legal: string;
    privacyLink: string;
    rights: string;
  };
};
