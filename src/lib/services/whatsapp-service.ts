import { callLLM } from "@/lib/ai/provider";

export interface WhatsAppDoubtRequest {
  studentName?: string;
  phoneNumber?: string;
  query: string;
  language?: string; // "en" | "te" | "hi"
}

export interface WhatsAppAssignmentRequest {
  studentName?: string;
  assignmentTitle: string;
  problemStatement: string;
  studentSolution: string;
  language?: string;
}

export interface WhatsAppReviewResult {
  score: number; // 0 - 10
  verdict: "Mastered" | "Partially Correct" | "Needs Revision";
  mistakeIdentified: string;
  pedagogicalHint: string;
  stepByStepFeedback: string[];
  encouragement: string;
  whatsappFormattedMessage: string;
}

export interface WhatsAppDoubtResult {
  concept: string;
  simpleExplanation: string;
  realWorldAnalogy: string;
  stepByStepSolution: string[];
  followUpCheck: string;
  whatsappFormattedMessage: string;
}

/**
 * Solves student doubts via WhatsApp conversational style with bilingual support.
 */
export async function analyzeWhatsAppDoubt(
  req: WhatsAppDoubtRequest
): Promise<WhatsAppDoubtResult> {
  const { query, language = "en", studentName = "Student" } = req;

  const languageMap: Record<string, string> = {
    te: "Telugu (తెలుగు)",
    hi: "Hindi (हिंदी)",
    ta: "Tamil (தமிழ்)",
    en: "English",
  };
  const langText = languageMap[language] || "English";

  const systemPrompt = `You are Nexora's WhatsApp AI Doubt Solver assisting a student.
Format your reply clearly with WhatsApp styling (*bold*, _italics_, bullet points, friendly emojis).
The student language is ${langText}.
If Telugu, Hindi, or Tamil is selected, respond naturally in that language using its script.

Output ONLY valid JSON:
{
  "concept": "Name of the core concept",
  "simpleExplanation": "Concise intuitive explanation in 2-3 sentences",
  "realWorldAnalogy": "A relatable real-world example",
  "stepByStepSolution": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "followUpCheck": "A quick 1-question check to see if the student understood",
  "whatsappFormattedMessage": "Ready-to-send WhatsApp message with greeting, emojis, *bolding*, steps, and check question"
}`;

  try {
    const res = await callLLM(`Student query: "${query}"`, { systemPrompt, maxTokens: 1400, jsonMode: true });
    let cleanText = res.text.trim();
    if (cleanText.includes("```json")) {
      const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    } else if (cleanText.includes("```")) {
      const match = cleanText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    }

    const parsed = JSON.parse(cleanText);
    return {
      concept: parsed.concept || "Concept Explanation",
      simpleExplanation: parsed.simpleExplanation || "",
      realWorldAnalogy: parsed.realWorldAnalogy || "",
      stepByStepSolution: parsed.stepByStepSolution || [],
      followUpCheck: parsed.followUpCheck || "",
      whatsappFormattedMessage: parsed.whatsappFormattedMessage ||
`*👋 Hello ${studentName}! Nexora AI Tutor here.*

*📚 Concept:* ${parsed.concept || "Explanation"}
${parsed.simpleExplanation || ""}

*💡 Real-Life Analogy:*
${parsed.realWorldAnalogy || ""}

*📝 Step-by-Step Breakdown:*
${(parsed.stepByStepSolution || []).map((s: string) => `• ${s}`).join("\n")}

*❓ Quick Check for You:*
${parsed.followUpCheck || "Did this make sense? Reply with your thoughts!"}

_Reply anytime to ask another doubt!_ 🚀`,
    };
  } catch (e: any) {
    // If JSON parsing or AI call failed, make a direct natural language call to Gemini for a plain text reply
    try {
      const directAI = await callLLM(
        `Answer this student question concisely in WhatsApp format for a student in ${langText}: "${query}". Include friendly greeting, bold key terms, steps, and a follow-up question.`
      );
      return {
        concept: "AI Doubt Answer",
        simpleExplanation: directAI.text,
        realWorldAnalogy: "",
        stepByStepSolution: [],
        followUpCheck: "",
        whatsappFormattedMessage: directAI.text,
      };
    } catch (err: any) {
      throw new Error(`AI Doubt Solver failed: ${err.message}`);
    }
  }
}

/**
 * Reviews an assignment or homework solution submitted by a student.
 */
export async function reviewWhatsAppAssignment(
  req: WhatsAppAssignmentRequest
): Promise<WhatsAppReviewResult> {
  const { assignmentTitle, problemStatement, studentSolution, studentName = "Student" } = req;

  const systemPrompt = `You are Nexora's AI WhatsApp Homework & Assignment Reviewer.
Evaluate the student's solution carefully.
Do not just give away the answer if they made a mistake—give a pedagogical hint guiding them to find their own mistake!
Output ONLY valid JSON:
{
  "score": 8,
  "verdict": "Partially Correct",
  "mistakeIdentified": "Specific mistake or 'None - fully accurate'",
  "pedagogicalHint": "Guiding question or clue to help them correct it",
  "stepByStepFeedback": [
    "Step 1: Correctly identified ...",
    "Step 2: Sign error occurred when moving -4 to the right side ...",
    "Step 3: Recalculate from here ..."
  ],
  "encouragement": "Positive encouraging sentence acknowledging their effort",
  "whatsappFormattedMessage": "The full formatted message ready to send back to the student on WhatsApp"
}`;

  const userPrompt = `Assignment: ${assignmentTitle}
Problem: ${problemStatement}
Student's Submitted Solution:
${studentSolution}`;

  try {
    const res = await callLLM(userPrompt, { systemPrompt, maxTokens: 1400, jsonMode: true });
    let cleanText = res.text.trim();
    if (cleanText.includes("```json")) {
      const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    } else if (cleanText.includes("```")) {
      const match = cleanText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    }

    const data = JSON.parse(cleanText);
    const score = typeof data.score === "number" ? data.score : 8;
    const verdict = data.verdict || (score >= 8 ? "Mastered" : score >= 5 ? "Partially Correct" : "Needs Revision");

    return {
      score,
      verdict,
      mistakeIdentified: data.mistakeIdentified || "",
      pedagogicalHint: data.pedagogicalHint || "",
      stepByStepFeedback: data.stepByStepFeedback || [],
      encouragement: data.encouragement || "",
      whatsappFormattedMessage: data.whatsappFormattedMessage ||
`*📋 Assignment Review Report*
*Subject:* ${assignmentTitle}
*Student:* ${studentName}

*⭐ Score:* ${score}/10
*Status:* ${verdict === "Mastered" ? "✅ Mastered" : verdict === "Partially Correct" ? "⚠️ Partially Correct" : "🔄 Needs Revision"}

*🔍 Analysis:*
${data.mistakeIdentified}

*💡 Guidance Hint:*
_${data.pedagogicalHint}_

*📝 Step-by-Step Review:*
${(data.stepByStepFeedback || []).map((s: string) => `• ${s}`).join("\n")}

*🌟 ${data.encouragement || "Great effort!"}*
_Send your revised answer anytime!_ 🚀`,
    };
  } catch (e: any) {
    try {
      const directAI = await callLLM(
        `You are Nexora's AI assignment reviewer. Review this solution for ${studentName} on ${assignmentTitle}. Problem: ${problemStatement}. Solution: ${studentSolution}. Give pedagogical hint and constructive score in WhatsApp style.`
      );
      return {
        score: 8,
        verdict: "Partially Correct",
        mistakeIdentified: "Review complete",
        pedagogicalHint: "See detailed feedback below",
        stepByStepFeedback: [],
        encouragement: "Keep practicing!",
        whatsappFormattedMessage: directAI.text,
      };
    } catch (err: any) {
      throw new Error(`AI Assignment Review failed: ${err.message}`);
    }
  }
}

