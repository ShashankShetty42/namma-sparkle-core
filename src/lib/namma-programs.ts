/**
 * Namma AI · Implementation Programs registry.
 *
 * The platform is subject-agnostic: it tracks any "new-age skills"
 * implementation program a school runs. Only CBSE CT & AI is Active in
 * Phase 1; every other program shows as Coming Soon.
 */

import {
  BrainCircuit,
  Bot,
  Code2,
  Compass,
  HandCoins,
  HeartHandshake,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ProgramStatus = "active" | "coming-soon" | "draft";

export type ImplementationProgram = {
  id: string;
  name: string;
  shortName: string;
  status: ProgramStatus;
  grades: string;
  description: string;
  icon: LucideIcon;
  tone: string; // tailwind color hint
};

export const PROGRAMS: ImplementationProgram[] = [
  {
    id: "cbse-ct-ai",
    name: "CBSE CT & AI",
    shortName: "CT & AI",
    status: "active",
    grades: "3–8",
    description:
      "Implementation, evidence and reporting for the CBSE Computational Thinking & Artificial Intelligence curriculum.",
    icon: BrainCircuit,
    tone: "decide",
  },
  {
    id: "coding-foundations",
    name: "Coding Foundations",
    shortName: "Coding",
    status: "coming-soon",
    grades: "3–10",
    description:
      "Track coding skill progression, weekly activities, projects and certificates.",
    icon: Code2,
    tone: "explore",
  },
  {
    id: "robotics-stem",
    name: "Robotics & STEM Projects",
    shortName: "Robotics · STEM",
    status: "coming-soon",
    grades: "5–10",
    description:
      "Manage hands-on STEM activities, project submissions and evidence portfolios.",
    icon: Bot,
    tone: "bonus",
  },
  {
    id: "digital-citizenship",
    name: "Digital Citizenship",
    shortName: "Digital Citizenship",
    status: "coming-soon",
    grades: "3–10",
    description:
      "Track privacy, safety, ethics and responsible digital behaviour programs.",
    icon: ShieldCheck,
    tone: "challenge",
  },
  {
    id: "design-thinking",
    name: "Design Thinking",
    shortName: "Design Thinking",
    status: "coming-soon",
    grades: "5–10",
    description:
      "Manage student innovation, empathy maps, prototypes and reflections.",
    icon: Lightbulb,
    tone: "story",
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship Skills",
    shortName: "Entrepreneurship",
    status: "coming-soon",
    grades: "6–10",
    description:
      "Track student ventures, pitches and business-thinking activities.",
    icon: Rocket,
    tone: "xp",
  },
  {
    id: "financial-literacy",
    name: "Financial Literacy",
    shortName: "Financial Literacy",
    status: "coming-soon",
    grades: "5–10",
    description:
      "Track money skills, budgeting projects and student reflections.",
    icon: HandCoins,
    tone: "success",
  },
  {
    id: "life-skills",
    name: "Life Skills",
    shortName: "Life Skills",
    status: "coming-soon",
    grades: "3–10",
    description:
      "Communication, collaboration, empathy and self-awareness tracking.",
    icon: HeartHandshake,
    tone: "reflect",
  },
  {
    id: "ai-project-portfolio",
    name: "AI Project Portfolio",
    shortName: "AI Portfolio",
    status: "coming-soon",
    grades: "6–10",
    description:
      "Long-form AI project tracking with rubrics, mentor review and certificates.",
    icon: Sparkles,
    tone: "decide",
  },
];

export const ACTIVE_PROGRAM = PROGRAMS.find((p) => p.status === "active")!;
export const FUTURE_PROGRAMS = PROGRAMS.filter((p) => p.status !== "active");

/** Metrics for the current active program (Phase 1: CBSE CT & AI). */
export const ACTIVE_PROGRAM_METRICS = {
  academicYear: "2026–27",
  implementationHealth: 76,
  evidenceReadiness: 74,
  studentsCovered: 384,
  teachers: 14,
  classes: 12,
  gradesCovered: "3–8",
  reportsGenerated: 28,
  certificatesEligible: 96,
  evidenceItems: 1482,
  weakestGrade: "Grade 7",
  strongestGrade: "Grade 3",
};

export const PLATFORM_TAGLINE =
  "New-Age Skills Implementation Platform for Schools";

export const PLATFORM_SUBTAGLINE =
  "Currently tracking: CBSE CT & AI for Grades 3–8";
