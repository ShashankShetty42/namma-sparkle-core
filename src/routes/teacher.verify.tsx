import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nammaEase } from "@/components/namma/motion";
import { parseCompletionCode } from "@/lib/namma-missions";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";

export const Route = createFileRoute("/teacher/verify")({
  head: () => ({
    meta: [
      { title: "Verify a completion code · Namma AI" },
      {
        name: "description",
        content:
          "Scan a QR or type a Namma AI completion code to verify and approve a student's mission.",
      },
    ],
  }),
  component: VerifyEntryPage,
});

function VerifyEntryPage() {
  const nav = useNavigate();
  const [code, setCode] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseCompletionCode(code);
    if (!parsed.ok) {
      toast.error(parsed.error);
      return;
    }
    nav({ to: "/verify/$code", params: { code: code.trim().toUpperCase() } });
  }

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-decide-soft via-white to-explore-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-decide/25 blur-3xl" />
          <div className="relative space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-decide/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-decide">
              <ShieldCheck className="h-3 w-3" /> Teacher verification
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
              Scan a QR or paste a{" "}
              <span className="bg-gradient-to-r from-decide via-explore to-story bg-clip-text text-transparent">
                completion code
              </span>
              .
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Every finished mission generates a unique code like{" "}
              <code className="rounded-md bg-white/70 px-1.5 py-0.5 font-mono text-xs">
                NAI-G6-M03-ARAV-4821
              </code>
              . Approve in one tap.
            </p>
          </div>
        </motion.section>

        <section className="section-panel">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Completion code
                </label>
                <Input
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="NAI-G6-M03-ARAV-4821"
                  className="mt-1 font-mono text-base tracking-wider"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Case-insensitive. Hyphens optional as you type.
                </p>
              </div>
              <Button type="submit" variant="hero" size="lg">
                <ScanLine className="h-4 w-4" /> Verify code
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="rounded-[24px] border border-foreground/5 bg-gradient-to-br from-white to-explore-soft/60 p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-explore">
                <QrCode className="h-3.5 w-3.5" /> How QR works
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-story" />
                  Student finishes the 5 mission steps and generates a code.
                </li>
                <li className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-story" />
                  A QR appears on their mission page — scan it with any phone.
                </li>
                <li className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-story" />
                  It opens this same verify page. Tap <strong>Approve mission</strong>.
                </li>
              </ul>
              <Button asChild variant="soft" size="sm" className="mt-4">
                <Link to="/teacher/completion">Open completion tracker</Link>
              </Button>
            </div>
          </div>

          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {LEGAL_TAGLINES.short}
          </p>
        </section>
      </div>
    </AppShell>
  );
}
