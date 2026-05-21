import * as React from "react";
import { motion } from "framer-motion";
import { Check, Wand2 } from "lucide-react";

import { fadeUp } from "@/components/namma/motion";
import { SpeechBubble } from "./speech-bubble";
import { AchievementToast } from "./xp-widgets";

export type QuizOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type QuizCardProps = {
  question: string;
  options: QuizOption[];
  eyebrow?: string;
  title?: string;
  description?: string;
  helperCharacter?: {
    image: string;
    name: string;
    label?: string;
    message: string;
  };
  onCorrect?: () => void;
  correctTitle?: string;
  correctDescription?: string;
  wrongTitle?: string;
  wrongDescription?: string;
  claimLabel?: string;
};

/** Single-pick quiz card with animated feedback toast. */
export function QuizCard({
  question,
  options,
  eyebrow = "Mini quiz",
  title = "Quick brain workout!",
  description = "Pick the answer that fits best.",
  helperCharacter,
  onCorrect,
  correctTitle = "Brilliant! +20 XP unlocked",
  correctDescription,
  wrongTitle = "Almost! Try again 🪄",
  wrongDescription,
  claimLabel = "Claim",
}: QuizCardProps) {
  const [picked, setPicked] = React.useState<string | null>(null);
  const correct = !!(picked && options.find((o) => o.id === picked)?.correct);

  return (
    <motion.section {...fadeUp} className="section-panel relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-challenge/15 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col items-start gap-4">
          <div className="eyebrow !text-challenge !border-challenge/20 !bg-challenge/10">
            <Wand2 className="h-4 w-4" /> {eyebrow}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-foreground">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          {helperCharacter && (
            <SpeechBubble
              tone="explore"
              characterImage={helperCharacter.image}
              characterName={helperCharacter.name}
              label={helperCharacter.label ?? `${helperCharacter.name} cheers`}
              className="bg-gradient-to-br from-explore-soft/70 to-white"
            >
              {helperCharacter.message}
            </SpeechBubble>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[22px] border border-border/70 bg-card/85 p-5">
            <div className="mini-label">Question</div>
            <p className="mt-2 font-display text-lg font-bold text-foreground md:text-xl">
              {question}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.map((o) => {
                const isPicked = picked === o.id;
                const showCorrect = picked !== null && o.correct;
                const showWrong = isPicked && !o.correct;
                return (
                  <motion.button
                    key={o.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (picked) return;
                      setPicked(o.id);
                      if (o.correct) onCorrect?.();
                    }}
                    className={[
                      "group relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                      showCorrect
                        ? "border-success/50 bg-success-soft/60"
                        : showWrong
                        ? "border-destructive/40 bg-destructive/10"
                        : "border-border/70 bg-white/80 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold uppercase",
                        showCorrect
                          ? "bg-success text-white"
                          : showWrong
                          ? "bg-destructive text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                      ].join(" ")}
                    >
                      {showCorrect ? <Check className="h-4 w-4" /> : o.id}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{o.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AchievementToast
            open={picked !== null}
            variant={correct ? "success" : "hint"}
            title={correct ? correctTitle : wrongTitle}
            description={correct ? correctDescription : wrongDescription}
            action={correct ? { label: claimLabel } : undefined}
          />
        </div>
      </div>
    </motion.section>
  );
}
