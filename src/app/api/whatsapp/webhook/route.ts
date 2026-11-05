import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { analyzeWhatsAppDoubt, reviewWhatsAppAssignment } from "@/lib/services/whatsapp-service";

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Nexora WhatsApp Webhook is live. Configure this URL in Twilio Console > Messaging > WhatsApp sandbox settings.",
  });
}

export async function POST(req: NextRequest) {
  try {
    let incomingMsg = "";
    let fromNumber = "";

    try {
      const formData = await req.formData();
      incomingMsg = (formData.get("Body") as string) || "";
      fromNumber = (formData.get("From") as string) || "";
    } catch {
      try {
        const rawText = await req.text();
        const params = new URLSearchParams(rawText);
        incomingMsg = params.get("Body") || "";
        fromNumber = params.get("From") || "";
      } catch {}
    }

    if (!incomingMsg.trim()) {
      const twiml = new MessagingResponse();
      twiml.message(
        "👋 Welcome to Nexora AI! Send any academic doubt, formula question, or homework problem (in English, Telugu, or Hindi) to get instant hints and step-by-step solutions!"
      );
      return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
    }

    // Detect language script automatically
    const isTelugu = /[\u0C00-\u0C7F]/.test(incomingMsg);
    const isHindi = /[\u0900-\u097F]/.test(incomingMsg);
    const lang = isTelugu ? "te" : isHindi ? "hi" : "en";

    // Detect if this is an assignment or doubt
    const lower = incomingMsg.toLowerCase();
    const isAssignment =
      lower.includes("check") ||
      lower.includes("review") ||
      lower.includes("solve for") ||
      lower.includes("my answer") ||
      lower.includes("step 1");

    let replyMessage = "";

    if (isAssignment) {
      const res = await reviewWhatsAppAssignment({
        assignmentTitle: "WhatsApp Problem Review",
        problemStatement: incomingMsg,
        studentSolution: incomingMsg,
        language: lang,
      });
      replyMessage = res.whatsappFormattedMessage;
    } else {
      const res = await analyzeWhatsAppDoubt({
        query: incomingMsg,
        language: lang,
      });
      replyMessage = res.whatsappFormattedMessage;
    }

    const twiml = new MessagingResponse();
    twiml.message(replyMessage);

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err: any) {
    const twiml = new MessagingResponse();
    twiml.message(
      "👋 Hello! Nexora AI Assistant here. Please send your doubt or math equation again, and I will solve it step-by-step!"
    );
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}

