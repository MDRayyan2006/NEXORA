import { NextRequest, NextResponse } from "next/server";
import { generateStudentResume } from "@/lib/services/resume-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resume = await generateStudentResume(body);
    return NextResponse.json({ success: true, resume });
  } catch (err: any) {
    console.error("Resume generation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}

