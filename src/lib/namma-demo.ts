/**
 * Namma AI · Demo data seeding.
 *
 * One-time, idempotent seed that populates every localStorage store so the
 * dashboards look like a live CBSE school (Namma Vidya Public School,
 * Bengaluru) mid-way through the 2026-27 academic year.
 *
 * Also exposes typed read helpers for the demo-only extras (projects,
 * observations, alerts, planner, certificates, timeline, aggregate stats)
 * that the existing stores don't model.
 */

import {
  createSchool,
  createTeacher,
  bulkCreateStudents,
  getSchool,
  isSchoolIdTaken,
  type Student,
} from "@/lib/namma-admin";
import { addEvidence, listEvidence, type EvidenceType } from "@/lib/namma-evidence";
import {
  COMPLETION_PHASES,
  MISSIONS_PER_GRADE,
  setPhase,
} from "@/lib/namma-completion";
import { getAuth, signIn } from "@/lib/namma-progress";

/* ───────────── Constants ───────────── */

export const DEMO_SCHOOL_ID = "NAMMA-DEMO";
export const DEMO_SCHOOL_NAME = "Namma Vidya Public School";
export const DEMO_CITY = "Bengaluru";
export const DEMO_STATE = "Karnataka";
export const DEMO_ACADEMIC_YEAR = "2026–27";
export const DEMO_CURRENT_WEEK = 9;
export const DEMO_TOTAL_WEEKS = 35;

const SEED_FLAG_KEY = "namma:demo:seeded:v3";
const EXTRAS_KEY = "namma:demo:extras:v3";
const isBrowser = () => typeof window !== "undefined";

/* ───────────── People ───────────── */

const FIRST_NAMES = [
  "Aarav", "Anika", "Dev", "Meera", "Kabir", "Ishaan", "Saanvi", "Rohan",
  "Diya", "Vihaan", "Aditi", "Nikhil", "Tara", "Arjun", "Kavya", "Rehan",
  "Sara", "Advik", "Myra", "Reyansh", "Aanya", "Krish", "Zara", "Yuvraj",
  "Anaya", "Ayaan", "Navya", "Vivaan", "Pari", "Aryan", "Riya", "Kian",
  "Mahika", "Shaurya", "Ira", "Atharv", "Aarohi", "Veer", "Nyra", "Aarush",
  "Kiara", "Om", "Prisha", "Yash", "Anvi", "Ranveer", "Siya", "Aarnav",
  "Trisha", "Kartik", "Nisha", "Rudra", "Ahaana", "Jai", "Mira", "Neel",
  "Aarna", "Shivansh", "Pranavi", "Advait", "Ojas", "Ridhi", "Aayush", "Tanvi",
];
const LAST_NAMES = [
  "Sharma", "Rao", "Shetty", "Iyer", "Menon", "Kulkarni", "Nair", "Jain",
  "Prakash", "Reddy", "Bhat", "Gowda", "Fernandes", "Pai", "Hegde", "Malhotra",
  "Khan", "Subramaniam", "Kapoor", "Bose", "Chatterjee", "Deshpande", "Krishnan",
  "Mishra", "Pillai", "Verma",
];

export type SectionTeacher = {
  teacher_id: string;
  teacher_name: string;
  teacher_email: string;
  role: "Subject Teacher" | "Computer Teacher";
  grade: number;
  section: "A" | "B" | "*";
  subject: "CT" | "CT+AI" | "AI/Project";
};

const TEACHER_ROSTER: Omit<SectionTeacher, "teacher_id">[] = [
  { teacher_name: "Ms. Ananya Rao", teacher_email: "ananya.rao@nammavidya.edu.in", role: "Subject Teacher", grade: 3, section: "A", subject: "CT" },
  { teacher_name: "Ms. Priya Nair", teacher_email: "priya.nair@nammavidya.edu.in", role: "Subject Teacher", grade: 3, section: "B", subject: "CT" },
  { teacher_name: "Mr. Vivek Sharma", teacher_email: "vivek.sharma@nammavidya.edu.in", role: "Subject Teacher", grade: 4, section: "A", subject: "CT" },
  { teacher_name: "Ms. Kavya Iyer", teacher_email: "kavya.iyer@nammavidya.edu.in", role: "Subject Teacher", grade: 4, section: "B", subject: "CT" },
  { teacher_name: "Ms. Sneha Kulkarni", teacher_email: "sneha.kulkarni@nammavidya.edu.in", role: "Subject Teacher", grade: 5, section: "A", subject: "CT" },
  { teacher_name: "Mr. Arjun Prakash", teacher_email: "arjun.prakash@nammavidya.edu.in", role: "Subject Teacher", grade: 5, section: "B", subject: "CT" },
  { teacher_name: "Ms. Ritu Malhotra", teacher_email: "ritu.malhotra@nammavidya.edu.in", role: "Subject Teacher", grade: 6, section: "A", subject: "CT+AI" },
  { teacher_name: "Mr. Deepak Jain", teacher_email: "deepak.jain@nammavidya.edu.in", role: "Subject Teacher", grade: 6, section: "B", subject: "CT+AI" },
  { teacher_name: "Ms. Farah Khan", teacher_email: "farah.khan@nammavidya.edu.in", role: "Subject Teacher", grade: 7, section: "A", subject: "CT+AI" },
  { teacher_name: "Mr. Karthik Subramaniam", teacher_email: "karthik.s@nammavidya.edu.in", role: "Subject Teacher", grade: 7, section: "B", subject: "CT+AI" },
  { teacher_name: "Ms. Neha Bhat", teacher_email: "neha.bhat@nammavidya.edu.in", role: "Subject Teacher", grade: 8, section: "A", subject: "CT+AI" },
  { teacher_name: "Mr. Suresh Gowda", teacher_email: "suresh.gowda@nammavidya.edu.in", role: "Subject Teacher", grade: 8, section: "B", subject: "CT+AI" },
  { teacher_name: "Ms. Riya Fernandes", teacher_email: "riya.fernandes@nammavidya.edu.in", role: "Computer Teacher", grade: 6, section: "*", subject: "AI/Project" },
  { teacher_name: "Mr. Pranav Hegde", teacher_email: "pranav.hegde@nammavidya.edu.in", role: "Computer Teacher", grade: 8, section: "*", subject: "AI/Project" },
];

/* ───────────── Grade summary spec ───────────── */

export type GradeSummary = {
  grade: number;
  label: string;
  students: number;
  teacherCompletion: number;
  workbookTracking: number;
  studentCompletion: number;
  aiActivity?: number;
  projectCompletion?: number;
  observations: number;
  projectsCompleted: string;
  risk: "On Track" | "Needs Attention" | "Delayed";
  currentWeek: number;
  focus: string;
  track: "CT" | "CT+AI";
};

export const GRADE_SUMMARIES: GradeSummary[] = [
  { grade: 3, label: "Grade 3", students: 64, teacherCompletion: 92, workbookTracking: 88, studentCompletion: 84, observations: 46, projectsCompleted: "Not applicable yet", risk: "On Track", currentWeek: 9, focus: "Patterns, sorting, step-by-step thinking", track: "CT" },
  { grade: 4, label: "Grade 4", students: 64, teacherCompletion: 81, workbookTracking: 76, studentCompletion: 72, observations: 39, projectsCompleted: "1 class activity completed", risk: "Needs Attention", currentWeek: 8, focus: "Symmetry, transformations, multi-step reasoning", track: "CT" },
  { grade: 5, label: "Grade 5", students: 64, teacherCompletion: 87, workbookTracking: 82, studentCompletion: 79, observations: 52, projectsCompleted: "1 mini reasoning task completed", risk: "On Track", currentWeek: 9, focus: "Deduction, hidden information, condition-based logic", track: "CT" },
  { grade: 6, label: "Grade 6", students: 64, teacherCompletion: 78, workbookTracking: 74, studentCompletion: 69, aiActivity: 63, projectCompletion: 41, observations: 58, projectsCompleted: "13 project submissions", risk: "Needs Attention", currentWeek: 8, focus: "AI basics, data, pattern recognition, digital responsibility", track: "CT+AI" },
  { grade: 7, label: "Grade 7", students: 64, teacherCompletion: 73, workbookTracking: 68, studentCompletion: 61, aiActivity: 57, projectCompletion: 34, observations: 49, projectsCompleted: "11 project submissions", risk: "Delayed", currentWeek: 7, focus: "AI domains, data visualization, industry applications, bias", track: "CT+AI" },
  { grade: 8, label: "Grade 8", students: 64, teacherCompletion: 85, workbookTracking: 80, studentCompletion: 77, aiActivity: 72, projectCompletion: 55, observations: 63, projectsCompleted: "16 project submissions", risk: "On Track", currentWeek: 9, focus: "AI project lifecycle, fairness, responsible AI, no-code exploration", track: "CT+AI" },
];

/* ───────────── School-level headline stats ───────────── */

export const SCHOOL_STATS = {
  overallImplementation: 76,
  gradesActive: 6,
  gradesTotal: 6,
  classesActive: 12,
  classesTotal: 12,
  teachersActiveThisWeek: 11,
  teachersTotal: 14,
  studentsEnrolled: 384,
  studentsOnTrack: 287,
  studentsNeedingAttention: 72,
  studentsDelayed: 25,
  workbookCheckins: 2418,
  teacherObservations: 307,
  projectSubmissions: 118,
  certificatesEligible: 96,
  evidenceItems: 1482,
  reportsGenerated: 28,
};

/* ───────────── Charts ───────────── */

export const WEEKLY_TREND = [
  { week: 1, pct: 42 },
  { week: 2, pct: 49 },
  { week: 3, pct: 56 },
  { week: 4, pct: 63 },
  { week: 5, pct: 67 },
  { week: 6, pct: 70 },
  { week: 7, pct: 72 },
  { week: 8, pct: 74 },
  { week: 9, pct: 76 },
];

export const COMPETENCY_COVERAGE = [
  { competency: "Pattern Recognition", pct: 82 },
  { competency: "Decomposition", pct: 75 },
  { competency: "Algorithmic Thinking", pct: 71 },
  { competency: "Data Handling", pct: 68 },
  { competency: "Spatial Reasoning", pct: 73 },
  { competency: "Ethical Awareness", pct: 66 },
  { competency: "Project Thinking", pct: 58 },
  { competency: "Reflection Quality", pct: 64 },
];

export const EVIDENCE_MIX = [
  { label: "Workbook Check-ins", pct: 42, tone: "explore" },
  { label: "Teacher Observations", pct: 18, tone: "decide" },
  { label: "Project Submissions", pct: 14, tone: "bonus" },
  { label: "Reflections", pct: 16, tone: "reflect" },
  { label: "Assessment Records", pct: 7, tone: "challenge" },
  { label: "Certificates", pct: 3, tone: "success" },
];

/* ───────────── Alerts ───────────── */

export type AlertTone = "positive" | "attention" | "delayed" | "info";
export type SmartAlert = { id: string; tone: AlertTone; title: string; body: string };

export const SMART_ALERTS: SmartAlert[] = [
  { id: "a1", tone: "delayed", title: "Grade 7B is delayed", body: "Only 52% student completion this week — teacher follow-up recommended." },
  { id: "a2", tone: "attention", title: "Grade 6 AI project review pending", body: "18 students awaiting teacher approval on AI Around Us project." },
  { id: "a3", tone: "attention", title: "Grade 4B workbook tracking stale", body: "Ms. Kavya Iyer has not updated workbook tracking for 5 days." },
  { id: "a4", tone: "positive", title: "Grade 8A leading implementation", body: "88% completion and 21 projects approved this term." },
  { id: "a5", tone: "attention", title: "72 students need teacher follow-up", body: "Cross-grade cohort flagged — see student completion tracker." },
  { id: "a6", tone: "info", title: "Evidence Pack for July is ready", body: "Download the school-level evidence pack for board review." },
  { id: "a7", tone: "positive", title: "96 students eligible for certificates", body: "Send to principal for signature and issue this week." },
  { id: "a8", tone: "positive", title: "Grade 3 shows highest consistency", body: "9-week rolling completion above 82% every week." },
];

/* ───────────── Weekly planner (Grade 6A · Week 8) ───────────── */

export const PLANNER = {
  week: 8,
  grade: "Grade 6",
  section: "A",
  focus: "AI Basics and Data Responsibility",
  implementationType: "AI + Digital Responsibility",
  status: "Partially Completed" as const,
  duration: "2 periods",
  teacherTasks: [
    "Confirm student workbook completion",
    "Conduct classroom discussion",
    "Collect student reflections",
    "Assign digital responsibility activity",
    "Review pending project submissions",
  ],
  checklist: [
    { label: "Workbook check-in", value: 75, done: false },
    { label: "Class discussion", value: 100, done: true },
    { label: "Student reflection", value: 56, done: false },
    { label: "Project work", value: 40, done: false, note: "In Progress" },
    { label: "Teacher observation", value: 100, done: true, note: "Updated" },
  ],
};

/* ───────────── Projects ───────────── */

export type ProjectStatus =
  | "Submitted"
  | "Pending Review"
  | "Approved"
  | "Needs Improvement"
  | "Resubmitted";

export type ProjectRow = {
  id: string;
  student: string;
  grade: string;
  section: string;
  title: string;
  submittedOn: string;
  rubricScore: number;
  status: ProjectStatus;
  comment: string;
};

const PROJECT_TITLES: Record<number, string[]> = {
  6: ["AI Around Us Observation Log"],
  7: ["Data Visualization of School Habits"],
  8: ["Responsible AI Mini Project"],
};

const PROJECT_COMMENTS = [
  "Good observation, add one real-life example.",
  "Strong reflection on privacy.",
  "Needs clearer explanation of data source.",
  "Excellent project structure.",
  "Resubmit after improving conclusion.",
  "Well-organised worksheet, clear examples.",
  "Add screenshots of the no-code tool used.",
  "Consider fairness in your data sample.",
];

const PROJECT_STATUSES: ProjectStatus[] = [
  "Submitted", "Pending Review", "Approved", "Needs Improvement", "Resubmitted",
];

/* ───────────── Observations ───────────── */

export type ObservationRow = {
  id: string;
  student: string;
  grade: string;
  competency: string;
  observation: string;
  teacher: string;
  date: string;
  supportNeeded: boolean;
};

const OBSERVATION_TEMPLATES: { competency: string; text: string; support: boolean }[] = [
  { competency: "Pattern Recognition", text: "Identified rule patterns quickly and explained reasoning clearly during group discussion.", support: false },
  { competency: "Algorithmic Thinking", text: "Understands the steps but needs help arranging them in the correct sequence.", support: true },
  { competency: "Ethical Awareness", text: "Gave thoughtful examples about bias in AI recommendations.", support: false },
  { competency: "Decomposition", text: "Breaks problems into manageable parts with a bit of prompting.", support: true },
  { competency: "Data Handling", text: "Sorted the data set correctly and spotted the outlier.", support: false },
  { competency: "Reflection Quality", text: "Reflection was short — encouraged to add real-life examples.", support: true },
  { competency: "Project Thinking", text: "Owned the project end-to-end and led the peer review.", support: false },
  { competency: "Spatial Reasoning", text: "Rotational symmetry task solved with minimal help.", support: false },
];

/* ───────────── Certificates ───────────── */

export const CERTIFICATES = {
  eligible: 96,
  pendingApproval: 42,
  issued: 54,
  types: [
    { name: "CT Participation Certificate", count: 38 },
    { name: "AI Foundations Certificate", count: 21 },
    { name: "Project Completion Certificate", count: 17 },
    { name: "School Implementation Certificate", count: 1, note: "Ready for principal review" },
  ],
  featured: {
    student: "Aarav Sharma",
    grade: "Grade 6A",
    certificate: "AI Foundations Participation Certificate",
    completion: 92,
    teacherApproved: true,
    principalSignature: "Pending" as const,
  },
};

/* ───────────── Evidence timeline ───────────── */

export const EVIDENCE_TIMELINE: { week: number; entry: string }[] = [
  { week: 1, entry: "Program activated for Grades 3–8" },
  { week: 2, entry: "Teachers completed initial setup" },
  { week: 3, entry: "First workbook check-ins recorded" },
  { week: 4, entry: "Student observation journal activated" },
  { week: 5, entry: "First project submissions from Grades 6–8" },
  { week: 6, entry: "Grade-wise progress reports generated" },
  { week: 7, entry: "Delayed classes flagged for follow-up" },
  { week: 8, entry: "Project review workflow active" },
  { week: 9, entry: "July evidence pack ready" },
];

/* ───────────── Grade 6A completion table (32 rows) ───────────── */

export type CompletionRowStatus = "Completed" | "In Progress" | "Needs Attention";
export type CompletionRow = {
  student: string;
  workbook: "Completed" | "Partial" | "Pending";
  portal: "Completed" | "Partial" | "Pending";
  quiz: string;
  reflection: "Submitted" | "Pending";
  project: "Submitted" | "Pending" | "Not Started";
  approval: "Approved" | "Needs Review" | "Pending";
  status: CompletionRowStatus;
  lastActivity: string;
};

function makeCompletionRows(names: string[]): CompletionRow[] {
  const patterns: Array<Omit<CompletionRow, "student">> = [
    { workbook: "Completed", portal: "Completed", quiz: "8/10", reflection: "Submitted", project: "Submitted", approval: "Approved", status: "Completed", lastActivity: "Today" },
    { workbook: "Completed", portal: "Completed", quiz: "7/10", reflection: "Submitted", project: "Pending", approval: "Needs Review", status: "In Progress", lastActivity: "Yesterday" },
    { workbook: "Partial", portal: "Pending", quiz: "—", reflection: "Pending", project: "Not Started", approval: "Pending", status: "Needs Attention", lastActivity: "4 days ago" },
    { workbook: "Completed", portal: "Completed", quiz: "9/10", reflection: "Submitted", project: "Submitted", approval: "Approved", status: "Completed", lastActivity: "Today" },
    { workbook: "Completed", portal: "Partial", quiz: "6/10", reflection: "Pending", project: "Not Started", approval: "Pending", status: "In Progress", lastActivity: "2 days ago" },
    { workbook: "Completed", portal: "Completed", quiz: "8/10", reflection: "Submitted", project: "Submitted", approval: "Approved", status: "Completed", lastActivity: "Today" },
    { workbook: "Completed", portal: "Completed", quiz: "7/10", reflection: "Submitted", project: "Pending", approval: "Needs Review", status: "In Progress", lastActivity: "Today" },
    { workbook: "Partial", portal: "Partial", quiz: "5/10", reflection: "Pending", project: "Not Started", approval: "Pending", status: "Needs Attention", lastActivity: "6 days ago" },
  ];
  return names.map((name, i) => ({ student: name, ...patterns[i % patterns.length] }));
}

/* ───────────── Reports ───────────── */

export const REPORT_PREVIEWS = {
  student: {
    student: "Aarav Sharma", grade: "6A", overall: 92, workbook: 100,
    portal: 88, quiz: 82, projects: "1 approved",
    remarks: "Shows strong interest in AI examples and explains reasoning clearly.",
    certificate: "Eligible",
  },
  class: {
    className: "Grade 6A", teacher: "Ms. Ritu Malhotra", overall: 72,
    completed: 21, inProgress: 8, needSupport: 3, projectsApproved: 13, observations: 31,
  },
  grade: {
    grade: 6, overall: 69, classes: "6A and 6B", workbook: 74,
    aiActivity: 63, projectCompletion: 41, risk: "Needs Attention",
  },
  principal: {
    school: DEMO_SCHOOL_NAME, overall: 76, strongest: "Grade 3", focus: "Grade 7",
    evidenceItems: 1482, reportsGenerated: 28,
    recommendation: "Increase project review support for Grades 6–8 and follow up with Grade 7B.",
  },
};

/* ───────────── Admin scope ───────────── */

export const ADMIN_SCOPE = {
  schoolsOnboarded: 8,
  totalStudentsAcross: 2840,
  teachersActive: 116,
  reportsGenerated: 186,
  evidencePacks: 24,
  supportTickets: 7,
  activityTemplates: 48,
  reportTemplates: 8,
  certificateTemplates: 5,
};

/* ───────────── Extras store ───────────── */

type Extras = {
  seededAt: number;
  teacherRoster: SectionTeacher[];
  projects: ProjectRow[];
  observations: ObservationRow[];
  completionRows: CompletionRow[];
};

function readExtras(): Extras | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(EXTRAS_KEY);
    return raw ? (JSON.parse(raw) as Extras) : null;
  } catch { return null; }
}
function writeExtras(v: Extras) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EXTRAS_KEY, JSON.stringify(v));
}

/* ───────────── Deterministic helpers ───────────── */

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function studentNamesFor(grade: number, section: "A" | "B", r: () => number): string[] {
  const names: string[] = [];
  for (let i = 0; i < 32; i++) {
    const f = pick(FIRST_NAMES, r);
    const l = pick(LAST_NAMES, r);
    names.push(`${f} ${l}`);
  }
  // Guarantee a couple of anchor students in Grade 6A so demos stay consistent.
  if (grade === 6 && section === "A") {
    const anchors = ["Aarav Sharma", "Anika Rao", "Dev Shetty", "Meera Iyer", "Kabir Menon"];
    anchors.forEach((n, i) => (names[i] = n));
  }
  return names;
}

/* ───────────── The seed itself ───────────── */

export function isDemoSeeded(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(SEED_FLAG_KEY) === "1";
}

export function isDemoSchoolActive(): boolean {
  if (!isBrowser()) return false;
  const a = getAuth();
  return a.schoolCode === DEMO_SCHOOL_ID;
}

export function ensureDemoSeed(opts: { autoSignIn?: boolean } = {}): void {
  if (!isBrowser()) return;
  if (isDemoSeeded()) {
    if (opts.autoSignIn) ensureDemoAuth();
    return;
  }

  // 1. School
  if (!isSchoolIdTaken(DEMO_SCHOOL_ID)) {
    createSchool({
      school_id: DEMO_SCHOOL_ID,
      school_name: DEMO_SCHOOL_NAME,
      principal_name: "Dr. Meera Krishnamurthy",
      contact_number: "+91 80 4000 0000",
      email: "principal@nammavidya.edu.in",
      city: DEMO_CITY,
      state: DEMO_STATE,
    });
  }

  // 2. Teachers
  const roster: SectionTeacher[] = [];
  for (const t of TEACHER_ROSTER) {
    const res = createTeacher({
      teacher_name: t.teacher_name,
      teacher_email: t.teacher_email,
      school_id: DEMO_SCHOOL_ID,
      password: "demo1234",
    });
    roster.push({
      ...t,
      teacher_id: res.ok ? res.teacher_id : `tch_${t.teacher_email}`,
    });
  }

  // 3. Students (12 sections × 32)
  const r = rand(20260701);
  const allStudents: Omit<Student, "created_at">[] = [];
  const grade6ANames: string[] = [];
  for (const grade of [3, 4, 5, 6, 7, 8]) {
    for (const section of ["A", "B"] as const) {
      const names = studentNamesFor(grade, section, r);
      if (grade === 6 && section === "A") grade6ANames.push(...names);
      names.forEach((name, idx) => {
        const seq = String(idx + 1).padStart(2, "0");
        allStudents.push({
          student_id: `g${grade}${section.toLowerCase()}-${seq}`,
          student_name: `${name} · ${grade}${section}`,
          grade: `Grade ${grade}`,
          school_id: DEMO_SCHOOL_ID,
          password: "demo1234",
        });
      });
    }
  }
  bulkCreateStudents(allStudents);

  // 4. Seed completion phases for Grade 6A students so the tracker looks alive.
  const rows = makeCompletionRows(grade6ANames);
  rows.forEach((row, i) => {
    const studentId = `g6a-${String(i + 1).padStart(2, "0")}`;
    // Distribute completion across 8 missions, ramping up.
    for (let m = 1; m <= MISSIONS_PER_GRADE; m++) {
      const density =
        row.status === "Completed" ? 1.0 :
        row.status === "In Progress" ? 0.65 :
        0.3;
      // Earlier missions denser, later missions taper.
      const missionFactor = 1 - (m - 1) / (MISSIONS_PER_GRADE * 1.4);
      const p = density * missionFactor;
      COMPLETION_PHASES.forEach((phase, pi) => {
        const on = ((i + m + pi) % 100) / 100 < p;
        if (on) setPhase(DEMO_SCHOOL_ID, studentId, "Grade 6", m, phase, true);
      });
    }
  });

  // 5. Evidence items — realistic mix across grades.
  const evidenceTypes: EvidenceType[] = ["photo", "worksheet", "quote", "artefact", "link"];
  const evidenceTitles: Record<EvidenceType, string[]> = {
    photo: ["Classroom activity — pattern hunt", "Group photo · sorting task", "Board work · algorithm steps", "AI Around Us walk"],
    worksheet: ["Workbook page 22 completed", "Reflection worksheet", "Quiz answer sheet", "Decomposition worksheet"],
    quote: ["Student shared: 'AI is like a pattern buddy'", "Peer feedback quote", "Reflection: fairness in AI"],
    artefact: ["Handmade sorting cards", "Poster · Responsible AI", "Model of decision tree"],
    link: ["Class blog post", "Uploaded no-code project", "Portfolio link"],
  };
  const evidenceStudents = grade6ANames.slice(0, 24);
  for (let i = 0; i < 120; i++) {
    const grade = 3 + (i % 6);
    const section = i % 2 === 0 ? "A" : "B";
    const t = evidenceTypes[i % evidenceTypes.length];
    const title = evidenceTitles[t][i % evidenceTitles[t].length];
    const studentName = evidenceStudents[i % evidenceStudents.length];
    addEvidence({
      school_id: DEMO_SCHOOL_ID,
      student_id: `g${grade}${section.toLowerCase()}-${String((i % 32) + 1).padStart(2, "0")}`,
      student_name: studentName,
      grade: `Grade ${grade}`,
      missionIndex: (i % 8) + 1,
      type: t,
      title,
      note: t === "quote" ? title : undefined,
      url: t === "link" ? "https://nammavidya.example/portfolio" : undefined,
      dataUrl: t === "photo" || t === "worksheet" ? "data:," : undefined,
      captured_by: roster[i % roster.length].teacher_email,
    });
  }

  // 6. Projects (~48 across G6–8)
  const projects: ProjectRow[] = [];
  let pid = 1;
  for (const grade of [6, 7, 8]) {
    const title = PROJECT_TITLES[grade][0];
    for (let i = 0; i < 16; i++) {
      const section = i % 2 === 0 ? "A" : "B";
      const name = grade === 6 && i < 5
        ? ["Aarav Sharma", "Anika Rao", "Dev Shetty", "Meera Iyer", "Kabir Menon"][i]
        : `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`;
      const status = PROJECT_STATUSES[(i + grade) % PROJECT_STATUSES.length];
      const day = 20 - (i % 14);
      projects.push({
        id: `pr_${pid++}`,
        student: name,
        grade: `Grade ${grade}`,
        section,
        title,
        submittedOn: `2026-07-${String(day).padStart(2, "0")}`,
        rubricScore: 6 + ((i * 3 + grade) % 5), // 6..10
        status,
        comment: PROJECT_COMMENTS[(i + grade) % PROJECT_COMMENTS.length],
      });
    }
  }

  // 7. Observations (~65)
  const observations: ObservationRow[] = [];
  for (let i = 0; i < 65; i++) {
    const grade = 3 + (i % 6);
    const tpl = OBSERVATION_TEMPLATES[i % OBSERVATION_TEMPLATES.length];
    const teacher = TEACHER_ROSTER.find(t => t.grade === grade && t.section === "A") ?? TEACHER_ROSTER[0];
    const day = 22 - (i % 20);
    observations.push({
      id: `ob_${i + 1}`,
      student: i < 5
        ? ["Aarav Sharma", "Dev Shetty", "Anika Rao", "Meera Iyer", "Kabir Menon"][i]
        : `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`,
      grade: `Grade ${grade}`,
      competency: tpl.competency,
      observation: tpl.text,
      teacher: teacher.teacher_name,
      date: `2026-07-${String(day).padStart(2, "0")}`,
      supportNeeded: tpl.support,
    });
  }

  // 8. Persist extras
  writeExtras({
    seededAt: Date.now(),
    teacherRoster: roster,
    projects,
    observations,
    completionRows: rows,
  });

  window.localStorage.setItem(SEED_FLAG_KEY, "1");
  if (opts.autoSignIn) ensureDemoAuth();
}

/** Sign the viewer in as the demo principal if they aren't signed in as anything better. */
export function ensureDemoAuth() {
  if (!isBrowser()) return;
  const a = getAuth();
  if (!a.isAuthed) {
    signIn({
      role: "principal",
      email: "principal@nammavidya.edu.in",
      schoolCode: DEMO_SCHOOL_ID,
    });
    return;
  }
  // If signed in but no schoolCode, or the schoolCode doesn't exist, point at demo.
  if (!a.schoolCode || !getSchool(a.schoolCode)) {
    signIn({
      role: a.role ?? "principal",
      email: a.email ?? "principal@nammavidya.edu.in",
      schoolCode: DEMO_SCHOOL_ID,
    });
  }
}

/* ───────────── Read helpers for pages ───────────── */

export function getDemoTeachers(): SectionTeacher[] {
  return readExtras()?.teacherRoster ?? [];
}
export function getDemoProjects(): ProjectRow[] {
  return readExtras()?.projects ?? [];
}
export function getDemoObservations(): ObservationRow[] {
  return readExtras()?.observations ?? [];
}
export function getDemoCompletionRows(): CompletionRow[] {
  return readExtras()?.completionRows ?? [];
}
export function getDemoEvidenceCount(): number {
  // Real count from evidence store (fresher than the SCHOOL_STATS constant).
  return listEvidence({ school_id: DEMO_SCHOOL_ID }).length;
}
