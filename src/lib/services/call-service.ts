import { callLLM } from "@/lib/ai/provider";

export interface CallSchedule {
  phoneNumber: string;
  preferredTime: string; // e.g., "18:30"
  topic: string;
  language: string; // "en" | "te" | "hi" | "ta"
  studentName: string;
  enabled: boolean;
  frequency: "daily" | "weekdays" | "custom";
}

export interface KeypadQuestion {
  questionNumber: number;
  questionText: string;
  options: {
    digit: number; // 1, 2, 3, 4
    text: string;
  }[];
  correctDigit: number;
  explanation: string;
}

export interface VoiceLessonSession {
  sessionId: string;
  topic: string;
  language: string;
  introScript: string;
  teachingScript: string[];
  testIntroScript: string;
  questions: KeypadQuestion[];
  conclusionScript: string;
}

export interface CallLogEntry {
  id: string;
  timestamp: string;
  topic: string;
  phoneNumber: string;
  durationSeconds: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  transcript: string[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  te: "Telugu (తెలుగు)",
  hi: "Hindi (हिंदी)",
  ta: "Tamil (தமிழ்)",
};

export const activeCallSessions = new Map<string, VoiceLessonSession>();

export function saveCallSession(session: VoiceLessonSession) {
  activeCallSessions.set(session.sessionId, session);
}

export function getCallSession(sessionId: string): VoiceLessonSession | undefined {
  return activeCallSessions.get(sessionId);
}

/**
 * Uses Gemini AI to synthesize a voice-first lesson script and keypad test questions.
 * Designed specifically for feature phone / keypad / audio IVR calls.
 */
export async function generateVoiceLesson(
  topic: string,
  language: string = "en",
  studentName: string = "Student"
): Promise<VoiceLessonSession> {
  const langName = LANGUAGE_NAMES[language] || "English";

  const systemPrompt = `You are Nexora's Voice Tutor calling an Indian student who is using a basic keypad / feature phone.
Your job is to teach a concise 2-minute voice lesson on "${topic}" and then conduct a 2-question keypad test.
The response language MUST be ${langName}. If Telugu, Hindi, or Tamil is selected, use natural spoken language written in that script.
Output ONLY a JSON object in this exact structure:
{
  "introScript": "Warm voice greeting calling ${studentName} for today's scheduled lesson on ${topic}.",
  "teachingScript": [
    "First concept explanation in simple everyday words with real-life analogy (2-3 sentences)",
    "Second practical example or formula (2-3 sentences)"
  ],
  "testIntroScript": "Audio prompt telling student: Now let's test what you learned! Press the number on your phone keypad to answer.",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Clear spoken question about the lesson",
      "options": [
        { "digit": 1, "text": "First option" },
        { "digit": 2, "text": "Second option" },
        { "digit": 3, "text": "Third option" },
        { "digit": 4, "text": "Fourth option" }
      ],
      "correctDigit": 2,
      "explanation": "Why digit 2 is correct in 1 spoken sentence."
    },
    {
      "questionNumber": 2,
      "questionText": "Second distinct question testing application of the concept",
      "options": [
        { "digit": 1, "text": "First option" },
        { "digit": 2, "text": "Second option" },
        { "digit": 3, "text": "Third option" },
        { "digit": 4, "text": "Fourth option" }
      ],
      "correctDigit": 1,
      "explanation": "Why digit 1 is correct in 1 spoken sentence."
    }
  ],
  "conclusionScript": "Encouraging closing words praising their consistency and reminding them of tomorrow's call time."
}`;

  const userPrompt = `Generate the phone lesson and keypad test for topic: "${topic}" in ${langName}.`;

  try {
    const res = await callLLM(userPrompt, { systemPrompt, maxTokens: 1500, jsonMode: true });
    let cleanText = res.text.trim();
    if (cleanText.includes("```json")) {
      const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    } else if (cleanText.includes("```")) {
      const match = cleanText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    }

    const data = JSON.parse(cleanText);
    const session: VoiceLessonSession = {
      sessionId: "call-" + Date.now(),
      topic,
      language,
      introScript: data.introScript || `Hello ${studentName}! This is your daily Nexora AI tutor calling for your lesson on ${topic}.`,
      teachingScript: Array.isArray(data.teachingScript) ? data.teachingScript : [data.teachingScript || `${topic} is a crucial foundation.`],
      testIntroScript: data.testIntroScript || "Now let's conduct your oral keypad test. Listen to each question and press your phone keypad.",
      questions: Array.isArray(data.questions) && data.questions.length >= 2 ? data.questions : [
        {
          questionNumber: 1,
          questionText: data.questions?.[0]?.questionText || `In ${topic}, what is the foundational rule?`,
          options: data.questions?.[0]?.options || [
            { digit: 1, text: "Always apply the formula step by step" },
            { digit: 2, text: "Guess randomly" },
          ],
          correctDigit: data.questions?.[0]?.correctDigit || 1,
          explanation: data.questions?.[0]?.explanation || "Systematic step-by-step logic is correct.",
        },
        {
          questionNumber: 2,
          questionText: data.questions?.[1]?.questionText || `When applying ${topic} in real life, what is most important?`,
          options: data.questions?.[1]?.options || [
            { digit: 1, text: "Understanding the underlying concept" },
            { digit: 2, text: "Skipping calculation steps" },
          ],
          correctDigit: data.questions?.[1]?.correctDigit || 1,
          explanation: data.questions?.[1]?.explanation || "Conceptual understanding is essential.",
        },
      ],
      conclusionScript: data.conclusionScript || "Great effort on today's call! Keep practicing and Nexora AI will call you again tomorrow. Goodbye!",
    };

    saveCallSession(session);
    return session;
  } catch (err: any) {
    // If strict JSON generation had an issue, use AI in plain prompt to formulate a dynamic voice lesson
    const fallbackPrompt = `You are a voice tutor for an Indian student. Teach ${topic} in 3 short spoken sentences in ${langName}. Then give 1 question with 2 keypad options.`;
    const aiText = await callLLM(fallbackPrompt);
    const session: VoiceLessonSession = {
      sessionId: "call-" + Date.now(),
      topic,
      language,
      introScript: `Namaste ${studentName}! This is Nexora AI Voice Tutor calling for your daily audio lesson on ${topic}.`,
      teachingScript: [aiText.text],
      testIntroScript: "Let us now take your keypad test.",
      questions: [
        {
          questionNumber: 1,
          questionText: `Based on what we just learned about ${topic}, which method is correct?`,
          options: [
            { digit: 1, text: "Using the formula accurately" },
            { digit: 2, text: "Random estimation" },
          ],
          correctDigit: 1,
          explanation: "Accurate formulas produce correct results.",
        },
        {
          questionNumber: 2,
          questionText: "What ensures long-term mastery?",
          options: [
            { digit: 1, text: "Daily short practice" },
            { digit: 2, text: "Ignoring revisions" },
          ],
          correctDigit: 1,
          explanation: "Consistent practice builds solid mastery.",
        },
      ],
      conclusionScript: "You did wonderfully on today's phone lesson! Progress saved. Have a productive day!",
    };
    saveCallSession(session);
    return session;
  }
}

