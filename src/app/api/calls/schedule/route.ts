import { NextRequest, NextResponse } from "next/server";
import { getFirebaseUser } from "@/lib/firebase/auth-helper";
import { CallSchedule } from "@/lib/services/call-service";
import { triggerOutboundCall, isTwilioConfigured } from "@/lib/services/twilio-service";

// In-memory store for scheduled calls
let storedSchedule: CallSchedule = {
  phoneNumber: "+91 8328004967",
  preferredTime: "18:30",
  topic: "Percentages & Ratios",
  language: "te",
  studentName: "Student",
  enabled: true,
  frequency: "daily",
};

let lastDialedDate = "";
let schedulerRunning = false;

// Background auto-dialer runner
function ensureSchedulerRunning() {
  if (schedulerRunning || typeof setInterval === "undefined") return;
  schedulerRunning = true;

  setInterval(async () => {
    if (!storedSchedule.enabled || !isTwilioConfigured()) return;

    const now = new Date();
    const currentHHMM = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const todayDate = now.toISOString().split("T")[0];

    // If current time matches preferred schedule time and not already dialed today
    if (currentHHMM === storedSchedule.preferredTime && lastDialedDate !== todayDate) {
      lastDialedDate = todayDate;
      console.log(`[Auto-Dialer] Triggering scheduled call to ${storedSchedule.phoneNumber} for topic "${storedSchedule.topic}" at ${currentHHMM}`);
      try {
        await triggerOutboundCall(
          storedSchedule.phoneNumber,
          storedSchedule.topic,
          storedSchedule.language,
          storedSchedule.studentName
        );
      } catch (err: any) {
        console.error("[Auto-Dialer] Error triggering scheduled call:", err.message);
      }
    }
  }, 30000); // Check every 30 seconds
}

ensureSchedulerRunning();

export async function GET() {
  const user = await getFirebaseUser();
  if (user) {
    storedSchedule.studentName = user.displayName || storedSchedule.studentName;
  }
  return NextResponse.json({
    schedule: storedSchedule,
    autoDialerActive: storedSchedule.enabled && isTwilioConfigured(),
    nextScheduledCheck: storedSchedule.preferredTime,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if immediate dial requested from the schedule card
    if (body.triggerNow) {
      if (!isTwilioConfigured()) {
        return NextResponse.json(
          { success: false, message: "Twilio credentials required to place real calls." },
          { status: 400 }
        );
      }

      const callResult = await triggerOutboundCall(
        body.phoneNumber || storedSchedule.phoneNumber,
        body.topic || storedSchedule.topic,
        body.language || storedSchedule.language,
        body.studentName || storedSchedule.studentName
      );

      return NextResponse.json({
        success: true,
        callTriggered: true,
        call: callResult,
        message: `Scheduled call dialed right now to ${body.phoneNumber || storedSchedule.phoneNumber}! Pick up to begin your lesson and test.`,
      });
    }

    storedSchedule = {
      ...storedSchedule,
      ...body,
    };

    return NextResponse.json({
      success: true,
      schedule: storedSchedule,
      message: `Daily call scheduled for ${storedSchedule.preferredTime}! The AI auto-dialer will call ${storedSchedule.phoneNumber} every day.`,
    });
  } catch (err: any) {
    console.error("Scheduled call error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to place call via Twilio.",
        error: err.message,
      },
      { status: 200 }
    );
  }
}
