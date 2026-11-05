import { NextRequest, NextResponse } from "next/server";
import { recordSkillQualification, getAllQualifiedSkills } from "@/lib/services/skills-service";

export async function GET() {
  const skills = getAllQualifiedSkills();
  return NextResponse.json({ success: true, skills });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, score = 2, total = 2, passed = true, studentName, phoneNumber, method } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const skill = recordSkillQualification({
      topic,
      score: Number(score),
      total: Number(total),
      passed: Boolean(passed),
      studentName,
      phoneNumber,
      method: method || "web_simulator",
    });

    return NextResponse.json({
      success: true,
      message: `Skill "${topic}" qualified and added to your verified resume!`,
      skill,
      totalSkills: getAllQualifiedSkills().length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

