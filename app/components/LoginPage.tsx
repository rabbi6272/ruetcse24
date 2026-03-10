import Link from "next/link";
import { Spinner } from "@heroui/react";

export function LoginPage({
  handleLogin,
  loginEmail,
  setLoginEmail,
  loginPincode,
  setLoginPincode,
  loginLoading,
}: {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPincode: string;
  setLoginPincode: (pincode: string) => void;
  loginLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg p-6 w-full max-w-md">
      <h1 className="text-2xl  text-gray-800 text-center mb-6">
        Login to Your Account
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
          <Link href="/profiles/forgot-pincode">
            <p className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer mt-1 pl-3">
              Forgot Pincode?
            </p>
          </Link>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
          >
            {loginLoading && <Spinner color="current" />}
            <span>{loginLoading ? "Logging in..." : "Login"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
