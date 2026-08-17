import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact/thank-you"],
    },
    sitemap: "https://kijstudio.com/sitemap.xml",
  };
}
