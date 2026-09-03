/**
 * Maps the canonical English catalogue enum strings (from data/collection.ts)
 * to their i18n keys, so components can translate them without changing the
 * structural data. Unmapped values fall back to the raw string via t().
 */
export const AUD_KEY: Record<string, string> = {
  "Private, non-commercial use only": "cat.aud.private",
  "Business use": "cat.aud.business",
};

export const VER_KEY: Record<string, string> = {
  "Awaiting verified original": "cat.ver.status",
  "Not provided": "cat.ver.notprovided",
  "Available on licensing": "cat.ver.signed",
};

/** Placeholder catalogue values (verification + capture fields) → i18n keys. */
export const VAL_KEY: Record<string, string> = {
  ...VER_KEY,
  "To be supplied": "ui.val.tbd",
};
