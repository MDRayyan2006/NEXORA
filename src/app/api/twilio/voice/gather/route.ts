import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getCallSession } from "@/lib/services/call-service";
import { recordSkillQualification } from "@/lib/services/skills-service";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") || "";
  const step = searchParams.get("step") || "1";
  const expectedCorrect = searchParams.get("correct") || "1";
  const topic = searchParams.get("topic") || "Lesson";
  const language = searchParams.get("lang") || "en";
  const scoreSoFar = parseInt(searchParams.get("score") || "0", 10);

  // Twilio sends form data: Digits
  let pressedDigit = "";
  try {
    const formData = await req.formData();
    pressedDigit = (formData.get("Digits") as string) || "";
  } catch {
    try {
      const rawText = await req.text();
      const params = new URLSearchParams(rawText);
      pressedDigit = params.get("Digits") || "";
    } catch {}
  }

  const twiml = new VoiceResponse();
  const langMap: Record<string, string> = {
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    en: "en-IN",
  };
  const voice = "alice" as any;
  const langCode = (langMap[language] || "en-IN") as any;

  // Retrieve AI-generated session
  const session = sessionId ? getCallSession(sessionId) : undefined;
  const isCorrect = pressedDigit.trim() === expectedCorrect.trim();
  const newScore = isCorrect ? scoreSoFar + 1 : scoreSoFar;

  // Feedback for Question 1
  if (step === "1") {
    const q1 = session?.questions?.[0];
    const explanation = q1?.explanation || "Step-by-step logic is correct.";

    if (pressedDigit) {
      if (isCorrect) {
        twiml.say({ voice, language: langCode }, `Correct! Option ${pressedDigit} is right. ${explanation}`);
      } else {
        twiml.say(
          { voice, language: langCode },
          `You pressed ${pressedDigit}. The correct answer was option ${expectedCorrect}. ${explanation}`
        );
      }
    }

    twiml.pause({ length: 1 });

    // AI-Generated Question 2
    const q2 = session?.questions?.[1];
    if (q2) {
      const q2SpokenText = `Here is question 2. ${q2.questionText}. ` + q2.options.map((o) => `Press ${o.digit} for ${o.text}`).join(". ");
      const gather = twiml.gather({
        numDigits: 1,
        timeout: 12,
        action: `/api/twilio/voice/gather?sessionId=${sessionId}&step=2&correct=${q2.correctDigit}&topic=${encodeURIComponent(topic)}&lang=${language}&score=${newScore}`,
        method: "POST",
      });
      gather.say({ voice, language: langCode }, q2SpokenText);

      // Timeout fallback
      twiml.say({ voice, language: langCode }, "We did not receive your keypad answer for question 2.");
      twiml.redirect(
        `/api/twilio/voice/gather?sessionId=${sessionId}&step=2&correct=${q2.correctDigit}&topic=${encodeURIComponent(topic)}&lang=${language}&score=${newScore}&timeout=true`
      );
    } else {
      twiml.say(
        { voice, language: langCode },
        `You completed today's oral test with a score of ${newScore} out of 1. Great effort! Goodbye!`
      );
      twiml.hangup();
    }
  } else {
    // Step 2 Completed -> Feedback for Question 2 + AI Conclusion Script
    const q2 = session?.questions?.[1];
    const q2Explanation = q2?.explanation || "Conceptual understanding is key.";

    if (pressedDigit) {
      if (isCorrect) {
        twiml.say({ voice, language: langCode }, `Correct! Option ${pressedDigit} is right. ${q2Explanation}`);
      } else {
        twiml.say(
          { voice, language: langCode },
          `You pressed ${pressedDigit}. The correct answer was option ${expectedCorrect}. ${q2Explanation}`
        );
      }
    }

    twiml.pause({ length: 1 });

    // If student scored >= 1, record skill qualification for their AI resume
    if (newScore >= 1) {
      recordSkillQualification({
        topic,
        score: newScore,
        total: 2,
        passed: true,
        method: "phone_call",
      });
    }

    const conclusion = session?.conclusionScript ||
      `Congratulations! You completed today's audio lesson and keypad test. You scored ${newScore} out of 2 and qualified in ${topic}! This skill has been verified and added to your professional resume and job applications. Nexora will call you again tomorrow. Goodbye!`;

    twiml.say({ voice, language: langCode }, conclusion);
    twiml.hangup();
  }

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
