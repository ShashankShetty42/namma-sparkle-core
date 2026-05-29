/**
 * Namma AI · Central progression store (localStorage-backed).
 *
 * Single source of truth for:
 *  - profile identity (name, grade, avatar, favorite character, learning style, settings)
 *  - earned badges (with metadata + timestamp)
 *  - total XP (with event log)
 *  - challenge submissions (per week)
 *  - derived timeline (chronological "My AI Adventure" feed)
 *
 * All mutations dispatch the `namma:state` event so any subscriber can re-read.
 * Backward compatible with the existing `namma:week9:completed` and `namma:grade` keys.
 */

const PROFILE_KEY = "namma:profile";
const BADGES_KEY = "namma:badges";
const XP_KEY = "namma:xp";
const XP_LOG_KEY = "namma:xp:log";
const SUBMISSIONS_KEY = "namma:submissions";
const GRADE_KEY = "namma:grade";
const WEEKS_KEY = "namma:weeks:completed";
const QUIZ_KEY = "namma:quiz:results";
const ANSWERS_KEY = "namma:lesson:answers";
const CLASSMATES_KEY = "namma:classmates";
const AUTH_KEY = "namma:auth";

const isBrowser = () => typeof window !== "undefined";

export type GradeBand = "5-6" | "7-8" | "9-10";

export type NammaProfile = {
  name: string;
  gradeLabel: string;          // "Grade 7"
  gradeBand: GradeBand;        // "7-8"
  avatarColorId: string;
  avatarIconId: string;
  favorite: "neo" | "dev" | "anaya";
  learningStyle: "Visual" | "Story" | "Hands-on" | "Curious";
  theme: "light" | "dark";
  sound: boolean;
  motionFx: boolean;
  onboarded: boolean;
};

export const DEFAULT_PROFILE: NammaProfile = {
  name: "Explorer",
  gradeLabel: "Grade 7",
  gradeBand: "7-8",
  avatarColorId: "violet",
  avatarIconId: "sparkles",
  favorite: "neo",
  learningStyle: "Visual",
  theme: "light",
  sound: true,
  motionFx: true,
  onboarded: false,
};

export type BadgeRecord = {
  id: string;
  name: string;
  kind: "challenge" | "tier-unlock" | "weekly" | "milestone";
  description?: string;
  weekId?: string;
  tone?: string;
  xp?: number;
  earnedAt: number;
};

export type XpEvent = {
  id: string;
  amount: number;
  source: string;
  weekId?: string;
  at: number;
};

export type ChallengeSubmission = {
  id: string;
  weekId: string;
  title: string;
  tier: "advanced" | "expert";
  values: Record<string, unknown>;
  xp: number;
  at: number;
};

export type TimelineEvent =
  | { id: string; at: number; kind: "activity"; title: string; tone?: string; xp?: number }
  | { id: string; at: number; kind: "challenge"; title: string; tier: "advanced" | "expert"; xp: number }
  | { id: string; at: number; kind: "badge"; title: string; badgeKind: BadgeRecord["kind"]; tone?: string };

/* ───────────── events ───────────── */

const STATE_EVENT = "namma:state";
const emit = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(STATE_EVENT));
};

export function onNammaState(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(STATE_EVENT, handler);
  window.addEventListener("storage", handler);
  // legacy compat
  window.addEventListener("namma:progress", handler);
  window.addEventListener("namma:challenges", handler);
  window.addEventListener("namma:grade", handler);
  return () => {
    window.removeEventListener(STATE_EVENT, handler);
    window.removeEventListener("storage", handler);
    window.removeEventListener("namma:progress", handler);
    window.removeEventListener("namma:challenges", handler);
    window.removeEventListener("namma:grade", handler);
  };
}

/* ───────────── profile ───────────── */

export function getProfile(): NammaProfile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      // Hydrate band from legacy grade key if present
      const legacyBand = window.localStorage.getItem(GRADE_KEY);
      if (legacyBand === "5-6" || legacyBand === "7-8" || legacyBand === "9-10") {
        return { ...DEFAULT_PROFILE, gradeBand: legacyBand, gradeLabel: bandToLabel(legacyBand) };
      }
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw) as Partial<NammaProfile>;
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(next: Partial<NammaProfile>) {
  if (!isBrowser()) return;
  const merged = { ...getProfile(), ...next };
  // If gradeLabel changed but gradeBand not provided, derive it
  if (next.gradeLabel && !next.gradeBand) merged.gradeBand = labelToBand(next.gradeLabel);
  if (next.gradeBand && !next.gradeLabel) merged.gradeLabel = bandToLabel(next.gradeBand);
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  // sync legacy grade band key so weekly-challenges picks it up
  window.localStorage.setItem(GRADE_KEY, merged.gradeBand);
  window.dispatchEvent(new CustomEvent("namma:grade"));
  emit();
}

export function labelToBand(label: string): GradeBand {
  const m = label.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : 7;
  if (n <= 6) return "5-6";
  if (n <= 8) return "7-8";
  return "9-10";
}
export function bandToLabel(band: GradeBand): string {
  if (band === "5-6") return "Grade 6";
  if (band === "7-8") return "Grade 7";
  return "Grade 9";
}

/* ───────────── badges ───────────── */

export function getEarnedBadges(): BadgeRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(BADGES_KEY);
    return raw ? (JSON.parse(raw) as BadgeRecord[]) : [];
  } catch {
    return [];
  }
}

export function hasBadge(id: string): boolean {
  return getEarnedBadges().some((b) => b.id === id);
}

/** Award badge. Returns true if newly awarded, false if already owned. */
export function awardBadge(badge: Omit<BadgeRecord, "earnedAt">): boolean {
  if (!isBrowser()) return false;
  const list = getEarnedBadges();
  if (list.some((b) => b.id === badge.id)) return false;
  const next: BadgeRecord = { ...badge, earnedAt: Date.now() };
  window.localStorage.setItem(BADGES_KEY, JSON.stringify([...list, next]));
  emit();
  return true;
}

/* ───────────── XP ───────────── */

export function getTotalXP(): number {
  if (!isBrowser()) return 0;
  try {
    const raw = window.localStorage.getItem(XP_KEY);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

export function getXpLog(): XpEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(XP_LOG_KEY);
    return raw ? (JSON.parse(raw) as XpEvent[]) : [];
  } catch {
    return [];
  }
}

export function addXP(amount: number, source: string, weekId?: string) {
  if (!isBrowser() || amount <= 0) return;
  const total = getTotalXP() + amount;
  window.localStorage.setItem(XP_KEY, String(total));
  const log = getXpLog();
  const ev: XpEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    amount,
    source,
    weekId,
    at: Date.now(),
  };
  window.localStorage.setItem(XP_LOG_KEY, JSON.stringify([...log, ev].slice(-200)));
  emit();
}

/* ───────────── submissions ───────────── */

type SubmissionMap = Record<string, ChallengeSubmission>; // key: `${weekId}:${challengeId}`

function readSubmissions(): SubmissionMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as SubmissionMap) : {};
  } catch {
    return {};
  }
}

export function getSubmissions(): ChallengeSubmission[] {
  return Object.values(readSubmissions()).sort((a, b) => b.at - a.at);
}

export function getSubmission(weekId: string, id: string): ChallengeSubmission | null {
  return readSubmissions()[`${weekId}:${id}`] ?? null;
}

export function saveSubmission(sub: Omit<ChallengeSubmission, "at"> & { at?: number }) {
  if (!isBrowser()) return;
  const map = readSubmissions();
  map[`${sub.weekId}:${sub.id}`] = { ...sub, at: sub.at ?? Date.now() };
  window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(map));
  emit();
}

/* ───────────── timeline ───────────── */

const ACTIVITY_TITLES: Record<string, { title: string; tone: string; xp: number }> = {
  "story-concept": { title: "Story & Concept", tone: "story", xp: 120 },
  "explore-observe": { title: "Explore & Observe", tone: "explore", xp: 90 },
  "do-decide": { title: "Do & Decide", tone: "decide", xp: 110 },
  "think-write": { title: "Think & Write", tone: "reflect", xp: 100 },
  "ethics-scenario": { title: "Ethics Scenario", tone: "challenge", xp: 130 },
  "weekly-quiz": { title: "Weekly Quiz", tone: "xp", xp: 150 },
};

export function getTimeline(completedSlugs: string[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // activities
  completedSlugs.forEach((slug, i) => {
    const meta = ACTIVITY_TITLES[slug] ?? { title: slug, tone: "story", xp: 100 };
    events.push({
      id: `act-${slug}`,
      at: Date.now() - (completedSlugs.length - i) * 60_000,
      kind: "activity",
      title: meta.title,
      tone: meta.tone,
      xp: meta.xp,
    });
  });

  // challenge submissions
  getSubmissions().forEach((s) => {
    events.push({
      id: `sub-${s.weekId}-${s.id}`,
      at: s.at,
      kind: "challenge",
      title: s.title,
      tier: s.tier,
      xp: s.xp,
    });
  });

  // badges
  getEarnedBadges().forEach((b) => {
    events.push({
      id: `badge-${b.id}`,
      at: b.earnedAt,
      kind: "badge",
      title: b.name,
      badgeKind: b.kind,
      tone: b.tone,
    });
  });

  return events.sort((a, b) => b.at - a.at);
}

/* ───────────── weekly streak ───────────── */

export function getCompletedWeeks(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(WEEKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Mark a week as completed (idempotent). Returns true if newly added. */
export function markWeekComplete(weekId: string): boolean {
  if (!isBrowser()) return false;
  const weeks = getCompletedWeeks();
  if (weeks.includes(weekId)) return false;
  const next = [...weeks, weekId];
  window.localStorage.setItem(WEEKS_KEY, JSON.stringify(next));
  emit();
  return true;
}

export function getWeeklyStreak(): number {
  // Streak = consecutive completed weeks count
  return getCompletedWeeks().length;
}

/* ───────────── quiz results ───────────── */

type QuizResults = Record<string, { correct: boolean; at: number; attempts: number }>;

function readQuizResults(): QuizResults {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_KEY);
    return raw ? (JSON.parse(raw) as QuizResults) : {};
  } catch {
    return {};
  }
}

/** Record a quiz answer. Awards XP once per cardId when first correct. */
export function recordQuiz(slug: string, cardId: string, correct: boolean, xp = 20) {
  if (!isBrowser()) return;
  const map = readQuizResults();
  const key = `${slug}:${cardId}`;
  const prev = map[key];
  const wasCorrect = prev?.correct === true;
  map[key] = {
    correct: correct || wasCorrect,
    at: Date.now(),
    attempts: (prev?.attempts ?? 0) + 1,
  };
  window.localStorage.setItem(QUIZ_KEY, JSON.stringify(map));
  if (correct && !wasCorrect && xp > 0) addXP(xp, `Quiz · ${cardId}`, slug);
  emit();
}

export function getQuizStats() {
  const map = readQuizResults();
  const all = Object.values(map);
  return {
    answered: all.length,
    correct: all.filter((q) => q.correct).length,
  };
}

/* ───────────── lesson answers (decide/reflect/spot) ───────────── */

type AnswerMap = Record<string, { value: string; at: number }>;

function readAnswers(): AnswerMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as AnswerMap) : {};
  } catch {
    return {};
  }
}

export function saveLessonAnswer(slug: string, cardId: string, value: string) {
  if (!isBrowser() || !value) return;
  const map = readAnswers();
  map[`${slug}:${cardId}`] = { value, at: Date.now() };
  window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(map));
  emit();
}

export function getLessonAnswer(slug: string, cardId: string): string | null {
  return readAnswers()[`${slug}:${cardId}`]?.value ?? null;
}

/* ───────────── activity completion reward ───────────── */

/** Award the XP + badge for finishing an activity (idempotent per slug). */
export function rewardActivity(slug: string, meta: {
  title: string;
  badge: string;
  xp: number;
  tone?: string;
  weekId?: string;
}) {
  const badgeId = `activity:${meta.weekId ?? "week"}:${slug}`;
  const isNew = awardBadge({
    id: badgeId,
    name: meta.badge,
    kind: "weekly",
    weekId: meta.weekId,
    tone: meta.tone,
    xp: meta.xp,
    description: `Completed ${meta.title}`,
  });
  if (isNew) addXP(meta.xp, `Activity · ${meta.title}`, meta.weekId);
  return isNew;
}

/* ───────────── classmates (leaderboard) ───────────── */

export type Classmate = { id: string; name: string; xp: number };

export function getClassmates(): Classmate[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CLASSMATES_KEY);
    return raw ? (JSON.parse(raw) as Classmate[]) : [];
  } catch {
    return [];
  }
}

export function saveClassmates(list: Classmate[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CLASSMATES_KEY, JSON.stringify(list));
  emit();
}

/* ───────────── auth (frontend-only demo) ───────────── */

export type UserRole = "student" | "teacher" | "admin";

export type NammaAuth = {
  isAuthed: boolean;
  role: UserRole | null;
  email: string | null;
  schoolCode: string | null;
  signedInAt: number | null;
};

export const DEFAULT_AUTH: NammaAuth = {
  isAuthed: false,
  role: null,
  email: null,
  schoolCode: null,
  signedInAt: null,
};

export function getAuth(): NammaAuth {
  if (!isBrowser()) return DEFAULT_AUTH;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return DEFAULT_AUTH;
    return { ...DEFAULT_AUTH, ...(JSON.parse(raw) as Partial<NammaAuth>) };
  } catch {
    return DEFAULT_AUTH;
  }
}

export function signIn(payload: {
  role: UserRole;
  email: string;
  schoolCode?: string;
}) {
  if (!isBrowser()) return;
  const next: NammaAuth = {
    isAuthed: true,
    role: payload.role,
    email: payload.email,
    schoolCode: payload.schoolCode ?? null,
    signedInAt: Date.now(),
  };
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  emit();
}

export function signOut() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem("namma:welcome:lastSession");
  emit();
}

/* ───────────── per-student onboarding tracking ───────────── */

const ONBOARDED_STUDENTS_KEY = "namma:onboarded:students";

function readOnboardedSet(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ONBOARDED_STUDENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function studentOnboardKey(schoolCode: string, studentId: string) {
  return `${schoolCode}:${studentId}`.toLowerCase();
}

export function hasStudentOnboarded(schoolCode: string, studentId: string): boolean {
  return readOnboardedSet().includes(studentOnboardKey(schoolCode, studentId));
}

export function markStudentOnboarded(schoolCode: string, studentId: string) {
  if (!isBrowser()) return;
  const key = studentOnboardKey(schoolCode, studentId);
  const list = readOnboardedSet();
  if (list.includes(key)) return;
  window.localStorage.setItem(
    ONBOARDED_STUDENTS_KEY,
    JSON.stringify([...list, key]),
  );
  emit();
}

