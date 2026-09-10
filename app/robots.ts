import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://eventfiesta.ch/sitemap.xml",
    host: "https://eventfiesta.ch",
  };
}
