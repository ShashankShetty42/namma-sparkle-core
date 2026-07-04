import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, Camera, FileText, MessageSquareQuote, Link as LinkIcon, Package, Download } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { DEMO_SCHOOL_NAME } from "@/lib/namma-demo";

export const Route = createFileRoute("/student/portfolio")({
  head: () => ({ meta: [{ title: "My Portfolio · Namma AI" }] }),
  component: MyPortfolio,
});

type Item = {
  id: string;
  type: "photo" | "worksheet" | "reflection" | "project" | "quote" | "link";
  title: string;
  mission: string;
  competency: string;
  date: string;
  approvedBy?: string;
  note?: string;
};

const ITEMS: Item[] = [
  { id: "e1", type: "worksheet",  title: "Workbook page 22 · Sorting rules", mission: "Mission 2", competency: "Pattern Recognition", date: "12 Jun 2026", approvedBy: "Ms. Ritu Malhotra" },
  { id: "e2", type: "photo",      title: "Group photo · Pattern hunt in playground", mission: "Mission 2", competency: "Pattern Recognition", date: "14 Jun 2026", approvedBy: "Ms. Ritu Malhotra" },
  { id: "e3", type: "reflection", title: "My AI reflection", mission: "Mission 6", competency: "Ethical Awareness", date: "26 Jun 2026", approvedBy: "Ms. Ritu Malhotra", note: "I understood how AI can be biased if the data isn't fair." },
  { id: "e4", type: "project",    title: "AI Around Us — Observation Log", mission: "Mission 6", competency: "Project Thinking", date: "02 Jul 2026", approvedBy: "Mr. Pranav Hegde", note: "Rubric score 9/10 · Well organised, clear examples." },
  { id: "e5", type: "quote",      title: "Teacher noted: 'Aarav explained bias clearly to his peers.'", mission: "Mission 6", competency: "Reflection Quality", date: "28 Jun 2026", approvedBy: "Ms. Ritu Malhotra" },
  { id: "e6", type: "worksheet",  title: "Decomposition worksheet · Break the problem", mission: "Mission 4", competency: "Decomposition", date: "22 Jun 2026", approvedBy: "Ms. Ritu Malhotra" },
  { id: "e7", type: "link",       title: "Class blog · What I learnt about data", mission: "Mission 5", competency: "Data Handling", date: "25 Jun 2026" },
  { id: "e8", type: "photo",      title: "Handmade decision tree card set", mission: "Mission 4", competency: "Algorithmic Thinking", date: "24 Jun 2026", approvedBy: "Ms. Ritu Malhotra" },
];

const TYPE: Record<Item["type"], { icon: React.ReactNode; tone: string; label: string }> = {
  photo:      { icon: <Camera className="h-4 w-4" />,             tone: "bg-explore-soft text-explore",     label: "Photo" },
  worksheet:  { icon: <FileText className="h-4 w-4" />,           tone: "bg-decide-soft text-decide",       label: "Worksheet" },
  reflection: { icon: <MessageSquareQuote className="h-4 w-4" />, tone: "bg-reflect-soft text-reflect",     label: "Reflection" },
  project:    { icon: <Package className="h-4 w-4" />,            tone: "bg-bonus-soft text-bonus",         label: "Project" },
  quote:      { icon: <MessageSquareQuote className="h-4 w-4" />, tone: "bg-challenge-soft text-challenge", label: "Teacher note" },
  link:       { icon: <LinkIcon className="h-4 w-4" />,           tone: "bg-success-soft text-success",     label: "Link" },
};

function MyPortfolio() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-success">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">My Portfolio</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                {ITEMS.length} pieces of evidence · Grade 6A
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {DEMO_SCHOOL_NAME} · Aarav Sharma · Term 1, 2026–27
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-foreground/5">
              <Download className="h-3.5 w-3.5" /> Download portfolio
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
            {(Object.keys(TYPE) as Item["type"][]).map((t) => {
              const count = ITEMS.filter((i) => i.type === t).length;
              return (
                <span key={t} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${TYPE[t].tone}`}>
                  {TYPE[t].icon} {count} {TYPE[t].label}
                </span>
              );
            })}
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {ITEMS.map((i) => (
            <article key={i.id} className="rounded-[22px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${TYPE[i.type].tone}`}>
                  {TYPE[i.type].icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {i.mission} · {i.competency}
                  </div>
                  <div className="mt-0.5 font-display text-base font-extrabold text-foreground">{i.title}</div>
                  {i.note && <p className="mt-1 text-sm text-muted-foreground">{i.note}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.68rem]">
                    <span className="text-muted-foreground">{i.date}</span>
                    {i.approvedBy ? (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 font-bold text-success">
                        Approved · {i.approvedBy}
                      </span>
                    ) : (
                      <span className="rounded-full bg-challenge-soft px-2 py-0.5 font-bold text-challenge">
                        Awaiting teacher
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
