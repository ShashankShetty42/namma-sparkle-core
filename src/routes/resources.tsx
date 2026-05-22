import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Download,
  FileText,
  GraduationCap,
  Library,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Users,
  Wand2,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";

import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources · Namma AI" },
      {
        name: "description",
        content:
          "A magical library of AI explainers, parent guides, classroom packs, glossaries and watch-list videos — built for Grades 5-10.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <ResourcesPage />
    </AppShell>
  ),
});

type Tone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "Explainer" | "Workbook" | "Video" | "Glossary" | "Guide" | "Toolkit";
  tone: Tone;
  duration: string;
  audience: "Student" | "Teacher" | "Parent";
  cta: string;
};

const COLLECTIONS: Array<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
}> = [
  { id: "all", label: "Everything", icon: Library, tone: "story" },
  { id: "student", label: "For students", icon: Compass, tone: "explore" },
  { id: "teacher", label: "For teachers", icon: GraduationCap, tone: "decide" },
  { id: "parent", label: "For parents", icon: Users, tone: "reflect" },
];

const RESOURCES: Resource[] = [
  {
    id: "ai-glossary",
    title: "The Friendly AI Glossary",
    description: "60 magical words explained kid-style — from algorithm to zero-shot.",
    type: "Glossary",
    tone: "story",
    duration: "15 min read",
    audience: "Student",
    cta: "Open glossary",
  },
  {
    id: "prompt-handbook",
    title: "Prompting Like a Pro · Mini Handbook",
    description: "How to talk to chatbots so they actually understand you. With 20 worked examples.",
    type: "Workbook",
    tone: "explore",
    duration: "8 pages · PDF",
    audience: "Student",
    cta: "Download PDF",
  },
  {
    id: "ai-everyday",
    title: "Spot AI in Your Day",
    description: "A printable scavenger hunt to find AI in homes, schools, and cities.",
    type: "Workbook",
    tone: "decide",
    duration: "Printable · PDF",
    audience: "Student",
    cta: "Download sheet",
  },
  {
    id: "watch-ai",
    title: "Watch & Wonder · 6 short films",
    description: "Curated, age-safe videos that explain neural nets, robots, and AI ethics.",
    type: "Video",
    tone: "challenge",
    duration: "≈ 45 min total",
    audience: "Student",
    cta: "Open playlist",
  },
  {
    id: "teacher-pack",
    title: "Week-by-Week Classroom Pack",
    description: "35 weekly lesson outlines, discussion prompts and a printable wall map.",
    type: "Toolkit",
    tone: "bonus",
    duration: "PDF + slides",
    audience: "Teacher",
    cta: "Get the pack",
  },
  {
    id: "rubrics",
    title: "Creator-Challenge Rubrics",
    description: "Light-touch rubrics for the advanced & expert challenges — no grading, just guidance.",
    type: "Guide",
    tone: "reflect",
    duration: "PDF · 4 pages",
    audience: "Teacher",
    cta: "Download",
  },
  {
    id: "parent-guide",
    title: "Parent Conversation Guide",
    description: "Talking points and safety basics for AI conversations at the dinner table.",
    type: "Guide",
    tone: "xp",
    duration: "10 min read",
    audience: "Parent",
    cta: "Read guide",
  },
  {
    id: "safety-card",
    title: "AI Safety Quick-Card",
    description: "A single page of friendly do's & don'ts you can stick on the fridge.",
    type: "Guide",
    tone: "explore",
    duration: "Printable · PDF",
    audience: "Parent",
    cta: "Download card",
  },
  {
    id: "explainer-bias",
    title: "How AI Learns (And Where It Gets Things Wrong)",
    description: "A 6-minute explainer with characters Neo, Dev and Anaya. Bias, fairness, and care.",
    type: "Explainer",
    tone: "challenge",
    duration: "6 min watch",
    audience: "Student",
    cta: "Play video",
  },
];

const TYPE_ICON: Record<Resource["type"], React.ComponentType<{ className?: string }>> = {
  Explainer: BookOpen,
  Workbook: FileText,
  Video: PlayCircle,
  Glossary: Wand2,
  Guide: BookOpen,
  Toolkit: Library,
};

function ResourcesPage() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");

  const filtered = RESOURCES.filter((r) => {
    if (filter === "student" && r.audience !== "Student") return false;
    if (filter === "teacher" && r.audience !== "Teacher") return false;
    if (filter === "parent" && r.audience !== "Parent") return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });

  return (
    <div className="shell-inner !gap-8">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: nammaEase }}
        className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-reflect-soft via-white to-bonus-soft p-8 shadow-[var(--shadow-float)] md:p-10"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-bonus/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-reflect/25 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-bonus-soft px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-bonus">
              <Library className="h-3 w-3" /> Resources Library
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              A{" "}
              <span className="bg-gradient-to-r from-bonus via-reflect to-explore bg-clip-text text-transparent">
                little library
              </span>{" "}
              of AI wonders.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Explainers, workbooks, parent guides and curated videos — each one
              hand-picked, age-safe, and ready for the classroom or kitchen
              table.
            </p>

            <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/85 px-4 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur md:max-w-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides, glossaries, videos…"
                className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="relative hidden h-56 items-end justify-center md:flex">
            <div className="absolute h-56 w-56 rounded-full bg-gradient-to-br from-bonus/30 to-reflect/30 blur-3xl" />
            <motion.img
              src={anayaHappy}
              alt="Anaya"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative h-52 w-52 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]"
            />
          </div>
        </div>
      </motion.section>

      {/* COLLECTION FILTERS */}
      <section className="flex flex-wrap items-center gap-2">
        {COLLECTIONS.map((c) => {
          const Icon = c.icon;
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition-all",
                active
                  ? "border-foreground/80 bg-foreground text-background shadow-[var(--shadow-soft)]"
                  : "border-white/70 bg-white/80 text-foreground hover:-translate-y-0.5 hover:border-foreground/30",
              )}
            >
              <Icon className="h-4 w-4" />
              {c.label}
            </button>
          );
        })}
      </section>

      {/* CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, i) => {
          const Icon = TYPE_ICON[r.type];
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: nammaEase }}
              className={cn(
                "group relative overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                `border-${r.tone}/25`,
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full blur-3xl opacity-70 transition-opacity group-hover:opacity-100",
                  `bg-${r.tone}/30`,
                )}
              />
              <div className="relative flex items-start justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
                    `bg-${r.tone}-soft text-${r.tone}`,
                  )}
                >
                  <Icon className="h-3 w-3" /> {r.type}
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {r.audience}
                </span>
              </div>
              <h3 className="relative mt-4 font-display text-lg font-extrabold leading-tight text-foreground">
                {r.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
              <div className="relative mt-5 flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {r.duration}
                </span>
                <Button
                  size="sm"
                  variant="soft"
                  className={cn("rounded-xl", `text-${r.tone}`)}
                >
                  {r.type === "Workbook" || r.type === "Guide" || r.type === "Toolkit" ? (
                    <Download className="mr-1 h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                  )}
                  {r.cta}
                </Button>
              </div>
            </motion.article>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-[26px] border border-dashed border-muted-foreground/30 bg-white/60 p-10 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-bold text-foreground">
            Nothing matches that yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different word — or clear the filters.
          </p>
        </div>
      )}

      {/* Closing strip */}
      <section className="rounded-[24px] border border-dashed border-foreground/10 bg-white/60 p-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-xp" />
          Coming soon
        </div>
        <p className="mt-2 text-sm text-foreground/80">
          A monthly downloadable workbook, Tamil-medium translations, and a
          parent newsletter — all crafted by the Namma team.
        </p>
      </section>
    </div>
  );
}
