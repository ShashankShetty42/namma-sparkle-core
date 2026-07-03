/**
 * Namma AI · CT & AI curriculum structure (Grades 3–8).
 *
 * Frontend-only stub. Shapes are Supabase-ready for a later migration.
 * No copyrighted CBSE content — only neutral tracking scaffolding.
 */

export type GradeNumber = 3 | 4 | 5 | 6 | 7 | 8;
export type CurriculumTrack = "CT" | "CT+AI";

export type GradeDefinition = {
  grade: GradeNumber;
  label: string;              // "Grade 3"
  track: CurriculumTrack;
  focus: string[];            // themes, not copied CBSE content
  weeksPerYear: number;
};

export const GRADES: GradeDefinition[] = [
  {
    grade: 3,
    label: "Grade 3",
    track: "CT",
    focus: ["Observation", "Patterns", "Sequences", "Simple steps", "Sorting", "Logic"],
    weeksPerYear: 32,
  },
  {
    grade: 4,
    label: "Grade 4",
    track: "CT",
    focus: ["Multi-step reasoning", "Symmetry", "Transformations", "Ordering", "Decomposition"],
    weeksPerYear: 32,
  },
  {
    grade: 5,
    label: "Grade 5",
    track: "CT",
    focus: ["Deduction", "Hidden information", "Condition-based reasoning", "Data thinking"],
    weeksPerYear: 32,
  },
  {
    grade: 6,
    label: "Grade 6",
    track: "CT+AI",
    focus: ["AI basics", "Data", "Pattern recognition", "Decision making", "Digital responsibility"],
    weeksPerYear: 32,
  },
  {
    grade: 7,
    label: "Grade 7",
    track: "CT+AI",
    focus: ["AI domains", "Data visualization", "Industry applications", "Bias & fairness"],
    weeksPerYear: 32,
  },
  {
    grade: 8,
    label: "Grade 8",
    track: "CT+AI",
    focus: ["AI project lifecycle", "Fairness", "Responsible AI", "No-code tools", "Applications"],
    weeksPerYear: 32,
  },
];

/* Phase-2 structures — declared now so screens can plug in later. */

export type MissionStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "submitted"
  | "approved"
  | "completed";

export type Mission = {
  id: string;                       // "g6-m03"
  grade: GradeNumber;
  weekNumber: number;
  title: string;                    // original placeholder title
  workbookPages?: string;           // "pp. 22–28" — generic label only
  portalActivitySlug?: string;      // Phase 2
  quizId?: string;
  reflectionId?: string;
  projectId?: string;
  badgeId?: string;
  status: MissionStatus;
};

export type ActivityCategory =
  | "computational-thinking"
  | "ai-literacy"
  | "reflection"
  | "project"
  | "gamified";

/** Phase-2 unique completion code, e.g. NAI-G6-M03-ARAV-4821. */
export function makeCompletionCode(
  grade: GradeNumber,
  missionIndex: number,
  studentName: string,
): string {
  const initials =
    studentName
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 4) || "STDN";
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NAI-G${grade}-M${String(missionIndex).padStart(2, "0")}-${initials}-${rand}`;
}
