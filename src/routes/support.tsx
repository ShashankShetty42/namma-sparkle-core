import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  School,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/namma/app-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";

import devHappy from "@/assets/characters/dev-happy.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import anayaExplaining from "@/assets/characters/anaya-explaining.png";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & Support · Namma AI" },
      {
        name: "description",
        content:
          "We're here to help. Friendly answers, guided how-tos, parent and teacher resources, and a direct line to the Namma AI team.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <SupportPage />
    </AppShell>
  ),
});

type Tone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";

const FAQ_GROUPS: Array<{
  id: string;
  label: string;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
  questions: Array<{ q: string; a: string }>;
}> = [
  {
    id: "students",
    label: "For students",
    tone: "explore",
    icon: Users,
    questions: [
      {
        q: "How long does one week of activities take?",
        a: "About 30 minutes total — perfect for a single computer-lab session or a cozy afternoon at home. You don't need to log in every day.",
      },
      {
        q: "What happens if I miss a week?",
        a: "Nothing bad! Your progress is safe. Just open the portal whenever you can — you can replay any past week or jump straight to the current one.",
      },
      {
        q: "Can I redo an activity if I want a higher score?",
        a: "Yes. Open any completed activity and choose 'Replay'. Your XP only goes up — it never goes down.",
      },
      {
        q: "What are the Advanced and Expert challenges?",
        a: "After you finish all 6 weekly activities, students in Grades 7-8 unlock 3 Advanced creator challenges, and Grades 9-10 unlock 3 Expert challenges. They're stretch missions — fun, not graded.",
      },
    ],
  },
  {
    id: "parents",
    label: "For parents",
    tone: "reflect",
    icon: Shield,
    questions: [
      {
        q: "Is Namma AI safe for my child?",
        a: "Yes. All content is age-curated for Grades 5-10, ad-free, and never asks for personal data beyond a name. The Parent Guide in Resources walks you through everything.",
      },
      {
        q: "How can I see what my child is learning?",
        a: "Each week has a clear theme on the Journey page. Open it together with your child to see what's coming up — and what they've already explored.",
      },
      {
        q: "Does my child need an account?",
        a: "Not for the portal itself — progress lives on the device. We'll introduce optional sign-in for cross-device syncing in a future update, with full parent controls.",
      },
    ],
  },
  {
    id: "teachers",
    label: "For teachers",
    tone: "decide",
    icon: School,
    questions: [
      {
        q: "Can I use Namma AI in a classroom of 30 students?",
        a: "Absolutely. Each week is designed for a single lab session. The Resources library includes a free Classroom Pack with discussion prompts, a wall map and lesson outlines for all 35 weeks.",
      },
      {
        q: "Do you offer rubrics for the creator challenges?",
        a: "Yes — light-touch, non-graded rubrics live in Resources. They're written to encourage curiosity, not judgement.",
      },
      {
        q: "Can we white-label or co-brand for our school?",
        a: "Possibly. Drop us a note below describing your school and goals — we partner with select schools each term.",
      },
    ],
  },
];

const QUICK_LINKS: Array<{
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
  cta: string;
}> = [
  {
    id: "live",
    label: "Chat with us",
    description: "Mon–Fri, 9am to 6pm IST. Usually we reply in under an hour.",
    icon: MessageCircle,
    tone: "story",
    cta: "Open live chat",
  },
  {
    id: "email",
    label: "Email the team",
    description: "Long question? Send us a note and we'll get back within a day.",
    icon: Mail,
    tone: "explore",
    cta: "hello@namma.ai",
  },
  {
    id: "guide",
    label: "Parent & Teacher hub",
    description: "Conversation guides, classroom packs, and safety basics.",
    icon: Shield,
    tone: "reflect",
    cta: "Open hub",
  },
];

function SupportPage() {
  return (
    <div className="shell-inner !gap-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: nammaEase }}
        className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-reflect-soft p-8 shadow-[var(--shadow-float)] md:p-10"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-story/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-reflect/25 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-story/30 bg-story-soft px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-story">
              <LifeBuoy className="h-3 w-3" /> Help & Support
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              We&apos;re{" "}
              <span className="bg-gradient-to-r from-story via-reflect to-explore bg-clip-text text-transparent">
                right here
              </span>{" "}
              with you.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Friendly answers for students, parents and teachers — plus a
              direct line to the Namma team. No bots pretending to be people.
            </p>
          </div>

          <div className="relative hidden h-56 items-end justify-center md:flex">
            <motion.img
              src={devHappy}
              alt="Dev"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-2 left-2 h-36 w-36 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
            />
            <motion.img
              src={neoExplaining}
              alt="Neo"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-48 w-48 object-contain animate-[namma-float_4.6s_ease-in-out_infinite]"
            />
            <motion.img
              src={anayaExplaining}
              alt="Anaya"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-2 right-2 h-36 w-36 object-contain animate-[namma-float_5.2s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </motion.section>

      {/* QUICK LINKS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((q, i) => {
          const Icon = q.icon;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: nammaEase }}
              className={cn(
                "group relative overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                `border-${q.tone}/25`,
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl",
                  `bg-${q.tone}/30`,
                )}
              />
              <div className={cn("relative inline-flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${q.tone}-soft text-${q.tone}`)}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-4 font-display text-lg font-extrabold text-foreground">
                {q.label}
              </h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">
                {q.description}
              </p>
              <Button
                size="sm"
                variant="soft"
                className="relative mt-4 rounded-xl"
                onClick={() =>
                  toast(`${q.label}`, {
                    description: "We'll be ready in a moment — check back soon.",
                  })
                }
              >
                {q.cta}
              </Button>
            </motion.div>
          );
        })}
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-explore-soft text-explore">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              Frequently asked
            </h2>
            <p className="text-sm text-muted-foreground">
              Three sections — for students, parents and teachers.
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          {FAQ_GROUPS.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className={cn(
                  "relative overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur",
                  `border-${g.tone}/25`,
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -top-14 -right-14 h-32 w-32 rounded-full blur-3xl",
                    `bg-${g.tone}/25`,
                  )}
                />
                <div className="relative flex items-center gap-3">
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", `bg-${g.tone}-soft text-${g.tone}`)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-base font-extrabold text-foreground">
                    {g.label}
                  </h3>
                </div>
                <Accordion type="single" collapsible className="relative mt-3">
                  {g.questions.map((qa, qi) => (
                    <AccordionItem key={qi} value={`${g.id}-${qi}`} className="border-foreground/10">
                      <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                        <span className="flex-1 pr-2">{qa.q}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {qa.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <ContactPanel />
    </div>
  );
}

function ContactPanel() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Add your name and a short note so we can reply.");
      return;
    }
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Message sent ✨", {
      description: "We usually reply within one school day.",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: nammaEase }}
      className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-bonus-soft via-white to-story-soft p-6 shadow-[var(--shadow-soft)] md:p-8"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-bonus/25 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <span className="namma-eyebrow-pill"><Sparkles className="h-3.5 w-3.5" /> Still stuck?</span>
          <h3 className="font-display text-2xl font-extrabold text-foreground">
            Send the Namma team a note.
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            One of us — a real human — will reply. We love hearing from students,
            parents and teachers alike.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-2 border-foreground/10 bg-white focus-visible:border-foreground/50"
            />
            <Input
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-12 rounded-xl border-2 border-foreground/10 bg-white focus-visible:border-foreground/50"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind…"
            rows={4}
            className="w-full rounded-xl border-2 border-foreground/10 bg-white p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
          />
          <div className="flex items-center justify-end">
            <Button type="submit" variant="hero">
              Send message <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
