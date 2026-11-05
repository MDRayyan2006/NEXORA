import { NextRequest, NextResponse } from "next/server";
import { reviewWhatsAppAssignment } from "@/lib/services/whatsapp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await reviewWhatsAppAssignment({
      assignmentTitle: body.assignmentTitle || "Homework Exercise",
      problemStatement: body.problemStatement || "Solve for x: 2x + 7 = 19",
      studentSolution: body.studentSolution || "2x = 19 + 7 = 26 => x = 13",
      studentName: body.studentName || "Student",
    });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

