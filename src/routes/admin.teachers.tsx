import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Plus, RotateCcw, Trash2, Users } from "lucide-react";
import { z } from "zod";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  createTeacher,
  deleteTeacher,
  getSchools,
  getTeachers,
  onAdminState,
  updateTeacher,
  type Teacher,
} from "@/lib/namma-admin";

const search = z.object({ school: z.string().optional() });

export const Route = createFileRoute("/admin/teachers")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Teacher Management · Namma AI" }] }),
  component: TeacherManagement,
});

function useTick() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => onAdminState(() => setTick((t) => t + 1)), []);
  return tick;
}

function TeacherManagement() {
  const { school } = Route.useSearch();
  const tick = useTick();
  const schools = React.useMemo(() => getSchools(), [tick]);
  const teachers = React.useMemo(() => getTeachers(school), [tick, school]);

  const [form, setForm] = React.useState({
    teacher_name: "",
    teacher_email: "",
    school_id: school ?? "",
    password: "",
  });

  React.useEffect(() => {
    if (school) setForm((f) => ({ ...f, school_id: school }));
  }, [school]);

  const reset = () =>
    setForm({ teacher_name: "", teacher_email: "", school_id: school ?? "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createTeacher(form);
    if (!res.ok) return toast.error(res.error);
    toast.success("Teacher created successfully.");
    reset();
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-decide-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/25 blur-3xl" />
          <div className="relative space-y-3">
            <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-2xl">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              Teacher Management
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Create teacher accounts linked to schools.
            </p>
          </div>
        </motion.section>

        {/* Form */}
        <section className="section-panel">
          <div className="eyebrow">
            <Plus className="h-3.5 w-3.5" /> Add teacher
          </div>
          {schools.length === 0 ? (
            <NoSchools />
          ) : (
            <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Teacher Name">
                <Input
                  value={form.teacher_name}
                  onChange={(e) => setForm({ ...form, teacher_name: e.target.value })}
                  placeholder="Anita Sharma"
                  className={inputClass}
                />
              </Field>
              <Field label="Teacher Email">
                <Input
                  type="email"
                  value={form.teacher_email}
                  onChange={(e) => setForm({ ...form, teacher_email: e.target.value })}
                  placeholder="anita@school.com"
                  className={inputClass}
                />
              </Field>
              <Field label="School ID">
                <Select
                  value={form.school_id}
                  onValueChange={(v) => setForm({ ...form, school_id: v })}
                >
                  <SelectTrigger className={cn(inputClass, "h-11")}>
                    <SelectValue placeholder="Choose a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.school_id} value={s.school_id}>
                        {s.school_id} — {s.school_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Password">
                <Input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className={inputClass}
                />
              </Field>
              <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
                <Button type="submit" variant="hero" size="lg">
                  <Plus className="h-4 w-4" /> Save Teacher
                </Button>
                <Button type="button" variant="soft" size="lg" onClick={reset}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Table */}
        <section className="section-panel">
          <div className="eyebrow">
            <Users className="h-3.5 w-3.5" /> Teachers {school ? `· ${school}` : ""}
          </div>
          {teachers.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center text-sm text-muted-foreground">
              No teachers yet.
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/5 bg-white/90">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Teacher Email</TableHead>
                    <TableHead>School ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((t) => (
                    <TeacherRow key={t.teacher_id} teacher={t} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function TeacherRow({ teacher }: { teacher: Teacher }) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(teacher.teacher_name);
  const [email, setEmail] = React.useState(teacher.teacher_email);

  const save = () => {
    updateTeacher(teacher.teacher_id, { teacher_name: name, teacher_email: email });
    setEditing(false);
    toast.success("Teacher updated.");
  };

  const reset = () => {
    const pwd = prompt("New password (min 6 chars):");
    if (!pwd) return;
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters.");
    updateTeacher(teacher.teacher_id, { password: pwd });
    toast.success("Password reset.");
  };

  const remove = () => {
    if (!confirm(`Delete teacher ${teacher.teacher_name}?`)) return;
    deleteTeacher(teacher.teacher_id);
    toast.success("Teacher deleted.");
  };

  return (
    <TableRow>
      <TableCell className="font-semibold">
        {editing ? <Input value={name} onChange={(e) => setName(e.target.value)} /> : teacher.teacher_name}
      </TableCell>
      <TableCell>
        {editing ? (
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          teacher.teacher_email
        )}
      </TableCell>
      <TableCell className="font-mono text-xs">{teacher.school_id}</TableCell>
      <TableCell className="text-right">
        <div className="inline-flex gap-1">
          {editing ? (
            <>
              <Button size="sm" variant="hero" onClick={save}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" onClick={() => setEditing(true)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={reset} title="Reset password">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={remove} title="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 rounded-2xl border-2 border-foreground/10 bg-white text-sm font-semibold focus-visible:border-foreground/50";

function NoSchools() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-foreground/15 bg-white/70 p-6 text-sm text-muted-foreground">
      You need to create a school first.{" "}
      <Link to="/admin/schools" className="font-bold text-foreground underline">
        Add a school
      </Link>
      .
    </div>
  );
}
