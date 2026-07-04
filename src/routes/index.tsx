import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  FolderKanban,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Progress · Namma AI" },
      {
        name: "description",
        content:
          "Your CT & AI implementation progress — pending workbook check-ins, projects, teacher feedback and certificate status.",
      },
    ],
  }),
  component: StudentProgress,
});

const ME = {
  name: "Aarav Sharma",
  grade: "Grade 6A",
  week: 8,
  overall: 92,
  workbook: 100,
  assessment: 82,
  projects: "1 approved",
  teacher: "Ms. Ritu Malhotra",
};

const STATUS_CARDS = [
  { label: "Overall completion", value: `${ME.overall}%`, tone: "green", icon: CheckCircle2 },
  { label: "Workbook check-ins", value: `${ME.workbook}%`, tone: "green", icon: BookOpenCheck },
  { label: "Assessment average", value: `${ME.assessment}%`, tone: "blue", icon: ClipboardCheck },
  { label: "Projects", value: ME.projects, tone: "green", icon: FolderKanban },
];

const PENDING = [
  { label: "Submit Week 8 reflection", to: "/student/weekly-tasks", tone: "amber" },
  { label: "Complete portal activity: AI Around Us", to: "/student/weekly-tasks", tone: "amber" },
  { label: "Awaiting teacher approval on Project 3", to: "/student/projects", tone: "blue" },
];

const FEEDBACK = [
  {
    from: ME.teacher,
    when: "Yesterday",
    text: "Shows strong interest in AI examples and explains reasoning clearly. Add one real-life example to your reflection.",
  },
  {
    from: ME.teacher,
    when: "Last week",
    text: "Excellent workbook check-in. Keep up the consistency!",
  },
];

function StudentProgress() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Student · Progress Profile
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">{ME.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ME.grade} · Week {ME.week} · Teacher {ME.teacher}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATUS_CARDS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full",
                  s.tone === "green" && "bg-emerald-50 text-emerald-700",
                  s.tone === "blue" && "bg-blue-50 text-blue-700",
                )}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <div className="mt-3 font-display text-xl font-extrabold tabular-nums text-foreground">
                {s.value}
              </div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              This week
            </div>
            <h2 className="font-display text-lg font-extrabold text-foreground">Pending items</h2>
            <ul className="mt-4 space-y-2">
              {PENDING.map((p) => (
                <li key={p.label}>
                  <Link
                    to={p.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-sm transition hover:bg-muted/20",
                      p.tone === "amber" ? "border-amber-100 bg-amber-50/30" : "border-blue-100 bg-blue-50/30",
                    )}
                  >
                    <ClipboardList className="h-4 w-4 text-foreground" />
                    <span className="flex-1 font-semibold text-foreground">{p.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Teacher feedback
            </div>
            <h2 className="font-display text-lg font-extrabold text-foreground">
              What your teacher said
            </h2>
            <ul className="mt-4 space-y-3">
              {FEEDBACK.map((f, i) => (
                <li key={i} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span className="font-semibold">{f.from}</span> · {f.when}
                  </div>
                  <p className="mt-1 text-sm text-foreground">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link
            to="/student/portfolio"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:border-foreground/30 hover:bg-muted/20"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-display text-base font-extrabold text-foreground">
                My portfolio
              </div>
              <p className="text-xs text-muted-foreground">
                Workbook check-ins, reflections and projects collected this term.
              </p>
            </div>
          </Link>

          <Link
            to="/student/certificates"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:border-foreground/30 hover:bg-muted/20"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
              <Award className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="font-display text-base font-extrabold text-foreground">
                Certificate progress
              </div>
              <p className="text-xs text-muted-foreground">
                You are eligible for the AI Foundations Certificate — awaiting principal signature.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
