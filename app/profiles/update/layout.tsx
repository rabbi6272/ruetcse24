import type { Metadata } from "next";

import { createMetadata } from "../../seo";

export const metadata: Metadata = createMetadata({
  title: "Update Profile",
  description: "Update an existing RUET CSE 24 student profile.",
  path: "/profiles/update",
  noIndex: true,
});

export default function UpdateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
