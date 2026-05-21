import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  CircleHelp,
  Compass,
  Gift,
  Layers3,
  Lightbulb,
  Lock,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Type,
  WandSparkles,
  Zap,
} from "lucide-react";

import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";
import anayaExplaining from "@/assets/characters/anaya-explaining.png";
import anayaThinking from "@/assets/characters/anaya-thinking.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoThinking from "@/assets/characters/neo-thinking.png";
import { SystemSection } from "@/components/namma/system-section";
import {
  CharacterBubble,
  IconTile,
  MotionSpec,
  PreviewCard,
  RewardToast,
  StatPill,
  ToneSwatch,
} from "@/components/namma/showcase-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Namma AI Design System" },
      {
        name: "description",
        content:
          "Premium magical design system for the Namma AI learning platform, built for Grades 5–10 with character-led UI, gamification, motion, and reusable components.",
      },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function Index() {
  return (
    <main className="page-shell">
      <div className="shell-inner">
        <motion.section className="hero-panel" {...fadeUp}>
          <div className="hero-characters items-center gap-6">
            <div className="space-y-6">
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                <span>Phase 1 · Premium UI system</span>
              </div>
              <div className="space-y-4">
                <h1 className="display-hero">A magical AI adventure design system for Namma AI.</h1>
                <p className="hero-copy">
                  Built for Grades 5–10, this system turns learning into a warm, futuristic,
                  cinematic journey with character-led guidance, joyful gamification, and premium
                  reusable UI foundations.
                </p>
              </div>

              <div className="system-grid-4">
                <StatPill label="Character guides" value="Neo · Dev · Anaya" tone="story" icon={<Bot className="h-5 w-5" />} />
                <StatPill label="Core activity tones" value="6 color tracks" tone="explore" icon={<Layers3 className="h-5 w-5" />} />
                <StatPill label="Motion register" value="Soft · floating · celebratory" tone="reflect" icon={<WandSparkles className="h-5 w-5" />} />
                <StatPill label="Surface language" value="Glass · layered · rounded" tone="challenge" icon={<Sparkles className="h-5 w-5" />} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg">
                  Explore the system
                </Button>
                <Button variant="soft" size="lg">
                  Reusable foundations only
                </Button>
                <Button variant="xp" size="lg">
                  + Premium gamification layer
                </Button>
              </div>
            </div>

            <div className="hero-artboard">
              <div className="hero-orbit left-[8%] top-[10%] h-28 w-28" />
              <div className="hero-orbit right-[10%] top-[12%] h-20 w-20" />
              <div className="hero-orbit bottom-[14%] left-[20%] h-36 w-36" />
              <div className="hero-sparkle left-[12%] top-[18%] h-3 w-3" />
              <div className="hero-sparkle right-[18%] top-[26%] h-2.5 w-2.5" />
              <div className="hero-sparkle bottom-[18%] right-[12%] h-4 w-4" />

              <div className="grid h-full gap-4 md:grid-cols-[1fr_1fr] md:grid-rows-[auto_1fr_auto]">
                <div className="preview-card border-story/20 bg-story-soft/60 md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="tone-chip bg-story/12 text-story">Narrative direction</div>
                      <h2 className="mt-3 text-2xl font-display font-bold text-foreground">
                        Premium, playful, emotionally smart.
                      </h2>
                    </div>
                    <img src={neoHappy} alt="Neo waving" className="h-28 w-28 object-contain" loading="lazy" />
                  </div>
                </div>

                <div className="preview-card border-explore/20 bg-explore-soft/55">
                  <div className="tone-chip bg-explore/12 text-explore">Neo</div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Encouragement, success, rewards, hints, XP, progress, celebration.
                  </p>
                  <img src={neoExplaining} alt="Neo explaining" className="ml-auto h-36 w-36 object-contain" loading="lazy" />
                </div>

                <div className="preview-card border-bonus/22 bg-bonus-soft/55">
                  <div className="tone-chip bg-bonus/14 text-bonus">Dev + Anaya</div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Dev explains ideas clearly. Anaya drives curiosity, reflection, and deeper
                    thinking.
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <img src={devExplaining} alt="Dev explaining" className="h-28 w-28 object-contain" loading="lazy" />
                    <img src={anayaThinking} alt="Anaya thinking" className="h-28 w-28 object-contain" loading="lazy" />
                  </div>
                </div>

                <RewardToast />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Typography system"
            title="Clean, kid-readable hierarchy with cinematic warmth"
            description="Sora drives premium headings, Nunito Sans keeps long-form content friendly and readable, and Baloo 2 brings celebratory reward energy without turning childish."
          >
            <div className="system-grid-4">
              <article className="type-card">
                <div className="mini-label">Display</div>
                <div className="mt-4 type-sample-display">AI Adventure</div>
                <p className="mt-4 type-sample-body">Hero banners, milestone moments, onboarding highlights.</p>
              </article>
              <article className="type-card">
                <div className="mini-label">Section heading</div>
                <div className="mt-4 type-sample-heading">Write your bright ideas</div>
                <p className="mt-4 type-sample-body">Major sections, panels, dashboard groupings, lesson modules.</p>
              </article>
              <article className="type-card">
                <div className="mini-label">Body + helper</div>
                <p className="mt-4 type-sample-body">
                  Friendly but polished instructional copy with generous line-height and strong
                  clarity for Grades 5–10.
                </p>
              </article>
              <article className="type-card">
                <div className="mini-label">Reward / gamification</div>
                <div className="mt-4 reward-line">+50 XP</div>
                <p className="mt-4 type-sample-body">XP, badge unlocks, streak wins, and toast moments.</p>
              </article>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Color system"
            title="Six activity tracks plus reward, status, and locked-state language"
            description="The palette is vibrant but controlled: instantly scannable for kids, premium enough for a polished product, and stable enough to scale across the entire platform."
          >
            <div className="system-grid-4 2xl:grid-cols-4">
              <ToneSwatch tone="story" label="Story & Concept" hex="#8B5CF6-ish" note="Explanations, concept learning, guided lessons." />
              <ToneSwatch tone="explore" label="Explore & Observe" hex="#21C6B8-ish" note="Discovery, observation, searching, real-world AI examples." />
              <ToneSwatch tone="decide" label="Do & Decide" hex="#FF9A2F-ish" note="Choices, branching moments, action-forward tasks." />
              <ToneSwatch tone="reflect" label="Think & Write" hex="#F658A8-ish" note="Reflection, writing, journaling, creativity." />
              <ToneSwatch tone="challenge" label="AI Challenge" hex="#3F6DFF-ish" note="Quizzes, tests, streaks, focused challenge states." />
              <ToneSwatch tone="bonus" label="Bonus Challenge" hex="#F2BE4C-ish" note="Rewards, extras, unlockable premium-feeling moments." />
              <ToneSwatch tone="xp" label="XP & rewards" hex="#F5C748-ish" note="XP counters, claims, celebration and progress feedback." />
              <ToneSwatch tone="locked" label="Locked state" hex="#9DA3BF-ish" note="Dimmed but still hopeful, never punitive or cold." />
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Card system"
            title="Layered glass cards for missions, rewards, guidance, and dashboard modules"
            description="All key surfaces share the same rounded, floating structure, then adapt with tone, density, and content role."
          >
            <div className="system-grid-3">
              <PreviewCard tone="explore" eyebrow="Activity card" title="Explore & Observe" description="Large icon, clear title, short task framing, and progress-ready footer." icon={<Compass className="h-5 w-5" />}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="mini-label">Status</div>
                    <div className="mt-2 text-base font-semibold text-foreground">Completed</div>
                  </div>
                  <img src={devThinking} alt="Dev thinking" className="h-24 w-24 object-contain" loading="lazy" />
                </div>
              </PreviewCard>

              <PreviewCard tone="story" eyebrow="Mission card" title="Mission flow" description="Supports week progression, mission number, learning objective, and character cues." icon={<Rocket className="h-5 w-5" />}>
                <div className="space-y-2">
                  <div className="mini-label">Rhythm</div>
                  <div className="progress-shell"><div className="progress-fill w-[58%]" /></div>
                </div>
              </PreviewCard>

              <PreviewCard tone="xp" eyebrow="Achievement card" title="Explorer badge" description="For badge unlocks, reward reveals, and special completion moments." icon={<Trophy className="h-5 w-5" />}>
                <img src={neoCelebrating} alt="Neo celebrating" className="ml-auto h-24 w-24 object-contain" loading="lazy" />
              </PreviewCard>

              <PreviewCard tone="reflect" eyebrow="Speech card" title="Character prompt" description="Speech-led instructional moments that feel alive and emotionally supportive." icon={<CircleHelp className="h-5 w-5" />}>
                <img src={anayaExplaining} alt="Anaya explaining" className="ml-auto h-24 w-24 object-contain" loading="lazy" />
              </PreviewCard>

              <PreviewCard tone="bonus" eyebrow="Reward card" title="Claim your bonus XP" description="High-energy CTA area with richer gradients and stronger highlight states." icon={<Gift className="h-5 w-5" />}>
                <Button variant="xp">Claim reward</Button>
              </PreviewCard>

              <PreviewCard tone="locked" eyebrow="Locked card" title="Future unlock" description="Dimmed, soft, motivating, and still curiosity-building." locked icon={<Lock className="h-5 w-5" />}>
                <p className="text-sm text-muted-foreground">Complete the previous mission to reveal this.</p>
              </PreviewCard>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Button system"
            title="CTA language that feels rewarding, safe, and game-ready"
            description="Primary actions lift slightly, soft actions stay airy, and XP buttons feel more celebratory. Loading and pressed states stay smooth and reassuring."
          >
            <div className="system-grid-4">
              <article className="type-card space-y-4">
                <div className="mini-label">Primary</div>
                <Button variant="hero" size="lg">Continue journey</Button>
                <p className="type-sample-body">Default advance CTA with premium glow and lift.</p>
              </article>
              <article className="type-card space-y-4">
                <div className="mini-label">Secondary</div>
                <Button variant="soft" size="lg">View details</Button>
                <p className="type-sample-body">Lower emphasis actions for safe exploration.</p>
              </article>
              <article className="type-card space-y-4">
                <div className="mini-label">Gamified CTA</div>
                <Button variant="default" size="lg">Start mission</Button>
                <p className="type-sample-body">Action-forward but still friendly and rounded.</p>
              </article>
              <article className="type-card space-y-4">
                <div className="mini-label">XP claim</div>
                <Button variant="xp" size="lg">Claim +50 XP</Button>
                <p className="type-sample-body">Used for rewards, unlocks, and celebration moments.</p>
              </article>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Gamification components"
            title="XP, badges, streaks, progress, and celebration made premium"
            description="Gamification should motivate, not overwhelm. Everything stays visually clear, emotionally positive, and easy to scan."
          >
            <div className="system-grid-4">
              <PreviewCard tone="xp" eyebrow="XP widget" title="320 XP" description="Compact XP counters for headers, sidebars, and journey cards." icon={<Star className="h-5 w-5" />} />
              <PreviewCard tone="challenge" eyebrow="Level badge" title="Level 2 Explorer" description="Shield-like premium badge silhouette with a soft glow." icon={<Shield className="h-5 w-5" />} />
              <PreviewCard tone="decide" eyebrow="Streak" title="5 day streak" description="Warm energetic streak indicator with stronger moment emphasis." icon={<Zap className="h-5 w-5" />} />
              <PreviewCard tone="success" eyebrow="Celebration" title="Mission complete" description="Toast + confetti + character reaction stack." icon={<Trophy className="h-5 w-5" />}>
                <img src={devCelebrating} alt="Dev celebrating" className="ml-auto h-24 w-24 object-contain" loading="lazy" />
              </PreviewCard>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Character UI system"
            title="Neo encourages, Dev explains, Anaya asks and reflects"
            description="Characters are structural parts of the interface: speech bubbles, hint cards, motivation panels, inline feedback, and success reactions."
          >
            <div className="system-grid-3">
              <CharacterBubble image={neoThinking} name="Neo" role="Guide + reward" quote="You’re doing great — let’s unlock the next step together!" tone="explore" />
              <CharacterBubble image={devExplaining} name="Dev" role="Explainer" quote="Here’s the simple version first, then we’ll go deeper." tone="story" />
              <CharacterBubble image={anayaThinking} name="Anaya" role="Curiosity spark" quote="What do you notice? What would you try next?" tone="reflect" />
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Motion language"
            title="Floating, soft, rewarding, never distracting"
            description="Motion acts like encouragement: gentle lift on hover, calm floating for mascot moments, and bigger celebration only when something meaningful happens."
          >
            <div className="system-grid-4">
              <MotionSpec title="Hover lift" timing="180–240ms" description="Cards and CTA buttons rise slightly with premium shadow bloom." />
              <MotionSpec title="Floating idle" timing="4–6s loop" description="Mascots and helper cards drift subtly to keep the portal alive." />
              <MotionSpec title="Reward popup" timing="300–450ms" description="XP and badge moments scale in with sparkle energy and clear focus." />
              <MotionSpec title="Screen transitions" timing="260–360ms" description="Fade + soft slide to keep learning flow calm and continuous." />
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Background system"
            title="Soft AI worlds: patterns, orbits, sparkles, and floating energy"
            description="Backgrounds support the magic without competing with content. Think cloud-light gradients, subtle grids, neural hints, orbit lines, and small sparkle accents."
          >
            <div className="system-grid-3">
              <article className="pattern-card pattern-dots">
                <div className="mini-label">Dot constellation</div>
                <p className="mt-3 type-sample-body">Use behind dashboards and overview surfaces for soft data energy.</p>
              </article>
              <article className="pattern-card pattern-orbit">
                <div className="mini-label">Orbit lines</div>
                <p className="mt-3 type-sample-body">Ideal for week banners, reward areas, and character-led hero regions.</p>
              </article>
              <article className="pattern-card pattern-neural">
                <div className="mini-label">Neural grid</div>
                <p className="mt-3 type-sample-body">Use lightly on learning surfaces to imply AI systems and connection.</p>
              </article>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Spacing + layout"
            title="Spacious structure for confidence and scanability"
            description="Large surfaces use generous outer padding, cards keep consistent 20–28px rounding, and grids remain breathable so younger learners never feel crowded."
          >
            <div className="system-grid-4">
              <div className="layout-rhythm">
                <div className="mini-label">Page padding</div>
                <p className="type-sample-body">16px mobile, 32px tablet, 40px+ desktop shell spacing.</p>
              </div>
              <div className="layout-rhythm">
                <div className="mini-label">Card spacing</div>
                <p className="type-sample-body">16–20px internal rhythm, bigger hero cards at 24–32px.</p>
              </div>
              <div className="layout-rhythm">
                <div className="mini-label">Section rhythm</div>
                <p className="type-sample-body">24px mobile and 32–40px desktop gaps between major bands.</p>
              </div>
              <div className="layout-rhythm">
                <div className="mini-label">Responsive grids</div>
                <p className="type-sample-body">1 → 2 → 3/4 columns, never cramped, always consistent.</p>
              </div>
            </div>
          </SystemSection>
        </motion.div>

        <motion.div {...fadeUp}>
          <SystemSection
            eyebrow="Iconography"
            title="Large, colorful, instantly readable visual anchors"
            description="Icons should feel tactile and friendly, with one clear meaning each. Activity icons stay oversized, rounded, and paired with color-coded contexts."
          >
            <div className="system-grid-6">
              <IconTile tone="story" label="Story" icon={<Brain className="h-7 w-7" />} />
              <IconTile tone="explore" label="Explore" icon={<Compass className="h-7 w-7" />} />
              <IconTile tone="decide" label="Decide" icon={<Rocket className="h-7 w-7" />} />
              <IconTile tone="reflect" label="Write" icon={<Type className="h-7 w-7" />} />
              <IconTile tone="challenge" label="Challenge" icon={<Swords className="h-7 w-7" />} />
              <IconTile tone="bonus" label="Bonus" icon={<Gift className="h-7 w-7" />} />
              <IconTile tone="xp" label="Rewards" icon={<Star className="h-7 w-7" />} />
              <IconTile tone="challenge" label="Sidebar" icon={<Layers3 className="h-7 w-7" />} />
              <IconTile tone="explore" label="Hints" icon={<Lightbulb className="h-7 w-7" />} />
              <IconTile tone="locked" label="Locked" icon={<Lock className="h-7 w-7" />} />
              <IconTile tone="success" label="Success" icon={<Trophy className="h-7 w-7" />} />
              <IconTile tone="story" label="Mascot" icon={<Bot className="h-7 w-7" />} />
            </div>
          </SystemSection>
        </motion.div>

        <motion.section className="section-panel" {...fadeUp}>
          <div className="system-grid-3 items-center">
            <div className="space-y-4">
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                <span>Phase deliverable</span>
              </div>
              <h2 className="section-title">The reusable premium visual language is now established.</h2>
              <p className="section-copy">
                This phase defines typography, color, cards, buttons, gamification, characters,
                motion, backgrounds, layout rhythm, and iconography — ready to power later page-by-page builds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg">Ready for next phase</Button>
                <Button variant="soft" size="lg">System-first foundation</Button>
              </div>
            </div>
            <div className="preview-card border-transparent bg-gradient-to-br from-story-soft via-background to-explore-soft md:col-span-2">
              <div className="grid gap-4 md:grid-cols-4">
                <img src={neoCelebrating} alt="Neo celebrating" className="mx-auto h-36 w-36 object-contain" loading="lazy" />
                <img src={devExplaining} alt="Dev explaining" className="mx-auto h-36 w-36 object-contain" loading="lazy" />
                <img src={anayaCelebrating} alt="Anaya celebrating" className="mx-auto h-36 w-36 object-contain" loading="lazy" />
                <img src={neoHappy} alt="Neo happy" className="mx-auto h-36 w-36 object-contain" loading="lazy" />
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
