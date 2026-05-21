import type { ReactNode } from "react";
import { ArrowUpRight, LockKeyhole, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const toneClasses = {
  story: {
    shell: "border-story/24 bg-story-soft text-story",
    badge: "bg-story/12 text-story",
    glow: "from-story-soft via-background to-background",
  },
  explore: {
    shell: "border-explore/24 bg-explore-soft text-explore",
    badge: "bg-explore/12 text-explore",
    glow: "from-explore-soft via-background to-background",
  },
  decide: {
    shell: "border-decide/24 bg-decide-soft text-decide",
    badge: "bg-decide/12 text-decide",
    glow: "from-decide-soft via-background to-background",
  },
  reflect: {
    shell: "border-reflect/24 bg-reflect-soft text-reflect",
    badge: "bg-reflect/12 text-reflect",
    glow: "from-reflect-soft via-background to-background",
  },
  challenge: {
    shell: "border-challenge/24 bg-challenge-soft text-challenge",
    badge: "bg-challenge/12 text-challenge",
    glow: "from-challenge-soft via-background to-background",
  },
  bonus: {
    shell: "border-bonus/26 bg-bonus-soft text-bonus",
    badge: "bg-bonus/14 text-bonus",
    glow: "from-bonus-soft via-background to-background",
  },
  xp: {
    shell: "border-xp/24 bg-xp-soft text-xp",
    badge: "bg-xp/12 text-xp",
    glow: "from-xp-soft via-background to-background",
  },
  locked: {
    shell: "border-locked/24 bg-locked-soft text-locked",
    badge: "bg-locked/12 text-locked",
    glow: "from-locked-soft via-background to-background",
  },
} as const;

type Tone = keyof typeof toneClasses;

export function ToneSwatch({
  tone,
  label,
  hex,
  note,
}: {
  tone: Tone;
  label: string;
  hex: string;
  note: string;
}) {
  const styles = toneClasses[tone];

  return (
    <article className={cn("tone-card", styles.shell)}>
      <div className={cn("tone-chip", styles.badge)}>{label}</div>
      <div className={cn("mt-5 h-24 rounded-[22px] bg-gradient-to-br", styles.glow)} />
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-display font-semibold text-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground">{note}</p>
      </div>
      <div className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {hex}
      </div>
    </article>
  );
}

export function PreviewCard({
  title,
  description,
  eyebrow,
  tone,
  icon,
  children,
  locked = false,
}: {
  title: string;
  description: string;
  eyebrow: string;
  tone: Tone;
  icon: ReactNode;
  children?: ReactNode;
  locked?: boolean;
}) {
  const styles = toneClasses[tone];

  return (
    <article className={cn("preview-card", styles.shell, locked && "locked-preview") }>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={cn("tone-chip", styles.badge)}>{eyebrow}</div>
          <h3 className="mt-4 text-xl font-display font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className={cn("preview-icon", styles.badge)}>{locked ? <LockKeyhole className="h-5 w-5" /> : icon}</div>
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

export function StatPill({
  label,
  value,
  tone = "xp",
  icon,
}: {
  label: string;
  value: string;
  tone?: Tone;
  icon: ReactNode;
}) {
  const styles = toneClasses[tone];

  return (
    <div className={cn("stat-pill", styles.shell)}>
      <div className={cn("stat-pill-icon", styles.badge)}>{icon}</div>
      <div>
        <div className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </div>
        <div className="mt-1 text-lg font-display font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function CharacterBubble({
  image,
  name,
  role,
  quote,
  tone,
}: {
  image: string;
  name: string;
  role: string;
  quote: string;
  tone: Tone;
}) {
  const styles = toneClasses[tone];

  return (
    <article className={cn("character-bubble", styles.shell)}>
      <div className="character-avatar-shell">
        <img src={image} alt={name} className="character-avatar" loading="lazy" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-display font-semibold text-foreground">{name}</span>
          <span className={cn("tone-chip", styles.badge)}>{role}</span>
        </div>
        <p className="speech-copy">“{quote}”</p>
      </div>
    </article>
  );
}

export function MotionSpec({
  title,
  timing,
  description,
}: {
  title: string;
  timing: string;
  description: string;
}) {
  return (
    <article className="motion-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-display font-semibold text-foreground">{title}</h3>
        <div className="tone-chip bg-secondary text-secondary-foreground">{timing}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="motion-rail mt-5">
        <div className="motion-dot" />
      </div>
    </article>
  );
}

export function IconTile({
  label,
  icon,
  tone = "story",
}: {
  label: string;
  icon: ReactNode;
  tone?: Tone;
}) {
  const styles = toneClasses[tone];

  return (
    <div className={cn("icon-tile", styles.shell)}>
      <div className={cn("preview-icon", styles.badge)}>{icon}</div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}

export function RewardToast() {
  return (
    <div className="reward-toast">
      <div className="reward-toast-badge">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">XP unlocked</div>
        <div className="font-reward text-2xl text-xp">+50 XP</div>
      </div>
      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
