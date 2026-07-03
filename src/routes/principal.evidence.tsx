import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Camera,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquareQuote,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCircle2,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";
import { getAuth, onNammaState } from "@/lib/namma-progress";
import {
  getSchool,
  getStudents,
  onAdminState,
  type Student,
} from "@/lib/namma-admin";
import {
  EVIDENCE_TYPES,
  addEvidence,
  deleteEvidence,
  fileToDataUrl,
  listEvidence,
  onEvidenceState,
  type EvidenceItem,
  type EvidenceType,
} from "@/lib/namma-evidence";
import { MISSIONS_PER_GRADE } from "@/lib/namma-completion";

export const Route = createFileRoute("/principal/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Portfolio · Namma AI" },
      {
        name: "description",
        content:
          "Collect and organise CT & AI implementation evidence — photos, worksheets, quotes, artefacts and links — across every grade in your school.",
      },
      { property: "og:title", content: "Evidence Portfolio · Namma AI" },
      {
        property: "og:description",
        content:
          "Auditable school-wide portfolio of CBSE CT & AI implementation evidence for Grades 3–8.",
      },
    ],
  }),
  component: EvidencePortfolioPage,
});

/* ─────────── Type meta ─────────── */

const TYPE_META: Record<
  EvidenceType,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  photo: { label: "Photo", icon: Camera, tone: "explore" },
  worksheet: { label: "Worksheet", icon: FileText, tone: "decide" },
  quote: { label: "Student quote", icon: MessageSquareQuote, tone: "reflect" },
  artefact: { label: "Artefact", icon: Package, tone: "bonus" },
  link: { label: "Link", icon: LinkIcon, tone: "challenge" },
};

/* ─────────── Component ─────────── */

function EvidencePortfolioPage() {
  const [schoolCode, setSchoolCode] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => {
      setSchoolCode(getAuth().schoolCode);
      setTick((t) => t + 1);
    };
    refresh();
    const offs = [onAdminState(refresh), onNammaState(refresh), onEvidenceState(refresh)];
    return () => offs.forEach((o) => o());
  }, []);

  const school = React.useMemo(
    () => (schoolCode ? getSchool(schoolCode) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );
  const students: Student[] = React.useMemo(
    () => (schoolCode ? getStudents(schoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const grades = React.useMemo(
    () => Array.from(new Set(students.map((s) => s.grade))).sort(),
    [students],
  );

  const [gradeFilter, setGradeFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<EvidenceType | "all">("all");

  const items: EvidenceItem[] = React.useMemo(() => {
    if (!schoolCode) return [];
    let list = listEvidence({ school_id: schoolCode });
    if (gradeFilter !== "all") list = list.filter((e) => e.grade === gradeFilter);
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolCode, gradeFilter, typeFilter, tick]);

  const typeCounts = React.useMemo(() => {
    const base: Record<EvidenceType, number> = {
      photo: 0,
      worksheet: 0,
      quote: 0,
      artefact: 0,
      link: 0,
    };
    if (!schoolCode) return base;
    for (const e of listEvidence({ school_id: schoolCode })) base[e.type]++;
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolCode, tick]);

  const totalEvidence = React.useMemo(
    () => (schoolCode ? listEvidence({ school_id: schoolCode }).length : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const studentsWithEvidence = React.useMemo(() => {
    if (!schoolCode) return 0;
    const ids = new Set(listEvidence({ school_id: schoolCode }).map((e) => e.student_id));
    return ids.size;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolCode, tick]);

  const exportCSV = () => {
    if (items.length === 0) {
      toast("Nothing to export yet.");
      return;
    }
    const header = [
      "captured_at",
      "grade",
      "student_id",
      "student_name",
      "mission",
      "type",
      "title",
      "note",
      "url",
      "captured_by",
    ];
    const rows = items.map((e) =>
      [
        new Date(e.captured_at).toISOString(),
        e.grade,
        e.student_id,
        e.student_name,
        `M${e.missionIndex}`,
        e.type,
        e.title,
        e.note ?? "",
        e.url ?? (e.dataUrl ? "(file attached)" : ""),
        e.captured_by,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `namma-evidence-${school?.school_id ?? "school"}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Evidence exported as CSV");
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-success-soft via-white to-explore-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-white/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-success">
                <Sparkles className="h-3.5 w-3.5" /> Principal · Evidence Portfolio
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                Proof of implementation, at your fingertips.
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Collect photos, worksheets, student quotes and project artefacts across every grade
                — organised by mission and ready for audit or accreditation.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <MetaChip icon={<Building2 className="h-3.5 w-3.5" />}>
                  {school?.school_name ?? "No school"}
                </MetaChip>
                <MetaChip icon={<FileSpreadsheet className="h-3.5 w-3.5" />}>
                  {totalEvidence} evidence items
                </MetaChip>
                <MetaChip icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                  {LEGAL_TAGLINES.short}
                </MetaChip>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <AddEvidenceDialog
                schoolId={schoolCode}
                students={students}
              />
              <Button
                type="button"
                variant="soft"
                onClick={exportCSV}
                className="rounded-full"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>
        </motion.section>

        {/* KPI grid */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi label="Total" value={totalEvidence} tone="success" />
          {EVIDENCE_TYPES.map((t) => {
            const meta = TYPE_META[t];
            const Icon = meta.icon;
            return (
              <Kpi
                key={t}
                label={meta.label}
                value={typeCounts[t]}
                tone={meta.tone}
                icon={<Icon className="h-4 w-4" />}
              />
            );
          })}
        </section>

        {/* Filters */}
        <section className="rounded-[24px] border border-foreground/10 bg-white/85 p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Filter
            </div>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={gradeFilter === "all"} onClick={() => setGradeFilter("all")}>
                All grades
              </FilterChip>
              {grades.map((g) => (
                <FilterChip
                  key={g}
                  active={gradeFilter === g}
                  onClick={() => setGradeFilter(g)}
                >
                  {g}
                </FilterChip>
              ))}
            </div>
            <div className="mx-2 hidden h-6 w-px bg-foreground/10 sm:block" />
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                All types
              </FilterChip>
              {EVIDENCE_TYPES.map((t) => (
                <FilterChip
                  key={t}
                  active={typeFilter === t}
                  onClick={() => setTypeFilter(t)}
                >
                  {TYPE_META[t].label}
                </FilterChip>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {items.length === 0 ? (
          <EmptyState hasStudents={students.length > 0} hasSchool={!!school} />
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((e) => (
              <EvidenceCard
                key={e.id}
                item={e}
                onDelete={() => {
                  deleteEvidence(e.id);
                  toast.success("Evidence removed");
                }}
              />
            ))}
          </section>
        )}

        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {students.length > 0 && `${studentsWithEvidence} of ${students.length} students have evidence · `}
          {LEGAL_TAGLINES.outcomes}
        </p>
      </div>
    </AppShell>
  );
}

/* ─────────── Small blocks ─────────── */

function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold text-foreground">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </span>
  );
}

const kpiTone: Record<string, string> = {
  success: "from-success-soft to-white text-success",
  explore: "from-explore-soft to-white text-explore",
  decide: "from-decide-soft to-white text-decide",
  reflect: "from-reflect-soft to-white text-reflect",
  bonus: "from-bonus-soft to-white text-bonus",
  challenge: "from-challenge-soft to-white text-challenge",
};

function Kpi({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  tone: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-[var(--shadow-soft)]",
        kpiTone[tone] ?? kpiTone.success,
      )}
    >
      <div className="flex items-center justify-between text-foreground/70">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">{label}</span>
        {icon && <span className="grid h-7 w-7 place-items-center rounded-full bg-white/80">{icon}</span>}
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold text-foreground">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-bold transition",
        active
          ? "border-foreground bg-foreground text-white"
          : "border-foreground/15 bg-white text-foreground hover:bg-foreground/5",
      )}
    >
      {children}
    </button>
  );
}

function EvidenceCard({ item, onDelete }: { item: EvidenceItem; onDelete: () => void }) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-foreground/10 bg-white/90 shadow-[var(--shadow-soft)]"
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden",
          !item.dataUrl && "grid place-items-center bg-foreground/5",
        )}
      >
        {item.dataUrl ? (
          <img
            src={item.dataUrl}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : item.url ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <LinkIcon className="h-8 w-8" />
            <span className="max-w-[200px] truncate px-3 text-xs">{item.url}</span>
          </div>
        ) : (
          <Icon className="h-10 w-10 text-muted-foreground" />
        )}
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em]",
            `bg-${meta.tone}-soft text-${meta.tone}`,
          )}
        >
          <Icon className="h-3 w-3" /> {meta.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-extrabold leading-snug text-foreground">
            {item.title}
          </h3>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete evidence"
            className="rounded-full p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        {item.note && (
          <p className="line-clamp-3 text-xs text-muted-foreground">{item.note}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-foreground">
            <UserCircle2 className="h-3 w-3" /> {item.student_name}
          </span>
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-foreground">
            {item.grade}
          </span>
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-foreground">
            M{item.missionIndex}
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-foreground hover:underline"
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ hasStudents, hasSchool }: { hasStudents: boolean; hasSchool: boolean }) {
  return (
    <section className="rounded-[28px] border border-dashed border-foreground/15 bg-white/70 p-10 text-center shadow-[var(--shadow-soft)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success-soft text-success">
        <FileSpreadsheet className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">
        {!hasSchool
          ? "No school linked to this account"
          : !hasStudents
            ? "Add students to start collecting evidence"
            : "No evidence yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Capture the first photo, worksheet or student quote from any classroom — everything gets
        organised by mission automatically.
      </p>
      {!hasStudents && (
        <Link
          to="/admin/students"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Add students
        </Link>
      )}
    </section>
  );
}

/* ─────────── Add-evidence dialog ─────────── */

function AddEvidenceDialog({
  schoolId,
  students,
}: {
  schoolId: string | null;
  students: Student[];
}) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<EvidenceType>("photo");
  const [studentKey, setStudentKey] = React.useState<string>(""); // student_id
  const [missionIndex, setMissionIndex] = React.useState<number>(1);
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);

  const student = students.find((s) => s.student_id === studentKey) ?? null;

  const reset = () => {
    setType("photo");
    setStudentKey("");
    setMissionIndex(1);
    setTitle("");
    setNote("");
    setUrl("");
    setDataUrl(null);
    setFileName("");
    setSaving(false);
  };

  const onFile = async (file: File | null) => {
    if (!file) {
      setDataUrl(null);
      setFileName("");
      return;
    }
    setFileName(file.name);
    const url = await fileToDataUrl(file);
    if (!url) {
      toast.error("File is too large (max ~1.5 MB for demo).");
      setDataUrl(null);
      return;
    }
    setDataUrl(url);
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!schoolId) {
      toast.error("Sign in as a principal to add evidence.");
      return;
    }
    if (!student) {
      toast.error("Please choose a student.");
      return;
    }
    setSaving(true);
    const res = addEvidence({
      school_id: schoolId,
      student_id: student.student_id,
      student_name: student.student_name,
      grade: student.grade,
      missionIndex,
      type,
      title: title.trim(),
      note: note.trim() || undefined,
      url: type === "link" ? url.trim() : undefined,
      dataUrl: type === "photo" || type === "worksheet" ? dataUrl ?? undefined : undefined,
      captured_by: "principal",
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Evidence added");
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="hero" className="rounded-full">
          <Plus className="h-4 w-4" /> Add evidence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add evidence</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Type
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {EVIDENCE_TYPES.map((t) => {
                const meta = TYPE_META[t];
                const Icon = meta.icon;
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition",
                      active
                        ? "border-foreground bg-foreground text-white"
                        : "border-foreground/15 bg-white text-foreground hover:bg-foreground/5",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" /> {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student + mission */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Student
              </span>
              <select
                value={studentKey}
                onChange={(e) => setStudentKey(e.target.value)}
                className="mt-1 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2 text-sm"
              >
                <option value="">Choose student…</option>
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_name} · {s.grade}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Mission
              </span>
              <select
                value={missionIndex}
                onChange={(e) => setMissionIndex(parseInt(e.target.value, 10))}
                className="mt-1 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2 text-sm"
              >
                {Array.from({ length: MISSIONS_PER_GRADE }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Mission {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Title + note */}
          <label className="block">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Title
            </span>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Group sorting activity"
              className="mt-1"
            />
          </label>
          <label className="block">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Note {type === "quote" && "(the student's words)"}
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="What did the student do or say?"
              className="mt-1 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2 text-sm"
            />
          </label>

          {/* Type-specific */}
          {(type === "photo" || type === "worksheet") && (
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-foreground/20 bg-white/70 px-4 py-3 text-sm">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-explore-soft text-explore">
                {type === "photo" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              </span>
              <span className="flex-1">
                <span className="block font-bold text-foreground">
                  {fileName || (type === "photo" ? "Upload photo" : "Upload worksheet")}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {dataUrl ? "Attached" : "PNG/JPG · up to ~1.5 MB"}
                </span>
              </span>
              <Upload className="h-4 w-4 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}

          {type === "link" && (
            <label className="block">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                URL
              </span>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1"
              />
            </label>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="hero" disabled={saving}>
              {saving ? "Saving…" : "Save evidence"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
