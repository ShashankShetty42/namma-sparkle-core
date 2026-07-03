/**
 * Namma AI · Evidence store (localStorage-backed).
 *
 * A single evidence item is a small artefact attached to a student's mission:
 *   photo · worksheet · quote · artefact · link
 *
 * Photos/worksheets are stored as data URLs so the demo runs entirely
 * client-side; the shape is Supabase-ready (swap dataUrl → storage URL later).
 *
 * Emits `namma:evidence` on every mutation.
 */

export const EVIDENCE_TYPES = ["photo", "worksheet", "quote", "artefact", "link"] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export type EvidenceItem = {
  id: string;
  school_id: string;
  student_id: string;
  student_name: string;
  grade: string;
  missionIndex: number;
  type: EvidenceType;
  title: string;
  note?: string;
  dataUrl?: string;     // photo / worksheet
  url?: string;         // external link
  captured_by: string;  // teacher email or "student"
  captured_at: number;
};

const KEY = "namma:evidence";
const EVENT = "namma:evidence";
const isBrowser = () => typeof window !== "undefined";

function emit() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onEvidenceState(cb: () => void) {
  if (!isBrowser()) return () => {};
  const h = () => cb();
  window.addEventListener(EVENT, h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener(EVENT, h);
    window.removeEventListener("storage", h);
  };
}

function read(): EvidenceItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EvidenceItem[]) : [];
  } catch {
    return [];
  }
}
function write(list: EvidenceItem[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  emit();
}

export function listEvidence(filter?: { school_id?: string; grade?: string }) {
  let list = read();
  if (filter?.school_id) list = list.filter((e) => e.school_id === filter.school_id);
  if (filter?.grade) list = list.filter((e) => e.grade === filter.grade);
  return list.sort((a, b) => b.captured_at - a.captured_at);
}

export function addEvidence(
  input: Omit<EvidenceItem, "id" | "captured_at">,
): { ok: true; id: string } | { ok: false; error: string } {
  if (!input.title.trim()) return { ok: false, error: "A short title is required." };
  if (!input.school_id) return { ok: false, error: "Missing school." };
  if (!input.student_id) return { ok: false, error: "Choose a student." };
  if (input.type === "link" && !input.url) return { ok: false, error: "Paste a link URL." };
  if ((input.type === "photo" || input.type === "worksheet") && !input.dataUrl) {
    return { ok: false, error: "Attach a file." };
  }
  const list = read();
  const id = `ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  list.push({ ...input, id, captured_at: Date.now() });
  write(list);
  return { ok: true, id };
}

export function deleteEvidence(id: string) {
  write(read().filter((e) => e.id !== id));
}

/** Read a File as data URL (returns null on failure or oversize). */
export async function fileToDataUrl(file: File, maxBytes = 1_500_000): Promise<string | null> {
  if (file.size > maxBytes) return null;
  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) ?? null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
