import { NextRequest, NextResponse } from "next/server";
import { triggerOutboundCall, isTwilioConfigured } from "@/lib/services/twilio-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      phoneNumber,
      topic = "Percentages & Ratios",
      language = "en",
      studentName = "Student",
    } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required to make a real phone call." },
        { status: 400 }
      );
    }

    if (!isTwilioConfigured()) {
      return NextResponse.json(
        {
          success: false,
          needsCredentials: true,
          message:
            "Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are pending. Add them in .env.local to place live telephone calls to real phones.",
        },
        { status: 400 }
      );
    }

    const callResult = await triggerOutboundCall(
      phoneNumber,
      topic,
      language,
      studentName
    );

    return NextResponse.json({
      success: true,
      call: callResult,
      message: `Outbound AI phone call dialed to ${phoneNumber}! Pick up your phone to begin the lesson and test.`,
    });
  } catch (err: any) {
    console.error("Twilio call error:", err);

    const message: string = err.message || "Failed to initiate outbound call via Twilio.";

    // Twilio Trial: unverified destination number (codes 573002, 21215)
    const isTrialVerification =
      message.includes("must be verified") ||
      message.includes("Twilio Trial") ||
      (err.code && (err.code === 573002 || err.code === 21215));

    if (isTrialVerification) {
      return NextResponse.json({
        success: false,
        trialLimitation: true,
        message:
          "Your Twilio account is in Trial mode. To receive live AI calls, verify your phone number first: Twilio Console → Phone Numbers → Verified Caller IDs → Add your number. Then try again. Meanwhile, use the Keypad Simulator below to experience a full AI-taught lesson!",
      });
    }

    // Twilio insufficient funds
    if (message.includes("Insufficient funds") || err.code === 20003) {
      return NextResponse.json({
        success: false,
        message: "Twilio account has insufficient balance. Please top up your Twilio account to place live calls.",
      });
    }

    // Generic Twilio error — still return 200 so frontend can display it gracefully
    return NextResponse.json({
      success: false,
      message,
    });
  }
}

