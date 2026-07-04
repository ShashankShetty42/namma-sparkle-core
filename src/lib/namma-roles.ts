/**
 * Namma AI · Role registry (principal / teacher / student / Namma AI admin).
 *
 * Owns:
 *  - post-login redirects
 *  - sidebar nav config per role
 */

import {
  Award,
  BarChart3,
  BookOpen,
  BookText,
  Building2,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Library,
  ListChecks,
  Map,
  NotebookPen,
  School as SchoolIcon,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import type { UserRole } from "@/lib/namma-progress";

export type NavTone =
  | "story"
  | "explore"
  | "decide"
  | "reflect"
  | "challenge"
  | "bonus"
  | "xp"
  | "success";

export type RoleNavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  tone: NavTone;
  badge?: string;
};

export const ROLE_HOME: Record<UserRole, string> = {
  principal: "/principal",
  teacher: "/teacher",
  student: "/",
  admin: "/admin",
};

/* ─────────── Principal / School Admin ─────────── */

export const PRINCIPAL_NAV: RoleNavItem[] = [
  { label: "Dashboard", to: "/principal", icon: LayoutDashboard, tone: "story" },
  { label: "Grades", to: "/principal/grades", icon: GraduationCap, tone: "explore" },
  { label: "Teachers", to: "/principal/teachers", icon: Users, tone: "decide" },
  { label: "Students", to: "/principal/students", icon: Users, tone: "reflect" },
  { label: "Implementation Tracker", to: "/principal/implementation", icon: Target, tone: "challenge" },
  { label: "CT & AI Progress", to: "/principal/progress", icon: BarChart3, tone: "bonus" },
  { label: "Projects", to: "/principal/projects", icon: FolderKanban, tone: "explore" },
  { label: "Evidence Portfolio", to: "/principal/evidence", icon: FileSpreadsheet, tone: "success" },
  { label: "Reports", to: "/principal/reports", icon: FileBarChart, tone: "xp" },
  { label: "Certificates", to: "/principal/certificates", icon: Award, tone: "bonus" },
  { label: "Calendar", to: "/principal/calendar", icon: Calendar, tone: "story" },
  { label: "Settings", to: "/principal/settings", icon: Settings, tone: "decide" },
];

/* ─────────── Teacher ─────────── */

export const TEACHER_NAV: RoleNavItem[] = [
  { label: "Dashboard", to: "/teacher", icon: LayoutDashboard, tone: "story" },
  { label: "My Classes", to: "/teacher/classes", icon: Users, tone: "explore" },
  { label: "Weekly Planner", to: "/teacher/planner", icon: Calendar, tone: "decide" },
  { label: "Student Completion", to: "/teacher/completion", icon: ListChecks, tone: "reflect" },
  { label: "Verify Code", to: "/teacher/verify", icon: ShieldCheck, tone: "success" },

  { label: "Workbook Tracker", to: "/teacher/workbook", icon: BookText, tone: "challenge" },
  { label: "Projects", to: "/teacher/projects", icon: FolderKanban, tone: "bonus" },
  { label: "Assessments", to: "/teacher/assessments", icon: ClipboardCheck, tone: "success" },
  { label: "Observation Journal", to: "/teacher/journal", icon: NotebookPen, tone: "explore" },
  { label: "Reports", to: "/teacher/reports", icon: FileBarChart, tone: "xp" },
  { label: "Resources", to: "/teacher/resources", icon: Library, tone: "story" },
];

/* ─────────── Student ─────────── */

export const STUDENT_NAV: RoleNavItem[] = [
  { label: "My Progress", to: "/", icon: LayoutDashboard, tone: "story" },
  { label: "Weekly Status", to: "/student/weekly-tasks", icon: ClipboardList, tone: "decide" },
  { label: "Workbook Check-ins", to: "/student/workbook", icon: BookOpen, tone: "reflect" },
  { label: "Projects", to: "/student/projects", icon: FolderKanban, tone: "bonus" },
  { label: "Teacher Feedback", to: "/student/portfolio", icon: FileSpreadsheet, tone: "success" },
  { label: "Portfolio", to: "/student/portfolio", icon: FileSpreadsheet, tone: "explore" },
  { label: "Certificates", to: "/student/certificates", icon: Trophy, tone: "xp" },
];

/* ─────────── Namma AI Admin ─────────── */

export const ADMIN_NAV: RoleNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, tone: "story" },
  { label: "Schools", to: "/admin/schools", icon: Building2, tone: "challenge" },
  { label: "Teachers", to: "/admin/teachers", icon: Users, tone: "explore" },
  { label: "Students", to: "/admin/students", icon: GraduationCap, tone: "reflect" },
  { label: "Grade Templates", to: "/admin/grade-templates", icon: Layers, tone: "bonus" },
  { label: "Learning Outcomes", to: "/admin/learning-outcomes", icon: Target, tone: "decide" },
  { label: "Activity Library", to: "/admin/activity-library", icon: Sparkles, tone: "explore" },
  { label: "Report Templates", to: "/admin/report-templates", icon: FileText, tone: "xp" },
  { label: "User Management", to: "/admin/users", icon: ShieldCheck, tone: "challenge" },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3, tone: "success" },
  { label: "Support", to: "/admin/support", icon: LifeBuoy, tone: "story" },
];

export function navForRole(role: UserRole | null): RoleNavItem[] {
  switch (role) {
    case "principal":
      return PRINCIPAL_NAV;
    case "teacher":
      return TEACHER_NAV;
    case "admin":
      return ADMIN_NAV;
    case "student":
    default:
      return STUDENT_NAV;
  }
}

/* Icon re-export so other files don't need to double-import lucide names */
export {
  SchoolIcon,
};
