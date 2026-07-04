import { createFileRoute } from "@tanstack/react-router";
import { Trophy, ShieldCheck, Download, Lock } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { DEMO_SCHOOL_NAME } from "@/lib/namma-demo";

export const Route = createFileRoute("/student/certificates")({
  head: () => ({ meta: [{ title: "My Certificates · Namma AI" }] }),
  component: MyCertificates,
});

type CertItem = {
  id: string;
  name: string;
  status: "Earned" | "Ready" | "Locked";
  when: string;
  detail: string;
  tone: string;
};

const CERTS: CertItem[] = [
  { id: "c1", name: "CT Foundations · Term 1",         status: "Earned", when: "Awarded 26 Jun 2026", detail: "You finished all 4 CT workbook missions with teacher approval.", tone: "bg-success-soft text-success" },
  { id: "c2", name: "Pattern Recognition Badge",       status: "Earned", when: "Awarded 12 Jun 2026", detail: "Consistent workbook + observation evidence across missions 2–3.", tone: "bg-explore-soft text-explore" },
  { id: "c3", name: "AI Foundations Certificate",      status: "Ready",  when: "Ready · awaiting principal signature", detail: "Completion 92% · Teacher approved · Ms. Ritu Malhotra", tone: "bg-challenge-soft text-challenge" },
  { id: "c4", name: "AI Project — 'AI Around Us'",     status: "Ready",  when: "Ready · awaiting principal signature", detail: "Rubric score 9/10 · Approved on 18 Jul 2026", tone: "bg-challenge-soft text-challenge" },
  { id: "c5", name: "Responsible AI Certificate",      status: "Locked", when: "Unlocks after Mission 7", detail: "Complete the Responsible AI workbook pages and reflection.", tone: "bg-foreground/5 text-muted-foreground" },
  { id: "c6", name: "School Implementation Certificate",status: "Locked", when: "Unlocks at end of Term 1", detail: "Awarded when your class completes 8 missions and 1 project.", tone: "bg-foreground/5 text-muted-foreground" },
];

function MyCertificates() {
  const earned = CERTS.filter((c) => c.status === "Earned").length;
  const ready = CERTS.filter((c) => c.status === "Ready").length;
  const locked = CERTS.filter((c) => c.status === "Locked").length;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-xp-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xp">
            <Trophy className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">My Certificates</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Aarav Sharma · Grade 6A
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DEMO_SCHOOL_NAME} · Academic year 2026–27
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Kpi label="Earned" value={earned} tone="bg-success-soft text-success" />
            <Kpi label="Ready" value={ready} tone="bg-challenge-soft text-challenge" />
            <Kpi label="Locked" value={locked} tone="bg-foreground/5 text-muted-foreground" />
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {CERTS.map((c) => (
            <article
              key={c.id}
              className="rounded-[22px] border border-foreground/10 bg-white p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.tone}`}>
                  {c.status === "Locked" ? <Lock className="h-5 w-5" /> :
                    c.status === "Earned" ? <ShieldCheck className="h-5 w-5" /> :
                    <Trophy className="h-5 w-5" />}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${c.tone}`}>
                  {c.status}
                </span>
              </div>
              <div className="mt-3 font-display text-lg font-extrabold text-foreground">{c.name}</div>
              <div className="text-[0.72rem] uppercase tracking-[0.14em] text-muted-foreground">{c.when}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.detail}</p>
              {c.status === "Earned" && (
                <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
              )}
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${tone}`}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}
