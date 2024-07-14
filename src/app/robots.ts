import type { MetadataRoute } from "next";

// To tell search engine crawlers which URLs they can access on blink-escrow.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://blink-escrow.vercel.app/sitemap.xml",
  };
}

// Output:

// User-Agent: *
// Allow: /
// Sitemap: https://blink-escrow.vercel.app/sitemap.xml
