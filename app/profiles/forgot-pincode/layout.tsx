import type { Metadata } from "next";

import { createMetadata } from "../../seo";

export const metadata: Metadata = createMetadata({
  title: "Reset Pincode",
  description: "Reset the pincode for a RUET CSE 24 student profile.",
  path: "/profiles/forgot-pincode",
  noIndex: true,
});

export default function ForgotPincodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
