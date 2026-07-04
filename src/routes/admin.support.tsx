import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Clock, CheckCircle2, AlertTriangle, MessageSquare, Search } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";

export const Route = createFileRoute("/admin/support")({
  head: () => ({ meta: [{ title: "Support · Namma AI" }] }),
  component: SupportPage,
});

type Status = "Open" | "In Progress" | "Resolved";
type Priority = "High" | "Medium" | "Low";

type Ticket = {
  id: string;
  school: string;
  from: string;
  role: string;
  subject: string;
  category: string;
  priority: Priority;
  status: Status;
  updated: string;
  slaHrs: number;
};

const TICKETS: Ticket[] = [
  { id: "SUP-2041", school: "Namma Vidya Public School",  from: "Ms. Ritu Malhotra",   role: "Teacher",   subject: "Workbook page missing in Mission 5",     category: "Content",       priority: "Medium", status: "In Progress", updated: "2h ago",  slaHrs: 22 },
  { id: "SUP-2040", school: "Cambridge Heritage School",  from: "Dr. R. Nagarajan",    role: "Principal", subject: "Bulk certificate approval workflow",     category: "Feature request",priority: "Low",    status: "Open",        updated: "6h ago",  slaHrs: 42 },
  { id: "SUP-2039", school: "Sunrise International",      from: "Mr. P. Iyer",         role: "Teacher",   subject: "Cannot upload photo evidence · 413 err", category: "Bug",           priority: "High",   status: "In Progress", updated: "35m ago", slaHrs: 4  },
  { id: "SUP-2038", school: "Deccan Public School",       from: "Ms. K. Reddy",        role: "Teacher",   subject: "Grade 6B roster mismatch",               category: "Data",          priority: "Medium", status: "Resolved",    updated: "1d ago",  slaHrs: 0  },
  { id: "SUP-2037", school: "Vidyashram Central",         from: "Dr. S. Menon",        role: "Principal", subject: "Board-report cover letter customisation", category: "Feature request",priority: "Low",   status: "Open",        updated: "1d ago",  slaHrs: 46 },
  { id: "SUP-2036", school: "Ekya Learning Community",    from: "Mr. D. Jain",         role: "Teacher",   subject: "Project rubric export to Excel",         category: "Feature request",priority: "Low",    status: "Resolved",    updated: "2d ago",  slaHrs: 0  },
  { id: "SUP-2035", school: "Namma Vidya Public School",  from: "Ms. Farah Khan",      role: "Teacher",   subject: "Add second computer teacher to Grade 7", category: "Access",        priority: "Medium", status: "Resolved",    updated: "2d ago",  slaHrs: 0  },
  { id: "SUP-2034", school: "Presidency Model School",    from: "Principal Office",    role: "Principal", subject: "Onboarding checklist walk-through",      category: "Onboarding",    priority: "High",   status: "In Progress", updated: "3d ago",  slaHrs: 9  },
];

const PRIO_TONE: Record<Priority, string> = {
  High: "bg-challenge-soft text-challenge",
  Medium: "bg-decide-soft text-decide",
  Low: "bg-foreground/5 text-muted-foreground",
};
const STATUS_TONE: Record<Status, string> = {
  "Open": "bg-decide-soft text-decide",
  "In Progress": "bg-challenge-soft text-challenge",
  "Resolved": "bg-success-soft text-success",
};

function SupportPage() {
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const rows = TICKETS.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (q && !`${t.subject} ${t.school} ${t.from}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const counts = {
    open: TICKETS.filter((t) => t.status === "Open").length,
    inprog: TICKETS.filter((t) => t.status === "In Progress").length,
    resolved: TICKETS.filter((t) => t.status === "Resolved").length,
    breach: TICKETS.filter((t) => t.status !== "Resolved" && t.slaHrs < 8).length,
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-story">
            <LifeBuoy className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Support Desk</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {TICKETS.length} tickets across 8 schools
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">SLA target: High &lt; 8h · Medium &lt; 24h · Low &lt; 72h.</p>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Kpi label="Open" value={counts.open} tone="bg-decide-soft text-decide" icon={<MessageSquare className="h-3.5 w-3.5" />} />
            <Kpi label="In progress" value={counts.inprog} tone="bg-challenge-soft text-challenge" icon={<Clock className="h-3.5 w-3.5" />} />
            <Kpi label="Resolved (7d)" value={counts.resolved} tone="bg-success-soft text-success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
            <Kpi label="SLA at risk" value={counts.breach} tone="bg-challenge-soft text-challenge" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
          </div>
        </header>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticket, school or person…" className="w-full rounded-full border border-foreground/10 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-decide/40" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option>Open</option><option>In Progress</option><option>Resolved</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Ticket</th>
                  <th className="pb-2">School</th>
                  <th className="pb-2">From</th>
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">SLA left</th>
                  <th className="pb-2 text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b border-foreground/5">
                    <td className="py-2.5 font-mono text-[0.72rem] text-muted-foreground">{t.id}</td>
                    <td className="py-2.5 text-foreground">{t.school}</td>
                    <td className="py-2.5">
                      <div className="font-semibold text-foreground">{t.from}</div>
                      <div className="text-[0.7rem] text-muted-foreground">{t.role} · {t.category}</div>
                    </td>
                    <td className="py-2.5 max-w-[240px] truncate text-foreground">{t.subject}</td>
                    <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${PRIO_TONE[t.priority]}`}>{t.priority}</span></td>
                    <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${STATUS_TONE[t.status]}`}>{t.status}</span></td>
                    <td className={`py-2.5 text-right tabular-nums font-semibold ${t.status !== "Resolved" && t.slaHrs < 8 ? "text-challenge" : "text-muted-foreground"}`}>
                      {t.status === "Resolved" ? "—" : `${t.slaHrs}h`}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">{t.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, tone, icon }: { label: string; value: React.ReactNode; tone: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">{icon}{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}
