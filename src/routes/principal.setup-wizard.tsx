import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_MONTHS,
  ACADEMIC_SETUP,
  ACADEMIC_YEARS,
  IMPLEMENTATION_MODES,
  recommendMode,
  type AcademicMonth,
  type ImplementationStatus,
} from "@/lib/namma-academic";

export const Route = createFileRoute("/principal/setup-wizard")({
  head: () => ({
    meta: [
      { title: "Academic Year Setup · Namma AI" },
      {
        name: "description",
        content:
          "Configure the academic year, onboarding month, implementation mode, grade coverage and backfill preference for your school.",
      },
    ],
  }),
  component: SetupWizard,
});

const STATUS_OPTIONS: { id: ImplementationStatus; label: string }[] = [
  { id: "not-started", label: "Not started" },
  { id: "started-untracked", label: "Started but not tracked" },
  { id: "partially-implemented", label: "Partially implemented" },
  { id: "some-grades", label: "Implemented in some grades" },
  { id: "evidence-scattered", label: "Implemented but evidence is scattered" },
  { id: "backfill-needed", label: "Need to backfill records" },
  { id: "current-month-only", label: "Want to start tracking from this month only" },
];

const GRADES = ["3", "4", "5", "6", "7", "8"];

function SetupWizard() {
  const [step, setStep] = React.useState(1);
  const [academicYear, setAcademicYear] = React.useState<string>(ACADEMIC_SETUP.academicYear);
  const [startMonth, setStartMonth] = React.useState<AcademicMonth>("June");
  const [endMonth, setEndMonth] = React.useState<AcademicMonth>("March");
  const [onboardingMonth, setOnboardingMonth] = React.useState<AcademicMonth>(
    ACADEMIC_SETUP.onboardingMonthShort,
  );
  const [status, setStatus] = React.useState<ImplementationStatus>("started-untracked");
  const [grades, setGrades] = React.useState<string[]>(GRADES);
  const [backfill, setBackfill] = React.useState<"none" | "summary" | "detailed" | "later">("summary");

  const recommendedMode = recommendMode({
    onboardingMonth,
    academicStart: startMonth,
    status,
  });
  const modeMeta = IMPLEMENTATION_MODES.find((m) => m.id === recommendedMode)!;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Academic Year Setup Wizard
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Configure your CT & AI Implementation
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Namma AI supports schools joining at any point of the academic year — you can
            start tracking from the current month and optionally backfill previous months.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <span
                key={n}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-[0.65rem] font-bold",
                  step === n
                    ? "bg-foreground text-white"
                    : step > n
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted/50 text-muted-foreground",
                )}
              >
                {step > n ? <CheckCircle2 className="h-3 w-3" /> : n}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          {step === 1 && (
            <StepBlock title="Step 1 · Academic Year">
              <RadioRow
                options={ACADEMIC_YEARS.map((y) => ({ id: y, label: y }))}
                value={academicYear}
                onChange={setAcademicYear}
              />
            </StepBlock>
          )}
          {step === 2 && (
            <StepBlock title="Step 2 · School Academic Calendar">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField label="Academic year start month" value={startMonth} onChange={(v) => setStartMonth(v as AcademicMonth)} options={ACADEMIC_MONTHS} />
                <SelectField label="Academic year end month" value={endMonth} onChange={(v) => setEndMonth(v as AcademicMonth)} options={ACADEMIC_MONTHS} />
              </div>
            </StepBlock>
          )}
          {step === 3 && (
            <StepBlock title="Step 3 · Namma AI Onboarding Month">
              <p className="mb-3 text-sm text-muted-foreground">
                When is your school starting to use Namma AI tracking?
              </p>
              <SelectField label="Onboarding month" value={onboardingMonth} onChange={(v) => setOnboardingMonth(v as AcademicMonth)} options={ACADEMIC_MONTHS} />
            </StepBlock>
          )}
          {step === 4 && (
            <StepBlock title="Step 4 · Implementation Status">
              <p className="mb-3 text-sm text-muted-foreground">
                What is your current CT & AI implementation status?
              </p>
              <RadioRow
                options={STATUS_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                value={status}
                onChange={(v) => setStatus(v as ImplementationStatus)}
              />
            </StepBlock>
          )}
          {step === 5 && (
            <StepBlock title="Step 5 · Recommended Implementation Mode">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-blue-700">
                  Recommended Mode
                </div>
                <h3 className="mt-1 font-display text-xl font-extrabold text-foreground">
                  {modeMeta.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{modeMeta.tagline}</p>
                <p className="mt-2 text-sm text-foreground">{modeMeta.description}</p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {IMPLEMENTATION_MODES.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "rounded-2xl border p-4",
                      m.id === recommendedMode
                        ? "border-blue-300 bg-blue-50/40"
                        : "border-border/60 bg-white",
                    )}
                  >
                    <div className="font-display text-sm font-extrabold text-foreground">
                      {m.name}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                  </div>
                ))}
              </div>
            </StepBlock>
          )}
          {step === 6 && (
            <StepBlock title="Step 6 · Grade Coverage">
              <div className="flex flex-wrap gap-2">
                {GRADES.map((g) => {
                  const on = grades.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrades((cur) => (on ? cur.filter((x) => x !== g) : [...cur, g]))}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold",
                        on ? "border-foreground bg-foreground text-white" : "border-border/60 bg-white text-foreground",
                      )}
                    >
                      Grade {g}
                    </button>
                  );
                })}
              </div>
            </StepBlock>
          )}
          {step === 7 && (
            <StepBlock title="Step 7 · Backfill Preference">
              <p className="mb-3 text-sm text-muted-foreground">
                Do you want to backfill previous months?
              </p>
              <RadioRow
                value={backfill}
                onChange={(v) => setBackfill(v as typeof backfill)}
                options={[
                  { id: "none", label: "No, start tracking from now" },
                  { id: "summary", label: "Yes, backfill summary only" },
                  { id: "detailed", label: "Yes, backfill detailed records" },
                  { id: "later", label: "Decide later" },
                ]}
              />
            </StepBlock>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm",
                step === 1 && "cursor-not-allowed opacity-40",
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 7 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(7, s + 1))}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/principal"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Save & open Command Centre <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-extrabold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function RadioRow({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-2xl border px-4 py-3 text-left text-sm font-semibold",
            value === o.id
              ? "border-foreground bg-foreground text-white"
              : "border-border/60 bg-white text-foreground hover:bg-muted/30",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
