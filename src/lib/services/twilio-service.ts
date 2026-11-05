import twilio from "twilio";

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  apiKeySid?: string;
  apiKeySecret?: string;
  phoneNumber: string;
  appUrl: string;
}

export function getResolvedAppUrl(customOrigin?: string): string {
  // 1. If active request origin provided and is a public HTTPS URL, use it
  if (customOrigin && customOrigin.startsWith("https://") && !customOrigin.includes("localhost")) {
    return customOrigin;
  }

  // 2. Explicitly configured APP_URL or NEXT_PUBLIC_APP_URL
  const envUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("your-nexora-app")) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  // 3. Vercel automatically injected system variables (present on every Vercel build & serverless function)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Default active public tunnel
  return "https://physicianly-feracious-ted.ngrok-free.dev";
}

export function getTwilioConfig(customOrigin?: string): TwilioConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    apiKeySid: process.env.TWILIO_API_KEY_SID || "",
    apiKeySecret: process.env.TWILIO_API_KEY_SECRET || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    appUrl: getResolvedAppUrl(customOrigin),
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
  studentName: string = "Student",
  customOrigin?: string
) {
  const { phoneNumber } = getTwilioConfig();
  const appUrl = getResolvedAppUrl(customOrigin);

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

  const webhookUrl = `${appUrl}/api/twilio/voice/welcome?topic=${encodeURIComponent(
    topic
  )}&lang=${encodeURIComponent(language)}&name=${encodeURIComponent(studentName)}`;

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
      webhookUrl,
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
