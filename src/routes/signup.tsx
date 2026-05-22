import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  School,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { BrandMark } from "@/components/namma/brand-mark";
import { labelToBand, saveProfile, signIn } from "@/lib/namma-progress";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account · Namma AI" }] }),
  component: SignupPage,
});

const GRADES = ["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
const AVATAR_COLORS = [
  { id: "violet", className: "from-bonus to-challenge" },
  { id: "ocean", className: "from-explore to-reflect" },
  { id: "sunrise", className: "from-xp to-challenge" },
  { id: "forest", className: "from-success to-explore" },
  { id: "rose", className: "from-challenge to-bonus" },
  { id: "sky", className: "from-reflect to-story" },
];
const BUDDIES = [
  { id: "neo" as const, name: "Neo", src: neoCelebrating, tone: "story" },
  { id: "dev" as const, name: "Dev", src: devHappy, tone: "decide" },
  { id: "anaya" as const, name: "Anaya", src: anayaHappy, tone: "reflect" },
];

function SignupPage() {
  const navigate = useNavigate();
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [grade, setGrade] = React.useState("Grade 7");
  const [school, setSchool] = React.useState("");
  const [parentEmail, setParentEmail] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [color, setColor] = React.useState("violet");
  const [favorite, setFavorite] = React.useState<"neo" | "dev" | "anaya">("neo");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !email.trim() || !password.trim() || !school.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const fullName = `${first.trim()} ${last.trim()}`.trim();
    saveProfile({
      name: fullName,
      gradeLabel: grade,
      gradeBand: labelToBand(grade),
      avatarColorId: color,
      favorite,
      onboarded: true,
    });
    signIn({ role: "student", email: email.trim(), schoolCode: school.trim() });
    setLoading(false);
    toast.success(`Welcome to Namma AI, ${first}! ✨`, {
      description: "Your adventure is ready.",
    });
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-story-soft via-background to-explore-soft py-6">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-bonus/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-reflect/25 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/welcome" className="inline-flex items-center gap-2.5">
          <BrandMark size={40} />
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Namma <span className="text-primary">AI</span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="rounded-2xl">
          <Link to="/welcome">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-10 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(80,40,180,0.35)] md:p-9"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-bonus-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
            <Sparkles className="h-3.5 w-3.5" /> Create your explorer
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
            Join the{" "}
            <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
              AI adventure
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A few quick steps and you&apos;re in. Teachers and admins — please contact your school.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={<User className="h-4 w-4" />} label="First name">
                <Input value={first} onChange={(e) => setFirst(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
              </Field>
              <Field icon={<User className="h-4 w-4" />} label="Last name">
                <Input value={last} onChange={(e) => setLast(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={<School className="h-4 w-4" />} label="School name">
                <Input value={school} onChange={(e) => setSchool(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
              </Field>
              <div>
                <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Grade
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={cn(
                        "rounded-2xl border-2 px-2 py-2 text-xs font-bold transition-all",
                        grade === g
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/10 bg-white text-foreground hover:border-foreground/30",
                      )}
                    >
                      {g.replace("Grade ", "G")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={<Mail className="h-4 w-4" />} label="Student email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
              </Field>
              <Field icon={<Mail className="h-4 w-4" />} label="Parent email">
                <Input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
              </Field>
            </div>

            <Field icon={<Sparkles className="h-4 w-4" />} label="Password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50" />
            </Field>

            <div>
              <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Avatar color
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={cn(
                      "h-10 w-10 rounded-2xl bg-gradient-to-br transition-all",
                      c.className,
                      color === c.id
                        ? "ring-4 ring-foreground/80 ring-offset-2 ring-offset-white scale-110"
                        : "hover:scale-105",
                    )}
                    aria-label={c.id}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Favorite guide
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {BUDDIES.map((b) => {
                  const active = favorite === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFavorite(b.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border-2 bg-white/85 p-3 text-center transition-all",
                        active
                          ? `border-${b.tone}/60 ring-2 ring-${b.tone}/40 shadow-[var(--shadow-float)]`
                          : "border-white hover:-translate-y-0.5 hover:border-foreground/20",
                      )}
                    >
                      <img src={b.src} alt={b.name} className="mx-auto h-20 w-20 object-contain animate-[namma-float_5s_ease-in-out_infinite]" />
                      <div className="mt-1 font-display text-sm font-extrabold text-foreground">{b.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-bonus via-challenge to-explore text-white shadow-[var(--shadow-glow)]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating your portal…
                </>
              ) : (
                <>
                  Start my adventure <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" search={{ role: "student" }} className="font-bold text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
