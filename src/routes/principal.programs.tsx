import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  ACTIVE_PROGRAM,
  ACTIVE_PROGRAM_METRICS,
  FUTURE_PROGRAMS,
} from "@/lib/namma-programs";

export const Route = createFileRoute("/principal/programs")({
  head: () => ({
    meta: [
      { title: "Active Programs · Namma AI" },
      {
        name: "description",
        content:
          "School-wide implementation programs. Active: CBSE CT & AI. Future programs coming soon.",
      },
    ],
  }),
  component: ActivePrograms,
});

function ActivePrograms() {
  const A = ACTIVE_PROGRAM;
  const M = ACTIVE_PROGRAM_METRICS;
  const AIcon = A.icon;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Active Programs
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            New-Age Skills Programs
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            One implementation framework — track workbook, projects, evidence, competencies
            and certificates. Currently active: <strong>CBSE CT & AI</strong>. Additional
            programs unlock as your school adopts them.
          </p>
        </section>

        {/* Active program hero card */}
        <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-decide/10 text-decide">
                <AIcon className="h-7 w-7" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  {A.name}
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {A.description} Grades {A.grades} · Academic Year {M.academicYear}.
                </p>
              </div>
            </div>
            <Link
              to="/principal"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Open Program Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            <Metric label="Implementation Health" value={`${M.implementationHealth}/100`} />
            <Metric label="Evidence Readiness" value={`${M.evidenceReadiness}%`} />
            <Metric label="Students" value={M.studentsCovered} />
            <Metric label="Teachers" value={M.teachers} />
            <Metric label="Classes" value={M.classes} />
            <Metric label="Grades" value={M.gradesCovered} />
            <Metric label="Reports" value={M.reportsGenerated} />
            <Metric label="Certificates" value={M.certificatesEligible} />
          </div>
        </section>

        {/* Future programs */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Future Program Expansion
              </div>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Coming Soon
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your school can use the same implementation framework for other new-age
                skill programs in the future.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FUTURE_PROGRAMS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
                >
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" /> Coming Soon
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted/50 text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-extrabold text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Grades {p.grades}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-3">
      <div className="font-display text-lg font-extrabold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
