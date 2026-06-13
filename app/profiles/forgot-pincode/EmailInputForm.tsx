import { Spinner } from "@heroui/react";

export function CheckEmailForm({
  email,
  setEmail,
  emailCheckLoading,
  onSubmitEmail,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailCheckLoading: boolean;
  onSubmitEmail: () => Promise<void>;
}) {
  const handleFormAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmitEmail();
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg p-6 w-full max-w-md">
      <h1 className="text-2xl  text-gray-800 text-center mb-6">
        Forgot Your Pincode?
      </h1>
      <form onSubmit={handleFormAction} className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1 pl-3"
          >
            Enter Email Address*
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={emailCheckLoading}
            className="w-full bg-indigo-500 text-white py-2.5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            {emailCheckLoading && <Spinner color="current" />}
            <span>{emailCheckLoading ? "Sending OTP..." : "Send OTP"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
