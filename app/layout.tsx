import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { lato } from "./ui/fonts";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { createMetadata, siteConfig, siteUrl } from "./seo";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  ...createMetadata({
    description: siteConfig.description,
  }),
  title: {
    default: `${siteConfig.name} | Student Profile Directory`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a2421",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: new URL(siteConfig.logo, siteUrl).toString(),
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/brands.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${lato.className}`}>
        <Providers>
          <Toaster />
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
