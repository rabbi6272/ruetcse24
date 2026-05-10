"use client";

import { sendEmailAction } from "./emailAction";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { getAllUsers } from "../../util/Database";
import { allEmails as fallbackEmails } from "../static/emails";

export default function EmailServices() {
  const [allEmails, setAllEmails] = useState<string[]>(fallbackEmails);
  const [loading, setLoading] = useState(false);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendMode, setSendMode] = useState<"single" | "all">("single");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emailSubject, setEmailSubject] = useState(
    "Your Personalized Update from RUET CSE 24",
  );
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecipients() {
      try {
        const users = await getAllUsers();
        const emails = users
          .map((user) => user.email)
          .filter((email): email is string => !!email);

        if (!cancelled && emails.length > 0) {
          setAllEmails(emails);
        }
      } catch (error) {
        console.error("Failed to load email recipients:", error);
      } finally {
        if (!cancelled) {
          setRecipientsLoading(false);
        }
      }
    }

    loadRecipients();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const recipients: string[] = [];

      if (sendMode === "all") {
        recipients.push(...allEmails);
      } else if (sendMode === "single") {
        const email = allEmails[selectedIndex];
        if (email) {
          recipients.push(email);
        }
      }

      if (recipients.length === 0) {
        setMessage("✗ Please select at least one recipient.");
        return;
      }

      const result = await sendEmailAction(
        recipients,
        emailSubject,
        emailContent,
      );
      if (result.success) {
        setMessage(`✓ ${result.message}`);
      } else {
        setMessage(`✗ ${result.message}: ${result.error}`);
      }
    } catch (error) {
      setMessage(
        `✗ Error sending email: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-screen py-2 px-4"
    >
      <h1 className="text-4xl font-bold mb-2">Email Services</h1>

      <div className="w-full max-w-lg bg-white p-5 rounded-lg shadow-lg">
        {/* Send Mode Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-3">
            Select Send Mode:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sendMode"
                value="single"
                checked={sendMode === "single"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSendMode(e.target.value as "single")
                }
                className="mr-2 w-4 h-4"
              />
              <span>Send to One</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sendMode"
                value="all"
                checked={sendMode === "all"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSendMode(e.target.value as "all")
                }
                className="mr-2 w-4 h-4"
              />
              <span>Send to All ({allEmails.length})</span>
            </label>
          </div>
        </div>

        {/* Single Email Selection */}
        {sendMode === "single" && (
          <div className="mb-4">
            <label
              htmlFor="emailSelect"
              className="block text-sm font-semibold mb-2"
            >
              Select Recipient:
            </label>
            <select
              id="emailSelect"
              value={selectedIndex}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedIndex(Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allEmails.map((email, idx) => (
                <option key={email} value={idx}>
                  {idx}: {email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email Subject */}
        <div className="mb-4">
          <label
            htmlFor="emailSubject"
            className="block text-sm font-semibold mb-2"
          >
            Email Subject:
          </label>
          <input
            id="emailSubject"
            type="text"
            value={emailSubject}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmailSubject(e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email subject"
          />
        </div>

        {/* Email Content */}
        <div className="mb-2">
          <label
            htmlFor="emailContent"
            className="block text-sm font-semibold mb-2"
          >
            Email Content (HTML):
          </label>
          <textarea
            id="emailContent"
            value={emailContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setEmailContent(e.target.value)
            }
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter HTML email content (or leave empty for default)"
          />
          <p className="text-xs text-gray-500">
            Tip: You can use HTML tags. Leave empty to use default content.
          </p>
        </div>

        {/* Summary */}
        {/* <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Recipients:</strong>{" "}
            {sendMode === "all"
              ? `All ${allEmails.length} emails`
              : allEmails[selectedIndex]}
          </p>
        </div> */}

        {/* Message Display */}
        {recipientsLoading && (
          <p className="text-xs text-center mb-2 text-gray-500">
            Refreshing recipients...
          </p>
        )}

        {message && (
          <p
            className={`text-sm text-center mb-2 px-3 py-2 rounded-full ${
              message.startsWith("✓")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || allEmails.length === 0}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-full transition duration-200"
        >
          {loading
            ? "Sending..."
            : `Send to ${sendMode === "all" ? "All" : "One"}`}
        </button>
      </div>
    </form>
  );
}
