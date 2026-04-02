"use server";

import { Resend } from "resend";
import { allEmails } from "../static/emails";
import { EmailBody } from "./EmailBody";

export async function sendEmailAction(
  recipientIndices: number | number[],
  emailSubject: string = "Update from RUET CSE 24",
  emailContent: string = "",
) {
  try {
    const indices = Array.isArray(recipientIndices)
      ? recipientIndices
      : [recipientIndices];
    const recipients = indices
      .map((idx) => allEmails[idx])
      .filter((email) => email);

    if (recipients.length === 0) {
      return {
        success: false,
        message: "No valid recipients found",
        error: "Invalid recipient indices",
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "RUET CSE 24 <noreply@mail.ruetcsearchive.app>",
      to: recipients,
      subject: emailSubject,
      react: EmailBody({
        name: "there",
        portalUrl: "https://students.ruetcsearchive.app/profile/update",
      }),
    });

    if (error) {
      console.error("Error sending email with Resend:", error);
      return {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return {
      success: true,
      message: `Email sent successfully to ${recipients.length} recipient(s)`,
      recipientCount: recipients.length,
      recipients: recipients,
      messageId: data.id,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "ruetcse24new1@gmail.com",
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// const info = await transporter.sendMail({
//   from: '"RUET CSE 24" <ruetcse24new1@gmail.com>',
//   to: recipients.join(", "),
//   subject: emailSubject,
//   html: buildEmailTemplate(content),
// });
