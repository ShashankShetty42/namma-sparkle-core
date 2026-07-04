import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, PenLine, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { CERTIFICATES, DEMO_SCHOOL_NAME } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/certificates")({
  head: () => ({ meta: [{ title: "Certificates · Namma AI" }] }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const c = CERTIFICATES;
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-bonus-soft via-white to-xp-soft p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-bonus">
            <Award className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Certificates</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {c.eligible} students eligible for CT & AI certificates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DEMO_SCHOOL_NAME} · Academic year 2026–27
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Kpi label="Eligible" value={c.eligible} tone="text-bonus bg-white" />
            <Kpi label="Pending approval" value={c.pendingApproval} tone="text-challenge bg-white" />
            <Kpi label="Issued" value={c.issued} tone="text-success bg-white" />
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
                <PenLine className="h-4 w-4" /> Sign & Approve
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
      </div>
    </AppShell>
  );
}

const LEGAL_TAG = "CBSE CT & AI Implementation";

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl border border-white/60 p-3 shadow-sm ${tone}`}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}
