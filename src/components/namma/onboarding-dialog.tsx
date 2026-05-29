import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PROFILE,
  getAuth,
  getProfile,
  markStudentOnboarded,
  saveProfile,
  type NammaProfile,
} from "@/lib/namma-progress";
import { nammaEase } from "@/components/namma/motion";


import neoExplaining from "@/assets/characters/neo-explaining.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

const CHARACTERS: Array<{
  id: NammaProfile["favorite"];
  name: string;
  vibe: string;
  src: string;
  tone: string;
}> = [
  { id: "neo", name: "Neo", vibe: "Curious & adventurous", src: neoCelebrating, tone: "story" },
  { id: "dev", name: "Dev", vibe: "Logical & sharp", src: devHappy, tone: "decide" },
  { id: "anaya", name: "Anaya", vibe: "Kind & creative", src: anayaHappy, tone: "reflect" },
];

const GRADES = ["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

const AVATAR_COLORS = [
  { id: "violet", className: "from-bonus to-challenge" },
  { id: "ocean", className: "from-explore to-reflect" },
  { id: "sunrise", className: "from-xp to-challenge" },
  { id: "forest", className: "from-success to-explore" },
  { id: "rose", className: "from-challenge to-bonus" },
  { id: "sky", className: "from-reflect to-story" },
];

const AVATAR_ICONS = ["sparkles", "rocket", "star", "wand", "compass", "crown"];
const AVATAR_EMOJI: Record<string, string> = {
  sparkles: "✨",
  rocket: "🚀",
  star: "⭐",
  wand: "🪄",
  compass: "🧭",
  crown: "👑",
};

type Draft = Pick<
  NammaProfile,
  "favorite" | "avatarColorId" | "avatarIconId"
>;

const STEPS = ["welcome", "character", "avatar", "ready"] as const;
type Step = (typeof STEPS)[number];

export function OnboardingDialog() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>("welcome");
  const [studentName, setStudentName] = React.useState<string>("Explorer");
  const [gradeLabel, setGradeLabel] = React.useState<string>(DEFAULT_PROFILE.gradeLabel);
  const [draft, setDraft] = React.useState<Draft>({
    favorite: DEFAULT_PROFILE.favorite,
    avatarColorId: DEFAULT_PROFILE.avatarColorId,
    avatarIconId: DEFAULT_PROFILE.avatarIconId,
  });

  React.useEffect(() => {
    // Small delay so it doesn't fight with first paint animations.
    const id = window.setTimeout(() => {
      const auth = getAuth();
      // Onboarding is only meant for students — admins and teachers skip it.
      if (auth.role !== "student") return;
      const p = getProfile();
      if (p.onboarded) return;
      setStudentName(p.name || "Explorer");
      setGradeLabel(p.gradeLabel);
      setDraft({
        favorite: p.favorite,
        avatarColorId: p.avatarColorId,
        avatarIconId: p.avatarIconId,
      });
      setOpen(true);
    }, 600);
    return () => window.clearTimeout(id);
  }, []);

  const idx = STEPS.indexOf(step);
  const total = STEPS.length;
  const canNext = true;

  const goNext = () => {
    if (!canNext) return;
    if (step === "ready") {
      finish();
      return;
    }
    setStep(STEPS[Math.min(idx + 1, total - 1)]);
  };
  const goBack = () => setStep(STEPS[Math.max(idx - 1, 0)]);

  const finish = () => {
    saveProfile({
      favorite: draft.favorite,
      avatarColorId: draft.avatarColorId,
      avatarIconId: draft.avatarIconId,
      onboarded: true,
    });
    // Persist per-student onboarded flag so it never re-opens on later logins.
    const auth = getAuth();
    if (auth.role === "student" && auth.schoolCode && auth.email) {
      markStudentOnboarded(auth.schoolCode, auth.email);
    }
    setOpen(false);
    const fav = CHARACTERS.find((c) => c.id === draft.favorite)!;
    toast.success(`Welcome aboard, ${studentName}!`, {
      description: `${fav.name} can't wait to start this adventure with you. ✨`,
      duration: 5000,
    });
  };


  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        // Block accidental dismiss; require finish.
        if (v) setOpen(true);
      }}
    >
      <DialogContent
        className="max-w-3xl max-h-[92dvh] overflow-y-auto overscroll-contain border-none bg-transparent p-0 shadow-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-explore-soft p-5 shadow-[0_40px_120px_-30px_rgba(80,40,180,0.45)] sm:rounded-[32px] sm:p-6 md:p-10">
          {/* ambient glow */}
          <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-bonus/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-10 h-72 w-72 rounded-full bg-explore/30 blur-3xl" />

          {/* step rail */}
          <div className="relative mb-6 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  i <= idx ? "bg-foreground/80" : "bg-foreground/10",
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: nammaEase }}
              className="relative min-h-[260px] sm:min-h-[340px]"
            >
              {step === "welcome" && (
                <StepWelcome name={studentName} gradeLabel={gradeLabel} />
              )}
              {step === "character" && (
                <StepCharacter
                  value={draft.favorite}
                  onChange={(v) => setDraft((d) => ({ ...d, favorite: v }))}
                />
              )}
              {step === "avatar" && (
                <StepAvatar
                  colorId={draft.avatarColorId}
                  iconId={draft.avatarIconId}
                  name={studentName}
                  onColor={(v) => setDraft((d) => ({ ...d, avatarColorId: v }))}
                  onIcon={(v) => setDraft((d) => ({ ...d, avatarIconId: v }))}
                />
              )}
              {step === "ready" && (
                <StepReady draft={draft} name={studentName} gradeLabel={gradeLabel} />
              )}

            </motion.div>
          </AnimatePresence>

          {/* nav */}
          <div className="relative mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={idx === 0}
              className="rounded-2xl"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>

            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Step {idx + 1} of {total}
            </span>

            <Button
              variant="hero"
              size="lg"
              disabled={!canNext}
              onClick={goNext}
              className="rounded-2xl"
            >
              {step === "ready" ? (
                <>Start my adventure <Sparkles className="ml-1.5 h-4 w-4" /></>
              ) : step === "welcome" ? (
                <>Let&apos;s begin <ArrowRight className="ml-1.5 h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────── Steps ────────────── */

function StepWelcome({ name, gradeLabel }: { name: string; gradeLabel: string }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_0.9fr]">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-bonus-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
          <Wand2 className="h-3.5 w-3.5" /> A magical beginning
        </span>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          Hi{" "}
          <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
            {name}
          </span>
          ! I&apos;m Neo — your guide.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Welcome to <strong className="text-foreground">Namma AI</strong> — your
          weekly adventure into artificial intelligence. Your school set you up
          as a <strong className="text-foreground">{gradeLabel}</strong> explorer.
          Let&apos;s personalize the rest in 2 quick steps.
        </p>
        <ul className="space-y-1.5 text-sm text-foreground/80">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Meet your favorite character</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Design your avatar</li>
        </ul>
      </div>

      </div>
      <div className="relative flex items-center justify-center">
        <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-story/30 via-explore/20 to-bonus/30 blur-3xl" />
        <img
          src={neoExplaining}
          alt="Neo"
          className="relative h-64 w-64 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.15)]"
        />
      </div>
    </div>
  );
}

function StepName({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_0.7fr]">
      <div className="space-y-4">
        <span className="namma-eyebrow-pill">What should we call you?</span>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          Your explorer name
        </h2>
        <p className="text-sm text-muted-foreground">
          This is the name your characters, badges, and certificates will use.
        </p>
        <Input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onEnter()}
          placeholder="e.g. Aarav, Meera, Kiran…"
          className="h-14 rounded-2xl border-2 border-foreground/15 bg-white text-lg font-display font-bold focus-visible:border-foreground/60"
          maxLength={24}
        />
      </div>
      <div className="hidden md:flex items-center justify-center">
        <div className="relative">
          <div className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-story/30 to-explore/30 blur-3xl" />
          <img
            src={anayaHappy}
            alt="Anaya"
            className="relative h-44 w-44 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </div>
  );
}

function StepGrade({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="namma-eyebrow-pill">Pick your grade</span>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          Which grade are you in?
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll tune the adventure — and unlock the right challenges — for your level.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GRADES.map((g) => {
          const active = value === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onChange(g)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all",
                active
                  ? "border-foreground/80 bg-foreground text-background shadow-[var(--shadow-float)]"
                  : "border-white/80 bg-white/80 text-foreground hover:-translate-y-0.5 hover:border-foreground/30",
              )}
            >
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-70">
                Adventurer
              </div>
              <div className="mt-1 font-display text-xl font-extrabold">{g}</div>
              {active && (
                <Check className="absolute right-3 top-3 h-4 w-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepCharacter({
  value,
  onChange,
}: {
  value: NammaProfile["favorite"];
  onChange: (v: NammaProfile["favorite"]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="namma-eyebrow-pill">Meet your guides</span>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          Who&apos;s your favorite?
        </h2>
        <p className="text-sm text-muted-foreground">
          They&apos;ll cheer you on a little louder than the others. You&apos;ll still see all three.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {CHARACTERS.map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 bg-white/85 p-4 text-center transition-all",
                active
                  ? `border-${c.tone}/60 ring-2 ring-${c.tone}/40 shadow-[var(--shadow-float)]`
                  : "border-white/80 hover:-translate-y-1 hover:border-foreground/30",
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl transition-opacity",
                  `bg-${c.tone}/30`,
                  active ? "opacity-100" : "opacity-60",
                )}
              />
              <div className="relative mx-auto h-28 w-28">
                <img
                  src={c.src}
                  alt={c.name}
                  className="h-full w-full object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_18px_22px_rgba(0,0,0,0.18)]"
                />
              </div>
              <div className="relative mt-3 font-display text-lg font-extrabold text-foreground">
                {c.name}
              </div>
              <div className="relative text-xs font-semibold text-muted-foreground">
                {c.vibe}
              </div>
              {active && (
                <span className={cn("relative mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-background", `bg-${c.tone}`)}>
                  <Check className="h-3 w-3" /> Your buddy
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepAvatar({
  colorId,
  iconId,
  name,
  onColor,
  onIcon,
}: {
  colorId: string;
  iconId: string;
  name: string;
  onColor: (v: string) => void;
  onIcon: (v: string) => void;
}) {
  const color = AVATAR_COLORS.find((c) => c.id === colorId) ?? AVATAR_COLORS[0];
  return (
    <div className="grid items-center gap-6 md:grid-cols-[0.8fr_1fr]">
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "flex h-36 w-36 items-center justify-center rounded-[32px] bg-gradient-to-br text-5xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] ring-4 ring-white",
            color.className,
          )}
        >
          <span className="drop-shadow-sm">{AVATAR_EMOJI[iconId]}</span>
        </div>
        <div className="text-center">
          <div className="font-display text-lg font-extrabold text-foreground">{name}</div>
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Your avatar
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Color
          </div>
          <div className="flex flex-wrap gap-2.5">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onColor(c.id)}
                className={cn(
                  "h-10 w-10 rounded-2xl bg-gradient-to-br transition-all",
                  c.className,
                  colorId === c.id
                    ? "ring-4 ring-foreground/80 ring-offset-2 ring-offset-white scale-110"
                    : "hover:scale-105",
                )}
                aria-label={c.id}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Icon
          </div>
          <div className="flex flex-wrap gap-2.5">
            {AVATAR_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIcon(i)}
                className={cn(
                  "h-12 w-12 rounded-2xl border-2 bg-white text-2xl transition-all",
                  iconId === i
                    ? "border-foreground/80 shadow-[var(--shadow-soft)] scale-110"
                    : "border-foreground/10 hover:border-foreground/40",
                )}
              >
                {AVATAR_EMOJI[i]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepReady({ draft }: { draft: Draft }) {
  const fav = CHARACTERS.find((c) => c.id === draft.favorite)!;
  const color = AVATAR_COLORS.find((c) => c.id === draft.avatarColorId) ?? AVATAR_COLORS[0];
  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_0.9fr]">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-success">
          <Sparkles className="h-3.5 w-3.5" /> All set
        </span>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          You&apos;re ready,{" "}
          <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
            {draft.name || "Explorer"}
          </span>
          !
        </h2>
        <div className="space-y-2 rounded-2xl border border-white/70 bg-white/70 p-4 text-sm">
          <Row label="Name" value={draft.name || "Explorer"} />
          <Row label="Grade" value={draft.gradeLabel} />
          <Row label="Buddy" value={fav.name} />
          <Row label="Avatar" value={`${AVATAR_EMOJI[draft.avatarIconId]} ${draft.avatarColorId}`} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {fav.name} is warming up the rocket. Hit start to enter your first weekly adventure.
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-center gap-3">
        <div className="absolute h-56 w-56 rounded-full bg-gradient-to-br from-bonus/30 to-explore/30 blur-3xl" />
        <div
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br text-4xl shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] ring-4 ring-white",
            color.className,
          )}
        >
          {AVATAR_EMOJI[draft.avatarIconId]}
        </div>
        <img
          src={fav.src}
          alt={fav.name}
          className="relative h-44 w-44 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}
