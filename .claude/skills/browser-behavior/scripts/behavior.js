/**
 * Browser-only "customer behaviour" core — no backend, no third-party
 * tracker, no cross-visitor data. Everything lives in the visitor's own
 * localStorage. Copy this file (or port its four functions) into the
 * target site and wire your own event names into `track()`.
 *
 * Why this shape:
 * - `counts` is a flat map of arbitrary string keys → hit count. Callers
 *   namespace their own events with a prefix ("category:", "tier:",
 *   "section:", "cta:") so `topByPrefix()` can find "the most-clicked
 *   thing in this group" without the module knowing your domain.
 * - Visits are counted once per browser tab session (sessionStorage flag),
 *   not once per page load, so a single visit across multiple pages of
 *   the same site doesn't inflate the count.
 * - Every read/write is wrapped in try/catch: private browsing, disabled
 *   storage, or a full quota must degrade to "no personalisation shown",
 *   never throw and break the page.
 */

const STORE_KEY = 'site_behavior_v1'; // rename per project if you run several on one origin

export function loadBehavior() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* private mode / storage disabled */ }
  return { visits: 0, lastVisit: null, counts: {} };
}

export function saveBehavior(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch { /* ignore */ }
}

export function track(key) {
  const state = loadBehavior();
  state.counts[key] = (state.counts[key] || 0) + 1;
  saveBehavior(state);
}

export function topByPrefix(prefix) {
  const state = loadBehavior();
  let best = null;
  for (const [key, count] of Object.entries(state.counts)) {
    if (key.startsWith(prefix) && (!best || count > best.count)) {
      best = { value: key.slice(prefix.length), count };
    }
  }
  return best;
}

export function resetBehavior() {
  try {
    localStorage.removeItem(STORE_KEY);
    sessionStorage.removeItem('site_behavior_counted');
  } catch { /* ignore */ }
}

/** Call once near the top of every page. Returns the running visit count. */
export function countVisit() {
  const state = loadBehavior();
  try {
    if (!sessionStorage.getItem('site_behavior_counted')) {
      state.visits += 1;
      state.lastVisit = Date.now();
      saveBehavior(state);
      sessionStorage.setItem('site_behavior_counted', '1');
    }
  } catch { /* ignore */ }
  return state.visits;
}
