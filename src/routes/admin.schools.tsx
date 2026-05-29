import * as React from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Building2, Eye, Plus, School as SchoolIcon, UserPlus } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  createSchool,
  getSchools,
  getStudents,
  getTeachers,
  onAdminState,
  type School,
} from "@/lib/namma-admin";

export const Route = createFileRoute("/admin/schools")({
  head: () => ({ meta: [{ title: "School Management · Namma AI" }] }),
  component: AdminSchoolsRoute,
});

function AdminSchoolsRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalized = pathname.replace(/\/$/, "");

  if (normalized !== "/admin/schools") {
    return <Outlet />;
  }

  return <SchoolManagement />;
}

function useSchools() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => onAdminState(() => setTick((t) => t + 1)), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => getSchools(), [tick]);
}

function SchoolManagement() {
  const schools = useSchools();
  const [form, setForm] = React.useState({
    school_name: "",
    school_id: "",
    principal_name: "",
    contact_number: "",
    email: "",
    city: "",
    state: "",
  });
  const [open, setOpen] = React.useState(true);

  const reset = () =>
    setForm({
      school_name: "",
      school_id: "",
      principal_name: "",
      contact_number: "",
      email: "",
      city: "",
      state: "",
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createSchool(form);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("School created successfully.");
    reset();
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <Header />

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: nammaEase }}
          className="section-panel"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">
              <Plus className="h-3.5 w-3.5" /> Add school
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
              {open ? "Hide form" : "Show form"}
            </Button>
          </div>

          {open && (
            <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
              <FormField
                label="School Name *"
                value={form.school_name}
                onChange={(v) => setForm((f) => ({ ...f, school_name: v }))}
                placeholder="Greenfield Public School"
              />
              <FormField
                label="School ID *"
                value={form.school_id}
                onChange={(v) => setForm((f) => ({ ...f, school_id: v.toUpperCase() }))}
                placeholder="NAMMA001"
                hint="Students and teachers will use this School ID during login."
              />
              <FormField
                label="Principal Name"
                value={form.principal_name}
                onChange={(v) => setForm((f) => ({ ...f, principal_name: v }))}
              />
              <FormField
                label="Contact Number"
                value={form.contact_number}
                onChange={(v) => setForm((f) => ({ ...f, contact_number: v }))}
              />
              <FormField
                label="Email Address"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                type="email"
              />
              <FormField
                label="City"
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
              />
              <FormField
                label="State"
                value={form.state}
                onChange={(v) => setForm((f) => ({ ...f, state: v }))}
              />
              <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
                <Button type="submit" variant="hero" size="lg">
                  <Plus className="h-4 w-4" /> Create School
                </Button>
                <Button type="button" variant="soft" size="lg" onClick={reset}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.section>

        <section className="section-panel">
          <div className="eyebrow">
            <Building2 className="h-3.5 w-3.5" /> All schools
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            {schools.length} {schools.length === 1 ? "school" : "schools"}
          </h2>

          {schools.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center">
              <SchoolIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No schools yet. Use the form above to create your first.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {schools.map((s) => (
                <SchoolCard key={s.school_id} school={s} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Header() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: nammaEase }}
      className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-challenge-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-float)] md:p-10"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-challenge/25 blur-3xl" />
      <div className="relative space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-2xl">
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          School Management
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Create and manage schools participating in Namma AI.
        </p>
      </div>
    </motion.section>
  );
}

function SchoolCard({ school }: { school: School }) {
  const teachers = getTeachers(school.school_id).length;
  const students = getStudents(school.school_id).length;
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-foreground/5 bg-white/90 p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-extrabold text-foreground">{school.school_name}</div>
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {school.school_id}
          </div>
          {(school.city || school.state) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {[school.city, school.state].filter(Boolean).join(", ")}
            </div>
          )}
        </div>
        <span className="rounded-full bg-challenge-soft px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-challenge">
          {teachers} T · {students} S
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="soft">
          <Link to="/admin/teachers" search={{ school: school.school_id }}>
            <UserPlus className="h-3.5 w-3.5" /> Add Teacher
          </Link>
        </Button>
        <Button asChild size="sm" variant="soft">
          <Link to="/admin/students" search={{ school: school.school_id }}>
            <UserPlus className="h-3.5 w-3.5" /> Add Students
          </Link>
        </Button>
        <Button asChild size="sm" variant="hero">
          <Link to="/admin/schools/$schoolId" params={{ schoolId: school.school_id }}>
            <Eye className="h-3.5 w-3.5" /> View School
          </Link>
        </Button>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 rounded-2xl border-2 border-foreground/10 bg-white text-sm font-semibold focus-visible:border-foreground/50",
        )}
      />
      {hint && <span className="mt-1 block text-[0.7rem] text-muted-foreground">{hint}</span>}
    </label>
  );
}
