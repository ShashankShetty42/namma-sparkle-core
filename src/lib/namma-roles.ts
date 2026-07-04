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
  { label: "Command Centre", to: "/principal", icon: LayoutDashboard, tone: "story" },
  { label: "Active Programs", to: "/principal/programs", icon: Layers, tone: "decide", badge: "1 active" },
  { label: "Grade Insights", to: "/principal/grades", icon: GraduationCap, tone: "explore" },
  { label: "Teacher Support", to: "/principal/teachers", icon: Users, tone: "decide" },
  { label: "Student Progress", to: "/principal/students", icon: Users, tone: "reflect" },
  { label: "Workbook Tracker", to: "/principal/implementation", icon: BookText, tone: "challenge" },
  { label: "Projects", to: "/principal/projects", icon: FolderKanban, tone: "explore" },
  { label: "Competency Analytics", to: "/principal/progress", icon: BarChart3, tone: "bonus" },
  { label: "Evidence Portfolio", to: "/principal/evidence", icon: FileSpreadsheet, tone: "success" },
  { label: "Reports", to: "/principal/reports", icon: FileBarChart, tone: "xp" },
  { label: "Certificates", to: "/principal/certificates", icon: Award, tone: "bonus" },
  { label: "Implementation Calendar", to: "/principal/calendar", icon: Calendar, tone: "story" },
  { label: "Future Programs", to: "/principal/future-programs", icon: Sparkles, tone: "reflect", badge: "Soon" },
];

/* ─────────── Teacher ─────────── */

export const TEACHER_NAV: RoleNavItem[] = [
  { label: "Weekly Workspace", to: "/teacher", icon: LayoutDashboard, tone: "story" },
  { label: "My Programs", to: "/principal/programs", icon: Layers, tone: "decide", badge: "CT & AI" },
  { label: "My Classes", to: "/teacher/classes", icon: Users, tone: "explore" },
  { label: "Weekly Planner", to: "/teacher/planner", icon: Calendar, tone: "decide" },
  { label: "Student Tracker", to: "/teacher/completion", icon: ListChecks, tone: "reflect" },
  { label: "Workbook Check-ins", to: "/teacher/workbook", icon: BookText, tone: "challenge" },
  { label: "Project Reviews", to: "/teacher/projects", icon: FolderKanban, tone: "bonus" },
  { label: "Observation Journal", to: "/teacher/journal", icon: NotebookPen, tone: "explore" },
];

/* ─────────── Student ─────────── */

export const STUDENT_NAV: RoleNavItem[] = [
  { label: "My Progress", to: "/", icon: LayoutDashboard, tone: "story" },
  { label: "Active Program", to: "/principal/programs", icon: Layers, tone: "decide", badge: "CT & AI" },
  { label: "Workbook Check-ins", to: "/student/workbook", icon: BookOpen, tone: "reflect" },
  { label: "My Projects", to: "/student/projects", icon: FolderKanban, tone: "bonus" },
  { label: "My Portfolio", to: "/student/portfolio", icon: FileSpreadsheet, tone: "success" },
  { label: "Certificates", to: "/student/certificates", icon: Trophy, tone: "xp" },
];

/* ─────────── Namma AI Admin ─────────── */

export const ADMIN_NAV: RoleNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, tone: "story" },
  { label: "Schools", to: "/admin/schools", icon: Building2, tone: "challenge" },
  { label: "Programs", to: "/admin/programs", icon: Layers, tone: "decide", badge: "1 active" },
  { label: "Teachers", to: "/admin/teachers", icon: Users, tone: "explore" },
  { label: "Students", to: "/admin/students", icon: GraduationCap, tone: "reflect" },
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
