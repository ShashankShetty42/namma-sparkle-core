/**
 * Namma AI · Academic-Year Implementation Tracker.
 *
 * Source of truth for academic-year config, implementation modes,
 * tracking windows, backfill periods and derived demo metrics.
 *
 * Replaces the earlier fixed "35-week tracker" assumption: schools joining
 * mid-year use month-first tracking with an optional backfill period.
 */

export type ImplementationMode =
  | "full-year"
  | "mid-year"
  | "backfill-audit";

export type ImplementationStatus =
  | "not-started"
  | "started-untracked"
  | "partially-implemented"
  | "some-grades"
  | "evidence-scattered"
  | "backfill-needed"
  | "current-month-only";

export type BackfillPreference =
  | "none"
  | "summary"
  | "detailed"
  | "later";

export type AcademicMonth =
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December"
  | "January"
  | "February"
  | "March";

export const ACADEMIC_MONTHS: AcademicMonth[] = [
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

export const ACADEMIC_YEARS = ["2026–27", "2027–28", "2028–29"] as const;

export const IMPLEMENTATION_MODES: {
  id: ImplementationMode;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  features: string[];
}[] = [
  {
    id: "full-year",
    name: "Full-Year Mode",
    tagline: "Best for schools starting in April/June",
    description:
      "Track the complete academic year from the beginning with weekly planning, workbook tracking, projects, evidence, reports and certificates.",
    bestFor: "2027–28 full launch",
    features: [
      "Full academic-year roadmap",
      "Week 1 to Week 35 optional structure",
      "Complete yearly tracking",
      "Student progress",
      "Teacher updates",
      "Project tracking",
      "Evidence portfolio",
      "Monthly and annual reports",
    ],
  },
  {
    id: "mid-year",
    name: "Mid-Year Tracking Mode",
    tagline: "Recommended for schools joining during 2026–27",
    description:
      "Start tracking from the current month without forcing schools to recreate the full year from Week 1.",
    bestFor: "2026–27 current year",
    features: [
      "Set onboarding month",
      "Set active tracking period",
      "Track only remaining academic months",
      "Mark previous months as optional backfill",
      "Show current implementation stage",
      "Workbook tracking from now onward",
      "Project & evidence from now onward",
      "Monthly reports",
    ],
  },
  {
    id: "backfill-audit",
    name: "Backfill / Audit Mode",
    tagline: "For late adopters preparing stronger implementation next year",
    description:
      "Document what has already been implemented, identify missing records and generate an implementation gap report.",
    bestFor: "Schools that already teach CT & AI without proper tracking",
    features: [
      "Enter what was already completed",
      "Grade-wise implementation status",
      "Upload existing evidence",
      "Teacher confirmations",
      "Retroactive workbook completion",
      "Project evidence backfill",
      "Gap identification",
      "Gap analysis report",
    ],
  },
];

/* ─────────── Live demo setup (Namma Vidya Public School) ─────────── */

export const ACADEMIC_SETUP = {
  schoolName: "Namma Vidya Public School",
  city: "Bengaluru",
  academicYear: "2026–27",
  academicStart: "June 2026" as const,
  academicEnd: "March 2027" as const,
  onboardingMonth: "October 2026" as const,
  onboardingMonthShort: "October" as AcademicMonth,
  currentMode: "mid-year" as ImplementationMode,
  currentModeLabel: "Mid-Year Tracking + Optional Backfill",
  activeWindow: "October 2026 – March 2027",
  backfillPeriod: "June 2026 – September 2026",
  trackingCoverageMonths: 6,
  backfillStatus: "Summary pending",
  gradesCovered: ["3", "4", "5", "6", "7", "8"],
  studentsCovered: 384,
  teachers: 14,
  classes: 12,
  currentMonth: "October" as AcademicMonth,
  currentMonthYear: "October 2026",
  currentPeriodLabel: "October Week 2",
  nextAcademicYear: "2027–28",
};

export const ACADEMIC_METRICS = {
  trackingCoveragePct: 60, // % of academic year remaining
  backfillCompletionPct: 35,
  activeTrackingProgressPct: 72,
  evidenceReadinessPct: 61,
  preOnboardingEvidencePct: 42,
  activeEvidencePct: 72,
  readinessNextYearPct: 64,
  gapSeverity: "Medium Risk" as const,
  evidenceGapItems: 26,
  missingReports: ["July 2026", "August 2026"],
  strongestGrade: "Grade 3",
  weakestGrade: "Grade 7",
};

/* ─────────── Academic-year timeline segments ─────────── */

export type TimelineSegmentTone = "past" | "active" | "future";

export const TIMELINE_SEGMENTS: {
  id: string;
  title: string;
  range: string;
  label: string;
  tone: TimelineSegmentTone;
}[] = [
  {
    id: "before",
    title: "Completed Before Namma AI",
    range: "June – September 2026",
    label: "Backfill Optional",
    tone: "past",
  },
  {
    id: "active",
    title: "Active Tracking Period",
    range: "October 2026 – March 2027",
    label: "Tracking Active",
    tone: "active",
  },
  {
    id: "next",
    title: "Next Academic Year",
    range: "2027–28",
    label: "Full-Year Mode Available",
    tone: "future",
  },
];

/* ─────────── Gap analysis rows ─────────── */

export type GapSeverity = "Low" | "Medium" | "High" | "Critical";

export type GapRow = {
  grade: string;
  section: string;
  missingWorkbook: number;
  missingUpdates: string;
  missingProjects: number | "N/A";
  missingObservations: number;
  missingReports: string[];
  severity: GapSeverity;
  action: string;
};

export const GAP_ROWS: GapRow[] = [
  {
    grade: "Grade 7",
    section: "7B",
    missingWorkbook: 18,
    missingUpdates: "2 months",
    missingProjects: 14,
    missingObservations: 21,
    missingReports: ["July", "August"],
    severity: "High",
    action: "Backfill summary and schedule project review",
  },
  {
    grade: "Grade 6",
    section: "6A",
    missingWorkbook: 9,
    missingUpdates: "1 month",
    missingProjects: 6,
    missingObservations: 12,
    missingReports: ["August"],
    severity: "Medium",
    action: "Add teacher confirmation and upload project evidence",
  },
  {
    grade: "Grade 8",
    section: "8B",
    missingWorkbook: 14,
    missingUpdates: "2 months",
    missingProjects: 11,
    missingObservations: 18,
    missingReports: ["July", "August", "September"],
    severity: "Critical",
    action: "Full backfill required · assign lead teacher",
  },
  {
    grade: "Grade 5",
    section: "5A",
    missingWorkbook: 3,
    missingUpdates: "1 month",
    missingProjects: 2,
    missingObservations: 4,
    missingReports: ["August"],
    severity: "Low",
    action: "Add summary confirmation",
  },
  {
    grade: "Grade 4",
    section: "4B",
    missingWorkbook: 5,
    missingUpdates: "1 month",
    missingProjects: "N/A",
    missingObservations: 7,
    missingReports: ["September"],
    severity: "Low",
    action: "Add summary confirmation",
  },
  {
    grade: "Grade 3",
    section: "3A",
    missingWorkbook: 4,
    missingUpdates: "1 month",
    missingProjects: "N/A",
    missingObservations: 6,
    missingReports: ["August"],
    severity: "Low",
    action: "Add summary confirmation",
  },
];

/* ─────────── Backfill month table ─────────── */

export type BackfillStatus =
  | "Not Started"
  | "In Progress"
  | "Summary Complete"
  | "Detailed Complete"
  | "Evidence Missing";

export const BACKFILL_MONTHS: {
  month: string;
  workbook: string;
  teacherConfirmation: string;
  projectEvidence: string;
  observationSummary: string;
  evidenceUploaded: string;
  status: BackfillStatus;
}[] = [
  {
    month: "June 2026",
    workbook: "Summary added",
    teacherConfirmation: "12 / 14",
    projectEvidence: "Not applicable",
    observationSummary: "Complete",
    evidenceUploaded: "18 items",
    status: "Summary Complete",
  },
  {
    month: "July 2026",
    workbook: "In progress",
    teacherConfirmation: "6 / 14",
    projectEvidence: "Pending",
    observationSummary: "Partial",
    evidenceUploaded: "9 items",
    status: "In Progress",
  },
  {
    month: "August 2026",
    workbook: "Pending",
    teacherConfirmation: "2 / 14",
    projectEvidence: "Missing",
    observationSummary: "Not added",
    evidenceUploaded: "3 items",
    status: "Evidence Missing",
  },
  {
    month: "September 2026",
    workbook: "Not started",
    teacherConfirmation: "0 / 14",
    projectEvidence: "Missing",
    observationSummary: "Not added",
    evidenceUploaded: "0 items",
    status: "Not Started",
  },
];

/* ─────────── Certificate eligibility types ─────────── */

export const CERTIFICATE_TYPES = [
  {
    id: "mid-year-participation",
    name: "Mid-Year Participation Certificate",
    basis: "Active tracking period completion",
    availableIn: ["mid-year", "backfill-audit"],
  },
  {
    id: "implementation-evidence",
    name: "Implementation Evidence Certificate",
    basis: "Teacher-approved participation and project evidence",
    availableIn: ["mid-year", "backfill-audit", "full-year"],
  },
  {
    id: "full-year",
    name: "Full-Year Completion Certificate",
    basis: "Only available in Full-Year Mode",
    availableIn: ["full-year"],
  },
];

export function recommendMode(input: {
  onboardingMonth: AcademicMonth;
  academicStart: AcademicMonth;
  status: ImplementationStatus;
}): ImplementationMode {
  if (
    input.status === "evidence-scattered" ||
    input.status === "backfill-needed" ||
    input.status === "partially-implemented"
  ) {
    return "backfill-audit";
  }
  if (input.onboardingMonth === input.academicStart) return "full-year";
  return "mid-year";
}
