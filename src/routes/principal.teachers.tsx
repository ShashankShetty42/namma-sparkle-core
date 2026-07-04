import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Mail, Search, Users } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { GRADE_SUMMARIES, getDemoTeachers } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/teachers")({
  head: () => ({
    meta: [
      { title: "Teachers · Namma AI" },
      {
        name: "description",
        content: "Every CT & AI teacher in the school, their assigned section and implementation status.",
      },
    ],
  }),
  component: TeachersRoster,
});

function TeachersRoster() {
  const teachers = React.useMemo(() => getDemoTeachers(), []);
  const [q, setQ] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState<"All" | number>("All");

  const filtered = teachers.filter((t) => {
    if (gradeFilter !== "All" && t.grade !== gradeFilter) return false;
    if (q && !`${t.teacher_name} ${t.teacher_email} ${t.subject}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const kpis = [
    { label: "Total teachers", value: teachers.length, icon: Users, tone: "blue" },
    { label: "CT+AI teachers", value: teachers.filter((t) => t.subject !== "CT").length, icon: GraduationCap, tone: "violet" },
    { label: "Computer teachers", value: teachers.filter((t) => t.role === "Computer Teacher").length, icon: GraduationCap, tone: "amber" },
    { label: "Grades covered", value: new Set(teachers.map((t) => t.grade)).size, icon: GraduationCap, tone: "green" },
  ] as const;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Users className="h-3 w-3" /> Principal · Teachers
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
            CT &amp; AI teacher roster
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every subject and computer teacher delivering the CBSE CT &amp; AI implementation this year.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full",
                  k.tone === "blue" && "bg-blue-50 text-blue-700",
                  k.tone === "violet" && "bg-violet-50 text-violet-700",
                  k.tone === "amber" && "bg-amber-50 text-amber-700",
                  k.tone === "green" && "bg-emerald-50 text-emerald-700",
                )}
              >
                <k.icon className="h-4 w-4" />
              </span>
              <div className="mt-3 font-display text-2xl font-extrabold tabular-nums text-foreground">
                {k.value}
              </div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search teacher, email, subject"
                className="w-full rounded-full border border-border/60 bg-muted/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["All", 3, 4, 5, 6, 7, 8] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGradeFilter(g)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-bold transition",
                    gradeFilter === g
                      ? "border-foreground bg-foreground text-white"
                      : "border-border/60 text-foreground hover:bg-muted/40",
                  )}
                >
                  {g === "All" ? "All grades" : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-3 py-2 text-left">Teacher</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Grade / Section</th>
                  <th className="px-3 py-2 text-left">Subject</th>
                  <th className="px-3 py-2 text-right">Section completion</th>
                  <th className="px-3 py-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const g = GRADE_SUMMARIES.find((x) => x.grade === t.grade);
                  const completion = g?.teacherCompletion ?? 0;
                  return (
                    <tr key={t.teacher_id} className="border-t border-border/60">
                      <td className="px-3 py-3 font-semibold text-foreground">{t.teacher_name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{t.role}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        Grade {t.grade}
                        {t.section === "*" ? " (all)" : `-${t.section}`}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
                            t.subject === "CT"
                              ? "bg-blue-50 text-blue-700"
                              : t.subject === "CT+AI"
                                ? "bg-violet-50 text-violet-700"
                                : "bg-amber-50 text-amber-700",
                          )}
                        >
                          {t.subject}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                completion >= 85
                                  ? "bg-emerald-500"
                                  : completion >= 70
                                    ? "bg-amber-500"
                                    : "bg-rose-500",
                              )}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            {completion}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <a
                          href={`mailto:${t.teacher_email}`}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="h-3 w-3" />
                          {t.teacher_email}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
