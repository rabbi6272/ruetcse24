"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { getUserByEmail, updateUser } from "../../../util/Database";

import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";

export default function ForgotPincodePage() {
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [emailFound, setEmailFound] = useState(false);

  const router = useRouter();

  const handleForgotPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your email.");
      setUpdateLoading(false);
      return;
    }

    try {
      const res = await getUserByEmail(email);
      if (!res) {
        toast.error("No account found with this email.");
        setUpdateLoading(false);
        return;
      }

      setEmailFound(true);

      if (!pincode) return;

      const updatedUser = await updateUser(res.id, { pincode: pincode });
      if (updatedUser) {
        toast.success("Pincode updated successfully. You can now login.");
        setUpdateLoading(false);
        router.push("/profiles/update");
        return;
      } else {
        toast.error("Failed to update pincode. Please try again.");
        setUpdateLoading(false);
        return;
      }
    } catch (err) {
      toast.error("An error occurred while fetching user data.");
      setUpdateLoading(false);
      return;
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow hover:shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl  text-gray-800 text-center mb-6">
          Forgot Your Pincode?
        </h1>
        <form onSubmit={handleForgotPincode} className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1 pl-3"
            >
              Email Address*
            </label>
            <input
              aria-required="true"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
              required
            />
          </div>

          {/* On email found */}
          {emailFound && (
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-1 pl-3"
                aria-required="true"
              >
                6-digit Pincode*
              </label>
              <input
                aria-required="true"
                type="password"
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                pattern="\d{6}"
                maxLength={6}
                className="relative w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
                required
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={updateLoading}
              className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              {updateLoading && <Spinner color="current" />}
              <span>{updateLoading ? "Updating..." : "Update Pincode"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
