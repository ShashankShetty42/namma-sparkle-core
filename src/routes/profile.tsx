import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  Brush,
  Check,
  Edit3,
  Flame,
  LogOut,
  Moon,
  Music,
  Palette,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Star,
  Sun,
  Trophy,
  Volume2,
  VolumeX,
  Wand2,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase, fadeUp, floatY } from "@/components/namma/motion";
import { getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";

import neoHappy from "@/assets/characters/neo-happy.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · Namma AI" },
      {
        name: "description",
        content:
          "Your cozy identity space inside the Namma AI universe — avatar, journey snapshot, favorite guide, and simple settings.",
      },
    ],
  }),
  component: ProfilePage,
});

type Tone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";

const avatarColors: { id: string; label: string; gradient: string; ring: string }[] = [
  { id: "violet", label: "Cosmic Violet", gradient: "from-violet-400 via-fuchsia-400 to-pink-400", ring: "ring-violet-300/60" },
  { id: "ocean", label: "Ocean Wave", gradient: "from-sky-400 via-cyan-400 to-teal-400", ring: "ring-cyan-300/60" },
  { id: "sunset", label: "Sunset Glow", gradient: "from-amber-400 via-orange-400 to-rose-400", ring: "ring-orange-300/60" },
  { id: "forest", label: "Forest Spark", gradient: "from-emerald-400 via-teal-400 to-lime-400", ring: "ring-emerald-300/60" },
  { id: "berry", label: "Berry Burst", gradient: "from-pink-400 via-rose-400 to-fuchsia-500", ring: "ring-pink-300/60" },
  { id: "midnight", label: "Midnight Sky", gradient: "from-indigo-500 via-blue-500 to-purple-500", ring: "ring-indigo-300/60" },
];

const avatarIcons = [
  { id: "sparkles", icon: Sparkles, label: "Sparkles" },
  { id: "star", icon: Star, label: "Star" },
  { id: "wand", icon: Wand2, label: "Wand" },
  { id: "zap", icon: Zap, label: "Bolt" },
  { id: "trophy", icon: Trophy, label: "Trophy" },
  { id: "shield", icon: Shield, label: "Shield" },
];

const characters = [
  {
    id: "neo",
    name: "Neo",
    tagline: "Adventure buddy",
    blurb: "Bright, curious, always ready for the next quest.",
    image: neoHappy,
    gradient: "from-violet-400/30 via-fuchsia-300/20 to-transparent",
    accent: "text-violet-500",
    chip: "bg-violet-500/10 text-violet-600 border-violet-300/40",
  },
  {
    id: "dev",
    name: "Dev",
    tagline: "Logic master",
    blurb: "Calm, clever, loves breaking problems into pieces.",
    image: devHappy,
    gradient: "from-sky-400/30 via-cyan-300/20 to-transparent",
    accent: "text-sky-500",
    chip: "bg-sky-500/10 text-sky-600 border-sky-300/40",
  },
  {
    id: "anaya",
    name: "Anaya",
    tagline: "Creative thinker",
    blurb: "Warm, imaginative, sees magic in every idea.",
    image: anayaHappy,
    gradient: "from-pink-400/30 via-rose-300/20 to-transparent",
    accent: "text-pink-500",
    chip: "bg-pink-500/10 text-pink-600 border-pink-300/40",
  },
] as const;

const learningStyles = ["Visual", "Story", "Hands-on", "Curious"] as const;

function ProfilePage() {
  const [name, setName] = React.useState("Aarav K.");
  const [grade, setGrade] = React.useState("Grade 7");
  const [editingName, setEditingName] = React.useState(false);
  const [color, setColor] = React.useState(avatarColors[0]);
  const [iconId, setIconId] = React.useState(avatarIcons[0].id);
  const [favorite, setFavorite] = React.useState<(typeof characters)[number]["id"]>("neo");
  const [style, setStyle] = React.useState<(typeof learningStyles)[number]>("Visual");
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [sound, setSound] = React.useState(true);
  const [motionFx, setMotionFx] = React.useState(true);

  const completed = getCompleted();
  const completedCount = ACTIVITY_ORDER.filter((s) => completed.includes(s)).length;
  const totalXP = 1620 + completedCount * 80;
  const streak = 12;
  const badges = 8 + completedCount;
  const weeks = Math.min(35, 4 + Math.floor(completedCount / 2));
  const level = Math.floor(totalXP / 500) + 1;
  const xpToNext = 500 - (totalXP % 500);

  const ActiveIcon = avatarIcons.find((i) => i.id === iconId)?.icon ?? Sparkles;
  const fav = characters.find((c) => c.id === favorite)!;

  return (
    <AppShell>
      <div className="relative mx-auto w-full max-w-6xl space-y-12 px-4 pb-20 pt-6 md:px-6">
        {/* Ambient particles */}
        <FloatingParticles />

        {/* HERO */}
        <motion.section
          {...fadeUp}
          className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 shadow-[0_30px_80px_-40px_rgba(99,102,241,0.45)] backdrop-blur-xl md:p-10"
        >
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-300/40 to-pink-300/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-sky-300/40 to-emerald-200/30 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] [background-size:24px_24px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* LEFT: Avatar + identity */}
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <motion.div
                  {...floatY(6, 6)}
                  className={cn(
                    "relative grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br shadow-[0_20px_50px_-15px_rgba(139,92,246,0.55)] ring-8 ring-white/70",
                    color.gradient,
                  )}
                >
                  <div className={cn("absolute inset-0 rounded-full ring-4", color.ring, "animate-pulse")} />
                  <ActiveIcon className="h-16 w-16 text-white drop-shadow-md" strokeWidth={2.2} />
                </motion.div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-violet-600 shadow-sm backdrop-blur">
                  Lvl {level}
                </div>
              </div>

              <div className="space-y-3">
                {editingName ? (
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setEditingName(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                    className="w-full max-w-xs rounded-2xl border border-violet-200 bg-white/80 px-4 py-2 font-display text-3xl font-bold text-foreground outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/50"
                  />
                ) : (
                  <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                    {name}
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full border border-violet-200/60 bg-white/70 px-3 py-1 font-semibold text-violet-600 backdrop-blur">
                    Explorer
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium text-muted-foreground">{grade}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                    <Zap className="h-4 w-4" />
                    {totalXP.toLocaleString()} XP
                  </div>
                  <span className="text-xs text-muted-foreground">{xpToNext} XP to next level</span>
                </div>
                {/* XP bar */}
                <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-violet-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((totalXP % 500) / 500) * 100}%` }}
                    transition={{ duration: 1.2, ease: nammaEase }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
                  />
                </div>
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() => setEditingName((v) => !v)}
                  className="mt-2"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {editingName ? "Done" : "Edit profile"}
                </Button>
              </div>
            </div>

            {/* RIGHT: Neo greeting */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-violet-300/30 via-pink-200/20 to-sky-200/30 blur-3xl" />
              <motion.img
                {...floatY(10, 5)}
                src={fav.image}
                alt={fav.name}
                className="relative z-10 h-64 w-64 object-contain drop-shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -left-2 top-6 z-20 max-w-[200px] rounded-2xl rounded-bl-sm border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur-md"
              >
                <div className="mb-1 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                  <Sparkles className="h-3 w-3" />
                  {fav.name}
                </div>
                <p className="text-sm font-medium leading-snug text-foreground">
                  Your AI journey is looking amazing!
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* JOURNEY SNAPSHOT */}
        <Section title="Journey snapshot" subtitle="A gentle peek at how far you've come.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Flame} label="Current streak" value={`${streak} days`} gradient="from-orange-400 to-rose-400" />
            <StatCard icon={Zap} label="Total XP" value={totalXP.toLocaleString()} gradient="from-amber-400 to-yellow-400" />
            <StatCard icon={Award} label="Badges earned" value={String(badges)} gradient="from-violet-400 to-fuchsia-400" />
            <StatCard icon={Star} label="Weeks completed" value={`${weeks} / 35`} gradient="from-sky-400 to-cyan-400" />
          </div>
        </Section>

        {/* PROFILE DETAILS */}
        <Section title="Your details" subtitle="Just the basics. Make it feel like you.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <Field label="Your name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-border/60 bg-white/60 px-4 py-3 text-base font-medium text-foreground outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </Field>
              <Field label="Your grade">
                <div className="flex flex-wrap gap-2">
                  {["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((g) => (
                    <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>
                      {g}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Learning style">
                <div className="flex flex-wrap gap-2">
                  {learningStyles.map((s) => (
                    <Chip key={s} active={style === s} onClick={() => setStyle(s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </Field>
            </Card>

            <Card>
              <Field label="Pick your avatar color">
                <div className="flex flex-wrap gap-3">
                  {avatarColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColor(c)}
                      title={c.label}
                      className={cn(
                        "relative h-11 w-11 rounded-full bg-gradient-to-br ring-offset-2 transition-all hover:scale-110",
                        c.gradient,
                        color.id === c.id ? "ring-2 ring-foreground/60 scale-110" : "ring-0",
                      )}
                    >
                      {color.id === c.id && (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Pick your icon">
                <div className="flex flex-wrap gap-2">
                  {avatarIcons.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setIconId(id)}
                      title={label}
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-2xl border transition-all hover:-translate-y-0.5",
                        iconId === id
                          ? "border-violet-400 bg-violet-50 text-violet-600 shadow-md"
                          : "border-border/60 bg-white/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </Field>
            </Card>
          </div>
        </Section>

        {/* FAVORITE CHARACTER */}
        <Section title="Favorite guide" subtitle="Choose who greets you across your adventure.">
          <div className="grid gap-4 md:grid-cols-3">
            {characters.map((c) => {
              const active = favorite === c.id;
              return (
                <motion.button
                  key={c.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setFavorite(c.id)}
                  className={cn(
                    "relative overflow-hidden rounded-[28px] border bg-white/70 p-6 text-left backdrop-blur-xl transition-all",
                    active
                      ? "border-violet-400/60 shadow-[0_25px_60px_-25px_rgba(139,92,246,0.5)]"
                      : "border-white/60 shadow-sm hover:shadow-lg",
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", c.gradient)} />
                  {active && (
                    <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white shadow-md">
                      <Check className="h-4 w-4 text-violet-600" />
                    </div>
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <motion.img
                      {...floatY(6, 4 + Math.random())}
                      src={c.image}
                      alt={c.name}
                      className="h-32 w-32 object-contain drop-shadow-xl"
                    />
                    <h3 className="mt-3 font-display text-xl font-bold text-foreground">{c.name}</h3>
                    <span className={cn("mt-1 rounded-full border px-3 py-0.5 text-xs font-semibold", c.chip)}>
                      {c.tagline}
                    </span>
                    <p className="mt-3 text-sm leading-snug text-muted-foreground">{c.blurb}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Section>

        {/* ACHIEVEMENTS PREVIEW */}
        <Section title="Latest moments" subtitle="A quick look at your treasures.">
          <div className="grid gap-4 md:grid-cols-3">
            <PreviewTile
              eyebrow="Latest badge"
              title="Curious Mind"
              note="Earned this week"
              icon={Award}
              gradient="from-violet-500 via-fuchsia-500 to-pink-500"
              to="/badges"
              cta="View badges"
            />
            <PreviewTile
              eyebrow="Latest certificate"
              title="Week 4 — Story Weaver"
              note="Ready to download"
              icon={Trophy}
              gradient="from-amber-500 via-orange-500 to-rose-500"
              to="/rewards"
              cta="View rewards"
            />
            <PreviewTile
              eyebrow="World progress"
              title={`World 1 • ${Math.round((weeks / 7) * 100)}%`}
              note="Keep exploring!"
              icon={Sparkles}
              gradient="from-sky-500 via-cyan-500 to-teal-500"
              to="/journey"
              cta="Open journey"
            />
          </div>
        </Section>

        {/* SETTINGS */}
        <Section title="Settings" subtitle="Keep it simple. Tweak only what you need.">
          <Card>
            <div className="divide-y divide-border/40">
              <SettingRow
                icon={sound ? Volume2 : VolumeX}
                title="Sound effects"
                description="Little chimes and celebrations."
                control={<Toggle value={sound} onChange={setSound} />}
              />
              <SettingRow
                icon={Wand2}
                title="Animation magic"
                description="Soft motion across the portal."
                control={<Toggle value={motionFx} onChange={setMotionFx} />}
              />
              <SettingRow
                icon={theme === "light" ? Sun : Moon}
                title="Theme mode"
                description="Pick your vibe."
                control={
                  <div className="flex rounded-full bg-muted p-1">
                    <button
                      onClick={() => setTheme("light")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        theme === "light" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      <Sun className="h-3.5 w-3.5" /> Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        theme === "dark" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      <Moon className="h-3.5 w-3.5" /> Dark
                    </button>
                  </div>
                }
              />
              <SettingRow
                icon={Shield}
                title="Parent access"
                description="Share progress with your grown-up."
                control={
                  <Button variant="soft" size="sm">
                    Open
                  </Button>
                }
              />
              <SettingRow
                icon={LogOut}
                title="Sign out"
                description="See you on the next adventure."
                control={
                  <Button variant="outline" size="sm" className="text-rose-600 hover:bg-rose-50">
                    Logout
                  </Button>
                }
              />
            </div>
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}

/* ---------- helpers ---------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl md:p-8">
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5",
        active
          ? "border-violet-400 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
          : "border-border/60 bg-white/60 text-foreground hover:border-violet-300",
      )}
    >
      {children}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-all hover:shadow-[0_25px_55px_-25px_rgba(139,92,246,0.4)]"
    >
      <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40", gradient)} />
      <div className={cn("relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md", gradient)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="relative mt-4">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-display text-2xl font-bold text-foreground">{value}</div>
      </div>
    </motion.div>
  );
}

function PreviewTile({
  eyebrow,
  title,
  note,
  icon: Icon,
  gradient,
  to,
  cta,
}: {
  eyebrow: string;
  title: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  to: string;
  cta: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-[26px] border border-white/60 bg-white/70 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl"
    >
      <div className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-25 blur-3xl", gradient)} />
      <div className={cn("relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", gradient)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="relative mt-5">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </div>
        <div className="mt-1 font-display text-xl font-bold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{note}</div>
      </div>
      <Link
        to={to}
        className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700"
      >
        {cta}
        <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  control,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 text-violet-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-7 w-12 rounded-full transition-all",
        value ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-inner" : "bg-muted",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md",
          value ? "right-0.5" : "left-0.5",
        )}
      />
    </button>
  );
}

function FloatingParticles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          className="absolute rounded-full bg-gradient-to-br from-violet-300/40 to-pink-300/30 blur-[2px]"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
