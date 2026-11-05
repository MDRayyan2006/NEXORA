import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid");
    const callStatus = formData.get("CallStatus");
    const duration = formData.get("CallDuration");

    console.log(`[Twilio Call Status] CallSid: ${callSid}, Status: ${callStatus}, Duration: ${duration}s`);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}

