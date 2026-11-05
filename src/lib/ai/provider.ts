/**
 * NEXORA — AI Provider Abstraction
 *
 * Supports providers controlled by GEMMA_PROVIDER env var:
 *   "gemini"  → Google Gemini API (gemini-3-flash-preview / gemini-flash-latest)
 *   "demo"    → Pre-generated sample responses
 *   "ollama"  → Local Ollama (ollama pull gemma2:2b)
 *   "groq"    → Groq hosted inference
 *   "together" → Together.ai
 */

export type AIProvider = "gemini" | "demo" | "ollama" | "groq" | "together";

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  jsonMode?: boolean;
}

export interface LLMResponse {
  text: string;
  isDemo: boolean;
  provider: AIProvider;
}

// ---------------------------------------------------------------------------
// Google Gemini Provider
// ---------------------------------------------------------------------------
async function callGemini(prompt: string, options: LLMOptions): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";

  const modelsToTry = [
    process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite-preview",
    "gemma-4-26b-a4b-it",
    "gemini-flash-latest",
  ];

  let fullPrompt = prompt;
  if (options.systemPrompt) {
    fullPrompt = `${options.systemPrompt}\n\nUser request: ${prompt}`;
  }

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const isJson = options.jsonMode || (options.systemPrompt && options.systemPrompt.includes("JSON")) || prompt.includes("JSON");
      const generationConfig: Record<string, any> = {
        temperature: options.temperature ?? 0.4,
        maxOutputTokens: options.maxTokens ?? 1200,
      };
      if (isJson) {
        generationConfig.responseMimeType = "application/json";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`Gemini ${model} error ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to reach Gemini API");
}

// ---------------------------------------------------------------------------
// Demo responses
// ---------------------------------------------------------------------------
const DEMO_RESPONSES: Record<string, string> = {
  default: `[DEMO MODE]
This is an automated conceptual response. Connect your Gemini API key to receive live AI explanations.`,
  explain: `[DEMO MODE]
Key concept breakdown:
1. Overview & intuition
2. Step-by-step logic
3. Worked example
4. Common pitfalls to avoid`,
  translate: `[DEMO MODE — తెలుగు అనువాదం]
ఈ భావన గురించి వివరణ: ఇది గణితం లేదా కంప్యూటర్ సైన్స్ ప్రాథమిక అంశం.`,
  diagnose: `[DEMO MODE — Diagnostic Analysis]
Hypothesis: Responses indicate an apparent difficulty with foundational concepts. Reviewing prerequisites is recommended.`,
};

function getDemoResponse(promptHint: string): string {
  if (promptHint.includes("translat") || promptHint.includes("telugu")) {
    return DEMO_RESPONSES.translate;
  }
  if (promptHint.includes("diagnos") || promptHint.includes("gap")) {
    return DEMO_RESPONSES.diagnose;
  }
  if (promptHint.includes("explain") || promptHint.includes("concept")) {
    return DEMO_RESPONSES.explain;
  }
  return DEMO_RESPONSES.default;
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------
export async function callLLM(
  prompt: string,
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const provider = (process.env.GEMMA_PROVIDER ?? "gemini") as AIProvider;

  if (provider === "demo") {
    return {
      text: getDemoResponse(prompt.toLowerCase() + (options.systemPrompt ?? "").toLowerCase()),
      isDemo: true,
      provider: "demo",
    };
  }

  try {
    const text = await callGemini(prompt, options);
    return { text, isDemo: false, provider: "gemini" };
  } catch (error: any) {
    console.error(`[Gemini AI Error]:`, error?.message || error);
    // If strict demo provider requested
    if (provider === "demo") {
      return {
        text: getDemoResponse(prompt.toLowerCase()),
        isDemo: true,
        provider: "demo",
      };
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Structured prompt builders
// ---------------------------------------------------------------------------
export const Prompts = {
  explain: (concept: string, language: string, level: string) => ({
    system: `You are Nexora's AI learning companion. Explain concepts clearly and accurately.
Always structure your response with: Overview, Step-by-step breakdown, Real-world example, Common mistakes, Self-check question.
Respond in ${language}. Adjust complexity for a ${level} learner.`,
    user: `Explain the concept: "${concept}"`,
  }),

  diagnose: (concept: string, wrongAnswer: string, correctAnswer: string) => ({
    system: `You are Nexora's Learning Failure Archaeologist. 
Analyze why a learner gave a wrong answer. Identify likely prerequisite gaps.
Present your analysis as a hypothesis, not a verdict. Be supportive and specific.`,
    user: `Concept: ${concept}
Learner's answer: ${wrongAnswer}
Correct answer: ${correctAnswer}
What prerequisite gap might explain this mistake?`,
  }),

  generateQuestions: (topic: string, level: string, count: number = 3) => ({
    system: `You are an expert assessment designer for NEXORA. Generate diagnostic baseline questions to assess a learner's actual knowledge.
Return ONLY a valid JSON array of objects with keys:
[
  {
    "id": "q1",
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Exact matching string of correct option",
    "explanation": "Brief explanation why",
    "concept": "Specific concept tested"
  }
]
Do not wrap in markdown quotes if possible, or use standard markdown JSON format.`,
    user: `Generate ${count} diagnostic multiple-choice questions for someone wanting to learn "${topic}" at a "${level}" level.`,
  }),

  extractCapabilities: (evidence: string) => ({
    system: `You are Nexora's capability analyst. From learner activity evidence, identify demonstrated capabilities.
Map to: Analytical Reasoning, Pattern Recognition, Strategic Planning, Diagnostic Reasoning, Spatial Reasoning, Communication, Collaboration, Creativity, Practical Problem-Solving.`,
    user: `Learner activity evidence:\n${evidence}`,
  }),
};
