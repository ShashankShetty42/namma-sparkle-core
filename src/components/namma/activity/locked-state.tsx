import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

/** Locked overlay/placeholder card for not-yet-unlocked activities. */
export function LockedState({
  title,
  hint,
  unlockHint,
  icon,
  className,
}: {
  title: string;
  hint?: string;
  unlockHint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-locked/30 bg-locked-soft/40 p-5 text-center",
        className,
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-locked shadow-sm">
        {icon ?? <LockKeyhole className="h-5 w-5" />}
      </div>
      <div className="mt-3 font-display text-base font-bold text-foreground">{title}</div>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {unlockHint && (
        <div className="mt-3 inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[0.7rem] font-bold text-locked">
          {unlockHint}
        </div>
      )}
    </div>
  );
}
