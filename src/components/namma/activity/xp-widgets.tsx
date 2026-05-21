import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Star, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Animated XP progress rail with label + value. */
export function XPProgressCard({
  label = "Week progress",
  valueLabel,
  percent,
  caption,
  className,
}: {
  label?: string;
  valueLabel?: string;
  percent: number;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-white/60 bg-white/65 p-4 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        {valueLabel && <span className="text-story">{valueLabel}</span>}
      </div>
      <div className="mt-3 progress-shell !h-3">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[0.72rem] text-muted-foreground">
        {caption && <span>{caption}</span>}
        <span className="font-bold text-foreground">{percent}%</span>
      </div>
    </div>
  );
}

/** Highlight upcoming reward (XP, badge). */
export function RewardPreviewCard({
  label = "Reward preview",
  reward,
  subline,
  icon,
}: {
  label?: string;
  reward: string;
  subline?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="reward-toast bg-gradient-to-br from-xp-soft via-bonus-soft to-decide-soft border-bonus/30">
      <div className="reward-toast-badge">{icon ?? <Star className="h-5 w-5" />}</div>
      <div className="leading-tight">
        <div className="mini-label !text-bonus">{label}</div>
        <div className="reward-line !text-2xl">{reward}</div>
        {subline && (
          <div className="text-[0.7rem] text-muted-foreground">{subline}</div>
        )}
      </div>
    </div>
  );
}

/** Inline achievement toast (success/hint variants). Animated in/out. */
export function AchievementToast({
  open,
  variant = "success",
  title,
  description,
  action,
}: {
  open: boolean;
  variant?: "success" | "hint";
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; icon?: ReactNode };
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "reward-toast",
            variant === "success"
              ? "border-success/40 bg-success-soft/60"
              : "border-decide/40 bg-decide-soft/60",
          )}
        >
          <div className="reward-toast-badge !bg-white">
            {variant === "success" ? (
              <Trophy className="h-5 w-5 text-success" />
            ) : (
              <Sparkles className="h-5 w-5 text-decide" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-bold text-foreground">
              {title}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
          {action && (
            <Button variant="xp" size="sm" onClick={action.onClick}>
              {action.label}
              {action.icon ?? <Gift className="h-4 w-4" />}
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
