import type { MetadataRoute } from "next";

// To help search engine crawlers crawl your site more efficiently.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://blink-escrow.vercel.app/",
      lastModified: new Date(),
    },
  ];
}

// Output:

// <urlset xmlns="/schemas/sitemap/0.9">
//   <url>
//     <loc></loc>
//     <lastmod>2024-14-07T15:02:24.021Z</lastmod>
//   </url>
// </urlset>
