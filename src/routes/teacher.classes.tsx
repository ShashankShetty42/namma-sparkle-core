import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Users } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { DEMO_CURRENT_WEEK } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/classes")({
  head: () => ({
    meta: [
      { title: "My Classes · Namma AI" },
      {
        name: "description",
        content: "The classes you teach this term with current week and pending updates.",
      },
    ],
  }),
  component: TeacherClasses,
});

const CLASSES = [
  {
    grade: "Grade 6A",
    students: 32,
    track: "CT+AI",
    week: DEMO_CURRENT_WEEK,
    completion: 74,
    pending: "8 workbook check-ins",
    nextTopic: "Pattern recognition in daily life",
  },
  {
    grade: "Grade 6B",
    students: 32,
    track: "CT+AI",
    week: DEMO_CURRENT_WEEK,
    completion: 68,
    pending: "3 project reviews",
    nextTopic: "Data — what it is and where it hides",
  },
  {
    grade: "Grade 8A",
    students: 32,
    track: "CT+AI",
    week: DEMO_CURRENT_WEEK,
    completion: 82,
    pending: "2 reflections",
    nextTopic: "AI project lifecycle — problem to prototype",
  },
];

function TeacherClasses() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Users className="h-3 w-3" /> Teacher · My Classes
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
            Your classes this term
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything on your plate — grouped by section, showing pending updates for Week{" "}
            {DEMO_CURRENT_WEEK}.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CLASSES.map((c) => (
            <article
              key={c.grade}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-xl font-extrabold text-foreground">
                    {c.grade}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.students} students · {c.track} · Week {c.week}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.65rem] font-bold",
                    c.completion >= 80
                      ? "bg-emerald-50 text-emerald-700"
                      : c.completion >= 70
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700",
                  )}
                >
                  {c.completion}%
                </span>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-sm">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Pending
                </div>
                <div className="mt-1 font-semibold text-foreground">{c.pending}</div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" /> Next: {c.nextTopic}
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <Link
                  to="/teacher/completion"
                  className="inline-flex items-center gap-1 rounded-full border border-foreground bg-foreground px-3 py-1.5 text-xs font-bold text-white"
                >
                  Open completion tracker <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  to="/teacher/planner"
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/40"
                >
                  Weekly planner
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
