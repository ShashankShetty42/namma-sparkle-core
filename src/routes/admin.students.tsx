import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  GraduationCap,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
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
  bulkCreateStudents,
  createStudent,
  deleteStudent,
  getSchools,
  getStudents,
  GRADE_OPTIONS,
  onAdminState,
  updateStudent,
  type Student,
} from "@/lib/namma-admin";

const search = z.object({ school: z.string().optional() });

export const Route = createFileRoute("/admin/students")({
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Student Management · Namma AI" }] }),
  component: StudentManagement,
});

function useTick() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => onAdminState(() => setTick((t) => t + 1)), []);
  return tick;
}

function StudentManagement() {
  const { school } = Route.useSearch();
  const tick = useTick();
  const schools = React.useMemo(() => getSchools(), [tick]);
  const students = React.useMemo(() => getStudents(school), [tick, school]);

  const [form, setForm] = React.useState({
    student_name: "",
    grade: "Grade 5",
    student_id: "",
    password: "",
    school_id: school ?? "",
  });

  React.useEffect(() => {
    if (school) setForm((f) => ({ ...f, school_id: school }));
  }, [school]);

  const reset = () =>
    setForm({
      student_name: "",
      grade: "Grade 5",
      student_id: "",
      password: "",
      school_id: school ?? "",
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createStudent(form);
    if (!res.ok) return toast.error(res.error);
    toast.success("Student created successfully.");
    reset();
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-reflect-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-story/25 blur-3xl" />
          <div className="relative space-y-3">
            <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-2xl">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              Student Management
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Create student accounts {school ? `for ${school}.` : "for this school."}
            </p>
          </div>
        </motion.section>

        {/* Add form + Bulk import */}
        <section className="section-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="eyebrow">
              <Plus className="h-3.5 w-3.5" /> Add student
            </div>
            <BulkImportButton schoolFromQuery={school} schools={schools} />
          </div>

          {schools.length === 0 ? (
            <NoSchools />
          ) : (
            <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Student Name">
                <Input
                  value={form.student_name}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                  placeholder="Aarav Kumar"
                  className={inputClass}
                />
              </Field>
              <Field label="Grade">
                <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                  <SelectTrigger className={cn(inputClass, "h-11")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Student ID">
                <Input
                  value={form.student_id}
                  onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                  placeholder="student001"
                  className={inputClass}
                />
              </Field>
              <Field label="Password">
                <Input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="welcome123"
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
              <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
                <Button type="submit" variant="hero" size="lg">
                  <Plus className="h-4 w-4" /> Save Student
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
            <GraduationCap className="h-3.5 w-3.5" /> Students {school ? `· ${school}` : ""}
          </div>
          {students.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center text-sm text-muted-foreground">
              No students yet.
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/5 bg-white/90">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <StudentRow key={`${s.school_id}:${s.student_id}`} student={s} />
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

function StudentRow({ student }: { student: Student }) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(student.student_name);
  const [grade, setGrade] = React.useState(student.grade);

  const save = () => {
    updateStudent(student.school_id, student.student_id, { student_name: name, grade });
    setEditing(false);
    toast.success("Student updated.");
  };

  const reset = () => {
    const pwd = prompt("New password (min 6 chars):");
    if (!pwd) return;
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters.");
    updateStudent(student.school_id, student.student_id, { password: pwd });
    toast.success("Password reset.");
  };

  const remove = () => {
    if (!confirm(`Delete student ${student.student_name}?`)) return;
    deleteStudent(student.school_id, student.student_id);
    toast.success("Student deleted.");
  };

  return (
    <TableRow>
      <TableCell className="font-semibold">
        {editing ? <Input value={name} onChange={(e) => setName(e.target.value)} /> : student.student_name}
      </TableCell>
      <TableCell>
        {editing ? (
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          student.grade
        )}
      </TableCell>
      <TableCell className="font-mono text-xs">{student.student_id}</TableCell>
      <TableCell className="font-mono text-xs">{student.school_id}</TableCell>
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

/* ───────────── Bulk Import ───────────── */

type ImportRow = {
  student_name: string;
  grade: string;
  student_id: string;
  password: string;
};

function BulkImportButton({
  schoolFromQuery,
  schools,
}: {
  schoolFromQuery?: string;
  schools: ReturnType<typeof getSchools>;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rows, setRows] = React.useState<ImportRow[] | null>(null);
  const [targetSchool, setTargetSchool] = React.useState(schoolFromQuery ?? "");

  React.useEffect(() => {
    if (schoolFromQuery) setTargetSchool(schoolFromQuery);
  }, [schoolFromQuery]);

  const handleFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const parsed: ImportRow[] = json.map((r) => ({
        student_name: String(r["Student Name"] ?? r.student_name ?? "").trim(),
        grade: String(r["Grade"] ?? r.grade ?? "").trim(),
        student_id: String(r["Student ID"] ?? r.student_id ?? "").trim(),
        password: String(r["Password"] ?? r.password ?? "").trim(),
      }));
      const valid = parsed.filter((r) => r.student_name && r.student_id);
      if (!valid.length) {
        toast.error("No valid rows found. Use columns: Student Name, Grade, Student ID, Password.");
        return;
      }
      setRows(valid);
    } catch (err) {
      console.error(err);
      toast.error("Could not read that file.");
    }
  };

  const confirm = () => {
    if (!rows || !targetSchool) {
      toast.error("Choose a school first.");
      return;
    }
    const res = bulkCreateStudents(
      rows.map((r) => ({
        student_name: r.student_name,
        grade: r.grade || "Grade 5",
        student_id: r.student_id,
        password: r.password || "welcome123",
        school_id: targetSchool,
      })),
    );
    toast.success(`Imported ${res.created} students.${res.skipped ? ` ${res.skipped} skipped.` : ""}`);
    if (res.errors.length) console.warn("Skipped:", res.errors);
    setRows(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <Button variant="soft" size="sm" onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4" /> Import Students
      </Button>

      {rows && (
        <div className="mt-5 w-full rounded-2xl border border-foreground/10 bg-white/95 p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-display text-base font-extrabold text-foreground">
                Preview · {rows.length} rows
              </div>
              <p className="text-xs text-muted-foreground">
                Review then save to the selected school.
              </p>
            </div>
            <div className="flex items-end gap-2">
              <div>
                <span className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Target school
                </span>
                <Select value={targetSchool} onValueChange={setTargetSchool}>
                  <SelectTrigger className="h-10 w-56 rounded-xl border-2 border-foreground/10 bg-white">
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
              </div>
              <Button variant="hero" size="sm" onClick={confirm}>
                Save {rows.length}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRows(null)}>
                Cancel
              </Button>
            </div>
          </div>

          <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-foreground/5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.student_name}</TableCell>
                    <TableCell>{r.grade}</TableCell>
                    <TableCell className="font-mono text-xs">{r.student_id}</TableCell>
                    <TableCell className="font-mono text-xs">{r.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
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
