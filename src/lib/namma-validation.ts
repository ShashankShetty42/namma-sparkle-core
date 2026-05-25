/**
 * Namma AI · Intelligent writing validation system.
 *
 * Philosophy
 * ──────────
 * Reward EFFORT, REASONING, REFLECTION, CREATIVITY — not strict correctness.
 * Feedback is always warm, character-driven, and emotionally safe.
 *
 * Architecture
 *   Layer 1 (frontend, this file): instant heuristic checks — counts,
 *       unique words, nonsense detection, soft keyword relevance.
 *   Layer 2 (backend stub, `submitToBackend`): simulated review pass so the
 *       UI can show a "Neo is reviewing your thoughts…" cinematic moment.
 *       Drop-in for a future AI gateway call.
 *
 * Never returns words like "wrong", "invalid", "error", "failed".
 */

/* ─────────────────────────── tiers ─────────────────────────── */

export type ValidationTier =
  | "explore"       // Spot / Explore & Observe (younger)
  | "decide"        // Do & Decide reasoning
  | "reflect"       // Think & Write essay
  | "ethics"        // Dilemma / ethics scenario
  | "advanced"      // Grade 7–8 bonus
  | "expert";       // Grade 9–10 bonus

export type ValidationLevel =
  | "empty"
  | "typing"
  | "short"
  | "spam"
  | "nonsense"
  | "low-relevance"
  | "ok"
  | "excellent";

export type RelevanceBand = "low" | "medium" | "high";

export type ValidationResult = {
  /** Allowed to advance / submit. */
  ok: boolean;
  level: ValidationLevel;
  /** Warm, character-driven message for the writer. */
  message: string;
  /** 0-100 — drives glow + progress bar fills. */
  progress: number;
  /** Live word count. */
  words: number;
  /** Distinct meaningful words. */
  uniqueWords: number;
  /** Character count after trim. */
  chars: number;
  /** Soft semantic-relevance band based on keyword overlap. */
  relevance: RelevanceBand;
  /** Effort score 0-100 used by future backend layer. */
  thoughtfulness: number;
};

export type ValidationInput = {
  value: string;
  tier: ValidationTier;
  /** Override minimum word count for this prompt. */
  minWords?: number;
  /** Override minimum char count for this prompt. */
  minChars?: number;
  /** Week-specific keywords for soft relevance scoring. */
  keywords?: string[];
  /** Hint progression — increases with each failed submit attempt. */
  attempt?: number;
};

/* ────────────────────── tier defaults ─────────────────────── */

const TIER_RULES: Record<
  ValidationTier,
  { minWords: number; minChars: number; idealWords: number; minUnique: number }
> = {
  explore:  { minWords: 5,  minChars: 20, idealWords: 12,  minUnique: 4  },
  decide:   { minWords: 6,  minChars: 22, idealWords: 18,  minUnique: 5  },
  reflect:  { minWords: 45, minChars: 180, idealWords: 65, minUnique: 22 },
  ethics:   { minWords: 35, minChars: 160, idealWords: 55, minUnique: 20 },
  advanced: { minWords: 50, minChars: 220, idealWords: 65, minUnique: 28 },
  expert:   { minWords: 70, minChars: 320, idealWords: 90, minUnique: 38 },
};

/* ───────────────── nonsense / spam detection ───────────────── */

const KEYBOARD_GIBBERISH = [
  "asdf", "qwer", "qwerty", "zxcv", "asdfgh", "hjkl",
  "aaaa", "bbbb", "cccc", "1234", "12345", "abcdef",
  "lorem", "ipsum",
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "it", "and", "or", "but", "if", "in", "on",
  "to", "of", "for", "with", "as", "at", "by", "be", "are", "was",
  "were", "this", "that", "i", "you", "we", "they", "he", "she",
  "do", "does", "did", "so", "very", "just", "really", "my", "your",
  "our", "their", "his", "her", "its", "have", "has", "had",
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function meaningfulTokens(tokens: string[]): string[] {
  return tokens.filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function isKeyboardMash(value: string): boolean {
  const v = value.toLowerCase().replace(/\s+/g, "");
  if (v.length < 6) return false;
  if (KEYBOARD_GIBBERISH.some((g) => v.includes(g.repeat(2)))) return true;
  // 5+ of the same char in a row
  if (/(.)\1{4,}/.test(v)) return true;
  // No vowels at all in a long string => likely mash
  if (v.length > 14 && !/[aeiou]/i.test(v)) return true;
  return false;
}

function spamRatio(tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const unique = new Set(tokens);
  return 1 - unique.size / tokens.length;
}

/* ───────────────── relevance scoring ───────────────── */

function relevanceFor(tokens: string[], keywords?: string[]): RelevanceBand {
  if (!keywords || keywords.length === 0) return "high"; // no keywords => don't penalise
  const set = new Set(tokens);
  let hits = 0;
  for (const k of keywords) {
    const parts = k.toLowerCase().split(/\s+/);
    if (parts.every((p) => set.has(p))) hits += 1;
  }
  if (hits >= 3) return "high";
  if (hits >= 1) return "medium";
  return "low";
}

/* ───────────────── neo voice (rotating) ───────────────── */

const VOICE = {
  empty: [
    "Take your time — there's no rush.",
    "Whenever you're ready, share a thought.",
  ],
  typing: [
    "Keep going — your thinking matters here.",
    "Nice start. Tell me a little more.",
    "Interesting thought. Keep building it.",
  ],
  short: [
    "Tell me a little more.",
    "Can you explain your reasoning?",
    "Try adding one more idea.",
  ],
  spam: [
    "Try using different words.",
    "Use your own ideas — even one line in your voice is enough.",
  ],
  nonsense: [
    "Try writing in your own words.",
    "Take a breath and share a real thought.",
  ],
  lowRelevance: [
    "Try connecting your ideas to this week.",
    "Try adding ideas from this week.",
  ],
  ok: [
    "Great thinking!",
    "Interesting observation.",
    "Thought submitted.",
  ],
  excellent: [
    "That's a thoughtful perspective.",
    "You're thinking carefully about people and technology.",
    "Beautiful reflection — your ideas connect strongly to this week.",
  ],
} as const;

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/* ────────────── progressive hint ladder ────────────── */

const HINT_LADDER = [
  "Tell me a little more.",
  "Try explaining WHY you think that.",
  "Use ideas from this week like fairness, trust, or creativity.",
];

export function progressiveHint(attempt: number): string {
  return HINT_LADDER[Math.min(attempt, HINT_LADDER.length - 1)];
}

/* ───────────────── main validator ───────────────── */

export function validateText(input: ValidationInput): ValidationResult {
  const rules = TIER_RULES[input.tier];
  const minWords = input.minWords ?? rules.minWords;
  const minChars = input.minChars ?? rules.minChars;
  const idealWords = rules.idealWords;
  const minUnique = rules.minUnique;

  const trimmed = input.value.trim();
  const tokens = tokenize(trimmed);
  const meaningful = meaningfulTokens(tokens);
  const uniqueSet = new Set(meaningful);
  const chars = trimmed.length;
  const words = tokens.length;
  const uniqueWords = uniqueSet.size;

  const progress = Math.max(
    0,
    Math.min(100, Math.round((words / Math.max(1, idealWords)) * 100)),
  );

  // empty
  if (chars === 0) {
    return base("empty", false, VOICE.empty, progress);
  }

  // actively typing but well under
  if (chars < Math.min(8, minChars / 3)) {
    return base("typing", false, VOICE.typing, progress);
  }

  // nonsense
  if (isKeyboardMash(trimmed)) {
    return base("nonsense", false, VOICE.nonsense, progress);
  }

  // spam (repetition)
  if (words >= 4 && spamRatio(tokens) > 0.55) {
    return base("spam", false, VOICE.spam, progress);
  }

  // too short
  if (chars < minChars || words < minWords) {
    return base("short", false, VOICE.short, progress);
  }

  // unique-word floor (soft spam guard)
  if (uniqueWords < minUnique) {
    return base("spam", false, VOICE.spam, progress);
  }

  const relevance = relevanceFor(meaningful, input.keywords);

  // low relevance — pass-with-encouragement (do not hard reject thoughtful answers)
  if (relevance === "low" && (input.keywords?.length ?? 0) >= 2 && words < idealWords) {
    return base("low-relevance", true, VOICE.lowRelevance, progress, {
      relevance,
      uniqueWords,
      words,
      chars,
      thoughtfulness: thoughtfulnessScore({ words, uniqueWords, relevance, idealWords }),
    });
  }

  const thoughtfulness = thoughtfulnessScore({
    words, uniqueWords, relevance, idealWords,
  });

  if (thoughtfulness >= 82 && relevance !== "low") {
    return base("excellent", true, VOICE.excellent, Math.max(progress, 100), {
      relevance, uniqueWords, words, chars, thoughtfulness,
    });
  }

  return base("ok", true, VOICE.ok, Math.max(progress, 80), {
    relevance, uniqueWords, words, chars, thoughtfulness,
  });

  function base(
    level: ValidationLevel,
    ok: boolean,
    pool: readonly string[],
    p: number,
    extras?: Partial<ValidationResult>,
  ): ValidationResult {
    // honour progressive hint when student has failed twice
    let message = pick(pool, words + uniqueWords + chars);
    if (!ok && (input.attempt ?? 0) >= 1) {
      message = progressiveHint(input.attempt ?? 0);
    }
    return {
      ok,
      level,
      message,
      progress: p,
      words,
      uniqueWords,
      chars,
      relevance: extras?.relevance ?? "medium",
      thoughtfulness: extras?.thoughtfulness ?? Math.min(100, p),
      ...extras,
    };
  }
}

function thoughtfulnessScore({
  words, uniqueWords, relevance, idealWords,
}: { words: number; uniqueWords: number; relevance: RelevanceBand; idealWords: number }) {
  const lenScore = Math.min(60, (words / idealWords) * 60);
  const diversityScore = Math.min(25, (uniqueWords / Math.max(1, words)) * 25);
  const relScore = relevance === "high" ? 15 : relevance === "medium" ? 9 : 3;
  return Math.round(lenScore + diversityScore + relScore);
}

/* ───────────────── fake backend submission ───────────────── */

export type BackendSubmissionResult = {
  approved: boolean;
  relevance: RelevanceBand;
  effort: "low" | "medium" | "high";
  originality: "low" | "medium" | "high";
  encouragement: string;
  thoughtfulness: number;
};

/**
 * Simulated backend / Moodle / AI gateway review.
 * Real implementation should POST to a server function; the shape is stable.
 */
export async function submitToBackend(
  text: string,
  tier: ValidationTier,
  keywords?: string[],
): Promise<BackendSubmissionResult> {
  // Pretend latency — gives Neo time to "review your thoughts…"
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
  const v = validateText({ value: text, tier, keywords });
  const approved = v.ok;
  const effort: BackendSubmissionResult["effort"] =
    v.thoughtfulness >= 70 ? "high" : v.thoughtfulness >= 45 ? "medium" : "low";
  const originality: BackendSubmissionResult["originality"] =
    v.uniqueWords / Math.max(1, v.words) > 0.65 ? "high"
    : v.uniqueWords / Math.max(1, v.words) > 0.45 ? "medium" : "low";
  return {
    approved,
    relevance: v.relevance,
    effort,
    originality,
    thoughtfulness: v.thoughtfulness,
    encouragement: approved
      ? "Great reflection — your ideas matter."
      : v.message,
  };
}

/* ───────────────── default week keywords ───────────────── */

export const WEEK_KEYWORDS: Record<string, string[]> = {
  "week-9": [
    "ai", "artificial", "intelligence", "data", "pattern", "learn", "model",
    "fair", "fairness", "trust", "safety", "privacy", "responsibility",
    "creative", "creativity", "consent", "ethics", "ethical",
  ],
};
