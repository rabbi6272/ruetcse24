import type { Metadata } from "next";

import { createMetadata } from "../../seo";

export const metadata: Metadata = createMetadata({
  title: "Create Profile",
  description: "Create a RUET CSE 24 student profile.",
  path: "/profiles/create",
  noIndex: true,
});

export default function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
