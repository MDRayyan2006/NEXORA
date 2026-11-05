import twilio from "twilio";

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  apiKeySid?: string;
  apiKeySecret?: string;
  phoneNumber: string;
  appUrl: string;
}

export function getTwilioConfig(): TwilioConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    apiKeySid: process.env.TWILIO_API_KEY_SID || "",
    apiKeySecret: process.env.TWILIO_API_KEY_SECRET || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    appUrl: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

export function isTwilioConfigured(): boolean {
  const { accountSid, authToken, phoneNumber } = getTwilioConfig();
  return Boolean(
    accountSid &&
    authToken &&
    phoneNumber &&
    !accountSid.includes("YOUR_")
  );
}

export function getTwilioClient() {
  const { accountSid, authToken } = getTwilioConfig();
  return twilio(accountSid, authToken);
}

export function formatE164(phone: string): string {
  let cleaned = (phone || "").replace(/[\s\-\(\)]/g, "");
  if (!cleaned) return "";
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10) {
      cleaned = "+91" + cleaned;
    } else {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
}

/**
 * Triggers a real telephone call to a student's phone via Twilio REST API.
 */
export async function triggerOutboundCall(
  toPhoneNumber: string,
  topic: string = "Percentages & Ratios",
  language: string = "en",
  studentName: string = "Student"
) {
  const { phoneNumber, appUrl, accountSid } = getTwilioConfig();

  if (!isTwilioConfigured()) {
    throw new Error(
      "Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER."
    );
  }

  const formattedTo = formatE164(toPhoneNumber);
  if (!formattedTo || formattedTo.length < 8) {
    throw new Error("Invalid phone number. Please enter a valid 10-digit mobile number (e.g. +91 8328004967).");
  }

  const client = getTwilioClient();

  // If running locally on localhost:3000, Twilio cloud servers cannot reach localhost without a tunnel (like ngrok).
  // When a public URL (ngrok, vercel, etc.) is set in APP_URL or NEXT_PUBLIC_APP_URL, we use our full interactive webhook.
  const isPublicUrl = appUrl.startsWith("https://") && !appUrl.includes("localhost");
  const webhookUrl = isPublicUrl
    ? `${appUrl}/api/twilio/voice/welcome?topic=${encodeURIComponent(
        topic
      )}&lang=${encodeURIComponent(language)}&name=${encodeURIComponent(studentName)}`
    : `https://demo.twilio.com/docs/voice.xml`;

  try {
    const call = await client.calls.create({
      to: formattedTo,
      from: phoneNumber,
      url: webhookUrl,
    });

    return {
      callSid: call.sid,
      status: call.status,
      to: formattedTo,
      from: phoneNumber,
    };
  } catch (err: any) {
    if (err.code === 573002 || err.code === 21215) {
      throw new Error(
        `Twilio Trial Notice: The phone number "${formattedTo}" must be verified first in your Twilio Console > Verified Caller IDs.`
      );
    }
    if (err.code === 21211) {
      throw new Error(`The phone number "${formattedTo}" is not formatted properly. Please check your number.`);
    }
    if (err.code === 20003) {
      throw new Error("Twilio account has insufficient balance to place live calls.");
    }
    throw err;
  }
}
