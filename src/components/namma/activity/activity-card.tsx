import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Tone, toneSoft, toneGradient } from "./tones";
import { Tag } from "./tag";

export type ActivityCardProps = {
  tone: Tone;
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  xp?: number;
  duration?: string;
  tags?: { tone: Tone; label: string }[];
  ctaLabel?: string;
  onClick?: () => void;
  locked?: boolean;
  unlockHint?: string;
};

/**
 * Generic activity tile for grids (Story, Explore, Decide, Reflect, Challenge…).
 * Works for both unlocked and locked states.
 */
export function ActivityCard({
  tone,
  eyebrow,
  title,
  description,
  icon,
  xp,
  duration,
  tags = [],
  ctaLabel = "Start activity",
  onClick,
  locked = false,
  unlockHint,
}: ActivityCardProps) {
  return (
    <motion.article
      whileHover={locked ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={cn(
        "relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] border bg-gradient-to-br p-5",
        toneGradient[tone],
        locked && "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("preview-icon !h-12 !w-12", toneSoft[tone])}>
          {locked ? <LockKeyhole className="h-5 w-5" /> : icon}
        </span>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </span>
          {duration && (
            <span className="text-[0.7rem] font-semibold text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-extrabold text-foreground">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Tag key={t.label} tone={t.tone}>
              {t.label}
            </Tag>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between pt-2">
        {typeof xp === "number" && (
          <div className="text-xs font-bold text-bonus">+{xp} XP</div>
        )}
        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[0.7rem] font-bold text-locked">
            <LockKeyhole className="h-3 w-3" />
            {unlockHint ?? "Locked"}
          </span>
        ) : (
          <Button variant="soft" size="sm" onClick={onClick}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.article>
  );
}
