import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://r00t-kim.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ko", "en"];
  const lastModified = new Date();

  const pages = [
    { path: "", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/career", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
}
