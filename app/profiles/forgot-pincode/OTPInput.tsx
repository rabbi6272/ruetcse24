"use client";
import { useState } from "react";
import { InputOTP, Label, Surface, Spinner } from "@heroui/react";

export function VerifyOTPForm({
  email,
  onVerifyOtp,
}: {
  email: string;
  onVerifyOtp: (otp: string) => Promise<void>;
  verifyLoading: boolean;
}) {
  const [OTPvalue, setOTPValue] = useState<string>("");

  async function verifyOTP() {
    await onVerifyOtp(OTPvalue);
  }

  return (
    <Surface className="flex max-w-md flex-col gap-2 rounded-3xl p-6">
      <div className="flex flex-col gap-1">
        <Label className="text-xl">Verify OTP</Label>
        <p className="text-sm text-muted">We&apos;ve sent a code to {email}</p>
      </div>
      <InputOTP
        maxLength={6}
        variant="secondary"
        value={OTPvalue}
        onChange={(value) => setOTPValue(value)}
        onComplete={verifyOTP}
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      {/* <button
        type="button"
        onClick={verifyOTP}
        disabled={verifyLoading || OTPvalue.length !== 6}
        className="mt-3 w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {verifyLoading && <Spinner color="current" />}
        <span>{verifyLoading ? "Verifying..." : "Verify OTP"}</span>
      </button> */}
    </Surface>
  );
}
