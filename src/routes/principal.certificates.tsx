import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, PenLine, ShieldCheck, CheckCircle2, Clock, Sparkles, Search } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { CERTIFICATES, DEMO_SCHOOL_NAME, getDemoCompletionRows, GRADE_SUMMARIES } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/certificates")({
  head: () => ({ meta: [{ title: "Certificate Centre · Namma AI" }] }),
  component: CertificatesPage,
});

const LEGAL_TAG = "CBSE CT & AI Implementation";

type CandidateStatus = "Pending Signature" | "Ready to Issue" | "Issued";

function CertificatesPage() {
  const c = CERTIFICATES;
  const rows = React.useMemo(() => getDemoCompletionRows(), []);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const candidates = React.useMemo(() => {
    return rows.slice(0, 24).map((r, i) => {
      const gradeIdx = i % GRADE_SUMMARIES.length;
      const type = i % 3 === 0
        ? "AI Foundations Certificate"
        : i % 3 === 1
          ? "CT Participation Certificate"
          : "Project Completion Certificate";
      const status: CandidateStatus =
        i % 5 === 0 ? "Issued" :
        i % 5 === 1 ? "Ready to Issue" :
        "Pending Signature";
      const score = 78 + ((i * 17) % 20);
      return {
        id: `cert_${i + 1}`,
        student: r.student,
        grade: GRADE_SUMMARIES[gradeIdx].label,
        section: i % 2 === 0 ? "A" : "B",
        type,
        completion: score,
        status,
        date: `2026-07-${String(20 - (i % 14)).padStart(2, "0")}`,
      };
    });
  }, [rows]);

  const filtered = candidates.filter((c) => {
    if (q && !c.student.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const STATUS_TONE: Record<CandidateStatus, string> = {
    "Pending Signature": "bg-challenge-soft text-challenge",
    "Ready to Issue": "bg-explore-soft text-explore",
    "Issued": "bg-success-soft text-success",
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-bonus-soft via-white to-xp-soft p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-bonus">
            <Award className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Certificate Centre</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {c.eligible} students eligible for CT & AI certificates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DEMO_SCHOOL_NAME} · Academic year 2026–27
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Eligible" value={c.eligible} tone="text-bonus bg-white" />
            <Kpi label="Pending signature" value={c.pendingApproval} tone="text-challenge bg-white" />
            <Kpi label="Issued" value={c.issued} tone="text-success bg-white" />
            <Kpi label="Certificate types" value={c.types.length} tone="text-decide bg-white" />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-extrabold text-foreground">Certificate types</h2>
            <ul className="mt-4 space-y-2">
              {c.types.map((t) => (
                <li key={t.name} className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3">
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    {t.note && <div className="text-xs text-muted-foreground">{t.note}</div>}
                  </div>
                  <span className="font-display text-xl font-extrabold text-foreground">{t.count}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white">
                <PenLine className="h-4 w-4" /> Sign & Approve all
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5">
                <Download className="h-4 w-4" /> Download bundle
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-extrabold text-foreground">Featured preview</h2>
            <div className="mt-4 rounded-2xl border-2 border-dashed border-bonus/40 bg-gradient-to-br from-white to-bonus-soft/40 p-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-bonus/25 bg-white px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-bonus">
                <ShieldCheck className="h-3 w-3" /> Namma AI · {LEGAL_TAG}
              </div>
              <div className="mt-4 font-display text-2xl font-extrabold text-foreground">
                {c.featured.student}
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {c.featured.grade}
              </div>
              <div className="mt-4 text-sm text-foreground">
                is awarded the <strong>{c.featured.certificate}</strong>
              </div>
              <div className="mt-3 inline-flex flex-wrap justify-center gap-2 text-[0.65rem]">
                <span className="rounded-full bg-success-soft px-2 py-0.5 font-bold text-success">
                  Completion {c.featured.completion}%
                </span>
                <span className="rounded-full bg-success-soft px-2 py-0.5 font-bold text-success">
                  Teacher approved
                </span>
                <span className="rounded-full bg-challenge-soft px-2 py-0.5 font-bold text-challenge">
                  Principal signature: {c.featured.principalSignature}
                </span>
              </div>
              <div className="mt-5 border-t border-foreground/10 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {DEMO_SCHOOL_NAME} · Bengaluru
              </div>
            </div>
          </div>
        </section>

        {/* Approval queue */}
        <section className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-extrabold text-foreground">Approval queue</h2>
              <p className="text-xs text-muted-foreground">Sign each student's certificate or issue in bulk.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search student…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="rounded-full border border-foreground/10 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-decide/40"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
                <option value="all">All statuses</option>
                <option>Pending Signature</option>
                <option>Ready to Issue</option>
                <option>Issued</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Certificate</th>
                  <th className="pb-2 text-right">Completion</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-foreground/5">
                    <td className="py-2.5 font-semibold text-foreground">{r.student}</td>
                    <td className="py-2.5 text-muted-foreground">{r.grade}{r.section}</td>
                    <td className="py-2.5">{r.type}</td>
                    <td className="py-2.5 text-right tabular-nums font-bold">{r.completion}%</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${STATUS_TONE[r.status]}`}>
                        {r.status === "Issued" ? <CheckCircle2 className="h-3 w-3" /> :
                          r.status === "Ready to Issue" ? <Sparkles className="h-3 w-3" /> :
                          <Clock className="h-3 w-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 tabular-nums text-muted-foreground">{r.date}</td>
                    <td className="py-2.5 text-right">
                      <button className="rounded-full border border-foreground/15 bg-white px-3 py-1 text-xs font-semibold hover:bg-foreground/5">
                        {r.status === "Issued" ? "Download" : "Sign"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-sm text-muted-foreground">No candidates match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl border border-white/60 p-3 shadow-sm ${tone}`}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}
