"use server";

import nodemailer from "nodemailer";
import { allEmails } from "../static/emails";

function buildEmailTemplate(emailContent: string) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RUET CSE 24 Update</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:Poppins,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#0f766e,#0ea5e9);padding:22px 24px;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;">RUET CSE 24</h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Personalized notification</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                ${emailContent}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">
                This email was sent automatically. Please do not reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

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

    const content =
      emailContent ||
      `
      <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi <strong>there</strong>,</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">Thanks for being with us. This is your personalized update from the RUET CSE 24 web-app.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
        <tr>
          <td style="border-left:4px solid #0ea5e9;border-radius:4px;background:#f0f9ff;padding:12px 14px;font-size:14px;line-height:1.6;color:#0f172a;">
            You are requested to update your profile information asap to get the best experience. Please click the button below to open your profile and make sure your details are up to date.
          </td>
        </tr>
      </table>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:#334155;">Best regards,<br />RUET CSE 24 Team</p>
      <a href="https://ruetcse24-new.vercel.app/profiles/update" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:999999px;font-size:14px;font-weight:500;">Open Portal</a>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ruetcse24new1@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"RUET CSE 24" <ruetcse24new1@gmail.com>',
      to: recipients.join(", "),
      subject: emailSubject,
      html: buildEmailTemplate(content),
    });

    return {
      success: true,
      message: `Email sent successfully to ${recipients.length} recipient(s)`,
      recipientCount: recipients.length,
      recipients: recipients,
      messageId: info.messageId,
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
