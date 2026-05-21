import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, Check, Cpu } from "lucide-react";

import { fadeUp } from "@/components/namma/motion";
import { SectionHeader } from "./section-header";

export type StoryStep = {
  icon: ReactNode;
  title: string;
  sub: string;
};

/** Step-by-step roadmap card grid for an activity's storyline. */
export function StoryFlow({
  steps,
  currentStep,
  completed,
  onSelectStep,
  title = "Your path through the lesson",
  copy = "Tap any step to jump. Your guide unlocks the next part as you finish.",
  layoutId = "story-active",
}: {
  steps: StoryStep[];
  currentStep: number;
  completed: Set<number>;
  onSelectStep: (i: number) => void;
  title?: string;
  copy?: string;
  /** Unique layoutId — set per-activity if multiple StoryFlows render simultaneously. */
  layoutId?: string;
}) {
  return (
    <motion.section {...fadeUp} className="section-panel">
      <SectionHeader
        tone="story"
        eyebrow="Story flow"
        eyebrowIcon={<BookOpen className="h-4 w-4" />}
        title={title}
        copy={copy}
        actions={
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-bold text-muted-foreground">
            <Cpu className="h-3.5 w-3.5 text-story" /> Adaptive learning path
          </div>
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {steps.map((s, i) => {
          const isDone = completed.has(i);
          const isActive = i === currentStep;
          return (
            <motion.button
              key={s.title}
              onClick={() => onSelectStep(i)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className={[
                "group relative flex flex-col items-start gap-3 rounded-[22px] border p-4 text-left transition-all",
                isActive
                  ? "border-story/40 bg-gradient-to-br from-story-soft via-white to-explore-soft shadow-[var(--shadow-float)]"
                  : isDone
                  ? "border-success/30 bg-success-soft/40"
                  : "border-border/70 bg-card/70 hover:border-primary/30",
              ].join(" ")}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    isDone
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-story text-white"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s.icon}
                </span>
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="font-display text-sm font-bold text-foreground">{s.title}</div>
                <div className="text-[0.72rem] text-muted-foreground">{s.sub}</div>
              </div>
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="pointer-events-none absolute inset-0 rounded-[22px] ring-2 ring-story/40"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
