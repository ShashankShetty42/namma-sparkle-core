/**
 * Namma AI · Student completion store (localStorage-backed).
 *
 * Per-mission tracker with six phases matching the CT & AI implementation model:
 *   workbook | portal | quiz | reflection | project | approval
 *
 * A single record is keyed by (school_id, student_id, grade, missionIndex).
 * The current Phase 1 stub uses 8 missions per grade so principals and
 * teachers can visualise term progress without any backend.
 *
 * Emits `namma:completion` whenever anything changes.
 */

export const COMPLETION_PHASES = [
  "workbook",
  "portal",
  "quiz",
  "reflection",
  "project",
  "approval",
] as const;

export type CompletionPhase = (typeof COMPLETION_PHASES)[number];

export type CompletionState = Record<CompletionPhase, boolean>;

export const MISSIONS_PER_GRADE = 8;

const KEY = "namma:completion";
const EVENT = "namma:completion";
const isBrowser = () => typeof window !== "undefined";

type StoreShape = Record<string, CompletionState>; // key = school:student:grade:mission

function emit() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onCompletionState(cb: () => void) {
  if (!isBrowser()) return () => {};
  const h = () => cb();
  window.addEventListener(EVENT, h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener(EVENT, h);
    window.removeEventListener("storage", h);
  };
}

function read(): StoreShape {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoreShape) : {};
  } catch {
    return {};
  }
}
function write(next: StoreShape) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

function keyOf(schoolId: string, studentId: string, grade: string, missionIndex: number) {
  return `${schoolId}::${studentId}::${grade}::m${missionIndex}`;
}

const EMPTY_STATE: CompletionState = {
  workbook: false,
  portal: false,
  quiz: false,
  reflection: false,
  project: false,
  approval: false,
};

export function getCompletion(
  schoolId: string,
  studentId: string,
  grade: string,
  missionIndex: number,
): CompletionState {
  const store = read();
  return { ...EMPTY_STATE, ...(store[keyOf(schoolId, studentId, grade, missionIndex)] ?? {}) };
}

export function setPhase(
  schoolId: string,
  studentId: string,
  grade: string,
  missionIndex: number,
  phase: CompletionPhase,
  value: boolean,
) {
  const store = read();
  const k = keyOf(schoolId, studentId, grade, missionIndex);
  const current = { ...EMPTY_STATE, ...(store[k] ?? {}) };
  current[phase] = value;
  store[k] = current;
  write(store);
}

export function togglePhase(
  schoolId: string,
  studentId: string,
  grade: string,
  missionIndex: number,
  phase: CompletionPhase,
) {
  const now = getCompletion(schoolId, studentId, grade, missionIndex);
  setPhase(schoolId, studentId, grade, missionIndex, phase, !now[phase]);
}

/** % of phases completed across all missions for one student. */
export function studentPercent(
  schoolId: string,
  studentId: string,
  grade: string,
  missions: number = MISSIONS_PER_GRADE,
): number {
  const store = read();
  let done = 0;
  const total = missions * COMPLETION_PHASES.length;
  for (let i = 1; i <= missions; i++) {
    const state = store[keyOf(schoolId, studentId, grade, i)];
    if (!state) continue;
    for (const p of COMPLETION_PHASES) if (state[p]) done++;
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** Approved (fully verified) missions for one student. */
export function studentApprovedCount(
  schoolId: string,
  studentId: string,
  grade: string,
  missions: number = MISSIONS_PER_GRADE,
): number {
  const store = read();
  let n = 0;
  for (let i = 1; i <= missions; i++) {
    const state = store[keyOf(schoolId, studentId, grade, i)];
    if (state?.approval) n++;
  }
  return n;
}
