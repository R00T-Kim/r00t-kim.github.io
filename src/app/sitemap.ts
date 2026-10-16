import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { sortedPosts } from "@/data/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/laboratory", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about_me", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/career", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const staticEntries = pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
  const postEntries = sortedPosts().flatMap((post) =>
    routing.locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  );
  return [...staticEntries, ...postEntries];
}
