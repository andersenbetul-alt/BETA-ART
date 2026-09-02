/**
 * On-device visitor affinity — the USER-side behavior system.
 *
 * Records which plates a visitor opens, in the browser's localStorage only.
 * It never leaves the device, carries no identity, and reaches no server —
 * so it stays within Beta Art's privacy stance (no behavioural analytics
 * sent anywhere). This is deliberately SEPARATE from the editor/admin
 * system: the admin (Supabase-guarded) sees catalogue records and, once a
 * backend is connected, submitted licence requests — it never sees an
 * individual visitor's browsing, because that data physically stays here.
 */

const KEY = "ba-affinity";
const CAP = 24; // don't grow unbounded

type Counts = Record<string, number>;

function read(): Counts {
  try {
    const raw = localStorage.getItem(KEY);
    const obj = raw ? (JSON.parse(raw) as unknown) : {};
    return obj && typeof obj === "object" ? (obj as Counts) : {};
  } catch {
    return {};
  }
}

function write(counts: Counts) {
  try {
    // keep only the top CAP slugs so storage can't grow without limit
    const trimmed = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, CAP);
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch {
    /* private mode / storage blocked — feature silently no-ops */
  }
}

/** Record one view of a plate. Safe to call on every plate mount. */
export function recordView(slug: string) {
  if (!slug) return;
  const counts = read();
  counts[slug] = (counts[slug] || 0) + 1;
  write(counts);
}

/**
 * Ranked slugs the visitor engaged with most, excluding `exclude`.
 * Returns [] when there is no history yet (so callers render nothing).
 */
export function topSlugs(exclude?: string, limit = 4): string[] {
  const counts = read();
  return Object.keys(counts)
    .filter((s) => (counts[s] ?? 0) > 0 && s !== exclude)
    .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
    .slice(0, limit);
}
