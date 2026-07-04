import * as React from "react";
import { ChevronDown, Lock } from "lucide-react";
import { PROGRAMS, ACTIVE_PROGRAM } from "@/lib/namma-programs";
import { cn } from "@/lib/utils";

/**
 * Compact "Implementation Program" selector. Active program is selectable;
 * every other program is disabled and tagged as Coming Soon.
 */
export function ProgramSelector({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Icon = ACTIVE_PROGRAM.icon;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Implementation Program
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1 inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/30"
      >
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-decide/10 text-decide">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span>{ACTIVE_PROGRAM.name}</span>
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-700">
          Active
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-1 w-[280px] rounded-2xl border border-border/60 bg-white p-2 shadow-lg">
          {PROGRAMS.map((p) => {
            const active = p.status === "active";
            const PIcon = p.icon;
            return (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2 py-2 text-xs",
                  active
                    ? "bg-decide/5 font-semibold text-foreground"
                    : "cursor-not-allowed text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-lg",
                    active ? "bg-decide/10 text-decide" : "bg-muted/50 text-muted-foreground",
                  )}
                >
                  <PIcon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1">{p.name}</span>
                {active ? (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-emerald-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" /> Soon
                  </span>
                )}
              </div>
            );
          })}
          <div className="mt-1 border-t border-border/40 px-2 pt-2 text-[0.65rem] text-muted-foreground">
            Future programs unlock once your school activates them.
          </div>
        </div>
      )}
    </div>
  );
}
