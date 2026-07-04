import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserPlus, RotateCcw, Ban, Search, KeyRound } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management · Namma AI" }] }),
  component: UsersPage,
});

type Role = "Principal" | "Teacher" | "Student" | "Namma AI";
type UserStatus = "Active" | "Invited" | "Suspended";

type Row = {
  id: string;
  name: string;
  email: string;
  role: Role;
  school: string;
  lastLogin: string;
  status: UserStatus;
};

const ROWS: Row[] = [
  { id: "u1",  name: "Dr. Meera Krishnamurthy", email: "principal@nammavidya.edu.in",   role: "Principal", school: "Namma Vidya Public School",    lastLogin: "Today",     status: "Active" },
  { id: "u2",  name: "Ms. Ritu Malhotra",       email: "ritu.malhotra@nammavidya.edu.in", role: "Teacher",  school: "Namma Vidya Public School",   lastLogin: "Today",     status: "Active" },
  { id: "u3",  name: "Mr. Deepak Jain",         email: "deepak.jain@nammavidya.edu.in",   role: "Teacher",  school: "Namma Vidya Public School",   lastLogin: "Yesterday", status: "Active" },
  { id: "u4",  name: "Ms. Farah Khan",          email: "farah.khan@nammavidya.edu.in",    role: "Teacher",  school: "Namma Vidya Public School",   lastLogin: "3d ago",    status: "Active" },
  { id: "u5",  name: "Mr. Karthik Subramaniam", email: "karthik.s@nammavidya.edu.in",     role: "Teacher",  school: "Namma Vidya Public School",   lastLogin: "6d ago",    status: "Active" },
  { id: "u6",  name: "Aarav Sharma",            email: "aarav.sharma@nammavidya.edu.in",  role: "Student",  school: "Namma Vidya Public School",   lastLogin: "Today",     status: "Active" },
  { id: "u7",  name: "Dr. R. Nagarajan",        email: "principal@cambridgeheritage.in",  role: "Principal", school: "Cambridge Heritage School",  lastLogin: "Today",     status: "Active" },
  { id: "u8",  name: "Ms. K. Reddy",            email: "k.reddy@deccanpublic.edu",        role: "Teacher",  school: "Deccan Public School",        lastLogin: "2d ago",    status: "Active" },
  { id: "u9",  name: "Mr. Rakesh Anand",        email: "rakesh@nammaai.in",               role: "Namma AI", school: "—",                            lastLogin: "1h ago",    status: "Active" },
  { id: "u10", name: "Ms. Priya Sen",           email: "priya@nammaai.in",                role: "Namma AI", school: "—",                            lastLogin: "Today",     status: "Active" },
  { id: "u11", name: "Ms. S. Kapoor",           email: "kapoor@sunriseintl.edu",          role: "Teacher",  school: "Sunrise International",       lastLogin: "Never",     status: "Invited" },
  { id: "u12", name: "Mr. V. Rao",              email: "v.rao@vidyashramcentral.in",      role: "Principal", school: "Vidyashram Central",         lastLogin: "34d ago",   status: "Suspended" },
];

const ROLE_TONE: Record<Role, string> = {
  Principal: "bg-decide-soft text-decide",
  Teacher: "bg-explore-soft text-explore",
  Student: "bg-success-soft text-success",
  "Namma AI": "bg-challenge-soft text-challenge",
};
const STATUS_TONE: Record<UserStatus, string> = {
  Active: "bg-success-soft text-success",
  Invited: "bg-challenge-soft text-challenge",
  Suspended: "bg-foreground/10 text-muted-foreground",
};

function UsersPage() {
  const [q, setQ] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const rows = ROWS.filter((r) => {
    if (roleFilter !== "all" && r.role !== roleFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (q && !`${r.name} ${r.email} ${r.school}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const counts: Record<Role, number> = { Principal: 0, Teacher: 0, Student: 0, "Namma AI": 0 };
  ROWS.forEach((r) => counts[r.role]++);

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-challenge">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">User Management</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                {ROWS.length} accounts across the network
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Principals, teachers, students and Namma AI staff.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white">
              <UserPlus className="h-4 w-4" /> Invite user
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            {(Object.keys(counts) as Role[]).map((r) => (
              <div key={r} className={`rounded-2xl px-3 py-2.5 ${ROLE_TONE[r]}`}>
                <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">{r}s</div>
                <div className="mt-0.5 font-display text-2xl font-extrabold">{counts[r]}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or school…" className="w-full rounded-full border border-foreground/10 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-decide/40" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All roles</option>
              <option>Principal</option><option>Teacher</option><option>Student</option><option>Namma AI</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option>Active</option><option>Invited</option><option>Suspended</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">School</th>
                  <th className="pb-2">Last login</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-foreground/5">
                    <td className="py-2.5">
                      <div className="font-semibold text-foreground">{r.name}</div>
                      <div className="text-[0.7rem] text-muted-foreground">{r.email}</div>
                    </td>
                    <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${ROLE_TONE[r.role]}`}>{r.role}</span></td>
                    <td className="py-2.5 text-muted-foreground">{r.school}</td>
                    <td className="py-2.5 text-muted-foreground">{r.lastLogin}</td>
                    <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${STATUS_TONE[r.status]}`}>{r.status}</span></td>
                    <td className="py-2.5">
                      <div className="flex justify-end gap-1">
                        <IconBtn label="Reset password"><KeyRound className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Resend invite"><RotateCcw className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Suspend" danger><Ban className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </td>
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

function IconBtn({ children, label, danger }: { children: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button aria-label={label} title={label} className={`rounded-full border p-1.5 ${danger ? "border-challenge/30 text-challenge hover:bg-challenge/5" : "border-foreground/10 text-muted-foreground hover:bg-foreground/5"}`}>
      {children}
    </button>
  );
}
