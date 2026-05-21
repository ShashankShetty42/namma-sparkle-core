import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Cpu,
  Eye,
  Flame,
  Lightbulb,
  MessageCircle,
  Mic,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";

import devExplaining from "@/assets/characters/dev-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";

import { AppShell } from "@/components/namma/app-shell";
import { fadeUp } from "@/components/namma/motion";
import {
  ActivityHero,
  AnalogyGrid,
  BottomCTAs,
  CharacterChorus,
  ConceptStage,
  DeepConcepts,
  KnowledgeRow,
  LearningLadder,
  MissionStrip,
  QuizCard,
  StoryFlow,
  type Analogy,
  type DeepConceptItem,
  type MissionStat,
  type Pillar,
  type StoryStep,
} from "@/components/namma/activity";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Story & Concept · What is AI? — Namma AI" },
      {
        name: "description",
        content:
          "A magical Story & Concept lesson with Dev and Neo. Discover what Artificial Intelligence really is — through stories, analogies, examples, and playful mini quizzes.",
      },
      { property: "og:title", content: "What is AI? — A Namma AI Adventure" },
      {
        property: "og:description",
        content:
          "Step into a cinematic AI lesson with Dev and Neo, designed for Grades 5–10.",
      },
    ],
  }),
  component: StoryActivityPage,
});

/* ------------------------------------------------------------------ */
/*  Lesson content (data-driven; components are reusable)              */
/* ------------------------------------------------------------------ */

const STORY_STEPS: StoryStep[] = [
  { icon: <Sparkles className="h-4 w-4" />, title: "Open the story", sub: "Meet Dev" },
  { icon: <Lightbulb className="h-4 w-4" />, title: "What is AI?", sub: "The big idea" },
  { icon: <Brain className="h-4 w-4" />, title: "How AI thinks", sub: "Patterns & data" },
  { icon: <Eye className="h-4 w-4" />, title: "AI in your day", sub: "Real examples" },
  { icon: <Wand2 className="h-4 w-4" />, title: "Try a mini quiz", sub: "Brain workout" },
  { icon: <PartyPopper className="h-4 w-4" />, title: "Celebrate", sub: "Claim your XP" },
];

const PILLARS: Pillar[] = [
  { tone: "story", icon: <Eye className="h-4 w-4" />, title: "See", body: "AI looks at lots of examples — photos, words, sounds." },
  { tone: "challenge", icon: <Brain className="h-4 w-4" />, title: "Spot patterns", body: "It notices what repeats and what makes things similar." },
  { tone: "bonus", icon: <Sparkles className="h-4 w-4" />, title: "Predict", body: "It guesses the next answer — and gets better each time." },
];

const LADDER_RUNGS = [
  { label: "See examples", w: "20%" },
  { label: "Notice patterns", w: "45%" },
  { label: "Make a guess", w: "70%" },
  { label: "Get feedback & improve", w: "95%" },
];

const ANALOGIES: Analogy[] = [
  { tone: "story", emoji: "🐱", title: "Recognising a cat", body: "Your brain has seen many cats. AI looks at millions of cat photos to learn the same trick." },
  { tone: "explore", emoji: "🎵", title: "Remembering a song", body: "Hum two notes and you know the song. AI does that with patterns in sound waves." },
  { tone: "bonus", emoji: "🍳", title: "Following a recipe", body: "You repeat the steps until pancakes are perfect. AI repeats and adjusts to get better." },
  { tone: "reflect", emoji: "🧩", title: "Solving a puzzle", body: "You try a piece, rotate it, try again. AI guesses, checks, and learns from mistakes." },
];

const AI_EXAMPLES = [
  { icon: <Eye className="h-4 w-4" />, title: "Camera filters", body: "AI finds your face and adds the funny dog ears in real time.", tone: "bg-explore-soft text-explore" },
  { icon: <Mic className="h-4 w-4" />, title: "Voice assistants", body: "Siri and Alexa turn your voice into text, then guess what you want.", tone: "bg-bonus-soft text-bonus" },
  { icon: <Sparkles className="h-4 w-4" />, title: "Recommendations", body: "YouTube guesses the next video you'll love based on patterns.", tone: "bg-story-soft text-story" },
  { icon: <Brain className="h-4 w-4" />, title: "Smart maps", body: "Google Maps predicts traffic by learning from millions of trips.", tone: "bg-challenge-soft text-challenge" },
];

const DEEP_CONCEPTS: DeepConceptItem[] = [
  { value: "data", tone: "story", icon: <Brain className="h-4 w-4" />, title: "What is data?", body: "Data is just information — photos, words, numbers, sounds. AI eats data like you eat snacks: the more (and the better the quality), the smarter it gets." },
  { value: "model", tone: "challenge", icon: <Cpu className="h-4 w-4" />, title: "What is a model?", body: "A model is the 'brain' AI builds after looking at lots of data. It's a giant recipe of patterns it can use to make guesses about new things." },
  { value: "train", tone: "explore", icon: <Wand2 className="h-4 w-4" />, title: "What does 'training' mean?", body: "Training is when AI practises. We show it tons of examples and gently say 'yes' or 'no' until its guesses get really, really good." },
  { value: "limit", tone: "decide", icon: <Eye className="h-4 w-4" />, title: "What AI can't do", body: "AI doesn't feel, dream, or truly understand the world like you. It's amazing at patterns — but kindness, creativity and curiosity? That's your superpower." },
];

const QUIZ_OPTIONS = [
  { id: "a", text: "By looking at lots of examples", correct: false },
  { id: "b", text: "By spotting patterns in data", correct: false },
  { id: "c", text: "By drinking a magical potion 🧪", correct: true },
  { id: "d", text: "By practising and getting feedback", correct: false },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function StoryActivityPage() {
  const [step, setStep] = React.useState(2);
  const [completed, setCompleted] = React.useState<Set<number>>(new Set([0, 1]));
  const totalSteps = STORY_STEPS.length;
  const progress = Math.round((completed.size / totalSteps) * 100);

  const completeStep = (i: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    setStep((s) => Math.min(totalSteps - 1, Math.max(s, i + 1)));
  };

  const missionStats: MissionStat[] = [
    { icon: <Trophy className="h-4 w-4" />, label: "Mission", value: "Story Mode", tone: "story" },
    { icon: <Star className="h-4 w-4" />, label: "XP earned", value: "120 / 200", tone: "xp" },
    { icon: <Flame className="h-4 w-4" />, label: "Streak", value: "5 days", tone: "decide" },
    { icon: <Zap className="h-4 w-4" />, label: "Step", value: `${step + 1} / ${totalSteps}`, tone: "challenge" },
    { icon: <Check className="h-4 w-4" />, label: "Completed", value: `${completed.size} / ${totalSteps}`, tone: "success" },
    { icon: <Sparkles className="h-4 w-4" />, label: "Progress", value: `${progress}%`, tone: "bonus" },
  ];

  return (
    <AppShell>
      <div className="shell-inner">
        {/* Breadcrumb */}
        <motion.div
          {...fadeUp}
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-foreground transition-colors">Activities</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Story &amp; Concept</span>
        </motion.div>

        <ActivityHero
          eyebrow="Story & Concept · Week 2 · Lesson 3"
          eyebrowIcon={<BookOpen className="h-4 w-4" />}
          title={
            <>
              What <span className="text-story">really</span> is{" "}
              <span className="bg-gradient-to-r from-story via-challenge to-explore bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
              ?
            </>
          }
          description="Dev is going to take you on a cinematic journey through the magical world of AI — with simple stories, surprising examples, and tiny brain workouts. Neo will cheer you on along the way."
          characterImage={devExplaining}
          characterName="Dev"
          secondaryCharacterImage={neoHappy}
          secondaryCharacterName="Neo"
          speech="Ready? Let me show you something wild about AI..."
          floatingChips={[
            { icon: <Eye className="h-3.5 w-3.5" />, label: "Vision", tone: "explore" },
            { icon: <Mic className="h-3.5 w-3.5" />, label: "Voice", tone: "bonus" },
            { icon: <Brain className="h-3.5 w-3.5" />, label: "Think", tone: "challenge" },
          ]}
          progress={{
            percent: progress,
            valueLabel: `${completed.size}/${totalSteps} steps`,
            caption: "Lesson 3 of 5 this week",
            label: "Week 2 progress",
          }}
          reward={{ reward: "+80 XP", subline: "+ Explorer badge at lesson end" }}
          streakDays={5}
          primaryAction={{ label: "Begin the story", icon: <Rocket className="h-4 w-4" /> }}
        />

        <MissionStrip items={missionStats} />

        <StoryFlow
          steps={STORY_STEPS}
          currentStep={step}
          completed={completed}
          onSelectStep={setStep}
        />

        <ConceptStage
          stepKey={step}
          eyebrow={`Concept · Step ${step + 1}`}
          title="The big idea: AI learns the way you do."
          body={
            <>
              Imagine your brain when you first learned to recognise a cat. You saw many cats,
              noticed patterns — pointy ears, whiskers, a tail — and then could spot cats
              everywhere. <strong className="text-foreground">AI does the same thing</strong>, just
              with millions of examples and a little bit of math magic.
            </>
          }
          pillars={PILLARS}
          ladder={<LearningLadder rungs={LADDER_RUNGS} />}
          characterImage={devHappy}
          characterImageThinking={devThinking}
          characterName="Dev"
          speech={
            <>
              AI is when computers learn to <strong>spot patterns</strong> — just like how you
              recognise your best friend in a crowd.
            </>
          }
          floatingChips={[
            { tone: "challenge", icon: <Brain className="h-3 w-3" />, label: "Patterns" },
            { tone: "bonus", icon: <Sparkles className="h-3 w-3" />, label: "Data" },
            { tone: "explore", icon: <Eye className="h-3 w-3" />, label: "Learn" },
          ]}
          primaryAction={{
            label: "I got it",
            icon: <Check className="h-4 w-4" />,
            onClick: () => completeStep(step),
          }}
          secondaryAction={{
            label: "Ask Dev a question",
            icon: <MessageCircle className="h-4 w-4" />,
          }}
        />

        <AnalogyGrid items={ANALOGIES} />

        <KnowledgeRow
          fact={{
            headline: (
              <>
                The word &ldquo;Artificial Intelligence&rdquo; was first used in{" "}
                <span className="text-bonus">1956</span>.
              </>
            ),
            body: "At a tiny summer workshop in the USA, a small group of scientists dreamed up a world where machines could think and learn. Almost 70 years later — here you are, learning all about it.",
            tags: [
              { tone: "bonus", label: "Origin story" },
              { tone: "story", label: "Fun fact" },
              { tone: "explore", label: "History" },
            ],
          }}
          examples={AI_EXAMPLES}
        />

        <QuizCard
          question="Which of these is NOT a way AI usually learns?"
          options={QUIZ_OPTIONS}
          eyebrow="Mini quiz · 1 of 3"
          description="Pick the one that doesn't belong. Dev believes in you — and Neo is already practising the victory dance."
          helperCharacter={{
            image: neoCelebrating,
            name: "Neo",
            label: "Neo cheers",
            message: "You've got this — trust your patterns!",
          }}
          correctTitle="Brilliant! +20 XP unlocked"
          correctDescription="AI learns by examples, patterns, and feedback — never by magic potions."
          wrongTitle="Almost! Try the one that feels silly 🪄"
          wrongDescription="Hint: AI is powerful, but it can't sip a potion to get smart."
          onCorrect={() => completeStep(step)}
        />

        <DeepConcepts items={DEEP_CONCEPTS} />

        <CharacterChorus
          primaryImage={devCelebrating}
          primaryName="Dev"
          secondaryImage={neoCelebrating}
          secondaryName="Neo"
          title="Dev & Neo are SO proud of you."
          body={
            <>
              Three steps left to finish today&apos;s adventure and unlock the{" "}
              <strong className="text-bonus">Explorer badge</strong>. Keep that 5-day streak
              glowing!
            </>
          }
          secondaryAction={{ label: "Talk to Neo" }}
        />

        <BottomCTAs
          continueProps={{
            progress,
            characterImage: devHappy,
            characterName: "Dev",
          }}
          nextProps={{
            title: "Explore & Observe: Spot the AI",
            body: (
              <>
                A playful scavenger hunt where you find AI hidden in everyday apps. Earn another{" "}
                <strong className="text-explore">+60 XP</strong>.
              </>
            ),
            tags: [
              { tone: "explore", label: "Observation" },
              { tone: "bonus", label: "+60 XP" },
            ],
            characterImage: neoHappy,
            characterName: "Neo",
          }}
        />
      </div>
    </AppShell>
  );
}
