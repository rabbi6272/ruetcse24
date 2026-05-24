import type { Metadata } from "next";

import HomePageClient from "./HomePageClient";
import { absoluteUrl, createMetadata, siteConfig } from "./seo";

const homeDescription =
  "RUET CSE 24 is the student directory and batch archive for the Computer Science and Engineering 2024 cohort of Rajshahi University of Engineering and Technology.";

export const metadata: Metadata = createMetadata({
  title: "RUET CSE 24 Batch Directory",
  description: homeDescription,
  path: "/",
});

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "RUET CSE 24",
    url: absoluteUrl("/"),
    description: homeDescription,
    about: [
      {
        "@type": "CollegeOrUniversity",
        name: "Rajshahi University of Engineering and Technology",
        alternateName: "RUET",
      },
      {
        "@type": "EducationalOccupationalProgram",
        name: "Computer Science and Engineering 2024 Batch",
      },
    ],
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "RUET CSE 24 Student Profiles",
      url: absoluteUrl("/profiles"),
    },
    keywords: siteConfig.keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient />
    </>
  );
}
