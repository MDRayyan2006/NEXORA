import { NextRequest, NextResponse } from "next/server";
import { analyzeWhatsAppDoubt } from "@/lib/services/whatsapp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await analyzeWhatsAppDoubt({
      query: body.query || body.message || "How do I calculate percentage discount?",
      language: body.language || "en",
      studentName: body.studentName || "Student",
    });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

