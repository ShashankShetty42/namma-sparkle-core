import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nammaEase } from "@/components/namma/motion";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password · Namma AI" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    toast.success("Magic link sent ✨");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-story-soft via-background to-explore-soft">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-bonus/25 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/welcome" className="inline-flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-bonus via-challenge to-explore shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Namma <span className="text-primary">AI</span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="rounded-2xl">
          <Link to="/login" search={{ role: undefined }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-xl px-5 py-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(80,40,180,0.35)] md:p-9"
        >
          <div className="absolute -top-20 -right-12 h-48 w-48 opacity-90 pointer-events-none">
            <img
              src={anayaHappy}
              alt="Anaya"
              className="h-full w-full object-contain animate-[namma-float_5s_ease-in-out_infinite]"
            />
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Magic link sent
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                Check your inbox ✨
              </h1>
              <p className="text-sm text-muted-foreground">
                If <span className="font-bold text-foreground">{email}</span> matches an account,
                we&apos;ve sent a magical password reset link. It expires in 30 minutes.
              </p>
              <Button asChild variant="hero" size="lg" className="rounded-2xl">
                <Link to="/login" search={{ role: undefined }}>
                  Back to sign in <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-reflect/30 bg-reflect-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-reflect">
                <Sparkles className="h-3.5 w-3.5" /> Forgot password?
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                Anaya can help.
              </h1>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Enter the email tied to your account and we&apos;ll send a magic link
                to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@school.com"
                      className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50"
                    />
                  </div>
                </label>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full rounded-2xl bg-gradient-to-r from-reflect via-challenge to-explore text-white shadow-[var(--shadow-glow)]"
                >
                  Send magic link <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
