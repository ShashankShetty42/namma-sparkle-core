import {
  Bot,
  Brain,
  Camera,
  Eye,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  Mic,
  Music,
  Shield,
  ShieldAlert,
  Sparkles,
  Wand2,
} from "lucide-react";

import devCelebrating from "@/assets/characters/dev-celebrating.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoThinking from "@/assets/characters/neo-thinking.png";
import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";
import anayaExplaining from "@/assets/characters/anaya-explaining.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";
import anayaThinking from "@/assets/characters/anaya-thinking.png";

import type { LessonCard, LessonMeta } from "./lesson-frame";

export type ActivityDefinition = {
  slug: string;
  meta: LessonMeta;
  cards: LessonCard[];
  blurb: string;
  emoji: string;
};

/* ---------- 1. STORY & CONCEPT ---------- */

const storyCards: LessonCard[] = [
  { id: "s1", kind: "story", phase: "Story", tone: "story", character: { name: "Dev", image: devExplaining }, partnerImage: neoHappy,
    message: "Hey! Have you ever wondered how your phone knows what you want to type next? Or how Netflix picks the perfect movie for you?",
    emphasis: "Today we'll find out — together." },
  { id: "s2", kind: "story", phase: "Story", tone: "explore", character: { name: "Neo", image: neoExplaining }, partnerImage: devHappy,
    message: "That's all Artificial Intelligence! AI is giving computers the ability to learn and make decisions — just like humans do, but using data and patterns." },
  { id: "s3", kind: "story", phase: "Story", tone: "bonus", character: { name: "Dev", image: devHappy }, partnerImage: neoCelebrating,
    message: "Wow, so AI is everywhere around us? In our phones, in games, even in hospitals? That's amazing — and a little magical too!" },
  { id: "c1", kind: "concept", phase: "Concept", tone: "challenge", character: { name: "Dev", image: devThinking },
    title: "What is Artificial Intelligence?",
    body: "AI is a branch of computer science that helps machines learn from experience, adjust to new things, and do tasks that usually need human intelligence.",
    pillars: [
      { tone: "story", icon: <Eye className="h-4 w-4" />, title: "See", body: "Looks at lots of examples" },
      { tone: "challenge", icon: <Brain className="h-4 w-4" />, title: "Spot patterns", body: "Notices what repeats" },
      { tone: "bonus", icon: <Sparkles className="h-4 w-4" />, title: "Predict", body: "Guesses the next answer" },
    ] },
  { id: "e1", kind: "examples", phase: "Examples", tone: "explore", character: { name: "Neo", image: neoHappy },
    title: "AI is already in your day",
    intro: "You probably use AI every single day — without even noticing it.",
    items: [
      { tone: "explore", icon: <Camera className="h-4 w-4" />, title: "Camera filters", body: "Finds your face in real time" },
      { tone: "bonus", icon: <Mic className="h-4 w-4" />, title: "Voice assistants", body: "Siri & Alexa understand you" },
      { tone: "story", icon: <Sparkles className="h-4 w-4" />, title: "Recommendations", body: "YouTube picks the next video" },
      { tone: "challenge", icon: <MapPin className="h-4 w-4" />, title: "Smart maps", body: "Predict traffic instantly" },
    ] },
  { id: "q1", kind: "quiz", phase: "Quiz", tone: "challenge", character: { name: "Dev", image: devThinking }, partnerImage: neoHappy,
    question: "Which of these is NOT a way AI usually learns?",
    options: [
      { id: "a", text: "By looking at lots of examples", correct: false },
      { id: "b", text: "By spotting patterns in data", correct: false },
      { id: "c", text: "By drinking a magical potion 🧪", correct: true },
      { id: "d", text: "By practising and getting feedback", correct: false },
    ],
    correctMessage: "Brilliant! AI learns from data, patterns and feedback — never magic.",
    wrongMessage: "Almost — pick the one that feels a little silly. AI can't sip potions!" },
  { id: "ce1", kind: "celebrate", phase: "Celebrate", tone: "success",
    character: { name: "Dev", image: devCelebrating }, partnerImage: neoCelebrating,
    title: "Story unlocked!", body: "You finished the Story & Concept adventure. Dev and Neo are SO proud of you.",
    reward: "+120 XP · Explorer badge unlocked" },
];

/* ---------- 2. EXPLORE & OBSERVE ---------- */

const exploreCards: LessonCard[] = [
  { id: "es1", kind: "story", phase: "Story", tone: "explore", character: { name: "Neo", image: neoExplaining }, partnerImage: anayaHappy,
    message: "Time to put on your AI detective hat! 🔍 Let's see how many AI moments hide in your everyday life.",
    emphasis: "Hint: it's WAY more than you think." },
  { id: "es2", kind: "concept", phase: "Concept", tone: "explore", character: { name: "Dev", image: devExplaining },
    title: "AI hides in plain sight",
    body: "Most AI doesn't look like a robot. It works quietly behind apps, websites and devices — making them feel smart.",
    pillars: [
      { tone: "explore", icon: <Eye className="h-4 w-4" />, title: "It watches", body: "Listens, sees, reads inputs" },
      { tone: "story", icon: <Brain className="h-4 w-4" />, title: "It learns", body: "Improves the more it sees" },
      { tone: "success", icon: <Wand2 className="h-4 w-4" />, title: "It acts", body: "Suggests, picks, predicts" },
    ] },
  { id: "esp1", kind: "spot", phase: "Spot", tone: "explore", character: { name: "Neo", image: neoThinking },
    prompt: "Spot AI Around You",
    helper: "Think about your daily life. Write down at least 2 examples of AI you've observed in your world.",
    slots: 3, placeholders: [
      "e.g., Google Maps suggests the fastest route home…",
      "e.g., YouTube recommends videos I like…",
      "e.g., My phone unlocks with my face…",
    ],
    examples: [
      { tone: "explore", icon: <MapPin className="h-4 w-4" />, title: "Smart maps", body: "Google Maps suggests the fastest route" },
      { tone: "story", icon: <Sparkles className="h-4 w-4" />, title: "Video feed", body: "YouTube recommends videos I like" },
      { tone: "bonus", icon: <Camera className="h-4 w-4" />, title: "Face unlock", body: "My phone unlocks with my face" },
      { tone: "success", icon: <Music className="h-4 w-4" />, title: "Music for me", body: "Spotify makes a playlist that fits my mood" },
    ] },
  { id: "eq1", kind: "quiz", phase: "Quiz", tone: "explore", character: { name: "Neo", image: neoHappy }, partnerImage: devHappy,
    question: "Which of these is the BEST example of AI in your daily life?",
    options: [
      { id: "a", text: "A calculator doing 2 + 2", correct: false },
      { id: "b", text: "Instagram suggesting reels you might love", correct: true },
      { id: "c", text: "A clock showing the time", correct: false },
      { id: "d", text: "A door bell ringing", correct: false },
    ],
    correctMessage: "Great spotting! Recommendations learn from what you watch — pure AI.",
    wrongMessage: "Close! Look for something that learns from YOU." },
  { id: "ece1", kind: "celebrate", phase: "Celebrate", tone: "success", character: { name: "Neo", image: neoCelebrating }, partnerImage: anayaCelebrating,
    title: "AI Spotter unlocked!", body: "You're starting to see AI everywhere. That's the first superpower of a great AI thinker.",
    reward: "+90 XP · AI Spotter badge" },
];

/* ---------- 3. DO & DECIDE ---------- */

const decideCards: LessonCard[] = [
  { id: "ds1", kind: "story", phase: "Story", tone: "decide", character: { name: "Dev", image: devExplaining }, partnerImage: neoHappy,
    message: "Using AI isn't just about pressing buttons — it's about choosing when, why and how. Let's practise smart decisions together." },
  { id: "dd1", kind: "decide", phase: "Decide", tone: "decide", character: { name: "Dev", image: devThinking }, partnerImage: neoHappy,
    title: "The School AI Assistant",
    scenario: "Your school is thinking about using an AI chatbot to help students with homework after school hours. The chatbot can answer questions, explain concepts, and even solve math problems step by step.",
    question: "What would you decide?",
    options: [
      { id: "a", text: "Use the AI chatbot — it can help students anytime, even when teachers aren't available", tone: "success" },
      { id: "b", text: "Don't use the AI chatbot — students should learn to figure things out on their own", tone: "challenge" },
      { id: "c", text: "Use it only for explanations, not for directly solving problems", tone: "decide" },
    ],
    reasoningLabel: "Why did you choose this?",
    reasoningPlaceholder: "Write your reasoning here… (at least a few words)" },
  { id: "dd2", kind: "decide", phase: "Decide", tone: "bonus", character: { name: "Dev", image: devHappy }, partnerImage: neoCelebrating,
    title: "Group Project Helper",
    scenario: "Your team has 1 day left to finish a science project. An AI tool can write 60% of the report for you in seconds.",
    question: "What's the fairest move?",
    options: [
      { id: "a", text: "Let AI write it all — we'll save time and stress", tone: "challenge" },
      { id: "b", text: "Use AI to brainstorm ideas, then write it ourselves", tone: "success" },
      { id: "c", text: "Have AI write a first draft, then edit it fully as a team", tone: "decide" },
    ],
    reasoningLabel: "Tell us your thinking",
    reasoningPlaceholder: "Why is this the right call for your team?" },
  { id: "dq1", kind: "quiz", phase: "Quiz", tone: "decide", character: { name: "Dev", image: devThinking },
    question: "When is it MOST important to double-check what an AI tells you?",
    options: [
      { id: "a", text: "When it's just a fun fact", correct: false },
      { id: "b", text: "When you'll use it for school, news, or health", correct: true },
      { id: "c", text: "When it's about your favourite colour", correct: false },
      { id: "d", text: "When you don't really care about the answer", correct: false },
    ],
    correctMessage: "Exactly — AI can sound confident even when it's wrong. Always check facts.",
    wrongMessage: "Almost — think about answers that affect real decisions." },
  { id: "dce1", kind: "celebrate", phase: "Celebrate", tone: "success", character: { name: "Dev", image: devCelebrating }, partnerImage: neoCelebrating,
    title: "Smart Decider!", body: "You're learning to use AI like a thoughtful human, not a shortcut. That's how leaders think.",
    reward: "+110 XP · Smart Decider badge" },
];

/* ---------- 4. THINK & WRITE ---------- */

const writeCards: LessonCard[] = [
  { id: "ws1", kind: "story", phase: "Story", tone: "reflect", character: { name: "Anaya", image: anayaExplaining }, partnerImage: neoHappy,
    message: "Big ideas always start as small thoughts. Let's slow down, breathe, and write something only YOU could write." },
  { id: "wc1", kind: "concept", phase: "Concept", tone: "reflect", character: { name: "Anaya", image: anayaThinking },
    title: "Why your imagination matters",
    body: "AI can write a lot of things — but it can't have YOUR life, YOUR people, YOUR dreams. That's where the best ideas live.",
    pillars: [
      { tone: "reflect", icon: <Heart className="h-4 w-4" />, title: "Care", body: "Pick something you love" },
      { tone: "story", icon: <Lightbulb className="h-4 w-4" />, title: "Imagine", body: "Picture it clearly" },
      { tone: "bonus", icon: <Sparkles className="h-4 w-4" />, title: "Share", body: "Tell us in your voice" },
    ] },
  { id: "wr1", kind: "reflect", phase: "Reflect", tone: "reflect", character: { name: "Anaya", image: anayaThinking },
    title: "Reflect & Write",
    prompt: "If you could design an AI tool to help your community, what problem would it solve and how would it work? Think about who would use it and what impact it could have.",
    starters: ["I would build an AI that…", "It would help…", "The best part would be…", "People would feel…"],
    placeholder: "Start writing your thoughts here…",
    minLength: 40 },
  { id: "wr2", kind: "reflect", phase: "Reflect", tone: "story", character: { name: "Anaya", image: anayaHappy },
    title: "One small wish for AI",
    prompt: "Finish this thought: 'I wish AI could…'. Don't worry about being perfect — write what's true for you.",
    starters: ["I wish AI could…", "Because then…", "It would matter to…"],
    placeholder: "Even one honest sentence is enough.",
    minLength: 24 },
  { id: "wce1", kind: "celebrate", phase: "Celebrate", tone: "success", character: { name: "Anaya", image: anayaCelebrating }, partnerImage: neoCelebrating,
    title: "Your voice matters!", body: "You shared something only YOU could share. That's the bravest kind of thinking.",
    reward: "+100 XP · Creative Thinker badge" },
];

/* ---------- 5. ETHICS SCENARIO ---------- */

const ethicsCards: LessonCard[] = [
  { id: "es01", kind: "story", phase: "Story", tone: "challenge", character: { name: "Dev", image: devExplaining }, partnerImage: anayaThinking,
    message: "Some AI questions don't have an easy answer. They make us pause and think about people, fairness, and trust." },
  { id: "ed1", kind: "dilemma", phase: "Dilemma", tone: "challenge", character: { name: "Dev", image: devThinking }, partnerImage: anayaThinking,
    title: "Ethical Dilemma: School & Privacy",
    scenario: "A popular social media app for teenagers has started using AI to track how long students spend on homework apps. The data is shared with schools to identify 'struggling students'. Parents weren't informed about this tracking.",
    question: "Should AI be allowed to monitor student behavior and share that data with schools — even if it might help them?",
    perspectives: [
      { tone: "success", label: "The helpful side", body: "Schools could spot students who need extra support early." },
      { tone: "challenge", label: "The risky side", body: "Students and parents lose control over very personal data." },
    ],
    options: [
      { id: "a", text: "Yes — if it helps identify struggling students early, the benefits outweigh the privacy concerns", tone: "success" },
      { id: "b", text: "No — students deserve privacy, and tracking without consent is wrong regardless of the intention", tone: "challenge" },
      { id: "c", text: "Only if students and parents opt in and can see exactly what's tracked", tone: "decide" },
    ],
    reasoningLabel: "Why do you think so?",
    reasoningPlaceholder: "Share your reasoning… there's no right or wrong answer here" },
  { id: "ed2", kind: "dilemma", phase: "Dilemma", tone: "decide", character: { name: "Anaya", image: anayaExplaining }, partnerImage: devHappy,
    title: "Who gets the scholarship?",
    scenario: "A school uses an AI to score scholarship applications. It's faster and treats every student the same way — but no one fully understands HOW it makes its choices.",
    question: "Is it fair to let AI quietly pick the winners?",
    perspectives: [
      { tone: "explore", label: "Fast & consistent", body: "AI removes tired humans and saves weeks of work." },
      { tone: "challenge", label: "Hidden bias", body: "If the data is unfair, the AI will be unfair — silently." },
    ],
    options: [
      { id: "a", text: "Yes — AI is more consistent than humans", tone: "success" },
      { id: "b", text: "Only if humans review every decision AI makes", tone: "decide" },
      { id: "c", text: "No — humans should make life-changing choices", tone: "challenge" },
    ],
    reasoningLabel: "Defend your choice",
    reasoningPlaceholder: "What's the value you care most about here?" },
  { id: "eq01", kind: "quiz", phase: "Quiz", tone: "challenge", character: { name: "Dev", image: devThinking }, partnerImage: anayaHappy,
    question: "What's the most important question to ask BEFORE we trust an AI with a big decision?",
    options: [
      { id: "a", text: "How fast is it?", correct: false },
      { id: "b", text: "Who built it, with what data, and who can it hurt?", correct: true },
      { id: "c", text: "What colour is its logo?", correct: false },
      { id: "d", text: "How cool does it look?", correct: false },
    ],
    correctMessage: "Yes — knowing the people, data and impact is how we keep AI fair.",
    wrongMessage: "Almost — speed and looks don't make a system ethical." },
  { id: "ece01", kind: "celebrate", phase: "Celebrate", tone: "success", character: { name: "Dev", image: devCelebrating }, partnerImage: anayaCelebrating,
    title: "Ethics Champion!", body: "You thought deeply about fairness, privacy and trust. Our world needs more thinkers like you.",
    reward: "+130 XP · Ethics Champion badge" },
];

/* ---------- 6. WEEKLY QUIZ ---------- */

const quizCards: LessonCard[] = [
  { id: "qs1", kind: "story", phase: "Story", tone: "xp", character: { name: "Neo", image: neoCelebrating }, partnerImage: devHappy,
    message: "GAME TIME! ⚡ Time to put everything together. Get every answer right to unlock your Week 9 badge.",
    emphasis: "Streak ×2 if you don't miss any. Let's go!" },
  { id: "qq1", kind: "quiz", phase: "Quiz", tone: "xp", character: { name: "Neo", image: neoExplaining }, partnerImage: devHappy,
    question: "Which of these is an example of AI?",
    options: [
      { id: "a", text: "Voice assistants like Siri", correct: true },
      { id: "b", text: "A calculator", correct: false },
      { id: "c", text: "A book", correct: false },
      { id: "d", text: "A bicycle", correct: false },
    ],
    correctMessage: "Boom! Siri uses AI to understand speech. +25 XP",
    wrongMessage: "Almost! Look for the one that learns from you." },
  { id: "qq2", kind: "quiz", phase: "Quiz", tone: "challenge", character: { name: "Dev", image: devExplaining },
    question: "What does AI mainly learn from?",
    options: [
      { id: "a", text: "Magic spells", correct: false },
      { id: "b", text: "Data and examples", correct: true },
      { id: "c", text: "Wishes", correct: false },
      { id: "d", text: "Pure luck", correct: false },
    ],
    correctMessage: "Yes! Data is the food AI eats to learn. +25 XP",
    wrongMessage: "Try again — AI loves examples, not magic." },
  { id: "qq3", kind: "quiz", phase: "Quiz", tone: "decide", character: { name: "Dev", image: devThinking }, partnerImage: neoHappy,
    question: "Why should we double-check AI answers?",
    options: [
      { id: "a", text: "Because AI is always wrong", correct: false },
      { id: "b", text: "Because AI can sound confident even when wrong", correct: true },
      { id: "c", text: "Because AI doesn't speak our language", correct: false },
      { id: "d", text: "Because computers are slow", correct: false },
    ],
    correctMessage: "Exactly — confidence isn't truth. Always verify. +25 XP",
    wrongMessage: "Not quite — AI is often right, but not always." },
  { id: "qq4", kind: "quiz", phase: "Quiz", tone: "reflect", character: { name: "Anaya", image: anayaThinking },
    question: "What's something AI CAN'T do well?",
    options: [
      { id: "a", text: "Recognise faces in photos", correct: false },
      { id: "b", text: "Feel real emotions like you do", correct: true },
      { id: "c", text: "Suggest a video", correct: false },
      { id: "d", text: "Translate languages", correct: false },
    ],
    correctMessage: "Right — AI mimics, but doesn't truly feel. +25 XP",
    wrongMessage: "Almost — think about what makes humans unique." },
  { id: "qq5", kind: "quiz", phase: "Quiz", tone: "success", character: { name: "Dev", image: devHappy }, partnerImage: anayaHappy,
    question: "When is it best to use AI?",
    options: [
      { id: "a", text: "To replace your own thinking", correct: false },
      { id: "b", text: "To help and speed up your own thinking", correct: true },
      { id: "c", text: "Only on weekends", correct: false },
      { id: "d", text: "Never", correct: false },
    ],
    correctMessage: "Perfect mindset — AI is a teammate, not a replacement. +25 XP",
    wrongMessage: "Think about AI as a sidekick, not the hero." },
  { id: "qce1", kind: "celebrate", phase: "Celebrate", tone: "success", character: { name: "Neo", image: neoCelebrating }, partnerImage: devCelebrating,
    title: "Week 9 Complete!", body: "You crushed every question and finished the full Week 9 journey. Confetti for you!",
    reward: "+125 XP · Weekly Champion badge" },
];

/* ---------- Activities map ---------- */

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  story: {
    slug: "story", emoji: "📖", blurb: "Meet Dev & Neo and discover what AI really is.",
    meta: { weekLabel: "Week 9", activityNumber: 1, title: "Story & Concept", tone: "story", totalXp: 120, badge: "Explorer",
      backHref: "/activities", nextHref: "/activities/explore", nextTitle: "Explore & Observe" },
    cards: storyCards,
  },
  explore: {
    slug: "explore", emoji: "🔍", blurb: "Spot AI in your daily life — like a detective.",
    meta: { weekLabel: "Week 9", activityNumber: 2, title: "Explore & Observe", tone: "explore", totalXp: 90, badge: "AI Spotter",
      backHref: "/activities", nextHref: "/activities/decide", nextTitle: "Do & Decide" },
    cards: exploreCards,
  },
  decide: {
    slug: "decide", emoji: "⚖️", blurb: "Make smart, fair decisions about using AI.",
    meta: { weekLabel: "Week 9", activityNumber: 3, title: "Do & Decide", tone: "decide", totalXp: 110, badge: "Smart Decider",
      backHref: "/activities", nextHref: "/activities/write", nextTitle: "Think & Write" },
    cards: decideCards,
  },
  write: {
    slug: "write", emoji: "✍️", blurb: "Imagine AI that helps your community. Write it out.",
    meta: { weekLabel: "Week 9", activityNumber: 4, title: "Think & Write", tone: "reflect", totalXp: 100, badge: "Creative Thinker",
      backHref: "/activities", nextHref: "/activities/ethics", nextTitle: "Ethics Scenario" },
    cards: writeCards,
  },
  ethics: {
    slug: "ethics", emoji: "🛡️", blurb: "Tackle real AI ethics dilemmas with Dev & Anaya.",
    meta: { weekLabel: "Week 9", activityNumber: 5, title: "Ethics Scenario", tone: "challenge", totalXp: 130, badge: "Ethics Champion",
      backHref: "/activities", nextHref: "/activities/quiz", nextTitle: "Weekly Quiz" },
    cards: ethicsCards,
  },
  quiz: {
    slug: "quiz", emoji: "🏆", blurb: "Test everything you learned — earn the Week 9 badge.",
    meta: { weekLabel: "Week 9", activityNumber: 6, title: "Weekly Quiz", tone: "xp", totalXp: 125, badge: "Weekly Champion",
      backHref: "/activities", nextHref: "/activities", nextTitle: "Your journey" },
    cards: quizCards,
  },
};

export const ACTIVITY_ORDER = ["story", "explore", "decide", "write", "ethics", "quiz"] as const;

/* ---------- Icons for hub ---------- */
export const HUB_ICONS = {
  story: Bot,
  explore: Eye,
  decide: Globe,
  write: Lightbulb,
  ethics: Shield,
  quiz: Sparkles,
} as const;

// re-export for convenience in route files
export { ShieldAlert };
