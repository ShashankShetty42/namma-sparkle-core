/**
 * Namma AI · Phase-2 mission catalogue.
 *
 * Frontend-only generator: builds 8 neutral mission titles per grade,
 * drawing from the grade's `focus` themes in namma-curriculum.ts.
 *
 * No copyrighted CBSE content — themes are generic learning outcomes.
 */

import { GRADES, type GradeNumber, type CurriculumTrack } from "@/lib/namma-curriculum";

export type MissionDef = {
  index: number;                       // 1..8
  grade: GradeNumber;
  track: CurriculumTrack;
  title: string;
  focus: string;
  workbookPages: string;
  portalActivity: string;
  quizTitle: string;
  reflectionPrompt: string;
  projectPrompt: string;
};

const MISSION_TITLES: Record<CurriculumTrack, string[]> = {
  CT: [
    "Notice the Pattern",
    "Break it Into Steps",
    "Sort & Sequence",
    "Follow the Logic",
    "Hidden Clues",
    "Decide the Rule",
    "Design a Solution",
    "Show What You Learned",
  ],
  "CT+AI": [
    "What is AI?",
    "Data Around Us",
    "Patterns Machines See",
    "Teach a Model",
    "Fair or Unfair?",
    "Responsible AI",
    "AI in the Real World",
    "Build an AI Story",
  ],
};

export const MISSIONS_PER_GRADE = 8;

export function getMissionsForGrade(grade: GradeNumber): MissionDef[] {
  const g = GRADES.find((x) => x.grade === grade) ?? GRADES[GRADES.length - 1];
  const titles = MISSION_TITLES[g.track];
  return Array.from({ length: MISSIONS_PER_GRADE }, (_, i): MissionDef => {
    const idx = i + 1;
    const focus = g.focus[i % g.focus.length];
    const pageStart = 8 + (i * 8);
    return {
      index: idx,
      grade,
      track: g.track,
      title: titles[i],
      focus,
      workbookPages: `pp. ${pageStart}–${pageStart + 6}`,
      portalActivity: `Portal activity ${idx}`,
      quizTitle: `Check-in quiz ${idx}`,
      reflectionPrompt: `What did you notice about ${focus.toLowerCase()}?`,
      projectPrompt: `Create something small that shows ${focus.toLowerCase()} in action.`,
    };
  });
}

/** Parse "Grade N" → GradeNumber, clamped to 3..8. */
export function gradeLabelToNumber(label: string): GradeNumber {
  const m = label.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : 7;
  if (n <= 3) return 3;
  if (n >= 8) return 8;
  return n as GradeNumber;
}

/* ── Completion code storage (stable once generated) ── */

const CODE_KEY = "namma:mission:codes";
const isBrowser = () => typeof window !== "undefined";

function readCodes(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(CODE_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeCodes(next: Record<string, string>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CODE_KEY, JSON.stringify(next));
}

export function getOrCreateCompletionCode(
  grade: GradeNumber,
  missionIndex: number,
  studentName: string,
): string {
  const key = `g${grade}-m${missionIndex}-${studentName}`;
  const codes = readCodes();
  if (codes[key]) return codes[key];
  const initials =
    studentName
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 4) || "STDN";
  const rand = Math.floor(1000 + Math.random() * 9000);
  const code = `NAI-G${grade}-M${String(missionIndex).padStart(2, "0")}-${initials}-${rand}`;
  codes[key] = code;
  writeCodes(codes);
  return code;
}

/* Student identity used by Phase-2 student journey (local demo). */
export const SELF_SCHOOL = "self";
export const SELF_STUDENT = "me";
