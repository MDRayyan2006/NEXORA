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
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
      "Twilio credentials are not configured in .env.local."
    );
  }

  const client = getTwilioClient();

  // If running locally on localhost:3000, Twilio cloud servers cannot reach localhost without a tunnel (like ngrok).
  // When a public URL (ngrok, vercel, etc.) is set in NEXT_PUBLIC_APP_URL, we use our full interactive webhook.
  const isPublicUrl = appUrl.startsWith("https://") && !appUrl.includes("localhost");
  const webhookUrl = isPublicUrl
    ? `${appUrl}/api/twilio/voice/welcome?topic=${encodeURIComponent(
        topic
      )}&lang=${encodeURIComponent(language)}&name=${encodeURIComponent(studentName)}`
    : `https://demo.twilio.com/docs/voice.xml`;

  try {
    const call = await client.calls.create({
      to: toPhoneNumber,
      from: phoneNumber,
      url: webhookUrl,
    });

    return {
      callSid: call.sid,
      status: call.status,
      to: toPhoneNumber,
      from: phoneNumber,
    };
  } catch (err: any) {
    if (err.code === 573002 || err.code === 21215) {
      throw new Error(
        `Twilio Trial Notice: The phone number "${toPhoneNumber}" must be verified first. In your Twilio Console, go to Phone Numbers > Verified Caller IDs and add this number to receive live calls.`
      );
    }
    throw err;
  }
}
