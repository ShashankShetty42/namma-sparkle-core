import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Copy, PenLine, GraduationCap, School, Users, FolderKanban, Award } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";

export const Route = createFileRoute("/admin/report-templates")({
  head: () => ({ meta: [{ title: "Report Templates · Namma AI" }] }),
  component: ReportTemplates,
});

type Template = {
  id: string;
  name: string;
  scope: "Student" | "Class" | "Grade" | "School" | "Project" | "Certificate";
  audience: string;
  pages: number;
  used: number;
  updated: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  sections: string[];
};

const TEMPLATES: Template[] = [
  { id: "t1", name: "Student Progress Report",         scope: "Student",     audience: "Parents",    pages: 3, used: 462, updated: "26 Jun 2026", icon: GraduationCap, tone: "bg-decide-soft text-decide",
    sections: ["Overall completion", "Workbook, portal, quiz", "Teacher remarks", "Certificate eligibility"] },
  { id: "t2", name: "Class Snapshot Report",           scope: "Class",       audience: "Principal",  pages: 2, used: 118, updated: "24 Jun 2026", icon: Users, tone: "bg-explore-soft text-explore",
    sections: ["Completion breakdown", "Projects approved", "Observations count", "Support needed list"] },
  { id: "t3", name: "Grade Implementation Report",     scope: "Grade",       audience: "Principal + Board", pages: 4, used: 32,  updated: "18 Jun 2026", icon: School, tone: "bg-bonus-soft text-bonus",
    sections: ["Section A vs B", "Weekly trend", "Competency coverage", "Teacher activity"] },
  { id: "t4", name: "School Implementation Report",    scope: "School",      audience: "Board / CBSE inspector", pages: 6, used: 12, updated: "15 Jun 2026", icon: School, tone: "bg-decide-soft text-decide",
    sections: ["Overall health", "Grade rollup", "Evidence pack summary", "Certificates issued"] },
  { id: "t5", name: "Project Review Report",           scope: "Project",     audience: "Teacher + Student", pages: 2, used: 68, updated: "22 Jun 2026", icon: FolderKanban, tone: "bg-bonus-soft text-bonus",
    sections: ["Rubric scores", "Teacher comments", "Revision history"] },
  { id: "t6", name: "Certificate Issuance Log",        scope: "Certificate", audience: "Principal + Registrar", pages: 1, used: 24, updated: "10 Jun 2026", icon: Award, tone: "bg-xp-soft text-xp",
    sections: ["Student list", "Certificate type", "Approval trail", "Signature block"] },
  { id: "t7", name: "Weekly Evidence Pack",            scope: "School",      audience: "Principal",  pages: 8, used: 28, updated: "01 Jul 2026", icon: FileText, tone: "bg-success-soft text-success",
    sections: ["Photos", "Worksheets", "Reflections", "Teacher observations", "Project artefacts"] },
  { id: "t8", name: "CBSE CT & AI Compliance Report",  scope: "School",      audience: "CBSE",       pages: 5, used: 6,  updated: "05 Jun 2026", icon: School, tone: "bg-challenge-soft text-challenge",
    sections: ["Curriculum coverage", "Workbook completion", "Project evidence", "Teacher training log"] },
];

function ReportTemplates() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xp">
            <FileText className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Report Templates</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                {TEMPLATES.length} board-ready templates
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Reusable across all schools · pulled directly from evidence, workbook and project stores.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white">
              <PenLine className="h-4 w-4" /> New template
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <article key={t.id} className="rounded-[22px] border border-foreground/10 bg-white p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base font-extrabold text-foreground">{t.name}</h2>
                      <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t.scope}</span>
                    </div>
                    <div className="text-[0.72rem] text-muted-foreground">
                      {t.audience} · {t.pages} pages · Updated {t.updated} · Used {t.used}×
                    </div>
                  </div>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.72rem] text-muted-foreground">
                  {t.sections.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${t.tone.split(" ")[1].replace("text", "bg")}`} />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5">
                    <Download className="h-3.5 w-3.5" /> Preview PDF
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5">
                    <Copy className="h-3.5 w-3.5" /> Duplicate
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5">
                    <PenLine className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
