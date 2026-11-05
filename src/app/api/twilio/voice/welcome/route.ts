import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { generateVoiceLesson } from "@/lib/services/call-service";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function GET(req: NextRequest) {
  return handleWelcome(req);
}

export async function POST(req: NextRequest) {
  return handleWelcome(req);
}

async function handleWelcome(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") || "Percentages & Ratios";
  const language = searchParams.get("lang") || "en";
  const studentName = searchParams.get("name") || "Student";

  const twiml = new VoiceResponse();

  const langMap: Record<string, string> = {
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    en: "en-IN",
  };
  const voice = "alice" as any;
  const langCode = (langMap[language] || "en-IN") as any;

  try {
    // Generate spoken lesson and test questions via Gemini AI
    const session = await generateVoiceLesson(topic, language, studentName);

    // 1. Spoken Audio Welcome
    twiml.say(
      { voice, language: langCode },
      `Namaste ${studentName}! This is your Nexora AI voice tutor. It is time for your daily lesson on ${topic}.`
    );

    // 2. Spoken Lesson Concepts
    for (const chunk of session.teachingScript) {
      twiml.pause({ length: 1 });
      twiml.say({ voice, language: langCode }, chunk);
    }

    twiml.pause({ length: 1 });
    twiml.say(
      { voice, language: langCode },
      "Now, let us take your keypad test. Listen carefully and press the number on your phone keypad to answer."
    );

    // 3. Question 1 Keypad Gathering
    const q1 = session.questions[0];
    if (q1) {
      const qText = `${q1.questionText}. ` + q1.options.map((o) => `Press ${o.digit} for ${o.text}`).join(". ");
      
      const gather = twiml.gather({
        numDigits: 1,
        timeout: 12,
        action: `/api/twilio/voice/gather?sessionId=${session.sessionId}&step=1&correct=${q1.correctDigit}&topic=${encodeURIComponent(topic)}&lang=${language}`,
        method: "POST",
      });

      gather.say({ voice, language: langCode }, qText);

      // If user doesn't press anything in 12s
      twiml.say(
        { voice, language: langCode },
        "We did not receive any keypad input. Moving to the next question."
      );
      twiml.redirect(
        `/api/twilio/voice/gather?sessionId=${session.sessionId}&step=1&correct=${q1.correctDigit}&topic=${encodeURIComponent(topic)}&lang=${language}&timeout=true`
      );
    }
  } catch (err: any) {
    twiml.say(
      { voice, language: langCode },
      `Hello! Welcome to your daily audio lesson on ${topic}. Always remember to solve step-by-step.`
    );
  }

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

