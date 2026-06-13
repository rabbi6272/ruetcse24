import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/profiles"],
        disallow: [
          "/api/",
          "/email-services",
          "/profiles/create",
          "/profiles/update",
          "/profiles/forgot-pincode",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
