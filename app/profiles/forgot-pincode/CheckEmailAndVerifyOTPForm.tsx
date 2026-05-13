"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { VerifyOTPForm } from "./OTPInput";
import { CheckEmailForm } from "./EmailInputForm";
import { handleEmailCheck, verifyOtp } from "./HandleEmailCheckAction";
import { getUserByEmail, updateUser } from "../../../util/Database";
import { Spinner } from "@heroui/react";

export function CheckEmailAndVerifyOTPForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [challengeToken, setChallengeToken] = useState<string>("");
  const [verifiedToken, setVerifiedToken] = useState<string>("");
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [newPincode, setNewPincode] = useState<string>("");
  const [confirmPincode, setConfirmPincode] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  async function submitEmail() {
    setEmailCheckLoading(true);
    try {
      const result = await handleEmailCheck(email);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setChallengeToken(result.challengeToken ?? "");
      setEmailValid(true);
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setEmailCheckLoading(false);
    }
  }

  async function submitOtp(otp: string) {
    setVerifyLoading(true);
    try {
      const result = await verifyOtp(email, otp, challengeToken);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setVerifiedToken(result.verifiedToken ?? "");
      setShowResetModal(true);
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleResetPincode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verifiedToken) {
      toast.error("OTP Verification required.");
      return;
    }

    if (!newPincode) {
      toast.error("Please enter a new pincode.");
      return;
    }

    if (!confirmPincode) {
      toast.error("Please confirm your new pincode.");
      return;
    }

    if (newPincode !== confirmPincode) {
      toast.error("The pincodes do not match.");
      return;
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await getUserByEmail(cleanEmail);
      if (!res) {
        toast.error("No account found with this email.");
        setResetLoading(false);
        return;
      }

      const updatedUser = await updateUser(res.id, { pincode: newPincode });
      if (updatedUser) {
        toast.success("Pincode updated successfully.");
        setResetLoading(false);
        router.push("/profiles");
        return;
      } else {
        toast.error("Failed to update pincode. Please try again.");
        setResetLoading(false);
        return;
      }
    } catch (err) {
      toast.error("An error occurred while fetching user data.");
      setResetLoading(false);
      return;
    } finally {
      setResetLoading(false);
    }
  }
  return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        {emailValid ? (
          <VerifyOTPForm
            email={email}
            onVerifyOtp={submitOtp}
            verifyLoading={verifyLoading}
          />
        ) : (
          <CheckEmailForm
            email={email}
            setEmail={setEmail}
            emailCheckLoading={emailCheckLoading}
            onSubmitEmail={submitEmail}
          />
        )}
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Pincode
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              OTP verified for <span className="font-medium">{email}</span>
            </p>

            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>Step 1: Enter your new pincode.</p>
              <p>Step 2: Confirm the same pincode.</p>
              <p>Step 3: Submit to update your account.</p>
            </div>

            <form onSubmit={handleResetPincode} className="mt-5 space-y-3">
              <input
                type="password"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                placeholder="New pincode"
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <input
                type="password"
                value={confirmPincode}
                onChange={(e) => setConfirmPincode(e.target.value)}
                placeholder="Confirm new pincode"
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-1/2 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 bg-indigo-500 text-white py-2.5 rounded-full hover:bg-indigo-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetLoading && <Spinner size="sm" color="current" />}
                  {resetLoading ? "Updating..." : "Update Pincode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
