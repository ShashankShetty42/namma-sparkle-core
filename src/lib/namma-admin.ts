/**
 * Namma AI · Admin data store (localStorage-backed).
 *
 * Frontend-only models for Phase 1 admin portal. Designed so the same shape
 * can be ported to Supabase tables (schools, teachers, students) later.
 *
 * Emits `namma:admin` event on every mutation; subscribe with onAdminState.
 */

const SCHOOLS_KEY = "namma:admin:schools";
const TEACHERS_KEY = "namma:admin:teachers";
const STUDENTS_KEY = "namma:admin:students";

const isBrowser = () => typeof window !== "undefined";
const EVENT = "namma:admin";

const emit = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(EVENT));
};

export function onAdminState(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* ───────────── Types ───────────── */

export type School = {
  school_id: string;          // unique, e.g. NAMMA001
  school_name: string;
  principal_name?: string;
  contact_number?: string;
  email?: string;
  city?: string;
  state?: string;
  created_at: number;
};

export type Teacher = {
  teacher_id: string;         // generated uuid-ish
  teacher_name: string;
  teacher_email: string;
  school_id: string;
  password: string;
  created_at: number;
};

export type Student = {
  student_id: string;         // e.g. student001
  student_name: string;
  grade: string;              // "Grade 5" .. "Grade 10"
  school_id: string;
  password: string;
  created_at: number;
};

export const GRADE_OPTIONS = [
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
] as const;

/* ───────────── Generic readers ───────────── */

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, list: T[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(list));
  emit();
}

/* ───────────── Schools ───────────── */

export function getSchools(): School[] {
  return read<School>(SCHOOLS_KEY).sort((a, b) => b.created_at - a.created_at);
}

export function getSchool(school_id: string): School | null {
  return read<School>(SCHOOLS_KEY).find((s) => s.school_id === school_id) ?? null;
}

export function isSchoolIdTaken(school_id: string): boolean {
  return read<School>(SCHOOLS_KEY).some(
    (s) => s.school_id.toLowerCase() === school_id.toLowerCase(),
  );
}

export function createSchool(input: Omit<School, "created_at">): { ok: true } | { ok: false; error: string } {
  const id = input.school_id.trim();
  if (!id) return { ok: false, error: "School ID is required." };
  if (!input.school_name.trim()) return { ok: false, error: "School Name is required." };
  if (isSchoolIdTaken(id)) return { ok: false, error: "This School ID is already in use." };
  const list = read<School>(SCHOOLS_KEY);
  list.push({ ...input, school_id: id, created_at: Date.now() });
  write(SCHOOLS_KEY, list);
  return { ok: true };
}

export function deleteSchool(school_id: string) {
  write(SCHOOLS_KEY, read<School>(SCHOOLS_KEY).filter((s) => s.school_id !== school_id));
  // Cascade
  write(TEACHERS_KEY, read<Teacher>(TEACHERS_KEY).filter((t) => t.school_id !== school_id));
  write(STUDENTS_KEY, read<Student>(STUDENTS_KEY).filter((s) => s.school_id !== school_id));
}

/* ───────────── Teachers ───────────── */

export function getTeachers(school_id?: string): Teacher[] {
  const list = read<Teacher>(TEACHERS_KEY);
  return (school_id ? list.filter((t) => t.school_id === school_id) : list).sort(
    (a, b) => b.created_at - a.created_at,
  );
}

export function createTeacher(
  input: Omit<Teacher, "teacher_id" | "created_at">,
): { ok: true; teacher_id: string } | { ok: false; error: string } {
  if (!input.teacher_name.trim()) return { ok: false, error: "Teacher name is required." };
  if (!input.teacher_email.trim()) return { ok: false, error: "Teacher email is required." };
  if (!input.school_id) return { ok: false, error: "Please choose a school." };
  if (!input.password || input.password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  const list = read<Teacher>(TEACHERS_KEY);
  if (list.some((t) => t.teacher_email.toLowerCase() === input.teacher_email.toLowerCase()))
    return { ok: false, error: "A teacher with that email already exists." };
  const teacher_id = `tch_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  list.push({ ...input, teacher_id, created_at: Date.now() });
  write(TEACHERS_KEY, list);
  return { ok: true, teacher_id };
}

export function updateTeacher(teacher_id: string, patch: Partial<Teacher>) {
  const list = read<Teacher>(TEACHERS_KEY).map((t) =>
    t.teacher_id === teacher_id ? { ...t, ...patch } : t,
  );
  write(TEACHERS_KEY, list);
}

export function deleteTeacher(teacher_id: string) {
  write(TEACHERS_KEY, read<Teacher>(TEACHERS_KEY).filter((t) => t.teacher_id !== teacher_id));
}

/* ───────────── Students ───────────── */

export function getStudents(school_id?: string): Student[] {
  const list = read<Student>(STUDENTS_KEY);
  return (school_id ? list.filter((s) => s.school_id === school_id) : list).sort(
    (a, b) => b.created_at - a.created_at,
  );
}

export function createStudent(
  input: Omit<Student, "created_at">,
): { ok: true } | { ok: false; error: string } {
  if (!input.student_name.trim()) return { ok: false, error: "Student name is required." };
  if (!input.student_id.trim()) return { ok: false, error: "Student ID is required." };
  if (!input.grade) return { ok: false, error: "Grade is required." };
  if (!input.school_id) return { ok: false, error: "Please choose a school." };
  if (!input.password || input.password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  const list = read<Student>(STUDENTS_KEY);
  if (
    list.some(
      (s) =>
        s.school_id === input.school_id &&
        s.student_id.toLowerCase() === input.student_id.toLowerCase(),
    )
  ) {
    return { ok: false, error: "That Student ID is already used at this school." };
  }
  list.push({ ...input, created_at: Date.now() });
  write(STUDENTS_KEY, list);
  return { ok: true };
}

export function bulkCreateStudents(
  rows: Omit<Student, "created_at">[],
): { created: number; skipped: number; errors: string[] } {
  const errors: string[] = [];
  let created = 0;
  let skipped = 0;
  for (const r of rows) {
    const res = createStudent(r);
    if (res.ok) created++;
    else {
      skipped++;
      errors.push(`${r.student_id || "(no id)"} — ${res.error}`);
    }
  }
  return { created, skipped, errors };
}

export function updateStudent(school_id: string, student_id: string, patch: Partial<Student>) {
  const list = read<Student>(STUDENTS_KEY).map((s) =>
    s.school_id === school_id && s.student_id === student_id ? { ...s, ...patch } : s,
  );
  write(STUDENTS_KEY, list);
}

export function deleteStudent(school_id: string, student_id: string) {
  write(
    STUDENTS_KEY,
    read<Student>(STUDENTS_KEY).filter(
      (s) => !(s.school_id === school_id && s.student_id === student_id),
    ),
  );
}

/* ───────────── Aggregations ───────────── */

export function getSchoolStats(school_id: string) {
  const students = getStudents(school_id);
  const teachers = getTeachers(school_id);
  const distribution: Record<string, number> = {};
  for (const g of GRADE_OPTIONS) distribution[g] = 0;
  for (const s of students) {
    distribution[s.grade] = (distribution[s.grade] ?? 0) + 1;
  }
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    activitiesCompleted: 0, // wired later when student progress is server-backed
    averageCompletion: 0,
    distribution,
  };
}
