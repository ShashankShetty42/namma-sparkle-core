import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { PROGRAMS, ACTIVE_PROGRAM_METRICS } from "@/lib/namma-programs";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({ meta: [{ title: "Programs · Admin · Namma AI" }] }),
  component: AdminPrograms,
});

function AdminPrograms() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Namma AI Admin · Programs
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Implementation Programs
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Manage program templates, competency frameworks, report templates and
            certificate templates. Only <strong>CBSE CT & AI</strong> is active in
            Phase 1; other programs are draft/coming-soon.
          </p>
        </section>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Grades</th>
                <th className="px-4 py-3">Schools</th>
                <th className="px-4 py-3">Templates</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PROGRAMS.map((p) => {
                const Icon = p.icon;
                const isActive = p.status === "active";
                return (
                  <tr key={p.id} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-lg",
                            isActive
                              ? "bg-decide/10 text-decide"
                              : "bg-muted/50 text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-semibold text-foreground">{p.name}</div>
                          <div className="text-[0.7rem] text-muted-foreground">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                          <Lock className="h-3 w-3" /> Coming Soon
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.grades}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {isActive ? 1 : 0}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {isActive
                        ? "Competencies · Reports · Certificates"
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        disabled={!isActive}
                        className={cn(
                          "rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-semibold shadow-sm",
                          isActive
                            ? "text-foreground hover:bg-muted/40"
                            : "cursor-not-allowed text-muted-foreground opacity-60",
                        )}
                      >
                        {isActive ? "Edit" : "Draft"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Active program uses full demo data · Namma Vidya Public School ·
          {ACTIVE_PROGRAM_METRICS.studentsCovered} students, {ACTIVE_PROGRAM_METRICS.teachers}{" "}
          teachers.
        </p>
      </div>
    </AppShell>
  );
}
