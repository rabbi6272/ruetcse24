import type { Metadata } from "next";

const fallbackSiteUrl = "https://ruetcsearchive.app";

export const siteConfig = {
  name: "RUET CSE 24",
  shortName: "CSE-24",
  description:
    "The official digital home and student profile directory for the RUET Computer Science and Engineering 2024 batch.",
  url: process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
  ogImage: "/icon.png",
  logo: "/l.png",
  keywords: [
    "RUET CSE 24",
    "RUET CSE",
    "RUET Computer Science and Engineering",
    "Rajshahi University of Engineering and Technology",
    "CSE 2024 batch",
    "RUET student profiles",
    "RUET CSE directory",
  ],
};

export const siteUrl = new URL(siteConfig.url);

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const pageTitle = title || `${siteConfig.name} | Student Profile Directory`;

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      url: canonical,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1729,
          height: 972,
          alt: `${siteConfig.name} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}
