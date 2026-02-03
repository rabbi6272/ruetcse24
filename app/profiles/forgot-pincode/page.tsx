"use client";
import { useState } from "react";
import { getUserByEmail, updateUser } from "../../../util/Database";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPincodePage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPincode, setLoginPincode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [emailFound, setEmailFound] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your email.");
      setLoginLoading(false);
      return;
    }
    try {
      const res = await getUserByEmail(loginEmail);
      if (!res) {
        toast.error("No account found with this email.");
        setLoginLoading(false);
        return;
      }
      setEmailFound(true);
      if (!loginPincode) return;
      const updatedUser = await updateUser(res.id, { pincode: loginPincode });
      if (updatedUser) {
        toast.success("Pincode updated successfully. You can now login.");
        setLoginLoading(false);
        router.push("/profiles/update");
        return;
      } else {
        toast.error("Failed to update pincode. Please try again.");
        setLoginLoading(false);
        return;
      }
    } catch (err) {
      toast.error("An error occurred while fetching user data.");
      setLoginLoading(false);
      return;
    } finally {
      setLoginLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow hover:shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl  text-gray-800 text-center mb-6">
          Forgot Your Pincode?
        </h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700 mb-1 pl-3"
            >
              Email Address*
            </label>
            <input
              aria-required="true"
              type="email"
              id="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300"
              required
            />
          </div>
          {emailFound && (
            <div>
              <label
                htmlFor="loginPincode"
                className="block text-sm font-medium text-gray-700 mb-1 pl-3"
                aria-required="true"
              >
                6-digit Pincode*
              </label>
              <input
                aria-required="true"
                type="password"
                id="loginPincode"
                value={loginPincode}
                onChange={(e) => setLoginPincode(e.target.value)}
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
              disabled={loginLoading}
              className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
            >
              <span>{loginLoading ? "Updating..." : "Update Pincode"}</span>
              {loginLoading && (
                <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
