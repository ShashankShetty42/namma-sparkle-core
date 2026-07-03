import * as React from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  QrCode,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  COMPLETION_PHASES,
  getCompletion,
  onCompletionState,
  setPhase,
} from "@/lib/namma-completion";
import {
  codeIsIssued,
  getMissionsForGrade,
  parseCompletionCode,
  SELF_SCHOOL,
  SELF_STUDENT,
} from "@/lib/namma-missions";
import { getProfile, onNammaState } from "@/lib/namma-progress";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";

export const Route = createFileRoute("/verify/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Verify ${params.code} · Namma AI` },
      {
        name: "description",
        content:
          "Verify a Namma AI mission completion code and, if you're the teacher, approve it in one tap.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyPage,
});

function useTick() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setT((x) => x + 1);
    const a = onCompletionState(bump);
    const b = onNammaState(bump);
    return () => {
      a();
      b();
    };
  }, []);
  return t;
}

function VerifyPage() {
  const { code } = useParams({ from: "/verify/$code" });
  const tick = useTick();

  const parsed = parseCompletionCode(code);
  const issued = parsed.ok ? codeIsIssued(code) : false;

  const details = React.useMemo(() => {
    if (!parsed.ok) return null;
    const profile = getProfile();
    const missions = getMissionsForGrade(parsed.grade);
    const mission = missions[parsed.missionIndex - 1];
    const gradeLabel = `Grade ${parsed.grade}`;
    const state = getCompletion(SELF_SCHOOL, SELF_STUDENT, gradeLabel, parsed.missionIndex);
    return { profile, mission, gradeLabel, state };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, parsed.ok && `${parsed.grade}-${parsed.missionIndex}`]);

  if (!parsed.ok) {
    return (
      <AppShell>
        <div className="shell-inner !gap-6">
          <InvalidCard code={code} error={parsed.error} />
        </div>
      </AppShell>
    );
  }

  if (!details) {
    return (
      <AppShell>
        <div className="shell-inner !gap-6">
          <InvalidCard code={code} error="Could not load mission details." />
        </div>
      </AppShell>
    );
  }

  const { mission, gradeLabel, state } = details;
  const doneCount = COMPLETION_PHASES.filter((p) => state[p]).length;
  const studentPhasesDone = COMPLETION_PHASES.filter((p) => p !== "approval").every(
    (p) => state[p],
  );

  function toggleApproval() {
    setPhase(
      SELF_SCHOOL,
      SELF_STUDENT,
      gradeLabel,
      parsed.ok ? parsed.missionIndex : 1,
      "approval",
      !state.approval,
    );
    toast.success(state.approval ? "Approval removed" : "Approved! Great work.");
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : `/verify/${code}`,
  )}`;

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className={cn(
            "relative overflow-hidden rounded-[36px] border border-white/70 p-6 shadow-[var(--shadow-float)] md:p-10",
            state.approval
              ? "bg-gradient-to-br from-success-soft via-white to-story-soft"
              : "bg-gradient-to-br from-explore-soft via-white to-reflect-soft",
          )}
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/25 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center">
            <div className="space-y-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em]",
                  state.approval
                    ? "bg-success/10 text-success"
                    : "bg-explore/10 text-explore",
                )}
              >
                {state.approval ? (
                  <>
                    <ShieldCheck className="h-3 w-3" /> Verified &amp; approved
                  </>
                ) : (
                  <>
                    <ScanLine className="h-3 w-3" /> Awaiting teacher approval
                  </>
                )}
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                {mission.title}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                {gradeLabel} · Mission {parsed.missionIndex} · Focus{" "}
                <span className="font-semibold text-foreground">{mission.focus}</span>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <code className="rounded-2xl border border-foreground/10 bg-white/95 px-4 py-2.5 font-mono text-sm font-bold tracking-wider text-foreground shadow-[var(--shadow-soft)]">
                  {code.toUpperCase()}
                </code>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => {
                    navigator.clipboard?.writeText(code.toUpperCase());
                    toast.success("Copied!");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                {issued ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-success">
                    <CheckCircle2 className="h-3 w-3" /> Genuine code
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-challenge-soft px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
                    <ShieldAlert className="h-3 w-3" /> Not on this device
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="rounded-[24px] border border-white/70 bg-white p-3 shadow-[var(--shadow-soft)]">
                <img
                  src={qrSrc}
                  alt={`QR code for ${code}`}
                  width={168}
                  height={168}
                  className="h-40 w-40 rounded-xl"
                />
                <div className="mt-2 flex items-center justify-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <QrCode className="h-3 w-3" /> Scan to share
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Phase summary */}
        <section className="section-panel">
          <div className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> Mission summary
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-foreground md:text-2xl">
            {doneCount} of {COMPLETION_PHASES.length} steps completed
          </h2>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {COMPLETION_PHASES.map((ph) => (
              <div
                key={ph}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-3 py-2.5",
                  state[ph]
                    ? "border-success/30 bg-success-soft/60"
                    : "border-foreground/10 bg-foreground/[0.03]",
                )}
              >
                {state[ph] ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="text-sm font-semibold capitalize text-foreground">{ph}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Teacher approval action */}
        <section
          className={cn(
            "relative overflow-hidden rounded-[28px] border p-6 shadow-[var(--shadow-soft)]",
            state.approval
              ? "border-success/30 bg-gradient-to-br from-success-soft via-white to-story-soft"
              : "border-decide/30 bg-gradient-to-br from-decide-soft via-white to-explore-soft",
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-decide">
                <ShieldCheck className="h-3 w-3" /> Teacher approval
              </div>
              <h3 className="mt-2 font-display text-xl font-extrabold text-foreground">
                {state.approval
                  ? "Approved — mission complete."
                  : studentPhasesDone
                    ? "All 5 student steps are done. Ready to approve?"
                    : "Student still needs to finish steps 1–5."}
              </h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Teachers can approve or unapprove right here. The completion code stays valid once
                it's issued.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentPhasesDone ? (
                <Button
                  variant={state.approval ? "soft" : "hero"}
                  onClick={toggleApproval}
                  size="lg"
                >
                  {state.approval ? (
                    <>
                      <XCircle className="h-4 w-4" /> Remove approval
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4" /> Approve mission
                    </>
                  )}
                </Button>
              ) : null}
              <Button asChild variant="ghost" size="sm">
                <Link to="/teacher/verify">
                  <ScanLine className="h-4 w-4" /> Verify another
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
          {LEGAL_TAGLINES.short}
        </p>
      </div>
    </AppShell>
  );
}

function InvalidCard({ code, error }: { code: string; error: string }) {
  return (
    <div className="rounded-[28px] border border-challenge/30 bg-challenge-soft/40 p-8 text-center shadow-[var(--shadow-soft)]">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-challenge">
        <ShieldAlert className="h-5 w-5" />
      </span>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
        This code doesn't look right
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {error} Codes look like{" "}
        <code className="rounded-md bg-white/70 px-1.5 py-0.5 font-mono text-xs">
          NAI-G6-M03-ARAV-4821
        </code>
        . You tried:
      </p>
      <code className="mt-3 inline-block rounded-2xl border border-foreground/10 bg-white/90 px-3 py-2 font-mono text-sm text-foreground">
        {code}
      </code>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button asChild variant="hero" size="sm">
          <Link to="/teacher/verify">
            <ScanLine className="h-4 w-4" /> Enter another code
          </Link>
        </Button>
        <Button asChild variant="soft" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
