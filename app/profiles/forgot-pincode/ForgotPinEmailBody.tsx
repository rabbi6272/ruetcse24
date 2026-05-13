import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export function ForgotPinEmailBody({ otp }: { otp: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your personalized update from RUET CSE 24</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* ── Header ── */}
          <Section style={header}>
            <Heading style={headerTitle}>RUET CSE 24</Heading>
            <Text style={headerSubtitle}>Forgot Pincode Notification</Text>
          </Section>

          {/* ── Body ── */}
          <Section style={content}>
            <Text style={greeting}>Hello User,</Text>

            {/* ── Highlighted callout block ── */}
            <Section style={callout}>
              <Text style={calloutText}>
                Here is Your OTP for updating your pincode: <br />
                <strong>{otp}</strong> <br />
                Please use this OTP to reset your pincode and regain access to
                your account. If you did not request this, please ignore this
                email.
              </Text>
            </Section>

            <Text style={paragraph}>
              Best regards,
              <br />
              RUET CSE 24 Team
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent automatically. Please do not reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "transparent",
  fontFamily: "'Segoe UI', sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  width: "100%",
  margin: "0 auto",
  backgroundColor: "#f3f7ff",
  borderRadius: "12px",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  background: "linear-gradient(135deg, #1a7a8a 0%, #00bcd4 100%)",
  padding: "20px 30px",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: "700",
  margin: "0 0 3px 0",
};

const headerSubtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "14px",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "32px 20px",
};

const greeting: React.CSSProperties = {
  fontSize: "16px",
  color: "#1a1a2e",
  marginBottom: "8px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#444",
  lineHeight: "1.6",
};

const callout: React.CSSProperties = {
  backgroundColor: "#fff",
  borderLeft: "4px solid #1a7a8a",
  borderRadius: "4px",
  padding: "16px 20px",
  margin: "20px 0",
};

const calloutText: React.CSSProperties = {
  fontSize: "14px",
  color: "#333",
  lineHeight: "1.6",
  margin: 0,
};

const button: React.CSSProperties = {
  backgroundColor: "#1a7a8a",
  color: "#ffffff",
  padding: "12px 28px",
  borderRadius: "50px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
};

const divider: React.CSSProperties = {
  borderColor: "#e8e8e8",
  margin: "0 40px",
};

const footer: React.CSSProperties = {
  padding: "16px 40px 24px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#aaa",
  textAlign: "center",
};
