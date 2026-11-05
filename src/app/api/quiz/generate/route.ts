import { NextRequest, NextResponse } from "next/server";
import { callLLM, Prompts } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const { topic = "Calculus & Optimization", level = "Beginner", count = 3 } = await req.json();

    const { system, user } = Prompts.generateQuestions(topic, level, count);
    const result = await callLLM(user, { systemPrompt: system, maxTokens: 1400 });

    let questions: any[] = [];

    // Clean potential markdown formatting
    let cleanText = result.text.trim();
    if (cleanText.includes("```json")) {
      const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    } else if (cleanText.includes("```")) {
      const match = cleanText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) cleanText = match[1].trim();
    }

    try {
      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else if (parsed.quiz_question) {
        questions = [parsed.quiz_question];
      } else if (typeof parsed === "object" && parsed !== null) {
        // Attempt to extract array values or wrap object
        const values = Object.values(parsed);
        const arrayVal = values.find((v) => Array.isArray(v));
        if (arrayVal) {
          questions = arrayVal as any[];
        } else if (parsed.question && parsed.options) {
          questions = [parsed];
        }
      }

      // Normalize fields (e.g. correct vs correct_answer)
      questions = questions.map((q, idx) => ({
        id: q.id || `q${idx + 1}`,
        question: q.question || "Diagnostic Question",
        options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
        correct: q.correct || q.correct_answer || (Array.isArray(q.options) ? q.options[0] : "Option A"),
        explanation: q.explanation || "Demonstrated foundational concept.",
        concept: q.concept || q.topic || topic,
      }));
    } catch {
      // JSON parse failed, will use fallback below
      questions = [];
    }

    if (!questions || questions.length === 0) {
      questions = [
        {
          id: "q1",
          question: `In ${topic}, what is the fundamental purpose of optimization?`,
          options: [
            "Minimizing or maximizing an objective function",
            "Encrypting data buffers",
            "Increasing network latency",
            "Formatting disk partitions",
          ],
          correct: "Minimizing or maximizing an objective function",
          explanation: "Optimization methods iteratively adjust parameters to minimize error or maximize reward.",
          concept: "Optimization Foundations",
        },
        {
          id: "q2",
          question: `When analyzing ${topic}, what does the gradient vector indicate?`,
          options: [
            "The direction of steepest ascent",
            "The determinant of the matrix",
            "The random seed index",
            "The memory address",
          ],
          correct: "The direction of steepest ascent",
          explanation: "The gradient points in the direction of greatest rate of increase of a scalar field.",
          concept: "Gradient Vectors",
        },
        {
          id: "q3",
          question: `What is a primary prerequisite to understanding rates of change in ${topic}?`,
          options: [
            "Differential calculus and limits",
            "Binary search trees",
            "HTTP status codes",
            "CSS flexbox layout",
          ],
          correct: "Differential calculus and limits",
          explanation: "Rates of change are formally defined through limits of difference quotients (derivatives).",
          concept: "Differential Calculus",
        },
      ];
    }

    return NextResponse.json({
      questions,
      topic,
      level,
      provider: result.provider,
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error.message },
      { status: 500 }
    );
  }
}
