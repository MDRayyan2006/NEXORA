import { NextRequest, NextResponse } from "next/server";
import { generateVoiceLesson } from "@/lib/services/call-service";

export async function POST(req: NextRequest) {
  try {
    const { topic = "Percentages & Ratios", language = "en", studentName = "Student" } = await req.json();
    const session = await generateVoiceLesson(topic, language, studentName);
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

