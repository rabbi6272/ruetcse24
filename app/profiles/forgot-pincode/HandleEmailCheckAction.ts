"use server";

import crypto from "crypto";
import { Resend } from "resend";
import { AllEmails } from "../../../util/AllEmails";
import { ForgotPinEmailBody } from "./ForgotPinEmailBody";
import { getUserByEmail, updateUser } from "../../../util/Database";

const OTP_EXPIRY_SECONDS = 5 * 60;
const VERIFIED_TOKEN_EXPIRY_SECONDS = 10 * 60;

type ActionResult = {
  ok: boolean;
  message: string;
};

export type SendOtpResult = ActionResult & {
  challengeToken?: string;
};

export type VerifyOtpResult = ActionResult & {
  verifiedToken?: string;
};

const OTP_SECRET = process.env.OTP_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function createOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function signPayload(payload: string): string {
  if (!OTP_SECRET) {
    throw new Error("OTP_SECRET is not configured");
  }
  return crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
}

function createChallengeToken(email: string, otp: string): string {
  const expiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;
  const payload = JSON.stringify({
    email,
    expiresAt,
    otpHash: sha256(otp),
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

function parseChallengeToken(token: string): {
  email: string;
  expiresAt: number;
  otpHash: string;
} | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const expectedSignature = signPayload(payloadB64);
  if (signature.length !== expectedSignature.length) return null;

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString("utf8"),
  ) as {
    email: string;
    expiresAt: number;
    otpHash: string;
  };

  if (!payload.email || !payload.expiresAt || !payload.otpHash) {
    return null;
  }
  return payload;
}

export async function handleEmailCheck(email: string): Promise<SendOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, message: "Please enter your email." };
  }

  if (!AllEmails.includes(cleanEmail)) {
    return { ok: false, message: "No account found with this email." };
  }

  if (!RESEND_API_KEY) {
    return { ok: false, message: "Email service is not configured." };
  }

  const otp = createOtp();
  const challengeToken = createChallengeToken(cleanEmail, otp);

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "RUET CSE 24 <noreply@mail.ruetcsearchive.app>",
      to: cleanEmail,
      subject: "Your OTP for updating pincode - RUET CSE 24",
      react: ForgotPinEmailBody({ otp }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      ok: false,
      message: "Failed to send OTP. Please try again later.",
    };
  }

  return { ok: true, message: "OTP sent to your email!", challengeToken };
}

export async function verifyOtp(
  email: string,
  otp: string,
  challengeToken: string,
): Promise<VerifyOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  if (!cleanOtp || cleanOtp.length !== 6) {
    return { ok: false, message: "Enter a valid 6-digit OTP." };
  }

  if (!challengeToken) {
    return { ok: false, message: "OTP session is missing. Please resend OTP." };
  }

  const parsed = parseChallengeToken(challengeToken);
  if (!parsed) {
    return { ok: false, message: "Invalid OTP session. Please resend OTP." };
  }

  if (parsed.email !== cleanEmail) {
    return { ok: false, message: "Email mismatch. Please request OTP again." };
  }

  if (Date.now() > parsed.expiresAt) {
    return { ok: false, message: "OTP expired. Please resend OTP." };
  }

  if (sha256(cleanOtp) !== parsed.otpHash) {
    return { ok: false, message: "Incorrect OTP. Please try again." };
  }

  const verifiedExpiresAt = Date.now() + VERIFIED_TOKEN_EXPIRY_SECONDS * 1000;
  const verifiedPayload = Buffer.from(
    JSON.stringify({ email: cleanEmail, expiresAt: verifiedExpiresAt }),
    "utf8",
  ).toString("base64url");
  const verifiedSignature = signPayload(verifiedPayload);
  const verifiedToken = `${verifiedPayload}.${verifiedSignature}`;

  return { ok: true, message: "OTP verified successfully!", verifiedToken };
}

function parseVerifiedToken(token: string): {
  email: string;
  expiresAt: number;
} | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const expectedSignature = signPayload(payloadB64);
  if (signature.length !== expectedSignature.length) return null;
  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString("utf8"),
  ) as { email: string; expiresAt: number };

  if (!payload.email || !payload.expiresAt) {
    return null;
  }
  return payload;
}

export async function updatePincodeAfterVerification(
  email: string,
  newPincode: string,
  confirmedPincode: string,
  verifiedToken: string,
): Promise<ActionResult> {
  const cleanEmail = email.trim().toLowerCase();
  const parsed = parseVerifiedToken(verifiedToken);
  if (!parsed) {
    return {
      ok: false,
      message: "Invalid verification session. Verify OTP again.",
    };
  }
  if (Date.now() > parsed.expiresAt) {
    return { ok: false, message: "Verification expired. Verify OTP again." };
  }
  if (parsed.email !== cleanEmail) {
    return { ok: false, message: "Email mismatch. Verify OTP again." };
  }

  const pin = newPincode.trim();
  const confirmPin = confirmedPincode.trim();
  if (!pin || !confirmPin) {
    return { ok: false, message: "Both pincode fields are required." };
  }
  if (pin !== confirmPin) {
    return { ok: false, message: "Pincodes do not match." };
  }

  try {
    const user = await getUserByEmail(cleanEmail);
    if (!user) {
      return { ok: false, message: "No account found with this email." };
    }
    user.pincode = pin;
    const updated = await updateUser(user.id, user);
    if (!updated) {
      return {
        ok: false,
        message: "Failed to update pincode. Please try again.",
      };
    }
    return { ok: true, message: "Pincode updated successfully." };
  } catch (error) {
    console.error("Pincode update failed:", error);
    return {
      ok: false,
      message: "Something went wrong while updating pincode.",
    };
  }
}
