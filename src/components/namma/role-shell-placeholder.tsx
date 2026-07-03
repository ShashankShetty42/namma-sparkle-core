import { motion } from "framer-motion";
import { Sparkles, Wrench } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";

type Tone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp" | "success";

const toneEyebrow: Record<Tone, string> = {
  story: "border-story/25 bg-story-soft text-story",
  explore: "border-explore/25 bg-explore-soft text-explore",
  decide: "border-decide/25 bg-decide-soft text-decide",
  reflect: "border-reflect/25 bg-reflect-soft text-reflect",
  challenge: "border-challenge/25 bg-challenge-soft text-challenge",
  bonus: "border-bonus/25 bg-bonus-soft text-bonus",
  xp: "border-xp/25 bg-xp-soft text-xp",
  success: "border-success/25 bg-success-soft text-success",
};

const toneGradient: Record<Tone, string> = {
  story: "from-story-soft via-white to-explore-soft",
  explore: "from-explore-soft via-white to-decide-soft",
  decide: "from-decide-soft via-white to-reflect-soft",
  reflect: "from-reflect-soft via-white to-story-soft",
  challenge: "from-challenge-soft via-white to-bonus-soft",
  bonus: "from-bonus-soft via-white to-challenge-soft",
  xp: "from-xp-soft via-white to-bonus-soft",
  success: "from-success-soft via-white to-explore-soft",
};

/**
 * Shared placeholder used across the newly scaffolded role routes.
 * Each screen will be built out in the specified build order.
 */
export function RoleShellPlaceholder({
  eyebrow,
  title,
  description,
  tone = "story",
  step,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: Tone;
  step?: string;
}) {
  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className={cn(
            "relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br p-8 shadow-[var(--shadow-float)] md:p-12",
            toneGradient[tone],
          )}
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
          <div className="relative space-y-4 max-w-3xl">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em]",
                toneEyebrow[tone],
              )}
            >
              <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              {step ?? "Coming in the next build step."}
            </div>
            <p className="pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {LEGAL_TAGLINES.short}
            </p>
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}
