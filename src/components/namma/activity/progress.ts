// Lightweight localStorage-based progress tracking for Week 9 activities.
// Keeps the chain "connected" by remembering which slugs are completed.

const KEY = "namma:week9:completed";

export function getCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function markCompleted(slug: string) {
  if (typeof window === "undefined") return;
  const current = new Set(getCompleted());
  current.add(slug);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...current]));
    window.dispatchEvent(new CustomEvent("namma:progress"));
  } catch {
    // ignore quota errors
  }
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("namma:progress"));
}
