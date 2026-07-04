import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { FUTURE_PROGRAMS } from "@/lib/namma-programs";

export const Route = createFileRoute("/principal/future-programs")({
  head: () => ({ meta: [{ title: "Future Programs · Namma AI" }] }),
  component: FuturePrograms,
});

function FuturePrograms() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <Link
            to="/principal/programs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Active Programs
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Future Implementation Areas
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            What's next for your school
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            The same implementation, evidence and reporting framework will support these
            new-age skill programs. Contact Namma AI to activate any of them for the next
            academic year.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FUTURE_PROGRAMS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="relative rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
              >
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-2.5 w-2.5" /> Coming Soon
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted/50 text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-extrabold text-foreground">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Grades {p.grades}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
